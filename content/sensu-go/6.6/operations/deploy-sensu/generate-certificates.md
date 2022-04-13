---
title: "Generate certificates for your Sensu installation"
linkTitle: "Generate Certificates"
guide_title: "Generate certificates for your Sensu installation"
type: "guide"
description: "After you install Sensu, learn how to secure it with public key infrastructure (PKI). Set up PKI and generate the certificates you need to secure Sensu."
weight: 50
version: "6.6"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.6:
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

To use TLS, you must either possess existing [public key infrastructure (PKI)][8] or generate your own Certificate Authority (CA) for issuing certificates.

This guide describes how to set up a minimal CA and generate the certificates you need to secure Sensu communications for a clustered backend and agents.

If your organization has existing PKI for certificate issuance, you can adapt the suggestions in this guide to your organization's PKI.
Recommended practices for deploying and maintaining production PKI can be complex and case-specific, so they are not included in the scope of this guide.

## Issue certificates

Use a CA certificate and key to generate certificates and keys to use with Sensu backends and agents.

This guide uses the [CloudFlare cfssl][6] toolkit to generate a CA and self-signed certificates from that CA.
The examples assume that you'll install the certificates and keys in the `/etc/sensu/tls` directory.

### Install TLS

The [CloudFlare cfssl][6] toolkit is released as a collection of command-line tools.

These tools only need to be installed on one system to generate your CA and issue certificates.

You may install the toolkit on your laptop or workstation and store the files there for safekeeping or install the toolkit on one of the systems where you'll run the Sensu backend.
The example in this guide installs cfssl on a Linux system.

1. Download the cfssl executable:
{{< code shell >}}
sudo curl -L https://github.com/cloudflare/cfssl/releases/download/v1.4.1/cfssl_1.4.1_linux_amd64 -o /usr/local/bin/cfssl
{{< /code >}}

2. Download the cfssljson executable:
{{< code shell >}}
sudo curl -L https://github.com/cloudflare/cfssl/releases/download/v1.4.1/cfssljson_1.4.1_linux_amd64 -o /usr/local/bin/cfssljson
{{< /code >}}

3. Install the cfssl and cfssljson executables in /usr/local/bin:
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

Follow these steps to create a CA with cfssl and cfssljson:

1. Create `/etc/sensu/tls` (which does not exist by default):
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
{{% notice note %}}
**NOTE**: We suggest a 6-month expiry duration for security, but you can use any duration you prefer when you define the `expiry` attribute value in the signing parameters.
{{% /notice %}}

<a id="copy-ca-pem"></a>

You should now have a directory at `/etc/sensu/tls` that contains the following files:

 filename        | description |
-----------------|-------------|
`ca.pem`         | CA root certificate. Required for all systems running the Sensu backend or agent. The agent and backend use `ca.pem` to validate server certificates at connection time. |
`ca-key.pem`     | CA root certificate private key. |
`ca-config.json` | CA signing parameters and profiles. Not used by Sensu. |
`ca.csr`         | Certificate signing request for the CA root certificate. Not used by Sensu. |


### Generate backend cluster certificates

Now that you've generated a CA, you will use it to generate certificates and keys for each backend server (etcd peer).

For each backend server, document the IP addresses and hostnames to use in backend and agent communications.
During initial configuration of a cluster of Sensu backends, you must describe every member of the cluster with a URL passed as the value of the `etcd-initial-cluster` parameter.

In issuing certificates for cluster members, the IP address or hostname used in these URLs must be represented in either the Common Name (CN) or Subject Alternative Name (SAN) records in the certificate.

