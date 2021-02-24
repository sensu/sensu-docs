---
title: "Silencing"
reference_title: "Silencing"
type: "reference"
description: "Sensu’s built-in silencing capability provides a way to suppress event handler execution on an ad hoc basis so you can plan maintenance and reduce alert fatigue. Read the reference doc to learn about silencing in Sensu."
weight: 160
version: "5.21"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.21:
    parent: reference
---

Sensu's silencing capability allows you to suppress event handler execution on an ad hoc basis so you can plan maintenance and reduce alert fatigue.
Silences are created on an ad hoc basis using `sensuctl`.
Successfully created silencing entries are assigned a `name` in the format `$SUBSCRIPTION:$CHECK`, where `$SUBSCRIPTION` is the name of a Sensu entity subscription and `$CHECK` is the name of a Sensu check.

You can use silences to silence checks on specific entities by taking advantage of per-entity subscriptions (for example, `entity:$ENTITY_NAME`).
When the check name or subscription described in a silencing entry matches an event and the handler uses the `not_silenced` built-in filter, the handler will not be executed.

These silences are persisted in the Sensu datastore.
When the Sensu server processes subsequent check results, it retrieves matching silences from the store.
If there are one or more matching entries, the event is updated with a list of silenced entry names.
The presence of silences indicates that the event is silenced.

When creating a silencing entry, you can specify a combination of checks and subscriptions, but only one or the other is strictly required.
For example, if you create a silencing entry [specifying only a check][12], its name will contain an asterisk (or wildcard) in the `$SUBSCRIPTION` position.
This indicates that any event with a matching check name will be marked as silenced, regardless of the originating entities’ subscriptions.

Conversely, a silencing entry that [specifies only a subscription][11] will have a name with an asterisk in the `$CHECK` position.
This indicates that any event where the originating entities’ subscriptions match the subscription specified in the entry will be marked as silenced, regardless of the check name.

## Silencing examples

This example shows a silencing resource definition that uses a per-entity subscription to silence any alerts on a single Sensu entity, `i-424242`:

{{< language-toggle >}}

{{< code yml >}}
---
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
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

The following example shows how to silence a check named `check_ntp` on entity `i-424242`, ensuring the silencing entry is deleted after the underlying issue is resolved:

{{< language-toggle >}}

{{< code yml >}}
---
type: Silenced
api_version: core/v2
metadata:
  name: entity:i-424242:check_ntp
  namespace: default
  labels: 
  annotations: 
spec:
  subscription: entity:i-424242
  check: check_ntp
  expire_on_resolve: true
{{< /code >}}

