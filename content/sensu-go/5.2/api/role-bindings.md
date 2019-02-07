---
title: "Role bindings API"
linkTitle: "Role Bindings API"
description: "Sensu Go role bindings API reference documentation"
version: "5.2"
product: "Sensu Go"
menu:
  sensu-go-5.2:
    parent: api
---

- [The `/rolebindings` API endpoint](#the-rolebindings-api-endpoint)
	- [`/rolebindings` (GET)](#rolebindings-get)
	- [`/rolebindings` (POST)](#rolebindings-post)
- [The `/rolebindings/:rolebinding` API endpoint](#the-rolebindingsrolebinding-api-endpoint)
	- [`/rolebindings/:rolebinding` (GET)](#rolebindingsrolebinding-get)
  - [`/rolebindings/:rolebinding` (PUT)](#rolebindingsrolebinding-put)
  - [`/rolebindings/:rolebinding` (DELETE)](#rolebindingsrolebinding-delete)

## The `/rolebindings` API endpoint

### `/rolebindings` (GET)

The `/rolebindings` API endpoint provides HTTP GET access to [role binding][1] data.

#### EXAMPLE {#rolebindings-get-example}

The following example demonstrates a request to the `/rolebindings` API, resulting in
a JSON Array containing [role binding definitions][1].

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/namespaces/default/rolebindings -H "Authorization: Bearer TOKEN"

HTTP/1.1 200 OK
[
  {
    "name": "alice-binder",
    "namespace": "default",
    "roleRef": {
      "type": "Role",
      "name": "event-reader"
    },
    "subjects": [
      {
        "type": "User",
        "name": "alice"
      }
    ]
  }
]
{{< /highlight >}}

#### API Specification {#rolebindings-get-specification}

/rolebindings (GET)  | 
---------------|------
description    | Returns the list of role bindings.
example url    | http://hostname:8080/api/core/v2/namespaces/default/rolebindings
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "name": "alice-binder",
    "namespace": "default",
    "roleRef": {
      "type": "Role",
      "name": "event-reader"
    },
    "subjects": [
      {
        "type": "User",
        "name": "alice"
      }
    ]
  }
]
{{< /highlight >}}

### `/rolebindings` (POST)

/rolebindings (POST) | 
----------------|------
description     | Create a Sensu role binding.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/rolebindings
payload         | {{< highlight shell >}}
{
  "name": "alice-binder",
  "namespace": "default",
  "roleRef": {
    "type": "Role",
    "name": "event-reader"
  },
  "subjects": [
    {
      "type": "User",
      "name": "alice"
    }
  ]
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/rolebindings/:rolebinding` API endpoint {#the-rolebindingsrolebinding-api-endpoint}

### `/rolebindings/:rolebinding` (GET) {#rolebindingsrolebinding-get}

The `/rolebindings/:rolebinding` API endpoint provides HTTP GET access to [role binding data][1] for specific `:rolebinding` definitions, by role binding `name`.

#### EXAMPLE {#rolebindingsrolebinding-get-example}

In the following example, querying the `/rolebindings/:rolebinding` API returns a JSON Map
containing the requested [`:rolebinding` definition][1] (in this example: for the `:rolebinding` named
`alice`).

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/namespaces/default/rolebindings/alice -H "Authorization: Bearer TOKEN"
{
  "name": "alice-binder",
  "namespace": "default",
  "roleRef": {
    "type": "Role",
    "name": "event-reader"
  },
  "subjects": [
    {
      "type": "User",
      "name": "alice"
    }
  ]
}
{{< /highlight >}}

#### API Specification {#rolebindingsrolebinding-get-specification}

/rolebindings/:rolebinding (GET) | 
---------------------|------
description          | Returns a role binding.
example url          | http://hostname:8080/api/core/v2/namespaces/default/rolebindings/alice
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "name": "alice-binder",
  "namespace": "default",
  "roleRef": {
    "type": "Role",
    "name": "event-reader"
  },
  "subjects": [
    {
      "type": "User",
      "name": "alice"
    }
  ]
}
{{< /highlight >}}

### `/rolebindings/:rolebinding` (PUT) {#rolebindingsrolebinding-put}

#### API Specification {#rolebindingsrolebinding-put-specification}

/rolebindings/:rolebinding (PUT) | 
----------------|------
description     | Create or update a Sensu role binding.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/rolebindings/alice-binder
payload         | {{< highlight shell >}}
{
  "name": "alice-binder",
  "namespace": "default",
  "roleRef": {
    "type": "Role",
    "name": "event-reader"
  },
  "subjects": [
    {
      "type": "User",
      "name": "alice"
    }
  ]
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/rolebindings/:rolebinding` (DELETE) {#rolebindingsrolebinding-delete}

#### API Specification {#rolebindingsrolebinding-delete-specification}

/rolebindings/:rolebinding (DELETE) | 
--------------------------|------
description               | Removes a role binding from Sensu given the role binding name.
example url               | http://hostname:8080/api/core/v2/namespaces/default/rolebindings/alice-binder
response codes            | <ul><li>**Success**: 202 (Accepted)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/rbac
