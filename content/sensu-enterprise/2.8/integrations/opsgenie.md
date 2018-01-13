---
title: "OpsGenie"
description: "Create and close OpsGenie alerts for Sensu events."
product: "Sensu Enterprise"
version: "2.8"
weight: 5
menu:
  sensu-enterprise-2.8:
    parent: integrations
---
**ENTERPRISE: Built-in integrations are available for [Sensu Enterprise][1]
users only.**

- [Overview](#overview)
- [Configuration](#configuration)
  - [Example(s)](#examples)
  - [Integration Specification](#integration-specification)
    - [`opsgenie` attributes](#opsgenie-attributes)

## Overview

Create and close [OpsGenie][2] alerts for events.

## Configuration

### Example(s) {#examples}

The following is an example global configuration for the `opsgenie` enterprise
event handler (integration).

{{< highlight json >}}
{
  "opsgenie": {
    "api_key": "eed02a0d-85a4-427b-851a-18dd8fd80d93",
    "source": "Sensu Enterprise (AWS)",
    "teams": ["ops", "web"],
    "recipients": ["afterhours"],
    "tags": ["production"],
    "overwrites_quiet_hours": true,
    "timeout": 10
  }
}
{{< /highlight >}}

### Integration Specification

#### `opsgenie` attributes

The following attributes are configured within the `{"opsgenie": {} }`
[configuration scope][3].

api_key      | 
-------------|------
description  | The OpsGenie Alert API key to use when creating/closing alerts.
required     | true
type         | String
example      | {{< highlight shell >}}"api_key": "eed02a0d-85a4-427b-851a-18dd8fd80d93"{{< /highlight >}}

source       | 
-------------|------
description  | The source to use for OpsGenie alerts.
required     | false
type         | String
default      | `Sensu Enterprise`
example      | {{< highlight shell >}}"source": "Sensu (us-west-1)"{{< /highlight >}}

teams        | 
-------------|------
description  | An array of OpsGenie team names to be used to calculate which users will be responsible for created alerts.
required     | false
type         | Array
default      | `[]`
example      | {{< highlight shell >}}"teams": ["ops", "web"]{{< /highlight >}}

recipients   | 
-------------|------
description  | An array of OpsGenie group, schedule, or escalation names to be used to calculate which users will be responsible for created alerts.
required     | false
type         | Array
default      | `[]`
example      | {{< highlight shell >}}"recipients": ["web", "afterhours"]{{< /highlight >}}

tags         | 
-------------|------
description  | An array of OpsGenie alert tags that will be added to created alerts.
required     | false
type         | Array
default      | `[]`
example      | {{< highlight shell >}}"tags": ["production"]{{< /highlight >}}

overwrites_quiet_hours | 
-----------------------|------
description            | If events with a critical severity should be tagged with "OverwritesQuietHours". This tag can be used to bypass quiet (or off) hour alert notification filtering.
required               | false
type                   | Boolean
default                | `false`
example                | {{< highlight shell >}}"overwrites_quiet_hours": true{{< /highlight >}}

timeout      | 
-------------|------
description  | The handler execution duration timeout in seconds (hard stop).
required     | false
type         | Integer
default      | `10`
example      | {{< highlight shell >}}"timeout": 30{{< /highlight >}}


[?]:  #
[1]:  /sensu-enterprise
[2]:  https://www.opsgenie.com?ref=sensu-enterprise
[3]: /sensu-core/1.0/reference/configuration#configuration-scopes
