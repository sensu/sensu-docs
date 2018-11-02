---
title: "Upgrading Sensu Enterprise"
weight: 3
product: "Sensu Enterprise"
version: "2.6"
menu: "sensu-enterprise-2.6"
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
{{< highlight shell >}}
sudo yum install sensu-enterprise{{< /highlight >}}
Ubuntu/Debian:
{{< highlight shell >}}
sudo apt-get update
sudo apt-get -y install sensu-enterprise{{< /highlight >}}

2. Restart Sensu Enterprise:
{{< highlight shell >}}
sudo systemctl restart sensu-enterprise{{< /highlight >}}
_NOTE: For Linux distributions using `sysvinit`, use `sudo service sensu-enterprise restart`._

3. Use the [Info API][info] to confirm that Sensu Enterprise has upgraded to the [latest version][change]:
{{< highlight shell >}}
curl -s http://127.0.0.1:4567/info | jq .{{< /highlight >}}

[overview]: ../installation/overview
[info]: /sensu-core/latest/api/health-and-info
[change]: ../changelog
