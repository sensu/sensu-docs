---
title: "PagerDuty handler integration"
linkTitle: "PagerDuty"
description: "PLACEHOLDER."
version: "6.0"
product: "Sensu Go"
menu: 
  sensu-go-6.0:
    parent: supported-integrations
---

The Sensu PagerDuty Handler plugin is a Sensu [handler][1] that manages PagerDuty incidents for alerting operators.
With this handler, Sensu can trigger and resolve PagerDuty incidents according to the PagerDuty schedules, notifications, and escalation, response, and orchestration workflows you already have configured.

## Features

- Optional **severity mapping**: match Sensu check statuses with PagerDuty incident severities via a JSON document.
- [Event-based templating][2]: use **deduplication key** arguments to group repeated alerts into one incident and **summary template** arguments to make sure your PagerDuty notifications include the event data your operators need to take action.
- Configurable [quick-start template][3] for incident management: integrate Sensu with your existing PagerDuty workflows.

## Get the plugin

Add the Sensu PagerDuty Handler plugin with a [dynamic runtime asset][4] from Bonsai, the Sensu asset index.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: https://github.com/sensu-community/monitoring-pipelines/blob/master/incident-management/pagerduty.yaml
[4]: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler
[5]: ../../assets/
