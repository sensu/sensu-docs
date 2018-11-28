---
title: "Silencing API"
description: "Sensu Go silencing API reference documentation"
version: "5.0"
product: "Sensu Go"
menu:
  sensu-go-5.0:
    parent: api
---

## The `/silenced` API endpoint

### `/silenced` (GET)

The `/silenced` API endpoint provides HTTP GET access to [silencing entry][1] data.

#### EXAMPLE {#silenced-get-example}

The following example demonstrates a request to the `/silenced` API, resulting in
a JSON Array containing [silencing entry definitions][1].

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/apis/core/v2/namespaces/default/silenced -H "Authorization: Bearer TOKEN"
[
  {
    "metadata": {
      "name": "linux:check-cpu",
      "namespace": "default",
      "labels": null,
      "annotations": null
    },
    "expire": -1,
    "expire_on_resolve": false,
    "creator": "admin",
    "subscription": "linux",
    "begin": 1542671205
  }
]
{{< /highlight >}}

#### API Specification {#silenced-get-specification}

/silenced (GET)  | 
---------------|------
description    | Returns the list of silencing entries.
example url    | http://hostname:8080/apis/core/v2/namespaces/default/silenced
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "metadata": {
      "name": "linux:check-cpu",
      "namespace": "default",
      "labels": null,
      "annotations": null
    },
    "expire": -1,
    "expire_on_resolve": false,
    "creator": "admin",
    "subscription": "linux",
    "begin": 1542671205
  }
]
{{< /highlight >}}

## The `/silenced/:silenced` API endpoint {#the-silencedsilenced-api-endpoint}

### `/silenced/:silenced` (GET) {#silencedsilenced-get}

The `/silenced/:$` API endpoint provides HTTP GET access to [silencing entry data][1] for specific `:silenced` definitions, by silencing entry `name`.

#### EXAMPLE {#silencedsilenced-get-example}

In the following example, querying the `/silenced/:silenced` API returns a JSON Map
containing the requested [silencing entry definition][1] (in this example: for the silencing entry named
`linux:check-cpu`).
Silencing entry names are generated from the combination of a subscription name and check name.

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/apis/core/v2/namespaces/default/silenced/linux:check-cpu -H "Authorization: Bearer TOKEN"
{
  "metadata": {
    "name": "linux:check-cpu",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "expire": -1,
  "expire_on_resolve": false,
  "creator": "admin",
  "subscription": "linux",
  "begin": 1542671205
}
{{< /highlight >}}

#### API Specification {#silencedsilenced-get-specification}

/silenced/:silenced (GET) | 
---------------------|------
description          | Returns a silencing entry.
example url          | http://hostname:8080/apis/core/v2/namespaces/default/silenced/linux:check-cpu
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "metadata": {
    "name": "linux:check-cpu",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "expire": -1,
  "expire_on_resolve": false,
  "creator": "admin",
  "subscription": "linux",
  "begin": 1542671205
}
{{< /highlight >}}

[1]: ../../reference/silencing

