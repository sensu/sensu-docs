---
title: "Authentication API"
description: "Sensu Go authentication API reference documentation"
version: "5.2"
product: "Sensu Go"
menu:
  sensu-go-5.2:
    parent: api
---

- [The `/auth/test` API endpoint](#the-authtest-api-endpoint)
  - [`/auth/test` (GET)](#authtest-get)
- [The `authproviders` API endpoints](#the-authproviders-api-endpoints) (enterprise-only)
  - [`/authproviders` (GET)](#authproviders-get)
- [The `authproviders/:name` API endpoints](#the-providersname-api-endpoints) (enterprise-only)
  - [`authproviders/:name` (GET)](#providersname-get)
  - [`authproviders/:name` (PUT)](#providersname-put)
  - [`authproviders/:name` (DELETE)](#authprovidersname-delete)

## The `/auth/test` API endpoint {#the-authtest-api-endpoint}

### `/auth/test` (GET) {#authtest-get}

The `/auth/test` API endpoint provides HTTP GET access to test user credentials.

#### EXAMPLE {#authtest-get-example}

In the following example, querying the `/auth/test` API with a given username and password returns a 200 OK response, indicating that the credentials are valid.

{{< highlight shell >}}
curl -u myusername:mypassword http://127.0.0.1:8080/auth/test 

HTTP/1.1 200 OK
{{< /highlight >}}

#### API Specification {#authtest-get-specification}

/auth/test (GET)     |     |
---------------------|------
description          | Tests a given username and password.
example url          | http://hostname:8080/api/core/v2/auth/test
response codes       | <ul><li>**Valid credentials**: 200 (OK)</li><li> **Invalid credentials**: 401 (Unauthorized)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/authproviders` API endpoints {#the-authproviders-api-endpoints}

**ENTERPRISE ONLY**: Authentication providers in Sensu Go require a Sensu Enterprise license. To activate your Sensu Enterprise license, see the [getting started guide][2].

### `/authproviders` (GET) {#authproviders-get}

The `/authproviders` API endpoint provides HTTP GET access to authentication provider configuration in Sensu.

#### API Specification {#authproviders-get-specification}

/providers (GET)  | 
---------------|------
description    | Returns the list of active authentication providers.
example url    | http://hostname:8080/api/enterprise/authproviders/v2
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight json >}}
[
  {
    "Type": "ldap",
    "api_version": "authproviders/v2",
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

## The `providers/:name` API endpoints {#the-authprovidersname-api-endpoints}

**ENTERPRISE ONLY**: Authentication providers in Sensu Go require a Sensu Enterprise license. To activate your Sensu Enterprise license, see the [getting started guide][2].

### `/providers/:name` (GET) {#authprovidersname-get}

The `/providers/:name` API endpoint provides HTTP GET access to authentication provider configuration for a specific `:name`.

#### API Specification {#authprovidersname-get-specification}

/providers/:name (GET) | 
---------------------|------
description          | Returns the configuration for an authentication provider given the type (must be `ldap`) and the name.
example url          | http://hostname:8080/api/enterprise/authproviders/v2/openldap
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "Type": "ldap",
  "api_version": "authproviders/v2",
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
example url     | http://hostname:8080/api/enterprise/authproviders/v2/openldap
payload         | {{< highlight shell >}}
{
  "Type": "ldap",
  "api_version": "authproviders/v2",
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
example url               | http://hostname:8080/api/enterprise/authproviders/v2/openldap
response codes            | <ul><li>**Success**: 202 (Accepted)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../installation/auth
[2]: ../../getting-started/enterprise
