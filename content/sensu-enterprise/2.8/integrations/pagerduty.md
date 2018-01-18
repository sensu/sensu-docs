---
title: "PagerDuty"
product: "Sensu Enterprise"
version: "2.8"
weight: 2
menu:
  sensu-enterprise-2.8:
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
service in PagerDuty][3], configure the handler (integration) with the provided
service key.

## Configuration

### Example(s) {#examples}

The following is an example global configuration for the `pagerduty` enterprise
event handler (integration).

{{< highlight json >}}
{
  "pagerduty": {
    "service_key": "r3FPuDvNOTEDyQYCc7trBkymIFcy2NkE",
    "timeout": 10
  }
}
{{< /highlight >}}

### Integration Specification

#### `pagerduty` attributes

The following attributes are configured within the `{"pagerduty": {} }`
[configuration scope][4].

service_key  | 
-------------|------
description  | The PagerDuty service key to use when creating and resolving incidents.
required     | true
type         | String
example      | {{< highlight shell >}}"service_key": "r3FPuDvNOTEDyQYCc7trBkymIFcy2NkE"{{< /highlight >}}

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
