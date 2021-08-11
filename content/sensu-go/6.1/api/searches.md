---
title: "Searches API"
description: "The Sensu searches API provides HTTP access to the saved searches feature in the Sensu web UI. This reference includes examples for returning lists of saved searches and creating, updating, and deleting saved searches. Read on for the full API documentation."
api_title: "Searches API"
type: "api"
version: "6.1"
product: "Sensu Go"
menu:
  sensu-go-6.1:
    parent: api
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the searches API in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features](../../commercial/).
{{% /notice %}}

{{% notice note %}}
**NOTE**: Requests to the searches API require you to authenticate with a Sensu [API key](../#configure-an-environment-variable-for-api-key-authentication) or [access token](../#authenticate-with-the-authentication-api).
The code examples in this document use the [environment variable](../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all searches

The `/searches` API endpoint provides HTTP GET access to the list of saved searches.

### Example {#searches-get-example}

The following example demonstrates a request to the `/search` API endpoint, resulting in a JSON array that contains saved search definitions.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/searches/v1/namespaces/default/searches \
-H "Authorization: Key $SENSU_API_KEY"

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
{{< /code >}}

### API Specification {#searches-get-specification}

/searches (GET)  | 
---------------|------
description    | Returns the list of saved searches.
example url    | http://hostname:8080/api/enterprise/searches/v1/namespaces/default/searches
response filtering | This endpoint supports [API response filtering][1].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code shell >}}
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
{{< /code >}}

## Get a specific search {#searchessearch-get}

The `/searches/:search` API endpoint provides HTTP GET access to a specific `:search` definition, by the saved search `name`.

### Example {#searchessearch-get-example}

In the following example, querying the `/searches/:search` API endpoint returns a JSON map that contains the requested [`:search` definition][1] (in this example, for the `:search` named `silenced-events`).

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/searches/v1/namespaces/default/searches/silenced-events \
-H "Authorization: Key $SENSU_API_KEY"

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
{{< /code >}}

### API Specification {#searchessearch-get-specification}

/searches/:search (GET) | 
---------------------|------
description          | Returns the specified search.
example url          | http://hostname:8080/api/enterprise/searches/v1/namespaces/default/searches/silenced-events
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code json >}}
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
{{< /code >}}

## Create or update a search {#searchessearch-put}

The `/searches/:search` API endpoint provides HTTP PUT access to create or update a saved search by the saved search `name`.

### Example {#searchessearch-put-example}

In the following example, an HTTP PUT request is submitted to the `/searches/:search` API endpoint to create or update a saved search for events that are silenced.
The request includes the saved search definition in the request body and returns a successful HTTP `200 OK` response and the created or updated saved search definition.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
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
{{< /code >}}

### API Specification {#searchessearch-put-specification}

/searches/:search (PUT) | 
----------------|------
description     | Creates or updates the specified saved search.
example URL     | http://hostname:8080/api/enterprise/searches/v1/namespaces/default/searches/silenced-events
payload         | {{< code shell >}}
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
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a search {#searchessearch-delete}

The `/searches/:search` API endpoint provides HTTP DELETE access to delete a saved search from Sensu (specified by the saved search name).

### Example {#searchessearch-delete-example}

The following example shows a request to the `/searches/:search` API endpoint to delete the saved search `silenced-events`, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/enterprise/searches/v1/namespaces/default/searches/silenced-events

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification {#searchessearch-delete-specification}

/searches/:search (DELETE) | 
--------------------------|------
description               | Removes a saved search from Sensu (specified by the search name).
example url               | http://hostname:8080/api/enterprise/searches/v1/namespaces/default/searches/silenced-events
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../#response-filtering
