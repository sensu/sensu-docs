---
title: "Scale Sensu Go with Enterprise datastore"
linkTitle: "Scale with Enterprise Datastore"
guide_title: "Scale Sensu Go with Enterprise datastore"
type: "guide"
description: "Use Sensu's Enterprise datastore to scale your monitoring to thousands of events per second and minimize the replication communication between etcd peers."
weight: 120
version: "6.7"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.7:
    parent: deploy-sensu
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the datastore feature in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

Sensu Go's datastore feature enables scaling your monitoring to many thousands of events per second.

For each unique entity/check pair, Sensu records the latest event object in its datastore.
By default, Sensu uses the embedded etcd datastore for event storage.
The embedded etcd datastore helps you get started, but as the number of entities and checks in your Sensu implementation grows, so does the rate of events being written to the datastore.
In a clustered deployment of etcd, whether embedded or external to Sensu, each event received by a member of the cluster must be replicated to other members, increasing network and disk IO utilization.

Our team documented configuration and testing of Sensu running on bare metal infrastructure in the [sensu/sensu-perf][1] project.
This configuration comfortably handled 12,000 Sensu agent connections (and their keepalives) and processed more than 8,500 events per second.

This rate of events should be sufficient for many installations but assumes an ideal scenario where Sensu backend nodes use direct-attached, dedicated non-volatile memory express (NVMe) storage and are connected to a dedicated LAN.
Deployments on public cloud providers are not likely to achieve similar results due to sharing both disk and network bandwidth with other tenants.
Adhering to the cloud provider's recommended practices may also become a factor because many operators are inclined to deploy a cluster across multiple availability zones.
In such a deployment cluster, communication happens over shared WAN links, which are subject to uncontrolled variability in throughput and latency.

The Enterprise datastore can help operators achieve much higher rates of event processing and minimize the replication communication between etcd peers.
The `sensu-perf` test environment comfortably handles 40,000 Sensu agent connections (and their keepalives) and processes more than 36,000 events per second under ideal conditions.

