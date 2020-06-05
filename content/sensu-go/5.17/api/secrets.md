---
title: "Secrets API"
description: "The secrets API controls secrets management for Sensu. This reference describes the Sensu secrets API, including examples. Read on for the full reference."
version: "5.17"
product: "Sensu Go"
menu:
  sensu-go-5.17:
    parent: api
---

- [The `/providers` endpoint](#the-providers-endpoint)
  - [`/providers` (GET)](#providers-get)
- [The `/providers/:provider` endpoint](#the-providers-provider-endpoint)
  - [`/providers/:provider` (GET)](#providers-provider-get)
  - [`/providers/:provider` (PUT)](#providers-provider-put)
  - [`/providers/:provider` (DELETE)](#providers-provider-delete)
- [The `/secrets` endpoint](#the-secrets-endpoint)
  - [`/secrets` (GET)](#secrets-get)
- [The `/secrets/:secret` endpoint](#the-secrets-secret-endpoint)
  - [`/secrets/:secret` (GET)](#secrets-secret-get)
  - [`/secrets/:secret` (PUT)](#secrets-secret-put)
  - [`/secrets/:secret` (DELETE)](#secrets-secret-delete)

**COMMERCIAL FEATURE**: Access secrets management in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][1].

## The `/providers` endpoint

### `/providers` (GET)

The `/providers` API endpoint provides HTTP GET access to a list of secrets providers.

#### EXAMPLE {#providers-get-example}

The following example demonstrates a request to the `/providers` API endpoint, resulting in a list of secrets providers.

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/secrets/v1/providers \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"
[
  {
    "type": "VaultProvider",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "my_vault"
    },
    "spec": {
      "client": {
        "address": "https://vaultserver.example.com:8200",
        "token": "VAULT_TOKEN",
        "version": "v1",
        "tls": {
          "ca_cert": "/etc/ssl/certs/vault_ca_cert.pem"
        },
        "max_retries": 2,
        "timeout": "20s",
        "rate_limiter": {
          "limit": 10.0,
          "burst": 100
        }
      }
    }
  }
]
{{< /highlight >}}

_**NOTE**: In addition to the `VaultProvider` type, the secrets API also includes a built-in `Env` secrets provider type that can retrieve backend [environment variables][3] as secrets. Learn more in the [secrets providers reference][2]._

#### API Specification {#providers-get-specification}

/providers (GET)  | 
---------------|------
description    | Returns the list of secrets providers.
example url    | http://hostname:8080/api/enterprise/secrets/v1/providers
response filtering | This endpoint supports [API response filtering][4].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "type": "VaultProvider",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "my_vault"
    },
    "spec": {
      "client": {
        "address": "https://vaultserver.example.com:8200",
        "token": "VAULT_TOKEN",
        "version": "v1",
        "tls": {
          "ca_cert": "/etc/ssl/certs/vault_ca_cert.pem"
        },
        "max_retries": 2,
        "timeout": "20s",
        "rate_limiter": {
          "limit": 10.0,
          "burst": 100
        }
      }
    }
  }
]
{{< /highlight >}}

## The `/providers/:provider` API endpoint {#the-providers-provider-endpoint}

### `/providers/:provider` (GET) {#providers-provider-get}

The `/providers/:provider` API endpoint provides HTTP GET access to data for a specific secrets `:provider`, by provider name.

#### EXAMPLE {#providers-provider-get-example}

In the following example, querying the `/providers/:provider` API endpoint returns a JSON map that contains the requested `:provider`, `my_vault`.

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/secrets/v1/providers/my_vault \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"
{
  "type": "VaultProvider",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "my_vault"
  },
  "spec": {
    "client": {
      "address": "https://vaultserver.example.com:8200",
      "token": "VAULT_TOKEN",
      "version": "v1",
      "tls": {
        "ca_cert": "/etc/ssl/certs/vault_ca_cert.pem"
      },
      "max_retries": 2,
      "timeout": "20s",
      "rate_limiter": {
        "limit": 10.0,
        "burst": 100
      }
    }
  }
}
{{< /highlight >}}

#### API Specification {#providers-provider-get-specification}

/providers/:provider (GET) | 
---------------------|------
description          | Returns the specified secrets provider.
example url          | http://hostname:8080/api/enterprise/secrets/v1/providers/my_vault
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "type": "VaultProvider",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "my_vault"
  },
  "spec": {
    "client": {
      "address": "https://vaultserver.example.com:8200",
      "token": "VAULT_TOKEN",
      "version": "v1",
      "tls": {
        "ca_cert": "/etc/ssl/certs/vault_ca_cert.pem"
      },
      "max_retries": 2,
      "timeout": "20s",
      "rate_limiter": {
        "limit": 10.0,
        "burst": 100
      }
    }
  }
}
{{< /highlight >}}

### `/providers/:provider` (PUT) {#providers-provider-put}

The `/providers/:provider` API endpoint provides HTTP PUT access to create or update a specific `:provider`, by provider name.

#### EXAMPLE {#providers-provider-put-example}

The following example demonstrates a request to the `/providers/:provider` API endpoint to update the provider `my_vault`.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "type": "VaultProvider",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "my_vault"
  },
  "spec": {
    "client": {
      "address": "https://vaultserver.example.com:8200",
      "token": "VAULT_TOKEN",
      "version": "v1",
      "tls": {
        "ca_cert": "/etc/ssl/certs/vault_ca_cert.pem"
      },
      "max_retries": 2,
      "timeout": "20s",
      "rate_limiter": {
        "limit": 10.0,
        "burst": 100
      }
    }
  }
}' \
http://127.0.0.1:8080/api/enterprise/secrets/v1/providers/my_vault

HTTP/1.1 200 OK
{{< /highlight >}}

#### API Specification {#providers-provider-put-specification}

/providers/:provider (PUT) | 
----------------|------
description     | Creates or updates the specified secrets provider. The provider resource and API version cannot be altered.
example URL     | http://hostname:8080/api/enterprise/secrets/v1/providers/my_vault
payload         | {{< highlight shell >}}
{
  "type": "VaultProvider",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "my_vault"
  },
  "spec": {
    "client": {
      "address": "https://vaultserver.example.com:8200",
      "token": "VAULT_TOKEN",
      "version": "v1",
      "tls": {
        "ca_cert": "/etc/ssl/certs/vault_ca_cert.pem"
      },
      "max_retries": 2,
      "timeout": "20s",
      "rate_limiter": {
        "limit": 10.0,
        "burst": 100
      }
    }
  }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/providers/:provider` (DELETE) {#providers-provider-delete}

The `/providers/:provider` API endpoint provides HTTP DELETE access to delete the specified provider from Sensu.

#### EXAMPLE {#providers-provider-delete-example}

The following example shows a request to the `/providers/:provider` API endpoint to delete the provider `my_vault`, resulting in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
http://127.0.0.1:8080/api/enterprise/secrets/v1/providers/my_vault

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#providers-provider-delete-specification}

/providers/:provider (DELETE) | 
--------------------------|------
description               | Deletes the specified provider from Sensu.
example url               | http://hostname:8080/api/enterprise/secrets/v1/providers/my_vault
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/secrets` endpoint

### `/secrets` (GET)

The `/secrets` API endpoint provides HTTP GET access to a list of secrets.

#### EXAMPLE {#secrets-get-example}

The following example demonstrates a request to the `/secrets` API endpoint, resulting in a list of secrets for the specified namespace.

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/secrets/v1/namespaces/default/secrets \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 200 OK
[
  {
    "type": "Secret",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "sensu-ansible-token",
      "namespace": "default"
    },
    "spec": {
      "id": "secret/ansible#token",
      "provider": "ansible_vault"
    }
  }
]
{{< /highlight >}}

#### API Specification {#secrets-get-specification}

/secrets (GET)  | 
---------------|------
description    | Returns the list of secrets for the specified namespace.
example url    | http://hostname:8080/api/enterprise/secrets/v1/namespaces/default/secrets
response filtering | This endpoint supports [API response filtering][4].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "type": "Secret",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "sensu-ansible-token",
      "namespace": "default"
    },
    "spec": {
      "id": "secret/ansible#token",
      "provider": "ansible_vault"
    }
  }
]
{{< /highlight >}}

