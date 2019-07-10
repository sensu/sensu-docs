---
title: "PagerDuty"
product: "Sensu Enterprise"
version: "3.6"
weight: 2
menu:
  sensu-enterprise-3.6:
    parent: integrations
---
**ENTERPRISE: Built-in integrations are available for [Sensu Enterprise][1]
users only.**

- [Overview](#overview)
- [Configuration](#configuration)
  - [Example(s)](#examples)
  - [Integration specification](#integration-specification)
    - [`pagerduty` attributes](#pagerduty-attributes)

## Overview

Create and resolve [PagerDuty][2] incidents for events. After [configuring a
service in PagerDuty for Events API v2][3], configure the handler (integration) with the provided
integration key.

## Configuration

### Example(s) {#examples}

The following is an example global configuration for the `pagerduty` enterprise
event handler (integration).

{{< highlight json >}}
{
  "pagerduty": {
    "routing_key": "r3FPuDvNOTEDyQYCc7trBkymIFcy2NkE",
    "timeout": 10
  }
}
{{< /highlight >}}

### Integration Specification

#### `pagerduty` attributes

The following attributes are configured within the `{"pagerduty": {} }`
[configuration scope][4].

routing_key  | 
-------------|------
description  | The PagerDuty integration key to use when creating and resolving incidents. _NOTE: If you're using an integration key for PagerDuty's Events API v1, you can continue to use `service_key` instead of `routing_key`._
required     | true
type         | String
example      | {{< highlight shell >}}"routing_key": "r3FPuDvNOTEDyQYCc7trBkymIFcy2NkE"{{< /highlight >}}

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

timeout      | 
-------------|------
description  | The handler execution duration timeout in seconds (hard stop).
required     | false
type         | Integer
default      | `10`
example      | {{< highlight shell >}}"timeout": 30{{< /highlight >}}

[?]:  #
[1]:  https://support.pagerduty.com/hc/en-us/articles/202830340-Creating-a-Generic-API-Service
[2]:  https://www.pagerduty.com?ref=sensu-enterprise
[3]:  https://support.pagerduty.com/hc/en-us/articles/202830340-Creating-a-Generic-API-Service?ref=sensu-enterprise
[4]:  /sensu-core/1.2/reference/configuration#configuration-scopes
