---
title: "Aggregates API"
description: "Sensu Aggregates API reference documentation."
product: "Sensu Core"
version: "0.29"
weight: 5
menu:
  sensu-core-0.29:
    parent: api
---

## Reference documentation

- [The `/aggregates` API endpoint](#the-aggregates-api-endpoint)
  - [`/aggregates` (GET)](#aggregates-get)
- [The `/aggregates/:name` API endpoints](#the-aggregatesname-api-endpoints)
  - [`/aggregates/:name` (GET)](#aggregatesname-get)
  - [`/aggregates/:name` (DELETE)](#aggregatesname-delete)
- [The `/aggregates/:name/clients` API endpoint](#the-aggregatesnameclients-api-endpoint)
  - [`/aggregates/:name/clients` (GET)](#aggregatesnameclients-get)
- [The `/aggregates/:name/checks` API endpoint](#the-aggregatesnamechecks-api-endpoint)
  - [`/aggregates/:name/checks` (GET)](#aggregatesnamechecks-get)
- [The `/aggregates/:name/results/:severity` API endpoint](#the-aggregatesnameresultsseverity-api-endpoint)
  - [`/aggregates/:name/results/:severity` (GET)](#aggregatesnameresultsseverity-get)


## The `/aggregates` API endpoint {#the-aggregates-api-endpoint}

The `/aggregates` API endpoint provides HTTP GET access to [named aggregate
data][1].

### `/aggregates` (GET)

#### EXAMPLES {#aggregates-get-examples}

The following example demonstrates a `/aggregates` API query which results in a
JSON Array of JSON Hashes containing named [check aggregates][1].

{{< highlight shell >}}
$ curl -s http://localhost:4567/aggregates | jq .
[
  {"name": "check_http"},
  {"name": "check_web_app"},
  {"name": "elasticsearch_health"}
]
{{< /highlight >}}

#### API specification {#aggregates-get-specification}

/aggregates (GET) | 
------------------|------
description       | Returns the list of named aggregates.
example url       | http://hostname:4567/aggregates
parameters        | <ul><li>`max_age`:<ul><li>**required**: false</li><li>**type**: Integer</li><li>**description**: the maximum age of results to include, in seconds.</li></ul></li></ul>
response type     | Array
response codes    | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output            | {{< highlight json >}}[
  {"name": "check_http"},
  {"name": "check_web_app"},
  {"name": "elasticsearch_health"}
]
{{< /highlight >}}

## The `/aggregates/:name` API endpoints {#the-aggregatesname-api-endpoints}

The `/aggregates/:name` API endpoints provide HTTP GET and HTTP DELETE access
to [check aggregate data][1] for a named aggregate.

### `/aggregates/:name` (GET) {#aggregatesname-get}

#### EXAMPLES {#aggregatesname-get-examples}

The following example demonstrates a `/aggregates/:name` API query for the
check result data for the aggregate named `example_aggregate`.

{{< highlight shell >}}
$ curl -s http://localhost:4567/aggregates/example_aggregate | jq .
{
  "clients": 15,
  "checks": 2,
  "results": {
    "ok": 18,
    "warning": 0,
    "critical": 1,
    "unknown": 0,
    "total": 19,
    "stale": 0
  }
}
{{< /highlight >}}

#### API specification {#aggregatesname-get-specification}

/aggregates/:name (GET) | 
------------------------|------
description             | Returns the list of aggregates for a given check.
example url             | http://hostname:4567/aggregates/elasticsearch
parameters              | <ul><li>`max_age`:<ul><li>**required**: false</li><li>**type**: Integer</li><li>**description**: the maximum age of results to include, in seconds.</li></ul></li></ul>
response type           | Array
response codes          | <ul><li>**Success**: 200 (OK)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output                  | {{< highlight json >}}{
  "clients": 15,
  "checks": 2,
  "results": {
    "ok": 18,
    "warning": 0,
    "critical": 1,
    "unknown": 0,
    "total": 19,
    "stale": 0
  }
}
{{< /highlight >}}

### `/aggregates/:name` (DELETE) {#aggregatesname-delete}

#### EXAMPLES {#aggregatesname-delete-examples}

The following example demonstrates a `/aggregates/:name` API request to delete
named aggregate data for the aggregate named `example_aggregate`, resulting in a
[204 (No Content) HTTP response code][2] (i.e. `HTTP/1.1 204 No Content`).

{{< highlight shell >}}
$ curl -s -i -X DELETE http://localhost:4567/aggregates/example_aggregate
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Connection: close
Server: thin
{{< /highlight >}}

#### API specification {#aggregatesname-delete-specification}

/aggregates/:name (DELETE) | 
---------------------------|------
description                | Deletes all aggregate data for a named aggregate.
example url                | http://hostname:4567/aggregates/elasticsearch
response type              | [HTTP-header][3] only (no output)
response codes             | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output                     | {{< highlight shell >}}HTTP/1.1 204 No Content
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Connection: close
Server: thin
{{< /highlight >}}

## The `/aggregates/:name/clients` API endpoint {#the-aggregatesnameclients-api-endpoint}

The `/aggregates/:name/clients` API endpoint provides HTTP GET access to the
Sensu client members of a [named aggregate][1].

### `/aggregates/:name/clients` (GET) {#aggregatesnameclients-get}

#### EXAMPLES {#aggregatesnameclients-get-examples}

The following example demonstrates a `/aggregates/:name/clients` API query for
the client members of an aggregate named `elasticsearch`.

{{< highlight shell >}}
$ curl -s http://localhost:4567/aggregates/elasticsearch/clients | jq .
[
  {
    "name": "i-424242",
    "checks": [
      "elasticsearch_service",
      "elasticsearch_cluster_health"
    ]
  },
  {
    "name": "1-424243",
    "checks": [
      "elasticsearch_service"
    ]
  },
]
{{< /highlight >}}

#### API specification {#aggregatesnameclients-get-specification}

/aggregates/:name/clients (GET) | 
--------------------------------|------
description                     | Returns the client members of a named aggregate.
example URL                     | http://hostname:4567/aggregates/elasticsearch/clients
response type                   | Array
response codes                  | <ul><li>**Success**: 200 (OK)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output                          | {{< highlight json >}}[
  {
    "name": "i-424242",
    "checks": [
      "elasticsearch_service",
      "elasticsearch_cluster_health"
    ]
  },
  {
    "name": "1-424243",
    "checks": [
      "elasticsearch_service"
    ]
  },
]
{{< /highlight >}}

## The `/aggregates/:name/checks` API endpoint {#the-aggregatesnamechecks-api-endpoint}

The `/aggregates/:name/checks` API endpoint provides HTTP GET access to the
Sensu check members of a [named aggregate][1].

### `/aggregates/:name/checks` (GET) {#aggregatesnamechecks-get}

#### EXAMPLES {#aggregatesnamechecks-get-examples}

The following example demonstrates a `/aggregates/:name/checks` API query for
the check members of an aggregate named `elasticsearch`.

{{< highlight shell >}}
$ curl -s http://localhost:4567/aggregates/elasticsearch/checks | jq .
[
  {
    "name": "elasticsearch_service",
    "clients": [
      "i-424242",
      "i-424243"
    ]
  },
  {
    "name": "elasticsearch_cluster_health",
    "clients": [
      "i-424242"
    ]
  }
]
{{< /highlight >}}

#### API specification {#aggregatesnamechecks-get-specification}

/aggregates/:name/checks (GET) | 
-------------------------------|------
description                    | Returns the check members of a named aggregate.
example URL                    | http://hostname:4567/aggregates/elasticsearch/checks
response type                  | Array
response codes                 | <ul><li>**Success**: 200 (OK)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output                         | {{< highlight json >}}[
  {
    "name": "elasticsearch_service",
    "clients": [
      "i-424242",
      "i-424243"
    ]
  },
  {
    "name": "elasticsearch_cluster_health",
    "clients": [
      "i-424242"
    ]
  }
]
{{< /highlight >}}

## The `/aggregates/:name/results/:severity` API endpoint {#the-aggregatesnameresultsseverity-api-endpoint}

The `/aggregates/:name/results/:severity` API endpoint provides HTTP GET access
to check result members of a [named aggregate][1], by severity.

### `/aggregates/:name/results/:severity` (GET) {#aggregatesnameresultsseverity-get}

#### EXAMPLES {#aggregatesnameresultsseverity-get-examples}

The following example demonstrates a `/aggregates/:name/results/:severity` API
query for the `critical` check results of an aggregate named `elasticsearch`.

{{< highlight shell >}}
$ curl -s http://localhost:4567/aggregates/elasticsearch/results/critical | jq .
[
  {
    "check": "elasticsearch_cluster_health",
    "summary": [
      {
        "output": "Everything is Broken!",
        "total": 1,
        "clients": ["i-424242"]
      }
    ]
  }
]
{{< /highlight >}}

#### API specification {#aggregatesnameresultsseverity-get-specification}

/aggregates/:name/results/:severity (GET) | 
------------------------------------------|------
description                               | Returns the check result members of a named aggregate, by serverity.
example URL                               | http://hostname:4567/aggregates/elasticsearch/results/critical
response type                             | Array
parameters                                | <ul><li>`max_age`:<ul><li>**required**: false</li><li>**type**: Integer</li><li>**description**: the maximum age of results to include, in seconds.</li></ul></li></ul>
allowed values                            | `warning`, `critical`, `unknown`
response codes                            | <ul><li>**Success**: 200 (OK)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output                                    | {{< highlight json >}}[
  {
    "check": "elasticsearch_cluster_health",
    "summary": [
      {
        "output": "Everything is Broken!",
        "total": 1,
        "clients": ["i-424242"]
      }
    ]
  }
]
{{< /highlight >}}

[1]:  ../../reference/aggregates
[2]:  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
[3]:  https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
