---
title: "Health"
description: "Access health data for your Sensu instance. Read the reference to learn about the health information you can retrieve."
weight: 115
version: "5.16"
product: "Sensu Go"
menu: 
  sensu-go-5.16:
    parent: reference
---

- [Health payload example](#health-payload-example)
- [Health specification](#health-specification)
  - [Top-level attributes](#top-level-attributes) | [ClusterHealth attributes](#clusterhealth-attributes) | [Header attributes](#header-attributes)

Use Sensu's [health API][1] to make sure your backend is up and running and check the health of your etcd cluster members.

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
  }
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
description  | The etcd cluster member's [raft term][2].
required     | true
type         | Integer
example      | {{< highlight shell >}}"raft_term": 26{{< /highlight >}}


[1]: ../../api/health/
[2]: https://etcd.io/docs/latest/learning/api/#response-header
