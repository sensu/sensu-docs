---
title: "Silencing"
description: "Sensu’s built-in silencing capability provides the means to suppress execution of event handlers on an ad-hoc basis, letting you plan maintenances and giving you even more tools to reduce alert fatigue. Read the reference doc to learn about silencing in Sensu."
weight: 10
version: "5.6"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.6:
    parent: reference
---

- [Specification](#silencing-specification)
- [Examples](#examples)
	- [Silence all checks on a specific entity](#silence-all-checks-on-a-specific-entity)
	- [Silence a specific check on a specific entity](#silence-a-specific-check-on-a-specific-entity)
	- [Silence all checks on entities with a specific subscription](#silence-all-checks-on-entities-with-a-specific-subscription)
	- [Silence a specific check on entities with a specific subscription](#silence-a-specific-check-on-entities-with-a-specific-subscription)
	- [Silence a specific check on every entity](#silence-a-specific-check-on-every-entity)
	- [Deleting silencing entries](#deleting-silencing-entries)

## How does silencing work?
Silencing entries are created on an ad-hoc basis via `sensuctl`. When silencing
entries are successfully created, they are assigned a `name` in the format
`$SUBSCRIPTION:$CHECK`, where `$SUBSCRIPTION` is the name of a Sensu entity
subscription and `$CHECK` is the name of a Sensu check. Silencing entries can be
used to silence checks on specific entities by taking advantage of per-entity
subscriptions, for example: `entity:$ENTITY_NAME`. When the check name and/or
subscription described in a silencing entry match an event and a handler use the
`not_silenced` built-in filter, this handler will not be executed.

These silencing entries are persisted in the Sensu data store. When the Sensu
server processes subsequent check results, matching silencing entries are
retrieved from the store. If one or more matching entries exist, the event is
updated with a list of silenced entry names. The presence of silencing entries
indicates that the event is silenced.

When creating a silencing entry, a combination of check and subscription can be
specified, but only one or the other is strictly required.

For example, when a silencing entry is created specifying only a check, its name
will contain an asterisk (or wildcard) in the `$SUBSCRIPTION` position. This
indicates that any event with a matching check name will be marked as silenced,
regardless of the originating entities’ subscriptions.

Conversely, a silencing entry which specifies only a subscription will have a
name with an asterisk in the `$CHECK` position. This indicates that any event
where the originating entities’ subscriptions match the subscription specified
in the entry will be marked as silenced, regardless of the check name.

## Silencing specification

### Silenced entry names
Silencing entries must contain either a subscription or check name, and are
identified by the combination of `$SUBSCRIPTION:$CHECK`. If a check or
subscription is not provided, it will be substituted with a wildcard (asterisk):
`$SUBSCRIPTION:*` or `*:$CHECK`.

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute specifying the [`sensuctl create`][sc] resource type. Silencing entries should always be of type `Silenced`.
required     | Required for silencing entry definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"type": "Silenced"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute specifying the Sensu API group and version. For silencing entries in Sensu backend version 5.6, this attribute should always be `core/v2`.
required     | Required for silencing entry definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"api_version": "core/v2"{{< /highlight >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the silencing entry, including the `name` and `namespace` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the silencing entry definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope.  See the [metadata attributes reference][3] for details.
required     | Required for silencing entry definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"metadata": {
  "name": "appserver:mysql_status",
  "namespace": "default",
  "labels": {
    "region": "us-west-1"
  }
{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes the silencing entry [spec attributes][sp].
required     | Required for silencing entries in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"spec": {
  "expire": -1,
  "expire_on_resolve": false,
  "creator": "admin",
  "reason": null,
  "check": null,
  "subscription": "entity:i-424242",
  "begin": 1542671205
}
{{< /highlight >}}

### Spec attributes

check        | 
-------------|------ 
description  | The name of the check the entry should match 
required     | true, unless `subscription` is provided
type         | String
example      | {{< highlight shell >}}"check": "haproxy_status"{{< /highlight >}}


subscription | 
-------------|------ 
description  | The name of the subscription the entry should match 
required     | true, unless `check` is provided
type         | String
example      | {{< highlight shell >}}"subscription": "entity:i-424242"{{</highlight>}}

begin        | 
-------------|------ 
description  | Time at which silence entry goes into effect, in epoch. 
required     | false 
type         | Integer 
example      | {{< highlight shell >}}"begin": 1512512023{{< /highlight >}}

expire       | 
-------------|------ 
description  | Number of seconds until this entry should be deleted. 
required     | false 
type         | Integer 
default      | -1
example      | {{< highlight shell >}}"expire": 3600{{< /highlight >}}

expire_on_resolve       | 
-------------|------ 
description  | If the entry should be deleted when a check begins return OK status (resolves). 
required     | false 
type         | Boolean 
default      | false 
example      | {{< highlight shell >}}"expire_on_resolve": true{{< /highlight >}}


creator      | 
-------------|------ 
description  | Person/application/entity responsible for creating the entry. 
required     | false 
type         | String 
default      | null 
example      | {{< highlight shell >}}"creator": "Application Deploy Tool 5.0"{{< /highlight >}}

reason       | 
-------------|------ 
description  | Explanation for the creation of this entry.
required     | false 
type         | String 
default      | null 
example      | {{< highlight shell >}}"reason": "rebooting the world"{{< /highlight >}}

### Metadata attributes

| name       |      |
-------------|------ 
description  | Silencing identifier generated from the combination of a subscription name and check name.
required     | false - This value cannot be modified.
type         | String
example      | {{< highlight shell >}}"name": "appserver:mysql_status"{{< /highlight >}}

| namespace  |      |
-------------|------
description  | The Sensu [RBAC namespace][2] that this silencing entry belongs to.
required     | false
type         | String
default      | `default`
example      | {{< highlight shell >}}"namespace": "production"{{< /highlight >}}

| labels     |      |
-------------|------
description  | Custom attributes you can use to create meaningful collections that can be selected with [API filtering][api-filter] and [sensuctl filtering][sensuctl-filter]. Overusing labels can impact Sensu's internal performance, so we recommend moving complex, non-identifying metadata to annotations.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores, but must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}}"labels": {
  "environment": "development",
  "region": "us-west-2"
}{{< /highlight >}}

| annotations | |
-------------|------
description  | Non-identifying metadata that's meaningful to people interacting with Sensu.<br><br>In contrast to labels, annotations cannot be used in [API filtering][api-filter] or [sensuctl filtering][sensuctl-filter] and do not impact Sensu's internal performance.
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}} "annotations": {
  "managed-by": "ops",
  "playbook": "www.example.url"
}{{< /highlight >}}

## Examples

### Silence all checks on a specific entity 
Assume a Sensu entity `i-424242` which we wish to silence any alerts on. We’ll
do this by taking advantage of per-entity subscriptions:

{{< language-toggle >}}

{{< highlight yml >}}
type: Silenced
api_version: core/v2
metadata:
  annotations: null
  labels: null
  name: entity:i-424242:*
  namespace: default
spec:
  begin: 1542671205
  check: null
  creator: admin
  expire: -1
  expire_on_resolve: false
  reason: null
  subscription: entity:i-424242
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Silenced",
  "api_version": "core/v2",
  "metadata": {
    "name": "entity:i-424242:*",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "spec": {
    "expire": -1,
    "expire_on_resolve": false,
    "creator": "admin",
    "reason": null,
    "check": null,
    "subscription": "entity:i-424242",
    "begin": 1542671205
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

### Silence a specific check on a specific entity
Following on the previous example, silence a check named `check_ntp` on entity
`i-424242`, ensuring the entry is deleted once the underlying issue has been
resolved:

{{< language-toggle >}}

{{< highlight yml >}}
check: check_ntp
expire_on_resolve: true
subscription: entity:i-424242
{{< /highlight >}}

{{< highlight json >}}
{
  "subscription": "entity:i-424242", 
  "check": "check_ntp", 
  "expire_on_resolve": true 
}
{{< /highlight >}}

{{< /language-toggle >}}

The optional `expire_on_resolve` attribute used here indicates that when the
server processes a matching check from the specified entity with status OK, this
silencing entry will automatically be removed.

When used in combination with other attributes (like `creator` and `reason`), this
provides Sensu operators with a method of acknowledging that they have received
an alert, suppressing additional notifications, and automatically clearing the
silencing entry when the check status returns to normal.

### Silence all checks on entities with a specific subscription
In this case, we'll completely silence any entities subscribed to `appserver`.
Just as in the example of silencing all checks on a specific entity, we’ll
create a silencing entry specifying only the `appserver` subscription:

{{< language-toggle >}}

{{< highlight yml >}}
subscription: appserver
{{< /highlight >}}

{{< highlight json >}}
{
  "subscription": "appserver" 
}
{{< /highlight >}}

{{< /language-toggle >}}

### Silence a specific check on entities with a specific subscription
Assume a check `mysql_status` which we wish to silence, running on Sensu
entities with the subscription `appserver`:

{{< language-toggle >}}

{{< highlight yml >}}
check: mysql_status
subscription: appserver
{{< /highlight >}}

{{< highlight json >}}
{
  "subscription": "appserver", 
  "check": "mysql_status"
}
{{< /highlight >}}

{{< /language-toggle >}}

### Silence a specific check on every entity
To silence the check `mysql_status` on every entity in our infrastructure,
regardless of subscriptions, we only need to provide the check name:

{{< language-toggle >}}

{{< highlight yml >}}
check: mysql_status
{{< /highlight >}}

{{< highlight json >}}
{
  "check": "mysql_status"
}
{{< /highlight >}}

{{< /language-toggle >}}

### Deleting silencing entries
To delete a silencing entry, you will need to provide its name. Subscription only
silencing entry names will be similar to this:

{{< language-toggle >}}

{{< highlight yml >}}
name: appserver:*
{{< /highlight >}}

{{< highlight json >}}
{
  "name": "appserver:*"
}
{{< /highlight >}}

{{< /language-toggle >}}

Check only silencing entry names will be similar to this:

{{< language-toggle >}}

{{< highlight yml >}}
name: '*:mysql_status'
{{< /highlight >}}

{{< highlight json >}}
{
  "name": "*:mysql_status"
}
{{< /highlight >}}

{{< /language-toggle >}}

[1]: ../events/#attributes
[2]: ../rbac#namespaces
[3]: #metadata-attributes
[sc]: ../../sensuctl/reference#creating-resources
[sp]: #spec-attributes
[api-filter]: ../../api/overview#filtering
[sensuctl-filter]: ../../sensuctl/reference#filtering
