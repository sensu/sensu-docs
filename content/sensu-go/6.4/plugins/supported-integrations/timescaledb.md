---
title: "TimescaleDB integration"
linkTitle: "TimescaleDB"
description: "Use the Sensu TimescaleDB Handler integration to send Sensu metrics to time-series database TimescaleDB so you can store, instrument, and visualize Sensu data."
version: "6.4"
product: "Sensu Go"
menu: 
  sensu-go-6.4:
    parent: supported-integrations
---

The [Sensu TimescaleDB Handler plugin][4] is a Sensu [handler][1] that sends Sensu metrics to the time-series database TimescaleDB so you can store, instrument, and visualize Sensu metrics data.

{{% notice note %}}
**NOTE**: The Sensu TimescaleDB Handler plugin is an example of Sensu's time-series and long-term event storage integrations.
To find more integrations, search [Bonsai, the Sensu asset hub](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

- Transform metrics to TimescaleDB format: extract and transform the metrics you collect from different sources in formats like Graphite, OpenTSDB, Nagios, and Influx and populate them into TimescaleDB.
- Specify custom values for Sensu event metric points via [metric tags][3].

## Get the plugin

To build your own workflow or integrate Sensu with existing workflows, add the [Sensu TimescaleDB Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset hub.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: ../../../observability-pipeline/observe-schedule/checks/#output-metric-tags
[4]: https://bonsai.sensu.io/assets/sensu/sensu-timescaledb-handler
[5]: ../../assets/
