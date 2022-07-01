---
title: "Automatically register and deregister entities"
linkTitle: "Automatically Register and Deregister Entities"
guide_title: "Automatically register and deregister entities"
type: "guide"
description: "PLACEHOLDER."
weight: 38
version: "6.7"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.7:
    parent: observe-entities
---

Sensu uses the [publish/subscribe pattern of communication][1], which allows automated registration and deregistration of ephemeral systems.
Sensu agents automatically discover and register infrastructure components and the services running on them.
At the same time, when an agent process stops, the Sensu backend can automatically create and process a deregistration event.

Automatic registration and deregistration helps keep your Sensu instance up-to-date.
You'll see observability event data soon after an agent entity comes online, and you won't receive stale events or alerts for entities that no longer exist.
You can also configure [handlers][8] that take specific actions based on entity registration and deregistration.

To follow this guide, you’ll need to [install][3] the Sensu backend, have at least one Sensu agent running, and install and configure sensuctl.


## Registration and service discovery

Sensu agents automatically discover and register infrastructure components and the services running on them.

{{% notice note %}}
**NOTE**: Automatic discovery is not supported for proxy entities because they cannot run a Sensu agent.
Use the [core/v2/events API](../../../api/core/events/) to send manual keepalive events for proxy entities.
{{% /notice %}}

### Registration events

When an agent comes online, it sends its first [keepalive event][].
When a Sensu backend processes a keepalive event for an agent whose name is not already listed in the Sensu agent registry, Sensu automatically registers the agent.
The Sensu backend stores the agent registry, which you can view by running [`sensuctl entity list`][].

If you configure a [handler][] named `registration`, the [Sensu backend][2] will create and process a registration event for that handler to process.
The `registration` handler must reference the name of a handler or handler set that you want to execute for every registration event.

You can also use registration events to execute one-time handlers for new Sensu agents. For example, you can use registration event handlers to update external configuration management databases (CMDBs) such as ServiceNow.

{{% notice warning %}}
**WARNING**: Registration events are not stored in the event registry, so they are not accessible via the Sensu API.
However, all registration events are logged in the [Sensu backend log](../backend/#event-logging).
{{% /notice %}}

You can use registration event handlers to update external [configuration management databases (CMDBs)][] or take other actions based on registration events.

For example, suppose you want to create or update a ServiceNow incident for every registration event.
First, configure a handler that uses the [][] dynamic runtime asset:

Then, create a `registration` handler that references the `servicenow-cmdb` handler:

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  name: registration
spec:
  handlers:
  - servicenow-cmdb
  type: set
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "registration"
  },
  "spec": {
    "handlers": [
      "servicenow-cmdb"
    ],
    "type": "set"
  }
}
{{< /code >}}

{{< /language-toggle >}}

The *referenced* handler can send registration alerts to any service, such as [Sumo Logic][], [PagerDuty][], or [Slack][], as long as it is listed within a handler named `registration`.

