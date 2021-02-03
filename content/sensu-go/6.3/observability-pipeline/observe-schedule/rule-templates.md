---
title: "Rule templates reference"
linkTitle: "Rule Templates Reference"
reference_title: "Rule templates"
type: "reference"
description: "Sensu's rule templates are resources that Sensu applies to business service components. The rules define the conditions under which Sensu will consider a service component online, degraded, or offline. Read this reference to learn more about Sensu's rule templates for business service management."
weight: 70
version: "6.3"
product: "Sensu Go"
menu: 
  sensu-go-6.3:
    parent: observe-schedule
---

**COMMERCIAL FEATURE**: Access business service management, including rule templates, in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][4].

Rule templates are resources that Sensu applies to business service [components][3].
The rules define the conditions under which Sensu will consider a service component online, degraded, or offline.
Rules apply to aggregate data derived from a service component’s selection of Sensu Go events.

In rule templates, you configure the conditions for creating an event with an ECMAScript 5 (JavaScript) expression.
When you add rule templates by reference in your service component definitions, Sensu evaluate events according to the monitoring rules you configure in the rule template.
Monitoring rules create events when one or more thresholds are exceeded; for example, a threshold might be fewer than 70% of a service component's selected events have a check status of OK.

Components can reference more than one rule template.
Sensu evaluates each rule separately, and each rule produces its own event as output.

## Rule template example

This example rule template creates an event when the percentage of events with the given status exceed the given threshold:

{{< language-toggle >}}

{{< code yml >}}
---
type: RuleTemplate
api_version: bsm/v1
metadata:
  name: status-threshold
  namespace: default
  created_by: admin
spec:
  description: Creates an event when the percentage of events with the given status exceed the given threshold
  arguments:
    required:
      - threshold
    properties:
      status:
        type: string
        default: non-zero
        enum:
          - non-zero
          - warning
          - critical
          - unknown
      threshold:
        type: number
        description: Numeric value that triggers an event when surpassed
  eval: |
    var statusMap = {
      "non-zero": 1,
      "warning": 1,
      "critical": 2,
    };
    function main(args) {
      var total = sensu.events.count();
      var num = sensu.events.count(args.status);
      if (num / total <= args.threshold) {
        return;
      }
      return sensu.new_event({
        status: statusMap[args.status],
        /* ... */,
      });
    }
{{< /code >}}

{{< code json >}}
{
  "type": "RuleTemplate",
  "api_version": "bsm/v1",
  "metadata": {
    "name": "status-threshold",
    "namespace": "default",
    "created_by": "admin"
  },
  "spec": {
    "description": "Creates an event when the percentage of events with the given status exceed the given threshold",
    "arguments": {
      "required": [
        "threshold"
      ],
      "properties": {
        "status": {
          "type": "string",
          "default": "non-zero",
          "enum": [
            "non-zero",
            "warning",
            "critical",
            "unknown"
          ]
        },
        "threshold": {
          "type": "number",
          "description": "Numeric value that triggers an event when surpassed"
        }
      }
    },
    "eval": "var statusMap = {\n  \"non-zero\": 1,\n  \"warning\": 1,\n  \"critical\": 2,\n};\nfunction main(args) {\n  var total = sensu.events.count();\n  var num = sensu.events.count(args.status);\n  if (num / total <= args.threshold) {\n    return;\n  }\n  return sensu.new_event({\n    status: statusMap[args.status],\n    /* ... */,\n  });\n}"
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Rule template specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the resource type. For rule template configuration, the type should always be `RuleTemplate`.
required     | Required for rule template configuration in `wrapped-json` or `yaml` format.
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: RuleTemplate
{{< /code >}}
{{< code json >}}
{
  "type": "RuleTemplate"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For rule template configuration in this version of Sensu, the api_version should always be `bsm/v1`.
required     | Required for rule template configuration in `wrapped-json` or `yaml` format.
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
description  | Top-level scope that contains the rule template's `name` and `namespace` as well as the `created_by` field.
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: status-threshold
  namespace: default
  created_by: admin
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "name": "status-threshold",
    "namespace": "default",
    "created_by": "admin"
  }
}
{{< /code >}}
{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes the rule template configuration [spec attributes][5].
required     | Required for rule template configuration in `wrapped-json` or `yaml` format.
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  description: Creates an event when the percentage of events with the given status exceed the given threshold
  arguments:
    required:
      - threshold
    properties:
      status:
        type: string
        default: non-zero
        enum:
          - non-zero
          - warning
          - critical
          - unknown
      threshold:
        type: number
        description: Numeric value that triggers an event when surpassed
  eval: |
    var statusMap = {
      "non-zero": 1,
      "warning": 1,
      "critical": 2,
    };
    function main(args) {
      var total = sensu.events.count();
      var num = sensu.events.count(args.status);
      if (num / total <= args.threshold) {
        return;
      }
      return sensu.new_event({
        status: statusMap[args.status],
        /* ... */,
      });
    }
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "description": "Creates an event when the percentage of events with the given status exceed the given threshold",
    "arguments": {
      "required": [
        "threshold"
      ],
      "properties": {
        "status": {
          "type": "string",
          "default": "non-zero",
          "enum": [
            "non-zero",
            "warning",
            "critical",
            "unknown"
          ]
        },
        "threshold": {
          "type": "number",
          "description": "Numeric value that triggers an event when surpassed"
        }
      }
    },
    "eval": "var statusMap = {\n  \"non-zero\": 1,\n  \"warning\": 1,\n  \"critical\": 2,\n};\nfunction main(args) {\n  var total = sensu.events.count();\n  var num = sensu.events.count(args.status);\n  if (num / total <= args.threshold) {\n    return;\n  }\n  return sensu.new_event({\n    status: statusMap[args.status],\n    /* ... */,\n  });\n}"
  }
}
{{< /code >}}
{{< /language-toggle >}}

