---
title: "Install Redis on Ubuntu/Debian"
description: "The complete Sensu installation guide."
weight: 5
product: "Sensu Core"
version: "1.3"
next: ../install-rabbitmq-on-ubuntu-debian
previous: ../installation-prerequisites
---

- [Install Redis using APT](#install-redis-using-apt)
- [Managing the Redis service/process](#manage-the-redis-service-process)
  - [Start/stop the Redis services](#startstop-the-redis-services)
  - [Enable/disable Redis start on system boot](#enabledisable-redis-start-on-system-boot)
- [Verify that Redis is working](#verify-that-redis-is-working)
- [Set file descriptor limits](#set-file-descriptor-limits)
- [Configure Sensu](#configure-sensu)
  - [Example Standalone Configuration](#example-standalone-configuration)
  - [Example Distributed Configuration](#example-distributed-configuration)
  - [Using Redis as the Sensu Transport](#using-redis-as-the-sensu-transport)

## Install Redis using APT

Install Redis (>= 1.3.14) from the distribution repository:

{{< highlight shell >}}
sudo apt-get update
sudo apt-get -y install redis-server{{< /highlight >}}

## Managing the Redis service/process

### Start/stop the Redis services

Start and stop the Redis service using the `redis-server` init scripts:

{{< highlight shell >}}
sudo service redis-server start
sudo service redis-server stop{{< /highlight >}}

{{< highlight shell >}}
sudo service redis-sentinel start
sudo service redis-sentinel stop{{< /highlight >}}

_NOTE: `redis-sentinel` service scripts are not installed by default and should
only be used with [highly available Redis configurations][7]._

### Enable/disable Redis start on system boot

Enable or disable the Redis service to start on system boot using the
`update-rc.d` utility:

{{< highlight shell >}}
sudo update-rc.d redis-server enable
sudo update-rc.d redis-server disable{{< /highlight >}}

{{< highlight shell >}}
sudo update-rc.d redis-sentinel enable
sudo update-rc.d redis-sentinel disable{{< /highlight >}}

_NOTE: `redis-sentinel` service scripts are not installed by default and should
only be used with [highly available Redis configurations][7]._

## Verify that Redis is working

Once you have installed and started the Redis service, you should be able to
confirm that Redis is ready to use by running the command:  <kbd>redis-cli
ping</kbd>. If you get a `PONG` response, you are ready to move on to the next
step in the guide.

## Set file descriptor limits

_NOTE: for the most part, Redis should "just work" without needing to tune Linux
file descriptor limits, however this configuration may become necessary in cases
where Redis is being used as the [Sensu transport][3] or in other high
performance environments. Even with tuning, Redis Transport is NOT recommended in production!_

By default, most Linux operating systems will limit the maximum number of file
handles a single process is allowed to have open to `1024`. We recommend
adjusting this number to `65536` for running Redis in production systems, and at
least `4096` for development environments.

According to the Redis documentation on client handling, regarding the [maximum
number of client connections allowed][6]:

> In Redis 2.4 there was an hard-coded limit about the maximum number of clients
  that was possible to handle simultaneously. In Redis 2.6 this limit is
  dynamic: by default is set to 10000 clients, unless otherwise stated by the
  `maxclients` directive in `/etc/redis/redis.conf`. However Redis checks with
  the kernel what is the maximum number of file descriptors that we are able to
  open (the soft limit is checked), if the limit is smaller than the maximum
  number of clients we want to handle, plus 32 (that is the number of file
  descriptors Redis reserves for internal uses), then the number of maximum
  clients is modified by Redis to match the amount of clients we are _really
  able to handle_ under the current operating system limit.
>
> When Redis is configured in order to handle a specific number of clients it is
  a good idea to make sure that the operating system limit to the maximum number
  of file descriptors per process is also set accordingly.

To adjust this limit, please edit the configuration file found at
`/etc/default/redis-server` by uncommenting the last line in the file, and
adjusting the `ulimit` value accordingly.

{{< highlight shell >}}
# redis-server configure options
#
# ULIMIT: Call ulimit -n with this argument prior to invoking Redis itself.
# This may be required for high-concurrency environments. Redis itself cannot
# alter its limits as it is not being run as root. (default: do not call
# ulimit)
#
ULIMIT=65536{{< /highlight >}}

When the configured number of maximum clients can not be honored, the condition
is logged at startup...

{{< highlight shell>}}
[41422] 23 Jan 11:28:33.179 # Unable to set the max number of files limit to 100032 (Invalid argument), setting the max clients configuration to 10112.{{< /highlight >}}

## Configure Sensu

The following Sensu configuration files are provided as examples. Please review
the [Redis reference documentation][1] for additional information on configuring
Sensu to communicate with Redis, and the [reference documentation on Sensu
configuration][2] for more information on how Sensu loads configuration.

### Example Standalone Configuration

1. Copy the following contents to a configuration file located at
   `/etc/sensu/conf.d/redis.json`:
   {{< highlight json >}}
{
  "redis": {
    "host": "127.0.0.1",
    "port": 6379
  }
}{{< /highlight >}}
   _WARNING: using `"localhost"` instead of `127.0.0.1` for the `host`
   configuration on systems that support IPv6 may result in an [IPv6 "localhost"
   resolution (i.e. `::1`)][5] rather than an IPv4 "localhost" resolution (i.e.
   `127.0.0.1`). This is not incorrect behavior because Sensu does support IPv6,
   however if Redis is not configured to listen on IPv6, this will result in a
   connection error and log entries indicating a **"redis connection error"**
   with an **"unable to connect to redis server"** error message._

### Example Distributed Configuration

1. Obtain the IP address of the system where Redis is installed. For the purpose
   of this guide, we will use `10.0.1.5` as our example IP address.

2. Create a configuration file  with the following contents at
   `/etc/sensu/conf.d/redis.json` on the Sensu server and API system(s), and all
   systems running the Sensu client:
   {{< highlight json >}}
{
  "redis": {
    "host": "10.0.1.5",
    "port": 6379,
    "auto_reconnect": true
  }
}{{< /highlight >}}
   _NOTE: the `sensu-client` process does not require Redis configuration
   unless Redis is being used as the [Sensu Transport][3]. If you're not
   planning on using Redis as the Sensu Transport, you do not need to create a
   Redis configuration file on systems where the Sensu client is installed._

### Using Redis as the Sensu Transport

1. If you are [planning to use Redis][4] as your [Sensu Transport][3], please
   copy the following contents to a configuration file located at
   `/etc/sensu/conf.d/transport.json`:
   {{< highlight json >}}
{
  "transport": {
    "name": "redis",
    "reconnect_on_error": true
  }
}{{< /highlight >}}
   This will inform the Sensu services to use the defined Redis configuration as
   the Sensu Transport (instead of looking for the default transport, RabbitMQ).

[1]:  ../../reference/redis
[2]:  ../../reference/configuration
[3]:  ../../reference/transport
[4]:  ../installation-prerequisites#selecting-a-transport
[5]:  https://en.wikipedia.org/wiki/IPv6_address#Local_addresses
[6]:  http://redis.io/topics/clients#maximum-number-of-clients
[7]:  ../../reference/redis/#redis-high-availability-configuration
