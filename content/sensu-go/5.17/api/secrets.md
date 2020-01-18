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

_**NOTE**: The `Env` provider is a built-in secrets provider that can retrieve backend environment variables as secrets._

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/secrets/v1/providers \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"
[
  {
    "type": "Env",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "env"
    },
    "spec": {
    }
  }
]
{{< /highlight >}}

#### API Specification {#providers-get-specification}

/providers (GET)  | 
---------------|------
description    | Returns the list of secret providers.
example url    | http://hostname:8080/api/enterprise/secrets/v1/providers
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "type": "Env",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "env"
    },
    "spec": {
    }
  }
]
{{< /highlight >}}

## The `/providers/:provider` API endpoint {#the-providers-provider-endpoint}

### `/providers/:provider` (GET) {#providers-provider-get}

The `/providers/:provider` API endpoint provides HTTP GET access to data for a specific `:provider`, by provider name.

#### EXAMPLE {#providers-provider-get-example}

In the following example, querying the `/providers/:provider` API endpoint returns a JSON map that contains the requested `:provider`.

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/secrets/v1/providers/env \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"
[
  {
    "type": "Env",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "env"
    },
    "spec": {
    }
  }
]
{{< /highlight >}}

#### API Specification {#providers-provider-get-specification}

/providers/:provider (GET) | 
---------------------|------
description          | Returns the specified provider.
example url          | http://hostname:8080/api/enterprise/secrets/v1/providerss/env
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
[
  {
    "type": "Env",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "env"
    },
    "spec": {
    }
  }
]
{{< /highlight >}}

### `/providers/:provider` (PUT) {#providers-provider-put}

The `/providers/:provider` API endpoint provides HTTP PUT access to create or update a specific `:provider`, by provider name.

#### EXAMPLE {#providers-provider-put-example}

The following example demonstrates a request to the `/providers/:provider` API endpoint to update the provider `env`.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "type": "Env",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "env"
  },
  "spec": {
  }
}' \
http://127.0.0.1:8080/api/enterprise/secrets/v1/providers/env

HTTP/1.1 200 OK
{{< /highlight >}}

#### API Specification {#providers-provider-put-specification}

/providers/:provider (PUT) | 
----------------|------
description     | Creates or updates the specified provider. The provider resource and API version cannot be altered.
example URL     | http://hostname:8080/api/enterprise/secrets/v1/providers/env
payload         | {{< highlight shell >}}
{
  "type": "Env",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "env"
  },
  "spec": {
  }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/providers/:provider` (DELETE) {#providers-provider-delete}

The `/providers/:provider` API endpoint provides HTTP DELETE access to delete the specified provider from Sensu.

#### EXAMPLE {#providers-provider-delete-example}

The following example shows a request to the `/providers/:provider` API endpoint to delete the provider `env`, resulting in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
http://127.0.0.1:8080/api/enterprise/secrets/v1/providers/env

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#providers-provider-delete-specification}

/providers/:provider (DELETE) | 
--------------------------|------
description               | Deletes the specified provider from Sensu.
example url               | http://hostname:8080/api/enterprise/secrets/v1/providers/env
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
      "id": "ANSIBLE_TOKEN",
      "provider": "env"
    }
  }
]
{{< /highlight >}}

#### API Specification {#secrets-get-specification}

/secrets (GET)  | 
---------------|------
description    | Returns the list of secrets for the specified namespace. `id` is the identifying key for the provider to retrieve the secret. `provider` is the name of the provider with the secret.
example url    | http://hostname:8080/api/enterprise/secrets/v1/namespaces/default/secrets
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
      "id": "ANSIBLE_TOKEN",
      "provider": "env"
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
[
  {
    "type": "Secret",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "sensu-ansible-token",
      "namespace": "default"
    },
    "spec": {
      "id": "ANSIBLE_TOKEN",
      "provider": "env"
    }
  }
]
{{< /highlight >}}

#### API Specification {#secrets-secret-get-specification}

/secrets/:secret (GET) | 
---------------------|------
description          | Returns the specified secret. `id` is the identifying key for the provider to retrieve the secret. `provider` is the name of the provider with the secret.
example url          | http://hostname:8080/api/enterprise/secrets/v1/namespaces/default/secrets/sensu-ansible-token
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
[
  {
    "type": "Secret",
    "api_version": "secrets/v1",
    "metadata": {
      "name": "sensu-ansible-token",
      "namespace": "default"
    },
    "spec": {
      "id": "ANSIBLE_TOKEN",
      "provider": "env"
    }
  }
]
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
    "id": "ANSIBLE_TOKEN",
    "provider": "env"
  }
}' \
http://127.0.0.1:8080/api/enterprise/secrets/v1/namespaces/default/secrets/sensu-ansible-token

HTTP/1.1 200 OK
{{< /highlight >}}

#### API Specification {#secrets-secret-put-specification}

/secrets/:secret (PUT) | 
----------------|------
description     | Creates or updates the specified secret. `id` is the identifying key for the provider to retrieve the secret. `provider` is the name of the provider with the secret.
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
    "id": "ANSIBLE_TOKEN",
    "provider": "env"
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


[1]: ../../getting-started/enterprise/
