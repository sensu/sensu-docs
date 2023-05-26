---
title: "Route alerts with event filters"
linkTitle: "Route Alerts"
guide_title: "Route alerts with event filters"
type: "guide"
description: "Alert the right people using their preferred contact method with Sensu's contact routing and reduce mean time to response and recovery."
weight: 80
version: "6.4"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.4:
    parent: observe-filter
---

Every alert has an ideal first responder: a team or person who knows how to triage and address the issue.
Sensu contact routing lets you alert the right people using their preferred contact methods, reducing mean time to response and recovery.

In this guide, you'll set up alerts for two teams (ops and dev) with separate Slack channels.
Assume each team wants to be alerted only for the things they care about, using their team's Slack channel.
To achieve this, you'll create two types of Sensu resources:

- **Event handlers** to store contact preferences for the ops team, the dev team, and a fallback option
- **Event filters** to match contact labels to the right handler

Here's a quick overview of the configuration to set up contact routing.
The check definition includes the `contacts: dev` label, which will result in alerts to the dev team but not to the ops team or the fallback option.

{{< figure src="/images/archived_version_images/contact_routing_old_dev_team.png" alt="Diagram that shows an event generated with a check label, matched to the dev team's handler using a contact filter, and routed to the dev team's Slack channel" link="/images/archived_version_images/contact_routing_old_dev_team.png" target="_blank" >}}
<!-- Diagram source: https://www.lucidchart.com/documents/edit/f66c930f-295d-458c-bde3-4e55edd9b2e8/0 -->

To follow this guide, you’ll need to [install][1] the Sensu backend, have at least one Sensu agent running, and install and configure sensuctl.
You will also need [cURL][5] and a [Slack webhook URL][6] and three different Slack channels to receive test alerts (one for each team).

## Configure a Sensu entity

Every Sensu agent has a defined set of [subscriptions][21] that determine which checks the agent will execute.
For an agent to execute a specific check, you must specify the same subscription in the agent configuration and the check definition.

This guide uses an example check that includes the subscription `system`.
Use [sensuctl][7] to add a `system` subscription to one of your entities.

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

## Configure contact routing

### 1. Register the sensu/sensu-go-has-contact-filter dynamic runtime asset

Contact routing is powered by the [sensu/sensu-go-has-contact-filter][12] dynamic runtime asset.
To add the has-contact dynamic runtime asset to Sensu, use [`sensuctl asset add`][14]:

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

You can also download the latest dynamic runtime asset definition from [Bonsai][12].

Run `sensuctl asset list --format yaml` to confirm that the dynamic runtime asset is ready to use.

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
Read the [asset reference](../../../plugins/assets#dynamic-runtime-asset-builds) for more information about dynamic runtime asset builds.
{{% /notice %}}

### 2. Create contact filters

The [Bonsai][12] documentation explains that the sensu/sensu-go-has-contact-filter dynamic runtime asset supports two functions:

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

You can also save these event filter resource definitions to a file named `filters.yml` or `filters.json` in your Sensu installation.
When you're ready to manage your observability configurations the same way you do any other code, your `filters.yml` or `filters.json` file can become a part of your [monitoring as code][15] repository.

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

### 3. Create a handler for each contact

With your contact filters in place, you can create a handler for each contact: ops, dev, and fallback.
If you haven't already, add the [sensu/sensu-slack-handler][8] dynamic runtime asset to Sensu with sensuctl:

{{< code shell >}}
sensuctl asset add sensu/sensu-slack-handler:1.5.0 -r sensu-slack-handler
{{< /code >}}

The response will confirm that the asset was added:

{{< code text >}}
fetching bonsai asset: sensu/sensu-slack-handler:1.5.0
added asset: sensu/sensu-slack-handler:1.5.0

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["sensu-slack-handler"].
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the dynamic runtime asset: `sensu-slack-handler`.

In each handler definition, you will specify:

- A unique name: `slack_ops`, `slack_dev`, or `slack_fallback`
- A customized command with the contact's preferred Slack channel
- The contact filter
- The built-in `is_incident` and `not_silenced` filters to reduce noise and enable silences
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
  name: slack_ops
spec:
  command: sensu-slack-handler --channel "#<ALERT_OPS>"
  env_vars:
  - SLACK_WEBHOOK_URL=<SLACK_WEBHOOK_URL>
  filters:
  - is_incident
  - not_silenced
  - contact_ops
  runtime_assets:
  - sensu-slack-handler
  type: pipe
---
type: Handler
api_version: core/v2
metadata:
  name: slack_dev
spec:
  command: sensu-slack-handler --channel "#<ALERT_DEV>"
  env_vars:
  - SLACK_WEBHOOK_URL=<SLACK_WEBHOOK_URL>
  filters:
  - is_incident
  - not_silenced
  - contact_dev
  runtime_assets:
  - sensu-slack-handler
  type: pipe
---
type: Handler
api_version: core/v2
metadata:
  name: slack_fallback
spec:
  command: sensu-slack-handler --channel "#<ALERT_ALL>"
  env_vars:
  - SLACK_WEBHOOK_URL=<SLACK_WEBHOOK_URL>
  filters:
  - is_incident
  - not_silenced
  - contact_fallback
  runtime_assets:
  - sensu-slack-handler
  type: pipe' | sensuctl create
{{< /code >}}

{{< code text "JSON" >}}
echo '{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "slack_ops"
  },
  "spec": {
    "command": "sensu-slack-handler --channel "#<ALERT_OPS>",
    "env_vars": [
      "SLACK_WEBHOOK_URL=<SLACK_WEBHOOK_URL>
    ],
    "filters": [
      "is_incident",
      "not_silenced",
      "contact_ops"
    ],
    "runtime_assets": [
      "sensu-slack-handler"
    ],
    "type": "pipe"
  }
}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "slack_dev"
  },
  "spec": {
    "command": "sensu-slack-handler --channel "#<ALERT_DEV>",
    "env_vars": [
      "SLACK_WEBHOOK_URL=<SLACK_WEBHOOK_URL>
    ],
    "filters": [
      "is_incident",
      "not_silenced",
      "contact_dev"
    ],
    "runtime_assets": [
      "sensu-slack-handler"
    ],
    "type": "pipe"
  }
}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "slack_fallback"
  },
  "spec": {
    "command": "sensu-slack-handler --channel "#<ALERT_ALL>",
    "env_vars": [
      "SLACK_WEBHOOK_URL=<SLACK_WEBHOOK_URL>
    ],
    "filters": [
      "is_incident",
      "not_silenced",
      "contact_fallback"
    ],
    "runtime_assets": [
      "sensu-slack-handler"
    ],
    "type": "pipe"
  }
}' | sensuctl create
{{< /code >}}