{{% notice warning %}}
**IMPORTANT**: PostgreSQL configuration file locations differ depending on platform.
The steps in this guide use common paths for RHEL/CentOS, but the files may be stored elsewhere on your system.
Learn more about [PostgreSQL configuration file locations](https://www.postgresql.org/docs/current/runtime-config-file-locations.html).
{{% /notice %}}

## Prerequisites

* Database server running Postgres 9.5 or later
* Postgres database (or administrative access to create one)
* Postgres user with permissions to the database (or administrative access to create such a user)
* [Licensed Sensu Go backend][3]

For optimal performance, we recommend the following PostgreSQL configuration parameters and settings as a starting point for your `postgresql.conf` file:

{{< code postgresql >}}
max_connections = 200

shared_buffers = 10GB

maintenance_work_mem = 1GB

vacuum_cost_delay = 10ms
vacuum_cost_limit = 10000

bgwriter_delay = 50ms
bgwriter_lru_maxpages = 1000

max_worker_processes = 8
max_parallel_maintenance_workers = 2
max_parallel_workers_per_gather = 2
max_parallel_workers = 8

synchronous_commit = off

wal_sync_method = fdatasync
wal_writer_delay = 5000ms
max_wal_size = 5GB
min_wal_size = 1GB

checkpoint_completion_target = 0.9

autovacuum_naptime = 10s
autovacuum_vacuum_scale_factor = 0.05
autovacuum_analyze_scale_factor = 0.025
{{< /code >}}

Adjust the parameters and settings as needed based on your hardware and the performance you observe.
Read the [PostgreSQL parameters documentation][2] for information about setting parameters.

## Configure Postgres

Before Sensu can start writing events to Postgres, you need a database and an account with permissions to write to that database.
To provide consistent event throughput, we recommend exclusively dedicating your Postgres instance to storage of Sensu events.

If you have administrative access to Postgres, you can create the database and user.

1. Change to the postgres user and open the Postgres prompt (`postgres=#`):

   {{< code shell >}}
sudo -u postgres psql
{{< /code >}}

2. Create the `sensu_events` database:

   {{< code postgresql >}}
CREATE DATABASE sensu_events;
{{< /code >}}

   Postgres will return a confirmation message: `CREATE DATABASE`.

3. Create the `sensu` role with a password:

   {{< code postgresql >}}
CREATE USER sensu WITH ENCRYPTED PASSWORD 'mypass';
{{< /code >}}

   Postgres will return a confirmation message: `CREATE ROLE`.

4. Grant the `sensu` role all privileges for the `sensu_events` database:

   {{< code postgresql >}}
GRANT ALL PRIVILEGES ON DATABASE sensu_events TO sensu;
{{< /code >}}

   Postgres will return a confirmation message: `GRANT`.

5. Type `\q` to exit the PostgreSQL prompt.

With this configuration complete, Postgres will have a `sensu_events` database for storing Sensu events and a `sensu` user with permissions to that database.

By default, the Postgres user you've just added will not be able to authenticate via password, so you'll also need to make a change to the `pg_hba.conf` file.
The required change will depend on how Sensu will connect to Postgres.
In this case, you'll configure Postgres to allow the `sensu` user to connect to the `sensu_events` database from any host using an [md5][5]-encrypted password:

1. Make a copy of the current `pg_hba.conf` file:

   {{< code shell >}}
sudo cp /var/lib/pgsql/data/pg_hba.conf /var/tmp/pg_hba.conf.bak
{{< /code >}}

2. Give the Sensu user permissions to connect to the `sensu_events` database from any IP address:

   {{< code shell >}}
echo 'host sensu_events sensu 0.0.0.0/0 md5' | sudo tee -a /var/lib/pgsql/data/pg_hba.conf
{{< /code >}}

3. Restart the postgresql service to activate the `pg_hba.conf` changes:

   {{< code shell >}}
sudo systemctl restart postgresql
{{< /code >}}

With this configuration complete, you can configure Sensu to store events in your Postgres database.

## Configure Sensu

If your Sensu backend is already licensed, the configuration for routing events to Postgres is relatively straightforward.
Create a `PostgresConfig` resource that describes the database connection as a data source name (DSN):

{{< language-toggle >}}

{{< code yml >}}
---
type: PostgresConfig
api_version: store/v1
metadata:
  name: postgres01
spec:
  dsn: "postgresql://sensu:mypass@10.0.2.15:5432/sensu_events?sslmode=disable"
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
    "dsn": "postgresql://sensu:mypass@10.0.2.15:5432/sensu_events",
    "pool_size": 20
  }
}
{{< /code >}}

{{< /language-toggle >}}

Save this configuration as `my-postgres.yml` or `my-postgres.json` and install it with `sensuctl`:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl create --file my-postgres.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl create --file my-postgres.json
{{< /code >}}

{{< /language-toggle >}}

The Sensu backend is now configured to use Postgres for event storage!

In the web UI and in sensuctl, event history will appear incomplete.
When Postgres configuration is provided and the backend successfully connects to the database, etcd event history is not migrated.
New events will be written to Postgres as they are processed, with the Postgres datastore ultimately being brought up to date with the current state of your monitored infrastructure.

Aside from event history, which is not migrated from etcd, there's no observable difference when using Postgres as the event store, and neither interface supports displaying the PostgresConfig type.

To verify that the change was effective and your connection to Postgres was successful, look at the [sensu-backend log][4]:

{{< code shell >}}
{"component":"store","level":"warning","msg":"trying to enable external event store","time":"2019-10-02T23:31:38Z"}
{"component":"store","level":"warning","msg":"switched event store to postgres","time":"2019-10-02T23:31:38Z"}
{{< /code >}}

You can also use `psql` to verify that events are being written to the `sensu_events` database.

1. Change to the postgres user and open the Postgres prompt (`postgres=#`):

   {{< code shell >}}
sudo -u postgres psql
{{< /code >}}

2. Connect to the `sensu_events` database:

   {{< code postgresql >}}
\c sensu_events
{{< /code >}}

   Postgres will return a confirmation message:

   {{< code postgresql >}}
You are now connected to database "sensu_events" as user "postgres".
{{< /code >}}

   The prompt will change to `sensu_events=#`.

