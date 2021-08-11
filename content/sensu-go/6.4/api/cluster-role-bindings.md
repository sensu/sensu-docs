---
title: "Cluster role bindings API"
linktitle: "Cluster Role Bindings API"
description: "The Sensu cluster role bindings API provides HTTP access to cluster role binding data. This reference includes examples for returning lists of cluster role bindings, creating Sensu cluster role bindings, and more. Read on for the full reference."
api_title: "Cluster role bindings API"
type: "api"
version: "6.4"
product: "Sensu Go"
menu:
  sensu-go-6.4:
    parent: api
---

{{% notice note %}}
**NOTE**: Requests to the cluster role bindings API require you to authenticate with a Sensu [API key](../#configure-an-environment-variable-for-api-key-authentication) or [access token](../#authenticate-with-the-authentication-api).
The code examples in this document use the [environment variable](../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all cluster role bindings

The `/clusterrolebindings` API endpoint provides HTTP GET access to [cluster role binding][1] data.

### Example {#clusterrolebindings-get-example}

The following example demonstrates a request to the `/clusterrolebindings` API endpoint, resulting in a JSON array that contains [cluster role binding definitions][1].

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/clusterrolebindings \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
[
  {
    "subjects": [
      {
        "type": "Group",
        "name": "cluster-admins"
      }
    ],
    "role_ref": {
      "type": "ClusterRole",
      "name": "cluster-admin"
    },
    "metadata": {
      "name": "cluster-admin",
      "created_by": "admin"
    }
  },
  {
    "subjects": [
      {
        "type": "Group",
        "name": "system:agents"
      }
    ],
    "role_ref": {
      "type": "ClusterRole",
      "name": "system:agent"
    },
    "metadata": {
      "name": "system:agent",
      "created_by": "admin"
    }
  }
]
{{< /code >}}

### API Specification {#clusterrolebindings-get-specification}

/clusterrolebindings (GET)  | 
---------------|------
description    | Returns the list of cluster role bindings.
example url    | http://hostname:8080/api/core/v2/clusterrolebindings
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
        "name": "cluster-admins"
      }
    ],
    "role_ref": {
      "type": "ClusterRole",
      "name": "cluster-admin"
    },
    "metadata": {
      "name": "cluster-admin",
      "created_by": "admin"
    }
  },
  {
    "subjects": [
      {
        "type": "Group",
        "name": "system:agents"
      }
    ],
    "role_ref": {
      "type": "ClusterRole",
      "name": "system:agent"
    },
    "metadata": {
      "name": "system:agent"
    }
  }
]
{{< /code >}}

## Create a new cluster role binding

The `/clusterrolebindings` API endpoint provides HTTP POST access to create a [cluster role binding][1].

### Example {#clusterrolebindings-post-example}

In the following example, an HTTP POST request is submitted to the `/clusterrolebindings` API endpoint to create a cluster role binding that assigns the `cluster-admin` cluster role to the user `bob`.
The request includes the cluster role binding definition in the request body and returns a successful HTTP `200 OK` response and the created cluster role binding definition.

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "subjects": [
    {
      "type": "User",
      "name": "bob"
    }
  ],
  "role_ref": {
    "type": "ClusterRole",
    "name": "cluster-admin"
  },
  "metadata": {
    "name": "bob-binder"
  }
}' \
http://127.0.0.1:8080/api/core/v2/clusterrolebindings

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#clusterrolebindings-post-specification}

/clusterrolebindings (POST) | 
----------------|------
description     | Creates a Sensu cluster role binding.
example URL     | http://hostname:8080/api/core/v2/clusterrolebindings
payload         | {{< code shell >}}
{
  "subjects": [
    {
      "type": "User",
      "name": "bob"
    }
  ],
  "role_ref": {
    "type": "ClusterRole",
    "name": "cluster-admin"
  },
  "metadata": {
    "name": "bob-binder"
  }
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific cluster role binding {#clusterrolebindingsclusterrolebinding-get}

The `/clusterrolebindings/:clusterrolebinding` API endpoint provides HTTP GET access to [cluster role binding data][1] for specific `:clusterrolebinding` definitions, by cluster role binding `name`.

### Example {#clusterrolebindingsclusterrolebinding-get-example}

In the following example, querying the `/clusterrolebindings/:clusterrolebinding` API endpoint returns a JSON map that contains the requested [`:clusterrolebinding` definition][1] (in this example, for the `:clusterrolebinding` named `bob-binder`).

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/clusterrolebindings/bob-binder \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
{
  "subjects": [
    {
      "type": "User",
      "name": "bob"
    }
  ],
  "role_ref": {
    "type": "ClusterRole",
    "name": "cluster-admin"
  },
  "metadata": {
    "name": "bob-binder",
    "created_by": "admin"
  }
}
{{< /code >}}

### API Specification {#clusterrolebindingsclusterrolebinding-get-specification}

/clusterrolebindings/:clusterrolebinding (GET) | 
---------------------|------
description          | Returns the specified cluster role binding.
example url          | http://hostname:8080/api/core/v2/clusterrolebindings/bob-binder
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code json >}}
{
  "subjects": [
    {
      "type": "User",
      "name": "bob"
    }
  ],
  "role_ref": {
    "type": "ClusterRole",
    "name": "cluster-admin"
  },
  "metadata": {
    "name": "bob-binder",
    "created_by": "admin"
  }
}
{{< /code >}}