{{< /language-toggle >}}

Just like the event filters, you can save these handlers to a YAML or JSON file to create a handlers configuration file if you're implementing [monitoring as code][15].

Use sensuctl to confirm that the handlers were added:

{{< code shell >}}
sensuctl handler list
{{< /code >}}

The response should list the new `slack_ops`, `slack_dev`, and `slack_fallback` handlers:

{{< code shell >}}
       Name        Type   Timeout                    Filters                    Mutator                        Execute                                                Environment Variables                                    Assets         
 ──────────────── ────── ───────── ─────────────────────────────────────────── ───────── ─────────────────────────────────────────────────── ────────────────────────────────────────────────────────────────────────── ───────────────────── 
  slack_dev        pipe         0   is_incident,not_silenced,contact_dev                  RUN:  sensu-slack-handler --channel "#<ALERT_DEV>"    SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX      sensu-slack-handler  
  slack_fallback   pipe         0   is_incident,not_silenced,contact_fallback             RUN:  sensu-slack-handler --channel "#<ALERT_ALL>"    SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX      sensu-slack-handler  
  slack_ops        pipe         0   is_incident,not_silenced,contact_ops                  RUN:  sensu-slack-handler --channel "#<ALERT_OPS>"    SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX      sensu-slack-handler
{{< /code >}}

### 4. Create a handler set

To centralize contact management and simplify configuration, create a handler set that combines your contact-specific handlers under a single handler name, `slack`:

{{< language-toggle >}}

{{< code text "YML" >}}
echo '---
type: Handler
api_version: core/v2
metadata:
  name: slack
spec:
  handlers:
  - slack_ops
  - slack_dev
  - slack_fallback
  type: set' | sensuctl create
{{< /code >}}

{{< code text "JSON" >}}
echo '{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "slack"
  },
  "spec": {
    "handlers": [
      "slack_ops",
      "slack_dev",
      "slack_fallback"
    ],
    "type": "set"
  }
}' | sensuctl create
{{< /code >}}

{{< /language-toggle >}}

Run `sensuctl handler list` again.
The updated output should include the `slack` handler set:

{{< code shell >}}
       Name        Type   Timeout                    Filters                    Mutator                       Execute                                                Environment Variables                                  Assets         
 ──────────────── ────── ───────── ─────────────────────────────────────────── ───────── ────────────────────────────────────────────────── ──────────────────────────────────────────────────────────────────────── ───────────────────── 
  slack            set          0                                                         CALL: slack_ops,slack_dev,slack_fallback                                                                                                         
  slack_dev        pipe         0   is_incident,not_silenced,contact_dev                  RUN:  sensu-slack-handler --channel "#<ALERT_DEV>"   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX   sensu-slack-handler  
  slack_fallback   pipe         0   is_incident,not_silenced,contact_fallback             RUN:  sensu-slack-handler --channel "#<ALERT_ALL>"   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX   sensu-slack-handler  
  slack_ops        pipe         0   is_incident,not_silenced,contact_ops                  RUN:  sensu-slack-handler --channel "#<ALERT_OPS>"   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX   sensu-slack-handler  
{{< /code >}}

Congratulations!
Your Sensu contact routing is set up.
Next, test your contact filters to make sure they work.

## Test contact routing

To make sure your contact filters work the way you expect, use the [agent API][13] to create ad hoc events and send them to your Slack handler.

