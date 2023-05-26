---
title: "core/v2/filters"
description: "Read this API documentation for information about Sensu core/v2/filters API endpoints, with examples for retrieving and managing event filters."
core_api_title: "core/v2/filters"
type: "core_api"
version: "6.9"
product: "Sensu Go"
menu:
  sensu-go-6.9:
    parent: core
---

{{% notice note %}}
**NOTE**: Requests to `core/v2/filters` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-auth-api-endpoints).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all event filters

The `/filters` API endpoint provides HTTP GET access to [event filter][1] data.

### Example {#filters-get-example}

The following example demonstrates a GET request to the `/filters` API endpoint:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/filters \
-H "Authorization: Bearer $TOKEN"
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a JSON array that contains the [event filter definitions][1] in the `default` namespace:

{{< code text >}}
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
output         | {{< code text >}}
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
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

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

The following example queries the `/filters/:filter` API endpoint for the `:filter` named `state_change_only`:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/filters/state_change_only \
-H "Authorization: Bearer $TOKEN"
{{< /code >}}

The request will return a successful `HTTP/1.1 200 OK` response and a JSON map that contains the requested [`:filter` definition][1] (in this example, `state_change_only`):

{{< code text >}}
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
output               | {{< code text >}}
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

In the following example, an HTTP PUT request is submitted to the `/filters` API endpoint to create the event filter `development_filter`:

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
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

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

In the following example, an HTTP PATCH request is submitted to the `/filters/:filter` API endpoint to update the expressions array for the `us-west` filter, resulting in a `HTTP/1.1 200 OK` response and the updated event filter definition.

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

The following example shows a request to the `/filters/:filter` API endpoint to delete the event filter `development_filter`, which will result in a successful `HTTP/1.1 204 No Content` response:

{{< code shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/core/v2/namespaces/default/filters/development_filter \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

### API Specification {#filtersfilter-delete-specification}

/filters/:filter (DELETE) | 
--------------------------|------
description               | Removes the specified event filter from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/default/filters/development_filter
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a subset of filters with response filtering

The `/filters` API endpoint supports [response filtering][3] for a subset of filter data based on labels and the following fields:

- `filter.name`
- `filter.namespace`
- `filter.action`
- `filter.runtime_assets`

### Example

The following example demonstrates a request to the `/filters` API endpoint with [response filtering][3] for only [filter definitions][1] whose action is `allow`:

{{< code shell >}}
curl -H "Authorization: Key $SENSU_API_KEY" http://127.0.0.1:8080/api/core/v2/filters -G \
--data-urlencode 'fieldSelector=filter.action == allow'
{{< /code >}}

The example request will result in a successful `HTTP/1.1 200 OK` response and a JSON array that contains only [event filter definitions][1] whose action is `allow`:

{{< code text >}}
[
  {
    "metadata": {
      "name": "filter_interval_60_hourly",
      "namespace": "default",
      "created_by": "admin"
    },
    "action": "allow",
    "expressions": [
      "event.check.interval == 60",
      "event.check.occurrences == 1 || event.check.occurrences % 60 == 0"
    ],
    "runtime_assets": null
  },
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
]
{{< /code >}}

{{% notice note %}}
**NOTE**: Read [API response filtering](../../#response-filtering) for more filter statement examples that demonstrate how to filter responses using different operators with label and field selectors.
{{% /notice %}}

### API Specification

/filters (GET) with response filters | 
---------------|------
description    | Returns the list of filters that match the [response filters][3] applied in the API request.
example url    | http://hostname:8080/api/core/v2/filters
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "metadata": {
      "name": "filter_interval_60_hourly",
      "namespace": "default",
      "created_by": "admin"
    },
    "action": "allow",
    "expressions": [
      "event.check.interval == 60",
      "event.check.occurrences == 1 || event.check.occurrences % 60 == 0"
    ],
    "runtime_assets": null
  },
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
]
{{< /code >}}


[1]: ../../../observability-pipeline/observe-filter/filters/
[2]: ../../#pagination
[3]: ../../#response-filtering
[4]: https://tools.ietf.org/html/rfc7396
