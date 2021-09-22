---
title: "TCP stream handlers reference"
linkTitle: "TCP Stream Handlers Reference"
reference_title: "TCP stream handlers"
type: "reference"
description: "TCP stream handlers are actions the Sensu backend executes on events, allowing you to created automated monitoring workflows. Read the reference doc to learn about handlers."
weight: 10
version: "6.5"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.5:
    parent: observe-process
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access TCP stream handlers in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

Sensu executes TCP stream handlers during the **[process][22]** stage of the [observability pipeline][29].

Like other Sensu [handlers][1], TCP stream handlers are actions the Sensu backend executes on observability events.

## TCP stream handler example

This example shows a TCP stream handler resource definition with the required attributes:

{{< language-toggle >}}

{{< code yml >}}
---
type: TCPStreamHandler
api_version: TCPStreamHandler/v1
metadata:
  name: logstash
  namespace: default
spec:
  address: 127.0.0.1:4242
  tls_ca_cert_file: "/path/to/tls/ca.pem"
  tls_cert_file: "/etc/sensu/tls/cert.pem"
  tls_key_file: "/path/to/tls/backend-1-key.pem"
  max_connections: 10
  min_connections: 3
  min_reconnect_delay: 10ms
  max_reconnect_delay: 10s
{{< /code >}}

{{< code json >}}
{
  "type": "TCPStreamHandler",
  "api_version": "TCPStreamHandler/v1",
  "metadata": {
    "name": "logstash",
    "namespace": "default"
  },
  "spec": {
    "address": "127.0.0.1:4242",
    "tls_ca_cert_file": "/path/to/tls/ca.pem",
    "tls_cert_file": "/etc/sensu/tls/cert.pem",
    "tls_key_file": "/path/to/tls/backend-1-key.pem",
    "max_connections": 10,
    "min_connections": 3,
    "min_reconnect_delay": "10ms",
    "max_reconnect_delay": "10s"
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
description  | Top-level attribute that specifies the Sensu API group and version. For TCP stream handlers in this version of Sensu, the `api_version` should always be `TCPStreamHandler/v1`.
required     | Required for TCP stream handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: TCPStreamHandler/v1
{{< /code >}}
{{< code json >}}
{
  "api_version": "TCPStreamHandler/v1"
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
    region: us-west-1
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
      "region": "us-west-1"
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
  tls_cert_file: "/etc/sensu/tls/cert.pem"
  tls_key_file: "/path/to/tls/backend-1-key.pem"
  max_connections: 10
  min_connections: 3
  min_reconnect_delay: 10ms
  max_reconnect_delay: 10s
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "address": "127.0.0.1:4242",
    "tls_ca_cert_file": "/path/to/tls/ca.pem",
    "tls_cert_file": "/etc/sensu/tls/cert.pem",
    "tls_key_file": "/path/to/tls/backend-1-key.pem",
    "max_connections": 10,
    "min_connections": 3,
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
description  | Custom attributes to include with observation data in events that you can use for response and web UI view filtering.<br><br>If you include labels in your event data, you can filter [API responses][10], [sensuctl responses][11], and [web UI views][25] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
labels:
  region: us-west-1
{{< /code >}}
{{< code json >}}
{
  "labels": {
    "region": "us-west-1"
  }
}
{{< /code >}}
{{< /language-toggle >}}

| annotations |     |
-------------|------
description  | Non-identifying metadata to include with observation data in events that you can access with [event filters][24]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][10], [sensuctl response filtering][11], or [web UI views][28].
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

Path to the client server TLS trusted CA certificate file. Secures communication with the etcd client server.

tls_ca_cert_file | 
-------------|------
description  | Path to the primary backend CA file. This CA file is used in communication between the Sensu web UI and end user web browsers, as well as communication between sensuctl and the Sensu API.
required     | false
type         | Array
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
description  | Path to the public certificate file.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
tls_cert_file: "/etc/sensu/tls/cert.pem"
{{< /code >}}
{{< code json >}}
{
  "tls_cert_file": "/etc/sensu/tls/cert.pem"
}
{{< /code >}}
{{< /language-toggle >}}

tls_key_file | 
------------|------
description | Path to the primary backend key file. This key secures communication between the Sensu web UI and end user web browsers, as well as communication between sensuctl and the Sensu API.
required    | true
type        | String
example     | {{< language-toggle >}}
{{< code yml >}}
tls_key_file: "/path/to/tls/backend-1-key.pem"
{{< /code >}}
{{< code json >}}
{
  "tls_key_file": "/path/to/tls/backend-1-key.pem"
}
{{< /code >}}
{{< /language-toggle >}}

max_connections | 
-------------|------
description  | Maximum number of connections to keep alive in the connection pool. If set to `0`, connection pooling is disabled.
required     | true 
type         | String
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
type         | String
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
  "min_reconnect_delay": 10ms
}
{{< /code >}}
{{< /language-toggle >}}


[1]: ../handlers/
[4]: ../../../sensuctl/create-manage-resources/#create-resources
[5]: #spec-attributes
[8]: #metadata-attributes
[9]: ../../../operations/control-access/namespaces/
[10]: ../../../api#response-filtering
[11]: ../../../sensuctl/filter-responses/
[18]: https://regex101.com/r/zo9mQU/2
[22]: ../
[24]: ../../observe-filter/filters/
[25]: ../../../web-ui/search#search-for-labels
[28]: ../../../web-ui/search/
[29]: ../../../observability-pipeline/
