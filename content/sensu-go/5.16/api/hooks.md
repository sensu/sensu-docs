---
title: "Hooks API"
description: "The Sensu hooks API provides HTTP access to hook data. This reference includes examples for returning lists of hooks, creating a Sensu hook, and more. Read on for the full reference."
version: "5.16"
product: "Sensu Go"
menu:
  sensu-go-5.16:
    parent: api
---

- [The `/hooks` API endpoint](#the-hooks-api-endpoint)
	- [`/hooks` (GET)](#hooks-get)
	- [`/hooks` (POST)](#hooks-post)
- [The `/hooks/:hook` API endpoint](#the-hookshook-api-endpoint)
	- [`/hooks/:hook` (GET)](#hookshook-get)
  - [`/hooks/:hook` (PUT)](#hookshook-put)
  - [`/hooks/:hook` (DELETE)](#hookshook-delete)

## The `/hooks` API endpoint

### `/hooks` (GET)

The `/hooks` API endpoint provides HTTP GET access to [hook][1] data.

#### EXAMPLE {#hooks-get-example}

The following example demonstrates a request to the `/hooks` API, resulting in a JSON array that contains [hook definitions][1].

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/namespaces/default/hooks -H "Authorization: Bearer $SENSU_TOKEN"
[
  {
    "metadata": {
      "name": "process-tree",
      "namespace": "default",
      "labels": null,
      "annotations": null
    },
    "command": "ps aux",
    "timeout": 10,
    "stdin": false
  }
]
{{< /highlight >}}

#### API Specification {#hooks-get-specification}

/hooks (GET)  | 
---------------|------
description    | Returns the list of hooks.
example url    | http://hostname:8080/api/core/v2/namespaces/default/hooks
pagination     | This endpoint supports pagination using the `limit` and `continue` query parameters. See the [API overview][2] for details.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "metadata": {
      "name": "process-tree",
      "namespace": "default",
      "labels": null,
      "annotations": null
    },
    "command": "ps aux",
    "timeout": 10,
    "stdin": false
  },
  {
    "metadata": {
      "name": "nginx-log",
      "namespace": "default",
      "labels": null,
      "annotations": null
    },
    "command": "tail -n 100 /var/log/nginx/error.log",
    "timeout": 10,
    "stdin": false
  }
]
{{< /highlight >}}

### `/hooks` (POST)

The `/hooks` API endpoint provides HTTP POST access to create a hook.

#### API Specification {#hooks-post-specification}

/hooks (POST) | 
----------------|------
description     | Creates a Sensu hook.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/hooks
payload         | {{< highlight shell >}}
{
  "metadata": {
    "name": "process-tree",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "command": "ps aux",
  "timeout": 10,
  "stdin": false
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/hooks/:hook` API endpoint {#the-hookshook-api-endpoint}

### `/hooks/:hook` (GET) {#hookshook-get}

The `/hooks/:hook` API endpoint provides HTTP GET access to [hook data][1] for specific `:hook` definitions, by hook name.

#### EXAMPLE {#hookshook-get-example}

In the following example, querying the `/hooks/:hook` API returns a JSON map that contains the requested [`:hook` definition][1] (in this example, for the `:hook` named `process-tree`).

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/namespaces/default/hooks/process-tree -H "Authorization: Bearer $SENSU_TOKEN"
{
  "metadata": {
    "name": "process-tree",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "command": "ps aux",
  "timeout": 10,
  "stdin": false
}
{{< /highlight >}}

#### API Specification {#hookshook-get-specification}

/hooks/:hook (GET) | 
---------------------|------
description          | Returns the specified hook.
example url          | http://hostname:8080/api/core/v2/namespaces/default/hooks/process-tree
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "metadata": {
    "name": "process-tree",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "command": "ps aux",
  "timeout": 10,
  "stdin": false
}
{{< /highlight >}}

### `/hooks/:hook` (PUT) {#hookshook-put}

The `/hooks/:hook` API endpoint provides HTTP PUT access to create or update specific `:hook` definitions, by hook name.

#### API Specification {#hookshook-put-specification}

/hooks/:hook (PUT) | 
----------------|------
description     | Creates or updates the specified Sensu hook.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/hooks/process-tree
payload         | {{< highlight shell >}}
{
  "metadata": {
    "name": "process-tree",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "command": "ps aux",
  "timeout": 10,
  "stdin": false
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/hooks/:hook` (DELETE) {#hookshook-delete}

The `/hooks/:hook` API endpoint provides HTTP DELETE access to delete a check hook from Sensu (specified by the hook name).

#### EXAMPLE {#hookshook-delete-example}
The following example shows a request to delete the hook `process-tree`, resulting in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_TOKEN" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/hooks/process-tree

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#hookshook-delete-specification}

/hooks/:hook (DELETE) | 
--------------------------|------
description               | Removes the specified hook from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/default/hooks/process-tree
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/hooks/
[2]: ../overview#pagination
