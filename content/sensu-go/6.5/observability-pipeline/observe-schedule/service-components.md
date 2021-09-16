---
title: "Service components reference"
linkTitle: "Service Components Reference"
reference_title: "Service components"
type: "reference"
description: "Service components are meaningful selections of Sensu events, like database monitoring events, that allow you to define and manage business service elements."
weight: 70
version: "6.5"
product: "Sensu Go"
menu: 
  sensu-go-6.5:
    parent: observe-schedule
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access business service monitoring (BSM), including service components, in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

{{% notice note %}}
**NOTE**: Business service monitoring (BSM) is in public preview and is subject to change. 
{{% /notice %}}

Service components are resources for defining and managing elements of a business service in business service monitoring.
A [service entity][10] consists of a number of underlying service components.
A service component is a meaningful selection of Sensu events for a business service, such as database monitoring events.

A service component includes event selectors to define the events that the component includes, a service component scheduler (either an interval or cron expression), and references to at least one monitoring rule template with arguments.
The monitoring rules are evaluated against aggregate data derived from the service component's selection of events.
Monitoring rules are configured in a separate resource: [rule templates][8].

If you delete a resource (for example, an entity, check, or event) that is part of one or more service components, Sensu will automatically remove the deleted resource from the service components.

## Service component example

The example service component below is a dependency of the business service entities `account-manager` and `tessen`.
Sensu will execute the component at 60-second intervals for `account-manager` and `tessen` service entities that include labels `region` with the value `us-west-2` **and** `cmpt` with the value `psql`.
The monitoring rule template for the service component is `status-threshold`.

{{< language-toggle >}}

{{< code yml >}}
---
type: ServiceComponent
api_version: bsm/v1
metadata:
  name: postgresql-1
  namespace: default
  created_by: admin
spec:
  cron: ''
  handlers:
  - pagerduty
  - slack
  interval: 60
  query:
  - type: labelSelector
    value: region == 'us-west-1' && cmpt == psql
  rules:
  - arguments:
      status: non-zero
      threshold: 25
    name: nonzero-25
    template: status-threshold
  services:
  - account-manager
  - tessen

{{< /code >}}

