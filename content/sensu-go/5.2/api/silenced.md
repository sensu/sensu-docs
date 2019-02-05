---
title: "Silencing API"
description: "Sensu Go silencing API reference documentation"
version: "5.2"
product: "Sensu Go"
menu:
  sensu-go-5.2:
    parent: api
---

- [The `/silenced` API endpoint](#the-silenced-api-endpoint)
	- [`/silenced` (GET)](#silenced-get)
	- [`/silenced` (POST)](#silenced-post)
- [The `/silenced/:silenced` API endpoint](#the-silencedsilenced-api-endpoint)
	- [`/silenced/:silenced` (GET)](#silencedsilenced-get)
  - [`/silenced/:silenced` (PUT)](#silencedsilenced-put)
  - [`/silenced/:silenced` (DELETE)](#silencedsilenced-delete)
- [The `/silenced/subscriptions/:subscription` API endpoint](#the-silencedsubscriptions-api-endpoint)
  - [`/silenced/subscriptions/:subscription` (GET)](#silencedsubscriptions-get)
- [The `/silenced/checks/:check` API endpoint](#the-silencedchecks-api-endpoint)
  - [`/silenced/checks/:check` (GET)](#silencedchecks-get)
  
## The `/silenced` API endpoint

### `/silenced` (GET)

The `/silenced` API endpoint provides HTTP GET access to [silencing entry][1] data.

#### EXAMPLE {#silenced-get-example}

The following example demonstrates a request to the `/silenced` API, resulting in
a JSON Array containing [silencing entry definitions][1].

{{< highlight shell >}}
curl -H "Authorization: Bearer TOKEN" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/silenced

HTTP/1.1 200 OK
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
example url    | http://hostname:8080/api/core/v2/namespaces/default/silenced
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

### `/silenced` (POST)

/silenced (POST) | 
----------------|------
description     | Create a Sensu silencing entry.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/silenced
payload         | {{< highlight shell >}}
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
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/silenced/:silenced` API endpoint {#the-silencedsilenced-api-endpoint}

### `/silenced/:silenced` (GET) {#silencedsilenced-get}

The `/silenced/:silenced` API endpoint provides HTTP GET access to [silencing entry data][1] for specific `:silenced` definitions, by silencing entry `name`.

#### EXAMPLE {#silencedsilenced-get-example}

In the following example, querying the `/silenced/:silenced` API returns a JSON Map
containing the requested [silencing entry definition][1] (in this example: for the silencing entry named
`linux:check-cpu`).
Silencing entry names are generated from the combination of a subscription name and check name.

{{< highlight shell >}}
curl -H "Authorization: Bearer TOKEN" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/silenced/linux:check-cpu

HTTP/1.1 200 OK
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
example url          | http://hostname:8080/api/core/v2/namespaces/default/silenced/linux:check-cpu
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

### `/silenced/:silenced` (PUT) {#silencedsilenced-put}

#### API Specification {#silencedsilenced-put-specification}

/silenced/:silenced (PUT) | 
----------------|------
description     | Create or update a Sensu silencing entry.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/silenced/linux:check-cpu
payload         | {{< highlight shell >}}
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
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/silenced/:silenced` (DELETE) {#silencedsilenced-delete}

#### API Specification {#silencedsilenced-delete-specification}

/silenced/:silenced (DELETE) | 
--------------------------|------
description               | Removes a silencing entry from Sensu given the silencing entry name.
example url               | http://hostname:8080/api/core/v2/namespaces/default/silenced/linux:check-cpu
response codes            | <ul><li>**Success**: 202 (Accepted)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/silenced/subscriptions/:subscription` API endpoint {#the-silencedsubscriptions-api-endpoint}

### `/silenced/subscriptions/:subscription` (GET) {#silencedsubscriptions-get}

The `/silenced/subscriptions/:subscription` API endpoint provides HTTP GET access to [silencing entry data][1] by subscription `name`.

#### EXAMPLE {#silencedsubscriptions-get-example}

In the following example, querying the `silenced/subscriptions/:subscription` API returns a JSON Array
containing the requested [silencing entries][1] for the given subscription (in this example: for the `linux` subscription).

{{< highlight shell >}}
curl -H "Authorization: Bearer TOKEN" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/silenced/subscriptions/linux

HTTP/1.1 200 OK
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

#### API Specification {#silencedsubscriptions-get-specification}

/silenced/ subscriptions/ :subscription (GET) | 
---------------------|------
description          | Returns all silencing entries for the specified subscription.
example url          | http://hostname:8080/api/core/v2/namespaces/default/silenced/subscriptions/linux
response type        | Array
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
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

## The `/silenced/checks/:check` API endpoint {#the-silencedchecks-api-endpoint}

### `/silenced/checks/:check` (GET) {#silencedchecks-get}

The `/silenced/checks/:check` API endpoint provides HTTP GET access to [silencing entry data][1] by check `name`.

#### EXAMPLE {#silencedchecks-get-example}

In the following example, querying the `silenced/checks/:check` API returns a JSON Array
containing the requested [silencing entries][1] for the given check (in this example: for the `check-cpu` check).

{{< highlight shell >}}
curl -H "Authorization: Bearer TOKEN" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/silenced/checks/check-cpu

HTTP/1.1 200 OK
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
    "check": "linux",
    "begin": 1542671205
  }
]
{{< /highlight >}}

#### API Specification {#silencedchecks-get-specification}

/silenced/checks/ :check (GET) | 
---------------------|------
description          | Returns all silencing entries for the specified check.
example url          | http://hostname:8080/api/core/v2/namespaces/default/silenced/checks/check-cpu
response type        | Array
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
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
    "check": "linux",
    "begin": 1542671205
  }
]
{{< /highlight >}}

[1]: ../../reference/silencing

