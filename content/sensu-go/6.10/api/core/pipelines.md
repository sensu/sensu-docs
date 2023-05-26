---
title: "core/v2/pipelines"
description: "Read this API documentation for information about Sensu core/v2/pipelines API endpoints, with examples for retrieving and managing pipelines."
core_api_title: "core/v2/pipelines"
type: "core_api"
version: "6.10"
product: "Sensu Go"
menu:
  sensu-go-6.10:
    parent: core
---

{{% notice warning %}}
**IMPORTANT**: The [pipelines](../../../observability-pipeline/observe-process/pipelines/) you can create and manage with this `core/v2/pipelines` API are observation event processing workflows made up of filters, mutators, and handlers.<br><br>
Pipelines are different from the resources you can create and manage with the [`enterprise/pipeline/v1`](../../enterprise/pipeline/) API, which allows you to create and manage resources that can **only** be used in pipelines.
{{% /notice %}}

{{% notice note %}}
**NOTE**: Requests to `core/v2/pipelines` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-auth-api-endpoints).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all pipelines

The `/pipelines` API endpoint provides HTTP GET access to [pipeline][1] data.

### Example

The following example demonstrates a GET request to the `/pipelines` API endpoint:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/pipelines \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a JSON array that contains the [pipeline definitions][1] in the `default` namespace:

{{< code text >}}
[
  {
    "metadata": {
      "name": "labeled_emails",
      "namespace": "default",
      "created_by": "admin"
    },
    "workflows": [
      {
        "name": "default",
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
  },
  {
    "metadata": {
      "name": "slack_pipeline",
      "namespace": "default",
      "created_by": "admin"
    },
    "workflows": [
      {
        "name": "default",
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
          "name": "slack",
          "type": "Handler",
          "api_version": "core/v2"
        }
      }
    ]
  }
]
{{< /code >}}

### API Specification

/pipelines (GET)  | 
---------------|------
description    | Returns the list of pipelines.
example url    | http://hostname:8080/api/core/v2/namespaces/default/pipelines
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response filtering | This endpoint supports [API response filtering][3].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "metadata": {
      "name": "labeled_emails",
      "namespace": "default",
      "created_by": "admin"
    },
    "workflows": [
      {
        "name": "default",
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
  },
  {
    "metadata": {
      "name": "slack_pipeline",
      "namespace": "default",
      "created_by": "admin"
    },
    "workflows": [
      {
        "name": "default",
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
          "name": "slack",
          "type": "Handler",
          "api_version": "core/v2"
        }
      }
    ]
  }
]
{{< /code >}}

## Create a new pipeline

The `/pipelines` API endpoint provides HTTP POST access to create a pipeline.

### Example

In the following example, an HTTP POST request is submitted to the `/pipelines` API endpoint to create the pipeline resource `labeled_emails`:

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "metadata": {
    "name": "labeled_emails",
    "namespace": "default"
  },
  "workflows": [
    {
      "name": "default",
      "filters": [
        {
          "api_version": "core/v2",
          "type": "EventFilter",
          "name": "is_incident"
        },
        {
          "api_version": "core/v2",
          "type": "EventFilter",
          "name": "state_change_only"
        }
      ],
      "mutator": {
        "api_version": "core/v2",
        "type": "Mutator",
        "name": "add_labels"
      },
      "handler": {
        "api_version": "core/v2",
        "type": "Handler",
        "name": "email"
      }
    }
  ]
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/pipelines
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

### API Specification

