---
title: "Event Stream"
description: "Send Sensu events to a remote TCP socket for complex event processing and/or long-term storage."
product: "Sensu Enterprise"
version: "3.4"
weight: 15
menu:
  sensu-enterprise-3.4:
    parent: integrations
---
**ENTERPRISE: Built-in integrations are available for [Sensu Enterprise][1]
users only.**

- [Overview](#overview)
- [Configuration](#configuration)
  - [Example(s)](#examples)
  - [Integration Specification](#integration-specification)
    - [`event_stream` attributes](#eventstream-attributes)

## Overview

The event stream integrations sends **all** [Sensu events][2] to a remote TCP
socket for [complex event processing][3] (or "stream processing") and/or
long-term storage.

## Configuration

### Example(s) {#examples}

The following is an example configuration for the `event_stream` enterprise
event handler (integration).

{{< highlight json >}}
{
  "event_stream": {
    "host": "127.0.0.1",
    "port": 3000,
    "filter_metrics": true,
    "filter_ok_keepalives": true,
    "ring_buffer_size": 500
  }
}
{{< /highlight >}}


### Integration specification

#### `event_stream` attributes {#eventstream-attributes}

host         | 
-------------|------
description  | The remote host address.
required     | false
type         | String
default      | `127.0.0.1`
example      | {{< highlight shell >}}"host": "moogserver-01.company.com"{{< /highlight >}}

port         | 
-------------|------
description  | The remote TCP port.
required     | false
type         | Integer
default      | `3000`
example      | {{< highlight shell >}}"port": 3333{{< /highlight >}}

filter_metrics | 
---------------|------
description    | If [events][2] with a `type` of `metric` are relayed to the remote socket.
required       | false
type           | Boolean
default        | `false`
example        | {{< highlight shell >}}"filter_metrics": true{{< /highlight >}}

filter_ok_keepalives | 
---------------------|------
description          | If OK keepalive [events][2] are relayed to the remote socket.
required             | false
type                 | Boolean
default              | `false`
example              | {{< highlight shell >}}"filter_ok_keepalives": true{{< /highlight >}}

ring_buffer_size     | 
---------------------|------
description          | By default, the event stream integration uses a data stream buffer to protect Sensu Enterprise from reaching an out-of-memory state. The `ring_buffer_size` attribute sets the limit for writes to the buffer. In the event of a connection interruption, the buffer begins discarding older data once it reaches the limit. Once the connection is re-established, the event stream sends the remaining data in the buffer. To disable the buffer, set `ring_buffer_size` to `0`.
required             | false
type                 | Integer
default              | `1000`
example              | {{< highlight shell >}}"ring_buffer_size": 1500{{< /highlight >}}

[1]:  /sensu-enterprise
[2]:  /sensu-core/1.2/reference/events
[3]:  https://en.wikipedia.org/wiki/Complex_event_processing
