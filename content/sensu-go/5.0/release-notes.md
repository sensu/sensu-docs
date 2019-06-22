---
title: "Sensu Go release notes"
linkTitle: "Release Notes"
description: "Sensu Go version 5.0.0 release notes"
product: "Sensu Go"
version: "5.0"
menu: "sensu-go-5.0"
---

- [5.0.1 release notes](#5-0-1-release-notes)
- [5.0.0 release notes](#5-0-0-release-notes)

### Versioning
Sensu Go adheres to [semantic versioning][2] using MAJOR.MINOR.PATCH release numbers, starting at 5.0.0. MAJOR version changes indicate incompatible API changes; MINOR versions add backwards-compatible functionality; PATCH versions include backwards-compatible bug fixes.

### Upgrading

Read the [upgrade guide][1] for information on upgrading to the latest version of Sensu Go.

---

## 5.0.1 release notes

**December 12, 2018** &mdash; Sensu Go 5.0.1 includes our top bug fixes following last week's general availability release.
See the [upgrade guide][1] to upgrade Sensu to version 5.0.1.

**FIXED:**

- The Sensu backend can now successfully connect to an external etcd cluster.
- The Sensu dashboard now sorts silences in ascending order, correctly displays status values, and reduces shuffling in the event list.
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
[5]: https://github.com/sensu/sensu-go/blob/master/CHANGELOG.md#500---2018-11-30
[6]: https://blog.sensu.io/sensu-go-is-here
[7]: https://github.com/sensu/sandbox/tree/master/sensu-go/core
[8]: /sensu-go/5.0/installation/install-sensu
[9]: /sensu-go/5.0/guides/monitor-server-resources
