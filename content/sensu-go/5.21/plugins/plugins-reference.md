---
title: "Plugins reference"
linkTitle: "Plugins Reference"
description: "Read this reference doc to learn about plugins."
weight: 30
version: "5.21"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.21:
    parent: plugins
---

## Sensu plugin specification

Sensu plugins must comply with this specification:

- Accept input/data via `STDIN` (handler and mutator plugins only)
  - Optionally able to parse a JSON data payload (i.e. [event data][4])
- Output data to `STDOUT` or `STDERR`
- Produce an exit status code to indicate state:
  - `0` indicates `OK`
  - `1` indicates `WARNING`
  - `2` indicates `CRITICAL`
  - Exit status codes other than `0`, `1`, or `2` indicate an unknown or custom
    status
- Able to parse command line arguments to modify plugin behavior (optional)

## Supported programming languages

Any programming language that can satisfy the [Sensu plugin specification][16]
requirements &ndash; which is nearly any programming language in the world
&ndash; can be used to write Sensu plugins. One of the primary advantages of
writing Sensu plugins in the Ruby programming language is that Sensu itself is
written in Ruby, [and all Sensu installer packages provide an embedded
Ruby][25], eliminating the need to install or depend on a separate runtime.

{{% notice note %}}
**NOTE**: Plugins written in programming languages other than Ruby will require the
corresponding runtime to be installed in order for the plugin to run.
{{% /notice %}}

## Plugin definition specification

{{% notice note %}}
**NOTE**: Plugins based on the `sensu-plugin` gem derive configuration from [custom check definition attributes][28]. The configuration example(s) provided above, and the specification" provided here are for clarification and convenience only (i.e. this "specification" is just an extension of the [check definition specification][29], and not a definition of a distinct Sensu primitive).
{{% /notice %}}

### Check definition attributes

occurrences |
------------|------
description | The number of event occurrences that must occur before an event is handled for the check.
required    | false
type        | Integer
default     | `1`
example     | {{< code shell >}}"occurrences": 3{{< /code >}}

refresh     |
------------|------
description | Time in seconds until the event occurrence count is considered reset for the purpose of counting `occurrences`, to allow an event for the check to be handled again. For example, a check with a refresh of `1800` will have its events (recurrences) handled every 30 minutes, to remind users of the issue.
required    | false
type        | Integer
default     | `1800`
example     | {{< code shell >}}"refresh": 3600{{< /code >}}                                    

dependencies | 
-------------|------
description  | An array of check dependencies. Events for the check will not be handled if events exist for one or more of the check dependencies. A check dependency can be a check executed by the same Sensu client (eg. `check_app`), or a client/check pair (eg.`db-01/check_mysql`).
required     | false
type         | String
example      | {{< code shell >}}"dependencies": [
  "check_app",
  "db-01/check_mysql"
]{{< /code >}}

notification | 
-------------|------
description  | The notification message used for events created by the check, instead of the commonly used check output. This attribute is used by most notification event handlers that use the sensu-plugin library.
required     | false
type         | String
example      | {{< code shell >}}"notification": "the shopping cart application is not responding to requests"{{< /code >}}

## Basic plugin example

The following example demonstrates how to write a basic Sensu plugin in the Ruby programming language.

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
**NOTE**: This example doesn't provide much in terms of functionality (it would simply be logged to the [Sensu server][23] log file), but it does provide a starting point for a simple custom plugin.
{{% /notice %}}


[1]: ../sensu-query-expressions/
[2]: ../rbac#namespaces
[3]: ../tokens/#manage-assets
[4]: https://bonsai.sensu.io/assets/samroy92/sensu-plugins-windows
[5]: #metadata-attributes
[6]: ../checks/
[7]: ../filters/
[8]: ../mutators/
[9]: ../handlers/
[10]: ../entities#system-attributes
[11]: ../../sensuctl/create-manage-resources/#create-resources
[12]: #spec-attributes
[13]: https://github.com/sensu/sensu/issues/1919
[14]: #environment-variables-for-asset-paths
[15]: #example-asset-structure
[16]: https://bonsai.sensu.io/
[17]: #token-substitution-for-asset-paths
[18]: https://discourse.sensu.io/t/the-hello-world-of-sensu-assets/1422
[19]: https://regex101.com/r/zo9mQU/2
[20]: ../../api#response-filtering
[21]: ../../sensuctl/filter-responses/
[23]: ../../guides/install-check-executables-with-assets/
[24]: https://github.com
[25]: https://help.github.com/articles/about-releases/
[26]: #bonsaiyml-example
[27]: https://goreleaser.com/
[28]: https://github.com/sensu/sensu-go-plugin/
[29]: /plugins/latest/reference/
[30]: ../agent#disable-assets
[31]: #example-asset-with-a-check
[34]: #asset-definition-single-build-deprecated
[35]: #asset-definition-multiple-builds
[37]: https://bonsai.sensu.io/sign-in
[38]: https://bonsai.sensu.io/new
[39]: ../../web-ui/filter#filter-with-label-selectors
[40]: ../../reference/agent/#configuration-via-flags
[41]: ../../reference/backend/#configuration
[42]: #filters
[43]: https://bonsai.sensu.io/assets/sensu/sensu-ruby-runtime
