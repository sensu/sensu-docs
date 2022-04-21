---
title: "Prometheus integrations"
linkTitle: "Prometheus"
description: "Use Sensu's Prometheus Collector and Prometheus Pushgateway Handler to send data to Prometheus and integrate Sensu with your existing Prometheus workflows."
version: "6.7"
product: "Sensu Go"
menu: 
  sensu-go-6.7:
    parent: featured-integrations
---

Sensu has two Prometheus plugins: the [Prometheus Collector][3] and the [Prometheus Pushgateway Handler][4].
Both help you get Sensu observability data into Prometheus.

{{% notice note %}}
**NOTE**: The Sensu Prometheus plugins are examples of Sensu's time-series and long-term event storage integrations.
To find more integrations, search [Bonsai, the Sensu asset hub](https://bonsai.sensu.io/).
{{% /notice %}}

## Sensu Prometheus Collector

The [Sensu Prometheus Collector plugin][6] is a Sensu [check][8] that collects metrics from a Prometheus exporter or the Prometheus query API and outputs the metrics to STDOUT in Influx, Graphite, or JSON format.

### Features

- Turn Sensu into a super-powered Prometheus metric poller with Sensu's [publish/subscribe model][9] and [client auto-registration (discovery)][10] capabilities.
- Configure your Sensu instance to deliver the collected metrics to a time-series database like InfluxDB or Graphite.
- Specify custom values for Sensu event metric points via [metric tags][12].
- Keep metrics endpoint authentication information secure with Sensu [environment variables and secrets management][11].

## Sensu Prometheus Pushgateway Handler

The [Sensu Prometheus Pushgateway Handler][7] plugin is a Sensu [handler][1] that sends Sensu metrics to a Prometheus Pushgateway, which Prometheus can then scrape.

### Features

- Collect metrics by several means, including 20-year-old Nagios plugins with perfdata, and store them in Prometheus.
- Use default Prometheus metric type, job name, and instance name or specify custom values for Sensu event metric points via [metric tags][12].

## Get the plugins

To build your own workflow or integrate Sensu with existing workflows, add the Sensu Prometheus plugins with a dynamic runtime asset from Bonsai, the Sensu asset hub.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.

- [Sensu Prometheus Collector plugin][6]
- [Sensu Prometheus Pushgateway Handler][7]


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: #sensu-prometheus-collector
[4]: #sensu-prometheus-pushgateway-handler
[5]: ../../assets/
[6]: https://bonsai.sensu.io/assets/sensu/sensu-prometheus-collector
[7]: https://bonsai.sensu.io/assets/portertech/sensu-prometheus-pushgateway-handler
[8]: ../../../observability-pipeline/observe-schedule/checks/
[9]: https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
[10]: ../../../observability-pipeline/observe-schedule/agent/#registration-endpoint-management-and-service-discovery
[11]: ../../../operations/manage-secrets/
[12]: ../../../observability-pipeline/observe-schedule/checks/#output-metric-tags
