---
title: "Librato"
description: "Send metrics to Librato using the Librato HTTP API."
product: "Sensu Enterprise"
version: "2.6"
weight: 20
menu:
  sensu-enterprise-2.6:
    parent: integrations
---
**ENTERPRISE: Built-in integrations are available for [Sensu Enterprise][1]
users only.**

- [Overview](#overview)
- [Configuration](#configuration)
  - [Example(s)](#examples)
  - [Integration Specification](#integration-specification)
    - [`librato` attributes](#librato-attributes)

## Overview

Send metrics to [Librato][2] Metrics using the HTTP API.

## Configuration

### Example(s) {#examples}

The following is an example global configuration for the `librato` enterprise
handler (integration).

{{< highlight json >}}
{
  "librato": {
    "email": "support@example.com",
    "api_key": "90SHpjPOFqd2YJFIX9rzDq7ik6CiDmqu2AvqcXJAX3buIwcOGqIOgNilwKMjpStO"
  }
}
{{< /highlight >}}

### Integration Specification

#### `librato` attributes

The following attributes are configured within the `{"librato": {} }`
[configuration scope][3].

email        | 
-------------|------
description  | The Librato account email.
required     | true
type         | String
example      | {{< highlight shell >}}"email": "support@example.com"{{< /highlight >}}

api_key      | 
-------------|------
description  | The Librato account API key.
required     | true
type         | String
example      | {{< highlight shell >}}"api_key": "90SHpjPOFqd2YJFIX9rzDq7ik6CiDmqu2AvqcXJAX3buIwcOGqIOgNilwKMjpStO"{{< /highlight >}}


[?]:  #
[1]:  /sensu-enterprise
[2]:  https://www.librato.com?ref=sensu-enterprise
[3]:  /sensu-core/1.0/reference/configuration#configuration-scopes
