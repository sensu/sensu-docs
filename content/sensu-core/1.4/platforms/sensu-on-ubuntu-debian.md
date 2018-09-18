---
title: "Ubuntu/Debian"
description: "User documentation for installing and operating Sensu on Ubuntu
  and Debian Linux systems."
weight: 7
version: "1.4"
product: "Sensu Core"
platformContent: true
menu:
  sensu-core-1.4:
    parent: platforms
---

# Sensu on Ubuntu/Debian

## Reference documentation

- [Installing Sensu Core](#sensu-core)
  - [Install Sensu using APT](#install-sensu-core-repository)
- [Installing Sensu Enterprise](#sensu-enterprise)
  - [Install the Sensu Enterprise repository](#install-sensu-enterprise-repository)
  - [Install the Sensu Enterprise Dashboard repository](#install-sensu-enterprise-dashboard-repository)
  - [Install Sensu Enterprise (server & API)](#install-sensu-enterprise)
- [Configure Sensu](#configure-sensu)
  - [Create the Sensu configuration directory](#create-the-sensu-configuration-directory)
  - [Example client configuration](#example-client-configuration)
  - [Example transport configuration](#example-transport-configuration)
  - [Example data store configuration](#example-data-store-configuration)
  - [Example API configurations](#example-api-configurations)
    - [Standalone configuration](#api-standalone-configuration)
    - [Distributed configuration](#api-distributed-configuration)
  - [Example Sensu Enterprise Dashboard configurations](#example-sensu-enterprise-dashboard-configurations)
    - [Standalone configuration](#dashboard-standalone-configuration)
    - [Distributed configuration](#dashboard-distributed-configuration)
  - [Enable the Sensu services to start on boot](#enable-the-sensu-services-to-start-on-boot)
  - [Disable the Sensu services on boot](#disable-the-sensu-services-on-boot)
- [Operating Sensu](#operating-sensu)
  - [Managing the Sensu services/processes](#service-management)

## Install Sensu Core {#sensu-core}

Sensu Core is installed on Ubuntu and Debian systems via a native system
installer package (i.e. a .deb file), which is available for download from the
[Sensu Downloads][1] page, and from APT package management repositories. The
Sensu Core package installs several processes including `sensu-server`,
`sensu-api`, and `sensu-client`.

Sensu packages for Debian target current [`stable` and `oldstable`
releases][15].

Sensu packages for Ubuntu target current [Long Term Support (LTS) releases][16].

If you wish to install Sensu packages on newer Debian or Ubuntu releases, please
try installing a package built for the most recent Debian `stable` or
Ubuntu LTS release.

### Install Sensu using APT (recommended) {#install-sensu-core-repository}

_NOTE: As of Sensu version 0.27, apt repository configuration has
changed to include the "codename" of the Ubuntu/Debian release. To
install or upgrade to the latest version of Sensu, please ensure you
have updated existing repository configurations._

1. Install the GPG public key:
   {{< highlight shell >}}
wget -q https://sensu.global.ssl.fastly.net/apt/pubkey.gpg -O- | sudo apt-key add -{{< /highlight >}}

2. Determine the codename of the Ubuntu/Debian release on your system:
   {{< highlight shell >}}
. /etc/os-release && echo $VERSION
"14.04.4 LTS, Trusty Tahr" # codename for this system is "trusty"{{< /highlight >}}

3. Create an APT configuration file at
   `/etc/apt/sources.list.d/sensu.list`:
   {{< highlight shell >}}
export CODENAME=your_release_codename_here # e.g. "trusty"
echo "deb     https://sensu.global.ssl.fastly.net/apt $CODENAME main" | sudo tee /etc/apt/sources.list.d/sensu.list{{< /highlight >}}

4. Update APT:
   {{< highlight shell >}}
sudo apt-get update{{< /highlight >}}

5. Install Sensu:
   {{< highlight shell >}}
sudo apt-get install sensu{{< /highlight >}}
   _NOTE: as mentioned above, the `sensu` package installs all of the Sensu Core
   processes, including `sensu-client`, `sensu-server`, and `sensu-api`._

6. Configure Sensu. **No "default" configuration is provided with Sensu**, so
   none of the Sensu processes will run without the corresponding configuration.
   Please refer to the ["Configure Sensu" section][11] (below), for more
   information on configuring Sensu. **At minimum, all of the Sensu processes
   will need a working [transport definition][12]**. The Sensu client will need
   a [client definition][13], and both the `sensu-server` and `sensu-api` will
   need a [data-store (Redis) definition][14] &mdash; all of which are explained
   below.

## Install Sensu Enterprise {#sensu-enterprise}

[Sensu Enterprise][2] is installed on Ubuntu and Debian systems via a native
system installer package (i.e. a .deb file). The Sensu Enterprise installer
package is made available via the Sensu Enterprise APT repository, which
requires access credentials to access. The Sensu Enterprise packages install two
processes: `sensu-enterprise` (which provides the Sensu server and API from a
single process), and `sensu-enterprise-dashboard` (which provides the dashboard
API and web application).

_WARNING: Sensu Enterprise is designed to be a drop-in replacement for the Sensu
Core server and API, **only**. Sensu Enterprise uses the same `sensu-client`
process provided by the Sensu Core installer packages (above). As a result,
**Sensu Enterprise does not need to be installed on every system** being
monitored by Sensu._

### Install the Sensu Enterprise repository {#install-sensu-enterprise-repository}

1. Set access credentials as environment variables:
   {{< highlight shell >}}
SE_USER=1234567890
SE_PASS=PASSWORD{{< /highlight >}}
   _NOTE: please replace `1234567890` and `PASSWORD` with the access credentials
   provided with your Sensu Enterprise subscription. These access
   credentials can be found by logging into the [Sensu Account Manager portal][17]._
   Confirm that you have correctly set your access credentials as environment
   variables
   {{< highlight shell >}}
$ echo $SE_USER:$SE_PASS
1234567890:PASSWORD{{< /highlight >}}

2. Install the GPG public key:
   {{< highlight shell >}}
wget -q http://$SE_USER:$SE_PASS@enterprise.sensuapp.com/apt/pubkey.gpg -O- | sudo apt-key add -{{< /highlight >}}

3. Create an APT configuration file at `/etc/apt/sources.list.d/sensu-enterprise.list`:
   {{< highlight shell >}}
echo "deb     http://$SE_USER:$SE_PASS@enterprise.sensuapp.com/apt sensu-enterprise main" | sudo tee /etc/apt/sources.list.d/sensu-enterprise.list{{< /highlight >}}

4. Update APT:
   {{< highlight shell >}}
sudo apt-get update{{< /highlight >}}

5. Install Sensu Enterprise:
   {{< highlight shell >}}
sudo apt-get install sensu-enterprise{{< /highlight >}}

6. Configure Sensu Enterprise. **No "default" configuration is provided with
   Sensu Enterprise**, so Sensu Enterprise will run without the corresponding
   configuration. Please refer to the ["Configure Sensu" section][11] (below)
   for more information on configuring Sensu Enterprise.

### Install the Sensu Enterprise Dashboard repository {#install-sensu-enterprise-dashboard-repository}

1. Set access credentials as environment variables:
   {{< highlight shell >}}
SE_USER=1234567890
SE_PASS=PASSWORD{{< /highlight >}}
   _NOTE: please replace `1234567890` and `PASSWORD` with the access credentials
   provided with your Sensu Enterprise subscription. These access
   credentials can be found by logging into the [Sensu Account Manager portal][17]._
   Confirm that you have correctly set your access credentials as environment
   variables
   {{< highlight shell >}}
$ echo $SE_USER:$SE_PASS
1234567890:PASSWORD{{< /highlight >}}

2. Install the GPG public key:
   {{< highlight shell >}}
wget -q http://$SE_USER:$SE_PASS@enterprise.sensuapp.com/apt/pubkey.gpg -O- | sudo apt-key add -{{< /highlight >}}

3. Create an APT configuration file at `/etc/apt/sources.list.d/sensu-enterprise.list`:
   {{< highlight shell >}}
echo "deb     http://$SE_USER:$SE_PASS@enterprise.sensuapp.com/apt sensu-enterprise main" | sudo tee /etc/apt/sources.list.d/sensu-enterprise.list{{< /highlight >}}

4. Update APT:
   {{< highlight shell >}}
sudo apt-get update{{< /highlight >}}

5. Install Sensu Enterprise Dashboard:
   {{< highlight shell >}}
sudo apt-get install sensu-enterprise-dashboard{{< /highlight >}}

6. Configure Sensu Enterprise Dashboard. **The default configuration
   will not work without modification** Please refer to the
   ["Example Sensu Enterprise Dashboard configurations" section][18] (below) for more information on
   configuring Sensu Enterprise Dashboard.

## Configure Sensu

By default, all of the Sensu services on Ubuntu and Debian systems will load
configuration from the following locations:

- `/etc/sensu/config.json`
- `/etc/sensu/conf.d/`

_NOTE: Additional or alternative configuration file and directory locations may
be used by modifying Sensu's service scripts and/or by starting the Sensu
services with the corresponding CLI arguments. For more information, please
consult the [Sensu Configuration][3] reference documentation._

### Create the Sensu configuration directory

In some cases, the default Sensu configuration directory (i.e.
`/etc/sensu/conf.d/`) is not created by the Sensu installer, in which case it is
necessary to create this directory manually.

{{< highlight shell >}}
sudo mkdir /etc/sensu/conf.d{{< /highlight >}}

### Example client configuration

1. Copy the following contents to a configuration file located at
   `/etc/sensu/conf.d/client.json`:
   {{< highlight json >}}
{
  "client": {
    "name": "ubuntu-client",
    "address": "127.0.0.1",
    "environment": "development",
    "subscriptions": [
      "dev",
      "ubuntu-hosts"
    ],
    "socket": {
      "bind": "127.0.0.1",
      "port": 3030
    }
  }
}{{< /highlight >}}

### Example transport configuration

At minimum, all of the Sensu processes require configuration to tell them how to
connect to the configured [Sensu Transport][4].

1. Copy the following contents to a configuration file located at
   `/etc/sensu/conf.d/transport.json`:
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
   transport for configuration file examples (see [Redis][5], or [RabbitMQ][6]
   reference documentation).

### Example data store configuration

The Sensu Core server and API processes, and the Sensu Enterprise process all
require configuration to tell them how to connect to Redis (the Sensu data
store). Please refer to the [Redis reference documentation][5] for configuration
file examples.

### Example API configurations

#### Standalone configuration {#api-standalone-configuration}

1. Copy the following contents to a configuration file located at
   `/etc/sensu/conf.d/api.json`:
   {{< highlight json >}}
{
  "api": {
    "host": "localhost",
    "bind": "0.0.0.0",
    "port": 4567
  }
}{{< /highlight >}}

#### Distributed configuration {#api-distributed-configuration}

1. Obtain the IP address of the system where the Sensu API is installed. For the
   purpose of this guide, we will use `10.0.1.7` as our example IP address.

2. Create a configuration file  with the following contents at
   `/etc/sensu/conf.d/api.json` on the Sensu server and API system(s):
   {{< highlight json >}}
{
  "api": {
    "host": "10.0.1.7",
    "bind": "10.0.1.7",
    "port": 4567
  }
}{{< /highlight >}}

### Example Sensu Enterprise Dashboard configurations

#### Standalone configuration {#dashboard-standalone-configuration}

1. Copy the following contents to a configuration file located at
   `/etc/sensu/dashboard.json`:
   {{< highlight json >}}
{
  "sensu": [
    {
      "name": "Datacenter 1",
      "host": "localhost",
      "port": 4567
    }
  ],
  "dashboard": {
    "host": "0.0.0.0",
    "port": 3000
  }
}{{< /highlight >}}

#### Distributed configuration {#dashboard-distributed-configuration}

1. Obtain the IP address of the system where Sensu Enterprise is installed. For
   the purpose of this guide, we will use `10.0.1.7` as our example IP address.

2. Copy the following contents to a configuration file located at
   `/etc/sensu/dashboard.json`:
   {{< highlight json >}}
{
  "sensu": [
    {
      "name": "Datacenter 1",
      "host": "10.0.1.7",
      "port": 4567
    }
  ],
  "dashboard": {
    "host": "0.0.0.0",
    "port": 3000
  }
}{{< /highlight >}}
   _NOTE: Multiple Sensu Enterprise Dashboard instances can be installed. When
   load balancing across multiple Dashboard instances, your load balancer should
   support "sticky sessions"._

3. The Sensu Enterprise Dashboard process requires configuration to tell it how
   to connect to Redis (the Sensu data store). Please refer to the [Redis
   installation instructions][5] for configuration file examples.

### Enable the Sensu services to start on boot

By default, the Sensu services are not configured to start automatically on
system boot (we recommend managing the Sensu services with a process supervisor
such as [runit][7]). To enable Sensu services on system
boot, use the `update-rc.d` utility. If you are using Ubuntu 16.04+ you will need
to use `systemctl` instead.

- Enable the Sensu client on system boot

  {{< highlight shell >}}
sudo update-rc.d sensu-client enable{{< /highlight >}}

- Enable the Sensu server and API to start on system boot

  - For Sensu Core users (i.e. `sensu-server` and `sensu-api`)

    {{< highlight shell >}}
sudo update-rc.d sensu-server enable
sudo update-rc.d sensu-api enable{{< /highlight >}}

  - For Sensu Enterprise users

    {{< highlight shell >}}
sudo update-rc.d sensu-enterprise enable{{< /highlight >}}

    _WARNING: the `sensu-enterprise` process is intended to be a drop-in
    replacement for the Sensu Core `sensu-server` and `sensu-api` processes.
    Please [ensure that the Sensu Core processes are not configured to start on
    system boot][8] before enabling Sensu Enterprise to start on system boot._

- Enable Sensu Enterprise Dashboard on system boot

  {{< highlight shell >}}
sudo update-rc.d sensu-enterprise-dashboard enable{{< /highlight >}}

  _WARNING: the `sensu-enterprise-dashboard` process is intended to be a drop-in
  replacement for the Uchiwa dashboard. Please ensure that the Uchiwa processes
  are not configured to start on system boot before enabling the Sensu
  Enterprise Dashboard to start on system boot._


### Disable the Sensu services on boot

If you have enabled Sensu services on boot and now need to disable them, this
can also be accomplished using the [`update-rc.d` utility][9].

- Disable the Sensu client on system boot

  {{< highlight shell >}}
sudo update-rc.d sensu-client disable{{< /highlight >}}

- Disable the Sensu Core server on system boot

  {{< highlight shell >}}
sudo update-rc.d sensu-server disable{{< /highlight >}}

- Disable the Sensu Core API on system boot

  {{< highlight shell >}}
sudo update-rc.d sensu-api disable{{< /highlight >}}

- Disable Sensu Enterprise on system boot

  {{< highlight shell >}}
sudo update-rc.d sensu-enterprise disable{{< /highlight >}}

- Disable Sensu Enterprise Dashboard on system boot

  {{< highlight shell >}}
sudo update-rc.d sensu-enterprise-dashboard disable{{< /highlight >}}

## Operating Sensu

### Managing the Sensu services/processes {#service-management}

To manually start and stop the Sensu services, use the following commands:

- Start or stop the Sensu client

  {{< highlight shell >}}
sudo service sensu-client start
sudo service sensu-client stop{{< /highlight >}}

- Start or stop the Sensu Core server

  {{< highlight shell >}}
sudo service sensu-server start
sudo service sensu-server stop{{< /highlight >}}

- Start or stop the Sensu Core API

  {{< highlight shell >}}
sudo service sensu-api start
sudo service sensu-api stop{{< /highlight >}}

- Start or stop Sensu Enterprise

  {{< highlight shell >}}
sudo service sensu-enterprise start
sudo service sensu-enterprise stop{{< /highlight >}}

- Start or stop the Sensu Enterprise Dashboard

  {{< highlight shell >}}
sudo service sensu-enterprise-dashboard start
sudo service sensu-enterprise-dashboard stop{{< /highlight >}}

  Verify the Sensu Enterprise Dashboard is running by visiting view the
  dashboard at http://localhost:3000 (replace `localhost` with the hostname or
  IP address where the Sensu Enterprise Dashboard is running).


[1]:  https://sensuapp.org/download
[2]:  https://sensuapp.org/enterprise
[3]:  ../../reference/configuration
[4]:  ../../reference/transport
[5]:  ../../reference/redis/#sensu-redis-configuration
[6]:  ../../reference/rabbitmq/#sensu-rabbitmq-configuration
[7]:  http://smarden.org/runit/
[8]:  #disable-the-sensu-services-on-boot
[9]:  http://manpages.ubuntu.com/manpages/precise/man8/update-rc.d.8.html
[10]: ../../reference/transport#transport-definition-specification/
[11]: #configure-sensu
[12]: #example-transport-configuration
[13]: #example-client-configuration
[14]: #example-data-store-configuration
[15]: https://wiki.debian.org/DebianReleases
[16]: https://wiki.ubuntu.com/LTS
[17]: https://account.sensu.io
[18]: #example-sensu-enterprise-dashboard-configurations
