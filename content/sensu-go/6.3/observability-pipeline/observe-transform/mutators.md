---
title: "Mutators reference"
linkTitle: "Mutators Reference"
reference_title: "Mutators"
type: "reference"
description: "As part of the event pipeline, mutators let you transform observability event data before applying handlers. Read the reference doc to learn about mutators."
product: "Sensu Go"
weight: 10
version: "6.3"
platformContent: false 
menu:
  sensu-go-6.3:
    parent: observe-transform
---

Sensu executes mutators during the **[transform][16]** stage of the [observability pipeline][17].

Handlers can specify a mutator to execute and transform observability event data before any handlers are applied.
When the Sensu backend processes an event, it checks the handler for the presence of a mutator and executes that mutator before executing the handler.

Mutators produce an exit status code to indicate state.
A code of `0` indicates OK status.
If the mutator executes successfully (returns an exit status code of `0`), the modified event data return to the handler and the handler is executed.

Exit codes other than `0` indicate failure.
If the mutator fails to execute (returns a non-zero exit status code or fails to complete within its configured timeout), an error is logged and the handler will not execute.

Mutators accept input/data via `STDIN` and can parse JSON event data.
They output JSON data (modified event data) to `STDOUT` or `STDERR`.

## Mutator examples

This example shows a mutator resource definition with the minimum required attributes:

{{< language-toggle >}}

{{< code yml >}}
type: Mutator
api_version: core/v2
metadata:
  name: mutator_minimum
  namespace: default
spec:
  command: example_mutator.go
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

The following mutator definition uses an imaginary Sensu plugin, `example_mutator.go`, to modify event data prior to handling the event:

{{< language-toggle >}}

{{< code yml >}}
---
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
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

## Commands

Each Sensu mutator definition defines a command to be executed.
Mutator commands are executable commands that will be executed on a Sensu backend, run as the `sensu` user.
Most mutator commands are provided by [Sensu plugins][4].

Sensu mutator `command` attributes may include command line arguments for controlling the behavior of the `command` executable.
Many Sensu mutator plugins provide support for command line arguments for reusability.

All mutator commands are executed by a Sensu backend as the `sensu` user.
Commands must be executable files that are discoverable on the Sensu backend system (installed in a system `$PATH` directory).

{{% notice note %}}
**NOTE**: By default, Sensu installer packages will modify the system `$PATH` for the Sensu processes to include `/etc/sensu/plugins`.
As a result, executable scripts (like plugins) located in `/etc/sensu/plugins` will be valid commands.
This allows `command` attributes to use “relative paths” for Sensu plugin commands (for example, `"command": "check-http.go -u https://sensuapp.org"`).
{{% /notice %}}

## Built-in mutators

Sensu includes built-in mutators to help you customize event pipelines for metrics and alerts.

### Built-in mutator: only_check_output

To process an event, some handlers require only the check output, not the entire event definition.
For example, when sending metrics to Graphite using a TCP handler, Graphite expects data that follows the Graphite plaintext protocol.
By using the built-in `only_check_output` mutator, Sensu reduces the event to only the check output so Graphite can accept it.

To use only check output, include the `only_check_output` mutator in the handler configuration `mutator` string:

{{< language-toggle >}}

{{< code yml >}}
---
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
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

## Mutator specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][5] resource type. Mutators should always be type `Mutator`.
required     | Required for mutator definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][5].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: Mutator
{{< /code >}}
{{< code json >}}
{
  "type": "Mutator"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For mutators in this version of Sensu, the `api_version` should always be `core/v2`.
required     | Required for mutator definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][5].
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
description  | Top-level collection of metadata about the mutator that includes `name`, `namespace`, and `created_by` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the mutator definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. Review the [metadata attributes reference][2] for details.
required     | Required for mutator definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][5].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: example-mutator
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
    "name": "example-mutator",
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
description  | Top-level map that includes the mutator [spec attributes][6].
required     | Required for mutator definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][5].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  command: example_mutator.go
  timeout: 0
  env_vars: []
  runtime_assets: []
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "command": "example_mutator.go",
    "timeout": 0,
    "env_vars": [],
    "runtime_assets": []
  }
}
{{< /code >}}
{{< /language-toggle >}}

### Metadata attributes

| name       |      |
-------------|------
description  | Unique string used to identify the mutator. Mutator names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][7]). Each mutator must have a unique name within its namespace.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: example-mutator
{{< /code >}}
{{< code json >}}
{
  "name": "example-mutator"
}
{{< /code >}}
{{< /language-toggle >}}

| namespace  |      |
-------------|------
description  | Sensu [RBAC namespace][3] that the mutator belongs to.
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

