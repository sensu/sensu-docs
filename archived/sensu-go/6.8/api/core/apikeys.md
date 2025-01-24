---
title: "core/v2/apikeys"
description: "Read this API documentation for information about Sensu core/v2/apikeys API endpoints, with examples for retrieving and managing Sensu API keys."
core_api_title: "core/v2/apikeys"
type: "core_api"
version: "6.8"
product: "Sensu Go"
menu:
  sensu-go-6.8:
    parent: core
---

{{% notice note %}}
**NOTE**: Requests to `core/v2/apikeys` endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-auth-api-endpoints).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all API keys

The `/apikeys` GET endpoint retrieves all API keys.

### Example {#apikeys-get-example}

The following example demonstrates a GET request to the `/apikeys` API endpoint:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/apikeys \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request will result in a successful `HTTP/1.1 200 OK` response and a JSON array that contains all API keys, similar to this example:

{{< code text >}}
[
  {
    "metadata": {
      "name": "83abef1e-e7d7-4beb-91fc-79ad90084d5b",
      "created_by": "admin"
    },
    "username": "admin",
    "created_at": 1570640363
  },
  {
    "metadata": {
      "name": "94jhid83j-96kg-2ewr-bab3-ppd3d49tdd94",
      "created_by": "admin"
    },
    "username": "admin",
    "created_at": 1651257929
  }
]
{{< /code >}}

### API Specification {#apikeys-get-specification}

/apikeys (GET)  | 
---------------|------
description    | Returns the list of API keys.
example url    | http://hostname:8080/api/core/v2/apikeys
pagination     | This endpoint supports pagination using the `limit` and `continue` query parameters. Read the [API overview][1] for details.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "metadata": {
      "name": "83abef1e-e7d7-4beb-91fc-79ad90084d5b",
      "created_by": "admin"
    },
    "username": "admin",
    "created_at": 1570640363
  },
  {
    "metadata": {
      "name": "94jhid83j-96kg-2ewr-bab3-ppd3d49tdd94",
      "created_by": "admin"
    },
    "username": "admin",
    "created_at": 1651257929
  }
]
{{< /code >}}

## Create a new API key

The `/apikeys` API endpoint provides HTTP POST access to create a new API key.

### Example {#apikeys-post-example}

In the following example, an HTTP POST request is submitted to the `/apikeys` API endpoint to create a new API key.

{{% notice note %}}
**NOTE**: For the `/apikeys` POST endpoint, authenticate with a Sensu access token, which you can generate with [/auth API endpoints](../../#authenticate-with-auth-api-endpoints) or [sensuctl](../../#generate-an-api-access-token-with-sensuctl).
This example uses `$SENSU_ACCESS_TOKEN` to represent a valid Sensu access token.<br><br>
If you prefer, you can [create a new API key with sensuctl](../../../operations/control-access/use-apikeys/#sensuctl-management-commands) instead of using this endpoint.
{{% /notice %}}

{{< code shell >}}
curl -X POST \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "username": "admin"
}' \
http://127.0.0.1:8080/api/core/v2/apikeys
{{< /code >}}

The request returns a successful HTTP `HTTP/1.1 201 Created` response, along with a `Location` header that contains the relative path to the new API key.

### API Specification {#apikeys-post-specification}

/apikeys (POST) | 
----------------|------
description     | Creates a new API key, a Sensu-generated universally unique identifier (UUID). The response will include HTTP 201 and a `Location` header that contains the relative path to the new API key.
example URL     | http://hostname:8080/api/core/v2/apikeys
request payload  | {{< code shell >}}
{
  "username": "admin"
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific API key

The `/apikeys/:apikey` GET endpoint retrieves the specified API key.

### Example {#apikeysapikey-get-example}

The following example queries the `/apikeys/:apikey` API:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/apikeys/83abef1e-e7d7-4beb-91fc-79ad90084d5b \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request returns a successful `HTTP/1.1 200 OK` response and the requested `:apikey` definition, similar to the example below, or an error if the key is not found:

{{< code text >}}
{
  "metadata": {
    "name": "83abef1e-e7d7-4beb-91fc-79ad90084d5b",
    "created_by": "admin"
  },
  "username": "admin",
  "created_at": 1570640363
}
{{< /code >}}

### API Specification {#apikeysapikey-get-specification}

/apikeys/:apikey (GET) | 
---------------------|------
description          | Returns the specified API key.
example url          | http://hostname:8080/api/core/v2/apikeys/83abef1e-e7d7-4beb-91fc-79ad90084d5b
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code text >}}
{
  "metadata": {
    "name": "83abef1e-e7d7-4beb-91fc-79ad90084d5b",
    "created_by": "admin"
  },
  "username": "admin",
  "created_at": 1570640363
}
{{< /code >}}

## Update an API key with PATCH

The `/apikeys/:apikey` PATCH endpoint updates the specified API key.

{{% notice note %}}
**NOTE**: You cannot change a resource's `name` or `namespace` with a PATCH request.
{{% /notice %}}

### Example

The following example queries the `/apikeys/:apikey` API updates the username for the specified `:apikey` definition and returns a successful `HTTP/1.1 200 OK` response.

We support [JSON merge patches][2], so you must set the `Content-Type` header to `application/merge-patch+json` for PATCH requests.

{{< code shell >}}
curl -X PATCH \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/merge-patch+json' \
{
  "username": "devteam"
} \
http://127.0.0.1:8080/api/core/v2/apikeys/83abef1e-e7d7-4beb-91fc-79ad90084d5b
{{< /code >}}

### API Specification

/apikeys/:apikey (PATCH) | 
---------------------|------
description          | Updates the specified API key.
example url          | http://hostname:8080/api/core/v2/apikeys/83abef1e-e7d7-4beb-91fc-79ad90084d5b
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code json >}}
{
  "username": "devteam"
}
{{< /code >}}

## Delete an API key {#apikeysapikey-delete}

The `/apikeys/:apikey` API endpoint provides HTTP DELETE access to remove an API key.

### Example {#apikeysapikey-delete-example}

The following example shows a request to the `/apikeys/:apikey` API endpoint to delete the API key `83abef1e-e7d7-4beb-91fc-79ad90084d5b`, resulting in a successful `HTTP/1.1 204 No Content` response.

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/apikeys/83abef1e-e7d7-4beb-91fc-79ad90084d5b
{{< /code >}}

### API Specification {#apikeysapikey-delete-specification}

/apikeys/:apikey (DELETE) | 
----------------|------
description     | Revokes the specified API key.
example URL     | http://hostname:8080/api/core/v2/apikeys/83abef1e-e7d7-4beb-91fc-79ad90084d5b
response codes  | <ul><li>**Success**: 204 (No Content)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../../#pagination
[2]: https://tools.ietf.org/html/rfc7396
