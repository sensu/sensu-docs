---
title: "Role-based access control"
linkTitle: "Role-Based Access Control"
description: "Sensu RBAC reference documentation"
weight: 10
version: "5.1"
product: "Sensu Go"
menu:
  sensu-go-5.1:
    parent: reference
---

- [Namespaces](#namespaces): [Managing namespaces](#viewing-namespaces) | [Specification](#namespace-specification) | [Examples](#namespace-examples)
- [Resources](#resources): [Namespaced resource types](#namespaced-resource-types) | [Cluster-wide resource types](#cluster-wide-resource-types)
- [Users](#users): [Managing users](#viewing-users) | [Specification](#user-specification) | [Groups](#groups)
- [Roles and cluster roles](#roles-and-cluster-roles): [Managing roles](#viewing-roles) | [Specification](#role-and-cluster-role-specification) | [Examples](#role-examples)
- [Role bindings and cluster role bindings](#role-bindings-and-cluster-role-bindings): [Managing role bindings](#viewing-role-bindings) | [Specification](#role-binding-and-cluster-role-binding-specification) | [Examples](#role-binding-examples)

Sensu role-based access control (RBAC) helps different teams and projects share a Sensu instance.
RBAC allows management and access of users and resources based on **namespaces**, **groups**, **roles**, and **bindings**.

- **Namespaces** partition resources within Sensu. Sensu checks, handlers, and other [namespaced resources][17] belong to a single namespace.
- **Roles** create sets of permissions (get, delete, etc.) tied to resource types. **Cluster roles** apply permissions across namespaces and include access to [cluster-wide resources][18] like users and namespaces. 
- **Users** represent a person or agent that interacts with Sensu. Users can belong to one or more **groups**.
- **Role bindings** assign a role to a set of users and groups within a namespace; **cluster role bindings** assign a cluster role to a set of users and groups cluster-wide.

Sensu access controls apply to [sensuctl][2], the Sensu [API][19], and the Sensu [dashboard][3].

## Namespaces
Namespaces help teams use different resources (checks, handlers, etc.) within Sensu and impose their own controls on those resources.
A Sensu instance can have multiple namespaces, each with their own set of managed resources.
Resource names need to be unique within a namespace, but not across namespaces.

To create and manage namespaces, [configure sensuctl][26] as the [default `admin` user][20] or create a [cluster role][21] with `namespaces` permissions.

### Default namespace

Every [Sensu backend][1] includes a `default` namespace.
All resources created without a specified namespace are created within the `default` namespace.

### Viewing namespaces

You can use [sensuctl][2] to view all namespaces within Sensu:

{{< highlight shell >}}
sensuctl namespace list
{{< /highlight >}}

### Creating a namespace

You can use [sensuctl][2] to create a namespace.
For example, the following command creates a namespace called `production`:

{{< highlight shell >}}
sensuctl namespace create production
{{< /highlight >}}

Namespace names can contain alphanumeric characters and hyphens, but must begin and end with an alphanumeric character.

### Managing namespaces

You can use [sensuctl][2] to view, create, and delete namespaces.

To delete a namespace:

{{< highlight shell >}}
sensuctl namespace delete [NAMESPACE-NAME]
{{< /highlight >}}

_WARNING: This deletes every resource definition associated with the namespace._

To get help managing namespaces with sensuctl:

{{< highlight shell >}}
sensuctl namespace help
{{< /highlight >}}

### Assigning a resource to a namespace

You can assign a resource to a namespace in the resource definition.
Only resources belonging to a [namespaced resource type][17] (like checks, filters, and handlers) can be assigned to a namespace.

For example, to assign a check called `check-cpu` to the `production` namespace, include the `namespace` attribute in the check definition:

{{< highlight json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "check-cpu",
    "namespace": "default"
  },
  "spec": {
    "check_hooks": null,
    "command": "check-cpu.sh -w 75 -c 90",
    "handlers": [
      "slack"
    ],
    "interval": 30,
    "subscriptions": [
      "system"
    ],
    "timeout": 0,
    "ttl": 0
  }
}{{< /highlight >}}

See the [reference docs][16] for the corresponding [resource type][17] to create resource definitions.

### Namespace specification

#### Attributes

name         | 
-------------|------ 
description  | The name of the namespace. Names can contain alphanumeric characters and hyphens, but must begin and end with an alphanumeric character.
required     | true 
type         | String
example      | {{< highlight shell >}}"name": "production"{{< /highlight >}}

### Namespace examples

The following examples are in `wrapped-json` format for use with [`sensuctl create`][31].

{{< highlight json >}}
{
  "type": "Namespace",
  "api_version": "core/v2",
  "metadata": {},
  "spec": {
    "name": "default"
  }
}
{{< /highlight >}}

## Resources
Permissions within Sensu are scoped to resource types, like checks, handlers, and users.
You can use resource types to configure permissions in Sensu roles and cluster roles. 

### Namespaced resource types
Namespaced resources must belong to a single namespace and can be accessed by [roles][13] and [cluster roles][21].

| Type | Description |
|---|---|
| `assets` | [Asset][5] resources within a namespace |
| `checks` | [Check][6] resources within a namespace |
| `entities` | [Entity][7] resources within a namespace |
| `events` | [Event][8] resources within a namespace |
| `filters`   | [Filter][22] resources within a namespace  |
| `handlers` | [Handler][9] resources within a namespace |
| `hooks` | [Hook][10] resources within a namespace |
| `mutators` | [Mutator][11] resources within a namespace |
| `rolebindings`   | Namespace-specific role assigners  |
| `roles` | Namespace-specific permission sets |
| `silenced` | [Silencing][14] resources within a namespace |

### Cluster-wide resource types
Cluster-wide resources cannot be assigned to a namespace and can only be accessed by [cluster roles][21].

| Type | Description |
|---|---|
| `cluster`   | Sensu clusters running multiple [Sensu backends][1] |
| `clusterrolebindings`   | Cluster-wide role assigners  |
| `clusterroles`   | Cluster-wide permission sets  |
| `namespaces` | Resource partitions within a Sensu instance |
| `users` | People or agents interacting with Sensu |

### Special resource types
Special resources types can be accessed by both [roles][13] and [cluster roles][21].

| Type | Description |
|---|---|
| `*` | All resources within Sensu. **The `*` type takes precedence over other rules within the same role.** If you wish to deny a certain type, you can't use the `*` type and must explicitly allow every type required. When applied to a role, the `*` type applies only to [namespaced resource types][17]. When applied to a cluster role, the `*` type applies to both [namespaced resource types][17] and [cluster-wide resource types][18]. |

## Users

A user represents a person or an agent which interacts with Sensu.
Users and groups can be assigned one or more roles and inherit all permissions from each role assigned to them.

You can use your Sensu username and password to [configure sensuctl][26] or log in to the [dashboard][3].

### Default user

By default, Sensu includes a global `admin` user that you can use to manage Sensu and create new users.

| attribute | value |
| --------- | ----- |
| username   | `admin`  |
| password   | `P@ssw0rd!`  |
| groups   | `cluster-admins`  |
| cluster role   |  `cluster-admin` |
| cluster role binding   | `cluster-admin	`  |

We **strongly** recommended changing the default password for the admin user immediately.
Once authenticated, you can change the password using the `change-password` command.

{{< highlight shell >}}
sensuctl user change-password
{{< /highlight >}}

Sensu also includes an `agent` user that is used internally by the Sensu agent and should not be modified.

_WARNING: Modification of the `agent` user can result in non-functional Sensu agents._

### Viewing users
You can use [sensuctl][2] to see a list of all users within Sensu:

{{< highlight shell >}}
sensuctl user list
{{< /highlight >}}

### Creating a user
You can use [sensuctl][2] to create a user.
For example, the following command creates a user with the username `alice` and the password `password`.
Passwords must have at least eight characters.

{{< highlight shell >}}
sensuctl user create alice --password 'password'
{{< /highlight >}}

### Assigning user permissions

To assign permissions to a user:

1. [Create the user][27].
2. [Create a role][25] or (for cluster-wide access) a [cluster role][28].
3. [Create a role binding][29] (or [cluster role binding][29]) to assign the role to the user.

### Managing users

You can use [sensuctl][2] to view, create, and manage users.

To change the password for a user:

{{< highlight shell >}}
sensuctl user change-password [USERNAME]
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
example      | {{< highlight shell >}}"username": "alice"{{< /highlight >}}

password     | 
-------------|------ 
description  | The user's password. Cannot be empty. 
required     | true 
type         | String
example      | {{< highlight shell >}}"password": "P@ssw0rd!"{{< /highlight >}}

groups     | 
-------------|------ 
description  | Groups to which the user belongs.
required     | false 
type         | Array
example      | {{< highlight shell >}}"groups": ["dev", "ops"]{{< /highlight >}}

disabled     | 
-------------|------ 
description  | The state of the user's account.
required     | false 
type         | Boolean 
default      | false
example      | {{< highlight shell >}}"disabled": false{{< /highlight >}}

## Groups

A group is a set of users within Sensu.
Groups can be assigned one or more roles and inherit all permissions from each role assigned to them.
Users can be assigned to one or more groups.

### Default group

Sensu includes a default `cluster-admins` group that contains the [default `admin` user][20].
Additionally, Sensu includes a `system:agents` group used internally by Sensu agents.

_WARNING: Modification of the `system:agents` group can result in non-functional Sensu agents._

### Assigning a user to a group

Groups are created and managed within user definitions.
You can use [sensuctl][2] to add users to groups.

To add a user to a group:

{{< highlight shell >}}
sensuctl user add-group [USERNAME] [GROUP]
{{< /highlight >}}

To set the groups for a user:

{{< highlight shell >}}
sensuctl user set-groups USERNAME GROUP1[,GROUP2, ...[,GROUPN]]
{{< /highlight >}}

### Removing a user from a group

You can use [sensuctl][2] to remove users from groups.

To remove a user from a group:

{{< highlight shell >}}
sensuctl user remove-group [USERNAME] [GROUP]
{{< /highlight >}}

To remove a user from all groups:

{{< highlight shell >}}
sensuctl user remove-groups [USERNAME]
{{< /highlight >}}

## Roles and cluster roles

A role is a set of permissions controlling access to Sensu resources.
**Roles** specify permissions for resources within a namespace while **cluster roles**  can include permissions for [cluster-wide resources][18].
You can use [roles bindings][23] to assign roles to user and groups.
To avoid re-creating commonly used roles in each namespace, [create a cluster role][28] and use a [role binding][29] (not a cluster role binding) to restrict permissions within a specific namespace.

To create and manage roles cluster-wide, [configure sensuctl][26] as the [default `admin` user][20] or create a [cluster role][21] with `roles` permissions.
To create and manage roles within a namespace, [create a role][25] with `roles` permissions within that namespace.

### Cluster roles

Cluster roles can specify access permissions for [cluster-wide resources][18] like users and namespaces as well as [namespaced resources][17] like checks and handlers. They can also be used to grant access to namespaced resources across all namespaces (needed to run `sensuctl check list --all-namespaces`, for example) when used in conjunction with cluster role bindings.
Cluster roles use the same [specification][24] as roles and can be managed using the same sensuctl commands with `cluster-role` substituted for `role`.

To create and manage cluster roles, [configure sensuctl][26] as the [default `admin` user][20] or [create a cluster role][25] with permissions for `clusterroles`.

### Default roles

Every [Sensu backend][1] includes:

| Role name       | Type          | Description |
| --------------- | ------------- | ----------- |
| `cluster-admin` | `ClusterRole` | Full access to all [resource types][4] across namespaces, including access to [cluster-wide resource types][18].
| `admin`         | `ClusterRole` | Full access to all [resource types][4]. You can apply this cluster role within a namespace by using a role binding (not a cluster role binding).  |
| `edit`          | `ClusterRole` | Read and write access to most resources with the exception of roles and role bindings.  You can apply this cluster role within a namespace by using a role binding (not a cluster role binding).
| `view`          | `ClusterRole` | Read-only permission to most [resource types][4] with the exception of roles and role bindings.  You can apply this cluster role within a namespace by using a role binding (not a cluster role binding).  |
| `system:agent`  | `ClusterRole` | Used internally by Sensu agents. _WARNING: Modification of this cluster role can result in non-functional Sensu agents._ |

### Viewing roles

You can use [sensuctl][2] to see a list of roles within Sensu:

{{< highlight shell >}}
sensuctl role list
{{< /highlight >}}

To see the permissions and scope for a specific role:

{{< highlight shell >}}
sensuctl role info admin
{{< /highlight >}}

To view cluster roles, use the `cluster-role` command:

{{< highlight shell >}}
sensuctl cluster-role list
{{< /highlight >}}

### Creating a role

You can use [sensuctl][2] to create a role.
For example, the following command creates an admin role restricted to the production namespace.

{{< highlight shell >}}
sensuctl role create prod-admin --verb get,list,create,update,delete --resource * --namespace production
{{< /highlight >}}

### Creating a cluster-wide role

You can use [sensuctl][2] to create a cluster role.
For example, the following command creates a global event reader role that can read only events across all namespaces within Sensu.

{{< highlight shell >}}
sensuctl cluster-role create global-event-reader --verb get,list --resource events
{{< /highlight >}}

### Managing roles

You can use [sensuctl][2] to view, create, edit, and delete roles.
To use any of these commands with cluster roles, substitute the `cluster-role` command for the `role` command.

To edit a role:

{{< highlight shell >}}
sensuctl edit roles [ROLE-NAME] [flags]
{{< /highlight >}}

To delete a role:

{{< highlight shell >}}
sensuctl role delete [ROLE-NAME]
{{< /highlight >}}

To get help managing roles with sensuctl:

{{< highlight shell >}}
sensuctl role help
{{< /highlight >}}

### Role and cluster role specification

#### Role attributes

name         | 
-------------|------ 
description  | Name of the role 
required     | true 
type         | String
example      | {{< highlight shell >}}"name": "admin"{{< /highlight >}}

namespace    | 
-------------|------ 
description  | Namespace the role is restricted to. This attribute is not available for cluster roles.
required     | false
type         | String
example      | {{< highlight shell >}}"namespace": "production"{{< /highlight >}}

rules        | 
-------------|------ 
description  | The rulesets that a role applies.
required     | true 
type         | Array 
example      | {{< highlight shell >}}"rules": [
  {
    "verbs": ["get", "list"],
    "resources": ["checks"],
    "resourceNames": [""]
  }
]{{< /highlight >}}

#### Rule attributes
A rule is an explicit statement which grants a particular permission to a resource.

verbs  | 
-------------|------ 
description  | The permissions to be applied by the rule: `get`, `list`, `create`, `update`, or `delete`. 
required     | true 
type         | Array
example      | {{< highlight shell >}}"verbs": ["get", "list"]{{< /highlight >}}

resources         | 
-------------|------ 
description  | The type of resource that the rule has permission to access. Roles can only access [namespaced resource types][17] while cluster roles can access namespaced and [cluster-wide resource types][18]. See [resource types][4] for available types.
required     | true 
type         | Array
example      | {{< highlight shell >}}"resources": ["checks"]{{< /highlight >}}

resourceNames    | 
-------------|------ 
description  | Specific resource names that the rule has permission to access. Resource name permissions are only available for `get`, `delete`, and `update` verbs.
required     | false
type         | Array
example      | {{< highlight shell >}}"resourceNames": ["check-cpu"]{{< /highlight >}}

### Role examples

The following examples are in `wrapped-json` format for use with [`sensuctl create`][31].

{{< highlight json >}}
{
  "type": "Role",
  "api_version": "core/v2",
  "metadata": {
    "name": "event-reader",
    "namespace": "default"
  },
  "spec": {
    "rules": [
      {
        "resource_names": [],
        "resources": [
          "events"
        ],
        "verbs": [
          "get",
          "list"
        ]
      }
    ]
  }
}
{{< /highlight >}}

### Cluster role examples

The following examples are in `wrapped-json` format for use with [`sensuctl create`][31].

{{< highlight json >}}
{
  "type": "ClusterRole",
  "api_version": "core/v2",
  "metadata": {
    "name": "global-event-reader"
  },
  "spec": {
    "rules": [
      {
        "resource_names": [],
        "resources": [
          "events"
        ],
        "verbs": [
          "get",
          "list"
        ]
      }
    ]
  }
}
{{< /highlight >}}

## Role bindings and cluster role bindings

A **role binding** assigns a **role** or **cluster role** to a user or set of users.
A **cluster role binding** assigns a **cluster role** to a user or set of users.
Roles bindings apply roles within a namespace while cluster role bindings apply across namespaces and resource types.

To create and manage role bindings within a namespace, [create a role][25] with `rolebindings` permissions within that namespace, and log in by [configuring sensuctl][26].

### Cluster role bindings

Cluster roles bindings can assign a cluster role to users and groups.
Cluster role bindings use the same [specification][30] as role bindings and can be managed using the same sensuctl commands with `cluster-role-binding` substituted for `role-binding`.

To create and manage cluster role bindings, [configure sensuctl][26] as the [default `admin` user][20] or [create a cluster role][28] with permissions for `clusterrolebindings`.

### Viewing role bindings

You can use [sensuctl][2] to see a list of role bindings within Sensu:

{{< highlight shell >}}
sensuctl role-binding list
{{< /highlight >}}

To see the details for a specific role binding:

{{< highlight shell >}}
sensuctl role-binding info [BINDING-NAME]
{{< /highlight >}}

To see a list of cluster role bindings:

{{< highlight shell >}}
sensuctl cluster-role-binding list
{{< /highlight >}}

### Creating a role binding

You can use [sensuctl][2] to see a create a role binding that assigns a role:

{{< highlight shell >}}
sensuctl role-binding create [NAME] --role=NAME [--user=username] [--group=groupname]
{{< /highlight >}}

Or a role binding that assigns a cluster role:

{{< highlight shell >}}
sensuctl role-binding create [NAME] --cluster-role=NAME [--user=username] [--group=groupname]
{{< /highlight >}}

To create a cluster role binding:

{{< highlight shell >}}
sensuctl cluster-role-binding create [NAME] --cluster-role=NAME [--user=username] [--group=groupname]
{{< /highlight >}}

### Assigning user permissions

To assign permissions to a user:

1. [Create the user][27].
2. [Create a role][25] or (for cluster-wide access) a [cluster role][28].
3. [Create a role binding][29] (or [cluster role binding][29]) to assign the role to the user.

### Managing role bindings

You can use [sensuctl][2] to see a list, create, and delete role bindings and cluster role bindings.
To use any of these commands with cluster roles, substitute the `cluster-role-binding` command for the `role-binding` command.

To delete a role binding:

{{< highlight shell >}}
sensuctl role-binding delete [ROLE-NAME]
{{< /highlight >}}

To get help managing role bindings with sensuctl:

{{< highlight shell >}}
sensuctl role-binding help
{{< /highlight >}}

### Role binding and cluster role binding specification

roleRef      | 
-------------|------ 
description  | References a role in the current namespace or a cluster role.
required     | true 
type         | Hash 
example      | {{< highlight shell >}}"roleRef": {
  "type": "Role",
  "name": "event-reader"
}{{< /highlight >}}

subjects     | 
-------------|------ 
description  | The users or groups being assigned.
required     | true 
type         | Array 
example      | {{< highlight shell >}}"subjects": [
  {
    "type": "User",
    "name": "alice"
  }
]{{< /highlight >}}

#### `roleRef` specification

type         | 
-------------|------ 
description  | `Role` for a role binding or `ClusterRole` for a cluster role binding.
required     | true 
type         | String
example      | {{< highlight shell >}}"type": "Role"{{< /highlight >}}

name         | 
-------------|------ 
description  | The name of the role or cluster role being assigned.
required     | true 
type         | String
example      | {{< highlight shell >}}"name": "event-reader"{{< /highlight >}}

#### `subjects` specification

type         | 
-------------|------ 
description  | `User` for assigning a user or `Group` for assigning a group.
required     | true 
type         | String
example      | {{< highlight shell >}}"type": "User"{{< /highlight >}}

name         | 
-------------|------ 
description  | Username or group name.
required     | true 
type         | String
example      | {{< highlight shell >}}"name": "alice"{{< /highlight >}}

### Role binding examples

The following examples are in `wrapped-json` format for use with [`sensuctl create`][31].

{{< highlight json >}}
{
  "type": "RoleBinding",
  "api_version": "core/v2",
  "metadata": {
    "name": "event-reader-binding",
    "namespace": "default"
  },
  "spec": {
    "role_ref": {
      "name": "event-reader",
      "type": "Role"
    },
    "subjects": [
      {
        "name": "bob",
        "type": "User"
      }
    ]
  }
}
{{< /highlight >}}

### Cluster role binding examples

The following examples are in `wrapped-json` format for use with [`sensuctl create`][31].

{{< highlight json >}}
{
  "type": "ClusterRoleBinding",
  "api_version": "core/v2",
  "metadata": {
    "name": "cluster-admin"
  },
  "spec": {
    "role_ref": {
      "name": "cluster-admin",
      "type": "ClusterRole"
    },
    "subjects": [
      {
        "name": "cluster-admins",
        "type": "Group"
      }
    ]
  }
}
{{< /highlight >}}

[1]: ../backend
[2]: ../../sensuctl/reference
[3]: ../../dashboard/overview
[4]: #resources
[5]: ../assets
[6]: ../checks
[7]: ../entities
[8]: ../events
[9]: ../handlers
[10]: ../hooks
[11]: ../mutators
[12]: #namespaces
[13]: #roles-and-cluster-roles
[14]: ../silencing
[15]: #users
[16]: ../../reference
[17]: #namespaced-resource-types
[18]: #cluster-wide-resource-types
[19]: ../../api/overview
[20]: #default-user
[21]: #cluster-roles
[22]: ../filters
[23]: #role-bindings-and-cluster-role-bindings
[24]: #role-and-cluster-role-specification
[25]: #creating-a-role
[26]: ../../installation/install-sensu/#2-configure-sensuctl
[27]: #creating-a-user
[28]: #creating-a-cluster-wide-role
[29]: #creating-a-role-binding
[30]: #role-binding-and-cluster-role-binding-specification
[31]: ../../sensuctl/reference#creating-resources
