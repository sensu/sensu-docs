---
title: "Upgrading Sensu"
linkTitle: "Upgrade Sensu"
description: "Upgrade to the latest version of Sensu. Read the upgrade guide to get the latest features and bug fixes in Sensu Go and learn about upgrading to Sensu Go from Sensu Core 1.x."
weight: 3
version: "5.11"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.11:
    parent: installation
---

- [Upgrading from 5.0.0 or later](#upgrading-to-the-latest-version-of-sensu-go-from-5-0-0-or-later)
- [Upgrading Sensu clusters from 5.7.0 or earlier to 5.8.0 or later](#upgrading-sensu-clusters-from-5-7-0-or-earlier-to-5-8-0-or-later)
- [Upgrading Sensu backend binaries to 5.1.0](#upgrading-sensu-backend-binaries-to-5-1-0)
- [Upgrading from 1.x or later](/sensu-core/latest/migration)

## Upgrading to the latest version of Sensu Go from 5.0.0 or later

To upgrade to the latest version of Sensu Go from version 5.0.0 or later, first [install the latest packages][23].

Then restart the services.

_NOTE: For systems using `systemd`, run `sudo systemctl daemon-reload` before restarting the services._

{{< highlight shell >}}
# Restart the Sensu agent
sudo service sensu-agent restart

# Restart the Sensu backend
sudo service sensu-backend restart
{{< /highlight >}}

You can use the `version` command to determine the installed version using the `sensu-agent`, `sensu-backend`, and `sensuctl` tools. For example: `sensu-backend version`.

## Upgrading Sensu clusters from 5.7.0 or earlier to 5.8.0 or later

_NOTE: This applies only to Sensu clusters with multiple backend nodes._

Due to updates to etcd serialization, Sensu clusters with multiple backend nodes must be shut down while upgrading from Sensu Go 5.7.0 or earlier to 5.8.0 or later.
See the [backend reference][27] for more information about stopping and starting backends.

## Upgrading Sensu backend binaries to 5.1.0

_NOTE: This applies only to Sensu backend binaries downloaded from `s3-us-west-2.amazonaws.com/sensu.io/sensu-go`, not to Sensu RPM or DEB packages._

For Sensu backend binaries, the default `state-dir` in 5.1.0 is now `/var/lib/sensu/sensu-backend` instead of `/var/lib/sensu`.
To upgrade your Sensu backend binary to 5.1.0, first [download the latest version][23], then make sure the `/etc/sensu/backend.yml` configuration file specifies a `state-dir`.
To continue using `/var/lib/sensu` as the `state-dir`, add the following configuration to `/etc/sensu/backend.yml`.

{{< highlight yml >}}
# /etc/sensu/backend.yml configuration to store backend data at /var/lib/sensu
state-dir: "/var/lib/sensu"
{{< /highlight >}}

Then restart the backend.

[1]: ../../getting-started/glossary
[2]: https://github.com/etcd-io/etcd/tree/master/Documentation
[3]: ../../reference/backend
[4]: ../../reference/agent
[5]: ../../sensuctl/reference
[6]: ../../reference/entities
[7]: ../../guides/monitor-external-resources
[8]: ../../reference/hooks
[9]: ../../reference/filters#built-in-filter-only-incidents
[10]: ../../reference/filters/#handling-repeated-events
[11]: ../../reference/filters/#built-in-filters
[12]: ../../reference/assets
[13]: ../../reference/rbac
[14]: ../../guides/create-read-only-user
[15]: ../../reference/filters/#built-in-filter-allow-silencing
[16]: ../../reference/tokens
[17]: ../../api/overview
[18]: https://github.com/sensu/sensu-translator
[19]: /sensu-core/1.6/
[20]: https://packagecloud.io/sensu/community
[21]: https://github.com/sensu-plugins
[22]: ../plugins
[23]: ../../installation/install-sensu
[24]: ../../reference/entities#metadata-attributes
[25]: https://blog.sensu.io/check-configuration-upgrades-with-the-sensu-go-sandbox
[26]: https://blog.sensu.io/self-service-monitoring-checks-in-sensu-go
[27]: ../../getting-started/enterprise
[28]: https://bonsai.sensu.io/assets/sensu/sensu-aggregate-check
[27]: ../../reference/backend#operation
