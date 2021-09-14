---
title: "Set environment variables with sensuctl"
linkTitle: "Set Environment Variables"
description: "Sensuctl includes a command to help export and set environment variables on your systems. Read this reference doc for sensuctl environment variable usage examples."
weight: 40
version: "6.5"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-6.5:
    parent: sensuctl
---

Sensu allows you to set environment variables with sensuctl rather than editing the sensuctl config file.

You can set the following environment variables with sensuctl:

{{< code text >}}
SENSU_ACCESS_TOKEN               Current API access token in sensuctl
SENSU_ACCESS_TOKEN_EXPIRES_AT    Timestamp specifying when the current API access token expires
SENSU_API_KEY                    API key to use for authentication
SENSU_API_URL                    host URL of Sensu installation
SENSU_CACHE_DIR                  path to directory containing cache & temporary files (default "/var/cache/sensu/sensuctl")
SENSU_CONFIG_DIR                 path to directory containing configuration files (default "/var/cache/sensu/sensuctl")
SENSU_FORMAT                     Set output format in sensuctl (for example, JSON, YAML, etc.)
SENSU_INSECURE_SKIP_TLS_VERIFY   skip TLS certificate verification (not recommended!)
SENSU_NAMESPACE                  Name of the current namespace in sensuctl
SENSU_OIDC
SENSU_PORT
SENSU_REFRESH_TOKEN              Refresh token used to obtain a new access token
SENSU_TIMEOUT                    timeout when communicating with sensu backend (default 15s)
SENSU_TRUSTED_CA_FILE            TLS CA certificate bundle in PEM format
{{< /code >}}

{{% notice note %}}
**NOTE**: The list of supported environment variables includes the [sensuctl global flags](../#global-flags).
{{% /notice %}}

To set environment variables with sensuctl, use either [sensuctl configure][1] or [sensuctl env][2].

## Set environment variables with sensuctl configure

To set environment variables with sensuctl configure, define the environment variables in the same command.
For example:

{{< code shell >}}
SENSU_OIDC=true SENSU_NON_INTERACTIVE=true SENSU_FORMAT=yaml SENSU_PORT=7999 SENSU_TIMEOUT=49s SENSU_URL=http://192.168.7.217:8080 sensuctl configure
{{< /code >}}

## Set environment variables with sensuctl env

The `sensuctl env` command allows you to export and set environment variables on your systems.

This example demonstrates how to use sensuctl env to export and set environment variables and configure your shell:

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


[1]: #set-environment-variables-with-sensuctl-configure
[2]: #set-environment-variables-with-sensuctl-env
