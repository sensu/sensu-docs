---
title: "Assets API"
description: "Sensu Go assets API reference documentation"
version: "5.0"
product: "Sensu Go"
menu:
  sensu-go-5.0:
    parent: api
---

- [The `/assets` API endpoint](#the-assets-api-endpoint)
	- [`/assets` (GET)](#assets-get)
	- [`/assets` (POST)](#assets-post)
	- [`/assets` (PUT)](#assets-put)
- [The `/assets/:asset` API endpoint](#the-assetsasset-api-endpoint)
	- [`/assets/:asset` (GET)](#assetsasset-get)

## The `/assets` API endpoint

### `/assets` (GET)

The `/assets` API endpoint provides HTTP GET access to [asset][1] data.

#### EXAMPLE {#assets-get-example}

The following example demonstrates a request to the `/assets` API, resulting in
a JSON Array containing [asset definitions][1].

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/namespaces/default/assets -H "Authorization: Bearer TOKEN"
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
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/assets` (PUT)

/assets (PUT) | 
----------------|------
description     | Create or update a Sensu asset.
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
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/assets/:asset` API endpoint {#the-assetsasset-api-endpoint}

### `/assets/:asset` (GET) {#assetsasset-get}

The `/assets/:asset` API endpoint provides HTTP GET access to [asset data][1] for specific `:asset` definitions, by asset `name`.

#### EXAMPLE {#assetsasset-get-example}

In the following example, querying the `/assets/:asset` API returns a JSON Map
containing the requested [`:asset` definition][1] (in this example: for the `:asset` named
`check_script`).

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/namespaces/default/assets/check_script -H "Authorization: Bearer TOKEN"
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

[1]: ../../reference/assets
