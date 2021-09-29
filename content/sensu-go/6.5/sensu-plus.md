---
title: "Sensu Plus"
description: "The Sensu Plus turnkey integration allows you to use Sumo Logic to extract insights from your Sensu observability data. Read this article to get set up and start using Sensu Plus."
version: "6.5"
weight: -20
offline: false
toc: true
product: "Sensu Go"
menu: "sensu-go-6.5"
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access Sensu Plus in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../commercial/).
{{% /notice %}}

Sensu Plus is a built-in integration you can use to transmit your Sensu observability data to Sumo Logic via the Sumo Logic [HTTP Logs and Metrics Source][1].
You can use Sumo Logic's interactive dashboards and analytics tools to get better visibility into your Sensu data.

To use Sensu Plus, you need a [Sumo Logic account][2].
Once you have an account, follow this guide to start sending your Sensu data to Sumo Logic.

## Set up an HTTP Logs and Metrics Source

Set up a Sumo Logic HTTP Logs and Metrics Source to collect your Sensu observability data:

1. In the Sumo Logic left-navigation menu, click **Manage Data** and **Collections**.

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
You will use this URL as the value for the `url` attribute in your [Sumo Logic metrics handler][3] definition.

    {{< figure src="/images/sumo-plus/http-source-address_url.png" alt="Retrieve the HTTP Source Address URL" link="/images/sumo-plus/http-source-address_url.png" target="_blank" >}}

## Create a Sumo Logic metrics handler in Sensu

To send your Sensu observability data to your new Sumo Logic HTTP Logs and Metrics Source, create a [Sumo Logic metrics handler][5] in Sensu.
Your Sumo Logic metrics handler definition must use the URL you copied in the last step of [setting up your HTTP Logs and Metrics Source][4] as the value for the `url` attribute.

Here is an example Sumo Logic Metrics Handler definition:

{{< language-toggle >}}

{{< code yml >}}
---
type: SumoLogicMetricsHandler
api_version: pipeline/v1
metadata:
  name: sumologic_http_log_metrics
  namespace: default
spec:
  url: "https://https://collectors.sumologic.com/receiver/v1/http/xxxxxxxx"
  max_connections: 10
  min_connections: 5
  min_reconnect_delay: 10ms
  max_reconnect_delay: 10s
{{< /code >}}

{{< code json >}}
{
  "type": "SumoLogicMetricsHandler",
  "api_version": "pipeline/v1",
  "metadata": {
    "name": "sumologic_http_log_metrics",
    "namespace": "default"
  },
  "spec": {
    "url": "https://https://collectors.sumologic.com/receiver/v1/http/xxxxxxxx",
    "max_connections": 10,
    "min_connections": 5,
    "min_reconnect_delay": "10ms",
    "max_reconnect_delay": "10s"
  }
}
{{< /code >}}

{{< /language-toggle >}}

If you prefer, you can configure your Sumo Logic HTTP Logs and Metrics Source URL as a [secret][6] with Sensu's built-in [`env` secrets provider][7] to avoid exposing the URL in your handler definition.
This example shows the same definition with the URL referenced as a secret instead:

{{< language-toggle >}}

{{< code yml >}}
---
type: SumoLogicMetricsHandler
api_version: pipeline/v1
metadata:
  name: sumologic_http_log_metrics
  namespace: default
spec:
  secrets:
  - name: SUMOLOGIC_HTTP_METRICS_URL
    secret: sumologic_http_metrics_us1
  max_connections: 10
  min_connections: 5
  min_reconnect_delay: 10ms
  max_reconnect_delay: 10s
{{< /code >}}

{{< code json >}}
{
  "type": "SumoLogicMetricsHandler",
  "api_version": "pipeline/v1",
  "metadata": {
    "name": "sumologic_http_log_metrics",
    "namespace": "default"
  },
  "spec": {
    "secrets": [
      {
        "name": "SUMOLOGIC_HTTP_METRICS_URL",
        "secret": "sumologic_http_metrics_us1"
      }
    ],
    "max_connections": 10,
    "min_connections": 5,
    "min_reconnect_delay": "10ms",
    "max_reconnect_delay": "10s"
  }
}
{{< /code >}}

{{< /language-toggle >}}

Make sure to add your Sumo Logic metrics handler to a [pipeline][8], and reference the pipeline in the [check][9] you're using to collect your metrics data.

{{% notice note %}}
**NOTE**: [Sumo Logic metrics handlers](../observability-pipeline/observe-process/sumo-logic-metrics-handlers) only accept metrics events.
To send status events, use the [Sensu Sumo Logic Handler integration](../plugins/supported-integrations/sumologic/).
{{% /notice %}}

## Configure Sumo Logic dashboards

You can configure Sumo Logic dashboards to view your Sensu observability data in any way you wish.
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
[2]: https://www.sumologic.com/sign-up/
[3]: #create-a-sumo-logic-metrics-handler-in-sensu
[4]: #set-up-an-http-logs-and-metrics-source
[5]: ../observability-pipeline/observe-process/sumo-logic-metrics-handlers
[6]: ../operations/manage-secrets/secrets/
[7]: ../operations/manage-secrets/secrets-providers/#env-secrets-provider-example
[8]: ../observability-pipeline/observe-process/pipelines/
[9]: ../observability-pipeline/observe-schedule/checks/
[10]: https://service.sumologic.com/ui/#/home
