---
title: "IRC"
product: "Sensu Enterprise"
version: "2.6"
weight: 8
menu:
  sensu-enterprise-2.6:
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

{{< highlight json >}}
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
{{< /highlight >}}

### Integration Specification

#### `irc` attributes

The following attributes are configured within the `{"irc": {} }` [configuration
scope][2].

url          | 
-------------|------
description  | The IRC URI; including the nick, password, address, port, and channel.
required     | true
type         | String
example      | {{< highlight shell >}}"uri": "irc://nick:pass@example.com:6697/#ops"{{< /highlight >}}

ssl          | 
-------------|------
description  | If SSL encryption is used for the IRC connection.
required     | false
type         | Boolean
default      | `false`
example      | {{< highlight shell >}}"ssl": true{{< /highlight >}}

channel_password | 
-----------------|------
description      | The IRC channel password (if required).
required         | false
type             | String
example          | {{< highlight shell >}}"channel_password": "secret"{{< /highlight >}}

nickserv_password | 
------------------|------
description       | Identify with NickServ (if required).
required          | false
type              | String
example           | {{< highlight shell >}}"nickserv_password": "secret"{{< /highlight >}}

join         | 
-------------|------
description  | If the handler must join the IRC channel before messaging.
required     | false
type         | Boolean
default      | `false`
example      | {{< highlight shell >}}"join": true{{< /highlight >}}

timeout      | 
-------------|------
description  | The handler execution duration timeout in seconds (hard stop).
required     | false
type         | Integer
default      | `10`
example      | {{< highlight shell >}}"timeout": 30{{< /highlight >}}


[?]:  #
[1]:  /sensu-enterprise
[2]:  /sensu-core/1.0/reference/configuration#configuration-scopes
