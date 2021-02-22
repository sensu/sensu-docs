---
title: "Create limited service accounts with role-based access control (RBAC)"
linkTitle: "Create Limited Service Accounts"
guide_title: "Create limited service accounts with role-based access control (RBAC)"
type: "guide"
description: "Role-based access control (RBAC) allows you to exercise fine-grained control over how service accounts interact with Sensu resources. Read this guide to create limited service accounts with Sensu RBAC."
weight: 65
version: "6.2"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-6.2:
    parent: control-access
---

[Role-based access control (RBAC)][1] allows you to exercise fine-grained control over how different users interact with Sensu resources.
RBAC allows you to create a service account whose access is limited to the namespaces and role permissions it needs to operate properly.

By default, Sensu includes a `default` namespace and an `admin` user with full permissions to create, modify, and delete resources within Sensu, including RBAC resources like users and roles.
This guide requires a running Sensu backend and a sensuctl instance configured to connect to the backend as an [`admin` user][2].

Follow the steps below to create a limited service account that you can use with Sensu's [EC2 integration][3] to remove AWS EC2 instances that are not in one of the specified states.

## Create a service account

First, create a service account user and assign it get, list, and delete permissions for resources within the `default` namespace using a [role][4] and a [role binding][5].

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

Now you have created the `ec2-service` limited service account with permission to get, list, and delete all resources within the `default` namespace.

You can use the `sensuctl user`, `sensuctl role`, and `sensuctl role-binding` commands to manage your RBAC configuration.

## Use the service account to remove AWS EC2 instances


## Next steps

Now that you know how to create a user, a role, and a role binding to assign a role to a user, check out the [RBAC reference][1] for in-depth documentation on role-based access control, examples, and information about cluster-wide permissions.


[1]: ../rbac/
[2]: ../rbac#default-users
[3]: ../../../plugins/supported-integrations/aws-ec2/
[4]: ../rbac/#roles-and-cluster-roles
[5]: ../rbac/#role-bindings-and-cluster-role-bindings
