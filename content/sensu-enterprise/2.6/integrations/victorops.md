---
title: "VictorOps"
product: "Sensu Enterprise"
version: "2.6"
weight: 4
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
    - [`victorops` attributes](#victorops-attributes)

## Overview

Create [VictorOps][2] messages for events.

## Configuration

### Example(s) {#examples}

The following is an example global configuration for the `victorops` enterprise
event handler (integration).

{{< highlight json >}}
{
  "victorops": {
    "api_key": "a53265cd-d2ef-fa32-fc54de52659a",
    "routing_key": "everyone",
    "timeout": 10
  }
}
{{< /highlight >}}

### Integration Specification

#### `victorops` attributes

The following attributes are configured within the `{"victorops": {} }`
[configuration scope][3].

api_key      | 
-------------|------
description  | The VictorOps api key to use when creating messages.
required     | true
type         | String
example      | {{< highlight shell >}}"api_key": "a53265cd-d2ef-fa32-fc54de52659a"{{< /highlight >}}

routing_key  | 
-------------|------
description  | The VictorOps routing key to decide what team(s) to send alerts to.
required     | false
type         | String
default      | `everyone`
example      | {{< highlight shell >}}"routing_key": "ops"{{< /highlight >}}

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
default        | {{< highlight shell >}}["ok", "info", "warning", "critical"]{{< /highlight >}}
example        | {{< highlight shell >}} "severities": ["critical", "unknown"]{{< /highlight >}}

timeout      | 
-------------|------
description  | The handler execution duration timeout in seconds (hard stop).
required     | false
type         | Integer
default      | `10`
example      | {{< highlight shell >}}"timeout": 30{{< /highlight >}}

[?]:  #
[1]:  /sensu-enterprise
[2]:  https://victorops.com?ref=sensu-enterprise
[3]:  /sensu-core/1.0/reference/configuration#configuration-scopes
