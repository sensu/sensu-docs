---
title: "RBAC"
description: "The rbac reference guide."
weight: 1
version: "2.0"
product: "Sensu Core"
platformContent: false 
menu:
  sensu-core-2.0:
    parent: reference
---

## How does Role Based Access Control work?
Sensu RBAC allows management and access of users and resources based on a heirarchy of *organizations*, *environments*, *roles*, *rules*, and *users*. Each `environment` belongs to only one `organization`, and each `resource` (user, check, asset, etc) belongs to only one `environment`. A Sensu installation can have multiple organizations, each with their own set of environments and resources belonging to them.

### Authentication

Sensu 2.0 offers local users management. Users can be managed with `sensuctl`.
Support for external directories (such as LDAP) is planned for future releases.

## Terminology

### Organization

An organization is the top-level resource for RBAC. Each organization can
contain one or multiple environments. Sensu ships with a `default` organization.
#### Attributes

description  | 
-------------|------ 
description  | Description of the organization 
required     | false 
type         | String
example      | {{< highlight shell >}}"description": "Default organization"{{</highlight>}}

name         | 
-------------|------ 
description  | The name of the organization. Cannot contain special characters.
required     | true 
type         | String
example      | {{< highlight shell >}}"name": "default"{{</highlight>}}

### Environment

An environment contains a set of resources and represent a logical division,
such as `development`, `staging` and `production`. An environment belongs to a
single organization. Every organization has a `default` environment.

#### Attributes

name         | 
-------------|------ 
description  | The name of the environment. Cannot contain special characters.
required     | true 
type         | String
example      | {{< highlight shell >}}"name": "default"{{</highlight>}}

description  | 
-------------|------ 
description  | Description of the environment 
required     | false 
type         | String
example      | {{< highlight shell >}}"description": "Default environment"{{</highlight>}}

organization | 
-------------|------ 
description  | The name of the organization the environment belongs to. 
required     | false 
type         | String
default      | current environment value configured for `sensuctl` (ie `default`)
example      | {{< highlight shell >}}"organization": "default"{{</highlight>}}

### User

A user represents a person or an agent which interacts with Sensu.

#### Attributes

username     | 
-------------|------ 
description  | The name of the user. Cannot contain special characters.
required     | true 
type         | String
example      | {{< highlight shell >}}"name": "admin"{{</highlight>}}

password     | 
-------------|------ 
description  | The user's password. Cannot be empty. 
required     | true 
type         | String
example      | {{< highlight shell >}}"password": "P@ssw0rd!"{{</highlight>}}

roles        | 
-------------|------ 
description  | A list of roles the user belongs to.
required     | false 
type         | Array
example      | {{< highlight shell >}}"roles": ["admin"]{{</highlight>}}

disabled     | 
-------------|------ 
description  | The state of the user's account.
required     | false 
type         | Boolean 
default      | false
example      | {{< highlight shell >}}"disabled": false{{</highlight>}}

### Group

Not available yet!

### Role

A role contains a set of rules, which represent permissions to Sensu resources.

Roles can be assigned to one or multiple users. Each user can be a member of one
or multiple roles. Users inherit all of the permissions from each role they are
in.

The initial installation of Sensu includes an initial `admin` role that gives a
user associated with it full access to the system.

#### Attributes

name         | 
-------------|------ 
description  | Name of the role 
required     | true 
type         | String
example      | {{< highlight shell >}}"name": "admin"{{</highlight>}}

rules        | 
-------------|------ 
description  | The rulesets that a role applies.
required     | true 
type         | array 
example      | {{< highlight shell >}}"rules": [
    {
        "type": "*",
        "environment": "*",
        "organization": "*",
        "permissions": [
            "create",
            "read",
            "update",
            "delete"        
        ]
    } 
]{{</highlight>}}

### Rule

A rule is an explicit statement which grants a particular permission to a resource.

#### Attributes

type         | 
-------------|------ 
description  | The type of resource the rule has permission to access. 
required     | true 
type         | String
example      | {{< highlight shell >}}"type": "*"{{</highlight>}}
example      | {{< highlight shell >}}"type": "checks"{{</highlight>}}
example      | {{< highlight shell >}}"type": "environments"{{</highlight>}}

organization | 
-------------|------ 
description  | The name of the organization the rule belongs to. 
required     | true 
type         | String
example      | {{< highlight shell >}}"organization": "default"{{</highlight>}}
    
environment  | 
-------------|------ 
description  | The name of the environment the rule belongs to. 
required     | true 
type         | String
example      | {{< highlight shell >}}"environment": "default"{{</highlight>}}

permissions  | 
-------------|------ 
description  | The permissions to be applied by the rule. 
required     | true 
type         | Array
example      | {{< highlight shell >}}
{
  "name": "read-only",
  "rules": [
    {
      "type": "*",
      "environment": "default",
      "organization": "default",
      "permissions": [
        "read"
      ]
    }
  ]
}
{{</highlight>}}

### Resource Types

A resource type is the resource that a rule acts on. 

| Type | Description |
|---|---|
| `*` | Manage all resources. **NOTE**: The `*` type gives precedence to its rule over other rules within the same rule. If you wish to deny a certain type, you can't use the `*` type and must explicitly allow every type required |
| `assets` | Manage asset resources within a given organization & environment |
| `checks` | Manage check resources within a given organization & environment |
| `entities` | Manage entity resources within a given organization & environment |
| `environment` | Create and remove environments |
| `events` | Manage event resources within a given organization & environment |
| `handlers` | Manage handler resources within a given organization & environment |
| `mutators` | Manage mutator resources within a given organization & environment |
| `organizations` | Create and remove organizations |
| `roles` | Create, remove roles and set rules within |
| `users` | Manage user resources |
