---
title: "Generate certificates for your Sensu installation"
linkTitle: "Generate Certificates"
description: "public key infrastructure (PKI). Learn how to set up PKI and generate the certificates you need to secure Sensu."
weight: 165
version: "5.18"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.18:
    parent: guides
---

- [Best practices for public key infrastructure (PKI)](#best-practices-for-public-key-infrastructure-pki)
- [Create self-signed certificates](#create-self-signed-certificates)
  - [Create a Certificate Authority (CA)](#create-a-certificate-authority-ca)
  - [Generate certificates and keys for each peer](#generate-certificates-and-keys-for-each-peer)
  - [Generate a client certificate ](#generate-a-client-certificate)
  - [Generate an agent TLS authentication certificate (optional)](#generate-an-agent-tls-authentication-certificate-optional)
- [List of certificate files created](#list-of-certificate-files-created)
- [Next steps](#next-steps)

After you install Sensu, you should secure it with public key infrastructure (PKI).
This guide describes how to set up PKI and generate the certificates you need to secure etcd and backend-agent communication.

## Best practices for public key infrastructure (PKI)

**PLACEHOLDER**: Add details about best practices that are relevant for Sensu certificates.

## Create self-signed certificates

You can use self-signed certificates to secure etcd and backend-agent communication.
This example uses the [cfssl][6] tool to generate self-signed certificates.

### Create a Certificate Authority (CA)

First, create a Certificate Authority (CA).
To keep things straightforward in this example, you will generate all clients and peer certificates using this CA.
In practice, you might eventually want to create a distinct CA.

{{< highlight shell >}}
echo '{"CN":"CA","key":{"algo":"rsa","size":2048}}' | cfssl gencert -initca - | cfssljson -bare ca -
echo '{"signing":{"default":{"expiry":"43800h","usages":["signing","key encipherment","server auth","client auth"]}}}' > ca-config.json
{{< /highlight >}}

### Generate certificates and keys for each peer

Second, use your CA to generate certificates and keys for each peer (backend server) by specifying their Common Name (CN) and hosts.
You will create two `*.pem` files and one `*.csr` file for each backend:

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

### Generate a client certificate 

Third, generate a *client* certificate that clients can use to connect to the etcd client URL.
For this certificate, you only need to specify a CN (here, `client`) &emdash; you don't need to specify an address.
You will create the files `client-key.pem`, `client.csr`, and `client.pem`:

{{< highlight shell >}}
export NAME=client
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -ca=ca.pem -ca-key=ca-key.pem -hostname="" -profile=client - | cfssljson -bare $NAME
{{< /highlight >}}

### Generate an agent TLS authentication certificate (optional)

If you have a Sensu license, you can also generate a certificate for agent TLS authentication:

{{< highlight shell >}}
export NAME=agent-1
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -ca=ca.pem -ca-key=ca-key.pem -hostname="" -profile=client - | cfssljson -bare $NAME
{{< /highlight >}}

See [etcd's guide to generating self-signed certificates][7] for detailed instructions for securing etcd.

## List of certificate files created

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

Now that your backends are deployed and secured according to best practices, read [Secure Sensu][1] to make Sensu production-ready:

- Secure [etcd communication][2], the [Sensu API and dashboard][3], and [agent-to-server communication][4].
- [Use TLS with Sensu][5].


[1]: ../../guides/securing-sensu/
[2]: ../../guides/securing-sensu/#secure-etcd-peer-communication
[3]: ../../guides/securing-sensu/#secure-the-api-and-dashboard
[4]: ../../guides/securing-sensu/#secure-sensu-agent-to-server-communication
[5]: ../../guides/securing-sensu/#sensu-agent-tls-authentication
[6]: https://github.com/cloudflare/cfssl
[7]: https://etcd.io/docs/v3.4.0/op-guide/security/
