---
title: "Securing Sensu"
description: "As with all software, it’s important to minimize any attack surface exposed by the software. Sensu is no different. In this guide, you’ll learn about the components that need to be secured (and how to do so)."
weight: 1000
version: "5.15"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.15:
    parent: guides
---

As with any piece of software, it is critical to minimize any attack surface exposed by the software. Sensu is no different. The following component pieces need to be secured in order for Sensu to be considered production ready:

* [Etcd peer communication](#securing-etcd-peer-communication)
* [API and dashboard](#securing-the-api-and-the-dashboard)
* [Sensu agent to server communication](#securing-sensu-agent-to-server-communication)
* [Sensu agent TLS authentication](#sensu-agent-tls-authentication)
* [Creating self-signed certificates](#creating-self-signed-certificates)

We'll cover securing each one of those pieces, starting with etcd peer communication.

## Securing etcd peer communication

Let's start by covering how to secure etcd peer communication via the configuration at `/etc/sensu/backend.yml`. Let's look at the parameters you'll need to configure:

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

## Securing the API and the dashboard

Let's go over how to secure the API and dashboard. Please note that by changing the parameters below, the server will now communicate over TLS and expect agents connecting to it to use the WebSocket secure protocol. In order for communication to continue, both this section and the [following section](#securing-sensu-agent-to-server-communication) must be completed. 

Both the Sensu Go API and the dashboard use a common stanza in `/etc/sensu/backend.yml` to provide the certificate, key, and CA file needed to provide secure communication. Let's look at the attributes you'll need to configure:

{{< highlight yml >}}
##
# backend ssl configuration
##
cert-file: "/path/to/ssl/cert.pem"
key-file: "/path/to/ssl/key.pem"
trusted-ca-file: "/path/to/trusted-certificate-authorities.pem"
insecure-skip-tls-verify: false
{{< /highlight >}}

Providing the above cert-file and key-file parameters will cause the API to serve HTTP requests over
SSL/TLS (https). As a result, you will also need to specify `https://` schema
for the `api-url` parameter:

{{< highlight yml >}}
##
# backend api configuration
##
api-url: "https://localhost:8080"
{{< /highlight >}}

You can also specify a certificate and key for the dashboard separately from the API using the `dashboard-cert-file` and `dashboard-key-file` parameters as shown in the following example.

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

In the example above, we provide the path to the cert, key and CA file. After restarting the `sensu-backend` service, the parameters are loaded and you are able to access the dashboard at https://localhost:3000. Configuring these attributes will also ensure that agents are able to communicate securely. Let's move on to securing agent to server communication.

## Securing Sensu agent to server communication

We'll now discuss securing agent to server communication. Please note: by changing the agent configuration to communicate via WebSocket Secure protocol, the agent will no longer communicate over a plaintext connection. If the server is not secured as described in the [section above](#securing-the-api-and-the-dashboard), communication between the agent and server will not function.

By default, an agent uses the insecure `ws://` transport. Let's look at the example from `/etc/sensu/agent.yml`:

{{< highlight yml >}}
---
##
# agent configuration
##
backend-url:
  - "ws://127.0.0.1:8081"
{{< /highlight >}}

In order to use WebSockets over SSL/TLS (wss), change the `backend-url` value to the `wss://` schema:

{{< highlight yml >}}
---
##
# agent configuration
##
backend-url:
  - "wss://127.0.0.1:8081"
{{< /highlight >}}

The agent will then connect to Sensu backends over wss. Do note that by changing the configuration to wss, plaintext communication will not be possible.

It is also possible to provide a trusted CA as part of the agent configuration by passing `--trusted-ca-file` if starting the agent via `sensu-agent start`.

You may include it as part of the agent configuration in `/etc/sensu/agent.yml` as: 

{{< highlight yaml>}}
trusted-ca-file: "/path/to/trusted-certificate-authorities.pem"
{{< /highlight >}}

_NOTE: If creating a Sensu cluster, every cluster member needs to be present in the configuration. See the [Sensu Go clustering guide][1] for more information on how to configure agents for a clustered configuration._

**COMMERCIAL FEATURE**: Access client TLS authentication in the packaged Sensu Go distribution. For more information, see the [getting started guide][5].

## Sensu agent TLS authentication

By default, Sensu agents require username and password authentication to communicate with Sensu backends.
For Sensu's [default user credentials][2] and details about configuring Sensu role-based access control, see the [RBAC reference][3] and [guide to creating users][4].

Sensu can also use TLS authentication for connecting agents to backends. When agent TLS authentication is enabled, agents do not need to send
password credentials to backends when they connect. Additionally, when using TLS authentication, agents do not require an explicit user
in Sensu--they will default to using the 'system:agents' group.

Agents can still be bound to a specific user when the `system:agents` group is problematic. For this use case, create a
user that matches the Common Name (CN) of the agent's certificate.

NOTE: Sensu agents will need the ability to create events in the agent's namespace. Sensu operators who want to ensure that agents with incorrect CN fields can't access the backend can remove the default 'system:agents' group.

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

The `Subject:` field indicates the certificate's CN is 'client', so operators who want to bind the agent to a particular user in
Sensu can create a user called 'client'.

To enable agent TLS authentication, use existing certificates and keys for the Sensu backend and agent
or create new certificates and keys according to our [guide](#creating-self-signed-certificates).

Once backend and agent certificates are created, modfiy the backend and agent configuration as follows:

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

It's possible to use certificates for authentication that are distinct from other communication channels used by Sensu, like etcd or the API.
However, deployments can also use the same certificates and keys for etcd peer and client communication, the HTTP API, and agent
authentication, without issue.

## Creating self-signed certificates for securing etcd and backend-agent communication{#creating-self-signed-certificates}

We will use the [cfssl][9] tool to generate our self-signed certificates.

The first step is to create a **Certificate Authority (CA)**. To keep things straightforward, we will generate all our clients and peer certificates using this CA, but you might eventually want to create distinct CA.

{{< highlight shell >}}
echo '{"CN":"CA","key":{"algo":"rsa","size":2048}}' | cfssl gencert -initca - | cfssljson -bare ca -
echo '{"signing":{"default":{"expiry":"43800h","usages":["signing","key encipherment","server auth","client auth"]}}}' > ca-config.json
{{< /highlight >}}

Then, using that CA, we can generate certificates and keys for each peer (backend server) by
specifying their **Common Name (CN)** and their **hosts**. A `*.pem`, `*.csr` and `*.pem` will
be created for each backend.

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

We will also create generate a *client* certificate that can be used by clients to connect to
the etcd client URL. This time, we don't need to specify an address, only a **Common Name
(CN)** (here, `client`). The files `client-key.pem`, `client.csr`, and `client.pem` will be created.

{{< highlight shell >}}
export NAME=client
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -ca=ca.pem -ca-key=ca-key.pem -hostname="" -profile=client - | cfssljson -bare $NAME
{{< /highlight >}}

If you have  Sensu license, you can also generate a certificate for agent TLS authentication.

{{< highlight shell >}}
export NAME=agent-1
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -ca=ca.pem -ca-key=ca-key.pem -hostname="" -profile=client - | cfssljson -bare $NAME
{{< /highlight >}}

See [etcd's guide to generating self-signed certificates][6] for detailed instructions on securing etcd.

When you're finished, the following files should be created. The `*.csr` files will not be used in this guide.
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

Hopefully you've found this useful! If you find any issues or have any questions, feel free to reach out in our [Community Slack][7], or [open an issue][8] on Github.

[1]: ../clustering
[2]: ../../reference/rbac/#default-user
[3]: ../../reference/rbac/
[4]: ../../guides/create-read-only-user/
[5]: ../../getting-started/enterprise/
[6]: https://etcd.io/docs/v3.4.0/op-guide/security/
[7]: https://slack.sensu.io
[8]: https://github.com/sensu/sensu-docs/issues/new
[9]: https://github.com/cloudflare/cfssl

