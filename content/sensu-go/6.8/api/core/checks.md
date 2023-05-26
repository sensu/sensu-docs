---
title: "core/v2/checks"
description: "Read this API documentation for information about Sensu core/v2/checks API endpoints, with examples for retrieving and managing check definitions."
core_api_title: "core/v2/checks"
type: "core_api"
version: "6.8"
product: "Sensu Go"
menu:
  sensu-go-6.8:
    parent: core
---

{{% notice note %}}
**NOTE**: Requests to `core/v2/checks` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-auth-api-endpoints).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all checks

The `/checks` API endpoint provides HTTP GET access to [check][1] data.

### Example {#checks-get-example}

The following example demonstrates a GET request to the `/checks` API endpoint:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a JSON array that contains the [check definitions][1] in the `default` namespace:

{{< code text >}}
[
  {
    "command": "check-cpu-usage -w 75 -c 90",
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 60,
    "low_flap_threshold": 0,
    "publish": true,
    "runtime_assets": [
      "check-cpu-usage"
    ],
    "subscriptions": [
      "system"
    ],
    "proxy_entity_name": "",
    "check_hooks": null,
    "stdin": false,
    "subdue": null,
    "ttl": 0,
    "timeout": 0,
    "round_robin": false,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "env_vars": null,
    "metadata": {
      "name": "check_cpu",
      "namespace": "default",
      "created_by": "admin"
    },
    "secrets": null,
    "pipelines": [
      {
        "api_version": "core/v2",
        "type": "Pipeline",
        "name": "incident_alerts"
      }
    ]
  },
  {
    "command": "http-perf --url http://localhost --warning 1s --critical 2s",
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 15,
    "low_flap_threshold": 0,
    "publish": true,
    "runtime_assets": [
      "http-checks"
    ],
    "subscriptions": [
      "webserver"
    ],
    "proxy_entity_name": "",
    "check_hooks": null,
    "stdin": false,
    "subdue": null,
    "ttl": 0,
    "timeout": 0,
    "round_robin": false,
    "output_metric_format": "nagios_perfdata",
    "output_metric_handlers": "sensu_to_sumo",
    "env_vars": null,
    "metadata": {
      "name": "collect-metrics",
      "namespace": "default",
      "created_by": "admin"
    },
    "secrets": null,
    "pipelines": []
  },
  {
    "command": "sensu-prometheus-collector -prom-url http://localhost:9090 -prom-query up",
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 10,
    "low_flap_threshold": 0,
    "publish": true,
    "runtime_assets": [
      "sensu-prometheus-collector"
    ],
    "subscriptions": [
      "app_tier"
    ],
    "proxy_entity_name": "",
    "check_hooks": null,
    "stdin": false,
    "subdue": null,
    "ttl": 0,
    "timeout": 0,
    "round_robin": false,
    "output_metric_format": "influxdb_line",
    "output_metric_handlers": null,
    "env_vars": null,
    "metadata": {
      "name": "prometheus_metrics",
      "namespace": "default",
      "labels": {
        "sensu.io/managed_by": "sensuctl"
      },
      "created_by": "admin"
    },
    "secrets": null,
    "pipelines": [
      {
        "name": "prometheus_metrics_workflows",
        "type": "Pipeline",
        "api_version": "core/v2"
      }
    ]
  }
]
{{< /code >}}

### API Specification {#check-get-specification}

