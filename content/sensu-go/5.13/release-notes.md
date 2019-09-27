---
title: "Sensu Go release notes"
linkTitle: "Release Notes"
description: "Read the Sensu Go release notes to learn about what's new in our latest release."
product: "Sensu Go"
version: "5.13"
menu: "sensu-go-5.13"
---

- [5.13.2 release notes](#5-13-2-release-notes)
- [5.13.1 release notes](#5-13-1-release-notes)
- [5.13.0 release notes](#5-13-0-release-notes)
- [5.12.0 release notes](#5-12-0-release-notes)
- [5.11.1 release notes](#5-11-1-release-notes)
- [5.11.0 release notes](#5-11-0-release-notes)
- [5.10.2 release notes](#5-10-2-release-notes)
- [5.10.1 release notes](#5-10-1-release-notes)
- [5.10.0 release notes](#5-10-0-release-notes)
- [5.9.0 release notes](#5-9-0-release-notes)
- [5.8.0 release notes](#5-8-0-release-notes)
- [5.7.0 release notes](#5-7-0-release-notes)
- [5.6.0 release notes](#5-6-0-release-notes)
- [5.5.1 release notes](#5-5-1-release-notes)
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

## 5.13.2 release notes

**September 19, 2019** &mdash; The latest release of Sensu Go, version 5.13.2, is now available for download.
This release is a stability release that fixes a bug for users who have the postgresql event store enabled.
See the [upgrade guide][1] to upgrade Sensu to version 5.13.2.

**Fixes:**

- Metrics handlers now correctly receive metric points when the postgresql event store is enabled.

## 5.13.1 release notes

**September 10, 2019** &mdash; The latest release of Sensu Go, version 5.13.1, is now available for download.
This release is a stability release with bug fixes for multi-build asset definitions causing a panic when no matching filters are found.
See the [upgrade guide][1] to upgrade Sensu to version 5.13.1.

**FIXES:**

- Multi-build asset definitions with no matching filters will no longer cause a panic.
- Fixed the `oidc` authentication provider resource.

## 5.13.0 release notes

**September 9, 2019** &mdash; The latest release of Sensu Go, version 5.13.0, is now available for download. This is one of the most user-friendly releases yet! Sensuctl now integrates with Bonsai, the Sensu Go Asset index, making it easier than ever to fetch and use countless Sensu monitoring plugins and integrations. Additionally, sensuctl now supports loading resource configuration files (e.g. checks) from directories and URLs too! But that's not all! Sensuctl now provides a subcommand for exporting its configuration and API tokens to your shell environment. Use sensuctl to provide curl and custom scripts with fresh API access information! See the [upgrading guide][1] to upgrade Sensu to version 5.13.0.

**NEW FEATURES:**

- Sensuctl now integrates with Bonsai, the Sensu Go Asset index, run a single sensuctl command to add an Asset to your Sensu cluster, e.g. `sensuctl asset add sensu/sensu-pagerduty-handler:1.1.0`. Check to see which Assets are outdated (new releases available) with the `outdated` subcommand, e.g. `sensuctl asset outdated`.
- Sensuctl now supports the `env` subcommand, for exporting sensuctl configuration and API tokens to your shell environment, e.g. `eval $(sensuctl env)`.
- Sensuctl now supports loading multiple resource configuration files (e.g. checks, handlers, etc) from directories! Sensuctl can also load a file using a URL! e.g. `sensuctl create -r -f ./checks` and `sensuctl create -f https://my.blog.ca/sensu-go/check.yaml`.

**FIXES:**

- Sensuctl interactive check create and update modes now have `none` for the metric output format as the first highlighted option, instead of `nagios-perfdata`.
- Fixed a bug where silences would not expire on event resolution.

## 5.12.0 release notes

**August 26, 2019** &mdash; The latest release of Sensu Go, version 5.12.0, is now available for download. There are some exciting feature additions in this release including the ability to output resources to a file from sensuctl and more granularity of control around checks/check hooks execution with an agent allow list. Additionally, this release includes the capability to delete assets and some more stability fixes around watcher functionality. See the [upgrading guide][1] to upgrade Sensu to version 5.12.0.

**IMPORTANT:**

Due to changes in the release process, Sensu binary-only archives are now named following the pattern `sensu-go_5.12.0_$OS_$ARCH.tar.gz`, where $OS is the operating system name and $ARCH is the CPU architecture. These archives include all files in the top level directory. See the [installation guide][16] for the latest download links.

**NEW FEATURES:**

- Operators can now authenticate to Sensu via OpenID Direct Connect (OIDC) using sensuctl, see our [authentication documentation][17] for details.
- Added sensu-agent and sensuctl binary builds for FreeBSD.
- Added sensuctl dump command to output resources to a file or STDOUT, making it easier to backup your Sensu backends.
- Agents can now be configured with a whitelist of executables which are allowed to run as check and hook commands. See the [agent reference][78] for more information.

**IMPROVEMENTS:**

- Assets now support defining multiple builds, reducing the number of individual assets needed to cover disparate platforms in your infrastructure.
- ([Licensed tier][53]) Namespaces listed in both the web UI and sensuctl are now limited to those which the user has access to.
- Hooks now support the use of assets.
- The event.check.name field has been added as a supported field selector.
- Both the API and sensuctl can now be used to delete Assets.
- The use of Protobuf serialization/deserialization over websocket can now be negotiated between agent and backend.
- Web UI performance has been improved for deployments with many events and entities.
- The resource caches can now rebuild themselves in case of failures.
- Event and Entity resources can now be created via the API without an explicit namespace; the system will refer to the namespace in the request URL.
- Event and Entity resources can now be created via the API using the POST verb.

**SECURITY:**

- To prevent writing sensitive data to logs, decoded check result and keepalive payloads are no longer logged by the backend.

**FIXES:**

- Tabular display of filters via Sensuctl now displays && or || as appropriate for inclusive and exclusive filters, respectively.
- Requesting events from the GET /events/:entity API endpoint now returns events only for the specified entity.
- Running sensuctl config view without configuration no longer causes a crash.
- Creating an entity via sensuctl with the --interactive flag now prompts for the entity name when not provided on the command line.
- Check hooks with stdin: true now receive actual event data on STDIN instead of an empty event.
- Some issues with check scheduling and updating have been fixed by refactoring the backend's watcher implementation.

**KNOWN ISSUES:**

- Authentication via OIDC is not yet supported in the Web UI.
- Deleting an asset will not remove references to said asset. It is the operators responsibility to remove the asset from the runtime_assets field of the check, hook, filter, mutator, or handler.
- Deleting an asset will not remove the tarball or downloaded files from disk. It is the operators responsibility to clear the asset cache if necessary.

## 5.11.1 release notes

**July 18, 2019** &mdash; The latest release of Sensu Go, version 5.11.1, is now available for download.
This release is a stability release with bug fixes for UPN format binding token renewal, adding of agent heartbeats and WebSocket connection negotiation made configurable.
See the [upgrade guide][1] to upgrade Sensu to version 5.11.1.

**FIXES:**

- Fixed access token renewal when UPN format binding was enabled.
- The agent now sends heartbeats to the backend in order to detect network failures and reconnect faster.
- The default handshake timeout for the WebSocket connection negotiation has been lowered from 45 to 15 seconds and is now configurable.

## 5.11.0 release notes

**July 10, 2019** &mdash; The latest release of Sensu Go, version 5.11.0, is now available for download.
There are some exciting feature additions in this release, including the ability to delete resources from sensuctl and manage filter and mutator resources in the web UI. Additionally, this release includes bug fixes around proxy checks and enhanced performance tuning for the PostgreSQL event store.
See the [upgrade guide][1] to upgrade Sensu to version 5.11.0.

**NEW FEATURES:**

- The Sensu [web UI][67] now includes a filters page that displays available event filters and filter configuration.
- ([Licensed tier][68]) Manage your Sensu event filters from your browser: Sensu's [web UI][67] now supports creating, editing, and deleting filters.
- The Sensu [web UI][67] now includes a mutators page that displays available mutators and mutator configuration.
- ([Licensed tier][68]) Manage your Sensu mutators from your browser: Sensu's [web UI][67] now supports creating, editing, and deleting mutators.
- sensuctl now includes the `sensuctl delete` command, letting you use resource definitions to delete resources from Sensu in the same way as `sensuctl create`. See the [sensuctl reference][72] for more information.
- Assets now include a `headers` attribute to include HTTP headers in requests to retrieve assets, allowing you to access secured assets. See the [asset reference][70] for examples.
- Sensu agents now support the `disable-assets` configuration flag, allowing you to disable asset retrieval for individual agents. See the [agent reference][71] for examples.
- Sensu [binary-only distributions][69] are now available as zip files.

**IMPROVEMENTS:**

- ([Licensed tier][68]) The [Active Directory authentication provider][74] now supports the `default_upn_domain` attribute, letting you appended a domain to a username when a domain is not specified during login.
- ([Licensed tier][68]) The [Active Directory authentication provider][74] now supports the `include_nested_groups` attribute, letting you search nested groups instead of just the top level groups of which a user is a member.
- The `sensuctl config view` command now returns the currently configured username. See the [sensuctl reference][76] for examples.
- The [Sensu API][75] now returns the 201 Created response code for POST and PUT requests instead of 204 No Content.
- The Sensu backend now provides [advanced configuration options][77] for buffer size and worker count of keepalives, events, and pipelines.
- Sensu Go now supports Debian 10. For a complete list of supported platforms, see the [platforms page][73].

**FIXES:**

- The web UI now returns an error when attempting to create a duplicate check or handler.
- Silenced entries are now retrieved from the cache when determining if an event is silenced.
- The Sensu API now returns an error when trying to delete an entity that does not exist.
- The agent WebSocket connection now performs basic authorization.
- The /events API now correctly applies the current timestamp by default, fixing a regression in 5.10.0.
- Multiple nested set handlers are now flagged correctly, fixing an issue in which they were flagged as deeply nested.
- Round-robin proxy checks now execute as expected in the event of updated entities.
- The Sensu backend now avoids situations of high CPU usage in the event that watchers enter a tight loop.
- Due to incompatibility with the Go programming language, Sensu is incompatible with CentOS/RHEL 5. As a result, CentOS/RHEL 5 has been removed as a [supported platform][73] for all versions of Sensu Go.

## 5.10.2 release notes

**June 27, 2019** &mdash; The latest release of Sensu Go, version 5.10.2, is now available for download.
This is a stability release with a bug fix for expired licenses.
See the [upgrade guide][1] to upgrade Sensu to version 5.10.2.

**FIXES:**

- Sensu now handles expired licenses as expected.

## 5.10.1 release notes

**June 25, 2019** &mdash; The latest release of Sensu Go, version 5.10.1, is now available for download.
This release is a stability release with key bug fixes around proxy checks and entity deletion.
See the [upgrade guide][1] to upgrade Sensu to version 5.10.1.

**FIXES:**

- The proxy_requests entity_attributes are now all considered when matching
entities.
- Events are now removed when their corresponding entity is deleted.

## 5.10.0 release notes

**June 19, 2019** &mdash; The latest release of Sensu Go, version 5.10.0, is now available for download.
There are some exciting feature additions in this release, including the ability to perform advanced filtering in the web UI and use PostgreSQL as a scalable event store. This release also includes key bug fixes, most notably around high CPU usage.
See the [upgrade guide][1] to upgrade Sensu to version 5.10.0.

**NEW FEATURES:**

- ([Licensed tier][60]) The Sensu web UI now includes fast, predictive filtering for viewing checks, entities, events, handlers, and silences, including the ability to filter based on custom labels. Select the filter bar and start building custom views using suggested attributes and values. For more information, see the [dashboard docs][66].
- Free-tier Sensu instances can now delete entities in the web UI entities page. See the [docs][65] to get started using the Sensu web UI.
- ([Licensed tier][60]) Sensu now supports using an external PostgreSQL instance for event storage in place of etcd. PostgreSQL can handle significantly higher volumes of Sensu events, letting you scale Sensu beyond etcd's storage limits. See the [datastore reference][61] for more information.
- Sensu now includes a cluster ID API endpoint and `sensuctl cluster id` command to return the unique Sensu cluster ID. See the [cluster API docs][62] for more information.

**IMPROVEMENTS:**

- The `sensuctl create` command now supports specifying the namespace for a group of resources at the time of creation, allowing you to replicate resources across namespaces without manual editing. See the [sensuctl reference][63] for more information and usage examples.
- Sensu cluster roles can now include permissions to manage your Sensu license using the `license` resource type. See the [RBAC reference][64] to create a cluster role.
- The web UI now displays up to 100,000 events and entities on the homepage.

**FIXES:**

- Sensu now optimizes scheduling for proxy checks, solving an issue with high CPU usage when evaluating proxy entity attributes.
- The Sensu API now validates resource namespaces and types in request bodies to ensure RBAC permissions are enforced.
- Check `state` and `total_state_change` attributes now update as expected based on check history.
- Incident and entity links in the web UI homepage now navigate to the correct views.
- The web UI now displays non-standard cron statements correctly, for example: `@weekly`.
- On sign in, the web UI now ensures that users are directed to a valid namespace.
- In the web UI, code block scrollbars now display only when necessary.
- The web UI now displays the handler `timeout` attribute correctly.
- When editing resources, the web UI now fetches the latest resource prior to editing.
- The web UI now handles array values correctly when creating and editing resources.

## 5.9.0 release notes

**May 28, 2019** &mdash; The latest release of Sensu Go, version 5.9.0, is now available for download.
There are some exciting feature additions in this release, including the ability to log raw events to a file (licensed tier) and view event handlers in the web UI.
See the [upgrade guide][52] to upgrade Sensu to version 5.9.0.
If you're upgrading a Sensu cluster from 5.7.0 or earlier, see the [instructions for upgrading a Sensu cluster from 5.7.0 or earlier to 5.8.0 or later][59].

**NEW FEATURES:**

- The Sensu web UI now includes a handlers page that displays available event handlers and handler configuration. See the [docs][54] to get started using the Sensu web UI.
- ([Licensed tier][53]) Manage your Sensu event handlers from your browser: Sensu's web UI now supports creating, editing, and deleting handlers. See the [docs][54] to get started using the Sensu web UI.
- ([Licensed tier][53]) Sensu now supports event logging to a file using the `event-log-file` and `event-log-buffer-size` configuration flags. You can use this event log file as an input source for your favorite data lake solution. See the [backend reference][55] for more information.

**IMPROVEMENTS:**

- The Sensu web UI now includes simpler, more efficient filtering in place of filtering using Sensu query expressions.
- Sensu packages are now available for Ubuntu 19.04 (Disco Dingo). See the [supported platforms page][56] for a complete list of Sensu's supported platforms and the [installation guide][57] to install Sensu packages for Ubuntu.

**FIXES:**

- The `occurrences` and `occurrences_watermark` event attributes now increment as expected, giving you useful information about recent events. See the [events reference][58] for an in-depth discussion of these attributes.
- The `/silenced/subscriptions/:subscription` and `/silenced/checks/:check` API endpoints now return silences by check or subscription.
- Sensu now handles errors when seeding initial data, avoiding a panic state.

## 5.8.0 release notes

**May 22, 2019** &mdash; The latest release of Sensu Go, version 5.8.0, is now available for download.
This is mainly a stability release with bug fixes and performance improvements. Additionally, we have added support for configurable etcd cipher suites.
See the [upgrade guide][51] to upgrade Sensu to version 5.8.0.

**IMPORTANT:**

- To upgrade to Sensu Go 5.8.0, Sensu clusters with multiple backend nodes must be shut down during the upgrade process. See the [upgrade guide][51] for more information.

**IMPROVEMENTS:**

- The sensuctl command-line tool now supports the `--chunk-size` flag to help you handle large datasets. See the [sensuctl reference][45] for more information.
- Sensu backends now support the `etcd-cipher-suites` configuration option, letting you specify the cipher suites that can be used with etcd TLS configuration. See the [backend reference][47] for more information.
- The Sensu API now includes the version API, returning version information for your Sensu instance. See the [API docs][46] for more information.
- Tessen now collects the numbers of events processed and resources created, giving us better insight into how we can improve Sensu. As always, all Tessen transmissions are logged for complete transparency. See the [Tessen reference][48] for more information.
- Sensu licenses now include the entity limit attached to your Sensu licensing package. See the [license management docs][49] to learn more about entity limits.
- Sensu backends now perform better at scale using increased worker pool sizes for events and keepalives.
- The maximum size of the etcd database and etcd requests is now configurable using the `etcd-quota-backend-bytes` and `etcd-max-request-bytes` backend configuration options. These are advanced configuration options requiring familiarly with etcd; use with caution. See the [backend reference][50] for more information.
- Most Sensu resources now use protobuf serialization in etcd.

**FIXES:**

- Events produced by checks now execute the correct number of write operations to etcd.
- API pagination tokens for the users and namespaces APIs now work as expected.
- Keepalive events for deleted and deregistered entities are now cleaned up as expected.

**KNOWN ISSUES:**

- Auth tokens may not be purged from etcd, resulting in a possible impact to performance.

## 5.7.0 release notes

**May 9, 2019** &mdash; The latest release of Sensu Go, version 5.7.0, is now available for download. This is mainly a stability release with bug fixes. Additionally, we have added support for Windows packages and [updated our usage policy][44].
See the [upgrade guide][1] to upgrade Sensu to version 5.7.0.

**IMPROVEMENTS:**

- The Sensu agent for Windows is now available as an MSI package, making it easier to install and operate. See the [installation guide][41] and the [agent reference][42] to get started.

**FIXES:**

- Sensu now enforces resource separation between namespaces sharing a similar prefix.
- The `sensuctl cluster` commands now output correctly in JSON and wrapped JSON formats.
- The API now returns an error message if [label and field selectors][43] are used without a license.

## 5.6.0 release notes

**April 30, 2019** &mdash; The latest release of Sensu Go, version 5.6.0, is now available for download.
We have added some exciting new features in this release including API filtering and the ability to create and manage checks through the web UI with the presence of a valid license key.
See the [upgrade guide][1] to upgrade Sensu to version 5.6.0.

**NEW FEATURES:**

- ([Licensed tier][33]) Manage your Sensu checks from your browser: Sensu's web user interface now supports creating, editing, and deleting checks. See the [docs][32] to get started using the Sensu web UI.
- ([Licensed tier][33]) The Sensu web UI now includes an option to delete entities.
- ([Licensed tier][33]) Sensu now supports resource filtering in the Sensu API and sensuctl command line tool. Filter events using custom labels and resource attributes, such as event status and check subscriptions. See the [API docs][34] and [sensuctl reference][35] for usage examples.

**IMPROVEMENTS:**

- ([Licensed tier][33]) Sensu's LDAP and Active Directory integrations now support mutual authentication using the `trusted_ca_file`, `client_cert_file`, and `client_key_file` attributes. See the [guide to configuring an authentication provider][37] for more information.
- ([Licensed tier][33]) Sensu's LDAP and Active Directory integrations now support connecting to an authentication provider using anonymous binding. See the [LDAP][38] and [AD][39] binding configuration docs to learn more.
- The [health API][36] response now includes the cluster ID.
- The `sensuctl cluster health` and `sensuctl cluster member-list` commands now include the cluster ID in tabular format.

**FIXES:**

- You can now configure labels and annotations for Sensu agents using command line flags. For example: `sensu-agent start --label example_key="example value"`. See the [agent reference][40] for more examples.
- The Sensu web UI now displays the correct checkbox state when no resources are present.

## 5.5.1 release notes

**April 17, 2019** &mdash; The latest release of Sensu Go, version 5.5.1, is now available for download. This release is a stability release with key bug fixes, including addressing an issue with backend CPU utilization. Additionally, we have added support for honoring the source attribute for events received via agent socket.
See the [upgrade guide][1] to upgrade Sensu to version 5.5.1.

**IMPROVEMENTS:**

- Sensu agents now support annotations, non-identifying metadata that helps people or external tools interacting with Sensu. See the [agent reference][29] to add annotations in the agent configuration file.
- The [agent socket event format][30] now supports the `source` attribute to create a proxy entity.
- Sensu 5.5.1 is built with Go version 1.12.3.

**FIXES:**

- Backends now reinstate etcd watchers in the event of a watcher failure, fixing an issue causing high CPU usage in some components.

## 5.5.0 release notes

**April 4, 2019** &mdash; The latest release of Sensu Go, version 5.5.0, is now available for download. This release has some key bug fixes and additions including the introduction of Tessen into Sensu Go. For more information, we encourage you to read Sean Porter’s [blog post][28] on Tessen.
See the [upgrade guide][1] to upgrade Sensu to version 5.5.0.

**NEW FEATURES:**

- Tessen, the Sensu call-home service, is now enabled by default in Sensu backends. See the [Tessen docs][27] to learn about the data that Tessen collects.

**IMPROVEMENTS:**

- Sensu now includes more verbose check logging to indicate when a proxy request matches an entity according to its entity attributes.

**FIXES:**

- The Sensu web UI now displays silences created by LDAP users.
- The web UI now uses a secondary text color for quick-navigation buttons.

## 5.4.0 release notes

**March 27, 2019** &mdash; The latest release of Sensu Go, version 5.4.0, is now available for download. This release has some very exciting feature additions including the introduction of our new homepage. 5.4.0 also includes support for API pagination to more efficiently handle large data sets and agent buffering for robustness in lower connectivity situations along with key bug fixes.
See the [upgrade guide][1] to upgrade Sensu to version 5.4.0.

**NEW FEATURES:**

- The Sensu dashboard now includes a homepage designed to highlight the most important monitoring data, giving you instant insight into the state of your infrastructure. See the [dashboard docs][23] for a preview.
- The Sensu API now supports pagination using the `limit` and `continue` query parameters, letting you limit your API responses to a maximum number of objects and making it easier to handle large data sets. See the [API overview][22] for more information.
- Sensu now surfaces internal metrics using the `/metrics` API. See the [metrics API reference][31] for more information.

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
- Sensu now provides [license-activated][19] support for using Microsoft Active Directory as an external authentication provider. Read the [authentication guide][20] to configure Active Directory, and check out the [getting started guide][19] for more information about licensing.
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
[29]: /sensu-go/5.5/reference/agent#general-configuration-flags
[30]: /sensu-go/5.5/reference/agent#creating-monitoring-events-using-the-agent-tcp-and-udp-sockets
[31]: /sensu-go/5.4/api/metrics
[32]: /sensu-go/5.6/dashboard/overview
[33]: /sensu-go/5.6/getting-started/enterprise
[34]: /sensu-go/5.6/api/overview#filtering
[35]: /sensu-go/5.6/sensuctl/reference#filtering
[36]: /sensu-go/5.6/api/health
[37]: /sensu-go/5.6/installation/auth/
[38]: /sensu-go/5.6/installation/auth/#binding-attributes
[39]: /sensu-go/5.6/installation/auth/#active-directory-binding-attributes
[40]: /sensu-go/5.6/reference/agent#general-configuration-flags
[41]: /sensu-go/5.7/installation/install-sensu#windows-agent
[42]: /sensu-go/5.7/reference/agent#operation
[43]: /sensu-go/5.7/api/overview#filtering
[44]: https://discourse.sensu.io/t/introducing-usage-limits-in-the-sensu-go-free-tier/1156
[45]: /sensu-go/5.8/sensuctl/reference#handling-large-datasets
[46]: /sensu-go/5.8/api/version
[47]: /sensu-go/5.8/reference/backend#etcd-cipher-suites
[48]: /sensu-go/5.8/reference/tessen
[49]: /sensu-go/5.8/reference/license
[50]: /sensu-go/5.8/reference/backend#advanced-configuration-options
[51]: /sensu-go/5.8/installation/upgrade#upgrading-sensu-clusters-from-5-7-0-or-earlier-to-5-8-0-or-later
[52]: /sensu-go/5.9/installation/upgrade
[53]: /sensu-go/5.9/getting-started/enterprise
[54]: /sensu-go/5.9/dashboard/overview
[55]: /sensu-go/5.9/reference/backend#event-logging
[56]: /sensu-go/5.9/installation/platforms
[57]: /sensu-go/5.9/installation/install-sensu
[58]: /sensu-go/5.9/reference/events#occurrences-and-occurrences-watermark
[59]: /sensu-go/5.9/installation/upgrade/#upgrading-sensu-clusters-from-5-7-0-or-earlier-to-5-8-0-or-later
[60]: /sensu-go/latest/getting-started/enterprise
[61]: /sensu-go/5.10/reference/datastore
[62]: /sensu-go/5.10/api/cluster#the-clusterid-API-endpoint
[63]: /sensu-go/5.10/sensuctl/reference#creating-resources-across-namespaces
[64]: /sensu-go/5.10/reference/rbac/#assigning-group-permissions-across-all-namespaces
[65]: /sensu-go/5.10/dashboard/overview
[66]: /sensu-go/5.10/dashboard/filtering
[67]: /sensu-go/5.11/dashboard/overview
[68]: /sensu-go/5.11/getting-started/enterprise
[69]: /sensu-go/5.11/installation/verify
[70]: /sensu-go/5.11/reference/assets#examples
[71]: /sensu-go/5.11/reference/agent#disable-assets
[72]: /sensu-go/5.11/sensuctl/reference#deleting-resources
[73]: /sensu-go/5.11/installation/platforms
[74]: /sensu-go/5.11/installation/auth#active-directory-authentication
[75]: /sensu-go/5.11/api/overview
[76]: /sensu-go/5.11/sensuctl/reference#view-sensuctl-config
[77]: /sensu-go/5.11/reference/backend#advanced-configuration-options
[78]: /sensu-go/5.12/reference/agent/#allow-list
