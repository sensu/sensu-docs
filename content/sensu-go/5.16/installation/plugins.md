---
title: "Install Sensu plugins"
linkTitle: "Install Plugins"
description: "Sensu plugins provide executables for performing status or metric checks, mutators for changing data to a desired format, and handlers for performing an action on a Sensu event. Read this plugin installation guide to learn how to install plugins with assets and use Sensu Community plugins with Sensu Go."
weight: 20
version: "5.16"
product: "Sensu Go"
platformContent: true
platforms: ["Ubuntu/Debian", "RHEL/CentOS"]
menu:
  sensu-go-5.16:
    parent: installation
---

- [Install plugins with assets](#install-plugins-with-assets)
- [Use Bonsai, the Sensu asset index](#use-bonsai-the-sensu-asset-index)
- [Install plugins with the sensu-install tool](#install-plugins-with-the-sensu-install-tool)
- [Troubleshoot the sensu-install tool](#troubleshoot-the-sensu-install-tool)

Extend Sensu's functionality with [plugins][10], which provide executables for performing status or metric checks, mutators for changing data to a desired format, and handlers for performing an action on a Sensu event.

## Install plugins with assets

Assets are shareable, reusable packages that make it easier to deploy Sensu plugins.
To start using and deploying assets, read [Install plugins with assets][7] to become familiar with workflows that involve assets. 

## Use Bonsai, the Sensu asset index

[Bonsai, the Sensu asset index][8], is a centralized place for downloading and sharing plugin assets.
Make Bonsai your first stop when you need to find an asset.
Bonsai includes plugins, libraries, and runtimes you need to automate your monitoring workflows.
You can also [share your asset on Bonsai][9].

## Install plugins with the sensu-install tool

To use community plugins that are not yet compatible with Sensu Go, use the `sensu-install` tool.

If you've used previous versions of Sensu, you're probably familiar with the [Sensu Community Plugins][1] organization on GitHub.
Although some of these plugins are enabled for Sensu Go, some do not include the components necessary to work with Sensu Go.
Read each plugin's instructions for information about whether it is compatibile with Sensu Go. 

_**NOTE**: Plugins in the Sensu Plugins GitHub organization are community-maintained: anyone can improve on them. To get started with adding to a plugin or sharing your own, head to the [Sensu Community Slack channel][4]. Maintainers are always happy to help answer questions and point you in the right direction._

The `sensu-install` tool comes with an embedded version of Ruby, so you don't need to have Ruby installed on your system. 

To install a [Sensu Community plugin][1] with Sensu Go:

1. Install the [sensu-plugins-ruby package][2] from packagecloud.

2. Run the `sensu-install` command to install plugins in the [Sensu Community Plugins GitHub organization][1] by repository name.
Plugins are installed into `/opt/sensu-plugins-ruby/embedded/bin`.

{{< highlight shell >}}
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
{{< /highlight >}}

For example, to install the [Sensu InfluxDB plugin][6]:

{{< highlight shell >}}
sudo sensu-install -p influxdb
{{< /highlight >}}

To install a specific version of the Sensu InfluxDB plugin with `sensu-install`, run:

{{< highlight shell >}}
sudo sensu-install -p 'sensu-plugins-influxdb:2.0.0'
{{< /highlight >}}

We recommend using a configuration management tool or using [Sensu assets][5] to pin the versions of any plugins installed in production.

_**NOTE**: If a plugin is not Sensu Go-enabled and there is no analogue on Bonsai, you can add the necessary functionality to make the plugin compatible with Sensu Go. Follow [this discourse.sensu.io guide][11] to walk through the process._

## Troubleshoot the sensu-install tool

Some plugins require additional tools to install them successfully.
An example is the [Sensu disk checks plugin][3].
Depending on the plugin, you may need to install developer tool packages.

{{< platformBlock "Ubuntu/Debian" >}}

**Ubuntu/Debian**:

{{< highlight shell >}}
sudo apt-get update
{{< /highlight >}}

{{< highlight shell >}}
sudo apt-get install build-essential
{{< /highlight >}}

{{< platformBlockClose >}}

{{< platformBlock "RHEL/CentOS" >}}

**RHEL/CentOS**:

{{< highlight shell >}}
sudo yum update
{{< /highlight >}}

{{< highlight shell >}}
sudo yum groupinstall "Development Tools"
{{< /highlight >}}

{{< platformBlockClose >}}

[1]: https://github.com/sensu-plugins/
[2]: https://packagecloud.io/sensu/community/
[3]: https://github.com/sensu-plugins/sensu-plugins-disk-checks/
[4]: https://slack.sensu.io/
[5]: ../../reference/assets/
[6]: https://github.com/sensu-plugins/sensu-plugins-influxdb/
[7]: ../../guides/install-check-executables-with-assets/
[8]: https://bonsai.sensu.io/
[9]: ../../reference/assets#share-an-asset-on-bonsai
[10]: /plugins/latest/reference/
[11]: https://discourse.sensu.io/t/contributing-assets-for-existing-ruby-sensu-plugins/1165
