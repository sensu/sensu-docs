---
title: "Use the API key feature"
linkTitle: "Use API keys"
description: "In this guide, you'll learn how to use Sensu's API key feature for authentication."
weight: 180
version: "5.16"
product: "Sensu Go"
platformContent: False
menu: 
  sensu-go-5.16:
    parent: guides
---

- [API key authentication](#api-key-authentication)
- [Sensuctl management commands](#sensuctl-management-commands)

The Sensu API key feature (core/v2.APIKey) is a persistent UUID that maps to a stored Sensu username.
The advantages of authenticating with API keys rather than [access tokens][2] include:

- **More efficient integration**: Check and handler plugins and other code can integrate with the Sensu API without implementing the logic required to authenticate via the `/auth` API endpoint to periodically refresh the access token
- **Improved security**: API keys do not require providing a username and password in check or handler definitions
- **Better admin control**: API keys can be created and revoked without changing the underlying user's password...but keep in mind that API keys will continue to work even if the user's password changes

API keys are cluster-wide resources, so only cluster admins can grant, view, and revoke them.

_**NOTE**: API keys are not supported for authentication providers such as LDAP and OIDC._

## API key authentication

Similar to the `Bearer [token]` Authorization header, `Key [api-key]` will be accepted as an Authorization header for authentication.

For example, a JWT `Bearer [token]` Authorization header might be:

{{< highlight shell >}}
curl -H "Authorization: Bearer $SENSU_ACCESS_TOKEN" http://127.0.0.1:8080/api/core/v2/namespaces/default/checks
{{< /highlight >}}

If you're using `Key [api-key]` to authenticate instead, the Authorization header might be:

{{< highlight shell >}}
curl -H "Authorization: Key $SENSU_API_KEY" http://127.0.0.1:8080/api/core/v2/namespaces/default/checks
{{< /highlight >}}

### Example

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

## Sensuctl management commands

_**NOTE**: The API key resource is intentionally not compatible with [`sensuctl create`][1]._

To generate a new API key for the admin user:

{{< highlight shell >}}
$ sensuctl api-key grant admin
Created: /api/core/v2/apikeys/7f63b5bc-41f4-4b3e-b59b-5431afd7e6a2
{{< /highlight >}}

To get information about an API key:

{{< highlight shell >}}
$ sensuctl api-key info 7f63b5bc-41f4-4b3e-b59b-5431afd7e6a2 --format json
{
  "metadata": {
    "name": "7f63b5bc-41f4-4b3e-b59b-5431afd7e6a2"
  },
  "username": "admin",
  "created_at": 1570744117
}
{{< /highlight >}}

To get a list of all API keys:

{{< highlight shell >}}
$ sensuctl api-key list
                  Name                   Username            Created At            
 ────────────────────────────────────── ────────── ─────────────────────────────── 
  7f63b5bc-41f4-4b3e-b59b-5431afd7e6a2   admin      2019-10-10 14:48:37 -0700 PDT
{{< /highlight >}}

To revoke an API key for the admin user:

{{< highlight shell >}}
$ sensuctl api-key revoke 7f63b5bc-41f4-4b3e-b59b-5431afd7e6a2 --skip-confirm
Deleted
{{< /highlight >}}

[1]: ../../sensuctl/reference/#create-resources
[2]: ../../api/auth/#the-authtoken-api-endpoint
