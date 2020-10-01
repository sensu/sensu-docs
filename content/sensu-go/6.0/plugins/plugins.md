---
title: "Plugins reference"
linkTitle: "Plugins Reference"
reference_title: "Plugins"
type: "reference"
description: "Sensu plugins provide executable scripts or other programs that can be used as a Sensu check command, pipe handler command, or mutator command. Read the plugin reference to learn about the Sensu plugin specification."
weight: 60
version: "6.0"
product: "Sensu Go"
menu:
  sensu-go-6.0:
    parent: plugins
---

Sensu plugins provide executable scripts or other programs that you can use as Sensu checks, handlers, and mutators.
Sensu plugins must comply with the following specification:

- Accept input/data via `STDIN` (handler and mutator plugins only)
  - Optionally able to parse a JSON data payload (i.e. observation data in an event)
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

## Plugin execution

All plugins are executed by the Sensu backend.
Plugins must be executable files that are discoverable on the Sensu system (i.e. installed in a system `$PATH` directory) or referenced with an absolute path (e.g. `/opt/path/to/my/plugin`).

{{% notice note %}}
**NOTE**: By default, Sensu installer packages will modify the system `$PATH` for the Sensu processes to include `/etc/sensu/plugins`.
As a result, executable scripts (e.g. plugins) located in `/etc/sensu/plugins` will be valid commands.
This allows command attributes to use relative paths for Sensu plugin commands, such as `"command": "check-http.rb -u https://sensuapp.org"`.
{{% /notice %}}

## Examples

### Go plugin example

**PLACEHOLDER**

### Ruby plugin example

The following example demonstrates how to write a very basic Sensu plugin in the Ruby programming language.

{{< code ruby >}}
#!/usr/bin/env ruby
#
# A simple example handler plugin.

require 'json'

# Read the incoming JSON data from STDIN.
event = JSON.parse(STDIN.read, :symbolize_names => true)

# Create an output object using Ruby string interpolation
output = "The check named #{event[:check][:name]} generated the following output: #{event[:output]}"

# Convert the mutated event data back to JSON and output it to STDOUT.
puts output
{{< /code >}}

{{% notice note %}}
**NOTE**: This example doesn't provide much in terms of functionality but it is a starting point for a simple custom plugin.
{{% /notice %}}


[1]: #supported-programming-languages
[2]: https://github.com/sensu-plugins/sensu-plugins-http
[3]: https://bonsai.sensu.io/assets/sensu/sensu-ruby-runtime
