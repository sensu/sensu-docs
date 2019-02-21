---
title: "Cluster role bindings API"
linktitle: "Cluster Role Bindings API"
description: "Sensu Go cluster role bindings API reference documentation"
version: "5.1"
product: "Sensu Go"
menu:
  sensu-go-5.1:
    parent: api
---

- [The `/clusterrolebindings` API endpoint](#the-clusterrolebindings-api-endpoint)
	- [`/clusterrolebindings` (GET)](#clusterrolebindings-get)
	- [`/clusterrolebindings` (POST)](#clusterrolebindings-post)
- [The `/clusterrolebindings/:clusterrolebinding` API endpoint](#the-clusterrolebindingsclusterrolebinding-api-endpoint)
	- [`/clusterrolebindings/:clusterrolebinding` (GET)](#clusterrolebindingsclusterrolebinding-get)
  - [`/clusterrolebindings/:clusterrolebinding` (PUT)](#clusterrolebindingsclusterrolebinding-put)
	- [`/clusterrolebindings/:clusterrolebinding` (DELETE)](#clusterrolebindingsclusterrolebinding-delete)

## The `/clusterrolebindings` API endpoint

### `/clusterrolebindings` (GET)

The `/clusterrolebindings` API endpoint provides HTTP GET access to [cluster role binding][1] data.

#### EXAMPLE {#clusterrolebindings-get-example}

The following example demonstrates a request to the `/clusterrolebindings` API, resulting in
a JSON Array containing [cluster role binding definitions][1].

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/clusterrolebindings -H "Authorization: Bearer TOKEN"
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
      "name": "cluster-admin"
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
{{< /highlight >}}

#### API Specification {#clusterrolebindings-get-specification}

/clusterrolebindings (GET)  | 
---------------|------
description    | Returns the list of cluster role bindings.
example url    | http://hostname:8080/api/core/v2/clusterrolebindings
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
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
      "name": "cluster-admin"
    }
  }
]
{{< /highlight >}}

### `/clusterrolebindings` (POST)

The `/clusterrolebindings` API endpoint provides HTTP POST access to create a [cluster role binding][1].

#### EXAMPLE {#clusterrolebindings-post-example}

In the following example, an HTTP POST request is submitted to the `/clusterrolebindings` API to create a cluster role binding that assigns the `cluster-admin` cluster role to the user `bob`.
The request includes the cluster role binding definition in the request body and returns a successful HTTP 200 OK response and the created cluster role binding definition.

{{< highlight shell >}}
curl -X POST \
-H "Authorization: Bearer TOKEN" \
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
    "name": "bob-binder"
  }
}
{{< /highlight >}}

#### API Specification {#clusterrolebindings-post-specification}

/clusterrolebindings (POST) | 
----------------|------
description     | Create a Sensu cluster role binding.
example URL     | http://hostname:8080/api/core/v2/clusterrolebindings
payload         | {{< highlight shell >}}
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
{{< /highlight >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/clusterrolebindings/:clusterrolebinding` API endpoint {#the-clusterrolebindingsclusterrolebinding-api-endpoint}

### `/clusterrolebindings/:clusterrolebinding` (GET) {#clusterrolebindingsclusterrolebinding-get}

The `/clusterrolebindings/:clusterrolebinding` API endpoint provides HTTP GET access to [cluster role binding data][1] for specific `:clusterrolebinding` definitions, by cluster role binding `name`.

#### EXAMPLE {#clusterrolebindingsclusterrolebinding-get-example}

In the following example, querying the `/clusterrolebindings/:clusterrolebinding` API returns a JSON Map
containing the requested [`:clusterrolebinding` definition][1] (in this example: for the `:clusterrolebinding` named
`bob-binder`).

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/clusterrolebindings/bob-binder -H "Authorization: Bearer TOKEN"

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
    "name": "bob-binder"
  }
}
{{< /highlight >}}

#### API Specification {#clusterrolebindingsclusterrolebinding-get-specification}

/clusterrolebindings/:clusterrolebinding (GET) | 
---------------------|------
description          | Returns a cluster role binding.
example url          | http://hostname:8080/api/core/v2/clusterrolebindings/bob-binder
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
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
{{< /highlight >}}

### `/clusterrolebindings/:clusterrolebinding` (PUT) {#clusterrolebindingsclusterrolebinding-put}

The `/clusterrolebindings/:clusterrolebinding` API endpoint provides HTTP PUT access to create or update a [cluster role binding][1], by cluster role binding `name`.

#### EXAMPLE {#clusterrolebindingsclusterrolebinding-put-example}

In the following example, an HTTP PUT request is submitted to the `/clusterrolebindings/:clusterrolebinding` API to create a cluster role binding that assigns the `cluster-admin` cluster role to users in the group `ops`.
The request includes the cluster role binding definition in the request body and returns a successful HTTP 200 OK response and the created cluster role binding definition.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer TOKEN" \
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

HTTP/1.1 200 OK
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
{{< /highlight >}}

#### API Specification {#clusterrolebindingsclusterrolebinding-put-specification}

/clusterrolebindings/:clusterrolebinding (PUT) | 
----------------|------
description     | Create or update a Sensu cluster role binding.
example URL     | http://hostname:8080/api/core/v2/clusterrolebindings/ops-group-binder
payload         | {{< highlight shell >}}
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
{{< /highlight >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/clusterrolebindings/:clusterrolebinding` (DELETE) {#clusterrolebindingsclusterrolebinding-delete}

#### API Specification {#clusterrolebindingsclusterrolebinding-delete-specification}

/clusterrolebindings/:clusterrolebinding (DELETE) | 
--------------------------|------
description               | Removes a cluster role binding from Sensu given the cluster role binding name.
example url               | http://hostname:8080/api/core/v2/clusterrolebindings/bob-binder
response codes            | <ul><li>**Success**: 202 (Accepted)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/rbac
