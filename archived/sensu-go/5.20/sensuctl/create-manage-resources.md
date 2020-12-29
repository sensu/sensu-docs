---
title: "Create and manage resources with sensuctl"
linkTitle: "Create and Manage Resources"
description: "Use the sensuctl command line tool to create and manage resources within Sensu. Read this reference doc to learn how to use sensuctl."
weight: 10
version: "5.20"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.20:
    parent: sensuctl
---

Use the sensuctl command line tool to create and manage resources within Sensu.
Sensuctl works by calling Sensu’s underlying API to create, read, update, and delete resources, events, and entities.

## Create resources

The `sensuctl create` command allows you to create or update resources by reading from STDIN or a [flag][36] configured file (`-f`).
The `create` command accepts Sensu resource definitions in `wrapped-json` and `yaml`.
Both JSON and YAML resource definitions wrap the contents of the resource in `spec` and identify the resource `type`.
See the [`wrapped-json`example][9] and [this table][3] for a list of supported types.
See the [reference docs][6] for information about creating resource definitions.

### `wrapped-json` format

In this example, the file `my-resources.json` specifies two resources: a `marketing-site` check and a `slack` handler, separated _without_ a comma:

{{< code shell >}}
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
{{< /code >}}

To create all resources from `my-resources.json` using `sensuctl create`:

{{< code shell >}}
sensuctl create --file my-resources.json
{{< /code >}}

Or:

{{< code shell >}}
cat my-resources.json | sensuctl create
{{< /code >}}

### `yaml` format

In this example, the file `my-resources.yml` specifies two resources: a `marketing-site` check and a `slack` handler, separated with three dashes (`---`).

{{< code yml >}}
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
{{< /code >}}

To create all resources from `my-resources.yml` using `sensuctl create`:

{{< code shell >}}
sensuctl create --file my-resources.yml
{{< /code >}}

Or:

{{< code shell >}}
cat my-resources.yml | sensuctl create
{{< /code >}}

### sensuctl create flags

Run `sensuctl create -h` to view command-specific and global flags.
The following table describes the command-specific flags.

| Flag | Function and important notes
| ---- | ----------------------------
`-f` or `--file` | Files, URLs, or directories to create resources from. Strings.
`-h` or `--help` | Help for the create command.
`-r` or `--recursive` | Create command will follow subdirectories.

### sensuctl create resource types

|sensuctl create types |   |   |   |
--------------------|---|---|---|
`AdhocRequest` | `adhoc_request` | `Asset` | `asset`
`CheckConfig` | `check_config` | `ClusterRole`  | `cluster_role`
`ClusterRoleBinding`  | `cluster_role_binding` | `Entity` | [`Env`][24]
`entity` | [`EtcdReplicators`][29] | `Event` | `event`
`EventFilter` | `event_filter` | [`GlobalConfig`][11] | `Handler` 
`handler` | `Hook` | `hook` | `HookConfig`
`hook_config` | `Mutator` | `mutator` | `Namespace`
`namespace` | `Role` | `role` | `RoleBinding`
`role_binding` | [`Secret`][28] | `Silenced` | `silenced`
[`User`][8] | `user` | [`VaultProvider`][24] | [`ldap`][26]
[`ad`][25] | [`oidc`][37] | [`TessenConfig`][27] | [`PostgresConfig`][32]

### Create resources across namespaces

If you omit the `namespace` attribute from resource definitions, you can use the `senusctl create --namespace` flag to specify the namespace for a group of resources at the time of creation.
This allows you to replicate resources across namespaces without manual editing.
To learn more about namespaces and namespaced resource types, see the [RBAC reference][21].

The `sensuctl create` command applies namespaces to resources in the following order, from highest precedence to lowest:

1. **Namespaces specified within resource definitions**: You can specify a resource's namespace within individual resource definitions using the `namespace` attribute. Namespaces specified in resource definitions take precedence over all other methods.
2. **`--namespace` flag**: If resource definitions do not specify a namespace, Sensu applies the namespace provided by the `sensuctl create --namespace` flag.
3. **Current sensuctl namespace configuration**: If you do not specify an embedded `namespace` attribute or use the `--namespace` flag, Sensu applies the namespace configured in the current sensuctl session. See [Manage sensuctl][31] to view your current session config and set the session namespace.

In this example, the file `pagerduty.yml` defines a handler _without_ a `namespace` attribute:

{{< code shell >}}
type: Handler
api_version: core/v2
metadata:
  name: pagerduty
spec:
  command: sensu-pagerduty-handler
  env_vars:
  - PAGERDUTY_TOKEN=SECRET
  type: pipe
{{< /code >}}

