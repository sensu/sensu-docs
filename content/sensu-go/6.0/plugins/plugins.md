---
title: "Plugins reference"
linkTitle: "Plugins Reference"
reference_title: "Plugins"
type: "reference"
description: "Sensu plugins provide executable scripts or other programs that can be used as a Sensu check command, pipe handler command, or mutator command. Read the plugin reference to learn about the Sensu plugin specification."
weight: 50
version: "6.0"
product: "Sensu Go"
menu:
  sensu-go-6.0:
    parent: plugins
---

Sensu plugins provide executable scripts or other programs that you can use as Sensu checks, handlers, and mutators.
Sensu plugins must comply with a simple specification:

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

Any programming language that can satisfy the Sensu plugin specification requirements &ndash; which is nearly any programming language in the world &ndash; can be used to write Sensu plugins.
A primary advantage of writing Sensu plugins in the Ruby programming language is that Sensu itself is written in Ruby, [and all Sensu installer packages provide an embedded Ruby][3], eliminating the need to install or depend on a separate runtime.

{{% notice note %}}
**NOTE**: Plugins written in programming languages other than Ruby will require the corresponding runtime to be installed in order for the plugin to run.
{{% /notice %}}

## Plugin execution

All plugins are executed by the Sensu backend.
Plugins must be executable files that are discoverable on the Sensu system (i.e. installed in a system `$PATH` directory) or referenced with an absolute path (e.g. `/opt/path/to/my/plugin`).

{{% notice note %}}
**NOTE**: By default, Sensu installer packages will modify the system `$PATH` for the Sensu processes to include `/etc/sensu/plugins`.
As a result, executable scripts (e.g. plugins) located in `/etc/sensu/plugins` will be valid commands.
This allows command attributes to use relative paths for Sensu plugin commands, such as `"command": "check-http.rb -u https://sensuapp.org"`.
{{% /notice %}}

## Sensu Plugin gem

Although Sensu Plugins [may be written in any programming language][1], there are certain advantages of writing plugins in Ruby.
From an operations perspective, Ruby-based plugins are convenient because they are able to run on [Sensu's embedded Ruby][3]. Ruby-based plugins also benefit from the [`sensu-plugin` gem][4] &mdash; a Ruby library that provides some built-in functionality and a number of helper classes and that simplify custom plugin development.

Much of the built-in functionality provided by the `sensu-plugin` gem depends on custom client, check, and/or handler definition attributes, as documented below.

## Plugin configuration

### Example check plugin definition

The following is an example [Sensu check definition][6] that uses the `check-http.rb` script provided by the [Sensu HTTP Plugin][2] and a [custom check definition attribute][5] called `refresh`.
Although the `refresh` attribute itself is not directly supported by Sensu, the `sensu-plugin` gem does provide built-in support for reducing alert fatigue via the `Sensu::Plugin::Handler` class (i.e. only handling events on the first occurrence, and again every N occurrences, where N = `refresh`).

{{< code json >}}
{
  "checks": {
    "api_health": {
      "command": "check-http.rb -u https://api.example.com/health",
      "standalone": true,
      "interval": 60,
      "refresh": 60
    }
  }
}
{{< /code >}}

### Sensu plugin definition specification

Plugins based on the `sensu-plugin` gem derive configuration from [custom check definition attributes][5].
The configuration example(s) provided above, and the "specification" provided here are for clarification and convenience only (i.e. this "specification" is just an extension of the [check definition specification][6], and not a definition of a distinct Sensu primitive).

#### Check definition attributes

occurrences | 
------------|------
description | The number of event occurrences that must occur before an event is handled for the check.
required    | false
type        | Integer
default     | `1`
example     | {{< code shell >}}"occurrences": 3{{< /code >}}

refresh | 
--------|------
description | Time in seconds until the event occurrence count is considered reset for the purpose of counting `occurrences`, to allow an event for the check to be handled again. For example, a check with a refresh of `1800` will have its events (recurrences) handled every 30 minutes, to remind users of the issue.
required    | false
type        | Integer
default     | `1800`
example     | {{< code shell >}}"refresh": 3600{{< /code >}}

dependencies | 
-------------|------
description  | An array of check dependencies. Events for the check will not be handled if events exist for one or more of the check dependencies. A check dependency can be a check executed by the same Sensu client (eg. `check_app`), or a client/check pair (eg.`db-01/check_mysql`).
required     | false
type         | Array
example      | {{< code shell >}}"dependencies": [                                                                       
  "check_app",
  "db-01/check_mysql"
]
{{< /code >}}

notification | 
-------------|------
description  | The notification message used for events created by the check, instead of the commonly used check output. This attribute is used by most notification event handlers that use the sensu-plugin library.
required     | false
type         | String
example      | {{< code shell >}}"notification": "the shopping cart application is not responding to requests"{{< /code >}}

## Example

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
[3]: #what-is-sensus-embeddedruby
[4]: https://github.com/sensu-plugins/sensu-plugin
[5]: /sensu-core/latest/reference/checks#custom-attributes
[6]: /sensu-core/latest/reference/checks#check-definition-attributesw
