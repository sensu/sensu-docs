---
title: "Supported platforms and distributions"
linkTitle: "Platforms and Distributions"
description: "Sensu Go is available on a wide range of platforms, including Linux, Windows, and macOS. Learn which platforms you can use with the Sensu backend, Sensu agent, and sensuctl command line tool."
weight: -60
version: "5.17"
product: "Sensu Go"
menu: "sensu-go-5.17"
platformContent: true
platforms: ["Linux", "Windows", "macOS", "FreeBSD", "Solaris"]
---

- [Supported packages](#supported-packages)
  - [Sensu backend](#sensu-backend) | [Sensu agent](#sensu-agent) | [Sensuctl command line tool](#sensuctl-command-line-tool)
- [Docker images](#docker-images)
- [Integrations](#integrations)
- [Binary-only distributions](#binary-only-distributions)
  - [Linux](#linux) | [Windows](#windows) | [macOS](#macos) | [FreeBSD](#freebsd) | [Solaris](#solaris)
- [Build from source](#build-from-source)

Sensu is available as [packages][1], [Docker images][2], and [binary-only distributions][4].
We recommend [installing Sensu][5] with one of our supported packages, Docker images, or [configuration management][6] integrations.
Sensu downloads are provided under the [Sensu commercial license][7].

## Supported packages

Supported packages are available through [sensu/stable][8] on packagecloud and the [downloads page][9].

### Sensu backend

| Platform and Version | `amd64` | | | |
|----------------------|---------|---|---|---|
| CentOS/RHEL 6, 7, 8 | {{< check >}} | | | |
| Debian 8, 9, 10     | {{< check >}} | | | |
| Ubuntu 14.04        | {{< check >}} | | | |
| Ubuntu 16.04        | {{< check >}} | | | |
| Ubuntu 18.04, 18.10 | {{< check >}} | | | |
| Ubuntu 19.04        | {{< check >}} | | | |

### Sensu agent

| Platform and Version | `amd64` | `386` | | | | |
|----------------------|---------|-------|---|---|---|---|
| CentOS/RHEL 6, 7, 8 | {{< check >}} | | | |
| Debian 8, 9, 10     | {{< check >}} | | | |
| Ubuntu 14.04        | {{< check >}} | | | |
| Ubuntu 16.04        | {{< check >}} | | | |
| Ubuntu 18.04, 18.10 | {{< check >}} | | | |
| Ubuntu 19.04        | {{< check >}} | | | |
| Windows 7 and later | {{< check >}} | {{< check >}} | | |
| Windows Server 2008 R2 and later | {{< check >}} | {{< check >}} | | |

### Sensuctl command line tool

| Platform and Version | `amd64` | `386` | | | | |
|----------------------|---------|-------|---|---|---|---|
| CentOS/RHEL 6, 7, 8 | {{< check >}} | | | |
| Debian 8, 9, 10     | {{< check >}} | | | |
| Ubuntu 14.04        | {{< check >}} | | | |
| Ubuntu 16.04        | {{< check >}} | | | |
| Ubuntu 18.04, 18.10 | {{< check >}} | | | |
| Ubuntu 19.04        | {{< check >}} | | | |
| Windows 7 and later | {{< check >}} | {{< check >}} | | |
| Windows Server 2008 R2 and later | {{< check >}} | {{< check >}} | | |

## Docker images

Docker images that contain the Sensu backend and Sensu agent are available for Linux-based containers.

| Image Name | Base
| ---------- | ------- |
| [sensu/sensu][10] | Alpine Linux
| [sensu/sensu-rhel][11] | Red Hat Enterprise Linux

## Integrations

- [Ansible role][17]
- [Chef cookbook][13]
- [Puppet module][14]
- [Sensu Go Data Source plugin for Grafana][12]

## Binary-only distributions

Sensu binary-only distributions that contain the Sensu backend, agent, and sensuctl tool are available in `.zip` and `.tar.gz` formats.

| Platform | Architectures |
|----------|---------------|
| Linux | `386` `amd64` `arm64` `armv5` `armv6` `armv7` |
| Windows | `386` `amd64` |
| macOS | `amd64` |
| FreeBSD | `386` `amd64` |
| Solaris | `amd64` |

{{< platformBlock "Linux" >}}

### Linux

Sensu binary-only distributions for Linux are available for these architectures and formats:

| Architecture | Formats |
| --- | --- |
| `amd64` | [`.tar.gz`][38] \| [`.zip`][20] |
| `arm64` | [`.tar.gz`][39] \| [`.zip`][21]
| `armv5` (agent and CLI) | [`.tar.gz`][40] \| [`.zip`][22] |
| `armv6` (agent and CLI) | [`.tar.gz`][41] \| [`.zip`][23] |
| `armv7` (agent and CLI) | [`.tar.gz`][18] \| [`.zip`][24] |
| `386` | [`.tar.gz`][19] \| [`.zip`][25] |

_**NOTE**: 32-bit systems cannot run the Sensu backend reliably, so `armv5`, `armv6`, and `armv7` packages include the agent and CLI only._

For example, to download Sensu for Linux `amd64` in `tar.gz` format:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_linux_amd64.tar.gz
{{< /highlight >}}

Generate a SHA-256 checksum for the downloaded artifact:

{{< highlight shell >}}
sha256sum sensu-go_5.17.2_linux_amd64.tar.gz
{{< /highlight >}}

The result should match the checksum for your platform:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_checksums.txt && cat sensu-go_5.17.2_checksums.txt
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}

### Windows

Sensu binary-only distributions for Windows are available for these architectures and formats:

| Architecture | Formats |
| --- | --- |
| `amd64` | [`.tar.gz`][26] \| [`.zip`][28]
| `386` | [`.tar.gz`][27] \| [`.zip`][29]

For example, to download Sensu for Windows `amd64` in `zip` format:

{{< highlight text >}}
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_windows_amd64.zip  -OutFile "$env:userprofile\sensu-go_5.17.2_windows_amd64.zip"
{{< /highlight >}}

Generate a SHA-256 checksum for the downloaded artifact:

{{< highlight text >}}
Get-FileHash "$env:userprofile\sensu-go_5.17.2_windows_amd64.zip" -Algorithm SHA256 | Format-List
{{< /highlight >}}

The result should match (with the exception of capitalization) the checksum for your platform:

{{< highlight text >}}
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_checksums.txt -OutFile "$env:userprofile\sensu-go_5.17.2_checksums.txt"

Get-Content "$env:userprofile\sensu-go_5.17.2_checksums.txt" | Select-String -Pattern windows_amd64
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "macOS" >}}

### macOS

Sensu binary-only distributions for macOS are available for these architectures and formats:

| Architecture | Formats |
| --- | --- |
| `amd64` | [`.tar.gz`][30] \| [`.zip`][31]

For example, to download Sensu for macOS `amd64` in `tar.gz` format:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_darwin_amd64.tar.gz
{{< /highlight >}}

Generate a SHA-256 checksum for the downloaded artifact:

{{< highlight shell >}}
shasum -a 256 sensu-go_5.17.2_darwin_amd64.tar.gz
{{< /highlight >}}

The result should match the checksum for your platform:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_checksums.txt && cat sensu-go_5.17.2_checksums.txt
{{< /highlight >}}

Extract the archive:

{{< highlight shell >}}
tar -xvf sensu-go_5.17.2_darwin_amd64.tar.gz
{{< /highlight >}}

Copy the executable into your PATH:

{{< highlight shell >}}
sudo cp sensuctl /usr/local/bin/
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "FreeBSD" >}}

### FreeBSD

Sensu binary-only distributions for FreeBSD are available for these architectures and formats:

| Architecture | Formats |
| --- | --- |
| `amd64` | [`.tar.gz`][32] \| [`.zip`][33]
| `386` | [`.tar.gz`][34] \| [`.zip`][35]

For example, to download Sensu for FreeBSD `amd64` in `tar.gz` format:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_freebsd_amd64.tar.gz
{{< /highlight >}}

Generate a SHA-256 checksum for the downloaded artifact:

{{< highlight shell >}}
sha256sum sensu-go_5.17.2_freebsd_amd64.tar.gz
{{< /highlight >}}

The result should match the checksum for your platform:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_checksums.txt && cat sensu-go_5.17.2_checksums.txt
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "Solaris" >}}

