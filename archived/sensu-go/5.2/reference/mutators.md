---
title: "Mutators"
description: "As part of the event pipeline, mutators let you transform event data prior to being handled. Read the reference doc to learn about mutators."
product: "Sensu Go"
weight: 10
version: "5.2"
platformContent: False 
menu:
  sensu-go-5.2:
    parent: reference
---

- [Built-in mutators](#built-in-mutators)
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

_NOTE: By default, the Sensu installer packages will modify the system `$PATH` for the Sensu processes to include `/etc/sensu/plugins`. As a result, executable scripts (like plugins) located in `/etc/sensu/plugins` will be valid commands. This allows `command` attributes to use “relative paths” for Sensu plugin commands, for example: `"command": "check-http.go -u https://sensuapp.org"`._

## Built-in mutators

Sensu includes built-in mutators to help you customize event pipelines for metrics and alerts.

### Built-in mutator: only check output

To process an event, some handlers require only the check output, not the entire event definition. For example, when sending metrics to Graphite using a TCP handler, Graphite expects data that follows the Graphite plaintext protocol. By using the built-in `only_check_output` mutator, Sensu reduces the event to only the check output, so it can be accepted by Graphite.

To use the only check output mutator, include the `only_check_output` mutator in the handler configuration `mutator` string:

{{< language-toggle >}}

{{< highlight yml >}}
type: Handler
api_version: core/v2
metadata:
  name: graphite
  namespace: default
spec:
  mutator: only_check_output
  socket:
    host: 10.0.1.99
    port: 2003
  type: tcp
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "graphite",
    "namespace": "default"
  },
  "spec": {
    "type": "tcp",
    "socket": {
      "host": "10.0.1.99",
      "port": 2003
    },
    "mutator": "only_check_output"
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

## Mutators specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute specifying the [`sensuctl create`][sc] resource type. Mutators should always be of type `Mutator`.
required     | Required for mutator definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"type": "Mutator"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute specifying the Sensu API group and version. For mutators in Sensu backend version 5.2, this attribute should always be `core/v2`.
required     | Required for mutator definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"api_version": "core/v2"{{< /highlight >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the mutator, including the `name` and `namespace` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the mutator definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope.  See the [metadata attributes reference][2] for details.
required     | Required for mutator definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"metadata": {
  "name": "example-mutator",
  "namespace": "default",
  "labels": {
    "region": "us-west-1"
  },
  "annotations": {
    "slack-channel" : "#monitoring"
  }
}
{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes the mutator [spec attributes][sp].
required     | Required for mutator definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"spec": {
  "command": "example_mutator.go",
  "timeout": 0,
  "env_vars": [],
  "runtime_assets": []
}
{{< /highlight >}}

### Spec attributes

command      | 
-------------|------ 
description  | The mutator command to be executed by Sensu server. 
required     | true
type         | String
example      | {{< highlight shell >}}"command": "/etc/sensu/plugins/mutated.go"{{</highlight>}}

env_vars      | 
-------------|------
description  | An array of environment variables to use with command execution.
required     | false
type         | Array
example      | {{< highlight shell >}}"env_vars": ["RUBY_VERSION=2.5.0"]{{< /highlight >}}

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
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores, but must start with a letter. Values can be any valid UTF-8 string.
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

The following Sensu mutator definition uses an imaginary Sensu plugin called `example_mutator.go`
to modify event data prior to handling the event.

### Mutator definition
{{< language-toggle >}}

{{< highlight yml >}}
type: Mutator
api_version: core/v2
metadata:
  annotations: null
  labels: null
  name: example-mutator
  namespace: default
spec:
  command: example_mutator.go
  env_vars: []
  runtime_assets: []
  timeout: 0
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Mutator",
  "api_version": "core/v2",
  "metadata": {
    "name": "example-mutator",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },  
  "spec": {
    "command": "example_mutator.go",
    "timeout": 0,
    "env_vars": [],
    "runtime_assets": []
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

### Minimum required mutator attributes

{{< language-toggle >}}

{{< highlight yml >}}
type: Mutator
api_version: core/v2
metadata:
  name: mutator_minimum
  namespace: default
spec:
  command: example_mutator.go
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Mutator",
  "api_version": "core/v2",
  "metadata": {
    "name": "mutator_minimum",
    "namespace": "default"
  },
  "spec": {
    "command": "example_mutator.go"
  }
}
{{< /highlight >}}

{{< /language-toggle >}}  

[1]: ../assets
[2]: #metadata-attributes
[3]: ../rbac#namespaces
[4]: ../filters
[5]: ../tokens
[sc]: ../../sensuctl/reference#creating-resources
[sp]: #spec-attributes
