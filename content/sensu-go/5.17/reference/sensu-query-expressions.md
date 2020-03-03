---
title: "Sensu query expressions"
linkTitle: "Sensu Query Expressions"
description: "Based on JavaScript expressions, Sensu query expressions provide additional functionality for Sensu usage, like nested parameters and custom functions, so Sensu resources can be evaluated directly. Read the reference doc to learn about Sensu query expressions."
weight: 150
version: "5.17"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.17:
    parent: reference
---

- [Syntax quick reference](#syntax-quick-reference)
- [Specification](#specification)
  - [Custom functions](#custom-functions)
- [Examples](#examples)

Sensu query expressions are JavaScript-based expressions that provide additional functionality for using Sensu, like nested parameters and custom functions.

Sensu query expressions always return either `true` or `false`.
They are powered by the [Otto JavaScript VM][1].

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

Sensu query expressions are valid ECMAScript 5 (JavaScript) expressions that return either `true` or `false`.
Other values are not allowed.
If a Sensu query expression returns a value besides `true` or `false`, an error is logged and the filter evaluates to `false`.

### Custom functions

#### hour

The custom function `hour` returns the hour of a UNIX epoch time (in UTC and 24-hour time notation).

For example, if an `event.timestamp` equals 1520275913, which is Monday, March 5, 2018 6:51:53 PM UTC, the following Sensu query expression returns `true`:

{{< highlight go >}}
hour(event.timestamp) >= 17
{{< /highlight >}}

#### weekday

The custom function `weekday` returns a number that represents the day of the week of a UNIX epoch time.
Sunday is `0`.

For example, if an `event.timestamp` equals 1520275913, which is Monday, March 5, 2018 6:51:53 PM UTC, the following Sensu query expression returns `false`:

{{< highlight go >}}
weekday(event.timestamp) == 0
{{< /highlight >}}

## Examples

### Evaluate an event attribute

This Sensu query expression returns `true` if the event's entity contains a custom attribute named `namespace` that is equal to `production`:

{{< highlight javascript >}}
event.entity.namespace == 'production'
{{< /highlight >}}

### Evaluate an array

To evaluate an attribute that contains an array of elements, use the `.indexOf` method.
For example, this expression returns `true` if an entity includes the subscription `system`:

{{< highlight text >}}
entity.subscriptions.indexOf('system') >= 0
{{< /highlight >}}

### Evaluate the day of the week

This expression returns `true` if the event occurred on a weekday:

{{< highlight javascript >}}
weekday(event.timestamp) >= 1 && weekday(event.timestamp) <= 5
{{< /highlight >}}

### Evaluate office hours

This expression returns `true` if the event occurred between 9 AM and 5 PM UTC:

{{< highlight javascript >}}
hour(event.timestamp) >= 9 && hour(event.timestamp) <= 17
{{< /highlight >}}

### Evaluate labels and annotations

Although you can use annotations to create Sensu query expressions, we recommend using labels because labels provide identifying information.

This expression returns `true` if the event's entity includes the label `webserver`:

{{< highlight javascript >}}
event.entity.labels.indexOf('webserver') >= 0
{{< /highlight >}}

Likewise, this expression returns `true` if the event's entity includes the annotation `www.company.com`:

{{< highlight javascript >}}
event.entity.annotations.indexOf('www.company.com') >= 0
{{< /highlight >}}


[1]: https://github.com/robertkrimen/otto
