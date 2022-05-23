---
title: "Hooks reference"
linkTitle: "Hooks Reference"
reference_title: "Hooks"
type: "reference"
description: "Read this reference to free up precious operator time with hooks, which allow you to automate data collection that operators would typically perform manually."
weight: 40
version: "6.7"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.7:
    parent: observe-schedule
---

Hooks are reusable commands the agent executes in response to a check result before creating an observability event.
You can create, manage, and reuse hooks independently of checks.
Hooks enrich observability event context by gathering relevant information based on the exit status code of a check (ex: `1`).
Hook commands can also receive JSON serialized Sensu client data via stdin.

## Hook example

You can use hooks to automate data gathering for incident triage.
This example demonstrates a check hook to capture the process tree when a process is not running:

{{< language-toggle >}}

{{< code yml >}}
---
type: HookConfig
api_version: core/v2
metadata:
  name: process_tree
spec:
  command: ps aux
  stdin: false
  timeout: 60
  runtime_assets: null
{{< /code >}}

{{< code json >}}
{
  "type": "HookConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "process_tree"
  },
  "spec": {
    "command": "ps aux",
    "timeout": 60,
    "stdin": false,
    "runtime_assets": null
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Check response types

Each **type** of response (ex: `non-zero`) can contain one or more hooks and correspond to one or more exit status codes.
Hooks are executed in order of precedence, based on their type:

1. `1` to `255`
2. `ok`
3. `warning`
4. `critical`
5. `unknown`
6. `non-zero`

You can assign one or more hooks to a check in the check definition.
review the [check specification][6] to configure the `check_hooks` attribute.

## Check hooks

Sensu captures the hook command output, status, executed timestamp, and duration and publishes them in the resulting event.

You can use `sensuctl` to view hook command data:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl event info <entity_name> <check_name> --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl event info <entity_name> <check_name> --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The response lists the specified event, which includes the hook command data:

{{< language-toggle >}}

{{< code yml >}}
---
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
{{< /code >}}

{{< code json >}}
{
  "type": "Event",
  "api_version": "core/v2",
  "metadata": {
    "namespace": "default"
  },
  "spec": {
    "check": {
      "...": "...",
      "hooks": [
        {
          "command": "df -hT / | grep '/'",
          "duration": 0.002904412,
          "executed": 1559948435,
          "issued": 0,
          "metadata": {
            "name": "root_disk",
            "namespace": "default"
          },
          "output": "/dev/mapper/centos-root xfs    41G  1.6G   40G   4% /\n",
          "status": 0,
          "stdin": false,
          "timeout": 60
        }
      ]
    }
  }
}
{{< /code >}}

{{< /language-toggle >}}

{{% notice protip %}}
**PRO TIP**: You can also [view complete resource definitions in the Sensu web UI](../../../web-ui/view-manage-resources/#view-resource-data-in-the-web-ui).
{{% /notice %}}

## Hook specification

### Top-level attributes

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For hooks in this version of Sensu, the `api_version` should always be `core/v2`.
required     | Required for hook definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][1].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: core/v2
{{< /code >}}
{{< code json >}}
{
  "api_version": "core/v2"
}
{{< /code >}}
{{< /language-toggle >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the hook that includes `name`, `namespace`, and `created_by` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the hook definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. Read [metadata attributes][2] for details.
required     | Required for hook definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][1].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: process_tree
  namespace: default
  created_by: admin
  labels:
    region: us-west-1
  annotations:
    slack-channel: "#monitoring"
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "name": "process_tree",
    "namespace": "default",
    "created_by": "admin",
    "labels": {
      "region": "us-west-1"
    },
    "annotations": {
      "slack-channel": "#monitoring"
    }
  }
}
{{< /code >}}
{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes the hook [spec attributes][9].
required     | Required for hook definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][1].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  command: ps aux
  timeout: 60
  stdin: false
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "command": "ps aux",
    "timeout": 60,
    "stdin": false
  }
}
{{< /code >}}
{{< /language-toggle >}}

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][1] resource type. Hooks should always be type `HookConfig`.
required     | Required for hook definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][1].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: HookConfig
{{< /code >}}
{{< code json >}}
{
  "type": "HookConfig"
}
{{< /code >}}
{{< /language-toggle >}}

### Metadata attributes

| annotations |     |
-------------|------
description  | Non-identifying metadata to include with observation event data that you can access with [event filters][4]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][10], [sensuctl response filtering][11], or [web UI views][13].
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
annotations:
  managed-by: ops
  playbook: www.example.url
{{< /code >}}
{{< code json >}}
{
  "annotations": {
    "managed-by": "ops",
    "playbook": "www.example.url"
  }
}
{{< /code >}}
{{< /language-toggle >}}

