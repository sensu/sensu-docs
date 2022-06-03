---
title: "JIRA"
product: "Sensu Enterprise"
version: "2.6"
weight: 2
menu:
  sensu-enterprise-2.6:
    parent: integrations
---
**ENTERPRISE: Built-in integrations are available for [Sensu Enterprise][1]
users only.**

- [Overview](#overview)
- [Configuration](#configuration)
  - [Example](#example)
  - [Integration Specification](#integration-specification)
    - [`jira` attributes](#jira-attributes)

## Overview

Create and resolve [Jira][2] issues for [Sensu events][3].

## Configuration

### Example

The following is an example global configuration for the `jira` enterprise
event handler (integration).

{{< code json >}}
{
  "jira": {
    "host": "jira.example.com",
    "user": "admin",
    "password": "secret",
    "project": "Sensu",
    "timeout": 10
  }
}
{{< /code >}}

### Integration Specification

#### `jira` attributes

The following attributes are configured within the `{"jira": {} }`
[configuration scope][4].

host         | 
-------------|------
description  | The JIRA host address.
required     | true
type         | String
example      | {{< code shell >}}"host": "jira.example.com"{{< /code >}}

user         | 
-------------|------
description  | The JIRA user used to authenticate.
required     | true
type         | String
example      | {{< code shell >}}"user": "admin"{{< /code >}}

password     | 
-------------|------
description  | The JIRA user password.
required     | true
type         | String
example      | {{< code shell >}}"password": "secret"{{< /code >}}

project      | 
-------------|------
description  | The JIRA project to use for issues.
required     | false
type         | String
default      | `Sensu`
example      | {{< code shell >}}"project": "Alerts"{{< /code >}}

project_key  | 
-------------|------
description  | The JIRA project key to use for issues. This option allows the integration to work without querying JIRA for a projects key. Using this option is recommended.
required     | false
type         | String
example      | {{< code shell >}}"project_key": "SEN"{{< /code >}}

issue_type   | 
-------------|------
description  | Specifies default issue type for projects. _NOTE: The project used with this integration must include the `issue_type` defined here. For more info please see Atlassian's documentation [here][5]._
required     | false
type         | String
default      | `Incident`
example      | {{< code shell >}}"issue_type": "Bug"{{< /code >}}

root_url     | 
-------------|------
description  | The JIRA root URL. When set, this option overrides the `host` option, most commonly used when a service proxy is in use.
required     | false
type         | String
example      | {{< code shell >}}"root_url": "https://services.example.com/proxy/jira"{{< /code >}}

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
[2]:  https://www.atlassian.com/software/jira
[3]:  /sensu-core/1.0/reference/events
[4]:  /sensu-core/1.0/reference/configuration#configuration-scopes
[5]:  https://confluence.atlassian.com/adminjiraserver073/associating-issue-types-with-projects-861253240.html
