---
title: "Components reference"
linkTitle: "Components Reference"
reference_title: "Components"
type: "reference"
description: "Sensu's components."
weight: 20
version: "6.3"
product: "Sensu Go"
menu: 
  sensu-go-6.3:
    parent: manage-business-services
---

**COMMERCIAL FEATURE**: Access business service management, including components, in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][9].

Each business service entity consists of a number of underlying business service components.
Business service components are resources for defining and managing elements of a business service.
A component is a meaningful selection of Sensu events for a business service, such as database monitoring events.

A component includes event selectors to define the events that the component includes, a component scheduler (either an interval or cron expression), and references to at least one monitoring rule template with arguments.
The monitoring rules are evaluated against aggregate data derived from the component's selection of events.
Monitoring rules are configured in a separate resource: [rule templates][8].

## Component scheduling

Sensu executes components on sensu-backend processes in a round-robin fashion and according to a schedule specified by an interval or a cron expression in the component definition.
During each execution of the component, Sensu retrieves the events identified in the component's query expression and processes these events according to the monitoring rules specified in the component definition.
The rules can emit new events based on the component input.

## Component example

The example component below is a dependency of the `account-manager` and `tessen` business services.
Sensu will execute the component at 60-second intervals for entities that include labels `region` with the value `us-west-2` **and** `cmpt` with the value `psql`.
The monitoring rule template for the component is `status-threshold`.

{{< language-toggle >}}

{{< code yml >}}
---
type: Component
api_version: bsm/v1
metadata:
  name: postgresql-component
  namespace: default
  created_by: admin
spec:
  services:
    - account-manager
    - tessen
  interval: 60
  cron: ""
  query:
    - type: labelSelector
      value: region == us-west-2 && cmpt == psql
  rules:
    - template: status-threshold
      arguments:
        status: non-zero
        threshold: 25
  handlers:
    - pagerduty
    - slack
{{< /code >}}

{{< code json >}}
{
  "type": "Component",
  "api_version": "bsm/v1",
  "metadata": {
    "name": "postgresql-component",
    "namespace": "default",
    "created_by": "admin"
  },
  "spec": {
    "services": [
      "account-manager",
      "tessen"
    ],
    "interval": 60,
    "cron": "",
    "query": [
      {
        "type": "labelSelector",
        "value": "region == us-west-2 && cmpt == psql"
      }
    ],
    "rules": [
      {
        "template": "status-threshold",
        "arguments": {
          "status": "non-zero",
          "threshold": 25
        }
      }
    ],
    "handlers": [
      "pagerduty",
      "slack"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Component specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the resource type. For component configuration, the type should always be `Component`.
required     | Required for component configuration in `wrapped-json` or `yaml` format.
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: Component
{{< /code >}}
{{< code json >}}
{
  "type": "Component"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For component configuration in this version of Sensu, the api_version should always be `bsm/v1`.
required     | Required for component configuration in `wrapped-json` or `yaml` format.
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: bsm/v1
{{< /code >}}
{{< code json >}}
{
  "api_version": "bsm/v1"
}
{{< /code >}}
{{< /language-toggle >}}

metadata     |      |
-------------|------
description  | Top-level scope that contains the component's `name` and `namespace` as well as the `created_by` field.
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: postgresql-component
  namespace: default
  created_by: admin
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "name": "postgresql-component",
    "namespace": "default",
    "created_by": "admin"
  }
}
{{< /code >}}
{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes the component configuration [spec attributes][6].
required     | Required for component configuration in `wrapped-json` or `yaml` format.
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  services:
    - account-manager
    - tessen
  interval: 60
  cron: ""
  query:
    - type: labelSelector
      value: region == us-west-2 && cmpt == psql
  rules:
    - template: status-threshold
      arguments:
        status: non-zero
        threshold: 25
  handlers:
    - pagerduty
    - slack
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "services": [
      "account-manager",
      "tessen"
    ],
    "interval": 60,
    "cron": "",
    "query": [
      {
        "type": "labelSelector",
        "value": "region == us-west-2 && cmpt == psql"
      }
    ],
    "rules": [
      {
        "template": "status-threshold",
        "arguments": {
          "status": "non-zero",
          "threshold": 25
        }
      }
    ],
    "handlers": [
      "pagerduty",
      "slack"
    ]
  }
}
{{< /code >}}
{{< /language-toggle >}}

### Metadata attributes

name         |      |
-------------|------
description  | Name for the component that is used internally by Sensu.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: postgresql-component
{{< /code >}}
{{< code json >}}
{
  "name": "postgresql-component"
}
{{< /code >}}
{{< /language-toggle >}}

namespace    |      |
-------------|------
description  | [Sensu RBAC namespace][7] that the component belongs to.
required     | true
type         | String
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

| created_by |      |
-------------|------
description  | Username of the Sensu user who created the component or last updated the component. Sensu automatically populates the `created_by` field when the component is created or updated.
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

### Spec attributes

services     | 
-------------|------ 
description  | List of business service entities that include the component as a dependency.
required     | true
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
services:
  - account-manager
  - tessen
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "services": [
      "account-manager",
      "tessen"
    ]
  }
}
{{< /code >}}
{{< /language-toggle >}}

