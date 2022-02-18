---
title: "Sumo Logic metrics handlers reference"
linkTitle: "Sumo Logic Metrics Handlers Reference"
reference_title: "Sumo Logic metrics handlers"
type: "reference"
description: "Read this reference to learn about Sumo Logic metrics handlers, which provide a persistent connection for sending Sensu data to Sumo Logic."
weight: 16
version: "6.5"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.5:
    parent: observe-process
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access Sumo Logic metrics handlers in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

Sensu executes Sumo Logic metrics handlers during the **[process][22]** stage of the [observability pipeline][29].

Sumo Logic metrics handlers provide a persistent connection to transmit Sensu observability metrics to a [Sumo Logic HTTP Logs and Metrics Source][3], which helps prevent the data bottlenecks you may experience with traditional [handlers][1].

Traditional handlers start a new UNIX process for every Sensu event they receive and require a new connection to send every event.
As you scale up and process more events per second, the rate at which the handler can transmit observability event data decreases.

Sumo Logic metrics handlers allow you to configure a connection pool with a maximum number of connections for the handler to use and a time limit for request completion.
For example, if 1000 events are queued for transmission, as each connection finishes transmitting an event, it becomes available again and returns to the pool so the handler can use it to send the next event in the queue.

Sumo Logic metrics handlers will reuse the available connections as long as they can rather than requiring a new connection for every event, which increases event throughput.

{{% notice note %}}
**NOTE**: Sumo Logic metrics handlers only accept metrics events.
To send status events, use the [Sensu Sumo Logic Handler integration](../../../plugins/supported-integrations/sumologic/) instead.
{{% /notice %}}

## Sumo Logic metrics handler examples

This example shows a Sumo Logic metrics handler resource definition configured to send Sensu observability data to a Sumo Logic HTTP Logs and Metrics Source via the `url` attribute:

{{< language-toggle >}}

{{< code yml >}}
---
type: SumoLogicMetricsHandler
api_version: pipeline/v1
metadata:
  name: sumologic_http_log_metrics
spec:
  url: "https://endpoint5.collection.us2.sumologic.com/receiver/v1/http/xxxxxxxx"
  max_connections: 10
  timeout: 30s
{{< /code >}}

{{< code json >}}
{
  "type": "SumoLogicMetricsHandler",
  "api_version": "pipeline/v1",
  "metadata": {
    "name": "sumologic_http_log_metrics"
  },
  "spec": {
    "url": "https://endpoint5.collection.us2.sumologic.com/receiver/v1/http/xxxxxxxx",
    "max_connections": 10,
    "timeout": "30s"
  }
}
{{< /code >}}

{{< /language-toggle >}}

You can also use [secrets management][14] to avoid exposing the URL in your Sumo Logic metrics handler configuration:

{{< language-toggle >}}

{{< code yml >}}
---
type: SumoLogicMetricsHandler
api_version: pipeline/v1
metadata:
  name: sumologic_http_log_metrics
spec:
  url: $SUMO_LOGIC_SOURCE_URL
  secrets:
  - name: SUMO_LOGIC_SOURCE_URL
    secret: sumologic_metrics_us2
  max_connections: 10
  timeout: 30s
{{< /code >}}

{{< code json >}}
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
        "secret": "sumologic_metrics_us2"
      }
    ],
    "max_connections": 10,
    "timeout": "30s"
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Use Sumo Logic metrics handlers

Sumo Logic metrics handlers are commercial resources and are available for use **only** in [pipelines][2].

