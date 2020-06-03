---
title: "Searches API"
description: "The Sensu searches API provides HTTP access to the saved searches feature in the Sensu web UI. This reference includes examples for returning lists of saved searches and creating, updating, and deleting saved searches. Read on for the full API documentation."
version: "5.20"
product: "Sensu Go"
menu:
  sensu-go-5.20:
    parent: api
---

- [The `/searches` API endpoint](#the-searches-api-endpoint)
	- [`/searches` (GET)](#searches-get)
- [The `/searches/:search` API endpoint](#the-searchessearch-api-endpoint)
	- [`/searches/:search` (GET)](#searchessearch-get)
  - [`/searches/:search` (PUT)](#searchessearch-put)
	- [`/searches/:search` (DELETE)](#searchessearch-delete)

**COMMERCIAL FEATURE**: Access the searches API in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][2].

## The `/searches` API endpoint

### `/searches` (GET)

The `/searches` API endpoint provides HTTP GET access to the list of saved searches.

#### EXAMPLE {#searches-get-example}

The following example demonstrates a request to the `/search` API endpoint, resulting in a JSON array that contains saved search definitions.

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/searches/v1/namespaces/default/searches \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 200 OK
[
  {
    "type": "Search",
    "api_version": "searches/v1",
    "metadata": {
      "name": "incidents-us-west",
      "namespace": "default"
    },
    "spec": {
      "parameters": [
        "labelSelector:region == \"us-west-1\"",
        "status:incident"
      ],
      "resource": "core.v2/Event"
    }
  },
  {
    "type": "Search",
    "api_version": "searches/v1",
    "metadata": {
      "name": "silenced-events",
      "namespace": "default"
    },
    "spec": {
      "parameters": [
        "silenced:true"
      ],
      "resource": "core.v2/Event"
    }
  },
  {
    "type": "Search",
    "api_version": "searches/v1",
    "metadata": {
      "name": "web-agent",
      "namespace": "default"
    },
    "spec": {
      "parameters": [
        "class:agent",
        "subscription:web"
      ],
      "resource": "core.v2/Entity"
    }
  }
]
{{< /highlight >}}

#### API Specification {#searches-get-specification}

/searches (GET)  | 
---------------|------
description    | Returns the list of saved searches.
example url    | http://hostname:8080/api/enterprise/searches/v1/namespaces/default/searches
response filtering | This endpoint supports [API response filtering][1].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "type": "Search",
    "api_version": "searches/v1",
    "metadata": {
      "name": "incidents-us-west",
      "namespace": "default"
    },
    "spec": {
      "parameters": [
        "labelSelector:region == \"us-west-1\"",
        "status:incident"
      ],
      "resource": "core.v2/Event"
    }
  },
  {
    "type": "Search",
    "api_version": "searches/v1",
    "metadata": {
      "name": "silenced-events",
      "namespace": "default"
    },
    "spec": {
      "parameters": [
        "silenced:true"
      ],
      "resource": "core.v2/Event"
    }
  },
  {
    "type": "Search",
    "api_version": "searches/v1",
    "metadata": {
      "name": "web-agent",
      "namespace": "default"
    },
    "spec": {
      "parameters": [
        "class:agent",
        "subscription:web"
      ],
      "resource": "core.v2/Entity"
    }
  }
]
{{< /highlight >}}

## The `/searches/:search` API endpoint {#the-searchessearch-api-endpoint}

### `/searches/:search` (GET) {#searchessearch-get}

The `/searches/:search` API endpoint provides HTTP GET access to a specific `:search` definition, by the saved search `name`.

#### EXAMPLE {#searchessearch-get-example}

In the following example, querying the `/searches/:search` API endpoint returns a JSON map that contains the requested [`:search` definition][1] (in this example, for the `:search` named `silenced-events`).

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/searches/v1/namespaces/default/searches/silenced-events \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 200 OK
{
  "type": "Search",
  "api_version": "searches/v1",
  "metadata": {
    "name": "silenced-events",
    "namespace": "default"
  },
  "spec": {
    "parameters": [
      "silenced:true"
    ],
    "resource": "core.v2/Event"
  }
}
{{< /highlight >}}

#### API Specification {#searchessearch-get-specification}

/searches/:search (GET) | 
---------------------|------
description          | Returns the specified search.
example url          | http://hostname:8080/api/enterprise/searches/v1/namespaces/default/searches/silenced-events
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "type": "Search",
  "api_version": "searches/v1",
  "metadata": {
    "name": "silenced-events",
    "namespace": "default"
  },
  "spec": {
    "parameters": [
      "silenced:true"
    ],
    "resource": "core.v2/Event"
  }
}
{{< /highlight >}}

### `/searches/:search` (PUT) {#searchessearch-put}

The `/searches/:search` API endpoint provides HTTP PUT access to create or update a saved search by the saved search `name`.

#### EXAMPLE {#searchessearch-put-example}

In the following example, an HTTP PUT request is submitted to the `/searches/:search` API endpoint to create or update a saved search for events that are silenced.
The request includes the saved search definition in the request body and returns a successful HTTP `200 OK` response and the created or updated saved search definition.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "type": "Search",
  "api_version": "searches/v1",
  "metadata": {
    "name": "silenced-events",
    "namespace": "default"
  },
  "spec": {
    "parameters": [
      "silenced:true"
    ],
    "resource": "core.v2/Event"
  }
}' \
http://127.0.0.1:8080/api/enterprise/searches/v1/namespaces/default/searches/silenced-events

HTTP/1.1 200 OK
{{< /highlight >}}

#### API Specification {#searchessearch-put-specification}

/searches/:search (PUT) | 
----------------|------
description     | Creates or updates the specified saved search.
example URL     | http://hostname:8080/api/enterprise/searches/v1/namespaces/default/searches/silenced-events
payload         | {{< highlight shell >}}
{
  "type": "Search",
  "api_version": "searches/v1",
  "metadata": {
    "name": "silenced-events",
    "namespace": "default"
  },
  "spec": {
    "parameters": [
      "silenced:true"
    ],
    "resource": "core.v2/Event"
  }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/searches/:search` (DELETE) {#searchessearch-delete}

The `/searches/:search` API endpoint provides HTTP DELETE access to delete a saved search from Sensu (specified by the saved search name).

#### EXAMPLE {#searchessearch-delete-example}

The following example shows a request to the `/searches/:search` API endpoint to delete the saved search `silenced-events`, resulting in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
http://127.0.0.1:8080/api/enterprise/searches/v1/namespaces/default/searches/silenced-events

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#searchessearch-delete-specification}

/searches/:search (DELETE) | 
--------------------------|------
description               | Removes a saved search from Sensu (specified by the search name).
example url               | http://hostname:8080/api/enterprise/searches/v1/namespaces/default/searches/silenced-events
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../overview#response-filtering
[2]: ../../getting-started/enterprise/
