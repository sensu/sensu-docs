---
title: "Automatically register and deregister entities"
linkTitle: "Auto-register and Deregister Entities"
guide_title: "Automatically register and deregister entities"
type: "guide"
description: "Keep your Sensu instance up-to-date with automatic agent discovery, registration, and deregistration for infrastructure components and services."
weight: 20
version: "6.8"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.8:
    parent: observe-entities
---

Sensu uses the [publish/subscribe pattern of communication][2], which allows automated registration and deregistration of ephemeral systems.
Sensu agents automatically discover and register infrastructure components and the services running on them.
At the same time, when an agent process stops, the Sensu backend can automatically create and process a deregistration event.

Automatic registration and deregistration keeps your Sensu instance up-to-date and avoids unnecessary process load, especially in containerized environments where containers routinely come online and offline.
You'll see observability event data soon after an agent entity comes online, and you won't receive stale events or alerts for entities that no longer exist.

You can also configure [handlers][4] that take specific actions based on agent registration and deregistration, such as updating external [configuration management databases (CMDBs)][3].

## Discovery and registration

Sensu agents automatically discover and register infrastructure components and the services running on them.

{{% notice note %}}
**NOTE**: Automatic discovery is not supported for proxy entities because they cannot run a Sensu agent.
Use the [core/v2/events API](../../../api/core/events/) to send manual keepalive events for proxy entities.
{{% /notice %}}

### Registration events

When an agent comes online, it sends its first [keepalive event][5].
When a Sensu backend processes a keepalive event for an agent whose name is not already listed in the Sensu agent registry, Sensu automatically registers the agent.
The Sensu backend stores the entity registry, which you can view by running `sensuctl entity list`.

If you configure a [handler][4] named `registration`, the Sensu backend will create and process a registration event for that handler to process.
The `registration` handler must reference the name of a handler or handler set that you want to execute for every registration event.

{{% notice warning %}}
**WARNING**: Registration events are not stored in the event registry, so they are not accessible via the Sensu API.
However, all registration events are logged in the [Sensu backend log](../../observe-schedule/backend/#event-logging).
{{% /notice %}}

### Registration handler example

You can use registration event handlers to execute one-time handlers for new Sensu agents based on registration events.

For example, suppose you want to update the ServiceNow CMDB table that contains your Sensu entity inventory upon every registration event.
First, configure a handler that uses the [sensu/sensu-servicenow-handler][6] dynamic runtime asset and the `--cmdb-registration` argument:

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  name: servicenow_cmdb
spec:
  type: pipe
  command: sensu-servicenow-handler --cmdb-registration
  runtime_assets:
  - sensu/sensu-servicenow-handler:3.0.0
  env_vars:
  - SERVICENOW_URL=https://example.servicenow.com
  secrets:
  - name: SERVICENOW_USERNAME
    secret: servicenow_username
  - name: SERVICENOW_PASSWORD
    secret: servicenow_password
  timeout: 10
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "servicenow_cmdb"
  },
  "spec": {
    "type": "pipe",
    "command": "sensu-servicenow-handler --cmdb-registration",
    "runtime_assets": [
      "sensu/sensu-servicenow-handler:3.0.0"
    ],
    "env_vars": [
      "SERVICENOW_URL=https://example.servicenow.com"
    ],
    "secrets": [
      {
        "name": "SERVICENOW_USERNAME",
        "secret": "servicenow_username"
      },
      {
        "name": "SERVICENOW_PASSWORD",
        "secret": "servicenow_password"
      }
    ],
    "timeout": 10
  }
}
{{< /code >}}

{{< /language-toggle >}}

Then, create a `registration` handler that references the `servicenow_cmdb` handler:

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  name: registration
spec:
  handlers:
  - servicenow_cmdb
  type: pipe
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
      "servicenow_cmdb"
    ],
    "type": "pipe"
  }
}
{{< /code >}}

{{< /language-toggle >}}

Now the Sensu backend will execute the referenced `servicenow-cmdb` handler for every registration event.
The *referenced* handler can send registration event alerts to any service, such as [Sumo Logic][7] or [PagerDuty][8], as long as it is listed within a handler named `registration`.

