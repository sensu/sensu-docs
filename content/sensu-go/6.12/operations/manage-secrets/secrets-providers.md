---
title: "Secrets providers reference"
linkTitle: "Secrets Providers Reference"
reference_title: "Secrets providers"
type: "reference"
description: "Avoid exposing sensitive information like usernames, passwords, and access keys in your Sensu configuration with Sensu's secrets management feature."
weight: 30
version: "6.12"
product: "Sensu Go"
menu: 
  sensu-go-6.12:
    parent: manage-secrets
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the `Env`, `CyberArkProvider`, and `VaultProvider` secrets provider datatypes in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

Sensu's secrets management eliminates the need to expose secrets like usernames, passwords, and access keys in your Sensu configuration.
With Sensu's secrets management, you can obtain secrets from one or more external secrets providers, refer to external secrets, and consume secrets via [backend environment variables][4].

{{% notice note %}}
**NOTE**: Secrets management is implemented for [checks](../../../observability-pipeline/observe-schedule/checks/#check-example-that-uses-secrets-management), [handlers](../../../observability-pipeline/observe-process/handlers/#use-secrets-management-in-a-handler), and [mutators](../../../observability-pipeline/observe-transform/mutators/#use-secrets-management-in-a-mutator).
{{% /notice %}}

Only Sensu backends have access to request [secrets][9] from a secrets provider.
Secrets are only transmitted over a transport layer security (TLS) WebSocket connection.
Unencrypted connections must not transmit privileged information.
For checks, hooks, and dynamic runtime assets, you must [enable mutual TLS (mTLS)][13].
Sensu will not transmit secrets to agents that do not use mTLS.

The [Sensu Go commercial distribution][1] includes a secrets provider, `Env`, that exposes secrets from [environment variables][4] on your Sensu backend nodes.
You can also use the `CyberArkProvider` and `VaultProvider` secrets providers.

You can configure any number of `CyberArkProvider` and `VaultProvider` secrets providers.
However, you can only have a single `Env` secrets provider: the one that is included with the Sensu Go [commercial distribution][1].

Secrets providers are cluster-wide resources and compatible with generic functions.

## Env secrets provider example

Sensu's `Env` secrets provider exposes secrets from [backend environment variables][4].
The `Env` secrets provider is automatically created with an empty `spec` when you start your Sensu backend.

Using the `Env` secrets provider may require you to synchronize environment variables in Sensu backend clusters.
Read [Use secrets management][16] to learn how to configure the `Env` secrets provider.

{{< language-toggle >}}

{{< code yml >}}
---
type: Env
api_version: secrets/v1
metadata:
  name: env
spec: {}
{{< /code >}}

{{< code json >}}
{
  "type": "Env",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "env"
  },
  "spec": {}
}
{{< /code >}}

{{< /language-toggle >}}

## CyberArkProvider secrets provider example

The `CyberArkProvider` secrets provider is a vendor-specific implementation for [CyberArk Conjur][18] secrets management.

{{< language-toggle >}}

{{< code yml >}}
---
type: CyberArkProvider
api_version: secrets/v1
metadata:
  name: cyberark
spec:
  client:
    account: sensu.io
    appliance_url: http://localhost:8480
    login: host/Sensu/sensuBackend
    api_key: CONJUR_API_KEY
    timeout: 1s
    tls:
      ca_cert: "/etc/ssl/certs/conjur_ca_cert.pem"
    ttl: 60s
{{< /code >}}

{{< code json >}}
{
  "type": "CyberArkProvider",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "cyberark"
  },
  "spec": {
    "client": {
      "account": "sensu.io",
      "appliance_url": "http://localhost:8480",
      "login": "host/Sensu/sensuBackend",
      "api_key": "CONJUR_API_KEY",
      "timeout": "1s",
      "tls": {
        "ca_cert": "/etc/ssl/certs/conjur_ca_cert.pem"
      },
      "ttl": "60s"
    }
  }
}
{{< /code >}}

{{< /language-toggle >}}

## VaultProvider secrets provider example

The `VaultProvider` secrets provider is a vendor-specific implementation for [HashiCorp Vault][5] secrets management.

{{< language-toggle >}}

{{< code yml >}}
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
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

## Secrets provider configuration

You can use the [enterprise/secrets/v1 API endpoints][2] to create, view, and manage your secrets provider configuration.

For example, to retrieve the list of secrets providers:

{{< code shell >}}
curl -X GET \
http://127.0.0.1:8080/api/enterprise/secrets/v1/providers \
-H "Authorization: Key $SENSU_API_KEY"
{{< /code >}}
 
## Secrets provider specification

{{% notice note %}}
**NOTE**: The attribute descriptions in this section use the `CyberArkProvider` and `VaultProvider` datatypes.
Review the [Env secrets provider example](#env-secrets-provider-example) for an example definition for the `Env` datatype.
{{% /notice %}}

### Top-level attributes

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For secrets configuration in this version of Sensu, the api_version should always be `secrets/v1`.
required     | Required for secrets configuration in `wrapped-json` or `yaml` format.
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: secrets/v1
{{< /code >}}
{{< code json >}}
{
  "api_version": "secrets/v1"
}
{{< /code >}}
{{< /language-toggle >}}

metadata     |      |
-------------|------
description  | Top-level scope that contains the secrets provider `name` and `created_by` field. Namespace is not supported in the metadata because secrets providers are cluster-wide resources.
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: vault
  created_by: admin
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "name": "vault",
    "created_by": "admin"
  }
}
{{< /code >}}
{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes secrets provider configuration spec attributes. Read [VaultProvider spec attributes][8] and [CyberArkProvider spec attributes][19] for details.
required     | Required for secrets configuration in `wrapped-json` or `yaml` format.
type         | Map of key-value pairs
CyberArkProvider example | {{< language-toggle >}}
{{< code yml >}}
spec:
  client:
    account: sensu.io
    appliance_url: http://localhost:8480
    login: host/Sensu/sensuBackend
    api_key: CONJUR_API_KEY
    timeout: 1s
    tls:
      ca_cert: "/etc/ssl/certs/conjur_ca_cert.pem"
    ttl: 60s
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "client": {
      "account": "sensu.io",
      "appliance_url": "http://localhost:8480",
      "login": "host/Sensu/sensuBackend",
      "api_key": "CONJUR_API_KEY",
      "timeout": "1s",
      "tls": {
        "ca_cert": "/etc/ssl/certs/conjur_ca_cert.pem"
      },
      "ttl": "60s"
    }
  }
}
{{< /code >}}
{{< /language-toggle >}}
VaultProvider example | {{< language-toggle >}}
{{< code yml >}}
spec:
  client:
    address: https://vaultserver.example.com:8200
    max_retries: 2
    rate_limiter:
      limit: 10
      burst: 100
    timeout: 20s
    tls:
      ca_cert: "/etc/ssl/certs/vault_ca_cert.pem"
    token: VAULT_TOKEN
    version: v1
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "client": {
      "address": "https://vaultserver.example.com:8200",
      "max_retries": 2,
      "rate_limiter": {
        "limit": 10,
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
}
{{< /code >}}
{{< /language-toggle >}}

type         | 
-------------|------
description  | Top-level attribute that specifies the resource type.
required     | Required for secrets configuration in `wrapped-json` or `yaml` format.
type         | String
allowed values | - `Env` if using Sensu's secrets provider<br>- `CyberArkProvider` if using CyberArk Conjur as the secrets provider<br>- `VaultProvider` if using HashiCorpVault as the secrets provider
example      | {{< language-toggle >}}
{{< code yml >}}
type: VaultProvider
{{< /code >}}
{{< code json >}}
{
  "type": "VaultProvider"
}
{{< /code >}}
{{< /language-toggle >}}

### Metadata attributes

| created_by |      |
-------------|------
description  | Username of the Sensu user who created the secrets provider or last updated the secrets provider. Sensu automatically populates the `created_by` field when the secrets provider is created or updated.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
created_by: admin
{{< /code >}}
{{< code json >}}
{
  "created_by": "admin"
}
{{< /code >}}
{{< /language-toggle >}}

name         |      |
-------------|------
description  | Provider name used internally by Sensu.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: vault
{{< /code >}}
{{< code json >}}
{
  "name": "vault"
}
{{< /code >}}
{{< /language-toggle >}}

### CyberArkProvider spec attributes

client       | 
-------------|------ 
description  | Map that includes [CyberArkProvider client attributes][20].
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
client:
  account: sensu.io
  appliance_url: http://localhost:8480
  login: host/Sensu/sensuBackend
  api_key: CONJUR_API_KEY
  timeout: 1s
  tls:
    ca_cert: "/etc/ssl/certs/conjur_ca_cert.pem"
  ttl: 60s
{{< /code >}}
{{< code json >}}
{
  "client": {
    "account": "sensu.io",
    "appliance_url": "http://localhost:8480",
    "login": "host/Sensu/sensuBackend",
    "api_key": "CONJUR_API_KEY",
    "timeout": "1s",
    "tls": {
      "ca_cert": "/etc/ssl/certs/conjur_ca_cert.pem"
    },
    "ttl": "60s"
  }
}
{{< /code >}}
{{< /language-toggle >}}

#### CyberArkProvider client attributes

account      | 
-------------|------ 
description  | Conjur account name.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
account: sensu.io
{{< /code >}}
{{< code json >}}
{
  "account": "sensu.io"
}
{{< /code >}}
{{< /language-toggle >}}

appliance_url | 
--------------|------ 
description   | Conjur appliance URL (the HTTP or HTTPS endpoint CyberArk listens on).
required      | true
type          | String
example       | {{< language-toggle >}}
{{< code yml >}}
appliance_url: http://localhost:8480
{{< /code >}}
{{< code json >}}
{
  "appliance_url": "http://localhost:8480"
}
{{< /code >}}
{{< /language-toggle >}}

login        | 
-------------|------ 
description  | Conjur authentication login. The login includes `host` followed by the values provided for id and host in the Conjur policy: `host/<POLICY_ID>/<POLICY_HOST>`
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
login: host/Sensu/sensuBackend
{{< /code >}}
{{< code json >}}
{
  "login": "host/Sensu/sensuBackend"
}
{{< /code >}}
{{< /language-toggle >}}

timeout      | 
-------------|------ 
description  | Provider connection timeout (hard stop).
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
timeout: 1s
{{< /code >}}
{{< code json >}}
{
  "timeout": "1s"
}
{{< /code >}}
{{< /language-toggle >}}

<a id="tls-conjur"></a>

tls          | 
-------------|------ 
description  | TLS object. You may need to set up a Certificate Authority (CA) certificate if it is not already stored in your operating system's trust store. To do this, set the TLS object and provide the `ca_cert` path. You may also need to set up `client_cert`, `client_key`, or `cname`.
required     | false
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
tls:
  ca_cert: "/etc/ssl/certs/conjur_ca_cert.pem"
  client_cert: "/etc/ssl/certs/conjur_cert.pem"
  client_key: "/etc/ssl/certs/conjur_key.pem"
  cname: conjur_client.example.com
{{< /code >}}
{{< code json >}}
{
  "tls": {
    "ca_cert": "/etc/ssl/certs/conjur_ca_cert.pem",
    "client_cert": "/etc/ssl/certs/conjur_cert.pem",
    "client_key": "/etc/ssl/certs/conjur_key.pem",
    "cname": "conjur_client.example.com"
  }
}
{{< /code >}}
{{< /language-toggle >}}

ttl          | 
-------------|------ 
description  | The time-to-live (TTL) until CyberArkProvider secrets are considered stale. Sensu will cache secrets provider values for this duration.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
ttl: 1s
{{< /code >}}
{{< code json >}}
{
  "ttl": "1s"
}
{{< /code >}}
{{< /language-toggle >}}

### VaultProvider spec attributes

client       | 
-------------|------ 
description  | Map that includes [VaultProvider client attributes][12].
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
client:
  address: https://vaultserver.example.com:8200
  max_retries: 2
  rate_limiter:
    limit: 10
    burst: 100
  timeout: 20s
  tls:
    ca_cert: "/etc/ssl/certs/vault_ca_cert.pem"
  token: VAULT_TOKEN
  version: v1
{{< /code >}}
{{< code json >}}
{
  "client": {
    "address": "https://vaultserver.example.com:8200",
    "max_retries": 2,
    "rate_limiter": {
      "limit": 10,
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
{{< /code >}}
{{< /language-toggle >}}

#### VaultProvider client attributes

address      | 
-------------|------ 
description  | Vault server address.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
address: https://vaultserver.example.com:8200
{{< /code >}}
{{< code json >}}
{
  "address": "https://vaultserver.example.com:8200"
}
{{< /code >}}
{{< /language-toggle >}}

max_retries  | 
-------------|------ 
description  | Number of times to retry connecting to the Vault provider.
required     | true
type         | Integer
default      | 2
example      | {{< language-toggle >}}
{{< code yml >}}
max_retries: 2
{{< /code >}}
{{< code json >}}
{
  "max_retries": 2
}
{{< /code >}}
{{< /language-toggle >}}

rate_limiter | 
-------------|------ 
description  | Maximum rate and burst limits for the [enterprise/secrets/v1][2] API endpoint. Read [rate_limiter attributes][17] for more information.
required     | false
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
rate_limiter:
  limit: 10
  burst: 100
{{< /code >}}
{{< code json >}}
{
  "rate_limiter": {
    "limit": 10,
    "burst": 100
  }
}
{{< /code >}}
{{< /language-toggle >}}

timeout      | 
-------------|------ 
description  | Provider connection timeout (hard stop).
required     | false
type         | String
default      | 60s
example      | {{< language-toggle >}}
{{< code yml >}}
timeout: 20s
{{< /code >}}
{{< code json >}}
{
  "timeout": "20s"
}
{{< /code >}}
{{< /language-toggle >}}

<a id="tls-vault"></a>

tls          | 
-------------|------ 
description  | TLS object. Vault only works with TLS configured. You may need to set up a Certificate Authority (CA) certificate if it is not already stored in your operating system's trust store. To do this, set the TLS object and provide the `ca_cert` path. You may also need to set up `client_cert`, `client_key`, or [`cname`][15].
required     | false
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
tls:
  ca_cert: "/etc/ssl/certs/vault_ca_cert.pem"
  client_cert: "/etc/ssl/certs/vault_cert.pem"
  client_key: "/etc/ssl/certs/vault_key.pem"
  cname: vault_client.example.com
{{< /code >}}
{{< code json >}}
{
  "tls": {
    "ca_cert": "/etc/ssl/certs/vault_ca_cert.pem",
    "client_cert": "/etc/ssl/certs/vault_cert.pem",
    "client_key": "/etc/ssl/certs/vault_key.pem",
    "cname": "vault_client.example.com"
  }
}
{{< /code >}}
{{< /language-toggle >}}

token        | 
-------------|------ 
description  | Vault token to use for authentication.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
token: VAULT_TOKEN
{{< /code >}}
{{< code json >}}
{
  "token": "VAULT_TOKEN"
}
{{< /code >}}
{{< /language-toggle >}}

version      | 
-------------|------ 
description  | HashiCorp Vault [key/value store version][14].
required     | true
type         | String
allowed values | `v1` and `v2`
example      | {{< language-toggle >}}
{{< code yml >}}
version: v1
{{< /code >}}
{{< code json >}}
{
  "version": "v1"
}
{{< /code >}}
{{< /language-toggle >}}

##### Rate limiter attributes

burst        | 
-------------|------ 
description  | Maximum amount of burst allowed in a rate interval for the [enterprise/secrets/v1][2] API endpoint.
required     | false
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
burst: 100
{{< /code >}}
{{< code json >}}
{
  "burst": 100
}
{{< /code >}}
{{< /language-toggle >}}

limit        | 
-------------|------ 
description  | Maximum number of secrets requests per second that can be transmitted to the backend with the [enterprise/secrets/v1][2] API endpoint.
required     | false
type         | Float
example      | {{< language-toggle >}}
{{< code yml >}}
limit: 10.0
{{< /code >}}
{{< code json >}}
{
  "limit": 10.0
}
{{< /code >}}
{{< /language-toggle >}}


[1]: ../../../commercial/
[2]: ../../../api/enterprise/secrets/
[3]: ../../../sensuctl/
[4]: ../../../observability-pipeline/observe-schedule/backend/#environment-variables
[5]: https://www.vaultproject.io/docs/what-is-vault/
[6]: ../../control-access/rbac#default-users
[7]: ../../../sensuctl/create-manage-resources/#create-resources
[8]: #vaultprovider-spec-attributes
[9]: ../secrets/
[10]: https://www.vaultproject.io/docs/auth/token/
[11]: https://www.vaultproject.io/api/other/auth/cert/index.html
[12]: #vaultprovider-client-attributes
[13]: ../../deploy-sensu/secure-sensu/#optional-configure-sensu-agent-mtls-authentication
[14]: https://www.vaultproject.io/docs/secrets/kv
[15]: https://www.vaultproject.io/api/other/auth/cert/index.html#parameters-7
[16]: ../secrets-management/
[17]: #rate-limiter-attributes
[18]: https://www.conjur.org/
[19]: #cyberarkprovider-spec-attributes
[20]: #cyberarkprovider-client-attributes
