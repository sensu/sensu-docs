---
title: "Route alerts with event filters"
linkTitle: "Route Alerts"
guide_title: "Route alerts with event filters"
type: "guide"
description: "Every alert has an ideal first responder: a team or person who knows how to triage and address the issue. Sensu contact routing lets you alert the right people using their preferred contact method, reducing mean time to response and recovery."
weight: 30
version: "6.1"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.1:
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
The check definition includes the `contacts: dev` label, which will result in an alert sent to the dev team but not to the ops team or the fallback option.

<a href="/images/contact-routing1.png"><img src="/images/contact-routing1.png" alt="Diagram that shows an event generated with a check label, matched to the dev team's handler using a contact filter, and routed to the dev team's Slack channel"></a>
<!-- Diagram source: https://www.lucidchart.com/documents/edit/f66c930f-295d-458c-bde3-4e55edd9b2e8/0 -->

<p style="text-align:center"><i>Sensu Go contact routing: Route alerts to the dev team using a check label</i></p>

## Prerequisites

To complete this guide, you'll need:

- A [Sensu backend][1]
- At least one [Sensu agent][2]
- [Sensuctl][3] ([configured][4] to talk to the Sensu backend)
- [cURL][5]
- A [Slack webhook URL][6] and three different Slack channels to receive test alerts (one for each team)

To set up a quick testing environment, download and start the [Sensu sandbox][7].

## Configure contact routing

### 1. Register the has-contact filter dynamic runtime asset

Contact routing is powered by the [has-contact filter dynamic runtime asset][12].
To add the has-contact dynamic runtime asset to Sensu, use [`sensuctl asset add`][14]:

{{< code shell >}}
sensuctl asset add sensu/sensu-go-has-contact-filter:0.2.0 -r contact-filter
fetching bonsai asset: sensu/sensu-go-has-contact-filter:0.2.0
added asset: sensu/sensu-go-has-contact-filter:0.2.0

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["contact-filter"].
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the asset: `contact-filter`.

You can also download the latest dynamic runtime asset definition from [Bonsai][12].

