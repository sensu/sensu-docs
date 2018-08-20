---
title: "Sensu CLI (sensuctl)"
linkTitle: "Configuring sensuctl"
description: "The sensuctl configuration guide."
weight: 2
version: "2.0"
product: "Sensu Core"
platformContent: true
menu:
  sensu-core-2.0:
    parent: getting-started
---

Sensu 2.0 can be configured and used with the sensuctl (pronounced "sensu cuddle") command line utility.

- [Installation](#installation)
- [Configuration](#configure)
- [Getting Help](#getting-help)
- [Create](#create)
- [Shell Auto-Completion](#shell-auto-completion)

## Installation

### macOS

Download the latest release.

{{< highlight shell >}}
curl -LO https://storage.googleapis.com/sensu-binaries/$(curl -s https://storage.googleapis.com/sensu-binaries/latest.txt)/darwin/amd64/sensuctl
{{< /highlight >}}

**Optionally**, if you would like to download a specific release, replace
`{VERSION}` in the command below.

{{< highlight shell >}}
curl -LO https://storage.googleapis.com/sensu-binaries/{VERSION}/darwin/amd64/sensuctl
{{< /highlight >}}

Make the sensuctl binary executable.

{{< highlight shell >}}
chmod +x sensuctl
{{< /highlight >}}

Move the executable into your PATH.

{{< highlight shell >}}
sudo mv sensuctl /usr/local/bin/
{{< /highlight >}}

### Debian / Ubuntu

Add the Sensu nightly repository (this step can be skipped if you previously added the repository
on the backend/agent installation page).

{{< highlight shell >}}
curl -s https://packagecloud.io/install/repositories/sensu/nightly/script.deb.sh | sudo bash
{{< /highlight >}}

Install the Sensu CLI package.

{{< highlight shell >}}
sudo apt-get install sensu-cli
{{< /highlight >}}

### RHEL / CentOS

Add the Sensu nightly repository (this step can be skipped if you previously added the repository
on the backend/agent installation page).

{{< highlight shell >}}
curl -s https://packagecloud.io/install/repositories/sensu/nightly/script.rpm.sh | sudo bash
{{< /highlight >}}

Install the Sensu CLI package.

{{< highlight shell >}}
sudo yum install sensu-cli
{{< /highlight >}}


## Configure

Sensuctl must be configured before it can connect to your Sensu cluster. Run the
`configure` command to get started.

{{< highlight shell >}}
$ sensuctl configure
? Sensu Backend URL: http://127.0.0.1:8080
? Username: admin
? Password: *********
? Organization: default
? Environment: default
? Preferred output format: tabular
{{< /highlight >}}

### Default User

By default, your Sensu installation comes with a single user named `admin`. This
user has the password `P@ssw0rd!` and it is **strongly** recommended that you
change it immediately. To do so, you'll first want to authenticate using the
`sensuctl` tool.

> sensuctl configure
{{< highlight shell >}}
? Sensu Base URL: http://my-sensu-host:8080
? Username: admin
? Password:  *********
? ...
{{< /highlight >}}

Once authenticated, you can use the `change-password` command.

{{< highlight shell >}}
$ sensuctl user change-password --interactive
? Current Password:  *********
? Password:          *********
? Confirm:           *********
{{< /highlight >}}

### Tweak Values

You can change individual values with the `config` sub-command.

{{< highlight shell >}}
sensuctl config set-organization default
sensuctl config set-environment prod
{{< /highlight >}}

## Getting Help

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
      --environment string    environment in which we perform actions (default "default")
  -h, --help                  help for sensuctl
      --organization string   organization in which we perform actions (default "default")

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
  environment  Manage environments
  event        Manage events
  extension    Manage extension registry
  filter       Manage filters
  handler      Manage handlers
  hook         Manage hooks
  mutator      Manage mutators
  organization Manage organizations
  role         Manage roles
  silenced     Manage silenced subscriptions and checks
  user         Manage users

Run 'sensuctl COMMAND --help' for more information on a command.
{{< /highlight >}}

## Create

The `sensuctl create` command allows you to create and/or
update resources by reading from STDIN or a flag configured file (`-f`). The
accepted format of the `create` command is `wrapped-json`, which wraps the
contents of the resource in `spec` and identifies its 2.x `type` (see below for
an example, and [this table][2] for a list of supported types).

{{< highlight json >}}
{
  "type": "CheckConfig",
  "spec": {
    "name": "marketing-site",
    "command": "check-http.rb -u https://dean-learner.book",
    "subscriptions": ["demo"],
    "interval": 15,
    "handlers": ["slack"],
    "organization": "default",
    "environment": "default"
  }
}
{
  "type": "Handler",
  "spec": {
    "name": "slack",
    "type": "pipe",
    "command": "handler-slack --webhook-url https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX --channel monitoring'",
    "environment": "default",
    "organization": "default"
  }
}
{{< /highlight >}}

Write all checks to `my-resources.json` in `wrapped-json` format:
{{< highlight shell >}}
sensuctl check list --format wrapped-json > my-resources.json
{{< /highlight >}}

Create all resources in `wrapped-json` format from `my-resources.json`:
{{< highlight shell >}}
cat my-resources.json | sensuctl create
{{< /highlight >}}

### Supported types

|wrapped-json types |   |   |   |
--------------------|---|---|---|
`AdhocRequest` | `adhoc_request` | `Asset` | `asset`
`Check` | `check` | `CheckConfig` | `check_config`
`Entity` | `entity` | `Environment` | `environment`
`Event` | `event` | `EventFilter` | `event_filter`
`Extension` | `extension` | `Handler` | `handler`
`Hook` | `hook` | `HookConfig` | `hook_config`
`Mutator` | `mutator` | `Organization` | `organization`
`Role` | `role` | `Silenced` | `silenced`

## Shell Auto-Completion

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

For more details on `sensuctl` commands, check out the [reference guide][1].

[1]: ../../reference/sensuctl
[2]: #supported-types
