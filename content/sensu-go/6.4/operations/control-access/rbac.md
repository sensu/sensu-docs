---
title: "Role-based access control (RBAC) reference"
linkTitle: "RBAC Reference"
reference_title: "Role-based access control (RBAC)"
type: "reference"
description: "Sensu's role-based access control (RBAC) helps different teams and projects share a Sensu instance. RBAC allows you to authorize user access and specify the actions users are allowed to take against resources based on roles bound to users or groups. Read the reference doc to learn about RBAC."
weight: 80
version: "6.4"
product: "Sensu Go"
menu:
  sensu-go-6.4:
    parent: control-access
---

Sensu's role-based access control (RBAC) helps different teams and projects share a Sensu instance.
RBAC allows you to specify actions users are allowed to take against resources, within [namespaces][12] or across all namespaces, based on roles bound to the user or to one or more groups the user is a member of.

- **Roles** create sets of permissions (for example, get and delete) tied to resource types.
**Cluster roles** apply permissions across namespaces and include access to [cluster-wide resources][18] like users and namespaces. 
- **Users** represent a person or agent that interacts with Sensu.
Users can belong to one or more **groups**.
- **Role bindings** assign a role to a set of users and groups within a namespace.
**Cluster role bindings** assign a cluster role to a set of users and groups cluster-wide.

RBAC configuration applies to [sensuctl][2], the [API][19], and the [web UI][3].

## Resources

Permissions within Sensu are scoped to resource types, like checks, handlers, and users.
You can use resource types to configure permissions in Sensu roles and cluster roles. 

### Namespaced resource types

Namespaced resources must belong to a single [namespace][12].
You can access namespaced resources by [roles and cluster roles][13].

| type | description |
|---|---|
| `assets` | [Dynamic runtime asset][5] resources within a namespace |
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
| `searches` | Saved [web UI][49] search queries |
| `silenced` | [Silencing][14] resources within a namespace |

### Cluster-wide resource types

Cluster-wide resources cannot be assigned to a namespace.
You can access cluster-wide resources only by cluster roles.

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
| `secrets` |[Secrets][48] (for example, username or password) |
| `users` | People or agents that interact with Sensu |

### Special resource types

You can access special resource types by both [roles and cluster roles][13].

| Type | Description |
|---|---|
| `*` | All resources within Sensu. **The `*` type takes precedence over other rules within the same role.** If you want to deny a certain type, you can't use the `*` type. Instead, you must explicitly allow every type required. When applied to a role, the `*` type applies only to [namespaced resource types][17]. When applied to a cluster role, the `*` type applies to both [namespaced resource types][17] and [cluster-wide resource types][18]. |

## Users

A user represents a person or an agent that interacts with Sensu.
You can assign users and groups to one or more roles.
Users and groups inherit all permissions from each role assigned to them.

Use your Sensu username and password to [configure sensuctl][26] or log in to the [web UI][3].

### User example

The following example shows a user resource definition:

{{< language-toggle >}}

{{< code yml >}}
---
type: User
api_version: core/v2
metadata: {}
spec:
  disabled: false
  groups:
  - ops
  - dev
  password: USER_PASSWORD
  password_hash: $5f$14$.brXRviMZpbaleSq9kjoUuwm67V/s4IziOLGHjEqxJbzPsreQAyNm
  username: alice
{{< /code >}}

{{< code json >}}
{
  "type": "User",
  "api_version": "core/v2",
  "metadata": {},
  "spec": {
    "username": "alice",
    "password": "USER_PASSWORD",
    "password_hash": "$5f$14$.brXRviMZpbaleSq9kjoUuwm67V/s4IziOLGHjEqxJbzPsreQAyNm",
    "disabled": false,
    "groups": ["ops", "dev"]
  }
}
{{< /code >}}

{{< /language-toggle >}}

To create this user with [`sensuctl create`][31], first save the definition to a file like `users.yml` or `users.json`.

Then, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl create --file users.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl create --file users.json
{{< /code >}}

{{< /language-toggle >}}

### Default users

During the [Sensu backend installation][42] process, you create an administrator username and password and a `default` namespace.

This is the admin user that you can use to manage all aspects of Sensu and create new users.

| attribute | value |
| --------- | ----- |
| username   | `YOUR_USERNAME`  |
| password   | `YOUR_PASSWORD`  |
| groups   | `cluster-admins`  |
| cluster role   |  `cluster-admin` |
| cluster role binding   | `cluster-admin `  |

