---
title: "Subscriptions reference"
linkTitle: "Subscriptions Reference"
reference_title: "Subscriptions"
type: "reference"
description: "Use Sensu subscriptions to configure checks in a one-to-many model and write checks even if you don't know the names of the entities that should run the checks."
weight: 35
version: "6.3"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.3:
    parent: observe-schedule
---

Sensu uses the [publish/subscribe model of communication][1].
The publish/subscribe model is powerful in ephemeral or elastic infrastructures, where the names and numbers of things change over time.

Because Sensu uses the publish/subscribe model, you can write checks even if you don't know the specific names of the entities that should run the checks.
Likewise, your entities do not need to know the specific names of the checks they should execute.
The Sensu backend coordinates check execution for you by comparing the subscriptions you specify in your checks and entities to determine which entities should receive execution requests for a given check.

The diagram below shows how Sensu coordinates check execution based on subscriptions.
For example, the `check_cpu` check includes the `system` subscription.
All three entities include the `system` subscription, so all three entities will execute the `check_cpu` check.
However, only the `server01` and `database01` entities will execute `check_sshd_process` &mdash; the `webserver01` entity does not include the `linux` subscription required to execute `check_sshd_process`.

{{< figure src="/images/subscriptions_line.png" alt="Example of Sensu check execution based on subscriptions" link="/images/subscriptions_line.png" target="_blank" >}}

<!--Source at https://lucid.app/lucidchart/invitations/accept/inv_e898337e-e3f2-4194-8a33-fc8a6a474234-->

Sensu subscriptions are equivalent to topics in a traditional publish/subscribe system.
Sensu entities become subscribers to these topics via the strings you specify with the agent `subscriptions` flag.
Sensu checks have a `subscriptions` attribute, where you specify strings to indicate which subscribers will execute the checks.
For Sensu to execute a check, the check definition must include a subscription that matches the subscription of at least one Sensu entity.

As loosely coupled references, subscriptions avoid the fragility of traditional host-based monitoring systems.
Subscriptions allow you to configure check requests in a one-to-many model for entire groups or subgroups of entities rather than a traditional one-to-one mapping of configured hosts or observability checks.

## Subscription example

Suppose you have a Sensu agent entity with the `linux` subscription:

{{< code shell >}}
sensu-agent start --subscriptions linux --log-level debug
{{< /code >}}

For this agent to run a check, you must have at least one check with `linux` specified in the `subscriptions` attribute, such as this check to collect status information:

{{< language-toggle >}}

{{< code yml >}}
type: CheckConfig
api_version: core/v2
metadata:
  name: collect_info
  namespace: default
spec:
  command: collect.sh
  handlers:
  - slack
  interval: 10
  publish: true
  subscriptions:
  - linux
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "namespace": "default",
    "name": "collect_info"
  },
  "spec": {
    "command": "collect.sh",
    "handlers": [
      "slack"
    ],
    "interval": 10,
    "publish": true,
    "subscriptions": [
      "linux"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

If this is your only check for the `linux` subscription, this is the only check that your agent will execute.
If you add more checks that specify the `linux` subscription, your agent will automatically run those checks too (as long as the `publish` attribute is set to `true` in the check definitions).

You can also add more subscriptions for your entity.
For example, if you want your agent entity to execute checks for the `webserver` subscription, you can add it with the `subscriptions` flag:

{{< code shell >}}
sensu-agent start --subscriptions linux,webserver --log-level debug
{{< /code >}}

Now your agent entity will execute checks with the `linux` or `webserver` subscriptions.

To directly add, update, and delete subscriptions for individual entities, use [sensuctl][17], the [entities API][18], or the [web UI][19].

## Configure subscriptions

Sensu automatically executes a check when the check definition includes a subscription that matches a subscription for at least one Sensu entity.
In other words, subscriptions are configured for both checks and agent entities:

- To configure subscriptions for a check, add one or more subscription names in the [check `subscriptions` attribute][15].
- To configure subscriptions for an agent entity, configure the [`subscriptions`][2] by specifying the subscriptions that include the checks the agent's entities should execute.

The Sensu backend [schedules][13] checks once per interval for each agent entity with a matching subscription.
For example, if you have three entities configured with the `system` subscription, a check configured with the `system` subscription results in three monitoring events per interval: one check execution per entity per interval.

In addition to the subscriptions defined in the agent configuration, Sensu agent entities subscribe automatically to subscriptions that match their [entity `name`][10].
For example, an agent entity with `name: "i-424242"` subscribes to check requests with the subscription `entity:i-424242`.
This makes it possible to generate ad hoc check requests that target specific entities via the API.

{{% notice note %}}
**NOTE**: You can directly add, update, and delete subscriptions for individual entities via the backend with [sensuctl](../../../sensuctl/create-manage-resources/#update-resources), the [entities API](../../../api/entities/), and the [web UI](../../../web-ui/view-manage-resources/#manage-entities).
{{% /notice %}}

## Publish checks

If you want Sensu to automatically schedule and execute a check according to its subscriptions, set the [`publish` attribute][12] to `true` in the check definition.

You can also manually schedule [ad hoc check execution][11] with the [check API][16], whether the `publish` attribute is set to `true` or `false`.
To target the subscriptions defined in the check, include only the check name in the request body (for example, `"check": "check_cpu"`).
To override the check's subscriptions and target an alternate entity or group of entities, add the subscriptions attribute to the request body:

{{< code shell >}}
{
  "check": "check_cpu",
  "subscriptions": [
    "entity:i-424242",
    "entity:i-828282"
  ]
}
{{< /code >}}

## Monitor multiple servers

You can use subscriptions to configure monitoring and observability for multiple servers with different operating systems and monitoring requirements.

For example, suppose you want to set up monitoring for these servers:

- Six Linux servers:
    - Get CPU, memory, and disk status for all six
    - Get NGINX metrics for four
    - Get PostgreSQL metrics for two

- Six Windows servers:
    - Get CPU, memory, and disk checks for all six
    - Get SQL Server metrics for two

This diagram shows the subscriptions to list for each of the 12 servers (the entities) and for each check to achieve the example monitoring configuration:

{{< figure src="/images/subscriptions_multiple_servers.png" alt="Example of Sensu check execution for multiple server entities based on subscriptions" link="/images/subscriptions_multiple_servers.png" target="_blank" >}}

<!--Source at https://lucid.app/lucidchart/invitations/accept/inv_b8325487-1e67-4fba-bc20-45eb088c0d7c-->

In this scenario, none of the Windows servers should execute the NGINX metrics check, so the `check_nginx` subscriptions do not match any subscriptions listed for any of the Windows servers.
Two of the six Windows servers *should* execute the SQL Server metrics check, so the subscription listed in the `check_sqlsrv` definition matches a subscription listed for those two Windows server entities.


[1]: https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
[2]: ../agent/#subscriptions-flag
[10]: ../agent/#name-attribute
[11]: ../checks/#ad-hoc-scheduling
[12]: ../checks/#publish-attribute
[13]: ../checks/#check-scheduling
[15]: ../checks/#check-subscriptions
[16]: ../../../api/checks/#checkscheckexecute-post
[17]: ../../../sensuctl/create-manage-resources/#update-resources
[18]: ../../../api/entities/
[19]: ../../../web-ui/view-manage-resources/#manage-entities
