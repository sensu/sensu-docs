---
title: "Send email alerts with the Sensu Go Email Handler"
linkTitle: "Send Email Alerts"
description: "Here’s how to send alerts to your email with the Sensu Go Email Handler. Use handlers to send events to your technology of choice (in this case, email) to alert you of incidents and help you resolve them more quickly."
weight: 85
version: "5.21"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-5.21:
    parent: guides
---

Sensu event handlers are actions the Sensu backend executes on [events][1].
This guide explains how to use the [Sensu Go Email Handler][3] asset to send notification emails.

When you are using Sensu in production, events will come from a check or metric you configure.
For this guide, you will create an ad hoc event that you can trigger manually to test your email handler.

To follow this guide, you’ll need to [install the Sensu backend][12], have at least one [Sensu agent][13] running on Linux, and [install and configure sensuctl][4].

Your backend will execute an email handler that sends notifications to the email address you specify.
You'll also add an [event filter][5] to make sure you only receive a notification when your event represents a status change.

## Add the email handler asset

[Assets][8] are shareable, reusable packages that help you deploy Sensu plugins.
In this guide, you'll use the [Sensu Go Email Handler][3] asset to power an `email` handler.

Use the following sensuctl example to register the [Sensu Go Email Handler][3] asset:

{{< code shell >}}
sensuctl asset add sensu/sensu-email-handler -r email-handler
{{< /code >}}

The -r (rename) flag allows you to specify a shorter name for the asset (in this case, `email-handler`).

You can also download the latest asset definition for your platform from [Bonsai][3] and register the asset with `sensuctl create --file filename.yml`.

To confirm that the handler asset was added correctly, run:

{{< code shell >}}
sensuctl asset list
{{< /code >}}

You should see the `email-handler` asset in the list.
For a detailed list of everything related to the asset that Sensu added automatically, run:

{{< code shell >}}
sensuctl asset info email-handler
{{< /code >}}

The asset includes the `sensu-email-handler` command, which you will use when you [create the email handler definition][18] later in this guide.

