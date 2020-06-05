---
title: "Supported platforms and distributions"
linkTitle: "Platforms and Distributions"
description: "Sensu Go is available on a wide range of platforms, including Linux, Windows, and macOS. Learn which platforms you can use with the Sensu backend, Sensu agent, and sensuctl command line tool."
weight: -60
version: "5.20"
menu: "sensu-go-5.20"
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
| CentOS/RHEL 6        | {{< check >}}      |
| CentOS/RHEL 7        | {{< check >}}      |
| CentOS/RHEL 8        | {{< check >}}      |
| Ubuntu 14.04         | {{< check >}}      |
| Ubuntu 16.04         | {{< check >}}      |
| Ubuntu 18.04         | {{< check >}}      |
| Ubuntu 18.10         | {{< check >}}      |
| Ubuntu 19.04         | {{< check >}}      |
| Ubuntu 19.10         | {{< check >}}      |
| Ubuntu 20.04         | {{< check >}}      |
| Debian 8             | {{< check >}}      |
| Debian 9             | {{< check >}}      |
| Debian 10            | {{< check >}}      |

### Sensu agent

| Platform and Version | `amd64` | `386` | | | | |
|----------------------|---------|-------|---|---|---|---|
| CentOS/RHEL 6        | {{< check >}}      |
| CentOS/RHEL 7        | {{< check >}}      |
| CentOS/RHEL 8        | {{< check >}}      |
| Ubuntu 14.04         | {{< check >}}      |
| Ubuntu 16.04         | {{< check >}}      |
| Ubuntu 18.04         | {{< check >}}      |
| Ubuntu 18.10         | {{< check >}}      |
| Ubuntu 19.04         | {{< check >}}      |
| Ubuntu 19.10         | {{< check >}}      |
| Ubuntu 20.04         | {{< check >}}      |
| Debian 8             | {{< check >}}      |
| Debian 9             | {{< check >}}      |
| Debian 10            | {{< check >}}      |
| Windows Server 2008 R2 and later | {{< check >}} | {{< check >}} |
| Windows 7 and later | {{< check >}}     | {{< check >}}   |

### Sensuctl command line tool

| Platform and Version | `amd64` | `386` | | | | |
|----------------------|---------|-------|---|---|---|---|
| CentOS/RHEL 6        | {{< check >}}      |
| CentOS/RHEL 7        | {{< check >}}      |
| CentOS/RHEL 8        | {{< check >}}      |
| Ubuntu 14.04         | {{< check >}}      |
| Ubuntu 16.04         | {{< check >}}      |
| Ubuntu 18.04         | {{< check >}}      |
| Ubuntu 18.10         | {{< check >}}      |
| Ubuntu 19.04         | {{< check >}}      |
| Ubuntu 19.10         | {{< check >}}      |
| Ubuntu 20.04         | {{< check >}}      |
| Debian 8             | {{< check >}}      |
| Debian 9             | {{< check >}}      |
| Debian 10            | {{< check >}}      |
| Windows Server 2008 R2 and later | {{< check >}} | {{< check >}} |
| Windows 7 and later | {{< check >}}     | {{< check >}}   |

## Docker images

Docker images that contain the Sensu backend and Sensu agent are available for Linux-based containers.

| Image name | base
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

| Platform & Version | Linux | Windows | macOS | FreeBSD | Solaris |
|--------------------|-------|---------|-------|---------| ------- |
| `386`              | {{< check >}} | {{< check >}} | | {{< check >}}               |     
| `amd64`            | {{< check >}} | {{< check >}} | {{< check >}} | {{< check >}}  | {{< check >}} 
| `arm64`            | {{< check >}} |               |               |             |             |
| `armv5`            | {{< check >}} |               |               |             |             |
| `armv6`            | {{< check >}} |               |               |             |             |
| `armv7`            | {{< check >}} |               |               |             |             |
| `MIPS`             | {{< check >}} |               |               |             |             |
| `MIPS LE`          | {{< check >}} |               |               |             |             |
| `MIPS 64`          | {{< check >}} |               |               |             |             |
| `MIPS 64 LE`       | {{< check >}} |               |               |             |             |

