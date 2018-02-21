---
title: "Configuring sensuctl"
description: "The sensuctl configuration guide."
weight: 1
version: "2.0"
product: "Sensu Core"
platformContent: true
menu:
  sensu-core-2.0:
    parent: getting-started
---

## Sensu CLI (sensuctl)

Sensu 2.0 can be configured and used with the sensuctl (pronounced "sensu cuddle") command line utility.

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

Add the Sensu prerelease repository (this step can be skipped if you previously added the repository
on the backend/agent installation page).

{{< highlight shell >}}
export SENSU_REPO_TOKEN=your_token_here
curl -s https://$SENSU_REPO_TOKEN:@packagecloud.io/install/repositories/sensu/prerelease/script.deb.sh | sudo bash
{{< /highlight >}}

Install the Sensu CLI package.

{{< highlight shell >}}
sudo apt-get install sensu-cli
{{< /highlight >}}

### RHEL / CentOS

Add the Sensu prerelease repository (this step can be skipped if you previously added the repository
on the backend/agent installation page).

{{< highlight shell >}}
export SENSU_REPO_TOKEN=your_token_here
curl -s https://$SENSU_REPO_TOKEN:@packagecloud.io/install/repositories/sensu/prerelease/script.rpm.sh | sudo bash
{{< /highlight >}}

Install the Sensu CLI package.

{{< highlight shell >}}
sudo yum install sensu-cli
{{< /highlight >}}


## Configure

Sensuctl must be configured before it can connect to your Sensu cluster. Run the
`configure` command to get started.

{{< highlight shell >}}
sensuctl configure
{{< /highlight >}}

<img alt="sensu-configure-demo" src="assets/sensuctl-configure.gif" width="650px" />

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

> sensuctl user change-password
{{< highlight shell >}}
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

sensuctl:
> $ sensuctl --help
{{< highlight shell >}}
sensuctl controls Sensu instances

Usage:    sensuctl COMMAND

Options:
      --api-url string        host URL of Sensu installation
      --cache-dir string      path to directory containing cache & temporary files (default "/Users/deanlearner/Library/Caches/sensu/sensuctl")
      --config-dir string     path to directory containing configuration files (default "/Users/deanlearner/.config/sensu/sensuctl")
  -h, --help                  help for sensuctl
      --organization string   organization in which we perform actions (default "default")

Commands:
  completion   Output shell completion code for the specified shell (bash or zsh)
  configure    Initialize sensuctl configuration
  logout       Logout from sensuctl
  version      Show the sensu-ctl version information
  
Management Commands:
  asset        Manage assets
  check        Manage checks
  config       Modify sensuctl configuration
  entity       Manage entities
  environment  Manage environments
  event        Manage events
  handler      Manage handlers
  organization Manage organizations
  role         Manage roles
  user         Manage users
{{< /highlight >}}

## Import

On top of being able to create new resources interactively and with flags,
sensuctl provides `import` commands for creating & updating resources via STDIN.

{{< highlight json >}}
{
  "name": "marketing-site",
  "command": "check-http.rb -u https://dean-learner.book",
  "subscriptions": ["demo"],
  "interval": 15,
  "handlers": ["slack"],
  "organization": "default",
  "environment": "default"
}
{{< /highlight >}}

{{< highlight shell >}}
# cat my-check.json | sensuctl check import
OK
{{< /highlight >}}

Further API details- including valid parameters- forthcoming.

## Output

sensuctl can be configured to return JSON instead of the default human-readable
format.

> sensuctl check info marketing-site --format json
{{< highlight json >}}
{
  "name": "marketing-site",
  "interval": 10,
  "subscriptions": [
    "web"
  ],
  "command": "check-http.rb -u https://dean-learner.book",
  "handlers": [
    "slack"
  ],
  "runtime_assets": [],
  "environment": "default",
  "organization": "default"
}
{{< /highlight >}}

If you do not want to explicitly use the format flag with each command, you can
set the global default.

{{< highlight shell >}}
# sensuctl config set-format json
OK
{{< /highlight >}}

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