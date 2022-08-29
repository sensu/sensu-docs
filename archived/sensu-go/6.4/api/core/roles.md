---
title: "core/v2/roles"
description: "Read this API documentation for information about Sensu core/v2/roles API endpoints, with examples for retrieving and managing Sensu roles."
core_api_title: "core/v2/roles"
type: "core_api"
version: "6.4"
product: "Sensu Go"
menu:
  sensu-go-6.4:
    parent: core
---

{{% notice note %}}
**NOTE**: Requests to `core/v2/roles` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-auth-api-endpoints).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all roles

The `/roles` API endpoint provides HTTP GET access to [role][1] data.

### Example {#roles-get-example}

The following example demonstrates a GET request to the `/roles` API endpoint:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/roles \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a JSON array that contains the [role definitions][1] in the `default` namespace:

{{< code text >}}
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
      "namespace": "default",
      :created_by": "admin"
    }
  },
  {
    "rules": [
      {
        "verbs": [
          "get"
        ],
        "resources": [
          "*"
        ],
        "resource_names": null
      }
    ],
    "metadata": {
      "name": "read-only",
      "namespace": "default",
      "created_by": "admin"
    }
  }
]
{{< /code >}}

### API Specification {#roles-get-specification}

/roles (GET)  | 
---------------|------
description    | Returns the list of roles.
example url    | http://hostname:8080/api/core/v2/namespaces/default/roles
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response filtering | This endpoint supports [API response filtering][3].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
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
      "namespace": "default",
      "created_by": "admin"
    }
  },
  {
    "rules": [
      {
        "verbs": [
          "get"
        ],
        "resources": [
          "*"
        ],
        "resource_names": null
      }
    ],
    "metadata": {
      "name": "read-only",
      "namespace": "default",
      "created_by": "admin"
    }
  }
]
{{< /code >}}

## Create a new role

The `/roles` API endpoint provides HTTP POST access to create Sensu roles.

### Example {#roles-post-example}

In the following example, an HTTP POST request is submitted to the `/roles` API endpoint to create a role named `event-reader`:

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
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
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

### API Specification {#roles-post-specification}

/roles (POST) | 
----------------|------
description     | Creates a Sensu role.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/roles
payload         | {{< code shell >}}
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
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific role {#rolesrole-get}

The `/roles/:role` API endpoint provides HTTP GET access to [role data][1] for specific `:role` definitions, by role name.

### Example {#rolesrole-get-example}

The following example queries the `/roles/:role` API endpoint for the `:role` named `read-only`:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/roles/read-only \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request will return a successful `HTTP/1.1 200 OK` response and a JSON map that contains the requested [`:role` definition][1] (in this example, `read-only`):

{{< code text >}}
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
    "namespace": "default",
    "created_by": "admin"
  }
}
{{< /code >}}

### API Specification {#rolesrole-get-specification}

/roles/:role (GET) | 
---------------------|------
description          | Returns the specified Sensu role.
example url          | http://hostname:8080/api/core/v2/namespaces/default/roles/read-only
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code text >}}
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
    "namespace": "default",
    "created_by": "admin"
  }
}
{{< /code >}}

## Create or update a role {#rolesrole-put}

The `/roles/:role` API endpoint provides HTTP PUT access to create or update specific `:role` definitions, by role name.

### Example {#rolesrole-put-example}

In the following example, an HTTP PUT request is submitted to the `/roles/:role` API endpoint to create the role `read-only`:

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
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
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

### API Specification {#rolesrole-put-specification}

/roles/:role (PUT) | 
----------------|------
description     | Creates or updates the specified Sensu role.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/roles/event-reader
payload         | {{< code shell >}}
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
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Update a role with PATCH

The `/roles/:role` API endpoint provides HTTP PATCH access to update `:role` definitions, specified by role name.

{{% notice note %}}
**NOTE**: You cannot change a resource's `name` or `namespace` with a PATCH request.
Use a [PUT request](#rolesrole-put) instead.<br><br>
Also, you cannot add elements to an array with a PATCH request &mdash; you must replace the entire array.
{{% /notice %}}

### Example

In the following example, an HTTP PATCH request is submitted to the `/roles/:role` API endpoint to update the verbs array within the rules array for the `global-event-admin` role, resulting in an `HTTP/1.1 200 OK` response and the updated role definition.

We support [JSON merge patches][4], so you must set the `Content-Type` header to `application/merge-patch+json` for PATCH requests.

{{< code shell >}}
curl -X PATCH \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/merge-patch+json' \
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
      "resource_names": null
    }
  ]
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/roles/event-reader
{{< /code >}}

