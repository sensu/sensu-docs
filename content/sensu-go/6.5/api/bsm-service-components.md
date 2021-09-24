---
title: "enterprise/bsm/v1/service-components"
description: "The business service monitoring API controls the service components and rule templates you can configure for your business services. This reference describes the Sensu business service monitoring API, including examples. Read on for the full reference."
enterpriseapi_title: "enterprise/bsm/v1/service-components"
type: "enterprise_api"
version: "6.5"
product: "Sensu Go"
menu:
  sensu-go-6.5:
    parent: api
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access business service monitoring (BSM) in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

{{% notice note %}}
**NOTE**: Business service monitoring (BSM) is in public preview and is subject to change.

Requests to the business service monitoring API require you to authenticate with a Sensu [API key](../#configure-an-environment-variable-for-api-key-authentication) or [access token](../#authenticate-with-the-authentication-api).
The code examples in this document use the [environment variable](../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
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

