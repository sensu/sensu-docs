---
title: "Etcd replicators reference"
linkTitle: "Etcd Replicators Reference"
reference_title: "Etcd replicators"
type: "reference"
description: "Etcd replicators allow you to manage RBAC resources in one place and mirror the changes to follower clusters. Read the reference to set up RBAC policy replication between Sensu clusters."
weight: 170
version: "6.4"
product: "Sensu Go"
menu:
  sensu-go-6.4:
    parent: deploy-sensu
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the EtcdReplicator datatype in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features](../../../commercial/).
{{% /notice %}}

{{% notice note %}}
**NOTE**: EtcdReplicator is a datatype in the federation API, which is only accessible for users who have a cluster role that permits access to replication resources.
{{% /notice %}}

Etcd replicators allow you to manage [RBAC][3] resources in one place and mirror the changes to follower clusters.
The API sets up etcd mirrors for one-way key replication.

The EtcdReplicator datatype will not use a namespace because it applies cluster-wide.
Therefore, only cluster role RBAC bindings will apply to it.

## Etcd replicator examples

Use the following four examples for `Role`, `RoleBinding`, `ClusterRole`, and `ClusterRoleBinding` resources to create a full replication of [RBAC policy][3].

{{% notice note %}}
**NOTE**: If you do not specify a namespace when you create a replicator, all namespaces for a given resource are replicated.
{{% /notice %}}

### `Role` resource example

{{< language-toggle >}}

{{< code yml >}}
---
type: EtcdReplicator
api_version: federation/v1
metadata:
  name: role_replicator
spec:
  ca_cert: /path/to/ssl/trusted-certificate-authorities.pem
  cert: /path/to/ssl/cert.pem
  key: /path/to/ssl/key.pem
  insecure: false
  url: http://127.0.0.1:2379
  api_version: core/v2
  resource: Role
  replication_interval_seconds: 30
{{< /code >}}

{{< code json >}}
{
  "type": "EtcdReplicator",
  "api_version": "federation/v1",
  "metadata": {
    "name": "role_replicator"
  },
  "spec": {
    "ca_cert": "/path/to/ssl/trusted-certificate-authorities.pem",
    "cert": "/path/to/ssl/cert.pem",
    "key": "/path/to/ssl/key.pem",
    "insecure": false,
    "url": "http://127.0.0.1:2379",
    "api_version": "core/v2",
    "resource": "Role",
    "replication_interval_seconds": 30
  }
}
{{< /code >}}

{{< /language-toggle >}}

### `RoleBinding` resource example

{{< language-toggle >}}

{{< code yml >}}
---
type: EtcdReplicator
api_version: federation/v1
metadata:
  name: rolebinding_replicator
spec:
  ca_cert: /path/to/ssl/trusted-certificate-authorities.pem
  cert: /path/to/ssl/cert.pem
  key: /path/to/ssl/key.pem
  insecure: false
  url: http://127.0.0.1:2379
  api_version: core/v2
  resource: RoleBinding
  replication_interval_seconds: 30
{{< /code >}}

{{< code json >}}
{
  "type": "EtcdReplicator",
  "api_version": "federation/v1",
  "metadata": {
    "name": "rolebinding_replicator"
  },
  "spec": {
    "ca_cert": "/path/to/ssl/trusted-certificate-authorities.pem",
    "cert": "/path/to/ssl/cert.pem",
    "key": "/path/to/ssl/key.pem",
    "insecure": false,
    "url": "http://127.0.0.1:2379",
    "api_version": "core/v2",
    "resource": "RoleBinding",
    "replication_interval_seconds": 30
  }
}
{{< /code >}}

{{< /language-toggle >}}

### `ClusterRole` resource example

{{< language-toggle >}}

{{< code yml >}}
---
type: EtcdReplicator
api_version: federation/v1
metadata:
  name: clusterrole_replicator
spec:
  ca_cert: /path/to/ssl/trusted-certificate-authorities.pem
  cert: /path/to/ssl/cert.pem
  key: /path/to/ssl/key.pem
  insecure: false
  url: http://127.0.0.1:2379
  api_version: core/v2
  resource: ClusterRole
  replication_interval_seconds: 30
{{< /code >}}

{{< code json >}}
{
  "type": "EtcdReplicator",
  "api_version": "federation/v1",
  "metadata": {
    "name": "clusterrole_replicator"
  },
  "spec": {
    "ca_cert": "/path/to/ssl/trusted-certificate-authorities.pem",
    "cert": "/path/to/ssl/cert.pem",
    "key": "/path/to/ssl/key.pem",
    "insecure": false,
    "url": "http://127.0.0.1:2379",
    "api_version": "core/v2",
    "resource": "ClusterRole",
    "replication_interval_seconds": 30
  }
}
{{< /code >}}

{{< /language-toggle >}}

