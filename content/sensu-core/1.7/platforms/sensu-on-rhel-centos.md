---
title: "RHEL/CentOS"
description: "User documentation for installing and operating Sensu on Red Hat
  Enterprise Linux and CentOS Linux systems."
weight: 6
version: "1.7"
product: "Sensu Core"
platformContent: true
menu:
  sensu-core-1.7:
    parent: platforms
---

# Sensu on RHEL/CentOS

## Reference documentation

- [Installing Sensu Core](#sensu-core)
  - [Install Sensu using YUM](#install-sensu-core-repository)
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

Sensu Core is installed on RHEL and CentOS systems via a native system installer
package (i.e. a .rpm file), which is available for download from the [Sensu
Downloads][1] page, and from YUM package management repositories. The Sensu Core
package installs several processes including `sensu-server`, `sensu-api`, and
`sensu-client`.

### Install Sensu using YUM (recommended) {#install-sensu-core-repository}

Sensu packages for Red Hat target currently supported versions of Red Hat
Enterprise Linux and their Centos equivalents. These packages are generally
expected to be compatible with Red Hat derivatives like SuSE, Amazon or
Scientific Linux, but packages are not tested on these platforms.

The following instructions describe configuring package repository definitions
using [Yum variables][14] as components of the baseurl. On Red Hat derivative
platforms the value of the `$releasever` variable will not typically align with
the RHEL release versions (e.g. `6` or `7`) advertised in the Sensu Yum
repository. Please use `6` or `7` in lieu of `$releasever` on RHEL derivatives,
depending on whether they use sysv init or systemd, respectively.

_NOTE: As of Sensu version 0.27, the yum repository URL has changed to
include the `$releasever` variable. To install or upgrade to the
latest version of Sensu, please ensure you have updated existing
repository configurations._

1. Create the YUM repository configuration file for the Sensu Core repository at
   `/etc/yum.repos.d/sensu.repo`:
   {{< highlight shell >}}
echo '[sensu]
name=sensu
baseurl=https://sensu.global.ssl.fastly.net/yum/$releasever/$basearch/
gpgkey=https://repositories.sensuapp.org/yum/pubkey.gpg
gpgcheck=1
enabled=1' | sudo tee /etc/yum.repos.d/sensu.repo{{< /highlight >}}

2. Install Sensu:
   {{< highlight shell >}}
sudo yum install sensu{{< /highlight >}}
   _NOTE: as mentioned above, the `sensu` package installs all of the Sensu Core
   processes, including `sensu-client`, `sensu-server`, and `sensu-api`._

3. Configure Sensu. **No "default" configuration is provided with Sensu**, so
   none of the Sensu processes will run without the corresponding configuration.
   Please refer to the ["Configure Sensu" section][10] (below), for more
   information on configuring Sensu. **At minimum, all of the Sensu processes
   will need a working [transport definition][11]**. The Sensu client will need
   a [client definition][12], and both the `sensu-server` and `sensu-api` will
   need a [data-store (Redis) definition][13] &mdash; all of which are explained
   below.

## Install Sensu Enterprise {#sensu-enterprise}

[Sensu Enterprise][2] is installed on RHEL and CentOS systems via a native
system installer package (i.e. a .rpm file). The Sensu Enterprise installer
package is made available via the Sensu Enterprise YUM repository, which
requires access credentials to access. The Sensu Enterprise packages install two
processes: `sensu-enterprise` (which provides the Sensu server and API from a
single process), and `sensu-enterprise-dashboard` (which provides the dashboard
API and web application).

_NOTE: Some versions of RHEL and CentOS may require the
[EPEL package repository][epel] to provide the required OpenJDK runtime._

_WARNING: Sensu Enterprise is designed to be a drop-in replacement for the Sensu
Core server and API, **only**. Sensu Enterprise uses the same `sensu-client`
process provided by the Sensu Core installer packages (above). As a result,
**Sensu Enterprise does not need to be installed on every system** being
monitored by Sensu._

### Install the Sensu Enterprise repository {#install-sensu-enterprise-repository}

1. Set access credentials as environment variables
   {{< highlight shell >}}
SE_USER=1234567890
SE_PASS=PASSWORD{{< /highlight >}}
   _NOTE: please replace `1234567890` and `PASSWORD` with the access credentials
   provided with your Sensu Enterprise subscription. These access
   credentials can be found by logging into the [Sensu Account Manager portal][15]._
   Confirm that you have correctly set your access credentials as environment
   variables
   {{< highlight shell >}}
$ echo $SE_USER:$SE_PASS
1234567890:PASSWORD{{< /highlight >}}

2. Create a YUM repository configuration file for the Sensu Enterprise
    repository at `/etc/yum.repos.d/sensu-enterprise.repo`:
   {{< highlight shell >}}
echo "[sensu-enterprise]
name=sensu-enterprise
baseurl=https://$SE_USER:$SE_PASS@enterprise.sensuapp.com/yum/noarch/
gpgkey=https://repositories.sensuapp.org/yum/pubkey.gpg
gpgcheck=1
enabled=1" | sudo tee /etc/yum.repos.d/sensu-enterprise.repo{{< /highlight >}}

3. Install Sensu Enterprise
   {{< highlight shell >}}
sudo yum install sensu-enterprise{{< /highlight >}}

4. Configure Sensu Enterprise. **No "default" configuration is provided with
   Sensu Enterprise**, so Sensu Enterprise will run without the corresponding
   configuration. Please refer to the ["Configure Sensu" section][11] (below)
   for more information on configuring Sensu Enterprise.

### Install the Sensu Enterprise Dashboard repository {#install-sensu-enterprise-dashboard-repository}

1. Set access credentials as environment variables
   {{< highlight shell >}}
SE_USER=1234567890
SE_PASS=PASSWORD{{< /highlight >}}
   _NOTE: please replace `1234567890` and `PASSWORD` with the access credentials
   provided with your Sensu Enterprise subscription. These access
   credentials can be found by logging into the [Sensu Account Manager portal][15]._
   Confirm that you have correctly set your access credentials as environment
   variables
   {{< highlight shell >}}
$ echo $SE_USER:$SE_PASS
1234567890:PASSWORD{{< /highlight >}}

2. Create a YUM repository configuration file for the Sensu Enterprise Dashboard
   repository at `/etc/yum.repos.d/sensu-enterprise-dashboard.repo`:
   {{< highlight shell >}}
echo "[sensu-enterprise-dashboard]
name=sensu-enterprise-dashboard
baseurl=https://$SE_USER:$SE_PASS@enterprise.sensuapp.com/yum/\$basearch/
gpgkey=https://repositories.sensuapp.org/yum/pubkey.gpg
gpgcheck=1
enabled=1" | sudo tee /etc/yum.repos.d/sensu-enterprise-dashboard.repo{{< /highlight >}}

4. Install Sensu Enterprise Dashboard
   {{< highlight shell >}}
sudo yum install sensu-enterprise-dashboard{{< /highlight >}}

5. Configure Sensu Enterprise Dashboard. **The default configuration
   will not work without modification** Please refer to the
   ["Example Sensu Enterprise Dashboard configurations" section][16] (below) for more information on
   configuring Sensu Enterprise Dashboard.

## Configure Sensu

By default, all of the Sensu services on RHEL and CentOS systems will load
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
mkdir /etc/sensu/conf.d{{< /highlight >}}

### Example client configuration

1. Copy the following contents to a configuration file located at
   `/etc/sensu/conf.d/client.json`:
   {{< highlight json >}}
{
  "client": {
    "name": "rhel-client",
    "address": "127.0.0.1",
    "environment": "development",
    "subscriptions": [
      "dev",
      "rhel-hosts"
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
   [transport definition specification][11]._

2. If the transport being used is running on a different host, additional configuration is required to tell the sensu client how to connect to the transport.
Please see [Redis][5] or [RabbitMQ][6] reference documentation for examples.

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

1. Create a configuration file  with the following contents at
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
such as [runit][7]). To enable Sensu services on system boot, use the
[`chkconfig` utility][8].

- Enable the Sensu client on system boot

  {{< highlight shell >}}
sudo chkconfig sensu-client on{{< /highlight >}}

- Enable the Sensu server and API to start on system boot
  - For Sensu Core users (i.e. `sensu-server` and `sensu-api`)

    {{< highlight shell >}}
sudo chkconfig sensu-server on
sudo chkconfig sensu-api on{{< /highlight >}}

  - For Sensu Enterprise users

    {{< highlight shell >}}
sudo chkconfig sensu-enterprise on{{< /highlight >}}

    _WARNING: the `sensu-enterprise` process is intended to be a drop-in
    replacement for the Sensu Core `sensu-server` and `sensu-api` processes.
    Please [ensure that the Sensu Core processes are not configured to start on
    system][8] boot before enabling Sensu Enterprise to start on system boot._

- Enable Sensu Enterprise Dashboard on system boot

  {{< highlight shell >}}
sudo chkconfig sensu-enterprise-dashboard defaults{{< /highlight >}}

  _WARNING: the `sensu-enterprise-dashboard` process is intended to be a drop-in
  replacement for the Uchiwa dashboard. Please ensure that the Uchiwa processes
  are not configured to start on system boot before enabling the Sensu
  Enterprise Dashboard to start on system boot._


### Disable the Sensu services on boot

If you have enabled Sensu services on boot and now need to disable them, this
can also be accomplished using the [`chkconfig` utility][9].

- Disable the Sensu client on system boot

  {{< highlight shell >}}
sudo chkconfig sensu-client off{{< /highlight >}}

- Disable the Sensu Core server on system boot

  {{< highlight shell >}}
sudo chkconfig sensu-server off{{< /highlight >}}

- Disable the Sensu Core API on system boot

  {{< highlight shell >}}
sudo chkconfig sensu-api off{{< /highlight >}}

- Disable Sensu Enterprise on system boot

  {{< highlight shell >}}
sudo chkconfig sensu-enterprise off{{< /highlight >}}

- Disable Sensu Enterprise Dashboard on system boot

  {{< highlight shell >}}
sudo chkconfig sensu-enterprise-dashboard remove{{< /highlight >}}

## Operating Sensu

### Managing the Sensu services/processes {#service-management}

To manually start and stop the Sensu services, use the following commands:

_NOTE: The `service` command will not work on CentOS 5, the sysvinit
script must be used, e.g. `sudo /etc/init.d/sensu-client start`_

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
[2]:  https://sensu.io/products/enterprise
[3]:  ../../reference/configuration/
[4]:  ../../reference/transport/
[5]:  ../../reference/redis/#configure-sensu
[6]:  ../../reference/rabbitmq/#sensu-rabbitmq-configuration
[7]:  http://smarden.org/runit/
[8]:  #disable-the-sensu-services-on-boot
[9]:  https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Deployment_Guide/s2-services-chkconfig.html
[10]: #configure-sensu
[11]: #example-transport-configuration
[12]: #example-client-configuration
[13]: #example-data-store-configuration
[14]: https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Deployment_Guide/sec-Using_Yum_Variables.html
[15]: https://account.sensu.io
[16]: #example-sensu-enterprise-dashboard-configurations
[epel]: https://www.fedoraproject.org/wiki/EPEL
