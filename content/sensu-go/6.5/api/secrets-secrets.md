---
title: "enterprise/secrets/v1/secrets"
description: "The secrets API controls secrets management for Sensu. This reference describes the Sensu secrets API, including examples. Read on for the full reference."
enterpriseapi_title: "enterprise/secrets/v1/secrets"
type: "enterprise_api"
version: "6.5"
product: "Sensu Go"
menu:
  sensu-go-6.5:
    parent: api
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the secrets API in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

{{% notice note %}}
**NOTE**: Requests to the secrets API require you to authenticate with a Sensu [API key](../#configure-an-environment-variable-for-api-key-authentication) or [access token](../#authenticate-with-the-authentication-api).
The code examples in this document use the [environment variable](../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all secrets

The `/secrets` API endpoint provides HTTP GET access to a list of secrets.

### Example {#secrets-get-example}

The following example demonstrates a request to the `/secrets` API endpoint, resulting in a list of secrets for the specified namespace.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/secrets/v1/namespaces/default/secrets \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
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
response filtering | This endpoint supports [API response filtering][4].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code shell >}}
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

In the following example, querying the `/secrets/:secret` API endpoint returns a JSON map that contains the requested `:secret`.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/secrets/v1/namespaces/default/secrets/sensu-ansible-token \
-H "Authorization: Key $SENSU_API_KEY"

HTTP/1.1 200 OK
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
output               | {{< code json >}}
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

HTTP/1.1 200 OK
{{< /code >}}

### API Specification {#secrets-secret-put-specification}

/secrets/:secret (PUT) | 
----------------|------
description     | Creates or updates the specified secret.
example URL     | http://hostname:8080/api/enterprise/secrets/v1/namespaces/default/secrets/sensu-ansible-token
payload         | {{< code shell >}}
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

The following example shows a request to the `/secrets/:secret` API endpoint to delete the secret `sensu-ansible-token`, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/enterprise/secrets/v1/namespaces/default/secrets/sensu-ansible-token

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification {#secrets-secret-delete-specification}

/secrets/:secret (DELETE) | 
--------------------------|------
description               | Deletes the specified secret from Sensu.
example url               | http://hostname:8080/api/enterprise/secrets/v1/namespaces/default/secrets/sensu-ansible-token
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>


[4]: ../#response-filtering
