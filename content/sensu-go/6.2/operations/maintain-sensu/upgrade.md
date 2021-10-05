---
title: "Upgrade Sensu"
linkTitle: "Upgrade Sensu"
description: "Upgrade to the latest version of Sensu. Read this upgrade guide to learn about the latest features and bug fixes in Sensu Go."
weight: 10
version: "6.2"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.2:
    parent: maintain-sensu
---

To upgrade to the latest version of Sensu Go:

1. [Install][1] the latest packages or Docker image.

2. For systems that use `systemd`, run:
{{< code shell >}}
sudo systemctl daemon-reload
{{< /code >}}

3. Restart the Sensu agent:
{{< code shell >}}
sudo service sensu-agent restart
{{< /code >}}

4. Restart the Sensu backend:
{{< code shell >}}
sudo service sensu-backend restart
{{< /code >}}

5. Run a single upgrade command on one your Sensu backends to migrate the cluster:
{{< code shell >}}
sensu-backend upgrade
{{< /code >}}

   To skip confirmation and immediately run the upgrade command, add the `--skip-confirm` flag:
{{< code shell >}}
sensu-backend upgrade --skip-confirm
{{< /code >}}

   {{% notice note %}}
   **NOTE**: If you are deploying a new Sensu cluster rather than upgrading from a previous version, you do not need to run the `sensu-backend upgrade` command.
{{% /notice %}}

6. Enter `y` or `n` to confirm if you did *not* add the `--skip-confirm` flag in step 5.
Otherwise, skip this step.

7. Wait a few seconds for the upgrade command to run.
You may notice some inconsistencies in your entity list until the cluster finishes upgrading.
Despite this, your cluster will continue to publish standard check requests and process events.

   If you run the upgrade command more than once, it will not harm the cluster &mdash; you'll just see a response that the upgrade command has already been run.

   Some minor versions do not involve database-specific changes, and the `sensu-backend upgrade` tool will report that nothing was upgraded.
Check the [release notes][16] to confirm whether a version has database-specific changes that require a backend upgrade.

8. Confirm the installed version for the agent, backend, and sensuctl:
{{< code shell >}}
sensu-agent version
{{< /code >}}
{{< code shell >}}
sensu-backend version
{{< /code >}}
{{< code shell >}}
sensuctl version
{{< /code >}}

