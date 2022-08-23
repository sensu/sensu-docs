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

This page describes best practices for making Sensu backups and processes for restoring Sensu instances for disaster recovery.

## Backup recommendations

The disaster recovery processes include steps for creating a backup, but backups must be made at regular intervals, before you need them.
The best backup plan depends on how much and how often your Sensu configuration changes, as well as your organization's disaster recovery and business continuity goals.

A twice-weekly backup is a good starting point but may not be sufficient.
For example, a large Sensu environment that deploys new checks constantly might require more frequent backups, such as every 24 or 48 hours.
At the same time, a smaller environment that monitors only system resources might need only one weekly backup.

Business needs will dictate the best backup plan for your Sensu installation, but following a few best practices helps ensure that your backups are available and useful when you need them.

### Back up during off-hours

Creating a backup requires some system resources, so we recommend backing up during evening or weekend hours.

### Omit events from backups

Even if you make regular backups, events are likely to be outdated by the time you restore them.
The most important part of a backup is capturing the Sensu configuration, and week-old events probably won't be helpful.
If you need access to all events, send your events to a time-series database (TDSB) for storage instead of including events in routine Sensu backups.




## Disaster recovery for embedded etcd and PostgreSQL

{{% notice note %}}
**NOTE**: For details about the sensuctl dump command, read [Back up and recover resources with sensuctl](../../../sensuctl/back-up-recover/).
{{% /notice %}}

If you use embedded etcd or PostgreSQL for your Sensu instance, follow these steps to create a backup and restore your Sensu configuration:

1. Create a backup of the entire configuration (except events, API keys, and users) for all namespaces:

   {{< code shell >}}
sensuctl dump all \
--all-namespaces \
--omit core/v2.Event,core/v2.APIKey,core/v2.User \
--format wrapped-json \
--file config_backup.json
{{< /code >}}

2. Export your API keys and users, for all namespaces:

   {{< code shell >}}
sensuctl dump core/v2.APIKey,core/v2.User \
--all-namespaces \
--format wrapped-json \
--file apikeys_users_backup.json
{{< /code >}}

   {{% notice note %}}
**NOTE**: The sensuctl create command does not restore API keys from a sensuctl dump backup.
Also, passwords are not included when you export users with the sensuctl dump command &mdash; you must add the [`password_hash`](../#generate-a-password-hash) or `password` attribute to exported user resources before you can restore them with `sensuctl create`.<br><br>
For this reason, we suggest backing up API keys and users in a separate file that you can use as a reference for granting new API keys and adding the `password_hash` or `password` attribute to user resources.
{{% /notice %}}

3. When you are ready to restore your exported resources, use [`sensuctl create`][1]:

   {{< code shell >}}
sensuctl create -r -f config_backup.json
{{< /code >}}


{{% notice note %}}
**NOTE**: When you export users, required password attributes are not included.
You must add a [`password_hash`](../#generate-a-password-hash) or `password` to `users` resources before restoring them with the `sensuctl create` command.<br><br>
You can't restore API keys or users from a sensuctl dump backup.
API keys must be reissued, but you can use your backup as a reference for granting new API keys to replace the exported keys.
{{% /notice %}}


## Backup and restore for external etcd

{{% notice note %}}
**NOTE**: For details about etcd snapshot and restore capabilities, read [etcd's disaster recovery documentation](https://etcd.io/docs/latest/op-guide/recovery/).
{{% /notice %}}

If you use external etcd for your Sensu instance, follow these steps to create a backup and restore your Sensu configuration:

1. Take an etcdctl snapshot:

   {{< language-toggle >}}

{{< code shell "Command format" >}}
ETCD_API=<ETCD_API_VERSION> etcd snapshot --endpoints <SINGLE_ENDPOINT_FOR_CLUSTER_MEMBER> save <SNAPSHOT_FILE_NAME.db>
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

2. Start a new Sensu backend or cluster and confirm that it is running:

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

3. Restore the Sensu configuration from the etcd snapshot:

   Once you've validated that the snapshot has been created successfully, you'll need to restore it to a working cluster (or standalone Sensu backend, if not deploying a cluster).

   To restore the snapshot, you'll only need the singular snapshot archive. You must copy the archive to each member of the cluster. Once the snapshot has been copied, you'll use a command similar to the following:

   {{< language-toggle >}}

{{< code shell "Restore a single backend" >}}
ETCDCTL_API=3 etcdctl snapshot restore sensu_etcd_snapshot.db \
--name sensu-backend-01 \
--initial-cluster sensu-backend-01=http://sensu-backend-01:2380,sensu-backend-02=http://sensu-backend-02:2380,sensu-backend-03=http://sensu-backend-03:2380 \
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

After running the restore command, you should see the restored Sensu configuration in the web UI or sensuctl output.


[1]: ../create-manage-resources/#create-resources
[2]: ../../operations/control-access/rbac/
[3]: #restore-resources-from-backup
[4]: ../../operations/maintain-sensu/upgrade/
[5]: ../create-manage-resources/#create-resources-across-namespaces
[6]: #supported-resource-types
