---
title: "Slack"
product: "Sensu Enterprise"
version: "2.8"
weight: 6
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
    - [`slack` attributes](#slack-attributes)

## Overview

Send notifications to a [Slack][2] channel for events. After [configuring an
incoming webhook in Slack][3], configure the handler (integration) with the
provided webhook url.

## Configuration

### Example(s) {#examples}

The following is an example global configuration for the `slack` enterprise
event handler (integration).

{{< code json >}}
{
  "slack": {
    "webhook_url": "https://hooks.slack.com/services/IB6JgRmRJ/eL7Hgo6kF/CckJm8E4Yt8X3i6QRKHWBekc",
    "username": "sensu",
    "channel": "#ops",
    "timeout": 10
  }
}
{{< /code >}}

### Integration Specification

#### `slack` attributes

The following attributes are configured within the `{"slack": {} }`
[configuration scope][4].

webhook_url  | 
-------------|------
description  | The Slack incoming webhook URL - [https://api.slack.com/incoming-webhooks][3].
required     | true
type         | String
example      | "webhook_url": "https://hooks.slack.com/services/IB6JgRmRJ/eL7Hgo6kF/CckJm8E4Yt8X3i6QRKHWBekc"

channel      | 
-------------|------
description  | The Slack channel to notify.
required     | false
type         | String
default      | `#general`
example      | {{< code shell >}}"channel": "#ops"{{< /code >}}

username     | 
-------------|------
description  | The Slack username to use to notify the channel.
required     | false
type         | String
default      | `sensu`
example      | {{< code shell >}}"username": "monitoring"{{< /code >}}

icon_url     | 
-------------|------
description  | The Slack icon URL to use for notifications.
required     | false
type         | String
default      | `http://www.gravatar.com/avatar/9b37917076cee4e2d331a785f3426640`
example      | {{< code shell >}}"icon_url": "http://www.gravatar.com/avatar/9b37917076cee4e2d331a785f3426640"{{< /code >}}

templates    | 
-------------|------
description  | A set of attributes that configure Slack notification [`templates` configuration][5].
required     | false
type         | Hash
example      | {{< code shell >}}
"templates": {
  "text": "/etc/sensu/slack/text_template.erb"
}
{{< /code >}}

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

#### `templates` attributes

The following attributes are configured within the `{"slack": { "templates": {}
} }` [configuration scope][4].

text         | 
-------------|------
description  |  Path to the Slack attachment text ERB template file, which must be accessible by the `sensu` system user. If an attachment text subject template is not provided, a built-in default template will be used.
required     | false
type         | String
example      | {{< code shell >}}"text": "/etc/sensu/slack/text_template.erb"{{< /code >}}

[?]:  #
[1]:  /sensu-enterprise
[2]:  https://slack.com?ref=sensu-enterprise
[3]:  https://api.slack.com/incoming-webhooks?ref=sensu-enterprise
[4]:  /sensu-core/1.2/reference/configuration/#reference-documentation
[5]:  #templates-attributes
[6]:  /sensu-core/1.2/reference/configuration/#configuration-scopes
