---
title: "Create and manage resources with sensuctl"
linkTitle: "Create and Manage Resources"
description: "Use the sensuctl command line tool to create and manage resources within Sensu. Read this reference doc to learn how to use sensuctl."
weight: 10
version: "6.7"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-6.7:
    parent: sensuctl
---

Use the sensuctl command line tool to create and manage resources within Sensu.
Sensuctl works by calling Sensu’s underlying API to create, read, update, and delete resources, events, and entities.

## Create resources

The `sensuctl create` command allows you to create or update resources by reading from STDIN or a file.

The `create` command accepts Sensu resource definitions in [`yaml` or `wrapped-json` formats][4], which wrap the contents of the resource in `spec` and identify the resource `type` and `api_version`.
Review the [list of supported resource types][3] `for sensuctl create`.
Read the [reference docs][6] for information about creating resource definitions.

{{% notice note %}}
**NOTE**: You cannot use sensuctl to update [agent-managed entities](../../observability-pipeline/observe-entities/entities/#manage-agent-entities-via-the-agent).
Requests to update agent-managed entities via sensuctl will fail and return an error.
{{% /notice %}}

You can create more than one resource at a time with `sensuctl create`.
If you use YAML, separate the resource definitions by a line with three hyphens: `---`.
If you use wrapped JSON, separate the resources *without* a comma.

### Create resources from STDIN

The following example demonstrates how to use the EOF function with `sensuctl create` to create two resources by reading from STDIN: a `marketing-site` check and a `slack` handler.

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: CheckConfig
api_version: core/v2
metadata:
  name: marketing-site
spec:
  command: http-check -u https://sensu.io
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
spec:
  command: sensu-slack-handler --channel '#monitoring'
  env_vars:
  - SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
  type: pipe
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata" : {
    "name": "marketing-site"
    },
  "spec": {
    "command": "http-check -u https://sensu.io",
    "subscriptions": ["demo"],
    "interval": 15,
    "handlers": ["slack"]
  }
}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "slack"
  },
  "spec": {
    "command": "sensu-slack-handler --channel '#monitoring'",
    "env_vars": [
      "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
    ],
    "type": "pipe"
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

### Create resources from a file

The following example demonstrates how to use the `--file` flag with `sensuctl create` to create a `marketing-site` check and a `slack` handler.

First, copy these resource definitions and save them in a file named `my-resources.yml` or `my-resources.json`:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: marketing-site
spec:
  command: http-check -u https://sensu.io
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
spec:
  command: sensu-slack-handler --channel '#monitoring'
  env_vars:
  - SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
  type: pipe
{{< /code >}}

{{< code shell "JSON" >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata" : {
    "name": "marketing-site"
    },
  "spec": {
    "command": "http-check -u https://sensu.io",
    "subscriptions": ["demo"],
    "interval": 15,
    "handlers": ["slack"]
  }
}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "slack"
  },
  "spec": {
    "command": "sensu-slack-handler --channel '#monitoring'",
    "env_vars": [
      "SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
    ],
    "type": "pipe"
  }
}
{{< /code >}}

{{< /language-toggle >}}

Run the following command to create the resources from `my-resources.yml` or `my-resources.json`:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl create --file my-resources.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl create --file my-resources.json
{{< /code >}}

{{< /language-toggle >}}

Or:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat my-resources.yml | sensuctl create
{{< /code >}}

{{< code shell "JSON" >}}
cat my-resources.json | sensuctl create
{{< /code >}}

{{< /language-toggle >}}

### sensuctl create flags

Run `sensuctl create -h` to view a usage example with command-specific and global flags:

