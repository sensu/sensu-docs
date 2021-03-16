---
title: "Send PagerDuty alerts with Sensu"
linkTitle: "Send PagerDuty Alerts"
guide_title: "Send PagerDuty alerts with Sensu"
type: "guide"
description: "See Sensu Go's observability pipeline in action. Follow this guide to configure a handler that sends Sensu alerts to PagerDuty."
weight: 25
version: "6.2"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.2:
    parent: observe-process
---

Follow this guide to add Sensu Nagios Foundation and PagerDuty dynamic runtime assets and configure your Sensu Go backend with a handler that will send critical events to PagerDuty.

One quick note before you begin: you'll need your [PagerDuty API integration key][1] to complete this scenario.

## Install and configure Sensu Go

Follow the RHEL/CentOS [install instructions][4] to install and configure the Sensu backend, the Sensu agent, and sensuctl.

Use [sensuctl][12] to add the `system` [subscription][13] to the entity the Sensu agent is observing.
Before you run the following code, replace `ENTITY_NAME` with the name of the entity on your system.

{{% notice note %}}
**NOTE**: To find your entity name, run `sensuctl entity list`.
The `ID` is the name of your entity.
{{% /notice %}}

{{< code shell >}}
sensuctl entity update ENTITY_NAME
{{< /code >}}

- For `Entity Class`, press enter.
- For `Subscriptions`, type `system` and press enter.

Confirm both Sensu services are running:

{{< code shell >}}
systemctl status sensu-backend && systemctl status sensu-agent
{{< /code >}}

## Add the file_exists check

Before Sensu can send alerts to your PagerDuty account, you'll need a [check][2] to generate events.
In this guide, you will use a `file_exists` check, which is included in Sensu's [Nagios Foundation][3] dynamic runtime [asset][5].

Before you can add the check, you need to add the Nagios Foundation asset to your Sensu configuration:

{{< code shell >}}
sensuctl asset add ncr-devops-platform/nagiosfoundation
{{< /code >}}

To confirm that the asset was added to your Sensu backend, run:

{{< code shell >}}
sensuctl asset info ncr-devops-platform/nagiosfoundation
{{< /code >}}

You should see `=== ncr-devops-platform/nagiosfoundation` followed by a list of available builds for the asset.

Now that you've added the Nagios Foundation dynamic runtime asset, you can add its `file_exists` check to your Sensu backend.
Use sensuctl to add the check:

{{< code shell >}}
sensuctl check create file_exists --command "check_file_exists --pattern /tmp/my-file.txt" --subscriptions system --handlers pagerduty --interval 10 --runtime-assets ncr-devops-platform/nagiosfoundation
{{< /code >}}

To confirm that the check was added to your Sensu backend and view the check definition in YAML or JSON format, run:

{{< language-toggle >}}
{{< code shell "YML" >}}
sensuctl check info file_exists --format yaml
{{< /code >}}
{{< code shell "JSON" >}}
sensuctl check info file_exists --format json
{{< /code >}}
{{< /language-toggle >}}

The response will list the complete check resource definition:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  created_by: admin
  name: file_exists
  namespace: default
