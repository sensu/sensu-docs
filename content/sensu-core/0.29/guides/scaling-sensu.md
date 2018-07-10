---
title: "Scaling Sensu"
description: "Strategies and best practices for scaling Sensu"
version: "0.29"
weight: 9
menu:
  sensu-core-0.29:
    parent: guides
---

In this article we'll cover some strategies to consider when scaling Sensu, whether at a single site, or configured in a distributed fashion.

# Objectives

By the end of the end of this article, you should be able to confidently:

* Scale Sensu at a single site
* Scale Sensu at multiple sites
* Understand the strengths and weaknesses of various scaling strategies

## Prerequisites

* At least one working Sensu installation consisting of:
  * sensu-server
  * sensu-api
  * uchiwa
  * rabbitmq
  * redis

If you don't have a fully functioning Sensu deployment, consider running through our ["Five Minute Install"][1] guide to stand up a single Sensu instance. Alternatively, you can use the Vagrantfile found [here][2]. We'll start by discussing each of the components involved in a Sensu deployment and then discuss various scaling methodologies for Sensu, as well as the advantages and disadvantages to each one. Let's start by discussing the `sensu-server` component.

## Sensu Server

The `sensu-server` component is the crux of any deployment. Not only does it perform the function of scheduling check requests, it is also responsible for consuming messages from RabbitMQ. It is often the case that if you see your RabbitMQ queue depth start to creep up, you'll need to add additional consumers (`sensu-server` instances) to your deployment.  

The `sensu-server` component is best scaled using a "scale out" methodology i.e., adding more instances running `sensu-server`. The component itself does its own internal master election, so there's no need to tell a cluster of Sensu servers which server will be performing as the master. It's worth noting that when scaling out your `sensu-server` component, that you'll want to ensure that each additional instance is configured the same as your initial instance. If you're ever in doubt as to whether your `sensu-server` instances have their configuration in sync, you can validate the configuration using [`hexdigest` value from the `sensu-api`'s `info` endpoint][3].

_WARNING: If your `sensu-server`'s hexdigests differ from each other, there can be unexpected behavior when it comes to check execution and results. Use a configuration management software like Chef, Puppet, or Ansible to ensure that your configurations are in sync._

## Sensu API

The Sensu API component is a stateless http frontend. It can be scaled with traditional http load-balancing strategies. (HAproxy, Nginx, etc)

## RabbitMQ

Clustering RabbitMQ with Sensu deployments is generally not advised due to the way that RabbitMQ functions. Please see the RabbitMQ [documentation][1] on clustering for building a RabbitMQ cluster. 

## Redis

For the most part, Redis can only have a single master at one time. However, building multiple Redis instances can provide fault tolerance. See the [Redis Sentinel][2] documentation on how to build a Redis with automatic promotion of slaves.

# Scaling Sensu Across Multiple Sites {#scaling-sensu-across-multiple-sites}

Every distributed system, Sensu included, must take into account special considerations when scaling across multiple sites (datacenters) where the networking (WAN) will be unreliable.

For the purpose of this documentation each site will be referred to as a "Datacenter".

## Strategy 1: Isolated Clusters Aggregated by Uchiwa

This strategy involves building isolated, independent Sensu server/clusters at each datacenter, and then using Uchiwa\'s multi-datacenter configuration option to get an aggregate view of the events and clients.

### Pros

* WAN instability does *not* lead to flapping Sensu checks
* Sensu operation continues un-interrupted during a WAN outage
* The overall architecture is easier to understand and troubleshoot

### Cons

* WAN outages mean a whole Datacenter can go dark and not set off alerts (cross-datacenter checks are therefor essential)
* WAN instability can lead to a lack of visibility as Uchiwa may not be able to connect to the remote Sensu APIs
* Requires all the Sensu infrastructure in every datacenter

## Strategy 2: Centralized Sensu and Distributed  RabbitMQ

Sensu clients only need to connect to a RabbitMQ server to submit events. One scaling strategy is to centralize the Sensu infrastructure in one location, and have remote sites only have a remote RabbitMQ broker, which in turn forwards
events to the central cluster.

This is done either by the RabbitMQ [Federation plugin][3] or via the [Shovel][4] plugin. (See a comparison [here][5])

Note: This is picking Availability and Partition Tolerance over Consistency with RabbitMQ.

### Pros

* Decreased infrastructure necessary at remote Datacenters
* All Sensu server alerts originate from a single source

### Cons

* WAN instability can result in floods of client keepalive alerts. ([Check Dependencies][6] can help with this)
* Increased RabbitMQ configuration complexity.
* All clients "appear" to be in the same datacenter in Uchiwa

## Strategy 3: Centralized Sensu and Directly Connected Clients

All Sensu clients execute checks locally. Their only interaction with Sensu servers is to push events onto RabbitMQ. Therefore, remote clients can connect directly to a remote RabbitMQ broker over the WAN.

### Pros

* Very simple architecture, no additional infrastructure needed at remote sites
* Centralized alert handling

### Cons

* Keepalive failures are now indistinguishable from WAN instability
* Lots of remote clients means lots of TCP connections over the WAN
* All clients "appear" to be in the same datacenter in Uchiwa

<!-- LINKS -->
[1]: ../../quick-start/five-minute-install/
[2]: https://github.com/sensu/training-vagrant/blob/master/workshops/intro-to-sensu/Vagrantfile
[3]: ../../api/health-and-info/#info-get
https://www.rabbitmq.com/clustering.html
[2]: http://redis.io/topics/sentinel
[3]: https://www.rabbitmq.com/federation.html
[4]: https://www.rabbitmq.com/shovel.html
[5]: https://www.rabbitmq.com/distributed.html
[6]: /sensu-enterprise/latest/filters/check-dependencies
[7]: 