---
title: "enterprise/pipeline/v1/tcp-stream-handlers"
description: "The Sensu pipeline API provides HTTP access to data for Sensu's streaming handlers. This reference includes examples for returning lists of streaming handlers, creating a streaming handler, and more. Read on for the full reference."
enterpriseapi_title: "enterprise/pipeline/v1/tcp-stream-handlers"
type: "enterprise_api"
version: "6.5"
product: "Sensu Go"
menu:
  sensu-go-6.5:
    parent: api
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access pipeline API resources in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

{{% notice note %}}
**NOTE**: Requests to the pipeline API require you to authenticate with a Sensu [API key](../#configure-an-environment-variable-for-api-key-authentication) or [access token](../#authenticate-with-the-authentication-api).
The code examples in this document use the [environment variable](../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

**Need to explain here how Pipeline API differs from the core/v2 pipeline endpoint**.

## Get all TCP stream handler pipeline resources

The `/tcpstreamhandlers` API endpoint provides HTTP GET access to [TCP stream handler][1] data.

### Example {#handlers-get-example}

The following example demonstrates a request to the `/tcpstreamhandlers` API endpoint, resulting in a JSON array that contains [TCP stream handler definitions][1].

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/pipeline/v1/tcp-stream-handlers \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
[
  {
    "metadata": {
      "name": "influx-db",
      "namespace": "default",
      "created_by": "admin"
    },
    "type": "pipe",
    "command": "sensu-influxdb-handler -d sensu",
    "timeout": 0,
    "handlers": null,
    "filters": null,
    "env_vars": [
      "INFLUXDB_ADDR=http://influxdb.default.svc.cluster.local:8086",
      "INFLUXDB_USER=sensu",
      "INFLUXDB_PASSWORD=password"
    ],
    "runtime_assets": ["sensu/sensu-influxdb-handler"]
  },
  {
    "metadata": {
      "name": "slack",
      "namespace": "default",
      "created_by": "admin"
    },
    "type": "pipe",
    "command": "sensu-slack-handler --channel '#monitoring'",
    "timeout": 0,
    "handlers": null,
    "filters": [
      "is_incident",
      "not_silenced"
    ],
    "env_vars": [
      "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
    ],
    "runtime_assets": ["sensu/sensu-influxdb-handler"]
  }
]
{{< /code >}}

### API Specification {#handlers-get-specification}

/tcpstreamhandlers (GET)  | 
---------------|------
description    | Returns the list of TCP stream handlers.
example url    | http://hostname:8080/api/enterprise/pipeline/v1/tcp-stream-handler
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response filtering | This endpoint supports [API response filtering][3].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code shell >}}
[
  {
    "metadata": {
      "name": "influx-db",
      "namespace": "default",
      "created_by": "admin"
    },
    "type": "pipe",
    "command": "sensu-influxdb-handler -d sensu",
    "timeout": 0,
    "handlers": null,
    "filters": null,
    "env_vars": [
      "INFLUXDB_ADDR=http://influxdb.default.svc.cluster.local:8086",
      "INFLUXDB_USER=sensu",
      "INFLUXDB_PASSWORD=password"
    ],
    "runtime_assets": ["sensu/sensu-influxdb-handler"]
  },
  {
    "metadata": {
      "name": "slack",
      "namespace": "default"
    },
    "type": "pipe",
    "command": "sensu-slack-handler --channel '#monitoring'",
    "timeout": 0,
    "handlers": null,
    "filters": [
      "is_incident",
      "not_silenced"
    ],
    "env_vars": [
      "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
    ],
    "runtime_assets": ["sensu/sensu-slack-handler"]
  }
]
{{< /code >}}

## Create a new TCP stream handler

The `/tcpstreamhandlers` API endpoint provides HTTP POST access to create a TCP stream handler.

### Example {#handlers-post-example}

In the following example, an HTTP POST request is submitted to the `/tcpstreamhandlers` API endpoint to create the TCP stream handler `???`.
The request returns a successful HTTP `201 Created` response.

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "metadata": {
    "name": "influx-db",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "command": "sensu-influxdb-handler -d sensu",
  "env_vars": [
    "INFLUXDB_ADDR=http://influxdb.default.svc.cluster.local:8086",
    "INFLUXDB_USER=sensu",
    "INFLUXDB_PASSWORD=password"
  ],
  "filters": [],
  "handlers": [],
  "runtime_assets": [],
  "timeout": 0,
  "type": "pipe"
}' \
http://127.0.0.1:8080/api/enterprise/pipeline/v1/tcp-stream-handler

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#handlers-post-specification}

