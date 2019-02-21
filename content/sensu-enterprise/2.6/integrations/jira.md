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

{{< highlight json >}}
{
  "jira": {
    "host": "jira.example.com",
    "user": "admin",
    "password": "secret",
    "project": "Sensu",
    "timeout": 10
  }
}
{{< /highlight >}}

### Integration Specification

#### `jira` attributes

The following attributes are configured within the `{"jira": {} }`
[configuration scope][4].

host         | 
-------------|------
description  | The JIRA host address.
required     | true
type         | String
example      | {{< highlight shell >}}"host": "jira.example.com"{{< /highlight >}}

user         | 
-------------|------
description  | The JIRA user used to authenticate.
required     | true
type         | String
example      | {{< highlight shell >}}"user": "admin"{{< /highlight >}}

password     | 
-------------|------
description  | The JIRA user password.
required     | true
type         | String
example      | {{< highlight shell >}}"password": "secret"{{< /highlight >}}

project      | 
-------------|------
description  | The JIRA project to use for issues.
required     | false
type         | String
default      | `Sensu`
example      | {{< highlight shell >}}"project": "Alerts"{{< /highlight >}}

project_key  | 
-------------|------
description  | The JIRA project key to use for issues. This option allows the integration to work without querying JIRA for a projects key. Using this option is recommended.
required     | false
type         | String
example      | {{< highlight shell >}}"project_key": "SEN"{{< /highlight >}}

issue_type   | 
-------------|------
description  | Specifies default issue type for projects. _NOTE: The project used with this integration must include the `issue_type` defined here. For more info please see Atlassian's documentation [here][5]._
required     | false
type         | String
default      | `Incident`
example      | {{< highlight shell >}}"issue_type": "Bug"{{< /highlight >}}

root_url     | 
-------------|------
description  | The JIRA root URL. When set, this option overrides the `host` option, most commonly used when a service proxy is in use.
required     | false
type         | String
example      | {{< highlight shell >}}"root_url": "https://services.example.com/proxy/jira"{{< /highlight >}}

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
[1]:  /sensu-enterprise
[2]:  https://www.atlassian.com/software/jira
[3]:  /sensu-core/1.0/reference/events
[4]:  /sensu-core/1.0/reference/configuration#configuration-scopes
[5]:  https://confluence.atlassian.com/adminjiraserver073/associating-issue-types-with-projects-861253240.html
