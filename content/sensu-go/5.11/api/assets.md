---
title: "Assets API"
description: "The assets API provides HTTP access to asset data. Here’s a reference for the assets API in Sensu Go, including examples for returning lists of assets, creating assets, and more. Read on for the full reference."
version: "5.11"
product: "Sensu Go"
menu:
  sensu-go-5.11:
    parent: api
---

- [The `/assets` API endpoint](#the-assets-api-endpoint)
	- [`/assets` (GET)](#assets-get)
	- [`/assets` (POST)](#assets-post)
- [The `/assets/:asset` API endpoint](#the-assetsasset-api-endpoint)
	- [`/assets/:asset` (GET)](#assetsasset-get)
  - [`/assets/:asset` (PUT)](#assetsasset-put)

## The `/assets` API endpoint

### `/assets` (GET)

The `/assets` API endpoint provides HTTP GET access to [asset][1] data.

#### EXAMPLE {#assets-get-example}

The following example demonstrates a request to the `/assets` API, resulting in
a JSON Array containing [asset definitions][1].

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/namespaces/default/assets -H "Authorization: Bearer $SENSU_TOKEN"

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

#### API Specification {#assets-get-specification}

/assets (GET)  | 
---------------|------
description    | Returns the list of assets.
example url    | http://hostname:8080/api/core/v2/namespaces/default/assets
pagination     | This endpoint supports pagination using the `limit` and `continue` query parameters. See the [API overview](../overview#pagination) for details.
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

### `/assets` (POST)

/assets (POST) | 
----------------|------
description     | Create a Sensu asset.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/assets
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
    "name": "my-secure-asset",
    "namespace": "default"
  }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/assets/:asset` API endpoint {#the-assetsasset-api-endpoint}

### `/assets/:asset` (GET) {#assetsasset-get}

The `/assets/:asset` API endpoint provides HTTP GET access to [asset data][1] for specific `:asset` definitions, by asset `name`.

#### EXAMPLE {#assetsasset-get-example}

In the following example, querying the `/assets/:asset` API returns a JSON Map
containing the requested [`:asset` definition][1] (in this example: for the `:asset` named
`check_script`).

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

#### API Specification {#assetsasset-get-specification}

/assets/:asset (GET) | 
---------------------|------
description          | Returns an asset.
example url          | http://hostname:8080/api/core/v2/namespaces/default/assets/my-secure-asset
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
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
    "name": "my-secure-asset",
    "namespace": "default"
  }
}
{{< /highlight >}}

### `/assets/:asset` (PUT) {#assetsasset-put}

#### API Specification {#assetsasset-put-specification}

/assets/:asset (PUT) | 
----------------|------
description     | Create or update a Sensu asset.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/assets/my-secure-asset
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
    "name": "my-secure-asset",
    "namespace": "default"
  }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/assets
