---
title: "Searches"
description: "The saved searches feature in the Sensu web UI allows you to create, update, and delete saved searches. Read the reference doc to learn about saved searches in Sensu."
weight: 143
version: "5.21"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.21:
    parent: reference
---

- [Searches specification](#searches-specification)
  - [Top-level attributes](#top-level-attributes) | [Metadata attributes](#metadata-attributes) | [Spec attributes](#spec-attributes)
- [Examples](#examples)
	- [Search for events with any status except passing](#search-for-events-with-any-status-except-passing)
  - [Search for published checks with a specific subscription and region ](#search-for-published-checks-with-a-specific-subscription-and-region)

**COMMERCIAL FEATURE**: Access saved searches in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][1].

With the saved searches feature, you can apply search parameters to your entities, events, and resources and save them to etcd in a [namespaced resource][2] named `searches`.

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
description  | Top-level collection of metadata about the search that includes `name` and `namespace`. The `metadata` map is always at the top level of the search definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. See [metadata attributes][5] for details.
required     | Required for search entry definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][6].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"metadata": {
  "name": "us-west-server-incidents",
  "namespace": "default"
}
{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes the search [spec attributes][7]. The spec contents will depend on the search parameters you apply and save.
required     | Required for silences in `wrapped-json` or `yaml` format for use with [`sensuctl create`][6].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"spec": {
  "parameters": [
    "entity:server-testing",
    "check:server-health",
    "status:incident",
    "labelSelector:region == \"us-west-1\""
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
example      | {{< highlight shell >}}"name": "us-west-server-incidents"{{< /highlight >}}

| namespace  |      |
-------------|------
description  | Sensu [RBAC namespace][8] that the search belongs to.
required     | false
type         | String
default      | `default`
example      | {{< highlight shell >}}"namespace": "default"{{< /highlight >}}

### Spec attributes

parameters   | 
-------------|------ 
description  | Parameters the search will apply.
required     | true
type         | Array
example      | {{< highlight shell >}}
"parameters": [
  "entity:server-testing",
  "check:server-health",
  "status:incident",
  "labelSelector:region == \"us-west-1\""
]{{< /highlight >}}

resource     | 
-------------|------ 
description  | Fully qualified name of the resource included in the search.
required     | true
type         | String
example      | {{< highlight shell >}}"resource": "core.v2/Event"{{< /highlight >}}

#### Parameters

action       | 
-------------|------ 
description  | For filter searches, the type of filter to include in the search: `allow` or `deny`.
required     | false
type         | String
example      | {{< highlight shell >}}"action:allow"{{< /highlight >}}

check        | 
-------------|------ 
description  | Name of the check to include in the search.
required     | false
type         | String
example      | {{< highlight shell >}}"check:server-health"{{< /highlight >}}

class        | 
-------------|------ 
description  | For entity searches, the entity class to include in the search: `agent` or `proxy`.
required     | false
type         | String
example      | {{< highlight shell >}}"class:agent"{{< /highlight >}}

entity       | 
-------------|------ 
description  | Name of the entity to include in the search.
required     | false
type         | String
example      | {{< highlight shell >}}"entity:server-testing"{{< /highlight >}}

event        | 
-------------|------ 
description  | Name of the event to include in the search.
required     | false
type         | String
example      | {{< highlight shell >}}"event:server-testing"{{< /highlight >}}

fieldSelector | 
-------------|------ 
description  | [Field selector][9] to include in the search.
required     | false
type         | Filter statement
example      | {{< highlight shell >}}"fieldSelector: entity.name == \"1b04994n\""{{< /highlight >}}

labelSelector | 
-------------|------ 
description  | [Label selector][10] to include in the search.
required     | false
type         | Filter statement
example      | {{< highlight shell >}}"labelSelector:region == \"us-west-1\""{{< /highlight >}}

published    | 
-------------|------ 
description  | If `true`, the search will include only published resources. Otherwise, `false`. 
required     | false
type         | Boolean
example      | {{< highlight shell >}}"published:true"{{< /highlight >}}

silenced     | 
-------------|------ 
description  | If `true`, the search will include only silenced events. Otherwise, `false`. 
required     | false
type         | Boolean
example      | {{< highlight shell >}}"silenced:true"{{< /highlight >}}

status       | 
-------------|------ 
description  | Status of the events, entities, or resources to include in the search.
required     | false
type         | String
example      | {{< highlight shell >}}"status:incident"{{< /highlight >}}

subscription | 
-------------|------ 
description  | Name of the subscription to include in the search. 
required     | false
type         | String
example      | {{< highlight shell >}}"subscription:web"{{< /highlight >}}

type         | 
-------------|------ 
description  | For handler searches, the type of hander to include in the search: `pipe`, `set`, `tcp`, or `udp`.
required     | false
type         | String
example      | {{< highlight shell >}}"type:pipe"{{< /highlight >}}

## Examples

### Search for events with any status except passing

The following saved search will retrieve all events that have any status except `passing`:

{{< language-toggle >}}

{{< highlight yml >}}
type: Search
api_version: searches/v1
metadata:
  name: events-not-passing
  namespace: default
spec:
  parameters:
  - status:incident
  - status:warning
  - status:critical
  - status:unknown
  resource: core.v2/Event
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Search",
  "api_version": "searches/v1",
  "metadata": {
    "name": "events-not-passing",
    "namespace": "default"
  },
  "spec": {
    "parameters": [
      "status:incident",
      "status:warning",
      "status:critical",
      "status:unknown"
    ],
    "resource": "core.v2/Event"
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

### Search for published checks with a specific subscription and region

The following saved search will retrieve all published checks for the `us-west-1` region with the `linux` subscription:

{{< language-toggle >}}

{{< highlight yml >}}
type: Search
api_version: searches/v1
metadata:
  name: published-checks-linux-uswest
  namespace: default
spec:
  parameters:
  - published:true
  - subscription:linux
  - 'labelSelector: region == "us-west-1"'
  resource: core.v2/CheckConfig
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Search",
  "api_version": "searches/v1",
  "metadata": {
    "name": "published-checks-linux-uswest",
    "namespace": "default"
  },
  "spec": {
    "parameters": [
      "published:true",
      "subscription:linux",
      "labelSelector: region == \"us-west-1\""
    ],
    "resource": "core.v2/CheckConfig"
  }
}
{{< /highlight >}}

{{< /language-toggle >}}


[1]: ../../commercial/
[2]: ../../reference/rbac/#namespaced-resource-types
[3]: ../../dashboard/filtering/#save-a-filtered-search
[4]: ../../api/searches
[5]: #metadata-attributes
[6]: ../../sensuctl/reference#create-resources
[7]: #spec-attributes
[8]: ../rbac#namespaces
[9]: ../../api/overview/#field-selector
[10]: ../../api/overview/#label-selector
