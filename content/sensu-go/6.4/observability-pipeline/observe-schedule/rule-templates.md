---
title: "Rule templates reference"
linkTitle: "Rule Templates Reference"
reference_title: "Rule templates"
type: "reference"
description: "Rule templates define the conditions under which Sensu will consider a service component online, degraded, or offline for business service monitoring."
weight: 60
version: "6.4"
product: "Sensu Go"
menu: 
  sensu-go-6.4:
    parent: observe-schedule
---

{{% notice note %}}
**NOTE**: Business service monitoring is in public preview and is subject to change. 
{{% /notice %}}

**COMMERCIAL FEATURE**: Access business service monitoring (BSM), including rule templates, in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][4].

Rule templates are the resources that Sensu applies to [service components][3] for business service monitoring.
A rule template applies to selections of events defined by a service component's query.
This selection of events is the rule's input.

The rule template evaluates the selection of events using an ECMAScript 5 (JavaScript) expression specified in the rule template's `eval` object and emits a single event based on this evaluation.
For example, a rule template's expression might define the thresholds at which Sensu will consider a service component online, degraded, or offline:

- Online until fewer than 70% of the service component's events have a check status of OK.
- Degraded while 50-69% of the service component's events have a check status of OK.
- Offline when fewer than 50% of the service component's events have a check status of OK.

The rule template expression can also create arbitrary events.

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
      return event.status = statusMap[args.status],
      });
    }
{{< /code >}}

