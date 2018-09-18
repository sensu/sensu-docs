---
title: "Installing & Managing Plugins"
linkTitle: "Installing Plugins"
description: "Installing and Managing Plugins"
weight: 17
product: "Sensu Core"
version: "1.5"
menu:
  sensu-core-1.5:
    parent: installation
---

Sensu's functionality can be extended through the use of plugins. Plugins can provide executables for performing status or metric checks, mutators for changing data to a desired format, or handlers for performing an action on a Sensu event. You can find a number of plugins in the [Sensu Plugins][1] repository.

- [Linux](#linux)
- [Windows](#windows)

_NOTE: Plugins found in the Sensu Plugins GitHub organization are community-maintained, meaning that anyone can improve on a plugin found there. If you have a question about how you can get involved in adding to, or providing a plugin, head to the [Sensu Community Slack channel][2]. Our maintainers are always happy to help answer questions and point you in the right direction._

## Linux

To install a Ruby-based plugin, you can use the `sensu-install` tool provided as part of the Sensu package.

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

As an example, let's install the [Sensu Disk Checks Plugin][3]:

{{< highlight shell >}}
$ sudo sensu-install -p disk-checks
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

### Pinning Versions

We strongly recommend pinning the versions of any plugins installed in production.
To install the [Sensu Disk Checks Plugin][3] and pin the version, use:

{{< highlight shell >}}
sensu-install -p 'sensu-plugins-disk-checks:3.1.0'
{{< /highlight >}}

### Removing Plugins

If you find that you need to remove a plugin, you can use the embedded `gem` command to remove a plugin. See the example below:

{{< highlight shell >}}
/opt/sensu/embedded/bin/gem uninstall sensu-plugins-disk-checks{{< /highlight >}}

## Windows

To install a Ruby-based plugin on Windows, you can use the `sensu-install` utility provided as part of the Sensu MSI package, located in `C:\opt\sensu\embedded\bin`.

For example, to install the [Sensu Windows Plugin][5], run the following from an administrative command prompt:

{{< highlight shell >}}
$ c:\opt\sensu\embedded\bin\sensu-install -p sensu-plugins-windows
[SENSU-INSTALL] installing Sensu plugins ...
[SENSU-INSTALL] determining if Sensu gem 'sensu-plugins-windows' is already installed ...
false
[SENSU-INSTALL] Sensu plugin gems to be installed: ["sensu-plugins-windows"]
[SENSU-INSTALL] installing Sensu gem 'sensu-plugins-windows'
Fetching: sensu-plugins-windows-2.8.1.gem (100%)
You can use the embedded Ruby by setting EMBEDDED_RUBY=true in /etc/default/sensu
Successfully installed sensu-plugins-windows-2.8.1
1 gem installed
[SENSU-INSTALL] successfully installed Sensu plugins: ["sensu-plugins-windows"]{{< /highlight >}}

_NOTE: When installing plugins on Windows, double check that the executable you're using is compatible with Windows. You can always check by examining the executable in the respective GitHub repo in the `bin` directory._

### Pinning Versions

We strongly recommend pinning the versions of any plugins installed in production.
To install the [Sensu Windows Plugin][5] and pin the version,
run the following from an administrative command prompt:

{{< highlight shell >}}
c:\opt\sensu\embedded\bin\sensu-install -p 'sensu-plugins-windows:2.8.1'
{{< /highlight >}}

### Removing Plugins

If you find that you need to remove a plugin, you can use the embedded `gem` command to remove a plugin. See the example below as run from an administrative command prompt:

{{< highlight shell >}}
$ c:\opt\sensu\embedded\bin\gem uninstall sensu-plugins-windows
Remove executables:
        check-windows-cpu-load.rb, check-windows-disk.rb, check-windows-process.rb, check-windows-processor-queue-length.rb, check-windows-ram.rb, check-windows-service.rb, metric-windows-cpu-load.rb, metric-windows-disk-usage.rb, metric-windows-network.rb, metric-windows-processor-queue-length.rb, metric-windows-ram-usage.rb, metric-windows-uptime.rb, powershell_helper.rb

in addition to the gem? [Yn]  y
Removing check-windows-cpu-load.rb
Removing check-windows-disk.rb
Removing check-windows-process.rb
Removing check-windows-processor-queue-length.rb
Removing check-windows-ram.rb
Removing check-windows-service.rb
Removing metric-windows-cpu-load.rb
Removing metric-windows-disk-usage.rb
Removing metric-windows-network.rb
Removing metric-windows-processor-queue-length.rb
Removing metric-windows-ram-usage.rb
Removing metric-windows-uptime.rb
Removing powershell_helper.rb
Successfully uninstalled sensu-plugins-windows-2.8.1{{< /highlight >}}

Hopefully you've found this useful! If you find any issues or have a question, feel free to reach out in our [Community Slack][2], or [open an issue][4] on GitHub.

<!-- LINKS -->
[1]: https://github.com/sensu-plugins
[2]: https://slack.sensu.io
[3]: https://github.com/sensu-plugins/sensu-plugins-disk-checks
[4]: https://github.com/sensu/sensu-docs/issues/new
[5]: https://github.com/sensu-plugins/sensu-plugins-windows