/checks (GET)  | 
---------------|------
description    | Returns the list of checks.
example url    | http://hostname:8080/api/core/v2/namespaces/default/checks
pagination     | This endpoint supports [pagination][4] using the `limit` and `continue` query parameters.
response filtering | This endpoint supports [API response filtering][5].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "command": "check-cpu-usage -w 75 -c 90",
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 60,
    "low_flap_threshold": 0,
    "publish": true,
    "runtime_assets": [
      "check-cpu-usage"
    ],
    "subscriptions": [
      "system"
    ],
    "proxy_entity_name": "",
    "check_hooks": null,
    "stdin": false,
    "subdue": null,
    "ttl": 0,
    "timeout": 0,
    "round_robin": false,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "env_vars": null,
    "metadata": {
      "name": "check_cpu",
      "namespace": "default",
      "created_by": "admin"
    },
    "secrets": null,
    "pipelines": [
      {
        "api_version": "core/v2",
        "type": "Pipeline",
        "name": "incident_alerts"
      }
    ]
  },
  {
    "command": "http-perf --url http://localhost --warning 1s --critical 2s",
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 15,
    "low_flap_threshold": 0,
    "publish": true,
    "runtime_assets": [
      "http-checks"
    ],
    "subscriptions": [
      "webserver"
    ],
    "proxy_entity_name": "",
    "check_hooks": null,
    "stdin": false,
    "subdue": null,
    "ttl": 0,
    "timeout": 0,
    "round_robin": false,
    "output_metric_format": "nagios_perfdata",
    "output_metric_handlers": "sensu_to_sumo",
    "env_vars": null,
    "metadata": {
      "name": "collect-metrics",
      "namespace": "default",
      "created_by": "admin"
    },
    "secrets": null,
    "pipelines": []
  },
  {
    "command": "sensu-prometheus-collector -prom-url http://localhost:9090 -prom-query up",
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 10,
    "low_flap_threshold": 0,
    "publish": true,
    "runtime_assets": [
      "sensu-prometheus-collector"
    ],
    "subscriptions": [
      "app_tier"
    ],
    "proxy_entity_name": "",
    "check_hooks": null,
    "stdin": false,
    "subdue": null,
    "ttl": 0,
    "timeout": 0,
    "round_robin": false,
    "output_metric_format": "influxdb_line",
    "output_metric_handlers": null,
    "env_vars": null,
    "metadata": {
      "name": "prometheus_metrics",
      "namespace": "default",
      "labels": {
        "sensu.io/managed_by": "sensuctl"
      },
      "created_by": "admin"
    },
    "secrets": null,
    "pipelines": [
      {
        "name": "prometheus_metrics_workflows",
        "type": "Pipeline",
        "api_version": "core/v2"
      }
    ]
  }
]
{{< /code >}}

## Create a new check

The `/checks` API endpoint provides HTTP POST access to create checks.

### Example {#checks-post-example}

In the following example, an HTTP POST request is submitted to the `/checks` API endpoint to create a `check_cpu` check.
The request includes the check definition in the request body.

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "command": "check-cpu-usage.sh -w 75 -c 90",
  "subscriptions": [
    "system"
  ],
  "interval": 60,
  "publish": true,
  "pipelines": [
    {
      "api_version": "core/v2",
      "type": "Pipeline",
      "name": "incident_alerts"
    }
  ],
  "runtime_assets": [
    "check-cpu-usage"
  ],
  "metadata": {
    "name": "check_cpu",
    "namespace": "default"
  }
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

### API Specification {#checks-post-specification}

