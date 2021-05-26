---
title: "Searches"
reference_title: "Searches"
type: "reference"
description: "The saved searches feature in the Sensu web UI allows you to create, update, and delete saved searches. Read the reference doc to learn about saved searches in Sensu."
weight: 143
version: "5.21"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.21:
    parent: reference
---

**COMMERCIAL FEATURE**: Access saved searches in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][1].

With the saved searches feature, you can apply search parameters to your entities, events, and resources and save them to etcd in a [namespaced resource][2] named `searches`.

The saved searches feature is designed to be used directly in the [web UI][3].
However, you can create, retrieve, update, and delete saved searches with the [searches API][4].

## Search for events with any status except passing

The following saved search will retrieve all events that have any status except `passing`:

{{< language-toggle >}}

{{< code yml >}}
---
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

## Search for published checks with a specific subscription and region

The following saved search will retrieve all published checks for the `us-west-1` region with the `linux` subscription:

{{< language-toggle >}}

{{< code yml >}}
---
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

## Searches specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][6] resource type. Searches should always be type `Search`.
required     | Required for search entry definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][6].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: Search
{{< /code >}}
{{< code json >}}
{
  "type": "Search"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For searches in this version of Sensu, the `api_version` should always be `searches/v1`.
required     | Required for search entry definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][6].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: searches/v1
{{< /code >}}
{{< code json >}}
{
  "api_version": "searches/v1"
}
{{< /code >}}
{{< /language-toggle >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the search that includes `name` and `namespace`. The `metadata` map is always at the top level of the search definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. See [metadata attributes][5] for details.
required     | Required for search entry definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][6].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: us-west-server-incidents
  namespace: default
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "name": "us-west-server-incidents",
    "namespace": "default"
  }
}
{{< /code >}}
{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes the search [spec attributes][7]. The spec contents will depend on the search parameters you apply and save.
required     | Required for silences in `wrapped-json` or `yaml` format for use with [`sensuctl create`][6].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  parameters:
  - entity:server-testing
  - check:server-health
  - status:incident
  - labelSelector:region == "us-west-1"
  resource: core.v2/Event
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "parameters": [
      "entity:server-testing",
      "check:server-health",
      "status:incident",
      "labelSelector:region == \"us-west-1\""
    ],
    "resource": "core.v2/Event"
  }
}
{{< /code >}}
{{< /language-toggle >}}

### Metadata attributes

| name       |      |
-------------|------ 
description  | Search identifier generated from the combination of a subscription name and check name.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: us-west-server-incidents
{{< /code >}}
{{< code json >}}
{
  "name": "us-west-server-incidents"
}
{{< /code >}}
{{< /language-toggle >}}

| namespace  |      |
-------------|------
description  | Sensu [RBAC namespace][8] that the search belongs to.
required     | false
type         | String
default      | `default`
example      | {{< language-toggle >}}
{{< code yml >}}
namespace: default
{{< /code >}}
{{< code json >}}
{
  "namespace": "default"
}
{{< /code >}}
{{< /language-toggle >}}

### Spec attributes

parameters   | 
-------------|------ 
description  | Parameters the search will apply.
required     | true
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
parameters:
- entity:server-testing
- check:server-health
- status:incident
- labelSelector:region == "us-west-1"
{{< /code >}}
{{< code json >}}
{
  "parameters": [
    "entity:server-testing",
    "check:server-health",
    "status:incident",
    "labelSelector:region == \"us-west-1\""
  ]
}
{{< /code >}}
{{< /language-toggle >}}

resource     | 
-------------|------ 
description  | Fully qualified name of the resource included in the search.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
resource: core.v2/Event
{{< /code >}}
{{< code json >}}
{
  "resource": "core.v2/Event"
}
{{< /code >}}
{{< /language-toggle >}}

#### Parameters

action       | 
-------------|------ 
description  | For event filter searches, the type of filter to include in the search: `allow` or `deny`.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
parameters:
- action:allow
{{< /code >}}
{{< code json >}}
{
  "parameters": [
    "action:allow"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

check        | 
-------------|------ 
description  | Name of the check to include in the search.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
parameters:
- check:server-health
{{< /code >}}
{{< code json >}}
{
  "parameters": [
    "check:server-health"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

class        | 
-------------|------ 
description  | For entity searches, the entity class to include in the search: `agent` or `proxy`.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
parameters:
- class:agent
{{< /code >}}
{{< code json >}}
{
  "parameters": [
    "class:agent"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

entity       | 
-------------|------ 
description  | Name of the entity to include in the search.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
parameters:
- entity:server-testing
{{< /code >}}
{{< code json >}}
{
  "parameters": [
    "entity:server-testing"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

event        | 
-------------|------ 
description  | Name of the event to include in the search.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
parameters:
- event:server-testing
{{< /code >}}
{{< code json >}}
{
  "parameters": [
    "event:server-testing"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

fieldSelector | 
-------------|------ 
description  | [Field selector][9] to include in the search.
required     | false
type         | Filter statement
example      | {{< language-toggle >}}
{{< code yml >}}
parameters:
- fieldSelector:entity.name == "1b04994n"
{{< /code >}}
{{< code json >}}
{
  "parameters": [
    "fieldSelector:entity.name == \"1b04994n\""
  ]
}
{{< /code >}}
{{< /language-toggle >}}

labelSelector | 
-------------|------ 
description  | [Label selector][10] to include in the search.
required     | false
type         | Filter statement
example      | {{< language-toggle >}}
{{< code yml >}}
parameters:
- labelSelector:region == "us-west-1"
{{< /code >}}
{{< code json >}}
{
  "parameters": [
    "labelSelector:region == \"us-west-1\""
  ]
}
{{< /code >}}
{{< /language-toggle >}}

published    | 
-------------|------ 
description  | If `true`, the search will include only published resources. Otherwise, `false`. 
required     | false
type         | Boolean
example      | {{< language-toggle >}}
{{< code yml >}}
parameters:
- published:true
{{< /code >}}
{{< code json >}}
{
  "parameters": [
    "published:true"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

silenced     | 
-------------|------ 
description  | If `true`, the search will include only silenced events. Otherwise, `false`. 
required     | false
type         | Boolean
example      | {{< language-toggle >}}
{{< code yml >}}
parameters:
- silenced:true
{{< /code >}}
{{< code json >}}
{
  "parameters": [
    "silenced:true"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

status       | 
-------------|------ 
description  | Status of the events, entities, or resources to include in the search.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
parameters:
- status:incident
{{< /code >}}
{{< code json >}}
{
  "parameters": [
    "status:incident"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

subscription | 
-------------|------ 
description  | Name of the subscription to include in the search. 
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
parameters:
- subscription:web
{{< /code >}}
{{< code json >}}
{
  "parameters": [
    "subscription:web"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

type         | 
-------------|------ 
description  | For handler searches, the type of hander to include in the search: `pipe`, `set`, `tcp`, or `udp`.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
parameters:
- type:pipe
{{< /code >}}
{{< code json >}}
{
  "parameters": [
    "type:pipe"
  ]
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
[8]: ../namespaces/
[9]: ../../api/#field-selector
[10]: ../../api/#label-selector
