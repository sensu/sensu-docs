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

- [Create your secrets provider](#create-your-secrets-provider)
- [Create your secrets](#create-your-secrets)
- [Add a check, handler, and mutator](#add-a-check-handler-and-mutator)
- [**NEXT STEP NEEDED**](#next-step-needed)
- [Next steps](#next-steps)

Sensu's secrets management allows you to avoid exposing secrets in your Sensu configuration.
In this guide, you'll learn how to use [HashiCorp Vault][1] as your external [secrets provider][2] and authenticate via the HashiCorp Vault integration's [token auth method][3] or [TLS certificate auth method][4].

To follow this guide, you’ll need to [install the Sensu backend][5], have at least one [Sensu agent][11] running on Linux, and [install and configure sensuctl][7].

_**NOTE**: Secrets can only be passed to checks if you have configured mTLS for the agent and backend._

**ADD: Any other requirements?**

Secrets are configured via [`secrets` resources][8].
A secret resource definition refers to the secrets provider (in this guide, Vault) and an ID (the named secret to fetch from the secrets provider).

Your backend will execute a check, handler, and mutator that require your Vault secret.
The Sensu backend will transmit a request over its secure transport (TLS-encrypted websockets) to your Sensu agent to execute your check.
Your backend will also use fetched secrets to execute your handler and mutator.

**ADD: What will the check, handler, and mutator do?**

## Create your secrets provider

**I'm not sure whether the secrets provider or the secrets should come first.**

To create your secrets provider `vault`, send a PUT request to the [`/providers/:provider` API endpoint][13].

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
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
}' \
http://127.0.0.1:8080/api/enterprise/secrets/v1/providers/vault

HTTP/1.1 200 OK
{{< /highlight >}}

## Create your secrets

To create your secrets provider `vault`, send a PUT request to the [`/secrets/:secret` API endpoint][14].

Secrets that target a HashiCorp Vault must start with the word `secret`.
In this example, the name of the secret is `ansible`.
The `ansible` secret contains a value called `token`, which is the password to our database.

{{< highlight shell >}}
curl -X PUT \
-H "Authorization: Bearer $SENSU_ACCESS_TOKEN" \
-H 'Content-Type: application/json' \
-d '{
  "type": "Secret",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "VAULT_TOKEN",
    "namespace": "default"
  },
  "spec": {
    "id": "secret/ansible#token",
    "provider": "vault"
  }
}' \
http://127.0.0.1:8080/api/enterprise/secrets/v1/namespaces/default/secrets/VAULT_TOKEN

HTTP/1.1 200 OK
{{< /highlight >}}

## Add a check, handler, and mutator

Here's an overview of how the check, handler, and mutator will work:

- The check will **ADD**.
- The handler will **ADD**.
- The mutator will **ADD**.
- All three will require your backend to request secrets from your HashiCorp Vault secrets provider.

**Unsure what might be a realistic and useful example to use here. How should the check, handler, and mutator work together?**

Secrets are exposed to Sensu services at runtime as environment variables.
The `secrets` scope of the request payload and the environment variables are automatically redacted from all Sensu service logs and dashboards to prevent secret leakage.

**Is the above true for Vault secrets?**

The Sensu backend will cache fetched secrets in memory, with no persistence to a Sensu datastore or file on disk.
Sensu deletes secrets provided via a lease with a [lease duration][12] from Sensu's in-memory cache after the configured number of seconds, prompting the Sensu backend to request the secret again.

**I borrowed the examples from the check, handler, and mutator references as placeholders below.**

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
    secret: sensu-vault-token
EOF
{{< /highlight >}}

Second, create the handler definition. Run:

{{< highlight shell >}}
cat << EOF | sensuctl create
---
type: Handler 
api_version: core/v2 
metadata:
  name: ansible-tower
  namespace: ops
spec: 
  type: pipe
  command: sensu-ansible-handler -h $VAULT_HOST -t $VAULT_TOKEN
  secrets:
  - name: VAULT_HOST
    secret: sensu-vault-host
  - name: VAULT_TOKEN
    secret: sensu-vault-token
EOF
{{< /highlight >}}

Third, create the mutator definition:

{{< highlight shell >}}
cat << EOF | sensuctl create
---
type: Mutator 
api_version: core/v2 
metadata:
  name: ansible-tower
  namespace: ops
spec: 
  command: sensu-ansible-mutator -h $VAULT_HOST -t $VAULT_TOKEN
  secrets:
  - name: VAULT_HOST
    secret: sensu-vault-host
  - name: VAULT_TOKEN
    secret: sensu-vault-token
EOF
{{< /highlight >}}

Now your check, handler, and mutator are set up!

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
