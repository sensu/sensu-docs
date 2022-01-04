---
title: "Sensu Plus"
description: "The Sensu Plus turnkey integration allows you to use Sumo Logic to extract insights from your Sensu observability data. Read this article to get set up and start using Sensu Plus."
version: "6.6"
weight: -20
offline: false
toc: true
product: "Sensu Go"
menu: "sensu-go-6.6"
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access Sensu Plus in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../commercial/).
{{% /notice %}}

Sensu Plus is a built-in integration for transmitting your Sensu observability data to Sumo Logic via the Sumo Logic [HTTP Logs and Metrics Source][1].
You can use Sumo Logic's interactive dashboards and analytics tools to get better visibility into your Sensu data.

To use Sensu Plus, you need a [Sumo Logic account][2].
Once you have an account, follow this guide to start sending your Sensu data to Sumo Logic.

## Set up an HTTP Logs and Metrics Source

Set up a Sumo Logic HTTP Logs and Metrics Source to collect your Sensu observability data:

1. In the Sumo Logic left-navigation menu, click **Manage Data** and then **Collection**.

    {{< figure src="/images/sumo-plus/manage-data_collection.gif" alt="Open the Collections tab" link="/images/sumo-plus/manage-data_collection.gif" target="_blank" >}}

2. At the top-right of the Collection tab, click **Add Collector**.

    {{< figure src="/images/sumo-plus/add-collector.png" alt="Add a Sumo Logic collector" link="/images/sumo-plus/add-collector.png" target="_blank" >}}

3. In the Click Selector Type modal window, click **Hosted Collector**.

    {{< figure src="/images/sumo-plus/hosted-collector.png" alt="Select the hosted collector option" link="/images/sumo-plus/hosted-collector.png" target="_blank" >}}

4. In the Add Hosted Collector modal window:
    - Type **sensu** in the Name field.
    - Click **Save**.

    {{< figure src="/images/sumo-plus/add-hosted-collector.png" alt="Name the hosted collector" link="/images/sumo-plus/add-hosted-collector.png" target="_blank" >}}

5. In the Confirm prompt, click **OK**.

    {{< figure src="/images/sumo-plus/confirm-prompt.png" alt="Confirm your hosted collector configuration" link="/images/sumo-plus/confirm-prompt.png" target="_blank" >}}

6. Under Cloud APIs, click **HTTP Logs & Metrics**.

    {{< figure src="/images/sumo-plus/cloud-apis_http-logs-and-metrics.png" alt="Select the HTTP Logs & Metrics source" link="/images/sumo-plus/cloud-apis_http-logs-and-metrics.png" target="_blank" >}}

7. In the HTTP Logs & Metrics form:
    - Type **sensu-http** in the Name field.
    - Type **sensu-events** in the Source Category field.
    - Click **Save**.

    {{< figure src="/images/sumo-plus/http-logs-and-metrics_source.gif" alt="Select options for HTTP Logs & Metrics source" link="/images/sumo-plus/http-logs-and-metrics_source.gif" target="_blank" >}}

8. In the HTTP Source Address prompt, copy the listed URL and click OK.
You will use this URL as the value for the `url` attribute in your [Sensu handler][3] definition.

    {{< figure src="/images/sumo-plus/http-source-address_url.png" alt="Retrieve the HTTP Source Address URL" link="/images/sumo-plus/http-source-address_url.png" target="_blank" >}}

## Create a handler in Sensu

To send your Sensu observability data to your new Sumo Logic HTTP Logs and Metrics Source, create a Sensu handler.

We recommend creating a [Sumo Logic metrics handler][5] because they provide a persistent connection to transmit Sensu observability data, which helps prevent the data bottlenecks you may experience with traditional handlers.
However, you can use a traditional handler instead if desired, and our [Sumo Logic handler integration][11] includes templates to get you started.

For a Sumo Logic metrics handler, the resource definition must use the URL you copied in the last step of setting up your HTTP Logs and Metrics Source as the value for the `url` attribute.

Here is an example Sumo Logic Metrics Handler definition.
Before you run the command to add this handler, replace the `url` example value with the URL for your Sumo Logic HTTP Logs and Metrics Source:

{{< language-toggle >}}

{{< code text "YML" >}}
cat << EOF | sensuctl create
---
type: SumoLogicMetricsHandler
api_version: pipeline/v1
metadata:
  name: sumologic_http_log_metrics
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
    "name": "sumologic_http_log_metrics"
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

