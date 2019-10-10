---
title: "EtcdReplicators API"
description: "The EtcdReplicators API controls federation of Sensu clusters. Here’s a reference for the EtcdReplicators API in Sensu Go, including examples. Read on for the full reference."
version: "5.14"
product: "Sensu Go"
menu:
  sensu-go-5.14:
    parent: api
---

- [The `/etcdreplicators` API endpoint](#the-etcdreplicators-api-endpoint)
	- [`/etcdreplicators` (GET)](#etcdreplicators-get)
	- [`/etcdreplicators` (POST)](#etcdreplicators-post)
- [The `/etcdreplicators/:etcdreplicator` API endpoint](#the-etcdreplicatorsetcdreplicator-api-endpoint)
	- [`/etcdreplicators/:etcdreplicator` (GET)](#etcdreplicatorsetcdreplicator-get)
  - [`/etcdreplicators/:etcdreplicator` (PUT)](#etcdreplicatorsetcdreplicator-put)
  - [`/etcdreplicators/:etcdreplicator` (DELETE)](#etcdreplicatorsetcdreplicator-delete)

## The `/etcdreplicators` API endpoint

**LICENSED TIER**: Unlock the EtcdReplicators API in Sensu Go with a Sensu license. To activate your license, see the [getting started guide][1].

_**NOTE**: The EtcdReplicators API is only accessible for users who have a cluster role that permits access to replication resources._

### `/etcdreplicators` (GET)

The `/etcdreplicators` API endpoint provides HTTP GET access to a list of replicators.

#### EXAMPLE {#etcdreplicators-get-example}

The following example demonstrates a request to the `/etcdreplicators` API, resulting in a list of replicators.

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/federation/v1/etcdreplicators -H "Authorization: Bearer $SENSU_TOKEN"
[
  {
    "api_version": "federation/v1",
    "type": "EtcdReplicator",
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

#### API Specification {#etcdreplicators-get-specification}

/etcdreplicators (GET)  | 
---------------|------
description    | Returns a list of replicators.
example url    | http://hostname:8080/api/federation/v1/etcdreplicators
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "api_version": "federation/v1",
    "type": "EtcdReplicator",
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

### `/etcdreplicators` (POST)

/etcdreplicators (POST) | 
----------------|------
description     | Creates a new replicator (if none exists).
example URL     | http://hostname:8080/api/federation/v1/etcdreplicators
payload         | {{< highlight shell >}}
{
  "api_version": "federation/v1",
  "type": "EtcdReplicator",
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

## The `/etcdreplicators/:etcdreplicator` API endpoint {#the-etcdreplicatorsetcdreplicator-api-endpoint}

### `/etcdreplicators/:etcdreplicator` (GET) {#etcdreplicatorsetcdreplicator-get}

The `/etcdreplicators/:etcdreplicator` API endpoint provides HTTP GET access to data for a specific `:etcdreplicator`, by replicator `name`.

#### EXAMPLE {#etcdreplicatorsetcdreplicator-get-example}

In the following example, querying the `/etcdreplicators/:etcdreplicator` API returns a JSON Map containing the requested `:etcdreplicator`.

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/federation/v1/etcdreplicators/my_replicator -H "Authorization: Bearer $SENSU_TOKEN"
{
  "api_version": "federation/v1",
  "type": "EtcdReplicator",
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

#### API Specification {#etcdreplicatorsetcdreplicator-get-specification}

/etcdreplicators/:etcdreplicator (GET) | 
---------------------|------
description          | Returns the specified replicator.
example url          | http://hostname:8080/api/federation/v1/etcdreplicators/{etcdreplicator_name}
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "api_version": "federation/v1",
  "type": "EtcdReplicator",
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

### `/etcdreplicators/:etcdreplicator` (PUT) {#etcdreplicatorsetcdreplicator-put}

#### API Specification {#etcdreplicatorsetcdreplicator-put-specification}

/etcdreplicators/:etcdreplicator (PUT) | 
----------------|------
description     | Creates or updates the specified replicator. The replicator resource and API version cannot be altered.
example URL     | http://hostname:8080/federation/v1/etcdreplicators/{etcdreplicator_name}
payload         | {{< highlight shell >}}
{
  "api_version": "federation/v1",
  "type": "EtcdReplicator",
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

### `/etcdreplicators/:etcdreplicator` (DELETE) {#etcdreplicatorsetcdreplicator-delete}

The `/etcdreplicators/:etcdreplicator` API endpoint provides HTTP DELETE access to delete the specified replicator from Sensu.

### EXAMPLE {#etcdreplicatorsetcdreplicator-delete-example}

The following example shows a request to delete the replicator `my_replicator`, resulting in a successful HTTP 204 No Content response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_TOKEN" \
http://127.0.0.1:8080/api/federation/v1/etcdreplicators/my_replicator

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#etcdreplicatorsetcdreplicator-delete-specification}

/etcdreplicators/:etcdreplicator (DELETE) | 
--------------------------|------
description               | Deletes the specified replicator from Sensu.
example url               | http://hostname:8080/api/federation/v1/etcdreplicators/{etcdreplicator_name}
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: /../../getting-started/enterprise/

