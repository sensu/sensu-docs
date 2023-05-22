---
title: "Sensu query expressions reference"
linkTitle: "Sensu Query Expressions Reference"
reference_title: "Sensu query expressions"
type: "reference"
description: "Use JavaScript-based Sensu query expressions to provide additional event filter functionality so you can directly evaluate Sensu resources."
weight: 40
version: "6.10"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-6.10:
    parent: observe-filter
---

Sensu query expressions (SQEs) are JavaScript-based expressions that provide additional functionality for using Sensu, like nested parameters and custom functions.

SQEs are defined in [event filters][3], so they act in the context of determining whether a given event should be passed to the handler.
SQEs always receive a single event and some information about that event, like `event.timestamp` or `event.check.interval`.

SQEs always return either `true` or `false`.
They are evaluated by the [Otto JavaScript VM][1] as JavaScript programs.

## Syntax quick reference

<table>
<thead>
<tr>
<th>operator</th>
<th>description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>===</code></td>
<td>Identity</td>
</tr>
<tr>
<td><code>!==</code></td>
<td>Nonidentity</td>
</tr>
<tr>
<td><code>==</code></td>
<td>Equality</td>
</tr>
<tr>
<td><code>!=</code></td>
<td>Inequality</td>
</tr>
<tr>
<td><code>&&</code></td>
<td>Logical AND</td>
</tr>
<tr>
<td><code>||</code></td>
<td>Logical OR</td>
</tr>
<tr>
<td><code><</code></td>
<td>Less than</td>
</tr>
<tr>
<td><code>></code></td>
<td>Greater than</td>
</tr>
<tr>
<td><code><=</code></td>
<td>Less than or equal to</td>
</tr>
<tr>
<td><code>>=</code></td>
<td>Greater than or equal to</td>
</tr>
</tbody>
</table>

## Specification

SQEs are valid ECMAScript 5 (JavaScript) expressions that return either `true` or `false`.
Other values are not allowed.
If an SQE returns a value besides `true` or `false`, an error is recorded in the [Sensu backend log][2] and the filter evaluates to `false`.

## Custom functions for weekday, hour, minute, and second

Together, the `weekday`, `hour`, `minute`, and `second` custom functions provide granular control of time-based filter expressions, comparable to cron scheduling.

### weekday

The custom function `weekday` returns a number that represents the day of the week of a UNIX epoch time.
Sunday is `0`.

For example, if an `event.timestamp` equals 1520275913, which is Monday, March 5, 2018 6:51:53 PM UTC, the following SQE returns `false`:

{{< code go >}}
weekday(event.timestamp) == 0
{{< /code >}}

### hour

The custom function `hour` returns the hour of a UNIX epoch time (in UTC and 24-hour time notation).

For example, if an `event.timestamp` equals 1520275913, which is Monday, March 5, 2018 6:51:53 PM UTC, the following SQE returns `true`:

{{< code go >}}
hour(event.timestamp) >= 17
{{< /code >}}

### minute

The custom function `minute` returns the minute of the hour (0 through 59) of a UNIX epoch time in UTC and 24-hour time notation.

For example, if an `event.timestamp` equals 1520275913, which is Monday, March 5, 2018 6:51:53 PM UTC, the following SQE returns `false`:

{{< code go >}}
minute(event.timestamp) <= 30
{{< /code >}}

### second

The custom function `second` returns the second of the minute (0 through 59) of a UNIX epoch time in UTC and 24-hour time notation.

For example, if an `event.timestamp` equals 1520275913, which is Monday, March 5, 2018 6:51:53 PM UTC, the following SQE returns `true`:

{{< code go >}}
second(event.timestamp) >= 30
{{< /code >}}

## seconds_since custom function

The custom function `seconds_since` returns the number of seconds (using float64) between the current time and an event's timestamp.

For systems with event processing pressure, you can use `seconds_since` to create alerts for events that are not handled within a certain period.
For example, the following SQE represents a 30-second time budget for event processing:

{{< code go >}}
seconds_since(event.timestamp) > 30
{{< /code >}}

## sensu.CheckDependencies custom function

Use the `sensu.CheckDependencies` SQE to filter events based on the results of a different check.

The `sensu.CheckDependencies` SQE takes zero or more checks as arguments against the event being filtered.
It returns `true` if all the specified checks are passing or `false` if any of the specified checks are failing.

If you do not specify any checks, the `sensu.CheckDependencies` SQE always returns `true`.
If no event matches the specified checks, Sensu will raise an error.

You can refer to checks as strings, objects, arrays of strings, and arrays of objects in the `sensu.CheckDependencies` SQE.
If you pass the check names as strings, Sensu assumes that the entities are the same as those in the events being filtered.
You can also pass entity names and check names in objects to reference checks on specific entities.

### String example

In this example, if all checks named `database` or `disk` are passing, the SQE returns `true`:

{{< code javascript >}}
sensu.CheckDependencies("database", "disk")
{{< /code >}}

### Object example

You can refer to the checks in objects that include both the entity and check name.
For example:

{{< code javascript >}}
sensu.CheckDependencies({entity: "server01", check: "disk"}, {entity: "server01", check: "database"})
{{< /code >}}

### String and object example

This example mixes string and object references in the same expression.
It passes a check name (`disk`) as well as an object that includes entity and check names:

{{< code javascript >}}
sensu.CheckDependencies("disk", {entity: "server01", check: "database"})
{{< /code >}}

### Array examples

You can use `sensu.CheckDependencies` to evaluate a check that contains an array of elements, which is useful for evaluating arrays parsed from event annotations.

This example references an array of three check names:

{{< code javascript >}}
sensu.CheckDependencies(["port1", "port2", "port3"])
{{< /code >}}

This example references an array of objects that each include both an entity and a check name:

{{< code javascript >}}
sensu.CheckDependencies([{entity: "router", check: "port1"}, {entity: "router", check: "port2"}])
{{< /code >}}

## Examples

### Evaluate an event attribute

This SQE returns `true` if the event's entity contains a custom attribute named `namespace` that is equal to `production`:

{{< code go >}}
event.entity.namespace == 'production'
{{< /code >}}

### Evaluate an array

To evaluate an attribute that contains an array of elements, use the `.indexOf` method.
For example, this expression returns `true` if an entity includes the subscription `system`:

{{< code go >}}
entity.subscriptions.indexOf('system') >= 0
{{< /code >}}

### Evaluate the day of the week

This expression returns `true` if the event occurred on a weekday:

{{< code go >}}
weekday(event.timestamp) >= 1 && weekday(event.timestamp) <= 5
{{< /code >}}

### Evaluate office hours

This expression returns `true` if the event occurred between 9 AM and 5 PM UTC:

{{< code go >}}
hour(event.timestamp) >= 9 && hour(event.timestamp) <= 17
{{< /code >}}

### Evaluate labels and annotations

Although you can use annotations to create SQEs, we recommend using labels because labels provide identifying information.

This expression returns `true` if the event's entity includes the label `webserver`:

{{< code go >}}
!!event.entity.labels.webserver
{{< /code >}}

Likewise, this expression returns `true` if the event's entity includes the annotation `www.company.com`:

{{< code go >}}
!!event.entity.annotations['www.company.com']
{{< /code >}}


[1]: https://github.com/robertkrimen/otto
[2]: ../../observe-schedule/backend/#event-logging
[3]: ../filters/#build-event-filter-expressions-with-sensu-query-expressions
