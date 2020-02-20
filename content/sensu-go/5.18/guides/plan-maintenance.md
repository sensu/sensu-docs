---
title: "Plan maintenance windows with silencing"
linkTitle: "Plan Maintenance Windows"
description: "Perform system maintenance without getting overloaded with alerts. Sensu silencing bypasses event handlers during maintenance periods, giving operators the ability to quiet incoming alerts while coordinating their response. Read this guide to use Sensu silencing."
weight: 200
version: "5.18"
product: "Sensu Go"
platformContent: False
lastTested: 2018-12-04
menu: 
  sensu-go-5.18:
    parent: guides
---

- [Use silencing to plan maintenance](#use-silencing-to-plan-maintenance)
- [Next steps](#next-steps)

As the Sensu backend processes check results, the server executes [event handlers][1] to send alerts to personnel or otherwise relay event data to external services.
Sensu’s built-in silencing, along with the built-in `not_silenced` filter, provides a way to suppress execution of event handlers on an ad hoc basis.

Use silencing to prevent handlers configured with the `not_silenced` filter from being triggered based on the check name in a check result or the subscriptions associated with the entity that published the check result.
Sensu's silencing capability allows operators to quiet incoming alerts while coordinating a response or during planned maintenance windows.

Sensu silencing makes it possible to:

* [Silence all checks on a specific entity][2]
* [Silence a specific check on a specific entity][3]
* [Silence all checks on entities with a specific subscription][4]
* [Silence a specific check on entities with a specific subscription][5]
* [Silence a specific check on every entity][6]

## Use silencing to plan maintenance

Suppose you want to plan a maintenance window.
In this example, you'll create a silenced entry for a specific entity named `i-424242` and its check, `check-http`, to prevent alerts as you restart and redeploy the services associated with this entity.

### Create the silenced entry

To begin, create a silenced entry that will silence the check `check-http` on the entity `i-424242` for a planned maintenance window that starts at **01:00** on **Sunday** and ends **1 hour** later.
Your username will be added automatically as the **creator** of the silenced entry:

{{< highlight shell >}}
sensuctl silenced create \
--subscription 'entity:i-424242' \
--check 'check-http' \
--begin '2018-03-16 01:00:00 -04:00' \
--expire 3600 \
--reason 'Server upgrade'
{{< /highlight >}}

See the [sensuctl documentation][8] for the supported time formats for the `begin` flag.

### Validate the silenced entry

Use sensuctl to verify that the silenced entry against the entity `i-424242` was created properly:

{{< highlight shell >}}
sensuctl silenced info 'entity:i-424242:check-http'
{{< /highlight >}}

After the silenced entry starts to take effect, events that are silenced will be marked as such in `sensuctl events`:

{{< highlight shell >}}
sensuctl event list

   Entity         Check        Output       Status     Silenced          Timestamp
──────────────   ─────────    ─────────   ──────────── ────────── ───────────────────────────────
   i-424242      check-http                    0          true     2018-03-16 13:22:16 -0400 EDT
{{< /highlight >}}

_**WARNING**: By default, a silenced event will be handled unless the handler uses the `not_silenced` filter to discard silenced events._

## Next steps

Next, read the [silencing reference][7] for in-depth documentation about silenced entries.

[1]: ../../reference/handlers/
[2]: ../../reference/silencing/#silence-all-checks-on-a-specific-entity
[3]: ../../reference/silencing/#silence-a-specific-check-on-a-specific-entity
[4]: ../../reference/silencing/#silence-all-checks-on-entities-with-a-specific-subscription
[5]: ../../reference/silencing/#silence-a-specific-check-on-entities-with-a-specific-subscription
[6]: ../../reference/silencing/#silence-a-specific-check-on-every-entity
[7]: ../../reference/silencing/
[8]: ../../sensuctl/reference/#dates-with-time
