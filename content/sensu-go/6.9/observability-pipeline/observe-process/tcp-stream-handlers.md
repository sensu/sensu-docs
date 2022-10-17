---
title: "TCP stream handlers reference"
linkTitle: "TCP Stream Handlers Reference"
reference_title: "TCP stream handlers"
type: "reference"
description: "Read this reference to use TCP stream handlers to send observability data to TCP sockets without the data bottlenecks of traditional TCP handlers."
weight: 90
version: "6.9"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.9:
    parent: observe-process
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access TCP stream handlers in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

Sensu executes TCP stream handlers during the **[process][22]** stage of the [observability pipeline][29].

Like traditional [TCP handlers][1], TCP stream handlers send observability event data to TCP sockets for external services to consume.
However, TCP stream handlers can help prevent the data bottlenecks you may experience with traditional TCP handlers.

Traditional TCP handlers start a new UNIX process for every Sensu event they receive and require a new connection to send every event.
As you scale up and process more events per second, the rate at which the TCP handler can transmit observability event data decreases.

TCP stream handlers allow you to configure a connection pool with a maximum number of connections for the handler to use.
For example, suppose you configure a TCP stream handler with a pool of 10 connections, and 1000 events are queued for transmission.
As each connection finishes transmitting an event, it becomes available again and returns to the pool so the handler can use it to send the next event in the queue.

TCP stream handlers will reuse the available connections as long as they can rather than requiring a new connection for every event, which increases event throughput.
In addition to providing a persistent TCP connection to transmit Sensu observation events to a remote data storage service, TCP stream handlers allow you to use transport layer security (TLS) for secure data transmission.

TCP stream handlers are commercial resources available for use in [pipeline definitions][2].

## TCP stream handler example

This example shows a TCP stream handler resource definition configured to use TLS:

{{< language-toggle >}}

{{< code yml >}}
---
type: TCPStreamHandler
api_version: pipeline/v1
metadata:
  name: logstash
spec:
  address: 127.0.0.1:4242
  tls_ca_cert_file: "/path/to/tls/ca.pem"
  tls_cert_file: "/path/to/tls/cert.pem"
  tls_key_file: "/path/to/tls/key.pem"
  max_connections: 10
  min_reconnect_delay: 10ms
  max_reconnect_delay: 10s
{{< /code >}}