{{< code json >}}
{
  "type": "ServiceComponent",
  "api_version": "bsm/v1",
  "metadata": {
    "name": "postgresql-1",
    "namespace": "default",
    "created_by": "admin"
  },
  "spec": {
    "cron": "",
    "handlers": [
      "pagerduty",
      "slack"
    ],
    "interval": 60,
    "query": [
      {
        "type": "labelSelector",
        "value": "region == 'us-west-1' && cmpt == psql"
      }
    ],
    "rules": [
      {
        "arguments": {
          "status": "non-zero",
          "threshold": 25
        },
        "name": "nonzero-25",
        "template": "status-threshold"
      }
    ],
    "services": [
      "account-manager",
      "tessen"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Service component scheduling

Sensu executes service components on sensu-backend processes in a round-robin fashion and according to a schedule specified by an interval or a cron expression in the component definition.
During each execution of the service component, Sensu retrieves the events identified in the component's query expression and processes these events according to the monitoring rules specified in the service component definition.
The rules can emit new events based on the component input.

## Service component specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the resource type. For service component configuration, the type should always be `ServiceComponent`.
required     | Required for service component configuration in `wrapped-json` or `yaml` format.
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: ServiceComponent
{{< /code >}}
{{< code json >}}
{
  "type": "ServiceComponent"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For service component configuration in this version of Sensu, the api_version should always be `bsm/v1`.
required     | Required for service component configuration in `wrapped-json` or `yaml` format.
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
description  | Top-level scope that contains the service component's `name` and `namespace` as well as the `created_by` field.
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: postgresql-1
  namespace: default
  created_by: admin
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "name": "postgresql-1",
    "namespace": "default",
    "created_by": "admin"
  }
}
{{< /code >}}
{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes the service component configuration [spec attributes][6].
required     | Required for service component configuration in `wrapped-json` or `yaml` format.
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  cron: ''
  handlers:
  - pagerduty
  - slack
  interval: 60
  query:
  - type: labelSelector
    value: region == 'us-west-1' && cmpt == psql
  rules:
  - arguments:
      status: non-zero
      threshold: 25
    name: nonzero-25
    template: status-threshold
  services:
  - account-manager
  - tessen
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "cron": "",
    "handlers": [
      "pagerduty",
      "slack"
    ],
    "interval": 60,
    "query": [
      {
        "type": "labelSelector",
        "value": "region == 'us-west-1' && cmpt == psql"
      }
    ],
    "rules": [
      {
        "arguments": {
          "status": "non-zero",
          "threshold": 25
        },
        "name": "nonzero-25",
        "template": "status-threshold"
      }
    ],
    "services": [
      "account-manager",
      "tessen"
    ]
  }
}
{{< /code >}}
{{< /language-toggle >}}

### Metadata attributes

name         |      |
-------------|------
description  | Name for the service component that is used internally by Sensu.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: postgresql-1
{{< /code >}}
{{< code json >}}
{
  "name": "postgresql-1"
}
{{< /code >}}
{{< /language-toggle >}}

namespace    |      |
-------------|------
description  | [Sensu RBAC namespace][7] that the service component belongs to.
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
description  | Username of the Sensu user who created or last updated the service component. Sensu automatically populates the `created_by` field when the service component is created or updated.
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

cron         | 
-------------|------
description  | When the service component should be executed, using [cron syntax][1] or [these predefined schedules][2]. Use a prefix of `TZ=` or `CRON_TZ=` to set a [timezone][3] for the cron attribute. {{% notice note %}}
**NOTE**: If you're using YAML to create a service component that uses cron scheduling and the first character of the cron schedule is an asterisk (`*`), place the entire cron schedule inside single or double quotes (for example, `cron: '* * * * *'`).
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

handlers     | 
-------------|------ 
description  | List of handlers to use for the events the service component produces. The service component will set the handlers property in events that are produced by rule evaluation. If no handlers are specified in the service component definition, handlers can be set by the monitoring rule itself via template arguments. Handlers specified in the service component definition will override any handlers set by rule evaluation.
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

interval     | 
-------------|------ 
description  | How often the service component should be executed. In seconds. Each service component must have a value for either the `interval` or the `cron` attribute, but not both.
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

query        | 
-------------|------ 
description  | Query expression that describes the events that each monitoring rule should process for the service component.
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
description  | List of the [rule templates and arguments][4] that Sensu should apply for the service component. Sensu evaluates each rule separately, and each rule produces its own event as output.
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
rules:
- arguments:
    status: non-zero
    threshold: 25
  name: nonzero-25
  template: status-threshold
{{< /code >}}
{{< code json >}}
{
  "rules": [
    {
      "arguments": {
        "status": "non-zero",
        "threshold": 25
      },
      "name": "nonzero-25",
      "template": "status-threshold"
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

services     | 
-------------|------ 
description  | List of business [service entities][10] that include the service component as a dependency.
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

#### Query attributes

type         | 
-------------|------ 
description  | Type of selector to use to identify the events that the service component's monitoring rule should process: `fieldSelector` or `labelSelector`.
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
description  | Selector expression the query will use to identify the events that the service component's monitoring rule should process.
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

arguments    | 
-------------|------ 
description  | The arguments to pass to the [rule template][8] for the service component. Argument names and values will vary depending on the arguments configured in the specified rule template.
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

name         | 
-------------|------ 
description  | Explicit name to use for the rule-specific events generated for the service component. These names help keep events distinct when a service component includes different rules for the same [rule template][8].
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: nonzero-25
{{< /code >}}
{{< code json >}}
{
  "name": "nonzero-25"
}
{{< /code >}}
{{< /language-toggle >}}

template     | 
-------------|------ 
description  | Name of the [rule template][8] the service component should use.
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


[1]: https://en.wikipedia.org/wiki/Cron#CRON_expression
[2]: https://godoc.org/github.com/robfig/cron#hdr-Predefined_schedules
[3]: https://en.wikipedia.org/wiki/Cron#Timezone_handling
[4]: #rules-attributes
[6]: #spec-attributes
[7]: ../../../operations/control-access/namespaces
[8]: ../rule-templates/
[9]: ../../../commercial/
[10]: ../../observe-entities/#service-entities
