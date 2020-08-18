---
title: "Health"
reference_title: "Health"
type: "reference"
description: "Access health data for your Sensu instance. Read this page to learn about the health information you can retrieve."
weight: 115
version: "5.18"
product: "Sensu Go"
menu: 
  sensu-go-5.18:
    parent: reference
---

Use Sensu's [health API][1] to make sure your backend is up and running and check the health of your etcd cluster members.

## Health payload example

A request to the health endpoint retrieves a JSON map with health data for your Sensu instance.

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
  }
}
{{< /code >}}


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

### ClusterHealth attributes

Member ID    | 
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

### Header attributes

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
description  | The etcd cluster member's [raft term][2].
required     | true
type         | Integer
example      | {{< code shell >}}"raft_term": 26{{< /code >}}


[1]: ../../api/health/
[2]: https://etcd.io/docs/latest/learning/api/#response-header