### API Specification

/roles/:role (PATCH) | 
----------------|------
description     | Updates the specified Sensu role.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/roles/event-reader
payload         | {{< code shell >}}
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
  ]
}
{{< /code >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a role {#rolesrole-delete}

The `/roles/:role` API endpoint provides HTTP DELETE access to delete a role from Sensu (specified by the role name).

### Example {#rolesrole-delete-example}

The following example shows a request to the `/roles/:role` API endpoint to delete the role `read-only`, resulting in a successful `HTTP/1.1 204 No Content` response:

{{< code shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/core/v2/namespaces/default/roles/read-only \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

### API Specification {#rolesrole-delete-specification}

/roles/:role (DELETE) | 
--------------------------|------
description               | Removes the specified role from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/default/roles/read-only
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a subset of roles with response filtering

The `/roles` API endpoint supports [response filtering][3] for a subset of role data based on labels and the following fields:

- `role.name`
- `role.namespace`

### Example

The following example demonstrates a request to the `/roles` API endpoint with [response filtering][3] for only [role definitions][1] that are in the `development` namespace:

{{< code shell >}}
curl -H "Authorization: Key $SENSU_API_KEY" http://127.0.0.1:8080/api/core/v2/roles -G \
--data-urlencode 'fieldSelector=role.namespace == development'
{{< /code >}}

The example request will result in a successful `HTTP/1.1 200 OK` response and a JSON array that contains only [role definitions][1] in the `development` namespace:

{{< code text >}}
[
  {
    "rules": [
      {
        "verbs": [
          "get",
          "list",
          "create",
          "update",
          "delete"
        ],
        "resources": [
          "*"
        ],
        "resource_names": null
      }
    ],
    "metadata": {
      "name": "admin_role",
      "namespace": "development",
      "created_by": "admin"
    }
  },
  {
    "rules": [
      {
        "verbs": [
          "get",
          "list",
          "create",
          "update",
          "delete"
        ],
        "resources": [
          "assets",
          "checks",
          "entities",
          "events",
          "filters",
          "handlers",
          "hooks",
          "mutators",
          "rolebindings",
          "roles",
          "silenced"
        ],
        "resource_names": null
      }
    ],
    "metadata": {
      "name": "namespaced-resources-all-verbs",
      "namespace": "development",
      "created_by": "admin"
    }
  },
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
      "name": "system:pipeline",
      "namespace": "development"
    }
  }
]
{{< /code >}}

{{% notice note %}}
**NOTE**: Read [API response filtering](../../#response-filtering) for more filter statement examples that demonstrate how to filter responses using different operators with label and field selectors.
{{% /notice %}}

### API Specification

/roles (GET) with response filters | 
---------------|------
description    | Returns the list of roles that match the [response filters][3] applied in the API request.
example url    | http://hostname:8080/api/core/v2/roles
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "rules": [
      {
        "verbs": [
          "get",
          "list",
          "create",
          "update",
          "delete"
        ],
        "resources": [
          "*"
        ],
        "resource_names": null
      }
    ],
    "metadata": {
      "name": "admin_role",
      "namespace": "development",
      "created_by": "admin"
    }
  },
  {
    "rules": [
      {
        "verbs": [
          "get",
          "list",
          "create",
          "update",
          "delete"
        ],
        "resources": [
          "assets",
          "checks",
          "entities",
          "events",
          "filters",
          "handlers",
          "hooks",
          "mutators",
          "rolebindings",
          "roles",
          "silenced"
        ],
        "resource_names": null
      }
    ],
    "metadata": {
      "name": "namespaced-resources-all-verbs",
      "namespace": "development",
      "created_by": "admin"
    }
  },
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
      "name": "system:pipeline",
      "namespace": "development"
    }
  }
]
{{< /code >}}


[1]: ../../../operations/control-access/rbac/#roles-and-cluster-roles
[2]: ../../#pagination
[3]: ../../#response-filtering
[4]: https://tools.ietf.org/html/rfc7396
