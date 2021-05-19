---
title: "Learn Sensu"
description: "Learn Sensu with a live web UI demo, a sandbox for building observability workflow,s and a glossary of Sensu terminology with links to in-depth documentation."
product: "Sensu Go"
version: "5.21"
weight: 110
layout: "single"
toc: true
menu:
  sensu-go-5.21:
    identifier: learn-sensu
---

The Learn Sensu category includes tools to help you understand and start using Sensu, the industry-leading observability pipeline for multi-cloud monitoring, consolidating monitoring tools, and filling observability gaps at scale.

## Glossary

If you're new to Sensu, start with a basic review of terminology in the [glossary][1] of definitions for common Sensu terms.
The glossary includes links to relevant reference documentation for more in-depth information.

## Live demo

Explore a [live demo][3] of the Sensu web UI: view the Entities page to see what Sensu is monitoring, the Events page to see the latest observability events, and the Checks page to see active service and metric checks.
The live demo also gives you a chance to try commands with [sensuctl][8], the Sensu command line tool.

## Sensu sandbox

For further learning opportunities, download the [Sensu sandbox][4].
Follow the sandbox lessons to [build your first monitoring and observability workflow][5] and [collect Prometheus metrics][6] with a Sensu check plugin.

We also have a GitHub lesson that guides you through [deploying a Sensu cluster and example application into Kubernetes][7], plus a configuration that allows you to reuse Nagios-style monitoring checks to monitor the example application with a Sensu sidecar.


[1]: glossary/
[3]: demo/
[4]: sandbox/
[5]: learn-sensu-sandbox/
[6]: prometheus-metrics/
[7]: https://github.com/sensu/sensu-k8s-quick-start#getting-started-with-sensu-go-on-kubernetes
[8]: ../sensuctl/