If you prefer, you can configure your Sumo Logic HTTP Logs and Metrics Source URL as a [secret][6] with Sensu's built-in [`env` secrets provider][7] to avoid exposing the URL in your handler definition.
This example shows the same definition with the URL referenced as a secret instead:

{{< language-toggle >}}

{{< code text "YML" >}}
cat << EOF | sensuctl create
---
type: SumoLogicMetricsHandler
api_version: pipeline/v1
metadata:
  name: sumologic_http_log_metrics
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
    "name": "sumologic_http_log_metrics"
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

{{% notice note %}}
**NOTE**: [Sumo Logic metrics handlers](../observability-pipeline/observe-process/sumo-logic-metrics-handlers) only accept metrics events.
To send status events, use the [Sensu Sumo Logic Handler integration](../plugins/supported-integrations/sumologic/).
{{% /notice %}}

## Configure a pipeline

With your handler definition configured, you’re ready to create a [pipeline][8] with a workflow that references your sumo_logic_http_metrics handler.

{{% notice note %}}
**NOTE**: Sensu pipelines use event filters, mutators, and handlers as the building blocks for event processing workflows.
Read the [pipeline reference](../observability-pipeline/observe-process/pipelines/) for detailed information about pipelines.
{{% /notice %}}

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

## Configure a Sensu check

Your pipeline resource is now properly configured, but it’s not processing any events because no Sensu [checks][9] are sending events to it.
To get your Sensu observability data flowing through the new pipeline, add the pipeline by reference in at least one check definition.

This example check definition uses the [Sensu System Check][13] dynamic runtime asset.

{{% notice note %}}
**NOTE**: Dynamic runtime assets are shareable, reusable packages that make it easier to deploy Sensu plugins.
Read the [assets reference](../plugins/assets/) for more information about dynamic runtime assets.
{{% /notice %}}

Follow these steps to configure the required system check:

1. Add the [Sensu System Check][13] dynamic runtime asset:
{{< code shell >}}
sensuctl asset add sensu/system-check:0.1.1 -r system-check
{{< /code >}}

2. Update at least one Sensu entity to use the `system` subscription.
In the following command, replace `<entity_name>` with the name of the entity on your system.
Then, run:
{{< code shell >}}
sensuctl entity update <entity_name>
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

## Configure Sumo Logic dashboards

To view your Sensu observability data in Sumo Logic, you can configure Sumo Logic dashboards in any way you wish.
As a starting point, follow these instructions to configure Sensu Overview and Sensu Entity Detail dashboards:

1. On your [Sumo Logic home page][10], click the **Personal** tab in the left-navigation menu.
Click the options icon for the folder where you want to import your Sensu data and select **Import**.

    {{< figure src="/images/sumo-plus/personal_folder_import.png" alt="Navigate to the folder where you want to import Sensu data" link="/images/sumo-plus/personal_folder_import.png" target="_blank" >}}

2. In the Import Content modal window:
    - Type "Sensu" in the **Name** field.
    - Copy the [dashboard configuration JSON](../files/sensu-plus-dashboard-config.json) (download) and paste it into the **JSON** field:

    {{< figure src="/images/sumo-plus/import-content.png" alt="Import Content modal window for dashboards" link="/images/sumo-plus/import-content.png" target="_blank" >}}


5. Scroll to the end of the Import Content modal window and click **Import**.

The two new dashboards will be listed in the Sensu sub-folder in the left-navigation menu:

{{< figure src="/images/sumo-plus/sensu-dashboards.png" alt="Sensu Overview and Sensu Entity Detail dashboards listed in the Sumo Logic left-navigation menu" link="/images/sumo-plus/sensu-dashboards.png" target="_blank" >}}

Click a dashboard name to view your Sensu observability data.


[1]: https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source
[2]: https://www.sumologic.com/sign-up/?utm_source=sensudocs&utm_medium=sensuwebsite
[3]: #create-a-handler-in-sensu
[5]: ../observability-pipeline/observe-process/sumo-logic-metrics-handlers
[6]: ../operations/manage-secrets/secrets/
[7]: ../operations/manage-secrets/secrets-providers/#env-secrets-provider-example
[8]: ../observability-pipeline/observe-process/pipelines/
[9]: ../observability-pipeline/observe-schedule/checks/
[10]: https://service.sumologic.com/ui/#/home
[11]: ../plugins/supported-integrations/sumologic/
[12]: ../observability-pipeline/observe-filter/filters/#built-in-filter-has_metrics
[13]: https://bonsai.sensu.io/assets/sensu/system-check
