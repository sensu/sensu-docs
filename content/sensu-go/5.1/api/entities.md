---
title: "Entities API"
description: "The entities API provides HTTP access to entity data. Here’s a reference for the entities API in Sensu Go, including examples for returning lists of entities, creating Sensu entities, and more. Read on for the full reference."
version: "5.1"
product: "Sensu Go"
menu:
  sensu-go-5.1:
    parent: api
---

- [The `/entities` API endpoint](#the-entities-api-endpoint)
	- [`/entities` (GET)](#entities-get)
	- [`/entities` (POST)](#entities-post)
- [The `/entities/:entity` API endpoint](#the-entitiesentity-api-endpoint)
	- [`/entities/:entity` (GET)](#entitiesentity-get)
  - [`/entities/:entity` (PUT)](#entitiesentity-put)
  - [`/entities/:entity` (DELETE)](#entitiesentity-delete)

## The `/entities` API endpoint

### `/entities` (GET)

The `/entities` API endpoint provides HTTP GET access to [entity][1] data.

#### EXAMPLE {#entities-get-example}

The following example demonstrates a request to the `/entities` API, resulting in
a JSON Array containing [entity definitions][1].

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/namespaces/default/entities -H "Authorization: Bearer $SENSU_TOKEN"
[
  {
    "entity_class": "agent",
    "system": {
      "hostname": "sensu-centos",
      "os": "linux",
      "platform": "centos",
      "platform_family": "rhel",
      "platform_version": "7.4.1708",
      "network": {
        "interfaces": [
          {
            "name": "lo",
            "addresses": [
              "127.0.0.1/8",
              "::1/128"
            ]
          },
          {
            "name": "enp0s3",
            "mac": "08:00:27:11:ad:d2",
            "addresses": [
              "10.0.2.15/24",
              "fe80::f50c:b029:30a5:3e26/64"
            ]
          },
          {
            "name": "enp0s8",
            "mac": "08:00:27:9f:5d:f3",
            "addresses": [
              "172.28.128.3/24",
              "fe80::a00:27ff:fe9f:5df3/64"
            ]
          }
        ]
      },
      "arch": "amd64"
    },
    "subscriptions": [
      "entity:sensu-centos"
    ],
    "last_seen": 1543349936,
    "deregister": false,
    "deregistration": {},
    "user": "agent",
    "redact": [
      "password",
      "passwd",
      "pass",
      "api_key",
      "api_token",
      "access_key",
      "secret_key",
      "private_key",
      "secret"
    ],
    "metadata": {
      "name": "sensu-centos",
      "namespace": "default",
      "labels": null,
      "annotations": null
    }
  }
]
{{< /highlight >}}

#### API Specification {#entities-get-specification}

/entities (GET)  | 
---------------|------
description    | Returns the list of entities.
example url    | http://hostname:8080/api/core/v2/namespaces/default/entities
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "entity_class": "agent",
    "system": {
      "hostname": "sensu-centos",
      "os": "linux",
      "platform": "centos",
      "platform_family": "rhel",
      "platform_version": "7.4.1708",
      "network": {
        "interfaces": [
          {
            "name": "lo",
            "addresses": [
              "127.0.0.1/8",
              "::1/128"
            ]
          },
          {
            "name": "enp0s3",
            "mac": "08:00:27:11:ad:d2",
            "addresses": [
              "10.0.2.15/24",
              "fe80::f50c:b029:30a5:3e26/64"
            ]
          },
          {
            "name": "enp0s8",
            "mac": "08:00:27:9f:5d:f3",
            "addresses": [
              "172.28.128.3/24",
              "fe80::a00:27ff:fe9f:5df3/64"
            ]
          }
        ]
      },
      "arch": "amd64"
    },
    "subscriptions": [
      "entity:sensu-centos"
    ],
    "last_seen": 1543349936,
    "deregister": false,
    "deregistration": {},
    "user": "agent",
    "redact": [
      "password",
      "passwd",
      "pass",
      "api_key",
      "api_token",
      "access_key",
      "secret_key",
      "private_key",
      "secret"
    ],
    "metadata": {
      "name": "sensu-centos",
      "namespace": "default",
      "labels": null,
      "annotations": null
    }
  }
]
{{< /highlight >}}

### `/entities` (POST)

/entities (POST) | 
----------------|------
description     | Create a Sensu entity.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/entities
payload         | {{< highlight shell >}}
{
  "entity_class": "proxy",
  "subscriptions": [
    "web"
  ],
  "deregister": false,
  "deregistration": {},
  "metadata": {
    "name": "sensu-centos",
    "namespace": "default",
    "labels": null,
    "annotations": null
  }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## The `/entities/:entity` API endpoint {#the-entitiesentity-api-endpoint}

### `/entities/:entity` (GET) {#entitiesentity-get}

The `/entities/:entity` API endpoint provides HTTP GET access to [entity data][1] for specific `:entity` definitions, by entity `name`.

#### EXAMPLE {#entitiesentity-get-example}

In the following example, querying the `/entities/:entity` API returns a JSON Map
containing the requested [`:entity` definition][1] (in this example: for the `:entity` named
`sensu-centos`).

{{< highlight shell >}}
curl http://127.0.0.1:8080/api/core/v2/namespaces/default/entities/sensu-centos -H "Authorization: Bearer $SENSU_TOKEN"
{
  "entity_class": "agent",
  "system": {
    "hostname": "sensu-centos",
    "os": "linux",
    "platform": "centos",
    "platform_family": "rhel",
    "platform_version": "7.4.1708",
    "network": {
      "interfaces": [
        {
          "name": "lo",
          "addresses": [
            "127.0.0.1/8",
            "::1/128"
          ]
        },
        {
          "name": "enp0s3",
          "mac": "08:00:27:11:ad:d2",
          "addresses": [
            "10.0.2.15/24",
            "fe80::f50c:b029:30a5:3e26/64"
          ]
        },
        {
          "name": "enp0s8",
          "mac": "08:00:27:9f:5d:f3",
          "addresses": [
            "172.28.128.3/24",
            "fe80::a00:27ff:fe9f:5df3/64"
          ]
        }
      ]
    },
    "arch": "amd64"
  },
  "subscriptions": [
    "entity:sensu-centos"
  ],
  "last_seen": 1543349936,
  "deregister": false,
  "deregistration": {},
  "user": "agent",
  "redact": [
    "password",
    "passwd",
    "pass",
    "api_key",
    "api_token",
    "access_key",
    "secret_key",
    "private_key",
    "secret"
  ],
  "metadata": {
    "name": "sensu-centos",
    "namespace": "default",
    "labels": null,
    "annotations": null
  }
}
{{< /highlight >}}

#### API Specification {#entitiesentity-get-specification}

/entities/:entity (GET) | 
---------------------|------
description          | Returns a entity.
example url          | http://hostname:8080/api/core/v2/namespaces/default/entities/sensu-centos
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "entity_class": "agent",
  "system": {
    "hostname": "sensu-centos",
    "os": "linux",
    "platform": "centos",
    "platform_family": "rhel",
    "platform_version": "7.4.1708",
    "network": {
      "interfaces": [
        {
          "name": "lo",
          "addresses": [
            "127.0.0.1/8",
            "::1/128"
          ]
        },
        {
          "name": "enp0s3",
          "mac": "08:00:27:11:ad:d2",
          "addresses": [
            "10.0.2.15/24",
            "fe80::f50c:b029:30a5:3e26/64"
          ]
        },
        {
          "name": "enp0s8",
          "mac": "08:00:27:9f:5d:f3",
          "addresses": [
            "172.28.128.3/24",
            "fe80::a00:27ff:fe9f:5df3/64"
          ]
        }
      ]
    },
    "arch": "amd64"
  },
  "subscriptions": [
    "entity:sensu-centos"
  ],
  "last_seen": 1543349936,
  "deregister": false,
  "deregistration": {},
  "user": "agent",
  "redact": [
    "password",
    "passwd",
    "pass",
    "api_key",
    "api_token",
    "access_key",
    "secret_key",
    "private_key",
    "secret"
  ],
  "metadata": {
    "name": "sensu-centos",
    "namespace": "default",
    "labels": null,
    "annotations": null
  }
}
{{< /highlight >}}

### `/entities/:entity` (PUT) {#entitiesentity-put}

#### API Specification {#entitiesentity-put-specification}

/entities/:entity (PUT) | 
----------------|------
description     | Create or update a Sensu entity.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/entities/sensu-centos
payload         | {{< highlight shell >}}
{
  "entity_class": "proxy",
  "subscriptions": [
    "web"
  ],
  "deregister": false,
  "deregistration": {},
  "metadata": {
    "name": "sensu-centos",
    "namespace": "default",
    "labels": null,
    "annotations": null
  }
}
{{< /highlight >}}
response codes  | <ul><li>**Success**: 201 (Created)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

### `/entities/:entity` (DELETE) {#entitiesentity-delete}

The `/entities/:entity` API endpoint provides HTTP DELETE access to delete an entity from Sensu given the entity name.

### EXAMPLE {#entitiesentity-delete-example}
The following example shows a request to delete the entity `server1`, resulting in a successful HTTP 204 No Content response.

{{< highlight shell >}}
curl -X DELETE \
-H "Authorization: Bearer $SENSU_TOKEN" \
http://127.0.0.1:8080/api/core/v2/namespaces/default/entities/server1

HTTP/1.1 204 No Content
{{< /highlight >}}

#### API Specification {#entitiesentity-delete-specification}

/entities/:entity (DELETE) | 
--------------------------|------
description               | Removes a entity from Sensu given the entity name.
example url               | http://hostname:8080/api/core/v2/namespaces/default/entities/sensu-centos
response codes            | <ul><li>**Success**: 202 (Accepted)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

[1]: ../../reference/entities
