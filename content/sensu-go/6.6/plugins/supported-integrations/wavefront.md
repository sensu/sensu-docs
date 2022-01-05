---
title: "Wavefront integration"
linkTitle: "Wavefront"
description: "Use the Sensu Wavefront Handler plugin to integrate Sensu with your existing Wavefront workflows. Read about the features of Sensu's Wavefront integration and learn how to get the plugin."
version: "6.6"
product: "Sensu Go"
menu: 
  sensu-go-6.6:
    parent: supported-integrations
---

The [Sensu Wavefront Handler plugin][4] is a Sensu [handler][1] that sends Sensu metrics to Wavefront via a proxy, which allows you to store, instrument, and visualize Sensu metrics data in an Wavefront database.

{{% notice note %}}
**NOTE**: The Sensu Wavefront Handler plugin is an example of Sensu's time-series and long-term event storage integrations.
To find more integrations, search [Bonsai, the Sensu asset hub](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

- Transform metrics to Wavefront format: extract and transform the metrics you collect from different sources in formats like Graphite, OpenTSDB, Nagios, and Influx and populate them into Wavefront.
- Specify additional tags to include when processing metrics with the Wavefront plugin's `tags` flag or [metric tags][7].
- Keep your Graphite host and port secure with Sensu [environment variables and secrets management][6].

## Get the plugin

For a turnkey experience with the Sensu Wavefront Handler plugin, use our curated, configurable [quick-start template][3] to integrate Sensu with your existing workflows and store Sensu metrics in Wavefront.

To build your own workflow or integrate Sensu with existing workflows, add the [Sensu Wavefront Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset hub.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: https://github.com/sensu/catalog/blob/main/pipelines/metric-storage/wavefront.yaml
[4]: https://bonsai.sensu.io/assets/sensu/sensu-wavefront-handler
[5]: ../../assets/
[6]: ../../../operations/manage-secrets/
[7]: ../../../observability-pipeline/observe-schedule/checks/#output-metric-tags
