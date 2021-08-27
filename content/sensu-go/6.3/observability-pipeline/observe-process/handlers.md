---
title: "Handlers reference"
linkTitle: "Handlers Reference"
reference_title: "Handlers"
type: "reference"
description: "Handlers are actions the Sensu backend executes on events, allowing you to created automated monitoring workflows. Read the reference doc to learn about handlers."
weight: 10
version: "6.3"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.3:
    parent: observe-process
---

Sensu executes handlers during the **[process][22]** stage of the [observability pipeline][29].

Handlers are actions the Sensu backend executes on events.
Several types of handlers are available.
The most common are `pipe` handlers, which work similarly to [checks][1] and enable Sensu to interact with almost any computer program via [standard streams][2].

- **Pipe handlers** send observation data (events) into arbitrary commands via `STDIN`
- **TCP/UDP handlers** send observation data (events) to a remote socket
- **Handler sets** group event handlers and streamline groups of actions to execute for certain types of events (also called "set handlers")

The handler stack concept describes a group of handlers or a handler set that escalates events through a series of different handlers.

Discover, download, and share Sensu handler dynamic runtime assets using [Bonsai][16], the Sensu asset hub.
Read [Use dynamic runtime assets to install plugins][23] to get started.

## Pipe handlers

Pipe handlers are external commands that can consume [event][3] data via STDIN.

### Pipe handler example

This example shows a pipe handler resource definition with the minimum required attributes:

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  name: pipe_handler_minimum
  namespace: default
spec:
  command: command-example
  type: pipe
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "pipe_handler_minimum",
    "namespace": "default"
  },
  "spec": {
    "command": "command-example",
    "type": "pipe"
  }
}
{{< /code >}}

{{< /language-toggle >}}

### Pipe handler command

Pipe handler definitions include a `command` attribute, which is a command for the Sensu backend to execute.

#### Pipe handler command arguments

Pipe handler `command` attributes may include command line arguments for controlling the behavior of the `command` executable.

## TCP/UDP handlers

TCP and UDP handlers enable Sensu to forward event data to arbitrary TCP or UDP sockets for external services to consume.

### TCP/UDP handler example

This handler will send event data to a TCP socket (10.0.1.99:4444) and timeout if an acknowledgement (`ACK`) is not received within 30 seconds:

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  name: tcp_handler
  namespace: default
spec:
  socket:
    host: 10.0.1.99
    port: 4444
  type: tcp
  timeout: 30
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "tcp_handler",
    "namespace": "default"
  },
  "spec": {
    "type": "tcp",
    "timeout": 30,
    "socket": {
      "host": "10.0.1.99",
      "port": 4444
    }
  }
}
{{< /code >}}

{{< /language-toggle >}}

Change the `type` from `tcp` to `udp` to configure a UDP handler:

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  name: udp_handler
  namespace: default
