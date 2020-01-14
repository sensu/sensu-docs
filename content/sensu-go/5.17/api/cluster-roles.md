---
title: "Cluster roles API"
linkTitle: "Cluster Roles API"
description: "The Sensu cluster roles API provides HTTP access to cluster role data. This reference includes examples for returning lists of cluster roles, creating Sensu cluster roles, and more. Read on for the full reference."
version: "5.17"
product: "Sensu Go"
menu:
  sensu-go-5.17:
    parent: api
---

- [The `/clusterroles` API endpoint](#the-clusterroles-api-endpoint)
	- [`/clusterroles` (GET)](#clusterroles-get)
	- [`/clusterroles` (POST)](#clusterroles-post)
- [The `/clusterroles/:clusterrole` API endpoint](#the-clusterrolesclusterrole-api-endpoint)
	- [`/clusterroles/:clusterrole` (GET)](#clusterrolesclusterrole-get)
  - [`/clusterroles/:clusterrole` (PUT)](#clusterrolesclusterrole-put)
  - [`/clusterroles/:clusterrole` (DELETE)](#clusterrolesclusterrole-delete)

## The `/clusterroles` API endpoint

### `/clusterroles` (GET)

The `/clusterroles` API endpoint provides HTTP GET access to [cluster role][1] data.

#### EXAMPLE {#clusterroles-get-example}

The following example demonstrates a request to the `/clusterroles` API endpoint, resulting in a JSON array that contains [cluster role definitions][1].

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/clusterroles \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

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
      "name": "cluster-admin"
    }
  }
]
{{< /highlight >}}

#### API Specification {#clusterroles-get-specification}

/clusterroles (GET)  | 
---------------|------
description    | Returns the list of cluster roles.
example url    | http://hostname:8080/api/core/v2/clusterroles
pagination     | This endpoint supports pagination using the `limit` and `continue` query parameters. See the [API overview][2] for details.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
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
      "name": "cluster-admin"
    }
  }
]
{{< /highlight >}}

### `/clusterroles` (POST)

The `/clusterroles` API endpoint provides HTTP POST access to create a [cluster role][1].

#### EXAMPLE {#clusterroles-post-example}

In the following example, an HTTP POST request is submitted to the `/clusterroles` API endpoint to create a `global-event-reader` cluster role.
The request includes the cluster role definition in the request body and returns a successful HTTP `201 Created` response.

{{< highlight shell >}}
curl -X POST \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
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
{{< /highlight >}}

#### API Specification {#clusterroles-post-specification}

/clusterroles (POST) | 
----------------|------
description     | Creates a Sensu cluster role.
example URL     | http://hostname:8080/api/core/v2/clusterroles
payload         | {{< highlight shell >}}
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
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/clusterroles/:clusterrole` API endpoint {#the-clusterrolesclusterrole-api-endpoint}

### `/clusterroles/:clusterrole` (GET) {#clusterrolesclusterrole-get}

The `/clusterroles/:clusterrole` API endpoint provides HTTP GET access to [cluster role data][1] for specific `:clusterrole` definitions, by cluster role `name`.

#### EXAMPLE {#clusterrolesclusterrole-get-example}

In the following example, querying the `/clusterroles/:clusterrole` API endpoint returns a JSON map that contains the requested [`:clusterrole` definition][1] (in this example, for the `:clusterrole` named `global-event-reader`).

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/clusterroles/global-event-reader \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 200 OK
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
{{< /highlight >}}

#### API Specification {#clusterrolesclusterrole-get-specification}

/clusterroles/:clusterrole (GET) | 
---------------------|------
description          | Returns the specified cluster role.
example url          | http://hostname:8080/api/core/v2/clusterroles/global-event-reader
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
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
{{< /highlight >}}

### `/clusterroles/:clusterrole` (PUT) {#clusterrolesclusterrole-put}

The `/clusterroles/:clusterrole` API endpoint provides HTTP PUT access to create or update a cluster role, by cluster role name.

#### EXAMPLE {#clusterroles-clusterrole-put-example}

In the following example, an HTTP PUT request is submitted to the `/clusterroles/:clusterrole` API endpoint to update the `global-event-reader` cluster role by adding `"checks"` to the resources.
The request includes the cluster role definition in the request body and returns a successful HTTP `201 Created` response.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
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
{{< /highlight >}}

#### API Specification {#clusterrolesclusterrole-put-specification}

/clusterroles/:clusterrole (PUT) | 
----------------|------
description     | Creates or updates the specified Sensu cluster role.
example URL     | http://hostname:8080/api/core/v2/clusterroles/global-event-reader
payload         | {{< highlight shell >}}
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
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/clusterroles/:clusterrole` (DELETE) {#clusterrolesclusterrole-delete}

The `/clusterroles/:clusterrole` API endpoint provides HTTP DELETE access to delete a cluster role from Sensu (specified by the cluster role name).

#### EXAMPLE {#clusterrolesclusterrole-delete-example}

The following example shows a request to the `/clusterroles/:clusterrole` API endpoint to delete the cluster role `global-event-reader`, resulting in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
http://127.0.0.1:8080/api/core/v2/clusterroles/global-event-reader

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#clusterrolesclusterrole-delete-specification}

/clusterroles/:clusterrole (DELETE) | 
--------------------------|------
description               | Removes a cluster role from Sensu (specified by the cluster role name).
example url               | http://hostname:8080/api/core/v2/clusterroles/global-event-reader
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/rbac/
[2]: ../overview#pagination
