---
title: "Roles API"
description: "The Sensu roles API provides HTTP access to user role data. This reference includes examples for returning lists of roles, creating Sensu roles, and more. Read on for the full reference."
version: "5.16"
product: "Sensu Go"
menu:
  sensu-go-5.16:
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

The following example demonstrates a request to the `/roles` API endpoint, resulting in a JSON array that contains [role definitions][1].

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/roles \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 200 OK
[
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
        "resource_names": null
      }
    ],
    "metadata": {
      "name": "event-reader",
      "namespace": "default"
    }
  },
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
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response filtering | This endpoint supports [API response filtering][3].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
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
        "resource_names": null
      }
    ],
    "metadata": {
      "name": "event-reader",
      "namespace": "default"
    }
  },
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

The `/roles` API endpoint provides HTTP POST access to create Sensu roles.

#### EXAMPLE {#roles-post-example}

In the following example, an HTTP POST request is submitted to the `/roles` API endpoint to create a role named `event-reader`.
The request returns a successful HTTP `201 Created` response.

{{< highlight shell >}}
curl -X POST \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
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
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/roles

HTTP/1.1 201 Created
{{< /highlight >}}

#### API Specification {#roles-post-specification}

/roles (POST) | 
----------------|------
description     | Creates a Sensu role.
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
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/roles/:role` API endpoint {#the-rolesrole-api-endpoint}

### `/roles/:role` (GET) {#rolesrole-get}

The `/roles/:role` API endpoint provides HTTP GET access to [role data][1] for specific `:role` definitions, by role name.

#### EXAMPLE {#rolesrole-get-example}

In the following example, querying the `/roles/:role` API endpoint returns a JSON map that contains the requested [`:role` definition][1] (in this example, for the `:role` named `read-only`).

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/roles/read-only \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

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
description          | Returns the specified Sensu role.
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

The `/roles/:role` API endpoint provides HTTP PUT access to create or update specific `:role` definitions, by role name.

#### EXAMPLE {#rolesrole-put-example}

In the following example, an HTTP PUT request is submitted to the `/roles/:role` API endpoint to create the role `read-only`.
The request returns a successful HTTP `201 Created` response.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
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
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/roles/read-only

HTTP/1.1 201 Created
{{< /highlight >}}

#### API Specification {#rolesrole-put-specification}

/roles/:role (PUT) | 
----------------|------
description     | Creates or updates the specified Sensu role.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/roles/event-reader
payload         | {{< highlight shell >}}
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
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/roles/:role` (DELETE) {#rolesrole-delete}

The `/roles/:role` API endpoint provides HTTP DELETE access to delete a role from Sensu (specified by the role name).

#### EXAMPLE {#rolesrole-delete-example}

The following example shows a request to the `/roles/:role` API endpoint to delete the role `read-only`, resulting in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/core/v2/namespaces/default/roles/read-only \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#rolesrole-delete-specification}

/roles/:role (DELETE) | 
--------------------------|------
description               | Removes the specified role from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/default/roles/read-only
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/rbac/
[2]: ../overview#pagination
[3]: ../overview#response-filtering
