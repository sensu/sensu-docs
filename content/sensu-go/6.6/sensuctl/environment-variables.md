---
title: "Set environment variables with sensuctl"
linkTitle: "Set Environment Variables"
description: "Read this page to learn how to use sensuctl, Sensu's command line tool, to set and export environment variables."
weight: 40
version: "6.6"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-6.6:
    parent: sensuctl
---

Sensu allows you to set sensuctl environment variables for a [single sensuctl command][1] or with [sensuctl configure][2].
You can also export environment variables with [sensuctl env][3].

These environment variables are alternatives to configuration flags such as the [sensuctl global flags][4] and [sensuctl configure flags][5].
Setting sensuctl options as environment variables instead of using flags offers the following advantages:

- Environment variables do not expose sensitive information like your API key and other security credentials. This information is visible when you use command-line configuration flags.
- You can inject environment variables for sensuctl commands in an automation script, such as a container creation script.
- If you have more than one Sensu instance, you can configure a shell for each instance with the desired set of environment variables rather than running sensuctl configure every time you want to switch between instances.

## Set environment variables for a single command

You can set the following environment variables for a single sensuctl command to temporarily override your current settings: 

{{< code text >}}
SENSU_API_KEY                     API key to use for authentication
SENSU_API_URL                     host URL of Sensu installation
SENSU_CACHE_DIR                   path to directory containing cache & temporary files
SENSU_CONFIG_DIR                  path to directory containing configuration files
SENSU_INSECURE_SKIP_TLS_VERIFY    skip TLS certificate verification (Boolean value)
SENSU_NAMESPACE                   namespace in which to perform actions (default "default")
SENSU_TIMEOUT                     timeout when communicating with sensu backend (default 15s)
SENSU_TRUSTED_CA_FILE             TLS CA certificate bundle in PEM format
{{< /code >}}

For example, to quickly check the entities in the `production` namespace while you are currently in the `default` namespace, run:

{{< code shell >}}
SENSU_NAMESPACE=production sensuctl entity list
{{< /code >}}

Single-command environment variables are not persistent &mdash; to continue the example, if you run `sensuctl entity list` again, the response will include entities for the `default` namespace (not `production`).

## Set environment variables with sensuctl configure

You can set the following environment variables for sensuctl configure:

{{< code text >}}
SENSU_FORMAT                      preferred output format (default "tabular")
SENSU_NON_INTERACTIVE             do not administer interactive questionnaire
SENSU_OIDC                        use an OIDC provider for authentication (Boolean value)
SENSU_PASSWORD                    password
SENSU_PORT (used with SENSU_OIDC) port for local HTTP web server used for OAuth 2 callback during OIDC authentication (default 8000)
SENSU_URL                         the sensu backend url (default "http://localhost:8080")
SENSU_USERNAME                    username
{{< /code >}}

To set environment variables with sensuctl configure, define the environment variables in the same command.
For example:

{{< code shell >}}
SENSU_OIDC=true SENSU_NON_INTERACTIVE=true SENSU_FORMAT=yaml SENSU_PORT=7999 SENSU_TIMEOUT=49s SENSU_URL=http://192.168.7.217:8080 sensuctl configure
{{< /code >}}

Environment variables set with `sensuctl configure` are persistent.

## Export environment variables with sensuctl env

The `sensuctl env` command allows you to export the following environment variables:

{{< code text >}}
SENSU_API_KEY                     API key to use for authentication
SENSU_API_URL                     URL of the Sensu backend API in sensuctl
SENSU_NAMESPACE                   Name of the current namespace in sensuctl
SENSU_FORMAT                      Set output format in sensuctl (for example, JSON, YAML, etc.)
SENSU_ACCESS_TOKEN                Current API access token in sensuctl
SENSU_ACCESS_TOKEN_EXPIRES_AT     Timestamp specifying when the current API access token expires
SENSU_REFRESH_TOKEN               Refresh token used to obtain a new access token
SENSU_TIMEOUT                     timeout when communicating with sensu backend (default 15s)
SENSU_TRUSTED_CA_FILE             Path to a trusted CA file if set in sensuctl
SENSU_INSECURE_SKIP_TLS_VERIFY    Boolean value that can be set to skip TLS verification
{{< /code >}}

Once you export your shell environment with `sensuctl env`, you can use the exported environment variables with curl and other scripts.

This example demonstrates how to use sensuctl env to export environment variables and configure your shell:

{{< language-toggle >}}

{{< code bash >}}
export SENSU_API_URL="http://127.0.0.1:8080"
export SENSU_NAMESPACE="default"
export SENSU_FORMAT="tabular"
export SENSU_ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x.x"
export SENSU_ACCESS_TOKEN_EXPIRES_AT="1567716187"
export SENSU_REFRESH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x.x"
export SENSU_TRUSTED_CA_FILE=""
export SENSU_INSECURE_SKIP_TLS_VERIFY="true"
eval $(sensuctl env)
{{< /code >}}

{{< code cmd >}}
SET SENSU_API_URL=http://127.0.0.1:8080
SET SENSU_NAMESPACE=default
SET SENSU_FORMAT=tabular
SET SENSU_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x.x
SET SENSU_ACCESS_TOKEN_EXPIRES_AT=1567716676
SET SENSU_REFRESH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x.x
SET SENSU_TRUSTED_CA_FILE=
SET SENSU_INSECURE_SKIP_TLS_VERIFY=true
@FOR /f "tokens=*" %i IN ('sensuctl env --shell cmd') DO @%i
{{< /code >}}

{{< code powershell >}}
$Env:SENSU_API_URL = "http://127.0.0.1:8080"
$Env:SENSU_NAMESPACE = "default"
$Env:SENSU_FORMAT = "tabular"
$Env:SENSU_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x.x"
$Env:SENSU_ACCESS_TOKEN_EXPIRES_AT = "1567716738"
$Env:SENSU_REFRESH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x.x"
$Env:SENSU_TRUSTED_CA_FILE = ""
$Env:SENSU_INSECURE_SKIP_TLS_VERIFY = "true"
& sensuctl env --shell powershell | Invoke-Expression
{{< /code >}}

{{< /language-toggle >}}


[1]: #set-environment-variables-for-a-single-command
[2]: #set-environment-variables-with-sensuctl-configure
[3]: #set-environment-variables-with-sensuctl-env
[4]: ../#global-flags
[5]: ../#sensuctl-configure-flags
