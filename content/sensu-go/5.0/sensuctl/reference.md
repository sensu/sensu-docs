---
title: "Sensuctl"
linkTitle: "Reference"
description: "The sensuctl reference guide"
weight: 1
version: "5.0"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.0:
    parent: sensuctl
aliases:
  - /sensu-go/5.0/getting-started/configuring-sensuctl/
  - /sensu-go/5.0/reference/sensuctl/
---

- [Install and configure sensuctl][4]
- [Commands](#commands)
- [Subcommands](#subcommands)
- [Flags](#flags)
- [Output](#output)
- [Time formats](#time-formats)
- [Getting help](#getting-help)
- [Creating resources](#create)
- [Editing resources](#edit)
- [Shell auto-completion](#shell-auto-completion)

## How does sensuctl work?
Sensuctl is a command line tool for managing resources within Sensu. It works by
calling Sensu's underlying API to create, read, update, and delete resources,
events, and entities.

## Sensuctl specification
* Allows CRUD management of resources with options interactively or with flags
* Displays output in JSON or tabular format

## Command syntax
`sensuctl` uses the following syntax to run commands:
{{< highlight shell >}}
sensuctl [TYPE] [command] [NAME] [flags]
{{< /highlight >}}

* `TYPE`: specifies the resource type you would like to manage or view, such as
  `check`, `user`, `event`, etc.
* `command`: specifies what type of operation on a resource, such as `create`, `read`, `update`, `delete`
* `NAME`: specifies the name of the resource.
* `flags`: specifies modifier flags.

## Commands
To get the full list of commands available in `sensuctl`, run `sensuctl -h` at
the command prompt.

Sensuctl has a few commands to configure and get info about the `sensuctl`
command line tool:
{{< highlight line >}}
Commands:
  completion   Output shell completion code for the specified shell (bash or zsh)
  configure    Initialize sensuctl configuration
  import       import resources from STDIN
  logout       Logout from sensuctl
  version      Show the sensu-ctl version information
{{< /highlight >}}

As well as commands to manage sensu resources:
{{< highlight shell >}}
Management Commands:
  asset        Manage assets
  check        Manage checks
  config       Modify sensuctl configuration
  entity       Manage entities
  event        Manage events
  filter       Manage filters
  handler      Manage handlers
  hook         Manage hooks
  mutator      Manage mutators
  namespace    Manage namespaces
  role         Manage roles
  silenced     Manage silenced subscriptions and checks
  user         Manage users
{{< /highlight >}}

## Subcommands
Management commands have secondary commands that can create or modify attributes on
resources. For a list of subcommands specific to a resource, run `sensuctl
[TYPE] -h`. Most commands should have at the following CRUD operations available:

{{< highlight shell >}}
create                     create new [TYPE] 
delete                     delete [TYPE] given name
info                       show detailed [TYPE] information
list                       list [TYPE]
update                     update [TYPE]
{{< /highlight >}}

In addition to the standard management commands, management commands may have single 
use commands that allow you to set or remove a particular attribute on a resource. For example, 
the `check` command has the following list of subcommands available:

{{< highlight line >}}
Commands:
  remove-handlers            removes handlers from a check
  remove-high-flap-threshold removes high flap threshold from a check
  remove-hook                removes a hook from a check
  remove-low-flap-threshold  removes low flap threshold from a check
  remove-proxy-entity-id     removes proxy entity id from a check
  remove-proxy-requests      removes proxy requests from a check
  remove-runtime-assets      removes runtime assets from a check
  remove-timeout             removes timeout from a check
  remove-ttl                 removes ttl from a check
  set-command                set command of a check
  set-cron                   set cron of a check
  set-handlers               set handlers of a check
  set-high-flap-threshold    set high flap threshold of a check
  set-hooks                  set hooks of a check
  set-interval               set interval of a check
  set-low-flap-threshold     set low flap threshold of a check
  set-proxy-entity-id        set proxy entity id of a check
  set-proxy-requests         set proxy requests for a check from file or stdin
  set-publish                set publish of a check
  set-runtime-assets         set runtime assets of a check
  set-stdin                  set stdin of a check
  set-subscriptions          set subscriptions of a check
  set-timeout                set timeout of a check
  set-ttl                    set ttl of a check
{{< /highlight >}}

## Flags

### Global
Global flags modify settings specific to `sensuctl`, such as a Sensu host URL or
[RBAC][1] information.

{{< highlight shell >}}
--api-url string        host URL of Sensu installation
--cache-dir string      path to directory containing cache & temporary files 
--config-dir string     path to directory containing configuration files
--namespace string   namespace in which we perform actions (default "default")
{{< /highlight >}}

### Local
Local flags modify attributes on resources within Sensu. They differ per
operation and per resource. Many, but not all, flags have shorthand flag
equivalents. A list of flags can be found by running `sensuctl [TYPE] [command] -h`. 
For example, the `check` command has the following local flags:

{{< highlight line >}}
  -c, --command string               the command the check should run
      --cron string                  the cron schedule at which the check is run
      --handlers string              comma separated list of handlers to invoke when check fails
  -h, --help                         help for create
      --high-flap-threshold string   flap detection high threshold (percent state change) for the check
      --interactive                  Determines if CLI is in interactive mode
  -i, --interval string              interval, in seconds, at which the check is run
      --low-flap-threshold string    flap detection low threshold (percent state change) for the check
      --proxy-entity-id string       the check proxy entity, used to create a proxy entity for an external resource
  -p, --publish                      publish check requests (default true)
  -r, --runtime-assets string        comma separated list of assets this check depends on
      --stdin                        accept event data via STDIN
  -s, --subscriptions string         comma separated list of topics check requests will be sent to
  -t, --timeout string               timeout, in seconds, at which the check has to run
      --ttl string                   time to live in seconds for which a check result is valid
{{< /highlight >}}

## Output

sensuctl can be configured to return JSON instead of the default human-readable
format:

{{< highlight shell >}}
sensuctl check info marketing-site --format wrapped-json
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "CheckConfig",
  "spec": {
    "interval": 10,
    "subscriptions": [
      "web"
    ],
    "command": "check-http.rb -u https://dean-learner.book",
    "handlers": [
      "slack"
    ],
    "runtime_assets": [],
    "metadata" : {
      "name": "marketing-site",
      "namespace": "default"
    }
  }
}
{{< /highlight >}}

If you do not want to explicitly use the format flag with each command, you can
set the global default:

{{< highlight shell >}}
sensuctl config set-format json
{{< /highlight >}}

To write all checks to `my-resources.json` in `wrapped-json` format:

{{< highlight shell >}}
sensuctl check list --format wrapped-json > my-resources.json
{{< /highlight >}}

## Time formats

sensuctl supports multiple time formats, varying depending on the manipulated
resource.

Supported canonical time zone IDs are defined in the [tz database][2].

_WARNING: Canonical zone IDs (i.e. `America/Vancouver`) are not supported on
Windows._

### Dates with time

Full dates with time are used to specify an exact point in time, which can be
used with silenced entries for example. The following formats are supported:

* RFC3339 with numeric zone offset: `2018-05-10T07:04:00-08:00` or
  `2018-05-10T15:04:00Z` 
* RFC3339 with space delimiters and numeric zone offset: `2018-05-10 07:04:00
  -08:00`
* Sensu alpha legacy format with canonical zone ID: `May 10 2018 7:04AM
  America/Vancouver`

## Getting help

All Sensu sub-commands have a `--help` flag that returns more information on
using the command and if applicable any sub-commands _it_ has.

{{< highlight shell >}}
$ sensuctl --help
sensuctl controls Sensu instances

Usage:	sensuctl COMMAND

Flags:
      --api-url string        host URL of Sensu installation
      --cache-dir string      path to directory containing cache & temporary files (default "/home/eric/.cache/sensu/sensuctl")
      --config-dir string     path to directory containing configuration files (default "/home/eric/.config/sensu/sensuctl")
  -h, --help                  help for sensuctl
      --namespace string      namespace in which we perform actions (default "default")

Commands:
  completion   Output shell completion code for the specified shell (bash or zsh)
  configure    Initialize sensuctl configuration
  create       create new resources from file or STDIN
  logout       Logout from sensuctl
  version      Show the sensu-ctl version information

Management Commands:
  asset        Manage assets
  check        Manage checks
  config       Modify sensuctl configuration
  entity       Manage entities
  event        Manage events
  extension    Manage extension registry
  filter       Manage filters
  handler      Manage handlers
  hook         Manage hooks
  mutator      Manage mutators
  namespace    Manage namespaces
  role         Manage roles
  silenced     Manage silenced subscriptions and checks
  user         Manage users

Run 'sensuctl COMMAND --help' for more information on a command.
{{< /highlight >}}

## Create

The `sensuctl create` command allows you to create and/or
update resources by reading from STDIN or a flag configured file (`-f`). The
accepted format of the `create` command is `wrapped-json`, which wraps the
contents of the resource in `spec` and identifies its Sensu Go `type` (see below for
an example, and [this table][3] for a list of supported types).

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
  "spec": {
    "type": "pipe",
    "command": "handler-slack --webhook-url https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX --channel monitoring",
    "metadata" : {
      "name": "slack",
      "namespace": "default"
    }
  }
}
{{< /highlight >}}

_NOTE: Commas cannot be included between resource definitions when using `sensuctl create -f`._

To create all resources in `wrapped-json` format from `my-resources.json` using `sensuctl create`:

{{< highlight shell >}}
sensuctl create --file my-resources.json
{{< /highlight >}}

Or:

{{< highlight shell >}}
cat my-resources.json | sensuctl create
{{< /highlight >}}

### Supported types

|wrapped-json types |   |   |   |
--------------------|---|---|---|
`AdhocRequest` | `adhoc_request` | `Asset` | `asset`
`Check` | `check` | `CheckConfig` | `check_config`
`Entity` | `entity` | `Event` | `event`
`EventFilter` | `event_filter` | `Extension` | `extension`
`Handler` | `handler` | `Hook` | `hook`
`HookConfig` | `hook_config`  | `Mutator` | `mutator`
`Namespace` | `namespace` | `Role` | `role`
`Silenced` | `silenced`

## Edit

Sensuctl allows you to edit resource definitions using `sensuctl edit`.
To use `sensuclt edit`, specify the resource [type][3] and resource name.

For example, to edit a handler named `slack` using `sensuctl edit`:

{{< highlight shell >}}
sensuctl edit handler slack
{{< /highlight >}}

Sensuctl resource editing is available in YAML format only.
  
## Shell auto-completion

### Installation (Bash Shell)

Make sure bash completion is installed. If you use a current Linux
in a non-minimal installation, bash completion should be available.
On a Mac, install with:

{{< highlight shell >}}
brew install bash-completion
{{< /highlight >}}

Then add the following to your `~/.bash_profile`:

{{< highlight shell >}}
if [ -f $(brew --prefix)/etc/bash_completion ]; then
. $(brew --prefix)/etc/bash_completion
fi
{{< /highlight >}}

When bash-completion is available we can add the following to your `~/.bash_profile`:

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

sensuctl:
{{< highlight shell >}}
> $ sensuctl <kbd>Tab</kbd>
check       configure   event       user
asset       completion  entity      handler
{{< /highlight >}}

sensuctl:
{{< highlight shell >}}
> $ sensuctl check <kbd>Tab</kbd>
create  delete  import  list
{{< /highlight >}}

[1]: ../../reference/rbac
[2]: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
[3]: #supported-types
[4]: ../../getting-started/installation-and-configuration/#install-sensuctl
