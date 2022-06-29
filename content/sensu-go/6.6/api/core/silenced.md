---
title: "core/v2/silenced"
description: "Read this API documentation for information about Sensu core/v2/silenced API endpoints, with examples for retrieving and managing silences."
core_api_title: "core/v2/silenced"
type: "core_api"
version: "6.6"
product: "Sensu Go"
menu:
  sensu-go-6.6:
    parent: core
---

{{% notice note %}}
**NOTE**: Requests to `core/v2/silenced` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-auth-api-endpoints).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all silences

The `/silenced` API endpoint provides HTTP GET access to [silencing entry][1] data.

### Example {#silenced-get-example}

The following example demonstrates a GET request to the `/silenced` API endpoint:

{{< code shell >}}
curl -X GET \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/silenced
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a JSON array that contains the [silencing definitions][1] in the `default` namespace:

{{< code text >}}
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
output         | {{< code text >}}
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

In the following example, an HTTP POST request is submitted to the `/silenced` API endpoint to create the silencing entry `linux:check_cpu`:

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "metadata": {
    "name": "linux:check_cpu",
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
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

Here's another example that shows an HTTP POST request to the `/silenced` API endpoint to create the silencing entry `*:http`, which will create a silence for any event with the check name `http`, regardless of the originating entities’ subscriptions:

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
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

### API Specification {#silenced-post-specification}

/silenced (POST) | 
----------------|------
description     | Creates a Sensu silencing entry.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/silenced
payload         | {{< code shell >}}
{
  "metadata": {
    "name": "linux:check_cpu",
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

The following example queries the `/silenced/:silenced` API endpoint for the silencing entry named `linux:check_cpu`:

{{< code shell >}}
curl -X GET \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/silenced/linux:check_cpu
{{< /code >}}

The request will return a successful `HTTP/1.1 200 OK` response and a JSON map that contains the requested [`:silenced` definition][1] (in this example, `linux:check_cpu`):

{{< code text >}}
{
  "metadata": {
    "name": "linux:check_cpu",
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
example url          | http://hostname:8080/api/core/v2/namespaces/default/silenced/linux:check_cpu
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code text >}}
{
  "metadata": {
    "name": "linux:check_cpu",
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

In the following example, an HTTP PUT request is submitted to the `/silenced/:silenced` API endpoint to create the silencing entry `linux:check-server`:

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
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

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

In the following example, querying the `/silenced/:silenced` API endpoint to delete the the silencing entry named `linux:check_cpu` results in a successful `HTTP/1.1 204 No Content` response:

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/silenced/linux:check_cpu
{{< /code >}}

### API Specification {#silencedsilenced-delete-specification}

/silenced/:silenced (DELETE) | 
--------------------------|------
description               | Removes the specified silencing entry from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/default/silenced/linux:check_cpu
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get all silences for a specific subscription {#silencedsubscriptions-get}

The `/silenced/subscriptions/:subscription` API endpoint provides HTTP GET access to [silencing entry data][1] by subscription name.

### Example {#silencedsubscriptions-get-example}

The following example queries the `silenced/subscriptions/:subscription` API endpoint for [silences][1] for the given subscription (in this example, for the `linux` subscription):

{{< code shell >}}
curl -X GET \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/silenced/subscriptions/linux
{{< /code >}}

The example request will result in a successful `HTTP/1.1 200 OK` response and a JSON array that contains only [silencing definitions][1] for the `linux` subscription:

{{< code text >}}
[
  {
    "metadata": {
      "name": "linux:check_cpu",
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

/silenced/subscriptions/:subscription (GET) | 
---------------------|------
description          | Returns all silences for the specified subscription.
example url          | http://hostname:8080/api/core/v2/namespaces/default/silenced/subscriptions/linux
pagination           | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response type        | Array
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code text >}}
[
  {
    "metadata": {
      "name": "linux:check_cpu",
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

The following example queries the `silenced/checks/:check` API endpoint for [silences][1] for the specified check (in this example, for the `check_cpu` check):

{{< code shell >}}
curl -X GET \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/silenced/checks/check_cpu
{{< /code >}}

The example request will result in a successful `HTTP/1.1 200 OK` response and a JSON array that contains only [silencing definitions][1] for the `check_cpu` check:

{{< code text >}}
[
  {
    "metadata": {
      "name": "linux:check_cpu",
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

/silenced/checks/:check (GET) | 
---------------------|------
description          | Returns all silences for the specified check.
example url          | http://hostname:8080/api/core/v2/namespaces/default/silenced/checks/check_cpu
pagination           | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response type        | Array
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code text >}}
[
  {
    "metadata": {
      "name": "linux:check_cpu",
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

## Get a subset of silences with response filtering

The `/silenced` API endpoint supports [response filtering][3] for a subset of silences data based on labels and the following fields:

- `silenced.name`
- `silenced.namespace`
- `silenced.check`
- `silenced.creator`
- `silenced.expire_on_resolve`
- `silenced.subscription`

### Example

The following example demonstrates a request to the `/silenced` API endpoint with [response filtering][3] for only [silencing definitions][1] in the `development` namespace:

{{< code shell >}}
curl -H "Authorization: Key $SENSU_API_KEY" http://127.0.0.1:8080/api/core/v2/silenced -G \
--data-urlencode 'fieldSelector="development" in silenced.namespace'
{{< /code >}}

The example request will result in a successful `HTTP/1.1 200 OK` response and a JSON array that contains only [silencing definitions][1] in the `development` namespace:

{{< code text >}}
[
  {
    "metadata": {
      "name": "linux:*",
      "namespace": "development",
      "created_by": "admin"
    },
    "expire": -1,
    "expire_on_resolve": false,
    "creator": "admin",
    "subscription": "linux",
    "begin": 1644868317,
    "expire_at": 0
  }
]
{{< /code >}}

{{% notice note %}}
**NOTE**: Read [API response filtering](../../#response-filtering) for more filter statement examples that demonstrate how to filter responses using different operators with label and field selectors.
{{% /notice %}}

### API Specification

/silenced (GET) with response filters | 
---------------|------
description    | Returns the list of silences that match the [response filters][3] applied in the API request.
example url    | http://hostname:8080/api/core/v2/silenced
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "metadata": {
      "name": "linux:*",
      "namespace": "development",
      "created_by": "admin"
    },
    "expire": -1,
    "expire_on_resolve": false,
    "creator": "admin",
    "subscription": "linux",
    "begin": 1644868317,
    "expire_at": 0
  }
]
{{< /code >}}


[1]: ../../../observability-pipeline/observe-process/silencing/
[2]: ../../#pagination
[3]: ../../#response-filtering