{{% notice protip %}}
**PRO TIP**: Use a [handler set](../../observe-process/handlers#handler-sets) to execute multiple handlers in response to registration events.
{{% /notice %}}



...


{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: CheckConfig
api_version: core/v2
metadata:
  name: process-discovery
spec:
  command: sensu-process-discovery
  runtime_assets:
  - sensu/sensu-process-discovery:0.0.1
  subscriptions:
  - autodiscovery
  publish: true
  interval: 60
  timeout: 5
  pipelines:
  - api_version: core/v2
    type: Pipeline
    name: discovery
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "process-discovery"
  },
  "spec": {
    "command": "sensu-process-discovery",
    "runtime_assets": [
      "sensu/sensu-process-discovery:0.0.1"
    ],
    "subscriptions": [
      "autodiscovery"
    ],
    "publish": true,
    "interval": 60,
    "timeout": 5,
    "pipelines": [
      {
        "api_version": "core/v2",
        "type": "Pipeline",
        "name": "discovery"
      }
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}


{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: CheckConfig
api_version: core/v2
metadata:
  name: platform-discovery
spec:
  command: sensu-platform-discovery
  runtime_assets:
  - sensu/sensu-platform-discovery:0.0.2
  subscriptions:
  - autodiscovery
  publish: true
  interval: 60
  timeout: 5
  pipelines:
  - api_version: core/v2
    type: Pipeline
    name: discovery
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "platform-discovery"
  },
  "spec": {
    "command": "sensu-platform-discovery",
    "runtime_assets": [
      "sensu/sensu-platform-discovery:0.0.2"
    ],
    "subscriptions": [
      "autodiscovery"
    ],
    "publish": true,
    "interval": 60,
    "timeout": 5,
    "pipelines": [
      {
        "api_version": "core/v2",
        "type": "Pipeline",
        "name": "discovery"
      }
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}


## Deregistration

From agent ref:

{{% notice note %}}
**NOTE**: If you set the [deregister flag](#ephemeral-agent-configuration-flags) to `true`, when a Sensu agent process stops, the Sensu backend will deregister the corresponding entity.<br><br>
Deregistration prevents and clears alerts for failing keepalives for agent entities &mdash; the backend does not distinguish between intentional shutdown and failure.
As a result, if you set the deregister flag to `true` and an agent process stops for any reason, you will not receive alerts for keepalive events in the web UI.<br><br>
If you want to receive alerts for failing keepalives, set the [deregister](#ephemeral-agent-configuration-flags) configuration flag to `false`.
{{% /notice %}}





from agent ref:

### Deregistration events

As with registration events, the Sensu backend can create and process a deregistration event when the Sensu agent process stops.
You can use deregistration events to trigger a handler that updates external CMDBs or performs an action to update ephemeral infrastructures.
To enable deregistration events, use the [`deregister` flag][13], and specify the event handler using the [`deregistration-handler` flag][13].
You can specify a deregistration handler per agent using the [`deregistration-handler` agent flag][13] or by setting a default for all agents using the [`deregistration-handler` backend configuration flag][37].

{{% notice note %}}
**NOTE**: Deregistration is supported for [agent entities](../../observe-entities/#agent-entities) that have sent at least one keepalive.
Deregistration is **not** supported for [proxy entities](../../observe-entities/#proxy-entities), which do not send keepalives, and the backend does not automatically create and process deregistration events for proxy entities.
{{% /notice %}}



entity ref:

deregister attribute
If the entity should be removed when it stops sending keepalive messages, true. Otherwise, false.

deregistration attribute
Map that contains a handler name to use when an agent entity is deregistered. Read deregistration attributes for more information


Just like Sensu can automatically register new agent entities, Sensu can automatically deregister entities when an agent process stops.
To enable deregistration, set the [agent deregister attribute][11] to `true`.
When the Sensu agent process stops, the Sensu backend will deregister the corresponding entity without any further action.

The Sensu backend can also automatically create and process deregistration events when an agent entity process stops.
You can use deregistration events to trigger a handler that updates external CMDBs or ephemeral infrastructures.
To enable deregistration events, set the [agent deregister attribute][11] to `true` and specify a handler name for the [backend deregistration-handler attribute][9].

If you want to use a deregistration handler to process all deregistration events for all agents, set the [deregistration-handler **backend** configuration flag][9].
If you want to use a deregistration handler only for a specific agent, set the [deregistration-handler **agent** configuration flag][10].

{{% notice note %}}
**NOTE**: The Sensu backend does not distinguish between intentional shutdown and failure.
If you set the deregister attribute to `true` and an agent process stops for any reason, you will not receive alerts for keepalive events.
Deregistration prevents and clears alerts for failing keepalives.
If you want to receive alerts for failing keepalives, set the deregister attribute to `false`.
{{% /notice %}}

Deregistration is only for entities that have had at least one keepalive sent. It is actually possible to sent keepalive events to proxy entities manually, and in such cases, they would be subject to deletion when deregister is set true. However, in this configuration, no keepalive has been sent for the proxy entity, as evidenced by the fact that last_seen is not set. It is not possible to send a keepalive to a proxy entity with sensu-agent.

Another example: deregistration can go to another handler (ask AWS if compute instance still exists and if not, automatically deregister). Link to EC2 integration and guide page.


{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: Pipeline
api_version: core/v2
metadata:
  name: discovery
spec:
  workflows:
  - name: subscription-manager
    filters:
    - api_version: core/v2
      type: EventFilter
      name: discovery
    handler:
      api_version: core/v2
      type: Handler
      name: subscription-manager
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "Pipeline",
  "api_version": "core/v2",
  "metadata": {
    "name": "discovery"
  },
  "spec": {
    "workflows": [
      {
        "name": "subscription-manager",
        "filters": [
          {
            "api_version": "core/v2",
            "type": "EventFilter",
            "name": "discovery"
          }
        ],
        "handler": {
          "api_version": "core/v2",
          "type": "Handler",
          "name": "subscription-manager"
        }
      }
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}


{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: Handler
api_version: core/v2
metadata:
  name: subscription-manager
spec:
  type: pipe
  command: >-
    sensu-entity-manager
    --api-url https://${SENSU_API_URL}:8080
    --add-subscriptions
  runtime_assets:
  - sensu/sensu-entity-manager:0.3.0
  timeout: 5
  secrets:
  - name: SENSU_API_KEY
    secret: entity-manager-api-key
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "subscription-manager"
  },
  "spec": {
    "type": "pipe",
    "command": "sensu-entity-manager --api-url https://${SENSU_API_URL}:8080 --add-subscriptions",
    "runtime_assets": [
      "sensu/sensu-entity-manager:0.3.0"
    ],
    "timeout": 5,
    "secrets": [
      {
        "name": "SENSU_API_KEY",
        "secret": "entity-manager-api-key"
      }
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}


{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: EventFilter
api_version: core/v2
metadata:
  name: discovery
spec:
  action: allow
  expressions:
  - event.check.status == 0
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "discovery"
  },
  "spec": {
    "action": "allow",
    "expressions": [
      "event.check.status == 0"
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}


## Keepalive timeouts


still in agent ref:

## Keepalive monitoring

Sensu keepalives are the heartbeat mechanism used to ensure that all registered agents are operational and able to reach the [Sensu backend][2].
Sensu agents publish keepalive events containing [entity][3] configuration data to the Sensu backend according to the interval specified by the [`keepalive-interval`][4] configuration flag.

If a Sensu agent fails to send keepalive events over the period specified by the [`keepalive-critical-timeout`][4] configuration flag, the Sensu backend creates a keepalive **critical** alert in the Sensu web UI.
The `keepalive-critical-timeout` is set to `0` (disabled) by default to help ensure that it will not interfere with your `keepalive-warning-timeout` setting.

If a Sensu agent fails to send keepalive events over the period specified by the [`keepalive-warning-timeout`][58] configuration flag, the Sensu backend creates a keepalive **warning** alert in the Sensu web UI.
The value you specify for `keepalive-warning-timeout` must be lower than the value you specify for `keepalive-critical-timeout`.

{{% notice note %}}
**NOTE**: If you set the [deregister flag](#ephemeral-agent-configuration-flags) to `true`, when a Sensu agent process stops, the Sensu backend will deregister the corresponding entity.<br><br>
Deregistration prevents and clears alerts for failing keepalives for agent entities &mdash; the backend does not distinguish between intentional shutdown and failure.
As a result, if you set the deregister flag to `true` and an agent process stops for any reason, you will not receive alerts for keepalive events in the web UI.<br><br>
If you want to receive alerts for failing keepalives, set the [deregister](#ephemeral-agent-configuration-flags) configuration flag to `false`.
{{% /notice %}}

You can use keepalives to identify unhealthy systems and network partitions, send notifications, and trigger auto-remediation, among other useful actions.
In addition, the agent maps [`keepalive-critical-timeout`][4] and [`keepalive-warning-timeout`][58] values to certain event check attributes, so you can [create time-based event filters][57] to reduce alert fatigue for agent keepalive events.

{{% notice note %}}
**NOTE**: Automatic keepalive monitoring is not supported for [proxy entities](../../observe-entities/#proxy-entities) because they cannot run a Sensu agent.
Use the [core/v2/events API](../../../api/core/events/) to send manual keepalive events for proxy entities.
{{% /notice %}}






Challenges: getting the deregister + keepalive timeouts right

Sensu keepalives are the heartbeat mechanism used to ensure that all registered agents are operational and able to reach the Sensu backend. Sensu agents publish keepalive events containing entity configuration data to the Sensu backend according to the interval specified by the keepalive-interval flag.

If a Sensu agent fails to send keepalive events over the period specified by the keepalive-critical-timeout flag, the Sensu backend creates a keepalive critical alert in the Sensu web UI. The keepalive-critical-timeout is set to 0 (disabled) by default to help ensure that it will not interfere with your keepalive-warning-timeout setting.

If a Sensu agent fails to send keepalive events over the period specified by the keepalive-warning-timeout flag, the Sensu backend creates a keepalive warning alert in the Sensu web UI. The value you specify for keepalive-warning-timeout must be lower than the value you specify for keepalive-critical-timeout.

You can use keepalives to identify unhealthy systems and network partitions, send notifications, and trigger auto-remediation, among other useful actions. In addition, the agent maps keepalive-critical-timeout and keepalive-warning-timeout values to certain event check attributes, so you can create time-based event filters to reduce alert fatigue for agent keepliave events.

there is no exact concept of an agent being offline, however, there is a concept of keepalive failure. When an agent exceeds its keepalive timeout, then the backends will generate a keepalive failure for that agent and create an event on its behalf.
When this keepalive failure occurs, and an agent is set deregister: true, then the agent entity will be deleted, and a deregistration event will be sent through the event pipeline.


## Next steps

...



[1]: 
[2]: 
[3]: 
[4]: 
[5]: 
[6]: 
[7]: 
[8]: 
[9]: 
