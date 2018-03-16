---
title: "How to reduce alert fatigue with filters"
linkTitle: "Reducing Alert Fatigue"
weight: 1
version: "2.0"
product: "Sensu Core"
platformContent: False
menu: 
  sensu-core-2.0:
    parent: guides
---

## What are Sensu filters?

Sensu filters allow you to filter **events** destined for one or more event
**handlers**. Sensu filters evaluate their statements against the event data, to
determine if the event should be passed to an event handler.

## Why use a filter?

Filters are commonly used to filter recurring events (i.e. to eliminate
notification noise) and to filter events from systems in pre-production
environments.

## Using filters to reduce alert fatigue

The purpose of this guide is to help you reduce alert fatigue by configuring a
filter named `hourly`, for a handler named `mail`, in order to prevent alerts
from being sent by email every minute. If you don't already have a handler in
place, learn [how to send alerts with handlers](#).

### Creating the filter

The first step is to create a filter that we will call `hourly`, which matches
new events (where the event's `occurrences` is equal to `1`) or hourly events
(so every hour after the first occurrence, calculated with the check's
`interval` and the event's `occurrences`).

{{< highlight shell >}}
sensuctl filter create hourly \
  --action allow \
  --statements "event.Check.Occurrences == 1 || event.Check.Occurrences % (3600 / event.Check.Interval) == 0"
{{< /highlight >}}

### Assigning the filter to a handler

Now that the `hourly` filter has been created, it can be assigned to a handler.
Here, since we want to reduce the number of emails sent by Sensu, we will apply
our filter to an already existing handler named `mail`.

{{< highlight shell >}}
sensuctl handler set-filters mail hourly
{{< /highlight >}}

### Validating the filter

You can verify the proper behavior of this filter by using `sensu-backend` logs.
The default location of these logs varies based on the platform used, but the
[installation and configuration][2] documentation provides this information.

Whenever an event is being handled, a log entry is added with the message
`sending event: {...} to handler: mail`, followed by a second one with the
message `pipelined executed event pipe handler: status=0 output=`. However, if
the event is being discarded by our filter, a log entry with the message `event
filtered` will appear instead.

## Next steps

You now know how to apply a filter to a handler and hopefully reduce alert
fatigue. From this point, here are some recommended resources:

* Read the [filters reference][1] for in-depth
  documentation on filters. 

[1]:  ../../reference/filters
[2]: ../../getting-started/installation-and-configuration/#validating-the-services