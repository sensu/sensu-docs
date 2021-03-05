---
title: "Secure Sensu"
linkTitle: "Secure Sensu"
guide_title: "Secure Sensu"
type: "guide"
description: "As with all software, it’s important to minimize any attack surface exposed by the software. Sensu is no different. Learn about the components that need to be secured and how to secure them."
weight: 60
version: "6.2"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.2:
    parent: deploy-sensu
---

As with any piece of software, it is critical to minimize any attack surface the software exposes.
Sensu is no different.

This reference describes the components you need to secure to make Sensu production-ready, including etcd peer communication, the Sensu API and web UI, and Sensu agent-to-server communication.
It also describes agent mutual transport layer security (mTLS) authentication, which is required for [secrets management][1].

Before you can use this reference, you must [generate the certificates][12] you will need to secure Sensu.

## Etcd peer communication

{{% notice warning %}}
**WARNING**: You must update the default configuration for Sensu's embedded etcd with an explicit, non-default configuration to secure etcd communication in transit.
If you do not properly configure secure etcd communication, your Sensu configuration will be vulnerable to unauthorized manipulation via etcd client connections.
{{% /notice %}}

You can secure etcd peer communication via the configuration at `/etc/sensu/backend.yml`.
Here are the backend store parameters you'll need to configure:

{{< code yml >}}
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

In addition, set `etcd-client-cert-auth` and `etcd-peer-client-cert-auth` to `true` to ensure that etcd only allows connections from clients and peers that present a valid, trusted certificate.
Because etcd does not require authentication by default, you must set `etcd-client-cert-auth` and `etcd-peer-client-cert-auth` to `true` to secure Sensu's embedded etcd datastore against unauthorized access.

## Sensu API and web UI

The Sensu Go Agent API, HTTP API, and web UI use a common stanza in `/etc/sensu/backend.yml` to provide the certificate, key, and CA file needed to provide secure communication.

