---
title: "API Overview"
description: "Sensu Go 5.0 includes API v2."
weight: 10
version: "5.0"
product: "Sensu Go"
menu:
  sensu-go-5.0:
    parent: api
---

**Sensu Go 5.0 includes API v2.**

Sensu Go includes a REST API to make it even easier to manage your monitoring workflows.

### URL format

Sensu API endpoints use the standard URL format `/apis/{group}/{version}/namespaces/{namespace}` where:

- `{group}` is the API group. All currently existing Sensu API endpoints are of group `core`.
- `{version}` is the API version. Sensu Go 5.0 uses API v2.
- `{namespace}` is the namespace name. The examples in these API docs use the `default` namespace.

### Data format

The API uses JSON formatted requests and responses.
In terms of [sensuctl output types][1], the Sensu API uses the `json` format, not `wrapped-json`.

### Data size

API responses are limited to 0.512 MB in size.

### Versioning

The Sensu Go API is versioned according to the format `v{majorVersion}{stabilityLevel}{iterationNumber}`, in which `v2` is stable version 2.

Sensu makes no guarantee that an alpha or beta APIs will be maintained for any period of time.
Alpha versions should be considered under active development and may not be published for every release.
Beta APIs, while more stable than alpha versions, offer similarly short-lived lifespans and also provide no guarantee of programmatic conversions when the API is updated.

### Access control

The Sensu API requires authentication using a JWT access token.
Sensuctl provides an easy way to generate access tokens for short-lived use with the Sensu API.
The user credentials that you use to log in to senscutl determine your permissions to get, list, create, update, and delete resources using the Sensu API.

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
curl http://127.0.0.1:8080/apis/core/v2/namespaces/default/events -v -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
{{< /highlight >}}

Access tokens last for around 15 minutes.
If your token expires, you should see a 401 Unauthorized response from the API.

To create a new token, first run any sensuctl command (like `sensuctl event list`) then repeat the steps above.

[1]: ../../sensuctl/reference#preferred-output-format
[2]: ../../installation/install-sensu#install-sensuctl