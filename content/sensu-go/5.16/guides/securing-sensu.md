---
title: "Secure Sensu"
linkTitle: "Secure Sensu"
description: "As with all software, it’s important to minimize any attack surface exposed by the software. Sensu is no different. Learn about the components that need to be secured and how to secure them."
weight: 170
version: "5.16"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.16:
    parent: guides
---

- [Secure etcd peer communication](#secure-etcd-peer-communication)
- [Secure the API and dashboard](#secure-the-api-and-dashboard)
- [Secure Sensu agent-to-server communication](#secure-sensu-agent-to-server-communication)
- [Sensu agent TLS authentication](#sensu-agent-tls-authentication)
- [Create self-signed certificates](#create-self-signed-certificates)
- [Next steps](#next-steps)

As with any piece of software, it is critical to minimize any attack surface the software exposes.
Sensu is no different.
This guide describes the components you need to secure to make Sensu production-ready.

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

_**NOTE**: By changing these parameters, the server will communicate over TLS and expect agents that connect to it to use the WebSocket secure protocol. For communication to continue, you must complete the steps in this section **and** in the [Secure Sensu agent-to-server communication][10] section._

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

_**NOTE**: If you change the agent configuration to communicate via WebSocket Secure protocol, the agent will no longer communicate over a plaintext connection. For communication to continue, you must complete the steps in this section **and** in the [Secure the API and dashboard][11] section._

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

_**NOTE**: If you are creating a Sensu cluster, every cluster member needs to be present in the configuration. See [Run a Sensu cluster][1] for more information about how to configure agents for a clustered configuration._

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

_**NOTE**: Sensu agents need to be able to create events in the agent's namespace. To ensure that agents with incorrect CN fields can't access the backend, remove the default `system:agents` group._

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

To enable agent TLS authentication, use existing certificates and keys for the Sensu backend and agent or create new certificates and keys according to the [Create self-signed certificates][12] section.

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

## Create self-signed certificates for securing etcd and backend-agent communication {#create-self-signed-certificates}

This example uses the [cfssl][9] tool to generate self-signed certificates.

First, create a Certificate Authority (CA).
To keep things straightforward in this example, you will generate all clients and peer certificates using this CA, but you might eventually want to create a distinct CA.

{{< highlight shell >}}
echo '{"CN":"CA","key":{"algo":"rsa","size":2048}}' | cfssl gencert -initca - | cfssljson -bare ca -
echo '{"signing":{"default":{"expiry":"43800h","usages":["signing","key encipherment","server auth","client auth"]}}}' > ca-config.json
{{< /highlight >}}

Then, using that CA, generate certificates and keys for each peer (backend server) by specifying their Common Name (CN) and their hosts.
A `*.pem`, `*.csr` and `*.pem` will be created for each backend.

{{< highlight shell >}}
export ADDRESS=10.0.0.1,backend-1
export NAME=backend-1
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -ca=ca.pem -ca-key=ca-key.pem -hostname="$ADDRESS" -profile=peer - | cfssljson -bare $NAME

export ADDRESS=10.0.0.2,backend-2
export NAME=backend-2
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -ca=ca.pem -ca-key=ca-key.pem -hostname="$ADDRESS" -profile=peer - | cfssljson -bare $NAME

export ADDRESS=10.0.0.3,backend-3
export NAME=backend-3
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -ca=ca.pem -ca-key=ca-key.pem -hostname="$ADDRESS" -profile=peer - | cfssljson -bare $NAME
{{< /highlight >}}

You will also create generate a *client* certificate that can be used by clients to connect to the etcd client URL.
This time, you don't need to specify an address, only a CN (here, `client`).
The files `client-key.pem`, `client.csr`, and `client.pem` will be created:

{{< highlight shell >}}
export NAME=client
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -ca=ca.pem -ca-key=ca-key.pem -hostname="" -profile=client - | cfssljson -bare $NAME
{{< /highlight >}}

If you have a Sensu license, you can also generate a certificate for agent TLS authentication:

{{< highlight shell >}}
export NAME=agent-1
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -ca=ca.pem -ca-key=ca-key.pem -hostname="" -profile=client - | cfssljson -bare $NAME
{{< /highlight >}}

See [etcd's guide to generating self-signed certificates][6] for detailed instructions for securing etcd.

When you're finished, the following files should be created (the `*.csr` files are not used in this guide):

{{< highlight shell >}}
agent-1-key.pem
agent-1.csr
agent-1.pem
backend-1-key.pem
backend-1.csr
backend-1.pem
backend-2-key.pem
backend-2.csr
backend-2.pem
backend-3-key.pem
backend-3.csr
backend-3.pem
ca-config.json
ca-key.pem
ca.csr
ca.pem
client-key.pem
client.csr
client.pem
{{< /highlight >}}

## Next steps

Learn about [role-based access control (RBAC) in Sensu][3] or [create a read-only user][4].

[1]: ../clustering/
[2]: ../../reference/rbac/#default-user
[3]: ../../reference/rbac/
[4]: ../../guides/create-read-only-user/
[5]: ../../getting-started/enterprise/
[6]: https://etcd.io/docs/v3.4.0/op-guide/security/
[9]: https://github.com/cloudflare/cfssl
[10]: #secure-sensu-agent-to-server-communication
[11]: #secure-the-api-and-dashboard
[12]: #create-self-signed-certificates