{{% notice note %}}
**NOTE**: By changing these parameters, the server will communicate using transport layer security (TLS) and expect agents that connect to it to use the WebSocket secure protocol.
For communication to continue, you must complete the configuration in this section **and** in the [Sensu agent-to-server communication](#sensu-agent-to-server-communication) section.
{{% /notice %}}

Here are the backend secure sockets layer (SSL) attributes you'll need to configure.

{{< code yml >}}
cert-file: "/path/to/ssl/cert.pem"
key-file: "/path/to/ssl/key.pem"
trusted-ca-file: "/path/to/trusted-certificate-authorities.pem"
insecure-skip-tls-verify: false
{{< /code >}}

Providing these cert-file and key-file parameters will cause the agent WebSocket API and HTTP API to serve requests over SSL/TLS (https).
As a result, you will also need to specify `https://` schema for the `api-url` parameter for backend API configuration:

{{< code yml >}}
api-url: "https://localhost:8080"
{{< /code >}}

You can also specify a certificate and key for the web UI separately from the API using the `dashboard-cert-file` and `dashboard-key-file` parameters for backend SSL configuration:

{{< code yml >}}
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

## Sensu agent-to-server communication

{{% notice note %}}
**NOTE**: If you change the agent configuration to communicate via WebSocket Secure protocol, the agent will no longer communicate over a plaintext connection.
For communication to continue, you must complete the steps in this section **and** [secure the Sensu API and web UI](#sensu-api-and-web-ui).
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

To view a certificate's CN with openssl, run:

{{< code bash >}}
openssl x509 -in client.pem -text -noout
{{< /code >}}

The response should be similar to this example:

{{< code bash >}}
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

After you create backend and agent certificates, modify the backend configuration:

{{< code yml >}}
agent-auth-cert-file: "/path/to/backend-1.pem"
agent-auth-key-file: "/path/to/backend-1-key.pem"
agent-auth-trusted-ca-file: "/path/to/ca.pem"
{{< /code >}}

Modify the agent configuration also:
{{< code yml >}}
cert-file: "/path/to/agent.pem"
key-file: "/path/to/agent-key.pem"
trusted-ca-file: "/path/to/ca.pem"
{{< /code >}}

You can use use certificates for authentication that are distinct from other communication channels used by Sensu, like etcd or the API.
However, deployments can also use the same certificates and keys for etcd peer and client communication, the HTTP API, and agent authentication without issues.

### Certificate revocation check

The Sensu backend checks certificate revocation list (CRL) and Online Certificate Status Protocol (OCSP) endpoints for agent mTLS, etcd client, and etcd peer connections whose remote sides present X.509 certificates that provide CRL and OCSP revocation information.

## Asset paths and sudo

When check commands on Linux require enhanced permissions to run, it's common to use sudo to escalate the Sensu user’s privileges in a targeted fashion.
If you use dynamic runtime assets for check commands that use sudo, you may need to adjust your default sudo configuration.

{{% notice warning %}}
**WARNING**: Before you use this configuration, consider whether using dynamic runtime assets for privileged checks meets your security requirements.<br><br>
Using dynamic runtime assets with sudo has important security implications.
Rather than making a habit of using sudo for all check commands, carefully evaluate when its appropriate to escalate privileges in this way.
{{% /notice %}}

To give Sensu access to use `sudo -E` for assets installed under `var/cache/sensu/sensu-agent/`, add these lines to your Sensu sudoers file:

{{< code shell >}}
sensu   ALL=(ALL)       NOPASSWD:SETENV: /var/cache/sensu/sensu-agent/**/bin/*
sensu   ALL=(ALL)       NOPASSWD:SETENV: /var/cache/sensu/sensu-agent/**/bin/*.*
{{< /code >}}

In these lines, the `**` will match any directory other than `.` and `..`.
Both lines are necessary because `bin/*.*` won't match Go assets that do not end with file extension `.ext`.

To give Sensu access to use `sudo -E` for diagnostic purposes, add this line to your Sensu sudoers file:

{{< code shell >}}
sensu   ALL=(ALL)       NOPASSWD:SETENV: /usr/bin/echo
{{< /code >}}

With these changes, you can add `sudo -E` as the prefix for all asset-provided commands.
This will ensure that agent-provided environment variables are passed to the sudo environment and provide the expected sensu-agent operation using default agent configuration settings.

{{% notice warning %}}
**WARNING**: With these changes in your sudo configuration, Sensu will run any script installed as an asset under sudo.
With the `sudo -E` prefix added to the command, sudo will use the environment variables meant for the Sensu check environment.
**This opens all installed Sensu assets for privileged operation**.
{{% /notice %}}

If the sudo `secure_path` option is enabled, you must also extend the path to include sensu-agent assets so that you do not have to explicitly use the full path to the asset binary in your sudo calls.
Make this change in your Sensu sudoers file:

{{< code shell >}}
Defaults    secure_path = /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/var/cache/sensu/sensu-agent/**/bin
{{< /code >}}



----------------


Notes:

{{< code shell >}}
## Ex rules thats sensu to run ALL installed asset commands:
## This can be placed in in a file under /etc/sudoers.d/

# sensu   ALL=(ALL)       NOPASSWD:SETENV: /var/cache/sensu/sensu-agent/**/bin/*.*
# sensu   ALL=(ALL)       NOPASSWD:SETENV: /var/cache/sensu/sensu-agent/**/bin/*

## NOTE: the '**' is a posix glob that matches for all subdirectories
## If you would like to target specific directories for tighter security
## you can replace the '**' with specific asset directories
## Asset directories will match the sha512 sum for the specific asset build


## Ex rules that only allow system-profile-linux asset for linux amd64
## the directory name is taken from the sha512 from asset definition (see related yaml file)

# sensu   ALL=(ALL)       NOPASSWD:SETENV: /var/cache/sensu/sensu-agent/29a6e1725f37e533cd9f6a8a17b40ef757ba5ea5dc27701c19a7fb9ac9c2bdf9f684d758d4440f278bb7fc669e52bf02efb3fc6758731f7f3e10617a2fe026cf/bin/*.*
# sensu   ALL=(ALL)       NOPASSWD:SETENV: /var/cache/sensu/sensu-agent/29a6e1725f37e533cd9f6a8a17b40ef757ba5ea5dc27701c19a7fb9ac9c2bdf9f684d758d4440f278bb7fc669e52bf02efb3fc6758731f7f3e10617a2fe026cf/bin/*
{{< /code >}}

### Example check with privileged check command

This example check uses the `sudo -E` prefix to run a privileged check command provided by a dynamic runtime asset, [System Profile Linux][11].

The dynamic runtime asset named `sensu/system-profile-linux` is mapped into the environment variable `SENSU_SYSTEM_PROFILE_LINUX_PATH`.

This check requires sudo rules that allow the Sensu user to run commands under `/var/cache/sensu/sensu-agent/`:

{{< code shell >}}
sensu   ALL=(ALL)       NOPASSWD:SETENV: /var/cache/sensu/sensu-agent/**/bin/*.*
sensu   ALL=(ALL)       NOPASSWD:SETENV: /var/cache/sensu/sensu-agent/**/bin/*
{{< /code >}}

These rules allow Sensu to run **all** installed asset commands.

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: sudo_example
spec:
  check_hooks: null
    # Use the asset specific path envvar to prefix the command instead of editting sudo secure_path  
  command: sudo -E  ${SENSU_SYSTEM_PROFILE_LINUX_PATH}/bin/system-profile-linux
  interval: 60
  publish: false
  runtime_assets:
  - sensu/system-profile-linux
  subscriptions:
  - test
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "sudo_example"
  },
  "spec": {
    "check_hooks": null,
    "command": "sudo -E  ${SENSU_SYSTEM_PROFILE_LINUX_PATH}/bin/system-profile-linux",
    "interval": 60,
    "publish": false,
    "runtime_assets": [
      "sensu/system-profile-linux"
    ],
    "subscriptions": [
      "test"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

The check requires the following definition for the `system-profile-linux` dynamic runtime asset:

{{< language-toggle >}}

{{< code yml >}}
---
type: Asset
api_version: core/v2
metadata:
  annotations:
    io.sensu.bonsai.api_url: https://bonsai.sensu.io/api/v1/assets/sensu/system-profile-linux
    io.sensu.bonsai.name: system-profile-linux
    io.sensu.bonsai.namespace: sensu
    io.sensu.bonsai.tags: ""
    io.sensu.bonsai.tier: Community
    io.sensu.bonsai.url: https://bonsai.sensu.io/assets/sensu/system-profile-linux
    io.sensu.bonsai.version: 0.10.1
  name: sensu/system-profile-linux
spec:
  builds:
  - filters:
    - entity.system.os == 'darwin'
    - entity.system.arch == '386'
    headers: null
    sha512: 523f4e3ac815969ffe8c085bfc61090655bc2978216396989d4b23de360b65ff696d746bc7acce42f888795a2fadd5f17ee47e98d9c18a1f0d7d9fd8771e228d
    url: https://assets.bonsai.sensu.io/7d72df2682c0134068abd21a65778c81e61d7afe/system-profile-linux_0.10.1_darwin_386.tar.gz
  - filters:
    - entity.system.os == 'darwin'
    - entity.system.arch == 'amd64'
    headers: null
    sha512: 00cbfbc9f39fb3a11915e848277586e21b1223ffdd85a5c1abf02bb31c0bb6cf1e37fa533a6b331ad684d6a815672b8823a215770584c1da10263bdedd924b1d
    url: https://assets.bonsai.sensu.io/7d72df2682c0134068abd21a65778c81e61d7afe/system-profile-linux_0.10.1_darwin_amd64.tar.gz
  - filters:
    - entity.system.os == 'linux'
    - entity.system.arch == 'armv7'
    headers: null
    sha512: f7ad60cfc4ba12ccfe623e2d86727a544b35c2fb165f6c9acae432f132762022ba542cf26d92e15ac445cc5d241feb6055c17286cb2f5a1e5c6be0723a003e91
    url: https://assets.bonsai.sensu.io/7d72df2682c0134068abd21a65778c81e61d7afe/system-profile-linux_0.10.1_linux_armv7.tar.gz
  - filters:
    - entity.system.os == 'linux'
    - entity.system.arch == 'arm64'
    headers: null
    sha512: 689def9af9116cdeaf8bca319b59012a83073bc05587e3e974aa5b9a5cd3a40fbab7ce386737d1d18c62d9d06b7393d3cdc26e35c8c697920cc1a9a9acb94ad9
    url: https://assets.bonsai.sensu.io/7d72df2682c0134068abd21a65778c81e61d7afe/system-profile-linux_0.10.1_linux_arm64.tar.gz
  - filters:
    - entity.system.os == 'linux'
    - entity.system.arch == '386'
    headers: null
    sha512: 7c5bf18b52f6c6b9d55f1fe882c4341949730d25abf31fc472d6779948d31bc3606887ceb7d160d706acd5abd660111e98ba0220815a87d1a5c351dd95b2eaf3
    url: https://assets.bonsai.sensu.io/7d72df2682c0134068abd21a65778c81e61d7afe/system-profile-linux_0.10.1_linux_386.tar.gz
  - filters:
    - entity.system.os == 'linux'
    - entity.system.arch == 'amd64'
    headers: null
    sha512: 29a6e1725f37e533cd9f6a8a17b40ef757ba5ea5dc27701c19a7fb9ac9c2bdf9f684d758d4440f278bb7fc669e52bf02efb3fc6758731f7f3e10617a2fe026cf
    url: https://assets.bonsai.sensu.io/7d72df2682c0134068abd21a65778c81e61d7afe/system-profile-linux_0.10.1_linux_amd64.tar.gz
  filters: null
  headers: null
{{< /code >}}

{{< code json >}}
{
  "type": "Asset",
  "api_version": "core/v2",
  "metadata": {
    "annotations": {
      "io.sensu.bonsai.api_url": "https://bonsai.sensu.io/api/v1/assets/sensu/system-profile-linux",
      "io.sensu.bonsai.name": "system-profile-linux",
      "io.sensu.bonsai.namespace": "sensu",
      "io.sensu.bonsai.tags": "",
      "io.sensu.bonsai.tier": "Community",
      "io.sensu.bonsai.url": "https://bonsai.sensu.io/assets/sensu/system-profile-linux",
      "io.sensu.bonsai.version": "0.10.1"
    },
    "name": "sensu/system-profile-linux"
  },
  "spec": {
    "builds": [
      {
        "filters": [
          "entity.system.os == 'darwin'",
          "entity.system.arch == '386'"
        ],
        "headers": null,
        "sha512": "523f4e3ac815969ffe8c085bfc61090655bc2978216396989d4b23de360b65ff696d746bc7acce42f888795a2fadd5f17ee47e98d9c18a1f0d7d9fd8771e228d",
        "url": "https://assets.bonsai.sensu.io/7d72df2682c0134068abd21a65778c81e61d7afe/system-profile-linux_0.10.1_darwin_386.tar.gz"
      },
      {
        "filters": [
          "entity.system.os == 'darwin'",
          "entity.system.arch == 'amd64'"
        ],
        "headers": null,
        "sha512": "00cbfbc9f39fb3a11915e848277586e21b1223ffdd85a5c1abf02bb31c0bb6cf1e37fa533a6b331ad684d6a815672b8823a215770584c1da10263bdedd924b1d",
        "url": "https://assets.bonsai.sensu.io/7d72df2682c0134068abd21a65778c81e61d7afe/system-profile-linux_0.10.1_darwin_amd64.tar.gz"
      },
      {
        "filters": [
          "entity.system.os == 'linux'",
          "entity.system.arch == 'armv7'"
        ],
        "headers": null,
        "sha512": "f7ad60cfc4ba12ccfe623e2d86727a544b35c2fb165f6c9acae432f132762022ba542cf26d92e15ac445cc5d241feb6055c17286cb2f5a1e5c6be0723a003e91",
        "url": "https://assets.bonsai.sensu.io/7d72df2682c0134068abd21a65778c81e61d7afe/system-profile-linux_0.10.1_linux_armv7.tar.gz"
      },
      {
        "filters": [
          "entity.system.os == 'linux'",
          "entity.system.arch == 'arm64'"
        ],
        "headers": null,
        "sha512": "689def9af9116cdeaf8bca319b59012a83073bc05587e3e974aa5b9a5cd3a40fbab7ce386737d1d18c62d9d06b7393d3cdc26e35c8c697920cc1a9a9acb94ad9",
        "url": "https://assets.bonsai.sensu.io/7d72df2682c0134068abd21a65778c81e61d7afe/system-profile-linux_0.10.1_linux_arm64.tar.gz"
      },
      {
        "filters": [
          "entity.system.os == 'linux'",
          "entity.system.arch == '386'"
        ],
        "headers": null,
        "sha512": "7c5bf18b52f6c6b9d55f1fe882c4341949730d25abf31fc472d6779948d31bc3606887ceb7d160d706acd5abd660111e98ba0220815a87d1a5c351dd95b2eaf3",
        "url": "https://assets.bonsai.sensu.io/7d72df2682c0134068abd21a65778c81e61d7afe/system-profile-linux_0.10.1_linux_386.tar.gz"
      },
      {
        "filters": [
          "entity.system.os == 'linux'",
          "entity.system.arch == 'amd64'"
        ],
        "headers": null,
        "sha512": "29a6e1725f37e533cd9f6a8a17b40ef757ba5ea5dc27701c19a7fb9ac9c2bdf9f684d758d4440f278bb7fc669e52bf02efb3fc6758731f7f3e10617a2fe026cf",
        "url": "https://assets.bonsai.sensu.io/7d72df2682c0134068abd21a65778c81e61d7afe/system-profile-linux_0.10.1_linux_amd64.tar.gz"
      }
    ],
    "filters": null,
    "headers": null
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Next step: Run a Sensu cluster

Well done!
Your Sensu installation should now be secured with TLS.
The last step before you deploy Sensu is to [set up a Sensu cluster][10].


[1]: ../../manage-secrets/secrets-management/
[2]: ../../control-access/rbac/#default-users
[3]: ../../control-access/rbac/
[4]: ../../control-access/create-read-only-user/
[5]: ../../../commercial/
[6]: https://etcd.io/docs/v3.3.13/op-guide/security/
[7]: ../../../observability-pipeline/observe-schedule/agent/#security-configuration-flags
[9]: https://github.com/cloudflare/cfssl
[10]: ../cluster-sensu/
[11]: https://bonsai.sensu.io/assets/sensu/system-profile-linux
[12]: ../generate-certificates/
