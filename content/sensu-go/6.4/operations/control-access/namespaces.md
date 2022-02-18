---
title: "Namespaces reference"
linkTitle: "Namespaces Reference"
reference_title: "Namespaces"
type: "reference"
description: "Namespaces partition resources within Sensu so that teams and projects can use Sensu's role-based access control (RBAC) to share a Sensu instance. Use namespaces with RBAC to authorize user access to Sensu resources. Read the reference doc to learn about namespaces."
weight: 75
version: "6.4"
product: "Sensu Go"
menu:
  sensu-go-6.4:
    parent: control-access
---

Namespaces partition resources within Sensu.
Sensu entities, checks, handlers, and other [namespaced resources][5] belong to a single namespace.

Namespaces help teams use different resources (like entities, checks, and handlers) within Sensu and impose their own controls on those resources.
A Sensu instance can have multiple namespaces, each with their own set of managed resources.
Resource names must be unique within a namespace but do not need to be unique across namespaces.

Namespace configuration applies to [sensuctl][2], the [API][6], and the [web UI][3].
To create and manage namespaces, [configure sensuctl][9] as the [default `admin` user][7] or create a [cluster role][8] with `namespaces` permissions.

## Namespace example

This example shows the resource definition for a `production` namespace.
You can use this example with [`sensuctl create`][10] to create a `production` namespace in your Sensu deployment:

{{< language-toggle >}}

{{< code yml >}}
---
type: Namespace
api_version: core/v2
metadata: {}
spec:
  name: production
{{< /code >}}

{{< code json >}}
{
  "type": "Namespace",
  "api_version": "core/v2",
  "metadata": {},
  "spec": {
    "name": "production"
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Best practices for namespaces

**Use namespaces for isolation, not organization**

Use namespaces to enforce full isolation of different groups of resources, not to organize resources.
An agent cannot belong to two namespaces or execute checks in two different namespaces.
To organize resources, use labels rather than multiple namespaces.

## Default namespaces

Every [Sensu backend][1] includes a `default` namespace.
All resources created without a specified namespace are created within the `default` namespace.

## Manage namespaces

You can use [sensuctl][2] to view, create, and delete namespaces.
To get help with managing namespaces with sensuctl:

{{< code shell >}}
sensuctl namespace help
{{< /code >}}

### View namespaces

Use [sensuctl][2] to view all namespaces within Sensu:

{{< code shell >}}
sensuctl namespace list
{{< /code >}}

{{% notice note %}}
**NOTE**: For users on supported Sensu Go distributions, `sensuctl namespace list` lists only the namespaces that the current user has access to.
{{% /notice %}}

### Create namespaces

Use [sensuctl][2] to create a namespace.
For example, the following command creates a namespace called `production`:

{{< code shell >}}
sensuctl namespace create production
{{< /code >}}

Namespace names can contain alphanumeric characters and hyphens and must begin and end with an alphanumeric character.

### Delete namespaces

To delete a namespace:

{{< code shell >}}
sensuctl namespace delete <namespace-name>
{{< /code >}}

Namespaces must be empty before you can delete them.
If the response to `sensuctl namespace delete` is `Error: resource is invalid: namespace is not empty`, the namespace may still contain events or other resources.
To remove all resources and events so that you can delete a namespace, run this command (replace `<namespace-name>` with the namespace you want to empty):

{{< code shell >}}
sensuctl dump entities,events,assets,checks,filters,handlers,secrets/v1.Secret --namespace <namespace-name> | sensuctl delete
{{< /code >}}

### Assign a resource to a namespace

You can assign a resource to a namespace in the resource definition.
Only resources that belong to a [namespaced resource type][5] (like checks, filters, and handlers) can be assigned to a namespace.

For example, to assign a check called `check-cpu` to the `production` namespace, include the `namespace` attribute in the check definition:

{{< language-toggle >}}

{{< code yml >}}
---
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
{{< /code >}}

{{< code json >}}
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
}
{{< /code >}}

{{< /language-toggle >}}

Read the [reference docs][4] for the corresponding [resource type][5] to create resource definitions.

{{% notice protip %}}
**PRO TIP**: If you omit the `namespace` attribute from resource definitions, you can use the `senusctl create --namespace` flag to specify the namespace for a group of resources at the time of creation.
This allows you to replicate resources across namespaces without manual editing.
Read the [sensuctl reference](../../../sensuctl/create-manage-resources/#create-resources-across-namespaces) for more information.
{{% /notice %}}

## Namespace specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the resource type. Namespaces should always be type `Namespace`.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: Namespace
{{< /code >}}
{{< code json >}}
{
  "type": "Namespace"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. The `api_version` should always be `core/v2`.
required     | true
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
description  | Top-level collection of metadata about the namespace. For namespaces, the metatdata should always be empty.
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata: {}
{{< /code >}}
{{< code json >}}
{
  "metadata": {}
}
{{< /code >}}
{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes the namespace's [spec attributes][11].
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  name: production
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "name": "production"
  }
}
{{< /code >}}
{{< /language-toggle >}}

### Spec attributes

name         | 
-------------|------ 
description  | Name of the namespace. Names can contain alphanumeric characters and hyphens and must begin and end with an alphanumeric character.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: production
{{< /code >}}
{{< code json >}}
{
  "name": "production"
}
{{< /code >}}
{{< /language-toggle >}}


[1]: ../../../observability-pipeline/observe-schedule/backend/
[2]: ../../../sensuctl/
[3]: ../../../web-ui/
[4]: ../../../reference/
[5]: ../rbac/#namespaced-resource-types
[6]: ../../../api/
[7]: ../rbac/#default-users
[8]: ../rbac/#roles-and-cluster-roles
[9]: ../../deploy-sensu/install-sensu/#install-sensuctl
[10]: ../../../sensuctl/create-manage-resources/#create-resources
[11]: #spec-attributes
