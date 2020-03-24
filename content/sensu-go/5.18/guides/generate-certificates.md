---
title: "Generate certificates for your Sensu installation"
linkTitle: "Generate Certificates"
description: "After you install Sensu, learn how to secure it with public key infrastructure (PKI). Set up PKI and generate the certificates you need to secure Sensu."
weight: 165
version: "5.18"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.18:
    parent: guides
---

- [Public key infrastructure](#public-key-infrastructure-pki)
- [Issue certificates](#issue-certificates)
    - [Install TLS](#install-tls)
    - [Create a Certificate Authority (CA)](#create-a-certificate-authority-ca)
    - [Generate backend cluster certificates](#generate-backend-cluster-certificates)
    - [Generate agent certificate](#generate-agent-certificate)
- [Next step: Secure Sensu](#next-step-secure-sensu)

If you are deploying Sensu for use outside of a local development environment, you should secure it using transport layer security (TLS).
TLS uses encryption to provide security for communication between Sensu backends and agents as well as communication between human operators and the Sensu backend, such as web UI or sensuctl access.

Because reconfiguring an existing Sensu deployment from cleartext to TLS can be time-consuming, we recommend that you configure TLS for your backend from the very beginning.
TLS is also required to use some of Sensu's commercial features, like [secrets management][9] and mutual TLS authentication (mTLS).

This guide explains how to generate the certificates you need to secure Sensu in production.
To use this guide, you must have already [installed Sensu][10] on:

- One backend system or three backend systems that you plan to cluster together.
- One or more agents.

## Public key infrastructure (PKI)

To use TLS, you typically must provision [public key infrastructure (PKI)][8] for issuing certificates. 

This guide describes how to set up a minimal PKI and generate the certificates you need to secure Sensu communications for a clustered backend and agents.
If your organization has existing PKI for certificate issuance, you can adapt the suggestions in this guide to your organization's PKI.

Recommended practices for deploying and maintaining production PKI can be complex and case-specific, so recommended practices are not included in the scope of this guide.

## Issue certificates

Certificate Authorities (CAs) are a common PKI component.
Use a CA certificate and key to generate certificates and keys to use with Sensu backends and agents.

This example uses the [CloudFlare cfssl][6] toolkit to generate a CA and self-signed certificates from that CA.

### Install TLS 

The [cfssl][6] toolkit is released as a collection of command-line tools.
These tools only need to be installed on one system to generate your CA and issue certificates.
You may install the toolkit on your laptop or workstation and store the files there for safekeeping or install the toolkit on one of the systems where you'll run the Sensu backend.

In this example you'll walk through installing cfssl on a Linux system, which requires copying certain certificates and keys to each of the backend and agent systems you are securing.
This guide assumes that you'll install these certificates in the `/etc/sensu/pki` directory on each system.

{{< highlight shell >}}

# Download cfssl and cfssljson executables and install them in /usr/local/bin:
sudo curl -L https://github.com/cloudflare/cfssl/releases/download/v1.4.1/cfssl_1.4.1_linux_amd64 -o /usr/local/bin/cfssl
sudo curl -L https://github.com/cloudflare/cfssl/releases/download/v1.4.1/cfssljson_1.4.1_linux_amd64 -o /usr/local/bin/cfssljson
sudo chmod +x /usr/local/bin/cfssl*

# Verify executable version:
cfssl version

# Version: 1.4.1

# Runtime: go1.12.12
cfssljson -version

# Version: 1.4.1

# Runtime: go1.12.12
{{< /highlight >}}

### Create a Certificate Authority (CA)

Create a CA with cfssl and cfssljson:

{{< highlight shell >}}
mkdir -p /etc/sensu/pki
cd /etc/sensu/pki
echo '{"CN":"Sensu Test CA","key":{"algo":"rsa","size":2048}}' | cfssl gencert -initca - | cfssljson -bare ca -
echo '{"signing":{"default":{"expiry":"17520h","usages":["signing","key encipherment","client auth"]},"profiles":{"backend":{"usages":["signing","key encipherment","server auth"],"expiry":"4320h"},"agent":{"usages":["signing","key encipherment","client auth"],"expiry":"4320h"}}}}' > ca-config.json
{{< /highlight >}}

<a name="copy-ca-pem"></a>

You should now have a directory at `/etc/sensu/pki` that contains the following files:

 filename        | description |
-----------------|-------------|
`ca.csr`         | Certificate signing request for the CA certificate |
`ca.pem`         | CA certificate. Must be copied to all backend servers and systems running Sensu agent. |
`ca-key.pem`     | CA certificate private key. |
`ca-config.json` | CA configuration, used in combination with CA certificate and private key to generate server certificates. |

Make sure to copy the `ca.pem` file to each agent and backend.
The sensu-agent and sensu-backend use the CA certificate to validate server certificates at connection time.

### Generate backend cluster certificates

Now that you've generated a CA, you will use it to generate certificates and keys for each backend server (etcd peer).
Before you generate the certificates, you'll need some information about each backend server: the IP addresses and hostnames to use in backend and agent communications.

During initial configuration of a cluster of Sensu backends, you must describe every member of the cluster with a URL passed as the value of the `etcd-initial-cluster` parameter.
In issuing certificates for cluster members, the IP address or hostname used in these URLs must be represented in either the Common Name (CN) or Subject Alternative Name (SAN) records in the certificate.

This guide assumes a scenario with three backend members that are reachable via a `10.0.0.x` IP address, a fully qualified name (e.g. `backend-1.example.com`), and an unqualified name (e.g. `backend-1`):

Unqualified name | IP address | Fully qualified domain name (FQDN) | Additional names     |
-----------------|------------|------------------------------------|----------------------|
backend-1        | 10.0.0.1   | backend-1.example.com              | localhost, 127.0.0.1 |
backend-2        | 10.0.0.2   | backend-2.example.com              | localhost, 127.0.0.1 |
backend-3        | 10.0.0.3   | backend-3.example.com              | localhost, 127.0.0.1 |

Use these name and address details to create two `*.pem` files and one `*.csr` file for each backend:

{{< highlight shell >}}

# Value provided for the NAME variable will be used to populate the certificate's CN record

# Values provided in the ADDRESS variable will be used to populate the certificate's SAN records

# For systems with multiple hostnames and IP addresses, add each to the comma-delimited value of the ADDRESS variable
export ADDRESS=localhost,127.0.0.1,10.0.0.1,backend-1
export NAME=backend-1.example.com
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -profile="backend" -ca=ca.pem -ca-key=ca-key.pem -hostname="$ADDRESS" - | cfssljson -bare $NAME

export ADDRESS=localhost,127.0.0.1,10.0.0.2,backend-2
export NAME=backend-2.example.com
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -profile="backend" -ca=ca.pem -ca-key=ca-key.pem -hostname="$ADDRESS" - | cfssljson -bare $NAME

export ADDRESS=localhost,127.0.0.1,10.0.0.3,backend-3
export NAME=backend-3.example.com
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -profile="backend" -ca=ca.pem -ca-key=ca-key.pem -hostname="$ADDRESS" - | cfssljson -bare $NAME
{{< /highlight >}}

<a name="copy-backend-pem"></a>

You should now have a set of files for each backend, where the `N` is the numeric element of the backend hostname:

filename               | description                  | required on backend?|
-----------------------|------------------------------|---------------------|
`ca.pem`               | Trusted CA certificate.      | {{< check >}}       |
`backend-N.pem`        | Backend server certificate.  | {{< check >}}       |
`backend-N-key.pem`    | Backend server private key.  | {{< check >}}       |
`backend-N.csr`        | Certificate signing request. |                     |

Make sure to copy all backend PEM files and `ca-pem` to the corresponding backend system:

{{< highlight shell >}}

# Directory listing of /etc/sensu/pki/ on backend-1:
/etc/sensu/pki/
├── backend-1-key.pem
├── backend-1.pem
└── ca.pem
{{< /highlight >}}

These files should be accessible only by the `sensu` user.
Use chown and chmod to make it so:

{{< highlight shell >}}
chown sensu /etc/sensu/pki/*.pem
chmod 600 /etc/sensu/pki/*.pem
{{< /highlight >}}

### Generate agent certificate

Now you will generate a certificate that agents can use to connect to the Sensu backend.
Sensu's commerical distribution offers support for authenticating agents via TLS certificates instead of a username and password.

For this certificate, you only need to specify a CN (here, `client`) &emdash; you don't need to specify an address.
You will create the files `client-key.pem`, `client.csr`, and `client.pem`:

{{< highlight shell >}}
export NAME=client
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -ca=ca.pem -ca-key=ca-key.pem -hostname="" -profile=client - | cfssljson -bare $NAME
{{< /highlight >}}

## Next step: Secure Sensu

Before you move on, make sure you have copied the certificates and keys to each of the backend and agent systems you are securing:

- [Copy the Certificate Authority (CA) certificate file][11], `ca.pem`, to each agent and backend.
- [Copy all backend PEM files][12] to their corresponding backend systems.

Then follow our [Secure Sensu][1] guide to make your Sensu installation production-ready.


[1]: ../../guides/securing-sensu/
[2]: ../../guides/securing-sensu/#secure-etcd-peer-communication
[3]: ../../guides/securing-sensu/#secure-the-api-and-dashboard
[4]: ../../guides/securing-sensu/#secure-sensu-agent-to-server-communication
[5]: ../../guides/securing-sensu/#sensu-agent-tls-authentication
[6]: https://github.com/cloudflare/cfssl
[7]: https://etcd.io/docs/v3.4.0/op-guide/security/
[8]: https://en.wikipedia.org/wiki/Public_key_infrastructure
[9]: ../../guides/secrets-management/
[10]: ../../installation/install-sensu/
[11]: #copy-ca-pem
[12]: #copy-backend-pem
