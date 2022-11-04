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

The disaster recovery processes include steps for creating backups of various configurations pertaining to Sensu, but you must make backups *before* you need to use them.
Read [best practices for backups][2] for more information.

{{% notice note %}}
**NOTE**: The instructions on this page assume that your primary Sensu deployment is down and you need to bring up a new one to take its place.
{{% /notice %}}

## PostgreSQL

This section explains how to create a backup PostgreSQL Sensu configuration rather than how to back up the PostgreSQL database.
In a Sensu deployment, PostgreSQL stores the last 21 check executions, which limits its use in a true disaster recovery scenario.
As a best practice, we recommend using a time series database (TSDB) for long-term event retention and storage.

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

2. Export the PostgreSQL configuration:

   {{< code shell >}}
sensuctl dump store/v1.PostgresConfig \
--format wrapped-json \
--file backup/psql_config_backup.json
{{< /code >}}

### Restore the Sensu configuration for PostgreSQL

The instructions in this section assume that you already have:

- A newly deployed Sensu instance (or instances in a cluster configuration).
- A newly deployed PostgreSQL instance.

To restore the PostgreSQL configuration for Sensu, follow these steps:

1. Confirm that your new Sensu deployment is up and running:

   {{< code shell >}}
systemctl status sensu-backend
{{< /code >}}

2. Confirm that your new Sensu deployment is healthy:

   {{< code shell >}}
sensuctl cluster health
{{< /code >}}

3. After confirming that Sensu is running and is showing as healthy, restore the PostgreSQL configuration to activate the PostgreSQL event store:

   {{< code shell >}}
sensuctl create --file backup/psql_config_backup.json
{{< /code >}}

{{% notice note %}}
**NOTE**: For details about the sensuctl dump command, read [Back up and recover resources with sensuctl](../../../sensuctl/back-up-recover/).
{{% /notice %}}

## Etcd

