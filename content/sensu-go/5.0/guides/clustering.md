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

_NOTE: We recommend using a load balancer to evenly distribute agent connections across the cluster._

## Configuring a cluster

The sensu-backend arguments for its store mirror the [etcd configuration flags][3], however the Sensu flags are prefixed with `etcd`. For more detailed descriptions of the different arguments, you can refer to the [etcd docs][4] or sensu-backend help usage.

You can configure a Sensu cluster in a couple different ways (we'll show you a few below) but it's recommended to adhere to some etcd cluster guidelines as well.

> The recommended etcd cluster size is 3, 5 or 7, which is decided by the fault tolerance requirement. A 7-member cluster can provide enough fault tolerance in most cases. While a larger cluster provides better fault tolerance, the write performance reduces since data needs to be replicated to more machines. It is recommended to have an odd number of members in a cluster. Having an odd cluster size doesn't change the number needed for majority, but you gain a higher tolerance for failure by adding the extra member *(Core OS).*

We also recommend using stable platforms to support your etcd instances (see [Supported Platforms][5]).

### Docker

If you'd prefer to stand up your Sensu Cluster within docker containers, check out the sensu-go [docker configuration][7]. This configuration defines 3 sensu-backend containers and 3 sensu-agent containers.

### Traditional Computer Instance

_NOTE: The remainder of this guide uses on disk configuration. If you are using an ephemeral computer instance, you can use `sensu-backend start help` to see examples of etcd command line flags. The below configuration file entries will translate to sensu-backend flags._

#### Sensu Backend Configuration

Below are example configuration snippets from `/etc/sensu/backend.yml` using a 3 node cluster. The nodes are named `backend-1`, `backend-2` and `backend-3` with IP addresses `10.0.0.1`, `10.0.0.2` and `10.0.0.3`, respectively.

_NOTE: This backend configuration assumes you have setup and installed the sensu-backend on all the nodes you will use in your cluster. You can use our [installation and configuration guide][14] guide if you have not done so_

**backend-1**

{{< highlight shell >}}
##
# store configuration for backend-1/10.0.0.1
##
etcd-advertise-client-urls: "https://10.0.0.1:2379"
etcd-listen-client-urls: "http://10.0.0.1:2379"
etcd-listen-peer-urls: "http://0.0.0.0:2380"
etcd-initial-cluster: "backend-1=http://10.0.0.1:2380,backend-2=http://10.0.0.2:2380,backend-3=http://10.0.0.3:2380"
etcd-initial-advertise-peer-urls: "http://10.0.0.1:2380"
etcd-initial-cluster-state: "new"
etcd-initial-cluster-token: ""
etcd-name: "backend-1"
{{< /highlight >}}

**backend-2**

{{< highlight shell >}}
##
# store configuration for backend-2/10.0.0.2
##
etcd-advertise-client-urls: "https://10.0.0.2:2379"
etcd-listen-client-urls: "http://10.0.0.2:2379"
etcd-listen-peer-urls: "http://0.0.0.0:2380"
etcd-initial-cluster: "backend-1=http://10.0.0.1:2380,backend-2=http://10.0.0.2:2380,backend-3=http://10.0.0.3:2380"
etcd-initial-advertise-peer-urls: "http://10.0.0.2:2380"
etcd-initial-cluster-state: "new"
etcd-initial-cluster-token: ""
etcd-name: "backend-2"
{{< /highlight >}}

**backend-3**

{{< highlight shell >}}
##
# store configuration for backend-3/10.0.0.3
##
etcd-advertise-client-urls: "https://10.0.0.3:2379"
etcd-listen-client-urls: "http://10.0.0.3:2379"
etcd-listen-peer-urls: "http://0.0.0.0:2380"
etcd-initial-cluster: "backend-1=http://10.0.0.1:2380,backend-2=http://10.0.0.2:2380,backend-3=http://10.0.0.3:2380"
etcd-initial-advertise-peer-urls: "http://10.0.0.3:2380"
etcd-initial-cluster-state: "new"
etcd-initial-cluster-token: ""
etcd-name: "backend-3"
{{< /highlight >}}

Once each node has the configuration described above, start each sensu-backend:

{{< highlight shell >}}
sudo systemctl start sensu-backend
{{< /highlight >}}

You should now have a highly available Sensu Cluster! You can verify its health and try other cluster management commands using [sensuctl][6].

## Sensuctl

Sensuctl has several commands to help you manage and monitor your cluster. See `sensuctl cluster -h` for additional help usage. If you have not installed and configured sensuctl, our [installation and configuration guide][14] will help you.

### Cluster health

Get cluster health status and etcd alarm information.

{{< highlight shell >}}
$ sensuctl cluster health
         ID            Name                          Error                           Healthy  
 ────────────────── ─────────── ─────────────────────────────────────────────────── ─────────
  a32e8f613b529ad4   backend-1                                                        true
  c3d9f4b8d0dd1ac9   backend-2  dial tcp 10.0.0.2:2379: connect: connection refused   false
  c8f63ae435a5e6bf   backend-3                                                        true
{{< /highlight >}}

### Add a cluster member

Add a new member node to an existing cluster.

{{< highlight shell >}}
$ sensuctl cluster member-add backend-4 https://10.0.0.4:2380
added member 2f7ae42c315f8c2d to cluster

ETCD_NAME="backend-4"
ETCD_INITIAL_CLUSTER="backend-4=https://10.0.0.4:2380,backend-1=https://10.0.0.1:2380,backend-2=https://10.0.0.2:2380,backend-3=https://10.0.0.3:2380"
ETCD_INITIAL_CLUSTER_STATE="existing"
{{< /highlight >}}

### List cluster members

List the ID, name, peer urls, and client urls of all nodes in a cluster.

{{< highlight shell >}}
$ sensuctl cluster member-list
         ID            Name             Peer URLs                Client URLs
 ────────────────── ─────────── ───────────────────────── ─────────────────────────
  a32e8f613b529ad4   backend-1    https://10.0.0.1:2380     https://10.0.0.1:2379  
  c3d9f4b8d0dd1ac9   backend-2    https://10.0.0.2:2380     https://10.0.0.2:2379
  c8f63ae435a5e6bf   backend-3    https://10.0.0.3:2380     https://10.0.0.3:2379
  2f7ae42c315f8c2d   backend-4    https://10.0.0.4:2380     https://10.0.0.4:2379
{{< /highlight >}}

### Remove a cluster member

Remove a faulty or decommissioned member node from a cluster.

{{< highlight shell >}}
$ sensuctl cluster member-remove 2f7ae42c315f8c2d
Removed member 2f7ae42c315f8c2d from cluster
{{< /highlight >}}

### Update a cluster member

Update the peer urls of a member in a cluster.

{{< highlight shell >}}
$ sensuctl cluster member-update c8f63ae435a5e6bf https://10.0.0.4:2380
Updated member with ID c8f63ae435a5e6bf in cluster
{{< /highlight >}}

## Security

### Creating self-signed certificates

We will use the [cfssl][10] tool to generate our self-signed certificates.

The first step is to create a **Certificate Authority (CA)**. In order to keep things simple, we will generate all our clients and peer certificates using this CA but you might eventually want to create distinct CA.

{{< highlight shell >}}
echo '{"CN":"CA","key":{"algo":"rsa","size":2048}}' | cfssl gencert -initca - | cfssljson -bare ca -
echo '{"signing":{"default":{"expiry":"43800h","usages":["signing","key encipherment","server auth","client auth"]}}}' > ca-config.json
{{< /highlight >}}

Then, using that CA, we can generate certificates and keys for each peer (backend server) by specifying their **Common Name (CN)** and their **hosts**. A `*.pem`, `*.csr` and `*.pem` will be created for each backend.

{{< highlight shell >}}
export ADDRESS=10.0.0.1,backend-1
export NAME=backend-1
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -ca=ca.pem -ca-key=ca-key.pem -hostname="$ADDRESS,127.0.0.1,::" -profile=peer - | cfssljson -bare $NAME

export ADDRESS=10.0.0.2,backend-2
export NAME=backend-2
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -ca=ca.pem -ca-key=ca-key.pem -hostname="$ADDRESS,127.0.0.1,::" -profile=peer - | cfssljson -bare $NAME

export ADDRESS=10.0.0.3,backend-3
export NAME=backend-3
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -ca=ca.pem -ca-key=ca-key.pem -hostname="$ADDRESS,127.0.0.1,::" -profile=peer - | cfssljson -bare $NAME
{{< /highlight >}}

We will also create generate a *client* certificate that can be used by clients to connect to the etcd client URL. This time, we don't need to specify an address but simply a **Common Name (CN)** (here `client`). The files `client-key.pem`, `client.csr` and `client.pem` will be created.

{{< highlight shell >}}
export NAME=client
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -ca=ca.pem -ca-key=ca-key.pem -hostname="" -profile=client - | cfssljson -bare $NAME
{{< /highlight >}}

See [Generating Self Signed Certificates][11] for detailed instructions.

Once done, you should have the following files created. The `*.csr` files will not be used in this guide.
{{< highlight shell >}}
backend-1-key.pem
backend-1.csr
backend-1.pem
backend-2-key.pem
backend-2.csr
backend-2.pem
backend-3-key.pem
backend-3.csr
backend-3.pem
ca-config.json
ca-key.pem
ca.csr
ca.pem
client-key.pem
client.csr
client.pem
{{< /highlight >}}

### Client-to-server transport security with HTTPS

Below are example configuration snippets from `/etc/sensu/backend.yml` that will be the same for `backend-1`, `backend-2` and `backend-3` and assumes your client certificates are in `/etc/sensu/certs/` and your CA certificate is in `/usr/local/share/ca-certificates/sensu/`.

{{< highlight shell >}}
etcd-cert-file: "/etc/sensu/certs/client.pem"
etcd-key-file: "/etc/sensu/certs/client-key.pem"
etcd-trusted-ca-file: "/usr/local/share/ca-certificates/sensu/ca.pem"
{{< /highlight >}}

Validating with curl:

{{< highlight shell >}}
curl --cacert /usr/local/share/ca-certificates/sensu/ca.pem \
https://127.0.0.1:2379/v2/keys/foo -XPUT -d value=bar
{{< /highlight >}}

### Client-to-server authentication with HTTPS client certificates


Below are example configuration snippets from `/etc/sensu/backend.yml` that will be the same for `backend-1`, `backend-2` and `backend-3` and assumes your client certificates are in `/etc/sensu/certs/` and your CA certificate is in `/usr/local/share/ca-certificates/sensu/`.

{{< highlight shell >}}
etcd-cert-file: "/etc/sensu/certs/client.pem"
etcd-key-file: "/etc/sensu/certs/client-key.pem"
etcd-trusted-ca-file: "/usr/local/share/ca-certificates/sensu/ca.pem"
etcd-client-cert-auth: true
{{< /highlight >}}

Validating with curl, with a different certificate and key:

{{< highlight shell >}}
curl --cacert /usr/local/share/ca-certificates/sensu/ca.pem \
--cert /etc/sensu/certs/client.pem \
--key /etc/sensu/certs/client-key.pem \
-L https://127.0.0.1:2379/v2/keys/foo -XPUT -d value=bar
{{< /highlight >}}

### Peer communication authentication with HTTPS client certificates

Below are example configuration snippets from `/etc/sensu/backend.yml` on three sensu backends named `backend-1`, `backend-2` and `backend-3` with IP addresses `10.0.0.1`, `10.0.0.2` and `10.0.0.3` respectively.

_NOTE: If you ran through the first part of the guide, you will not need to repeat the store configuration for any of the backends._

**backend-1**

{{< highlight shell >}}
##
# store configuration for backend-1/10.0.0.1
##

etcd-listen-client-urls: "https://10.0.0.1:2379"
etcd-listen-peer-urls: "https://0.0.0.0:2380"
etcd-initial-cluster: "backend-1=https://10.0.0.1:2380,backend-2=https://10.0.0.2:2380,backend-3=https://10.0.0.3:2380"
etcd-initial-advertise-peer-urls: "https://10.0.0.1:2380"
etcd-initial-cluster-state: "new"
etcd-initial-cluster-token: "sensu"
etcd-name: "backend-1"

##
# etcd peer ssl configuration for backend-1/10.0.0.1
##

etcd-peer-cert-file: "/etc/sensu/certs/backend-1.pem"
etcd-peer-key-file: "/etc/sensu/certs/backend-1-key.pem"
etcd-peer-trusted-ca-file: "/usr/local/share/ca-certificates/sensu/ca.pem"
etcd-peer-client-cert-auth: true
{{< /highlight >}}

**backend-2**

{{< highlight shell >}}
##
# store configuration for backend-2/10.0.0.2
##

etcd-listen-client-urls: "https://10.0.0.2:2379"
etcd-listen-peer-urls: "https://0.0.0.0:2380"
etcd-initial-cluster: "backend-1=https://10.0.0.1:2380,backend-2=https://10.0.0.2:2380,backend-3=https://10.0.0.3:2380"
etcd-initial-advertise-peer-urls: "https://10.0.0.2:2380"
etcd-initial-cluster-state: "new"
etcd-initial-cluster-token: "sensu"
etcd-name: "backend-2"

##
# etcd peer ssl configuration for backend-2/10.0.0.2
##

etcd-peer-cert-file: "/etc/sensu/certs/backend-2.pem"
etcd-peer-key-file: "/etc/sensu/certs/backend-2-key.pem"
etcd-peer-trusted-ca-file: "/usr/local/share/ca-certificates/sensu/ca.pem"
etcd-peer-client-cert-auth: true
{{< /highlight >}}

**backend-3**

{{< highlight shell >}}
##
# store configuration for backend-3/10.0.0.3
##

etcd-listen-client-urls: "https://10.0.0.3:2379"
etcd-listen-peer-urls: "https://0.0.0.0:2380"
etcd-initial-cluster: "backend-1=https://10.0.0.1:2380,backend-2=https://10.0.0.2:2380,backend-3=https://10.0.0.3:2380"
etcd-initial-advertise-peer-urls: "https://10.0.0.3:2380"
etcd-initial-cluster-state: "new"
etcd-initial-cluster-token: "sensu"
etcd-name: "backend-3"

##
# etcd peer ssl configuration for backend-3/10.0.0.3
##

etcd-peer-cert-file: "/etc/sensu/certs/backend-3.pem"
etcd-peer-key-file: "/etc/sensu/certs/backend-3-key.pem"
etcd-peer-trusted-ca-file: "/usr/local/share/ca-certificates/sensu/ca.pem"
etcd-peer-client-cert-auth: true
{{< /highlight >}}

## Using an external etcd cluster

To stand up an external etcd cluster, you can follow etcd's [Clustering Guide][12] using the same store configuration.

In this example, we will enable client-to-server and peer communication authentication, [using self-signed TLS certificates][13]. Below is how you would start etcd for `backend-1` from our 3 node configuration example above.

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
--peer-client-cert-auth
{{< /highlight >}}

In order to inform Sensu that you'd like to use this external etcd data source, add the `sensu-backend` flag `--no-embed-etcd` to the original configuration, along with the path to a client certificate created using our CA.

{{< highlight shell >}}
sensu-backend start \
--etcd-trusted-ca-file=./ca.pem \
--etcd-cert-file=./client.pem \
--etcd-key-file=./client-key.pem \
--etcd-listen-client-urls=https://10.0.0.1:2379,https://10.0.0.2:2379,https://10.0.0.3:2379 \
--no-embed-etcd
{{< /highlight >}}

## Troubleshooting

### Failures modes

See [etcd Failure Modes][8] for more infromation.

### Disaster recovery

See [etcd Recovery][9] for more information.

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
