---
title: "Sensu Query Expressions"
description: "The Sensu query expressions reference guide."
weight: 1
version: "2.0"
product: "Sensu Core"
platformContent: false 
menu:
  sensu-core-2.0:
    parent: reference
---

## How do Sensu query expressions work?

Sensu query expressions (**SQE**) are based on [govaluate][1] expressions, and
provide additional functionalities for Sensu usage (e.g., nested parameters,
custom functions) so Sensu resources can be directly evaluated. SQE should
always return **false** or **true**.

## New and improved expressions

Sensu 1 uses [Ruby expressions][2], which are not available in Sensu 2, being
written in Go. Therefore, the syntax has been changed a bit but in return, it is
now possible to use custom functions, which allow more complex expressions.

## Sensu query expressions specification

### Govaluate operators

All [govaluate operators][3] are available in Sensu query expressions. However
**modifier operators** may not be used in Sensu **assets**.

### Custom functions

* `hour`: returns the hour, in UTC and in the 24-hour time notation, of a UNIX
  Epoch time.

{{< highlight go >}}
// event.Timestamp equals to 1520275913, which is Monday, March 5, 2018 6:51:53 PM UTC
// The following expression returns true
hour(event.Timestamp) >= 17
{{< /highlight >}}

* `weekday`: returns a number representing the day of the week, where Sunday
  equals `0`, of a UNIX Epoch time.

{{< highlight go >}}
// event.Timestamp equals to 1520275913, which is Monday, March 5, 2018 6:51:53 PM UTC
// The following expression returns false
weekday(event.Timestamp) == 0
{{< /highlight >}}

## Sensu query expressions examples

### Simple evaluation of an event attribute

The following example returns true if the event's entity contains a custom
attribute named `production` that equals to `production`.

{{< highlight javascript >}}
event.Entity.Environment == 'production'
{{< /highlight >}}

### Evaluating the weekday

The following example returns true if the event occurred on a weekday.

{{< highlight javascript >}}
weekday(event.Timestamp) >= 1 && weekday(event.Timestamp) <= 5
{{< /highlight >}}


### Evaluating office hours

The following example returns true if the event occurred between 9 AM and 5 PM
UTC.

{{< highlight javascript >}}
hour(event.Timestamp) >= 9 && hour(event.Timestamp) <= 17
{{< /highlight >}}

[1]: https://github.com/Knetic/govaluate
[2]: ../../../1.2/reference/filters/#what-are-filter-attribute-eval-tokens
[3]: https://github.com/Knetic/govaluate/blob/master/MANUAL.md#operators