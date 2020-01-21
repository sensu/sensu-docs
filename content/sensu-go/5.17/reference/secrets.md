---
title: "Secrets"
description: "Sensu's secrets management capability allows you to avoid exposing secrets in your Sensu configuration. Read the reference to obtain secrets from one or more external secrets management providers and use sensuctl to manage secrets."
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
- [Secret payload examples](#secret-payload-examples)

**COMMERCIAL FEATURE**: Access the Secret datatype in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][1].

Sensu's secrets management eliminates the need to expose secrets in your Sensu configuration.
Use secrets to obtain secrets from one or more external secrets management providers, refer to external secrets, and comsume secrets via backend [environment variables][5].

Only Sensu backends have access to request secrets from a [secret provider][7].
Sensu backends cache fetched secrets in memory, with no persistence to a Sensu datastore or file on disk.
Secrets provided via a "lease" with a "lease duration" are deleted from Sensu's in-memory cache after the configured number of seconds, prompting the Sensu backend to request the secret again.

Secrets are only transmitted over a TLS websocket connection.
Unencrypted connections must not transmit privileged information.
For agent-side resources, enable TLS/mTLS.

Secrets are only exposed to Sensu services like environment variables and are automatically redacted from all logs, the API, and the Sensu dashboard.
 
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
description  | Top-level attribute that specifies the Sensu API group and version. For secrets configuration in this version of Sensu, the `api_version` should always be `secrets/v1`.
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
description  | Top-level map that includes secrets configuration [spec attributes][12].
required     | Required for secrets configuration in `wrapped-json` or `yaml` format.
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"spec": {
  "id": "ANSIBLE_TOKEN",
  "provider": "ansible_vault"
}
{{< /highlight >}}

### Metadata attributes

name         |      |
-------------|------
description  | The name for the secret that is used internally by Sensu.
required     | true
type         | String
example      | {{< highlight shell >}}"name": "sensu-ansible-token"{{< /highlight >}}

namespace    |      |
-------------|------
description  | Provider name used internally by Sensu.
required     | true
type         | String
example      | {{< highlight shell >}}"namespace": "default"{{< /highlight >}}

### Spec attributes

id           | 
-------------|------ 
description  | The identifying key for the provider to retrieve the secret.
required     | true
type         | String
default      | `false`
example      | {{< highlight shell >}}"id": "ANSIBLE_TOKEN"{{< /highlight >}}

provider     | 
-------------|------ 
description  | The name of the provider with the secret.
required     | true
type         | String
default      | `false`
example      | {{< highlight shell >}}"provider": "ansible_vault"{{< /highlight >}}

## Secret configuration

Use the [Secrets API][2] and [sensuctl][3] to create, view, and manage your secrets configuration.
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

## Secret payload examples

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

Secrets that target a HashiCorp Vault always have an `id` as shown in the following example:

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
  provider: ansible_vault
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Secret",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "database",
    "namespace": "default"
  },
  "spec": {
    "id": "secret/website#database",
    "provider": "vault"
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

Secrets that target a HashiCorp Vault must start with the word `secret`.
In this example, the name of the secret is `website`.
The `website` secret contains a value called `database`, which is the password to our database.

[1]: ../../getting-started/enterprise/
[2]: ../../api/secrets/
[3]: ../../sensuctl/reference/
[4]: ../../sensuctl/reference/#subcommands
[5]: ..//backend/#configuration-via-environment-variables
[6]: ../rbac#default-users
[7]: ../secret-providers/
