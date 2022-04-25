---
title: "Service components reference"
linkTitle: "Service Components Reference"
reference_title: "Service components"
type: "reference"
description: "Service components are meaningful selections of Sensu events, like database monitoring events, that allow you to define and manage business service elements."
weight: 80
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

The example service component below is a dependency of the business service entity `business-services`.
Sensu will execute the component at 60-second intervals for `business-services` service entities whose events include the `webserver` subscription.
The monitoring rule template for the service component is `aggregate`.

{{< language-toggle >}}

{{< code yml >}}
---
type: ServiceComponent
api_version: bsm/v1
metadata:
  name: webservers
spec:
  handlers:
  - slack
  interval: 60
  query:
  - type: fieldSelector
    value: webserver in event.check.subscriptions
  rules:
  - arguments:
      critical_threshold: 70
      warning_threshold: 50
    name: webservers_50-70
    template: aggregate
  services:
  - business-services
{{< /code >}}

{{< code json >}}
{
  "type": "ServiceComponent",
  "api_version": "bsm/v1",
  "metadata": {
    "name": "webservers"
  },
  "spec": {
    "handlers": [
      "slack"
    ],
    "interval": 60,
    "query": [
      {
        "type": "fieldSelector",
        "value": "webserver in event.check.subscriptions"
      }
    ],
    "rules": [
      {
        "arguments": {
          "critical_threshold": 70,
          "warning_threshold": 50
        },
        "name": "webservers_50-70",
        "template": "aggregate"
      }
    ],
    "services": [
      "business-services"
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
description  | Top-level collection of information about the service component, including `name`, `namespace`, and `created_by` as well as custom `labels` and `annotations`.
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: webservers
  namespace: default
  created_by: admin
  labels:
    region: us-west-1
  annotations:
    managed_by: ops
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "name": "webservers",
    "namespace": "default",
    "created_by": "admin",
    "labels": {
      "region": "us-west-1"
    },
    "annotations": {
      "managed_by": "ops"
    }
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
  handlers:
  - slack
  interval: 60
  query:
  - type: fieldSelector
    value: webserver in event.check.subscriptions
  rules:
  - arguments:
      critical_threshold: 70
      warning_threshold: 50
    name: webservers_50-70
    template: aggregate
  services:
  - business-services
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "handlers": [
      "slack"
    ],
    "interval": 60,
    "query": [
      {
        "type": "fieldSelector",
        "value": "webserver in event.check.subscriptions"
      }
    ],
    "rules": [
      {
        "arguments": {
          "critical_threshold": 70,
          "warning_threshold": 50
        },
        "name": "webservers_50-70",
        "template": "aggregate"
      }
    ],
    "services": [
      "business-services"
    ]
  }
}
{{< /code >}}
{{< /language-toggle >}}

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

### Metadata attributes

| annotations |     |
-------------|------
description  | Non-identifying metadata to include with observation event data that you can access with [event filters][11]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][14], [sensuctl response filtering][15], or [web UI views][13].
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
annotations:
  managed-by: ops
{{< /code >}}
{{< code json >}}
{
  "annotations": {
    "managed-by": "ops"
  }
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

| labels     |      |
-------------|------
description  | Custom attributes to include with observation event data that you can use for response and web UI view filtering.<br><br>If you include labels in your event data, you can filter [API responses][14], [sensuctl responses][15], and [web UI views][12] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
labels:
  region: us-west-1
{{< /code >}}
{{< code json >}}
{
  "labels": {
    "region": "us-west-1"
  }
}
{{< /code >}}
{{< /language-toggle >}}

name         |      |
-------------|------
description  | Name for the service component that is used internally by Sensu.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: webservers
{{< /code >}}
{{< code json >}}
{
  "name": "webservers"
}
{{< /code >}}
{{< /language-toggle >}}

namespace    |      |
-------------|------
description  | [Sensu RBAC namespace][7] that the service component belongs to.
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

### Spec attributes

cron         | 
-------------|------
description  | When the service component should be executed, using [cron syntax][1] or a [predefined schedule][2]. Use a prefix of `TZ=` or `CRON_TZ=` to set a [timezone][3] for the cron attribute. {{% notice note %}}
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
  - slack
{{< /code >}}
{{< code json >}}
{
  "handlers": [
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
description  | Query expression that describes the events that each monitoring rule should process for the service component. Read [query attributes][16] for details.
required     | true
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
query:
  - type: fieldSelector
    value: webserver in event.check.subscriptions
{{< /code >}}
{{< code json >}}
{
  "query": [
    {
      "type": "fieldSelector",
      "value": "webserver in event.check.subscriptions"
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

rules        | 
-------------|------ 
description  | List of the rule templates and arguments that Sensu should apply for the service component. Sensu evaluates each rule separately, and each rule produces its own event as output. Read [rules attributes][4] for details.
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
rules:
- arguments:
    critical_threshold: 70
    warning_threshold: 50
  name: webservers_50-70
  template: aggregate
{{< /code >}}
{{< code json >}}
{
  "rules": [
    {
      "arguments": {
        "critical_threshold": 70,
        "warning_threshold": 50
      },
      "name": "webservers_50-70",
      "template": "aggregate"
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
  - business-services
{{< /code >}}
{{< code json >}}
{
  "services": [
    "business-services"
  ]
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
type: fieldSelector
{{< /code >}}
{{< code json >}}
{
  "type": "fieldSelector"
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
value: webserver in event.check.subscriptions
{{< /code >}}
{{< code json >}}
{
  "value": "webserver in event.check.subscriptions"
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
- arguments:
    critical_threshold: 70
    warning_threshold: 50
{{< /code >}}
{{< code json >}}
{
  "arguments": {
    "critical_threshold": 70,
    "warning_threshold": 50
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
name: webservers_50-70
{{< /code >}}
{{< code json >}}
{
  "name": "webservers_50-70"
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
template: aggregate
{{< /code >}}
{{< code json >}}
{
  "template": "aggregate"
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
[11]: ../../observe-filter/filters/
[12]: ../../../web-ui/search#search-for-labels
[13]: ../../../web-ui/search/
[14]: ../../../api/#response-filtering
[15]: ../../../sensuctl/filter-responses/
[16]: #query-attributes
