---
title: "Hooks API"
description: "Sensu Go hooks API reference documentation"
version: "5.0"
product: "Sensu Go"
menu:
  sensu-go-5.0:
    parent: api
---

## The `/hooks` API endpoint

### `/hooks` (GET)

The `/hooks` API endpoint provides HTTP GET access to [hook][1] data.

#### EXAMPLE {#hooks-get-example}

The following example demonstrates a request to the `/hooks` API, resulting in
a JSON Array containing [hook definitions][1].

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/namespaces/default/hooks -H "Authorization: Bearer TOKEN"
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

## The `/hooks/:hook` API endpoint {#the-hookshook-api-endpoint}

### `/hooks/:hook` (GET) {#hookshook-get}

The `/hooks/:hook` API endpoint provides HTTP GET access to [hook data][1] for specific `:hook` definitions, by hook `name`.

#### EXAMPLE {#hookshook-get-example}

In the following example, querying the `/hooks/:hook` API returns a JSON Map
containing the requested [`:hook` definition][1] (in this example: for the `:hook` named
`process-tree`).

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/namespaces/default/hooks/process-tree -H "Authorization: Bearer TOKEN"
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
description          | Returns a hook.
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

[1]: ../../reference/hooks
