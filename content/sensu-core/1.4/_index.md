---
title: "Sensu Core"
description: "Sensu is the open-source monitoring event pipeline built to reduce operator burden and meet the challenges of monitoring hybrid-cloud and container-based infrastructures."
weight: -100
menu: "sensu-core-1.4"
version: "1.4"
product: "Sensu Core"
tags: ["sensu", "core", "sensu core", "1.4", "index"]
layout: "single"
---

<iframe src="https://ghbtns.com/github-btn.html?user=sensu&repo=sensu&type=star&count=true" frameborder="0" scrolling="0" width="95px" height="20px"></iframe> | [Learn about Sensu Enterprise](/sensu-enterprise/latest/)

Sensu is the open-source monitoring event pipeline built to reduce operator burden and make developers and business owners happy.
Started in 2011, Sensu's pipeline approach solves the challenges of monitoring hybrid-cloud and container-based infrastructures with flexible, automated workflows and integrations with tools you already use.
<b>Get started now: [Learn Sensu in 15 minutes](quick-start/learn-sensu-basics/).</b>

<img src="/images/new-multi-pipe.jpeg">

**Automate Monitoring Workflows**: Take advantage of limitless pipelines to validate and correlate events, mutate data formats, send alerts, manage incidents, route metrics to time series databases, integrate with custom tooling, and more.

**Reduce Alert Fatigue**: Empower operators and developers with context-rich alerting, reporting, event handling, and auto-remediation.

**Replace Nagios**: Reuse Nagios plugins while consolidating monitoring tools with an architecture designed to sustain large scale deployments across multiple clouds.

<i class="fa fa-youtube-play" aria-hidden="true"></i> <a target="_blank" href="https://www.youtube.com/watch?v=jUW4rAqazwA">Hear Sensu Inc. CEO Caleb Hailey explain the Sensu monitoring event pipeline.</a>

### Monitoring for Your Infrastructure

> Monitoring is the action of observing and checking the behaviors and outputs of a system and its components over time. - [Greg Poirier, Monitorama 2016](https://vimeo.com/173610062)

<img src="/images/sys-context.jpeg">

Sensu allows organizations to craft monitoring workflows that meet unique business requirements.
By providing flexible pipelines, Sensu enables you to focus on _what_ to monitor, rather than _how_.
Sensu is installed on your organization's infrastructure&mdash;it is not a software-as-a-service solution&mdash;which means Sensu gives you full control over the availability of your monitoring solution.

- **Monitor containers, microservices, applications, and that server under your desk.**

Sensu is a flexible, scalable monitoring event pipeline that works with
everything from the server closet to Kubernetes. Using custom-built tools?
Write your own [Sensu plugins][4] in the language of your choice (Ruby, Go, Python, you name it)
or integrate with the Sensu API.

- **Improve incident response by sending context-rich alerts and notifications.**

Get meaningful alerts when and where you need them.
Sensu integrates with the tools and services your organization already
uses like [PagerDuty][1], [Slack][2], and more. Check out the
[100+ plugins shared by the Sensu community][3].

- **Support cloud-based infrastructure with dynamic client registration and de-registration.**

When servers are provisioned, they automatically register themselves with
Sensu, so there's no need to manually add or configure new servers.

- **Use infrastructure-as-code best practices and industry-standard tools.**

Sensu exposes 100% of its configuration as JSON files, making it easy
to integrate with tools like [Chef][9], [Puppet][10], and [Ansible][11].

- **Open source software backed by Sensu Inc.**

Sensu Core is open-source software freely available under a
permissive [MIT License][12] and publicly available on [GitHub][13].
For commercial support, out-of-the-box integrations, role-based access
control, training, and other benefits, check out [Sensu Enterprise][14].

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
