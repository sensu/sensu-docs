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

- [Clusters](#clusters)
- [CPUs](#cpus)

# Overview

Hardware requirements for Sensu Go are dependant on the number of events that will be handled by each node. A Heavy deployment would be one where Sensu Go is processing 5,000 events per second bursting as much as 10,000 events per second. 

_Note: Sensu Go is built on top of Etcd as such many of the hardware requirements are similar to etcd with a few exceptions._

## Clusters

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