interval     | 
-------------|------ 
description  | How often the component should be executed. In seconds. Each component must have a value for either the `interval` or the `cron` attribute, but not both.
required     | true (unless `cron` is configured)
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
interval: 60
{{< /code >}}
{{< code json >}}
{
  "interval": 60
}
{{< /code >}}
{{< /language-toggle >}}

cron         | 
-------------|------
description  | When the component should be executed, using [cron syntax][1] or [these predefined schedules][2]. Use a prefix of `TZ=` or `CRON_TZ=` to set a [timezone][3] for the cron attribute. {{% notice note %}}
**NOTE**: If you're using YAML to create a component that uses cron scheduling and the first character of the cron schedule is an asterisk (`*`), place the entire cron schedule inside single or double quotes (e.g. `cron: '* * * * *'`).
{{% /notice %}}
required     | true (unless `interval` is configured)
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
cron: 0 0 * * *
{{< /code >}}
{{< code json >}}
{
  "cron": "0 0 * * *"
}
{{< /code >}}
{{< /language-toggle >}}

query        | 
-------------|------ 
description  | Query expression that describes the events that each monitoring rule should process for the component.
required     | true
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
query:
  - type: labelSelector
    value: region == us-west-2 && cmpt == psql
{{< /code >}}
{{< code json >}}
{
  "query": [
    {
      "type": "labelSelector",
      "value": "region == us-west-2 && cmpt == psql"
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

rules        | 
-------------|------ 
description  | List of the [rule templates and arguments][4] that Sensu should apply for the component. Sensu evaluates each rule separately, and each rule produces its own event as output.
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
rules:
  - template: status-threshold
    arguments:
      status: non-zero
      threshold: 25
{{< /code >}}
{{< code json >}}
{
  "rules": [
    {
      "template": "status-threshold",
      "arguments": {
        "status": "non-zero",
        "threshold": 25
      }
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

handlers     | 
-------------|------ 
description  | List of handlers to use for the events the component produces. The component will set the handlers property in events that are produced by rule evaluation. If no handlers are specified in the component definition, handlers can be set by the monitoring rule itself via template arguments. Handlers specified in the component definition will override any handlers set by rule evaluation.
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
handlers:
  - pagerduty
  - slack
{{< /code >}}
{{< code json >}}
{
  "handlers": [
    "pagerduty",
    "slack"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

#### Query attributes

type         | 
-------------|------ 
description  | Type of selector to use to identify the events that the monitoring rule should process: `fieldSelector` or `labelSelector`.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: labelSelector
{{< /code >}}
{{< code json >}}
{
  "type": "labelSelector"
}
{{< /code >}}
{{< /language-toggle >}}

value        | 
-------------|------ 
description  | Selector expression the query will use to identify the events that the monitoring rule should process.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
value: region == us-west-2 && cmpt == psql
{{< /code >}}
{{< code json >}}
{
  "value": "region == us-west-2 && cmpt == psql"
}
{{< /code >}}
{{< /language-toggle >}}

#### Rules attributes

template     | 
-------------|------ 
description  | Name of the [rule template][8] the component should use .
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
template: status-threshold
{{< /code >}}
{{< code json >}}
{
  "template": "status-threshold"
}
{{< /code >}}
{{< /language-toggle >}}

arguments    | 
-------------|------ 
description  | The [arguments][5] to pass to the [rule template][8] for the component.
required     | false
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
arguments:
  status: non-zero
  threshold: 25
{{< /code >}}
{{< code json >}}
{
  "arguments": {
    "status": "non-zero",
    "threshold": 25
  }
}
{{< /code >}}
{{< /language-toggle >}}

##### Arguments attributes

status       | 
-------------|------ 
description  | ...
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
status: non-zero
{{< /code >}}
{{< code json >}}
{
  "status": "non-zero"
}
{{< /code >}}
{{< /language-toggle >}}

threshold    | 
-------------|------ 
description  | ...
required     | true
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
threshold: 25
{{< /code >}}
{{< code json >}}
{
  "threshold": 25
}
{{< /code >}}
{{< /language-toggle >}}


[1]: https://en.wikipedia.org/wiki/Cron#CRON_expression
[2]: https://godoc.org/github.com/robfig/cron#hdr-Predefined_schedules
[3]: https://en.wikipedia.org/wiki/Cron#Timezone_handling
[4]: #rules-attributes
[5]: #arguments-attributes
[6]: #spec-attributes
[7]: ../../control-access/rbac/#namespaces
[8]: ../rule-templates/
[9]: ../../../commercial/
