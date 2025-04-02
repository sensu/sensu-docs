---
title: "Learn Sensu"
description: "Learn Sensu with a self-guided workshop, live web UI demo, and a glossary of Sensu terminology with links to in-depth documentation."
product: "Sensu Go"
version: "6.13"
weight: 120
layout: "single"
toc: true
menu:
  sensu-go-6.13:
    identifier: learn-sensu
---

The Learn Sensu category includes tools to help you understand and start using Sensu, the industry-leading observability pipeline for multi-cloud monitoring, consolidating monitoring tools, and filling observability gaps at scale.

## Concepts and terminology

If you're new to Sensu, start with a basic review of Sensu [concepts and terminology][1], which includes definitions and links to relevant reference documentation for more in-depth information.

To visualize how Sensu concepts work together in the observability pipeline, [take the tour][6] &mdash; follow the `Next` buttons on each page.

## Sensu Go workshop

The [Sensu Go workshop][4] is a collection of resources designed to help you learn Sensu:

- Interactive lessons designed for self-guided learning.
- Detailed instructions for Linux, macOS, and Windows workstations.
- A local sandbox environment for use with the workshop (via Docker Compose or Vagrant)

Additional workshop materials are available for advanced use cases, including instructor-led workshops with a multi-tenant sandbox environment and alternative sandbox environments based on popular Sensu reference architectures like InfluxDB, TimescaleDB, Elasticsearch, and Prometheus.

[Follow the workshop lessons][4] to build your first observability workflow with Sensu.

## Live demo

Explore a [live demo][3] of the Sensu web UI: view the Entities page to learn what Sensu is monitoring, the Events page for the latest observability events, and the Checks page for active service and metric checks.
The live demo also gives you a chance to try commands with [sensuctl][8], the Sensu command line tool.

## Monitor containers and applications

Follow the instructions for [Getting Started with Sensu Go on Kubernetes][5] to deploy a Sensu cluster and an example application (NGINX) into Kubernetes with a Sensu agent sidecar.
You’ll also learn to use sensuctl to configure Nagios-style monitoring checks to monitor the example application with a Sensu sidecar.


[1]: concepts-terminology/
[3]: demo/
[4]: https://github.com/sensu/sensu-go-workshop#overview
[5]: https://github.com/sensu/sensu-k8s-quick-start
[6]: ../observability-pipeline/
[8]: ../sensuctl/
