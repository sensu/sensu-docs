---
title: "Silencing"
description: "The silencing reference guide."
weight: 1
version: "2.0"
product: "Sensu Core"
platformContent: true
menu:
  sensu-core-2.0:
    parent: reference
---

# Silencing

## How does silencing work?
Silencing entries are created on an ad-hoc basis via `sensuctl`. When silencing entries are successfully created, they are assigned an `ID` in the format `$SUBSCRIPTION:$CHECK`, where `$SUBSCRIPTION` is the name of a Sensu agent subscription and `$CHECK` is the name of a Sensu check. Silencing entries can be used to silence checks on specific agents by by taking advantage of per-agent subscriptions, e.g. `agent:$AGENT_NAME`.

These silencing entries are persisted in the Sensu data store. When the Sensu server processes subsequent check results, matching silencing entries are retrieved from the store. If one or more matching entries exist, the event is updated with a list of silenced entry ids. The presence of silencing entries indicates that the event is silenced.

When creating a silencing entry, a combination of check and subscription can be specified, but only one or the other is strictly required.

For example, when a silencing entry is created specifying only a check, its ID will contain an asterisk (or wildcard) in the `$SUBSCRIPTION` position. This indicates that any event with a matching check name will be marked as silenced, regardless of the originating agent’s subscriptions.

Conversely, a silencing entry which specifies only a subscription will have an ID with an asterisk in the `$CHECK` position. This indicates that any event where the originating agent’s subscriptions match the subscription specified in the entry will be marked as silenced, regardless of the check name.

## Silencing specification

### Silenced entry ID 
Silencing entries must contain either a subscription or check id, and are
identified by the combination of `$SUBSCRIPTION:$CHECK`. If a check or
subscription is not provided, it will be substituted with a wildcard (asterisk):
`$SUBSCRIPTION:*` or `*:$CHECK`.

### Attributes
check        | 
-------------|------ 
description  | The name of the check the entry should match 
required     | true, unless `subscription` is provided
type         | String
example      | {{< highlight shell >}}"check": "haproxy_status"{{</highlight>}}
example      | {{< highlight shell >}}"check": "haproxy_status",
"subscription" : "load_balancer"{{</highlight>}}

subscription | 
-------------|------ 
description  | The name of the subscription the entry should match 
required     | true, unless `check` is provided
type         | String
example      | {{< highlight shell >}}"subscription": "client:i-424242"{{</highlight>}}
example      | {{< highlight shell >}}
  "subscription": "client:i-424242",
  "check" : "haproxy_status"
{{</highlight>}}

id           | 
-------------|------ 
description  | Silencing identifier generated from the combination of a subsription name and check name. 
required     | false - this value cannot be modified 
type         | String
example      | {{< highlight shell >}}
  "id": "appserver:mysql_status",
  "check": "mysql_status",
  "subscription": "appserver",
{{</highlight>}}

begin        | 
-------------|------ 
description  | Time at which silence entry goes into effect, in epoch. 
required     | false 
type         | Integer 
example      | {{< highlight shell >}}
  "begin": 1512512023,
  "check": "disk_utilization",
  "subscription": "client:i-424242"
{{</highlight>}}

expire       | 
-------------|------ 
description  | Number of seconds until this entry should be deleted. 
required     | false 
type         | Integer 
default      | -1
example      | {{< highlight shell >}}
  "expire": 3600,
  "check": "disk_utilization",
  "subscription": "client:i-424242"
{{</highlight>}}

expire_on_resolve       | 
-------------|------ 
description  | If the entry should be deleted when a check begins return OK status (resolves). 
required     | false 
type         | Boolean 
default      | false 
example      | {{< highlight shell >}}
  "expire_on_resolve": true,
  "check": "disk_utilization",
{{</highlight>}}


creator      | 
-------------|------ 
description  | Person/application/entity responsible for creating the entry. 
required     | false 
type         | String 
default      | null 
example      | {{< highlight shell >}}
  "creator": "Application Deploy Tool 5.0",
  "subsription": "appservers",
  "check": "app_status"
{{</highlight>}}

reason       | 
-------------|------ 
description  | Explanation for the creation of this entry.
required     | false 
type         | String 
default      | null 
example      | {{< highlight shell >}}
  "creator": "mercedes",
  "subsription": "webserver",
  "check": "app_status",
  "reason": "rebooting the world"
{{</highlight>}}

## Examples
