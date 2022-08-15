---
title: "Sensuctl CLI"
description: "Use the sensuctl command line tool to create, read, update, and delete Sensu events, entities, and resources by calling Sensu’s underlying API."
weight: 40
product: "Sensu Go"
version: "6.8"
layout: "single"
menu:
  sensu-go-6.8:
    identifier: sensuctl
---

Sensuctl is the command line tool for managing resources within Sensu.
It works by calling Sensu's underlying API to create, read, update, and delete events, entities, and resources.

Sensuctl is available for Linux, macOS, and Windows.
For Windows operating systems, sensuctl uses `cmd.exe` for the execution environment.
For all other operating systems, sensuctl uses the Bourne shell (sh).

Read [Install Sensu][2] to install and configure sensuctl.

## First-time setup and authentication

To log in to sensuctl and connect to the Sensu backend by following interactive prompts, run:

{{< code shell >}}
sensuctl configure
{{< /code >}}

The `sensuctl configure` command starts the prompts for interactive setup.
The first prompt is for the authentication method you wish to use: username/password or OIDC.

Sensuctl uses your username and password or OIDC credentials to obtain access and refresh tokens via the Sensu [/auth API][14].
The access and refresh tokens are HMAC-SHA256 [JSON Web Tokens (JWTs)][16] that Sensu issues to record the details of users' authenticated Sensu sessions.
The backend digitally signs these tokens, and the tokens can't be changed without invalidating the signature.

Upon successful authentication, sensuctl stores the access and refresh tokens in a `cluster` configuration file under the current user's home directory.
For example, on Unix systems, sensuctl stores the tokens in `$HOME/.config/sensu/sensuctl/cluster`.

The `sensuctl configure` interactive prompts require you to select an authentication method and enter the [Sensu backend URL][6], namespace, and preferred output format.

### Username/password authentication

If you select username/password authentication, you will be prompted to enter your [username and password Sensu access credentials][8].

Username/password authentication applies to the following authentication providers:

- [Built-in basic authentication][11]
- [Lightweight Directory Access Protocol (LDAP) authentication][17] ([commercial feature][19])
- [Active Directory (AD) authentication][18] ([commercial feature][19])

This example shows the `sensuctl configure` interactive dialog for the username/password authentication method:

{{< code text >}}
Authentication method: username/password
Sensu Backend API URL: http://127.0.0.1:8080
Namespace: default
Preferred output format: tabular
Username: <YOUR_USERNAME>
Password: <YOUR_PASSWORD>
{{< /code >}}

### OIDC authentication

This example shows the `sensuctl configure` interactive dialog if you select the OIDC authentication method:

{{< code text >}}
Authentication method: OIDC
Sensu Backend API URL: http://127.0.0.1:8080
Namespace: default
Preferred output format: tabular
Launching browser to complete the login via your OIDC provider at following URL:

  http://127.0.0.1:8080/api/enterprise/authentication/v2/oidc/authorize?callback=http%3A%2F%2Flocalhost%3A8000%2Fcallback

You may also manually open this URL. Waiting for callback...
{{< /code >}}

If you are using a desktop, a browser should open to allow you to authenticate and log in via your OIDC provider.
If a browser does not open, launch a browser and go to the OIDC URL listed at the end of the `sensuctl configure` interactive dialog to complete authentication and log in via your OIDC provider.

