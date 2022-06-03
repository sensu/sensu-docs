---
title: "Puppet"
description: "Deregister Sensu clients from the client registry if they no longer have an associated Puppet node."
product: "Sensu Enterprise"
version: "2.7"
weight: 12
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
    - [`puppet` attributes](#puppet-attributes)
    - [`ssl` attributes](#ssl-attributes)

## Overview

Deregister Sensu clients from the client registry if they no longer have an
associated [Puppet][2] node. The `puppet` enterprise handler requires access to
a SSL truststore and keystore, containing a valid (and whitelisted) Puppet
certificate, private key, and CA. The local Puppet agent certificate, private
key, and CA can be used.

## Configuration

### Example(s) {#examples}

The following is an example global configuration for the `puppet` enterprise
handler (integration).

{{< code json >}}
{
  "puppet": {
    "endpoint": "https://10.0.1.12:8081/pdb/query/v4/nodes/",
    "ssl": {
      "keystore_file": "/etc/sensu/ssl/puppet/keystore.jks",
      "keystore_password": "secret",
      "truststore_file": "/etc/sensu/ssl/puppet/truststore.jks",
      "truststore_password": "secret"
    },
    "timeout": 10
  }
}
{{< /code >}}

The Puppet enterprise handler is most commonly used as part of the `keepalive`
set handler. For example:

{{< code json >}}
{
  "handlers": {
    "keepalive": {
      "type": "set",
      "handlers": [
        "pagerduty",
        "puppet"
      ]
    }
  }
}
{{< /code >}}

When querying PuppetDB for a node, by default, Sensu will use the Sensu client's
name for the Puppet node name. Individual Sensu clients can override the name of
their corresponding Puppet node, using specific client definition attributes.

The following is an example client definition, specifying its Puppet node name.

{{< code json >}}
{
  "client": {
    "name": "i-424242",
    "address": "8.8.8.8",
    "subscriptions": [
      "production",
      "webserver"
    ],
    "puppet": {
      "node_name": "webserver01.example.com"
    }
  }
}
{{< /code >}}

### Integration Specification

_NOTE: the following integration definition attributes may be overwritten by
the corresponding Sensu [client definition `puppet` attributes][3], which are
included in [event data][4]._

#### `puppet` attributes

The following attributes are configured within the `{"puppet": {} }`
[configuration scope][5].

endpoint     | 
-------------|------
description  | The PuppetDB API endpoint (URL). If an API path is not specified, `/pdb/query/v4/nodes/` will be used.
required     | true
type         | String
example      | {{< code shell >}}"endpoint": "https://10.0.1.12:8081/pdb/query/v4/nodes/"{{< /code >}}

ssl          | 
-------------|------
description  | A set of attributes that configure SSL for PuppetDB API queries.
required     | true
type         | Hash
example      | {{< code shell >}}"ssl": {}{{< /code >}}

#### `ssl` attributes

The following attributes are configured within the `{"puppet": { "ssl": {} } }`
[configuration scope][3].

##### EXAMPLE {#ssl-attributes-example}

{{< code json >}}
{
  "puppet": {
    "endpoint": "https://10.0.1.12:8081/pdb/query/v4/nodes/",
    "...": "...",
    "ssl": {
      "keystore_file": "/etc/sensu/ssl/puppet/keystore.jks",
      "keystore_password": "secret",
      "truststore_file": "/etc/sensu/ssl/puppet/truststore.jks",
      "truststore_password": "secret"
    }
  }
}
{{< /code >}}

##### ATTRIBUTES {#ssl-attributes-specification}

keystore_file | 
--------------|------
description   | The file path for the SSL certificate keystore.
required      | true
type          | String
example       | {{< code shell >}}"keystore_file": "/etc/sensu/ssl/puppet/keystore.jks"{{< /code >}}

keystore_password | 
------------------|------
description       | The SSL certificate keystore password.
required          | true
type              | String
example           | {{< code shell >}}"keystore_password": "secret"{{< /code >}}

truststore_file | 
----------------|------
description     | The file path for the SSL certificate truststore.
required        | true
type            | String
example         | {{< code shell >}}"truststore_file": "/etc/sensu/ssl/puppet/truststore.jks"{{< /code >}}

truststore_password | 
--------------------|------
description         | The SSL certificate truststore password.
required            | true
type                | String
example             | {{< code shell >}}"truststore_password": "secret"{{< /code >}}

http_proxy   | |
-------------|------
description  | The URL of a proxy to be used for HTTP requests.
required     | false
type         | String
example      | {{< code shell >}}"http_proxy": "http://192.168.250.11:3128"{{< /code >}}

timeout      | |
-------------|------
description  | The handler execution duration timeout in seconds (hard stop).
required     | false
type         | Integer
default      | `10`
example      | {{< code shell >}}"timeout": 30{{< /code >}}


[?]:  #
[1]:  /sensu-enterprise
[2]:  https://puppet.com?ref=sensu-enterprise
[3]:  /sensu-core/1.0/reference/clients#puppet-attributes
[4]:  /sensu-core/1.0/reference/events#event-data
[5]:  /sensu-core/1.0/reference/configuration#configuration-scopes
