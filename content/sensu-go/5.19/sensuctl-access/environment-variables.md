---
title: "Use environment variables with sensuctl"
linkTitle: "Environment Variables"
description: "Sensuctl is a command line tool for managing resources within Sensu. It works by calling Sensu’s underlying API to create, read, update, and delete resources, events, and entities. Read this reference doc to learn about sensuctl."
weight: 50
version: "5.19"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.19:
    parent: sensuctl-access
---


Sensuctl includes the `sensuctl env` command to help export and set environment variables on your systems.

{{< highlight text >}}
SENSU_API_URL                    URL of the Sensu backend API in sensuctl
SENSU_NAMESPACE                  Name of the current namespace in sensuctl
SENSU_FORMAT                     Set output format in sensuctl (e.g. JSON, YAML, etc.)
SENSU_ACCESS_TOKEN               Current API access token in sensuctl
SENSU_ACCESS_TOKEN_EXPIRES_AT    Timestamp specifying when the current API access token expires
SENSU_REFRESH_TOKEN              Refresh token used to obtain a new access token
SENSU_TRUSTED_CA_FILE            Path to a trusted CA file if set in sensuctl
SENSU_INSECURE_SKIP_TLS_VERIFY   Boolean value that can be set to skip TLS verification
{{< /highlight >}}

## Usage

{{< language-toggle >}}

{{< highlight bash >}}
sensuctl env
export SENSU_API_URL="http://127.0.0.1:8080"
export SENSU_NAMESPACE="default"
export SENSU_FORMAT="tabular"
export SENSU_ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x.x"
export SENSU_ACCESS_TOKEN_EXPIRES_AT="1567716187"
export SENSU_REFRESH_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x.x"
export SENSU_TRUSTED_CA_FILE=""
export SENSU_INSECURE_SKIP_TLS_VERIFY="true"

# Run this command to configure your shell:
# eval $(sensuctl env)
{{< /highlight >}}

{{< highlight cmd >}}
sensuctl env --shell cmd
SET SENSU_API_URL=http://127.0.0.1:8080
SET SENSU_NAMESPACE=default
SET SENSU_FORMAT=tabular
SET SENSU_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x.x
SET SENSU_ACCESS_TOKEN_EXPIRES_AT=1567716676
SET SENSU_REFRESH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x.x
SET SENSU_TRUSTED_CA_FILE=
SET SENSU_INSECURE_SKIP_TLS_VERIFY=true
REM Run this command to configure your shell:
REM   @FOR /f "tokens=*" %i IN ('sensuctl env --shell cmd') DO @%i
{{< /highlight >}}

{{< highlight powershell >}}
sensuctl env --shell powershell
$Env:SENSU_API_URL = "http://127.0.0.1:8080"
$Env:SENSU_NAMESPACE = "default"
$Env:SENSU_FORMAT = "tabular"
$Env:SENSU_ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x.x"
$Env:SENSU_ACCESS_TOKEN_EXPIRES_AT = "1567716738"
$Env:SENSU_REFRESH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.x.x"
$Env:SENSU_TRUSTED_CA_FILE = ""
$Env:SENSU_INSECURE_SKIP_TLS_VERIFY = "true"

# Run this command to configure your shell:
# & sensuctl env --shell powershell | Invoke-Expression
{{< /highlight >}}

{{< /language-toggle >}}

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