{{% notice note %}}
**NOTE**: Sumo Logic metrics handlers **are not** used by listing the handler name in the check [handlers attribute](../../observe-schedule/checks/#handlers-array).
{{% /notice %}}

To use a Sumo Logic metrics handler, list it as the [handler][11] in a [pipeline][2] definition.
For example, this pipeline definition uses the [sumologic_http_log_metrics example][12] along with the built-in [has_metrics][13] event filter:

{{< language-toggle >}}

{{< code yml >}}
---
type: Pipeline
api_version: core/v2
metadata:
  name: metrics_workflows
spec:
  workflows:
  - name: metrics_to_sumologic
    filters:
    - name: has_metrics
      type: EventFilter
      api_version: core/v2
    handler:
      name: sumologic_http_log_metrics
      type: SumoLogicMetricsHandler
      api_version: pipeline/v1
{{< /code >}}

{{< code json >}}
{
  "type": "Pipeline",
  "api_version": "core/v2",
  "metadata": {
    "name": "metrics_workflows"
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
          "name": "sumologic_http_log_metrics",
          "type": "SumoLogicMetricsHandler",
          "api_version": "pipeline/v1"
        }
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Sumo Logic metrics handler specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][4] resource type. Sumo Logic metrics handlers should always be type `SumoLogicMetricsHandler`.
required     | Required for Sumo Logic metrics handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: SumoLogicMetricsHandler
{{< /code >}}
{{< code json >}}
{
  "type": "SumoLogicMetricsHandler"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For Sumo Logic metrics handlers in this version of Sensu, the `api_version` should always be `pipeline/v1`.
required     | Required for Sumo Logic metrics handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: pipeline/v1
{{< /code >}}
{{< code json >}}
{
  "api_version": "pipeline/v1"
}
{{< /code >}}
{{< /language-toggle >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the Sumo Logic metrics handler that includes `name`, `namespace`, and `created_by` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the handler definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. Read [metadata attributes][8] for details.
required     | Required for Sumo Logic metrics handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: sumologic_http_log_metrics
  namespace: default
  created_by: admin
  labels:
    environment: development
    region: us-west-2
  annotations:
    managed-by: ops
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "name": "sumologic_http_log_metrics",
    "namespace": "default",
    "created_by": "admin",
    "labels": {
      "environment": "development",
      "region": "us-west-2"
    },
    "annotations": {
      "managed-by": "ops"
    }
  }
}
{{< /code >}}
{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes the Sumo Logic metrics handler [spec attributes][5].
required     | Required for Sumo Logic metrics handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  url: $SUMO_LOGIC_SOURCE_URL
  secrets:
  - name: SUMO_LOGIC_SOURCE_URL
    secret: sumologic_metrics_us2
  max_connections: 10
  timeout: 30s
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "url": "$SUMO_LOGIC_SOURCE_URL",
    "secrets": [
      {
        "name": "SUMO_LOGIC_SOURCE_URL",
        "secret": "sumologic_metrics_us2"
      }
    ],
    "max_connections": 10,
    "timeout": "30s"
  }
}
{{< /code >}}
{{< /language-toggle >}}

### Metadata attributes

| name       |      |
-------------|------
description  | Unique string used to identify the Sumo Logic metrics handler. Sumo Logic metrics handler names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][18]). Each Sumo Logic metrics handler must have a unique name within its namespace.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: sumologic_http_log_metrics
{{< /code >}}
{{< code json >}}
{
  "name": "sumologic_http_log_metrics"
}
{{< /code >}}
{{< /language-toggle >}}

| namespace  |      |
-------------|------
description  | Sensu [RBAC namespace][9] that the Sumo Logic metrics handler belongs to.
required     | false
type         | String
default      | `default`
example      | {{< language-toggle >}}
{{< code yml >}}
namespace: default
{{< /code >}}
{{< code json >}}
{
  "namespace": "default"
}
{{< /code >}}
{{< /language-toggle >}}

