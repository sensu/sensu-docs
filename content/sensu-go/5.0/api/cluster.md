---
title: "Cluster API"
description: "Sensu Go cluster management API reference documentation"
version: "5.0"
product: "Sensu Go"
menu:
  sensu-go-5.0:
    parent: api
---

- [The `/cluster/members` API endpoint](#the-clustermembers-API-endpoint)
  - [`/cluster/members` (GET)](#clustermembers-get)
- [The `/cluster/members/:member` API endpoint](#the-clustermembersmember-API-endpoint)
  - [`/cluster/members/:member` (DELETE)](#clustermembersmember-delete)

## The `/cluster/members` API endpoint {#the-clustermembers-API-endpoint}

### `/cluster/members` (GET) {#clustermembers-get}

The `/cluster/members` API endpoint provides HTTP GET access to [Sensu cluster][1] data.

#### EXAMPLE {#clustermembers-get-example}

The following example demonstrates a request to the `/cluster/members` API, resulting in
a JSON Map containing a Sensu cluster definition.

{{< highlight shell >}}
curl -H "Authorization: Bearer TOKEN" \
http://127.0.0.1:8080/api/core/v2/cluster/members

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
{{< /highlight >}}

#### API Specification {#clustermembers-get-specification}

/cluster/members (GET)  | 
---------------|------
description    | Returns the cluster definition.
example url    | http://hostname:8080/api/core/v2/cluster/members
response type  | Map
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
example output | {{< highlight shell >}}
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
{{< /highlight >}}

## The `/cluster/members/:member` API endpoint {#the-clustermembersmember-API-endpoint}

### `/cluster/members/:member` (DELETE) {#clustermembersmember-delete}

The `/cluster/members/:member` API endpoint provides HTTP DELETE access to remove a Sensu cluster member.

#### API Specification {#clustermembersmember-delete-specification}

/cluster/ members/:member (DELETE) | 
--------------------------|------
description               | Removes a member from a Sensu cluster given the member ID.
example url               | http://hostname:8080/api/core/v2/cluster/members/9882886658148554927
response codes            | <ul><li>**Success**: 202 (Accepted)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../guides/clustering
