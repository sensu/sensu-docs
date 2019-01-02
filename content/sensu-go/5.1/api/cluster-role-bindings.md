---
title: "Cluster role bindings API"
linktitle: "Cluster Role Bindings API"
description: "Sensu Go cluster role bindings API reference documentation"
version: "5.1"
product: "Sensu Go"
menu:
  sensu-go-5.1:
    parent: api
---

- [The `/cluster-role-bindings` API endpoint](#the-cluster-role-bindings-api-endpoint)
	- [`/cluster-role-bindings` (GET)](#cluster-role-bindings-get)
	- [`/cluster-role-bindings` (POST)](#cluster-role-bindings-post)
- [The `/cluster-role-bindings/:cluster-role-binding` API endpoint](#the-cluster-role-bindingscluster-role-binding-api-endpoint)
	- [`/cluster-role-bindings/:cluster-role-binding` (GET)](#cluster-role-bindingscluster-role-binding-get)
  - [`/cluster-role-bindings/:cluster-role-binding` (PUT)](#cluster-role-bindingscluster-role-binding-put)
	- [`/cluster-role-bindings/:cluster-role-binding` (DELETE)](#cluster-role-bindingscluster-role-binding-delete)

## The `/cluster-role-bindings` API endpoint

### `/cluster-role-bindings` (GET)

The `/cluster-role-bindings` API endpoint provides HTTP GET access to [cluster role binding][1] data.

#### EXAMPLE {#cluster-role-bindings-get-example}

The following example demonstrates a request to the `/cluster-role-bindings` API, resulting in
a JSON Array containing [cluster role binding definitions][1].

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/cluster-role-bindings -H "Authorization: Bearer TOKEN"
[
  {
    "name": "bob-binder",
    "roleRef": {
      "type": "ClusterRole",
      "name": "admin"
    },
    "subjects": [
      {
        "type": "User",
        "name": "bob"
      }
    ]
  }
]
{{< /highlight >}}

#### API Specification {#cluster-role-bindings-get-specification}

/cluster-role-bindings (GET)  | 
---------------|------
description    | Returns the list of cluster role bindings.
example url    | http://hostname:8080/api/core/v2/cluster-role-bindings
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "name": "bob-binder",
    "roleRef": {
      "type": "ClusterRole",
      "name": "admin"
    },
    "subjects": [
      {
        "type": "User",
        "name": "bob"
      }
    ]
  }
]
{{< /highlight >}}

### `/cluster-role-bindings` (POST)

/cluster-role-bindings (POST) | 
----------------|------
description     | Create a Sensu cluster role binding.
example URL     | http://hostname:8080/api/core/v2/cluster-role-bindings/default/cluster-role-bindings
payload         | {{< highlight shell >}}
{
  "name": "bob-binder",
  "roleRef": {
    "type": "ClusterRole",
    "name": "admin"
  },
  "subjects": [
    {
      "type": "User",
      "name": "bob"
    }
  ]
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/cluster-role-bindings/:cluster-role-binding` API endpoint {#the-cluster-role-bindingscluster-role-binding-api-endpoint}

### `/cluster-role-bindings/:cluster-role-binding` (GET) {#cluster-role-bindingscluster-role-binding-get}

The `/cluster-role-bindings/:cluster-role-binding` API endpoint provides HTTP GET access to [cluster-role-binding data][1] for specific `:cluster-role-binding` definitions, by cluster-role-binding `name`.

#### EXAMPLE {#cluster-role-bindingscluster-role-binding-get-example}

In the following example, querying the `/cluster-role-bindings/:cluster-role-binding` API returns a JSON Map
containing the requested [`:cluster-role-binding` definition][1] (in this example: for the `:cluster-role-binding` named
`bob`).

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/cluster-role-bindings/bob -H "Authorization: Bearer TOKEN"
{
  "name": "bob-binder",
  "roleRef": {
    "type": "ClusterRole",
    "name": "admin"
  },
  "subjects": [
    {
      "type": "User",
      "name": "bob"
    }
  ]
}
{{< /highlight >}}

#### API Specification {#cluster-role-bindingscluster-role-binding-get-specification}

/cluster-role-bindings/:cluster-role-binding (GET) | 
---------------------|------
description          | Returns a cluster role binding.
example url          | http://hostname:8080/api/core/v2/cluster-role-bindings/bob
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "name": "bob-binder",
  "roleRef": {
    "type": "ClusterRole",
    "name": "admin"
  },
  "subjects": [
    {
      "type": "User",
      "name": "bob"
    }
  ]
}
{{< /highlight >}}

### `/cluster-role-bindings/:cluster-role-binding` (PUT) {#cluster-role-bindingscluster-role-binding-put}

#### API Specification {#cluster-role-bindingscluster-role-binding-put-specification}

/cluster-role-bindings/:cluster-role-binding (PUT) | 
----------------|------
description     | Create or update a Sensu cluster role binding.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/cluster-role-bindings/bob-binder
payload         | {{< highlight shell >}}
{
  "name": "bob-binder",
  "roleRef": {
    "type": "ClusterRole",
    "name": "admin"
  },
  "subjects": [
    {
      "type": "User",
      "name": "bob"
    }
  ]
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/cluster-role-bindings/:cluster-role-binding` (DELETE) {#cluster-role-bindingscluster-role-binding-delete}

#### API Specification {#cluster-role-bindingscluster-role-binding-delete-specification}

/cluster-role-bindings/:cluster-role-binding (DELETE) | 
--------------------------|------
description               | Removes a cluster role binding from Sensu given the cluster role binding name.
example url               | http://hostname:8080/api/core/v2/namespaces/default/cluster-role-bindings/bob-binder
response codes            | <ul><li>**Success**: 202 (Accepted)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/rbac

