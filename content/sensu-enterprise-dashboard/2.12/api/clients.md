---
title: "Clients API"
description: "Sensu Clients API reference documentation."
product: "Sensu Enterprise Dashboard"
version: "2.12"
menu:
  sensu-enterprise-dashboard-2.12:
    parent: api
---

- [The `/clients` API endpoint](#the-clients-api-endpoint)
  - [`/clients` (GET)](#clients-get)
- [The `/clients/:client` API endpoint(s)](#the-clientsclient-api-endpoints)
  - [`/clients/:client` (GET)](#clientsclient-get)
  - [`/clients/:client` (DELETE)](#clientsclient-delete)
- [The `/clients/:client/history` API endpoint(s)](#the-clientsclienthistory-api-endpoints)

## The `/clients` API Endpoint

The `/clients` API endpoint provides HTTP GET and POST access to the [Sensu
client registry][1].

### `/clients` (GET)

The `/clients` endpoint provides HTTP GET access to [client registry data][1] as
published via [client keepalives][2], generated for a [proxy client][3], or
created [via HTTP POST to the `/clients` API][4].

#### EXAMPLES {#clients-get-example}

The following example demonstrates a `/clients` API query which returns a JSON
Array of JSON Hashes containing client data (i.e. the [Sensu client
registry][1]).

{{< highlight shell >}}
$ curl -s http://127.0.0.1:3000/clients | jq .
[
  {
    "timestamp": 1458625739,
    "version": "1.0.0",
    "socket": {
      "port": 3030,
      "bind": "127.0.0.1"
    },
    "subscriptions": [
      "dev"
    ],
    "environment": "development",
    "address": "127.0.0.1",
    "name": "client-01"
  }
]
{{< /highlight >}}

_NOTE: for larger Sensu installations it may be undesirable to get the entire
[client registry][1] in a single API request. The `/clients` API provides
pagination controls via the [`limit` and `offset` url parameters][7] (see
below)._

#### API Specification {#clients-get-specification}

/clients (GET) | 
---------------|------
description    | Returns a list of clients.
example url    | http://hostname:3000/clients
parameters     | <ul><li>`limit`<ul><li>**required**: false</li><li>**type**: Integer</li><li>**description**: The number of clients to return.</li><li>**example**: `http://hostname:3000/clients?limit=100`</li></ul></li><li>`offset`<ul><li>**required**: false</li><li>**type**: Integer</li><li>**depends**: `limit`</li><li>**description**: The number of clients to offset before returning items.</li><li>**example**: `http://hostname:3000/clients?limit=100&offset=100`</li></ul></li></ul>
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}[
  {
    "name": "i-334455",
    "address": "192.168.0.2",
    "subscriptions": [
      "chef-client",
      "sensu-server"
    ],
    "timestamp": 1324674972
  },
  {
    "name": "i-424242",
    "address": "192.168.0.3",
    "subscriptions": [
      "chef-client",
      "webserver",
      "memcached"
    ],
    "timestamp": 1324674956
  }
]
{{< /highlight >}}

## The `/clients/:client` API Endpoint(s) {#the-clientsclient-api-endpoints}

The `/clients/:client` API endpoint provides read and delete access to specific
Sensu client data in the [Sensu client registry][1], by client `name`.

### `/clients/:client` (GET) {#clientsclient-get}

The `/clients/:client` endpoint provides HTTP GET access to specific client
definitions in the [client registry][1] as published via [client keepalives][2],
generated for a [proxy  client][3], or created [via POST to the `/clients`
API][4].

### EXAMPLE {#clients-client-get-example}

In the following example, querying the `/clients/:client` API returns a JSON
Hash containing the requested `:client` data (i.e. for the client named
`client-01`).

{{< highlight shell >}}
$ curl -s http://127.0.0.1:3000/clients/client-01 | jq .
{
  "timestamp": 1458625739,
  "version": "1.0.0",
  "socket": {
    "port": 3030,
    "bind": "127.0.0.1"
  },
  "subscriptions": [
    "dev"
  ],
  "environment": "development",
  "address": "127.0.0.1",
  "name": "client-01"
}
{{< /highlight >}}

The following example demonstrates a request for client data for a non-existent
`:client` named `non-existent-client`, which results in a [404 (Not Found) HTTP
response code][5] (i.e. `HTTP/1.1 404 Not Found`).

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
description            | Returns a client.
example url            | http://hostname:3000/clients/i-424242
response type          | Hash
response codes         | <ul><li>**Success**: 200 (OK)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output                 | {{< highlight shell >}}{
  "name": "i-424242",
  "address": "192.168.0.3",
  "subscriptions": [
    "chef-client",
    "webserver",
    "memcached"
  ],
  "timestamp": 1324674956
}
{{< /highlight >}}

### `/clients/:client` (DELETE) {#clientsclient-delete}

The `/clients/:client` endpoint provides HTTP DELETE access to specific client
definitions in the [client registry][1].

#### EXAMPLE {#clientsclient-delete-example}

The following example demonstrates a request to delete a `:client` named
`api-example`, resulting in a [202 (Accepted) HTTP response code][5] (i.e.
`HTTP/1.1 202 Accepted`) and a JSON Hash containing an `issued` timestamp.

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

{"issued":1460136855}
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
parameters                | <ul><li>`invalidate`<ul><li>**required**: false</li><li>**type**: Boolean</li><li>**description**: If the Sensu client should be invalidated, disallowing further client keepalives and check results until the client is successfully removed from the client registry.</li><li>**example**: `http://hostname:3000/clients/i-424242?invalidate=true`</li></ul><li>`invalidate_expire`<ul><li>**required**: false</li><li>**type**: Integer</li><li>**description**: If the Sensu client should be invalidated for a specified amount of time (in seconds), disallowing further client keepalives and check results even after the client is successfully removed from the client registry.</li><li>**example**: `http://hostname:3000/clients/i-424242?invalidate=true&invalidate_expire=3600`</li></ul></li></ul>
response codes            | <ul><li>**Success**: 202 (Accepted)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/clients/:client/history` API Endpoint(s) {#the-clientsclienthistory-api-endpoints}

The `/clients/:client/history` API is being deprecated in favor of the [Sensu
Results API][6]. This API predates the `/results` APIs and provides less
functionality than the newer alternative.

[1]:  ../../reference/clients#registration-and-registry
[2]:  ../../reference/clients#client-keepalives
[3]:  ../../reference/clients#proxy-clients
[4]:  #clients-post
[5]:  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
[6]:  ../results
[7]:  #clients-get-specification
