---
title: "Monitor Business Services"
description: "Sensu's business service monitoring (BSM) provides high-level visibility into the current health of any number of your business services. Read this guide to learn how BSM provides an overall view of your business services."
product: "Sensu Go"
version: "6.3"
weight: 55
layout: "single"
toc: true
menu:
  sensu-go-6.3:
    parent: observe-schedule
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access business service monitoring (BSM) in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features](../../../commercial/).
{{% /notice %}}

{{% notice note %}}
**NOTE**: Business service monitoring (BSM) is in public preview and is subject to change. 
{{% /notice %}}

Sensu's business service monitoring (BSM) provides high-level visibility into the current health of any number of your business services.
Use BSM to monitor every component in your system with a top-down approach that produces meaningful alerts, prevents alert fatigue, and helps you focus on your core business services.

BSM requires two resources that work together to achieve top-down monitoring: [service components][1] and [rule templates][2].
Service components are the elements that make up your business services.
Rule templates define the monitoring rules that produce events for service components based on customized evaluation expressions.

An example of a business service might be a company website.
The website itself might have three service components: the primary webserver that publishes website pages, a backup webserver in case the primary webserver fails, and an inventory database for the shop section of the website.
At least one webserver and the database must be in an OK state for the website to be fully available.

In this scenario, you could use BSM to create a current status page for this company website that displays the website's high-level status at a glance.
As long as one webserver and the database have an OK status, the website status is OK.
Otherwise, the website status is not OK.
Most people probably just want to know whether the website is currently available &mdash; it won't matter to them whether the website is functioning with one or both webservers.

At the same time, the company *does* want to make sure the right person addresses any webserver failures, even if the website is technically still OK.
BSM allows you to customize rule templates that apply a threshold for taking action for different service components as well as what action to take.

To continue the company website example, if the primary webserver fails but the backup webserver does not, you might use a rule template that creates a service ticket to address the next workday (in addition to the rule template that is emitting "OK" events for the current status page).
Another monitoring rule might trigger an alert to the on-call operator should both webservers or the inventory database fail.

{{% notice note %}}
**NOTE**: BSM requires high event throughput.
Configure a [PostgreSQL datastore](../../../operations/deploy-sensu/scale-event-storage/) to achieve the required throughput and use the BSM feature.
{{% /notice %}}

## Service component example

Here is an example service component definition that includes the `account-manager` and `tessen` services and applies a rule template named `status-threshold` by reference:

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

## Rule template example

The `status-threshold` rule template (referenced in the [service component example][4]) could be configured as shown in this example:

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

## Configure BSM via the web UI

The Sensu [web UI BSM module][3] allows you to create, edit, and delete service components and rule templates inside the web UI.

## Configure BSM via APIs and sensuctl

BSM service components and rule templates are Sensu resources with complete definitions, so you can use Sensu's [service component][1] and [rule template][2] APIs to create, retrieve, update, and delete service components and rule templates.

You can also use [sensuctl][5] to create and manage service components and rule templates via the APIs from the command line.


[1]: ../service-components/
[2]: ../rule-templates/
[3]: ../../../web-ui/bsm-module/
[4]: #service-component-example
[5]: ../../../sensuctl/
