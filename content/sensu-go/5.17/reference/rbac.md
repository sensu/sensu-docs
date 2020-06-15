---
title: "Role-based access control"
linkTitle: "Role-Based Access Control"
description: "Sensu's role-based access control (RBAC) helps different teams and projects share a Sensu instance. RBAC allows you to manage user access and resources based on namespaces, groups, roles, and bindings. Read the reference doc to learn about RBAC."
weight: 140
version: "5.17"
product: "Sensu Go"
menu:
  sensu-go-5.17:
    parent: reference
---

- [Namespaces](#namespaces)
  - [Manage namespaces](#manage-namespaces) | [Namespace specification](#namespace-specification) | [Namespace example](#namespace-example)
- [Resources](#resources)
  - [Namespaced resource types](#namespaced-resource-types) | [Cluster-wide resource types](#cluster-wide-resource-types) | [Special resource types](#special-resource-types)
- [Users](#users)
  - [Manage users](#manage-users) | [User specification](#user-specification) | [User example](#user-example)
- [Groups](#groups)
  - [Manage groups](#manage-groups)
- [Roles and cluster roles](#roles-and-cluster-roles)
  - [Manage roles and cluster roles](#manage-roles-and-cluster-roles) | [Role and cluster role specification](#role-and-cluster-role-specification) | [Role and cluster role examples](#role-and-cluster-role-examples)
- [Role bindings and cluster role bindings](#role-bindings-and-cluster-role-bindings)
  - [Manage role bindings and cluster role bindings](#manage-role-bindings-and-cluster-role-bindings) | [Role binding and cluster role binding specification](#role-binding-and-cluster-role-binding-specification) | [Role binding and cluster role binding examples](#role-binding-and-cluster-role-binding-examples)
- [Example workflows](#example-workflows)
  - [Assign user permissions within a namespace](#assign-user-permissions-within-a-namespace)
  - [Assign group permissions within a namespace](#assign-group-permissions-within-a-namespace)
  - [Assign group permissions across all namespaces](#assign-group-permissions-across-all-namespaces)

Sensu role-based access control (RBAC) helps different teams and projects share a Sensu instance.
RBAC allows you to manage user access and resources based on namespaces, groups, roles, and bindings.

- **Namespaces** partition resources within Sensu. Sensu entities, checks, handlers, and other [namespaced resources][17] belong to a single namespace.
- **Roles** create sets of permissions (e.g. get and delete) tied to resource types. **Cluster roles** apply permissions across namespaces and include access to [cluster-wide resources][18] like users and namespaces. 
- **Users** represent a person or agent that interacts with Sensu. Users can belong to one or more **groups**.
- **Role bindings** assign a role to a set of users and groups within a namespace. **Cluster role bindings** assign a cluster role to a set of users and groups cluster-wide.

Sensu access controls apply to [sensuctl][2], the Sensu [API][19], and the Sensu [web UI][3].
In addition to built-in RBAC, Sensu includes [commercial][33] support for authentication using external [authentication providers][32].

## Namespaces

Namespaces help teams use different resources (like entities, checks, and handlers) within Sensu and impose their own controls on those resources.
A Sensu instance can have multiple namespaces, each with their own set of managed resources.
Resource names must be unique within a namespace but do not need to be unique across namespaces.

To create and manage namespaces, [configure sensuctl][26] as the [default `admin` user][20] or create a [cluster role][21] with `namespaces` permissions.

### Default namespaces

Every [Sensu backend][1] includes a `default` namespace.
All resources created without a specified namespace are created within the `default` namespace.

### Manage namespaces

You can use [sensuctl][2] to view, create, and delete namespaces.
To get help with managing namespaces with sensuctl:

{{< highlight shell >}}
sensuctl namespace help
{{< /highlight >}}

#### View namespaces

You can use [sensuctl][2] to view all namespaces within Sensu:

{{< highlight shell >}}
sensuctl namespace list
{{< /highlight >}}

_**NOTE**: For users on supported Sensu Go distributions,`sensuctl namespace list` lists only the namespaces that the current user has access to._

#### Create namespaces

You can use [sensuctl][2] to create a namespace.
For example, the following command creates a namespace called `production`:

{{< highlight shell >}}
sensuctl namespace create production
{{< /highlight >}}

Namespace names can contain alphanumeric characters and hyphens and must begin and end with an alphanumeric character.

#### Delete namespaces

To delete a namespace:

{{< highlight shell >}}
sensuctl namespace delete [NAMESPACE-NAME]
{{< /highlight >}}

#### Assign a resource to a namespace

You can assign a resource to a namespace in the resource definition.
Only resources that belong to a [namespaced resource type][17] (like checks, filters, and handlers) can be assigned to a namespace.

For example, to assign a check called `check-cpu` to the `production` namespace, include the `namespace` attribute in the check definition:

{{< language-toggle >}}

{{< highlight yml >}}
type: CheckConfig
api_version: core/v2
metadata:
  name: check-cpu
  namespace: production
spec:
  check_hooks: null
  command: check-cpu.sh -w 75 -c 90
  handlers:
  - slack
  interval: 30
  subscriptions:
  - system
  timeout: 0
  ttl: 0
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "check-cpu",
    "namespace": "production"
  },
  "spec": {
    "check_hooks": null,
    "command": "check-cpu.sh -w 75 -c 90",
    "handlers": ["slack"],
    "interval": 30,
    "subscriptions": ["system"],
    "timeout": 0,
    "ttl": 0
  }
}{{< /highlight >}}

{{< /language-toggle >}}

See the [reference docs][16] for the corresponding [resource type][17] to create resource definitions.

_**PRO TIP**: If you omit the `namespace` attribute from resource definitions, you can use the `senusctl create --namespace` flag to specify the namespace for a group of resources at the time of creation. This allows you to replicate resources across namespaces without manual editing. See the [sensuctl reference][36] for more information._

### Namespace specification

#### Attributes

name         | 
-------------|------ 
description  | Name of the namespace. Names can contain alphanumeric characters and hyphens and must begin and end with an alphanumeric character.
required     | true
type         | String
example      | {{< highlight shell >}}"name": "production"{{< /highlight >}}

### Namespace example

This example is in `yml` and `wrapped-json` formats for use with [`sensuctl create`][31]:

{{< language-toggle >}}

{{< highlight yml >}}
type: Namespace
api_version: core/v2
metadata: {}
spec:
  name: default
{{< /highlight >}}

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

{{< /language-toggle >}}

## Resources

Permissions within Sensu are scoped to resource types, like checks, handlers, and users.
You can use resource types to configure permissions in Sensu roles and cluster roles. 

### Namespaced resource types

Namespaced resources must belong to a single namespace.
You can access namespaced resources by [roles][13] and [cluster roles][21].

| type | description |
|---|---|
| `assets` | [Asset][5] resources within a namespace |
| `checks` | [Check][6] resources within a namespace |
| `entities` | [Entity][7] resources within a namespace |
| `events` | [Event][8] resources within a namespace |
| `extensions` | Placeholder type
| `filters` | [Filter][22] resources within a namespace |
| `handlers` | [Handler][9] resources within a namespace |
| `hooks` | [Hook][10] resources within a namespace |
| `mutators` | [Mutator][11] resources within a namespace |
| `rolebindings` | Namespace-specific role assigners |
| `roles` | Namespace-specific permission sets |
| `silenced` | [Silencing][14] resources within a namespace |

### Cluster-wide resource types

Cluster-wide resources cannot be assigned to a namespace.
You can access cluster-wide resources only by [cluster roles][21].

| type | description |
|---|---|
| `authproviders` | [Authentication provider][32] configuration (commercial feature) |
| `cluster` | Sensu clusters running multiple [Sensu backends][1] |
| `clusterrolebindings` | Cluster-wide role assigners  |
| `clusterroles` | Cluster-wide permission sets |
| `etcd-replicators` | [Mirror RBAC resource changes][40] to follower clusters |
| `license` | Sensu [commercial license][37] |
| `namespaces` | Resource partitions within a Sensu instance |
| `provider` | [PostgreSQL event store][47] provider |
| `providers` | [Secrets providers][46] |
| `secrets` |[Secrets][48] (e.g. username or password) |
| `users` | People or agents that interact with Sensu |

### Special resource types

You can access special resource types by both [roles][13] and [cluster roles][21].

| Type | Description |
|---|---|
| `*` | All resources within Sensu. **The `*` type takes precedence over other rules within the same role.** If you want to deny a certain type, you can't use the `*` type. Instead, you must explicitly allow every type required. When applied to a role, the `*` type applies only to [namespaced resource types][17]. When applied to a cluster role, the `*` type applies to both [namespaced resource types][17] and [cluster-wide resource types][18]. |

## Users

A user represents a person or an agent that interacts with Sensu.
You can assign users and groups to one or more roles.
Users and groups inherit all permissions from each role assigned to them.

Use your Sensu username and password to [configure sensuctl][26] or log in to the [web UI][3].

### Default users

During the [Sensu backend installation][42] process, you create an administrator username and password and a `default` namespace.

This is the admin user that you can use to manage all aspects of Sensu and create new users.

| attribute | value |
| --------- | ----- |
| username   | `YOUR_USERNAME`  |
| password   | `YOUR_PASSWORD`  |
| groups   | `cluster-admins`  |
| cluster role   |  `cluster-admin` |
| cluster role binding   | `cluster-admin	`  |

After you [configure sensuctl][26], you can [change the admin user's password][45] with the `change-password` command.

Sensu also includes an `agent` user, which is used internally by the Sensu agent.
You can configure `agent` user credentials with the [`user` and `password` agent configuration flags][41].

### Manage users

To test the password for a user created with Sensu's built-in [basic authentication][34]:

{{< highlight shell >}}
sensuctl user test-creds USERNAME --password 'password'
{{< /highlight >}}

An empty response indicates valid credentials.
A `request-unauthorized` response indicates invalid credentials.

_**NOTE**: The `sensuctl user test-creds` command tests passwords for users created with Sensu's built-in [basic authentication provider][34]. It does not test user credentials defined via an authentication provider like [Lightweight Directory Access Protocol (LDAP)][43] or [Active Directory (AD)][44]._

To change the password for a user:

{{< highlight shell >}}
sensuctl user change-password USERNAME --current-password CURRENT_PASSWORD --new-password NEW_PASSWORD
{{< /highlight >}}

To disable a user:

{{< highlight shell >}}
sensuctl user disable USERNAME
{{< /highlight >}}

To re-enable a disabled user:

{{< highlight shell >}}
sensuctl user reinstate USERNAME
{{< /highlight >}}

#### View users

You can use [sensuctl][2] to see a list of all users within Sensu.

To return a list of users in `yaml` format for use with `sensuctl create`:

{{< highlight shell >}}
sensuctl user list --format yaml
{{< /highlight >}}

#### Create users

You can use [sensuctl][2] to create users.
For example, the following command creates a user with the username `alice`, creates a password, and assigns the user to the `ops` and `dev` groups.

Passwords must have at least eight characters.

{{< highlight shell >}}
sensuctl user create alice --password='password' --groups=ops,dev
{{< /highlight >}}

#### Assign user permissions

To assign permissions to a user:

1. [Create the user][27].
2. [Create a role][25] (or a [cluster role][28] for cluster-wide access).
3. [Create a role binding][29] (or [cluster role binding][29]) to assign the role to the user.

### User specification

#### Attributes

username     | 
-------------|------ 
description  | Name of the user. Cannot contain special characters.
required     | true
type         | String
example      | {{< highlight shell >}}"username": "alice"{{< /highlight >}}

password     | 
-------------|------ 
description  | User's password. Passwords must have at least eight characters.
required     | true
type         | String
example      | {{< highlight shell >}}"password": "USER_PASSWORD"{{< /highlight >}}

groups       | 
-------------|------ 
description  | Groups to which the user belongs.
required     | false
type         | Array
example      | {{< highlight shell >}}"groups": ["dev", "ops"]{{< /highlight >}}

disabled     | 
-------------|------ 
description  | If `true`, the user's account is disabled. Otherwise, `false`.
required     | false
type         | Boolean
default      | `false`
example      | {{< highlight shell >}}"disabled": false{{< /highlight >}}

### User example

The following example is in `yml` and `wrapped-json` formats for use with [`sensuctl create`][31].

{{< language-toggle >}}

{{< highlight yml >}}
type: User
api_version: core/v2
metadata: {}
spec:
  disabled: false
  groups:
  - ops
  - dev
  password: USER_PASSWORD
  username: alice
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "User",
  "api_version": "core/v2",
  "metadata": {},
  "spec": {
    "username": "alice",
    "password": "USER_PASSWORD",
    "disabled": false,
    "groups": ["ops", "dev"]
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

## Groups

A group is a set of users within Sensu.
You can assign groups to one or more roles, and you can assign users to one or more groups.
Groups inherit all permissions from each role assigned to them.

Groups are not a resource type within Sensu.
You can create and manage groups only within user definitions.

### Default groups

Sensu includes a default `cluster-admins` group that contains the [default `admin` user][20] and a `system:agents` group used internally by Sensu agents.

### Manage groups

#### Assign a user to a group

Groups are created and managed within user definitions.
You can use [sensuctl][2] to add users to groups.

To add a user to a group:

{{< highlight shell >}}
sensuctl user add-group USERNAME GROUP
{{< /highlight >}}

To set the groups for a user:

{{< highlight shell >}}
sensuctl user set-groups USERNAME GROUP1[,GROUP2, ...[,GROUPN]]
{{< /highlight >}}

#### Remove a user from a group

You can use [sensuctl][2] to remove users from groups.

To remove a user from a group:

{{< highlight shell >}}
sensuctl user remove-group USERNAME GROUP
{{< /highlight >}}

To remove a user from all groups:

{{< highlight shell >}}
sensuctl user remove-groups USERNAME
{{< /highlight >}}

## Roles and cluster roles

A role is a set of permissions that control access to Sensu resources.
Roles specify permissions for resources within a namespace.
Cluster role can include permissions for [cluster-wide resources][18].

You can use [role bindings][23] to assign roles to user and groups.
To avoid recreating commonly used roles in each namespace, [create a cluster role][28] and use a [role binding][29] (not a cluster role binding) to restrict permissions within a specific namespace.

To create and manage roles cluster-wide, [configure sensuctl][26] as the [default `admin` user][20] or create a [cluster role][21] with `roles` permissions.
To create and manage roles within a namespace, [create a role][25] with `roles` permissions within that namespace.

### Cluster roles

Cluster roles can specify access permissions for [cluster-wide resources][18] like users and namespaces as well as [namespaced resources][17] like checks and handlers.
They can also be used to grant access to namespaced resources across all namespaces (for example, to run `sensuctl check list --all-namespaces`) when used in conjunction with cluster role bindings.

Cluster roles use the same [specification][24] as roles and can be managed using the same sensuctl commands with `cluster-role` substituted for `role`.

To create and manage cluster roles, [configure sensuctl][26] as the [default `admin` user][20] or [create a cluster role][25] with permissions for `clusterroles`.

### Default roles

Every [Sensu backend][1] includes:

| role name       | type          | description |
| --------------- | ------------- | ----------- |
| `cluster-admin` | `ClusterRole` | Full access to all [resource types][4] across namespaces, including access to [cluster-wide resource types][18]. |
| `admin`         | `ClusterRole` | Full access to all [resource types][4]. You can apply this cluster role within a namespace by using a role binding (not a cluster role binding). |
| `edit`          | `ClusterRole` | Read and write access to most resources except roles and role bindings. You can apply this cluster role within a namespace by using a role binding (not a cluster role binding). |
| `view`          | `ClusterRole` | Read-only permission to most [resource types][4] with the exception of roles and role bindings. You can apply this cluster role within a namespace by using a role binding (not a cluster role binding). |
| `system:agent`  | `ClusterRole` | Used internally by Sensu agents. You can configure an agent's user credentials using the [`user` and `password` agent configuration flags][41]. |

### Manage roles and cluster roles

You can use [sensuctl][2] to view, create, edit, and delete roles and cluster roles.

_**NOTE**: To use any of these example commands with cluster roles, substitute the `cluster-role` command for the `role` command._

To get help managing roles with sensuctl:

{{< highlight shell >}}
sensuctl role help
{{< /highlight >}}

To edit a role:

{{< highlight shell >}}
sensuctl edit role [ROLE-NAME] [flags]
{{< /highlight >}}

### View roles and cluster roles

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

#### Create roles

You can use [sensuctl][2] to create a role.
For example, the following command creates an admin role restricted to the production namespace.

{{< highlight shell >}}
sensuctl role create prod-admin --verb='get,list,create,update,delete' --resource='*' --namespace production
{{< /highlight >}}

After you create a role, [create a role binding][23] (or [cluster role binding][23]) to assign the role to users and groups.
For example, to assign the `prod-admin` role created above to the `oncall` group, create this role binding:

{{< highlight shell >}}
sensuctl role-binding create prod-admin-oncall --role=prod-admin --group=oncall
{{< /highlight >}}

#### Create cluster-wide roles

You can use [sensuctl][2] to create a cluster role.
For example, the following command creates a global event reader role that can read only events across all namespaces within Sensu.

{{< highlight shell >}}
sensuctl cluster-role create global-event-reader --verb='get,list' --resource='events'
{{< /highlight >}}

#### Delete roles and cluster roles

To delete a role:

{{< highlight shell >}}
sensuctl role delete [ROLE-NAME]
{{< /highlight >}}

### Role and cluster role specification

#### Role and cluster role attributes

name         | 
-------------|------ 
description  | Name of the role.
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
description  | Rulesets that the role applies.
required     | true
type         | Array
example      | {{< highlight shell >}}"rules": [
  {
    "verbs": ["get", "list"],
    "resources": ["checks"],
    "resource_names": [""]
  }
]{{< /highlight >}}

#### Rule attributes

A rule is an explicit statement that grants a particular permission to a resource.

verbs  | 
-------------|------ 
description  | Permissions to be applied by the rule: `get`, `list`, `create`, `update`, or `delete`. 
required     | true
type         | Array
example      | {{< highlight shell >}}"verbs": ["get", "list"]{{< /highlight >}}

resources         | 
-------------|------ 
description  | Type of resource that the rule has permission to access. Roles can only access [namespaced resource types][17]. Cluster roles can access namespaced and [cluster-wide resource types][18]. See [resource types][4] for available types.
required     | true
type         | Array
example      | {{< highlight shell >}}"resources": ["checks"]{{< /highlight >}}

resource_names    | 
-------------|------ 
description  | Specific resource names that the rule has permission to access. Resource name permissions are only taken into account for requests using `get`, `update`, and `delete` verbs.
required     | false
type         | Array
example      | {{< highlight shell >}}"resource_names": ["check-cpu"]{{< /highlight >}}

### Role and cluster role examples

These examples are in `yml` and `wrapped-json` formats for use with [`sensuctl create`][31].

### Role example

{{< language-toggle >}}

{{< highlight yml >}}
type: Role
api_version: core/v2
metadata:
  name: namespaced-resources-all-verbs
  namespace: default
spec:
  rules:
  - resource_names: []
    resources:
    - assets
    - checks
    - entities
    - events
    - filters
    - handlers
    - hooks
    - mutators
    - rolebindings
    - roles
    - silenced
    verbs:
    - get
    - list
    - create
    - update
    - delete
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Role",
  "api_version": "core/v2",
  "metadata": {
    "name": "namespaced-resources-all-verbs",
    "namespace": "default"
  },
  "spec": {
    "rules": [
      {
        "resource_names": [],
        "resources": [
          "assets", "checks", "entities", "events", "filters", "handlers",
          "hooks", "mutators", "rolebindings", "roles", "silenced"
        ],
        "verbs": ["get", "list", "create", "update", "delete"]
      }
    ]
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

#### Cluster role example

{{< language-toggle >}}

{{< highlight yml >}}
type: ClusterRole
api_version: core/v2
metadata:
  name: all-resources-all-verbs
spec:
  rules:
  - resource_names: []
    resources:
    - assets
    - checks
    - entities
    - events
    - filters
    - handlers
    - hooks
    - mutators
    - rolebindings
    - roles
    - silenced
    - cluster
    - clusterrolebindings
    - clusterroles
    - namespaces
    - users
    - authproviders
    - license
    verbs:
    - get
    - list
    - create
    - update
    - delete
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "ClusterRole",
  "api_version": "core/v2",
  "metadata": {
    "name": "all-resources-all-verbs"
  },
  "spec": {
    "rules": [
      {
        "resource_names": [],
        "resources": [
          "assets", "checks", "entities", "events", "filters", "handlers",
          "hooks", "mutators", "rolebindings", "roles", "silenced",
          "cluster", "clusterrolebindings", "clusterroles",
          "namespaces", "users", "authproviders", "license"
        ],
        "verbs": ["get", "list", "create", "update", "delete"]
      }
    ]
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

## Role bindings and cluster role bindings

A role binding assigns a _role_ or _cluster role_ to users and groups within a namespace.
A cluster role binding assigns a _cluster role_ to users and groups across namespaces and resource types.

Cluster role bindings use the same [specification][30] as role bindings and can be managed using the same sensuctl commands with `cluster-role-binding` substituted for `role-binding`.

To create and manage role bindings within a namespace, [create a role][25] with `rolebindings` permissions within that namespace, and log in by [configuring sensuctl][26].

To create and manage cluster role bindings, [configure sensuctl][26] as the [default `admin` user][20] or [create a cluster role][28] with permissions for `clusterrolebindings`.

### Manage role bindings and cluster role bindings

You can use [sensuctl][2] to view, create, and delete role bindings and cluster role bindings.

_**NOTE**: To use any of these commands with cluster roles, substitute the `cluster-role-binding` command for the `role-binding` command._

To get help managing role bindings with sensuctl:

{{< highlight shell >}}
sensuctl role-binding help
{{< /highlight >}}

#### View role bindings and cluster role bindings

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

#### Create role bindings and cluster role bindings

You can use [sensuctl][2] to see a create a role binding that assigns a role:

{{< highlight shell >}}
sensuctl role-binding create [NAME] --role=NAME [--user=username] [--group=groupname]
{{< /highlight >}}

To create a role binding that assigns a cluster role:

{{< highlight shell >}}
sensuctl role-binding create [NAME] --cluster-role=NAME [--user=username] [--group=groupname]
{{< /highlight >}}

To create a cluster role binding:

{{< highlight shell >}}
sensuctl cluster-role-binding create [NAME] --cluster-role=NAME [--user=username] [--group=groupname]
{{< /highlight >}}

#### Delete role bindings and cluster role bindings

To delete a role binding:

{{< highlight shell >}}
sensuctl role-binding delete [ROLE-NAME]
{{< /highlight >}}

### Role binding and cluster role binding specification

roleRef      | 
-------------|------ 
description  | Reference a role in the current namespace or a cluster role.
required     | true
type         | Hash
example      | {{< highlight shell >}}"roleRef": {
  "type": "Role",
  "name": "event-reader"
}{{< /highlight >}}

subjects     | 
-------------|------ 
description  | Users or groups being assigned.
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
description  | Name of the role or cluster role being assigned.
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
 example with prefix | {{< highlight shell >}}"name": "ad:alice"{{< /highlight >}}

### Role binding and cluster role binding examples

These examples are in `yml` and `wrapped-json` formats for use with [`sensuctl create`][31].

#### Role binding example

{{< language-toggle >}}

{{< highlight yml >}}
type: RoleBinding
api_version: core/v2
metadata:
  name: event-reader-binding
  namespace: default
spec:
  role_ref:
    name: event-reader
    type: Role
  subjects:
  - name: bob
    type: User
{{< /highlight >}}

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

{{< /language-toggle >}}

#### Cluster role binding example

{{< language-toggle >}}

{{< highlight yml >}}
type: ClusterRoleBinding
api_version: core/v2
metadata:
  name: cluster-admin
spec:
  role_ref:
    name: cluster-admin
    type: ClusterRole
  subjects:
  - name: cluster-admins
    type: Group
{{< /highlight >}}

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

{{< /language-toggle >}}

#### Role and role binding example

The following role and role binding give a `dev` group access to create and manage Sensu workflows within the `default` namespace.

{{< highlight text >}}
{
  "type": "Role",
  "api_version": "core/v2",
  "metadata": {
    "name": "workflow-creator",
    "namespace": "default"
  },
  "spec": {
    "rules": [
      {
        "resource_names": [],
        "resources": ["checks", "hooks", "filters", "events", "filters", "mutators", "handlers"],
        "verbs": ["get", "list", "create", "update", "delete"]
      }
    ]
  }
}
{
  "type": "RoleBinding",
  "api_version": "core/v2",
  "metadata": {
    "name": "dev-binding",
    "namespace": "default"
  },
  "spec": {
    "role_ref": {
      "name": "workflow-creator",
      "type": "Role"
    },
    "subjects": [
      {
        "name": "dev",
        "type": "Group"
      }
    ]
  }
}
{{< /highlight >}}

#### Role and role binding example with a group prefix

In this example, if a [groups prefix][38] of `ad` is configured for [Active Directory authentication][39], the role and role binding will give a `dev` group access to create and manage Sensu workflows within the `default` namespace.

{{< highlight text >}}
{
  "type": "Role",
  "api_version": "core/v2",
  "metadata": {
    "name": "workflow-creator",
    "namespace": "default"
  },
  "spec": {
    "rules": [
      {
        "resource_names": [],
        "resources": ["checks", "hooks", "filters", "events", "filters", "mutators", "handlers"],
        "verbs": ["get", "list", "create", "update", "delete"]
      }
    ]
  }
}
{
  "type": "RoleBinding",
  "api_version": "core/v2",
  "metadata": {
    "name": "dev-binding-with-groups-prefix",
    "namespace": "default"
  },
  "spec": {
    "role_ref": {
      "name": "workflow-creator",
      "type": "Role"
    },
    "subjects": [
      {
        "name": "ad:dev",
        "type": "Group"
      }
    ]
  }
}
{{< /highlight >}}

## Example workflows

### Assign user permissions within a namespace

To assign permissions to a user:

1. [Create the user][27].
2. [Create a role][25].
3. [Create a role binding][29] to assign the role to the user.

For example, the following configuration creates a user `alice`, a role `default-admin`, and a role binding `alice-default-admin`, giving `alice` full permissions for [namespaced resource types][17] within the `default` namespace.
You can add these resources to Sensu using [`sensuctl create`][31].

{{< highlight text >}}
{
  "type": "User",
  "api_version": "core/v2",
  "metadata": {},
  "spec": {
    "disabled": false,
    "username": "alice"
  }
}
{
  "type": "Role",
  "api_version": "core/v2",
  "metadata": {
    "name": "default-admin",
    "namespace": "default"
  },
  "spec": {
    "rules": [
      {
        "resource_names": [],
        "resources": [
          "assets", "checks", "entities", "events", "filters", "handlers",
          "hooks", "mutators", "rolebindings", "roles", "silenced"
        ],
        "verbs": ["get", "list", "create", "update", "delete"]
      }
    ]
  }
}
{
  "type": "RoleBinding",
  "api_version": "core/v2",
  "metadata": {
    "name": "alice-default-admin",
    "namespace": "default"
  },
  "spec": {
    "role_ref": {
      "name": "default-admin",
      "type": "Role"
    },
    "subjects": [
      {
        "name": "alice",
        "type": "User"
      }
    ]
  }
}
{{< /highlight >}}

### Assign group permissions within a namespace

To assign permissions to group of users:

1. [Create at least one user assigned to a group][27].
2. [Create a role][25].
3. [Create a role binding][29] to assign the role to the group.

For example, the following configuration creates a user `alice` assigned to the group `ops`, a role `default-admin`, and a role binding `ops-default-admin`, giving the `ops` group full permissions for [namespaced resource types][17] within the `default` namespace.
You can add these resources to Sensu using [`sensuctl create`][31].

{{< highlight text >}}
{
  "type": "User",
  "api_version": "core/v2",
  "metadata": {},
  "spec": {
    "disabled": false,
    "username": "alice"
  }
}
{
  "type": "Role",
  "api_version": "core/v2",
  "metadata": {
    "name": "default-admin",
    "namespace": "default"
  },
  "spec": {
    "rules": [
      {
        "resource_names": [],
        "resources": [
          "assets", "checks", "entities", "events", "filters", "handlers",
          "hooks", "mutators", "rolebindings", "roles", "silenced"
        ],
        "verbs": ["get", "list", "create", "update", "delete"]
      }
    ]
  }
}
{
  "type": "RoleBinding",
  "api_version": "core/v2",
  "metadata": {
    "name": "ops-default-admin",
    "namespace": "default"
  },
  "spec": {
    "role_ref": {
      "name": "default-admin",
      "type": "Role"
    },
    "subjects": [
      {
        "name": "ops",
        "type": "Group"
      }
    ]
  }
}
{{< /highlight >}}

_**PRO TIP**: To avoid recreating commonly used roles in each namespace, [create a cluster role][28] and use a [role binding][29] to restrict permissions within a specific namespace._

### Assign group permissions across all namespaces

To assign cluster-wide permissions to group of users:

1. [Create at least one user assigned to a group][27].
2. [Create a cluster role][28].
3. [Create a cluster role binding][29]) to assign the role to the group.

For example, the following configuration creates a user `alice` assigned to the group `ops`, a cluster role `default-admin`, and a cluster role binding `ops-default-admin`, giving the `ops` group full permissions for [namespaced resource types][17] and [cluster-wide resource types][18] across all namespaces.
You can add these resources to Sensu using [`sensuctl create`][31].

{{< highlight text >}}
{
  "type": "User",
  "api_version": "core/v2",
  "metadata": {},
  "spec": {
    "disabled": false,
    "username": "alice",
    "groups": ["ops"]
  }
}
{
  "type": "ClusterRole",
  "api_version": "core/v2",
  "metadata": {
    "name": "default-admin"
  },
  "spec": {
    "rules": [
      {
        "resource_names": [],
        "resources": [
          "assets", "checks", "entities", "events", "filters", "handlers",
          "hooks", "mutators", "rolebindings", "roles", "silenced",
          "cluster", "clusterrolebindings", "clusterroles",
          "namespaces", "users", "authproviders", "license"
        ],
        "verbs": ["get", "list", "create", "update", "delete"]

      }
    ]
  }
}
{
  "type": "ClusterRoleBinding",
  "api_version": "core/v2",
  "metadata": {
    "name": "ops-default-admin"
  },
  "spec": {
    "role_ref": {
      "name": "default-admin",
      "type": "ClusterRole"
    },
    "subjects": [
      {
        "name": "ops",
        "type": "Group"
      }
    ]
  }
}
{{< /highlight >}}

[1]: ../backend/
[2]: ../../sensuctl/reference/
[3]: ../../web-ui/sign-in/
[4]: #resources
[5]: ../assets/
[6]: ../checks/
[7]: ../entities/
[8]: ../events/
[9]: ../handlers/
[10]: ../hooks/
[11]: ../mutators/
[13]: #roles-and-cluster-roles
[14]: ../silencing/
[16]: ../../reference/
[17]: #namespaced-resource-types
[18]: #cluster-wide-resource-types
[19]: ../../api/overview/
[20]: #default-users
[21]: #roles-and-cluster-roles
[22]: ../filters/
[23]: #role-bindings-and-cluster-role-bindings
[24]: #role-and-cluster-role-specification
[25]: #create-roles
[26]: ../../installation/install-sensu/#install-sensuctl
[27]: #create-users
[28]: #create-cluster-wide-roles
[29]: #create-role-bindings-and-cluster-role-bindings
[30]: #role-binding-and-cluster-role-binding-specification
[31]: ../../sensuctl/reference#create-resources
[32]: ../../installation/auth#use-an-authentication-provider
[33]: ../../commercial/
[34]: ../../installation/auth#use-built-in-basic-authentication
[36]: ../../sensuctl/reference#create-resources-across-namespaces
[37]: ../license/
[38]: ../../installation/auth/#groups-prefix
[39]: ../../installation/auth/#ad-groups-prefix
[40]: ../../reference/etcdreplicators/
[41]: ../agent/#security-configuration-flags
[42]: ../../installation/install-sensu/#install-the-sensu-backend
[43]: ../../installation/auth#ldap-authentication
[44]: ../../installation/auth/#ad-authentication
[45]: ../../sensuctl/reference/#change-admin-user-s-password
[46]: ../secrets-providers/
[47]: ../datastore/
[48]: ../secrets/