3. List the tables in the `sensu_events` database:

   {{< code postgresql >}}
\dt
{{< /code >}}

   Postgres will list the tables:

   {{< code postgresql >}}
             List of relations
 Schema |       Name        | Type  | Owner 
--------+-------------------+-------+-------
 public | events            | table | sensu
 public | migration_version | table | sensu
(2 rows)
{{< /code >}}

4. Request a list of all entities reporting keepalives:

   {{< code postgresql >}}
select sensu_entity from events where sensu_check = 'keepalive';
{{< /code >}}

   Postgres will return a list of the entities:

   {{< code postgresql >}}
 sensu_entity 
--------------
 i-414141
 i-424242
 i-434343
(3 rows)
{{< /code >}}

## Revert to the built-in datastore

If you want to revert to the default etcd event store, delete the PostgresConfig resource.
In this example, `my-postgres.yml` or `my-postgres.json` contain the same configuration you used to configure the Enterprise event store earlier in this guide:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl delete --file my-postgres.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl delete --file my-postgres.json
{{< /code >}}

{{< /language-toggle >}}

To verify that the change was effective, look for messages similar to these in the [sensu-backend log][4]:

{{< code shell >}}
{"component":"store","level":"warning","msg":"store configuration deleted","store":"/sensu.io/api/enterprise/store/v1/provider/postgres01","time":"2019-10-02T23:29:06Z"}
{"component":"store","level":"warning","msg":"switched event store to etcd","time":"2019-10-02T23:29:06Z"}
{{< /code >}}

Similar to enabling Postgres, switching back to the etcd datastore does not migrate current observability event data from one store to another.
The web UI or sensuctl output may list outdated events until the etcd datastore catches up with the current state of your monitored infrastructure.

## Configure Postgres streaming replication

Postgres supports an active standby with [streaming replication][6].
Configure streaming replication to replicate all Sensu events written to the primary Postgres server to the standby server.

Follow the steps in this section to create and add the replication role, set streaming replication configuration parameters, bootstrap the standby host, and confirm successful Postgres streaming replication.

### Create and add the replication role

If you have administrative access to Postgres, you can create the replication role.
Follow these steps to create and add the replication role on the **primary** Postgres host:

1. Change to the postgres user and open the Postgres prompt (`postgres=#`):
{{< code shell >}}
sudo -u postgres psql
{{< /code >}}

2. Create the `repl` role:
{{< code postgresql >}}
CREATE ROLE repl PASSWORD '<your-password>' LOGIN REPLICATION;
{{< /code >}}

   Postgres will return a confirmation message: `CREATE ROLE`.

3. Type `\q` to exit the PostgreSQL prompt.

4. Add the replication role to `pg_hba.conf` using an [md5-encrypted password][5].
Make a copy of the current `pg_hba.conf`:
{{< code shell >}}
sudo cp /var/lib/pgsql/data/pg_hba.conf /var/tmp/pg_hba.conf.bak
{{< /code >}}

5. In the following command, replace `<standby_ip>` with the IP address of your standby Postgres host and run the command:
{{< code shell >}}
export STANDBY_IP=<standby-ip>
{{< /code >}}

6. Give the repl user permissions to replicate from the standby host:
{{< code shell >}}
echo "host replication repl ${STANDBY_IP}/32 md5" | sudo tee -a /var/lib/pgsql/data/pg_hba.conf
{{< /code >}}

7. Restart the PostgreSQL service to activate the `pg_hba.conf` changes:
{{< code shell >}}
sudo systemctl restart postgresql
{{< /code >}}

### Set streaming replication configuration parameters

Follow these steps to set streaming replication configuration parameters on the **primary** Postgres host:

1. Make a copy of the `postgresql.conf`:
{{< code shell >}}
sudo cp -a /var/lib/pgsql/data/postgresql.conf /var/lib/pgsql/data/postgresql.conf.bak
{{< /code >}}

2. Append the necessary configuration options.
{{< code shell >}}
echo 'wal_level = replica' | sudo tee -a /var/lib/pgsql/data/postgresql.conf
{{< /code >}}

