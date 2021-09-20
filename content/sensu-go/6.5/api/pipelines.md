---
title: "Pipelines API"
description: "The Sensu pipelines API provides HTTP access to pipeline data. This reference includes examples for returning lists of pipelines, creating a Sensu pipeline, and more. Read on for the full reference."
api_title: "Pipelines API"
type: "api"
version: "6.5"
product: "Sensu Go"
menu:
  sensu-go-6.5:
    parent: api
---

{{% notice note %}}
**NOTE**: Requests to the pipelines API require you to authenticate with a Sensu [API key](../#configure-an-environment-variable-for-api-key-authentication) or [access token](../#authenticate-with-the-authentication-api).
The code examples in this document use the [environment variable](../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all pipelines

The `/pipelines` API endpoint provides HTTP GET access to [pipeline][1] data.

### Example

The following example demonstrates a request to the `/pipelines` API endpoint, resulting in a JSON array that contains [pipeline definitions][1].

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/pipelines \
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

### API Specification

/pipelines (GET)  | 
---------------|------
description    | Returns the list of pipelines.
example url    | http://hostname:8080/api/core/v2/namespaces/default/pipelines
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

## Create a new pipeline

The `/pipelines` API endpoint provides HTTP POST access to create a pipeline.

### Example

In the following example, an HTTP POST request is submitted to the `/pipelines` API endpoint to create the pipeline resource ` `.
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
http://127.0.0.1:8080/api/core/v2/namespaces/default/pipelines

HTTP/1.1 201 Created
{{< /code >}}

### API Specification

/pipelines (POST) | 
----------------|------
description     | Creates a Sensu pipeline.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/pipelines
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

## Get a specific pipeline

The `/pipelines/:pipeline` API endpoint provides HTTP GET access to [pipeline data][1] for specific `:pipeline` definitions, by pipeline `name`.

### Example

In the following example, querying the `/pipelines/:pipeline` API endpoint returns a JSON map that contains the requested [`:pipeline` definition][1] (in this example, for the `:pipeline` named ` `).

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/pipelines/slack \
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

/pipelines/:pipeline (GET) | 
---------------------|------
description          | Returns a pipeline.
example url          | http://hostname:8080/api/core/v2/namespaces/default/pipelines/slack
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

## Create or update a pipeline

The `/pipelines/:pipeline` API endpoint provides HTTP GET access to create or update a specific `:pipeline` definition, by pipeline name.

### Example

In the following example, an HTTP PUT request is submitted to the `/pipelines/:pipeline` API endpoint to create the pipeline ` `.
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
http://127.0.0.1:8080/api/core/v2/namespaces/default/pipelines/influx-db

HTTP/1.1 201 Created
{{< /code >}}

### API Specification

/pipelines/:pipeline (PUT) | 
----------------|------
description     | Creates or updates the specified Sensu pipeline.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/pipelines/influx-db
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

## Update a pipeline with PATCH

The `/pipelines/:pipeline` API endpoint provides HTTP PATCH access to update `:pipeline` definitions, specified by pipeline name.

{{% notice note %}}
**NOTE**: You cannot change a resource's `name` or `namespace` with a PATCH request.
Use a [PUT request](#pipelinespipeline-put) instead.<br><br>
Also, you cannot add elements to an array with a PATCH request &mdash; you must replace the entire array.
{{% /notice %}}

### Example

In the following example, an HTTP PATCH request is submitted to the `/pipelines/:pipeline` API endpoint to update the filters array for the ` ` pipeline, resulting in an HTTP `200 OK` response and the updated pipeline definition.

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
http://127.0.0.1:8080/api/core/v2/namespaces/default/pipelines/influx-db

HTTP/1.1 200 OK
{{< /code >}}

### API Specification

/pipelines/:pipeline (PATCH) | 
----------------|------
description     | Updates the specified Sensu pipeline.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/pipelines/influx-db
payload         | {{< code shell >}}
{
  "filters": [
    "us-west",
    "is_incident"
  ]
}
{{< /code >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a pipeline

The `/pipelines/:pipeline` API endpoint provides HTTP DELETE access to delete a pipeline from Sensu (specified by the pipeline name).

### Example

The following example shows a request to the `/pipelines/:pipeline` API endpoint to delete the pipeline ` `, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/core/v2/namespaces/default/pipelines/slack \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification

/pipelines/:pipeline (DELETE) | 
--------------------------|------
description               | Removes the specified pipeline from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/default/pipelines/slack
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../observability-pipeline/observe-process/pipelines/
[2]: ../#pagination
[3]: ../#response-filtering
[4]: https://tools.ietf.org/html/rfc7396