### `ClusterRoleBinding` resource example

{{< language-toggle >}}

{{< code yml >}}
---
type: EtcdReplicator
api_version: federation/v1
metadata:
  name: clusterrolebinding_replicator
spec:
  ca_cert: /path/to/ssl/trusted-certificate-authorities.pem
  cert: /path/to/ssl/cert.pem
  key: /path/to/ssl/key.pem
  insecure: false
  url: http://127.0.0.1:2379
  api_version: core/v2
  resource: Role
  replication_interval_seconds: 30
{{< /code >}}

{{< code json >}}
{
  "type": "EtcdReplicator",
  "api_version": "federation/v1",
  "metadata": {
    "name": "clusterrolebinding_replicator"
  },
  "spec": {
    "ca_cert": "/path/to/ssl/trusted-certificate-authorities.pem",
    "cert": "/path/to/ssl/cert.pem",
    "key": "/path/to/ssl/key.pem",
    "insecure": false,
    "url": "http://127.0.0.1:2379",
    "api_version": "core/v2",
    "resource": "ClusterRoleBinding",
    "replication_interval_seconds": 30
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Critical success factors for etcd replication

Before you implement etcd replicators, review these details &mdash; they are critical to your success.

**Bind your etcd listener to an external port that is *not* the default.**

- Replication will not work if you bind your etcd listener to the default port.

**Use only addresses that clients can route to for `etcd-client-advertise-urls`.**

- If you use addresses that clients cannot route to for `etcd-client-advertise-urls`, replication may be inconsistent: it may work at first but then stop working later.

**Put the certificate and key of the follower cluster in files that the leader can access.**

- If the leader cannot access the follower cluster files that contain the certificate and key, replication will not work.

**For self-signed certificates, supply the CA certificate in the replicator definition.**

- If you have a self-signed certificate and you do not supply the CA certificate in the replicator definition, replication will not work.

**If you're using insecure mode, use TLS mutual authentication.**

- Never use insecure mode without TLS mutual authentication outside of a testbed.

**Create a replicator for each resource type you want to replicate.**

- Replicating `namespace` resources will **not** replicate the resources that belong to those namespaces.

{{% notice warning %}}
**WARNING**: Make sure to confirm your configuration.
The server will accept incorrect EtcdReplicator definitions without sending a warning.
If your configuration is incorrect, replication will not work.
{{% /notice %}}

## Create a replicator

You can use the the [federation API][2] directly or [`sensuctl create`][4] to create replicators.

When you create or update a replicator, an entry is added to the store and a new replicator process will spin up.
The replicator process watches the keyspace of the resource to be replicated and replicates all keys to the specified cluster in a last-write-wins fashion.

When the cluster starts up, each sensu-backend scans the stored replicator definitions and starts a replicator process for each replicator definition.
Source clusters with more than one sensu-backend will cause redundant writes.
This is harmless, but you should consider it when designing a replicated system.

{{% notice note %}}
**NOTE**: Create a replicator for each resource type you want to replicate.
Replicating `namespace` resources will **not** replicate the resources that belong to those namespaces.
{{% /notice %}}

## Delete a replicator

When you delete a replicator, the replicator will issue delete events to the remote cluster for all of the keys in its prefix.
It will not issue a delete of the entire key prefix (just in case the prefix is shared by keys that are local to the remote cluster).

Rather than altering an existing replicator's connection details, delete and recreate the replicator with the new connection details.

## Replicator configuration

Etcd replicators are etcd key space replicators.
Replicators contain configuration for forwarding a set of keys from one etcd cluster to another.
Replicators are configured by specifying the TLS details of the remote cluster, its URL, and a resource type.

## Etcd replicator specification

#### Top-level attributes

type         |      |
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][4] resource type. Always `EtcdReplicator.`
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: EtcdReplicator
{{< /code >}}
{{< code json >}}
{
  "type": "EtcdReplicator"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  |      |
-------------|------
description  | Top-level attribute that specifies the Sensu API version of the etcd-replicators API. Always `federation/v1`.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: federation/v1
{{< /code >}}
{{< code json >}}
{
  "api_version": "federation/v1"
}
{{< /code >}}
{{< /language-toggle >}}

metadata     |      |
-------------|------
description  | Top-level scope that contains the replicator `name` and `created_by` value. Namespace is not supported in the metadata because etcd replicators are cluster-wide resources.
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: my_replicator
  created_by: admin
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "name": "my_replicator",
    "created_by": "admin"
  }
}
{{< /code >}}
{{< /language-toggle >}}

