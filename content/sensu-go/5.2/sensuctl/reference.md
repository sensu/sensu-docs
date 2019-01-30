---
title: "Sensuctl"
linkTitle: "Reference"
description: "The sensuctl reference guide"
weight: 2
version: "5.2"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.2:
    parent: sensuctl
---

- [First-time setup](#first-time-setup)
- [Managing sensuctl](#managing-sensuctl)
- [Creating resources](#creating-resources)
- [Editing resources](#editing-resources)
- [Managing resources](#managing-resources)
- [Time formats](#time-formats)
- [Shell auto-completion](#shell-auto-completion)

Sensuctl is a command line tool for managing resources within Sensu. It works by
calling Sensu's underlying API to create, read, update, and delete resources,
events, and entities. Sensuctl is available for Linux, macOS, and Windows.
See the [installation guide][4] to install and configure sensuctl.

### Getting help

Sensuctl supports a `--help` flag for each command and subcommand.

{{< highlight shell >}}
# See command and global flags
sensuctl --help

# See subcommands and flags
sensuctl check --help

# See usage and flags
sensuctl check delete --help
{{< /highlight >}}

## First-time setup

To set up sensuctl, run `sensuctl configure` to log in to sensuctl and connect to the Sensu backend.

{{< highlight shell >}}
sensuctl configure
{{< /highlight >}}

When prompted, input the [Sensu backend URL][9] and your [Sensu access credentials][11].

{{< highlight shell >}}
? Sensu Backend URL: http://127.0.0.1:8080
? Username: admin
? Password: P@ssw0rd!
? Namespace: default
? Preferred output format: tabular
{{< /highlight >}}

### Sensu backend URL

The HTTP or HTTPS URL where sensuctl can connect to the Sensu backend server, defaulting to `http://127.0.0.1:8080`.
When connecting to a [Sensu cluster][7], connect sensuctl to any single backend in the cluster.
For more information on configuring the Sensu backend URL, see the [backend reference][5].

### Username | password | namespace

By default, Sensu includes a user named `admin` with password `P@ssw0rd!` and a `default` namespace.
Your ability to get, list, create, update, and delete resources with sensuctl depends on the permissions assigned to your Sensu user.
For more information about configuring Sensu access control, see the [RBAC reference][1].

### Preferred output format

Sensuctl supports the following output formats:

- `tabular`: user-friendly, columnar format
- `wrapped-json`: accepted format for use with [`sensuctl create`][8]
- `yaml`: accepted format for use with [`sensuctl create`][8]
- `json`: format used by the [Sensu API][25]

Once logged in, you can change the output format using `sensuctl config set-format` or set it per command using the `--format` flag.

## Managing sensuctl

The `sencutl config` command lets you view the current sensuctl configuration and set the namespace and output format.

### View sensuctl config
To view the active configuration for sensuctl:

{{< highlight shell >}}
sensuctl config view
{{< /highlight >}}

Sensuctl configuration includes the [Sensu backend url][9], Sensu edition (Core or Enterprise), the default [output format][10] for the current user, and the default [namespace][11] for the current user.

{{< highlight shell >}}
api-url: http://127.0.0.1:8080
edition: core
format: wrapped-json
namespace: default
{{< /highlight >}}

### Set output format

You can use the `set-format` command to change the default [output format][10] for the current user.
For example, to change the output format to `tabular`:

{{< highlight shell >}}
sensuctl config set-format tabular
{{< /highlight >}}

### Set namespace

You can use the `set-namespace` command to change the default [namespace][11] for the current user.
For more information about configuring Sensu access control, see the [RBAC reference][1].
For example, to change the default namespace to `development`:

{{< highlight shell >}}
sensuctl config set-namespace development
{{< /highlight >}}

### Log out of sensuctl

To log out of sensuctl:

{{< highlight shell >}}
sensuctl logout
{{< /highlight >}}

To log back in:

{{< highlight shell >}}
sensuctl configure
{{< /highlight >}}

### View the sensuctl version number

To display the current version of sensuctl:

{{< highlight shell >}}
sensuctl version
{{< /highlight >}}

### Global flags
Global flags modify settings specific to sensuctl, such as the Sensu backend URL and [namespace][11].
You can use global flags with most sensuctl commands.

{{< highlight shell >}}
--api-url string             host URL of Sensu installation
--cache-dir string           path to directory containing cache & temporary files
--config-dir string          path to directory containing configuration files
--insecure-skip-tls-verify   skip TLS certificate verification (not recommended!)
--namespace string           namespace in which we perform actions
--trusted-ca-file string     TLS CA certificate bundle in PEM format
{{< /highlight >}}

Additionally, these flags can be set permanently by editing `$HOME/.config/sensu/sensuctl/{cluster.json, profile.json}`.

## Creating resources
The `sensuctl create` command allows you to create or update resources by reading from STDIN or a flag configured file (`-f`).
The `create` command accepts Sensu resource definitions in `wrapped-json` and `yaml`.
Both JSON and YAML resource definitions wrap the contents of the resource in `spec` and identify the resource `type` (see below for an example, and [this table][3] for a list of supported types).
See the [reference docs][6] for information about creating resource definitions.

For example, the following file `my-resources.json` specifies two resources: a `marketing-site` check and a `slack` handler.

{{< highlight shell >}}
{
  "type": "CheckConfig",
  "spec": {
    "command": "check-http.go -u https://dean-learner.book",
    "subscriptions": ["demo"],
    "interval": 15,
    "handlers": ["slack"],
    "metadata" : {
      "name": "marketing-site",
      "namespace": "default"
    }
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

_NOTE: Commas cannot be included between JSON resource definitions when using `sensuctl create`._

To create all resources from `my-resources.json` using `sensuctl create`:

{{< highlight shell >}}
sensuctl create --file my-resources.json
{{< /highlight >}}

Or:

{{< highlight shell >}}
cat my-resources.json | sensuctl create
{{< /highlight >}}

### sensuctl create resource types

|sensuctl create types |   |   |   |
--------------------|---|---|---|
`AdhocRequest` | `adhoc_request` | `Asset` | `asset`
`CheckConfig` | `check_config` | `ClusterRole`  | `cluster-role`
`ClusterRoleBinding`  | `cluster-role-binding` | `Entity` | `entity`
`Event` | `event` | `EventFilter` | `event_filter`
`Handler` | `handler` | `Hook` | `hook`
`HookConfig` | `hook_config` | `Mutator` | `mutator`
`Namespace` | `namespace` | `Role` | `role`
`RoleBinding` | `role-binding` | `Silenced` | `silenced`

## Editing resources

Sensuctl allows you to edit resource definitions using a text editor.
To use `sensuctl edit`, specify the resource [type][24] and resource name.

For example, to edit a handler named `slack` using `sensuctl edit`:

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

## Managing resources

Sensuctl provides the following commands to manage Sensu resources.

- [`sensuctl asset`][12]
- [`sensuctl check`][13]
- [`sensuctl cluster`][7]
- [`sensuctl cluster-role`][1]
- [`sensuctl cluster-role-binding`][1]
- [`sensuctl entity`][14]
- [`sensuctl event`][15]
- [`sensuctl filter`][16]
- [`sensuctl handler`][17]
- [`sensuctl hook`][18]
- [`sensuctl mutator`][19]
- [`sensuctl namespace`][1]
- [`sensuctl role`][1]
- [`sensuctl role-binding`][1]
- [`sensuctl silenced`][20]
- [`sensuctl user`][1]

### Subcommands
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

To write all checks to `my-resources.json` in `wrapped-json` format:

{{< highlight shell >}}
sensuctl check list --format wrapped-json > my-resources.json
{{< /highlight >}}

To see the definition for a check named `check-cpu` in [`wrapped-json` format][10]:

{{< highlight shell >}}
sensuctl check info check-cpu --format wrapped-json
{{< /highlight >}}

In addition to the standard operations, commands may support subcommands or flags that allow you to take special action based on the resource type; the following sections call out those resource-specific operations.
For a list of subcommands specific to a resource, run `sensuctl TYPE --help`.

#### sensuctl check

In addition to the [standard subcommands][23], sensuctl provides a command to execute a check on demand, given the check name.

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

#### sensuctl cluster

The `sensuctl cluster` command lets you manage a Sensu cluster using the following subcommands.

{{< highlight shell >}}
health           get sensu health status
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

#### sensuctl event

In addition to the [standard subcommands][23], sensuctl provides a command to resolve an event.

{{< highlight shell >}}
sensuctl event resolve ENTITY CHECK
{{< /highlight >}}

For example, the following command manually resolves an event created by the entity `webserver1` and the check `check-http`:

{{< highlight shell >}}
sensuctl event resolve webserver1 check-http
{{< /highlight >}}

#### sensuctl namespace

See the [RBAC reference][21] for information about using access control with namespaces.

#### sensuctl user

See the [RBAC reference][22] for information about local user management with sensuctl.

## Time formats

Sensuctl supports multiple time formats depending on the manipulated resource.
Supported canonical time zone IDs are defined in the [tz database][2].

_WARNING: Canonical zone IDs (i.e. `America/Vancouver`) are not supported on
Windows._

### Dates with time

Full dates with time are used to specify an exact point in time, which can be
used with silencing entries, for example. The following formats are supported:

* RFC3339 with numeric zone offset: `2018-05-10T07:04:00-08:00` or
  `2018-05-10T15:04:00Z`
* RFC3339 with space delimiters and numeric zone offset: `2018-05-10 07:04:00
  -08:00`
* Sensu alpha legacy format with canonical zone ID: `May 10 2018 7:04AM
  America/Vancouver`

## Shell auto-completion

### Installation (Bash Shell)

Make sure bash completion is installed. If you use a current Linux
in a non-minimal installation, bash completion should be available.
On macOS, install with:

{{< highlight shell >}}
brew install bash-completion
{{< /highlight >}}

Then add the following to your `~/.bash_profile`:

{{< highlight shell >}}
if [ -f $(brew --prefix)/etc/bash_completion ]; then
. $(brew --prefix)/etc/bash_completion
fi
{{< /highlight >}}

Once bash-completion is available, add the following to your `~/.bash_profile`:

{{< highlight shell >}}
source <(sensuctl completion bash)
{{< /highlight >}}

You can now source your `~/.bash_profile` or launch a new terminal to utilize completion.

{{< highlight shell >}}
source ~/.bash_profile
{{< /highlight >}}

### Installation (ZSH)

Add the following to your `~/.zshrc`:

{{< highlight shell >}}
source <(sensuctl completion zsh)
{{< /highlight >}}

You can now source your `~/.zshrc` or launch a new terminal to utilize completion.

{{< highlight shell >}}
source ~/.zshrc
{{< /highlight >}}

### Usage

`sensuctl` <kbd>Tab</kbd>

{{< highlight shell >}}
check       configure   event       user
asset       completion  entity      handler
{{< /highlight >}}

`sensuctl check` <kbd>Tab</kbd>

{{< highlight shell >}}
create  delete  import  list
{{< /highlight >}}

[1]: ../../reference/rbac
[2]: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
[3]: #sensuctl-create-resource-types
[4]: ../../installation/install-sensu/#install-sensuctl
[5]: ../../reference/agent/#general-configuration-flags
[6]: ../../reference
[7]: ../../guides/clustering
[8]: #creating-resources
[9]: #sensu-backend-url
[10]: #preferred-output-format
[11]: #username-password-namespace
[12]: ../../reference/assets
[13]: ../../reference/checks
[14]: ../../reference/entities
[15]: ../../reference/events
[16]: ../../reference/filters
[17]: ../../reference/handlers
[18]: ../../reference/hooks
[19]: ../../reference/mutators
[20]: ../../reference/silencing
[21]: ../../reference/rbac#namespaces
[22]: ../../reference/rbac#users
[23]: #subcommands
[24]: #sensuctl-edit-resource-types
[25]: ../../api/overview
