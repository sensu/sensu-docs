---
title: "API"
description: "Sensu API documentation"
weight: 60
product: "Sensu Go"
version: "5.18"
layout: "single"
menu:
  sensu-go-5.18:
    identifier: api
---


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

{{% notice note %}}
**NOTE**: The [authentication API](auth/), [authentication providers API](authproviders/), and [health API](health/) do not follow this standard URL format.
{{% /notice %}}

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

With the exception of the [authentication][12], [health][5], and [metrics][6] APIs, the Sensu API requires authentication using a JSON Web Token (JWT) [access token][20] or [API key][17].

Code examples in the Sensu API docs use the environment variable `$SENSU_API_KEY` to represent a valid API key in API requests.

### Authentication quickstart

To set up a local API testing environment, save your Sensu credentials and token as environment variables:

{{< code shell >}}
# Requires curl and jq
export SENSU_USER=YOUR_USERNAME && SENSU_PASS=YOUR_PASSWORD

export SENSU_ACCESS_TOKEN=`curl -X GET -u "$SENSU_USER:$SENSU_PASS" -s http://localhost:8080/auth | jq -r ".access_token"`
{{< /code >}}

The [sensuctl reference][7] demonstrates how to use the `sensuctl env` command to export your access token, token expiry time, and refresh token as environment variables.

### Authenticate with the authentication API

Use the [authentication API][12] and your Sensu username and password to generate access tokens and refresh tokens.
The [`/auth` API endpoint][12] lets you generate short-lived API tokens using your Sensu username and password.

1. Retrieve an access token for your user.
For example, to generate an access token using example admin credentials:
{{< code shell >}}
curl -u 'YOUR_USERNAME:YOUR_PASSWORD' http://localhost:8080/auth
{{< /code >}}
The access token should be included in the output, along with a refresh token:
{{< code shell >}}
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": 1544582187,
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
{{< /code >}}

2. Use the access token in the authentication header of the API request.
For example:
{{< code shell >}}
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events
{{< /code >}}

3. Refresh your access token every 15 minutes.
Access tokens last for approximately 15 minutes.
When your token expires, you should see a `401 Unauthorized` response from the API.
To generate a new access token, use the [`/auth/token` API endpoint][11], including the expired access token in the authorization header and the refresh token in the request body:
{{< code shell >}}
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
-H 'Content-Type: application/json' \
-d '{"refresh_token": "eyJhbGciOiJIUzI1NiIs..."}' \
http://127.0.0.1:8080/auth/token
{{< /code >}}
The new access token should be included in the output:
{{< code shell >}}
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": 1561055277,
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
{{< /code >}}

### Generate an API token with sensuctl

You can also generate an API access token using the sensuctl command line tool.
The user credentials that you use to log in to sensuctl determine your permissions to get, list, create, update, and delete resources with the Sensu API.

1. [Install and log in to sensuctl][2].

2. Retrieve an access token for your user:
{{< code shell >}}
cat ~/.config/sensu/sensuctl/cluster|grep access_token
{{< /code >}}
The access token should be included in the output:
{{< code shell >}}
"access_token": "eyJhbGciOiJIUzI1NiIs...",
{{< /code >}}

3. Copy the access token into the authentication header of the API request.
For example:
{{< code shell >}}
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events
{{< /code >}}

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

{{% notice note %}}
**NOTE**: API keys are not supported for authentication providers such as LDAP and OIDC.
{{% /notice %}}

#### Configure an environment variable for API key authentication

Code examples in the Sensu API docs use the environment variable `$SENSU_API_KEY` to represent a valid API key in API requests.

Use [sensuctl][18] or the [APIkeys API][19] to generate an API key.
Then, follow this example to export your API key to the `SENSU_API_KEY` environment variable you can use for API authentication:

{{< language-toggle >}}

{{< code bash >}}
export SENSU_API_KEY="83abef1e-e7d7-4beb-91fc-79ad90084d5b"
{{< /code >}}

{{< code cmd >}}
SET SENSU_API_KEY="83abef1e-e7d7-4beb-91fc-79ad90084d5b"
{{< /code >}}

{{< code powershell >}}
$Env:SENSU_API_KEY = "83abef1e-e7d7-4beb-91fc-79ad90084d5b"
{{< /code >}}

{{< /language-toggle >}}

#### Authorization header for API key authentication

