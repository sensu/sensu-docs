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
- [The `providers` API endpoints](#the-providers-api-endpoints) (enterprise-only)
  - [`/providers` (GET)](#providers-get)
  - [`/providers` (POST)](#providers-post)
- [The `providers/:type/:name` API endpoints](#the-providerstypename-api-endpoints) (enterprise-only)
  - [`providers/:type/:name` (GET)](#providerstypename-get)
  - [`providers/:type/:name` (PUT)](#providerstypename-put)
  - [`providers/:type/:name` (DELETE)](#providerstypename-delete)

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

## The `/providers` API endpoints {#the-providers-api-endpoints}

**ENTERPRISE ONLY**: Authentication providers in Sensu Go require a Sensu Enterprise license. To activate your Sensu Enterprise license, see the [getting started guide][2].

### `/providers` (GET) {#providers-get}

The `/providers` API endpoint provides HTTP GET access to authentication provider configuration in Sensu.

#### API Specification {#providers-get-specification}

/providers (GET)  | 
---------------|------
description    | Returns the list of active authentication providers.
example url    | http://hostname:8080/api/enterprise/v2/providers
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight json >}}
[
  {
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
    ],
    "metadata": {
      "name": "default"
    }
  }
]
{{< /highlight >}}

### `/providers` (POST) {#providers-post}

The `/providers` API endpoint provides HTTP POST access to apply an [authentication provider][1] configuration to Sensu.

#### API Specification {#providers-post-specification}

/providers (POST) | 
----------------|------
description     | Configures an authentication provider in Sensu. See the [authentication guide][1] for more information about supported providers.
example url     | http://hostname:8080/api/enterprise/v2/providers
example payload | {{< highlight shell >}}
{
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
  ],
  "metadata": {
    "name": "default"
  }
}
{{< /highlight >}}
payload parameters | All attributes shown in the example payload are required. For more information about configuring authentication providers, see the [authentication guide][1].
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `providers/:type/:name` API endpoints {#the-providerstypename-api-endpoints}

**ENTERPRISE ONLY**: Authentication providers in Sensu Go require a Sensu Enterprise license. To activate your Sensu Enterprise license, see the [getting started guide][2].

### `/providers/:type/:name` (GET) {#providerstypename-get}

The `/providers/:type/:name` API endpoint provides HTTP GET access to authentication provider configuration for a specific `:type` (example: `ldap`) and `:name`.

#### API Specification {#providerstypename-get-specification}

/providers/:type/:name (GET) | 
---------------------|------
description          | Returns the configuration for an authentication provider given the type (must be `ldap`) and the name.
example url          | http://hostname:8080/api/enterprise/v2/providers/ldap/default
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
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
  ],
  "metadata": {
    "name": "default"
  }
}
{{< /highlight >}}

### `/providers/:type/:name` (PUT) {#providerstypename-put}

The `/providers/:type/:name` API endpoint provides HTTP PUT access to create or update an [authentication provider][1] configuration given the `:type` (example: `ldap`) and `:name`.

#### API Specification {#providerstypename-put-specification}

/providers/:type/:name (PUT) | 
----------------|------
description     | Create or update an authentication provider configuration given the type (must be `ldap`) and the name. See the [authentication guide][1] for more information about supported providers.
example url     | http://hostname:8080/api/enterprise/v2/providers/ldap/default
payload         | {{< highlight shell >}}
{
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
  ],
  "metadata": {
    "name": "default"
  }
}
{{< /highlight >}}
payload parameters | All attributes shown in the example payload are required. For more information about configuring authentication providers, see the [authentication guide][1].
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/providers/:type/:name` (DELETE) {#providerstypename-delete}

The `/providers/:type/:name` API endpoint provides HTTP DELETE access to delete an authentication provider configuration from Sensu given the `:type` (example: `ldap`) and `:name`.

#### API Specification {#providerstypename-delete-specification}

/providers/:type/:name (DELETE) | 
--------------------------|------
description               | Deletes an authentication provide configuration from Sensu given the type (must be `ldap`) and the name.
example url               | http://hostname:8080/api/enterprise/v2/providers/ldap/default
response codes            | <ul><li>**Success**: 202 (Accepted)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../installation/auth
[2]: ../../getting-started/enterprise
