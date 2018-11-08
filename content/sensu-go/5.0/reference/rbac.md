---
title: "Role-Based Access Control"
description: "Sensu RBAC reference documentation"
weight: 1
version: "5.0"
product: "Sensu Go"
menu:
  sensu-go-5.0:
    parent: reference
---

- [Default access](#default-access)
- [Namespaces](#namespaces)
- [Resources](#resources)
- [Roles](#roles)
- [Users](#users)
- [Role bindings](#role-bindings)

Sensu role-based access control (RBAC) helps different teams and projects share a Sensu instance.
RBAC allows management and access of users and resources based on a hierarchy of **namespaces**, **roles**, **users**, and **role bindings**.

- **Namespace**: Partitions resources within Sensu. Each Sensu resource (check, handler, etc.) belongs to a single namespace.
- **Role**: Creates a set of permissions (read, delete, etc.) tied to resource types.
- **User**: Represents a person or agent that interacts with Sensu.
- **Role binding**: Assigns a role to a user.

Sensu access controls apply both to [sensuctl][2] and the Sensu [dashboard][3].

## Default access
Every [Sensu backend][1] includes a `default` namespace.
All resources created without a specified namespace are created within the `default` namespace.

### Default users
Sensu includes three default users: `admin`, `sensu`, and `agent`.
Use the `admin` user to manage Sensu and create new users; use the `sensu` user to explore Sensu as a read-only user.
User access credentials can be used to configure [sensuctl][2] or log in to the [dashboard][3].

| username | password    |  role       | access |
| -------- | ----------- | ----------- | ------ |
| `admin`  | `P@ssw0rd!` | `admin`     | Create, read, update, and delete access for all [resource types][4]. |
| `sensu`  | `sensu`     | `read-only` | Read-only access for all [resource types][4]. |
| `agent`  | n/a         | `agent`     | The `agent` user is used by the Sensu agent and doesn't have an accessible role or password. |

We **strongly** recommended changing default passwords immediately.
Once authenticated, you can change the password using the `change-password` command.

{{< highlight shell >}}
sensuctl user change-password --interactive
{{< /highlight >}}

## Namespaces
Namespaces help teams use different resources (checks, handlers, etc.) within Sensu and impose their own controls on those resources.
A Sensu instance can have multiple namespaces, each with their own set of managed resources.
Resource names need to be unique within a namespace, but not across namespaces.

### Default namespace

Every [Sensu backend][1] includes a `default` namespace.
All resources created without a specified namespace are created within the `default` namespace.

### Viewing namespaces

You can use [sensuctl][2] to view all namespaces within Sensu:

{{< highlight shell >}}
sensuctl namespace list
{{</highlight>}}

sensuctl lists namespaces by name and description:

{{< highlight shell >}}
Name         Description       
───────── ─────────────────── 
default   Default namespace
{{</highlight>}}

### Creating a namespace

You can use [sensuctl][2] to create a namespace:

{{< highlight shell >}}
sensuctl namespace create --interactive
{{</highlight>}}

Then specify the name and description when prompted:

{{< highlight shell >}}
? Name: ops
? Description: Ops team production monitoring
{{</highlight>}}

Names can contain alphanumeric characters and hyphens, but must begin and end with an alphanumeric character.

### Managing namespaces
You can use [sensuctl][2] to view, create, update, and delete namespaces.

To update the description for a namespace:

{{< highlight shell >}}
sensuctl namespace update [NAMESPACE-NAME]
{{</highlight>}}

To delete a namespace:

{{< highlight shell >}}
sensuctl namespace delete [NAMESPACE-NAME]
{{</highlight>}}

_WARNING: This deletes every resource definition associated with the namespace._

To get help managing namespaces with sensuctl:

{{< highlight shell >}}
sensuctl namespace help
{{</highlight>}}

### Namespace specification

#### Attributes

name         | 
-------------|------ 
description  | The name of the namespace. Names can contain alphanumeric characters and hyphens, but must begin and end with an alphanumeric character.
required     | true 
type         | String
example      | {{< highlight shell >}}"name": "ops"{{</highlight>}}

description  | 
-------------|------ 
description  | Description of the namespace
required     | false 
type         | String
example      | {{< highlight shell >}}"description": "Ops team production monitoring"{{</highlight>}}

## Resources
Permissions within Sensu are scoped to resource types, like checks, handlers, and users.
All resource types (with the exceptions of namespaces, users, and roles) must belong to a single namespace.

### Resource types

| Type | Description |
|---|---|
| `*` | All resources within Sensu. **The `*` type takes precedence over other rules within the same role.** If you wish to deny a certain type, you can't use the `*` type and must explicitly allow every type required |
| `assets` | [Asset][5] resources within a namespace |
| `checks` | [Check][6] resources within a namespace |
| `entities` | [Entity][7] resources within a namespace |
| `events` | [Event][8] resources within a namespace |
| `handlers` | [Handler][9] resources within a namespace |
| `hooks` | [Hook][10] resources within a namespace |
| `mutators` | [Mutator][11] resources within a namespace |
| `namespace` | [Namespaces][12] |
| `roles` | [Roles][13] |
| `silenced` | [Silencing][14] resources within a namespace |
| `users` | [Users][15] |

### Assigning a resource to a namespace

You can assign a resource to a namespace in the resource definition.
Namespaces, users, and roles are part of Sensu RBAC and don't need to be assigned to a namespace.

For example, to assign a check called `check-cpu` to the `ops` namespace, include the `namespace` attribute in the check definition:

{{< highlight json >}}
{
  "type": "CheckConfig",
  "spec": {
    "name": "check-cpu",
    "namespace": "ops",
    "subscriptions": [
      "system"
    ],
    "command": "check-cpu.sh -w 75 -c 90",
    "interval": 30,
    "publish": true
  }
}{{</highlight>}}

See [reference docs][16] for the corresponding [resource type][4] to create resource definitions.

## Roles

A role is a set of permissions controlling access to Sensu resources.
Roles can be assigned to one or multiple users, and each user can be a member of one or multiple roles.
Users inherit all of the permissions from each role they are
in.

### Default roles

Every [Sensu backend][1] includes:

- A global `admin` role that grants full access (read, create, update, and delete) to all [resource types][4] across namespaces
- A global `read-only` role that grants read-only permission to all [resource types][4] across namespaces

### Viewing roles

You can use sensuctl to see a list of all roles within Sensu:

{{< highlight shell >}}
sensuctl role list
{{</highlight>}}

To see the permissions and scope for a specific role:

{{< highlight shell >}}
sensuctl role info admin
{{</highlight>}}

You can see that the default `admin` role has create, read, update, and delete access for all (`*`) [resource types][4] across all namespaces.

{{< highlight shell >}}
Type   Namespace          Permissions         
────── ──────────── ─────────────────────────── 
*      *             create,read,update,delete  
{{</highlight>}}

### Creating a role

You can use sensuctl to create a role.
For example, the following command creates an admin role restricted to the ops namespace.

{{< highlight shell >}}
sensuctl role create ops-admin --create --read --update --delete --namespace ops --type *
{{</highlight>}}

You can also create a role using a JSON role definition.

{{< highlight shell >}}
{
  "name": "ops-admin",
  "namespace": "ops",
  "rules": [
    {
      "verbs": ["create", "read", "update", "delete"],
      "resources": ["*"],
      "resourceNames": [""]
    }
  ]
}
{{</highlight>}}

### Creating a cluster-wide role

To create a role that applies to all resources across namespaces, create a role without a namespace attribute.
For example, the following command creates a global event reader role that can read only events across all namespaces within Sensu.

{{< highlight shell >}}
sensuctl role create global-event-reader --read --type events
{{</highlight>}}

You can also create a role using a JSON role definition.

{{< highlight json >}}
{
  "name": "global-event-reader",
  "rules": [
    {
      "verbs": ["read"],
      "resources": ["events"],
      "resourceNames": [""]
    }
  ]
}
{{</highlight>}}

### Managing roles

You can use [sensuctl][2] to view, create, update, and delete roles.

To add permissions to a role:

{{< highlight shell >}}
sensuctl role add-rule [ROLE-NAME] [flags]
{{</highlight>}}

To remove permissions from a role:

{{< highlight shell >}}
sensuctl role remove-rule [ROLE-NAME] [flags]
{{</highlight>}}

To delete a role:

{{< highlight shell >}}
sensuctl role delete [ROLE-NAME]
{{</highlight>}}

To get help managing roles with sensuctl:

{{< highlight shell >}}
sensuctl role help
{{</highlight>}}

### Role specification

#### Role attributes

name         | 
-------------|------ 
description  | Name of the role 
required     | true 
type         | String
example      | {{< highlight shell >}}"name": "admin"{{</highlight>}}

namespace    | 
-------------|------ 
description  | Namespace the role is restricted to. If no namespace is specified, the role applies cluster-wide.
required     | false
type         | String
example      | {{< highlight shell >}}"namespace": "ops-team"{{</highlight>}}

rules        | 
-------------|------ 
description  | The rulesets that a role applies.
required     | true 
type         | array 
example      | {{< highlight shell >}}"rules": [
  {
    "verbs": ["get", "list"],
    "resources": ["checks"],
    "resourceNames": [""]
  }
]{{</highlight>}}

#### Rule attributes
A rule is an explicit statement which grants a particular permission to a resource.

verbs  | 
-------------|------ 
description  | The permissions to be applied by the rule: `create`, `read`, `update`, or `delete`. 
required     | true 
type         | Array
example      | {{< highlight shell >}}
{
  "name": "read-only",
  "rules": [
    {
      "type": "*",
      "namespace": "default",
      "permissions": [
        "read"
      ]
    }
  ]
}
{{</highlight>}}

resources         | 
-------------|------ 
description  | The type of resource the rule has permission to access: 
required     | true 
type         | Array
example      | {{< highlight shell >}}"resources": ["checks"]{{</highlight>}}

resourceNames    | 
-------------|------ 
description  | ?
required     | false
type         | Array
example      | {{< highlight shell >}}"resourceNames": [""]{{</highlight>}}

## Users
A user represents a person or an agent which interacts with Sensu.

### Default users

Sensu includes three default users: `admin`, `sensu`, and `agent`.
Use the `admin` user to manage Sensu and create new users; use the `sensu` user to explore Sensu as a read-only user.
User access credentials can be used to configure [sensuctl][2] or log in to the [dashboard][3].

| username | password    |  role       | access |
| -------- | ----------- | ----------- | ------ |
| `admin`  | `P@ssw0rd!` | `admin`     | Create, read, update, and delete access for all [resource types][4]. |
| `sensu`  | `sensu`     | `read-only` | Read-only access for all [resource types][4]. |
| `agent`  | n/a         | `agent`     | The `agent` user is used by the Sensu agent and doesn't have an accessible role or password. |

We **strongly** recommended changing default passwords immediately.
Once authenticated, you can change the password using the `change-password` command.

{{< highlight shell >}}
sensuctl user change-password --interactive
{{< /highlight >}}

### Viewing users
You can use sensuctl to see a list of all users within Sensu:

{{< highlight shell >}}
sensuctl user list
{{< /highlight >}}

sensuctl lists users by username and role.

{{< highlight shell >}}
Username     Roles     Enabled  
────────── ─────────── ───────── 
admin      admin       true     
agent      agent       true     
sensu      read-only   true   
{{< /highlight >}}

### Creating a user
You can use sensuctl to create a user.
For example, the following command creates a user with the username `alice` and the password `P@ssw0rd!`.

{{< highlight shell >}}
sensuctl user create alice --password P@ssw0rd!
{{< /highlight >}}

### Assigning user permissions

To assign permissions to a user:

1. Create the [user](#users)
2. Create the [role](#roles)
3. Create a [role binding](#role-bindings) to assign the role to the user

### Managing users

You can use sensuctl to view, create, and manage users.

To change the password for a user:

{{< highlight shell >}}
sensuctl user change-password [USERNAME] [flags]
{{< /highlight >}}

To disable a user:

{{< highlight shell >}}
sensuctl user disable [USERNAME]
{{< /highlight >}}

To re-enable a disabled user:

{{< highlight shell >}}
sensuctl user reinstate [USERNAME]
{{< /highlight >}}

### User specification

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

disabled     | 
-------------|------ 
description  | The state of the user's account.
required     | false 
type         | Boolean 
default      | false
example      | {{< highlight shell >}}"disabled": false{{</highlight>}}

## Role bindings

A role binding assigns a role to a user or set of users.

### Viewing role bindings

You can use sensuctl to see a list of role bindings within Sensu:

{{< highlight shell >}}
sensuctl role-binding list
{{</highlight>}}

To see the details for a specific role binding:

{{< highlight shell >}}
sensuctl role-binding info [BINDING-NAME]
{{</highlight>}}

### Creating a role binding

### Assigning user permissions

To assign permissions to a user:

1. Create the [user](#users)
2. Create the [role](#roles)
3. Create a [role binding](#role-bindings) to assign the role to the user

### Managing role bindings

### Role binding specification

[1]: ../backend
[2]: ../../sensuctl/reference
[3]: ../../dashboard/overview
[4]: #resource-types
[5]: ../assets
[6]: ../checks
[7]: ../entities
[8]: ../events
[9]: ../handlers
[10]: ../hooks
[11]: ../mutatotrs
[12]: #namespaces
[13]: #roles
[14]: ../silencing
[15]: #users
[16]: ../../reference
