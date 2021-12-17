---
title: "enterprise/bsm/v1"
description: "Sensu enterprise/bsm/v1 API endpoints control the service components and rule templates you can configure for your business services. This reference includes examples for configuring Sensu business service monitoring resources via the API."
enterprise_api_title: "enterprise/bsm/v1"
type: "enterprise_api"
version: "6.3"
product: "Sensu Go"
menu:
  sensu-go-6.3:
    parent: enterprise
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access business service monitoring (BSM) in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

{{% notice note %}}
**NOTE**: Business service monitoring (BSM) is in public preview and is subject to change.

Requests to `enterprise/bsm/v1` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-the-authentication-api).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all service components

The `/service-components` API endpoint provides HTTP GET access to a list of service components.

### Example

The following example demonstrates a request to the `/service-components` API endpoint, resulting in a list of service components.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/bsm/v1/namespaces/default/service-components \
-H "Authorization: Key $SENSU_API_KEY"
[
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
  },
  {
    "type": "ServiceComponent",
    "api_version": "bsm/v1",
    "metadata": {
      "name": "postgresql-2",
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
          "value": "region == 'us-west-2' && cmpt == psql"
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
]
{{< /code >}}

### API Specification

/service-components (GET)  | 
---------------|------
description    | Returns the list of service components.
example url    | http://hostname:8080/api/enterprise/bsm/v1/namespaces/default/service-components
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code json >}}
[
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
  },
  {
    "type": "ServiceComponent",
    "api_version": "bsm/v1",
    "metadata": {
      "name": "postgresql-2",
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
          "value": "region == 'us-west-2' && cmpt == psql"
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
]
{{< /code >}}

## Create a new service component

The `/service-components` API endpoint provides HTTP POST access to create service components.

### Example

The following example demonstrates a request to the `/service-components` API endpoint to create the service component `postgresql-3`.

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "type": "ServiceComponent",
  "api_version": "bsm/v1",
  "metadata": {
    "name": "postgresql-3",
    "namespace": "default"
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
        "value": "region == 'us-west-3' && cmpt == psql"
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
}' \
http://127.0.0.1:8080/api/enterprise/bsm/v1/namespaces/default/service-components

HTTP/1.1 200 OK
{{< /code >}}

### API Specification

/service-components (POST) | 
----------------|------
description     | Creates a new business service component (if none exists).
example URL     | http://hostname:8080/api/enterprise/bsm/v1/namespaces/default/service-components
payload         | {{< code json >}}
{
  "type": "ServiceComponent",
  "api_version": "bsm/v1",
  "metadata": {
    "name": "postgresql-3",
    "namespace": "default"
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
        "value": "region == 'us-west-3' && cmpt == psql"
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
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific service component

The `/service-components/:service-component` API endpoint provides HTTP GET access to data for a specific `:service-component`, by service compnent name.

### Example

In the following example, querying the `/service-components/:service-component` API endpoint returns a JSON map that contains the requested `:service-component`.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/bsm/v1/namespaces/default/service-components/postgresql-1 \
-H "Authorization: Key $SENSU_API_KEY"
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

### API Specification

/service-components/:service-component (GET) | 
---------------------|------
description          | Returns the specified business service component.
example url          | http://hostname:8080/api/enterprise/bsm/v1/namespaces/default/service-components/postgresql-1
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code json >}}
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

## Create or update a service component

The `/service-components/:service-component` API endpoint provides HTTP PUT access to create or update a specific `:service-component`, by service component name.

### Example

The following example demonstrates a request to the `/service-components/:service-component` API endpoint to update the service component `postgresql-1`.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "type": "ServiceComponent",
  "api_version": "bsm/v1",
  "metadata": {
    "name": "postgresql-1",
    "namespace": "default"
  },
  "spec": {
    "cron": "",
    "handlers": [
      "pagerduty",
      "slack"
    ],
    "interval": 30,
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
}' \
http://127.0.0.1:8080/api/enterprise/bsm/v1/namespaces/default/service-components/postgresql-1

HTTP/1.1 200 OK
{{< /code >}}

### API Specification

/service-components/:service-component (PUT) | 
----------------|------
description     | Creates or updates the specified business service component.
example URL     | http://hostname:8080/api/enterprise/bsm/v1/namespaces/default/service-components/postgresql-1
payload         | {{< code json >}}
{
  "type": "ServiceComponent",
  "api_version": "bsm/v1",
  "metadata": {
    "name": "postgresql-1",
    "namespace": "default"
  },
  "spec": {
    "cron": "",
    "handlers": [
      "pagerduty",
      "slack"
    ],
    "interval": 30,
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
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a service component

The `/service-components/:service-component` API endpoint provides HTTP DELETE access to delete the specified service component from Sensu.

### Example

The following example shows a request to the `/service-components/:service-component` API endpoint to delete the service component `postgresql-1`, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/enterprise/bsm/v1/namespaces/default/service-components/postgresql-1

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification

/service-components/:service-component (DELETE) | 
--------------------------|------
description               | Deletes the specified business service component from Sensu.
example url               | http://hostname:8080/api/enterprise/bsm/v1/namespaces/default/service-components/postgresql-1
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get all rule templates

The `/rule-templates` API endpoint provides HTTP GET access to a list of rule templates.

### Example

The following example demonstrates a request to the `/rule-templates` API endpoint, resulting in a list of rule templates.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/bsm/v1/namespaces/default/rule-templates \
-H "Authorization: Key $SENSU_API_KEY"
[
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
  },
  {
    "type": "RuleTemplate",
    "api_version": "bsm/v1",
    "metadata": {
      "name": "status-threshold",
      "namespace": "default",
      "created_by": "admin"
    },
    "spec": {
      "arguments": {
        "properties": {
          "status": {
            "default": {},
            "enum": [
              "non-zero",
              "warning",
              "critical",
              "unknown"
            ],
            "type": "string"
          },
          "threshold": {
            "description": "Numeric value that triggers an event when surpassed",
            "type": "number"
          }
        },
        "required": [
          "threshold"
        ]
      },
      "description": "Creates an event when the percentage of events with the given status exceed the given threshold",
      "eval": "var statusMap = {\n  \"non-zero\": 1,\n  \"warning\": 1,\n  \"critical\": 2,\n};\nfunction main(args) {\n  var total = sensu.events.count();\n  var num = sensu.events.count(args.status);\n  if (num / total <= args.threshold) {\n    return;\n  }\n  return event.status = statusMap[args.status],\n  });\n}"
    }
  }
]
HTTP/1.1 200 OK

{{< /code >}}

### API Specification

/rule-templates (GET)  | 
---------------|------
description    | Returns the list of rule templates.
example url    | http://hostname:8080/api/enterprise/bsm/v1/namespaces/default/rule-templates
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code json >}}
[
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
  },
  {
    "type": "RuleTemplate",
    "api_version": "bsm/v1",
    "metadata": {
      "name": "status-threshold",
      "namespace": "default",
      "created_by": "admin"
    },
    "spec": {
      "arguments": {
        "properties": {
          "status": {
            "default": {},
            "enum": [
              "non-zero",
              "warning",
              "critical",
              "unknown"
            ],
            "type": "string"
          },
          "threshold": {
            "description": "Numeric value that triggers an event when surpassed",
            "type": "number"
          }
        },
        "required": [
          "threshold"
        ]
      },
      "description": "Creates an event when the percentage of events with the given status exceed the given threshold",
      "eval": "var statusMap = {\n  \"non-zero\": 1,\n  \"warning\": 1,\n  \"critical\": 2,\n};\nfunction main(args) {\n  var total = sensu.events.count();\n  var num = sensu.events.count(args.status);\n  if (num / total <= args.threshold) {\n    return;\n  }\n  return event.status = statusMap[args.status],\n  });\n}"
    }
  }
]
{{< /code >}}

