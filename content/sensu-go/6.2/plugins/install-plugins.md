---
title: "Install Sensu plugins"
linkTitle: "Install Plugins"
description: "Learn how to install plugins to extend Sensu's functionality with executables for performing checks, mutators, and handlers."
weight: 20
version: "6.2"
product: "Sensu Go"
menu:
  sensu-go-6.2:
    parent: plugins
---

Extend Sensu's functionality with plugins, which provide executables for performing status or metric checks, mutators for changing data to a desired format, and handlers for performing an action on a Sensu event.

## Install plugins with dynamic runtime assets

Dynamic runtime assets are shareable, reusable packages that make it easier to deploy Sensu plugins.
To start using and deploying assets, read [Use dynamic runtime assets to install plugins][7] to become familiar with workflows that involve assets.

{{% notice note %}}
**NOTE**: Dynamic runtime assets are not required to use Sensu Go.
You can install Sensu plugins using the [sensu-install](#install-plugins-with-the-sensu-install-tool) tool or a [configuration management](../../operations/deploy-sensu/configuration-management/) solution.
{{% /notice %}}

## Use Bonsai, the Sensu asset hub

[Bonsai, the Sensu asset hub][8], is a centralized place for downloading and sharing dynamic runtime assets.
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

To see a list of all flags for the sensu-install command, run:

{{< code shell >}}
sensu-install --help
{{< /code >}}

The response will be similar to this example:

{{< code shell >}}
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

{{% notice note %}}
**NOTE**: We recommend specifying the plugin version you want to install to maintain the stability of your observability infrastructure.
If you do not specify a version to install, Sensu automatically installs the latest version, which may include breaking changes.
{{% /notice %}}

Use a configuration management tool or [Sensu dynamic runtime assets][5] to pin the versions of any plugins installed in production.

{{% notice note %}}
**NOTE**: If a plugin is not Sensu Go-enabled and there is no analogue on Bonsai, you can add the necessary functionality to make the plugin compatible with Sensu Go.
Follow the Discourse guide [Contributing Assets for Existing Ruby Sensu Plugins](https://discourse.sensu.io/t/contributing-assets-for-existing-ruby-sensu-plugins/1165) to walk through the process.
{{% /notice %}}

### Troubleshoot the sensu-install tool

Some plugins require additional tools to install them successfully.
An example is the [Sensu disk checks plugin][3].

To download and update package information:

{{< language-toggle >}}

{{< code shell "Ubuntu/Debian" >}}
sudo apt-get update
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
sudo yum update
{{< /code >}}

{{< /language-toggle >}}

Depending on the plugin, you may need to install developer tool packages:

{{< language-toggle >}}

{{< code shell "Ubuntu/Debian" >}}
sudo apt-get install build-essential
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
sudo yum groupinstall "Development Tools"
{{< /code >}}

{{< /language-toggle >}}


[1]: https://github.com/sensu-plugins/
[2]: https://packagecloud.io/sensu/community/
[3]: https://github.com/sensu-plugins/sensu-plugins-disk-checks/
[5]: ../assets/
[6]: https://github.com/sensu-plugins/sensu-plugins-influxdb/
[7]: ../use-assets-to-install-plugins/
[8]: https://bonsai.sensu.io/
[9]: ../assets#share-an-asset-on-bonsai
