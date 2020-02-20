---
title: "Install plugins with assets"
linkTitle: "Install Plugins with Assets"
description: "Assets are shareable, reusable packages that make it easier to deploy Sensu plugins. You can use assets to provide the plugins, libraries, and runtimes you need to power your monitoring workflows. Read the guide to get started using assets."
weight: 100
version: "5.18"
product: "Sensu Go"
platformContent: False
menu: 
  sensu-go-5.18:
    parent: guides
---

- [1. Register the Sensu PagerDuty Handler asset](#1-register-the-sensu-pagerduty-handler-asset)
- [2. Adjust the asset definition](#2-adjust-the-asset-definition)
- [3. Create a monitoring workflow](#3-create-a-workflow)
- [Next steps](#next-steps)

Assets are shareable, reusable packages that make it easier to deploy Sensu plugins.
You can use assets to provide the plugins, libraries, and runtimes you need to automate your monitoring workflows.
See the [asset reference][1] for more information about assets.
This guide uses the [Sensu PagerDuty Handler asset][7] as an example.

### 1. Register the Sensu PagerDuty Handler asset

To add the [Sensu PagerDuty Handler asset][7] to Sensu, use [`sensuctl asset add`][6]:

{{< highlight shell >}}
sensuctl asset add sensu/sensu-pagerduty-handler:1.2.0 -r pagerduty-handler
{{< /highlight >}}

This example uses the `-r` (rename) flag to specify a shorter name for the asset: `pagerduty-handler`.

You can also click the Download button on the asset page in [Bonsai][7] to download the asset definition for your Sensu backend platform and architecture.

### 2. Adjust the asset definition

Asset definitions tell Sensu how to download and verify the asset when required by a check, filter, mutator, or handler.

After you add or download the asset definition, open the file and adjust the `namespace` and `filters` for your Sensu instance.
Here's the asset definition for version 1.2.0 of the [Sensu PagerDuty Handler][7] asset for Linux AMD64:

{{< highlight yml >}}
---
type: Asset
api_version: core/v2
metadata:
  name: pagerduty-handler
  namespace: default
  labels: {}
  annotations: {}
spec:
  url: https://assets.bonsai.sensu.io/02fc48fb7cbfd27f36915489af2725034a046772/sensu-pagerduty-handler_1.2.0_linux_amd64.tar.gz
  sha512: 5be236b5b9ccceb10920d3a171ada4ac4f4caaf87f822475cd48bd7f2fab3235fa298f79ef6f97b0eb6498205740bb1af1120ca036fd3381edfebd9fb15aaa99
  filters:
  - entity.system.os == 'linux'
  - entity.system.arch == 'amd64'
{{< /highlight >}}

Filters for _check_ assets should match entity platforms.
Filters for _handler and filter_ assets should match your Sensu backend platform.
If the provided filters are too restrictive for your platform, replace `os` and `arch` with any supported [entity system attributes][4] (for example, `entity.system.platform_family == 'rhel'`).
You may also want to customize the asset `name` to reflect the supported platform (for example, `pagerduty-handler-linux`) and add custom attributes with [`labels` and `annotations`][5].

**Enterprise-tier assets** (like the [ServiceNow][10] and [Jira][11] event handlers) require a Sensu commercial license.
For more information about commercial features and to activate your license, see [Get started with commercial features][12].

Use sensuctl to verify that the asset is registered and ready to use:

{{< highlight shell >}}
sensuctl asset list --format yaml
{{< /highlight >}}

### 3. Create a workflow

With the asset downloaded and registered, you can use it in a monitoring workflow.
Assets may provide executable plugins intended for use with a Sensu check, handler, mutator, or hook, or JavaScript libraries intended to provide functionality for use in event filters.
The details in Bonsai are the best resource for information about each asset's capabilities and configuration.

For example, to use the [Sensu PagerDuty Handler][7] asset, you would create a `pagerduty` handler that includes your PagerDuty service API key in place of `SECRET` and `pagerduty-handler` as a runtime asset:

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
  - pagerduty-handler
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
        "runtime_assets": ["pagerduty-handler"],
        "timeout": 10,
        "filters": [
            "is_incident"
        ]
    }
}
{{< /highlight >}}

{{< /language-toggle >}}

Save the definition to a file (for example, `pagerduty-handler.json`), and add it to Sensu with sensuctl:

{{< highlight shell >}}
sensuctl create --file pagerduty-handler.json
{{< /highlight >}}

Now that Sensu can create incidents in PagerDuty, you can automate this workflow by adding the `pagerduty` handler to your Sensu service check definitions.
See [Monitor server resources][13] to learn more.

### Next steps

Read these resources for more information about using assets in Sensu:

- [Assets reference][1]
- [Asset format specification][14]
- [Share assets on Bonsai][15]

[1]: ../../reference/assets/
[2]: #create-an-asset
[3]: https://bonsai.sensu.io
[4]: ../../reference/entities/#system-attributes
[5]: ../../reference/assets/#metadata-attributes
[6]: ../../sensuctl/reference/#install-asset-definitions
[7]: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler
[10]: https://bonsai.sensu.io/assets/sensu/sensu-servicenow-handler
[11]: https://bonsai.sensu.io/assets/sensu/sensu-jira-handler
[12]: ../../getting-started/enterprise/
[13]: ../monitor-server-resources/
[14]: ../../reference/assets#asset-format-specification
[15]: ../../reference/assets#share-an-asset-on-bonsai
[16]: https://bonsai.sensu.io
