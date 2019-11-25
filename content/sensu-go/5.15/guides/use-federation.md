---
title: "Multi-cluster visibility with federation"
linkTitle: "Reaching multi-cluster visibility"
description: "In this guide, you'll learn how to register external clusters using the federation API and access resources across multiple clusters."
weight: 36
version: "5.15"
product: "Sensu Go"
platformContent: False
menu: 
  sensu-go-5.15:
    parent: guides
---

- [When to use federation](#when-to-use-federation)
- [Step 1: Register clusters](#step-1-register-clusters)
  - [Register a single cluster](#register-a-single-cluster)
  - [Register additional clusters](#register-additional-clusters)
- [Step 2: Set up communication between clusters](#step-2-set-up-communication-between-clusters)
- [Step 3: Create etcd replicators](#step-3-create-etcd-replicators)
- [Step 4: Get a unified view of all your clusters in the web UI](#step-4-get-a-unified-view-of-all-your-clusters-in-the-web-ui)

**COMMERCIAL FEATURE**: Access federation in the packaged Sensu Go distribution. For more information, see the [getting started guide][8].

Sensu's [federation API][1] allows you to register external clusters, access resources across multiple clusters via the web UI, and mirror your changes in one cluster to follower clusters.

Federation is not enabled by default. You must create a cluster resource for the federation cluster and [register it](#register-a-single-cluster).

Create, update, and delete clusters using sensuctl [create][5], [edit][6], and [delete][7] commands. Only cluster administrators can register a new cluster, but every user can [query the list of clusters][11].

## When to use federation

Federation allows you to:

- Get a unified view of the health of your infrastructure and services within a single web UI. You can then get details for any resource in any of your clusters.
- Create a configuration resource that automatically replicates to all or a subset of your clusters. This decreases overhead when you need to manage multiple clusters across many regions.
- Schedule a check to run in a round-robin fashion across multiple clusters, providing high-availability, scalable monitoring.

**NEEDED**: Do we need to add more information about when federation is useful? What else does it help users do?

## Step 1: Register clusters

Each registered cluster must have a name and a list of cluster member URLs that correspond to the backend REST API.

### Register a single cluster

You do not need to register the cluster that you are currently operating from (for example, self or local-cluster) unless you want to configure the cluster name.

From `local-cluster`, run `sensuctl create` on the yaml or JSON below to register cluster `us-west-2a`:

{{< language-toggle >}}

{{< highlight yml >}}
api_version: federation/v1
type: Cluster
metadata:
  name: us-west-2a
spec:
  api_urls:
  - http://10.0.0.1:8080
  - http://10.0.0.2:8080
  - http://10.0.0.3:8080
{{< /highlight >}}

{{< highlight json >}}
{
  "api_version": "federation/v1",
  "type": "Cluster",
  "metadata": {
    "name": "us-west-2a"
  },
  "spec": {
    "api-urls": {
      "http://10.0.0.1:8080",
      "http://10.0.0.2:8080",
      "http://10.0.0.3:8080"
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

### Register additional clusters

From `local-cluster`, run `sensuctl create` on the yaml or JSON below to register an additional cluster (with the same API URLs as `local-cluster`) and define the name as `us-west-2b`:

{{< language-toggle >}}

{{< highlight yml >}}
api_version: federation/v1
type: Cluster
metadata:
  name: us-west-2b
spec:
  api_urls:
  - http://10.0.0.4:8080
  - http://10.0.0.5:8080
  - http://10.0.0.6:8080
{{< /highlight >}}

{{< highlight json >}}
{
  "api_version": "federation/v1",
  "type": "Cluster",
  "metadata": {
    "name": "us-west-2b"
  },
  "spec": {
    "api-urls": {
      "http://10.0.0.4:8080",
      "http://10.0.0.5:8080",
      "http://10.0.0.6:8080"
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

## Step 2: Set up communication between clusters

Federation uses JSON web tokens (JWTs) to allow a Sensu agent to communicate with different clusters with the same access token. For this reason, you must enable asymmetric JWTs to use federation.

JWTs are the tokens provided to users during authentication. You can use either the `jwt-private-key-file` or `jwt-public-key-file` attribute to specify the key to use to sign the JWTs.

Learn more about the [`jwt-private-key-file` and `jwt-public-key-file` attributes][4].

**NEEDED**: More explanation about how to use the `jwt-private-key-file` and `jwt-public-key-file` attributes?

## Step 3: Create etcd replicators

After you set up clusters, you can use etcd replicators to manage [RBAC resources][10] in one place and mirror the changes to follower clusters. This allows you to centrally define permissions that apply to all federated clusters (and therefore are automatically replcated across all clusters).

Etcd replicators use the [etcd make-mirror utility][12] for one-way key replication. Our [etcd-replicators reference][2] includes [examples][9] for `Role`, `RoleBinding`, `ClusterRole`, and `ClusterRoleBinding` resources.

## Step 4: Get a unified view of all your clusters in the web UI

After you create clusters using the federation API, you can log in to the Sensu web UI to view them. In the web UI, you can see the status of every federated cluster, as well as metrics like the number of events and entities for each. 

**NEEDED**: Add screenshots of the context switcher in the web UI showing how the federated views work.

Switch between clusters and namespaces in the web UI to get details.


[1]: ../../api/federation/#the-clusters-endpoint
[2]: ../../reference/etcdreplicators
[3]: ../use-apikey-feature
[4]: ../../reference/backend#jwt-attributes
[5]: ../../sensuctl/reference#creating-resources
[6]: ../../sensuctl/reference#updating-resources
[7]: ../../sensuctl/reference#deleting-resources
[8]: ../../getting-started/enterprise
[9]: ../../reference/etcdreplicators#example-etcd-replicators-resources
[10]: ../..reference/rbac
[11]: ../../api/federation#clusters-get
[12]: https://github.com/etcd-io/etcd/blob/master/etcdctl/README.md#make-mirror-options-destination
