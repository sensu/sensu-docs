---
title: "Planning your Sensu Go Deployment"
linkTitle: "Sensu Go Deployment Guide"
description: "In this guide we'll go over a checklist of requirements for a production ready deployment"
weight: 30
version: "5.0"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.0:
    parent: guides
---

- [Introduction](#introduction)
- [Single Backend](#single-backend-with-embedded-etcd)
  - [Use Cases](#use-cases)
  - [Auto Scaling Groups](#auto-scaling-groups)
- [Clustered Backend](#clustered-backend-with-embedded-etcd)
  - [Use Cases](#use-cases)
  - [Caveats](#caveats)
  - [Configuration](#configuration)
- [Network](#network)
  - [etcd Network](#etcd-network)
  - [Load Balancers](#load-balancers)
- [Security](#security)
  - [RBAC](#rbac)
  - [Dashboard](#dashboard)
  - [Agent](#agent)
  - [etcd](#etcd)

## Introduction

This guide will go over different Sensu Go deployment strategies and recommendations. Depending on your infrastructure and the type of environments  you'll be monitoring you may want to use one or multiple methods of deploying Sensu Go to best fit your needs and requirements.

_NOTE: Please see [Hardware Requirements][1] for hardware recommendations._

## Single Backend with Embedded etcd

### Use Cases

A single backend Sensu Go architecture is best for smaller standalone deployments such as a monitoring a remote office, auto scaling groups and in multi-cloud deployments. There is no built in redundancy in this strategy but in some cases this may be the best solution where having agents connect to a local backend may be more beneficial than having those agents connect over a WAN or VPN tunnel to another backend.

_Note: If you want to still have all or specific events sent to a Sensu Go Backend at another location you can use the [relay-handler][2] to accomplish this._

<img alt="Sensu Standalone Architecture" title="Single Sensu Go Backend with Embedded etcd." src="/images/standalone_architecture.svg">

### Auto Scaling Groups

Standalone Sensu Go instance can be deployed alongside other instances when used with Auto Scaling policies such as those available with [Amazon Web Services][5] and [Google Cloud Platform][6]. With most auto scaling configuration it may make sense to have a smaller standalone Sensu Go backend to support those instances.

Having standalone Sensu Go Backends for each auto scaling group gives you the flexibility of having only a single instance for N number of agents instead of having a single or cluster of Sensu Go Backends that must always have the capacity of the maximum number of agents you could potentially have.

For monitoring these standalone Sensu Go Backends, Sensu Go Agents can be installed and configured to connect to a central Sensu Go Backend or cluster.

## Clustered Backend with Embedded etcd

### Use Cases

A clustered Sensu Go architecture will allow for benefits not always found in a standalone deployment. This includes event data replication and automatic fail-over. Agents will need to know of all the available Sensu Go backends in their configuration.

While there is additional redundancy with a clustered Sensu Go architecture, this does not give you added capacity as in having 5 Sensu Go Backends does not equate to 5 times the events handled.

<img alt="Sensu Clustered Architecture" title="Clustered Sensu Go Backend with Embedded etcd." src="/images/clustered_architecture.svg">

### Caveats

Clustered Sensu Go with Embedded etcd requires each event to be written to disk on all nodes in the etcd cluster. This can cause a performance impact when adding more nodes. To mitigate performance impacts from this, we recommend having a dedicated network interface for communication between all embedded etcd for replication.

### Configuration

Sensu Go Agents require each Sensu Go [backend-url][3] configured that are in the cluster.

_NOTE: If any of the Sensu Go Backends change their IP address then all Agents will need to have their configuration updated._

An alternative to having each Sensu Go Backend configured on all Agents would be to utilize a Load Balancer in front of your cluster. It is recommended that you use sticky/persistent connections with least utilization to best balance distribution of events to your backend cluster.

Hardware or Instance Type should be the same across all Sensu Go Backends. See [Hardware Requirements][1] for hardware recommendations.

The recommended number of etcd nodes is three (3) which gives your cluster an N+1 failure tolerance. While theoretically there is no limit to the number of members there can be in a cluster, there is no performance improvement by having more nodes than three nodes in the cluster as each event that is processed is written to each node. A five (5) node cluster is only recommended in use cases where there must be an N+2 failure tolerance and where a performance impact is acceptable.

_NOTE: Etcd requires an odd number of members so a quorum can be agreed on updates to the cluster state. See [etcd docs][4] for more info._

## Network

### etcd Network

After reaching >1,000 agents it is recommended that your Sensu Go Backend have a dedicated network interface for communication between each embedded etcd. This is due to the fact that any event that is processed by Sensu is written to etcd and duplicated to all nodes in the cluster.

Clustered Sensu Go deployments benefit from a fast and reliable network. Ideally they should live in the same network segment with as low latency as possible between all the nodes. It is not recommended having clusters across subnets or WAN connections.

While a 1GbE is sufficient for common deployments, larger deployments will benefit from 10GbE network allowing for a reduce mean time to recovery.

### Load Balancers

Load balancers are a great method to distribute traffic coming from sensu-agents to sensu-backends. Load balancers should be configured to evenly distribute traffic between all sensu-backends. Sticky sessions are useful but not required.

TODO: VERIFY Utilization of healthz endpoint to check availability of sensu-backends

## Security

### RBAC

RBAC allows for granular control and access of namespaced resources, such as entities, checks and handlers. Users are granted roles, permissions controlling access to sensu resources within a namespace, and cluster roles, cluster-wide permissions for resources.

Roles are given particular permission to specific resources. These include `get`, `list`, `create`, `update`, and `delete`.

### Dashboard

Dashboard access is determined by your credentials from RBAC.
Dashboard does not have TLS/HTTPS by default. You will need to provide a cert and key file for HTTPS. See Dashboard security https://docs.sensu.io/Sensu Go/5.11/reference/backend/#dashboard-configuration-flags

You can use a security gateway or load balancer to provide your cert and use http between your gateway/load balancer and your sensu-dashboard but traffic will be cleartext between the two devices.

### Agent

SSL/TLS encryption between Agents and Backend is recommended. You can provide a trusted-ca-file to create a secure handshake between the Agents and backend.

By default Sensu Agent API listens to 127.0.0.1. In some cases it may be necessary to have the agent's API listen to a non-loopback address. There is currently no security or SSL/TLS available for the agent API.

### etcd

SSL/TLS encryption between embedded etcd backends is highly recommended. If using a single cert and key for etcd and non-etcd interfaces, the certificate must include all the network interfaces and DNS names that will point to those systems.

See [etcd docs][7] for more info on setup and configuration.

_WARNING: Configuring SSL encryption post-deployment will require resetting all etcd clusters, resulting in the loss of all data._

[1]: ../../installation/recommended-hardware
[2]: https://bonsai.sensu.io/assets/sensu/sensu-relay-handler
[3]: ../../reference/agent/#general-configuration-flags
[4]: https://etcd.io/docs/
[5]: https://docs.aws.amazon.com/autoscaling/ec2/userguide/AutoScalingGroup.html
[6]: https://cloud.google.com/compute/docs/autoscaler/
[7]: https://github.com/etcd-io/etcd/blob/master/Documentation/op-guide/security.md
