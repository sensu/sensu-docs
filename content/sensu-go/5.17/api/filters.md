---
title: "Filters API"
description: "The Sensu filters API provides HTTP access to event filter data. This reference includes examples for returning lists of filters, creating Sensu filters, and more. Read on for the full reference."
version: "5.17"
product: "Sensu Go"
menu:
  sensu-go-5.17:
    parent: api
---

- [The `/filters` API endpoint](#the-filters-api-endpoint)
	- [`/filters` (GET)](#filters-get)
	- [`/filters` (POST)](#filters-post)
- [The `/filters/:filter` API endpoint](#the-filtersfilter-api-endpoint)
	- [`/filters/:filter` (GET)](#filtersfilter-get)
  - [`/filters/:filter` (PUT)](#filtersfilter-put)
  - [`/filters/:filter` (DELETE)](#filtersfilter-delete)

## The `/filters` API endpoint

### `/filters` (GET)

The `/filters` API endpoint provides HTTP GET access to [event filter][1] data.

#### EXAMPLE {#filters-get-example}

The following example demonstrates a request to the `/filters` API endpoint, resulting in a JSON array that contains [event filter definitions][1].

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/filters \
-H "Authorization: Bearer $TOKEN"

HTTP/1.1 200 OK
[
  {
    "metadata": {
      "name": "development_filter",
       "namespace": "default"
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
{{< /highlight >}}

#### API Specification {#filters-get-specification}

/filters (GET)  | 
---------------|------
description    | Returns the list of event filters.
example url    | http://hostname:8080/api/core/v2/namespaces/default/filters
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response filtering | This endpoint supports [API response filtering][3].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "metadata": {
      "name": "development_filter",
       "namespace": "default"
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
{{< /highlight >}}

### `/filters` (POST)

The `/filters` API endpoint provides HTTP POST access to create an event filter.

#### EXAMPLE {#filters-post-example}

In the following example, an HTTP POST request is submitted to the `/filters` API endpoint to create the event filter `development_filter`.
The request returns a successful HTTP `201 Created` response.

{{< highlight shell >}}
curl -X POST \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
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
{{< /highlight >}}

#### API Specification {#filters-post-specification}

/filters (POST) | 
----------------|------
description     | Creates a Sensu event filter.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/filters
payload         | {{< highlight shell >}}
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
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/filters/:filter` API endpoint {#the-filtersfilter-api-endpoint}

### `/filters/:filter` (GET) {#filtersfilter-get}

The `/filters/:filter` API endpoint provides HTTP GET access to [event filter data][1] for specific `:filter` definitions, by filter name.

#### EXAMPLE {#filtersfilter-get-example}

In the following example, querying the `/filters/:filter` API endpoint returns a JSON map that contains the requested [`:filter` definition][1] (in this example, for the `:filter` named `state_change_only`).

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/filters/state_change_only \
-H "Authorization: Bearer $TOKEN"

HTTP/1.1 200 OK
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
{{< /highlight >}}

#### API Specification {#filtersfilter-get-specification}

/filters/:filter (GET) | 
---------------------|------
description          | Returns the specified event filter.
example url          | http://hostname:8080/api/core/v2/namespaces/default/filters/state_change_only
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
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
{{< /highlight >}}

### `/filters/:filter` (PUT) {#filtersfilter-put}

The `/filters/:filter` API endpoint provides HTTP PUT access to create or update an event filter.

#### EXAMPLE {#filters-put-example}

In the following example, an HTTP PUT request is submitted to the `/filters` API endpoint to create the event filter `development_filter`.
The request returns a successful HTTP `200 OK` response.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
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
{{< /highlight >}}

#### API Specification {#filtersfilter-put-specification}

/filters/:filter (PUT) | 
----------------|------
description     | Creates or updates the specified Sensu event filter.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/filters/development_filter
payload         | {{< highlight shell >}}
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
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/filters/:filter` (DELETE) {#filtersfilter-delete}

The `/filters/:filter` API endpoint provides HTTP DELETE access to delete an event filter from Sensu (specified by the filter name).

#### EXAMPLE {#filtersfilter-delete-example}

The following example shows a request to the `/filters/:filter` API endpoint to delete the event filter `development_filter`, resulting in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/core/v2/namespaces/default/filters/development_filter \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#filtersfilter-delete-specification}

/filters/:filter (DELETE) | 
--------------------------|------
description               | Removes the specified event filter from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/default/filters/development_filter
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/filters/
[2]: ../overview#pagination
[3]: ../overview#response-filtering
