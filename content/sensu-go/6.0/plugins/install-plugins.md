---
title: "Install Sensu plugins"
linkTitle: "Install Plugins"
description: "Sensu plugins provide executables for performing status or metric checks, mutators for changing data to a desired format, and handlers for performing an action on a Sensu event. Read this plugin installation guide to learn how to install plugins with dynamic runtime assets and use Sensu Community plugins with Sensu Go."
weight: 20
version: "6.0"
product: "Sensu Go"
platformContent: true
platforms: ["Ubuntu/Debian", "RHEL/CentOS"]
menu:
  sensu-go-6.0:
    parent: plugins
---

Extend Sensu's functionality with [plugins][13], which provide executables for performing status or metric checks, mutators for changing data to a desired format, and handlers for performing an action on a Sensu event.

## Install plugins with dynamic runtime assets

Dynamic runtime assets are shareable, reusable packages that make it easier to deploy Sensu plugins.
You can use assets to provide the plugins, libraries, and runtimes you need to automate your monitoring workflows.

See the [asset reference][1] for more information about dynamic runtime assets.
This section uses the [Sensu PagerDuty Handler dynamic runtime asset][5] as an example.

### Register the Sensu PagerDuty Handler asset

To add the [Sensu PagerDuty Handler dynamic runtime asset][5] to Sensu, use [`sensuctl asset add`][4]:

{{< code shell >}}
sensuctl asset add sensu/sensu-pagerduty-handler:1.2.0 -r pagerduty-handler
fetching bonsai asset: sensu/sensu-pagerduty-handler:1.2.0
added asset: sensu/sensu-pagerduty-handler:1.2.0

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["pagerduty-handler"].
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the asset: `pagerduty-handler`.

You can also click the Download button on the asset page in [Bonsai][5] to download the asset definition for your Sensu backend platform and architecture.

