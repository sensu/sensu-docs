---
title: "FreeBSD"
description: "User documentation for installing and operating Sensu on FreeBSD systems."
weight: 1
version: "1.0"
product: "Sensu Core"
platformContent: true
menu:
  sensu-core-1.0:
    parent: platforms
---

# Sensu on FreeBSD

## Reference documentation

- [Installing Sensu Core](#sensu-core)
  - [Download and install Sensu using the Sensu .txz file](#download-and-install-sensu-core)
- [Configure Sensu](#configure-sensu)
  - [Create the Sensu configuration directory](#create-the-sensu-configuration-directory)
  - [Example client configuration](#example-client-configuration)
  - [Example transport configuration](#example-transport-configuration)
- [Operating Sensu](#operating-sensu)
  - [Managing the Sensu client process](#service-management)

## Install Sensu Core {#sensu-core}

Sensu Core is installed on FreeBSD systems via a native system installer package
(i.e. a .txz file), which is available for download from the [Sensu
Downloads][1] page, and from [this repository (64-bit FreeBSD 10+ only)][2].

_WARNING: FreeBSD packages are currently as a "beta" release. Support for
running Sensu on FreeBSD will be provided on a best-effort basis until further
notice._

### Download and install Sensu using the Sensu Universal .txz file {#download-and-install-sensu-core}

_NOTE: As of Sensu version 0.27 package repository URLs have changed.
To install or upgrade to the latest version of Sensu, please ensure
you have updated existing configurations to follow the repository URL
format specified below._

1. Download Sensu from the [Sensu Downloads][1] page.
   _NOTE: FreeBSD packages are available for FreeBSD 10 and 11.
   Please visit the [Sensu Downloads][1] page for more information._

2. Install the `sensu-1.2.0_1.txz` package using the `pkg` utility:
   {{< highlight shell >}}
sudo pkg add ./sensu-1.2.0_1.txz{{< /highlight >}}

3. Configure the Sensu client. **No "default" configuration is provided with
   Sensu**, so the Sensu client will not run without the corresponding
   configuration. Please refer to the ["Configure Sensu" section][9] (below),
   for more information on configuring Sensu. **At minimum, the Sensu client
   will need a working [transport definition][10] and [client definition][11]**.

## Configure Sensu

By default, all of the Sensu services on FreeBSD systems will load configuration
from the following locations:

- `/usr/local/etc/sensu/config.json`
- `/usr/local/etc/sensu/conf.d/`

_NOTE: additional or alternative configuration file and directory locations may
be used by modifying Sensu's service configuration and/or by starting the Sensu
services with the corresponding CLI arguments. For more information, please
consult the [Sensu Configuration][5] reference documentation._

### Create the Sensu configuration directory

In some cases, the default Sensu configuration directory (i.e.
`/etc/sensu/conf.d/`) is not created by the Sensu installer, in which case it is
necessary to create this directory manually.

{{< highlight shell >}}
mkdir /usr/local/etc/sensu/conf.d{{< /highlight >}}

### Example client configuration

1. Copy the following contents to a configuration file located at
   `/usr/local/etc/sensu/conf.d/client.json`:
   {{< highlight json >}}
{
  "client": {
    "name": "freebsd-client",
    "address": "127.0.0.1",
    "environment": "development",
    "subscriptions": [
      "dev",
      "freebsd-hosts"
    ],
    "socket": {
      "bind": "127.0.0.1",
      "port": 3030
    }
  }
}{{< /highlight >}}

### Example Transport Configuration

At minimum, the Sensu client process requires configuration to tell it how to
connect to the configured [Sensu Transport][6].

1. Copy the following contents to a configuration file located at
   `/usr/local/etc/sensu/conf.d/transport.json`:
   {{< highlight json >}}
{
  "transport": {
    "name": "rabbitmq",
    "reconnect_on_error": true
  }
}{{< /highlight >}}
   _NOTE: if you are using Redis as your transport, please use `"name": "redis"`
   for your transport configuration. For more information, please visit the
   [transport definition specification][10]._

2. Please refer to the configuration instructions for the corresponding
   transport for configuration file examples (see [Redis][7], or [RabbitMQ][8]
   reference documentation).

## Operating Sensu

Coming soon...

[1]:  https://sensuapp.org/download
[2]:  https://sensu.global.ssl.fastly.net/freebsd/
[3]:  https://sensu.global.ssl.fastly.net/freebsd/FreeBSD:10:amd64/sensu/sensu-1.2.0_1.txz
[4]:  https://sensuapp.org/mit-license
[5]:  ../../reference/configuration/
[6]:  ../../reference/transport/
[7]:  ../../reference/redis/#sensu-redis-configuration
[8]:  ../../reference/rabbitmq/#sensu-rabbitmq-configuration
[9]:  #configure-sensu
[10]: #example-transport-configuration
[11]: #example-client-configuration