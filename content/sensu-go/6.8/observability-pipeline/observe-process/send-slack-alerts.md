---
title: "Send Slack alerts with a pipeline"
linkTitle: "Send Slack Alerts"
guide_title: "Send Slack alerts with a pipeline"
type: "guide"
description: "Send alerts to Slack with Sensu pipelines, which allow you to send events to alert you of incidents and help you resolve them more quickly."
weight: 240
version: "6.8"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-6.8:
    parent: observe-process
---

{{% notice protip %}}
**PRO TIP**: You can use the Slack Alerts integration in the [Sensu Catalog](../../../catalog/sensu-catalog/) to send Slack alerts based on Sensu event data instead of following this guide.
Follow the Catalog prompts to configure the Sensu resources you need and start processing your observability data with a few clicks.
{{% /notice %}}

Pipelines are Sensu resources composed of [observation event][1] processing workflows that include filters, mutators, and handlers.
You can use pipelines to send email alerts, create or resolve incidents (in PagerDuty, for example), or store metrics in a time-series database like InfluxDB.

This guide will help you send alerts to Slack in the channel `monitoring` by configuring a pipeline and adding it to a check named `check_cpu`.

## Requirements

To follow this guide, install the Sensu [backend][17], make sure at least one Sensu [agent][23] is running, and configure [sensuctl][24] to connect to the backend as the [`admin` user][25].

The example in this guide relies on the `check_cpu` check from [Monitor server resources with checks][26].
Before you begin, follow the instructions to [add the `sensu/check-cpu-usage`][27] dynamic runtime asset and the [`check_cpu`][28] check.

You will also need a [Slack webhook][6] to complete this guide.
If you're already the admin of a Slack, visit `https://YOUR_WORKSPACE_NAME_HERE.slack.com/services/new/incoming-webhook` and follow the steps to add the Incoming WebHooks integration, choose a channel, and save the settings.
If you're not yet a Slack admin, [create a new workspace][12] and then create and save your webhook.
After you save your webhook, you can find the webhook URL under **Integration Settings**.

## Configure a Sensu entity

Every Sensu agent has a defined set of subscriptions that determine which checks the agent will execute.
For an agent to execute a specific check, you must specify the same subscription in the agent configuration and the check definition.
To run the `check_cpu` check, you'll need a Sensu entity with the subscription `system`.

First, find your entity name:

{{< code shell >}}
sensuctl entity list
{{< /code >}}

The `ID` in the response is the name of your entity.

Replace `<ENTITY_NAME>` with the name of your entity in the sensuctl command below.
Then run the command to add the `system` subscription to your entity:

{{< code shell >}}
sensuctl entity update <ENTITY_NAME>
{{< /code >}}

- For `Entity Class`, press enter.
- For `Subscriptions`, type `system` and press enter.

Confirm both Sensu services are running:

{{< code shell >}}
systemctl status sensu-backend && systemctl status sensu-agent
{{< /code >}}

The response should indicate `active (running)` for both the Sensu backend and agent.

## Register the dynamic runtime asset

Dynamic runtime assets are shareable, reusable packages that help you deploy Sensu plugins.
In this guide, you'll use the sensu/sensu-slack-handler dynamic runtime asset to power a `slack` handler.

Use `sensuctl asset add` to register the sensu/sensu-slack-handler dynamic runtime asset:

{{< code shell >}}
sensuctl asset add sensu/sensu-slack-handler:1.5.0 -r sensu-slack-handler
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the dynamic runtime asset: `sensu-slack-handler`.

The response will indicate that the asset was added:

{{< code text >}}
fetching bonsai asset: sensu/sensu-slack-handler:1.5.0
added asset: sensu/sensu-slack-handler:1.5.0

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["sensu-slack-handler"].
{{< /code >}}

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
{{% /notice %}}

## Create a handler

Use sensuctl to create a handler called `slack` that pipes observation data (events) to Slack using the sensu/sensu-slack-handler dynamic runtime asset.
Before you run the sensuctl command below, edit it to include your Slack webhook URL and the channel where you want to receive events:

{{< code shell >}}
sensuctl handler create slack \
--type pipe \
--env-vars "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX" \
--command "sensu-slack-handler --channel '#monitoring'" \
--runtime-assets sensu-slack-handler
{{< /code >}}

You should receive a confirmation message:

{{< code text >}}
Created
{{< /code >}}

