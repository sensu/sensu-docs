---
title: "Installing Plugins"
description: "Installing Plugins"
weight: 17
product: "Sensu Core"
version: "0.29"
menu:
  sensu-core-0.29:
    parent: installation
---

Sensu's functionality can be extended through the use of plugins. Plugins can provide executables for performing status or metric checks, mutators for changing data to a desired format, or handlers for performing an action on a Sensu event. You can find a number of plugins in the [Sensu Plugins][1] repository.

_NOTE: Plugins found in the Sensu Plugins Github organziation are community-maintained, meaning that anyone can improve on a plugin found there. If you have a question about how you can get involved in adding to, or providing a plugin, head to the [Sensu Community Slack channel][2]. Our maintainers are always happy to help answer questions and point you in the right direction._

To install a plugin, you can use the `sensu-install` tool provided as part of the Sensu package.

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
    -x, --proxy PROXY                Install Sensu plugins and extensions via a PROXY URL{{< /highlight >}}

As an example, let's install the [disk checks plugin][3]:

{{< highlight shell >}}
sensu-install -p disk-checks
[SENSU-INSTALL] installing Sensu plugins ...
[SENSU-INSTALL] determining if Sensu gem 'sensu-plugins-disk-checks' is already installed ...
false
[SENSU-INSTALL] Sensu plugin gems to be installed: ["sensu-plugins-disk-checks"]
[SENSU-INSTALL] installing Sensu gem 'sensu-plugins-disk-checks'
Fetching: sensu-plugins-disk-checks-3.1.0.gem (100%)
You can use the embedded Ruby by setting EMBEDDED_RUBY=true in /etc/default/sensu
Successfully installed sensu-plugins-disk-checks-3.1.0
1 gem installed
[SENSU-INSTALL] successfully installed Sensu plugins: ["sensu-plugins-disk-checks"]{{< /highlight >}}

For Windows systems, this differs slightly, as the Windows msi package installs all Sensu components to `C:\opt\sensu`:

{{< highlight shell >}}{{< /highlight >}}

<!-- LINKS -->
[1]: https://github.com/sensu-plugins
[2]: https://slack.sensu.io
[3]: https://github.com/sensu-plugins/sensu-plugins-disk-checks