---
title: "enterprise/secrets/v1"
description: "Read this API documentation for information about Sensu enterprise/secrets/v1 API endpoints, with examples for managing secrets and secrets providers."
enterprise_api_title: "enterprise/secrets/v1"
type: "enterprise_api"
version: "6.9"
product: "Sensu Go"
menu:
  sensu-go-6.9:
    parent: enterprise
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access secrets management in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

{{% notice note %}}
**NOTE**: Requests to `enterprise/secrets/v1` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-auth-api-endpoints).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all secrets providers

The `/providers` API endpoint provides HTTP GET access to a list of secrets providers.

### Example {#providers-get-example}

The following example demonstrates a GET request to the `/providers` API endpoint:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/secrets/v1/providers \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a JSON array that contains the [secrets provider definitions][1]:

{{< code text >}}
[
  {
    "type": "VaultProvider",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "my_vault",
      "created_by": "admin"
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
{{< /code >}}

{{% notice note %}}
**NOTE**: In addition to the `VaultProvider` type, enterprise/secrets/v1 API also includes the `Env` secrets provider type that can retrieve backend [environment variables](../../../observability-pipeline/observe-schedule/backend/#environment-variables) as secrets.
Learn more in the [secrets providers reference](../../../operations/manage-secrets/secrets-providers/).
{{% /notice %}}

### API Specification {#providers-get-specification}

/providers (GET)  | 
---------------|------
description    | Returns the list of secrets providers.
example url    | http://hostname:8080/api/enterprise/secrets/v1/providers
query parameters | `types`: Defines which type of secrets provider to retrieve. Join with `&` to retrieve multiple types: `?types=Env&types=VaultProvider`.
response filtering | This endpoint supports [API response filtering][3].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "type": "VaultProvider",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "my_vault",
      "created_by": "admin"
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
{{< /code >}}

## Get a specific secrets provider {#providers-provider-get}

The `/providers/:provider` API endpoint provides HTTP GET access to data for a specific secrets `:provider`, by provider name.

### Example {#providers-provider-get-example}

The following example queries the `/providers/:provider` API endpoint for the requested `:provider`, `my_vault`:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/secrets/v1/providers/my_vault \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request will return a successful `HTTP/1.1 200 OK` response and a JSON map that contains the requested [`:provider` definition][1] (in this example, `my_vault`):

{{< code text >}}
{
  "type": "VaultProvider",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "my_vault",
    "created_by": "admin"
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
{{< /code >}}

### API Specification {#providers-provider-get-specification}

/providers/:provider (GET) | 
---------------------|------
description          | Returns the specified secrets provider.
example url          | http://hostname:8080/api/enterprise/secrets/v1/providers/my_vault
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code text >}}
{
  "type": "VaultProvider",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "my_vault",
    "created_by": "admin"
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
{{< /code >}}

## Create or update a secrets provider {#providers-provider-put}

The `/providers/:provider` API endpoint provides HTTP PUT access to create or update a specific `:provider`, by provider name.

### Example {#providers-provider-put-example}

The following example demonstrates a request to the `/providers/:provider` API endpoint to update the provider `my_vault`:

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
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
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response and the complete definition for the provider you created or updated.

### API Specification {#providers-provider-put-specification}

/providers/:provider (PUT) | 
----------------|------
description     | Creates or updates the specified secrets provider. The provider resource and API version cannot be altered.
example URL     | http://hostname:8080/api/enterprise/secrets/v1/providers/my_vault
payload         | {{< code json >}}
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
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a secrets provider {#providers-provider-delete}

The `/providers/:provider` API endpoint provides HTTP DELETE access to delete the specified provider from Sensu.

### Example {#providers-provider-delete-example}

The following example shows a request to the `/providers/:provider` API endpoint to delete the provider `my_vault`, resulting in a successful `HTTP/1.1 204 No Content` response:

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/enterprise/secrets/v1/providers/my_vault
{{< /code >}}

### API Specification {#providers-provider-delete-specification}

/providers/:provider (DELETE) | 
--------------------------|------
description               | Deletes the specified provider from Sensu.
example url               | http://hostname:8080/api/enterprise/secrets/v1/providers/my_vault
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a subset of secrets providers with response filtering

The `/providers` API endpoint supports [response filtering][3] for a subset of secrets providers data based on labels and the `provider.name` field.

### Example

The following example demonstrates a request to the `/providers` API endpoint with [response filtering][3] for only [secrets provider definitions][1] whose name includes `vault`:

{{< code shell >}}
curl -H "Authorization: Key $SENSU_API_KEY" http://127.0.0.1:8080/api/enterprise/secrets/v1/providers -G \
--data-urlencode 'fieldSelector=provider.name matches vault'
{{< /code >}}

The example request will result in a successful `HTTP/1.1 200 OK` response and a JSON array that contains only [provider definitions][1] whose names include `vault`:

{{< code text >}}
[
  {
    "type": "VaultProvider",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "vault_dev",
      "created_by": "admin"
    },
    "spec": {
      "client": {
        "address": "http://localhost:8200",
        "agent_address": "",
        "max_retries": 2,
        "rate_limiter": {
          "burst": 100,
          "limit": 10
        },
        "timeout": "20s",
        "tls": null,
        "token": "\\u003croot_token\\u003e",
        "version": "v2"
      }
    }
  },
  {
    "type": "VaultProvider",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "my_vault",
      "created_by": "admin"
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
{{< /code >}}

{{% notice note %}}
**NOTE**: Read [API response filtering](../../#response-filtering) for more filter statement examples that demonstrate how to filter responses using different operators with label and field selectors.
{{% /notice %}}

### API Specification

/providers (GET) with response filters | 
---------------|------
description    | Returns the list of secrets providers that match the [response filters][3] applied in the API request.
example url    | http://hostname:8080/api/enterprise/secrets/v1/providers
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "type": "VaultProvider",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "vault_dev",
      "created_by": "admin"
    },
    "spec": {
      "client": {
        "address": "http://localhost:8200",
        "agent_address": "",
        "max_retries": 2,
        "rate_limiter": {
          "burst": 100,
          "limit": 10
        },
        "timeout": "20s",
        "tls": null,
        "token": "\\u003croot_token\\u003e",
        "version": "v2"
      }
    }
  },
  {
    "type": "VaultProvider",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "my_vault",
      "created_by": "admin"
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
{{< /code >}}

## Get all secrets

The `/secrets` API endpoint provides HTTP GET access to a list of secrets.

### Example {#secrets-get-example}

The following example demonstrates a GET request to the `/secrets` API endpoint:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/secrets/v1/namespaces/default/secrets \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a JSON array that contains the [secret definitions][2] in the `default` namespace:

{{< code text >}}
[
  {
    "type": "Secret",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "sensu-ansible-token",
      "namespace": "default",
      "created_by": "admin"
    },
    "spec": {
      "id": "secret/ansible#token",
      "provider": "ansible_vault"
    }
  }
]
{{< /code >}}

### API Specification {#secrets-get-specification}

/secrets (GET)  | 
---------------|------
description    | Returns the list of secrets for the specified namespace.
example url    | http://hostname:8080/api/enterprise/secrets/v1/namespaces/default/secrets
response filtering | This endpoint supports [API response filtering][3].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "type": "Secret",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "sensu-ansible-token",
      "namespace": "default",
      "created_by": "admin"
    },
    "spec": {
      "id": "secret/ansible#token",
      "provider": "ansible_vault"
    }
  }
]
{{< /code >}}

## Get a specific secret {#secrets-secret-get}

The `/secrets/:secret` API endpoint provides HTTP GET access to data for a specific `secret`, by secret name.

### Example {#secrets-secret-get-example}

The following example queries the `/secrets/:secret` API endpoint for the requested `:secret`:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/secrets/v1/namespaces/default/secrets/sensu-ansible-token \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request will return a successful `HTTP/1.1 200 OK` response and a JSON map that contains the requested [`:secret` definition][2] (in this example, `sensu-ansible-token`):

{{< code text >}}
{
  "type": "Secret",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "sensu-ansible-token",
    "namespace": "default",
    "created_by": "admin"
  },
  "spec": {
    "id": "secret/ansible#token",
    "provider": "ansible_vault"
  }
}
{{< /code >}}

