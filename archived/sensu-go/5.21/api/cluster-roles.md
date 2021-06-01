---
title: "Cluster roles API"
linkTitle: "Cluster Roles API"
description: "The Sensu cluster roles API provides HTTP access to cluster role data. This reference includes examples for returning lists of cluster roles, creating Sensu cluster roles, and more. Read on for the full reference."
api_title: "Cluster roles API"
type: "api"
version: "5.21"
product: "Sensu Go"
menu:
  sensu-go-5.21:
    parent: api
---

{{% notice note %}}
**NOTE**: Requests to the cluster roles API require you to authenticate with a Sensu [access token](../#authenticate-with-the-authentication-api) or [API key](../#authenticate-with-an-api-key).
The code examples in this document use the [environment variable](../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests. 
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

[1]: ../../reference/rbac/
[2]: ../#pagination
[3]: ../#response-filtering
