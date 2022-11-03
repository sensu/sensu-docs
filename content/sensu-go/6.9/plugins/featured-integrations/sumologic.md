---
title: "Sumo Logic integration"
linkTitle: "Sumo Logic"
description: "Use the Sensu Sumo Logic Handler integration to send Sensu observability events and metrics to a Sumo Logic HTTP Logs and Metrics Source."
version: "6.9"
product: "Sensu Go"
menu: 
  sensu-go-6.9:
    parent: featured-integrations
---

The [Sensu Sumo Logic Handler plugin][4] is a Sensu [handler][1] that sends Sensu observability events and metrics to a Sumo Logic [HTTP Logs and Metrics Source][9].
This handler sends Sensu events as log entries, a set of metrics, or both, depending on the mode of operation you specify.

{{% notice protip %}}
**PRO TIP**: Use the [Sensu Catalog](../../../catalog/sensu-catalog/) to enable this integration directly from your browser.
Follow the Catalog prompts to configure the Sensu resources you need and start processing your observability data with a few clicks.
{{% /notice %}}

## Features

- Query events and metrics points within Sumo Logic: the handler automatically mutates metrics data by creating a top-level object with metric point names and their associated values.
- Tunable arguments: use Sensu annotations to set Sumo Logic source name, host, and category; metric dimensions; log fields; and more.
- Use [event-based templating][2] to include observation data from event attributes to add meaningful, actionable context.
- Keep your Sumo Logic HTTP Logs and Metrics Source URL secure with Sensu [environment variables and secrets management][7].

## Get the plugin

For a turnkey experience with the Sensu Sumo Logic Handler plugin, use the [Sensu Catalog][10] in the web UI to configure and install it.
Or, use our curated, configurable quick-start templates for [event storage][6] and [metric storage][8] to integrate Sensu with your existing workflows and send observation data to an HTTP Logs and Metrics Source.

To build your own workflow or integrate Sensu with existing workflows, add the [Sensu Sumo Logic Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset hub.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.

## More resources

Read [Send data to Sumo Logic with Sensu][3] to learn how to add and configure a handler that uses the Sensu Sumo Logic Handler plugin.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: ../../../observability-pipeline/observe-process/send-data-sumo-logic/
[4]: https://bonsai.sensu.io/assets/sensu/sensu-sumologic-handler
[5]: ../../assets/
[6]: https://github.com/sensu/catalog/blob/docs-archive/integrations/sumologic/sumologic-events.yaml
[7]: ../../../operations/manage-secrets/
[8]: https://github.com/sensu/catalog/blob/docs-archive/integrations/sumologic/sumologic-metrics-handler.yaml
[9]: https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source
[10]: ../../../catalog/sensu-catalog/