{{% notice note %}}
**NOTE**: Sensu does not download and install asset builds onto the system until they are needed for command execution.
Read [the asset reference](../assets#dynamic-runtime-asset-builds) for more information about asset builds.
{{% /notice %}}

### Adjust the asset definition

Asset definitions tell Sensu how to download and verify the asset when required by a check, filter, mutator, or handler.

After you add or download the asset definition, open the file and adjust the `namespace` and `filters` for your Sensu instance.
Here's the asset definition for version 1.2.0 of the [Sensu PagerDuty Handler][5] asset for Linux AMD64:

{{< code yml >}}
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
{{< /code >}}

Filters for _check_ dynamic runtime assets should match entity platforms.
Filters for _handler and filter_ dynamic runtime assets should match your Sensu backend platform.
If the provided filters are too restrictive for your platform, replace `os` and `arch` with any supported [entity system attributes][2] (for example, `entity.system.platform_family == 'rhel'`).
You may also want to customize the asset `name` to reflect the supported platform (for example, `pagerduty-handler-linux`) and add custom attributes with [`labels` and `annotations`][3].

**Enterprise-tier dynamic runtime assets** (like the [ServiceNow][7] and [Jira][8] event handlers) require a Sensu commercial license.
For more information about commercial features and to activate your license, see [Get started with commercial features][9].

Use sensuctl to verify that the asset is registered and ready to use:

{{< code shell >}}
sensuctl asset list --format yaml
{{< /code >}}

### Create a workflow

With the asset downloaded and registered, you can use it in a monitoring workflow.
Dynamic runtime assets may provide executable plugins intended for use with a Sensu check, handler, mutator, or hook, or JavaScript libraries intended to provide functionality for use in event filters.
The details in Bonsai are the best resource for information about each asset's capabilities and configuration.

For example, to use the [Sensu PagerDuty Handler][5] asset, you would create a `pagerduty` handler that includes your PagerDuty service API key in place of `SECRET` and `pagerduty-handler` as a runtime asset:

{{< language-toggle >}}

{{< code yml >}}
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
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

Save the definition to a file (for example, `pagerduty-handler.json`), and add it to Sensu with sensuctl:

{{< code shell >}}
sensuctl create --file pagerduty-handler.json
{{< /code >}}

Now that Sensu can create incidents in PagerDuty, you can automate this workflow by adding the `pagerduty` handler to your Sensu service check definitions.
See [Monitor server resources][10] to learn more.

## Use Bonsai, the Sensu asset index

[Bonsai, the Sensu asset index][18], is a centralized place for downloading and sharing dynamic runtime assets.
Make Bonsai your first stop when you need to find an asset.
Bonsai includes plugins, libraries, and runtimes you need to automate your monitoring workflows.
You can also [share your asset on Bonsai][19].

## Install plugins with the sensu-install tool

To use community plugins that are not yet compatible with Sensu Go, use the `sensu-install` tool.

If you've used previous versions of Sensu, you're probably familiar with the [Sensu Community Plugins][1] organization on GitHub.
Although some of these plugins are enabled for Sensu Go, some do not include the components necessary to work with Sensu Go.
Read each plugin's instructions for information about whether it is compatibile with Sensu Go. 

{{% notice note %}}
**NOTE**: Plugins in the Sensu Plugins GitHub organization are community-maintained: anyone can improve on them.
To get started with adding to a plugin or sharing your own, head to the [Sensu Community Slack channel](https://slack.sensu.io/).
Maintainers are always happy to help answer questions and point you in the right direction.
{{% /notice %}}

The `sensu-install` tool comes with an embedded version of Ruby, so you don't need to have Ruby installed on your system. 

To install a [Sensu Community plugin][14] with Sensu Go:

1. Install the [sensu-plugins-ruby package][15] from packagecloud.

2. Run the `sensu-install` command to install plugins in the [Sensu Community Plugins GitHub organization][14] by repository name.
Plugins are installed into `/opt/sensu-plugins-ruby/embedded/bin`.

{{< code shell >}}
sensu-install --help
Usage: sensu-install [options]
    -h, --help                       Display this message
    -v, --verbose                    Enable verbose logging
    -p, --plugin PLUGIN              Install a Sensu PLUGIN
    -P, --plugins PLUGIN[,PLUGIN]    PLUGIN or comma-delimited list of Sensu plugins to install
    -e, --extension EXTENSION        Install a Sensu EXTENSION
    -E, --extensions EXTENSION[,EXT] EXTENSION or comma-delimited list of Sensu extensions to install
    -s, --source SOURCE              Install Sensu plugins and extensions from a custom SOURCE
    -c, --clean                      Clean up (remove) other installed versions of the plugin(s) and/or extension(s)
    -x, --proxy PROXY                Install Sensu plugins and extensions via a PROXY URL
{{< /code >}}

For example, to install the [Sensu InfluxDB plugin][16]:

{{< code shell >}}
sudo sensu-install -p influxdb
{{< /code >}}

To install a specific version of the Sensu InfluxDB plugin with `sensu-install`, run:

{{< code shell >}}
sudo sensu-install -p 'sensu-plugins-influxdb:2.0.0'
{{< /code >}}

We recommend using a configuration management tool or using [Sensu dynamic runtime assets][1] to pin the versions of any plugins installed in production.

{{% notice note %}}
**NOTE**: If a plugin is not Sensu Go-enabled and there is no analogue on Bonsai, you can add the necessary functionality to make the plugin compatible with Sensu Go.
Follow [this discourse.sensu.io guide](https://discourse.sensu.io/t/contributing-assets-for-existing-ruby-sensu-plugins/1165) to walk through the process.
{{% /notice %}}

### Troubleshoot the sensu-install tool

Some plugins require additional tools to install them successfully.
An example is the [Sensu disk checks plugin][17].
Depending on the plugin, you may need to install developer tool packages.

{{< platformBlock "Ubuntu/Debian" >}}

**Ubuntu/Debian**:

{{< code shell >}}
sudo apt-get update
{{< /code >}}

{{< code shell >}}
sudo apt-get install build-essential
{{< /code >}}

{{< platformBlockClose >}}

{{< platformBlock "RHEL/CentOS" >}}

**RHEL/CentOS**:

{{< code shell >}}
sudo yum update
{{< /code >}}

{{< code shell >}}
sudo yum groupinstall "Development Tools"
{{< /code >}}

{{< platformBlockClose >}}

## Next steps

Read these resources for more information about using dynamic runtime assets in Sensu:

- [Assets reference][1]
- [Asset format specification][11]
- [Share assets on Bonsai][12]

You can also try our interactive tutorial to [send critical alerts to your PagerDuty account][6].

[1]: ../assets/
[2]: ../../../observability-pipeline/observe-entities/entities/#system-attributes
[3]: ../assets/#metadata-attributes
[4]: ../../../sensuctl/sensuctl-bonsai/#install-dynamic-runtime-asset-definitions
[5]: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler
[6]: ../../../learn/sensu-pagerduty/
[7]: https://bonsai.sensu.io/assets/sensu/sensu-servicenow-handler
[8]: https://bonsai.sensu.io/assets/sensu/sensu-jira-handler
[9]: ../../../commercial/
[10]: ../../../observability-pipeline/observe-schedule/monitor-server-resources/
[11]: ../assets#dynamic-runtime-asset-format-specification
[12]: ../assets#share-an-asset-on-bonsai
[13]: ../
[14]: https://github.com/sensu-plugins/
[15]: https://packagecloud.io/sensu/community/
[16]: https://github.com/sensu-plugins/sensu-plugins-influxdb/
[17]: https://github.com/sensu-plugins/sensu-plugins-disk-checks/
[18]: https://bonsai.sensu.io/
[19]: ../assets#share-an-asset-on-bonsai
