---
title: "core/v2/tessen"
description: "Read this API documentation for information about Sensu core/v2/tessen API endpoints, which provide HTTP access to manage Tessen configuration."
core_api_title: "core/v2/tessen"
type: "core_api"
version: "6.4"
product: "Sensu Go"
menu:
  sensu-go-6.4:
    parent: core
---

{{% notice note %}}
**NOTE**: Requests to `core/v2/tessen` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-auth-api-endpoints).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

The core/v2/tessen API endpoints provide HTTP access to manage [Tessen][1] configuration.
Access to core/v2/tessen is restricted to the default [`admin` user][2].

## Get the active Tessen configuration {#tessen-get}

The `/tessen` API endpoint provides HTTP GET access to the active Tessen configuration.

### Example {#tessen-get-example}

The following example demonstrates an HTTP GET request to the `/tessen` API endpoint.
The request returns an HTTP `200 OK` response and a JSON map that contains the active Tessen configuration, indicating whether Tessen is enabled.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/tessen \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
{
  "opt_out": false
}
{{< /code >}}

### API Specification {#tessen-get-specification}

/tessen (GET)  | 
---------------|------
description    | Returns the active Tessen configuration. An `"opt_out": false` response indicates that Tessen is enabled. An `"opt_out": true` response indicates that Tessen is disabled.
example url    | http://hostname:8080/api/core/v2/tessen
response type  | Map
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
example output | {{< code shell >}}
{
  "opt_out": false
}
{{< /code >}}

## Opt in to or out of Tessen {#tessen-put}

The `/tessen` API endpoint provides HTTP PUT access to opt in to or opt out of Tessen for unlicensed Sensu instances.

{{% notice note %}}
**NOTE**: Tessen is enabled by default on Sensu backends and required for [licensed](../../../operations/maintain-sensu/license) Sensu instances.
If you have a licensed instance and want to opt out of Tessen, contact your account manager.
{{% /notice %}}

### Example {#tessen-put-example}

In the following example, an HTTP PUT request is submitted to the `/tessen` API endpoint to opt in to Tessen using the `opt_out` attribute.
The request returns an HTTP `200 OK` response and the resulting Tessen configuration.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "opt_out": false
}' \
http://127.0.0.1:8080/api/core/v2/tessen

HTTP/1.1 200 OK
{
  "opt_out": false
}
{{< /code >}}

### API Specification {#tessen-put-specification}

/tessen (PUT) | 
----------------|------
description     | Updates the active Tessen configuration for unlicensed Sensu instances. Tessen is enabled by default on Sensu backends and required for [licensed][3] Sensu instances.
example url     | http://hostname:8080/api/core/v2/tessen
request parameters | Required: `opt_out` (for unlicensed instances, set to `false` to enable Tessen; set to `true` to opt out of Tessen).
response codes   | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
example output | {{< code shell >}}
{
  "opt_out": false
}
{{< /code >}}

[1]: ../../../operations/monitor-sensu/tessen/
[2]: ../../../operations/control-access/rbac#default-users
[3]: ../../../operations/maintain-sensu/license
