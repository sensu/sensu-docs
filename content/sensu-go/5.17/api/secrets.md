#### Example {#vaultprovider}

/secrets/v1/providers/:name (PUT) |
-----------------------|-------------------------------------------
description            | Create or update the vault secret provider
example url            | http://hostname:8080/api/enterprise/secrets/v1/providers/vault1
payload                | {{< highlight json >}}
{
  "type": "vault_provider",
  "api_version": "secrets/v1",
  "metadata": {
    "name": "vault1"
  },
  "spec": {
    "client": {
      "address": "https://vaultserver.example.com:8200",
      "token": "b1g53cr3t!",
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

The vault provider gives Sensu a way to connect to Hashicorp Vault as a client.

The token is the Vault token used for authentication.

The version is the Vault API version.

By default, Vault only works with TLS configured. You may need to set up a CA cert, if it is not
already stored in your operating system's trust store. To do this, set the TLS object, and provide
the "ca_cert" path.

Any number of vault providers can be configured.

Vault providers have no namespace, and are global to the system.

#### Example {#vaultsecret}

/secrets/v1/secrets/:name (PUT) |
--------------|------------------------------------------
description   | Create or update a secret that references vault
example url   | http://hostname:8080/api/enterprise/secrets/v1/secrets/vault_secret
payload       | {{< highlight json >}}
{
  "type": "secret",
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
{{ /highlight }}

Secrets that target Hashicorp Vault always have an id like the example above. The secret must start
with the word 'secret'. In this example, the name of the secret is "website". The "website" secret
contains a value called "database" which is the password to our database.

This differs from the env provider, as Vault secrets are maps of data. They are similar to Chef
data bags.
