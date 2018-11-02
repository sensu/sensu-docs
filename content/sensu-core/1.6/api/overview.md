---
title: "RESTful API Overview"
description: "Overview of Sensu API endpoints"
product: "Sensu Core"
version: "1.6"
weight: 1
menu:
  sensu-core-1.6:
    parent: api
---
## Sensu API

The Sensu API provides access to monitoring data collected by Sensu, such as
a [client registry][1], [check results][2], and [event data][3]. The API can be
used to request adhoc check executions, and resolve events, among other things.

## RESTful JSON API

The Sensu API is [JSON][4]-based [RESTful API][5]. Familiarity with (or
willingness to Google) industry standard RESTful API behaviors &ndash; including
[HTTP response codes][6] &ndash; are strongly recommended.

## Reference documentation

- [Clients API](../clients)
- [Checks API](../checks)
- [Results API](../results)
- [Aggregates API](../aggregates)
- [Events API](../events)
- [Stashes API](../stashes)
- [Health & Info API](../health-and-info)
- [Settings API](../settings)
- [API configuration](../configuration)

## Response Content Filtering

Sensu API endpoints that support the `GET` HTTP method, support HTTP
response content filtering, using one or more filter attributes. To
use response content filtering, construct the URL for your API request
using a dot notation query string parameter beginning with `filter.`,
e.g. `/events?filter.client.environment=production`. The Sensu API will
only return response content objects that match the specified response
content filter attributes. Multiple attributes may be specified for a
request, e.g.
`/events?filter.client.environment=production&filter.check.contact=ops`.

## Response Content Pagination {#pagination}
By default, the Sensu API will return all available results, but sometimes this result can be massive.
To paginate the returned result, the `limit` and `offset` query string parameters can be used.
This method also sets the "X-Pagination" HTTP response header to a JSON object containing the `limit`, `offset`, and `total` number of items that are being paginated.

parameters  |  description
------------|----------
limit       |  The number of items to return
offset      |  The number of items to offset before returning.

### Examples
The following example demonstrates a /clients API query with limit=1 and offset=1.
{{< highlight shell >}}
$ curl -i 'http://127.0.0.1:4567/clients?limit=1&offset=1'

HTTP/1.1 200 OK
Content-type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
Connection: close
X-Pagination: {"limit":1,"offset":1,"total":848}

[
  {
    "name": "client-02",
    "address": "127.0.0.1",
    "subscriptions": [],
    "timestamp": 1538843586
  }
]
{{< /highlight >}}

[1]:  ../../reference/clients#registration-and-registry
[2]:  ../../reference/checks#check-results
[3]:  ../../reference/events#event-data
[4]:  http://www.json.org/
[5]:  https://en.wikipedia.org/wiki/Representational_state_transfer
[6]:  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