{{% notice note %}}
**NOTE**: Sensu Go 6.4.0 upgraded the Go version from 1.13.15 to 1.16.5.
As of [Go 1.15](https://golang.google.cn/doc/go1.15#commonname), certificates must include their CN as an SAN field.
Follow the instructions in this guide to make sure your certificates' SAN fields include their CNs.
{{% /notice %}}

<a id="example-backends"></a>

This guide assumes a scenario with three backend members that are reachable via a `10.0.0.x` IP address, a fully qualified name (for example, `backend-1.example.com`), and an unqualified name (for example, `backend-1`):

Unqualified<br>name | IP address | Fully qualified<br>domain name<br>(FQDN) | Additional<br>names |
-----------------|------------|------------------------------------|----------------------|
backend-1        | 10.0.0.1   | backend-1.example.com              | localhost, 127.0.0.1 |
backend-2        | 10.0.0.2   | backend-2.example.com              | localhost, 127.0.0.1 |
backend-3        | 10.0.0.3   | backend-3.example.com              | localhost, 127.0.0.1 |

The additional names for localhost and 127.0.0.1 are added here for convenience and are not strictly required.

Use these name and address details to create two `*.pem` files and one `*.csr` file for each backend.

- The values provided for the ADDRESS variable will be used to populate the certificate's SAN records.
For systems with multiple hostnames and IP addresses, add each to the comma-delimited value of the ADDRESS variable.
- The value provided for the NAME variable will be used to populate the certificate's CN record.
It will also be used in the names for the `*.pem` and `*.csr` files.

For example, to create certificate and key files for the [three backends][18]:

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

The `/etc/sensu/tls` directory should now include three files for each backend, in addition to the [four original CA files][11]:

filename               | description                  | required on backend?|
-----------------------|------------------------------|---------------------|
`backend-*.pem`        | Backend server certificate   | {{< check >}}       |
`backend-*-key.pem`    | Backend server private key   | {{< check >}}       |
`backend-*.csr`        | Certificate signing request  |                     |

In our example with [three backends][18], the directory listing for `/etc/sensu/tls` would include 13 files:

{{< code shell >}}
/etc/sensu/tls/
├── backend-1.example.com-key.pem
├── backend-1.example.com.pem
├── backend-1.example.com.csr
├── backend-2-key.example.com.pem
├── backend-2.example.com.pem
├── backend-2.example.com.csr
├── backend-3-key.example.com.pem
├── backend-3.example.com.pem
├── backend-3.example.com.csr
├── ca.pem
├── ca-key.pem
├── ca-config.json
└── ca.csr
{{< /code >}}

{{% notice warning %}}
**WARNING**: If you are **not** setting up [agent mTLS authentication](../secure-sensu/#optional-configure-sensu-agent-mtls-authentication), delete the `ca-key.pem` file from the `/etc/sensu/tls` directory.
The `ca-key.pem` file is sensitive information and is no longer needed unless you are setting up agent mTLS authentication.
{{% /notice %}}

To make sure the backend files in `/etc/sensu/tls` are accessible only by the `sensu` user, run:

{{< code shell >}}
chown sensu /etc/sensu/tls/*.pem
{{< /code >}}

And:

{{< code shell >}}
chmod 400 /etc/sensu/tls/*.pem
{{< /code >}}

### Generate agent certificate

{{% notice note %}}
**NOTE**: Agent certificates are only required for [agent mTLS authentication](../secure-sensu/#optional-configure-sensu-agent-mtls-authentication).
If you are not configuring mTLS for Sensu agents, you do not need to generate agent certificates.
{{% /notice %}}

Now you will generate a certificate that agents can use to connect to the Sensu backend.
Sensu's commercial distribution offers support for authenticating agents via TLS certificates instead of a username and password.

For this certificate, you only need to specify a CN (here, `agent`) &mdash; you don't need to specify an address.
You will create the files `agent.pem`, `agent-key.pem`, and `agent.csr`:

{{< code shell >}}
export NAME=agent
echo '{"CN":"'$NAME'","hosts":[""],"key":{"algo":"rsa","size":2048}}' | cfssl gencert -config=ca-config.json -ca=ca.pem -ca-key=ca-key.pem -hostname="" -profile=agent - | cfssljson -bare $NAME
{{< /code >}}

<a id="copy-agent-pem"></a>

The `/etc/sensu/tls` directory should now include a set of files for use by Sensu agents:

filename           | description                  | required on agent?  |
-------------------|------------------------------|---------------------|
`agent.pem`        | Agent certificate            | {{< check >}}       |
`agent-key.pem`    | Agent private key            | {{< check >}}       |
`agent.csr`        | Certificate signing request  |                     |

{{% notice warning %}}
**WARNING**: Before you continue, delete the `ca-key.pem` file from the `/etc/sensu/tls` directory.
This file is sensitive information and is no longer needed.
{{% /notice %}}

To continue the example with [three backends][18], after deleting the `ca-key.pem` file, the directory listing for `/etc/sensu/tls` will include 15 files:

{{< code shell >}}
/etc/sensu/tls/
├── agent-key.pem
├── agent.pem
├── agent.csr
├── backend-1.example.com-key.pem
├── backend-1.example.com.pem
├── backend-1.example.com.csr
├── backend-2-key.example.com.pem
├── backend-2.example.com.pem
├── backend-2.example.com.csr
├── backend-3-key.example.com.pem
├── backend-3.example.com.pem
├── backend-3.example.com.csr
├── ca.pem
├── ca-config.json
└── ca.csr
{{< /code >}}

To make sure the agent `/etc/sensu/tls` files are accessible only by the `sensu` user, run:

{{< code shell >}}
chown sensu /etc/sensu/tls/*.pem
{{< /code >}}

And:

{{< code shell >}}
chmod 400 /etc/sensu/tls/*.pem
{{< /code >}}

## Install CA certificates

Before you install the CA certificates, **make sure that the `/etc/sensu/tls` directory does not contain the `ca-key.pem` file**.
The `ca-key.pem` file is sensitive information that is no longer needed, so you should delete it.

Also, make sure that `/etc/sensu/tls` includes the [CA root certificate and key][11], as well as a certificate and key for each [backend][12] and [agent][13] you are securing.

We recommend installing the CA root certificate in the trust store of both your Sensu systems and those systems used by operators to manage Sensu. 
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

{{< code shell "Windows" >}}
Press Windows+R to open the Run dialog.
Type "MMC" (without quotation marks) in the Run dialog and press Enter to open the MMC console.
In the MMC console, expand the Certificates (Local Computer) node and navigate to Trusted Root Certification Authorities > Certificates.
Right-click the Trusted Root Certification Authorities > Certificates folder and select All Tasks > Import to open the Certificate Import wizard.
In the Certificate Import wizard, click Next and browse to the location where the root CA certificate is stored.
Select the root CA certificate file and click Open.
Click Next, click Next, and click Finish.
{{< /code >}}

{{< /language-toggle >}}

## Renew self-generated certificates

To keep your Sensu deployment running smoothly, renew your self-generated certificates before they expire.
Depending on how your certificates are configured, one backend certificate may expire before the others or all three backend certificates may expire at the same time.
The agent certificate also expires.

This section explains how to find certificate expiration dates, confirm whether certificates have already expired, and renew certificates.

### Find certificate expiration dates

Use this check to find certificate expiration dates so you can renew certificates before they expire and avoid observability interruptions.

Before you run the check, replace `<cert-name>.pem` in the command with the name of the certificate you want to check (for example, `backend-1.example.com.pem`).

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: expired_certs
spec:
  command: openssl x509 -noout -enddate -in <cert-name>.pem
  subscriptions:
  - system
  publish: true
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "expired_certs"
  },
  "spec": {
    "command": "openssl x509 -noout -enddate -in <cert-name>.pem",
    "subscriptions": [
      "system"
    ],
    "publish": true
  }
}
{{< /code >}}

{{< /language-toggle >}}

The check output will be in the format `notAfter=Month  Day HH:MM:SS Year Timezone`.
For example:

{{< code shell >}}
notAfter=Jul  3 22:23:50 2021 GMT
{{< /code >}}

Add a [handler][17] to send the check output as a notification or to a log file.

### Identify expired certificates

The following `sensuctl cluster health` response indicates that one backend certificate is expired:

{{< code shell >}}
Error: GET "/health": Get https://localhost:8080/health?timeout=3: x509: certificate has expired or is not yet valid
{{< /code >}}

The log for the expired backend will be similar to this example:

{{< code shell >}}
backend-1.example.com | {"component":"etcd","level":"warning","msg":"health check for peer a95ca1cdb0b1fcc3 could not connect: remote error: tls: bad certificate (prober \"ROUND_TRIPPER_RAFT_MESSAGE\")","pkg":"rafthttp","time":"2021-06-22T20:40:54Z"}
backend-1.example.com | {"component":"etcd","level":"warning","msg":"health check for peer a95ca1cdb0b1fcc3 could not connect: remote error: tls: bad certificate (prober \"ROUND_TRIPPER_RAFT_MESSAGE\")","pkg":"rafthttp","time":"2021-06-22T20:40:54Z"}
{{< /code >}}

If you restart the cluster with one expired backend certificate, the `sensuctl cluster health` response will include an error:

{{< code shell >}}
Error: GET "/health": failed to request new refresh token; client returned 'Post https://localhost:8080/auth/token: EOF'
{{< /code >}}

When all three backend certificates are expired, the log will be similar to this example:

{{< code shell >}}
backend-1.example.com | {"component":"etcd","level":"warning","msg":"health check for peer a95ca1cdb0b1fcc3 could not connect: x509: certificate has expired or is not yet valid (prober \"ROUND_TRIPPER_RAFT_MESSAGE\")","pkg":"rafthttp","time":"2021-06-25T17:49:53Z"}
backend-2.example.com | {"component":"etcd","level":"warning","msg":"health check for peer 4cc36e198efb22e8 could not connect: x509: certificate has expired or is not yet valid (prober \"ROUND_TRIPPER_RAFT_MESSAGE\")","pkg":"rafthttp","time":"2021-06-25T17:49:16Z"}
backend-3.example.com | {"component":"etcd","level":"warning","msg":"health check for peer 8425a7b2d2ee8597 could not connect: x509: certificate has expired or is not yet valid (prober \"ROUND_TRIPPER_RAFT_MESSAGE\")","pkg":"rafthttp","time":"2021-06-25T17:49:16Z"}
{{< /code >}}

If you restart the cluster with three expired backend certificates, the `sensuctl cluster health` response will include an error:

{{< code shell >}}
Error: GET "/health": Get https://127.0.0.1:8080/health?timeout=3: EOF
{{< /code >}}

The following `sensuctl cluster health` response helps confirm that all three backend certificates are expired, together with the log warning and restart error examples:

{{< code shell >}}
=== Etcd Cluster ID: 45c04eab9efc0d11
         ID             Name                            Error             Healthy  
 ────────────────── ──────────────────────── ─────────────────────────── ───────── 
  a95ca1cdb0b1fcc3   backend-1.example.com    context deadline exceeded   false    
  8425a7b2d2ee8597   backend-2.example.com    context deadline exceeded   false    
  4cc36e198efb22e8   backend-3.example.com    context deadline exceeded   false
{{< /code >}}

An expired agent certificate does not cause any errors or log messages to indicate the expiration.
Use the [certificate expiration check][16] to find the agent certificate expiration date.

### Renew certificates

To renew your certificates, whether they expired or not, follow the steps to [create a CA][7], [generate backend certificates][14], or [generate an agent certificate][15].
The new certificate will override the existing certificate.

After you save the new certificates, restart each backend:

{{< code shell >}}
sudo systemctl start sensu-backend
{{< /code >}}

## Next step: Secure Sensu

Now that you have generated the required certificates, follow [Secure Sensu][1] to make your Sensu installation production-ready.


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
[14]: #generate-backend-cluster-certificates
[15]: #generate-agent-certificate
[16]: #find-certificate-expiration-dates
[17]: ../../../observability-pipeline/observe-process/handlers/
[18]: #example-backends
