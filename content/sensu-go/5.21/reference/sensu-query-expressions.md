---
title: "Sensu query expressions"
linkTitle: "Sensu Query Expressions"
reference_title: "Sensu query expressions"
type: "reference"
description: "Based on JavaScript expressions, Sensu query expressions (or SQEs) provide additional functionality for Sensu usage, like nested parameters and custom functions, so Sensu resources can be evaluated directly. Read the reference doc to learn about SQEs."
weight: 150
version: "5.21"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.21:
    parent: reference
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

### Custom functions

#### hour

The custom function `hour` returns the hour of a UNIX epoch time (in UTC and 24-hour time notation).

For example, if an `event.timestamp` equals 1520275913, which is Monday, March 5, 2018 6:51:53 PM UTC, the following SQE returns `true`:

{{< code go >}}
hour(event.timestamp) >= 17
{{< /code >}}

#### weekday

The custom function `weekday` returns a number that represents the day of the week of a UNIX epoch time.
Sunday is `0`.

For example, if an `event.timestamp` equals 1520275913, which is Monday, March 5, 2018 6:51:53 PM UTC, the following SQE returns `false`:

{{< code go >}}
weekday(event.timestamp) == 0
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
[2]: ../backend/#event-logging
[3]: ../filters/#build-event-filter-expressions
