---
title: "Filters"
description: "Filters help you reduce alert fatigue by controlling which events acted on by Sensu handlers. Read the reference doc to learn about filters, use Sensu's built-in filters, and create your own filters."
weight: 10
version: "5.5"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.5:
    parent: reference
---

- [Built-in filters](#built-in-filters)
- [Specification](#filter-specification)
- [Examples](#filter-examples)
	- [Handling production events](#handling-production-events)
	- [Handling non-production events](#handling-non-production-events)
	- [Handling state change only](#handling-state-change-only)
	- [Handling repeated events](#handling-repeated-events)
	- [Handling events during “office hours” only](#handling-events-during-office-hours-only)

## How do Sensu filters work?

Sensu filters are applied when **event handlers** are configured to use one or
more filters. Prior to executing a handler, the Sensu server will apply any
filters configured for the handler to the **event** data. If the event is not
removed by the filter(s), the handler will be executed. The
filter analysis flow performs these steps:

* When the Sensu server is processing an event, it will check for the definition
of a `handler` (or `handlers`). Prior to executing each handler, the Sensu
server will first apply any configured `filters` for the handler.
* If multiple `filters` are configured for a handler, they are executed
sequentially.
* Filter `expressions` are compared with event data.
* Filters can be inclusive (only matching events are handled) or exclusive
(matching events are not handled).
* As soon as a filter removes an event, no further
analysis is performed and the event handler will not be executed.

_NOTE: Filters specified in a **handler set** definition have no effect. Filters must
be specified in individual handler definitions._

### Inclusive and exclusive filtering

Filters can be _inclusive_ `"action": "allow"` (replaces `"negate": false` in
Sensu 1) or _exclusive_ `"action": "deny"` (replaces `"negate": true` in Sensu
1). Configuring a handler to use multiple _inclusive_ filters is the equivalent
of using an `AND` query operator (only handle events if they match
_inclusive_ filter `x AND y AND z`). Configuring a handler to use multiple
_exclusive_ filters is the equivalent of using an `OR` operator (only
handle events if they don’t match `x OR y OR z`).

* **Inclusive filtering**: by setting the filter definition attribute `"action":
"allow"`, only events that match the defined filter expressions are handled.
* **Exclusive filtering**: by setting the filter definition attribute `"action":
"deny"`, events are only handled if they do not match the defined filter 
expressions.

### Filter expression comparison

Filter expressions are compared directly with their event data counterparts. For
inclusive filter definitions (like `"action": "allow"`), matching expressions
will result in the filter returning a `true` value; for exclusive filter
definitions (like `"action": "deny"`), matching expressions will result in the
filter returning a `false` value, and the event will not pass through the
filter. Filters that return a true value will continue to be processed via
additional filters (if defined), mutators (if defined), and handlers.

### Filter expression evaluation

When more complex conditional logic is needed than direct filter expression
comparison, Sensu filters provide support for expression evaluation using
[Otto](https://github.com/robertkrimen/otto). Otto is an ECMAScript 5 (JavaScript) VM,
and evaluates javascript expressions that are provided in the filter.
There are some caveats to using Otto; most notably, the regular expressions
specified in ECMAScript 5 do not all work. See the Otto README for more details.

### Filter Assets

Sensu filters can have assets that are included in their execution context.
When valid assets are associated with a filter, Sensu evaluates any
files it finds that have a ".js" extension before executing a filter. The
result of evaluating the scripts is cached for a given asset set, for the
sake of performance.

## Built-in filters

Sensu includes built-in filters to help you customize event pipelines for metrics and alerts.
To start using built-in filters, see the guides to [sending Slack alerts][4] and [planning maintenances][5].

### Built-in filter: only incidents

The incidents filter is included in every installation of the [Sensu backend][8].
You can use the incidents filter to allow only high priority events through a Sensu pipeline.
For example, you can use the incidents filter to reduce noise when sending notifications to Slack.
When applied to a handler, the incidents filter allows only warning (`"status": 1`), critical (`"status": 2`), and resolution events to be processed.

To use the incidents filter, include the `is_incident` filter in the handler configuration `filters` array:

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

The `is_incident` filter applies the following filtering logic:

| status | allow | discard |     |     |     |     |
| ----- | ----- | ------- | --- | --- | --- | --- |
| 0     |   |❌| | | | |
| 1     |✅ |  | | | | |
| 2     |✅ |  | | | | |
| other |   |❌| | | | |
| 1 --> 0 or 2 --> 0<br>(resolution event)  |✅ |  | | | | |

### Built-in filter: allow silencing

[Sensu silencing][6] lets you suppress execution of event handlers on an on-demand basis, giving you the ability to quiet incoming alerts and [plan maintenances][5].

To allow silencing for an event handler, add the `not_silenced` filter to the handler configuration `filters` array:

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

When applied to a handler configuration, the `not_silenced` filter silences events that include the `"silenced": true` attribute. The handler in the example above uses both the silencing and [incidents][7] filters, preventing low priority and silenced events from being sent to Slack.

### Built-in filter: has metrics

The metrics filter is included in every installation of the [Sensu backend][8].
When applied to a handler, the metrics filter allows only events containing [Sensu metrics][9] to be processed.
You can use the metrics filter to prevent handlers that require metrics from failing in case of an error in metric collection.

To use the metrics filter, include the `has_metrics` filter in the handler configuration `filters` array:

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

When applied to a handler configuration, the `has_metrics` filter allows only events that include a [`metrics` scope][9].

## Filter specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute specifying the [`sensuctl create`][sc] resource type. Filters should always be of type `EventFilter`.
required     | Required for filter definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"type": "EventFilter"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute specifying the Sensu API group and version. For filters in Sensu backend version 5.5, this attribute should always be `core/v2`.
required     | Required for filter definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"api_version": "core/v2"{{< /highlight >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the filter, including the `name` and `namespace` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the filter definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope.  See the [metadata attributes reference][11] for details.
required     | Required for filter definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
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
description  | Top-level map that includes the filter [spec attributes][sp].
required     | Required for filter definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
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

### Spec attributes

action       | 
-------------|------
description  | Action to take with the event if the filter expressions match. _NOTE: see [Inclusive and exclusive filtering][1] for more information._
required     | true
type         | String
allowed values | `allow`, `deny`
example      | {{< highlight shell >}}"action": "allow"{{< /highlight >}}

expressions   | 
-------------|------
description  | Filter expressions to be compared with event data. Note that event metadata can be referenced without including the `metadata` scope, for example: `event.entity.namespace`.
required     | true
type         | Array
example      | {{< highlight shell >}}"expressions": [
  "event.check.team == 'ops'"
]
{{< /highlight >}}

runtime_assets |      |
---------------|------
description    | Assets to be applied to the filter's execution context. JavaScript files in the lib directory of the asset will be evaluated.
required       | false
type           | Array of String
default        | []
example        | {{< highlight shell >}}"runtime_assets": ["underscore"]{{< /highlight >}}

### Metadata attributes

| name       |      |
-------------|------
description  | A unique string used to identify the filter. Filter names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2)). Each filter must have a unique name within its namespace.
required     | true
type         | String
example      | {{< highlight shell >}}"name": "filter-weekdays-only"{{< /highlight >}}

| namespace  |      |
-------------|------
description  | The Sensu [RBAC namespace][10] that this filter belongs to.
required     | false
type         | String
default      | `default`
example      | {{< highlight shell >}}"namespace": "production"{{< /highlight >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with event data, which can be queried like regular attributes.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores, but must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}}"labels": {
  "environment": "development",
  "region": "us-west-2"
}{{< /highlight >}}

| annotations |     |
-------------|------
description  | Arbitrary, non-identifying metadata to include with event data. In contrast to labels, annotations are _not_ used internally by Sensu and cannot be used to identify filters. You can use annotations to add data that helps people or external tools interacting with Sensu.
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}} "annotations": {
  "managed-by": "ops",
  "slack-channel": "#monitoring",
  "playbook": "www.example.url"
}{{< /highlight >}}

### Event attributes

_Note: Event attributes are only available to filters and are not available for use with handlers or mutators_

| has_check       |      |
-------------|------
description  | Determines if an event has check data.
required     | false
type         | String
example      | {{< highlight shell >}}"has_check": e.HasCheck(){{< /highlight >}}

| has_metrics       |      |
-------------|------
description  | Determines if an event has metric data.
required     | false
type         | String
example      | {{< highlight shell >}}"has_metric": e.HasMetrics(){{< /highlight >}}

| is_incident       |      |
-------------|------
description  | Determines if an event indicates an incident.
required     | false
type         | String
example      | {{< highlight shell >}}"has_check": e.IsIncident(){{< /highlight >}}


| is_silenced       |      |
-------------|------
description  | Determines if an event has any silenced entries.
required     | false
type         | String
example      | {{< highlight shell >}}"is_silenced": e.IsSilenced(){{< /highlight >}}


| is_resolution       |      |
-------------|------
description  | Determines if an event has just transitioned from a non-zero status.
required     | false
type         | String
example      | {{< highlight shell >}}"is_resolution": e.IsResolution(){{< /highlight >}}

## Filter Examples

### Minimum required filter attributes

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

### Handling production events

The following example filter definition, entitled `production_filter`, will
match event data with a custom entity definition attribute `"namespace":
"production"`.

{{< highlight json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "production_filter",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "spec": {
    "action": "allow",
    "expressions": [
      "event.entity.namespace == 'production'"
    ],
    "runtime_assets": []
  }
}
{{< /highlight >}}

### Handling non-production events

The following example filter definition, entitled `development_filter`, will
discard event data with a custom entity definition attribute `"namespace":
"production"`.

Note that `action` is `deny`, making this an exclusive filter; if evaluation
returns false, the event will be handled.
{{< highlight json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "development_filter",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "spec": {
    "action": "deny",
    "expressions": [
      "event.entity.metadata.namespace == 'production'"
    ],
    "runtime_assets": []
  }
}
{{< /highlight >}}

### Handling state change only

Some teams migrating to Sensu have asked about reproducing the behavior of their
old monitoring system which alerts only on state change. This
`state_change_only` inclusive filter provides such.

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

### Handling repeated events

The following example filter definition, entitled `filter_interval_60_hourly`,
will match event data with a check `interval` of `60` seconds, and an
`occurrences` value of `1` (the first occurrence) -OR- any `occurrences`
value that is evenly divisible by 60 via a [modulo
operator](https://en.wikipedia.org/wiki/Modulo_operation) calculation
(calculating the remainder after dividing `occurrences` by 60).

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

The next example will apply the same logic as the previous example, but for
checks with a 30 second `interval`.

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

### Handling events during “office hours” only

This filter evaluates the event timestamp to determine if the event occurred
between 9 AM and 5 PM UTC on a weekday. Remember that `action` is equal to
`allow`, so this is an inclusive filter. If evaluation returns false, the event
will not be handled.

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

### Using JavaScript libraries with Sensu filters

You can include JavaScript libraries in their filter execution context with
assets. For instance, assuming you've packaged underscore.js into a Sensu
asset, you could then use functions from the underscore library for filter
expressions.

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

[1]: #inclusive-and-exclusive-filtering
[2]: #when-attributes
[3]: ../../reference/sensuctl/#time-windows
[4]: ../../guides/send-slack-alerts
[5]: ../../guides/plan-maintenance/
[6]: ../silencing
[7]: #built-in-filter-only-incidents
[8]: ../backend
[9]: ../events
[10]: ../rbac#namespaces
[11]: #metadata-attributes
[sc]: ../../sensuctl/reference#creating-resources
[sp]: #spec-attributes
