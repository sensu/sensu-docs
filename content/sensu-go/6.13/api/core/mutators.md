---
title: "core/v2/mutators"
description: "Read this API documentation for information about Sensu core/v2/mutators API endpoints, with examples for retrieving and managing mutators."
core_api_title: "core/v2/mutators"
type: "core_api"
version: "6.13"
product: "Sensu Go"
menu:
  sensu-go-6.13:
    parent: core
---

{{% notice note %}}
**NOTE**: Requests to `core/v2/mutators` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-auth-api-endpoints).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all mutators

The `/mutators` API endpoint provides HTTP GET access to [mutator][1] data.

### Example {#mutators-get-example}

The following example demonstrates a GET request to the `/mutators` API endpoint:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/mutators \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a JSON array that contains the [mutator definitions][1] in the `default` namespace:

{{< code text >}}
[
  {
    "metadata": {
      "name": "example-mutator",
      "namespace": "default",
      "created_by": "admin",
      "labels": null,
      "annotations": null
    },
    "command": "example_mutator.go",
    "timeout": 0,
    "env_vars": [],
    "runtime_assets": [],
    "secrets": null,
    "type": "pipe"
  }
]
{{< /code >}}

### API Specification {#mutators-get-specification}

/mutators (GET)  | 
---------------|------
description    | Returns the list of mutators.
example url    | http://hostname:8080/api/core/v2/namespaces/default/mutators
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response filtering | This endpoint supports [API response filtering][3].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "metadata": {
      "name": "example-mutator",
      "namespace": "default",
      "created_by": "admin",
      "labels": null,
      "annotations": null
    },
    "command": "example_mutator.go",
    "timeout": 0,
    "env_vars": [],
    "runtime_assets": [],
    "secrets": null,
    "type": "pipe"
  }
]
{{< /code >}}

## Create a new mutator

The `/mutators` API endpoint provides HTTP POST access to create mutators.

### Example {#mutators-post-example}

