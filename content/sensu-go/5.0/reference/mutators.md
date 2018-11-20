---
title: "Mutators"
description: "The mutators reference guide."
product: "Sensu Go"
weight: 1
version: "5.0"
platformContent: False 
menu:
  sensu-go-5.0:
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

### Commands
Each Sensu mutator definition defines a command to be executed. Mutator commands are executable commands which will be executed on a Sensu server, run as the `sensu user`. Most mutator commands are provided by Sensu Plugins.

Sensu mutator `command` attributes may include command line arguments for
controlling the behavior of the `command` executable. Many Sensu mutator plugins
provide support for command line arguments for reusability.

### How and where are mutator commands executed?
As mentioned above, all mutator commands are executed by a Sensu server as the `sensu` user. Commands must be executable files that are discoverable on the Sensu server system (installed in a system `$PATH` directory).

_NOTE: By default, the Sensu installer packages will modify the system `$PATH` for the Sensu processes to include `/etc/sensu/plugins`. As a result, executable scripts (like plugins) located in `/etc/sensu/plugins` will be valid commands. This allows `command` attributes to use “relative paths” for Sensu plugin commands, for example: `"command": "check-http.rb -u https://sensuapp.org"`._

### Attributes

|metadata    |      |
-------------|------
description  | Collection of metadata about the mutator, including the `name` and `namespace` as well as custom `labels` and `annotations`. See the [metadata attributes reference][2] for details.
required     | true
type         | Map of key-value pairs
example      | {{< highlight shell >}}"metadata": {
  "name": "example-mutator",
  "namespace": "default",
  "labels": {
    "region": "us-west-1"
  },
  "annotations": {
    "slack-channel" : "#monitoring"
  }
}{{< /highlight >}}

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

runtime_assets | 
---------------|------
description    | An array of [Sensu assets][1] (names), required at runtime for the execution of the `command`
required       | false
type           | Array
example        | {{< highlight shell >}}"runtime_assets": ["ruby-2.5.0"]{{< /highlight >}}

### Metadata attributes

| name       |      |
-------------|------
description  | A unique string used to identify the mutator. Mutator names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2)). Each mutator must have a unique name within its namespace.
required     | true
type         | String
example      | {{< highlight shell >}}"name": "example-mutator"{{< /highlight >}}

| namespace  |      |
-------------|------
description  | The Sensu [RBAC namespace][3] that this mutator belongs to.
required     | false
type         | String
default      | `default`
example      | {{< highlight shell >}}"namespace": "production"{{< /highlight >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with event data, which can be queried like regular attributes. You can use labels to organize mutators into meaningful collections that can be selected using [filters][4] and [tokens][5].
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}}"labels": {
  "environment": "development",
  "region": "us-west-2"
}{{< /highlight >}}

| annotations |    |
-------------|------
description  | Arbitrary, non-identifying metadata to include with event data. In contrast to labels, annotations are not used internally by Sensu and cannot be used to identify mutators. You can use annotations to add data that helps people or external tools interacting with Sensu.
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}} "annotations": {
  "managed-by": "ops",
  "slack-channel": "#monitoring",
  "playbook": "www.example.url"
}{{< /highlight >}}

## Examples

The following Sensu mutator definition uses an imaginary Sensu plugin called `example_mutator.rb`
to modify event data prior to handling the event.

### Mutator definition
{{< highlight json >}}
{
  "type": "Mutator",
  "spec": {
    "metadata": {
      "name": "example-mutator",
      "namespace": "default",
      "labels": null,
      "annotations": null
    },
    "command": "example_mutator.go",
    "timeout": 0,
    "env_vars": [],
    "runtime_assets": []
  }
}
{{< /highlight >}}



[1]: ../assets
[2]: #metadata-attributes
[3]: ../rbac#namespaces
[4]: ../filters
[5]: ../tokens
