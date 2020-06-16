---
title: "Chef"
description: "Deregister Sensu clients from the client registry, if they no longer have associated Chef node data."
product: "Sensu Enterprise"
version: "3.2"
weight: 13
menu:
  sensu-enterprise-3.2:
    parent: integrations
---
**ENTERPRISE: Built-in integrations are available for [Sensu Enterprise][1]
users only.**

- [Overview](#overview)
- [Configuration](#configuration)
  - [Example(s)](#examples)
  - [Integration Specification](#integration-specification)
    - [`chef` attributes](#chef-attributes)

## Overview

Deregister Sensu clients from the client registry, if they no longer have
associated [Chef][2] [node data][3]. This integration can only work if Sensu
clients are named using the Chef node name, for the machine on which they
reside. The `chef` enterprise handler requires Chef Server API credentials, the
local chef-client configuration can be used as a reference.

## Configuration

### Example(s) {#examples}

The following is an example global configuration for the `chef` enterprise
handler (integration).

{{< code json >}}
{
  "chef": {
    "endpoint": "https://api.chef.io/organizations/example",
    "flavor": "enterprise",
    "client": "i-424242",
    "key": "/etc/chef/i-424242.pem",
    "ssl_pem_file": "/etc/chef/ssl.pem",
    "ssl_verify": true,
    "proxy_address": "proxy.example.com",
    "proxy_port": 8080,
    "proxy_username": "chef",
    "proxy_password": "secret",
    "timeout": 10
  }
}
{{< /code >}}

### Integration Specification

_NOTE: the following integration definition attributes may be overwritten by
the corresponding Sensu [client definition `chef` attributes][4], which are
included in [event data][5]._

#### `chef` attributes

The following attributes are configured within the `{"chef": {} }`
[configuration scope][6].

endpoint     | 
-------------|------
description  | The Chef Server API endpoint (URL).
required     | true
type         | String
example      | {{< code shell >}}"endpoint": "https://api.chef.io/organizations/example"{{< /code >}}

flavor         | 
---------------|------
description    | The Chef Server flavor (is it enterprise?).
required       | false
type           | String
allowed values | `enterprise` (for Hosted Chef and Enterprise Chef) and `open_source` (for Chef Zero and Open Source Chef Server)
example        | {{< code shell >}}"flavor": "enterprise"{{< /code >}}

client       | 
-------------|------
description  | The Chef Client name to use when authenticating/querying the Chef Server API.
required     | true
type         | String
example      | {{< code shell >}}"client": "sensu-server"{{< /code >}}

key          | 
-------------|------
description  | The Chef Client key to use when authenticating/querying the Chef Server API.
required     | true
type         | String
example      | {{< code shell >}}"key": "/etc/chef/i-424242.pem"{{< /code >}}

ssl_pem_file | 
-------------|------
description  | The Chef SSL pem file use when querying the Chef Server API.
required     | false
type         | String
example      | {{< code shell >}}"ssl_pem_file": "/etc/chef/ssl.pem"{{< /code >}}

ssl_verify   | 
-------------|------
description  | If the SSL certificate will be verified when querying the Chef Server API.
required     | false
type         | Boolean
default      | `true`
example      | {{< code shell >}}"ssl_verify": false{{< /code >}}

proxy_address | 
--------------|------
description   | The HTTP proxy address.
required      | false
type          | String
example       | {{< code shell >}}"proxy_address": "proxy.example.com"{{< /code >}}

proxy_port   | 
-------------|------
description  | The HTTP proxy port (if there is a proxy).
required     | false
type         | Integer
example      | {{< code shell >}}"proxy_port": 8080{{< /code >}}

proxy_username | 
---------------|------
description    | The HTTP proxy username (if there is a proxy).
required       | false
type           | String
example        | {{< code shell >}}"proxy_username": "chef"{{< /code >}}

proxy_password | 
---------------|------
description    | The HTTP proxy user password (if there is a proxy).
required       | false
type           | String
example        | {{< code shell >}}"proxy_password": "secret"{{< /code >}}

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
[2]:  https://www.chef.io?ref=sensu-enterprise
[3]:  https://docs.chef.io/nodes.html
[4]:  /sensu-core/1.2/reference/clients#chef-attributes
[5]:  /sensu-core/1.2/reference/events#event-data
[6]:  /sensu-core/1.2/reference/configuration#configuration-scopes
