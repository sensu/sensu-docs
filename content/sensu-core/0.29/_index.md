---
title: "Sensu Core"
description: "Sensu is the open source monitoring event pipeline built to reduce operator burden and meet the challenges of monitoring hybrid-cloud and ephemeral infrastructures."
date: 2017-07-21T13:06:31-07:00
weight: -100
menu: "sensu-core-0.29"
version: "0.29"
product: "Sensu Core"
tags: ["sensu", "core", "sensu core", "0.29", "index"]
layout: "single"
---

<iframe src="https://ghbtns.com/github-btn.html?user=sensu&repo=sensu&type=star&count=true" frameborder="0" scrolling="0" width="95px" height="20px"></iframe> | [Learn about Sensu Enterprise](/sensu-enterprise/latest/)

Sensu is the open source monitoring event pipeline built to reduce operator burden and make developers and business owners happy.
Started in 2011, Sensu’s flexible approach solves the challenges of monitoring hybrid-cloud and ephemeral infrastructures with scalable, automated workflows and integrations with tools you already use.
<b>Get started now and feel the #monitoringlove: [Learn Sensu in 15 minutes](quick-start/learn-sensu-basics/).</b>

**Automate your monitoring workflows**: Limitless pipelines let you validate and correlate events, mutate data formats, send alerts, manage incidents, collect and store metrics, and more.

<img alt="Sensu event pipeline diagram" title="Sensu lets you take monitoring events from your system and use pipelines to take the right action for your workflow." src="/images/pipeline.svg">

**Reduce alert fatigue**: Sensu gives you full control over your alerts with flexible filters, context-rich notifications, reporting, event handling, and auto-remediation.

**Integrate anywhere**: Sensu's open architecture makes it easy to integrate monitoring with tools you already use like Nagios plugins, Chef, Graphite, InfluxDB, and PagerDuty.

<i class="fa fa-youtube-play" aria-hidden="true"></i> <a target="_blank" href="https://www.youtube.com/watch?v=jUW4rAqazwA">Listen to Sensu Inc. CEO Caleb Hailey explain the Sensu monitoring event pipeline.</a>

### Monitoring for Your Infrastructure

> Monitoring is the action of observing and checking the behaviors and outputs of a system and its components over time. - [Greg Poirier, Monitorama 2016](https://vimeo.com/173610062)

<img alt="Sensu system diagram" src="/images/system.png">

Sensu is an agent-based monitoring tool that you install on your organization's infrastructure.
The Sensu client gives you visibility into everything you care about; the Sensu server gives you flexible, automated workflows to route metrics and alerts.

- **Monitor containers, instances, applications, and on-premises infrastructure**

Sensu is designed to monitor everything from the server closet to the cloud.
[Install the Sensu client][15] on the hosts you want to monitor, integrate with the [Sensu API][16], or take advantage of [proxy clients][17] to monitor anything on your network.
Sensu clients automatically register and de-register themselves with the Sensu server, so you can monitor ephemeral infrastructure without getting overloaded with alerts.

- **Better incident response with filterable, context-rich alerts**

Get meaningful alerts when and where you need them.
Use [event filters][18] to reduce noise and [check hooks][19] to add context and speed up incident response.
Sensu integrates with the tools and services your organization already uses like [PagerDuty][1], [Slack][2], and more.
Check out the [200+ plugins shared by the Sensu community][3], or write your own [Sensu Plugins][4] in any language.

- **Collect metrics and generate alerts with the same tool**

Know what's going on everywhere in your system.
Use the Sensu client to collect metrics alongside check results, then use the event pipeline to route the data to industry-standard tools like Graphite or InfluxDB.

- **Intuitive API and dashboard interfaces**

Sensu integrates automatically with the open source [Uchiwa dashboard][20] to provide a unified view of your clients, checks, and events, as well as a user-friendly silencing tool.
The Sensu [API][16] allows you (and your internal customers) to create checks, register clients, manage configuration, and more.

- **Open source software backed by Sensu Inc.**

Sensu Core is open source software freely available under a
permissive [MIT License][12] and publicly available on [GitHub][13].
For commercial support, out-of-the-box integrations, contact routing,
training, and other benefits, check out [Sensu Enterprise][14].

[1]:  https://www.pagerduty.com
[2]:  https://slack.com
[3]:  https://github.com/sensu-plugins
[4]:  /plugins/latest/reference/
[9]:  http://www.chef.io
[10]: https://puppetlabs.com
[11]: http://www.ansible.com
[12]: https://github.com/sensu/sensu/blob/master/MIT-LICENSE.txt
[13]: http://github.com/sensu/sensu
[14]: https://sensuapp.org/enterprise
[15]: installation/install-sensu-client
[16]: api/overview
[17]: reference/clients#proxy-clients
[18]: reference/filters
[19]: reference/checks/#check-hooks
[20]: /uchiwa/latest
