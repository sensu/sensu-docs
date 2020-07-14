---
title: "Install Sensu plugins"
linkTitle: "Install Plugins"
description: "Sensu plugins provide executables for performing status or metric checks, mutators for changing data to a desired format, and handlers for performing an action on a Sensu event. Read this plugin installation guide to learn how to install plugins with assets and use Sensu Community plugins with Sensu Go."
weight: 10
version: "5.21"
product: "Sensu Go"
platformContent: true
platforms: ["Ubuntu/Debian", "RHEL/CentOS"]
menu:
  sensu-go-5.21:
    parent: plugins
---

Extend Sensu's functionality with [plugins][10], which provide executables for performing status or metric checks, mutators for changing data to a desired format, and handlers for performing an action on a Sensu event.

You can install plugins with assets, via Bonsai, or with the `sensu-install` command.

## Install plugins with assets

Assets are shareable, reusable packages that make it easier to deploy Sensu plugins.
This guide uses the [Sensu PagerDuty Handler asset][7] as an example to help you use and deploy plugins with assets.

### Register the Sensu PagerDuty Handler asset

To add the [Sensu PagerDuty Handler asset][7] to Sensu, use [`sensuctl asset add`][6]:

{{< code shell >}}
sensuctl asset add sensu/sensu-pagerduty-handler:1.2.0 -r pagerduty-handler
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the asset: `pagerduty-handler`.

You can also click the Download button on the asset page in [Bonsai][7] to download the asset definition for your Sensu backend platform and architecture.

{{% notice note %}}
**NOTE**: Sensu does not download and install asset builds onto the system until they are needed for command execution.
Read [the asset reference](../../reference/assets#asset-builds) for more information about asset builds.
{{% /notice %}}

### Adjust the asset definition

Asset definitions tell Sensu how to download and verify the asset when required by a check, filter, mutator, or handler.

After you add or download the asset definition, open the file and adjust the `namespace` and `filters` for your Sensu instance.
Here's the asset definition for version 1.2.0 of the [Sensu PagerDuty Handler][7] asset for Linux AMD64:

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

Filters for _check_ assets should match entity platforms.
Filters for _handler and filter_ assets should match your Sensu backend platform.
If the provided filters are too restrictive for your platform, replace `os` and `arch` with any supported [entity system attributes][4] (for example, `entity.system.platform_family == 'rhel'`).
You may also want to customize the asset `name` to reflect the supported platform (for example, `pagerduty-handler-linux`) and add custom attributes with [`labels` and `annotations`][5].

**Enterprise-tier assets** (like the [ServiceNow][10] and [Jira][11] event handlers) require a Sensu commercial license.
For more information about commercial features and to activate your license, see [Get started with commercial features][12].

Use sensuctl to verify that the asset is registered and ready to use:

{{< code shell >}}
sensuctl asset list --format yaml
{{< /code >}}

### Create a workflow

With the asset downloaded and registered, you can use it in a monitoring workflow.
Assets may provide executable plugins intended for use with a Sensu check, handler, mutator, or hook, or JavaScript libraries intended to provide functionality for use in event filters.
The details in Bonsai are the best resource for information about each asset's capabilities and configuration.

For example, to use the [Sensu PagerDuty Handler][7] asset, you would create a `pagerduty` handler that includes your PagerDuty service API key in place of `SECRET` and `pagerduty-handler` as a runtime asset:

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
See [Monitor server resources][13] to learn more.

## Install plugins via Bonsai, the Sensu asset index

[Bonsai, the Sensu asset index][8], is a centralized place for downloading and sharing plugin assets.
Make Bonsai your first stop when you need to find an asset.
Bonsai includes plugins, libraries, and runtimes you need to automate your monitoring workflows.
You can also [share your asset on Bonsai][9].

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

To install a [Sensu Community plugin][1] with Sensu Go:

1. Install the [sensu-plugins-ruby package][2] from packagecloud.

2. Run the `sensu-install` command to install plugins in the [Sensu Community Plugins GitHub organization][1] by repository name.
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

For example, to install the [Sensu InfluxDB plugin][6]:

{{< code shell >}}
sudo sensu-install -p influxdb
{{< /code >}}

To install a specific version of the Sensu InfluxDB plugin with `sensu-install`, run:

{{< code shell >}}
sudo sensu-install -p 'sensu-plugins-influxdb:2.0.0'
{{< /code >}}

We recommend using a configuration management tool or using [Sensu assets][5] to pin the versions of any plugins installed in production.

{{% notice note %}}
**NOTE**: If a plugin is not Sensu Go-enabled and there is no analogue on Bonsai, you can add the necessary functionality to make the plugin compatible with Sensu Go.
Follow [this discourse.sensu.io guide](https://discourse.sensu.io/t/contributing-assets-for-existing-ruby-sensu-plugins/1165) to walk through the process.
{{% /notice %}}

## Troubleshoot plugins installation

Some plugins require additional tools to install them successfully.
An example is the [Sensu disk checks plugin][3].
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

[1]: https://github.com/sensu-plugins/
[2]: https://packagecloud.io/sensu/community/
[3]: https://github.com/sensu-plugins/sensu-plugins-disk-checks/
[5]: ../../../reference/assets/
[6]: https://github.com/sensu-plugins/sensu-plugins-influxdb/
[7]: ../../../guides/install-check-executables-with-assets/
[8]: https://bonsai.sensu.io/
[9]: ../../../reference/assets#share-an-asset-on-bonsai
[10]: /plugins/latest/reference/
