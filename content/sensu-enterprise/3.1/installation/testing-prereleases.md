---
title: "Testing Prereleases"
weight: 15
product: "Sensu Enterprise"
version: "3.1"
menu:
  sensu-enterprise-3.1:
    parent: installation
---

_WARNING: Sensu prereleases are your first chance to try out new
features and bug fixes. Please be aware that you may be the first to
discover an issue, you probably do not want to use a prerelease in
production._

Testing and using a Sensu prerelease is straightforward, it simply
involves using a different package repository. You should only be
using prereleases if you already have experience installing and
managing a Sensu installation. Below are the per-platform prerelease
repository installation instructions. We are slowly adding prerelease
repositories for other platforms.

_NOTE: The Sensu prerelease repository instructions replace the
existing Sensu repository configuration files, so you will need to revert
these changes in order to return to using stable releases._

## Install Prerelease Repository

### Ubuntu/Debian

1. Install the GPG public key:
{{< code shell >}}
wget -q https://sensu.global.ssl.fastly.net/apt/pubkey.gpg -O- | sudo apt-key add -{{< /code >}}

2. Determine the codename of the Ubuntu/Debian release on your system:
{{< code shell >}}
. /etc/os-release && echo $VERSION
"14.04.4 LTS, Trusty Tahr" # codename for this system is "trusty"{{< /code >}}

3. Create an APT configuration file at `/etc/apt/sources.list.d/sensu.list`:
{{< code shell >}}
export CODENAME=your_release_codename_here # e.g. "trusty"
echo "deb     https://sensu.global.ssl.fastly.net/apt $CODENAME unstable" | sudo tee /etc/apt/sources.list.d/sensu.list{{< /code >}}

4. Update APT:
{{< code shell >}}
sudo apt-get update && sudo apt-get upgrade sensu{{< /code >}}

### RHEL/CentOS

1. Create the YUM repository configuration file for the Sensu Core repository at
   `/etc/yum.repos.d/sensu.repo`:
{{< code shell >}}
echo '[sensu]
name=sensu
baseurl=https://sensu.global.ssl.fastly.net/yum-unstable/$releasever/$basearch/
gpgcheck=0
enabled=1' | sudo tee /etc/yum.repos.d/sensu.repo{{< /code >}}

2. Install Sensu:
{{< code shell >}}
sudo yum update sensu{{< /code >}}

## Reporting issues

If you encounter an issue while installing or using a Sensu
prerelease, please create a [Sensu Core GitHub issue][1] if one does
not already exist for it.

[1]:  https://github.com/sensu/sensu/issues
