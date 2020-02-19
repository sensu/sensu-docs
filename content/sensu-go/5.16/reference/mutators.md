---
title: "Mutators"
description: "As part of the event pipeline, mutators let you transform event data before applying handlers. Read the reference doc to learn about mutators."
product: "Sensu Go"
weight: 130
version: "5.16"
platformContent: False 
menu:
  sensu-go-5.16:
    parent: reference
---

- [Commands](#commands)
- [Built-in mutators](#built-in-mutators)
- [Mutator specification](#mutator-specification)
  - [Top-level attributes](#top-level-attributes) | [Metadata attributes](#metadata-attributes) | [Spec attributes](#spec-attributes)
- [Examples](#examples)

Handlers can specify a mutator to execute and transform event data before any handlers are applied.

* When the Sensu backend processes an event, it checks the handler for the presence of a mutator and executes that mutator before executing the handler.
* If the mutator executes successfully (returns an exit status code of `0`), the modified event data return to the handler and the handler is executed.
* If the mutator fails to execute (returns a non-zero exit status code or fails to complete within its configured timeout), an error is logged and the handler will not execute.

## Commands

Each Sensu mutator definition defines a command to be executed.
Mutator commands are executable commands that will be executed on a Sensu backend, run as the `sensu user`.
Most mutator commands are provided by [Sensu plugins][4].

Sensu mutator `command` attributes may include command line arguments for controlling the behavior of the `command` executable.
Many Sensu mutator plugins provide support for command line arguments for reusability.

All mutator commands are executed by a Sensu backend as the `sensu` user.
Commands must be executable files that are discoverable on the Sensu backend system (installed in a system `$PATH` directory).

_**NOTE**: By default, Sensu installer packages will modify the system `$PATH` for the Sensu processes to include `/etc/sensu/plugins`. As a result, executable scripts (like plugins) located in `/etc/sensu/plugins` will be valid commands. This allows `command` attributes to use “relative paths” for Sensu plugin commands (for example, `"command": "check-http.go -u https://sensuapp.org"`)._

## Built-in mutators

Sensu includes built-in mutators to help you customize event pipelines for metrics and alerts.

### Built-in mutator: only_check_output

To process an event, some handlers require only the check output, not the entire event definition.
For example, when sending metrics to Graphite using a TCP handler, Graphite expects data that follows the Graphite plaintext protocol.
By using the built-in `only_check_output` mutator, Sensu reduces the event to only the check output so Graphite can accept it.

To use only check output, include the `only_check_output` mutator in the handler configuration `mutator` string:

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

## Mutator specification

Mutators:

* Accept input/data via `STDIN`
* Can parse JSON event data
* Output JSON data (modified event data) to `STDOUT` or `STDERR`
* Produce an exit status code to indicate state:
  * `0` indicates OK status
  * exit codes other than `0` indicate failure

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][5] resource type. Mutators should always be type `Mutator`.
required     | Required for mutator definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][5].
type         | String
example      | {{< highlight shell >}}"type": "Mutator"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For mutators in this version of Sensu, the `api_version` should always be `core/v2`.
required     | Required for mutator definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][5].
type         | String
example      | {{< highlight shell >}}"api_version": "core/v2"{{< /highlight >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the mutator that includes the `name` and `namespace` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the mutator definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. See the [metadata attributes reference][2] for details.
required     | Required for mutator definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][5].
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
description  | Top-level map that includes the mutator [spec attributes][6].
required     | Required for mutator definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][5].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"spec": {
  "command": "example_mutator.go",
  "timeout": 0,
  "env_vars": [],
  "runtime_assets": []
}
{{< /highlight >}}

### Metadata attributes

| name       |      |
-------------|------
description  | Unique string used to identify the mutator. Mutator names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][7]). Each mutator must have a unique name within its namespace.
required     | true
type         | String
example      | {{< highlight shell >}}"name": "example-mutator"{{< /highlight >}}

| namespace  |      |
-------------|------
description  | Sensu [RBAC namespace][3] that the mutator belongs to.
required     | false
type         | String
default      | `default`
example      | {{< highlight shell >}}"namespace": "production"{{< /highlight >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with event data that you can use for response and dashboard view filtering.<br><br>If you include labels in your event data, you can filter [API responses][8], [sensuctl responses][9], and [dashboard views][11] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}}"labels": {
  "environment": "development",
  "region": "us-west-2"
}{{< /highlight >}}

| annotations | |
-------------|------
description  | Non-identifying metadata to include with event data that you can access with [event filters][10]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][8], [sensuctl response filtering][9], or [dashboard views][11].
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}} "annotations": {
  "managed-by": "ops",
  "playbook": "www.example.url"
}{{< /highlight >}}

### Spec attributes

command      | 
-------------|------ 
description  | Mutator command to be executed by the Sensu backend. 
required     | true
type         | String
example      | {{< highlight shell >}}"command": "/etc/sensu/plugins/mutated.go"{{</highlight>}}

env_vars      | 
-------------|------
description  | Array of environment variables to use with command execution.
required     | false
type         | Array
example      | {{< highlight shell >}}"env_vars": ["RUBY_VERSION=2.5.0"]{{< /highlight >}}

timeout      | 
-------------|------ 
description  | Mutator execution duration timeout (hard stop). In seconds.
required     | false 
type         | integer 
example      | {{< highlight shell >}}"timeout": 30{{</highlight>}}

runtime_assets | 
---------------|------
description    | Array of [Sensu assets][1] (by their names) required at runtime for execution of the `command`.
required       | false
type           | Array
example        | {{< highlight shell >}}"runtime_assets": ["ruby-2.5.0"]{{< /highlight >}}

## Examples

### Example mutator definition

The following Sensu mutator definition uses an imaginary Sensu plugin, `example_mutator.go`, to modify event data prior to handling the event.

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

[1]: ../assets/
[2]: #metadata-attributes
[3]: ../rbac#namespaces
[4]: ../../guides/install-check-executables-with-assets/
[5]: ../../sensuctl/reference#create-resources
[6]: #spec-attributes
[7]: https://regex101.com/r/zo9mQU/2
[8]: ../../api/overview#response-filtering
[9]: ../../sensuctl/reference#response-filters
[10]: ../filters/
[11]: ../../dashboard/filtering#filter-with-label-selectors
