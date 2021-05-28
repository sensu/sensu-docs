---
title: "Secure Sensu"
linkTitle: "Secure Sensu"
description: "As with all software, it’s important to minimize any attack surface exposed by the software. Sensu is no different. Learn about the components that need to be secured and how to secure them."
weight: 60
version: "5.21"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.21:
    parent: deploy-sensu
---

As with any piece of software, it is critical to minimize any attack surface the software exposes.
Sensu is no different.
This guide describes the components you need to secure to make Sensu production-ready.

Before you can use this guide, you must have [generated the certificates][12] you will need to secure Sensu.

## Secure etcd peer communication

{{% notice warning %}}
**WARNING**: You must update the default configuration for Sensu's embedded etcd with an explicit, non-default configuration to secure etcd communication in transit.
If you do not properly configure secure etcd communication, your Sensu configuration will be vulnerable to unauthorized manipulation via etcd client connections.
{{% /notice %}}

You can secure etcd peer communication via the configuration at `/etc/sensu/backend.yml`.
Here are the parameters you'll need to configure:

{{< code yml >}}
##
# backend store configuration
##
etcd-listen-client-urls: "https://localhost:2379"
etcd-listen-peer-urls: "https://localhost:2380"
etcd-initial-advertise-peer-urls: "https://localhost:2380"
etcd-cert-file: "/path/to/your/cert"
etcd-key-file: "/path/to/your/key"
etcd-trusted-ca-file: "/path/to/your/ca/file"
etcd-peer-cert-file: "/path/to/your/peer/cert"
etcd-peer-key-file: "/path/to/your/peer/key"
etcd-client-cert-auth: "true"
etcd-peer-client-cert-auth: "true"
etcd-peer-trusted-ca-file: "/path/to/your/peer/ca/file"
{{< /code >}}

To properly secure etcd communication, replace the default parameter values in your backend store configuration with non-default versions of these certificates, keys, and URLs:

 - A certificate and key for the `etcd-cert-file` and `etcd-key-file` to secure client communication
 - A certificate and key for the `etcd-peer-cert-file` and `etcd-peer-key-file` to secure cluster communication
 - Non-default values for `etcd-listen-client-urls`, `etcd-listen-peer-urls`, and `etcd-initial-advertise-client-urls`

    {{% notice note %}}
**NOTE**: If you are securing a [cluster](../cluster-sensu), use your backend node IP address instead of `localhost` in the non-default values for `etcd-listen-client-urls`, `etcd-listen-peer-urls`, and `etcd-initial-advertise-client-urls`.
{{% /notice %}}

In addition, set `etcd-client-cert-auth` and `etcd-peer-client-cert-auth` to `true` to ensure that etcd only allows connections from clients and peers that present a valid, trusted certificate.
Because etcd does not require authentication by default, you must set `etcd-client-cert-auth` and `etcd-peer-client-cert-auth` to `true` to secure Sensu's embedded etcd datastore against unauthorized access.

## Secure the API and web UI

The Sensu Go Agent API, HTTP API, and web UI use a common stanza in `/etc/sensu/backend.yml` to provide the certificate, key, and CA file needed to provide secure communication.
Here are the attributes you'll need to configure.