## The `/secrets/:secret` endpoint {#the-secrets-secret-endpoint}

### `/secrets/:secret` (GET) {#secrets-secret-get}

The `/secrets/:secret` API endpoint provides HTTP GET access to data for a specific `secret`, by secret name.

#### EXAMPLE {#secrets-secret-get-example}

In the following example, querying the `/secrets/:secret` API endpoint returns a JSON map that contains the requested `:secret`.

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/secrets/v1/namespaces/default/secrets/sensu-ansible-token \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"

HTTP/1.1 200 OK
{
  "type": "Secret",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "sensu-ansible-token",
    "namespace": "default"
  },
  "spec": {
    "id": "secret/ansible#token",
    "provider": "ansible_vault"
  }
}
{{< /highlight >}}

#### API Specification {#secrets-secret-get-specification}

/secrets/:secret (GET) | 
---------------------|------
description          | Returns the specified secret.
example url          | http://hostname:8080/api/enterprise/secrets/v1/namespaces/default/secrets/sensu-ansible-token
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "type": "Secret",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "sensu-ansible-token",
    "namespace": "default"
  },
  "spec": {
    "id": "secret/ansible#token",
    "provider": "ansible_vault"
  }
}
{{< /highlight >}}

### `/secrets/:secret` (PUT) {#secrets-secret-put}

