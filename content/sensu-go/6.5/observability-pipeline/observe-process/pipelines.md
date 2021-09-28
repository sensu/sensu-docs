---
title: "Pipelines reference"
linkTitle: "Pipelines Reference"
reference_title: "Pipelines"
type: "reference"
description: "Pipelines are observation event processing workflows made up of filters, mutators, and handlers. Read the reference doc to learn about pipelines."
weight: 15
version: "6.5"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.5:
    parent: observe-process
---

{{% notice warning %}}
**IMPORTANT**: The pipeline resources described on this page are different from the handler resources you can create with the [pipeline API](../../../api/pipeline/).<br><br>
The [pipeline API](../../../api/pipeline/) does not create pipeline resources.
Instead, it allows you to create handlers that can **only** be used in pipeline resources.
Read the [Sumo Logic metrics handlers reference](../../observability-pipeline/observe-process/sumo-logic-metrics-handlers) and [TCP stream handlers reference](../../observability-pipeline/observe-process/tcp-stream-handlers) for more information.
{{% /notice %}}

Sensu executes pipelines during the **[process][22]** stage of the [observability pipeline][29].

Pipelines are Sensu resources composed of observation event processing [workflows][3] made up of filters, mutators, and handlers.
Instead of specifying filters and mutators in handler definitions, you can specify all three in a single pipeline workflow.

To use a pipeline, list it in a check definition's [pipelines array][19].
All the observability events that the check produces will be processed according to the pipeline's workflows.

Pipelines can replace [handler sets][1] and [handler stacks][2].
We recommend migrating your existing handler sets and stacks to pipeline workflows.

## Pipeline example

This example shows a pipeline resource definition that includes event filters, a mutator, and a handler:

{{< language-toggle >}}

{{< code yml >}}
---
type: Pipeline
api_version: core/v2
metadata:
  name: incident_alerts
  namespace: default
  created_by: admin
spec:
  workflows:
  - name: labeled_email_alerts
    filters:
    - name: is_incident
      type: EventFilter
      api_version: core/v2
    - name: state_change_only
      type: EventFilter
      api_version: core/v2
    mutator:
      name: add_labels
      type: Mutator
      api_version: core/v2
    handler:
      name: email
      type: Handler
      api_version: core/v2
{{< /code >}}

