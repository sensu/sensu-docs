---
title: "Sensu Enterprise Console API Overview"
linkTitle: "Overview"
description: "Overview of Sensu Enterprise Console API endpoints"
product: "Sensu Enterprise Dashboard"
version: "2.12"
weight: 1
menu:
  sensu-enterprise-dashboard-2.12:
    parent: api
---

The Sensu Enterprise Console API provides access to monitoring data across datacenters,
including clients, checks, and events.
Use the Console API to request adhoc check executions, silence check results, resolve events, and more.

## RESTful JSON API

The Console API is [JSON][4]-based [RESTful API][5] using standard [HTTP response codes][6].

## Reference documentation

- [Aggregates API](../aggregates)
- [Checks API](../checks)
- [Clients API](../clients)
- [Configuration API](../config)
- [Datacenters API](../datacenters)
- [Events API](../events)
- [Results API](../results)
- [Silenced API](../silenced)
- [Stashes API](../stashes)
- [Subscriptions API](../subscriptions)

## RBAC for the Sensu Enterprise Console API

Sensu Enterprise integrates role-based access controls with the Console API to help give your users the right level of API functionality.
See the [RBAC reference docs][7] to create role-based access tokens and define the methods (`get`, `post`, `delete`, and `head`) and APIs available to each role per API.
To access the API using a role-based access token, provide the token as a header or query parameter.
The examples below show an access token used to access the Events API.

In a header:

{{< highlight shell >}}
$ curl -H "Authorization: token TOKEN" https://localhost:3000/events
{{< /highlight >}}

As a parameter:

{{< highlight shell >}}
$ curl https://localhost:3000/events?token=TOKEN
{{< /highlight >}}

[4]:  http://www.json.org/
[5]:  https://en.wikipedia.org/wiki/Representational_state_transfer
[6]:  https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
[7]:  ../../rbac/overview/#rbac-for-the-sensu-enterprise-console-api