---
title: "Back up and recover resources with sensuctl"
linkTitle: "Back Up and Recover Resources"
description: "Use the sensuctl command line tool to back up and recover your Sensu resources. Read this page to learn how to use sensuctl dump commands for backup and recovery."
weight: 20
version: "6.0"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-6.0:
    parent: sensuctl
---

The `sensuctl dump` command allows you to export your resources to standard out (STDOUT) or to a file.
You can export all of your resources or a subset of them based on a list of resource types.
The `dump` command supports exporting in `wrapped-json` and `yaml`.

{{% notice note %}}
**NOTE**: Passwords are not included when exporting users.
You must add the `password` attribute to any exported user resources before you can use them with `sensuctl create`.
{{% /notice %}}

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

## Back up your resources

Use `sensuctl dump` to back up your Sensu resources so you can [restore][3] them later with [`sensuctl create`][1].
For example, we recommend creating a backup before you [upgrade][4] to a new version of Sensu.

{{% notice note %}}
**NOTE**: You cannot export `secrets/v1.provider` resources &mdash; make sure to omit them from your `sensuctl dump` commands.
{{% /notice %}}

Here's the step-by-step process:

1. Create a backup folder.

   {{< code shell >}}
mkdir backup
{{< /code >}}
   
2. Back up your pipeline resources, stripping namespaces to maintain portability and facilitate reuse.
   
   {{< code shell >}}
sensuctl dump assets,checks,hooks,filters,mutators,handlers,silenced,secrets/v1.Secret \
--format yaml | grep -v "^\s*namespace:" > backup/pipelines.yaml
{{< /code >}}
   
3. Create a namespaced backup of the entire cluster (except entities, events, and apikeys).
   
   {{< code shell >}}
sensuctl dump all \
--omit entities,events,apikeys \
--format yaml > backup/config.yaml
{{< /code >}}
   
4. Back up your [role-based access control (RBAC)][2] resources.
   
   {{< code shell >}}
sensuctl dump apikeys,users,roles,rolebindings,clusterroles,clusterrolebindings
--format yaml > backup/system-rbac.yaml
{{< /code >}}
   
5. Back up your entity resources (if desired).
     
   {{< code shell >}}
sensuctl dump entities \
--format yaml | grep -v "^\s*namespace:" > backup/inventory.yaml
{{< /code >}}

## Restore resources from backup

When you are ready to restore your backed-up resources, use [`sensuctl create`][1].

To restore everything you backed up all at once, run:

{{< code shell >}}
sensuctl create -r -f backup/
{{< /code >}}

To restore a subset of your backups (in this example, your pipeline resources), run:

{{< code shell >}}
sensuctl create -f backup/pipelines.yaml
{{< /code >}}

{{% notice note %}}
**NOTE**: To restore `users` resources from `sensuctl dump` output, you must add a `password_hash` or `password` to your `sensuctl create` command.
Use `sensuctl user hash-password` to [generate a password hash](../#generate-a-password-hash).
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
