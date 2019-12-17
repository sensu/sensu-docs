---
title: "Authentication providers API"
linkTitle: "Authentication Providers API"
description: "The Sensu authentication providers API endpoint provides HTTP access to authentication provider configuration. This reference includes examples of how to return the list of active authentication providers and create or update an authentication provider."
version: "5.16"
product: "Sensu Go"
menu:
  sensu-go-5.16:
    parent: api
---

- [The `authproviders` API endpoints](#the-authproviders-api-endpoints) (commercial feature)
  - [`/authproviders` (GET)](#authproviders-get)
- [The `authproviders/:name` API endpoints](#the-authprovidersname-api-endpoints) (commercial feature)
  - [`authproviders/:name` (GET)](#authprovidersname-get)
  - [`authproviders/:name` (PUT)](#authprovidersname-put)
  - [`authproviders/:name` (DELETE)](#authprovidersname-delete)

**COMMERCIAL FEATURE**: Access authentication providers in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][2].

## The `/authproviders` API endpoints {#the-authproviders-api-endpoints}

### `/authproviders` (GET) {#authproviders-get}

The `/authproviders` API endpoint provides HTTP GET access to authentication provider configuration in Sensu.

#### API Specification {#authproviders-get-specification}

/authproviders (GET)  | 
---------------|------
description    | Returns the list of active authentication providers.
example url    | http://hostname:8080/api/enterprise/authentication/v2/authproviders
pagination     | This endpoint supports pagination using the `limit` and `continue` query parameters. See the [API overview][3] for details.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight json >}}
[
  {
    "Type": "ldap",
    "api_version": "authentication/v2",
    "spec": {
      "servers": [
        {
          "host": "127.0.0.1",
          "binding": {
            "user_dn": "cn=binder,dc=acme,dc=org",
            "password": "YOUR_PASSWORD"
          },
          "group_search": {
            "base_dn": "dc=acme,dc=org"
          },
          "user_search": {
            "base_dn": "dc=acme,dc=org"
          }
        }
      ]
    },
    "metadata": {
      "name": "openldap"
    }
  }
]
{{< /highlight >}}

## The `/authproviders/:name` API endpoints {#the-authprovidersname-api-endpoints}

### `/authproviders/:name` (GET) {#authprovidersname-get}

The `/authproviders/:name` API endpoint provides HTTP GET access to the authentication provider configuration for a specific `:name`.

#### API Specification {#authprovidersname-get-specification}

/authproviders/:name (GET) | 
---------------------|------
description          | Returns the configuration for an authentication provider for the specified configured provider name.
example url          | http://hostname:8080/api/enterprise/authentication/v2/authproviders/openldap
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "Type": "ldap",
  "api_version": "authentication/v2",
  "spec": {
    "servers": [
      {
        "host": "127.0.0.1",
        "binding": {
          "user_dn": "cn=binder,dc=acme,dc=org",
          "password": "YOUR_PASSWORD"
        },
        "group_search": {
          "base_dn": "dc=acme,dc=org"
        },
        "user_search": {
          "base_dn": "dc=acme,dc=org"
        }
      }
    ]
  },
  "metadata": {
    "name": "openldap"
  }
}
{{< /highlight >}}

### `/authproviders/:name` (PUT) {#authprovidersname-put}

The `/authproviders/:name` API endpoint provides HTTP PUT access to create or update the [authentication provider][1] configuration for a specific `:name`.

#### API Specification {#authprovidersname-put-specification}

/authproviders/:name (PUT) | 
----------------|------
description     | Creates or updates the authentication provider configuration for the specified name. See the [authentication guide][1] for more information about supported providers.
example url     | http://hostname:8080/api/enterprise/authentication/v2/authproviders/openldap
payload         | {{< highlight shell >}}
{
  "Type": "ldap",
  "api_version": "authentication/v2",
  "spec": {
    "servers": [
      {
        "host": "127.0.0.1",
        "binding": {
          "user_dn": "cn=binder,dc=acme,dc=org",
          "password": "YOUR_PASSWORD"
        },
        "group_search": {
          "base_dn": "dc=acme,dc=org"
        },
        "user_search": {
          "base_dn": "dc=acme,dc=org"
        }
      }
    ]
  },
  "metadata": {
    "name": "openldap"
  }
}
{{< /highlight >}}
payload parameters | All attributes shown in the example payload are required. For more information about configuring authentication providers, see the [authentication guide][1].
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/authproviders/:name` (DELETE) {#authprovidersname-delete}

The `/authproviders/:name` API endpoint provides HTTP DELETE access to delete the authentication provider configuration from Sensu for a specific `:name`.

### EXAMPLE {#authprovidersname-delete-example}

The following example shows a request to the `/authproviders/:name` API endpoint to delete the configuration for the authentication provider `openldap`, resulting in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_TOKEN" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/authproviders/openldap

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#authprovidersname-delete-specification}

/authproviders/:name (DELETE) | 
--------------------------|------
description               | Deletes the authentication provider configuration from Sensu for the specified name.
example url               | http://hostname:8080/api/enterprise/authentication/v2/authproviders/openldap
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../installation/auth/
[2]: ../../getting-started/enterprise/
[3]: ../overview#pagination
