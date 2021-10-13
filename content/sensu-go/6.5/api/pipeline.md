---
title: "Pipeline API"
linkTitle: "Pipeline API"
description: "The Sensu pipeline API provides HTTP access to data for Sensu's Sumo Logic metrics and TCP stream handlers. This reference includes examples for returning lists of handlers, creating a handler, and more. Read on for the full reference."
api_title: "Pipeline API"
type: "api"
version: "6.5"
product: "Sensu Go"
menu:
  sensu-go-6.5:
    parent: api
---

{{% notice warning %}}
**IMPORTANT**: The pipeline API group does not create [pipeline resources](../../observability-pipeline/observe-process/pipelines/), which are composed of observation event processing workflows.
Instead, the pipeline API group allows you to create resources that can **only** be used within pipelines.<br><br>
Read the [Sumo Logic metrics handlers reference](../../observability-pipeline/observe-process/sumo-logic-metrics-handlers) and [TCP stream handlers reference](../../observability-pipeline/observe-process/tcp-stream-handlers) for more information about the pipeline API group resources.
{{% /notice %}}

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the pipeline API group in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

{{% notice note %}}
**NOTE**: Requests to the pipeline API group require you to authenticate with a Sensu [API key](../#configure-an-environment-variable-for-api-key-authentication) or [access token](../#authenticate-with-the-authentication-api).
The code examples in this document use the [environment variable](../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all Sumo Logic metrics handler resources

The `/sumo-logic-metrics-handlers` API endpoint provides HTTP GET access to [Sumo Logic metrics handler][5] data.

### Example {#handlers-get-example}

The following example demonstrates a request to the `/sumo-logic-metrics-handlers` API endpoint, resulting in a JSON array that contains [Sumo Logic metrics handler definitions][5].

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/pipeline/v1/namespace/default/sumo-logic-metrics-handlers \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
[
  {
    "type": "SumoLogicMetricsHandler",
    "api_version": "pipeline/v1",
    "metadata": {
      "name": "sumologic_http_log_metrics_us1",
      "namespace": "default"
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
      "timeout": "30s"
    }
  },
  {
    "type": "SumoLogicMetricsHandler",
    "api_version": "pipeline/v1",
    "metadata": {
      "name": "sumologic_http_log_metrics_us2",
      "namespace": "default"
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
]
{{< /code >}}

### API Specification {#handlers-get-specification}

/sumo-logic-metrics-handlers (GET)  | 
---------------|------
description    | Returns the list of Sumo Logic metrics handlers.
example url    | http://hostname:8080/api/enterprise/pipeline/v1/namespace/default/sumo-logic-metrics-handlers
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response filtering | This endpoint supports [API response filtering][3].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code shell >}}
[
  {
    "type": "SumoLogicMetricsHandler",
    "api_version": "pipeline/v1",
    "metadata": {
      "name": "sumologic_http_log_metrics_us1",
      "namespace": "default"
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
      "timeout": "30s"
    }
  },
  {
    "type": "SumoLogicMetricsHandler",
    "api_version": "pipeline/v1",
    "metadata": {
      "name": "sumologic_http_log_metrics_us2",
      "namespace": "default"
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
]
{{< /code >}}

## Create a new Sumo Logic metrics handler

The `/sumo-logic-metrics-handlers` API endpoint provides HTTP POST access to create a Sumo Logic metrics handler.

### Example {#handlers-post-example}

In the following example, an HTTP POST request is submitted to the `/sumo-logic-metrics-handlers` API endpoint to create the Sumo Logic metrics handler `sumologic_http_log_metrics_us1`.
The request returns a successful HTTP `201 Created` response.

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "type": "SumoLogicMetricsHandler",
  "api_version": "pipeline/v1",
  "metadata": {
    "name": "sumologic_http_log_metrics_us1",
    "namespace": "default"
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
    "timeout": "30s"
  }
}' \
http://127.0.0.1:8080/api/enterprise/pipeline/v1/namespace/default/sumo-logic-metrics-handlers

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#handlers-post-specification}

/sumo-logic-metrics-handlers (POST) | 
----------------|------
description     | Creates a Sensu Sumo Logic metrics handler.
example URL     | http://hostname:8080/api/enterprise/pipeline/v1/namespace/default/sumo-logic-metrics-handlers
payload         | {{< code shell >}}
{
  "type": "SumoLogicMetricsHandler",
  "api_version": "pipeline/v1",
  "metadata": {
    "name": "sumologic_http_log_metrics_us1",
    "namespace": "default"
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
    "timeout": "30s"
  }
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific Sumo Logic metrics handler

The `/sumo-logic-metrics-handlers/:sumo-logic-metrics-handler` API endpoint provides HTTP GET access to [Sumo Logic metrics handler data][5] for specific `:sumo-logic-metrics-handler` definitions, by handler `name`.

### Example

In the following example, querying the `/sumo-logic-metrics-handlers/:sumo-logic-metrics-handler` API endpoint returns a JSON map that contains the requested [`:sumo-logic-metrics-handler` definition][5] (in this example, for the `:sumo-logic-metrics-handler` named `sumologic_http_log_metrics_us1`).

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/pipeline/v1/namespace/default/sumo-logic-metrics-handlers/sumologic_http_log_metrics_us1 \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
{
  "type": "SumoLogicMetricsHandler",
  "api_version": "pipeline/v1",
  "metadata": {
    "name": "sumologic_http_log_metrics_us1",
    "namespace": "default"
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
    "timeout": "30s"
  }
}
{{< /code >}}

### API Specification

/sumo-logic-metrics-handlers/:sumo-logic-metrics-handler (GET) | 
---------------------|------
description          | Returns a Sumo Logic metrics handler.
example url          | http://hostname:8080/api/enterprise/pipeline/v1/namespace/default/sumo-logic-metrics-handlers/sumologic_http_log_metrics_us1
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code json >}}
{
  "type": "SumoLogicMetricsHandler",
  "api_version": "pipeline/v1",
  "metadata": {
    "name": "sumologic_http_log_metrics_us1",
    "namespace": "default"
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
    "timeout": "30s"
  }
}
{{< /code >}}

## Create or update a Sumo Logic metrics handler

The `/sumo-logic-metrics-handlers/:sumo-logic-metrics-handler` API endpoint provides HTTP PUT access to create or update a specific `:sumo-logic-metrics-handler` definition, by handler name.

### Example

In the following example, an HTTP PUT request is submitted to the `/sumo-logic-metrics-handlers/:sumo-logic-metrics-handler` API endpoint to create the handler `sumologic_http_log_metrics_us2`.
The request returns a successful HTTP `201 Created` response.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "type": "SumoLogicMetricsHandler",
  "api_version": "pipeline/v1",
  "metadata": {
    "name": "sumologic_http_log_metrics_us2",
    "namespace": "default"
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
}' \
http://127.0.0.1:8080/api/enterprise/pipeline/v1/namespace/default/sumo-logic-metrics-handlers/sumologic_http_log_metrics_us2

HTTP/1.1 201 Created
{{< /code >}}

### API Specification

/sumo-logic-metrics-handlers/:sumo-logic-metrics-handler (PUT) | 
----------------|------
description     | Creates or updates the specified Sensu Sumo Logic metrics handler.
example URL     | http://hostname:8080/api/enterprise/pipeline/v1/namespace/default/sumo-logic-metrics-handlers/sumologic_http_log_metrics_us2
payload         | {{< code shell >}}
{
  "type": "SumoLogicMetricsHandler",
  "api_version": "pipeline/v1",
  "metadata": {
    "name": "sumologic_http_log_metrics_us2",
    "namespace": "default"
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
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a Sumo Logic metrics handler

The `/sumo-logic-metrics-handlers/:sumo-logic-metrics-handler` API endpoint provides HTTP DELETE access to delete a Sumo Logic metrics handler from Sensu (specified by the handler name).

### Example

The following example shows a request to the `/sumo-logic-metrics-handlers/:sumo-logic-metrics-handler` API endpoint to delete the Sumo Logic metrics handler `sumologic_http_log_metrics_us2`, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/enterprise/pipeline/v1/namespace/default/sumo-logic-metrics-handlers/sumologic_http_log_metrics_us2 \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification

/sumo-logic-metrics-handlers/:sumo-logic-metrics-handler (DELETE) | 
--------------------------|------
description               | Removes the specified Sumo Logic metrics handler from Sensu.
example url               | http://hostname:8080/api/enterprise/pipeline/v1/namespaces/default/sumo-logic-metrics-handlers/sumologic_http_log_metrics_us2
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get all TCP stream handler resources

The `/tcp-stream-handlers` API endpoint provides HTTP GET access to [TCP stream handler][1] data.

### Example {#handlers-get-example}

The following example demonstrates a request to the `/tcp-stream-handlers` API endpoint, resulting in a JSON array that contains [TCP stream handler definitions][1].

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/pipeline/v1/namespaces/default/tcp-stream-handlers \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
[
  {
    "type": "TCPStreamHandler",
    "api_version": "pipeline/v1",
    "metadata": {
      "name": "incident_log",
      "namespace": "default",
      "created_by": "admin"
    },
    "spec": {
      "address": "127.0.0.1:4242",
      "max_connections": 10,
      "max_reconnect_delay": "10s",
      "min_reconnect_delay": "10ms",
      "tls_ca_cert_file": "",
      "tls_cert_file": "",
      "tls_key_file": ""
    }
  },
  {
    "type": "TCPStreamHandler",
    "api_version": "pipeline/v1",
    "metadata": {
      "name": "logstash",
      "namespace": "default",
      "created_by": "admin"
    },
    "spec": {
      "address": "127.0.0.1:4242",
      "max_connections": 10,
      "max_reconnect_delay": "10s",
      "min_reconnect_delay": "10ms",
      "tls_ca_cert_file": "/path/to/tls/ca.pem",
      "tls_cert_file": "/path/to/tls/cert.pem",
      "tls_key_file": "/path/to/tls/key.pem"
    }
  }
]
{{< /code >}}

### API Specification {#handlers-get-specification}

/tcp-stream-handlers (GET)  | 
---------------|------
description    | Returns the list of TCP stream handlers.
example url    | http://hostname:8080/api/enterprise/pipeline/v1/namespaces/default/tcp-stream-handlers
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response filtering | This endpoint supports [API response filtering][3].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code shell >}}
[
  {
    "type": "TCPStreamHandler",
    "api_version": "pipeline/v1",
    "metadata": {
      "name": "incident_log",
      "namespace": "default",
      "created_by": "admin"
    },
    "spec": {
      "address": "127.0.0.1:4242",
      "max_connections": 10,
      "max_reconnect_delay": "10s",
      "min_reconnect_delay": "10ms",
      "tls_ca_cert_file": "",
      "tls_cert_file": "",
      "tls_key_file": ""
    }
  },
  {
    "type": "TCPStreamHandler",
    "api_version": "pipeline/v1",
    "metadata": {
      "name": "logstash",
      "namespace": "default",
      "created_by": "admin"
    },
    "spec": {
      "address": "127.0.0.1:4242",
      "max_connections": 10,
      "max_reconnect_delay": "10s",
      "min_reconnect_delay": "10ms",
      "tls_ca_cert_file": "/path/to/tls/ca.pem",
      "tls_cert_file": "/path/to/tls/cert.pem",
      "tls_key_file": "/path/to/tls/key.pem"
    }
  }
]
{{< /code >}}

## Create a new TCP stream handler

The `/tcp-stream-handlers` API endpoint provides HTTP POST access to create a TCP stream handler.

### Example {#handlers-post-example}

In the following example, an HTTP POST request is submitted to the `/tcp-stream-handlers` API endpoint to create the TCP stream handler `logstash`.
The request returns a successful HTTP `201 Created` response.

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "api_version": "pipeline/v1",
  "type": "TCPStreamHandler",
  "metadata": {
    "name": "logstash",
    "namespace": "default"
  },
  "spec": {
    "address": "127.0.0.1:4242",
    "tls_ca_cert_file": "/path/to/tls/ca.pem",
    "tls_cert_file": "/path/to/tls/cert.pem",
    "tls_key_file": "/path/to/tls/key.pem",
    "max_connections": 10,
    "min_connections": 5,
    "min_reconnect_delay": "10ms",
    "max_reconnect_delay": "10s"
  }
}' \
http://127.0.0.1:8080/api/enterprise/pipeline/v1/namespaces/default/tcp-stream-handlers

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#handlers-post-specification}

/tcp-stream-handlers (POST) | 
----------------|------
description     | Creates a Sensu TCP stream handler.
example URL     | http://hostname:8080/api/enterprise/pipeline/v1/namespaces/default/tcp-stream-handlers
payload         | {{< code shell >}}
{
  "api_version": "pipeline/v1",
  "type": "TCPStreamHandler",
  "metadata": {
    "name": "logstash",
    "namespace": "default"
  },
  "spec": {
    "address": "127.0.0.1:4242",
    "tls_ca_cert_file": "/path/to/tls/ca.pem",
    "tls_cert_file": "/path/to/tls/cert.pem",
    "tls_key_file": "/path/to/tls/key.pem",
    "max_connections": 10,
    "min_connections": 5,
    "min_reconnect_delay": "10ms",
    "max_reconnect_delay": "10s"
  }
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific TCP stream handler

The `/tcp-stream-handlers/:tcp-stream-handler` API endpoint provides HTTP GET access to [TCP stream handler data][1] for specific `:tcp-stream-handler` definitions, by handler `name`.

### Example

In the following example, querying the `/tcp-stream-handlers/:tcp-stream-handler` API endpoint returns a JSON map that contains the requested [`:tcp-stream-handler` definition][1] (in this example, for the `:tcp-stream-handler` named `logstash`).

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/pipeline/v1/namespaces/default/tcp-stream-handlers/logstash \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
{
  "type": "TCPStreamHandler",
  "api_version": "pipeline/v1",
  "metadata": {
    "name": "logstash",
    "namespace": "default",
    "created_by": "admin"
  },
  "spec": {
    "address": "127.0.0.1:4242",
    "max_connections": 10,
    "max_reconnect_delay": "10s",
    "min_reconnect_delay": "10ms",
    "tls_ca_cert_file": "/path/to/tls/ca.pem",
    "tls_cert_file": "/path/to/tls/cert.pem",
    "tls_key_file": "/path/to/tls/key.pem"
  }
}
{{< /code >}}

### API Specification

/tcp-stream-handlers/:tcp-stream-handler (GET) | 
---------------------|------
description          | Returns a TCP stream handler.
example url          | http://hostname:8080/api/enterprise/pipeline/v1/namespaces/default/tcp-stream-handlers/logstash
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code json >}}
{
  "type": "TCPStreamHandler",
  "api_version": "pipeline/v1",
  "metadata": {
    "name": "logstash",
    "namespace": "default",
    "created_by": "admin"
  },
  "spec": {
    "address": "127.0.0.1:4242",
    "max_connections": 10,
    "max_reconnect_delay": "10s",
    "min_reconnect_delay": "10ms",
    "tls_ca_cert_file": "/path/to/tls/ca.pem",
    "tls_cert_file": "/path/to/tls/cert.pem",
    "tls_key_file": "/path/to/tls/key.pem"
  }
}
{{< /code >}}

