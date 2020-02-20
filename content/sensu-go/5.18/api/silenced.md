---
title: "Silencing API"
description: "The Sensu silencing API provides HTTP access to silences. This reference includes examples for creating and removing Sensu silences. Read on for the full reference."
version: "5.18"
product: "Sensu Go"
menu:
  sensu-go-5.18:
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

The following example demonstrates a request to the `/silenced` API endpoint, resulting in a JSON array that contains [silencing entry definitions][1].

{{< highlight shell >}}
curl -X GET \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
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
description    | Returns the list of silences.
example url    | http://hostname:8080/api/core/v2/namespaces/default/silenced
pagination     | This endpoint does not support [pagination][2].
response filtering | This endpoint supports [API response filtering][3].
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

The `/silenced` API endpoint provides HTTP POST access to create silencing entries.

#### EXAMPLE {#silenced-post-example}

In the following example, an HTTP POST request is submitted to the `/silenced` API endpoint to create the silencing entry `linux:check-cpu`.
The request returns a successful HTTP `201 Created` response.

{{< highlight shell >}}
curl -X POST \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
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
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/silenced

HTTP/1.1 201 Created
{{< /highlight >}}

#### API Specification {#silenced-post-specification}

/silenced (POST) | 
----------------|------
description     | Creates a Sensu silencing entry.
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
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/silenced/:silenced` API endpoint {#the-silencedsilenced-api-endpoint}

### `/silenced/:silenced` (GET) {#silencedsilenced-get}

The `/silenced/:silenced` API endpoint provides HTTP GET access to [silencing entry data][1] for specific `:silenced` definitions, by silencing entry name.

#### EXAMPLE {#silencedsilenced-get-example}

In the following example, querying the `/silenced/:silenced` API endpoint returns a JSON map that contains the requested [silencing entry definition][1] (in this example, for the silencing entry named `linux:check-cpu`).
Silencing entry names are generated from the combination of a subscription name and check name.

{{< highlight shell >}}
curl -X GET \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
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
description          | Returns the specified silencing entry.
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

The `/silenced/:silenced` API endpoint provides HTTP PUT access to create or update specific `:silenced` definitions, by silencing entry name.

#### EXAMPLE {#silencedsilenced-put-example}

In the following example, an HTTP PUT request is submitted to the `/silenced/:silenced` API endpoint to create the silencing entry `linux:check-server`.
The request returns a successful HTTP `201 Created` response.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "metadata": {
    "name": "linux:check-server",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "expire": -1,
  "expire_on_resolve": false,
  "creator": "admin",
  "subscription": "linux",
  "begin": 1542671205
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/silenced/linux:check-server

HTTP/1.1 201 Created
{{< /highlight >}}

#### API Specification {#silencedsilenced-put-specification}

/silenced/:silenced (PUT) | 
----------------|------
description     | Creates or updates a Sensu silencing entry.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/silenced/linux:check-server
payload         | {{< highlight shell >}}
{
  "metadata": {
    "name": "linux:check-server",
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

The `/silenced/:silenced` API endpoint provides HTTP DELETE access to delete a silencing entry (specified by the silencing entry name).

#### EXAMPLE {#silencedsilenced-delete-example}

In the following example, querying the `/silenced/:silenced` API endpoint to delete the the silencing entry named `linux:check-cpu` results in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/silenced/linux:check-cpu

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#silencedsilenced-delete-specification}

/silenced/:silenced (DELETE) | 
--------------------------|------
description               | Removes the specified silencing entry from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/default/silenced/linux:check-cpu
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/silenced/subscriptions/:subscription` API endpoint {#the-silencedsubscriptions-api-endpoint}

### `/silenced/subscriptions/:subscription` (GET) {#silencedsubscriptions-get}

The `/silenced/subscriptions/:subscription` API endpoint provides HTTP GET access to [silencing entry data][1] by subscription name.

#### EXAMPLE {#silencedsubscriptions-get-example}

In the following example, querying the `silenced/subscriptions/:subscription` API endpoint returns a JSON array that contains the requested [silences][1] for the given subscription (in this example, for the `linux` subscription).

{{< highlight shell >}}
curl -X GET \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
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

/silenced /subscriptions /:subscription (GET) | 
---------------------|------
description          | Returns all silences for the specified subscription.
example url          | http://hostname:8080/api/core/v2/namespaces/default/silenced/subscriptions/linux
pagination           | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
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

The `/silenced/checks/:check` API endpoint provides HTTP GET access to [silencing entry data][1] by check name.

#### EXAMPLE {#silencedchecks-get-example}

In the following example, querying the `silenced/checks/:check` API endpoint returns a JSON array that contains the requested [silences][1] for the given check (in this example, for the `check-cpu` check).

{{< highlight shell >}}
curl -X GET \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
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

/silenced/checks /:check (GET) | 
---------------------|------
description          | Returns all silences for the specified check.
example url          | http://hostname:8080/api/core/v2/namespaces/default/silenced/checks/check-cpu
pagination           | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
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

[1]: ../../reference/silencing/
[2]: ../overview#pagination
[3]: ../overview#response-filtering
