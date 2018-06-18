---
title: "Upgrading Sensu Enterprise"
weight: 14
product: "Sensu Enterprise"
version: "2.7"
menu: "sensu-enterprise-2.7"
---

In most cases, you can upgrade Sensu Enterprise by installing the
latest package. Certain versions of Sensu Enterprise may include
changes that are *not backwards compatible* and require additional
steps be taken when upgrading.

## Upgrading the Sensu Enterprise package

The following instructions assume that you have already installed
Sensu Enterprise by using the steps detailed in the[Sensu Installation
Guide][overview].

_NOTE: If your machines do not have direct access to the internet and
cannot reach the Sensu software repositories, you must mirror the
repositories and keep them up-to-date._

#### Ubuntu/Debian

{{< highlight shell >}}
sudo apt-get update
sudo apt-get -y install sensu-enterprise{{< /highlight >}}

#### CentOS/RHEL

{{< highlight shell >}}
sudo yum install sensu-enterprise{{< /highlight >}}

[overview]:  /sensu-core/latest/installation/install-sensu-server-api/#sensu-enterprise