## Create or update a TCP stream handler

The `/tcp-stream-handlers/:tcp-stream-handler` API endpoint provides HTTP PUT access to create or update a specific `:tcp-stream-handler` definition, by handler name.

### Example

In the following example, an HTTP PUT request is submitted to the `/tcp-stream-handlers/:tcp-stream-handler` API endpoint to create the handler `incident_log`.
The request returns a successful HTTP `201 Created` response.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "api_version": "pipeline/v1",
  "type": "TCPStreamHandler",
  "metadata": {
    "name": "incident_log",
    "namespace": "default"
  },
  "spec": {
    "address": "127.0.0.1:4242",
    "max_connections": 10,
    "min_connections": 5,
    "min_reconnect_delay": "10ms",
    "max_reconnect_delay": "10s"
  }
}' \
http://127.0.0.1:8080/api/enterprise/pipeline/v1/namespaces/default/tcp-stream-handlers/incident_log

HTTP/1.1 201 Created
{{< /code >}}

### API Specification

/tcp-stream-handlers/:tcp-stream-handler (PUT) | 
----------------|------
description     | Creates or updates the specified Sensu TCP stream handler.
example URL     | http://hostname:8080/api/enterprise/pipeline/v1/namespaces/default/tcp-stream-handlers/incident_log
payload         | {{< code shell >}}
{
  "api_version": "pipeline/v1",
  "type": "TCPStreamHandler",
  "metadata": {
    "name": "incident_log",
    "namespace": "default"
  },
  "spec": {
    "address": "127.0.0.1:4242",
    "max_connections": 10,
    "min_connections": 5,
    "min_reconnect_delay": "10ms",
    "max_reconnect_delay": "10s"
  }
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a TCP stream handler

The `/tcp-stream-handlers/:tcp-stream-handler` API endpoint provides HTTP DELETE access to delete a TCP stream handler from Sensu (specified by the handler name).

### Example

The following example shows a request to the `/tcp-stream-handlers/:tcp-stream-handler` API endpoint to delete the TCP stream handler `incident_log`, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/enterprise/pipeline/v1/namespaces/default/tcp-stream-handlers/incident_log \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification

/tcp-stream-handlers/:tcp-stream-handler (DELETE) | 
--------------------------|------
description               | Removes the specified TCP stream handler from Sensu.
example url               | http://hostname:8080/api/enterprise/pipeline/v1/namespaces/default/tcp-stream-handlers/incident_log
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../../observability-pipeline/observe-process/tcp-stream-handlers/
[2]: ../#pagination
[3]: ../#response-filtering
[4]: https://tools.ietf.org/html/rfc7396
[5]: ../../observability-pipeline/observe-process/sumo-logic-metrics-handlers/
