---
title: "Searches"
reference_title: "Searches"
type: "reference"
description: "The saved searches feature in the Sensu web UI allows you to create, update, and delete saved searches. Read the reference doc to learn about saved searches in Sensu."
weight: 143
version: "5.19"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.19:
    parent: reference
---

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
example      | {{< code shell >}}"type": "Search"{{< /code >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For searches in this version of Sensu, the `api_version` should always be `searches/v1`.
required     | Required for search entry definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][6].
type         | String
example      | {{< code shell >}}"api_version": "searches/v1"{{< /code >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the search that includes `name` and `namespace`. The `metadata` map is always at the top level of the search definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. See [metadata attributes][5] for details.
required     | Required for search entry definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][6].
type         | Map of key-value pairs
example      | {{< code shell >}}
"metadata": {
  "name": "us-west-server-incidents",
  "namespace": "default"
}
{{< /code >}}

spec         | 
-------------|------
description  | Top-level map that includes the search [spec attributes][7]. The spec contents will depend on the search parameters you apply and save.
required     | Required for silences in `wrapped-json` or `yaml` format for use with [`sensuctl create`][6].
type         | Map of key-value pairs
example      | {{< code shell >}}
"spec": {
  "parameters": [
    "entity:server-testing",
    "check:server-health",
    "status:incident",
    "labelSelector:region == \"us-west-1\""
  ],
  "resource": "core.v2/Event"
}
{{< /code >}}

### Metadata attributes

| name       |      |
-------------|------ 
description  | Search identifier generated from the combination of a subscription name and check name.
required     | true
type         | String
example      | {{< code shell >}}"name": "us-west-server-incidents"{{< /code >}}

| namespace  |      |
-------------|------
description  | Sensu [RBAC namespace][8] that the search belongs to.
required     | false
type         | String
default      | `default`
example      | {{< code shell >}}"namespace": "default"{{< /code >}}

### Spec attributes

parameters   | 
-------------|------ 
description  | Parameters the search will apply.
required     | true
type         | Array
example      | {{< code shell >}}
"parameters": [
  "entity:server-testing",
  "check:server-health",
  "status:incident",
  "labelSelector:region == \"us-west-1\""
]{{< /code >}}

resource     | 
-------------|------ 
description  | Fully qualified name of the resource included in the search.
required     | true
type         | String
example      | {{< code shell >}}"resource": "core.v2/Event"{{< /code >}}

#### Parameters

action       | 
-------------|------ 
description  | For filter searches, the type of filter to include in the search: `allow` or `deny`.
required     | false
type         | String
example      | {{< code shell >}}"action:allow"{{< /code >}}

check        | 
-------------|------ 
description  | Name of the check to include in the search.
required     | false
type         | String
example      | {{< code shell >}}"check:server-health"{{< /code >}}

class        | 
-------------|------ 
description  | For entity searches, the entity class to include in the search: `agent` or `proxy`.
required     | false
type         | String
example      | {{< code shell >}}"class:agent"{{< /code >}}

entity       | 
-------------|------ 
description  | Name of the entity to include in the search.
required     | false
type         | String
example      | {{< code shell >}}"entity:server-testing"{{< /code >}}

event        | 
-------------|------ 
description  | Name of the event to include in the search.
required     | false
type         | String
example      | {{< code shell >}}"event:server-testing"{{< /code >}}

fieldSelector | 
-------------|------ 
description  | [Field selector][9] to include in the search.
required     | false
type         | Filter statement
example      | {{< code shell >}}"fieldSelector: entity.name == \"1b04994n\""{{< /code >}}

labelSelector | 
-------------|------ 
description  | [Label selector][10] to include in the search.
required     | false
type         | Filter statement
example      | {{< code shell >}}"labelSelector:region == \"us-west-1\""{{< /code >}}

published    | 
-------------|------ 
description  | If `true`, the search will include only published resources. Otherwise, `false`. 
required     | false
type         | Boolean
example      | {{< code shell >}}"published:true"{{< /code >}}

silenced     | 
-------------|------ 
description  | If `true`, the search will include only silenced events. Otherwise, `false`. 
required     | false
type         | Boolean
example      | {{< code shell >}}"silenced:true"{{< /code >}}

status       | 
-------------|------ 
description  | Status of the events, entities, or resources to include in the search.
required     | false
type         | String
example      | {{< code shell >}}"status:incident"{{< /code >}}

subscription | 
-------------|------ 
description  | Name of the subscription to include in the search. 
required     | false
type         | String
example      | {{< code shell >}}"subscription:web"{{< /code >}}

type         | 
-------------|------ 
description  | For handler searches, the type of hander to include in the search: `pipe`, `set`, `tcp`, or `udp`.
required     | false
type         | String
example      | {{< code shell >}}"type:pipe"{{< /code >}}

## Examples

### Search for events with any status except passing

The following saved search will retrieve all events that have any status except `passing`:

{{< language-toggle >}}

{{< code yml >}}
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
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

### Search for published checks with a specific subscription and region

The following saved search will retrieve all published checks for the `us-west-1` region with the `linux` subscription:

{{< language-toggle >}}

{{< code yml >}}
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
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}


[1]: ../../commercial/
[2]: ../rbac/#namespaced-resource-types
[3]: ../../web-ui/filter/#save-a-filtered-search
[4]: ../../api/searches
[5]: #metadata-attributes
[6]: ../../sensuctl/create-manage-resources/#create-resources
[7]: #spec-attributes
[8]: ../rbac#namespaces
[9]: ../../api/#field-selector
[10]: ../../api/#label-selector
