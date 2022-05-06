---
title: "enterprise/authentication/v2"
description: "Read this API documentation to use Sensu enterprise/authentication/v2 endpoints for HTTP access to single sign-on (SSO) authentication provider configurations."
enterprise_api_title: "enterprise/authentication/v2"
type: "enterprise_api"
version: "6.6"
product: "Sensu Go"
menu:
  sensu-go-6.6:
    parent: enterprise
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access authentication providers for single sign-on (SSO) in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

{{% notice note %}}
**NOTE**: Requests to `enterprise/authentication/v2` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-auth-api-endpoints).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get active authentication provider configurations {#authproviders-get}

The `/authproviders` API endpoint provides HTTP GET access to authentication provider configuration in Sensu.

### Example {#authproviders-get-example}

The following example queries the `/authproviders` API endpoint for the authentication provider configurations in Sensu:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/authentication/v2/authproviders \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a JSON array that contains the [authentication provider configurations][1]:

{{< code text >}}
[
  {
    "type": "oidc",
    "api_version": "authentication/v2",
    "metadata": {
      "name": "oidc_auth",
      "created_by": "admin"
    },
    "spec": {
      "additional_scopes": [
        "groups",
        "email"
      ],
      "client_id": "xxxxxxxxxxxxxxxxxxxx",
      "client_secret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "disable_offline_access": false,
      "groups_claim": "groups",
      "groups_prefix": "oidc:",
      "redirect_uri": "http://sensu-backend.example.com:8080/api/enterprise/authentication/v2/oidc/callback",
      "server": "https://oidc.example.com:9031",
      "username_claim": "email",
      "username_prefix": "oidc:"
    }
  },
  {
    "type": "ldap",
    "api_version": "authentication/v2",
    "metadata": {
      "name": "openldap",
      "created_by": "admin"
    },
    "spec": {
      "groups_prefix": "",
      "servers": [
        {
          "binding": {
            "password": "YOUR_PASSWORD",
            "user_dn": "cn=binder,dc=acme,dc=org"
          },
          "client_cert_file": "",
          "client_key_file": "",
          "default_upn_domain": "",
          "group_search": {
            "attribute": "member",
            "base_dn": "dc=acme,dc=org",
            "name_attribute": "cn",
            "object_class": "groupOfNames"
          },
          "host": "127.0.0.1",
          "insecure": false,
          "port": 636,
          "security": "tls",
          "trusted_ca_file": "",
          "user_search": {
            "attribute": "uid",
            "base_dn": "dc=acme,dc=org",
            "name_attribute": "cn",
            "object_class": "person"
          }
        }
      ],
      "username_prefix": ""
    }
  }
]
{{< /code >}}

### API Specification {#authproviders-get-specification}

/authproviders (GET)  | 
---------------|------
description    | Returns the list of active authentication providers.
example url    | http://hostname:8080/api/enterprise/authentication/v2/authproviders
query parameters | `types`: Defines which type of authentication provider to retrieve. Join with `&` to retrieve multiple types: `?types=AD&types=OIDC`.
pagination     | This endpoint supports pagination using the `limit` and `continue` query parameters. Read the [API overview][3] for details.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "type": "oidc",
    "api_version": "authentication/v2",
    "metadata": {
      "name": "oidc_auth",
      "created_by": "admin"
    },
    "spec": {
      "additional_scopes": [
        "groups",
        "email"
      ],
      "client_id": "xxxxxxxxxxxxxxxxxxxx",
      "client_secret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "disable_offline_access": false,
      "groups_claim": "groups",
      "groups_prefix": "oidc:",
      "redirect_uri": "http://sensu-backend.example.com:8080/api/enterprise/authentication/v2/oidc/callback",
      "server": "https://oidc.example.com:9031",
      "username_claim": "email",
      "username_prefix": "oidc:"
    }
  },
  {
    "type": "ldap",
    "api_version": "authentication/v2",
    "metadata": {
      "name": "openldap",
      "created_by": "admin"
    },
    "spec": {
      "groups_prefix": "",
      "servers": [
        {
          "binding": {
            "password": "YOUR_PASSWORD",
            "user_dn": "cn=binder,dc=acme,dc=org"
          },
          "client_cert_file": "",
          "client_key_file": "",
          "default_upn_domain": "",
          "group_search": {
            "attribute": "member",
            "base_dn": "dc=acme,dc=org",
            "name_attribute": "cn",
            "object_class": "groupOfNames"
          },
          "host": "127.0.0.1",
          "insecure": false,
          "port": 636,
          "security": "tls",
          "trusted_ca_file": "",
          "user_search": {
            "attribute": "uid",
            "base_dn": "dc=acme,dc=org",
            "name_attribute": "cn",
            "object_class": "person"
          }
        }
      ],
      "username_prefix": ""
    }
  }
]
{{< /code >}}

