---
title: "core/v2/entities"
description: "Read this API documentation for information about Sensu core/v2/entities API endpoints, with examples for retrieving and managing entities."
core_api_title: "core/v2/entities"
type: "core_api"
version: "6.12"
product: "Sensu Go"
menu:
  sensu-go-6.12:
    parent: core
---

{{% notice note %}}
**NOTE**: Requests to `core/v2/entities` API endpoints require you to authenticate with a Sensu [API key](../../#configure-an-environment-variable-for-api-key-authentication) or [access token](../../#authenticate-with-auth-api-endpoints).
The code examples in this document use the [environment variable](../../#configure-an-environment-variable-for-api-key-authentication) `$SENSU_API_KEY` to represent a valid API key in API requests.
{{% /notice %}}

## Get all entities

The `/entities` API endpoint provides HTTP GET access to [entity][1] data.

### Example {#entities-get-example}

The following example demonstrates a GET request to the `/entities` API endpoint:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/entities \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request results in a successful `HTTP/1.1 200 OK` response and a JSON array that contains the [entity definitions][1] in the `default` namespace:

{{< code text >}}
[
  {
    "entity_class": "agent",
    "sensu_agent_version": "1.0.0",
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
      "arch": "amd64",
      "libc_type": "glibc",
      "vm_system": "kvm",
      "vm_role": "host",
      "cloud_provider": "",
      "processes": [
        {
          "name": "Slack",
          "pid": 1349,
          "ppid": 0,
          "status": "Ss",
          "background": true,
          "running": true,
          "created": 1582137786,
          "memory_percent": 1.09932518,
          "cpu_percent": 0.3263987595984941
        },
        {
          "name": "Slack Helper",
          "pid": 1360,
          "ppid": 1349,
          "status": "Ss",
          "background": true,
          "running": true,
          "created": 1582137786,
          "memory_percent": 0.146866455,
          "cpu_percent": 0.308976181461092553
        }
      ]
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
      "created_by": "admin",
      "labels": null,
      "annotations": null
    }
  }
]
{{< /code >}}

### API Specification {#entities-get-specification}

/entities (GET)  | 
---------------|------
description    | Returns the list of entities.
example url    | http://hostname:8080/api/core/v2/namespaces/default/entities
pagination     | This endpoint supports [pagination][2] using the `limit` and `continue` query parameters.
response filtering | This endpoint supports [API response filtering][3].
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "entity_class": "agent",
    "sensu_agent_version": "1.0.0",
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
      "arch": "amd64",
      "libc_type": "glibc",
      "vm_system": "kvm",
      "vm_role": "host",
      "cloud_provider": "",
      "processes": [
        {
          "name": "Slack",
          "pid": 1349,
          "ppid": 0,
          "status": "Ss",
          "background": true,
          "running": true,
          "created": 1582137786,
          "memory_percent": 1.09932518,
          "cpu_percent": 0.3263987595984941
        },
        {
          "name": "Slack Helper",
          "pid": 1360,
          "ppid": 1349,
          "status": "Ss",
          "background": true,
          "running": true,
          "created": 1582137786,
          "memory_percent": 0.146866455,
          "cpu_percent": 0.308976181461092553
        }
      ]
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
      "created_by": "admin",
      "labels": null,
      "annotations": null
    }
  }
]
{{< /code >}}

## Create a new entity

The `/entities` API endpoint provides HTTP POST access to create a Sensu entity.

### Example {#entities-post-example}

In the following example, an HTTP POST request is submitted to the `/entities` API endpoint to create a proxy entity named `sensu-centos`.
The request includes the entity definition in the request body:

{{< code shell >}}
curl -X POST \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "entity_class": "proxy",
  "sensu_agent_version": "1.0.0",
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
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/entities
{{< /code >}}

The request will return a successful `HTTP/1.1 201 Created` response.

### API Specification {#entities-post-specification}

