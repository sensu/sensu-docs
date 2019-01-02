---
title: "Handlers API"
description: "Sensu Go handlers API reference documentation"
version: "5.1"
product: "Sensu Go"
menu:
  sensu-go-5.1:
    parent: api
---

- [The `/handlers` API endpoint](#the-handlers-api-endpoint)
	- [`/handlers` (GET)](#handlers-get)
	- [`/handlers` (POST)](#handlers-post)
- [The `/handlers/:handler` API endpoint](#the-handlershandler-api-endpoint)
	- [`/handlers/:handler` (GET)](#handlershandler-get)
  - [`/handlers/:handler` (PUT)](#handlershandler-put)
  - [`/handlers/:handler` (DELETE)](#handlershandler-delete)

## The `/handlers` API endpoint

### `/handlers` (GET)

The `/handlers` API endpoint provides HTTP GET access to [handler][1] data.

#### EXAMPLE {#handlers-get-example}

The following example demonstrates a request to the `/handlers` API, resulting in
a JSON Array containing [handler definitions][1].

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/namespaces/default/handlers -H "Authorization: Bearer TOKEN"
[
  {
    "metadata": {
      "name": "slack",
      "namespace": "default",
      "labels": null,
      "annotations": null
    },
    "type": "pipe",
    "command": "handler-slack --webhook-url https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX --channel monitoring",
    "timeout": 0,
    "handlers": null,
    "filters": null,
    "env_vars": null,
    "runtime_assets": null
  }
]
{{< /highlight >}}

#### API Specification {#handlers-get-specification}

/handlers (GET)  | 
---------------|------
description    | Returns the list of handlers.
example url    | http://hostname:8080/api/core/v2/namespaces/default/handlers
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "metadata": {
      "name": "slack",
      "namespace": "default",
      "labels": null,
      "annotations": null
    },
    "type": "pipe",
    "command": "handler-slack --webhook-url https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX --channel monitoring",
    "timeout": 0,
    "handlers": null,
    "filters": null,
    "env_vars": null,
    "runtime_assets": null
  },
  {
    "metadata": {
      "name": "influx-db",
      "namespace": "default",
      "labels": null,
      "annotations": null
    },
    "type": "pipe",
    "command": "sensu-influxdb-handler --addr 'http://123.4.5.6:8086' --db-name 'sensu' --username 'sensu' --password 'password'",
    "timeout": 0,
    "handlers": null,
    "filters": null,
    "env_vars": null,
    "runtime_assets": null
  }
]
{{< /highlight >}}

### `/handlers` (POST)

/handlers (POST) | 
----------------|------
description     | Create a Sensu handler.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/handlers
payload         | {{< highlight shell >}}
{
  "metadata": {
    "name": "influx-db",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "type": "pipe",
  "command": "sensu-influxdb-handler --addr 'http://123.4.5.6:8086' --db-name 'sensu' --username 'sensu' --password 'password'",
  "timeout": 0,
  "handlers": null,
  "filters": null,
  "env_vars": null,
  "runtime_assets": null
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/handlers/:handler` API endpoint {#the-handlershandler-api-endpoint}

### `/handlers/:handler` (GET) {#handlershandler-get}

The `/handlers/:handler` API endpoint provides HTTP GET access to [handler data][1] for specific `:handler` definitions, by handler `name`.

#### EXAMPLE {#handlershandler-get-example}

In the following example, querying the `/handlers/:handler` API returns a JSON Map
containing the requested [`:handler` definition][1] (in this example: for the `:handler` named
`slack`).

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/namespaces/default/handlers/slack -H "Authorization: Bearer TOKEN"
{
  "metadata": {
    "name": "slack",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "type": "pipe",
  "command": "handler-slack --webhook-url https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX --channel monitoring",
  "timeout": 0,
  "handlers": null,
  "filters": null,
  "env_vars": null,
  "runtime_assets": null
}
{{< /highlight >}}

#### API Specification {#handlershandler-get-specification}

/handlers/:handler (GET) | 
---------------------|------
description          | Returns a handler.
example url          | http://hostname:8080/api/core/v2/namespaces/default/handlers/slack
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "metadata": {
    "name": "slack",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "type": "pipe",
  "command": "handler-slack --webhook-url https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX --channel monitoring",
  "timeout": 0,
  "handlers": null,
  "filters": null,
  "env_vars": null,
  "runtime_assets": null
}
{{< /highlight >}}

### `/handlers/:handler` (PUT) {#handlershandler-put}

#### API Specification {#handlershandler-put-specification}

/handlers/:handler (PUT) | 
----------------|------
description     | Create or update a Sensu handler.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/handlers/influx-db
payload         | {{< highlight shell >}}
{
  "metadata": {
    "name": "influx-db",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "type": "pipe",
  "command": "sensu-influxdb-handler --addr 'http://123.4.5.6:8086' --db-name 'sensu' --username 'sensu' --password 'password'",
  "timeout": 0,
  "handlers": null,
  "filters": null,
  "env_vars": null,
  "runtime_assets": null
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/handlers/:handler` (DELETE) {#handlershandler-delete}

#### API Specification {#handlershandler-delete-specification}

/handlers/:handler (DELETE) | 
--------------------------|------
description               | Removes a handler from Sensu given the handler name.
example url               | http://hostname:8080/api/core/v2/namespaces/default/handlers/slack
response codes            | <ul><li>**Success**: 202 (Accepted)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/handlers