{{< platformBlock "Linux" >}}

### Linux

Sensu binary-only distributions for Linux are available for these architectures and formats:

| arch | format |
| --- | --- |
| `386` | [`.tar.gz`][19] \| [`.zip`][25] |
| `amd64` | [`.tar.gz`][54] \| [`.zip`][20] |
| `arm64` | [`.tar.gz`][55] \| [`.zip`][21]
| `armv5` (agent and CLI) | [`.tar.gz`][56] \| [`.zip`][22] |
| `armv6` (agent and CLI) | [`.tar.gz`][57] \| [`.zip`][23] |
| `armv7` (agent and CLI) | [`.tar.gz`][18] \| [`.zip`][24] |
| `MIPS hard float` | [`.tar.gz`][38] \| [`.zip`][39] |
| `MIPS soft float` | [`.tar.gz`][40] \| [`.zip`][41] |
| `MIPS LE hard float` | [`.tar.gz`][42] \| [`.zip`][43] |
| `MIPS LE soft float` | [`.tar.gz`][44] \| [`.zip`][45] |
| `MIPS 64 hard float` | [`.tar.gz`][46] \| [`.zip`][47] |
| `MIPS 64 soft float` | [`.tar.gz`][48] \| [`.zip`][49] |
| `MIPS 64 LE hard float` | [`.tar.gz`][50] \| [`.zip`][51] |
| `MIPS 64 LE soft float` | [`.tar.gz`][52] \| [`.zip`][53] |

{{% notice note %}}
**NOTE**: 32-bit systems cannot run the Sensu backend reliably, so `armv5`, `armv6`, and `armv7` packages include the agent and CLI only.
In addition, all `MIPS` packages include only the agent and CLI.
{{% /notice %}}

For example, to download Sensu for Linux `amd64` in `tar.gz` format:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_amd64.tar.gz
{{< /highlight >}}

Generate a SHA-256 checksum for the downloaded artifact:

{{< highlight shell >}}
sha256sum sensu-go_5.20.2_linux_amd64.tar.gz
{{< /highlight >}}

The result should match the checksum for your platform:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_checksums.txt && cat sensu-go_5.20.2_checksums.txt
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}

### Windows

Sensu binary-only distributions for Windows are available for these architectures and formats:

| arch | format |
| --- | --- |
| `amd64` | [`.tar.gz`][26] \| [`.zip`][28]
| `386` | [`.tar.gz`][27] \| [`.zip`][29]

For example, to download Sensu for Windows `amd64` in `zip` format:

{{< highlight text >}}
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_windows_amd64.zip  -OutFile "$env:userprofile\sensu-go_5.20.2_windows_amd64.zip"
{{< /highlight >}}

Generate a SHA-256 checksum for the downloaded artifact:

{{< highlight text >}}
Get-FileHash "$env:userprofile\sensu-go_5.20.2_windows_amd64.zip" -Algorithm SHA256 | Format-List
{{< /highlight >}}

The result should match (with the exception of capitalization) the checksum for your platform:

{{< highlight text >}}
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_checksums.txt -OutFile "$env:userprofile\sensu-go_5.20.2_checksums.txt"

Get-Content "$env:userprofile\sensu-go_5.20.2_checksums.txt" | Select-String -Pattern windows_amd64
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "macOS" >}}

### macOS

Sensu binary-only distributions for macOS are available for these architectures and formats:

| arch | format |
| --- | --- |
| `amd64` | [`.tar.gz`][30] \| [`.zip`][31]

For example, to download Sensu for macOS `amd64` in `tar.gz` format:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_darwin_amd64.tar.gz
{{< /highlight >}}

Generate a SHA-256 checksum for the downloaded artifact:

{{< highlight shell >}}
shasum -a 256 sensu-go_5.20.2_darwin_amd64.tar.gz
{{< /highlight >}}

The result should match the checksum for your platform:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_checksums.txt && cat sensu-go_5.20.2_checksums.txt
{{< /highlight >}}

Extract the archive:

{{< highlight shell >}}
tar -xvf sensu-go_5.20.2_darwin_amd64.tar.gz
{{< /highlight >}}

Copy the executable into your PATH:

{{< highlight shell >}}
sudo cp sensuctl /usr/local/bin/
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "FreeBSD" >}}

### FreeBSD

Sensu binary-only distributions for FreeBSD are available for these architectures and formats:

| arch | format |
| --- | --- |
| `amd64` | [`.tar.gz`][32] \| [`.zip`][33]
| `386` | [`.tar.gz`][34] \| [`.zip`][35]

For example, to download Sensu for FreeBSD `amd64` in `tar.gz` format:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_freebsd_amd64.tar.gz
{{< /highlight >}}

Generate a SHA-256 checksum for the downloaded artifact:

{{< highlight shell >}}
sha256sum sensu-go_5.20.2_freebsd_amd64.tar.gz
{{< /highlight >}}

The result should match the checksum for your platform:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_checksums.txt && cat sensu-go_5.20.2_checksums.txt
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "Solaris" >}}

### Solaris

Sensu binary-only distributions for Solaris are available for these architectures and formats:

| arch | format |
| --- | --- |
| `amd64` | [`.tar.gz`][36] \| [`.zip`][37]

For example, to download Sensu for Solaris `amd64` in `tar.gz` format:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_solaris_amd64.tar.gz
{{< /highlight >}}

Generate a SHA-256 checksum for the downloaded artifact.

{{< highlight shell >}}
sha256sum sensu-go_5.20.2_solaris_amd64.tar.gz
{{< /highlight >}}

The result should match the checksum for your platform.

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_checksums.txt && cat sensu-go_5.20.2_checksums.txt
{{< /highlight >}}

{{< platformBlockClose >}}

## Build from source

Sensu Go's core is open source software, freely available under an MIT License.
Sensu Go instances built from source do not include [commercial features][3] such as the web UI homepage.
See the [feature comparison matrix][15] to learn more.
To build Sensu Go from source, see the [contributing guide on GitHub][16].


[1]: #supported-packages
[2]: #docker-images
[3]: /sensu-go/5.20/getting-started/enterprise/
[4]: #binary-only-distributions
[5]: /sensu-go/5.20/installation/install-sensu/
[6]: /sensu-go/5.20/installation/configuration-management/
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
[18]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_armv7.tar.gz
[19]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_386.tar.gz
[20]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_amd64.zip
[21]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_arm64.zip
[22]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_armv5.zip
[23]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_armv6.zip
[24]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_armv7.zip
[25]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_386.zip
[26]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_windows_amd64.tar.gz
[27]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_windows_386.tar.gz
[28]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_windows_amd64.zip
[29]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_windows_386.zip
[30]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_darwin_amd64.tar.gz
[31]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_darwin_amd64.zip
[32]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_freebsd_amd64.tar.gz
[33]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_freebsd_amd64.zip
[34]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_freebsd_386.tar.gz
[35]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_freebsd_386.zip
[36]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_solaris_amd64.tar.gz
[37]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_solaris_amd64.zip
[38]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_mips-hardfloat.tar.gz
[39]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_mips-hardfloat.zip
[40]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_mips-softfloat.tar.gz
[41]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_mips-softfloat.zip
[42]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_mipsle-hardfloat.tar.gz
[43]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_mipsle-hardfloat.zip
[44]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_mipsle-softfloat.tar.gz
[45]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_mipsle-softfloat.zip
[46]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_mips64-hardfloat.tar.gz
[47]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_mips64-hardfloat.zip
[48]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_mips64-softfloat.tar.gz
[49]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_mips64-softfloat.zip
[50]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_mips64le-hardfloat.tar.gz
[51]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_mips64le-hardfloat.zip
[52]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_mips64le-softfloat.tar.gz
[53]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_mips64le-softfloat.zip
[54]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_amd64.tar.gz
[55]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_arm64.tar.gz
[56]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_armv5.tar.gz
[57]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.20.2/sensu-go_5.20.2_linux_armv6.tar.gz
