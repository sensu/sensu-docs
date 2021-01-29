---
title: "Manage Business Services"
description: "Sensu's business service management allows you to configure service components and rule templates for monitoring your business services."
product: "Sensu Go"
version: "6.3"
weight: 55
layout: "single"
toc: true
menu:
  sensu-go-6.3:
    parent: operations
    identifier: manage-business-services
---

Sensu's business service management allows you to monitor every component in your system with a top-down approach that produces meaningful alerts, prevents alert fatigue, and helps you focus on your core business services.
Use components to identify elements of your business services and define monitoring rules that produce events for those components based on customized evaluation expressions.

For example, with business service management, you can specify that failure of certain individual components will trigger an alert to an operator mailbox and create a ticket to address the next workday.
At the same time, for failure of a component that affects availability or performance of your entire business service, your rule template can trigger an alert to your on-call staff for immediate response.
You can also set a delay so that a component failure causes alerts only after the failure persists for a certain amount of time or after a number of polling intervals.

Business service management highlights which business services are affected by the failure of an underlying system.

Business service management requires two resources that work together to achieve top-down monitoring: components and rule templates.

## Components

Business service [components][1] are resources for defining and managing elements of a business service.
Here is an example component definition that references the `status-threshold` rule template:

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

If you delete a resource (e.g. an entity, check, or event) that is part of one or more business service components, Sensu will automatically remove the deleted resource from the components.

## Rule templates

In [rule templates][2], you configure conditions for creating an event with an ECMAScript 5 (JavaScript) expression.
When you add rule templates by reference in your component definitions, Sensu evaluate events according to the expression you configure in the rule template.

For example, the component listed above references the `status-threshold` rule template:

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


[1]: components/
[2]: rule-templates/