### Metadata attributes

name         |      |
-------------|------
description  | Name for the rule template that is used internally by Sensu.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: status-threshold
{{< /code >}}
{{< code json >}}
{
  "name": "status-threshold"
}
{{< /code >}}
{{< /language-toggle >}}

namespace    |      |
-------------|------
description  | [Sensu RBAC namespace][6] that the rule template belongs to.
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
description  | Username of the Sensu user who created the rule template or last updated the rule template. Sensu automatically populates the `created_by` field when the rule template is created or updated.
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

description  | 
-------------|------ 
description  | Plain text description of the rule template's behavior.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
description: Creates an event when the percentage of events with the given status exceed the given threshold
{{< /code >}}
{{< code json >}}
{
  "description": "Creates an event when the percentage of events with the given status exceed the given threshold"
}
{{< /code >}}
{{< /language-toggle >}}

arguments    | 
-------------|------ 
description  | The rule template's arguments using [JSON Schema][1] properties.
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
arguments:
  required:
    - threshold
  properties:
    status:
      type: string
      default: non-zero
      enum:
        - non-zero
        - warning
        - critical
        - unknown
    threshold:
      type: number
      description: Numeric value that triggers an event when surpassed
{{< /code >}}
{{< code json >}}
{
  "arguments": {
    "required": [
      "threshold"
    ],
    "properties": {
      "status": {
        "type": "string",
        "default": "non-zero",
        "enum": [
          "non-zero",
          "warning",
          "critical",
          "unknown"
        ]
      },
      "threshold": {
        "type": "number",
        "description": "Numeric value that triggers an event when surpassed"
      }
    }
  }
}
{{< /code >}}
{{< /language-toggle >}}

eval         | 
-------------|------
description  | ECMAScript 5 (JavaScript) expression for the rule template to evaluate.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
eval: |
    var statusMap = {
      "non-zero": 1,
      "warning": 1,
      "critical": 2,
    };
    function main(args) {
      var total = sensu.events.count();
      var num = sensu.events.count(args.status);
      if (num / total <= args.threshold) {
        return;
      }
      return sensu.new_event({
        status: statusMap[args.status],
        /* ... */,
      });
    }
{{< /code >}}
{{< code json >}}
{
  "eval": "var statusMap = {\n  \"non-zero\": 1,\n  \"warning\": 1,\n  \"critical\": 2,\n};\nfunction main(args) {\n  var total = sensu.events.count();\n  var num = sensu.events.count(args.status);\n  if (num / total <= args.threshold) {\n    return;\n  }\n  return sensu.new_event({\n    status: statusMap[args.status],\n    /* ... */,\n  });\n}"
}
{{< /code >}}
{{< /language-toggle >}}

#### Arguments attributes

required     | 
-------------|------ 
description  | List of keys the rule template argument requires. The listed keys must be configured in the [properties][2] object.
required     | true
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
required:
  - threshold
{{< /code >}}
{{< code json >}}
{
  "required": [
    "threshold"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

<a name="rule-properties"></a>

properties   | 
-------------|------ 
description  | Lists of properties that define the rule template's behavior. In [JSON Schema][1].
required     | true
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
properties:
  status:
    type: string
    default: non-zero
    enum:
      - non-zero
      - warning
      - critical
      - unknown
    threshold:
      type: number
      description: Numeric value that triggers an event when surpassed
{{< /code >}}
{{< code json >}}
{
  "properties": {
    "status": {
      "type": "string",
      "default": "non-zero",
      "enum": [
        "non-zero",
        "warning",
        "critical",
        "unknown"
      ]
    },
    "threshold": {
      "type": "number",
      "description": "Numeric value that triggers an event when surpassed"
    }
  }
}
{{< /code >}}
{{< /language-toggle >}}


[1]: https://json-schema.org/
[2]: #rule-properties
[3]: ../components
[4]: ../../../commercial/
[5]: #spec-attributes
[6]: ../../control-access/rbac/#namespaces