{{< code json >}}
{
  "type": "Pipeline",
  "api_version": "core/v2",
  "metadata": {
    "name": "incident_alerts",
    "namespace": "default",
    "created_by": "admin"
  },
  "spec": {
    "workflows": [
      {
        "name": "labeled_email_alerts",
        "filters": [
          {
            "name": "is_incident",
            "type": "EventFilter",
            "api_version": "core/v2"
          },
          {
            "name": "state_change_only",
            "type": "EventFilter",
            "api_version": "core/v2"
          }
        ],
        "mutator": {
          "name": "add_labels",
          "type": "Mutator",
          "api_version": "core/v2"
        },
        "handler": {
          "name": "email",
          "type": "Handler",
          "api_version": "core/v2"
        }
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

To use this pipeline in a check, list it in the check's [pipelines array][19].
For example:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: incident_pipelines
  namespace: default
spec:
  command: collect.sh
  interval: 10
  publish: true
  subscriptions:
  - system
  pipelines:
  - type: Pipeline
    api_version: core/v2
    name: incident_alerts
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "incident_pipelines",
    "namespace": "default"
  },
  "spec": {
    "command": "collect.sh",
    "interval": 10,
    "publish": true,
    "subscriptions": [
      "system"
    ],
    "pipelines": [
      {
        "type": "Pipeline",
        "api_version": "core/v2",
        "name": "incident_alerts"
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Workflows

The workflow attribute is an array of event processing workflows that Sensu will apply for events produced by any check that references the pipeline.

Workflows do not have to include an event filter or mutator, but they must specify at least one handler.

Workflows can include more than one event filter.
If a workflow has more than one filter, Sensu applies the filters in a series, starting with the filter that is listed first.

### Pipelines with multiple workflows

Pipelines can include more than one workflow.

In this example, the pipeline includes `labeled_email_alerts` and `slack_alerts` workflows:

{{< language-toggle >}}

{{< code yml >}}
---
type: Pipeline
api_version: core/v2
metadata:
  name: incident_alerts
  namespace: default
  created_by: admin
spec:
  workflows:
  - name: labeled_email_alerts
    filters:
    - name: is_incident
      type: EventFilter
      api_version: core/v2
    - name: state_change_only
      type: EventFilter
      api_version: core/v2
    mutator:
      name: add_labels
      type: Mutator
      api_version: core/v2
    handler:
      name: email
      type: Handler
      api_version: core/v2
  - name: slack_alerts
    filters:
    - name: is_incident
      type: EventFilter
      api_version: core/v2
    - name: state_change_only
      type: EventFilter
      api_version: core/v2
    handler:
      name: slack
      type: Handler
      api_version: core/v2
{{< /code >}}

{{< code json >}}
{
  "type": "Pipeline",
  "api_version": "core/v2",
  "metadata": {
    "name": "incident_alerts",
    "namespace": "default",
    "created_by": "admin"
  },
  "spec": {
    "workflows": [
      {
        "name": "labeled_email_alerts",
        "filters": [
          {
            "name": "is_incident",
            "type": "EventFilter",
            "api_version": "core/v2"
          },
          {
            "name": "state_change_only",
            "type": "EventFilter",
            "api_version": "core/v2"
          }
        ],
        "mutator": {
          "name": "add_labels",
          "type": "Mutator",
          "api_version": "core/v2"
        },
        "handler": {
          "name": "email",
          "type": "Handler",
          "api_version": "core/v2"
        }
      },
      {
        "name": "slack_alerts",
        "filters": [
          {
            "name": "is_incident",
            "type": "EventFilter",
            "api_version": "core/v2"
          },
          {
            "name": "state_change_only",
            "type": "EventFilter",
            "api_version": "core/v2"
          }
        ],
        "handler": {
          "name": "slack",
          "type": "Handler",
          "api_version": "core/v2"
        }
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

All events from checks that specify this pipeline will be processed with both workflows, in series, starting with the workflow that is listed first in the resource definition.

## Pipeline specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][4] resource type. Pipelines should always be type `Pipeline`.
required     | Required for pipeline definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: Pipeline
{{< /code >}}
{{< code json >}}
{
  "type": "Pipeline"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For pipelines in this version of Sensu, the api_version should always be `core/v2`.
required     | Required for pipeline definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: core/v2
{{< /code >}}
{{< code json >}}
{
  "api_version": "core/v2"
}
{{< /code >}}
{{< /language-toggle >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the pipeline that includes `name`, `namespace`, and `created_by` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the pipeline definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. Read [metadata attributes][8] for details.
required     | Required for pipeline definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: incident_alerts
  namespace: default
  created_by: admin
  labels:
    region: us-west-1
  annotations:
    slack-channel: "#incidents"
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "name": "incident_alerts",
    "namespace": "default",
    "created_by": "admin",
    "labels": {
      "region": "us-west-1"
    },
    "annotations": {
      "slack-channel": "#incidents"
    }
  }
}
{{< /code >}}
{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes the pipeline [spec attributes][5].
required     | Required for pipeline definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][4].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  workflows:
  - name: labeled_email_alerts
    filters:
    - name: is_incident
      type: EventFilter
      api_version: core/v2
    - name: state_change_only
      type: EventFilter
      api_version: core/v2
    mutator:
      name: add_labels
      type: Mutator
      api_version: core/v2
    handler:
      name: email
      type: Handler
      api_version: core/v2
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "workflows": [
      {
        "name": "labeled_email_alerts",
        "filters": [
          {
            "name": "is_incident",
            "type": "EventFilter",
            "api_version": "core/v2"
          },
          {
            "name": "state_change_only",
            "type": "EventFilter",
            "api_version": "core/v2"
          }
        ],
        "mutator": {
          "name": "add_labels",
          "type": "Mutator",
          "api_version": "core/v2"
        },
        "handler": {
          "name": "email",
          "type": "Handler",
          "api_version": "core/v2"
        }
      }
    ]
  }
}
{{< /code >}}
{{< /language-toggle >}}

### Metadata attributes

| name       |      |
-------------|------
description  | Unique string used to identify the pipeline. Pipeline names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][18]). Each pipeline must have a unique name within its namespace.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: incident_alerts
{{< /code >}}
{{< code json >}}
{
  "name": "incident_alerts"
}
{{< /code >}}
{{< /language-toggle >}}

| namespace  |      |
-------------|------
description  | Sensu [RBAC namespace][9] that the pipeline belongs to.
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

| created_by |      |
-------------|------
description  | Username of the Sensu user who created the pipeline or last updated the handler. Sensu automatically populates the `created_by` field when the pipeline is created or updated.
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
description  | Custom attributes to include with observation data in events that you can use for response and web UI view filtering.<br><br>If you include labels in your event data, you can filter [API responses][10], [sensuctl responses][11], and [web UI views][25] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
labels:
  environment: production
  region: us-west-1
{{< /code >}}
{{< code json >}}
{
  "labels": {
    "environment": "production",
    "region": "us-west-1"
  }
}
{{< /code >}}
{{< /language-toggle >}}

| annotations |     |
-------------|------
description  | Non-identifying metadata to include with observation data in events that you can access with [event filters][24]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][10], [sensuctl response filtering][11], or [web UI views][28].
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
annotations:
  managed-by: ops
  slack-channel: "#incidents"
{{< /code >}}
{{< code json >}}
{
  "annotations": {
    "managed-by": "ops",
    "slack-channel": "#incidents"
  }
}
{{< /code >}}
{{< /language-toggle >}}

### Spec attributes

workflows    | 
-------------|------
description  | Array of workflows (by names) to use when filtering, mutating, and handling observability events with a pipeline. Each array item must be a string. Read [workflows attributes][6] for details.
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
workflows:
  - name: labeled_email_alerts
    filters:
    - name: is_incident
      type: EventFilter
      api_version: core/v2
    - name: state_change_only
      type: EventFilter
      api_version: core/v2
    mutator:
      name: add_labels
      type: Mutator
      api_version: core/v2
    handler:
      name: email
      type: Handler
      api_version: core/v2
{{< /code >}}
{{< code json >}}
{
  "workflows": [
    {
      "name": "labeled_email_alerts",
      "filters": [
        {
          "name": "is_incident",
          "type": "EventFilter",
          "api_version": "core/v2"
        },
        {
          "name": "state_change_only",
          "type": "EventFilter",
          "api_version": "core/v2"
        }
      ],
      "mutator": {
        "name": "add_labels",
        "type": "Mutator",
        "api_version": "core/v2"
      },
      "handler": {
        "name": "email",
        "type": "Handler",
        "api_version": "core/v2"
      }
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

#### Workflows attributes

filters      | 
-------------|------
description  | Reference for the Sensu event filters to use when filtering events for the pipeline. Each pipeline workflow can reference more than one event filter. If a workflow has more than one filter, Sensu applies the filters in a series, starting with the filter that is listed first. Read [filters attributes][7] for details.
required     | false
type         | Map of key-value pairs
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
filters:
- name: is_incident
  type: EventFilter
  api_version: core/v2
- name: state_change_only
  type: EventFilter
  api_version: core/v2
{{< /code >}}
{{< code json >}}
{
  "filters": [
    {
      "name": "is_incident",
      "type": "EventFilter",
      "api_version": "core/v2"
    },
    {
      "name": "state_change_only",
      "type": "EventFilter",
      "api_version": "core/v2"
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

mutator      | 
-------------|------
description  | Reference for the Sensu mutator to use to mutate event data for the workflow. Each pipeline workflow can reference only one mutator. Read [mutator attributes][9] for details.
required     | false
type         | Map of key-value pairs
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
mutator:
  name: add_labels
  type: Mutator
  api_version: core/v2
{{< /code >}}
{{< code json >}}
{
  "mutator": {
    "name": "add_labels",
    "type": "Mutator",
    "api_version": "core/v2"
  }
}
{{< /code >}}
{{< /language-toggle >}}

<a id="handler-pipeline"></a>

handler      | 
-------------|------
description  | Reference for the Sensu handler to use for event processing in the workflow. Each pipeline workflow must reference one handler. Read [handler attributes][12] for details.
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
handler:
  name: email
  type: Handler
  api_version: core/v2
{{< /code >}}
{{< code json >}}
{
  "handler": {
    "name": "email",
    "type": "Handler",
    "api_version": "core/v2"
  }
}
{{< /code >}}
{{< /language-toggle >}}

#### Filters attributes

name         | 
-------------|------
description  | Name of the Sensu [event filter][24] to use for the workflow.
required     | true
type         | String
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
name: is_incident
{{< /code >}}
{{< code json >}}
{
  "name": "is_incident"
}
{{< /code >}}
{{< /language-toggle >}}

type         | 
-------------|------
description  | The [`sensuctl create`][4] resource type for the event filter. Event filters should always be type `EventFilter`.
required     | true
type         | String
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
type: EventFilter
{{< /code >}}
{{< code json >}}
{
 "type": "EventFilter"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | The Sensu API group and version for the event filter. For event filters in this version of Sensu, the api_version should always be `core/v2`.
required     | true
type         | String
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: core/v2
{{< /code >}}
{{< code json >}}
{
  "api_version": "core/v2"
}
{{< /code >}}
{{< /language-toggle >}}

#### Mutator attributes

name         | 
-------------|------
description  | Name of the Sensu [mutator][14] to use for the workflow.
required     | true
type         | String
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
name: add_labels
{{< /code >}}
{{< code json >}}
{
  "name": "add_labels"
}
{{< /code >}}
{{< /language-toggle >}}

type         | 
-------------|------
description  | The [`sensuctl create`][4] resource type for the mutator. Mutators should always be type `Mutator`.
required     | true
type         | String
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
type: Mutator
{{< /code >}}
{{< code json >}}
{
 "type": "Mutator"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | The Sensu API group and version for the mutator. For mutators in this version of Sensu, the api_version should always be `core/v2`.
required     | true
type         | String
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: core/v2
{{< /code >}}
{{< code json >}}
{
  "api_version": "core/v2"
}
{{< /code >}}
{{< /language-toggle >}}

#### Handler attributes

name         | 
-------------|------
description  | Name of the Sensu [handler][13] to use for the workflow.
required     | true
type         | String
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
name: email
{{< /code >}}
{{< code json >}}
{
  "name": "email"
}
{{< /code >}}
{{< /language-toggle >}}

type         | 
-------------|------
description  | The [`sensuctl create`][4] resource type for the handler.
required     | true
type         | String
allowed values | `Handler` for a [pipe handler][15], [TCP or UDP handler][16], or [handler set][1]<br><br>`TCPStreamHandler` for a [TCP stream handler][20]<br><br>`SumoLogicMetricsHandler` for a [Sumo Logic metrics handler][21]
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
type: Handler
{{< /code >}}
{{< code json >}}
{
 "type": "Handler"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | The Sensu API group and version for the handler.
required     | true
type         | String
allowed values | `core/v2` for a [pipe handler][15], [TCP or UDP handler][16], or [handler set][1]<br><br>`pipeline/v1` for a [TCP stream handler][20] or [Sumo Logic metrics handler][21]
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: core/v2
{{< /code >}}
{{< code json >}}
{
  "api_version": "core/v2"
}
{{< /code >}}
{{< /language-toggle >}}


[1]: ../handlers/#handler-sets
[2]: ../handlers/#handler-stacks
[3]: #workflows
[4]: ../../../sensuctl/create-manage-resources/#create-resources
[5]: #spec-attributes
[6]: #workflows-attributes
[7]: #filters-attributes
[8]: #metadata-attributes
[9]: ../../../operations/control-access/namespaces/
[10]: ../../../api#response-filtering
[11]: ../../../sensuctl/filter-responses/
[12]: #handler-attributes
[13]: ../handlers/
[14]: ../../observe-transform/mutators/
[15]: ../handlers/#pipe-handlers
[16]: ../handlers/#tcpudp-handlers
[17]: ../tcp-stream-handlers
[18]: https://regex101.com/r/zo9mQU/2
[19]: ../../observe-schedule/checks/#pipelines-attribute
[20]: ../tcp-stream-handlers/
[21]: ../sumo-logic-metrics-handlers/
[22]: ../
[24]: ../../observe-filter/filters/
[25]: ../../../web-ui/search#search-for-labels
[26]: ../../../operations/manage-secrets/secrets-management/
[27]: ../../observe-schedule/agent/#registration-endpoint-management-and-service-discovery
[28]: ../../../web-ui/search/
[29]: ../../../observability-pipeline/
