---
title: "Create a read-only user with role-based access control (RBAC)"
linkTitle: "Create a Read-only User"
guide_title: "Create a read-only user with role-based access control (RBAC)"
type: "guide"
description: "Role-based access control (RBAC) allows you to exercise fine-grained control over how Sensu users interact with Sensu resources. Use RBAC rules to achieve multitenancy so different projects and teams can share a Sensu instance. Read this guide to create users with Sensu RBAC."
weight: 30
version: "6.4"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-6.4:
    parent: control-access
---

Role-based access control (RBAC) allows you to exercise fine-grained control over how Sensu users interact with Sensu resources.
Use RBAC rules to achieve **multitenancy** so different projects and teams can share a Sensu instance. 

Sensu RBAC helps different teams and projects share a Sensu instance.
RBAC allows you to manage users and their access to resources based on **namespaces**, **groups**, **roles**, and **bindings**.

By default, Sensu includes a `default` namespace and an `admin` user with full permissions to create, modify, and delete resources within Sensu, including RBAC resources like users and roles.
This guide requires a running Sensu backend and a sensuctl instance configured to connect to the backend as an [`admin` user][2].

## Create a read-only user

In this section, you'll create a user and assign them read-only access to resources within the `default` namespace using a **role** and a **role binding**.

1. Create a user with the username `alice` and assign them to the group `ops`:
{{< code shell >}}
sensuctl user create alice --password='password' --groups=ops
{{< /code >}}

   This command creates the following user:
   {{< language-toggle >}}
{{< code yml >}}
username: alice
groups:
- ops
disabled: false
{{< /code >}}
{{< code json >}}
{
  "username": "alice",
  "groups": [
    "ops"
  ],
  "disabled": false
}
{{< /code >}}
{{< /language-toggle >}}

2. Create a `read-only` role with `get` and `list` permissions for all resources (`*`) within the `default` namespace:
{{< code shell >}}
sensuctl role create read-only --verb=get,list --resource=* --namespace=default
{{< /code >}}

   This command creates the following role resource definition:
   {{< language-toggle >}}
{{< code yml >}}
---
type: Role
api_version: core/v2
metadata:
  created_by: admin
  name: read-only
  namespace: default
spec:
  rules:
  - resource_names: null
    resources:
    - '*'
    verbs:
    - get
    - list
{{< /code >}}
{{< code json >}}
{
  "type": "Role",
  "api_version": "core/v2",
  "metadata": {
    "created_by": "admin",
    "name": "read-only",
    "namespace": "default"
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
          "list"
        ]
      }
    ]
  }
}
{{< /code >}}
{{< /language-toggle >}}

3. Create an `ops-read-only` role binding to assign the `read-only` role to the `ops` group:
{{< code shell >}}
sensuctl role-binding create ops-read-only --role=read-only --group=ops
{{< /code >}}

   This command creates the following role binding resource definition:
   {{< language-toggle >}}
{{< code yml >}}
---
type: RoleBinding
api_version: core/v2
metadata:
  created_by: admin
  name: ops-read-only
  namespace: default
spec:
  role_ref:
    name: read-only
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
    "created_by": "admin",
    "name": "ops-read-only",
    "namespace": "default"
  },
  "spec": {
    "role_ref": {
      "name": "read-only",
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

All users in the `ops` group now have read-only access to all resources within the default namespace.
You can also use role bindings to tie roles directly to users using the `--user` flag.

To manage your RBAC configuration, use the `sensuctl user`, `sensuctl role`, and `sensuctl role-binding` commands.

## Create a cluster-wide event-reader user

Suppose you want to create a user with read-only access to events across all namespaces.
Because you want this role to have cluster-wide permissions, you'll need to create a **cluster role** and a **cluster role binding**.

1. Create a user with the username `bob` and assign them to the group `ops`:
{{< code shell >}}
sensuctl user create bob --password='password' --groups=ops
{{< /code >}}

   This command creates the following user:
   {{< language-toggle >}}
{{< code yml >}}
username: bob
groups:
- ops
disabled: false
{{< /code >}}
{{< code json >}}
{
  "username": "bob",
  "groups": [
    "ops"
  ],
  "disabled": false
}
{{< /code >}}
{{< /language-toggle >}}

2. Create a `global-event-reader` cluster role with `get` and `list` permissions for `events` across all namespaces:
{{< code shell >}}
sensuctl cluster-role create global-event-reader --verb=get,list --resource=events
{{< /code >}}

   This command creates the following cluster role resource definition:
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

3. Create an `ops-event-reader` cluster role binding to assign the `global-event-reader` role to the `ops` group:
{{< code shell >}}
sensuctl cluster-role-binding create ops-event-reader --cluster-role=global-event-reader --group=ops
{{< /code >}}

   This command creates the following cluster role binding resource definition:
   {{< language-toggle >}}
{{< code yml >}}
---
type: ClusterRoleBinding
api_version: core/v2
metadata:
  created_by: admin
  name: ops-event-reader
spec:
  role_ref:
    name: global-event-reader
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
    "created_by": "admin",
    "name": "ops-event-reader"
  },
  "spec": {
    "role_ref": {
      "name": "global-event-reader",
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

All users in the `ops` group now have read-only access to events across all namespaces.

## Next steps

Now that you know how to create a user, a role, and a role binding to assign a role to a user, check out the [RBAC reference][1] for in-depth documentation on role-based access control, examples, and information about cluster-wide permissions.

Read about [monitoring as code][3] with Sensu and learn how to [use SensuFlow][4] to synchronize your monitoring and observability code with your Sensu deployments.


[1]: ../rbac/
[2]: ../rbac#default-users
[3]: ../../monitoring-as-code/
[4]: https://sensu.io/blog/monitoring-as-code-with-sensu-flow
