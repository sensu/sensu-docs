---
title: "Install Sensu plugins"
linkTitle: "Install Plugins"
description: "SLearn how to install plugins to extend Sensu's functionality with executables for performing checks, mutators, and handlers."
weight: 100
version: "5.21"
product: "Sensu Go"
platformContent: true
platforms: ["Ubuntu/Debian", "RHEL/CentOS"]
menu:
  sensu-go-5.21:
    parent: deploy-sensu
---

Extend Sensu's functionality with [plugins][10], which provide executables for performing status or metric checks, mutators for changing data to a desired format, and handlers for performing an action on a Sensu event.

## Install plugins with assets

Assets are shareable, reusable packages that make it easier to deploy Sensu plugins.
To start using and deploying assets, read [Install plugins with assets][7] to become familiar with workflows that involve assets.

{{% notice note %}}
**NOTE**: Assets are not required to use Sensu Go.
You can install Sensu plugins using the [sensu-install](../install-plugins/#install-plugins-with-the-sensu-install-tool) tool or a [configuration management](../configuration-management/) solution.
{{% /notice %}}

## Use Bonsai, the Sensu asset hub

[Bonsai, the Sensu asset hub][8], is a centralized place for downloading and sharing plugin assets.
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

## Troubleshoot the sensu-install tool

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
