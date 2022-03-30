---
title: "Sensuctl CLI"
description: "Use the sensuctl command line tool to create, read, update, and delete Sensu events, entities, and resources by calling Sensu’s underlying API."
weight: 40
product: "Sensu Go"
version: "6.6"
layout: "single"
menu:
  sensu-go-6.6:
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

This starts the prompts for interactive sensuctl setup.
When prompted, choose the authentication method you wish to use: username/password or OIDC.

Sensuctl uses your username and password or OIDC credentials to obtain access and refresh tokens via the Sensu [/auth API][14].
The access and refresh tokens are HMAC-SHA256 [JSON Web Tokens (JWTs)][16] that Sensu issues to record the details of users' authenticated Sensu sessions.
The backend digitally signs these tokens, and the tokens can't be changed without invalidating the signature.

Upon successful authentication, sensuctl stores the access and refresh tokens in a "cluster" configuration file under the current user's home directory.
For example, on Unix systems, sensuctl stores the tokens in `$HOME/.config/sensu/sensuctl/cluster`.

### Username/password authentication

The `sensuctl configure` interactive prompts require you to select the username/password authentication method and enter the [Sensu backend URL][6], namespace, and preferred output format.
Then you will be prompted to enter your [username and password Sensu access credentials][8].

Username/password authentication applies to the following authentication providers:

- [Built-in basic authentication][11]
- [Lightweight Directory Access Protocol (LDAP) authentication][17] ([commercial feature][19])
- [Active Directory (AD) authentication][18] ([commercial feature][19])

This example shows the username/password authentication method:

{{< code shell >}}
? Authentication method: username/password
? Sensu Backend API URL: http://127.0.0.1:8080
? Namespace: default
? Preferred output format: tabular
? Username: YOUR_USERNAME
? Password: YOUR_PASSWORD
{{< /code >}}

### OIDC authentication

The `sensuctl configure` interactive prompts require you to select the OIDC authentication method and enter the [Sensu backend URL][6], namespace, and preferred output format.
Then, if you are using a desktop, a browser will open to allow you to authenticate and log in via your OIDC provider.

This example shows the OIDC authentication method:

{{< code shell >}}
? Authentication method: OIDC
? Sensu Backend API URL: http://127.0.0.1:8080
? Namespace: default
? Preferred output format: tabular
Launching browser to complete the login via your OIDC provider at following URL:

  http://127.0.0.1:8080/api/enterprise/authentication/v2/oidc/authorize?callback=http%3A%2F%2Flocalhost%3A8000%2Fcallback

You may also manually open this URL. Waiting for callback...
{{< /code >}}

If a browser does not open, launch a browser to complete the login via your OIDC provider at the Sensu backend URL you entered in your sensuctl configuration.

{{% notice note %}}
**NOTE**: You can also use [`sensuctl login oidc`](../operations/control-access/oidc-auth/#sensuctl-login-with-oidc) to log in to sensuctl with OIDC.
{{% /notice %}}

### Sensu backend URL

The Sensu backend URL is the HTTP or HTTPS URL where sensuctl can connect to the Sensu backend server.
The default URL is `http://127.0.0.1:8080`.

To connect to a [Sensu cluster][4], connect sensuctl to any single backend in the cluster.
For information about configuring the Sensu backend URL, read the [backend reference][3].

### sensuctl configure flags

Run `sensuctl configure -h` to view command-specific flags you can use to set up sensuctl and bypass interactive mode.
The following table lists the command-specific flags.

| Flag | Function and important notes
| ---- | ----------------------------
`--format` | Preferred output format (default "tabular"). String.
`-h` or `--help` | Help for the configure command.
`-n` or `--non-interactive` | Do not administer interactive questionnaire.
`--oidc` | Use an OIDC provider for authentication (instead of username and password).
`--password string` | User password. String.
`--port` | Port for local HTTP webserver used for OAuth 2 callback during OIDC authentication (default 8000). Integer.
`--url` |  The Sensu backend url (default "http://127.0.0.1:8080"). String.
`--username` | Username. String.

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

{{% notice note %}}
**NOTE**: For a **new** installation, you can set administrator credentials with environment variables during [initialization](../observability-pipeline/observe-schedule/backend/#initialization).
If you are using Docker and you do not include the environment variables to set administrator credentials, the backend will initialize with the default username (`admin`) and password (`P@ssw0rd!`).
{{% /notice %}} 

Your ability to get, list, create, update, and delete resources with sensuctl depends on the permissions assigned to your Sensu user.
For more information about configuring Sensu access control, read the [RBAC reference][1].

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
**NOTE**: The `sensuctl user test-creds` command tests passwords for users created with Sensu's built-in [basic authentication](../operations/control-access/#use-built-in-basic-authentication).
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

### List command and global flags

{{< code shell >}}
sensuctl --help
{{< /code >}}

### List subcommands and flags

{{< code shell >}}
sensuctl check --help
{{< /code >}}

### List usage and flags

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
For more information about configuring Sensu access control, read the [RBAC reference][1].

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
--api-key string             API key to use for authentication
--api-url string             host URL of Sensu installation
--cache-dir string           path to directory containing cache & temporary files
--config-dir string          path to directory containing configuration files
--insecure-skip-tls-verify   skip TLS certificate verification (not recommended!)
--namespace string           namespace in which we perform actions (default "default")
--timeout duration           timeout when communicating with sensu backend (default 15s)
--trusted-ca-file string     TLS CA certificate bundle in PEM format
{{< /code >}}

To permanently set these flags, edit `.config/sensu/sensuctl/{cluster, profile}`.

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
[14]: ../api/other/auth/
[15]: https://en.wikipedia.org/wiki/Bcrypt
[16]: https://tools.ietf.org/html/rfc7519
[17]: ../operations/control-access/ldap-auth
[18]: ../operations/control-access/ad-auth
[19]: ../commercial/
[20]: https://yaml.org/
[21]: https://www.json.org/
[22]: ../api/#url-format
[23]: ../observability-pipeline/observe-events/events/#example-status-only-event-from-the-sensu-api
