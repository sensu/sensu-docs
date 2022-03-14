---
title: "Use secrets management in Sensu"
linkTitle: "Use Secrets Management"
guide_title: "Use secrets management in Sensu"
type: "guide"
description: "Follow this guide to use Sensu's built-in secrets provider or HashiCorp Vault to avoid exposing sensitive information in your Sensu configuration."
weight: 10
version: "6.7"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-6.7:
    parent: manage-secrets
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the Env and VaultProvider secrets provider datatypes in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

Sensu's secrets management allows you to avoid exposing secrets like usernames, passwords, and access keys in your Sensu configuration.
In this guide, you'll learn how to use Sensu's built-in secrets provider, `Env`, or [HashiCorp Vault][1] as your external [secrets provider][2] and authenticate without exposing your secrets.
You'll set up your PagerDuty Integration Key as a secret, create a PagerDuty handler definition that requires the secret, and configure a pipeline that includes the PagerDuty handler.
Your Sensu backend can then execute the pipeline with any check.

To follow this guide, you’ll need to [install the Sensu backend][5], have at least one [Sensu agent][11] running, and [install and configure sensuctl][7].

Secrets are configured via [secrets resources][8].
A secret resource definition refers to the secrets provider (`Env` or `VaultProvider`) and an ID (the named secret to fetch from the secrets provider).

This guide only covers the handler use case, but you can use secrets management in handler, mutator, and check execution.
When a check configuration references a secret, the Sensu backend will only transmit the check's execution requests to agents that are connected via [mutually authenticated transport layer security (mTLS)-encrypted WebSockets][15].

The secret included in your Sensu handler will be exposed to Sensu services at runtime as an environment variable.
Sensu only exposes secrets to Sensu services like environment variables and automatically redacts secrets from all logs, the API, and the web UI.

## Retrieve your PagerDuty Integration Key

The example in this guide uses the [PagerDuty][31] Integration Key as a secret and a PagerDuty handler definition that requires the secret.

Here's how to find your Integration Key in PagerDuty so you can set it up as your secret:

1. Log in to your PagerDuty account.
2. In the **Services** drop-down menu, select **Service Directory**.
3. Enter the name of your Sensu service in the search field.
4. Click to select your Sensu service from the list of search results.
5. Click the **Integrations** tab.
6. Click the drop-down arrow for the **Events API**.
The Integration Key is listed in the second field.

{{< figure src="/images/sensu-service-pagerduty-integration-key.png" alt="PagerDuty Integration Key location" link="/images/sensu-service-pagerduty-integration-key.png" target="_blank" >}}

Make a note of your Integration Key &mdash; you'll need it to create your [backend environment variable][28] or [HashiCorp Vault secret][29].

## Use Env for secrets management

The [Sensu Go commercial distribution][1] includes a built-in secrets provider, `Env`, that exposes secrets from [environment variables][21] on your Sensu backend nodes.
The `Env` secrets provider is automatically created with an empty `spec` when you start your Sensu backend.

### Create your backend environment variable

To use the built-in `Env` secrets provider, you will add your secret as a backend environment variable.

First, make sure you have created the files you need to store [backend environment variables][21]. 

Then, run the following code, replacing `INTEGRATION_KEY` with your PagerDuty Integration Key:

{{< language-toggle >}}

{{< code shell "Ubuntu/Debian" >}}
echo 'SENSU_PAGERDUTY_KEY=INTEGRATION_KEY' | sudo tee -a /etc/default/sensu-backend
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
echo 'SENSU_PAGERDUTY_KEY=INTEGRATION_KEY' | sudo tee -a /etc/sysconfig/sensu-backend
{{< /code >}}

{{< /language-toggle >}}

Restart the sensu-backend:

{{< code shell >}}
sudo systemctl restart sensu-backend
{{< /code >}}

This configures the `SENSU_PAGERDUTY_KEY` environment variable to your PagerDuty Integration Key in the context of the sensu-backend process.

### Create your Env secret

Now you'll use `sensuctl create` to create your secret.
This code creates a secret named `pagerduty_key` that refers to the environment variable ID `SENSU_PAGERDUTY_KEY`.
Run:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: Secret
api_version: secrets/v1
metadata:
  name: pagerduty_key
