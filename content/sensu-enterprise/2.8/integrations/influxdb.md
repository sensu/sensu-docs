---
title: "InfluxDB"
product: "Sensu Enterprise"
version: "2.8"
weight: 16
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
    - [`influxdb` attributes](#influxdb-attributes)

## Overview

Send metrics to [InfluxDB][2] using the InfluxDB HTTP API.

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
    "api_version": "0.9",
    "tags": {
      "dc": "us-central-1"
    }
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

tags           | 
---------------|------
description    | Configurable custom tags (key/value pairs) to add to every InfluxDB measurement.
required       | false
type           | Hash
default        | {{< highlight shell >}}{}{{</ highlight >}}
example        | {{< highlight json >}}
"tags": {
  "dc": "us-central-1"
}
{{< /highlight >}}


timeout      | 
-------------|------
description  | The InfluxDB HTTP API POST timeout (write).
required     | false
type         | Integer
default      | `10`
example      | {{< highlight shell >}}"timeout": 3{{< /highlight >}}


[1]:  /sensu-enterprise
[2]:  https://influxdata.com?ref=sensu-enterprise
[3]:  /sensu-core/1.0/reference/configuration#configuration-scopes
