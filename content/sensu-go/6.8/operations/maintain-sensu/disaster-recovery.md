---
title: "Restore a Sensu instance for disaster recovery"
linkTitle: "Restore a Sensu Instance"
description: "Learn how to export and back up your Sensu resources and restore a Sensu instance for disaster recovery (DR)."
weight: 27
version: "6.8"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-6.8:
    parent: maintain-sensu
---

This page describes best practices for making Sensu configuration backups and processes for restoring your Sensu configuration for disaster recovery.

The disaster recovery processes include steps for creating a backup, but you must make backups *before* you need to use them.
Read [best practices for backups][2] for more information.

## Disaster recovery for PostgreSQL

{{% notice note %}}
**NOTE**: This process uses [sensuctl dump](../../../sensuctl/back-up-recover/) to create backups.
When you export users with sensuctl dump, passwords are not included &mdash; you must add the [`password_hash`](../../../sensuctl/#generate-a-password-hash) or `password` attribute back to exported user definitions before you can restore users with sensuctl create.
Also, sensuctl create does not restore API keys from a sensuctl dump backup.<br><br>
We suggest backing up API keys and users in a separate file that you can use as a reference for granting new API keys and adding the `password_hash` or `password` attribute to user definitions.
{{% /notice %}}

### Back up the Sensu configuration for PostgreSQL

If you use PostgreSQL for your Sensu instance, follow these steps to create a backup of your Sensu configuration:

1. Create a backup folder:

   {{< code shell >}}
mkdir backup
{{< /code >}}

2. Create a backup of the entire configuration, except events, PostgreSQL configuration, API keys, and users, for all namespaces:

   {{< code shell >}}
sensuctl dump all \
--all-namespaces \
--omit core/v2.Event,store/v1.PostgresConfig,core/v2.APIKey,core/v2.User \
--format wrapped-json \
--file backup/config_backup.json
{{< /code >}}

3. Export the PostgreSQL configuration:

   {{< code shell >}}
sensuctl dump store/v1.PostgresConfig \
--format wrapped-json \
--file backup/psql_config_backup.json
{{< /code >}}

4. Export the API keys and users, for all namespaces:

   {{< code shell >}}
sensuctl dump core/v2.APIKey,core/v2.User \
--all-namespaces \
--format wrapped-json \
--file backup/apikeys_users_backup.json
{{< /code >}}

### Restore the Sensu configuration for PostgreSQL

If you use PostgreSQL for your Sensu instance, follow these steps to restore your Sensu configuration:

1. Stop each backend using the system manager:

   {{< code shell >}}
systemctl stop sensu-backend
{{< /code >}}

2. Delete the existing `pg_hba.conf` file:

   {{< code shell >}}
rm -rf /var/lib/pgsql/data/pg_hba.conf
{{< /code >}}

3. Reconfigure the PostgreSQL database.

4. Start a new Sensu backend or cluster:

   {{% notice warning %}}
**IMPORTANT**: Update the example values in these startup commands according to your Sensu configuration before running the commands.
{{% /notice %}}

   {{< language-toggle >}}

{{< code shell "Single backend startup" >}}
sensu-backend start \
--etcd-initial-cluster backend-1.example.com=http://10.0.0.1:2380 \
--etcd-initial-cluster-token backend-1.example.com \
--etcd-initial-advertise-peer-urls http://localhost:2380 \
--etcd-advertise-client-urls http://localhost:2379
{{< /code >}}

{{< code shell "Clustered backend startup" >}}
sensu-backend start \
--etcd-initial-cluster backend-1.example.com=http://10.0.0.1:2380,backend-2.example.com=http://10.0.0.2:2380,backend-3.example.com=http://10.0.0.3:2380 \
--etcd-initial-cluster-token backend-1.example.com \
--etcd-initial-advertise-peer-urls http://backend-1.example.com:2380 \
--etcd-advertise-client-urls http://backend-1.example.com:2379

sensu-backend start \
--etcd-initial-cluster backend-1.example.com=http://10.0.0.1:2380,backend-2.example.com=http://10.0.0.2:2380,backend-3.example.com=http://10.0.0.3:2380 \
--etcd-initial-cluster-token backend-2.example.com \
--etcd-initial-advertise-peer-urls http://backend-2.example.com:2380 \
--etcd-advertise-client-urls http://backend-2.example.com:2379

sensu-backend start \
--etcd-initial-cluster sbackend-1.example.com=http://10.0.0.1:2380,backend-2.example.com=http://10.0.0.2:2380,backend-3.example.com=http://10.0.0.3:2380 \
--etcd-initial-cluster-token backend-3.example.com \
--etcd-initial-advertise-peer-urls http://backend-3.example.com:2380 \
--etcd-advertise-client-urls http://backend-3.example.com:2379
{{< /code >}}

{{< /language-toggle >}}

4. Confirm that the new Sensu backend or cluster is running:

   {{< code shell >}}
systemctl status sensu-backend
{{< /code >}}

   The response should indicate `active (running)`.

5. Restore the PostgreSQL configuration to activate the PostgreSQL event store:

   {{< code shell >}}
sensuctl create --file backup/psql_config_backup.json
{{< /code >}}

6. Restore the exported resources with [`sensuctl create`][1]:

   {{< code shell >}}
sensuctl create -r -f backup/config_backup.json
{{< /code >}}

You should see the restored Sensu configuration in the web UI or sensuctl output.

{{% notice note %}}
**NOTE**: For details about the sensuctl dump command, read [Back up and recover resources with sensuctl](../../../sensuctl/back-up-recover/).
{{% /notice %}}

## Disaster recovery for embedded etcd

{{% notice note %}}
**NOTE**: This process uses [sensuctl dump](../../../sensuctl/back-up-recover/) to create backups.
When you export users with sensuctl dump, passwords are not included &mdash; you must add the [`password_hash`](../../../sensuctl/#generate-a-password-hash) or `password` attribute back to exported user definitions before you can restore users with sensuctl create.
Also, sensuctl create does not restore API keys from a sensuctl dump backup.<br><br>
We suggest backing up API keys and users in a separate file that you can use as a reference for granting new API keys and adding the `password_hash` or `password` attribute to user definitions.
{{% /notice %}}

### Back up the Sensu configuration for embedded etcd

If you use embedded etcd for your Sensu instance, follow these steps to create a backup of your Sensu configuration:

1. Create a backup folder:

   {{< code shell >}}
mkdir backup
{{< /code >}}

2. Create a backup of the entire configuration (except events, API keys, and users) for all namespaces:

   {{< code shell >}}
sensuctl dump all \
--all-namespaces \
--omit core/v2.Event,core/v2.APIKey,core/v2.User \
--format wrapped-json \
--file backup/config_backup.json
{{< /code >}}

3. Export the API keys and users, for all namespaces:

   {{< code shell >}}
sensuctl dump core/v2.APIKey,core/v2.User \
--all-namespaces \
--format wrapped-json \
--file backup/apikeys_users_backup.json
{{< /code >}}

### Restore the Sensu configuration for embedded etcd

If you use embedded etcd for your Sensu instance, follow these steps to restore your Sensu configuration:

1. Stop each backend using the system manager:

   {{< code shell >}}
systemctl stop sensu-backend
{{< /code >}}

2. Delete the existing etcd directories for each backend:

   {{< code shell >}}
rm -rf /var/lib/sensu/sensu-backend/etcd/
{{< /code >}}

3. Start a new Sensu backend or cluster:

   {{% notice warning %}}
**IMPORTANT**: Update the example values in these startup commands according to your Sensu configuration before running the commands.
{{% /notice %}}

   {{< language-toggle >}}

{{< code shell "Single backend startup" >}}
sensu-backend start \
--etcd-initial-cluster backend-1.example.com=http://10.0.0.1:2380 \
--etcd-initial-cluster-token backend-1.example.com \
--etcd-initial-advertise-peer-urls http://localhost:2380 \
--etcd-advertise-client-urls http://localhost:2379
{{< /code >}}

{{< code shell "Clustered backend startup" >}}
sensu-backend start \
--etcd-initial-cluster backend-1.example.com=http://10.0.0.1:2380,backend-2.example.com=http://10.0.0.2:2380,backend-3.example.com=http://10.0.0.3:2380 \
--etcd-initial-cluster-token backend-1.example.com \
--etcd-initial-advertise-peer-urls http://backend-1.example.com:2380 \
--etcd-advertise-client-urls http://backend-1.example.com:2379

sensu-backend start \
--etcd-initial-cluster backend-1.example.com=http://10.0.0.1:2380,backend-2.example.com=http://10.0.0.2:2380,backend-3.example.com=http://10.0.0.3:2380 \
--etcd-initial-cluster-token backend-2.example.com \
--etcd-initial-advertise-peer-urls http://backend-2.example.com:2380 \
--etcd-advertise-client-urls http://backend-2.example.com:2379

sensu-backend start \
--etcd-initial-cluster sbackend-1.example.com=http://10.0.0.1:2380,backend-2.example.com=http://10.0.0.2:2380,backend-3.example.com=http://10.0.0.3:2380 \
--etcd-initial-cluster-token backend-3.example.com \
--etcd-initial-advertise-peer-urls http://backend-3.example.com:2380 \
--etcd-advertise-client-urls http://backend-3.example.com:2379
{{< /code >}}

{{< /language-toggle >}}

4. Confirm that the new Sensu backend or cluster is running:

   {{< code shell >}}
systemctl status sensu-backend
{{< /code >}}

   The response should indicate `active (running)`.

5. Restore the resources from backup with [`sensuctl create`][1]:

   {{< code shell >}}
sensuctl create -r -f backup/config_backup.json
{{< /code >}}

6. Recreate users and API keys, using the `backup/apikeys_users_backup.json` file as a reference.

You should see the restored Sensu configuration in the web UI or sensuctl output.

{{% notice note %}}
**NOTE**: For details about the sensuctl dump command, read [Back up and recover resources with sensuctl](../../../sensuctl/back-up-recover/).
{{% /notice %}}

## Disaster recovery for external etcd

{{% notice note %}}
**NOTE**: This process uses the `etcdctl snapshot save` command to create a backup.
For details about etcd snapshot and restore capabilities, read [etcd's disaster recovery documentation](https://etcd.io/docs/latest/op-guide/recovery/).
{{% /notice %}}

### Back up the Sensu configuration for external etcd

If you use external etcd for your Sensu instance, use etcdctl to create a backup of your Sensu configuration:

{{< language-toggle >}}

{{< code shell "Command format" >}}
ETCD_API=<ETCD_API_VERSION> etcdctl snapshot --endpoints <SINGLE_ENDPOINT_FOR_CLUSTER_MEMBER> save <SNAPSHOT_FILE_NAME.db>
{{< /code >}}

{{< code shell "Example command" >}}
ETCDCTL_API=3 etcdctl snapshot --endpoints http://localhost:2379 save sensu_etcd_snapshot.db
{{< /code >}}

{{< /language-toggle >}}

The command output should be similar to this example:

{{< code text >}}
root@sensu00:~# etcdctl snapshot --endpoints https://sensu-backend-01:2379 save sensu_etcd_snapshot.db
{"level":"info","ts":"2022-08-18T20:47:28.419Z","caller":"snapshot/v3_snapshot.go:65","msg":"created temporary db file","path":"sensu_etcd_snapshot.db.part"}
{"level":"info","ts":"2022-08-18T20:47:28.452Z","logger":"client","caller":"v3/maintenance.go:211","msg":"opened snapshot stream; downloading"}
{"level":"info","ts":"2022-08-18T20:47:28.452Z","caller":"snapshot/v3_snapshot.go:73","msg":"fetching snapshot","endpoint":"https://sensu-backend-01:2379"}
{"level":"info","ts":"2022-08-18T20:47:28.512Z","logger":"client","caller":"v3/maintenance.go:219","msg":"completed snapshot read; closing"}
{"level":"info","ts":"2022-08-18T20:47:28.648Z","caller":"snapshot/v3_snapshot.go:88","msg":"fetched snapshot","endpoint":"https://sensu-backend-01:2379","size":"2.9 MB","took":"now"}
{"level":"info","ts":"2022-08-18T20:47:28.648Z","caller":"snapshot/v3_snapshot.go:97","msg":"saved","path":"sensu_etcd_snapshot.db"}
Snapshot saved at sensu_etcd_snapshot.db
{{< /code >}}

### Restore the Sensu configuration for external etcd

If you use external etcd for your Sensu instance, follow these steps to restore your Sensu configuration:

1. Stop each backend using the system manager:

   {{< code shell >}}
systemctl stop sensu-backend
{{< /code >}}

2. Delete the existing etcd directories for each backend:

   {{< code shell >}}
rm -rf /var/lib/sensu/sensu-backend/etcd/
{{< /code >}}

3. Start a new Sensu backend or cluster:

   {{% notice warning %}}
**IMPORTANT**: Update the example values in these commands according to your Sensu configuration before running the commands.
{{% /notice %}}

   {{< language-toggle >}}

{{< code shell "Single backend startup" >}}
sensu-backend start \
--etcd-initial-cluster sensu-backend-01=http://sensu-backend-01:2380 \
--etcd-initial-cluster-token sensu-backend-01 \
--etcd-initial-advertise-peer-urls http://localhost:2380 \
--etcd-advertise-client-urls http://localhost:2379
{{< /code >}}

{{< code shell "Clustered backend startup" >}}
sensu-backend start \
--etcd-initial-cluster sensu-backend-01=http://sensu-backend-01:2380,sensu-backend-02=http://sensu-backend-02:2380,sensu-backend-03=http://sensu-backend-03:2380 \
--etcd-initial-cluster-token sensu-backend-01 \
--etcd-initial-advertise-peer-urls http://sensu-backend-01:2380 \
--etcd-advertise-client-urls http://sensu-backend-01:2379

sensu-backend start \
--etcd-initial-cluster sensu-backend-01=http://sensu-backend-01:2380,sensu-backend-02=http://sensu-backend-02:2380,sensu-backend-03=http://sensu-backend-03:2380 \
--etcd-initial-cluster-token sensu-backend-02 \
--etcd-initial-advertise-peer-urls http://sensu-backend-02:2380 \
--etcd-advertise-client-urls http://sensu-backend-02:2379

sensu-backend start \
--etcd-initial-cluster sensu-backend-01=http://sensu-backend-01:2380,sensu-backend-02=http://sensu-backend-02:2380,sensu-backend-03=http://sensu-backend-03:2380 \
--etcd-initial-cluster-token sensu-backend-03 \
--etcd-initial-advertise-peer-urls http://sensu-backend-03:2380 \
--etcd-advertise-client-urls http://sensu-backend-03:2379
{{< /code >}}

{{< /language-toggle >}}

4. Confirm that the new Sensu backend or cluster is running:

   {{< code shell >}}
systemctl status sensu-backend
{{< /code >}}

   The response should indicate `active (running)`.

5. Copy the etcd snapshot file to each cluster member so that all members will be restored using the same snapshot.

6. Restore the Sensu configuration from the etcd snapshot to the running backend or cluster:

   {{% notice warning %}}
**IMPORTANT**: Update the example values in these commands according to your Sensu configuration before running the commands.
{{% /notice %}}

   {{< language-toggle >}}

{{< code shell "Restore a single backend" >}}
ETCDCTL_API=3 etcdctl snapshot restore sensu_etcd_snapshot.db \
--name sensu-backend-01 \
--initial-cluster sensu-backend-01=http://sensu-backend-01:2380 \
--initial-cluster-token sensu-backend-01 \
--initial-advertise-peer-urls http://sensu-backend-01:2380 \
--data-dir /var/lib/sensu/sensu-backend/etcd/data \
--wal-dir /var/lib/sensu/sensu-backend/etcd/wal 
{{< /code >}}

{{< code shell "Restore a clustered backend" >}}
ETCDCTL_API=3 etcdctl snapshot restore sensu_etcd_snapshot.db \
--name sensu-backend-01 \
--initial-cluster sensu-backend-01=http://sensu-backend-01:2380,sensu-backend-02=http://sensu-backend-02:2380,sensu-backend-03=http://sensu-backend-03:2380 \
--initial-cluster-token sensu-backend-01 \
--initial-advertise-peer-urls http://sensu-backend-01:2380 \
--data-dir /var/lib/sensu/sensu-backend/etcd/data \
--wal-dir /var/lib/sensu/sensu-backend/etcd/wal

ETCDCTL_API=3 etcdctl snapshot restore snapshot.db \
--name sensu-backend-02 \
--initial-cluster sensu-backend-01=http://sensu-backend-01:2380,sensu-backend-02=http://sensu-backend-02:2380,sensu-backend-03=http://sensu-backend-03:2380 \
--initial-cluster-token sensu-backend-02 \
--initial-advertise-peer-urls http://sensu-backend-02:2380 \
--data-dir /var/lib/sensu/sensu-backend/etcd/data \
--wal-dir /var/lib/sensu/sensu-backend/etcd/wal 

ETCDCTL_API=3 etcdctl snapshot restore snapshot.db \
--name sensu-backend-03 \
--initial-cluster sensu-backend-01=http://sensu-backend-01:2380,sensu-backend-02=http://sensu-backend-02:2380,sensu-backend-03=http://sensu-backend-03:2380 \
--initial-cluster-token sensu-backend-03 \
--initial-advertise-peer-urls http://sensu-backend-03:2380 \
--data-dir /var/lib/sensu/sensu-backend/etcd/data \
--wal-dir /var/lib/sensu/sensu-backend/etcd/wal 
{{< /code >}}

{{< /language-toggle >}}

You should see the restored Sensu configuration in the web UI or sensuctl output.

## Best practices for backups

The best backup plan depends on how much and how often your Sensu configuration changes, as well as your organization's disaster recovery and business continuity goals.
Business needs will dictate the right plan for your Sensu installation, but following a few best practices helps ensure that backups are available and useful when you need them.

### Back up on a regular schedule

Set a regular schedule for creating backups so that you always have a recent backup available.

A twice-weekly backup is a good starting point but may not be right for your organization.
For example, a large Sensu environment that deploys new checks constantly might require more frequent backups, such as every 24 or 48 hours.
At the same time, a smaller environment that monitors only system resources might need only one weekly backup.

### Back up during off-hours

Creating a backup requires system resources, so we recommend backing up during evening or weekend hours.

### Omit events from backups

Even if you make regular backups, events are likely to be outdated by the time you restore them.
The most important part of a backup is capturing the Sensu configuration.

If you need access to all events, send events to a time-series database (TDSB) for storage instead of including events in routine Sensu backups.


[1]: ../../../sensuctl/create-manage-resources/#create-resources
[2]: #best-practices-for-backups
[3]: ../../../sensuctl/back-up-recover/
