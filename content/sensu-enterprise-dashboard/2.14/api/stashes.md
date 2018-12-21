---
title: "Stashes API"
description: "Sensu Stashes API reference documentation."
product: "Sensu Enterprise Dashboard"
version: "2.14"
menu:
  sensu-enterprise-dashboard-2.14:
    parent: api
---

- [The `/stashes` API endpoints](#the-stashes-api-endpoints)
  - [`/stashes` (GET)](#stashes-get)
  - [`/stashes` (POST)](#stashes-post)
- [The `/stashes/:path` API endpoint](#the-stashespath-api-endpoint)
  - [`/stashes/:path` (DELETE)](#stashespath-delete)

## The `/stashes` API endpoints

The `/stashes` API endpoint provides HTTP GET and HTTP POST access to [Sensu
stash data][3] via the [Sensu key/value store][4].

### `/stashes` (GET)

#### EXAMPLES {#stashes-get-examples}

The following example demonstrates a `/stashes` query, which results in a JSON
Array of JSON Hashes containing [stash data][3].

{{< highlight shell >}}
$ curl -s http://127.0.0.1:3000/stashes | jq .
[
  {
    "_id": "us_west1/silence/i-424242/chef_client_process",
    "dc": "us_west1",
    "path": "silence/i-424242/chef_client_process",
    "content": {
      "timestamp": 1383441836
    },
    "expire": 3600
  },
  {
    "_id": "us_east1/application/storefront",
    "dc": "us_east1",
    "path": "application/storefront",
    "content": {
      "timestamp": 1381350802,
      "endpoints": [
        "https://hostname/store"
      ]
    },
    "expire": -1
  }
]
{{< /highlight >}}

#### API specification {#stashes-get-specification}  

/stashes (GET) | 
---------------|------
description    | Returns a list of stashes by `path` and datacenter (`dc`).
example url    | http://hostname:3000/stashes
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight json >}}[
  {
    "_id": "us_west1/silence/i-424242/chef_client_process",
    "dc": "us_west1",
    "path": "silence/i-424242/chef_client_process",
    "content": {
      "timestamp": 1383441836
    },
    "expire": 3600
  },
  {
    "_id": "us_east1/application/storefront",
    "dc": "us_east1",
    "path": "application/storefront",
    "content": {
      "timestamp": 1381350802,
      "endpoints": [
        "https://hostname/store"
      ]
    },
    "expire": -1
  }
]
{{< /highlight >}}

### `/stashes` (POST)

The `/stashes` API provides HTTP POST access to create [a Sensu stash][3].

#### EXAMPLES {#stashes-post-examples}

The following example demonstrates submitting an HTTP POST request containing a JSON
document payload to the `/stashes` API, resulting in a [200 (OK) HTTP
response code][5] and a payload containing a JSON Hash confirming the stash
`path`.

{{< highlight shell >}}
$ curl -s -i -X POST \
-H 'Content-Type: application/json' \
-d '{ "dc": "us_west1", "path": "example/stash/path", "content": { "foo": "bar" }}' \
http://127.0.0.1:3000/stashes

HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Content-Length: 29
Connection: keep-alive
Server: thin

{"path":"example/stash/path"}
{{< /highlight >}}

#### API specification {#stashes-post-specification}

/stashes (POST) | 
----------------|------
description     | Create a [Sensu stash][3].
example URL     | http://hostname:3000/stashes
payload         | {{< highlight json >}}{
  "dc": "us_west1",
  "path": "example/stash",
  "content": {
    "message": "example"
  },
  "expire": -1
}
{{< /highlight >}}
payload parameters | <ul><li>`dc`<ul><li>**required**: true</li><li>**type**: String</li><li>**description**: Specifies the name of the datacenter where the stash applies.</li><li>**example**: `"us_west1"`</li></ul><li>`path`<ul><li>**required**: true</li><li>**type**: String</li><li>**description**: The path (or “key”) the stash is created and accessible at.</li><li>**example**: `"example/stash"`</li></ul><li>`content`<ul><li>**required**: false</li><li>**type**: Hash</li><li>**description**: Arbitrary JSON data.</li><li>**example**: `{"message": "example"}`</li></ul><li>`expire`<ul><li>**required**: false</li><li>**type**: Integer</li><li>**description**: How long the stash exists before it is removed by the API, in seconds</li><li>**example**: `3600`</li></ul>
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/stashes/:path` API endpoint {#the-stashespath-api-endpoint}

The `/stashes/:path` API endpoint provides HTTP DELETE
access to [Sensu stash data][3] for a stash specified by its path.

### `/stashes/:path` (DELETE) {#stashespath-delete}

#### EXAMPLES {#stashespath-delete-examples}

The following example demonstrates submitting an HTTP DELETE request to the
`/stashes/:path` API to delete a stash with the path `my/example/path`, resulting in a
[202 (Accepted) HTTP response code][5].

{{< highlight shell >}}
$ curl -s -i -X DELETE http://127.0.0.1:3000/stashes/my/example/path                                                                                                                                                                                        
HTTP/1.1 202 Accepted
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Connection: close
Server: thin
{{< /highlight >}}

#### API specification {#stashespath-delete-specification}

/stashes/:path (DELETE) | 
------------------------|------
description             | Delete a [Sensu stash][3].
example URL             | http://hostname:3000/stashes/example/stash
response type           | [HTTP-header][10] only (no output)
response codes          | <ul><li>**Success**: 202 (Accepted)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output                  | {{< highlight shell >}}HTTP/1.1 202 Accepted
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Connection: close
Server: thin
{{< /highlight >}}

[1]:  https://en.wikipedia.org/wiki/Key-value_database
[2]:  /sensu-core/latest/reference/events
[3]:  /sensu-core/latest/reference/stashes#what-is-a-sensu-stash
[4]:  /sensu-core/latest/reference/stashes#the-sensu-keyvalue-store
[5]:  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
[6]:  #stashes-get
[7]:  /sensu-core/latest/reference/stashes#direct-access-to-stash-content-data
[8]:  /sensu-core/latest/reference/stashes#content-attributes
[9]:  /sensu-core/latest/reference/stashes#stash-definition-specification
[10]: https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
