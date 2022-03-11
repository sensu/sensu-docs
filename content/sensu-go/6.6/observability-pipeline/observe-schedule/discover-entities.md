---
title: "Automatically discover entities"
linkTitle: "Automatically Discover Entities"
guide_title: "Automatically discover entities"
type: "guide"
description: "PLACEHOLDER."
weight: 38
version: "6.6"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.6:
    parent: observe-schedule
---

Sensu uses the [publish/subscribe pattern of communication][1], which allows automated registration and deregistration of ephemeral systems.
Sensu agents automatically discover and register infrastructure components and the services running on them and publish [keepalive events][2].
At the same time, when an agent process stops, the Sensu backend can automatically create and process a deregistration event.

Automatic registration and deregistration helps keep your Sensu instance up-to-date.
You'll see observability event data soon after an agent entity comes online, and you won't receive stale events or alerts for entities that no longer exist.
You can also configure [pipelines][8] that take specific actions based on entity registration and deregistration.

This guide explains how to automatically discover agent entities, register, and deregister agent entities.

{{% notice note %}}
**NOTE**: Automatic discovery is not supported for proxy entities because they cannot run a Sensu agent.
Use the [core/v2/events API](../../../api/core/events/) to send manual keepalive events for proxy entities.
{{% /notice %}}

To follow this guide, you’ll need to [install][3] the Sensu backend, have at least one Sensu agent running, and install and configure sensuctl.

## Registration

When an agent comes online, it sends its first keepalive event.
Sensu automatically registers the agent when a Sensu backend processes the keepalive event for an agent whose name is not already listed in the Sensu agent registry.

Create a [handler][4] named `registration` to receive an alert for every registration event that any agent sends.
The handler can send registration alerts to any service, such as [Sumo Logic][5], [PagerDuty][6], or [Slack][7], as long as the handler itself is named `registration`.

You can also use registration events to execute one-time handlers for new Sensu agents. For example, you can use registration event handlers to update external configuration management databases (CMDBs) such as ServiceNow.

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

Challenges: getting the deregister + keepalive timeouts right

Sensu keepalives are the heartbeat mechanism used to ensure that all registered agents are operational and able to reach the Sensu backend. Sensu agents publish keepalive events containing entity configuration data to the Sensu backend according to the interval specified by the keepalive-interval flag.

If a Sensu agent fails to send keepalive events over the period specified by the keepalive-critical-timeout flag, the Sensu backend creates a keepalive critical alert in the Sensu web UI. The keepalive-critical-timeout is set to 0 (disabled) by default to help ensure that it will not interfere with your keepalive-warning-timeout setting.

If a Sensu agent fails to send keepalive events over the period specified by the keepalive-warning-timeout flag, the Sensu backend creates a keepalive warning alert in the Sensu web UI. The value you specify for keepalive-warning-timeout must be lower than the value you specify for keepalive-critical-timeout.

You can use keepalives to identify unhealthy systems and network partitions, send notifications, and trigger auto-remediation, among other useful actions. In addition, the agent maps keepalive-critical-timeout and keepalive-warning-timeout values to certain event check attributes, so you can create time-based event filters to reduce alert fatigue for agent keepliave events.

there is no exact concept of an agent being offline, however, there is a concept of keepalive failure. When an agent exceeds its keepalive timeout, then the backends will generate a keepalive failure for that agent and create an event on its behalf.
When this keepalive failure occurs, and an agent is set deregister: true, then the agent entity will be deleted, and a deregistration event will be sent through the event pipeline.


## Next steps

...



[1]: https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
[2]: ../../agent/#keepalive-monitoring
[3]: ../../../operations/deploy-sensu/install-sensu/
[4]: ../../observe-process/handlers/
[5]: ../../observe-process/send-data-sumo-logic/
[6]: ../../observe-process/send-pagerduty-alerts/
[7]: ../../observe-process/send-slack-alerts/
[8]: ../../observe-process/pipelines/
[9]: ../backend/#deregistration-handler-attribute
[10]: ../agent/#agent-deregistration-handler-attribute
[11]: ../agent/#ephemeral-agent-configuration-flags
