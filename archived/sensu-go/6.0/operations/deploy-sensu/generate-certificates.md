---
title: "Generate certificates for your Sensu installation"
linkTitle: "Generate Certificates"
guide_title: "Generate certificates for your Sensu installation"
type: "guide"
description: "After you install Sensu, learn how to secure it with public key infrastructure (PKI). Set up PKI and generate the certificates you need to secure Sensu."
weight: 50
version: "6.0"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.0:
    parent: deploy-sensu
---

This guide explains how to generate the certificates you need to secure a Sensu cluster and its agents.

When deploying Sensu for use outside of a local development environment, you should secure it using transport layer security (TLS).

TLS uses encryption to provide security for communication between Sensu backends and agents as well as communication between human operators and the Sensu backend, such as web UI or sensuctl access.

Because reconfiguring an existing Sensu deployment from cleartext to TLS can be time-consuming, we recommend that you configure TLS for your backend from the very beginning.

TLS is also required to use some of Sensu's commercial features, like [secrets management][9] and [mutual TLS authentication (mTLS)][5].

## Prerequisites

To use this guide, you must have already [installed Sensu][10] on:

- One backend system or three backend systems that you plan to cluster together.
- One or more agents.

## Public key infrastructure (PKI)

To use TLS, you must either posses existing [public key infrastructure (PKI)][8] or generate your own Certificate Authority (CA) for issuing certificates.

This guide describes how to set up a minimal CA and generate the certificates you need to secure Sensu communications for a clustered backend and agents.

If your organization has existing PKI for certificate issuance, you can adapt the suggestions in this guide to your organization's PKI.

Recommended practices for deploying and maintaining production PKI can be complex and case-specific, so they are not included in the scope of this guide.

## Issue certificates

Use a CA certificate and key to generate certificates and keys to use with Sensu backends and agents.

This example uses the [CloudFlare cfssl][6] toolkit to generate a CA and self-signed certificates from that CA.

### Install TLS

The [cfssl][6] toolkit is released as a collection of command-line tools.

These tools only need to be installed on one system to generate your CA and issue certificates.

You may install the toolkit on your laptop or workstation and store the files there for safekeeping or install the toolkit on one of the systems where you'll run the Sensu backend.

In this example you'll walk through installing cfssl on a Linux system, which requires copying certain certificates and keys to each of the backend and agent systems you are securing.

This guide assumes that you'll install these certificates in the `/etc/sensu/tls` directory on each backend and agent system.

1. Download the cfssl executable:
{{< code shell >}}
sudo curl -L https://github.com/cloudflare/cfssl/releases/download/v1.4.1/cfssl_1.4.1_linux_amd64 -o /usr/local/bin/cfssl
{{< /code >}}

2. Download the cfssljson executable:
{{< code shell >}}
sudo curl -L https://github.com/cloudflare/cfssl/releases/download/v1.4.1/cfssljson_1.4.1_linux_amd64 -o /usr/local/bin/cfssljson
{{< /code >}}

3. Install the cfssl and cfssljson executables in /usr/local/bin::
{{< code shell >}}
sudo chmod +x /usr/local/bin/cfssl*
{{< /code >}}

4. Verify the cfssl executable is version 1.4.1 and runtime go1.12.12:
{{< code shell >}}
cfssl version
{{< /code >}}

5. Verify the cfssljson executable is version 1.4.1 and runtime go1.12.12:
{{< code shell >}}
cfssljson -version
{{< /code >}}

### Create a Certificate Authority (CA)

Follow these steps to create a CA with cfssl and cfssljson for each backend and agent system:

1. Create /etc/sensu/tls (which does not exist by default):
{{< code shell >}}
mkdir -p /etc/sensu/tls
{{< /code >}}

2. Navigate to the new /etc/sensu/tls directory:
{{< code shell >}}
cd /etc/sensu/tls
{{< /code >}}

3. Create the CA:
{{< code shell >}}
echo '{"CN":"Sensu Test CA","key":{"algo":"rsa","size":2048}}' | cfssl gencert -initca - | cfssljson -bare ca -
{{< /code >}}

4. Define signing parameters and profiles (the agent profile provides the "client auth" usage required for mTLS):
{{< code shell >}}
echo '{"signing":{"default":{"expiry":"17520h","usages":["signing","key encipherment","client auth"]},"profiles":{"backend":{"usages":["signing","key encipherment","server auth","client auth"],"expiry":"4320h"},"agent":{"usages":["signing","key encipherment","client auth"],"expiry":"4320h"}}}}' > ca-config.json
{{< /code >}}

