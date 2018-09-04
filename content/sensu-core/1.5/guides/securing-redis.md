---
title: "Securing Redis"
description: "Strategies and best practices for securing Redis"
product: "Sensu Core"
version: "1.5"
weight: 9
next: ../securing-rabbitmq
previous: ../securing-sensu
menu:
  sensu-core-1.5:
    parent: guides
---

Redis is a key-value database, which describes itself as “an open source, BSD licensed, advanced key-value cache and store”. Sensu uses Redis for storing persistent data. Two Sensu services, the server and API, require access to the same instance of Redis to function.

This guide will discuss best practices to use with Redis for use with Sensu.

### Objectives

This guide will discuss the following:

* [Redis General Security Model](#redis-general-security-model)
* [Securing Redis with a Local Install](#securing-redis-with-a-local-install)
* [Securing Redis via Localhost Security](#securing-redis-localhost-security)

## Redis General Security Model{#redis-general-security-model}

Redis was designed to be accessed by trusted clients inside a closed network environment. As such it is recommended that Redis instances not be directly exposed to the internet or have access in general to untrusted clients that can directly connect to the Redis TCP port or UNIX socket.

Best practices from the [Redis Security Documentation][1] suggest blocking port level access to all hosts except trusted hosts, in our case your Sensu-Server, Sensu-API and/or Sensu-Enterprise-Server.

_NOTE: As of [Sensu 1.3.0][2], TLS is now supported, allowing you to encrypt your traffic between Sensu and Redis when being used as a Transport or Datastore._


## Securing Redis with a Local Installation of Sensu{#securing-redis-with-a-local-install}

For instances where you will be running Redis on the same host that you will be running Sensu, you can configure Redis to listen to the localhost only on the host loopback IP address.

To accomplish this you will need to edit `/etc/redis/redis.conf` with the following line:

{{< highlight shell >}}
bind 127.0.0.1
{{< /highlight >}}

After making the above change, you will need to restart the Redis service.

## Securing Redis via Localhost Security{#securing-redis-localhost-security}

### Redis Configuration

The Redis documentation recommends limiting access to the TCP port Redis uses. By default Redis uses the following ports:

* 6379 For standalone Redis instances
* 16379 For clustered Redis instances
* 26379 For Sential instances

We recommend binding to the host IP address instead of binding to all IP's on the host. This can be accomplished by configuring `bind` to the IP address in `/etc/redis/redis.conf`:

{{< highlight shell >}}
bind 192.168.50.41
{{< /highlight >}}

After making the change you will need to restart the Redis service so the changes take effect.

### Host Configuration

Once Redis is bound to the IP address you can then limit access to its specific IP/port using internal security tools such as host firewalls, networking ACL or other methods of locking down access to a specific host/port.

[1]: https://redis.io/topics/security
[2]: ../../../1.3/reference/redis