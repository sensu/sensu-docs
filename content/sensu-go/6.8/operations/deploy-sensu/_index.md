---
title: "Deploy Sensu"
description: "Deploy Sensu, the flexible observability pipeline built to ease operator burden and meet the challenges of monitoring multi-cloud and ephemeral infrastructure."
product: "Sensu Go"
version: "6.8"
weight: 10
layout: "single"
toc: true
menu:
  sensu-go-6.8:
    parent: operations
    identifier: deploy-sensu
---

Use the information and instructions in the Deploy Sensu category to plan, install, configure, and deploy Sensu's flexible monitoring and observability pipeline.

## Plan your Sensu deployment

Find Sensu agent and backend requirements and networking and cloud recommendations in the [hardware requirements][1].

[Deployment architecture for Sensu][2] describes planning considerations and recommendations for a production-ready Sensu deployment, along with communication security details and diagrams showing single, clustered, and large-scale deployment architectures.

## Install Sensu

When you're ready to start using Sensu, the pathway you follow will depend on your monitoring and observability needs.
No matter which pathway you choose, you should begin with the [Install Sensu][3] guide.
If you just want to use Sensu locally, you can do that by installing Sensu according to the steps in the guide.
You can also use the Install Sensu guide to set up proof-of-concept and testing in a development environment.

## Deploy Sensu in production

To deploy Sensu for use outside of a local development environment, [install Sensu][3] and follow these guides to achieve a production-ready installation:

1. [Generate certificates][4], which you will need to secure a Sensu cluster and its agents.
2. [Secure your Sensu installation][5] using the certificates you generate to make Sensu production-ready.
3. [Run a Sensu cluster][6], a group of three or more sensu-backend nodes connected to a shared database, to improve Sensu's availability, reliability, and durability.
4. [Reach multi-cluster visibility][7] with federation so you can gain visibility into the health of your infrastructure and services across multiple distinct Sensu instances within a single web UI and mirror your changes in one cluster to follower clusters.

Read the [etcd replicators reference][9] to learn how the etcd-replicators datatype in the enterprise/federation/v1 API allows you to manage role-based access control (RBAC) resources in one place and mirror your changes to follower clusters.

## Scale your Sensu implementation

As the number of entities and checks in your Sensu implementation grows, so does the rate of events being written to the datastore.
In clustered etcd deployments, each event must be replicated to each cluster member, which increases network and disk IO utilization.

Sensu's Enterprise datastore allows you to configure an external PostgreSQL instance for event storage so you can [scale your monitoring and observability workflows][13] beyond etcd’s 8GB limit.
Scale your Sensu implementation to many thousands of events per second, achieve much higher rates of event processing, and minimize the replication communication between etcd peers.

Read the [datastore reference][14] for the Enterprise datastore requirements and specifications.

For deployments at scale, [configuration management tools][12] can help ensure repeatable Sensu deployments and consistent configuration among Sensu backends.
Ansible, Chef, and Puppet have well-defined Sensu modules to help you get started.


[1]: hardware-requirements/
[2]: deployment-architecture/
[3]: install-sensu/
[4]: generate-certificates/
[5]: secure-sensu/
[6]: cluster-sensu/
[7]: use-federation/
[8]: scale-event-storage/
[9]: etcdreplicators/
[12]: configuration-management/
[13]: scale-event-storage/
[14]: datastore/
