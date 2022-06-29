---
title: "Jira integration"
linkTitle: "Jira"
description: "Use the Sensu Jira Handler integration to create and update Jira issues based on data from Sensu observability events."
version: "6.7"
product: "Sensu Go"
menu: 
  sensu-go-6.7:
    parent: featured-integrations
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the Sensu Jira Handler integration in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

The [Sensu Jira Handler plugin][4] is a Sensu [handler][1] that creates and updates Jira issues based on observation data from Sensu events.

{{% notice protip %}}
**PRO TIP**: Use the [Sensu Catalog](../../../web-ui/sensu-catalog/) to enable this integration directly from your browser.
Follow the Catalog prompts to configure the Sensu resources you need and start processing your observability data with a few clicks.
{{% /notice %}}

## Features

- Tunable arguments: use Sensu annotations to set custom project names, issue types, resolution states, and more in Jira
- Use [event-based templating][2] to include observation data from event attributes to add meaningful, actionable context.
- Keep your Jira username, password, and API token secure with Sensu [environment variables and secrets management][7].

## Get the plugin

For a turnkey experience with the Sensu Jira Handler plugin, use our curated, configurable [quick-start template][3] to send alerts based on Sensu events to Jira Service Desk.

Add the [Sensu Jira Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset hub, to build your own workflow or integrate Sensu with your existing Jira workflows.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: https://github.com/sensu/catalog/blob/docs-archive/integrations/jira/jira-servicedesk.yaml
[4]: https://bonsai.sensu.io/assets/sensu/sensu-jira-handler
[5]: ../../assets/
[7]: ../../../operations/manage-secrets/
