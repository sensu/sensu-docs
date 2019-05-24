---
title: "How to plan maintenance windows using silencing"
linkTitle: "Planning Maintenance"
description: "Perform system maintenance without getting overloaded with alerts. Sensu silencing bypasses event handlers during a maintenance period, giving operators the ability to quiet incoming alerts while coordinating their response. Read the guide to get started."
weight: 50
version: "5.9"
product: "Sensu Go"
platformContent: False
lastTested: 2018-12-04
menu: 
  sensu-go-5.9:
    parent: guides
---

## What is Sensu silencing?

As **check results** are processed by a Sensu server, the server executes [event
handlers][1] to send alerts to personnel or otherwise relay **event data** to
external services. Sensu’s built-in **silencing**, along with the built-in
`not_silenced` filter, provides the means to suppress execution of event
handlers on an ad hoc basis.

## When to use silencing 

Silencing is used to prevent handlers configured with the `not_silenced` filter
from being triggered based on the check name present in a check result or the
subscriptions associated with the entity that published the check result. This
can be desirable in many scenarios, giving operators the ability to quiet
incoming alerts while coordinating their response.

Sensu silencing entries make it possible to:

* [Silence all checks on a specific entity][2]
* [Silence a specific check on a specific entity][3]
* [Silence all checks on entities with a specific subscription][4]
* [Silence a specific check on entities with a specific subscription][5]
* [Silence a specific check on every entity][6]

## Using silencing to plan maintenance

The purpose of this guide is to help you plan a maintenance window, by creating
a silenced entry for a specific entity named `i-424242` and its check named
`check-http`,  in order to prevent alerts as you restart or redeploy the
services associated with this entity.

### Creating the silenced entry

The first step is to create a silenced entry that will silence the check
`check-http` on an entity named `i-424242`, for a planned maintenance window
that starts at **01:00**, on **Sunday**, and ends **1 hour** later. Your
username will automatically be added as the **creator** of the silenced entry.

{{< highlight shell >}}
sensuctl silenced create \
--subscription 'entity:i-424242' \
--check 'check-http' \
--begin '2018-03-16 01:00:00 -04:00' \
--expire 3600 \
--reason 'Server upgrade'
{{< /highlight >}}

See the [sensuctl documentation][8] for the supported time formats in the
`begin` flag.

### Validating the silenced entry

You can verify that the silenced entry against our entity, here named
`i-424242`, has been properly created, by using `sensuctl`.

{{< highlight shell >}}
sensuctl silenced info 'entity:i-424242:check-http'
{{< /highlight >}}

Once the silenced entry starts to take effect, events that are silenced will be
marked as so in `sensuctl events`.

{{< highlight shell >}}
sensuctl event list

   Entity         Check        Output       Status     Silenced          Timestamp
──────────────   ─────────    ─────────   ──────────── ────────── ───────────────────────────────
   i-424242      check-http                    0          true     2018-03-16 13:22:16 -0400 EDT
{{< /highlight >}}

_WARNING: By default, a silenced event will be handled unless the handler uses
the `not_silenced` filter to discard silenced events._

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
[8]: ../../sensuctl/reference/#dates-with-time