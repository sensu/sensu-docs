---
title: "Role bindings API"
linkTitle: "Role Bindings API"
description: "The role bindings API provides HTTP access to role binding data. Here’s a reference for the role bindings API in Sensu Go, including examples for returning lists of role bindings, creating Sensu role bindings, and more. Read on for the full reference."
version: "5.4"
product: "Sensu Go"
menu:
  sensu-go-5.4:
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
curl http://127.0.0.1:8080/api/core/v2/namespaces/default/rolebindings -H "Authorization: Bearer $SENSU_TOKEN"

HTTP/1.1 200 OK
[
  {
    "subjects": [
      {
        "type": "Group",
        "name": "readers"
      }
    ],
    "role_ref": {
      "type": "Role",
      "name": "read-only"
    },
    "metadata": {
      "name": "readers-group-binding",
      "namespace": "default"
    }
  }
]
{{< /highlight >}}

#### API Specification {#rolebindings-get-specification}

/rolebindings (GET)  | 
---------------|------
description    | Returns the list of role bindings.
example url    | http://hostname:8080/api/core/v2/namespaces/default/rolebindings
pagination     | This endpoint supports pagination using the `limit` and `continue` query parameters. See the [API overview](../overview#pagination) for details.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "subjects": [
      {
        "type": "Group",
        "name": "readers"
      }
    ],
    "role_ref": {
      "type": "Role",
      "name": "read-only"
    },
    "metadata": {
      "name": "readers-group-binding",
      "namespace": "default"
    }
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
  "subjects": [
    {
      "type": "Group",
      "name": "readers"
    }
  ],
  "role_ref": {
    "type": "Role",
    "name": "read-only"
  },
  "metadata": {
    "name": "readers-group-binding",
    "namespace": "default"
  }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/rolebindings/:rolebinding` API endpoint {#the-rolebindingsrolebinding-api-endpoint}

### `/rolebindings/:rolebinding` (GET) {#rolebindingsrolebinding-get}

The `/rolebindings/:rolebinding` API endpoint provides HTTP GET access to [role binding data][1] for specific `:rolebinding` definitions, by role binding `name`.

#### EXAMPLE {#rolebindingsrolebinding-get-example}

In the following example, querying the `/rolebindings/:rolebinding` API returns a JSON Map
containing the requested [`:rolebinding` definition][1] (in this example: for the `:rolebinding` named
`readers-group-binding`).

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/namespaces/default/rolebindings/readers-group-binding -H "Authorization: Bearer $SENSU_TOKEN"

HTTP/1.1 200 OK
{
  "subjects": [
    {
      "type": "Group",
      "name": "readers"
    }
  ],
  "role_ref": {
    "type": "Role",
    "name": "read-only"
  },
  "metadata": {
    "name": "readers-group-binding",
    "namespace": "default"
  }
}
{{< /highlight >}}

#### API Specification {#rolebindingsrolebinding-get-specification}

/rolebindings/:rolebinding (GET) | 
---------------------|------
description          | Returns a role binding.
example url          | http://hostname:8080/api/core/v2/namespaces/default/rolebindings/readers-group-binding
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "subjects": [
    {
      "type": "Group",
      "name": "readers"
    }
  ],
  "role_ref": {
    "type": "Role",
    "name": "read-only"
  },
  "metadata": {
    "name": "readers-group-binding",
    "namespace": "default"
  }
}
{{< /highlight >}}

### `/rolebindings/:rolebinding` (PUT) {#rolebindingsrolebinding-put}

#### API Specification {#rolebindingsrolebinding-put-specification}

/rolebindings/:rolebinding (PUT) | 
----------------|------
description     | Create or update a Sensu role binding.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/rolebindings/readers-group-binding
payload         | {{< highlight shell >}}
{
  "subjects": [
    {
      "type": "Group",
      "name": "readers"
    }
  ],
  "role_ref": {
    "type": "Role",
    "name": "read-only"
  },
  "metadata": {
    "name": "readers-group-binding",
    "namespace": "default"
  }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/rolebindings/:rolebinding` (DELETE) {#rolebindingsrolebinding-delete}

The `/rolebindings/:rolebinding` API endpoint provides HTTP DELETE access to delete a role binding from Sensu given the role binding name.

### EXAMPLE {#rolebindingsrolebinding-delete-example}
The following example shows a request to delete the role binding `dev-binding`, resulting in a successful HTTP 204 No Content response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_TOKEN" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/rolebindings/dev-binding

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#rolebindingsrolebinding-delete-specification}

/rolebindings/:rolebinding (DELETE) | 
--------------------------|------
description               | Removes a role binding from Sensu given the role binding name.
example url               | http://hostname:8080/api/core/v2/namespaces/default/rolebindings/dev-binding
response codes            | <ul><li>**Success**: 202 (Accepted)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/rbac
