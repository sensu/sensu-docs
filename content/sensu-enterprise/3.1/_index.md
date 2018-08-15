---
title: "Sensu Enterprise"
description: "Sensu Enterprise is the reliable, scalable monitoring event pipeline built to reduce operator burden and meet the challenges of monitoring hybrid-cloud and containerized infrastructures."
product: "Sensu Enterprise"
version: "3.1"
weight: 1
menu: "sensu-enterprise-3.1"
layout: "single"
---

[Get started with a free trial of Sensu Enterprise][1] | [Learn about upgrading from Sensu Core][24]

Sensu Enterprise is the reliable, scalable monitoring event pipeline built to reduce operator burden and make developers and business owners happy.
Built on [Sensu Core][3], Sensu Enterprise includes built-in integrations and features designed to solve your organization's unique monitoring challenges.

**Automate your monitoring workflows**: Limitless pipelines let you validate and correlate events, mutate data formats, send alerts, manage incidents, collect and store metrics, and more.

<img alt="Sensu Enterprise event pipeline diagram" title="Sensu Enterprise lets you take monitoring events from your system and use pipelines to take the right action for your workflow." src="/images/pipeline-enterprise.svg">

<i class="fa fa-youtube-play" aria-hidden="true"></i> <a target="_blank" href="https://www.youtube.com/watch?v=jUW4rAqazwA">Listen to Sensu Inc. CEO Caleb Hailey explain the Sensu monitoring event pipeline.</a>

**Reduce alert fatigue**: Sensu Enterprise gives you full control over your alerts with flexible filters, context-rich notifications, reporting, event handling, and auto-remediation.

**Integrate anywhere**: With [over 20 built-in handlers][4], Sensu Enterprise makes it easy to integrate monitoring with tools you already use like [email][5], [PagerDuty][6], [Slack][7], [Puppet][8], [Chef][9], [InfluxDB][10], [DataDog][11], and even [SNMP][12].

**Get enterprise-class support**: Every Sensu Enterprise subscription includes [Enterprise Support][13], an SLA that guarantees a four-hour response and a next-business-day resolution. Upgrade to Premium Support for 24x7 support, faster response times, training, and more.

### Monitoring for Your Infrastructure

> Monitoring is the action of observing and checking the behaviors and outputs of a system and its components over time. - [Greg Poirier, Monitorama 2016](https://vimeo.com/173610062)

<img alt="Sensu Enterprise system diagram" src="/images/system-enterprise.png">

Sensu Enterprise is an agent-based monitoring tool that you install on your organization's infrastructure.
The Sensu client gives you visibility into everything you care about; the Sensu Enterprise server gives you flexible, automated workflows to route metrics and alerts; and the Sensu Enterprise Dashboard gives you a heads-up-display view into the state of your systems.

- **Monitor containers, instances, applications, and on-premises infrastructure**

Sensu Enterprise is designed to monitor everything from the server closet to the cloud.
[Install the Sensu client][14] on the hosts you want to monitor, integrate with the [Sensu Enterprise API][15], or take advantage of [proxy clients][16] to monitor anything on your network.
Sensu clients automatically register and de-register themselves with the Sensu server, so you can monitor ephemeral infrastructure without getting overloaded with alerts.

- **Better incident response with filterable, context-rich alerts**

Get meaningful alerts when and where you need them.
Use [event filters][17] to reduce noise and [check hooks][19] to add context and speed up incident response.
Sensu Enterprise includes built-in integrations with the tools and services your organization already uses like [PagerDuty][20], [Slack][21], and more.

- **Collect metrics and generate alerts with the same tool**

Know what's going on everywhere in your system.
Use the Sensu client to collect metrics alongside check results, then use the event pipeline to route the data to industry-standard tools like Graphite or InfluxDB.

- **Reduce mean time to recovery with contact routing**

Every incident or outage has an ideal first responder, a team or individual with the knowledge to triage and address the issue. Sensu Enterprise [contact routing][23] makes it possible to assign checks to specific teams and individuals, reducing mean time to incident response and recovery.

- **Intuitive API and dashboard interfaces**

Sensu Enterprise includes a [dashboard][18] to provide a unified view of your clients, checks, and events, as well as a user-friendly silencing tool, all-in-one heads-up display, and [role-based access control][25].
The [Sensu Enterprise API][15] allows you (and your internal customers) to create checks, register clients, manage configuration, and more.

**Sensu Enterprise Dashboard:**

<img alt="screenshot of Sensu Enterprise Dashboard" src="/images/enterprise-dashboard-hud-hero.png" width="400px">

## Installing Sensu Enterprise

Sensu Enterprise builds on the same architecture as Sensu Core.
Please see the [Sensu installation guide][22] for instructions on installing
Sensu Enterprise, the Sensu Enterprise Dashboard, and the Sensu client.

## Upgrading to Sensu Enterprise

For those already running Sensu Core, Sensu Enterprise is designed to be a
drop-in replacement for the Sensu Core server and API. Once installed,
no configuration changes are required – simply terminate the
`sensu-server` and `sensu-api` processes, and start the `sensu-enterprise`
process to resume operation of your Sensu instance. Some configuration
changes may be required to take advantage of [built-in integrations][4]
or added-value features like [contact routing][23].

[1]: https://account.sensu.io/users/sign_up?plan=silver
[2]: #upgrading-to-sensu-enterprise
[3]: /sensu-core/latest
[4]: built-in-handlers/#list-of-built-in-handlers
[5]: integrations/email
[6]: integrations/pagerduty
[7]: integrations/slack
[8]: integrations/puppet
[9]: integrations/chef
[10]: integrations/influxdb
[11]: integrations/datadog
[12]: integrations/snmp
[13]: https://sensu.io/features/support
[14]: /sensu-core/latest/installation/install-sensu-client
[15]: api
[16]: /sensu-core/latest/reference/clients#proxy-clients
[17]: built-in-filters
[18]: /sensu-enterprise-dashboard/latest
[19]: /sensu-core/latest/reference/checks/#check-hooks
[20]:  https://www.pagerduty.com
[21]:  https://slack.com
[22]: /sensu-core/latest/installation/overview
[23]: contact-routing
[24]: #upgrading-to-sensu-enterprise
[25]: /sensu-enterprise-dashboard/latest/rbac/overview
