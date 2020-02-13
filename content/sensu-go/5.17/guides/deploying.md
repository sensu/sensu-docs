---
title: "Deploy Sensu"
linkTitle: "Deploy Sensu"
description: "This guide describes considerations, potential architectures, and recommendations for a production-ready Sensu deployment."
weight: 140
version: "5.17"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.17:
    parent: guides
---

- [Create and maintain clusters](#create-and-maintain-clusters)
- [Hardware sizing](#hardware-sizing)
- [Communications security](#communications-security)
  - [Plan TLS for etcd](#plan-tls-for-etcd)
- [Common Sensu architectures](#common-sensu-architectures)
  - [Single backend (standalone)](#single-backend-standalone)
  - [Clustered deployment for single availability zone](#clustered-deployment-for-single-availability-zone)
  - [Clustered deployment for multiple availability zones](#clustered-deployment-for-multiple-availability-zones)
  - [Large-scale clustered deployment for multiple availability zones](#large-scale-clustered-deployment-for-multiple-availability-zones)
- [Architecture considerations](#architecture-considerations)
  - [Networking](#networking)
  - [Load blanacing](#load-balancing)

This guide describes various deployment considerations and recommendations for a production-ready Sensu deployment, including details related to communication security and common deployment architectures.

etcd is a key-value store that is used by applications of varying complexity, from simple web apps to Kubernetes.
The Sensu backend uses an embedded etcd instance for storing both configuration and event data, so you can get Sensu up and running without external dependencies.

By building atop etcd, Sensu's backend inherits a number of characteristics to consider when you're planning for a Sensu deployment.

## Create and maintain clusters

Sensu's embedded etcd supports initial cluster creation via a static list of peer URLs.
After you create a cluster, you can add and remove cluster members with etcdctl tooling.
See [Run a Sensu cluster][7] and the [etcd documentation][4] for more information.

## Hardware sizing

Because etcd's design prioritizes consistency across a cluster, the speed with which write operations can be completed is very important to the performance of a Sensu cluster. 
This means that you should provision Sensu backend infrastructure to provide sustained IO operations per second (IOPS) appropriate for the rate of monitoring events the system will be required to process.

Our [hardware requirements][1] documentation describes the minimum and recommended hardware specifications for running the Sensu backend.

## Communications security

Whether you're using using a single Sensu backend or multiple Sensu backends in a cluster, communication with the backend's various network ports (web UI, HTTP API, WebSocket API, etcd client and peer) occurs in cleartext by default.
We recommend that you encrypt network communications via TLS, which requires planning and explicit configuration.

### Plan TLS for etcd

The URLs for each member of an etcd cluster are persisted to the database after initialization.
As a result, moving a cluster from cleartext to encrypted communications requires resetting the cluster, which destroys all configuration and event data in the database.
Therefore, we recommend planning for encryption before initiating a clustered Sensu backend deployment.

_**WARNING**: Reconfiguring a Sensu cluster for TLS post-deployment will require resetting all etcd cluster members, resulting in the loss of all data._

As described in [Secure Sensu][6], the backend uses a shared certificate and key for web UI and agent communications.
You can secure communications with etcd using the same certificate and key.
The certificate's common name or subject alternate names must include the network interfaces and DNS names that will point to those systems.

See [Run a Sensu cluster][7] and the [etcd documentation][4] for more information about TLS setup and configuration, including a walkthrough for generating TLS certificates for your cluster.

## Common Sensu architectures

Depending on your infrastructure and the type of environments you'll be monitoring, you may use one or a combination of these architectures to best fit your needs.

### Single backend (standalone)

The single backend (standalone) with embedded etcd architecture requires minimal resources but provides no redundancy in the event of failure.

{{< figure src="/images/standalone_architecture.png" alt="Single Sensu Go backend or standalone architecture" link="/images/standalone_architecture.png" target="_blank" >}}
<!-- Diagram source: https://www.lucidchart.com/documents/edit/d239f2db-15db-41c4-a191-b9b46990d156/0 -->

*<p style="text-align:center">Single Sensu Go backend or standalone architecture</p>*

*Single Sensu Go backend or standalone architecture*

You can reconfigure a single backend as a member of a cluster, but this operation is destructive: it requires destroying the existing database.

The single backend (standalone) architecture may be a good fit for small- to medium-sized deployments (such as monitoring a remote office or datacenter), deploying alongside individual auto-scaling groups, or in various segments of a logical environment spanning multiple cloud providers.

For example, in environments with unreliable WAN connectivity, having agents connect to a local backend may be more reliable than having agents connect over WAN or VPN tunnel to a backend running in a central location.

_**NOTE**: Multiple Sensu backends can relay their events to a central backend using the [sensu-relay-handler][2]._

### Clustered deployment for single availability zone

To increase availability and replicate both configuration and data, join the embedded etcd databases of multiple Sensu backend instances together in a cluster.
Read [Run a Sensu cluster][7] for more information.

{{< figure src="/images/single-AZ-sensu-deployment.png" alt="Clustered Sensu Go architecture for a single availability zone" link="https://sensu-docs.s3.amazonaws.com/images/labeled-single-AZ-sensu-deployment.png" target="_blank" >}}
<!-- Diagram source: https://www.lucidchart.com/documents/edit/5375377c-4dfd-4a12-8770-c2b47c2ef0e3/Ix6mP9JlVdGc -->

*<p style="text-align:center">Clustered Sensu Go architecture for a single availability zone</p>*

Clustering requires an odd number of backend instances.
Although larger clusters provide better fault tolerance, write performance suffers because data must be replicated across more machines.
The etcd maintainers recommend clusters of 3, 5 or 7 backends. See the [etcd documentation][4] for more information.

### Clustered deployment for multiple availability zones

Distributing infrastructure across multiple availability zones in a given region helps ensure continuous availability of customer infrastructure in the region if any one availability zone becomes unavailable.
With this in mind, you can deploy a Sensu cluster across multiple availability zones in a given region, configured to tolerate reasonable latency between those availability zones.

{{< figure src="/images/cross-AZ-sensu-deployment.png" alt="Clustered Sensu Go architecture for multiple availability zones" link="https://sensu-docs.s3.amazonaws.com/images/labeled-cross-AZ-sensu-deployment.png" target="_blank" >}}
<!-- Diagram source: https://www.lucidchart.com/documents/edit/5375377c-4dfd-4a12-8770-c2b47c2ef0e3/n~8S.VTyl5JQ -->

*<p style="text-align:center">Clustered Sensu Go architecture for multiple availability zones</p>*

### Large-scale clustered deployment for multiple availability zones

In a large-scale clustered Sensu Go deployment, you can use as many backends as you wish.
Use one etcd node per availiability zone, with a minimum of three etcd nodes and a maximum of five.
Three etcd nodes allow you to tolerate the loss of a single node with minimal effect on performance. 
Five etcd nodes allow you to tolerate the loss of two nodes, but with a greater effect on performance.

{{< figure src="/images/large-scale-cross-AZ-sensu-deployment.png" alt="Large-scale clustered Sensu Go architecture for multiple availability zones" link="https://sensu-docs.s3.amazonaws.com/images/labeled-large-scale-cross-AZ-sensu-deployment.png" target="_blank" >}}
<!-- https://www.lucidchart.com/documents/edit/5375377c-4dfd-4a12-8770-c2b47c2ef0e3/Wr7mzxLPcUmO -->

*<p style="text-align:center">Large-scale clustered Sensu Go architecture for multiple availability zones</p>*

#### Scaled cluster performance with PostgreSQL

To achieve the high rate of event processing that many enterprises require, Sensu supports PostgreSQL event storage as a [commmercial feature][9].
See the [Datastore reference][8] for details on configuring the Sensu backend to use PostgreSQL for event storage.

{{< figure src="/images/clustered_architecture_postgres.png" alt="Clustered Sensu Go architecture with PostgreSQL" link="/images/clustered_architecture_postgres.png" target="_blank" >}}
<!-- Diagram source: https://www.lucidchart.com/documents/edit/475f950e-2770-4bf7-af73-57bc834cebdd/1 -->

*<p style="text-align:center">Clustered Sensu Go architecture with PostgreSQL event storage</p>*

In load testing, Sensu Go has proven capable of processing 36,000 events per second when using PostgreSQL as the event store.
See the [sensu-perf project repository][10] for a detailed explanation of our testing methodology and results.

## Architecture considerations

### Networking

Clustered deployments benefit from a fast and reliable network.
Ideally, they should be co-located in the same network segment with as little latency as possible between all the nodes.
We do not recommend clustering backends across disparate subnets or WAN connections.

Although 1GbE is sufficient for common deployments, larger deployments will benefit from 10GbE, which allows a shorder mean time to recovery.

As the number of agents connected to a backend cluster grows, so will the amount of communication between members of the cluster required for data replication.
With this in mind, clusters with a thousand or more agents should use a discrete network interface for peer communication.

### Load balancing

Although you can configure each Sensu agent with the URLs for multiple backend instances, we recommend that you configure agents to connect to a load balancer.
This approach gives operators more control over agent connection distribution and makes it possible to replace members of the backend cluster without updates to agent configuration.

Conversely, you cannot configure the sensuctl command line tool with multiple backend URLs.
Under normal conditions, sensuctl communications and browser access to the web UI should be routed via a load balancer.

[1]: ../../installation/recommended-hardware/
[2]: https://bonsai.sensu.io/assets/sensu/sensu-relay-handler/
[3]: ../../reference/agent/#general-configuration-flags
[4]: https://etcd.io/docs/
[5]: https://github.com/etcd-io/etcd/blob/master/Documentation/op-guide/security.md
[6]: ../../guides/securing-sensu/
[7]: ../../guides/clustering/
[8]: ../../reference/datastore/
[9]: ../../getting-started/enterprise/
[10]: https://github.com/sensu/sensu-perf