To create the `pagerduty` handler in the `default` namespace:

{{< code shell >}}
sensuctl create --file pagerduty.yml --namespace default
{{< /code >}}

To create the `pagerduty` handler in the `production` namespace:

{{< code shell >}}
sensuctl create --file pagerduty.yml --namespace production
{{< /code >}}

To create the `pagerduty` handler in the current session namespace:

{{< code shell >}}
sensuctl create --file pagerduty.yml
{{< /code >}}

## Delete resources

The `sensuctl delete` command allows you to delete resources by reading from STDIN or a flag configured file (`-f`).
The `delete` command accepts Sensu resource definitions in `wrapped-json` and `yaml` formats and uses the same [resource types][3] as `sensuctl create`.
To be deleted successfully, resources provided to the `delete` command must match the name and namespace of an existing resource.

To delete all resources from `my-resources.yml` with `sensuctl delete`:

{{< code shell >}}
sensuctl delete --file my-resources.yml
{{< /code >}}

Or:

{{< code shell >}}
cat my-resources.yml | sensuctl delete
{{< /code >}}

### Delete resources across namespaces

If you omit the `namespace` attribute from resource definitions, you can use the `senusctl delete --namespace` flag to specify the namespace for a group of resources at the time of deletion.
This allows you to remove resources across namespaces without manual editing.
See the [Create resources across namespaces][33] section for usage examples.

## Update resources

Sensuctl allows you to update resource definitions with a text editor.
To use `sensuctl edit`, specify the resource [type][5] and resource name.

For example, to edit a handler named `slack` with `sensuctl edit`:

{{< code shell >}}
sensuctl edit handler slack
{{< /code >}}

### sensuctl edit resource types

|sensuctl edit types |   |   |   |
--------------------|---|---|---|
`asset` | `check` | `cluster` | `cluster-role`
`cluster-role-binding` | `entity` | `event` | `filter`
`handler` | `hook` | `mutator` | `namespace`
`role` | `role-binding` | `silenced` | `user`
[`auth`][26] | | |
 
## Manage resources

Sensuctl provides the following commands to manage Sensu resources.

- [`sensuctl asset`][12]
- [`sensuctl auth`][26] (commercial feature)
- [`sensuctl check`][13]
- [`sensuctl cluster`][7]
- [`sensuctl cluster-role`][1]
- [`sensuctl cluster-role-binding`][1]
- [`sensuctl entity`][14]
- [`sensuctl event`][15]
- [`sensuctl filter`][16]
- [`sensuctl handler`][17]
- [`sensuctl hook`][18]
- [`sensuctl license`][34] (commercial feature)
- [`sensuctl mutator`][19]
- [`sensuctl namespace`][1]
- [`sensuctl role`][1]
- [`sensuctl role-binding`][1]
- [`sensuctl secrets`][28]
- [`sensuctl silenced`][20]
- [`sensuctl tessen`][27]
- [`sensuctl user`][1]

## Subcommands

Sensuctl provides a standard set of list, info, and delete operations for most resource types.

{{< code shell >}}
list                       list resources
info NAME                  show detailed resource information given resource name
delete NAME                delete resource given resource name
{{< /code >}}

For example, to list all monitoring checks:

{{< code shell >}}
sensuctl check list
{{< /code >}}

To list checks from all namespaces:

{{< code shell >}}
sensuctl check list --all-namespaces
{{< /code >}}

To write all checks to `my-resources.json` in `wrapped-json` format:

{{< code shell >}}
sensuctl check list --format wrapped-json > my-resources.json
{{< /code >}}

To see the definition for a check named `check-cpu` in [`wrapped-json` format][4]:

{{< code shell >}}
sensuctl check info check-cpu --format wrapped-json
{{< /code >}}

In addition to the standard operations, commands may support subcommands or flags that allow you to take special action based on the resource type.
The sections below describe these resource-specific operations.

For a list of subcommands specific to a resource, run `sensuctl TYPE --help`.

#### Handle large datasets

When querying sensuctl for large datasets, use the `--chunk-size` flag with any `list` command to avoid timeouts and improve performance.

For example, the following command returns the same output as `sensuctl event list` but makes multiple API queries (each for the number of objects specified by `--chunk-size`) instead of one API query for the complete dataset:

{{< code shell >}}
sensuctl event list --chunk-size 500
{{< /code >}}

#### sensuctl check

In addition to the [standard subcommands][23], the `sensuctl check execute` command executes a check on demand, given the check name:

{{< code shell >}}
sensuctl check execute NAME
{{< /code >}}

For example, the following command executes the `check-cpu` check with an attached message:

