---
title: "Scale Sensu Go with Enterprise Datastore"
linkTitle: "Scaling with Enterprise datastore"
description: ""
weight: 39
version: "5.10"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.10:
    parent: guides
---

Sensu Go's licensed-tier datastore feature enables scaling your monitoring to many thousands of events per second.

- [Why use the Enterprise datastore?](#why-enterprise-datastore)
- [Prerequisites](#prerequisites)
- [Configure Postgres](#configure-postgres-for-sensu)
- [Configure Sensu](#configure-sensu-for-postgres)
- [Revert to built-in datastore](#revert-to-builtin-datastore)

## Why use the Enterprise datastore? {#why-enterprise-datastore}

For each unique entity/check pair, Sensu records the latest event object in its datastore. By default, Sensu uses the embedded etcd datastore for event storage. The embedded etcd datastore helps you get started, but as the number of entities and checks in your Sensu implementation grows, so does the rate of events being written to the datastore. In a clustered deployment of etcd, whether embedded or external to Sensu, each event received by a member of the cluster must be replicated to other members, increasing network and disk IO utilization. 

Our team documented configuration and testing of Sensu running on bare metal infrastructure in the [sensu/sensu-perf][2] project. This configuration comfortably handled 12,000 Sensu agent connections (and their keepalives) and processed more than 8,500 events per second. 

This rate of events should be more than sufficient for many installations but assumes an ideal scenario where Sensu backend nodes use direct-attached, dedicated non-volatile memory express (NVMe) storage and are connected to a dedicated LAN. Deployments on public cloud providers are not likely to achieve similar results due to sharing both disk and network bandwidth with other tenants. Following the cloud provider's recommended practices may also become a factor because many operators are inclined to deploy a cluster across multiple availability zones. In such a deployment cluster, communication happens over shared WAN links, which are subject to uncontrolled variability in throughput and latency.

Using the Enterprise datastore can help operators achieve much higher rates of event processing and minimize the replication communication between etcd peers. The `sensu-perf` test environment comfortably handles 40,000 Sensu agent connections (and their keepalives) and processes more than 36,000 events per second under ideal conditions. 

## Prerequisites

* Database server running Postgres 9.5 or later
* Postgres database (or administrative access to create one)
* Postgres user with permissions to the database (or administrative access to create such a user)
* [Licensed Sensu Go backend][3]

## Configure Postgres {#configure-postgres-for-sensu}

Before Sensu can start writing events to Postgres, you need a database and an account with permissions to write to that database. To provide consistent event throughput, we strongly recommend exclusively dedicating your Postgres instance to storage of Sensu events.

If you have administrative access to Postgres, you can create the database and user:

{{< highlight shell >}}
$ sudo -u postgres psql
postgres=# CREATE DATABASE sensu_events;
CREATE DATABASE
postgres=# CREATE USER sensu WITH ENCRYPTED PASSWORD 'mypass';
CREATE ROLE
postgres=# GRANT ALL PRIVILEGES ON DATABASE sensu_events TO sensu;
GRANT
postgres-# \q
{{< /highlight >}}

With this configuration complete, Postgres will have a `sensu_events` database for storing Sensu events and a `sensu` user with permissions to that database.

By default, the Postgres user you've just added will not be able to authenticate via password, so you'll also need to make a change to the `pg_hba.conf` file. The required change will depend on how Sensu will connect to Postgres. In this case, you'll configure Postgres to allow the `sensu` user to connect to the `sensu_events` database from any host using an [md5][5]-encrypted password:

{{< highlight shell >}}
# make a copy of the current pg_hba.conf
sudo cp /var/lib/pgsql/data/pg_hba.conf /var/tmp/pg_hba.conf.bak
# give sensu user permissions to connect to sensu_events database from any IP address
echo 'host sensu_events sensu 0.0.0.0/0 md5' | sudo tee -a /var/lib/pgsql/data/pg_hba.conf
# restart postgresql service to activate pg_hba.conf changes
sudo systemctl restart postgresql
{{< /highlight >}}

With this configuration complete, you can configure Sensu to store events in your Postgres database.

_NOTE: If your Sensu Go license expires, event storage will automatically revert to etcd. See [Revert to built-in datastore](#revert-to-builtin-datastore) below._

## Configure Sensu {#configure-sensu-for-postgres}

If your Sensu backend is already licensed, the configuration for routing events to Postgres is relatively straightforward. Create a `PostgresConfig` resource that describes the database connection as a data source name (DSN):

{{< language-toggle >}}

{{< highlight yml >}}
type: PostgresConfig
api_version: store/v1
metadata:
  name: postgres01
spec:
  dsn: "postgresql://sensu:mypass@10.0.2.15:5432/sensu_events?sslmode=disable"
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
    "dsn": "postgresql://sensu:mypass@10.0.2.15:5432/sensu_events",
    "pool_size": 20
  }
}
{{< /highlight >}}

{{< /language-toggle >}}


This configuration is written to disk as `my-postgres.yml`, and you can install it using `sensuctl`:

{{< highlight shell >}}
sensuctl create -f my-postgres.yml
{{< /highlight >}}

The Sensu backend is now configured to use Postgres for event storage! 

In the web UI and in `sensuctl`, event history will appear incomplete. When Postgres configuration is provided and the backend successfully connects to the database, etcd event history is not migrated. New events will be written to Postgres as they are processed, with the Postgres datastore ultimately being brought up to date with the current state of your monitored infrastructure.

Aside from event history, which is not migrated from etcd, there's no observable difference when using Postgres as the event store, and neither interface supports displaying the PostgresConfig type.

To verify that the change was effective and your connection to Postgres was successful, look at the [`sensu-backend` log][4]:

{{< highlight shell >}}
{"component":"store","level":"warning","msg":"trying to enable external event store","time":"2019-10-02T23:31:38Z"}
{"component":"store","level":"warning","msg":"switched event store to postgres","time":"2019-10-02T23:31:38Z"}
{{< /highlight >}}

You can also use `psql` to verify that events are being written to the `sensu_events` database. This code illustrates connecting to the `sensu_events` database, listing the tables in the database, and requesting a list of all entities reporting keepalives:

{{< highlight shell >}}
postgres=# \c sensu_events
You are now connected to database "sensu_events" as user "postgres".
sensu_events=# \dt
             List of relations
 Schema |       Name        | Type  | Owner 
--------+-------------------+-------+-------
 public | events            | table | sensu
 public | migration_version | table | sensu
(2 rows)
sensu_events=# select sensu_entity from events where sensu_check = 'keepalive';
 sensu_entity 
--------------
 i-414141
 i-424242
 i-434343
(3 rows)
{{ /highlight }}


### Revert to built-in datastore (#revert-to-builtin-datastore)

In Sensu Go 5.10 there is no supported method for viewing or deleting a PostgresConfig resource.
To delete PostgresConfig resources and thereby revert to the built-in datastore, please upgrade to the latest version of Sensu Go.

_NOTE: If your Sensu Go license expires, event storage will automatically revert to etcd._

[2]: https://github.com/sensu/sensu-perf
[3]: ../getting-started/enterprise
[4]: ../guides/troubleshooting/#log-file-locations
[5]: https://www.postgresql.org/docs/9.5/auth-methods.html#AUTH-PASSWORD
