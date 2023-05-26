---
title: "Route alerts with event filters"
linkTitle: "Route Alerts"
guide_title: "Route alerts with event filters"
type: "guide"
description: "Alert the right people using their preferred contact method with Sensu's contact routing and reduce mean time to response and recovery."
weight: 80
version: "6.9"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.9:
    parent: observe-filter
---

Every alert has an ideal first responder: a team or person who knows how to triage and address the issue.
Sensu contact routing lets you alert the right people using their preferred contact methods and reduce mean time to response and recovery.

In this guide, you'll set up alerts for two teams (dev and ops) with separate Slack channels.
Each team wants to be alerted only for the things they care about, using their team's Slack channel.
There's also a fallback option for alerts that should not be routed to either the dev or ops team.
To achieve this, you'll use a [pipeline][16] resource with three workflows, one for each contact option.

Routing alerts requires three types of Sensu resources:

- **Handlers** to store contact preferences for the dev and ops teams, plus a fallback option
- **Event filters** to match contact labels to the right handler
- A **pipeline** to organize the event filters and handlers into workflows that route alerts to the right contacts

Here's a quick overview of the configuration to set up contact routing with a pipeline.
Two of the check definitions include a `contacts` label, which allows the pipeline to route alerts to the correct Slack channel based each workflow's event filter and handler.

{{< figure src="/images/go/route_alerts/contact_routing_pipeline.png" alt="Diagram that shows events generated with and without labels, matched to the appropriate handler using a contact filter and routed to the appropriate Slack channel" link="/images/go/route_alerts/contact_routing_pipeline.png" target="_blank" >}}
<!-- Source for image is contact_routing_pipeline at https://lucid.app/lucidchart/cd3a6110-aa74-48cc-8c74-64d542ba97bc/edit?viewport_loc=-229%2C-28%2C2219%2C1117%2C0_0&invitationId=inv_de0cf345-dd7d-40dd-8724-2f9592cf45ec# -->

## Requirements

To follow this guide, install the Sensu [backend][1], make sure at least one Sensu [agent][23] is running, and configure [sensuctl][22] to connect to the backend as the [`admin` user][24].

You will also need [cURL][5], a [Slack webhook URL][6], and three different Slack channels to receive test alerts (one for each team).

The examples in this guide rely on the `check_cpu` check from [Monitor server resources with checks][27].
Before you begin, follow the instructions to [add the `sensu/check-cpu-usage`][28] dynamic runtime asset and the [`check_cpu`][29] check.

## Configure a Sensu entity

Every Sensu agent has a defined set of subscriptions that determine which checks the agent will execute.
For an agent to execute a specific check, you must specify the same subscription in the agent configuration and the check definition.

This guide uses an example check that includes the subscription `system`.
Use sensuctl to add a `system` subscription to one of your entities.

Before you run the following code, replace `<ENTITY_NAME>` with the name of the entity on your system.

{{% notice note %}}
**NOTE**: To find an entity's name, run `sensuctl entity list`.
The `ID` is the name of the entity.
{{% /notice %}}

{{< code shell >}}
sensuctl entity update <ENTITY_NAME>
{{< /code >}}

- For `Entity Class`, press enter.
- For `Subscriptions`, type `system` and press enter.

Run this command to confirm both Sensu services are running:

{{< code shell >}}
systemctl status sensu-backend && systemctl status sensu-agent
{{< /code >}}

The response should indicate `active (running)` for both the Sensu backend and agent.

## Register dynamic runtime assets

Contact routing is powered by the sensu/sensu-go-has-contact-filter dynamic runtime asset.
To add the asset to Sensu, use sensuctl asset add:

{{< code shell >}}
sensuctl asset add sensu/sensu-go-has-contact-filter:0.3.0 -r contact-filter
{{< /code >}}

The response will indicate that the asset was added:

{{< code text >}}
fetching bonsai asset: sensu/sensu-go-has-contact-filter:0.3.0
added asset: sensu/sensu-go-has-contact-filter:0.3.0

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["contact-filter"].
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the asset: `contact-filter`.

Next, add the sensu/sensu-slack-handler dynamic runtime asset to Sensu with sensuctl:

{{< code shell >}}
sensuctl asset add sensu/sensu-slack-handler:1.5.0 -r sensu-slack-handler
{{< /code >}}

The response will confirm that the asset was added:

{{< code text >}}
fetching bonsai asset: sensu/sensu-slack-handler:1.5.0 -r sensu-slack-handler
added asset: sensu/sensu-slack-handler:1.5.0

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["sensu-slack-handler"].
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the dynamic runtime asset: `sensu-slack-handler`.

Run `sensuctl asset list` to confirm that the dynamic runtime assets are ready to use.
The response will confirm the available assets:

{{< code text >}}
         Name                                               URL                                        Hash    
────────────────────── ───────────────────────────────────────────────────────────────────────────── ──────────
  contact-filter        //assets.bonsai.sensu.io/.../sensu-go-has-contact-filter_0.3.0.tar.gz         d35c6c4  
  sensu-slack-handler   //assets.bonsai.sensu.io/.../sensu-slack-handler_1.0.3_windows_amd64.tar.gz   53359fa  
  sensu-slack-handler   //assets.bonsai.sensu.io/.../sensu-slack-handler_1.0.3_darwin_386.tar.gz      e2d7d0d  
  sensu-slack-handler   //assets.bonsai.sensu.io/.../sensu-slack-handler_1.0.3_linux_armv7.tar.gz     362fe51  
  sensu-slack-handler   //assets.bonsai.sensu.io/.../sensu-slack-handler_1.0.3_linux_arm64.tar.gz     b492ae2  
  sensu-slack-handler   //assets.bonsai.sensu.io/.../sensu-slack-handler_1.0.3_darwin_amd64.tar.gz    88bbdca  
  sensu-slack-handler   //assets.bonsai.sensu.io/.../sensu-slack-handler_1.0.3_linux_386.tar.gz       d9040ae  
  sensu-slack-handler   //assets.bonsai.sensu.io/.../sensu-slack-handler_1.0.3_linux_amd64.tar.gz     6872086  
{{< /code >}}

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
{{% /notice %}}

## Create contact filters

The sensu/sensu-go-has-contact-filter dynamic runtime asset supports two functions:

- `has_contact`, which takes the Sensu event and the contact name as arguments
- `no_contact`, which is available as a fallback in the absence of contact labels and takes only the event as an argument

You'll use these functions to create event filters that represent the three actions that the Sensu Slack handler can take on an event: contact the ops team, contact the dev team, and contact the fallback option.

| event filter name | expression | description
| --- | --- | --- |
| `contact_ops` | `has_contact(event, "ops")` | Allow events with the entity or check label `contacts: ops`
| `contact_dev` | `has_contact(event, "dev")` | Allow events with the entity or check label `contacts: dev`
| `contact_fallback` | `no_contacts(event)` | Allow events without an entity or check `contacts` label

Use sensuctl to create the three event filters:

{{< language-toggle >}}

{{< code shell "YML" >}}
echo '---
type: EventFilter
api_version: core/v2
metadata:
  name: contact_ops
spec:
  action: allow
  runtime_assets:
    - contact-filter
  expressions:
    - has_contact(event, "ops")
---
type: EventFilter
api_version: core/v2
metadata:
  name: contact_dev
spec:
  action: allow
  runtime_assets:
    - contact-filter
  expressions:
    - has_contact(event, "dev")
---
type: EventFilter
api_version: core/v2
metadata:
  name: contact_fallback
spec:
  action: allow
  runtime_assets:
    - contact-filter
  expressions:
    - no_contacts(event)' | sensuctl create
{{< /code >}}

{{< code shell "JSON" >}}
echo '{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "contact_ops"
  },
  "spec": {
    "action": "allow",
    "runtime_assets": [
      "contact-filter"
    ],
    "expressions": [
      "has_contact(event, \"ops\")"
    ]
  }
}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "contact_dev"
  },
  "spec": {
    "action": "allow",
    "runtime_assets": [
      "contact-filter"
    ],
    "expressions": [
      "has_contact(event, \"dev\")"
    ]
  }
}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "contact_fallback"
  },
  "spec": {
    "action": "allow",
    "runtime_assets": [
      "contact-filter"
    ],
    "expressions": [
      "no_contacts(event)"
    ]
  }
}' | sensuctl create
{{< /code >}}

