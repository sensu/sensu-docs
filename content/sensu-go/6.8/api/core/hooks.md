---
title: "core/v2/hooks"
description: "Read this API documentation for information about Sensu core/v2/hooks API endpoints, with examples for retrieving and managing hooks."
core_api_title: "core/v2/hooks"
type: "core_api"
version: "6.8"
product: "Sensu Go"
menu:
  sensu-go-6.8:
    parent: core
---

{{% notice note %}}
**NOTE**: Requests to `core/v2/hooks` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-auth-api-endpoints).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all hooks

The `/hooks` API endpoint provides HTTP GET access to [hook][1] data.

### Example {#hooks-get-example}

The following example demonstrates a GET request to the `/hooks` API endpoint:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/hooks \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a JSON array that contains the [hook definitions][1] in the `default` namespace:

{{< code text >}}
[
  {
    "metadata": {
      "name": "nginx-log",
      "namespace": "default",
      "created_by": "admin"
    },
    "command": "tail -n 100 /var/log/nginx/error.log",
    "timeout": 10,
    "stdin": false,
    "runtime_assets": null
  },
  {
    "metadata": {
      "name": "process-tree",
      "namespace": "default",
      "created_by": "admin"
    },
    "command": "ps -eo user,pid,cmd:50,%cpu --sort=-%cpu | head -n 6",
    "timeout": 10,
    "stdin": false,
    "runtime_assets": null
  }
]
{{< /code >}}

### API Specification {#hooks-get-specification}

/hooks (GET)  | 
---------------|------
description    | Returns the list of hooks.
example url    | http://hostname:8080/api/core/v2/namespaces/default/hooks
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response filtering | This endpoint supports [API response filtering][3].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "metadata": {
      "name": "nginx-log",
      "namespace": "default",
      "created_by": "admin"
    },
    "command": "tail -n 100 /var/log/nginx/error.log",
    "timeout": 10,
    "stdin": false,
    "runtime_assets": null
  },
  {
    "metadata": {
      "name": "process-tree",
      "namespace": "default",
      "created_by": "admin"
    },
    "command": "ps -eo user,pid,cmd:50,%cpu --sort=-%cpu | head -n 6",
    "timeout": 10,
    "stdin": false,
    "runtime_assets": null
  }
]
{{< /code >}}

## Create a new hook

The `/hooks` API endpoint provides HTTP POST access to create a hook.

### Example {#hooks-post-example}

