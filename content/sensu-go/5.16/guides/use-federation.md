---
title: "Multi-cluster visibility with federation"
linkTitle: "Reach Multi-cluster Visibility"
description: "With Sensu's federation capabilities, you can access and manage resources across multiple clusters via the web UI and mirror changes in one cluster to follower clusters. In this guide, you'll learn how to federate Sensu clusters."
weight: 220
version: "5.16"
product: "Sensu Go"
platformContent: False
menu: 
  sensu-go-5.16:
    parent: guides
---

- [What you can do with federation](#what-you-can-do-with-federation)
- [Configure federation](#configure-federation)
  - [Step 1 Configure backends for TLS](#step-1-configure-backends-for-tls)
  - [Step 2 Configure shared token signing keys](#step-2-configure-shared-token-signing-keys)
  - [Step 3 Add a cluster role binding and user](#step-3-add-a-cluster-role-binding-and-user)
  - [Step 4 Create etcd replicators](#step-4-create-etcd-replicators)
  - [Step 5 Register clusters](#step-5-register-clusters): [Register a single cluster](#register-a-single-cluster) | [Register additional clusters](#register-additional-clusters)
  - [Step 6 Get a unified view of all your clusters in the web UI](#step-6-get-a-unified-view-of-all-your-clusters-in-the-web-ui)
- [Next steps](#next-steps)

**COMMERCIAL FEATURE**: Access federation in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][8].

Sensu's [federation API][1] allows you to register external clusters, access resources across multiple clusters via the web UI, and mirror your changes in one cluster to follower clusters.

Federation is not enabled by default. You must create a cluster resource for the federation cluster and [register it][14].

Create, update, and delete clusters using sensuctl [create][5], [edit][6], and [delete][7] commands.
Only cluster administrators can register a new cluster, but every user can [query the list of clusters][11].

## What you can do with federation

Federation affords visibility into the health of your infrastructure and services across multiple distinct Sensu instances within a single web UI.
This is useful when you want to provide a single entry point for Sensu users who need to manage monitoring across multiple distinct physical data centers, cloud regions, or providers.

## Configure federation

Complete federation of multiple Sensu instances relies on a combination of features:

| Feature                             | Purpose in federation |
|-------------------------------------|--------------------------------------------------------------------|
| JSON Web Token (JWT) authentication | Cross-cluster token authentication using asymmetric key encryption |
| etcd replicators                    | Replicate RBAC policy across clusters and namespaces |
| Federation Gateway and APIs         | Configure federation access for cross-cluster visibility in web UI |

The following steps are required to configure these features.
Our scenario assumes that we wish to federate three named Sensu clusters:

| Cluster name | Hostname |
|--------------|-----------------------|
| `gateway` | sensu.gateway.example.com |
| `alpha` | sensu.alpha.example.com |
| `beta` | sensu.beta.example.com |

In this scenario, the `gateway` cluster will be the entry point for operators to manage Sensu resources in the `alpha` and `beta` clusters.
This guide assumes a single sensu-backend in each cluster, but named clusters comprised of multiple sensu-backends are supported.

Upon completion of these steps, you'll be able to browse events, entities, checks and other resources in the `gateway`, `alpha` and `beta` clusters from the `gateway` cluster web UI.

This diagram depicts the federation relationship documented in this guide:

<!-- Federation diagram source: https://www.lucidchart.com/documents/edit/1b676df9-534e-40e4-9881-6313013ecd28/n~8S.VTyl5JQ -->
<a href="/images/federation-guide-diagram.png"><img alt="Diagram depicting this guide's example federation architecture" src="/images/federation-guide-diagram.png" width="800 px"></a>

### Step 1 Configure backends for TLS

Because federation depends on communication with multiple disparate clusters, working TLS is required for successful federated operation.

To ensure that cluster members can validate one another, certificates for each cluster member should include the IP addresses and/or hostnames specified in the values of sensu-backend `etcd-advertise-client-urls`, `etcd-advertise-peer-urls`, and `etcd-initial-advertise-peer-urls` parameters.
In addition to the certificate's [Common Name (CN)][15], [Subject Alternative Names (SANs)][16] are also honored for validation.

To continue with this guide, make sure you have the required TLS credentials in place:

* PEM-formatted X.509 certificate and corresponding private key copied to each cluster member
* Corresponding CA certificate chain copied to each cluster member

If you don't have existing infrastructure for issuing certificates, see [Secure Sensu][13] for our recommended self-signed certificate issuance process.

This prerequisite extends to configuring the following Sensu backend etcd parameters:

| Backend property             | Note |
|------------------------------|------|
| `etcd-cert-file`             | Path to certificate used for TLS on etcd client/peer communications.  |
| `etcd-key-file`              | Path to key corresponding with `etcd-cert-file` certificate. |
| `etcd-trusted-ca-file`       | Path to CA certificate chain file. This CA certificate chain must be usable to validate certificates for all backends in the federation. |
| `etcd-client-cert-auth`      | Enforces certificate validation to authenticate etcd replicator connections. We recommend setting to `true`. |
| `etcd-advertise-client-urls` | List of https URLs to advertise for etcd replicators, accessible by other backends in the federation (e.g. `https://sensu.beta.example.com:2379`). |
| `etcd-listen-client-urls`    | List of https URLs to listen on for etcd replicators (e.g. `https://0.0.0.0:2379` to listen on port 2379 across all ipv4 interfaces). |

_**NOTE**: You *must* provide non-default values for the `etcd-advertise-client-urls` and `etcd-listen-client-urls` backend parameters. The default values are not suitable for use under federation._

### Step 2 Configure shared token signing keys

Whether federated or standalone, Sensu backends issue JSON Web Tokens (JWTs) to users upon successful authentication.
These tokens include a payload that describes the username and group affiliations.
The payload is used to determine permissions based on the configured [RBAC policy][10].

In a federation of Sensu backends, each backend needs to have the same public/private key pair.
These asymmetric keys are used to crypotgraphically vouch for the user's identity in the JWT payload.
This use of shared JWT keys enables clusters to grant users access to Sensu resources according to their local policies but without requiring user resources to be present uniformly across all clusters in the federation.

By default, a Sensu backend automatically generates an asymmetric key pair for signing JWTs and stores it in the etcd database.
When configuring federation, you need to generate keys as files on disk so they can be copied to all backends in the federation.

Use use the `openssl` command line tool to generate a P-256 elliptic curve private key:

{{< highlight shell >}}
openssl ecparam -genkey -name prime256v1 -noout -out jwt_private.pem
{{< /highlight >}}

Then generate a public key from the private key:

{{< highlight shell >}}
openssl ec -in jwt_private.pem -pubout -out jwt_public.pem
{{< /highlight >}}

For this example, you'll put JWT keys into `/etc/sensu/certs` on each cluster backend, and use the [`jwt-private-key-file` and `jwt-public-key-file` attributes][4] in `/etc/sensu/backend.yml` to specify the paths to these JWT keys:

{{< highlight yml >}}
jwt-private-key-file: /etc/sensu/certs/jwt_private.pem
jwt-public-key-file: /etc/sensu/certs/jwt_public.pem
{{< /highlight >}}

After updating the backend configuration in each cluster, restart `sensu-backend` so that your settings take effect:
{{< highlight shell >}}
sensu-backend start
{{< /highlight >}}

### Step 3 Add a cluster role binding and user

To test your configuration, provision a User and a ClusterRoleBinding in the `gateway` cluster.

First, confirm that sensuctl is configured to communicate with the `gateway` cluster using `sensuctl config view` to see the active configuration:

{{< highlight shell >}}
=== Active Configuration
API URL:   https://sensu.gateway.example.com:8080
Namespace: default
Format:    tabular
Username:  admin
{{< /highlight >}}

Second, create a `federation-viewer` user:

{{< highlight shell >}}
sensuctl user create federation-viewer --interactive
{{< /highlight >}}

When prompted, enter a password for the `federation-viewer` user.
When prompted for groups, press enter. Note the `federation-viewer` password you entered &mdash; you'll use it to log in to the web UI after you configure RBAC policy replication and registered clusters into your federation.

Next, grant the `federation-viewer` user read-only access through a cluster role binding for the built-in `view` cluster role:

{{< highlight shell >}}
sensuctl cluster-role-binding create federation-viewer-readonly --cluster-role=view --user=federation-viewer
{{< /highlight >}}

In step 4, you'll configure etcd replicators to copy the cluster role bindings and other RBAC policies you created in the `gateway` cluster to the `alpha` and `beta` clusters.

### Step 4 Create etcd replicators

Etcd replicators use the [etcd make-mirror utility][12] for one-way replication of Sensu [RBAC policy resources][10].

This allows you to centrally define RBAC policy on the `gateway` cluster and replicate those resources to other clusters in the federation, ensuring consistent permissions for Sensu users across multiple clusters via the `gateway` web UI.

To get started, configure one etcd replicator per cluster for each of those RBAC policy types, across all namespaces, for each backend in the federation.
For example, these etcd replicator resources will replicate ClusterRoleBinding resources from  the`gateway` cluster to two target clusters:

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

To configure this etcd replicator on your `gateway` cluster, use `sensuctl config view` to verify that `sensuctl` is configured to talk to a `gateway` cluster API. Reconfigure `sensuctl` if needed.

Write these EtcdReplicator definitions written to disk and use `sensuctl create -f` to apply them to the `gateway` cluster.

For a consistent experience, repeat the `ClusterRoleBinding` example in this guide for `Role`, `RoleBinding` and `ClusterRole` resource types.
The [etcd replicators reference][2] includes [examples][9] you can follow for `Role`, `RoleBinding`, `ClusterRole`, and `ClusterRoleBinding` resources.

To verify that the EtcdReplicator resource is working as expected, reconfigure `sensuctl` to communicate with the `alpha` and then `beta` clusters, issuing the `sensuctl cluster-role-binding list` command for each.
You should see the `federation-viewer-readonly` binding created in step 3 listed in the output from each cluster:

{{< highlight shell >}}
$ sensuctl cluster-role-binding info federation-viewer-readonly
=== federation-viewer-readonly
Name:         federation-viewer-readonly
Cluster Role: view
Subjects:
  Users:      federation-viewer
{{< /highlight >}}

### Step 5 Register clusters

Clusters must be registered to become visible in the web UI. Each registered cluster must have a name and a list of one or more cluster member URLs corresponding to the backend REST API.

_**NOTE**: Individual Cluster resources may list the API URLs for a single stand-alone backend or multiple backends which are members of the same etcd cluster. Creating a Cluster resource which lists multiple backends not belonging to the same cluster will result in unexpected behavior._

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
    "api_urls": [
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
    "api_urls": [
      "https://sensu.alpha.example.com:8080"
    ]
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

_**NOTE**: When logging into the `gateway` cluster web UI, any namespaces, entities, events, and other resources specific to that cluster will be labeled as `local-cluster`._

### Step 6 Get a unified view of all your clusters in the web UI

After you create clusters using the federation API, you can log in to the `gateway` Sensu web UI to view them as the `federation-viewer` user.
Use the namespace switcher to change between namespaces across federated clusters:

<img alt="Animated demonstration of federated views in Sensu Web UI" title="Cross-cluster visibility in the Sensu web UI" src="/images/federation-switcher-animated.gif" width="800 px">

Because the `federation-viewer` user is granted only permissions provided by the built-in `view` role, this user should be able to view all resources across all clusters but should not be able to make any changes.
If you haven't changed the permissions of the default `admin` user, that user should be able to view, create, delete, and update resources across all clusters.

## Next steps

Learn more about configuring RBAC policies in our [RBAC reference documentation][10].

[1]: ../../api/federation/#the-clusters-endpoint
[2]: ../../reference/etcdreplicators/
[3]: ../use-apikey-feature/
[4]: ../../reference/backend#jwt-attributes
[5]: ../../sensuctl/reference#create-resources
[6]: ../../sensuctl/reference#update-resources
[7]: ../../sensuctl/reference#delete-resources
[8]: ../../getting-started/enterprise/
[9]: ../../reference/etcdreplicators#example-etcdreplicator-resources
[10]: ../../reference/rbac/
[11]: ../../api/federation#clusters-get
[12]: https://github.com/etcd-io/etcd/blob/master/etcdctl/README.md#make-mirror-options-destination
[13]: ../../guides/securing-sensu/#create-self-signed-certificates
[14]: #register-a-single-cluster
[15]: https://support.dnsimple.com/articles/what-is-common-name/
[16]: https://support.dnsimple.com/articles/what-is-ssl-san/