Similar to the `Bearer [token]` Authorization header, `Key [api-key]` will be accepted as an Authorization header for authentication.

For example, a JWT `Bearer [token]` Authorization header might be:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/namespaces/default/checks
{{< /code >}}

If you're using `Key [api-key]` to authenticate instead, the Authorization header might be:

{{< code shell >}}
curl -H "Authorization: Key $SENSU_API_KEY" http://127.0.0.1:8080/api/core/v2/namespaces/default/checks
{{< /code >}}

### Example

This example uses the API key directly (rather than via an environment variable) to authenticate to the checks API:

{{< code shell >}}
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
      "namespace": "default",
      "created_by": "admin"
    }
  }
]
{{< /code >}}

## Pagination

The Sensu API supports response pagination for most `core/v2` GET endpoints that return an array.
You can request a paginated response with the `limit` and `continue` query parameters.

### Limit query parameter

The following request limits the response to a maximum of two objects:

{{< code shell >}}
curl http://127.0.0.1:8080/api/core/v2/users?limit=2 -H "Authorization: Bearer $SENSU_ACCESS_TOKEN"
{{< /code >}}

The response includes the available objects up to the specified limit.

### Continue query parameter

If more objects are available beyond the [limit][16] you specified in a request, the response header includes a `Sensu-Continue` token you can use to request the next page of objects.

For example, the following response indicates that more than two users are available because it provides a `Sensu-Continue` token in the response header:

{{< code shell >}}
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
{{< /code >}}

To request the next two available users, use the `Sensu-Continue` token included in the response header:

{{< code shell >}}
curl http://127.0.0.1:8080/api/core/v2/users?limit=2&continue=L2RlZmF1bU2Vuc3UtTWFjQ \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"
{{< /code >}}

If the response header does not include a `Sensu-Continue` token, there are no further objects to return.
For example, this response header indicates that no further users are available:

{{< code shell >}}
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
{{< /code >}}

## Response filtering

**COMMERCIAL FEATURE**: Access API response filtering in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][8].

The Sensu API supports response filtering for all GET endpoints that return an array.
You can filter resources based on their labels with the `labelSelector` query parameter and based on certain pre-determined fields with the `fieldSelector` query parameter.

{{% notice note %}}
**NOTE**: To use label and field selectors in the Sensu web UI, see [web UI filtering](../web-ui/filter/).
{{% /notice %}}

### Label selector

The `labelSelector` query parameter allows you to group resources by the label attributes specified in the resource metadata object.
All resources support labels within the [metadata object][9].

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
| Event | `event.is_silenced` `event.name` `event.namespace` `event.check.handlers` `event.check.is_silenced` `event.check.name` `event.check.publish` `event.check.round_robin` `event.check.runtime_assets` `event.check.status` `event.check.subscriptions` `event.entity.deregister` `event.entity.entity_class` `event.entity.name` `event.entity.subscriptions` |
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

### API-specific syntax

To create an API response filter, you'll write a brief filter statement.
The [operators][13] and [examples][15] sections demonstrate how to construct API response filter statements for different operators and specific purposes.

The filter statement construction is slightly different for different operators, but there are a few general syntax rules that apply to all filter statements.

#### Spaces in the filter statement

As shown in this example:

{{< code text >}}
'fieldSelector=silenced.expire_on_resolve == true'
{{< /code >}}

- **Do not** use spaces around the `=` between the selector type and the rest of the filter statement.
- **Do** use spaces around the operator (in this example, the `==`).

#### Quotation marks around the filter statement

Place the entire filter statement inside single quotes:

{{< code text >}}
'fieldSelector=linux in check.subscriptions'
{{< /code >}}

**Exception**: If the filter statement contains a *shell* variable, you must use double quotation marks around the statement:

{{< code text >}}
"labelSelector=host == $HOSTNAME"
{{< /code >}}

If you use single quotes around a filter statement that contains a shell variable, the single quotes will keep the variable intact instead of expanding it.

{{% notice note %}}
**NOTE**: This exception only applies to shell variables.
It does not apply for variables in languages that treat single and double quotation marks interchangeably, like JavaScript.
{{% /notice %}}

### Values that begin with a number or include special characters

If you are filtering for a value that begins with a number, place the value in double quotes:

{{< code text >}}
'fieldSelector=entity.name == "1b04994n"'
{{< /code >}}

