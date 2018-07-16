---
title: "Scaling Sensu - Overview"
linkTitle: "Scaling Overview"
product: "Sensu Core"
description: "Overview of strategies and best practices for scaling Sensu"
version: "1.2"
weight: 11
next: ../scaling-sensu-components
menu:
  sensu-core-1.2:
    parent: guides
---

In this article we'll provide brief overviews of the various ways that you can scale your Sensu deployment, from scaling individual components, to scaling across regions.

- [Scaling Sensu at a Single Site](#scaling-sensu-at-a-single-site)
- [Scaling Sensu Across Multiple Sites](#scaling-sensu-across-multiple-sites-scaling)
  - [Strategy 1: Isolated Clusters Aggregated by Uchiwa](#strategy-1-isolated-clusters-aggregated-by-uchiwa)
  - [Strategy 2: Centralized Sensu and Distributed RabbitMQ](#strategy-2-centralized-sensu-and-distributed-rabbitmq)
  - [Strategy 3: Centralized Sensu and Directly Connected Clients](#strategy-3-centralized-sensu-and-directly-connected-clients)

## Sensu Components

A typical Sensu deployment consists of four pieces:

- [Sensu Server](#sensu-server)
- [Sensu API](#sensu-api)
- [Redis (data store)](#redis)
- [RabbitMQ (message bus)](#rabbitmq)

There can be variation when it comes to the message bus and data store components, but using Redis as the data store and RabbitMQ as the message bus is the most common (and supported) way of deploying those components.

### Sensu Server

The `sensu-server` process is the workhorse of any deployment. It performs a [number of tasks][1] including check scheduling and publishing, monitoring clients via keepalives, and event processing. To scale this component, add the desired number of Sensu servers and point them at your RabbitMQ instance where they'll do their own internal leader election.

### Sensu API

The `sensu-api` component is a stateless HTTP frontend. It can be scaled with traditional HTTP load-balancing strategies (HAproxy, Nginx, etc.). Configure each additional API instance to point to your Redis instance, and add the API instance to your load balancing pool.

### Redis

Redis can be scaled out in several different ways. Using Redis Sentinel is the primarily supported way of scaling Redis. You can read more about installing and configuring Sentinel in our [Redis reference documentation][2].

### RabbitMQ

RabbitMQ can be used in a clustered configuration for Sensu. You can read more about configuring RabbitMQ clusters in our [RabbitMQ reference documentation][3].

## Scaling Sensu at a Single Site

Each Sensu component can be scaled independently at a single site, whether you need to ensure that Redis is highly available or you need to scale out the number of consumers (`sensu-server` instances) to keep your RabbitMQ queue depth to manageable levels. We'll put all of these elements together in the next guide.

## Scaling Sensu Across Multiple Sites {#scaling-sensu-across-multiple-sites}

Every distributed system, Sensu included, must take into account special considerations when scaling across multiple sites (datacenters) where the networking (WAN) will be unreliable.

For the purpose of this documentation each site will be referred to as a "datacenter".

### Strategy 1: Isolated Clusters Aggregated by Uchiwa

This strategy involves building isolated, independent Sensu server/clusters at each datacenter, and then using Uchiwa's multi-datacenter configuration option to get an aggregate view of the events and clients.

#### Pros

* WAN instability does *not* lead to flapping Sensu checks
* Sensu operation continues un-interrupted during a WAN outage
* The overall architecture is easier to understand and troubleshoot

#### Cons

* WAN outages mean a whole datacenter can go dark and not set off alerts (cross-datacenter checks are therefore essential)
* WAN instability can lead to a lack of visibility as Uchiwa may not be able to connect to the remote Sensu APIs
* Requires all the Sensu infrastructure in every datacenter

### Strategy 2: Centralized Sensu and Distributed RabbitMQ

Sensu clients only need to connect to a RabbitMQ server to submit events. One scaling strategy is to centralize the Sensu infrastructure in one location, and have remote sites only have a remote RabbitMQ broker, which in turn forwards events to the central cluster.

This is done either by the RabbitMQ [Federation plugin][4] or via the [Shovel][5] plugin. (See a comparison [here][6])

_NOTE: This is picking availability and partition tolerance over consistency with RabbitMQ._

#### Pros

* Fewer infrastructure components necessary at remote datacenters
* All Sensu server alerts originate from a single source

#### Cons

* WAN instability can result in floods of client keepalive alerts. (The [Sensu Enterprise check dependencies filter][7] can help with this.)
* Increased RabbitMQ configuration complexity
* All clients appear to be in the same datacenter in Uchiwa

### Strategy 3: Centralized Sensu and Directly Connected Clients

All Sensu clients execute checks locally. Their only interaction with Sensu servers is to push events onto RabbitMQ. Therefore, remote clients can connect directly to a remote RabbitMQ broker over the WAN.

#### Pros

* Very simple architecture, no additional infrastructure needed at remote sites
* Centralized alert handling

#### Cons

* Keepalive failures are now indistinguishable from WAN instability
* Lots of remote clients means lots of TCP connections over the WAN
* All clients appear to be in the same datacenter in Uchiwa

## Next Steps

Now that we've covered the components involved in scaling Sensu from a high level, we'll dig deeper into the individual components of a Sensu deployment, and discuss _how_ you know when you need to start scaling the various components. Click the link at the bottom of the article to go to the next guide in this series.

<!-- LINKS -->
[1]: ../../reference/server/#what-is-the-sensu-server
[2]: ../../reference/redis/
[3]: ../../reference/rabbitmq/
[4]: https://www.rabbitmq.com/federation.html
[5]: https://www.rabbitmq.com/shovel.html
[6]: https://www.rabbitmq.com/distributed.html
[7]: /sensu-enterprise/latest/filters/check-dependencies
