---
title: "Filters"
description: "The filters reference guide."
weight: 1
version: "2.0"
product: "Sensu Core"
platformContent: false
menu:
  sensu-core-2.0:
    parent: reference
---

## How do Sensu filters work?

Sensu filters are applied when **event handlers** are configured to use one or
more filters. Prior to executing a handler, the Sensu server will apply any
filters configured for the handler to the **event** data. If the event is not
removed by the filter(s) (i.e. filtered out), the handler will be executed. The
filter analysis flow performs these steps:

* When the Sensu server is processing an event, it will check for the definition
of a `handler` (or `handlers`). Prior to executing each handler, the Sensu
server will first apply any configured `filters` for the handler.
* If multiple `filters` are configured for a handler, they are executed
sequentially.
* Filter `statements` are compared with event data.
* Filters can be inclusive (only matching events are handled) or exclusive
(matching events are not handled).
* As soon as a filter removes an event (i.e. filters it out), no further
analysis is performed and the event handler will not be executed.

{{< note title="Note" >}}
Filters specified in a **handler set** definition have no effect. Filters must
be specified in individual handler definitions.
{{< /note >}}

### Inclusive and exclusive filtering

Filters can be _inclusive_ `"action": "allow"` (replaces `"negate": false` in
Sensu 1) or _exclusive_ `"action": "deny"` (replaces `"negate": true` in Sensu
1). Configuring a handler to use multiple _inclusive_ filters is the equivalent
of using an `AND` query operator (i.e. only handle events if they match
_inclusive_ filter `x AND y AND z`). Configuring a handler to use multiple
_exclusive_ filters is the equivalent of using an `OR` operator (i.e. only
handle events if they don’t match `x OR y OR z`).

* **Inclusive filtering**: by setting the filter definition attribute `"action":
"allow"`, only events that match the defined filter statements are handled.
* **Exclusive filtering**: by setting the filter definition attribute `"action":
"deny"`, events are only handled if they do not match the defined filter 
statements.

### Filter statement comparison

Filter statements are compared directly with their event data counterparts. For
inclusive filter definitions (i.e. `"action": "allow"`), matching statements
will result in the filter returning a `true` value; for exclusive filter
definitions (i.e. `"action": "deny"`), matching statements will result in the
filter returning a `false` value (i.e. the event does not pass through the
filter). Filters that return a true value will continue to be processed — via
additional filters (if defined), mutators (if defined), and handlers.

### Filter statement evaluation

