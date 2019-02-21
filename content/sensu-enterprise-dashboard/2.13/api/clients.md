---
title: "Clients API"
description: "Sensu Clients API reference documentation."
product: "Sensu Enterprise Dashboard"
version: "2.13"
menu:
  sensu-enterprise-dashboard-2.13:
    parent: api
---

- [The `/clients` API endpoint](#the-clients-api-endpoint)
  - [`/clients` (GET)](#clients-get)
- [The `/clients/:client` API endpoints](#the-clientsclient-api-endpoints)
  - [`/clients/:client` (GET)](#clientsclient-get)
  - [`/clients/:client` (DELETE)](#clientsclient-delete)
- [The `/clients/:client/history` API endpoint](#the-clientsclienthistory-api-endpoint)

## The `/clients` API Endpoint

The `/clients` API endpoint provides HTTP GET and POST access to the [Sensu
client registry][1].

### `/clients` (GET)

The `/clients` endpoint provides HTTP GET access to [client registry data][1] as
published via [client keepalives][2], generated for a [proxy client][3], or
created [via HTTP POST to the `/clients` API][4].

#### EXAMPLES {#clients-get-example}

The following example demonstrates a `/clients` API query which returns a JSON
Array of JSON Hashes containing client data.

{{< highlight shell >}}
$ curl -s http://127.0.0.1:3000/clients | jq .
[
  {
    "_id": "us_west1/i-424242",
    "address": "127.0.0.1",
    "dc": "us_west1",
    "name": "i-424242",
    "silenced": false,
    "status": 0,
    "subscriptions": [
      "dev"
    ],
    "socket": {
      "port": 3030,
      "bind": "127.0.0.1"
    },
    "environment": "development",
    "timestamp": 1458625739,
    "version": "1.5.0"
  }
]
{{< /highlight >}}

#### API Specification {#clients-get-specification}

/clients (GET) | 
---------------|------
description    | Returns a list of clients by `name` and datacenter (`dc`). Since clients use the Sensu Core package, the `version` returned by this endpoint reflects the current version of Sensu Core instead of Sensu Enterprise.
example url    | http://hostname:3000/clients
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}[
  {
    "_id": "us_west1/i-334455",
    "dc": "us_west1",
    "name": "i-334455",
    "address": "192.168.0.2",
    "subscriptions": [
      "chef-client",
      "sensu-server"
    ],
    "silenced": false,
    "status": 0,
    "timestamp": 1324674972,
    "version": "1.5.0"
  },
  {
    "_id": "us_east1/i-424242",
    "dc": "us_east1",
    "name": "i-424242",
    "address": "192.168.0.3",
    "subscriptions": [
      "chef-client",
      "webserver",
      "memcached"
    ],
    "silenced": false,
    "status": 0,
    "timestamp": 1324674956,
    "version": "1.5.0"
  }
]
{{< /highlight >}}

## The `/clients/:client` API Endpoints {#the-clientsclient-api-endpoints}

The `/clients/:client` API endpoint provides read and delete access to specific
Sensu client data in the [Sensu client registry][1], by client `name`.

### `/clients/:client` (GET) {#clientsclient-get}

The `/clients/:client` endpoint provides HTTP GET access to specific client
definitions in the [client registry][1] as published via [client keepalives][2],
generated for a [proxy  client][3], or created [via POST to the `/clients`
API][4].

### EXAMPLE {#clients-client-get-example}

In the following example, querying the `/clients/:client` API returns a JSON
Hash containing the requested client data for the client named
`i-424242`.

{{< highlight shell >}}
$ curl -s http://127.0.0.1:3000/clients/i-424242 | jq .
{
  "_id": "us_west1/i-424242",
  "address": "127.0.0.1",
  "dc": "us_west1",
  "name": "i-424242",
  "environment": "development",
  "silenced": false,
  "subscriptions": [
    "dev"
  ],
  "socket": {
    "port": 3030,
    "bind": "127.0.0.1"
  },
  "timestamp": 1458625739,
  "version": "1.5.0"
}
{{< /highlight >}}

The following example demonstrates a request for client data for a non-existent
client named `non-existent-client`, which results in a [404 (Not Found) HTTP
response code][5].

{{< highlight shell >}}
$ curl -s -i http://127.0.0.1:3000/clients/non-existent-client
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

### API Specification {#clientsclient-get-specification}

/clients/:client (GET) | 
-----------------------|------
description            | Returns a client with the `name` and datacenter (`dc`)
example url            | http://hostname:3000/clients/i-424242
parameters             | <ul><li>`dc`:<ul><li>**required**: false</li><li>**type**: String</li><li>**description**: If the client name is present in multiple datacenters, specifying the `dc` parameter returns only the client found in that datacenter.</li><li>**example**: `http://hostname:3000/clients/i-424242?dc=us_west1`</li></ul></li></ul>
response type          | Hash
response codes         | <ul><li>**Success**: 200 (OK)</li><li>**Found in multiple datacenters**: 300 (Multiple Choices)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output                 | {{< highlight shell >}}{
  "_id": "us_east1/i-424242",
  "address": "192.168.0.3",
  "dc": "us_east1",
  "name": "i-424242",
  "silenced": false,
  "subscriptions": [
    "chef-client",
    "webserver",
    "memcached"
  ],
  "timestamp": 1324674956,
  "version": "1.5.0"
}
{{< /highlight >}}

### `/clients/:client` (DELETE) {#clientsclient-delete}

The `/clients/:client` endpoint provides HTTP DELETE access to specific client
definitions in the [client registry][1].

#### EXAMPLE {#clientsclient-delete-example}

The following example demonstrates a request to delete a client named
`api-example`, resulting in a [202 (Accepted) HTTP response code][5].

{{< highlight shell >}}
$ curl -s -i -X DELETE http://127.0.0.1:3000/clients/api-example

HTTP/1.1 202 Accepted
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Content-Length: 21
Connection: keep-alive
Server: thin
{{< /highlight >}}

The following example demonstrates a request to delete a non-existent `:client`
named `non-existent-client`, resulting in a [404 (Not Found) HTTP response
code][5] (i.e. `HTTP/1.1 404 Not Found`).

{{< highlight shell >}}
$ curl -s -i -X DELETE http://127.0.0.1:3000/clients/non-existent-client

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

#### API Specification {#clientsclient-delete-specification}

/clients/:client (DELETE) | 
--------------------------|------
description               | Removes a client, resolving its current events. (delayed action)
example url               | http://hostname:3000/clients/i-424242
parameters                | <ul><li>`dc`:<ul><li>**required**: false</li><li>**type**: String</li><li>**description**: If the client name is present in multiple datacenters, specifying the `dc` parameter accesses only the client found in that datacenter.</li><li>**example**: `http://hostname:3000/clients/i-424242?dc=us_west1`</li></ul></li></ul>
response codes            | <ul><li>**Success**: 202 (Accepted)</li><li>**Found in multiple datacenters**: 300 (Multiple Choices)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/clients/:client/history` API Endpoint {#the-clientsclienthistory-api-endpoint}

The `/clients/:client/history` API endpoint provides HTTP GET access to check result data
for a specified client.

### `/clients/:client/history` (GET) {#clientsclienthistory-get}

#### EXAMPLE {#clientsclienthistory-get-example}

In the following example, querying the `/clients/:client/history` API returns a JSON
Array of JSON Hashes containing check result data for a client named `i-424242`.

{{< highlight shell >}}
$ curl -s http://127.0.0.1:3000/clients/i-424242/history | jq .
[
  {
    "check": "check_disk_usage",
    "client": "i-424242",
    "dc": "us_east1",
    "history": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "last_execution": 1539364800,
    "last_result": {
      "command": "/opt/sensu/embedded/bin/metrics-disk-usage.rb",
      "duration": 0.059,
      "executed": 1539364800,
      "handlers": ["influxdb"],
      "interval": 10,
      "issued": 1539364800,
      "name": "check_disk_usage",
      "output": "sensu.disk_usage.root.used 2328 1539364800\n...",
      "status": 0,
      "subscribers": ["cpu-metrics"],
      "type": "metric"
    },
    "last_status": 0,
    "silenced": false,
    "silenced_by": null
  },
  {
    "check": "check_curl_timings",
    "client": "i-424242",
    "dc": "us_east1",
    "history": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "last_execution": 1539364794,
    "last_result": {
      "command": "/opt/sensu/embedded/bin/metrics-curl.rb localhost",
      "duration": 0.069,
      "executed": 1539364794,
      "handlers": ["influxdb"],
      "interval": 10,
      "issued": 1539364794,
      "name": "check_curl_timings",
      "output": "sensu.curl_timings.time_total 0.000 1539364794\n...",
      "status": 0,
      "subscribers": ["http-metrics"],
      "type": "metric"
    },
    "last_status": 0,
    "silenced": false,
    "silenced_by": null
  }
]
{{< /highlight >}}

### API Specification {#clientsclienthistory-get-specification}

/clients/:client/history (GET) | 
-------------------------------|------
description            | Returns an array of check results by check `name` and datacenter (`dc`)
example url            | http://hostname:3000/clients/i-424242/history
parameters             | <ul><li>`dc`:<ul><li>**required**: false</li><li>**type**: String</li><li>**description**: If the client name is present in multiple datacenters, specifying the `dc` parameter returns only check results for the client found in that datacenter.</li><li>**example**: `http://hostname:3000/clients/i-424242/history?dc=us_east1`</li></ul></li></ul>
response type          | Array
response codes         | <ul><li>**Success**: 200 (OK)</li><li>**Found in multiple datacenters**: 300 (Multiple Choices)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output                 | {{< highlight shell >}}[
  {
    "check": "check_disk_usage",
    "client": "i-424242",
    "dc": "us_east1",
    "history": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "last_execution": 1539364800,
    "last_result": {
      "command": "/opt/sensu/embedded/bin/metrics-disk-usage.rb",
      "duration": 0.059,
      "executed": 1539364800,
      "handlers": ["influxdb"],
      "interval": 10,
      "issued": 1539364800,
      "name": "check_disk_usage",
      "output": "sensu.disk_usage.root.used 2328 1539364800\n...",
      "status": 0,
      "subscribers": ["cpu-metrics"],
      "type": "metric"
    },
    "last_status": 0,
    "silenced": false,
    "silenced_by": null
  },
  {
    "check": "check_curl_timings",
    "client": "i-424242",
    "dc": "us_east1",
    "history": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "last_execution": 1539364794,
    "last_result": {
      "command": "/opt/sensu/embedded/bin/metrics-curl.rb localhost",
      "duration": 0.069,
      "executed": 1539364794,
      "handlers": ["influxdb"],
      "interval": 10,
      "issued": 1539364794,
      "name": "check_curl_timings",
      "output": "sensu.curl_timings.time_total 0.000 1539364794\n...",
      "status": 0,
      "subscribers": ["http-metrics"],
      "type": "metric"
    },
    "last_status": 0,
    "silenced": false,
    "silenced_by": null
  }
]
{{< /highlight >}}

[1]:  /sensu-core/latest/reference/clients#registration-and-registry
[2]:  /sensu-core/latest/reference/clients#client-keepalives
[3]:  /sensu-core/latest/reference/clients#proxy-clients
[4]:  /sensu-core/latest/api/clients#clients-post
[5]:  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
[6]:  ../results
[7]:  #clients-get-specification
