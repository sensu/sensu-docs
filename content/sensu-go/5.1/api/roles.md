---
title: "Roles API"
description: "The roles API provides HTTP access to user role data. Here’s a reference for the roles API in Sensu Go, including examples for returning lists of roles, creating Sensu roles, and more. Read on for the full reference."
version: "5.1"
product: "Sensu Go"
menu:
  sensu-go-5.1:
    parent: api
---

- [The `/roles` API endpoint](#the-roles-api-endpoint)
	- [`/roles` (GET)](#roles-get)
	- [`/roles` (POST)](#roles-post)
- [The `/roles/:role` API endpoint](#the-rolesrole-api-endpoint)
	- [`/roles/:role` (GET)](#rolesrole-get)
  - [`/roles/:role` (PUT)](#rolesrole-put)
  - [`/roles/:role` (DELETE)](#rolesrole-delete)

## The `/roles` API endpoint

### `/roles` (GET)

The `/roles` API endpoint provides HTTP GET access to [role][1] data.

#### EXAMPLE {#roles-get-example}

The following example demonstrates a request to the `/roles` API, resulting in
a JSON Array containing [role definitions][1].

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/namespaces/default/roles -H "Authorization: Bearer TOKEN"

HTTP/1.1 200 OK
[
  {
    "rules": [
      {
        "verbs": [
          "read"
        ],
        "resources": [
          "*"
        ],
        "resource_names": null
      }
    ],
    "metadata": {
      "name": "read-only",
      "namespace": "default"
    }
  }
]
{{< /highlight >}}

#### API Specification {#roles-get-specification}

/roles (GET)  | 
---------------|------
description    | Returns the list of roles.
example url    | http://hostname:8080/api/core/v2/namespaces/default/roles
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "rules": [
      {
        "verbs": [
          "read"
        ],
        "resources": [
          "*"
        ],
        "resource_names": null
      }
    ],
    "metadata": {
      "name": "read-only",
      "namespace": "default"
    }
  }
]
{{< /highlight >}}

### `/roles` (POST)

/roles (POST) | 
----------------|------
description     | Create a Sensu role.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/roles
payload         | {{< highlight shell >}}
{
  "rules": [
    {
      "verbs": [
        "get",
        "list"
      ],
      "resources": [
        "events"
      ],
      "resource_names": []
    }
  ],
  "metadata": {
    "name": "event-reader",
    "namespace": "default"
  }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/roles/:role` API endpoint {#the-rolesrole-api-endpoint}

### `/roles/:role` (GET) {#rolesrole-get}

The `/roles/:role` API endpoint provides HTTP GET access to [role data][1] for specific `:role` definitions, by role `name`.

#### EXAMPLE {#rolesrole-get-example}

In the following example, querying the `/roles/:role` API returns a JSON Map
containing the requested [`:role` definition][1] (in this example: for the `:role` named
`read-only`).

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/namespaces/default/roles/read-only -H "Authorization: Bearer TOKEN"

HTTP/1.1 200 OK
{
  "rules": [
    {
      "verbs": [
        "read"
      ],
      "resources": [
        "*"
      ],
      "resource_names": null
    }
  ],
  "metadata": {
    "name": "read-only",
    "namespace": "default"
  }
}
{{< /highlight >}}

#### API Specification {#rolesrole-get-specification}

/roles/:role (GET) | 
---------------------|------
description          | Returns a role.
example url          | http://hostname:8080/api/core/v2/namespaces/default/roles/read-only
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "rules": [
    {
      "verbs": [
        "read"
      ],
      "resources": [
        "*"
      ],
      "resource_names": null
    }
  ],
  "metadata": {
    "name": "read-only",
    "namespace": "default"
  }
}
{{< /highlight >}}

### `/roles/:role` (PUT) {#rolesrole-put}

#### API Specification {#rolesrole-put-specification}

/roles/:role (PUT) | 
----------------|------
description     | Create or update a Sensu role.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/roles/event-reader
payload         | {{< highlight shell >}}
{
  "rules": [
    {
      "verbs": [
        "get",
        "list"
      ],
      "resources": [
        "events"
      ],
      "resource_names": []
    }
  ],
  "metadata": {
    "name": "event-reader",
    "namespace": "default"
  }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/roles/:role` (DELETE) {#rolesrole-delete}

#### API Specification {#rolesrole-delete-specification}

/roles/:role (DELETE) | 
--------------------------|------
description               | Removes a role from Sensu given the role name.
example url               | http://hostname:8080/api/core/v2/namespaces/default/roles/ready-only
response codes            | <ul><li>**Success**: 202 (Accepted)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/rbac