spec:
  check_hooks: null
  command: check_file_exists --pattern /tmp/my-file.txt
  env_vars: null
  handlers:
  - pagerduty
  high_flap_threshold: 0
  interval: 10
  low_flap_threshold: 0
  output_metric_format: ""
  output_metric_handlers: null
  proxy_entity_name: ""
  publish: true
  round_robin: false
  runtime_assets:
  - ncr-devops-platform/nagiosfoundation
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
    "name": "file_exists",
    "namespace": "default"
  },
  "spec": {
    "check_hooks": null,
    "command": "check_file_exists --pattern /tmp/my-file.txt",
    "env_vars": null,
    "handlers": [
      "pagerduty"
    ],
    "high_flap_threshold": 0,
    "interval": 10,
    "low_flap_threshold": 0,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "proxy_entity_name": "",
    "publish": true,
    "round_robin": false,
    "runtime_assets": [
      "ncr-devops-platform/nagiosfoundation"
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

The check command includes the path for the file that the check will look for on your system, `/tmp/my-file.txt`.
For this guide, you'll add `/tmp/my-file.txt` as a temporary file:

{{< code shell >}}
touch /tmp/my-file.txt
{{< /code >}}

In production, you could replace `/tmp/my-file.txt` with the file path or globbing pattern for any existing file or files on your system.

Well done!
In the next step, you'll configure your workflow for sending Sensu alerts to your PagerDuty account.

## Add the PagerDuty handler

The [Sensu PagerDuty Handler][8] dynamic runtime asset includes the scripts you will need to send events to PagerDuty.

To add the PagerDuty handler asset, run:

{{< code shell >}}
sensuctl asset add sensu/sensu-pagerduty-handler
{{< /code >}}

Once again, it's a good idea to confirm that the asset was added to your Sensu backend. Run:

{{< code shell >}}
sensuctl asset info sensu/sensu-pagerduty-handler
{{< /code >}}

The response will list the available builds for the PagerDuty handler dynamic runtime asset.

Now that you've added the Sensu PagerDuty Handler dynamic runtime asset, you can create a [handler][9] that uses the asset to send non-OK events to PagerDuty.
This requires you to update the handler command by adding your PagerDuty API key.

In the following command, replace `YOUR_PAGERDUTY_KEY` with your [PagerDuty API integration key][1].
Then run the updated command:

{{< code shell >}}
sensuctl handler create pagerduty --type pipe --filters is_incident --runtime-assets sensu/sensu-pagerduty-handler --command "sensu-pagerduty-handler -t YOUR_PAGERDUTY_KEY"
{{< /code >}}

Make sure that your handler was added by retrieving the complete handler definition in YAML or JSON format:

{{< language-toggle >}}
{{< code shell "YML" >}}
sensuctl handler info pagerduty --format yaml
{{< /code >}}
{{< code shell "JSON" >}}
sensuctl handler info pagerduty --format json
{{< /code >}}
{{< /language-toggle >}}

The response will list the complete check resource definition:

{{< language-toggle >}}

{{< code yaml >}}
---
type: Handler
api_version: core/v2
metadata:
  created_by: admin
  name: pagerduty
  namespace: default
spec:
  command: sensu-pagerduty-handler -t YOUR_PAGERDUTY_KEY
  env_vars: null
  filters:
  - is_incident
  handlers: null
  runtime_assets:
  - sensu/sensu-pagerduty-handler
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
    "command": "sensu-pagerduty-handler -t YOUR_PAGERDUTY_TOKEN",
    "env_vars": null,
    "filters": [
      "is_incident"
    ],
    "handlers": null,
    "runtime_assets": [
      "sensu/sensu-pagerduty-handler"
    ],
    "secrets": null,
    "timeout": 0,
    "type": "pipe"
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Trigger an event

With your `file_exists` check and PagerDuty handler workflow in place, you can remove a file to cause Sensu to send a non-OK event.

Remove the file `/tmp/my-file.txt`:

{{< code shell >}}
rm /tmp/my-file.txt
{{< /code >}}

This will make sure the file is **not** there for Sensu to find the next time the `file_exists` check runs.
After about 10 seconds, Sensu will detect that `my-file.txt` is missing and reflect that in an event.

To view the event with sensuctl, run:

{{< code shell >}}
sensuctl event list
{{< /code >}}

The response should show that the file removal resulted in a CRITICAL (2) event:

{{< code shell >}}
     Entity         Check                                      Output                                   Status   Silenced             Timestamp                             UUID                  
 ────────────── ───────────── ──────────────────────────────────────────────────────────────────────── ──────── ────────── ─────────────────────────────── ────────────────────────────────────── 
  host01         file_exists   CheckFileExists CRITICAL - 0 files matched pattern /tmp/my-file.txt           2   false      2021-03-15 19:28:21 +0000 UTC   1b4266ae-7200-4728-a0n4-2f50f7a56613
{{< /code >}}

Open the Sensu [web UI][11] to see the events the `file_exists` check is generating.
Visit http://127.0.0.1:3000, and log in as the admin user (created during [initialization][10] when you installed the Sensu backend).
The failing check's events will be listed on the Events page.

## Observe the alert in PagerDuty

After Sensu detects the non-OK event, the handler you set up will send the alert to PagerDuty.
Log in to your PagerDuty account to see an event similar to this one:

<div style="text-align:center">
<img alt="Example alert in PagerDuty for failing Sensu check" title="Example alert in PagerDuty for failing Sensu check" src="/images/pagerduty_alert_example.png" >
</div>

## Resolve the alert in PagerDuty

To complete your workflow, restore the file that you removed so Sensu sends a resolution to PagerDuty:

{{< code shell >}}
touch /tmp/my-file.txt
{{< /code >}}

In your PagerDuty account, the alert should now be listed under the "Resolved" tab.

To view the resolved event with sensuctl, run:

{{< code shell >}}
sensuctl event list
{{< /code >}}

The response should show that the file is restored, with an OK (0) status:

{{< code shell >}}
     Entity         Check                                      Output                                   Status   Silenced             Timestamp                             UUID                  
 ────────────── ───────────── ──────────────────────────────────────────────────────────────────────── ──────── ────────── ─────────────────────────────── ────────────────────────────────────── 
  host01         file_exists   CheckFileExists OK - 1 files matched pattern /tmp/my-file.txt                 0   false      2021-03-15 19:58:31 +0000 UTC   73f382fe-4290-48e8-955a-6efd54347b43
{{< /code >}}

The [web UI][11] Events page will also show that the `file_check` check is passing.

## Next steps

You should now have a working set-up with a `file_exists` check and a handler that sends alerts to your PagerDuty account.
To share and reuse the check and handler like code, [save them to files][6] and start building a [monitoring as code repository][7].

Learn more about the [Sensu PagerDuty integration][14] and our curated, configurable [quick-start template][15] for incident management to integrate Sensu with your existing PagerDuty workflows.


[1]: https://support.pagerduty.com/docs/generating-api-keys#section-events-api-keys
[2]: ../../observe-schedule/checks/
[3]: https://bonsai.sensu.io/assets/ncr-devops-platform/nagiosfoundation
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
