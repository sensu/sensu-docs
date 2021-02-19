---
title: "Business service monitoring SDK"
linkTitle: "Business Service Monitoring SDK"
description: "Based on JavaScript expressions, Sensu's business service monitoring SDK provides additional functionality for Sensu rule templates that evaluate service components. Read the reference doc to learn about the business service monitoring SDK."
weight: 75
version: "6.3"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-6.3:
    parent: observe-schedule
---

Sensu's business service monitoring (BSM) feature uses a dedicated SDK of JavaScript-based expressions that provide additional functionality.

BSM SDK expressions are defined in [rule templates][3], so they act in the context of determining whether aggregate data derived from a service component’s selection of Sensu Go events should trigger a rule-based event.
BSM SDK expressions always receive a single event and some information about that event, like `event.timestamp` or `event.check.interval`.

BSM SDK expressions always return either `true` or `false`.
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

BSM SDK expressions are valid ECMAScript 5 (JavaScript) expressions that return either `true` or `false`.
Other values are not allowed.
If an expression returns a value besides `true` or `false`, an error is recorded in the [Sensu backend log][2] and the filter evaluates to `false`.

The BSM SDK allows you to to express rules for the number or percentage of events with critical, warning, OK, and unknown statuses.
You can also configure expressions to ignore silenced events.

## Custom functions

### sensu.Count()

The custom function `sensu.Count()` returns ...

For example, ...:

{{< code go >}}
...
{{< /code >}}

### sensu.Percentage()

The custom function `sensu.Percentage()` returns ...
Sunday is `0`.

For example, ...:

{{< code go >}}
...
{{< /code >}}

## Examples

### Evaluate ???

This BSM SDK expression returns `true` if ...:

{{< code go >}}
...
{{< /code >}}

### Evaluate ???

This BSM SDK expression returns `true` if ...:

{{< code go >}}
...
{{< /code >}}

### Evaluate ???

This BSM SDK expression returns `true` if ...:

{{< code go >}}
...
{{< /code >}}

### Evaluate ???

This BSM SDK expression returns `true` if ...:

{{< code go >}}
...
{{< /code >}}


[1]: https://github.com/robertkrimen/otto
[2]: ../backend/#event-logging
[3]: ../filters/#build-event-filter-expressions-with-sensu-query-expressions
