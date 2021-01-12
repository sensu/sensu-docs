---
title: "Testing Prereleases"
description: "The complete Sensu installation guide."
weight: 15
product: "Sensu Core"
version: "1.3"
previous: ../upgrading
menu:
  sensu-core-1.3:
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
existing Sensu repository configuration files, you will need to revert
these changes in order to return to using stable releases._

## Install Prerelease Repository

### Ubuntu/Debian

1. Install the GPG public key:
   {{< code shell >}}
wget -q https://eol-repositories.sensuapp.org/apt/pubkey.gpg -O- | sudo apt-key add -{{< /code >}}

2. Determine the codename of the Ubuntu/Debian release on your system:
   {{< code shell >}}
. /etc/os-release && echo $VERSION
"14.04.4 LTS, Trusty Tahr" # codename for this system is "trusty"{{< /code >}}

3. Create an APT configuration file at
   `/etc/apt/sources.list.d/sensu.list`:
   {{< code shell >}}
export CODENAME=your_release_codename_here # e.g. "trusty"
echo "deb     https://eol-repositories.sensuapp.org/apt $CODENAME unstable" | sudo tee /etc/apt/sources.list.d/sensu.list{{< /code >}}

4. Update APT:
   {{< code shell >}}
sudo apt-get update{{< /code >}}

### RHEL/CentOS

1. Create the YUM repository configuration file for the Sensu Core repository at
   `/etc/yum.repos.d/sensu.repo`:
   {{< code shell >}}
echo '[sensu]
name=sensu
baseurl=https://eol-repositories.sensuapp.org/yum-unstable/$releasever/$basearch/
gpgcheck=0
enabled=1' | sudo tee /etc/yum.repos.d/sensu.repo{{< /code >}}

## Reporting issues

If you encounter an issue while installing or using a Sensu
prerelease, please create a [Sensu Core GitHub issue][1] if one does
not already exist for it.

[1]:  https://github.com/sensu/sensu/issues
