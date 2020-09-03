---
title: "Subscriptions"
reference_title: "Subscriptions"
type: "reference"
description: "The Sensu agent is a lightweight client that runs on the infrastructure components you want to monitor. Read the reference doc to use the Sensu agent to create monitoring events."
weight: 170
version: "6.0"
product: "Sensu Go"
menu:
  sensu-go-6.0:
    parent: reference
---

Sensu uses the [publish/subscribe pattern of communication][1], which allows automated registration and deregistration of ephemeral systems.
At the core of this model are Sensu agent and check [subscriptions][2]: transport topics to which the Sensu [backend][4] publishes check requests.

Sensu entities become subscribers to these topics via their individual `subscriptions` attribute. 
Subscriptions typically correspond to a specific role or responsibility (for example. a webserver or database).

Subscriptions are powerful primitives in the monitoring context because they allow you to effectively monitor for specific behaviors or characteristics that correspond to the function provided by a particular system.
For example, disk capacity thresholds might be more important (or at least different) on a database server than on a webserver.
Conversely, CPU or memory usage thresholds might be more important on a caching system than on a file server.

Subscriptions allow you to configure check requests for an entire group or subgroup of systems rather than requiring a traditional one-to-one mapping of configured hosts or observability checks.

## Agent subscriptions

The subscriptions you specify in an agent's definition will determine which [checks][3] the agent will execute.
For an agent to execute a service check, you must specify the same subscription in the [agent configuration][11] and the [check definition][12].

After receiving a check request from the Sensu backend, the agent:

1. Applies any [tokens][5] that match attribute values in the check definition.
2. Fetches [assets][6] and stores them in its local cache.
By default, agents cache asset data at `/var/cache/sensu/sensu-agent` (`C:\ProgramData\sensu\cache\sensu-agent` on Windows systems) or as specified by the the [`cache-dir` flag][7].
3. Executes the [check `command`][3].
4. Executes any [hooks][8] specified by the check based on the exit status.
5. Creates an [event][9] that contains information about the applicable entity, check, and metric.

### Agent subscription configuration

To configure subscriptions for an agent, set the [`subscriptions` flag][2].

In addition to the subscriptions defined in the agent configuration, Sensu agent entities also subscribe automatically to subscriptions that match their [entity `name`][10].
For example, an agent entity with `name: "i-424242"` subscribes to check requests with the subscription `entity:i-424242`.
This makes it possible to generate ad hoc check requests that target specific entities via the API.

## Check subscriptions

The subscriptions you specify in a check's definition determine which [agents][14] will execute the checks.

Sensu [schedules][13] checks once per interval for each agent with a matching subscription.
For example, if you have three agents configured with the `system` subscription, a check configured with the `system` subscription results in three monitoring events per interval: one check execution per agent per interval.
For Sensu to execute a check, the check definition must include a subscription that matches the subscription of at least one Sensu agent.

### Check subscription configuration

To configure subscriptions for a check, set the [check definition attribute `subscriptions`][15] to specify an array of one or more subscription names.


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
[11]: #agent-subscription-configuration
[12]: #check-subscription-configuration
[13]: ../checks/#check-scheduling
[14]: ../agent/
[15]: ../checks/#check-subscriptions
