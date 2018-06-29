---
title: "Sensu Core"
description: "Sensu is an infrastructure and application monitoring and telemetry solution that provides a framework for monitoring infrastructure, service & application health, and business KPIs."
date: 2017-07-21T13:06:31-07:00
weight: -100
menu: "sensu-core-1.1"
version: "1.1"
product: "Sensu Core"
tags: ["sensu", "core", "sensu core", "1.1", "index"]
layout: "single"
---

Sensu is an infrastructure and application monitoring and telemetry solution.
Sensu provides a framework for monitoring infrastructure, service & application
health, and business KPIs. Sensu is specifically designed to solve monitoring
challenges introduced by modern infrastructure platforms with a mix of static,
dynamic, and ephemeral infrastructure at scale (i.e. public, private, and hybrid
clouds).

Sensu allows organizations to compose comprehensive monitoring & telemetry
solutions to meet unique business requirements. By providing a platform to build
upon, Sensu enables you to focus on _what_ to monitor and measure, rather than
_how_. Sensu is installed on your organizations infrastructure &ndash; it is not
a Software-as-a-Service (SaaS) solution &ndash; which means Sensu gives you full
control over the availability of your monitoring solution.

## Get Started

- [The Five Minute Install](quick-start/five-minute-install/)
- [Learn Sensu in 15 Minutes](quick-start/learn-sensu-basics/)
- [Intro to Checks](guides/intro-to-checks)

## Benefits

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
