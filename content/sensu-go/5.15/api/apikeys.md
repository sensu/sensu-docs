---
title: "APIKeys API"
description: "The APIKeys API provides HTTP access to API key data. This is a reference for the APIKeys API in Sensu Go, including examples for returning lists of API keys, creating API keys, and more. Read on for the full reference."
version: "5.15"
product: "Sensu Go"
menu:
  sensu-go-5.15:
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

The following example demonstrates a request to the `/apikeys` API, resulting in a JSON array containing all API keys.

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/apikeys -H "Authorization: Bearer $SENSU_TOKEN"
{
  "username": "admin"
}

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

/apikeys (POST) | 
----------------|------
description     | Creates a new API key. The server will create a new key ID (UUID or similar). The response will return HTTP 201 and a Location header where the key can be retrieved.
example URL     | http://hostname:8080/api/core/v2/apikeys
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
payload         | {{< highlight shell >}}
{
  "metadata": {
    "name": "my-api-key"
    },
  "key": "79190ae3-ca48-4e08-80e3-97e8c89af32e",
  "username": "admin",
  "created_at": 1569874845
}
{{< /highlight >}}

## The `/apikeys/:apikey` API endpoint {#the-apikeysapikey-api-endpoint}

### `/apikeys/:apikey` (GET) {#apikeysapikey-get}

The `/apikeys/:apikey` GET endpoint retrieves the specified API key.

#### EXAMPLE {#apikeysapikey-get-example}

In the following example, querying the `/apikeys/:apikey` API returns the requested `:apikey` definition or an error if the key is not found.

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/apikeys/{my-api-key} -H "Authorization: Bearer $SENSU_TOKEN"

HTTP/1.1 200 OK
{
  "metadata": {
    "name": "my-api-key"
    },
  "key": "79190ae3-ca48-4e08-80e3-97e8c89af32e",
  "username": "admin",
  "created_at": 1569874845
}
{{< /highlight >}}

#### API Specification {#apikeysapikey-get-specification}

/apikeys/:apikey (GET) | 
---------------------|------
description          | Returns the specified API key.
example url          | http://hostname:8080/api/core/v2/apikeys/{my-api-key}
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "metadata": {
    "name": "my-api-key"
    },
  "key": "79190ae3-ca48-4e08-80e3-97e8c89af32e",
  "username": "admin",
  "created_at": 1569874845
}
{{< /highlight >}}

### `/apikeys/:apikey` (DELETE) {#apikeysapikey-delete}

#### API Specification {#apikeysapikey-delete-specification}

/apikeys/:apikey (DELETE) | 
----------------|------
description     | Revokes the specified API key.
example URL     | http://hostname:8080/api/core/v2/apikeys/{my-api-key}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output          | {{< highlight shell >}}
curl -X DELETE -H "Authorization: Bearer $SENSU_TOKEN"  http://localhost:8080/api/core/v2/apikeys/my-api-key

curl -I -X DELETE -H "Authorization: Bearer $SENSU_TOKEN"  http://
demo.sensuplusgremlin.rocks:8080/api/core/v2/apikeys/{my-api-key}
4
HTTP/1.1 204 No Content
Content-Type: application/json
Date: Mon, 26 Aug 2019 18:51:28 GMT
{{< /highlight >}}


[1]: ../overview#pagination
[2]: ../role-bindings/
[3]: ../cluster-role-bindings/
