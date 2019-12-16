---
title: "Namespaces API"
description: "The namespace API provides HTTP access to namespace data. Here’s a reference for the namespaces API in Sensu Go, including examples for returning lists of namespaces, creating Sensu namespaces, and more. Read on for the full reference."
version: "5.3"
product: "Sensu Go"
menu:
  sensu-go-5.3:
    parent: api
---

- [The `/namespaces` API endpoint](#the-namespaces-api-endpoint)
	- [`/namespaces` (GET)](#namespaces-get)
	- [`/namespaces` (POST)](#namespaces-post)
- [The `/namespaces/:namespace` API endpoint](#the-namespacesnamespace-api-endpoint)
  - [`/namespaces/:namespace` (PUT)](#namespacesnamespace-put)
  - [`/namespaces/:namespace` (DELETE)](#namespacesnamespace-delete)

## The `/namespaces` API endpoint

### `/namespaces` (GET)

The `/namespaces` API endpoint provides HTTP GET access to [namespace][1] data.

#### EXAMPLE {#namespaces-get-example}

The following example demonstrates a request to the `/namespaces` API, resulting in
a JSON Array containing [namespace definitions][1].

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/namespaces -H "Authorization: Bearer $SENSU_TOKEN"
[
  {
    "name": "default"
  },
  {
    "name": "development"
  }
]
{{< /highlight >}}

#### API Specification {#namespaces-get-specification}

/namespaces (GET)  | 
---------------|------
description    | Returns the list of namespaces.
example url    | http://hostname:8080/api/core/v2/namespaces
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "name": "default"
  },
  {
    "name": "development"
  }
]
{{< /highlight >}}

### `/namespaces` (POST)

/namespaces (POST) | 
----------------|------
description     | Create a Sensu namespace.
example URL     | http://hostname:8080/api/core/v2/namespaces
payload         | {{< highlight shell >}}
{
  "name": "development"
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/namespaces/:namespace` API endpoint {#the-namespacesnamespace-api-endpoint}

### `/namespaces/:namespace` (PUT) {#namespacesnamespace-put}

#### API Specification {#namespacesnamespace-put-specification}

/namespaces/:namespace (PUT) | 
----------------|------
description     | Create or update a Sensu namespace.
example URL     | http://hostname:8080/api/core/v2/namespaces/development
payload         | {{< highlight shell >}}
{
  "name": "development"
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/namespaces/:namespace` (DELETE) {#namespacesnamespace-delete}

The `/namespaces/:namespace` API endpoint provides HTTP DELETE access to delete a namespace from Sensu given the namespace name.

### EXAMPLE {#namespacesnamespace-delete-example}
The following example shows a request to delete the namespace `development`, resulting in a successful HTTP 204 No Content response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_TOKEN" \
http://127.0.0.1:8080/api/core/v2/namespaces/development

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#namespacesnamespace-delete-specification}

/namespaces/:namespace (DELETE) | 
--------------------------|------
description               | Removes a namespace from Sensu given the namespace name.
example url               | http://hostname:8080/api/core/v2/namespaces/development
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/rbac
