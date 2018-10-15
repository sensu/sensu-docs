---
title: "Subscriptions API"
description: "Sensu Subscriptions API reference documentation."
product: "Sensu Enterprise Dashboard"
version: "2.12"
menu:
  sensu-enterprise-dashboard-2.12:
    parent: api
---

- [The `/subscriptions` API endpoint](#the-subscriptions-api-endpoint)
  - [`/subscriptions` (GET)](#subscriptions-get)

## The `/subscriptions` API endpoint

The `/subscriptions` API endpoint provides HTTP GET access to subscription
data.

### `/subscriptions` (GET)

#### EXAMPLE {#subscriptions-get-example}

The following example demonstrates a request to the `/subscriptions` API, resulting in
a JSON Array of JSON Hashes containing subscription definitions.

{{< highlight shell >}}
$ curl -s http://127.0.0.1:3000/subscriptions | jq .
[
  {
    "dc": "us_west1",
    "name": "web_server"
  },
  {
    "dc": "us_west1",
    "name": "database"
  }
]{{< /highlight >}}

#### API Specification {#subscriptions-get-specification}

/subscriptions (GET)  | 
---------------|------
description    | Returns a list of subscriptions by `name` and datacenter (`dc`).
example url    | http://hostname:3000/subscriptions
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}[
  {
    "dc": "us_west1",
    "name": "web_server"
  },
  {
    "dc": "us_west1",
    "name": "database"
  }
]
{{< /highlight >}}
