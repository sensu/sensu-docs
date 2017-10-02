---
title: "Settings API"
product: "Sensu Core"
version: "1.0"
weight: 9
menu: "sensu-core-1.0"
---
# Sensu Settings API

## Reference documentation

- [The `/settings` API endpoint](#the-settings-endpoint)
  - [`/settings` (GET)](#settings-get)

## The `/settings` API endpoint

### `/settings` (GET)

The `/settings` API provides HTTP GET access to the APIs running
configuration settings. Sensitive setting values are redacted by
default, unless the URL query parameter `redacted` is set to `false`,
e.g. `/settings?redacted=false.`

#### EXAMPLE {#settings-get-example}

The following example demonstrates a request to the `/settings` API, resulting in
a JSON Hash containing the APIs running configuration settings.

~~~ shell
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
~~~

#### API Specification {#settings-get-specification}

/settings (GET) | 
----------------|------
description     | Returns the APIs running configuration settings.
example url     | http://hostname:4567/settings
parameters      | - `redacted`:<br>&emsp;- **required**: false<br>&emsp;- **type**: Boolean<br>&emsp;- **description**: If sensitive setting values should be redacted.<br>&emsp;- **default**: true
response type   | Hash
response codes  | - **Success**: 200 (OK)<br>- **Error**: 500 (Internal Server Error)
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
