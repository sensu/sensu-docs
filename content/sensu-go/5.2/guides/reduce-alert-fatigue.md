---
title: "How to reduce alert fatigue with filters"
linkTitle: "Reducing Alert Fatigue"
weight: 38
version: "5.2"
product: "Sensu Go"
platformContent: False
menu: 
  sensu-go-5.2:
    parent: guides
---

## What are Sensu filters?

Sensu filters allow you to filter **events** destined for one or more event
**handlers**. Sensu filters evaluate their expressions against the event data, to
determine if the event should be passed to an event handler.

## Why use a filter?

Filters are commonly used to filter recurring events (i.e. to eliminate
notification noise) and to filter events from systems in pre-production
environments.

## Using filters to reduce alert fatigue

The purpose of this guide is to help you reduce alert fatigue by configuring a
filter named `hourly`, for a handler named `slack`, in order to prevent alerts
from being sent to Slack every minute. If you don't already have a handler in
place, learn [how to send alerts with handlers][3].

### Creating the filter

The first step is to create a filter that we will call `hourly`, which matches
new events (where the event's `occurrences` is equal to `1`) or hourly events
(so every hour after the first occurrence, calculated with the check's
`interval` and the event's `occurrences`).

Events in Sensu Go are handled regardless of
check execution status; even successful check events are passed through the
pipeline. Therefore, it's necessary to add a clause for non-zero status.

{{< highlight shell >}}
sensuctl filter create hourly \
--action allow \
--expressions "event.check.occurrences == 1 || event.check.occurrences % (3600 / event.check.interval) == 0"
{{< /highlight >}}

### Assigning the filter to a handler

Now that the `hourly` filter has been created, it can be assigned to a handler.
Here, since we want to reduce the number of Slack messages sent by Sensu, we will apply
our filter to an already existing handler named `slack`, in addition to the
built-in `is_incident` filter so only failing events are handled.

{{< highlight shell >}}
sensuctl handler update slack
{{< /highlight >}}

Follow the prompts to add the `hourly` and `is_incident` filters to the Slack
handler.

### Validating the filter

You can verify the proper behavior of this filter by using `sensu-backend` logs.
The default location of these logs varies based on the platform used, but the
[troubleshooting guide][2] provides this information.

Whenever an event is being handled, a log entry is added with the message
`"handler":"slack","level":"debug","msg":"sending event to handler"`, followed by
a second one with the message `"msg":"pipelined executed event pipe
handler","output":"","status":0`. However, if the event is being discarded by
our filter, a log entry with the message `event filtered` will appear instead.

## Next steps

You now know how to apply a filter to a handler and hopefully reduce alert
fatigue. From this point, here are some recommended resources:

* Read the [filters reference][1] for in-depth
  documentation on filters. 

[1]:  ../../reference/filters
[2]: ../troubleshooting#log-file-locations
[3]: ../send-slack-alerts
