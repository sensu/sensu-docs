---
title: "Send data to Sumo Logic with Sensu"
linkTitle: "Send Data to Sumo Logic"
guide_title: "Send data to Sumo Logic with Sensu"
type: "guide"
description: "Put Sensu's observability pipeline into action. Follow this guide to configure a handler to send Sensu data to Sumo Logic for long-term log and metrics storage."
weight: 180
version: "6.5"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.5:
    parent: observe-process
---

Follow this guide to create a pipeline that sends data from a Sensu check to Sumo Logic for long-term logs and metrics storage.
Sensu [checks][2] are commands the Sensu agent executes that generate observability data in a status or metric [event][16].
Sensu [pipelines][14] define the event filters and actions the Sensu backend executes on the events.

To follow this guide, you’ll need to [install][4] the Sensu backend, have at least one Sensu agent running, and install and configure sensuctl.

In addition, this guide uses an example check named `check_cpu`.
If you don't already have this check in place, follow [Monitor server resources][2] to add it.

## Configure a Sensu entity

Sensu checks have a [subscriptions][11] attribute, where you specify strings to indicate which subscribers will execute the checks.
For Sensu to execute a check, at least one entity must include a subscription that matches a subscription in the check definition.
In the example in this guide, the `check_cpu` check includes the `system` subscription, so at least one entity must subscribe to `system` to run the check.

First, select the entity whose data you want to send to Sumo Logic.
To list all of your entities in the current namespace, run:

{{< code shell >}}
sensuctl entity list
{{< /code >}}

The `ID` in the response is the entity name.
Select one of the listed entities.

Before you run the following sensuctl command, replace `<ENTITY_NAME>` with the name of your entity.
Then run the command to add the `system` subscription to your entity:

{{< code shell >}}
sensuctl entity update <ENTITY_NAME>
{{< /code >}}

- For `Entity Class`, press enter.
- For `Subscriptions`, type `system` and press enter.

Finally, confirm that both Sensu services are running:

{{< code shell >}}
systemctl status sensu-backend && systemctl status sensu-agent
{{< /code >}}

The response should indicate `active (running)` for both the Sensu backend and agent.

## Register the dynamic runtime asset

The [sensu/sensu-sumologic-handler][8] [dynamic runtime asset][5] includes the scripts your [handler][9] will need to send observability data to Sumo Logic.

To add the sensu/sensu-sumologic-handler asset, run:

{{< code shell >}}
sensuctl asset add sensu/sensu-sumologic-handler:0.3.0 -r sumologic-handler
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the dynamic runtime asset: `sumologic-handler`.

The response will indicate that the asset was added:

{{< code text >}}
fetching bonsai asset: sensu/sensu-sumologic-handler:0.3.0
added asset: sensu/sensu-sumologic-handler:0.3.0

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["sumologic-handler"].
{{< /code >}}

To confirm that the asset was added to your Sensu backend, run:

{{< code shell >}}
sensuctl asset info sumologic-handler
{{< /code >}}

