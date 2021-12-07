---
title: "Sensu Core"
description: "Sensu is the open source monitoring event pipeline built to reduce operator burden and meet the challenges of monitoring hybrid-cloud and ephemeral infrastructures."
weight: -100
menu: "sensu-core-1.9"
version: "1.9"
product: "Sensu Core"
tags: ["sensu", "core", "sensu core", "1.4", "index"]
layout: "single"
---

<iframe src="https://ghbtns.com/github-btn.html?user=sensu&repo=sensu&type=star&count=true" frameborder="0" scrolling="0" width="95px" height="20px"></iframe> | <a href="https://docs.sensu.io/sensu-go/latest/">Learn about Sensu Go</a>

_**IMPORTANT**: [Sensu Core reached end-of-life (EOL) on December 31, 2019][21], more than 8 years after its inception as an open source software project, and we [permanently removed][32] the Sensu EOL repository on February 1, 2021.<br><br>To migrate to Sensu Go, read [Migrate from Sensu Core and Sensu Enterprise to Sensu Go][33]._

**These resources can help you migrate to [Sensu Go][24]**, the latest version of Sensu:

- [**Migrate from Sensu Core and Sensu Enterprise to Sensu Go**][33]: Review this step-by-step guide to installing Sensu Go and using the [translator][23] command-line tool to transfer your Sensu Core checks, handlers, and mutators to Sensu Go.
- [**Sensu Go documentation**][24]: Learn about the Sensu Go architecture and APIs. The [Sensu Go migration documentation][25] includes an overview of Sensu Go features.
- [**Sensu Community Slack**][26]: Join hundreds of other Sensu users in our Community Slack, where you can ask questions and benefit from tips others picked up during their own Sensu Go migrations.
- [**Sensu Community Forum**][27]: Drop a question in our dedicated category for migrating to Go.
- [**Sensu Go Sandbox**][28]: Download the sandbox and try out some monitoring workflows with Sensu Go.
- [**Sensu translator**][23]: Use this command-line tool to generate Sensu Go configurations from your Sensu Core config files.

We also offer **commercial support** and **professional services** packages to help with your Sensu Go migration. Learn more about [commercial support options][29] or contact our [Sales team][30].

----

Sensu is the open source monitoring event pipeline built to reduce operator burden and make developers and business owners happy.
Started in 2011, Sensu’s flexible approach solves the challenges of monitoring hybrid-cloud and ephemeral infrastructures with scalable, automated workflows and integrations with tools you already use.

**Automate your monitoring workflows**: Limitless pipelines let you validate and correlate events, mutate data formats, send alerts, manage incidents, collect and store metrics, and more.

<img alt="Sensu event pipeline diagram" title="Sensu lets you take monitoring events from your system and use pipelines to take the right action for your workflow." src="/images/pipeline.png">

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
[4]:  installation/installing-plugins/
[9]:  https://www.chef.io
[10]: https://puppetlabs.com
[11]: https://www.ansible.com
[12]: https://github.com/sensu/sensu/blob/master/MIT-LICENSE.txt
[13]: https://github.com/sensu/sensu
[14]: https://sensu.io/products/enterprise
[15]: installation/install-sensu-client
[16]: api/overview
[17]: reference/clients#proxy-clients
[18]: reference/filters
[19]: reference/checks/#check-hooks
[20]: /uchiwa/latest
[21]: https://blog.sensu.io/eol-schedule-for-sensu-core-and-enterprise
[23]: https://github.com/sensu/sensu-translator
[24]: https://docs.sensu.io/sensu-go/latest/
[25]: https://docs.sensu.io/sensu-go/latest/operations/maintain-sensu/migrate/
[26]: https://slack.sensu.io/
[27]: https://discourse.sensu.io/c/sensu-go/migrating-to-go
[28]: https://docs.sensu.io/sensu-go/latest/learn/sandbox/
[29]: https://sensu.io/support/
[30]: https://sensu.io/contact/
[32]: https://discourse.sensu.io/t/updated-eol-timeline-for-sensu-core-and-sensu-enterprise-repos/2396
[33]: /sensu-go/latest/operations/maintain-sensu/migrate/
