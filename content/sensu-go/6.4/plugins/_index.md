---
title: "Plugins"
description: "Learn how to find, install, use, and develop Sensu plugins: executable scripts or other programs that you can use as Sensu checks, handlers, and mutators."
product: "Sensu Go"
version: "6.4"
weight: 110
layout: "single"
toc: true
menu:
  sensu-go-6.4:
    identifier: plugins
---

Sensu plugins provide executable scripts or other programs that you can use as Sensu checks, handlers, and mutators.

Plugins are service-specific and have different setup and configuration requirements.
Many Sensu-supported plugins include quick-start templates that you only need to edit to match your configuration.
Each plugin has self-contained documentation with in-depth information about how to install and use it.

## Find Sensu plugins

Search [Bonsai, the Sensu asset hub][2], to find Sensu plugins.
Bonsai lists hundreds of Sensu plugins with installation instructions and usage examples.

We also list popular Sensu plugins in the [featured integrations][3] section.

## Write your own custom plugins

Write your own Sensu plugins in almost any programming language with [Sensu's plugin specification][4].
The [Sensu Go plugin SDK library][9] provides a framework for building Sensu Go plugins so that all you need to do is define plugin arguments and input validation and execution functions.

If you are interested in sharing your plugin with other Sensu users, you can find guidance for contributing plugins, pinning versions, writing plugin READMEs, and transferring repos to community responsibility at the [Sensu plugins community GitHub repo][8]

## Use Nagios plugins

The [Sensu plugin specification][4] is compatible with the [Nagios plugin specification][5], so you can use Nagios plugins with Sensu without any modification.
Sensu allows you to bring new life to the 50+ plugins in the official [Nagios Plugins project][6], a mature source of monitoring plugins, and more than 4000 plugins in the [Nagios Exchange][7].


[1]: developer-guidelines/
[2]: https://bonsai.sensu.io/
[3]: supported-integrations/
[4]: plugins/
[5]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/pluginapi.html
[6]: https://www.nagios.org/downloads/nagios-plugins/
[7]: https://exchange.nagios.org/
[8]: https://github.com/sensu-plugins/community
[9]: https://github.com/sensu-community/sensu-plugin-sdk