/tcpstreamhandlers (POST) | 
----------------|------
description     | Creates a Sensu TCP stream handler.
example URL     | http://hostname:8080/api/enterprise/pipeline/v1/tcp-stream-handler
payload         | {{< code shell >}}
{
  "metadata": {
    "name": "influx-db",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "command": "sensu-influxdb-handler -d sensu",
  "env_vars": [
    "INFLUXDB_ADDR=http://influxdb.default.svc.cluster.local:8086",
    "INFLUXDB_USER=sensu",
    "INFLUXDB_PASSWORD=password"
  ],
  "filters": [],
  "handlers": [],
  "runtime_assets": [],
  "timeout": 0,
  "type": "pipe"
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific TCP stream handler

The `/tcpstreamhandlers/:tcpstreamhandler` API endpoint provides HTTP GET access to [TCP stream handler data][1] for specific `:tcpstreamhandler` definitions, by handler `name`.

### Example

In the following example, querying the `/tcpstreamhandlers/:tcpstreamhandler` API endpoint returns a JSON map that contains the requested [`:tcpstreamhandler` definition][1] (in this example, for the `:tcpstreamhandler` named `???`).

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/pipeline/v1/tcp-stream-handler/??? \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
{
  "metadata": {
    "name": "slack",
    "namespace": "default",
    "created_by": "admin",
    "labels": null,
    "annotations": null
  },
  "command": "sensu-slack-handler --channel '#monitoring'",
  "env_vars": [
    "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
  ],
  "filters": [
    "is_incident",
    "not_silenced"
  ],
  "handlers": [],
  "runtime_assets": [],
  "timeout": 0,
  "type": "pipe"
}
{{< /code >}}

### API Specification

/tcpstreamhandlers/:tcpstreamhandler (GET) | 
---------------------|------
description          | Returns a TCP stream handler.
example url          | http://hostname:8080/api/enterprise/pipeline/v1/tcp-stream-handler/???
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code json >}}
{
  "metadata": {
    "name": "slack",
    "namespace": "default",
    "created_by": "admin",
    "labels": null,
    "annotations": null
  },
  "command": "sensu-slack-handler --channel '#monitoring'",
  "env_vars": [
    "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
  ],
  "filters": [
    "is_incident",
    "not_silenced"
  ],
  "handlers": [],
  "runtime_assets": [],
  "timeout": 0,
  "type": "pipe"
}
{{< /code >}}

## Create or update a TCP stream handler

The `/tcpstreamhandlers/:tcpstreamhandler` API endpoint provides HTTP PUT access to create or update a specific `:tcpstreamhandler` definition, by handler name.

### Example

In the following example, an HTTP PUT request is submitted to the `/tcpstreamhandlers/:tcpstreamhandler` API endpoint to create the handler `???`.
The request returns a successful HTTP `201 Created` response.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "metadata": {
    "name": "influx-db",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "command": "sensu-influxdb-handler -d sensu",
  "env_vars": [
    "INFLUXDB_ADDR=http://influxdb.default.svc.cluster.local:8086",
    "INFLUXDB_USER=sensu",
    "INFLUXDB_PASSWORD=password"
  ],
  "filters": [],
  "handlers": [],
  "runtime_assets": ["sensu/sensu-influxdb-handler"],
  "timeout": 0,
  "type": "pipe"
}' \
http://127.0.0.1:8080/api/enterprise/pipeline/v1/tcp-stream-handler/???

HTTP/1.1 201 Created
{{< /code >}}

### API Specification

/tcpstreamhandlers/:tcpstreamhandler (PUT) | 
----------------|------
description     | Creates or updates the specified Sensu TCP stream handler.
example URL     | http://hostname:8080/api/enterprise/pipeline/v1/tcp-stream-handler/???
payload         | {{< code shell >}}
{
  "metadata": {
    "name": "influx-db",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "command": "sensu-influxdb-handler -d sensu",
  "env_vars": [
    "INFLUXDB_ADDR=http://influxdb.default.svc.cluster.local:8086",
    "INFLUXDB_USER=sensu",
    "INFLUXDB_PASSWORD=password"
  ],
  "filters": [],
  "handlers": [],
  "runtime_assets": [],
  "timeout": 0,
  "type": "pipe"
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Update a TCP stream handler with PATCH

The `/tcpstreamhandlers/:tcpstreamhandler` API endpoint provides HTTP PATCH access to update `:tcpstreamhandler` definitions, specified by handler name.

{{% notice note %}}
**NOTE**: You cannot change a resource's `name` or `namespace` with a PATCH request.
Use a [PUT request](#tcpstreamhandlerstcpstreamhandler-put) instead.<br><br>
Also, you cannot add elements to an array with a PATCH request &mdash; you must replace the entire array.
{{% /notice %}}

### Example

In the following example, an HTTP PATCH request is submitted to the `/tcpstreamhandlers/:tcpstreamhandler` API endpoint to update the filters array for the `???` handler, resulting in an HTTP `200 OK` response and the updated handler definition.

We support [JSON merge patches][4], so you must set the `Content-Type` header to `application/merge-patch+json` for PATCH requests.

{{< code shell >}}
curl -X PATCH \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/merge-patch+json' \
-d '{
  "filters": [
    "us-west",
    "is_incident"
  ]
}' \
http://127.0.0.1:8080/api/enterprise/pipeline/v1/tcp-stream-handler/???

HTTP/1.1 200 OK
{{< /code >}}

### API Specification

/tcpstreamhandlers/:tcpstreamhandler (PATCH) | 
----------------|------
description     | Updates the specified Sensu TCP stream handler.
example URL     | http://hostname:8080/api/enterprise/pipeline/v1/tcp-stream-handler/???
payload         | {{< code shell >}}
{
  "filters": [
    "us-west",
    "is_incident"
  ]
}
{{< /code >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a TCP stream handler

The `/tcpstreamhandlers/:tcpstreamhandler` API endpoint provides HTTP DELETE access to delete a TCP stream handler from Sensu (specified by the handler name).

### Example

The following example shows a request to the `/tcpstreamhandlers/:tcpstreamhandler` API endpoint to delete the TCP stream handler `???`, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/enterprise/pipeline/v1/tcp-stream-handler/??? \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification

/tcpstreamhandlers/:tcpstreamhandler (DELETE) | 
--------------------------|------
description               | Removes the specified TCP stream handler from Sensu.
example url               | http://hostname:8080/api/enterprise/pipeline/v1/tcp-stream-handler/???
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../../observability-pipeline/observe-process/tcpstreamhandlers/
[2]: ../#pagination
[3]: ../#response-filtering
[4]: https://tools.ietf.org/html/rfc7396
