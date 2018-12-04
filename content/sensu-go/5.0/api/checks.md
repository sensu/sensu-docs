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
- [The `/checks/:check` API endpoint](#the-checkscheck-api-endpoint)
	- [`/checks/:check` (GET)](#checkscheck-get)
  - [`/checks/:check` (PUT)](#checkscheck-put)
  - [`/checks/:check` (DELETE)](#checkscheck-delete)
- [The `/checks/:check/execute` API endpoint](#the-checkscheckexecute-api-endpoint)
  - [`/checks/:check/execute` (POST)](#checkscheckexecute-post)
- [The `/checks/:check/hooks/:type/hook/:hook` API endpoint](#the-checkscheckhookshook-api-endpoint)
  - [`/checks/:check/hooks/:type/hook/:hook` (DELETE)](#checkscheckhookshook-delete)

## The `/checks` API endpoint

### `/checks` (GET)

The `/checks` API endpoint provides HTTP GET access to [check][1] data.

#### EXAMPLE {#checks-get-example}

The following example demonstrates a request to the `/checks` API, resulting in
a JSON Array containing [check definitions][1].

{{< highlight shell >}}
curl -H "Authorization: Bearer TOKEN" http://127.0.0.1:8080/api/core/v2/namespaces/default/checks

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
-H "Authorization: Bearer TOKEN" \
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
payload parameters | Required check attributes: `command` (string), `subscriptions` (array of strings), `interval` (integer), `publish` (set to `true`), and a `metadata` scope containing `name` (string) and `namespace` (string). For more information about creating checks, see the [check reference][1]. 
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/checks/:check` API endpoint {#the-checkscheck-api-endpoint}

### `/checks/:check` (GET) {#checkscheck-get}

The `/checks/:check` API endpoint provides HTTP GET access to [check data][1] for specific `:check` definitions, by check `name`.

#### EXAMPLE {#checkscheck-get-example}

In the following example, querying the `/checks/:check` API returns a JSON Map
containing the requested [`:check` definition][1] (in this example: for the `:check` named
`check-cpu`).

{{< highlight shell >}}
curl -H "Authorization: Bearer TOKEN" \
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

#### API Specification {#checkscheck-put-specification}

/checks/:check (PUT) | 
----------------|------
description     | Create or update a Sensu check.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/checks/check-sensu-site
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

### `/checks/:check` (DELETE) {#checkscheck-delete}

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
-H "Authorization: Bearer TOKEN" \
-H 'Content-Type: application/json' \
-d '{"check": "check-sensu-site"}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check-sensu-site/execute

HTTP/1.1 202 Accepted
{"issued":1543861798}
{{< /highlight >}}

#### API Specification {#checkscheckexecute-post-specification}

/checks/:check/execute (POST) | 
----------------|------
description     | Creates an adhoc request to execute a check given the check name.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/checks/check-sensu-site/execute
payload         | {{< highlight shell >}}{"check": "check-sensu-site"}{{< /highlight >}}
payload parameters | `check` (required): the name of the check to execute
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/checks/:check/hooks/:type/hook/:hook` API endpoint {#the-checkscheckhookshook-api-endpoint}

### `/checks/:check/hooks/:type/hook/:hook` (DELETE) {#checkscheckhookshook-delete}
This endpoint provides HTTP DELETE access to a [hook][2] assigned to a [check][1].

### EXAMPLE
The following example shows a request to remove the `process-tree` hook from the `check-cpu` check, resulting in a successful HTTP 204 No Content response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer TOKEN" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/checks/check-cpu/hooks/critical/hook/process_tree 

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#checkscheckhookshook-delete-specification}

/checks/:check/hooks/ :type/hook/:hook (DELETE) | 
--------------------------|------
description               | Removes a single hook from a check given the check name, hook type, and hook name. See the [hooks reference][2] for available types.
example url               | http://hostname:8080/api/core/v2/namespaces/default/checks/check-cpu/hooks/critical/hook/process-tree
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/checks
[2]: ../../reference/hooks
