---
title: "Sensu sandbox"
linkTitle: "Sandbox"
description: "The Sensu sandbox helps you learn Sensu Go. Build your first monitoring workflow, set up container and application monitoring, and use Sensu and Prometheus in parallele to collect and route metrics. There’s also a lesson plan for upgrading from Sensu Core 1.x to Sensu Go!"
version: "5.21"
weight: 40
product: "Sensu Go"
menu:
  sensu-go-5.21:
    parent: learn-sensu
---

Welcome to the Sensu sandbox! The sandbox is a great place to get started with Sensu and try out new features.

## Learn Sensu in the sandbox

Download the Sensu sandbox and [build your first monitoring workflow][1] to send keepalive alerts to Slack.
The Learn Sensu sandbox is a CentOS 7 virtual machine pre-installed with Sensu, InfluxDB, and Grafana.

## Monitor containers and applications

Follow the instructions for [Getting Started with Sensu Go on Kubernetes][2] to deploy a Sensu cluster and an example application (NGINX) into Kubernetes with a Sensu agent sidecar.
You'll also learn to use sensuctl to configure a Nagios-style monitoring check for the example application.

## Collect metrics

The Prometheus ecosystem's exporters expose metrics that Sensu can collect and route to one or more time-series databases.
Follow [Collect Prometheus metrics with Sensu][3] to run Sensu and Prometheus in parallel and make use of environments where you've already deployed Prometheus.

Learn to configure the Sensu Prometheus Collector check plugin to collect metrics from a Prometheus exporter or the Prometheus query API.
Then, use Sensu to route the collected metrics to the time-series database InfluxDB and query InfluxDB to display the collected metrics with Grafana.

## Upgrade from Sensu Core 1.x to Sensu Go

Use the [Sensu translator][4] to translate check configurations from Sensu Core 1.x to Sensu Go and learn how to visually inspect and adjust check token substitution and extended attributes to make sure your Core checks work properly in Sensu Go.


[1]: ../learn-sensu-sandbox/
[2]: https://github.com/sensu/sensu-k8s-quick-start
[3]: ../../learn/prometheus-metrics/
[4]: https://www.github.com/sensu/sandbox/tree/main/sensu-go/lesson_plans/check-upgrade/