{{% notice note %}}
**NOTE**: By changing these parameters, the server will communicate using transport layer security (TLS) and expect agents that connect to it to use the WebSocket secure protocol.
For communication to continue, you must complete the steps in this section **and** in the [Secure Sensu agent-to-server communication](#secure-sensu-agent-to-server-communication) section.
{{% /notice %}}

{{< code yml >}}
##
# backend ssl configuration
##
cert-file: "/path/to/ssl/cert.pem"
key-file: "/path/to/ssl/key.pem"
trusted-ca-file: "/path/to/trusted-certificate-authorities.pem"
insecure-skip-tls-verify: false
{{< /code >}}

Providing these cert-file and key-file parameters will cause the Agent Websocket API and HTTP API to serve requests over SSL/TLS (https).
As a result, you will also need to specify `https://` schema for the `api-url` parameter:

{{< code yml >}}
##
# backend api configuration
##
api-url: "https://localhost:8080"
{{< /code >}}

You can also specify a certificate and key for the web UI separately from the API using the `dashboard-cert-file` and `dashboard-key-file` parameters:

{{< code yml >}}
##
# backend ssl configuration
##
cert-file: "/path/to/ssl/cert.pem"
key-file: "/path/to/ssl/key.pem"
trusted-ca-file: "/path/to/trusted-certificate-authorities.pem"
insecure-skip-tls-verify: false
dashboard-cert-file: "/path/to/ssl/cert.pem"
dashboard-key-file: "/path/to/ssl/key.pem"
{{< /code >}}

In this example, we provide the path to the cert, key, and CA file.
After you restart the `sensu-backend` service, the parameters will load and you will able to access the web UI at https://localhost:3000.
Configuring these attributes will also ensure that agents can communicate securely.

## Secure Sensu agent-to-server communication

{{% notice note %}}
**NOTE**: If you change the agent configuration to communicate via WebSocket Secure protocol, the agent will no longer communicate over a plaintext connection.
For communication to continue, you must complete the steps in this section **and** in the [Secure the API and web UI](#secure-the-api-and-web-ui) section.
{{% /notice %}}

By default, an agent uses the insecure `ws://` transport.
Here's an example from `/etc/sensu/agent.yml`:

{{< code yml >}}
---
##
# agent configuration
##
backend-url:
  - "ws://127.0.0.1:8081"
{{< /code >}}

To use WebSocket over SSL/TLS (wss), change the `backend-url` value to the `wss://` schema:

{{< code yml >}}
---
##
# agent configuration
##
backend-url:
  - "wss://127.0.0.1:8081"
{{< /code >}}

The agent will connect to Sensu backends over wss.
Remember, if you change the configuration to wss, plaintext communication will not be possible.

You can also provide a trusted CA as part of the agent configuration by passing `--trusted-ca-file` if you are starting the agent via `sensu-agent start`.
You may include it as part of the agent configuration in `/etc/sensu/agent.yml`: 

{{< code yml>}}
trusted-ca-file: "/path/to/trusted-certificate-authorities.pem"
{{< /code >}}

{{% notice note %}}
**NOTE**: If you are creating a Sensu cluster, every cluster member needs to be present in the configuration.
See [Run a Sensu cluster](../cluster-sensu/) for more information about how to configure agents for a clustered configuration.
{{% /notice %}}

## Sensu agent mTLS authentication

**COMMERCIAL FEATURE**: Access client mutual transport layer security (mTLS) authentication in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][5].

By default, Sensu agents require username and password authentication to communicate with Sensu backends.
For Sensu's [default user credentials][2] and details about configuring Sensu role-based access control (RBAC), see the [RBAC reference][3] and [Create a read-only user][4].

Alternately, Sensu agents can use mTLS for authenticating to the backend websocket transport.
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

To view a certificate's CN with openssl:

{{< code bash >}}
$ openssl x509 -in client.pem -text -noout
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

To enable agent mTLS authentication, create and distribute new certificates and keys according to the [Generate certificates][12] guide.
Once the TLS certificate and key are in place, [update the agent configuration using `cert-file` and `key-file` security configuration flags][7].

After you create backend and agent certificates, modify the backend and agent configuration:

{{< code yml >}}
##
# backend configuration
##
agent-auth-cert-file: "/path/to/backend-1.pem"
agent-auth-key-file: "/path/to/backend-1-key.pem"
agent-auth-trusted-ca-file: "/path/to/ca.pem"
{{< /code >}}

{{< code yml >}}
##
# agent configuration
##
cert-file: "/path/to/agent.pem"
key-file: "/path/to/agent-key.pem"
trusted-ca-file: "/path/to/ca.pem"
{{< /code >}}

You can use use certificates for authentication that are distinct from other communication channels used by Sensu, like etcd or the API.
However, deployments can also use the same certificates and keys for etcd peer and client communication, the HTTP API, and agent authentication without issues.

### Certificate revocation check

The Sensu backend checks certificate revocation list (CRL) and Online Certificate Status Protocol (OCSP) endpoints for agent mTLS, etcd client, and etcd peer connections whose remote sides present X.509 certificates that provide CRL and OCSP revocation information.

## Next step: Run a Sensu cluster

Well done!
Your Sensu installation should now be secured with TLS.
The last step before you deploy Sensu is to [set up a Sensu cluster][10].


[1]: ../../manage-secrets/secrets-management/
[2]: ../../../reference/rbac/#default-users
[3]: ../../../reference/rbac/
[4]: ../../control-access/create-read-only-user/
[5]: ../../../commercial/
[6]: https://etcd.io/docs/latest/op-guide/security/
[7]: ../../../reference/agent/#security-configuration-flags
[9]: https://github.com/cloudflare/cfssl
[10]: ../cluster-sensu/
[12]: ../generate-certificates/