/entities (POST) | 
----------------|------
description     | Creates a Sensu entity.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/entities
payload         | {{< code shell >}}
{
  "entity_class": "proxy",
  "sensu_agent_version": "1.0.0",
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
{{< /code >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a specific entity

The `/entities/:entity` API endpoint provides HTTP GET access to [entity data][1] for specific `:entity` definitions, by entity `name`.

### Example {#entitiesentity-get-example}

The following example queries the `/entities/:entity` API endpoint for the `:entity` named `sensu-centos`:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/core/v2/namespaces/default/entities/sensu-centos \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

The request will return a successful `HTTP/1.1 200 OK` response and a JSON map that contains the requested [`:entity` definition][1] (in this example, `sensu-centos`):

{{< code text >}}
{
  "entity_class": "agent",
  "sensu_agent_version": "1.0.0",
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
    "arch": "amd64",
    "libc_type": "glibc",
    "vm_system": "kvm",
    "vm_role": "host",
    "cloud_provider": "",
    "processes": [
      {
        "name": "Slack",
        "pid": 1349,
        "ppid": 0,
        "status": "Ss",
        "background": true,
        "running": true,
        "created": 1582137786,
        "memory_percent": 1.09932518,
        "cpu_percent": 0.3263987595984941
      },
      {
        "name": "Slack Helper",
        "pid": 1360,
        "ppid": 1349,
        "status": "Ss",
        "background": true,
        "running": true,
        "created": 1582137786,
        "memory_percent": 0.146866455,
        "cpu_percent": 0.308976181461092553
      }
    ]
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
    "created_by": "admin",
    "labels": null,
    "annotations": null
  }
}
{{< /code >}}

### API Specification {#entitiesentity-get-specification}

/entities/:entity (GET) | 
---------------------|------
description          | Returns the specified entity.
example url          | http://hostname:8080/api/core/v2/namespaces/default/entities/sensu-centos
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code text >}}
{
  "entity_class": "agent",
  "sensu_agent_version": "1.0.0",
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
    "arch": "amd64",
    "libc_type": "glibc",
    "vm_system": "kvm",
    "vm_role": "host",
    "cloud_provider": "",
    "processes": [
      {
        "name": "Slack",
        "pid": 1349,
        "ppid": 0,
        "status": "Ss",
        "background": true,
        "running": true,
        "created": 1582137786,
        "memory_percent": 1.09932518,
        "cpu_percent": 0.3263987595984941
      },
      {
        "name": "Slack Helper",
        "pid": 1360,
        "ppid": 1349,
        "status": "Ss",
        "background": true,
        "running": true,
        "created": 1582137786,
        "memory_percent": 0.146866455,
        "cpu_percent": 0.308976181461092553
      }
    ]
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
    "created_by": "admin",
    "labels": null,
    "annotations": null
  }
}
{{< /code >}}

## Create or update an entity {#entitiesentity-put}

