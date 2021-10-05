---
title: "Plan maintenance windows with silencing"
linkTitle: "Plan Maintenance Windows"
guide_title: "Plan maintenance windows with silencing"
type: "guide"
description: "Perform system maintenance without getting overloaded with alerts. Sensu silencing bypasses event handlers during maintenance periods, giving operators the ability to quiet incoming alerts while coordinating their response. Read this guide to use Sensu silencing."
weight: 70
version: "6.5"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-6.5:
    parent: observe-process
---

As the Sensu backend processes check results, the server executes [event handlers][1] to send alerts to personnel or otherwise relay observation data (events) to external services.
Sensu’s built-in silencing, along with the built-in `not_silenced` filter, provides a way to suppress execution of event handlers on an ad hoc basis.

Use silencing to prevent handlers configured with the `not_silenced` filter from being triggered based on the check name in a check result or the subscriptions associated with the entity that published the check result.
Sensu's silencing capability allows operators to quiet incoming alerts while coordinating a response or during planned maintenance windows.

Sensu silencing makes it possible to:

* [Silence all checks on a specific entity][2]
* [Silence a specific check on a specific entity][3]
* [Silence all checks on entities with a specific subscription][4]
* [Silence a specific check on entities with a specific subscription][5]
* [Silence a specific check on every entity][6]

Suppose you want to plan a maintenance window.
In this example, you'll create a silenced entry for a specific entity named `i-424242` and its check, `check-http`, to prevent alerts as you restart and redeploy the services associated with this entity.

## Create the silenced entry

To begin, create a silenced entry that will silence the check `check-http` on the entity `i-424242` for a planned maintenance window that starts at **01:00** on **Sunday** and ends **1 hour** later.
Your username will be added automatically as the **creator** of the silenced entry:

{{< code shell >}}
sensuctl silenced create \
--subscription 'entity:i-424242' \
--check 'check-http' \
--begin '2021-03-14 01:00:00 -04:00' \
--expire 3600 \
--reason 'Server upgrade'
{{< /code >}}

This command creates the following silenced resource definition:

{{< language-toggle >}}

{{< code yml >}}
type: Silenced
api_version: core/v2
metadata:
  created_by: admin
  name: entity:i-424242:check-http
  namespace: default
spec:
  begin: 1615698000
  check: check-http
  creator: admin
  expire: 3600
  expire_at: 1615701600
  expire_on_resolve: false
  reason: Server upgrade
  subscription: entity:i-424242
{{< /code >}}

{{< code json >}}
{
  "type": "Silenced",
  "api_version": "core/v2",
  "metadata": {
    "created_by": "admin",
    "name": "entity:i-424242:check-http",
    "namespace": "default"
  },
  "spec": {
    "begin": 1615698000,
    "check": "check-http",
    "creator": "admin",
    "expire": 3600,
    "expire_at": 1615701600,
    "expire_on_resolve": false,
    "reason": "Server upgrade",
    "subscription": "entity:i-424242"
  }
}
{{< /code >}}

{{< /language-toggle >}}

Read the [sensuctl documentation][8] for the supported time formats for the `begin` flag.

## Validate the silenced entry

Use sensuctl to verify that the silenced entry against the entity `i-424242` was created properly:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl silenced info 'entity:i-424242:check-http' --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl silenced info 'entity:i-424242:check-http' --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The response will list the silenced resource definition.


After the silenced entry starts to take effect, events that are silenced will be marked as such in the response:

{{< code shell >}}
   Entity         Check        Output       Status     Silenced          Timestamp
──────────────   ─────────    ─────────   ──────────── ────────── ───────────────────────────────
   i-424242      check-http                    0          true     2021-03-14 13:22:16 -0400 EDT
{{< /code >}}

{{% notice warning %}}
**WARNING**: By default, a silenced event will be handled unless the handler uses the `not_silenced` filter to discard silenced events.
{{% /notice %}}

## Next steps

Read the [silencing reference][7] for in-depth documentation about silenced entries.


[1]: ../handlers/
[2]: ../silencing/#silence-all-checks-on-a-specific-entity
[3]: ../silencing/#silence-a-specific-check-on-a-specific-entity
[4]: ../silencing/#silence-all-checks-on-entities-with-a-specific-subscription
[5]: ../silencing/#silence-a-specific-check-on-entities-with-a-specific-subscription
[6]: ../silencing/#silence-a-specific-check-on-every-entity
[7]: ../silencing/
[8]: ../../../sensuctl/create-manage-resources/#time-formats
