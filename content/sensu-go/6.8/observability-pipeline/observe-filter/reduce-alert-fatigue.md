---
title: "Reduce alert fatigue with event filters"
linkTitle: "Reduce Alert Fatigue"
guide_title: "Reduce alert fatigue with event filters"
type: "guide"
description: "Here’s how to reduce alert fatigue with Sensu. Learn about Sensu filters, how they reduce alert fatigue, and how to put them into action."
weight: 60
version: "6.8"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-6.8:
    parent: observe-filter
---

Sensu event filters allow you to filter events destined for one or more event handlers.
Filters evaluate their expressions against the observation data in events to determine whether the event should be passed to an event handler.

Use event filters to customize alert policies, improve contact routing, eliminate notification noise from recurring events, and filter events from systems in pre-production environments.

In this guide, you'll learn how to reduce alert fatigue by configuring an event filter named `hourly`.
You'll then add the filter to a [pipeline workflow][12] that includes a handler named `slack` to prevent alerts from being sent to Slack every minute.

You can take either of two approaches to create the event filter to handle occurrences: use sensuctl or use a filter dynamic runtime asset.

To follow this guide, you’ll need to [install][17] the Sensu backend, have at least one Sensu agent running, and install and configure sensuctl.
In addition, if you don't already have a Slack handler in place, follow [Send Slack alerts with handlers][3] to create one before continuing with this guide.

## Configure a Sensu entity

Every Sensu agent has a defined set of [subscriptions][16] that determine which checks the agent will execute.
For an agent to execute a specific check, you must specify the same subscription in the agent configuration and the check definition.

The examples for both approaches in this guide use the `check_cpu` check from [Monitor server resources with checks][13], which includes the subscription `system`.
Use [sensuctl][18] to add a `system` subscription to one of your entities.

Before you run the following code, replace `<ENTITY_NAME>` with the name of the entity on your system.

{{% notice note %}}
**NOTE**: To find your entity name, run `sensuctl entity list`.
The `ID` is the name of your entity.
{{% /notice %}}

{{< code shell >}}
sensuctl entity update <ENTITY_NAME>
{{< /code >}}

- For `Entity Class`, press enter.
- For `Subscriptions`, type `system` and press enter.

Run this command to confirm both Sensu services are running:

{{< code shell >}}
systemctl status sensu-backend && systemctl status sensu-agent
{{< /code >}}

The response should indicate `active (running)` for both the Sensu backend and agent.

## Approach 1: Use sensuctl to create an event filter

