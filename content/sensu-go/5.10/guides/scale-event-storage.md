---
title: "Scale Sensu Go with Enterprise Datastore"
linkTitle: "Routing Alerts with Filters"
description: ""
weight: 39
version: "5.10"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.10:
    parent: guides
---

Sensu Go's licensed-tier datastore features enable scaling your monitoring to many thousands of events per second.

- [Prerequisites](#prerequisites)
- [Configuring Postgres](#configuring-postgres-for-sensu)
- [Configuring Sensu](#configuring-sensu-for-postgres)
- [Reverting to built-in datastore](#reverting-to-builtin-datastore)

## Prerequisites

* Database server running Postgres 9.5 or later
* Postgres database, or administrative access to create one
* Postgres user with permissions to the database, or administrative access to create one
* Licensed Sensu Go backend

## Configuring Postgres

Before Sensu can start writing events to Postgres, we need a database and an account with permissions to write to that database.

If you have administrative access to Postgres, you can create the database and user yourself:

``` shell
$ sudo -u postgres psql
postgres=# CREATE DATABASE sensu_events;
CREATE DATABASE
postgres=# CREATE USER sensu WITH ENCRYPTED PASSWORD 'mypass';
CREATE ROLE
postgres=# GRANT ALL PRIVILEGES ON DATABASE sensu_events TO sensu;
GRANT
postgres-# \q
```

With this configuration complete, Postgres now has a `sensu_events` database for storing Sensu events, and a `sensu` user with permissions to that database.

By default, the Postgres user we've just added will not be able to authenticate via password, so we'll also need to make a change to the `pg_hba.conf` file. The change required will depend on how Sensu will connect to Postgres. In our case, we'll configure Postgres to allow the `sensu` user to connect to the `sensu_events` database from any host using an md5 encrypted password:

``` shell
# make a copy of the current pg_hba.conf
sudo cp /var/lib/pgsql/data/pg_hba.conf /var/tmp/pg_hba.conf.bak
# give sensu user permissions to connect to sensu_events database from any IP address
echo 'host sensu_events sensu 0.0.0.0/0 md5' | sudo tee -a /var/lib/pgsql/data/pg_hba.conf
# restart postgresql service to activate pg_hba.conf changes
sudo systemctl restart postgresql
```

With this configuration complete, we can move on to configuring Sensu to store events in our Postgres database.

## Configuring Sensu

Assuming your Sensu backend is already licensed, the configuration for routing events to Postgres is relatively straight-forward. To do so, we create a `PostgresConfig` resource which describes the database connection as a Data Source Name:

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
 sensu-centos
(1 row)


From the sensu-backend logs, we can see that our connection to postgres was successful:

{{< highlight json >}}
{"component":"store","level":"warning","msg":"trying to enable external event store","time":"2019-10-02T23:31:38Z"}
{"component":"store","level":"warning","msg":"switched event store to postgres","time":"2019-10-02T23:31:38Z"}
{{< /highlight >}}

### Reverting to built-in datastore


{"component":"store","level":"warning","msg":"store configuration deleted","store":"/sensu.io/api/enterprise/store/v1/provider/postgres01","time":"2019-10-02T23:29:06Z"}
{"component":"store","level":"warning","msg":"switched event store to etcd","time":"2019-10-02T23:29:06Z"}
