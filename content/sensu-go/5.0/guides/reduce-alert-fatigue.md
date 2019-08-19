---
title: "How to reduce alert fatigue with filters"
linkTitle: "Reducing Alert Fatigue"
description: "Here’s how to reduce alert fatigue with Sensu. In this guide, you’ll learn about Sensu filters — why to use them, how they reduce alert fatigue, and how to put them into action."
weight: 38
version: "5.0"
product: "Sensu Go"
platformContent: False
menu: 
  sensu-go-5.0:
    parent: guides
---

## What are Sensu filters?

Sensu filters allow you to filter **events** destined for one or more event
**handlers**. Sensu filters evaluate their expressions against the event data, to
determine if the event should be passed to an event handler.

## Why use a filter?

Filters are commonly used to filter recurring events (i.e. to eliminate
notification noise) and to filter events from systems in pre-production
environments.

## Using filters to reduce alert fatigue

The purpose of this guide is to help you reduce alert fatigue by configuring a
filter named `hourly`, for a handler named `slack`, in order to prevent alerts
from being sent to Slack every minute. If you don't already have a handler in
place, learn [how to send alerts with handlers][3].

### Creating the filter

We'll show you two approaches to creating a filter that will handle occurrences. The first approach will be to create our own filter that we'll add to Sensu. The second approach will cover implementing the filter as an asset.

#### Using Sensuctl to Create a Filter

The first step is to create a filter that we will call `hourly`, which matches
new events (where the event's `occurrences` is equal to `1`) or hourly events
(so every hour after the first occurrence, calculated with the check's
`interval` and the event's `occurrences`).

Events in Sensu Go are handled regardless of
check execution status; even successful check events are passed through the
pipeline. Therefore, it's necessary to add a clause for non-zero status.

{{< highlight shell >}}
sensuctl filter create hourly \
--action allow \
--expressions "event.check.occurrences == 1 || event.check.occurrences % (3600 / event.check.interval) == 0"
{{< /highlight >}}

#### Assigning the filter to a handler

Now that the `hourly` filter has been created, it can be assigned to a handler.
Here, since we want to reduce the number of Slack messages sent by Sensu, we will apply
our filter to an already existing handler named `slack`, in addition to the
built-in `is_incident` filter so only failing events are handled.

{{< highlight shell >}}
sensuctl handler update slack
{{< /highlight >}}

Follow the prompts to add the `hourly` and `is_incident` filters to the Slack
handler.

### Creating a fatigue check filter

While we can use `sensuctl` to interactively create a filter, we can create more reusable filters through the use of assets. Read on to see how to implement a filter using this approach. 

#### Using a Filter Asset

If you're not already familiar with [assets][asset-reference], take a minute or two and read over our [guide to installing plugins with assets][asset-guide]. This will help you understand what an asset is and how they are used in Sensu. 

The first step we'll need to take is to obtain a filter asset that will allow us to replicate the behavior we used when we created the `hourly` filter via `sensuctl`. Let's use the [fatigue check asset][fatigue-check-asset] from the [Bonsai Asset Index][bonsai-io]. You can download the asset directly by running the following:

{{< highlight shell >}}
curl -s https://bonsai.sensu.io/release_assets/nixwiz/sensu-go-fatigue-check-filter/0.1.3/any/noarch/download | sensuctl create
{{< /highlight >}}

Excellent! You've registered the asset. We still need to create our filter. We'll use the following configuration for creating the actual filter. In this case, we'll call it `sensu-fatigue-check-filter.yml`:

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
  - fatigue-check-filter
{{< /highlight >}}

And we'll go ahead and create it:

{{< highlight shell >}}
sensuctl create -f sensu-fatigue-check-filter.yml
{{< /highlight >}}

Now that we've created the filter asset and the filter, let's move on to the check annotations needed for the asset to work properly. 

#### Annotating a check for filter asset use

Now that we've created the filter, we'll need to make some additions to any checks we want to use the filter with. Let's look at an example CPU check:

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

You'll notice that under the `metadata` scope we've added some annotations. For our filter asset to work the way that our interactively created filter does, these annotations are necessary.  Let's discuss those annotations briefly.

The annotations in our check definition are doing several things: 

1. `fatigue_check/occurrences`: This tells the filter on which occurrence we're going to send the even through for further processing
2. `fatigue_check/interval`: This value (in seconds) tells the filter at what interval to allow additional events to be processed
3. `fatigue_check/allow_resolution`: Determines if a `resolve` event will be passed through to the filter.

For more information on configuring these values, see the [filter asset README][fatigue-check-configuration]. Now let's assign our newly minted filter to a handler.

#### Assigning the filter to a handler

Just like we did with our interactively created filter, we're going to assign our filter to a handler. We can use the following handler example:

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

Let's move on to validating our filter.

### Validating the filter

You can verify the proper behavior of these filters by using `sensu-backend` logs.
The default location of these logs varies based on the platform used, but the
[troubleshooting guide][2] provides this information.

Whenever an event is being handled, a log entry is added with the message
`"handler":"slack","level":"debug","msg":"sending event to handler"`, followed by
a second one with the message `"msg":"pipelined executed event pipe
handler","output":"","status":0`. However, if the event is being discarded by
our filter, a log entry with the message `event filtered` will appear instead.

## Next steps

You now know how to apply a filter to a handler, as well as use a filter asset and hopefully reduce alert
fatigue. From this point, here are some recommended resources:

* Read the [filters reference][1] for in-depth
  documentation on filters. 

[1]:  ../../reference/filters
[2]: ../troubleshooting#log-file-locations
[3]: ../send-slack-alerts

<!--Supplemental Links-->
[asset-reference]: ../../reference/assets/ 
[asset-guide]: ../install-check-executables-with-assets/
[fatigue-check-asset]: https://bonsai.sensu.io/assets/nixwiz/sensu-go-fatigue-check-filter
[bonsai-io]: https://bonsai.sensu.io/
[fatigue-check-configuration]: https://github.com/nixwiz/sensu-go-fatigue-check-filter#configuration