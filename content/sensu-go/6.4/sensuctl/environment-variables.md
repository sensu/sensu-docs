---
title: "Set environment variables with sensuctl"
linkTitle: "Set Environment Variables"
description: "Use sensuctl to set environment variables for a single command or for all sensuctl commands and export and set environment variables on your system."
weight: 40
toc: false
version: "6.4"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-6.4:
    parent: sensuctl
---

Export your shell environment with sensuctl env to use the exported environment variables with cURL and other scripts.

These environment variables are alternatives to configuration flags like the [sensuctl global flags][4].

Use environment variables to avoid exposing sensitive information like your access token and other security credentials.
You can also inject exported environment variables for sensuctl commands in an automation script, such as a container creation script.

This example shows how to use sensuctl env to export environment variables and configure your shell:

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

{{% notice note %}}
**NOTE**: If you receive an `invalid credentials` error while using sensuctl env, run `eval $(sensuctl env)` to refresh your token.
{{% /notice %}}

The `sensuctl env` command allows you to export the following environment variables:

{{< code text >}}
SENSU_API_URL                     URL of the Sensu backend API in sensuctl
SENSU_NAMESPACE                   Name of the current namespace in sensuctl
SENSU_FORMAT                      Set output format in sensuctl (for example, JSON, YAML, etc.)
SENSU_ACCESS_TOKEN                Current API access token in sensuctl
SENSU_ACCESS_TOKEN_EXPIRES_AT     Timestamp specifying when the current API access token expires
SENSU_REFRESH_TOKEN               Refresh token used to obtain a new access token
SENSU_TRUSTED_CA_FILE             Path to a trusted CA file if set in sensuctl
SENSU_INSECURE_SKIP_TLS_VERIFY    Boolean value that can be set to skip TLS verification
{{< /code >}}


[4]: ../#global-flags
[5]: ../#sensuctl-configure-flags
