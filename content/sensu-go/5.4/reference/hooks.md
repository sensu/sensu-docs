---
title: "Hooks"
description: "Check hooks allow you to automate data collection routinely performed by manually investigating monitoring alerts, freeing precious operator time! Read the reference doc to learn about hooks."
weight: 10
version: "5.4"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.4:
    parent: reference
---

- [Specification](#hooks-specification)
- [Examples](#examples)

## How do hooks work?

Hooks are executed in response to the result of a check command execution
and based on the exit status code of that command (ex: `1`).
Hook commands can optionally receive JSON serialized Sensu client data via
STDIN.
You can create, manage, and reuse hooks independently of checks.

### Check response types

Each **type** of response (ex: `non-zero`) can contain one or more hooks, and
correspond to one or more exit status code. Hooks are executed, in order of
precedence, based on their type:

1. `1` to `255`
2. `ok`
3. `warning`
4. `critical`
5. `unknown`
6. `non-zero`

You can assign one or more hooks to a check in the check definition.
See the [check specification][6] to configure the `check_hooks` attribute.

### Check hooks

The hook command output, status, executed timestamp and duration are captured
and published in the resulting event.

## Hooks specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute specifying the [`sensuctl create`][sc] resource type. Hooks should always be of type `HookConfig`.
required     | Required for hook definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"type": "HookConfig"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute specifying the Sensu API group and version. For hooks in Sensu backend version 5.4, this attribute should always be `core/v2`.
required     | Required for hook definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"api_version": "core/v2"{{< /highlight >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the hook, including the `name` and `namespace` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the hook definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope.  See the [metadata attributes reference][2] for details.
required     | Required for hook definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"metadata": {
  "name": "process_tree",
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
description  | Top-level map that includes the hook [spec attributes][sp].
required     | Required for handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"spec": {
  "command": "ps aux",
  "timeout": 60,
  "stdin": false
}
{{< /highlight >}}

### Spec attributes

command      | 
-------------|------
description  | The hook command to be executed.
required     | true
type         | String
example      | {{< highlight shell >}}"command": "sudo /etc/init.d/nginx start"{{< /highlight >}}

timeout      | 
-------------|------
description  | The hook execution duration timeout in seconds (hard stop).
required     | false
type         | Integer
default      | 60
example      | {{< highlight shell >}}"timeout": 30{{< /highlight >}}

stdin        | 
-------------|------
description  | If the Sensu agent writes JSON serialized Sensu entity and check data to the command process’ STDIN. The command must expect the JSON data via STDIN, read it, and close STDIN. This attribute cannot be used with existing Sensu check plugins, nor Nagios plugins etc, as Sensu agent will wait indefinitely for the hook process to read and close STDIN.
required     | false
type         | Boolean
default      | false
example      | {{< highlight shell >}}"stdin": true{{< /highlight >}}

### Metadata attributes

| name       |      |
-------------|------
description  | A unique string used to identify the hook. Hook names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2)). Each hook must have a unique name within its namespace.
required     | true
type         | String
example      | {{< highlight shell >}}"name": "process_tree"{{< /highlight >}}

| namespace  |      |
-------------|------
description  | The Sensu [RBAC namespace][3] that this hook belongs to.
required     | false
type         | String
default      | `default`
example      | {{< highlight shell >}}"namespace": "production"{{< /highlight >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with event data, which can be queried like regular attributes. You can use labels to organize hooks into meaningful collections that can be selected using [filters][4] and [tokens][5].
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores, but must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}}"labels": {
  "environment": "development",
  "region": "us-west-2"
}{{< /highlight >}}

| annotations |     |
-------------|------
description  | Arbitrary, non-identifying metadata to include with event data. In contrast to labels, annotations are _not_ used internally by Sensu and cannot be used to identify hooks. You can use annotations to add data that helps people or external tools interacting with Sensu.
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}} "annotations": {
  "managed-by": "ops",
  "slack-channel": "#monitoring",
  "playbook": "www.example.url"
}{{< /highlight >}}

## Examples

### Rudimentary auto-remediation

Hooks can be used for rudimentary auto-remediation tasks, for example, starting
a process that is no longer running.

_NOTE: Using hooks for auto-remediation should be approached
carefully, as they run without regard to the number of event
occurrences._

{{< highlight json >}}
{
  "type": "HookConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "restart_nginx",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "spec": {
    "command": "sudo systemctl start nginx",
    "timeout": 60,
    "stdin": false
  }
}
{{< /highlight >}}

### Capture the process tree

Hooks can also be used for automated data gathering for incident triage, for
example, a check hook could be used to capture the process tree when a process
has been determined to be not running etc.

{{< highlight json >}}
{
  "type": "HookConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "process_tree",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "spec": {
    "command": "ps aux",
    "timeout": 60,
    "stdin": false
  }
}
{{< /highlight >}}

[1]: https://blog.sensuapp.org/using-check-hooks-a739a362961f
[2]: #metadata-attributes
[3]: ../rbac#namespaces
[4]: ../filters
[5]: ../tokens
[6]: ../checks#check-hooks-attribute
[sc]: ../../sensuctl/reference#creating-resources
[sp]: #spec-attributes
