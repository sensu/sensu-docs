---
title: "Secrets management with HashiCorp Vault"
linkTitle: "Secrets Management with Vault"
description: "Sensu's secrets management allows you to avoid exposing secrets in your Sensu configuration. In this guide, you'll learn how to use HashiCorp Vault as your external secrets management provider and refer to external secrets in your Sensu configuration."
weight: 175
version: "5.17"
product: "Sensu Go"
platformContent: False
menu: 
  sensu-go-5.17:
    parent: guides
---

- [Retrieve your HashiCorp Vault root token](#retrieve-your-hashicorp-vault-root-token)
- [Create your secrets provider](#create-your-secrets-provider)
- [Create your secrets](#create-your-secrets)
- [Add a check and handler](#add-a-check-and-handler)
- [**NEXT STEP NEEDED**](#next-step-needed)
- [Next steps](#next-steps)

Sensu's secrets management allows you to avoid exposing secrets in your Sensu configuration.
In this guide, you'll learn how to use [HashiCorp Vault][1] as your external [secrets provider][2] and authenticate via the HashiCorp Vault integration's [token auth method][3] or [TLS certificate auth method][4].

To follow this guide, you’ll need to [install the Sensu backend][5], have at least one [Sensu agent][11] running, and [install and configure sensuctl][7].

Secrets are configured via [`secrets` resources][8].
A secret resource definition refers to the secrets provider (in this guide, Vault) and an ID (the named secret to fetch from the secrets provider).

Your backend will execute a check and handler that require your Vault secret.
The Sensu backend will transmit a request over its secure transport (TLS-encrypted websockets) to your Sensu agent to execute your check.
Your backend will also use fetched secrets to execute your handler.

**The above is not true for this guide b/c it uses the development server, right?**

Your Sensu check and handler will include secrets that are provided via environment variables.
The environment variables will be named the same as the secret entries in your check and handler.

## Retrieve your HashiCorp Vault root token

You will need to set up [HashiCorp Vault][15] to use `VaultProvider` secrets management in production.
The examples in this guide use the Vault development server so that you have a running Vault server with in-memory storage that can be used right away.
Follow the [HashiCorp Learn curriculum][16] when you are ready to set up a production-ready server in Vault.

To retrieve your root token:

1. Download and install the Vault edition for your OS https://www.vaultproject.io/downloads/
2. Run `vault server -dev`.
3. Find the `Root Token` value for your development server in the command output and copy it.

Leave the Vault development server running.

## Create your secrets provider

_**NOTE**: In Vault's developer server, TLS is not enabled, so you won't be able to use certificate-based authentication. The developer server also requires Vault's HTTP API version `v2`. When you use Vault in production, you will need to configure the [TLS attribute][17] and change the `version` to `v1`._

Use sensuctl create to create your secrets provider, `vault`.
In the code below, replace `ROOT_TOKEN` with the `Root Token` value for your Vault development server.
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

## Create your secrets

_**NOTE**: Because you aren't using TLS, you will need to add `export VAULT_ADDR=http://127.0.0.1:8200` in your bash profile._

Open a new terminal and run `vault kv put secret/email password=b1gs3cr3t`.

**I think we need to use something besides a placeholder password here, or at least explain what the password value should be. Otherwise, our check and handler won't work, right?**

This writes your secret into Vault.
For secrets that target a HashiCorp Vault, the `id` must start with the word `secret/`.

**Need to confirm the above is true. Nikki and Simon mentioned in the secrets reference that it may not be accurate.**

In this example, the name of the secret is `email`.
The `email` secret contains a key named `password`.
You specified that the `password` value is `b1gs3cr3t`.

Run `vault kv get secret/email` to see the password you just set up.

**START HERE MONDAY**

Use sensuctl create to create your password secret:

{{< highlight shell >}}
cat << EOF | sensuctl create
---
type: Secret
api_version: secrets/v1
metadata:
  name: email_password
  namespace: default
spec:
  id: secret/email#password
  provider: vault
EOF
{{< /highlight >}}

## Add a check and handler

Here's an overview of how the check and handler will work:

- The check will **ADD**.
- The handler will **ADD**.
- Both will require your backend to request secrets from your HashiCorp Vault secrets provider.

**Unsure what might be a realistic and useful example to use here. How should the check and handler work together?**

Secrets are exposed to Sensu services at runtime as environment variables.
The `secrets` scope of the request payload and the environment variables are automatically redacted from all Sensu service logs and dashboards to prevent secret leakage.

The Sensu backend will cache fetched secrets in memory, with no persistence to a Sensu datastore or file on disk.
Sensu deletes secrets provided via a lease with a [lease duration][12] from Sensu's in-memory cache after the configured number of seconds, prompting the Sensu backend to request the secret again.

**I borrowed the examples from the check and handler references as placeholders below.**

First, to create the check, run:

{{< highlight shell >}}
cat << EOF | sensuctl create
---
type: CheckConfig
api_version: core/v2
metadata:
  name: ansible-tower
  namespace: ops
spec:
  check_hooks: null
  command: sensu-ansible.sh $VAULT_TOKEN
  secrets:
  - name: VAULT_TOKEN
    secret: ansible_token
EOF
{{< /highlight >}}

Second, create the handler definition. Run:

{{< highlight shell >}}
cat << EOF | sensuctl create
---
api_version: core/v2
type: Handler
metadata:
  namespace: default
  name: email
spec:
  type: pipe
  command: sensu-email-handler -f YOUR-SENDER@example.com -t YOUR-RECIPIENT@example.com -s YOUR-SMTP-SERVER.example.com
    -u USERNAME -p PASSWORD
  timeout: 10
  filters:
  - is_incident
  - not_silenced
  - state_change_only
EOF
{{< /highlight >}}

Now your check and handler are set up!

## [NEXT STEP NEEDED]

**ADD: What is the next step?** I think we should also trigger an event (like https://docs.sensu.io/sensu-go/latest/guides/email-handler/#create-and-trigger-an-ad-hoc-event) to demonstrate that this setup works.

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