First, create an event filter called `hourly` that matches new events (where the event's `occurrences` is equal to `1`) or hourly events (every hour after the first occurrence, calculated with the check's `interval` and the event's `occurrences`).

Events in Sensu Go are handled regardless of check execution status.
Even successful check events are passed through the pipeline, so you'll need to add a clause for non-zero status.

{{< code shell >}}
sensuctl filter create hourly \
--action allow \
--expressions "event.check.occurrences == 1 || event.check.occurrences % (3600 / event.check.interval) == 0"
{{< /code >}}

You should receive a confirmation message:

{{< code text >}}
Created
{{< /code >}}

To view the event filter resource definition, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl filter info hourly --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl filter info hourly --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The event filter definition will be similar to this example:

{{< language-toggle >}}

{{< code yml >}}
---
type: EventFilter
api_version: core/v2
metadata:
  name: hourly
spec:
  action: allow
  expressions:
  - event.check.occurrences == 1 || event.check.occurrences % (3600 / event.check.interval) == 0
  runtime_assets: null
{{< /code >}}

{{< code json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "hourly"
  },
  "spec": {
    "action": "allow",
    "expressions": [
      "event.check.occurrences == 1 || event.check.occurrences % (3600 / event.check.interval) == 0"
    ],
    "runtime_assets": null
  }
}
{{< /code >}}

{{< /language-toggle >}}

If you want to share and reuse this event filter like code, you can [save it to a file][10] and start building a [monitoring as code repository][11].

{{% notice protip %}}
**PRO TIP**: You can also [view complete resource definitions in the Sensu web UI](../../../web-ui/view-manage-resources/#view-resource-data-in-the-web-ui).
{{% /notice %}}

### Add the event filter to a pipeline

Now that you've created the `hourly` event filter, you can include it in a new pipeline, along with the `slack` handler created in [Send Slack alerts with handlers][3].
You'll also include the built-in `is_incident` filter so that only failing events are handled, which will further reduce the number of Slack messages Sensu sends.

{{% notice note %}}
**NOTE**: If you haven't already created the `slack` handler, follow [Send Slack alerts with handlers](../../observe-process/send-slack-alerts/) before continuing with this step.
{{% /notice %}}

To create a new pipeline that includes the `hourly` and `is_incident` event filters as well as the `slack` handler, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
echo '---
type: Pipeline
api_version: core/v2
metadata:
  name: reduce_alerts
spec:
  workflows:
  - name: slack_alerts
    filters:
    - name: is_incident
      type: EventFilter
      api_version: core/v2
    - name: hourly
      type: EventFilter
      api_version: core/v2
    handler:
      name: slack
      type: Handler
      api_version: core/v2' | sensuctl create
{{< /code >}}

{{< code shell "JSON" >}}
echo '{
  "type": "Pipeline",
  "api_version": "core/v2",
  "metadata": {
    "name": "reduce_alerts"
  },
  "spec": {
    "workflows": [
      {
        "name": "slack_alerts",
        "filters": [
          {
            "name": "is_incident",
            "type": "EventFilter",
            "api_version": "core/v2"
          },
          {
            "name": "hourly",
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
}' | sensuctl create
{{< /code >}}

{{< /language-toggle >}}

### Assign the pipeline to a check

To use the `reduce_alerts` pipeline, list it in a check definition's [pipelines array][14].
This example uses the `check_cpu` check created in [Monitor server resources with checks][13]).
All the observability events that the check produces will be processed according to the pipeline's workflows.

Assign your `reduce_alerts` pipeline to the `check_cpu` check to receive Slack alerts when the CPU usage of your system reaches the specific thresholds set in the check command.

To open the check definition in your text editor, run: 

{{< code shell >}}
sensuctl edit check check_cpu
{{< /code >}}

Replace the `pipelines: []` line with the following array and save the updated check definition:

{{< code yml >}}
  pipelines:
  - type: Pipeline
    api_version: core/v2
    name: reduce_alerts
{{< /code >}}

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
  handlers: null
  high_flap_threshold: 0
  interval: 10
  low_flap_threshold: 0
  output_metric_format: ""
  output_metric_handlers: null
  pipelines:
  - api_version: core/v2
    name: reduce_alerts
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
        "name": "reduce_alerts",
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

The check will now send events to the `reduce_alerts` pipeline.
Skip to [Confirm the event filter][15] to learn how to verify that the filter is working.

## Approach 2: Use an event filter dynamic runtime asset

If you're not already familiar with [dynamic runtime assets][6], read [Use assets to install plugins][7].
This will help you understand what dynamic runtime assets are and how they are used in Sensu. 

In this approach, the first step is to obtain an event filter dynamic runtime asset that will allow you to replicate the behavior of the `hourly` event filter created in [Approach 1 via `sensuctl`][4].

Use `sensuctl asset add` to register the [sensu/sensu-go-fatigue-check-filter][8] dynamic runtime asset:

{{< code shell >}}
sensuctl asset add sensu/sensu-go-fatigue-check-filter:0.8.1 -r fatigue-filter
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the asset: `fatigue-filter`.

The response will indicate that the asset was added:

{{< code text >}}
fetching bonsai asset: sensu/sensu-go-fatigue-check-filter:0.8.1
added asset: sensu/sensu-go-fatigue-check-filter:0.8.1

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["fatigue-filter"].
{{< /code >}}

You can also download the asset directly from [Bonsai, the Sensu asset hub][9].

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
Read the [asset reference](../../../plugins/assets#dynamic-runtime-asset-builds) for more information about dynamic runtime asset builds.
{{% /notice %}}

You've registered the dynamic runtime asset, but you still need to create the filter.

Create a file named `sensu-fatigue-check-filter.yml` or `sensu-fatigue-check-filter.json` in your Sensu installation to store the event filter definition.
Copy this this filter definition into the file and save it:

{{< language-toggle >}}

{{< code yml >}}
---
type: EventFilter
api_version: core/v2
metadata:
  name: fatigue_check
spec:
  action: allow
  expressions:
  - fatigue_check(event)
  runtime_assets:
  - fatigue-filter
{{< /code >}}

{{< code json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "fatigue_check"
  },
  "spec": {
    "action": "allow",
    "expressions": [
      "fatigue_check(event)"
    ],
    "runtime_assets": [
      "fatigue-filter"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

Then, use sensuctl to create a filter named `fatigue_check` from the file:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl create -f sensu-fatigue-check-filter.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl create -f sensu-fatigue-check-filter.json
{{< /code >}}

{{< /language-toggle >}}

Now that you've added the dynamic runtime asset and created the event filter definition and pipeline, you can create the check annotations you need for the dynamic runtime asset to work properly. 

### Update a check for filter dynamic runtime asset use

Next, you'll need to make some additions to any checks you want to use the `fatigue_check` filter with.
This example uses the `check_cpu` check created in [Monitor server resources with checks][13]).
All the observability events that the check produces will be processed according to the pipeline's workflows.

Assign your `reduce_alerts` pipeline to the `check_cpu` check to receive Slack alerts when the CPU usage of your system reaches the specific thresholds set in the check command.

To open the check definition in your text editor, run: 

{{< code shell >}}
sensuctl edit check check_cpu
{{< /code >}}

In the check definition, update the `pipelines: []` line with the following array:

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

Add the following annotations in the check metadata:

{{< language-toggle >}}

{{< code shell "YML" >}}
  annotations:
    fatigue_check/occurrences: '1'
    fatigue_check/interval: '3600'
    fatigue_check/allow_resolution: 'false'
{{< /code >}}

{{< code shell "JSON" >}}
  "annotations": {
    "fatigue_check/occurrences": "1",
    "fatigue_check/interval": "3600",
    "fatigue_check/allow_resolution": "false"
  }
{{< /code >}}

{{< /language-toggle >}}

After you add the pipeline array and annotations, save the updated check definition.
To confirm your updates, run this command to retrieve the check definition:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl check info check_cpu --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl check info check_cpu --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The check definition should be similar to this example:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: cpu-check
  annotations:
    fatigue_check/occurrences: '1'
    fatigue_check/interval: '3600'
    fatigue_check/allow_resolution: 'false'
spec:
  command: check-cpu -w 75 c 95
  env_vars: null
  handlers: null
  high_flap_threshold: 0
  interval: 60
  low_flap_threshold: 0
  output_metric_format: ''
  output_metric_handlers: null
  output_metric_tags: null
  pipelines:
  - api_version: core/v2
    name: reduce_alerts
    type: Pipeline
  proxy_entity_name: ''
  publish: true
  round_robin: false
  runtime_assets:
  - check_cpu_usage
  stdin: false
  subdue: 
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
    "name": "cpu-check",
    "annotations": {
      "fatigue_check/occurrences": "1",
      "fatigue_check/interval": "3600",
      "fatigue_check/allow_resolution": "false"
    }
  },
  "spec": {
    "command": "check-cpu -w 75 c 95",
    "env_vars": null,
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 60,
    "low_flap_threshold": 0,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "output_metric_tags": null,
    "pipelines": [
      {
        "api_version": "core/v2",
        "name": "reduce_alerts",
        "type": "Pipeline"
      }
    ],
    "proxy_entity_name": "",
    "publish": true,
    "round_robin": false,
    "runtime_assets": [
      "check_cpu_usage"
    ],
    "stdin": false,
    "subdue": null,
    "subscriptions": [
      "system"
    ],
    "timeout": 0,
    "ttl": 0
  }
}{{< /code >}}

{{< /language-toggle >}}

The annotations are required for the filter dynamic runtime asset to work the same way as the interactively created event filter.
Specifically, the annotations in this check definition are doing several things: 

1. `fatigue_check/occurrences`: Tells the event filter on which occurrence to send the event for further processing
2. `fatigue_check/interval`: Tells the event filter the interval at which to allow additional events to be processed (in seconds)
3. `fatigue_check/allow_resolution`: Determines whether to pass a `resolve` event through to the filter

For more information about configuring these values, read the [Sensu Go Fatigue Check Filter][8] README.
Next, you'll add the newly minted event filter and an existing handler to a pipeline.

### Add the event filter to a pipeline

Now that you've created the `fatigue_check` event filter, you can add it to a pipeline along with the `slack` handler created in [Send Slack alerts with handlers][3].
You'll also add the built-in `is_incident` filter so that only failing events are handled, which will further reduce the number of Slack messages Sensu sends.

{{% notice note %}}
**NOTE**: If you haven't already created the `slack` handler, follow [Send Slack alerts with handlers](../../observe-process/send-slack-alerts/) before continuing with this step.
{{% /notice %}}

{{< language-toggle >}}

{{< code text "YML" >}}
echo '---
type: Pipeline
api_version: core/v2
metadata:
  name: reduce_alerts
spec:
  workflows:
  - name: slack_alerts
    filters:
    - name: is_incident
      type: EventFilter
      api_version: core/v2
    - name: fatigue_check
      type: EventFilter
      api_version: core/v2
    handler:
      name: slack
      type: Handler
      api_version: core/v2' | sensuctl create
{{< /code >}}

{{< code text "JSON" >}}
echo '{
  "type": "Pipeline",
  "api_version": "core/v2",
  "metadata": {
    "name": "reduce_alerts"
  },
  "spec": {
    "workflows": [
      {
        "name": "slack_alerts",
        "filters": [
          {
            "name": "fatigue_check",
            "type": "EventFilter",
            "api_version": "core/v2"
          },
          {
            "name": "hourly",
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
}' | sensuctl create
{{< /code >}}

{{< /language-toggle >}}

## Confirm the event filter

Instead of waiting to receive a Slack alert, you can verify the proper behavior of these event filters with `sensu-backend` logs.
The default location of these logs varies based on your platform.
Read [Troubleshoot Sensu][2] for details about the log location.

Whenever an event is being handled, a log entry is added with the message `"handler":"slack","level":"debug","msg":"sending event to handler"`, followed by
a second log entry with the message `"msg":"pipelined executed event pipe
handler","output":"","status":0`.
However, if the event is being discarded by the event filter, a log entry with the message `event filtered` will appear instead.

## Next steps

Now that you know how to add event filters to pipelines and use a dynamic runtime asset to help reduce alert fatigue, read the [filters reference][1] for in-depth information about event filters.


[1]:  ../filters/
[2]: ../../../operations/maintain-sensu/troubleshoot#log-file-locations
[3]: ../../observe-process/send-slack-alerts/
[4]: #approach-1-use-sensuctl-to-create-an-event-filter
[5]: #approach-2-use-an-event-filter-dynamic-runtime-asset
[6]: ../../../plugins/assets/
[7]: ../../../plugins/use-assets-to-install-plugins/
[8]: https://bonsai.sensu.io/assets/sensu/sensu-go-fatigue-check-filter
[9]: https://bonsai.sensu.io/
[10]: ../../../operations/monitoring-as-code/#build-as-you-go
[11]: ../../../operations/monitoring-as-code/
[12]: ../../observe-process/pipelines/
[13]: ../../observe-schedule/monitor-server-resources/
[14]: ../../observe-schedule/checks/#pipelines-attribute
[15]: #confirm-the-event-filter
[16]: ../../observe-schedule/subscriptions/
[17]: ../../../operations/deploy-sensu/install-sensu/
[18]: ../../../sensuctl/
