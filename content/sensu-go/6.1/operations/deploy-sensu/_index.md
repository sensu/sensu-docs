---
title: "Deploy Sensu"
description: "Deploy Sensu, the flexible observability pipeline built to reduce operator burden and meet the challenges of monitoring multi-cloud and ephemeral infrastructures. Install and deploy Sensu with our guided walkthroughs."
product: "Sensu Go"
version: "6.1"
weight: 10
layout: "single"
toc: true
menu:
  sensu-go-6.1:
    parent: operations
    identifier: deploy-sensu
---

Use the information and instructions in the Deploy Sensu category to install, configure, and deploy Sensu's flexible observability pipeline.

## Plan your deployment

Find Sensu agent and backend requirements and networking and cloud recommendations in the [hardware requirements][1].

Another good starting point is [Deployment architectures for Sensu][2], which describes planning considerations and recommendations for a production-ready Sensu deployment, along with communication security details and diagrams showing single, clustered, and large-scale deployment architectures.

## Install Sensu

When you're ready to start using Sensu, the pathway you follow will depend on your monitoring and observability needs.
No matter which pathway you choose, you should begin with the [Install Sensu][3] guide.
If you just want to use Sensu locally, you can do that by installing Sensu according to the steps in the guide.
You can also use the Install Sensu guide to set up proof-of-concept and testing in a development environment.

## Deploy for production

To deploy Sensu for use outside of a local development environment, after you install Sensu, you'll follow a few more guides to achieve a production-ready installation:

1. [Generate certificates][4], which you will need to secure a Sensu cluster and its agents.
2. [Secure your Sensu installation][5] using the certificates you generate to make Sensu production-ready.
3. [Run a Sensu cluster][6], a group of three or more sensu-backend nodes connected to a shared database, to improve Sensu's availability, reliability, and durability.
4. [Reach multi-cluster visibility][7] with federation so you can gain visibility into the health of your infrastructure and services across multiple distinct Sensu instances within a single web UI and mirror your changes in one cluster to follower clusters.

## Scale [heading tbd]

You can also [scale your monitoring and observability workflows][8] to many thousands of events per second with Enterprise datastore.


[1]: hardware-requirements/
[2]: deployment-architecture/
[3]: install-sensu/
[4]: generate-certificates/
[5]: secure-sensu/
[6]: cluster-sensu/
[7]: use-federation/
[8]: scale-event-storage/
