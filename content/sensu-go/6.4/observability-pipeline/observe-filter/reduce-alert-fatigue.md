---
title: "Reduce alert fatigue with event filters"
linkTitle: "Reduce Alert Fatigue"
guide_title: "Reduce alert fatigue with event filters"
type: "guide"
description: "Here’s how to reduce alert fatigue with Sensu. Learn about Sensu filters, how they reduce alert fatigue, and how to put them into action."
weight: 20
version: "6.4"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-6.4:
    parent: observe-filter
---

Sensu event filters allow you to filter events destined for one or more event handlers.
Sensu event filters evaluate their expressions against the observation data in events to determine whether the event should be passed to an event handler.

Use event filters to customize alert policies, improve contact routing, eliminate notification noise from recurring events, and filter events from systems in pre-production environments.

In this guide, you learn how to reduce alert fatigue by configuring an event filter named `hourly` for a handler named `slack` to prevent alerts from being sent to Slack every minute.
If you don't already have a handler in place, follow [Send Slack alerts with handlers][3] before continuing with this guide.

You can use either of two approaches to create the event filter to handle occurrences:

- [Use sensuctl][4]
- [Use a filter dynamic runtime asset][5]

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

{{< code shell >}}
Created
{{< /code >}}

This sensuctl command creates an event filter resource with the following definition:

{{< language-toggle >}}

{{< code yml >}}
---
type: EventFilter
api_version: core/v2
metadata:
  created_by: admin
  name: hourly
  namespace: default
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
    "created_by": "admin",
    "name": "hourly",
    "namespace": "default"
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

### Assign the event filter to a handler

Now that you've created the `hourly` event filter, you can assign it to a handler.
In this case, because you want to reduce the number of Slack messages Sensu sends, you'll apply your `hourly` event filter to the `slack` handler created in [Send Slack alerts with handlers][3].
You'll also add the built-in `is_incident` filter so that only failing events are handled.

{{% notice note %}}
**NOTE**: If you haven't already created the `slack` handler, follow [Send Slack alerts with handlers](../../observe-process/send-slack-alerts/) before continuing with this step.
{{% /notice %}}

To update the handler, run:

{{< code shell >}}
sensuctl handler update slack
{{< /code >}}

Follow the prompts to add the `hourly` and `is_incident` event filters to the `slack handler`:

{{< code shell >}}
? Environment variables: SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX
? Filters: hourly,is_incident
? Mutator: 
? Timeout: 0
? Type: pipe
? Runtime Assets: sensu-slack-handler
? Command: sensu-slack-handler --channel '#monitoring'
{{< /code >}}

You will receive a confirmation message:

{{< code shell >}}
Updated
{{< /code >}}

To view the updated `slack` handler resource definition:

{{< language-toggle >}}

{{< code shell "YML">}}
sensuctl handler info slack --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl handler info slack --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The updated handler definition will be similar to this example:

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  created_by: admin
  name: slack
  namespace: default