{{% notice note %}}
**NOTE**: This process uses the `etcdctl snapshot save` command to create a backup.
For details about etcd snapshot and restore capabilities, read [etcd's disaster recovery documentation](https://etcd.io/docs/latest/op-guide/recovery/).
{{% /notice %}}

### Snapshot the Sensu etcd database

Whether you're using the embedded version of etcd for Sensu or an external etcd instance, embedded etcdctl must be installed the system you use to generate a snapshot.
Read the [etcd installation documentation][4] to install etcdctl.

Run the following command to take a snapshot of Sensu's embedded etcd database:

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

### Restore the Sensu configuration for embedded etcd

If you use embedded etcd for your Sensu instance, follow these steps to restore your Sensu configuration:

1. Start a new Sensu backend or cluster:

    {{% notice warning %}}
**IMPORTANT**: Update the example values in these commands according to your Sensu configuration before running the commands.
{{% /notice %}}

   {{< code >}}
mkdir -p /var/lib/sensu/sensu-backend/new_sensu

chown -R /var/lib/sensu/sensu-backend/new_sensu
{{< /code >}}

   {{< language-toggle >}}

{{< code shell "Single backend startup" >}}
sensu-backend start \
--etcd-initial-cluster sensu-backend-01=http://sensu-backend-01:2380 \
--etcd-initial-cluster-token sensu-backend-01 \
--etcd-initial-advertise-peer-urls http://localhost:2380 \
--etcd-advertise-client-urls http://localhost:2379
--state-dir /var/lib/sensu/sensu-backend/new_sensu
{{< /code >}}

{{< code shell "Clustered backend startup" >}}
sensu-backend start \
--etcd-initial-cluster sensu-backend-01=http://sensu-backend-01:2380,sensu-backend-02=http://sensu-backend-02:2380,sensu-backend-03=http://sensu-backend-03:2380 \
--etcd-initial-cluster-token sensu-backend-01 \
--etcd-initial-advertise-peer-urls http://sensu-backend-01:2380 \
--etcd-advertise-client-urls http://sensu-backend-01:2379
--state-dir /var/lib/sensu/sensu-backend/new_sensu

sensu-backend start \
--etcd-initial-cluster sensu-backend-01=http://sensu-backend-01:2380,sensu-backend-02=http://sensu-backend-02:2380,sensu-backend-03=http://sensu-backend-03:2380 \
--etcd-initial-cluster-token sensu-backend-02 \
--etcd-initial-advertise-peer-urls http://sensu-backend-02:2380 \
--etcd-advertise-client-urls http://sensu-backend-02:2379
--state-dir /var/lib/sensu/sensu-backend/new_sensu

sensu-backend start \
--etcd-initial-cluster sensu-backend-01=http://sensu-backend-01:2380,sensu-backend-02=http://sensu-backend-02:2380,sensu-backend-03=http://sensu-backend-03:2380 \
--etcd-initial-cluster-token sensu-backend-03 \
--etcd-initial-advertise-peer-urls http://sensu-backend-03:2380 \
--etcd-advertise-client-urls http://sensu-backend-03:2379
--state-dir /var/lib/sensu/sensu-backend/new_sensu
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

### Restore the Sensu configuration for external etcd

If you are using an externally deployed etcd instance or cluster, follow these steps to restore your Sensu configuration:

1. Create a snapshot of your etcd database:

{{< code shell "Example command" >}}
ETCDCTL_API=3 etcdctl snapshot --endpoints http://localhost:2379 save sensu_etcd_snapshot.db
{{< /code >}}

{{% notice note %}}
**NOTE**: When creating the snapshot, it will copy what etcd is currently using for it's `wal-dir` and its `data-dir`. For example, if your `data-dir` is `/var/lib/etcd/data` and your wal dir is `/var/lib/etcd/wal`, the snapshot you generate will restore the data from the snapshot to those same directories. For the purposes of this example, we assume those are the directories you are using as a part of your deployment. If you are using a different set of locations, please ensure that they match the instructions for starting etcd and restoring the snapshot below.
{{% /notice %}}

2. Copy the etcd snapshot file to each cluster member so that all members will be restored using the same snapshot.

3. Create a new directory to use on your new Etcd cluster:
{{< code >}}
mkdir -p /var/lib/etcd/new_sensu/data

mkdir -p /var/lib/etcd/new_sensu/wal
{{< /code >}}

4. Start up etcd using the data and wal directories you created above:
{{< code shell >}}
etcd \
--listen-client-urls "https://10.0.0.1:2379" \
--advertise-client-urls "https://10.0.0.1:2379" \
--listen-peer-urls "https://10.0.0.1:2380" \
--initial-cluster "backend-1.example.com=https://10.0.0.1:2380,backend-2.example.com=https://10.0.0.2:2380,backend-3.example.com=https://10.0.0.3:2380" \
--initial-advertise-peer-urls "https://10.0.0.1:2380" \
--initial-cluster-state "new" \
--name "backend-1.example.com" \
--trusted-ca-file=./ca.pem \
--cert-file=./backend-1.example.com.pem \
--key-file=./backend-1.example.com-key.pem \
--client-cert-auth \
--peer-trusted-ca-file=./ca.pem \
--peer-cert-file=./backend-1.example.com.pem \
--peer-key-file=./backend-1.example.com-key.pem \
--peer-client-cert-auth \
--auto-compaction-mode revision \
--auto-compaction-retention 2
--data-dir /var/lib/etcd/new_sensu/data
--wal-dir /var/lib/etcd/new_sensu/wal

etcd \
--listen-client-urls "https://10.0.0.2:2379" \
--advertise-client-urls "https://10.0.0.2:2379" \
--listen-peer-urls "https://10.0.0.2:2380" \
--initial-cluster "backend-1.example.com=https://10.0.0.1:2380,backend-2.example.com=https://10.0.0.2:2380,backend-3.example.com=https://10.0.0.3:2380" \
--initial-advertise-peer-urls "https://10.0.0.2:2380" \
--initial-cluster-state "new" \
--name "backend-1.example.com" \
--trusted-ca-file=./ca.pem \
--cert-file=./backend-1.example.com.pem \
--key-file=./backend-1.example.com-key.pem \
--client-cert-auth \
--peer-trusted-ca-file=./ca.pem \
--peer-cert-file=./backend-1.example.com.pem \
--peer-key-file=./backend-1.example.com-key.pem \
--peer-client-cert-auth \
--auto-compaction-mode revision \
--auto-compaction-retention 2
--data-dir /var/lib/etcd/new_sensu/data
--wal-dir /var/lib/etcd/new_sensu/wal

etcd \
--listen-client-urls "https://10.0.0.3:2379" \
--advertise-client-urls "https://10.0.0.3:2379" \
--listen-peer-urls "https://10.0.0.3:2380" \
--initial-cluster "backend-1.example.com=https://10.0.0.1:2380,backend-2.example.com=https://10.0.0.2:2380,backend-3.example.com=https://10.0.0.3:2380" \
--initial-advertise-peer-urls "https://10.0.0.3:2380" \
--initial-cluster-state "new" \
--name "backend-1.example.com" \
--trusted-ca-file=./ca.pem \
--cert-file=./backend-1.example.com.pem \
--key-file=./backend-1.example.com-key.pem \
--client-cert-auth \
--peer-trusted-ca-file=./ca.pem \
--peer-cert-file=./backend-1.example.com.pem \
--peer-key-file=./backend-1.example.com-key.pem \
--peer-client-cert-auth \
--auto-compaction-mode revision \
--auto-compaction-retention 2
--data-dir /var/lib/etcd/new_sensu/data
--wal-dir /var/lib/etcd/new_sensu/wal
{{< /code >}}

5. Restore the snapshot:
{{< code shell >}}
ETCDCTL_API=3 etcdctl snapshot restore sensu_etcd_snapshot.db \
--name backend-1.example.com \
--initial-cluster backend-1.example.com=http://10.0.01:2380,backend-2.example.com=http://10.0.0.2:2380,backend-3.example.com=http://10.0.0.3:2380 \
--initial-cluster-token backend-1.example.com \
--initial-advertise-peer-urls http://backend-1.example.com:2380 \
--data-dir /var/lib/etcd/data \
--wal-dir /var/lib/etcd/wal

ETCDCTL_API=3 etcdctl snapshot restore snapshot.db \
--name backend-2.example.com \
--initial-cluster backend-1.example.com=http://10.0.01:2380,backend-2.example.com=http://10.0.0.2:2380,backend-3.example.com=http://10.0.0.3:2380 \
--initial-cluster-token backend-2.example.com \
--initial-advertise-peer-urls http://backend-2.example.com:2380 \
--data-dir /var/lib/etcd/data \
--wal-dir /var/lib/etcd/wal

ETCDCTL_API=3 etcdctl snapshot restore snapshot.db \
--name backend-3.example.com \
--initial-cluster backend-1.example.com=http://10.0.01:2380,backend-2.example.com=http://10.0.0.2:2380,backend-3.example.com=http://10.0.0.3:2380 \
--initial-cluster-token backend-3.example.com \
--initial-advertise-peer-urls http://backend-3.example.com:2380 \
--data-dir /var/lib/etcd/data \
--wal-dir /var/lib/etcd/wal
{{< /code >}}

6. Restart etcd to point at the restored data and wal directories:
{{< code shell >}}

etcd \
--listen-client-urls "https://10.0.0.1:2379" \
--advertise-client-urls "https://10.0.0.1:2379" \
--listen-peer-urls "https://10.0.0.1:2380" \
--initial-cluster "backend-1.example.com=https://10.0.0.1:2380,backend-2.example.com=https://10.0.0.2:2380,backend-3.example.com=https://10.0.0.3:2380" \
--initial-advertise-peer-urls "https://10.0.0.1:2380" \
--initial-cluster-state "new" \
--name "backend-1.example.com" \
--trusted-ca-file=./ca.pem \
--cert-file=./backend-1.example.com.pem \
--key-file=./backend-1.example.com-key.pem \
--client-cert-auth \
--peer-trusted-ca-file=./ca.pem \
--peer-cert-file=./backend-1.example.com.pem \
--peer-key-file=./backend-1.example.com-key.pem \
--peer-client-cert-auth \
--auto-compaction-mode revision \
--auto-compaction-retention 2
--data-dir /var/lib/etcd/data
--wal-dir /var/lib/etcd/wal

etcd \
--listen-client-urls "https://10.0.0.2:2379" \
--advertise-client-urls "https://10.0.0.2:2379" \
--listen-peer-urls "https://10.0.0.2:2380" \
--initial-cluster "backend-1.example.com=https://10.0.0.1:2380,backend-2.example.com=https://10.0.0.2:2380,backend-3.example.com=https://10.0.0.3:2380" \
--initial-advertise-peer-urls "https://10.0.0.2:2380" \
--initial-cluster-state "new" \
--name "backend-1.example.com" \
--trusted-ca-file=./ca.pem \
--cert-file=./backend-1.example.com.pem \
--key-file=./backend-1.example.com-key.pem \
--client-cert-auth \
--peer-trusted-ca-file=./ca.pem \
--peer-cert-file=./backend-1.example.com.pem \
--peer-key-file=./backend-1.example.com-key.pem \
--peer-client-cert-auth \
--auto-compaction-mode revision \
--auto-compaction-retention 2
--data-dir /var/lib/etcd/data
--wal-dir /var/lib/etcd/wal

etcd \
--listen-client-urls "https://10.0.0.3:2379" \
--advertise-client-urls "https://10.0.0.3:2379" \
--listen-peer-urls "https://10.0.0.3:2380" \
--initial-cluster "backend-1.example.com=https://10.0.0.1:2380,backend-2.example.com=https://10.0.0.2:2380,backend-3.example.com=https://10.0.0.3:2380" \
--initial-advertise-peer-urls "https://10.0.0.3:2380" \
--initial-cluster-state "new" \
--name "backend-1.example.com" \
--trusted-ca-file=./ca.pem \
--cert-file=./backend-1.example.com.pem \
--key-file=./backend-1.example.com-key.pem \
--client-cert-auth \
--peer-trusted-ca-file=./ca.pem \
--peer-cert-file=./backend-1.example.com.pem \
--peer-key-file=./backend-1.example.com-key.pem \
--peer-client-cert-auth \
--auto-compaction-mode revision \
--auto-compaction-retention 2
--data-dir /var/lib/etcd/data
--wal-dir /var/lib/etcd/wal
{{< /code >}}

7. Confirm that etcd is showing as healthy:
{{< code shell >}}
curl -s https://10.0.0.1:2379/health
{{< /code >}}

8. Start up Sensu and point it at the new etcd cluster:
{{< code shell >}}
sensu-backend start \
--etcd-trusted-ca-file=./ca.pem \
--etcd-cert-file=./backend-1.example.com.pem \
--etcd-key-file=./backend-1.example.com-key.pem \
--etcd-client-urls='https://10.0.0.1:2379 https://10.0.0.2:2379 https://10.0.0.3:2379' \
--no-embed-etcd
{{< /code >}}

9. In the Sensu web UI, confirm that you can view your original configuration.

## Best practices for backups

The best backup plan depends on how much and how often your Sensu configuration changes, as well as your organization's disaster recovery and business continuity goals.

Business needs will dictate the right plan for your Sensu installation, but following a few best practices helps ensure that backups are available and useful when you need them.

### Back up on a regular schedule

Set a regular schedule for creating backups so that you always have a recent backup available.

A twice-weekly backup is a good starting point but may not be right for your organization. For example, a large Sensu environment that deploys new checks constantly might require more frequent backups, such as every 24 or 48 hours. At the same time, a smaller environment that monitors only system resources might need only one weekly backup.

### Back up during off-hours

Creating a backup requires system resources, so we recommend backing up during evening or weekend hours.

### Omit events from backups

Even if you make regular backups, events are likely to be outdated by the time you restore them.
The most important part of a backup is capturing the Sensu configuration.

If you need access to all events, send events to a time-series database (TDSB) for storage instead of including events in routine Sensu backups.

{{% notice note %}}
**NOTE**: We don't recommend performing a backup of the PostgreSQL event store at this time, as the event data there is seldom useful or necessary within a disaster recovery context. Using a TSDB allows you to bypass the need to perform regular backups of PostgreSQL.
{{% /notice %}}


[1]: ../../../sensuctl/create-manage-resources/#create-resources
[2]: #best-practices-for-backups
[3]: ../../../sensuctl/back-up-recover/
[4]: https://etcd.io/docs/latest/install/
