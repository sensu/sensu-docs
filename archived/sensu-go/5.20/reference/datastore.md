---
title: "Datastore"
reference_title: "Datastore"
type: "reference"
description: "Sensu stores the most recent event for each entity and check pair using an embedded etcd or an external etcd instance. Sensu also supports using an external PostgreSQL instance for event storage in place of etcd (commercial feature). Read the reference to configure enterprise-scale event storage using PostgreSQL."
weight: 60
version: "5.20"
product: "Sensu Go"
menu:
  sensu-go-5.20:
    parent: reference
---

Sensu stores the most recent event for each entity and check pair using either an embedded etcd (default) or an [external etcd][8] instance.
You can access event data with the [Sensu web UI][9] Events page, [`sensuctl event` commands][10], and the [events API][11].
For longer retention of event data, integrate Sensu with a time series database like [InfluxDB][12] or a searchable index like ElasticSearch or Splunk.

## Scale event storage

**COMMERCIAL FEATURE**: Access enterprise-scale event storage in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][13].

Sensu supports using an external PostgreSQL instance for event storage in place of etcd.
PostgreSQL can handle significantly higher volumes of Sensu events, which allows you to scale Sensu beyond etcd's 8-GB limit.

When configured with a PostgreSQL event store, Sensu connects to PostgreSQL to store and retrieve event data in place of etcd.
Etcd continues to store Sensu entity and configuration data.
You can access event data stored in PostgreSQL using the same Sensu web UI, API, and sensuctl processes as etcd-stored events.

## Requirements

Sensu supports PostgreSQL 9.5 and later, including [Amazon Relational Database Service][3] (Amazon RDS) when configured with the PostgreSQL engine.
See the [PostgreSQL docs][14] to install and configure PostgreSQL.

## Configuration

At the time when you enable the PostgreSQL event store, event data cuts over from etcd to PostgreSQL.
This results in a loss of recent event history.
No restarts or Sensu backend configuration changes are required to enable the PostgreSQL event store.

When you successfully enable PostgreSQL as the Sensu Go event store, the Sensu backend log will include a message like this:

{{< code shell >}}
Mar 10 17:44:45 sensu-centos sensu-backend[1365]: {"component":"store-providers","level":"warning","msg":"switched event store to postgres","time":"2020-03-10T17:44:45Z"}
{{< /code >}}

After you install and configure PostgreSQL, configure Sensu by creating a `PostgresConfig` resource.
See [Datastore specification][18] for more information.

{{< language-toggle >}}

{{< code yml >}}
type: PostgresConfig
api_version: store/v1
metadata:
  name: my-postgres
spec:
  dsn: "postgresql://user:secret@host:port/dbname"
  max_conn_lifetime: 5m
  max_idle_conns: 2
  pool_size: 20
{{< /code >}}

{{< code json >}}
{
  "type": "PostgresConfig",
  "api_version": "store/v1",
  "metadata": {
    "name": "my-postgres"
  },
  "spec": {
    "dsn": "postgresql://user:secret@host:port/dbname",
    "max_conn_lifetime": "5m",
    "max_idle_conns": 2,
    "pool_size": 20
  }
}
{{< /code >}}

{{< /language-toggle >}}

With the `PostgresConfig` resource definition saved to a file (for example, `postgres.yml`), use sensuctl, [configured as the admin user][1], to activate the PostgreSQL event store.

{{< code shell >}}
sensuctl create --file postgres.yml
{{< /code >}}

To update your Sensu PostgreSQL configuration, repeat the `sensuctl create` process.
You can expect to see PostgreSQL status updates in the [Sensu backend logs][2] at the `warn` log level and PostgreSQL error messages in the [Sensu backend logs][2] at the `error` log level.

### Disable the PostgreSQL event store

To disable the PostgreSQL event store, use `sensuctl delete` with your `PostgresConfig` resource definition:

{{< code shell >}}
sensuctl delete --file postgres.yml
{{< /code >}}

The Sensu backend log will include a message to record that you successfully disabled PostgreSQL as the Sensu Go event store:

{{< code shell >}}
Mar 10 17:35:04 sensu-centos sensu-backend[1365]: {"component":"store-providers","level":"warning","msg":"switched event store to etcd","time":"2020-03-10T17:35:04Z"}
{{< /code >}}

When you disable the PostgreSQL event store, event data cuts over from PostgreSQL to etcd, which results in a loss of recent event history.
No restarts or Sensu backend configuration changes are required to disable the PostgreSQL event store.

## Datastore specification

### Top-level attributes

type         |      |
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][16] resource type. PostgreSQL datastore configs should always be type `PostgresConfig`.
required     | true
type         | String
example      | {{< code shell >}}type: PostgresConfig{{< /code >}}

api_version  |      |
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For PostgreSQL datastore configs, the `api_version` should be `store/v1`.
required     | true
type         | String
example      | {{< code shell >}}api_version: store/v1{{< /code >}}

metadata     |      |
-------------|------
description  | Top-level scope that contains the PostgreSQL datastore `name` and `created_by` field.
required     | true
type         | Map of key-value pairs
example      | {{< code shell >}}
metadata:
  name: my-postgres
  created_by: admin
{{< /code >}}

spec         |      |
-------------|------
description  | Top-level map that includes the PostgreSQL datastore config [spec attributes][17].
required     | true
type         | Map of key-value pairs
example      | {{< code shell >}}
spec:
  dsn: "postgresql://user:secret@host:port/dbname"
  max_conn_lifetime: 5m
  max_idle_conns: 2
  pool_size: 20
{{< /code >}}

### Metadata attributes

name         |      |
-------------|------
description  | PostgreSQL datastore name used internally by Sensu.
required     | true
type         | String
example      | {{< code shell >}}name: my-postgres{{< /code >}}

| created_by |      |
-------------|------
description  | Username of the Sensu user who created the datastore or last updated the datastore. Sensu automatically populates the `created_by` field when the datastore is created or updated.
required     | false
type         | String
example      | {{< code shell >}}created_by: admin{{< /code >}}

### Spec attributes

dsn          |      |
-------------|------
description  | Data source names. Specified as a URL or [PostgreSQL connection string][15]. The Sensu backend uses the golang pq library, which supports a [subset of the PostgreSQL libpq connection string parameters][4].
required     | true
type         | String
example      | {{< code shell >}}dsn: "postgresql://user:secret@host:port/dbname"{{< /code >}}

max_conn_lifetime    |      |
-------------|------
description  | Maximum time a connection can persist before being destroyed. Specify values with a numeral and a letter indicator: `s` to indicate seconds, `m` to indicate minutes, and `h` to indicate hours. For example, `1m`, `2h`, and `2h1m3s` are valid. 
required     | false
type         | String
example      | {{< code shell >}}max_conn_lifetime: 5m{{< /code >}}

max_idle_conns    |      |
-------------|------
description  | Maximum number of number of idle connections to retain. 
required     | false
default      | `2`
type         | Integer
example      | {{< code shell >}}max_idle_conns: 2{{< /code >}}

pool_size    |      |
-------------|------
description  | Maximum number of connections to hold in the PostgreSQL connection pool. We recommend `20` for most instances. 
required     | false
default      | `0` (unlimited)
type         | Integer
example      | {{< code shell >}}pool_size: 20{{< /code >}}

[1]: ../../sensuctl/#first-time-setup
[2]: ../../operations/maintain-sensu/troubleshoot/
[3]: https://aws.amazon.com/rds/
[4]: https://pkg.go.dev/github.com/lib/pq@v1.2.0#hdr-Connection_String_Parameters
[8]: ../../operations/deploy-sensu/cluster-sensu/#use-an-external-etcd-cluster
[9]: ../../web-ui/
[10]: ../../sensuctl/create-manage-resources/#sensuctl-event
[11]: ../../api/events/
[12]: ../../guides/influx-db-metric-handler/
[13]: ../../commercial/
[14]: https://www.postgresql.org
[15]: https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING
[16]: ../../sensuctl/create-manage-resources/#create-resources
[17]: #spec-attributes
[18]: #datastore-specification
