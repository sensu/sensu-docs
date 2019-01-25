---
title: "Installing Sensu Plugins"
linkTitle: "Install Plugins"
description: "How to install Sensu Plugins for use with Sensu Go"
weight: 2
version: "5.2"
product: "Sensu Go"
menu:
  sensu-go-5.2:
    parent: installation
---

Sensu's functionality can be extended through the use of plugins.
Plugins can provide executables for performing status or metric checks, mutators for changing data to a desired format, or handlers for performing an action on a Sensu event.
You can find a number of plugins in the [Sensu Plugins][1] organization on GitHub.

_NOTE: Plugins found in the Sensu Plugins GitHub organization are community-maintained, meaning that anyone can improve on a plugin found there. If you have a question about how you can get involved in adding to, or providing a plugin, head to the [Sensu Community Slack channel][4]. Maintainers are always happy to help answer questions and point you in the right direction._

### Installing Sensu Plugins
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

For example, to install the [Sensu Disk Checks Plugin][3]:

{{< highlight shell >}}
sudo sensu-install -p disk-checks
{{< /highlight >}}

To install a specific version of the [Sensu Disk Checks Plugin][3] with `sensu-install`, run:

{{< highlight shell >}}
sudo sensu-install -p 'sensu-plugins-disk-checks:3.1.0'
{{< /highlight >}}

We strongly recommend using a configuration management tool or using [Sensu assets][5] to pin the versions of any plugins installed in production.

_NOTE: Sensu Go is compatible with all check executables in the [Sensu Plugins organization][1]. Handler and mutator executables are not yet compatible with Sensu Go._

[1]: https://github.com/sensu-plugins
[2]: https://packagecloud.io/sensu/community
[3]: https://github.com/sensu-plugins/sensu-plugins-disk-checks
[4]: https://slack.sensu.io
[5]: ../../reference/assets
