---
title: "Mutators reference"
linkTitle: "Mutators Reference"
reference_title: "Mutators"
type: "reference"
description: "As part of the event pipeline, mutators let you transform observability event data before applying handlers. Read the reference doc to learn about mutators."
product: "Sensu Go"
weight: 10
version: "6.13"
platformContent: false 
menu:
  sensu-go-6.13:
    parent: observe-transform
---

Sensu executes mutators during the **[transform][16]** stage of the [observability pipeline][17].

[Pipelines][27] can specify a mutator to execute and transform observability event data before any handlers are applied.
When the Sensu backend processes an event, it checks the pipeline for the presence of a mutator and executes that mutator before executing the handler.

Mutators accept input/data via stdin and can parse JSON event data.
They output JSON data (modified event data) to stdout or stderr.

There are two types of mutators: [pipe][21] and [JavaScript][18].

## Pipe mutator examples

This example shows a [pipe mutator][21] resource definition with the minimum required attributes:

{{< language-toggle >}}

{{< code yml >}}
---
type: Mutator
api_version: core/v2
metadata:
  name: mutator_minimum
spec:
  command: example_mutator.go
  type: pipe
{{< /code >}}

{{< code json >}}
{
  "type": "Mutator",
  "api_version": "core/v2",
  "metadata": {
    "name": "mutator_minimum"
  },
  "spec": {
    "command": "example_mutator.go",
    "type": "pipe"
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
  name: example-mutator
spec:
  command: example_mutator.go
  eval: ""
  env_vars: []
  runtime_assets:
  - example-mutator-asset
  secrets: null
  timeout: 0
  type: pipe
{{< /code >}}

{{< code json >}}
{
  "type": "Mutator",
  "api_version": "core/v2",
  "metadata": {
    "name": "example-mutator"
  },  
  "spec": {
    "command": "example_mutator.go",
    "timeout": 0,
    "env_vars": [],
    "runtime_assets": [
      "example-mutator-asset"
    ],
    "secrets": null,
    "type": "pipe",
    "eval": ""
  }
}
{{< /code >}}

{{< /language-toggle >}}

## JavaScript mutator example

[JavaScript mutators][18] use the eval attribute instead of the command attribute.
The eval value must be an ECMAScript 5 (JavaScript) expression.

This example uses a JavaScript mutator to remove event attributes that are not required &mdash; in this case, the check name and entity `app_id` label:

{{< language-toggle >}}

{{< code yml >}}
---
type: Mutator
api_version: core/v2
metadata:
  name: remove_checkname_entitylabel
spec:
  eval: >-
    data = JSON.parse(JSON.stringify(event)); delete data.check.metadata.name;
    delete data.entity.metadata.labels.app_id; return JSON.stringify(data)
  type: javascript
{{< /code >}}

{{< code json >}}
{
  "type": "Mutator",
  "api_version": "core/v2",
  "metadata": {
    "name": "remove_checkname_entitylabel"
  },
  "spec": {
    "eval": "data = JSON.parse(JSON.stringify(event)); delete data.check.metadata.name; delete data.entity.metadata.labels.app_id; return JSON.stringify(data)",
    "type": "javascript"
  }
}
{{< /code >}}

{{< /language-toggle >}}

You can also use JavaScript mutators to do things like [add new attributes][23] and [combine existing attributes into a single new attribute][24].

## Pipe mutators

**Pipe mutators** produce an exit status code to indicate state.
A code of `0` indicates OK status.
If the mutator executes successfully (returns an exit status code of `0`), the modified event data return to the pipeline and the handler is executed.

Exit codes other than `0` indicate failure.
If the mutator fails to execute (returns a non-zero exit status code or fails to complete within its configured timeout), an error is logged and the handler will not execute.

### Pipe mutator commands

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

## JavaScript mutators

Mutators that use JavaScript are an efficient alternative to pipe mutators, which fork a process on each invocation.
JavaScript mutators are evaluated by the [Otto JavaScript VM][19] as JavaScript programs, which enables greater mutator throughput at scale.

JavaScript mutators do not require you to return any value &mdash; you can mutate the events that are passed to the mutator instead.
However, if you do return a value with a JavaScript mutator, it must be a string.
If a JavaScript mutator returns a non-string value (an array, object, integer, or Boolean), an error is recorded in the [Sensu backend log][20].

JavaScript mutators can use dynamic runtime assets as long as they are valid JavaScript assets.

Secrets are not available to JavaScript mutators.
JavaScript mutators cannot look up events from the event store.

### JavaScript mutator eval attribute

Each Sensu JavaScript mutator definition includes the [eval attribute][22], whose value must be an ECMAScript 5 (JavaScript) expression.
JavaScript mutators do not use the command attribute.

All mutator eval expressions are executed by a Sensu backend as the `sensu` user.

JavaScript mutator eval expressions can use the environment variables listed in the [env_vars attribute][25].
For JavaScript mutators, you can define environment variables and list the names of any environment variables that are available in your environment in the env_vars attribute.

## Built-in mutators

Sensu includes built-in mutators to help you customize event pipelines for metrics and alerts.

### Built-in mutator: only_check_output

To process an event, some handlers require only the check output, not the entire event definition.
For example, when sending metrics to Graphite using a TCP handler, Graphite expects data that follows the Graphite plaintext protocol.
By using the built-in `only_check_output` mutator, Sensu reduces the event to only the check output so Graphite can accept it.

To use only check output, include the `only_check_output` mutator in the pipeline `mutator` array:

{{< language-toggle >}}

{{< code yml >}}
---
type: Pipeline
api_version: core/v2
metadata:
  name: graphite_pipeline
spec:
  workflows:
  - name: graphite_check_output
    filters:
    - name: has_metrics
      type: EventFilter
      api_version: core/v2
    mutator:
      name: only_check_output
      type: Mutator
      api_version: core/v2
    handler:
      name: graphite
      type: Handler
      api_version: core/v2
{{< /code >}}

{{< code json >}}
{
  "type": "Pipeline",
  "api_version": "core/v2",
  "metadata": {
    "name": "graphite_pipeline"
  },
  "spec": {
    "workflows": [
      {
        "name": "graphite_check_output",
        "filters": [
          {
            "name": "has_metrics",
            "type": "EventFilter",
            "api_version": "core/v2"
          }
        ],
        "mutator": {
          "name": "only_check_output",
          "type": "Mutator",
          "api_version": "core/v2"
        },
        "handler": {
          "name": "graphite",
          "type": "Handler",
          "api_version": "core/v2"
        }
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Mutator specification

### Top-level attributes

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
  secrets: null
  type: pipe
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "command": "example_mutator.go",
    "timeout": 0,
    "env_vars": [],
    "runtime_assets": [],
    "secrets": null,
    "type": "pipe"
  }
}
{{< /code >}}
{{< /language-toggle >}}

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

### Metadata attributes

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

### Spec attributes

command      | 
-------------|------ 
description  | Mutator command to be executed by the Sensu backend.{{% notice note %}}
**NOTE**: [JavaScript mutators](#javascript-mutators) require the [eval attribute](#eval-attribute) instead of the command attribute.
{{% /notice %}}
required     | true, for pipe mutators
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

<a id="env-vars-attribute"></a>

env_vars      | 
-------------|------
description  | Array of environment variables to use with command or eval expression execution.
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
env_vars:
- APP_VERSION=2.5.0
{{< /code >}}
{{< code json >}}
{
  "env_vars": [
    "APP_VERSION=2.5.0"
  ]
}
{{< /code >}}
{{< /language-toggle >}}<br>As of [Sensu Go 6.5.2][26], for JavaScript mutators, you can list any environment variables that are available in your environment in addition to defining environment variables:<br><br>{{< language-toggle >}}
{{< code yml >}}
env_vars:
- APP_VERSION=2.5.0
- SHELL
{{< /code >}}
{{< code json >}}
{
  "env_vars": [
    "APP_VERSION=2.5.0",
    "SHELL"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

<a id="eval-attribute"></a>

eval         | 
-------------|------ 
description  | ECMAScript 5 (JavaScript) expression to be executed by the Sensu backend.{{% notice note %}}
**NOTE**: Pipe mutators require the [command attribute](#spec-attributes) instead of the eval attribute.
{{% /notice %}}
required     | true, for [JavaScript mutators][18]
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
eval: 'return JSON.stringify({"some stuff": "is here"});'
{{< /code >}}
{{< code json >}}
{
  "eval": "return JSON.stringify({\"some info\": \"is here\"});"
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
- metric-mutator
{{< /code >}}
{{< code json >}}
{
  "runtime_assets": [
    "metric-mutator"
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

timeout      | 
-------------|------ 
description  | Mutator execution duration timeout (hard stop). In seconds.{{% notice warning %}}
**WARNING**: The timeout attribute is available for [JavaScript mutators](#javascript-mutators) but may not work properly if the mutator is in a loop.
{{% /notice %}}
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

type         | 
-------------|------ 
description  | Mutator type.{{% notice note %}}**NOTE**: Make sure to specify the type is `javascript` when you create a JavaScript mutator. If you do not specify the type, Sensu uses `pipe` as the default, expects a command attribute in the mutator definition, and ignores any eval attribute you provide.
{{% /notice %}}
required     | false
type         | String
default      | `pipe`
allowed values | `pipe` and `javascript`
example      | {{< language-toggle >}}
{{< code yml >}}
type: pipe
{{< /code >}}
{{< code json >}}
{
  "type": "pipe"
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

## Use secrets management in a mutator

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

## Add new event attributes with JavaScript mutators

Use a JavaScript mutator to rewrite events with a new attribute added.

This example adds a new "organization" attribute to events at the top level, with a value of `sec_ops`:

{{< language-toggle >}}

{{< code yml >}}
---
type: Mutator
api_version: core/v2
metadata:
  name: add_org_sec_ops
spec:
  eval: >-
    data = JSON.parse(JSON.stringify(event)); data['organization'] = 'sec_ops';
    return JSON.stringify(data)
  type: javascript
{{< /code >}}

{{< code json >}}
{
  "type": "Mutator",
  "api_version": "core/v2",
  "metadata": {
    "created_by": "admin",
    "name": "add_org_sec_ops"
  },
  "spec": {
    "eval": "data = JSON.parse(JSON.stringify(event)); data['organization'] = 'sec_ops'; return JSON.stringify(data)",
    "type": "javascript"
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Combine existing attributes with JavaScript mutators

Use a JavaScript mutator to create a new attribute from a combination of multiple existing attributes and add the new attribute to events.

This example combines the event namespace and the name of the check that generated the event into a single new attribute, `origination`:

{{< language-toggle >}}

{{< code yml >}}
---
type: Mutator
api_version: core/v2
metadata:
  name: add_origination_attribute
spec:
  eval: >-
    data = JSON.parse(JSON.stringify(event)); data.origination =
    data.metadata.namespace + data.check.metadata.name; return
    JSON.stringify(data)
  type: javascript
{{< /code >}}

{{< code json >}}
{
  "type": "Mutator",
  "api_version": "core/v2",
  "metadata": {
    "name": "add_origination_attribute"
  },
  "spec": {
    "eval": "data = JSON.parse(JSON.stringify(event)); data.origination = data.metadata.namespace + data.check.metadata.name; return JSON.stringify(data)",
    "type": "javascript"
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
[8]: ../../../api/#response-filtering
[9]: ../../../sensuctl/filter-responses/
[10]: ../../../operations/manage-secrets/secrets/
[11]: ../../../operations/manage-secrets/secrets-providers/
[12]: ../../observe-filter/filters/
[13]: ../../../web-ui/search#search-for-labels
[14]: ../../../operations/manage-secrets/secrets-management/
[15]: ../../../web-ui/search/
[16]: ../
[17]: ../../../observability-pipeline/
[18]: #javascript-mutators
[19]: https://github.com/robertkrimen/otto
[20]: ../../observe-schedule/backend/#event-logging
[21]: #pipe-mutators
[22]: #eval-attribute
[23]: #add-new-event-attributes-with-javascript-mutators
[24]: #combine-existing-attributes-with-javascript-mutators
[25]: #env-vars-attribute
[26]: ../../../release-notes/#652-release-notes
[27]: ../../observe-process/pipelines/
