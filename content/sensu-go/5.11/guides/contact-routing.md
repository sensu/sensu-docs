---
title: "How to manage contacts using filters"
linkTitle: "Contact Routing"
description: "Every alert has an ideal first responder: a team or individual with the knowledge to triage and address the issue. Sensu contact routing lets you alert the right people using their preferred contact method, reducing mean time to response and recovery."
weight: 20
version: "5.11"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.11:
    parent: guides
---

Every alert has an ideal first responder: a team or individual with the knowledge to triage and address the issue.
Sensu contact routing lets you alert the right people using their preferred contact methods, reducing mean time to response and recovery.

- [Prerequisites](#prerequisites)
- [Configuring contact routing](#configuring-contact-routing)
	- [1. Register the has-contact filter asset](#1-register-the-has-contact-filter-asset)
	- [2. Create event filters](#2-create-event-filters)
	- [3. Create a handler for each contact](#3-create-a-handler-for-each-contact)
	- [4. Create a handler set](#4-create-a-handler-set)
- [Testing contact routing](#testing-contact-routing)
- [Managing contact labels in checks and entities](#managing-contact-labels-in-checks-and-entities)

In this guide, we’ll set up alerting for two teams (ops and dev) with separate Slack channels.
Each team wants to be alerted only for the things they care about, using their preferred channel.
The contact routing pattern uses:

- **Event handlers** to store contact preferences for ops, dev, and a fallback option
- **Event filters** to match contact labels to the right handler

Here's a quick overview of the configuration we'll need to set up contact routing.
You can see that the check definition includes `dev` in the `contacts` label, resulting in an alert being sent to dev, but not to ops or to the fallback contact.

<img src="/images/contact-routing1.svg" alt="Diagram showing an alert being generated and sent to the ops team using a contact label in the check definition">

<p style="text-align:center"><i>Sensu Go contact routing: Routing alerts to the ops team using a contact label in the check definition</i></p>

## Prerequisites

To complete this guide, you'll need:

- a [Sensu backend][]
- at least one [Sensu agent][]
- [sensuctl][], [configured][] to talk to the Sensu backend
- [curl][]
- a [Slack webhook URL][] and three Slack channels available to receive test alerts

To set up a quick testing environment, download and start the Sensu sandbox using [Vagrant and VirtualBox][] or [Docker Compose][].

## Configuring contact routing

### 1. Register the has-contact filter asset

Contact routing is powered by the [has-contact filter asset][1].
To add the has-contact filter asset to Sensu, use this sensuctl command, or download the latest asset definition from [Bonsai][1] and register the asset using `sensuctl create -f filename.yml`.

{{< highlight shell >}}
sensuctl asset create sensu-go-has-contact-filter \
--url "https://github.com/sensu/sensu-go-has-contact-filter/releases/download/0.2.0/sensu-go-has-contact-filter_0.2.0.tar.gz" \
--sha512 "d07584ddf9d44b3f68102df7038070995d2001e1b826a3fe0d244f6e0fd69b76f29b853a13fcd8841bdb3adebe8a84b3f64247367ef1c9f364c04c5b8ecc16e6"
{{< /highlight >}}

You should see a `Created` response from sensuctl indicating that the asset is ready to use.

### 2. Create event filters

Looking at the documentation in [Bonsai][1], we can see that the has-contact filter asset supports two functions:

- `has_contact`, taking the Sensu event and the contact name as arguments
- `no_contact`, to use as a fallback in the absence of contact labels and taking only the event as an argument

We'll use these functions to create three event filters, one for each action that the Slack handler can take on an event: contact the ops team, contact the dev team, and contact the fallback option.

| filter name | expression | description
| --- | --- | --- |
| `contact_ops` | `has_contact(event, "ops")` | Allow events when the<br> entity or check contact<br> labels contain `ops`
| `contact_dev` | `has_contact(event, "dev")` | Allow events when the<br> entity or check contact<br> labels contain `dev`
| `no_contacts` | `no_contacts(event)` | Allow events without<br> entity or check contact<br> labels

To add these filters to Sensu, use `sensuctl create`:

{{< highlight text >}}
echo '---
type: EventFilter
api_version: core/v2
metadata:
  name: contact_ops
  namespace: default
spec:
  action: allow
  runtime_assets:
    - sensu-go-has-contact-filter
  expressions:
    - has_contact(event, "ops")
---
type: EventFilter
api_version: core/v2
metadata:
  name: contact_dev
  namespace: default
spec:
  action: allow
  runtime_assets:
    - sensu-go-has-contact-filter
  expressions:
    - has_contact(event, "dev")
---
type: EventFilter
api_version: core/v2
metadata:
  name: no_contacts
  namespace: default
spec:
  action: allow
  runtime_assets:
    - sensu-go-has-contact-filter
  expressions:
    - no_contacts(event)' | sensuctl create
{{< /highlight >}}

Note that each filter specifies `sensu-go-has-contact-filter` as a required asset.
All resources used in contact routing must belong to the same namespace; in this guide, all examples use the `default` namespace.
You can use `sensuctl filter list --format yaml` to confirm that the three event filters are ready to use.

### 3. Create a handler for each contact

With our contact filters in place, we can create a Slack handler for each contact: ops, dev, and fallback.
If you haven't already, add the [Slack handler asset][] to Sensu using sensuctl:

{{< highlight shell >}}
sensuctl asset create sensu-slack-handler \
--url "https://github.com/sensu/sensu-slack-handler/releases/download/1.0.3/sensu-slack-handler_1.0.3_linux_amd64.tar.gz" \
--sha512 "68720865127fbc7c2fe16ca4d7bbf2a187a2df703f4b4acae1c93e8a66556e9079e1270521999b5871473e6c851f51b34097c54fdb8d18eedb7064df9019adc8"{{< /highlight >}}

In each handler definition, we'll specify:

- a unique name
- a customized command with the contact's preferred Slack channel
- the contact filter name
- the built-in `is_incident` and `not_silenced` filters to reduce noise and enable silences
- an environment variable containing your Slack webhook URL
- the `sensu-slack-handler` runtime asset

This command shows configuration examples for three handlers: `slack_ops`, `slack_dev`, and `slack_fallback`.
Before you add these handlers to Sensu, you'll need to customize them to your Sensu and Slack instances:

1. Replace the `SLACK_WEBHOOK_URL` variables with your Slack webhook.
2. Change the channels to match channels available to receive alerts in your Slack instance.

After editing the handler definitions, run the command to create the handlers.
You can check the configuration using `sensuctl handler list --format yaml`.

{{< highlight text >}}
echo '---
type: Handler
api_version: core/v2
metadata:
  name: slack_ops
  namespace: default
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
  namespace: default
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
  namespace: default
spec:
  command: sensu-slack-handler --channel "#alert-general"
  env_vars:
  - SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX
  filters:
  - is_incident
  - not_silenced
  - contact_fallback
  runtime_assets:
  - sensu-slack-handler
  type: pipe' | sensuctl create
{{< /highlight >}}

### 4. Create a handler set

To centralize contact management and simplify check and entity configuration, we'll use a handler set that combines our contact-specific handlers under a single handler name.

Use `sensuctl` to create a `slack` handler set:

{{< highlight shell >}}
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
{{< /highlight >}}

You should see the output of `sensuctl handler list` update to include the `slack` handler set.

## Testing contact routing

To make sure our contact filters are working, we'll use the agent API to create ad-hoc events and send them to our Slack pipeline.

First, let's create an event without any contact labels.
You may need to modify the URL wth your Sensu agent address.

{{< highlight shell >}}
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
{{< /highlight >}}

You should see a 202 response from the API.
Since this event doesn't include a `contacts` labels, it matches the `contact_fallback` filter and is handled by the `slack_fallback` handler, so you should see an alert in the Slack channel specified by the `slack_fallback` handler.

Resolve this event using the [web UI events page][] or by sending the same API request with `status` set to `0`.

Now let's create an event with a contact label.

{{< highlight shell >}}
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
{{< /highlight >}}

Since this event contains the `contacts: dev` label, you should see an alert in the Slack channel specified by the `slack_dev` handler.

## Managing contact labels in checks and entities

To assign an alert to a contact, add a `contacts` label in the check or entity definition.

### Checks

For example, this check definition includes two contacts (`ops` and `dev`) and the handler `slack`.
To set you the `check_cpu` check, see the [guide to monitoring server resources][].

{{< highlight yml >}}
type: CheckConfig
api_version: core/v2
metadata:
  name: check_cpu
  namespace: default
  labels
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
{{< /highlight >}}

When the check generates an incident, Sensu filters the event according to the `contact_ops` and `contact_dev` filters, resulting in an alert sent to #alert-ops and #alert-dev.

<img src="/images/contact-routing2.svg" alt="Diagram showing an alert being generated and sent to the the ops and dev teams using a contacts label in the check definition">

<p style="text-align:center"><i>Sensu Go contact routing: Routing alerts to two contacts using a contacts label in the check definition</i></p>

### Entities

You can also specify contacts in entity labels.
For more information about managing entity labels, see the [entity reference][].

In the case that contact labels are present in both the check and entity, the check contacts override the entity contacts.
Here we can see that the `ops` labels in the agent configuration overrides the `dev` contact in the check definition, resulting in an alert sent to #alert-dev but not to #alert-ops or #alert-general.

<img src="/images/contact-routing3.svg" alt="">

<p style="text-align:center"><i>Sensu Go contact routing: Check contacts take precedence over entity contacts</i></p>

[1]: https://bonsai.sensu.io/assets/sensu/sensu-go-has-contact-filter
