---
title: "Datastore"
description: "Sensu stores the most recent event for each entity and check pair using an embedded etcd or an external etcd instance. Sensu also supports using an external PostgreSQL instance for event storage in place of etcd (commercial feature). Read the reference to configure enterprise-scale event storage using PostgreSQL."
weight: 60
version: "5.16"
product: "Sensu Go"
menu:
  sensu-go-5.16:
    parent: reference
---

- [Event storage](#event-storage)
- [Scale event storage](#scale-event-storage) (commercial feature)
  - [Requirements](#requirements)
  - [Configuration](#configuration)
  - [Datastore specification](#datastore-specification)

## Event storage

Sensu stores the most recent event for each entity and check pair using either an embedded etcd (default) or an [external etcd][8] instance.
You can access event data with the [Sensu dashboard][9] Events page, [`sensuctl event` commands][10], and the [events API][11].
For longer retention of event data, integrate Sensu with a time series database like [InfluxDB][12] or a searchable index like ElasticSearch or Splunk.

## Scale event storage

**COMMERCIAL FEATURE**: Access enterprise-scale event storage in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][13].

Sensu supports using an external PostgreSQL instance for event storage in place of etcd.
PostgreSQL can handle significantly higher volumes of Sensu events, which allows you to scale Sensu beyond etcd's 8-GB limit.

When configured with a PostgreSQL event store, Sensu connects to PostgreSQL to store and retrieve event data in place of etcd.
Etcd continues to store Sensu entity and configuration data.
You can access event data stored in PostgreSQL using the same Sensu web UI, API, and sensuctl processes as etcd-stored events.

### Requirements

Sensu supports PostgreSQL 9.5 and later, including [Amazon Relational Database Service][3] (Amazon RDS) when configured with the PostgreSQL engine.
See the [PostgreSQL docs][14] to install and configure PostgreSQL.

### Configuration

At the time when you enable the PostgreSQL event store, event data cuts over from etcd to PostgreSQL.
This results in a loss of recent event history.
No restarts or Sensu backend configuration changes are required to enable the PostgreSQL event store.

After you install and configure PostgreSQL, configure Sensu by creating a `PostgresConfig` resource.
See [Datastore specification][18] for more information.

{{< language-toggle >}}

{{< highlight yml >}}
type: PostgresConfig
api_version: store/v1
metadata:
  name: my-postgres
spec:
  dsn: "postgresql://user:secret@host:port/dbname"
  pool_size: 20
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "PostgresConfig",
  "api_version": "store/v1",
  "metadata": {
    "name": "my-postgres"
  },
  "spec": {
    "dsn": "postgresql://user:secret@host:port/dbname",
    "pool_size": 20
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

With the `PostgresConfig` resource definition saved to a file (for example, `postgres.yml`), use sensuctl, [configured as the admin user][1], to activate the PostgreSQL event store.

{{< highlight shell >}}
sensuctl create --file postgres.yml
{{< /highlight >}}

To update your Sensu PostgreSQL configuration, repeat the `sensuctl create` process.
You can expect to see PostgreSQL status updates in the [Sensu backend logs][2] at the `warn` log level and PostgreSQL error messages in the [Sensu backend logs][2] at the `error` log level.

#### Disable the PostgreSQL event store

To disable the PostgreSQL event store, use `sensuctl delete` with your `PostgresConfig` resource definition:

{{< highlight shell >}}
sensuctl delete --file postgres.yml
{{< /highlight >}}

When you disable the PostgreSQL event store, event data cuts over from PostgreSQL to etcd, which results in a loss of recent event history.
No restarts or Sensu backend configuration changes are required to disable the PostgreSQL event store.

### Datastore specification

#### Top-level attributes

type         |      |
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][16] resource type. PostgreSQL datastore configs should always be type `PostgresConfig`.
required     | true
type         | String
example      | {{< highlight shell >}}type: PostgresConfig{{< /highlight >}}

api_version  |      |
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For PostgreSQL datastore configs, the `api_version` should be `store/v1`.
required     | true
type         | String
example      | {{< highlight shell >}}api_version: store/v1{{< /highlight >}}

metadata     |      |
-------------|------
description  | Top-level scope that contains the PostgreSQL datastore `name`.
required     | true
type         | Map of key-value pairs
example      | {{< highlight shell >}}
metadata:
  name: my-postgres
{{< /highlight >}}

spec         |      |
-------------|------
description  | Top-level map that includes the PostgreSQL datastore config [spec attributes][17].
required     | true
type         | Map of key-value pairs
example      | {{< highlight shell >}}
spec:
  dsn: "postgresql://user:secret@host:port/dbname"
  pool_size: 20
{{< /highlight >}}

#### Metadata attributes

name         |      |
-------------|------
description  | PostgreSQL datastore name used internally by Sensu.
required     | true
type         | String
example      | {{< highlight shell >}}name: my-postgres{{< /highlight >}}

#### Spec attributes

dsn          |      |
-------------|------
description  | Data source names. Specified as a URL or PostgreSQL connection string. See the [PostgreSQL docs][15] for more information about connection strings.
required     | true
type         | String
example      | {{< highlight shell >}}dsn: "postgresql://user:secret@host:port/dbname"{{< /highlight >}}

pool_size    |      |
-------------|------
description  | Maximum number of connections to hold in the PostgreSQL connection pool. We recommend `20` for most instances. 
required     | false
default      | `0` (unlimited)
type         | Integer
example      | {{< highlight shell >}}pool_size: 20{{< /highlight >}}

[1]: ../../sensuctl/reference/#first-time-setup
[2]: ../../guides/troubleshooting/
[3]: https://aws.amazon.com/rds/
[8]: ../../guides/clustering/#using-an-external-etcd-cluster
[9]: ../../dashboard/overview/
[10]: ../../sensuctl/reference/#sensuctl-event
[11]: ../../api/events/
[12]: ../../guides/influx-db-metric-handler/
[13]: ../../getting-started/enterprise/
[14]: https://www.postgresql.org
[15]: https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING
[16]: ../../sensuctl/reference#create-resources
[17]: #spec-attributes
[18]: #specification
