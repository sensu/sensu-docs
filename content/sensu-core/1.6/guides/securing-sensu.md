---
title: "Securing Sensu"
description: "Strategies and best practices for securing Sensu"
product: "Sensu Core"
version: "1.6"
weight: 8
next: ../securing-rabbitmq
menu:
  sensu-core-1.6:
    parent: guides
---

Securing Sensu is a multifaceted process that requires several different components to be secured in order to properly harden your Sensu deployment. In this guide, we'll walk you through the best practices and strategies for securing Sensu. By the end of the guide, you should have a thorough understanding of what goes into securing all of the pieces that make up a Sensu deployment, including:

* How to secure your Sensu clients
* How to secure your Sensu Server/API/Enterprise instance(s)
* How to secure Uchiwa/the Sensu Enterprise Dashboard

We'll also walk through securing the additional components like RabbitMQ and Redis in the guides following this one.

## Objectives

We'll cover the following in this guide:

* [Securing Sensu](#securing-sensu-clients)
  * [Ensure Check Result Authenticity Using Client Signatures](#the-clientsignature-attribute)
  * [Prevent Secret Disclosure via Client-side Redaction](#the-redact-attribute)
  * [Encrypting communications using SSL/TLS](#client-ssl-tls)
  * [Disabling Client TCP/HTTP Sockets](#disabling-client-sockets)
* [Securing Dashboards](#securing-dashboards)
  * [Securing Uchiwa](#securing-uchiwa)
  * [Securing Sensu Enterprise Dashboards](#securing-sensu-enterprise-dashboards)

## Securing Sensu Clients

### Ensure Check Result Authenticity Using Client Signatures{#the-clientsignature-attribute}

By default, the `signature` attribute isn't required and doesn't have a value, but adding it to your clients' configurations ensures that you're able to validate the results coming from a client by providing a random string in the attribute. In this way, if you're ever in doubt about the authenticity of the results that are being returned from a client, you can compare the results against your client configuration to see if the signature strings match up. You can read more about using a client `signature` [here][1]

### Prevent Secret Disclosure via Client-side Redaction{#the-redact-attribute}

The `redact` attribute allows you to pass values as an array in your client configuration to Sensu to redact when logging, or sending keepalives. These can be any value you wish, or that you feel may be of a sensitive nature in your organization. By default, the attribute uses the following:

{{< highlight json >}}
[
  "password", "passwd", "pass",
  "api_key", "api_token", "access_key",
  "secret_key", "private_key","secret"
]{{< /highlight >}}

But if you're using the [EC2][2] integration or plugins whose handlers might have different values than what are specified in the default, you can add said values to the array to be redacted. You can read more about the attribute [here][3].

Using `redact` in combination with [check token substitution][15] is also a powerful way to prevent the inadvertent disclosure of secrets. We strongly recommend using these two features in conjunction with each other to add another layer of security to your environment.

### Encrypting communications using SSL/TLS{#client-ssl-tls}

There are several elements of any Sensu deployment that may be secured using SSL/TLS:

* Client to transport communication
* Server to transport communication
* API to transport communication
* Dashboards (Uchiwa and Sensu Enterprise Dashboard)

We'll cover securing client to transport communication first. 

#### SSL/TLS Configuration for Client, Server and API Processes

By default, communication between Sensu client, server and API processes and the transport mechanism for a Sensu deployment are not secure. To secure communication these processes and the transport is simple and quick to implement. You can read the [full documentation about SSL/TLS configuration][4], but we'll take a look over what a sample `rabbitmq.json` configuration might look like for a client or server:

{{< highlight json >}}
{
 "host": "127.0.0.1",
 "port": 5671,
 "vhost": "XXXXXX",
 "user": "XXXXXX",
 "password": "XXXXXX",
 "heartbeat": 30,
 "prefetch": 50,
 "ssl": {
   "cert_chain_file": "/etc/sensu/ssl/cert.pem",
   "private_key_file": "/etc/sensu/ssl/key.pem"
 }
}{{< /highlight >}}

As you can see above, we've provided the full path to our certificate and key files inside of the `ssl` attribute in our configuration.

_NOTE: In order for the above to work, you'll also need to ensure that you've enabled [RabbitMQ SSL Support][5] and that you're running a version of RabbitMQ/Erlang that will reliably support SSL/TLS communication. If in doubt, visit [RabbitMQ's documentation][6] to determine what version of RabbitMQ/Erlang you should use._

#### SSL/TLS Configuration for Dashboards

In this section, we'll cover some strategies for how you can secure your dashboard with Sensu, whether you're using Uchiwa or Sensu Enterprise. Whether you're using Uchiwa or Sensu Enterprise, you can provide an SSL certificate for use on your dashboard. The SSL certificate attributes are set inside of the `uchiwa` or `dashboard` scopes inside of `/etc/sensu/uchiwa.json` or `/etc/sensu/dashboard.json` respectively and look like the following:

{{< highlight json >}}
{
  "sensu": [
    {
      "name": "sensu-server-1",
      "host": "api1.example.com",
      "port": 4567
    }
  ],
  "dashboard": {
    "host": "0.0.0.0",
    "port": 3000,
    "ssl": {
  "certfile": "/path/to/dashboard.pem",
  "keyfile": "/path/to/dashboard.key"
    }
  }
}{{< /highlight >}}

In addition to being able to add an SSL certificate to our configuration, we can also specify the cipher suites that we want to use, as well as set our minimum TLS version. Those are added inside of the `ssl` scope, and look like:

{{< highlight json >}}
{
  "ssl": {
    "...": "...",
    "ciphersuite": [
      "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
      "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305",
      "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305",
      "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA",
      "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA",
      "TLS_RSA_WITH_AES_128_GCM_SHA256",
      "TLS_RSA_WITH_AES_128_CBC_SHA",
      "TLS_RSA_WITH_AES_256_CBC_SHA"
    ],
    "tlsminversion": "tls10"
  }
}{{< /highlight >}}

### Disabling Client TCP/HTTP Sockets{#disabling-client-sockets}

Prior to Sensu 1.3, Sensu clients had an "always on" feature where the client would listen on `127.0.0.1:3030` by default. While this feature is useful for instrumentation applications to send results to via the client, it did pose a risk if the `bind` attribute was set to listen on all ports. As of version 1.3, there is now an option to completely disable this feature altogether. For more information on managing or disabling client sockets, head over to the [client reference documentation][16]

### Preventing Arbitrary Code Execution via Safe Mode

Sensu clients have the option to boot into [`safe_mode`][17].  While this is useful for bootstrapping nodes so that checks aren't executed prior to the provisioning process being completed, it is also useful for providing an extra layer of security by ensuring that subscription checks are not able to be executed on a client without the client having the check definition on disk. 

## Securing Dashboards

### Securing Uchiwa

In addition to SSL/TLS encryption, Uchiwa provides another mechanism for securing the dashboard:

* Encrypted passwords

For more details on how to secure your Uchiwa instance using this feature, see [the Uchiwa security docs][7].

### Securing the Sensu Enterprise Dashboard

The Sensu Enterprise Dashboard provides the same mechanisms for securing it as Uchiwa, but adds the more "enterprise-y" feature of [role based access control (RBAC)][8], as well as providing the ability to assign authentication tokens for accessing the Sensu Enterprise Dashboard API

* RBAC
* Authentication for the Sensu Enterprise Console API

#### RBAC

The addition of role based access controls to your Sensu Enterprise Dashboard configuration allows for another layer of security when it comes to viewing and interacting with Sensu events. Out of the box, there are several RBAC methods that are available for you to implement:

* [LDAP][9]
* [GitHub][10]
* [OpenID Connect][11]
* [GitLab][12]

You can view the details for implementing one of these RBAC methods via the links above.

#### Adding Roles and Access Tokens

Sensu Enterprise also provides a method for implementing roles and auth tokens in the absence of an RBAC authentication mechanism. You can read more about access tokens and implementing them [here][13]. However, for a quick example of what a configuration might look like, see below:

{{< highlight json >}}
{
  "dashboard": {
    "...": "...",
    "ldap": {
      "...": "...",
      "roles": [
        {
          "name": "example_role",
          "members": ["example_group"],
          "datacenters": [],
          "subscriptions": ["example_application"],
          "accessToken": "j3sJ8itFn9d9ooFYdN9erW3ZN6i8C9V3",
          "methods": {
            "get": [],
            "post": [
              "clients",
              "stashes"
            ],
            "delete": [
              "none"
            ]
          }
        }
      ]
    }
  }
}{{< /highlight >}}

Note that there are also options for restricting API methods to roles, as well as the ability to restrict read/write access to the dashboard, which you can see more of in the [RBAC drivers documentation][14]

### Putting It All Together

We've covered a lot of material in this article, so let's do a quick recap of the various approaches to securing Sensu's components, and what that might look like in a real-world deployment of Sensu.

#### Client Configuration

We covered the `signature` and `redact` attributes at the beginning of the guide. An implementation of those two attributes would look similar to the below client configuration:

{{< highlight json >}}
{
  "client": {
    "name": "test_client",
    "subscriptions": [
      "dev"
    ],
    "redact": [
      "ec2_access_key",
      "ec2_secret_key",
      "do_auth_token"
    ],
    "signature": "yVNxtPbRGwCYFYEr3V"
  }
}{{< /highlight >}}

This adds the client `signature` for us to verify results against, as well as the custom values we want to append to the default `redact` values.

And inside of our `/etc/sensu/conf.d/rabbitmq.json` we've configured it to use SSL:

{{< highlight json >}}
{
 "host": "127.0.0.1",
 "port": 5671,
 "vhost": "XXXXXX",
 "user": "XXXXXX",
 "password": "XXXXXX",
 "heartbeat": 30,
 "prefetch": 50,
 "ssl": {
   "cert_chain_file": "/etc/sensu/ssl/cert.pem",
   "private_key_file": "/etc/sensu/ssl/key.pem"
 }
}{{< /highlight >}}

_NOTE: One element not present is the discussion of minimum viable permissions for RabbitMQ. We'll discuss how to approach RabbitMQ permissions in the following article_

#### Server Configuration

Just like our client, we've added the following inside of our RabbitMQ configuration:

{{< highlight json >}}
{
  "rabbitmq": {
    "...": "...",
    "ssl": {
      "cert_chain_file": "/etc/sensu/ssl/cert.pem",
      "private_key_file": "/etc/sensu/ssl/key.pem"
    }
  }
}{{< /highlight >}}

#### Dashboard Configuration

For our dashboard of choice, we've done the following:

* Added a SSL/TLS certificate/key pair (and optionally specified our cipher suites)
* Ensured our passwords are encrypted or are using a RBAC mechanism (if using Sensu Enterprise)
* Added access tokens to a user/role

Which will look like the following:

`/etc/sensu/uchiwa.json`

{{< highlight json >}}
{
  "uchiwa": {
    "ssl": {
      "certfile": "/path/to/uchiwa.pem",
      "keyfile": "/path/to/uchiwa.key",
      "ciphersuite": [
        "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
        "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
        "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305",
        "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA",
        "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA",
        "TLS_RSA_WITH_AES_128_GCM_SHA256",
        "TLS_RSA_WITH_AES_256_GCM_SHA384",
        "TLS_RSA_WITH_AES_128_CBC_SHA",
        "TLS_RSA_WITH_AES_256_CBC_SHA"
      ],
      "tlsminversion": "tls10"
    },
    "users": [
      {
        "username" : "admin",
        "password": "secret",
        "accessToken": "vFzX6rFDAn3G9ieuZ4ZhN-XrfdRow4Hd5CXXOUZ5NsTw4h3k3l4jAw__",
        "readonly": false
      },
      {
        "username" : "guest",
        "password": "secret",
        "accessToken": "hrKMW3uIt2RGxuMIoXQ-bVp-TL1MP4St5Hap3KAanMxI3OovFV48ww__",
        "readonly": true
      }
    ]
  }
}{{< /highlight >}}

That wraps it up! We'll cover more in the subsequent articles in this series. Click "Next" on the bottom right to continue on to Securing RabbitMQ.

[1]: ../../reference/clients/#client-signature
[2]: /sensu-enterprise/latest/integrations/ec2/
[3]: ../../reference/clients/#client-attributes
[4]: ../../reference/ssl/#reference-documentation
[5]: ../../reference/ssl/#enable-rabbitmq-ssl-support
[6]: https://www.rabbitmq.com/which-erlang.html
[7]: /uchiwa/latest/guides/security/
[8]: /sensu-enterprise-dashboard/latest/rbac/overview
[9]: /sensu-enterprise-dashboard/latest/rbac/rbac-for-ldap/
[10]: /sensu-enterprise-dashboard/latest/rbac/rbac-for-github/
[11]: /sensu-enterprise-dashboard/latest/rbac/rbac-for-oidc/
[12]: /sensu-enterprise-dashboard/latest/rbac/rbac-for-gitlab/
[13]: /sensu-enterprise-dashboard/latest/rbac/overview/#rbac-for-the-sensu-enterprise-console-api
[14]: /sensu-enterprise-dashboard/latest/rbac/overview/#driver-attributes
[15]: ../../reference/checks/#what-is-check-token-substitution
[16]: ../../reference/clients/#socket-attributes
[17]: ../../reference/clients/#client-definition-specification
