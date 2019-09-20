---
title: "Supported platforms"
linkTitle: "Supported Platforms"
description: "Sensu Go is available on a wide range of platforms, including Linux, Windows, and macOS. Read the guide to learn which platforms you can use the Sensu backend, Sensu agent, and the sensuctl command-line tool."
version: "5.13"
weight: 100
product: "Sensu Go"
menu:
  sensu-go-5.13:
    parent: installation
---

Sensu is available as packages, Docker images, and [binary-only distributions][4].
We recommend [installing Sensu][5] using one of our supported packages, Docker images, or [configuration management][6] integrations.
Sensu downloads are provided under the [Sensu License][7].

- [Supported packages](#supported-packages)
	- [Sensu backend](#sensu-backend)
	- [Sensu agent](#sensu-agent)
	- [Sensuctl command-line tool](#sensuctl-command-line-tool)
- [Docker images](#docker-images)
- [Integrations](#integrations)
- [Binary-only distributions](#binary-only-distributions)
- [Building from source](#building-from-source)

## Supported packages

Supported packages are available through [sensu/stable][8] on packagecloud and through the [downloads page][9].

### Sensu backend

| Platform & Version | `amd64` | | | |
|--------------------|---------|---|---|---|
| CentOS/RHEL 6      | ✅      |
| CentOS/RHEL 7      | ✅      |
| Ubuntu 14.04       | ✅      |
| Ubuntu 16.04       | ✅      |
| Ubuntu 18.04       | ✅      |
| Ubuntu 18.10       | ✅      |
| Ubuntu 19.04       | ✅      |
| Debian 8           | ✅      |
| Debian 9           | ✅      |
| Debian 10          | ✅      |

### Sensu agent

| Platform & Version | `amd64` | `386` | | | | |
|--------------------|---------|-------|---|---|---|---|
| CentOS/RHEL 6      | ✅      |
| CentOS/RHEL 7      | ✅      |
| Ubuntu 14.04       | ✅      |
| Ubuntu 16.04       | ✅      |
| Ubuntu 18.04       | ✅      |
| Ubuntu 18.10       | ✅      |
| Ubuntu 19.04       | ✅      |
| Debian 8           | ✅      |
| Debian 9           | ✅      |
| Debian 10          | ✅      |
| Windows Server 2008 R2 and later | ✅ | ✅ |
| Windows 7 and later | ✅     | ✅   |

### Sensuctl command-line tool

| Platform & Version | `amd64` | `386` | | | | |
|--------------------|---------|-------|---|---|---|---|
| CentOS/RHEL 6      | ✅      |
| CentOS/RHEL 7      | ✅      |
| Ubuntu 14.04       | ✅      |
| Ubuntu 16.04       | ✅      |
| Ubuntu 18.04       | ✅      |
| Ubuntu 18.10       | ✅      |
| Ubuntu 19.04       | ✅      |
| Debian 8           | ✅      |
| Debian 9           | ✅      |
| Debian 10          | ✅      |

## Docker images

Docker images containing the Sensu backend and Sensu agent are available for Linux-based containers.

| Image name | base
| ---------- | ------- |
| [sensu/sensu][10] | Alpine Linux
| [sensu/sensu-rhel][11] | Red Hat Enterprise Linux

## Integrations

- [Sensu Go Data Source plugin for Grafana][12]
- [Chef cookbook][13]
- [Puppet module][14]
- [Ansible role][17]

## Binary-only distributions

[Binary-only distributions][4] containing the Sensu backend, agent, and sensuctl tool are available in `.zip` and `.tar.gz` formats.

| Platform & Version | `amd64` | `arm64` | `armv5` | `armv6` |`armv7` | `386` |
|--------------------|---------|---------|---------|---------|--------|-------|
| Linux              | ✅      | ✅     | ✅      | ✅      | ✅     | ✅    |
| Windows            | ✅      |         |         |         |        | ✅    |
| macOS              | ✅      |         |         |         |        |       |

## Building from source

Sensu Go's core is open source software, freely available under an MIT license.
Sensu Go instances built from source do not include some free-tier and licensed-tier features such as the web UI homepage; see the [feature comparison matrix][15] to learn more.
To build Sensu Go from source, see the [contributing guide on GitHub][16].

[1]: ../../installation/install-sensu#install-the-sensu-backend
[2]: ../../installation/install-sensu#install-sensu-agents
[3]: ../../installation/install-sensu#install-sensuctl
[4]: ../verify
[5]: ../install-sensu
[6]: ../configuration-management
[7]: https://sensu.io/sensu-license
[8]: https://packagecloud.io/sensu/stable
[9]: https://sensu.io/products/downloads
[10]: https://hub.docker.com/r/sensu/sensu
[11]: https://hub.docker.com/r/sensu/sensu-rhel
[12]: https://github.com/sensu/grafana-sensu-go-datasource
[13]: https://github.com/sensu/sensu-go-chef
[14]: https://github.com/sensu/sensu-puppet
[15]: https://sensu.io/products
[16]: https://github.com/sensu/sensu-go/blob/master/CONTRIBUTING.md#building
[17]: https://github.com/jaredledvina/sensu-go-ansible
