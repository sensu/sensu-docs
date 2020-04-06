---
title: "Sensu query expressions"
linkTitle: "Sensu Query Expressions"
description: "Based on JavaScript expressions, Sensu query expressions provide additional functionality for Sensu usage, like nested parameters and custom functions, so Sensu resources can be evaluated directly. Read the reference doc to learn about Sensu query expressions."
weight: 40
version: "5.19"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.19:
    parent: filters
---

- [Syntax quick reference](#syntax-quick-reference)
- [Sensu query expression specification](#sensu-query-expression-specification)
- [Sensu query expression examples](#sensu-query-expression-examples)

Sensu query expressions are based on [JavaScript][1] expressions.
They provide additional functionality for Sensu usage, like nested parameters and custom functions, so Sensu resources can be directly evaluated.
Sensu query expressions should always return `true` or `false`.

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
<td>Identity operator</td>
</tr>
<tr>
<td><code>!==</code></td>
<td>Nonidentity operator</td>
</tr>
<tr>
<td><code>==</code></td>
<td>Equality operator</td>
</tr>
<tr>
<td><code>!=</code></td>
<td>Inequality operator</td>
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

## Sensu query expression specification

Sensu query expressions are valid ECMAScript 5 (JavaScript) expressions that return `true` or `false`. Other values are not allowed.
If other values are returned, an error is logged and the filter evaluates to `false`.

### Custom functions

* `hour`: Returns the hour of a UNIX epoch time. In UTC and 24-hour time notation.

{{< highlight go >}}
// event.timestamp equals to 1520275913, which is Monday, March 5, 2018 6:51:53 PM UTC
// The following expression returns true
hour(event.timestamp) >= 17
{{< /highlight >}}

* `weekday`: Returns a number that represents the day of the week of a UNIX epoch time. Sunday is `0`.

{{< highlight go >}}
// event.timestamp equals to 1520275913, which is Monday, March 5, 2018 6:51:53 PM UTC
// The following expression returns false
weekday(event.timestamp) == 0
{{< /highlight >}}

## Sensu query expression examples

### Evaluate an event attribute

This example returns `true` if the event's entity contains a custom attribute named `namespace` that is equal to `production`:

{{< highlight javascript >}}
event.entity.namespace == 'production'
{{< /highlight >}}

### Evaluate an array

To evaluate an attribute that contains an array of elements, use the `.indexOf` method.
This example returns `true` if an entity includes the subscription `system`:

{{< highlight text >}}
entity.subscriptions.indexOf('system') >= 0
{{< /highlight >}}

### Evaluate the day of the week

The following example returns `true` if the event occurred on a weekday:

{{< highlight javascript >}}
weekday(event.timestamp) >= 1 && weekday(event.timestamp) <= 5
{{< /highlight >}}

### Evaluate office hours

The following example returns `true` if the event occurred between 9 AM and 5 PM UTC:

{{< highlight javascript >}}
hour(event.timestamp) >= 9 && hour(event.timestamp) <= 17
{{< /highlight >}}

[1]: https://github.com/robertkrimen/otto