{{< /language-toggle >}}

Use sensuctl to confirm that the event filters were added:

{{< code shell >}}
sensuctl filter list
{{< /code >}}

The response should list the new `contact_ops`, `contact_dev`, and `contact_fallback` event filters:

{{< code text >}}
        Name         Action           Expressions          
 ────────────────── ──────── ───────────────────────────── 
  contact_dev        allow    (has_contact(event, "dev"))  
  contact_fallback   allow    (no_contacts(event))         
  contact_ops        allow    (has_contact(event, "ops"))  
{{< /code >}}

## Create a handler for each contact

With your contact filters in place, you can create a handler for each contact: ops, dev, and fallback.
In each handler definition, you will specify:

- A unique name: `ops_handler`, `dev_handler`, or `fallback_handler`
- A customized command with the contact's preferred Slack channel
- An environment variable that contains your Slack webhook URL
- The `sensu-slack-handler` dynamic runtime asset

Before you run the following code to create the handlers with sensuctl, make these changes:

- Replace `<ALERT_OPS>`, `<ALERT_DEV>`, and `<ALERT_ALL>` with the names of the channels you want to use to receive alerts in your Slack instance.
- Replace `<SLACK_WEBHOOK_URL>` with your Slack webhook URL.

After you update the code to use your preferred Slack channels and webhook URL, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
echo '---
type: Handler
api_version: core/v2
metadata:
  name: ops_handler
spec:
  command: sensu-slack-handler --channel "#<ALERT_OPS>"
  env_vars:
    - SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxxxxxxxx
  handlers: null
  runtime_assets:
    - sensu-slack-handler
  secrets: null
  timeout: 0
  type: pipe
---
type: Handler
api_version: core/v2
metadata:
  name: dev_handler
spec:
  command: sensu-slack-handler --channel "#<ALERT_DEV>"
  env_vars:
    - SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxxxxxxxx
  handlers: null
  runtime_assets:
    - sensu-slack-handler
  secrets: null
  timeout: 0
  type: pipe
---
type: Handler
api_version: core/v2
metadata:
  name: fallback_handler
spec:
  command: sensu-slack-handler --channel "#<ALERT_ALL>"
  env_vars:
    - SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxxxxxxxx
  handlers: null
  runtime_assets:
    - sensu-slack-handler
  secrets: null
  timeout: 0
  type: pipe' | sensuctl create
{{< /code >}}

{{< code shell "JSON" >}}
echo '{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "ops_handler"
  },
  "spec": {
    "command": "sensu-slack-handler --channel \"#<ALERT_OPS>\"",
    "env_vars": [
      "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxxxxxxxx"
    ],
    "handlers": null,
    "runtime_assets": [
      "sensu-slack-handler"
    ],
    "secrets": null,
    "timeout": 0,
    "type": "pipe"
  }
}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "dev_handler"
  },
  "spec": {
    "command": "sensu-slack-handler --channel \"#<ALERT_DEV>\"",
    "env_vars": [
      "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxxxxxxxx"
    ],
    "handlers": null,
    "runtime_assets": [
      "sensu-slack-handler"
    ],
    "secrets": null,
    "timeout": 0,
    "type": "pipe"
  }
}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "fallback_handler"
  },
  "spec": {
    "command": "sensu-slack-handler --channel \"#<ALERT_ALL>\"",
    "env_vars": [
      "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxxxxxxxx"
    ],
    "handlers": null,
    "runtime_assets": [
      "sensu-slack-handler"
    ],
    "secrets": null,
    "timeout": 0,
    "type": "pipe"
  }
}' | sensuctl create
{{< /code >}}

{{< /language-toggle >}}

Use sensuctl to confirm that the handlers were added:

{{< code shell >}}
sensuctl handler list
{{< /code >}}

The response should list the new `dev_handler`, `ops_handler`, and `fallback_handler` handlers:

{{< code text >}}
        Name         Type   Timeout   Filters   Mutator                       Execute                                                   Environment Variables                            Assets         
