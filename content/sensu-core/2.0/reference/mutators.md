---
title: "Mutators"
description: "The mutators reference guide."
product: "Sensu Core"
weight: 1
version: "2.0"
platformContent: False 
menu:
  sensu-core-2.0:
    parent: reference
---

- [Specification](#mutator-specification)
- [Examples](#examples)

## How do mutators work?
A handler can specify a mutator to transform event data. Mutators are executed 
prior to the execution of a handler. If the mutator executes successfully, the modified event 
data is returned to the handler, and the handler is then executed. If the mutator 
fails to execute, an error will be logged, and the handler will not be executed.

* When Sensu server processes an event, it will check the handler for the
  presence of a mutator, and execute that mutator before executing the handler. 
* If the mutator executes successfully (it returns an exit status code of 0), modified
  event data is provided to the handler, and the handler is executed.
* If the mutator fails to execute (it returns a non-zero exit status code, or
  fails to complete within its configured timeout), an error will be logged and
  the handler will not execute.

## Mutator specification
* Accepts input/data via `STDIN`
* Able to parse JSON event data
* Outputs JSON data (modified event data) to `STDOUT` or `STDERR`
* Produces an exit status code to indicate state:
  * `0` indicates OK status
  * exit codes other than `0` indicate failure

### Naming
Each mutator definition must have a unique name within its organization and
environment.

* A unique string used to identify the mutator
* Cannot contain special characters or spaces
* Validated with Go regex [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2)

### Commands
Each Sensu mutator definition defines a command to be executed. Mutator commands are executable commands which will be executed on a Sensu server, run as the `sensu user`. Most mutator commands are provided by Sensu Plugins.

Sensu mutator `command` attributes may include command line arguments for
controlling the behavior of the `command` executable. Many Sensu mutator plugins
provide support for command line arguments for reusability.

### How and where are mutator commands executed?
As mentioned above, all mutator commands are executed by a Sensu server as the `sensu` user. Commands must be executable files that are discoverable on the Sensu server system (installed in a system `$PATH` directory).

_NOTE: By default, the Sensu installer packages will modify the system `$PATH` for the Sensu processes to include `/etc/sensu/plugins`. As a result, executable scripts (like plugins) located in `/etc/sensu/plugins` will be valid commands. This allows `command` attributes to use “relative paths” for Sensu plugin commands, for example: `"command": "check-http.rb -u https://sensuapp.org"`._

### Attributes
command      | 
-------------|------ 
description  | The mutator command to be executed by Sensu server. 
required     | true
type         | String
example      | {{< highlight shell >}}"command": "/etc/sensu/plugins/mutated.rb"{{</highlight>}}

timeout      | 
-------------|------ 
description  | The mutator execution duration timeout in seconds (hard stop). 
required     | false 
type         | integer 
example      | {{< highlight shell >}}"timeout": 30{{</highlight>}}


## Examples

The following Sensu mutator definition uses an imaginary Sensu plugin called `example_mutator.rb`
to modify event data prior to handling the event.

### Mutator definition
{{< highlight json >}}
{
  "name": "example-mutator",
  "command": "example_mutator.rb",
  "timeout": 60,
  "env_vars": null,
  "environment": "default",
  "organization": "default"
}
{{< /highlight >}}
