---
title: "APIKeys API"
description: "The Sensu APIKeys API provides HTTP access to API key data. This reference includes examples for returning lists of API keys, creating API keys, and more."
version: "5.17"
product: "Sensu Go"
menu:
  sensu-go-5.17:
    parent: api
---

- [The `/apikeys` API endpoint](#the-apikeys-api-endpoint)
	- [`/apikeys` (GET)](#apikeys-get)
	- [`/apikeys` (POST)](#apikeys-post)
- [The `/apikeys/:apikey` API endpoint](#the-apikeysapikey-api-endpoint)
	- [`/apikeys/:apikey` (GET)](#apikeysapikey-get)
	- [`/apikeys/:apikey` (DELETE)](#apikeysapikey-delete)


## The `/apikeys` API endpoint

### `/apikeys` (GET)

The `/apikeys` GET endpoint retrieves all API keys.

#### EXAMPLE {#apikeys-get-example}

The following example demonstrates a request to the `/apikeys` API endpoint, resulting in a JSON array that contains all API keys.

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/apikeys \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 200 OK

[
  {
    "metadata": {
      "name": "83abef1e-e7d7-4beb-91fc-79ad90084d5b"
    },
    "username": "admin",
    "created_at": 1570640363
  }
]
{{< /highlight >}}

#### API Specification {#apikeys-get-specification}

/apikeys (GET)  | 
---------------|------
description    | Returns the list of API keys.
example url    | http://hostname:8080/api/core/v2/apikeys
pagination     | This endpoint supports pagination using the `limit` and `continue` query parameters. See the [API overview][1] for details.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "metadata": {
      "name": "83abef1e-e7d7-4beb-91fc-79ad90084d5b"
    },
    "username": "admin",
    "created_at": 1570640363
  }
]
{{< /highlight >}}

### `/apikeys` (POST)

The `/apikeys` API endpoint provides HTTP POST access to create a new API key.

#### EXAMPLE {#apikeys-post-example}

In the following example, an HTTP POST request is submitted to the `/apikeys` API endpoint to create a new API key.
The request includes the API key definition in the request body and returns a successful HTTP `201 Created` response.

{{< highlight shell >}}
curl -X POST \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "username": "admin"
}' \
http://127.0.0.1:8080/api/core/v2/apikeys

HTTP/1.1 201 Created
{{< /highlight >}}

#### API Specification {#apikeys-post-specification}

/apikeys (POST) | 
----------------|------
description     | Creates a new API key, a Sensu-generated UUID. The response will include HTTP 201 and a `Location` header that contains the relative path to the new API key.
example URL     | http://hostname:8080/api/core/v2/apikeys
request payload  | {{< highlight shell >}}
{
  "username": "admin"
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/apikeys/:apikey` API endpoint {#the-apikeysapikey-api-endpoint}

### `/apikeys/:apikey` (GET) {#apikeysapikey-get}

The `/apikeys/:apikey` GET endpoint retrieves the specified API key.

#### EXAMPLE {#apikeysapikey-get-example}

In the following example, querying the `/apikeys/:apikey` API returns the requested `:apikey` definition or an error if the key is not found.

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/apikeys/83abef1e-e7d7-4beb-91fc-79ad90084d5b \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 200 OK
{
  "metadata": {
    "name": "83abef1e-e7d7-4beb-91fc-79ad90084d5b"
  },
  "username": "admin",
  "created_at": 1570640363
}
{{< /highlight >}}

#### API Specification {#apikeysapikey-get-specification}

/apikeys/:apikey (GET) | 
---------------------|------
description          | Returns the specified API key.
example url          | http://hostname:8080/api/core/v2/apikeys/83abef1e-e7d7-4beb-91fc-79ad90084d5b
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "metadata": {
    "name": "83abef1e-e7d7-4beb-91fc-79ad90084d5b"
  },
  "username": "admin",
  "created_at": 1570640363
}
{{< /highlight >}}

### `/apikeys/:apikey` (DELETE) {#apikeysapikey-delete}

The `/apikeys/:apikey` API endpoint provides HTTP DELETE access to remove an API key.

#### EXAMPLE {#apikeysapikey-delete-example}

The following example shows a request to the `/apikeys/:apikey` API endpoint to delete the API key `83abef1e-e7d7-4beb-91fc-79ad90084d5b`, resulting in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
http://127.0.0.1:8080/api/core/v2/apikeys/83abef1e-e7d7-4beb-91fc-79ad90084d5b

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#apikeysapikey-delete-specification}

/apikeys/:apikey (DELETE) | 
----------------|------
description     | Revokes the specified API key.
example URL     | http://hostname:8080/api/core/v2/apikeys/83abef1e-e7d7-4beb-91fc-79ad90084d5b
response codes  | <ul><li>**Success**: 204 (No Content)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../overview#pagination
