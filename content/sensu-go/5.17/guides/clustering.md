---
title: "Run a Sensu cluster"
linkTitle: "Run a Sensu Cluster"
description: "Clustering improves Sensu's availability, reliability, and durability. It can help you cope with the loss of a backend node, prevent data loss, and distribute the network load of agents. Read the guide to configure a Sensu cluster."
weight: 150
version: "5.17"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-5.17:
    parent: guides
---

- [Configure a cluster](#configure-a-cluster)
- [Manage and monitor clusters with sensuctl](#manage-and-monitor-clusters-with-sensuctl)
- [Manage cluster members](#add-a-cluster-member)
- [Cluster security](#cluster-security)
- [Use an external etcd cluster](#use-an-external-etcd-cluster)
- [Troubleshoot clusters](#troubleshoot-clusters)

A Sensu cluster is a group of [at least three][1] sensu-backend nodes, each connected to a shared etcd cluster, using Sensu's embedded etcd or an external etcd cluster.
Creating a Sensu cluster ultimately configures an [etcd cluster][2].

Clustering improves Sensu's availability, reliability, and durability.
It will help you cope with the loss of a backend node, prevent data loss, and distribute the network load of agents.

_**NOTE**: We recommend using a load balancer to evenly distribute agent connections across a cluster._

## Configure a cluster

The sensu-backend arguments for its store mirror the [etcd configuration flags][3], but the Sensu flags are prefixed with `etcd`.
For more detailed descriptions of the different arguments, see the [etcd docs][4] or the [Sensu backend reference][15].

You can configure a Sensu cluster in a couple different ways &mdash; we'll show you a few below &mdash; but you should adhere to some etcd cluster guidelines as well:

> The recommended etcd cluster size is 3, 5 or 7, which is decided by the fault tolerance requirement. A 7-member cluster can provide enough fault tolerance in most cases. While a larger cluster provides better fault tolerance, the write performance reduces since data needs to be replicated to more machines. It is recommended to have an odd number of members in a cluster. Having an odd cluster size doesn't change the number needed for majority, but you gain a higher tolerance for failure by adding the extra member. *[etcd2 Admin Guide][18]*

We also recommend using stable platforms to support your etcd instances (see [etcd's supported platforms][5]).

_**NOTE**: If a cluster member is started before it is configured to join a cluster, the member will persist its prior configuration to disk.
For this reason, you must remove any previously started member's etcd data by stopping sensu-backend and deleting the contents of `/var/lib/sensu/sensu-backend/etcd` before proceeding with cluster configuration._

### Docker

If you prefer to stand up your Sensu cluster within Docker containers, check out the Sensu Go [Docker configuration][7].
This configuration defines three sensu-backend containers and three sensu-agent containers.

### Traditional computer instance

_**NOTE**: The remainder of this guide describes on-disk configuration. If you are using an ephemeral computer instance, you can use `sensu-backend start --help` to see examples of etcd command line flags. The configuration file entries in the rest of this guide translate to `sensu-backend` flags._

#### Sensu backend configuration

The examples in this section are configuration snippets from `/etc/sensu/backend.yml` using a three-node cluster.
The nodes are named `backend-1`, `backend-2` and `backend-3` with IP addresses `10.0.0.1`, `10.0.0.2` and `10.0.0.3`, respectively.

_**NOTE**: This backend configuration assumes you have set up and installed the sensu-backend on all the nodes used in your cluster. Follow the [Install Sensu][14] guide if you have not already done this._

**backend-1**

{{< highlight yml >}}
##
# store configuration for backend-1/10.0.0.1
##
etcd-advertise-client-urls: "http://10.0.0.1:2379"
etcd-listen-client-urls: "http://10.0.0.1:2379"
etcd-listen-peer-urls: "http://0.0.0.0:2380"
etcd-initial-cluster: "backend-1=http://10.0.0.1:2380,backend-2=http://10.0.0.2:2380,backend-3=http://10.0.0.3:2380"
etcd-initial-advertise-peer-urls: "http://10.0.0.1:2380"
etcd-initial-cluster-state: "new"
etcd-initial-cluster-token: ""
etcd-name: "backend-1"
{{< /highlight >}}

**backend-2**

{{< highlight yml >}}
##
# store configuration for backend-2/10.0.0.2
##
etcd-advertise-client-urls: "http://10.0.0.2:2379"
etcd-listen-client-urls: "http://10.0.0.2:2379"
etcd-listen-peer-urls: "http://0.0.0.0:2380"
etcd-initial-cluster: "backend-1=http://10.0.0.1:2380,backend-2=http://10.0.0.2:2380,backend-3=http://10.0.0.3:2380"
etcd-initial-advertise-peer-urls: "http://10.0.0.2:2380"
etcd-initial-cluster-state: "new"
etcd-initial-cluster-token: ""
etcd-name: "backend-2"
{{< /highlight >}}

**backend-3**

{{< highlight yml >}}
##
# store configuration for backend-3/10.0.0.3
##
etcd-advertise-client-urls: "http://10.0.0.3:2379"
etcd-listen-client-urls: "http://10.0.0.3:2379"
etcd-listen-peer-urls: "http://0.0.0.0:2380"
etcd-initial-cluster: "backend-1=http://10.0.0.1:2380,backend-2=http://10.0.0.2:2380,backend-3=http://10.0.0.3:2380"
etcd-initial-advertise-peer-urls: "http://10.0.0.3:2380"
etcd-initial-cluster-state: "new"
etcd-initial-cluster-token: ""
etcd-name: "backend-3"
{{< /highlight >}}

After you configure each node as described in these examples, start each sensu-backend:

{{< highlight shell >}}
sudo systemctl start sensu-backend
{{< /highlight >}}

##### Add Sensu agents to clusters

Each Sensu agent should have the following entries in `/etc/sensu/agent.yml` to ensure the agent is aware of all cluster members.
This allows the agent to reconnect to a working backend if the backend it is currently connected to goes into an unhealthy state.

{{< highlight yml >}}
##
# backend-url configuration for all agents connecting to cluster over ws
##

backend-url:
  - "ws://10.0.0.1:8081"
  - "ws://10.0.0.2:8081"
  - "ws://10.0.0.3:8081"
{{< /highlight >}}

You should now have a highly available Sensu cluster!
Confirm cluster health and try other cluster management commands with [sensuctl][6].

## Manage and monitor clusters with sensuctl

[Sensuctl][17] includes several commands to help you manage and monitor your cluster.
Run `sensuctl cluster -h` for additional help information.

### Get cluster health status

Get cluster health status and etcd alarm information:

{{< highlight shell >}}
sensuctl cluster health

       ID            Name                          Error                           Healthy  
────────────────── ─────────── ─────────────────────────────────────────────────── ─────────
a32e8f613b529ad4   backend-1                                                        true
c3d9f4b8d0dd1ac9   backend-2  dial tcp 10.0.0.2:2379: connect: connection refused   false
c8f63ae435a5e6bf   backend-3                                                        true
{{< /highlight >}}

### Add a cluster member

Add a new member node to an existing cluster:

{{< highlight shell >}}
sensuctl cluster member-add backend-4 https://10.0.0.4:2380

added member 2f7ae42c315f8c2d to cluster

ETCD_NAME="backend-4"
ETCD_INITIAL_CLUSTER="backend-4=https://10.0.0.4:2380,backend-1=https://10.0.0.1:2380,backend-2=https://10.0.0.2:2380,backend-3=https://10.0.0.3:2380"
ETCD_INITIAL_CLUSTER_STATE="existing"
{{< /highlight >}}

### List cluster members

List the ID, name, peer URLs, and client URLs of all nodes in a cluster:

{{< highlight shell >}}
sensuctl cluster member-list

       ID            Name             Peer URLs                Client URLs
────────────────── ─────────── ───────────────────────── ─────────────────────────
a32e8f613b529ad4   backend-1    https://10.0.0.1:2380     https://10.0.0.1:2379  
c3d9f4b8d0dd1ac9   backend-2    https://10.0.0.2:2380     https://10.0.0.2:2379
c8f63ae435a5e6bf   backend-3    https://10.0.0.3:2380     https://10.0.0.3:2379
2f7ae42c315f8c2d   backend-4    https://10.0.0.4:2380     https://10.0.0.4:2379
{{< /highlight >}}

### Remove a cluster member

Remove a faulty or decommissioned member node from a cluster:

{{< highlight shell >}}
sensuctl cluster member-remove 2f7ae42c315f8c2d

Removed member 2f7ae42c315f8c2d from cluster
{{< /highlight >}}

### Replace a faulty cluster member

To replace a faulty cluster member to restore a cluster's health, start by running `sensuctl cluster health` to identify the faulty cluster member.
For a faulty cluster member, the `Error` column will include an error message and the `Healthy` column will list `false`.

In this example, cluster member `backend-4` is faulty:

{{< highlight shell >}}
sensuctl cluster health

       ID            Name                          Error                           Healthy  
────────────────── ─────────── ─────────────────────────────────────────────────── ─────────
a32e8f613b529ad4   backend-1                                                        true
c3d9f4b8d0dd1ac9   backend-2                                                        true
c8f63ae435a5e6bf   backend-3                                                        true
2f7ae42c315f8c2d   backend-4  dial tcp 10.0.0.4:2379: connect: connection refused   false

{{< /highlight >}}

Then, delete the faulty cluster member.
To continue this example, you will delete cluster member `backend-4` using its ID:

{{< highlight shell >}}
sensuctl cluster member-remove 2f7ae42c315f8c2d

Removed member 2f7ae42c315f8c2d from cluster
{{< /highlight >}}

Finally, add a newly created member to the cluster.
You can use the same name and IP address as the faulty member you deleted, with one change to the configuration: specify the `etcd-initial-cluster-state` as `existing`.

{{< highlight yml >}}
etcd-advertise-client-urls: "http://10.0.0.4:2379"
etcd-listen-client-urls: "http://10.0.0.4:2379"
etcd-listen-peer-urls: "http://0.0.0.0:2380"
etcd-initial-cluster: "backend-1=http://10.0.0.1:2380,backend-2=http://10.0.0.2:2380,backend-3=http://10.0.0.3:2380,backend-4=http://10.0.0.4:2380"
etcd-initial-advertise-peer-urls: "http://10.0.0.4:2380"
etcd-initial-cluster-state: "existing"
etcd-initial-cluster-token: ""
etcd-name: "backend-4"
{{< /highlight >}}

If replacing the faulty cluster member does not resolve the problem, see the [etcd operations guide][12] for more information.

### Update a cluster member

Update the peer URLs of a member in a cluster:

{{< highlight shell >}}
sensuctl cluster member-update c8f63ae435a5e6bf https://10.0.0.4:2380

Updated member with ID c8f63ae435a5e6bf in cluster
{{< /highlight >}}

## Cluster security

See [Secure Sensu][16] for information about cluster security.

## Use an external etcd cluster

To use Sensu with an external etcd cluster, you must have etcd 3.3.2 or newer.
To stand up an external etcd cluster, follow etcd's [clustering guide][2] using the same store configuration.

In this example, you will enable client-to-server and peer communication authentication [using self-signed TLS certificates][13].
To start etcd for `backend-1` based on the [three-node configuration example][19]:

{{< highlight shell >}}
etcd \
--listen-client-urls "https://10.0.0.1:2379" \
--advertise-client-urls "https://10.0.0.1:2379" \
--listen-peer-urls "https://10.0.0.1:2380" \
--initial-cluster "backend-1=https://10.0.0.1:2380,backend-2=https://10.0.0.2:2380,backend-3=https://10.0.0.3:2380" \
--initial-advertise-peer-urls "https://10.0.0.1:2380" \
--initial-cluster-state "new" \
--name "backend-1" \
--trusted-ca-file=./ca.pem \
--cert-file=./backend-1.pem \
--key-file=./backend-1-key.pem \
--client-cert-auth \
--peer-trusted-ca-file=./ca.pem \
--peer-cert-file=./backend-1.pem \
--peer-key-file=./backend-1-key.pem \
--peer-client-cert-auth \
--auto-compaction-mode revision \
--auto-compaction-retention 2
{{< /highlight >}}

_**NOTE**: The `auto-compaction-mode` and `auto-compaction-retention` flags are important. Without these settings, your database may quickly reach etcd's maximum database size limit._

To tell Sensu to use this external etcd data source, add the `sensu-backend` flag `--no-embed-etcd` to the original configuration, along with the path to a client certificate created using your CA:

{{< highlight shell >}}
sensu-backend start \
--etcd-trusted-ca-file=./ca.pem \
--etcd-cert-file=./client.pem \
--etcd-key-file=./client-key.pem \
--etcd-client-urls=https://10.0.0.1:2379,https://10.0.0.2:2379,https://10.0.0.3:2379 \
--no-embed-etcd
{{< /highlight >}}

## Troubleshoot clusters

### Failure modes

See the [etcd failure modes documentation][8] for information about cluster failure modes.

### Disaster recovery

See the [etcd recovery guide][9] for disaster recovery information.

[1]: https://etcd.io/docs/v3.4.0/op-guide/runtime-configuration/
[2]: https://etcd.io/docs/v3.4.0/op-guide/clustering/
[3]: https://etcd.io/docs/v3.4.0/op-guide/configuration/
[4]: https://etcd.io/docs/
[5]: https://etcd.io/docs/v3.4.0/platforms/
[6]: #manage-and-monitor-clusters-with-sensuctl
[7]: https://github.com/sensu/sensu-go/blob/master/docker-compose.yaml
[8]: https://etcd.io/docs/v3.4.0/op-guide/failures/
[9]: https://etcd.io/docs/v3.4.0/op-guide/recovery/
[10]: https://github.com/cloudflare/cfssl
[11]: https://etcd.io/docs/v3.4.0/op-guide/clustering/#self-signed-certificates
[12]: https://etcd.io/docs/v3.4.0/op-guide/
[13]: ../securing-sensu/#create-self-signed-certificates
[14]: ../../installation/install-sensu/
[15]: ../../reference/backend/
[16]: ../securing-sensu/
[17]: ../../sensuctl/reference/
[18]: https://github.com/etcd-io/etcd/blob/a621d807f061e1dd635033a8d6bc261461429e27/Documentation/v2/admin_guide.md#optimal-cluster-size
[19]: #sensu-backend-configuration
