---
title: "RESTful API Overview"
description: "Overview of Sensu API endpoints"
product: "Sensu Core"
version: "1.0"
weight: 1
menu:
  sensu-core-1.0:
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

Sensu API endpoints that support the `GET` HTTP method support HTTP
response content filtering on one or more Sensu attributes.
To use response content filtering, construct the URL for your API request
using a dot notation query beginning with `filter`.

For example, to return only events that match the `production` environment and `ops` contact, use the following request.

{{< highlight shell >}}
curl -i 'http://127.0.0.1:4567/events?filter.client.environment=production&filter.check.contact=ops'
{{< /highlight >}}

Response filtering is only available for string values; integers (for example: `filter.check.status=2`) are not supported.

[1]:  ../../reference/clients#registration-and-registry
[2]:  ../../reference/checks#check-results
[3]:  ../../reference/events#event-data
[4]:  http://www.json.org/
[5]:  https://en.wikipedia.org/wiki/Representational_state_transfer
[6]:  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