spec         |      |
-------------|------
description  | Top-level map that includes the replicator [spec attributes][6].
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  ca_cert: /path/to/ssl/trusted-certificate-authorities.pem
  cert: /path/to/ssl/cert.pem
  key: /path/to/ssl/key.pem
  insecure: false
  url: http://127.0.0.1:2379
  api_version: core/v2
  resource: Role
  replication_interval_seconds: 30
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "ca_cert": "/path/to/ssl/trusted-certificate-authorities.pem",
    "cert": "/path/to/ssl/cert.pem",
    "key": "/path/to/ssl/key.pem",
    "insecure": false,
    "url": "http://127.0.0.1:2379",
    "api_version": "core/v2",
    "resource": "Role",
    "replication_interval_seconds": 30
  }
}
{{< /code >}}
{{< /language-toggle >}}

#### Metadata attributes

name         |      |
-------------|------
description  | Replicator name used internally by Sensu.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: my_replicator
{{< /code >}}
{{< code json >}}
{
  "name": "my_replicator"
}
{{< /code >}}
{{< /language-toggle >}}

| created_by |      |
-------------|------
description  | Username of the Sensu user who created the replicator or last updated the replicator. Sensu automatically populates the `created_by` field when the replicator is created or updated.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
created_by: admin
{{< /code >}}
{{< code json >}}
{
  "created_by": "admin"
}
{{< /code >}}
{{< /language-toggle >}}

#### Spec attributes

ca_cert      |      |
-------------|------
description  | Path to an the PEM-format CA certificate to use for TLS client authentication.
required     | true if `insecure: false` (the default configuration). If `insecure: true`, `ca_cert` is not required.
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
ca_cert: /path/to/trusted-certificate-authorities.pem
{{< /code >}}
{{< code json >}}
{
  "ca_cert": "/path/to/trusted-certificate-authorities.pem"
}
{{< /code >}}
{{< /language-toggle >}}

cert         |      |
-------------|------
description  | Path to the PEM-format certificate to use for TLS client authentication. This certificate is required for secure client communication.
required     | true if `insecure: false` (the default configuration). If `insecure: true`, `cert` is not required.
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
cert: /path/to/ssl/cert.pem
{{< /code >}}
{{< code json >}}
{
  "cert": "/path/to/ssl/cert.pem"
}
{{< /code >}}
{{< /language-toggle >}}

key          |      |
-------------|------
description  | Path to the PEM-format key file associated with the `cert` to use for TLS client authentication. This key and its corresponding certificate are required for secure client communication.
required     | true if `insecure: false` (the default configuration). If `insecure: true`, `key` is not required.
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
key: /path/to/ssl/key.pem
{{< /code >}}
{{< code json >}}
{
  "key": "/path/to/ssl/key.pem"
}
{{< /code >}}
{{< /language-toggle >}}

insecure     |      |
-------------|-------
description  | `true` to disable transport security. Otherwise, `false`. {{% notice warning %}}
**WARNING**: Disable transport security with care.
{{% /notice %}}
required     | false
type         | Boolean
default      | `false`
example      | {{< language-toggle >}}
{{< code yml >}}
insecure: false
{{< /code >}}
{{< code json >}}
{
  "insecure": false
}
{{< /code >}}
{{< /language-toggle >}}

url          |      |
-------------|-------
description  | Destination cluster URL. If specifying more than one, use a comma to separate. Replace with a non-default value for secure client communication.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
url: http://127.0.0.1:2379
{{< /code >}}
{{< code json >}}
{
  "url": "http://127.0.0.1:2379"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  |      |
-------------|-------
description  | Sensu API version of the resource to replicate.
required     | false
type         | String
default      | `core/v2`
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: core/v2
{{< /code >}}
{{< code json >}}
{
  "api_version": "core/v2"
}
{{< /code >}}
{{< /language-toggle >}}

resource     |      |
-------------|-------
description  | Name of the resource to replicate.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
resource: Role
{{< /code >}}
{{< code json >}}
{
  "resource": "Role"
}
{{< /code >}}
{{< /language-toggle >}}

<a id="namespace-attribute"></a>

namespace    |      |
-------------|-------
description  | Namespace to constrain replication to. If you do not include `namespace`, all namespaces for a given resource are replicated.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
namespace: default
{{< /code >}}
{{< code json >}}
{
  "namespace": "default"
}
{{< /code >}}
{{< /language-toggle >}}

replication_interval_seconds      |      |
----------------------------------|-------
description  | Interval at which the resource will be replicated. In seconds.
required     | false
type         | Integer
default      | 30
example      | {{< language-toggle >}}
{{< code yml >}}
replication_interval_seconds: 30
{{< /code >}}
{{< code json >}}
{
  "replication_interval_seconds": 30
}
{{< /code >}}
{{< /language-toggle >}}


[2]: ../../../api/federation/
[3]: ../../control-access/rbac/
[4]: ../../../sensuctl/create-manage-resources/#create-resources
[5]: ../secure-sensu/#create-self-signed-certificates-for-securing-etcd-and-backend-agent-communication
[6]: #spec-attributes
