---
title: "Secret Providers"
description: "Sensu's secrets management capability allows you to avoid exposing secrets in your Sensu configuration. Read the reference to obtain secrets from one or more external secrets management providers and support references to external secrets in your Sensu configuration."
weight: 148
version: "5.17"
product: "Sensu Go"
menu: 
  sensu-go-5.17:
    parent: reference
---

- [Secret providers specification](#secret-providers-specification)
  - [Top-level attributes](#top-level-attributes) | [Metadata attributes](#metadata-attributes) | [Spec attributes](#spec-attributes)
- [Secret providers examples](#secret-providers-examples)

**COMMERCIAL FEATURE**: Access the Env and Vault datatypes for secret providers in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][1].

Sensu's secrets management eliminates the need to expose secrets in your Sensu configuration.
With Sensu's secrets management, you can obtain secrets from one or more external secret providers, refer to external secrets, and consume secrets via environment variables.

Only Sensu backends have access to request [secrets][9] from a secret provider.
Secrets are only transmitted over a TLS websocket connection.
Unencrypted connections must not transmit privileged information.
For agent-side resources, enable TLS/mTLS.

The [Sensu Go commercial distribution][1] includes a built-in secret provider, `Env`, that exposes secrets from [environment variables][9] on the Sensu backend nodes.
You can also use the secret provider `VaultProvider` to authenticate via the HashiCorp Vault integration's [token auth method][10] or [TLS certificate auth method][11].

You can configure any number of secret providers.
Secret providers are cluster-wide resources and compatible with generic functions.
 
## Secret providers specification

_**NOTE**: The attribute descriptions in this section use the `VaultProvider` datatype. The [secret providers examples][13] section includes an example for the `Env` datatype._

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the resource type. May be either type `Env` (if you are using Sensu's built-in secret provider) or `VaultProvider` (if you are using HashiCorp Vault as the secret provider).
required     | Required for secrets configuration in `wrapped-json` or `yaml` format.
type         | String
example      | {{< highlight shell >}}"type": "VaultProvider"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For secrets configuration in this version of Sensu, the `api_version` should always be `secrets/v1`.
required     | Required for secrets configuration in `wrapped-json` or `yaml` format.
type         | String
example      | {{< highlight shell >}}"api_version": "secrets/v1"{{< /highlight >}}

metadata     |      |
-------------|------
description  | Top-level scope that contains the secret provider `name`. Namespace is not supported in the metadata because secret providers are cluster-wide resources.
required     | true
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"metadata": {
  "name": "vault"
}
{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes secret provider configuration [spec attributes][8].
required     | Required for secrets configuration in `wrapped-json` or `yaml` format.
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"spec": {
  "client": {
    "address": "https://vaultserver.example.com:8200",
    "token": "VAULT_TOKEN",
    "version": "v1",
    "tls": {
      "ca_cert": "/etc/ssl/certs/vault_ca_cert.pem"
    }
  },
  "max_retries": 2,
  "timeout": "20s",
  "rate_limiter": {
    "limit": 10.0,
    "burst": 100
  }
}
{{< /highlight >}}

### Metadata attributes

name         |      |
-------------|------
description  | Provider name used internally by Sensu.
required     | true
type         | String
example      | {{< highlight shell >}}"name": "vault"{{< /highlight >}}

### Spec attributes

client       | 
-------------|------ 
description  | Map that includes secrets provider configuration [client attributes][12].
required     | NEEDED
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"client": {
  "address": "https://vaultserver.example.com:8200",
  "token": "VAULT_TOKEN",
  "version": "v1",
  "tls": {
    "ca_cert": "/etc/ssl/certs/vault_ca_cert.pem"
}
{{< /highlight >}}

max_retries  | 
-------------|------ 
description  | Number of times to retry connecting to the vault provider.
required     | true
type         | Integer
default      | NEEDED
example      | {{< highlight shell >}}"max_retries": 2{{< /highlight >}}

timeout      | 
-------------|------ 
description  | Provider connection execution duration timeout (hard stop). In seconds.
required     | true
type         | Integer
default      | `false`
example      | {{< highlight shell >}}"timeout": "20s"{{< /highlight >}}

rate_limiter | 
-------------|------ 
description  | Maximum rate and burst limits for the secrets API.
required     | true
type         | Map of key-value pairs
default      | NEEDED
example      | {{< highlight shell >}}
"rate_limiter": {
  "limit": 10.0,
  "burst": 100
}
{{< /highlight >}}

#### Client attributes

address      | 
-------------|------ 
description  | Vault address to use for authentication.
required     | true
type         | String
default      | NEEDED
example      | {{< highlight shell >}}
"address": "https://vaultserver.example.com:8200"
{{< /highlight >}}

token        | 
-------------|------ 
description  | Vault token to use for authentication.
required     | true
type         | String
default      | NEEDED
example      | {{< highlight shell >}}"token": "VAULT_TOKEN"{{< /highlight >}}

version      | 
-------------|------ 
description  | HashiCorp Vault version.
required     | true
type         | String
default      | NEEDED
example      | {{< highlight shell >}}"version": "v1"{{< /highlight >}}

tls          | 
-------------|------ 
description  | TLS object. Vault only works with TLS configured. You may need to set up a CA cert if it is not already stored in your operating system's trust store. To do this, set the TLS object, and provide the `ca_cert` path.
required     | true
type         | Map of key-value pairs
default      | NEEDED
example      | {{< highlight shell >}}
"tls": {
  "ca_cert": "/etc/ssl/certs/vault_ca_cert.pem"
}
{{< /highlight >}}

#### Rate limiter attributes

limit        | 
-------------|------ 
description  | Maximum number of secrets requests per second that can be transmitted to the backend with the agent secrets API.
required     | NEEDED
type         | integer
default      | NEEDED
example      | {{< highlight shell >}}"limit": 10.0{{< /highlight >}}

burst        | 
-------------|------ 
description  | Maximum amount of burst allowed in a rate interval for the secrets API.
required     | NEEDED
type         | integer
default      | NEEDED
example      | {{< highlight shell >}}"burst": 100{{< /highlight >}}

## Secret providers examples

### HashiCorp Vault example

{{< language-toggle >}}

{{< highlight yml >}}
---
type: VaultProvider
api_version: secrets/v1
metadata:
  name: vault1
spec:
  client:
    address: https://vaultserver.example.com:8200
    token: VAULT_TOKEN
    version: v1
    tls:
      ca_cert: "/etc/ssl/certs/vault_ca_cert.pem"
    max_retries: 2
    timeout: 20s
    rate_limiter:
      limit: 10
      burst: 100
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "VaultProvider",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "vault1"
  },
  "spec": {
    "client": {
      "address": "https://vaultserver.example.com:8200",
      "token": "VAULT_TOKEN",
      "version": "v1",
      "tls": {
        "ca_cert": "/etc/ssl/certs/vault_ca_cert.pem"
      },
      "max_retries": 2,
      "timeout": "20s",
      "rate_limiter": {
        "limit": 10.0,
        "burst": 100
      }
    }
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

### Env example

If you use the built-in `Env` secret provider, [WIP -- to complete]

{{< language-toggle >}}

{{< highlight yml >}}
---
type: Env
api_version: secrets/v1
metadata:
  name: env
spec: {}
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Env",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "env"
  },
  "spec": {}
}
{{< /highlight >}}

{{< /language-toggle >}}


[1]: ../../getting-started/enterprise/
[2]: ../../api/secrets/
[3]: ../../sensuctl/reference/
[4]: ../../sensuctl/reference/#subcommands
[5]: ../../guides/troubleshooting
[6]: ../../reference/rbac#default-users
[7]: ../../sensuctl/reference#create-resources
[8]: #spec-attributes
[9]: ../secret-providers/
[10]: https://www.vaultproject.io/docs/auth/token/
[11]: https://www.vaultproject.io/api/auth/cert/index.html
[12]: #client-attributes
[13]: #env-example
