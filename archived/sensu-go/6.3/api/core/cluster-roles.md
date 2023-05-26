---
title: "core/v2/clusterroles"
description: "Read this API documentation for information about Sensu core/v2/clusterroles API endpoints, with examples for retrieving and managing cluster roles."
core_api_title: "core/v2/clusterroles"
type: "core_api"
version: "6.3"
product: "Sensu Go"
menu:
  sensu-go-6.3:
    parent: core
---

{{% notice note %}}
**NOTE**: Requests to `core/v2/clusterroles` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-auth-api-endpoints).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all cluster roles

The `/clusterroles` API endpoint provides HTTP GET access to [cluster role][1] data.

### Example {#clusterroles-get-example}

The following example demonstrates a request to the `/clusterroles` API endpoint, resulting in a JSON array that contains [cluster role definitions][1].

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/clusterroles \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
[
  {
    "rules": [
      {
        "verbs": [
          "*"
        ],
        "resources": [
          "assets",
          "checks",
          "entities",
          "extensions",
          "events",
          "filters",
          "handlers",
          "hooks",
          "mutators",
          "silenced",
          "roles",
          "rolebindings"
        ],
        "resource_names": null
      },
      {
        "verbs": [
          "get",
          "list"
        ],
        "resources": [
          "namespaces"
        ],
        "resource_names": null
      }
    ],
    "metadata": {
      "name": "admin"
    }
  },
  {
    "rules": [
      {
        "verbs": [
          "*"
        ],
        "resources": [
          "*"
        ],
        "resource_names": null
      }
    ],
    "metadata": {
      "name": "cluster-admin",
      "created_by": "admin"
    }
  }
]
{{< /code >}}

### API Specification {#clusterroles-get-specification}

/clusterroles (GET)  | 
---------------|------
description    | Returns the list of cluster roles.
example url    | http://hostname:8080/api/core/v2/clusterroles
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response filtering | This endpoint supports [API response filtering][3].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code shell >}}
[
  {
    "rules": [
      {
        "verbs": [
          "*"
        ],
        "resources": [
          "*"
        ],
        "resource_names": null
      }
    ],
    "metadata": {
      "name": "cluster-admin",
      "created_by": "admin"
    }
  }
]
{{< /code >}}

## Create a new cluster role

The `/clusterroles` API endpoint provides HTTP POST access to create a [cluster role][1].

### Example {#clusterroles-post-example}

In the following example, an HTTP POST request is submitted to the `/clusterroles` API endpoint to create a `global-event-reader` cluster role.
The request includes the cluster role definition in the request body and returns a successful HTTP `201 Created` response.

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "metadata": {
    "name": "global-event-reader"
  },
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
http://127.0.0.1:8080/api/core/v2/clusterroles

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#clusterroles-post-specification}

