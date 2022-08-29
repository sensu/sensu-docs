---
title: "enterprise/federation/v1"
description: "Read this API documentation for information about Sensu enterprise/federation/v1 API endpoints, wich allow you to control federation of Sensu clusters."
enterprise_api_title: "enterprise/federation/v1"
type: "enterprise_api"
version: "6.4"
product: "Sensu Go"
menu:
  sensu-go-6.4:
    parent: enterprise
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access federation in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

{{% notice note %}}
**NOTE**: Requests to `enterprise/federation/v1` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-auth-api-endpoints).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all replicators

The `/etcd-replicators` API endpoint provides HTTP GET access to a list of replicators.

{{% notice note %}}
**NOTE**: The etcd-replicators datatype is only accessible for users who have a cluster role that permits access to replication resources.
{{% /notice %}}

### Example {#etcd-replicators-get-example}

The following example demonstrates a GET request to the `/etcd-replicators` API endpoint:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/federation/v1/etcd-replicators \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a JSON array that contains the [etcd replicator definitions][1]:

{{< code text >}}
[
  {
    "api_version": "federation/v1",
    "type": "EtcdReplicator",
    "metadata": {
      "name": "my_replicator",
      "created_by": "admin"
    },
    "spec": {
      "ca_cert": "/path/to/ssl/trusted-certificate-authorities.pem",
      "cert": "/path/to/ssl/cert.pem",
      "key": "/path/to/ssl/key.pem",
      "insecure": false,
      "url": "http://remote-etcd.example.com:2379",
      "api_version": "core/v2",
      "resource": "Role",
      "replication_interval_seconds": 30
    }
  }
]
{{< /code >}}

### API Specification {#etcd-replicators-get-specification}

/etcd-replicators (GET)  | 
---------------|------
description    | Returns the list of replicators.
example url    | http://hostname:8080/api/enterprise/federation/v1/etcd-replicators
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "api_version": "federation/v1",
    "type": "EtcdReplicator",
    "metadata": {
      "name": "my_replicator",
      "created_by": "admin"
    },
    "spec": {
      "ca_cert": "/path/to/ssl/trusted-certificate-authorities.pem",
      "cert": "/path/to/ssl/cert.pem",
      "key": "/path/to/ssl/key.pem",
      "insecure": false,
      "url": "http://remote-etcd.example.com:2379",
      "api_version": "core/v2",
      "resource": "Role",
      "replication_interval_seconds": 30
    }
  }
]
{{< /code >}}

## Create a new replicator

The `/etcd-replicators` API endpoint provides HTTP POST access to create replicators.

{{% notice note %}}
**NOTE**: Create a replicator for each resource type you want to replicate. 
Replicating `namespace` resources will **not** replicate the resources that belong to those namespaces.
{{% /notice %}}

### Example {#etcd-replicators-post-example}

The following example demonstrates a request to the `/etcd-replicators` API endpoint to create the replicator `my_replicator`:

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "api_version": "federation/v1",
  "type": "EtcdReplicator",
  "metadata": {
    "name": "my_replicator"
  },
  "spec": {
    "ca_cert": "/path/to/ssl/trusted-certificate-authorities.pem",
    "cert": "/path/to/ssl/cert.pem",
    "key": "/path/to/ssl/key.pem",
    "insecure": false,
    "url": "http://remote-etcd.example.com:2379",
    "api_version": "core/v2",
    "resource": "Role",
    "replication_interval_seconds": 30
  }
}' \
http://127.0.0.1:8080/api/enterprise/federation/v1/etcd-replicators
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

### API Specification {#etcd-replicators-post-specification}

