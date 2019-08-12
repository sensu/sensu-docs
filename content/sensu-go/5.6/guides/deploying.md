---
title: "Planning your Sensu Go deployment"
linkTitle: "Deploying Sensu"
description: "In this guide we'll describes various considerations, recommendations and architectures for a production-ready deployment"
weight: 101
version: "5.6"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.6:
    parent: guides
---

This guide describes various deployment considerations and recommendations, including details related to communication security and common deployment architectures.

- [What is etcd?](#what-is-etcd)
- [Hardware sizing](#hardware-sizing)
- [Communications security](#communications-security)
- [Common Sensu architectures](#common-sensu-architectures)
  - [Single backend using embedded etcd](#single-backend-using-embedded-etcd)
  - [Clustered backend with embedded etcd](#clustered-backend-with-embedded-etcd)

## What is etcd?

etcd is a key-value store which is used by applications of varying complexity, from simple web apps to Kubernetes. The Sensu backend uses an embedded etcd instance for storing both configuration and event data, so you can get Sensu up and running without external dependencies.

By building atop etcd, Sensu's backend inherits a number of characteristics that should be considered when planning for a Sensu deployment.

## Hardware sizing

Because etcd's design prioritizes consistency across a cluster, the speed with which write operations can be completed is very important to the performance of a Sensu cluster. 

This means that Sensu backend infrastructure should be provisioned to provide sustained IO operations per second (IOPS) appropriate for the rate of monitoring events the system will be required to process.

For more detail, our [hardware requirements][1] document describes the minimum and recommended hardware specifications for running the Sensu backend.

## Communications security

Whether using a single or multiple Sensu backends in a cluster, communication with the backend's various network ports (web UI, HTTP API, websocket API, etcd client & peer) occurs in cleartext by default. Encrypting network communications via TLS is highly recommended, and requires both some planning and explicit configuration.

### Planning TLS for etcd

The URLs for each member of an etcd cluster are persisted to the database after initialization. As a result, moving a cluster from cleartext to encrypted communications requires resetting the cluster, which destroys all configuration and event data in the database. Therefore, we recommend planning for encryption before initiating a clustered Sensu backend deployment.

_WARNING: Reconfiguring a Sensu cluster for TLS post-deployment will require resetting all etcd cluster members, resulting in the loss of all data._

As described in our [guide for securing Sensu][6], the backend uses a shared certificate and key for web UI and agent communications. Communications with etcd can be secured using the same certificate and key; the certificate's common name or subject alternate names must include the network interfaces and DNS names that will point to those systems.

See our [clustering guide][7] and the [etcd docs][4] for more info on setup and configuration, including a walk-through for generating TLS certificates for your cluster.

## Common Sensu architectures

Depending on your infrastructure and the type of environments you'll be monitoring, you may use one or a combination of these architectures to best fit your needs.

### Single backend using embedded etcd

This architecture requires minimal resources, but provides no redundancy in the event of failure.

<img alt="Sensu Standalone Architecture" title="Single Sensu Go Backend with Embedded etcd." src="/images/standalone_architecture.svg">
<!-- Diagram source: https://www.lucidchart.com/documents/edit/d239f2db-15db-41c4-a191-b9b46990d156/0 -->

<p style="text-align:center"><i>Sensu standalone architecture with embedded etcd</i></p>

A single backend can later be reconfigured as a member of a cluster, but this operation is destructive -- meaning that it requires destroying the existing database.

#### Use cases

The simplicity of this architecture may make it a good fit for small to medium-sized deployments, such as monitoring a remote office or datacenter, deploying alongside individual auto-scaling groups or in various segments of a logical environment spanning multiple cloud providers.

For example, in environments with unreliable WAN connectivity, having agents connect to a local backend may be more reliable than having those agents connect over WAN or VPN tunnel to a backend running in a central location.

_NOTE: Multiple Sensu backends can relay their events to a central backend using the [sensu-relay-handler][2]._

### Clustered backend with embedded etcd

The embedded etcd databases of multiple Sensu backend instances can be joined together in a cluster, providing increased availability and replication of both configuration and data. Please see our [clustering guide][7] for more information.

<div style="text-align:center">
<img alt="Sensu Clustered Architecture" title="Clustered Sensu Go Backend with Embedded etcd." src="/images/clustered_architecture.svg" width="800 px">
</div>
<!-- Diagram source: https://www.lucidchart.com/documents/edit/475f950e-2770-4bf7-af73-57bc834cebdd -->

<p style="text-align:center"><i>Sensu clustered architecture with embedded etcd</i></p>

Clustering requires an odd number of backend instances. While larger clusters provide better fault tolerance, write performance suffers because data must be replicated across more machines. Following on the advice of the etcd maintainers, clusters of 3, 5 or 7 backends are the only recommended sizes. See the [etcd docs][4] for more info.

#### Cluster creation and maintenance

Sensu's embedded etcd supports initial cluster creation via a static list of peer URLs. Once the cluster is created, members can be added or removed using etcdctl tooling. See our [clustering guide][7] and the [etcd docs][4] for more info.

#### Networking considerations

Clustered deployments benefit from a fast and reliable network. Ideally they should be co-located in the same network segment with as low latency as possible between all the nodes. Clustering backends across disparate subnets or WAN connections is not recommended.

While a 1GbE is sufficient for common deployments, larger deployments will benefit from 10GbE network allowing for a reduced mean time to recovery.

As the number of agents connected to a backend cluster grows, so will the communication between members of the cluster required for data replication. With this in mind, it is recommended that clusters with a thousand or more agents use a discrete network interface for peer communication.

#### Load balancing

Although each Sensu agent can be configured with the URLs for multiple backend instances, we recommend that agents be configured for connecting to a load balancer. This approach provides operators with greater control over agent connection distribution and makes it possible to replace members of the backend cluster without requiring updates to agent configuration.

Conversely, the sensuctl command-line utility cannot be configured with multiple backend URLs. Under normal conditions it is desirable for both sensuctl communications and browser access to the web UI to be routed via a load balancer as well.

[1]: ../../installation/recommended-hardware
[2]: https://bonsai.sensu.io/assets/sensu/sensu-relay-handler
[3]: ../../reference/agent/#general-configuration-flags
[4]: https://etcd.io/docs/
[5]: https://github.com/etcd-io/etcd/blob/master/Documentation/op-guide/security.md
[6]: ../../guides/securing-sensu/
[7]: ../../guides/clustering/
