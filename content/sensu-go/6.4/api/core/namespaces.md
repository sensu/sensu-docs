---
title: "core/v2/namespaces"
description: "Sensu core/v2/namespaces API endpoints provide HTTP access to namespace data. This reference includes examples for retrieving namespaces, creating namespaces, and more."
core_api_title: "core/v2/namespaces"
type: "core_api"
version: "6.4"
product: "Sensu Go"
menu:
  sensu-go-6.4:
    parent: core
---

{{% notice note %}}
**NOTE**: Requests to `core/v2/namespaces` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-auth-api-endpoints).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all namespaces

The `/namespaces` API endpoint provides HTTP GET access to [namespace][1] data.

### Example {#namespaces-get-example}

The following example demonstrates a request to the `/namespaces` API endpoint, resulting in a JSON array that contains [namespace definitions][1].

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
[
  {
    "name": "default"
  },
  {
    "name": "development"
  }
]
{{< /code >}}

### API Specification {#namespaces-get-specification}

/namespaces (GET)  | 
---------------|------
description    | Returns the list of namespaces.
example url    | http://hostname:8080/api/core/v2/namespaces
pagination     | This endpoint supports pagination using the [`limit` query parameter][2].
response filtering | This endpoint supports [API response filtering][3].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code shell >}}
[
  {
    "name": "default"
  },
  {
    "name": "development"
  }
]
{{< /code >}}

## Create a new namespace

The `/namespaces` API endpoint provides HTTP POST access to create Sensu namespaces.

### Example {#namespaces-post-example}

In the following example, an HTTP POST request is submitted to the `/namespaces` API endpoint to create the namespace `development`.
The request returns a successful HTTP `201 Created` response.

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "name": "development"
}' \
http://127.0.0.1:8080/api/core/v2/namespaces

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#namespaces-post-specification}

/namespaces (POST) | 
----------------|------
description     | Creates a Sensu namespace.
example URL     | http://hostname:8080/api/core/v2/namespaces
payload         | {{< code shell >}}
{
  "name": "development"
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Create or update a namespace {#namespacesnamespace-put}

The `/namespaces/:namespace` API endpoint provides HTTP PUT access to create or update specific Sensu namespaces, by namespace name.

### Example {#namespacesnamespace-put-example}

In the following example, an HTTP PUT request is submitted to the `/namespaces/:namespace` API endpoint to create the namespace `development`.
The request returns a successful HTTP `201 Created` response.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "name": "development"
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/development

HTTP/1.1 201 Created
{{< /code >}}

### API Specification {#namespacesnamespace-put-specification}

/namespaces/:namespace (PUT) | 
----------------|------
description     | Creates or updates a Sensu namespace.
example URL     | http://hostname:8080/api/core/v2/namespaces/development
payload         | {{< code shell >}}
{
  "name": "development"
}
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a namespace {#namespacesnamespace-delete}

The `/namespaces/:namespace` API endpoint provides HTTP DELETE access to delete a namespace from Sensu (specified by the namespace name).

### Example {#namespacesnamespace-delete-example}

The following example shows a request to the `/namespaces/:namespace` API endpoint to delete the namespace `development`, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/core/v2/namespaces/development \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 204 No Content
{{< /code >}}

Namespaces must be empty before you can delete them.
If the response to your delete request includes `Error: resource is invalid: namespace is not empty`, the namespace may still contain events or other resources.
To remove all resources and events so that you can delete a namespace, use this sensuctl dump command (replace `<namespace-name>` with the namespace you want to empty):

{{< code shell >}}
sensuctl dump entities,events,assets,checks,filters,handlers,secrets/v1.Secret --namespace <namespace-name> | sensuctl delete
{{< /code >}}

### API Specification {#namespacesnamespace-delete-specification}

/namespaces/:namespace (DELETE) | 
--------------------------|------
description               | Removes the specified namespace from Sensu.
example url               | http://hostname:8080/api/core/v2/namespaces/development
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get all namespaces for a specific user

The `/user-namespaces` API endpoint provides HTTP GET access to the namespaces the user has access to.

### Example {#user-namespaces-get-example}

The following example demonstrates a request to the `/user-namespaces` API endpoint, resulting in a JSON array that contains the namespaces the user has access to.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/user-namespaces \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
[
  {
    "name": "default"
  },
  {
    "name": "development"
  }
]
{{< /code >}}

### API Specification {#namespaces-get-specification}

/user-namespaces (GET)  | 
---------------|------
description    | Returns the list of namespaces a user has access to.
example url    | http://hostname:8080/api/enterprise/user-namespaces
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code shell >}}
[
  {
    "name": "default"
  },
  {
    "name": "development"
  }
]
{{< /code >}}

[1]: ../../../operations/control-access/rbac/
[2]: ../../#limit-query-parameter
[3]: ../../#response-filtering
