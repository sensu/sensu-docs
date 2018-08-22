---
title: "OpenTSDB"
description: "Send metrics to OpenTSDB using the telnet protocol."
product: "Sensu Enterprise"
version: "3.1"
weight: 19
menu:
  sensu-enterprise-3.1:
      parent: integrations
---
**ENTERPRISE: Built-in integrations are available for [Sensu Enterprise][1]
users only.**

- [Overview](#overview)
- [Configuration](#configuration)
  - [Example(s)](#examples)
  - [Integration Specification](#integration-specification)
    - [`opentsdb` attributes](#opentsdb-attributes)

## Overview

Send metrics to [OpenTSDB][2] using the telnet protocol (over TCP). This
handler uses the `output_format`mutator.

## Configuration

### Example(s) {#examples}

The following is an example global configuration for the `opentsdb` enterprise
handler (integration).

{{< highlight json >}}
{
  "opentsdb": {
    "host": "opentsdb.example.com",
    "port": 4242,
    "tag_host": true,
    "tags": {
      "dc": "us-central-1"
    }
  }
}
{{< /highlight >}}

### Integration Specification

#### `opentsdb` attributes

The following attributes are configured within the `{"opentsdb": {} }`
[configuration scope][3].

host         | 
-------------|------
description  | The OpenTSDB host address.
required     | false
type         | String
default      | `127.0.0.1`
example      | {{< highlight shell >}}"host": "opentsdb.example.com"{{< /highlight >}}

port         | 
-------------|------
description  | The OpenTSDB telnet listener port.
required     | false
type         | Integer
default      | `4242`
example      | {{< highlight shell >}}"port": 4444{{< /highlight >}}

tag_host     | 
-------------|------
description  | If automatic host tagging should be used for metric data points. The Sensu client `name` is used as the `host` tag value. The OpenTSDB handler will always add a `host` tag to metric data points that do not have tags.
required     | false
type         | Boolean
default      | `true`
example      | {{< highlight shell >}}"tag_host": false{{< /highlight >}}

prefix_source | 
--------------|------
description   | If the Sensu source (client name) should prefix (added to) the metric names.
required      | false
type          | Boolean
default       | `false`
example       | {{< highlight shell >}}"prefix_source": true{{< /highlight >}}

prefix       | 
-------------|------
description  | A custom metric name prefix.
required     | false
type         | String
example      | {{< highlight shell >}}"prefix": "production"{{< /highlight >}}

tags           | 
---------------|------
description    | Configurable custom tags (key/value pairs) to add to every OpenTSDB metric data point.
required       | false
type           | Hash
default        | {{< highlight shell >}}{}{{< /highlight >}}
example        | {{< highlight shell >}}
"tags": {
  "dc": "us-central-1"
}
{{< /highlight >}}

[1]:  /sensu-enterprise
[2]:  http://opentsdb.net?ref=sensu-enterprise
[3]:  /sensu-core/1.2/reference/configuration#configuration-scopes
