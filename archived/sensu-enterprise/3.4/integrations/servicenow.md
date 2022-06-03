---
title: "ServiceNow"
description: "Create ServiceNow configuration items upon Sensu client registration, create/resolve ServiceNow incidents, and/or create ServiceNow events for Sensu events."
product: "Sensu Enterprise"
version: "3.4"
weight: 3
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
    - [`servicenow` attributes](#servicenow-attributes)

## Overview

Create [ServiceNow][2] [configuration items][3] upon [Sensu client
registration][4], create/resolve ServiceNow incidents, and/or create
ServiceNow events for [Sensu events][5].

## Configuration

### Example(s) {#examples}

The following is an example global configuration for the `servicenow` enterprise
event handler (integration).

{{< code json >}}
{
  "servicenow": {
    "host": "dev42.service-now.com",
    "user": "admin",
    "password": "secret",
    "create_cmdb_ci": true,
    "cmdb_ci_table": "cmdb_ci_server",
    "incident_management": true,
    "incident_table": "incident",
    "timeout": 10
  }
}
{{< /code >}}

When creating [ServiceNow configuration items][6], by default, Sensu will use
the client's name for the item name. Individual Sensu clients can override the
name of their corresponding configuration item, using specific client definition
attributes. In addition to specifying a item name, any valid CMDB table
attributes (fields & values) may also be set, e.g. `os_version`.

The following is an example [client definition][7], specifying its ServiceNow
configuration item attributes.

{{< code json >}}
{
  "client": {
    "name": "i-424242",
    "address": "8.8.8.8",
    "subscriptions": [
      "production",
      "webserver"
    ],
    "servicenow": {
      "configuration_item": {
        "name": "webserver01.example.com",
        "os_version": "14.04"
      }
    }
  }
}
{{< /code >}}

### Integration Specification

_NOTE: the following integration definition attributes may be overwritten by
the corresponding Sensu [client definition `servicenow` attributes][8], which
are included in [event data][9]._

#### `servicenow` attributes

The following attributes are configured within the `{"servicenow": {} }`
[configuration scope][10].

host         | 
-------------|------
description  | The ServiceNow host address.
required     | true
type         | String
example      | {{< code shell >}}"host": "dev42.service-now.com"{{< /code >}}

user         | 
-------------|------
description  | The ServiceNow user used to authenticate.
required     | true
type         | String
example      | {{< code shell >}}"user": "admin"{{< /code >}}

password     | 
-------------|------
description  | The ServiceNow user password.
required     | true
type         | String
example      | {{< code shell >}}"password": "secret"{{< /code >}}

create_cmdb_ci | 
---------------|------
description    | If ServiceNow CMDB configuration items should be automatically created for Sensu clients.
required       | false
type           | Boolean
default        | `true`
example        | {{< code shell >}}"create_cmdb_ci": false{{< /code >}}

cmdb_ci_table | 
--------------|------
description   | The ServiceNow CMDB table used for automated configuration item creation.
required      | false
type          | String
default       | `cmdb_ci_server`
example       | {{< code shell >}}"cmdb_ci_table": "cmdb_ci_sensu_client"{{< /code >}}

incident_management | 
--------------------|------
description         | If ServiceNow incidents should be created and resolved for Sensu events.
required            | false
type                | Boolean
default             | `true`
example             | {{< code shell >}}"incident_management": false{{< /code >}}

incident_table | 
---------------|------
description    | The ServiceNow table used for creating/resolving incidents corresponding to Sensu events.
required       | false
type           | String
default        | `incident`
example        | {{< code shell >}}"incident_table": "incident"{{< /code >}}

event_management | 
-----------------|------
description      | If ServiceNow events should be created for Sensu events.
required         | false
type             | Boolean
default          | `false`
example          | {{< code shell >}}"event_management": true{{< /code >}}

event_table  | 
-------------|------
description  | The ServiceNow table used for creating ServiceNow events corresponding to Sensu events.
required     | false
type         | String
default      | `em_event`
example      | {{< code shell >}}"event_table": "em_event"{{< /code >}}

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

timeout      | 
-------------|------
description  | The handler execution duration timeout in seconds (hard stop).
required     | false
type         | Integer
default      | `10`
example      | {{< code shell >}}"timeout": 30{{< /code >}}


[?]:  #
[1]:  /sensu-enterprise
[2]:  https://www.servicenow.com?ref=sensu-enterprise
[3]:  https://www.servicenow.com/products/it-service-automation-applications/configuration-management.html?ref=sensu-enterprise
[4]:  /sensu-core/1.2/reference/clients#registration-and-registry
[5]:  /sensu-core/1.2/reference/events
[6]:  https://wiki.servicenow.com/index.php?title=Introduction_to_Assets_and_Configuration#gsc.tab=0
[7]:  /sensu-core/1.2/reference/clients#client-definition-specification
[8]:  #servicenow-attributes
[9]:  /sensu-core/1.2/reference/events#event-data
[10]: /sensu-core/1.2/reference/configuration#configuration-scopes