### API Specification {#secrets-secret-get-specification}

/secrets/:secret (GET) | 
---------------------|------
description          | Returns the specified secret.
example url          | http://hostname:8080/api/enterprise/secrets/v1/namespaces/default/secrets/sensu-ansible-token
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code text >}}
{
  "type": "Secret",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "sensu-ansible-token",
    "namespace": "default",
    "created_by": "admin"
  },
  "spec": {
    "id": "secret/ansible#token",
    "provider": "ansible_vault"
  }
}
{{< /code >}}

## Create or update a secret {#secrets-secret-put}

The `/secrets/:secret` API endpoint provides HTTP PUT access to create or update a specific `secret`, by secret name.

### Example {#secrets-secret-put-example}

The following example demonstrates a request to the `/secrets/:secret` API endpoint to update the secret `sensu-ansible-token`.

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
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
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

### API Specification {#secrets-secret-put-specification}

/secrets/:secret (PUT) | 
----------------|------
description     | Creates or updates the specified secret.
example URL     | http://hostname:8080/api/enterprise/secrets/v1/namespaces/default/secrets/sensu-ansible-token
payload         | {{< code json >}}
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
{{< /code >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a secret {#secrets-secret-delete}

The `/secrets/:secret` API endpoint provides HTTP DELETE access to delete the specified secret from Sensu.

### Example {#secrets-secret-delete-example}

The following example shows a request to the `/secrets/:secret` API endpoint to delete the secret `sensu-ansible-token`, resulting in a successful `HTTP/1.1 204 No Content` response:

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/enterprise/secrets/v1/namespaces/default/secrets/sensu-ansible-token
{{< /code >}}

### API Specification {#secrets-secret-delete-specification}

/secrets/:secret (DELETE) | 
--------------------------|------
description               | Deletes the specified secret from Sensu.
example url               | http://hostname:8080/api/enterprise/secrets/v1/namespaces/default/secrets/sensu-ansible-token
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a subset of secrets with response filtering

The `/secrets` API endpoint supports [response filtering][3] for a subset of secrets data based on labels and the following fields:

- `secret.name`
- `secret.namespace`
- `secret.provider`
- `secret.id`

### Example

The following example demonstrates a request to the `/secrets` API endpoint with [response filtering][3], resulting in a JSON array that contains only [secrets definitions][2] for the `vault` provider.

{{< code shell >}}
curl -H "Authorization: Key $SENSU_API_KEY" http://127.0.0.1:8080/api/enterprise/secrets/v1/secrets -G \
--data-urlencode 'fieldSelector=secret.provider == vault'
{{< /code >}}

The example request will result in a successful `HTTP/1.1 200 OK` response and a JSON array that contains only [secret definitions][1] for the `vault` provider:

{{< code text >}}
[
  {
    "type": "Secret",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "pagerduty_key",
      "namespace": "default",
      "created_by": "admin"
    },
    "spec": {
      "id": "secret/pagerduty#key",
      "provider": "vault"
    }
  },
  {
    "type": "Secret",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "sensu-ansible",
      "namespace": "default",
      "created_by": "admin"
    },
    "spec": {
      "id": "secret/database#password",
      "provider": "vault"
    }
  },
  {
    "type": "Secret",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "sumologic_url",
      "namespace": "default",
      "created_by": "admin"
    },
    "spec": {
      "id": "secret/sumologic#key",
      "provider": "vault"
    }
  }
]
{{< /code >}}

{{% notice note %}}
**NOTE**: Read [API response filtering](../../#response-filtering) for more filter statement examples that demonstrate how to filter responses using different operators with label and field selectors.
{{% /notice %}}

### API Specification

/secrets (GET) with response filters | 
---------------|------
description    | Returns the list of secrets that match the [response filters][3] applied in the API request.
example url    | http://hostname:8080/api/enterprise/secrets/v1/secrets
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "type": "Secret",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "pagerduty_key",
      "namespace": "default",
      "created_by": "admin"
    },
    "spec": {
      "id": "secret/pagerduty#key",
      "provider": "vault"
    }
  },
  {
    "type": "Secret",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "sensu-ansible",
      "namespace": "default",
      "created_by": "admin"
    },
    "spec": {
      "id": "secret/database#password",
      "provider": "vault"
    }
  },
  {
    "type": "Secret",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "sumologic_url",
      "namespace": "default",
      "created_by": "admin"
    },
    "spec": {
      "id": "secret/sumologic#key",
      "provider": "vault"
    }
  }
]
{{< /code >}}


[1]: ../../../operations/manage-secrets/secrets-providers/
[2]: ../../../operations/manage-secrets/secrets/
[3]: ../../#response-filtering