| created_by |      |
-------------|------
description  | Username of the Sensu user who created the mutator or last updated the mutator. Sensu automatically populates the `created_by` field when the mutator is created or updated.
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
description  | Custom attributes to include with event data that you can use for response and web UI view filtering.<br><br>If you include labels in your event data, you can filter [API responses][8], [sensuctl responses][9], and [web UI views][13] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
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

| annotations | |
-------------|------
description  | Non-identifying metadata to include with event data that you can access with [event filters][12]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][8], [sensuctl response filtering][9], or [web UI views][15].
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

### Spec attributes

command      | 
-------------|------ 
description  | Mutator command to be executed by the Sensu backend. 
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
command: /etc/sensu/plugins/mutated.go
{{< /code >}}
{{< code json >}}
{
  "command": "/etc/sensu/plugins/mutated.go"
}
{{< /code >}}
{{< /language-toggle >}}

timeout      | 
-------------|------ 
description  | Mutator execution duration timeout (hard stop). In seconds.
required     | false 
type         | integer 
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

env_vars      | 
-------------|------
description  | Array of environment variables to use with command execution.
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
env_vars:
- RUBY_VERSION=2.5.0
{{< /code >}}
{{< code json >}}
{
  "env_vars": [
    "RUBY_VERSION=2.5.0"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

runtime_assets | 
---------------|------
description    | Array of [Sensu dynamic runtime assets][1] (by their names) required at runtime for execution of the `command`.
required       | false
type           | Array
example        | {{< language-toggle >}}
{{< code yml >}}
runtime_assets:
- ruby-2.5.0
{{< /code >}}
{{< code json >}}
{
  "runtime_assets": [
    "ruby-2.5.0"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

secrets        | 
---------------|------
description    | Array of the name/secret pairs to use with command execution.
required       | false
type           | Array
example        | {{< language-toggle >}}
{{< code yml >}}
secrets:
- name: ANSIBLE_HOST
  secret: sensu-ansible-host
- name: ANSIBLE_TOKEN
  secret: sensu-ansible-token
{{< /code >}}
{{< code json >}}
{
  "secrets": [
    {
      "name": "ANSIBLE_HOST",
      "secret": "sensu-ansible-host"
    },
    {
      "name": "ANSIBLE_TOKEN",
      "secret": "sensu-ansible-token"
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

#### `secrets` attributes

name         | 
-------------|------
description  | Name of the [secret][10] defined in the executable command. Becomes the environment variable presented to the mutator. Read [Use secrets management in Sensu][14] for more information.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: ANSIBLE_HOST
{{< /code >}}
{{< code json >}}
{
  "name": "ANSIBLE_HOST"
}
{{< /code >}}
{{< /language-toggle >}}

secret       | 
-------------|------
description  | Name of the Sensu secret resource that defines how to retrieve the [secret][10].
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
secret: sensu-ansible-host
{{< /code >}}
{{< code json >}}
{
  "secret": "sensu-ansible-host"
}
{{< /code >}}
{{< /language-toggle >}}

## Mutator that uses secrets management

Learn more about [secrets management][14] for your Sensu configuration in the [secrets][10] and [secrets providers][11] references.

{{< language-toggle >}}

{{< code yml >}}
---
type: Mutator 
api_version: core/v2 
metadata:
  name: ansible-tower
  namespace: ops
spec: 
  command: sensu-ansible-mutator -h $ANSIBLE_HOST -t $ANSIBLE_TOKEN
  secrets:
  - name: ANSIBLE_HOST
    secret: sensu-ansible-host
  - name: ANSIBLE_TOKEN
    secret: sensu-ansible-token
{{< /code >}}

{{< code json >}}
{
  "type": "Mutator",
  "api_version": "core/v2",
  "metadata": {
    "name": "ansible-tower",
    "namespace": "ops"
  },
  "spec": {
    "command": "sensu-ansible-mutator -h $ANSIBLE_HOST -t $ANSIBLE_TOKEN",
    "secrets": [
      {
        "name": "ANSIBLE_HOST",
        "secret": "sensu-ansible-host"
      },
      {
        "name": "ANSIBLE_TOKEN",
        "secret": "sensu-ansible-token"
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}


[1]: ../../../plugins/assets/
[2]: #metadata-attributes
[3]: ../../../operations/control-access/namespaces/
[4]: ../../../plugins/use-assets-to-install-plugins/
[5]: ../../../sensuctl/create-manage-resources/#create-resources
[6]: #spec-attributes
[7]: https://regex101.com/r/zo9mQU/2
[8]: ../../../api#response-filtering
[9]: ../../../sensuctl/filter-responses/
[10]: ../../../operations/manage-secrets/secrets/
[11]: ../../../operations/manage-secrets/secrets-providers/
[12]: ../../observe-filter/filters/
[13]: ../../../web-ui/search#search-for-labels
[14]: ../../../operations/manage-secrets/secrets-management/
[15]: ../../../web-ui/search/
[16]: ../
[17]: ../../../observability-pipeline/
