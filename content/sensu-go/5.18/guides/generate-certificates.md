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

- [Public Key Infrastructure](#public-key-infrastructure-pki)
- [Issuing Certificates](#issuing-certificates)
    - [Install cfssl toolkit](#install-cfssl-toolkit)
    - [Create a Certificate Authority (CA)](#create-a-certificate-authority-ca)
    - [Generate backend cluster certificates](#generate-backend-cluster-certificates)
    - [Generate agent certificate](#generate-agent-certificate)
- [Next steps](#next-steps)

If you are deploying Sensu for use outside of a local development environment, you should secure it using transport layer security (TLS).

TLS uses encryption to provide security for communication between Sensu backends and agents, as well as communication between human operators and the Sensu backend, e.g. web UI access or sensuctl access.

Reconfiguring an existing Sensu backend cluster from cleartext to TLS is a non-trivial exercise, so we strongly recommend that you configure TLS for backend clusters from the very beginning.

TLS is a prerequisite for using certain commercial features like Secrets and Mutual TLS Authentication.

This guide assumes you've already installed Sensu on three backend nodes which are to be clustered together using TLS certificates for transport security, and one or more agents which will be configured for mutual TLS authentication (mTLS).

## Public Key Infrastructure (PKI)

Use of TLS often requires provisioning [public key infrastructure (PKI)][8] for issuing certificates. 

This guide describes how to set up a minimal PKI and generate the certificates you need to secure Sensu communications for a clustered backend and agents.
If your organization has existing PKI for certificate issuance, you are encouraged to adapt the suggestions in this guide to your organization's PKI.

As recommended practices for deploying and maintaining production PKI can result in significant complexity, those considerations are considered outside the scope of this guide. TODO: Add a link here for recommended PKI practices.

## Issuing Certificates

Certificate Authorities (CAs) are a common component of any PKI. A CA certificate and key are used to generate certificates and keys for use with Sensu backends and agents.

This example uses the [CloudFlare cfssl][6] toolkit to generate a CA and self-signed certificates from that CA.

### Install TLS 

The [cfssl][6] toolkit is released as a collection of command-line tools. These tools need only be installed on one system to generate your CA and issue certificates. You may choose to install the toolkit on your laptop or workstation and store the files there for safe keeping, or to install the toolkit on one of the systems where you'll run the Sensu backend.

In this example you'll walk through installing cfssl on a Linux system, with the requirement that certain certificates and keys will need to be copied to each of the backend and agent systems you are securing. This guide assumes that you'll install these certificates in the `/etc/sensu/pki` directory on each system.

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

Create a Certificate Authority (CA) using cfssl and cfssljson.

{{< highlight shell >}}
mkdir -p /etc/sensu/pki
cd /etc/sensu/pki
echo '{"CN":"Sensu Test CA","key":{"algo":"rsa","size":2048}}' | cfssl gencert -initca - | cfssljson -bare ca -
echo '{"signing":{"default":{"expiry":"17520h","usages":["signing","key encipherment","client auth"]},"profiles":{"backend":{"usages":["signing","key encipherment","server auth"],"expiry":"4320h"},"agent":{"usages":["signing","key encipherment","client auth"],"expiry":"4320h"}}}}' > ca-config.json
{{< /highlight >}}

You now have a directory at `/etc/sensu/pki` containing the following files:

 filename        | description |
-----------------|-------------|
`ca.csr`         | Certificate signing request for the CA certificate |
`ca.pem`         | CA certificate. Must be copied to all backend servers and systems running Sensu agent. |
`ca-key.pem`     | CA certificate private key. |
`ca-config.json` | CA configuration, used in combination with CA certificate and private key to generate server certificates. |

You will need to copy `ca.pem` file will be copied to each agent and backend. The CA certificate is used by sensu-agent and sensu-backend to validate server certificates at connection time.

### Generate backend cluster certificates

Now that you've generated a CA, you will use it to generate certificates and keys for each backend server (etcd peer). 
Before generating the certificates, you'll need some information about each backend server -- specifically the IP address(es) and hostname(s) which will be used in backend and agent communications.

During initial configuration of a cluster of Sensu backends, every member of the cluster must be described with a URL passed as the value of the `etcd-initial-cluster` parameter. In issuing certificates for cluster members, the IP address or host name used in these URLs must be represented in either the Common Name (CN) or Subject Alternative Name (SAN) records in the certificate.

This guide assumes a scenario with three backend members which are reachable via a 10.0.0.x IP address, a fully qualified name (e.g. `backend-1.example.com`) and an unqualified name, e.g. `backend-1`:

Unqualified name | IP address | Fully qualified domain name (FQDN) | Additional names     |
-----------------|------------|------------------------------------|----------------------|
backend-1        | 10.0.0.1   | backend-1.example.com              | localhost, 127.0.0.1 |
backend-2        | 10.0.0.2   | backend-2.example.com              | localhost, 127.0.0.1 |
backend-3        | 10.0.0.3   | backend-3.example.com              | localhost, 127.0.0.1 |

Using these name and address details, you will create two `*.pem` files and one `*.csr` file for each backend:

{{< highlight shell >}}

# Value provided for the NAME variable will be used to populate the certificate's CN record

# Values provided in the ADDRESS variable will be used to populate the certificate's SAN records

# For systems with multiple hostnames and IP addresses, add each to the comma delimited value of the ADDRESS variable
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

You will now have a set of files for each backend, where the `N` is the numeric element of the backend hostname:

filename               | description                  | required on backend?|
-----------------------|------------------------------|---------------------|
`ca.pem`               | Trusted CA certificate.      | {{< check >}}       |
`backend-N.pem`        | Backend server certificate.  | {{< check >}}       |
`backend-N-key.pem`    | Backend server private key.  | {{< check >}}       |
`backend-N.csr`        | Certificate signing request. |                     |

As mentioned previously, backend PEM files need to be copied to the corresponding backend system, and all systems should receive a copy of ca.pem as well:

{{< highlight shell >}}

# Directory listing of /etc/sensu/pki/ on backend-1:
/etc/sensu/pki/
├── backend-1-key.pem
├── backend-1.pem
└── ca.pem
{{< /highlight >}}

These files should be accessible only by the `sensu` user. Use chown and chmod to make it so:

{{< highlight shell >}}
chown sensu /etc/sensu/pki/*.pem
chmod 600 /etc/sensu/pki/*.pem
{{< /highlight >}}

### Generate agent certificate

Third, generate a certificate that agents can use to connect to the Sensu backend.
Sensu's commerical distribution offers support for authenticating agents via TLS certificates instead of a username and password.

For this certificate, you only need to specify a CN (here, `client`) &emdash; you don't need to specify an address.
You will create the files `client-key.pem`, `client.csr`, and `client.pem`:

{{< highlight shell >}}
export NAME=client
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -ca=ca.pem -ca-key=ca-key.pem -hostname="" -profile=client - | cfssljson -bare $NAME
{{< /highlight >}}

## Next steps

Now that your backends are deployed and secured according to best practices, read [Secure Sensu][1] to make Sensu production-ready:

- Secure [etcd communication][2], the [Sensu API and dashboard][3], and [agent-to-server communication][4].
- [Use TLS with Sensu][5].
- See [etcd's transport security documentation][7] for further details on etcd's transport security.


[1]: ../../guides/securing-sensu/
[2]: ../../guides/securing-sensu/#secure-etcd-peer-communication
[3]: ../../guides/securing-sensu/#secure-the-api-and-dashboard
[4]: ../../guides/securing-sensu/#secure-sensu-agent-to-server-communication
[5]: ../../guides/securing-sensu/#sensu-agent-tls-authentication
[6]: https://github.com/cloudflare/cfssl
[7]: https://etcd.io/docs/v3.4.0/op-guide/security/
[8]: https://en.wikipedia.org/wiki/Public_key_infrastructure