When more complex conditional logic is needed than direct filter statement
comparison, Sensu filters provide support for statements evaluation using
[govaluate](https://github.com/Knetic/govaluate/blob/master/MANUAL.md)
expressions. If the evaluated expression returns true,
the statement is a match.

## Filter specification

### Filter naming

Each filter definition must have a unique name within its organization and
environment.

* A unique string used to name/identify the filter
* Cannot contain special characters or spaces
* Validated with Go regex [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2)

### Filter attributes

action       | 
-------------|------
description  | Action to take with the event if the filter statements match. _NOTE: see [Inclusive and exclusive filtering][1] for more information._
required     | true
type         | String
allowed values | `allow`, `deny`
example      | {{< highlight shell >}}"action": "allow"{{< /highlight >}}

statements   | 
-------------|------
description  | Filter statements to be compared with event data.
required     | true
type         | Array
example      | {{< highlight shell >}}"statements": [
  "event.Check.Team == 'ops'"
]
{{< /highlight >}}

when         | 
-------------|------
description  | The [when definition scope][2], used to determine when a filter is applied with time windows. See the [sensuctl documentation][3] for the supported time formats.
required     | false
type         | Hash
example      | {{< highlight shell >}}"when": {
  "days": {
    "all": [
      {
        "begin": "17:00 UTC",
        "end": "08:00 UTC"
      }
    ]
  }
}
{{< /highlight >}}

organization | 
-------------|------ 
description  | The Sensu RBAC organization that this filter belongs to.
required     | false 
type         | String
default      | current organization value configured for `sensuctl` (ie `default`) 
example      | {{< highlight shell >}}
  "organization": "default"
{{</ highlight >}}

environment  | 
-------------|------ 
description  | The Sensu RBAC environment that this filter belongs to.
required     | false 
type         | String 
default      | current environment value configured for `sensuctl` (ie `default`) 
example      | {{< highlight shell >}}
  "environment": "default"
{{</ highlight >}}

### `when` attributes

days         | 
-------------|------
description  | A hash of days of the week (i.e., `monday`) and/or `all`. Each day specified can define one or more time windows, in which the filter is applied. See the [sensuctl documentation][3] for the supported time formats.
required     | false (unless `when` is configured)
type         | Hash
example      | {{< highlight shell >}}"days": {
  "all": [
    {
      "begin": "17:00 UTC",
      "end": "08:00 UTC"
    }
  ],
  "friday": [
    {
      "begin": "12:00 UTC",
      "end": "17:00 UTC"
    }
  ]
}
{{< /highlight >}}

## Filter Examples

### Handling production events

The following example filter definition, entitled `production_filter`, will
match event data with a custom entity definition attribute `"environment":
"production"`.

{{< highlight json >}}
{
  "name": "production_filter",
  "action": "allow",
  "statements": [
    "event.Entity.Environment == 'production'"
  ]
}
{{< /highlight >}}

### Handling non-production events

The following example filter definition, entitled `development_filter`, will
discard event data with a custom entity definition attribute `"environment":
"production"`.

Note that `action` is `deny`, making this an exclusive filter; if evaluation
returns false, the event will be handled.
{{< highlight json >}}
{
  "name": "development_filter",
  "action": "deny",
  "statements": [
    "event.Entity.Environment == 'production'"
  ]
}
{{< /highlight >}}

### Handling state change only

Some teams migrating to Sensu have asked about reproducing the behavior of their
old monitoring system which alerts only on state change. This
`state_change_only` inclusive filter provides such.

{{< highlight json >}}
{
  "name": "state_change_only",
  "action": "allow",
  "statements": [
    "event.Check.Occurrences == 1"
  ]
}
{{< /highlight >}}

### Handling repeated events

The following example filter definition, entitled `filter_interval_60_hourly`,
will match event data with a check `interval` of `60` seconds, and an
`occurrences` value of `1` (i.e. the first occurrence) -OR- any `occurrences`
value that is evenly divisible by 60 (via a [modulo
operator](https://en.wikipedia.org/wiki/Modulo_operation) calculation; i.e.
calculating the remainder after dividing `occurrences` by 60).

{{< highlight json >}}
{
  "name": "filter_interval_60_hourly",
  "action": "allow",
  "statements": [
    "event.Check.Interval == 60",
    "event.Check.Occurrences == 1 || event.Check.Occurrences % 60 == 0"
  ]
}
{{< /highlight >}}

The next example will apply the same logic as the previous example, but for
checks with a 30 second `interval`.

{{< highlight json >}}
{
  "name": "filter_interval_30_hourly",
  "action": "allow",
  "statements": [
    "event.Check.Interval == 30",
    "event.Check.Occurrences == 1 || event.Check.Occurrences % 120 == 0"
  ]
}
{{< /highlight >}}

### Handling events during “office hours” only

This filter evaluates the event timestamp to determine if the event occurred
between 9 AM and 5 PM UTC on a weekday. Remember that `action` is equal to
`allow`, so this is an inclusive filter. If evaluation returns false, the event
will not be handled. The [`when` attribute][2] could also be used to achieve the
same result.

{{< highlight json >}}
{
  "name": "nine_to_fiver",
  "action": "allow",
  "statements": [
    "weekday(event.Timestamp) >= 1 && weekday(event.Timestamp) <= 5",
    "hour(event.Timestamp) >= 9 && hour(event.Timestamp) <= 17"
  ]
}
{{< /highlight >}}

{{< note title="Note" >}}
Sensu handles dates and times in UTC (Coordinated Universal Time), therefore
when comparing the weekday or the hour, you should provide values in UTC.
{{< /note >}}

[1]: #inclusive-and-exclusive-filtering
[2]: #when-attributes
[3]: ../../reference/sensuctl/#time-windows