---
title: "Sensu Server and API"
description: "Read this page to learn about installing the Sensu Core (OSS) and Sensu Enterprise versions of the Sensu server and API."
weight: 3.1
product: "Sensu Core"
version: "1.9"
next: ../install-sensu-client
previous: ../installation-prerequisites
menu:
  sensu-core-1.9:
    parent: installation
---

The Sensu Server and API are available in two flavors:

- [Sensu Core](#sensu-core)
- [Sensu Enterprise](#sensu-enterprise)

_NOTE: only one flavor of the Sensu server & API should be used at any given
time. Sensu Enterprise users should skip Sensu Core server & API installation
and jump directly to [installing Sensu Enterprise][9]._

## Sensu Core (OSS) {#sensu-core}

_IMPORTANT: [Sensu Core reached end-of-life (EOL) on December 31, 2019][1], and we [permanently removed][2] the Sensu EOL repository on February 1, 2021. To migrate to Sensu Go, read [Migrate from Sensu Core and Sensu Enterprise to Sensu Go][3]._

Sensu Core is installed via native system installer package formats (e.g. .deb, .rpm, .msi, .pkg, etc), which are available for download using the links listed below and from package manager repositories for APT (for Ubuntu/Debian systems) and YUM (for RHEL/CentOS).

- FreeBSD
- IBM AIX
- Mac OS X
- Microsoft Windows
- Solaris 10 or Solaris 11
- RHEL/CentOS
- Ubuntu/Debian

The Sensu Core packages installs several processes, including `sensu-server`, `sensu-api`, and `sensu-client`.

- [Install the Sensu Core server & API on Ubuntu/Debian](../../platforms/sensu-on-ubuntu-debian/#sensu-core)
- [Install the Sensu Core server & API on RHEL/CentOS](../../platforms/sensu-on-rhel-centos/#sensu-core)

_NOTE: although Sensu Core packages are available for a variety of platforms
&ndash; thus making it technically possible to run the `sensu-server` and
`sensu-api` processes on non-Linux operating systems &ndash; we strongly
recommended running the Sensu Server and API on a Linux-based platform. Sensu
Core installer packages for non-Linux platforms are provided for the purpose of
making the `sensu-client` available, and are not tested as extensively for
running the `sensu-server` and `sensu-api` processes._

## Sensu Enterprise

_IMPORTANT: [Sensu Enterprise reached end-of-life (EOL) on March 31, 2020][1], and we [permanently removed][2] the Sensu EOL repository on February 1, 2021. To migrate to Sensu Go, read [Migrate from Sensu Core and Sensu Enterprise to Sensu Go][3]._

Sensu Enterprise is installed via native system installer packages for
Linux-based operating systems, only (i.e. .deb and .rpm). The Sensu Enterprise
installer packages are made available via the Sensu Enterprise software
repositories, which requires access credentials to access. The Sensu Enterprise
package installs a single executable, `sensu-enterprise`, which provides the
functionality of Sensu server and API in a single process.

- [Install Sensu Enterprise on Ubuntu/Debian](../../platforms/sensu-on-ubuntu-debian/#sensu-enterprise)
- [Install Sensu Enterprise on RHEL/CentOS](../../platforms/sensu-on-rhel-centos/#sensu-enterprise)

[1]: https://blog.sensu.io/eol-schedule-for-sensu-core-and-enterprise
[2]: https://discourse.sensu.io/t/updated-eol-timeline-for-sensu-core-and-sensu-enterprise-repos/2396
[3]: https://docs.sensu.io/sensu-go/latest/operations/maintain-sensu/migrate/
[9]: #sensu-enterprise
