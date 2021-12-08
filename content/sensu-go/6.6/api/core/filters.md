---
title: "core/v2/filters"
description: "Sensu core/v2/filters API endpoints provide HTTP access to event filter data. This reference includes examples for retrieving filters, creating filters, and more."
core_api_title: "core/v2/filters"
type: "core_api"
version: "6.6"
product: "Sensu Go"
menu:
  sensu-go-6.6:
    parent: core
---

{{% notice note %}}
**NOTE**: Requests to core/v2/filters API endpoints require you to authenticate with a Sensu [API key](../#configure-an-environment-variable-for-api-key-authentication) or [access token](../#authenticate-with-the-authentication-api).
The code examples in this document use the [environment variable](../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all event filters

The `/filters` API endpoint provides HTTP GET access to [event filter][1] data.

### Example {#filters-get-example}

The following example demonstrates a request to the `/filters` API endpoint, resulting in a JSON array that contains [event filter definitions][1].

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/filters \
-H "Authorization: Bearer $TOKEN"

HTTP/1.1 200 OK
[
  {
    "metadata": {
      "name": "development_filter",
       "namespace": "default",
       "created_by": "admin"
    },
    "action": "deny",
    "expressions": [
      "event.entity.metadata.namespace == 'development'"
    ],
    "runtime_assets": null
  },
  {
    "metadata": {
      "name": "state_change_only",
      "namespace": "default"
    },
    "action": "allow",
    "expressions": [
      "event.check.occurrences == 1"
    ],
    "runtime_assets": null
  }
]
{{< /code >}}

### API Specification {#filters-get-specification}

/filters (GET)  | 
---------------|------
description    | Returns the list of event filters.
example url    | http://hostname:8080/api/core/v2/namespaces/default/filters
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response filtering | This endpoint supports [API response filtering][3].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code shell >}}
[
  {
    "metadata": {
      "name": "development_filter",
       "namespace": "default",
       "created_by": "admin"
    },
    "action": "deny",
    "expressions": [
      "event.entity.metadata.namespace == 'development'"
    ],
    "runtime_assets": null
  },
  {
    "metadata": {
      "name": "state_change_only",
      "namespace": "default"
    },
    "action": "allow",
    "expressions": [
      "event.check.occurrences == 1"
    ],
    "runtime_assets": null
  }
]
{{< /code >}}

## Create a new event filter

The `/filters` API endpoint provides HTTP POST access to create an event filter.

### Example {#filters-post-example}

In the following example, an HTTP POST request is submitted to the `/filters` API endpoint to create the event filter `development_filter`.
The request returns a successful HTTP `201 Created` response.

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "metadata": {
    "name": "development_filter",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "action": "deny",
  "expressions": [
    "event.entity.metadata.namespace == 'development'"
  ],
  "runtime_assets": []
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/filters

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#filters-post-specification}

/filters (POST) | 
----------------|------
description     | Creates a Sensu event filter.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/filters
payload         | {{< code shell >}}
{
  "metadata": {
    "name": "development_filter",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "action": "deny",
  "expressions": [
    "event.entity.metadata.namespace == 'development'"
  ],
  "runtime_assets": []
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific event filter {#filtersfilter-get}

The `/filters/:filter` API endpoint provides HTTP GET access to [event filter data][1] for specific `:filter` definitions, by filter name.

### Example {#filtersfilter-get-example}

In the following example, querying the `/filters/:filter` API endpoint returns a JSON map that contains the requested [`:filter` definition][1] (in this example, for the `:filter` named `state_change_only`).

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/filters/state_change_only \
-H "Authorization: Bearer $TOKEN"

HTTP/1.1 200 OK
{
  "metadata": {
    "name": "state_change_only",
    "namespace": "default",
    "created_by": "admin"
  },
  "action": "allow",
  "expressions": [
    "event.check.occurrences == 1"
  ],
  "runtime_assets": null
}
{{< /code >}}

### API Specification {#filtersfilter-get-specification}

/filters/:filter (GET) | 
---------------------|------
description          | Returns the specified event filter.
example url          | http://hostname:8080/api/core/v2/namespaces/default/filters/state_change_only
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code json >}}
{
  "metadata": {
    "name": "state_change_only",
    "namespace": "default",
    "created_by": "admin"
  },
  "action": "allow",
  "expressions": [
    "event.check.occurrences == 1"
  ],
  "runtime_assets": null
}
{{< /code >}}

## Create or update an event filter {#filtersfilter-put}

The `/filters/:filter` API endpoint provides HTTP PUT access to create or update an event filter.

### Example {#filters-put-example}

In the following example, an HTTP PUT request is submitted to the `/filters` API endpoint to create the event filter `development_filter`.
The request returns a successful HTTP `200 OK` response.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "metadata": {
    "name": "development_filter",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "action": "deny",
  "expressions": [
    "event.entity.metadata.namespace == 'development'"
  ],
  "runtime_assets": []
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/filters/development_filter

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#filtersfilter-put-specification}

/filters/:filter (PUT) | 
----------------|------
description     | Creates or updates the specified Sensu event filter.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/filters/development_filter
payload         | {{< code shell >}}
{
  "metadata": {
    "name": "development_filter",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "action": "deny",
  "expressions": [
    "event.entity.metadata.namespace == 'development'"
  ],
  "runtime_assets": []
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Update a filter with PATCH

The `/filters/:filter` API endpoint provides HTTP PATCH access to update `:filter` definitions, specified by filter name.

{{% notice note %}}
**NOTE**: You cannot change a resource's `name` or `namespace` with a PATCH request.
Use a [PUT request](#filtersfilter-put) instead.<br><br>
Also, you cannot add elements to an array with a PATCH request &mdash; you must replace the entire array.
{{% /notice %}}

### Example

In the following example, an HTTP PATCH request is submitted to the `/filters/:filter` API endpoint to update the expressions array for the `us-west` filter, resulting in an HTTP `200 OK` response and the updated filter definition.

We support [JSON merge patches][4], so you must set the `Content-Type` header to `application/merge-patch+json` for PATCH requests.

{{< code shell >}}
curl -X PATCH \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/merge-patch+json' \
-d '{
  "expressions": [
    "event.check.occurrences == 3"
  ]
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/filter/us-west

HTTP/1.1 200 OK
{{< /code >}}

### API Specification

/filters/:filter (PATCH) | 
----------------|------
description     | Updates the specified Sensu filter.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/filter/us-west
payload         | {{< code shell >}}
{
  "expressions": [
    "event.check.occurrences == 3"
  ]
}
{{< /code >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete an event filter {#filtersfilter-delete}

The `/filters/:filter` API endpoint provides HTTP DELETE access to delete an event filter from Sensu (specified by the filter name).

### Example {#filtersfilter-delete-example}

The following example shows a request to the `/filters/:filter` API endpoint to delete the event filter `development_filter`, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/core/v2/namespaces/default/filters/development_filter \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification {#filtersfilter-delete-specification}

/filters/:filter (DELETE) | 
--------------------------|------
description               | Removes the specified event filter from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/default/filters/development_filter
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../../observability-pipeline/observe-filter/filters/
[2]: ../#pagination
[3]: ../#response-filtering
[4]: https://tools.ietf.org/html/rfc7396
