---
title: "Handlers"
description: "The handlers reference guide."
weight: 1
version: "2.0"
product: "Sensu Core"
platformContent: false
menu:
  sensu-core-2.0:
    parent: reference
---

## How do Sensu handlers work?

Handlers actions are executed by the Sensu backend on events, and there are
several types of handlers available. The most common handler type is the `pipe`
handler, which works very similarly to how [checks][1] work, enabling Sensu to
interact with almost any computer program via [standard streams][2].

- **Pipe handlers**. Pipe handlers pipe event data into arbitrary commands via
  `STDIN`.
- **TCP/UDP handlers**. TCP and UDP handlers send event data to a remote socket
  (i.e., external API).
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
sockets for external services to consume (i.e., third-party APIs).

### Handler sets

Handler set definitions allow groups of handlers (i.e., individual collections
of actions to take on event data) to be referenced via a single named handler
set.

_NOTE: Attributes defined on handler sets do not apply to the handlers they
include. For example, `filters`, and `mutator` attributes defined 
in a handler set will have no effect._

## New and improved handlers

### Default handler

Sensu no longer attempts to handle events using a handler named `default`, which
caused confusion as this default handler was only a reference, since Sensu did
not provide a built-in default handler.

### Transport handlers

Sensu architecture considerably changed between the 1.0 and 2.0 versions, and a
dedicated message bus (i.e., RabbitMQ) is no longer used. Therefore, [transport
handlers][5] have been removed but a similar functionality could be achieved
using a pipe handler that connects to a message bus and injects event data into
a queue.

## Handler specification

### Handler naming

Each handler definition must have a unique name within its organization and
environment.

* A unique string used to name/identify the handler
* Cannot contain special characters or spaces
* Validated with Go regex [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2)

### Handler attributes

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
example      | {{< highlight shell >}}"filters": ["recurrence", "production"]{{< /highlight >}}

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
example      | {{< highlight shell >}}"command": "/etc/sensu/plugins/pagerduty.rb"{{< /highlight >}}

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

organization | 
-------------|------ 
description  | The Sensu RBAC organization that this handler belongs to.
required     | false 
type         | String
default      | current organization value configured for `sensuctl` (i.e., `default`) 
example      | {{< highlight shell >}}
  "organization": "default"
{{</ highlight >}}

environment  | 
-------------|------ 
description  | The Sensu RBAC environment that this handler belongs to.
required     | false 
type         | String 
default      | current environment value configured for `sensuctl` (i.e., `default`) 
example      | {{< highlight shell >}}
  "environment": "default"
{{</ highlight >}}

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
  "name": "slack",
  "type": "pipe",
  "command": "handler-slack --webhook-url https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX --channel monitoring"
}
{{< /highlight >}}

### Sending event data to a TCP socket

This handler will forward event data to a TCP socker (i.e., 10.0.1.99:4444) and
will timeout if an acknowledgement (`ACK`) is not received within 30 seconds.

{{< highlight json >}}
{
  "name": "tcp_handler",
  "type": "tcp",
  "socket": {
    "host": "10.0.1.99",
    "port": 4444
  },
  "timeout": 30
}
{{< /highlight >}}

### Sending event data to a UDP socket

The following example will also forward event data but to UDP socket instead
(i.e., 10.0.1.99:4444).

{{< highlight json >}}
{
  "name": "udp_handler",
  "type": "udp",
  "socket": {
    "host": "10.0.1.99",
    "port": 4444
  }
}
{{< /highlight >}}

### Executing multiple handlers

The following example handler will execute three handlers (e.g., `slack`,
`tcp_handler` and `udp_handler`).

{{< highlight json >}}
{
  "name": "notify_all_the_things",
  "type": "set",
  "handlers": [
    "slack",
    "tcp_handler",
    "udp_handler"
  ]
}
{{< /highlight >}}

[1]: ../checks/
[2]: https://en.wikipedia.org/wiki/Standard_streams
[3]: ../events/
[4]: ../../../1.2/reference/handlers/#the-default-handler
[5]: ../../../1.2/reference/handlers/#transport-handlers
[6]: #socket-attributes