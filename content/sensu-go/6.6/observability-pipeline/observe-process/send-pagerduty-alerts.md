---
title: "Send PagerDuty alerts with Sensu"
linkTitle: "Send PagerDuty Alerts"
guide_title: "Send PagerDuty alerts with Sensu"
type: "guide"
description: "Put Sensu Go's observability pipeline into action. Follow this guide to configure a check that generates status events and a handler that sends Sensu alerts to PagerDuty for non-OK events."
weight: 25
version: "6.6"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.6:
    parent: observe-process
---

Sensu [checks][2] are commands the Sensu agent executes that generate observability data in a status or metric [event][19].
Sensu [pipelines][20] define the event filters and actions the Sensu backend executes on the events.
Follow this guide to create a pipeline that sends incident alerts to PagerDuty.

This guide will help you send alerts to PagerDuty by configuring a pipeline and adding it to a check named `check_cpu`.
If you don't already have this check in place, follow [Monitor server resources][3] to add it.

One quick note before you begin: you'll need your [PagerDuty API integration key][1] to set up the handler in this guide.

## Install and configure Sensu Go

Follow the RHEL/CentOS [install instructions][4] to install and configure the Sensu backend, the Sensu agent, and sensuctl.

Find your entity name:

{{< code shell >}}
sensuctl entity list
{{< /code >}}

The `ID` in the response is the name of your entity.

Replace `<entity_name>` with the name of your entity in the [sensuctl][12] command below.
Then run the command to add the `system` [subscription][13] to your entity:

{{< code shell >}}
sensuctl entity update <entity_name>
{{< /code >}}

- For `Entity Class`, press enter.
- For `Subscriptions`, type `system` and press enter.

Confirm both Sensu services are running:

{{< code shell >}}
systemctl status sensu-backend && systemctl status sensu-agent
{{< /code >}}

## Register the dynamic runtime asset

The [Sensu PagerDuty Handler][8] dynamic runtime asset includes the scripts you will need to send events to PagerDuty.

To add the PagerDuty handler asset, run:

{{< code shell >}}
sensuctl asset add sensu/sensu-pagerduty-handler:2.2.0 -r pagerduty-handler
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the dynamic runtime asset: `pagerduty-handler`.

The response will indicate that the asset was added:

{{< code text >}}
fetching bonsai asset: sensu/sensu-pagerduty-handler:2.2.0
added asset: sensu/sensu-pagerduty-handler:2.2.0

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["pagerduty-handler"].
{{< /code >}}

To confirm that the asset was added to your Sensu backend, run:

{{< code shell >}}
sensuctl asset info pagerduty-handler
{{< /code >}}

The response will list the available builds for the Sensu PagerDuty Handler dynamic runtime asset.

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
Read [the asset reference](../../../plugins/assets#dynamic-runtime-asset-builds) for more information about dynamic runtime asset builds.
{{% /notice %}}

## Add the PagerDuty handler

Now that you've added the dynamic runtime asset, you can create a [handler][9] that uses the asset to send non-OK events to PagerDuty.

In the following command, replace `<pagerduty_key>` with your [PagerDuty API integration key][1].
Then run the updated command:

{{< code shell >}}
sensuctl handler create pagerduty \
--type pipe \
--runtime-assets pagerduty-handler \
--command "sensu-pagerduty-handler -t <pagerduty_key>"
{{< /code >}}

{{% notice note %}}
**NOTE**: For checks whose handlers use the Sensu PagerDuty Handler dynamic runtime asset (like the one you've created in this guide), you can use an alternative method for [authenticating and routing alerts based on PagerDuty teams](https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler#pager-teams).<br><br>
To use this option, list the teams' PagerDuty API integration keys in the handler definition as environment variables or secrets or in the `/etc/default/sensu-backend` configuration file as environment variables.
Then, add check or agent annotations to specify which PagerDuty teams should receive alerts based on check events.
Sensu will look up the key in the handler definition or backend configuration file that corresponds to the team name in the check annotation to authenticate and send alerts.
{{% /notice %}}

Make sure that your handler was added by retrieving the complete handler definition in YAML or JSON format:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl handler info pagerduty --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl handler info pagerduty --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The response will list the complete handler resource definition:

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  created_by: admin
  name: pagerduty
  namespace: default
spec:
  command: sensu-pagerduty-handler -t <pagerduty_key>
  env_vars: null
  handlers: null
  runtime_assets:
  - pagerduty-handler
  secrets: null
  timeout: 0
  type: pipe
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "created_by": "admin",
    "name": "pagerduty",
    "namespace": "default"
  },
  "spec": {
    "command": "sensu-pagerduty-handler -t <pagerduty_key>",
    "env_vars": null,
    "handlers": null,
    "runtime_assets": [
      "pagerduty-handler"
    ],
    "secrets": null,
    "timeout": 0,
    "type": "pipe"
  }
}
{{< /code >}}