## Create or update a cluster role binding {#clusterrolebindingsclusterrolebinding-put}

The `/clusterrolebindings/:clusterrolebinding` API endpoint provides HTTP PUT access to create or update a [cluster role binding][1], by cluster role binding `name`.

### Example {#clusterrolebindingsclusterrolebinding-put-example}

In the following example, an HTTP PUT request is submitted to the `/clusterrolebindings/:clusterrolebinding` API endpoint to create a cluster role binding that assigns the `cluster-admin` cluster role to users in the group `ops`.
The request includes the cluster role binding definition in the request body and returns a successful HTTP `200 OK` response and the created cluster role binding definition.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "subjects": [
    {
      "type": "Group",
      "name": "ops"
    }
  ],
  "role_ref": {
    "type": "ClusterRole",
    "name": "cluster-admin"
  },
  "metadata": {
    "name": "ops-group-binder"
  }
}' \
http://127.0.0.1:8080/api/core/v2/clusterrolebindings/ops-group-binder

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#clusterrolebindingsclusterrolebinding-put-specification}

/clusterrolebindings/:clusterrolebinding (PUT) | 
----------------|------
description     | Creates or updates the specified Sensu cluster role binding.
example URL     | http://hostname:8080/api/core/v2/clusterrolebindings/ops-group-binder
payload         | {{< code shell >}}
{
  "subjects": [
    {
      "type": "Group",
      "name": "ops"
    }
  ],
  "role_ref": {
    "type": "ClusterRole",
    "name": "cluster-admin"
  },
  "metadata": {
    "name": "ops-group-binder"
  }
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Update a cluster role binding with PATCH

The `/clusterrolebindings/:clusterrolebinding` API endpoint provides HTTP PATCH access to update `:clusterrolebinding` definitions, specified by cluster role binding name.

{{% notice note %}}
**NOTE**: You cannot change a resource's `name` or `namespace` with a PATCH request.
Use a [PUT request](#clusterrolebindingsclusterrolebinding-put) instead.<br><br>
Also, you cannot add elements to an array with a PATCH request &mdash; you must replace the entire array.
{{% /notice %}}

### Example

In the following example, an HTTP PATCH request is submitted to the `/clusterrolebindings/:clusterrolebinding` API endpoint to update the subjects array for the `ops-group-binder` cluster role binding, resulting in an HTTP `200 OK` response and the updated cluster role binding definition.

We support [JSON merge patches][4], so you must set the `Content-Type` header to `application/merge-patch+json` for PATCH requests.

{{< code shell >}}
curl -X PATCH \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/merge-patch+json' \
-d '{
  "subjects": [
    {
      "type": "Group",
      "name": "ops_team_1"
    },
    {
      "type": "Group",
      "name": "ops_team_2"
    }
  ]
}' \
http://127.0.0.1:8080/api/core/v2/clusterrolebindings/ops-group-binder

HTTP/1.1 200 OK
{{< /code >}}

### API Specification

/clusterrolebindings/:clusterrolebinding (PATCH) | 
----------------|------
description     | Updates the specified Sensu cluster role binding.
example URL     | http://hostname:8080/api/core/v2/clusterrolebindings/ops-group-binder
payload         | {{< code shell >}}
{
  "subjects": [
    {
      "type": "Group",
      "name": "ops_team_1"
    },
    {
      "type": "Group",
      "name": "ops_team_2"
    }
  ]
}
{{< /code >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a cluster role binding {#clusterrolebindingsclusterrolebinding-delete}

The `/clusterrolebindings/:clusterrolebinding` API endpoint provides HTTP DELETE access to delete a cluster role binding from Sensu (specified by the cluster role binding name).

### Example {#clusterrolebindingsclusterrolebinding-delete-example}

The following example shows a request to the `/clusterrolebindings/:clusterrolebinding` API endpoint to delete the cluster role binding `ops-binding`, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/clusterrolebindings/ops-binding

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification {#clusterrolebindingsclusterrolebinding-delete-specification}

/clusterrolebindings/:clusterrolebinding (DELETE) | 
--------------------------|------
description               | Removes a cluster role binding from Sensu (specified by the cluster role binding name).
example url               | http://hostname:8080/api/core/v2/clusterrolebindings/ops-binding
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../../operations/control-access/rbac/
[2]: ../#pagination
[3]: ../#response-filtering
[4]: https://tools.ietf.org/html/rfc7396