First, create an event without a `contacts` label.
You may need to modify the URL with your Sensu agent address.

{{< code shell >}}
curl -X POST \
-H 'Content-Type: application/json' \
-d '{
  "check": {
    "metadata": {
      "name": "example-check"
    },
    "status": 1,
    "output": "You should receive this example event in the Slack channel specified by your slack_fallback handler.",
    "handlers": ["slack"]
  }
}' \
http://127.0.0.1:3031/events
{{< /code >}}

You should receive a 202 response from the API.
Since this event doesn't include a `contacts` label, you should also receive an alert in the Slack channel specified by the `slack_fallback` handler.
Behind the scenes, Sensu uses the`contact_fallback` filter to match the event to the `slack_fallback` handler.

Now, create an event with a `contacts` label:

{{< code shell >}}
curl -X POST \
-H 'Content-Type: application/json' \
-d '{
  "check": {
    "metadata": {
      "name": "example-check",
      "labels": {
        "contacts": "dev"
      }
    },
    "status": 1,
    "output": "You should receive this example event in the Slack channel specified by your slack_dev handler.",
    "handlers": ["slack"]
  }
}' \
http://127.0.0.1:3031/events
{{< /code >}}

Because this event contains the `contacts: dev` label, you should receive an alert in the Slack channel specified by the `slack_dev` handler.

Resolve the events by sending the same API requests with `status` set to `0`.

## Manage contact labels in checks and entities

To assign an alert to a contact, add a `contacts` label to the check or entity.
The `contacts` labels should be `ops` and `dev`.
You'll also need to update the check to use your `slack` handler.

For example, you can update the `check_cpu` check created in [Monitor server resources][9] to include the `ops` and `dev` contacts and the `slack` handler.

Use sensuctl to open the check in a text editor:

{{< code shell >}}
sensuctl edit check check_cpu
{{< /code >}}

Edit the check metadata to add the following labels:

{{< language-toggle >}}

{{< code yml >}}
---
labels:
  contacts: ops, dev
{{< /code >}}

{{< code json >}}
{
  "labels": {
    "contacts": "ops, dev"
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

Next, run this sensuctl command to add the `slack` handler:

{{< code shell >}}
sensuctl check set-handlers check_cpu slack
{{< /code >}}

Again, you will receive an `Updated` confirmation message.

To view the updated resource definition for `check_cpu` and confirm that it includes the `contacts` labels and `slack` handler, run:

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
  labels:
    contacts: ops, dev
  name: check_cpu
spec:
  check_hooks: null
  command: check-cpu-usage -w 75 -c 90
  env_vars: null
  handlers:
  - slack
  high_flap_threshold: 0
  interval: 60
  low_flap_threshold: 0
  output_metric_format: ""
  output_metric_handlers: null
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
    "labels": {
      "contacts": "ops, dev"
    },
    "name": "check_cpu"
  },
  "spec": {
    "check_hooks": null,
    "command": "check-cpu-usage -w 75 -c 90",
    "env_vars": null,
    "handlers": [
      "slack"
    ],
    "high_flap_threshold": 0,
    "interval": 60,
    "low_flap_threshold": 0,
    "output_metric_format": "",
    "output_metric_handlers": null,
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

Now when the `check_cpu` check generates an incident, Sensu will filter the event according to the `contact_ops` and `contact_dev` event filters and send alerts to #<ALERT_OPS> and #<ALERT_DEV> accordingly.

{{< figure src="/images/archived_version_images/contact_routing_old_dev_ops_teams.png" alt="Diagram that shows an event generated with a check label for the dev and ops teams, matched to the dev team and ops team handlers using contact filters, and routed to the Slack channels for dev and ops" link="/images/archived_version_images/contact_routing_old_dev_ops_teams.png" target="_blank" >}}
<!-- Diagram source: https://www.lucidchart.com/documents/edit/3cbd2ad3-92ed-48cc-bbaa-a97f53dae1ba -->

### Entities

You can also specify contacts using an entity label.
For more information about managing entity labels, read the [entities reference][10].

If contact labels are present in both the check and entity, the check contacts override the entity contacts.
In this example, the `dev` label in the check configuration overrides the `ops` label in the agent definition, resulting in an alert sent to #<ALERT_DEV> but not to #<ALERT_OPS> or #<ALERT_ALL>.

{{< figure src="/images/archived_version_images/old_label_overrides.png" alt="Diagram that shows that check labels override entity labels when both are present in an event" link="/images/archived_version_images/old_label_overrides.png" target="_blank" >}}
<!-- Diagram source: https://www.lucidchart.com/documents/edit/da41741f-15c5-47f8-b2b4-9197593a67d8/0 -->

## Next steps

Now that you've set up contact routing for two example teams, you can create additional filters, handlers, and labels to represent your team's contacts.
Learn how to use Sensu to [Reduce alert fatigue][11].


[1]: ../../../operations/deploy-sensu/install-sensu/
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
[21]: ../../observe-schedule/subscriptions/
