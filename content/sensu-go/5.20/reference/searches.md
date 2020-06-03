---
title: "Searches"
description: "The saved searches feature in the Sensu web UI allows you to create, update, and delete saved searches. Read the reference doc to learn about saved searches in Sensu."
weight: 143
version: "5.20"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.20:
    parent: reference
---

- [Searches specification](#searches-specification)
  - [Top-level attributes](#top-level-attributes) | [Metadata attributes](#metadata-attributes) | [Spec attributes](#spec-attributes)
- [Examples](#examples)
	- [Searches all checks on a specific entity](#silence-all-checks-on-a-specific-entity)

**COMMERCIAL FEATURE**: Access saved searches in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][1].

With the saved searches feature, you can filter your resources and events and save the filter to etcd in a [namespaced resource][2] named `searches`.

The saved searches feature is designed to be used directly in the [web UI][3].
However, you can create, retrieve, update, and delete saved searches with the [searches API][4].

## Searches specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][6] resource type. Searches should always be type `Search`.
required     | Required for search entry definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][6].
type         | String
example      | {{< highlight shell >}}"type": "Search"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For searches in this version of Sensu, the `api_version` should always be `searches/v1`.
required     | Required for search entry definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][6].
type         | String
example      | {{< highlight shell >}}"api_version": "searches/v1"{{< /highlight >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the search entry that includes `name` and `namespace`. The `metadata` map is always at the top level of the search entry definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. See [metadata attributes][5] for details.
required     | Required for search entry definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][6].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"metadata": {
  "name": "incidents-us-west",
  "namespace": "default"
}
{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes the search entry [spec attributes][7]. The spec contents will depend on the filters you apply and save in the search.
required     | Required for silences in `wrapped-json` or `yaml` format for use with [`sensuctl create`][6].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"spec": {
  "parameters": [
  "labelSelector:region == \"us-west-1\"",
  "status:incident"
  ],
  "resource": "core.v2/Event"
}
{{< /highlight >}}

### Metadata attributes

| name       |      |
-------------|------ 
description  | Search identifier generated from the combination of a subscription name and check name.
required     | true
type         | String
example      | {{< highlight shell >}}"name": "incidents-us-west"{{< /highlight >}}

| namespace  |      |
-------------|------
description  | Sensu [RBAC namespace][8] that the search entry belongs to.
required     | false
type         | String
default      | `default`
example      | {{< highlight shell >}}"namespace": "default"{{< /highlight >}}

### Spec attributes

check        | 
-------------|------ 
description  | Name of the check the entry should match.
required     | true, unless `subscription` is provided
type         | String
example      | {{< highlight shell >}}"check": "haproxy_status"{{< /highlight >}}

entity       | 
-------------|------ 
description  | Name of the check the entry should match.
required     | true, unless `subscription` is provided
type         | String
example      | {{< highlight shell >}}"check": "haproxy_status"{{< /highlight >}}

fieldSelector | 
-------------|------ 
description  | Name of the check the entry should match.
required     | true, unless `subscription` is provided
type         | String
example      | {{< highlight shell >}}"check": "haproxy_status"{{< /highlight >}}

labelSelector | 
-------------|------ 
description  | Name of the subscription the entry should match.
required     | true, unless `check` is provided
type         | String
example      | {{< highlight shell >}}"subscription": "entity:i-424242"{{</highlight>}}

silenced     | 
-------------|------ 
description  | Time at which silence entry goes into effect. In epoch. 
required     | false 
type         | Integer 
example      | {{< highlight shell >}}"begin": 1512512023{{< /highlight >}}

status       | 
-------------|------ 
description  | Number of seconds until the entry should be deleted. 
required     | false 
type         | Integer 
default      | -1
example      | {{< highlight shell >}}"expire": 3600{{< /highlight >}}

resource     | 
-------------|------ 
description  | Explanation of the reason for creating the entry.
required     | false 
type         | String 
default      | null 
example      | {{< highlight shell >}}"resource": "core.v2/Event"{{< /highlight >}}

## Examples

### Silence all checks on a specific entity

Suppose you want to silence any alerts on the Sensu entity `i-424242`.
To do this, use per-entity subscriptions:

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


[1]: ../../getting-started/enterprise/
[2]: ../../reference/rbac/#namespaced-resource-types
[3]: ../../dashboard/filtering/#save-a-filtered-search
[4]: ../../api/searches
[5]: #metadata-attributes
[6]: ../../sensuctl/reference#create-resources
[7]: #spec-attributes
[8]: ../rbac#namespaces
