---
title: "Subscriptions reference"
linkTitle: "Subscriptions Reference"
reference_title: "Subscriptions"
type: "reference"
description: "Sensu subscriptions are equivalent to topics in a traditional publish/subscribe system. With Sensu subscriptions, you can configure check requests in a one-to-many model for an entire group or subgroup of systems rather than a traditional one-to-one mapping of configured hosts or observability checks. Read this reference doc to learn how to configure subscriptions in Sensu."
weight: 35
version: "6.1"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.1:
    parent: observe-schedule
---

Sensu uses the [publish/subscribe pattern of communication][1].
At the core of this model are Sensu agent and check subscriptions, which are equivalent to "topics" in a traditional publish/subscribe system.
Sensu entities become subscribers to these "topics" via their individual `subscriptions` attributes.
Sensu checks also have a `subscriptions` attribute, where you specify which subscribers will execute the checks.
The Sensu backend schedules checks and publishes check execution requests to entities.

Subscriptions are powerful service-based monitoring primitives that allow you to effectively monitor for specific behaviors or characteristics that correspond to the function provided by a particular system.
As loosely coupled references, subscriptions avoid the fragility of traditional host-based monitoring systems.
With subscriptions, you can configure check requests in a one-to-many model for an entire group or subgroup of systems rather than a traditional one-to-one mapping of configured hosts or observability checks.

## Subscription configuration

The subscriptions you specify in a check's definition determine which agents will execute the check.
Likewise, the subscriptions you specify for an agent determine which checks the agent will execute.
Subscriptions make associations between entities and checks by matching the strings you specify in the `subscriptions` attributes for agent and check definitions.

To configure subscriptions for a check, add one or more subscription names in the [check `subscriptions` attribute][15].
To configure subscriptions for an agent, set the [`subscriptions` flag][2] and specify the subscriptions that include the checks the agent should execute.

Sensu [schedules][13] checks once per interval for each agent with a matching subscription.
For example, if you have three agents configured with the `system` subscription, a check configured with the `system` subscription results in three monitoring events per interval: one check execution per agent per interval.

For Sensu to execute a check, the check definition must include a subscription that matches the subscription of at least one Sensu agent.
You must also set the `publish` attribute to `true` in the check definition.

In addition to the subscriptions defined in the agent configuration, Sensu agent entities subscribe automatically to subscriptions that match their [entity `name`][10].
For example, an agent entity with `name: "i-424242"` subscribes to check requests with the subscription `entity:i-424242`.
This makes it possible to generate ad hoc check requests that target specific entities via the API.

## Example

Suppose you have a Sensu agent with the `linux` subscription:

{{< code shell >}}
sensu-agent start --subscriptions linux --log-level debug
{{< /code >}}

For this agent to run a check, you must have at least one check with `linux` specified in the `subscriptions` attribute.
For example, suppose you have a check to collect status information:

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

You can also add more subscriptions for your agent.
For example, if you want your agent to execute checks for the `webserver` subscription, you can specify it with the `subscriptions` flag:

{{< code shell >}}
sensu-agent start --subscriptions linux,webserver --log-level debug
{{< /code >}}

Now your agent will execute checks with the `linux` or `webserver` subscriptions.


[1]: https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
[2]: ../agent/#subscriptions-flag
[3]: ../checks/
[4]: ../backend/
[5]: ../tokens/
[6]: ../assets/
[7]: ../agent/#cache-dir
[8]: ../hooks/
[9]: ../events/
[10]: ../agent/#name
[13]: ../checks/#check-scheduling
[14]: ../agent/
[15]: ../checks/#check-subscriptions
