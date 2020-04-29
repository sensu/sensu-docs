---
title: "Sensu query expressions"
linkTitle: "Sensu Query Expressions"
description: "Based on JavaScript expressions, Sensu query expressions (or SQEs) provide additional functionality for Sensu usage, like nested parameters and custom functions, so Sensu resources can be evaluated directly. Read the reference doc to learn about SQEs."
weight: 150
version: "5.16"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.16:
    parent: reference
---

- [Syntax quick reference](#syntax-quick-reference)
- [Specification](#specification)
  - [Custom functions](#custom-functions)
- [Examples](#examples)

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

{{< highlight go >}}
hour(event.timestamp) >= 17
{{< /highlight >}}

#### weekday

The custom function `weekday` returns a number that represents the day of the week of a UNIX epoch time.
Sunday is `0`.

For example, if an `event.timestamp` equals 1520275913, which is Monday, March 5, 2018 6:51:53 PM UTC, the following SQE returns `false`:

{{< highlight go >}}
weekday(event.timestamp) == 0
{{< /highlight >}}

## Examples

### Evaluate an event attribute

This SQE returns `true` if the event's entity contains a custom attribute named `namespace` that is equal to `production`:

{{< highlight go >}}
event.entity.namespace == 'production'
{{< /highlight >}}

### Evaluate an array

To evaluate an attribute that contains an array of elements, use the `.indexOf` method.
For example, this expression returns `true` if an entity includes the subscription `system`:

{{< highlight go >}}
entity.subscriptions.indexOf('system') >= 0
{{< /highlight >}}

### Evaluate the day of the week

This expression returns `true` if the event occurred on a weekday:

{{< highlight go >}}
weekday(event.timestamp) >= 1 && weekday(event.timestamp) <= 5
{{< /highlight >}}

### Evaluate office hours

This expression returns `true` if the event occurred between 9 AM and 5 PM UTC:

{{< highlight go >}}
hour(event.timestamp) >= 9 && hour(event.timestamp) <= 17
{{< /highlight >}}

### Evaluate labels and annotations

Although you can use annotations to create SQEs, we recommend using labels because labels provide identifying information.

This expression returns `true` if the event's entity includes the label `webserver`:

{{< highlight go >}}
event.entity.labels.indexOf('webserver') >= 0
{{< /highlight >}}

Likewise, this expression returns `true` if the event's entity includes the annotation `www.company.com`:

{{< highlight go >}}
event.entity.annotations.indexOf('www.company.com') >= 0
{{< /highlight >}}


[1]: https://github.com/robertkrimen/otto
[2]: ../backend/#event-logging
[3]: ../filters/#build-event-filter-expressions
