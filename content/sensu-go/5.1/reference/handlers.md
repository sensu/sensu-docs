---
title: "Handlers"
description: "The handlers reference guide."
weight: 10
version: "5.1"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.1:
    parent: reference
---

- [How do Sensu handlers work?](#how-do-sensu-handlers-work)
	- [Pipe handlers](#pipe-handlers)
	- [TCP/UDP handlers](#tcp-udp-handlers)
	- [Handler sets](#handler-sets)
- [Handling keepalive events](#handling-keepalive-events)
- [Specification](#handler-specification)
	- [Top-level attributes](#top-level-attributes)
	- [Spec attributes](#spec-attributes)
	- [Metadata attributes](#metadata-attributes)
	- [`socket` attributes](#socket-attributes)
- [Examples](#handler-examples)

## How do Sensu handlers work?

Handlers actions are executed by the Sensu backend on events, and there are
several types of handlers available. The most common handler type is the `pipe`
handler, which works very similarly to how [checks][1] work, enabling Sensu to
interact with almost any computer program via [standard streams][2].

- **Pipe handlers**. Pipe handlers pipe event data into arbitrary commands via
  `STDIN`.
- **TCP/UDP handlers**. TCP and UDP handlers send event data to a remote socket.
- **Handler sets**. Handler sets (also called "set handlers") are used to group
  event handlers, making it easy to manage groups of actions that should be
  executed for certain types of events.

### Pipe handlers

Pipe handlers are external commands that can consume [event][3] data via STDIN.

#### Pipe handler command

Pipe handler definitions include a `command` attribute, which is a command to be
executed by the Sensu backend.

#### Pipe handler command arguments

Pipe handler `command` attributes may include command line arguments for
controlling the behavior of the `command` executable.

### TCP/UDP handlers

TCP and UDP handlers enable Sensu to forward event data to arbitrary TCP or UDP
sockets for external services to consume.

### Handler sets

Handler set definitions allow groups of handlers (individual collections
of actions to take on event data) to be referenced via a single named handler
set.

_NOTE: Attributes defined on handler sets do not apply to the handlers they
include. For example, `filters`, and `mutator` attributes defined 
in a handler set will have no effect._

## Handling keepalive events

Sensu [keepalives][12] are the heartbeat mechanism used to ensure that all registered [Sensu agents][13] are operational and able to reach the [Sensu backend][14].
You can connect keepalive events to your monitoring workflows using a keepalive handler.
Sensu looks for an event handler named `keepalive` and automatically uses it to process keepalive events.

Let's say you want to receive Slack notifications for keepalive alerts, and you already have a [Slack handler set up to process events][15].
To process keepalive events using the Slack pipeline, create a handler set named `keepalive` and add the `slack` handler to the `handlers` array.
The resulting `keepalive` handler set configuration looks like this:

{{< highlight json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata" : {
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

## Handler specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute specifying the [`sensuctl create`][sc] resource type. Handlers should always be of type `Handler`.
required     | Required for handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"type": "Handler"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute specifying the Sensu API group and version. For handlers in Sensu backend version 5.1, this attribute should always be `core/v2`.
required     | Required for handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"api_version": "core/v2"{{< /highlight >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the handler, including the `name` and `namespace` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the handler definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. See the [metadata attributes reference][8] for details.
required     | Required for handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"metadata": {
  "name": "handler-slack",
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
description  | Top-level map that includes the handler [spec attributes][sp].
required     | Required for handler definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"spec": {
  "type": "tcp",
  "socket": {
    "host": "10.0.1.99",
    "port": 4444
  },
  "metadata" : {
    "name": "tcp_handler",
    "namespace": "default"
  }
}
{{< /highlight >}}

### Spec attributes

type         | 
-------------|------
description  | The handler type.
required     | true
type         | String
allowed values | `pipe`, `tcp`, `udp` & `set`
example      | {{< highlight shell >}}"type": "pipe"{{< /highlight >}}

filters      | 
-------------|------
description  | An array of Sensu event filters (names) to use when filtering events for the handler. Each array item must be a string.
required     | false
type         | Array
example      | {{< highlight shell >}}"filters": ["occurrences", "production"]{{< /highlight >}}

mutator      | 
-------------|------
description  | The Sensu event mutator (name) to use to mutate event data for the handler.
required     | false
type         | String
example      | {{< highlight shell >}}"mutator": "only_check_output"{{< /highlight >}}

timeout     | 
------------|------
description | The handler execution duration timeout in seconds (hard stop). Only used by `pipe` and `tcp` handler types.
required    | false
type        | Integer
default     | `60` (for `tcp` handler)
example     | {{< highlight shell >}}"timeout": 30{{< /highlight >}}

command      | 
-------------|------
description  | The handler command to be executed. The event data is passed to the process via `STDIN`._NOTE: the `command` attribute is only supported for Pipe handlers (i.e. handlers configured with `"type": "pipe"`)._
required     | true (if `type` equals `pipe`)
type         | String
example      | {{< highlight shell >}}"command": "/etc/sensu/plugins/pagerduty.go"{{< /highlight >}}

env_vars      | 
-------------|------
description  | An array of environment variables to use with command execution._NOTE: the `env_vars` attribute is only supported for Pipe handlers (i.e. handlers configured with `"type": "pipe"`)._
required     | false
type         | Array
example      | {{< highlight shell >}}"env_vars": ["API_KEY=0428d6b8nb51an4d95nbe28nf90865a66af5"]{{< /highlight >}}

socket       | 
-------------|------
description  | The [`socket` definition scope][6], used to configure the TCP/UDP handler socket._NOTE: the `socket` attribute is only supported for TCP/UDP handlers (i.e. handlers configured with `"type": "tcp"` or `"type": "udp"`)._
required     | true (if `type` equals `tcp` or `udp`)
type         | Hash
example      | {{< highlight shell >}}"socket": {}{{< /highlight >}}

handlers     | 
-------------|------
description  | An array of Sensu event handlers (names) to use for events using the handler set. Each array item must be a string._NOTE: the `handlers` attribute is only supported for handler sets (i.e. handlers configured with `"type": "set"`)._
required     | true (if `type` equals `set`)
type         | Array
example      | {{< highlight shell >}}"handlers": ["pagerduty", "email", "ec2"]{{< /highlight >}}

runtime_assets | 
---------------|------
description    | An array of [Sensu assets][7] (names), required at runtime for the execution of the `command`
required       | false
type           | Array
example        | {{< highlight shell >}}"runtime_assets": ["ruby-2.5.0"]{{< /highlight >}}

### Metadata attributes

| name       |      |
-------------|------
description  | A unique string used to identify the handler. Handler names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2)). Each handler must have a unique name within its namespace.
required     | true
type         | String
example      | {{< highlight shell >}}"name": "handler-slack"{{< /highlight >}}

| namespace  |      |
-------------|------
description  | The Sensu [RBAC namespace][9] that this handler belongs to.
required     | false
type         | String
default      | `default`
example      | {{< highlight shell >}}"namespace": "production"{{< /highlight >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with event data, which can be queried like regular attributes. You can use labels to organize handlers into meaningful collections that can be selected using [filters][10] and [tokens][11].
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores, but must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}}"labels": {
  "environment": "development",
  "region": "us-west-2"
}{{< /highlight >}}

| annotations |     |
-------------|------
description  | Arbitrary, non-identifying metadata to include with event data. In contrast to labels, annotations are _not_ used internally by Sensu and cannot be used to identify handlers. You can use annotations to add data that helps people or external tools interacting with Sensu.
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}} "annotations": {
  "managed-by": "ops",
  "slack-channel": "#monitoring",
  "playbook": "www.example.url"
}{{< /highlight >}}

### `socket` attributes

host         | 
-------------|------
description  | The socket host address (IP or hostname) to connect to.
required     | true
type         | String
example      | {{< highlight shell >}}"host": "8.8.8.8"{{< /highlight >}}

port         | 
-------------|------
description  | The socket port to connect to.
required     | true
type         | Integer
example      | {{< highlight shell >}}"port": 4242{{< /highlight >}}

## Handler examples

### Sending slack alerts

This handler will send alerts to a channel named `monitoring` with the
configured webhook URL, using the `handler-slack` executable command.

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

### Sending event data to a TCP socket

This handler will forward event data to a TCP socket (10.0.1.99:4444) and
will timeout if an acknowledgement (`ACK`) is not received within 30 seconds.

{{< highlight json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata" : {
    "name": "tcp_handler",
    "namespace": "default"
  },
  "spec": {
    "type": "tcp",
    "socket": {
      "host": "10.0.1.99",
      "port": 4444
    },
    "metadata" : {
      "name": "tcp_handler",
      "namespace": "default"
    }
  }
}
{{< /highlight >}}

### Sending event data to a UDP socket

The following example will also forward event data but to UDP socket instead
(ex: 10.0.1.99:4444).

{{< highlight json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata" : {
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

### Executing multiple handlers

The following example handler will execute three handlers: `slack`,
`tcp_handler`, and `udp_handler`.

{{< highlight json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata" : {
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

[1]: ../checks/
[2]: https://en.wikipedia.org/wiki/Standard_streams
[3]: ../events/
[4]: /sensu-core/latest/reference/handlers/#the-default-handler
[5]: /sensu-core/latest/reference/handlers/#transport-handlers
[6]: #socket-attributes
[7]: ../assets
[8]: #metadata-attributes
[9]: ../rbac#namespaces
[10]: ../filters
[11]: ../tokens
[sc]: ../../sensuctl/reference#creating-resources
[sp]: #spec-attributes
[12]: ../agent#keepalive-monitoring
[13]: ../agent
[14]: ../backend
[15]: ../../guides/send-slack-alerts
