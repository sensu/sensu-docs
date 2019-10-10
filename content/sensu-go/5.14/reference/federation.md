---
title: "Federation"
description: "The federation API allows you to manage RBAC resources in one place and mirror the changes to follower clusters. Read the reference to set up Sensu cluster federation."
weight: 10
version: "5.14"
product: "Sensu Go"
menu:
  sensu-go-5.14:
    parent: reference
---

- [Create a replicator](#create-a-replicator)
- [Delete a replicator](#delete-a-replicator)
- [Replicator configuration](#replicator-configuration)
- [Federation specification](#federation-specification)
- [Examples](#examples)

**LICENSED TIER**: Unlock the federation API in Sensu Go with a Sensu license. To activate your license, see the [getting started guide][1].

_**NOTE**: The federation API is only accessible for users who have a cluster role that permits access to replication resources._

The [federation API][2] allows you to manage [RBAC][3] resources in one place and mirror the changes to follower clusters. The API sets up etcd mirrors for one-way key replication.

The replicator data type will not use a namespace because it applies cluster-wide. Therefore, only cluster role RBAC bindings will apply to it.

## Create a replicator

You can use [`sensuctl create`][4] or the Sensu web UI to create replicators.

When you create or update a replicator, an entry is added to the store and a new replicator process will spin up. The replicator process watches the keyspace of the resource to be replicated and replicates all keys to the specified cluster in a first-write-wins fashion.

When the cluster starts up for the first time, each node scans and starts a replicator process for each of the replicators that are defined. Multi-node clusters will have write redundancy.

## Delete a replicator

When you delete a replicator, the replicator will issue delete events to the remote cluster for all of the keys in its prefix. It will not issue a delete of the entire key prefix (just in case the prefix is shared by keys that are local to the remote cluster).

Rather than altering an existing replicator's connection details, delete and recreate the replicator with the new connection details.

## Replicator configuration

Replicator is an etcd key space replicator. It contains configuration for forwarding a set of keys from one etcd cluster to another. Replicators are configured by specifying the TLS details of the remote cluster, its URL, and a resource type.

## Federation specification

#### Top-level attributes

type         |      |
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][4] resource type. This attribute should be `Replicator.`
required     | true
type         | String
example      | {{< highlight shell >}}type: replicator{{< /highlight >}}

api_version  |      |
-------------|------
description  | Top-level attribute that specifies the Sensu API version of the resource to replicate. Default is `core/v2`.
required     | true
type         | String
example      | {{< highlight shell >}}api_version: core/v2{{< /highlight >}}

metadata     |      |
-------------|------
description  | Top-level scope containing the replicator `name`.
required     | true
type         | Map of key-value pairs
example      | {{< highlight shell >}}
metadata:
  name: replicator1
{{< /highlight >}}

spec         |      |
-------------|------
description  | Top-level map that includes the replicator [spec attributes](#spec-attributes).
required     | true
type         | Map of key-value pairs
example      | {{< highlight shell >}}
spec:
  ca_cert: 
  cert: 
  key: 
  url: https://example.com:2379
  resource: rbac
  insecure: false
  replication_interval_seconds: 30
{{< /highlight >}}

#### Metadata attributes

name         |      |
-------------|------
description  | The replicator name used internally by Sensu.
required     | true
type         | String
example      | {{< highlight shell >}}name: replicator1{{< /highlight >}}

#### Spec attributes

ca_cert      |      |
-------------|-------
description  | Destination [certificate authority (CA)][5] certificate. In Base64-encoded bytes.
required     | true
type         | String
example      | {{< highlight shell >}}ca_cert: {{< /highlight >}}

cert         |      |
-------------|-------
description  | Destination certificate. In Base64-encoded bytes.
required     | true
type         | String
example      | {{< highlight shell >}}cert: {{< /highlight >}}

key          |      |
-------------|-------
description  | Destination key. In Base64-encoded bytes.
required     | true
type         | String
example      | {{< highlight shell >}}key: {{< /highlight >}}

url          |      |
-------------|-------
description  | Destination cluster URL. If specifying more than one, use a comma to separate.
required     | true
type         | String
example      | {{< highlight shell >}}url: {{< /highlight >}}

resource     |      |
-------------|-------
description  | Name of the resource to replicate. Only RBAC resources are supported.
required     | true
type         | String
example      | {{< highlight shell >}}resource: rbac{{< /highlight >}}

insecure     |      |
-------------|-------
description  | `true` to disable transport security. Otherwise, `false`. Default is `false`. _**NOTE**: Disable transport security with care._
required     | true
type         | String
example      | {{< highlight shell >}}insecure: false{{< /highlight >}}

replication_interval_seconds      |      |
----------------------------------|-------
description  | The interval at which the resource will be replicated. In seconds. Default is 30.
required     | true
type         | String
example      | {{< highlight shell >}}replication_interval_seconds: 30{{< /highlight >}}

## Examples

{{< language-toggle >}}

{{< highlight yml >}}
type: Replicator
api_version: core/v2
metadata:
  name: replicator1
spec:
  ca_cert: U2luZywgZ29kZGVzcywgdGhlIGFuZ2VyIG9mIFBlbGV1c+KAmSBzb24gQWNoaWxsZXVz
  cert: YW5kIGl0cyBkZXZhc3RhdGlvbiwgd2hpY2ggcHV0IHBhaW5zIHRob3VzYW5kZm9sZCB1cG9uIHRoZSBBY2hhaWFucyw=
  key: aHVybGVkIGluIHRoZWlyIG11bHRpdHVkZXMgdG8gdGhlIGhvdXNlIG9mIEhhZGVzIHN0cm9uZyBzb3Vscw==
  url: https://example.com:5678
  resource: rbac
  insecure: false
  replication_interval_seconds: 30
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Replicator",
  "api_version": "core/v2",
  "metadata": {
    "namespace": "replicator1"
  },
  "spec": {
    "ca_cert": "U2luZywgZ29kZGVzcywgdGhlIGFuZ2VyIG9mIFBlbGV1c+KAmSBzb24gQWNoaWxsZXVz",
    "cert": "YW5kIGl0cyBkZXZhc3RhdGlvbiwgd2hpY2ggcHV0IHBhaW5zIHRob3VzYW5kZm9sZCB1cG9uIHRoZSBBY2hhaWFucyw=",
    "key": "aHVybGVkIGluIHRoZWlyIG11bHRpdHVkZXMgdG8gdGhlIGhvdXNlIG9mIEhhZGVzIHN0cm9uZyBzb3Vscw==",
    "url": "https://example.com:5678",
    "resource": "rbac",
    "insecure": false,
    "replication_interval_seconds": 30
  },
}
{{< /highlight >}}

{{< /language-toggle >}}


[1]: ../../getting-started/enterprise
[2]: ../../api/federation/
[3]: ../../reference/rbac/
[4]: ../../sensuctl/reference/#creating-resources
[5]: ../../guides/securing-sensu/#creating-self-signed-certificates-for-securing-etcd-and-backend-agent-communication

