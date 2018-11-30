---
title: "Checks API"
description: "Sensu Go checks API reference documentation"
version: "5.0"
product: "Sensu Go"
menu:
  sensu-go-5.0:
    parent: api
---

- [The `/checks` API endpoint](#the-checks-api-endpoint)
	- [`/checks` (GET)](#checks-get)
	- [`/checks` (POST)](#checks-post)
	- [`/checks` (PUT)](#checks-put)
- [The `/checks/:check` API endpoint](#the-checkscheck-api-endpoint)
	- [`/checks/:check` (GET)](#checkscheck-get)

## The `/checks` API endpoint

### `/checks` (GET)

The `/checks` API endpoint provides HTTP GET access to [check][1] data.

#### EXAMPLE {#checks-get-example}

The following example demonstrates a request to the `/checks` API, resulting in
a JSON Array containing [check definitions][1].

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/namespaces/default/checks -H "Authorization: Bearer TOKEN"
[
  {
    "command": "check-cpu.sh -w 75 -c 90",
    "handlers": [
      "slack"
    ],
    "interval": 60,
    "publish": true,
    "subscriptions": [
      "linux"
    ],
    "metadata": {
      "name": "check-cpu",
      "namespace": "default"
    }
  }
]
{{< /highlight >}}

#### API Specification {#check-get-specification}

/checks (GET)  | 
---------------|------
description    | Returns the list of checks.
example url    | http://hostname:8080/api/core/v2/namespaces/default/checks
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "command": "check-cpu.sh -w 75 -c 90",
    "handlers": [
      "slack"
    ],
    "interval": 60,
    "publish": true,
    "subscriptions": [
      "linux"
    ],
    "metadata": {
      "name": "check-cpu",
      "namespace": "default"
    }
  },
  {
    "command": "http_check.sh https://sensu.io",
    "handlers": [
      "slack"
    ],
    "interval": 15,
    "proxy_entity_name": "sensu.io",
    "publish": true,
    "subscriptions": [
      "site"
    ],
    "metadata": {
      "name": "check-sensu-site",
      "namespace": "default"
    }
  }
]
{{< /highlight >}}

### `/checks` (POST)

/checks (POST) | 
----------------|------
description     | Create a Sensu check.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/checks
payload         | {{< highlight shell >}}
{
  "command": "http_check.sh https://sensu.io",
  "handlers": [
    "slack"
  ],
  "interval": 15,
  "proxy_entity_name": "sensu.io",
  "publish": true,
  "subscriptions": [
    "site"
  ],
  "metadata": {
    "name": "check-sensu-site",
    "namespace": "default"
  }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/checks` (PUT)

/checks (PUT) | 
----------------|------
description     | Create or update a Sensu check.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/checks
payload         | {{< highlight shell >}}
{
  "command": "http_check.sh https://sensu.io",
  "handlers": [
    "slack"
  ],
  "interval": 15,
  "proxy_entity_name": "sensu.io",
  "publish": true,
  "subscriptions": [
    "site"
  ],
  "metadata": {
    "name": "check-sensu-site",
    "namespace": "default"
  }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/checks/:check` API endpoint {#the-checkscheck-api-endpoint}

### `/checks/:check` (GET) {#checkscheck-get}

The `/checks/:check` API endpoint provides HTTP GET access to [check data][1] for specific `:check` definitions, by check `name`.

#### EXAMPLE {#checkscheck-get-example}

In the following example, querying the `/checks/:check` API returns a JSON Map
containing the requested [`:check` definition][1] (in this example: for the `:check` named
`check-cpu`).

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check-cpu -H "Authorization: Bearer TOKEN"
{
  "command": "check-cpu.sh -w 75 -c 90",
  "handlers": [
    "slack"
  ],
  "interval": 60,
  "publish": true,
  "subscriptions": [
    "linux"
  ],
  "metadata": {
    "name": "check-cpu",
    "namespace": "default"
  }
}
{{< /highlight >}}

#### API Specification {#checkscheck-get-specification}

/checks/:check (GET) | 
---------------------|------
description          | Returns a check.
example url          | http://hostname:8080/api/core/v2/namespaces/default/checks/check-cpu
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "command": "check-cpu.sh -w 75 -c 90",
  "handlers": [
    "slack"
  ],
  "interval": 60,
  "publish": true,
  "subscriptions": [
    "linux"
  ],
  "metadata": {
    "name": "check-cpu",
    "namespace": "default"
  }
}
{{< /highlight >}}

[1]: ../../reference/checks
