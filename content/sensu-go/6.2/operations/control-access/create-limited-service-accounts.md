---
title: "Create limited service accounts with role-based access control (RBAC)"
linkTitle: "Create Limited Service Accounts"
guide_title: "Create limited service accounts with role-based access control (RBAC)"
type: "guide"
description: "Role-based access control (RBAC) allows you to create limited service accounts so that applications can access and interact with Sensu resources. Read this guide to create limited service accounts with Sensu RBAC."
weight: 65
version: "6.2"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-6.2:
    parent: control-access
---

[Role-based access control (RBAC)][1] allows you to exercise fine-grained control over access to and interaction with Sensu resources.
In some cases, you may want to allow an application or service to interact with Sensu resources.
Accounts that represent applications or services rather than individual human users are called limited service accounts.

For example, you might develop a service that displays a high-level view of your webserver statuses.
The service itself needs an account with permission to read the results of status checks executed on your webservers so it can route the check results to the status display.

Limited service accounts are also useful for performing automated processes.
This guide explains how to create a limited service account you can use with Sensu's [EC2 integration][3] to automatically remove AWS EC2 instances that are not in one of the specified states.

By default, Sensu includes a `default` namespace and an `admin` user with full permissions to create, modify, and delete resources within Sensu, including the RBAC resources required to configure a limited service account.
This guide requires a running Sensu backend and a sensuctl instance configured to connect to the backend as an [`admin` user][2].

## Create a limited service account

A limited service account requires these resources:

- A [user][7] assigned to a [group][8].
- A [role][4] with get, list, and delete permissions for resources within the `default` [namespace][9].
- A [role binding][5] that ties the role to the user's group.

{{% notice note %}}
**NOTE**: If you will use the service account to manage Sensu resources in more than one namespace, create a [cluster role][10] instead of a role.
To grant cluster-wide permissions, create a [cluster role binding][11] instead of a role binding.
{{% /notice %}}

1. Create a user with the username `ec2-service` and assign it to the group `ec2`:

   {{< code shell >}}
sensuctl user create ec2-service --password='password' --groups=ec2
{{< /code >}}

   This step creates the service account itself and the group that will have the required permissions.

2. Create a `ec2-delete` role with get, list, and delete permissions for all resources (`*`) within the `default` namespace:

   {{< code shell >}}
sensuctl role create ec2-delete --verb=get,list,delete --resource=* --namespace=default
{{< /code >}}

   This step creates the role that has the permissions your service account will need.

3. Create an `ec2-service-delete` role binding to assign the `ec2-delete` role to the `ec2` group:

   {{< code shell >}}
sensuctl role-binding create ec2-service-delete --role=ec2-delete --group=ec2
{{< /code >}}

   This steps creates the role binding that ties the correct permissions (via the `ec2-delete` role) with your service account (via the group `ec2`).

The `ec2-service` limited service account, with permission to get, list, and delete all resources within the `default` namespace, is now ready to use.

## Use the service account to remove AWS EC2 instances

TODO: Need help to understand how the limited service account concept applies to the EC2 integration

## Best practices for limited service accounts

- Restrict limited service account access to only the namespaces and role permissions they need to operate properly.
Adjust namespaces and permissions if needed by updating the role or cluster role that is tied to the service account.
- Use unique and specific names for limited service accounts.
Names should identify service accounts as well as the associated service.
- Promptly delete any unused limited service accounts to make sure they do not become a security risk.


[1]: ../rbac/
[2]: ../rbac#default-users
[3]: ../../../plugins/supported-integrations/aws-ec2/
[4]: ../rbac/#roles-and-cluster-roles
[5]: ../rbac/#role-bindings-and-cluster-role-bindings
[6]: ../rbac/#rule-attributes
[7]: ../rbac/#users
[8]: ../rbac/#groups
[9]: ../namespaces/
[10]: ../rbac/#cluster-role-example
[11]: ../rbac/#cluster-role-binding-example
