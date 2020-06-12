---
title: "API overview"
linkTitle: "API Overview"
description: "The Sensu backend REST API provides access to Sensu workflow configurations and monitoring event data. Read this guide for an overview of the Sensu Go API, including URL format, data format, versioning, and more."
weight: 10
version: "5.17"
product: "Sensu Go"
menu:
  sensu-go-5.17:
    parent: api
---

- [URL format](#url-format)
- [Data format](#data-format)
- [Versioning](#versioning)
- [Request size limit](#request-size-limit)
- [Access control](#access-control)
  - [Authentication quickstart](#authentication-quickstart)
- [Pagination](#pagination)
  - [Limit query parameter](#limit-query-parameter)
  - [Continue query parameter](#continue-query-parameter)
- [Response filtering](#response-filtering)
  - [Label selector](#label-selector)
  - [Field selector](#field-selector)
  - [Operators](#operators)
  - [Combined selectors](#combined-selectors)
  - [Examples](#examples)

**API version: v2**

The Sensu backend REST API provides access to Sensu workflow configurations and monitoring event data.
For information about the Sensu agent API, see the [agent reference][4].

## URL format

Sensu API endpoints use the standard URL format `/api/{group}/{version}/namespaces/{namespace}` where:

- `{group}` is the API group: `core`.
- `{version}` is the API version: `v2`.
- `{namespace}` is the namespace name.
The examples in these API docs use the `default` namespace.
The Sensu API requires the authenticated user to have the correct access permissions for the namespace specified in the URL.
If the authenticated user has the correct cluster-wide permissions, you can leave out the `/namespaces/{namespace}` portion of the URL to access Sensu resources across namespaces.
See the [RBAC reference][3] for more information about configuring Sensu users and access controls.

_**NOTE**: The [authentication API][12], [authentication providers API][15], and [health API][5] do not follow this standard URL format._

## Data format

The Sensu API uses JSON-formatted requests and responses.
In terms of [sensuctl output types][1], the Sensu API uses the `json` format, not `wrapped-json`.

## Versioning

The Sensu Go API is versioned according to the format `v{majorVersion}{stabilityLevel}{iterationNumber}`, in which `v2` is stable version 2.
The Sensu API guarantees backward compatibility for stable versions of the API.

Sensu does not guarantee that an alpha or beta API will be maintained for any period of time.
Consider alpha versions under active development &mdash; they may not be published for every release.
Beta APIs are more stable than alpha versions, but they offer similarly short-lived lifespans and also are not guaranteed to convert programmatically when the API is updated.

## Request size limit

API request bodies are limited to 0.512 MB in size.

## Access control

With the exception of the [health API][5] and [metrics API][6], the Sensu API requires authentication using a JSON Web Token (JWT) access token.
Use the [authentication API][12] and your Sensu username and password to generate access tokens and refresh tokens.
The Sensu API docs use `$SENSU_ACCESS_TOKEN` to represent a valid access token in API requests.

### Authentication quickstart

To set up a local API testing environment, save your Sensu credentials and token as environment variables:

{{< highlight shell >}}
# Requires curl and jq
export SENSU_USER=YOUR_USERNAME && SENSU_PASS=YOUR_PASSWORD

export SENSU_ACCESS_TOKEN=`curl -X GET -u "$SENSU_USER:$SENSU_PASS" -s http://localhost:8080/auth | jq -r ".access_token"`
{{< /highlight >}}

### Basic authentication using the authentication API

The [`/auth` API endpoint][10] lets you generate short-lived API tokens using your Sensu username and password.

1. Retrieve an access token for your user.
For example, to generate an access token using example admin credentials:
{{< highlight shell >}}
curl -u 'YOUR_USERNAME:YOUR_PASSWORD' http://localhost:8080/auth
{{< /highlight >}}
The access token should be included in the output, along with a refresh token:
{{< highlight shell >}}
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": 1544582187,
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
{{< /highlight >}}

2. Use the access token in the authentication header of the API request.
For example:
{{< highlight shell >}}
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events
{{< /highlight >}}

3. Refresh your access token every 15 minutes.
Access tokens last for approximately 15 minutes.
When your token expires, you should see a `401 Unauthorized` response from the API.
To generate a new access token, use the [`/auth/token` API endpoint][11], including the expired access token in the authorization header and the refresh token in the request body:
{{< highlight shell >}}
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
-H 'Content-Type: application/json' \
-d '{"refresh_token": "eyJhbGciOiJIUzI1NiIs..."}' \
http://127.0.0.1:8080/auth/token
{{< /highlight >}}
The new access token should be included in the output:
{{< highlight shell >}}
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": 1561055277,
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
{{< /highlight >}}

### Generate an API token using sensuctl

You can also generate an API access token using the sensuctl command line tool.
The user credentials that you use to log in to sensuctl determine your permissions to get, list, create, update, and delete resources with the Sensu API.

1. [Install and log in to sensuctl][2].

2. Retrieve an access token for your user:
{{< highlight shell >}}
cat ~/.config/sensu/sensuctl/cluster|grep access_token
{{< /highlight >}}
The access token should be included in the output:
{{< highlight shell >}}
"access_token": "eyJhbGciOiJIUzI1NiIs...",
{{< /highlight >}}

3. Copy the access token into the authentication header of the API request.
For example:
{{< highlight shell >}}
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events
{{< /highlight >}}

4. Refresh your access token every 15 minutes.
Access tokens last for approximately 15 minutes.
When your token expires, you should see a `401 Unauthorized` response from the API.
To regenerate a valid access token, run any sensuctl command (like `sensuctl event list`) and repeat step 2.

### Authenticate with an API key

Each Sensu API key (core/v2.APIKey) is a persistent UUID that maps to a stored Sensu username.
The advantages of authenticating with API keys rather than [access tokens][14] include:

- **More efficient integration**: Check and handler plugins and other code can integrate with the Sensu API without implementing the logic required to authenticate via the `/auth` API endpoint to periodically refresh the access token
- **Improved security**: API keys do not require providing a username and password in check or handler definitions
- **Better admin control**: API keys can be created and revoked without changing the underlying user's password, but keep in mind that API keys will continue to work even if the user's password changes

API keys are cluster-wide resources, so only cluster admins can grant, view, and revoke them.

_**NOTE**: API keys are not supported for authentication providers such as LDAP and OIDC._

#### API key authentication

Similar to the `Bearer [token]` Authorization header, `Key [api-key]` will be accepted as an Authorization header for authentication.

For example, a JWT `Bearer [token]` Authorization header might be:

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/namespaces/default/checks
{{< /highlight >}}

If you're using `Key [api-key]` to authenticate instead, the Authorization header might be:

{{< highlight shell >}}
curl -H "Authorization: Key $SENSU_API_KEY" http://127.0.0.1:8080/api/core/v2/namespaces/default/checks
{{< /highlight >}}

#### Example

{{< highlight shell >}}
$ curl -H "Authorization: Key 7f63b5bc-41f4-4b3e-b59b-5431afd7e6a2" http://127.0.0.1:8080/api/core/v2/namespaces/default/checks

HTTP/1.1 200 OK
[
  {
    "command": "check-cpu.sh -w 75 -c 90",
    "handlers": [
      "slack"
    ],
    "interval": 60,
    "publish": true,
    "subscriptions": [
      "linux"
    ],
    "metadata": {
      "name": "check-cpu",
      "namespace": "default"
    }
  }
]
{{< /highlight >}}

## Pagination

The Sensu API supports response pagination for most `core/v2` GET endpoints that return an array.
You can request a paginated response with the `limit` and `continue` query parameters.

### Limit query parameter

The following request limits the response to a maximum of two objects:

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/users?limit=2 -H "Authorization: Bearer $SENSU_ACCESS_TOKEN"
{{< /highlight >}}

The response includes the available objects up to the specified limit.

### Continue query parameter

If more objects are available beyond the [limit][16] you specified in a request, the response header includes a `Sensu-Continue` token you can use to request the next page of objects.

For example, the following response indicates that more than two users are available because it provides a `Sensu-Continue` token in the response header:

{{< highlight shell >}}
HTTP/1.1 200 OK
Content-Type: application/json
Sensu-Continue: L2RlZmF1bU2Vuc3UtTWFjQ
Sensu-Entity-Count: 3
Sensu-Entity-Limit: 100
Sensu-Entity-Warning: 
Date: Fri, 14 Feb 2020 15:44:25 GMT
Content-Length: 132
[
  {
    "username": "alice",
    "groups": [
      "ops"
    ],
    "disabled": false
  },
  {
    "username": "bob",
    "groups": [
      "ops"
    ],
    "disabled": false
  }
]
{{< /highlight >}}

To request the next two available users, use the `Sensu-Continue` token included in the response header:

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/users?limit=2&continue=L2RlZmF1bU2Vuc3UtTWFjQ \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"
{{< /highlight >}}

If the response header does not include a `Sensu-Continue` token, there are no further objects to return.
For example, this response header indicates that no further users are available:

{{< highlight shell >}}
HTTP/1.1 200 OK
Content-Type: application/json
Sensu-Entity-Count: 3
Sensu-Entity-Limit: 100
Sensu-Entity-Warning: 
Date: Fri, 14 Feb 2020 15:46:02 GMT
Content-Length: 54
[
  {
    "username": "alice",
    "groups": [
      "ops"
    ],
    "disabled": false
  }
]
{{< /highlight >}}

## Response filtering

**COMMERCIAL FEATURE**: Access API response filtering in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][8].

The Sensu API supports response filtering for all GET endpoints that return an array.
You can filter resources based on their labels with the `labelSelector` query parameter and based on certain pre-determined fields with the `fieldSelector` query parameter.

_**NOTE**: To use label and field selectors in the Sensu web UI, see [web UI filtering][13]._

### Label selector

The `labelSelector` query parameter allows you to group resources by the label attributes specified in the resource metadata object.
All resources support labels within the [metadata object][9].

The label selector does not work with values that contain special characters like hyphens and underscores.

### Field selector

The `fieldSelector` query parameter allows you to organize and select subsets of resources based on certain fields.
Here's the list of available fields:

| Resource    | Fields      |
| ----------- | ----------- | 
| Asset | `asset.name` `asset.namespace` `asset.filters` |
| Check | `check.name` `check.namespace` `check.handlers` `check.publish` `check.round_robin` `check.runtime_assets` `check.subscriptions`|
| ClusterRole | `clusterrole.name` |
| ClusterRoleBinding | `clusterrolebinding.name` `clusterrolebinding.role_ref.name` `clusterrolebinding.role_ref.type`|
| Entity | `entity.name` `entity.namespace` `entity.deregister` `entity.entity_class` `entity.subscriptions` |
| Event | `event.name` `event.namespace` `event.check.handlers` `event.check.name` `event.check.publish` `event.check.round_robin` `event.check.runtime_assets` `event.check.status` `event.check.subscriptions` `event.entity.deregister` `event.entity.entity_class` `event.entity.name` `event.entity.subscriptions` |
| Extension | `extension.name` `extension.namespace` |
| Filter | `filter.name` `filter.namespace` `filter.action` `filter.runtime_assets` |
| Handler | `handler.name` `handler.namespace` `handler.filters` `handler.handlers` `handler.mutator` `handler.type`| 
| Hook | `hook.name` `hook.namespace` |
| Mutator | `mutator.name` `mutator.namespace` `mutator.runtime_assets` |
| Namespace | `namespace.name` |
| Role | `role.name` `role.namespace` |
| RoleBinding | `rolebinding.name` `rolebinding.namespace` `rolebinding.role_ref.name` `rolebinding.role_ref.type`|
| Secrets | `secret.name` `secret.namespace` `secret.provider` `secret.id` |
| SecretsProviders | `provider.name` `provider.namespace` |
| Silenced | `silenced.name` `silenced.namespace` `silenced.check` `silenced.creator` `silenced.expire_on_resolve` `silenced.subscription` |
| User | `user.username` `user.disabled` `user.groups` |

The `fieldSelector` parameter does not work with values that contain special characters like hyphens and underscores.

### Operators

Sensu's API response filtering supports two equality-based operators, two set-based operators, and one logical operator.

| operator | description     | example                |
| -------- | --------------- | ---------------------- |
| `==`     | Equality        | `check.publish == true`
| `!=`     | Inequality      | `check.namespace != "default"`
| `in`     | Included in     | `linux in check.subscriptions`
| `notin`  | Not included in | `slack notin check.handlers`
| `&&`     | Logical AND     | `check.publish == true && slack in check.handlers`

#### Equality-based operators

Sensu's two _equality-based_ operators are `==` (equality) and `!=` (inequality).

For example, to retrieve only checks with the label `type` and value `server`: 

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'labelSelector=type == "server"'
{{< /highlight >}}

_**NOTE**: Use the flag `--data-urlencode` in cURL to encode the query parameter. 
Include the `-G` flag so the request appends the query parameter data to the URL._

To retrieve checks that are not in the `production` namespace:

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'fieldSelector=check.namespace != "production"'
{{< /highlight >}}

#### Set-based operators

Sensu's two _set-based_ operators for lists of values are `in` and `notin`.

For example, to retrieve checks with a `linux` subscription:

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'fieldSelector=linux in check.subscriptions'
{{< /highlight >}}

To retrieve checks that do not use the `slack` handler:

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'fieldSelector=slack notin check.handlers'
{{< /highlight >}}

The `in` and `notin` operators have two important conditions:

- First, they only work when the underlying value you're filtering for is a string.
You can filter for strings and arrays of strings with `in` and `notin` operators, but you cannot use them to filter for integer, float, array, or Boolean values.
- Second, to filter for a string, the string must be to the **left** of the operator: `string [in|notin] selector`.
To filter for an array of strings, the array must be to the **right** of the operator: `selector [in|notin] [string1,string2]`.

#### Logical operator

Sensu's logical operator is `&&` (AND).
Use it to combine multiple statements separated with the logical operator in field and label selectors.

For example, the following cURL request retrieves checks that are not configured to be published **and** include the `linux` subscription:

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'fieldSelector=check.publish != true && linux in check.subscriptions'
{{< /highlight >}}

To retrieve checks that are not published, include a `linux` subscription, and are in the `dev` namespace:

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'fieldSelector=check.publish != true && linux in check.subscriptions && dev in check.namespace'
{{< /highlight >}}

_**NOTE**: Sensu does not have the `OR` logical operator._

### Combined selectors

You can use field and label selectors in a single request.
For example, to retrieve only checks that include a `linux` subscription *and* do not include a label for type `server`:

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'fieldSelector=linux in check.subscriptions' \
--data-urlencode 'labelSelector=type != "server"'
{{< /highlight >}}

### Examples

#### Use selectors with arrays of strings

To retrieve checks that are in either the `dev` or `production` namespace:

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'fieldSelector=check.namespace in [dev,production]'
{{< /highlight >}}

#### Filter events by entity or check

To retrieve events for a specific check (`checkhttp`):

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/events -G \
--data-urlencode 'fieldSelector=checkhttp in event.check.name'
{{< /highlight >}}

Similary, to retrieve only events for the `server` entity:

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/events -G \
--data-urlencode 'fieldSelector=server in event.entity.name'
{{< /highlight >}}

#### Filter events by severity

Use the `event.check.status` field selector to retrieve events by severity.
For example, to retrieve all events at `2` (CRITICAL) status:

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/events -G \
--data-urlencode 'fieldSelector=event.check.status == "2"'
{{< /highlight >}}

#### Filter all incidents

To retrieve all incidents (all events whose status is not `0`):

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/events -G \
--data-urlencode 'fieldSelector=event.entity.status != "0"'
{{< /highlight >}}

#### Filter checks, entities, or events by subscription

To list all checks that include the `linux` subscription:

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'fieldSelector=linux in check.subscriptions'
{{< /highlight >}}

Similarly, to list all entities that include the `linux` subscription:

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/entities -G \
--data-urlencode 'fieldSelector=linux in entity.subscriptions'
{{< /highlight >}}

To list all events for the `linux` subscription, use the `event.entity.subscriptions` field selector:

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/events -G \
--data-urlencode 'fieldSelector=linux in event.entity.subscriptions'
{{< /highlight >}}


[1]: ../../sensuctl/reference#preferred-output-format
[2]: ../../installation/install-sensu#install-sensuctl
[3]: ../../reference/rbac/
[4]: ../../reference/agent/
[5]: ../health/
[6]: ../metrics/
[8]: ../../commercial/
[9]: ../../reference/entities#metadata-attributes
[10]: ../auth/#the-auth-api-endpoint
[11]: ../auth/#the-authtoken-api-endpoint
[12]: ../auth/
[13]: ../../web-ui/filter/
[14]: #authentication-quickstart
[15]: ../authproviders/
[16]: #limit-query-parameter
