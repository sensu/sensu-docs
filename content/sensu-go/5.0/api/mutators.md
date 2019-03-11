---
title: "Mutators API"
description: "The mutator API provides HTTP access to mutator data. Here’s a reference for the mutators API in Sensu Go, including examples for returning lists of mutators, creating Sensu mutator, and more. Read on for the full reference."
version: "5.0"
product: "Sensu Go"
menu:
  sensu-go-5.0:
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

The following example demonstrates a request to the `/mutators` API, resulting in
a JSON Array containing [mutator definitions][1].

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/namespaces/default/mutators -H "Authorization: Bearer TOKEN"
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

/mutators (POST) | 
----------------|------
description     | Create a Sensu mutator.
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
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/mutators/:mutator` API endpoint {#the-mutatorsmutator-api-endpoint}

### `/mutators/:mutator` (GET) {#mutatorsmutator-get}

The `/mutators/:mutator` API endpoint provides HTTP GET access to [mutator data][1] for specific `:mutator` definitions, by mutator `name`.

#### EXAMPLE {#mutatorsmutator-get-example}

In the following example, querying the `/mutators/:mutator` API returns a JSON Map
containing the requested [`:mutator` definition][1] (in this example: for the `:mutator` named
`example-mutator`).

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/namespaces/default/mutators/example-mutator -H "Authorization: Bearer TOKEN"
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
description          | Returns a mutator.
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

#### API Specification {#mutatorsmutator-put-specification}

/mutators/:mutator (PUT) | 
----------------|------
description     | Create or update a Sensu mutator.
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

#### API Specification {#mutatorsmutator-delete-specification}

/mutators/:mutator (DELETE) | 
--------------------------|------
description               | Removes a mutator from Sensu given the mutator name.
example url               | http://hostname:8080/api/core/v2/namespaces/default/mutators/example-mutator
response codes            | <ul><li>**Success**: 202 (Accepted)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/mutators

