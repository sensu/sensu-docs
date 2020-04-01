---
title: "Secure Sensu"
linkTitle: "Secure Sensu"
description: "As with all software, it’s important to minimize any attack surface exposed by the software. Sensu is no different. Learn about the components that need to be secured and how to secure them."
weight: 170
version: "5.19"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.19:
    parent: guides
---

- [Secure etcd peer communication](#secure-etcd-peer-communication)
- [Secure the API and dashboard](#secure-the-api-and-dashboard)
- [Secure Sensu agent-to-server communication](#secure-sensu-agent-to-server-communication)
- [Sensu agent TLS authentication](#sensu-agent-tls-authentication)
- [Next step: Run a Sensu cluster](#next-step-run-a-sensu-cluster)

As with any piece of software, it is critical to minimize any attack surface the software exposes.
Sensu is no different.
This guide describes the components you need to secure to make Sensu production-ready.

Before you can use this guide, you must have [generated the certificates][1] you will need to secure Sensu.

## Secure etcd peer communication

You can secure etcd peer communication via the configuration at `/etc/sensu/backend.yml`.
Here are the parameters you'll need to configure:

{{< highlight yml >}}
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
etcd-peer-client-cert-auth: "true"
etcd-peer-trusted-ca-file: "/path/to/your/peer/ca/file"
{{< /highlight >}}

## Secure the API and dashboard

The Sensu Go Agent API, HTTP API, and web UI use a common stanza in `/etc/sensu/backend.yml` to provide the certificate, key, and CA file needed to provide secure communication.
Here are the attributes you'll need to configure.

{{% notice note %}}
**NOTE**: By changing these parameters, the server will communicate over TLS and expect agents that connect to it to use the WebSocket secure protocol.
For communication to continue, you must complete the steps in this section **and** in the [Secure Sensu agent-to-server communication](#secure-sensu-agent-to-server-communication) section.
{{% /notice %}}

{{< highlight yml >}}
##
# backend ssl configuration
##
cert-file: "/path/to/ssl/cert.pem"
key-file: "/path/to/ssl/key.pem"
trusted-ca-file: "/path/to/trusted-certificate-authorities.pem"
insecure-skip-tls-verify: false
{{< /highlight >}}

Providing these cert-file and key-file parameters will cause the Agent Websocket API and HTTP API to serve requests over SSL/TLS (https).
As a result, you will also need to specify `https://` schema for the `api-url` parameter:

{{< highlight yml >}}
##
# backend api configuration
##
api-url: "https://localhost:8080"
{{< /highlight >}}

You can also specify a certificate and key for the dashboard separately from the API using the `dashboard-cert-file` and `dashboard-key-file` parameters:

{{< highlight yml >}}
##
# backend ssl configuration
##
cert-file: "/path/to/ssl/cert.pem"
key-file: "/path/to/ssl/key.pem"
trusted-ca-file: "/path/to/trusted-certificate-authorities.pem"
insecure-skip-tls-verify: false
dashboard-cert-file: "/path/to/ssl/cert.pem"
dashboard-key-file: "/path/to/ssl/key.pem"
{{< /highlight >}}

In this example, we provide the path to the cert, key, and CA file.
After you restart the `sensu-backend` service, the parameters will load and you will able to access the dashboard at https://localhost:3000.
Configuring these attributes will also ensure that agents can communicate securely.

## Secure Sensu agent-to-server communication

{{% notice note %}}
**NOTE**: If you change the agent configuration to communicate via WebSocket Secure protocol, the agent will no longer communicate over a plaintext connection.
For communication to continue, you must complete the steps in this section **and** in the [Secure the API and dashboard](#secure-the-api-and-dashboard) section.
{{% /notice %}}

By default, an agent uses the insecure `ws://` transport.
Here's an example from `/etc/sensu/agent.yml`:

{{< highlight yml >}}
---
##
# agent configuration
##
backend-url:
  - "ws://127.0.0.1:8081"
{{< /highlight >}}

To use WebSocket over SSL/TLS (wss), change the `backend-url` value to the `wss://` schema:

{{< highlight yml >}}
---
##
# agent configuration
##
backend-url:
  - "wss://127.0.0.1:8081"
{{< /highlight >}}

The agent will connect to Sensu backends over wss.
Remember, if you change the configuration to wss, plaintext communication will not be possible.

You can also provide a trusted CA as part of the agent configuration by passing `--trusted-ca-file` if you are starting the agent via `sensu-agent start`.
You may include it as part of the agent configuration in `/etc/sensu/agent.yml`: 

{{< highlight yaml>}}
trusted-ca-file: "/path/to/trusted-certificate-authorities.pem"
{{< /highlight >}}

{{% notice note %}}
**NOTE**: If you are creating a Sensu cluster, every cluster member needs to be present in the configuration.
See [Run a Sensu cluster](../clustering/) for more information about how to configure agents for a clustered configuration.
{{% /notice %}}

## Sensu agent TLS authentication

**COMMERCIAL FEATURE**: Access client TLS authentication in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][5].

By default, Sensu agents require username and password authentication to communicate with Sensu backends.
For Sensu's [default user credentials][2] and details about configuring Sensu role-based access control, see the [RBAC reference][3] and [Create a read-only user][4].

Sensu can also use TLS authentication for connecting agents to backends.
When agent TLS authentication is enabled, agents do not need to send password credentials to backends when they connect.
In addition, when using TLS authentication, agents do not require an explicit user in Sensu.
They will default to using the `system:agents` group.

You can still bind agents to a specific user when the `system:agents` group is problematic.
For this use case, create a user that matches the Common Name (CN) of the agent's certificate.

{{% notice note %}}
**NOTE**: Sensu agents need to be able to create events in the agent's namespace.
To ensure that agents with incorrect CN fields can't access the backend, remove the default `system:agents` group.
{{% /notice %}}

To view a certificate's CN with openssl:

{{< highlight bash >}}
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
{{< /highlight >}}

The `Subject:` field indicates the certificate's CN is `client`, so to bind the agent to a particular user in Sensu, create a user called `client`.

To enable agent TLS authentication, use existing certificates and keys for the Sensu backend and agent or [generate new certificates and keys][1].

After you create backend and agent certificates, modfiy the backend and agent configuration:

{{< highlight yml >}}
##
# backend configuration
##
agent-auth-cert-file: "/path/to/backend-1.pem"
agent-auth-key-file: "/path/to/backend-1-key.pem"
agent-auth-trusted-ca-file: "/path/to/ca.pem"
{{< /highlight >}}

{{< highlight yml >}}
##
# agent configuration
##
cert-file: "/path/to/agent-1.pem"
key-file: "/path/to/agent-1-key.pem"
trusted-ca-file: "/path/to/ca.pem"
{{< /highlight >}}

You can use use certificates for authentication that are distinct from other communication channels used by Sensu, like etcd or the API.
However, deployments can also use the same certificates and keys for etcd peer and client communication, the HTTP API, and agent authentication without issues.

## Next step: Run a Sensu cluster

Well done!
Your Sensu installation should now be secured with TLS.
The last step before you deploy Sensu is to [set up a Sensu cluster][7].


[1]: ../../guides/generate-certificates
[2]: ../../reference/rbac/#default-users
[3]: ../../reference/rbac/
[4]: ../../guides/create-read-only-user/
[5]: ../../getting-started/enterprise/
[6]: https://etcd.io/docs/v3.4.0/op-guide/security/
[7]: ../../guides/clustering/
[9]: https://github.com/cloudflare/cfssl
