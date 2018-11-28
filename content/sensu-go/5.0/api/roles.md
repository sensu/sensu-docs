---
title: "Roles API"
description: "Sensu Go user roles API reference documentation"
version: "5.0"
product: "Sensu Go"
menu:
  sensu-go-5.0:
    parent: api
---

## The `/roles` API endpoint

### `/roles` (GET)

The `/roles` API endpoint provides HTTP GET access to [role][1] data.

#### EXAMPLE {#roles-get-example}

The following example demonstrates a request to the `/roles` API, resulting in
a JSON Array containing [role definitions][1].

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/apis/core/v2/namespaces/default/roles -H "Authorization: Bearer TOKEN"
[
  {
    "name": "admin",
    "rules": [
      {
        "type": "*",
        "permissions": [
          "create",
          "read",
          "update",
          "delete"
        ],
        "namespace": "*"
      }
    ]
  },
  {
    "name": "read-only",
    "rules": [
      {
        "type": "*",
        "permissions": [
          "read"
        ],
        "namespace": "*"
      }
    ]
  }
]
{{< /highlight >}}

#### API Specification {#roles-get-specification}

/roles (GET)  | 
---------------|------
description    | Returns the list of roles.
example url    | http://hostname:8080/apis/core/v2/namespaces/default/roles
response type  | Array
response codes | <ul><li>**Success**: 200 (OK)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output         | {{< highlight shell >}}
[
  {
    "name": "admin",
    "rules": [
      {
        "type": "*",
        "permissions": [
          "create",
          "read",
          "update",
          "delete"
        ],
        "namespace": "*"
      }
    ]
  },
  {
    "name": "read-only",
    "rules": [
      {
        "type": "*",
        "permissions": [
          "read"
        ],
        "namespace": "*"
      }
    ]
  }
]
{{< /highlight >}}

## The `/roles/:role` API endpoint {#the-rolesrole-api-endpoint}

### `/roles/:role` (GET) {#rolesrole-get}

The `/roles/:role` API endpoint provides HTTP GET access to [role data][1] for specific `:role` definitions, by role `name`.

#### EXAMPLE {#rolesrole-get-example}

In the following example, querying the `/roles/:role` API returns a JSON Map
containing the requested [`:role` definition][1] (in this example: for the `:role` named
`read-only`).

{{< highlight shell >}}
curl -s http://127.0.0.1:8080/apis/core/v2/namespaces/default/roles/read-only -H "Authorization: Bearer TOKEN"
{
  "name": "read-only",
  "rules": [
    {
      "type": "*",
      "permissions": [
        "read"
      ],
      "namespace": "*"
    }
  ]
}
{{< /highlight >}}

#### API Specification {#rolesrole-get-specification}

/roles/:role (GET) | 
---------------------|------
description          | Returns a role.
example url          | http://hostname:8080/apis/core/v2/namespaces/default/roles/read-only
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< highlight json >}}
{
  "name": "read-only",
  "rules": [
    {
      "type": "*",
      "permissions": [
        "read"
      ],
      "namespace": "*"
    }
  ]
}
{{< /highlight >}}

[1]: ../../reference/rbac
