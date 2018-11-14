---
title: "Sensu Query Expressions"
description: "The Sensu query expressions reference guide."
weight: 1
version: "5.0"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.0:
    parent: reference
---

- [Specification](#sensu-query-expressions-specification)
- [Examples](#sensu-query-expressions-examples)

## How do Sensu query expressions work?

Sensu query expressions (**SQE**) are based on [javascript][3] expressions, and
provide additional functionalities for Sensu usage (like nested parameters and
custom functions) so Sensu resources can be directly evaluated. SQE should
always return **true** or **false**.

## Javascript for expressions instead of Ruby

Sensu 1 uses [Ruby expressions][2], which are not available in Sensu 2, being
written in Go. The existence of a Go library that provides a Javascript VM has
allowed us to embed a Javascript execution engine for filters instead. Sadly,
there is no equivalent Ruby VM library.

## Sensu Query Expressions specification

### Javascript 

Sensu query expressions are valid ECMA5 (Javascript) expressions that return
**true** or **false**. Other values are not allowed. If other values are
returned, an error will be logged and the filter will evaluate to false.

### Custom functions

* `hour`: returns the hour, in UTC and in the 24-hour time notation, of a UNIX
  Epoch time.

{{< highlight go >}}
// event.timestamp equals to 1520275913, which is Monday, March 5, 2018 6:51:53 PM UTC
// The following expression returns true
hour(event.timestamp) >= 17
{{< /highlight >}}

* `weekday`: returns a number representing the day of the week, where Sunday
  equals `0`, of a UNIX Epoch time.

{{< highlight go >}}
// event.timestamp equals to 1520275913, which is Monday, March 5, 2018 6:51:53 PM UTC
// The following expression returns false
weekday(event.timestamp) == 0
{{< /highlight >}}

## Sensu Query Expressions examples

### Simple evaluation of an event attribute

The following example returns true if the event's entity contains a custom
attribute named `Environment` that is equal to `production`.

{{< highlight javascript >}}
event.Entity.Environment == 'production'
{{< /highlight >}}

### Evaluating the day of the week

The following example returns true if the event occurred on a weekday.

{{< highlight javascript >}}
weekday(event.timestamp) >= 1 && weekday(event.timestamp) <= 5
{{< /highlight >}}


### Evaluating office hours

The following example returns true if the event occurred between 9 AM and 5 PM
UTC.

{{< highlight javascript >}}
hour(event.timestamp) >= 9 && hour(event.timestamp) <= 17
{{< /highlight >}}

[2]: ../../../latest/reference/filters/#what-are-filter-attribute-eval-tokens
[3]: https://github.com/robertkrimen/otto
