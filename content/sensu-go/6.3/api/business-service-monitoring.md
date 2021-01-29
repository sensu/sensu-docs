---
title: "Business service monitoring API"
linkTitle: "Business Service Monitoring API"
description: "The business service monitoring API controls the service components and rule templates you can configure for your business services. This reference describes the Sensu business service monitoring API, including examples. Read on for the full reference."
api_title: "Business service monitoring API"
type: "api"
version: "6.3"
product: "Sensu Go"
menu:
  sensu-go-6.3:
    parent: api
---

**COMMERCIAL FEATURE**: Access business service monitoring (BSM) in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][1].

{{% notice note %}}
**NOTE**: Requests to the business service monitoring API require you to authenticate with a Sensu [access token](../#authenticate-with-the-authentication-api) or [API key](../#authenticate-with-an-api-key).
The code examples in this document use the [environment variable](../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests. 
{{% /notice %}}

## Get all service components

The `/service-components` API endpoint provides HTTP GET access to a list of service components.

### Example

The following example demonstrates a request to the `/service-components` API endpoint, resulting in a list of service components.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/bsm/v1/namespace/default/service-components \
-H "Authorization: Key $SENSU_API_KEY"
[
  {
    "type": "Component",
    "api_version": "bsm/v1",
    "metadata": {
      "name": "postgresql-component"
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
]
{{< /code >}}

### API Specification

/service-components (GET)  | 
---------------|------
description    | Returns the list of service components.
example url    | http://hostname:8080/api/enterprise/bsm/v1/namespace/default/service-components
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code json >}}
[
  {
    "type": "Component",
    "api_version": "bsm/v1",
    "metadata": {
      "name": "postgresql-component"
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
]
{{< /code >}}

## Create a new service component

The `/service-components` API endpoint provides HTTP POST access to create service components.

### Example

The following example demonstrates a request to the `/service-components` API endpoint to create the service component `postgresql-component`.

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '' \
http://127.0.0.1:8080/api/enterprise/bsm/v1/namespace/default/service-components

HTTP/1.1 200 OK
{{< /code >}}

### API Specification

/service-components (POST) | 
----------------|------
description     | Creates a new business service component (if none exists).
example URL     | http://hostname:8080/api/enterprise/bsm/v1/namespace/default/service-components
payload         | {{< code json >}}
{{< /code >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific service component

The `/service-components/:service-component` API endpoint provides HTTP GET access to data for a specific `:service-component`, by service compnent name.

### Example

In the following example, querying the `/service-components/:service-component` API endpoint returns a JSON map that contains the requested `:service-component`.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/bsm/v1/namespace/default/service-components/my_replicator \
-H "Authorization: Key $SENSU_API_KEY"

{{< /code >}}

### API Specification

/service-components/:service-component (GET) | 
---------------------|------
description          | Returns the specified business service component.
example url          | http://hostname:8080/api/enterprise/bsm/v1/namespace/default/service-components/postgresql-component
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code json >}}
{{< /code >}}

## Create or update a service component

The `/service-components/:service-component` API endpoint provides HTTP PUT access to create or update a specific `:service-component`, by service component name.

### Example

The following example demonstrates a request to the `/service-components/:service-component` API endpoint to update the service component `postgresql-component`.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '' \
http://127.0.0.1:8080/api/enterprise/bsm/v1/namespace/default/service-components/postgresql-component

HTTP/1.1 200 OK
{{< /code >}}

### API Specification

/service-components/:service-component (PUT) | 
----------------|------
description     | Creates or updates the specified business service component.
example URL     | http://hostname:8080/api/enterprise/bsm/v1/namespace/default/service-components/postgresql-component
payload         | {{< code json >}}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a service component

The `/service-components/:service-component` API endpoint provides HTTP DELETE access to delete the specified service component from Sensu.

### Example

The following example shows a request to the `/service-components/:service-component` API endpoint to delete the service component `postgresql-component`, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/enterprise/bsm/v1/namespace/default/service-components/postgresql-component

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification

/service-components/:service-component (DELETE) | 
--------------------------|------
description               | Deletes the specified business service component from Sensu.
example url               | http://hostname:8080/api/enterprise/bsm/v1/namespace/default/service-components/postgresql-component
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get all rule templates

The `/rule-templates` API endpoint provides HTTP GET access to a list of rule templates.

### Example

The following example demonstrates a request to the `/rule-templates` API endpoint, resulting in a list of rule templates.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/bsm/v1/namespace/default/rule-templates \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK

{{< /code >}}

### API Specification

/rule-templates (GET)  | 
---------------|------
description    | Returns the list of rule templates.
example url    | http://hostname:8080/api/enterprise/bsm/v1/namespace/default/rule-templates
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code json >}}

{{< /code >}}

## Get a specific rule template

The `/rule-templates/:rule-template` API endpoint provides HTTP GET access to data for a specific rule template by name.

### Example

In the following example, querying the `/rule-templates/:rule-template` API endpoint returns a JSON map that contains the requested `:cluster`.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/bsm/v1/namespace/default/rule-templates/us-west-2a \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK

{{< /code >}}

### API Specification

/rule-templates/:cluster (GET) | 
---------------------|------
description          | Returns the specified rule template.
example url          | http://hostname:8080/api/enterprise/bsm/v1/namespace/default/rule-templates/us-west-2a
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code json >}}

{{< /code >}}

## Create or update a rule template

The `/rule-templates/:rule-template` API endpoint provides HTTP PUT access to create or update a specific rule template by name.

### Example

The following example demonstrates a request to the `/rule-templates/:rule-template` API endpoint to update the rule template `us-west-2a`.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '' \
http://127.0.0.1:8080/api/enterprise/bsm/v1/namespace/default/rule-templates/us-west-2a

HTTP/1.1 200 OK
{{< /code >}}

### API Specification

/rule-templates/:rule-template (PUT) | 
----------------|------
description     | Creates or updates the specified rule tempalte.
example URL     | http://hostname:8080/api/enterprise/bsm/v1/namespace/default/rule-templates/us-west-2a
payload         | {{< code json >}}

{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a rule template

The `/rule-templates/:rule-template` API endpoint provides HTTP DELETE access to delete the specified rule template from Sensu.

{{% notice note %}}
**NOTE**: Only cluster admins have DELETE access to clusters.
{{% /notice %}}

### Example

The following example shows a request to the `/rule-templates/:rule-template` API endpoint to delete the rule template `us-west-2a`, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/enterprise/bsm/v1/namespace/default/rule-templates/us-west-2a

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification

/rule-templates/:rule-template (DELETE) | 
--------------------------|------
description               | Deletes the specified rule template from Sensu.
example url               | http://hostname:8080/api/enterprise/bsm/v1/rule-templates/us-west-2a
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../../commercial/
