---
title: "Use secrets management in Sensu"
linkTitle: "Use Secrets Management"
description: "Sensu's secrets management allows you to avoid exposing secrets like usernames and passwords in your Sensu configuration. In this guide, you'll learn how to use Sensu's built-in secrets provider or HashiCorp Vault and refer to external secrets in your Sensu configuration."
weight: 175
version: "5.17"
product: "Sensu Go"
platformContent: False
menu: 
  sensu-go-5.17:
    parent: guides
---

- [Use Env for secrets management](#use-env-for-secrets-management)
  - [Create your backend environment variable](#create-your-backend-environment-variable)
  - [Create your secret](#create-your-secret)
- [Use HashiCorp Vault for secrets management](#use-hashicorp-vault-for-secrets-management)
  - [Retrieve your Vault root token](#retrieve-your-vault-root-token)
  - [Create your Vault secrets provider](#create-your-vault-secrets-provider)
  - [Create your secret](#create-your-secret)
- [Add a handler](#add-a-handler)
  - [Register the PagerDuty handler asset](#register-the-pagerduty-handler-asset)
  - [Add your secret to the handler spec](#add-your-secret-to-the-handler-spec)
- [Next steps](#next-steps)

**COMMERCIAL FEATURE**: Access the Env and VaultProvider secrets provider datatypes in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][20].

Sensu's secrets management allows you to avoid exposing secrets like usernames, passwords, and access keys in your Sensu configuration.
In this guide, you'll learn how to use Sensu's built-in secrets provider, `Env`, or [HashiCorp Vault][1] as your external [secrets provider][2] and authenticate without exposing your secrets

To follow this guide, you’ll need to [install the Sensu backend][5], have at least one [Sensu agent][11] running, and [install and configure sensuctl][7].

Secrets are configured via [secrets resources][8].
A secret resource definition refers to the secrets provider (`Env` or `VaultProvider`) and an ID (the named secret to fetch from the secrets provider).

This guide explains how to set up your [PagerDuty Events API Integration Key][27] as a secret and a PagerDuty handler that requires the secret.
Your Sensu backend can then execute the handler with any check.

You can use secrets management in handler, mutator, and check execution.
This guide only covers the handler use case.
For secrets management in checks, the Sensu backend will transmit requests over its secure transport (TLS-encrypted websockets) to your Sensu agent to execute your check, so mTLS must be enabled.


The secret included in your Sensu handler will be exposed to Sensu services at runtime as an environment variable.
Sensu only exposes secrets to Sensu services like environment variables and automatically redacts secrets from all logs, the API, and the dashboard.

## Use Env for secrets management

The [Sensu Go commercial distribution][1] includes a built-in secrets provider, `Env`, that exposes secrets from [environment variables][4] on your Sensu backend nodes.
The `Env` secrets provider is automatically created with an empty `spec` when you start your Sensu backend.

### Create your backend environment variable

To use the built-in `Env` secrets provider, you will add your secret as a [backend environment variable][21].

First, make sure you have created the files where you will store [backend environment variables][21]. 

Then, retrieve your [PagerDuty Events API Integration Key][27].
This is the secret you will set up as an environment variable.

Run the following code, after you replace `INTEGRATION_KEY` with your PagerDuty Events API Integration Key:

{{< language-toggle >}}

{{< highlight "Ubuntu/Debian" >}}
$ echo 'SENSU_PAGERDUTY_KEY=INTEGRATION_KEY' | sudo tee /etc/default/sensu-backend
$ sudo systemctl restart sensu-backend
{{< /highlight >}}

{{< highlight "RHEL/CentOS" >}}
$ echo 'SENSU_PAGERDUTY_KEY=INTEGRATION_KEY' | sudo tee /etc/sysconfig/sensu-backend
$ sudo systemctl restart sensu-backend
{{< /highlight >}}

{{< /language-toggle >}}

This configures the `SENSU_PAGERDUTY_KEY` environment variable to your PagerDuty Events API Integration Key in the context of the sensu-backend process.

### Create your secret

Next, use sensuctl create to create your secret.
This code creates a secret named `pagerduty_key` that refers to the environment variable ID `SENSU_PAGERDUTY_KEY`.
Run:

{{< highlight shell >}}
cat << EOF | sensuctl create
---
type: Secret
api_version: secrets/v1
metadata:
  name: pagerduty_key
  namespace: default
spec:
  id: SENSU_PAGERDUTY_KEY
  provider: env
EOF
{{< /highlight >}}

Now you can securely pass your PagerDuty Events API Integration Key in Sensu checks, handlers, and mutators by referring to the `pagerduty_key` secret.
In this guide, you'll use your `pagerduty_key` secret in a [handler][19].

## Use HashiCorp Vault for secrets management

This section explains how to use [HashiCorp Vault][1] as your external [secrets provider][2] to authenticate via the HashiCorp Vault integration's [token auth method][3] or [TLS certificate auth method][4].

### Retrieve your Vault root token

You will need to set up [HashiCorp Vault][15] to use `VaultProvider` secrets management in production.
The examples in this guide use the [Vault dev server][18], which is useful for learning and experimenting.
The Vault dev server gives you access to a preconfigured, running Vault server with in-memory storage that you can use right away.
Follow the [HashiCorp Learn curriculum][16] when you are ready to set up a production server in Vault.

To retrieve your root token:

1. [Download and install][25] the Vault edition for your operating system.
2. Run `vault server -dev`.
3. Find the `Root Token` value for your Vault dev server in the command output and copy it.

Leave the Vault dev server running.

### Create your Vault secrets provider

_**NOTE**: In Vault's dev server, TLS is not enabled, so you won't be able to use certificate-based authentication. The dev server also requires Vault's HTTP API version `v2`. When you use Vault in production, you will need to configure the [TLS attribute][17] and change the `version` to `v1`._

Use `sensuctl create` to create your secrets provider, `vault`.
In the code below, replace `ROOT_TOKEN` with the `Root Token` value for your Vault dev server.
Then, run:

{{< highlight shell >}}
cat << EOF | sensuctl create
---
type: VaultProvider
api_version: secrets/v1
metadata:
  name: vault
spec:
  client:
    address: http://localhost:8200
    token: ROOT_TOKEN
    version: v2
    tls: null
    max_retries: 2
    timeout: 20s
    rate_limiter:
      limit: 10
      burst: 100
EOF
{{< /highlight >}}

### Create your secret

_**NOTE**: Because you aren't using TLS, you will need to set `VAULT_ADDR=http://127.0.0.1:8200` in your shell environment._

First, retrieve your [PagerDuty Events API Integration Key][27].
This is the secret you will set up in Vault.

Next, open a new terminal and run `vault kv put secret/pagerduty key=INTEGRATION_KEY`.
Replace `INTEGRATION_KEY` with your PagerDuty Events API Integration Key.

This writes your secret into Vault.
In this example, the name of the secret is `pagerduty`.
The `pagerduty` secret contains a key, and you specified that the `key` value is your PagerDuty Events API Integration Key.
The `id` value for your secret will be `secret/pagerduty#key`.

The `id` value for secrets that target a HashiCorp Vault must start with the name of the secret's path in Vault.
The Vault dev server is preconfigured with the `secret` keyspace already set up, so we recommend using the `secret/` path for the `id` value while you are learning and getting started with Vault secrets management.

Run `vault kv get secret/pagerduty` to see the secret you just set up.

Use `sensuctl create` to create your `vault` secret:

{{< highlight shell >}}
cat << EOF | sensuctl create
---
type: Secret
api_version: secrets/v1
metadata:
  name: pagerduty_key
  namespace: default
spec:
  id: secret/pagerduty#key
  provider: vault
EOF
{{< /highlight >}}

Now you can securely pass your PagerDuty Events API Integration Key in Sensu checks, handlers, and mutators by referring to the `pagerduty_key` secret.
In this guide, you'll use your `pagerduty_key` secret in a handler.

## Add a handler

### Register the PagerDuty Handler asset

To begin, register the [Sensu PagerDuty Handler asset][23] with [`sensuctl asset add`][22]:

{{< highlight shell >}}
sensuctl asset add sensu/sensu-pagerduty-handler:1.2.0 -r pagerduty-handler
{{< /highlight >}}

This example uses the `-r` (rename) flag to specify a shorter name for the asset: `pagerduty-handler`.

_**NOTE**: You can [adjust the asset definition][26] according to your Sensu configuration if needed._

Run `sensuctl asset list --format yaml` to confirm that the asset is ready to use.

With this handler, Sensu can trigger and resolve PagerDuty incidents.
However, you still need to add your secret to the handler spec so that it requires your backend to request secrets from your secrets provider.

### Add your secret to the handler spec

Now that you have set up your secret, you can create a handler definition. Run:

{{< highlight shell >}}
cat << EOF | sensuctl create
---
api_version: core/v2
type: Handler
metadata:
  namespace: default
  name: pagerduty
spec:
  type: pipe
  command: pagerduty-handler --dedup-key $DEDUP_KEY
  secrets:
  - name: DEDUP_KEY
    secret: pagerduty_key
  runtime_assets:
  - pagerduty-handler
  timeout: 10
  filters:
  - is_incident
EOF
{{< /highlight >}}

Now that your handler is set up and Sensu can create incidents in PagerDuty, you can automate this workflow by adding your `pagerduty` handler to your Sensu service check definitions.
See [Monitor server resources][24] to learn more.

## Next steps

Read the [secrets][9] or [secrets providers][10] reference for in-depth secrets management documentation.


[1]: https://www.vaultproject.io/docs/what-is-vault/
[2]: ../../reference/secrets-providers/
[3]: https://www.vaultproject.io/docs/auth/token/
[4]: https://www.vaultproject.io/api/auth/cert/index.html
[5]: ../../installation/install-sensu/#install-the-sensu-backend
[6]: ../../installation/install-sensu/#install-sensu-agents
[7]: ../../installation/install-sensu/#install-sensuctl
[8]: ../../api/secrets/
[9]: ../../reference/secrets/
[10]: ../../reference/secrets-providers/
[11]: ../../installation/install-sensu/#install-sensu-agents
[12]: https://www.vaultproject.io/docs/concepts/lease.html#lease-durations-and-renewal
[13]: ../../api/secrets#providers-provider-put
[14]: ../../api/secrets#secrets-secret-put
[15]: https://www.vaultproject.io/docs/install/
[16]: https://learn.hashicorp.com/vault
[17]: ../../reference/secrets-providers#tls-vault
[18]: https://learn.hashicorp.com/vault/getting-started/dev-server
[19]: #add-a-handler
[20]: ../../getting-started/enterprise/
[21]: ../../reference/backend/#configuration-via-environment-variables
[22]: ../../sensuctl/reference/#install-asset-definitions
[23]: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler
[24]: ../monitor-server-resources/
[25]: https://www.vaultproject.io/downloads/
[26]: ../install-check-executables-with-assets/#2-adjust-the-asset-definition
[27]: https://support.pagerduty.com/docs/generating-api-keys#section-events-api-keys
