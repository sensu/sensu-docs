---
title: "Mutators API"
description: "The Sensu mutator API provides HTTP access to mutator data. This reference includes examples for returning lists of mutators, creating a Sensu mutator, and more. Read on for the full reference."
version: "5.20"
product: "Sensu Go"
menu:
  sensu-go-5.20:
    parent: api
---

{{% notice note %}}
**NOTE**: Requests to the mutators API require you to authenticate with a Sensu [access token](../#authenticate-with-the-authentication-api) or [API key](../#authenticate-with-an-api-key).
The code examples in this document use the [environment variable](../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests. 
{{% /notice %}}

## Get all mutators

The `/mutators` API endpoint provides HTTP GET access to [mutator][1] data.

### Example {#mutators-get-example}

The following example demonstrates a request to the `/mutators` API endpoint, resulting in a JSON array that contains [mutator definitions][1].

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/mutators \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
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
    "runtime_assets": []
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
output         | {{< code shell >}}
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
    "runtime_assets": []
  }
]
{{< /code >}}

## Create a new mutator

The `/mutators` API endpoint provides HTTP POST access to create mutators.

### Example {#mutators-post-example}

In the following example, an HTTP POST request is submitted to the `/mutators` API endpoint to create the mutator `example-mutator`.
The request returns a successful HTTP `201 Created` response.

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
  "runtime_assets": []
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/mutators

HTTP/1.1 201 Created
{{< /code >}}

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
  "runtime_assets": []
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific mutator {#mutatorsmutator-get}

The `/mutators/:mutator` API endpoint provides HTTP GET access to [mutator data][1] for specific `:mutator` definitions, by mutator name.

### Example {#mutatorsmutator-get-example}

In the following example, querying the `/mutators/:mutator` API endpoint returns a JSON map that contains the requested [`:mutator` definition][1] (in this example, for the `:mutator` named `example-mutator`).

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/mutators/example-mutator \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
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
  "runtime_assets": []
}
{{< /code >}}

### API Specification {#mutatorsmutator-get-specification}

/mutators/:mutator (GET) | 
---------------------|------
description          | Returns the specified mutator.
example url          | http://hostname:8080/api/core/v2/namespaces/default/mutators/mutator-name
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code json >}}
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
  "runtime_assets": []
}
{{< /code >}}

## Create or update a mutator {#mutatorsmutator-put}

The `/mutators/:mutator` API endpoint provides HTTP PUT access to [mutator data][1] to create or update specific `:mutator` definitions, by mutator name.

### Example {#mutatorsmutator-put-example}

In the following example, an HTTP PUT request is submitted to the `/mutators/:mutator` API endpoint to create the mutator `example-mutator`.
The request returns a successful HTTP `201 Created` response.

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
  "runtime_assets": []
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/mutators/example-mutator

HTTP/1.1 201 Created
{{< /code >}}

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
  "runtime_assets": []
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a mutator {#mutatorsmutator-delete}

The `/mutators/:mutator` API endpoint provides HTTP DELETE access to delete a mutator from Sensu (specified by the mutator name).

### Example {#mutatorsmutator-delete-example}
The following example shows a request to the `/mutators/:mutator` API endpoint to delete the mutator `example-mutator`, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/core/v2/namespaces/default/mutators/example-mutator \
-H "Authorization: Key $SENSU_API_KEY" \

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification {#mutatorsmutator-delete-specification}

/mutators/:mutator (DELETE) | 
--------------------------|------
description               | Removes the specified mutator from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/default/mutators/example-mutator
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/mutators/
[2]: ../#pagination
[3]: ../#response-filtering