{{< code json >}}
{
  "type": "Silenced",
  "api_version": "core/v2",
  "metadata": {
    "name": "entity:i-424242:check_ntp",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "spec": {
    "subscription": "entity:i-424242",
    "check": "check_ntp",
    "expire_on_resolve": true
  }
}
{{< /code >}}

{{< /language-toggle >}}

The optional `expire_on_resolve` attribute used in this example indicates that when the server processes a matching check from the specified entity with status OK, the silencing entry will be removed automatically.

When used in combination with other attributes (like `creator` and `reason`), this gives Sensu operators a way to acknowledge that they received an alert, suppress additional notifications, and automatically clear the silencing entry when the check status returns to normal.

## Silencing specification

### Silenced entry names

Silences must contain either a subscription or check name and are identified by the combination of `$SUBSCRIPTION:$CHECK`.
If a check or subscription is not provided, it will be substituted with a wildcard (asterisk): `$SUBSCRIPTION:*` or `*:$CHECK`.

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][4] resource type. Silences should always be type `Silenced`.
required     | Required for silencing entry definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: Silenced
{{< /code >}}
{{< code json >}}
{
  "type": "Silenced"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For silences in this version of Sensu, the `api_version` should always be `core/v2`.
required     | Required for silencing entry definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: core/v2
{{< /code >}}
{{< code json >}}
{
  "api_version": "core/v2"
}
{{< /code >}}
{{< /language-toggle >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the silencing entry that includes `name`, `namespace`, and `created_by` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the silencing entry definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. See [metadata attributes][3] for details.
required     | Required for silencing entry definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: appserver:mysql_status
  namespace: default
  created_by: admin
  labels:
    region: us-west-1
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "name": "appserver:mysql_status",
    "namespace": "default",
    "created_by": "admin",
    "labels": {
      "region": "us-west-1"
    }
  }
}
{{< /code >}}
{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes the silencing entry [spec attributes][5].
required     | Required for silences in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  expire: -1
  expire_on_resolve: false
  creator: admin
  reason:
  check:
  subscription: entity:i-424242
  begin: 1542671205
{{< /code >}}
{{< code json >}}
{
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
{{< /code >}}
{{< /language-toggle >}}

### Metadata attributes

| name       |      |
-------------|------ 
description  | Silencing identifier generated from the combination of a subscription name and check name.
required     | false - This value cannot be modified.
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: appserver:mysql_status
{{< /code >}}
{{< code json >}}
{
  "name": "appserver:mysql_status"
}
{{< /code >}}
{{< /language-toggle >}}

| namespace  |      |
-------------|------
description  | Sensu [RBAC namespace][2] that the silencing entry belongs to.
required     | false
type         | String
default      | `default`
example      | {{< language-toggle >}}
{{< code yml >}}
namespace: production
{{< /code >}}
{{< code json >}}
{
  "namespace": "production"
}
{{< /code >}}
{{< /language-toggle >}}

| created_by |      |
-------------|------
description  | Username of the Sensu user who created the silence or last updated the silence. Sensu automatically populates the `created_by` field when the silence is created or updated.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
created_by: admin
{{< /code >}}
{{< code json >}}
{
  "created_by": "admin"
}
{{< /code >}}
{{< /language-toggle >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with event data that you can use for response and web UI view filtering.<br><br>If you include labels in your event data, you can filter [API responses][6], [sensuctl responses][7], and [web UI views][9] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
labels:
  environment: development
  region: us-west-2
{{< /code >}}
{{< code json >}}
{
  "labels": {
    "environment": "development",
    "region": "us-west-2"
  }
}
{{< /code >}}
{{< /language-toggle >}}

| annotations | |
-------------|------
description  | Non-identifying metadata to include with event data that you can access with [event filters][8]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][6], [sensuctl response filtering][7], or [web UI views][10].
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
annotations:
  managed-by: ops
  playbook: www.example.url
{{< /code >}}
{{< code json >}}
{
  "annotations": {
    "managed-by": "ops",
    "playbook": "www.example.url"
  }
}
{{< /code >}}
{{< /language-toggle >}}

### Spec attributes

check        | 
-------------|------ 
description  | Name of the check the entry should match.
required     | true, unless `subscription` is provided
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
check: haproxy_status
{{< /code >}}
{{< code json >}}
{
  "check": "haproxy_status"
}
{{< /code >}}
{{< /language-toggle >}}

subscription | 
-------------|------ 
description  | Name of the subscription the entry should match.
required     | true, unless `check` is provided
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
subscription: entity:i-424242
{{< /code >}}
{{< code json >}}
{
  "subscription": "entity:i-424242"
}
{{< /code >}}
{{< /language-toggle >}}

begin        | 
-------------|------ 
description  | Time at which silence entry goes into effect. In epoch. 
required     | false 
type         | Integer 
example      | {{< language-toggle >}}
{{< code yml >}}
begin: 1512512023
{{< /code >}}
{{< code json >}}
{
  "begin": 1512512023
}
{{< /code >}}
{{< /language-toggle >}}

expire       | 
-------------|------ 
description  | Number of seconds until the entry should be deleted. 
required     | false 
type         | Integer 
default      | -1
example      | {{< language-toggle >}}
{{< code yml >}}
expire: 3600
{{< /code >}}
{{< code json >}}
{
  "expire": 3600
}
{{< /code >}}
{{< /language-toggle >}}

expire_on_resolve       | 
-------------|------ 
description  | `true` if the entry should be deleted when a check begins to return OK status (resolves). Otherwise, `false`.
required     | false 
type         | Boolean 
default      | false 
example      | {{< language-toggle >}}
{{< code yml >}}
expire_on_resolve: true
{{< /code >}}
{{< code json >}}
{
  "expire_on_resolve": true
}
{{< /code >}}
{{< /language-toggle >}}

creator      | 
-------------|------ 
description  | Person, application, or entity responsible for creating the entry.
required     | false 
type         | String 
default      | null 
example      | {{< language-toggle >}}
{{< code yml >}}
creator: Application Deploy Tool 5.0
{{< /code >}}
{{< code json >}}
{
  "creator": "Application Deploy Tool 5.0"
}
{{< /code >}}
{{< /language-toggle >}}

reason       | 
-------------|------ 
description  | Explanation of the reason for creating the entry.
required     | false 
type         | String 
default      | null 
example      | {{< language-toggle >}}
{{< code yml >}}
reason: rebooting the world
{{< /code >}}
{{< code json >}}
{
  "reason": "rebooting the world"
}
{{< /code >}}
{{< /language-toggle >}}

## Silence all checks on entities with a specific subscription

In this example, you'll completely silence any entities subscribed to `appserver`.
Just as in the example of silencing all checks on a specific entity, you’ll create a silencing entry that specifies only the `appserver` subscription:

{{< language-toggle >}}

{{< code yml >}}
---
type: Silenced
api_version: core/v2
metadata:
  name: appserver
  namespace: default
  labels: 
  annotations: 
spec:
  subscription: appserver
{{< /code >}}

{{< code json >}}
{
  "type": "Silenced",
  "api_version": "core/v2",
  "metadata": {
    "name": "appserver",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "spec": {
    "subscription": "appserver"
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Silence a specific check on entities with a specific subscription

To silence a check `mysql_status` that is running on Sensu entities with the subscription `appserver`:

{{< language-toggle >}}

{{< code yml >}}
---
type: Silenced
api_version: core/v2
metadata:
  name: appserver:mysql_status
  namespace: default
  labels: 
  annotations: 
spec:
  subscription: appserver
  check: mysql_status
{{< /code >}}

{{< code json >}}
{
  "type": "Silenced",
  "api_version": "core/v2",
  "metadata": {
    "name": "appserver:mysql_status",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "spec": {
    "subscription": "appserver",
    "check": "mysql_status"
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Silence a specific check on every entity

To silence the check `mysql_status` on every entity in your infrastructure, regardless of subscriptions, you only need to provide the check name:

{{< language-toggle >}}

{{< code yml >}}
---
type: Silenced
api_version: core/v2
metadata:
  name: mysql_status
  namespace: default
  labels: 
  annotations: 
spec:
  check: mysql_status
{{< /code >}}

{{< code json >}}
{
  "type": "Silenced",
  "api_version": "core/v2",
  "metadata": {
    "name": "mysql_status",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "spec": {
    "check": "mysql_status"
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Delete a silence

To delete a silencing entry, you must provide its name.

Subscription-only silencing entry names will contain an asterisk (or wildcard) in the `$SUBSCRIPTION` position, similar to this example:

{{< language-toggle >}}

{{< code yml >}}
name: appserver:*
{{< /code >}}

{{< code json >}}
{
  "name": "appserver:*"
}
{{< /code >}}

{{< /language-toggle >}}

Check-only silencing entry names will contain an asterisk (or wildcard) in the `$CHECK` position, similar to this example:

{{< language-toggle >}}

{{< code yml >}}
name: '*:mysql_status'
{{< /code >}}

{{< code json >}}
{
  "name": "*:mysql_status"
}
{{< /code >}}

{{< /language-toggle >}}


[1]: ../events/#attributes
[2]: ../namespaces/
[3]: #metadata-attributes
[4]: ../../sensuctl/create-manage-resources/#create-resources
[5]: #spec-attributes
[6]: ../../api#response-filtering
[7]: ../../sensuctl/filter-responses/
[8]: ../filters/
[9]: ../../web-ui/filter#filter-with-label-selectors
[10]: ../../web-ui/filter/
[11]: #silence-all-checks-on-entities-with-a-specific-subscription
[12]: #silence-a-specific-check-on-every-entity