{{% notice protip %}}
**PRO TIP**: If your upgrade is unsuccessful, read the version-specific information on this page and complete the instructions for each version, starting with your current version and continuing up to the version you want to install.<br><br>
For example, to debug an upgrade from 5.5.0 to 6.1.0, start with [Upgrade Sensu clusters from 5.7.0 or earlier to 5.8.0 or later](#upgrade-sensu-clusters-from-570-or-earlier-to-580-or-later).
{{% /notice %}}

## Upgrade to Sensu Go 6.2.0 from any previous version

Prior to Sensu Go 6.0, sensu-backend allowed you to delete a namespace even when other resources still referenced that namespace. 
As of Sensu Go 6.0, it is not possible to delete namespaces that are referenced in other resources.
As a result, users whose configuration predates Sensu Go 6.0 may have lingering resources, including check configurations, that reference non-existent namespaces.

Upgrading to Sensu Go 6.2.0 requires sensu-backend to upgrade check configurations.
If you have check configurations that reference non-existent namespaces, the 6.2.0 upgrade operation will fail when it encounters one of these check configurations.
You will see an error message like this:

{{< code shell >}}
{"component":"store-providers","error":"the namespace test does not exist","level":"error","msg":"error enabling round robin scheduling,backend restart required","time":"2020-12-27T08:41:59Z"}
{{< /code >}}

When this happens, the backend is effectively halted and subsequent restarts will result in the same state.

### Remove checks that reference non-existent namespaces

Use the following commands with the [jq utility][7] to identify and remove checks that reference deleted namespaces before you upgrade to Sensu Go 6.2.0.

{{% notice note %}}
**NOTE**: If you have already upgraded to Sensu Go 6.2.0, you can work around this issue by temporarily reverting your Sensu instance to Sensu Go 6.1.4.
Then, recreate the missing namespaces referenced in your check configurations and upgrade again to 6.2.0.
{{% /notice %}}

These commands use a Sensu backend running on `localhost` in the example URL and the environment variable $SENSU_API_KEY to represent a valid [API key][8].

1. Get a list of existing namespaces.
In this example, the existing namespaces are `stage` and `dev`.
{{< code shell >}}
curl -s -H "Authorization: Key $SENSU_API_KEY" http://localhost:8080/api/core/v2/namespaces | jq '[.[].name]'
[
   "stage",
   "dev"
]
{{< /code >}}

2. Print the name and namespace for any checks that reference a namespace that is not specified in the jq expression on the same line.
Your jq expression should include all of the namespaces you retrieved in step 1 (in this example, `["stage","dev"]`).
{{< code shell >}}
curl -s -H "Authorization: Key $SENSU_API_KEY" http://localhost:8080/api/core/v2/checks | jq '["stage","dev"] as $valid | .[] | select(.metadata.namespace as $in | $valid | index($in) | not) | {name: .metadata.name, namespace: .metadata.namespace}'
{
  "name": "check-cpu",
  "namespace": "test"
}
{{< /code >}}

3. Recreate the missing `test` namespace so you can delete the `check-cpu` check.
{{< code shell >}}
sensuctl namespace create test
{{< /code >}}

4. Delete the `check-cpu` check.
{{< code shell >}}
sensuctl check delete check-cpu --namespace test
{{< /code >}}

5. Delete the `test` namespace, which is now empty after you deleted `check-cpu` in step 4.
{{< code shell >}}
sensuctl namespace delete test
{{< /code >}}

After completing these commands, you can upgrade to 6.2.0.

## Upgrade to Sensu Go 6.1.0 from 6.0.0

If you are using 6.0.0 and have a large number of events in PostgreSQL, you may experience a short period of unavailability after you upgrade to 6.1.0. 
This pause will occur while the optimized selector information is populating during automatic database migration.
It may last for a period of a few seconds to a few minutes.

This pause may extend to API request processing, so sensuctl and the web UI may also be unavailable during the migration.

## Upgrade to Sensu Go 6.0 from a 5.x deployment

Before you upgrade to Sensu 6.0, use [`sensuctl dump`][15] to create a backup of your existing installation.

You will not be able to downgrade to a Sensu 5.x version after you upgrade your database to Sensu 6.0 after you restart the backend in the [upgrade process][10].

## Upgrade to Sensu Go 5.16.0 from any earlier version

As of Sensu Go 5.16.0, Sensu's free entity limit is 100 entities.
All [commercial features][6] are available for free in the packaged Sensu Go distribution for up to 100 entities.

When you upgrade to 5.16.0, if your existing unlicensed instance has more than 100 entities, Sensu will continue to monitor those entities.
However, if you try to create any new entities via the HTTP API or sensuctl, you will see the following message:

`This functionality requires a valid Sensu Go license with a sufficient entity limit. To get a valid license file, arrange a trial, or increase your entity limit, contact Sales.`

Connections from new agents will fail and result in a log message like this:

{{< code shell >}}
{"component":"agent","error":"handshake failed with status 402","level":"error","msg":"reconnection attempt failed","time":"2019-11-20T05:49:24-07:00"}
{{< /code >}}

In the web UI, you will see the following message when you reach the 100-entity limit:

![Sensu web UI warning when the entity limit is reached][3]

If your Sensu instance includes more than 100 entities, [contact Sales][4] to learn how to upgrade your installation and increase your limit.
Read [our blog announcement][5] for more information about our usage policy.

## Upgrade Sensu clusters from 5.7.0 or earlier to 5.8.0 or later

{{% notice note %}}
**NOTE**: This section applies only to Sensu clusters with multiple backend nodes.
{{% /notice %}}

Due to updates to etcd serialization, you must shut down Sensu clusters with multiple backend nodes while upgrading from Sensu Go 5.7.0 or earlier to 5.8.0 or later.
Read the [backend reference][2] for more information about stopping and starting backends.

## Upgrade Sensu backend binaries to 5.1.0

{{% notice note %}}
**NOTE**: This section applies only to Sensu backend binaries downloaded from `s3-us-west-2.amazonaws.com/sensu.io/sensu-go`, not to Sensu RPM or DEB packages.
{{% /notice %}}

For Sensu backend binaries, the default `state-dir` in 5.1.0 is now `/var/lib/sensu/sensu-backend` instead of `/var/lib/sensu`.
To upgrade your Sensu backend binary to 5.1.0, first [download the latest version][1].
Then, make sure the `/etc/sensu/backend.yml` configuration file specifies a `state-dir`.
To continue using `/var/lib/sensu` as the `state-dir` to store backend data, add the following configuration to `/etc/sensu/backend.yml`:

{{< code yml >}}
state-dir: "/var/lib/sensu"
{{< /code >}}

Then restart the backend:

{{< code shell >}}
sudo service sensu-backend restart
{{< /code >}}


[1]: ../../deploy-sensu/install-sensu/
[2]: ../../../observability-pipeline/observe-schedule/backend#operation
[3]: /images/web-ui-entity-warning.png
[4]: https://sensu.io/contact?subject=contact-sales/
[5]: https://sensu.io/blog/one-year-of-sensu-go
[6]: ../../../commercial/
[7]: https://stedolan.github.io/jq/
[8]: ../../../api/#authenticate-with-an-api-key
[9]: https://etcd.io/docs/latest/op-guide/recovery/
[10]: ../../maintain-sensu/upgrade/
[11]: https://golang.google.cn/doc/go1.15#commonname
[12]: ../../deploy-sensu/generate-certificates/
[13]: https://www.postgresql.org/docs/current/backup.html
[14]: #upgrade-sensu-clusters-from-570-or-earlier-to-580-or-later
[15]: ../../../sensuctl/back-up-recover/
[16]: ../../../release-notes/