{{< code text >}}
Create or replace resources from file or URL (path, file://, http[s]://), or STDIN otherwise.

Usage:  sensuctl create [-r] [[-f URL] ... ] [flags]

Flags:
  -f, --file strings   Files, directories, or URLs to create resources from
  -h, --help           help for create
  -r, --recursive      Follow subdirectories

Global Flags:
      --api-key string             API key to use for authentication
      --api-url string             host URL of Sensu installation
      --cache-dir string           path to directory containing cache & temporary files (default "/home/vagrant/.cache/sensu/sensuctl")
      --config-dir string          path to directory containing configuration files (default "/home/vagrant/.config/sensu/sensuctl")
      --insecure-skip-tls-verify   skip TLS certificate verification (not recommended!)
      --namespace string           namespace in which we perform actions (default "default")
      --timeout duration           timeout when communicating with sensu backend (default 15s)
      --trusted-ca-file string     TLS CA certificate bundle in PEM format
{{< /code >}}

### sensuctl create resource types

Use sensuctl create with any of the following resource types:

| sensuctl create types |   | |
--------------------|---|---|---
[`ad`][25] | `AdhocRequest` | [`Asset`][12] | [`CheckConfig`][13]
[`ClusterRole`][43] | [`ClusterRoleBinding`][45] | [`Entity`][14] | [`Env`][24]
[`EtcdReplicators`][29] | [`Event`][15] | [`EventFilter`][16] | [`GlobalConfig`][11]
[`Handler`][17] | [`HookConfig`][18] | [`ldap`][26] | [`Mutator`][19]
[`Namespace`][21] | [`oidc`][37] | [`PostgresConfig`][32] | [`Role`][35]
[`RoleBinding`][44] | [`Secret`][28] | [`Silenced`][20] | [`SumoLogicMetricsHandler`][40]
[`TCPStreamHandler`][41] | [`TessenConfig`][27] | [`User`][22] | [`VaultProvider`][24]

### Create resources across namespaces

If you omit the `namespace` attribute from resource definitions, you can use the `senusctl create --namespace` flag to specify the namespace for a group of resources at the time of creation.
This allows you to replicate resources across namespaces without manual editing.

To learn more about namespaces, read the [namespaces reference][21].
The RBAC reference includes a list of [namespaced resource types][38].

The `sensuctl create` command applies namespaces to resources in the following order, from highest precedence to lowest:

1. **Namespace specified within resource definitions**: You can specify a resource's namespace within individual resource definitions using the `namespace` attribute.
Namespaces specified in resource definitions take precedence over all other methods.
2. **`--namespace` flag**: If resource definitions do not specify a namespace, Sensu applies the namespace provided by the `sensuctl create --namespace` flag.
3. **Current sensuctl namespace configuration**: If you do not specify an embedded `namespace` attribute or use the `--namespace` flag, Sensu applies the namespace configured in the current sensuctl session.
Read [Manage sensuctl][31] to view your current session config and set the session namespace.

For example, this handler does not include a `namespace` attribute:

{{< language-toggle >}}

{{< code yml >}}
---
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

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "pagerduty"
  },
  "spec": {
    "command": "sensu-pagerduty-handler",
    "env_vars": [
      "PAGERDUTY_TOKEN=SECRET"
    ],
    "type": "pipe"
  }
}
{{< /code >}}

{{< /language-toggle >}}

If you save this resource definition in a file named `pagerduty.yml` or `pagerduty.json`, you can create the `pagerduty` handler in any namespace with specific sensuctl commands.

To create the handler in the `default` namespace:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl create --file pagerduty.yml --namespace default
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl create --file pagerduty.json --namespace default
{{< /code >}}

{{< /language-toggle >}}

To create the `pagerduty` handler in the `production` namespace:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl create --file pagerduty.yml --namespace production
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl create --file pagerduty.json --namespace production
{{< /code >}}

{{< /language-toggle >}}

To create the `pagerduty` handler in the current session namespace:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl create --file pagerduty.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl create --file pagerduty.json
{{< /code >}}

{{< /language-toggle >}}

## Delete resources

The `sensuctl delete` command allows you to delete resources by reading from STDIN or a file.

The `delete` command accepts Sensu resource definitions in `wrapped-json` and `yaml` formats and uses the same [resource types][3] as `sensuctl create`.
To be deleted successfully, the name and namespace of a resource provided to the `delete` command must match the name and namespace of an existing resource.

### Delete resources with STDIN

To delete the `marketing-site` check from the current namespace with STDIN, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl delete
---
type: CheckConfig
api_version: core/v2
metadata:
  name: marketing-site
