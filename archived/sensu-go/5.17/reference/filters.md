---
title: "Filters"
description: "Filters help you reduce alert fatigue by controlling which events are acted on by Sensu handlers. Read the reference doc to learn about event filters, use Sensu's built-in filters, and create your own event filters."
weight: 100
version: "5.17"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.17:
    parent: reference
---

- [Inclusive and exclusive event filters](#inclusive-and-exclusive-event-filters)
- [Built-in event filters](#built-in-event-filters)
- [Build event filter expressions](#build-event-filter-expressions)
- [Event filter specification](#event-filter-specification)
  - [Top-level attributes](#top-level-attributes) | [Metadata attributes](#metadata-attributes) | [Spec attributes](#spec-attributes)
- [Event filter examples](#event-filter-examples)
	- [Handle production events](#handle-production-events)
	- [Handle non-production events](#handle-non-production-events)
	- [Handle state change only](#handle-state-change-only)
	- [Handle repeated events](#handle-repeated-events)
	- [Handle events during office hours only](#handle-events-during-office-hours-only)
- [Use JavaScript libraries with Sensu filters](#use-javascript-libraries-with-sensu-filters)

Sensu event filters are applied when you configure event handlers to use one or more filters.
Before executing a handler, the Sensu backend will apply any event filters configured for the handler to the event data.
If the filters do not remove the event, the handler will be executed.

The filter analysis performs these steps:

* When the Sensu backend is processing an event, it checks for the definition of a `handler` (or `handlers`).
Before executing each handler, the Sensu server first applies any configured `filters` for the handler.
* If multiple `filters` are configured for a handler, they are executed sequentially.
* Filter `expressions` are compared with event data.

Event filters can be inclusive (only matching events are handled) or exclusive (matching events are not handled).

As soon as a filter removes an event, no further analysis is performed and the event handler will not be executed.

_**NOTE**: Filters specified in a **handler set** definition have no effect. Filters must be specified in individual handler definitions._

## Inclusive and exclusive event filters

Event filters can be _inclusive_ (`"action": "allow"`; replaces `"negate": false` in Sensu Core) or _exclusive_ (`"action": "deny"`; replaces `"negate": true` in Sensu Core).
Configuring a handler to use multiple _inclusive_ event filters is the equivalent of using an `AND` query operator (only handle events if they match the _inclusive_ filter: `x AND y AND z`).
Configuring a handler to use multiple _exclusive_ event filters is the equivalent of using an `OR` operator (only handle events if they don’t match `x OR y OR z`).

In **inclusive filtering**, by setting the event filter definition attribute `"action": "allow"`, only events that match the defined filter expressions are handled.

In **exclusive filtering**, by setting the event filter definition attribute `"action": "deny"`, events are only handled if they do not match the defined filter expressions.

### Filter expression comparison

Event filter expressions are compared directly with their event data counterparts.
For inclusive event filter definitions (`"action": "allow"`), matching expressions will result in the filter returning a `true` value.
For exclusive event filter definitions (`"action": "deny"`), matching expressions will result in the filter returning a `false` value, and the event will not pass through the filter.
Event filters that return a `true` value will continue to be processed via additional filters (if defined), mutators (if defined), and handlers.

### Filter expression evaluation

When more complex conditional logic is needed than direct filter expression comparison, Sensu event filters provide support for expression evaluation using [Otto][31].
Otto is an ECMAScript 5 (JavaScript) virtual machine that evaluates JavaScript expressions provided in an event filter.
There are some caveats to using Otto: not all of the regular expressions specified in ECMAScript 5 will work.
See the [Otto README][32] for more details.

### Filter assets

Sensu event filters can have assets that are included in their execution context.
When valid assets are associated with an event filter, Sensu evaluates any files it finds that have a ".js" extension before executing the filter.
The result of evaluating the scripts is cached for a given asset set for the sake of performance.
For an example of how to implement an event filter as an asset, see [Reduce alert fatigue][30].

## Built-in event filters

Sensu includes built-in event filters to help you customize event pipelines for metrics and alerts.
To start using built-in event filters, see [Send Slack alerts][4] and [Plan maintenance][5].

### Built-in filter: is_incident

The is_incident event filter is included in every installation of the [Sensu backend][8].
You can use the is_incident filter to allow only high-priority events through a Sensu pipeline.
For example, you can use the is_incident filter to reduce noise when sending notifications to Slack.
When applied to a handler, the is_incident filter allows only warning (`"status": 1`), critical (`"status": 2`), and resolution events to be processed.

To use the is_incident event filter, include `is_incident` in the handler configuration `filters` array:

{{< language-toggle >}}

{{< highlight yml >}}
type: Handler
api_version: core/v2
metadata:
  name: slack
  namespace: default
spec:
  command: sensu-slack-handler --channel '#monitoring'
  env_vars:
  - SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
  filters:
  - is_incident
  handlers: []
  runtime_assets: []
  timeout: 0
  type: pipe
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "slack",
    "namespace": "default"
  },
  "spec": {
    "command": "sensu-slack-handler --channel '#monitoring'",
    "env_vars": [
      "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
    ],
    "filters": [
      "is_incident"
    ],
    "handlers": [],
    "runtime_assets": [],
    "timeout": 0,
    "type": "pipe"
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

The is_incident event filter applies the following filtering logic:

| status | allow | discard |     |     |     |     |
| ----- | ----- | ------- | --- | --- | --- | --- |
| 0     |   |{{< cross >}}| | | | |
| 1     |{{< check >}} |  | | | | |
| 2     |{{< check >}} |  | | | | |
| other |   |{{< cross >}}| | | | |
| 1 --> 0 or 2 --> 0<br>(resolution event)  |{{< check >}} |  | | | | |

### Built-in filter: not_silenced

[Sensu silencing][6] lets you suppress execution of event handlers on an on-demand basis so you can quiet incoming alerts and [plan maintenance][5].

To allow silencing for an event handler, add `not_silenced` to the handler configuration `filters` array:

{{< language-toggle >}}

{{< highlight yml >}}
type: Handler
api_version: core/v2
metadata:
  name: slack
  namespace: default
spec:
  command: sensu-slack-handler --channel '#monitoring'
  env_vars:
  - SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
  filters:
  - is_incident
  - not_silenced
  handlers: []
  runtime_assets: []
  timeout: 0
  type: pipe
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "slack",
    "namespace": "default"
  },
  "spec": {
    "command": "sensu-slack-handler --channel '#monitoring'",
    "env_vars": [
      "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
    ],
    "filters": [
      "is_incident",
      "not_silenced"
    ],
    "handlers": [],
    "runtime_assets": [],
    "timeout": 0,
    "type": "pipe"
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

When applied to a handler configuration, the not_silenced event filter silences events that include the `silenced` attribute.
The handler in the example above uses both the not_silenced and [is_incident][7] event filters, preventing low-priority and silenced events from being sent to Slack.

### Built-in filter: has_metrics

The has_metrics event filter is included in every installation of the [Sensu backend][8].
When applied to a handler, the has_metrics filter allows only events that contain [Sensu metrics][9] to be processed.
You can use the has_metrics filter to prevent handlers that require metrics from failing in case of an error in metric collection.

To use the has_metrics event filter, include `has_metrics` in the handler configuration `filters` array:

{{< language-toggle >}}

{{< highlight yml >}}
type: Handler
api_version: core/v2
metadata:
  name: influx-db
  namespace: default
spec:
  command: sensu-influxdb-handler -d sensu
  env_vars:
  - INFLUXDB_ADDR=http://influxdb.default.svc.cluster.local:8086
  - INFLUXDB_USER=sensu
  - INFLUXDB_PASSWORD=password
  filters:
  - has_metrics
  handlers: []
  runtime_assets: []
  timeout: 0
  type: pipe
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "influx-db",
    "namespace": "default"
  },
  "spec": {
    "command": "sensu-influxdb-handler -d sensu",
    "env_vars": [
      "INFLUXDB_ADDR=http://influxdb.default.svc.cluster.local:8086",
      "INFLUXDB_USER=sensu",
      "INFLUXDB_PASSWORD=password"
    ],
    "filters": [
      "has_metrics"
    ],
    "handlers": [],
    "runtime_assets": [],
    "timeout": 0,
    "type": "pipe"
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

When applied to a handler configuration, the has_metrics event filter allows only events that include a [`metrics` scope][9].

## Build event filter expressions

You can write custom event filter expressions as [Sensu query expressions][27] using the event data attributes described in this section.
For more information about event attributes, see the [event reference][28].

### Syntax quick reference

<table>
<thead>
<tr>
<th>operator</th>
<th>description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>===</code> / <code>!==</code></td>
<td>Identity operator / Nonidentity operator</td>
</tr>
<tr>
<td><code>==</code> / <code>!=</code></td>
<td>Equality operator / Inequality operator</td>
</tr>
<tr>
<td><code>&&</code> / <code>||</code></td>
<td>Logical AND / Logical OR</td>
</tr>
<tr>
<td><code><</code> / <code>></code></td>
<td>Less than / Greater than</td>
</tr>
<tr>
<td><code><=</code> / <code>>=</code></td>
<td>Less than or equal to / Greater than or equal to</td>
</tr>
</tbody>
</table>

### Event attributes available to filters

| attribute           | type    | description |
| ------------------- | ------- | ----------- |
`event.has_check`     | Boolean | Returns true if the event contains check data
`event.has_metrics`   | Boolean | Returns true if the event contains metrics
`event.is_incident`   | Boolean | Returns true for critical alerts (status `2`), warnings (status `1`), and resolution events (status `0` transitioning from status `1` or `2`)
`event.is_resolution` | Boolean | Returns true if the event status is OK (`0`) and the previous event was of a non-zero status
`event.is_silenced`   | Boolean | Returns true if the event matches an active silencing entry
`event.timestamp`     | integer | Time that the event occurred in seconds since the Unix epoch

### Check attributes available to filters

| attribute                          | type    | description |
| ---------------------------------- | ------- | ----------- |
`event.check.annotations`            | map     | Custom [annotations][19] applied to the check
`event.check.command`                | string  | The command executed by the check
`event.check.cron`                   | string  | [Check execution schedule][21] using cron syntax
`event.check.discard_output`         | Boolean | Whether the check is configured to discard check output from event data
`event.check.duration`               | float   | Command execution time in seconds
`event.check.env_vars`               | array   | Environment variables used with command execution
`event.check.executed`               | integer | Time that the check was executed in seconds since the Unix epoch
`event.check.handlers`               | array   | Sensu event [handlers][22] assigned to the check
`event.check.high_flap_threshold`    | integer | The check's flap detection high threshold in percent state change
`event.check.history`                | array   | [Check status history][20] for the last 21 check executions
`event.check.hooks`                  | array   | [Check hook][12] execution data
`event.check.interval`               | integer | The check execution frequency in seconds
`event.check.issued`                 | integer | Time that the check request was issued in seconds since the Unix epoch
`event.check.labels`                 | map     | Custom [labels][19] applied to the check
`event.check.last_ok`                | integer | The last time that the check returned an OK status (`0`) in seconds since the Unix epoch
`event.check.low_flap_threshold`     | integer | The check's flap detection low threshold in percent state change
`event.check.max_output_size`        | integer | Maximum size of stored check outputs in bytes
`event.check.name`                   | string  | Check name
`event.check.occurrences`            | integer | The [number of preceding events][29] with the same status as the current event
`event.check.occurrences_watermark`  | integer | For resolution events, the [number of preceding events][29] with a non-OK status
`event.check.output`                 | string  | The output from the execution of the check command
`event.check.output_metric_format`   | string  | The [metric format][13] generated by the check command: `nagios_perfdata`, `graphite_plaintext`, `influxdb_line`, or `opentsdb_line` 
`event.check.output_metric_handlers` | array   | Sensu metric [handlers][22] assigned to the check
`event.check.proxy_entity_name`      | string  | The entity name, used to create a [proxy entity][14] for an external resource
`event.check.proxy_requests`         | map     | [Proxy request][15] configuration
`event.check.publish`                | Boolean | Whether the check is scheduled automatically
`event.check.round_robin`            | Boolean | Whether the check is configured to be executed in a [round-robin style][16]
`event.check.runtime_assets`         | array   | Sensu [assets][17] used by the check
`event.check.state`                  | string  | The state of the check: `passing` (status `0`), `failing` (status other than `0`), or `flapping`
`event.check.status`                 | integer | Exit status code produced by the check: `0` (OK), `1` (warning), `2` (critical), or other status (unknown or custom status)
`event.check.stdin`                  | Boolean | Whether the Sensu agent writes JSON-serialized entity and check data to the command process’ STDIN
`event.check.subscriptions`          | array   | Subscriptions that the check belongs to
`event.check.timeout`                | integer | The check execution duration timeout in seconds
`event.check.total_state_change`     | integer | The total state change percentage for the check’s history
`event.check.ttl`                    | integer | The time-to-live (TTL) until the event is considered stale, in seconds
`event.metrics.handlers`             | array   | Sensu metric [handlers][22] assigned to the check
`event.metrics.points`               | array   | [Metric data points][23] including a name, timestamp, value, and tags

### Entity attributes available to filters

| attribute                            | type    | description |
| ------------------------------------ | ------- | ----------- |
`event.entity.annotations`             | map     | Custom [annotations][24] assigned to the entity
`event.entity.deregister`              | Boolean | Whether the agent entity should be removed when it stops sending [keepalive messages][26]
`event.entity.deregistration`          | map     | A map that contains a handler name for use when an entity is deregistered
`event.entity.entity_class`            | string  | The entity type: usually `agent` or `proxy`
`event.entity.labels`                  | map     | Custom [labels][24] assigned to the entity
`event.entity.last_seen`               | integer | Timestamp the entity was last seen in seconds since the Unix epoch
`event.entity.name`                    | string  | Entity name
`event.entity.redact`                  | array   | List of items to redact from log messages
`event.entity.subscriptions`           | array   | List of subscriptions assigned to the entity
`event.entity.system`                  | map     | Information about the [entity's system][18]
`event.entity.system.arch`             | string  | The entity's system architecture
`event.entity.system.hostname`         | string  | The entity's hostname
`event.entity.system.network`          | map     | The entity's network interface list
`event.entity.system.os`               | string  | The entity’s operating system
`event.entity.system.platform`         | string  | The entity’s operating system distribution
`event.entity.system.platform_family`  | string  | The entity’s operating system family
`event.entity.system.platform_version` | string  | The entity’s operating system version
`event.entity.user`                    | string  | Sensu [RBAC][25] username used by the agent entity

## Event filter specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][33] resource type. Event filters should always be type `EventFilter`.
required     | Required for filter definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][33].
type         | String
example      | {{< highlight shell >}}"type": "EventFilter"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For event filters in this version of Sensu, this attribute should always be `core/v2`.
required     | Required for filter definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][33].
type         | String
example      | {{< highlight shell >}}"api_version": "core/v2"{{< /highlight >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the event filter, including the `name` and `namespace` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the filter definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. See [metadata attributes][11] for details.
required     | Required for filter definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][33].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"metadata": {
  "name": "filter-weekdays-only",
  "namespace": "default",
  "labels": {
    "region": "us-west-1"
  },
  "annotations": {
    "slack-channel" : "#monitoring"
  }
}
{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes the event filter [spec attributes][34].
required     | Required for filter definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][33].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"spec": {
  "action": "allow",
  "expressions": [
    "event.entity.namespace == 'production'"
  ],
  "runtime_assets": []
}
{{< /highlight >}}

### Metadata attributes

| name       |      |
-------------|------
description  | Unique string used to identify the event filter. Filter names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][35]). Each filter must have a unique name within its namespace.
required     | true
type         | String
example      | {{< highlight shell >}}"name": "filter-weekdays-only"{{< /highlight >}}

| namespace  |      |
-------------|------
description  | Sensu [RBAC namespace][10] that the event filter belongs to.
required     | false
type         | String
default      | `default`
example      | {{< highlight shell >}}"namespace": "production"{{< /highlight >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with event data that you can use for response and web UI view filtering.<br><br>If you include labels in your event data, you can filter [API responses][36], [sensuctl responses][37], and [web UI views][41] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}}"labels": {
  "environment": "development",
  "region": "us-west-2"
}{{< /highlight >}}

| annotations | |
-------------|------
description  | Non-identifying metadata to include with event data that you can access with [event filters][40]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][36], [sensuctl response filtering][37], or [web UI views][42].
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}} "annotations": {
  "managed-by": "ops",
  "playbook": "www.example.url"
}{{< /highlight >}}

### Spec attributes

action       | 
-------------|------
description  | Action to take with the event if the event filter expressions match. See [Inclusive and exclusive event filters][1] for more information.
required     | true
type         | String
allowed values | `allow`, `deny`
example      | {{< highlight shell >}}"action": "allow"{{< /highlight >}}

expressions   | 
-------------|------
description  | Event filter expressions to be compared with event data. You can reference event metadata without including the `metadata` scope (for example, `event.entity.namespace`).
required     | true
type         | Array
example      | {{< highlight shell >}}"expressions": [
  "event.check.team == 'ops'"
]
{{< /highlight >}}

runtime_assets |      |
---------------|------
description    | Assets to apply to the event filter's execution context. JavaScript files in the lib directory of the asset will be evaluated.
required       | false
type           | Array of string
default        | []
example        | {{< highlight shell >}}"runtime_assets": ["underscore"]{{< /highlight >}}

## Event filter examples

### Minimum required filter attributes

{{< language-toggle >}}

{{< highlight yml >}}
type: EventFilter
api_version: core/v2
metadata:
  name: filter_minimum
  namespace: default
spec:
  action: allow
  expressions:
  - event.check.occurrences == 1
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "filter_minimum",
    "namespace": "default"
  },
  "spec": {
    "action": "allow",
    "expressions": [
      "event.check.occurrences == 1"
    ]
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

### Handle production events

The following event filter allows handling for only events with a custom entity label `"environment": "production"`:

{{< language-toggle >}}

{{< highlight yml >}}
type: EventFilter
api_version: core/v2
metadata:
  name: production_filter
  namespace: default
spec:
  action: allow
  expressions:
  - event.entity.labels['environment'] == 'production'
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "production_filter",
    "namespace": "default"
  },
  "spec": {
    "action": "allow",
    "expressions": [
      "event.entity.labels['environment'] == 'production'"
    ]
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

### Handle non-production events

The following event filter discards events with a custom entity label `"environment": "production"`, allowing handling only for events without an `environment` label or events with `environment` set to something other than `production`.

_**NOTE**: `action` is `deny`, so this is an exclusive event filter. If evaluation returns false, the event is handled._

{{< language-toggle >}}

{{< highlight yml >}}
type: EventFilter
api_version: core/v2
metadata:
  name: not_production
  namespace: default
spec:
  action: deny
  expressions:
  - event.entity.labels['environment'] == 'production'
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "not_production",
    "namespace": "default"
  },
  "spec": {
    "action": "deny",
    "expressions": [
      "event.entity.labels['environment'] == 'production'"
    ]
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

### Handle state change only

This example demonstrates how to use the `state_change_only` inclusive event filter to reproduce the behavior of a monitoring system that alerts only on state change:

{{< language-toggle >}}

{{< highlight yml >}}
type: EventFilter
api_version: core/v2
metadata:
  annotations: null
  labels: null
  name: state_change_only
  namespace: default
spec:
  action: allow
  expressions:
  - event.check.occurrences == 1
  runtime_assets: []
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "state_change_only",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "spec": {
    "action": "allow",
    "expressions": [
      "event.check.occurrences == 1"
    ],
    "runtime_assets": []
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

### Handle repeated events

In this example, the `filter_interval_60_hourly` event filter will match event data with a check `interval` of `60` seconds _AND_ an `occurrences` value of `1` (the first occurrence) _OR_ any `occurrences` value that is evenly divisible by 60 via a [modulo operator][38] calculation (calculating the remainder after dividing `occurrences` by 60):

{{< language-toggle >}}

{{< highlight yml >}}
type: EventFilter
api_version: core/v2
metadata:
  annotations: null
  labels: null
  name: filter_interval_60_hourly
  namespace: default
spec:
  action: allow
  expressions:
  - event.check.interval == 60
  - event.check.occurrences == 1 || event.check.occurrences % 60 == 0
  runtime_assets: []
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "filter_interval_60_hourly",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "spec": {
    "action": "allow",
    "expressions": [
      "event.check.interval == 60",
      "event.check.occurrences == 1 || event.check.occurrences % 60 == 0"
    ],
    "runtime_assets": []
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

This example will apply the same logic as the previous example but for checks with a 30-second `interval`:

{{< language-toggle >}}

{{< highlight yml >}}
type: EventFilter
api_version: core/v2
metadata:
  annotations: null
  labels: null
  name: filter_interval_30_hourly
  namespace: default
spec:
  action: allow
  expressions:
  - event.check.interval == 30
  - event.check.occurrences == 1 || event.check.occurrences % 120 == 0
  runtime_assets: []
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "filter_interval_30_hourly",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "spec": {
    "action": "allow",
    "expressions": [
      "event.check.interval == 30",
      "event.check.occurrences == 1 || event.check.occurrences % 120 == 0"
    ],
    "runtime_assets": []
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

### Handle events during office hours only

This event filter evaluates the event timestamp to determine if the event occurred between 9 AM and 5 PM UTC on a weekday.
Remember that `action` is equal to `allow`, so this is an inclusive event filter.
If evaluation returns false, the event will not be handled.

{{< language-toggle >}}

{{< highlight yml >}}
type: EventFilter
api_version: core/v2
metadata:
  annotations: null
  labels: null
  name: nine_to_fiver
  namespace: default
spec:
  action: allow
  expressions:
  - weekday(event.timestamp) >= 1 && weekday(event.timestamp) <= 5
  - hour(event.timestamp) >= 9 && hour(event.timestamp) <= 17
  runtime_assets: []
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "nine_to_fiver",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "spec": {
    "action": "allow",
    "expressions": [
      "weekday(event.timestamp) >= 1 && weekday(event.timestamp) <= 5",
      "hour(event.timestamp) >= 9 && hour(event.timestamp) <= 17"
    ],
    "runtime_assets": []
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

## Use JavaScript libraries with Sensu filters

You can include JavaScript libraries in their event filter execution context with [assets][39].
For instance, if you package underscore.js into a Sensu asset, you can use functions from the underscore library for filter expressions:

{{< language-toggle >}}

{{< highlight yml >}}
type: EventFilter
api_version: core/v2
metadata:
  annotations: null
  labels: null
  name: deny_if_failure_in_history
  namespace: default
spec:
  action: deny
  expressions:
  - _.reduce(event.check.history, function(memo, h) { return (memo || h.status !=
    0); })
  runtime_assets:
  - underscore
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "deny_if_failure_in_history",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "spec": {
    "action": "deny",
    "expressions": [
      "_.reduce(event.check.history, function(memo, h) { return (memo || h.status != 0); })"
    ],
    "runtime_assets": ["underscore"]
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

[1]: #inclusive-and-exclusive-event-filters
[2]: #when-attributes
[3]: ../../reference/sensuctl/#time-windows
[4]: ../../guides/send-slack-alerts/
[5]: ../../guides/plan-maintenance/
[6]: ../silencing/
[7]: #built-in-filter-is-incident
[8]: ../backend/
[9]: ../events/
[10]: ../rbac#namespaces
[11]: #metadata-attributes
[12]: ../hooks/
[13]: ../../guides/extract-metrics-with-checks/
[14]: ../checks#use-a-proxy-check-to-monitor-a-proxy-entity
[15]: ../checks#use-a-proxy-check-to-monitor-multiple-proxy-entities
[16]: ../checks#round-robin-checks
[17]: ../assets/
[18]: ../entities#system-attributes
[19]: ../checks/#metadata-attributes
[20]: ../events/#history-attributes
[21]: ../checks#check-scheduling
[22]: ../handlers/
[23]: ../events#metric-attributes
[24]: ../entities#metadata-attributes
[25]: ../rbac#default-roles
[26]: ../agent#keepalive-monitoring
[27]: ../sensu-query-expressions/
[28]: ../events#event-format
[29]: ../events#occurrences-and-occurrences-watermark
[30]: ../../guides/reduce-alert-fatigue/
[31]: https://github.com/robertkrimen/otto
[32]: https://github.com/robertkrimen/otto/blob/master/README.markdown
[33]: ../../sensuctl/reference#create-resources
[34]: #spec-attributes
[35]: https://regex101.com/r/zo9mQU/2
[36]: ../../api/overview#response-filtering
[37]: ../../sensuctl/reference#response-filtering
[38]: https://en.wikipedia.org/wiki/Modulo_operation
[39]: ../assets/
[40]: ../filters/
[41]: ../../web-ui/filter#filter-with-label-selectors
[42]: ../../web-ui/filter/
