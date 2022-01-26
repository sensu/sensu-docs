---
title: "Event filter reference"
linkTitle: "Event Filter Reference"
reference_title: "Event filters"
type: "reference"
description: "Event filters help you reduce alert fatigue by controlling which events are acted on by Sensu handlers. Read the reference doc to learn about event filters, use Sensu's built-in event filters, and create your own event filters."
weight: 10
version: "6.3"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.3:
    parent: observe-filter
---

Sensu executes event filters during the **[filter][39]** stage of the [observability pipeline][44].

Sensu event filters are applied when you configure event handlers to use one or more filters.
Before executing a handler, the Sensu backend will apply any event filters configured for the handler to the observation data in events.
If the filters do not remove the event, the handler will be executed.

The filter analysis performs these steps:

* When the Sensu backend is processing an event, it checks for the definition of a `handler` (or `handlers`).
Before executing each handler, the Sensu server first applies any configured `filters` for the handler.
* If multiple `filters` are configured for a handler, they are executed sequentially.
* Filter `expressions` are compared with event data.

Event filters can be inclusive (only matching events are handled) or exclusive (matching events are not handled).

As soon as a filter removes an event, no further analysis is performed and the event handler will not be executed.

{{% notice note %}}
**NOTE**: Filters specified in a **handler set** definition have no effect.
Filters must be specified in individual handler definitions.
{{% /notice %}}

## Event filter example (minimum required attributes)

This example shows the minimum required attributes for an event filter resource:

{{< language-toggle >}}

{{< code yml >}}
---
type: EventFilter
api_version: core/v2
metadata:
  name: filter_minimum
spec:
  action: allow
  expressions:
  - event.check.occurrences == 1
{{< /code >}}