{{< code shell >}}
sensuctl check execute check-cpu --reason "giving a sensuctl demo"
{{< /code >}}

You can also use the `--subscriptions` flag to override the subscriptions in the check definition:

{{< code shell >}}
sensuctl check execute check-cpu --subscriptions demo,webserver
{{< /code >}}

#### sensuctl cluster

The `sensuctl cluster` command lets you manage a Sensu cluster using the following subcommands:

{{< code shell >}}
health           get Sensu health status
id               get unique Sensu cluster ID
member-add       add cluster member to an existing cluster, with comma-separated peer addresses
member-list      list cluster members
member-remove    remove cluster member by ID
member-update    update cluster member by ID with comma-separated peer addresses
{{< /code >}}

To view cluster members:

{{< code shell >}}
sensuctl cluster member-list
{{< /code >}}

To see the health of your Sensu cluster:

{{< code shell >}}
sensuctl cluster health
{{< /code >}}

#### sensuctl event

In addition to the [standard subcommands][23], you can use `sensuctl event resolve` to manually resolve events:

{{< code shell >}}
sensuctl event resolve ENTITY CHECK
{{< /code >}}

For example, the following command manually resolves an event created by the entity `webserver1` and the check `check-http`:

{{< code shell >}}
sensuctl event resolve webserver1 check-http
{{< /code >}}

#### sensuctl namespace

See the [RBAC reference][21] for information about using access control with namespaces.

#### sensuctl user

See the [RBAC reference][22] for information about local user management with sensuctl.

#### sensuctl prune

{{% notice important %}}
**IMPORTANT**: `sensuctl prune` is an alpha feature in release 5.19.0 and may include breaking changes.
{{% /notice %}}

**COMMERCIAL FEATURE**: Access sensuctl pruning in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][30].

The `sensuctl prune` subcommand allows you to delete resources that do not appear in a given set of Sensu objects (called a "configuration") from a from a file, URL, or STDIN.
For example, you can use `sensuctl create` to to apply a new configuration, then use `sensuctl prune` to prune unneeded resources, resources that were created by a specific user or that include a specific label selector, and more.

{{% notice note %}}
**NOTE**: `sensuctl prune` can only delete resources that have the label `sensu.io/managed_by: sensuctl`, which Sensu automatically adds to all resources created with sensuctl.
This means you can only use `sensuctl prune` to delete resources that were created with sensuctl.
{{% /notice %}}

The pruning operation always follows the role-based access control (RBAC) permissions of the current user.
For example, to prune resources in the `dev` namespace, the current user who sends the prune command must have delete access to the `dev` namespace.
In addition, pruning requires [cluster-level privileges][35], even when all resources belong to the same namespace.

##### sensuctl prune usage

{{< code shell >}}
sensuctl prune [RESOURCE TYPE],[RESOURCE TYPE]... -f [FILE or URL] [-r] ... ] [--NAMESPACE] [flags]
{{< /code >}}

In this example `sensuctl prune` command:

- Replace [RESOURCE TYPE] with the [fully qualified name or short name][10] of the resource you want to prune.
You must specify at least one resource type or the `all` qualifier (to prune all resource types).
- Replace [FILE or URL] with the name of the file or the URL that contains the set of Sensu objects you want to keep (the configuration).
- Replace [flags] with the flags you want to use, if any.
- Replace [--NAMESPACE] with the namespace where you want to apply pruning.
If you omit the namespace qualifier, the command defaults to the current configured namespace.

Use a comma separator to prune more than one resource in a single command.

For example, to prune checks and assets from the file `checks.yaml` for the `dev` namespace and the `admin` and `ops` users:

{{< code shell >}}
sensuctl prune core/v2.CheckConfig,core/v2.Asset --file checks.yaml --namespace dev --users admin,ops

sensuctl prune checks,assets --file checks.yaml --namespace dev --users admin,ops
{{< /code >}}

##### sensuctl prune flags

Run `sensuctl prune -h` to view command-specific and global flags.
The following table describes the command-specific flags.

| Flag | Function and important notes
| ---- | ----------------------------
`-a` or `--all-users` | Prunes resources created by all users. Mutually exclusive with the `--users` flag. Defaults to false.
`-c` or `--cluster-wide` | Prunes any cluster-wide (non-namespaced) resources that are not defined in the configuration. Defaults to false.
`-d` or `--dry-run` | Prints the resources that will be pruned but does not actually delete them. Defaults to false.
`-f` or `--file` | Files, URLs, or directories to prune resources from. Strings.
`-h` or `--help` | Help for the prune command.
`--label-selector` | Prunes only resources that match the specified labels (comma-separated strings). Labels are a [commercial feature][30].
`-r` or `--recursive` | Prune command will follow subdirectories.
`-u` or `--users` | Prunes only resources that were created by the specified users (comma-separated strings). Defaults to the currently configured sensuctl user.

