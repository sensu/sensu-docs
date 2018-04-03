---
title: "Securing Sensu"
description: "Strategies and best practices for securing Sensu"
version: "0.29"
weight: 8
next: ../securing-rabbitmq-guide
menu:
  sensu-core-0.29:
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
  * [The `client_signature` Attribute](#the-clientsignature-attribute)
  * [The `redact` Attribute](#the-redact-attribute)
* [Securing Sensu Server/API][]
* [Securing Dashboards](#securing-dashboards)
  * [Securing Uchiwa](#securing-uchiwa)
  * [Securing Sensu Enterprise Dashboards](#securing-sensu-enterprise-dashboards)

## Securing Sensu Clients

### The Client `signature` Attribute{#the-clientsignature-attribute}

By default, the `signature` attribute isn't required and doesn't have a value, but adding it to your clients' configurations ensures that you're able to validate the results coming from a client by providing a random string in the attribute. In this way, if you're ever in doubt about the authenicity of the results that are being returned from a client, you can compare the results against your client configuration to see if the signature strings match up. You can read more about using a client `signature` [here][2]

### The `redact` Attribute

The `redact` attribute allows you to pass values as an array in your client configuration to Sensu to redact when logging, or sending keepalives. These can be any value you wish, or that you feel may be of a sensitive nature in your organization. By default, the attribute uses the following:

{{< highlight json>}}
[
  "password", "passwd", "pass",
  "api_key", "api_token", "access_key",
  "secret_key", "private_key","secret"
]{{{< /highlight >}}}

But if you're using the [EC2][4] integration or plugins whose handlers might have different values than what are specified in the default, you can add said values to the array to be redacted. You can read more about the attribute [here][3].

## Securing Sensu Server/API



## Securing Dashboards

In this section, we'll cover some strategies for how you can secure your dashboard with Sensu, whether you're using Uchiwa or Sensu Enterprise. We'll start with some strategies to secure Uchiwa, and then discuss methods for hardening the Sensu Enterprise Dashboard

### Securing Uchiwa

Uchiwa provides two primary mechanisms for securing the dashboard:

* Encrypted passwords
* SSL/TLS

For more details on how to secure your Uchiwa instance using these two features, see [Uchiwa's site](https://docs.uchiwa.io/guides/security/).

### Securing Sensu Enterprise Dashboards

The Sensu Enterprise Dashboard provides the same mechanisms for securing it as Uchiwa, but adds the more "enterprise-y" feature of [role based access control (RBAC)][], as well as providing the ability to assign authentication tokens for accessing the Sensu Enterprise Dashboard API

* SSL/TLS
* Authentication for the Sensu Enterprise Console API
* RBAC

#### SSL/TLS Configuration

Much like Uchiwa, you can provide an SSL certificate for use on your dashboard. The SSL certificate attributes are set inside of the `dashboard` scope inside of `/etc/sensu/dashboard.json` and look like the following:

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
"ssl": {
  ...
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
}{{< /highlight >}}

#### RBAC

The addition of role based access controls to your Sensu Enterprise Dasbhaord configuration allows for another layer of security when it comes to viewing and interacting with Sensu events. Out of the box, there are several RBAC methods that are available for you to implement:

* [LDAP][7]
* [GitHub][8]
* [OpenID Connect][9]
* [GitLab][10]

You can view the details for implementing one of these RBAC methods via the links above. 

#### Adding Roles and Access Tokens

Sensu Enterprise also provides a method for implementing roles and auth tokens in the absence of an RBAC authentication mechanism. You can read more about access tokens and implementing them [here][11]. However, for a quick example of what a configuration might look like, see below:

{{< highlight json>}}
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
  }{{< /highlight >}}

Note that there are also options for restricting API methods to roles, as well as the ability to restrict read/write access to the dashboard, which you can see more of in the [RBAC drivers documentation][12]

### Putting It All Together

We've covered a lot of material in this article, so let's do a quick recap of the various approaches to securing Sensu's components, and what that might look like in a real-world deployment of Sensu.

#### Client Configuration

We covered the `signature` and `redact` attributes at the beginning of the guide. An implementation of those two attributes would look similar to the below client configuration:

{{< highlight json >}}
{
  client: {
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

#### Server Configuration



[1]: 
[2]: ../../reference/clients/#client-signature
[3]: ../../reference/clients/#client-attributes
[4]: /sensu-enterprise/latest/integrations/ec2/
[5]: /sensu-enterprise-dashboard/latest/rbac/overview/#rbac-for-the-sensu-enterprise-console-api
[6]: /sensu-enterprise-dashboard/latest/rbac/overview
[7]: /sensu-enterprise-dashboard/latest/rbac/rbac-for-ldap/
[8]: /sensu-enterprise-dashboard/latest/rbac/rbac-for-github/
[9]: /sensu-enterprise-dashboard/latest/rbac/rbac-for-oidc/
[10]: /sensu-enterprise-dashboard/late.st/rbac/rbac-for-gitlab/
[11]: /sensu-enterprise-dashboard/latest/rbac/overview/#rbac-for-the-sensu-enterprise-console-api
[12]: /sensu-enterprise-dashboard/latest/rbac/overview/#driver-attributes