The `/secrets/:secret` API endpoint provides HTTP PUT access to create or update a specific `secret`, by secret name.

#### EXAMPLE {#secrets-secret-put-example}

The following example demonstrates a request to the `/secrets/:secret` API endpoint to update the secret `sensu-ansible-token`.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "type": "Secret",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "sensu-ansible-token",
    "namespace": "default"
  },
  "spec": {
    "id": "secret/ansible#token",
    "provider": "ansible_vault"
  }
}' \
http://127.0.0.1:8080/api/enterprise/secrets/v1/namespaces/default/secrets/sensu-ansible-token

HTTP/1.1 200 OK
{{< /highlight >}}

#### API Specification {#secrets-secret-put-specification}

/secrets/:secret (PUT) | 
----------------|------
description     | Creates or updates the specified secret.
example URL     | http://hostname:8080/api/enterprise/secrets/v1/namespaces/default/secrets/sensu-ansible-token
payload         | {{< highlight shell >}}
{
  "type": "Secret",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "sensu-ansible-token",
    "namespace": "default"
  },
  "spec": {
    "id": "secret/ansible#token",
    "provider": "ansible_vault"
  }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/secrets/:secret` (DELETE) {#secrets-secret-delete}

The `/secrets/:secret` API endpoint provides HTTP DELETE access to delete the specified secret from Sensu.

#### EXAMPLE {#secrets-secret-delete-example}

The following example shows a request to the `/secrets/:secret` API endpoint to delete the secret `sensu-ansible-token`, resulting in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
http://127.0.0.1:8080/api/enterprise/secrets/v1/namespaces/default/secrets/sensu-ansible-token

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#secrets-secret-delete-specification}

/secrets/:secret (DELETE) | 
--------------------------|------
description               | Deletes the specified secret from Sensu.
example url               | http://hostname:8080/api/enterprise/secrets/v1/namespaces/default/secrets/sensu-ansible-token
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[1]: ../../commercial/
[2]: ../../reference/secrets-providers/
[3]: ../../reference/backend/#configuration-via-environment-variables
[4]: ../overview#response-filtering
