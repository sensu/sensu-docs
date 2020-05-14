---
title: "Datastore API"
description: "The datastore API endpoint provides HTTP access to Sensu datastore providers. This reference includes examples for returning the provider definitions, creating a provider, and more."
version: "5.16"
product: "Sensu Go"
menu:
  sensu-go-5.16:
    parent: api
---

- [The `/provider` API endpoint](#the-provider-API-endpoint)
  - [`/provider` (GET)](#provider-get)
- [The `/provider/:provider` API endpoint](#the-providerprovider-API-endpoint)
  - [`/provider/:provider` (GET)](#providerprovider-get)
  - [`/provider/:provider` (PUT)](#providerprovider-put)
  - [`/provider/:provider` (DELETE)](#providerprovider-delete)

## The `/provider` API endpoint {#the-provider-API-endpoint}

### `/provider` (GET) {#provider-get}

The `/provider` API endpoint provides HTTP GET access to [Sensu datastore][1] data.

#### EXAMPLE {#provider-get-example}

The following example demonstrates a request to the `/provider` API endpoint, resulting in a JSON map that contains a list of Sensu datastore providers.

{{< highlight shell >}}
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
{{< /highlight >}}

#### API Specification {#provider-get-specification}

/provider (GET)  | 
---------------|------
description    | Returns the list of datastore providers.
example url    | http://hostname:8080/api/enterprise/store/v1/provider
response type  | Map
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight json >}}
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
{{< /highlight >}}

## The `/provider/:provider` API endpoint {#the-providerprovider-API-endpoint}

### `/provider/:provider` (GET) {#providerprovider-get}

#### EXAMPLE {#providerprovider-get-example}

{{< highlight shell >}}
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
{{< /highlight >}}

#### API Specification {#providerprovider-get-specification}

/provider/:provider (GET) | 
----------------|------
description     | Returns the specified datastore provider.
example url     | http://hostname:8080/api/enterprise/store/v1/provider/my-postgres
url parameters  | Required: `my-postgres` (name of provider to retrieve).
response codes   | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight json >}}
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
{{< /highlight >}}

### `/provider/:provider` (PUT) {#providerprovider-put}

#### EXAMPLE {#providerprovider-put-example}

{{< highlight shell >}}
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

{{< /highlight >}}

#### API Specification {#providerprovider-put-specification}

/provider/:provider (PUT) | 
----------------|------
description     | Creates a datastore provider.
example url     | http://hostname:8080/api/enterprise/store/v1/provider/my-postgres
url parameters  | Required: `my-postgres` (name to use for provider).
payload         | {{< highlight shell >}}
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
{{< /highlight >}}
response codes   | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/provider/:provider` (DELETE) {#providerprovider-delete}

The `/provider/:provider` API endpoint provides HTTP DELETE access to remove a Sensu datastore provider.

#### EXAMPLE {#providerprovider-delete-example}

The following example shows a request to the `/provider/:provider` API endpoint to remove the Sensu datastore provider with the ID `my-postgres`, resulting in a successful HTTP `204 No Content` response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
http://127.0.0.1:8080/api/enterprise/store/v1/provider/my-postgres

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#providerprovider-delete-specification}

/provider/:provider (DELETE) | 
--------------------------|------
description               | Removes the specified datastore provider.
example url               | http://hostname:8080/api/enterprise/store/v1/provider/my-postgres
url parameters            | Required: `my-postgres` (name of provider to delete).
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/datastore/
