---
title: "Email"
description: "User documentation for the built-in email integration in Sensu Enterprise. Send email notifications for events via SMTP."
product: "Sensu Enterprise"
version: "2.8"
weight: 1
menu:
  sensu-enterprise-2.8:
    parent: integrations
---
**ENTERPRISE: Built-in integrations are available for [Sensu Enterprise][1]
users only.**

- [Overview](#overview)
- [Custom email templates](#custom-email-templates)
  - [Example(s)](#examples-custom-email-templates-example)
- [Configuration](#configuration)
  - [Example(s)](#examples)
  - [Integration specification](#integration-specification)
    - [`email` attributes](#email-attributes)
    - [`smtp` attributes](#smtp-attributes)
      - [EXAMPLE](#smtp-attributes-example)
      - [ATTRIBUTES](#attributes-smtp-attributes-specification)
    - [`templates` attributes](#templates-attributes)

## Overview

Send email notifications for events, using SMTP.

## Custom email templates

As of Sensu Enterprise version 2.3, the Sensu Enterprise email integration
provides support for creating custom email templates using ERB (a templating
language based on Ruby). Sensu Enterprise makes an `@event` variable available to
the ERB template containing the complete [event data payload][4].

_NOTE: the Puppet reference documentation provides a helpful [introduction to
ERB templating syntax][5]._

### Example(s) {#examples-custom-email-templates-example}

The following examples demonstrate how to access the Sensu `@event` variable from custom ERB templates.

_NOTE: The body template example includes the `datacenter` attribute, which is only available to be used in a template when defined as a [client custom attribute][6]_

**/etc/sensu/email/subject_template.erb**
{{< code ruby "erb" >}}
<%= ["ok","warning","critical","unknown"][@event[:check][:status]] %> - <%= @event[:client][:name] %>/<%= @event[:check][:name] %>: <%= @event[:check][:output] %>
{{< /code >}}

**/etc/sensu/email/body_template.erb**
{{< code ruby "erb" >}}
Hi there,

Sensu has detected a <%= @event[:check][:name] %> monitoring event.
Please note the following details:

Client: <%= @event[:client][:name] %>

Check: <%= @event[:check][:name] %>

Output: <%= @event[:check][:output] %>

For more information, please consult the Sensu Enterprise dashboard:

https://sensu.example.com/#/client/<%= @event[:client][:datacenter] %>/<%= @event[:client][:name] %>?check=<%= @event[:check][:name] %>

#monitoringlove,
Team Sensu
{{< /code >}}

## Configuration

### Example(s) {#examples}

The following is an example configuration for the `email` enterprise event
handler (integration).

{{< code json >}}
{
  "email": {
    "smtp": {
      "address": "smtp.example.com",
      "port": 587,
      "openssl_verify_mode": "none",
      "enable_starttls_auto": true,
      "authentication": "plain",
      "user_name": "postmaster@example.com",
      "password": "SECRET"
    },
    "to": "support@example.com",
    "from": "noreply@example.com",
    "content_type": "text/plain",
    "timeout": 10
  }
}
{{< /code >}}

### Integration specification

#### `email` attributes

The following attributes are configured within the `{"email": {} }`
[configuration scope][2].

smtp         | 
-------------|------
description  | A set of attributes that provides SMTP connection information to the email event handler.
required     | false
type         | Hash
default      | {{< code shell >}}"smtp": {
  "address": "127.0.0.1",
  "port": 25,
  "domain": "localhost.localdomain",
  "openssl_verify_mode": "none",
  "enable_starttls_auto": true,
  "user_name": null,
  "password": null,
  "authentication": "plain"
}{{< /code >}}
example      |  {{< code shell >}}"smtp": {
  "address": "smtp.example.com",
  "port": 587
}
{{< /code >}}

to           | 
-------------|------
description  | The default email address to send notification to.
required     | false
type         | String
default      | `root@localhost`
example      | {{< code shell >}}"to": "support@example.com"{{< /code >}}

from         | 
-------------|------
description  | The default email address to use as the sender.
required     | false
type         | String
default      | `sensu@localhost`
example      | {{< code shell >}}"from": "noreply@example.com"{{< /code >}}

content_type | 
-------------|------
description  | The email content type header. Can be used to enable HTML body content.
required     | false
type         | String
default      | `text/plain`
example      | {{< code shell >}}"content_type": "text/html"{{< /code >}}

templates    | 
-------------|------
description  | A set of attributes that provides email [`templates` configuration][3].
required     | false
type         | Hash
example      | {{< code shell >}}"templates": {
  "subject": "/etc/sensu/email/subject_template.erb",
  "body": "/etc/sensu/email/body_template.erb"
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

#### `smtp` attributes

The following attributes are configured within the `{"email": { "smtp": {} } }`
[configuration scope][2].

##### EXAMPLE {#smtp-attributes-example}

{{< code json >}}
{
  "email": {
    "smtp": {
      "address": "smtp.example.com",
      "port": 587,
      "...": "..."
    },
    "to": "support@example.com",
    "from": "noreply@example.com",
    "timeout": 10
  }
}
{{< /code >}}

##### ATTRIBUTES {#smtp-attributes-specification}

address      | 
-------------|------
description  | The hostname or IP address of the SMTP server
type         | String
required     | false
default      | "127.0.0.1"
example      | {{< code shell >}}"address": "smtp.example.com"{{< /code >}}

port         | 
-------------|------
description  | The SMTP sever port
type         | Integer
required     | false
default      | `25`
example      | {{< code shell >}}"port": 25{{< /code >}}

domain       | 
-------------|------
description  | The domain the SMTP server should use to send email from.
type         | String
required     | false
default      | `localhost.localdomain`
example      | {{< code shell >}}"domain": "localhost.localdomain"{{< /code >}}

openssl_verify_mode | 
--------------------|------
description         | What SSL verification mode Sensu should use to establish a connection with the SMTP server.
type                | String
required            | false
default             | `none`
example             | {{< code shell >}}"openssl_verify_mode": "none"{{< /code >}}

enable_starttls_auto | 
---------------------|------
description          | Whether Sensu should use `STARTTLS` (or "Opportunistic TLS") to upgrade insecure connections with TLS encryption, when possible. Sensu Enterprise uses TLSv1.2, ONLY supporting TLSv1.0+.
type                 | Boolean
required             | false
default              | `true`
example              | {{< code shell >}}"enable_starttls_auto": true{{< /code >}}

tls          | 
-------------|------
description  | Whether Sensu should use TLS encryption for connections. Sensu Enterprise uses TLSv1.2, ONLY supporting TLSv1.0+.
type         | Boolean
required     | false
default      | `false`
example      | {{< code shell >}}"tls": true{{< /code >}}

user_name    | 
-------------|------
description  | The username credential Sensu should use to authenticate to the SMTP server.
type         | String
required     | false
example      | {{< code shell >}}"username": "monitoring@example.com"{{< /code >}}

password     | 
-------------|------
description  | The password credential Sensu should use to authenticate to the SMTP server.
type         | String
required     | false
example      | {{< code shell >}}"passsword": "PASSWORD"{{< /code >}}

authentication | 
---------------|------
description    | The authentication method should Sensu use when connecting to the SMTP server.
type           | String
required       | false
default        | `plain`
example        | {{< code shell >}}"authentication": "plain"{{< /code >}}

#### `templates` attributes

The following attributes are configured within the `{"email": { "templates": {}
} }` [configuration scope][2].

subject      | 
-------------|------
description  | Path to the email subject [ERB][5] template file, which must be accessible by the `sensu` system user. If an email subject template is not provided, a built-in default template will be used.
type         | String
required     | false
example      | {{< code shell >}}"subject": "/etc/sensu/email/subject_template.erb"{{< /code >}}

body         | 
-------------|------
description  | Path to the email body [ERB][5] template file, which must be accessible by the `sensu` system user. If an email body template is not provided, a built-in default template will be used.
type         | String
required     | false
example      | {{< code shell >}}"body": "/etc/sensu/email/body_template.erb"{{< /code >}}

[?]:  #
[1]:  /sensu-enterprise
[2]:  /sensu-core/1.2/reference/configuration#configuration-scopes
[3]:  #templates-attributes
[4]:  /sensu-core/1.2/reference/events#event-data
[5]:  https://docs.puppet.com/puppet/latest/lang_template_erb.html
[6]:  /sensu-core/1.4/reference/clients/#custom-attributes
