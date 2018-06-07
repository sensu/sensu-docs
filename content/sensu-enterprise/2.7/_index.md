---
title: "Sensu Enterprise"
product: "Sensu Enterprise"
version: "2.7"
weight: 1
menu: "sensu-enterprise-2.7"
layout: "single"
---

## Overview

- [What is Sensu Enterprise?](#what-is-sensu-enterprise)
- [Installing Sensu Enterprise](#installing-sensu-enterprise)
- [Upgrading to Sensu Enterprise](#upgrading-to-sensu-enterprise)

## What is Sensu Enterprise?

[Sensu Enterprise][1] is a drop-in replacement for Sensu Core (the FREE, open
source version of Sensu), that provides added-value features like [contact
routing][2], several built-in [third-party integrations][3], and more. Sensu
Enterprise also includes FREE annual training and [enterprise-class
support][5].

We like to think of the distinction between Sensu Core and Sensu Enterprise as
the difference between a framework and a product. The purpose of this
documentation is to help Sensu Enterprise users configure their installation,
making use of the many third-party integrations and features Sensu Enterprise
has to offer. Sensu Enterprise integrates with third-party tools & services to
provide support for creating/resolving incidents, on-call rotation scheduling,
storing time series data (metrics), relaying events, deregistering sensu-clients
for terminated nodes, and/or notifying contacts via various media.

## Installing Sensu Enterprise

Sensu Enterprise and Sensu Core both depend on Redis and RabbitMQ to provide
data store and transport architecture components. The Sensu Core monitoring
agent (sensu-client) is used regardless of whether Sensu Core or Sensu
Enterprise is used as the monitoring event processor.

Please see the [Sensu Core installation guide][8] for instructions on installing
Sensu Enterprise, Sensu Enterprise Dashboard and the `sensu-client` monitoring
agent.

## Upgrading to Sensu Enterprise

For those already running Sensu Core, Sensu Enterprise is designed to be a
drop-in replacement for the Sensu Core [server][6] and [API][7]. Once installed,
no configuration changes are required – simply terminate the
`sensu-server` and `sensu-api` processes, and start the `sensu-enterprise`
process to resume operation of your Sensu instance. Some configuration
changes may be required to take advantage of [third-party integrations][9]
or added-value features (e.g. [contact routing][2]).

[1]:  /sensu-enterprise
[2]:  contact-routing
[3]:  built-in-handlers
[5]:  https://sensu.io/resources/support
[6]:  /sensu-core/latest/reference/server
[7]:  /sensu-core/latest/api/overview
[8]:  /sensu-core/latest/installation/install-sensu-server-api/#sensu-enterprise
[9]:  integrations