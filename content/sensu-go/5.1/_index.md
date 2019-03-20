---
title: "Sensu Go"
description: "Monitor your entire infrastructure, from Kubernetes to bare metal. The Sensu monitoring event pipeline empowers businesses to automate their monitoring workflows and gain deep visibility into their infrastructure, applications, and operations. Read the docs to learn more about Sensu."
date: 2018-02-05T06:06:31-07:00
weight: -100
menu: "sensu-go-5.1"
version: "5.1"
product: "Sensu Go"
layout: "single"
---

<iframe src="https://ghbtns.com/github-btn.html?user=sensu&repo=sensu-go&type=star&count=true" frameborder="0" scrolling="0" width="87px" height="20px"></iframe> | [Share your feedback][2]

Sensu is the industry leading solution for multi-cloud monitoring at scale. The Sensu monitoring event pipeline empowers businesses to automate their monitoring workflows and gain deep visibility into their multi-cloud environments. Founded in 2017, Sensu offers a comprehensive monitoring solution for enterprises, providing complete visibility across every system, every protocol, every time — from Kubernetes to bare metal.
**Get started now and feel the #monitoringlove:** [Learn Sensu Go][1].

Sensu Go is the latest version of Sensu, designed to be more portable, easier and faster to deploy, and (even more) friendly to containerized and ephemeral environments.

**Automate your monitoring workflows**: Limitless pipelines let you validate and correlate events, [mutate data formats][20], [send alerts][21], manage incidents, [collect and store metrics][22], and more.

<img alt="Sensu event pipeline diagram" title="Sensu lets you take monitoring events from your system and use pipelines to take the right action for your workflow." src="/images/pipeline-ce.svg">

**Reduce alert fatigue**: Sensu gives you full control over your alerts with flexible [filters][18], [context-rich notifications][19], reporting, [event handling][27], and auto-remediation.

**Integrate anywhere**: Sensu's open architecture makes it easy to integrate monitoring with tools you already use like Nagios plugins, Chef, Graphite, InfluxDB, and PagerDuty.

<i class="fa fa-youtube-play" aria-hidden="true"></i> <a target="_blank" href="https://www.youtube.com/watch?v=jUW4rAqazwA">Listen to Sensu Inc. CEO Caleb Hailey explain the Sensu monitoring event pipeline.</a>

### Monitoring for Your Infrastructure

> Monitoring is the action of observing and checking the behaviors and outputs of a system and its components over time. - [Greg Poirier, Monitorama 2016](https://vimeo.com/173610062)

<img alt="Sensu system diagram" src="/images/system-ce.png">

Sensu is an agent-based monitoring tool that you install on your organization's infrastructure.
The Sensu agent gives you visibility into everything you care about; the Sensu server gives you flexible, automated workflows to route metrics and alerts.

- **Monitor containers, instances, applications, and on-premises infrastructure**

Sensu is designed to monitor everything from the server closet to the cloud.
[Install the Sensu agent][15] on the hosts you want to monitor, integrate with the [Sensu API][23], or take advantage of [proxy entities][17] to monitor anything on your network.
Sensu agents automatically register and de-register themselves with the Sensu server, so you can monitor ephemeral infrastructure without getting overloaded with alerts.

- **Better incident response with filterable, context-rich alerts**

Get meaningful alerts when and where you need them.
Use [event filters][18] to reduce noise and [check hooks][19] to add context and speed up incident response.
Sensu integrates with the tools and services your organization already uses like [PagerDuty][31], [Slack][29], and more.
Check out [Bonsai, the Sensu asset index][30], or write your own [Sensu Plugins][9] in any language.

- **Collect and store metrics with built-in support for industry-standard tools**

Know what's going on everywhere in your system.
Sensu supports industry-standard [metric formats][20] like Nagios Performance Data, Graphite Plaintext Protocol, InfluxDB Line Protocol, OpenTSDB Data Specification, and [StatsD metrics][24].
Use the Sensu agent to collect metrics alongside check results, then use the event pipeline to route the data to a time series database like [InfluxDB][6].

- **Intuitive API and dashboard interfaces**

Sensu includes a [dashboard][25] to provide a unified view of your entities, checks, and events, as well as a user-friendly silencing tool.
The [Sensu API][23] and the [`sensuctl` command-line tool][26] allow you (and your internal customers) to create checks, register entities, manage configuration, and more.

- **Open core software backed by Sensu Inc.**

Sensu Go's core is open source software, freely available under a
permissive [MIT License][12] and publicly available on [GitHub][13].

[1]: getting-started/get-started
[2]: http://slack.sensu.io/
[3]: reference/sensuctl
[4]: guides/aggregate-metrics-statsd
[5]: reference/rbac
[6]: https://influxdata.com
[7]: https://slack.com
[8]: https://github.com/sensu-plugins
[9]: /plugins/latest/reference/
[12]: https://github.com/sensu/sensu-go/blob/master/LICENSE
[13]: https://github.com/sensu/sensu-go
[15]: installation/install-sensu#install-the-sensu-agent
[17]: guides/monitor-external-resources
[18]: reference/filters
[19]: reference/hooks
[20]: guides/extract-metrics-with-checks
[21]: guides/send-slack-alerts/
[22]: guides/influx-db-metric-handler/
[23]: api/overview
[24]: guides/aggregate-metrics-statsd/
[25]: dashboard/overview
[26]: sensuctl/reference
[27]: reference/handlers
[31]: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler
[29]: https://bonsai.sensu.io/assets/sensu/sensu-slack-handler
[30]: https://bonsai.sensu.io
