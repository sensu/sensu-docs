---
title: "Role bindings API"
linkTitle: "Role Bindings API"
description: "Sensu Go role bindings API reference documentation"
version: "5.0"
product: "Sensu Go"
menu:
  sensu-go-5.0:
    parent: api
---

- [The `/role-bindings` API endpoint](#the-role-bindings-api-endpoint)
	- [`/role-bindings` (GET)](#role-bindings-get)
	- [`/role-bindings` (POST)](#role-bindings-post)
	- [`/role-bindings` (PUT)](#role-bindings-put)
- [The `/role-bindings/:role-binding` API endpoint](#the-role-bindingsrole-binding-api-endpoint)
	- [`/role-bindings/:role-binding` (GET)](#role-bindingsrole-binding-get)

## The `/role-bindings` API endpoint

### `/role-bindings` (GET)

The `/role-bindings` API endpoint provides HTTP GET access to [role-binding][1] data.

#### EXAMPLE {#role-bindings-get-example}

The following example demonstrates a request to the `/role-bindings` API, resulting in
a JSON Array containing [role binding definitions][1].

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/namespaces/default/role-bindings -H "Authorization: Bearer TOKEN"
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

#### API Specification {#role-bindings-get-specification}

/role-bindings (GET)  | 
---------------|------
description    | Returns the list of role bindings.
example url    | http://hostname:8080/api/core/v2/namespaces/default/role-bindings
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

### `/role-bindings` (POST)

/role-bindings (POST) | 
----------------|------
description     | Create a Sensu role binding.
example URL     | http://hostname:8080/api/core/v2/role-bindings/default/role-bindings
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

### `/role-bindings` (PUT)

/role-bindings (PUT) | 
----------------|------
description     | Create or update a Sensu role binding.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/role-bindings
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

## The `/role-bindings/:role-binding` API endpoint {#the-role-bindingsrole-binding-api-endpoint}

### `/role-bindings/:role-binding` (GET) {#role-bindingsrole-binding-get}

The `/role-bindings/:role-binding` API endpoint provides HTTP GET access to [role-binding data][1] for specific `:role-binding` definitions, by role-binding `name`.

#### EXAMPLE {#role-bindingsrole-binding-get-example}

In the following example, querying the `/role-bindings/:role-binding` API returns a JSON Map
containing the requested [`:role-binding` definition][1] (in this example: for the `:role-binding` named
`alice`).

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/namespaces/default/role-bindings/alice -H "Authorization: Bearer TOKEN"
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

#### API Specification {#role-bindingsrole-binding-get-specification}

/role-bindings/:role-binding (GET) | 
---------------------|------
description          | Returns a role binding.
example url          | http://hostname:8080/api/core/v2/namespaces/default/role-bindings/alice
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

[1]: ../../reference/rbac