{{< code json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "filter_minimum"
  },
  "spec": {
    "action": "allow",
    "expressions": [
      "event.check.occurrences == 1"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

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
There are some caveats to using Otto: not all of the regular expressions (regex) specified in ECMAScript 5 will work.
Review the [Otto README][32] for more details.

Use [Go regex syntax][3] to create event filter expressions that combine any available [event][46], [check][47], or [entity][48] attributes with `match(<regex>)`.

For example, this event filter allows handling for events whose `event.check.name` ends with `metrics`:

{{< language-toggle >}}

{{< code yml >}}
---
type: EventFilter
api_version: core/v2
metadata:
  name: metrics-checks-only
spec:
  action: allow
  expressions:
  - event.check.name.match(/metrics$/)
{{< /code >}}

{{< code json >}}
{
   "type": "EventFilter",
   "api_version": "core/v2",
   "metadata": {
      "name": "metrics-checks-only"
   },
   "spec": {
      "action": "allow",
      "expressions": [
         "event.check.name.match(/metrics$/)"
      ]
   }
}
{{< /code >}}

{{< /language-toggle >}}

Here's another example that uses regex matching for event entity labels.
This event filter allows handling for events created by entities with the `region` label `us-west-1`, `us-west-2`, or `us-west-3`:

{{< language-toggle >}}

{{< code yml >}}
---
type: EventFilter
api_version: core/v2
metadata:
  name: us-west-events
spec:
  action: allow
  expressions:
  - event.entity.labels.region.match(/us-west-\b[1-3]\b/)
{{< /code >}}

{{< code json >}}
{
   "type": "EventFilter",
   "api_version": "core/v2",
   "metadata": {
      "name": "us-west-events"
   },
   "spec": {
      "action": "allow",
      "expressions": [
         "event.entity.labels.region.match(/us-west-\b[1-3]\b/)"
      ]
   }
}
{{< /code >}}

{{< /language-toggle >}}

### Filter dynamic runtime assets

Sensu event filters can have dynamic runtime assets that are included in their execution context.
When valid dynamic runtime assets are associated with an event filter, Sensu evaluates any files it finds that have a `.js` extension before executing the filter.
The result of evaluating the scripts is cached for a given asset set for the sake of performance.
For an example of how to implement an event filter as an asset, read [Reduce alert fatigue][30].

## Built-in event filters

Sensu includes built-in event filters to help you customize event pipelines for metrics and alerts.
To start using built-in event filters, read [Send Slack alerts][4] and [Plan maintenance][5].

{{% notice note %}}
**NOTE**: Sensu Go does not include the built-in occurrence-based event filter in Sensu Core 1.x, but you can replicate its functionality with [the repeated events filter definition](#filter-for-repeated-events).
{{% /notice %}}

### Built-in filter: is_incident

The is_incident event filter is included in every installation of the [Sensu backend][8].
You can use the is_incident filter to allow only high-priority events through a Sensu pipeline.
For example, you can use the is_incident filter to reduce noise when sending notifications to Slack.
When applied to a handler, the is_incident filter allows warning (`"status": 1`), critical (`"status": 2`), other (unknown or custom status), and resolution events to be processed.

To use the is_incident event filter, include `is_incident` in the handler configuration `filters` array:

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
  - SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
  filters:
  - is_incident
  handlers: []
  runtime_assets: []
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
{{< /code >}}

{{< /language-toggle >}}

The is_incident event filter applies the following filtering logic:

| status | allow | discard |     |     |     |     |
| ----- | ----- | ------- | --- | --- | --- | --- |
| 0     | | {{< cross >}} | | | | |
| 1     | {{< check >}} | | | | | |
| 2     | {{< check >}} | | | | | |
| other (unknown or custom status) | {{< check >}} | | | | | |
| resolution event<br>such as 1 --> 0<br>or 3 --> 0 | {{< check >}} | | | | | |

### Built-in filter: not_silenced

[Sensu silencing][6] lets you suppress execution of event handlers on an on-demand basis so you can quiet incoming alerts and [plan maintenance][5].

To allow silencing for an event handler, add `not_silenced` to the handler configuration `filters` array:

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
  - SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
  filters:
  - is_incident
  - not_silenced
  handlers: []
  runtime_assets: []
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
{{< /code >}}

{{< /language-toggle >}}

When applied to a handler configuration, the not_silenced event filter silences events that include the `silenced` attribute.
The handler in the example above uses both the not_silenced and [is_incident][7] event filters, preventing low-priority and silenced events from being sent to Slack.

### Built-in filter: has_metrics

The has_metrics event filter is included in every installation of the [Sensu backend][8].
When applied to a handler, the has_metrics filter allows only events that contain [Sensu metrics][9] to be processed.
You can use the has_metrics filter to prevent handlers that require metrics from failing in case of an error in metric collection.

To use the has_metrics event filter, include `has_metrics` in the handler configuration `filters` array:

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  name: influx-db
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
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "influx-db"
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
{{< /code >}}

{{< /language-toggle >}}

When applied to a handler configuration, the has_metrics event filter allows only events that include a [`metrics` scope][9].

## Build event filter expressions with Sensu query expressions

You can write custom event filter expressions as [Sensu query expressions][27] using the event data attributes described in this section.
For more information about event attributes, read the [event reference][28].

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
`event.check.output_metric_format`   | string  | The [metric format][13] generated by the check command: `nagios_perfdata`, `graphite_plaintext`, `influxdb_line`, `opentsdb_line`, or `prometheus_text`
`event.check.output_metric_handlers` | array   | Sensu metric [handlers][22] assigned to the check
`event.check.proxy_entity_name`      | string  | The entity name, used to create a [proxy entity][14] for an external resource
`event.check.proxy_requests`         | map     | [Proxy request][15] configuration
`event.check.publish`                | Boolean | Whether the check is scheduled automatically
`event.check.round_robin`            | Boolean | Whether the check is configured to be executed in a [round-robin style][16]
`event.check.runtime_assets`         | array   | Sensu [dynamic runtime assets][17] used by the check
`event.check.state`                  | string  | The state of the check: `passing` (status `0`), `failing` (status other than `0`), or `flapping`
`event.check.status`                 | integer | Exit status code produced by the check: `0` (OK), `1` (warning), `2` (critical), or other status (unknown or custom status)
`event.check.stdin`                  | Boolean | Whether the Sensu agent writes JSON-serialized entity and check data to the command process’ STDIN
`event.check.subscriptions`          | array   | Subscriptions that the check belongs to
`event.check.timeout`                | integer | The check execution duration timeout in seconds
`event.check.total_state_change`     | integer | The total state change percentage for the check’s history
`event.check.ttl`                    | integer | The time-to-live (TTL) until the event is considered stale, in seconds
`event.metrics.handlers`             | array   | Sensu metric [handlers][22] assigned to the check
`event.metrics.points`               | array   | [Metrics data points][23] including a name, timestamp, value, and tags

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

## Build event filter expressions with JavaScript execution functions

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access built-in JavaScript event filter execution functions in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial).
{{% /notice %}}

In addition to [Sensu query expressions][27], Sensu includes several built-in JavaScript functions for event filter execution:

- `sensu.FetchEvent`
- `sensu.CheckStatus`
- `sensu.ListEvents`

Use these functions to query your event stores for other events in the same namespace.

For example, to handle only events for the `server01` entity *and* the `disk` check, use the `sensu.FetchEvent` function in your event filter expressions:

{{< code javascript >}}
"expressions": [
  '(function () { var diskEvent = sensu.FetchEvent("server01", "disk"); if (diskEvent == nil) { return false; } return diskEvent.check.status == 0; })()'
]
{{< /code >}}

### `sensu.EventStatus`

The `sensu.EventStatus` function takes zero or more checks as arguments.
It returns an array of status codes for the events associated with the specified checks.

If you do not specify any checks, the function always returns an empty array.

You can refer to the checks as strings:

{{< code javascript >}}
sensu.EventStatus("database", "disk")
{{< /code >}}

If you pass the check names as strings, Sensu assumes that the entities are the same as those in the events being filtered.

You can also refer to the checks in objects that include both the entity and check name.
For example:

{{< code javascript >}}
sensu.EventStatus({entity: "server01", check: "disk"}, {entity: "server01", check: "database"})
{{< /code >}}

In both cases, if no event matches the specified entities and checks, Sensu will raise an error.

### `sensu.FetchEvent`

The `sensu.FetchEvent` function loads the Sensu event that corresponds to the specified entity and check names.

The format is `sensu.FetchEvent(entity, check)`.
For example:

{{< code javascript >}}
sensu.FetchEvent("server01", "disk")
{{< /code >}}

You can only load events from the same namespace as the event being filtered.
The returned object uses the same format as responses for the [core/v2/events API]][43].

If an event does not exist for the specified entity and check names, Sensu will raise an error.

### `sensu.ListEvents`

The `sensu.ListEvents` function returns an array of all events in the same namespace as the event being filtered.

{{% notice note %}}
**NOTE**: If you have many events in the namespace, this function may require a substantial amount of time to return them.
{{% /notice %}}

For example:

{{< code javascript >}}
sensu.ListEvents()
{{< /code >}}

The events in the returned array use the same format as responses for the [core/v2/events API]][43].

## Event filter specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][33] resource type. Event filters should always be type `EventFilter`.
required     | Required for filter definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][33].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: EventFilter
{{< /code >}}
{{< code json >}}
{
  "type": "EventFilter"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For event filters in this version of Sensu, this attribute should always be `core/v2`.
required     | Required for filter definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][33].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: core/v2
{{< /code >}}
{{< code json >}}
{
  "api_version": "core/v2"
}
{{< /code >}}
{{< /language-toggle >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the event filter, including `name`, `namespace`, and `created_by` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the filter definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. Read [metadata attributes][11] for details.
required     | Required for filter definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][33].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: filter-weekdays-only
  namespace: default
  created_by: admin
  labels:
    region: us-west-1
  annotations:
    slack-channel: "#monitoring"
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "name": "filter-weekdays-only",
    "namespace": "default",
    "created_by": "admin",
    "labels": {
      "region": "us-west-1"
    },
    "annotations": {
      "slack-channel": "#monitoring"
    }
  }
}
{{< /code >}}
{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes the event filter [spec attributes][34].
required     | Required for filter definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][33].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  action: allow
  expressions:
  - event.entity.namespace == 'production'
  runtime_assets: []
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "action": "allow",
    "expressions": [
      "event.entity.namespace == 'production'"
    ],
    "runtime_assets": []
  }
}
{{< /code >}}
{{< /language-toggle >}}

