---
title: "Reduce alert fatigue with filters"
linkTitle: "Reduce Alert Fatigue"
description: "Here’s how to reduce alert fatigue with Sensu. Learn about Sensu filters, how they reduce alert fatigue, and how to put them into action."
weight: 120
version: "5.16"
product: "Sensu Go"
platformContent: False
menu: 
  sensu-go-5.16:
    parent: guides
---

- [Use event filters to reduce alert fatigue](#use-event-filters-to-reduce-alert-fatigue)
- [Next steps](#next-steps)

Sensu event filters allow you to filter events destined for one or more event handlers.
Sensu event filters evaluate their expressions against the event data to determine whether the event should be passed to an event handler.

Use event filters to eliminate notification noise from recurring events and to filter events from systems in pre-production environments.

## Use event filters to reduce alert fatigue

In this guide, you learn how to reduce alert fatigue by configuring an event filter named `hourly` for a handler named `slack` to prevent alerts from being sent to Slack every minute.
If you don't already have a handler in place, follow [Send Slack alerts with handlers][3] before continuing with this guide.

You can use either of two approaches to create the event filter to handle occurrences:

- [Use sensuctl][4]
- [Use a filter asset][5]

### Approach 1: Use sensuctl to create an event filter

First, create an event filter called `hourly` that matches new events (where the event's `occurrences` is equal to `1`) or hourly events (every hour after the first occurrence, calculated with the check's `interval` and the event's `occurrences`).

Events in Sensu Go are handled regardless of check execution status.
Even successful check events are passed through the pipeline, so you'll need to add a clause for non-zero status.

{{< highlight shell >}}
sensuctl filter create hourly \
--action allow \
--expressions "event.check.occurrences == 1 || event.check.occurrences % (3600 / event.check.interval) == 0"
{{< /highlight >}}

#### Assign the event filter to a handler

Now that you've created the `hourly` event filter, you can assign it to a handler.
Because you want to reduce the number of Slack messages Sensu sends, you'll apply the event filter to an existing handler named `slack`, in addition to the built-in `is_incident` filter, so only failing events are handled.

{{< highlight shell >}}
sensuctl handler update slack
{{< /highlight >}}

Follow the prompts to add the `hourly` and `is_incident` event filters to the Slack handler.

#### Create a fatigue check event filter

Although you can use `sensuctl` to interactively create a filter, you can create more reusable filters with assets.
Read on to see how to implement a filter using this approach. 

### Approach 2: Use an event filter asset

If you're not already familiar with [assets][6], please take a moment to read [Install plugins with assets][7].
This will help you understand what assets are and how they are used in Sensu. 

In this approach, the first step is to obtain an event filter asset that will allow you to replicate the behavior of the `hourly` event filter created in [Approach 1 via `sensuctl`][4].

Use [`sensuctl asset add`][5] to register the [fatigue check filter][9] asset:

{{< highlight shell >}}
sensuctl asset add nixwiz/sensu-go-fatigue-check-filter:0.3.2 -r fatigue-filter
{{< /highlight >}}

This example uses the `-r` (rename) flag to specify a shorter name for the asset: `fatigue-filter`.

You can also download the asset directly from [Bonsai, the Sensu asset index][9].

You've registered the asset, but you still need to create the filter.
To do this, use the following configuration:

{{< highlight yaml >}}
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
{{< /highlight >}}

Then, create the filter, naming it `sensu-fatigue-check-filter.yml`:

{{< highlight shell >}}
sensuctl create -f sensu-fatigue-check-filter.yml
{{< /highlight >}}

Now that you've created the filter asset and the event filter, you can create the check annotations you need for the asset to work properly. 

#### Annotate a check for filter asset use

Next, you need to make some additions to any checks you want to use the filter with.
Here's an example CPU check:

{{< highlight yaml >}}
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
  output_metric_handlers: 
  proxy_entity_name: ''
  publish: true
  round_robin: false
  runtime_assets: 
  stdin: false
  subdue: 
  subscriptions:
  - linux
  timeout: 0
  ttl: 0
{{< /highlight >}}

Notice the annotations under the `metadata` scope.
The annotations are required for the filter asset to work the same way as the interactively created event filter.
Specifically, the annotations in this check definition are doing several things: 

1. `fatigue_check/occurrences`: Tells the event filter on which occurrence to send the event for further processing
2. `fatigue_check/interval`: Tells the event filter the interval at which to allow additional events to be processed (in seconds)
3. `fatigue_check/allow_resolution`: Determines whether to pass a `resolve` event through to the filter

For more information about configuring these values, see the [filter asset's README][10].
Next, you'll assign the newly minted event filter to a handler.

#### Assign the event filter to a handler

Just like with the [interactively created event filter][4], you'll introduce the filter into your Sensu workflow by configuring a handler to use it.
Here's an example:

{{< highlight yaml >}}
---
api_version: core/v2
type: Handler
metadata:
  namespace: default
  name: slack
spec:
  type: pipe
  command: 'sensu-slack-handler --channel ''#general'' --timeout 20 --username ''sensu'' '
  env_vars:
  - SLACK_WEBHOOK_URL=https://www.webhook-url-for-slack.com
  timeout: 30
  filters:
  - is_incident
  - fatigue_check
{{< /highlight >}}

#### Validate the event filter

Verify the proper behavior of these event filters with `sensu-backend` logs.
The default location of these logs varies based on the platform used (see [Troubleshooting][2] for details).

Whenever an event is being handled, a log entry is added with the message `"handler":"slack","level":"debug","msg":"sending event to handler"`, followed by
a second log entry with the message `"msg":"pipelined executed event pipe
handler","output":"","status":0`.
However, if the event is being discarded by the event filter, a log entry with the message `event filtered` will appear instead.

## Next steps

Now that you know how to apply an event filter to a handler and use a filter asset to help reduce alert fatigue, read the [filters reference][1] for in-depth information about event filters. 

[1]:  ../../reference/filters/
[2]: ../troubleshooting#log-file-locations
[3]: ../send-slack-alerts/
[4]: #approach-1-use-sensuctl-to-create-an-event-filter
[5]: #approach-2-use-an-event-filter-asset
[6]: ../../reference/assets/ 
[7]: ../install-check-executables-with-assets/
[8]: https://bonsai.sensu.io/assets/nixwiz/sensu-go-fatigue-check-filter
[9]: https://bonsai.sensu.io/
[10]: https://github.com/nixwiz/sensu-go-fatigue-check-filter#configuration
