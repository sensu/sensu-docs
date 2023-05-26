---
title: "Role-based access control (RBAC) reference"
linkTitle: "RBAC Reference"
reference_title: "Role-based access control (RBAC)"
type: "reference"
description: "Read this reference to learn how Sensu's role-based access control helps teams and projects share a Sensu instance, authorize access, and grant permissions."
weight: 80
version: "6.10"
product: "Sensu Go"
menu:
  sensu-go-6.10:
    parent: control-access
---

Sensu's role-based access control (RBAC) helps different teams and projects share a Sensu instance.
Use RBAC to specify the actions users are allowed to take against specific Sensu resources, within [namespaces][12] or across all namespaces, based on roles bound to the user or to one or more groups the user is a member of.

- [Roles][53] create sets of permissions (for example, get and delete) tied to resource types.
[Cluster roles][13] apply permissions across namespaces and include access to [cluster-wide resources][18] like users and namespaces. 
- [Users][56] represent a person or agent that interacts with Sensu.
Users can belong to one or more [groups][57].
- [Role bindings][55] assign a role to a set of users and groups within a namespace.
[Cluster role bindings][23] assign a cluster role to a set of users and groups cluster-wide.

RBAC configuration applies to [sensuctl][2], the [API][19], and the [web UI][3].

## Resources

Permissions within Sensu can be scoped to resource types, like checks, handlers, and users.
List resource types in the [rules][58] arrays of role and cluster role definitions to configure permissions. 

### Namespaced resource types

Namespaced resources belong to a single [namespace][12].
You can set permissions for namespaced resources with [roles][53] and [cluster roles][13].

| Resource type | Description |
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
| `pipelines` | Resources composed of [event processing workflows][52] |
| `rolebindings` | Namespace-specific role assigners |
| `roles` | Namespace-specific permission sets |
| `rule-templates` | [Resources applied to service components][38] for business service monitoring |
| `searches` | Saved [web UI][49] search queries |
| `secrets` |[Secrets][48] (for example, username or password) |
| `service-components` | Resources that represent [elements in a business service][36] |
| `silenced` | [Silencing][14] resources within a namespace |
| `sumo-logic-metrics-handlers` | Persistent handlers for [transmitting metrics to Sumo Logic][43] |
| `tcp-stream-handlers` | Persistent handlers for [sending events to TCP sockets][44] for remote storage |

### Cluster-wide resource types

Cluster-wide resources cannot be assigned to a namespace.
You can set permissions for cluster-wide resources only with [cluster roles][13].

| Resource type | Description |
|---|---|
| `apikeys` | [Persistent universally unique identifier (UUID)][33] for authentication |
| `authproviders` | [Authentication provider][32] configuration |
| `clusterrolebindings` | Cluster-wide role assigners  |
| `clusterroles` | Cluster-wide permission sets |
| `clusters` | Sensu clusters running multiple [Sensu backends][1] |
| `config` | Global configuration for [web UI display][21] |
| `etcd-replicators` | [Mirror RBAC resource changes][40] to follower clusters |
| `license` | Sensu [commercial license][37] |
| `namespaces` | Resource partitions within a Sensu instance |
| `provider` | [PostgreSQL event store][47] provider |
| `providers` | [Secrets providers][46] |
| `users` | People or agents that interact with Sensu |

### Special resource types

You can set permissions for special resource types with [roles][53] and [cluster roles][13].

| Type | Description |
|---|---|
| `*` | All resources within Sensu. **The `*` type takes precedence over other rules within the same role.** If you want to deny a certain type, you can't use the `*` type. Instead, you must explicitly allow every type required. When applied to a role, the `*` type applies only to [namespaced resource types][17]. When applied to a cluster role, the `*` type applies to both [namespaced resource types][17] and [cluster-wide resource types][18]. |

## Users

A user represents a person or an agent that interacts with Sensu.

You can assign users to one or more [roles][53] or [cluster roles][13].
You can also assign users to one or more [groups][57].
Users inherit all permissions from each role or cluster role they are assigned to, whether they are assigned as users or as a member of a group.

Users can use their assigned Sensu username and password to [configure sensuctl][26] and log in to the [web UI][3].

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
  password: user_password
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
    "password": "user_password",
    "password_hash": "$5f$14$.brXRviMZpbaleSq9kjoUuwm67V/s4IziOLGHjEqxJbzPsreQAyNm",
    "disabled": false,
    "groups": ["ops", "dev"]
  }
}
{{< /code >}}

{{< /language-toggle >}}

To create this user with [`sensuctl create`][31], first, save the definition to a file like `users.yml` or `users.json`.
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

Sensu automatically creates an administrator user and an `agent` user during installation.

#### Administrator user

During the [Sensu backend installation][42] process, you create a username and password for an `admin` user.

The `admin` user is automatically added to the `cluster-admins` group and the `cluster-admin` cluster role, which are both listed in the cluster role binding `cluster-admin`.
The group, cluster role, and cluster role binding assignments give the `admin` user permissions to manage all aspects of Sensu, as well as create new users.

