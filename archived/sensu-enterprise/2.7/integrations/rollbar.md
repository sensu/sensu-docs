---
title: "Rollbar"
product: "Sensu Enterprise"
version: "2.7"
weight: 2
menu:
  sensu-enterprise-2.7:
      parent: integrations
---
**ENTERPRISE: Built-in integrations are available for [Sensu Enterprise][1]
users only.**

- [Overview](#overview)
- [Configuration](#configuration)
  - [Example(s)](#examples)
  - [Integration specification](#integration-specification)
    - [`rollbar` attributes](#rollbar-attributes)

## Overview

Create and resolve [Rollbar][2] messages/items for [Sensu events][3].

## Configuration

### Example(s) {#examples}

The following is an example global configuration for the `rollbar` enterprise
event handler (integration).

{{< code json >}}
{
  "rollbar": {
    "access_token_read": "2ae6bccccf534b9c8749a4327671e711",
    "access_token_write": "944872fdbfba40c48305fc8cd73707b5",
    "access_token_patch": "f34948101a714661a83dcd8dbe6a167a",
    "timeout": 30
  }
}
{{< /code >}}

### Integration Specification

#### `rollbar` attributes

The following attributes are configured within the `{"rollbar": {} }`
[configuration scope][4].

access_token_read | 
------------------|------
description       | The Rollbar access token for read operations.
required          | true
type              | String
example           | {{< code shell >}}"access_token_read": "2ae6bccccf534b9c8749a4327671e711"{{< /code >}}

access_token_write | 
-------------------|------
description        | The Rollbar access token for write operations.
required           | true
type               | String
example            | {{< code shell >}}"access_token_write": "944872fdbfba40c48305fc8cd73707b5"{{< /code >}}

access_token_patch | 
-------------------|------
description        | The Rollbar access token for patch operations.
required           | true
type               | String
example            | {{< code shell >}}"access_token_patch": "f34948101a714661a83dcd8dbe6a167a"{{< /code >}}

http_proxy   | |
-------------|------
description  | The URL of a proxy to be used for HTTP requests.
required     | false
type         | String
example      | {{< code shell >}}"http_proxy": "http://192.168.250.11:3128"{{< /code >}}

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

timeout     | 
------------|------
description | The handler execution duration timeout in seconds (hard stop).
required    | false
type        | Integer
default     | `10`
example     | {{< code shell >}}"timeout": 30{{< /code >}}

[?]:  #
[1]:  /sensu-enterprise
[2]:  https://rollbar.com/
[3]:  /sensu-core/1.0/reference/events
[4]:  /sensu-core/1.0/reference/configuration#configuration-scopes
