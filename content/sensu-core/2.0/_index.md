---
title: "Sensu Core"
description: "Sensu is the open source monitoring event pipeline built to reduce operator burden and meet the challenges of monitoring hybrid-cloud and ephemeral infrastructures."
date: 2018-02-05T06:06:31-07:00
weight: -100
menu: "sensu-core-2.0"
version: "2.0"
product: "Sensu Core"
tags: ["sensu", "core", "sensu core", "2.0", "index"]
layout: "single"
---

<iframe src="https://ghbtns.com/github-btn.html?user=sensu&repo=sensu-go&type=star&count=true" frameborder="0" scrolling="0" width="87px" height="20px"></iframe> | [Share your feedback][2]

## Welcome to the Sensu 2.0 Beta!

Sensu is the open source monitoring event pipeline built to reduce operator burden and make developers and business owners happy.
Started in 2011, Sensu’s flexible approach solves the challenges of monitoring hybrid-cloud and ephemeral infrastructures with scalable, automated workflows and integrations with tools you already use.

Sensu 2.0 is a new platform, written in Go and designed from the ground up to be more portable, easier and faster to deploy, and (even more) friendly to containerized and ephemeral environments.
But above all, it was designed to support the features and functionality you’ve come to know and love about Sensu.

**Get started with Sensu 2.0:**

- [Install the beta][1]
- [Greg Poirier - Sensu 2.0 Deep Dive at Sensu Summit 2017](https://www.youtube.com/watch?v=mfOk0mOfkvA)
- [Sensu 2.0 demo with Docker and Kubernetes](https://github.com/portertech/sensu-demo)

### Sensu 2.0 Features

- Limitless pipelines to validate and correlate events, mutate data formats, send alerts, manage incidents, collect and store metrics, and more
- Lightweight agent to monitor everything from the server closet to the cloud
- Powerful backend with built-in dashboard and transport
- New data model that makes metrics a first-class citizen
- API endpoints for managing handlers and mutators
- User-friendly [command line interface][3]
- [Built-in collection for StatsD metrics][4]
- [Role-based access control][5]

### Monitoring for Your Infrastructure

> Monitoring is the action of observing and checking the behaviors and outputs of a system and its components over time. - [Greg Poirier, Monitorama 2016](https://vimeo.com/173610062)

<img alt="Sensu system diagram" src="/images/system-ce.png">

Sensu is an agent-based monitoring tool that you install on your organization's infrastructure.
The Sensu agent gives you visibility into everything you care about; the Sensu server gives you flexible, automated workflows to route metrics and alerts.

- **Monitor containers, instances, applications, and on-premises infrastructure**

Sensu is designed to monitor everything from the server closet to the cloud.
[Install the Sensu agent][15] on the hosts you want to monitor, integrate with the Sensu API, or take advantage of [proxy entities][17] to monitor anything on your network.
Sensu agents automatically register and de-register themselves with the Sensu server, so you can monitor ephemeral infrastructure without getting overloaded with alerts.

- **Better incident response with filterable, context-rich alerts**

Get meaningful alerts when and where you need them.
Use [event filters][18] to reduce noise and [check hooks][19] to add context and speed up incident response.
Sensu integrates with the tools and services your organization already uses like [PagerDuty][6], [Slack][7], and more.
Check out the [200+ plugins shared by the Sensu community][8], or write your own [Sensu Plugins][9] in any language.

- **Collect metrics and generate alerts with the same tool**

Know what's going on everywhere in your system.
Use the Sensu agent to collect StatsD metrics alongside check results, then use the event pipeline to route the data to industry-standard tools like Graphite or InfluxDB.

- **Intuitive API and dashboard interfaces**

Sensu includes a dashboard to provide a unified view of your agents, checks, and events, as well as a user-friendly silencing tool.
The Sensu API and the `sensuctl` command-line tool allow you (and your internal customers) to create checks, register agents, manage configuration, and more.

- **Open source software backed by Sensu Inc.**

Sensu Core is open source software freely available under a
permissive [MIT License][12] and publicly available on [GitHub][13].

[1]: getting-started/installation-and-configuration/
[2]: http://slack.sensu.io/
[3]: reference/sensuctl
[4]: guides/aggregate-metrics-statsd
[5]: reference/rbac
[6]: https://www.pagerduty.com
[7]: https://slack.com
[8]: https://github.com/sensu-plugins
[9]: /plugins/latest/reference/
[12]: https://github.com/sensu/sensu-go/blob/master/LICENSE
[13]: https://github.com/sensu/sensu-go
[15]: getting-started/installation-and-configuration
[17]: guides/monitor-external-resources
[18]: reference/filters
[19]: reference/hooks
