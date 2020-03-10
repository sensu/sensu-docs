---
title: "Mutators API"
description: "The Sensu mutator API provides HTTP access to mutator data. This reference includes examples for returning lists of mutators, creating a Sensu mutator, and more. Read on for the full reference."
version: "5.17"
product: "Sensu Go"
menu:
  sensu-go-5.17:
    parent: api
---

- [The `/mutators` API endpoint](#the-mutators-api-endpoint)
	- [`/mutators` (GET)](#mutators-get)
	- [`/mutators` (POST)](#mutators-post)
- [The `/mutators/:mutator` API endpoint](#the-mutatorsmutator-api-endpoint)
	- [`/mutators/:mutator` (GET)](#mutatorsmutator-get)
  - [`/mutators/:mutator` (PUT)](#mutatorsmutator-put)
  - [`/mutators/:mutator` (DELETE)](#mutatorsmutator-delete)

## The `/mutators` API endpoint

### `/mutators` (GET)

The `/mutators` API endpoint provides HTTP GET access to [mutator][1] data.

#### EXAMPLE {#mutators-get-example}

The following example demonstrates a request to the `/mutators` API endpoint, resulting in a JSON array that contains [mutator definitions][1].

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/mutators \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 200 OK
[
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
]
{{< /highlight >}}

#### API Specification {#mutators-get-specification}

/mutators (GET)  | 
---------------|------
description    | Returns the list of mutators.
example url    | http://hostname:8080/api/core/v2/namespaces/default/mutators
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response filtering | This endpoint supports [API response filtering][3].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
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
]
{{< /highlight >}}

### `/mutators` (POST)

The `/mutators` API endpoint provides HTTP POST access to create mutators.

#### EXAMPLE {#mutators-post-example}

In the following example, an HTTP POST request is submitted to the `/mutators` API endpoint to create the mutator `example-mutator`.
The request returns a successful HTTP `201 Created` response.

{{< highlight shell >}}
curl -X POST \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
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
{{< /highlight >}}

#### API Specification {#mutators-post-specification}

/mutators (POST) | 
----------------|------
description     | Creates a Sensu mutator.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/mutators
payload         | {{< highlight shell >}}
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
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/mutators/:mutator` API endpoint {#the-mutatorsmutator-api-endpoint}

### `/mutators/:mutator` (GET) {#mutatorsmutator-get}

The `/mutators/:mutator` API endpoint provides HTTP GET access to [mutator data][1] for specific `:mutator` definitions, by mutator name.

#### EXAMPLE {#mutatorsmutator-get-example}

In the following example, querying the `/mutators/:mutator` API endpoint returns a JSON map that contains the requested [`:mutator` definition][1] (in this example, for the `:mutator` named `example-mutator`).

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/mutators/example-mutator \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 200 OK
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
{{< /highlight >}}

#### API Specification {#mutatorsmutator-get-specification}

/mutators/:mutator (GET) | 
---------------------|------
description          | Returns the specified mutator.
example url          | http://hostname:8080/api/core/v2/namespaces/default/mutators/mutator-name
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
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
{{< /highlight >}}

### `/mutators/:mutator` (PUT) {#mutatorsmutator-put}

The `/mutators/:mutator` API endpoint provides HTTP PUT access to [mutator data][1] to create or update specific `:mutator` definitions, by mutator name.

#### EXAMPLE {#mutatorsmutator-put-example}

In the following example, an HTTP PUT request is submitted to the `/mutators/:mutator` API endpoint to create the mutator `example-mutator`.
The request returns a successful HTTP `201 Created` response.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
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
{{< /highlight >}}

#### API Specification {#mutatorsmutator-put-specification}

/mutators/:mutator (PUT) | 
----------------|------
description     | Creates or updates a Sensu mutator.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/mutators/example-mutator
payload         | {{< highlight shell >}}
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
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/mutators/:mutator` (DELETE) {#mutatorsmutator-delete}

The `/mutators/:mutator` API endpoint provides HTTP DELETE access to delete a mutator from Sensu (specified by the mutator name).

#### EXAMPLE {#mutatorsmutator-delete-example}
The following example shows a request to the `/mutators/:mutator` API endpoint to delete the mutator `example-mutator`, resulting in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/core/v2/namespaces/default/mutators/example-mutator \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#mutatorsmutator-delete-specification}

/mutators/:mutator (DELETE) | 
--------------------------|------
description               | Removes the specified mutator from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/default/mutators/example-mutator
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/mutators/
[2]: ../overview#pagination
[3]: ../overview#response-filtering
