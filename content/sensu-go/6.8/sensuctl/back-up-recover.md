---
title: "Back up and recover resources with sensuctl"
linkTitle: "Back Up and Recover Resources"
description: "Use sensuctl dump commands to export, back up, and recover some or all of your Sensu resources in YAML and JSON formats."
weight: 20
version: "6.8"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-6.8:
    parent: sensuctl
---

The sensuctl dump command allows you to export your [resources][6] to standard out (stdout) or to a file.
You can export all resources or a subset of them based on a list of resource types.
The dump command supports exporting in `wrapped-json` and `yaml`.

For example, to export all resources for the current namespace to a file named `my-resources.yml` or `my-resources.json` in `yaml` or `wrapped-json` format:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl dump all --format yaml --file my-resources.yml
{{< /code >}}

{{< code shell "Wrapped JSON" >}}
sensuctl dump all --format wrapped-json --file my-resources.json
{{< /code >}}

{{< /language-toggle >}}

You can [restore][3] exported resources with [sensuctl create][1].

{{% notice note %}}
**NOTE**: The sensuctl dump command does not export user passwords &mdash; you must add the [`password_hash`](../#generate-a-password-hash) or `password` attribute to any exported users resources before restoring them with sensuctl create.<br><br>
In addition, sensuctl create does not restore API keys from a sensuctl dump backup, although you can use your backup as a reference for granting new API keys.<br><br>
Because users and API keys require these additional steps to restore with sensuctl create, you might prefer to use the [etcd snapshot and restore process](https://etcd.io/docs/latest/op-guide/recovery/) as your primary backup and restore method.
Take regular etcd snapshots and make regular sensuctl dump backups for extra reassurance.
{{% /notice %}}

## Back up before a Sensu version upgrade

You should create a backup before you [upgrade][4] to a new version of Sensu.
Here's the step-by-step process:

1. Create a backup folder.
{{< code shell >}}
mkdir backup
{{< /code >}}
   
2. Create a backup of the entire cluster, except entities, events, and [role-based access control (RBAC)][2] resources, for all namespaces.
{{< language-toggle >}}
{{< code shell "YML" >}}
sensuctl dump all \
--all-namespaces \
--omit core/v2.Entity,core/v2.Event,core/v2.APIKey,core/v2.User,core/v2.Role,core/v2.RoleBinding,core/v2.ClusterRole,core/v2.ClusterRoleBinding \
--format yaml \
--file backup/config.yml
{{< /code >}}
{{< code shell "Wrapped JSON" >}}
sensuctl dump all \
--all-namespaces \
--omit core/v2.Entity,core/v2.Event,core/v2.APIKey,core/v2.User,core/v2.Role,core/v2.RoleBinding,core/v2.ClusterRole,core/v2.ClusterRoleBinding \
--format wrapped-json \
--file backup/config.json
{{< /code >}}
{{< /language-toggle >}}

3. Export your [RBAC][2] resources, except API keys and users, for all namespaces.
{{< language-toggle >}}
{{< code shell "YML" >}}
sensuctl dump core/v2.Role,core/v2.RoleBinding,core/v2.ClusterRole,core/v2.ClusterRoleBinding \
--all-namespaces \
--format yaml \
--file backup/rbac.yml
{{< /code >}}
{{< code shell "Wrapped JSON" >}}
sensuctl dump core/v2.Role,core/v2.RoleBinding,core/v2.ClusterRole,core/v2.ClusterRoleBinding \
--all-namespaces \
--format wrapped-json \
--file backup/rbac.json
{{< /code >}}
{{< /language-toggle >}}

4. Export your API keys and users resources for all namespaces.
{{< language-toggle >}}
{{< code shell "YML" >}}
sensuctl dump core/v2.APIKey,core/v2.User \
--all-namespaces \
--format yaml \
--file backup/cannotrestore.yml
{{< /code >}}
{{< code shell "Wrapped JSON" >}}
sensuctl dump core/v2.APIKey,core/v2.User \
--all-namespaces \
--format wrapped-json \
--file backup/cannotrestore.json
{{< /code >}}
{{< /language-toggle >}}
{{% notice note %}}
**NOTE**: Passwords are not included when you export users.
You must add the [`password_hash`](../#generate-a-password-hash) or `password` attribute to any exported `users` resources before you can use them with `sensuctl create`.<br><br>
Because users require this additional configuration and API keys cannot be restored from a sensuctl dump backup, consider exporting your API keys and users to a different folder than `backup`.
{{% /notice %}}
   
5. Export your entity resources for all namespaces (if desired).
{{< language-toggle >}}
{{< code shell "YML" >}}
sensuctl dump core/v2.Entity \
--all-namespaces \
--format yaml \
--file backup/inventory.yml
{{< /code >}}
{{< code shell "Wrapped JSON" >}}
sensuctl dump core/v2.Entity \
--all-namespaces \
--format wrapped-json \
--file backup/inventory.json
{{< /code >}}
{{< /language-toggle >}}
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
{{< language-toggle >}}
{{< code shell "YML" >}}
sensuctl dump core/v2.Asset,core/v2.CheckConfig,core/v2.HookConfig,core/v2.EventFilter,core/v2.Mutator,core/v2.Handler,core/v2.Silenced,secrets/v1.Secret,secrets/v1.Provider \
--all-namespaces \
--format yaml | grep -v "^\s*namespace:" > backup/pipelines.yml
{{< /code >}}
{{< code shell "Wrapped JSON" >}}
sensuctl dump core/v2.Asset,core/v2.CheckConfig,core/v2.HookConfig,core/v2.EventFilter,core/v2.Mutator,core/v2.Handler,core/v2.Silenced,secrets/v1.Secret,secrets/v1.Provider \
--all-namespaces \
--format wrapped-json | grep -v "^\s*namespace:" > backup/pipelines.json
{{< /code >}}
{{< /language-toggle >}}

## Restore resources from backup

When you are ready to restore your exported resources, use [`sensuctl create`][1].

To restore everything you exported all at once, run:

{{< code shell >}}
sensuctl create -r -f backup/
{{< /code >}}

To restore a subset of your exported resources (in this example, your RBAC resources), run:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl create -f backup/rbac.yml
{{< /code >}}

{{< code shell "Wrapped JSON" >}}
sensuctl create -f backup/rbac.json
{{< /code >}}

{{< /language-toggle >}}

{{% notice note %}}
**NOTE**: When you export users, required password attributes are not included.
You must add a [`password_hash`](../#generate-a-password-hash) or `password` to `users` resources before restoring them with the `sensuctl create` command.<br><br>
You can't restore API keys or users from a sensuctl dump backup.
API keys must be reissued, but you can use your backup as a reference for granting new API keys to replace the exported keys.
{{% /notice %}}

## Supported resource types

Use `sensuctl describe-type all` to retrieve the list of supported sensuctl dump resource types.

{{% notice note %}}
**NOTE**: Short names are only supported for core/v2 resources.
{{% /notice %}}

{{< code shell >}}
sensuctl describe-type all
{{< /code >}}

The response will list the names and other details for the supported resource types:

{{< code text >}}
         Fully Qualified Name               Short Name           API Version               Type             Namespaced  
────────────────────────────────────── ───────────────────── ─────────────────── ───────────────────────── ─────────────
  authentication/v2.Provider                                  authentication/v2   Provider                  false
  licensing/v2.LicenseFile                                    licensing/v2        LicenseFile               false
  store/v1.PostgresConfig                                     store/v1            PostgresConfig            false
  federation/v1.EtcdReplicator                                federation/v1       EtcdReplicator            false
  federation/v1.Cluster                                       federation/v1       Cluster                   false
  secrets/v1.Secret                                           secrets/v1          Secret                    true
  secrets/v1.Provider                                         secrets/v1          Provider                  false
  searches/v1.Search                                          searches/v1         Search                    true
  web/v1.GlobalConfig                                         web/v1              GlobalConfig              false
  bsm/v1.RuleTemplate                                         bsm/v1              RuleTemplate              true
  bsm/v1.ServiceComponent                                     bsm/v1              ServiceComponent          true
  pipeline/v1.SumoLogicMetricsHandler                         pipeline/v1         SumoLogicMetricsHandler   true
  pipeline/v1.TCPStreamHandler                                pipeline/v1         TCPStreamHandler          true
  core/v2.Namespace                     namespaces            core/v2             Namespace                 false
  core/v2.ClusterRole                   clusterroles          core/v2             ClusterRole               false
  core/v2.ClusterRoleBinding            clusterrolebindings   core/v2             ClusterRoleBinding        false
  core/v2.User                          users                 core/v2             User                      false
  core/v2.APIKey                        apikeys               core/v2             APIKey                    false
  core/v2.TessenConfig                  tessen                core/v2             TessenConfig              false
  core/v2.Asset                         assets                core/v2             Asset                     true
  core/v2.CheckConfig                   checks                core/v2             CheckConfig               true
  core/v2.Entity                        entities              core/v2             Entity                    true
  core/v2.Event                         events                core/v2             Event                     true
  core/v2.EventFilter                   filters               core/v2             EventFilter               true
  core/v2.Handler                       handlers              core/v2             Handler                   true
  core/v2.HookConfig                    hooks                 core/v2             HookConfig                true
  core/v2.Mutator                       mutators              core/v2             Mutator                   true
  core/v2.Pipeline                      pipelines             core/v2             Pipeline                  true
  core/v2.Role                          roles                 core/v2             Role                      true
  core/v2.RoleBinding                   rolebindings          core/v2             RoleBinding               true
  core/v2.Silenced                      silenced              core/v2             Silenced                  true 
{{< /code >}}

You can also list specific resource types by fully qualified name or short name:

{{< code shell >}}
sensuctl describe-type core/v2.CheckConfig
{{< /code >}}

{{< code shell >}}
sensuctl describe-type checks
{{< /code >}}

To list more than one type, use a comma-separated list:

{{< code shell >}}
sensuctl describe-type core/v2.CheckConfig,core/v2.EventFilter,core/v2.Handler
{{< /code >}}

{{< code shell >}}
sensuctl describe-type checks,filters,handlers
{{< /code >}}

### Format the sensuctl describe-type response

Add the `--format` flag to specify how the resources should be formatted in the `sensuctl describe-type` response.
The default is unformatted, but you can specify either `wrapped-json` or `yaml`:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl describe-type core/v2.CheckConfig --format yaml
{{< /code >}}

{{< code shell "Wrapped JSON">}}
sensuctl describe-type core/v2.CheckConfig --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

## Example sensuctl dump commands

To export only checks for only the current namespace to stdout in YAML or wrapped JSON format:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl dump core/v2.CheckConfig --format yaml
{{< /code >}}

{{< code shell "Wrapped JSON" >}}
sensuctl dump core/v2.CheckConfig --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

To export only handlers and filters for only the current namespace to a file named `my-handlers-and-filters` in YAML or wrapped JSON format:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl dump core/v2.Handler,core/v2.EventFilter --format yaml --file my-handlers-and-filters.yml
{{< /code >}}

{{< code shell "Wrapped JSON" >}}
sensuctl dump core/v2.Handler,core/v2.EventFilter --format wrapped-json --file my-handlers-and-filters.json
{{< /code >}}

{{< /language-toggle >}}

To export resources for **all namespaces**, add the `--all-namespaces` flag to any sensuctl dump command.
For example:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl dump all --all-namespaces --format yaml --file my-resources.yml
{{< /code >}}

{{< code shell "Wrapped JSON" >}}
sensuctl dump all --all-namespaces --format wrapped-json --file my-resources.json
{{< /code >}}

{{< /language-toggle >}}

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl dump core/v2.CheckConfig --all-namespaces --format yaml
{{< /code >}}

{{< code shell "Wrapped JSON" >}}
sensuctl dump core/v2.CheckConfig --all-namespaces --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl dump core/v2.Handler,core/v2.EventFilter --all-namespaces --format yaml --file my-handlers-and-filters.yml
{{< /code >}}

{{< code shell "Wrapped JSON" >}}
sensuctl dump core/v2.Handler,core/v2.EventFilter --all-namespaces --format wrapped-json --file my-handlers-and-filters.json
{{< /code >}}

{{< /language-toggle >}}

You can use [fully qualified names or short names][6] to specify resources in sensuctl dump commands.
Here's an example that uses fully qualified names:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl dump core/v2.Handler,core/v2.EventFilter --format yaml --file my-handlers-and-filters.yml
{{< /code >}}

{{< code shell "Wrapped JSON" >}}
sensuctl dump core/v2.Handler,core/v2.EventFilter --format wrapped-json --file my-handlers-and-filters.json
{{< /code >}}

{{< /language-toggle >}}

Here's an example that uses short names:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl dump handlers,filters --format yaml --file my-handlers-and-filters.yml
{{< /code >}}

{{< code shell "Wrapped JSON" >}}
sensuctl dump handlers,filters --format wrapped-json --file my-handlers-and-filters.json
{{< /code >}}

{{< /language-toggle >}}

## Best practices for sensuctl dump

To reduce the running time for the sensuctl dump command, omit events and export only one namespace at a time.

Omit events from your sensuctl dump command to reduce the size of the exported payload and the system resources required to export.
The most important part of a backup is capturing the Sensu configuration, and even with regular backups, events are likely to be outdated by the time you restore them.
If you need access to all events, send them to a database store instead of including events in routine Sensu backups.

It takes longer to export resources from all namespaces at once than the resources from one namespace, especially as the number of resources in each namespace grows.
To export resources more quickly, export a single namespace at a time.


[1]: ../create-manage-resources/#create-resources
[2]: ../../operations/control-access/rbac/
[3]: #restore-resources-from-backup
[4]: ../../operations/maintain-sensu/upgrade/
[5]: ../create-manage-resources/#create-resources-across-namespaces
[6]: #supported-resource-types