─────────────────── ────── ───────── ───────── ───────── ───────────────────────────────────────────────────────── ───────────────────────────────────────────────────────────── ──────────────────────
  dev_handler        pipe         0                       RUN:  sensu-slack-handler --channel "#<ALERT_DEV>"        SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxxxxxxxx   sensu-slack-handler  
  fallback_handler   pipe         0                       RUN:  sensu-slack-handler --channel "#<ALERT_ALL>"   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxxxxxxxx   sensu-slack-handler  
  ops_handler        pipe         0                       RUN:  sensu-slack-handler --channel "#<ALERT_OPS>"        SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxxxxxxxx   sensu-slack-handler  
{{< /code >}}

## Create a pipeline

Create a pipeline with a three workflows: one for each contact group.

Each workflow includes the contact event filter and the corresponding handler for one contact group.
All of the workflows also include the built-in is_incident event filter to reduce noise.

{{< language-toggle >}}

{{< code shell "YML" >}}
echo '---
type: Pipeline
api_version: core/v2
metadata:
  name: slack_contact_routing
spec:
  workflows:
  - name: dev
    filters:
    - name: contact_dev
      type: EventFilter
      api_version: core/v2
    - name: is_incident
      type: EventFilter
      api_version: core/v2
    handler:
      name: dev_handler
      type: Handler
      api_version: core/v2
  - name: ops
    filters:
    - name: contact_ops
      type: EventFilter
      api_version: core/v2
    - name: is_incident
      type: EventFilter
      api_version: core/v2
    handler:
      name: ops_handler
      type: Handler
      api_version: core/v2
  - name: fallback
    filters:
    - name: contact_fallback
      type: EventFilter
      api_version: core/v2
    - name: is_incident
      type: EventFilter
      api_version: core/v2
    handler:
      name: fallback_handler
      type: Handler
      api_version: core/v2' | sensuctl create
{{< /code >}}

{{< code shell "JSON" >}}
echo '{
  "type": "Pipeline",
  "api_version": "core/v2",
  "metadata": {
    "name": "slack_contact_routing"
  },
  "spec": {
    "workflows": [
      {
        "name": "dev",
        "filters": [
          {
            "name": "contact_dev",
            "type": "EventFilter",
            "api_version": "core/v2"
          },
          {
            "name": "is_incident",
            "type": "EventFilter",
            "api_version": "core/v2"
          }
        ],
        "handler": {
          "name": "dev_handler",
          "type": "Handler",
          "api_version": "core/v2"
        }
      },
      {
        "name": "ops",
        "filters": [
          {
            "name": "contact_ops",
            "type": "EventFilter",
            "api_version": "core/v2"
          },
          {
            "name": "is_incident",
            "type": "EventFilter",
            "api_version": "core/v2"
          }
        ],
        "handler": {
          "name": "ops_handler",
          "type": "Handler",
          "api_version": "core/v2"
        }
      },
      {
        "name": "fallback",
        "filters": [
          {
            "name": "contact_fallback",
            "type": "EventFilter",
            "api_version": "core/v2"
          },
          {
            "name": "is_incident",
            "type": "EventFilter",
            "api_version": "core/v2"
          }
        ],
        "handler": {
          "name": "fallback_handler",
          "type": "Handler",
          "api_version": "core/v2"
        }
      }
    ]
  }
}' | sensuctl create
{{< /code >}}

{{< /language-toggle >}}

With your pipeline in place, you can send ad hoc events to test your configuration and make sure the right contact groups receive the right alerts in Slack.

## Send events to test your configuration

Use the agent API to create ad hoc events and send them to your Slack pipeline.

First, create an event without a `contacts` label.
You may need to modify the URL with your Sensu agent address.

{{< code shell "JSON" >}}
curl -X POST \
-H 'Content-Type: application/json' \
-d '{
  "check": {
    "metadata": {
      "name": "example-check-fallback"
    },
    "status": 1,
    "output": "You should receive this example event in the Slack channel specified by your fallback handler."
  },
  "pipelines": [
    {
      "type": "Pipeline",
      "api_version": "core/v2",
      "name": "contact_routing"
    }
  ]
}' \
http://127.0.0.1:3031/events
{{< /code >}}

Since this event doesn't include a `contacts` label, you should also receive an alert in the Slack channel specified in your `fallback_handler` handler.
Behind the scenes, Sensu uses the `contact_fallback` filter to match the event to the `fallback_handler` handler.