/pipelines (POST) | 
----------------|------
description     | Creates a Sensu pipeline.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/pipelines
payload         | {{< code shell >}}
{
  "metadata": {
    "name": "labeled_email",
    "namespace": "default"
  },
  "workflows": [
    {
      "name": "default",
      "filters": [
        {
          "api_version": "core/v2",
          "type": "EventFilter",
          "name": "is_incident"
        },
        {
          "api_version": "core/v2",
          "type": "EventFilter",
          "name": "state_change_only"
        }
      ],
      "mutator": {
        "api_version": "core/v2",
        "type": "Mutator",
        "name": "add_labels"
      },
      "handler": {
        "api_version": "core/v2",
        "type": "Handler",
        "name": "email"
      }
    }
  ]
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific pipeline

The `/pipelines/:pipeline` API endpoint provides HTTP GET access to [pipeline data][1] for specific `:pipeline` definitions, by pipeline name.

### Example

The following example queries the `/pipelines/:pipeline` API endpoint for the `:pipeline` named `labeled_emails`:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/pipelines/labeled_emails \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request will return a successful `HTTP/1.1 200 OK` response and a JSON map that contains the requested [`:pipeline` definition][1] (in this example, `labeled_emails`):

{{< code text >}}
{
  "metadata": {
    "name": "labeled_emails",
    "namespace": "default",
    "created_by": "admin"
  },
  "workflows": [
    {
      "name": "default",
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

### API Specification

/pipelines/:pipeline (GET) | 
---------------------|------
description          | Returns a pipeline.
example url          | http://hostname:8080/api/core/v2/namespaces/default/pipelines/labeled_emails
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code text >}}
{
  "metadata": {
    "name": "labeled_emails",
    "namespace": "default",
    "created_by": "admin"
  },
  "workflows": [
    {
      "name": "default",
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

## Create or update a pipeline

The `/pipelines/:pipeline` API endpoint provides HTTP PUT access to create or update a specific `:pipeline` definition, by pipeline name.

### Example

In the following example, an HTTP PUT request is submitted to the `/pipelines/:pipeline` API endpoint to update `slack_pipeline` to use `javascript_mutator` instead of the `add_labels` mutator:

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "metadata": {
    "name": "slack_pipeline",
    "namespace": "default"
  },
  "workflows": [
    {
      "name": "default",
      "filters": [
        {
          "api_version": "core/v2",
          "type": "EventFilter",
          "name": "is_incident"
        },
        {
          "api_version": "core/v2",
          "type": "EventFilter",
          "name": "state_change_only"
        }
      ],
      "mutator": {
        "api_version": "core/v2",
        "type": "Mutator",
        "name": "javascript_mutator"
      },
      "handler": {
        "api_version": "core/v2",
        "type": "Handler",
        "name": "slack"
      }
    }
  ]
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/pipelines/slack_pipeline
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

### API Specification

/pipelines/:pipeline (PUT) | 
----------------|------
description     | Creates or updates the specified Sensu pipeline.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/pipelines/slack_pipeline
payload         | {{< code shell >}}
{
  "metadata": {
    "name": "slack_pipeline",
    "namespace": "default"
  },
  "workflows": [
    {
      "name": "default",
      "filters": [
        {
          "api_version": "core/v2",
          "type": "EventFilter",
          "name": "is_incident"
        },
        {
          "api_version": "core/v2",
          "type": "EventFilter",
          "name": "state_change_only"
        }
      ],
      "mutator": {
        "api_version": "core/v2",
        "type": "Mutator",
        "name": "javascript_mutator"
      },
      "handler": {
        "api_version": "core/v2",
        "type": "Handler",
        "name": "slack"
      }
    }
  ]
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Update a pipeline with PATCH

The `/pipelines/:pipeline` API endpoint provides HTTP PATCH access to update `:pipeline` definitions, specified by pipeline name.

{{% notice note %}}
**NOTE**: You cannot change a resource's `name` or `namespace` with a PATCH request.
Use a [PUT request](#create-or-update-a-pipeline) instead.<br><br>
Also, you cannot add elements to an array with a PATCH request &mdash; you must replace the entire array.
{{% /notice %}}

### Example

In the following example, an HTTP PATCH request is submitted to the `/pipelines/:pipeline` API endpoint to update the mutator for `slack_pipeline`, resulting in an `HTTP/1.1 200 OK` response and the updated pipeline definition.

We support [JSON merge patches][4], so you must set the `Content-Type` header to `application/merge-patch+json` for PATCH requests.

{{< code shell >}}
curl -X PATCH \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/merge-patch+json' \
-d '{
  "workflows": [
    {
      "mutator": {
        "api_version": "core/v2",
        "type": "Mutator",
        "name": "javascript_mutator_2"
      }
    }
  ]
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/pipelines/slack_pipeline
{{< /code >}}

### API Specification

/pipelines/:pipeline (PATCH) | 
----------------|------
description     | Updates the specified Sensu pipeline.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/pipelines/slack_pipeline
payload         | {{< code shell >}}
{
  "workflows": [
    {
      "mutator": {
        "api_version": "core/v2",
        "type": "Mutator",
        "name": "javascript_mutator"
      }
    }
  ]
}
{{< /code >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a pipeline

The `/pipelines/:pipeline` API endpoint provides HTTP DELETE access to delete a pipeline from Sensu (specified by the pipeline name).

### Example

The following example shows a request to the `/pipelines/:pipeline` API endpoint to delete `slack_pipeline`, resulting in a successful `HTTP/1.1 204 No Content` response:

{{< code shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/core/v2/namespaces/default/pipelines/slack_pipeline \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

### API Specification

/pipelines/:pipeline (DELETE) | 
--------------------------|------
description               | Removes the specified pipeline from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/default/pipelines/slack_pipeline
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a subset of pipelines with response filtering

The `/pipelines` API endpoint supports [response filtering][3] for a subset of pipeline data based on labels and the following fields:

- `pipeline.name`
- `pipeline.namespace`

### Example

The following example demonstrates a request to the `/pipelines` API endpoint with [response filtering][3] for only [pipeline definitions][1] in the `production` namespace:

{{< code shell >}}
curl -H "Authorization: Key $SENSU_API_KEY" http://127.0.0.1:8080/api/core/v2/pipelines -G \
--data-urlencode 'fieldSelector=pipeline.namespace == production'
{{< /code >}}

The example request will result in a successful `HTTP/1.1 200 OK` response and a JSON array that contains only [pipeline definitions][1] in the `production` namespace:

{{< code text >}}
[
  {
    "metadata": {
      "name": "sensu_email_alerts",
      "namespace": "production",
      "created_by": "admin"
    },
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
  },
  {
    "metadata": {
      "name": "sensu_to_sumo",
      "namespace": "production",
      "created_by": "admin"
    },
    "workflows": [
      {
        "name": "logs_to_sumologic",
        "handler": {
          "name": "sumologic",
          "type": "Handler",
          "api_version": "core/v2"
        }
      }
    ]
  }
]
{{< /code >}}

{{% notice note %}}
**NOTE**: Read [API response filtering](../../#response-filtering) for more filter statement examples that demonstrate how to filter responses using different operators with label and field selectors.
{{% /notice %}}

### API Specification

/pipelines (GET) with response filters | 
---------------|------
description    | Returns the list of pipelines that match the [response filters][3] applied in the API request.
example url    | http://hostname:8080/api/core/v2/pipelines
pagination     | This endpoint supports [pagination][4] using the `limit` and `continue` query parameters.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "metadata": {
      "name": "sensu_email_alerts",
      "namespace": "production",
      "created_by": "admin"
    },
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
  },
  {
    "metadata": {
      "name": "sensu_to_sumo",
      "namespace": "production",
      "created_by": "admin"
    },
    "workflows": [
      {
        "name": "logs_to_sumologic",
        "handler": {
          "name": "sumologic",
          "type": "Handler",
          "api_version": "core/v2"
        }
      }
    ]
  }
]
{{< /code >}}


[1]: ../../../observability-pipeline/observe-process/pipelines/
[2]: ../../#pagination
[3]: ../../#response-filtering
[4]: https://tools.ietf.org/html/rfc7396
