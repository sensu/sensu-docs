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

## What are Sensu filters?

Sensu Filters (also called Event Filters) allow you to filter events destined
for one or more event Handlers. Sensu filters inspect event data and match its
keys/values with filter definition statements, to determine if the event should
be passed to an event handler. Filters are commonly used to filter recurring
events (i.e. to eliminate notification noise) and to filter events from systems
in pre-production environments.

### When to use a filter

Sensu Filters allow you to configure conditional logic to be applied during the
event processing flow. Compared to executing an event handler, evaluating event
filters is an inexpensive operation which can provide overall monitoring
performance gains by reducing the number of events that need to be handled.
Additionally, by using Sensu Filters, instead of building conditional logic into
custom Handlers, conditional logic can be applied to multiple Handlers, and
monitoring configuration stays DRY.

## How do Sensu filters work?

Sensu Filters are applied when Event Handlers are configured to use one or more
Filters. Prior to executing a Handler, the Sensu server will apply any Filters
configured for the Handler to the Event Data. If the Event is not removed by the
Filter(s) (i.e. filtered out), the Handler will be executed. The filter analysis
flow performs these steps:

* When the Sensu server is processing an Event, it will check for the definition
of a `handler` (or `handlers`). Prior to executing each Handler, the Sensu
server will first apply any configured `filter` (or `filters`) for the Handler
* If multiple `filters` are configured for a Handler, they are executed
sequentially
* Filter `statements` are compared with Event data
* Filters can be inclusive (only matching events are handled) or exclusive
(matching events are not handled)
* As soon as a Filter removes an Event (i.e. filters it out), no further
analysis is performed and the Event Handler will not be executed

{{< note title="Note" >}}
Filters specified in a **handler set** definition have no effect. Filters must
be specified in individual handler definitions.
{{< /note >}}

### Inclusive and Exclusive Filtering

Filters can be _inclusive_ `"action": "allow"` (replaces `"negate": false` in
Sensu 1) or _exclusive_ `"action": "deny"` (replaces `"negate": true` in Sensu
1). Configuring a handler to use multiple _inclusive_ filters is the equivalent
of using an `AND` query operator (i.e. only handle events if they match
_inclusive_ filters `x AND y AND z`). Configuring a handler to use multiple
_exclusive_ filters is the equivalent of using an `OR` operator (i.e. only
handle events if they don’t match `x OR y OR z`).

* **Inclusive filtering**: by setting the filter definition attribute `"action":
"allow"`, only events that match the defined filter statements are handled.
* **Exclusive filtering**: by setting the filter definition attribute `"action":
"deny"`, events are only handled if they do not match the defined filter 
statements.

{{< note title="Note" >}}
Unless otherwise configured in the filter definition, the default filtering
behavior is inclusive filtering (i.e. `"action": "allow"`).
{{< /note >}}

## Filter statement comparison

Filter statements are compared directly with their event data counterparts. For
inclusive filter definitions (i.e. `"action": "allow"`), matching statements
will result in the filter returning a `true` value; for exclusive filter
definitions (i.e. `"action": "deny"`), matching statements will result in the
filter returning a `false` value (i.e. the event does not pass through the
filter). Filters that return a true value will continue to be processed — via
additional filters (if defined), mutators (if defined), and handlers.

### Example: Handling production events

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

### Example: Handling non-production events

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

### Example: Handling state change only

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

## Filter statement evaluation

When more complex conditional logic is needed than direct filter statements
comparison, Sensu filters provide support for statements evaluation using
[govaluate](https://github.com/Knetic/govaluate/blob/master/MANUAL.md)
expressions. If the evaluated expression returns true,
the statement is a match.

### Example: Handling repeated events

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
    "event.Check.Interval == 60"
    "event.Check.Occurrences == 1 || event.Check.Occurrences % 60 == 0",
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
    "event.Check.Interval == 30"
    "event.Check.Occurrences == 1 || event.Check.Occurrences % 120 == 0",
  ]
}
{{< /highlight >}}

### Example: Handling events during “office hours” only

This filter evaluates the event timestamp to determine if the event occurred
between 9 AM and 5 PM UTC on a weekday. Remember that `action` equals to
`allow`, so this is an inclusive filter. If evaluation returns false, the event
will not be handled.

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

## Filter configuration

### Example filter definition

The following is an example Sensu filter definition, in JSON format. This is an
inclusive filter definition called `production`. The effect of this filter is
that only events with the custom entity attribute `"environment": "production"`
will be handled.

{{< highlight json >}}
{
  "name": "production",
  "action": "allow",
  "statements": [
    "event.Entity.Environment == 'production'"
  ]
}
{{< /highlight >}}

### Filter definition specification

#### Filter naming

Each filter definition must have a unique name within its organization and
environment.

* A unique string used to name/identify the filter
* Cannot contain special characters or spaces
* Validated with Go regex [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2)

#### Filter attributes

action       | 
-------------|------
description  | Action to take with the event if the filter statements match. _NOTE: see [Inclusive and exclusive filtering][1] for more information._
required     | true
type         | String
allowed values | `allow`, `deny`
example      | {{< highlight shell >}}"action": "allow"{{< /highlight >}}

statements   | 
-------------|------
description  | Filter statements to be compared with Event data.
required     | true
type         | Array
example      | {{< highlight shell >}}"statements": [
  "event.Check.Team == 'ops'"
]
{{< /highlight >}}
 
## sensuctl CLI

### Viewing

To view all the filters that are currently configured for the cluster, enter:

{{< highlight shell >}}
sensuctl filter list
{{< /highlight >}}

If you want more details on a filter, the `info` subcommand can help you out.

{{< highlight shell >}}
$ sensuctl filter info production_filter
=== production_filter
Name:         production_filter
Action:       allow
Statements:   event.Entity.Environment == 'production'
Organization: default
Environment:  default
{{< /highlight >}}

### Management

Hooks can be created both interactively or by using CLI flags.

{{< highlight shell >}}
# Interactively
sensuctl filter create --interactive

# With flags
sensuctl filter create production_filter --action allow --statements "event.Entity.Environment == 'production'"
{{< /highlight >}}

To update an existing filter, the `update` command can be used.

{{< highlight shell >}}
sensuctl filter update production_filter
{{< /highlight >}}

To delete an existing filter, simply pass the name of the filter to the `delete`
command.

{{< highlight shell >}}
sensuctl filter delete production_filter
{{< /highlight >}}

[1]:  #inclusive-and-exclusive-filtering