/clusterroles (POST) | 
----------------|------
description     | Creates a Sensu cluster role.
example URL     | http://hostname:8080/api/core/v2/clusterroles
payload         | {{< code shell >}}
{
  "metadata": {
    "name": "global-event-reader"
  },
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
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific cluster role {#clusterrolesclusterrole-get}

The `/clusterroles/:clusterrole` API endpoint provides HTTP GET access to [cluster role data][1] for specific `:clusterrole` definitions, by cluster role `name`.

### Example {#clusterrolesclusterrole-get-example}

In the following example, querying the `/clusterroles/:clusterrole` API endpoint returns a JSON map that contains the requested [`:clusterrole` definition][1] (in this example, for the `:clusterrole` named `global-event-reader`).

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/clusterroles/global-event-reader \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
{
  "metadata": {
    "name": "global-event-reader",
    "created_by": "admin"
  },
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

### API Specification {#clusterrolesclusterrole-get-specification}

/clusterroles/:clusterrole (GET) | 
---------------------|------
description          | Returns the specified cluster role.
example url          | http://hostname:8080/api/core/v2/clusterroles/global-event-reader
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code json >}}
{
  "metadata": {
    "name": "global-event-reader",
    "created_by": "admin"
  },
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

## Create or update a cluster role {#clusterrolesclusterrole-put}

The `/clusterroles/:clusterrole` API endpoint provides HTTP PUT access to create or update a cluster role, by cluster role name.

### Example {#clusterroles-clusterrole-put-example}

In the following example, an HTTP PUT request is submitted to the `/clusterroles/:clusterrole` API endpoint to update the `global-event-reader` cluster role by adding `"checks"` to the resources.
The request includes the cluster role definition in the request body and returns a successful HTTP `201 Created` response.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "metadata": {
    "name": "global-event-reader"
  },
  "rules": [
    {
      "verbs": [
        "get",
        "list"
      ],
      "resources": [
        "checks",
        "events"
      ],
      "resource_names": null
    }
  ]
}' \
http://127.0.0.1:8080/api/core/v2/clusterroles

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#clusterrolesclusterrole-put-specification}

/clusterroles/:clusterrole (PUT) | 
----------------|------
description     | Creates or updates the specified Sensu cluster role.
example URL     | http://hostname:8080/api/core/v2/clusterroles/global-event-reader
payload         | {{< code shell >}}
{
  "metadata": {
    "name": "global-event-reader"
  },
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
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Update a cluster role with PATCH

The `/clusterroles/:clusterrole` API endpoint provides HTTP PATCH access to update `:clusterrole` definitions, specified by cluster role name.

{{% notice note %}}
**NOTE**: You cannot change a resource's `name` or `namespace` with a PATCH request.
Use a [PUT request](#clusterrolesclusterrole-put) instead.<br><br>
Also, you cannot add elements to an array with a PATCH request &mdash; you must replace the entire array.
{{% /notice %}}

### Example

In the following example, an HTTP PATCH request is submitted to the `/clusterroles/:clusterrole` API endpoint to update the verbs array within the rules array for the `global-event-admin` cluster role, resulting in an HTTP `200 OK` response and the updated cluster role definition.

We support [JSON merge patches][4], so you must set the `Content-Type` header to `application/merge-patch+json` for PATCH requests.

{{< code shell >}}
curl -X PATCH \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/merge-patch+json' \
-d '{
  "rules": [
    {
      "verbs": [
        "*"
      ],
      "resources": [
        "events"
      ],
      "resource_names": null
    }
  ]
}' \
http://127.0.0.1:8080/api/core/v2/clusterroles/global-event-admin

HTTP/1.1 200 OK
{{< /code >}}

### API Specification

/clusterroles/:clusterrole (PATCH) | 
----------------|------
description     | Updates the specified Sensu cluster role.
example URL     | http://hostname:8080/api/core/v2/clusterroles/global-event-admin
payload         | {{< code shell >}}
{
  "rules": [
    {
      "verbs": [
        "*"
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

## Delete a cluster role {#clusterrolesclusterrole-delete}

The `/clusterroles/:clusterrole` API endpoint provides HTTP DELETE access to delete a cluster role from Sensu (specified by the cluster role name).

### Example {#clusterrolesclusterrole-delete-example}

The following example shows a request to the `/clusterroles/:clusterrole` API endpoint to delete the cluster role `global-event-reader`, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/clusterroles/global-event-reader

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification {#clusterrolesclusterrole-delete-specification}

/clusterroles/:clusterrole (DELETE) | 
--------------------------|------
description               | Removes a cluster role from Sensu (specified by the cluster role name).
example url               | http://hostname:8080/api/core/v2/clusterroles/global-event-reader
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a subset of cluster roles with response filtering

The `/clusterroles` API endpoint supports [response filtering][3] for a subset of cluster role data based on labels and the `clusterrole.name` field.

### Example

The following example demonstrates a request to the `/clusterroles` API endpoint with [response filtering][3], resulting in a JSON array that contains only [cluster role definitions][1] whose `clusterrole.name` includes `admin`.

{{< code shell >}}
curl -H "Authorization: Key $SENSU_API_KEY" http://127.0.0.1:8080/api/core/v2/clusterroles -G \
--data-urlencode 'fieldSelector=clusterrole.name matches "admin"'

HTTP/1.1 200 OK
[
  {
    "rules": [
      {
        "verbs": [
          "*"
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
          "silenced",
          "roles",
          "rolebindings"
        ],
        "resource_names": null
      },
      {
        "verbs": [
          "get",
          "list"
        ],
        "resources": [
          "namespaces"
        ],
        "resource_names": null
      }
    ],
    "metadata": {
      "name": "admin"
    }
  },
  {
    "rules": [
      {
        "verbs": [
          "*"
        ],
        "resources": [
          "*"
        ],
        "resource_names": null
      }
    ],
    "metadata": {
      "name": "cluster-admin"
    }
  }
]
{{< /code >}}

{{% notice note %}}
**NOTE**: Read [API response filtering](../../#response-filtering) for more filter statement examples that demonstrate how to filter responses using different operators with label and field selectors.
{{% /notice %}}

### API Specification

/clusterroles (GET) with response filters | 
---------------|------
description    | Returns the list of cluster roles that match the [response filters][3] applied in the API request.
example url    | http://hostname:8080/api/core/v2/clusterroles
pagination     | This endpoint supports [pagination][4] using the `limit` and `continue` query parameters.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code shell >}}
[
  {
    "rules": [
      {
        "verbs": [
          "*"
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
          "silenced",
          "roles",
          "rolebindings"
        ],
        "resource_names": null
      },
      {
        "verbs": [
          "get",
          "list"
        ],
        "resources": [
          "namespaces"
        ],
        "resource_names": null
      }
    ],
    "metadata": {
      "name": "admin"
    }
  },
  {
    "rules": [
      {
        "verbs": [
          "*"
        ],
        "resources": [
          "*"
        ],
        "resource_names": null
      }
    ],
    "metadata": {
      "name": "cluster-admin"
    }
  }
]
{{< /code >}}


[1]: ../../../operations/control-access/rbac/
[2]: ../../#pagination
[3]: ../../#response-filtering
[4]: https://tools.ietf.org/html/rfc7396
