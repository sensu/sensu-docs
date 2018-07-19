---
title: "Sensu Core"
description: "Sensu is an infrastructure and application monitoring and telemetry solution that provides a framework for monitoring infrastructure, service & application health, and business KPIs."
date: 2017-07-21T13:06:31-07:00
weight: -100
menu: "sensu-core-1.4"
version: "1.4"
product: "Sensu Core"
tags: ["sensu", "core", "sensu core", "1.4", "index"]
layout: "single"
---

<iframe src="https://ghbtns.com/github-btn.html?user=sensu&repo=sensu&type=star&count=true" frameborder="0" scrolling="0" width="95px" height="20px"></iframe> | [Learn about Sensu Enterprise](/sensu-enterprise/latest/)

Sensu is the open-source monitoring event pipeline built to reduce operator burden and make developers and business owners happy.
Started in 2011, Sensu's pipeline approach solves the challenges of monitoring hybrid-cloud and ephemeral infrastructures with flexible, automated workflows and integrations with tools you already use.
<b>Get started now: [Learn Sensu in 15 minutes](quick-start/learn-sensu-basics/).</b>

<img src="/images/simple-pipe.jpeg">

**Replace Nagios**: Keep running Nagios plugins and consolidate monitoring tools with an architecture designed to sustain large scale deployments across multiple clouds.

**Empower Dev & Ops**: Automate system reliability and improve SRE retention. Sensu provides a single platform for availability and performance monitoring.

**Limitless Pipelines**: Validate and correlate events, send alerts, manage incidents, update CMDBs, trigger automated remediations, route telemetry data to TSDBs, and more.

<img src="/images/multi-pipe.jpeg">

### Monitoring for your Infrastructure

> Monitoring is the action of observing and checking the behaviors and outputs of a system and its components over time. - [@grepory](https://twitter.com/grepory), [Monitorama 2016](https://vimeo.com/173610062)

<img src="/images/sys-context.jpeg">

Sensu allows organizations to compose comprehensive monitoring & telemetry
solutions to meet unique business requirements. By providing a platform to build
upon, Sensu enables you to focus on _what_ to monitor and measure, rather than
_how_. Sensu is installed on your organizations infrastructure &ndash; it is not
a Software-as-a-Service (SaaS) solution &ndash; which means Sensu gives you full
control over the availability of your monitoring solution.

### Benefits

Sensu is a comprehensive infrastructure and application monitoring solution that
provides the following benefits:

- **Monitor servers, services, application health, and business KPIs**

  Sensu is an infrastructure and application monitoring & telemetry solution.

- **Send alerts and notifications**

  Sensu integrates with the tools and services your organization is already
  using to do things like send emails, [PagerDuty][1] alerts, [Slack][2],
  [HipChat][3], IRC notifications, and [many][4] [more][5].

- **Dynamic client registration & de-registration**

  When servers are provisioned, they automatically register themselves with
  Sensu, so there's no need to manually add or configure new servers.

- **A simple yet extensible model for monitoring**

  Sensu provides a sophisticated, yet simple to understand solution for
  executing [service checks][6] and [processing events][7] at scale. Service
  checks provide status and telemetry data, and event handlers process results.
  Hundreds of plugins are available for monitoring the tools and services you're
  already using. Plugins have a very simple specification, and can be written in
  any programming language.

- **Built for mission-critical applications and multi-tiered networks**

  Sensu's use of a [secure transport][8] protects your infrastructure from
  exposure and makes it possible for Sensu to traverse complex network
  topologies, including those that use NAT and VPNs, and span public networks.
  Sensu provides a secure monitoring solution trusted by international banking
  institutions, government agencies, Fortune 100 organizations, and many more.

- **Designed for automation**

  Sensu exposes 100% of its configuration as JSON files, which makes it
  extremely automation&ndash;friendly (e.g. it was designed to work with tools
  like [Chef][9], [Puppet][10], and [Ansible][11]).

- **Open source software with commercial support**

  Sensu is an open-source software (OSS) project, made freely available under a
  permissive [MIT License][12] (the source code is publicly available
  on [GitHub][13]). [Sensu Enterprise][14] is based on
  Sensu Core (the OSS version of Sensu) which makes added-value features,
  commercial support, training, and many other benefits available under the
  [Sensu License][15].

  [1]:  https://www.pagerduty.com
  [2]:  https://slack.com
  [3]:  http://www.hipchat.com
  [4]:  /plugins/latest/reference/
  [5]:  /sensu-enterprise/latest/built-in-handlers
  [6]:  /sensu-core/latest/overview/what-is-sensu/#service-checks
  [7]:  /sensu-core/latest/overview/what-is-sensu/#event-processing
  [8]:  /sensu-core/latest/overview/architecture/#secure-transport
  [9]:  http://www.chef.io
  [10]: https://puppetlabs.com
  [11]: http://www.ansible.com
  [12]: https://github.com/sensu/sensu/blob/master/MIT-LICENSE.txt
  [13]: http://github.com/sensu
  [14]: https://sensuapp.org/enterprise
  [15]: https://sensuapp.org/sensu-license
