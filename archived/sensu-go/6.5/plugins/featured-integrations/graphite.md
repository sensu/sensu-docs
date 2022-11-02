---
title: "Graphite integration"
linkTitle: "Graphite"
description: "Use the Sensu Graphite Handler integration to send Sensu metrics to the time-series database Graphite so you can store, instrument, and visualize Sensu data."
version: "6.5"
product: "Sensu Go"
menu: 
  sensu-go-6.5:
    parent: featured-integrations
---

The [Sensu Graphite Handler plugin][2] is a Sensu [handler][1] that sends Sensu metrics to the time-series database Graphite so you can store, instrument, and visualize Sensu metrics data.

{{% notice note %}}
**NOTE**: The Sensu Graphite Handler plugin is an example of Sensu's time-series and long-term event storage integrations.
To find more integrations, search [Bonsai, the Sensu asset hub](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

- Transform metrics to Graphite format: extract and transform the metrics you collect from different sources in formats like Influx, Nagios, and OpenTSDB and populate them into Graphite.
- Specify custom values for Sensu event metric points via [metric tags][4].
- Keep your Graphite host and port secure with Sensu [environment variables and secrets management][6].

## Get the plugin

For a turnkey experience with the Sensu Graphite Handler plugin, use our curated, configurable [quick-start template][5] to integrate Sensu with your existing workflows and store Sensu metrics in Graphite.

To build your own workflow or integrate Sensu with existing workflows, add the [Sensu Graphite Handler plugin][2] with a dynamic runtime asset from Bonsai, the Sensu asset hub.
[Dynamic runtime assets][3] are shareable, reusable packages that make it easier to deploy Sensu plugins.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: https://bonsai.sensu.io/assets/sensu/sensu-go-graphite-handler
[3]: ../../assets/
[4]: ../../../observability-pipeline/observe-schedule/checks/#output-metric-tags
[5]: https://github.com/sensu/catalog/blob/docs-archive/integrations/graphite/graphite.yaml
[6]: ../../../operations/manage-secrets/
