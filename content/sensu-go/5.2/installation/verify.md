---
title: "Verifying Sensu downloads"
linkTitle: "Verify Sensu Downloads"
description: "How to verify Sensu downloads using checksums"
weight: 16
product: "Sensu Go"
version: "5.2"
platformContent: true
platforms: ["Windows", "macOS", "Linux"]
menu:
  sensu-go-5.2:
    parent: installation
---

Sensu binaries are available for download for Linux, Windows, and macOS.
See the [installation guide][1] for more information.

You can verify a Sensu download using SHA-512 checksums.

{{< platformBlock "Linux" >}}

### Linux

Download Sensu for Linux.

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.2.1/sensu-enterprise-go_5.2.1_linux_amd64.tar.gz
{{< /highlight >}}

Generate a SHA-512 checksum for the downloaded artifact.

{{< highlight shell >}}
sha512sum sensu-enterprise-go_5.2.1_linux_amd64.tar.gz
{{< /highlight >}}

The result should match the checksum for your platform.

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.2.1/sensu-enterprise-go_5.2.1_checksums.txt && cat sensu-enterprise-go_5.2.1_checksums.txt
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "Windows" >}}

### Windows

Download Sensu for Windows.

{{< highlight text >}}
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.2.1/sensu-go-5.2.1-windows-amd64.tar.gz  -OutFile C:\Users\Administrator\sensu-go-5.2.1-windows-amd64.tar.gz
{{< /highlight >}}

Generate a SHA-512 checksum for the downloaded artifact.

{{< highlight text >}}
Get-FileHash C:\Users\Administrator\sensu-go-5.2.1-windows-amd64.tar.gz -Algorithm SHA512 | Format-List
{{< /highlight >}}

The result should match (with the exception of capitalization) the checksum for your platform.

{{< highlight text >}}
Invoke-WebRequest https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.2.1/sensu-enterprise-go_5.2.1_checksums.txt -OutFile C:\Users\Administrator\sensu-enterprise-go_5.2.1_checksums.txt

Get-Content C:\Users\Administrator\sensu-enterprise-go_5.2.1_checksums.txt
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "macOS" >}}

### macOS

Download Sensu for macOS.

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.2.1/sensu-go-5.2.1-darwin-amd64.tar.gz
{{< /highlight >}}

Generate a SHA-512 checksum for the downloaded artifact.

{{< highlight shell >}}
shasum -a 512 sensu-go-5.2.1-darwin-amd64.tar.gz
{{< /highlight >}}

The result should match the checksum for your platform.

{{< highlight shell >}}
curl -LO https://s3-us-west-2.amazonaws.com/sensu.io/sensu-go/5.2.1/sensu-enterprise-go_5.2.1_checksums.txt && cat sensu-enterprise-go_5.2.1_checksums.txt
{{< /highlight >}}

{{< platformBlockClose >}}

[1]: ../install-sensu
