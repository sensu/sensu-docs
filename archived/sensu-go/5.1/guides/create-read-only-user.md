---
title: "How to create a read-only user with RBAC"
linkTitle: "Creating a Read Only User"
description: "RBAC allows you to exercise fine-grained control over how Sensu users interact with Sensu resources. Using RBAC rules, you can easily achieve multitenancy so different projects and teams can share a Sensu instance. Read the guide to get started creating users with Sensu RBAC."
weight: 100
version: "5.1"
product: "Sensu Go"
platformContent: False
lastTested: 2018-12-04
menu: 
  sensu-go-5.1:
    parent: guides
---

Sensu role-based access control (RBAC) helps different teams and projects share a Sensu instance.
RBAC allows management and access of users and resources based on **namespaces**, **groups**, **roles**, and **bindings**.

By default, Sensu includes a `default` namespace and an `admin` user with full permissions to create, modify, and delete resources within Sensu, including RBAC resources like users and roles.
This guide requires a running Sensu backend and a sensuctl instance configured to connect to the backend as the default [`admin` user][2].

## Why use RBAC?
RBAC allows you to exercise fine-grained control over how Sensu users interact 
with Sensu resources. Using RBAC rules, you can easily achieve **multitenancy** 
so different projects and teams can share a Sensu instance. 

## How to create a read-only user
In this section, you'll create a user and assign them read-only access to resources within the `default` namespace using a **role** and a **role binding**.

1. Create a user with the username `alice` and assign them to the group `ops`:
{{< highlight shell >}}
sensuctl user create alice --password='password' --groups=ops
{{< /highlight >}}

2. Create a `read-only` role with `get` and `list` permissions for all resources (`*`) within the `default` namespace:
{{< highlight shell >}}
sensuctl role create read-only --verb=get,list --resource=* --namespace=default
{{< /highlight >}}

3. Create an `ops-read-only` role binding to assign the `read-only` role to the `ops` group:
{{< highlight shell >}}
sensuctl role-binding create ops-read-only --role=read-only --group=ops
{{< /highlight >}}
You can also use role bindings to tie roles directly to users using the `--user` flag.

All users in the `ops` group now have read-only access to all resources within the default namespace.
You can use the `sensuctl user`, `sensuctl role`, and `sensuctl role-binding` commands to manage your RBAC configuration.

## How to create a cluster-wide event-reader user
Now let's say you want to create a user that has read-only access to events across all namespaces.
Since you want this role to have cluster-wide permissions, you'll need to create a **cluster role** and a **cluster role binding**.

1. Create a user with the username `bob` and assign them to the group `ops`:
{{< highlight shell >}}
sensuctl user create bob --password='password' --groups=ops
{{< /highlight >}}

2. Create a `global-event-reader` cluster role with `get` and `list` permissions for `events` across all namespaces:
{{< highlight shell >}}
sensuctl cluster-role create global-event-reader --verb=get,list --resource=events
{{< /highlight >}}

3. Create an `ops-event-reader` cluster role binding to assign the `global-event-reader` role to the `ops` group:
{{< highlight shell >}}
sensuctl cluster-role-binding create ops-event-reader --cluster-role=global-event-reader --group=ops
{{< /highlight >}}

All users in the `ops` group now have read-only access to events across all namespaces.

## Next steps

You now know how to create a user, create a role, and create a role binding to assign a role to a user. From this point, here are some recommended resources:

* Read the [RBAC reference][1] for in-depth documentation on role-based access control, examples, and information about cluster-wide permissions.

[1]: ../../reference/rbac
[2]: ../../reference/rbac#default-user
