---
title: "Securing RabbitMQ"
description: "Strategies and best practices for securing RabbitMQ"
version: "0.29"
weight: 9
previous: ../securing-sensu-guide
next: ../securing-redis-guide
menu:
  sensu-core-0.29:
    parent: guides
---

As the supported transport mechanism for any Sensu deployment, RabbitMQ has its own set of security concerns, from ensuring that VHOST permissions are set correctly, to adding SSL/TLS encryption between clients, consumers, and queues. This guide will discuss how to properly secure RabbitMQ as one of the core elements of a Sensu deployment.

# Objectives

This guide will discuss the following:

* [VHost Permissions for Sensu Clients](#vhost-permissions-clients)
* [VHost Permissions for Sensu Servers](#vhost-permissions-servers)
* [SSL/TLS Configuration](#vhost-permissions-clients)

## Vhost Permissions for Sensu Clients{#vhost-permissions-clients}

In this discussion, let's start with an example from one of our RabbitMQ [installation guides][1]:

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

* [Strict permissions for hosts with predictable hostnames](#strict-perms-predictable)
* [Less strict permissions for hosts with unpredictable hostnames][]

### Strict Permissions for Predictable Clients{#strict-perms-predictable}

In our [RabbitMQ installation documentation][2], we go over setting the permissions for a client, and it looks like this:

{{< highlight shell >}}
sudo rabbitmqctl add_user sensu secret
sudo rabbitmqctl set_permissions -p /sensu sensu ".*" ".*" ".*"{{< /highlight >}}

While fine for an example, we recommend that you have the permissions locked down to the queues that clients will need to write to, which are:

* The `keepalives` queue
* The `results` queue

### Less Strict Permissions for Clients

For hosts that have less-than-predictable hostnames, you can tighten down the permissions a bit

## Vhost Permissions for Sensu Servers{#vhost-permissions-servers}

Similar to our clients, we recommend setting the permissions for Sensu servers as strict as possible.

## SSL/TLS Configuration{#ssl-tls-configuration}

In our previous guide on securing Sensu, we noted that it's possible to encrypt communication between clients, servers, and the transport. We'll build on what we discussed in the previous article, and add an example SSL/TLS configuration here so that all of the data flowing between our Sensu components is encrypted.



[1]: ../../reference/rabbitmq/#sensu-rabbitmq-configuration-examples
[2]: ../../installation/install-rabbitmq/