## Create a new rule template

The `/rule-templates` API endpoint provides HTTP POST access to create rule templates.

### Example

The following example demonstrates a request to the `/rule-templates` API endpoint to create the rule template `status-threshold`.

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "type": "RuleTemplate",
  "api_version": "bsm/v1",
  "metadata": {
    "name": "status-threshold",
    "namespace": "default"
  },
  "spec": {
    "arguments": {
      "properties": {
        "status": {
          "default": {},
          "enum": [
            "non-zero",
            "warning",
            "critical",
            "unknown"
          ],
          "type": "string"
        },
        "threshold": {
          "description": "Numeric value that triggers an event when surpassed",
          "type": "number"
        }
      },
      "required": [
        "threshold"
      ]
    },
    "description": "Creates an event when the percentage of events with the given status exceed the given threshold",
    "eval": "var statusMap = {\n  \"non-zero\": 1,\n  \"warning\": 1,\n  \"critical\": 2,\n};\nfunction main(args) {\n  var total = sensu.events.count();\n  var num = sensu.events.count(args.status);\n  if (num / total <= args.threshold) {\n    return;\n  }\n  return event.status = statusMap[args.status],\n  });\n}"
  }
}' \
http://127.0.0.1:8080/api/enterprise/bsm/v1/namespaces/default/rule-templates

