---
title: "Secrets"
linkTitle: "Secrets"
description: "Sensu's secrets management feature allows you to avoid exposing secrets like usernames, passwords, and access keys in your Sensu configuration. Read the reference to obtain secrets from one or more external secrets providers and use sensuctl to manage secrets."
weight: 145
version: "5.17"
product: "Sensu Go"
menu: 
  sensu-go-5.17:
    parent: reference
---

- [Secret specification](#secret-specification)
  - [Top-level attributes](#top-level-attributes) | [Metadata attributes](#metadata-attributes) | [Spec attributes](#spec-attributes)
- [Secret configuration](#secret-configuration)
- [Secret examples](#secret-examples)

**COMMERCIAL FEATURE**: Access the Secret datatype in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][1].

Sensu's secrets management eliminates the need to expose secrets in your Sensu configuration.
When a Sensu resource definition requires a secret (e.g. a username or password), Sensu allows you to obtain secrets from one or more external secrets providers, so you can both refer to external secrets and consume secrets via [backend environment variables][5].

_**NOTE**: Secrets management is implemented for [checks][13], [handlers][14], and [mutators][15]._

Only Sensu backends have access to request secrets from a [secrets provider][7].
Sensu backends cache fetched secrets in memory, with no persistence to a Sensu datastore or file on disk.
Secrets provided via a "lease" with a "lease duration" are deleted from Sensu's in-memory cache after the configured number of seconds, prompting the Sensu backend to request the secret again.

Secrets are only transmitted over a TLS websocket connection.
Unencrypted connections must not transmit privileged information.
For agent-side resources, enable TLS/mTLS.

Sensu only exposes secrets to Sensu services like environment variables and automatically redacts secrets from all logs, the API, and the web UI.
 
## Secret specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the resource type. For secrets configuration, the type should always be `Secret`.
required     | Required for secrets configuration in `wrapped-json` or `yaml` format.
type         | String
example      | {{< highlight shell >}}"type": "Secret"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For secrets configuration in this version of Sensu, the api_version should always be `secrets/v1`.
required     | Required for secrets configuration in `wrapped-json` or `yaml` format.
type         | String
example      | {{< highlight shell >}}"api_version": "secrets/v1"{{< /highlight >}}

metadata     |      |
-------------|------
description  | Top-level scope that contains the secret's `name` and `namespace`.
required     | true
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"metadata": {
  "name": "sensu-ansible-token",
  "namespace": "default"
}
{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes secrets configuration [spec attributes][8].
required     | Required for secrets configuration in `wrapped-json` or `yaml` format.
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"spec": {
  "id": "ANSIBLE_TOKEN",
  "provider": "env"
}
{{< /highlight >}}

### Metadata attributes

name         |      |
-------------|------
description  | Name for the secret that is used internally by Sensu.
required     | true
type         | String
example      | {{< highlight shell >}}"name": "sensu-ansible-token"{{< /highlight >}}

namespace    |      |
-------------|------
description  | [Sensu RBAC namespace][9] that the secret belongs to.
required     | true
type         | String
example      | {{< highlight shell >}}"namespace": "default"{{< /highlight >}}

### Spec attributes

id           | 
-------------|------ 
description  | Identifying key for the provider to retrieve the secret. For the `Env` secrets provider, the `id` is the environment variable. For the `Vault` secrets provider, the `id` is the secret path and key name in the form of `secret/path#key`.
required     | true
type         | String
example      | {{< highlight shell >}}"id": "secret/ansible#token"{{< /highlight >}}

provider     | 
-------------|------ 
description  | Name of the provider with the secret.
required     | true
type         | String
example      | {{< highlight shell >}}"provider": "vault"{{< /highlight >}}

## Secret configuration

You can use the [Secrets API][2] and [sensuctl][3] to create, view, and manage your secrets configuration.
To manage secrets configuration with sensuctl, configure sensuctl as the default [`admin` user][6].

The [standard sensuctl subcommands][4] are available for secrets (list, info, and delete).

To list all secrets:

{{< highlight shell >}}
sensuctl secret list
{{< /highlight >}}

To see a secret's status:

{{< highlight shell >}}
sensuctl secret info SECRET_NAME
{{< /highlight >}}

To delete a secret:

{{< highlight shell >}}
sensuctl secret delete SECRET_NAME
{{< /highlight >}}

`SECRET_NAME` is the value specified in the secret's `name` [metadata attribute][12].

## Secret examples

A secret resource definition refers to a secrets `id` and a secrets `provider`.
Read the [secrets provider reference][7] for the provider specification.

{{< language-toggle >}}

{{< highlight yml >}}
---
type: Secret
api_version: secrets/v1
metadata:
  name: sensu-ansible-token
  namespace: default
spec:
  id: ANSIBLE_TOKEN
  provider: env
{{< /highlight >}}

{{< highlight json >}}
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
{{< /highlight >}}

{{< /language-toggle >}}

Configure secrets that target a HashiCorp Vault as shown in the following example:

{{< language-toggle >}}

{{< highlight yml >}}
---
type: Secret
api_version: secrets/v1
metadata:
  name: sensu-ansible
  namespace: default
spec:
  id: 'secret/database#password'
  provider: vault
{{< /highlight >}}

{{< highlight json >}}
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
{{< /highlight >}}

{{< /language-toggle >}}

The `id` value for secrets that target a HashiCorp Vault must start with the name of the secret's path in Vault.
The [Vault dev server][10] is preconfigured with the `secret` keyspace already set up.
This is convenient for learning and getting started with Vault secrets management, so this example and our guide to [Secrets management][11] use the `secret/` path for the `id` value.
In this example, the name of the secret is `database`.
The `database` secret contains a key called `password`, and its value is the password to our database.

[1]: ../../commercial/
[2]: ../../api/secrets/
[3]: ../../sensuctl/reference/
[4]: ../../sensuctl/reference/#subcommands
[5]: ../backend/#configuration-via-environment-variables
[6]: ../rbac#default-users
[7]: ../secrets-providers/
[8]: #spec-attributes
[9]: ../../reference/rbac/#namespaces
[10]: https://learn.hashicorp.com/vault/getting-started/dev-server
[11]: ../../guides/secrets-management/
[12]: #metadata-attributes
[13]: ../checks/#check-with-secret
[14]: ../handlers/#handler-with-secret
[15]: ../mutators/#mutator-with-secret
