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

## How does silencing work?
Silencing entries are created on an ad-hoc basis via `sensuctl`. When silencing entries are successfully created, they are assigned an `ID` in the format `$SUBSCRIPTION:$CHECK`, where `$SUBSCRIPTION` is the name of a Sensu entity subscription and `$CHECK` is the name of a Sensu check. Silencing entries can be used to silence checks on specific entities by taking advantage of per-entity subscriptions, e.g. `entity:$ENTITY_NAME`. When the check name and/or subscription described in a silencing entry match an event, the handler will not be executed and an informational message will be logged.

These silencing entries are persisted in the Sensu data store. When the Sensu server processes subsequent check results, matching silencing entries are retrieved from the store. If one or more matching entries exist, the event is updated with a list of silenced entry ids. The presence of silencing entries indicates that the event is silenced.

When creating a silencing entry, a combination of check and subscription can be specified, but only one or the other is strictly required.

For example, when a silencing entry is created specifying only a check, its ID will contain an asterisk (or wildcard) in the `$SUBSCRIPTION` position. This indicates that any event with a matching check name will be marked as silenced, regardless of the originating entities’ subscriptions.

Conversely, a silencing entry which specifies only a subscription will have an ID with an asterisk in the `$CHECK` position. This indicates that any event where the originating entities’ subscriptions match the subscription specified in the entry will be marked as silenced, regardless of the check name.

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
example      | {{< highlight shell >}}"check": "haproxy_status"{{</ highlight >}}
example      | {{< highlight shell >}}"check": "haproxy_status", "subscription" : "load_balancer"{{</ highlight >}}

subscription | 
-------------|------ 
description  | The name of the subscription the entry should match 
required     | true, unless `check` is provided
type         | String
example      | {{< highlight shell >}}"subscription": "entity:i-424242"{{</highlight>}}
example      | {{< highlight shell >}}
  "subscription": "entity:i-424242",
  "check" : "haproxy_status"
{{</ highlight >}}

id           | 
-------------|------ 
description  | Silencing identifier generated from the combination of a subsription name and check name. 
required     | false - this value cannot be modified 
type         | String
example      | {{< highlight shell >}}
  "id": "appserver:mysql_status",
  "check": "mysql_status",
  "subscription": "appserver",
{{</ highlight >}}

begin        | 
-------------|------ 
description  | Time at which silence entry goes into effect, in epoch. 
required     | false 
type         | Integer 
example      | {{< highlight shell >}}
  "begin": 1512512023,
  "check": "disk_utilization",
  "subscription": "entity:i-424242"
{{</ highlight >}}

expire       | 
-------------|------ 
description  | Number of seconds until this entry should be deleted. 
required     | false 
type         | Integer 
default      | -1
example      | {{< highlight shell >}}
  "expire": 3600,
  "check": "disk_utilization",
  "subscription": "entity:i-424242"
{{</ highlight >}}

expire_on_resolve       | 
-------------|------ 
description  | If the entry should be deleted when a check begins return OK status (resolves). 
required     | false 
type         | Boolean 
default      | false 
example      | {{< highlight shell >}}
  "expire_on_resolve": true,
  "check": "disk_utilization",
{{</ highlight >}}


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
{{</ highlight >}}

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
{{</ highlight >}}

organization | 
-------------|------ 
description  | the sensu RBAC organization that this check belongs to
required     | false 
type         | String 
default      | "default" 
example      | {{< highlight shell >}}
  "organization": "default",
{{</ highlight >}}

environment  | 
-------------|------ 
description  | the sensu RBAC environment that this check belongs to
required     | false 
type         | String 
default      | "default" 
example      | {{< highlight shell >}}
  "environment": "default",
{{</ highlight >}}

## Examples

### Silence all checks on a specific entity 
Assume a Sensu entity `i-424242` which we wish to silence any alerts on. We’ll do this by taking advantage of per-entity subscriptions:
{{< highlight json >}}
{
  "expire": -1,
  "expire_on_resolve": false,
  "creator": null,
  "reason": null,
  "check": null,
  "subscription": "entity:i-424242",
  "id": "entity:i-424242:*"
}
{{</ highlight >}}

### Silence a specific check on a specific entity
Following on the previous example, silence a check named `check_ntp` on
entity `i-424242`, ensuring the entry is deleted once the underlying issue has
been resolved:
{{< highlight json >}}
{
  "subscription": "entity:i-424242", 
  "check": "check_ntp", 
  "expire_on_resolve": true 
}
{{</ highlight >}}
The optional expire_on_resolve attribute used here indicates that when the server processes a matching check from the specified entity with status OK, this silencing entry will automatically be removed.

When used in combination with other attributes (e.g. creator and reason), this provides Sensu operators with a method of acknowledging that they have received an alert, suppressing additional notifications, and automatically clearing the silencing entry when the check status returns to normal.

### Silence all checks on entities with a specific subscription
In this case, we'll compleltely silence any entities subscribed to `appserver`. Just as in the example of silencing all checks on a specific entity, we’ll create a silencing entry specifying only the `appserver` subscription:
{{< highlight json >}}
{
  "subscription": "appserver", 
}
{{</ highlight >}}

### Silence a specific check on entities with a specific subscription
Assume a check `mysql_status` which we wish to silence, running on Sensu entitys with the subscription `appserver`:
{{< highlight json >}}
{
  "subscription": "appserver", 
  "check": "mysql_status"
}
{{</ highlight >}}

### Silence a specific check on every entity
To silence the check `mysql_status` on every entity in our infrastructure,
regardless of subscriptions, we only need to provide the check name:
{{< highlight json >}}
{
  "check": "mysql_status"
}
{{</ highlight >}}

### Deleting silencing entries
To delete a silencing entry, you will need to provide its id. Subscription only
silencing entry ids will be similar to this:
{{< highlight json >}}
{
  "id": "appserver:*"
}
{{</ highlight >}}
Check only silencing entry ids will be similar to this:
{{< highlight json >}}
{
  "id": "*:mysql_status"
}
{{</ highlight >}}
