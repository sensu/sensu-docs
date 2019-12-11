---
title: "Deploy Sensu"
linkTitle: "Deploy Sensu"
description: "This guide describes considerations, potential architectures, and recommendations for a production-ready Sensu deployment."
weight: 140
version: "5.16"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.16:
    parent: guides
---

- [Hardware sizing](#hardware-sizing)
- [Communications security](#communications-security)
  - [Planning TLS for etcd](#planning-tls-for-etcd)
- [Common Sensu architectures](#common-sensu-architectures)
  - [Single backend with embedded etcd](#single-backend-with-embedded-etcd)
  - [Clustered backend with embedded etcd](#clustered-backend-with-embedded-etcd)

This guide describes various deployment considerations and recommendations for a production-ready Sensu deployment, including details related to communication security and common deployment architectures.

etcd is a key-value store that is used by applications of varying complexity, from simple web apps to Kubernetes.
The Sensu backend uses an embedded etcd instance for storing both configuration and event data, so you can get Sensu up and running without external dependencies.

By building atop etcd, Sensu's backend inherits a number of characteristics to consider when you're planning for a Sensu deployment.

## Hardware sizing

Because etcd's design prioritizes consistency across a cluster, the speed with which write operations can be completed is very important to the performance of a Sensu cluster. 

This means that you should provision Sensu backend infrastructure to provide sustained IO operations per second (IOPS) appropriate for the rate of monitoring events the system will be required to process.

Our [hardware requirements][1] documentation describes the minimum and recommended hardware specifications for running the Sensu backend.

## Communications security

Whether you're using using a single Sensu backend or multiple Sensu backends in a cluster, communication with the backend's various network ports (web UI, HTTP API, WebSocket API, etcd client and peer) occurs in cleartext by default.
We recommend that you encrypt network communications via TLS, which requires planning and explicit configuration.

### Planning TLS for etcd

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

### Single backend with embedded etcd

The single backend (standalone) with embedded etcd architecture requires minimal resources but provides no redundancy in the event of failure.

<img alt="Sensu single backend or standalone architecture" title="Single Sensu Go backend with embedded etcd." src="/images/standalone_architecture.png">
<!-- Diagram source: https://www.lucidchart.com/documents/edit/d239f2db-15db-41c4-a191-b9b46990d156/0 -->

<p style="text-align:center"><i>Sensu single backend (standalone) architecture with embedded etcd</i></p>

You can reconfigure a single backend as a member of a cluster, but this operation is destructive: it requires destroying the existing database.

#### Use cases

The simplicity of the single backend (standalone) architecture may make it a good fit for small- to medium-sized deployments (such as monitoring a remote office or datacenter), deploying alongside individual auto-scaling groups, or in various segments of a logical environment spanning multiple cloud providers.

For example, in environments with unreliable WAN connectivity, having agents connect to a local backend may be more reliable than having agents connect over WAN or VPN tunnel to a backend running in a central location.

_**NOTE**: Multiple Sensu backends can relay their events to a central backend using the [sensu-relay-handler][2]._

### Clustered backend with embedded etcd

You can join the embedded etcd databases of multiple Sensu backend instances together in a cluster to provide increased availability and replication of both configuration and data.
Read [Run a Sensu cluster][7] for more information.

<div style="text-align:center">
<img alt="Sensu clustered architecture" title="Clustered Sensu Go backend with embedded etcd." src="/images/clustered_architecture.png" width="800 px">
</div>
<!-- Diagram source: https://www.lucidchart.com/documents/edit/475f950e-2770-4bf7-af73-57bc834cebdd -->

<p style="text-align:center"><i>Sensu clustered architecture with embedded etcd</i></p>

Clustering requires an odd number of backend instances.
Although larger clusters provide better fault tolerance, write performance suffers because data must be replicated across more machines.
The etcd maintainers recommend clusters of 3, 5 or 7 backends. See the [etcd documentation][4] for more information.

#### Scale cluster performance with PostgreSQL

To achieve the high rate of event processing that many enterprises require, Sensu offers support for PostgreSQL event storage as a [commmercial feature][9].
See the [Datastore reference][8] for details on configuring the Sensu backend to use PostgreSQL for event storage.

<div style="text-align:center">
<img alt="Sensu clustered architecture with PostgreSQL" title="Clustered Sensu Go backend with embedded etcd and PostgreSQL event storage." src="/images/clustered_architecture_postgres.png" width="800 px">
</div>
<!-- Diagram source: https://www.lucidchart.com/documents/edit/475f950e-2770-4bf7-af73-57bc834cebdd/1 -->

<p style="text-align:center"><i>Sensu clustered architecture with embedded etcd and PostgreSQL event storage</i></p>

In load testing Sensu Go has proven capable of processing 36,000 events per second when using PostgreSQL as the event store.
See the [sensu-perf project repository][10] for a detailed explanation of our testing methodology and results.

#### Create and maintain clusters

Sensu's embedded etcd supports initial cluster creation via a static list of peer URLs.
After you create a cluster, you can add and remove cluster members with etcdctl tooling.
See [Run a Sensu cluster][7] and the [etcd documentation][4] for more information.

#### Networking considerations

Clustered deployments benefit from a fast and reliable network.
Ideally, they should be co-located in the same network segment with as little latency as possible between all the nodes.
We do not recommend clustering backends across disparate subnets or WAN connections.

Although 1GbE is sufficient for common deployments, larger deployments will benefit from 10GbE, which allows a shorder mean time to recovery.

As the number of agents connected to a backend cluster grows, so will the amount of communication between members of the cluster required for data replication.
With this in mind, clusters with a thousand or more agents should use a discrete network interface for peer communication.

#### Load balancing

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
