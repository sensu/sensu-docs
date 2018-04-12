---
title: "Sensu Client"
description: "The complete Sensu installation guide."
weight: 11 
product: "Sensu Core"
version: "1.3"
next: ../install-a-dashboard
previous: ../install-sensu-server-api
menu:
  sensu-core-1.3:
    parent: installation
---

Having successfully installed and configured a Sensu server and API (Sensu Core
or Sensu Enterprise), let's now install and/or configure a Sensu client. The
Sensu client is run on every system you need to monitor, including those running
the Sensu server and API, and Sensu's dependencies (i.e. RabbitMQ and/or
Redis). **Both Sensu Core and Sensu Enterprise use the same Sensu client
process** (i.e. `sensu-client`), so upgrading from Sensu Core to Sensu
Enterprise does not require you to install a difference Sensu client.

## Included in Sensu Core

The Sensu client process (`sensu-client`) is part of the open source Sensu
project (i.e. Sensu Core) and it is included in the Sensu Core installer
packages along with the Sensu Core server and API processes (i.e. `sensu-server`
and `sensu-api`). This means that if you are following the instructions in this
guide for a [standalone][1] installation, your Sensu client is already
installed!

## Disabled by default

The Sensu client process (`sensu-client`) is disabled by default on all
platforms. Please refer to the corresponding configuration and operation
documentation corresponding to the platform where you have installed your Sensu
client(s) for instructions on starting & stopping the Sensu client process,
and/or enabling the Sensu client process to start automatically on system boot.

## Platforms

To continue with this guide, please refer to the **Install Sensu Core**,
**Configure Sensu**, and **Operating Sensu** instructions corresponding to the
platform(s) where you will run your Sensu client(s).

- [Ubuntu/Debian](../../platforms/sensu-on-ubuntu-debian/#sensu-core)
- [RHEL/CentOS](../../platforms/sensu-on-rhel-centos/#sensu-core)
- [Microsoft Windows](../../platforms/sensu-on-microsoft-windows/#sensu-core)
- [Mac OS X](../../platforms/sensu-on-mac-os-x/#sensu-core)
- [FreeBSD](../../platforms/sensu-on-freebsd/#sensu-core)
- [IBM AIX](../../platforms/sensu-on-ibm-aix/#sensu-core)
- [Oracle Solaris](../../platforms/sensu-on-oracle-solaris/#sensu-core)



[1]:  installation-strategies#standalone
