---
title: "Set up and manage sensuctl"
linkTitle: "Set up and Manage sensuctl"
description: "Sensuctl is a command line tool for managing resources within Sensu. It works by calling Sensu’s underlying API to create, read, update, and delete resources, events, and entities. Read this reference doc to learn about sensuctl."
weight: 10
version: "5.19"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.19:
    parent: sensuctl-access
---

- [First-time setup](#first-time-setup)
- [Get help](#get-help)
- [Manage sensuctl](#manage-sensuctl)
- [Test a user password](#test-a-user-password)
- [Time formats](#time-formats)
- [Shell auto-completion](#shell-auto-completion)
- [Config files](#configuration-files)

Sensuctl is a command line tool for managing resources within Sensu.
It works by calling Sensu's underlying API to create, read, update, and delete resources, events, and entities.
Sensuctl is available for Linux, macOS, and Windows.
See [Install Sensu][4] to install and configure sensuctl.

## First-time setup

To set up sensuctl, run `sensuctl configure` to log in to sensuctl and connect to the Sensu backend:

{{< highlight shell >}}
sensuctl configure
{{< /highlight >}}

When prompted, type the [Sensu backend URL][9] and your [Sensu access credentials][11].

{{< highlight shell >}}
? Sensu Backend URL: http://127.0.0.1:8080
? Username: YOUR_USERNAME
? Password: YOUR_PASSWORD
? Namespace: default
? Preferred output format: tabular
{{< /highlight >}}

### Sensu backend URL

The Sensu backend URL is the HTTP or HTTPS URL where sensuctl can connect to the Sensu backend server.
The default URL is `http://127.0.0.1:8080`.

To connect to a [Sensu cluster][7], connect sensuctl to any single backend in the cluster.
For information about configuring the Sensu backend URL, see the [backend reference][5].

### Username, password, and namespace

During the [Sensu backend installation][40] process, you create an administrator username and password and a `default` namespace.

Your ability to get, list, create, update, and delete resources with sensuctl depends on the permissions assigned to your Sensu user.
For more information about configuring Sensu access control, see the [RBAC reference][1].

{{% notice note %}}
**NOTE**: For a **new** installation, you can set administrator credentials with environment variables during [initialization](../../reference/backend/#initialization).
If you are using Docker and you do not include the environment variables to set administrator credentials, the backend will initialize with the default username (`admin`) and password (`P@ssw0rd!`).
{{% /notice %}} 

#### Change admin user's password

After you have [installed and configured sensuctl][46], you can change the admin user's password.
Run:

{{< highlight shell >}}
sensuctl user change-password --interactive
{{< /highlight >}}

### Preferred output format

Sensuctl supports the following output formats:

- `tabular`: A user-friendly, columnar format
- `wrapped-json`: An accepted format for use with [`sensuctl create`][8]
- `yaml`: An accepted format for use with [`sensuctl create`][8]
- `json`: A format used by the [Sensu API][25]

After you are logged in, you can change the output format with `sensuctl config set-format` or set the output format per command with the `--format` flag.

### Non-interactive mode

Run `sensuctl configure` non-interactively by adding the `-n` (`--non-interactive`) flag.

{{< highlight shell >}}
sensuctl configure -n --url http://127.0.0.1:8080 --username YOUR_USERNAME --password YOUR_PASSWORD --format tabular
{{< /highlight >}}

## Get help

Sensuctl supports a `--help` flag for each command and subcommand.

### See command and global flags

{{< highlight shell >}}
sensuctl --help
{{< /highlight >}}

### See subcommands and flags

{{< highlight shell >}}
sensuctl check --help
{{< /highlight >}}

### See usage and flags

{{< highlight shell >}}
sensuctl check delete --help
{{< /highlight >}}

## Manage sensuctl

The `sencutl config` command lets you view the current sensuctl configuration and set the namespace and output format.

### View sensuctl config

To view the active configuration for sensuctl:

{{< highlight shell >}}
sensuctl config view
{{< /highlight >}}

The `sensuctl config view` response includes the [Sensu backend URL][9], default [namespace][11] for the current user, default [output format][10] for the current user, and currently configured username:

{{< highlight shell >}}
=== Active Configuration
API URL:   http://127.0.0.1:8080
Namespace: default
Format:    tabular
Username:  admin
{{< /highlight >}}

### Set output format

Use the `set-format` command to change the default [output format][10] for the current user.

For example, to change the output format to `tabular`:

{{< highlight shell >}}
sensuctl config set-format tabular
{{< /highlight >}}

### Set namespace

Use the `set-namespace` command to change the default [namespace][11] for the current user.
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

To log back in to sensuctl:

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

You can set these flags permanently by editing `.config/sensu/sensuctl/{cluster, profile}`.

## Test a user password

To test the password for a user created with Sensu's built-in [basic authentication][44]:

{{< highlight shell >}}
sensuctl user test-creds USERNAME --password 'password'
{{< /highlight >}}

An empty response indicates valid credentials.
A `request-unauthorized` response indicates invalid credentials.

{{% notice note %}}
**NOTE**: The `sensuctl user test-creds` command tests passwords for users created with Sensu's built-in [basic authentication provider](../../installation/auth#use-built-in-basic-authentication).
It does not test user credentials defined via an authentication provider like [Lightweight Directory Access Protocol (LDAP)](../../installation/auth/#ldap-authentication) or [Active Directory (AD)](../../installation/auth/#ad-authentication). 
{{% /notice %}}

For example, if you test LDAP credentials with the `sensuctl user test-creds` command, the backend will log an error, even if you know the LDAP credentials are correct:

{{< highlight shell >}}
{"component":"apid.routers","error":"basic provider is disabled","level":"info","msg":"invalid username and/or password","time":"2020-02-07T20:42:14Z","user":"dev"}
{{< /highlight >}}

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

* RFC3339 with numeric zone offset: `2018-05-10T07:04:00-08:00` or
  `2018-05-10T15:04:00Z`
* RFC3339 with space delimiters and numeric zone offset: `2018-05-10 07:04:00
  -08:00`
* Sensu alpha legacy format with canonical zone ID: `May 10 2018 7:04AM
  America/Vancouver`

## Shell auto-completion

### Installation (Bash shell)

Make sure bash-completion is installed.
If you use a current Linux in a non-minimal installation, bash-completion should be available.

On macOS, install with:

{{< highlight shell >}}
brew install bash-completion
{{< /highlight >}}

Then add this to your `~/.bash_profile`:

{{< highlight shell >}}
if [ -f $(brew --prefix)/etc/bash_completion ]; then
. $(brew --prefix)/etc/bash_completion
fi
{{< /highlight >}}

After bash-completion is installed, add this to your `~/.bash_profile`:

{{< highlight shell >}}
source <(sensuctl completion bash)
{{< /highlight >}}

Now you can source your `~/.bash_profile` or launch a new terminal to use shell auto-completion.

{{< highlight shell >}}
source ~/.bash_profile
{{< /highlight >}}

### Installation (ZSH)

Add this to your `~/.zshrc`:

{{< highlight shell >}}
source <(sensuctl completion zsh)
{{< /highlight >}}

Now you can source your `~/.zshrc` or launch a new terminal to use shell auto-completion.

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

## Configuration files

During configuration, sensuctl creates configuration files that contain information for connecting to your Sensu Go deployment.
You can find these files at `$HOME/.config/sensu/sensuctl/profile` and `$HOME/.config/sensu/sensuctl/cluster`.

For example:

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

These configuration files are useful if you want to know which cluster you're connecting to or which namespace or username you're currently configured to use.


[1]: ../../reference/rbac/
[2]: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
[3]: #sensuctl-create-resource-types
[4]: ../../installation/install-sensu/#install-sensuctl
[5]: ../../reference/agent/#general-configuration-flags
[6]: ../../reference/
[7]: ../../guides/clustering/
[8]: #create-resources
[9]: #sensu-backend-url
[10]: #preferred-output-format
[11]: #username-password-and-namespace
[12]: ../../reference/assets/
[13]: ../../reference/checks/
[14]: ../../reference/entities/
[15]: ../../reference/events/
[16]: ../../reference/filters/
[17]: ../../reference/handlers/
[18]: ../../reference/hooks/
[19]: ../../reference/mutators/
[20]: ../../reference/silencing/
[21]: ../../reference/rbac#namespaces
[22]: ../../reference/rbac#users
[23]: #subcommands
[24]: #sensuctl-edit-resource-types
[25]: ../../api/overview/
[26]: ../../installation/auth/#ldap-authentication
[27]: ../../reference/tessen/
[28]: ../../api/overview#response-filtering
[29]: ../../api/overview#field-selector
[30]: ../../getting-started/enterprise/
[31]: #manage-sensuctl
[32]: ../../reference/datastore/
[33]: #create-resources-across-namespaces
[34]: https://bonsai.sensu.io/
[35]: ../../reference/etcdreplicators/
[36]: /images/sensu-influxdb-handler-namespace.png
[37]: https://bonsai.sensu.io/assets/portertech/sensu-ec2-discovery
[39]: #wrapped-json-format
[40]: ../../installation/install-sensu/#install-the-sensu-backend
[41]: ../../reference/secrets/
[42]: ../../installation/auth/#ad-authentication
[43]: ../../reference/secrets-providers/
[44]: ../../installation/auth#use-built-in-basic-authentication
[45]: ../../installation/install-sensu/#2-configure-and-start
[46]: #first-time-setup
[47]: ../../api/overview/#operators
[48]: #sensuctl-prune-resource-types
