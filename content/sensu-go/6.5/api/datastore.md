---
title: "Datastore API"
description: "The datastore API endpoint provides HTTP access to Sensu datastore providers. This reference includes examples for returning the provider definitions, creating a provider, and more."
api_title: "Datastore API"
type: "api"
version: "6.5"
product: "Sensu Go"
menu:
  sensu-go-6.5:
    parent: api
---

{{% notice note %}}
**NOTE**: Requests to the datastore API require you to authenticate with a Sensu [API key](../#configure-an-environment-variable-for-api-key-authentication) or [access token](../#authenticate-with-the-authentication-api).
The code examples in this document use the [environment variable](../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all datastore providers {#provider-get}

The `/provider` API endpoint provides HTTP GET access to [Sensu datastore][1] data.

### Example {#provider-get-example}

The following example demonstrates a request to the `/provider` API endpoint, resulting in a JSON map that contains a list of Sensu datastore providers.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/store/v1/provider
-H "Authorization: Key $SENSU_API_KEY" \

HTTP/1.1 200 OK
[
  {
    "type": "PostgresConfig",
    "api_version": "store/v1",
    "metadata": {
      "name": "my-other-postgres",
      "created_by": "admin"
    },
    "spec": {
      "batch_buffer": 0,
      "batch_size": 1,
      "batch_workers": 0,
      "dsn": "postgresql://user:secret@host:port/otherdbname",
      "max_conn_lifetime": "5m",
      "max_idle_conns": 2,
      "pool_size": 20,
      "strict": true,
      "enable_round_robin": true
    }
  },
  {
    "type": "PostgresConfig",
    "api_version": "store/v1",
    "metadata": {
      "name": "my-postgres",
      "created_by": "admin"
    },
    "spec": {
      "dsn": "postgresql://user:secret@host:port/dbname",
      "max_conn_lifetime": "5m",
      "max_idle_conns": 2,
      "pool_size": 20,
      "strict": true,
      "enable_round_robin": true
    }
  }
]
{{< /code >}}

### API Specification {#provider-get-specification}

/provider (GET)  | 
---------------|------
description    | Returns the list of datastore providers.
example url    | http://hostname:8080/api/enterprise/store/v1/provider
response type  | Map
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code json >}}
[
  {
    "type": "PostgresConfig",
    "api_version": "store/v1",
    "metadata": {
      "name": "my-postgres",
      "created_by": "admin"
    },
    "spec": {
      "batch_buffer": 0,
      "batch_size": 1,
      "batch_workers": 0,
      "dsn": "postgresql://user:secret@host:port/otherdbname",
      "max_conn_lifetime": "5m",
      "max_idle_conns": 2,
      "pool_size": 20,
      "strict": true,
      "enable_round_robin": true
    }
  },
  {
    "type": "PostgresConfig",
    "api_version": "store/v1",
    "metadata": {
      "name": "my-postgres",
      "created_by": "admin"
    },
    "spec": {
      "dsn": "postgresql://user:secret@host:port/dbname",
      "max_conn_lifetime": "5m",
      "max_idle_conns": 2,
      "pool_size": 20,
      "strict": true,
      "enable_round_robin": true
    }
  }
]
{{< /code >}}

## Get a specific datastore provider {#providerprovider-get}

The `/provider/:provider` API endpoint provides HTTP PUT access to retrieve a Sensu datastore provider.

### Example {#providerprovider-get-example}

{{< code shell >}}
curl -X GET \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/enterprise/store/v1/provider/my-postgres

HTTP/1.1 200 OK
{
  "type": "PostgresConfig",
  "api_version": "store/v1",
  "metadata": {
    "name": "my-postgres",
    "created_by": "admin"
  },
  "spec": {
    "batch_buffer": 0,
    "batch_size": 1,
    "batch_workers": 0,
    "dsn": "postgresql://user:secret@host:port/dbname",
    "max_conn_lifetime": "5m",
    "max_idle_conns": 2,
    "pool_size": 20,
    "strict": true,
    "enable_round_robin": true
  }
}
{{< /code >}}

### API Specification {#providerprovider-get-specification}

/provider/:provider (GET) | 
----------------|------
description     | Returns the specified datastore provider.
example url     | http://hostname:8080/api/enterprise/store/v1/provider/my-postgres
url parameters  | Required: `my-postgres` (name of provider to retrieve).
response codes   | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code json >}}
{
  "type": "PostgresConfig",
  "api_version": "store/v1",
  "metadata": {
    "name": "my-postgres",
    "created_by": "admin"
  },
  "spec": {
    "batch_buffer": 0,
    "batch_size": 1,
    "batch_workers": 0,
    "dsn": "postgresql://user:secret@host:port/dbname",
    "max_conn_lifetime": "5m",
    "max_idle_conns": 2,
    "pool_size": 20,
    "strict": true,
    "enable_round_robin": true
  }
}
{{< /code >}}

## Create or update a datastore provider {#providerprovider-put}

The `/provider/:provider` API endpoint provides HTTP PUT access to create or update a Sensu datastore provider.

### Example {#providerprovider-put-example}

{{< code shell >}}
curl -X PUT \
http://127.0.0.1:8080/api/enterprise/store/v1/provider/my-postgres \
-H "Authorization: Key $SENSU_API_KEY" \
-d '{
  "type": "PostgresConfig",
  "api_version": "store/v1",
  "metadata": {
    "name": "my-postgres"
  },
  "spec": {
    "batch_buffer": 0,
    "batch_size": 1,
    "batch_workers": 0,
    "dsn": "postgresql://user:secret@host:port/dbname",
    "max_conn_lifetime": "5m",
    "max_idle_conns": 2,
    "pool_size": 20,
    "strict": true,
    "enable_round_robin": true
  }
}'

HTTP/1.1 200 OK

{{< /code >}}

### API Specification {#providerprovider-put-specification}

/provider/:provider (PUT) | 
----------------|------
description     | Creates a datastore provider.
example url     | http://hostname:8080/api/enterprise/store/v1/provider/my-postgres
url parameters  | Required: `my-postgres` (name to use for provider).
payload         | {{< code shell >}}
{
  "type": "PostgresConfig",
  "api_version": "store/v1",
  "metadata": {
    "name": "my-postgres"
  },
  "spec": {
    "batch_buffer": 0,
    "batch_size": 1,
    "batch_workers": 0,
    "dsn": "postgresql://user:secret@host:port/dbname",
    "max_conn_lifetime": "5m",
    "max_idle_conns": 2,
    "pool_size": 20,
    "strict": true,
    "enable_round_robin": true
  }
}
{{< /code >}}
response codes   | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete a datastore provider {#providerprovider-delete}

The `/provider/:provider` API endpoint provides HTTP DELETE access to remove a Sensu datastore provider.

### Example {#providerprovider-delete-example}

The following example shows a request to the `/provider/:provider` API endpoint to remove the Sensu datastore provider with the ID `my-postgres`, resulting in a successful HTTP `204 No Content` response.

{{< code shell >}}
curl -X DELETE \
-H "Authorization: Key $SENSU_API_KEY" \
http://127.0.0.1:8080/api/enterprise/store/v1/provider/my-postgres

HTTP/1.1 204 No Content
{{< /code >}}

### API Specification {#providerprovider-delete-specification}

/provider/:provider (DELETE) | 
--------------------------|------
description               | Removes the specified datastore provider.
example url               | http://hostname:8080/api/enterprise/store/v1/provider/my-postgres
url parameters            | Required: `my-postgres` (name of provider to delete).
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../operations/deploy-sensu/datastore/
