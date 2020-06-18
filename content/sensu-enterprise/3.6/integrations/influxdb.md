---
title: "InfluxDB"
product: "Sensu Enterprise"
version: "3.6"
weight: 16
menu:
  sensu-enterprise-3.6:
    parent: integrations
---
**ENTERPRISE: Built-in integrations are available for [Sensu Enterprise][1]
users only.**

- [Overview](#overview)
- [Configuration](#configuration)
  - [Example(s)](#examples)
  - [Integration Specification](#integration-specification)
    - [`influxdb` attributes](#influxdb-attributes)

## Overview

Send metrics to [InfluxDB][2] using the InfluxDB HTTP API.

When handling events with check `type`  of `metric` this integration will attempt to translate measurements from the specified `output_format` to InfluxDB measurements.

When handling events without check `type` of `metric` specified, this integration will record annotations to a measurement named `sensu_events`. These annotations are time series data which describe the status of a given check at a specific point in time, using the following attributes from the event:

annotation columns  | 
--------------------|-------
`time`              | influxdb timestamp
`check`             | name of the check
`status`            | check status
`client`            | client name
`action`            | action of the event
`description`       | output from the check (defaults to check output unless you specify a [notification][6] or [description][7])
`occurrences`       | event occurrence count

Annotation data can be used to overlay the status of Sensu checks on a graph of other metrics recorded in InfluxDB.


## Configuration

### Example(s) {#examples}

The following is an example global configuration for the influxdb enterprise
handler (integration).

{{< code json >}}
{
  "influxdb": {
    "host": "8.8.8.8",
    "port": 8086,
    "username": "root",
    "password": "Bfw3Bdrn5WfqvOl1",
    "api_version": "0.9",
    "tags": {
      "dc": "us-central-1"
    }
  }
}
{{< /code >}}

### Integration specification

#### `influxdb` attributes

The following attributes are configured within the `{"influxdb": {} }`
[configuration scope][3].

host         | 
-------------|------
description  | The InfluxDB host address.
required     | false
type         | String
default      | `127.0.0.1`
example      | {{< code shell >}}"host": "8.8.8.8"{{< /code >}}

port         | 
-------------|------
description  | The InfluxDB HTTP API port.
required     | false
type         | Integer
default      | `8086`
example      | {{< code shell >}}"port": 9096{{< /code >}}

username     | 
-------------|------
description  | The InfluxDB username.
required     | false
type         | String
default      | `root`
example      | {{< code shell >}}"username": "sensu"{{< /code >}}

password     | 
-------------|------
description  | The InfluxDB user password.
required     | false
type         | String
default      | `root`
example      | {{< code shell >}}"password": "secret"{{< /code >}}

database     | 
-------------|------
description  | The InfluxDB database (name) to use.
required     | false
type         | String
default      | `db`
example      | {{< code shell >}}"database": "sensu"{{< /code >}}

api_version    | 
---------------|------
description    | The InfluxDB API version.
required       | false
type           | String
allowed values | `0.8`, `0.9`
default        | `0.8`
example        | {{< code shell >}}"api_version": "0.9"{{< /code >}}

tags           | 
---------------|------
description    | Configurable custom tags (key/value pairs) to add to every InfluxDB measurement. _PRO TIP: Augment the tags applied to each measurement by specifying additional InfluxDB tags in check and client definitions. See the Sensu Core reference docs to configure InfluxDB [check attributes][4] and [client attributes][5]._
required       | false
type           | Hash
default        | {{< code shell >}}{}{{< /code >}}
example        | {{< code shell >}}
"tags": {
  "dc": "us-central-1"
}
{{< /code >}}

http_proxy   | |
-------------|------
description  | The URL of a proxy to be used for HTTP requests.
required     | false
type         | String
example      | {{< code shell >}}"http_proxy": "http://192.168.250.11:3128"{{< /code >}}

timeout      | 
-------------|------
description  | The InfluxDB HTTP API POST timeout (write).
required     | false
type         | Integer
default      | `10`
example      | {{< code shell >}}"timeout": 3{{< /code >}}

ssl          | 
-------------|------
description  | Enables communication over HTTPS.
required     | false
type         | Boolean
default      | `false`
example      | {{< code shell >}}"ssl": true{{< /code >}}


[1]:  /sensu-enterprise
[2]:  https://influxdata.com?ref=sensu-enterprise
[3]:  /sensu-core/latest/reference/configuration#configuration-scopes
[4]:  /sensu-core/latest/reference/checks#influxdb-attributes
[5]:  /sensu-core/latest/reference/clients#influxdb-attributes
[6]:  /sensu-core/latest/reference/checks#notification
[7]:  /sensu-core/latest/reference/checks#description
