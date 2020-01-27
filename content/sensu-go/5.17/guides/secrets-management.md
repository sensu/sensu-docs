---
title: "Use secrets management in Sensu"
linkTitle: "Use Secrets Management"
description: "Sensu's secrets management allows you to avoid exposing secrets in your Sensu configuration. In this guide, you'll learn how to use Env or HashiCorp Vault as your external secrets management provider and refer to external secrets in your Sensu configuration."
weight: 175
version: "5.17"
product: "Sensu Go"
platformContent: False
menu: 
  sensu-go-5.17:
    parent: guides
---

- [Use Env for secrets management](#use-env-for-secrets-management)
  - [Set up your Env secrets provider](#set-up-your-env-secrets-provider)
  - [Create your secret](#create-your-secret)
- [Use HashiCorp Vault for secrets management](#use-hashicorp-vault-for-secrets-management)
  - [Retrieve your Vault root token](#retrieve-your-vault-root-token)
  - [Create your Vault secrets provider](#create-your-vault-secrets-provider)
  - [Create your secret](#create-your-secret)
- [Add a handler](#add-a-handler)
- [**NEXT STEP NEEDED**](#next-step-needed)
- [Next steps](#next-steps)

**COMMERCIAL FEATURE**: Access the Env and VaultProvider secrets provider datatypes in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][20].

Sensu's secrets management allows you to avoid exposing secrets in your Sensu configuration.
In this guide, you'll learn how to use Sensu's built-in secrets provider, `Env`, and [HashiCorp Vault][1] as your external [secrets provider][2] and authenticate without exposing secrets like usernames, passwords, and access keys.

To follow this guide, you’ll need to [install the Sensu backend][5], have at least one [Sensu agent][11] running, and [install and configure sensuctl][7].

Secrets are configured via [`secrets` resources][8].
A secret resource definition refers to the secrets provider (`Env` or `VaultProvider`) and an ID (the named secret to fetch from the secrets provider).

Your backend will execute a PagerDuty handler that requires your secret.
The Sensu backend will transmit a request over its secure transport (TLS-encrypted websockets) to your Sensu agent to execute your handler.

**Is this true for Vault? Even though we're using the no-TLS development server?**

Your Sensu handler will include secrets that are exposed to Sensu services at runtime as environment variables.
The `secrets` scope of the request payload and the environment variables are automatically redacted from all Sensu service logs and dashboards to prevent secret leakage.

## Use Env for secrets management

The [Sensu Go commercial distribution][1] includes a built-in secrets provider, `Env`, that exposes secrets from [environment variables][4] on your Sensu backend nodes.

### Set up your Env secrets provider

To use the `Env` secrets provider, first retrieve your PagerDuty service routing key.
This is the secret you will set up in the `Env` secrets provider.

Then, use `sensuctl create` to create your secrets provider, `env`.
In the code below, replace `SERVICE_ROUTING_KEY` with your PagerDuty service routing key.

**Is the service routing key the same as the API Integration key mentioned in PagerDuty docs at https://support.pagerduty.com/docs/generating-api-keys#section-events-api-keys ?**

Run:

{{< highlight shell >}}
cat << EOF | sensuctl create
---
type: Env
api_version: secrets/v1
metadata:
  name: env
spec:
  env_vars:
  - PAGERDUTY_KEY=SERVICE_ROUTING_KEY
EOF
{{< /highlight >}}

This writes your secret into the environment variable with the ID `PAGERDUTY_KEY`.

### Create your secret

Next, use sensuctl create to create your secret.
This code creates a secret named `pagerduty_key` that refers to the environment variable ID `PAGERDUTY_KEY`.
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
  id: PAGERDUTY_KEY
  provider: env
EOF
{{< /highlight >}}

Now you can securely pass your PagerDuty service routing key in Sensu checks, handlers, and mutators by referring to the `pagerduty_key` secret.
In this guide, you'll use your `pagerduty_key` secret in a [handler][19].

## Use HashiCorp Vault for secrets management

This section explains how to use [HashiCorp Vault][1] as your external [secrets provider][2] and authenticate via the HashiCorp Vault integration's [token auth method][3] or [TLS certificate auth method][4].

### Retrieve your Vault root token

You will need to set up [HashiCorp Vault][15] to use `VaultProvider` secrets management in production.
The examples in this guide use the [Vault dev server][18], which is useful for learning and experimenting.
Using the Vault dev server gives you access to a preconfigured, running Vault server with in-memory storage that you can use right away.
Follow the [HashiCorp Learn curriculum][16] when you are ready to set up a production-ready server in Vault.

To retrieve your root token:

1. Download and install the Vault edition for your OS https://www.vaultproject.io/downloads/
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

_**NOTE**: Because you aren't using TLS, you will need to add `export VAULT_ADDR=http://127.0.0.1:8200` in your bash profile._

1. Retrieve your PagerDuty service routing key.
This is the secret you will set up in Vault.
2. Open a new terminal and run `vault kv put secret/pagerduty key=[SERVICE_ROUTING_KEY]`.
Replace `[SERVICE_ROUTING_KEY]` with your PagerDuty service routing key.

This writes your secret into Vault.
In this example, the name of the secret is `pagerduty`.
The `pagerduty` secret contains a key, and you specified that the `key` value is your PagerDuty service routing key.

**Is the service routing key the same as the API Integration key mentioned in PagerDuty docs at https://support.pagerduty.com/docs/generating-api-keys#section-events-api-keys ?**

The `id` value for secrets that target a HashiCorp Vault must start with the name of the secret's path in Vault.
The Vault dev server is preconfigured with the `secret` keyspace already set up, so we recommend using the `secret/` path for the `id` value while you are learning and getting started with Vault secrets management.

Run `vault kv get secret/pagerduty` to see the secret you just set up.

**STOPPED HERE FRIDAY**

Use sensuctl create to create your secret:

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

Now you can securely pass your PagerDuty service routing key in Sensu checks, handlers, and mutators by referring to the `pagerduty_key` secret.
In this guide, you'll use your `pagerduty_key` secret in a handler.

## Add a handler

This handler will **ADD**.
It will require your backend to request secrets from your secrets provider.

To create a handler definition using Sensu's built-in `Env` secret provider, run:

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
  command: [NEED COMMAND HERE]
  secrets:
    - name: pagerduty_key
      secret: env
  timeout: 10
  filters:
  - is_incident
  - not_silenced
EOF
{{< /highlight >}}

To create a handler definition using your HashiCorpVault secret, run:

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
  command: [NEED COMMAND HERE]
  secrets:
    - name: secret/pagerduty#key
      secret: vault
  timeout: 10
  filters:
  - is_incident
  - not_silenced
EOF
{{< /highlight >}}

Now your handler is set up!

## [NEXT STEP NEEDED]

**ADD: What is the next step?** We need to trigger an event (like https://docs.sensu.io/sensu-go/latest/guides/email-handler/#create-and-trigger-an-ad-hoc-event) to demonstrate that this setup works.

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
