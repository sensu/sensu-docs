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

```sh
curl -LO https://storage.googleapis.com/sensu-binaries/$(curl -s https://storage.googleapis.com/sensu-binaries/latest.txt)/darwin/amd64/sensuctl
```
**Optionally**, if you would like to download a specific release, replace
`{VERSION}` in the command below.

```sh
curl -LO https://storage.googleapis.com/sensu-binaries/{VERSION}/darwin/amd64/sensuctl
```

Make the sensuctl binary executable.

```sh
chmod +x sensuctl
```

Move the executable into your PATH.

```
sudo mv sensuctl /usr/local/bin/
```

### Debian / Ubuntu

Add the Sensu prerelease repository (this step can be skipped if you previously added the repository
on the backend/agent installation page).

```sh
export SENSU_REPO_TOKEN=your_token_here
curl -s https://$SENSU_REPO_TOKEN:@packagecloud.io/install/repositories/sensu/prerelease/script.deb.sh | sudo bash
```

Install the Sensu CLI package.

```sh
sudo apt-get install sensu-cli
```

### RHEL / CentOS

Add the Sensu prerelease repository (this step can be skipped if you previously added the repository
on the backend/agent installation page).

```sh
export SENSU_REPO_TOKEN=your_token_here
curl -s https://$SENSU_REPO_TOKEN:@packagecloud.io/install/repositories/sensu/prerelease/script.rpm.sh | sudo bash
```

Install the Sensu CLI package.

```sh
sudo yum install sensu-cli
```


## Configure

Sensuctl must be configured before it can connect to your Sensu cluster. Run the
`configure` command to get started.

```sh
sensuctl configure
```

<img alt="sensu-configure-demo" src="assets/sensuctl-configure.gif" width="650px" />

### Default User

By default, your Sensu installation comes with a single user named `admin`. This
user has the password `P@ssw0rd!` and it is **strongly** recommended that you
change it immediately. To do so, you'll first want to authenticate using the
`sensuctl` tool.

> sensuctl configure
```sh
? Sensu Base URL: http://my-sensu-host:8080
? Username: admin
? Password:  *********
? ...
```

Once authenticated, you can use the `change-password` command.

> sensuctl user change-password
```sh
? Current Password:  *********
? Password:          *********
? Confirm:           *********
```

### Tweak Values

You can change individual values with the `config` sub-command.

```sh
sensuctl config set-organization default
sensuctl config set-environment prod
```

## Getting Help

All Sensu sub-commands have a `--help` flag that returns more information on
using the command and if applicable any sub-commands _it_ has.

sensuctl:
> $ sensuctl --help
```shell
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
```

## Import

On top of being able to create new resources interactively and with flags,
sensuctl provides `import` commands for creating & updating resources via STDIN.

```json
{
  "name": "marketing-site",
  "command": "check-http.rb -u https://dean-learner.book",
  "subscriptions": ["demo"],
  "interval": 15,
  "handlers": ["slack"],
  "organization": "default",
  "environment": "default"
}
```

```sh
# cat my-check.json | sensuctl check import
OK
```

Further API details- including valid parameters- forthcoming.

## Output

sensuctl can be configured to return JSON instead of the default human-readable
format.

> sensuctl check info marketing-site --format json
```json
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
```

If you do not want to explicitly use the format flag with each command, you can
set the global default.

```sh
# sensuctl config set-format json
OK
```

## Shell Auto-Completion

### Installation (Bash Shell)

Make sure bash completion is installed. If you use a current Linux
in a non-minimal installation, bash completion should be available.
On a Mac, install with:

```sh
brew install bash-completion
```

Then add the following to your `~/.bash_profile`:

```bash
if [ -f $(brew --prefix)/etc/bash_completion ]; then
. $(brew --prefix)/etc/bash_completion
fi
```

When bash-completion is available we can add the following to your `~/.bash_profile`:

```bash
source <(sensuctl completion bash)
```

You can now source your `~/.bash_profile` or launch a new terminal to utilize completion.

```sh
source ~/.bash_profile
```

### Installation (ZSH)

Add the following to your `~/.zshrc`:

```bash
source <(sensuctl completion zsh)
```

You can now source your `~/.zshrc` or launch a new terminal to utilize completion.

```sh
source ~/.zshrc
```

### Usage

sensuctl:
> $ sensuctl <kbd>Tab</kbd>
```
check       configure   event       user
asset       completion  entity      handler
```

sensuctl:
> $ sensuctl check <kbd>Tab</kbd>
```
create  delete  import  list
```