/etcd-replicators (POST) | 
----------------|------
description     | Creates a new replicator (if none exists).
example URL     | http://hostname:8080/api/enterprise/federation/v1/etcd-replicators
payload         | {{< code shell >}}
{
  "api_version": "federation/v1",
  "type": "EtcdReplicator",
  "metadata": {
    "name": "my_replicator"
  },
  "spec": {
    "ca_cert": "/path/to/ssl/trusted-certificate-authorities.pem",
    "cert": "/path/to/ssl/cert.pem",
    "key": "/path/to/ssl/key.pem",
    "insecure": false,
    "url": "http://remote-etcd.example.com:2379",
    "api_version": "core/v2",
    "resource": "Role",
    "replication_interval_seconds": 30
  }
}
{{< /code >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific replicator {#etcd-replicatorsetcd-replicator-get}

The `/etcd-replicators/:etcd-replicator` API endpoint provides HTTP GET access to data for a specific `:etcd-replicator`, by replicator name.

{{% notice note %}}
**NOTE**: The etcd-replicators datatype is only accessible for users who have a cluster role that permits access to replication resources.
{{% /notice %}}

### Example {#etcd-replicatorsetcd-replicator-get-example}

The following example queries the `/etcd-replicators/:etcd-replicator` API endpoint for a specific `:etcd-replicator`.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/federation/v1/etcd-replicators/my_replicator \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request will return a successful `HTTP/1.1 200 OK` response and a JSON map that contains the requested [`:etcd-replicator` definition][1] (in this example, `my_replicator`):

{{< code text >}}
{
  "api_version": "federation/v1",
  "type": "EtcdReplicator",
  "metadata": {
    "name": "my_replicator",
    "created_by": "admin"
  },
  "spec": {
    "ca_cert": "/path/to/ssl/trusted-certificate-authorities.pem",
    "cert": "/path/to/ssl/cert.pem",
    "key": "/path/to/ssl/key.pem",
    "insecure": false,
    "url": "http://remote-etcd.example.com:2379",
    "api_version": "core/v2",
    "resource": "Role",
    "replication_interval_seconds": 30
  }
}
{{< /code >}}

### API Specification {#etcd-replicatorsetcd-replicator-get-specification}

/etcd-replicators/:etcd-replicator (GET) | 
---------------------|------
description          | Returns the specified replicator.
example url          | http://hostname:8080/api/enterprise/federation/v1/etcd-replicators/my_replicator
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code text >}}
{
  "api_version": "federation/v1",
  "type": "EtcdReplicator",
  "metadata": {
    "name": "my_replicator",
    "created_by": "admin"
  },
  "spec": {
    "ca_cert": "/path/to/ssl/trusted-certificate-authorities.pem",
    "cert": "/path/to/ssl/cert.pem",
    "key": "/path/to/ssl/key.pem",
    "insecure": false,
    "url": "http://remote-etcd.example.com:2379",
    "api_version": "core/v2",
    "resource": "Role",
    "replication_interval_seconds": 30
  }
}
{{< /code >}}

## Create or update a replicator {#etcd-replicatorsetcd-replicator-put}

The `/etcd-replicators/:etcd-replicator` API endpoint provides HTTP PUT access to create or update a specific `:etcd-replicator`, by replicator name.

### Example {#etcd-replicatorsetcd-replicator-put-example}

The following example demonstrates a request to the `/etcd-replicators/:etcd-replicator` API endpoint to update the replicator `my_replicator`:

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "api_version": "federation/v1",
  "type": "EtcdReplicator",
  "metadata": {
    "name": "my_replicator"
  },
  "spec": {
    "ca_cert": "/path/to/ssl/trusted-certificate-authorities.pem",
    "cert": "/path/to/ssl/cert.pem",
    "key": "/path/to/ssl/key.pem",
    "insecure": false,
    "url": "http://remote-etcd.example.com:2379",
    "api_version": "core/v2",
    "resource": "Role",
    "replication_interval_seconds": 30
  }
}' \
http://127.0.0.1:8080/api/enterprise/federation/v1/etcd-replicators/my-replicator
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

### API Specification {#etcd-replicatorsetcd-replicator-put-specification}