### Solaris

Sensu binary-only distributions for Solaris are available for these architectures and formats:

| Architecture | Formats |
| --- | --- |
| `amd64` | [`.tar.gz`][36] \| [`.zip`][37]

For example, to download Sensu for Solaris `amd64` in `tar.gz` format:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_solaris_amd64.tar.gz
{{< /highlight >}}

Generate a SHA-256 checksum for the downloaded artifact.

{{< highlight shell >}}
sha256sum sensu-go_5.17.2_solaris_amd64.tar.gz
{{< /highlight >}}

The result should match the checksum for your platform.

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_checksums.txt && cat sensu-go_5.17.2_checksums.txt
{{< /highlight >}}

{{< platformBlockClose >}}

## Build from source

Sensu Go's core is open source software, freely available under an MIT License.
Sensu Go instances built from source do not include [commercial features][3] such as the web UI homepage.
See the [feature comparison matrix][15] to learn more.
To build Sensu Go from source, see the [contributing guide on GitHub][16].


[1]: #supported-packages
[2]: #docker-images
[3]: /sensu-go/5.17/commercial/
[4]: #binary-only-distributions
[5]: /sensu-go/5.17/installation/install-sensu/
[6]: /sensu-go/5.17/installation/configuration-management/
[7]: https://sensu.io/sensu-license/
[8]: https://packagecloud.io/sensu/stable/
[9]: https://sensu.io/downloads/
[10]: https://hub.docker.com/r/sensu/sensu/
[11]: https://hub.docker.com/r/sensu/sensu-rhel/
[12]: https://github.com/sensu/grafana-sensu-go-datasource/
[13]: https://github.com/sensu/sensu-go-chef/
[14]: https://github.com/sensu/sensu-puppet/
[15]: https://sensu.io/enterprise/
[16]: https://github.com/sensu/sensu-go/blob/master/CONTRIBUTING.md
[17]: https://github.com/jaredledvina/sensu-go-ansible/
[18]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_linux_armv7.tar.gz
[19]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_linux_386.tar.gz
[20]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_linux_amd64.zip
[21]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_linux_arm64.zip
[22]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_linux_armv5.zip
[23]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_linux_armv6.zip
[24]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_linux_armv7.zip
[25]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_linux_386.zip
[26]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_windows_amd64.tar.gz
[27]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_windows_386.tar.gz
[28]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_windows_amd64.zip
[29]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_windows_386.zip
[30]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_darwin_amd64.tar.gz
[31]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_darwin_amd64.zip
[32]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_freebsd_amd64.tar.gz
[33]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_freebsd_amd64.zip
[34]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_freebsd_386.tar.gz
[35]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_freebsd_386.zip
[36]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_solaris_amd64.tar.gz
[37]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_solaris_amd64.zip
[38]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_linux_amd64.tar.gz
[39]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_linux_arm64.tar.gz
[40]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_linux_armv5.tar.gz
[41]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.17.2/sensu-go_5.17.2_linux_armv6.tar.gz
