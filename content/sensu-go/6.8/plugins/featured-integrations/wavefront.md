---
title: "Wavefront integration"
linkTitle: "Wavefront"
description: "Use the Sensu Wavefront Handler integration to send Sensu metrics to Wavefront so you can store, instrument, and visualize Sensu data in an Wavefront database."
version: "6.8"
product: "Sensu Go"
menu: 
  sensu-go-6.8:
    parent: featured-integrations
---

The [Sensu Wavefront Handler plugin][4] is a Sensu [handler][1] that sends Sensu metrics to Wavefront via a proxy, which allows you to store, instrument, and visualize Sensu metrics data in an Wavefront database.

{{% notice protip %}}
**PRO TIP**: Use the [Sensu Catalog](../../../web-ui/sensu-catalog/) to enable this integration directly from your browser.
Follow the Catalog prompts to configure the Sensu resources you need and start processing your observability data with a few clicks.
{{% /notice %}}

## Features

- Transform metrics to Wavefront format: extract and transform the metrics you collect from different sources in formats like Graphite, OpenTSDB, Nagios, and Influx and populate them into Wavefront.
- Specify additional tags to include when processing metrics with the Wavefront plugin's `tags` flag or [metric tags][7].
- Keep your Graphite host and port secure with Sensu [environment variables and secrets management][6].

## Get the plugin

For a turnkey experience with the Sensu Wavefront Handler plugin, use the [Sensu Catalog][10] in the web UI to configure and install it.
Or, use our curated, configurable [quick-start template][3] to integrate Sensu with your existing workflows and store Sensu metrics in Wavefront.

To build your own workflow or integrate Sensu with existing workflows, add the [Sensu Wavefront Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset hub.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: https://github.com/sensu/catalog/blob/docs-archive/integrations/wavefront/wavefront.yaml
[4]: https://bonsai.sensu.io/assets/sensu/sensu-wavefront-handler
[5]: ../../assets/
[6]: ../../../operations/manage-secrets/
[7]: ../../../observability-pipeline/observe-schedule/checks/#output-metric-tags
[10]: ../../../web-ui/sensu-catalog/
