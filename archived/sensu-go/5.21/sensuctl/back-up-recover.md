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

For example, to export all resources for the current namespace to a file named `my-resources.yaml` in `yaml` format:

{{< code shell >}}
sensuctl dump all --format yaml --file my-resources.yaml
{{< /code >}}

To export only checks for only the current namespace to STDOUT in `yaml` format:

{{< code shell >}}
sensuctl dump core/v2.CheckConfig --format yaml
{{< /code >}}

To export only handlers and filters for only the current namespace to a file named `my-handlers-and-filters.yaml` in `yaml` format:

{{< code shell >}}
sensuctl dump core/v2.Handler,core/v2.EventFilter --format yaml --file my-handlers-and-filters.yaml
{{< /code >}}

To export resources for **all namespaces**, add the `--all-namespaces` flag to any `sensuctl dump` command:

{{< code shell >}}
sensuctl dump all --all-namespaces --format yaml --file my-resources.yaml

sensuctl dump core/v2.CheckConfig --all-namespaces --format yaml

sensuctl dump core/v2.Handler,core/v2.EventFilter --all-namespaces --format yaml --file my-handlers-and-filters.yaml
{{< /code >}}

You can use [fully qualified names or short names][6] to specify resources in `sensuctl dump` commands:

{{< code shell >}}
sensuctl dump core/v2.Handler,core/v2.EventFilter --format yaml --file my-handlers-and-filters.yaml

sensuctl dump handlers,filters --format yaml --file my-handlers-and-filters.yaml
{{< /code >}}

After you use `sensuctl dump` to back up your Sensu resources, you can [restore][3] them later with [`sensuctl create`][1].

{{% notice note %}}
**NOTE**: The sensuctl dump command does not export user passwords &mdash; you must add the [`password_hash`](../#generate-a-password-hash) or `password` attribute to any exported users resources before restoring them with sensuctl create.
In addition, sensuctl create does not restore API keys from a sensuctl dump backup, although you can use your backup as a reference for granting new API keys.

Because users and API keys require these additional steps to restore with sensuctl create, you might prefer to use the [etcd snapshot and restore process](https://etcd.io/docs/latest/op-guide/recovery/) as your primary backup and restore method.
Take regular etcd snapshots and make regular sensuctl dump backups for extra reassurance.
{{% /notice %}}

This page explains how to back up your resources for two common use cases: before a Sensu version upgrade and to populate new namespaces with existing resources.

## Back up before a Sensu version upgrade

You should create a backup before you [upgrade][4] to a new version of Sensu.
Here's the step-by-step process:

1. Create a backup folder.

   {{< code shell >}}
mkdir backup
{{< /code >}}
   
2. Create a backup of the entire cluster, except entities, events, and [role-based access control (RBAC)][2] resources, for all namespaces.
   
   {{< code shell >}}
sensuctl dump all \
--all-namespaces \
--omit core/v2.Entity,core/v2.Event,core/v2.APIKey,core/v2.User,core/v2.Role,core/v2.RoleBinding,core/v2.ClusterRole,core/v2.ClusterRoleBinding \
--format yaml > backup/config.yaml
{{< /code >}}
   
3. Export your [RBAC][2] resources, except API keys and users, for all namespaces.
   
   {{< code shell >}}
sensuctl dump core/v2.Role,core/v2.RoleBinding,core/v2.ClusterRole,core/v2.ClusterRoleBinding \
--all-namespaces \
--format yaml > backup/rbac.yaml
{{< /code >}}

4. Export your API keys and users resources for all namespaces.
   
   {{< code shell >}}
sensuctl dump core/v2.APIKey,core/v2.User \
--all-namespaces \
--format yaml > backup/cannotrestore.yaml
{{< /code >}}

   {{% notice note %}}
**NOTE**: Passwords are not included when you export users.
You must add the [`password_hash`](../#generate-a-password-hash) or `password` attribute to any exported `users` resources before you can use them with `sensuctl create`.<br><br>
Because users require this additional configuration and API keys cannot be restored from a `sensuctl dump` backup, you might prefer to export your API keys and users to a different folder than `backup`.
{{% /notice %}}
   
5. Export your entity resources for all namespaces (if desired).
     
   {{< code shell >}}
sensuctl dump core/v2.Entity \
--all-namespaces \
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
   
2. Back up your pipeline resources for all namespaces, stripping namespaces so that your resources are portable for reuse in any namespace.
   
   {{< code shell >}}
sensuctl dump core/v2.Asset,core/v2.CheckConfig,core/v2.Hook,core/v2.EventFilter,core/v2.Mutator,core/v2.Handler,core/v2.Silenced,secrets/v1.Secret,secrets/v1.Provider \
--all-namespaces \
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

## Supported resource types

{{% notice important %}}
**IMPORTANT**: The `sensuctl describe-type` command deprecates `sensuctl dump --types`.
{{% /notice %}}

Use `sensuctl describe-type all` to retrieve the list of supported `sensuctl dump` resource types.

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

You can also list specific resource types by fully qualified name or short name:

{{< code shell >}}
sensuctl describe-type core/v2.CheckConfig

sensuctl describe-type checks
{{< /code >}}

To list more than one type, use a comma-separated list:

{{< code shell >}}
sensuctl describe-type core/v2.CheckConfig,core/v2.EventFilter,core/v2.Handler

sensuctl describe-type checks,filters,handlers
{{< /code >}}

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
[6]: #supported-resource-types
