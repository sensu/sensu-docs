---
title: "Extensions API"
description: "Sensu Go extensions API reference documentation"
version: "5.0"
product: "Sensu Go"
menu:
  sensu-go-5.0:
    parent: api
---

## The `/extensions` API endpoint

### `/extensions` (GET)

The `/extensions` API endpoint provides HTTP GET access to extension data.

#### EXAMPLE {#extensions-get-example}

The following example demonstrates a request to the `/extensions` API, resulting in
a JSON Array containing extension definitions.

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/apis/core/v2/extensions -H "Authorization: Bearer TOKEN"
[
  {
    "url": "127.0.0.1:31000",
    "metadata": {
      "name": "handle-extension",
      "namespace": "devops",
      "labels": null,
      "annotations": null
    }
  }
]
{{< /highlight >}}

#### API Specification {#extensions-get-specification}

/extensions (GET)  | 
---------------|------
description    | Returns the list of extensions.
example url    | http://hostname:8080/apis/core/v2/extensions
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "url": "127.0.0.1:31000",
    "metadata": {
      "name": "handle-extension",
      "namespace": "devops",
      "labels": null,
      "annotations": null
    }
  }
]
{{< /highlight >}}

## The `/extensions/:extension` API endpoint {#the-extensionsextension-api-endpoint}

### `/extensions/:extension` (GET) {#extensionsextension-get}

The `/extensions/:extension` API endpoint provides HTTP GET access to extension data for specific `:extension` definitions, by extension `name`.

#### EXAMPLE {#extensionsextension-get-example}

In the following example, querying the `/extensions/:extension` API returns a JSON Map
containing the requested `:extension` definition (in this example: for the `:extension` named
`handle-extension`).

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/apis/core/v2/extensions/handle-extension -H "Authorization: Bearer TOKEN"
{
  "url": "127.0.0.1:31000",
  "metadata": {
    "name": "handle-extension",
    "namespace": "devops",
    "labels": null,
    "annotations": null
  }
}
{{< /highlight >}}

#### API Specification {#extensionsextension-get-specification}

/extensions/:extension (GET) | 
---------------------|------
description          | Returns a extension.
example url          | http://hostname:8080/apis/core/v2/extensions/handle-extension
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "url": "127.0.0.1:31000",
  "metadata": {
    "name": "handle-extension",
    "namespace": "devops",
    "labels": null,
    "annotations": null
  }
}
{{< /highlight >}}

