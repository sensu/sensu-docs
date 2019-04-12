---
title: "API Overview"
description: "The Sensu backend REST API provides access to Sensu workflow configurations and monitoring event data. Read this guide for an overview of the Sensu Go API, including URL format, data format, versioning, and more."
weight: 10
version: "5.5"
product: "Sensu Go"
menu:
  sensu-go-5.5:
    parent: api
---

- [URL format](#url-format)
- [Data format](#data-format)
- [Versioning](#versioning)
- [Access control](#access-control)
- [Pagination](#pagination)
- [Request size](#request-size)

**Sensu Go 5.5 includes API v2.**

The Sensu backend REST API provides access to Sensu workflow configurations and monitoring event data.
For the Sensu agent API, see the [agent reference][4].

### URL format

Sensu API endpoints use the standard URL format `/api/{group}/{version}/namespaces/{namespace}` where:

- `{group}` is the API group. All currently existing Sensu API endpoints are of group `core`.
- `{version}` is the API version. Sensu Go 5.5 uses API v2.
- `{namespace}` is the namespace name. The examples in these API docs use the `default` namespace. The Sensu API requires that the authenticated user have the correct access permissions for the namespace specified in the URL. If the authenticated user has the correct cluster-wide permissions, you can leave out the `/namespaces/{namespace}` portion of the URL to access Sensu resources across namespaces. See the [RBAC reference][3] for more information about configuring Sensu users and access controls.

### Data format

The API uses JSON formatted requests and responses.
In terms of [sensuctl output types][1], the Sensu API uses the `json` format, not `wrapped-json`.

### Versioning

The Sensu Go API is versioned according to the format `v{majorVersion}{stabilityLevel}{iterationNumber}`, in which `v2` is stable version 2.
The Sensu API guarantees backward compatibility for stable versions of the API.

Sensu makes no guarantee that an alpha or beta API will be maintained for any period of time.
Alpha versions should be considered under active development and may not be published for every release.
Beta APIs, while more stable than alpha versions, offer similarly short-lived lifespans and also provide no guarantee of programmatic conversions when the API is updated.

### Access control

With the exception of the [health API][5], the Sensu API requires authentication using a JWT access token.
Sensuctl provides an easy way to generate access tokens for short-lived use with the Sensu API.
The user credentials that you use to log in to sensuctl determine your permissions to get, list, create, update, and delete resources using the Sensu API.

To generate an API access token using sensuctl:

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
curl http://127.0.0.1:8080/api/core/v2/namespaces/default/events -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
{{< /highlight >}}

Access tokens last for around 15 minutes.
If your token expires, you should see a 401 Unauthorized response from the API.

To create a new token, first run any sensuctl command (like `sensuctl event list`) then repeat the steps above.

### Pagination

The Sensu API supports response pagination for all GET endpoints that return an array.
You can request a paginated response using the `limit` and `continue` query parameters.

For example, the following request limits the response to a maximum of two objects.

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/namespaces?limit=2 -H "Authorization: Bearer $TOKEN"
{{< /highlight >}}

The response includes the available objects up to the specified limit and, if there are more objects available, a continue token.
For example, the following response indicates that there are more than two namespaces available and provides a continue token to request the next page of objects.

{{< highlight shell >}}
HTTP/1.1 200 OK
Content-Type: application/json
X-Sensu-Continue: L2RlZmF1bHQvY2N4MWM2L2hlbGxvLXdvcmxkAA
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
curl http://127.0.0.1:8080/api/core/v2/namespaces?limit=2&continue=L2RlZmF1bHQvY2N4MWM2L2hlbGxvLXdvcmxkAA -H "Authorization: Bearer $TOKEN"
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

### Request size

API request bodies are limited to 0.512 MB in size.

[1]: ../../sensuctl/reference#preferred-output-format
[2]: ../../installation/install-sensu#install-sensuctl
[3]: ../../reference/rbac
[4]: ../../reference/agent#using-the-http-socket
[5]: ../health/