/checks (POST) | 
----------------|------
description     | Creates a Sensu check.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/checks
example payload | {{< code shell >}}
{
  "command": "check-cpu-usage.sh -w 75 -c 90",
  "subscriptions": [
    "system"
  ],
  "interval": 60,
  "publish": true,
  "pipelines": [
    {
      "api_version": "core/v2",
      "type": "Pipeline",
      "name": "incident_alerts"
    }
  ],
  "runtime_assets": [
    "check-cpu-usage"
  ],
  "metadata": {
    "name": "check_cpu",
    "namespace": "default"
  }
}
{{< /code >}}
payload parameters | Required check attributes: `interval` (integer) or `cron` (string) and a `metadata` scope that contains `name` (string) and `namespace` (string). For more information about creating checks, read the [checks reference][1]. 
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific check {#checkscheck-get}

The `/checks/:check` API endpoint provides HTTP GET access to `:check` definitions, specified by check name.

### Example {#checkscheck-get-example}

The following example queries the `/checks/:check` API endpoint for the `:check` named `check_cpu`:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check_cpu \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request will return a successful `HTTP/1.1 200 OK` response and a JSON map that contains the requested [`:check` definition][1] (in this example, `check_cpu`):

{{< code shell >}}
{
  "command": "check-cpu-usage.sh -w 75 -c 90",
  "handlers": [],
  "high_flap_threshold": 0,
  "interval": 60,
  "low_flap_threshold": 0,
  "publish": true,
  "runtime_assets": [
    "check-cpu-usage"
  ],
  "subscriptions": [
    "system"
  ],
  "proxy_entity_name": "",
  "check_hooks": null,
  "stdin": false,
  "subdue": null,
  "ttl": 0,
  "timeout": 0,
  "round_robin": false,
  "output_metric_format": "",
  "output_metric_handlers": null,
  "env_vars": null,
  "metadata": {
    "name": "check_cpu",
    "namespace": "default",
    "created_by": "admin"
  },
  "secrets": null,
  "pipelines": [
    {
      "name": "incident_alerts",
      "type": "Pipeline",
      "api_version": "core/v2"
    }
  ]
}
{{< /code >}}

### API Specification {#checkscheck-get-specification}

/checks/:check (GET) | 
---------------------|------
description          | Returns the specified check.
example url          | http://hostname:8080/api/core/v2/namespaces/default/checks/check_cpu
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code text >}}
{
  "command": "check-cpu-usage.sh -w 75 -c 90",
  "handlers": [],
  "high_flap_threshold": 0,
  "interval": 60,
  "low_flap_threshold": 0,
  "publish": true,
  "runtime_assets": [
    "check-cpu-usage"
  ],
  "subscriptions": [
    "system"
  ],
  "proxy_entity_name": "",
  "check_hooks": null,
  "stdin": false,
  "subdue": null,
  "ttl": 0,
  "timeout": 0,
  "round_robin": false,
  "output_metric_format": "",
  "output_metric_handlers": null,
  "env_vars": null,
  "metadata": {
    "name": "check_cpu",
    "namespace": "default",
    "created_by": "admin"
  },
  "secrets": null,
  "pipelines": [
    {
      "name": "incident_alerts",
      "type": "Pipeline",
      "api_version": "core/v2"
    }
  ]
}
{{< /code >}}

## Create or update a check {#checkscheck-put}

The `/checks/:check` API endpoint provides HTTP PUT access to create and update `:check` definitions, specified by check name.

### Example {#checkscheck-put-example}

In the following example, an HTTP PUT request is submitted to the `/checks/:check` API endpoint to update the `check_cpu` check:

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "command": "check-cpu-usage.sh -w 75 -c 90",
  "pipelines": [
    {
      "api_version": "core/v2",
      "type": "Pipeline",
      "name": "incident_alerts"
    }
  ],
  "interval": 60,
  "publish": true,
  "subscriptions": [
    "system"
  ],
  "metadata": {
    "name": "check_cpu",
    "namespace": "default"
  }
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check_cpu
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

### API Specification {#checkscheck-put-specification}

/checks/:check (PUT) | 
----------------|------
description     | Creates or updates the specified Sensu check.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/checks/check_cpu
payload         | {{< code shell >}}
{
  "command": "check-cpu-usage.sh -w 75 -c 90",
  "pipelines": [
    {
      "api_version": "core/v2",
      "type": "Pipeline",
      "name": "incident_alerts"
    }
  ],
  "interval": 60,
  "publish": true,
  "subscriptions": [
    "system"
  ],
  "metadata": {
    "name": "check_cpu",
    "namespace": "default"
  }
}
{{< /code >}}
payload parameters | Required check attributes: `interval` (integer) or `cron` (string) and a `metadata` scope that contains `name` (string) and `namespace` (string). For more information about creating checks, read the [checks reference][1].
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Update a check with PATCH

The `/checks/:check` API endpoint provides HTTP PATCH access to update `:check` definitions, specified by check name.

