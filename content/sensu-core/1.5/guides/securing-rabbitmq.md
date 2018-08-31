---
title: "Securing RabbitMQ"
description: "Strategies and best practices for securing RabbitMQ"
product: "Sensu Core"
version: "1.5"
weight: 9
previous: ../securing-sensu
next: ../securing-redis
menu:
  sensu-core-1.5:
    parent: guides
---

As the supported transport mechanism for any Sensu deployment, RabbitMQ has its own set of security concerns, from ensuring that VHOST permissions are set correctly, to adding SSL/TLS encryption between clients, consumers, and queues. This guide will discuss how to properly secure RabbitMQ as one of the core elements of a Sensu deployment.

Before we dive too deep in the article, you may want to familiarize yourself with [RabbitMQ permissions][1]. It's important to note that RabbitMQ makes a distinction between _configure_, _write_, and _read_ permissions. With that in mind, let's move on to what we'll cover in this guide.

# Objectives

This guide will discuss the following:

* [VHost Permissions for Sensu Clients](#vhost-permissions-clients)
* [VHost Permissions for Sensu Servers](#vhost-permissions-servers)
* [SSL/TLS Configuration](#ssl-tls-configuration)

## Vhost Permissions for Sensu Clients{#vhost-permissions-clients}

In this discussion, let's start with an example from one of our RabbitMQ [installation guides][2]:

{{< highlight json >}}
{
  "rabbitmq": {
    "host": "127.0.0.1",
    "port": 5671,
    "vhost": "/sensu",
    "user": "sensu",
    "password": "secret",
    "heartbeat": 30,
    "prefetch": 50,
    "ssl": {
      "cert_chain_file": "/etc/sensu/ssl/cert.pem",
      "private_key_file": "/etc/sensu/ssl/key.pem"
    }
  }
}{{< /highlight >}}

From what we have above, there are several things that make this configuration far from being production-ready/production-safe in terms of permissions:

* The user that's present has full access to the vhost `/sensu`
* If you've gone through the introductory guides, then it's likely that you're re-using the configuration across your Sensu server and client configurations

What this means is that it's possible for Sensu clients to snoop on other clients' keepalives, or for a malicious actor to disguise themselves as a trusted Sensu client and perform unwanted actions on hosts, among other things. It's critical that you lock down permissions in your environment to prevent any undesirable actions from taking place.

Depending on your infrastructure and the naming conventions that your organization has adopted, it's possible to approach locking down queues in one of two ways:

* [Strict permissions for hosts with predictable hostnames](#client-perms-strict)
* [Less strict permissions for hosts with unpredictable hostnames](#client-perms-loose)

### Strict Permissions for Predictable Clients{#client-perms-strict}

In our [RabbitMQ installation documentation][3], we go over setting the permissions for a client, and it looks like this:

{{< highlight shell >}}
sudo rabbitmqctl add_user sensu secret
sudo rabbitmqctl set_permissions -p /sensu sensu ".*" ".*" ".*"{{< /highlight >}}

While fine for an example, we recommend that you have the permissions locked down to the queues that clients will need to write to, which are:

* The `keepalives` queue
* The `results` queue
* The `client` queue (e.g., for a client named `sensu-client-01`, there would be a queue of the same name)

For a visual representation of the queues that clients have access to, let's take a quick look at a graphical representation of AMQP entities in Sensu:

![sensu-amqp-entities](/images/sensu-amqp-entities.png)

So how do we lock down permissions for our clients?

We'll first start by creating a separate user. In the case of our 3rd point above, and cases where our client hostnames follow a predictable pattern, you can create a user with that node's hostname:

{{< highlight shell >}}
sudo rabbitmqctl add_user sensu-client-01 <PASSWORD>{{< /highlight >}}

From there we'll need to lock the client down to just the queues that it needs access to:

{{< highlight shell >}}
$ rabbitmqctl set_permissions -p /sensu sensu-client-01 '((?!keepalives|results).)*' '^(keepalives|results|sensu-client-01.*)$' '((?!keepalives|results).)*'{{< /highlight >}}

So we know that works for clients with predictable hostnames. What about clients that don't have a hostname we can predict?

### Less Strict Permissions for Clients{#client-perms-loose}

For hosts that have less-than-predictable hostnames, you can tighten down the permissions a bit, though the queue you'll be missing is the `client`-specific queue. So, our permissions would look more like the following:

{{< highlight shell >}}
sudo rabbitmqctl add_user <CLIENT-USER> <CLIENT-PASS>{{< /highlight >}}

{{< highlight shell >}}
rabbitmqctl set_permissions -p /sensu <CLIENT-USER> '((?!keepalives|results).)*' '.*' '((?!keepalives|results).)*'{{< /highlight >}}

This means that the client user we create for our randomly-named clients will have full `write` permissions.

## Vhost Permissions for Sensu Servers{#vhost-permissions-servers}

Vhost permissions for our servers will function more like what you can find in our RabbitMQ installation documentation. In this case, our permissions will be open for our server user. So we'll start off by creating our server user:

{{< highlight shell >}}
sudo rabbitmqctl add_user <SERVER-USER> <PASSWORD>{{< /highlight >}}

And we'll set the permissions so that the user has full control:

{{< highlight shell >}}
sudo rabbitmqctl set_permissions -p /sensu <SERVER-USER> ".*" ".*" ".*"{{< /highlight >}}

## SSL/TLS Configuration{#ssl-tls-configuration}

In our previous guide on securing Sensu, we noted that it's possible to encrypt communication between clients, servers, and the transport. We'll build on what we discussed in the previous article, and add an example SSL/TLS configuration here so that all of the data flowing between our Sensu components is encrypted. For RabbitMQ, your configuration to set up SSL/TLS should look like the following:

{{< highlight shell >}}[
 {rabbit, [
    {ssl_listeners, [5671]},
    {ssl_options, [{cacertfile,"/etc/rabbitmq/ssl/cacert.pem"},
                   {certfile,"/etc/rabbitmq/ssl/cert.pem"},
                   {keyfile,"/etc/rabbitmq/ssl/key.pem"},
                   {versions, ['tlsv1.2']},
                   {ciphers,  [{rsa,aes_256_cbc,sha256}]},
                   {verify,verify_peer},
                   {fail_if_no_peer_cert,true}]}
  ]}
].{{< /highlight >}}

What this now means is that our clients will be pointing at our RabbitMQ instances with a configuration that looks something similar to:

{{< highlight json >}}
{
 "host": "127.0.0.1",
 "port": 5671,
 "vhost": "/sensu",
 "user": "<CLIENT-USER",
 "password": "<CLIENT-PASS",
 "heartbeat": 30,
 "prefetch": 50,
 "ssl": {
   "cert_chain_file": "/etc/sensu/ssl/cert.pem",
   "private_key_file": "/etc/sensu/ssl/key.pem"
 }
}{{< /highlight >}}

## Wrapping it Up

In this guide, we've built on the things we've learned in the previous guide on [securing Sensu][4] and added the following to our Sensu deployment:

* A separate client user
* Separate permissions to our RabbitMQ vhost for our client and server users
* A separate server user
* SSL/TLS configuration for encrypting traffic between our clients, servers, and transport

We'll continue building on our securing Sensu guide series and will cover strategies and best practices for securing our Redis component of our Sensu deployment. Click the link at the bottom to continue on.

[1]: https://www.rabbitmq.com/access-control.html#permissions
[2]: ../../reference/rabbitmq/#sensu-rabbitmq-configuration-examples
[3]: ../../installation/install-rabbitmq/
[4]: ../securing-sensu