In the following example, an HTTP POST request is submitted to the `/hooks` API endpoint to create the hook `process-tree`:

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "metadata": {
    "name": "process-tree",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "command": "ps -eo user,pid,cmd:50,%cpu --sort=-%cpu | head -n 6",
  "timeout": 10,
  "stdin": false
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/hooks
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

### API Specification {#hooks-post-specification}

/hooks (POST) | 
----------------|------
description     | Creates a Sensu hook.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/hooks
payload         | {{< code shell >}}
{
  "metadata": {
    "name": "process-tree",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "command": "ps aux",
  "timeout": 10,
  "stdin": false
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific hook {#hookshook-get}

The `/hooks/:hook` API endpoint provides HTTP GET access to [hook data][1] for specific `:hook` definitions, by hook name.

### Example {#hookshook-get-example}

The following example queries the `/hooks/:hook` API endpoint for the `:hook` named `process-tree`:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/hooks/process-tree \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request will return a successful `HTTP/1.1 200 OK` response and a JSON map that contains the requested [`:hook` definition][1] (in this example, `process-tree`):

{{< code text >}}
{
  "metadata": {
    "name": "process-tree",
    "namespace": "default",
    "created_by": "admin",
    "labels": null,
    "annotations": null
  },
  "command": "ps aux",
  "timeout": 10,
  "stdin": false
}
{{< /code >}}

### API Specification {#hookshook-get-specification}

/hooks/:hook (GET) | 
---------------------|------
description          | Returns the specified hook.
example url          | http://hostname:8080/api/core/v2/namespaces/default/hooks/process-tree
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code text >}}
{
  "metadata": {
    "name": "process-tree",
    "namespace": "default",
    "created_by": "admin",
    "labels": null,
    "annotations": null
  },
  "command": "ps aux",
  "timeout": 10,
  "stdin": false
}
{{< /code >}}

## Create or update a hook {#hookshook-put}

The `/hooks/:hook` API endpoint provides HTTP PUT access to create or update specific `:hook` definitions, by hook name.

### Example {#hooks-put-example}

In the following example, an HTTP PUT request is submitted to the `/hooks/:hook` API endpoint to create the hook `nginx-log`:

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "metadata": {
    "name": "nginx-log",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "command": "tail -n 100 /var/log/nginx/error.log",
  "timeout": 10,
  "stdin": false
  }' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/hooks/nginx-log
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

### API Specification {#hookshook-put-specification}

/hooks/:hook (PUT) | 
----------------|------
description     | Creates or updates the specified Sensu hook.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/hooks/nginx-log
payload         | {{< code shell >}}
{
  "metadata": {
    "name": "nginx-log",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "command": "tail -n 100 /var/log/nginx/error.log",
  "timeout": 10,
  "stdin": false
  }
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Update a hook with PATCH

The `/hooks/:hook` API endpoint provides HTTP PATCH access to update `:hook` definitions, specified by hook name.

{{% notice note %}}
**NOTE**: You cannot change a resource's `name` or `namespace` with a PATCH request.
Use a [PUT request](#hookshook-put) instead.<br><br>
Also, you cannot add elements to an array with a PATCH request &mdash; you must replace the entire array.
{{% /notice %}}

### Example

In the following example, an HTTP PATCH request is submitted to the `/hooks/:hook` API endpoint to update the timeout for the `process-tree` hook, resulting in an `HTTP/1.1 200 OK` response and the updated hook definition.

We support [JSON merge patches][4], so you must set the `Content-Type` header to `application/merge-patch+json` for PATCH requests.

{{< code shell >}}
curl -X PATCH \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/merge-patch+json' \
-d '{
  "timeout": 20
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/hook/process-tree
{{< /code >}}

### API Specification

/hooks/:hook (PATCH) | 
----------------|------
description     | Updates the specified Sensu hook.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/hooks/process-tree
payload         | {{< code shell >}}
{
  "timeout": 20
}
{{< /code >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a hook {#hookshook-delete}

The `/hooks/:hook` API endpoint provides HTTP DELETE access to delete a check hook from Sensu (specified by the hook name).

### Example {#hookshook-delete-example}

The following example shows a request to the `/hooks/:hook` API endpoint to delete the hook `process-tree`, resulting in a successful `HTTP/1.1 204 No Content` response:

{{< code shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/core/v2/namespaces/default/hooks/process-tree \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

### API Specification {#hookshook-delete-specification}

/hooks/:hook (DELETE) | 
--------------------------|------
description               | Removes the specified hook from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/default/hooks/process-tree
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a subset of hooks with response filtering

The `/hooks` API endpoint supports [response filtering][3] for a subset of hook data based on labels and the following fields:

- `hook.name`
- `hook.namespace`

### Example

The following example demonstrates a request to the `/hooks` API endpoint with [response filtering][3] for only [hook definitions][1] in the `production` namespace:

{{< code shell >}}
curl -H "Authorization: Key $SENSU_API_KEY" http://127.0.0.1:8080/api/core/v2/hooks -G \
--data-urlencode 'fieldSelector=hook.namespace == production'
{{< /code >}}

The example request will result in a successful `HTTP/1.1 200 OK` response and a JSON array that contains only [hook definitions][1] in the `production` namespace:

{{< code text >}}
[
  {
    "metadata": {
      "name": "process_tree",
      "namespace": "production",
      "created_by": "admin"
    },
    "command": "ps aux",
    "timeout": 10,
    "stdin": false,
    "runtime_assets": null
  },
  {
    "metadata": {
      "name": "restart_nginx",
      "namespace": "production",
      "labels": {
        "sensu.io/managed_by": "sensuctl"
      },
      "created_by": "admin"
    },
    "command": "sudo systemctl start nginx",
    "timeout": 60,
    "stdin": false,
    "runtime_assets": null
  }
]
{{< /code >}}

{{% notice note %}}
**NOTE**: Read [API response filtering](../../#response-filtering) for more filter statement examples that demonstrate how to filter responses using different operators with label and field selectors.
{{% /notice %}}

### API Specification

/hooks (GET) with response filters | 
---------------|------
description    | Returns the list of hooks that match the [response filters][3] applied in the API request.
example url    | http://hostname:8080/api/core/v2/hooks
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "metadata": {
      "name": "process_tree",
      "namespace": "production",
      "created_by": "admin"
    },
    "command": "ps aux",
    "timeout": 10,
    "stdin": false,
    "runtime_assets": null
  },
  {
    "metadata": {
      "name": "restart_nginx",
      "namespace": "production",
      "labels": {
        "sensu.io/managed_by": "sensuctl"
      },
      "created_by": "admin"
    },
    "command": "sudo systemctl start nginx",
    "timeout": 60,
    "stdin": false,
    "runtime_assets": null
  }
]
{{< /code >}}


[1]: ../../../observability-pipeline/observe-schedule/hooks/
[2]: ../../#pagination
[3]: ../../#response-filtering
[4]: https://tools.ietf.org/html/rfc7396
