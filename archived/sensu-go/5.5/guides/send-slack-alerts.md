---
title: "How to send alerts to Slack with handlers"
linkTitle: "Sending Slack Alerts"
description: "Here’s how to send alerts to Slack with Sensu handlers, which are actions executed by the Sensu server on events. Handlers can be sent to your technology of choice (in this case, Slack) to alert you of incidents and help you resolve them faster. Learn how."
weight: 30
version: "5.5"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-5.5:
    parent: guides
---

## What are Sensu handlers?

Sensu event handlers are actions executed by the Sensu server on [events][1].

## Why use a handler?

Handlers can be used for sending an email alert, creating or resolving an incident
(in PagerDuty, for example), or storing metrics in a time-series
database (InfluxDB, for example).

## Using a handler to send alerts to Slack

The purpose of this guide is to help you send alerts to Slack, on the channel
`monitoring`, by configuring a handler named `slack` to a check named
`check-cpu`. If you don't already have a check in place, [this guide][2] is a
great place to start.

### Registering the asset

[Assets][13] are shareable, reusable packages that make it easy to deploy Sensu plugins.
In this guide, we'll use the [Sensu Slack handler asset][14] to power a `slack` handler.

You can use the following sensuctl example to register the [Sensu Slack handler asset][14] for Linux AMD64, or you can download the latest asset definition for your platform from [Bonsai][14] and register the asset using `sensuctl create --file filename.yml`.

{{< highlight shell >}}
sensuctl asset create sensu-slack-handler --url "https://assets.bonsai.sensu.io/3149de09525d5e042a83edbb6eb46152b02b5a65/sensu-slack-handler_1.0.3_linux_amd64.tar.gz" --sha512 "68720865127fbc7c2fe16ca4d7bbf2a187a2df703f4b4acae1c93e8a66556e9079e1270521999b5871473e6c851f51b34097c54fdb8d18eedb7064df9019adc8"
{{< /highlight >}}

You should see a confirmation message from sensuctl.

{{< highlight shell >}}
Created
{{< /highlight >}}

### Getting a Slack webhook

If you're already an admin of a Slack, visit `https://YOUR WORKSPACE NAME HERE.slack.com/services/new/incoming-webhook` and follow the steps to add the Incoming WebHooks integration, choose a channel, and save the settings.
(If you're not yet a Slack admin, start [here][12] to create a new workspace.)
After saving, you'll see your webhook URL under Integration Settings.

### Creating the handler

Now we'll use sensuctl to create a handler called `slack` that pipes event data to Slack using the `sensu-slack-handler` asset.
Edit the command below to include your Slack channel and webhook URL.
For more information about customizing your Sensu slack alerts, see the asset page in [Bonsai][14].

{{< highlight shell >}}
sensuctl handler create slack \
--type pipe \
--env-vars "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX" \
--command "sensu-slack-handler --channel '#monitoring'" \
--runtime-assets sensu-slack-handler
{{< /highlight >}}

You should see a confirmation message from sensuctl.

{{< highlight shell >}}
Created
{{< /highlight >}}

### Assigning the handler to a check

With the `slack` handler now created, it can be assigned to a check. Here, since
we want to receive Slack alerts whenever the CPU usage of our systems reach some
specific thresholds, we will apply our handler to the check `check-cpu`.

{{< highlight shell >}}
sensuctl check set-handlers check-cpu slack
{{< /highlight >}}

### Validating the handler

It might take a few moments, once the handler is assigned to the check, for the
check to be scheduled on the entities and the result sent back to Sensu backend,
but once an event is handled, you should see the following message in
Slack.

<div style="width:500px">
   <img class="html" src="/images/handler-slack.png"/>
</div>

Otherwise, you can verify the proper behavior of this handler by using
`sensu-backend` logs.
See the [troubleshooting guide][7] for log locations by platform.

Whenever an event is being handled, a log entry is added with the message
`"handler":"slack","level":"debug","msg":"sending event to handler"`, followed
by a second one with the message `"msg":"pipelined executed event pipe
handler","output":"","status":0`.

## Next steps

You now know how to apply a handler to a check and take action on events. From
this point, here are some recommended resources:

* Read the [handlers reference][8] for in-depth
  documentation on handlers. 
* Read our guide on [reducing alert fatigue][9] with filters.

[1]: ../../reference/events/
[2]: ../monitor-server-resources/
[3]: https://github.com/sensu/slack-handler
[4]: https://golang.org/doc/install
[5]: https://en.wikipedia.org/wiki/PATH_(variable)
[6]: https://api.slack.com/incoming-webhooks
[7]: ../troubleshooting
[8]: ../../reference/handlers
[9]: ../reduce-alert-fatigue/
[10]: https://rakyll.org/cross-compilation/
[11]: https://github.com/sensu/slack-handler/releases
[12]: https://slack.com/get-started#create
[13]: ../../reference/assets
[14]: https://bonsai.sensu.io/assets/sensu/sensu-slack-handler
[15]: ../../sensuctl/reference#creating-resources
[16]: ../../reference/filters#built-in-filters
