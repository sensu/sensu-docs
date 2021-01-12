---
title: "DataDog"
description: "Create DataDog events for Sensu events."
product: "Sensu Enterprise"
version: "2.7"
weight: 21
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
    - [`datadog` attributes](#datadog-attributes)

## Overview

Create [Datadog][2] events for Sensu events. After [managing your Datadog
account API key][3], configure the handler (integration) with your API key.

## Configuration

### Example(s) {#examples}

The following is an example global configuration for the `datadog` enterprise
event handler (integration).

{{< code json >}}
{
  "datadog": {
    "api_key": "9775a026f1ca7d1c6c5af9d94d9595a4",
    "timeout": 10
  }
}
{{< /code >}}

### Integration Specification

#### `datadog` attributes

The following attributes are configured within the `{"datadog": {} }`
[configuration scope][4].

api_key      | 
-------------|------
description  | The Datadog account API key to use when creating Datadog events.
required     | true
type         | String
example      | {{< code shell >}}"api_key": "9775a026f1ca7d1c6c5af9d94d9595a4"{{< /code >}}

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

[1]:  /sensu-enterprise
[2]:  https://app.datadoghq.com/account/login?next=%2Faccount%2Fsettings#api
[3]:  https://app.datadoghq.com/account/login?next=%2Faccount%2Fsettings#api
[4]:  /sensu-core/1.0/reference/configuration#configuration-scopes
