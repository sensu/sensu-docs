---
title: "Client Installation"
description: "The Sensu Core client installation guide."
weight: 1
version: "1.1"
product: "Sensu Core"
platformContent: true
menu:
  sensu-core-1.1:
    parent: quick-start
---

## Install the Sensu Client

Having successfully installed and configured a Sensu server and API (Sensu Core
or Sensu Enterprise), let's now install and/or configure a Sensu client. The
Sensu client is run on every system you need to monitor, including those running
the Sensu server and API, and Sensu's dependencies (i.e. RabbitMQ and/or
Redis). **Both Sensu Core and Sensu Enterprise use the same Sensu client
process** (i.e. `sensu-client`), so upgrading from Sensu Core to Sensu
Enterprise does not require you to install a difference Sensu client.

## Included in Sensu Core

The Sensu client process (`sensu-client`) is part of the open source Sensu
project (i.e. Sensu Core) and it is included in the Sensu Core installer
packages along with the Sensu Core server and API processes (i.e. `sensu-server`
and `sensu-api`). This means that if you are following the instructions in this
guide for a [standalone][1] installation, your Sensu client is already
installed!

## Disabled by default

The Sensu client process (`sensu-client`) is disabled by default on all
platforms. Please refer to the corresponding configuration and operation
documentation corresponding to the platform where you have installed your Sensu
client(s) for instructions on starting & stopping the Sensu client process,
and/or enabling the Sensu client process to start automatically on system boot.

## Install Sensu Core {#sensu-core}

{{< platformBlock "Ubuntu/Debian" >}}

### Ubuntu/Debian

{{< platformDropdown "Ubuntu/Debian" "Sensu-Core" "1.0" "Client Installation" "sensu-core">}}

Sensu Core is installed on Ubuntu and Debian systems via a native system
installer package (i.e. a .deb file), which is available for download from the
[Sensu Downloads][1] page, and from APT package management repositories. The
Sensu Core package installs several processes including `sensu-server`,
`sensu-api`, and `sensu-client`.

Sensu packages for Debian target current [`stable` and `oldstable`
releases][15].

Sensu packages for Ubuntu target current [Long Term Support (LTS) releases][16].

If you wish to install Sensu packages on newer Debian or Ubuntu releases, please
try installing a package built for the most recent Debian `stable` or
Ubuntu LTS release.

#### Install Sensu using APT (recommended) {#install-sensu-core-repository}

_NOTE: As of Sensu version 0.27, apt repository configuration has
changed to include the "codename" of the Ubuntu/Debian release. To
install or upgrade to the latest version of Sensu, please ensure you
have updated existing repository configurations._

1. Install the GPG public key:
{{< highlight shell >}}
wget -q https://sensu.global.ssl.fastly.net/apt/pubkey.gpg -O- | sudo apt-key add -{{< /highlight >}}

2. Determine the codename of the Ubuntu/Debian release on your system:
{{< highlight shell >}}
. /etc/os-release && echo $VERSION
"14.04.4 LTS, Trusty Tahr" # codename for this system is "trusty"{{< /highlight >}}

3. Create an APT configuration file at
   `/etc/apt/sources.list.d/sensu.list`:
{{< highlight shell >}}
export CODENAME=your_release_codename_here # e.g. "trusty"
echo "deb     https://sensu.global.ssl.fastly.net/apt $CODENAME main" | sudo tee /etc/apt/sources.list.d/sensu.list{{< /highlight >}}

4. Update APT:
{{< highlight shell >}}
sudo apt-get update{{< /highlight >}}

5. Install Sensu:
{{< highlight shell >}}
sudo apt-get install sensu{{< /highlight >}}
   _NOTE: as mentioned above, the `sensu` package installs all of the Sensu Core
   processes, including `sensu-client`, `sensu-server`, and `sensu-api`._

6. Configure Sensu. **No "default" configuration is provided with Sensu**, so
   none of the Sensu processes will run without the corresponding configuration.
   Please refer to the ["Configure Sensu" section][11] (below), for more
   information on configuring Sensu. **At minimum, all of the Sensu processes
   will need a working [transport definition][12]**. The Sensu client will need
   a [client definition][13], and both the `sensu-server` and `sensu-api` will
   need a [data-store (Redis) definition][14] &mdash; all of which are explained
   below.

{{< platformBlockClose >}}

{{< platformBlock "RHEL/CentOS" >}}

### RHEL/CentOS

{{< platformDropdown "RHEL/CentOS" "Sensu-Core" "1.0" "Client Installation" "sensu-core" >}}

Sensu Core is installed on RHEL and CentOS systems via a native system installer
package (i.e. a .rpm file), which is available for download from the [Sensu
Downloads][1] page, and from YUM package management repositories. The Sensu Core
package installs several processes including `sensu-server`, `sensu-api`, and
`sensu-client`.

#### Install Sensu using YUM (recommended) {#install-sensu-core-repository}

Sensu packages for Red Hat target currently supported versions of Red Hat
Enterprise Linux and their Centos equivalents. These packages are generally
expected to be compatible with Red Hat derivatives like SuSE, Amazon or
Scientific Linux, but packages are not tested on these platforms.

The following instructions describe configuring package repository definitions
using [Yum variables][14] as components of the baseurl. On Red Hat derivative
platforms the value of the `$releasever` variable will not typically align with
the RHEL release versions (e.g. `6` or `7`) advertised in the Sensu Yum
repository. Please use `6` or `7` in lieu of `$releasever` on RHEL derivatives,
depending on whether they use sysv init or systemd, respectively.

_NOTE: As of Sensu version 0.27, the yum repository URL has changed to
include the `$releasever` variable. To install or upgrade to the
latest version of Sensu, please ensure you have updated existing
repository configurations._

1. Create the YUM repository configuration file for the Sensu Core repository at
   `/etc/yum.repos.d/sensu.repo`:
{{< highlight shell >}}
echo '[sensu]
name=sensu
baseurl=https://sensu.global.ssl.fastly.net/yum/$releasever/$basearch/
gpgcheck=0
enabled=1' | sudo tee /etc/yum.repos.d/sensu.repo{{< /highlight >}}

2. Install Sensu:
{{< highlight shell >}}
sudo yum install sensu{{< /highlight >}}
   _NOTE: as mentioned above, the `sensu` package installs all of the Sensu Core processes, including `sensu-client`, `sensu-server`, and `sensu-api`._

3. Configure Sensu. **No "default" configuration is provided with Sensu**, so
   none of the Sensu processes will run without the corresponding configuration.
   Please refer to the ["Configure Sensu" section][10] (below), for more
   information on configuring Sensu. **At minimum, all of the Sensu processes
   will need a working [transport definition][11]**. The Sensu client will need
   a [client definition][12], and both the `sensu-server` and `sensu-api` will
   need a [data-store (Redis) definition][13] &mdash; all of which are explained
   below.

{{< platformBlockClose >}}