spec:
  command: http-check -u https://sensu.io
  subscriptions:
  - demo
  interval: 15
  handlers:
  - slack
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl delete
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata" : {
    "name": "marketing-site"
    },
  "spec": {
    "command": "http-check -u https://sensu.io",
    "subscriptions": ["demo"],
    "interval": 15,
    "handlers": ["slack"]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

### Delete resources using a file

To delete all resources listed in a specific file from Sensu (in this example, a file named `my-resources.yml` or `my-resources.json`):

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl delete --file my-resources.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl delete --file my-resources.json
{{< /code >}}

{{< /language-toggle >}}

Or:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat my-resources.yml | sensuctl delete
{{< /code >}}

{{< code shell "JSON" >}}
cat my-resources.json | sensuctl delete
{{< /code >}}

{{< /language-toggle >}}

### sensuctl delete flags

Run `sensuctl delete -h` to view a usage example with command-specific and global flags:

{{< code text >}}
Delete resources from file or STDIN

Usage:  sensuctl delete [-f FILE] [flags]

Flags:
  -f, --file string   File to delete resources from
  -h, --help          help for delete

Global Flags:
      --api-key string             API key to use for authentication
      --api-url string             host URL of Sensu installation
      --cache-dir string           path to directory containing cache & temporary files (default "/home/vagrant/.cache/sensu/sensuctl")
      --config-dir string          path to directory containing configuration files (default "/home/vagrant/.config/sensu/sensuctl")
      --insecure-skip-tls-verify   skip TLS certificate verification (not recommended!)
      --namespace string           namespace in which we perform actions (default "default")
      --timeout duration           timeout when communicating with sensu backend (default 15s)
      --trusted-ca-file string     TLS CA certificate bundle in PEM format
{{< /code >}}

### Delete resources across namespaces

If you omit the `namespace` attribute from resource definitions, you can use the `senusctl delete --namespace` flag to specify the namespace for a group of resources at the time of deletion.
This allows you to remove resources across namespaces without manual editing.

For example, suppose you added the `pagerduty` handler from [Create resources across namespaces][33] in every namespace.
To delete the `pagerduty` handler from only the `production` namespace using STDIN, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl delete --namespace production
---
type: Handler
api_version: core/v2
metadata:
  name: pagerduty
spec:
  command: sensu-pagerduty-handler
  env_vars:
  - PAGERDUTY_TOKEN=SECRET
  type: pipe
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl delete --namespace production
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "pagerduty"
  },
  "spec": {
    "command": "sensu-pagerduty-handler",
    "env_vars": [
      "PAGERDUTY_TOKEN=SECRET"
    ],
    "type": "pipe"
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

You can also use the `sensuctl delete` command with a file that includes the `pagerduty` handler definition (in these examples, the file name is `pagerduty.yml` or `pagerduty.json`).

Delete the `pagerduty` handler from the `default` namespace with this command:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl delete --file pagerduty.yml --namespace default
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl delete --file pagerduty.json --namespace default
{{< /code >}}

{{< /language-toggle >}}

To delete the `pagerduty` handler from the `production` namespace:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl delete --file pagerduty.yml --namespace production
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl delete --file pagerduty.json --namespace production
{{< /code >}}

{{< /language-toggle >}}

To delete the `pagerduty` handler in the current session namespace:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl delete --file pagerduty.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl delete --file pagerduty.json
{{< /code >}}

{{< /language-toggle >}}

## Update resources

Sensuctl allows you to update resource definitions with a text editor.
To use `sensuctl edit`, specify the resource [type][5] and resource name.

For example, to edit a handler named `slack` with `sensuctl edit`:

{{< code shell >}}
sensuctl edit handler slack
{{< /code >}}

{{% notice note %}}
**NOTE**: You cannot use sensuctl to update [agent-managed entities](../../observability-pipeline/observe-entities/entities/#manage-agent-entities-via-the-agent).
Requests to update agent-managed entities via sensuctl will fail and return an error.
{{% /notice %}}

### sensuctl edit flags

Run `sensuctl edit -h` to view a usage example with command-specific and global flags:

{{< code text >}}
Edit resources interactively

Usage:  sensuctl edit [RESOURCE TYPE] [KEY]... [flags]

Flags:
  -b, --blank           edit a blank resource, and create it on save
      --format string   format of data returned ("json"|"wrapped-json"|"tabular"|"yaml") (default "tabular")
  -h, --help            help for edit

Global Flags:
      --api-key string             API key to use for authentication
      --api-url string             host URL of Sensu installation
      --cache-dir string           path to directory containing cache & temporary files (default "/home/vagrant/.cache/sensu/sensuctl")
      --config-dir string          path to directory containing configuration files (default "/home/vagrant/.config/sensu/sensuctl")
      --insecure-skip-tls-verify   skip TLS certificate verification (not recommended!)
      --namespace string           namespace in which we perform actions (default "default")
      --timeout duration           timeout when communicating with sensu backend (default 15s)
      --trusted-ca-file string     TLS CA certificate bundle in PEM format
{{< /code >}}

### sensuctl edit resource types

Use the `sensuctl edit` command with any of the following resource types:

| sensuctl edit types |   | |
--------------------|---|---|---
[`asset`][12] | [`auth`][39] | [`check`][13] | [`cluster`][7]
[`cluster-role`][43] | [`cluster-role-binding`][45] | [`entity`][14] | [`event`][15]
[`filter`][16] | [`handler`][17] | [`hook`][18] | [`mutator`][19]
[`namespace`][21] | [`pipelines`][9] | [`role`][35] | [`role-binding`][44]
[`silenced`][20] | [`user`][22]
 
## Manage resources

Sensuctl provides the commands listed below for managing individual Sensu resources.
Combine the resource command with a [subcommand][23] to complete operations like listing all checks or deleting a specific silence.

- [`sensuctl asset`][12]
- [`sensuctl auth`][39] (commercial feature)
- [`sensuctl check`][13]
- [`sensuctl cluster`][7]
- [`sensuctl cluster-role`][43]
- [`sensuctl cluster-role-binding`][45]
- [`sensuctl entity`][14]
- [`sensuctl event`][15]
- [`sensuctl filter`][16]
- [`sensuctl handler`][17]
- [`sensuctl hook`][18]
- [`sensuctl license`][34] (commercial feature)
- [`sensuctl mutator`][19]
- [`sensuctl namespace`][21]
- [`sensuctl pipelines`][9]
- [`sensuctl role`][35]
- [`sensuctl role-binding`][44]
- [`sensuctl secrets`][28]
- [`sensuctl silenced`][20]
- [`sensuctl tessen`][27]
- [`sensuctl user`][22]

### Subcommands

Sensuctl provides a set of operation subcommands for each resource type.

To view the supported subcommands for a resource type, run the resource command followed by the help flag, `-h`.
For example, to view the subcommands for `sensuctl check`, run:

{{< code shell >}}
sensuctl check -h
{{< /code >}}

The response includes a usage example, the supported command-specific and global flags, and a list of supported subcommands.

Many resource types include a standard set of list, info, and delete operation subcommands:

{{< code text >}}
delete                     delete resource given resource name
info                       show detailed resource information given resource name
list                       list resources
{{< /code >}}

{{% notice note %}}
**NOTE**: The delete, info, and list subcommands are not supported for all resource types.
Run `sensuctl <TYPE> -h` to confirm which subcommands are supported for a specific resource type.
You can also configure [shell completion for sensuctl](../#use-shell-autocompletion-with-sensuctl) to view available variables for sensuctl commands.
{{% /notice %}}

Use the commands with their flags and subcommands to get more information about your resources.
For example, to list all monitoring checks:

{{< code shell >}}
sensuctl check list
{{< /code >}}

To list checks from all namespaces:

{{< code shell >}}
sensuctl check list --all-namespaces
{{< /code >}}

To write all checks to `my-resources.yml` in `yaml` format or to `my-resources.json` in `wrapped-json` format:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl check list --format yaml > my-resources.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl check list --format wrapped-json > my-resources.json
{{< /code >}}

{{< /language-toggle >}}

To view the definition for a check named `check-cpu`:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl check info check-cpu --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl check info check-cpu --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

To delete the definition for a check named `check-cpu`:

{{< code shell >}}
sensuctl check delete check-cpu
{{< /code >}}

In addition to the delete, info, and list operations, many commands support flags and subcommands that allow you to take special action based on the resource type.
The sections below describe some of the resource-specific operations.

Run `sensuctl <TYPE> -h` to retrieve a complete list of the supported flags and subcommands for a specific resource command.
You can also configure [shell completion for sensuctl][46] to view available variables for sensuctl commands.

#### Handle large datasets

When querying sensuctl for large datasets, use the `--chunk-size` flag with any `list` command to avoid timeouts and improve performance.

For example, the following command returns the same output as `sensuctl event list` but makes multiple API queries (each for the number of objects specified by `--chunk-size`) instead of one API query for the complete dataset:

{{< code shell >}}
sensuctl event list --chunk-size 500
{{< /code >}}

#### Execute a check on demand

The `sensuctl check execute` command executes the specified check on demand:

{{< code shell >}}
sensuctl check execute <CHECK_NAME>
{{< /code >}}

For example, the following command executes the `check-cpu` check with an attached message:

{{< code shell >}}
sensuctl check execute check-cpu --reason "giving a sensuctl demo"
{{< /code >}}

You can also use the `--subscriptions` flag to override the subscriptions in the check definition:

{{< code shell >}}
sensuctl check execute check-cpu --subscriptions demo,webserver
{{< /code >}}

#### Manage a Sensu cluster

The `sensuctl cluster` command lets you manage a Sensu cluster with the following subcommands:

{{< code text >}}
health         get sensu health status
id             show sensu cluster id
member-add     add cluster member to an existing cluster, with comma-separated peer addresses
member-list    list cluster members
member-remove  remove cluster member by ID
member-update  update cluster member by ID with comma-separated peer addresses
{{< /code >}}

To view cluster members:

{{< code shell >}}
sensuctl cluster member-list
{{< /code >}}

To review the health of your Sensu cluster:

{{< code shell >}}
sensuctl cluster health
{{< /code >}}

#### Manually resolve events

Use `sensuctl event resolve` to manually resolve events:

{{< code shell >}}
sensuctl event resolve <ENTITY_NAME> <CHECK_NAME>
{{< /code >}}

For example, the following command manually resolves an event created by the entity `webserver1` and the check `check-http`:

{{< code shell >}}
sensuctl event resolve webserver1 check-http
{{< /code >}}

#### Use the sensuctl namespace command

The sensuctl namespace commands have a few special characteristics that you should be aware of.

**sensuctl namespace create**

Namespace names can contain alphanumeric characters and hyphens and must begin and end with an alphanumeric character.

**senscutl namespace list**

In the packaged Sensu Go distribution, `sensuctl namespace list` lists only the namespaces for which the current user has access.

**sensuctl namespace delete**

Namespaces must be empty before you can delete them.
If the response to `sensuctl namespace delete` is `Error: resource is invalid: namespace is not empty`, the namespace may still contain events or other resources.

To remove all resources and events so that you can delete a namespace, run this command (replace `<NAMESPACE_NAME>` with the namespace you want to empty):

{{< code shell >}}
sensuctl dump entities,events,assets,checks,filters,handlers,secrets/v1.Secret --namespace <NAMESPACE_NAME> | sensuctl delete
{{< /code >}}

## Prune resources

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access sensuctl pruning in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

The `sensuctl prune` subcommand allows you to delete resources that do not appear in a given set of Sensu objects (called a "configuration") from a from a file, URL, or stdin.
For example, you can use `sensuctl create` to to apply a new configuration, then use `sensuctl prune` to prune unneeded resources, resources that were created by a specific user or that include a specific label selector, and more.

{{% notice note %}}
**NOTE**: `sensuctl prune` is an alpha feature and may include breaking changes.<br><br>
`sensuctl prune` can only delete resources that have the label `sensu.io/managed_by: sensuctl`, which Sensu automatically adds to all resources created with sensuctl.
This means you can only use `sensuctl prune` to delete resources that were created with sensuctl.
{{% /notice %}}

The pruning operation always follows the role-based access control (RBAC) permissions of the current user.
For example, to prune resources in the `dev` namespace, the current user who sends the prune command must have delete access to the `dev` namespace.

### Supported resource types

To retrieve the supported `sensuctl prune` resource types, run:

{{< code shell >}}
sensuctl describe-type all
{{< /code >}}

The response will list all supported `sensuctl prune` resource types:

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

{{% notice note %}}
**NOTE**: Short names are only supported for core/v2 resources.
{{% /notice %}}

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
`-o` or `--omit` | Resources that should be excluded from being pruned.
`-r` or `--recursive` | Prune command will follow subdirectories.
`-u` or `--users` | Prunes only resources that were created by the specified users (comma-separated strings). Defaults to the currently configured sensuctl user.

### sensuctl prune usage

{{< code shell >}}
sensuctl prune <RESOURCE_TYPE>,<RESOURCE_TYPE>... -f <FILE_OR_URL> [-r] ... ] --namespace <NAMESPACE> <FLAGS>
{{< /code >}}

In this example `sensuctl prune` command:

- Replace `<RESOURCE_TYPE>` with the [fully qualified name or short name][10] of the resource you want to prune.
You must specify at least one resource type or the `all` qualifier (to prune all resource types).
- Replace `<FILE_OR_URL>` with the name of the file or the URL that contains the set of Sensu objects you want to keep (the configuration).
- Replace `<NAMESPACE>` with the namespace where you want to apply pruning.
  If you omit the namespace qualifier, the command defaults to the current configured namespace.
- Replace `<FLAGS>` with the other flags you want to use, if any.

Use a comma separator to prune more than one resource in a single command.
For example, to prune checks and dynamic runtime assets from the file `checks.yaml` or `checks.json` for the `dev` namespace and the `admin` and `ops` users:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl prune core/v2.CheckConfig,core/v2.Asset --file checks.yaml --namespace dev --users admin,ops
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl prune core/v2.CheckConfig,core/v2.Asset --file checks.json --namespace dev --users admin,ops
{{< /code >}}

{{< /language-toggle >}}

`sensuctl prune` supports pruning resources by their fully qualified names or short names:

Fully qualified names:

{{< code shell >}}
sensuctl prune core/v2.CheckConfig,core/v2.Entity
{{< /code >}}

Short names:

{{< code shell >}}
sensuctl prune checks,entities
{{< /code >}}

Use the `all` qualifier to prune all supported resources:

{{< code shell >}}
sensuctl prune all
{{< /code >}}

Use the `--omit` flag to identify resources you want to exclude from being pruned:

{{< code shell >}}
sensuctl prune all --omit core/v2.Role,core/v2.RoleBinding,core/v2.ClusterRole,core/v2.ClusterRoleBinding
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

* [RFC 3339][42] with numeric zone offset: `2018-05-10T07:04:00-08:00` or
  `2018-05-10T15:04:00Z`
* [RFC 3339][42] with space delimiters and numeric zone offset: `2018-05-10 07:04:00
  -08:00`
* Sensu alpha legacy format with canonical zone ID: `May 10 2018 7:04AM
  America/Vancouver`


[1]: ../../operations/control-access/rbac/
[2]: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
[3]: #sensuctl-create-resource-types
[4]: ../#preferred-output-format
[5]: #sensuctl-edit-resource-types
[6]: ../../reference/
[7]: ../../operations/deploy-sensu/cluster-sensu/
[8]: ../../operations/control-access/rbac/#user-specification
[9]: ../../observability-pipeline/observe-process/pipelines/
[10]: #supported-resource-types
[11]: ../../web-ui/webconfig-reference/
[12]: ../../plugins/assets/
[13]: ../../observability-pipeline/observe-schedule/checks/
[14]: ../../observability-pipeline/observe-entities/entities/
[15]: ../../observability-pipeline/observe-events/events/
[16]: ../../observability-pipeline/observe-filter/filters/
[17]: ../../observability-pipeline/observe-process/handlers/
[18]: ../../observability-pipeline/observe-schedule/hooks/
[19]: ../../observability-pipeline/observe-transform/mutators/
[20]: ../../observability-pipeline/observe-process/silencing/
[21]: ../../operations/control-access/namespaces/
[22]: ../../operations/control-access/rbac#users
[23]: #subcommands
[24]: ../../operations/manage-secrets/secrets-providers/
[25]: ../../operations/control-access/ad-auth/
[26]: ../../operations/control-access/ldap-auth/
[27]: ../../operations/monitor-sensu/tessen/
[28]: ../../operations/manage-secrets/secrets/
[29]: ../../operations/deploy-sensu/etcdreplicators/
[30]: ../../commercial/
[31]: ../#manage-sensuctl
[32]: ../../operations/deploy-sensu/datastore/
[33]: #create-resources-across-namespaces
[34]: ../../operations/maintain-sensu/license/
[35]: ../../operations/control-access/rbac/#roles
[36]: #sensuctl-create-flags
[37]: ../../operations/control-access/oidc-auth/
[38]: ../../operations/control-access/rbac/#namespaced-resource-types
[39]: ../../operations/control-access/sso/
[40]: ../../observability-pipeline/observe-process/sumo-logic-metrics-handlers/
[41]: ../../observability-pipeline/observe-process/tcp-stream-handlers/
[42]: https://www.ietf.org/rfc/rfc3339.txt
[43]: ../../operations/control-access/rbac/#cluster-roles
[44]: ../../operations/control-access/rbac/#role-bindings
[45]: ../../operations/control-access/rbac/#cluster-role-bindings
[46]: ../#use-shell-autocompletion-with-sensuctl
