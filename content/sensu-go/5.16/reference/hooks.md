---
title: "Hooks"
description: "Check hooks allow you to automate data collection that operators would typically perform by investigating monitoring alerts manually. Hooks help free up precious operator time. Read the reference doc to learn about hooks."
weight: 120
version: "5.16"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.16:
    parent: reference
---

- [Check response types](#check-response-types)
- [Check hooks](#check-hooks)
- [Hook specification](#hook-specification)
  - [Top-level attributes](#top-level-attributes) | [Metadata attributes](#metadata-attributes) | [Spec attributes](#spec-attributes)
- [Examples](#examples)
  - [Rudimentary auto-rememdiation](#rudimentary-auto-remediation)
  - [Capture the process tree](#capture-the-process-tree)
  - [Check hook using token substitution](#check-hook-using-token-substitution)

Hooks are executed in response to the result of a check command execution and based on the exit status code of that command (ex: `1`).
Hook commands can also receive JSON serialized Sensu client data via `STDIN`.
You can create, manage, and reuse hooks independently of checks.

## Check response types

Each **type** of response (ex: `non-zero`) can contain one or more hooks and correspond to one or more exit status codes. Hooks are executed in order of precedence, based on their type:

1. `1` to `255`
2. `ok`
3. `warning`
4. `critical`
5. `unknown`
6. `non-zero`

You can assign one or more hooks to a check in the check definition.
See the [check specification][6] to configure the `check_hooks` attribute.

## Check hooks

Sensu captures the hook command output, status, executed timestamp, and duration and publishes them in the resulting event.

You can use `sensuctl` to view hook command data:

{{< highlight shell >}}
sensuctl event info entity_name check_name --format yaml
{{< /highlight >}}

{{< highlight shell >}}
type: Event
api_version: core/v2
metadata:
  namespace: default
spec:
  check:
    ...
    hooks:
    - command: df -hT / | grep '/'
      duration: 0.002904412
      executed: 1559948435
      issued: 0
      metadata:
        name: root_disk
        namespace: default
      output: "/dev/mapper/centos-root xfs    41G  1.6G   40G   4% /\n"
      status: 0
      stdin: false
      timeout: 60
{{< /highlight >}}

## Hook specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][1] resource type. Hooks should always be type `HookConfig`.
required     | Required for hook definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][1].
type         | String
example      | {{< highlight shell >}}"type": "HookConfig"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For hooks in this version of Sensu, the `api_version` should always be `core/v2`.
required     | Required for hook definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][1].
type         | String
example      | {{< highlight shell >}}"api_version": "core/v2"{{< /highlight >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the hook that includes the `name` and `namespace` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the hook definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. See [metadata attributes][2] for details.
required     | Required for hook definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][1].
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
description  | Top-level map that includes the hook [spec attributes][9].
required     | Required for hook definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][1].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"spec": {
  "command": "ps aux",
  "timeout": 60,
  "stdin": false
}
{{< /highlight >}}

### Metadata attributes

| name       |      |
-------------|------
description  | Unique string used to identify the hook. Hook names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][8]). Each hook must have a unique name within its namespace.
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
description  | Custom attributes to include with event data, which you can access with [event filters][4].<br><br>In contrast to annotations, you can use labels to create meaningful collections that you can select with [API response filtering][10] and [sensuctl response filtering][11]. Overusing labels can affect Sensu's internal performance, so we recommend moving complex, non-identifying metadata to annotations.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}}"labels": {
  "environment": "development",
  "region": "us-west-2"
}{{< /highlight >}}

| annotations |     |
-------------|------
description  | Non-identifying metadata to include with event data, which you can access with [event filters][4]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][10] or [sensuctl response filtering][11], and annotations do not affect Sensu's internal performance.
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
description  | Hook command to be executed.
required     | true
type         | String
example      | {{< highlight shell >}}"command": "sudo /etc/init.d/nginx start"{{< /highlight >}}

timeout      | 
-------------|------
description  | Hook execution duration timeout (hard stop). In seconds.
required     | false
type         | Integer
default      | 60
example      | {{< highlight shell >}}"timeout": 30{{< /highlight >}}

stdin        | 
-------------|------
description  | If `true`, the Sensu agent writes JSON serialized Sensu entity and check data to the command process `STDIN`. Otherwise, `false`. The command must expect the JSON data via STDIN, read it, and close STDIN. This attribute cannot be used with existing Sensu check plugins or Nagios plugins because the Sensu agent will wait indefinitely for the hook process to read and close STDIN.
required     | false
type         | Boolean
default      | `false`
example      | {{< highlight shell >}}"stdin": true{{< /highlight >}}

|runtime_assets |   |
-------------|------
description  | Array of [Sensu assets][5] (by their names) required at runtime for execution of the `command`.
required     | false
type         | Array
example      | {{< highlight shell >}}"runtime_assets": ["log-context"]{{< /highlight >}}

## Examples

### Rudimentary auto-remediation

You can use hooks for rudimentary auto-remediation tasks, such as starting a process that is no longer running.

_**NOTE**: Use caution with this approach. Hooks used for auto-remediation will run without regard to the number of event occurrences._

{{< language-toggle >}}

{{< highlight yml >}}
type: HookConfig
api_version: core/v2
metadata:
  annotations: null
  labels: null
  name: restart_nginx
  namespace: default
spec:
  command: sudo systemctl start nginx
  stdin: false
  timeout: 60
{{< /highlight >}}

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

{{< /language-toggle >}}

### Capture the process tree

You can use hooks to automate data gathering for incident triage, For example, you can use a check hook to capture the process tree when a process is not running.

{{< language-toggle >}}

{{< highlight yml >}}
type: HookConfig
api_version: core/v2
metadata:
  annotations: null
  labels: null
  name: process_tree
  namespace: default
spec:
  command: ps aux
  stdin: false
  timeout: 60
  runtime_assets: null
{{< /highlight >}}

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
    "stdin": false,
    "runtime_assets": null
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

### Check hook using token substitution

You can create check hooks that use [token substitution][7] so you can fine-tune check attributes on a per-entity level and re-use the check definition.

_**NOTE**: Token substitution uses entity-scoped metadata, so make sure to set labels at the entity level._

{{< language-toggle >}}

{{< highlight yml >}}
type: HookConfig
api_version: core/v2
metadata:
  annotations: null
  labels:
    foo: bar
  name: tokensub
  namespace: default
spec:
  command: tokensub {{ .labels.foo }}
  stdin: false
  timeout: 60
{{< /highlight >}}

{{< highlight json >}}
{
   "type": "HookConfig",
   "api_version": "core/v2",
   "metadata": {
      "annotations": null,
      "labels": {
         "foo": "bar"
      },
      "name": "tokensub",
      "namespace": "default"
   },
   "spec": {
      "command": "tokensub {{ .labels.foo }}",
      "stdin": false,
      "timeout": 60
   }
}
{{< /highlight >}}

{{< /language-toggle >}}

[1]: ../../sensuctl/reference#create-resources
[2]: #metadata-attributes
[3]: ../rbac#namespaces
[4]: ../filters/
[5]: ../assets/
[6]: ../checks#check-hooks-attribute
[7]: ../tokens/
[8]: https://regex101.com/r/zo9mQU/2
[9]: #spec-attributes
[10]: ../../api/overview#response-filtering
[11]: ../../sensuctl/reference#filters
