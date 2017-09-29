---
title: "Aggregates API"
description: "Sensu Aggregates API reference documentation."
product: "Sensu Core"
version: "1.0"
weight: 5
menu: "sensu-core-1.0"
---
# Sensu Aggregates API

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


## The `/aggregates` API endpoint

The `/aggregates` API endpoint provides HTTP GET access to [named aggregate
data][1].

### `/aggregates` (GET)

#### EXAMPLES {#aggregates-get-examples}

The following example demonstrates a `/aggregates` API query which results in a
JSON Array of JSON Hashes containing named [check aggregates][1].

~~~ shell
$ curl -s http://localhost:4567/aggregates | jq .
[
  {"name": "check_http"},
  {"name": "check_web_app"},
  {"name": "elasticsearch_health"}
]
~~~

#### API specification {#aggregates-get-specification}

/aggregates (GET) | 
------------------|------
description       | Returns the list of named aggregates.
example url       | http://hostname:4567/aggregates
parameters        | - `max_age`:<br>&emsp;- **required**: false<br>&emsp;- **type**: Integer<br>&emsp;- **description**: the maximum age of results to include, in seconds.
response type     | Array
response codes    | - **Success**: 200 (OK)<br>- **Error**: 500 (Internal Server Error)
output            | `[`<br>&emsp;`{"name": "check_http"},`<br>&emsp;`{"name": "check_web_app"},`<br>&emsp;`{"name": "elasticsearch_health"}`<br>`]`

## The `/aggregates/:name` API endpoints

The `/aggregates/:name` API endpoints provide HTTP GET and HTTP DELETE access
to [check aggregate data][1] for a named aggregate.

### `/aggregates/:name` (GET)

#### EXAMPLES {#aggregatesname-get-examples}

The following example demonstrates a `/aggregates/:name` API query for the
check result data for the aggregate named `example_aggregate`.

~~~ shell
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
~~~

#### API specification {#aggregatesname-get-specification}

/aggregates/:name (GET) | 
------------------------|------
description             | Returns the list of aggregates for a given check.
example url             | http://hostname:4567/aggregates/elasticsearch
parameters              | - `max_age`:<br>&emsp;- **required**: false<br>&emsp;- **type**: Integer<br>&emsp;- **description**: the maximum age of results to include, in seconds.
response type           | Array
response codes          | - **Success**: 200 (OK)<br>- **Missing**: 404 (Not Found)<br>- **Error**: 500 (Internal Server Error)
output                  | `{`<br>&emsp;`"clients": 15,`<br>&emsp;`"checks": 2,`<br>&emsp;`"results": {`<br>&emsp;&emsp;`"ok": 18,`<br>&emsp;&emsp;`"warning": 0,`<br>&emsp;&emsp;`"critical": 1,`<br>&emsp;&emsp;`"unknown": 0,`<br>&emsp;&emsp;`"total": 19,`<br>&emsp;&emsp;`"stale": 0`<br>&emsp;`}`<br>`}`

### `/aggregates/:name` (DELETE)

#### EXAMPLES {#aggregatesname-delete-examples}

The following example demonstrates a `/aggregates/:name` API request to delete
named aggregate data for the aggregate named `example_aggregate`, resulting in a
[204 (No Content) HTTP response code][2] (i.e. `HTTP/1.1 204 No Content`).

~~~ shell
$ curl -s -i -X DELETE http://localhost:4567/aggregates/example_aggregate
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Connection: close
Server: thin
~~~

#### API specification {#aggregatesname-delete-specification}

/aggregates/:name (DELETE) | 
---------------------------|------
description                | Deletes all aggregate data for a named aggregate.
example url                | http://hostname:4567/aggregates/elasticsearch
response type              | [HTTP-header][3] only (no output)
response codes             | - **Success**: 204 (No Content)<br>- **Missing**: 404 (Not Found)<br>- **Error**: 500 (Internal Server Error)
output                     | HTTP/1.1 204 No Content<br>Access-Control-Allow-Origin: *<br>Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS<br>Access-Control-Allow-Credentials: true<br>Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization<br>Connection: close<br>Server: thin

## The `/aggregates/:name/clients` API endpoint

The `/aggregates/:name/clients` API endpoint provides HTTP GET access to the
Sensu client members of a [named aggregate][1].

### `/aggregates/:name/clients` (GET)

#### EXAMPLES {#aggregatesnameclients-get-examples}

The following example demonstrates a `/aggregates/:name/clients` API query for
the client members of an aggregate named `elasticsearch`.

