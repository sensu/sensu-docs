---
title: "Handlers"
description: "Handlers are actions the Sensu backend executes on events, allowing you to created automated monitoring workflows. Read the reference doc to learn about handlers."
weight: 110
version: "5.16"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.16:
    parent: reference
---

- [Pipe handlers](#pipe-handlers)
- [TCP/UDP handlers](#tcp-udp-handlers)
- [Handler sets](#handler-sets)
- [Keepalive event handlers](#keepalive-event-handlers)
- [Handler specification](#handler-specification)
  - [Top-level attributes](#top-level-attributes) | [Metadata attributes](#metadata-attributes) | [Spec attributes](#spec-attributes) | [`socket` attributes](#socket-attributes)
- [Examples](#handler-examples)

Handlers are actions the Sensu backend executes on events.
Several types of handlers are available.
The most common are `pipe` handlers, which work similarly to [checks][1] and enable Sensu to interact with almost any computer program via [standard streams][2].

- **Pipe handlers** send event data into arbitrary commands via `STDIN`
- **TCP/UDP handlers** send event data to a remote socket
- **Handler sets** group event handlers and streamline groups of actions to execute for certain types of events (also called "set handlers")

Discover, download, and share Sensu handlers assets using [Bonsai][16], the Sensu asset index.
Read [Install plugins with assets][23] to get started.

## Pipe handlers

Pipe handlers are external commands that can consume [event][3] data via STDIN.

#### Pipe handler command

Pipe handler definitions include a `command` attribute, which is a command for the Sensu backend to execute.

#### Pipe handler command arguments

Pipe handler `command` attributes may include command line arguments for controlling the behavior of the `command` executable.

## TCP/UDP handlers

TCP and UDP handlers enable Sensu to forward event data to arbitrary TCP or UDP sockets for external services to consume.

## Handler sets

Handler set definitions allow you to use a single named handler set to refer to groups of handlers (individual collections of actions to take on event data).

_**NOTE**: Attributes defined on handler sets do not apply to the handlers they include. For example, `filters` and `mutator` attributes defined in a handler set will have no effect on handlers._

## Keepalive event handlers

Sensu [keepalives][12] are the heartbeat mechanism used to ensure that all registered [Sensu agents][13] are operational and can reach the [Sensu backend][14].
You can connect keepalive events to your monitoring workflows using a keepalive handler.
Sensu looks for an event handler named `keepalive` and automatically uses it to process keepalive events.

Suppose you want to receive Slack notifications for keepalive alerts, and you already have a [Slack handler set up to process events][15].
To process keepalive events using the Slack pipeline, create a handler set named `keepalive` and add the `slack` handler to the `handlers` array.
The resulting `keepalive` handler set configuration will look like this example:

{{< language-toggle >}}

{{< highlight yml >}}
type: Handler
api_version: core/v2
metadata:
  name: keepalive
  namespace: default
spec:
  handlers:
  - slack
  type: set
{{< /highlight >}}

{{< highlight json >}}
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
{{< /highlight >}}

{{< /language-toggle >}}

## Handler specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][4] resource type. Handlers should always be type `Handler`.
required     | Required for handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | String
example      | {{< highlight shell >}}"type": "Handler"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For handlers in this version of Sensu, the `api_version` should always be `core/v2`.
required     | Required for handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | String
example      | {{< highlight shell >}}"api_version": "core/v2"{{< /highlight >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the handler that includes the `name` and `namespace` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the handler definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. See [metadata attributes][8] for details.
required     | Required for handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"metadata": {
  "name": "handler-slack",
  "namespace": "default",
  "labels": {
    "region": "us-west-1"
  },
  "annotations": {
    "slack-channel": "#monitoring"
  }
}
{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes the handler [spec attributes][5].
required     | Required for handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
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
{{< /highlight >}}

### Metadata attributes

| name       |      |
-------------|------
description  | Unique string used to identify the handler. Handler names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][18]). Each handler must have a unique name within its namespace.
required     | true
type         | String
example      | {{< highlight shell >}}"name": "handler-slack"{{< /highlight >}}

| namespace  |      |
-------------|------
description  | Sensu [RBAC namespace][9] that the handler belongs to.
required     | false
type         | String
default      | `default`
example      | {{< highlight shell >}}"namespace": "production"{{< /highlight >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with event data that you can use for response and dashboard view filtering.<br><br>If you include labels in your event data, you can filter [API responses][10], [sensuctl responses][11], and [dashboard views][25] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}}"labels": {
  "environment": "development",
  "region": "us-west-2"
}{{< /highlight >}}

| annotations |     |
-------------|------
description  | Non-identifying metadata to include with event data that you can access with [event filters][24]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][10], [sensuctl response filtering][11], or [dashboard views][25].
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}} "annotations": {
  "managed-by": "ops",
  "playbook": "www.example.url"
}{{< /highlight >}}

### Spec attributes

type         | 
-------------|------
description  | Handler type.
required     | true
type         | String
allowed values | `pipe`, `tcp`, `udp` & `set`
example      | {{< highlight shell >}}"type": "pipe"{{< /highlight >}}

filters      | 
-------------|------
description  | Array of Sensu event filters (by names) to use when filtering events for the handler. Each array item must be a string.
required     | false
type         | Array
example      | {{< highlight shell >}}"filters": ["occurrences", "production"]{{< /highlight >}}

mutator      | 
-------------|------
description  | Name of the Sensu event mutator to use to mutate event data for the handler.
required     | false
type         | String
example      | {{< highlight shell >}}"mutator": "only_check_output"{{< /highlight >}}

timeout     | 
------------|------
description | Handler execution duration timeout (hard stop). In seconds. Only used by `pipe`, `tcp`, and `udp` handler types.
required    | false
type        | Integer
default     | `60` (for `tcp` and `udp` handlers)
example     | {{< highlight shell >}}"timeout": 30{{< /highlight >}}

command      | 
-------------|------
description  | Handler command to be executed. The event data is passed to the process via `STDIN`. _**NOTE**: The `command` attribute is only supported for pipe handlers (i.e. handlers configured with `"type": "pipe"`)._
required     | true (if `type` equals `pipe`)
type         | String
example      | {{< highlight shell >}}"command": "/etc/sensu/plugins/pagerduty.go"{{< /highlight >}}

env_vars      | 
-------------|------
description  | Array of environment variables to use with command execution. _**NOTE**: The `env_vars` attribute is only supported for pipe handlers (i.e. handlers configured with `"type": "pipe"`)._
required     | false
type         | Array
example      | {{< highlight shell >}}"env_vars": ["API_KEY=0428d6b8nb51an4d95nbe28nf90865a66af5"]{{< /highlight >}}

socket       | 
-------------|------
description  | Scope for [`socket` definition][6] used to configure the TCP/UDP handler socket. _**NOTE**: The `socket` attribute is only supported for TCP/UDP handlers (i.e. handlers configured with `"type": "tcp"` or `"type": "udp"`)._
required     | true (if `type` equals `tcp` or `udp`)
type         | Hash
example      | {{< highlight shell >}}"socket": {}{{< /highlight >}}

handlers     | 
-------------|------
description  | Array of Sensu event handlers (by their names) to use for events using the handler set. Each array item must be a string. _**NOTE**: The `handlers` attribute is only supported for handler sets (i.e. handlers configured with `"type": "set"`)._
required     | true (if `type` equals `set`)
type         | Array
example      | {{< highlight shell >}}"handlers": ["pagerduty", "email", "ec2"]{{< /highlight >}}

runtime_assets | 
---------------|------
description    | Array of [Sensu assets][7] (by names) required at runtime to execute the `command`
required       | false
type           | Array
example        | {{< highlight shell >}}"runtime_assets": ["ruby-2.5.0"]{{< /highlight >}}

### `socket` attributes

host         | 
-------------|------
description  | Socket host address (IP or hostname) to connect to.
required     | true
type         | String
example      | {{< highlight shell >}}"host": "8.8.8.8"{{< /highlight >}}

port         | 
-------------|------
description  | Socket port to connect to.
required     | true
type         | Integer
example      | {{< highlight shell >}}"port": 4242{{< /highlight >}}

## Handler examples

### Minimum required pipe handler attributes

{{< language-toggle >}}

{{< highlight yml >}}
type: Handler
api_version: core/v2
metadata:
  name: pipe_handler_minimum
  namespace: default
spec:
  command: command-example
  type: pipe
{{< /highlight >}}

{{< highlight json >}}
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
{{< /highlight >}}

{{< /language-toggle >}}

### Minimum required TCP/UDP handler attributes

This example demonstrates a `tcp` type handler.
Change the type from `tcp` to `udp` to create the minimum configuration for a `udp` type handler. 

{{< language-toggle >}}

{{< highlight yml >}}
type: Handler
api_version: core/v2
metadata:
  name: tcp_udp_handler_minimum
  namespace: default
spec:
  socket:
    host: 10.0.1.99
    port: 4444
  type: tcp
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "tcp_udp_handler_minimum",
    "namespace": "default"
  },
  "spec": {
    "type": "tcp",
    "socket": {
      "host": "10.0.1.99",
      "port": 4444
    }
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

### Send Slack alerts

This handler will send alerts to a channel named `monitoring` with the configured webhook URL, using the `handler-slack` executable command.

{{< language-toggle >}}

{{< highlight yml >}}
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
{{< /highlight >}}

{{< highlight json >}}
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
{{< /highlight >}}

{{< /language-toggle >}}

### Send event data to a TCP socket

This handler will send event data to a TCP socket (10.0.1.99:4444) and timeout if an acknowledgement (`ACK`) is not received within 30 seconds.

{{< language-toggle >}}

{{< highlight yml >}}
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
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "tcp_handler",
    "namespace": "default"
  },
  "spec": {
    "type": "tcp",
    "socket": {
      "host": "10.0.1.99",
      "port": 4444
    }
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

### Send event data to a UDP socket

This handler will forward event data to a UDP socket (10.0.1.99:4444) and timeout if an acknowledgement (`ACK`) is not received within 30 seconds.

{{< language-toggle >}}

{{< highlight yml >}}
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
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "udp_handler",
    "namespace": "default"
  },
  "spec": {
    "type": "udp",
    "socket": {
      "host": "10.0.1.99",
      "port": 4444
    }
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

### Send registration events

If you configure a Sensu event handler named `registration`, the Sensu backend will create and process an event for the agent registration, apply any configured filters and mutators, and execute the registration handler.

You can use registration events to execute one-time handlers for new Sensu agents to update an external configuration management database (CMDB).
This example demonstrates how to configure a registration event handler to create or update a ServiceNow incident or event with the [Sensu Go ServiceNow Handler][17]:

{{< language-toggle >}}

{{< highlight yml >}}
type: Handler
api_version: core/v2
metadata:
  name: registration
  namespace: default
spec:
  handlers:
  - servicenow-cmdb
  type: set
{{< /highlight >}}

{{< highlight json >}}
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
{{< /highlight >}}

{{< /language-toggle >}}

The [agent reference][27] describes agent registration and registration events in more detail.

### Execute multiple handlers

The following example handler will execute three handlers: `slack`, `tcp_handler`, and `udp_handler`.

{{< language-toggle >}}

{{< highlight yml >}}
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
{{< /highlight >}}

{{< highlight json >}}
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
{{< /highlight >}}

{{< /language-toggle >}}

[1]: ../checks/
[2]: https://en.wikipedia.org/wiki/Standard_streams
[3]: ../events/
[4]: ../../sensuctl/reference#create-resources
[5]: #spec-attributes
[6]: #socket-attributes
[7]: ../assets/
[8]: #metadata-attributes
[9]: ../rbac#namespaces
[10]: ../../api/overview#response-filtering
[11]: ../../sensuctl/reference#response-filters
[12]: ../agent#keepalive-monitoring
[13]: ../agent/
[14]: ../backend/
[15]: ../../guides/send-slack-alerts/
[16]: https://bonsai.sensu.io/
[17]: https://github.com/sensu/sensu-servicenow-handler
[18]: https://regex101.com/r/zo9mQU/2
[23]: ../../guides/install-check-executables-with-assets
[24]: ../filters/
[25]: ../../dashboard/filtering#filter-with-label-selectors
[27]: ../agent/#registration
