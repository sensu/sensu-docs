---
title: "Create, delete, update, and export resources with sensuctl"
linkTitle: "Create and Manage Resources"
description: "Sensuctl is a command line tool for managing resources within Sensu. It works by calling Sensu’s underlying API to create, read, update, and delete resources, events, and entities. Read this reference doc to learn about sensuctl."
weight: 20
version: "5.19"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.19:
    parent: sensuctl-access
---

- [Create resources](#create-resources)
- [Delete resources](#delete-resources)
- [Update resources](#update-resources)
- [Export resources](#export-resources)

## Create resources

The `sensuctl create` command allows you to create or update resources by reading from STDIN or a flag configured file (`-f`).
The `create` command accepts Sensu resource definitions in `wrapped-json` and `yaml`.
Both JSON and YAML resource definitions wrap the contents of the resource in `spec` and identify the resource `type`.
See the [`wrapped-json`example][39] and [this table][3] for a list of supported types.
See the [reference docs][6] for information about creating resource definitions.

### `wrapped-json` format

In this example, the file `my-resources.json` specifies two resources: a `marketing-site` check and a `slack` handler, separated _without_ a comma:

{{< highlight shell >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata" : {
    "name": "marketing-site",
    "namespace": "default"
    },
  "spec": {
    "command": "check-http.rb -u https://sensu.io",
    "subscriptions": ["demo"],
    "interval": 15,
    "handlers": ["slack"]
  }
}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "slack",
    "namespace": "default"
  },
  "spec": {
    "command": "sensu-slack-handler --channel '#monitoring'",
    "env_vars": [
      "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
    ],
    "filters": [
      "is_incident",
      "not_silenced"
    ],
    "handlers": [],
    "runtime_assets": [],
    "timeout": 0,
    "type": "pipe"
  }
}
{{< /highlight >}}

To create all resources from `my-resources.json` using `sensuctl create`:

{{< highlight shell >}}
sensuctl create --file my-resources.json
{{< /highlight >}}

Or:

{{< highlight shell >}}
cat my-resources.json | sensuctl create
{{< /highlight >}}

### `yaml` format

In this example, the file `my-resources.yml` specifies two resources: a `marketing-site` check and a `slack` handler, separated with three dashes (`---`).

{{< highlight yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: marketing-site
  namespace: default
spec:
  command: check-http.rb -u https://sensu.io
  subscriptions:
  - demo
  interval: 15
  handlers:
  - slack
---
type: Handler
api_version: core/v2
metadata:
  name: slack
  namespace: default
spec:
  command: sensu-slack-handler --channel '#monitoring'
  env_vars:
  - SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
  filters:
  - is_incident
  - not_silenced
  type: pipe
{{< /highlight >}}

To create all resources from `my-resources.yml` using `sensuctl create`:

{{< highlight shell >}}
sensuctl create --file my-resources.yml
{{< /highlight >}}

Or:

{{< highlight shell >}}
cat my-resources.yml | sensuctl create
{{< /highlight >}}

### sensuctl create resource types

|sensuctl create types |   |   |   |
--------------------|---|---|---|
`AdhocRequest` | `adhoc_request` | `Asset` | `asset`
`CheckConfig` | `check_config` | `ClusterRole`  | `cluster_role`
`ClusterRoleBinding`  | `cluster_role_binding` | `Entity` | [`Env`][43]
`entity` | [`EtcdReplicators`][35] | `Event` | `event`
`EventFilter` | `event_filter` | `Handler` | `handler`
`Hook` | `hook` | `HookConfig` | `hook_config`
`Mutator` | `mutator` | `Namespace` | `namespace`
`Role` | `role` | `RoleBinding` | `role_binding`
[`Secret`][41] | `Silenced` | `silenced` | [`VaultProvider`][43]
[`ldap`][26] | [`ad`][42] | [`TessenConfig`][27] | [`PostgresConfig`][32] |

### Create resources across namespaces

If you omit the `namespace` attribute from resource definitions, you can use the `senusctl create --namespace` flag to specify the namespace for a group of resources at the time of creation.
This allows you to replicate resources across namespaces without manual editing.
To learn more about namespaces and namespaced resource types, see the [RBAC reference][21].

The `sensuctl create` command applies namespaces to resources in the following order, from highest precedence to lowest:

1. **Namespaces specified within resource definitions**: You can specify a resource's namespace within individual resource definitions using the `namespace` attribute. Namespaces specified in resource definitions take precedence over all other methods.
2. **`--namespace` flag**: If resource definitions do not specify a namespace, Sensu applies the namespace provided by the `sensuctl create --namespace` flag.
3. **Current sensuctl namespace configuration**: If you do not specify an embedded `namespace` attribute or use the `--namespace` flag, Sensu applies the namespace configured in the current sensuctl session. See [Manage sensuctl][31] to view your current session config and set the session namespace.

In this example, the file `pagerduty.yml` defines a handler _without_ a `namespace` attribute:

{{< highlight shell >}}
type: Handler
api_version: core/v2
metadata:
  name: pagerduty
spec:
  command: sensu-pagerduty-handler
  env_vars:
  - PAGERDUTY_TOKEN=SECRET
  type: pipe
{{< /highlight >}}

To create the `pagerduty` handler in the `default` namespace:

{{< highlight shell >}}
sensuctl create --file pagerduty.yml --namespace default
{{< /highlight >}}

To create the `pagerduty` handler in the `production` namespace:

{{< highlight shell >}}
sensuctl create --file pagerduty.yml --namespace production
{{< /highlight >}}

To create the `pagerduty` handler in the current session namespace:

{{< highlight shell >}}
sensuctl create --file pagerduty.yml
{{< /highlight >}}

## Delete resources

The `sensuctl delete` command allows you to delete resources by reading from STDIN or a flag configured file (`-f`).
The `delete` command accepts Sensu resource definitions in `wrapped-json` and `yaml` formats and uses the same [resource types][3] as `sensuctl create`.
To be deleted successfully, resources provided to the `delete` command must match the name and namespace of an existing resource.

To delete all resources from `my-resources.yml` with `sensuctl delete`:

{{< highlight shell >}}
sensuctl delete --file my-resources.yml
{{< /highlight >}}

Or:

{{< highlight shell >}}
cat my-resources.yml | sensuctl delete
{{< /highlight >}}

### Delete resources across namespaces

If you omit the `namespace` attribute from resource definitions, you can use the `senusctl delete --namespace` flag to specify the namespace for a group of resources at the time of deletion.
This allows you to remove resources across namespaces without manual editing.
See the [Create resources across namespaces][33] section for usage examples.

## Update resources

Sensuctl allows you to update resource definitions with a text editor.
To use `sensuctl edit`, specify the resource [type][24] and resource name.

For example, to edit a handler named `slack` with `sensuctl edit`:

{{< highlight shell >}}
sensuctl edit handler slack
{{< /highlight >}}

### sensuctl edit resource types

|sensuctl edit types |   |   |   |
--------------------|---|---|---|
`asset` | `check` | `cluster` | `cluster-role`
`cluster-role-binding` | `entity` | `event` | `filter`
`handler` | `hook` | `mutator` | `namespace`
`role` | `role-binding` | `silenced` | `user`
[`auth`][26] | | |

## Export resources

The `sensuctl dump` command allows you to export your resources to standard out or to a file.
You can export all of your resources or a subset of them based on a list of resource types.
The `dump` command supports exporting in `wrapped-json` and `yaml`.

{{% notice note %}}
**NOTE**: Passwords are not included when exporting users. You must add the `password` attribute to any exported user resources before they can be used with `sensuctl create`.
{{% /notice %}}

To export all resources to a file named `my-resources.yaml` in `yaml` format:

{{< highlight shell >}}
sensuctl dump all --format yaml --file my-resources.yaml
{{< /highlight >}}

To export only checks to standard out in `yaml` format:

{{< highlight shell >}}
sensuctl dump check --format yaml
{{< /highlight >}}

To export only handlers and filters to a file named `my-handlers-and-filters.yaml` in `yaml` format:

{{< highlight shell >}}
sensuctl dump handler,filter --format yaml --file my-handlers-and-filters.yaml
{{< /highlight >}}

### sensuctl dump resource types

You can use the sensuctl `--types` subcommand to list the types of supported resources:

{{< highlight shell >}}
sensuctl dump --types
{{< /highlight >}}

The table below lists supported `sensuctl dump` resource types.

{{% notice note %}}
**NOTE**: The resource types with no synonym listed are [commercial features](../../getting-started/enterprise/).
{{% /notice %}}

Synonym | Fully qualified name 
--------------------|---
None | `authentication/v2.Provider`
None | `licensing/v2.LicenseFile`
None | `store/v1.PostgresConfig`
None | `federation/v1.Replicator`
None | `secrets/v1.Provider`
None | `secrets/v1.Secret`
`assets` | `core/v2.Asset`
`checks` | `core/v2.CheckConfig`
`clusterroles` | `core/v2.ClusterRole`
`clusterrolebindings` | `core/v2.ClusterRoleBinding`
`entities` | `core/v2.Entity`
`events` | `core/v2.Event` 
`filters` | `core/v2.EventFilter`
`handlers` | `core/v2.Handler`
`hooks` | `core/v2.Hook`
`mutators` | `core/v2.Mutator`
`namespaces` | `core/v2.Namespace`
`roles` | `core/v2.Role`
`rolebindings` | `core/v2.RoleBinding`
`silenced` | `core/v2.Silenced`
`tessen` | `core/v2.TessenConfig`
`users` | `core/v2.User`



[1]: ../../reference/rbac/
[2]: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
[3]: #sensuctl-create-resource-types
[4]: ../../installation/install-sensu/#install-sensuctl
[5]: ../../reference/agent/#general-configuration-flags
[6]: ../../reference/
[7]: ../../guides/clustering/
[8]: #create-resources
[9]: #sensu-backend-url
[10]: #preferred-output-format
[11]: #username-password-and-namespace
[12]: ../../reference/assets/
[13]: ../../reference/checks/
[14]: ../../reference/entities/
[15]: ../../reference/events/
[16]: ../../reference/filters/
[17]: ../../reference/handlers/
[18]: ../../reference/hooks/
[19]: ../../reference/mutators/
[20]: ../../reference/silencing/
[21]: ../../reference/rbac#namespaces
[22]: ../../reference/rbac#users
[23]: #subcommands
[24]: #sensuctl-edit-resource-types
[25]: ../../api/overview/
[26]: ../../installation/auth/#ldap-authentication
[27]: ../../reference/tessen/
[28]: ../../api/overview#response-filtering
[29]: ../../api/overview#field-selector
[30]: ../../getting-started/enterprise/
[31]: #manage-sensuctl
[32]: ../../reference/datastore/
[33]: #create-resources-across-namespaces
[34]: https://bonsai.sensu.io/
[35]: ../../reference/etcdreplicators/
[36]: /images/sensu-influxdb-handler-namespace.png
[37]: https://bonsai.sensu.io/assets/portertech/sensu-ec2-discovery
[39]: #wrapped-json-format
[40]: ../../installation/install-sensu/#install-the-sensu-backend
[41]: ../../reference/secrets/
[42]: ../../installation/auth/#ad-authentication
[43]: ../../reference/secrets-providers/
[44]: ../../installation/auth#use-built-in-basic-authentication
[45]: ../../installation/install-sensu/#2-configure-and-start
[46]: #first-time-setup
[47]: ../../api/overview/#operators
[48]: #sensuctl-prune-resource-types
