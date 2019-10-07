---
title: "Sensuctl"
linkTitle: "Reference"
description: "Sensuctl is a command line tool for managing resources within Sensu. It works by calling Sensu’s underlying API to create, read, update, and delete resources, events, and entities. Read the reference doc to learn about sensuctl."
weight: 2
version: "5.13"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.13:
    parent: sensuctl
---

- [First-time setup](#first-time-setup)
- [Managing sensuctl](#managing-sensuctl)
- [Creating resources](#creating-resources)
- [Deleting resources](#deleting-resources)
- [Updating resources](#updating-resources)
- [Exporting resources](#exporting-resources)
- [Managing resources](#managing-resources)
- [Filtering](#filtering) (licensed tier)
- [Time formats](#time-formats)
- [Shell auto-completion](#shell-auto-completion)
- [Config files](#configuration-files)
- [Interacting with Bonsai](#interacting-with-bonsai)

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

### Non-interactive

You can run `sensuctl configure` non-interactively using the `-n` (`--non-interactive`) flag.

{{< highlight shell >}}
sensuctl configure -n --url http://127.0.0.1:8080 --username admin --password P@ssw0rd! --format tabular
{{< /highlight >}}

## Managing sensuctl

The `sencutl config` command lets you view the current sensuctl configuration and set the namespace and output format.

### View sensuctl config
To view the active configuration for sensuctl:

{{< highlight shell >}}
sensuctl config view
{{< /highlight >}}

Sensuctl configuration includes the [Sensu backend url][9], default [output format][10] for the current user, default [namespace][11] for the current user, and currently configured username.

{{< highlight shell >}}
=== Active Configuration
API URL:   http://127.0.0.1:8080
Namespace: default
Format:    tabular
Username:  admin
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

Additionally, these flags can be set permanently by editing `.config/sensu/sensuctl/{cluster, profile}`.

## Creating resources
The `sensuctl create` command allows you to create or update resources by reading from STDIN or a flag configured file (`-f`).
The `create` command accepts Sensu resource definitions in `wrapped-json` and `yaml`.
Both JSON and YAML resource definitions wrap the contents of the resource in `spec` and identify the resource `type` (see below for an example, and [this table][3] for a list of supported types).
See the [reference docs][6] for information about creating resource definitions.

### `wrapped-json` format

The following file `my-resources.json` specifies two resources: a `marketing-site` check and a `slack` handler, separated _without_ a comma.

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

The following file `my-resources.yml` specifies two resources: a `marketing-site` check and a `slack` handler, separated with three dashes (`---`).

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
`ClusterRoleBinding`  | `cluster_role_binding` | `Entity` | `entity`
`Event` | `event` | `EventFilter` | `event_filter`
`Handler` | `handler` | `Hook` | `hook`
`HookConfig` | `hook_config` | `Mutator` | `mutator`
`Namespace` | `namespace` | `Role` | `role`
`RoleBinding` | `role_binding` | `Silenced` | `silenced`
[`ldap`][26] | [`ad`][26] | [`TessenConfig`][27] | [`PostgresConfig`][32]

### Creating resources across namespaces

By omitting the `namespace` attribute from resource definitions, you can use the `senusctl create --namespace` flag to specify the namespace for a group of resources at the time of creation, allowing you to replicate resources across namespaces without manual editing.
To learn more about namespaces and namespaced resource types, see the [RBAC reference][21].

The `sensuctl create` command applies namespaces to resources in the following order, from highest precedence to lowest:

1. **Namespaces specified within resource definitions**: You can specify a resource's namespace within individual resource definitions using the `namespace` attribute. Namespaces specified in resource definitions take precedence over all other methods.
2. **`--namespace` flag**: If resource definitions do not specify a namespace, Sensu applies the namespace provided by the `sensuctl create --namespace` flag.
3. **Current sensuctl namespace configuration**: If neither an embedded `namespace` attribute nor the `--namespace` flag is specified, Sensu applies the namespace configured in the current sensuctl session. See [managing sensuctl][31] to view your current session config and set the session namespace.

For example, the following file, `pagerduty.yml`, defines a handler _without_ a `namespace` attribute.

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

## Deleting resources

The `sensuctl delete` command allows you to delete resources by reading from STDIN or a flag configured file (`-f`).
The `delete` command accepts Sensu resource definitions in `wrapped-json` and `yaml` formats and uses the same [resources types][3] as `sensuctl create`.
To be deleted successfully, resources provided to the `delete` command must match the name and namespace of an existing resource.

To delete all resources from `my-resources.yml` using `sensuctl delete`:

{{< highlight shell >}}
sensuctl delete --file my-resources.yml
{{< /highlight >}}

Or:

{{< highlight shell >}}
cat my-resources.yml | sensuctl delete
{{< /highlight >}}

### Deleting resources across namespaces

By omitting the `namespace` attribute from resource definitions, you can use the `senusctl delete --namespace` flag to specify the namespace for a group of resources at the time of deletion, allowing you to remove resources across namespaces without manual editing.
See the section on [creating resources across namespaces][33] for usage examples.

## Updating resources

Sensuctl allows you to update resource definitions using a text editor.
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
[`auth`][26] | | |

## Exporting resources

The `sensuctl dump` command allows you to export your resources to standard out or to a file. You can choose to export all of your resources or a subset of them based on a list of resource types. The `dump` command supports exporting in `wrapped-json` and `yaml`.

_NOTE: Passwords are not included when exporting users. Operators must add the `password` attribute to any exported user resources before they can be used with `sensuctl create`._

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

_NOTE: The resource types with no synonym listed are [licensed-tier](https://sensu.io/features) features._

Synonym | Fully qualified name 
--------------------|---
None | `authentication/v2.Provider`
None | `licensing/v2.LicenseFile`
None | `store/v1.PostgresConfig`
None | `federation/v1.Replicator`
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

## Managing resources

Sensuctl provides the following commands to manage Sensu resources.

- [`sensuctl asset`][12]
- [`sensuctl auth`][26] (licensed tier)
- [`sensuctl check`][13]
- [`sensuctl cluster`][7]
- [`sensuctl cluster-role`][1]
- [`sensuctl cluster-role-binding`][1]
- [`sensuctl entity`][14]
- [`sensuctl event`][15]
- [`sensuctl filter`][16]
- [`sensuctl handler`][17]
- [`sensuctl hook`][18]
- [`sensuctl license`](../../reference/license) (licensed tier)
- [`sensuctl mutator`][19]
- [`sensuctl namespace`][1]
- [`sensuctl role`][1]
- [`sensuctl role-binding`][1]
- [`sensuctl silenced`][20]
- [`sensuctl tessen`][27]
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

In addition to the standard operations, commands may support subcommands or flags that allow you to take special action based on the resource type; the following sections call out those resource-specific operations.
For a list of subcommands specific to a resource, run `sensuctl TYPE --help`.

### Handling large datasets

When querying sensuctl for large datasets, you can use the `--chunk-size` flag with any `list` command to avoid timeouts and improve performance.
For example, the following command returns the same output as `sensuctl event list` but makes multiple API queries (each for the number of objects specified by `--chunk-size`) instead of one API query for the complete dataset.

{{< highlight shell >}}
sensuctl event list --chunk-size 500
{{< /highlight >}}

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

## Filtering

**LICENSED TIER**: Unlock sensuctl filtering with a Sensu license. To activate your license, see the [getting started guide][30].

Sensuctl supports filtering for all `list` commands using the `--label-selector` and `--field-selector` flags.
For information about the operators and fields available to use in filters, see the [API docs][28].

### Filtering syntax quick reference

| operator | description     | example                |
| -------- | --------------- | ---------------------- |
| `==`     | Equality        | `check.publish == true`
| `!=`     | Inequality      | `check.namespace != "default"`
| `in`     | Included in     | `linux in check.subscriptions`
| `notin`  | Not included in | `slack notin check.handlers`
| `&&`     | Logical AND     | `check.publish == true && slack in check.handlers`

### Filtering with labels

You can use the `--label-selector` flag to filter using custom labels.
For example, the following command returns entities with the `proxy_type` label set to `switch`.

{{< highlight shell >}}
sensuctl entity list --label-selector 'proxy_type == switch'
{{< /highlight >}}

### Filtering with resource attributes

You can use the `--field-selector` flag to filter using selected resource attributes.
To see the resource attributes available to use in filter statements, see the [API docs][29].

For example, the following command returns entities with the `switches` subscription.

{{< highlight shell >}}
sensuctl entity list --field-selector 'switches in entity.subscriptions'
{{< /highlight >}}

You can also combine the `--label-selector` and `--field-selector` flags.
For example, the following command returns checks with the `region` label set to `us-west-1` and the `slack` handler.

{{< highlight shell >}}
sensuctl check list --label-selector 'region == "us-west-1"' --field-selector 'slack in check.handlers'
{{< /highlight >}}

## Time formats

Sensuctl supports multiple time formats depending on the manipulated resource.
Supported canonical time zone IDs are defined in the [tz database][2].

_WARNING: Canonical zone IDs (i.e. `America/Vancouver`) are not supported on
Windows._

### Dates with time

Full dates with time are used to specify an exact point in time, which can be
used with silences, for example. The following formats are supported:

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

## Environment variables

Sensuctl includes `sensuctl env` command to help in exporting and setting environment variables on your systems.

### Usage

{{< language-toggle >}}

{{< highlight bash >}}
sensuctl env
export SENSU_API_URL="http://127.0.0.1:8080"
export SENSU_NAMESPACE="default"
export SENSU_FORMAT="tabular"
export SENSU_ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x.x"
export SENSU_ACCESS_TOKEN_EXPIRES_AT="1567716187"
export SENSU_REFRESH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x.x"
export SENSU_TRUSTED_CA_FILE=""
export SENSU_INSECURE_SKIP_TLS_VERIFY="true"
# Run this command to configure your shell:
# eval $(sensuctl env)
{{< /highlight >}}

{{< highlight cmd >}}
sensuctl env --shell cmd
SET SENSU_API_URL=http://127.0.0.1:8080
SET SENSU_NAMESPACE=default
SET SENSU_FORMAT=tabular
SET SENSU_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x.x
SET SENSU_ACCESS_TOKEN_EXPIRES_AT=1567716676
SET SENSU_REFRESH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x.x
SET SENSU_TRUSTED_CA_FILE=
SET SENSU_INSECURE_SKIP_TLS_VERIFY=true
REM Run this command to configure your shell:
REM 	@FOR /f "tokens=*" %i IN ('sensuctl env --shell cmd') DO @%i
{{< /highlight >}}

{{< highlight powershell >}}
sensuctl env --shell powershell
$Env:SENSU_API_URL = "http://127.0.0.1:8080"
$Env:SENSU_NAMESPACE = "default"
$Env:SENSU_FORMAT = "tabular"
$Env:SENSU_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x.x"
$Env:SENSU_ACCESS_TOKEN_EXPIRES_AT = "1567716738"
$Env:SENSU_REFRESH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x.x"
$Env:SENSU_TRUSTED_CA_FILE = ""
$Env:SENSU_INSECURE_SKIP_TLS_VERIFY = "true"
# Run this command to configure your shell:
# & sensuctl env --shell powershell | Invoke-Expression
{{< /highlight >}}

{{< /language-toggle >}}

## Configuration files

During configuration, sensuctl creates configuration files that contain information for connecting to your Sensu Go deployment. You can find them at `$HOME/.config/sensu/sensuctl/profile` and `$HOME/.config/sensu/sensuctl/cluster`. For example:

{{< highlight shell >}}
cat .config/sensu/sensuctl/profile
{
  "format": "tabular",
  "namespace": "demo",
  "username": "admin"
}
{{< /highlight >}}

{{< highlight shell >}}
cat .config/sensu/sensuctl/cluster 
{
  "api-url": "http://localhost:8080",
  "trusted-ca-file": "",
  "insecure-skip-tls-verify": false,
  "access_token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "expires_at": 1550082282,
  "refresh_token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
{{< /highlight >}}

These are useful if you want to know what cluster you're connecting to, or what namespace or username you're currently configured to use.

## Interacting with Bonsai

Sensuctl supports both installing asset definitions directly from [Bonsai][34] and checking your Sensu backend for outdated assets.

### Usage

To install an asset definition directly from Bonsai, use `sensuctl asset add [NAME][:VERSION]`, replacing `[NAME]` with the name of the asset from Bonsai. `[:VERSION]` is only required if you require a specific version or are pinning to a specific version. 

{{< highlight shell >}}
sensuctl asset add sensu/sensu-influxdb-handler:3.1.1
fetching bonsai asset: sensu/sensu-influxdb-handler:3.1.1
added asset: sensu/sensu-influxdb-handler:3.1.1
{{< /highlight >}}

You can also use the `--rename` flag to rename the asset on install.

{{< highlight shell >}}
sensuctl asset add sensu/sensu-slack-handler --rename slack-handler
no version specified, using latest: 1.0.3
fetching bonsai asset: sensu/sensu-slack-handler:1.0.3
added asset: sensu/sensu-slack-handler:1.0.3
{{< /highlight >}}

To check your Sensu backend for assets which have newer versions available on Bonsai, use `sensuctl asset outdated`. This will print a list of assets installed in the backend whose version is older than the newest version available on Bonsai.
{{< highlight shell >}}
sensuctl asset outdated
          Asset Name                  Bonsai Asset          Current Version  Latest Version
----------------------------  ----------------------------  ---------------  --------------
sensu/sensu-influxdb-handler  sensu/sensu-influxdb-handler       3.1.1            3.1.2
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
[26]: ../../installation/auth
[27]: ../../reference/tessen
[28]: ../../api/overview#filtering
[29]: ../../api/overview#field-selector
[30]: ../../getting-started/enterprise
[31]: #managing-sensuctl
[32]: ../../reference/datastore
[33]: #creating-resources-across-namespaces
[34]: https://bonsai.sensu.io/
