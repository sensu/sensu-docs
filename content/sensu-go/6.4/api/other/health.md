---
title: "/health"
description: "Read this API documentation for information about Sensu /health API endpoints, including examples for retrieving health details about your Sensu instance."
other_api_title: "/health"
type: "other_api"
version: "6.4"
product: "Sensu Go"
menu:
  sensu-go-6.4:
    parent: other
---

## Get health data for your Sensu instance

The `/health` API endpoint provides HTTP GET access to health data for your Sensu instance.

### Example {#health-get-example}

The following example demonstrates a GET request to the `/health` API endpoint:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/health
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a JSON map that contains Sensu [health][1] data:

{{< code text >}}
{
  "Alarms": null,
  "ClusterHealth": [
    {
      "MemberID": 2882886652148554927,
      "MemberIDHex": "8923110df66458af",
      "Name": "default",
      "Err": "",
      "Healthy": true
    }
  ],
  "Header": {
    "cluster_id": 4255616344056076734,
    "member_id": 2882886652148554927,
    "raft_term": 26
  },
  "PostgresHealth": [
    {
      "Name": "my-postgres",
      "Active": false,
      "Healthy": false
    }
  ]
}
{{< /code >}}

{{% notice note %}}
**NOTE**: If your Sensu instance is not configured to use a [PostgreSQL datastore](../../../operations/deploy-sensu/datastore/#scale-event-storage), the health payload will not include `PostgresHealth`.
{{% /notice %}}

### API Specification {#health-get-specification}

/health (GET)    | 
-----------------|------
description      | Returns health information about the Sensu instance.
example url      | http://hostname:8080/health
query parameters | `timeout`: Defines the timeout when querying etcd. Default is `3`.
response type    | Map
response codes   | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 400 (Bad Request)</li></ul>{{% notice note %}}
**NOTE**: The HTTP response codes for the health endpoint indicate whether your request reached Sensu rather than the health of your Sensu instance.
To determine the health of your Sensu instance, you must process the JSON response body for your request.
The [health specification](../../../operations/monitor-sensu/health/#health-specification) describes each attribute in the response body.
{{% /notice %}}
output           | {{< code text >}}
{
  "Alarms": null,
  "ClusterHealth": [
    {
      "MemberID": 2882886652148554927,
      "MemberIDHex": "8923110df66458af",
      "Name": "default",
      "Err": "",
      "Healthy": true
    }
  ],
  "Header": {
    "cluster_id": 4255616344056076734,
    "member_id": 2882886652148554927,
    "raft_term": 26
  },
  "PostgresHealth": [
    {
      "Name": "my-postgres",
      "Active": false,
      "Healthy": false
    }
  ]
}
{{< /code >}}

## Get health data for your agent transport

The `/health` API endpoint provides HTTP GET access to health data for your Sensu agent transport via the backend WebSocket.
Sensu backend `/health` API information is duplicated by this agent transport API endpoint as an affordance to satisfy the load balancing and security requirements of some deployments.

#### Example

The following example demonstrates a GET request to the backend WebSocket `/health` API endpoint using the default WebSocket port 8081:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8081/health
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a JSON map that contains Sensu agent transport status:

{{< code text >}}
{
  "Alarms": null,
  "ClusterHealth": [
    {
      "MemberID": 2882886652148554927,
      "MemberIDHex": "8923110df66458af",
      "Name": "default",
      "Err": "",
      "Healthy": true
    }
  ],
  "Header": {
    "cluster_id": 4255616344056076734,
    "member_id": 2882886652148554927,
    "raft_term": 26
  },
  "PostgresHealth": [
    {
      "Name": "my-postgres",
      "Active": false,
      "Healthy": false
    }
  ]
}
{{< /code >}}

{{% notice note %}}
**NOTE**: If your Sensu instance is not configured to use a [PostgreSQL datastore](../../../operations/deploy-sensu/datastore/#scale-event-storage), the health payload will not include `PostgresHealth`.
{{% /notice %}}

#### API Specification

/health (GET)    | 
-----------------|------
description      | Returns health information about the Sensu agent transport.
example url      | http://hostname:8081/health
query parameters | `timeout`: Defines the timeout when querying etcd. Default is `3`.
response type    | Map
response codes   | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 400 (Bad Request)</li></ul>{{% notice note %}}
**NOTE**: The HTTP response codes for the health endpoint indicate whether your request reached Sensu rather than the health of your Sensu instance.
To determine the health of your Sensu instance, you must process the JSON response body for your request.
The [health specification](../../../operations/monitor-sensu/health/#health-specification) describes each attribute in the response body.
{{% /notice %}}
output           | {{< code text >}}
{
  "Alarms": null,
  "ClusterHealth": [
    {
      "MemberID": 2882886652148554927,
      "MemberIDHex": "8923110df66458af",
      "Name": "default",
      "Err": "",
      "Healthy": true
    }
  ],
  "Header": {
    "cluster_id": 4255616344056076734,
    "member_id": 2882886652148554927,
    "raft_term": 26
  },
  "PostgresHealth": [
    {
      "Name": "my-postgres",
      "Active": false,
      "Healthy": false
    }
  ]
}
{{< /code >}}


[1]: ../../../operations/monitor-sensu/health/
