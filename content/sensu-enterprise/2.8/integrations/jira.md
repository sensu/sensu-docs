---
title: "JIRA"
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
    - [`jira` attributes](#jira-attributes)

## Overview

Create and resolve [Jira][2] issues for [Sensu events][3].

## Configuration

### Example(s) {#examples}

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

root_url     | 
-------------|------
description  | The JIRA root URL. When set, this option overrides the `host` option, most commonly used when a service proxy is in use.
required     | false
type         | String
example      | {{< highlight shell >}}"root_url": "https://services.example.com/proxy/jira"{{< /highlight >}}

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
[3]:  /sensu-core/1.2/reference/events
[4]:  /sensu-core/1.2/reference/configuration#configuration-scopes
