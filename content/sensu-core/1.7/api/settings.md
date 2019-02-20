---
title: "Settings API"
description: "Sensu Settings API reference documentation."
product: "Sensu Core"
version: "1.7"
weight: 9
menu:
  sensu-core-1.7:
    parent: api
---

## Reference documentation

- [The `/settings` API endpoint](#the-settings-endpoint)
  - [`/settings` (GET)](#settings-get)

## The `/settings` API endpoint {#the-settings-endpoint}

### `/settings` (GET)

The `/settings` API provides HTTP GET access to the APIs running
configuration settings. Sensitive setting values are redacted by
default, unless the URL query parameter `redacted` is set to `false`,
e.g. `/settings?redacted=false.`

#### EXAMPLE {#settings-get-example}

The following example demonstrates a request to the `/settings` API, resulting in
a JSON Hash containing the APIs running configuration settings.

{{< highlight shell >}}
$ curl -s http://127.0.0.1:4567/settings | jq .
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

#### API Specification {#settings-get-specification}

/settings (GET) | 
----------------|------
description     | Returns the APIs running configuration settings.
example url     | http://hostname:4567/settings
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
