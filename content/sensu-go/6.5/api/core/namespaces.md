---
title: "core/v2/namespaces"
description: "Read this API documentation for information about Sensu core/v2/namespaces API endpoints, with examples for retrieving and managing namespaces."
core_api_title: "core/v2/namespaces"
type: "core_api"
version: "6.5"
product: "Sensu Go"
menu:
  sensu-go-6.5:
    parent: core
---

{{% notice note %}}
**NOTE**: Requests to `core/v2/namespaces` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-auth-api-endpoints).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all namespaces

The `/namespaces` API endpoint provides HTTP GET access to [namespace][1] data.

### Example {#namespaces-get-example}

The following example demonstrates a GET request to the `/namespaces` API endpoint:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a JSON array that contains [namespace definitions][1]:

{{< code text >}}
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
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response filtering | This endpoint supports [API response filtering][3].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
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

In the following example, an HTTP POST request is submitted to the `/namespaces` API endpoint to create the namespace `development`:

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "name": "development"
}' \
http://127.0.0.1:8080/api/core/v2/namespaces
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

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

In the following example, an HTTP PUT request is submitted to the `/namespaces/:namespace` API endpoint to create the namespace `development`:

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "name": "development"
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/development
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

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

The following example shows a request to the `/namespaces/:namespace` API endpoint to delete the namespace `development`, resulting in a successful `HTTP/1.1 204 No Content` response.

{{< code shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/core/v2/namespaces/development \
-H "Authorization: Key $SENSU_API_KEY"
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

## Get a subset of namespaces with response filtering

The `/namespaces` API endpoint supports [response filtering][3] for a subset of namespace data based on labels and the field `namespace.name`.

### Example

The following example demonstrates a request to the `/namespaces` API endpoint with [response filtering][3] for only the [namespace definitions][1] for the `production` namespace:

{{< code shell >}}
curl -H "Authorization: Key $SENSU_API_KEY" http://127.0.0.1:8080/api/core/v2/namespaces -G \
--data-urlencode 'fieldSelector=namespace.name == production'
{{< /code >}}

The example request will result in a successful `HTTP/1.1 200 OK` response and a JSON array that contains only [namespace definitions][1] for the `production` namespace:

{{< code text >}}
[
  {
    "name": "production"
  }
]
{{< /code >}}

{{% notice note %}}
**NOTE**: Read [API response filtering](../../#response-filtering) for more filter statement examples that demonstrate how to filter responses using different operators with label and field selectors.
{{% /notice %}}

### API Specification

/namespaces (GET) with response filters | 
---------------|------
description    | Returns the list of namespaces that match the [response filters][3] applied in the API request.
example url    | http://hostname:8080/api/core/v2/namespaces
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "name": "production"
  }
]
{{< /code >}}

## Get all namespaces for a specific user

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the `/user-namespaces` API endpoint in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../commercial/).
{{% /notice %}}

The `/user-namespaces` API endpoint provides HTTP GET access to the namespaces the current user can access.

### Example {#user-namespaces-get-example}

The following example demonstrates a GET request to the `/user-namespaces` API endpoint:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/user-namespaces \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The example request will result in a successful `HTTP/1.1 200 OK` response and a JSON array that contains only the namespaces the current user can access:

{{< code text >}}
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
output         | {{< code text >}}
[
  {
    "name": "default"
  },
  {
    "name": "development"
  }
]
{{< /code >}}


[1]: ../../../operations/control-access/namespaces/
[2]: ../../#pagination
[3]: ../../#response-filtering
