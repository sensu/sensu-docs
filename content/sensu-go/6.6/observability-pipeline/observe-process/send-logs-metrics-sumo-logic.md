---
title: "Send data to Sumo Logic with Sensu"
linkTitle: "Send Data to Sumo Logic"
guide_title: "Send data to Sumo Logic with Sensu"
type: "guide"
description: "Put Sensu Go's observability pipeline into action. Follow this guide to configure a check that generates status and metrics events and a handler that sends Sensu data to Sumo Logic for long-term log and metrics storage."
weight: 19
version: "6.6"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.6:
    parent: observe-process
---

Sensu [checks][2] are commands the Sensu agent executes that generate observability data in a status or metric [event][19].
Sensu [pipelines][20] define the event filters and actions the Sensu backend executes on the events.
Follow this guide to create a pipeline that sends data from Sensu events to Sumo Logic for long-term log and metrics storage.

This guide will help you send data to Sumo Logic by configuring a pipeline and adding it to a check named `TODO`.
If you don't already have this check in place, follow [Monitor server resources][3] to add it.

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

The [Sensu Sumo Logic Handler][8] dynamic runtime asset includes the scripts you will need to send events to PagerDuty.

To add the Sumo Logic handler asset, run:

{{< code shell >}}
sensuctl asset add sensu/sensu-sumologic-handler:0.3.0 -r sumologic-handler
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the dynamic runtime asset: `sumologic-handler`.

The response will indicate that the asset was added:

{{< code shell >}}
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

The response will list the available builds for the Sensu Sumo Logic Handler dynamic runtime asset.

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
Read [the asset reference](../../../plugins/assets#dynamic-runtime-asset-builds) for more information about dynamic runtime asset builds.
{{% /notice %}}

## Set up an HTTP Logs and Metrics Source

Set up a Sumo Logic HTTP Logs and Metrics Source to collect your Sensu observability data:

1. In the Sumo Logic left-navigation menu, click **Manage Data** and then **Collection** to open the Collection tab.

    {{< figure src="/images/manage-data_collection.png" alt="Open the Collections tab" link="/images/manage-data_collection.png" target="_blank" >}}

2. At the top-right of the Collection tab, click **Add Collector**.

    {{< figure src="/images/add-collector.png" alt="Add a Sumo Logic collector" link="/images/add-collector.png" target="_blank" >}}

3. In the Click Selector Type modal window, click **Hosted Collector**.

    {{< figure src="/images/hosted-collector.png" alt="Select the hosted collector option" link="/images/hosted-collector.png" target="_blank" >}}

4. In the Add Hosted Collector modal window:
    - Type **sensu** in the Name field.
    - Click **Save**.

    {{< figure src="/images/add-hosted-collector.png" alt="Name the hosted collector" link="/images/add-hosted-collector.png" target="_blank" >}}

5. In the Confirm prompt, click **OK**.

    {{< figure src="/images/confirm-prompt.png" alt="Confirm your hosted collector configuration" link="/images/confirm-prompt.png" target="_blank" >}}

6. Under Cloud APIs, click **HTTP Logs & Metrics**.

    {{< figure src="/images/cloud-apis_http-logs-and-metrics.png" alt="Select the HTTP Logs & Metrics source" link="/images/cloud-apis_http-logs-and-metrics.png" target="_blank" >}}

7. In the HTTP Logs & Metrics form:
    - Type **sensu-http** in the Name field.
    - Type **sensu-events** in the Source Category field.
    - Click **Save**.

    {{< figure src="/images/http-logs-and-metrics_source.png" alt="Select options for HTTP Logs & Metrics source" link="/images/http-logs-and-metrics_source.png" target="_blank" >}}

8. In the HTTP Source Address prompt, copy the listed URL and click OK.
You will use this URL as the value for the `url` attribute in your [Sensu handler][3] definition.

    {{< figure src="/images/http-source-address_url.png" alt="Retrieve the HTTP Source Address URL" link="/images/http-source-address_url.png" target="_blank" >}}

## Add the Sumo Logic handler

Now that you've added the dynamic runtime asset, you can create a [handler][9] that uses the asset to send non-OK events to Sumo Logic.

In the following code, replace `<SUMOLOGIC_URL>` with your [Sumo Logic HTTP Logs and Metrics Source URL][1].
Then run the command to create the handler:

{{< code shell >}}


{{< /code >}}

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

{{< /code >}}

{{< code json >}}

{{< /code >}}

{{< /language-toggle >}}

{{% notice protip %}}
**PRO TIP**: You can also [view complete resource definitions in the Sensu web UI](../../../web-ui/view-manage-resources/#view-resource-data-in-the-web-ui).
{{% /notice %}}

## Create a pipeline with the handler

With your Sumo Logic handler configured, you can add it to a [pipeline][17] workflow.
A single pipeline workflow can include one or more filters, one mutator, and one handler.

In this case, the pipeline includes the Sumo Logic handler you've already configured.
To create the pipeline, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---

EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create

EOF
{{< /code >}}

{{< /language-toggle >}}

## Assign the pipeline to a check

**TODO** find a good check to use here

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

{{< /code >}}

{{< code json >}}

{{< /code >}}

{{< /language-toggle >}}

## View your Sensu data in Sumo Logic

It will take a few moments after you add the pipeline to the check for your Sensu observability data to appear in Sumo Logic.

...

After Sensu detects a non-OK event, the handler in your pipeline will send the alert to your PagerDuty account, where you should see an event similar to this one:

{{< figure src="/images/pipeline_pagerduty_alert_example.png" alt="Example alert in PagerDuty for failing Sensu check" link="/images/pipeline_pagerduty_alert_example.png" target="_blank" >}}


## Next steps

You should now have a working set-up with a check and a pipeline that sends Sensu data to your Sumo Logic account.
To share and reuse the check, handler, and pipeline like code, [save them to files][6] and start building a [monitoring as code repository][7].

**TODO**

- Configure dashboards
- Sensu Plus


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
