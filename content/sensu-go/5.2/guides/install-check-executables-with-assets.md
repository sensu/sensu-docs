---
title: "How to install plugins using assets"
linkTitle: "Installing Plugins with Assets"
description: "Assets are shareable, reusable packages that make it easy to deploy Sensu plugins.
You can use assets to provide the plugins, libraries, and runtimes you need to power your monitoring workflows."
weight: 40
version: "5.2"
product: "Sensu Go"
platformContent: False
menu: 
  sensu-go-5.2:
    parent: guides
---

Assets are shareable, reusable packages that make it easy to deploy Sensu plugins.
You can use assets to provide the plugins, libraries, and runtimes you need to power your monitoring workflows.
Sensu supports runtime assets for [checks][6], [filters][7], [mutators][8], and [handlers][9].
Discover, download, and share assets using [Bonsai, the Sensu asset index][16].

### 1. Download the asset definition from Bonsai

Bonsai is a central hub for discovering Sensu assets hosted on GitHub.
Assets are available in three tiers: community supported, Sensu Inc. supported, and Sensu Enterprise only.

**ENTERPRISE ONLY**: Enterprise assets require a Sensu Enterprise license. To activate your Sensu Enterprise license, see the [getting started guide].

To use an asset, select the Download button in Bonsai and download the asset definition for your platform and architecture.
Asset definitions tell Sensu how to download and verify the asset when required by a check, filter, mutator, or handler.

For example, here's the asset definition for version 1.0.1 of the [Sensu PagerDuty handler asset][19] for Linux AMD64.

{{< highlight json >}}
{
  "type": "Asset",
  "api_version": "core/v2",
  "metadata": {
    "name": "sensu-pagerduty-handler",
    "namespace": "default",
    "labels": {},
    "annotations": {}
  },
  "spec": {
    "url": "https://github.com/sensu/sensu-pagerduty-handler/releases/download/1.0.1/sensu-pagerduty-handler_1.0.1_linux_amd64.tar.gz",
    "sha512": "5facfb0706e5e36edc5d13993ecc813a4689c5ca502d70670268ca1c0679e9e2af79af75ee4f7a423b48f2e55524f6d81ce81485975eb3b70048cfa58f4af961",
    "filters": [
      "entity.system.os == 'linux'",
      "entity.system.arch == 'amd64'"
    ]
  }
}
{{< /highlight >}}

Once you've downloaded the asset definition, you can register the asset with Sensu using sensuctl.

{{< highlight shell >}}
sensuctl create --file sensu-sensu-pagerduty-handler-1.0.1-linux-amd64.json
{{< /highlight >}}

You can use sensuctl to verify that the asset is registered and ready to use.

{{< highlight shell >}}
sensuctl asset list
{{< /highlight >}}

### 2. Create a Sensu resource that uses the asset

Once you've downloaded the asset definition, create a Sensu resource definition that uses the asset.
Depending on the asset, this could be a check, filter, mutator, or handler.
See the Bonsai asset page for information about asset capabilities and configuration.

For the PagerDuty example, create a `pagerduty` handler that includes a PagerDuty service API key and the `sensu-pagerduty-handler` runtime asset.

{{< highlight json >}}
{
    "api_version": "core/v2",
    "type": "Handler",
    "metadata": {
        "namespace": "default",
        "name": "pagerduty"
    },
    "spec": {
        "type": "pipe",
        "command": "sensu-pagerduty-handler --token SECRET",
        "runtime_assets": ["sensu-pagerduty-handler"],
        "timeout": 10,
        "filters": [
            "is_incident"
        ]
    }
}
{{< /highlight >}}

Save the resource definition to a file, and add to Sensu using sensuctl.

{{< highlight shell >}}
sensuctl create --file filename.json
{{< /highlight >}}

You can use `sensuctl resource-type list` to see your available checks, filters, mutators, and handlers.

{{< highlight shell >}}
sensuctl handler list
{{< /highlight >}}

## Next steps

See the [asset reference](../../reference/assets) more information about creating and sharing assets.

[1]: ../../reference/assets/
[2]: #creating-an-asset
[3]: https://bonsai.sensu.io
[4]: https://bonsai.sensu.io/assets/sensu/sensu-aws
[6]: ../checks
[7]: ../filters
[8]: ../mutators
[9]: ../handlers
[16]: https://bonsai.sensu.io
[17]: ../../getting-started/enterprise
[19]: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler
[20]: https://bonsai.sensu.io/assets/sensu/sensu-email-handler
[21]: https://bonsai.sensu.io/assets/portertech/sensu-servicenow-handler
[22]: https://bonsai.sensu.io/assets/portertech/sensu-jira-handler
[26]: https://bonsai.sensu.io/assets/sensu/sensu-aws
[27]: https://bonsai.sensu.io/assets/sensu/sensu-prometheus-collector