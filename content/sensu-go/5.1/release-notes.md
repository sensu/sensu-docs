---
title: "Sensu Go release notes"
linkTitle: "Release Notes"
description: "Sensu Go version 5.1.1 release notes"
product: "Sensu Go"
version: "5.1"
menu: "sensu-go-5.1"
---

- [5.1.1 release notes](#5-1-1-release-notes)
- [5.1.0 release notes](#5-1-0-release-notes)
- [5.0.1 release notes](#5-0-1-release-notes)
- [5.0.0 release notes](#5-0-0-release-notes)

### Versioning
Sensu Go adheres to [semantic versioning][2] using MAJOR.MINOR.PATCH release numbers, starting at 5.0.0. MAJOR version changes indicate incompatible API changes; MINOR versions add backwards-compatible functionality; PATCH versions include backwards-compatible bug fixes.

### Upgrading

Read the [upgrading guide][1] for information on upgrading to the latest version of Sensu Go.

---

## 5.1.1 release notes

**January 24, 2019** &mdash; The latest patch release of Sensu Go, version 5.1.1, is now available for download. This release includes some key fixes and improvements, including refactored keepalive functionality with increased reliability. Additionally, based on Community feedback, we have added support for the Sensu agent and sensuctl for 32-bit Windows systems.
See the [upgrading guide][1] to upgrade Sensu to version 5.1.1.

### Changes to Sensu Go {#5.1.1-changes}

**NEW FEATURES:**

- Sensu now includes a sensuctl command and API endpoint to test user credentials. See the [access control reference][10] and [API docs][11] for more information.

**IMPROVEMENTS:**

- The Sensu agent and sensuctl tool are now available for 32-bit Windows. See the [installation guide][12] for instructions.
- Keepalive events now include an output attribute specifying the entity name and time last sent.
- The Sensu backend includes refactored authentication and licensing to support future enterprise features.

**SECURITY:**

- Sensu 5.1.1 is built with Go version 1.11.5. Go 1.11.5 addresses a security vulnerability impacting TLS handshakes and JWT tokens. See the [CVE][13] for more information.

**FIXES:**

- Keepalive events now continue to execute after a Sensu cluster restarts.
- When requested, on-demand check executions now correctly retrieve asset dependencies.
- Checks now maintain a consistent execution schedule following updates to the check definition.
- Proxy check request errors now include the check name and namespace.
- When encountering an invalid line during metric extraction, Sensu now logs an error and continues extraction.
- sensuctl now returns an error when attempting to delete a non-existent entity.
- sensuctl now removes the temporary file it creates when executing the `sensuctl edit` command.
- The Sensu dashboard now recovers from errors correctly when shutting down.
- The Sensu dashboard includes better visibility for buttons and menus in the dark theme.

## 5.1.0 release notes

**December 19, 2018** &mdash; The latest release of Sensu Go, version 5.1.0, is now available for download. 
This release includes an important change to the Sensu backend state directory as well as support for Ubuntu 14.04 and some key bug fixes.
See the [upgrading guide][1] to upgrade Sensu to version 5.1.0.

### Changes to Sensu Go {#5.1.0-changes}

**IMPORTANT:**

- _NOTE: This applies only to Sensu backend binaries downloaded from `s3-us-west-2.amazonaws.com/sensu.io/sensu-go`, not to Sensu RPM or DEB packages._
For Sensu backend binaries, the default `state-dir` is now `/var/lib/sensu/sensu-backend` instead of `/var/lib/sensu`. To upgrade your Sensu backend binary to 5.1.0, make sure your `/etc/sensu/backend.yml` configuration file specifies a `state-dir`. See the [upgrading guide][3] for more information.

**NEW FEATURES:**

- Sensu [agents][4] now include `trusted-ca-file` and `insecure-skip-tls-verify` configuration flags, giving you more flexibility with certificates when connecting agents to the backend over TLS.

**IMPROVEMENTS:**

- Sensu now includes support for Ubuntu 14.04.

**FIXES:**

- The Sensu backend now successfully connects to an external etcd cluster.
- SysVinit scripts for the Sensu agent and backend now include correct run and log paths.
- Once created, keepalive alerts and check TTL failure events now continue to occur until a successful event is observed.
- When querying for an empty list of assets, sensuctl and the Sensu API now return an empty array instead of null.
- The sensuctl `create` command now successfully creates hooks when provided with the correct definition.
- The Sensu dashboard now renders status icons correctly in Firefox.

## 5.0.1 release notes

**December 12, 2018** &mdash; Sensu Go 5.0.1 includes our top bug fixes following last week's general availability release.
See the [upgrading guide][1] to upgrade Sensu to version 5.0.1.

### Changes to Sensu Go {#5.0.1-changes}

**FIXED:**

- The Sensu backend can now successfully connect to an external etcd cluster.
- The Sensu dashboard now sorts silencing entries in ascending order, correctly displays status values, and reduces shuffling in the event list.
- Sensu agents on Windows now execute command arguments correctly.
- Sensu agents now correctly include environment variables when executing checks.
- Command arguments are no longer escaped on Windows.
- Sensu backend environments now include handler and mutator execution requests.

## 5.0.0 release notes

**December 5, 2018** &mdash; We're excited to announce the general availability release of Sensu Go!
Sensu Go is the flexible monitoring event pipeline, written in Go and designed for container-based and hybrid-cloud infrastructures.
Check out the [Sensu blog][6] for more information about Sensu Go and version 5.0.

For a complete list of changes from Beta 8-1, see the [Sensu Go changelog][5].
Going forward, this page will be the official home for the Sensu Go changelog and release notes.

To get started with Sensu Go:

- [Download the sandbox][7]
- [Install Sensu Go][8]
- [Get started monitoring server resources][9]

[1]: /sensu-go/latest/installation/upgrade
[2]: https://semver.org/spec/v2.0.0.html
[3]: /sensu-go/5.1/installation/upgrade#upgrading-sensu-backend-binaries-to-5-1-0
[4]: /sensu-go/5.1/reference/agent
[5]: https://github.com/sensu/sensu-go/blob/master/CHANGELOG.md#500---2018-11-30
[6]: https://blog.sensu.io/sensu-go-is-here
[7]: https://github.com/sensu/sandbox/tree/master/sensu-go/core
[8]: /sensu-go/5.0/installation/install-sensu
[9]: /sensu-go/5.0/guides/monitor-server-resources
[10]: /sensu-go/5.1/reference/rbac#managing-users
[11]: /sensu-go/5.1/api/auth
[12]: /sensu-go/5.1/installation/install-sensu
[13]: https://nvd.nist.gov/vuln/detail/CVE-2019-6486
