---
title: "PagerDuty integration"
linkTitle: "PagerDuty"
description: "Use the Sensu PagerDuty Handler integration to automate incident management and operator alerts and integrate Sensu with your existing PagerDuty workflows."
version: "6.4"
product: "Sensu Go"
menu: 
  sensu-go-6.4:
    parent: supported-integrations
---

The [Sensu PagerDuty Handler plugin][4] is a Sensu [handler][1] that manages PagerDuty incidents and operator alerts.
With this handler, Sensu can trigger and resolve PagerDuty incidents according to the PagerDuty schedules, notifications, and escalation, response, and orchestration workflows you already have configured.

{{% notice note %}}
**NOTE**: The Sensu PagerDuty Handler plugin is an example of Sensu's alerting and incident management integrations.
To find more integrations, search [Bonsai, the Sensu asset hub](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

- Optional severity mapping: match Sensu check statuses with PagerDuty incident severities via a JSON document.
- Use [event-based templating][2] to create deduplication key arguments to group repeated alerts into one incident and summary template arguments to make sure your PagerDuty notifications include the event data your operators need to take action.
- Authenticate and route alerts based on PagerDuty teams using check and agent annotations.
- Keep your PagerDuty integration key secure with Sensu [environment variables and secrets management][8].

## Get the plugin

For a turnkey experience with the Sensu PagerDuty Handler plugin, use our curated, configurable [quick-start template][3] for incident management to integrate Sensu with your existing PagerDuty workflows.

To build your own workflow or integrate Sensu with existing workflows, add the [Sensu PagerDuty Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset hub.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.

## More resources

- Follow the [Use dynamic runtime assets to install plugins][6] guide to learn how to add and configure Sensu PagerDuty Handler asset.
- Demo the Sensu PagerDuty Handler integration with the [Send Sensu Go alerts to PagerDuty][7] guide.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: https://github.com/sensu/catalog/blob/docs-archive/integrations/pagerduty/pagerduty-handler.yaml
[4]: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler
[5]: ../../assets/
[6]: ../../use-assets-to-install-plugins/
[7]: ../../../observability-pipeline/observe-process/send-pagerduty-alerts/
[8]: ../../../operations/manage-secrets/
