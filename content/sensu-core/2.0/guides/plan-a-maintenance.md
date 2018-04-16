---
title: "How to plan a maintenance using silencing"
linkTitle: "Planning a Maintenance"
weight: 50
version: "2.0"
product: "Sensu Core"
platformContent: False
menu: 
  sensu-core-2.0:
    parent: guides
---

## What is Sensu silencing?

As **check results** are processed by a Sensu server, the server executes [event
handlers][1] to send alerts to personnel or otherwise relay **event data** to
external services. Although event handlers can be directly configured with
**filters** to improve overall signal-to-noise ratio, there are many scenarios
in which operators receiving notifications from Sensu require an on-demand means
to suppress alerts. Sensu’s built-in **silencing** provides the means to
suppress execution of event handlers on an ad hoc basis.

## When to use silencing 

Silencing is used to prevent handlers from being triggered based on the check
name present in a check result or the subscriptions associated with the entity
that published the check result. This can be desirable in many scenarios, giving
operators the ability to quiet incoming alerts while coordinating their
response.

Sensu silencing entries make it possible to:

* [Silence all checks on a specific entity][2]
* [Silence a specific check on a specific entity][3]
* [Silence all checks on entities with a specific subscription][4]
* [Silence a specific check on entities with a specific subscription][5]
* [Silence a specific check on every entity][6]

## Using silencing to plan a maintenance

The purpose of this guide is to help you plan a window maintenance, by creating
a silenced entry for a specific entity named `i-424242`, in order to prevent
alerts as you restart or redeploy the services associated with this entity.

### Creating the silenced entry

The first step is to create a silenced entry that will silence all checks on an
entity named `i-424242`, for a planned maintenance that starts at **01:00**, on
**Sunday**, and ends **1 hour** later. Your username will automatically be added
as the **creator** of the silenced entry.

{{< highlight shell >}}
sensuctl silenced create \
--subscription 'entity:i-424242' \
--begin 'Mar 18 2018 1:00AM' \
--expire 3600 \
--reason 'Server upgrade'
{{< /highlight >}}

### Validating the silenced entry

You can verify that the silenced entry against our entity, here named `i-424242`, has been properly created, by using `sensuctl`.

{{< highlight shell >}}
sensuctl silenced info \
--subscription 'entity:i-424242'
{{< /highlight >}}

Once the silenced entry starts to take effect, events that are not handled due to silencing will be marked as so in `sensuctl events`.

{{< highlight shell >}}
$ sensuctl event list
     Entity         Check        Output       Status     Silenced          Timestamp
 ──────────────   ─────────    ─────────   ──────────── ────────── ───────────────────────────────
  scotch.local    keepalive                     0          true     2018-03-16 13:22:16 -0400 EDT
{{< /highlight >}}

## Next steps

You now know how to create silenced entries to plan a maintenance and hopefully
avoid false positive. From this point, here are some recommended resources:

* Read the [silencing reference][7] for in-depth documentation on silenced entries.

[1]: #
[2]: ../../reference/silencing/#silence-all-checks-on-a-specific-entity
[3]: ../../reference/silencing/#silence-a-specific-check-on-a-specific-entity
[4]: ../../reference/silencing/#silence-all-checks-on-entities-with-a-specific-subscription
[5]: ../../reference/silencing/#silence-a-specific-check-on-entities-with-a-specific-subscription
[6]: ../../reference/silencing/#silence-a-specific-check-on-every-entity
[7]: ../../reference/silencing/