HTTP/1.1 200 OK
{{< /code >}}

### API Specification

/rule-templates (POST) | 
----------------|------
description     | Creates a new rule template (if none exists).
example URL     | http://hostname:8080/api/enterprise/bsm/v1/namespaces/default/rule-templates
payload         | {{< code json >}}
{
  "type": "RuleTemplate",
  "api_version": "bsm/v1",
  "metadata": {
    "name": "status-threshold",
    "namespace": "default"
  },
  "spec": {
    "arguments": {
      "properties": {
        "status": {
          "default": {},
          "enum": [
            "non-zero",
            "warning",
            "critical",
            "unknown"
          ],
          "type": "string"
        },
        "threshold": {
          "description": "Numeric value that triggers an event when surpassed",
          "type": "number"
        }
      },
      "required": [
        "threshold"
      ]
    },
    "description": "Creates an event when the percentage of events with the given status exceed the given threshold",
    "eval": "var statusMap = {\n  \"non-zero\": 1,\n  \"warning\": 1,\n  \"critical\": 2,\n};\nfunction main(args) {\n  var total = sensu.events.count();\n  var num = sensu.events.count(args.status);\n  if (num / total <= args.threshold) {\n    return;\n  }\n  return event.status = statusMap[args.status],\n  });\n}"
  }
}
{{< /code >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific rule template

The `/rule-templates/:rule-template` API endpoint provides HTTP GET access to data for a specific rule template by name.

### Example

In the following example, querying the `/rule-templates/:rule-template` API endpoint returns a JSON map that contains the requested `:rule-template`.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/bsm/v1/namespaces/default/rule-templates/status-threshold \
-H "Authorization: Key $SENSU_API_KEY"
{
  "type": "RuleTemplate",
  "api_version": "bsm/v1",
  "metadata": {
    "name": "status-threshold",
    "namespace": "default",
    "created_by": "admin"
  },
  "spec": {
    "arguments": {
      "properties": {
        "status": {
          "default": {},
          "enum": [
            "non-zero",
            "warning",
            "critical",
            "unknown"
          ],
          "type": "string"
        },
        "threshold": {
          "description": "Numeric value that triggers an event when surpassed",
          "type": "number"
        }
      },
      "required": [
        "threshold"
      ]
    },
    "description": "Creates an event when the percentage of events with the given status exceed the given threshold",
    "eval": "var statusMap = {\n  \"non-zero\": 1,\n  \"warning\": 1,\n  \"critical\": 2,\n};\nfunction main(args) {\n  var total = sensu.events.count();\n  var num = sensu.events.count(args.status);\n  if (num / total <= args.threshold) {\n    return;\n  }\n  return event.status = statusMap[args.status],\n  });\n}"
  }
}
HTTP/1.1 200 OK

{{< /code >}}

### API Specification

/rule-templates/:rule-template (GET) | 
---------------------|------
description          | Returns the specified rule template.
example url          | http://hostname:8080/api/enterprise/bsm/v1/namespaces/default/rule-templates/status-threshold
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code json >}}
{
  "type": "RuleTemplate",
  "api_version": "bsm/v1",
  "metadata": {
    "name": "status-threshold",
    "namespace": "default",
    "created_by": "admin"
  },
  "spec": {
    "arguments": {
      "properties": {
        "status": {
          "default": {},
          "enum": [
            "non-zero",
            "warning",
            "critical",
            "unknown"
          ],
          "type": "string"
        },
        "threshold": {
          "description": "Numeric value that triggers an event when surpassed",
          "type": "number"
        }
      },
      "required": [
        "threshold"
      ]
    },
    "description": "Creates an event when the percentage of events with the given status exceed the given threshold",
    "eval": "var statusMap = {\n  \"non-zero\": 1,\n  \"warning\": 1,\n  \"critical\": 2,\n};\nfunction main(args) {\n  var total = sensu.events.count();\n  var num = sensu.events.count(args.status);\n  if (num / total <= args.threshold) {\n    return;\n  }\n  return event.status = statusMap[args.status],\n  });\n}"
  }
}
{{< /code >}}