{{% notice note %}}
**NOTE**: This endpoint will not update [agent-managed entities](../../../observability-pipeline/observe-entities/entities/#manage-agent-entities-via-the-agent).
Requests to update agent-managed entities via the Sensu backend REST API will fail and return `HTTP 409 Conflict`.
{{% /notice %}}

The `/entities/:entity` API endpoint provides HTTP PUT access to create or update the specified Sensu entity.

### Example {#entitiesentity-put-example}

In the following example, an HTTP PUT request is submitted to the `/entities/:entity` API endpoint to update the entity named `sensu-centos`.
The request includes the updated entity definition in the request body:

{{< code shell >}}
curl -X PUT \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/json' \
-d '{
  "entity_class": "proxy",
  "sensu_agent_version": "1.0.0",
  "subscriptions": [
    "web",
    "system"
  ],
  "deregister": false,
  "deregistration": {},
  "metadata": {
    "name": "sensu-centos",
    "namespace": "default",
    "labels": null,
    "annotations": null
  }
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/entities/sensu-centos
{{< /code >}}

The request will return a successful `HTTP/1.1 200 OK` response and a JSON map that contains the updated entity definition:

{{< code text >}}
{
    "entity_class": "proxy",
    "system": {
        "network": {
            "interfaces": null
        },
        "libc_type": "",
        "vm_system": "",
        "vm_role": "",
        "cloud_provider": "",
        "processes": null
    },
    "subscriptions": [
        "web",
        "system"
    ],
    "last_seen": 0,
    "deregister": false,
    "deregistration": {},
    "metadata": {
        "name": "sensu-centos",
        "namespace": "default"
    },
    "sensu_agent_version": "1.0.0"
}
{{< /code >}}

### API Specification {#entitiesentity-put-specification}

/entities/:entity (PUT) | 
----------------|------
description     | Creates or updates the specified Sensu entity. {{% notice note %}}
**NOTE**: When you create an entity via an HTTP PUT request, the entity will use the namespace in the request URL.
{{% /notice %}}
example URL     | http://hostname:8080/api/core/v2/namespaces/default/entities/sensu-centos
payload         | {{< code shell >}}
{
  "entity_class": "proxy",
  "sensu_agent_version": "1.0.0",
  "subscriptions": [
    "web",
    "system"
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
{{< /code >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Update an entity with PATCH

{{% notice note %}}
**NOTE**: This endpoint will not update [agent-managed entities](../../../observability-pipeline/observe-entities/entities/#manage-agent-entities-via-the-agent).
Requests to update agent-managed entities via the Sensu backend REST API will fail and return `HTTP 409 Conflict`.
{{% /notice %}}

The `/entities/:entity` API endpoint provides HTTP PATCH access to update **entity configuration attributes** in `:entity` definitions, specified by entity name:

- `labels`
- `annotations`
- `created_by`
- `entity_class`
- `user`
- `subscriptions`
- `deregister`
- `deregistration`
- `redact`
- `keepalive_handler`

{{% notice note %}}
**NOTE**: You cannot change a resource's `name` or `namespace` with a PATCH request.
Use a [PUT request](#entitiesentity-put) instead.<br><br>
Also, you cannot add elements to an array with a PATCH request &mdash; you must replace the entire array.
{{% /notice %}}

### Example

In the following example, an HTTP PATCH request is submitted to the `/entities/:entity` API endpoint to add a label for the `sensu-centos` entity, resulting in a `HTTP/1.1 200 OK` response and the updated entity definition.

We support [JSON merge patches][4], so you must set the `Content-Type` header to `application/merge-patch+json` for PATCH requests.

{{< code shell >}}
curl -X PATCH \
-H "Authorization: Key $SENSU_API_KEY" \
-H 'Content-Type: application/merge-patch+json' \
-d '{
  "metadata": {
    "labels": {
      "region": "us-west-1"
    }
  }
}' \
http://127.0.0.1:8080/api/core/v2/namespaces/default/entities/sensu-centos
{{< /code >}}

### API Specification

/entities/:entity (PATCH) | 
----------------|------
description     | Updates the specified Sensu entity.
example URL     | http://hostname:8080/api/core/v2/namespaces/default/entities/sensu-centos
payload         | {{< code shell >}}
{
  "metadata": {
    "labels": {
      "region": "us-west-1"
    }
  }
}
{{< /code >}}
response codes  | <ul><li>**Success**: 200 (OK)</li><li>**Malformed**: 400 (Bad Request)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Delete an entity {#entitiesentity-delete}

The `/entities/:entity` API endpoint provides HTTP DELETE access to delete an entity from Sensu (specified by the entity name).

### Example {#entitiesentity-delete-example}

The following example shows a request to the `/entities/:entity` API endpoint to delete the entity `sensu-centos`, which will result in a successful `HTTP/1.1 204 No Content` response:

{{< code shell >}}
curl -X DELETE \
http://127.0.0.1:8080/api/core/v2/namespaces/default/entities/sensu-centos \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}

### API Specification {#entitiesentity-delete-specification}

/entities/:entity (DELETE) | 
--------------------------|------
description               | Removes a entity from Sensu (specified by the entity name).
example url               | http://hostname:8080/api/core/v2/namespaces/default/entities/sensu-centos
response codes            | <ul><li>**Success**: 204 (No Content)</li><li>**Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>

## Get a subset of entities with response filtering

The `/entities` API endpoint supports [response filtering][3] for a subset of entity data based on labels and the following fields:

- `entity.name`
- `entity.namespace`
- `entity.deregister`
- `entity.entity_class`
- `entity.subscriptions`

### Example

The following example demonstrates a request to the `/entities` API endpoint with [response filtering][3] for only [entity definitions][1] whose subscriptions include `linux`:

{{< code shell >}}
curl -H "Authorization: Key $SENSU_API_KEY" http://127.0.0.1:8080/api/core/v2/entities -G \
--data-urlencode 'fieldSelector="linux" in entity.subscriptions'
{{< /code >}}

The example request will result in a successful `HTTP/1.1 200 OK` response and a JSON array that contains only [entity definitions][1] whose subscriptions include `linux`:

{{< code text >}}
[
  {
    "entity_class": "agent",
    "system": {
      "network": {
        "interfaces": null
      },
      "libc_type": "",
      "vm_system": "",
      "vm_role": "",
      "cloud_provider": "",
      "processes": null
    },
    "subscriptions": [
      "linux",
      "entity:datastore01"
    ],
    "last_seen": 0,
    "deregister": false,
    "deregistration": {},
    "metadata": {
      "name": "datastore01",
      "namespace": "default",
      "labels": {
        "region": "us-west-1",
        "service_type": "datastore",
        "sensu.io/managed_by": "sensuctl"
      }
    },
    "sensu_agent_version": ""
  },
  {
    "entity_class": "agent",
    "system": {
      "hostname": "sensu-centos",
      "os": "linux",
      "platform": "centos",
      "platform_family": "rhel",
      "platform_version": "7.5.1804",
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
            "name": "eth0",
            "mac": "08:00:27:8b:c9:3f",
            "addresses": [
              "10.0.2.15/24",
              "fe80::c68e:8fd8:32f0:7c5d/64"
            ]
          },
          {
            "name": "eth1",
            "mac": "08:00:27:3b:a9:9f",
            "addresses": [
              "192.168.56.23/24",
              "fe80::a00:27ff:fe3b:a99f/64"
            ]
          }
        ]
      },
      "arch": "amd64",
      "libc_type": "glibc",
      "vm_system": "vbox",
      "vm_role": "guest",
      "cloud_provider": "",
      "processes": null
    },
    "subscriptions": [
      "linux",
      "entity:sensu-centos"
    ],
    "last_seen": 1644615964,
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
      "namespace": "default"
    },
    "sensu_agent_version": "6.6.5"
  }
]
{{< /code >}}

{{% notice note %}}
**NOTE**: Read [API response filtering](../../#response-filtering) for more filter statement examples that demonstrate how to filter responses using different operators with label and field selectors.
{{% /notice %}}

### API Specification

/entities (GET) with response filters | 
---------------|------
description    | Returns the list of entities that match the [response filters][3] applied in the API request.
example url    | http://hostname:8080/api/core/v2/entities
pagination     | This endpoint supports [pagination][4] using the `limit` and `continue` query parameters.
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< code text >}}
[
  {
    "entity_class": "agent",
    "system": {
      "network": {
        "interfaces": null
      },
      "libc_type": "",
      "vm_system": "",
      "vm_role": "",
      "cloud_provider": "",
      "processes": null
    },
    "subscriptions": [
      "linux",
      "entity:datastore01"
    ],
    "last_seen": 0,
    "deregister": false,
    "deregistration": {},
    "metadata": {
      "name": "datastore01",
      "namespace": "default",
      "labels": {
        "region": "us-west-1",
        "service_type": "datastore",
        "sensu.io/managed_by": "sensuctl"
      }
    },
    "sensu_agent_version": ""
  },
  {
    "entity_class": "agent",
    "system": {
      "hostname": "sensu-centos",
      "os": "linux",
      "platform": "centos",
      "platform_family": "rhel",
      "platform_version": "7.5.1804",
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
            "name": "eth0",
            "mac": "08:00:27:8b:c9:3f",
            "addresses": [
              "10.0.2.15/24",
              "fe80::c68e:8fd8:32f0:7c5d/64"
            ]
          },
          {
            "name": "eth1",
            "mac": "08:00:27:3b:a9:9f",
            "addresses": [
              "192.168.56.23/24",
              "fe80::a00:27ff:fe3b:a99f/64"
            ]
          }
        ]
      },
      "arch": "amd64",
      "libc_type": "glibc",
      "vm_system": "vbox",
      "vm_role": "guest",
      "cloud_provider": "",
      "processes": null
    },
    "subscriptions": [
      "linux",
      "entity:sensu-centos"
    ],
    "last_seen": 1644615964,
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
      "namespace": "default"
    },
    "sensu_agent_version": "6.6.5"
  }
]
{{< /code >}}


[1]: ../../../observability-pipeline/observe-entities/entities/
[2]: ../../#pagination
[3]: ../../#response-filtering
[4]: https://tools.ietf.org/html/rfc7396
