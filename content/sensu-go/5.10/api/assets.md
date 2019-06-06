---
title: "Assets API"
description: "The assets API provides HTTP access to asset data. Here’s a reference for the assets API in Sensu Go, including examples for returning lists of assets, creating assets, and more. Read on for the full reference."
version: "5.10"
product: "Sensu Go"
menu:
  sensu-go-5.10:
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
[
  {
    "url": "http://example.com/asset1.tar.gz",
    "sha512": "4f926bf4328fbad2b9cac873d117f771914f4b837c9c85584c38ccf55a3ef3c2e8d154812246e5dda4a87450576b2c58ad9ab40c9e2edc31b288d066b195b21b",
    "metadata": {
      "name": "check_script1",
      "namespace": "default",
      "labels": null,
      "annotations": null
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
    "url": "http://example.com/asset1.tar.gz",
    "sha512": "4f926bf4328fbad2b9cac873d117f771914f4b837c9c85584c38ccf55a3ef3c2e8d154812246e5dda4a87450576b2c58ad9ab40c9e2edc31b288d066b195b21b",
    "metadata": {
      "name": "check_script1",
      "namespace": "default",
      "labels": null,
      "annotations": null
    }
  },
  {
    "url": "http://example.com/asset2.tar.gz",
    "sha512": "37c9c85584c38ccf55a3ef3c2e8d154812246e5dda4a84f926bf4328fbad2b9cac873d11450576b2c58ad9ab40c9e2edc31b288d066b195b21b7f771914f4b87",
    "metadata": {
      "name": "check_script2",
      "namespace": "default",
      "labels": null,
      "annotations": null
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
  "url": "http://example.com/asset1.tar.gz",
  "sha512": "4f926bf4328fbad2b9cac873d117f771914f4b837c9c85584c38ccf55a3ef3c2e8d154812246e5dda4a87450576b2c58ad9ab40c9e2edc31b288d066b195b21b",
  "metadata": {
    "name": "check_script1",
    "namespace": "default",
    "labels": null,
    "annotations": null
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
curl http://127.0.0.1:8080/api/core/v2/namespaces/default/assets/check_script -H "Authorization: Bearer $SENSU_TOKEN"
{
  "url": "http://example.com/asset.tar.gz",
  "sha512": "4f926bf4328fbad2b9cac873d117f771914f4b837c9c85584c38ccf55a3ef3c2e8d154812246e5dda4a87450576b2c58ad9ab40c9e2edc31b288d066b195b21b",
  "filters": [
    "system.os == 'linux'",
    "system.arch == 'amd64'"
  ],
  "metadata": {
    "name": "check_script",
    "namespace": "default",
    "labels": null,
    "annotations": null
  }
}
{{< /highlight >}}

#### API Specification {#assetsasset-get-specification}

/assets/:asset (GET) | 
---------------------|------
description          | Returns an asset.
example url          | http://hostname:8080/api/core/v2/namespaces/default/assets/check_script
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "url": "http://example.com/asset.tar.gz",
  "sha512": "4f926bf4328fbad2b9cac873d117f771914f4b837c9c85584c38ccf55a3ef3c2e8d154812246e5dda4a87450576b2c58ad9ab40c9e2edc31b288d066b195b21b",
  "filters": [
    "system.os == 'linux'",
    "system.arch == 'amd64'"
  ],
  "metadata": {
    "name": "check_script",
    "namespace": "default",
    "labels": null,
    "annotations": null
  }
}
{{< /highlight >}}

### `/assets/:asset` (PUT) {#assetsasset-put}

#### API Specification {#assetsasset-put-specification}

/assets/:asset (PUT) | 
----------------|------
description     | Create or update a Sensu asset.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/assets/check_script
payload         | {{< highlight shell >}}
{
  "url": "http://example.com/asset1.tar.gz",
  "sha512": "4f926bf4328fbad2b9cac873d117f771914f4b837c9c85584c38ccf55a3ef3c2e8d154812246e5dda4a87450576b2c58ad9ab40c9e2edc31b288d066b195b21b",
  "metadata": {
    "name": "check_script1",
    "namespace": "default",
    "labels": null,
    "annotations": null
  }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/assets