## Create or update a rule template

The `/rule-templates/:rule-template` API endpoint provides HTTP PUT access to create or update a specific rule template by name.

### Example

The following example demonstrates a request to the `/rule-templates/:rule-template` API endpoint to update the rule template `status-threshold`.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "type": "RuleTemplate",
  "api_version": "bsm/v1",
  "metadata": {
    "name": "status-threshold",
    "namespace": "default"
  },
  "spec": {
    "arguments": {
      "properties": {
        "status": {
          "default": {},
          "enum": [
            "non-zero",
            "warning",
            "critical",
            "unknown"
          ],
          "type": "string"
        },
        "threshold": {
          "description": "Numeric value that triggers an event when surpassed",
          "type": "number"
        }
      },
      "required": [
        "threshold"
      ]
    },
    "description": "Creates an event when the number of events with the given status exceed the given threshold",
    "eval": "var statusMap = {\n  \"non-zero\": 1,\n  \"warning\": 1,\n  \"critical\": 2,\n};\nfunction main(args) {\n  var total = sensu.events.count();\n  var num = sensu.events.count(args.status);\n  if (num / total <= args.threshold) {\n    return;\n  }\n  return event.status = statusMap[args.status],\n  });\n}"
  }
}' \
http://127.0.0.1:8080/api/enterprise/bsm/v1/namespaces/default/rule-templates/status-threshold

HTTP/1.1 200 OK
{{< /code >}}

### API Specification

/rule-templates/:rule-template (PUT) | 
----------------|------
description     | Creates or updates the specified rule template.
example URL     | http://hostname:8080/api/enterprise/bsm/v1/namespaces/default/rule-templates/status-threshold
payload         | {{< code json >}}
{
  "type": "RuleTemplate",
  "api_version": "bsm/v1",
  "metadata": {
    "name": "status-threshold",
    "namespace": "default"
  },
  "spec": {
    "arguments": {
      "properties": {
        "status": {
          "default": {},
          "enum": [
            "non-zero",
            "warning",
            "critical",
            "unknown"
          ],
          "type": "string"
        },
        "threshold": {
          "description": "Numeric value that triggers an event when surpassed",
          "type": "number"
        }
      },
      "required": [
        "threshold"
      ]
    },
    "description": "Creates an event when the number of events with the given status exceed the given threshold",
    "eval": "var statusMap = {\n  \"non-zero\": 1,\n  \"warning\": 1,\n  \"critical\": 2,\n};\nfunction main(args) {\n  var total = sensu.events.count();\n  var num = sensu.events.count(args.status);\n  if (num / total <= args.threshold) {\n    return;\n  }\n  return event.status = statusMap[args.status],\n  });\n}"
  }
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a rule template

The `/rule-templates/:rule-template` API endpoint provides HTTP DELETE access to delete the specified rule template from Sensu.

### Example

The following example shows a request to the `/rule-templates/:rule-template` API endpoint to delete the rule template `status-threshold`, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/enterprise/bsm/v1/namespaces/default/rule-templates/status-threshold

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification

/rule-templates/:rule-template (DELETE) | 
--------------------------|------
description               | Deletes the specified rule template from Sensu.
example url               | http://hostname:8080/api/enterprise/bsm/v1/rule-templates/status-threshold
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

