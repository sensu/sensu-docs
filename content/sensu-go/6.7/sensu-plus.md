---
title: "Sensu Plus"
description: "Deploy the Sensu Plus turnkey integration to send metrics to Sumo Logic and extract insights from your Sensu observability data."
version: "6.7"
weight: -20
offline: true
toc: true
product: "Sensu Go"
menu: "sensu-go-6.7"
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access Sensu Plus in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../commercial/).
{{% /notice %}}

Sensu Plus is a built-in integration for transmitting your Sensu observability data to the Sumo Logic Continuous Intelligence Platform™ via a Sumo Logic [HTTP Logs and Metrics Source][1] (an endpoint for receiving data).
In Sumo Logic, you can configure customized interactive dashboards and analytics tools to gain better visibility into your Sensu data &mdash; read [Introducing Sensu Plus][14] for more information.

**If you completed Sumo Logic setup in the Sensu web UI**, [finish the configuration process][15] to create the Sensu resources you need to start sending observability event data to Sumo Logic.

If you did **not** use the Sensu web UI to set up a Sumo Logic account, follow the [manual setup process for Sensu Plus][19].

## Finish configuration after web UI setup

In the Sensu web UI, you already set up a Sumo Logic account and HTTP Logs and Metrics Source endpoint for receiving data.
To finish your configuration, you need the **SOURCE URL** for your endpoint, which you can copy from the last page in the web UI dialog.

Follow the steps in this section to create a Sensu handler, pipeline, and check to transmit your Sensu data in Sumo Logic.

### Create a handler in Sensu

Create a Sumo Logic metrics handler to send your Sensu observability data to your new Sumo Logic HTTP Logs and Metrics Source.
[Sumo Logic metrics handlers][5] provide a persistent connection to transmit Sensu observability data, which helps prevent the data bottlenecks you may experience with traditional handlers.

{{% notice note %}}
**NOTE**: Sumo Logic metrics handlers only accept metrics events.
To send status events, use the [Sensu Sumo Logic Handler integration](../plugins/featured-integrations/sumologic/) instead.
{{% /notice %}}

For a Sumo Logic metrics handler, the resource definition must use the URL for your HTTP Logs and Metrics Source as the value for the `url` attribute.

Here is an example Sumo Logic Metrics Handler definition.
Before you run the command to add this handler, replace the `url` example value with the URL for your Sumo Logic HTTP Logs and Metrics Source:

{{< language-toggle >}}

{{< code text "YML" >}}
cat << EOF | sensuctl create
---
type: SumoLogicMetricsHandler
api_version: pipeline/v1
metadata:
  name: sumo_logic_http_metrics
spec:
  url: "https://collectors.sumologic.com/receiver/v1/http/xxxxxxxx"
  max_connections: 10
  timeout: 10s
EOF
{{< /code >}}

