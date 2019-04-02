---
title: "Sensu Go release notes"
linkTitle: "Release Notes"
description: "Read the Sensu Go 5.5.0 release notes to learn about what's new in our latest release."
product: "Sensu Go"
version: "5.5"
menu: "sensu-go-5.5"
---

- [5.5.0 release notes](#5-5-0-release-notes)
- [5.4.0 release notes](#5-4-0-release-notes)
- [5.3.0 release notes](#5-3-0-release-notes)
- [5.2.1 release notes](#5-2-1-release-notes)
- [5.2.0 release notes](#5-2-0-release-notes)
- [5.1.1 release notes](#5-1-1-release-notes)
- [5.1.0 release notes](#5-1-0-release-notes)
- [5.0.1 release notes](#5-0-1-release-notes)
- [5.0.0 release notes](#5-0-0-release-notes)

### Versioning
Sensu Go adheres to [semantic versioning][2] using MAJOR.MINOR.PATCH release numbers, starting at 5.0.0. MAJOR version changes indicate incompatible API changes; MINOR versions add backwards-compatible functionality; PATCH versions include backwards-compatible bug fixes.

### Upgrading

Read the [upgrade guide][1] for information on upgrading to the latest version of Sensu Go.

---

## 5.5.0 release notes

**April 4, 2019** &mdash;
See the [upgrade guide][1] to upgrade Sensu to version 5.5.0.

**NEW FEATURES:**

- Tessen, the Sensu call-home service, is now enabled by default in all Sensu backends. See the [Tessen reference][27] for configuration instructions, and read the [blog post][28] to learn more about the data that Tessen collects.

**IMPROVEMENTS:**

- 

**FIXES:**

- 

## 5.4.0 release notes

**March 27, 2019** &mdash; The latest release of Sensu Go, version 5.4.0, is now available for download. This release has some very exciting feature additions including the introduction of our new homepage. 5.4.0 also includes support for API pagination to more efficiently handle large data sets and agent buffering for robustness in lower connectivity situations along with key bug fixes.
See the [upgrade guide][1] to upgrade Sensu to version 5.4.0.

**NEW FEATURES:**

- The Sensu dashboard now includes a homepage designed to highlight the most important monitoring data, giving you instant insight into the state of your infrastructure. See the [dashboard docs][23] for a preview.
- The Sensu API now supports pagination using the `limit` and `continue` query parameters, letting you limit your API responses to a maximum number of objects and making it easier to handle large data sets. See the [API overview][22] for more information.

**IMPROVEMENTS:**

- Sensu now lets you specify a separate TLS certificate and key to secure the dashboard. See the [backend reference][24] to configure the `dashboard-cert-file` and `dashboard-key-file` flags, and check out the [guide to securing Sensu][25] for the complete guide to making your Sensu instance production-ready.
- The Sensu agent events API now queues events before sending them to the backend, making the agent events API more robust and preventing data loss in the event of a loss of connection with the backend or agent shutdown. See the [agent reference][26] for more information.

**FIXES:**

- The backend now processes events without persisting metrics to etcd.
- The events API POST and PUT endpoints now add the current timestamp to new events by default.
- The users API now returns a 404 response code in the event that a username cannot be found.
- The sensuctl command line tool now correctly accepts global flags when passed after a sub-command flag (for example: `--format yaml --namespace development`).
- The `sensuctl handler delete` and `sensuctl filter delete` commands now correctly delete resources from the currently configured namespace.
- The agent now terminates consistently on SIGTERM and SIGINT.
- In the event of a loss of connection with the backend, the agent now attempts to reconnect to any backends specified in its configuration.
- The dashboard now handles cases in which the creator of a silence is inaccessible.
- The dashboard event details page now displays "-" in the command field if no command is associated with the event.

## 5.3.0 release notes

**March 11, 2019** &mdash; The latest release of Sensu Go, version 5.3.0, is now available for download. This release has some very exciting feature additions and key bug fixes. 5.3.0 enables Active Directory to be configured as an authentication provider with a valid license key. Additionally, round robin scheduling has been fully re-implemented and is available for use.
See the [upgrade guide][1] to upgrade Sensu to version 5.3.0.

**NEW FEATURES:**

- Round-robin check scheduling lets you distribute check executions evenly over a group of Sensu agents. To enable round-robin scheduling, set the `round_robin` check attribute to `true`. See the [check reference][18] for more information.
- Sensu now provides [enterprise-only][19] support for using Microsoft Active Directory as an external authentication provider. Read the [authentication guide][20] to configure Active Directory, and check out the [getting started guide][19] for more information about licensing.
- The dashboard now features offline state detection and displays an alert banner in the event that the dashboard loses connection to the backend.

**IMPROVEMENTS:**

- The agent socket event format now supports the `handlers` attribute, giving you the ability to send socket events to a Sensu pipeline. See the [agent reference][21] to learn more about creating and handling monitoring events using the agent socket.
- Assets now feature improved download performance using buffered I/O.
- The sensuctl CLI now uses a 15-second timeout period when connecting to the Sensu backend.
- The dashboard now includes expandable configuration details sections on the check and entity pages. You can now use the dashboard to review check details like command, subscriptions, and scheduling, as well as entity details like platform, IP address, and hostname.

**SECURITY:**

- Sensu Go 5.3.0 fixes all known TLS vulnerabilities affecting the backend, including increasing the minimum supported TLS version to 1.2 and removing all ciphers except those with perfect forward secrecy.
- Sensu now enforces uniform TLS configuration for all three backend components: `apid`, `agentd`, `dashboardd`.
- The backend no longer requires the `trusted-ca-file` flag when using TLS.
- The backend no longer loads server TLS configuration for the HTTP client.

**FIXES:**

- Sensu can now download assets with download times over 30 seconds without timing out.
- The agent now communicates entity subscriptions to the backend in the correct format.
- Sensu no longer includes the `edition` configuration attribute or header.
- DNS resolution in Alpine Linux containers now uses the built-in Go resolver instead of the glibc resolver.
- The `sensuctl user list` command can now output `yaml` and `wrapped-json` formats when used with the `--format` flag.
- The dashboard check details page now displays long commands correctly.
- The dashboard check details page now displays the `timeout` attribute correctly.

## 5.2.1 release notes

**February 11, 2019** &mdash; The latest release of Sensu Go, version 5.2.1, is now available for download. This release is a stability release with a key bug fix for proxy check functionality.
See the [upgrade guide][1] to upgrade Sensu to version 5.2.1.

**FIXES:**

- Sensu agents now execute checks for proxy entities at the expected interval.

## 5.2.0 release notes

**February 7, 2019** &mdash; The latest release of Sensu Go, version 5.2.0, is now available for download. This release has a ton of exciting content, including the availability of our first enterprise-only features. For more details on these features, see our [blog post][14]. 5.2.0 also has some key improvements and fixes; we added support for self-signed CA certificates for sensuctl, check output truncation, and the ability to manage silencing from the event details page on our web UI just to name a few.
See the [upgrade guide][1] to upgrade Sensu to version 5.2.0.

**IMPORTANT:**

- Due to changes in the release process, Sensu binary-only archives are now named following the pattern `sensu-enterprise-go_5.2.0_$OS_$ARCH.tar.gz`, where $OS is the operating system name and $ARCH is the CPU architecture. These archives include all files in the top level directory. See the [installation guide][16] for the latest download links.

**NEW FEATURES:**

- Announcing our first enterprise-only features for Sensu Go: [LDAP authentication](/sensu-go/5.2/installation/auth), the [Sensu ServiceNow handler](https://bonsai.sensu.io/assets/sensu/sensu-servicenow-handler), and the [Sensu JIRA handler](https://bonsai.sensu.io/assets/sensu/sensu-jira-handler). See the [getting started guide](/sensu-go/5.2/getting-started/enterprise) for more information.
- Sensu now provides the option to limit check output size or to drop check outputs following metric extraction. See the [checks reference][15] for more information.

**IMPROVEMENTS:**

- Sensu now includes support for Debian 8 and 9. See the [installation guide][16] to install Sensu for Debian.
- Sensu's binary-only distribution for Linux is now available for `arm64`, `armv5`, `armv6`, `armv7`, and `386` in addition to `amd64`.  See the [installation guide][16] for download links.
- The Sensu dashboard now provides the ability to silence and unsilence events from the events page.
- The Sensu dashboard entity page now displays the platform version and deregistration configuration.
- sensuctl now supports TLS configuration options, allowing you to use a self-signed certificate without adding it to the operating system's CA store, either by explicitly trusting the signer or by disabling TLS hostname verification. See the [sensuctl reference][17] for more information.
- sensuctl now provides action-specific confirmation messages, like `Created`, `Deleted`, and `Updated`.

**FIXES:**

- Check TTL failure events now persist through cluster member failures and cluster restarts.
- The Sensu backend now correctly handles errors for missing keepalive events.
- Token substituted values are now omitted from event data to protect sensitive information.
- Sensu now correctly processes keepalive and check TTL states following entity deletion.
- sensuctl can now run `sensuctl version` without being configured.
- When disabling users, sensuctl now provides the correct prompt for the action.

## 5.1.1 release notes

**January 24, 2019** &mdash; The latest patch release of Sensu Go, version 5.1.1, is now available for download. This release includes some key fixes and improvements, including refactored keepalive functionality with increased reliability. Additionally, based on Community feedback, we have added support for the Sensu agent and sensuctl for 32-bit Windows systems.
See the [upgrade guide][1] to upgrade Sensu to version 5.1.1.

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
See the [upgrade guide][1] to upgrade Sensu to version 5.1.0.

**IMPORTANT:**

- _NOTE: This applies only to Sensu backend binaries downloaded from `s3-us-west-2.amazonaws.com/sensu.io/sensu-go`, not to Sensu RPM or DEB packages._
For Sensu backend binaries, the default `state-dir` is now `/var/lib/sensu/sensu-backend` instead of `/var/lib/sensu`. To upgrade your Sensu backend binary to 5.1.0, make sure your `/etc/sensu/backend.yml` configuration file specifies a `state-dir`. See the [upgrade guide][3] for more information.

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
See the [upgrade guide][1] to upgrade Sensu to version 5.0.1.

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
[14]: https://blog.sensu.io/enterprise-features-in-sensu-go
[15]: https://docs.sensu.io/sensu-go/5.2/reference/checks/#check-output-truncation-attributes
[16]: /sensu-go/5.2/installation/install-sensu
[17]: /sensu-go/5.2/sensuctl/reference/#global-flags
[18]: /sensu-go/5.3/reference/checks#spec-attributes
[19]: /sensu-go/5.3/getting-started/enterprise
[20]: /sensu-go/5.3/installation/auth
[21]: /sensu-go/5.3/reference/agent#creating-monitoring-events-using-the-agent-tcp-and-udp-sockets
[22]: /sensu-go/5.4/api/overview#pagination
[23]: /sensu-go/5.4/dashboard/overview
[24]: /sensu-go/5.4/reference/backend#dashboard-configuration-flags
[25]: /sensu-go/5.4/guides/securing-sensu
[26]: /sensu-go/5.4/reference/agent#events-post
[27]: /sensu-go/5.5/reference/tessen
[28]: https://blog.sensu.io/announcing-tessen-the-sensu-call-home-service