{{% notice note %}}
**NOTE**: You can also use [`sensuctl login oidc`](../operations/control-access/oidc-auth/#use-sensuctl-to-login-with-oidc) to log in to sensuctl with OIDC.
{{% /notice %}}

## Use flags to configure sensuctl in non-interactive mode

Run `sensuctl configure` non-interactively by adding the `-n` (`--non-interactive`) flag.
For example, the following command configures sensuctl with the same values used in the [username/password interactive example][26]:

{{< code shell >}}
sensuctl configure -n --url http://127.0.0.1:8080 --format tabular --username <YOUR_USERNAME> --password '<YOUR_PASSWORD>'
{{< /code >}}

Run `sensuctl configure -h` to view command-specific and global flags that you can use to set up sensuctl when you bypass interactive mode:

{{< code text >}}
Initialize sensuctl configuration

Usage:  sensuctl configure [flags]

Flags:
      --format string     preferred output format (default "tabular")
  -h, --help              help for configure
  -n, --non-interactive   do not administer interactive questionnaire
      --oidc              use an OIDC provider for authentication
      --password string   password
      --port int          port for local HTTP web server used for OAuth 2 callback during OIDC authentication (default 8000)
      --url string        the sensu backend url (default "http://localhost:8080")
      --username string   username

Global Flags:
      --api-key string             API key to use for authentication
      --api-url string             host URL of Sensu installation
      --cache-dir string           path to directory containing cache & temporary files (default "/Users/hillaryfraley/Library/Caches/sensu/sensuctl")
      --config-dir string          path to directory containing configuration files (default "/Users/hillaryfraley/.config/sensu/sensuctl")
      --insecure-skip-tls-verify   skip TLS certificate verification (not recommended!)
      --namespace string           namespace in which we perform actions (default "default")
      --timeout duration           timeout when communicating with sensu backend (default 15s)
      --trusted-ca-file string     TLS CA certificate bundle in PEM format
{{< /code >}}

## Username, password, and namespace

The [Sensu backend installation][10] process creates an administrator username and password and a `default` [namespace][27].

{{% notice note %}}
**NOTE**: For a **new** installation, you can set administrator credentials with environment variables during [initialization](../observability-pipeline/observe-schedule/backend/#initialization).
If you are using Docker and you do not include the environment variables to set administrator credentials, the backend will initialize with the default username (`admin`) and password (`P@ssw0rd!`).
{{% /notice %}} 

Your ability to get, list, create, update, and delete resources with sensuctl depends on the permissions assigned to your Sensu user.
For more information about configuring Sensu access control, read the [role-based access control (RBAC) reference][1].

### Change the admin user's password

After you [configure sensuctl and authenticate][12], you can change the admin user's password.
Run:

{{< code shell >}}
sensuctl user change-password --interactive
{{< /code >}}

You must specify the user's current password to use the `sensuctl user change-password` command.

### Reset a user password

To reset a user password without specifying the current password, run:

{{< code shell >}}
sensuctl user reset-password <USERNAME> --interactive
{{< /code >}}

You must have admin permissions to use the `sensuctl user reset-password` command.

### Test a user password

To test the password for a user created with Sensu's built-in [basic authentication][11]:

{{< code shell >}}
sensuctl user test-creds <USERNAME> --password 'password'
{{< /code >}}

An empty response indicates valid credentials.
A `request-unauthorized` response indicates invalid credentials.

{{% notice note %}}
**NOTE**: The `sensuctl user test-creds` command tests passwords for users created with Sensu's built-in [basic authentication](../operations/control-access/#use-built-in-basic-authentication).
It does not test user credentials defined via an authentication provider like [Lightweight Directory Access Protocol (LDAP)](../operations/control-access/ldap-auth/), [Active Directory (AD)](../operations/control-access/ad-auth/), or [OpenID Connect 1.0 protocol (OIDC)](../operations/control-access/oidc-auth/).
{{% /notice %}}

For example, if you test LDAP credentials with the `sensuctl user test-creds` command, the backend will log an error, even if the LDAP credentials are correct:

{{< code text >}}
{"component":"apid.routers","error":"basic provider is disabled","level":"info","msg":"invalid username and/or password","time":"2020-02-07T20:42:14Z","user":"dev"}
{{< /code >}}

### Generate a password hash

You can use a password hash instead of a user's password in the sensuctl commands to [create][5] and [edit][13] users.
The `sensuctl user hash-password` command creates a [bcrypt hash][15] of the specified password.

To generate a password hash for a specified cleartext password, run:

{{< code shell >}}
sensuctl user hash-password <PASSWORD>
{{< /code >}}

## Sensu backend URL

The Sensu backend URL is the HTTP or HTTPS URL where sensuctl can connect to the Sensu backend server.
The default URL is `http://127.0.0.1:8080`.

To connect to a [Sensu cluster][4], connect sensuctl to any single backend in the cluster.
For information about configuring the Sensu backend URL, read the [backend reference][3].

## Preferred output format

After you [configure sensuctl][12], you can change the default output format for sensuctl responses.
Sensuctl supports the following output formats:

Format | Description
------ | -----------
`tabular` | Output is organized in user-friendly columns. Tabular is the default output format.
`yaml` | Output is in [YAML][20] format. Resource definitions include the resource `type` and `api_version` as well as an outer-level `spec` "wrapping" for the resource attributes.
`wrapped-json` | Output is in [JSON][21] format. Resource definitions include the resource `type` and `api_version` as well as an outer-level `spec` "wrapping" for the resource attributes.
`json` | Output is in [JSON][21] format. Resource definitions **do not** include the resource `type` and `api_version` or an outer-level `spec` "wrapping".

Use `sensuctl config set-format` to [change the preferred output format][28].

### Output format significance

To use [sensuctl create][5] to create a resource, you must provide the resource definition in `yaml` or `wrapped-json` format.
These formats include the resource `type`, which sensuctl needs to determine what kind of resource to create.

The [Sensu API][9] uses `json` output format for responses for APIs in the `core` [group][22].
For APIs that are not in the `core` group, responses are in the `wrapped-json` output format.

Sensu sends events to the backend in [`json` format][23], without the `spec` attribute wrapper or `type` and `api_version` attributes.

## Sensuctl configuration files

During configuration, sensuctl creates configuration files that contain information for connecting to your Sensu Go deployment.
You can find these files at `$HOME/.config/sensu/sensuctl/profile` and `$HOME/.config/sensu/sensuctl/cluster`.

Use the `cat` command to view the contents of the configuration files.
For example, to view your sensuctl profile configuration, run:

{{< code shell >}}
cat .config/sensu/sensuctl/profile
{{< /code >}}

The response should be similar to this example:

{{< code text >}}
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

{{< code text >}}
{
  "api-url": "http://localhost:8080",
  "trusted-ca-file": "",
  "insecure-skip-tls-verify": false,
  "access_token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "expires_at": 1550082282,
  "refresh_token": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}
{{< /code >}}

The sensuctl configuration files are useful if you want to know which cluster you're connecting to or which namespace or username you're currently configured to use.

## Get help for sensuctl commands

Sensuctl supports a `--help` flag for each command and subcommand.
The help response includes a usage template and lists of any available flags and further commands and subcommands. 

To list global and command-specific flags for sensuctl in general, run:

{{< code shell >}}
sensuctl --help
{{< /code >}}

To list available flags and subcommands for a sensuctl command like `sensuctl check` or `sensuctl create`, run:

{{< code shell >}}
sensuctl check --help
{{< /code >}}

{{< code shell >}}
sensuctl create --help
{{< /code >}}

To list available flags for a complete sensuctl command like `sensuctl check delete`, run:

{{< code shell >}}
sensuctl check delete --help
{{< /code >}}

## Manage sensuctl

Use the `sencutl config` command to view and modify the current sensuctl configuration.

To view flags and command options, run:

{{< code shell >}}
sensuctl config --help
{{< /code >}}

The response lists the global flags and commands available to use with `sensuctl config`:

{{< code text >}}
Modify sensuctl configuration

Usage:  sensuctl config COMMAND

Flags:
  -h, --help   help for config

Global Flags:
      --api-key string             API key to use for authentication
      --api-url string             host URL of Sensu installation
      --cache-dir string           path to directory containing cache & temporary files (default "/home/vagrant/.cache/sensu/sensuctl")
      --config-dir string          path to directory containing configuration files (default "/home/vagrant/.config/sensu/sensuctl")
      --insecure-skip-tls-verify   skip TLS certificate verification (not recommended!)
      --namespace string           namespace in which we perform actions (default "default")
      --timeout duration           timeout when communicating with sensu backend (default 15s)
      --trusted-ca-file string     TLS CA certificate bundle in PEM format

Commands:
  set-format    Set format for active profile
  set-namespace Set namespace for active profile
  set-timeout   Set timeout for active profile in duration format (ex: 15s)
  view          Display active configuration
{{< /code >}}

There are also commands for [logging out of sensuctl][29] and [viewing the current sensuctl version][30].

### View sensuctl config

To view the active configuration for sensuctl:

{{< code shell >}}
sensuctl config view
{{< /code >}}

The `sensuctl config view` response includes the [Sensu backend URL][6], default [namespace][8] for the current user, default [output format][7] for the current user, and currently configured username:

{{< code text >}}
=== Active Configuration
API URL:   http://127.0.0.1:8080
Namespace: default
Format:    tabular
Username:  admin
{{< /code >}}

### Set preferred output format

Use the `set-format` command to change the [preferred output format][7] for the current user.

For example, to change the default tabular format to YAML for all sensuctl commands, run:

{{< code shell >}}
sensuctl config set-format yaml
{{< /code >}}

You can also use the `--format` flag to set the output format for the response to a single sensuctl command.
For example, to keep the default format set at tabular, but retrieve a specific entity definition in YAML format, run:

{{< code shell >}}
sensuctl entity info <ENTITY_NAME> --format yaml
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

### Use global flags for sensuctl settings

Global flags modify settings specific to sensuctl, such as the Sensu backend URL and [namespace][8].

{{< code text >}}
--api-key string             API key to use for authentication
--api-url string             host URL of Sensu installation
--cache-dir string           path to directory containing cache & temporary files (default "/home/vagrant/.cache/sensu/sensuctl")
--config-dir string          path to directory containing configuration files (default "/home/vagrant/.config/sensu/sensuctl")
--insecure-skip-tls-verify   skip TLS certificate verification (not recommended!)
--namespace string           namespace in which we perform actions (default "default")
--timeout duration           timeout when communicating with sensu backend (default 15s)
--trusted-ca-file string     TLS CA certificate bundle in PEM format
{{< /code >}}

You can use global flags with most sensuctl commands.
To set global flags permanently, edit `.config/sensu/sensuctl/{cluster, profile}`.

## Use shell autocompletion with sensuctl

Use shell autocompletion to create and run valid sensuctl commands.
After you [install and configure autocompletion][25], you can use the **tab** key to view and select from available options for each part of a sensuctl command directly from the command line.

Type `sensuctl` and press **tab** to view the list of available variables:

{{< code text >}}
api-key               cluster-role          configure             edit                  handler               logout                role                  user
asset                 cluster-role-binding  create                entity                help                  mutator               role-binding          version
auth                  command               delete                env                   hook                  namespace             secret                
check                 completion            describe-type         event                 license               pipeline              silenced              
cluster               config                dump                  filter                login                 prune                 tessen 
{{< /code >}}

Type your selected variable and press **tab** again to view the list of available variables to complete the command:

{{< code text >}}
create  delete  info    list 
{{< /code >}}

Type your selected variable to complete the command and press **enter** to run it.

### Install and configure autocompletion for sensuctl

Follow the instructions in this section to install and configure Bash or zsh autocompletion for sensuctl.

#### Install and configure for Bash

To install and configure Bash autocompletion for sensuctl:

1. Install [bash-completion][24].

   {{% notice note %}}
   **NOTE**: If you use a current version of Linux in a non-minimal installation, bash-completion may already be installed.
   {{% /notice %}}

   To install bash-completion on macOS, run:
{{< code shell >}}
brew install bash-completion
{{< /code >}}

   Open `~/.bash_profile`, add the following lines, and save:
{{< code shell >}}
if [ -f $(brew --prefix)/etc/bash_completion ]; then
. $(brew --prefix)/etc/bash_completion
fi
{{< /code >}}

2. Open `~/.bash_profile`, add the following line, and save:

     {{< code shell >}}
source <(sensuctl completion bash)
{{< /code >}}

3. Run the following command to source your `~/.bash_profile` file so that its resources are available:

     {{< code shell >}}
source ~/.bash_profile
{{< /code >}}

Shell autocompletion should now be available for sensuctl.

#### Install and configure for zsh

To install and configure zsh autocompletion for sensuctl:

1. Open `~/.zshrc`, add the following line, and save:

     {{< code shell >}}
source <(sensuctl completion zsh)
{{< /code >}}

2. Run the following command to source your `~/.zshrc` file so that its resources are available:

     {{< code shell >}}
source ~/.zshrc
{{< /code >}}


[1]: ../operations/control-access/rbac/
[2]: ../operations/deploy-sensu/install-sensu/#install-sensuctl
[3]: ../observability-pipeline/observe-schedule/backend/
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
[24]: https://github.com/scop/bash-completion
[25]: #install-and-configure-autocompletion-for-sensuctl
[26]: #usernamepassword-authentication
[27]: ../operations/control-access/namespaces/
[28]: #set-preferred-output-format
[29]: #log-out-of-sensuctl
[30]: #view-the-sensuctl-version-number
