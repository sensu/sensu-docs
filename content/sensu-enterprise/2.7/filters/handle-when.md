---
title: "handle_when"
description: "The handle_when Enterprise filter is used to reduce notification noise."
product: "Sensu Enterprise"
version: "2.7"
weight: 1
menu:
  sensu-enterprise-2.7:
    parent: filters
---
**ENTERPRISE: Built-in filters are available for [Sensu Enterprise][0]
users only.**

## Reference documentation

- [Overview](#overview)
- [Configuration](#configuration)
  - [Example(s)](#examples)
  - [Filter specification](#filter-specification)
    - [`handle_when` attributes](#handlewhen-attributes)

## Overview

The `handle_when` enterprise filter is used to reduce notification "noise".
Users can define a minimum number of event `occurrences` before notifications
will be sent. Users can also specify a `reset` time, in seconds, to reset where
recurrences are counted from, to control when reminder/update notifications are
sent. By default, `occurrences` is set to `1`, and reset is `1800` (30 minutes).
The `handle_when` filter is used by all of the [enterprise third-party
integrations][1].

## Configuration

### Example(s) {#examples}

The following is an example of how to configure a check to only notify after 2
occurrences and send reminder/update notifications every 20 minutes. Sensu
Enterprise integrations and standard event handlers using the `handle_when`
enterprise filter will have events filtered unless these conditions are met.

{{< highlight json >}}
{
  "checks": {
    "load_balancer_listeners": {
      "command": "check-haproxy.rb -s /var/run/haproxy.sock -A",
      "subscribers": [
        "load_balancer"
      ],
      "interval": 20,
      "handle_when": {
        "occurrences": 2,
        "reset": 1200
      }
    }
  }
}
{{< /highlight >}}

The following is an example of how to apply the `handle_when` enterprise filter
to a standard Sensu `pipe` handler.

_NOTE: The `handle_when` filter, when used inside a handler, does not allow the `occurrences` or `reset` attributes to be changed from their defaults._

{{< highlight json >}}
{
  "handlers": {
    "custom_mailer": {
      "type": "pipe",
      "command": "custom_mailer.rb",
      "filter": "handle_when"
    }
  }
}
{{< /highlight >}}

### Filter specification

#### `handle_when` attributes {#handlewhen-attributes}

The following attributes are configured within the `{"handle_when": {} }`
[configuration scope][2].

occurrences  | 
-------------|------
description  | The number of occurrences that must occur before an event is handled for a check.
required     | false
type         | Integer
default      | `1`
example      | {{< highlight shell >}}"occurrences": 3{{< /highlight >}}

reset        | 
-------------|------
description  | Time in seconds until the occurrence count is considered "reset", to allow the event to be handled once again.
required     | false
type         | Integer
default      | `1800`
example      | {{< highlight shell >}}"reset": 3600{{< /highlight >}}

[?]:  #
[0]:  /sensu-enterprise
[1]:  ../../built-in-handlers
[2]:  /sensu-core/1.0/reference/configuration#configuration-scopes
