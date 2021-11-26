---
title: "Cluster API"
description: "The Sensu cluster API endpoint provides HTTP access to Sensu cluster data. This reference includes examples for returning the cluster definition, creating a cluster member, and more. Read on for the full reference."
api_title: "Cluster API"
type: "api"
version: "6.2"
product: "Sensu Go"
menu:
  sensu-go-6.2:
    parent: api
---

{{% notice note %}}
**NOTE**: Requests to the cluster API require you to authenticate with a Sensu [API key](../#configure-an-environment-variable-for-api-key-authentication) or [access token](../#authenticate-with-the-authentication-api).
The code examples in this document use the [environment variable](../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all cluster data {#clustermembers-get}

The `/cluster/members` API endpoint provides HTTP GET access to Sensu [cluster][1] data.

### Example {#clustermembers-get-example}

The following example demonstrates a request to the `/cluster/members` API endpoint, resulting in a JSON map that contains a Sensu cluster definition.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/cluster/members \
-H "Authorization: Key $SENSU_API_KEY" \

HTTP/1.1 200 OK
{
  "header": {
    "cluster_id": 4255616304056076734,
    "member_id": 9882886658148554927,
    "raft_term": 2
  },
  "members": [
    {
      "ID": 9882886658148554927,
      "name": "default",
      "peerURLs": [
        "http://127.0.0.1:2380"
      ],
      "clientURLs": [
        "http://127.0.0.1:2379"
      ]
    }
  ]
}
{{< /code >}}

### API Specification {#clustermembers-get-specification}

/cluster/members (GET)  | 
------------------------|------
description             | Returns the etcd cluster definition.
example url             | http://hostname:8080/api/core/v2/cluster/members
query parameters        | `timeout`: Defines the timeout when querying etcd. Default is `3`.
response type           | Map
response codes          | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
example output          | {{< code shell >}}
{
  "header": {
    "cluster_id": 4255616304056076734,
    "member_id": 9882886658148554927,
    "raft_term": 2
  },
  "members": [
    {
      "ID": 9882886658148554927,
      "name": "default",
      "peerURLs": [
        "http://127.0.0.1:2380"
      ],
      "clientURLs": [
        "http://127.0.0.1:2379"
      ]
    }
  ]
}
{{< /code >}}

## Create a new cluster member {#clustermembers-post}

The `/cluster/members` API endpoint provides HTTP POST access to create a Sensu cluster member.

### Example {#clustermembers-post-example}

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/cluster/members?peer-addrs=http://127.0.0.1:2380

HTTP/1.1 200 OK
{
  "header": {
    "cluster_id": 4255616304056077000,
    "member_id": 9882886658148555000,
    "raft_term": 2
  },
  "members": [
    {
      "ID": 9882886658148555000,
      "name": "default",
      "peerURLs": [
        "http://127.0.0.1:2380"
      ],
      "clientURLs": [
        "http://localhost:2379"
      ]
    }
  ]
}
{{< /code >}}

### API Specification {#clustermembers-post-specification}

/cluster/members/:member (POST) | 
----------------|------
description     | Creates a cluster member.
example url     | http://hostname:8080/api/core/v2/cluster/members?peer-addrs=http://127.0.0.1:2380
query parameters| <ul><li>Required: `peer-addrs` (a comma-delimited list of peer addresses).</li></ul>
response codes   | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Create or update a cluster member {#clustermembersmember-put}

The `/cluster/members/:member` API endpoint provides HTTP PUT access to create or update a cluster member, by cluster member ID.

### Example {#clustermembersmember-put-example}

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/cluster/members/8927110dc66458af?peer-addrs=http://127.0.0.1:2380

HTTP/1.1 200 OK
{
  "header": {
    "cluster_id": 4255616304056077000,
    "member_id": 9882886658148555000,
    "raft_term": 2
  },
  "members": [
    {
      "ID": 9882886658148555000,
      "name": "default",
      "peerURLs": [
        "http://127.0.0.1:2380"
      ],
      "clientURLs": [
        "http://localhost:2379"
      ]
    }
  ]
}
{{< /code >}}

### API Specification {#clustermembersmember-put-specification}

/cluster/members/:member (PUT) | 
----------------|------
description     | Creates or updates a cluster member.
example url     | http://hostname:8080/api/core/v2/cluster/members/8927110dc66458af?peer-addrs=http://127.0.0.1:2380
url parameters  | Required: `8927110dc66458af` (hex-encoded uint64 cluster member ID generated using `sensuctl cluster member-list`).
query parameters| Required: `peer-addrs` (a comma-delimited list of peer addresses).</li></ul>
response codes   | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a cluster member {#clustermembersmember-delete}

The `/cluster/members/:member` API endpoint provides HTTP DELETE access to remove a Sensu cluster member.

### Example {#clustermembersmember-delete-example}

The following example shows a request to the `/cluster/members/:member` API endpoint to remove the Sensu cluster member with the ID `8927110dc66458af`, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/cluster/members/8927110dc66458af

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification {#clustermembersmember-delete-specification}

/cluster/members/:member (DELETE) | 
--------------------------|------
description               | Removes a member from a Sensu cluster (specified by the member ID).
example url               | http://hostname:8080/api/core/v2/cluster/members/8927110dc66458af
url parameters            | <ul><li>`8927110dc66458af` (required): Required hex-encoded uint64 cluster member ID generated using `sensuctl cluster member-list`</li></ul>
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a cluster ID {#clusterid-get}

The `/cluster/id` API endpoint provides HTTP GET access to the Sensu cluster ID.

### Example {#clusterid-get-example}

The following example demonstrates a request to the `/cluster/id` API endpoint, resulting in a string that contains the Sensu cluster ID.

{{< code shell >}}
curl -X GET \
 -H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/cluster/id

HTTP/1.1 200 OK
"23481e76-5844-4d07-b714-6e2ffbbf9315"
{{< /code >}}

### API Specification {#clusterid-get-specification}

/cluster/id (GET) | |
------------------|------
description       | Returns the unique Sensu cluster ID.
example url       | http://hostname:8080/api/core/v2/cluster/id
query parameters  | `timeout`: Defines the timeout when querying etcd. Default is `3`.
response type     | String
response codes    | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
example output    | {{< code shell >}}
"23481e76-5844-4d07-b714-6e2ffbbf9315"
{{< /code >}}

[1]: ../../operations/deploy-sensu/cluster-sensu/
