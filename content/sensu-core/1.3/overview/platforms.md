---
title: "Supported Platforms"
description: "Supported platforms"
product: "Sensu Core"
version: "1.3"
weight: 4
previous: ../architecture
menu:
  sensu-core-1.3:
    parent: overview
---

## Sensu Core

All versions of Sensu (including Sensu Enterprise) are based on the same core
components and functionality, which are provided by the [Sensu open-source
software project][1] and collectively referred to as Sensu Core. Sensu Core
provides multiple processes, including the [Sensu server][2] (`sensu-server`),
[Sensu API][3] (`sensu-api`), and [Sensu client][4] (`sensu-client`).

Installer packages are available for most modern operating systems via native
installer packages (e.g. .deb, .rpm, .msi, .pkg, etc) which are available for
download using the links below and from package manager repositories for
APT (for Ubuntu/Debian systems), and YUM (for RHEL/CentOS).

- [FreeBSD][7]
- [IBM AIX][8]
- [Mac OS X][9]
- [Microsoft Windows][10]
- [Solaris 10][11] or [Solaris 11][12]
- [RHEL/CentOS][13]
- [Ubuntu/Debian][14]

_NOTE: although Sensu Core packages are available for a variety of platforms
&ndash; thus making it technically possible to run the `sensu-server` and
`sensu-api` processes on non-Linux operating systems &ndash; **we strongly
recommend running the Sensu Server and API on a Linux-based platform**. Sensu
Core installer packages for non-Linux platforms are provided for the purpose of
making the `sensu-client` available, and are not tested as extensively for
running the `sensu-server` and `sensu-api` processes._

### Sensu Server & API

- [Ubuntu/Debian](../../platforms/sensu-on-ubuntu-debian#sensu-core)
- [RHEL/CentOS](../../platforms/sensu-on-rhel-centos#sensu-core)

### Sensu Client

- [Ubuntu/Debian](../../platforms/sensu-on-ubuntu-debian/#sensu-core)
- [RHEL/CentOS](../../platforms/sensu-on-rhel-centos/#sensu-core)
- [Microsoft Windows](../../platforms/sensu-on-microsoft-windows/#sensu-core)
- [Mac OS X](../../platforms/sensu-on-mac-os-x/#sensu-core)
- [FreeBSD](../../platforms/sensu-on-freebsd/#sensu-core)
- [IBM AIX](../../platforms/sensu-on-ibm-aix/#sensu-core)
- [Oracle Solaris](../../platforms/sensu-on-oracle-solaris/#sensu-core)

## Sensu Enterprise

[Sensu Enterprise][5] is designed to be a drop-in replacement for the Sensu Core
server and API, _only_ (i.e. Sensu Enterprise uses the same client as Sensu
Core). Sensu Enterprise provides a single process called `sensu-enterprise`
which provides [added-value][6] replacements for the Sensu Core server
(`sensu-server`) and API (`sensu-api`).

### Sensu Enterprise Server & API

- [Ubuntu/Debian](../../platforms/sensu-on-ubuntu-debian#sensu-enterprise)
- [RHEL/CentOS](../../platforms/sensu-on-rhel-centos#sensu-enterprise)

### Sensu Enterprise Client

As mentioned above, **Sensu Enterprise uses the same `sensu-client` process as
Sensu Core**. By sharing the same open-source monitoring agent, upgrading to
Sensu Enterprise from Sensu Core is simplified, as there's no need to upgrade
agents &mdash; simply replace the server and API components. Consequently,
**Sensu Enterprise does not need to be installed on every system being monitored
by Sensu**.

[1]:  https://github.com/sensu
[2]:  ../../reference/server/
[3]:  ../../api/overview/
[4]:  ../../reference/clients/
[5]:  https://sensu.io/products/enterprise
[6]:  https://sensu.io/products/enterprise
[7]: https://repositories.sensuapp.org/freebsd/
[8]: https://repositories.sensuapp.org/aix/
[9]: https://repositories.sensuapp.org/osx/
[10]: https://repositories.sensuapp.org/msi/
[11]: https://repositories.sensuapp.org/solaris/pkg/
[12]: https://repositories.sensuapp.org/solaris/ips/
[13]: https://repositories.sensuapp.org/yum/
[14]: https://repositories.sensuapp.org/apt/pool/
