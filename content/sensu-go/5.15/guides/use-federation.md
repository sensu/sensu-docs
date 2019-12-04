---
title: "Multi-cluster visibility with federation"
linkTitle: "Reaching Multi-cluster Visibility"
description: "In this guide, you'll learn how federate Sensu clusters and use a single web UI to access resources across those disparate clusters."
weight: 400
version: "5.15"
product: "Sensu Go"
platformContent: False
menu: 
  sensu-go-5.15:
    parent: guides
---

- [What you can do with federation](#what-you-can-do-with-federation)
- [Step 1 Configure backends for TLS](#step-1-configure-backends-for-tls)
- [Step 2 Configure shared token signing keys](#step-2-configure-shared-token-signing-keys)
- [Step 3 Add a cluster role binding and user](#step-3-add-a-cluster-role-binding-and-user)
- [Step 4 Create etcd replicators](#step-4-create-etcd-replicators)
- [Step 5 Register clusters](#step-5-register-clusters)
  - [Register a single cluster](#register-a-single-cluster)
  - [Register additional clusters](#register-additional-clusters)
- [Step 6 Get a unified view of all your clusters in the web UI](#step-6-get-a-unified-view-of-all-your-clusters-in-the-web-ui)
- [Next steps](#next-steps)

**COMMERCIAL FEATURE**: Access federation in the packaged Sensu Go distribution. For more information, see the [getting started guide][8].

Sensu's [federation API][1] allows you to register external clusters, access resources across multiple clusters via the web UI, and mirror your changes in one cluster to follower clusters.

Federation is not enabled by default. You must create a cluster resource for the federation cluster and [register it](#register-a-single-cluster).

Create, update, and delete clusters using sensuctl [create][5], [edit][6], and [delete][7] commands. Only cluster administrators can register a new cluster, but every user can [query the list of clusters][11].

## What you can do with federation

Federation affords visibility into the health of your infrastructure and services across multiple distinct Sensu instances within a single web UI. This is useful when you want to provide a single entry point for Sensu users who need to manage monitoring across multiple distinct physical data centers, cloud regions or providers.

## Configuring federation

Complete federation of multiple Sensu instances is accomplished through a combination of features:

| Feature                             | Provides |
|-------------------------------------|--------------------------------------------------------------------|
| JSON Web Token authentication       | Cross-cluster token authentication using asymmetric key encryption |
| Etcd Replicators                    | Replication of RBAC policy across clusters and/or namespaces       |
| Federation Gateway and APIs         | Configure federation access for cross-cluster visibility in web UI |

The following steps are required to configure these features for unified visibility in a single web UI. For our examples, we'll assume there are three named Sensu clusters we wish to federate:

* `gateway`
* `alpha`
* `beta`

The `gateway` cluster will be the entry-point for operators to manage Sensu resources in the `alpha` and `beta` clusters.

### Step 1 Configure backends for TLS

As federation depends on communication between multiple disparate clusters, working TLS is a prerequisite for successful configuration. This guide assumes that you have provided each backend member with TLS credentials (key and certificate), as well as the CA certificate chain required for one Sensu backend to validate the certificates presented by other backends. If you don't have existing infrastructure for issuing certificates, see our Securing Sensu guide for [our recommended self-signed certificate issuance process][13].

This prerequisite extends to the configuration of the following Sensu backend etcd parameters:

| Backend property             | Note |
|------------------------------|------|
| `etcd-trusted-ca-file`       | Self explanatory. |
| `etcd-cert-file`             | Self explanatory. |
| `etcd-key-file`              | Self explanatory. |
| `etcd-client-cert-auth`      | Strongly recommended to use `true` setting |
| `etcd-advertise-client-urls` | list of https URLs to to advertise for Etcd Replicators, accessible by other backends in the federation e.g. `https://sensu.beta.example.com:2378` |
| `etcd-listen-client-urls`    | list of https URLs to listen on for Etcd Replicators, e.g. `https://0.0.0.0:2379` to listen on port 2739 across all ipv4 interfaces |

_NOTE: You *must* provide non-default values for `etcd-advertise-client-urls` and `etcd-listen-client-urls` backend parameters, as the default values are not suitable for use under federation._

### Step 2 Configure shared token signing keys

Whether federated or stand-alone, Sensu backends issue JSON web tokens (JWTs) to users upon successful authentication. These tokens include a payload which describes the username and group affiliations, used to determine permissions based on configured [RBAC policy][10].

In a federation of Sensu backends, each backend needs to have the same public/private key pair. These asymmetric keys are used to crypotgraphically vouch for the user's identity in the JWT payload. This use of shared JWT keys enables clusters to grant users access to Sensu resources according to their local policies but without requiring User resources to be present uniformly across all clusters in the federation.

By default a Sensu backend automatically generates an asymmetric key pair for signing JWTs and stores it in the etcd database. When configuring federation, you need to generate keys as files on disk so they can be copied to all backends in the federation.

Use use the `openssl` command line tool to generate a P-256 Elliptic Curve private key:

```shell
openssl ecparam -genkey -name prime256v1 -noout -out jwt_private.pem
```

Then generate a public key from the private key:

```shell
openssl ec -in jwt_private.pem -pubout -out jwt_public.pem
```

For this guide, we'll put JWT keys into `/etc/sensu/certs` and use the [`jwt-private-key-file` and `jwt-public-key-file` attributes][4] in `/etc/sensu/backend.yml` to specify the paths to these JWT keys:

{{< highlight yml >}}
jwt-private-key-file: /etc/sensu/certs/jwt_private.pem
jwt-public-key-file: /etc/sensu/certs/jwt_public.pem
{{< /highlight >}}

After updating the backend configuration in each cluster, restart `sensu-backend` for those settings to take effect.

### Step 3 Add a cluster role binding and user

To prove out our configuration, we'll provision a User and a ClusterRoleBinding in the `gateway` cluster.

First, confirm that sensuctl is configured to communicate with the `gateway` cluster using `sensuctl config view` to see the active configuration.

Secondly, create a `federation-viewer` user:

{{< highlight shell >}}
sensuctl user create federation-viewer --interactive
{{< /highlight >}}

When prompted, enter a password for the `federation-viewer` user, and press enter when prompted for groups. Note this password for later as we'll use it to login to the web UI once we've configured RBAC policy replication and registered clusters into our federation.

Next, grant the `federation-viewer` user read-only access through a cluster role binding for the built-in `view` cluster role:

{{< highlight shell >}}
sensuctl cluster-role-binding create federation-viewer-readonly --cluster-role=view --user=federation-viewer
{{< /highlight >}}

Next, you'll configure Etcd Replicators to copy the cluster role bindings and other RBAC policies we've created in the `gateway` cluster to the `alpha` and `beta` clusters.

### Step 4 Create Etcd Replicators

Etcd replicators use the [etcd make-mirror utility][12] for one-way replication of Sensu [RBAC policy resources][10].

In practice this allows you to centrally define RBAC policy on the `gateway` cluster and replicate those resources to other clusters in the federation, ensuring consistent permissions for Sensu users across multiple clusters via the `gateway` web UI.

To get started, configure an Etcd Replicator per-cluster for each of those RBAC policy types, across all namespaces, for each backend in the federation. For example, these Etcd Replicator resources will replicate ClusterRoleBinding resources from `gateway` cluster to two target clusters:

{{< language-toggle >}}

{{< highlight yml >}}
---
api_version: federation/v1
type: EtcdReplicator
metadata:
  name: AlphaClusterRoleBindings
spec:
  ca_cert: "/etc/sensu/certs/ca.pem"
  cert: "/etc/sensu/certs/cert.pem"
  key: "/etc/sensu/certs/key.pem"
  url: https://sensu.alpha.example.com:2379
  api_version: core/v2
  resource: ClusterRoleBinding
  replication_interval_seconds: 30
{{< /highlight >}}

{{< highlight json >}}
{
  "api_version": "federation/v1",
  "type": "EtcdReplicator",
  "metadata": {
    "name": "AlphaClusterRoleBindings"
  },
  "spec": {
    "ca_cert": "/etc/sensu/certs/ca.pem",
    "cert": "/etc/sensu/certs/cert.pem",
    "key": "/etc/sensu/certs/key.pem",
    "url": "https://sensu.alpha.example.com:2379",
    "api_version": "core/v2",
    "resource": "ClusterRoleBinding",
    "replication_interval_seconds": 30
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

{{< language-toggle >}}

{{< highlight yml >}}
---
api_version: federation/v1
type: EtcdReplicator
metadata:
  name: BetaClusterRoleBindings
spec:
  ca_cert: "/etc/sensu/certs/ca.pem"
  cert: "/etc/sensu/certs/cert.pem"
  key: "/etc/sensu/certs/key.pem"
  url: https://sensu.beta.example.com:2379
  api_version: core/v2
  resource: ClusterRoleBinding
  replication_interval_seconds: 30
{{< /highlight >}}

{{< highlight json >}}
{
  "api_version": "federation/v1",
  "type": "EtcdReplicator",
  "metadata": {
    "name": "BetaClusterRoleBindings"
  },
  "spec": {
    "ca_cert": "/etc/sensu/certs/ca.pem",
    "cert": "/etc/sensu/certs/cert.pem",
    "key": "/etc/sensu/certs/key.pem",
    "url": "https://sensu.beta.example.com:2379",
    "api_version": "core/v2",
    "resource": "ClusterRoleBinding",
    "replication_interval_seconds": 30
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

To configure this EtcdReplicator on our `gateway` cluster, first use `sensuctl config view` to verify that `sensuctl` is configured to talk to a `gateway` cluster API. Reconfigure `sensuctl` as necessary.

With the above EtcdReplicator definition written to disk as `AllClusterRoleBindings.yml`, use `cat AllClusterRoleBindings.yml | sensuctl create`  to create the EtdReplicator on the `gateway` cluster.

Our [etcd-replicators reference][2] includes [examples][9] for `Role`, `RoleBinding`, `ClusterRole`, and `ClusterRoleBinding` resources. For a consistent experience, repeat the above example for `Role`, `RoleBinding` and `ClusterRole` resource types.

You can verify that the EtcdReplicator resource is working as expected by reconfiguring `sensuctl` to communicate with the `alpha` and `beta` clusters and issuing the `sensuctl cluster-role-binding list` command. You should see 

### Step 5 Register clusters

In order to become visible in the web UI, a cluster must be registered. Each registered cluster must have a name and a list of one or more cluster member URLs corresponding to the backend REST API.

#### Register a single cluster

With `sensuctl` configured for the `gateway` cluster, run `sensuctl create` on the yaml or JSON below to register cluster `alpha`:

{{< language-toggle >}}

{{< highlight yml >}}
api_version: federation/v1
type: Cluster
metadata:
  name: alpha
spec:
  api_urls:
  - https://sensu.alpha.example.com:8080
{{< /highlight >}}

{{< highlight json >}}
{
  "api_version": "federation/v1",
  "type": "Cluster",
  "metadata": {
    "name": "alpha"
  },
  "spec": {
    "api-urls": [
      "https://sensu.alpha.example.com:8080"
    ]
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

#### Register additional clusters

With `sensuctl` configured for `gateway` cluster, run `sensuctl create` on the yaml or JSON below to register an additional cluster and define the name as `beta`:

{{< language-toggle >}}

{{< highlight yml >}}
api_version: federation/v1
type: Cluster
metadata:
  name: beta
spec:
  api_urls:
  - https://sensu.beta.example.com:8080
{{< /highlight >}}

{{< highlight json >}}
{
  "api_version": "federation/v1",
  "type": "Cluster",
  "metadata": {
    "name": "beta"
  },
  "spec": {
    "api-urls": [
      "https://sensu.alpha.example.com:8080"
    ]
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

_NOTE: When logging into the `gateway` cluster web UI, any namespaces, entities, events and other resources specific to that cluster will be labled as `local-cluster`._

### Step 6 Get a unified view of all your clusters in the web UI

After you create clusters using the federation API, you can log in to the `gateway` Sensu web UI to view them as either the `federation-viewer` user. Switching between namespaces across federated clusters is accomplished using namespace switcher, as shown in the animation below:

<img alt="animated demonstration of federated views in Sensu Web UI" title="Cross-cluster visibility in the Sensu Web UI" src="/images/federation-switcher-animated.gif" width="800 px">

As the `federation-viewer` user is granted only permissions provided by the built-in `view` role, this user should be able to view all resources across all clusters, but not make any changes. Provided you've not changed the permissions of the default `admin` user, that user should be able to view, create, delete and update resources across all clusters as well.

### Next steps

Learn more about configuring RBAC policies in our [RBAC reference documentation][10].

[1]: ../../api/federation/#the-clusters-endpoint
[2]: ../../reference/etcdreplicators
[3]: ../use-apikey-feature
[4]: ../../reference/backend#jwt-attributes
[5]: ../../sensuctl/reference#creating-resources
[6]: ../../sensuctl/reference#updating-resources
[7]: ../../sensuctl/reference#deleting-resources
[8]: ../../getting-started/enterprise
[9]: ../../reference/etcdreplicators#example-etcd-replicators-resources
[10]: ../../reference/rbac
[11]: ../../api/federation#clusters-get
[12]: https://github.com/etcd-io/etcd/blob/master/etcdctl/README.md#make-mirror-options-destination
[13]: ../../guides/securing-sensu/#creating-self-signed-certificates
