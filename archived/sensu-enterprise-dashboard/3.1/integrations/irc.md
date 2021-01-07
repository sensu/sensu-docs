---
title: "IRC"
product: "Sensu Enterprise"
version: "3.1"
weight: 8
menu:
  sensu-enterprise-3.1:
    parent: integrations
---
**ENTERPRISE: Built-in integrations are available for [Sensu Enterprise][1]
users only.**

- [Overview](#overview)
- [Configuration](#configuration)
  - [Example(s)](#examples)
  - [Integration Specification](#integration-specification)
    - [`irc` attributes](#irc-attributes)

## Overview

Send notifications to an Internet Relay Chat (IRC) channel for events.

## Configuration

### Example(s) {#examples}

The following is an example global configuration for the `irc` enterprise event
handler (integration).

{{< code json >}}
{
  "irc": {
    "uri": "irc://nick:pass@example.com:6697/#ops",
    "ssl": true,
    "nickserv_password": "NICKSERV_PASSWORD",
    "channel_password": "CHANNEL_PASSWORD",
    "join": false,
    "timeout": 10
  }
}
{{< /code >}}

### Integration Specification

#### `irc` attributes

The following attributes are configured within the `{"irc": {} }` [configuration
scope][2].

url          | 
-------------|------
description  | The IRC URI; including the nick, password, address, port, and channel.
required     | true
type         | String
example      | {{< code shell >}}"uri": "irc://nick:pass@example.com:6697/#ops"{{< /code >}}

ssl          | 
-------------|------
description  | If SSL encryption is used for the IRC connection.
required     | false
type         | Boolean
default      | `false`
example      | {{< code shell >}}"ssl": true{{< /code >}}

channel_password | 
-----------------|------
description      | The IRC channel password (if required).
required         | false
type             | String
example          | {{< code shell >}}"channel_password": "secret"{{< /code >}}

nickserv_password | 
------------------|------
description       | Identify with NickServ (if required).
required          | false
type              | String
example           | {{< code shell >}}"nickserv_password": "secret"{{< /code >}}

join         | 
-------------|------
description  | If the handler must join the IRC channel before messaging.
required     | false
type         | Boolean
default      | `false`
example      | {{< code shell >}}"join": true{{< /code >}}

filters        | 
---------------|------
description    | An array of Sensu event filters (names) to use when filtering events for the handler. Each array item must be a string. Specified filters are merged with default values.
required       | false
type           | Array
default        | {{< code shell >}}["handle_when", "check_dependencies"]{{< /code >}}
example        | {{< code shell >}}"filters": ["recurrence", "production"]{{< /code >}}

severities     | 
---------------|------
description    | An array of check result severities the handler will handle. _NOTE: event resolution bypasses this filtering._
required       | false
type           | Array
allowed values | `ok`, `warning`, `critical`, `unknown`
default        | {{< code shell >}}["warning", "critical", "unknown"]{{< /code >}}
example        | {{< code shell >}} "severities": ["critical", "unknown"]{{< /code >}}

timeout      | 
-------------|------
description  | The handler execution duration timeout in seconds (hard stop).
required     | false
type         | Integer
default      | `10`
example      | {{< code shell >}}"timeout": 30{{< /code >}}


[?]:  #
[1]:  /sensu-enterprise
[2]:  /sensu-core/1.2/reference/configuration#configuration-scopes
