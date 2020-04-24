---
title: "Manage resources with sensuctl commands and subcommands"
linkTitle: "Commands and Subcommands"
description: "Sensuctl is a command line tool for managing resources within Sensu. It works by calling Sensu’s underlying API to create, read, update, and delete resources, events, and entities. Read this reference doc to learn about sensuctl."
weight: 30
version: "5.19"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.19:
    parent: sensuctl-access
---


- [sensuctl check](#sensuctl-check)
- [sensuctl cluster](#sensuctl-cluster)
- [sensuctl event](#sensuctl-event)
- [sensuctl namespace](#sensuctl-namespace)
- [sensuctl user](#sensuctl-user)
- [sensuctl prune](#sensuctl-prune) (alpha feature)

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
- [`sensuctl license`](../../reference/license) (commercial feature)
- [`sensuctl mutator`][19]
- [`sensuctl namespace`][1]
- [`sensuctl role`][1]
- [`sensuctl role-binding`][1]
- [`sensuctl secrets`][41]
- [`sensuctl silenced`][20]
- [`sensuctl tessen`][27]
- [`sensuctl user`][1]

Sensuctl provides a standard set of list, info, and delete operations for most resource types.

{{< highlight shell >}}
list                       list resources
info NAME                  show detailed resource information given resource name
delete NAME                delete resource given resource name
{{< /highlight >}}

For example, to list all monitoring checks:

{{< highlight shell >}}
sensuctl check list
{{< /highlight >}}

To list checks from all namespaces:

{{< highlight shell >}}
sensuctl check list --all-namespaces
{{< /highlight >}}

To write all checks to `my-resources.json` in `wrapped-json` format:

{{< highlight shell >}}
sensuctl check list --format wrapped-json > my-resources.json
{{< /highlight >}}

To see the definition for a check named `check-cpu` in [`wrapped-json` format][10]:

{{< highlight shell >}}
sensuctl check info check-cpu --format wrapped-json
{{< /highlight >}}

In addition to the standard operations, commands may support subcommands or flags that allow you to take special action based on the resource type.
The sections below describe these resource-specific operations.

For a list of subcommands specific to a resource, run `sensuctl TYPE --help`.

## Handle large datasets

When querying sensuctl for large datasets, use the `--chunk-size` flag with any `list` command to avoid timeouts and improve performance.

For example, the following command returns the same output as `sensuctl event list` but makes multiple API queries (each for the number of objects specified by `--chunk-size`) instead of one API query for the complete dataset:

{{< highlight shell >}}
sensuctl event list --chunk-size 500
{{< /highlight >}}

## sensuctl check

In addition to the [standard subcommands][23], the `sensuctl check execute` command executes a check on demand, given the check name:

{{< highlight shell >}}
sensuctl check execute NAME
{{< /highlight >}}

For example, the following command executes the `check-cpu` check with an attached message:

{{< highlight shell >}}
sensuctl check execute check-cpu --reason "giving a sensuctl demo"
{{< /highlight >}}

You can also use the `--subscriptions` flag to override the subscriptions in the check definition:

{{< highlight shell >}}
sensuctl check execute check-cpu --subscriptions demo,webserver
{{< /highlight >}}

## sensuctl cluster

The `sensuctl cluster` command lets you manage a Sensu cluster using the following subcommands:

{{< highlight shell >}}
health           get Sensu health status
id               get unique Sensu cluster ID
member-add       add cluster member to an existing cluster, with comma-separated peer addresses
member-list      list cluster members
member-remove    remove cluster member by ID
member-update    update cluster member by ID with comma-separated peer addresses
{{< /highlight >}}

To view cluster members:

{{< highlight shell >}}
sensuctl cluster member-list
{{< /highlight >}}

To see the health of your Sensu cluster:

{{< highlight shell >}}
sensuctl cluster health
{{< /highlight >}}

## sensuctl event

In addition to the [standard subcommands][23], you can use `sensuctl event resolve` to manually resolve events:

{{< highlight shell >}}
sensuctl event resolve ENTITY CHECK
{{< /highlight >}}

For example, the following command manually resolves an event created by the entity `webserver1` and the check `check-http`:

{{< highlight shell >}}
sensuctl event resolve webserver1 check-http
{{< /highlight >}}

## sensuctl namespace

See the [RBAC reference][21] for information about using access control with namespaces.

## sensuctl user

See the [RBAC reference][22] for information about local user management with sensuctl.

## sensuctl prune

{{% notice important %}}
**IMPORTANT**: `sensuctl prune` is an alpha feature in release 5.19.0 and may include breaking changes.
{{% /notice %}}

**COMMERCIAL FEATURE**: Access sensuctl pruning in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][30].

The `sensuctl prune` subcommand allows you to delete resources that do not appear in a given set of Sensu objects (called a "configuration") from a from a file, URL, or STDIN.
For example, you can use `sensuctl create` to to apply a new configuration, then use `sensuctl prune` to prune unneeded resources, resources that were created by a specific user or that include a specific label selector, and more.

`sensuctl prune` can only delete resources that have the label `sensu.io/managed_by: sensuctl`, which Sensu automatically adds to all resources created with sensuctl.
This means you can only use `sensuctl prune` to delete resources that were created with sensuctl.

The pruning operation always follows the role-based access control (RBAC) permissions of the current user.
For example, to prune resources in the `dev` namespace, the current user who sends the prune command must have delete access to the `dev` namespace.

### sensuctl prune usage

{{< highlight shell >}}
sensuctl prune [RESOURCE TYPE],[RESOURCE TYPE]... -f [FILE or URL] [-r] ... ] [--NAMESPACE] [flags]
{{< /highlight >}}

In this example `sensuctl prune` command:

- Replace [RESOURCE TYPE] with the [synonym or fully qualified name][48] of the resource you want to prune.
You must specify at least one resource type or the `all` qualifier (to prune all resource types).
- Replace [FILE or URL] with the name of the file or the URL where you want to apply the pruning.
- Replace [flags] with the flags you want to use, if any.
- Replace [--NAMESPACE] with the namespace where you want to apply pruning.
If you omit the namespace qualifier, the command defaults to the current configured namespace.

Use a comma separator to prune more than one resource in a single command.

For example, to prune checks and assets from the file `checks.yaml` for the `dev` namespace and the `admin` and `ops` users:

{{< highlight shell >}}
sensuctl prune checks,assets --file checks.yaml --namespace dev --users admin,ops
{{< /highlight >}}

### sensuctl prune flags

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

### sensuctl prune resource types

The table below lists supported `sensuctl prune` resource types.

Synonym | Fully qualified name 
--------------------|---
None | `authentication/v2.Provider`
None | `licensing/v2.LicenseFile`
None | `store/v1.PostgresConfig`
None | `federation/v1.EtcdReplicator`
None | `secrets/v1.Provider`
None | `secrets/v1.Secret`
`apikey` | `core/v2.APIKey`
`assets` | `core/v2.Asset`
`checks` | `core/v2.CheckConfig`
`clusterroles` | `core/v2.ClusterRole`
`clusterrolebindings` | `core/v2.ClusterRoleBinding`
`entities` | `core/v2.Entity`
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

### sensuctl prune examples

`sensuctl prune` supports pruning resources by their synonyms or fully qualified names:

{{< highlight shell >}}
sensuctl prune checks,entities
{{< /highlight >}}

{{< highlight shell >}}
sensuctl prune core/v2.CheckConfig,core/v2.Entity
{{< /highlight >}}

Use the `all` qualifier to prune all supported resources:

{{< highlight shell >}}
sensuctl prune all
{{< /highlight >}}


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