| created_by |      |
-------------|------
description  | Username of the Sensu user who created the Sumo Logic metrics handler or last updated the Sumo Logic metrics handler. Sensu automatically populates the `created_by` field when the Sumo Logic metrics handler is created or updated.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
created_by: admin
{{< /code >}}
{{< code json >}}
{
  "created_by": "admin"
}
{{< /code >}}
{{< /language-toggle >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with observation data in events that you can use for response and web UI view filtering.<br><br>If you include labels in your event data, you can filter [API responses][15], [sensuctl responses][16], and [web UI views][25] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
labels:
  environment: development
  region: us-west-2
{{< /code >}}
{{< code json >}}
{
  "labels": {
    "environment": "development",
    "region": "us-west-2"
  }
}
{{< /code >}}
{{< /language-toggle >}}

| annotations |     |
-------------|------
description  | Non-identifying metadata to include with observation data in events that you can access with [event filters][24]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][15], [sensuctl response filtering][16], or [web UI views][28].
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
annotations:
  managed-by: ops
{{< /code >}}
{{< code json >}}
{
  "annotations": {
    "managed-by": "ops"
  }
}
{{< /code >}}
{{< /language-toggle >}}

### Spec attributes

url          | 
-------------|------
description  | The URL for the Sumo Logic HTTP Logs and Metrics Source where Sensu should transmit the observability metrics. You can also provide the URL as a [secret][6].
required     | true
type         | String
example without secrets | {{< language-toggle >}}
{{< code yml >}}
url: https://endpoint5.collection.us2.sumologic.com/receiver/v1/http/xxxxxxxx
{{< /code >}}
{{< code json >}}
{
  "url": "https://endpoint5.collection.us2.sumologic.com/receiver/v1/http/xxxxxxxx"
}
{{< /code >}}
{{< /language-toggle >}}
example with secrets | {{< language-toggle >}}
{{< code yml >}}
url: $SUMO_LOGIC_SOURCE_URL
{{< /code >}}
{{< code json >}}
{
  "url": "$SUMO_LOGIC_SOURCE_URL"
}
{{< /code >}}
{{< /language-toggle >}}

secrets      | 
-------------|------
description  | Array of the name/secret pairs to use with command execution. Read [secrets attributes][6] for details. You can also provide the Sumo Logic HTTP Logs and Metrics Source URL directly in the [url attribute][5] instead of configuring a secret.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
secrets:
- name: SUMO_LOGIC_SOURCE_URL
  secret: sumologic_metrics_us2
{{< /code >}}
{{< code json >}}
{
  "secrets": [
    {
      "name": "SUMOLOGIC_METRICS_URL",
      "secret": "sumologic_metrics_us2"
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

max_connections | 
-------------|------
description  | Maximum number of connections to keep alive in the connection pool. If set to `0`, there is no limit to the number of connections in the pool.
required     | false 
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
max_connections: 10
{{< /code >}}
{{< code json >}}
{
  "max_connections": 10
}
{{< /code >}}
{{< /language-toggle >}}

timeout      | 
-------------|------
description  | Duration to allow for processing a Sumo Logic call. In seconds.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
timeout: 10s
{{< /code >}}
{{< code json >}}
{
  "timeout": "10s"
}
{{< /code >}}
{{< /language-toggle >}}

### Secrets attributes

name         | 
-------------|------
description  | Name of the [secret][10] defined in the handler's URL attribute. Becomes the environment variable presented to the handler. Read [Use secrets management in Sensu][7] for more information.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: SUMOLOGIC_METRICS_URL
{{< /code >}}
{{< code json >}}
{
  "name": "SUMOLOGIC_METRICS_URL"
}
{{< /code >}}
{{< /language-toggle >}}

secret       | 
-------------|------
description  | Name of the Sensu secret resource that defines how to retrieve the [secret][10].
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
secret: sumologic_metrics_us2
{{< /code >}}
{{< code json >}}
{
  "secret": "sumologic_metrics_us2"
}
{{< /code >}}
{{< /language-toggle >}}


[1]: ../handlers/
[2]: ../pipelines/
[3]: https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source
[4]: ../../../sensuctl/create-manage-resources/#create-resources
[5]: #spec-attributes
[6]: #secrets-attributes
[7]: ../../../operations/manage-secrets/secrets-management/
[8]: #metadata-attributes
[9]: ../../../operations/control-access/namespaces/
[10]: ../../../operations/manage-secrets/secrets/
[11]: ../pipelines/#handlers-pipeline
[12]: #sumo-logic-metrics-handler-example
[13]: ../../observe-filter/filters/#built-in-filter-has_metrics
[14]: ../../../operations/manage-secrets/secrets-management/
[15]: ../../../api/#response-filtering
[16]: ../../../sensuctl/filter-responses/
[18]: https://regex101.com/r/zo9mQU/2
[22]: ../
[24]: ../../observe-filter/filters/
[25]: ../../../web-ui/search#search-for-labels
[28]: ../../../web-ui/search/
[29]: ../../../observability-pipeline/
