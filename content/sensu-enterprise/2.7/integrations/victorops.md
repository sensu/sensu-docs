---
title: "VictorOps"
product: "Sensu Enterprise"
version: "2.7"
weight: 4
menu:
  sensu-enterprise-2.7:
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