3. Set the maximum number of concurrent connections from the standby servers:
{{< code shell >}}
echo 'max_wal_senders = 5' | sudo tee -a /var/lib/pgsql/data/postgresql.conf
{{< /code >}}

4. To prevent the primary server from removing the WAL segments required for the standby server before shipping them, set the minimum number of segments retained in the `pg_xlog` directory:
{{< code shell >}}
echo 'wal_keep_segments = 32' | sudo tee -a /var/lib/pgsql/data/postgresql.conf
{{< /code >}}

   At minimum, the number of `wal_keep_segments` should be larger than the number of segments generated between the beginning of online backup and the startup of streaming replication.

   {{% notice note %}}
**NOTE**: If you enable WAL archiving to an archive directory accessible from the standby, this step may not be necessary.
{{% /notice %}}

5. Restart the PostgreSQL service to activate the `postgresql.conf` changes:
{{< code shell >}}
sudo systemctl restart postgresql
{{< /code >}}

### Bootstrap the standby host

Follow these steps to bootstrap the standby host on the **standby** Postgres host:

1. If the standby host has ever run Postgres, stop Postgres and empty the data directory:
{{< code shell >}}
sudo systemctl stop postgresql
{{< /code >}}

   {{< code shell >}}
sudo mv /var/lib/pgsql/data /var/lib/pgsql/data.bak
{{< /code >}}

2. Make the standby data directory:
{{< code shell >}}
sudo install -d -o postgres -g postgres -m 0700 /var/lib/pgsql/data
{{< /code >}}

3. In the following command, replace `<primary_ip>` with the IP address of your primary Postgres host and run the command:
{{< code shell >}}
export PRIMARY_IP=<primary_ip>
{{< /code >}}

4. Bootstrap the standby data directory:
{{< code shell >}}
sudo -u postgres pg_basebackup -h $PRIMARY_IP -D /var/lib/pgsql/data -P -U repl -R --wal-method=stream
{{< /code >}}

5. Enter your password at the Postgres prompt:
{{< code postgresql >}}
Password: 
{{< /code >}}

After you enter your password, Postgres will list database copy progress:

{{< code postgresql >}}
30318/30318 kB (100%), 1/1 tablespace
{{< /code >}}

### Confirm replication

Follow these steps to confirm replication:

1. On the **primary** Postgres host, remove primary-only configurations:
{{< code shell >}}
sudo sed -r -i.bak '/^(wal_level|max_wal_senders|wal_keep_segments).*/d' /var/lib/pgsql/data/postgresql.conf
{{< /code >}}

2. Start the PostgreSQL service:
{{< code shell >}}
sudo systemctl start postgresql
{{< /code >}}

3. Check the primary host commit log location:
{{< code shell >}}
sudo -u postgres psql -c "select pg_current_wal_lsn()"
{{< /code >}}

   Postgres will list the primary host commit log location:
{{< code postgresql >}}
 pg_current_wal_lsn 
--------------------------
 0/3000568
(1 row)
{{< /code >}}

4. On the **standby** Postgres host, check the commit log location:
{{< code shell >}}
sudo -u postgres psql -c "select pg_last_wal_receive_lsn()"
{{< /code >}}
{{< code shell >}}
sudo -u postgres psql -c "select pg_last_wal_replay_lsn()"
{{< /code >}}

   Postgres will list the standby host commit log location:
{{< code postgresql >}}
 pg_last_wal_receive_lsn 
-------------------------------
 0/3000568
(1 row)
{{< /code >}}
{{< code postgresql >}}
 pg_last_wal_replay_lsn 
------------------------------
 0/3000568
(1 row)
{{< /code >}}

With this configuration complete, your Sensu events will be replicated to the standby host.


[1]: https://github.com/sensu/sensu-perf
[2]: https://www.postgresql.org/docs/current/config-setting.html
[3]: ../../../commercial/
[4]: ../../maintain-sensu/troubleshoot/#log-file-locations
[5]: https://www.postgresql.org/docs/9.5/auth-methods.html#AUTH-PASSWORD
[6]: https://wiki.postgresql.org/wiki/Streaming_Replication
