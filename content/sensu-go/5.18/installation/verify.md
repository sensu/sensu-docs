---
title: "Binary-only distributions"
linkTitle: "Binary-Only Distributions"
description: "Sensu offers binary-only distributions for Linux, Windows, macOS, FreeBSD, and Solaris. Read this guide to learn how to download and verify Sensu binaries."
weight: 60
product: "Sensu Go"
version: "5.18"
platformContent: true
platforms: ["Linux", "Windows", "macOS", "FreeBSD", "Solaris"]
menu:
  sensu-go-5.18:
    parent: installation
---

In addition to [packages][1], Sensu binary-only distributions are available for Linux, Windows (agent and CLI only), macOS (CLI only), FreeBSD, and Solaris.

{{< platformBlock "Linux" >}}

## Linux

Sensu binary-only distributions for Linux are available for these architectures and formats:

| arch | format |
| --- | --- |
| `amd64` | [`.tar.gz`][14] \| [`.zip`][20] |
| `arm64` | [`.tar.gz`][15] \| [`.zip`][21]
| `armv5` (agent and CLI) | [`.tar.gz`][16] \| [`.zip`][22] |
| `armv6` (agent and CLI) | [`.tar.gz`][17] \| [`.zip`][23] |
| `armv7` (agent and CLI) | [`.tar.gz`][18] \| [`.zip`][24] |
| `386` | [`.tar.gz`][19] \| [`.zip`][25] |

{{% notice note %}}
**NOTE**: 32-bit systems cannot run the Sensu backend reliably, so `armv5`, `armv6`, and `armv7` packages include the agent and CLI only.
{{% /notice %}}

For example, to download Sensu for Linux `amd64` in `tar.gz` format:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_linux_amd64.tar.gz
{{< /highlight >}}

Generate a SHA-256 checksum for the downloaded artifact:

{{< highlight shell >}}
sha256sum sensu-go_5.18.1_linux_amd64.tar.gz
{{< /highlight >}}

The result should match the checksum for your platform:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_checksums.txt && cat sensu-go_5.18.1_checksums.txt
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}

## Windows

Sensu binary-only distributions for Windows are available for these architectures and formats:

| arch | format |
| --- | --- |
| `amd64` | [`.tar.gz`][26] \| [`.zip`][28]
| `386` | [`.tar.gz`][27] \| [`.zip`][29]

For example, to download Sensu for Windows `amd64` in `zip` format:

{{< highlight text >}}
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_windows_amd64.zip  -OutFile "$env:userprofile\sensu-go_5.18.1_windows_amd64.zip"
{{< /highlight >}}

Generate a SHA-256 checksum for the downloaded artifact:

{{< highlight text >}}
Get-FileHash "$env:userprofile\sensu-go_5.18.1_windows_amd64.zip" -Algorithm SHA256 | Format-List
{{< /highlight >}}

The result should match (with the exception of capitalization) the checksum for your platform:

{{< highlight text >}}
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_checksums.txt -OutFile "$env:userprofile\sensu-go_5.18.1_checksums.txt"

Get-Content "$env:userprofile\sensu-go_5.18.1_checksums.txt" | Select-String -Pattern windows_amd64
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "macOS" >}}

## macOS

Sensu binary-only distributions for macOS are available for these architectures and formats:

| arch | format |
| --- | --- |
| `amd64` | [`.tar.gz`][30] \| [`.zip`][31]

For example, to download Sensu for macOS `amd64` in `tar.gz` format:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_darwin_amd64.tar.gz
{{< /highlight >}}

Generate a SHA-256 checksum for the downloaded artifact:

{{< highlight shell >}}
shasum -a 256 sensu-go_5.18.1_darwin_amd64.tar.gz
{{< /highlight >}}

The result should match the checksum for your platform:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_checksums.txt && cat sensu-go_5.18.1_checksums.txt
{{< /highlight >}}

Extract the archive:

{{< highlight shell >}}
tar -xvf sensu-go_5.18.1_darwin_amd64.tar.gz
{{< /highlight >}}

Copy the executable into your PATH:

{{< highlight shell >}}
sudo cp sensuctl /usr/local/bin/
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "FreeBSD" >}}

## FreeBSD

Sensu binary-only distributions for FreeBSD are available for these architectures and formats:

| arch | format |
| --- | --- |
| `amd64` | [`.tar.gz`][32] \| [`.zip`][33]
| `386` | [`.tar.gz`][34] \| [`.zip`][35]

For example, to download Sensu for FreeBSD `amd64` in `tar.gz` format:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_freebsd_amd64.tar.gz
{{< /highlight >}}

Generate a SHA-256 checksum for the downloaded artifact:

{{< highlight shell >}}
sha256sum sensu-go_5.18.1_freebsd_amd64.tar.gz
{{< /highlight >}}

The result should match the checksum for your platform:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_checksums.txt && cat sensu-go_5.18.1_checksums.txt
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "Solaris" >}}

## Solaris

Sensu binary-only distributions for Solaris are available for these architectures and formats:

| arch | format |
| --- | --- |
| `amd64` | [`.tar.gz`][36] \| [`.zip`][37]

For example, to download Sensu for Solaris `amd64` in `tar.gz` format:

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_solaris_amd64.tar.gz
{{< /highlight >}}

Generate a SHA-256 checksum for the downloaded artifact.

{{< highlight shell >}}
sha256sum sensu-go_5.18.1_solaris_amd64.tar.gz
{{< /highlight >}}

The result should match the checksum for your platform.

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_checksums.txt && cat sensu-go_5.18.1_checksums.txt
{{< /highlight >}}

{{< platformBlockClose >}}

## Next steps

Now that you’ve installed Sensu:

- [Configure sensuctl][4]
- [Start the Sensu backend][2]
- [Start the Sensu agent][3]
- [Use Sensu to monitor server resources][5]

[1]: ../install-sensu/
[2]: ../../reference/backend#operation
[3]: ../../reference/agent#operation
[4]: ../../sensuctl/reference#first-time-setup
[5]: ../../guides/monitor-server-resources/
[14]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_linux_amd64.tar.gz
[15]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_linux_arm64.tar.gz
[16]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_linux_armv5.tar.gz
[17]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_linux_armv6.tar.gz
[18]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_linux_armv7.tar.gz
[19]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_linux_386.tar.gz
[20]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_linux_amd64.zip
[21]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_linux_arm64.zip
[22]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_linux_armv5.zip
[23]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_linux_armv6.zip
[24]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_linux_armv7.zip
[25]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_linux_386.zip
[26]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_windows_amd64.tar.gz
[27]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_windows_386.tar.gz
[28]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_windows_amd64.zip
[29]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_windows_386.zip
[30]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_darwin_amd64.tar.gz
[31]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_darwin_amd64.zip
[32]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_freebsd_amd64.tar.gz
[33]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_freebsd_amd64.zip
[34]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_freebsd_386.tar.gz
[35]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_freebsd_386.zip
[36]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_solaris_amd64.tar.gz
[37]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.18.1/sensu-go_5.18.1_solaris_amd64.zip
