---
title: "Slack integration"
linkTitle: "Slack"
description: "Use the Sensu Slack Handler integration to send alerts to the Slack channels you specify based on Sensu Go observability event data."
version: "6.13"
product: "Sensu Go"
menu: 
  sensu-go-6.13:
    parent: featured-integrations
---

The [Sensu Slack Handler plugin][4] is a Sensu [handler][1] that sends alerts based on your event data.
With this handler, Sensu can trigger alerts to the Slack channels you specify based on event data generated by your Sensu checks.

{{% notice protip %}}
**PRO TIP**: Use the [Sensu Catalog](../../../catalog/sensu-catalog/) to enable this integration directly from your browser.
Follow the Catalog prompts to configure the Sensu resources you need and start processing your observability data with a few clicks.
{{% /notice %}}

## Features

- Use [event-based templating][2] to include observation data from event attributes in your alerts to add meaningful, actionable context.
- Keep your Slack webhook secure with Sensu [environment variables and secrets management][7].

## Get the plugin

For a turnkey experience with the Sensu Slack Handler plugin, use the [Sensu Catalog][10] in the web UI to configure and install it.
Or, use our curated, configurable [quick-start template][8] to integrate Sensu with your existing workflows and send alerts to Slack channels.

To build your own workflow or integrate Sensu with existing workflows, add the [Sensu Slack Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset hub.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.

## More resources

Read [Send Slack alerts with handlers][3] to learn how to add and configure the Sensu Slack Handler plugin.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: ../../../observability-pipeline/observe-process/send-slack-alerts/
[4]: https://bonsai.sensu.io/assets/sensu/sensu-slack-handler
[5]: ../../assets/
[7]: ../../../operations/manage-secrets/
[8]: https://github.com/sensu/catalog/blob/docs-archive/integrations/slack/slack.yaml
[10]: ../../../catalog/sensu-catalog/