In the following example, an HTTP POST request is submitted to the `/mutators` API endpoint to create the mutator `example-mutator`:

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "metadata": {
    "name": "example-mutator",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "command": "example_mutator.go",
  "timeout": 0,
  "env_vars": [],
  "runtime_assets": [],
  "secrets": null,
  "type": "pipe"
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/mutators
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

### API Specification {#mutators-post-specification}

/mutators (POST) | 
----------------|------
description     | Creates a Sensu mutator.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/mutators
payload         | {{< code shell >}}
{
  "metadata": {
    "name": "example-mutator",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "command": "example_mutator.go",
  "timeout": 0,
  "env_vars": [],
  "runtime_assets": [],
  "secrets": null,
  "type": "pipe"
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific mutator {#mutatorsmutator-get}

The `/mutators/:mutator` API endpoint provides HTTP GET access to [mutator data][1] for specific `:mutator` definitions, by mutator name.

### Example {#mutatorsmutator-get-example}

The following example queries the `/mutators/:mutator` API endpoint for the `:mutator` named `example-mutator`:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/mutators/example-mutator \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request will return a successful `HTTP/1.1 200 OK` response and a JSON map that contains the requested [`:mutator` definition][1] (in this example, `example-mutator`):

{{< code text >}}
{
  "metadata": {
    "name": "example-mutator",
    "namespace": "default",
    "created_by": "admin",
    "labels": null,
    "annotations": null
  },
  "command": "example_mutator.go",
  "timeout": 0,
  "env_vars": [],
  "runtime_assets": [],
  "secrets": null,
  "type": "pipe"
}
{{< /code >}}

### API Specification {#mutatorsmutator-get-specification}

/mutators/:mutator (GET) | 
---------------------|------
description          | Returns the specified mutator.
example url          | http://hostname:8080/api/core/v2/namespaces/default/mutators/example-mutator
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code text >}}
{
  "metadata": {
    "name": "example-mutator",
    "namespace": "default",
    "created_by": "admin",
    "labels": null,
    "annotations": null
  },
  "command": "example_mutator.go",
  "timeout": 0,
  "env_vars": [],
  "runtime_assets": [],
  "secrets": null,
  "type": "pipe"
}
{{< /code >}}

## Create or update a mutator {#mutatorsmutator-put}

The `/mutators/:mutator` API endpoint provides HTTP PUT access to [mutator data][1] to create or update specific `:mutator` definitions, by mutator name.

### Example {#mutatorsmutator-put-example}

In the following example, an HTTP PUT request is submitted to the `/mutators/:mutator` API endpoint to create the mutator `example-mutator`:

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "metadata": {
    "name": "example-mutator",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "command": "example_mutator.go",
  "timeout": 0,
  "env_vars": [],
  "runtime_assets": [],
  "secrets": null,
  "type": "pipe"
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/mutators/example-mutator
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

### API Specification {#mutatorsmutator-put-specification}

/mutators/:mutator (PUT) | 
----------------|------
description     | Creates or updates a Sensu mutator.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/mutators/example-mutator
payload         | {{< code shell >}}
{
  "metadata": {
    "name": "example-mutator",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "command": "example_mutator.go",
  "timeout": 0,
  "env_vars": [],
  "runtime_assets": [],
  "secrets": null,
  "type": "pipe"
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Update a mutator with PATCH

The `/mutators/:mutator` API endpoint provides HTTP PATCH access to update `:mutator` definitions, specified by mutator name.

{{% notice note %}}
**NOTE**: You cannot change a resource's `name` or `namespace` with a PATCH request.
Use a [PUT request](#mutatorsmutator-put) instead.<br><br>
Also, you cannot add elements to an array with a PATCH request &mdash; you must replace the entire array.
{{% /notice %}}

### Example

In the following example, an HTTP PATCH request is submitted to the `/mutators/:mutator` API endpoint to update the timeout for the `example-mutator` mutator, resulting in an `HTTP/1.1 200 OK` response and the updated mutator definition.

We support [JSON merge patches][4], so you must set the `Content-Type` header to `application/merge-patch+json` for PATCH requests.

{{< code shell >}}
curl -X PATCH \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/merge-patch+json' \
-d '{
  "timeout": 10
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/mutators/example-mutator
{{< /code >}}

### API Specification

/mutators/:mutator (PATCH) | 
----------------|------
description     | Updates the specified Sensu mutator.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/mutators/process-tree
payload         | {{< code shell >}}
{
  "timeout": 10
}
{{< /code >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a mutator {#mutatorsmutator-delete}

The `/mutators/:mutator` API endpoint provides HTTP DELETE access to delete a mutator from Sensu (specified by the mutator name).

### Example {#mutatorsmutator-delete-example}
The following example shows a request to the `/mutators/:mutator` API endpoint to delete the mutator `example-mutator`, resulting in a successful `HTTP/1.1 204 No Content` response.

{{< code shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/core/v2/namespaces/default/mutators/example-mutator \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

### API Specification {#mutatorsmutator-delete-specification}

/mutators/:mutator (DELETE) | 
--------------------------|------
description               | Removes the specified mutator from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/default/mutators/example-mutator
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a subset of mutators with response filtering

The `/mutators` API endpoint supports [response filtering][3] for a subset of mutator data based on labels and the following fields:

- `mutator.name`
- `mutator.namespace`
- `mutator.runtime_assets`

### Example

The following example demonstrates a request to the `/mutators` API endpoint with [response filtering][3] for only [mutator definitions][1] that are in the `production` namespace:

{{< code shell >}}
curl -H "Authorization: Key $SENSU_API_KEY" http://127.0.0.1:8080/api/core/v2/mutators -G \
--data-urlencode 'fieldSelector=mutator.namespace == production'
{{< /code >}}

The example request will result in a successful `HTTP/1.1 200 OK` response and a JSON array that contains only [mutator definitions][1] in the `production` namespace:

{{< code text >}}
[
  {
    "metadata": {
      "name": "add_check_label",
      "namespace": "production",
      "labels": {
        "sensu.io/managed_by": "sensuctl"
      },
      "created_by": "admin"
    },
    "timeout": 0,
    "env_vars": null,
    "runtime_assets": null,
    "secrets": null,
    "type": "javascript",
    "eval": "data = JSON.parse(JSON.stringify(event)); delete data.check.metadata.name; delete data.entity.metadata.labels.app_id; return JSON.stringify(data)"
  },
  {
    "metadata": {
      "name": "example-mutator",
      "namespace": "production",
      "labels": {
        "sensu.io/managed_by": "sensuctl"
      },
      "created_by": "admin"
    },
    "command": "example_mutator.go",
    "timeout": 0,
    "env_vars": null,
    "runtime_assets": [
      "example-mutator-asset"
    ],
    "secrets": null,
    "type": "pipe"
  }
]
{{< /code >}}

{{% notice note %}}
**NOTE**: Read [API response filtering](../../#response-filtering) for more filter statement examples that demonstrate how to filter responses using different operators with label and field selectors.
{{% /notice %}}

### API Specification

/mutators (GET) with response filters | 
---------------|------
description    | Returns the list of mutators that match the [response filters][3] applied in the API request.
example url    | http://hostname:8080/api/core/v2/mutators
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "metadata": {
      "name": "add_check_label",
      "namespace": "production",
      "labels": {
        "sensu.io/managed_by": "sensuctl"
      },
      "created_by": "admin"
    },
    "timeout": 0,
    "env_vars": null,
    "runtime_assets": null,
    "secrets": null,
    "type": "javascript",
    "eval": "data = JSON.parse(JSON.stringify(event)); delete data.check.metadata.name; delete data.entity.metadata.labels.app_id; return JSON.stringify(data)"
  },
  {
    "metadata": {
      "name": "example-mutator",
      "namespace": "production",
      "labels": {
        "sensu.io/managed_by": "sensuctl"
      },
      "created_by": "admin"
    },
    "command": "example_mutator.go",
    "timeout": 0,
    "env_vars": null,
    "runtime_assets": [
      "example-mutator-asset"
    ],
    "secrets": null,
    "type": "pipe"
  }
]
{{< /code >}}


[1]: ../../../observability-pipeline/observe-transform/mutators/
[2]: ../../#pagination
[3]: ../../#response-filtering
[4]: https://tools.ietf.org/html/rfc7396
