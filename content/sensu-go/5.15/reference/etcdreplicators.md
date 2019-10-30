---
title: "Etcd replicators"
description: "Etcd replicators allow you to manage RBAC resources in one place and mirror the changes to follower clusters. Read the reference to set up RBAC policy replication between Sensu clusters."
weight: 10
version: "5.15"
product: "Sensu Go"
menu:
  sensu-go-5.15:
    parent: reference
---

- [Create a replicator](#create-a-replicator)
- [Delete a replicator](#delete-a-replicator)
- [Replicator configuration](#replicator-configuration)
- [etcd-eplicators specification](#etcdreplicators-specification)
- [Example etcd-replicators resource](#example-etcdreplicators-resource)

**LICENSED TIER**: Unlock the etcd-replicators datatype in Sensu Go with a Sensu license. To activate your license, see the [getting started guide][1].

_**NOTE**: etcd-replicators is a datatype in the federation API, which is only accessible for users who have a cluster role that permits access to replication resources._

etcd-replicators allows you to manage [RBAC][3] resources in one place and mirror the changes to follower clusters. The API sets up etcd mirrors for one-way key replication.

The etcd-replicators datatype will not use a namespace because it applies cluster-wide. Therefore, only cluster role RBAC bindings will apply to it.

## Create a replicator

You can use [`sensuctl create`][4] or the Sensu web UI to create replicators.

When you create or update a replicator, an entry is added to the store and a new replicator process will spin up. The replicator process watches the keyspace of the resource to be replicated and replicates all keys to the specified cluster in a first-write-wins fashion.

When the cluster starts up for the first time, each node scans and starts a replicator process for each of the replicators that are defined. Multi-node clusters will have write redundancy.

## Delete a replicator

When you delete a replicator, the replicator will issue delete events to the remote cluster for all of the keys in its prefix. It will not issue a delete of the entire key prefix (just in case the prefix is shared by keys that are local to the remote cluster).

Rather than altering an existing replicator's connection details, delete and recreate the replicator with the new connection details.

## Replicator configuration

Replicator is an etcd key space replicator. It contains configuration for forwarding a set of keys from one etcd cluster to another. Replicators are configured by specifying the TLS details of the remote cluster, its URL, and a resource type.

## etcd-replicators specification

#### Top-level attributes

type         |      |
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][4] resource type. This attribute should be `Replicator.`
required     | true
type         | String
example      | {{< highlight shell >}}type: replicator{{< /highlight >}}

api_version  |      |
-------------|------
description  | Top-level attribute that specifies the Sensu API version of the etcd-replicators API. Always `federation/v1`.
required     | true
type         | String
example      | {{< highlight shell >}}api_version: federation/v1{{< /highlight >}}

metadata     |      |
-------------|------
description  | Top-level scope that contains the replicator `name`.
required     | true
type         | Map of key-value pairs
example      | {{< highlight shell >}}
metadata:
  name: my_replicator
{{< /highlight >}}

spec         |      |
-------------|------
description  | Top-level map that includes the replicator [spec attributes](#spec-attributes).
required     | true
type         | Map of key-value pairs
example      | {{< highlight shell >}}
spec:
  insecure: false
  url: http://127.0.0.1:3379
  api_version: core/v2
  resource: CheckConfig
  replication_interval_seconds: 30
{{< /highlight >}}

#### Metadata attributes

name         |      |
-------------|------
description  | The replicator name used internally by Sensu.
required     | true
type         | String
example      | {{< highlight shell >}}name: my_replicator{{< /highlight >}}

#### Spec attributes

insecure     |      |
-------------|-------
description  | `true` to disable transport security. Otherwise, `false`. Default is `false`. _**NOTE**: Disable transport security with care._
required     | true
type         | String
example      | {{< highlight shell >}}insecure: false{{< /highlight >}}

url          |      |
-------------|-------
description  | Destination cluster URL. If specifying more than one, use a comma to separate.
required     | true
type         | String
example      | {{< highlight shell >}}url: http://127.0.0.1:3379 {{< /highlight >}}

api_version  |      |
-------------|-------
description  | Sensu API version of the resource to replicate. Default is `core/v2`.
required     | true
type         | String
example      | {{< highlight shell >}}api_version: core/v2{{< /highlight >}}

resource     |      |
-------------|-------
description  | Name of the resource to replicate.
required     | true
type         | String
example      | {{< highlight shell >}}resource: CheckConfig{{< /highlight >}}

replication_interval_seconds      |      |
----------------------------------|-------
description  | The interval at which the resource will be replicated. In seconds. Default is 30.
required     | true
type         | String
example      | {{< highlight shell >}}replication_interval_seconds: 30{{< /highlight >}}

## Example etcd-replicators resource

{{< language-toggle >}}

{{< highlight yml >}}
api_version: federation/v1
type: replicator
metadata:
  name: my_replicator
spec:
  insecure: false
  url: http://127.0.0.1:3379
  api_version: core/v2
  resource: CheckConfig
  replication_interval_seconds: 30
{{< /highlight >}}

{{< highlight json >}}
{
  "api_version": "federation/v1",
  "type": "replicator",
  "metadata": {
    "name": "my_replicator"
  },
  "spec": {
    "insecure": false,
    "url": "http://127.0.0.1:3379",
    "api_version": "core/v2",
    "resource": "CheckConfig",
    "replication_interval_seconds": 30
  }
}
{{< /highlight >}}

{{< /language-toggle >}}


[1]: ../../getting-started/enterprise
[2]: ../../api/etcdreplicators/
[3]: ../../reference/rbac/
[4]: ../../sensuctl/reference/#creating-resources
[5]: ../../guides/securing-sensu/#creating-self-signed-certificates-for-securing-etcd-and-backend-agent-communication