{{< code json >}}
{
  "type": "RuleTemplate",
  "api_version": "bsm/v1",
  "metadata": {
    "name": "status-threshold",
    "namespace": "default"
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
    "eval": "var statusMap = {\n  \"non-zero\": 1,\n  \"warning\": 1,\n  \"critical\": 2,\n};\nfunction main(args) {\n  var total = sensu.events.count();\n  var num = sensu.events.count(args.status);\n  if (num / total <= args.threshold) {\n    return;\n  }\n  return event.status = statusMap[args.status],\n  });\n}"
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Apply rule templates to service components

Rule templates are general, parameterized resources that can apply to one or more service components.
To apply a rule template to a specific service component:

- List the rule template name in the service component's `rules.template` field.
- Specify the arguments the rule template requires in the service component's `rules.template.arguments` object.

Several service components can use the same rule template with different argument values.
For example, a rule template might evaluate one argument, `threshold_ok`, against the number of events with OK status, as represented by the following logic:

{{< code javascript >}}
if numberEventsOK < threshold_ok {
  emit warning event
}
{{< /code >}}

You can specify a variety of thresholds as arguments in service component definitions that reference this rule template.
One service component might set a `threshold_ok` value at 10; another service component might set the value at 50.
Both service components can make use of the same rule template at the threshold that makes sense for that component.

Service components can reference more than one rule template.
Sensu evaluates each rule separately, and each rule produces its own event as output.

## Built-in rule template: Aggregate

Sensu's business service monitoring (BSM) includes a built-in rule template, `aggregate`, that allows you to treat the results of multiple disparate check executions executed across multiple disparate systems as a single result (event).
This built-in rule template is ready to use with your service components.

Reference the rule template name in the `rules.template` field and configure the arguments in the `rules.template.arguments` object in your service component resource definitions.

Use the `aggregate` rule template for services that can be considered healthy as long as a minimum threshold is satisfied.
For example, you might set the minimum threshold at 10 web servers with an OK status or 70% of processes running with an OK status.

The `aggregate` rule template is useful in dynamic environments and environments with some tolerance for failure.

To review the `aggregate` resource definition, retrive it with a GET request to the BSM API:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/bsm/v1/namespaces/default/rule-templates/aggregate \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The response will include the complete `aggregate` rule template resource definition:

{{< code json >}}
{
  "type": "RuleTemplate",
  "api_version": "bsm/v1",
  "metadata": {
    "name": "aggregate",
    "namespace": "default"
  },
  "spec": {
    "arguments": {
      "properties": {
        "critical_count": {
          "description": "create an event with a critical status if there the number of critical events is equal to or greater than this count",
          "type": "number"
        },
        "critical_threshold": {
          "description": "create an event with a critical status if the percentage of non-zero events is equal to or greater than this threshold",
          "type": "number"
        },
        "metric_handlers": {
          "default": {},
          "description": "metric handlers to use for produced metrics",
          "items": {
            "type": "string"
          },
          "type": "array"
        },
        "produce_metrics": {
          "default": {},
          "description": "produce metrics from aggregate data and include them in the produced event",
          "type": "boolean"
        },
        "set_metric_annotations": {
          "default": {},
          "description": "annotate the produced event with metric annotations",
          "type": "boolean"
        },
        "warning_count": {
          "description": "create an event with a warning status if there the number of critical events is equal to or greater than this count",
          "type": "number"
        },
        "warning_threshold": {
          "description": "create an event with a warning status if the percentage of non-zero events is equal to or greater than this threshold",
          "type": "number"
        }
      },
      "required": null
    },
    "description": "Monitor a distributed service - aggregate one or more events into a single event. This BSM rule template allows you to treat the results of multiple disparate check executions – executed across multiple disparate systems – as a single event. This template is extremely useful in dynamic environments and/or environments that have a reasonable tolerance for failure. Use this template when a service can be considered healthy as long as a minimum threshold is satisfied (for example, at least 5 healthy web servers? at least 70% of N processes healthy?).",
    "eval": "\nif (events && events.length == 0) {\n    event.check.output = \"WARNING: No events selected for aggregate\n\";\n    event.check.status = 1;\n    return event;\n}\n\nevent.annotations[\"io.sensu.bsm.selected_event_count\"] = events.length;\n\npercentOK = sensu.PercentageBySeverity(\"ok\");\n\nif (!!args[\"produce_metrics\"]) {\n    var handlers = [];\n\n    if (!!args[\"metric_handlers\"]) {\n        handlers = args[\"metric_handlers\"].slice();\n    }\n\n    var ts = Math.floor(new Date().getTime() / 1000);\n\n    event.timestamp = ts;\n\n    var tags = [\n        {\n            name: \"service\",\n            value: event.entity.name\n        },\n        {\n            name: \"entity\",\n            value: event.entity.name\n        },\n        {\n            name: \"check\",\n            value: event.check.name\n        }\n    ];\n\n    event.metrics = sensu.NewMetrics({\n        handlers: handlers,\n        points: [\n            {\n                name: \"percent_non_zero\",\n                timestamp: ts,\n                value: sensu.PercentageBySeverity(\"non-zero\"),\n                tags: tags\n            },\n            {\n                name: \"percent_ok\",\n                timestamp: ts,\n                value: percentOK,\n                tags: tags\n            },\n            {\n                name: \"percent_warning\",\n                timestamp: ts,\n                value: sensu.PercentageBySeverity(\"warning\"),\n                tags: tags\n            },\n            {\n                name: \"percent_critical\",\n                timestamp: ts,\n                value: sensu.PercentageBySeverity(\"critical\"),\n                tags: tags\n            },\n            {\n                name: \"percent_unknown\",\n                timestamp: ts,\n                value: sensu.PercentageBySeverity(\"unknown\"),\n                tags: tags\n            },\n            {\n                name: \"count_non_zero\",\n                timestamp: ts,\n                value: sensu.CountBySeverity(\"non-zero\"),\n                tags: tags\n            },\n            {\n                name: \"count_ok\",\n                timestamp: ts,\n                value: sensu.CountBySeverity(\"ok\"),\n                tags: tags\n            },\n            {\n                name: \"count_warning\",\n                timestamp: ts,\n                value: sensu.CountBySeverity(\"warning\"),\n                tags: tags\n            },\n            {\n                name: \"count_critical\",\n                timestamp: ts,\n                value: sensu.CountBySeverity(\"critical\"),\n                tags: tags\n            },\n            {\n                name: \"count_unknown\",\n                timestamp: ts,\n                value: sensu.CountBySeverity(\"unknown\"),\n                tags: tags\n            }\n        ]\n    });\n\n    if (!!args[\"set_metric_annotations\"]) {\n        var i = 0;\n\n        while(i < event.metrics.points.length) {\n            event.annotations[\"io.sensu.bsm.selected_event_\" + event.metrics.points[i].name] = event.metrics.points[i].value.toString();\n            i++;\n        }\n    }\n}\n\nif (!!args[\"critical_threshold\"] && percentOK <= args[\"critical_threshold\"]) {\n    event.check.output = \"CRITICAL: Less than \" + args[\"critical_threshold\"].toString() + \"% of selected events are OK (\" + percentOK.toString() + \"%)\n\";\n    event.check.status = 2;\n    return event;\n}\n\nif (!!args[\"warning_threshold\"] && percentOK <= args[\"warning_threshold\"]) {\n    event.check.output = \"WARNING: Less than \" + args[\"warning_threshold\"].toString() + \"% of selected events are OK (\" + percentOK.toString() + \"%)\n\";\n    event.check.status = 1;\n    return event;\n}\n\nif (!!args[\"critical_count\"]) {\n    crit = sensu.CountBySeverity(\"critical\");\n\n    if (crit >= args[\"critical_count\"]) {\n        event.check.output = \"CRITICAL: \" + args[\"critical_count\"].toString() + \" or more selected events are in a critical state (\" + crit.toString() + \")\n\";\n        event.check.status = 2;\n        return event;\n    }\n}\n\nif (!!args[\"warning_count\"]) {\n    warn = sensu.CountBySeverity(\"warning\");\n\n    if (warn >= args[\"warning_count\"]) {\n        event.check.output = \"WARNING: \" + args[\"warning_count\"].toString() + \" or more selected events are in a warning state (\" + warn.toString() + \")\n\";\n        event.check.status = 1;\n        return event;\n    }\n}\n\nevent.check.output = \"Everything looks good (\" + percentOK.toString() + \"% OK)\";\nevent.check.status = 0;\n\nreturn event;\n"
  }
}
{{< /code >}}

The configuration for a service component that references the `aggregate` rule template might look like this example:

{{< language-toggle >}}

{{< code yml >}}
---
type: ServiceComponent
api_version: bsm/v1
metadata:
  name: web-app
  namespace: default
  created_by: admin
spec:
  cron: ''
  handlers:
  - slack
  interval: 30
  query:
  - type: fieldSelector
    value: event.check.labels.service == applications
  rules:
  - arguments:
      critical_threshold: 50
      metric_handler: influxdb
      produce_metrics: true
      set_metric_annotations: true
      warning_threshold: 70
    name: crit50-warn70
    template: aggregate
  services:
  - applications
{{< /code >}}

{{< code json >}}
{
  "type": "ServiceComponent",
  "api_version": "bsm/v1",
  "metadata": {
    "name": "web-app",
    "namespace": "default",
    "created_by": "admin"
  },
  "spec": {
    "cron": "",
    "handlers": [
      "slack"
    ],
    "interval": 30,
    "query": [
      {
        "type": "fieldSelector",
        "value": "event.check.labels.service == applications"
      }
    ],
    "rules": [
      {
        "arguments": {
          "critical_threshold": 50,
          "metric_handler": "influxdb",
          "produce_metrics": true,
          "set_metric_annotations": true,
          "warning_threshold": 70
        },
        "name": "crit50-warn70",
        "template": "aggregate"
      }
    ],
    "services": [
      "applications"
    ]
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
description  | The rule template's [arguments][7] using [JSON Schema][1] properties.
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
description  | List of attributes the rule template argument requires. The listed attributes must be configured in the [properties][2] object.
required     | false
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

<a id="rule-properties"></a>

properties   | 
-------------|------ 
description  | List of properties that define the argument's behavior. In [JSON Schema][1].
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
[3]: ../service-components/
[4]: ../../../commercial/
[5]: #spec-attributes
[6]: ../../../operations/control-access/namespaces
[7]: #arguments-attributes
