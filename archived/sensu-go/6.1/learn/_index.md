---
title: "Learn Sensu"
description: "Learn Sensu with a live web UI demo, a sandbox for building observability workflows, and a glossary of Sensu terminology with links to in-depth documentation."
product: "Sensu Go"
version: "6.1"
weight: 120
layout: "single"
toc: true
menu:
  sensu-go-6.1:
    identifier: learn-sensu
---

The Learn Sensu category includes tools to help you understand and start using Sensu, the industry-leading observability pipeline for multi-cloud monitoring, consolidating monitoring tools, and filling observability gaps at scale.

{{% notice protip %}}
**PRO TIP**: In addition to these learning resources, try the [self-guided Sensu Go Workshop](https://sensu.io/resources?type=workshop).
{{% /notice %}}

## Concepts and terminology

If you're new to Sensu, start with a basic review of Sensu [concepts and terminology][1], which includes definitions and links to relevant reference documentation for more in-depth information.

To visualize how Sensu concepts work together in the observability pipeline, [take the tour][6] &mdash; follow the `Next` buttons on each page.

## Live demo

Explore a [live demo][3] of the Sensu web UI: view the Entities page to learn what Sensu is monitoring, the Events page for the latest observability events, and the Checks page for active service and metric checks.
The live demo also gives you a chance to try commands with [sensuctl][8], the Sensu command line tool.

## Sensu sandbox

For further learning opportunities, download the [Sensu sandbox][4].
Follow the sandbox lessons to [build your first monitoring and observability workflow][5] with Sensu.

We also have a GitHub lesson that guides you through [deploying a Sensu cluster and example application into Kubernetes][7], plus a configuration that allows you to reuse Nagios-style monitoring checks to monitor the example application with a Sensu sidecar.


[1]: concepts-terminology/
[3]: demo/
[4]: sandbox/
[5]: learn-sensu-sandbox/
[6]: ../observability-pipeline/
[7]: https://github.com/sensu/sensu-k8s-quick-start#getting-started-with-sensu-go-on-kubernetes
[8]: ../sensuctl/
