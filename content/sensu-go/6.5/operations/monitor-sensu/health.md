---
title: "Health reference"
linkTitle: "Health Reference"
reference_title: "Health"
type: "reference"
description: "Access health data for your Sensu instance. Read this page to learn about the health information you can retrieve."
weight: 30
version: "6.5"
product: "Sensu Go"
menu: 
  sensu-go-6.5:
    parent: monitor-sensu
---

Use Sensu's [/health API][1] to make sure your backend is up and running and check the health of your etcd cluster members and [PostgreSQL datastore resources][2].

A request to the health endpoint retrieves a JSON map with health data for your Sensu instance.

## Healthy cluster example

In this example, all cluster members are healthy. 

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/health

HTTP/1.1 200 OK
{
  "Alarms": null,
  "ClusterHealth": [
    {
      "MemberID": 9861478486968594000,
      "MemberIDHex": "88db026f7feb72b4",
      "Name": "backend01",
      "Err": "",
      "Healthy": true
    },
    {
      "MemberID": 16828500076473182000,
      "MemberIDHex": "e98ad7a888d16bd6",
      "Name": "backend02",
      "Err": "",
      "Healthy": true
    },
    {
      "MemberID": 848052855499371400,
      "MemberIDHex": "bc4e39432cbb36d",
      "Name": "backend03",
      "Err": "",
      "Healthy": true
    }
  ],
  "Header": {
    "cluster_id": 17701109828877156000,
    "member_id": 16828500076473182000,
    "raft_term": 42
  }
},
  "PostgresHealth": [
    {
      "Name": "my-first-postgres",
      "Active": true,
      "Healthy": true
    },
    {
      "Name": "my-other-postgres",
      "Active": false,
      "Healthy": false
    }
  ]
}
{{< /code >}}

## Unhealthy cluster member example

In this example, one cluster member is unhealthy: it cannot communicate with the other cluster members.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/health

HTTP/1.1 200 OK
{
  "Alarms": null,
  "ClusterHealth": [
    {
      "MemberID": 9861478486968594000,
      "MemberIDHex": "88db026f7feb72b4",
      "Name": "backend01",
      "Err": "context deadline exceeded",
      "Healthy": false
    },
    {
      "MemberID": 16828500076473182000,
      "MemberIDHex": "e98ad7a888d16bd6",
      "Name": "backend02",
      "Err": "",
      "Healthy": true
    },
    {
      "MemberID": 848052855499371400,
      "MemberIDHex": "bc4e39432cbb36d",
      "Name": "backend03",
      "Err": "",
      "Healthy": true
    }
  ],
  "Header": {
    "cluster_id": 17701109828877156000,
    "member_id": 16828500076473182000,
    "raft_term": 42
  }
},
  "PostgresHealth": [
    {
      "Name": "my-first-postgres",
      "Active": true,
      "Healthy": true
    },
    {
      "Name": "my-other-postgres",
      "Active": false,
      "Healthy": false
    }
  ]
}
{{< /code >}}

{{% notice note %}}
**NOTE**: The HTTP response codes for the health endpoint indicate whether your request reached Sensu rather than the health of your Sensu instance.
In this example, even though the cluster is unhealthy, the request itself reached Sensu, so the response code is `200 OK`.
To determine the health of your Sensu instance, you must process the JSON response body.
The [health specification](#health-specification) describes each attribute in the response body.
{{% /notice %}}

## Health specification

### Top-level attributes

Alarms       | 
-------------|------
description  | Top-level attribute that lists all active etcd alarms.
required     | true
type         | String
example      | {{< code shell >}}"Alarms": null{{< /code >}}

ClusterHealth | 
--------------|------
description   | Top-level attribute that includes health status information for every etcd cluster member.
required      | true
type          | Map of key-value pairs
example       | {{< code shell >}}
"ClusterHealth": [
    {
      "MemberID": 2882886652148554927,
      "MemberIDHex": "8923110df66458af",
      "Name": "default",
      "Err": "",
      "Healthy": true
    }
  ]{{< /code >}}

Header       | 
-------------|------
description  | Top-level map that includes the response header for the entire cluster response.
required     | true
type         | Map of key-value pairs
example      | {{< code shell >}}
"Header": {
    "cluster_id": 4255616344056076734,
    "member_id": 2882886652148554927,
    "raft_term": 26
  }
{{< /code >}}

PostgresHealth | 
---------------|------
description    | Top-level map that includes health information for PostgreSQL resources. If your Sensu instance is not configured to use a [PostgreSQL datastore][2], the health payload will not include `PostgresHealth`.
type           | Map of key-value pairs
example        | {{< code shell >}}
"PostgresHealth": [
    {
      "Name": "postgres-test",
      "Active": false,
      "Healthy": false
    },
    {
      "Name": "postgres",
      "Active": true,
      "Healthy": true
    }
  ]
{{< /code >}}

#### ClusterHealth attributes

Err          | 
-------------|------ 
description  | Any errors Sensu encountered while checking the etcd cluster member's health.
required     | true
type         | String
example      | {{< code shell >}}"Err": ""{{< /code >}}

Healthy      | 
-------------|------ 
description  | `true` if the etcd cluster member is connected. Otherwise, `false`.
required     | true
type         | Boolean
default      | `false`
example      | {{< code shell >}}"Healthy": true{{< /code >}}

MemberID     | 
-------------|------ 
description  | The etcd cluster member's ID.
required     | true
type         | Integer
example      | {{< code shell >}}"MemberID": 2882886652148554927{{< /code >}}

MemberIDHex  | 
-------------|------ 
description  | The hexadecimal representation of the etcd cluster member's ID.
required     | true
type         | String
example      | {{< code shell >}}"MemberIDHex": "8923110df66458af"{{< /code >}}

Name         | 
-------------|------ 
description  | The etcd cluster member's name.
required     | true
type         | String
example      | {{< code shell >}}Name": "default"{{< /code >}}

#### Header attributes

cluster_id   | 
-------------|------ 
description  | The etcd cluster ID.
required     | true
type         | Integer
example      | {{< code shell >}}"cluster_id": 4255616344056076734{{< /code >}}

member_id    | 
-------------|------ 
description  | The etcd cluster member's ID.
required     | true
type         | Integer
example      | {{< code shell >}}"member_id": 2882886652148554927{{< /code >}}

raft_term    | 
-------------|------ 
description  | The etcd cluster member's [raft term][4].
required     | true
type         | Integer
example      | {{< code shell >}}"raft_term": 26{{< /code >}}

#### PostgresHealth attributes

Active       | 
-------------|------ 
description  | `true` if the datastore is configured to use the PostgreSQL configuration. Otherwise, `false`.
required     | true
type         | Boolean
default      | `false`
example      | {{< code shell >}}"Active": true{{< /code >}}

Healthy      | 
-------------|------ 
description  | `true` if the PostgreSQL datastore is connected and can query the events table. Otherwise, `false`.
required     | true
type         | Boolean
default      | `false`
example      | {{< code shell >}}"Healthy": true{{< /code >}}

Name         | 
-------------|------ 
description  | The PostgreSQL configuration resource. Sensu retrieves the `Name` from [datastore metadata][3].
required     | true
type         | String
example      | {{< code shell >}}"Name": "postgres"{{< /code >}}


[1]: ../../../api/other/health/
[2]: ../../deploy-sensu/datastore/#scale-event-storage
[3]: ../../deploy-sensu/datastore/#metadata-attributes
[4]: https://etcd.io/docs/latest/learning/api/#response-header
