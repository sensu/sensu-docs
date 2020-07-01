---
title: "Role bindings API"
linkTitle: "Role Bindings API"
description: "The Sensu role bindings API provides HTTP access to role binding data. This reference includes examples for returning lists of role bindings, creating Sensu role bindings, and more. Read on for the full reference."
version: "5.18"
product: "Sensu Go"
menu:
  sensu-go-5.18:
    parent: api
---

## Get all role bindings

The `/rolebindings` API endpoint provides HTTP GET access to [role binding][1] data.

### Example {#rolebindings-get-example}

The following example demonstrates a request to the `/rolebindings` API endpoint, resulting in a JSON array that contains [role binding definitions][1].

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/rolebindings \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

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
{{< /code >}}

### API Specification {#rolebindings-get-specification}

/rolebindings (GET)  | 
---------------|------
description    | Returns the list of role bindings.
example url    | http://hostname:8080/api/core/v2/namespaces/default/rolebindings
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response filtering | This endpoint supports [API response filtering][3].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code shell >}}
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
{{< /code >}}

## Create a new role binding

The `/rolebindings` API endpoint provides HTTP POST access to create Sensu role bindings.

### Example {#rolebindings-post-example}

In the following example, an HTTP POST request is submitted to the `/rolebindings` API endpoint to create a role binding named `readers-group-binding`.
The request returns a successful HTTP `201 Created` response.

{{< code shell >}}
curl -X POST \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "name": "development"
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/rolebindings

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#rolebindings-post-specification}

/rolebindings (POST) | 
----------------|------
description     | Creates a Sensu role binding.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/rolebindings
payload         | {{< code shell >}}
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
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific role binding {#rolebindingsrolebinding-get}

The `/rolebindings/:rolebinding` API endpoint provides HTTP GET access to [role binding data][1] for specific `:rolebinding` definitions, by role binding `name`.

### Example {#rolebindingsrolebinding-get-example}

In the following example, querying the `/rolebindings/:rolebinding` API endpoint returns a JSON map that contains the requested [`:rolebinding` definition][1] (in this example, for the `:rolebinding` named `readers-group-binding`).

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/rolebindings/readers-group-binding \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

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
{{< /code >}}

### API Specification {#rolebindingsrolebinding-get-specification}

/rolebindings/:rolebinding (GET) | 
---------------------|------
description          | Returns the specified role binding.
example url          | http://hostname:8080/api/core/v2/namespaces/default/rolebindings/readers-group-binding
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code json >}}
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
{{< /code >}}

## Create or update a role binding {#rolebindingsrolebinding-put}

The `/rolebindings/:rolebinding` API endpoint provides HTTP PUT access to create or update [role binding data][1] for specific `:rolebinding` definitions, by role binding `name`.

### Example {#rolebindingsrolebinding-put-example}

In the following example, an HTTP PUT request is submitted to the `/rolebindings/:rolebinding` API endpoint to create the role binding `dev-binding`.
The request returns a successful HTTP `201 Created` response.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "subjects": [
    {
      "type": "Group",
      "name": "devs"
    }
  ],
  "role_ref": {
    "type": "Role",
    "name": "workflow-creator"
  },
  "metadata": {
    "name": "dev-binding",
    "namespace": "default"
  }
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/rolebindings/dev-binding

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#rolebindingsrolebinding-put-specification}

/rolebindings/:rolebinding (PUT) | 
----------------|------
description     | Creates or updates a Sensu role binding.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/rolebindings/dev-binding
payload         | {{< code shell >}}
{
  "subjects": [
    {
      "type": "Group",
      "name": "devs"
    }
  ],
  "role_ref": {
    "type": "Role",
    "name": "workflow-creator"
  },
  "metadata": {
    "name": "dev-binding",
    "namespace": "default"
  }
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a role binding {#rolebindingsrolebinding-delete}

The `/rolebindings/:rolebinding` API endpoint provides HTTP DELETE access to delete a role binding from Sensu (specified by the role binding name).

### Example {#rolebindingsrolebinding-delete-example}

The following example shows a request to the `/rolebindings/:rolebinding` API endpoint to delete the role binding `dev-binding`, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/core/v2/namespaces/default/rolebindings/dev-binding \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification {#rolebindingsrolebinding-delete-specification}

/rolebindings/:rolebinding (DELETE) | 
--------------------------|------
description               | Removes the specified role binding from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/default/rolebindings/dev-binding
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/rbac/
[2]: ../overview#pagination
[3]: ../overview#response-filtering
