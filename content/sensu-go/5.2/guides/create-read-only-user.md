---
title: "How to create a read-only user with RBAC"
linkTitle: "Creating a Read Only User"
description: "RBAC allows you to exercise fine-grained control over how Sensu users interact with Sensu resources. Using RBAC rules, you can easily achieve multitenancy so different projects and teams can share a Sensu instance. Read the guide to get started creating users with Sensu RBAC."
weight: 100
version: "5.2"
product: "Sensu Go"
platformContent: False
lastTested: 2018-12-04
menu: 
  sensu-go-5.2:
    parent: guides
---

## What is RBAC?
**Role-based access control** (RBAC) is Sensu's local user management system. RBAC currently supports the management of users and permissions with *namespaces*, *roles*, *users*, and *role bindings*.

## Why use RBAC?
RBAC allows you to exercise fine-grained control over how Sensu users interact 
with Sensu resources. Using RBAC rules, you can easily achieve **multitenancy** 
so different projects and teams can share a Sensu instance. 

## How to create a read-only user
By default, Sensu includes a `default` namespace and an `admin` user with full permissions to create, modify, and delete resources within Sensu.
Using sensuctl configured as the [default `admin` user][2], you can create new roles for users that give as much or as little access as you see fit.

In this section, you'll create a user with read-only access to resources within the `default` namespace.
Sensu includes a default read-only role called `view` that you can use to create a read-only user.

1. Create a user with the username `alice`:
{{< highlight shell >}}
sensuctl user create alice --password 'password'
{{< /highlight >}}

2. Create a `read-only-user` role binding to assign the `view` role to the `alice` user:
{{< highlight shell >}}
sensuctl role-binding create read-only-user --cluster-role=view --user=alice
{{< /highlight >}}

## How to create an event-reader user
Now let's say you want to create a user that has read-only access to only events within the `default` namespace.
Since this user needs different permissions from those provided by the default `view` role, you'll need to create a role before creating the user and role binding.

1. Create an `event-reader` role with `get` and `list` permissions for `events` within the `default` namespace:
{{< highlight shell >}}
sensuctl role create event-reader --verb get,list --resource events --namespace default
{{< /highlight >}}

2. Create a user with the username `bob`:
{{< highlight shell >}}
sensuctl user create bob  --password 'password'
{{< /highlight >}}

3. Create an `event-reader-binding` role binding to assign the `event-reader` role to the `bob` user:
{{< highlight shell >}}
sensuctl role-binding create event-reader-binding --role=event-reader --user=bob
{{< /highlight >}}

## Next steps

You now know how to create a role, create a user, and create a role binding to assign a role to a user. From this point, here are some recommended resources:

* Read the [RBAC reference][1] for in-depth documentation on role-based access control and information about cluster-wide permissions.

[1]: ../../reference/rbac
[2]: ../../reference/rbac#default-user