The `sensuctl handler create slack` command creates a handler resource.
To view the `slack` handler definition, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl handler info slack --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl handler info slack --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The `slack` handler resource definition will be similar to this example:

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  name: slack
spec:
  command: sensu-slack-handler --channel '#monitoring'
  env_vars:
  - SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX
  filters: null
  handlers: null
  runtime_assets:
  - sensu-slack-handler
  secrets: null
  timeout: 0
  type: pipe
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "slack"
  },
  "spec": {
    "command": "sensu-slack-handler --channel '#monitoring'",
    "env_vars": [
      "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX"
    ],
    "filters": null,
    "handlers": null,
    "runtime_assets": [
      "sensu-slack-handler"
    ],
    "secrets": null,
    "timeout": 0,
    "type": "pipe"
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Create a pipeline that includes the handler

With your handler configured, you can add it to a pipeline workflow.
A single pipeline workflow can include one or more filters, one mutator, and one handler.

For now, the pipeline includes only the `slack` handler and the built-in not_silenced event filter so that you receive an alert for every event the check generates (including events with OK status).
To create the pipeline, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: Pipeline
api_version: core/v2
metadata:
  name: cpu_check_alerts
spec:
  workflows:
  - name: slack_alerts
    filters:
    - name: not_silenced
      type: EventFilter
      api_version: core/v2
    handler:
      name: slack
      type: Handler
      api_version: core/v2
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "Pipeline",
  "api_version": "core/v2",
  "metadata": {
    "name": "cpu_check_alerts"
  },
  "spec": {
    "workflows": [
      {
        "name": "slack_alerts",
        "filters": [
          {
            "name": "not_silenced",
            "type": "EventFilter",
            "api_version": "core/v2"
          }
        ],
        "handler": {
          "name": "slack",
          "type": "Handler",
          "api_version": "core/v2"
        }
      }
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

## Assign the pipeline to a check

To use the `cpu_check_alerts` pipeline, list it in a check definition's pipelines array.
All the observability events that the check produces will be processed according to the pipeline's workflows.

Assign your `cpu_check_alerts` pipeline to the `check_cpu` check to receive Slack alerts when the CPU usage of your system reaches the specific thresholds set in the check command.

To open the check definition in your text editor, run: 

{{< code shell >}}
sensuctl edit check check_cpu
{{< /code >}}

Replace the `pipelines: []` line with the following array and save the updated check definition:

{{< language-toggle >}}

{{< code shell "YML" >}}
  pipelines:
  - type: Pipeline
    api_version: core/v2
    name: cpu_check_alerts
{{< /code >}}

{{< code shell "JSON" >}}
  "pipelines": [
    {
      "type": "Pipeline",
      "api_version": "core/v2",
      "name": "cpu_check_alerts"
    }
  ]
{{< /code >}}

{{< /language-toggle >}}

You should see a response to confirm the update:

{{< code text >}}
Updated /api/core/v2/namespaces/default/checks/check_cpu
{{< /code >}}

To view the updated `check_cpu` resource definition, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl check info check_cpu --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl check info check_cpu --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The updated check definition will be similar to this example:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: check_cpu
spec:
  check_hooks: null
  command: check-cpu-usage -w 75 -c 90
  env_vars: null
  handlers: []
  high_flap_threshold: 0
  interval: 10
  low_flap_threshold: 0
  output_metric_format: ""
  output_metric_handlers: null
  pipelines:
  - api_version: core/v2
    name: cpu_check_alerts
    type: Pipeline
  proxy_entity_name: ""
  publish: true
  round_robin: false
  runtime_assets:
  - check-cpu-usage
  secrets: null
  stdin: false
  subdue: null
  subscriptions:
  - system
  timeout: 0
  ttl: 0
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "check_cpu"
  },
  "spec": {
    "check_hooks": null,
    "command": "check-cpu-usage -w 75 -c 90",
    "env_vars": null,
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 10,
    "low_flap_threshold": 0,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "pipelines": [
      {
        "api_version": "core/v2",
        "name": "cpu_check_alerts",
        "type": "Pipeline"
      }
    ],
    "proxy_entity_name": "",
    "publish": true,
    "round_robin": false,
    "runtime_assets": [
      "check-cpu-usage"
    ],
    "secrets": null,
    "stdin": false,
    "subdue": null,
    "subscriptions": [
      "system"
    ],
    "timeout": 0,
    "ttl": 0
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Validate the pipeline

It might take a few moments after you add the pipeline to the check for the check to be scheduled on entities with the `system` subscription and the result sent back to Sensu backend.
After an event is handled, you should receive a message like this in Slack:

{{< figure src="/images/go/send_slack_alerts/check_cpu_usage_example_alert.png" alt="Example Slack message" link="/images/go/send_slack_alerts/check_cpu_usage_example_alert.png" target="_blank" >}}

Verify proper handler behavior with `sensu-backend` logs.

Whenever an event is being handled, a log entry is added with the message `"handler":"slack","level":"debug","msg":"sending event to handler"`, followed by a second log entry with the message `"msg":"event pipe handler executed","output":"","status":0`.

{{% notice note %}}
**NOTE**: Read [Troubleshoot Sensu](../../../operations/maintain-sensu/troubleshoot/#log-file-locations) for Sensu log locations by platform.
{{% /notice %}}

## Add another event filter to the pipeline

At this point, the `cpu_check_alerts` pipeline has probably sent quite a few Slack messages for events with OK (`0`) status.
To receive alerts for events with *only* warning (`1`) or critical (`2`) status, add the built-in is_incident event filter to the pipeline:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: Pipeline
api_version: core/v2
metadata:
  name: cpu_check_alerts
spec:
  workflows:
  - name: slack_alerts
    filters:
    - name: not_silenced
      type: EventFilter
      api_version: core/v2
    - name: is_incident
      type: EventFilter
      api_version: core/v2
    handler:
      name: slack
      type: Handler
      api_version: core/v2
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "Pipeline",
  "api_version": "core/v2",
  "metadata": {
    "name": "cpu_check_alerts"
  },
  "spec": {
    "workflows": [
      {
        "name": "slack_alerts",
        "filters": [
          {
            "name": "not_silenced",
            "type": "EventFilter",
            "api_version": "core/v2"
          },
          {
            "name": "is_incident",
            "type": "EventFilter",
            "api_version": "core/v2"
          }
        ],
        "handler": {
          "name": "slack",
          "type": "Handler",
          "api_version": "core/v2"
        }
      }
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

Adding the is_incident filter to your pipeline should quickly reduce the number of alerts you receive in Slack.

## What's next

Now that you know how to apply a pipeline to a check and take action on events, read the [pipelines reference][8] for in-depth documentation.
Read [Route alerts with event filters][9] for a more complex example with multiple filters and handlers organized into several pipeline workflows.

For more information about customizing your Slack alerts, read the [sensu/sensu-slack-handler page in Bonsai][14].

Follow [Send PagerDuty alerts with Sensu][11] to configure a check that generates status events and a handler that sends Sensu alerts to PagerDuty for non-OK events.

You can share and reuse Sensu resources like code, including the handler and pipeline you created in this guide &mdash; [save the resource definition to a file][15] and start building a [monitoring as code repository][16].


[1]: ../../observe-events/events/
[2]: ../../observe-schedule/monitor-server-resources/
[3]: https://github.com/sensu/slack-handler
[4]: https://golang.org/doc/install
[6]: https://api.slack.com/incoming-webhooks
[7]: ../../../operations/maintain-sensu/troubleshoot/#log-file-locations
[8]: ../pipelines/
[9]: ../../observe-filter/route-alerts/
[10]: ../../../sensuctl/sensuctl-bonsai/#install-dynamic-runtime-asset-definitions
[11]: ../../../observability-pipeline/observe-process/send-pagerduty-alerts/
[12]: https://slack.com/get-started#/create
[13]: ../../../plugins/assets/
[14]: https://bonsai.sensu.io/assets/sensu/sensu-slack-handler
[15]: ../../../operations/monitoring-as-code/#build-as-you-go
[16]: ../../../operations/monitoring-as-code/
[17]: ../../../operations/deploy-sensu/install-sensu/#install-the-sensu-backend
[18]: ../../observe-schedule/checks/#pipelines-attribute
[19]: ../../observe-filter/filters/#built-in-filter-is_incident
[20]: ../../../sensuctl/
[21]: ../../observe-schedule/subscriptions/
[22]: ../../observe-filter/filters/#built-in-filter-not_silenced
[23]: ../../../operations/deploy-sensu/install-sensu/#install-sensu-agents
[24]: ../../../operations/deploy-sensu/install-sensu/#install-sensuctl
[25]: ../../../operations/control-access/rbac/#default-users
[26]: ../../observe-schedule/monitor-server-resources/
[27]: ../../observe-schedule/monitor-server-resources/#register-the-sensucheck-cpu-usage-asset
[28]: ../../observe-schedule/monitor-server-resources/#create-a-check-to-monitor-a-server