{{% notice note %}}
**NOTE**: You cannot change a resource's `name` or `namespace` with a PATCH request.
Use a [PUT request](#checkscheck-put) instead.<br><br>
Also, you cannot add elements to an array with a PATCH request &mdash; you must replace the entire array.
{{% /notice %}}

### Example

In the following example, an HTTP PATCH request is submitted to the `/checks/:check` API endpoint to update the subscriptions array for the `check_cpu` check, resulting in a `HTTP/1.1 200 OK` response and the updated check definition.

We support [JSON merge patches][6], so you must set the `Content-Type` header to `application/merge-patch+json` for PATCH requests.

{{< code shell >}}
curl -X PATCH \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/merge-patch+json' \
-d '{
  "subscriptions": [
    "system",
    "health"
  ]
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check_cpu
{{< /code >}}

### API Specification

/checks/:check (PATCH) | 
----------------|------
description     | Updates the specified Sensu check.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/checks/check_cpu
payload         | {{< code shell >}}
{
  "subscriptions": [
    "system",
    "health"
  ]
}
{{< /code >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a check {#checkscheck-delete}

The `/checks/:check` API endpoint provides HTTP DELETE access to delete a check from Sensu, specified by the check name.

### Example {#checkscheck-delete-example}

The following example shows a request to the `/checks/:check` API endpoint to delete the check named `check_cpu`, which will result in a successful `HTTP/1.1 204 No Content` response:

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check_cpu
{{< /code >}}

### API Specification {#checkscheck-delete-specification}

/checks/:check (DELETE) | 
--------------------------|------
description               | Removes the specified check from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/default/checks/check_cpu
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Create an ad hoc check execution request {#checkscheckexecute-post}

The `/checks/:check/execute` API endpoint provides HTTP POST access to create an ad hoc check execution request so you can execute a check on demand.

### Example {#checkscheckexecute-post-example}

In the following example, an HTTP POST request is submitted to the `/checks/:check/execute` API endpoint to execute the `check_cpu` check.
The request includes the check name in the request body.

{{% notice protip %}}
**PRO TIP**: Include the `subscriptions` attribute with the request body to override the subscriptions configured in the check definition.
This gives you the flexibility to execute a check on any Sensu entity or group of entities on demand.
{{% /notice %}}

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "check": "check_cpu",
  "subscriptions": [
    "entity:i-424242"
  ]
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check_cpu/execute
{{< /code >}}

The request will return a successful `HTTP/1.1 202 Accepted` response and an `issued` timestamp:

{{< code text >}}
{"issued":1543861798}
{{< /code >}}

{{% notice note %}}
**NOTE**: If you specify a [round robin check](../../../observability-pipeline/observe-schedule/checks/#round-robin-checks), Sensu will execute the check on *all* agents with a matching subscription.
After the ad hoc execution, the check will run as scheduled in round robin fashion.<br><br>
To execute a round robin check on a single agent, include the agent's entity name subscription in the request body.
For example, if the entity is named `webserver1`, use the subscription `entity:webserver1`.
{{% /notice %}}

### API Specification {#checkscheckexecute-post-specification}

/checks/:check/execute (POST) | 
----------------|------
description     | Creates an ad hoc request to execute the specified check.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/checks/check_cpu/execute
payload         | {{< code shell >}}
{
  "check": "check_cpu",
  "subscriptions": [
    "entity:i-424242"
  ]
}
{{< /code >}}
payload parameters | <ul><li>Required: `check` (the name of the check to execute).</li><li>Optional: `subscriptions` (an array of subscriptions to publish the check request to). When provided with the request, the `subscriptions` attribute overrides any subscriptions configured in the check definition.</li>
response codes  | <ul><li>**Success**: 202 (Accepted)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Assign a hook to a check {#checkscheckhooks-put}

The `/checks/:check/hooks/:type` API endpoint provides HTTP PUT access to assign a [hook][2] to a check.

### Example {#checkscheckhooks-put-example}

In the following example, an HTTP PUT request is submitted to the `/checks/:check/hooks/:type` API endpoint, assigning the `process_tree` hook to the `check_cpu` check in the event of a `critical` type check result:

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "critical": [
    "process_tree"
  ]
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check_cpu/hooks/critical
{{< /code >}}

The request returns a successful `HTTP/1.1 201 Created` response.

### API Specification {#checkscheckhooks-put-specification}

checks/:check/hooks/:type (PUT) | 
----------------|------
description     | Assigns a hook to a check (specified by the check name and [check response type][3]).
example URL     | http://hostname:8080/api/core/v2/namespaces/default/checks/check_cpu/hooks/critical
example payload | {{< code shell >}}
{
  "critical": [
    "process_tree"
  ]
}
{{< /code >}}
payload parameters | This endpoint requires a JSON map of [check response types][3] (for example, `critical` or `warning`). Each must contain an array of hook names.
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Remove a hook from a check {#checkscheckhookshook-delete}

The `/checks/:check/hooks/:type/hook/:hook` API endpoint provides HTTP DELETE access to a remove a [hook][2] from a [check][1].

### Example {#checkscheckhookshook-delete-example}

The following example shows a request to the `/checks/:check/hooks/:type/hook/:hook` API endpoint to remove the `process_tree` hook from the `check_cpu` check, resulting in a successful `HTTP/1.1 204 No Content` response:

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check_cpu/hooks/critical/hook/process_tree 
{{< /code >}}

### API Specification {#checkscheckhookshook-delete-specification}

/checks/:check/hooks/:type/hook/:hook (DELETE) | 
--------------------------|------
description               | Removes a single hook from a check (specified by the check name, check response type, and hook name). Read the [checks reference][3] for available types.
example url               | http://hostname:8080/api/core/v2/namespaces/default/checks/check_cpu/hooks/critical/hook/process_tree
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a subset of checks with response filtering

The `/checks` API endpoint supports [response filtering][5] for a subset of check data based on labels and the following fields:

- `check.name`
- `check.namespace`
- `check.handlers`
- `check.publish`
- `check.round_robin`
- `check.runtime_assets`
- `check.subscriptions`

### Example

The following example demonstrates a request to the `/checks` API endpoint with [response filtering][5] for only [check definitions][1] whose subscriptions include `system`:

{{< code shell >}}
curl -H "Authorization: Key $SENSU_API_KEY" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'fieldSelector="system" in check.subscriptions'
{{< /code >}}

The example request will result in a successful `HTTP/1.1 200 OK` response and a JSON array that contains only [check definitions][1] whose subscriptions include `system`:

{{< code text >}}
[
  {
    "command": "check-cpu-usage.sh -w 75 -c 90",
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 60,
    "low_flap_threshold": 0,
    "publish": true,
    "runtime_assets": [
      "check-cpu-usage"
    ],
    "subscriptions": [
      "system",
      "health"
    ],
    "proxy_entity_name": "",
    "check_hooks": [
      {
        "critical": [
          "process_tree"
        ]
      }
    ],
    "stdin": false,
    "subdue": null,
    "ttl": 0,
    "timeout": 0,
    "round_robin": false,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "env_vars": null,
    "metadata": {
      "name": "check_cpu",
      "namespace": "default",
      "created_by": "admin"
    },
    "secrets": null,
    "pipelines": [
      {
        "name": "incident_alerts",
        "type": "Pipeline",
        "api_version": "core/v2"
      }
    ]
  }
]
{{< /code >}}

{{% notice note %}}
**NOTE**: Read [API response filtering](../../#response-filtering) for more filter statement examples that demonstrate how to filter responses using different operators with label and field selectors.
{{% /notice %}}

### API Specification

/checks (GET) with response filters | 
---------------|------
description    | Returns the list of checks that match the [response filters][5] applied in the API request.
example url    | http://hostname:8080/api/core/v2/checks
pagination     | This endpoint supports [pagination][4] using the `limit` and `continue` query parameters.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "command": "check-cpu-usage.sh -w 75 -c 90",
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 60,
    "low_flap_threshold": 0,
    "publish": true,
    "runtime_assets": [
      "check-cpu-usage"
    ],
    "subscriptions": [
      "system",
      "health"
    ],
    "proxy_entity_name": "",
    "check_hooks": [
      {
        "critical": [
          "process_tree"
        ]
      }
    ],
    "stdin": false,
    "subdue": null,
    "ttl": 0,
    "timeout": 0,
    "round_robin": false,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "env_vars": null,
    "metadata": {
      "name": "check_cpu",
      "namespace": "default",
      "created_by": "admin"
    },
    "secrets": null,
    "pipelines": [
      {
        "name": "incident_alerts",
        "type": "Pipeline",
        "api_version": "core/v2"
      }
    ]
  }
]
{{< /code >}}


[1]: ../../../observability-pipeline/observe-schedule/checks/
[2]: ../../../observability-pipeline/observe-schedule/hooks/
[3]: ../../../observability-pipeline/observe-schedule/checks#check-hooks-attribute
[4]: ../../#pagination
[5]: ../../#response-filtering
[6]: https://tools.ietf.org/html/rfc7396
