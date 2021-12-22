---
title: "Plugins reference"
linkTitle: "Plugins Reference"
reference_title: "Plugins"
type: "reference"
description: "Sensu plugins provide executable scripts or other programs that can be used as a Sensu check command, pipe handler command, or mutator command. Read the plugin reference to learn about the Sensu plugin specification."
weight: 80
version: "6.5"
product: "Sensu Go"
menu:
  sensu-go-6.5:
    parent: plugins
---

Sensu plugins provide executable scripts or other programs that you can use as Sensu checks, handlers, and mutators.
Sensu plugins must comply with the following specification:

- Accept input/data via `STDIN` (handler and mutator plugins only)
  - Optionally able to parse a JSON data payload (that is, observation data in an event)
- Output data to `STDOUT` or `STDERR`
- Produce an exit status code to indicate state:
  - `0` indicates `OK`
  - `1` indicates `WARNING`
  - `2` indicates `CRITICAL`
  - exit status codes other than `0`, `1`, or `2` indicate an unknown or custom
    status
- Optionally able to parse command line arguments to modify plugin behavior

## Supported programming languages

You can use any programming language that can satisfy the Sensu plugin specification requirements &mdash; which is nearly any programming language in the world &mdash; to write Sensu plugins.

Using plugins written in programming languages other than Go requires you to install the corresponding runtime.
For example, to use a Ruby plugin with Sensu Go, you must install the [Sensu Go Ruby Runtime asset][3].

### Use Nagios plugins

The Sensu plugin specification is compatible with the [Nagios plugin specification][9], so you can use the 50+ plugins in the official [Nagios Plugins project][10] and 4000+ plugins in the [Nagios Exchange][11] with Sensu without any modification.

## Plugin execution

All plugins are executed by the Sensu backend.
Plugins must be executable files that are discoverable on the Sensu system (that is, installed in a system `$PATH` directory) or referenced with an absolute path (for example, `/opt/path/to/my/plugin`).

{{% notice note %}}
**NOTE**: By default, Sensu installer packages will modify the system `$PATH` for the Sensu processes to include `/etc/sensu/plugins`.
As a result, executable scripts (for example, plugins) located in `/etc/sensu/plugins` will be valid commands.
This allows command attributes to use relative paths for Sensu plugin commands, such as `"command": "http-check --url https://sensu.io"`.
{{% /notice %}}

## Go plugin example

The following example shows the structure for a very basic Sensu Go plugin.

{{< code go >}}
package main

import (
	"fmt"
	"log"

	"github.com/sensu-community/sensu-plugin-sdk/sensu"
	"github.com/sensu/sensu-go/types"
)

// Config represents the check plugin config.
type Config struct {
	sensu.PluginConfig
	Example string
}

var (
	plugin = Config{
		PluginConfig: sensu.PluginConfig{
			Name:     "check_name",
			Short:    "Description for check_name",
			Keyspace: "sensu.io/plugins/check_name/config",
		},
	}

	options = []*sensu.PluginConfigOption{
		&sensu.PluginConfigOption{
			Path:      "example",
			Env:       "CHECK_EXAMPLE",
			Argument:  "example",
			Shorthand: "e",
			Default:   "",
			Usage:     "An example string configuration option",
			Value:     &plugin.Example,
		},
	}
)

func main() {
	check := sensu.NewGoCheck(&plugin.PluginConfig, options, checkArgs, executeCheck, false)
	check.Execute()
}

func checkArgs(event *types.Event) (int, error) {
	if len(plugin.Example) == 0 {
		return sensu.CheckStateWarning, fmt.Errorf("--example or CHECK_EXAMPLE environment variable is required")
	}
	return sensu.CheckStateOK, nil
}

func executeCheck(event *types.Event) (int, error) {
	log.Println("executing check with --example", plugin.Example)
	return sensu.CheckStateOK, nil
}
{{< /code >}}


To create this scaffolding for a Sensu Go check, handler, mutator, or sensuctl plugin, use the [Sensu Plugin Tool][4] along with a [default plugin template][5].
The plugin template repositories wrap the [Sensu Plugin SDK][8], which provides the framework for building Sensu Go plugins.

For a step-by-step walkthrough, read [How to publish an asset with the Sensu Go SDK][7] &mdash; you'll learn how to create a check plugin and a handler plugin with the Sensu Plugin SDK.
You can also watch our 30-minute webinar, [Intro to assets with the Sensu Go SDK][6], and learn to build a check plugin for Sensu Go.

## Ruby plugin example

The following example demonstrates a very basic Sensu plugin in the Ruby programming language.

{{< code ruby >}}
#!/usr/bin/env ruby
#
require 'json'

# Read the incoming JSON data from STDIN
event = JSON.parse(STDIN.read, :symbolize_names => true)

# Create an output object using Ruby string interpolation
output = "The check named #{event[:check][:name]} generated the following output: #{event[:output]}"

# Convert the mutated event data back to JSON and output it to STDOUT
puts output
{{< /code >}}

{{% notice note %}}
**NOTE**: This example is intended as a starting point for building a basic custom plugin in Ruby.
It does not provide functionality.
{{% /notice %}}


[1]: #supported-programming-languages
[2]: https://github.com/sensu-plugins/sensu-plugins-http
[3]: https://bonsai.sensu.io/assets/sensu/sensu-ruby-runtime
[4]: https://github.com/sensu-community/sensu-plugin-tool
[5]: https://github.com/sensu-community/sensu-plugin-tool#overview
[6]: https://sensu.io/resources/webinar/intro-to-assets-with-the-sensu-go-sdk
[7]: https://sensu.io/blog/how-to-publish-an-asset-with-the-sensu-go-sdk
[8]: https://github.com/sensu-community/sensu-plugin-sdk
[9]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/pluginapi.html
[10]: https://www.nagios.org/downloads/nagios-plugins/
[11]: https://exchange.nagios.org/