After you [configure sensuctl][26], you can [change the admin user's password][45] with the `change-password` command.

Sensu also creates a default `agent` user with the password `P@ssw0rd!`.
This user/password combination corresponds to the defaults the Sensu agent uses.
You can configure the Sensu agent's user credentials with the [`user` and `password` agent configuration flags][41].

### Manage users

To test the password for a user created with Sensu's [built-in basic authentication][34]:

{{< code shell >}}
sensuctl user test-creds USERNAME --password 'password'
{{< /code >}}

An empty response indicates valid credentials.
A `request-unauthorized` response indicates invalid credentials.

{{% notice note %}}
**NOTE**: The `sensuctl user test-creds` command tests passwords for users created with Sensu's built-in [basic authentication provider](../#use-built-in-basic-authentication).
It does not test user credentials defined via an authentication provider like [Lightweight Directory Access Protocol (LDAP)](../ldap-auth/), [Active Directory (AD)](../ad-auth/), or [OpenID Connect 1.0 protocol (OIDC)](../oidc-auth/). 
{{% /notice %}}

To change the password for a user:

{{< code shell >}}
sensuctl user change-password USERNAME --current-password CURRENT_PASSWORD --new-password NEW_PASSWORD
{{< /code >}}

You can also use sensuctl to [reset a user's password][50] or [generate a password hash][51].

To disable a user:

{{< code shell >}}
sensuctl user disable USERNAME
{{< /code >}}

To re-enable a disabled user:

{{< code shell >}}
sensuctl user reinstate USERNAME
{{< /code >}}

#### View users

You can use [sensuctl][2] to see a list of all users within Sensu.

To return a list of users in `yaml` or `wrapped-json` format for use with `sensuctl create`:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl user list --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl user list --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

#### Create users

You can use [sensuctl][2] to create users.
For example, the following command creates a user with the username `alice`, creates a password, and assigns the user to the `ops` and `dev` groups.

Passwords must have at least eight characters.

{{< code shell >}}
sensuctl user create alice --password='password' --groups=ops,dev
{{< /code >}}

You can create any number of users, each with their own passwords.
Users are granted permissions by role bindings or cluster role bindings, but as a general rule, users have no permissions by default.

By default, the agent user belongs to the `system:agent` group.
The `system:agent` cluster role binding grants the `system:agent` cluster role to the members of this group.
To grant agent users the permissions they need to report events into any namespace, add agent users to the `system:agent` group.

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
example      | {{< language-toggle >}}
{{< code yml >}}
username: alice
{{< /code >}}
{{< code json >}}
{
  "username": "alice"
}
{{< /code >}}
{{< /language-toggle >}}

<a id="password-attribute"></a>

password     | 
-------------|------ 
description  | User's password. Passwords must have at least eight characters.{{% notice note %}}
**NOTE**: You only need to set either the `password` or the [`password_hash`](#password-hash-attribute) (not both). We recommend using the `password_hash` because it eliminates the need to store cleartext passwords.
{{% /notice %}}
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
password: USER_PASSWORD
{{< /code >}}
{{< code json >}}
{
  "password": "USER_PASSWORD"
}
{{< /code >}}
{{< /language-toggle >}}

groups       | 
-------------|------ 
description  | Groups to which the user belongs.
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
groups:
- dev
- ops
{{< /code >}}
{{< code json >}}
{
  "groups": [
    "dev",
    "ops"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

disabled     | 
-------------|------ 
description  | If `true`, the user's account is disabled. Otherwise, `false`.
required     | false
type         | Boolean
default      | `false`
example      | {{< language-toggle >}}
{{< code yml >}}
disabled: false
{{< /code >}}
{{< code json >}}
{
  "disabled": false
}
{{< /code >}}
{{< /language-toggle >}}

<a id="password-hash-attribute"></a>

password_hash | 
--------------|------ 
description   | [Bcrypt][35] password hash. You can use the `password_hash` in your user definitions instead of storing cleartext passwords. {{% notice note %}}
**NOTE**: You only need to set either the [`password`](#password-attribute) or the `password_hash` (not both). We recommend using the `password_hash` because it eliminates the need to store cleartext passwords.
{{% /notice %}}
required      | false
type          | String
example       | {{< language-toggle >}}
{{< code yml >}}
password_hash: $5f$14$.brXRviMZpbaleSq9kjoUuwm67V/s4IziOLGHjEqxJbzPsreQAyNm
{{< /code >}}
{{< code json >}}
{
  "password_hash": "$5f$14$.brXRviMZpbaleSq9kjoUuwm67V/s4IziOLGHjEqxJbzPsreQAyNm"
}
{{< /code >}}
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

{{< code shell >}}
sensuctl user add-group USERNAME GROUP
{{< /code >}}

To set the groups for a user:

{{< code shell >}}
sensuctl user set-groups USERNAME GROUP1[,GROUP2, ...[,GROUPN]]
{{< /code >}}

#### Remove a user from a group

You can use [sensuctl][2] to remove users from groups.

To remove a user from a group:

{{< code shell >}}
sensuctl user remove-group USERNAME GROUP
{{< /code >}}

To remove a user from all groups:

{{< code shell >}}
sensuctl user remove-groups USERNAME
{{< /code >}}

## Roles and cluster roles

A role is a set of permissions that control access to Sensu resources.
Roles specify permissions for resources within a namespace.
Cluster roles can include permissions for [cluster-wide resources][18].

You can use [role bindings][23] to assign roles to user and groups.
To avoid recreating commonly used roles in each namespace, [create a cluster role][28] and use a [role binding][29] (not a cluster role binding) to restrict permissions within a specific namespace.

To create and manage roles cluster-wide, [configure sensuctl][26] as the [default `admin` user][20] or create a cluster role with `roles` permissions.
To create and manage roles within a namespace, [create a role][25] with `roles` permissions within that namespace.

Cluster roles can specify access permissions for [cluster-wide resources][18] like users and namespaces as well as [namespaced resources][17] like checks and handlers.
They can also be used to grant access to namespaced resources across all namespaces (for example, to run `sensuctl check list --all-namespaces`) when used in conjunction with cluster role bindings.

Cluster roles use the same [specification][24] as roles and can be managed using the same sensuctl commands with `cluster-role` substituted for `role`.

To create and manage cluster roles, [configure sensuctl][26] as the [default `admin` user][20] or [create a cluster role][25] with permissions for `clusterroles`.

### Role example

The following example shows a role resource definition:

{{< language-toggle >}}

{{< code yml >}}
---
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
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

To create this role with [`sensuctl create`][31], first save the definition to a file like `roles.yml` or `roles.json`.

Then, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl create --file roles.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl create --file roles.json
{{< /code >}}

{{< /language-toggle >}}

### Cluster role example

The following example shows a cluster role resource definition:

{{< language-toggle >}}

{{< code yml >}}
---
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
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

To create this cluster role with [`sensuctl create`][31], first save the definition to a file like `cluster_roles.yml` or `cluster_roles.json`.

Then, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl create --file cluster_roles.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl create --file cluster_roles.json
{{< /code >}}

{{< /language-toggle >}}

### Default roles and cluster roles

Every [Sensu backend][1] includes:

| role name       | type          | description |
| --------------- | ------------- | ----------- |
| `system:pipeline`  | `Role` | Facility that allows the EventFilter engine to load events from Sensu's event store. `system:pipeline` is an implementation detail and should not be assigned to Sensu users. |
| `cluster-admin` | `ClusterRole` | Full access to all [resource types][4] across namespaces, including access to [cluster-wide resource types][18]. |
| `admin`         | `ClusterRole` | Full access to all [resource types][4]. You can apply this cluster role within a namespace by using a role binding (not a cluster role binding). |
| `edit`          | `ClusterRole` | Read and write access to most resources except roles and role bindings. You can apply this cluster role within a namespace by using a role binding (not a cluster role binding). |
| `view`          | `ClusterRole` | Read-only permission to most [resource types][4] with the exception of roles and role bindings. You can apply this cluster role within a namespace by using a role binding (not a cluster role binding). |
| `system:agent`  | `ClusterRole` | Used internally by Sensu agents. You can configure an agent's user credentials using the [`user` and `password` agent configuration flags][41]. |
| `system:user`  | `ClusterRole` | Get and update permissions for local resources for the current user. |

### Manage roles and cluster roles

You can use [sensuctl][2] to view, create, edit, and delete roles and cluster roles.

{{% notice note %}}
**NOTE**: To use any of these example commands with cluster roles, substitute the `cluster-role` command for the `role` command.
{{% /notice %}}

To get help managing roles with sensuctl:

{{< code shell >}}
sensuctl role help
{{< /code >}}

To edit a role:

{{< code shell >}}
sensuctl edit role [ROLE-NAME] <flags>
{{< /code >}}

### View roles and cluster roles

You can use [sensuctl][2] to see a list of roles within Sensu:

{{< code shell >}}
sensuctl role list
{{< /code >}}

To see the permissions and scope for a specific role:

{{< code shell >}}
sensuctl role info admin
{{< /code >}}

To view cluster roles, use the `cluster-role` command:

{{< code shell >}}
sensuctl cluster-role list
{{< /code >}}

#### Create roles

You can use [sensuctl][2] to create a role.
For example, the following command creates an admin role restricted to the production namespace.

{{< code shell >}}
sensuctl role create prod-admin --verb='get,list,create,update,delete' --resource='*' --namespace production
{{< /code >}}

This command creates the following role resource definition:

{{< language-toggle >}}

{{< code yml >}}
---
type: Role
api_version: core/v2
metadata:
  created_by: admin
  name: prod-admin
  namespace: production
spec:
  rules:
  - resource_names: null
    resources:
    - '*'
    verbs:
    - get
    - list
    - create
    - update
    - delete
{{< /code >}}

{{< code json >}}
{
  "type": "Role",
  "api_version": "core/v2",
  "metadata": {
    "created_by": "admin",
    "name": "prod-admin",
    "namespace": "production"
  },
  "spec": {
    "rules": [
      {
        "resource_names": null,
        "resources": [
          "*"
        ],
        "verbs": [
          "get",
          "list",
          "create",
          "update",
          "delete"
        ]
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

After you create a role, [create a role binding][23] (or [cluster role binding][23]) to assign the role to users and groups.
For example, to assign the `prod-admin` role created above to the `oncall` group, create this role binding:

{{< code shell >}}
sensuctl role-binding create prod-admin-oncall --role=prod-admin --group=oncall
{{< /code >}}

This command creates the following role binding resource definition:

{{< language-toggle >}}

{{< code yml >}}
---
type: RoleBinding
api_version: core/v2
metadata:
  created_by: admin
  name: prod-admin-oncall
  namespace: production
spec:
  role_ref:
    name: prod-admin
    type: Role
  subjects:
  - name: oncall
    type: Group
{{< /code >}}

{{< code json >}}
{
  "type": "RoleBinding",
  "api_version": "core/v2",
  "metadata": {
    "created_by": "admin",
    "name": "prod-admin-oncall",
    "namespace": "production"
  },
  "spec": {
    "role_ref": {
      "name": "prod-admin",
      "type": "Role"
    },
    "subjects": [
      {
        "name": "oncall",
        "type": "Group"
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

#### Create cluster-wide roles

You can use [sensuctl][2] to create a cluster role.
For example, the following command creates a global event reader role that can read only events across all namespaces within Sensu.

{{< code shell >}}
sensuctl cluster-role create global-event-reader --verb='get,list' --resource='events'
{{< /code >}}

This command creates the following cluster-wide role resource definition:

{{< language-toggle >}}

{{< code yml >}}
---
type: ClusterRole
api_version: core/v2
metadata:
  created_by: admin
  name: global-event-reader
spec:
  rules:
  - resource_names: null
    resources:
    - events
    verbs:
    - get
    - list
{{< /code >}}

{{< code json >}}
{
  "type": "ClusterRole",
  "api_version": "core/v2",
  "metadata": {
    "created_by": "admin",
    "name": "global-event-reader"
  },
  "spec": {
    "rules": [
      {
        "resource_names": null,
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
{{< /code >}}

{{< /language-toggle >}}

#### Delete roles and cluster roles

To delete a role:

{{< code shell >}}
sensuctl role delete [ROLE-NAME]
{{< /code >}}

### Role and cluster role specification

#### Role and cluster role attributes

name         | 
-------------|------ 
description  | Name of the role.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: admin
{{< /code >}}
{{< code json >}}
{
  "name": "admin"
}
{{< /code >}}
{{< /language-toggle >}}

namespace    | 
-------------|------ 
description  | Namespace the role is restricted to. This attribute is not available for cluster roles.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
namespace: production
{{< /code >}}
{{< code json >}}
{
  "namespace": "production"
}
{{< /code >}}
{{< /language-toggle >}}

rules        | 
-------------|------ 
description  | Rulesets that the role applies.
required     | true
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
rules:
- verbs:
  - get
  - list
  resources:
  - checks
  resource_names:
  - ''
{{< /code >}}
{{< code json >}}
{
  "rules": [
    {
      "verbs": [
        "get",
        "list"
      ],
      "resources": [
        "checks"
      ],
      "resource_names": [
        ""
      ]
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

#### Rule attributes

A rule is an explicit statement that grants a particular permission to a resource.

verbs  | 
-------------|------ 
description  | Permissions to be applied by the rule: `get`, `list`, `create`, `update`, or `delete`. 
required     | true
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
verbs:
- get
- list
{{< /code >}}
{{< code json >}}
{
  "verbs": [
    "get",
    "list"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

resources         | 
-------------|------ 
description  | Type of resource that the rule has permission to access. Roles can only access [namespaced resource types][17]. Cluster roles can access namespaced and [cluster-wide resource types][18]. See [resource types][4] for available types.
required     | true
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
resources:
- checks
{{< /code >}}
{{< code json >}}
{
  "resources": [
    "checks"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

resource_names    | 
-------------|------ 
description  | Specific resource names that the rule has permission to access. Resource name permissions are only taken into account for requests using `get`, `update`, and `delete` verbs.
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
resource_names:
- check-cpu
{{< /code >}}
{{< code json >}}
{
  "resource_names": [
    "check-cpu"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

## Role bindings and cluster role bindings

A role binding assigns a _role_ or _cluster role_ to users and groups within a namespace.
A cluster role binding assigns a _cluster role_ to users and groups across namespaces and resource types.

Cluster role bindings use the same [specification][30] as role bindings and can be managed using the same sensuctl commands with `cluster-role-binding` substituted for `role-binding`.

To create and manage role bindings within a namespace, [create a role][25] with `rolebindings` permissions within that namespace, and log in by [configuring sensuctl][26].

To create and manage cluster role bindings, [configure sensuctl][26] as the [default `admin` user][20] or [create a cluster role][28] with permissions for `clusterrolebindings`.

Make sure to include the groups prefix and username prefix for the authentication provider when creating Sensu role bindings and cluster role bindings.
Without an assigned role or cluster role, users can sign in to the web UI but can't access any Sensu resources.
With the correct roles and bindings configured, users can log in to [sensuctl][2] and the [web UI][1] using their single-sign-on username and password (no prefixes required).

### Role binding example

The following example shows a role binding resource definition:

{{< language-toggle >}}

{{< code yml >}}
---
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
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

To create this role binding with [`sensuctl create`][31], first save the definition to a file like `rolebindings.yml` or `rolebindings.json`.

Then, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl create --file rolebindings.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl create --file rolebindings.json
{{< /code >}}

{{< /language-toggle >}}

### Cluster role binding example

The following example shows a cluster role binding resource definition:

{{< language-toggle >}}

{{< code yml >}}
---
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
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

To create this cluster role binding with [`sensuctl create`][31], first save the definition to a file like `clusterrolebindings.yml` or `clusterrolebindings.json`.

Then, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl create --file clusterrolebindings.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl create --file clusterrolebindings.json
{{< /code >}}

{{< /language-toggle >}}

### Default role bindings and cluster role bindings

Every [Sensu backend][1] includes:

| role name       | type          | description |
| --------------- | ------------- | ----------- |
| `system:pipeline`  | `RoleBinding` | Facility that allows the EventFilter engine to load events from Sensu's event store. `system:pipeline` is an implementation detail and should not be applied to Sensu users. |
| `cluster-admin` | `ClusterRoleBinding` | Full access to all [resource types][4] across namespaces, including access to [cluster-wide resource types][18]. |
| `system:agent` | `ClusterRoleBinding` | Full access to all events. Used internally by Sensu agents. |
| `system:user` | `ClusterRoleBinding` | Get and update permissions for local resources for the current user. |

### Manage role bindings and cluster role bindings

You can use [sensuctl][2] to view, create, and delete role bindings and cluster role bindings.

{{% notice note %}}
**NOTE**: To use any of these commands with cluster roles, substitute the `cluster-role-binding` command for the `role-binding` command.
{{% /notice %}}

To get help managing role bindings with sensuctl:

{{< code shell >}}
sensuctl role-binding help
{{< /code >}}

#### View role bindings and cluster role bindings

You can use [sensuctl][2] to see a list of role bindings within Sensu:

{{< code shell >}}
sensuctl role-binding list
{{< /code >}}

To see the details for a specific role binding:

{{< code shell >}}
sensuctl role-binding info [BINDING-NAME]
{{< /code >}}

To see a list of cluster role bindings:

{{< code shell >}}
sensuctl cluster-role-binding list
{{< /code >}}

#### Create role bindings and cluster role bindings

You can use [sensuctl][2] to see a create a role binding that assigns a role:

{{< code shell >}}
sensuctl role-binding create NAME --role=NAME --user=username --group=groupname
{{< /code >}}

This command creates the following role binding resource definition:

{{< language-toggle >}}

{{< code yml >}}
---
type: RoleBinding
api_version: core/v2
metadata:
  created_by: admin
  name: NAME
  namespace: default
spec:
  role_ref:
    name: NAME
    type: Role
  subjects:
  - name: groupname
    type: Group
  - name: username
    type: User
{{< /code >}}

{{< code json >}}
{
  "type": "RoleBinding",
  "api_version": "core/v2",
  "metadata": {
    "created_by": "admin",
    "name": "NAME",
    "namespace": "default"
  },
  "spec": {
    "role_ref": {
      "name": "NAME",
      "type": "Role"
    },
    "subjects": [
      {
        "name": "groupname",
        "type": "Group"
      },
      {
        "name": "username",
        "type": "User"
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

To create a role binding that assigns a cluster role:

{{< code shell >}}
sensuctl role-binding create NAME --cluster-role=NAME --user=username --group=groupname
{{< /code >}}

This command creates the following role binding resource definition:

{{< language-toggle >}}

{{< code yml >}}
---
type: RoleBinding
api_version: core/v2
metadata:
  created_by: admin
  name: NAME
  namespace: default
spec:
  role_ref:
    name: NAME
    type: ClusterRole
  subjects:
  - name: groupname
    type: Group
  - name: username
    type: User
{{< /code >}}

{{< code json >}}
{
  "type": "RoleBinding",
  "api_version": "core/v2",
  "metadata": {
    "created_by": "admin",
    "name": "NAME",
    "namespace": "default"
  },
  "spec": {
    "role_ref": {
      "name": "NAME",
      "type": "ClusterRole"
    },
    "subjects": [
      {
        "name": "groupname",
        "type": "Group"
      },
      {
        "name": "username",
        "type": "User"
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

To create a cluster role binding:

{{< code shell >}}
sensuctl cluster-role-binding create NAME --cluster-role=NAME --user=username --group=groupname
{{< /code >}}

This command creates the following cluster role binding resource definition:

{{< language-toggle >}}

{{< code yml >}}
---
type: ClusterRoleBinding
api_version: core/v2
metadata:
  created_by: admin
  name: NAME
spec:
  role_ref:
    name: NAME
    type: ClusterRole
  subjects:
  - name: groupname
    type: Group
  - name: username
    type: User
{{< /code >}}

{{< code json >}}
{
  "type": "ClusterRoleBinding",
  "api_version": "core/v2",
  "metadata": {
    "created_by": "admin",
    "name": "NAME"
  },
  "spec": {
    "role_ref": {
      "name": "NAME",
      "type": "ClusterRole"
    },
    "subjects": [
      {
        "name": "groupname",
        "type": "Group"
      },
      {
        "name": "username",
        "type": "User"
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

#### Delete role bindings and cluster role bindings

To delete a role binding:

{{< code shell >}}
sensuctl role-binding delete [ROLE-NAME]
{{< /code >}}

### Role binding and cluster role binding specification

roleRef      | 
-------------|------ 
description  | Reference a role in the current namespace or a cluster role.
required     | true
type         | Hash
example      | {{< language-toggle >}}
{{< code yml >}}
roleRef:
  type: Role
  name: event-reader
{{< /code >}}
{{< code json >}}
{
  "roleRef": {
    "type": "Role",
    "name": "event-reader"
  }
}
{{< /code >}}
{{< /language-toggle >}}

subjects     | 
-------------|------ 
description  | Users or groups being assigned.
required     | true
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
subjects:
- type: User
  name: alice
{{< /code >}}
{{< code json >}}
{
  "subjects": [
    {
      "type": "User",
      "name": "alice"
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

#### `roleRef` specification

type         | 
-------------|------ 
description  | `Role` for a role binding or `ClusterRole` for a cluster role binding.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: Role
{{< /code >}}
{{< code json >}}
{
  "type": "Role"
}
{{< /code >}}
{{< /language-toggle >}}

name         | 
-------------|------ 
description  | Name of the role or cluster role being assigned.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: event-reader
{{< /code >}}
{{< code json >}}
{
  "name": "event-reader"
}
{{< /code >}}
{{< /language-toggle >}}

#### `subjects` specification

type         | 
-------------|------ 
description  | `User` for assigning a user or `Group` for assigning a group.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: User
{{< /code >}}
{{< code json >}}
{
  "type": "User"
}
{{< /code >}}
{{< /language-toggle >}}

name         | 
-------------|------ 
description  | Username or group name.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: alice
{{< /code >}}
{{< code json >}}
{
  "name": "alice"
}
{{< /code >}}
{{< /language-toggle >}}
example with prefix | {{< language-toggle >}}
{{< code yml >}}
name: ad:alice
{{< /code >}}
{{< code json >}}
{
  "name": "ad:alice"
}
{{< /code >}}
{{< /language-toggle >}}

## Create a role and role binding

The following role and role binding give a `dev` group access to create and manage Sensu workflows within the `default` namespace.

{{< language-toggle >}}

{{< code yml >}}
---
type: Role
api_version: core/v2
metadata:
  name: workflow-creator
  namespace: default
spec:
  rules:
  - resource_names: []
    resources:
    - checks
    - hooks
    - filters
    - events
    - filters
    - mutators
    - handlers
    verbs:
    - get
    - list
    - create
    - update
    - delete
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

{{< language-toggle >}}

{{< code yml >}}
---
type: RoleBinding
api_version: core/v2
metadata:
  name: dev-binding
  namespace: default
spec:
  role_ref:
    name: workflow-creator
    type: Role
  subjects:
  - name: dev
    type: Group
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

## Create a role and role binding with a group prefix

In this example, if a groups_prefix of `ad` is configured for [Active Directory authentication][39], the role and role binding will give a `dev` group access to create and manage Sensu workflows within the `default` namespace.

{{< language-toggle >}}

{{< code yml >}}
---
type: Role
api_version: core/v2
metadata:
  name: workflow-creator
  namespace: default
spec:
  rules:
  - resource_names: []
    resources:
    - checks
    - hooks
    - filters
    - events
    - filters
    - mutators
    - handlers
    verbs:
    - get
    - list
    - create
    - update
    - delete
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

{{< language-toggle >}}

{{< code yml >}}
---
type: RoleBinding
api_version: core/v2
metadata:
  name: dev-binding-with-groups-prefix
  namespace: default
spec:
  role_ref:
    name: workflow-creator
    type: Role
  subjects:
  - name: ad:dev
    type: Group
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

## Assign user permissions within a namespace

To assign permissions to a user:

1. [Create the user][27].
2. [Create a role][25].
3. [Create a role binding][29] to assign the role to the user.

For example, the following configuration creates a user `alice`, a role `default-admin`, and a role binding `alice-default-admin`, giving `alice` full permissions for [namespaced resource types][17] within the `default` namespace.
You can add these resources to Sensu using [`sensuctl create`][31].

{{< language-toggle >}}

{{< code yml >}}
---
type: User
api_version: core/v2
metadata: {}
spec:
  disabled: false
  username: alice
{{< /code >}}

{{< code json >}}
{
  "type": "User",
  "api_version": "core/v2",
  "metadata": {},
  "spec": {
    "disabled": false,
    "username": "alice"
  }
}
{{< /code >}}

{{< /language-toggle >}}

{{< language-toggle >}}

{{< code yml >}}
---
type: Role
api_version: core/v2
metadata:
  name: default-admin
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
    - searches
    - silenced
    verbs:
    - get
    - list
    - create
    - update
    - delete
{{< /code >}}

{{< code json >}}
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
          "hooks", "mutators", "rolebindings", "roles", "searches", "silenced"
        ],
        "verbs": ["get", "list", "create", "update", "delete"]
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

{{< language-toggle >}}

{{< code yml >}}
---
type: RoleBinding
api_version: core/v2
metadata:
  name: alice-default-admin
  namespace: default
spec:
  role_ref:
    name: default-admin
    type: Role
  subjects:
  - name: alice
    type: User
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

## Assign group permissions within a namespace

To assign permissions to group of users:

1. [Create at least one user assigned to a group][27].
2. [Create a role][25].
3. [Create a role binding][29] to assign the role to the group.

For example, the following configuration creates a user `alice` assigned to the group `ops`, a role `default-admin`, and a role binding `ops-default-admin`, giving the `ops` group full permissions for [namespaced resource types][17] within the `default` namespace.
You can add these resources to Sensu using [`sensuctl create`][31].

{{< language-toggle >}}

{{< code yml >}}
---
type: User
api_version: core/v2
metadata: {}
spec:
  disabled: false
  username: alice
{{< /code >}}

{{< code json >}}
{
  "type": "User",
  "api_version": "core/v2",
  "metadata": {},
  "spec": {
    "disabled": false,
    "username": "alice"
  }
}
{{< /code >}}

{{< /language-toggle >}}

{{< language-toggle >}}

{{< code yml >}}
---
type: Role
api_version: core/v2
metadata:
  name: default-admin
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
    - searches
    - silenced
    verbs:
    - get
    - list
    - create
    - update
    - delete
{{< /code >}}

{{< code json >}}
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
          "hooks", "mutators", "rolebindings", "roles", "searches", "silenced"
        ],
        "verbs": ["get", "list", "create", "update", "delete"]
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

{{< language-toggle >}}

{{< code yml >}}
---
type: RoleBinding
api_version: core/v2
metadata:
  name: ops-default-admin
  namespace: default
spec:
  role_ref:
    name: default-admin
    type: Role
  subjects:
  - name: ops
    type: Group
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

{{% notice protip %}}
**PRO TIP**: To avoid recreating commonly used roles in each namespace, [create a cluster role](#create-cluster-wide-roles) and use a [role binding](#create-role-bindings-and-cluster-role-bindings) to restrict permissions within a specific namespace.
{{% /notice %}}

## Assign group permissions across all namespaces

To assign cluster-wide permissions to group of users:

1. [Create at least one user assigned to a group][27].
2. [Create a cluster role][28].
3. [Create a cluster role binding][29] to assign the role to the group.

For example, the following configuration creates a user `alice` assigned to the group `ops`, a cluster role `default-admin`, and a cluster role binding `ops-default-admin`, giving the `ops` group full permissions for [namespaced resource types][17] and [cluster-wide resource types][18] across all namespaces.
You can add these resources to Sensu using [`sensuctl create`][31].

{{< language-toggle >}}

{{< code yml >}}
---
type: User
api_version: core/v2
metadata: {}
spec:
  disabled: false
  username: alice
  groups:
  - ops

{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

{{< language-toggle >}}

{{< code yml >}}
---
type: ClusterRole
api_version: core/v2
metadata:
  name: default-admin
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
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

{{< language-toggle >}}

{{< code yml >}}
---
type: ClusterRoleBinding
api_version: core/v2
metadata:
  name: ops-default-admin
spec:
  role_ref:
    name: default-admin
    type: ClusterRole
  subjects:
  - name: ops
    type: Group
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

## Reuse cluster roles across namespaces

Reusing cluster roles across namespaces can reduce the number of resources you need to manage.

For example, suppose you have three teams, each with its own namespace.
You write a script that uses [limited service accounts][15] to create and delete silences.
You want to use the script for all three team namespaces, so you create a role with the required permissions and a role binding in each namespace: six new resources.
If you need to change the permissions for the script, you will need to update each role in the team namespaces (three resources).

A better approach is to create a single cluster role that grants the required permissions, plus one role binding in each namespace to tie the permissions to the namespace's limited service account.
With this configuration, you only need to update one resource to make permission changes: the `silencing-script` cluster role.
Sensu will automatically apply updates in each team's namespace using the role bindings that define each limited service account as a subject of the cluster role.

1. Create a [limited service account][15] user in each namespace:

   {{< code shell >}}
sensuctl user create silencing-service-team-1 --password='password'
{{< /code >}}

   This creates the following user definition:

   {{< language-toggle >}}
{{< code yml >}}
---
type: User
api_version: core/v2
metadata:
  name: silencing-service-team-1
spec:
  disabled: false
  username: silencing-service-team-1
{{< /code >}}
{{< code json >}}
{
  "type": "User",
  "api_version": "core/v2",
  "metadata": {
    "name": "silencing-service-team-1"
  },
  "spec": {
    "disabled": false,
    "username": "silencing-service-team-1"
  }
}
{{< /code >}}
{{< /language-toggle >}}

   Repeat this step to create a limited service account user in each team's namespace.

2. Create a [cluster role][28] with get, list, create, update, and delete permissions for silences:

   {{< code shell >}}
sensuctl cluster-role create silencing-script --verb get,list,create,update,delete --resource silenced
{{< /code >}}

   This command creates the cluster role that has the permissions the silencing service accounts will need:

   {{< language-toggle >}}
{{< code yml >}}
---
type: ClusterRole
api_version: core/v2
metadata:
  created_by: admin
  name: silencing-script
spec:
  rules:
  - resource_names: null
    resources:
    - silenced
    verbs:
    - get
    - list
    - create
    - update
    - delete
{{< /code >}}
{{< code json >}}
{
  "type": "ClusterRole",
  "api_version": "core/v2",
  "metadata": {
    "created_by": "admin",
    "name": "silencing-script"
  },
  "spec": {
    "rules": [
      {
        "resource_names": null,
        "resources": [
          "silenced"
        ],
        "verbs": [
          "get",
          "list",
          "create",
          "update",
          "delete"
        ]
      }
    ]
  }
}
{{< /code >}}
{{< /language-toggle >}}

3. Create a [role binding][29] in each team namespace to assign the `silencing-script` cluster role to the team's `silencing-service` user.
For example, use this command to create the role binding for Team 1:

   {{< code shell >}}
sensuctl role-binding create silencing-script-binding-team-1 --cluster-role silencing-script --user silencing-service-team-1 --namespace team1
{{< /code >}}

   This command creates the role binding that ties the correct permissions (via the `silencing-script` cluster role) with your service account (via the user `silencing-service-team-1`):
   {{< language-toggle >}}
{{< code yml >}}
---
type: RoleBinding
api_version: core/v2
metadata:
  created_by: admin
  name: silencing-script-binding-team-1
  namespace: team1
spec:
  role_ref:
    name: silencing-script
    type: ClusterRole
  subjects:
  - name: silencing-service-team-1
    type: User
{{< /code >}}
{{< code json >}}
{
  "type": "RoleBinding",
  "api_version": "core/v2",
  "metadata": {
    "created_by": "admin",
    "name": "silencing-script-binding-team-1",
    "namespace": "team1"
  },
  "spec": {
    "role_ref": {
      "name": "silencing-script",
      "type": "ClusterRole"
    },
    "subjects": [
      {
        "name": "silencing-service-team-1",
        "type": "User"
      }
    ]
  }
}
{{< /code >}}
{{< /language-toggle >}}

   Repeat this step to create a role binding for the `silencing-script` cluster role and the limited service account user in each team's namespace.


[1]: ../../../observability-pipeline/observe-schedule/backend/
[2]: ../../../sensuctl/
[3]: ../../../web-ui/
[4]: #resources
[5]: ../../../plugins/assets/
[6]: ../../../observability-pipeline/observe-schedule/checks/
[7]: ../../../observability-pipeline/observe-entities/entities/
[8]: ../../../observability-pipeline/observe-events/events/
[9]: ../../../observability-pipeline/observe-process/handlers/
[10]: ../../../observability-pipeline/observe-schedule/hooks/
[11]: ../../../observability-pipeline/observe-transform/mutators/
[12]: ../namespaces/
[13]: #roles-and-cluster-roles
[14]: ../../../observability-pipeline/observe-process/silencing/
[15]: ../create-limited-service-accounts/
[16]: ../../../reference/
[17]: #namespaced-resource-types
[18]: #cluster-wide-resource-types
[19]: ../../../api/
[20]: #default-users
[22]: ../../../observability-pipeline/observe-filter/filters/
[23]: #role-bindings-and-cluster-role-bindings
[24]: #role-and-cluster-role-specification
[25]: #create-roles
[26]: ../../deploy-sensu/install-sensu/#install-sensuctl
[27]: #create-users
[28]: #create-cluster-wide-roles
[29]: #create-role-bindings-and-cluster-role-bindings
[30]: #role-binding-and-cluster-role-binding-specification
[31]: ../../../sensuctl/create-manage-resources/#create-resources
[32]: ../#use-an-authentication-provider
[34]: ../#use-built-in-basic-authentication
[35]: https://en.wikipedia.org/wiki/Bcrypt
[37]: ../../maintain-sensu/license/
[39]: ../ad-auth/#ad-groups-prefix
[40]: ../../deploy-sensu/etcdreplicators/
[41]: ../../../observability-pipeline/observe-schedule/agent/#security-configuration-flags
[42]: ../../deploy-sensu/install-sensu/#install-the-sensu-backend
[45]: ../../../sensuctl/#change-admin-users-password
[46]: ../../manage-secrets/secrets-providers/
[47]: ../../deploy-sensu/datastore/
[48]: ../../manage-secrets/secrets/
[49]: ../../../web-ui/search#search-for-labels
[50]: ../../../sensuctl/#reset-a-user-password
[51]: ../../../sensuctl/#generate-a-password-hash
