---
title: "Events API"
description: "Sensu Events API reference documentation."
product: "Sensu Enterprise Dashboard"
version: "2.9"
menu:
  sensu-enterprise-dashboard-2.9:
    parent: api
---

- [The `/events` API endpoint](#the-events-api-endpoint)
  - [`/events` (GET)](#events-get)
- [The `/events/:client/:check` API endpoint](#the-eventsclientcheck-api-endpoint)
  - [`/events/:client/:check` (DELETE)](#eventsclientcheck-delete)

## The `/events` API endpoint

The `/events` API endpoint provide HTTP GET access to the Sensu event registry.

### `/events` (GET)

#### EXAMPLES {#events-get-examples}

The following example demonstrates a `/events` API query which returns a JSON
Array of JSON Hashes containing [event data][1].

{{< highlight shell >}}
$ curl -s http://127.0.0.1:3000/events | jq .
[
  {
    "_id": "us_west1/client-01/sensu_website",
    "action": "create",
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
      "command": "check-http.rb -u :::website|http://sensu.io:::",
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
      "version": "1.5.0",
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
      "name": "client-01",
      "silenced": false
    },
    "dc": "us_west1",
    "id": "0f42ec94-12bf-4918-a0b9-52fd57e8ee96",
    "last_ok": 1460303501,
    "last_state_change": 1460303502,
    "occurrences": 1,
    "occurrences_watermark": 1,
    "silenced": false,
    "silenced_by": null,
    "timestamp": 1460303502
  }
]
{{< /highlight >}}

#### API specification {#events-get-specification}

/events (GET)  | 
---------------|------
description    | Returns the list of current events with check, client, and datacenter (`dc`) information
example url    | http://hostname:3000/events
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight json >}}[
  {
    "_id": "us_west1/client-01/sensu_website",
    "action": "create",
    "check": {
      "total_state_change": 14,
      "history": [
        "0",
        "1"
      ],
      "status": 1,
      "output": "CheckHttp WARNING: 301\n",
      "command": "check-http.rb -u :::website|http://sensu.io:::",
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
      "version": "1.5.0",
      "website": "http://google.com",
      "subscriptions": [
        "production"
      ],
      "environment": "development",
      "address": "127.0.0.1",
      "name": "client-01",
      "silenced": false
    },
    "dc": "us_west1",
    "id": "0f42ec94-12bf-4918-a0b9-52fd57e8ee96",
    "last_ok": 1460303501,
    "last_state_change": 1460303502,
    "occurrences": 1,
    "occurrences_watermark": 1,
    "silenced": false,
    "silenced_by": null,
    "timestamp": 1460303502
  }
]
{{< /highlight >}}

## The `/events/:client/:check` API endpoint {#the-eventsclientcheck-api-endpoint}

The `/events/:client/:check` API provides HTTP DELETE access to
current [event data][1] for a named client and check.

### `/events/:client/:check` (DELETE) {#eventsclientcheck-delete}

#### EXAMPLES {#eventsclientcheck-delete-examples}

The following example demonstrates a `/events/:client/:check` API request to
to delete event data for a client named `client-01` and a check named
`sensu_website`, resulting in a [202 (Accepted) HTTP response code][2].

{{< highlight shell >}}
curl -s -i -X DELETE http://127.0.0.1:3000/events/client-01/sensu_website
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

#### API specification {#eventsclientcheck-delete-specification}

/events/:client/:check (DELETE) | 
--------------------------------|------
description                     | Resolves an event for a given check on a given client. (delayed action)
example url                     | http://hostname:3000/events/i-424242/chef_client_process
parameters                      | <ul><li>`dc`:<ul><li>**required**: false</li><li>**type**: String</li><li>**description**: If the check name is present in multiple datacenters, specifying the `dc` parameter will access only the check found in that datacenter.</li><li>**example**: `http://hostname:3000/events/i-424242/chef_client_process?dc=us_west1`</li></ul></li></ul>
response codes                  | <ul><li>**Success**: 202 (Accepted)</li><li>**Found in multiple datacenters**: 300 (Multiple Choices)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]:  /sensu-core/latest/reference/events#event-data
[2]:  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
[3]:  /sensu-core/latest/reference/events
