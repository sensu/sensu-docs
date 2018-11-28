---
title: "Filters API"
description: "Sensu Go filters API reference documentation"
version: "5.0"
product: "Sensu Go"
menu:
  sensu-go-5.0:
    parent: api
---

## The `/filters` API endpoint

### `/filters` (GET)

The `/filters` API endpoint provides HTTP GET access to [filter][1] data.

#### EXAMPLE {#filters-get-example}

The following example demonstrates a request to the `/filters` API, resulting in
a JSON Array containing [filter definitions][1].

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/namespaces/default/filters -H "Authorization: Bearer TOKEN"
[
  {
    "metadata": {
      "name": "state_change_only",
      "namespace": "default",
      "labels": null,
      "annotations": null
    },
    "action": "allow",
    "expressions": [
      "event.check.occurrences == 1"
    ],
    "runtime_assets": []
  }
]
{{< /highlight >}}

#### API Specification {#filters-get-specification}

/filters (GET)  | 
---------------|------
description    | Returns the list of filters.
example url    | http://hostname:8080/api/core/v2/namespaces/default/filters
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "metadata": {
      "name": "state_change_only",
      "namespace": "default",
      "labels": null,
      "annotations": null
    },
    "action": "allow",
    "expressions": [
      "event.check.occurrences == 1"
    ],
    "runtime_assets": []
  },
  {
    "metadata": {
      "name": "development_filter",
      "namespace": "default",
      "labels": null,
      "annotations": null
    },
    "action": "deny",
    "expressions": [
      "event.entity.metadata.namespace == 'production'"
    ],
    "runtime_assets": []
  }
]
{{< /highlight >}}

## The `/filters/:filter` API endpoint {#the-filtersfilter-api-endpoint}

### `/filters/:filter` (GET) {#filtersfilter-get}

The `/filters/:filter` API endpoint provides HTTP GET access to [filter data][1] for specific `:filter` definitions, by filter `name`.

#### EXAMPLE {#filtersfilter-get-example}

In the following example, querying the `/filters/:filter` API returns a JSON Map
containing the requested [`:filter` definition][1] (in this example: for the `:filter` named
`state_change_only`).

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/api/core/v2/namespaces/default/filters/state_change_only -H "Authorization: Bearer TOKEN"
{
  "metadata": {
    "name": "state_change_only",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "action": "allow",
  "expressions": [
    "event.check.occurrences == 1"
  ],
  "runtime_assets": []
}
{{< /highlight >}}

#### API Specification {#filtersfilter-get-specification}

/filters/:filter (GET) | 
---------------------|------
description          | Returns a filter.
example url          | http://hostname:8080/api/core/v2/namespaces/default/filters/state_change_only
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "metadata": {
    "name": "state_change_only",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "action": "allow",
  "expressions": [
    "event.check.occurrences == 1"
  ],
  "runtime_assets": []
}
{{< /highlight >}}

[1]: ../../reference/filters
