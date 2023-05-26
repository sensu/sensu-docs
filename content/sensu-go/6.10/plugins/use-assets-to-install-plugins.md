---
title: "Use dynamic runtime assets to install plugins"
linkTitle: "Use Assets to Install Plugins"
guide_title: "Use dynamic runtime assets to install plugins"
type: "guide"
description: "Use Sensu's shareable, reusable dynamic runtime assets to deploy the plugins, libraries, and runtimes you need for your monitoring and observability workflows."
weight: 80
version: "6.10"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-6.10:
    parent: plugins
---

Dynamic runtime assets are shareable, reusable packages that make it easier to deploy Sensu plugins.
You can use assets to provide the plugins, libraries, and runtimes you need to automate your monitoring workflows.
Read the [asset reference][1] for more information about dynamic runtime assets.
This guide uses the [sensu/sensu-pagerduty-handler][7] dynamic runtime asset as an example.

{{% notice note %}}
**NOTE**: Dynamic runtime assets are not required to use Sensu Go.
You can install Sensu plugins using the [sensu-install](../install-plugins#install-plugins-with-the-sensu-install-tool) tool or a [configuration management](../../operations/deploy-sensu/configuration-management/) solution.
{{% /notice %}}

## Register an asset

To add the [sensu/sensu-pagerduty-handler][7] dynamic runtime asset to Sensu, use [sensuctl asset add][6]:

{{< code shell >}}
sensuctl asset add sensu/sensu-pagerduty-handler:2.2.0 -r pagerduty-handler
{{< /code >}}

The response should be similar to this example:

{{< code text >}}
fetching bonsai asset: sensu/sensu-pagerduty-handler:2.2.0
added asset: sensu/sensu-pagerduty-handler:2.2.0

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["pagerduty-handler"].
{{< /code >}}

{{% notice note %}}
**NOTE**: Specify the asset version you want to install to maintain the stability of your observability infrastructure.
If you do not specify a version to install, Sensu automatically installs the latest version, which may include breaking changes.
{{% /notice %}}

This example uses the `-r` (rename) flag to specify a shorter name for the asset: `pagerduty-handler`.

You can also open the **Release Assets** tab on asset pages in [Bonsai][3] to download the asset definition for your Sensu backend platform and architecture.

{{% notice note %}}
**NOTE**: Sensu does not download and install asset builds onto the system until they are needed for command execution.
Read the [asset reference](../assets#dynamic-runtime-asset-builds) for more information about asset builds.
{{% /notice %}}

If you are using a Sensu [package][9], the asset is installed at `/var/cache`.
If you are using a Sensu [Docker image][17], the asset is installed at `/var/lib`.

## Adjust the asset definition

Asset definitions tell Sensu how to download and verify the asset when required by a check, filter, mutator, or handler.

After you add or download the asset definition, open the file and adjust the `namespace` and `filters` for your Sensu instance.
Here's the asset definition for version 2.2.0 of the [sensu/sensu-pagerduty-handler][7] asset for Linux AMD64:

{{< language-toggle >}}

{{< code yml >}}
---
type: Asset
api_version: core/v2
metadata:
  annotations:
    io.sensu.bonsai.api_url: https://bonsai.sensu.io/api/v1/assets/sensu/sensu-pagerduty-handler
    io.sensu.bonsai.name: sensu-pagerduty-handler
    io.sensu.bonsai.namespace: sensu
    io.sensu.bonsai.tags: handler
    io.sensu.bonsai.tier: Supported
    io.sensu.bonsai.url: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler
    io.sensu.bonsai.version: 2.2.0
  name: pagerduty-handler
spec:
  builds:
  - filters:
    - entity.system.os == 'linux'
    - entity.system.arch == 'amd64'
    headers: null
    sha512: adc6ee846b88a792cc0f384a942f8b7ff727c7d7cf6a3012a0bf97ae4bef770503f9d5c26f756047559c145ac01c62d4db9af8574d0cc451a176f1be29f52ffc
    url: https://assets.bonsai.sensu.io/87f00332d6f36f59ee188e9e2a94a2b84172d134/sensu-pagerduty-handler_2.2.0_linux_amd64.tar.gz
{{< /code >}}

{{< code json >}}
{
  "type": "Asset",
  "api_version": "core/v2",
  "metadata": {
    "annotations": {
      "io.sensu.bonsai.api_url": "https://bonsai.sensu.io/api/v1/assets/sensu/sensu-pagerduty-handler",
      "io.sensu.bonsai.name": "sensu-pagerduty-handler",
      "io.sensu.bonsai.namespace": "sensu",
      "io.sensu.bonsai.tags": "handler",
      "io.sensu.bonsai.tier": "Supported",
      "io.sensu.bonsai.url": "https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler",
      "io.sensu.bonsai.version": "2.2.0"
    },
    "name": "pagerduty-handler"
  },
  "spec": {
    "builds": [
      {
        "filters": [
          "entity.system.os == 'linux'",
          "entity.system.arch == 'amd64'"
        ],
        "headers": null,
        "sha512": "adc6ee846b88a792cc0f384a942f8b7ff727c7d7cf6a3012a0bf97ae4bef770503f9d5c26f756047559c145ac01c62d4db9af8574d0cc451a176f1be29f52ffc",
        "url": "https://assets.bonsai.sensu.io/87f00332d6f36f59ee188e9e2a94a2b84172d134/sensu-pagerduty-handler_2.2.0_linux_amd64.tar.gz"
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

Filters for _check_ dynamic runtime assets should match entity platforms.
Filters for _handler and filter_ dynamic runtime assets should match your Sensu backend platform.
If the provided filters are too restrictive for your platform, replace `os` and `arch` with any supported [entity system attributes][4] (for example, `entity.system.platform_family == 'rhel'`).
You may also want to customize the asset `name` to reflect the supported platform (for example, `pagerduty-handler-linux`) and add custom attributes with [`labels` and `annotations`][5].

**Enterprise-tier dynamic runtime assets** (like the [ServiceNow][10] and [Jira][11] event handlers) require a Sensu commercial license.
For more information about commercial features and to activate your license, read [Get started with commercial features][12].

Use sensuctl to verify that the asset is registered and ready to use:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl asset list --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl asset list --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

## Create a workflow

With the asset downloaded and registered, you can use it in a monitoring workflow.
Dynamic runtime assets may provide executable plugins intended for use with a Sensu check, handler, mutator, or hook, or JavaScript libraries intended to provide functionality for use in event filters.
The details in Bonsai are the best resource for information about each asset's capabilities and configuration.

For example, to use the [Sensu PagerDuty Handler][7] asset, you would create a `pagerduty` handler that includes your PagerDuty service API key in place of `SECRET` and `pagerduty-handler` as a runtime asset:

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  name: pagerduty
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
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "pagerduty"
  },
  "spec": {
    "type": "pipe",
    "command": "sensu-pagerduty-handler",
    "env_vars": [
      "PAGERDUTY_TOKEN=SECRET"
    ],
    "runtime_assets": [
      "pagerduty-handler"
    ],
    "timeout": 10,
    "filters": [
      "is_incident"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

Save the definition to a file (for example, `pagerduty-handler.yml` or `pagerduty-handler.json`), and add it to Sensu with sensuctl:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl create --file pagerduty-handler.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl create --file pagerduty-handler.json
{{< /code >}}

{{< /language-toggle >}}

Now that Sensu can create incidents in PagerDuty, you can automate this workflow by adding the `pagerduty` handler to your Sensu service check definitions.
Read [Monitor server resources][13] to learn more.

## Next steps

Read these resources for more information about using dynamic runtime assets in Sensu:

- [Assets reference][1]
- [Asset format specification][14]
- [Share assets on Bonsai][15]

Follow [Send PagerDuty alerts with Sensu][8] to configure a check that generates status events and a handler that sends Sensu alerts to PagerDuty for non-OK events.


[1]: ../assets/
[2]: #create-an-asset
[3]: https://bonsai.sensu.io
[4]: ../../observability-pipeline/observe-entities/entities/#system-attributes
[5]: ../assets#metadata-attributes
[6]: ../../sensuctl/sensuctl-bonsai/#install-dynamic-runtime-asset-definitions
[7]: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler
[8]: ../../observability-pipeline/observe-process/send-pagerduty-alerts/
[9]: ../../platforms/#supported-packages
[10]: https://bonsai.sensu.io/assets/sensu/sensu-servicenow-handler
[11]: https://bonsai.sensu.io/assets/sensu/sensu-jira-handler
[12]: ../../commercial/
[13]: ../../observability-pipeline/observe-schedule/monitor-server-resources/
[14]: ../assets#dynamic-runtime-asset-format-specification
[15]: ../assets#share-an-asset-on-bonsai
[16]: https://bonsai.sensu.io
[17]: ../../platforms/#docker-images
