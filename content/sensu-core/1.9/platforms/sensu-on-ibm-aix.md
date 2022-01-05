---
title: "IBM AIX"
description: "Read this page for detailed information about installing and operating Sensu on IBM AIX systems via a native system installer package."
weight: 2
version: "1.9"
product: "Sensu Core"
platformContent: false
menu:
  sensu-core-1.9:
    parent: platforms
---

## Sensu on IBM AIX

- [Installing Sensu Core](#sensu-core)
  - [Download and install Sensu using the Sensu .bff file](#download-and-install-sensu-core)
- [Configure Sensu](#configure-sensu)
  - [Create the Sensu configuration directory](#create-the-sensu-configuration-directory)
  - [Example client configuration](#example-client-configuration)
  - [Example transport configuration](#example-transport-configuration)
- [Operating Sensu](#operating-sensu)
  - [Managing the Sensu client process](#service-management)
  - [Rotating Sensu Logs](#rotating-sensu-logs)
- [Known limitations](#known-limitations)
  - [Foreign Function Interface](#foreign-function-interface)

## Install Sensu Core {#sensu-core}

_IMPORTANT: [Sensu Core reached end-of-life (EOL) on December 31, 2019][17], and we [permanently removed][18] the Sensu EOL repository on February 1, 2021.<br><br>This means the packages specified in the instructions below are no longer available. To migrate to Sensu Go, read the [Sensu Core migration guide][19]._

Sensu Core is installed on IBM AIX systems via a native system installer package
(i.e. a .bff file).

### Download and install Sensu using the Sensu .bff package {#download-and-install-sensu-core}

_NOTE: As of Sensu version 0.27 repository URLs have changed.  To
install or upgrade to the latest version of Sensu, please ensure you
have updated existing configurations to follow the repository URL
format specified below._

1. Download the Sensu AIX package.

2. The Sensu installer package for IBM AIX systems is provided in **backup file
   format** (.bff). In order to install the content, you will need to know the
   "Fileset Name". Display the content using the `installp` utility.
   {{< code shell >}}
installp -ld sensu-1.4.1-1.powerpc.bff{{< /code >}}
   Once you have collected the fileset name, you can optionally proceed to
   preview installation using the `installp` utility, with the `-p` (preview)
   flag.
   {{< code shell >}}
installp -apXY -d sensu-1.4.1-1.powerpc.bff sensu{{< /code >}}

3. Install Sensu using the `installp` utility.
   {{< code shell >}}
installp -aXY -d sensu-1.4.1-1.powerpc.bff sensu{{< /code >}}
   _NOTE: this command uses the following `installp` utilty flags: `-a` to apply
   changes to the system, `-X` to extend the file system, and `-Y` to accept the
   [Sensu MIT License][4]._

4. Configure the Sensu client. **No "default" configuration is provided with
   Sensu**, so the Sensu Client will not start without the corresponding
   configuration. Please refer to the ["Configure Sensu" section][10] (below)
   for more information on configuring Sensu. **At minimum, the Sensu client
   will need a working [transport definition][11] and [client definition][12]**.

## Configure Sensu

By default, all of the Sensu services on IBM AIX systems will load configuration
from the following locations:

- `/etc/sensu/config.json`
- `/etc/sensu/conf.d/**/*.json`

_NOTE: additional or alternative configuration file and directory locations may
be used by modifying Sensu's service configuration and/or by starting the Sensu
services with the corresponding CLI arguments. For more information, please
consult the [Sensu Configuration][5] reference documentation._

The following Sensu configuration files are provided as examples. Please review
the [Sensu configuration reference documentation][5] for additional information
on how Sensu is configured.

### Create the Sensu configuration directory

In some cases, the default Sensu configuration directory (i.e.
`/etc/sensu/conf.d/`) is not created by the Sensu installer, in which case it is
necessary to create this directory manually.

{{< code shell >}}
mkdir /etc/sensu/conf.d{{< /code >}}

### Example client configuration

1. Copy the following contents to a configuration file located at
   `/etc/sensu/conf.d/client.json`:
   {{< code json >}}
{
  "client": {
    "name": "aix-client",
    "address": "localhost",
    "environment": "development",
    "subscriptions": [
      "dev",
      "aix-hosts"
    ],
    "socket": {
      "bind": "127.0.0.1",
      "port": 3030
    }
  }
}{{< /code >}}

### Example Transport Configuration

At minimum, the Sensu client process requires configuration to tell it how to
connect to the configured [Sensu Transport][6].

1. Copy the following contents to a configuration file located at
   `/etc/sensu/conf.d/transport.json`:
   {{< code json >}}
{
  "transport": {
    "name": "rabbitmq",
    "reconnect_on_error": true
  }
}{{< /code >}}
   _NOTE: if you are using Redis as your transport, please use `"name": "redis"`
   for your transport configuration. For more information, please visit the
   [transport definition specification][13]._

2. If the transport being used is running on a different host, additional configuration is required to tell the sensu client how to connect to the transport.
Please see [Redis][7] or [RabbitMQ][8] reference documentation for examples.

## Operating Sensu

### Managing the Sensu client process {#service-management}

Start or stop the Sensu client using the [`startsrc` and `stopsrc`
utilities][10]:

{{< code shell >}}
startsrc -s sensu-client
stopsrc -s sensu-client{{< /code >}}

### Rotating Sensu Logs

Sensu comes packaged with logrotate rules. However, on AIX, you'll need to install an additional package to take advantage of those rules. You can install the `logrotate` package listed [here][aix-logrotate]. Once installed, the rules present in `/etc/logrotate.d/sensu` will be used.

## Known limitations

Please note the following platform-specific limitations affecting Sensu on AIX
at this time. Unless otherwise stated, all documented functions of the Sensu
client are supported.

### Foreign Function Interface

[Foreign Function Interface (FFI)][9] calls on Sensu's embedded Ruby on AIX are
not working at this time, so any Ruby-based Sensu plugins that require FFI will
not work (however all other plugins should work). It is possible that FFI
support will be enabled in a future release.

[4]:  https://sensuapp.org/mit-license
[5]:  ../../reference/configuration/
[6]:  ../../reference/transport/
[7]:  ../../reference/redis/#configure-sensu
[8]:  ../../reference/rabbitmq/#sensu-rabbitmq-configuration
[9]:  https://github.com/ffi/ffi
[10]: #configure-sensu
[11]: #example-transport-configuration
[12]: #example-client-configuration
[13]: ../../reference/transport/#transport-definition-specification
[17]: https://blog.sensu.io/eol-schedule-for-sensu-core-and-enterprise
[18]: https://discourse.sensu.io/t/updated-eol-timeline-for-sensu-core-and-sensu-enterprise-repos/2396
[19]: https://docs.sensu.io/sensu-go/latest/operations/maintain-sensu/migrate/

<!-- Supplemental links -->
[aix-logrotate]: https://www.ibm.com/developerworks/aix/library/aix-toolbox/alpha.html#L
