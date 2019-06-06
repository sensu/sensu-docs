---
title: "InfluxDB"
product: "Sensu Enterprise"
version: "2.7"
weight: 16
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
`description`       | output from the check
`occurrences`       | event occurrence count

Annotation data can be used to overlay the status of Sensu checks on a graph of other metrics recorded in InfluxDB.

## Configuration

### Example(s) {#examples}

The following is an example global configuration for the influxdb enterprise
handler (integration).

{{< highlight json >}}
{
  "influxdb": {
    "host": "8.8.8.8",
    "port": 8086,
    "username": "root",
    "password": "Bfw3Bdrn5WfqvOl1",
    "api_version": "0.9"
  }
}
{{< /highlight >}}

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
example      | {{< highlight shell >}}"host": "8.8.8.8"{{< /highlight >}}

port         | 
-------------|------
description  | The InfluxDB HTTP API port.
required     | false
type         | Integer
default      | `8086`
example      | {{< highlight shell >}}"port": 9096{{< /highlight >}}

username     | 
-------------|------
description  | The InfluxDB username.
required     | false
type         | String
default      | `root`
example      | {{< highlight shell >}}"username": "sensu"{{< /highlight >}}

password     | 
-------------|------
description  | The InfluxDB user password.
required     | false
type         | String
default      | `root`
example      | {{< highlight shell >}}"password": "secret"{{< /highlight >}}

database     | 
-------------|------
description  | The InfluxDB database (name) to use.
required     | false
type         | String
default      | `db`
example      | {{< highlight shell >}}"database": "sensu"{{< /highlight >}}

api_version    | 
---------------|------
description    | The InfluxDB API version.
required       | false
type           | String
allowed values | `0.8`, `0.9`
default        | `0.8`
example        | {{< highlight shell >}}"api_version": "0.9"{{< /highlight >}}

http_proxy   | |
-------------|------
description  | The URL of a proxy to be used for HTTP requests.
required     | false
type         | String
example      | {{< highlight shell >}}"http_proxy": "http://192.168.250.11:3128"{{< /highlight >}}

timeout      | 
-------------|------
description  | The InfluxDB HTTP API POST timeout (write).
required     | false
type         | Integer
default      | `10`
example      | {{< highlight shell >}}"timeout": 3{{< /highlight >}}

ssl          | 
-------------|------
description  | Enables communication over HTTPS.
required     | false
type         | Boolean
default      | `false`
example      | {{< highlight shell >}}"ssl": true{{< /highlight >}}


[1]:  /sensu-enterprise
[2]:  https://influxdata.com?ref=sensu-enterprise
[3]:  /sensu-core/1.0/reference/configuration#configuration-scopes