Likewise, to use a label or field selector with string values that include special characters like hyphens and underscores, place the value in double quotes:

{{< code text >}}
'labelSelector:region == "us-west-1"'
{{< /code >}}

### Operators

Sensu's API response filtering supports two equality-based operators, two set-based operators, one substring matching operator, and one logical operator.

| operator  | description        | example                |
| --------- | ------------------ | ---------------------- |
| `==`      | Equality           | `check.publish == true`
| `!=`      | Inequality         | `check.namespace != "default"`
| `in`      | Included in        | `linux in check.subscriptions`
| `notin`   | Not included in    | `slack notin check.handlers`
| `matches` | Substring matching | `check.name matches "linux-"`
| `&&`      | Logical AND        | `check.publish == true && slack in check.handlers`

#### Equality-based operators

Sensu's two _equality-based_ operators are `==` (equality) and `!=` (inequality).

For example, to retrieve only checks with the label `type` and value `server`: 

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'labelSelector=type == "server"'
{{< /code >}}

{{% notice note %}}
**NOTE**: Use the flag `--data-urlencode` in cURL to encode the query parameter. 
Include the `-G` flag so the request appends the query parameter data to the URL.
{{% /notice %}}

To retrieve checks that are not in the `production` namespace:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'fieldSelector=check.namespace != "production"'
{{< /code >}}

#### Set-based operators

Sensu's two _set-based_ operators for lists of values are `in` and `notin`.

For example, to retrieve checks with a `linux` subscription:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'fieldSelector=linux in check.subscriptions'
{{< /code >}}

To retrieve checks that do not use the `slack` handler:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'fieldSelector=slack notin check.handlers'
{{< /code >}}

The `in` and `notin` operators have two important conditions:

- First, they only work when the underlying value you're filtering for is a string.
You can filter for strings and arrays of strings with `in` and `notin` operators, but you cannot use them to filter for integer, float, array, or Boolean values.
- Second, to filter for a string, the string must be to the **left** of the operator: `string [in|notin] selector`.
To filter for an array of strings, the array must be to the **right** of the operator: `selector [in|notin] [string1,string2]`.

#### Substring matching operator

Sensu's _substring matching_ operator is `matches`.

For example, to retrieve all checks whose name includes `linux`:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'fieldSelector=check.name matches "linux"'
{{< /code >}}

Suppose you are using Sensu to monitor 1000 entities that are named incrementally and according to technology.
For example, your webservers are named `webserver-1` through `webserver-25`, and your CPU entities are named `cpu-1` through `cpu-300`, and so on.
In this case, you can use `matches` to retrieve all of your `webserver` entities:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/entities -G \
--data-urlencode 'fieldSelector=entity.name matches "webserver-"'
{{< /code >}}

Similarly, if you have entities labeled for different regions, you can use `matches` to find the entities that are labeled for the US (e.g. `us-east-1`, `us-west-1`, and so on):

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/entities -G \
--data-urlencode 'labelSelector:region matches "us"'
{{< /code >}}

The `matches` operator only works when the underlying value you're filtering for is a string.
You can filter for strings and arrays of strings with the `matches` operator, but you cannot use it to filter for integer, float, array, or Boolean values.
Also, the string must be to the **right** of the operator: `selector matches string`.

#### Logical operator

Sensu's logical operator is `&&` (AND).
Use it to combine multiple statements separated with the logical operator in field and label selectors.

For example, the following cURL request retrieves checks that are not configured to be published **and** include the `linux` subscription:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'fieldSelector=check.publish != true && linux in check.subscriptions'
{{< /code >}}

To retrieve checks that are not published, include a `linux` subscription, and are in the `dev` namespace:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'fieldSelector=check.publish != true && linux in check.subscriptions && dev in check.namespace'
{{< /code >}}

{{% notice note %}}
**NOTE**: Sensu does not have the `OR` logical operator.
{{% /notice %}}

### Combined selectors

You can use field and label selectors in a single request.
For example, to retrieve only checks that include a `linux` subscription *and* do not include a label for type `server`:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'fieldSelector=linux in check.subscriptions' \
--data-urlencode 'labelSelector=type != "server"'
{{< /code >}}

### Examples

#### Values with special characters

