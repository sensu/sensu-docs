---
title: "Send Slack alerts with handlers"
linkTitle: "Send Slack Alerts"
description: "Here’s how to send alerts to Slack with Sensu handlers, which are actions the Sensu backend executes on events. Use handlers to send events to your technology of choice (in this case, Slack) to alert you of incidents and help you resolve them more quickly."
weight: 30
version: "6.0"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-6.0:
    parent: observe-process
---

Sensu event handlers are actions the Sensu backend executes on [events][1].
You can use handlers to send an email alert, create or resolve incidents (in PagerDuty, for example), or store metrics in a time-series database like InfluxDB.

This guide will help you send alerts to Slack in the channel `monitoring` by configuring a handler named `slack` to a check named `check-cpu`.
If you don't already have a check in place, [Monitor server resources][2] is a great place to start.

## Register the dynamic runtime asset

[Dynamic runtime assets][13] are shareable, reusable packages that help you deploy Sensu plugins.
In this guide, you'll use the [Sensu Slack Handler][14] dynamic runtime asset to power a `slack` handler.

Use [`sensuctl asset add`][10] to register the [Sensu Slack Handler][14] dynamic runtime asset:

{{< code shell >}}
sensuctl asset add sensu/sensu-slack-handler:1.0.3 -r sensu-slack-handler
fetching bonsai asset: sensu/sensu-slack-handler:1.0.3
added asset: sensu/sensu-slack-handler:1.0.3

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["sensu-slack-handler"].
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the dynamic runtime asset: `sensu-slack-handler`.

You can also download the latest dynamic runtime asset definition for your platform from [Bonsai][14] and register the asset with `sensuctl create --file filename.yml`.

You should see a confirmation message from sensuctl:

{{< code shell >}}
Created
{{< /code >}}

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
Read [the asset reference](../../../operations/deploy-sensu/assets#dynamic-runtime-asset-builds) for more information about dynamic runtime asset builds.
{{% /notice %}}

## Get a Slack webhook

If you're already the admin of a Slack, visit `https://YOUR WORKSPACE NAME HERE.slack.com/services/new/incoming-webhook` and follow the steps to add the Incoming WebHooks integration, choose a channel, and save the settings.
If you're not yet a Slack admin, [create a new workspace][12].
After saving, you'll see your webhook URL under Integration Settings.

## Create a handler

Use sensuctl to create a handler called `slack` that pipes observation data (events) to Slack using the `sensu-slack-handler` dynamic runtime asset.
Edit the command below to include your Slack channel and webhook URL.
For more information about customizing your Sensu slack alerts, see the asset page in [Bonsai][14].

{{< code shell >}}
sensuctl handler create slack \
--type pipe \
--env-vars "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX" \
--command "sensu-slack-handler --channel '#monitoring'" \
--runtime-assets sensu-slack-handler
{{< /code >}}

You should see a confirmation message from sensuctl:

{{< code shell >}}
Created
{{< /code >}}

## Assign the handler to a check

With the `slack` handler created, you can assign it to a check.
In this case, you're using the `check-cpu` check: you want to receive Slack alerts whenever the CPU usage of your systems reach some specific thresholds.
Assign your handler to the check `check-cpu`:

{{< code shell >}}
sensuctl check set-handlers check-cpu slack
{{< /code >}}

## Validate the handler

It might take a few moments after you assign the handler to the check for the check to be scheduled on the entities and the result sent back to Sensu backend.
After an event is handled, you should see the following message in Slack:

<div style="width:500px">
   <img class="html" alt="Example Slack message" src="/images/handler-slack.png"/>
</div>

Verify the proper behavior of this handler with `sensu-backend` logs.
See [Troubleshooting][7] for log locations by platform.

Whenever an event is being handled, a log entry is added with the message `"handler":"slack","level":"debug","msg":"sending event to handler"`, followed by a second log entry with the message `"msg":"pipelined executed event pipe handler","output":"","status":0`.

## Next steps

Now that you know how to apply a handler to a check and take action on events, read the [handlers reference][8] for in-depth handler documentation and check out the [Reduce alert fatigue][9] guide.

You can also try our interactive tutorial and learn how to [send Sensu Go alerts to your PagerDuty account][11].


[1]: ../../observe-events/events/
[2]: ../../observe-schedule/monitor-server-resources/
[3]: https://github.com/sensu/slack-handler
[4]: https://golang.org/doc/install
[5]: https://en.wikipedia.org/wiki/PATH_(variable)
[6]: https://api.slack.com/incoming-webhooks
[7]: ../../../operations/maintain-sensu/troubleshoot/
[8]: ../handlers/
[9]: ../../observe-filter/reduce-alert-fatigue/
[10]: ../../../sensuctl/sensuctl-bonsai/#install-dynamic-runtime-asset-definitions
[11]: ../../../learn/sensu-pagerduty/
[12]: https://slack.com/get-started#/create
[13]: ../../../operations/deploy-sensu/assets
[14]: https://bonsai.sensu.io/assets/sensu/sensu-slack-handler
