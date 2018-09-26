---
title: "Events API"
description: "Sensu Events API reference documentation."
product: "Sensu Enterprise"
version: "2.12"
weight: 6
menu:
  sensu-enterprise-2.12:
    parent: api
---

- [The `/events` API endpoint](#the-events-api-endpoint)
  - [`/events` (GET)](#events-get)
- [The `/events/:client/:check` API endpoints](#the-eventsclientcheck-api-endpoints)
  - [`/events/:client/:check` (DELETE)](#eventsclientcheck-delete)

## The `/events` API endpoint

### `/events` (GET)

The `/events` API endpoint provide HTTP GET access to the Sensu event registry.

#### EXAMPLES {#events-get-examples}

The following example demonstrates a `/events` API query which returns a JSON
Array of JSON Hashes containing [event data][1].

{{< highlight shell >}}
$ curl -s http://localhost:3000/events | jq .
[
  {
    "timestamp": 1460303502,
    "action": "create",
    "occurrences": 1,
    "check": {
      "total_state_change": 14,
      "history": [
        "0",
        "3",
        "3",
        "3",
        "3",
        "3",
        "3",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "0",
        "1"
      ],
      "status": 1,
      "output": "CheckHttp WARNING: 301\n",
      "command": "check-http.rb -u :::website|http://sensuapp.org:::",
      "subscribers": [
        "production"
      ],
      "interval": 60,
      "handler": "mail",
      "name": "sensu_website",
      "issued": 1460303502,
      "executed": 1460303502,
      "duration": 0.032
    },
    "client": {
      "timestamp": 1460303501,
      "version": "1.0.0",
      "website": "http://google.com",
      "socket": {
        "port": 3030,
        "bind": "127.0.0.1"
      },
      "subscriptions": [
        "production"
      ],
      "environment": "development",
      "address": "127.0.0.1",
      "name": "client-01"
    },
    "id": "0f42ec94-12bf-4918-a0b9-52fd57e8ee96"
  }
]
{{< /highlight >}}

#### API specification {#events-get-specification}

/events (GET)  | 
---------------|------
description    | Returns the list of current events.
example url    | http://hostname:3000/events
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight json >}}[
  {
    "id": "1ccfdf59-d9ab-447c-ac11-fd84072b905a",
    "client": {
      "name": "i-424242",
      "address": "127.0.0.1",
      "subscriptions": [
        "webserver",
        "production"
      ],
      "timestamp": 1389374650
    },
    "check": {
      "name": "chef_client_process",
      "command": "check-procs -p chef-client -W 1",
      "subscribers": [
        "production"
      ],
      "interval": 60,
      "issued": 1389374667,
      "executed": 1389374667,
      "output": "WARNING Found 0 matching processes\n",
      "status": 1,
      "duration": 0.032,
      "history": [
        "0",
        "1",
        "1"
      ]
    },
    "occurrences": 2,
    "action": "create"
  }
]
{{< /highlight >}}

## The `/events/:client/:check` API endpoints {#the-eventsclientcheck-api-endpoints}

The `/events/:client/:check` API provides HTTP DELETE access to
current [event data][1] for a named `:client` and `:check`.

### `/events/:client/:check` (DELETE) {#eventsclientcheck-delete}

#### EXAMPLES {#eventsclientcheck-delete-examples}

The following example demonstrates a `/events/:client/:check` API request to
to delete event data for a `:client` named `:client-01` and a `:check` named
`sensu_website`, resulting in a [202 (Accepted) HTTP response code][2] (i.e.
`HTTP/1.1 202 Accepted`) and a payload containing a JSON Hash with the delete
request `issued` timestamp.

{{< highlight shell >}}
curl -s -i -X DELETE http://localhost:3000/events/client-01/sensu_website
HTTP/1.1 202 Accepted
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Content-Length: 21
Connection: keep-alive
Server: thin

{"issued":1460304359}
{{< /highlight >}}

#### API specification {#eventsclientcheck-delete-specification}

/events/:client/:check (DELETE) | 
--------------------------------|------
description                     | Resolves an event for a given check on a given client. (delayed action)
 example url                    | http://hostname:3000/events/i-424242/chef_client_process
response codes                  | <ul><li>**Success**: 202 (Accepted)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]:  ../../reference/events#event-data
[2]:  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
[3]:  ../../reference/events
