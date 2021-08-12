---
title: "Checks API"
description: "The Sensu checks API provides HTTP access to check data. This reference includes examples for returning the list of checks, creating a Sensu check, and more. Read on for the full reference."
api_title: "Checks API"
type: "api"
version: "6.3"
product: "Sensu Go"
menu:
  sensu-go-6.3:
    parent: api
---

{{% notice note %}}
**NOTE**: Requests to the checks API require you to authenticate with a Sensu [API key](../#configure-an-environment-variable-for-api-key-authentication) or [access token](../#authenticate-with-the-authentication-api).
The code examples in this document use the [environment variable](../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all checks

The `/checks` API endpoint provides HTTP GET access to [check][1] data.

### Example {#checks-get-example}

The following example demonstrates a request to the `/checks` API endpoint, resulting in a JSON array that contains [check definitions][1].

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
[
  {
    "command": "check-email.sh -w 75 -c 90",
    "handlers": [
      "slack"
    ],
    "high_flap_threshold": 0,
    "interval": 60,
    "low_flap_threshold": 0,
    "publish": true,
    "runtime_assets": null,
    "subscriptions": [
      "linux"
    ],
    "proxy_entity_name": "",
    "check_hooks": null,
    "stdin": false,
    "subdue": null,
    "ttl": 0,
    "timeout": 0,
    "round_robin": false,
    "scheduler": "postgres",
    "output_metric_format": "",
    "output_metric_handlers": null,
    "output_metric_tags": null,
    "env_vars": null,
    "metadata": {
      "name": "check-email",
      "namespace": "default",
      "created_by": "admin"
    }
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
output         | {{< code shell >}}
[
  {
    "command": "check-email.sh -w 75 -c 90",
    "handlers": [
      "slack"
    ],
    "high_flap_threshold": 0,
    "interval": 60,
    "low_flap_threshold": 0,
    "publish": true,
    "runtime_assets": null,
    "subscriptions": [
      "linux"
    ],
    "proxy_entity_name": "",
    "check_hooks": null,
    "stdin": false,
    "subdue": null,
    "ttl": 0,
    "timeout": 0,
    "round_robin": false,
    "scheduler": "postgres",
    "output_metric_format": "",
    "output_metric_handlers": null,
    "output_metric_tags": null,
    "env_vars": null,
    "metadata": {
      "name": "check-email",
      "namespace": "default",
      "created_by": "admin"
    }
  }
]
{{< /code >}}

## Create a new check

The `/checks` API endpoint provides HTTP POST access to create checks.

### Example {#checks-post-example}

In the following example, an HTTP POST request is submitted to the `/checks` API endpoint to create a `check-cpu` check.
The request includes the check definition in the request body and returns a successful HTTP `200 OK` response and the created check definition.

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "command": "check-cpu.sh -w 75 -c 90",
  "subscriptions": [
    "linux"
  ],
  "interval": 60,
  "publish": true,
  "handlers": [
    "slack"
  ],
  "metadata": {
    "name": "check-cpu",
    "namespace": "default"
  }
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#checks-post-specification}

/checks (POST) | 
----------------|------
description     | Creates a Sensu check.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/checks
example payload | {{< code shell >}}
{
  "command": "check-cpu.sh -w 75 -c 90",
  "subscriptions": [
    "linux"
  ],
  "interval": 60,
  "publish": true,
  "handlers": [
    "slack"
  ],
  "metadata": {
    "name": "check-cpu",
    "namespace": "default"
  }
}
{{< /code >}}
payload parameters | Required check attributes: `interval` (integer) or `cron` (string) and a `metadata` scope that contains `name` (string) and `namespace` (string). For more information about creating checks, see the [check reference][1]. 
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific check {#checkscheck-get}

The `/checks/:check` API endpoint provides HTTP GET access to [check data][1] for `:check` definitions, specified by check name.

### Example {#checkscheck-get-example}

In the following example, querying the `/checks/:check` API endpoint returns a JSON map that contains the requested [`:check` definition][1] (in this example, for the `:check` named `check-cpu`).

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check-cpu \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
{
  "command": "check-cpu.sh -w 75 -c 90",
  "handlers": [
    "slack"
  ],
  "high_flap_threshold": 0,
  "interval": 60,
  "low_flap_threshold": 0,
  "publish": true,
  "runtime_assets": null,
  "subscriptions": [
    "linux"
  ],
  "proxy_entity_name": "",
  "check_hooks": null,
  "stdin": false,
  "subdue": null,
  "ttl": 0,
  "timeout": 0,
  "round_robin": false,
  "scheduler": "postgres",
  "output_metric_format": "",
  "output_metric_handlers": null,
  "output_metric_tags": null,
  "env_vars": null,
  "metadata": {
    "name": "check-cpu",
    "namespace": "default",
    "created_by": "admin"
  }
}
{{< /code >}}

### API Specification {#checkscheck-get-specification}

/checks/:check (GET) | 
---------------------|------
description          | Returns the specified check.
example url          | http://hostname:8080/api/core/v2/namespaces/default/checks/check-cpu
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code json >}}
{
  "command": "check-cpu.sh -w 75 -c 90",
  "handlers": [
    "slack"
  ],
  "high_flap_threshold": 0,
  "interval": 60,
  "low_flap_threshold": 0,
  "publish": true,
  "runtime_assets": null,
  "subscriptions": [
    "linux"
  ],
  "proxy_entity_name": "",
  "check_hooks": null,
  "stdin": false,
  "subdue": null,
  "ttl": 0,
  "timeout": 0,
  "round_robin": false,
  "scheduler": "postgres",
  "output_metric_format": "",
  "output_metric_handlers": null,
  "output_metric_tags": null,
  "env_vars": null,
  "metadata": {
    "name": "check-cpu",
    "namespace": "default",
    "created_by": "admin"
  }
}
{{< /code >}}

## Create or update a check {#checkscheck-put}

The `/checks/:check` API endpoint provides HTTP PUT access to create and update `:check` definitions, specified by check name.

### Example {#checkscheck-put-example}

In the following example, an HTTP PUT request is submitted to the `/checks/:check` API endpoint to update the `check-cpu` check, resulting in an HTTP `200 OK` response and the updated check definition.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "command": "check-cpu.sh -w 75 -c 90",
  "handlers": [
    "slack"
  ],
  "interval": 60,
  "publish": true,
  "subscriptions": [
    "linux"
  ],
  "metadata": {
    "name": "check-cpu",
    "namespace": "default"
  }
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check-cpu

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#checkscheck-put-specification}

/checks/:check (PUT) | 
----------------|------
description     | Creates or updates the specified Sensu check.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/checks/check-cpu
payload         | {{< code shell >}}
{
  "command": "check-cpu.sh -w 75 -c 90",
  "handlers": [
    "slack"
  ],
  "interval": 60,
  "publish": true,
  "subscriptions": [
    "linux"
  ],
  "metadata": {
    "name": "check-cpu",
    "namespace": "default"
  }
}
{{< /code >}}
payload parameters | Required check attributes: `interval` (integer) or `cron` (string) and a `metadata` scope that contains `name` (string) and `namespace` (string). For more information about creating checks, see the [check reference][1].
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Update a check with PATCH

The `/checks/:check` API endpoint provides HTTP PATCH access to update `:check` definitions, specified by check name.

{{% notice note %}}
**NOTE**: You cannot change a resource's `name` or `namespace` with a PATCH request.
Use a [PUT request](#checkscheck-put) instead.<br><br>
Also, you cannot add elements to an array with a PATCH request &mdash; you must replace the entire array.
{{% /notice %}}

### Example

In the following example, an HTTP PATCH request is submitted to the `/checks/:check` API endpoint to update the subscriptions array for the `check-cpu` check, resulting in an HTTP `200 OK` response and the updated check definition.

We support [JSON merge patches][6], so you must set the `Content-Type` header to `application/merge-patch+json` for PATCH requests.

{{< code shell >}}
curl -X PATCH \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/merge-patch+json' \
-d '{
  "subscriptions": [
    "linux",
    "health"
  ]
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check-cpu

HTTP/1.1 200 OK
{{< /code >}}

### API Specification

/checks/:check (PATCH) | 
----------------|------
description     | Updates the specified Sensu check.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/checks/check-cpu
payload         | {{< code shell >}}
{
  "subscriptions": [
    "linux",
    "health"
  ]
}
{{< /code >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a check {#checkscheck-delete}

The `/checks/:check` API endpoint provides HTTP DELETE access to delete a check from Sensu, specified by the check name.

### Example {#checkscheck-delete-example}

The following example shows a request to the `/checks/:check` API endpoint to delete the check named `check-cpu`, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check-cpu

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification {#checkscheck-delete-specification}

/checks/:check (DELETE) | 
--------------------------|------
description               | Removes the specified check from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/default/checks/check-cpu
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Create an ad hoc check execution request {#checkscheckexecute-post}

The `/checks/:check/execute` API endpoint provides HTTP POST access to create an ad hoc check execution request so you can execute a check on demand.

### Example {#checkscheckexecute-post-example}

In the following example, an HTTP POST request is submitted to the `/checks/:check/execute` API endpoint to execute the `check-cpu` check.
The request includes the check name in the request body and returns a successful HTTP `202 Accepted` response and an `issued` timestamp.

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "check": "check-cpu",
  "subscriptions": [
    "entity:i-424242"
  ]
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check-cpu/execute

HTTP/1.1 202 Accepted
{"issued":1543861798}
{{< /code >}}

{{% notice protip %}}
**PRO TIP**: Include the `subscriptions` attribute with the request body to override the subscriptions configured in the check definition.
This gives you the flexibility to execute a check on any Sensu entity or group of entities on demand.
{{% /notice %}}

### API Specification {#checkscheckexecute-post-specification}

/checks/:check/execute (POST) | 
----------------|------
description     | Creates an ad hoc request to execute the specified check.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/checks/check-cpu/execute
payload         | {{< code shell >}}
{
  "check": "check-cpu",
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

In the following example, an HTTP PUT request is submitted to the `/checks/:check/hooks/:type` API endpoint, assigning the `process_tree` hook to the `check-cpu` check in the event of a `critical` type check result, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "critical": [
    "process_tree"
  ]
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check-cpu/hooks/critical

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#checkscheckhooks-put-specification}

checks/:check/hooks/:type (PUT) | 
----------------|------
description     | Assigns a hook to a check (specified by the check name and [check response type][3]).
example URL     | http://hostname:8080/api/core/v2/namespaces/default/checks/check-cpu/hooks/critical
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

The following example shows a request to the `/checks/:check/hooks/:type/hook/:hook` API endpoint to remove the `process_tree` hook from the `check-cpu` check, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check-cpu/hooks/critical/hook/process_tree 

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification {#checkscheckhookshook-delete-specification}

/checks/:check/hooks/:type/hook/:hook (DELETE) | 
--------------------------|------
description               | Removes a single hook from a check (specified by the check name, check response type, and hook name). See the [checks reference][3] for available types.
example url               | http://hostname:8080/api/core/v2/namespaces/default/checks/check-cpu/hooks/critical/hook/process_tree
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../../observability-pipeline/observe-schedule/checks/
[2]: ../../observability-pipeline/observe-schedule/hooks/
[3]: ../../observability-pipeline/observe-schedule/checks#check-hooks-attribute
[4]: ../#pagination
[5]: ../#response-filtering
[6]: https://tools.ietf.org/html/rfc7396