Run `sensuctl asset list --format yaml` to confirm that the dynamic runtime asset is ready to use.

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
Read [the asset reference](../../../plugins/assets#dynamic-runtime-asset-builds) for more information about dynamic runtime asset builds.
{{% /notice %}}

### 2. Create contact filters

The [Bonsai][1] documentation for the asset explains that the has-contact dynamic runtime asset supports two functions:

- `has_contact`, which takes the Sensu event and the contact name as arguments
- `no_contact`, which is available as a fallback in the absence of contact labels and takes only the event as an argument

You'll use these functions to create event filters that represent the three actions that the Sensu Slack handler can take on an event: contact the ops team, contact the dev team, and contact the fallback option.

| event filter name | expression | description
| --- | --- | --- |
| `contact_ops` | `has_contact(event, "ops")` | Allow events with the entity<br> or check label `contacts: ops`
| `contact_dev` | `has_contact(event, "dev")` | Allow events with the entity<br> or check label `contacts: dev`
| `contact_fallback` | `no_contacts(event)` | Allow events without an entity<br> or check `contacts` label

To add these filters to Sensu, use `sensuctl create`:

{{< code shell >}}
echo '---
type: EventFilter
api_version: core/v2
metadata:
  name: contact_ops
spec:
  action: allow
  runtime_assets:
    - sensu-go-has-contact-filter_any_noarch
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

Run `sensuctl filter list --format yaml` to confirm that the filters are ready to use.

### 3. Create a handler for each contact

With your contact filters in place, you can create a handler for each contact: ops, dev, and fallback.
If you haven't already, add the [Slack handler dynamic runtime asset][8] to Sensu with sensuctl:

{{< code shell >}}
sensuctl asset add sensu/sensu-slack-handler:1.0.3 -r sensu-slack-handler
fetching bonsai asset: sensu/sensu-slack-handler:1.0.3
added asset: sensu/sensu-slack-handler:1.0.3

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["sensu-slack-handler"].
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the dynamic runtime asset: `sensu-slack-handler`.

In each handler definition, specify:

- A unique name: `slack_ops`, `slack_dev`, or `slack_fallback`
- A customized command with the contact's preferred Slack channel
- The contact filter
- The built-in `is_incident` and `not_silenced` filters to reduce noise and enable silences
- An environment variable that contains your Slack webhook URL
- The `sensu-slack-handler` dynamic runtime asset

To create the `slack_ops`, `slack_dev`, and `slack_fallback` handlers, edit and run this example:

{{< code shell >}}
# Edit before running:
# 1. Add your SLACK_WEBHOOK_URL
# 2. Make sure the Slack channels specified in the
#    command` attributes match channels available
#    to receive test alerts in your Slack instance.
echo '---
type: Handler
api_version: core/v2
metadata:
  name: slack_ops
spec:
  command: sensu-slack-handler --channel "#alert-ops"
  env_vars:
  - SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX
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
  command: sensu-slack-handler --channel "#alert-dev"
  env_vars:
  - SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX
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
  command: sensu-slack-handler --channel "#alert-all"
  env_vars:
  - SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX
  filters:
  - is_incident
  - not_silenced
  - contact_fallback
  runtime_assets:
  - sensu-slack-handler
  type: pipe' | sensuctl create
{{< /code >}}

Run `sensuctl handler list --format yaml` to confirm that the handlers are ready to use.

### 4. Create a handler set

To centralize contact management and simplify configuration, create a handler set that combines your contact-specific handlers under a single handler name.

Use `sensuctl` to create a `slack` handler set:

{{< code shell >}}
echo '---
type: Handler
api_version: core/v2
metadata:
  name: slack
  namespace: default
spec:
  handlers:
  - slack_ops
  - slack_dev
  - slack_fallback
  type: set' | sensuctl create
{{< /code >}}

You should see updated output of `sensuctl handler list` that includes the `slack` handler set.

Congratulations! Your Sensu contact routing is set up.
Next, test your contact filters to make sure they work.

## Test contact routing

To make sure your contact filters work the way you expect, use the [agent API][13] to create ad hoc events and send them to your Slack pipeline.

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

You should see a 202 response from the API.
Since this event doesn't include a `contacts` label, you should also see an alert in the Slack channel specified by the `slack_fallback` handler.
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

Because this event contains the `contacts: dev` label, you should see an alert in the Slack channel specified by the `slack_dev` handler.

Resolve the events by sending the same API requests with `status` set to `0`.

## Manage contact labels in checks and entities

To assign an alert to a contact, add a `contacts` label to the check or entity.

### Checks

This check definition includes two contacts (`ops` and `dev`) and the handler `slack`.
To add the runtime assets and set up the `check_cpu` check, see [Monitor server resources][9].

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: check_cpu
  labels:
    contacts: ops, dev
spec:
  command: check-cpu.rb -w 75 -c 90
  handlers:
  - slack
  interval: 10
  publish: true
  subscriptions:
  - system
  runtime-assets:
  - sensu-plugins-cpu-checks
  - sensu-ruby-runtime
{{< /code >}}

When the `check_cpu` check generates an incident, Sensu filters the event according to the `contact_ops` and `contact_dev` filters, resulting in an alert sent to #alert-ops and #alert-dev.

<a href="/images/contact-routing2.png"><img src="/images/contact-routing2.png" alt="Diagram that shows an event generated with a check label for the dev and ops teams, matched to the dev team and ops team handlers using contact filters, and routed to the Slack channels for dev and ops"></a>
<!-- Diagram source: https://www.lucidchart.com/documents/edit/3cbd2ad3-92ed-48cc-bbaa-a97f53dae1ba -->

<p style="text-align:center"><i>Sensu Go contact routing: Route alerts to two contacts using a check label</i></p>

### Entities

You can also specify contacts using an entity label.
For more information about managing entity labels, see the [entity reference][10].

If contact labels are present in both the check and entity, the check contacts override the entity contacts.
In this example, the `dev` label in the check configuration overrides the `ops` label in the agent definition, resulting in an alert sent to #alert-dev but not to #alert-ops or #alert-all.

<a href="/images/contact-routing3.png"><img src="/images/contact-routing3.png" alt="Diagram that shows that check labels override entity labels when both are present in an event"></a>
<!-- Diagram source: https://www.lucidchart.com/documents/edit/da41741f-15c5-47f8-b2b4-9197593a67d8/0 -->

<p style="text-align:center"><i>Sensu Go contact routing: Check contacts override entity contacts</i></p>

## Next steps

Now that you've set up contact routing for two example teams, you can create additional filters, handlers, and labels to represent your team's contacts.
Learn how to use Sensu to [Reduce alert fatigue][11].

[1]: ../../../operations/deploy-sensu/install-sensu#install-the-sensu-backend
[2]: ../../../operations/deploy-sensu/install-sensu#install-sensu-agents
[3]: ../../../operations/deploy-sensu/install-sensu#install-sensuctl
[4]: ../../../sensuctl/#first-time-setup-and-authentication
[5]: https://curl.haxx.se/
[6]: https://api.slack.com/incoming-webhooks
[7]: ../../../learn/learn-sensu-sandbox/
[8]: https://bonsai.sensu.io/assets/sensu/sensu-slack-handler
[9]: ../../observe-schedule/monitor-server-resources/
[10]: ../../observe-entities/entities/#manage-entity-labels
[11]: ../reduce-alert-fatigue/
[12]: https://bonsai.sensu.io/assets/sensu/sensu-go-has-contact-filter
[13]: ../../observe-schedule/agent/#create-observability-events-using-the-agent-api
[14]: ../../../sensuctl/sensuctl-bonsai/#install-dynamic-runtime-asset-definitions