spec:
  socket:
    host: 10.0.1.99
    port: 4444
  type: udp
  timeout: 30
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "udp_handler",
    "namespace": "default"
  },
  "spec": {
    "type": "udp",
    "timeout": 30,
    "socket": {
      "host": "10.0.1.99",
      "port": 4444
    }
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Handler sets

Handler set definitions allow you to use a single named handler set to refer to groups of handlers.
The handler set becomes a collection of individual actions to take (via each included handler) on event data.

For example, suppose you have already created these two handlers:

- `elasticsearch` to send all observation data to Elasticsearch.
- `opsgenie` to send non-OK status alerts to your OpsGenie notification channel.

You can list both of these handlers in a handler set to automate and streamline your workflow, specifying `type: set`:

{{< language-toggle >}}

{{< code yml >}}
type: Handler
api_version: core/v2
metadata:
  name: send_events_notify_operator
  namespace: default
spec:
  handlers:
  - elasticsearch
  - opsgenie
  type: set
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "send_events_notify_operator",
    "namespace": "default"
  },
  "spec": {
    "type": "set",
    "handlers": [
      "elasticsearch",
      "opsgenie"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

Now you can route observation data to Elasticsearch and alerts to OpsGenie with a single handler definition, the `send_events_notify_operator` handler set.

{{% notice note %}}
**NOTE**: Attributes defined in handler sets do not apply to the handlers they include.
For example, `filters` and `mutator` attributes defined in a handler set will have no effect on handlers.
Define these attributes in individual handlers instead.
{{% /notice %}}

## Handler stacks

The handler stack concept refers to a group of handlers or a handler set that escalates events through a series of different handlers.
For example, suppose you want a handler stack with three levels of escalation:

- Level 1: On the first occurrence, attempt remediation.
- Level 2: On the fifth occurrence, send an alert to Slack.
- Level 3: On the tenth occurrence, send an alert to PagerDuty.
Continue to send this alert on every tenth occurrence thereafter until the incident is resolved.

A handler stack for this scenario requires three handlers to take the desired actions based on three corresponding event filters that control the escalation levels:

- Level 1 requires an event filter with the built-in [`is_incident` filter][30] plus an [occurrence-based filter][32] that uses an expression like `event.check.occurrences ==1` and a corresponding remediation handler.
- Level 2 requires an event filter with `is_incident` plus an occurrence-based filter that uses an expression like `event.check.occurrences == 5` and a corresponding Slack handler.
- Level 3 requires an event filter with `is_incident` plus an occurrence-based filter that uses an expression like `event.check.occurrences % 10 == 0` to match event data with an occurrences value that is evenly divisible by 10 via a modulo operator calculation and a corresponding PagerDuty handler.

With these event filters and handlers configured, you can create a [handler set][31] that includes the three handlers in your stack.
You can also list the three handlers in the [handlers array][33] in your check definition instead.

{{% notice protip %}}
**PRO TIP**: This scenario relies on six different resources, three event filters and three handlers, to describe the handler stack concept, but you can use Sensu dynamic runtime assets and integrations to achieve the same escalating alert levels in other ways.<br><br>
For example, you can use the `is_incident` event filter in conjunction with the [Sensu Go Fatigue Check Filter](https://bonsai.sensu.io/assets/sensu/sensu-go-fatigue-check-filter) asset to control event escalation.
Sensu's [Ansible](../../../plugins/supported-integrations/ansible/), [Rundeck](../../../plugins/supported-integrations/rundeck/), and [Saltstack](../../../plugins/supported-integrations/saltstack/) auto-remediation integrations and the [Sensu Remediation Handler](https://bonsai.sensu.io/assets/sensu/sensu-remediation-handler) asset also include built-in occurrence- and severity-based event filtering.
{{% /notice %}}

## Keepalive event handlers

Sensu [keepalives][12] are the heartbeat mechanism used to ensure that all registered [Sensu agents][13] are operational and can reach the [Sensu backend][14].
You can connect keepalive events to your monitoring workflows using a keepalive handler.
Sensu looks for an event handler named `keepalive` and automatically uses it to process keepalive events.

Suppose you want to receive Slack notifications for keepalive alerts, and you already have a [Slack handler set up to process events][15].
To process keepalive events using the Slack pipeline, create a handler set named `keepalive` and add the `slack` handler to the `handlers` array.
The resulting `keepalive` handler set configuration will look like this example:

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  name: keepalive
  namespace: default
spec:
  handlers:
  - slack
  type: set
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "keepalive",
    "namespace": "default"
  },
  "spec": {
    "type": "set",
    "handlers": [
      "slack"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

You can also use the [`keepalive-handlers`][19] flag to send keepalive events to any handler you have configured.
If you do not specify a keepalive handler with the `keepalive-handlers` flag, the Sensu backend will use the default `keepalive` handler and create an event in sensuctl and the Sensu web UI.

## Handler specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][4] resource type. Handlers should always be type `Handler`.
required     | Required for handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: Handler
{{< /code >}}
{{< code json >}}
{
  "type": "Handler"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For handlers in this version of Sensu, the `api_version` should always be `core/v2`.
required     | Required for handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
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
description  | Top-level collection of metadata about the handler that includes `name`, `namespace`, and `created_by` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the handler definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. See [metadata attributes][8] for details.
required     | Required for handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: handler-slack
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
    "name": "handler-slack",
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
description  | Top-level map that includes the handler [spec attributes][5].
required     | Required for handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  type: tcp
  socket:
    host: 10.0.1.99
    port: 4444
  metadata:
    name: tcp_handler
    namespace: default
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "type": "tcp",
    "socket": {
      "host": "10.0.1.99",
      "port": 4444
    },
    "metadata": {
      "name": "tcp_handler",
      "namespace": "default"
    }
  }
}
{{< /code >}}
{{< /language-toggle >}}

### Metadata attributes

| name       |      |
-------------|------
description  | Unique string used to identify the handler. Handler names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][18]). Each handler must have a unique name within its namespace.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name:"handler-slack
{{< /code >}}
{{< code json >}}
{
  "name": "handler-slack"
}
{{< /code >}}
{{< /language-toggle >}}

| namespace  |      |
-------------|------
description  | Sensu [RBAC namespace][9] that the handler belongs to.
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
description  | Username of the Sensu user who created the handler or last updated the handler. Sensu automatically populates the `created_by` field when the handler is created or updated.
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
description  | Custom attributes to include with observation data in events that you can use for response and web UI view filtering.<br><br>If you include labels in your event data, you can filter [API responses][10], [sensuctl responses][11], and [web UI views][25] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
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

| annotations |     |
-------------|------
description  | Non-identifying metadata to include with observation data in events that you can access with [event filters][24]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][10], [sensuctl response filtering][11], or [web UI views][28].
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