### Metadata attributes

| name       |      |
-------------|------
description  | Unique string used to identify the event filter. Filter names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][35]). Each filter must have a unique name within its namespace.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: filter-weekdays-only
{{< /code >}}
{{< code json >}}
{
  "name": "filter-weekdays-only"
}
{{< /code >}}
{{< /language-toggle >}}

| namespace  |      |
-------------|------
description  | Sensu [RBAC namespace][10] that the event filter belongs to.
required     | false
type         | String
default      | `default`
example      | {{< language-toggle >}}
{{< code yml >}}
namespace: production
{{< /code >}}
{{< code json >}}
{
  "namespace": "production"
}
{{< /code >}}
{{< /language-toggle >}}

| created_by |      |
-------------|------
description  | Username of the Sensu user who created the filter or last updated the filter. Sensu automatically populates the `created_by` field when the filter is created or updated.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
created_by: admin
{{< /code >}}
{{< code json >}}
{
  "created_by": "admin"
}
{{< /code >}}
{{< /language-toggle >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with event data that you can use for response and web UI view filtering.<br><br>If you include labels in your event data, you can filter [API responses][36], [sensuctl responses][37], and [web UI views][41] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
labels:
  environment: development
  region: us-west-2
{{< /code >}}
{{< code json >}}
{
  "labels": {
    "environment": "development",
    "region": "us-west-2"
  }
}
{{< /code >}}
{{< /language-toggle >}}

| annotations | |
-------------|------
description  | Non-identifying metadata to include with event data that you can access with event filters. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][36], [sensuctl response filtering][37], or [web UI views][42].
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
annotations:
  managed-by: ops
  playbook: www.example.url
{{< /code >}}
{{< code json >}}
{
  "annotations": {
    "managed-by": "ops",
    "playbook": "www.example.url"
  }
}
{{< /code >}}
{{< /language-toggle >}}

### Spec attributes

action       | 
-------------|------
description  | Action to take with the event if the event filter expressions match. Read [Inclusive and exclusive event filters][1] for more information.
required     | true
type         | String
allowed values | `allow`, `deny`
example      | {{< language-toggle >}}
{{< code yml >}}
action: allow
{{< /code >}}
{{< code json >}}
{
  "action": "allow"
}
{{< /code >}}
{{< /language-toggle >}}

expressions   | 
-------------|------
description  | Event filter expressions to be compared with event data. You can reference event metadata without including the `metadata` scope (for example, `event.entity.namespace`).
required     | true
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
expressions:
- event.check.team == 'ops'
{{< /code >}}
{{< code json >}}
{
  "expressions": [
    "event.check.team == 'ops'"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

runtime_assets |      |
---------------|------
description    | Dynamic runtime assets to apply to the event filter's execution context. JavaScript files in the lib directory of the dynamic runtime asset will be evaluated.
required       | false
type           | Array of string
default        | []
example        | {{< language-toggle >}}
{{< code yml >}}
runtime_assets:
- underscore
{{< /code >}}
{{< code json >}}
{
  "runtime_assets": [
    "underscore"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

## Use JavaScript libraries with Sensu filters

You can include JavaScript libraries in their event filter execution context with [dynamic runtime assets][17].
For instance, if you package underscore.js into a Sensu asset, you can use functions from the underscore library for filter expressions:

{{< language-toggle >}}

{{< code yml >}}
---
type: EventFilter
api_version: core/v2
metadata:
  name: deny_if_failure_in_history
spec:
  action: deny
  expressions:
  - _.reduce(event.check.history, function(memo, h) { return (memo || h.status !=
    0); })
  runtime_assets:
  - underscore
{{< /code >}}

{{< code json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "deny_if_failure_in_history"
  },
  "spec": {
    "action": "deny",
    "expressions": [
      "_.reduce(event.check.history, function(memo, h) { return (memo || h.status != 0); })"
    ],
    "runtime_assets": ["underscore"]
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Filter for production events

The following event filter allows handling for only events with a custom entity label `"environment": "production"`:

{{< language-toggle >}}

{{< code yml >}}
---
type: EventFilter
api_version: core/v2
metadata:
  name: production_filter
spec:
  action: allow
  expressions:
  - event.entity.labels['environment'] == 'production'
{{< /code >}}

{{< code json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "production_filter"
  },
  "spec": {
    "action": "allow",
    "expressions": [
      "event.entity.labels['environment'] == 'production'"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Filter for non-production events

The following event filter discards events with a custom entity label `"environment": "production"`, allowing handling only for events without an `environment` label or events with `environment` set to something other than `production`.

{{% notice note %}}
**NOTE**: `action` is `deny`, so this is an exclusive event filter.
If evaluation returns false, the event is handled.
{{% /notice %}}

{{< language-toggle >}}

{{< code yml >}}
---
type: EventFilter
api_version: core/v2
metadata:
  name: not_production
spec:
  action: deny
  expressions:
  - event.entity.labels['environment'] == 'production'
{{< /code >}}

{{< code json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "not_production"
  },
  "spec": {
    "action": "deny",
    "expressions": [
      "event.entity.labels['environment'] == 'production'"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Filter for state change only

This example demonstrates how to use the `state_change_only` inclusive event filter to reproduce the behavior of a monitoring system that alerts only on state change:

{{< language-toggle >}}

{{< code yml >}}
---
type: EventFilter
api_version: core/v2
metadata:
  name: state_change_only
spec:
  action: allow
  expressions:
  - event.check.occurrences == 1
  runtime_assets: []
{{< /code >}}

{{< code json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "state_change_only"
  },
  "spec": {
    "action": "allow",
    "expressions": [
      "event.check.occurrences == 1"
    ],
    "runtime_assets": []
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Filter for repeated events

In this example, the `filter_interval_60_hourly` event filter will match event data with a check `interval` of `60` seconds _AND_ an `occurrences` value of `1` (the first occurrence) _OR_ any `occurrences` value that is evenly divisible by 60 via a [modulo operator][38] calculation (calculating the remainder after dividing `occurrences` by 60):

{{< language-toggle >}}

{{< code yml >}}
---
type: EventFilter
api_version: core/v2
metadata:
  name: filter_interval_60_hourly
spec:
  action: allow
  expressions:
  - event.check.interval == 60
  - event.check.occurrences == 1 || event.check.occurrences % 60 == 0
  runtime_assets: []
{{< /code >}}

{{< code json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "filter_interval_60_hourly"
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
{{< /code >}}

{{< /language-toggle >}}

This example will apply the same logic as the previous example but for checks with a 30-second `interval`:

{{< language-toggle >}}

{{< code yml >}}
---
type: EventFilter
api_version: core/v2
metadata:
  name: filter_interval_30_hourly
spec:
  action: allow
  expressions:
  - event.check.interval == 30
  - event.check.occurrences == 1 || event.check.occurrences % 120 == 0
  runtime_assets: []
{{< /code >}}

{{< code json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "filter_interval_30_hourly"
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
{{< /code >}}

{{< /language-toggle >}}

## Filter to reduce alert fatigue for keepalive events

This example `keepalive_timeouts` event filter will match event data with an occurrences value of 1 OR any occurrences value that matches 15 minutes via a modulo operator calculation.
This limits keepalive timeout event alerts to the first occurrence and every 15 minutes thereafter.

This example uses conditional JavaScript logic to check for an entity-level annotation, `keepalive_alert_minutes`, and if it exists, parses the annotation value as an integer.
If the annotation does not exist, the event filter uses 15 minutes for the alert cadence. 

{{< language-toggle >}}

{{< code yml >}}
---
type: EventFilter
api_version: core/v2
metadata:
  name: keepalive_timeouts
spec:
  action: allow
  expressions:
   - is_incident
   - event.check.occurrences == 1 || event.check.occurrences % parseInt( 60 * ( 'keepalive_alert_minutes' in event.entity.annotations ? parseInt(event.entity.annotations.keepalive_alert_minutes): 15) / event.check.timeout ) == 0
  runtime_assets: []
{{< /code >}}

{{< code json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "keepalive_timeouts"
  },
  "spec": {
    "action": "allow",
    "expressions": [
      "is_incident",
      "event.check.occurrences == 1 || event.check.occurrences % parseInt( 60 * ( 'keepalive_alert_minutes' in event.entity.annotations ? parseInt(event.entity.annotations.keepalive_alert_minutes): 15) / event.check.timeout ) == 0"
    ],
    "runtime_assets": []
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Filter for events during office hours only

This event filter evaluates the event timestamp to determine if the event occurred between 9 AM and 5 PM UTC on a weekday.
Remember that `action` is equal to `allow`, so this is an inclusive event filter.
If evaluation returns false, the event will not be handled.

{{< language-toggle >}}

{{< code yml >}}
---
type: EventFilter
api_version: core/v2
metadata:
  name: nine_to_fiver
spec:
  action: allow
  expressions:
  - weekday(event.timestamp) >= 1 && weekday(event.timestamp) <= 5
  - hour(event.timestamp) >= 9 && hour(event.timestamp) <= 17
  runtime_assets: []
{{< /code >}}

{{< code json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "nine_to_fiver"
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
{{< /code >}}

{{< /language-toggle >}}

## Disable alerts without a silence

This filter allows you to disable alerts without creating silences.

Add the filter name to the `filters` array for any handler you want to control.
To disable alerts, change the filter's `action` attribute value from `allow` to `deny`.

{{< language-toggle >}}

{{< code yml >}}
---
type: EventFilter
api_version: core/v2
metadata:
  name: emergency_alert_control
spec:
  action: allow
  expressions:
  - event.has_check
{{< /code >}}

{{< code json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "emergency_alert_control"
  },
  "spec": {
    "action": "allow",
    "expressions": [
      "event.has_check"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}


[1]: #inclusive-and-exclusive-event-filters
[2]: #when-attributes
[3]: https://github.com/google/re2/wiki/Syntax
[4]: ../../observe-process/send-slack-alerts/
[5]: ../../observe-process/plan-maintenance/
[6]: ../../observe-process/silencing/
[7]: #built-in-filter-is_incident
[8]: ../../observe-schedule/backend/
[9]: ../../observe-events/events/
[10]: ../../../operations/control-access/namespaces/
[11]: #metadata-attributes
[12]: ../../observe-schedule/hooks/
[13]: ../../observe-schedule/collect-metrics-with-checks/
[14]: ../../observe-schedule/checks#use-a-proxy-check-to-monitor-a-proxy-entity
[15]: ../../observe-schedule/checks#use-a-proxy-check-to-monitor-multiple-proxy-entities
[16]: ../../observe-schedule/checks#round-robin-checks
[17]: ../../../plugins/assets/
[18]: ../../observe-entities/entities#system-attributes
[19]: ../../observe-schedule/checks/#metadata-attributes
[20]: ../../observe-events/events/#history-attributes
[21]: ../../observe-schedule/checks#check-scheduling
[22]: ../../observe-process/handlers/
[23]: ../../observe-events/events#metrics-attributes
[24]: ../../observe-entities/entities#metadata-attributes
[25]: ../../../operations/control-access/rbac/#default-roles-and-cluster-roles
[26]: ../../observe-schedule/agent#keepalive-monitoring
[27]: ../../observe-filter/sensu-query-expressions/
[28]: ../../observe-events/events#event-format
[29]: ../../observe-events/events#occurrences-and-occurrences-watermark
[30]: ../../observe-filter/reduce-alert-fatigue/
[31]: https://github.com/robertkrimen/otto
[32]: https://github.com/robertkrimen/otto/blob/master/README.markdown#regular-expression-incompatibility
[33]: ../../../sensuctl/create-manage-resources/#create-resources
[34]: #spec-attributes
[35]: https://regex101.com/r/zo9mQU/2
[36]: ../../../api/#response-filtering
[37]: ../../../sensuctl/filter-responses/
[38]: https://en.wikipedia.org/wiki/Modulo_operation
[39]: ../
[41]: ../../../web-ui/search#search-for-labels
[42]: ../../../web-ui/search/
[43]: ../../../api/core/events/
[44]: ../../../observability-pipeline/
[46]: #event-attributes-available-to-filters
[47]: #check-attributes-available-to-filters
[48]: #entity-attributes-available-to-filters
