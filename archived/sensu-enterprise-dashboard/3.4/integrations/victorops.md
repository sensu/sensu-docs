---
title: "VictorOps"
product: "Sensu Enterprise"
version: "3.4"
weight: 4
menu:
  sensu-enterprise-3.4:
    parent: integrations
---
**ENTERPRISE: Built-in integrations are available for [Sensu Enterprise][1]
users only.**

- [Overview](#overview)
- [Configuration](#configuration)
  - [Example(s)](#examples)
  - [Integration Specification](#integration-specification)
    - [`victorops` attributes](#victorops-attributes)

## Overview

Create [VictorOps][2] messages for events.

## Configuration

### Example(s) {#examples}

The following is an example global configuration for the `victorops` enterprise
event handler (integration).

{{< code json >}}
{
  "victorops": {
    "api_key": "a53265cd-d2ef-fa32-fc54de52659a",
    "routing_key": "everyone",
    "timeout": 10,
    "filters": [
      "handle_when",
      "check_dependencies"
    ],
    "severities": [
      "critical",
      "unknown"
    ],
    "http_proxy": "http://192.168.250.11:3128"
  }
}
{{< /code >}}

#### Minimum required attributes

{{< code json >}}
{
  "victorops": {
    "api_key": "a53265cd-d2ef-fa32-fc54de52659a"
  }
}
{{< /code >}}

### Integration Specification

#### `victorops` attributes

The following attributes are configured within the `{"victorops": {} }`
[configuration scope][3].

api_key      | 
-------------|------
description  | The VictorOps api key to use when creating messages.
required     | true
type         | String
example      | {{< code shell >}}"api_key": "a53265cd-d2ef-fa32-fc54de52659a"{{< /code >}}

routing_key  | 
-------------|------
description  | The VictorOps routing key to decide what team(s) to send alerts to.
required     | false
type         | String
default      | `everyone`
example      | {{< code shell >}}"routing_key": "ops"{{< /code >}}

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

http_proxy   | |
-------------|------
description  | The URL of a proxy to be used for HTTP requests.
required     | false
type         | String
example      | {{< code shell >}}"http_proxy": "http://192.168.250.11:3128"{{< /code >}}

[?]:  #
[1]:  /sensu-enterprise
[2]:  https://victorops.com?ref=sensu-enterprise
[3]:  /sensu-core/1.2/reference/configuration#configuration-scopes