{{% notice protip %}}
**PRO TIP**: Use a [handler set](../../observe-process/handlers#handler-sets) to execute multiple handlers in response to registration events.
{{% /notice %}}

## Deregistration

Just like Sensu can automatically register new agent entities when they send their first [keepalive][5], Sensu can automatically deregister agent entities when they shut down and the agent process stops.

To enable automatic deregistration, set the agent [`deregister`][9] attribute to `true`.
When the Sensu agent process stops and the agent stops sending keepalive messages, the Sensu backend can deregister the corresponding entity without any further action.

{{% notice note %}}
**NOTE**: Deregistration is supported for [agent entities](../../observe-entities/#agent-entities) that have sent at least one keepalive.
Deregistration is **not** supported for [proxy entities](../../observe-entities/#proxy-entities), which do not send keepalives, and the backend does not automatically create and process deregistration events for proxy entities.
{{% /notice %}}

### Deregistration events

As with registration events, the Sensu backend can create and process a deregistration event when a Sensu agent process stops.

When an agent exceeds its keepalive timeout setting, the backends will generate a keepalive failure for that agent and create an event on its behalf.
If you set the agent [`deregister`][9] attribute to `true`, when keepalive failure occurs, Sensu will delete the agent entity from the entity registry and send a deregistration event through the event pipeline.

To take action based on deregistration events, you must also specify a handler to use for deregistration events in the agent or backend configuration:

- To use a deregistration handler for a specific agent, set the [**agent** deregistration-handler attribute][10].
- To use a deregistration handler to process all deregistration events for all agents, set the [**backend** deregistration-handler attribute][11].

The agent `deregistration-handler` attribute overrides the backend `deregistration-handler` attribute.
In other words, if you specify both an agent and backend deregistration handler, Sensu will use only the handler specified in the agent configuration.

{{% notice note %}}
**NOTE**: If you set the agent [`deregister`](../../observe-schedule/agent/#ephemeral-agent-configuration) attribute to `true`, when a Sensu agent process stops, the Sensu backend will deregister the corresponding entity.<br><br>
Deregistration prevents and clears alerts for failing keepalives for agent entities &mdash; the backend does not distinguish between intentional shutdown and failure.
As a result, if you set the deregister flag to `true` and an agent process stops for any reason, you will not receive alerts for keepalive events in the web UI.<br><br>
If you want to receive alerts for failing keepalives, set the agent `deregister` attribute to `false`.
{{% /notice %}}

### Deregistration handler example

Just like registration events, deregistration events can trigger a one-time handler that performs an action like updating an external CMDB or ephemeral infrastructures.
In fact, you can use the [`servicenow_cmdb` handler][1] to update the ServiceNow CMDB table that contains your Sensu entity inventory, this time based on every deregistration event.

To specify `servicenow_cmdb` as the agent deregistration handler:

{{< language-toggle >}}

{{< code shell "Command line" >}}
sensu-agent start --deregistration-handler servicenow_cmdb
{{< /code >}}

{{< code shell "Configuration file" >}}
deregistration-handler: servicenow_cmdb
{{< /code >}}

{{< /language-toggle >}}


## Next steps

The [Sensu Catalog][12] includes the [Platform Discovery][13] integration, which detects the agent operating system and platform information and updates the agent's subscriptions accordingly.
This integration allows you to deploy agents with a single subscription and use the auto-discovery check to add system-based subscriptions automatically.

Follow [Create limited service accounts][14] to automatically remove AWS EC2 instances that are not in a pending or running state.


[1]: #registration-handler-example
[2]: https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
[3]: https://en.wikipedia.org/wiki/Configuration_management_database
[4]: ../../observe-process/handlers/
[5]: ../../observe-schedule/agent/#keepalive-monitoring
[6]: https://bonsai.sensu.io/assets/sensu/sensu-servicenow-handler
[7]: ../../observe-process/send-data-sumo-logic/
[8]: ../../observe-process/send-pagerduty-alerts/
[9]: ../../observe-schedule/agent/#ephemeral-agent-configuration
[10]: ../../observe-schedule/agent/#agent-deregistration-handler-attribute
[11]: ../../observe-schedule/backend/#deregistration-handler-attribute
[12]: ../../../web-ui/sensu-catalog/
[13]: https://github.com/sensu/catalog/tree/main/integrations/sensu/platform-discovery
[14]: ../../../operations/control-access/create-limited-service-accounts/