spec:
  command: sensu-slack-handler --channel '#monitoring'
  env_vars:
  - SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX
  filters:
  - hourly
  - is_incident
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
    "created_by": "admin",
    "name": "slack",
    "namespace": "default"
  },
  "spec": {
    "command": "sensu-slack-handler --channel '#monitoring'",
    "env_vars": [
      "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX"
    ],
    "filters": [
      "hourly",
      "is_incident"
    ],
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

In addition to using this approach with `sensuctl` to interactively create an event filter, you can create more reusable event filters with dynamic runtime assets.
Read on to learn how. 

## Approach 2: Use an event filter dynamic runtime asset

If you're not already familiar with [dynamic runtime assets][6], please take a moment to read [Use assets to install plugins][7].
This will help you understand what dynamic runtime assets are and how they are used in Sensu. 

In this approach, the first step is to obtain an event filter dynamic runtime asset that will allow you to replicate the behavior of the `hourly` event filter created in [Approach 1 via `sensuctl`][4].

Use [`sensuctl asset add`][5] to register the [fatigue check filter][8] dynamic runtime asset:

{{< code shell >}}
sensuctl asset add sensu/sensu-go-fatigue-check-filter:0.8.1 -r fatigue-filter
{{< /code >}}

The response will indicate that the asset was added:

{{< code shell >}}
fetching bonsai asset: sensu/sensu-go-fatigue-check-filter:0.8.1
added asset: sensu/sensu-go-fatigue-check-filter:0.8.1

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["fatigue-filter"].
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the asset: `fatigue-filter`.

You can also download the asset directly from [Bonsai, the Sensu asset hub][9].

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
Read [the asset reference](../../../plugins/assets#dynamic-runtime-asset-builds) for more information about dynamic runtime asset builds.
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
  namespace: default
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
    "name": "fatigue_check",
    "namespace": "default"
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

{{< code shell "YML">}}
sensuctl create -f sensu-fatigue-check-filter.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl create -f sensu-fatigue-check-filter.json
{{< /code >}}

{{< /language-toggle >}}

Now that you've created the filter dynamic runtime asset and the event filter, you can create the check annotations you need for the dynamic runtime asset to work properly. 

### Annotate a check for filter dynamic runtime asset use

Next, you'll need to make some additions to any checks you want to use the `fatigue_check` filter with.
Here's an example CPU check:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: linux-cpu-check
  namespace: default
  annotations:
    fatigue_check/occurrences: '1'
    fatigue_check/interval: '3600'
    fatigue_check/allow_resolution: 'false'
spec:
  command: check-cpu -w 90 c 95
  env_vars: 
  handlers:
  - email
  high_flap_threshold: 0
  interval: 60
  low_flap_threshold: 0
  output_metric_format: ''
  output_metric_handlers: null
  output_metric_tags: null
  proxy_entity_name: ''
  publish: true
  round_robin: false
  runtime_assets: null
  stdin: false
  subdue: 
  subscriptions:
  - linux
  timeout: 0
  ttl: 0
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "linux-cpu-check",
    "namespace": "default",
    "annotations": {
      "fatigue_check/occurrences": "1",
      "fatigue_check/interval": "3600",
      "fatigue_check/allow_resolution": "false"
    }
  },
  "spec": {
    "command": "check-cpu -w 90 c 95",
    "env_vars": null,
    "handlers": [
      "email"
    ],
    "high_flap_threshold": 0,
    "interval": 60,
    "low_flap_threshold": 0,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "output_metric_tags": null,
    "proxy_entity_name": "",
    "publish": true,
    "round_robin": false,
    "runtime_assets": null,
    "stdin": false,
    "subdue": null,
    "subscriptions": [
      "linux"
    ],
    "timeout": 0,
    "ttl": 0
  }
}
{{< /code >}}

{{< /language-toggle >}}

Notice the annotations under the `metadata` scope.
The annotations are required for the filter dynamic runtime asset to work the same way as the interactively created event filter.
Specifically, the annotations in this check definition are doing several things: 

1. `fatigue_check/occurrences`: Tells the event filter on which occurrence to send the event for further processing
2. `fatigue_check/interval`: Tells the event filter the interval at which to allow additional events to be processed (in seconds)
3. `fatigue_check/allow_resolution`: Determines whether to pass a `resolve` event through to the filter

For more information about configuring these values, read the [Sensu Go Fatigue Check Filter][8] README.
Next, you'll assign the newly minted event filter to a handler.

### Assign the event filter to a handler

Just like with the [interactively created event filter][4], you'll introduce the filter into your Sensu workflow by configuring the `slack` handler to use it:

{{< code shell >}}
sensuctl handler update slack
{{< /code >}}

Follow the prompts to add the `fatigue_check` and `is_incident` event filters to the `slack handler`:

{{< code shell >}}
? Environment variables: SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX
? Filters: fatigue_check,is_incident
? Mutator: 
? Timeout: 0
? Type: pipe
? Runtime Assets: sensu-slack-handler
? Command: sensu-slack-handler --channel '#monitoring'
{{< /code >}}

You will receive a confirmation message:

{{< code shell >}}
Updated
{{< /code >}}

To view the updated `slack` handler definition:

{{< language-toggle >}}

{{< code shell "YML">}}
sensuctl handler info slack --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl handler info slack --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The updated handler definition will be similar to this example:

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  created_by: admin
  name: slack
  namespace: default
spec:
  command: sensu-slack-handler --channel '#monitoring'
  env_vars:
  - SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX
  filters:
  - fatigue_check
  - is_incident
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
    "created_by": "admin",
    "name": "slack",
    "namespace": "default"
  },
  "spec": {
    "command": "sensu-slack-handler --channel '#monitoring'",
    "env_vars": [
      "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX"
    ],
    "filters": [
      "fatigue_check",
      "is_incident"
    ],
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

### Validate the event filter

Verify the proper behavior of these event filters with `sensu-backend` logs.
The default location of these logs varies based on the platform used (read [Troubleshoot Sensu][2] for details).

Whenever an event is being handled, a log entry is added with the message `"handler":"slack","level":"debug","msg":"sending event to handler"`, followed by
a second log entry with the message `"msg":"pipelined executed event pipe
handler","output":"","status":0`.
However, if the event is being discarded by the event filter, a log entry with the message `event filtered` will appear instead.

## Next steps

Now that you know how to apply an event filter to a handler and use a dynamic runtime asset to help reduce alert fatigue, read the [filters reference][1] for in-depth information about event filters.


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
