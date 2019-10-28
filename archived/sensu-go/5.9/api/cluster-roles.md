---
title: "Cluster roles API"
linkTitle: "Cluster Roles API"
description: "The cluster role API provides HTTP access to cluster role data. Here’s a reference for the cluster roles API in Sensu Go, including examples for returning lists of cluster roles, creating Sensu cluster roles, and more. Read on for the full reference."
version: "5.9"
product: "Sensu Go"
menu:
  sensu-go-5.9:
    parent: api
---

- [The `/clusterroles` API endpoint](#the-clusterroles-api-endpoint)
	- [`/clusterroles` (GET)](#clusterroles-get)
	- [`/clusterroles` (POST)](#clusterroles-post)
- [The `/clusterroles/:clusterrole` API endpoint](#the-clusterrolesclusterrole-api-endpoint)
	- [`/clusterroles/:clusterrole` (GET)](#clusterrolesclusterrole-get)
  - [`/clusterroles/:clusterrole` (PUT)](#clusterrolescluster-put)
  - [`/clusterroles/:clusterrole` (DELETE)](#clusterrolesclusterrole-delete)

## The `/clusterroles` API endpoint

### `/clusterroles` (GET)

The `/clusterroles` API endpoint provides HTTP GET access to [cluster role][1] data.

#### EXAMPLE {#clusterroles-get-example}

The following example demonstrates a request to the `/clusterroles` API, resulting in
a JSON Array containing [cluster role definitions][1].

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/clusterroles -H "Authorization: Bearer $SENSU_TOKEN"

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
pagination     | This endpoint supports pagination using the `limit` and `continue` query parameters. See the [API overview](../overview#pagination) for details.
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

/clusterroles (POST) | 
----------------|------
description     | Create a Sensu cluster role.
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
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/clusterroles/:clusterrole` API endpoint {#the-clusterrolesclusterrole-api-endpoint}

### `/clusterroles/:clusterrole` (GET) {#clusterrolesclusterrole-get}

The `/clusterroles/:clusterrole` API endpoint provides HTTP GET access to [cluster role data][1] for specific `:clusterrole` definitions, by cluster role `name`.

#### EXAMPLE {#clusterrolesclusterrole-get-example}

In the following example, querying the `/clusterroles/:clusterrole` API returns a JSON Map
containing the requested [`:clusterrole` definition][1] (in this example: for the `:clusterrole` named
`global-event-reader`).

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/clusterroles/global-event-reader -H "Authorization: Bearer $SENSU_TOKEN"

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
description          | Returns a cluster role.
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

#### API Specification {#clusterrolesclusterrole-put-specification}

/clusterroles/:clusterrole (PUT) | 
----------------|------
description     | Create or update a Sensu cluster role.
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

The `/clusterroles/:clusterrole` API endpoint provides HTTP DELETE access to delete a cluster role from Sensu given the cluster role name.

### EXAMPLE {#clusterrolesclusterrole-delete-example}
The following example shows a request to delete the cluster role `global-event-reader`, resulting in a successful HTTP 204 No Content response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_TOKEN" \
http://127.0.0.1:8080/api/core/v2/clusterroles/global-event-reader

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#clusterrolesclusterrole-delete-specification}

/clusterroles/:clusterrole (DELETE) | 
--------------------------|------
description               | Removes a cluster role from Sensu given the cluster role name.
example url               | http://hostname:8080/api/core/v2/clusterroles/global-event-reader
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/rbac
