---
title: "Etcd replicators"
linkTitle: "Etcd Replicators"
reference_title: "Etcd replicators"
type: "reference"
description: "Etcd replicators allow you to manage RBAC resources in one place and mirror the changes to follower clusters. Read the reference to set up RBAC policy replication between Sensu clusters."
weight: 80
version: "5.20"
product: "Sensu Go"
menu:
  sensu-go-5.20:
    parent: reference
---

**COMMERCIAL FEATURE**: Access the etcd-replicators datatype in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][1].

{{% notice note %}}
**NOTE**: etcd-replicators is a datatype in the federation API, which is only accessible for users who have a cluster role that permits access to replication resources.
{{% /notice %}}

Etcd replicators allow you to manage [RBAC][3] resources in one place and mirror the changes to follower clusters.
The API sets up etcd mirrors for one-way key replication.

The etcd-replicators datatype will not use a namespace because it applies cluster-wide.
Therefore, only cluster role RBAC bindings will apply to it.

## Create a replicator

You can use [`sensuctl create`][4] or the Sensu web UI to create replicators.

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

## etcd-replicators specification

#### Top-level attributes

type         |      |
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][4] resource type. Always `EtcdReplicator.`
required     | true
type         | String
example      | {{< code shell >}}type: EtcdReplicator{{< /code >}}

api_version  |      |
-------------|------
description  | Top-level attribute that specifies the Sensu API version of the etcd-replicators API. Always `federation/v1`.
required     | true
type         | String
example      | {{< code shell >}}api_version: federation/v1{{< /code >}}

metadata     |      |
-------------|------
description  | Top-level scope that contains the replicator `name` and `created_by` value. Namespace is not supported in the metadata because etcd replicators are cluster-wide resources.
required     | true
type         | Map of key-value pairs
example      | {{< code shell >}}
metadata:
  name: my_replicator
  created_by: admin
{{< /code >}}

spec         |      |
-------------|------
description  | Top-level map that includes the replicator [spec attributes][6].
required     | true
type         | Map of key-value pairs
example      | {{< code shell >}}
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

#### Metadata attributes

name         |      |
-------------|------
description  | Replicator name used internally by Sensu.
required     | true
type         | String
example      | {{< code shell >}}name: my_replicator{{< /code >}}

| created_by |      |
-------------|------
description  | Username of the Sensu user who created the replicator or last updated the replicator. Sensu automatically populates the `created_by` field when the replicator is created or updated.
required     | false
type         | String
example      | {{< code shell >}}created_by: admin{{< /code >}}

#### Spec attributes

ca_cert      |      |
-------------|------
description  | Path to an the PEM-format CA certificate to use for TLS client authentication.
required     | true if `insecure: false` (which is the default configuration). If `insecure: true`, `ca_cert` is not required.
type         | String
example      | {{< code shell >}}ca_cert: /path/to/trusted-certificate-authorities.pem{{< /code >}}

cert         |      |
-------------|------
description  | Path to the PEM-format certificate to use for TLS client authentication.
required     | true if `insecure: false` (which is the default configuration). If `insecure: true`, `cert` is not required.
type         | String
example      | {{< code shell >}}cert: /path/to/ssl/cert.pem{{< /code >}}

key          |      |
-------------|------
description  | Path to the PEM-format key file associated with the `cert` to use for TLS client authentication.
required     | true if `insecure: false` (which is the default configuration). If `insecure: true`, `key` is not required.
type         | String
example      | {{< code shell >}}key: /path/to/ssl/key.pem{{< /code >}}

insecure     |      |
-------------|-------
description  | `true` to disable transport security. Otherwise, `false`. {{% notice note %}}
**NOTE**: Disable transport security with care.
{{% /notice %}}
required     | false
type         | Boolean
default      | `false`
example      | {{< code shell >}}insecure: false{{< /code >}}

url          |      |
-------------|-------
description  | Destination cluster URL. If specifying more than one, use a comma to separate.
required     | true
type         | String
example      | {{< code shell >}}url: http://127.0.0.1:2379 {{< /code >}}

api_version  |      |
-------------|-------
description  | Sensu API version of the resource to replicate.
required     | false
type         | String
default      | `core/v2`
example      | {{< code shell >}}api_version: core/v2{{< /code >}}

resource     |      |
-------------|-------
description  | Name of the resource to replicate.
required     | true
type         | String
example      | {{< code shell >}}resource: Role{{< /code >}}

<a name="namespace-attribute"></a>

namespace    |      |
-------------|-------
description  | Namespace to constrain replication to. If you do not include `namespace`, all namespaces for a given resource are replicated.
required     | false
type         | String
example      | {{< code shell >}}namespace: default{{< /code >}}

replication_interval_seconds      |      |
----------------------------------|-------
description  | Interval at which the resource will be replicated. In seconds.
required     | false
type         | String
default      | 30
example      | {{< code shell >}}replication_interval_seconds: 30{{< /code >}}

## Example EtcdReplicator resources

If you replicate the following four examples for `Role`, `RoleBinding`, `ClusterRole`, and `ClusterRoleBinding` resources, you can expect a full replication of [RBAC policy][3].

{{% notice note %}}
**NOTE**: If you do not specify a namespace when you create a replicator, all namespaces for a given resource are replicated.
{{% /notice %}}

### Example `Role` resource

{{< language-toggle >}}

{{< code yml >}}
api_version: federation/v1
type: EtcdReplicator
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
  "api_version": "federation/v1",
  "type": "EtcdReplicator",
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

### Example `RoleBinding` resource

{{< language-toggle >}}

{{< code yml >}}
api_version: federation/v1
type: EtcdReplicator
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
  "api_version": "federation/v1",
  "type": "EtcdReplicator",
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

### Example `ClusterRole` resource

{{< language-toggle >}}

{{< code yml >}}
api_version: federation/v1
type: EtcdReplicator
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
  "api_version": "federation/v1",
  "type": "EtcdReplicator",
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

### Example `ClusterRoleBinding` resource

{{< language-toggle >}}

{{< code yml >}}
api_version: federation/v1
type: EtcdReplicator
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
  "api_version": "federation/v1",
  "type": "EtcdReplicator",
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
**WARNING**: Make sure to confirm your configuration. The server will accept incorrect EtcdReplicator definitions without sending a warning. If your configuration is incorrect, replication will not work.
{{% /notice %}}

[1]: ../../commercial/
[2]: ../../api/etcdreplicators/
[3]: ../rbac/
[4]: ../../sensuctl/create-manage-resources/#create-resources
[5]: ../../operations/deploy-sensu/secure-sensu/#create-self-signed-certificates-for-securing-etcd-and-backend-agent-communication
[6]: #spec-attributes
