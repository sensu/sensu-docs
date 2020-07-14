---
title: "Secrets providers"
linkTitle: "Secrets Providers"
description: "Sensu's secrets management capability allows you to avoid exposing secrets like usernames, passwords, and access keys in your Sensu configuration. Read the reference to obtain secrets from one or more external secrets providers and support references to external secrets in your Sensu configuration."
weight: 148
version: "5.17"
product: "Sensu Go"
menu: 
  sensu-go-5.17:
    parent: reference
---

- [Secrets providers specification](#secrets-providers-specification)
  - [Top-level attributes](#top-level-attributes) | [Metadata attributes](#metadata-attributes) | [Spec attributes](#spec-attributes)
- [Secrets providers configuration](#secrets-providers-configuration)
- [Secrets providers examples](#secrets-providers-examples)

**COMMERCIAL FEATURE**: Access the Env and VaultProvider secrets provider datatypes in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][1].

Sensu's secrets management eliminates the need to expose secrets like usernames, passwords, and access keys in your Sensu configuration.
With Sensu's secrets management, you can obtain secrets from one or more external secrets providers, refer to external secrets, and consume secrets via [backend environment variables][4].

_**NOTE**: Secrets management is implemented for [checks][18], [handlers][19], and [mutators][20]._

Only Sensu backends have access to request [secrets][9] from a secrets provider.
Secrets are only transmitted over a TLS websocket connection.
Unencrypted connections must not transmit privileged information.
For agent-side resources, enable TLS/mTLS.

The [Sensu Go commercial distribution][1] includes a built-in secrets provider, `Env`, that exposes secrets from [environment variables][4] on your Sensu backend nodes.
You can also use the secrets provider `VaultProvider` to authenticate via the HashiCorp Vault integration's [token auth method][10] or [TLS certificate auth method][11].

You can configure any number of secrets providers.
Secrets providers are cluster-wide resources and compatible with generic functions.
 
## Secrets providers specification

_**NOTE**: The attribute descriptions in this section use the `VaultProvider` datatype. The [secrets providers examples][13] section includes an example for the `Env` datatype._

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the resource type. May be either `Env` (if you are using Sensu's built-in secrets provider) or `VaultProvider` (if you are using HashiCorp Vault as the secrets provider).
required     | Required for secrets configuration in `wrapped-json` or `yaml` format.
type         | String
example      | {{< highlight shell >}}"type": "VaultProvider"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For secrets configuration in this version of Sensu, the api_version should always be `secrets/v1`.
required     | Required for secrets configuration in `wrapped-json` or `yaml` format.
type         | String
example      | {{< highlight shell >}}"api_version": "secrets/v1"{{< /highlight >}}

metadata     |      |
-------------|------
description  | Top-level scope that contains the secrets provider `name`. Namespace is not supported in the metadata because secrets providers are cluster-wide resources.
required     | true
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"metadata": {
  "name": "vault"
}
{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes secrets provider configuration [spec attributes][8].
required     | Required for secrets configuration in `wrapped-json` or `yaml` format.
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"spec": {
  "client": {
    "address": "https://vaultserver.example.com:8200",
    "max_retries": 2,
    "rate_limiter": {
      "limit": 10.0,
      "burst": 100
    },
    "timeout": "20s",
    "tls": {
      "ca_cert": "/etc/ssl/certs/vault_ca_cert.pem"
    },
    "token": "VAULT_TOKEN",
    "version": "v1"
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
required     | true
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"client": {
  "address": "https://vaultserver.example.com:8200",
  "max_retries": 2,
  "rate_limiter": {
    "limit": 10.0,
    "burst": 100
  },
  "timeout": "20s",
  "tls": {
    "ca_cert": "/etc/ssl/certs/vault_ca_cert.pem"
  },
  "token": "VAULT_TOKEN",
  "version": "v1"
}
  
{{< /highlight >}}

#### Client attributes

address      | 
-------------|------ 
description  | Vault server address.
required     | true
type         | String
example      | {{< highlight shell >}}
"address": "https://vaultserver.example.com:8200"
{{< /highlight >}}

max_retries  | 
-------------|------ 
description  | Number of times to retry connecting to the vault provider.
required     | true
type         | Integer
default      | 2
example      | {{< highlight shell >}}"max_retries": 2{{< /highlight >}}

rate_limiter | 
-------------|------ 
description  | Maximum [rate and burst limits][17] for the secrets API.
required     | false
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"rate_limiter": {
  "limit": 10.0,
  "burst": 100
}
{{< /highlight >}}

timeout      | 
-------------|------ 
description  | Provider connection timeout (hard stop).
required     | false
type         | String
default      | 60s
example      | {{< highlight shell >}}"timeout": "20s"{{< /highlight >}}

<a name="tls-vault"></a>

tls          | 
-------------|------ 
description  | TLS object. Vault only works with TLS configured. You may need to set up a CA cert if it is not already stored in your operating system's trust store. To do this, set the TLS object and provide the `ca_cert` path. You may also need to set up `client_cert`, `client_key`, or [`cname`][15].
required     | false
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"tls": {
  "ca_cert": "/etc/ssl/certs/vault_ca_cert.pem",
  "client_cert": "/etc/ssl/certs/vault_cert.pem",
  "client_key": "/etc/ssl/certs/vault_key.pem",
  "cname": "vault_client.example.com"
}
{{< /highlight >}}

token        | 
-------------|------ 
description  | Vault token to use for authentication.
required     | true
type         | String
example      | {{< highlight shell >}}"token": "VAULT_TOKEN"{{< /highlight >}}

version      | 
-------------|------ 
description  | HashiCorp Vault [HTTP API version][14].
required     | true
type         | String
example      | {{< highlight shell >}}"version": "v1"{{< /highlight >}}

<a name="rate-limiter-attributes"></a>

#### Rate limiter attributes

limit        | 
-------------|------ 
description  | Maximum number of secrets requests per second that can be transmitted to the backend with the secrets API.
required     | false
type         | Float
example      | {{< highlight shell >}}"limit": 10.0{{< /highlight >}}

burst        | 
-------------|------ 
description  | Maximum amount of burst allowed in a rate interval for the secrets API.
required     | false
type         | Integer
example      | {{< highlight shell >}}"burst": 100{{< /highlight >}}

## Secrets providers configuration

You can use the [Secrets API][2] to create, view, and manage your secrets providers configuration.

For example, to retrieve the list of secrets providers:

{{< highlight shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/secrets/v1/providers \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN"
{{< /highlight >}}

## Secrets providers examples

### VaultProvider example

The `VaultProvider` secrets provider is a vendor-specific implementation for [HashiCorp Vault][5] secrets management.

{{< language-toggle >}}

{{< highlight yml >}}
---
type: VaultProvider
api_version: secrets/v1
metadata:
  name: vault
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
    "name": "vault"
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

Sensu's built-in `Env` secrets provider exposes secrets from [backend environment variables][4].
The `Env` secrets provider is automatically created with an empty `spec` when you start your Sensu backend.

Using the `Env` secrets provider may require you to synchronize environment variables in Sensu backend clusters.
The [Use secrets management][16] guide demonstrates how to configure the `Env` secrets provider.

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


[1]: ../../commercial/
[2]: ../../api/secrets/
[3]: ../../sensuctl/reference/
[4]: ../backend/#configuration-via-environment-variables
[5]: https://www.vaultproject.io/docs/what-is-vault/
[6]: ../../reference/rbac#default-users
[7]: ../../sensuctl/reference#create-resources
[8]: #spec-attributes
[9]: ../secrets/
[10]: https://www.vaultproject.io/docs/auth/token/
[11]: https://www.vaultproject.io/api/auth/cert/index.html
[12]: #client-attributes
[13]: #env-example
[14]: https://www.vaultproject.io/api-docs/
[15]: https://www.vaultproject.io/api/auth/cert/index.html#parameters-7
[16]: ../../guides/secrets-management/
[17]: #rate-limiter-attributes
[18]: ../checks/#check-with-secret
[19]: ../handlers/#handler-with-secret
[20]: ../mutators/#mutator-with-secret
