---
title: "Create limited service accounts with role-based access control"
linkTitle: "Create Limited Service Accounts"
guide_title: "Create limited service accounts with role-based access control"
type: "guide"
description: "Use Sensu's role-based access control (RBAC) to create limited service accounts so that applications can access and interact with Sensu resources."
weight: 40
version: "6.6"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-6.6:
    parent: control-access
---

In some cases, you may want to allow an application or service to interact with Sensu resources.
Use Sensu's [role-based access control (RBAC)][1] to create and configure accounts that represent applications or services rather than individual human users.
These limited service accounts give you fine-grained control of the access and permissions the application or service needs.

For example, you might develop a service that displays a high-level view of your webserver statuses based on an aggregate check.
The service itself only needs an API key and permission to read the results of checks executed on your webservers so it can route the check results to the status display.
No human user needs to log into the service, and the service does not need edit or delete permissions.
A limited service account can provide only the necessary access and permissions.

Limited service accounts are also useful for performing automated processes.
This guide explains how to create a limited service account to use with the [Sensu EC2 Handler][3] integration to automatically remove AWS EC2 instances that are not in a pending or running state.

By default, Sensu includes a `default` namespace and an `admin` user with full permissions to create, modify, and delete resources within Sensu, including the RBAC resources required to configure a limited service account.
This guide requires a running Sensu backend and a sensuctl instance configured to connect to the backend as the [`admin` user][2].

## Create a limited service account

A limited service account requires:

- A [user][7].
- A [role][4] with get, list, and delete permissions for resources within the `default` [namespace][9].
- A [role binding][5] that ties the role to the user.
- An [API key][12] for the user.

