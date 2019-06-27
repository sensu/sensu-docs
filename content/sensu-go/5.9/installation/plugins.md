---
title: "Installing Sensu Plugins"
linkTitle: "Install Plugins"
description: "Sensu plugins provide executables for performing status or metric checks, mutators for changing data to a desired format, or handlers for performing an action on a Sensu event. Read the plugin installation guide to learn about installing plugins using assets and using Sensu Community plugins with Sensu Go."
weight: 2
version: "5.9"
product: "Sensu Go"
menu:
  sensu-go-5.9:
    parent: installation
---

Sensu's functionality can be extended through the use of plugins.
Plugins can provide executables for performing status or metric checks, mutators for changing data to a desired format, or handlers for performing an action on a Sensu event.

## Installing plugins using Bonsai, the Sensu asset index

Assets are shareable, reusable packages that make it easy to deploy Sensu plugins.
You can use assets to provide the plugins, libraries, and runtimes you need to automate your monitoring workflows.
Visit [Bonsai](https://bonsai.sensu.io/) to discover, download, and share assets, and get started with these helpful resources.

- [Bonsai, the Sensu asset index](https://bonsai.sensu.io/)
- [Installing plugins with assets](../../guides/install-check-executables-with-assets)
- [Sharing assets on Bonsai](../../reference/assets#sharing-an-asset-on-bonsai)

## Installing plugins using the sensu-install tool

You can find a number of plugins in the [Sensu Plugins][1] organization on GitHub.
See individual plugin instructions for information about compatibility with Sensu Go.

_NOTE: Plugins found in the Sensu Plugins GitHub organization are community-maintained, meaning that anyone can improve on a plugin found there. If you have a question about how you can get involved in adding to, or providing a plugin, head to the [Sensu Community Slack channel][4]. Maintainers are always happy to help answer questions and point you in the right direction._

To install a [Sensu Community Plugin][1] with Sensu Go:

1. Install the [sensu-plugins-ruby package][2] from packagecloud.

2. Use the `sensu-install` command to install any plugins in the [Sensu Plugins organization on GitHub][1] by repository name. Plugins are installed into `/opt/sensu-plugins-ruby/embedded/bin`.

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

For example, to install the [Sensu InfluxDB Plugin][6]:

{{< highlight shell >}}
sudo sensu-install -p influxdb
{{< /highlight >}}

To install a specific version of the Sensu InfluxDB Plugin with `sensu-install`, run:

{{< highlight shell >}}
sudo sensu-install -p 'sensu-plugins-influxdb:2.0.0'
{{< /highlight >}}

We strongly recommend using a configuration management tool or using [Sensu assets][5] to pin the versions of any plugins installed in production.

### Troubleshooting the sensu-install tool

Some plugins, such as the [Sensu Disk Checks Plugin][3], require additional tools to install successfully.
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

[1]: https://github.com/sensu-plugins
[2]: https://packagecloud.io/sensu/community
[3]: https://github.com/sensu-plugins/sensu-plugins-disk-checks
[4]: https://slack.sensu.io
[5]: ../../reference/assets
[6]: https://github.com/sensu-plugins/sensu-plugins-influxdb
