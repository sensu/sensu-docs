---
title: "OpsGenie"
description: "Create and close OpsGenie alerts for Sensu events."
product: "Sensu Enterprise"
version: "3.3"
weight: 5
menu:
  sensu-enterprise-3.3:
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

_NOTE: As of Sensu Enterprise 3.0, the OpsGenie integration uses version 2 of the OpsGenie API.
Visit the [Sensu Enterprise 3.0 upgrade guide][4] and the [OpsGenie API docs][5] for more information._

## Configuration

### Example(s) {#examples}

The following is an example global configuration for the `opsgenie` enterprise
event handler (integration).

{{< highlight json >}}
{
  "opsgenie": {
    "api_key": "eed02a0d-85a4-427b-851a-18dd8fd80d93",
    "source": "Sensu Enterprise (AWS)",
    "responders":[
      {
        "name":"afterhours",
        "type":"schedule"
      }
    ],
    "visible_to":[
      {
        "name":"ops",
        "type":"team"
      }
    ],
    "actions": ["ShowProcesses"],
    "tags": ["production"],
    "overwrite_quiet_hours": true,
    "timeout": 10
  }
}
{{< /highlight >}}

### Integration Specification

#### `opsgenie` attributes

The following attributes are configured within the `{"opsgenie": {} }`
[configuration scope][3].

_NOTE: Some attributes are only available for certain OpsGenie subscription tiers._

api_endpoint | 
-------------|------
description  | The OpsGenie Alert API endpoint to use when connecting to OpsGenie: `api.opsgenie.com` for the US service region or `api.eu.opsgenie.com` for the [European service region][8].
required     | false
default      | `api.opsgenie.com` (US service region)
type         | String
example      | {{< highlight shell >}}"api_endpoint": "api.eu.opsgenie.com"{{< /highlight >}}

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

responders   | 
-------------|------
description  | The OpsGenie teams, users, schedules, or escalations that receive alert notifications. Each responder requires an `id` or `name` and a `type` (`team`, `user`, `escalation`, or `schedule`). _NOTE: For `"type":"user"`, use `username` instead of `name`._
required     | false
type         | Array of objects
example      | {{< highlight shell >}}
"responders":[
  {
    "name":"afterhours",
    "type":"schedule"
  },
  {
    "id":"bb4d9938-c3c2-455d-aaab-727aa701c0d8",
    "type":"user"
  },
  {
    "username":"alice@company.com",
    "type":"user"
  },
  {
    "id":"aee8a0de-c80f-4515-a232-501c0bc9d715",
    "type":"escalation"
  }
]
{{< /highlight >}}

visible_to   | 
-------------|------
description  | The OpsGenie teams and users that can see alerts but won't receive notifications. Teams require an `id` or `name` and `"type":"team"`. Users require an `id` or `username` and `"type":"user"`.
required     | false
type         | Array of objects
example      | {{< highlight shell >}}
"visible_to":[
  {
    "name":"ops",
    "type":"team"
  },
  {
    "id":"4513b7ea-3b91-438f-b7e4-e3e54af9147c",
    "type":"team"
  },
  {
    "id":"bb4d9938-c3c2-455d-aaab-727aa701c0d8",
    "type":"user"
  },
  {
    "username":"alice@company.com",
    "type":"user"
  }
]
{{< /highlight >}}

actions      | 
-------------|------
description  | Custom actions available for the alert
required     | false
type         | Array
example      | {{< highlight shell >}}"actions": ["ViewLogs", "ShowProcesses"]{{< /highlight >}}

tags         | 
-------------|------
description  | An array of OpsGenie alert tags that will be added to created alerts. _PRO TIP: Augment the tags applied to each incident by specifying additional OpsGenie tags in check and client definitions. See the Sensu Core reference docs to configure OpsGenie [check attributes][6] and [client attributes][7]._
required     | false
type         | Array
default      | `[]`
example      | {{< highlight shell >}}"tags": ["production"]{{< /highlight >}}

overwrite_quiet_hours  | 
-----------------------|------
description            | When configured, critical severity events will be tagged with "OverwriteQuietHours". This tag indicates that OpsGenie should bypass configured "quiet hours" that would otherwise filter alert notifications.
required               | false
type                   | Boolean
default                | `false`
example                | {{< highlight shell >}}"overwrite_quiet_hours": true{{< /highlight >}}

http_proxy   | |
-------------|------
description  | The URL of a proxy to be used for HTTP requests.
required     | false
type         | String
example      | {{< highlight shell >}}"http_proxy": "http://192.168.250.11:3128"{{< /highlight >}}

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
[2]:  https://www.opsgenie.com?ref=sensu-enterprise
[3]: /sensu-core/1.2/reference/configuration#configuration-scopes
[4]: /sensu-enterprise/3.0/upgrading#changes-in-opsgenie-integration
[5]: https://docs.opsgenie.com/docs/alert-api
[6]:  /sensu-core/latest/reference/checks#opsgenie-attributes
[7]:  /sensu-core/latest/reference/clients#opsgenie-attributes
[8]: https://docs.opsgenie.com/docs/european-service-region
