---
title: "APIKey API"
description: "The APIKey API provides HTTP access to API key data. This is a reference for the APIKey API in Sensu Go, including examples for returning lists of API keys, creating API keys, and more. Read on for the full reference."
version: "5.14"
product: "Sensu Go"
menu:
  sensu-go-5.14:
    parent: api
---

- [The `/apikey` API endpoint](#the-apikey-api-endpoint)
	- [`/apikey` (GET)](#apikey-get)
	- [`/apikey` (POST)](#apikey-post)
- [The `/apikey/:apikey` API endpoint](#the-apikeyapikey-api-endpoint)
	- [`/apikey/:apikey` (GET)](#apikeyapikey-get)
  - [`/apikey/:apikey` (PATCH)](#apikeyapikey-patch)
  - [`/apikey/:apikey` (DELETE)](#apikeyapikey-delete)


## The `/apikey` API endpoint

### `/apikey` (GET)

The `/apikey` GET endpoint retrieves all API keys.

#### EXAMPLE {#apikey-get-example}

The following example demonstrates a request to the `/apikey` API, resulting in a JSON array containing all API keys.

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/namespaces/default/apikey -H "Authorization: Bearer $SENSU_TOKEN"

HTTP/1.1 200 OK
[
  {
    "url": "https://github.com/sensu/sensu-slack-handler/releases/download/1.0.3/sensu-slack-handler_1.0.3_linux_amd64.tar.gz",
    "sha512": "68720865127fbc7c2fe16ca4d7bbf2a187a2df703f4b4acae1c93e8a66556e9079e1270521999b5871473e6c851f51b34097c54fdb8d18eedb7064df9019adc8",
    "filters": {
      "entity.system.os": "linux",
      "entity.system.arch": "amd64"
    },
    "headers": null,
    "metadata": {
      "name": "sensu-slack-handler",
      "namespace": "default"
    }
  }
]
{{< /highlight >}}

#### API Specification {#apikey-get-specification}

/apikey (GET)  | 
---------------|------
description    | Returns the list of API keys.
example url    | http://hostname:8080/api/core/v2/namespaces/default/apikey
pagination     | This endpoint supports pagination using the `limit` and `continue` query parameters. See the [API overview][1] for details.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "url": "https://github.com/sensu/sensu-influxdb-handler/releases/download/3.1.2/sensu-influxdb-handler_3.1.2_linux_amd64.tar.gz",
    "sha512": "612c6ff9928841090c4d23bf20aaf7558e4eed8977a848cf9e2899bb13a13e7540bac2b63e324f39d9b1257bb479676bc155b24e21bf93c722b812b0f15cb3bd",
    "filters": {
      "entity.system.os": "linux",
      "entity.system.arch": "amd64"
    },
    "headers": null,
    "metadata": {
      "name": "sensu-influxdb-handler",
      "namespace": "default"
    }
  },
  {
    "url": "https://github.com/sensu/sensu-slack-handler/releases/download/1.0.3/sensu-slack-handler_1.0.3_linux_amd64.tar.gz",
    "sha512": "68720865127fbc7c2fe16ca4d7bbf2a187a2df703f4b4acae1c93e8a66556e9079e1270521999b5871473e6c851f51b34097c54fdb8d18eedb7064df9019adc8",
    "filters": null,
    "metadata": {
      "name": "sensu-slack-handler",
      "namespace": "default"
    }
  }
]
{{< /highlight >}}

### `/apikey` (POST)

/apikey (POST) | 
----------------|------
description     | Creates a new API key. The server will create a new Key ID (UUID or similar). The response will return HTTP 201 and a Location header where the key can be retrieved.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/apikey
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
payload         | {{< highlight shell >}}
{
  "url": "https://asset-url.tar.gz",
  "sha512": "xxxxxxxxxxxxxxxxxxxxx",
  "filters": {
    "entity.system.os": "linux",
    "entity.system.arch": "amd64"
  },
  "headers": {
    "Authorization": "Bearer $TOKEN",
    "X-Forwarded-For": "client1, proxy1, proxy2"
  },
  "metadata": {
    "name": "apikey-id",
    "namespace": "default"
  }
}
{{< /highlight >}}

## The `/apikey/:apikey` API endpoint {#the-apikeyapikey-api-endpoint}

### `/apikey/:apikey` (GET) {#apikeyapikey-get}

The `/apikey/:apikey` GET endpoint retrieves the specified API key.

#### EXAMPLE {#apikeyapikey-get-example}

In the following example, querying the `/apikey/:apikey` API returns the requested `:apikey` definition or an error if the key is not found.

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/namespaces/default/assets/sensu-slack-handler -H "Authorization: Bearer $SENSU_TOKEN"

HTTP/1.1 200 OK
{
  "url": "https://github.com/sensu/sensu-slack-handler/releases/download/1.0.3/sensu-slack-handler_1.0.3_linux_amd64.tar.gz",
  "sha512": "68720865127fbc7c2fe16ca4d7bbf2a187a2df703f4b4acae1c93e8a66556e9079e1270521999b5871473e6c851f51b34097c54fdb8d18eedb7064df9019adc8",
  "filters": {
    "entity.system.os": "linux",
    "entity.system.arch": "amd64"
  },
  "headers": null,
  "metadata": {
    "name": "sensu-slack-handler",
    "namespace": "default"
  }
}
{{< /highlight >}}

#### API Specification {#apikeyapikey-get-specification}

/apikey/:apikey (GET) | 
---------------------|------
description          | Returns the specified API key.
example url          | http://hostname:8080/api/core/v2/namespaces/default/apikey/apikey-id
response type        | **[NEEDED]**
response codes       | <ul><li>**Success**: 200 (OK)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "url": "https://asset-url.tar.gz",
  "sha512": "xxxxxxxxxxxxxxxxxxxxx",
  "filters": {
    "entity.system.os": "linux",
    "entity.system.arch": "amd64"
  },
  "headers": {
    "Authorization": "Bearer $TOKEN",
    "X-Forwarded-For": "client1, proxy1, proxy2"
  },
  "metadata": {
    "name": "apikey-id",
    "namespace": "default"
  }
}
{{< /highlight >}}

### `/apikey/:apikey` (PATCH) {#apikeyapikey-patch}

#### API Specification {#apikeyapikey-patch-specification}

/apikey/:apikey (PATCH) | 
----------------|------
description     | Updates the [role bindings][2] or [cluster role bindings][3] of the specified API key or an error if key is not found.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/apikey/apikey-id
payload         | {{< highlight shell >}}
{
  "url": "https://asset-url.tar.gz",
  "sha512": "xxxxxxxxxxxxxxxxxxxxx",
  "filters": {
    "entity.system.os": "linux",
    "entity.system.arch": "amd64"
  },
  "headers": {
    "Authorization": "Bearer $TOKEN",
    "X-Forwarded-For": "client1, proxy1, proxy2"
  },
  "metadata": {
    "name": "apikeyid",
    "namespace": "default"
  }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/apikey/:apikey` (DELETE) {#apikeyapikey-delete}

#### API Specification {#apikeyapikey-delete-specification}

/apikey/:apikey (DELETE) | 
----------------|------
description     | Revokes the specified API key.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/apikey/apikey-id
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output                    | {{< highlight shell >}}
curl -X DELETE -H "Authorization: Bearer $SENSU_TOKEN"  http://localhost:8080/api/core/v2/namespaces/default/apikey/apikey-id 


 curl -I -X DELETE -H "Authorization: Bearer $SENSU_TOKEN"  http://
demo.sensuplusgremlin.rocks:8080/api/core/v2/namespaces/default/apikey/apikey_id
4
HTTP/1.1 204 No Content
Content-Type: application/json
Sensu-Entity-Count: 6
Sensu-Entity-Limit: 1000
Date: Mon, 26 Aug 2019 18:51:28 GMT
{{< /highlight >}}

[1]: ../overview#pagination
[2]: ../role-bindings/
[3]: ../cluster-role-bindings/
