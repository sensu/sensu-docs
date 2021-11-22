---
title: "Pipeline resource API"
linkTitle: "Pipeline Resource API"
description: "The Sensu pipeline resource API provides HTTP access to pipeline data. This reference includes examples for returning lists of pipelines, creating a Sensu pipeline, and more. Read on for the full reference."
api_title: "Pipelines (resource) API"
type: "api"
version: "6.5"
product: "Sensu Go"
menu:
  sensu-go-6.5:
    parent: api
---

{{% notice warning %}}
**IMPORTANT**: [Pipeline resources](../../observability-pipeline/observe-process/pipelines/) are observation event processing [workflows](../../observability-pipeline/observe-process/pipelines/#workflows) made up of filters, mutators, and handlers.
Pipeline resources are different from the handler resources you can create with the [pipeline API](../pipeline/).<br><br>
The [pipeline API](../pipeline/) does not create pipeline resources.
Instead, it allows you to create handlers that can **only** be used in pipelines resources.
Read the [Sumo Logic metrics handlers reference](../../observability-pipeline/observe-process/sumo-logic-metrics-handlers) and [TCP stream handlers reference](../../observability-pipeline/observe-process/tcp-stream-handlers) for more information about pipeline API handlers.
{{% /notice %}}

{{% notice note %}}
**NOTE**: Requests to the pipeline resource API require you to authenticate with a Sensu [API key](../#configure-an-environment-variable-for-api-key-authentication) or [access token](../#authenticate-with-the-authentication-api).
The code examples in this document use the [environment variable](../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all pipelines

The `/pipelines` API endpoint provides HTTP GET access to [pipeline][1] data.

### Example

The following example demonstrates a request to the `/pipelines` API endpoint, resulting in a JSON array that contains [pipeline definitions][1].

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/pipelines \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
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
output         | {{< code shell >}}
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

In the following example, an HTTP POST request is submitted to the `/pipelines` API endpoint to create the pipeline resource `labeled_emails`.
The request returns a successful HTTP `201 Created` response.

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

HTTP/1.1 201 Created
{{< /code >}}

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

In the following example, querying the `/pipelines/:pipeline` API endpoint returns a JSON map that contains the requested [`:pipeline` definition][1] (in this example, for the `:pipeline` named `labeled_emails`).

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/pipelines/labeled_emails \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
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
output               | {{< code json >}}
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

In the following example, an HTTP PUT request is submitted to the `/pipelines/:pipeline` API endpoint to update `slack_pipeline` to use `javascript_mutator` instead of the `add_labels` mutator.
The request returns a successful HTTP `201 Created` response.

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

HTTP/1.1 201 Created
{{< /code >}}

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
Use a [PUT request](#pipelinespipeline-put) instead.<br><br>
Also, you cannot add elements to an array with a PATCH request &mdash; you must replace the entire array.
{{% /notice %}}

### Example

In the following example, an HTTP PATCH request is submitted to the `/pipelines/:pipeline` API endpoint to update the mutator for `slack_pipeline`, resulting in an HTTP `200 OK` response and the updated pipeline definition.

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

HTTP/1.1 200 OK
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

The following example shows a request to the `/pipelines/:pipeline` API endpoint to delete the pipeline ` `, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/core/v2/namespaces/default/pipelines/slack_pipeline \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification

/pipelines/:pipeline (DELETE) | 
--------------------------|------
description               | Removes the specified pipeline from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/default/pipelines/slack_pipeline
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../observability-pipeline/observe-process/pipelines/
[2]: ../#pagination
[3]: ../#response-filtering
[4]: https://tools.ietf.org/html/rfc7396
