---
title: "Sumo Logic metrics handlers reference"
linkTitle: "Sumo Logic Metrics Handlers Reference"
reference_title: "Sumo Logic metrics handlers"
type: "reference"
description: "Sumo Logic metrics handlers are actions the Sensu backend executes on events, allowing you to create automated monitoring workflows. Read the reference doc to learn about Sumo Logic metrics handlers."
weight: 10
version: "6.5"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.5:
    parent: observe-process
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access Sumo Logic metrics handlers in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

Sensu executes Sumo Logic metrics handlers during the **[process][22]** stage of the [observability pipeline][29].

Sumo Logic metrics handlers provide a persistent connection to transmit Sensu observability metrics to a [Sumo Logic HTTP Logs and Metrics Source][3].
Sumo Logic metrics handlers can help prevent the data bottlenecks you may experience with traditional [handlers][1].

Traditional handlers start a new UNIX process for every Sensu event they receive and require a new connection to send every event.
As you scale up and process more events per second, the rate at which the handler can transmit observability event data decreases.

Sumo Logic metrics handlers allow you to configure a connection pool with a minimum and maximum number of connections for the handler to use.
For example, you can configure a TCP stream handler with a pool of 5 to 10 connections.
Suppose 1000 events are queued for transmission.
As each connection finishes transmitting an event, it becomes available again and returns to the pool so the handler can use it to send the next event in the queue.

Sumo Logic metrics will reuse the available connections as long as they can rather than requiring a new connection for every event, which increases event throughput.

Sumo Logic metrics handlers are commercial resources available for use in [pipeline definitions][2].

## Sumo Logic metrics handler example

This example shows a Sumo Logic metrics handler resource definition configured to **TODO**:

{{< language-toggle >}}

{{< code yml >}}
---
type: SumoLogicMetricsHandler
api_version: ???/v1
metadata:
  name: sumologicmetrics
  namespace: default
spec:
  url: "https://endpoint5.collection.us2.sumologic.com/receiver/v1/http/xxxxxxxx"
  secrets:
  - name: SUMOLOGIC_METRICS_URL
    secret: sumologic_metrics_us2
  max_connections: 10
  min_connections: 5
  min_reconnect_delay: 10ms
  max_reconnect_delay: 10s
{{< /code >}}

{{< code json >}}
{
  "type": "SumoLogicMetricsHandler",
  "api_version": "???/v1",
  "metadata": {
    "name": "sumologicmetrics",
    "namespace": "default"
  },
  "spec": {
    "url": "https://endpoint5.collection.us2.sumologic.com/receiver/v1/http/xxxxxxxx",
    "secrets": [
      {
        "name": "SUMOLOGIC_METRICS_URL",
        "secret": "sumologic_metrics_us2"
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
description  | Top-level attribute that specifies the Sensu API group and version. For Sumo Logic metrics handlers in this version of Sensu, the `api_version` should always be `???`.
required     | Required for Sumo Logic metrics handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: ???/v1
{{< /code >}}
{{< code json >}}
{
  "api_version": "???/v1"
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
  name: sumologicmetrics
  namespace: default
  created_by: admin
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "name": "sumologicmetrics",
    "namespace": "default",
    "created_by": "admin"
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
  url: https://endpoint5.collection.us2.sumologic.com/receiver/v1/http/xxxxxxxx
  secrets:
  - name: SUMOLOGIC_METRICS_URL
    secret: sumologic_metrics_us2
  max_connections: 10
  min_connections: 5
  min_reconnect_delay: 10ms
  max_reconnect_delay: 10s
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "url": "https://endpoint5.collection.us2.sumologic.com/receiver/v1/http/xxxxxxxx",
    "secrets": [
      {
        "name": "SUMOLOGIC_METRICS_URL",
        "secret": "sumologic_metrics_us2"
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

### Metadata attributes

| name       |      |
-------------|------
description  | Unique string used to identify the Sumo Logic metrics handler. Sumo Logic metrics handler names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][18]). Each Sumo Logic metrics handler must have a unique name within its namespace.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: sumologicmetrics
{{< /code >}}
{{< code json >}}
{
  "name": "sumologicmetrics"
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

### Spec attributes

url          | 
-------------|------
description  | The URL for the Sumo Logic HTTP Logs and Metrics Source where Sensu should transmit the observability metrics. You can also provide the URL as a [secret][6].
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
address: https://endpoint5.collection.us2.sumologic.com/receiver/v1/http/xxxxxxxx
{{< /code >}}
{{< code json >}}
{
  "address": "https://endpoint5.collection.us2.sumologic.com/receiver/v1/http/xxxxxxxx"
}
{{< /code >}}
{{< /language-toggle >}}

secrets      | 
-------------|------
description  | Array of the name/secret pairs to use with command execution. Read [secrets attributes][6] for details.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
secrets:
- name: SUMOLOGIC_METRICS_URL
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
description  | Maximum number of connections to keep alive in the connection pool. If set to `0`, connection pooling is disabled.
required     | true 
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

max_reconnect_delay | 
-------------|------
description  | Maximum time to wait while retrying a broken connection. In seconds (`s`) or milliseconds (`ms`).
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
max_reconnect_delay: 10s
{{< /code >}}
{{< code json >}}
{
  "max_reconnect_delay": 10s
}
{{< /code >}}
{{< /language-toggle >}}

min_connections | 
-------------|------
description  | Minimum number of connections to keep alive in the connection pool.
required     | true 
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
min_connections: 3
{{< /code >}}
{{< code json >}}
{
  "min_connections": 3
}
{{< /code >}}
{{< /language-toggle >}}

min_reconnect_delay | 
-------------|------
description  | Minimum time to wait while retrying a broken connection. In seconds (`s`) or milliseconds (`ms`).
required     | true 
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
min_reconnect_delay: 10ms
{{< /code >}}
{{< code json >}}
{
  "min_reconnect_delay": "10ms"
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
[18]: https://regex101.com/r/zo9mQU/2
[22]: ../
[24]: ../../observe-filter/filters/
[29]: ../../../observability-pipeline/
