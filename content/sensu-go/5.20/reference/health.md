---
title: "Health"
description: "Access health data for your Sensu instance. Read the reference to learn about the health information you can retrieve."
weight: 115
version: "5.20"
product: "Sensu Go"
menu: 
  sensu-go-5.20:
    parent: reference
---

Use Sensu's [health API][1] to make sure your backend is up and running and check the health of your etcd cluster members and [PostgreSQL datastore resources][2].

## Health payload example

A request to the health endpoint retrieves a JSON map with health data for your Sensu instance.

{{< highlight shell >}}
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
{{< /highlight >}}


## Health specification

### Top-level attributes

Alarms       | 
-------------|------
description  | Top-level attribute that lists all active etcd alarms.
required     | true
type         | String
example      | {{< highlight shell >}}"Alarms": null{{< /highlight >}}

ClusterHealth | 
--------------|------
description   | Top-level attribute that includes health status information for every etcd cluster member.
required      | true
type          | Map of key-value pairs
example       | {{< highlight shell >}}
"ClusterHealth": [
    {
      "MemberID": 2882886652148554927,
      "MemberIDHex": "8923110df66458af",
      "Name": "default",
      "Err": "",
      "Healthy": true
    }
  ]{{< /highlight >}}

Header       | 
-------------|------
description  | Top-level map that includes the response header for the entire cluster response.
required     | true
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"Header": {
    "cluster_id": 4255616344056076734,
    "member_id": 2882886652148554927,
    "raft_term": 26
  }
{{< /highlight >}}

PostgresHealth | 
---------------|------
description    | Top-level map that includes health information for PostgreSQL resources. If your Sensu instance is not configured to use a [PostgreSQL datastore][2], the health payload will not include `PostgresHealth`.
type           | Map of key-value pairs
example        | {{< highlight shell >}}
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
{{< /highlight >}}

### ClusterHealth attributes

Member ID    | 
-------------|------ 
description  | The etcd cluster member's ID.
required     | true
type         | Integer
example      | {{< highlight shell >}}"MemberID": 2882886652148554927{{< /highlight >}}

MemberIDHex  | 
-------------|------ 
description  | The hexadecimal representation of the etcd cluster member's ID.
required     | true
type         | String
example      | {{< highlight shell >}}"MemberIDHex": "8923110df66458af"{{< /highlight >}}

Name         | 
-------------|------ 
description  | The etcd cluster member's name.
required     | true
type         | String
example      | {{< highlight shell >}}Name": "default"{{< /highlight >}}

Err          | 
-------------|------ 
description  | Any errors Sensu encountered while checking the etcd cluster member's health.
required     | true
type         | String
example      | {{< highlight shell >}}"Err": ""{{< /highlight >}}

Healthy      | 
-------------|------ 
description  | `true` if the etcd cluster member is connected. Otherwise, `false`.
required     | true
type         | Boolean
default      | `false`
example      | {{< highlight shell >}}"Healthy": true{{< /highlight >}}

### Header attributes

cluster_id   | 
-------------|------ 
description  | The etcd cluster ID.
required     | true
type         | Integer
example      | {{< highlight shell >}}"cluster_id": 4255616344056076734{{< /highlight >}}

member_id    | 
-------------|------ 
description  | The etcd cluster member's ID.
required     | true
type         | Integer
example      | {{< highlight shell >}}"member_id": 2882886652148554927{{< /highlight >}}

raft_term    | 
-------------|------ 
description  | The etcd cluster member's [raft term][4].
required     | true
type         | Integer
example      | {{< highlight shell >}}"raft_term": 26{{< /highlight >}}

### PostgresHealth attributes

Name         | 
-------------|------ 
description  | The PostgreSQL configuration resource. Sensu retrieves the `Name` from [datastore metadata][3].
required     | true
type         | String
example      | {{< highlight shell >}}"Name": "postgres"{{< /highlight >}}

Active       | 
-------------|------ 
description  | `true` if the datastore is configured to use the PostgreSQL configuration. Otherwise, `false`.
required     | true
type         | Boolean
default      | `false`
example      | {{< highlight shell >}}"Active": true{{< /highlight >}}

Healthy      | 
-------------|------ 
description  | `true` if the PostgreSQL datastore is connected and can query the events table. Otherwise, `false`.
required     | true
type         | Boolean
default      | `false`
example      | {{< highlight shell >}}"Healthy": true{{< /highlight >}}


[1]: ../../api/health/
[2]: ../datastore/#scale-event-storage
[3]: ../datastore/#metadata-attributes
[4]: https://etcd.io/docs/latest/learning/api/#response-header