{{< /language-toggle >}}

{{% notice protip %}}
**PRO TIP**: You can also [view complete resource definitions in the Sensu web UI](../../../web-ui/view-manage-resources/#view-resource-data-in-the-web-ui).
{{% /notice %}}

## Create a pipeline with an event filter and handler

With your handler configured, you can add it to a [pipeline][17] workflow.
A single pipeline workflow can include one or more filters, one mutator, and one handler.

In this case, the pipeline includes the built-in [is_incident][21] event filter and the PagerDuty handler you've already configured.
To create the pipeline, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: Pipeline
api_version: core/v2
metadata:
  name: cpu_check_alerts
spec:
  workflows:
  - name: pagerduty_alerts
    filters:
    - name: is_incident
      type: EventFilter
      api_version: core/v2
    handler:
      name: pagerduty
      type: Handler
      api_version: core/v2
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "Pipeline",
  "api_version": "core/v2",
  "metadata": {
    "name": "cpu_check_alerts"
  },
  "spec": {
    "workflows": [
      {
        "name": "pagerduty_alerts",
        "filters": [
          {
            "name": "is_incident",
            "type": "EventFilter",
            "api_version": "core/v2"
          }
        ],
        "handler": {
          "name": "pagerduty",
          "type": "Handler",
          "api_version": "core/v2"
        }
      }
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

## Assign the pipeline to a check

To use the `cpu_check_alerts` pipeline, list it in a check definition's [pipelines array][18] (in this case, the `check_cpu` check created in [Monitor server resources][3]).
All the observability events that the check produces will be processed according to the pipeline's workflows.

Assign your `cpu_check_alerts` pipeline to the `check_cpu` check to receive Slack alerts when the CPU usage of your system reaches the specific thresholds set in the check command.

To open the check definition in your text editor, run: 

{{< code shell >}}
sensuctl edit check check_cpu
{{< /code >}}

Replace the `pipelines: []` line with the following array:

{{< code yml >}}
  pipelines:
  - type: Pipeline
    api_version: core/v2
    name: cpu_check_alerts
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
  created_by: admin
  name: check_cpu
  namespace: default
spec:
  check_hooks: null
  command: check-cpu-usage -w 75 -c 90
  env_vars: null
  handlers: []
  high_flap_threshold: 0
  interval: 10
  low_flap_threshold: 0
  output_metric_format: ""
  output_metric_handlers: null
  pipelines:
  - api_version: core/v2
    name: cpu_check_alerts
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
    "created_by": "admin"
  },
  "spec": {
    "check_hooks": null,
    "command": "check-cpu-usage -w 75 -c 90",
    "env_vars": null,
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 10,
    "low_flap_threshold": 0,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "pipelines": [
      {
        "api_version": "core/v2",
        "name": "cpu_check_alerts",
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

## Observe an alert in PagerDuty

It might take a few moments after you add the pipeline to the check for the check to be scheduled on entities with the `system` subscription and the result sent back to Sensu backend.

As configured, the `cpu_check` command requires CPU usage to reach 75% capacity to send a non-OK event.
To trigger an alert and confirm that the check and pipeline are working properly, adjust the check command to reduce the usage percentage required for a non-OK event.

To open the check definition in your text editor, run:

{{< code shell >}}
sensuctl edit check check_cpu
{{< /code >}}

Replace the `-w` value in the `command` line with `1` and save the updated check definition:

{{< code yml >}}
  command: check-cpu-usage -w 1 -c 90
{{< /code >}}

You should see a response to confirm the update:

{{< code shell >}}
Updated /api/core/v2/namespaces/default/checks/check_cpu
{{< /code >}}

After Sensu detects a non-OK event, the handler in your pipeline will send the alert to your PagerDuty account, where you should see an event similar to this one:

{{< figure src="/images/pipeline_pagerduty_alert_example.png" alt="Example alert in PagerDuty for failing Sensu check" link="/images/pipeline_pagerduty_alert_example.png" target="_blank" >}}

## Resolve the alert in PagerDuty

To complete your workflow, restore the CPU usage command to 75% so Sensu sends a resolution to PagerDuty.
Open the check definition in your text editor:

{{< code shell >}}
sensuctl edit check check_cpu
{{< /code >}}

Replace the `-w` value in the `command` line with `75` and save the updated check definition:

{{< code yml >}}
  command: check-cpu-usage -w 75 -c 90
{{< /code >}}

In your PagerDuty account, the alert should now be listed under the "Resolved" tab.

To view the resolved event with sensuctl, run:

{{< code shell >}}
sensuctl event list
{{< /code >}}

The response should show that the `cpu_check` has an OK (0) status:

{{< code shell >}}
     Entity        Check                                                                                                      Output                                                                                                    Status   Silenced             Timestamp                             UUID                  
─────────────── ─────────── ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── ──────── ────────── ─────────────────────────────── ───────────────────────────────────────
  sensu-centos   check_cpu   check-cpu-usage OK: 4.17% CPU usage | cpu_idle=95.83, cpu_system=1.04, cpu_user=3.13, cpu_nice=0.00, cpu_iowait=0.00, cpu_irq=0.00, cpu_softirq=0.00, cpu_steal=0.00, cpu_guest=0.00, cpu_guestnice=0.00        0   false      2021-11-17 21:09:07 +0000 UTC   xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  
{{< /code >}}

The [web UI][11] Events page will also show that the `cpu_check` check is passing.

## Next steps

You should now have a working set-up with a check and a pipeline that sends alerts to your PagerDuty account.
To share and reuse the check, handler, and pipeline like code, [save them to files][6] and start building a [monitoring as code repository][7].

You can customize your PagerDuty handler with configuration options like [severity mapping][16], [PagerDuty team-based routing and authentication][17] via check and agent annotations, and [event-based templating][18].
Learn more about the [Sensu PagerDuty integration][14] and our curated, configurable [quick-start template][15] for incident management to integrate Sensu with your existing PagerDuty workflows.


[1]: https://support.pagerduty.com/docs/generating-api-keys#section-events-api-keys
[2]: ../../observe-schedule/checks/
[3]: ../../observe-schedule/monitor-server-resources/
[4]: ../../../operations/deploy-sensu/install-sensu/
[5]: ../../../plugins/assets/
[6]: ../../../operations/monitoring-as-code/#build-as-you-go
[7]: ../../../operations/monitoring-as-code/
[8]: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler
[9]: ../handlers/
[10]: ../../../operations/deploy-sensu/install-sensu/#3-initialize
[11]: ../../../web-ui/
[12]: ../../../sensuctl/
[13]: ../../observe-schedule/subscriptions/
[14]: ../../../plugins/supported-integrations/pagerduty/
[15]: ../../../plugins/supported-integrations/pagerduty/#get-the-plugin
[16]: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler#pagerduty-severity-mapping
[17]: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler#pager-teams
[18]: ../handler-templates/
[19]: ../../observe-events/
[20]: ../pipelines/
[21]: ../../observe-filter/filters/#built-in-filter-is_incident
