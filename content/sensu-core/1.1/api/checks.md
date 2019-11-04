---
title: "Checks API"
description: "Sensu Checks API reference documentation."
product: "Sensu Core"
version: "1.1"
weight: 3
menu:
  sensu-core-1.1:
    parent: api
---

## Reference documentation

- [The `/checks` API endpoint](#the-checks-api-endpoint)
  - [`/checks` (GET)](#checks-get)
- [The `/checks/:check` API endpoint(s)](#the-checkscheck-api-endpoints)
  - [`/checks/:check` (GET)](#checkscheck-get)
- [The `/request` API endpoint](#the-request-api-endpoint)
  - [`/request` (POST)](#request-post)

## The `/checks` API endpoint

### `/checks` (GET)

The `/checks` API endpoint provides HTTP GET access to [subscription check][1]
data.

_**NOTE**: `GET /checks` responses do not include checks that are configured as [standalone checks][5]._

#### EXAMPLE {#checks-get-example}

The following example demonstrates a request to the `/checks` API, resulting in
a JSON Array of JSON Hashes containing subscription [check definitions][2].

{{< highlight shell >}}
$ curl -s http://127.0.0.1:4567/checks | jq .
[
  {
    "name": "sensu_website",
    "interval": 60,
    "subscribers": [
      "production"
    ],
    "command": "check-http.rb -u https://sensuapp.org"
  }
]
{{< /highlight >}}

#### API Specification {#checks-get-specification}

/checks (GET)  | 
---------------|------
description    | Returns the list of checks.
example url    | http://hostname:4567/checks
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}[
  {
    "name": "chef_client_process",
    "command": "check-procs.rb -p /usr/bin/chef-client -W 1 -w 2 -c 3",
    "subscribers": [
      "production"
    ],
    "interval": 60
  },
  {
     "name": "website",
    "command": "check-http.rb -h localhost -p /health -P 80 -q Passed -t 30",
    "subscribers": [
      "webserver"
    ],
    "interval": 30
  }
]
{{< /highlight >}}

## The `/checks/:check` API endpoint(s) {#the-checkscheck-api-endpoints}

### `/checks/:check` (GET) {#checkscheck-get}

The `/checks/:check` API endpoints provide HTTP GET access to
[subscription check data][1] for specific `:check` definitions, by check `name`.

#### EXAMPLE {#checkscheck-get-example}

In the following example, querying the `/checks/:check` API returns a JSON Hash
containing the requested [`:check` definition][2] (i.e. for the `:check` named
`sensu_website`).

{{< highlight shell >}}
$ curl -s http://127.0.0.1:4567/checks/sensu_website | jq .
{
  "name": "sensu_website",
  "interval": 60,
  "subscribers": [
    "production"
  ],
  "command": "check-http.rb -u https://sensuapp.org"
}
{{< /highlight >}}

The following example demonstrates a request for check data for a non-existent
`:check` named `non_existent_check`, which results in a [404 (Not Found) HTTP
response code][3] (i.e. `HTTP/1.1 404 Not Found`).

{{< highlight shell >}}
$ curl -s -i http://127.0.0.1:4567/checks/non_existent_check

HTTP/1.1 404 Not Found
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Content-Length: 0
Connection: keep-alive
Server: thin
{{< /highlight >}}

#### API Specification {#checkscheck-get-specification}

/checks/:check (GET) | 
---------------------|------
description          | Returns a check.
example url          | http://hostname:4567/checks/sensu_website
response type        | Hash
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}{
  "name": "chef_client_process",
  "command": "check-procs.rb -p /usr/bin/chef-client -W 1 -w 2 -c 3",
  "subscribers": [
    "production"
  ],
  "interval": 60
}
{{< /highlight >}}

## The `/request` API endpoint

### `/request` (POST)

The `/request` API provides HTTP POST access to publish [subscription check][1]
requests via the Sensu API.

#### EXAMPLE {#request-post-example}

In the following example, an HTTP POST is submitted to the `/request` API,
requesting a check execution for the `sensu_website` [subscription check][1],
resulting in a [202 (Accepted) HTTP response code][3] (i.e. `HTTP/1.1 202
Accepted`) and a JSON Hash containing an `issued` timestamp.

{{< highlight shell >}}
curl -s -i \
-X POST \
-H 'Content-Type: application/json' \
-d '{"check": "sensu_website"}' \
http://127.0.0.1:4567/request

HTTP/1.1 202 Accepted
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Content-Length: 21
Connection: keep-alive
Server: thin

{"issued":1460142533}
{{< /highlight >}}

_PRO TIP: the `/request` API can be a powerful utility when combined with check
definitions that are configured with `"publish": false` (i.e. checks which are
not intended to run on a scheduled interval). Using `"publish": false` along
with the `/request` API makes it possible to request predefined check executions
on an as-needed basis._

The following example demonstrates a request for a check execution for a
non-existent check named `non_existent_check`, which results in a [404 (Not
Found) HTTP response code][3] (i.e. `HTTP/1.1 404 Not Found`).

{{< highlight shell >}}
curl -s -i \
-X POST \
-H 'Content-Type: application/json' \
-d '{"check": "non_existent_check"}' \
http://127.0.0.1:4567/request

HTTP/1.1 404 Not Found
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Content-Length: 0
Connection: keep-alive
Server: thin
{{< /highlight >}}

#### API Specification {#request-post-specification}

/request (POST) | 
----------------|------
description     | Issues a check execution request.
example url     | http://hostname:4567/request
payload         | {{< highlight json >}}{
  "check": "chef_client_process",
  "subscribers": [
    "production"
  ],
  "creator": "sysop@example.com",
  "reason": "triggered application deployment"
}{{< /highlight >}}_NOTE: the `subscribers` attribute is not required for requesting a check execution, however it may be provided to override the `subscribers` [check definition attribute][2]._ _NOTE: the `creator` and `reason` attributes are not required for requesting a check execution, however they may be provided to add more context to the check request and in turn the check result(s). The check request `creator` and `reason` are added to the check request payload under `api_requested`._
response codes  | <ul><li>**Success**: 202 (Accepted)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[?]:  #
[1]:  ../../reference/checks#subscription-checks
[2]:  ../../reference/checks#check-configuration
[3]:  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
