---
title: "core/v2/rolebindings"
description: "Read this API documentation for information about Sensu's core/v2/rolebindings API endpoints, including examples for retrieving and managing role bindings."
core_api_title: "core/v2/rolebindings"
type: "core_api"
version: "6.8"
product: "Sensu Go"
menu:
  sensu-go-6.8:
    parent: core
---

{{% notice note %}}
**NOTE**: Requests to `core/v2/rolebindings` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-auth-api-endpoints).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all role bindings

The `/rolebindings` API endpoint provides HTTP GET access to [role binding][1] data.

### Example {#rolebindings-get-example}

The following example demonstrates a GET request to the `/rolebindings` API endpoint:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/rolebindings \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a JSON array that contains the [role binding definitions][1] in the `default` namespace:

{{< code text >}}
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
      "namespace": "default",
      "created_by": "admin"
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
output         | {{< code text >}}
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
      "namespace": "default",
      "created_by": "admin"
    }
  }
]
{{< /code >}}

## Create a new role binding

The `/rolebindings` API endpoint provides HTTP POST access to create Sensu role bindings.

### Example {#rolebindings-post-example}

In the following example, an HTTP POST request is submitted to the `/rolebindings` API endpoint to create a role binding named `readers-group-binding`:

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
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
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/rolebindings
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

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

The following example queries the `/rolebindings/:rolebinding` API endpoint for the `:rolebinding` named `readers-group-binding`).

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/rolebindings/readers-group-binding \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request will return a successful `HTTP/1.1 200 OK` response and a JSON map that contains the requested [`:rolebinding` definition][1] (in this example, `readers-group-binding`):

{{< code text >}}
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
    "namespace": "default",
    "created_by": "admin"
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
output               | {{< code text >}}
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
    "namespace": "default",
    "created_by": "admin"
  }
}
{{< /code >}}

## Create or update a role binding {#rolebindingsrolebinding-put}

The `/rolebindings/:rolebinding` API endpoint provides HTTP PUT access to create or update [role binding data][1] for specific `:rolebinding` definitions, by role binding `name`.

### Example {#rolebindingsrolebinding-put-example}

In the following example, an HTTP PUT request is submitted to the `/rolebindings/:rolebinding` API endpoint to create the role binding `dev-binding`:

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
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
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

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

## Update a role binding with PATCH

The `/rolebindings/:rolebinding` API endpoint provides HTTP PATCH access to update `:rolebinding` definitions, specified by role binding name.

{{% notice note %}}
**NOTE**: You cannot change a resource's `name` or `namespace` with a PATCH request.
Use a [PUT request](#rolebindingsrolebinding-put) instead.<br><br>
Also, you cannot add elements to an array with a PATCH request &mdash; you must replace the entire array.
{{% /notice %}}

### Example

In the following example, an HTTP PATCH request is submitted to the `/rolebindings/:rolebinding` API endpoint to add a group to the subjects array for the `dev-binding` role binding, resulting in an `HTTP/1.1 200 OK` response and the updated role binding definition.

We support [JSON merge patches][4], so you must set the `Content-Type` header to `application/merge-patch+json` for PATCH requests.

{{< code shell >}}
curl -X PATCH \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/merge-patch+json' \
-d '{
  "subjects": [
    {
      "type": "Group",
      "name": "dev_team_1"
    },
    {
      "type": "Group",
      "name": "dev_team_2"
    }
  ]
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/rolebindings/dev-binding
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

### API Specification

/rolebindings/:rolebinding (PATCH) | 
----------------|------
description     | Updates the specified Sensu role binding.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/rolebindings/dev-binding
payload         | {{< code shell >}}
{
  "subjects": [
    {
      "type": "Group",
      "name": "dev_team_1"
    },
    {
      "type": "Group",
      "name": "dev_team_2"
    }
  ]
}
{{< /code >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a role binding {#rolebindingsrolebinding-delete}

The `/rolebindings/:rolebinding` API endpoint provides HTTP DELETE access to delete a role binding from Sensu (specified by the role binding name).

### Example {#rolebindingsrolebinding-delete-example}

The following example shows a request to the `/rolebindings/:rolebinding` API endpoint to delete the role binding `dev-binding`, resulting in a successful `HTTP/1.1 204 No Content` response.

{{< code shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/core/v2/namespaces/default/rolebindings/dev-binding \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

### API Specification {#rolebindingsrolebinding-delete-specification}

/rolebindings/:rolebinding (DELETE) | 
--------------------------|------
description               | Removes the specified role binding from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/default/rolebindings/dev-binding
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a subset of role bindings with response filtering

The `/rolebindings` API endpoint supports [response filtering][3] for a subset of role binding data based on labels and the following fields:

- `rolebinding.name`
- `rolebinding.namespace`
- `rolebinding.role_ref.name`
- `rolebinding.role_ref.type`

### Example

The following example demonstrates a request to the `/rolebindings` API endpoint with [response filtering][3] for only [role binding definitions][1] with `event-reader` as the rolebinding.role_ref.name:

{{< code shell >}}
curl -H "Authorization: Key $SENSU_API_KEY" http://127.0.0.1:8080/api/core/v2/rolebindings -G \
--data-urlencode 'fieldSelector="event-reader" in rolebinding.role_ref.name'
{{< /code >}}

The example request will result in a successful `HTTP/1.1 200 OK` response and a JSON array that contains only [role binding definitions][1] with `event-reader` as the rolebinding.role_ref.name:

{{< code text >}}
[
  {
    "subjects": [
      {
        "type": "User",
        "name": "ann"
      },
      {
        "type": "User",
        "name": "bonita"
      },
      {
        "type": "Group",
        "name": "admins"
      },
      {
        "type": "Group",
        "name": "read-events"
      }
    ],
    "role_ref": {
      "type": "Role",
      "name": "event-reader"
    },
    "metadata": {
      "name": "event-reader-binding",
      "namespace": "default",
      "labels": {
        "sensu.io/managed_by": "sensuctl"
      },
      "created_by": "admin"
    }
  }
]
{{< /code >}}

{{% notice note %}}
**NOTE**: Read [API response filtering](../../#response-filtering) for more filter statement examples that demonstrate how to filter responses using different operators with label and field selectors.
{{% /notice %}}

### API Specification

/rolebindings (GET) with response filters | 
---------------|------
description    | Returns the list of role bindings that match the [response filters][3] applied in the API request.
example url    | http://hostname:8080/api/core/v2/rolebindings
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "subjects": [
      {
        "type": "User",
        "name": "ann"
      },
      {
        "type": "User",
        "name": "bonita"
      },
      {
        "type": "Group",
        "name": "admins"
      },
      {
        "type": "Group",
        "name": "read-events"
      }
    ],
    "role_ref": {
      "type": "Role",
      "name": "event-reader"
    },
    "metadata": {
      "name": "event-reader-binding",
      "namespace": "default",
      "labels": {
        "sensu.io/managed_by": "sensuctl"
      },
      "created_by": "admin"
    }
  }
]
{{< /code >}}


[1]: ../../../operations/control-access/rbac/#role-bindings-and-cluster-role-bindings
[2]: ../../#pagination
[3]: ../../#response-filtering
[4]: https://tools.ietf.org/html/rfc7396
