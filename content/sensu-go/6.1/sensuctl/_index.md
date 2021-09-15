---
title: "Sensuctl CLI"
description: "Sensuctl is a command line tool for managing resources within Sensu. It works by calling Sensu’s underlying API to create, read, update, and delete resources, events, and entities. Read this page to start using sensuctl."
weight: 40
product: "Sensu Go"
version: "6.1"
layout: "single"
menu:
  sensu-go-6.1:
    identifier: sensuctl
---

Sensuctl is a command line tool for managing resources within Sensu.
It works by calling Sensu's underlying API to create, read, update, and delete resources, events, and entities.

Sensuctl is available for Linux, macOS, and Windows.
For Windows operating systems, sensuctl uses `cmd.exe` for the execution environment.
For all other operating systems, sensuctl uses the Bourne shell (sh).

Read [Install Sensu][2] to install and configure sensuctl.

## First-time setup and authentication

To set up sensuctl, run `sensuctl configure` to log in to sensuctl and connect to the Sensu backend:

{{< code shell >}}
sensuctl configure
{{< /code >}}

When prompted, type the [Sensu backend URL][6] and your [Sensu access credentials][8].

{{< code shell >}}
? Sensu Backend URL: http://127.0.0.1:8080
? Username: YOUR_USERNAME
? Password: YOUR_PASSWORD
? Namespace: default
? Preferred output format: tabular
{{< /code >}}

Sensuctl uses your username and password to obtain access and refresh tokens via the [Sensu authentication API][14].
The access and refresh tokens are HMAC-SHA256 [JSON Web Tokens (JWTs)][16] that Sensu issues to record the details of users' authenticated Sensu sessions.
The backend digitally signs these tokens, and the tokens can't be changed without invalidating the signature.

Upon successful authentication, sensuctl stores the access and refresh tokens in a "cluster" configuration file under the current user's home directory.
For example, on Unix systems, sensuctl stores the tokens in `$HOME/.config/sensu/sensuctl/cluster`.

### Sensu backend URL

The Sensu backend URL is the HTTP or HTTPS URL where sensuctl can connect to the Sensu backend server.
The default URL is `http://127.0.0.1:8080`.

To connect to a [Sensu cluster][4], connect sensuctl to any single backend in the cluster.
For information about configuring the Sensu backend URL, see the [backend reference][3].

### Configuration files

During configuration, sensuctl creates configuration files that contain information for connecting to your Sensu Go deployment.
You can find these files at `$HOME/.config/sensu/sensuctl/profile` and `$HOME/.config/sensu/sensuctl/cluster`.

Use the `cat` command to view the contents of these files.
For example, to view your sensuctl profile configuration, run:

{{< code shell >}}
cat .config/sensu/sensuctl/profile
{{< /code >}}

The response should be similar to this example:

{{< code shell >}}
{
  "format": "tabular",
  "namespace": "default",
  "username": "admin"
}
{{< /code >}}

To view your sensuctl cluster configuration, run:

{{< code shell >}}
cat .config/sensu/sensuctl/cluster 
{{< /code >}}

The response should be similar to this example:

{{< code shell >}}
{
  "api-url": "http://localhost:8080",
  "trusted-ca-file": "",
  "insecure-skip-tls-verify": false,
  "access_token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "expires_at": 1550082282,
  "refresh_token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
{{< /code >}}

These configuration files are useful if you want to know which cluster you're connecting to or which namespace or username you're currently configured to use.

## Username, password, and namespace

During the [Sensu backend installation][10] process, you create an administrator username and password and a `default` namespace.

Your ability to get, list, create, update, and delete resources with sensuctl depends on the permissions assigned to your Sensu user.
For more information about configuring Sensu access control, see the [RBAC reference][1].

{{% notice note %}}
**NOTE**: For a **new** installation, you can set administrator credentials with environment variables during [initialization](../observability-pipeline/observe-schedule/backend/#initialization).
If you are using Docker and you do not include the environment variables to set administrator credentials, the backend will initialize with the default username (`admin`) and password (`P@ssw0rd!`).
{{% /notice %}} 

Your ability to get, list, create, update, and delete resources with sensuctl depends on the permissions assigned to your Sensu user.
For more information about configuring Sensu access control, see the [RBAC reference][1].

### Change admin user's password

After you have [configured sensuctl and authenticated][12], you can change the admin user's password.
Run:

{{< code shell >}}
sensuctl user change-password --interactive
{{< /code >}}

You must specify the user's current password to use the `sensuctl user change-password` command.

### Reset a user password

To reset a user password without specifying the current password, run:

{{< code shell >}}
sensuctl user reset-password USERNAME --interactive
{{< /code >}}

You must have admin permissions to use the `sensuctl user reset-password` command.

## Test a user password

To test the password for a user created with Sensu's built-in [basic authentication][11]:

{{< code shell >}}
sensuctl user test-creds USERNAME --password 'password'
{{< /code >}}

An empty response indicates valid credentials.
A `request-unauthorized` response indicates invalid credentials.

{{% notice note %}}
**NOTE**: The `sensuctl user test-creds` command tests passwords for users created with Sensu's built-in [basic authentication provider](../operations/control-access/#use-built-in-basic-authentication).
It does not test user credentials defined via an authentication provider like [Lightweight Directory Access Protocol (LDAP)](../operations/control-access/ldap-auth/), [Active Directory (AD)](../operations/control-access/ad-auth/), or [OpenID Connect 1.0 protocol (OIDC)](../operations/control-access/oidc-auth/).
{{% /notice %}}

For example, if you test LDAP credentials with the `sensuctl user test-creds` command, the backend will log an error, even if you know the LDAP credentials are correct:

{{< code shell >}}
{"component":"apid.routers","error":"basic provider is disabled","level":"info","msg":"invalid username and/or password","time":"2020-02-07T20:42:14Z","user":"dev"}
{{< /code >}}

### Generate a password hash

To generate a password hash for a specified cleartext password, run:

{{< code shell >}}
sensuctl user hash-password PASSWORD
{{< /code >}}

The `sensuctl user hash-password` command creates a [bcrypt hash][15] of the specified password.
You can use this hash instead of the password when you use sensuctl to [create][5] and [edit][13] users.

## Preferred output format

## Preferred output format

Sensuctl supports the following output formats:

- `tabular`: Output is organized in user-friendly columns (default).
- `yaml`: Output is in [YAML][20] format. Resource definitions include an outer-level `spec` "wrapping" for resource attributes and list the resource `type` and `api_version`.
- `wrapped-json`: Output is in [JSON][21] format. Resource definitions include an outer-level `spec` "wrapping" for resource attributes and list the resource `type` and `api_version`.
- `json`: Output is in [JSON][21] format. Resource definitions **do not** include an outer-level `spec` "wrapping" or the resource `type` and `api_version`.

After you are logged in, you can change the default output format with `sensuctl config set-format` or set the output format per command with the `--format` flag.

### Output format significance

To use [sensuctl create][5] to create a resource, you must provide the resource definition in `yaml` or `wrapped-json` format.
These formats include the resource type, which sensuctl needs to determine what kind of resource to create.

The [Sensu API][9] uses `json` output format for responses for APIs in the `core` [group][22].
For APIs that are not in the `core` group, responses are in the `wrapped-json` output format.

Sensu sends events to the backend in [`json` format][23], without the `spec` attribute wrapper or `type` and `api_version` attributes.

## Non-interactive mode

Run `sensuctl configure` non-interactively by adding the `-n` (`--non-interactive`) flag.

{{< code shell >}}
sensuctl configure -n --url http://127.0.0.1:8080 --username YOUR_USERNAME --password YOUR_PASSWORD --format tabular
{{< /code >}}

## Get help

Sensuctl supports a `--help` flag for each command and subcommand.

### See command and global flags

{{< code shell >}}
sensuctl --help
{{< /code >}}

### See subcommands and flags

{{< code shell >}}
sensuctl check --help
{{< /code >}}

### See usage and flags

{{< code shell >}}
sensuctl check delete --help
{{< /code >}}

## Manage sensuctl

The `sencutl config` command lets you view the current sensuctl configuration and set the namespace and output format.

### View sensuctl config

To view the active configuration for sensuctl:

{{< code shell >}}
sensuctl config view
{{< /code >}}

The `sensuctl config view` response includes the [Sensu backend URL][6], default [namespace][8] for the current user, default [output format][7] for the current user, and currently configured username:

{{< code shell >}}
=== Active Configuration
API URL:   http://127.0.0.1:8080
Namespace: default
Format:    tabular
Username:  admin
{{< /code >}}

### Set output format

Use the `set-format` command to change the default [output format][7] for the current user.

For example, to change the output format to `tabular`:

{{< code shell >}}
sensuctl config set-format tabular
{{< /code >}}

### Set namespace

Use the `set-namespace` command to change the default [namespace][8] for the current user.
For more information about configuring Sensu access control, see the [RBAC reference][1].

For example, to change the default namespace to `development`:

{{< code shell >}}
sensuctl config set-namespace development
{{< /code >}}

### Log out of sensuctl

To log out of sensuctl:

{{< code shell >}}
sensuctl logout
{{< /code >}}

To log back in to sensuctl:

{{< code shell >}}
sensuctl configure
{{< /code >}}

### View the sensuctl version number

To display the current version of sensuctl:

{{< code shell >}}
sensuctl version
{{< /code >}}

### Global flags

Global flags modify settings specific to sensuctl, such as the Sensu backend URL and [namespace][8].
You can use global flags with most sensuctl commands.

{{< code shell >}}
--api-url string             host URL of Sensu installation
--cache-dir string           path to directory containing cache & temporary files
--config-dir string          path to directory containing configuration files
--insecure-skip-tls-verify   skip TLS certificate verification (not recommended!)
--namespace string           namespace in which we perform actions
--trusted-ca-file string     TLS CA certificate bundle in PEM format
{{< /code >}}

You can permanently set these flags by editing `.config/sensu/sensuctl/{cluster, profile}`.

## Shell auto-completion

### Installation (Bash shell)

Make sure bash-completion is installed.
If you use a current Linux in a non-minimal installation, bash-completion should be available.

On macOS, install with:

{{< code shell >}}
brew install bash-completion
{{< /code >}}

Then add this to your `~/.bash_profile`:

{{< code shell >}}
if [ -f $(brew --prefix)/etc/bash_completion ]; then
. $(brew --prefix)/etc/bash_completion
fi
{{< /code >}}

After bash-completion is installed, add this to your `~/.bash_profile`:

{{< code shell >}}
source <(sensuctl completion bash)
{{< /code >}}

Now you can source your `~/.bash_profile` or launch a new terminal to use shell auto-completion.

{{< code shell >}}
source ~/.bash_profile
{{< /code >}}

### Installation (ZSH)

Add this to your `~/.zshrc`:

{{< code shell >}}
source <(sensuctl completion zsh)
{{< /code >}}

Now you can source your `~/.zshrc` or launch a new terminal to use shell auto-completion.

{{< code shell >}}
source ~/.zshrc
{{< /code >}}

### Usage

`sensuctl` <kbd>Tab</kbd>

{{< code shell >}}
check       configure   event       user
asset       completion  entity      handler
{{< /code >}}

`sensuctl check` <kbd>Tab</kbd>

{{< code shell >}}
create  delete  import  list
{{< /code >}}


[1]: ../operations/control-access/rbac/
[2]: ../operations/deploy-sensu/install-sensu/#install-sensuctl
[3]: ../observability-pipeline/observe-schedule/agent/#general-configuration-flags
[4]: ../operations/deploy-sensu/cluster-sensu/
[5]: create-manage-resources/#create-resources
[6]: #sensu-backend-url
[7]: #preferred-output-format
[8]: #username-password-and-namespace
[9]: ../api/
[10]: ../operations/deploy-sensu/install-sensu/#install-the-sensu-backend
[11]: ../operations/control-access/#use-built-in-basic-authentication
[12]: #first-time-setup-and-authentication
[13]: create-manage-resources/#update-resources
[14]: ../api/auth/
[15]: https://en.wikipedia.org/wiki/Bcrypt
[16]: https://tools.ietf.org/html/rfc7519
[20]: https://yaml.org/
[21]: https://www.json.org/
[22]: ../api/#url-format
[23]: ../observability-pipeline/observe-events/events/#example-status-only-event-from-the-sensu-api