## Get the configuration for a specific authentication provider {#authprovidersname-get}

The `/authproviders/:name` API endpoint provides HTTP GET access to the authentication provider configuration for a specific `:name`.

### Example {#authprovidersname-get-example}

In the following example, an HTTP GET request is submitted to the `/authproviders/:name` API endpoint to retrieve the `openldap` authenthication provider configuration:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/authentication/v2/authproviders/openldap \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json'
{{< /code >}}

The request will return a successful `HTTP/1.1 200 OK` response and a JSON map that contains the requested authentication provider [`:name` definition][1] (in this example, `openldap`):

{{< code shell >}}
{
  "type": "ldap",
  "api_version": "authentication/v2",
  "metadata": {
    "name": "openldap",
    "created_by": "admin"
  },
  "spec": {
    "groups_prefix": "",
    "servers": [
      {
        "binding": {
          "password": "YOUR_PASSWORD",
          "user_dn": "cn=binder,dc=acme,dc=org"
        },
        "client_cert_file": "",
        "client_key_file": "",
        "default_upn_domain": "",
        "group_search": {
          "attribute": "member",
          "base_dn": "dc=acme,dc=org",
          "name_attribute": "cn",
          "object_class": "groupOfNames"
        },
        "host": "127.0.0.1",
        "insecure": false,
        "port": 636,
        "security": "tls",
        "trusted_ca_file": "",
        "user_search": {
          "attribute": "uid",
          "base_dn": "dc=acme,dc=org",
          "name_attribute": "cn",
          "object_class": "person"
        }
      }
    ],
    "username_prefix": ""
  }
}
{{< /code >}}

### API Specification {#authprovidersname-get-specification}

/authproviders/:name (GET) | 
---------------------|------
description          | Returns the configuration for an authentication provider for the specified configured provider name.
example url          | http://hostname:8080/api/enterprise/authentication/v2/authproviders/openldap
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code text >}}
{
  "type": "ldap",
  "api_version": "authentication/v2",
  "metadata": {
    "name": "openldap",
    "created_by": "admin"
  },
  "spec": {
    "groups_prefix": "",
    "servers": [
      {
        "binding": {
          "password": "YOUR_PASSWORD",
          "user_dn": "cn=binder,dc=acme,dc=org"
        },
        "client_cert_file": "",
        "client_key_file": "",
        "default_upn_domain": "",
        "group_search": {
          "attribute": "member",
          "base_dn": "dc=acme,dc=org",
          "name_attribute": "cn",
          "object_class": "groupOfNames"
        },
        "host": "127.0.0.1",
        "insecure": false,
        "port": 636,
        "security": "tls",
        "trusted_ca_file": "",
        "user_search": {
          "attribute": "uid",
          "base_dn": "dc=acme,dc=org",
          "name_attribute": "cn",
          "object_class": "person"
        }
      }
    ],
    "username_prefix": ""
  }
}
{{< /code >}}

## Create or update the configuration for a specific authentication provider {#authprovidersname-put}

The `/authproviders/:name` API endpoint provides HTTP PUT access to create or update the [authentication provider][1] configuration for a specific `:name`.

### Example {#authprovidersname-put-example}

In the following example, an HTTP PUT request is submitted to the `/authproviders/:name` API endpoint to create the `openldap` authenthication provider:

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
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
}' \
http://127.0.0.1:8080/api/enterprise/authentication/v2/authproviders/openldap
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

### API Specification {#authprovidersname-put-specification}

/authproviders/:name (PUT) | 
----------------|------
description     | Creates or updates the authentication provider configuration for the specified name. Read the [authentication guide][1] for more information about supported providers.
example url     | http://hostname:8080/api/enterprise/authentication/v2/authproviders/openldap
payload         | {{< code shell >}}
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
{{< /code >}}
payload parameters | All attributes shown in the example payload are required. For more information about configuring authentication providers, read the [authentication guide][1].
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete the configuration for a specific authentication provider {#authprovidersname-delete}

The `/authproviders/:name` API endpoint provides HTTP DELETE access to delete the authentication provider configuration from Sensu for a specific `:name`.

### Example {#authprovidersname-delete-example}

The following example shows a request to the `/authproviders/:name` API endpoint to delete the configuration for the authentication provider `openldap`, resulting in a successful `HTTP/1.1 204 No Content` response:

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/authproviders/openldap
{{< /code >}}

### API Specification {#authprovidersname-delete-specification}

/authproviders/:name (DELETE) | 
--------------------------|------
description               | Deletes the authentication provider configuration from Sensu for the specified name.
example url               | http://hostname:8080/api/enterprise/authentication/v2/authproviders/openldap
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../../../operations/control-access/sso/
[3]: ../../#pagination
