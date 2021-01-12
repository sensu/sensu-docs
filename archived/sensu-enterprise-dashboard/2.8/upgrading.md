---
title: "Upgrading Sensu Enterprise"
product: "Sensu Enterprise"
version: "2.8"
weight: 3
menu: "sensu-enterprise-2.8"
---

In most cases, you can upgrade Sensu Enterprise by installing the
latest package. Certain versions of Sensu Enterprise may include
changes that are *not backwards compatible* and require additional
steps be taken when upgrading.

## Upgrading the Sensu Enterprise package

The following instructions assume that you have already installed
Sensu Enterprise using the steps detailed in the [Sensu
Installation Guide][overview].

_NOTE: If your machines do not have direct access to the internet and
cannot reach the Sensu software repositories, you must mirror the
repositories and keep them up-to-date._

1. Download the latest package.<br><br>CentOS/RHEL:
{{< code shell >}}
sudo yum install sensu-enterprise{{< /code >}}
Ubuntu/Debian:
{{< code shell >}}
sudo apt-get update
sudo apt-get -y install sensu-enterprise{{< /code >}}

2. Restart Sensu Enterprise:
{{< code shell >}}
sudo systemctl restart sensu-enterprise{{< /code >}}
_NOTE: For Linux distributions using `sysvinit`, use `sudo service sensu-enterprise restart`._

3. Use the [Info API][info] to confirm that Sensu Enterprise has upgraded to the [latest version][change]:
{{< code shell >}}
curl -s http://127.0.0.1:4567/info | jq .{{< /code >}}

[overview]: ../installation/overview
[info]: /sensu-core/latest/api/health-and-info
[change]: ../changelog
