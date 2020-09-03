---
title: "Sensu Go"
description: "Sensu is the industry-leading solution for multi-cloud observability at scale. The Sensu observability pipeline empowers businesses to automate observability and monitoring workflows and gain deep visibility into their multi-cloud environments. Built by operators and for operators, open source is at the heart of the Sensu product and company, with an active, thriving community of contributors."
weight: -100
menu: "sensu-go-6.0"
version: "6.0"
product: "Sensu Go"
layout: "single"
---

<iframe src="https://ghbtns.com/github-btn.html?user=sensu&repo=sensu-go&type=star&count=true" frameborder="0" scrolling="0" width="87px" height="20px"></iframe> | <a href="https://docs.sensu.io/sensu-go/latest/commercial/">Learn about licensing</a>

Sensu is a complete solution for monitoring and observability at scale.
Sensu Go is designed to give you visibility into everything you care about: traditional server closets, containers, applications, the cloud, and more.

**<button onclick="window.location.href='observability-pipeline';">Take a tour</button> or click any element in the Sensu observability pipeline to jump to it.**

<!--Source at ADD LINK IF WE USE THIS IMAGE-->

Sensu is an agent-based observability tool that you install on your organization's infrastructure.
The Sensu backend gives you a flexible, automated pipeline to filter, transform, and process alerts and metrics.

Sensu Go is [operator-focused][11] and [developer-friendly][20] and [integrates][7] with popular monitoring and observability tools.
Deploy Sensu Go for on-premises and public cloud infrastructures, containers, bare metal, or any other environment.

**[Get started now][1] and feel the #monitoringlove**.

## Filtered, context-rich alerts that improve incident response

Get meaningful alerts when and where you need them so you can reduce alert fatigue and speed up incident response.
Sensu gives you full control over your alerts with flexible [event filters][8], [check hooks][9] for context-rich notifications, reporting, [observation data handling][24], and auto-remediation.

Sensu's open architecture integrates with the tools and services you already use, like [Ansible, Chef, and Puppet][23]; [PagerDuty][19]; [Slack][17]; and more.
Check out [Bonsai, the Sensu asset index][18], or write your own [Sensu plugins][3] in any language.

## Automate with agent registration-deregistration and check subscriptions

Sensu agents automatically [register and deregister][21] themselves with the Sensu backend so you can collect observation data about ephemeral infrastructure without getting overloaded with alerts.

Instead of setting up traditional one-to-one entity-to-check mapping, use Sensu's subscriptions to make sure your entities automatically run the appropriate checks for their functionality.

## Built-in support for industry-standard tools

Know what's going on everywhere in your system.
Sensu supports industry-standard [metric formats][10] like Nagios performance data, Graphite plaintext protocol, InfluxDB line protocol, OpenTSDB data specification, and [StatsD metrics][14].
Use the Sensu agent to collect metrics alongside check results, then use the Sensu observability pipeline to route observation data to a time series database like [InfluxDB][2].

## Intuitive API with command line and web interfaces

The [Sensu API][13] and the [`sensuctl` command-line tool][16] allow you (and your internal customers) to create checks, register entities, manage configuration, and more.
Sensu includes a [web UI][15] to provide a unified view of your entities, checks, and events, as well as a user-friendly silencing tool.

## Open core software backed by Sensu Inc.

Sensu Go's core is open source software, freely available under a permissive [MIT License][4] and publicly available on [GitHub][5].
Learn about [support packages][22] and [commercial features designed for observability at scale][12].

Founded in 2017, Sensu offers a comprehensive monitoring and observability solution for enterprises, providing complete visibility across every system, every protocol, every time — from Kubernetes to bare metal.
Sensu Go is the latest version of Sensu, designed to be portable, straightforward to deploy, and friendly to containerized and ephemeral environments.


[1]: get-started/
[2]: https://www.influxdata.com/
[3]: https://docs.sensu.io/plugins/latest/reference/
[4]: https://www.github.com/sensu/sensu-go/blob/master/LICENSE/
[5]: https://www.github.com/sensu/sensu-go/
[6]: operations/deploy-sensu/cluster-sensu/
[7]: #built-in-support-for-industry-standard-tools
[8]: observability-pipeline/observe-filter/filters/
[9]: observability-pipeline/observe-schedule/hooks/
[10]: observability-pipeline/observe-schedule/extract-metrics-with-checks/
[11]: #intuitive-api-with-command-line-and-web-interfaces
[12]: commercial/
[13]: api/
[14]: observability-pipeline/observe-process/aggregate-metrics-statsd/
[15]: web-ui/
[16]: sensuctl/
[17]: https://bonsai.sensu.io/assets/sensu/sensu-slack-handler/
[18]: https://bonsai.sensu.io/
[19]: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler/
[20]: #filtered-context-rich-alerts-that-improve-incident-response
[21]: observability-pipeline/observe-schedule/agent/#registration-events
[22]: https://sensu.io/support
[23]: operations/deploy-sensu/configuration-management/
[24]: observability-pipeline/observe-process/handlers/
