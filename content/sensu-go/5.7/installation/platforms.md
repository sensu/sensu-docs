---
title: "Supported platforms"
linkTitle: "Supported Platforms"
description: "Sensu Go is available on a wide range of platforms, including Linux, Windows, and macOS. Read the guide to learn which platforms you can use the Sensu backend, Sensu agent, and the sensuctl command-line tool."
version: "5.7"
weight: 100
product: "Sensu Go"
menu:
  sensu-go-5.7:
    parent: installation
aliases:
  - /sensu-go/5.7/getting-started/platforms
---

### Sensu backend

The Sensu backend is available for 64-bit Linux.
See the [backend installation guide][1] for more information.

| Platform & Version | `amd64` | | | |
|--------------------|---------|---|---|---|
| CentOS/RHEL 6      | ✅      |
| CentOS/RHEL 7      | ✅      |
| Ubuntu 14.04       | ✅      |
| Ubuntu 16.04       | ✅      |
| Ubuntu 18.04       | ✅      |
| Ubuntu 18.10       | ✅      |
| Debian 8           | ✅      |
| Debian 9           | ✅      |

### Sensu agent

The Sensu agent is available for Linux and Windows.
See the [agent installation guide][2] for more information.

| Platform & Version | `amd64` | `386` | | | | |
|--------------------|---------|-------|---|---|---|---|
| CentOS/RHEL 6      | ✅      |
| CentOS/RHEL 7      | ✅      |
| Ubuntu 14.04       | ✅      |
| Ubuntu 16.04       | ✅      |
| Ubuntu 18.04       | ✅      |
| Ubuntu 18.10       | ✅      |
| Debian 8           | ✅      |
| Debian 9           | ✅      |
| Windows Server 2008 R2 and later | ✅ | ✅ |
| Windows 7 and later | ✅     | ✅   |

### Sensuctl command-line tool

Sensuctl is available for Linux, Windows, and macOS.
See the [sensuctl installation guide][3] for more information.

| Platform & Version | `amd64` | `386` | | | | |
|--------------------|---------|-------|---|---|---|---|
| CentOS/RHEL 6      | ✅      |
| CentOS/RHEL 7      | ✅      |
| Ubuntu 14.04       | ✅      |
| Ubuntu 16.04       | ✅      |
| Ubuntu 18.04       | ✅      |
| Ubuntu 18.10       | ✅      |
| Debian 8           | ✅      |
| Debian 9           | ✅      |
| Windows 7 and later | ✅     |
| Windows Server 2008 R2 and later | ✅ | ✅ |
| macOS 10.10 and later | ✅   |

[1]: ../../installation/install-sensu#install-the-sensu-backend
[2]: ../../installation/install-sensu#install-the-sensu-agent
[3]: ../../installation/install-sensu#install-sensuctl
