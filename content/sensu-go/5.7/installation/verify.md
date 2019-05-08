---
title: "Binary-only distributions"
linkTitle: "Binary-Only Distributions"
description: "Sensu offers binary-only distributions for Linux, Windows, and macOS. Read the guide to learn how to download and verify Sensu binaries."
weight: 16
product: "Sensu Go"
version: "5.7"
platformContent: true
platforms: ["Windows", "macOS", "Linux"]
menu:
  sensu-go-5.7:
    parent: installation
---

In addition to [packages][1], Sensu binary-only distributions are available for Linux, Windows (agent and CLI only), and macOS (CLI only).

{{< platformBlock "Linux" >}}

### Linux

Download Sensu for Linux [`amd64`][14], [`arm64`][15], [`armv5`][16], [`armv6`][17], [`armv7`][18], or [`386`][19] architectures.

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.7.0/sensu-enterprise-go_5.7.0_linux_amd64.tar.gz
{{< /highlight >}}

Generate a SHA-512 checksum for the downloaded artifact.

{{< highlight shell >}}
sha512sum sensu-enterprise-go_5.7.0_linux_amd64.tar.gz
{{< /highlight >}}

The result should match the checksum for your platform.

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.7.0/sensu-enterprise-go_5.7.0_checksums.txt && cat sensu-enterprise-go_5.7.0_checksums.txt
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}

### Windows

Download the Sensu agent from Windows [`amd64`](https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.7.0/sensu-enterprise-go_5.7.0_windows_amd64.tar.gz) or [`386`](https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.7.0/sensu-enterprise-go_5.7.0_windows_386.tar.gz) architectures.

{{< highlight text >}}
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.7.0/sensu-enterprise-go_5.7.0_windows_amd64.tar.gz  -OutFile "$env:userprofile\sensu-enterprise-go_5.7.0_windows_amd64.tar.gz"
{{< /highlight >}}

Generate a SHA-256 checksum for the downloaded artifact.

{{< highlight text >}}
Get-FileHash "$env:userprofile\sensu-enterprise-go_5.7.0_windows_amd64.tar.gz" -Algorithm SHA256 | Format-List
{{< /highlight >}}

The result should match (with the exception of capitalization) the checksum for your platform.

{{< highlight text >}}
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.7.0/sensu-enterprise-go_5.7.0_checksums.txt -OutFile "$env:userprofile\sensu-enterprise-go_5.7.0_checksums.txt"

Get-Content "$env:userprofile\sensu-enterprise-go_5.7.0_checksums.txt" | Select-String -Pattern windows_amd64
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "macOS" >}}

### macOS

Download Sensu for macOS.

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.7.0/sensu-enterprise-go_5.7.0_darwin_amd64.tar.gz
{{< /highlight >}}

Generate a SHA-512 checksum for the downloaded artifact.

{{< highlight shell >}}
shasum -a 512 sensu-go-5.7.0-darwin-amd64.tar.gz
{{< /highlight >}}

The result should match the checksum for your platform.

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.7.0/sensu-enterprise-go_5.7.0_checksums.txt && cat sensu-enterprise-go_5.7.0_checksums.txt
{{< /highlight >}}

Extract the archive.

{{< highlight shell >}}
tar -xvf sensu-enterprise-go_5.7.0_darwin_amd64.tar.gz
{{< /highlight >}}

Copy the executable into your PATH.

{{< highlight shell >}}
sudo cp sensuctl /usr/local/bin/
{{< /highlight >}}

{{< platformBlockClose >}}

### Next steps

Now that you’ve installed Sensu:

- [Starting the Sensu backend][2]
- [Starting the Sensu agent][3]
- [sensuctl first-time setup][4]
- [Monitoring server resources][5]

[2]: ../../reference/backend#operation
[3]: ../../reference/agent#operation
[4]: ../../sensuctl/reference#first-time-setup
[5]: ../../guides/monitor-server-resources

[1]: ../install-sensu
[14]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.7.0/sensu-enterprise-go_5.7.0_linux_amd64.tar.gz
[15]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.7.0/sensu-enterprise-go_5.7.0_linux_arm64.tar.gz
[16]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.7.0/sensu-enterprise-go_5.7.0_linux_armv5.tar.gz
[17]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.7.0/sensu-enterprise-go_5.7.0_linux_armv6.tar.gz
[18]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.7.0/sensu-enterprise-go_5.7.0_linux_armv7.tar.gz
[19]: https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.7.0/sensu-enterprise-go_5.7.0_linux_386.tar.gz