type         | 
-------------|------
description  | Handler type.
required     | true
type         | String
allowed values | `pipe`, `tcp`, `udp`, and `set`
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

filters      | 
-------------|------
description  | Array of Sensu event filters (by names) to use when filtering events for the handler. Each array item must be a string.
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
filters:
- occurrences
- production
{{< /code >}}
{{< code json >}}
{
  "filters": [
    "occurrences",
    "production"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

mutator      | 
-------------|------
description  | Name of the Sensu event mutator to use to mutate event data for the handler.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
mutator: only_check_output
{{< /code >}}
{{< code json >}}
{
  "mutator": "only_check_output"
}
{{< /code >}}
{{< /language-toggle >}}

timeout     | 
------------|------
description | Handler execution duration timeout (hard stop). In seconds. Only used by `pipe`, `tcp`, and `udp` handler types.
required    | false
type        | Integer
default     | `60` (for `tcp` and `udp` handlers)
example     | {{< language-toggle >}}
{{< code yml >}}
timeout: 30
{{< /code >}}
{{< code json >}}
{
  "timeout": 30
}
{{< /code >}}
{{< /language-toggle >}}

command      | 
-------------|------
description  | Handler command to be executed. The event data is passed to the process via `STDIN`. {{% notice note %}}
**NOTE**: The `command` attribute is only supported for pipe handlers (that is, handlers configured with `"type": "pipe"`).
{{% /notice %}}
required     | true (if `type` equals `pipe`)
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
command: /etc/sensu/plugins/pagerduty.go
{{< /code >}}
{{< code json >}}
{
  "command": "/etc/sensu/plugins/pagerduty.go"
}
{{< /code >}}
{{< /language-toggle >}}

env_vars      | 
-------------|------
description  | Array of environment variables to use with command execution. {{% notice note %}}
**NOTE**: The `env_vars` attribute is only supported for pipe handlers (that is, handlers configured with `"type": "pipe"`).
{{% /notice %}}
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
env_vars:
- API_KEY=0428d6b8nb51an4d95nbe28nf90865a66af5
{{< /code >}}
{{< code json >}}
{
  "env_vars": [
    "API_KEY=0428d6b8nb51an4d95nbe28nf90865a66af5"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

socket       | 
-------------|------
description  | Scope for [`socket` definition][6] used to configure the TCP/UDP handler socket. {{% notice note %}}
**NOTE**: The `socket` attribute is only supported for TCP/UDP handlers (that is, handlers configured with `"type": "tcp"` or `"type": "udp"`).
{{% /notice %}}
required     | true (if `type` equals `tcp` or `udp`)
type         | Hash
example      | {{< language-toggle >}}
{{< code yml >}}
socket: {}
{{< /code >}}
{{< code json >}}
{
  "socket": {}
}
{{< /code >}}
{{< /language-toggle >}}

handlers     | 
-------------|------
description  | Array of Sensu event handlers (by their names) to use for events using the handler set. Each array item must be a string. {{% notice note %}}
**NOTE**: The `handlers` attribute is only supported for handler sets (that is, handlers configured with `"type": "set"`).
{{% /notice %}}
required     | true (if `type` equals `set`)
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
handlers:
- pagerduty
- email
- ec2
{{< /code >}}
{{< code json >}}
{
  "handlers": [
    "pagerduty",
    "email",
    "ec2"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

runtime_assets | 
---------------|------
description    | Array of [Sensu dynamic runtime assets][7] (by names) required at runtime to execute the `command`
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

#### `socket` attributes

host         | 
-------------|------
description  | Socket host address (IP or hostname) to connect to.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
host: 8.8.8.8
{{< /code >}}
{{< code json >}}
{
  "host": "8.8.8.8"
}
{{< /code >}}
{{< /language-toggle >}}

port         | 
-------------|------
description  | Socket port to connect to.
required     | true
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
port: 4242
{{< /code >}}
{{< code json >}}
{
  "port": 4242
}
{{< /code >}}
{{< /language-toggle >}}

#### `secrets` attributes

name         | 
-------------|------
description  | Name of the [secret][20] defined in the executable command. Becomes the environment variable presented to the check. Read [Use secrets management in Sensu][26] for more information.
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
description  | Name of the Sensu secret resource that defines how to retrieve the [secret][20].
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

## Send Slack alerts

This handler will send alerts to a channel named `monitoring` with the configured webhook URL, using the `handler-slack` executable command.

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  name: slack
  namespace: default
spec:
  command: sensu-slack-handler --channel '#monitoring'
  env_vars:
  - SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
  filters:
  - is_incident
  - not_silenced
  handlers: []
  runtime_assets: []
  timeout: 0
  type: pipe
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "slack",
    "namespace": "default"
  },
  "spec": {
    "command": "sensu-slack-handler --channel '#monitoring'",
    "env_vars": [
      "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
    ],
    "filters": [
      "is_incident",
      "not_silenced"
    ],
    "handlers": [],
    "runtime_assets": [],
    "timeout": 0,
    "type": "pipe"
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Send registration events

If you configure a Sensu event handler named `registration`, the Sensu backend will create and process an event for the agent registration, apply any configured filters and mutators, and execute the registration handler.

You can use registration events to execute one-time handlers for new Sensu agents to update an external configuration management database (CMDB).
This example demonstrates how to configure a registration event handler to create or update a ServiceNow incident or event with the [Sensu Go ServiceNow Handler][17]:

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  name: registration
  namespace: default
spec:
  handlers:
  - servicenow-cmdb
  type: set
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "registration",
    "namespace": "default"
  },
  "spec": {
    "handlers": [
      "servicenow-cmdb"
    ],
    "type": "set"
  }
}
{{< /code >}}

{{< /language-toggle >}}

The [agent reference][27] describes agent registration and registration events in more detail.

## Execute multiple handlers (handler set)

The following example creates a handler set, `notify_all_the_things`, that will execute three handlers: `slack`, `tcp_handler`, and `udp_handler`.

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  name: notify_all_the_things
  namespace: default
spec:
  handlers:
  - slack
  - tcp_handler
  - udp_handler
  type: set
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "notify_all_the_things",
    "namespace": "default"
  },
  "spec": {
    "type": "set",
    "handlers": [
      "slack",
      "tcp_handler",
      "udp_handler"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Use secrets management in a handler

Learn more about [secrets management][26] for your Sensu configuration in the [secrets][20] and [secrets providers][21] references.

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler 
api_version: core/v2 
metadata:
  name: ansible-tower
  namespace: ops
spec: 
  type: pipe
  command: sensu-ansible-handler -h $ANSIBLE_HOST -t $ANSIBLE_TOKEN
  secrets:
  - name: ANSIBLE_HOST
    secret: sensu-ansible-host
  - name: ANSIBLE_TOKEN
    secret: sensu-ansible-token
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "ansible-tower",
    "namespace": "ops"
  },
  "spec": {
    "type": "pipe",
    "command": "sensu-ansible-handler -h $ANSIBLE_HOST -t $ANSIBLE_TOKEN",
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


[1]: ../../observe-schedule/checks/
[2]: https://en.wikipedia.org/wiki/Standard_streams
[3]: ../../observe-events/events/
[4]: ../../../sensuctl/create-manage-resources/#create-resources
[5]: #spec-attributes
[6]: #socket-attributes
[7]: ../../../plugins/assets/
[8]: #metadata-attributes
[9]: ../../../operations/control-access/namespaces/
[10]: ../../../api#response-filtering
[11]: ../../../sensuctl/filter-responses/
[12]: ../../observe-schedule/agent#keepalive-monitoring
[13]: ../../observe-schedule/agent/
[14]: ../../observe-schedule/backend/
[15]: ../send-slack-alerts/
[16]: https://bonsai.sensu.io/
[17]: https://bonsai.sensu.io/assets/sensu/sensu-servicenow-handler/
[18]: https://regex101.com/r/zo9mQU/2
[19]: ../../observe-schedule/agent/#keepalive-handlers-flag
[20]: ../../../operations/manage-secrets/secrets/
[21]: ../../../operations/manage-secrets/secrets-providers/
[22]: ../
[23]: ../../../plugins/use-assets-to-install-plugins/
[24]: ../../observe-filter/filters/
[25]: ../../../web-ui/search#search-for-labels
[26]: ../../../operations/manage-secrets/secrets-management/
[27]: ../../observe-schedule/agent/#registration-endpoint-management-and-service-discovery
[28]: ../../../web-ui/search/
[29]: ../../../observability-pipeline/
[30]: ../../observe-filter/filters/#built-in-filter-is_incident
[31]: #handler-sets
[32]: ../../observe-filter/filters/#filter-for-repeated-events
[33]: ../../observe-schedule/checks/#handlers-array
