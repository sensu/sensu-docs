---
title: "Secure Sensu"
linkTitle: "Secure Sensu"
guide_title: "Secure Sensu"
type: "guide"
description: "Secure components like the Sensu API and web UI and agent-to-server communication and configure agent mTLS authentication to make Sensu production-ready."
weight: 60
version: "6.7"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.7:
    parent: deploy-sensu
---

As with any piece of software, it is critical to minimize any attack surface the software exposes.
Sensu is no different.

This reference describes the components you need to secure to make Sensu production-ready, including etcd peer communication, the Sensu API and web UI, and Sensu agent-to-server communication.
It also describes agent mutual transport layer security (mTLS) authentication, which is required for [secrets management][1].

Before you can secure Sensu, you must [generate the certificates][12] you will need.
After you generate certificates, follow this reference to secure Sensu for production.

{{% notice note %}}
**NOTE**: As of [Go 1.15](https://golang.google.cn/doc/go1.15#commonname), certificates must include their Common Name (CN) as a Subject Alternative Name (SAN) field.
To prevent connection errors, follow [Generate certificates](../generate-certificates/) to make sure your certificates' SAN fields include their CNs.
{{% /notice %}}

## Secure etcd peer communication

{{% notice warning %}}
**WARNING**: You must update the default configuration for Sensu's embedded etcd with an explicit, non-default configuration to secure etcd communication in transit.
If you do not properly configure secure etcd communication, your Sensu configuration will be vulnerable to unauthorized manipulation via etcd client connections.
{{% /notice %}}

To properly secure etcd communication, replace the default configuration option values in your backend store configuration in `/etc/sensu/backend.yml` as follows:

1. Replace the placeholder with the path to your certificate and key for the `etcd-cert-file` and `etcd-key-file` to secure client communication:
{{< code yml >}}
etcd-cert-file: "/etc/sensu/tls/backend-1.example.com.pem"
etcd-key-file: "/etc/sensu/tls/backend-1-key.example.com.pem"
{{< /code >}}

2. Replace the placeholder with the path to your certificate and key for the `etcd-peer-cert-file` and `etcd-peer-key-file` to secure cluster communication:
{{< code yml >}}
etcd-peer-cert-file: "/etc/sensu/tls/backend-1.example.com.pem"
etcd-peer-key-file: "/etc/sensu/tls/backend-1-key.example.com.pem"
{{< /code >}}

3. Replace the placeholder with the path to your `ca.pem` certificate for the `etcd-trusted-ca-file` and `etcd-peer-trusted-ca-file` to secure communication with the etcd client server and between etcd cluster members:
{{< code yml >}}
etcd-trusted-ca-file: "/etc/sensu/tls/ca.pem"
etcd-peer-trusted-ca-file: "/etc/sensu/tls/ca.pem"
{{< /code >}}

4. Add non-default values for `etcd-listen-client-urls`, `etcd-listen-peer-urls`, and `etcd-initial-advertise-peer-urls`:
{{< code yml >}}
etcd-listen-client-urls: "https://localhost:2379"
etcd-listen-peer-urls: "https://localhost:2380"
etcd-advertise-client-urls: "https://localhost:2379"
etcd-initial-advertise-peer-urls: "https://localhost:2380"
{{< /code >}}

    {{% notice note %}}
**NOTE**: If you are securing a [cluster](../cluster-sensu), use your backend node IP address instead of `localhost` in the non-default values for `etcd-listen-client-urls`, `etcd-listen-peer-urls`, and `etcd-initial-advertise-peer-urls`.
{{% /notice %}}

5. Set `etcd-client-cert-auth` and `etcd-peer-client-cert-auth` to `true` to ensure that etcd only allows connections from clients and peers that present a valid, trusted certificate:
{{< code yml >}}
etcd-client-cert-auth: "true"
etcd-peer-client-cert-auth: "true"
{{< /code >}}

   Because etcd does not require authentication by default, you must set the `etcd-client-cert-auth` and `etcd-peer-client-cert-auth` configuration options to `true` to secure Sensu's embedded etcd datastore against unauthorized access.

{{% notice note %}}
**NOTE**: The [Sensu backend reference](../../../observability-pipeline/observe-schedule/backend/#datastore-and-cluster-configuration) includes more information about each etcd store configuration option.
{{% /notice %}}

## Secure the Sensu agent API, HTTP API, and web UI

The Sensu Go agent API, HTTP API, and web UI use a common stanza in `/etc/sensu/backend.yml` to provide the certificate, key, and CA file needed to provide secure communication.

{{% notice note %}}
**NOTE**: By changing these configuration options, the server will communicate using transport layer security (TLS) and expect agents that connect to it to use the WebSocket secure protocol.
For communication to continue, you must complete the configuration in this section **and** in the [Sensu agent-to-server communication](#secure-sensu-agent-to-server-communication) section.
{{% /notice %}}

Configure the following backend secure sockets layer (SSL) attributes in `/etc/sensu/backend.yml`:

1. Replace the placeholders with the paths to your CA root, backend certificate, and backend key files for the `trusted-ca-file`, `cert-file`, and `key-file` configuration options:
{{< code yml >}}
trusted-ca-file: "/etc/sensu/tls/ca.pem"
cert-file: "/etc/sensu/tls/backend-1.example.com.pem"
key-file: "/etc/sensu/tls/backend-1-key.example.com.pem"
{{< /code >}}

2. Set the `insecure-skip-tls-verify` configuration option to `false`:
{{< code yml >}}
insecure-skip-tls-verify: false
{{< /code >}}

3. When you provide these cert-file and key-file configuration options, the agent WebSocket API and HTTP API will serve requests over SSL/TLS (https).
For this reason, you must also specify `https://` schema for the `api-url` configuration option for backend API configuration:
{{< code yml >}}
api-url: "https://localhost:8080"
{{< /code >}}

Restart the `sensu-backend` service:

{{< code shell >}}
sudo systemctl restart sensu-backend
{{< /code >}}

After you restart the `sensu-backend` service, the configuration options will load and you will able to access the web UI at https://localhost:3000.
Configuring these options will also ensure that agents can communicate securely.

{{% notice note %}}
**NOTE**: The [Sensu backend reference](../../../observability-pipeline/observe-schedule/backend/#security-configuration) includes more information about each API and web UI security configuration option.
{{% /notice %}}

### Specify a separate web UI certificate and key

You can use the same certificates and keys to secure etcd, the HTTP API, and the web UI.
However, if you prefer, you can use a separate certificate and key for the web UI (for example, a commercially purchased certificate and key).

To do this, add the `dashboard-cert-file` and `dashboard-key-file` configuration options for backend SSL configuration in `/etc/sensu/backend.yml`:

{{< code yml >}}
dashboard-cert-file: "/etc/sensu/tls/separate-webui-cert.pem"
dashboard-key-file: "/etc/sensu/tls/separate-webui-key.pem"
{{< /code >}}

{{% notice note %}}
**NOTE**: If you do not specify a separate certificate and key for the web UI with `dashboard-cert-file` and `dashboard-key-file`, Sensu uses the certificate and key specified for the `cert-file` and `key-file` configuration options for the web UI.
The [Sensu backend reference](../../../observability-pipeline/observe-schedule/backend/#web-ui-configuration) includes more information about the `dashboard-cert-file` and `dashboard-key-file` web UI configuration options.
{{% /notice %}}

## Secure Sensu agent-to-server communication

{{% notice note %}}
**NOTE**: If you change the agent configuration to communicate via WebSocket Secure protocol, the agent will no longer communicate over a plaintext connection.
For communication to continue, you must complete the steps in this section **and** [secure the Sensu agent API, HTTP API, and web UI](#secure-the-sensu-agent-api-http-api-and-web-ui).
{{% /notice %}}

By default, an agent uses the insecure `ws://` transport.
Here's an example for agent configuration in `/etc/sensu/agent.yml`:

{{< code yml >}}
backend-url:
  - "ws://127.0.0.1:8081"
{{< /code >}}

To use WebSocket over SSL/TLS (wss), change the `backend-url` value to the `wss://` schema in `/etc/sensu/agent.yml`:

{{< code yml >}}
backend-url:
  - "wss://127.0.0.1:8081"
{{< /code >}}

The agent will connect to Sensu backends over wss.
Remember, if you change the configuration to wss, plaintext communication will not be possible.

You can also provide a trusted CA root certificate file as part of the agent configuration (named `ca.pem` in the example in [Generate certificates][4]).
If you will start the agent via `sensu-agent start`, pass the `--trusted-ca-file` flag with the start command.
Otherwise, include the `trusted-ca-file` configuration option in the agent configuration in `/etc/sensu/agent.yml`: 

{{< code yml>}}
trusted-ca-file: "/etc/sensu/tls/ca.pem"
{{< /code >}}

{{% notice note %}}
**NOTE**: If you are creating a Sensu cluster, every cluster member needs to be present in the configuration.
Read [Run a Sensu cluster](../cluster-sensu/) for more information about how to configure agents for a clustered configuration.
{{% /notice %}}

## Optional: Configure Sensu agent mTLS authentication

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access client mutual transport layer security (mTLS) authentication in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

By default, Sensu agents require username and password authentication to communicate with Sensu backends.
For Sensu's [default user credentials][2] and details about configuring Sensu role-based access control (RBAC), read the [RBAC reference][3].

Alternatively, Sensu agents can use mTLS for authenticating to the backend WebSocket transport.
When agent mTLS authentication is enabled, agents do not need to send password credentials to backends when they connect.
To use [secrets management][1], Sensu agents must be secured with mTLS.
In addition, when using mTLS authentication, agents do not require an explicit user in Sensu.
Sensu agents default to authenticating as the [`agent` user][2] and using permissions granted to the `system:agents` group by the `system:agents` cluster role and cluster role binding.

You can still bind agents to a specific user when the `system:agents` group is problematic.
For this use case, create a user that matches the Common Name (CN) of the agent's certificate.

{{% notice note %}}
**NOTE**: Sensu agents need to be able to create events in the agent's namespace.
To ensure that agents with incorrect CN fields can't access the backend, remove the default `system:agents` group.
{{% /notice %}}

For example, if you have a certificate named `client.pem`, you can run the following command to view the certificate's CN with openssl:

{{< code bash >}}
openssl x509 -in client.pem -text -noout
{{< /code >}}

The response should be similar to this example:

{{< code text >}}
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            37:57:7b:04:1d:67:63:7b:ff:ae:39:19:5b:55:57:80:41:3c:ec:ff
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN = CA
        Validity
            Not Before: Sep 26 18:58:00 2019 GMT
            Not After : Sep 24 18:58:00 2024 GMT
        Subject: CN = client
...
{{< /code >}}

The `Subject:` field indicates the certificate's CN is `client`, so to bind the agent to a particular user in Sensu, create a user called `client`.

To enable agent mTLS authentication:

1. Create and distribute a new Certificate Authority (CA) root certificate and new agent and backend certificates and keys according to the [Generate certificates][12] guide.

2. Add the following configuration options and values to the backend configuration `/etc/sensu/backend.yml`:
{{< code yml >}}
agent-auth-cert-file: "/etc/sensu/tls/backend-1.example.com.pem"
agent-auth-key-file: "/etc/sensu/tls/backend-1-key.example.com.pem"
agent-auth-trusted-ca-file: "/etc/sensu/tls/ca.pem"
{{< /code >}}

3. Add the following configuration options and values to the agent configuration in `/etc/sensu/agent.yml`:
{{< code yml >}}
cert-file: "/etc/sensu/tls/agent.pem"
key-file: "/etc/sensu/tls/agent-key.pem"
trusted-ca-file: "/etc/sensu/tls/ca.pem"
{{< /code >}}

You can use use certificates for authentication that are distinct from other communication channels used by Sensu, like etcd or the API.
However, deployments can also use the same certificates and keys for etcd peer and client communication, the HTTP API, and agent authentication without issues.

### Certificate revocation check

The Sensu backend checks certificate revocation list (CRL) and Online Certificate Status Protocol (OCSP) endpoints for agent mTLS, etcd client, and etcd peer connections whose remote sides present X.509 certificates that provide CRL and OCSP revocation information.

## Optional: Configure Sensu for FIPS compliance

Sensu provides a Linux amd64 OpenSSL-linked build that supports the Federal Information Processing Standard (FIPS) for Federal Risk and Authorization Management Program (FedRAMP) compliance.

The Sensu build with FIPS-mode configuration options is linked with the FIPS 140-2 validated cryptographic library.
Sensu builds comply with the FIPS-mode kernel option to enforce FIPS systemwide in Red Hat Enterprise Linux (RHEL).
[Contact Sensu][13] to request the build with FIPS support.

Sensu backends and agents will work on systems with FIPS kernel mode if the `require-fips` and `require-openssl` configuration options are set to `true` in the [backend][14] and [agent][15] configuration files.
Sensu backends and agents that have `require-fips` enabled will *not* work on systems without FIPS kernel mode.

Sensu backends on systems with FIPS kernel mode will work with PostgreSQL on systems with FIPS kernel mode.
For PostgreSQL on systems *without* FIPS kernel mode, Sensu backends with FIPS kernel mode will work as long as the PostgreSQL system supports FIPS-compliant ciphers/cipher suites.

Sensu agents and sensuctl on systems with and without FIPS kernel mode can connect to Sensu backends on systems with FIPS kernel mode.

### Configuration example for embedded etcd

To configure the Sensu backend for FIPS mode with embedded etcd, update the backend configuration file at `/etc/sensu/backend.yml` to use the following settings:

{{< code shell >}}
# fips configuration
require-openssl: true
require-fips: true

# etcd configuration
etcd-listen-client-urls: "https://localhost:2379"
etcd-listen-peer-urls: "https://localhost:2380"
etcd-advertise-client-urls: "https://localhost:2379"
etcd-initial-advertise-peer-urls: "https://localhost:2380"

# etcd client tls configuration
etcd-client-cert-auth: "true"
etcd-trusted-ca-file: "/etc/sensu/tls/ca.pem"
etcd-cert-file: "/etc/sensu/tls/centos-7-fips-1-backend.pem"
etcd-key-file: "/etc/sensu/tls/centos-7-fips-1-backend-key.pem"

# etcd peer tls configuration
etcd-peer-client-cert-auth: "true"
etcd-peer-trusted-ca-file: "/etc/sensu/tls/ca.pem"
etcd-peer-cert-file: "/etc/sensu/tls/centos-7-fips-1-backend.pem"
etcd-peer-key-file: "/etc/sensu/tls/centos-7-fips-1-backend-key.pem"

# api configuration
api-url: "https://localhost:8080"

# api tls configuration
insecure-skip-tls-verify: false
trusted-ca-file: "/etc/sensu/tls/ca.pem"
cert-file: "/etc/sensu/tls/centos-7-fips-1-backend.pem"
key-file: "/etc/sensu/tls/centos-7-fips-1-backend-key.pem"
{{< /code >}}

{{% notice note %}}
**NOTE**: If you are securing a [cluster](../cluster-sensu), use your backend node IP address instead of `localhost`.
{{% /notice %}}

### Configuration example for external etcd

To configure the Sensu backend for FIPS mode with external etcd, update the backend configuration file at `/etc/sensu/backend.yml` to use the following settings:

{{< code shell >}}
# fips configuration
require-openssl: true
require-fips: true

# etcd configuration
etcd-trusted-ca-file: "/etc/sensu/tls/ca.pem"
etcd-cert-file: "/etc/sensu/tls/centos-7-fips-1-backend.pem"
etcd-key-file: "/etc/sensu/tls/centos-7-fips-1-backend-key.pem"
etcd-client-urls: "https://localhost:2379"
no-embed-etcd: true

# api configuration
api-url: "https://localhost:8080"

# api tls configuration
insecure-skip-tls-verify: false
trusted-ca-file: "/etc/sensu/tls/ca.pem"
cert-file: "/etc/sensu/tls/centos-7-fips-1-backend.pem"
key-file: "/etc/sensu/tls/centos-7-fips-1-backend-key.pem"
{{< /code >}}

Use the following settings in your etcd configuration:

{{< code shell >}}
name: "centos-7-fips-1"
data-dir: "/var/lib/etcd-external"
auto-compaction-mode: "revision"
auto-compaction-retention: "2"

# cluster config
initial-cluster-token: "sup3rs3cr3t"
initial-cluster: "centos-7-fips-1=https://centos-7-fips-1:2380"
initial-cluster-state: "new"

# etcd configuration
listen-client-urls: "https://localhost:2379"
listen-peer-urls: "https://localhost:2380"
advertise-client-urls: "https://localhost:2379"
initial-advertise-peer-urls: "https://localhost:2380"

# etcd client tls configuration
client-transport-security:
  client-cert-auth: true
  trusted-ca-file: /etc/etcd/tls/ca.pem
  cert-file: /etc/etcd/tls/centos-7-fips-1-backend.pem
  key-file: /etc/etcd/tls/centos-7-fips-1-backend-key.pem
  auto-tls: false

# etcd peer tls configuration
peer-transport-security:
  client-cert-auth: true
  trusted-ca-file: /etc/etcd/tls/ca.pem
  cert-file: /etc/etcd/tls/centos-7-fips-1-backend.pem
  key-file: /etc/etcd/tls/centos-7-fips-1-backend-key.pem
  auto-tls: false
{{< /code >}}

{{% notice note %}}
**NOTE**: If you are securing a [cluster](../cluster-sensu), use your backend node IP address instead of `localhost`.
{{% /notice %}}

## Next step: Run a Sensu cluster

Well done!
Your Sensu installation should now be secured with TLS.
The last step before you deploy Sensu is to [set up a Sensu cluster][10].


[1]: ../../manage-secrets/secrets-management/
[2]: ../../control-access/rbac/#default-users
[3]: ../../control-access/rbac/
[4]: ../generate-certificates/#create-a-certificate-authority-ca
[6]: https://etcd.io/docs/latest/op-guide/security/
[9]: https://github.com/cloudflare/cfssl
[10]: ../cluster-sensu/
[12]: ../generate-certificates/
[13]: https://sensu.io/contact
[14]: ../../../observability-pipeline/observe-schedule/backend/#fips-openssl
[15]: ../../../observability-pipeline/observe-schedule/agent/#fips-openssl