The response will list the available builds for the sensu/sensu-sumologic-handler dynamic runtime asset.

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
Read the [asset reference](../../../plugins/assets#dynamic-runtime-asset-builds) for more information about dynamic runtime asset builds.
{{% /notice %}}

## Set up an HTTP Logs and Metrics Source

Set up a Sumo Logic [HTTP Logs and Metrics Source][1] to collect your Sensu observability data.

{{% notice note %}}
**NOTE**: If you have an existing Sumo Logic HTTP Logs and Metrics Source, you can send Sensu data there instead of creating a new source if you wish.
Copy the HTTP Source Address URL for your existing source and skip to [Add the Sumo Logic handler](#add-the-sumo-logic-handler).
{{% /notice %}}

Log in to your Sumo Logic account and follow these instructions:

1. In the Sumo Logic left-navigation menu, click **Manage Data** and then **Collection** to open the Collection tab.

    {{< figure src="/images/go/sensu_plus/manage_data_collection.png" alt="Open the Collections tab" link="/images/go/sensu_plus/manage_data_collection.png" target="_blank" >}}

2. At the top-right of the Collection tab, click **Add Collector**.

    {{< figure src="/images/go/sensu_plus/add_collector.png" alt="Add a Sumo Logic collector" link="/images/go/sensu_plus/add_collector.png" target="_blank" >}}

3. In the Click Selector Type modal window, click **Hosted Collector**.

    {{< figure src="/images/go/sensu_plus/hosted_collector_option.png" alt="Select the hosted collector option" link="/images/go/sensu_plus/hosted_collector_option.png" target="_blank" >}}

4. In the Add Hosted Collector modal window:
    - Type **sensu** in the Name field.
    - Click **Save**.

    {{< figure src="/images/go/sensu_plus/add_hosted_collector.png" alt="Name the hosted collector" link="/images/go/sensu_plus/add_hosted_collector.png" target="_blank" >}}

5. In the Confirm prompt, click **OK**.

    {{< figure src="/images/go/sensu_plus/confirm_prompt.png" alt="Confirm your hosted collector configuration" link="/images/go/sensu_plus/confirm_prompt.png" target="_blank" >}}

6. Under Cloud APIs, click **HTTP Logs & Metrics**.

    {{< figure src="/images/go/sensu_plus/cloud_apis_http_logs_and_metrics.png" alt="Select the HTTP Logs & Metrics source" link="/images/go/sensu_plus/cloud_apis_http_logs_and_metrics.png" target="_blank" >}}

7. In the HTTP Logs & Metrics form:
    - Type **sensu-http** in the Name field.
    - Type **sensu-events** in the Source Category field.
    - Click **Save**.

    {{< figure src="/images/go/sensu_plus/http_logs_and_metrics_source.png" alt="Select options for HTTP Logs & Metrics source" link="/images/go/sensu_plus/http_logs_and_metrics_source.png" target="_blank" >}}

8. In the HTTP Source Address prompt, copy the listed URL and click OK.
You will use this URL in the next step as the `SUMOLOGIC_URL` value for the secret in your Sensu [handler][9] definition.

    {{< figure src="/images/go/sensu_plus/http_source_address_url.png" alt="Retrieve the HTTP Source Address URL" link="/images/go/sensu_plus/http_source_address_url.png" target="_blank" >}}

## Add the Sumo Logic handler

Now that you've set up a Sumo Logic HTTP Logs and Metrics Source, you can create a [handler][9] that uses the [sensu/sensu-sumologic-handler][8] dynamic runtime asset to send observability data to Sumo Logic.

The Sensu Sumo Logic Handler asset requires a `SUMOLOGIC_URL` variable.
The value for the `SUMOLOGIC_URL` variable is the Sumo Logic HTTP Source Address URL, which you retrieved in the last step of [setting up an HTTP Logs and Metrics Source][12].

{{% notice note %}}
**NOTE**: This example shows how to set your Sumo Logic HTTP Source Address URL as an environment variable and use it as a secret with Sensu's `Env` secrets provider.
Read [Use secrets management in Sensu](../../../operations/manage-secrets/secrets-management/) for more information about using the `Env` secrets provider.
{{% /notice %}}

### Configure the SUMOLOGIC_URL environment variable

To save your Sumo Logic HTTP Source Address URL as an environment variable:

1. Create the files from which the `sensu-backend` service will read environment variables.
If you have already created this file on your system, skip to step 2.

     {{< language-toggle >}}
     
{{< code shell "Debian family" >}}
sudo touch /etc/default/sensu-backend
{{< /code >}}

{{< code shell "RHEL family" >}}
sudo touch /etc/sysconfig/sensu-backend
{{< /code >}}
     
     {{< /language-toggle >}}

2. In the following code, replace `<SumoLogic_HTTPSourceAddress_URL>` with your Sumo Logic HTTP Source Address URL.
Run:

     {{< language-toggle >}}

{{< code shell "Debian family" >}}
echo 'SUMOLOGIC_URL=<SumoLogic_HTTPSourceAddress_URL>' | sudo tee -a /etc/default/sensu-backend
{{< /code >}}

{{< code shell "RHEL family" >}}
echo 'SUMOLOGIC_URL=<SumoLogic_HTTPSourceAddress_URL>' | sudo tee -a /etc/sysconfig/sensu-backend
{{< /code >}}

{{< /language-toggle >}}

3. Restart the sensu-backend:

     {{< code shell >}}
sudo systemctl restart sensu-backend
{{< /code >}}

This configures the `SUMOLOGIC_URL` environment variable to your Sumo Logic HTTP Source Address URL in the context of the sensu-backend process.

### Create the Env secret

Create a secret named `sumologic_url` that refers to the environment variable ID `SUMOLOGIC_URL`.
Run:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: Secret
api_version: secrets/v1
metadata:
  name: sumologic_url
spec:
  id: SUMOLOGIC_URL
  provider: env
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "Secret",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "sumologic_url"
  },
  "spec": {
    "id": "SUMOLOGIC_URL",
    "provider": "env"
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

Now you can refer to the `sumologic_url` secret in your handler to securely pass your Sumo Logic HTTP Source Address URL.

### Create a Sumo Logic handler

Run the following command to create a handler to send Sensu observability data to your Sumo Logic HTTP Logs and Metrics Source:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: Handler
api_version: core/v2
metadata:
  name: sumologic
spec:
  command: >-
    sensu-sumologic-handler --send-log --send-metrics
    --source-host "{{ .Entity.Name }}"
    --source-name "{{ .Check.Name }}"
  type: pipe
  runtime_assets:
  - sumologic-handler
  secrets:
  - name: SUMOLOGIC_URL
    secret: sumologic_url
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "sumologic"
  },
  "spec": {
    "command": "sensu-sumologic-handler --send-log --send-metrics --source-host \"{{ .Entity.Name }}\" --source-name \"{{ .Check.Name }}\"",
    "type": "pipe",
    "runtime_assets": [
      "sumologic-handler"
    ],
    "secrets": [
      {
        "name": "SUMOLOGIC_URL",
        "secret": "sumologic_url"
      }
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

Make sure that your handler was added by retrieving the complete handler definition in YAML or JSON format:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl handler info sumologic --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl handler info sumologic --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The response will list the complete handler resource definition:

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  name: sumologic
spec:
  command: sensu-sumologic-handler --send-log --send-metrics --source-host "{{ .Entity.Name }}" --source-name "{{ .Check.Name }}"
  env_vars: null
  filters: null
  handlers: null
  runtime_assets:
  - sumologic-handler
  secrets:
  - name: SUMOLOGIC_URL
    secret: sumologic_url
  timeout: 0
  type: pipe
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "sumologic"
  },
  "spec": {
    "command": "sensu-sumologic-handler --send-log --send-metrics --source-host \"{{ .Entity.Name }}\" --source-name \"{{ .Check.Name }}\"",
    "env_vars": null,
    "filters": null,
    "handlers": null,
    "runtime_assets": [
      "sumologic-handler"
    ],
    "secrets": [
      {
        "name": "SUMOLOGIC_URL",
        "secret": "sumologic_url"
      }
    ],
    "timeout": 0,
    "type": "pipe"
  }
}
{{< /code >}}

{{< /language-toggle >}}

{{% notice protip %}}
**PRO TIP**: You can also [view complete resource definitions in the Sensu web UI](../../../web-ui/view-manage-resources/#view-resource-data-in-the-web-ui).
{{% /notice %}}

## Create a pipeline with the Sumo Logic handler

With your Sumo Logic handler configured, you can add it to a [pipeline][14] workflow.
A single pipeline workflow can include one or more event filters, one mutator, and one handler.

To send data for all events (as opposed to only incidents), create a pipeline that includes only the Sumo Logic handler you've already configured and the built-in [not_silenced event filter][20] &mdash; no mutators.
To add the pipeline, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: Pipeline
api_version: core/v2
metadata:
  name: sensu_to_sumo
spec:
  workflows:
  - name: logs_to_sumologic
    filters:
    - name: not_silenced
      type: EventFilter
      api_version: core/v2
    handler:
      name: sumologic
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
    "name": "sensu_to_sumo"
  },
  "spec": {
    "workflows": [
      {
        "name": "logs_to_sumologic",
        "filters": [
          {
            "name": "not_silenced",
            "type": "EventFilter",
            "api_version": "core/v2"
          }
        ],
        "handler": {
          "name": "sumologic",
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

To use the `sensu_to_sumo` pipeline, list it in a check definition's [pipelines array][15].
This example uses the `check_cpu` check created in [Monitor server resources][3], but you can add the pipeline to any Sensu check you wish.
All the observability events that the check produces will be processed according to the pipeline's workflows.

Assign your `sensu_to_sumo` pipeline to the `check_cpu` check to start sending Sensu data to Sumo Logic.

To open the check definition in your text editor, run: 

{{< code shell >}}
sensuctl edit check check_cpu
{{< /code >}}

Replace the `pipelines: []` line with the following array:

{{< code yml >}}
  pipelines:
  - type: Pipeline
    api_version: core/v2
    name: sensu_to_sumo
{{< /code >}}

To confirm that the updated `check_cpu` resource definition includes the pipelines reference, run:

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
spec:
  check_hooks: null
  command: check-cpu-usage -w 75 -c 90
  env_vars: null
  handlers: []
  high_flap_threshold: 0
  interval: 15
  low_flap_threshold: 0
  output_metric_format: prometheus_text
  output_metric_handlers: null
  pipelines:
  - api_version: core/v2
    name: sensu_to_sumo
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
    "created_by": "admin"
  },
  "spec": {
    "check_hooks": null,
    "command": "check-cpu-usage -w 75 -c 90",
    "env_vars": null,
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 15,
    "low_flap_threshold": 0,
    "output_metric_format": "prometheus_text",
    "output_metric_handlers": null,
    "pipelines": [
      {
        "api_version": "core/v2",
        "name": "sensu_to_sumo",
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

## View your Sensu data in Sumo Logic

It will take a few moments after you add the pipeline to the check for your Sensu observability data to appear in Sumo Logic.
Use the [Live Tail][13] feature to confirm that your data is reaching Sumo Logic.

1. In Sumo Logic, click the **+ New** button and select **Live Tail** from the drop-down menu.

    {{< figure src="/images/go/send_data_to_sumo_logic/new_button_live_tail.png" alt="Click the + New button and select Live Tail" link="/images/go/send_data_to_sumo_logic/new_button_live_tail.png" target="_blank" >}}

2. In the Live Tail search field, enter `_collector=sensu` and click **Run**.

    {{< figure src="/images/go/send_data_to_sumo_logic/live_tail_run_button.png" alt="Location of Live Tail Run button" link="/images/go/send_data_to_sumo_logic/live_tail_run_button.png" target="_blank" >}}

Within a few seconds, the Live Tail page should begin to display your Sensu observability data.

{{< figure src="/images/go/send_data_to_sumo_logic/live_tail_running.png" alt="Live Tail results for the 'sensu' collector" link="/images/go/send_data_to_sumo_logic/live_tail_running.png" target="_blank" >}}


If you see Sensu data on the Live Tail page, well done!
You have a successful workflow that sends Sensu observability data to your Sumo Logic account.

## Next steps

To share and reuse the check, handler, and pipeline like code, [save them to files][6] and start building a [monitoring as code repository][7].

Learn more about the [sensu/sensu-sumologic-handler][19] dynamic runtime asset.
You can also configure a [Sumo Logic dashboard][10] to search, view, and analyze the Sensu data you're sending to your Sumo Logic HTTP Logs and Metrics Source.

In addition to the traditional handler we used in this example, you can use [Sensu Plus][17], our built-in integration, to send metrics to Sumo Logic with a streaming [Sumo Logic metrics handler][18].


[1]: https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source
[2]: ../../observe-schedule/checks/
[3]: ../../observe-schedule/monitor-server-resources/
[4]: ../../../operations/deploy-sensu/install-sensu/
[5]: ../../../plugins/assets/
[6]: ../../../operations/monitoring-as-code/#build-as-you-go
[7]: ../../../operations/monitoring-as-code/
[8]: https://bonsai.sensu.io/assets/sensu/sensu-sumologic-handler
[9]: ../handlers/
[10]: https://help.sumologic.com/Visualizations-and-Alerts/Dashboards
[11]: ../../observe-schedule/subscriptions/
[12]: #set-up-an-http-logs-and-metrics-source
[13]: https://help.sumologic.com/05Search/Live-Tail
[14]: ../pipelines/
[15]: ../../observe-schedule/checks/#pipelines-attribute
[16]: ../../observe-events/
[17]: ../../../sensu-plus/
[18]: ../sumo-logic-metrics-handlers/
[19]: ../../../plugins/featured-integrations/sumologic/
[20]: ../../observe-filter/filters/#built-in-filter-not_silenced
