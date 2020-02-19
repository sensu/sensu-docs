---
title: "Namespaces API"
description: "The Sensu namespace API provides HTTP access to namespace data. This reference includes examples for returning lists of namespaces, creating Sensu namespaces, and more. Read on for the full reference."
version: "5.17"
product: "Sensu Go"
menu:
  sensu-go-5.17:
    parent: api
---

- [The `/namespaces` API endpoint](#the-namespaces-api-endpoint)
	- [`/namespaces` (GET)](#namespaces-get)
	- [`/namespaces` (POST)](#namespaces-post)
- [The `/namespaces/:namespace` API endpoint](#the-namespacesnamespace-api-endpoint)
  - [`/namespaces/:namespace` (PUT)](#namespacesnamespace-put)
  - [`/namespaces/:namespace` (DELETE)](#namespacesnamespace-delete)
- [The `/user-namespaces` API endpoint](#the-user-namespaces-api-endpoint)
  - [`/user-namespaces` (GET)](#user-namespaces-get)

## The `/namespaces` API endpoint

### `/namespaces` (GET)

The `/namespaces` API endpoint provides HTTP GET access to [namespace][1] data.

#### EXAMPLE {#namespaces-get-example}

The following example demonstrates a request to the `/namespaces` API endpoint, resulting in a JSON array that contains [namespace definitions][1].

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 200 OK
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
pagination     | This endpoint supports pagination using the [`limit` query parameter][2].
response filtering | This endpoint supports [API response filtering][3].
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

The `/namespaces` API endpoint provides HTTP POST access to create Sensu namespaces.

#### EXAMPLE {#namespaces-post-example}

In the following example, an HTTP POST request is submitted to the `/namespaces` API endpoint to create the namespace `development`.
The request returns a successful HTTP `201 Created` response.

{{< highlight shell >}}
curl -X POST \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "name": "development"
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/namespaces

HTTP/1.1 201 Created
{{< /highlight >}}

#### API Specification {#namespaces-post-specification}

/namespaces (POST) | 
----------------|------
description     | Creates a Sensu namespace.
example URL     | http://hostname:8080/api/core/v2/namespaces
payload         | {{< highlight shell >}}
{
  "name": "development"
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/namespaces/:namespace` API endpoint {#the-namespacesnamespace-api-endpoint}

### `/namespaces/:namespace` (PUT) {#namespacesnamespace-put}

The `/namespaces/:namespace` API endpoint provides HTTP PUT access to create or update specific Sensu namespaces, by namespace name.

#### EXAMPLE {#namespacesnamespace-put-example}

In the following example, an HTTP PUT request is submitted to the `/namespaces/:namespace` API endpoint to create the namespace `development`.
The request returns a successful HTTP `201 Created` response.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "name": "development"
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/namespaces/development

HTTP/1.1 201 Created
{{< /highlight >}}

#### API Specification {#namespacesnamespace-put-specification}

/namespaces/:namespace (PUT) | 
----------------|------
description     | Creates or updates a Sensu namespace.
example URL     | http://hostname:8080/api/core/v2/namespaces/development
payload         | {{< highlight shell >}}
{
  "name": "development"
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/namespaces/:namespace` (DELETE) {#namespacesnamespace-delete}

The `/namespaces/:namespace` API endpoint provides HTTP DELETE access to delete a namespace from Sensu (specified by the namespace name).

#### EXAMPLE {#namespacesnamespace-delete-example}

The following example shows a request to the `/namespaces/:namespace` API endpoint to delete the namespace `development`, resulting in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/core/v2/namespaces/development \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#namespacesnamespace-delete-specification}

/namespaces/:namespace (DELETE) | 
--------------------------|------
description               | Removes the specified namespace from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/development
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/user-namespaces` API endpoint {#the-user-namespaces-api-endpoint}

### `/user-namespaces` (GET)

The `/user-namespaces` API endpoint provides HTTP GET access to the namespaces the user has access to.

#### EXAMPLE {#user-namespaces-get-example}

The following example demonstrates a request to the `/user-namespaces` API endpoint, resulting in a JSON array that contains the namespaces the user has access to.

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/user-namespaces \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 200 OK
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

/user-namespaces (GET)  | 
---------------|------
description    | Returns the list of namespaces a user has access to.
example url    | http://hostname:8080/api/enterprise/user-namespaces
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

[1]: ../../reference/rbac/
[2]: ../overview#limit-query-parameter
[3]: ../overview#response-filtering
