---
title: "API overview"
linkTitle: "API Overview"
description: "The Sensu backend REST API provides access to Sensu workflow configurations and monitoring event data. Read this guide for an overview of the Sensu Go API, including URL format, data format, versioning, and more."
weight: 10
version: "5.11"
product: "Sensu Go"
menu:
  sensu-go-5.11:
    parent: api
---

- [URL format](#url-format)
- [Data format](#data-format)
- [Versioning](#versioning)
- [Access control](#access-control)
- [Pagination](#pagination)
- [Filtering](#filtering)
  - [Label selector](#label-selector)
  - [Field selector](#field-selector)
  - [Supported operators](#supported-operators)
  - [Combining selectors and statements](#combining-selectors-and-statements)
- [Request size](#request-size)

**Sensu Go 5.11 includes API v2.**

The Sensu backend REST API provides access to Sensu workflow configurations and monitoring event data.
For the Sensu agent API, see the [agent reference][4].

## URL format

Sensu API endpoints use the standard URL format `/api/{group}/{version}/namespaces/{namespace}` where:

- `{group}` is the API group. All currently existing Sensu API endpoints are of group `core`.
- `{version}` is the API version. Sensu Go 5.11 uses API v2.
- `{namespace}` is the namespace name. The examples in these API docs use the `default` namespace. The Sensu API requires that the authenticated user have the correct access permissions for the namespace specified in the URL. If the authenticated user has the correct cluster-wide permissions, you can leave out the `/namespaces/{namespace}` portion of the URL to access Sensu resources across namespaces. See the [RBAC reference][3] for more information about configuring Sensu users and access controls.

## Data format

The API uses JSON formatted requests and responses.
In terms of [sensuctl output types][1], the Sensu API uses the `json` format, not `wrapped-json`.

## Versioning

The Sensu Go API is versioned according to the format `v{majorVersion}{stabilityLevel}{iterationNumber}`, in which `v2` is stable version 2.
The Sensu API guarantees backward compatibility for stable versions of the API.

Sensu makes no guarantee that an alpha or beta API will be maintained for any period of time.
Alpha versions should be considered under active development and may not be published for every release.
Beta APIs, while more stable than alpha versions, offer similarly short-lived lifespans and also provide no guarantee of programmatic conversions when the API is updated.

## Access control

With the exception of the [health][5] and [metrics APIs][6], the Sensu API requires authentication using a JWT access token.
You can generate access tokens and refresh tokens using the [authentication API][11] and your Sensu username and password.

### Basic authentication using the authentication API

The [`/auth` API endpoint][9] lets you generate short-lived API tokens using your Sensu username and password.

1. Retrieve an access token for your user.
For example, to generate an access token using the default admin credentials:
{{< highlight shell >}}
curl -u 'admin:P@ssw0rd!' http://localhost:8080/auth
{{< /highlight >}}
The access token should be included in the output, along with a refresh token:
{{< highlight shell >}}
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": 1544582187,
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
{{< /highlight >}}

2. Copy the access token into the authentication header of the API request.
For example:
{{< highlight shell >}}
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events
{{< /highlight >}}

3. Access tokens last for around 15 minutes.
When your token expires, you should see a 401 Unauthorized response from the API.
To generate a new access token, use the [`/auth/token` API endpoint][10], including the expired access token in the authorization header and the refresh token in the request body:
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

### Generating an API token using sensuctl

You can also generate an API access token using the sensuctl command-line tool.
The user credentials that you use to log in to sensuctl determine your permissions to get, list, create, update, and delete resources using the Sensu API.

1. [Install and log in to sensuctl][2].

2. Retrieve an access token for your user:
{{< highlight shell >}}
cat ~/.config/sensu/sensuctl/cluster|grep access_token
{{< /highlight >}}
The access token should be included in the output:
{{< highlight shell >}}
"access_token": "eyJhbGciOiJIUzI1NiIs...",
{{< /highlight >}}

3. Copy the access token into the authentication header of the API request. For example:
{{< highlight shell >}}
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
http://127.0.0.1:8080/api/core/v2/namespaces/default/events
{{< /highlight >}}

4. Access tokens last for around 15 minutes.
If your token expires, you should see a 401 Unauthorized response from the API.
To regenerate a valid access token, first run any sensuctl command (like `sensuctl event list`) then repeat step 2.

## Pagination

The Sensu API supports response pagination for all GET endpoints that return an array.
You can request a paginated response using the `limit` and `continue` query parameters.

For example, the following request limits the response to a maximum of two objects.

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/namespaces?limit=2 -H "Authorization: Bearer $SENSU_TOKEN"
{{< /highlight >}}

The response includes the available objects up to the specified limit and, if there are more objects available, a continue token.
For example, the following response indicates that there are more than two namespaces available and provides a continue token to request the next page of objects.

{{< highlight shell >}}
HTTP/1.1 200 OK
Content-Type: application/json
Sensu-Continue: L2RlZmF1bHQvY2N4MWM2L2hlbGxvLXdvcmxkAA
[
  {
    "name": "default"
  },
  {
    "name": "development"
  }
]
{{< /highlight >}}

You can then use the continue token to request the next page of objects.
The following example requests the next two available namespaces following the request in the example above.

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/namespaces?limit=2&continue=L2RlZmF1bHQvY2N4MWM2L2hlbGxvLXdvcmxkAA -H "Authorization: Bearer $SENSU_TOKEN"
{{< /highlight >}}

If the request does not return a continue token, there are no further objects to return.
For example, the following response indicates that there is only one additional namespace available.

{{< highlight shell >}}
HTTP/1.1 200 OK
Content-Type: application/json
[
  {
    "name": "ops"
  }
]
{{< /highlight >}}

## Filtering

**LICENSED TIER**: Unlock API filtering in Sensu Go with a Sensu license. To activate your license, see the [getting started guide][7].

The Sensu API supports filtering for all GET endpoints that return an array. You can filter resources based on their labels with a label selector using the `labelSelector` query parameter and on certain pre-determined fields with a field selector using the `fieldSelector` query parameter.

For example, the following request filters the response to only include resources that have a label entry `region` with the value `us-west-1`. We will use the flag `--data-urlencode` in curl so it encodes the query parameter for us, in conjunction with the `-G` flag so it appends the data to the URL.

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'labelSelector=region == "us-west-1"'
{{< /highlight >}}

_NOTE: For examples of using label and field selectors in the Sensu dashboard, see the [dashboard docs][12]._

### Label selector

A label selector can use any label attributes to group a set of resources. All resources support labels within the metadata object. For example, see [entities metadata attributes][8].

### Field selector

A field selector can use certain fields of resources to organize and select subsets of resources. Here's the list of available fields.

| Resource      | Fields      |
| ----------- | ----------- | 
| Asset | `asset.name` `asset.namespace` `asset.filters` |
| Check | `check.name` `check.namespace` `check.handlers` `check.publish` `check.round_robin` `check.runtime_assets` `check.subscriptions`|
| ClusterRole | `clusterrole.name` |
| ClusterRoleBinding | `clusterrolebinding.name` `clusterrolebinding.role_ref.name` `clusterrolebinding.role_ref.type`|
| Entity | `entity.name` `entity.namespace` `entity.deregister` `entity.entity_class` `entity.subscriptions` |
| Event | `event.name` `event.namespace` `event.check.handlers` `event.check.publish` `event.check.round_robin` `event.check.runtime_assets` `event.check.status` `event.check.subscriptions` `event.entity.deregister` `event.entity.entity_class` `event.entity.subscriptions` |
| Extension | `extension.name` `extension.namespace` |
| Filter | `filter.name` `filter.namespace` `filter.action` `filter.runtime_assets` |
| Handler | `handler.name` `handler.namespace` `handler.filters` `handler.handlers` `handler.mutator` `handler.type`| 
| Hook | `hook.name` `hook.namespace` |
| Mutator | `mutator.name` `mutator.namespace` `mutator.runtime_assets` |
| Namespace | `namespace.name` |
| Role | `role.name` `role.namespace` |
| RoleBinding | `rolebinding.name` `rolebinding.namespace` `rolebinding.role_ref.name` `rolebinding.role_ref.type`|
| Silenced | `silenced.name` `silenced.namespace` `silenced.check` `silenced.creator` `silenced.expire_on_resolve` `silenced.subscription` |
| User | `user.username` `user.disabled` `user.groups` |

### Supported operators

There are two _equality-based_ operators supported, `==` (equality) and `!=` (inequality). For example, the following statements are possible:

{{< highlight shell >}}
check.publish == true
check.namespace != "default"
{{< /highlight >}}

Additionally, there are two _set-based_ operators to deal with lists of values, `in` and `notin`. For example, the following statements are possible:

{{< highlight shell >}}
linux in check.subscriptions
slack notin check.handlers
check.namespace in [dev,production]
{{< /highlight >}}

### Combining selectors and statements

A field or label selector can be made of multiple statements which are separated with the logical operator `&&` (_AND_). For example, the following curl request looks up checks that are configured to be published **and** have the `slack` handler:

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'fieldSelector=check.publish == true && slack in check.handlers'
{{< /highlight >}}

In addition to selectors with multiple statements, both field and label selectors can be used at the same time:
{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_TOKEN" http://127.0.0.1:8080/api/core/v2/checks -G \
--data-urlencode 'fieldSelector=slack in check.handlers' \
--data-urlencode 'labelSelector=region != "us-west-1"'
{{< /highlight >}}

## Request size

API request bodies are limited to 0.512 MB in size.

[1]: ../../sensuctl/reference#preferred-output-format
[2]: ../../installation/install-sensu#install-sensuctl
[3]: ../../reference/rbac
[4]: ../../reference/agent#using-the-http-socket
[5]: ../health/
[6]: ../metrics
[7]: ../../getting-started/enterprise
[8]: ../../reference/entities#metadata-attributes
[9]: ../auth/#the-auth-api-endpoint
[10]: ../auth/#the-authtoken-api-endpoint
[11]: ../auth
[12]: ../../dashboard/filtering
