---
title: "Health API"
description: "The Sensu health API provides HTTP access to health data for your Sensu instance. This reference includes examples for retrieving health information about your Sensu instance. Read on for the full reference."
api_title: "Health API"
type: "api"
version: "5.21"
product: "Sensu Go"
menu:
  sensu-go-5.21:
    parent: api
---

## Get health data

The `/health` API endpoint provides HTTP GET access to health data for your Sensu instance.

### Example {#health-get-example}

The following example demonstrates a request to the `/health` API endpoint, resulting in a JSON map that contains Sensu health data.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/health

HTTP/1.1 200 OK
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
The [health specification](../../reference/health/#health-specification) describes each attribute in the response body.
{{% /notice %}}
output           | {{< code shell >}}
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
