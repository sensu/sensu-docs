---
title: "Cluster API"
description: "Sensu Go cluster management API reference documentation"
version: "5.0"
product: "Sensu Go"
menu:
  sensu-go-5.0:
    parent: api
---

## The `/cluster/members` API endpoints

### `/cluster/members` (GET)

The `/cluster/members` API endpoint provides HTTP GET access to [Sensu cluster][1] data.

#### EXAMPLE {#clustermembers-get-example}

The following example demonstrates a request to the `/cluster/members` API, resulting in
a JSON Array containing a Sensu cluster definition.

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/apis/core/v2//cluster/members -H "Authorization: Bearer TOKEN"
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
example url    | http://hostname:8080/apis/core/v2/cluster/members
response type  | Map
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
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

[1]: ../../guides/clustering