After you [configure sensuctl][26], you can [change the `admin` user's password][45] with the `change-password` command.

#### `agent` user

Sensu creates a default `agent` user with the password `P@ssw0rd!` during startup.
The user/password combination corresponds to the defaults the Sensu agent uses.

By default, the `agent` user belongs to the `system:agent` group.
The `system:agent` cluster role binding grants the `system:agent` cluster role to the members of this group.
To grant agent users the permissions they need to report events into any namespace, add agent users to the `system:agent` group.

Configure the `agent` user's credentials with the [`user`][41] and [`password`][68] agent configuration options.

### View users

Use [sensuctl][2] to list all users within Sensu.

To return a list of users in `yaml` or `wrapped-json` format for use with `sensuctl create`:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl user list --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl user list --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

### Test and change user passwords

To test the password for a user created with Sensu's [built-in basic authentication][34], run:

{{< code shell >}}
sensuctl user test-creds <USERNAME> --password '<PASSWORD>'
{{< /code >}}

An empty response indicates the user's password is valid.
A `request-unauthorized` response indicates the user's password is invalid.

{{% notice note %}}
**NOTE**: The `sensuctl user test-creds` command tests passwords for users created with Sensu's built-in [basic authentication](../#use-built-in-basic-authentication).
It does not test user credentials defined via an authentication provider like [Lightweight Directory Access Protocol (LDAP)](../ldap-auth/), [Active Directory (AD)](../ad-auth/), or [OpenID Connect 1.0 protocol (OIDC)](../oidc-auth/). 
{{% /notice %}}

To change a user's password:

{{< code shell >}}
sensuctl user change-password <USERNAME> --current-password <CURRENT_PASSWORD> --new-password <NEW_PASSWORD>
{{< /code >}}

You can also use sensuctl to [reset a user's password][50] or [generate a password hash][51].

### Create users

You can use [sensuctl][2] to create users.
For example, the following command creates a user with the username `alice`, creates a password, and assigns the user to the `ops` and `dev` groups:

{{< code shell >}}
sensuctl user create alice --password='<PASSWORD>' --groups=ops,dev
{{< /code >}}

{{% notice note %}}
**NOTE**: Passwords must have at least eight characters.
{{% /notice %}}

You can create any number of users, each with their own passwords.
As a general rule, users have no permissions by default.
Users are granted permissions by role bindings or cluster role bindings.

### Disable users

To disable a user, run:

{{< code shell >}}
sensuctl user disable <USERNAME>
{{< /code >}}

To reinstate a disabled user, run:

{{< code shell >}}
sensuctl user reinstate <USERNAME>
{{< /code >}}

### Assign user permissions

To assign permissions to a user:

1. [Create the user][27].
2. [Create a role][25] (or a [cluster role][28] for cluster-wide access).
3. [Create a role binding][25] (or [cluster role binding][28]) to assign the role to the user.

## Groups

A group is a set of users within Sensu.
You can assign groups to one or more roles, and users can belong to one or more groups.

Groups inherit all permissions from each role they are assigned to.

{{% notice note %}}
**NOTE**: Groups are not a resource type within Sensu.
Instead, groups are created and managed only within user definitions.
{{% /notice %}}

### Default groups

Sensu includes a default `cluster-admins` group that contains the [default `admin` user][20] and a `system:agents` group used internally by Sensu agents.

### Add groups to users

Use [sensuctl][2] to add a group to a user:

{{< code shell >}}
sensuctl user add-group <USERNAME> <GROUP>
{{< /code >}}

You can also set a user's list of groups to a specific list:

{{< code shell >}}
sensuctl user set-groups <USERNAME> <GROUP1>[,<GROUP2>, ...<GROUP2>]
{{< /code >}}

### Remove groups from users

Use [sensuctl][2] to remove groups from users.

To remove a group from a user:

{{< code shell >}}
sensuctl user remove-group <USERNAME> <GROUP>
{{< /code >}}

To remove all groups from a user:

{{< code shell >}}
sensuctl user remove-groups <USERNAME>
{{< /code >}}

## Roles

A role is a set of permissions that control access to Sensu resources within a single namespace.
Use [role bindings][55] to assign roles to users and groups.

To create and manage roles within a single namespace, [create a role][25] with `roles` permissions within that namespace.
To create and manage roles cluster-wide, [configure sensuctl][26] as the [default `admin` user][20] or [create a cluster role][28] with `roles` permissions.

To avoid recreating commonly used roles in every namespace, [create a cluster role][28] and use a [role binding][25] (not a cluster role binding) to restrict permissions within a specific namespace.

### Role example

The following example shows a role resource definition:

{{< language-toggle >}}

{{< code yml >}}
---
type: Role
api_version: core/v2
metadata:
  name: namespaced-resources-all-verbs
spec:
  rules:
  - resources:
    - assets
    - checks
    - entities
    - events
    - filters
    - handlers
    - hooks
    - mutators
    - pipelines
    - rolebindings
    - roles
    - silenced
    - sumo-logic-metrics-handlers
    - tcp-stream-handlers
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
    "name": "namespaced-resources-all-verbs"
  },
  "spec": {
    "rules": [
      {
        "resources": [
          "assets",
          "checks",
          "entities",
          "events",
          "filters",
          "handlers",
          "hooks",
          "mutators",
          "pipelines",
          "rolebindings",
          "roles",
          "silenced",
          "sumo-logic-metrics-handlers",
          "tcp-stream-handlers"
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

### Default roles

Every [Sensu backend][1] includes the `system:pipeline` role, which is a facility that allows the EventFilter engine to load events from Sensu's event store.
The `system:pipeline` role is an implementation detail and should not be assigned to Sensu users.

### View roles

Use [sensuctl][2] to list all roles within Sensu:

{{< code shell >}}
sensuctl role list
{{< /code >}}

To review the permissions and scope for a specific role:

{{< code shell >}}
sensuctl role info admin
{{< /code >}}

To get help managing roles with sensuctl:

{{< code shell >}}
sensuctl role help
{{< /code >}}

### Edit roles

To edit a role:

{{< code shell >}}
sensuctl edit role <ROLE> <flags>
{{< /code >}}

To get more information about available flags, run:

{{< code shell >}}
sensuctl edit --help
{{< /code >}}

### Create roles

You can use [sensuctl][2] to create roles.
Read [Create a role and role binding][25] for an example.

### Delete roles

To delete a role:

{{< code shell >}}
sensuctl role delete <ROLE>
{{< /code >}}

## Cluster roles

A cluster role is a set of permissions that control access to Sensu resources.
Cluster roles can include permissions for [cluster-wide resources][18] in addition to [namespaced resources][17].

You can also use cluster roles (in conjunction with [cluster role bindings][23]) to grant access to namespaced resources across all namespaces.
This allows you to run commmands like `sensuctl check list --all-namespaces`.

To create and manage cluster roles, [configure sensuctl][26] as the [default `admin` user][20] or [create a cluster role][28] with permissions for `clusterroles`.
To create and manage roles cluster-wide, [configure sensuctl][26] as the [default `admin` user][20] or create a cluster role with `roles` permissions.

To avoid recreating commonly used roles in every namespace, [create a cluster role][28] and use a [role binding][25] (not a cluster role binding) to restrict permissions within a specific namespace.

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
  - resources:
    - assets
    - checks
    - entities
    - events
    - filters
    - handlers
    - hooks
    - mutators
    - pipelines
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
    - sumo-logic-metrics-handlers
    - tcp-stream-handlers
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
        "resources": [
          "assets",
          "checks",
          "entities",
          "events",
          "filters",
          "handlers",
          "hooks",
          "mutators",
          "pipelines",
          "rolebindings",
          "roles",
          "silenced",
          "cluster",
          "clusterrolebindings",
          "clusterroles",
          "namespaces",
          "users",
          "authproviders",
          "license",
          "sumo-logic-metrics-handlers",
          "tcp-stream-handlers"
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

### Default cluster roles

Every [Sensu backend][1] includes the following cluster roles:

| Cluster role name | Description |
| ----------------- | ----------- |
| `cluster-admin`   | Full access to all [resource types][4] across namespaces, including access to [cluster-wide resource types][18]. |
| `admin`           | Full access to all [resource types][4]. Apply this cluster role within a namespace with a [role binding][55] (not a cluster role binding). |
| `edit`            | Read and write access to most [resource types][4] except roles and role bindings. Apply this cluster role within a namespace with a [role binding][55] (not a cluster role binding). |
| `view`            | Read-only access to most [resource types][4] except roles and role bindings. Apply this cluster role within a namespace with a [role binding][55] (not a cluster role binding). |
| `system:agent`    | Used internally by Sensu agents. Configure an agent's user credentials with the [`user` and `password` agent configuration flags][41]. |
| `system:user`     | Get and update permissions for local resources for the current user. |

### View cluster roles

Use [sensuctl][2] to list all cluster roles within Sensu:

{{< code shell >}}
sensuctl cluster-role list
{{< /code >}}

To review the permissions and scope for a specific cluster role:

{{< code shell >}}
sensuctl cluster-role info <CLUSTER-ROLE>
{{< /code >}}

To get help managing roles with sensuctl:

{{< code shell >}}
sensuctl cluster-role help
{{< /code >}}

### Create cluster roles

You can use [sensuctl][2] to create cluster roles.
Read [Create a cluster role and cluster role binding][28] for an example.

### Delete cluster roles

To delete a cluster role:

{{< code shell >}}
sensuctl cluster-role delete <CLUSTER-ROLE>
{{< /code >}}

## Role bindings

A role binding assigns a role or a cluster role to users and groups within a single namespace.

To create and manage role bindings within a namespace, [create a role][25] with `rolebindings` permissions within that namespace, and log in by [configuring sensuctl][26].

Without an assigned role or cluster role, users can sign in to the web UI but can't access any Sensu resources.
With the correct roles and bindings configured, users can log in to [sensuctl][2] and the [web UI][3] using their single-sign-on username and password (no prefixes required).

Make sure to include the groups_prefix and username_prefix for the authentication provider when you create Sensu role bindings.

### Role binding example

The following example shows a role binding resource definition:

{{< language-toggle >}}

{{< code yml >}}
---
type: RoleBinding
api_version: core/v2
metadata:
  name: event-reader-binding
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
    "name": "event-reader-binding"
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

### Default role bindings

Every [Sensu backend][1] includes the `system:pipeline` role binding, a facility that allows the EventFilter engine to load events from Sensu's event store.
The `system:pipeline` role binding is an implementation detail and should not be applied to Sensu users. |

#### View role bindings

Use [sensuctl][2] to list all role bindings within Sensu:

{{< code shell >}}
sensuctl role-binding list
{{< /code >}}

To review the details for a specific role binding:

{{< code shell >}}
sensuctl role-binding info <ROLE-BINDING>
{{< /code >}}

To get help managing role bindings with sensuctl:

{{< code shell >}}
sensuctl role-binding help
{{< /code >}}

### Create role bindings

You can use [sensuctl][2] to create role bindings that assign a role to users and groups.
Read [Create a role and role binding][25] for an example.

### Delete role bindings

To delete a role binding:

{{< code shell >}}
sensuctl role-binding delete <ROLE-BINDING>
{{< /code >}}

## Cluster role bindings

A cluster role binding assigns a cluster role to users and groups across namespaces and resource types.

To create and manage cluster role bindings, [configure sensuctl][26] as the [default `admin` user][20] or [create a cluster role][28] with permissions for `clusterrolebindings`.

Without an assigned role or cluster role, users can sign in to the web UI but can't access any Sensu resources.
With the correct roles and bindings configured, users can log in to [sensuctl][2] and the [web UI][3] using their single-sign-on username and password (no prefixes required).

Make sure to include the groups_prefix and username_prefix for the authentication provider when creating Sensu cluster role bindings.

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
  - name: Cluster_Admins
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
        "name": "Cluster_Admins",
        "type": "Group"
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

{{% notice note %}}
**NOTE**: If you are using Active Directory (AD) or Lightweight Directory Access Protocol (LDAP) authentication, the names of users and groups listed in the subjects array must exactly match the user and group names the authentication provider returns to the Sensu backend.
{{% /notice %}}

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

### Default cluster role bindings

Every [Sensu backend][1] includes the following cluster role bindings:

| Cluster role binding name | Description |
| --------------- | ----------- |
| `cluster-admin` | `ClusterRoleBinding` | Full access to all [resource types][4] across namespaces, including access to [cluster-wide resource types][18]. |
| `system:agent`  | `ClusterRoleBinding` | Full access to all events. Used internally by Sensu agents. |
| `system:user`   | `ClusterRoleBinding` | Get and update access for local resources for the current user. |

### View cluster role bindings

Use [sensuctl][2] to list all cluster role bindings within Sensu:

{{< code shell >}}
sensuctl cluster-role-binding list
{{< /code >}}

To review the details for a specific role binding:

{{< code shell >}}
sensuctl cluster-role-binding info <CLUSTER-ROLE-BINDING>
{{< /code >}}

To get help managing cluster role bindings with sensuctl:

{{< code shell >}}
sensuctl cluster-role-binding help
{{< /code >}}

### Create cluster role bindings

You can use [sensuctl][2] to create cluster role bindings that assign cluster roles to users and groups.
Read [Create a cluster role and cluster role binding][28] for an example.

### Delete cluster role bindings

To delete a role binding:

{{< code shell >}}
sensuctl cluster-role-binding delete <CLUSTER-ROLE-BINDING>
{{< /code >}}

## Create a role and role binding

This example will create a role and a role binding that assigns the role to a group.
As a result, all users who are assigned the group will have get, list, create, update, and delete permissions for all resources in the production namespace.

The following command creates a `prod-admin` role restricted to the production namespace:

{{< code shell >}}
sensuctl role create prod-admin --verb='get,list,create,update,delete' --resource='*' --namespace production
{{< /code >}}

The command creates the following role resource definition:

{{< language-toggle >}}

{{< code yml >}}
---
type: Role
api_version: core/v2
metadata:
  name: prod-admin
  namespace: production
spec:
  rules:
  - resources:
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
    "name": "prod-admin",
    "namespace": "production"
  },
  "spec": {
    "rules": [
      {
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

Run the following command to create a role binding (or [cluster role binding][23]) to assign the `prod-admin` role created above to a group named `oncall`:

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
  name: prod-admin-oncall
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
    "name": "prod-admin-oncall"
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

Role bindings can also assign cluster roles to users and groups within a single namespace.
For example, to create a role binding that assigns the `global-event-reader` cluster role to the user `angela` and the `event-readers` group, run:

{{< code shell >}}
sensuctl role-binding create event-readers-binding --cluster-role=global-event-reader --user=angela --group=read-events-only
{{< /code >}}

This command creates a role binding resource definition similar to the following:

{{< language-toggle >}}

{{< code yml >}}
---
type: RoleBinding
api_version: core/v2
metadata:
  name: event-readers-binding
  namespace: default
spec:
  role_ref:
    name: global-event-reader
    type: ClusterRole
  subjects:
  - name: read-events-only
    type: Group
  - name: angela
    type: User
{{< /code >}}

{{< code json >}}
{
  "type": "RoleBinding",
  "api_version": "core/v2",
  "metadata": {
    "name": "event-readers-binding",
    "namespace": "default"
  },
  "spec": {
    "role_ref": {
      "name": "global-event-reader",
      "type": "ClusterRole"
    },
    "subjects": [
      {
        "name": "read-events-only",
        "type": "Group"
      },
      {
        "name": "angela",
        "type": "User"
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Create a role and role binding with a group prefix

In this example, if a groups_prefix of `ad` is configured for [Active Directory authentication][39], the role and role binding will give a `dev` group access to create and manage Sensu workflows within the `default` namespace:

{{< language-toggle >}}

{{< code yml >}}
---
type: Role
api_version: core/v2
metadata:
  name: workflow-creator
spec:
  rules:
  - resources:
    - checks
    - hooks
    - filters
    - events
    - filters
    - mutators
    - pipelines
    - handlers
    - sumo-logic-metrics-handlers
    - tcp-stream-handlers
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
    "name": "workflow-creator"
  },
  "spec": {
    "rules": [
      {
        "resources": [
          "checks",
          "hooks",
          "filters",
          "events",
          "filters",
          "mutators",
          "pipelines",
          "handlers",
          "sumo-logic-metrics-handlers",
          "tcp-stream-handlers"
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

{{< language-toggle >}}

{{< code yml >}}
---
type: RoleBinding
api_version: core/v2
metadata:
  name: dev-binding-with-groups-prefix
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
    "name": "dev-binding-with-groups-prefix"
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

## Create a cluster role and cluster role binding

This example will create a cluster role and a cluster role role binding that assigns the cluster role to a user and a group.
As a result, the individual user and all users who are assigned the group will have read-only access to events (and only events) across all namespaces in Sensu.

For example, the following command creates a `global-event-reader` cluster role that can read events in all namespaces:

{{< code shell >}}
sensuctl cluster-role create global-event-reader --verb='get,list' --resource='events'
{{< /code >}}

The command creates the following cluster role resource definition:

{{< language-toggle >}}

{{< code yml >}}
---
type: ClusterRole
api_version: core/v2
metadata:
  name: global-event-reader
spec:
  rules:
  - resources:
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
    "name": "global-event-reader"
  },
  "spec": {
    "rules": [
      {
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

Next, run the following command to assign the `global-event-reader` cluster role to the user `angela` and the group `global-event-readers`:

{{< code shell >}}
sensuctl cluster-role-binding create global-event-reader-binding --cluster-role=global-event-reader --user=angela --group=global-event-readers
{{< /code >}}

This command creates a cluster role binding resource definition similar to the following:

{{< language-toggle >}}

{{< code yml >}}
---
type: ClusterRoleBinding
api_version: core/v2
metadata:
  name: global-event-reader-binding
spec:
  role_ref:
    name: global-event-reader
    type: ClusterRole
  subjects:
  - name: global-event-readers
    type: Group
  - name: angela
    type: User
{{< /code >}}

{{< code json >}}
{
  "type": "ClusterRoleBinding",
  "api_version": "core/v2",
  "metadata": {
    "name": "global-event-reader-binding"
  },
  "spec": {
    "role_ref": {
      "name": "global-event-reader",
      "type": "ClusterRole"
    },
    "subjects": [
      {
        "name": "global-event-readers",
        "type": "Group"
      },
      {
        "name": "angela",
        "type": "User"
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
3. [Create a role binding][25] to assign the role to the user.

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
  password: user_password
{{< /code >}}

{{< code json >}}
{
  "type": "User",
  "api_version": "core/v2",
  "metadata": {},
  "spec": {
    "disabled": false,
    "username": "alice",
    "password": "user_password"
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
spec:
  rules:
  - resources:
    - assets
    - checks
    - entities
    - events
    - filters
    - handlers
    - hooks
    - mutators
    - pipelines
    - rolebindings
    - roles
    - searches
    - silenced
    - sumo-logic-metrics-handlers
    - tcp-stream-handlers
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
    "name": "default-admin"
  },
  "spec": {
    "rules": [
      {
        "resources": [
          "assets",
          "checks",
          "entities",
          "events",
          "filters",
          "handlers",
          "hooks",
          "mutators",
          "pipelines",
          "rolebindings",
          "roles",
          "searches",
          "silenced",
          "sumo-logic-metrics-handlers",
          "tcp-stream-handlers"
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

{{< language-toggle >}}

{{< code yml >}}
---
type: RoleBinding
api_version: core/v2
metadata:
  name: alice-default-admin
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
    "name": "alice-default-admin"
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
3. [Create a role binding][25] to assign the role to the group.

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
  password: user_password
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
    "password": "user_password",
    "groups": [
      "ops"
    ]
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
spec:
  rules:
  - resources:
    - assets
    - checks
    - entities
    - events
    - filters
    - handlers
    - hooks
    - mutators
    - pipelines
    - rolebindings
    - roles
    - searches
    - silenced
    - sumo-logic-metrics-handlers
    - tcp-stream-handlers
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
    "name": "default-admin"
  },
  "spec": {
    "rules": [
      {
        "resources": [
          "assets",
          "checks",
          "entities",
          "events",
          "filters",
          "handlers",
          "hooks",
          "mutators",
          "pipelines",
          "rolebindings",
          "roles",
          "searches",
          "silenced",
          "sumo-logic-metrics-handlers",
          "tcp-stream-handlers"
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

{{< language-toggle >}}

{{< code yml >}}
---
type: RoleBinding
api_version: core/v2
metadata:
  name: ops-default-admin
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
    "name": "ops-default-admin"
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
**PRO TIP**: To avoid recreating commonly used roles in each namespace, [create a cluster role](#create-a-cluster-role-and-cluster-role-binding) and use a [role binding](#role-bindings) to restrict permissions within a specific namespace.
{{% /notice %}}

## Assign group permissions across all namespaces

To assign cluster-wide permissions to group of users:

1. [Create at least one user assigned to a group][27].
2. [Create a cluster role][28].
3. [Create a cluster role binding][28] to assign the role to the group.

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
  password: user_password
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
    "password": "user_password",
    "groups": [
      "ops"
    ]
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
  - resources:
    - assets
    - checks
    - entities
    - events
    - filters
    - handlers
    - hooks
    - mutators
    - pipelines
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
    - sumo-logic-metrics-handlers
    - tcp-stream-handlers
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
        "resources": [
          "assets",
          "checks",
          "entities",
          "events",
          "filters",
          "handlers",
          "hooks",
          "mutators",
          "pipelines",
          "rolebindings",
          "roles",
          "silenced",
          "cluster",
          "clusterrolebindings",
          "clusterroles",
          "namespaces",
          "users",
          "authproviders",
          "license",
          "sumo-logic-metrics-handlers",
          "tpc-stream-handlers"
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

## Assign different permissions for different resource types

You can assign different permissions for different resource types in a role or cluster role definition.
To do this, you'll still create at least one user assigned to a group, a role or cluster role, and a role binding or cluster role binding.
However, in this case, the role or cluster role will include more than one rule.

For example, you may want users in a testing group to be able to get and list all resource types but create, update, and delete only silenced entries across all namespaces.
Create a user `alice` assigned to the group `ops_testing`, a cluster role `manage_silences` with two rules (one for all resources and one just for silences), and a cluster role binding `ops_testing_manage_silences`:

{{< language-toggle >}}

{{< code yml >}}
---
type: User
api_version: core/v2
metadata: {}
spec:
  disabled: false
  username: alice
  password: user_password
  groups:
  - ops_testing
{{< /code >}}

{{< code json >}}
{
  "type": "User",
  "api_version": "core/v2",
  "metadata": {},
  "spec": {
    "disabled": false,
    "username": "alice",
    "password": "user_password",
    "groups": [
      "ops_testing"
    ]
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
  name: manage_silences
spec:
  rules:
  - verbs:
    - get
    - list
    resources:
    - '*'
  - verbs:
    - create
    - update
    - delete
    resources:
    - silenced
{{< /code >}}

{{< code json >}}
{
  "type": "ClusterRole",
  "api_version": "core/v2",
  "metadata": {
    "name": "manage_silences"
  },
  "spec": {
    "rules": [
      {
        "verbs": [
          "get",
          "list"
        ],
        "resources": [
          "*"
        ]
      },
      {
        "verbs": [
          "create",
          "update",
          "delete"
        ],
        "resources": [
          "silenced"
        ]
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
  name: ops_testing_manage_silences
spec:
  role_ref:
    name: manage_silences
    type: ClusterRole
  subjects:
  - name: ops_testing
    type: Group
{{< /code >}}

{{< code json >}}
{
  "type": "ClusterRoleBinding",
  "api_version": "core/v2",
  "metadata": {
    "name": "ops_testing_manage_silences"
  },
  "spec": {
    "role_ref": {
      "name": "manage_silences",
      "type": "ClusterRole"
    },
    "subjects": [
      {
        "name": "ops_testing",
        "type": "Group"
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

Create as many rules as you need in the role or cluster role.
For example, you can configure a role or cluster role that includes one rule for each verb, with each rule listing only the resources that verb should apply to.

Here's another example that includes three rules.
Each rule specifies different access permissions for the resource types listed in the rule.
In addition, the user group would have no access at all for the two resources that are not listed: API keys and licences.

{{< language-toggle >}}

{{< code yml >}}
---
type: User
api_version: core/v2
metadata: {}
spec:
  disabled: false
  username: alice
  password: user_password
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
    "password": "user_password",
    "groups": [
      "ops"
    ]
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
  name: ops_access
spec:
  rules:
  - verbs:
    - get
    - list
    resources:
    - entities
    - events
    - rolebindings
    - roles
    - clusterrolebindings
    - clusterroles
    - config
    - users
  - verbs:
    - get
    - list
    - create
    - update
    - delete
    resources:
    - assets
    - checks
    - filters
    - handlers
    - hooks
    - mutators
    - pipelines
    - rule-templates
    - searches
    - secrets
    - service-components
    - silenced
    - sumo-logic-metrics-handlers
    - tcp-stream-handlers
    - clusters
    - etcd-replicators
    - providers
  - verbs:
    - get
    - list
    - create
    - update
    resources:
    - authproviders
    - namespaces
    - provider
{{< /code >}}

{{< code json >}}
{
  "type": "ClusterRole",
  "api_version": "core/v2",
  "metadata": {
    "name": "ops_access"
  },
  "spec": {
    "rules": [
      {
        "verbs": [
          "get",
          "list"
        ],
        "resources": [
          "entities",
          "events",
          "rolebindings",
          "roles",
          "clusterrolebindings",
          "clusterroles",
          "config",
          "users"
        ]
      },
      {
        "verbs": [
          "get",
          "list",
          "create",
          "update",
          "delete"
        ],
        "resources": [
          "assets",
          "checks",
          "filters",
          "handlers",
          "hooks",
          "mutators",
          "pipelines",
          "rule-templates",
          "searches",
          "secrets",
          "service-components",
          "silenced",
          "sumo-logic-metrics-handlers",
          "tcp-stream-handlers",
          "clusters",
          "etcd-replicators",
          "providers"
        ]
      },
      {
        "verbs": [
          "get",
          "list",
          "create",
          "update"
        ],
        "resources": [
          "authproviders",
          "namespaces",
          "provider"
        ]
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
  name: ops_access_assignment
spec:
  role_ref:
    name: ops_access
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
    "name": "ops_access_assignment"
  },
  "spec": {
    "role_ref": {
      "name": "ops_access",
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
  name: silencing-script
spec:
  rules:
  - resources:
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
    "name": "silencing-script"
  },
  "spec": {
    "rules": [
      {
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

3. Create a [role binding][25] in each team namespace to assign the `silencing-script` cluster role to the team's `silencing-service` user.
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
  name: silencing-script-binding-team-1
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
    "name": "silencing-script-binding-team-1"
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

## User specification

### Top-level attributes for user resources

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For users in this version of Sensu, this attribute should always be `core/v2`.
required     | Required for user definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][31].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: core/v2
{{< /code >}}
{{< code json >}}
{
  "api_version": "core/v2"
}
{{< /code >}}
{{< /language-toggle >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the user, including `name`. The `metadata` map is always at the top level of the user definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. Read [metadata attributes for user resources][59] for details.
required     | Required for user definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][31].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: alice
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "name": "alice"
  }
}
{{< /code >}}
{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes the [user spec attributes][60].
required     | Required for user definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][31].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  disabled: false
  groups:
  - ops
  - dev
  password: user_password
  password_hash: $5f$14$.brXRviMZpbaleSq9kjoUuwm67V/s4IziOLGHjEqxJbzPsreQAyNm
  username: alice
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "disabled": false,
    "groups": [
      "ops",
      "dev"
    ],
    "password": "user_password",
    "password_hash": "$5f$14$.brXRviMZpbaleSq9kjoUuwm67V/s4IziOLGHjEqxJbzPsreQAyNm",
    "username": "alice"
  }
}
{{< /code >}}
{{< /language-toggle >}}

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][31] resource type. Users should always be type `User`.
required     | Required for user definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][31].
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

### Metadata attributes for user resources

| name       |      |
-------------|------
description  | Unique string used to identify the user. User resource names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][54]). Each user resource must have a unique name.
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

### Spec attributes for user resources

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
password: user_password
{{< /code >}}
{{< code json >}}
{
  "password": "user_password"
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

## Role and cluster role specification

### Top-level attributes for role and cluster role resources

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For role and cluster role resources in this version of Sensu, this attribute should always be `core/v2`.
required     | Required for role and cluster role definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][31].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: core/v2
{{< /code >}}
{{< code json >}}
{
  "api_version": "core/v2"
}
{{< /code >}}
{{< /language-toggle >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the role or cluster role. The `metadata` map is always at the top level of the role or cluster role definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. Read [metadata attributes for role and cluster role resources][61] for details.{{% notice note %}}
**NOTE**: Cluster role definitions do not include a `namespace` attribute in the resource metadata.
{{% /notice %}}
required     | Required for role definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][31].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  annotations:
    managed-by: prod-admin
  created_by: admin
  labels:
    environment: prod1
    region: us-west-1
    sensu.io/managed_by: sensuctl
  name: prod-user
  namespace: production
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "annotations": {
      "managed-by": "prod-admin"
    },
    "created_by": "admin",
    "labels": {
      "environment": "prod1",
      "region": "us-west-1",
      "sensu.io/managed_by": "sensuctl"
    },
    "name": "prod-user",
    "namespace": "production"
  }
}
{{< /code >}}
{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes the [role or cluster role spec attributes][62].
required     | Required for role or cluster role definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][31].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  rules:
  - resource_names: null
    resources:
    - checks
    - entities
    - events
    - filters
    - handlers
    - hooks
    - mutators
    - pipelines
    - searches
    - service-components
    - silenced
    - sumo-logic-metrics-handlers
    - tcp-stream-handlers
    verbs:
    - get
    - list
    - create
    - update
    - delete
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "rules": [
      {
        "resource_names": null,
        "resources": [
          "checks",
          "entities",
          "events",
          "filters",
          "handlers",
          "hooks",
          "mutators",
          "pipelines",
          "searches",
          "service-components",
          "silenced",
          "sumo-logic-metrics-handlers",
          "tcp-stream-handlers"
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

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][31] resource type. Roles should always be type `Role`. Cluster roles should always be type `ClusterRole`.
required     | Required for role and cluster role definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][31].
type         | String
example (role)     | {{< language-toggle >}}
{{< code yml >}}
type: Role
{{< /code >}}
{{< code json >}}
{
  "type": "Role"
}
{{< /code >}}
{{< /language-toggle >}}
example<br>(cluster role) | {{< language-toggle >}}
{{< code yml >}}
type: ClusterRole
{{< /code >}}
{{< code json >}}
{
  "type": "ClusterRole"
}
{{< /code >}}
{{< /language-toggle >}}

### Metadata attributes for role and cluster role resources

| annotations |     |
-------------|------
description  | Non-identifying metadata to include with observation event data that you can access with [event filters][22]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][19], [sensuctl response filtering][2], or [web UI views][3].
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
annotations:
  managed-by: prod-admin
{{< /code >}}
{{< code json >}}
{
  "annotations": {
    "managed-by": "prod-admin"
  }
}
{{< /code >}}
{{< /language-toggle >}}

| created_by |      |
-------------|------
description  | Username of the Sensu user who created or last updated the role or cluster role. Sensu automatically populates the `created_by` field when the role or cluster role is created or updated.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
created_by: admin
{{< /code >}}
{{< code json >}}
{
  "created_by": "admin"
}
{{< /code >}}
{{< /language-toggle >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with observation event data that you can use for response and web UI view filtering.<br><br>If you include labels in your event data, you can filter [API responses][19], [sensuctl responses][2], and [web UI views][3] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
labels:
  environment: prod1
  region: us-west-1
  sensu.io/managed_by: sensuctl
{{< /code >}}
{{< code json >}}
{
  "labels": {
    "environment": "prod1",
    "region": "us-west-1",
    "sensu.io/managed_by": "sensuctl"
  }
}
{{< /code >}}
{{< /language-toggle >}}

| name       |      |
-------------|------
description  | Unique string used to identify the role or cluster role. Role and cluster role names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][54]). Each role must have a unique name within its namespace. Each cluster role must have a unique name.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: prod-user
{{< /code >}}
{{< code json >}}
{
  "name": "prod-user"
}
{{< /code >}}
{{< /language-toggle >}}

| namespace  |      |
-------------|------
description  | [Sensu RBAC namespace][26] that the role belongs to.{{% notice note %}}
**NOTE**: Cluster role definitions do not include a `namespace` attribute in the resource metadata.
{{% /notice %}}
required     | false
type         | String
default      | `default`
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

### Spec attributes for role and cluster role resources

rules        | 
-------------|------ 
description  | Rule set that the role or cluster role applies. A rule is an explicit statement that grants a particular access to a resource. Read [rules attributes][58] for more information.
required     | true
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
rules:
- resource_names:
  - check-cpu
  resources:
  - checks
  - entities
  - events
  - filters
  - handlers
  - hooks
  - mutators
  - pipelines
  - searches
  - service-components
  - silenced
  - sumo-logic-metrics-handlers
  - tcp-stream-handlers
  verbs:
  - get
  - list
  - create
  - update
  - delete
{{< /code >}}
{{< code json >}}
{
  "rules": [
    {
      "resource_names": [
        "check-cpu"
      ],
      "resources": [
        "checks",
        "entities",
        "events",
        "filters",
        "handlers",
        "hooks",
        "mutators",
        "pipelines",
        "searches",
        "service-components",
        "silenced",
        "sumo-logic-metrics-handlers",
        "tcp-stream-handlers"
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
{{< /code >}}
{{< /language-toggle >}}

#### Rules attributes

resources         | 
-------------|------ 
description  | Types of resources that the rule has permission to access. Read [resource types][4] to learn more about available types.
required     | true
type         | Array
allowed values (roles) | [Namespaced resource types][17] and the [special resource type `*`][64].
allowed values (cluster roles) | [Namespaced resource types][17], [cluster-wide resource types][18], and the [special resource type `*`][64].
example      | {{< language-toggle >}}
{{< code yml >}}
resources:
- checks
- entities
- events
- filters
- handlers
- hooks
- mutators
- pipelines
- searches
- service-components
- silenced
- sumo-logic-metrics-handlers
- tcp-stream-handlers
{{< /code >}}
{{< code json >}}
{
  "resources": [
    "checks",
    "entities",
    "events",
    "filters",
    "handlers",
    "hooks",
    "mutators",
    "pipelines",
    "searches",
    "service-components",
    "silenced",
    "sumo-logic-metrics-handlers",
    "tcp-stream-handlers"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

resource_names    | 
-------------|------ 
description  | Names of specific individual resources that the rule has permission to access. Resource name permissions are only taken into account for requests that use `get`, `update`, and `delete` verbs.
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

verbs  | 
-------------|------ 
description  | Type of access the rule will apply. 
required     | true
type         | Array
allowed values | `get`, `list`, `create`, `update`, `delete`
example      | {{< language-toggle >}}
{{< code yml >}}
verbs:
- get
- list
- create
- update
- delete
{{< /code >}}
{{< code json >}}
{
  "verbs": [
    "get",
    "list",
    "create",
    "update",
    "delete"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

## Role binding and cluster role binding specification

### Top-level attributes for role binding and cluster role binding resources

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For role binding and cluster role binding resources in this version of Sensu, this attribute should always be `core/v2`.
required     | Required for role binding and cluster role binding definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][31].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: core/v2
{{< /code >}}
{{< code json >}}
{
  "api_version": "core/v2"
}
{{< /code >}}
{{< /language-toggle >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the role binding or cluster role binding. The `metadata` map is always at the top level of the role binding or cluster role binding definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. Read [metadata attributes for role binding and cluster role binding resources][63] for details.{{% notice note %}}
**NOTE**: Cluster role binding definitions do not include a `namespace` attribute in the resource metadata.
{{% /notice %}}
required     | Required for role binding and cluster role binding definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][31].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  annotations:
    managed-by: prod-admin
  created_by: admin
  labels:
    environment: prod1
    region: us-west-1
    sensu.io/managed_by: sensuctl
  name: prod-user
  namespace: production
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "annotations": {
      "managed-by": "prod-admin"
    },
    "created_by": "admin",
    "labels": {
      "environment": "prod1",
      "region": "us-west-1",
      "sensu.io/managed_by": "sensuctl"
    },
    "name": "prod-user",
    "namespace": "production"
  }
}
{{< /code >}}
{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes the [role binding and cluster role binding spec attributes][65].
required     | Required for role binding or cluster role binding definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][31].
type         | Map of key-value pairs
example (role) | {{< language-toggle >}}
{{< code yml >}}
spec:
  role_ref:
    name: prod-admin
    type: Role
  subjects:
  - name: oncall
    type: Group
  - name: angela
    type: User
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "role_ref": {
      "name": "prod-admin",
      "type": "Role"
    },
    "subjects": [
      {
        "name": "oncall",
        "type": "Group"
      },
      {
        "name": "angela",
        "type": "User"
      }
    ]
  }
}
{{< /code >}}
{{< /language-toggle >}}
example (cluster role) | {{< language-toggle >}}
{{< code yml >}}
spec:
  role_ref:
    name: global-event-reader
    type: ClusterRole
  subjects:
  - name: global-event-readers
    type: Group
  - name: angela
    type: User
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "role_ref": {
      "name": "global-event-reader",
      "type": "ClusterRole"
    },
    "subjects": [
      {
        "name": "global-event-readers",
        "type": "Group"
      },
      {
        "name": "angela",
        "type": "User"
      }
    ]
  }
}
{{< /code >}}
{{< /language-toggle >}}

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][31] resource type. Role bindings should always be type `RoleBinding`. Cluster role bindings should always be type `ClusterRoleBinding`.
required     | Required for role binding and cluster role binding definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][31].
type         | String
example (role binding) | {{< language-toggle >}}
{{< code yml >}}
type: RoleBinding
{{< /code >}}
{{< code json >}}
{
  "type": "RoleBinding"
}
{{< /code >}}
{{< /language-toggle >}}
example (cluster role binding) | {{< language-toggle >}}
{{< code yml >}}
type: ClusterRoleBinding
{{< /code >}}
{{< code json >}}
{
  "type": "ClusterRoleBinding"
}
{{< /code >}}
{{< /language-toggle >}}

### Metadata attributes for role binding and cluster role binding resources

| annotations |     |
-------------|------
description  | Non-identifying metadata to include with observation event data that you can access with [event filters][22]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][19], [sensuctl response filtering][2], or [web UI views][3].
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
annotations:
  managed-by: prod-admin
{{< /code >}}
{{< code json >}}
{
  "annotations": {
    "managed-by": "prod-admin"
  }
}
{{< /code >}}
{{< /language-toggle >}}

| created_by |      |
-------------|------
description  | Username of the Sensu user who created or last updated the role binding or cluster role binding. Sensu automatically populates the `created_by` field when the role binding or cluster role binding is created or updated.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
created_by: admin
{{< /code >}}
{{< code json >}}
{
  "created_by": "admin"
}
{{< /code >}}
{{< /language-toggle >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with observation event data that you can use for response and web UI view filtering.<br><br>If you include labels in your event data, you can filter [API responses][19], [sensuctl responses][2], and [web UI views][3] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
labels:
  environment: prod1
  region: us-west-1
  sensu.io/managed_by: sensuctl
{{< /code >}}
{{< code json >}}
{
  "labels": {
    "environment": "prod1",
    "region": "us-west-1",
    "sensu.io/managed_by": "sensuctl"
  }
}
{{< /code >}}
{{< /language-toggle >}}

| name       |      |
-------------|------
description  | Unique string used to identify the role binding or cluster role binding. Role binding and cluster role binding names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][54]). Each role binding must have a unique name within its namespace. Each cluster role binding must have a unique name.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: prod-user
{{< /code >}}
{{< code json >}}
{
  "name": "prod-user"
}
{{< /code >}}
{{< /language-toggle >}}

| namespace  |      |
-------------|------
description  | [Sensu RBAC namespace][26] that the role binding belongs to.{{% notice note %}}
**NOTE**: Cluster role binding definitions do not include a `namespace` attribute in the resource metadata.
{{% /notice %}}
required     | false
type         | String
default      | `default`
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

### Spec attributes for role binding and cluster role binding resources

role_ref      | 
-------------|------ 
description  | Name and type for the role or cluster role to bind to the users and groups listed in the [subjects][67] array. Read [role_ref attributes][66] for more information.
required     | true
type         | Hash
example (role binding) | {{< language-toggle >}}
{{< code yml >}}
role_ref:
  name: prod-admin
  type: Role
{{< /code >}}
{{< code json >}}
{
  "role_ref": {
    "name": "prod-admin",
    "type": "Role"
  }
}
{{< /code >}}
{{< /language-toggle >}}
example (cluster role binding) | {{< language-toggle >}}
{{< code yml >}}
role_ref:
  name: global-event-reader
  type: ClusterRole
{{< /code >}}
{{< code json >}}
{
  "role_ref": {
    "name": "global-event-reader",
    "type": "ClusterRole"
  }
}
{{< /code >}}
{{< /language-toggle >}}

subjects     | 
-------------|------ 
description  | Users and groups to bind with the role or cluster role listed in the [role_ref][66] attribute. Read [subjects attributes][67] for more information.
required     | true
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
subjects:
- name: oncall
  type: Group
- name: angela
  type: User
{{< /code >}}
{{< code json >}}
{
  "subjects": [
    {
      "name": "oncall",
      "type": "Group"
    },
    {
      "name": "angela",
      "type": "User"
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

#### `role_ref` attributes

name         | 
-------------|------ 
description  | Name of the role or cluster role to bind in the role binding or cluster role binding.
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

type         | 
-------------|------ 
description  | The [sensuctl create][31] resource type for the role or cluster role. Use `Role` if you are binding a role. Use `ClusterRole` if you are binding a cluster role.
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

#### `subjects` attributes

name         | 
-------------|------ 
description  | Name of the user resource or group resource to bind in the role binding or cluster role binding.{{% notice note %}}**NOTE**: If you are using Active Directory (AD) or Lightweight Directory Access Protocol (LDAP) authentication, names of users and groups are case-sensitive. The user and group names listed in the cluster role binding configuration must exactly match the user and group names the authentication provider returns to the Sensu backend.
{{% /notice %}}
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

type         | 
-------------|------ 
description  | The [sensuctl create][31] resource type for the user or group to bind. Use `User` if you are binding a user. Use `Group` if you are binding a group.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: Group
{{< /code >}}
{{< code json >}}
{
  "type": "Group"
}
{{< /code >}}
{{< /language-toggle >}}


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
[13]: #cluster-roles
[14]: ../../../observability-pipeline/observe-process/silencing/
[15]: ../create-limited-service-accounts/
[16]: ../../../reference/
[17]: #namespaced-resource-types
[18]: #cluster-wide-resource-types
[19]: ../../../api/
[20]: #agent-user
[21]: ../../../web-ui/webconfig-reference/
[22]: ../../../observability-pipeline/observe-filter/filters/
[23]: #cluster-role-bindings
[24]: #role-and-cluster-role-specification
[25]: #create-a-role-and-role-binding
[26]: ../../deploy-sensu/install-sensu/#install-sensuctl
[27]: #create-users
[28]: #create-a-cluster-role-and-cluster-role-binding
[30]: #role-binding-and-cluster-role-binding-specification
[31]: ../../../sensuctl/create-manage-resources/#create-resources
[32]: ../sso/
[33]: ../../../api/#authenticate-with-an-api-key
[34]: ../#use-built-in-basic-authentication
[35]: https://en.wikipedia.org/wiki/Bcrypt
[36]: ../../../observability-pipeline/observe-schedule/service-components/
[37]: ../../maintain-sensu/license/
[38]: ../../../observability-pipeline/observe-schedule/rule-templates/
[39]: ../ad-auth/#ad-groups-prefix
[40]: ../../deploy-sensu/etcdreplicators/
[41]: ../../../observability-pipeline/observe-schedule/agent/#agent-password-option
[42]: ../../deploy-sensu/install-sensu/#install-the-sensu-backend
[43]: ../../../observability-pipeline/observe-process/sumo-logic-metrics-handlers/
[44]: ../../../observability-pipeline/observe-process/tcp-stream-handlers/
[45]: ../../../sensuctl/#change-the-admin-users-password
[46]: ../../manage-secrets/secrets-providers/
[47]: ../../deploy-sensu/datastore/
[48]: ../../manage-secrets/secrets/
[49]: ../../../web-ui/search/#save-a-search
[50]: ../../../sensuctl/#reset-a-user-password
[51]: ../../../sensuctl/#generate-a-password-hash
[52]: ../../../observability-pipeline/observe-process/pipelines/
[53]: #roles
[54]: https://regex101.com/r/zo9mQU/2
[55]: #role-bindings
[56]: #users
[57]: #groups
[58]: #rules-attributes
[59]: #metadata-attributes-for-user-resources
[60]: #spec-attributes-for-user-resources
[61]: #metadata-attributes-for-role-and-cluster-role-resources
[62]: #spec-attributes-for-role-and-cluster-role-resources
[63]: #metadata-attributes-for-role-binding-and-cluster-role-binding-resources
[64]: #special-resource-types
[65]: #spec-attributes-for-role-binding-and-cluster-role-binding-resources
[66]: #role_ref-attributes
[67]: #subjects-attributes
[68]: ../../../observability-pipeline/observe-schedule/agent/#agent-user-option
[68]: ../../../observability-pipeline/observe-schedule/agent/#agent-user-option
