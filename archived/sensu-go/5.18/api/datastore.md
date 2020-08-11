---
title: "Datastore API"
description: "The datastore API endpoint provides HTTP access to Sensu datastore providers. This reference includes examples for returning the provider definitions, creating a provider, and more."
version: "5.18"
product: "Sensu Go"
menu:
  sensu-go-5.18:
    parent: api
---

## Get all datastore providers {#provider-get}

The `/provider` API endpoint provides HTTP GET access to [Sensu datastore][1] data.

### Example {#provider-get-example}

The following example demonstrates a request to the `/provider` API endpoint, resulting in a JSON map that contains a list of Sensu datastore providers.

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/store/v1/provider
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \

HTTP/1.1 200 OK
[
  {
    "type": "PostgresConfig",
    "api_version": "store/v1",
    "metadata": {},
    "spec": {
      "dsn": "postgresql://user:secret@host:port/otherdbname",
      "pool_size": 20
    }
  },
  {
    "type": "PostgresConfig",
    "api_version": "store/v1",
    "metadata": {},
    "spec": {
      "dsn": "postgresql://user:secret@host:port/dbname",
      "pool_size": 20
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
    "metadata": {},
    "spec": {
      "dsn": "postgresql://user:secret@host:port/otherdbname",
      "pool_size": 20
    }
  },
  {
    "type": "PostgresConfig",
    "api_version": "store/v1",
    "metadata": {},
    "spec": {
      "dsn": "postgresql://user:secret@host:port/dbname",
      "pool_size": 20
    }
  }
]
{{< /code >}}

## Get a specific datastore provider {#providerprovider-get}

The `/provider/:provider` API endpoint provides HTTP PUT access to retrieve a Sensu datastore provider.

### Example {#providerprovider-get-example}

{{< code shell >}}
curl -X GET \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
http://127.0.0.1:8080/api/enterprise/store/v1/provider/my-postgres

HTTP/1.1 200 OK
{
  "type": "PostgresConfig",
  "api_version": "store/v1",
  "metadata": {
    "name": "my-postgres"
  },
  "spec": {
    "dsn": "postgresql://user:secret@host:port/dbname",
    "pool_size": 20
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
    "name": "my-postgres"
  },
  "spec": {
    "dsn": "postgresql://user:secret@host:port/dbname",
    "pool_size": 20
  }
}
{{< /code >}}

## Create or update a datastore provider {#providerprovider-put}

The `/provider/:provider` API endpoint provides HTTP PUT access to create or update a Sensu datastore provider.

### Example {#providerprovider-put-example}

{{< code shell >}}
curl -X PUT \
http://127.0.0.1:8080/api/enterprise/store/v1/provider/my-postgres \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-d '{
  "type": "PostgresConfig",
  "api_version": "store/v1",
  "metadata": {
    "name": "my-postgres"
  },
  "spec": {
    "dsn": "postgresql://user:secret@host:port/dbname",
    "pool_size": 20
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
    "dsn": "postgresql://user:secret@host:port/dbname",
    "pool_size": 20
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
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
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

[1]: ../../reference/datastore/
