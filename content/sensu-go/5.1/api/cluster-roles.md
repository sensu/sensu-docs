---
title: "Cluster roles API"
linkTitle: "Cluster Roles API"
description: "Sensu Go cluster roles API reference documentation"
version: "5.1"
product: "Sensu Go"
menu:
  sensu-go-5.1:
    parent: api
---

- [The `/cluster-roles` API endpoint](#the-cluster-roles-api-endpoint)
	- [`/cluster-roles` (GET)](#cluster-roles-get)
	- [`/cluster-roles` (POST)](#cluster-roles-post)
- [The `/cluster-roles/:cluster-role` API endpoint](#the-cluster-rolescluster-role-api-endpoint)
	- [`/cluster-roles/:cluster-role` (GET)](#cluster-rolescluster-role-get)
  - [`/cluster-roles/:cluster-role` (PUT)](#cluster-rolescluster-put)
  - [`/cluster-roles/:cluster-role` (DELETE)](#cluster-rolescluster-role-delete)

## The `/cluster-roles` API endpoint

### `/cluster-roles` (GET)

The `/cluster-roles` API endpoint provides HTTP GET access to [cluster role][1] data.

#### EXAMPLE {#cluster-roles-get-example}

The following example demonstrates a request to the `/cluster-roles` API, resulting in
a JSON Array containing [cluster role definitions][1].

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/cluster-roles -H "Authorization: Bearer TOKEN"
[
  {
    "name": "global-event-reader",
    "rules": [
      {
        "verbs": [
          "get",
          "list"
        ],
        "resources": [
          "events"
        ],
        "resourceNames": [
          ""
        ]
      }
    ]
  }
]
{{< /highlight >}}

#### API Specification {#cluster-roles-get-specification}

/cluster-roles (GET)  | 
---------------|------
description    | Returns the list of cluster roles.
example url    | http://hostname:8080/api/core/v2/cluster-roles
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "name": "global-event-reader",
    "rules": [
      {
        "verbs": [
          "get",
          "list"
        ],
        "resources": [
          "events"
        ],
        "resourceNames": [
          ""
        ]
      }
    ]
  }
]
{{< /highlight >}}

### `/cluster-roles` (POST)

/cluster-roles (POST) | 
----------------|------
description     | Create a Sensu cluster role.
example URL     | http://hostname:8080/api/core/v2/cluster-roles/default/cluster-roles
payload         | {{< highlight shell >}}
{
  "name": "global-event-reader",
  "rules": [
    {
      "verbs": [
        "get",
        "list"
      ],
      "resources": [
        "events"
      ],
      "resourceNames": [
        ""
      ]
    }
  ]
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/cluster-roles/:cluster-role` API endpoint {#the-cluster-rolescluster-role-api-endpoint}

### `/cluster-roles/:cluster-role` (GET) {#cluster-rolescluster-role-get}

The `/cluster-roles/:cluster-role` API endpoint provides HTTP GET access to [cluster-role data][1] for specific `:cluster-role` definitions, by cluster-role `name`.

#### EXAMPLE {#cluster-rolescluster-role-get-example}

In the following example, querying the `/cluster-roles/:cluster-role` API returns a JSON Map
containing the requested [`:cluster-role` definition][1] (in this example: for the `:cluster-role` named
`global-event-reader`).

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/cluster-roles/global-event-reader -H "Authorization: Bearer TOKEN"
{
  "name": "global-event-reader",
  "rules": [
    {
      "verbs": [
        "get",
        "list"
      ],
      "resources": [
        "events"
      ],
      "resourceNames": [
        ""
      ]
    }
  ]
}
{{< /highlight >}}

#### API Specification {#cluster-rolescluster-role-get-specification}

/cluster-roles/:cluster-role (GET) | 
---------------------|------
description          | Returns a cluster role.
example url          | http://hostname:8080/api/core/v2/cluster-roles/global-event-reader
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "name": "global-event-reader",
  "rules": [
    {
      "verbs": [
        "get",
        "list"
      ],
      "resources": [
        "events"
      ],
      "resourceNames": [
        ""
      ]
    }
  ]
}
{{< /highlight >}}

### `/cluster-roles/:cluster-role` (PUT) {#cluster-rolescluster-role-put}

#### API Specification {#cluster-rolescluster-role-put-specification}

/cluster-roles/:cluster-role (PUT) | 
----------------|------
description     | Create or update a Sensu cluster role.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/cluster-roles/global-event-reader
payload         | {{< highlight shell >}}
{
  "name": "global-event-reader",
  "rules": [
    {
      "verbs": [
        "get",
        "list"
      ],
      "resources": [
        "events"
      ],
      "resourceNames": [
        ""
      ]
    }
  ]
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/cluster-roles/:cluster-role` (DELETE) {#cluster-rolescluster-role-delete}

#### API Specification {#cluster-rolescluster-role-delete-specification}

/cluster-roles/:cluster-role (DELETE) | 
--------------------------|------
description               | Removes a cluster role from Sensu given the cluster role name.
example url               | http://hostname:8080/api/core/v2/namespaces/default/cluster-roles/global-event-reader
response codes            | <ul><li>**Success**: 202 (Accepted)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/rbac

