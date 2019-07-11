---
title: "How to install plugins using assets"
linkTitle: "Installing Plugins with Assets"
description: "Assets are shareable, reusable packages that make it easy to deploy Sensu plugins. You can use assets to provide the plugins, libraries, and runtimes you need to power your monitoring workflows. Read the guide to get started using assets."
weight: 40
version: "5.8"
product: "Sensu Go"
platformContent: False
menu: 
  sensu-go-5.8:
    parent: guides
---

- [1. Download an asset definition from Bonsai](#1-download-an-asset-definition-from-bonsai)
- [2. Register the asset with Sensu](#2-register-the-asset-with-sensu)
- [3. Create a monitoring workflow](#3-create-a-workflow)
- [Next steps](#next-steps)

Assets are shareable, reusable packages that make it easy to deploy Sensu plugins.
You can use assets to provide the plugins, libraries, and runtimes you need to automate your monitoring workflows.
See the [asset reference](../../reference/assets) for more information about assets.

### 1. Download an asset definition from Bonsai

You can discover, download, and share assets using [Bonsai, the Sensu asset index][16].
To use an asset, select the Download button on the asset page in Bonsai to download the asset definition for your Sensu backend platform and architecture.
Asset definitions tell Sensu how to download and verify the asset when required by a check, filter, mutator, or handler.

For example, here's the asset definition for version 1.1.0 of the [Sensu PagerDuty handler asset][19] for Linux AMD64.

{{< highlight yml >}}
---
type: Asset
api_version: core/v2
metadata:
  name: sensu-pagerduty-handler
  namespace: default
  labels: {}
  annotations: {}
spec:
  url: https://assets.bonsai.sensu.io/698710262d59c72ace3e31524960630dc1e4f190/sensu-pagerduty-handler_1.1.0_linux_amd64.tar.gz
  sha512: e93ec4465af5a2057664e8c3cd68e9352457b81315b97578eaae5e21f0cf7419d4fc36feb0155eeb0dd5a227e267307a58ee58a9f3e85bf3d44da3738bf691ca
  filters:
  - entity.system.os == 'linux'
  - entity.system.arch == 'amd64'
{{< /highlight >}}

After downloading an asset definition, open the file and adjust the `namespace` and `filters` for your Sensu instance.
Filters for _check_ assets should match entity platforms, while filters for _handler and filter_ assets should match your Sensu backend platform.
If the provided filters are too restrictive for your platform, replace `os` and `arch` with any supported [entity system attributes][4] (for example: `entity.system.platform_family == 'rhel'`).
You may also want to customize the asset `name` to reflect the supported platform (for example: `sensu-pagerduty-handler-linux`) and add custom attributes using [`labels` and `annotations`][5].

**Enterprise-tier assets** (like the [ServiceNow](https://bonsai.sensu.io/assets/sensu/sensu-servicenow-handler) and [Jira](https://bonsai.sensu.io/assets/sensu/sensu-jira-handler) event handlers) require a Sensu license. For more information about licensed-tier features and to activate your license, see the [getting started guide](../../getting-started/enterprise).

### 2. Register the asset with Sensu

Once you've downloaded the asset definition, you can register the asset with Sensu using sensuctl.

{{< highlight shell >}}
sensuctl create --file sensu-sensu-pagerduty-handler-1.1.0-linux-amd64.yml
{{< /highlight >}}

You can use sensuctl to verify that the asset is registered and ready to use.

{{< highlight shell >}}
sensuctl asset list
{{< /highlight >}}

### 3. Create a workflow

Now we can use assets in a monitoring workflow.
Depending on the asset, you may want to create Sensu checks, filters, mutators, and handlers.
The asset details in Bonsai are the best resource for information about asset capabilities and configuration.

For example, to use the [Sensu PagerDuty handler asset][19], create a `pagerduty` handler that includes your PagerDuty service API key in place of `SECRET` and `sensu-pagerduty-handler` as a runtime asset.

{{< language-toggle >}}

{{< highlight yml >}}
type: Handler
api_version: core/v2
metadata:
  name: pagerduty
  namespace: default
spec:
  command: sensu-pagerduty-handler
  env_vars:
  - PAGERDUTY_TOKEN=SECRET
  filters:
  - is_incident
  runtime_assets:
  - sensu-pagerduty-handler
  timeout: 10
  type: pipe
{{< /highlight >}}

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
        "command": "sensu-pagerduty-handler",
        "env_vars": [
          "PAGERDUTY_TOKEN=SECRET"
        ],
        "runtime_assets": ["sensu-pagerduty-handler"],
        "timeout": 10,
        "filters": [
            "is_incident"
        ]
    }
}
{{< /highlight >}}

{{< /language-toggle >}}

Save the definition to a file (for example: `pagerduty-handler.json`), and add to Sensu using sensuctl.

{{< highlight shell >}}
sensuctl create --file pagerduty-handler.json
{{< /highlight >}}

Now that Sensu can create incidents in PagerDuty, we can automate this workflow by adding the `pagerduty` handler to our Sensu service checks.
To get started with checks, see the [guide to monitoring server resources](../monitor-server-resources).

### Next steps

- [Learn more about assets](../../reference/assets#how-do-assets-work)
- [Read the asset specification](../../reference/assets#asset-format-specification)
- [Share your assets on Bonsai](../../reference/assets#sharing-an-asset-on-bonsai)

[1]: ../../reference/assets/
[2]: #creating-an-asset
[3]: https://bonsai.sensu.io
[4]: ../../reference/entities/#system-attributes
[5]: ../../reference/assets/#metadata-attributes
[6]: ../checks
[7]: ../filters
[8]: ../mutators
[9]: ../handlers
[16]: https://bonsai.sensu.io
[17]: ../../getting-started/enterprise
[19]: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler
