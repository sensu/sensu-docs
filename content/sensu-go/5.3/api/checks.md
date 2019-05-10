---
title: "Checks API"
description: "The checks API provides HTTP access to check data. Here’s a reference for the checks API in Sensu Go, including examples for returning the list of checks, creating a Sensu check, and more. Read on for the full reference."
version: "5.3"
product: "Sensu Go"
menu:
  sensu-go-5.3:
    parent: api
---

- [The `/checks` API endpoint](#the-checks-api-endpoint)
	- [`/checks` (GET)](#checks-get)
	- [`/checks` (POST)](#checks-post)
- [The `/checks/:check` API endpoint](#the-checkscheck-api-endpoint)
	- [`/checks/:check` (GET)](#checkscheck-get)
  - [`/checks/:check` (PUT)](#checkscheck-put)
  - [`/checks/:check` (DELETE)](#checkscheck-delete)
- [The `/checks/:check/execute` API endpoint](#the-checkscheckexecute-api-endpoint)
  - [`/checks/:check/execute` (POST)](#checkscheckexecute-post)
- [The `/checks/:check/hooks/:type` API endpoint](#the-checkscheckhooks-api-endpoint)
  - [`/checks/:check/hooks/:type` (PUT)](#checkscheckhooks-put)
- [The `/checks/:check/hooks/:type/hook/:hook` API endpoint](#the-checkscheckhookshook-api-endpoint)
  - [`/checks/:check/hooks/:type/hook/:hook` (DELETE)](#checkscheckhookshook-delete)

## The `/checks` API endpoint

### `/checks` (GET)

The `/checks` API endpoint provides HTTP GET access to [check][1] data.

#### EXAMPLE {#checks-get-example}

The following example demonstrates a request to the `/checks` API, resulting in
a JSON Array containing [check definitions][1].

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_TOKEN" http://127.0.0.1:8080/api/core/v2/namespaces/default/checks

HTTP/1.1 200 OK
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

#### EXAMPLE {#checks-post-example}

In the following example, an HTTP POST request is submitted to the `/checks` API to create a `check-cpu` check.
The request includes the check definition in the request body and returns a successful HTTP 200 OK response and the created check definition.

{{< highlight shell >}}
curl -X POST \
-H "Authorization: Bearer $SENSU_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "command": "check-cpu.sh -w 75 -c 90",
  "subscriptions": [
    "linux"
  ],
  "interval": 60,
  "publish": true,
  "handlers": [
    "slack"
  ],
  "metadata": {
    "name": "check-cpu",
    "namespace": "default"
  }
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks

HTTP/1.1 200 OK
{
  "command": "check-cpu.sh -w 75 -c 90",
  "subscriptions": [
    "linux"
  ],
  "interval": 60,
  "publish": true,
  "handlers": [
    "slack"
  ],
  "metadata": {
    "name": "check-cpu",
    "namespace": "default"
  }
}
{{< /highlight >}}

#### API Specification {#checks-post-specification}

/checks (POST) | 
----------------|------
description     | Create a Sensu check.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/checks
example payload | {{< highlight shell >}}
{
  "command": "check-cpu.sh -w 75 -c 90",
  "subscriptions": [
    "linux"
  ],
  "interval": 60,
  "publish": true,
  "handlers": [
    "slack"
  ],
  "metadata": {
    "name": "check-cpu",
    "namespace": "default"
  }
}
{{< /highlight >}}
payload parameters | Required check attributes: `interval` (integer) or `cron` (string), and a `metadata` scope containing `name` (string) and `namespace` (string). For more information about creating checks, see the [check reference][1]. 
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/checks/:check` API endpoint {#the-checkscheck-api-endpoint}

### `/checks/:check` (GET) {#checkscheck-get}

The `/checks/:check` API endpoint provides HTTP GET access to [check data][1] for specific `:check` definitions, by check `name`.

#### EXAMPLE {#checkscheck-get-example}

In the following example, querying the `/checks/:check` API returns a JSON Map
containing the requested [`:check` definition][1] (in this example: for the `:check` named
`check-cpu`).

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_TOKEN" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check-cpu

HTTP/1.1 200 OK
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

### `/checks/:check` (PUT) {#checkscheck-put}

#### EXAMPLE {#checkscheckhooks-put-example}

In the following example, an HTTP PUT request is submitted to the `/checks/:check` API to update the `check-cpu` check, resulting in a 200 (OK) HTTP response code and the updated check definition.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
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
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check-cpu

HTTP/1.1 200 OK
{{< /highlight >}}

#### API Specification {#checkscheck-put-specification}

/checks/:check (PUT) | 
----------------|------
description     | Create or update a Sensu check given the name of the check as a URL parameter.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/checks/check-cpu
payload         | {{< highlight shell >}}
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
payload parameters | Required check attributes: `interval` (integer) or `cron` (string), and a `metadata` scope containing `name` (string) and `namespace` (string). For more information about creating checks, see the [check reference][1].
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/checks/:check` (DELETE) {#checkscheck-delete}

The `/checks/:check` API endpoint provides HTTP DELETE access to delete a check from Sensu given the check name.

### EXAMPLE {#checkscheck-delete-example}
The following example shows a request to delete the check named `check-cpu`, resulting in a successful HTTP 204 No Content response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_TOKEN" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check-cpu

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#checkscheck-delete-specification}

/checks/:check (DELETE) | 
--------------------------|------
description               | Removes a check from Sensu given the check name.
example url               | http://hostname:8080/api/core/v2/namespaces/default/checks/check-cpu
response codes            | <ul><li>**Success**: 202 (Accepted)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/checks/:check/execute` API endpoint {#the-checkscheckexecute-api-endpoint}

### `/checks/:check/execute` (POST) {#checkscheckexecute-post}

The `/checks/:check/execute` API endpoint provides HTTP POST access to create an ad-hoc check execution request, allowing you to execute a check on demand.

#### EXAMPLE {#checkscheckexecute-post-example}

In the following example, an HTTP POST request is submitted to the `/checks/:check/execute` API to execute the `check-sensu-site` check.
The request includes the check name in the request body and returns a successful HTTP 202 Accepted response and an `issued` timestamp.

{{< highlight shell >}}
curl -X POST \
-H "Authorization: Bearer $SENSU_TOKEN" \
-H 'Content-Type: application/json' \
-d '{"check": "check-sensu-site"}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check-sensu-site/execute

HTTP/1.1 202 Accepted
{"issued":1543861798}
{{< /highlight >}}

_PRO TIP: Include the `subscriptions` attribute with the request body to override the subscriptions configured in the check definition. This gives you the flexibility to execute a check on any Sensu entity or group of entities on demand._

#### API Specification {#checkscheckexecute-post-specification}

/checks/:check/execute (POST) | 
----------------|------
description     | Creates an adhoc request to execute a check given the check name.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/checks/check-sensu-site/execute
payload         | {{< highlight shell >}}
{
  "check": "check-sensu-site",
  "subscriptions": [
    "entity:i-424242"
  ]
}
{{< /highlight >}}
payload parameters | `check` (required): the name of the check to execute, and `subscriptions` (optional): an array of subscriptions to publish the check request to. When provided with the request, the `subscriptions` attribute overrides any subscriptions configured in the check definition.
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/checks/:check/hooks/:type` API endpoint {#the-checkscheckhooks-api-endpoint}

### `/checks/:check/hooks/:type` (PUT) {#checkscheckhooks-put}

The `/checks/:check/hooks/:type` API endpoint provides HTTP PUT access to assign a [hook][2] to a check.

#### EXAMPLE {#checkscheckhooks-put-example}

In the following example, an HTTP PUT request is submitted to the `/checks/:check/hooks/:type` API,
assigning the `process_tree` hook to the `check-cpu` check in the event of a `critical` type check result, resulting in a successful 204 (No Content) HTTP response code.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "critical": [
    "process_tree"
  ]
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check-cpu/hooks/critical

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#checkscheckhooks-put-specification}

checks/:check/hooks/:type (PUT) | 
----------------|------
description     | Assigns a hook to a check given the check name and [check response type][3].
example URL     | http://hostname:8080/api/core/v2/namespaces/default/checks/check-cpu/hooks/critical
example payload | {{< highlight shell >}}
{
  "critical": [
    "example-hook1",
    "example-hook2"
  ]
}
{{< /highlight >}}
payload parameters | This endpoint requires a JSON map of [check response types][3] (for example: `critical`, `warning`), each containing an array of hook names.
response codes  | <ul><li>**Success**: 204 (No Content)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/checks/:check/hooks/:type/hook/:hook` API endpoint {#the-checkscheckhookshook-api-endpoint}

### `/checks/:check/hooks/:type/hook/:hook` (DELETE) {#checkscheckhookshook-delete}
This endpoint provides HTTP DELETE access to a remove a [hook][2] from a [check][1].

### EXAMPLE
The following example shows a request to remove the `process_tree` hook from the `check-cpu` check, resulting in a successful 204 (No Content) HTTP response code.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_TOKEN" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check-cpu/hooks/critical/hook/process_tree 

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#checkscheckhookshook-delete-specification}

/checks/:check/hooks/ :type/hook/:hook (DELETE) | 
--------------------------|------
description               | Removes a single hook from a check given the check name, check response type, and hook name. See the [checks reference][3] for available types.
example url               | http://hostname:8080/api/core/v2/namespaces/default/checks/check-cpu/hooks/critical/hook/process_tree
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/checks
[2]: ../../reference/hooks
[3]: ../../reference/checks#check-hooks-attribute