To use a label or field selector with string values that include special characters like hyphens and underscores, place the value in single or double quotes:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" -X GET http://127.0.0.1:8080/api/core/v2/entities -G \
--data-urlencode 'labelSelector=region == "us-west-1"'
{{< /code >}}

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/entities -G \
--data-urlencode 'fieldSelector="entity:i-0c1f8a116b84ea50c" in entity.subscriptions'
{{< /code >}}

#### Use selectors with arrays of strings

To retrieve checks that are in either the `dev` or `production` namespace:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'fieldSelector=check.namespace in [dev,production]'
{{< /code >}}

#### Filter events by entity or check

To retrieve events for a specific check (`checkhttp`):

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/events -G \
--data-urlencode 'fieldSelector=checkhttp in event.check.name'
{{< /code >}}

Similary, to retrieve only events for the `server` entity:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/events -G \
--data-urlencode 'fieldSelector=server in event.entity.name'
{{< /code >}}

#### Filter events by severity

Use the `event.check.status` field selector to retrieve events by severity.
For example, to retrieve all events at `2` (CRITICAL) status:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/events -G \
--data-urlencode 'fieldSelector=event.check.status == "2"'
{{< /code >}}

#### Filter all incidents

To retrieve all incidents (all events whose status is not `0`):

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/events -G \
--data-urlencode 'fieldSelector=event.entity.status != "0"'
{{< /code >}}

#### Filter checks, entities, or events by subscription

To list all checks that include the `linux` subscription:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'fieldSelector=linux in check.subscriptions'
{{< /code >}}

Similarly, to list all entities that include the `linux` subscription:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/entities -G \
--data-urlencode 'fieldSelector=linux in entity.subscriptions'
{{< /code >}}

To list all events for the `linux` subscription, use the `event.entity.subscriptions` field selector:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/events -G \
--data-urlencode 'fieldSelector=linux in event.entity.subscriptions'
{{< /code >}}

#### Filter silenced resources and silences

**Filter silenced resources by namespace**

To list all silenced resources for a particular namespace (in this example, the `default` namespace):

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN http://127.0.0.1:8080/api/core/v2/silenced -G \
--data-urlencode 'fieldSelector=silenced.namespace == "default"'
{{< /code >}}

Likewise, to list all silenced resources *except* those in the `default` namespace:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN http://127.0.0.1:8080/api/core/v2/silenced -G \
--data-urlencode 'fieldSelector=silenced.namespace != "default"'
{{< /code >}}

To list all silenced events for all namespaces:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/events -G \
--data-urlencode 'fieldSelector=event.is_silenced == true'
{{< /code >}}


**Filter silences by creator**

To list all silences created by the user `alice`:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/silenced -G \
--data-urlencode 'fieldSelector=silenced.creator == "alice"'
{{< /code >}}

To list all silences that were not created by the `admin` user:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/silenced -G \
--data-urlencode 'fieldSelector=silenced.creator != "admin"'
{{< /code >}}

**Filter silences by silence subscription**

To retrieve silences with a specific subscription (in this example, `linux`):

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/silenced -G \
--data-urlencode 'fieldSelector=silenced.subscription == "linux"'
{{< /code >}}

Another way to make the same request is:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/silenced -G \
--data-urlencode 'fieldSelector=linux in silenced.subscription'
{{< /code >}}

{{% notice note %}}
**NOTE**: For this field selector, `subscription` means the subscription specified for the silence.
In other words, this filter retrieves **silences** with a particular subscription, not silenced entities or checks with a matching subscription.
{{% /notice %}}

**Filter silenced resources by expiration**

To list all silenced resources that expire only when a matching check resolves:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN http://127.0.0.1:8080/api/core/v2/silenced -G \
--data-urlencode 'fieldSelector=silenced.expire_on_resolve == true'
{{< /code >}}


[1]: ../sensuctl/set-up-manage#preferred-output-format
[2]: ../operations/deploy-sensu/install-sensu#install-sensuctl
[3]: ../reference/rbac/
[4]: ../reference/agent/
[5]: health/
[6]: metrics/
[7]: ../sensuctl/environment-variables/
[8]: ../commercial/
[9]: ../reference/entities#metadata-attributes
[11]: auth/#authtoken-post
[12]: auth/
[13]: #operators
[14]: #authentication-quickstart
[15]: #examples
[16]: #limit-query-parameter
[17]: #authenticate-with-an-api-key
[18]: ../operations/control-access/use-apikeys/#sensuctl-management-commands
[19]: apikeys/
[20]: #authenticate-with-the-authentication-api
