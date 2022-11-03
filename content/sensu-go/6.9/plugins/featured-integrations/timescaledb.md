---
title: "TimescaleDB integration"
linkTitle: "TimescaleDB"
description: "Use the Sensu TimescaleDB Handler integration to send Sensu metrics to time-series database TimescaleDB so you can store, instrument, and visualize Sensu data."
version: "6.9"
product: "Sensu Go"
menu: 
  sensu-go-6.9:
    parent: featured-integrations
---

The [Sensu TimescaleDB Handler plugin][4] is a Sensu [handler][1] that sends Sensu metrics to the time-series database TimescaleDB so you can store, instrument, and visualize Sensu metrics data.

{{% notice protip %}}
**PRO TIP**: Use the [Sensu Catalog](../../../catalog/sensu-catalog/) to enable this integration directly from your browser.
Follow the Catalog prompts to configure the Sensu resources you need and start processing your observability data with a few clicks.
{{% /notice %}}

## Features

- Transform metrics to TimescaleDB format: extract and transform the metrics you collect from different sources in formats like Graphite, OpenTSDB, Nagios, and Influx and populate them into TimescaleDB.
- Specify custom values for Sensu event metric points via [metric tags][3].

## Get the plugin

For a turnkey experience with the Sensu TimescaleDB Handler plugin, use the [Sensu Catalog][10] in the web UI to configure and install it.

To build your own workflow or integrate Sensu with existing workflows, you can also add the [Sensu TimescaleDB Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset hub.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: ../../../observability-pipeline/observe-schedule/checks/#output-metric-tags
[4]: https://github.com/sensu/catalog/blob/docs-archive/integrations/timescaledb/timescaledb.yaml
[5]: ../../assets/
[10]: ../../../catalog/sensu-catalog/
