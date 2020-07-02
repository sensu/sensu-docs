---
title: "Integrate Sensu with InfluxDB and Grafana"
linkTitle: "InfluxDB and Grafana"
description: "Description placeholder."
version: "5.21"
product: "Sensu Go"
menu:
  sensu-go-5.21:
    parent: visualization
---

Integrate with the [Sensu InfluxDB Handler asset][1] to send Sensu metrics to InfluxDB and display them with Grafana.
InfluxDB is an open source time-series database developed by InfluxData.
It's written in Go and optimized for fast, high-availability storage and retrieval of data for time-series analysis in fields such as operations monitoring, application metrics, Internet of Things sensor data, and real-time analytics.

## Requirements

To use the [Sensu InfluxDB Handler asset][1], you must have existing Sensu Go, InfluxDB, and Grafana installations.

## Examples

Follow our blog post [Check output metric extraction with InfluxDB & Grafana][2] to configure Sensu, InfluxDB, and Grafana for check output metric extraction.

Use Sensu handlers to [populate metrics in InfluxDB][3].

## InfluxDB and Grafana integration specification

Spec placeholder

## Interactive tutorial

Tutorial placeholder


[1]: https://bonsai.sensu.io/assets/sensu/sensu-influxdb-handler
[2]: https://blog.sensu.io/check-output-metric-extraction-with-influxdb-grafana
[3]: https://docs.sensu.io/sensu-go/latest/guides/influx-db-metric-handler/
