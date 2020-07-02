---
title: "Integrate Sensu with Prometheus"
linkTitle: "Prometheus"
description: "Description placeholder."
version: "5.21"
product: "Sensu Go"
menu:
  sensu-go-5.21:
    parent: monitoring
---

Integrate Prometheus with Sensu to gain a complete picture for monitoring your entire infrastructure.
The [Sensu Prometheus Collector asset][1] is a Sensu Check Plugin that collects metrics from a Prometheus exporter or the Prometheus query API and outputs them to STDOUT in Influx (the default), Graphite, or JSON.

The Sensu Prometheus Collector turns Sensu into a super-powered Prometheus metric poller, leveraging Sensu's pubsub design and client
auto-registration (discovery).
Sensu can deliver collected metrics to one or more time-series database like InfluxDB or Graphite.

Instrument your applications with the Prometheus libraries and immediately begin collecting your metrics with Sensu.

Prometheus is an open source monitoring tool and CNCF project.
Prometheus uses pull-based infrastructure, and is often the go-to for monitoring Kubernetes.

## Requirements

Reqiuirements placeholder

## Example

Learn to [use Sensu with Prometheus][2].

## Prometheus integration specification

Spec placeholder

## Interactive tutorial

Tutorial placeholder


[1]: https://bonsai.sensu.io/assets/sensu/sensu-prometheus-collector
[2]: https://blog.sensu.io/monitoring-kubernetes-docker-part-3-sensu-prometheus