{{% notice note %}}
**NOTE**: Sensu does not download and install asset builds onto the system until they are needed for command execution.
Read [the asset reference](../../reference/assets#asset-builds) for more information about asset builds.
{{% /notice %}}

## Add an event filter

Event filters allow you to fine-tune how your events are handled and [reduce alert fatigue][7].
In this guide, your event filter will send notifications only when your event's state changes (for example, for any change between `0` OK, `1` warning, and `2` critical).

Here's an overview of how the `state_change_only` filter will work:

- If your event status changes from `0` to `1`, you will receive **one** email notification for the change to warning status.
- If your event status stays at `1` for the next hour, you **will not** receive repeated email notifications during that hour.
- If your event status changes to `2` after 1 hour at `1`, you will receive **one** email notification for the change from warning to critical status.
- If your event status fluctuates between `0`, `1`, and `2` for the next hour, you will receive **one** email notification **each time** the status changes.

To create the event filter, run:

{{< code shell>}}
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
{{< /code >}}

## Create the email handler definition

After you add an event filter, create the email handler definition to specify the email address where the `sensu/sensu-email-handler` asset will send notifications.
In the handler definition's `command` value, you'll need to change a few things.

Copy this text into a text editor:

{{< code shell "YML">}}
cat << EOF | sensuctl create
---
api_version: core/v2
type: Handler
metadata:
  namespace: default
  name: email
spec:
  type: pipe
  command: sensu-email-handler -f <sender@example.com> -t <recipient@example.com> -s <smtp_server@example.com>
    -u username -p password
  timeout: 10
  filters:
  - is_incident
  - not_silenced
  - state_change_only
  runtime_assets:
  - email-handler
EOF
{{< /code >}}

Then, replace the following text:

- `<sender@example.com>`: Replace with the email address you want to use to send email alerts.
- `<recipient@example.com>`: Replace with the email address you want to receive email alerts.
- `<smtp_server@example.com>`: Replace with the hostname of your SMTP server.
- `<username>`: Replace with your SMTP username, typically your email address.
- `<password>`: Replace with your SMTP password, typically the same as your email password.

{{% notice note %}}
**NOTE**: To use Gmail or G Suite as your SMTP server, follow Google's instructions to [send email via SMTP](https://support.google.com/a/answer/176600?hl=en).
If you have enabled 2-step verification on your Google account, use an [app password](https://support.google.com/accounts/answer/185833?hl=en) instead of your login password.
If you have not enabled 2-step verification, you may need to adjust your [app access settings](https://support.google.com/accounts/answer/6010255) to follow the example in this guide.
{{% /notice %}}

You probably noticed that the handler definition includes two other filters besides `state_change_only`: [`is_incident`][10] and [`not_silenced`][11].
These two filters are included in every Sensu backend installation, so you don't have to create them.

After you add your email, server, username, and password values, run your updated code to create the email handler definition.

Now your handler and event filter are set up!

The [Sensu Go Email Handler][3] asset makes it possible to [add a template][14] that provides context for your email notifications.
The email template functionality uses tokens to populate the values provided by the event, and you can use HTML to format the email.

Before your handler can send alerts to your email, you need an [event][16] that generates the alerts.
In the final step, you will create an ad hoc event that you can trigger manually.

## Create and trigger an ad hoc event

To create an ad hoc event, first use `sensuctl env` to set up environment variables.
The environment variables will provide the required credentials for the Sensu API:

{{< code shell >}}
eval $(sensuctl env)
{{< /code >}}

Verify that the `SENSU_ACCESS_TOKEN` environment variable is set by echoing its value:

{{< code shell >}}
echo $SENSU_ACCESS_TOKEN
efPxbRciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NzkwMzY5NjQsImp0aSI6ImJiMmY0ODY4ZTJhZWEyMDhhMTExOTllMGZkNzkzMDc0Iiwic3ViIjoiYWRtaW4iLCJncm91cHMiOlsiY2x1c3Rlci1hZG1pbnMiLCJzeXN0ZW06dXNlcnMiXSwicHJvdmlkZXIiOnsicHJvdmlkZXJfaWQiOiJiYXNpYyIsInByb3ZpZGVyX3R5cGUiOiIiLCJ1c2VyX2lkIjoiYWRtaW4ifX0.6XmuvblCN743R2maF4yErS3K3sOVczsCBsjib9TenUU
{{< /code >}}

With the environment variables set, you can use the Sensu API to create your ad hoc monitoring event.
This event outputs the message "Everything is OK.” when it occurs:

{{< code shell >}}
curl -sS -H 'Content-Type: application/json' \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-d '{
  "entity": {
    "entity_class": "proxy",
    "metadata": {
      "name": "server01",
      "namespace": "default"
    }
  },
  "check": {
    "metadata": {
      "name": "server-health"
    },
    "output": "Everything is OK.",
    "status": 0,
    "interval": 60
  }
}' \
http://localhost:8080/api/core/v2/namespaces/default/events
{{< /code >}}

As configured, the event status is `0` (OK).
Now it's time to trigger an event and see the results!

To generate a status change event, use the update event endpoint to create a `1` (warning) event.
Run:

{{< code shell >}}
curl -sS -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "entity": {
    "entity_class": "proxy",
    "metadata": {
      "name": "server01",
      "namespace": "default"
    }
  },
  "check": {
    "metadata": {
      "name": "server-health"
    },
    "output": "This is a warning.",
    "status": 1,
    "interval": 60,
    "handlers": ["email"]
  }
}' \
http://localhost:8080/api/core/v2/namespaces/default/events/server01/server-health
{{< /code >}}

{{% notice note %}}
**NOTE**: If you see an `invalid credentials` error, refresh your token.
Run `eval $(sensuctl env)`.
{{% /notice %}}

Check your email &mdash; you should see a message from Sensu!

Create another event with status set to `0`. Run:

{{< code shell >}}
curl -sS -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "entity": {
    "entity_class": "proxy",
    "metadata": {
      "name": "server01",
      "namespace": "default"
    }
  },
  "check": {
    "metadata": {
      "name": "server-health"
    },
    "output": "Everything is OK.",
    "status": 0,
    "interval": 60,
    "handlers": ["email"]
  }
}' \
http://localhost:8080/api/core/v2/namespaces/default/events/server01/server-health
{{< /code >}}

You should receive another email because the event status changed to `0` (OK).

## Next steps

Now that you know how to apply a handler to a check and take action on events:

- Reuse this email handler with the `check_cpu` check from our [Monitor server resources][2] guide.
- Read the [handlers reference][6] for in-depth handler documentation.
- Check out the [Reduce alert fatigue][7] guide.


[1]: ../../reference/events/
[2]: ../monitor-server-resources/
[3]: https://bonsai.sensu.io/assets/sensu/sensu-email-handler
[4]: ../../operations/deploy-sensu/install-sensu/#install-sensuctl
[5]: ../../reference/filters/
[6]: ../../reference/handlers/
[7]: ../reduce-alert-fatigue/
[8]: ../../reference/assets
[10]: ../../reference/filters/#built-in-filter-is_incident
[11]: ../../reference/filters/#built-in-filter-not_silenced
[12]: ../../operations/deploy-sensu/install-sensu/#install-the-sensu-backend
[13]: ../../operations/deploy-sensu/install-sensu/#install-sensu-agents
[14]: https://bonsai.sensu.io/assets/sensu/sensu-email-handler#templates
[16]: ../../reference/filters/
[17]: #create-an-ad-hoc-event
[18]: #create-the-email-handler-definition