| created_by |      |
-------------|------
description  | Username of the Sensu user who created the hook or last updated the hook. Sensu automatically populates the `created_by` field when the hook is created or updated.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
created_by: admin
{{< /code >}}
{{< code json >}}
{
  "created_by": "admin"
}
{{< /code >}}
{{< /language-toggle >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with observation event data that you can use for response and web UI view filtering.<br><br>If you include labels in your event data, you can filter [API responses][10], [sensuctl responses][11], and [web UI views][12] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
labels:
  environment: development
  region: us-west-2
{{< /code >}}
{{< code json >}}
{
  "labels": {
    "environment": "development",
    "region": "us-west-2"
  }
}
{{< /code >}}
{{< /language-toggle >}}

| name       |      |
-------------|------
description  | Unique string used to identify the hook. Hook names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][8]). Each hook must have a unique name within its namespace.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: process_tree
{{< /code >}}
{{< code json >}}
{
  "name": "process_tree"
}
{{< /code >}}
{{< /language-toggle >}}

| namespace  |      |
-------------|------
description  | The Sensu [RBAC namespace][3] that this hook belongs to.
required     | false
type         | String
default      | `default`
example      | {{< language-toggle >}}
{{< code yml >}}
namespace: production
{{< /code >}}
{{< code json >}}
{
  "namespace": "production"
}
{{< /code >}}
{{< /language-toggle >}}

### Spec attributes

command      | 
-------------|------
description  | Hook command to be executed.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
command: sudo /etc/init.d/nginx start
{{< /code >}}
{{< code json >}}
{
  "command": "sudo /etc/init.d/nginx start"
}
{{< /code >}}
{{< /language-toggle >}}

|runtime_assets |   |
-------------|------
description  | Array of [Sensu dynamic runtime assets][5] (by their names) required at runtime for execution of the `command`.
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
runtime_assets:
- log-context
{{< /code >}}
{{< code json >}}
{
  "runtime_assets": [
    "log-context"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

stdin        | 
-------------|------
description  | If `true`, the Sensu agent writes JSON serialized Sensu entity and check data to the command process stdin. Otherwise, `false`. The command must expect the JSON data via stdin, read it, and close stdin. This attribute cannot be used with existing Sensu check plugins or Nagios plugins because the Sensu agent will wait indefinitely for the hook process to read and close stdin.
required     | false
type         | Boolean
default      | `false`
example      | {{< language-toggle >}}
{{< code yml >}}
stdin: true
{{< /code >}}
{{< code json >}}
{
  "stdin": true
}
{{< /code >}}
{{< /language-toggle >}}

timeout      | 
-------------|------
description  | Hook execution duration timeout (hard stop). In seconds.
required     | false
type         | Integer
default      | 60
example      | {{< language-toggle >}}
{{< code yml >}}
timeout: 30
{{< /code >}}
{{< code json >}}
{
  "timeout": 30
}
{{< /code >}}
{{< /language-toggle >}}

## Hook for rudimentary auto-remediation

You can use hooks for rudimentary auto-remediation tasks, such as starting a process that is no longer running.

{{% notice note %}}
**NOTE**: Use caution with this approach. Hooks used for auto-remediation will run without regard to the number of event occurrences.
{{% /notice %}}

{{< language-toggle >}}

{{< code yml >}}
---
type: HookConfig
api_version: core/v2
metadata:
  name: restart_nginx
spec:
  command: sudo systemctl start nginx
  stdin: false
  timeout: 60
{{< /code >}}

{{< code json >}}
{
  "type": "HookConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "restart_nginx"
  },
  "spec": {
    "command": "sudo systemctl start nginx",
    "timeout": 60,
    "stdin": false
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Hook that uses token substitution

You can create check hooks that use [token substitution][7] so you can fine-tune check attributes on a per-entity level and re-use the check definition.

{{% notice note %}}
**NOTE**: Token substitution uses entity-scoped metadata, so make sure to set labels at the entity level.
{{% /notice %}}

{{< language-toggle >}}

{{< code yml >}}
---
type: HookConfig
api_version: core/v2
metadata:
  labels:
    foo: bar
  name: tokensub
spec:
  command: tokensub {{ .labels.foo }}
  stdin: false
  timeout: 60
{{< /code >}}

{{< code json >}}
{
   "type": "HookConfig",
   "api_version": "core/v2",
   "metadata": {
      "labels": {
         "foo": "bar"
      },
      "name": "tokensub"
   },
   "spec": {
      "command": "tokensub {{ .labels.foo }}",
      "stdin": false,
      "timeout": 60
   }
}
{{< /code >}}

{{< /language-toggle >}}


[1]: ../../../sensuctl/create-manage-resources/#create-resources
[2]: #metadata-attributes
[3]: ../../../operations/control-access/namespaces/
[4]: ../../observe-filter/filters/
[5]: ../../../plugins/assets/
[6]: ../checks#check-hooks-attribute
[7]: ../tokens/
[8]: https://regex101.com/r/zo9mQU/2
[9]: #spec-attributes
[10]: ../../../api/#response-filtering
[11]: ../../../sensuctl/filter-responses/
[12]: ../../../web-ui/search#search-for-labels
[13]: ../../../web-ui/search
