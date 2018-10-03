---
title: "Configuration API"
description: "Sensu Configuration API reference documentation."
product: "Sensu Enterprise Dashboard"
version: "2.12"
menu:
  sensu-enterprise-dashboard-2.12:
    parent: api
---

## Reference documentation

- [The `/config` API endpoint](#the-config-endpoint)
  - [`/config` (GET)](#config-get)

## The `/config` API endpoint {#the-config-endpoint}

### `/config` (GET)

The `/config` API provides HTTP GET access to the APIs running
configuration config. Sensitive setting values are redacted by
default, unless the URL query parameter `redacted` is set to `false`,
e.g. `/config?redacted=false.`

#### EXAMPLE {#config-get-example}

The following example demonstrates a request to the `/config` API, resulting in
a JSON Hash containing the APIs running configuration config.

{{< highlight shell >}}
$ curl -s http://127.0.0.1:3000/config | jq .
{
  "api": {
    "cors": {
      "Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      "Credentials": "true",
      "Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Origin": "*"
    },
    "password": "REDACTED",
    "user": "admin"
  },
  "checks": {
    "...": "..."
  },
  "...": "..."
}
{{< /highlight >}}

#### API Specification {#config-get-specification}

/config (GET) | 
----------------|------
description     | Returns the APIs running configuration config.
example url     | http://hostname:3000/config
parameters      | <ul><li>`redacted`:<ul><li>**required**: false</li><li>**type**: Boolean</li><li>**description**: If sensitive setting values should be redacted.</li><li>**default**: true</li></ul>
response type   | Hash
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output          | {{< highlight json >}}{
  "api": {
    "cors": {
      "Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      "Credentials": "true",
      "Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Origin": "*"
    },
    "password": "REDACTED",
    "user": "admin"
  },
  "checks": {
    "...": "..."
  },
  "...": "..."
}
{{< /highlight >}}