<a id="copy-ca-pem"></a>

You should now have a directory for each backend and agent at `/etc/sensu/tls` that contains the following files:

 filename        | description |
-----------------|-------------|
`ca.pem`         | CA root certificate. Must be copied to all systems running Sensu backend or agent. |
`ca-key.pem`     | CA root certificate private key. |
`ca-config.json` | CA signing parameters and profiles. Not used by Sensu. |
`ca.csr`         | Certificate signing request for the CA root certificate. Not used by Sensu. |

The Sensu agent and Sensu backend use the CA root certificate to validate server certificates at connection time.

### Generate backend cluster certificates

Now that you've generated a CA, you will use it to generate certificates and keys for each backend server (etcd peer).

For each backend server you'll need to document the IP addresses and hostnames to use in backend and agent communications.

During initial configuration of a cluster of Sensu backends, you must describe every member of the cluster with a URL passed as the value of the `etcd-initial-cluster` parameter.

In issuing certificates for cluster members, the IP address or hostname used in these URLs must be represented in either the Common Name (CN) or Subject Alternative Name (SAN) records in the certificate.

This guide assumes a scenario with three backend members that are reachable via a `10.0.0.x` IP address, a fully qualified name (for example, `backend-1.example.com`), and an unqualified name (for example, `backend-1`):

Unqualified<br>name | IP address | Fully qualified<br>domain name<br>(FQDN) | Additional<br>names |
-----------------|------------|------------------------------------|----------------------|
backend-1        | 10.0.0.1   | backend-1.example.com              | localhost, 127.0.0.1 |
backend-2        | 10.0.0.2   | backend-2.example.com              | localhost, 127.0.0.1 |
backend-3        | 10.0.0.3   | backend-3.example.com              | localhost, 127.0.0.1 |

Note that the additional names for localhost and 127.0.0.1 are added here for convenience and are not strictly required.

Use these name and address details to create two `*.pem` files and one `*.csr` file for each backend.

- The values provided for the ADDRESS variable will be used to populate the certificate's SAN records.
For systems with multiple hostnames and IP addresses, add each to the comma-delimited value of the ADDRESS variable.
- The value provided for the NAME variable will be used to populate the certificate's CN record.

**backend-1**

{{< code shell >}}
export ADDRESS=localhost,127.0.0.1,10.0.0.1,backend-1
export NAME=backend-1.example.com
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -profile="backend" -ca=ca.pem -ca-key=ca-key.pem -hostname="$ADDRESS" - | cfssljson -bare $NAME
{{< /code >}}

**backend-2**

{{< code shell >}}
export ADDRESS=localhost,127.0.0.1,10.0.0.2,backend-2
export NAME=backend-2.example.com
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -profile="backend" -ca=ca.pem -ca-key=ca-key.pem -hostname="$ADDRESS" - | cfssljson -bare $NAME
{{< /code >}}

**backend-3**

{{< code shell >}}
export ADDRESS=localhost,127.0.0.1,10.0.0.3,backend-3
export NAME=backend-3.example.com
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -profile="backend" -ca=ca.pem -ca-key=ca-key.pem -hostname="$ADDRESS" - | cfssljson -bare $NAME
{{< /code >}}

<a id="copy-backend-pem"></a>

You should now have this set of files for each backend:

filename               | description                  | required on backend?|
-----------------------|------------------------------|---------------------|
`backend-*.pem`        | Backend server certificate   | {{< check >}}       |
`backend-*-key.pem`    | Backend server private key   | {{< check >}}       |
`backend-*.csr`        | Certificate signing request  |                     |

Make sure to copy all backend PEM files to the corresponding backend system.
For example, the directory listing of /etc/sensu/tls on backend-1 should include:

{{< code shell >}}
/etc/sensu/tls/
├── backend-1-key.pem
├── backend-1.pem
├── ca.pem
└── ca-key.pem
{{< /code >}}

To make sure these files are accessible only by the `sensu` user, run:

