---
title: "Silencing API"
description: "The Sensu silencing API provides HTTP access to silences. This reference includes examples for creating and removing Sensu silences. Read on for the full reference."
api_title: "Silencing API"
type: "api"
version: "6.5"
product: "Sensu Go"
menu:
  sensu-go-6.5:
    parent: api
---

{{% notice note %}}
**NOTE**: Requests to the silencing API require you to authenticate with a Sensu [API key](../#configure-an-environment-variable-for-api-key-authentication) or [access token](../#authenticate-with-the-authentication-api).
The code examples in this document use the [environment variable](../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all silences

The `/silenced` API endpoint provides HTTP GET access to [silencing entry][1] data.

### Example {#silenced-get-example}

The following example demonstrates a request to the `/silenced` API endpoint, resulting in a JSON array that contains [silencing entry definitions][1].

{{< code shell >}}
curl -X GET \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/silenced

HTTP/1.1 200 OK
[
  {
    "metadata": {
      "name": "*:http",
      "namespace": "default",
      "created_by": "admin"
    },
    "expire": -1,
    "expire_on_resolve": false,
    "creator": "admin",
    "check": "http",
    "reason": "Testing",
    "begin": 1605024595,
    "expire_at": 0
  },
  {
    "metadata": {
      "name": "linux:*",
      "namespace": "default",
      "created_by": "admin"
    },
    "expire": -1,
    "expire_on_resolve": false,
    "creator": "admin",
    "reason": "reason for silence",
    "subscription": "linux",
    "begin": 1542671205,
    "expire_at": 0
  }
]
{{< /code >}}

### API Specification {#silenced-get-specification}

/silenced (GET)  | 
---------------|------
description    | Returns the list of silences.
example url    | http://hostname:8080/api/core/v2/namespaces/default/silenced
pagination     | This endpoint does not support [pagination][2].
response filtering | This endpoint supports [API response filtering][3].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code shell >}}
[
  {
    "metadata": {
      "name": "*:http",
      "namespace": "default",
      "created_by": "admin"
    },
    "expire": -1,
    "expire_on_resolve": false,
    "creator": "admin",
    "check": "http",
    "reason": "Testing",
    "begin": 1605024595,
    "expire_at": 0
  },
  {
    "metadata": {
      "name": "linux:*",
      "namespace": "default",
      "created_by": "admin"
    },
    "expire": -1,
    "expire_on_resolve": false,
    "creator": "admin",
    "reason": "reason for silence",
    "subscription": "linux",
    "begin": 1542671205,
    "expire_at": 0
  }
]
{{< /code >}}

## Create a new silence

The `/silenced` API endpoint provides HTTP POST access to create silencing entries.

### Example {#silenced-post-example}

In the following example, an HTTP POST request is submitted to the `/silenced` API endpoint to create the silencing entry `linux:check-cpu`.
The request returns a successful HTTP `201 Created` response.

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
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
  "reason": "reason for silence",
  "subscription": "linux",
  "begin": 1542671205
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/silenced

HTTP/1.1 201 Created
{{< /code >}}

Here's another example that shows an HTTP POST request to the `/silenced` API endpoint to create the silencing entry `*:http`, which will create a silence for any event with the check name `http`, regardless of the originating entities’ subscriptions.
The request returns a successful HTTP `201 Created` response.

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "metadata": {
    "name": "*:http",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "expire": -1,
  "expire_on_resolve": false,
  "creator": "admin",
  "check": "http",
  "reason": "Testing"
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/silenced

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#silenced-post-specification}

/silenced (POST) | 
----------------|------
description     | Creates a Sensu silencing entry.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/silenced
payload         | {{< code shell >}}
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
  "reason": "reason for silence",
  "subscription": "linux",
  "begin": 1542671205
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific silence {#silencedsilenced-get}

The `/silenced/:silenced` API endpoint provides HTTP GET access to [silencing entry data][1] for specific `:silenced` definitions, by silencing entry name.

### Example {#silencedsilenced-get-example}

In the following example, querying the `/silenced/:silenced` API endpoint returns a JSON map that contains the requested [silencing entry definition][1] (in this example, for the silencing entry named `linux:check-cpu`).
Silencing entry names are generated from the combination of a subscription name and check name.

{{< code shell >}}
curl -X GET \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/silenced/linux:check-cpu

HTTP/1.1 200 OK
{
  "metadata": {
    "name": "linux:check-cpu",
    "namespace": "default",
    "created_by": "admin",
    "labels": null,
    "annotations": null
  },
  "expire": -1,
  "expire_on_resolve": false,
  "creator": "admin",
  "reason": "reason for silence",
  "subscription": "linux",
  "begin": 1542671205
}
{{< /code >}}

### API Specification {#silencedsilenced-get-specification}

/silenced/:silenced (GET) | 
---------------------|------
description          | Returns the specified silencing entry.
example url          | http://hostname:8080/api/core/v2/namespaces/default/silenced/linux:check-cpu
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code json >}}
{
  "metadata": {
    "name": "linux:check-cpu",
    "namespace": "default",
    "created_by": "admin",
    "labels": null,
    "annotations": null
  },
  "expire": -1,
  "expire_on_resolve": false,
  "creator": "admin",
  "reason": "reason for silence",
  "subscription": "linux",
  "begin": 1542671205
}
{{< /code >}}

