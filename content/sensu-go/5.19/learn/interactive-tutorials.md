---
title: "Learn Sensu with interactive tutorials"
linkTitle: "Interactive tutorials"
description: "Learn Sensu using only your browser. These tutorials demonstrate how to use Sensu to automate your workflows, integrate with tools you're already using, and get complete control over your alerts."
weight: 20
toc: false
version: "5.19"
product: "Sensu Go"
menu:
  sensu-go-5.19:
    parent: learn-sensu
---

Sensu is the industry-leading telemetry and service health-checking solution for multi-cloud monitoring at scale.

Our interactive training tutorials help you get started with Sensu Go, using only your browser.
With these tutorials, you can learn how to automate your monitoring workflows, gain deep visibility into systems that are important to your business operations, get complete control over your alerts, and integrate anywhere, including with the tools you're already using.

## Learn Sensu in 15 minutes

This interactive tutorial demonstrates how to:

- Deploy a basic Sensu stack.
- Log in to the Sensu web UI.
- Create a monitoring event and use Sensu to send alerts based on the event to a Slack channel.
- Use a Sensu agent to automatically produce events, then store event data with InfluxDB and visualize it with Grafana.

[Launch **Learn Sensu in 15 minutes**][1].

## Up and running with Sensu Go

This interactive tutorial will help you get Sensu Go up and running from scratch, using only your browser.
We've provisioned a CentOS 7 host for you, with an Nginx webserver already installed and running.
When you complete this tutorial, your system will have both the Sensu backend and agent running to monitor the local Nginx service.

[Launch **Up and running with Sensu Go**][2].

## Send Sensu Go alerts to PagerDuty

When you complete this interactive tutorial, your Sensu Go backend will be configured with a handler that will send critical alerts to your PagerDuty account.
In this scenario, you will:

- Add a Sensu Nagios Foundation asset.
- Add the PagerDuty asset and create a handler that uses your PagerDuty API key.
- Send an alert for a Sensu Go event to PagerDuty.

[Launch **Send Sensu Go alerts to PagerDuty**][3].


[1]: ../learn-in-15/
[2]: ../up-and-running/
[3]: ../sensu-pagerduty
