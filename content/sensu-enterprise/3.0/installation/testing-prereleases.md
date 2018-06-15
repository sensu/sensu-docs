---
title: "Testing Prereleases"
weight: 15
product: "Sensu Enterprise"
version: "3.0"
menu:
  sensu-enterprise-3.0:
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

## Install Prerelease Repository - Sensu Enterprise

### Ubuntu/Debian

1. Install the GPG public key:
{{< highlight shell >}}
wget -q http://$SE_USER:$SE_PASS@enterprise.sensuapp.com/apt/pubkey.gpg -O- | sudo apt-key add -{{< /highlight >}}

1. Create an APT configuration file at `/etc/apt/sources.list.d/sensu.list`:
{{< highlight shell >}}
echo "deb     https://sensu.global.ssl.fastly.net/apt $CODENAME unstable" | sudo tee /etc/apt/sources.list.d/sensu-unstable.list{{< /highlight >}}

3. Update APT:
{{< highlight shell >}}
sudo apt-get update && sudo upgrade sensu{{< /highlight >}}

### RHEL/CentOS

1. Create the YUM repository configuration file for the Sensu Core repository at
   `/etc/yum.repos.d/sensu.repo`:
   {{< highlight shell >}}
echo "[sensu-enterprise]
name=sensu-enterprise
baseurl=http://$SE_USER:$SE_PASS@enterprise.sensuapp.com/yum-unstable/noarch/
gpgcheck=0
enabled=1" | sudo tee /etc/yum.repos.d/sensu-enterprise.repo{{< /highlight >}}

2. Install Sensu
{{< highlight shell >}}
sudo yum update sensu{{< /highlight >}}
## Reporting issues

If you encounter an issue while installing or using a Sensu
prerelease, please create a [Sensu Core GitHub issue][1] if one does
not already exist for it.

[1]:  https://github.com/sensu/sensu/issues