---
title: "Tessen"
description: "Reference documentation for Tessen (Sensu call-home)."
product: "Sensu Core"
version: "1.8"
weight: 18
menu:
  sensu-core-1.8:
    parent: reference
---

## What is Tessen?

Tessen is a hosted Sensu call-home service hosted by Sensu Inc. The Tessen client, included in every sensu-server, is capable of sending anonymized data about the Sensu installation to the Tessen hosted service, on sensu-server startup and every 6 hours thereafter. All data submissions are logged for complete transparency and transmitted over HTTPS. The anonymized data currently includes the flavour of Sensu (Core or Enterprise), the Sensu version, and the Sensu client and server counts.

## Tessen Client Configuration

The Tessen client is disabled default, users can **opt-in** via `sensu-server` configuration:

`/etc/sensu/conf.d/tessen.json`

{{< highlight json >}}
{
  "tessen": {
    "enabled": true
  }
}
{{< /highlight >}}

### Proxy Configuration

The Tessen client supports HTTP proxy configuration.

`/etc/sensu/conf.d/tessen.json`

{{< highlight json >}}
{
  "tessen": {
    "enable": true,
    "proxy": {
      "host": "www.myproxy.com",
      "port": 4430,
      "authorization": ["username", "password"]
    }
  }
}
{{< /highlight >}}