##### Supported resource types

Use `sensuctl describe-type all` to retrieve the list of supported `sensuctl prune` resource types.

{{% notice note %}}
**NOTE**: Short names are only supported for `core/v2` resources.
{{% /notice %}}

{{< code shell >}}
sensuctl describe-type all

      Fully Qualified Name           Short Name           API Version             Type          Namespaced  
 ────────────────────────────── ───────────────────── ─────────────────── ──────────────────── ──────────── 
  authentication/v2.Provider                           authentication/v2   Provider             false
  licensing/v2.LicenseFile                             licensing/v2        LicenseFile          false
  store/v1.PostgresConfig                              store/v1            PostgresConfig       false
  federation/v1.EtcdReplicator                         federation/v1       EtcdReplicator       false
  secrets/v1.Secret                                    secrets/v1          Secret               true
  secrets/v1.Provider                                  secrets/v1          Provider             false
  searches/v1.Search                                   searches/v1         Search               true
  web/v1.GlobalConfig                                  web/v1              GlobalConfig         false
  core/v2.Namespace              namespaces            core/v2             Namespace            false
  core/v2.ClusterRole            clusterroles          core/v2             ClusterRole          false
  core/v2.ClusterRoleBinding     clusterrolebindings   core/v2             ClusterRoleBinding   false
  core/v2.User                   users                 core/v2             User                 false
  core/v2.APIKey                 apikeys               core/v2             APIKey               false
  core/v2.TessenConfig           tessen                core/v2             TessenConfig         false
  core/v2.Asset                  assets                core/v2             Asset                true
  core/v2.CheckConfig            checks                core/v2             CheckConfig          true
  core/v2.Entity                 entities              core/v2             Entity               true
  core/v2.Event                  events                core/v2             Event                true
  core/v2.EventFilter            filters               core/v2             EventFilter          true
  core/v2.Handler                handlers              core/v2             Handler              true
  core/v2.Hook                   hooks                 core/v2             Hook                 true
  core/v2.Mutator                mutators              core/v2             Mutator              true
  core/v2.Role                   roles                 core/v2             Role                 true
  core/v2.RoleBinding            rolebindings          core/v2             RoleBinding          true
  core/v2.Silenced               silenced              core/v2             Silenced             true  
{{< /code >}}

##### sensuctl prune examples

`sensuctl prune` supports pruning resources by their fully qualified names or short names:

{{< code shell >}}
sensuctl prune core/v2.CheckConfig,core/v2.Entity

sensuctl prune checks,entities
{{< /code >}}

Use the `all` qualifier to prune all supported resources:

{{< code shell >}}
sensuctl prune all
{{< /code >}}

## Time formats

Sensuctl supports multiple time formats depending on the manipulated resource.
Supported canonical time zone IDs are defined in the [tz database][2].

{{% notice warning %}}
**WARNING**: Windows does not support canonical zone IDs (for example, `America/Vancouver`).
{{% /notice %}}

### Dates with time

Use full dates with time to specify an exact point in time.
This is useful for setting silences, for example.

Sensuctl supports the following formats:

* RFC3339 with numeric zone offset: `2018-05-10T07:04:00-08:00` or
  `2018-05-10T15:04:00Z`
* RFC3339 with space delimiters and numeric zone offset: `2018-05-10 07:04:00
  -08:00`
* Sensu alpha legacy format with canonical zone ID: `May 10 2018 7:04AM
  America/Vancouver`


[1]: ../../reference/rbac/
[2]: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
[3]: #sensuctl-create-resource-types
[4]: ../#preferred-output-format
[5]: #sensuctl-edit-resource-types
[6]: ../../reference/
[7]: ../../operations/deploy-sensu/cluster-sensu/
[8]: ../../reference/rbac/#user-specification
[9]: #wrapped-json-format
[10]: #supported-resource-types
[11]: ../../reference/webconfig/
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
[24]: ../../reference/secrets-providers/
[25]: ../../operations/control-access/ad-auth/
[26]: ../../operations/control-access/ldap-auth/
[27]: ../../reference/tessen/
[28]: ../../reference/secrets/
[29]: ../../reference/etcdreplicators/
[30]: ../../commercial/
[31]: ../#manage-sensuctl
[32]: ../../reference/datastore/
[33]: #create-resources-across-namespaces
[34]: ../../reference/license/
[35]: ../../reference/rbac/#cluster-roles
[36]: #sensuctl-create-flags
[37]: ../../operations/control-access/oidc-auth/