Now, create an event with a `contacts` label:

{{< code shell "JSON" >}}
curl -X POST \
-H 'Content-Type: application/json' \
-d '{
  "check": {
    "metadata": {
      "name": "example-check-dev",
      "labels": {
        "contacts": "dev"
      }
    },
    "status": 1,
    "output": "You should receive this example event in the Slack channel specified by your dev handler."
  },
  "pipelines": [
    {
      "type": "Pipeline",
      "api_version": "core/v2",
      "name": "contact_routing"
    }
  ]
}' \
http://127.0.0.1:3031/events
{{< /code >}}

Because this event contains the `contacts: dev` label, you should receive an alert in the Slack channel specified by the `dev_handler` handler.

Resolve the events by sending the same API requests with `status` set to `0`.

## Manage contact labels in checks and entities

To assign a check's alerts to a contact, you can add the `contacts` labels to checks or entities.

### Route contacts with checks

To test contact routing with check-generated events, update the `check_cpu` check to include the `ops` and `dev` contacts and the `slack_contact_routing` pipeline.

Use sensuctl to open the check in a text editor:

{{< code shell >}}
sensuctl edit check check_cpu
{{< /code >}}

Edit the check metadata to add the following labels:

{{< language-toggle >}}

{{< code yml >}}
labels:
  contacts: dev, ops
{{< /code >}}

{{< code json >}}
{
  "labels": {
    "contacts": "dev, ops"
  }
}
{{< /code >}}

{{< /language-toggle >}}

Update the pipelines array to add `slack_contact_routing`:

{{< language-toggle >}}

{{< code yml >}}
pipelines:
  - type: Pipeline
    api_version: core/v2
    name: slack_contact_routing
{{< /code >}}

{{< code json >}}
{
  "pipelines": {
    "type": "Pipeline",
    "api_version": "core/v2",
    "name": "slack_contact_routing"
  }
}
{{< /code >}}

{{< /language-toggle >}}

Save and close the updated check definition.
A response will confirm the check was updated.
For example:

{{< code text >}}
Updated /api/core/v2/namespaces/default/checks/check_cpu
{{< /code >}}

To view the updated resource definition for `check_cpu` and confirm that it includes the `contacts` labels and `slack_contact_routing` pipeline, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl check info check_cpu --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl check info check_cpu --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The sensuctl response will include the updated `check_cpu` resource definition in the specified format:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  created_by: admin
  labels:
    contacts: dev, ops
  name: check_cpu
  namespace: default
spec:
  check_hooks: null
  command: check-cpu-usage -w 75 -c 90
  env_vars: null
  handlers: []
  high_flap_threshold: 0
  interval: 60
  low_flap_threshold: 0
  output_metric_format: ""
  output_metric_handlers: null
  pipelines:
  - api_version: core/v2
    name: slack_contact_routing
    type: Pipeline
  proxy_entity_name: ""
  publish: true
  round_robin: false
  runtime_assets:
  - check-cpu-usage
  secrets: null
  stdin: false
  subdue: null
  subscriptions:
  - system
  timeout: 0
  ttl: 0
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "check_cpu",
    "namespace": "default",
    "labels": {
      "contacts": "dev, ops"
    },
    "created_by": "admin"
  },
  "spec": {
    "check_hooks": null,
    "command": "check-cpu-usage -w 75 -c 90",
    "env_vars": null,
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 60,
    "low_flap_threshold": 0,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "pipelines": [
      {
        "api_version": "core/v2",
        "name": "slack_contact_routing",
        "type": "Pipeline"
      }
    ],
    "proxy_entity_name": "",
    "publish": true,
    "round_robin": false,
    "runtime_assets": [
      "check-cpu-usage"
    ],
    "secrets": null,
    "stdin": false,
    "subdue": null,
    "subscriptions": [
      "system"
    ],
    "timeout": 0,
    "ttl": 0
  }
}
{{< /code >}}

{{< /language-toggle >}}

Now when the `check_cpu` check generates an event, Sensu will filter the event according to the `contact_dev` and `contact_ops` event filters and send alerts to the #dev and #ops Slack channels:

{{< figure src="/images/go/route_alerts/contact_routing_dev_ops_teams.png" alt="Diagram that shows an event generated with a check label for the dev and ops teams, matched to the dev team and ops team handlers using contact filters, and routed to the Slack channels for dev and ops" link="/images/go/route_alerts/contact_routing_dev_ops_teams.png" target="_blank" >}}
<!-- Source for image is contact_routing_pipeline_2 at https://lucid.app/lucidchart/fa215a7d-f77e-45e7-a3c3-b6803b15bcd8/edit?viewport_loc=-9%2C54%2C1777%2C895%2C0_0&invitationId=inv_b74be97a-17a5-4e4d-b688-d1b8387fc4c8# -->

### Entities

You can specify contacts in entity labels instead of in check labels.
The check definition should still include the pipeline.

If contact labels are present in both the check and entity, the check contacts override the entity contacts.
In this example, the `dev` label in the check configuration overrides the `ops` label in the agent definition, resulting in an alert sent to #dev but not to #ops or #fallback:

{{< figure src="/images/go/route_alerts/contact_routing_label_override.png" alt="Diagram that shows how check labels override entity labels when both are present in an event" link="/images/go/route_alerts/contact_routing_label_override.png" target="_blank" >}}
<!-- Source for image is contact_routing_pipeline_3 at https://lucid.app/lucidchart/f8fc33b7-f9b3-45cc-bae8-444822f7e8cb/edit?viewport_loc=-349%2C-45%2C2219%2C1117%2C0_0&invitationId=inv_e623f4c9-d485-4a59-a1d6-fa1e9575b905# -->

## What's next

Now that you've set up contact routing for two example teams, you can create additional filters, handlers, and labels to represent your team's contacts.
Learn how to use Sensu to [Reduce alert fatigue][11].

Read more about the Sensu features you used in this guide:

- [Subscriptions][21]
- [sensuctl][7]
- [Dynamic runtime assets][26], [Bonsai][25], [sensu/sensu-go-has-contact-filter][12], and [sensu/sensu-slack-handler][8]
- [is_incident event filter][20]
- [Agent API][13]
- [Entity labels][10]

Save the event filter, handler, and check definitions you created in this guide to YAML or JSON files to start developing a [monitoring as code][15] repository.
Storing your Sensu configurations the same way you would store code means they are portable and repeatable.
Monitoring as code makes it possible to reproduce an environment's configuration and move to a more robust deployment without losing what you’ve started.


[1]: ../../../operations/deploy-sensu/install-sensu/#install-the-sensu-backend
[5]: https://curl.haxx.se/
[6]: https://api.slack.com/incoming-webhooks
[7]: ../../../sensuctl/
[8]: https://bonsai.sensu.io/assets/sensu/sensu-slack-handler
[9]: ../../observe-schedule/monitor-server-resources/
[10]: ../../observe-entities/entities/#manage-entity-labels
[11]: ../reduce-alert-fatigue/
[12]: https://bonsai.sensu.io/assets/sensu/sensu-go-has-contact-filter
[13]: ../../observe-schedule/agent/#create-observability-events-using-the-agent-api
[14]: ../../../sensuctl/sensuctl-bonsai/#install-dynamic-runtime-asset-definitions
[15]: ../../../operations/monitoring-as-code/
[16]: ../../observe-process/pipelines/
[17]: #configure-contact-routing-with-a-handler-set
[18]: #1-register-dynamic-runtime-assets
[19]: #2-create-contact-filters
[20]: ../filters/#built-in-filter-is_incident
[21]: ../../observe-schedule/subscriptions/
[22]: ../../../operations/deploy-sensu/install-sensu/#install-sensuctl
[23]: ../../../operations/deploy-sensu/install-sensu/#install-sensu-agents
[24]: ../../../operations/control-access/rbac/#default-users
[25]: https://bonsai.sensu.io/
[26]: ../../../plugins/assets/
[27]: ../../observe-schedule/monitor-server-resources/
[28]: ../../observe-schedule/monitor-server-resources/#register-the-sensucheck-cpu-usage-asset
[29]: ../../observe-schedule/monitor-server-resources/#create-a-check-to-monitor-a-server
