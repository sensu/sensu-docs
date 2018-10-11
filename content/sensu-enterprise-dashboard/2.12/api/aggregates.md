---
title: "Aggregates API"
description: "Sensu Aggregates API reference documentation."
product: "Sensu Enterprise Dashboard"
version: "2.12"
menu:
  sensu-enterprise-dashboard-2.12:
    parent: api
---

- [The `/aggregates` API endpoint](#the-aggregates-api-endpoint)
  - [`/aggregates` (GET)](#aggregates-get)
- [The `/aggregates/:name` API endpoints](#the-aggregatesname-api-endpoints)
  - [`/aggregates/:name` (GET)](#aggregatesname-get)
  - [`/aggregates/:name` (DELETE)](#aggregatesname-delete)

## The `/aggregates` API endpoint {#the-aggregates-api-endpoint}

The `/aggregates` API endpoint provides HTTP GET access to [named aggregate
data][1].

### `/aggregates` (GET)

#### EXAMPLES {#aggregates-get-examples}

The following example demonstrates a `/aggregates` API query which results in a
JSON Array of JSON Hashes containing named [check aggregates][1].

{{< highlight shell >}}
$ curl -s http://127.0.0.1:3000/aggregates | jq .
[
  {
    "_id": "us_east1/check_web_app",
    "dc": "us_east1",
    "name": "check_web_app"
  },
  {
    "_id": "us_west1/elasticsearch_health",
    "dc": "us_west1",
    "name": "elasticsearch_health"
  }
]
{{< /highlight >}}

#### API specification {#aggregates-get-specification}

/aggregates (GET) | 
------------------|------
description       | Returns the list of named aggregates by `name` and datacenter (`dc`)
example url       | http://hostname:3000/aggregates
parameters        | <ul><li>`max_age`:<ul><li>**required**: false</li><li>**type**: Integer</li><li>**description**: the maximum age of results to include, in seconds.</li></ul></li></ul>
response type     | Array
response codes    | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output            | {{< highlight json >}}[
  {
    "_id": "us_east1/check_web_app",
    "dc": "us_east1",
    "name": "check_web_app"
  },
  {
    "_id": "us_west1/elasticsearch_health",
    "dc": "us_west1",
    "name": "elasticsearch_health"
  }
]{{< /highlight >}}

## The `/aggregates/:name` API endpoints {#the-aggregatesname-api-endpoints}

The `/aggregates/:name` API endpoints provide HTTP GET and HTTP DELETE access
to [check aggregate data][1] for a named aggregate.

### `/aggregates/:name` (GET) {#aggregatesname-get}

#### EXAMPLES {#aggregatesname-get-examples}

The following example demonstrates a `/aggregates/:name` API query for the
check result data for the aggregate named `example_aggregate`.

{{< highlight shell >}}
$ curl -s http://127.0.0.1:3000/aggregates/example_aggregate | jq .
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
example url             | http://hostname:3000/aggregates/elasticsearch
parameters              | <ul><li>`max_age`:<ul><li>**required**: false</li><li>**type**: Integer</li><li>**description**: the maximum age of results to include, in seconds.</li></ul></li></ul><ul><li>`dc`:<ul><li>**required**: false</li><li>**type**: String</li><li>**description**: If the aggregate name is present in multiple datacenters, specifying the `dc` parameter will return only the aggregate found in that datacenter.</li><li>**example**: `http://hostname:3000/aggregates/elasticsearch?dc=us_west1`</li></ul></li></ul>
response type           | Array
response codes          | <ul><li>**Success**: 200 (OK)</li><li>**Found in multiple datacenters**: 300 (Multiple Choices)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
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
named aggregate data for the aggregate named `example_aggregate`.

{{< highlight shell >}}
$ curl -s -i -X DELETE http://localhost:3000/aggregates/example_aggregate
HTTP/1.1 202 Accepted
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
example url                | http://hostname:3000/aggregates/elasticsearch
response type              | [HTTP-header][3] only (no output)
response codes             | <ul><li>**Success**: 202 (Accepted)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output                     | {{< highlight shell >}}HTTP/1.1 202 Accepted
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Connection: close
Server: thin
{{< /highlight >}}

[1]:  /sensu-core/latest/reference/aggregates
[3]:  https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
