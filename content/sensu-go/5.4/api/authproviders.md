---
title: "Authentication providers API"
linkTitle: "Authentication Providers API"
description: "The authentication providers API endpoint provides HTTP access to authentication provider configuration in Sensu. Here’s a reference for the authentication providers API in Sensu Go, including returning the list of active authentication providers and creating or updating an authentication provider. Read on for the full reference."
version: "5.4"
product: "Sensu Go"
menu:
  sensu-go-5.4:
    parent: api
---

- [The `authproviders` API endpoints](#the-authproviders-api-endpoints) (enterprise-only)
  - [`/authproviders` (GET)](#authproviders-get)
- [The `authproviders/:name` API endpoints](#the-providersname-api-endpoints) (enterprise-only)
  - [`authproviders/:name` (GET)](#providersname-get)
  - [`authproviders/:name` (PUT)](#providersname-put)
  - [`authproviders/:name` (DELETE)](#authprovidersname-delete)

**ENTERPRISE ONLY**: Authentication providers in Sensu Go require a Sensu Enterprise license. To activate your Sensu Enterprise license, see the [getting started guide][2].

## The `/authproviders` API endpoints {#the-authproviders-api-endpoints}

### `/authproviders` (GET) {#authproviders-get}

The `/authproviders` API endpoint provides HTTP GET access to authentication provider configuration in Sensu.

#### API Specification {#authproviders-get-specification}

/authproviders (GET)  | 
---------------|------
description    | Returns the list of active authentication providers.
example url    | http://hostname:8080/api/enterprise/authentication/v2/authproviders
pagination     | This endpoint supports pagination using the `limit` and `continue` query parameters. See the [API overview](../overview#pagination) for details.
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
            "password": "P@ssw0rd!"
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

The `/authproviders/:name` API endpoint provides HTTP GET access to authentication provider configuration for a specific `:name`.

#### API Specification {#authprovidersname-get-specification}

/authproviders/:name (GET) | 
---------------------|------
description          | Returns the configuration for an authentication provider given the configured provider name.
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
          "password": "P@ssw0rd!"
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

The `/authproviders/:name` API endpoint provides HTTP PUT access to create or update an [authentication provider][1] configuration given `:name`.

#### API Specification {#authprovidersname-put-specification}

/authproviders/:name (PUT) | 
----------------|------
description     | Create or update an authentication provider configuration given the name. See the [authentication guide][1] for more information about supported providers.
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
          "password": "P@ssw0rd!"
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

The `/authproviders/:name` API endpoint provides HTTP DELETE access to delete an authentication provider configuration from Sensu given the `:name`.

#### API Specification {#authprovidersname-delete-specification}

/authproviders/:name (DELETE) | 
--------------------------|------
description               | Deletes an authentication provide configuration from Sensu given the name.
example url               | http://hostname:8080/api/enterprise/authentication/v2/authproviders/openldap
response codes            | <ul><li>**Success**: 202 (Accepted)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../installation/auth
[2]: ../../getting-started/enterprise
