---
title: "Subscriptions reference"
linkTitle: "Subscriptions Reference"
description: "Placeholder."
weight: 30
version: "6.0"
product: "Sensu Go"
menu:
  sensu-go-6.0:
    parent: pipeline-agent-backend
---

Sensu uses the [publish/subscribe pattern of communication][1], which allows automated registration and deregistration of ephemeral systems.
At the core of this model are Sensu agent subscriptions.

Each Sensu agent has a defined set of [`subscriptions`][2]: a list of roles and responsibilities assigned to the system (for example, a webserver or database).
These subscriptions determine which [checks][3] the agent will execute.
Agent subscriptions allow Sensu to request check executions on a group of systems at a time instead of a traditional 1:1 mapping of configured hosts to monitoring checks.
For an agent to execute a service check, you must specify the same subscription in the [agent configuration][2] and the [check definition][3].

After receiving a check request from the Sensu backend, the agent:

1. Applies any [tokens][5] that match attribute values in the check definition.
2. Fetches [assets][6] and stores them in its local cache.
By default, agents cache asset data at `/var/cache/sensu/sensu-agent` (`C:\ProgramData\sensu\cache\sensu-agent` on Windows systems) or as specified by the the [`cache-dir` flag][7].
3. Executes the [check `command`][3].
4. Executes any [hooks][8] specified by the check based on the exit status.
5. Creates an [event][9] that contains information about the applicable entity, check, and metric.

## Subscription configuration

To configure subscriptions for an agent, set [the `subscriptions` flag][2].
To configure subscriptions for a check, set the [check definition attribute `subscriptions`][3].

In addition to the subscriptions defined in the agent configuration, Sensu agent entities also subscribe automatically to subscriptions that match their [entity `name`][10].
For example, an agent entity with `name: "i-424242"` subscribes to check requests with the subscription `entity:i-424242`.
This makes it possible to generate ad hoc check requests that target specific entities via the API.

## Proxy entities

Sensu proxy entities allow Sensu to monitor external resources on systems or devices where a Sensu agent cannot be installed (such a network switch).
The [Sensu backend][11] stores proxy entity definitions (unlike agent entities, which the agent stores).
When the backend requests a check that includes a [`proxy_entity_name`][3], the agent includes the provided entity information in the event data in place of the agent entity data.
See the [entity reference][12] and [Monitor external resources][13] for more information about monitoring proxy entities.


[1]: https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
[2]: ../agent/#subscriptions-flag
[3]: ../../pipeline-checks-events/checks/
[5]: ../../../reference/tokens/
[6]: ../../../reference/assets/
[7]: ../agent/#cache-dir
[8]: ../../pipeline-checks-events/hooks/
[9]: ../../pipeline-checks-events/events/
[10]: ../agent/#name
[11]: ../backend/
[12]: ../../pipeline-entities/entities/
[13]: ../../../guides/monitor-external-resources/
