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
    parent: observe-schedule
---

Sensu's business service management allows you to monitor every component in your system with a top-down approach that produces meaningful alerts, prevents alert fatigue, and helps you focus on your core business services.

An example of a business service might be a company website.
The website itself might have three service components: the primary webserver that publishes website pages, a backup webserver in case the primary webserver fails, and an inventory database for the shop section of the website.
At least one webserver and the database must be in an OK state for the website to be fully available.

Business service management allows you to create customized monitoring rules that specify the threshold for taking action for different service components as well as what action to take.

To continue the company website example, failure of the primary webserver does not affect the website availability because the backup webserver automatically takes over.
In this scenario, a monitoring rule might create a ticket to address the next workday.
On the other hand, failure of both webservers or the inventory database does affect website availability, so another monitoring rule that triggers an alert to the on-call operator might apply in that scenario.

Business service management requires two resources that work together to achieve top-down monitoring: [service components][1] and [rule templates][2].
Service components are the elements that make up your business services.
Rule templates define the monitoring rules that produce events for components based on customized evaluation expressions.

## Example service component and rule template definitions

Although you can configure service components and rule templates within the web UI, both are Sensu resources with complete definitions.

Here is an example service component definition that references the `status-threshold` rule template:

{{< language-toggle >}}

{{< code yml >}}
---
type: ServiceComponent
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
  "type": "ServiceComponent",
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

The referenced `status-threshold` rule template might be configured as follows:

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

## Sampling, polling, and hybrid approaches

Sampling, polling, and hybrid are three general approaches to selecting events in service components, calculating aggregate data, and evaluating monitoring rules.

### Sampling

In the sampling approach to business service monitoring, the Sensu Go backend evaluates events against the event selectors for each configured service component as the backend processes the events.
When an event matches a component’s selectors, the backend samples the event data (including entity name, check name, check output, and check status) and stores this data as part of the service component.
After storing the sampled data, the Sensu backend updates and stores aggregate data for the service component, including the total number of selected events, unique entities, unique checks, and a total count of each check status/severity (ok, warning, critical, or unknown).

If the selected event indicates a state change, the backend evaluates the service component’s monitoring rules for the newly updated aggregate data.
If a monitoring rule creates an event, the event uses the service component’s handlers and business service entity.

Events produced by monitoring rule evaluation are processed like any other &mdash; they are passed to eventd or pipelined. 

#### Sampling example

...

### Polling

In the polling approach to business service monitoring, service components include a configured monitoring rule evaluation schedule based on either a set interval (in seconds) or cron string.
According to the schedule, the Sensu backend periodically (e.g. every 30 seconds) selects Sensu events using component event selectors and calculates and stores a set of counters for the events.
The calculated aggregate data includes the total number of selected events, unique entities, unique checks, and a total count of each check status/severity (ok, warning, critical, or unknown).

The Sensu backend evaluates each service component monitoring rule against the aggregate data.
Events produced by monitoring rule evaluation are processed like any other &mdash; they are passed to eventd or pipelined.

#### Polling example

...

### Hybrid

In the hybrid approach to business service monitoring, the Sensu Go backend evaluates events against the event selectors for each configured service component as the backend processes the events.
When an event matches a component’s selectors, the backend samples the event data (including entity name, check name, check output, and check status) and stores this data as part of the service component.

Service components also include a configured monitoring rule evaluation schedule based on either a set interval (in seconds) or cron string.
According to the schedule, the Sensu backend periodically (e.g. every 30 seconds) selects Sensu events using component event selectors and calculates and stores a set of counters for the events.
The calculated aggregate data includes the total number of sampled events, unique entities, unique checks, and a total count of each check status/severity (ok, warning, critical, or unknown).

The Sensu backend evaluates each service component monitoring rule against the aggregate data.
Events produced by monitoring rule evaluation are processed like any other &mdash; they are passed to eventd or pipelined.

#### Hybrid example

...


[1]: service-components/
[2]: rule-templates/