{{< code text "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "SumoLogicMetricsHandler",
  "api_version": "pipeline/v1",
  "metadata": {
    "name": "sumo_logic_http_metrics"
  },
  "spec": {
    "url": "https://collectors.sumologic.com/receiver/v1/http/xxxxxxxx",
    "max_connections": 10,
    "timeout": "10s"
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

If you prefer, you can configure your Sumo Logic HTTP Logs and Metrics Source URL as a [secret][6] with Sensu's [`Env` secrets provider][7] to avoid exposing the URL in your handler definition.
This example shows the same definition with the URL referenced as a secret instead:

{{< language-toggle >}}

{{< code text "YML" >}}
cat << EOF | sensuctl create
---
type: SumoLogicMetricsHandler
api_version: pipeline/v1
metadata:
  name: sumo_logic_http_metrics
spec:
  url: $SUMO_LOGIC_SOURCE_URL
  secrets:
  - name: SUMO_LOGIC_SOURCE_URL
    secret: sumologic_metrics_us1
  max_connections: 10
  timeout: 10s
EOF
{{< /code >}}

{{< code text "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "SumoLogicMetricsHandler",
  "api_version": "pipeline/v1",
  "metadata": {
    "name": "sumo_logic_http_metrics"
  },
  "spec": {
    "url": "$SUMO_LOGIC_SOURCE_URL",
    "secrets": [
      {
        "name": "SUMO_LOGIC_SOURCE_URL",
        "secret": "sumologic_metrics_us1"
      }
    ],
    "max_connections": 10,
    "timeout": "10s"
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

### Configure a pipeline

Sensu [pipelines][8] use event filters, mutators, and handlers as the building blocks for event processing workflows.
With your handler definition configured, you’re ready to create a pipeline with a workflow that references your sumo_logic_http_metrics handler.

To configure event processing via your sumo_logic_http_metrics handler, add this example pipeline definition.
This pipeline includes a workflow with your sumo_logic_http_metrics handler, along with Sensu's built-in [has_metrics event filter][12] to ensure that the workflow only processes events that contain metrics:

{{< language-toggle >}}

{{< code text "YML" >}}
cat << EOF | sensuctl create
---
type: Pipeline
api_version: core/v2
metadata:
  name: sensu_to_sumo
spec:
  workflows:
  - name: metrics_to_sumologic
    filters:
    - name: has_metrics
      type: EventFilter
      api_version: core/v2
    handler:
      name: sumo_logic_http_metrics
      type: SumoLogicMetricsHandler
      api_version: pipeline/v1
EOF
{{< /code >}}

{{< code text "JSON" >}}
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
        "name": "metrics_to_sumologic",
        "filters": [
          {
            "name": "has_metrics",
            "type": "EventFilter",
            "api_version": "core/v2"
          }
        ],
        "handler": {
          "name": "sumo_logic_http_metrics",
          "type": "SumoLogicMetricsHandler",
          "api_version": "pipeline/v1"
        }
      }
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

### Add a Sensu check

Your pipeline resource is now properly configured, but it’s not processing any events because no Sensu [checks][9] are sending events to it.
To get your Sensu observability data flowing through the new pipeline, add the pipeline by reference in at least one check definition.

This example check definition uses the [sensu/system-check][13] dynamic runtime asset.
[Dynamic runtime assets][20] are shareable, reusable packages that make it easier to deploy Sensu plugins.

Follow these steps to configure the required system check:

1. Add the [sensu/system-check][13] dynamic runtime asset:
{{< code shell >}}
sensuctl asset add sensu/system-check:0.1.1 -r system-check
{{< /code >}}

2. Update at least one Sensu entity to use the `system` subscription.
In the following command, replace `<ENTITY_NAME>` with the name of the entity on your system.
Then, run:
{{< code shell >}}
sensuctl entity update <ENTITY_NAME>
{{< /code >}}

    - For `Entity Class`, press enter.
    - For `Subscriptions`, type `system` and press enter.

3. Add the following check definition:

    {{< language-toggle >}}

{{< code text "YML" >}}
cat << EOF | sensuctl create
---
type: CheckConfig
api_version: core/v2
metadata:
  name: system-check
spec:
  command: system-check
  runtime_assets:
  - system-check
  subscriptions:
  - system
  interval: 10
  timeout: 5
  publish: true
  pipelines:
  - type: Pipeline
    api_version: core/v2
    name: sensu_to_sumo
  output_metric_format: prometheus_text
  output_metric_tags:
  - name: entity
    value: "{{ .name }}"
  - name: namespace
    value: "{{ .namespace }}"
  - name: os
    value: "{{ .system.os }}"
  - name: platform
    value: "{{ .system.platform }}"
EOF
{{< /code >}}

{{< code text "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "system-check"
  },
  "spec": {
    "command": "system-check",
    "runtime_assets": [
      "system-check"
    ],
    "subscriptions": [
      "system"
    ],
    "interval": 10,
    "timeout": 5,
    "publish": true,
    "pipelines": [
      {
        "type": "Pipeline",
        "api_version": "core/v2",
        "name": "sensu_to_sumo"
      }
    ],
    "output_metric_format": "prometheus_text",
    "output_metric_tags": [
      {
        "name": "entity",
        "value": "{{ .name }}"
      },
      {
        "name": "namespace",
        "value": "{{ .namespace }}"
      },
      {
        "name": "os",
        "value": "{{ .system.os }}"
      },
      {
        "name": "platform",
        "value": "{{ .system.platform }}"
      }
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

This check will collect baseline system metrics in Prometheus format for all entities that include the `system` subscription and send the events to Sumo Logic via your sensu_to_sumo pipeline resource.

{{% notice note %}}
**NOTE**: Sumo Logic metrics handlers only accept metrics events, so you must use a check that produces metrics.
If your check produces status events, use the [Sensu Sumo Logic Handler integration](../plugins/featured-integrations/sumologic/) to create a traditional Sensu handler rather than the Sumo Logic metrics handler.
{{% /notice %}}

### View your Sensu data in Sumo Logic

During the web UI setup process, Sensu added two custom dashboards as a starting point for viewing your observability event data.
The two new dashboards will be listed in the Sensu folder in the left-navigation menu:

{{< figure src="/images/go/sensu_plus/sensu_dashboards_in_sumo_logic.png" alt="Sensu Overview and Sensu Entity Details dashboards listed in the Sumo Logic left-navigation menu" link="/images/go/sensu_plus/sensu_dashboards_in_sumo_logic.png" target="_blank" >}}

Click a dashboard name to view your Sensu observability data.

It may take a few moments for your data to appear in Sumo Logic.
The Sensu Overview and Sensu Entity Details dashboards will begin to display your data:

{{< figure src="/images/go/sensu_plus/sensu_entity_details_dashboard_sumo_logic.png" alt="Data beginning to populate in the Sensu Entity Details dashboard in Sumo Logic" link="/images/go/sensu_plus/sensu_entity_details_dashboard_sumo_logic.png" target="_blank" >}}

## Manually set up Sensu Plus

This section explains how to set up Sensu Plus manually, without using the Sensu web UI.

First, [create a new Sumo Logic account][2] or log in to your existing account.

Then follow the steps below to create a Sumo Logic [HTTP Logs and Metrics Source][1] (an endpoint for receiving data), the Sensu resources that collect and process the data, and two dashboards for viewing your observability event data in Sumo Logic.

### Set up an HTTP Logs and Metrics Source

Create a Sumo Logic HTTP Logs and Metrics Source to collect your Sensu observability data:

1. In the Sumo Logic left-navigation menu, click **Manage Data** and then **Collection**.

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
You will use this URL as the value for the `url` attribute in your Sensu [handler][3] definition.

    {{< figure src="/images/go/sensu_plus/http_source_address_url.png" alt="Retrieve the HTTP Source Address URL" link="/images/go/sensu_plus/http_source_address_url.png" target="_blank" >}}


### Import Sumo Logic dashboards

To view your Sensu observability data in Sumo Logic, you can configure [Sumo Logic dashboards][4] in any way you wish.
As a starting point, follow these instructions to import two dashboards, Sensu Overview and Sensu Entity Details:

1. On your [Sumo Logic home page][10], click the **Personal** tab in the left-navigation menu.
Click the options icon for the folder where you want to import your Sensu data and select **Import**.

    {{< figure src="/images/go/sensu_plus/personal_folder_import.png" alt="Navigate to the folder where you want to import Sensu data" link="/images/go/sensu_plus/personal_folder_import.png" target="_blank" >}}

2. In the Import Content modal window:
    - Type "Sensu" in the **Name** field.
    - Copy the [dashboard configuration JSON](../files/sensu-plus-dashboard-config.json) (download) and paste it into the **JSON** field:

    {{< figure src="/images/go/sensu_plus/import_content.png" alt="Import Content modal window for dashboards" link="/images/go/sensu_plus/import_content.png" target="_blank" >}}

3. Scroll to the bottom of the Import Content modal window and click **Import**.
The two new dashboards will be listed in the Sensu folder in the left-navigation menu:

    {{< figure src="/images/go/sensu_plus/sensu_dashboards_in_sumo_logic.png" alt="Sensu Overview and Sensu Entity Details dashboards listed in the Sumo Logic left-navigation menu" link="/images/go/sensu_plus/sensu_dashboards_in_sumo_logic.png" target="_blank" >}}

After you create a Sensu handler, pipeline, and check in the next section, you will be able to click a dashboard name to view your Sensu observability data.

### Create Sensu resources

With your dashboards set up, you're ready to configure a Sensu handler, pipeline, and check.
To create the Sensu resources, follow the same instructions as users who started in the web UI:

- [Create a handler in Sensu][3]
- [Configure a pipeline][16]
- [Add a Sensu check][17]

After you add the check, it may take a few moments for your data to appear in Sumo Logic.
The Sensu Overview and Sensu Entity Details dashboards will begin to display your data:

{{< figure src="/images/go/sensu_plus/sensu_entity_details_dashboard_sumo_logic.png" alt="Data beginning to populate in the Sensu Entity Details dashboard in Sumo Logic" link="/images/go/sensu_plus/sensu_entity_details_dashboard_sumo_logic.png" target="_blank" >}}


[1]: https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source
[2]: https://www.sumologic.com/sign-up/?utm_source=sensudocs&utm_medium=sensuwebsite
[3]: #create-a-handler-in-sensu
[4]: https://help.sumologic.com/Visualizations-and-Alerts/Dashboards
[5]: ../observability-pipeline/observe-process/sumo-logic-metrics-handlers
[6]: ../operations/manage-secrets/secrets/
[7]: ../operations/manage-secrets/secrets-providers/#env-secrets-provider-example
[8]: ../observability-pipeline/observe-process/pipelines/
[9]: ../observability-pipeline/observe-schedule/checks/
[10]: https://service.sumologic.com/ui/#/home
[11]: ../plugins/featured-integrations/sumologic/
[12]: ../observability-pipeline/observe-filter/filters/#built-in-filter-has_metrics
[13]: https://bonsai.sensu.io/assets/sensu/system-check
[14]: https://www.sumologic.com/blog/introducing-sensu-plus/
[15]: #finish-configuration-after-web-ui-setup
[16]: #configure-a-pipeline
[17]: #add-a-sensu-check
[18]: #import-sumo-logic-dashboards
[19]: #manually-set-up-sensu-plus
[20]: ../plugins/assets/
