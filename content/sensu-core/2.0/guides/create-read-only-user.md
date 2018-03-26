---
title: "How to create a Read Only User with RBAC"
linkTitle: "Create Read Only User"
weight: 1
version: "2.0"
product: "Sensu Core"
platformContent: False
menu: 
  sensu-core-2.0:
    parent: guides
---

## What is RBAC?
**Role-Based Access Control** (RBAC) is Sensu's local user management system. RBAC currently supports the management of users and permissions with *organizations*, *environments*, *roles*, and *users*. Support for external directories (such as LDAP) will be available in a future release.

## Why use RBAC
RBAC allows you to exercise fine-grained control over how Sensu users interact 
with Sensu resources. Using RBAC rules, you can easily achieve **multitenancy** 
so users only have access to resources within their own organization and environment. 

## How to create a Read Only user
The initial installation of Sensu includes a `default` environment, included in the `default` organization, and an `admin` user with full permissions to create, modify, or delete resouces within Sensu. Using `sensuctl`, you can create new roles for users that give as much or as little access as you see fit. The purpose of this guide is to help you create a new user with read-only access to resources within the `default` organization and environment.


To get started, you must first create a new read-only role: 
{{< highlight shell >}}
$ sensuctl role create read-only --organization default --environment default --type \* --read
{{< /highlight >}}
`--type` specifies a resource type. In this case, we are allowing read-only
access to all resources within the default organization and environment.

Next, create a new user, and apply the read-only role.
{{< highlight shell >}}
$ sensuctl user create 'read-only-user'  --password 'password' --roles 'read-only'
{{< /highlight >}}
You may also apply the read-only role to an existing user account. Users can
have multiple roles spanning multiple organizations, each with their own set of
permissions.

Using sensuctl, you can verify that the role and user have the correct permissions.
{{< highlight shell >}}
$ sensuctl role list-rules read-only
  Type       Org.       Env.       Permissions
 ────── ───────── ───────── ─────────────
  *        default     default        read
{{< /highlight >}}

{{< highlight shell >}}
$ sensuctl user list 
Username        	Roles       Enabled
──────────────── ─────────── ─────────
read-only-user        read-only      true
{{< /highlight >}}
## Next steps

You now know how to create a role, add a rule to restrict its abilities, and apply that role to a user. From this point, here are some recommended resources:

* Read the [RBAC reference][1] for in-depth documentation on Role Based Access Control. 

[1]: ../../reference/rbac
