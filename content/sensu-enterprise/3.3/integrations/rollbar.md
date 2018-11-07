---
title: "Rollbar"
product: "Sensu Enterprise"
version: "3.3"
weight: 2
menu:
  sensu-enterprise-3.3:
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

{{< highlight json >}}
{
  "rollbar": {
    "access_token_read": "2ae6bccccf534b9c8749a4327671e711",
    "access_token_write": "944872fdbfba40c48305fc8cd73707b5",
    "access_token_patch": "f34948101a714661a83dcd8dbe6a167a",
    "timeout": 30
  }
}
{{< /highlight >}}

### Integration Specification

#### `rollbar` attributes

The following attributes are configured within the `{"rollbar": {} }`
[configuration scope][4].

access_token_read | 
------------------|------
description       | The Rollbar access token for read operations.
required          | true
type              | String
example           | {{< highlight shell >}}"access_token_read": "2ae6bccccf534b9c8749a4327671e711"{{< /highlight >}}

access_token_write | 
-------------------|------
description        | The Rollbar access token for write operations.
required           | true
type               | String
example            | {{< highlight shell >}}"access_token_write": "944872fdbfba40c48305fc8cd73707b5"{{< /highlight >}}

access_token_patch | 
-------------------|------
description        | The Rollbar access token for patch operations.
required           | true
type               | String
example            | {{< highlight shell >}}"access_token_patch": "f34948101a714661a83dcd8dbe6a167a"{{< /highlight >}}

filters        | 
---------------|------
description    | An array of Sensu event filters (names) to use when filtering events for the handler. Each array item must be a string. Specified filters are merged with default values.
required       | false
type           | Array
default        | {{< highlight shell >}}["handle_when", "check_dependencies"]{{< /highlight >}}
example        | {{< highlight shell >}}"filters": ["recurrence", "production"]{{< /highlight >}}

severities     | 
---------------|------
description    | An array of check result severities the handler will handle. _NOTE: event resolution bypasses this filtering._
required       | false
type           | Array
allowed values | `ok`, `warning`, `critical`, `unknown`
default        | {{< highlight shell >}}["warning", "critical", "unknown"]{{< /highlight >}}
example        | {{< highlight shell >}} "severities": ["critical", "unknown"]{{< /highlight >}}

timeout     | 
------------|------
description | The handler execution duration timeout in seconds (hard stop).
required    | false
type        | Integer
default     | `10`
example     | {{< highlight shell >}}"timeout": 30{{< /highlight >}}

[?]:  #
[1]:  /sensu-enterprise
[2]:  https://rollbar.com/
[3]:  /sensu-core/1.2/reference/events
[4]:  /sensu-core/1.2/reference/configuration#configuration-scopes
