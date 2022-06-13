---
title: "Sensu Go"
description: "Sensu is the industry-leading solution for multi-cloud monitoring at scale. The Sensu monitoring event pipeline empowers businesses to automate their monitoring workflows and gain deep visibility into their multi-cloud environments. Built by operators and for operators, open source is at the heart of the Sensu product and company, with an active, thriving community of contributors."
weight: -100
menu: "sensu-go-5.16"
version: "5.16"
product: "Sensu Go"
layout: "single"
---

<iframe src="https://ghbtns.com/github-btn.html?user=sensu&repo=sensu-go&type=star&count=true" frameborder="0" scrolling="0" width="87px" height="20px"></iframe> | [Learn about licensing][18]

Sensu is the industry-leading solution for multi-cloud monitoring at scale.
The Sensu monitoring event pipeline empowers businesses to automate their monitoring workflows and gain deep visibility into their multi-cloud environments.
Founded in 2017, Sensu offers a comprehensive monitoring solution for enterprises, providing complete visibility across every system, every protocol, every time — from Kubernetes to bare metal.
**Get started now and feel the #monitoringlove:** [Learn Sensu Go][1].

Sensu Go is the latest version of Sensu, designed to be more portable, easier and faster to deploy, and (even more) friendly to containerized and ephemeral environments.
Learn about [support packages](https://sensu.io/support) and [commercial features designed for monitoring at scale][18].

**Automate your monitoring workflows**: Limitless pipelines let you validate and correlate events, [mutate data formats][10], [send alerts][11], manage incidents, [collect and store metrics][12], and more.

<img alt="Sensu event pipeline diagram" title="Sensu lets you take monitoring events from your system and use pipelines to take the right action for your workflow." src="/images/archived_version_images/pipeline_ce.png">
<!-- Diagram source: https://www.lucidchart.com/documents/edit/84ff2574-4290-49dc-88e0-18b15ba373ec -->

**Reduce alert fatigue**: Sensu gives you full control over your alerts with flexible [filters][8], [context-rich notifications][19], reporting, [event handling][17], and auto-remediation.

**Integrate anywhere**: Sensu's open architecture makes it easy to integrate monitoring with tools you already use like Nagios plugins, Chef, Graphite, InfluxDB, and PagerDuty.

<i class="fa fa-youtube-play" aria-hidden="true"></i> <a target="_blank" href="https://www.youtube.com/watch?v=jUW4rAqazwA">Listen to Sensu Inc. CEO Caleb Hailey explain the Sensu monitoring event pipeline.</a>

## Monitoring for your infrastructure

> Monitoring is the action of observing and checking the behaviors and outputs of a system and its components over time. - [Greg Poirier, Monitorama 2016](https://vimeo.com/173610062)

<img alt="Sensu system diagram" src="/images/archived_version_images/system_ce.png">
<!-- Diagram source: https://www.lucidchart.com/documents/edit/edb92c4b-101c-4c3f-89ec-a00c889a6b05 -->

Sensu is an agent-based monitoring tool that you install on your organization's infrastructure.
The Sensu agent gives you visibility into everything you care about.
The Sensu backend gives you flexible, automated workflows to route metrics and alerts.

### Monitor containers, instances, applications, and on-premises infrastructure

Sensu is designed to monitor everything from the server closet to the cloud.
[Install the Sensu agent][6] on the hosts you want to monitor, integrate with the [Sensu API][13], or take advantage of [proxy entities][7] to monitor anything on your network.
Sensu agents automatically register and de-register themselves with the Sensu backend, so you can monitor ephemeral infrastructure without getting overloaded with alerts.

### Better incident response with filterable, context-rich alerts

Get meaningful alerts when and where you need them.
Use [event filters][8] to reduce noise and [check hooks][9] to add context and speed up incident response.
Sensu integrates with the tools and services your organization already uses like [PagerDuty][21], [Slack][19], and more.
Check out [Bonsai, the Sensu asset index][20], or write your own [Sensu plugins][3] in any language.

### Collect and store metrics with built-in support for industry-standard tools

Know what's going on everywhere in your system.
Sensu supports industry-standard [metric formats][10] like Nagios performance data, Graphite plaintext protocol, InfluxDB line protocol, OpenTSDB data specification, and [StatsD metrics][14].
Use the Sensu agent to collect metrics alongside check results, then use the event pipeline to route the data to a time series database like [InfluxDB][2].

### Intuitive API and dashboard interfaces

Sensu includes a [dashboard][15] to provide a unified view of your entities, checks, and events, as well as a user-friendly silencing tool.
The [Sensu API][13] and the [`sensuctl` command-line tool][16] allow you (and your internal customers) to create checks, register entities, manage configuration, and more.

### Open core software backed by Sensu Inc.

Sensu Go's core is open source software, freely available under a permissive [MIT License][4] and publicly available on [GitHub][5].
Learn about [support packages](https://sensu.io/support) and [commercial features designed for monitoring at scale][18].

[1]: getting-started/get-started/
[2]: https://www.influxdata.com/
[3]: https://docs.sensu.io/plugins/latest/reference/
[4]: https://www.github.com/sensu/sensu-go/blob/master/LICENSE/
[5]: https://www.github.com/sensu/sensu-go/
[6]: installation/install-sensu#install-sensu-agents
[7]: guides/monitor-external-resources/
[8]: reference/filters/
[9]: reference/hooks/
[10]: guides/extract-metrics-with-checks/
[11]: guides/send-slack-alerts/
[12]: guides/influx-db-metric-handler/
[13]: api/overview/
[14]: guides/aggregate-metrics-statsd/
[15]: dashboard/overview/
[16]: sensuctl/reference/
[17]: reference/handlers/
[18]: getting-started/enterprise/
[19]: https://bonsai.sensu.io/assets/sensu/sensu-slack-handler/
[20]: https://bonsai.sensu.io/
[21]: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler/
