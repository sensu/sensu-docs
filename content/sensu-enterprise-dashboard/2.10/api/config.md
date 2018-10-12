---
title: "Configuration API"
description: "Sensu Configuration API reference documentation."
product: "Sensu Enterprise Dashboard"
version: "2.10"
menu:
  sensu-enterprise-dashboard-2.10:
    parent: api
---

## Reference documentation

- [The `/config` API endpoint](#the-config-endpoint)
  - [`/config` (GET)](#config-get)

## The `/config` API endpoint {#the-config-endpoint}

The `/config` API provides HTTP GET access to the Sensu Enterprise
configuration. Sensitive setting values are redacted by
default.

### `/config` (GET)

#### EXAMPLE {#config-get-example}

The following example demonstrates a request to the `/config` API, resulting in
a JSON Hash containing the Sensu Enterprise configuration.

{{< highlight shell >}}
$ curl -s http://127.0.0.1:3000/config | jq .
{
  "Sensu": [
    {
      "Advanced": {
        "CloseRequest": false,
        "DisableKeepAlives": false,
        "Tracing": false
      },
      "Name": "sensu1",
      "Host": "127.0.0.1",
      "Port": 4567,
      "Ssl": false,
      "Insecure": false,
      "URL": "http://127.0.0.1:4567",
      "User": "*****",
      "Path": "",
      "Pass": "*****",
      "Timeout": 10
    }
  ],
  "Uchiwa": {
    "...": "..."
  },
  "Auth": {
    "...": "..."
  },
  "...": "...",
  "...": "..."
}
{{< /highlight >}}

#### API Specification {#config-get-specification}

/config (GET) | 
----------------|------
description     | Returns the Sensu Enterprise configuration.
example url     | http://hostname:3000/config
response type   | Hash
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output          | {{< highlight json >}}{
  "Sensu": [
    {
      "Advanced": {
        "CloseRequest": false,
        "DisableKeepAlives": false,
        "Tracing": false
      },
      "Name": "sensu1",
      "Host": "127.0.0.1",
      "Port": 4567,
      "Ssl": false,
      "Insecure": false,
      "URL": "http://127.0.0.1:4567",
      "User": "*****",
      "Path": "",
      "Pass": "*****",
      "Timeout": 10
    }
  ],
  "...": "..."
}
{{< /highlight >}}