/etcd-replicators/:etcd-replicator (PUT) | 
----------------|------
description     | Creates or updates the specified replicator. The replicator resource and API version cannot be altered.
example URL     | http://hostname:8080/api/enterprise/federation/v1/etcd-replicators/my_replicator
payload         | {{< code json >}}
{
  "api_version": "federation/v1",
  "type": "EtcdReplicator",
  "metadata": {
    "name": "my_replicator"
  },
  "spec": {
    "ca_cert": "/path/to/ssl/trusted-certificate-authorities.pem",
    "cert": "/path/to/ssl/cert.pem",
    "key": "/path/to/ssl/key.pem",
    "insecure": false,
    "url": "http://remote-etcd.example.com:2379",
    "api_version": "core/v2",
    "resource": "Role",
    "replication_interval_seconds": 30
  }
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a replicator {#etcd-replicatorsetcd-replicator-delete}

The `/etcd-replicators/:etcd-replicator` API endpoint provides HTTP DELETE access to delete the specified replicator from Sensu.

### Example {#etcd-replicatorsetcd-replicator-delete-example}

The following example shows a request to the `/etcd-replicators/:etcd-replicator` API endpoint to delete the replicator `my_replicator`, resulting in a successful `HTTP/1.1 204 No Content` response.

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/enterprise/federation/v1/etcd-replicators/my_replicator
{{< /code >}}

### API Specification {#etcd-replicatorsetcd-replicator-delete-specification}

/etcd-replicators/:etcd-replicator (DELETE) | 
--------------------------|------
description               | Deletes the specified replicator from Sensu.
example url               | http://hostname:8080/api/enterprise/federation/v1/etcd-replicators/my_replicator
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get all clusters

The `/clusters` API endpoint provides HTTP GET access to a list of clusters.

### Example {#clusters-get-example}

The following example demonstrates a request to the `/clusters` API endpoint, resulting in a list of clusters.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/federation/v1/clusters \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a JSON array that contains the cluster definitions:

{{< code text >}}
[
  {
    "type": "Cluster",
    "api_version": "federation/v1",
    "metadata": {
      "name": "us-west-2a",
      "created_by": "admin"
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
{{< /code >}}

### API Specification {#clusters-get-specification}

/clusters (GET)  | 
---------------|------
description    | Returns the list of clusters.
example url    | http://hostname:8080/api/enterprise/federation/v1/clusters
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "type": "Cluster",
    "api_version": "federation/v1",
    "metadata": {
      "name": "us-west-2a",
      "created_by": "admin"
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
{{< /code >}}

## Get a specific cluster {#clusterscluster-get}

The `/clusters/:cluster` API endpoint provides HTTP GET access to data for a specific `cluster`, by cluster name.

### Example {#clusterscluster-get-example}

The following example queries the `/clusters/:cluster` API endpoint for a specific `:cluster`.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/federation/v1/clusters/us-west-2a \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request will return a successful `HTTP/1.1 200 OK` response and a JSON map that contains the requested `:cluster` definition (in this example, `us-west-2a`):

{{< code text >}}
{
  "type": "Cluster",
  "api_version": "federation/v1",
  "metadata": {
    "name": "us-west-2a",
    "created_by": "admin"
  },
  "spec": {
    "api_urls": [
      "http://10.0.0.1:8080",
      "http://10.0.0.2:8080",
      "http://10.0.0.3:8080"
    ]
  }
}
{{< /code >}}

### API Specification {#clusterscluster-get-specification}

/clusters/:cluster (GET) | 
---------------------|------
description          | Returns the specified cluster.
example url          | http://hostname:8080/api/enterprise/federation/v1/clusters/us-west-2a
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code text >}}
{
  "type": "Cluster",
  "api_version": "federation/v1",
  "metadata": {
    "name": "us-west-2a",
    "created_by": "admin"
  },
  "spec": {
    "api_urls": [
      "http://10.0.0.1:8080",
      "http://10.0.0.2:8080",
      "http://10.0.0.3:8080"
    ]
  }
}
{{< /code >}}

## Create or update a cluster {#clusterscluster-put}

The `/clusters/:cluster` API endpoint provides HTTP PUT access to create or update a specific `cluster`, by cluster name.

{{% notice note %}}
**NOTE**: Only cluster admins have PUT access to clusters.
{{% /notice %}}

### Example {#clusterscluster-put-example}

The following example demonstrates a request to the `/clusters/:cluster` API endpoint to update the cluster `us-west-2a`:

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "type": "Cluster",
  "api_version": "federation/v1",
  "metadata": {
    "name": "us-west-2a"
  },
  "spec": {
    "api_urls": [
      "http://10.0.0.1:8080",
      "http://10.0.0.2:8080",
      "http://10.0.0.3:8080"
    ]
  }
}' \
http://127.0.0.1:8080/api/enterprise/federation/v1/clusters/us-west-2a
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

### API Specification {#clusterscluster-put-specification}

/clusters/:cluster (PUT) | 
----------------|------
description     | Creates or updates the specified cluster.
example URL     | http://hostname:8080/api/enterprise/federation/v1/clusters/us-west-2a
payload         | {{< code shell >}}
{
  "type": "Cluster",
  "api_version": "federation/v1",
  "metadata": {
    "name": "us-west-2a"
  },
  "spec": {
    "api_urls": [
      "http://10.0.0.1:8080",
      "http://10.0.0.2:8080",
      "http://10.0.0.3:8080"
    ]
  }
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a cluster {#clusterscluster-delete}

The `/clusters/:cluster` API endpoint provides HTTP DELETE access to delete the specified cluster from Sensu.

{{% notice note %}}
**NOTE**: Only cluster admins have DELETE access to clusters.
{{% /notice %}}

### Example {#clusterscluster-delete-example}

The following example shows a request to the `/clusters/:cluster` API endpoint to delete the cluster `us-west-2a`, resulting in a successful `HTTP/1.1 204 No Content` response.

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/enterprise/federation/v1/clusters/us-west-2a
{{< /code >}}

### API Specification {#clusterscluster-delete-specification}

/clusters/:cluster (DELETE) | 
--------------------------|------
description               | Deletes the specified cluster from Sensu.
example url               | http://hostname:8080/api/enterprise/federation/v1/clusters/us-west-2a
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../../../operations/deploy-sensu/etcdreplicators/
