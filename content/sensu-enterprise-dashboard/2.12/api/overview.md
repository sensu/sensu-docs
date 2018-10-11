---
title: "RESTful API Overview"
description: "Overview of Sensu API endpoints"
product: "Sensu Enterprise Dashboard"
version: "2.12"
weight: 1
menu:
  sensu-enterprise-dashboard-2.12:
    parent: api
---

The Sensu Enterprise Console API provides access to monitoring data across datacenters,
such as a [client registry][1], [check results][2], and [event data][3]. The API can be
used to request adhoc check executions, and resolve events, among other things.

## RESTful JSON API

The Sensu API is [JSON][4]-based [RESTful API][5] using standard [HTTP response codes][6].

## Reference documentation

- [Aggregates API](../aggregates)
- [Checks API](../checks)
- [Clients API](../clients)
- [Configuration API](../config)
- [Datacenters API](../datacenters)
- [Events API](../events)
- [Results API](../results)
- [Silencing API](../silenced)
- [Stashes API](../stashes)
- [Subscriptions API](../subscriptions)

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

[1]:  ../../reference/clients#registration-and-registry
[2]:  ../../reference/checks#check-results
[3]:  ../../reference/events#event-data
[4]:  http://www.json.org/
[5]:  https://en.wikipedia.org/wiki/Representational_state_transfer
[6]:  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
