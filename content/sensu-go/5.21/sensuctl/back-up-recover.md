---
title: "Back up and recover resources with sensuctl"
linkTitle: "Back Up and Recover Resources"
description: "Use the sensuctl command line tool to back up and recover your Sensu resources. Read this page to learn how to use sensuctl dump commands for backup and recovery."
weight: 20
version: "5.21"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.21:
    parent: sensuctl
---

The `sensuctl dump` command allows you to export your [resources][6] to standard out (STDOUT) or to a file.
You can export all of your resources or a subset of them based on a list of resource types.
The `dump` command supports exporting in `wrapped-json` and `yaml`.

For example, to export all resources to a file named `my-resources.yaml` in `yaml` format:

{{< code shell >}}
sensuctl dump all --format yaml --file my-resources.yaml
{{< /code >}}

To export only checks to STDOUT in `yaml` format:

{{< code shell >}}
sensuctl dump check --format yaml
{{< /code >}}

To export only handlers and filters to a file named `my-handlers-and-filters.yaml` in `yaml` format:

{{< code shell >}}
sensuctl dump handler,filter --format yaml --file my-handlers-and-filters.yaml
{{< /code >}}

After you use `sensuctl dump` to back up your Sensu resources, you can [restore][3] them later with [`sensuctl create`][1].
This page explains how to back up your resources for two common use cases: before a Sensu version upgrade and to populate new namespaces with existing resources.

## Back up before a Sensu version upgrade

You should create a backup before you [upgrade][4] to a new version of Sensu.
Here's the step-by-step process:

1. Create a backup folder.

   {{< code shell >}}
mkdir backup
{{< /code >}}
   
2. Create a namespaced backup of the entire cluster, except entities, events, and [role-based access control (RBAC)][2] resources.
   
   {{< code shell >}}
sensuctl dump all \
--omit entities,events,apikeys,users,roles,rolebindings,clusterroles,clusterrolebindings \
--format yaml > backup/config.yaml
{{< /code >}}
   
3. Export your [RBAC][2] resources, except API keys and users.
   
   {{< code shell >}}
sensuctl dump roles,rolebindings,clusterroles,clusterrolebindings
--format yaml > backup/rbac.yaml
{{< /code >}}

4. Export your API keys and users resources.
   
   {{< code shell >}}
sensuctl dump apikeys,users
--format yaml > backup/cannotrestore.yaml
{{< /code >}}

   {{% notice note %}}
**NOTE**: Passwords are not included when you export users.
You must add the [`password_hash`](../#generate-a-password-hash) or `password` attribute to any exported `users` resources before you can use them with `sensuctl create`.<br><br>
Because users require this additional configuration and API keys cannot be restored from a `sensuctl dump` backup, you might prefer to export your API keys and users to a different folder than `backup`.
{{% /notice %}}
   
5. Export your entity resources (if desired).
     
   {{< code shell >}}
sensuctl dump entities \
--format yaml > backup/inventory.yaml
{{< /code >}}

   {{% notice note %}}
**NOTE**: If you do not export your entities, proxy check requests will not be scheduled for the excluded proxy entities.
{{% /notice %}}

## Back up to populate new namespaces

You can create a backup copy of your existing resources with their namespaces stripped from the record.
This backup allows you to [replicate resources across namespaces][5] without manual editing.

To create a backup of your resources that you can replicate in new namespaces:

1. Create a backup folder.

   {{< code shell >}}
mkdir backup
{{< /code >}}
   
2. Back up your pipeline resources, stripping namespaces so that your resources are portable for reuse in any namespace.
   
   {{< code shell >}}
sensuctl dump assets,checks,hooks,filters,mutators,handlers,silenced,secrets/v1.Secret,secrets/v1.Provider \
--format yaml | grep -v "^\s*namespace:" > backup/pipelines.yaml
{{< /code >}}

## Restore resources from backup

When you are ready to restore your exported resources, use [`sensuctl create`][1].

To restore everything you exported all at once, run:

{{< code shell >}}
sensuctl create -r -f backup/
{{< /code >}}

To restore a subset of your exported resources (in this example, your RBAC resources), run:

{{< code shell >}}
sensuctl create -f backup/rbac.yaml
{{< /code >}}

{{% notice note %}}
**NOTE**: You can't restore API keys or users from a `sensuctl dump` backup.<br><br>
API keys must be reissued, but you can use your backup as a reference for granting new API keys to replace the exported keys.<br><br>
When you export users, required password attributes are not included.
You must add a [`password_hash`](../#generate-a-password-hash) or `password` to `users` resources before restoring them with the `sensuctl create` command.
{{% /notice %}}

## List types of supported resources

{{% notice important %}}
**IMPORTANT**: The `sensuctl describe-type` command deprecates `sensuctl dump --types`.
{{% /notice %}}

Use `sensuctl describe-type` to list the types of supported resources.
For example, to list all types:

{{< code shell >}}
sensuctl describe-type all
{{< /code >}}

You can also list specific resource types by fully qualified name or synonym:

{{< code shell >}}
sensuctl describe-type core/v2.CheckConfig
sensuctl describe-type checks
{{< /code >}}

To list more than one type, use a comma-separated list:

{{< code shell >}}
sensuctl describe-type core/v2.CheckConfig,core/v2.EventFilter,core/v2.Handler
sensuctl describe-type checks,filters,handlers
{{< /code >}}

<a name="resource-types"></a>

The table below lists supported `sensuctl describe-type` resource types.

{{% notice note %}}
**NOTE**: The resource types with no synonym listed are [commercial features](../../commercial/).
{{% /notice %}}

Synonym | Fully qualified name 
--------------------|---
None | `authentication/v2.Provider`
None | `licensing/v2.LicenseFile`
None | `store/v1.PostgresConfig`
None | `federation/v1.Replicator`
None | `secrets/v1.Provider`
None | `secrets/v1.Secret`
None | `searches/v1.Search`
None | `web/v1.GlobalConfig`
`apikeys` | `core/v2.APIKey`
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

### Format the sensuctl describe-type response

Add the `--format` flag to specify how the resources should be formatted in the `sensuctl describe-type` response.
The default is unformatted, but you can specify either `wrapped-json` or `yaml`:

{{< code shell >}}
sensuctl describe-type core/v2.CheckConfig --format yaml
sensuctl describe-type core/v2.CheckConfig --format wrapped-json
{{< /code >}}


[1]: ../create-manage-resources/#create-resources
[2]: ../../reference/rbac/
[3]: #restore-resources-from-backup
[4]: ../../operations/maintain-sensu/upgrade/
[5]: ../create-manage-resources/#create-resources-across-namespaces
[6]: #resource-types