## Create or update a silence {#silencedsilenced-put}

The `/silenced/:silenced` API endpoint provides HTTP PUT access to create or update specific `:silenced` definitions, by silencing entry name.

### Example {#silencedsilenced-put-example}

In the following example, an HTTP PUT request is submitted to the `/silenced/:silenced` API endpoint to create the silencing entry `linux:check-server`.
The request returns a successful HTTP `201 Created` response.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
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
  "reason": "reason for silence",
  "subscription": "linux",
  "begin": 1542671205
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/silenced/linux:check-server

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#silencedsilenced-put-specification}

/silenced/:silenced (PUT) | 
----------------|------
description     | Creates or updates a Sensu silencing entry.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/silenced/linux:check-server
payload         | {{< code shell >}}
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
  "reason": "reason for silence",
  "subscription": "linux",
  "begin": 1542671205
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a silence {#silencedsilenced-delete}

The `/silenced/:silenced` API endpoint provides HTTP DELETE access to delete a silencing entry (specified by the silencing entry name).

### Example {#silencedsilenced-delete-example}

In the following example, querying the `/silenced/:silenced` API endpoint to delete the the silencing entry named `linux:check-cpu` results in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/silenced/linux:check-cpu

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification {#silencedsilenced-delete-specification}

/silenced/:silenced (DELETE) | 
--------------------------|------
description               | Removes the specified silencing entry from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/default/silenced/linux:check-cpu
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get all silences for a specific subscription {#silencedsubscriptions-get}

The `/silenced/subscriptions/:subscription` API endpoint provides HTTP GET access to [silencing entry data][1] by subscription name.

### Example {#silencedsubscriptions-get-example}

In the following example, querying the `silenced/subscriptions/:subscription` API endpoint returns a JSON array that contains the requested [silences][1] for the given subscription (in this example, for the `linux` subscription).

{{< code shell >}}
curl -X GET \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/silenced/subscriptions/linux

HTTP/1.1 200 OK
[
  {
    "metadata": {
      "name": "linux:check-cpu",
      "namespace": "default",
      "created_by": "admin",
      "labels": null,
      "annotations": null
    },
    "expire": -1,
    "expire_on_resolve": false,
    "creator": "admin",
    "reason": "reason for silence",
    "subscription": "linux",
    "begin": 1542671205
  }
]
{{< /code >}}

### API Specification {#silencedsubscriptions-get-specification}

/silenced /subscriptions /:subscription (GET) | 
---------------------|------
description          | Returns all silences for the specified subscription.
example url          | http://hostname:8080/api/core/v2/namespaces/default/silenced/subscriptions/linux
pagination           | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response type        | Array
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code json >}}
[
  {
    "metadata": {
      "name": "linux:check-cpu",
      "namespace": "default",
      "created_by": "admin",
      "labels": null,
      "annotations": null
    },
    "expire": -1,
    "expire_on_resolve": false,
    "creator": "admin",
    "reason": "reason for silence",
    "subscription": "linux",
    "begin": 1542671205
  }
]
{{< /code >}}

## Get all silences for a specific check {#silencedchecks-get}

The `/silenced/checks/:check` API endpoint provides HTTP GET access to [silencing entry data][1] by check name.

### Example {#silencedchecks-get-example}

In the following example, querying the `silenced/checks/:check` API endpoint returns a JSON array that contains the requested [silences][1] for the given check (in this example, for the `check-cpu` check).

{{< code shell >}}
curl -X GET \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/silenced/checks/check-cpu

HTTP/1.1 200 OK
[
  {
    "metadata": {
      "name": "linux:check-cpu",
      "namespace": "default",
      "created_by": "admin",
      "labels": null,
      "annotations": null
    },
    "expire": -1,
    "expire_on_resolve": false,
    "creator": "admin",
    "reason": "reason for silence",
    "check": "linux",
    "begin": 1542671205
  }
]
{{< /code >}}

### API Specification {#silencedchecks-get-specification}

/silenced/checks /:check (GET) | 
---------------------|------
description          | Returns all silences for the specified check.
example url          | http://hostname:8080/api/core/v2/namespaces/default/silenced/checks/check-cpu
pagination           | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response type        | Array
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code json >}}
[
  {
    "metadata": {
      "name": "linux:check-cpu",
      "namespace": "default",
      "created_by": "admin",
      "labels": null,
      "annotations": null
    },
    "expire": -1,
    "expire_on_resolve": false,
    "creator": "admin",
    "reason": "reason for silence",
    "check": "linux",
    "begin": 1542671205
  }
]
{{< /code >}}

[1]: ../../observability-pipeline/observe-process/silencing/
[2]: ../#pagination
[3]: ../#response-filtering