{{< code json >}}
{
  "type": "TCPStreamHandler",
  "api_version": "pipeline/v1",
  "metadata": {
    "name": "logstash"
  },
  "spec": {
    "address": "127.0.0.1:4242",
    "tls_ca_cert_file": "/path/to/tls/ca.pem",
    "tls_cert_file": "/path/to/tls/cert.pem",
    "tls_key_file": "/path/to/tls/key.pem",
    "max_connections": 10,
    "min_reconnect_delay": "10ms",
    "max_reconnect_delay": "10s"
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Use TCP stream handlers

TCP stream handlers are commercial resources and are available for use **only** in [pipelines][2].

{{% notice note %}}
**NOTE**: TCP stream handlers **are not** used by listing the handler name in the check [handlers attribute](../../observe-schedule/checks/#handlers-array).
{{% /notice %}}

To use a TCP stream handler, list it as the [handler][11] in a [pipeline][2] definition.
For example, this pipeline definition uses the [logstash example][12] along with the built-in [is_incident][13] event filter:

{{< language-toggle >}}

{{< code yml >}}
---
type: Pipeline
api_version: core/v2
metadata:
  name: tcp_logging_workflows
spec:
  workflows:
  - name: log_all_incidents
    filters:
    - name: is_incident
      type: EventFilter
      api_version: core/v2
    handler:
      name: logstash
      type: TCPStreamHandler
      api_version: pipeline/v1
{{< /code >}}

{{< code json >}}
{
  "type": "Pipeline",
  "api_version": "core/v2",
  "metadata": {
    "name": "tcp_logging_workflows"
  },
  "spec": {
    "workflows": [
      {
        "name": "log_all_incidents",
        "filters": [
          {
            "name": "is_incident",
            "type": "EventFilter",
            "api_version": "core/v2"
          }
        ],
        "handler": {
          "name": "logstash",
          "type": "TCPStreamHandler",
          "api_version": "pipeline/v1"
        }
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

## TCP stream handler specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][4] resource type. TCP stream handlers should always be type `TCPStreamHandler`.
required     | Required for TCP stream handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: TCPStreamHandler
{{< /code >}}
{{< code json >}}
{
  "type": "TCPStreamHandler"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For TCP stream handlers in this version of Sensu, the `api_version` should always be `pipeline/v1`.
required     | Required for TCP stream handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
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
description  | Top-level collection of metadata about the TCP stream handler that includes `name`, `namespace`, and `created_by` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the handler definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. Read [metadata attributes][8] for details.
required     | Required for TCP stream handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: logstash
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
    "name": "logstash",
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
description  | Top-level map that includes the TCP stream handler [spec attributes][5].
required     | Required for TCP stream handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  address: 127.0.0.1:4242
  tls_ca_cert_file: "/path/to/tls/ca.pem"
  tls_cert_file: "/path/to/tls/cert.pem"
  tls_key_file: "/path/to/tls/key.pem"
  max_connections: 10
  min_reconnect_delay: 10ms
  max_reconnect_delay: 10s
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "address": "127.0.0.1:4242",
    "tls_ca_cert_file": "/path/to/tls/ca.pem",
    "tls_cert_file": "/path/to/tls/cert.pem",
    "tls_key_file": "/path/to/tls/key.pem",
    "max_connections": 10,
    "min_reconnect_delay": "10ms",
    "max_reconnect_delay": "10s"
  }
}
{{< /code >}}
{{< /language-toggle >}}

### Metadata attributes

| name       |      |
-------------|------
description  | Unique string used to identify the TCP stream handler. TCP stream handler names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][18]). Each TCP stream handler must have a unique name within its namespace.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: logstash
{{< /code >}}
{{< code json >}}
{
  "name": "logstash"
}
{{< /code >}}
{{< /language-toggle >}}

| namespace  |      |
-------------|------
description  | Sensu [RBAC namespace][9] that the TCP stream handler belongs to.
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
description  | Username of the Sensu user who created the TCP stream handler or last updated the TCP stream handler. Sensu automatically populates the `created_by` field when the TCP stream handler is created or updated.
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
description  | Custom attributes to include with observation event data that you can use for response and web UI view filtering.<br><br>If you include labels in your event data, you can filter [API responses][15], [sensuctl responses][16], and [web UI views][25] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
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
description  | Non-identifying metadata to include with observation event data that you can access with [event filters][24]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][15], [sensuctl response filtering][16], or [web UI views][28].
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

address      | 
-------------|------
description  | The hostname:port combination the TCP stream handler should connect to.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
address: 127.0.0.1:4242
{{< /code >}}
{{< code json >}}
{
  "address": "127.0.0.1:4242"
}
{{< /code >}}
{{< /language-toggle >}}

tls_ca_cert_file | 
-------------|------
description  | Path to the PEM-format CA certificate to use for TLS client authentication.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
tls_ca_cert_file: "/path/to/tls/ca.pem"
{{< /code >}}
{{< code json >}}
{
  "tls_ca_cert_file": "/path/to/tls/ca.pem"
}
{{< /code >}}
{{< /language-toggle >}}

tls_cert_file | 
-------------|------
description  | Path to the PEM-format certificate to use for TLS client authentication. This certificate and its corresponding key are required for secure client communication.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
tls_cert_file: "/path/to/tls/cert.pem"
{{< /code >}}
{{< code json >}}
{
  "tls_cert_file": "/path/to/tls/cert.pem"
}
{{< /code >}}
{{< /language-toggle >}}

tls_key_file | 
------------|------
description | Path to the PEM-format key file associated with the tls_cert_file to use for TLS client authentication. This key and its corresponding certificate are required for secure client communication.
required    | false
type        | String
example     | {{< language-toggle >}}
{{< code yml >}}
tls_key_file: "/path/to/tls/key.pem"
{{< /code >}}
{{< code json >}}
{
  "tls_key_file": "/path/to/tls/key.pem"
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
  "max_reconnect_delay": "10s"
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


[1]: ../handlers/#tcpudp-handlers
[2]: ../pipelines/
[4]: ../../../sensuctl/create-manage-resources/#create-resources
[5]: #spec-attributes
[8]: #metadata-attributes
[9]: ../../../operations/control-access/namespaces/
[11]: ../pipelines/#handlers-pipeline
[12]: #tcp-stream-handler-example
[13]: ../../observe-filter/filters/#built-in-filter-is_incident
[15]: ../../../api/#response-filtering
[16]: ../../../sensuctl/filter-responses/
[18]: https://regex101.com/r/zo9mQU/2
[22]: ../
[24]: ../../observe-filter/filters/
[25]: ../../../web-ui/search#search-for-labels
[28]: ../../../web-ui/search/
[29]: ../../../observability-pipeline/
