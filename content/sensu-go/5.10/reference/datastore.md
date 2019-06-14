---
title: "Datastore"
description: "Sensu stores the most recent event for each entity and check pair using an embedded etcd (default) or an external etcd instance. Sensu also supports using an external PostgreSQL instance for event storage in place of etcd (licensed-tier only). Read the reference to configure enterprise-scale event storage using PostgreSQL."
weight: 10
version: "5.10"
product: "Sensu Go"
menu:
  sensu-go-5.10:
    parent: reference
---

- [Event storage](#event-storage)
- [Scaling event storage](#scaling-event-storage) (licensed-tier only)
  - [Requirements](#requirements)
  - [Configuration](#configuration)
  - [Specification](#specification)

## Event storage

Sensu stores the most recent event for each entity and check pair using an embedded etcd (default) or an [external etcd][8] instance.
You can access event data using the [dashboard][9] events page, [`sensuctl event` commands][10], and the [events API][11].
To store event data over time, we recommend integrating Sensu with a time series database, like [InfluxDB][12].

## Scaling event storage

**LICENSED TIER**: Unlock enterprise-scale event storage in Sensu Go with a Sensu license. To activate your license, see the [getting started guide][13].

Sensu supports using an external PostgreSQL instance for event storage in place of etcd.
PostgreSQL can handle significantly higher volumes of Sensu events, letting you scale Sensu beyond etcd's 8GB limit.

Configured with a PostgreSQL event store, Sensu connects to PostgreSQL to store and retrieve event data in place of etcd, while etcd continues to store Sensu configuration data.
You can access event data stored in PostgreSQL using the same Sensu web UI, API, and sensuctl processes as etcd-stored events.

### Requirements

Sensu supports PostgreSQL 9.5 and later, including [Amazon Relational Database Service][3] (Amazon RDS) when configured with the PostgreSQL engine.
See the [PostgreSQL docs][14] to install and configure PostgreSQL.

### Configuration

At the time of enabling the PostgreSQL event store, event data cuts over from etcd to PostgreSQL, resulting in a loss of recent event history.
No restarts or Sensu backend configuration changes are required to enable the PostgreSQL event store.

_WARNING: In Sensu Go 5.10, the PostgreSQL event store cannot be disabled once configured. We'll be adding this functionality in an upcoming release, so keep an eye on the [announcements section of Discourse][4] for updates._

After installing and configuring PostgreSQL, configure Sensu by creating a `PostgresConfig` resource. See the [specification](#specification) for more information.

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

With the `PostgresConfig` resource definition saved to a file (for example: postgres.yml), use sensuctl, [configured as the admin user][1], to activate the PostgreSQL event store.

{{< highlight shell >}}
sensuctl create --file postgres.yml
{{< /highlight >}}

At this time, there is no supported method for viewing or deleting a `PostgresConfig` resource.
To update your Sensu PostgreSQL configuration, repeat the `sensuctl create` process shown above.
You can expect to see PostgreSQL status updates and error messages in the [Sensu backend logs][2] at the `warn` and `error` log levels, respectively.

### Specification

#### Top-level attributes

type         |      |
-------------|------
description  | Top-level attribute specifying the [`sensuctl create`][sc] resource type. PostgreSQL datastore configs should always be of type `PostgresConfig`.
required     | true
type         | String
example      | {{< highlight shell >}}type: PostgresConfig{{< /highlight >}}

api_version  |      |
-------------|------
description  | Top-level attribute specifying the Sensu API group and version. For PostgreSQL datastore configs in Sensu backend version 5.10, this attribute should always be `store/v1`.
required     | true
type         | String
example      | {{< highlight shell >}}api_version: store/v1{{< /highlight >}}

metadata     |      |
-------------|------
description  | Top-level scope containing the PostgreSQL datastore `name`.
required     | true
type         | Map of key-value pairs
example      | {{< highlight shell >}}
metadata:
  name: my-postgres
{{< /highlight >}}

spec         |      |
-------------|------
description  | Top-level map that includes the PostgreSQL datastore config [spec attributes][sp].
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
description  | The PostgreSQL datastore name used internally by Sensu
required     | true
type         | String
example      | {{< highlight shell >}}name: my-postgres{{< /highlight >}}

#### Spec attributes

dsn          |      |
-------------|------
description  | Use the `dsn` attribute to specify the data source names as a URL or PostgreSQL connection string. See the [PostgreSQL docs][15] for more information about connection strings.
required     | true
type         | String
example      | {{< highlight shell >}}dsn: "postgresql://user:secret@host:port/dbname"{{< /highlight >}}

pool_size    |      |
-------------|------
description  | The maximum number of connections to hold in the PostgreSQL connection pool. We recommend `20` for most instances. 
required     | false
default      | `0` (unlimited)
type         | Integer
example      | {{< highlight shell >}}pool_size: 20{{< /highlight >}}

[1]: ../../sensuctl/reference/#first-time-setup
[2]: ../../guides/troubleshooting
[3]: https://aws.amazon.com/rds/
[4]: https://discourse.sensu.io/c/announcements
[8]: ../../guides/clustering/#using-an-external-etcd-cluster
[9]: ../../dashboard/overview
[10]: ../../sensuctl/reference/#sensuctl-event
[11]: ../../api/events
[12]: ../../guides/influx-db-metric-handler
[13]: ../../getting-started/enterprise
[14]: https://www.postgresql.org
[15]: https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING
[sc]: ../../sensuctl/reference#creating-resources
[sp]: #spec-attributes
