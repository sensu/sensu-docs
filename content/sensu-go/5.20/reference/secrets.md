---
title: "Secrets"
linkTitle: "Secrets"
reference_title: "Secrets"
type: "reference"
description: "Sensu's secrets management feature allows you to avoid exposing secrets like usernames, passwords, and access keys in your Sensu configuration. Read the reference to obtain secrets from one or more external secrets providers and use sensuctl to manage secrets."
weight: 145
version: "5.20"
product: "Sensu Go"
menu: 
  sensu-go-5.20:
    parent: reference
---

**COMMERCIAL FEATURE**: Access the Secret datatype in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][1].

Sensu's secrets management eliminates the need to expose secrets in your Sensu configuration.
When a Sensu resource definition requires a secret (e.g. a username or password), Sensu allows you to obtain secrets from one or more external secrets providers, so you can both refer to external secrets and consume secrets via [backend environment variables][5].

{{% notice note %}}
**NOTE**: Secrets management is implemented for [checks](../checks/#check-with-secret), [handlers](../handlers/#handler-with-secret), and [mutators](../mutators/#mutator-with-secret).
{{% /notice %}}

Only Sensu backends have access to request secrets from a [secrets provider][7].
Sensu backends cache fetched secrets in memory, with no persistence to a Sensu datastore or file on disk.
Secrets provided via a "lease" with a "lease duration" are deleted from Sensu's in-memory cache after the configured number of seconds, prompting the Sensu backend to request the secret again.

Secrets are only transmitted over a transport layer security (TLS) websocket connection.
Unencrypted connections must not transmit privileged information.
For checks, hooks, and assets, you must [enable mutual TLS (mTLS)][13].
Sensu will not transmit secrets to agents that do not use mTLS.

Sensu only exposes secrets to Sensu services like environment variables and automatically redacts secrets from all logs, the API, and the web UI.
 
## Secret specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the resource type. For secrets configuration, the type should always be `Secret`.
required     | Required for secrets configuration in `wrapped-json` or `yaml` format.
type         | String
example      | {{< code shell >}}"type": "Secret"{{< /code >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For secrets configuration in this version of Sensu, the api_version should always be `secrets/v1`.
required     | Required for secrets configuration in `wrapped-json` or `yaml` format.
type         | String
example      | {{< code shell >}}"api_version": "secrets/v1"{{< /code >}}

metadata     |      |
-------------|------
description  | Top-level scope that contains the secret's `name` and `namespace` as well as the `created_by` field.
required     | true
type         | Map of key-value pairs
example      | {{< code shell >}}
"metadata": {
  "name": "sensu-ansible-token",
  "namespace": "default",
  "created_by": "admin"
}
{{< /code >}}

spec         | 
-------------|------
description  | Top-level map that includes secrets configuration [spec attributes][8].
required     | Required for secrets configuration in `wrapped-json` or `yaml` format.
type         | Map of key-value pairs
example      | {{< code shell >}}
"spec": {
  "id": "ANSIBLE_TOKEN",
  "provider": "env"
}
{{< /code >}}

### Metadata attributes

name         |      |
-------------|------
description  | Name for the secret that is used internally by Sensu.
required     | true
type         | String
example      | {{< code shell >}}"name": "sensu-ansible-token"{{< /code >}}

namespace    |      |
-------------|------
description  | [Sensu RBAC namespace][9] that the secret belongs to.
required     | true
type         | String
example      | {{< code shell >}}"namespace": "default"{{< /code >}}

| created_by |      |
-------------|------
description  | Username of the Sensu user who created the secret or last updated the secret. Sensu automatically populates the `created_by` field when the secret is created or updated.
required     | false
type         | String
example      | {{< code shell >}}"created_by": "admin"{{< /code >}}

### Spec attributes

id           | 
-------------|------ 
description  | Identifying key for the provider to retrieve the secret. For the `Env` secrets provider, the `id` is the environment variable. For the `Vault` secrets provider, the `id` is the secret path and key name in the form of `secret/path#key`.
required     | true
type         | String
example      | {{< code shell >}}"id": "secret/ansible#token"{{< /code >}}

provider     | 
-------------|------ 
description  | Name of the provider with the secret.
required     | true
type         | String
example      | {{< code shell >}}"provider": "vault"{{< /code >}}

## Secret configuration

You can use the [Secrets API][2] and [sensuctl][3] to create, view, and manage your secrets configuration.
To manage secrets configuration with sensuctl, configure sensuctl as the default [`admin` user][6].

The [standard sensuctl subcommands][4] are available for secrets (list, info, and delete).

To list all secrets:

{{< code shell >}}
sensuctl secret list
{{< /code >}}

To see a secret's status:

{{< code shell >}}
sensuctl secret info SECRET_NAME
{{< /code >}}

To delete a secret:

{{< code shell >}}
sensuctl secret delete SECRET_NAME
{{< /code >}}

`SECRET_NAME` is the value specified in the secret's `name` [metadata attribute][12].

## Secret examples

A secret resource definition refers to a secrets `id` and a secrets `provider`.
Read the [secrets provider reference][7] for the provider specification.

{{< language-toggle >}}

{{< code yml >}}
---
type: Secret
api_version: secrets/v1
metadata:
  name: sensu-ansible-token
  namespace: default
spec:
  id: ANSIBLE_TOKEN
  provider: env
{{< /code >}}

{{< code json >}}
{
  "type": "Secret",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "sensu-ansible-token",
    "namespace": "default"
  },
  "spec": {
    "id": "ANSIBLE_TOKEN",
    "provider": "env"
  }
}
{{< /code >}}

{{< /language-toggle >}}

Configure secrets that target a HashiCorp Vault as shown in the following example:

{{< language-toggle >}}

{{< code yml >}}
---
type: Secret
api_version: secrets/v1
metadata:
  name: sensu-ansible
  namespace: default
spec:
  id: 'secret/database#password'
  provider: vault
{{< /code >}}

{{< code json >}}
{
  "type": "Secret",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "sensu-ansible",
    "namespace": "default"
  },
  "spec": {
    "id": "secret/database#password",
    "provider": "vault"
  }
}
{{< /code >}}

{{< /language-toggle >}}

The `id` value for secrets that target a HashiCorp Vault must start with the name of the secret's path in Vault.
Sensu requires the `secret/` path for the `id` value, and the [Vault dev server][10] is preconfigured with the `secret` keyspace already set up.
In this example, the name of the secret is `database`.
The `database` secret contains a key called `password`, and its value is the password to our database.


[1]: ../../commercial/
[2]: ../../api/secrets/
[3]: ../../sensuctl/
[4]: ../../sensuctl/create-manage-resources/#subcommands
[5]: ../backend/#configuration-via-environment-variables
[6]: ../rbac#default-users
[7]: ../secrets-providers/
[8]: #spec-attributes
[9]: ../rbac/#namespaces
[10]: https://learn.hashicorp.com/vault/getting-started/dev-server
[11]: ../../operations/manage-secrets/secrets-management/
[12]: #metadata-attributes
[13]: ../../operations/deploy-sensu/secure-sensu/#sensu-agent-mtls-authentication