~~~ shell
$ curl -s http://localhost:4567/aggregates/elasticsearch/clients | jq .
[
  {
    "name": "1-424242",
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
~~~

#### API specification {#aggregatesnameclients-get-specification}

/aggregates/:name/clients (GET) | 
--------------------------------|------
description                     | Returns the client members of a named aggregate.
example URL                     | http://hostname:4567/aggregates/elasticsearch/clients
response type                   | Array
response codes                  | - **Success**: 200 (OK)<br>- **Missing**: 404 (Not Found)<br>- **Error**: 500 (Internal Server Error)
output                          | `[`<br>&emsp;`{`<br>&emsp;&emsp;`"name": "1-424242",`<br>&emsp;&emsp;`"checks": [`<br>&emsp;&emsp;&emsp;`"elasticsearch_service",`<br>&emsp;&emsp;&emsp;`"elasticsearch_cluster_health"`<br>&emsp;&emsp;`]`<br>&emsp;`},`<br>&emsp;`{`<br>&emsp;&emsp;`"name": "1-424243",`<br>&emsp;&emsp;`"checks": [`<br>&emsp;&emsp;&emsp;`"elasticsearch_service"`<br>&emsp;&emsp;`]`<br>&emsp;`},`<br>`]`

## The `/aggregates/:name/checks` API endpoint

The `/aggregates/:name/checks` API endpoint provides HTTP GET access to the
Sensu check members of a [named aggregate][1].

### `/aggregates/:name/checks` (GET)

#### EXAMPLES {#aggregatesnamechecks-get-examples}

The following example demonstrates a `/aggregates/:name/checks` API query for
the check members of an aggregate named `elasticsearch`.

~~~ shell
$ curl -s http://localhost:4567/aggregates/elasticsearch/checks | jq .
[
  {
    "name": "elasticsearch_service",
    "clients": [
      "1-424242",
      "i-424243"
    ]
  },
  {
    "name": "elasticsearch_cluster_health",
    "clients": [
      "1-424242"
    ]
  }
]
~~~

#### API specification {#aggregatesnamechecks-get-specification}

/aggregates/:name/checks (GET) | 
-------------------------------|------
description                    | Returns the check members of a named aggregate.
example URL                    | http://hostname:4567/aggregates/elasticsearch/checks
response type                  | Array
response codes                 | - **Success**: 200 (OK)<br>- **Missing**: 404 (Not Found)<br>- **Error**: 500 (Internal Server Error)
output                         | `[`<br>&emsp;`{`<br>&emsp;&emsp;`"name": "elasticsearch_service",`<br>&emsp;&emsp;`"clients": [`<br>&emsp;&emsp;&emsp;`"1-424242",`<br>&emsp;&emsp;&emsp;`"i-424243"`<br>&emsp;&emsp;`]`<br>&emsp;`},`<br>&emsp;`{`<br>&emsp;&emsp;`"name": "elasticsearch_cluster_health",`<br>&emsp;&emsp;`"clients": [`<br>&emsp;&emsp;&emsp;`"1-424242"`<br>&emsp;&emsp;`]`<br>&emsp;`}`<br>`]`

## The `/aggregates/:name/results/:severity` API endpoint

The `/aggregates/:name/results/:severity` API endpoint provides HTTP GET access
to check result members of a [named aggregate][1], by severity.

### `/aggregates/:name/results/:severity` (GET)

#### EXAMPLES {#aggregatesnameresultsseverity-get-examples}

The following example demonstrates a `/aggregates/:name/results/:severity` API
query for the `critical` check results of an aggregate named `elasticsearch`.

~~~ shell
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
~~~

#### API specification {#aggregatesnameresultsseverity-get-specification}

/aggregates/:name/results/:severity (GET) | 
------------------------------------------|------
description                               | Returns the check result members of a named aggregate, by serverity.
example URL                               | http://hostname:4567/aggregates/elasticsearch/results/critical
response type                             | Array
parameters                                | - `max_age`:<br>&emsp;- **required**: false<br>&emsp;- **type**: Integer<br>&emsp;- **description**: the maximum age of results to include, in seconds.
allowed values                            | `warning`, `critical`, `unknown`
response codes                            | - **Success**: 200 (OK)<br>- **Missing**: 404 (Not Found)<br>- **Error**: 500 (Internal Server Error)
output                                    | `[`<br>&emsp;`{`<br>&emsp;&emsp;`"check": "elasticsearch_cluster_health",`<br>&emsp;&emsp;`"summary": [`<br>&emsp;&emsp;&emsp;`{`<br>&emsp;&emsp;&emsp;&emsp;`"output": "Everything is Broken!",`<br>&emsp;&emsp;&emsp;&emsp;`"total": 1,`<br>&emsp;&emsp;&emsp;&emsp;`"clients": ["i-424242"]`<br>&emsp;&emsp;&emsp;`}`<br>&emsp;&emsp;`]`<br>&emsp;`}`<br>`]`

[1]:  ../reference/aggregates.html
[2]:  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
[3]:  https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
