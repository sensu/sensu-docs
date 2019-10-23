---
title: "Federation API"
description: "The federation API controls federation of Sensu clusters. Here’s a reference for the federation API in Sensu Go, including examples. Read on for the full reference."
version: "5.15"
product: "Sensu Go"
menu:
  sensu-go-5.15:
    parent: api
---

- [The `/etcd-replicators` endpoint](#the-etcd-replicators-endpoint)
	- [`/etcd-replicators` (GET)](#etcd-replicators-get)
	- [`/etcd-replicators` (POST)](#etcd-replicators-post)
- [The `/etcd-replicators/:etcd-replicator` endpoint](#the-etcd-replicatorsetcd-replicator-endpoint)
	- [`/etcd-replicators/:etcd-replicator` (GET)](#etcd-replicatorsetcd-replicator-get)
	- [`/etcd-replicators/:etcd-replicator` (PUT)](#etcd-replicatorsetcd-replicator-put)
 	- [`/etcd-replicators/:etcd-replicator` (DELETE)](#etcd-replicatorsetcd-replicator-delete)
- [The `/cluster` endpoint](#the-cluster-endpoint)
 	- [`/cluster` (GET)](#cluster-get)
- [The `/cluster/:cluster` endpoint](#the-clustercluster-endpoint)
	- [`/cluster/:cluster` (PUT)](#clustercluster-put)
	- [`/cluster/:cluster` (DELETE)](#clustercluster-delete)

**LICENSED TIER**: Unlock the federation API in Sensu Go with a Sensu license. To activate your license, see the [getting started guide][1].

## The `/etcd-replicators` endpoint

_**NOTE**: The etcd-replicators datatype is only accessible for users who have a cluster role that permits access to replication resources._

### `/etcd-replicators` (GET)

The `/etcd-replicators` endpoint provides HTTP GET access to a list of replicators.

#### EXAMPLE {#etcd-replicators-get-example}

The following example demonstrates a request to the `/etcd-replicators` endpoint, resulting in a list of replicators.

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/enterprise/federation/v1/etcd-replicators -H "Authorization: Bearer $SENSU_TOKEN"
[
  {
    "api_version": "federation/v1",
    "type": "replicator",
    "metadata": {
      "name": "my_replicator"
    },
    "spec": {
      "insecure": true,
      "url": "http://127.0.0.1:3379",
      "api_version": "core/v2",
      "resource": "CheckConfig",
      "replication_interval_seconds": 5
    }
  }
]
{{< /highlight >}}

#### API Specification {#etcd-replicators-get-specification}

/etcd-replicators (GET)  | 
---------------|------
description    | Returns a list of replicators.
example url    | http://hostname:8080/api/enterprise/federation/v1/etcd-replicators
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "api_version": "federation/v1",
    "type": "replicator",
    "metadata": {
      "name": "my_replicator"
    },
    "spec": {
      "insecure": true,
      "url": "http://127.0.0.1:3379",
      "api_version": "core/v2",
      "resource": "CheckConfig",
      "replication_interval_seconds": 5
    }
  }
]
{{< /highlight >}}

### `/etcd-replicators` (POST)

/etcd-replicators (POST) | 
----------------|------
description     | Creates a new replicator (if none exists).
example URL     | http://hostname:8080/api/enterprise/federation/v1/etcd-replicators
payload         | {{< highlight shell >}}
{
  "api_version": "federation/v1",
  "type": "replicator",
  "metadata": {
    "name": "my_replicator"
  },
  "spec": {
    "insecure": true,
    "url": "http://127.0.0.1:3379",
    "api_version": "core/v2",
    "resource": "CheckConfig",
    "replication_interval_seconds": 5
  }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/etcd-replicators/:etcd-replicator` endpoint {#the-etcd-replicatorsetcd-replicator-endpoint}

### `/etcd-replicators/:etcd-replicator` (GET) {#etcd-replicatorsetcd-replicator-get}

The `/etcd-replicators/:etcd-replicator` endpoint provides HTTP GET access to data for a specific `:etcd-replicator`, by replicator `name`.

#### EXAMPLE {#etcd-replicatorsetcd-replicator-get-example}

In the following example, querying the `/etcd-replicators/:etcd-replicator` endpoing returns a JSON Map containing the requested `:etcd-replicator`.

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/enterprise/federation/v1/etcd-replicators/my_replicator -H "Authorization: Bearer $SENSU_TOKEN"
{
  "api_version": "federation/v1",
  "type": "replicator",
  "metadata": {
    "name": "my_replicator"
  },
  "spec": {
    "insecure": true,
    "url": "http://127.0.0.1:3379",
    "api_version": "core/v2",
    "resource": "CheckConfig",
    "replication_interval_seconds": 5
  }
}
{{< /highlight >}}

#### API Specification {#etcd-replicatorsetcd-replicator-get-specification}

/etcd-replicators/:etcd-replicator (GET) | 
---------------------|------
description          | Returns the specified replicator.
example url          | http://hostname:8080/api/enterprise/federation/v1/etcd-replicators/{etcd-replicator_name}
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "api_version": "federation/v1",
  "type": "replicator",
  "metadata": {
    "name": "my_replicator"
  },
  "spec": {
    "insecure": true,
    "url": "http://127.0.0.1:3379",
    "api_version": "core/v2",
    "resource": "CheckConfig",
    "replication_interval_seconds": 5
  }
}
{{< /highlight >}}

### `/etcd-replicators/:etcd-replicator` (PUT) {#etcd-replicatorsetcd-replicator-put}

#### EXAMPLE {#etcd-replicatorsetcd-replicator-put-example}

The following example demonstrates a request to update the replicator `my_replicator`.

curl -X PUT \
http://hostname:8080/api/enterprise/federation/v1/etcd-replicators/my-replicator} -H "Authorization: Bearer $SENSU_TOKEN" \

HTTP/1.1 200 OK
{
  "api_version": "federation/v1",
  "type": "replicator",
  "metadata": {
    "name": "my_replicator"
  },
  "spec": {
    "insecure": true,
    "url": "http://127.0.0.1:3379",
    "api_version": "core/v2",
    "resource": "CheckConfig",
    "replication_interval_seconds": 5
  }
}

#### API Specification {#etcd-replicatorsetcd-replicator-put-specification}

/etcd-replicators/:etcd-replicator (PUT) | 
----------------|------
description     | Creates or updates the specified replicator. The replicator resource and API version cannot be altered.
example URL     | http://hostname:8080/api/enterprise/federation/v1/etcd-replicators/{etcd-replicator_name}
payload         | {{< highlight shell >}}
{
  "api_version": "federation/v1",
  "type": "replicator",
  "metadata": {
    "name": "my_replicator"
  },
  "spec": {
    "insecure": true,
    "url": "http://127.0.0.1:3379",
    "api_version": "core/v2",
    "resource": "CheckConfig",
    "replication_interval_seconds": 5
  }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/etcd-replicators/:etcd-replicator` (DELETE) {#etcd-replicatorsetcd-replicator-delete}

The `/etcd-replicators/:etcd-replicator` endpoint provides HTTP DELETE access to delete the specified replicator from Sensu.

### EXAMPLE {#etcd-replicatorsetcd-replicator-delete-example}

The following example shows a request to delete the replicator `my_replicator`, resulting in a successful HTTP 204 No Content response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_TOKEN" \
http://127.0.0.1:8080/api/enterprise/federation/v1/etcd-replicators/my_replicator

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#etcd-replicatorsetcd-replicator-delete-specification}

/etcd-replicators/:etcd-replicator (DELETE) | 
--------------------------|------
description               | Deletes the specified replicator from Sensu.
example url               | http://hostname:8080/api/enterprise/federation/v1/etcd-replicators/{etcd-replicator_name}
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


## The `/cluster` endpoint

### `/cluster` (GET)

The `/cluster` endpoint provides HTTP GET access to a list of clusters.

#### EXAMPLE {#cluster-get-example}

The following example demonstrates a request to the `/clusters` endpoint, resulting in a list of clusters.

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/enterprise/federation/v1/cluster -H "Authorization: Bearer $SENSU_TOKEN"
[
    {
        "type": "Cluster",
        "api_version": "federation/v1",
        "metadata": {
            "name": "my_cluster"
        },
        "spec": {
            "api_urls": [
                "http://10.0.0.1:8080",
                "http://10.0.0.2:8080",
                "http://10.0.0.3:8080"
            ]
        }
    }
]
{{< /highlight >}}

#### API Specification {#cluster-get-specification}

/cluster (GET)  | 
---------------|------
description    | Returns a list of clusters.
example url    | http://hostname:8080/api/enterprise/federation/v1/cluster
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
    {
        "type": "Cluster",
        "api_version": "federation/v1",
        "metadata": {
            "name": "my_cluster"
        },
        "spec": {
            "api_urls": [
                "http://10.0.0.1:8080",
                "http://10.0.0.2:8080",
                "http://10.0.0.3:8080"
            ]
        }
    }
]
{{< /highlight >}}

## The `/cluster/:cluster` endpoint {#the-clustercluster-endpoint}

_**NOTE**: Only cluster admins have PUT and DELETE access to clusters._

### `/cluster/:cluster` (PUT) {#clustercluster-put}

#### EXAMPLE {#clustercluster-put-example}

The following example demonstrates a request to update the cluster `my_cluster`.

curl -X PUT \
http://127.0.0.1:8080/api/enterprise/federation/v1/cluster/my_cluster -H "Authorization: Bearer $SENSU_TOKEN" \

HTTP/1.1 200 OK
{
    "type": "Cluster",
    "api_version": "federation/v1",
    "metadata": {
        "name": "my_cluster"
    },
    "spec": {
        "api_urls": [
            "http://10.0.0.1:8080",
            "http://10.0.0.2:8080",
            "http://10.0.0.3:8080"
        ]
    }
}

#### API Specification {#clustercluster-put-specification}

/cluster/:cluster (PUT) | 
----------------|------
description     | Creates or updates the specified cluster.
example URL     | http://hostname:8080/api/enterprise/federation/v1/cluster/{cluster_name}
payload         | {{< highlight shell >}}
{
    "type": "Cluster",
    "api_version": "federation/v1",
    "metadata": {
        "name": "my_cluster"
    },
    "spec": {
        "api_urls": [
            "http://10.0.0.1:8080",
            "http://10.0.0.2:8080",
            "http://10.0.0.3:8080"
        ]
    }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/cluster/:cluster` (DELETE) {#cluster-delete}

The `/cluster/:cluster` endpoint provides HTTP DELETE access to delete the specified cluster from Sensu.

### EXAMPLE {#clustercluster-delete-example}

The following example shows a request to delete the cluster `my_cluster`, resulting in a successful HTTP 204 No Content response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_TOKEN" \
http://127.0.0.1:8080/api/enterprise/federation/v1/cluster/my_cluster

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#etcd-replicatorsetcd-replicator-delete-specification}

/cluster/:cluster (DELETE) | 
--------------------------|------
description               | Deletes the specified cluster from Sensu.
example url               | http://hostname:8080/api/enterprise/federation/v1/cluster/{cluster_name}
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: /../../getting-started/enterprise/

