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
- [Clustered Backend](#clusterd-backend-with-embedded-etcd)

# Introduction

This guide will go over different Sensu-Go deployment strategies and recommendations. Depending on your infrastructure and the type of environments  you'll be monitoring you may want to use one or multiple methods of deploying Sensu-Go to best fit your needs and requirements.

_NOTE: Please see [Hardware Requirements][1] for hardware recommendations._

## Single Backend with Embedded etcd

### Use Cases

A single backend Sensu-Go architect is best for smaller standalone deployments such as a monitoring a remote office, auto scaling groups and in multi-cloud deployments. There is no built in redundancy in this strategy but in some cases this may be the best solution where having agents connect to a local backend may be more beneficial than having those agents connect over a WAN or VPN tunnel to another backend. If you want to still have all or specific events sent to a Sensu-Go Backend at another location you can use the [relay-handler][2] to accomplish this.

<img alt="Sensu Standalone Architecture" title="Single Sensu-Go Backend with Embedded etcd." src="/images/standalone_architecture.svg">

### Auto Scaling Groups

Standalone Sensu-Go instance can be deployed alongside other instances when used with Auto Scaling policies such as those available with [Amazon Web Services][5] and [Google Cloud Platform][6]. With most auto scaling configuration it may make sense to have a smaller standalone Sensu-Go backend to support the group. 

Having standalone Sensu-Go Backends for each auto scaling group gives you the flexibility of having only a single instance for N number of agents instead of having a single or cluster of Sensu-Go Backends that must always have the capacity of the maximum number of agents you could potentially have. 

For tracking these standalone Sensu-Go Backends, Sensu-Go Agents can be installed and configured to connect to a central Sensu-Go Backend or cluster.

### Configuration Requirements

## Clusters Backend with Embedded etcd

### Use Cases

A clustered Sensu-Go architecture will allow for benefits not always found in a standalone deployment. This includes having data replication and automatic fail-over. Agents will need to know of all the Sensu-Go backends in their configuration.

### 
While there is additional redundancy with a clustered Sensu-Go architecture, this does not give you added capacity.

### Configuration

All agents need to have each Sensu-Go [backend-url][3] configured that are in the cluster. 

_NOTE: If any of the Sensu-Go Backends change their IP address then all Agents will need to have their configuration updated._

An alternative to having each Sensu-Go Backend configured on all agents you can utilize a Load Balancer in front of your cluster. It is recommended that you use sticky/persistent connections with least utilization. 

Hardware or Instance Type should be the same across all Sensu-Go Backends. See [Hardware Requirements][1] for hardware recommendations.

The recommended number of etcd nodes is three (3) which gives your cluster an N+1 failure tolerance. While theoretically there is no limit to the number of members there can be in a cluster, there is no performance improvement by having more nodes than three nodes in the cluster as each event that is processed is written to each node. A five (5) node cluster is only recommended in use cases where there must be an N+2 failure tolerance and where a performance impact is acceptable. 

_NOTE: Etcd requires an odd number of members so a quorum can agree on updates to the cluster state. See [etcd docs][4]for more info._

### Network

After reaching over 1,000 agents it is recommended that your Sensu-Go Backend have a dedicated network interface for communication between each embedded etcd.


## Security

### Web Sockets and UI











Sensu Go shines in a cluster environment. Etcd recommends an odd cluster size of 3, 5 or 7 depending on your redundancy needs. Having more servers in a cluster does not improve performance.

As a baseline we recommend having a 3 node cluster and going up to a 5 node cluster if you want to have an N+1 redundancy for rolling upgrades. A 7 node cluster would be recommended for an N+3 redundancy during rolling upgrades. Performance is very minimal between a 5 and 7 node cluster. 

Sensu Go scales very well vertically not horizontally, as such more resources for Sensu Go is typically better than adding more servers to a cluster. 

You may also consider having multiple smaller clusters for different environments such as for different AWS availability zones or per major application group or silo. Sensu Enterprise Dashboard will be able to connect to all these clusters and display them under a single pane of glass. 

# Hardware

## CPUs

Sensu Go is a multi threaded application, while etcd does not require a lot of CPU capacity, Sensu Go does utilize all the available CPU resources available. This is beneficial in environments where you have a larger number of events that require processing such as metrics and checks requiring mutators.

## Memory

Etcd has a relatively small memory footprint but its performance still depends on having enough memory. An etcd server will aggressively cache key-value data and spends most of the rest of its memory tracking watchers. Typically 8GB is enough. For heavy deployments with thousands of watchers and millions of keys, allocate 16GB to 64GB memory accordingly.

Watchers are used by check scheduling, check TTL, keepalives and round robin scheduling. A watcher is maintained for every agent and for every check with the exception of round-robin checks which require two. 

## Storage

Disk speed is the most critical factor for Sensu Go deployment with regards to performance and stability. Etcd is very sensitive to disk write latency. A minimum of 50 sequential IOPS is required while heavy loaded clusters, 500 sequential IOPS is recommended.

We recommend utilizing SSDs or even faster storage such as Intel Optane. If you are using spinning disks, you'll want to use the fastest possible disks, such as 15,000 RPM variants.

With a cluster environment you may want to consider having your disks in RAID 0, even for SSDs, as write/read speed is more important on each node.

### Recovery

Cluster environments offer their own redundancy that does not require having disk redundancy on each node. If a disk fails you would need to replace it and rebuild the node. Once added again to the cluster it's data will be rebuilt. Disk bandwidth does not need to be fast for recovery. Typically a 100MB/s disk will recovery 1GB of data within 15 seconds.

## Network

Clustered Sensu Go deployments benefit from a fast and reliable network. Ideally they should live in the same network segment with as low latency as possible between all the nodes. It is not recommended having clusters across subnets or WAN connections.

While a 1GbE is sufficient for common deployments, larger deployments will benefit from 10GbE networks allowing for a reduce mean time to recovery.

[1]: ../../installation/recommended-hardware
[2]: TODO: RELAY HANDLER GITHUB LINK
[3]: ../../reference/agent/#general-configuration-flags
[4]: https://etcd.io/docs/
[5]: https://docs.aws.amazon.com/autoscaling/ec2/userguide/AutoScalingGroup.html
[6]: https://cloud.google.com/compute/docs/autoscaler/