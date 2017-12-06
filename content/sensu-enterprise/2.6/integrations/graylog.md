---
title: "Graylog"
description: "Send Sensu events to Graylog via the Graylog Raw/Plaintext TCP input."
product: "Sensu Enterprise"
version: "1.0"
weight: 10
menu:
  sensu-enterprise-1.0:
    parent: integrations
---
**ENTERPRISE: Built-in integrations are available for [Sensu Enterprise][1]
users only.**

- [Overview](#overview)
- [Configuration](#configuration)
  - [Example(s)](#examples)
  - [Integration Specification](#integration-specification)
    - [`graylog` attributes](#graylog-attributes)

## Overview

The integration sends event data to a [Graylog][2] [Raw/Plaintext TCP input][3].
This integration requires a Graylog [JSON extractor][4].

## Configuration

### Example(s) {#examples}

The following is an example configuration for the `graylog` enterprise event
handler (integration).

{{< highlight json >}}
{
  "graylog": {
    "host": "127.0.0.1",
    "port": 5555,
    "timeout": 10
  }
}
{{< /highlight >}}

### Integration specification

#### `graylog` attributes

host         | 
-------------|------
description  | The Graylog [Raw/Plaintext TCP input][3] host address.
required     | false
type         | String
default      | `127.0.0.1`
example      | {{< highlight shell >}}"host": "graylog.company.com"{{< /highlight >}}

port         | 
-------------|------
description  | The Graylog [Raw/Plaintext TCP input][3] port.
required     | false
type         | Integer
default      | `5555`
example      | {{< highlight shell >}}"port": 5556{{< /highlight >}}

timeout      | 
-------------|------
description  | The handler execution duration timeout in seconds (hard stop).
required     | false
type         | Integer
default      | `10`
example      | {{< highlight shell >}}"timeout": 30{{< /highlight >}}

[1]:  /sensu-enterprise
[2]:  https://www.graylog.org/
[3]:  http://docs.graylog.org/en/2.0/pages/sending_data.html#raw-plaintext-inputs
[4]:  http://docs.graylog.org/en/2.0/pages/extractors.html?highlight=json%20extractor#using-the-json-extractor
