---
title: "Upgrade Sensu"
linkTitle: "Upgrade Sensu"
description: "Upgrade to the latest version of Sensu. Read this upgrade guide to learn about the latest features and bug fixes in Sensu Go."
weight: 10
version: "5.18"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.18:
    parent: maintain-sensu
---

## Upgrade to the latest version of Sensu Go from 5.0.0 or later

To upgrade to the latest version of Sensu Go from version 5.0.0 or later, [install the latest packages][1].

Then, restart the services.

{{% notice note %}}
**NOTE**: For systems that use `systemd`, run `sudo systemctl daemon-reload` before restarting the services.
{{% /notice %}}

{{< code shell >}}
# Restart the Sensu agent
sudo service sensu-agent restart

# Restart the Sensu backend
sudo service sensu-backend restart
{{< /code >}}

Use the `version` command to determine the installed version using the `sensu-agent`, `sensu-backend`, and `sensuctl` tools.
For example, `sensu-backend version`.

## Upgrade to Sensu Go 5.16.0 from any earlier version

As of Sensu Go 5.16.0, Sensu's free entity limit is 100 entities.
All [commercial features][6] are available for free in the packaged Sensu Go distribution up to an entity limit of 100.

When you upgrade to 5.16.0, if your existing unlicensed instance has more than 100 entities, Sensu will continue to monitor those entities.
However, if you try to create any new entities via the HTTP API or sensuctl, you will see the following message:

`This functionality requires a valid Sensu Go license with a sufficient entity limit. To get a valid license file, arrange a trial, or increase your entity limit, contact Sales.`

Connections from new agents will fail and result in a log message like this:

{{< code shell >}}
{"component":"agent","error":"handshake failed with status 402","level":"error","msg":"reconnection attempt failed","time":"2019-11-20T05:49:24-07:00"}
{{< /code >}}

In the web UI, you will see the following message when you reach the 100-entity limit:

{{< figure src="/images/go/upgrade/web_ui_entity_warning.png" alt="Example web UI warning message when you reach the 100-entity limit" link="/images/go/upgrade/web_ui_entity_warning.png" target="_blank" >}}

If your Sensu instance includes more than 100 entities, [contact Sales][4] to learn how to upgrade your installation and increase your limit.
See [our blog announcement][5] for more information about our usage policy.

## Upgrade Sensu clusters from 5.7.0 or earlier to 5.8.0 or later

{{% notice note %}}
**NOTE**: This section applies only to Sensu clusters with multiple backend nodes.
{{% /notice %}}

Due to updates to etcd serialization, you must shut down Sensu clusters with multiple backend nodes while upgrading from Sensu Go 5.7.0 or earlier to 5.8.0 or later.
See the [backend reference][2] for more information about stopping and starting backends.

## Upgrade Sensu backend binaries to 5.1.0

{{% notice note %}}
**NOTE**: This section applies only to Sensu backend binaries downloaded from `s3-us-west-2.amazonaws.com/sensu.io/sensu-go`, not to Sensu RPM or DEB packages.
{{% /notice %}}

For Sensu backend binaries, the default `state-dir` in 5.1.0 is now `/var/lib/sensu/sensu-backend` instead of `/var/lib/sensu`.
To upgrade your Sensu backend binary to 5.1.0, first [download the latest version][1].
Then, make sure the `/etc/sensu/backend.yml` configuration file specifies a `state-dir`.
To continue using `/var/lib/sensu` as the `state-dir`, add the following configuration to `/etc/sensu/backend.yml`.

{{< code yml >}}
# /etc/sensu/backend.yml configuration to store backend data at /var/lib/sensu
state-dir: "/var/lib/sensu"
{{< /code >}}

Then restart the backend.


[1]: ../../deploy-sensu/install-sensu/
[2]: ../../../reference/backend#operation
[3]: /images/web-ui-entity-warning.png
[4]: https://sensu.io/contact?subject=contact-sales/
[5]: https://blog.sensu.io/one-year-of-sensu-go
[6]: ../../../commercial/
