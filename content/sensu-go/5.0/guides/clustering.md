---
title: "How to Run a Sensu Cluster"
linkTitle: "Running a Sensu Cluster"
weight: 120
version: "5.0"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-5.0:
    parent: guides
---

## What is a Sensu Cluster?

A Sensu Cluster is a group of [at least 3][1] sensu-backend nodes, each connected to a shared etcd cluster, using Sensu's embedded etcd or an external etcd cluster. Creating a Sensu Cluster ultimately configures an [etcd cluster][2].

## Why use clustering?

Clustering is important to make Sensu more highly available, reliable, and durable. It will help you cope with the loss of a backend node, prevent data loss, and distribute the network load of agents.

**Note:** We recommend using a load balancer to _evenly_ distribute agent connections across the cluster.

## Configuring a cluster

The sensu-backend arguments for its store mirror the [etcd configuration flags][3], however the Sensu flags are prefixed with `etcd`. For more detailed descriptions of the different arguments, you can refer to the [etcd docs][4] or sensu-backend help usage.

You can configure a Sensu cluster in a couple different ways (we'll show you a few below) but it's recommended to adhere to some etcd cluster guidelines as well.

> The recommended etcd cluster size is 3, 5 or 7, which is decided by the fault tolerance requirement. A 7-member cluster can provide enough fault tolerance in most cases. While a larger cluster provides better fault tolerance, the write performance reduces since data needs to be replicated to more machines. It is recommended to have an odd number of members in a cluster. Having an odd cluster size doesn't change the number needed for majority, but you gain a higher tolerance for failure by adding the extra member *(Core OS).*

We also recommend using stable platforms to support your etcd instances (see [Supported Platforms][5]).

### backend.yml

Below are example configuration snippets from `/etc/sensu/backend.yml` on three sensu backends named `backend-1`, `backend-2` and `backend-3` with IP addresses `10.1.0.1`, `10.2.0.0` and `10.3.0.0` respectively.
{{< highlight shell >}}
##
# store configuration for backend-1/10.1.0.1
##
etcd-listen-client-urls: "https://10.1.0.1:2379"
etcd-listen-peer-urls: "https://0.0.0.0:2380"
etcd-initial-cluster: "backend-1=https://10.1.0.1:2380,backend-2=https://10.2.0.1:2380,backend-3=https://10.3.0.1:2380"
etcd-initial-advertise-peer-urls: "https://10.1.0.1:2380"
etcd-initial-cluster-state: "new"
etcd-initial-cluster-token: ""
etcd-name: "backend-1"
{{< /highlight >}}

{{< highlight shell >}}
##
# store configuration for backend-2/10.2.0.1
##
etcd-listen-client-urls: "https://10.2.0.1:2379"
etcd-listen-peer-urls: "https://0.0.0.0:2380"
etcd-initial-cluster: "backend-1=https://10.1.0.1:2380,backend-2=https://10.2.0.1:2380,backend-3=https://10.3.0.1:2380"
etcd-initial-advertise-peer-urls: "https://10.2.0.1:2380"
etcd-initial-cluster-state: "new"
etcd-initial-cluster-token: ""
etcd-name: "backend-2"
{{< /highlight >}}

{{< highlight shell >}}
##
# store configuration for backend-3/10.3.0.1
##
etcd-listen-client-urls: "https://10.3.0.1:2379"
etcd-listen-peer-urls: "https://0.0.0.0:2380"
etcd-initial-cluster: "backend-1=https://10.1.0.1:2380,backend-2=https://10.2.0.1:2380,backend-3=https://10.3.0.1:2380"
etcd-initial-advertise-peer-urls: "https://10.3.0.1:2380"
etcd-initial-cluster-state: "new"
etcd-initial-cluster-token: ""
etcd-name: "backend-3"
{{< /highlight >}}

Using this configuration file at the start up of each sensu-backend accordingly, you should have a highly available Sensu Cluster! You can verify its health and try other cluster management commands using [sensuctl][6].

### docker-compose.yml

If you'd prefer to stand up your Sensu Cluster within docker containers, check out the sensu-go [docker configuration][7]. This configuration defines 3 sensu-backend containers and 3 sensu-agent containers.

## Sensuctl

Sensuctl has several commands to help you manage and monitor your cluster. See `sensuctl cluster -h` for additional help usage. If you have not installed and configured sensuctl, our [installation and configuration guide][14] will help you.

### Cluster health

Get cluster health status and etcd alarm information.

{{< highlight shell >}}
$ sensuctl cluster health
         ID            Name      Error   Healthy  
 ────────────────── ─────────── ─────── ─────────
  a32e8f613b529ad4   backend-0           true
  c3d9f4b8d0dd1ac9   backend-1    wat    false
  c8f63ae435a5e6bf   backend-2           true
{{< /highlight >}}

### Add a cluster member

Add a new member node to an existing cluster.

#TODO: Test results of adding a cluster member but not updating disk configuration, restarting backend.

{{< highlight shell >}}
$ sensuctl cluster member-add backend-4 https://10.4.0.1:2380
added member 2f7ae42c315f8c2d to cluster

ETCD_NAME="backend-3"
ETCD_INITIAL_CLUSTER="backend-1=https://10.1.0.1:2380,backend-2=https://10.2.0.1:2380,backend-3=https://10.3.0.1:2380",backend-4=https://10.4.0.1:2380"
ETCD_INITIAL_CLUSTER_STATE="existing"
{{< /highlight >}}

### List cluster members

List the ID, name, peer urls, and client urls of all nodes in a cluster.

{{< highlight shell >}}
$ sensuctl cluster member-list
         ID            Name             Peer URLs                Client URLs
 ────────────────── ─────────── ───────────────────────── ─────────────────────────
  a32e8f613b529ad4   backend-1    https://10.1.0.1:2380     https://10.1.0.1:2379  
  c3d9f4b8d0dd1ac9   backend-2    https://10.2.0.1:2380     https://10.2.0.1:2379
  c8f63ae435a5e6bf   backend-3    https://10.3.0.1:2380     https://10.3.0.1:2379
  2f7ae42c315f8c2d   backend-4    https://10.4.0.1:2380     https://10.4.0.1:2379
{{< /highlight >}}

### Remove a cluster member

Remove a faulty or decommissioned member node from a cluster.

{{< highlight shell >}}
$ sensuctl cluster member-remove 2f7ae42c315f8c2d
Removed member 2f7ae42c315f8c2d from cluster
{{< /highlight >}}

### Update a cluster member

#TODO: Test results of doing this and the impact on configurtion on disk, then reload sensu-backend.

Update the peer urls of a member in a cluster.

{{< highlight shell >}}
$ sensuctl cluster member-update c8f63ae435a5e6bf https://10.4.0.1:2380
Updated member with ID c8f63ae435a5e6bf in cluster
{{< /highlight >}}

## Troubleshooting

### Failures modes

See [https://coreos.com/etcd/docs/latest/op-guide/failures.html][8]

### Disaster recovery

See [https://coreos.com/etcd/docs/latest/op-guide/recovery.html][9]

## Security

### Creating self-signed certificates

We will use the [cfssl][10] tool to generate our self-signed certificates.

The first step is to create a **Certificate Authority (CA)**. In order to keep things simple, we will generate all our clients and peer certificates using this CA but you might eventually want to  create distinct CA.

{{< highlight shell >}}
echo '{"CN":"CA","key":{"algo":"rsa","size":2048}}' | cfssl gencert -initca - | cfssljson -bare ca -
echo '{"signing":{"default":{"expiry":"43800h","usages":["signing","key encipherment","server auth","client auth"]}}}' > ca-config.json
{{< /highlight >}}

Then, using that CA, we can generate certificates and keys for each peer (backend server) by specifying their **Common Name (CN)** (here `backend-0`) and their **hosts** (here `10.0.0.1` & `backend-0`). The files `backend-0-key.pem`, `backend-0.csr` and `backend-0.pem` will be created.

{{< highlight shell >}}
export ADDRESS=10.0.0.1,backend-0
export NAME=backend-0
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -ca=ca.pem -ca-key=ca-key.pem -hostname="$ADDRESS" -profile=peer - | cfssljson -bare $NAME
{{< /highlight >}}

We will also create generate a *client* certificate that can be used by clients to connect to the etcd client URL. This time, we don't need to specify an address but simply a **Common Name (CN)** (here `client`). The files `client-key.pem`, `client.csr` and `client.pem` will be created.

{{< highlight shell >}}
export NAME=client
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -ca=ca.pem -ca-key=ca-key.pem -hostname="" -profile=client - | cfssljson -bare $NAME
{{< /highlight >}}

See [https://coreos.com/os/docs/latest/generate-self-signed-certificates.html][11] for detailed instructions.

### Client-to-server transport security with HTTPS

{{< highlight shell >}}
sensu-backend start \
--etcd-listen-client-urls=https://127.0.0.1:2379 \
--etcd-trusted-ca-file=./ca.pem \
--etcd-cert-file=./client.pem \
--etcd-key-file=./client-key.pem
{{< /highlight >}}

Validating with curl:

{{< highlight shell >}}
curl --cacert ./ca.pem https://127.0.0.1:2379/v2/keys/foo \
-XPUT -d value=bar
{{< /highlight >}}

### Client-to-server authentication with HTTPS client certificates

{{< highlight shell >}}
sensu-backend start \
--etcd-listen-client-urls=https://127.0.0.1:2379 \
--etcd-client-cert-auth \
--etcd-trusted-ca-file=./ca.pem \
--etcd-cert-file=./backend-0.pem \
--etcd-key-file=./backend-0-key.pem
{{< /highlight >}}

Validating with curl, with a different certificate and key:

{{< highlight shell >}}
curl --cacert ca.pem --cert client.pem \
--key client-key.pem \
-L https://127.0.0.1:2379/v2/keys/foo -XPUT -d value=bar
{{< /highlight >}}

### Peer communication authentication with HTTPS client certificates

**backend-0**

{{< highlight shell >}}
sensu-backend start \
--etcd-listen-client-urls http://127.0.0.1:2379 \
--etcd-listen-peer-urls https://10.0.0.1:2380 \
--etcd-initial-advertise-peer-urls https://10.0.0.1:2380 \
--etcd-initial-cluster backend-0=https://10.0.0.1:2380,backend-1=https://10.1.0.1:2380,backend-2=https://10.2.0.1:2380 \
--etcd-initial-cluster-token "sensu" \
--etcd-initial-cluster-state "new" \
--etcd-name backend-0 \
--etcd-peer-client-cert-auth \
--etcd-peer-trusted-ca-file=./ca.pem \
--etcd-peer-cert-file=./backend-0.pem \
--etcd-peer-key-file=./backend-0-key.pem
{{< /highlight >}}

**backend-1**

{{< highlight shell >}}
sensu-backend start \
--etcd-listen-client-urls http://127.0.0.1:2379 \
--etcd-listen-peer-urls https://10.1.0.1:2380 \
--etcd-initial-advertise-peer-urls https://10.1.0.1:2380 \
--etcd-initial-cluster backend-0=https://10.0.0.1:2380,backend-1=https://10.1.0.1:2380,backend-2=https://10.2.0.1:2380 \
--etcd-initial-cluster-token "sensu" \
--etcd-initial-cluster-state "new" \
--etcd-name backend-1 \
--etcd-peer-client-cert-auth \
--etcd-peer-trusted-ca-file=./ca.pem \
--etcd-peer-cert-file=./backend-1.pem \
--etcd-peer-key-file=./backend-1-key.pem
{{< /highlight >}}

**backend-2**

{{< highlight shell >}}
sensu-backend start \
--etcd-listen-client-urls http://127.0.0.1:2379 \
--etcd-listen-peer-urls https://10.2.0.1:2380 \
--etcd-initial-advertise-peer-urls https://10.2.0.1:2380 \
--etcd-initial-cluster backend-0=https://10.0.0.1:2380,backend-1=https://10.1.0.1:2380,backend-2=https://10.2.0.1:2380 \
--etcd-initial-cluster-token "sensu" \
--etcd-initial-cluster-state "new" \
--etcd-name backend-2 \
--etcd-peer-client-cert-auth \
--etcd-peer-trusted-ca-file=./ca.pem \
--etcd-peer-cert-file=./backend-2.pem \
--etcd-peer-key-file=./backend-2-key.pem
{{< /highlight >}}

## Using an external etcd cluster

To stand up an external etcd cluster, you can follow etcd's [Clustering Guide][12] using the same store configuration. 

In this example, we will enable client-to-server and peer communication authentication, [using self-signed TLS certificates][13]. Below is how you would start etcd for `backend-0` from our 3 node configuration example above.

{{< highlight shell >}}
etcd \
--listen-client-urls "https://10.0.0.1:2379" \
--advertise-client-urls "https://10.0.0.1:2379" \
--listen-peer-urls "https://10.0.0.1:2380" \
--initial-cluster "backend-0=https://10.0.0.1:2380,backend-1=https://10.1.0.1:2380,backend-2=https://10.2.0.1:2380" \
--initial-advertise-peer-urls "https://10.0.0.1:2380" \
--initial-cluster-state "new" \
--name "backend-0" \
--trusted-ca-file=./ca.pem \
--cert-file=./backend-0.pem \
--key-file=./backend-0-key.pem \
--client-cert-auth \
--peer-trusted-ca-file=./ca.pem \
--peer-cert-file=./backend-0.pem \
--peer-key-file=./backend-0-key.pem \
--peer-client-cert-auth
{{< /highlight >}}

In order to inform Sensu that you'd like to use this external etcd data source, add the `sensu-backend` flag `--no-embed-etcd` to the original configuration, along with the path to a client certificate created using our CA.

{{< highlight shell >}}
sensu-backend start \
--etcd-trusted-ca-file=./ca.pem \
--etcd-cert-file=./client.pem \
--etcd-key-file=./client-key.pem \
--etcd-listen-client-urls=https://10.0.0.1:2379,https://10.1.0.1:2379,https://10.2.0.1:2379 \
--no-embed-etcd
{{< /highlight >}}

[1]: https://coreos.com/etcd/docs/latest/v2/admin_guide.html#optimal-cluster-size
[2]: https://coreos.com/etcd/docs/latest/v2/clustering.html
[3]: https://coreos.com/etcd/docs/latest/v2/configuration.html
[4]: https://coreos.com/etcd/docs/latest/
[5]: https://coreos.com/etcd/docs/latest/op-guide/supported-platform.html
[6]: #sensuctl
[7]: https://github.com/sensu/sensu-go/blob/master/docker-compose.yaml
[8]: https://coreos.com/etcd/docs/latest/op-guide/failures.html
[9]: https://coreos.com/etcd/docs/latest/op-guide/recovery.html
[10]: https://github.com/cloudflare/cfssl
[11]: https://coreos.com/os/docs/latest/generate-self-signed-certificates.html
[12]: https://coreos.com/etcd/docs/latest/op-guide/clustering.html
[13]: #creating-self-signed-certificates
[14]: ../../getting-started/installation-and-configuration/
