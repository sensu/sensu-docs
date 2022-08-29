---
title: "Send Slack alerts with handlers"
linkTitle: "Send Slack Alerts"
guide_title: "Send Slack alerts with handlers"
type: "guide"
description: "Send alerts to Slack with Sensu handlers, which allow you to send events to alert you of incidents and help you resolve them more quickly."
weight: 30
version: "6.4"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-6.4:
    parent: observe-process
---

Sensu event handlers are actions the Sensu backend executes on [events][1].
You can use handlers to send an email alert, create or resolve incidents (in PagerDuty, for example), or store metrics in a time-series database like InfluxDB.

This guide will help you send alerts to Slack in the channel `monitoring` by configuring a handler named `slack` to a check named `check_cpu`.
If you don't already have this check in place, follow [Monitor server resources][2] to add it.

Before you start, follow the RHEL/CentOS [install instructions][17] to install and configure the Sensu backend, the Sensu agent, and sensuctl.

## Configure a Sensu entity

Every Sensu agent has a defined set of [subscriptions][21] that determine which checks the agent will execute.
For an agent to execute a specific check, you must specify the same subscription in the agent configuration and the check definition.
To run the `check_cpu` check, you'll need a Sensu entity with the subscription `system`.

First, find your entity name:

{{< code shell >}}
sensuctl entity list
{{< /code >}}

The `ID` in the response is the name of your entity.

Replace `<ENTITY_NAME>` with the name of your entity in the [sensuctl][20] command below.
Then run the command to add the `system` [subscription][21] to your entity:

{{< code shell >}}
sensuctl entity update <ENTITY_NAME>
{{< /code >}}

- For `Entity Class`, press enter.
- For `Subscriptions`, type `system` and press enter.

Confirm both Sensu services are running:

{{< code shell >}}
systemctl status sensu-backend && systemctl status sensu-agent
{{< /code >}}

The response should indicate `active (running)` for both the Sensu backend and agent.

## Register the dynamic runtime asset

[Dynamic runtime assets][13] are shareable, reusable packages that help you deploy Sensu plugins.
In this guide, you'll use the [sensu/sensu-slack-handler][14] dynamic runtime asset to power a `slack` handler.

Use [`sensuctl asset add`][10] to register the [sensu/sensu-slack-handler][14] dynamic runtime asset:

{{< code shell >}}
sensuctl asset add sensu/sensu-slack-handler:1.0.3 -r sensu-slack-handler
{{< /code >}}

The response will indicate that the asset was added:

{{< code text >}}
fetching bonsai asset: sensu/sensu-slack-handler:1.0.3
added asset: sensu/sensu-slack-handler:1.0.3

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["sensu-slack-handler"].
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the dynamic runtime asset: `sensu-slack-handler`.

You can also download the latest dynamic runtime asset definition for your platform from [Bonsai][14] and register the asset with `sensuctl create --file filename.yml` or `sensuctl create --file filename.json`.

You should receive a confirmation message from sensuctl:

{{< code shell >}}
Created
{{< /code >}}

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
Read the [asset reference](../../../plugins/assets#dynamic-runtime-asset-builds) for more information about dynamic runtime asset builds.
{{% /notice %}}

## Get a Slack webhook

If you're already the admin of a Slack, visit `https://YOUR_WORKSPACE_NAME_HERE.slack.com/services/new/incoming-webhook` and follow the steps to add the Incoming WebHooks integration, choose a channel, and save the settings.
If you're not yet a Slack admin, [create a new workspace][12] and then create your webhook.

After saving, you can find your webhook URL under Integration Settings.

## Create a handler

Use sensuctl to create a handler called `slack` that pipes observation data (events) to Slack using the sensu/sensu-slack-handler dynamic runtime asset.
Edit the sensuctl command below to include your Slack webhook URL and the channel where you want to receive observation event data.
For more information about customizing your Slack alerts, read the [Sensu Slack Handler page in Bonsai][14].

{{< code shell >}}
sensuctl handler create slack \
--type pipe \
--env-vars "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX" \
--command "sensu-slack-handler --channel '#monitoring'" \
--filters not_silenced \
--runtime-assets sensu-slack-handler
{{< /code >}}

You should receive a confirmation message:

{{< code text >}}
Created
{{< /code >}}

The `sensuctl handler create slack` command creates a handler resource.
To view the `slack` handler definition, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl handler info slack --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl handler info slack --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The `slack` handler resource definition will be similar to this example:

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  name: slack
spec:
  command: sensu-slack-handler --channel '#monitoring'
  env_vars:
  - SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX
  filters:
  - not_silenced
  handlers: null
  runtime_assets:
  - sensu-slack-handler
  secrets: null
  timeout: 0
  type: pipe
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "slack"
  },
  "spec": {
    "command": "sensu-slack-handler --channel '#monitoring'",
    "env_vars": [
      "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T0000/B000/XXXXXXXX"
    ],
    "filters": [
      "not_silenced"
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
{{< /code >}}

{{< /language-toggle >}}

You can share and reuse this handler like code &mdash; [save it to a file][15] and start building a [monitoring as code repository][16].

## Assign the handler to a check

With the `slack` handler created, you can assign it to a check.
To continue this example, use the `check_cpu` check created in [Monitor server resources][2].

Assign your `slack` handler to the `check_cpu` check to receive Slack alerts when the CPU usage of your systems reaches the specific thresholds set in the check command:

{{< code shell >}}
sensuctl check set-handlers check_cpu slack
{{< /code >}}

To view the updated `check_cpu` resource definition, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl check info check_cpu --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl check info check_cpu --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The updated check definition will be similar to this example:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
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
    "created_by": "admin",
    "name": "check_cpu",
    "namespace": "default"
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

## Validate the handler

It might take a few moments after you assign the handler to the check for the check to be scheduled on the entities and the result sent back to Sensu backend.
After an event is handled, you should receive the following message in Slack:

{{< figure src="/images/handler-slack.png" alt="Example Slack message" link="/images/handler-slack.png" target="_blank" >}}

Verify the proper behavior of this handler with `sensu-backend` logs.
Read [Troubleshoot Sensu][7] for log locations by platform.

Whenever an event is being handled, a log entry is added with the message `"handler":"slack","level":"debug","msg":"sending event to handler"`, followed by a second log entry with the message `"msg":"event pipe handler executed","output":"","status":0`.

## Next steps

Now that you know how to apply a handler to a check and take action on events, read the [handlers reference][8] for in-depth handler documentation and check out the [Reduce alert fatigue][9] guide.

Follow [Send PagerDuty alerts with Sensu][11] to configure a check that generates status events and a handler that sends Sensu alerts to PagerDuty for non-OK events.


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
[11]: ../../../observability-pipeline/observe-process/send-pagerduty-alerts/
[12]: https://slack.com/get-started#/create
[13]: ../../../plugins/assets/
[14]: https://bonsai.sensu.io/assets/sensu/sensu-slack-handler
[15]: ../../../operations/monitoring-as-code/#build-as-you-go
[16]: ../../../operations/monitoring-as-code/
[17]: ../../../operations/deploy-sensu/install-sensu/
[20]: ../../../sensuctl/
[21]: ../../observe-schedule/subscriptions/