{{% notice note %}}
**NOTE**: To use a service account to manage Sensu resources in more than one namespace, create a [cluster role](../rbac/#cluster-role-example) instead of a role and a [cluster role binding](../rbac/#cluster-role-binding-example) instead of a role binding.
{{% /notice %}}

1. Create a user with the username `ec2-service` and a dynamically created random password:

   {{< code shell >}}
sensuctl user create ec2-service --password=$(head -c1M /dev/urandom | sha512sum | cut -d' ' -f1 | head -c 32)
{{< /code >}}

   This command creates the following user definition:
   {{< language-toggle >}}
{{< code yml >}}
---
type: User
api_version: core/v2
metadata:
  name: ec2-service
spec:
  disabled: false
  username: ec2-service
{{< /code >}}
{{< code json >}}
{
  "type": "User",
  "api_version": "core/v2",
  "metadata": {
    "name": "ec2-service"
  },
  "spec": {
    "disabled": false,
    "username": "ec2-service"
  }
}
{{< /code >}}
{{< /language-toggle >}}

2. Create a `ec2-delete` role with get, list, and delete permissions for entity resources within the `default` namespace:

   {{< code shell >}}
sensuctl role create ec2-delete --verb get,list,delete --resource entities --namespace default
{{< /code >}}

   This command creates the role that has the permissions your service account will need:
   {{< language-toggle >}}
{{< code yml >}}
---
type: Role
api_version: core/v2
metadata:
  name: ec2-delete
spec:
  rules:
  - resource_names: null
    resources:
    - entities
    verbs:
    - get
    - list
    - delete
{{< /code >}}
{{< code json >}}
{
  "type": "Role",
  "api_version": "core/v2",
  "metadata": {
    "name": "ec2-delete"
  },
  "spec": {
    "rules": [
      {
        "resource_names": null,
        "resources": [
          "entities"
        ],
        "verbs": [
          "get",
          "list",
          "delete"
        ]
      }
    ]
  }
}
{{< /code >}}
{{< /language-toggle >}}

3. Create an `ec2-service-delete` role binding to assign the `ec2-delete` role to the `ec2-service` user:

   {{< code shell >}}
sensuctl role-binding create ec2-service-delete --role ec2-delete --user ec2-service
{{< /code >}}

   This command creates the role binding that ties the correct permissions (via the `ec2-delete` role) with your service account (via the user `ec2-service`):
   {{< language-toggle >}}
{{< code yml >}}
---
type: RoleBinding
api_version: core/v2
metadata:
  name: ec2-service-delete
spec:
  role_ref:
    name: ec2-delete
    type: Role
  subjects:
  - name: ec2-service
    type: User
{{< /code >}}
{{< code json >}}
{
  "type": "RoleBinding",
  "api_version": "core/v2",
  "metadata": {
    "name": "ec2-service-delete"
  },
  "spec": {
    "role_ref": {
      "name": "ec2-delete",
      "type": "Role"
    },
    "subjects": [
      {
        "name": "ec2-service",
        "type": "User"
      }
    ]
  }
}
{{< /code >}}
{{< /language-toggle >}}

4. Create an API key for the `ec2-service` user:

   {{< code shell >}}
sensuctl api-key grant ec2-service
{{< /code >}}

   The response will include an API key that is assigned to the `ec2-service` user, which you will need to configure the EC2 handler.

The `ec2-service` limited service account is now ready to use with the [Sensu EC2 Handler][3] integration.

## Add the EC2 handler dynamic runtime asset

To power the handler to remove AWS EC2 instances, use sensuctl to add the [Sensu Go EC2 Handler][13] [dynamic runtime asset][14]:

{{< code shell >}}
sensuctl asset add sensu/sensu-ec2-handler:0.4.0
{{< /code >}}

The response will indicate that the asset was added:

{{< code text >}}
fetching bonsai asset: sensu/sensu-ec2-handler:0.4.0
added asset: sensu/sensu-ec2-handler:0.4.0

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["sensu/sensu-ec2-handler"].
{{< /code >}}

You can also download the dynamic runtime asset definition from [Bonsai][13] and register the asset with `sensuctl create --file filename.yml`.

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
Read [the asset reference](../../../plugins/assets#dynamic-runtime-asset-builds) for more information about dynamic runtime asset builds.
{{% /notice %}}

## Configure an EC2 handler for the service account

To configure the EC2 handler, you will need AWS account credentials and details for the AWS instance you want to manage, like the AWS instance ID.
You will also need the API key for the `ec2-service` user.

{{% notice note %}}
**NOTE**: Use [secrets management](../../manage-secrets/secrets-management/) to configure environment variables for your AWS access and secret keys and the `ec2-service` user's API key.
Do not expose this sensitive information by listing it directly in the handler definition.<br><br>
The [Sensu Go EC2 Handler's Bonsai page](https://bonsai.sensu.io/assets/sensu/sensu-ec2-handler#environment-variables) includes an example for configuring secrets definitions with Sensu's built-in [`env` secrets provider](../../manage-secrets/secrets-providers/#env-secrets-provider-example).
{{% /notice %}}

In the following code, replace these bracketed placeholders with valid values:

- `<AWS_REGION>`: the AWS region where your EC2 instance is located.
- `<AWS_INSTANCE_ID_LABEL>`: the Sensu entity label that contains the AWS instance ID.
If your AWS EC2 instance entities do not include labels that specify the instance ID, use the `aws-instance-id` attribute instead and enter the AWS instance ID itself as the value.
- `<http://localhost:8080>`: the Sensu API URL.

You can also adjust the `aws-allowed-instance-states` value to include any of the Sensu EC2 integration's [available states][10].
This example lists only "pending" and "running."

Then, run this command with your valid values in place to create the handler defintion:

{{< language-toggle >}}

{{< code text "YML" >}}
cat << EOF | sensuctl create
---
type: Handler
api_version: core/v2
metadata:
  name: sensu-ec2-handler
spec:
  type: pipe
  runtime_assets:
    - sensu/sensu-ec2-handler
  filters:
    - is_incident
    - not_silenced
  command: >-
    sensu-ec2-handler
    --aws-region <AWS_REGION>
    --aws-instance-id-label <AWS_INSTANCE_ID_LABEL>
    --aws-allowed-instance-states pending,running
    --sensu-api-url <http://localhost:8080>
  secrets:
    - name: AWS_ACCESS_KEY_ID
      secret: <YOUR_AWS_ACCESS_KEY_ID>
    - name: AWS_SECRET_KEY
      secret: <YOUR_AWS_SECRET_KEY>
    - name: SENSU_API_KEY
      secret: <YOUR_SENSU_API_KEY>
EOF
{{< /code >}}

{{< code text "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "sensu-ec2-handler"
  },
  "spec": {
    "type": "pipe",
    "runtime_assets": [
      "sensu/sensu-ec2-handler"
    ],
    "filters": [
      "is_incident",
      "not_silenced"
    ],
    "command": "sensu-ec2-handler --aws-region <AWS_REGION> --aws-instance-id-label AWS_INSTANCE_ID_LABEL --aws-allowed-instance-states pending,running --sensu-api-url <http://localhost:8080">,
    "secrets": [
      {
        "name": "AWS_ACCESS_KEY_ID",
        "secret": "<YOUR_AWS_ACCESS_KEY_ID>"
      },
      {
        "name": "AWS_SECRET_KEY",
        "secret": "<YOUR_AWS_SECRET_KEY>"
      },
      {
        "name": "SENSU_API_KEY",
        "secret": "<YOUR_SENSU_API_KEY>"
      }
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

The handler will use the provided AWS credentials to check the specified EC2 instance.
If the instance's status is not "pending" or "running," the handler will use the `ec2-service` user's API key to remove the corresponding entity.

{{% notice note %}}
**NOTE**: Instead of directly referencing your `AWS_ACCESS_KEY_ID`, `AWS_SECRET_KEY`, and `SENSU_API_KEY` as shown in the `sensu-ec2-handler` example handler definition above, use [secrets management](../../manage-secrets/secrets-management/) to configure these values as environment variables.
{{% /notice %}}

## Best practices for limited service accounts

Follow these best practices for creating and managing limited service accounts:

- Use unique and specific names for limited service accounts.
Names should identify the accounts as limited service accounts as well as the associated services.
- Restrict limited service account access to only the namespaces and role permissions they need to operate properly.
Adjust namespaces and permissions if needed by updating the role or cluster role that is tied to the service account.
- Promptly delete unused limited service accounts to make sure they do not become security risks.


[1]: ../rbac/
[2]: ../rbac#default-users
[3]: ../../../plugins/supported-integrations/aws-ec2/
[4]: ../rbac/#roles-and-cluster-roles
[5]: ../rbac/#role-bindings-and-cluster-role-bindings
[6]: ../rbac/#rule-attributes
[7]: ../rbac/#users
[8]: ../rbac/#groups
[9]: ../namespaces/
[10]: https://bonsai.sensu.io/assets/sensu/sensu-ec2-handler#ec2-instance-states
[12]: ../../../api/#authenticate-with-an-api-key
[13]: https://bonsai.sensu.io/assets/sensu/sensu-ec2-handler
[14]: ../../../plugins/assets/
