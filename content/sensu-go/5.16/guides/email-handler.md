---
title: "Send email alerts with the Sensu Go Email Handler"
linkTitle: "Send Email Alerts"
description: "Here’s how to send alerts to your email with the Sensu Go Email Handler. Use handlers to send events to your technology of choice (in this case, email) to alert you of incidents and help you resolve them more quickly."
weight: 85
version: "5.16"
product: "Sensu Go"
platformContent: False
menu: 
  sensu-go-5.16:
    parent: guides
---

- [Create a check](#create-a-check)
- [Add the email handler asset](#add-the-email-handler-asset)
- [Add an event filter](#add-an-event-filter)
- [Assign the email handler to a check](#assign-the-email-handler-to-a-check)
- [Create an email template](#create-an-email-template)
- [Next steps](#next-steps)

Sensu event handlers are actions the Sensu backend executes on [events][1].
This guide explains how to use the [Sensu Go Email Handler][3] to send incident notification emails.

To use this guide, you’ll need to [install the Sensu backend][12] and have at least one [Sensu agent][13] running on Linux.
You should also [install and configure sensuctl][4].

## Create a check

You will send alerts to your email by configuring a handler named `email` to a check named `check-cpu`.
To create the check you need, follow the [Monitor server resources][2] guide to get `check-cpu` set up.
The `check-cpu` check generates a warning event when CPU usage reaches 75% and a critical alert when CPU usage reaches 90%.

When your `check-cpu` check is generating events, you can set up a handler to make sure you find out about them.
In this case, your backend will execute an email handler that sends incident notifications to the email address you specify.
You'll also add an [event filter][5] to make sure you only receive a notification when `check-cpu` events represent a state change.

## Add the email handler asset

[Assets][8] are shareable, reusable packages that help you deploy Sensu plugins.
In this guide, you'll use the [Sensu Go Email Handler][3] asset to power an `email` handler.

Use the following sensuctl example to register the [Sensu Go Email Handler][3] asset for Linux AMD64 or download the latest asset definition for your platform from [Bonsai][3] and register the asset with `sensuctl create --file filename.yml`.

{{< highlight shell >}}
sensuctl asset add sensu/sensu-email-handler
{{< /highlight >}}

To confirm that the handler was added correctly, run:

{{< highlight shell >}}
sensuctl asset list
{{< /highlight >}}

You should see the `sensu/sensu-email-handler` asset in the list.
For a detailed list of everything related to the asset that Sensu added automatically, run:

{{< highlight shell >}}
sensuctl asset info sensu/sensu-email-handler
{{< /highlight >}}

## Add an event filter

Event filters allow you to fine-tune how your events are handled and [reduce alert fatigue][7].
In this guide, your event filter will send notifications only when an event's state changes (for example, from `warning` to `critical` or from `critical` to `ok`).

Here's an overview of how the `state_change_only` filter will work:

- If CPU usage reaches 75%, you will receive **one** email notification for the change to `warning` status
- If CPU usage stays at 75% for the next hour, you **will not** receive repeated email notifications every 60 seconds during that hour
- If CPU usage increases to 90% after 1 hour at 75%, you will receive **one** email notification for the change from `warning` status to `critical` status
- If CPU usage fluctuates betwen 50% and 95% for the next hour, you **one** email notification each time the status changes

Adding the event filter requires two parts:

1. Create the event filter
2. Create the email handler definition to specify the email address where the `sensu/sensu-email-handler` asset will send incident notifications

First, to create the event filter, run:

{{< highlight shell >}}
cat << EOF | sensuctl create
---
type: EventFilter
api_version: core/v2
metadata:
  annotations: null
  labels: null
  name: state_change_only
  namespace: default
spec:
  action: allow
  expressions:
  - event.check.occurrences == 1
  runtime_assets: []
EOF
{{< /highlight >}}

Second, create the email handler definition.
In the handler definition's `command` value, you'll need to change a few things.

Copy the text below into a text editor.
Then, replace the following text:
- `YOUR-EMAIL@example.com`: Replace with the email address you want to use to send and receive email alerts
- `USERNAME`: Replace with your SMTP username, typically your email address
- `PASSWORD`: Replace with your SMTP password, typically the same as your email password

{{< highlight shell >}}
cat << EOF | sensuctl create
---
api_version: core/v2
type: Handler
metadata:
  namespace: default
  name: email
spec:
  type: pipe
  command: sensu-email-handler -f YOUR-EMAIL@example.com -t YOUR-EMAIL@example.com -s YOUR-EMAIL.example.com
    -u USERNAME -p PASSWORD
  timeout: 10
  filters:
  - is_incident
  - not_silenced
  - state_change_only
EOF
{{< /highlight >}}


_**NOTE**: The handler definition also includes the built-in [`is_incident`][10] and [`not_silenced`][11] filters. These two filters are included in every Sensu backend installation._

After you add your email, username, and password values, run your updated code to create the email handler definition.

Now your handler and event filter are set up!
Next, assign the email handler to the `check-cpu` check.

## Assign the email handler to a check

With your `email` handler created, you can assign it to the `check-cpu` check.
To assign your email handler to the check `check-cpu`:

{{< highlight shell >}}
sensuctl check set-handlers check-cpu email
{{< /highlight >}}

It might take a few moments after you assign the handler to the check for the check to be scheduled on the entities and the result sent back to Sensu backend.

## Create an email template

The last step is to create a .
The [Sensu Go Email Handler][3] asset makes it possible to use a template that provides context for your email notifications.
The email template functionality included with the Sensu Go Email Handler asset uses tokens to populate the values provided by the event.
Use HTML to format the email. 

Here is an example email template:

{{< highlight shell >}}
/etc/sensu/email_template

<html>
Greetings,<br>
<br>
The status of your {{ .Check.Name }} check has changed. Details about the change are included below.<br>
<br>
<h3>Incident Details</h3>
<b>Check</b>: {{ .Check.Name }}<br>
<b>Entity</b>: {{ .Entity.Name }}<br>
<b>State</b>: {{ .Check.State }}<br>
<b>Occurrences</b>: {{ .Check.Occurrences }}<br>
<b>Playbook</b>: https://example.com/monitoring/wiki/playbook<br>
<h3>Check Output Details</h3>
<b>Check Output</b>: {{.Check.Output}}<br>
{{end}}

<br>
#monitoringlove,<br>
<br>
Sensu<br>
</html>
{{< /highlight >}}

## Next steps

Now that you know how to apply a handler to a check and take action on events, read the [handlers reference][6] for in-depth handler documentation and check out the [Reduce alert fatigue][7] guide.

You can also follow our [Up and running with Sensu Go][9] interactive tutorial to set up the Sensu Go email handler and test it with simulated `critical` events.

[1]: ../../reference/events/
[2]: ../monitor-server-resources/
[3]: https://bonsai.sensu.io/assets/sensu/sensu-email-handler
[4]: ../../installation/install-sensu/#install-sensuctl
[5]: ../../reference/filters/
[6]: ../../reference/handlers/
[7]: ../reduce-alert-fatigue/
[8]: ../../reference/assets
[9]: ../up-running-tutorial/
[10]: ../../reference/filters/#built-in-filter-is-incident
[11]: ../../reference/filters/#built-in-filter-not-silenced
[12]: ../../installation/install-sensu/#install-the-sensu-backend
[13]: ../../installation/install-sensu/#install-sensu-agents