spec:
  id: SENSU_PAGERDUTY_KEY
  provider: env
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "Secret",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "pagerduty_key"
  },
  "spec": {
    "id": "SENSU_PAGERDUTY_KEY",
    "provider": "env"
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

You can securely pass your PagerDuty Integration Key in Sensu checks, handlers, and mutators by referring to the `pagerduty_key` secret.
Skip to the [add a handler][19] section, where you'll use your `pagerduty_key` secret in your handler definition.

## Use HashiCorp Vault for secrets management

This section explains how to use [HashiCorp Vault][1] as your external [secrets provider][2] to authenticate via the HashiCorp Vault integration's [token auth method][3] or [TLS certificate auth method][4].

{{% notice note %}}
**NOTE**: You must set up [HashiCorp Vault](https://www.vaultproject.io/docs/install/) to use `VaultProvider` secrets management in production.
The examples in this guide use the [Vault dev server](https://www.vaultproject.io/docs/concepts/dev-server/), which is useful for learning and experimenting.
The Vault dev server gives you access to a preconfigured, running Vault server with in-memory storage that you can use right away.
Follow the [HashiCorp Learn curriculum](https://learn.hashicorp.com/vault) when you are ready to set up a production server in Vault.<br><br>
In addition, this guide uses the [Vault KV secrets engine](https://www.vaultproject.io/api/secret/kv/kv-v2.html).
Using the Vault KV secrets engine with the Vault dev server requires v2 connections.
For this reason, in the `VaultProvider` spec in these examples, the client `version` value is **v2**.
{{% /notice %}}

### Configure your Vault authentication method (token or TLS)

If you use [HashiCorp Vault][1] as your external [secrets provider][2], you can authenticate via the HashiCorp Vault integration's [token][3] or [transport layer security (TLS) certificate][4] authentication method.

#### Vault token authentication

Follow the steps in this section to use HashiCorp Vault as your external [secrets provider][2] to authenticate with the HashiCorp Vault integration's [token auth method][3].

##### Retrieve your Vault root token

{{% notice note %}}
**NOTE**: The examples in this guide use the `Root Token` for the the [Vault dev server](https://learn.hashicorp.com/vault/getting-started/dev-server), which gives you access to a preconfigured, running Vault server with in-memory storage that you can use right away.
Follow the [HashiCorp Learn curriculum](https://learn.hashicorp.com/vault) when you are ready to set up a production server in Vault.
{{% /notice %}}

To retrieve your Vault root token:

1. [Download and install][25] the Vault edition for your operating system.
2. Open a terminal window and run `vault server -dev`.

The command output includes a `Root Token` line.
Find this line in your command output and copy the `Root Token` value.
You will use it next to create your Vault secrets provider.

{{< figure src="/images/vault-dev-root-token.png" alt="HashiCorp Vault Root Token location" link="/images/vault-dev-root-token.png" target="_blank" >}}

Leave the Vault dev server running.
Because you aren't using TLS, you will need to set `VAULT_ADDR=http://127.0.0.1:8200` in your shell environment.

##### Create your Vault secrets provider

{{% notice note %}}
**NOTE**: In Vault's dev server, TLS is not enabled, so you won't be able to use certificate-based authentication.
{{% /notice %}}

Use `sensuctl create` to create your secrets provider, `vault`.
In the code below, replace `<root_token>` with the `Root Token` value for your Vault dev server.
Then, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: VaultProvider
api_version: secrets/v1
metadata:
  name: vault
spec:
  client:
    address: http://localhost:8200
    token: <root_token>
    version: v2
    tls: null
    max_retries: 2
    timeout: 20s
    rate_limiter:
      limit: 10
      burst: 100
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "VaultProvider",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "vault"
  },
  "spec": {
    "client": {
      "address": "http://localhost:8200",
      "token": "<root_token>",
      "version": "v2",
      "tls": null,
      "max_retries": 2,
      "timeout": "20s",
      "rate_limiter": {
        "limit": 10,
        "burst": 100
      }
    }
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

To continue, skip ahead to [create your Vault secret][29].

#### Vault TLS certificate authentication

This section explains how use HashiCorp Vault as your external [secrets provider][2] to authenticate with the HashiCorp Vault integration's [TLS certificate auth method][4].

{{% notice note %}}
**NOTE**: You will need to set up [HashiCorp Vault](https://www.vaultproject.io/docs/install/) in production to use TLS certificate-based authentication.
In Vault's dev server, TLS is not enabled.
Follow the [HashiCorp Learn curriculum](https://learn.hashicorp.com/vault) when you are ready to set up a production server in Vault.
{{% /notice %}}

First, in your Vault, [enable and configure certificate authentication][32].
For example, your Vault might be configured for certificate authentication like this:

{{< code shell >}}
vault write auth/cert/certs/sensu-backend \
    display_name=sensu-backend \
    policies=sensu-backend-policy \
    certificate=@sensu-backend-vault.pem \
    ttl=3600
{{< /code >}}

Second, configure your `VaultProvider` in Sensu: 

{{< language-toggle >}}

{{< code yml >}}
---
type: VaultProvider
api_version: secrets/v1
metadata:
  name: vault
spec:
  client:
    address: https://vault.example.com:8200
    version: v2
    tls:
      ca_cert: /path/to/your/ca.pem
      client_cert: /etc/sensu/ssl/sensu-backend-vault.pem
      client_key: /etc/sensu/ssl/sensu-backend-vault-key.pem
      cname: sensu-backend.example.com
    max_retries: 2
    timeout: 20s
    rate_limiter:
      limit: 10
      burst: 100
{{< /code >}}

{{< code shell "JSON" >}}
{
  "type": "VaultProvider",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "vault"
  },
  "spec": {
    "client": {
      "address": "https://vault.example.com:8200",
      "version": "v2",
      "tls": {
        "ca_cert": "/path/to/your/ca.pem",
        "client_cert": "/etc/sensu/ssl/sensu-backend-vault.pem",
        "client_key": "/etc/sensu/ssl/sensu-backend-vault-key.pem",
        "cname": "sensu-backend.example.com"
      },
      "max_retries": 2,
      "timeout": "20s",
      "rate_limiter": {
        "limit": 10,
        "burst": 100
      }
    }
  }
}
{{< /code >}}

{{< /language-toggle >}}

The certificate you specify for `tls.client_cert` should be the same certificate you configured in your Vault for certificate authentication.

Next, [create your Vault secret][29].

### Create your Vault secret

First, retrieve your [PagerDuty Integration Key][30] (the secret you will set up in Vault).

Next, open a new terminal and run `vault kv put secret/pagerduty key=<integration_key>`.
Replace `<integration_key>` with your PagerDuty Integration Key.
This writes your secret into Vault.

In this example, the name of the secret is `pagerduty`.
The `pagerduty` secret contains a key, and you specified that the `key` value is your PagerDuty Integration Key.

{{% notice note %}}
**NOTE**: The Vault dev server is preconfigured with the secret keyspace already set up, so we recommend using the `secret/` path for the `id` value while you are learning and getting started with Vault secrets management.<br><br>This example uses the `id` format for the Vault [KV Secrets Engine v1](https://www.vaultproject.io/api-docs/secret/kv/kv-v1): `secret/pagerduty#key`.
If you are using the Vault [KV Secrets Engine v2](https://www.vaultproject.io/api-docs/secret/kv/kv-v2), the format is `secrets/sensu#pagerduty#key`.

{{% /notice %}}

Run `vault kv get secret/pagerduty` to view the secret you just set up.

Use `sensuctl create` to create your `vault` secret:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: Secret
api_version: secrets/v1
metadata:
  name: pagerduty_key
spec:
  id: secret/pagerduty#key
  provider: vault
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "Secret",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "pagerduty_key"
  },
  "spec": {
    "id": "secret/pagerduty#key",
    "provider": "vault"
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

Now you can securely pass your PagerDuty Integration Key in the handlers, and mutators by referring to the `pagerduty_key` secret.
In the [add a handler][19] section, you'll use your `pagerduty_key` secret in your handler definition.

## Add a handler

### Register the PagerDuty Handler dynamic runtime asset

To begin, register the [Sensu PagerDuty Handler dynamic runtime asset][23] with [`sensuctl asset add`][22]:

{{< code shell >}}
sensuctl asset add sensu/sensu-pagerduty-handler:2.2.0 -r pagerduty-handler
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the dynamic runtime asset: `pagerduty-handler`.

{{% notice note %}}
**NOTE**: You can [adjust the dynamic runtime asset definition](../../../plugins/use-assets-to-install-plugins#adjust-the-asset-definition) according to your Sensu configuration if needed.
{{% /notice %}}

Run `sensuctl asset list --format yaml` to confirm that the dynamic runtime asset is ready to use.

With this handler, Sensu can trigger and resolve PagerDuty incidents.
However, you still need to add your secret to the handler spec so that it requires your backend to request secrets from your secrets provider.

### Add your secret to the handler spec

To create a handler definition that uses your `pagerduty_key` secret, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
api_version: core/v2
type: Handler
metadata:
  name: pagerduty
spec:
  type: pipe
  command: pagerduty-handler --token $PD_TOKEN
  secrets:
  - name: PD_TOKEN
    secret: pagerduty_key
  runtime_assets:
  - pagerduty-handler
  timeout: 10
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "api_version": "core/v2",
  "type": "Handler",
  "metadata": {
    "name": "pagerduty"
  },
  "spec": {
    "type": "pipe",
    "command": "pagerduty-handler --token $PD_TOKEN",
    "secrets": [
      {
        "name": "PD_TOKEN",
        "secret": "pagerduty_key"
      }
    ],
    "runtime_assets": [
      "pagerduty-handler"
    ],
    "timeout": 10
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

## Configure a pipeline

Now that your handler is set up and Sensu can create incidents in PagerDuty, you can configure a [pipeline][33] to start receiving alerts based on the events your checks create.
A single pipeline workflow can include one or more filters, one mutator, and one handler.

In this case, the pipeline will include the built-in [is_incident][34] event filter and the `pagerduty` handler you created in the previous step.
You can add this pipeline to any check to receive a PagerDuty alert for every warning (`1`) or critical (`2`) event the check generates, as well as for resolution events.

To create the pipeline, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: Pipeline
api_version: core/v2
metadata:
  name: incident_alerts
spec:
  workflows:
  - name: pagerduty_incidents
    filters:
    - name: is_incident
      type: EventFilter
      api_version: core/v2
    handler:
      name: pagerduty
      type: Handler
      api_version: core/v2
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "Pipeline",
  "api_version": "core/v2",
  "metadata": {
    "name": "incident_alerts"
  },
  "spec": {
    "workflows": [
      {
        "name": "pagerduty_incidents",
        "filters": [
          {
            "name": "is_incident",
            "type": "EventFilter",
            "api_version": "core/v2"
          }
        ],
        "handler": {
          "name": "pagerduty",
          "type": "Handler",
          "api_version": "core/v2"
        }
      }
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

To automate this workflow, include the `incident_alerts` pipeline in any Sensu check definition in the check's [pipelines attribute][24].
When you list a pipeline in a check definition, all the observability events that the check produces will be processed according to the pipeline’s [workflows][35].

## Next steps

Add your pipeline to any check to start receiving PagerDuty alerts based on observability event data.
Read [Send PagerDuty alerts with Sensu][36] for an example that shows how to edit a check definition to add a pipeline.

Read the [secrets][9] or [secrets providers][2] reference for in-depth secrets management documentation.


[1]: https://www.vaultproject.io/docs/what-is-vault/
[2]: ../../../operations/manage-secrets/secrets-providers/
[3]: https://www.vaultproject.io/docs/auth/token/
[4]: https://www.vaultproject.io/docs/auth/cert/
[5]: ../../deploy-sensu/install-sensu/#install-the-sensu-backend
[6]: ../../deploy-sensu/install-sensu/#install-sensu-agents
[7]: ../../deploy-sensu/install-sensu/#install-sensuctl
[8]: ../../../api/enterprise/secrets/
[9]: ../../../operations/manage-secrets/secrets/
[11]: ../../deploy-sensu/install-sensu/#install-sensu-agents
[12]: https://www.vaultproject.io/docs/concepts/lease.html#lease-durations-and-renewal
[13]: ../../../api/enterprise/secrets/#providers-provider-put
[14]: ../../../api/enterprise/secrets/#secrets-secret-put
[15]: ../../deploy-sensu/secure-sensu/#optional-configure-sensu-agent-mtls-authentication
[17]: ../../../operations/manage-secrets/secrets-providers#tls-vault
[19]: #add-a-handler
[21]: ../../../observability-pipeline/observe-schedule/backend/#configuration-via-environment-variables
[22]: ../../../sensuctl/sensuctl-bonsai/#install-dynamic-runtime-asset-definitions
[23]: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler
[24]: ../../../observability-pipeline/observe-schedule/checks/#pipelines-attribute
[25]: https://www.vaultproject.io/downloads/
[28]: #create-your-backend-environment-variable
[29]: #create-your-vault-secret
[30]: #retrieve-your-pagerduty-integration-key
[31]: https://www.pagerduty.com/
[32]: https://www.vaultproject.io/docs/auth/cert/#configuration
[33]: ../../../observability-pipeline/observe-process/pipelines/
[34]: ../../../observability-pipeline/observe-filter/filters/#built-in-filter-is_incident
[35]: ../../../observability-pipeline/observe-process/pipelines/#workflows
[36]: ../../../observability-pipeline/observe-process/send-pagerduty-alerts/#assign-the-pipeline-to-a-check