{{< code shell >}}
chown sensu /etc/sensu/tls/*.pem
{{< /code >}}

And:

{{< code shell >}}
chmod 400 /etc/sensu/tls/*.pem
{{< /code >}}

### Generate agent certificate

Now you will generate a certificate that agents can use to connect to the Sensu backend.

Sensu's commercial distribution offers support for authenticating agents via TLS certificates instead of a username and password.

For this certificate, you only need to specify a CN (here, `agent`) &mdash; you don't need to specify an address.
You will create the files `agent.pem`, `agent-key.pem`, and `agent.csr`:

{{< code shell >}}
export NAME=agent
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -ca=ca.pem -ca-key=ca-key.pem -hostname="" -profile=agent - | cfssljson -bare $NAME
{{< /code >}}

<a id="copy-agent-pem"></a>

You should now have a set of files for use by Sensu agents:

filename           | description                  | required on agent?  |
-------------------|------------------------------|---------------------|
`agent.pem`        | Agent certificate            | {{< check >}}       |
`agent-key.pem`    | Agent private key            | {{< check >}}       |
`agent.csr`        | Certificate signing request  |                     |

Make sure to copy all agent PEM files to all agent systems.
To continue the example, the directory listing of /etc/sensu/tls on each agent should now include:

{{< code shell >}}
/etc/sensu/tls/
├── agent-key.pem
├── agent.pem
├── ca-key.pem
└── ca.pem
{{< /code >}}

To make sure these files are accessible only by the `sensu` user, run:

{{< code shell >}}
chown sensu /etc/sensu/tls/*.pem
{{< /code >}}

And:

{{< code shell >}}
chmod 400 /etc/sensu/tls/*.pem
{{< /code >}}

## Install CA certificates

Before you move on, make sure you have copied the certificates and keys to each of the backend and agent systems you are securing:

- [Copy the Certificate Authority (CA) root certificate file][11], `ca.pem`, to each agent and backend.
- [Copy all backend PEM files][12] to their corresponding backend systems.
- [Copy all agent PEM files][13] to each agent system.

We also recommend installing the CA root certificate in the trust store of both your Sensu systems and those systems used by operators to manage Sensu. 

Installing the CA certificate in the trust store for these systems makes it easier to connect via web UI or sensuctl without being prompted to accept certificates signed by your self-generated CA.

{{< language-toggle >}}
{{< code shell "Ubuntu/Debian" >}}
chmod 644 /etc/sensu/tls/ca.pem
chown root /etc/sensu/tls/ca.pem
sudo apt-get install ca-certificates -y
sudo ln -sfv /etc/sensu/tls/ca.pem /usr/local/share/ca-certificates/sensu-ca.crt
sudo update-ca-certificates
{{< /code >}}

{{< code shell "RHEL/CentOS" >}}
chmod 644 /etc/sensu/tls/ca.pem
chown root /etc/sensu/tls/ca.pem
sudo yum install -y ca-certificates
sudo update-ca-trust force-enable
sudo ln -s /etc/sensu/tls/ca.pem /etc/pki/ca-trust/source/anchors/sensu-ca.pem
sudo update-ca-trust
{{< /code >}}

{{< code shell "macOS" >}}
Import the root CA certificate on the Mac.
Double-click the root CA certificate to open it in Keychain Access.
The root CA certificate appears in login.
Copy the root CA certificate to System to ensure that it is trusted by all users and local system processes.
Open the root CA certificate, expand Trust, select Use System Defaults, and save your changes.
Reopen the root CA certificate, expand Trust, select Always Trust, and save your changes.
Delete the root CA certificate from login.
{{< /code >}}

{{< code powershell "Windows" >}}
TODO: Document steps for adding CA root to Windows trust store
{{< /code >}}

{{< /language-toggle >}}

## Next step: Secure Sensu

Now that you have generated the required certificates and copied them to the applicable hosts, follow [Secure Sensu][1] to make your Sensu installation production-ready.


[1]: ../secure-sensu/
[2]: ../secure-sensu/#secure-etcd-peer-communication
[3]: ../secure-sensu/#secure-the-sensu-agent-api-http-api-and-web-ui
[4]: ../secure-sensu/#secure-sensu-agent-to-server-communication
[5]: ../secure-sensu/#configure-sensu-agent-mtls-authentication
[6]: https://github.com/cloudflare/cfssl
[7]: #create-a-certificate-authority-ca
[8]: https://en.wikipedia.org/wiki/Public_key_infrastructure
[9]: ../../manage-secrets/secrets-management/
[10]: ../../deploy-sensu/install-sensu/
[11]: #copy-ca-pem
[12]: #copy-backend-pem
[13]: #copy-agent-pem
