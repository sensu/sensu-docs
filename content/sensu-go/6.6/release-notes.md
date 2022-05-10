---
title: "Sensu Go release notes"
linkTitle: "Release Notes"
description: "Read the Sensu Go release notes to learn what's new in our latest release and get information about upgrading to the latest version of Sensu Go."
weight: -80
product: "Sensu Go"
toc: false
version: "6.6"
menu: "sensu-go-6.6"
---

- [6.6.6 release notes](#666-release-notes)
- [6.6.5 release notes](#665-release-notes)
- [6.6.4 release notes](#664-release-notes)
- [6.6.3 release notes](#663-release-notes)
- [6.6.2 release notes](#662-release-notes)
- [6.6.1 release notes](#661-release-notes)
- [6.6.0 release notes](#660-release-notes)
- [6.5.5 release notes](#655-release-notes)
- [6.5.4 release notes](#654-release-notes)
- [6.5.3 release notes](#653-release-notes)
- [6.5.2 release notes](#652-release-notes)
- [6.5.1 release notes](#651-release-notes)
- [6.5.0 release notes](#650-release-notes)
- [6.4.3 release notes](#643-release-notes)
- [6.4.2 release notes](#642-release-notes)
- [6.4.1 release notes](#641-release-notes)
- [6.4.0 release notes](#640-release-notes)
- [6.3.0 release notes](#630-release-notes)
- [6.2.7 release notes](#627-release-notes)
- [6.2.6 release notes](#626-release-notes)
- [6.2.5 release notes](#625-release-notes)
- [6.2.4 release notes](#624-release-notes)
- [6.2.3 release notes](#623-release-notes)
- [6.2.2 release notes](#622-release-notes)
- [6.2.1 release notes](#621-release-notes)
- [6.2.0 release notes](#620-release-notes)
- [6.1.4 release notes](#614-release-notes)
- [6.1.3 release notes](#613-release-notes)
- [6.1.2 release notes](#612-release-notes)
- [6.1.1 release notes](#611-release-notes)
- [6.1.0 release notes](#610-release-notes)
- [6.0.0 release notes](#600-release-notes)
- [5.21.5 release notes](#5215-release-notes)
- [5.21.4 release notes](#5214-release-notes)
- [5.21.3 release notes](#5213-release-notes)
- [5.21.2 release notes](#5212-release-notes)
- [5.21.1 release notes](#5211-release-notes)
- [5.21.0 release notes](#5210-release-notes)
- [5.20.2 release notes](#5202-release-notes)
- [5.20.1 release notes](#5201-release-notes)
- [5.20.0 release notes](#5200-release-notes)
- [5.19.3 release notes](#5193-release-notes)
- [5.19.2 release notes](#5192-release-notes)
- [5.19.1 release notes](#5191-release-notes)
- [5.19.0 release notes](#5190-release-notes)
- [5.18.1 release notes](#5181-release-notes)
- [5.18.0 release notes](#5180-release-notes)
- [5.17.2 release notes](#5172-release-notes)
- [5.17.1 release notes](#5171-release-notes)
- [5.17.0 release notes](#5170-release-notes)
- [5.16.1 release notes](#5161-release-notes)
- [5.16.0 release notes](#5160-release-notes)
- [5.15.0 release notes](#5150-release-notes)
- [5.14.2 release notes](#5142-release-notes)
- [5.14.1 release notes](#5141-release-notes)
- [5.14.0 release notes](#5140-release-notes)
- [5.13.2 release notes](#5132-release-notes)
- [5.13.1 release notes](#5131-release-notes)
- [5.13.0 release notes](#5130-release-notes)
- [5.12.0 release notes](#5120-release-notes)
- [5.11.1 release notes](#5111-release-notes)
- [5.11.0 release notes](#5110-release-notes)
- [5.10.2 release notes](#5102-release-notes)
- [5.10.1 release notes](#5101-release-notes)
- [5.10.0 release notes](#5100-release-notes)
- [5.9.0 release notes](#590-release-notes)
- [5.8.0 release notes](#580-release-notes)
- [5.7.0 release notes](#570-release-notes)
- [5.6.0 release notes](#560-release-notes)
- [5.5.1 release notes](#551-release-notes)
- [5.5.0 release notes](#550-release-notes)
- [5.4.0 release notes](#540-release-notes)
- [5.3.0 release notes](#530-release-notes)
- [5.2.1 release notes](#521-release-notes)
- [5.2.0 release notes](#520-release-notes)
- [5.1.1 release notes](#511-release-notes)
- [5.1.0 release notes](#510-release-notes)
- [5.0.1 release notes](#501-release-notes)
- [5.0.0 release notes](#500-release-notes)

### Versioning

Sensu Go adheres to [semantic versioning][2] using MAJOR.MINOR.PATCH release numbers, starting at 5.0.0.
MAJOR version changes indicate incompatible API changes.
MINOR versions add backward-compatible functionality.
PATCH versions include backward-compatible bug fixes.

### Upgrading

Read the [upgrade guide][1] for information about upgrading to the latest version of Sensu Go.

---

## 6.6.6 release notes

**February 16, 2022** &mdash; The latest release of Sensu Go, version 6.6.6, is now available for download.

Sensu Go 6.6.6 includes several web UI fixes for GraphQL queries. This patch release also contains fixes for the PostgreSQL event store, including improving retry logic when the event store is unavailable, as well as not reverting to etcd as a fallback event store.

Read the [upgrade guide][1] to upgrade Sensu to version 6.6.6.

**IMPROVEMENTS**
- ([Commercial feature][259]) In the web UI, added error type to GraphQL metrics to help track down slow queries.

**FIXES**
- ([Commercial feature][259]) When the PostgreSQL provider is configured with ["strict: true"][267], the provider will attempt to connect to an unavailable PostgreSQL server indefinitely instead of reverting to etcd as an event store after three failed connection attempts.
- ([Commercial feature][259]) When the PostgreSQL provider is configured to use strict mode, the provider confirms whether the current user has `CREATE` privileges within the current schema, not the current database.
- ([Commercial feature][259]) The PostgreSQL provider now respects context cancellation and will fail immediately when users issue a termination signal.
- ([Commercial feature][259]) Fixed an issue where metrics would not be recorded when an error occurred.
- ([Commercial feature][259]) In the web UI, fixed an issue with GraphQL queries where an offset of >= 500 couldn't be used when paging through entities.

## 6.6.5 release notes

**February 3, 2022** &mdash; The latest release of Sensu Go, version 6.6.5, is now available for download.

Sensu Go 6.6.5 includes several web UI improvements to reduce cluster load and adds a message to clarify web UI search results for the events and entities pages. This patch release also fixes bugs in round robin scheduling and the PostgreSQL configuration watcher and removes outdated language in an interactive-mode prompt for sensu-backend upgrade.

Read the [upgrade guide][1] to upgrade Sensu to version 6.6.5.

**IMPROVEMENTS**
- ([Commercial feature][259]) When using PostgreSQL, queries for multiple entity states are now more efficient.
- ([Commercial feature][259]) In the web UI, if a search reaches the [limit for the events or entities][266] page, the results count at the bottom-right corner of the page now indicates that the total number of matches exceeds the number of results listed.
- ([Commercial feature][259]) In the web UI, several changes help reduce cluster load: federated clusters now query remote clusters in parallel; GraphQL resolvers are no longer invoked if the query deadline has already been reached; and we improved the performance of GraphQL queries to the local cluster.

**FIXES**
- ([Commercial feature][259]) Fixed a bug in round robin scheduling that could delay notification routing after creating or updating business service monitoring (BSM) service components.
- ([Commercial feature][259]) Fixed a bug in the PostgreSQL configuration watcher that could prevent bsmd from being reenabled after an update.
- ([Commercial feature][259]) In the web UI, fixed a bug that could result in graphql-go nullification of entity.status values greater than math.MaxInt32.
- Removed Sensu Go 5.x-specific language in the confirmation prompt for sensu-backend upgrade in interactive mode.
- Resolved unpredictable ringv2 behavior when identical subscriptions are created from different contexts.

## 6.6.4 release notes

**January 26, 2022** &mdash; The latest release of Sensu Go, version 6.6.4, is now available for download.

Sensu Go 6.6.4 includes a number of bug fixes, security improvements, and a new metric, `sensu_go_event_metric_points_processed`.
Fixes in this patch release will help prevent backend crashes when PostgreSQL is taken offline and keep backend entity rows from filling up the entities table.
The 6.6.4 patch release also includes several improvements to further secure the web UI.

Read the [upgrade guide][1] to upgrade Sensu to version 6.6.4.

**IMPROVEMENTS**
- ([Commercial feature][259]) In the web UI, added the [X-Frame-Options][263] header to tell browsers the web application cannot be loaded within an iframe to prevent tailored click-jacking attacks. 
- ([Commercial feature][259]) In the web UI, added the [HSTS header][264] if TLS has been configured to ensure that the browser loads the application and its requisite assets with a secure connection.
- ([Commercial feature][259]) In the web UI, added the [X-Content-Type-Options][265] nosniff header so that browsers respect the given Content-Type header when loading content referenced by a script tag. 
- Added the `sensu_go_event_metric_points_processed` counter metric and included it in Tessen reporting.

**FIXES**
- ([Commercial feature][259]) Fixed bugs in business service monitoring (BSM) and round robin scheduling to prevent missed check executions when PostgreSQL round robin scheduling is enabled.
- ([Commercial feature][259]) Fixed a bug that could cause sensu-backend to crash if PostgreSQL was taken offline and restarted.
- ([Commercial feature][259]) Fixed a bug that could cause ephemeral backend entity rows to fill up the entities table in PostgreSQL.
- ([Commercial feature][259]) BSM event selectors can no longer select events outside the service component namespace.
- ([Commercial feature][259]) In the web UI, fixed a bug the prevented HTTP requests from being properly cancelled after a context deadline (timeout) was exceeded.
- Fixed a bug that could cause the backend to crash if a pipeline references a non-existent handler.

## 6.6.3 release notes

**December 16, 2021** &mdash; The latest release of Sensu Go, version 6.6.3, is now available for download.

Sensu Go 6.6.3 includes improvements to reduce load on clusters and support cluster recovery, as well as a backend configuration flag for specifying the internal etcd client log level. Fixes in this patch release will help prevent backend crashes when keepalive leases are revoked and when the backend cannot write to the event log file. In addition, this patch fixes issues that could result in a leaked etcd lease and keep the backend from terminating correctly.

Read the [upgrade guide][1] to upgrade Sensu to version 6.6.3.

**IMPROVEMENTS**

- ([Commercial feature][259]) In the web UI, the default polling interval on the [entities page][261] is now 30 seconds to help reduce load on clusters. Search results for entities are limited to the first 500 matching entities. Also, the web UI response time and memory usage is substantially improved when opening the entities page in the default state (loading the first page of results, with no search filter applied).
- ([Commercial feature][259]) In the web UI, for instances that use etcd for event storage, search results for events are limited to 25,000 matching events.
- Added the [etcd-client-log-level][262] configuration flag for setting the log level of the etcd client used internally within sensu-backend.
- The agentd daemon now starts up after all other daemons, which improves cluster recovery after the loss of a backend.
- When using external etcd (the no-embed-etcd backend configuration flag is set to `true`), sensu-backend now crashes when its daemons do not stop within 30 seconds, which can happen due to an intentional shutdown or when database unavailability triggers an internal restart.
When using embedded etcd, sensu-backend will still try to avoid crashing to prevent member corruption.

**FIXES**

- New agent sessions no longer result in a leaked etcd lease.
- sensu-backend now prints a warning and continues instead of crashing when it cannot write to the specified event-log-file.
- Fixed a bug that could cause a crash when keepalive leases are revoked on another backend or by an etcd operator.
- Fixed an issue that could prevent sensu-backend from terminating correctly.
- Proxy entity state is now created when it is missing and a matching entity config already exists.

## 6.6.2 release notes

**December 8, 2021** &mdash; The latest release of Sensu Go, version 6.6.2, is now available for download.

The Sensu Go 6.6.2 patch release includes improvements in PostgreSQL health check queries and memory consumption for events and entities pages in the web UI. This release also fixes a web UI issue that provided incorrect links for cluster-wide resources.

Read the [upgrade guide][1] to upgrade Sensu to version 6.6.2.

**IMPROVEMENTS**

- ([Commercial feature][259]) Changed the SQL operation for PostgreSQL health check queries to reduce query cost.
- ([Commercial feature][259]) In the web UI, removed **Related Entities** from individual pages for events and entities to eliminate the substantial memory consumption required to construct the list.

**FIXES**

- ([Commercial feature][259]) In the web UI, fixed an issue that provided incorrect links for cluster-wide resources. No web UI pages can show events across all namespaces.

## 6.6.1 release notes

**November 29, 2021** &mdash; The latest release of Sensu Go, version 6.6.1, is now available for download.

This patch release removes a debugging log entry; adds cron library error information to validation errors for Check and CheckConfig resources; and fixes a web UI bug that expanded the clear silences dialog to the entire frame. In addition, Sensu now sets event timestamps when events are resolved via sensuctl or the web UI.

Read the [upgrade guide][1] to upgrade Sensu to version 6.6.1.

**IMPROVEMENTS**

- To provide additional context, errors returned by the cron library are now included with the errors Sensu returns when validating Check and CheckConfig resources.
- Removed a debugging log entry that could cause logs to grow too big, too quickly.

**FIXES**
- ([Commercial feature][259]) In the web UI, the dialog window for clearing silences no longer expands to the entire frame.
- Sensu now sets event timestamps when you resolve events with sensuctl or in the web UI.

## 6.6.0 release notes

**November 25, 2021** &mdash; The latest release of Sensu Go, version 6.6.0, is now available for download.

This release introduces PostgreSQL event store sorting as well as web UI improvements like support for ANSI color codes and a warning message when editing resources on a cluster with an older version than the gateway cluster. Sensu Go 6.6.0 also adds a label to logged metrics to help identify the backend that generated the metrics, logs connection errors along with context errors, and fixes a bug that could cause a backend crash in case of etcd client unavailability.

Read the [upgrade guide][1] to upgrade Sensu to version 6.6.0.

**IMPROVEMENTS**
- ([Commercial feature][259]) The web UI color themes are updated, and the default theme now uses cyan for elements like the left navigaton menu and breadcrumb navigation text.
- ([Commercial feature][259]) In the web UI, users now receive a warning message when they try to add or edit resources on an cluster that is running an older Sensu backend version than the gateway cluster.
- ([Commercial feature][259]) The web UI now supports ANSI color codes, which improves check output readability when it includes color.
- ([Commercial feature][259]) Added support for sorting for the PostgreSQL event store. In addition, GraphQL can now use the PostgreSQL event store to sort events and get the total event count.
- Logged metrics now include a backend label. This makes it possible to associate metrics from the [metrics log][258] file with the backend they were generated on.
- Sensu no longer applies zero values for [etcd configuration flags][260]. This prevents overwriting the etcd-provided default values with null, zero, slice, or empty values.

**FIXES**
- When sensu-go cannot connect to etcd, the connection error is now logged along with context errors.
- Fixed a bug that could cause sensu-backend to crash if the BackendIDGetter encounters etcd client unavailability.

## 6.5.5 release notes

**November 22, 2021** &mdash; The latest release of Sensu Go, version 6.5.5, is now available for download.

The Sensu Go 6.5.5 patch release adds two backend configuration flags for configuring the API and web UI HTTP servers' write timeouts and three new GraphQL duration metrics for the metrics log. This release also delivers several bug fixes, including fixes for sensu-backend and sensu-agent panics and failed keepalive lease grant operations.

Read the [upgrade guide][1] to upgrade Sensu to version 6.5.5.

**IMPROVEMENTS**
- Added the [api-write-timeout][256] and [dashboard-write-timeout][257] backend configuration flags.
These flags allow you to configure the timeout for the respective HTTP servers' response writes, which is helpful when requests might take more than a few seconds to complete.
- Added graphql_duration_seconds, graphql_duration_seconds_sum, and graphql_duration_seconds_count to the [metrics log][238]. Also added objectives (0.5, 0.9, 0.99) to the graphql_duration_seconds metric.
- Added Prometheus metrics for tracking lease operations, with labels for operation type and status, and added sensu_go_lease_ops to the [metrics log][238].

**FIXES**
- Updated the assets, pipeline, and eventd duration metrics added in [Sensu Go 6.5.2][255] to use milliseconds for consistency with other duration metrics.
- Updated the /version API so that responses reflect the versions of external etcd clusters based on the first available etcd endpoint.
- Fixed a bug that could cause sensu-backend and sensu-agent to panic due to concurrent websocket writes.
- Sensu no longer logs an error when one side of a websocket tries to close a previously closed connection.
- Sensu now retries keepalive lease grant operations that fail due to rate limiting.

## 6.5.4 release notes

**October 30, 2021** &mdash; The latest release of Sensu Go, version 6.5.4, is now available for download.

This patch releases and updates the sensu-go core/api module.

Read the [upgrade guide][1] to upgrade Sensu to version 6.5.4.

**FIXES**
- Released and updated the sensu-go core/api module.

## 6.5.3 release notes

**October 29, 2021** &mdash; The latest release of Sensu Go, version 6.5.3, is now available for download.

This patch adds the 6.5.2 metrics to the metrics log, fixes bugs in validation for environment variables in JavaScript mutators and asset expansion error handling, and vendors the correct version of sensu-go.

Read the [upgrade guide][1] to upgrade Sensu to version 6.5.3.

**IMPROVEMENTS**

- Added the [Sensu Go 6.5.2][255] eventd, pipeline, and asset metrics to the [metrics log][238] to facilitate troubleshooting.

**FIXES**
- ([Commercial feature][229]) Vendored the correct version of sensu-go.
- Fixed a bug in API validation that rejected JavaScript mutators that use environment variables available in the environment rather than defined in the mutator env_vars attribute.
- Fixed a bug that prevented asset expansion errors from being handled.

## 6.5.2 release notes

**October 28, 2021** &mdash; The latest release of Sensu Go, version 6.5.2, is now available for download.

The Sensu Go 6.5.2 patch release adds a number of metrics to provide more information about event handling and asset fetching and extraction.
In addition, this patch makes operating system environment variables accessible with JavaScript mutators and omits an extraneous attribute that appeared in web UI resource data.

Read the [upgrade guide][1] to upgrade Sensu to version 6.5.2.

**IMPROVEMENTS**

- For JavaScript mutators, you can now list the names of any environment variables that are available in your environment (in addition to defining environment variables) in the [env_vars attribute][254].
This allows you to transform events with metatdata from the Sensu environment, which is useful for downstream processing and filtering when sending Sensu event data for further processing.
- Added sensu_go_event_handler_duration_sum and sensu_go_event_handler_duration_count and added `status` and `event_type` labels to the sensu_go_event_handler_duration metric.
These updates allow you to determine whether an event was handled successfully.
- Added summary metrics for pipelined and pipeline operations to provide insight into how time is spent when pipelined and a pipeline resource handles an event:
    - sensu_go_pipelined_message_handler_duration
    - sensu_go_pipeline_duration
    - sensu_go_pipeline_resolve_duration
    - sensu_go_pipeline_filter_duration
    - sensu_go_pipeline_mutator_duration
    - sensu_go_pipeline_handler_duration
- Added summary metrics for eventd to provide insight into how time is spent when eventd handles an event:
    - sensu_go_eventd_create_proxy_entity_duration
    - sensu_go_eventd_update_event_duration
    - sensu_go_eventd_bus_publish_duration
    - sensu_go_eventd_liveness_factory_duration
    - sensu_go_eventd_switches_alive_duration
    - sensu_go_eventd_switches_bury_duration
- Added two metrics to provide insight into how time is spent when an asset is fetched and extracted:
    - sensu_go_asset_fetch_duration
    - sensu_go_asset_expand_duration

**FIXES**

- ([Commercial feature][229]) Fixes a bug in the web UI that added a `__virtual` attribute in the [resource data][249] for configuration resources.

## 6.5.1 release notes

**October 20, 2021** &mdash; The latest release of Sensu Go, version 6.5.1, is now available for download.

This patch fixes several issues in the web UI and adds Prometheus counters for pipeline workflow handler processing.

Read the [upgrade guide][1] to upgrade Sensu to version 6.5.1.

**IMPROVEMENTS**

- Added Prometheus counters for pipeline workflow handler processing:
    - sensu_go_handler_requests: Number of processed handler requests
    - sensu_go_handler_requests_total: Total number of handler requests invoked

**FIXES**

- ([Commercial feature][229]) Fixed a bug that could result in an error when listing entities with the PostgreSQL store enabled.
- ([Commercial feature][229]) In the web UI, fixed an issue with the native date and time picker that could cause problems when creating silences.
- ([Commercial feature][229]) In the web UI, fixed a bug that prevented users from editing service components.
- ([Commercial feature][229]) In the web UI, fixed the redirect for deleting entities so that it returns users to the Entities page rather than loading a 404 page for the deleted entity's details.

## 6.5.0 release notes

**October 13, 2021** &mdash; The latest release of Sensu Go, version 6.5.0, is now available for download.

This release includes a number of improvements, specifically exciting new capabilities in the observability pipeline and a major simplification to how "pipelines" are configured. Sensu Go 6.5.0 introduces a new first-class `Pipeline` resource for defining logical pipeline workflows composed of filters + mutators + handlers. We’re also introducing new streaming handler types: a TCPStreamHandler with TLS support and a SumoLogicMetricsHandler for seamless integration with the Sumo Logic Continuous Intelligence platform. Enhancements in the web UI include a completely overhauled configuration management system (with new views for the Checks, Filters, Handlers, and Mutators pages) and behind-the-scenes improvements that pave the way for even more new configuration management capabilities in future releases. Read the full release notes below for all the details!

Read the [upgrade guide][1] to upgrade Sensu to version 6.5.0.

**NEW FEATURES:**

- ([Commercial feature][229]) Added [Sensu Plus][247], a built-in integration you can use to transmit your Sensu observability data to Sumo Logic via the Sumo Logic HTTP Logs and Metrics Source.
- ([Commercial feature][229]) Added support for [Sumo Logic metrics handlers][230] and [TCP stream handlers][231]. The [enterprise/pipeline/v1 API endpoints][232] provide HTTP access for retrieving and configuring Sumo Logic metrics handlers and TCP stream handlers.
- ([Commercial feature][229]) You can now [view resource data][249] for events, entities, and configuration resources like checks and handlers directly in the web UI.
- ([Commercial feature][229]) In the web UI, you can [execute individual checks on demand][250] either according to existing subscriptions or on specific agents by adding and removing subscriptions without making changes to the saved check subscriptions.
- ([Commercial feature][229]) Added Prometheus metrics for TCP stream handlers:
    - sensu_go_tcp_stream_handler_events: Total number of events handled by the TCP stream handler
    - sensu_go_tcp_stream_handler_errors: Total number of errors produced by the TCP stream handler
    - sensu_go_tcp_stream_handler_latency: Distribution of handler latencies, in milliseconds, for the TCP stream handler
    - sensu_go_tcp_stream_handler_connection_acquisition_latency: Distribution of connection acquisition latencies (how long it takes to acquire a connection from the connection pool), in milliseconds, within the TCP stream handler
- New [pipelines][233] resource allows you to specify event filters, mutators, and handlers in a single workflow instead of listing filters and mutators in handler definitions. You can reference pipelines in your check definitions. The [`/pipelines` API endpoint][234] provides HTTP access for retrieving pipeline data and configuring pipelines, and you can use [sensuctl][235] to manage pipelines. [Upgrade your Sensu agents][1] to Sensu Go 6.5.0 to use pipelines resources.
- [JavaScript mutators][246] are now available. JavaScript mutators are evaluated by the Otto JavaScript VM as JavaScript programs, which enables greater throughput at scale than pipe mutators.
- Check definitions now include the [pipelines attribute][236] for specifying pipeline resources to use for the check's observability events.
- Added [platform metrics logging][238] to log core Sensu metrics in InfluxDB Line Protocol format, along with the `disable-platform-metrics`, `platform-metrics-log-file`, and `platform-metrics-logging-interval` backend configuration flags for managing the platform metrics logging feature.
- [Event logging][237] is no longer a commercial-only feature.
- You can now set sensuctl environment variables for a [single sensuctl command][243] or with [sensuctl configure][244].

**IMPROVEMENTS:**

- Added environment variables `SENSU_BACKEND_ETCD_CLIENT_USERNAME` and `SENSU_BACKEND_ETCD_CLIENT_PASSWORD` for [connecting to external etcd via username and password authentication][245] instead of certificate authentication. There are no corresponding configuration flags &mdash; these configuration options must be set via environment variables.
- You can now add an [API key][248] when you initialize the backend to make automated cluster setup and deployment more straightforward.
- Events now include the name of the agent that processed the event in the [`processed_by` attribute][251] to help you determine which agent processed an event executed by a proxy check request or a POST request to the events API.
- Added the [`ignore-already-initialized` backend flag][253], which you can use to suppress the "already initialized" response and return an exit code 0 if a cluster has already been initialized.
- Upgraded Go version from 1.16.5 to 1.17.1.

**SECURITY:**

- Migrated [dgrijalva/jwt-go][239] to [golang-jwt/jwt][240] to address a vulnerability that would allow attackers to bypass intended access restrictions in situations. Read [CVE-2020-26160][241] for more information.

**FIXES:**

- Sensuctl env now properly lists `SENSU_API_KEY` and `SENSU_TIMEOUT` as options for [exporting environment variables][242]. In addition, sensuctl command exec now properly adds the `SENSU_API_KEY` and `SENSU_TIMEOUT` variables to the command's environment.
- Fixed a bug that could cause a crash when running the backend on darwin/arm64 and compressing a wrapped resource.
- Fixed a bug that could result in an etcd error if the number of silences in a given transaction exceeded etcd's default maximum number of operations per transaction.

## 6.4.3 release notes

**September 1, 2021** &mdash; The latest release of Sensu Go, version 6.4.3, is now available for download.

This patch fixes a deadlock in the event log writer.

Read the [upgrade guide][1] to upgrade Sensu to version 6.4.3.

**FIXES:**

- ([Commercial feature][215]) Fixed a bug that caused a deadlock in the [event log][228] writer.

## 6.4.2 release notes

**August 31, 2021** &mdash; The latest release of Sensu Go, version 6.4.2, is now available for download.

This patch adds a backend configuration attribute that allows parallel event log encoding, as well as two summary metrics for the /metrics API endpoint.

Read the [upgrade guide][1] to upgrade Sensu to version 6.4.2.

**FIXES:**

- ([Commercial feature][215]) Added the [`event-log-parallel-encoders`][226] backend configuration attribute, which allows you to indicate whether Sensu should use parallel JSON encoders for event logging instead of the default (a single JSON encoding worker). This fixes a bottleneck in the event logging feature.

**IMPROVEMENTS:**

- Added sensu_go_agentd_event_bytes and sensu_go_store_event_bytes summary metrics to the [/metrics API endpoint][227]. sensu_go_agentd_event_bytes tracks the sizes of events, in bytes, received by agentd on the backend. sensu_go_store_event_bytes tracks event sizes, in bytes, received by the etcd store on the backend.

## 6.4.1 release notes

**August 25, 2021** &mdash; The latest release of Sensu Go, version 6.4.1, is now available for download.

This patch includes fixes that improve forward- and backward-compatibility for backends and prevent `sensuctl cluster member-list` crashes, as well as changes to the default log levels for webd, the API, and the sensu-agent.

Read the [upgrade guide][1] to upgrade Sensu to version 6.4.1.

**FIXES:**

- ([Commercial feature][215]) For LDAP configurations, the `allowed_groups` attribute is omitted if not populated.
This change improves backend reliability with older versions of federation and sensuctl.
- Fixed a bug to prevent `sensuctl cluster member-list` crashes when the etcd response header is nil.
- Fixed a `sensu-backend init` regression that returned exit status 0 if the store was already initialized.
- Sensu Go OSS can now be built on darwin/arm64.

**IMPROVEMENTS:**
- ([Commercial feature][215]) The default webd log level is now `warn`.
- The default log level for the Sensu API and [`sensu-agent`][225] is now `warn` (instead of `info`). 
- The sensu-backend now reports when it is ready to process events at the `warn` level.
- You can now create resources with fields that are unknown to Sensu.
This change improves forward-compatibility with newer Sensu backends.

## 6.4.0 release notes

**June 28, 2021** &mdash; The latest release of Sensu Go, version 6.4.0, is now available for download. 

The latest release of Sensu Go, version 6.4.0, is now available for download. This release includes a number of feature improvements and important bug fixes. We upgraded the embedded etcd from version 3.3 to 3.5 for improved stability and security. The `sensu-backend init` command now supports a `wait` flag, which indicates that the backend should repeatedly try to establish a connection to etcd until it is successful -- fantastic news for Kubernetes users who want to bootstrap new Sensu Go clusters with external etcd! Check timeout also now works properly on Windows hosts: the Sensu Go agent can terminate check sub-processes on check execution timeout. This release fixes a bug that prevented deregistration events from working. There’s something for everyone in this release!

Read the [upgrade guide][1] to upgrade Sensu to version 6.4.0.

**NEW FEATURES:**

- ([Commercial feature][215]) In the web UI, the system information modal now includes license expiration information, accessed via the `CTRL .` keyboard shortcut, for users with the appropriate permissions.
- ([Commercial feature][215]) Added [page-specific configuration][221] options and a custom [sign-in message attribute][220] for the web UI.
- Added binary-only distribution for [macOS arm64][216].

**IMPROVEMENTS:**

- Added [etcd-log-level configuration flag][217] for setting the log level for the embedded etcd server.
- Added [`wait` flag][218] for the `sensu-backend init` command, which indicates the backend should repeatedly try to establish a connection to etcd until it is successful.
- The `timeout` flag for `sensu-backend init` is now treated as a duration instead of seconds (example duration format is `10s` for 10 seconds or `5m` for 5 minutes).
Values less than 1 second and integer values will be interpreted as seconds.
- Added `sensu_go_keepalives` Prometheus metric to count keepalive statuses over time and help identify instability due to keepalive failure.
- Upgraded Go version from `1.13.15` to `1.16.5`.
- Upgraded etcd version from `3.3.22` to `3.5.0`.
As a result, **6.4.0 is not backward-compatible with previous Sensu versions**.
Read the [upgrade instructions][222] for details about creating a full etcd database backup before you upgrade to Sensu Go 6.4.0.
Also, in etcd 3.5, some Prometheus metric names changed.
Read the [etcd documentation][219] for details.

**FIXES:**

- ([Commercial feature][215]) Selector statements that begin with quotes no longer cause an error if they follow the `&&` operator.
- ([Commercial feature][215]) Fixed a bug that allowed PostgresConfig resources to include a namespace attribute.
Also, invalid PostgresConfig resources can no longer be created.
- Fixed a bug that resulted in OK keepalive status after shutting down the agent.
- Fixed a bug in role-based access control (RBAC) that caused incorrect HTTP API statuses and web UI crashes when role bindings referred to missing roles.
The API now returns status `403` with a message to explain that the referenced role is missing.
- Fixed a bug that prevented deregistration events from validating due to empty `event.check.subscriptions` arrays.
- Fixed a bug that caused Windows agents to handle command timeouts improperly.

## 6.3.0 release notes

**May 26, 2021** &mdash; The latest release of Sensu Go, version 6.3.0, is now available for download.

This release includes several new features, enhancements, bug fixes, and usability improvements. Construct a top-level business service-centric view for distributed infrastructure and applications with a preview of Business Service Monitoring! Rate-limit Sensu Go agent transport connections without using a separate load balancer. Use an API key to authenticate sensuctl, which is handy when automating Sensu Go configuration (for example CI pipelines) and other actions (like ad hoc check execution requests). The 6.3.0 release also improves the PostgreSQL store batching capabilities, raising the event processing throughput ceiling for most deployments. Check out the release notes below for more details &mdash; there’s so much to love about this release!

Read the [upgrade guide][1] to upgrade Sensu to version 6.3.0.

**NEW FEATURES:**

- ([Commercial feature][207]) Added [business service monitoring (BSM)][210] to provide high-level visibility into the current health of any number of business services, with a [built-in aggregate check rule template][211].
- ([Commercial feature][207]) Added support for agent transport rate limiting via [`agent-burst-limit`][208] and [`agent-rate-limit`][209] backend configuration flags.
- ([Commercial feature][207]) Added the `event-log-buffer-wait` backend configuration flag, which allows you to specify how long the event logger will wait for the writer to consume events from the buffer when the buffer is full.
- Added the entity class [service][213], which represents a business service for the business service monitoring (BSM) feature.

**IMPROVEMENTS:**

- ([Commercial feature][207]) The [agent transport health API endpoint][212] repsonse now includes PostgreSQL health information.
- ([Commercial feature][207]) Added the [`poll_interval` default preferences][223] attribute to the `GlobalConfig` resource so administrators can adjust how often the web UI pages poll for new data.
- ([Commercial feature][207]) In the web UI, some form fields now include examples of valid values.
- Added the `--api-key` [global flag][214] for sensuctl commands. Use this flag with sensuctl commands to bypass username/password authentication.
- Logs for JavaScript filter evaluation errors now include more context.
- Concatenated YAML files now support carriage return and line feed (CRLF).
- Removed extraneous shell auto-completion suggestions for sensuctl.

**FIXES:**

- ([Commercial feature][207]) Migrated the PostgreSQL event store from github.com/lib/pq to github.com/jackc/pgx so that PostgreSQL batching works properly.
- ([Commercial feature][207]) In the web UI, error messages are now visible in dark mode.
- Fixed a bug that could cause the scheduler to crash when using round robin checks.
- Fixed a bug that calculated build information for every keepalive in OSS builds.
- SIGHUP no longer triggers an internal restart.

## 6.2.7 release notes

**April 1, 2021** &mdash; The latest release of Sensu Go, version 6.2.7, is now available for download.

This patch includes fixes for potential deadlocks in metricsd and agentd and crashes in the scheduler and tessend as well as for a bug that calculated build information for every keepalive.

Read the [upgrade guide][1] to upgrade Sensu to version 6.2.7.

**FIXES:**

- ([Commercial feature][193]) Fixed a potential deadlock in metricsd that could occur when performing an
internal restart.
- Fixed a potential deadlock in agentd due to the unit test timing out in the build pipeline.
- Fixed a bug that could cause the scheduler to crash when using round robin checks.
- Fixed a bug that calculated build information for every keepalive in OSS builds.
- Fixed a potential crash in tessend that could occur if the `ringv2.Event.Value` has a zero length.
- Fixed a bug that allowed some etcd watchers to try to process watch events that contain invalid pointers.

## 6.2.6 release notes

**March 25, 2021** &mdash; The latest release of Sensu Go, version 6.2.6, is now available for download.

This patch fixes a bug that allowed PostgreSQL round robin scheduling to use a separate PostgreSQL connection for each subscription and improves the validation for POST/PUT requests for enterprise API endpoints.

Read the [upgrade guide][1] to upgrade Sensu to version 6.2.6.

**FIXES:**

- ([Commercial feature][193]) Fixed a bug that allowed PostgreSQL round robin scheduling to use a separate PostgreSQL connection for each subscription. PostgreSQL round robin scheduling now uses exactly one extra PostgreSQL connection.
- ([Commercial feature][193]) Improved the validation for POST/PUT requests for enterprise API endpoints. Sensu now checks the type and namespace in the request body against the type and namespace in the request URL.

## 6.2.5 release notes

**February 2, 2021** &mdash; The latest release of Sensu Go, version 6.2.5, is now available for download.

This patch fixes a bug regarding the event occurrences_watermark property.
This bug interfered with the property's expected behavior when using event filters like the popular fatigue check filter.

Read the [upgrade guide][1] to upgrade Sensu to version 6.2.5.

**FIXES:**

- ([Commercial feature][193]) Fixed a bug that prevented occurrences_watermark from incrementing for non-zero events when using the PostgreSQL datastore.

## 6.2.4 release notes

**January 28, 2021** &mdash; The latest release of Sensu Go, version 6.2.4, is now available for download.

This patch fixes a bug that prevented `federation/v1.Cluster` from appearing in the response for `sensuctl describe-type all` and resolves a web UI performance issue for PostgreSQL users.

Read the [upgrade guide][1] to upgrade Sensu to version 6.2.4.

**FIXES:**

- ([Commercial feature][193]) `federation/v1.Cluster` now appears in the `sensuctl describe-type all` response.
- ([Commercial feature][193]) Fixed a performance issue that affected the web UI when using the PostgreSQL datastore.

## 6.2.3 release notes

**January 21, 2021** &mdash; The latest release of Sensu Go, version 6.2.3, is now available for download.

This patch fixes two bugs: one that could prevent the `--agent-managed-entity` configuration from working properly and one that caused `sensuctl dump` output to include events from all namepaces rather than the specified namespace.

Read the [upgrade guide][1] to upgrade Sensu to version 6.2.3.

**FIXES:**

- Fixed a bug that prevented the [agent-managed-entity][203] configuration attribute from working properly when no labels are defined.
- Fixed a bug where `sensuctl dump` output included events from all namespaces the user had access permissions for rather than events from only the specified namespace.

## 6.2.2 release notes

**January 14, 2021** &mdash; The latest release of Sensu Go, version 6.2.2, is now available for download.

This patch fixes bugs that prevented PostgreSQL round robin scheduling from working properly.

Read the [upgrade guide][1] to upgrade Sensu to version 6.2.2.

**FIXES:**

- ([Commercial feature][193]) Fixed a bug that could improperly enable PostgreSQL round robin scheduling after creating a PostgreSQL configuration.
- ([Commercial feature][193]) Fixed a bug that prevented PostgreSQL round robin scheduling if the namespace and check names were more than 63 characters long, combined.

## 6.2.1 release notes

**January 11, 2021** &mdash; The latest release of Sensu Go, version 6.2.1, is now available for download.

This patch fixes bugs that could prevent users from enabling PostgreSQL after upgrading from 5.x or configuring agent labels and annotations with flags. In addition, `sensuctl prune hook` and `sensuctl prune check` now work as expected and users can no longer edit agent-managed entities in the web UI.

Read the [upgrade guide][1] to upgrade Sensu to version 6.2.1.

**FIXES:**

- ([Commercial feature][193]) Fixed a bug that prevented users from enabling PostgreSQL as the event store after upgrading from 5.x.
- ([Commercial feature][193]) The `sensuctl prune hook` and `sensuctl prune check` subcommands now work as expected.
- ([Commercial feature][193]) In the web UI, fixed a bug that allowed users to edit Sensu [agent-managed entities][204].
- Fixed a bug that generated a small amount of extra etcd or PostgreSQL traffic upon keepalive failure.
- In silenced entries, the `expire` field now represents the configured number of seconds until the entry should be deleted rather than the entry's remaining duration.
- Labels and annotations can now be configured with [flags][205] for sensu-agent.

## 6.2.0 release notes

**December 17, 2020** &mdash; The latest release of Sensu Go, version 6.2.0, is now available for download.

The latest release of Sensu Go, version 6.2.0, is now available for download! Sensu Go 5.x and configuration management users rejoice: this release adds support for agent local configuration (that is, agent.yml) managed entities! Agent entities may now be managed exclusively by their agents when `sensu-agent` is started with the new `agent-managed-entity` configuration option. This makes it more straightforward to migrate from Sensu Go 5.x to 6.x, as existing agent entity management workflows like Puppet will just work with the new option enabled! Note that you will not be able to edit agent-managed entities via the backend REST API or web UI.

Sensu Go 6.2.0 includes significant feature enhancements such as PostgreSQL backend round robin check scheduling for increased reliability and consistency, an updated format for silenced entry dates and durations in sensuctl tabular-format output, and a /health API endpoint for agent WebSocket transport status. This release delivers important bug fixes like consistently using `event_id` in logs and eliminating the sensuctl error when Vault provider SSL certificates do not exist on the local system. Also, enterprise/prune/v1alpha no longer requires cluster-wide permissions; users with limited permissions can put it to use in their namespaces!

Read the [upgrade guide][1] to upgrade Sensu to version 6.2.0.

**NEW FEATURES:**

- ([Commercial feature][193]) Added support for the `memberof` attribute for the [LDAP authentication provider][199].
- ([Commercial feature][193]) Added the ability to exclude resource types when using sensuctl prune with the [--omit flag][200].
- ([Commercial feature][193]) Added support for [round robin scheduling on PostgreSQL][201] instead of etcd.
- ([Commercial feature][193]) Added support for OIDC authentication via [sensuctl configure][202].
- Entities may now be [managed exclusively by their agents][204] when sensu-agent is started with the [agent-managed-entity][203] configuration attribute.
- The [/metrics API endpoint][196] now exposes build information as a Prometheus metric.
- Added /health API endpoint to agent WebSocket transport.
- Checks now include the [`scheduler` attribute][197], which Sensu automatically populates with the type of scheduler that schedules the check.
- Events now include the [`sequence` attribute][198], which the Sensu agent automatically sets at startup and increments by 1 at every successive check execution or keepalive event.
- Added support for using environment variables to define the configuration file paths for the Sensu agent (`SENSU_CONFIG_FILE`) and backend (`SENSU_BACKEND_CONFIG_FILE`).

**IMPROVEMENTS:**

- ([Commercial feature][193]) Refactored entity limiter to ensure that warning messages about approaching a license's entity or entity class limit are now only displayed for users with `create` or `update` permissions for the license.
- ([Commercial feature][193]) The [enterprise/prune/v1alpha API] endpoints[194] and the [sensuctl interface][195] now require less-broad permissions.
- Adjusted the format for silenced entry dates and durations in sensuctl tabular-format output. For all silenced entries, the begin date is now listed in RFC 3339 format. For silenced entries that have not begun, the list displays the expiration date in RFC 3339 format. For silenced entires with no expiration date, the list displays `-1`. For silenced entries that have begun, the list displays the duration (for example, 1m30s).
- Sensuctl and sensu-backend now ask users to retype their passwords when creating a new password in interactive mode.

**FIXES:**

- ([Commercial feature][193]) Sensuctl no longer produces an error when SSL certificates for the Vault provider do not exist on the local system.
- Logs now consistently use `event_id` rather than `event_uuid`.
- Sensuctl commands that only contain subcommands now exit with status code 46 when no arguments or incorrect arguments are given.
- The sensuctl dump command now includes a description.
- Sensuctl command descriptions now have consistent capitalization.
- Use of the `config-file` flag is no longer order-dependent.

## 6.1.4 release notes

**December 16, 2020** &mdash; The latest release of Sensu Go, version 6.1.4, is now available for download.

This patch fixes a bug that could cause a crash in the backend API, addresses a case where agents do not honor HTTP proxy environment variables, and improves the error message reported by the agent when asset checksums do not match expectations.

Read the [upgrade guide][1] to upgrade Sensu to version 6.1.4.

**FIXES:**

- Fixed a bug that could cause a panic in the backend core/v2/entities API.
- The agent asset fetching mechanism now respects HTTP proxy environment variables when `trusted-ca-file` is configured.
- When an asset artifact retrieved by the agent does not match the expected checksum, the logged error now includes the size of the retrieved artifact and more clearly identifies the expected and actual checksums.

## 6.1.3 release notes

**November 9, 2020** &mdash; The latest release of Sensu Go, version 6.1.3, is now available for download.

This patch fixes a bug that caused event updates to fail with an error about a null value in the occurrences column.
This bug only affects Sensu instances that use PostgreSQL as the event store.

Read the [upgrade guide][1] to upgrade Sensu to version 6.1.3.

**FIXES:**

- ([Commercial feature][172]) For instances that use PostgreSQL as the event store, fixed a bug that caused event updates to fail with an error message about a null value in the occurrences column.


## 6.1.2 release notes

**October 28, 2020** &mdash; The latest release of Sensu Go, version 6.1.2, is now available for download.

This patch release resolves a backend and agent crash related to JavaScript execution.

Read the [upgrade guide][1] to upgrade Sensu to version 6.1.2.

**FIXES:**

- Fixed a bug related to JavaScript execution that could cause a crash in the backend and agent.


## 6.1.1 release notes

**October 22, 2020** &mdash; The latest release of Sensu Go, version 6.1.1, is now available for download.

This patch release includes a number of bug fixes that affect proper hook handling with `sensuctl prune` and `sensuctl dump`, entity creation via `sensuctl create`, form validation for subscription names in the web UI, and permissions for PATCH requests, among other fixes.

Read the [upgrade guide][1] to upgrade Sensu to version 6.1.1.

**FIXES:**

- ([Commercial feature][172]) [`sensuctl prune`][192] now properly handles hooks when pruning resources.
- ([Commercial feature][172]) Fixed a bug that returned incorrect `!=` results for label selectors when no labels were defined.
- ([Commercial feature][172]) In the web UI, fixed a bug that could cause a GraphQL `no claims` error when a user's access token was no longer valid instead of displaying the sign-out dialog window.
- ([Commercial feature][172]) In the web UI, form validation for subscription names now matches allowed values.
- Fixed a bug that prevented sensu-agent from shutting down correctly.
- Entities are now properly created using `sensuctl create`.
- Per-entity subscriptions now persist with PATCH requests.
- Any user with [`update` permissions][190] for a resource can now make PATCH requests for that resource.
- HookConfig can now be exported via [`sensuctl dump`][191]. Also, `sensuctl dump` now properly logs API errors.
- eventd errors now include additional context for debugging.


## 6.1.0 release notes

**October 5, 2020** &mdash; The latest release of Sensu Go, version 6.1.0, is now available for download.

This release delivers significant performance and stability gains, feature enhancements, and several bug fixes. The web UI is now much snappier, and its search is redesigned with an improved syntax and suggestions! Monitor even more services and infrastructure when using the PostgreSQL store: batched Sensu event writes and improved indexing allows a single Sensu Go deployment to process and query more data than ever before. If you’re using Prometheus client libraries to instrument your applications, the Sensu Go agent can now scrape and enrich those metrics! And if you’re collecting metrics in other formats like Nagios PerfData, you can use the new output metric tags feature to enrich those metrics too! The sensuctl prune command also received some love, and it now loads and prunes configuration resources from multiple files!

Read the [upgrade guide][1] to upgrade Sensu to version 6.1.0.

**NEW FEATURES:**

- ([Commercial feature][172]) Added support for custom secrets engine paths in [Vault secrets][175].
- ([Commercial feature][172]) In the web UI, added [new search functionality][178], with improved syntax and suggestions.
- ([Commercial feature][172]) Added [`strict` attribute][179] to the PostgresConfig type to help debug incorrect configurations and database permissions.
- ([Commercial feature][172]) Added [`batch_buffer`, `batch_size`, and `batch_workers` attributes][181] to the PostgresConfig type so operators can optimize PostgreSQL latency and throughput.
- ([Commercial feature][172]) Added TLS configuration to the cluster resource so you can specify additional CA certificates and insecure mode.
- ([Commercial feature][172]) Added a `types` query parameter for listing [authentication providers][176] and [secrets providers][177] via the API.
- ([Commercial feature][172]) Added the [Sensu SaltStack Enterprise Handler][183] for launching
SaltStack Enterprise Jobs for automated remediation.
- ([Commercial feature][172]) The Alpine-based Docker image now has multi-architecture support with support for the linux/386, linux/amd64, linux/arm64, linux/arm/v6, linux/arm/v7, linux/ppc64le, and linux/s390x platforms.
- The backend flag [`--api-request-limit`][173] is now available to configure the maximum API request body size (in bytes).
- In the [REST API][174], most configuration resources now support the PATCH method for making updates.
- Added new handler and check plugins: [Sensu Go Elasticsearch Handler][184], [Sensu Rundeck Handler][185], and [Sensu Kubernetes Events Check][186].

**IMPROVEMENTS:**

- ([Commercial feature][172]) Improved logging for OIDC authentication providers. Also added [`disable_offline_access` OIDC spec attribute][180], which provides a workaround for authorization servers that do not support the `offline_access` scope.
- ([Commercial feature][172]) Added indexed field and label selectors to the PostgreSQL event store to improve performance for PostgreSQL event store queries with field and label selectors.
- Added Prometheus transformer for extracting metrics from check output using the Prometheus Exposition Text Format.
- Added the [`output_metric_tags` attribute][182] for checks so you can apply custom tags to enrich metric points produced by check output metric extraction.
- A warning is now logged when you request a dynamic runtime asset that does not exist.
- The trusted CA file is now used for agent, backend, and sensuctl asset retrieval.
- Per-entity subscriptions (such as `entity:entityName`) are always available for agent entities, even you remove subscriptions via the core/v2/entities API endpoints.
- Updated the [Sensu TimescaleDB Handler][187] to write tags as a JSON object instead of an array of objects, which facilitates tags queries.
- Updated the [Sensu Go Data Source for Grafana][188] plugin to support using API keys, fetching resources from all namespaces, using Sensu's built-in resposne filtering, grouping aggregation results by attribute, and number of [other improvements][189].

**FIXES:**

- ([Commercial feature][172]) Fixed a bug in `sensuctl dump` that allowed polymorphic resources (e.g., secrets providers and authentication providers) to dump other providers of the same type.
- ([Commercial feature][172]) Check output is no longer truncated in the event log file when the max output size is set and the PostgreSQL event store is enabled.
- ([Commercial feature][172]) Sensuctl prune now handles multi-file/multi-url input correctly.
- ([Commercial feature][172]) Fixed a bug where PostgreSQL errors could cause the backend to panic.
- ([Commercial feature][172]) Fixed a bug where PostgreSQL would refuse to store event with a negative check status.
- The backend will no longer start if the web UI TLS configuration is not fully specified.
- The agent entity is now included in data passed to the STDIN for the command process.
- Improved check scheduling to prevent stale proxy entity data when using cron or round robin schedulers.
- Fixed a bug that resulted in incorrect entity listings for agent entities created via the API instead of sensu-agent.
- When downloading assets, Sensu now closes the response body after reading from it.
- Fixed a crash in the backend and agent related to JavaScript execution.

## 6.0.0 release notes

**August 10, 2020** &mdash; The latest release of Sensu Go, version 6.0.0, is now available for download.

With Sensu Go 6.0.0, you can control everything through the API. You can still use configuration management tools to bootstrap agent entities, but you don’t need to! Our new agent entity management feature via the backend configuration API nearly eliminates the need for external (or out-of-band) configuration management for Sensu, which allows you to manage agent entity subscriptions and automate the discovery of system facts without updating agent local configuration files. Run a sensuctl command, click a button in the web UI, or execute a custom check plugin!

Read the [upgrade guide][1] to upgrade Sensu to version 6.0.0.

**BREAKING CHANGES FOR SENSU 6.0:**

- The database schema for entities has changed.
As a result, after you complete the steps to [upgrade to Sensu 6.0][170] (including running the `sensu-backend upgrade` command), you will not be able to use your database with older versions of Sensu.
- For Sensu Go instances [built from source][164], the web UI is now a [standalone product][163] &mdash; it is no longer included with the Sensu backend.
Visit the [Sensu Go Web repository][163] for more information.
- After initial creation, you cannot change your [`sensu-agent` entity configuration][171] by modifying the agent's configuration file.

**NEW FEATURES:**

- ([Commercial feature][162]) Sensu now logs a warning when secrets cannot be sent to an agent because mTLS is not enabled.
- ([Commercial feature][162]) Added [JavaScript functions][169] `sensu.EventStatus`, `sensu.FetchEvent`, and `sensu.ListEvents` to the filter execution environment so you can now query the Sensu event store for other events within the filter namespace.
- ([Commercial feature][162]) Docker-only Sensu now binds to the hostname of containers instead of `localhost`. Docker images now set their own default values for environment variables `SENSU_AGENT_API_URL`, `SENSU_BACKEND_API_URL`, `SENSU_BACKEND_ETCD_INITIAL_CLUSTER`, `SENSU_BACKEND_ETCD_ADVERTISE_CLUSTER`, `SENSU_BACKEND_ETCD_INITIAL_ADVERTISE_PEER_URLS`, `SENSU_BACKEND_ETCD_LISTEN_CLIENT_URLS`, and `ETCD_LISTEN_PEER_URLS`.
- ([Commercial feature][162]) Added Linux packages for 386; armv5, armv6, and armv7; MIPS hard float, MIPS LE hard float, and MIPS 64 LE hard float; ppc64le; and s390x architectures.
Review the [supported platforms][165] page for a complete list of Sensu’s supported platforms.
- Added [Sensu query expression][168] `sensu.CheckDependencies`.
- Added [binary-only distributions][164] for FreeBSD `armv5`, `armv6`, and `armv7` and Linux `ppc64le` and `s390x`.
- Added the `is_silenced` Boolean attribute to the event.Check object to indicate whether the event was silenced at the time it was processed.

**IMPROVEMENTS:**

- ([Commercial feature][162]) Added support for the `memberOf` attribute in Active Directory (AD).
- ([Commercial feature][162]) Added more descriptive information for errors in the federated web UI.
- The `dead` and `handleUpdate` methods in keepalived now use `EntityConfig` and `EntityState` respectively.
- The `dead()` and `createProxyEntity()` methods in eventd now use `corev3.EntityConfig` and `corev3.EntityState`.
- Agent entity updates now ignore state-related fields.
- You can now manage Sensu agent configuration via the HTTP API.
- For sysvinit services, Sensu now passes users' secondary groups (that is, groups other than the Sensu user group) to `chroot`, which gives the Sensu agent and backend access to the file access writes that are granted to the secondary groups.
- Output of `sensuctl asset add` now includes help for using the runtime asset.
- For role bindings and cluster role bindings, [`subjects.name`][166] values can now include unicode characters, and [`roleRef.type`][167] and [`subjects.type`][166] values are now automatically capitalized.
- Improved logging for the agent WebSocket connection.
- Improved the wording of the secret provider error message.
- Fewer keys in etcd are now stored for agents.
- Keepalive and round robin scheduling leases are now dealt with more efficiently.
- Upgraded Go version from 1.13.7 to 1.13.15.
- Upgraded etcd version from 3.3.17 to 3.3.22.

**FIXES:**

- ([Commercial feature][162]) Label selectors now work as expected with multiple requirements for events.
- ([Commercial feature][162]) Fixed an issue that prevented broken secrets providers from surfacing their errors.
- ([Commercial feature][162]) Fixed a bug for PostgreSQL datastores that could prevent GraphQL from retrieving all pages when fetching events in a namespace with more than 1000 total events, resulting in an unexpected error.
- ([Commercial feature][162]) Fixed a bug that could cause the backend to panic in case of PostgreSQL errors.
- Sensu now logs and returns and error if it cannot find a mutator.
- Errors produced in the agent by assets, check validation, token substitution, and event unmarshaling are logged once again.
- The User-Agent header is now set only upon on new client creation rather than upon each request.
- When the Sensu agent cannot parse the proper CA certificate path, Sensu logs this in the error message.
- Fixed a bug where highly concurrent event filtering could result in a panic.
- Fixed a bug where nil labels or annotations in an event filtering context would require you to explicitly check whether the annotations or labels are undefined.
With this fix, labels and annotations are always defined (although they may be empty).
- Fixed the log entry field for the check's name in schedulerd.

## 5.21.5 release notes

**March 25, 2021** &mdash; The latest release of Sensu Go, version 5.21.5, is now available for download.

The Sensu 5.21.5 patch release improves the validation for POST/PUT requests for enterprise API endpoints.

Read the [upgrade guide][1] to upgrade Sensu to version 5.21.5.

**FIXES:**

- ([Commercial feature][158]) Improved the validation for POST/PUT requests for enterprise API endpoints. Sensu now checks the type and namespace in the request body against the type and namespace in the request URL.

## 5.21.4 release notes

**March 9, 2021** &mdash; The latest release of Sensu Go, version 5.21.4, is now available for download.

This patch release fixes a bug that caused the SIGHUP signal to restart the sensu-backend.

Read the [upgrade guide][1] to upgrade Sensu to version 5.21.4.

**FIXES:**

- Fixed a bug that caused the SIGHUP signal used for [log rotation][206] to restart the sensu-backend.

## 5.21.3 release notes

**October 14, 2020** &mdash; The latest release of Sensu Go 5, version 5.21.3, is now available for download.

This patch release includes a few fixes to improve stability and correctness.

Read the [upgrade guide][1] to upgrade Sensu to version 5.21.3.

**FIXES:**

- Fixed a bug where HTTP connections could be left open after downloading assets.
- Fixed a bug where event filter or asset filter execution could cause a crash.
- ([Commercial feature][158]) Fixed a bug where PostgreSQL would refuse to store event with a negative check status.

## 5.21.2 release notes

**August 31, 2020** &mdash; The latest release of Sensu Go, version 5.21.2, is now available for download.

This patch release includes two fixes: one for PostgreSQL errors that could cause the backend to panic and one to ensure that failed check events are written to the event log file.

Read the [upgrade guide][1] to upgrade Sensu to version 5.21.2.

**FIXES:**

- ([Commercial feature][158]) Fixed a bug where PostgreSQL errors could cause the backend to panic.
- Failed check events are now written to the event log file.

## 5.21.1 release notes

**August 5, 2020** &mdash; The latest release of Sensu Go, version 5.21.1, is now available for download.

This patch release includes fixes for a web UI crash when interacting with namespaces that contain 1000 or more events and regressions in logging various agent errors as well as an enhancement that provides additional context to WebSocket connection errors logged by the backend.

Read the [upgrade guide][1] to upgrade Sensu to version 5.21.1.

**IMPROVEMENTS:**

- Backend log messages related to connection errors on the agent WebSocket API now provide more context about the error.

**FIXES:**

- Fixed a potential web UI crash when fetching events in namespace with 1000 or more events.
- Fixed a regression that prevented errors produced in the agent by assets, check validation, token substitution, or event unmarshaling from being logged.

## 5.21.0 release notes

**June 15, 2020** &mdash; The latest release of Sensu Go, version 5.21.0, is now available for download.

The latest release of Sensu Go, version 5.21.0, is now available for download! This release delivers several enhancements and fixes. The most significant enhancements involve user management: you can now generate a password hash, specify the resulting hash in your user definitions without having to store cleartext passwords, and create and update these users using `sensuctl create`. You can also reset user passwords via the backend API. We also tuned Sensu Go agent logging and changed the default log level from warning to info. Plus, we crushed a number of nasty bugs: checks configured with missing hooks can no longer crash the agent, proxy check request errors do not block scheduling for other entities, and more!

Read the [upgrade guide][1] to upgrade Sensu to version 5.21.0.

**NEW FEATURES:**

- ([Commercial feature][158]) Added [entity count and limit][156] for each entity class in the tabular title in the response for `sensuctl license info` (in addition to the total entity count and limit).
- ([Commercial feature][158]) Added Linux amd64 OpenSSL-linked binaries for the Sensu agent and backend, with accompanying `--require-fips` and `--require-openssl` flags for the [agent][161] and [backend][160].
- Added `sensuctl user hash-password` command to generate password hashes.
- Added the ability to reset passwords via the backend API and `sensuctl user reset-password`.

**IMPROVEMENTS:**

- Changed the [default log level for `sensu-agent`][157] to `info` (instead of `warn`).

**FIXES:**

- The password verification logic when running `sensuctl user change-password` is now included in the backend API rather than sensuctl.
- Errors in publishing proxy check requests no longer block scheduling for other entities.
- Using the `--chunk-size` flag when listing namespaces in sensuctl now works properly.
- The agent no longer immediately exits in certain scenarios when components are disabled.
- Fixed a bug that could cause a GraphQL query to fail when querying a namespace that contained event data in excess of 2 GB.

## 5.20.2 release notes

**May 26, 2020** &mdash; The latest release of Sensu Go, version 5.20.2, is now available for download.

This patch release adds username to the API request log to help operators with troubleshooting and user activity reporting, as well as validation for subjects in role-based access control (RBAC) role binding and cluster role binding.
Release 5.20.2 also temporarily disables process discovery so we can investigate and resolve its performance impact on the backend (increased CPU and memory usage).

Read the [upgrade guide][1] to upgrade Sensu to version 5.20.2.

**NEW FEATURES:**

- The API request log now includes the username.

**FIXES:**

- ([Commercial feature][141]) [Process discovery in the agent][155] is temporarily disabled.
- The system’s libc_type attribute is now properly populated for Ubuntu entities.
- Single-letter subscriptions are now allowed.
- Subjects are now validated in RBAC role binding and cluster role binding.
- [Sensuctl command][154] assets can now be retrieved and installed from Bonsai.

## 5.20.1 release notes

**May 15, 2020** &mdash; The latest release of Sensu Go, version 5.20.1, is now available for download.

This patch release includes a bug fix that affects the web UI federated homepage gauges when using the PostgreSQL datastore and several fixes for the data displayed in the web UI entity details.

Read the [upgrade guide][1] to upgrade Sensu to version 5.20.1.

**FIXES:**

- ([Commercial feature][141]) Fixes a bug that prevented the federated homepage in the [web UI][153] from retrieving the keepalive and event gauges when PostgreSQL was configured as the event datastore.
- ([Commercial feature][141]) The [memory_percent and cpu_percent processes attributes][143] are now properly displayed in the [web UI][153].
- In the [web UI][153], the entity details page no longer displays float type (which applies only for MIPS architectures). Also on entity details pages, the system's libc type is now listed and process names are no longer capitalized.

## 5.20.0 release notes

**May 12, 2020** &mdash; The latest release of Sensu Go, version 5.20.0, is now available for download.

This release delivers several new features, substantial improvements, and important fixes. One exciting new feature is agent local process discovery to further enrich entities and their events with valuable context. Other additions include a web UI federation view that provides a single pane of glass for all of your Sensu Go clusters and token substitution for assets. And Windows users rejoice! This release includes many Windows agent fixes, as well as agent log rotation capabilities! 

Read the [upgrade guide][1] to upgrade Sensu to version 5.20.0.

**NEW FEATURES:**

- ([Commercial feature][141]) Added a [`processes` field ][143] to the system type to store agent local processes for entities and events and a `discover-processes` flag to the [agent configuration flags][142] to populate the `processes` field in entity.system if enabled.
- ([Commercial feature][141]) Added a new resource, `GlobalConfig`, that you can use to [customize your web UI configuration][148].
- ([Commercial feature][141]) Added metricsd to collect metrics for the [web UI][153] and the [`metrics-refresh-interval`][224] backend configuration flag for setting the interval at which Sensu should refresh metrics.
- ([Commercial feature][141]) Added process and additional system information to the entity details view in the [web UI][153].
- ([Commercial feature][141]) Added a PostgreSQL metrics suite so metricsd can collect metrics about events stored in PostgreSQL.
- ([Commercial feature][141]) Added [entity class limits][151] to the license.
- Added check hook output to event details page in the [web UI][153].
- Added the [sensuctl describe-type command][144] to list all resource types.
The `sensuctl describe-type` command deprecates `sensuctl dump --types`.
- Added `annotations` and `labels` as [backend configuration][145] options.
- Added [token substitution for assets][146].
- Added `event.is_silenced` and `event.check.is_silenced` [field selectors][138].
- Added `Edition` and `GoVersion` fields to version information. In commercial distributions, the `Edition` version attribute is set to `enterprise`
- Added ability to configure the Resty HTTP timeout. Also, sensuctl now suppresses messages from the Resty library.

**IMPROVEMENTS:**

- ([Commercial feature][141]) The web UI homepage is now a federated view. 
- You can now [increment the log level][140] by sending SIGUSR1 to the sensu-backend or sensu-agent process.
- [License metadata][149] now includes the [current entity count and license entity limit][150].
- In the [web UI][153], users will receive a notification when they try to delete an event without appropriate authorization.
- The Windows agent now has [log rotation][139] capabilities.
- Notepad is now the default editor on Windows rather than vi.

**FIXES:**

- ([Commercial feature][141]) Database connections no longer leak after queries to the cluster /health API.
- In the [web UI][153], any leading and trailing whitespace is now trimmed from the username when authenticating.
- The [web UI][153] preferences dialog now displays only the first five groups a user belongs to, which makes the sign-out button more accessible.
- In the [web UI][153], the deregistration handler no longer appears as `undefined` on the entity details page.
- You can now [escape quotes to express quoted strings][147] in token substitution templates.
- The Windows agent now accepts and remembers arguments passed to `service run` and `service install`.
- The Windows agent now synchronizes writes to its log file, so the file size will update with every log line written.
- The Windows agent now logs to both console and log file when you use `service run`.

## 5.19.3 release notes

**May 4, 2020** &mdash; The latest release of Sensu Go, version 5.19.3, is now available for download.
This is a patch release with many improvements and bug fixes, including a fix to close the event store when the backend restarts, a global rate limit for fetching assets, and fixes for goroutine leaks. Sensu Go 5.19.3 also includes several web UI updates, from fixes to prevent crashes to new color-blindness modes.

Read the [upgrade guide][1] to upgrade Sensu to version 5.19.3.

**FIXES:**

- The event store now closes when the backend restarts, which fixes a bug that allowed Postgres connections to linger after the backend restarted interally.
- The etcd event store now returns exact matches when retrieving events by entity (rather than prefixed matches).
- `sensu-backend init` now logs any TLS failures encountered during initialization.
- `sensuctl logout` now resets the TLS configuration.
- `env_vars` values can now include the equal sign.
- Error logs now include underlying errors encountered when fetching an asset.
- The log level is now WARNING when an asset is not installed because none of the filters match.
- Fixes a bug in the [web UI][135] that could cause labels with links to result in a crash.
- Fixes a bug in the [web UI][135] that could cause the web UI to crash when using an unregistered theme.
- Fixes a bug that could cause the backend to crash.
- Fixes a bug in multi-line metric extraction that appeared in Windows agents.
- Fixes an authentication bug that restarted the sensu-backend when agents disconnected.
- Fixes a bug that meant check `state` and `last_ok` were not computed until the second instance of the event.
- Fixes a bug that caused messages like "unary invoker failed" to appear in the logs.
- Fixes several goroutine leaks.
- Fixes a bug that caused the backend to crash when the etcd client received the error "etcdserver: too many requests."

**IMPROVEMENTS:**

- In the [web UI][135], color-blindness modes are now available.
- In the [web UI][135], labels and annotations with links to images will now be displayed inline.
- Adds a global rate limit for fetching assets to prevent abusive asset retries, which you can configure with the `--assets-rate-limit` and `--assets-burst-limit` flags for the [agent][136] and [backend][137].
- Adds support for restarting the backend via SIGHUP.
- Adds a timeout flag to `sensu-backend init`.
- Deprecated flags for `sensuctl silenced update` subcommand have been removed.

## 5.19.2 release notes

**April 27, 2020** &mdash; The latest release of Sensu Go, version 5.19.2, is now available for download.
This patch release adds two database connection pool parameters for PostgreSQL so you can configure the maximum time a connection can persist before being destroyed and the maximum number of idle connections to retain.
The release also includes packages for Ubuntu 19.10 and 20.04.

Read the [upgrade guide][1] to upgrade Sensu to version 5.19.2.

**FIXES:**

- ([Commercial feature][122]) Adds SQL database connection pool parameters `max_conn_lifetime` and `max_idle_conns` to store/v1.PostgresConfig132.

**IMPROVEMENTS:**

- Sensu packages are now available for Ubuntu 19.10 (Eoan Ermine) and 20.04 (Focal Fossa). Review the [supported platforms][133] page for a complete list of Sensu’s supported platforms and the [installation guide][134] to install Sensu packages for Ubuntu.

## 5.19.1 release notes

**April 13, 2020** &mdash; The latest release of Sensu Go, version 5.19.1, is now available for download.
This is a patch release with a number of bug fixes, including several that affect keepalive events, as well as an addition to the help response for `sensu-backend start` and `sensu-agent start`: the default path for the configuration file.

Read the [upgrade guide][1] to upgrade Sensu to version 5.19.1.

**FIXES:**

- ([Commercial feature][122]) Fixed a bug that caused the PostgreSQL store to be enabled too late upon startup, which caused keepalive bugs and possibly other undiscovered bugs.
- Keepalives now fire correctly when using the PostgreSQL event store.
- Keepalives can now be published via the HTTP API.
- `sensu-agent` no longer allows configuring keepalive timeouts that are shorter than the keepalive interval.
- Eventd no longer mistakes keepalive events for checks with TTL.
- Keepalives now generate a new event universally unique identifier (UUID) for each keepalive failure event.
- Agents now correctly reset keepalive switches on reconnect, which fixes a bug that allowed older keepalive timeout settings to persist.
- Token substitution templates can now express escape-quoted strings.
- The REST API now uses a default timeout of 3 seconds when querying etcd health.
- Pipe handlers now must include a [command][131].
- The response for `sensu-backend start --help` and `sensu-agent start --help` now includes the configuration file default path.
- The system's `libc_type` attribute is now populated on Alpine containers.

## 5.19.0 release notes

**March 30, 2020** &mdash; The latest release of Sensu Go, version 5.19.0, is now available for download.
This release is packed with new features, improvements, and fixes, including our first alpha feature: declarative configuration pruning to help keep your Sensu instance in sync with Infrastructure as Code workflows.
Other exciting additions include the ability to save and share your filtered searches in the web UI, plus a new `matches` substring match operator that you can use to refine your filtering results!
Improvements include a new `created_by` field in resource metadata and a `float_type` field that stores whether your system uses hard float or soft float.
We've also added agent and sensuctl builds for MIPS architectures, moved Bonsai logs to the `debug` level, and added PostgreSQL health information to the /health API payload.

Read the [upgrade guide][1] to upgrade Sensu to version 5.19.0.

**NEW FEATURES:**

- ([Commercial feature][122]) In the [web UI][124], you can now [save, recall, and delete filtered searches][123].
- ([Commercial feature][122]) Added the `matches` substring matching operator for [API response][126], [sensuctl][127], and [web UI][128] filtering selectors.
- ([Commercial feature][122]) Added agent and sensuctl builds for Linux architectures: `mips`, `mipsle`, `mips64`, and `mips64le` (hard float and soft float).
- ([Commercial feature][122]) Sensu now automatically applies the `sensu.io/managed_by` label to resources created via `sensuctl create` for use in the [`sensuctl prune` alpha feature][129].

**IMPROVEMENTS:**

- ([Commercial feature][122]) The [health endpoint][125] now includes PostgreSQL health information.
- Resource metadata now includes the `created_by` field, which Sensu automatically populates with the name of the user who created or last updated each resource.
- The agent now discovers entity libc type, VM system, VM role, and cloud provider.
- System type now includes the `float_type` field, which stores the float type the system is using (hard float or soft float).
- The Bonsai client now logs at the `debug` level rather than the `info` level.
- The store can now create wrapped resources.
- [Tessen][130] now collects the type of store used for events (`etcd` or `postgres`) and logs numbers of authentication providers, secrets, and secrets providers. Tessen data helps us understand how we can improve Sensu, and all Tessen transmissions are logged locally for complete transparency.

**FIXES:**

- Fixed a bug where `event.Check.State` was not set for events passing through the pipeline or written to the event log.
- Fixed a bug that allowed the agent to connect to a backend using a nonexistent namespace.
- Fixed a bug that allowed `subscriptions` to be empty strings.
- Corrected the HTTP status codes for unauthenticated and permission denied errors in the REST API.
- Fixed a bug where check history was incorrectly formed when using the PostgreSQL event store.

## 5.18.1 release notes

**March 10, 2020** &mdash; The latest release of Sensu Go, version 5.18.1, is now available for download.
This release fixes bugs that caused SQL migration failure on PostgreSQL 12, nil pointer panic due to OICD login, and sensu-backend restart upon agent disconnection.
It also includes a reliability improvement &mdash; a change to use the gRPC client rather than the embedded etcd client.

Read the [upgrade guide][1] to upgrade Sensu to version 5.18.1.

**FIXES:**

- ([Commercial feature][115]) Fixed a bug that caused SQL migrations to fail on PostgreSQL 12.
- ([Commercial feature][115]) Fixed a bug where OIDC login could result in a nil pointer panic.
- Changed to using the gRPC client (rather than the embedded etcd client) to improve reliability and avoid nil pointer panics triggered by shutting down the embedded etcd client.
- The Sensu backend no longer hangs indefinitely if a file lock for the asset manager cannot be obtained. Instead, the backend returns an error after 60 seconds.
- Fixed a bug that caused sensu-backend to restart when agents disconnected.
- Fixed a bug where the backend would panic on some 32-bit systems.

## 5.18.0 release notes

**February 25, 2020** &mdash; The latest release of Sensu Go, version 5.18.0, is now available for download.
This release delivers a number of improvements to the overall Sensu Go experience.
From automatic proxy entity creation to unique Sensu event IDs, it’s now much easier to use and troubleshoot your monitoring event pipelines!
If you’re working behind an HTTP proxy, you can now manage remote Sensu Go clusters, as sensuctl now honors proxy environment variables (for example, HTTPS_PROXY).
This release also includes a number of fixes for usability bugs, making for the most polished release of Sensu Go yet, so go ahead and give it a download!

Read the [upgrade guide][1] to upgrade Sensu to version 5.18.0.

**IMPROVEMENTS:**

- The `event.entity.entity_class` value now defaults to `proxy` for [`POST /events`][114] requests.
- If you use the [core/v2/events API][118] to create a new event with an entity that does not already exist, the sensu-backend will automatically create a proxy entity when the event is published.
- Sensuctl now accepts Bonsai asset versions that include a prefix with the letter `v` (for example, `v1.2.0`).
- The /version API now retrieves the Sensu agent version for the Sensu instance.
- Log messages now indicate which filter dropped an event.
- Sensu now reads and writes `initializationKey` to and from EtcdRoot, with legacy support (read-only) as a fallback.
- Sensu will now check for an HTTP response other than `200 OK` response when fetching assets.
- Updated Go version from 1.13.5 to 1.13.7.

**FIXES:**

- ([Commercial feature][115]) [Label selectors][116] and [field selectors][117] now accept single and double quotes to identify strings.
- Fixed a bug that prevented wrapped resources from having their namespaces set by the default sensuctl configuration.
- Fixed a bug that prevented [API response filtering][119] from working properly for core/v2/silenced API endpoints.
- Improved event payload validation for the [core/v2/events API][118] so that events that do not match the URL parameters on the `/events/:entity/:check` endpoint are rejected.
- Sensuctl now supports the `http_proxy`, `https_proxy`, and `no_proxy` environment variables.
- The [`auth/test` endpoint][120] now returns the correct error messages.

## 5.17.2 release notes

**February 19, 2020** &mdash; The latest release of Sensu Go, version 5.17.2, is now available for download.
This release fixes a bug that could prevent commercial features from working after internal restart.

Read the [upgrade guide][1] to upgrade Sensu to version 5.17.2.

**FIXES:**

- Fixed a bug that could cause commercial HTTP routes to fail to initialize after an internal restart, preventing commercial features from working.

## 5.17.1 release notes

**January 31, 2020** &mdash; The latest release of Sensu Go, version 5.17.1, is now available for download.
This release fixes a web UI issue that cleared selected filters when sorting an event list and a bug that prevented certain `.tar` assets from extracting.
It also includes sensuctl configuration improvements.

Read the [upgrade guide][1] to upgrade Sensu to version 5.17.1.

**IMPROVEMENTS:**

- Asset names may now include capital letters.
- Running the `sensuctl configure` command now resets the sensuctl cluster configuration.
- When you use `--trusted-ca-file` to configure sensuctl, it now detects and saves the absolute file path in the cluster configuration.

**FIXES:**

- ([Commercial feature][106]) When a silencing entry expires or is removed, it is also removed from the silences view in the [web UI][107].
- Fixed a bug that prevented `.tar` assets from extracting if they contain hardlinked files.
- In the [web UI][107], sorting an event list view no longer clears the selected filters.

## 5.17.0 release notes

**January 28, 2020** &mdash; The latest release of Sensu Go, version 5.17.0, is now available for download.
This is a significant release, with new features, improvements, and fixes!
We’re ecstatic to announce the release of secrets management, which eliminates the need to expose sensitive information in your Sensu configuration.
When a Sensu component such as a check or handler requires a secret (like a username or password), Sensu will be able to fetch that information from one or more external secrets providers (for example, HashiCorp Vault) and provide it to the Sensu component via temporary environment variables.
Secrets management allows you to move secrets out of your Sensu configuration, giving you the ability to safely and confidently share your Sensu configurations with your fellow Sensu users!
This release also includes per-entity keepalive event handler configuration, a sought-after feature for users who have migrated from Sensu 1.x to Sensu Go.

Read the [upgrade guide][1] to upgrade Sensu to version 5.17.0.

**NEW FEATURES:**

- ([Commercial feature][106]) Added [HTTP API for secrets management][108], with Sensu's `Env` secrets provider and support for HashiCorp Vault secrets management. The secrets provider resource is implemented for checks, mutators, and handlers.
- Added the `keepalive-handlers` agent configuration flag to specify the keepalive handlers to use for an entity's events.

**IMPROVEMENTS:**

- ([Commercial feature][106]) Upgraded the size of the events auto-incremented ID in the PostgreSQL store to a 64-bit variant, which allows you to store many more events and avoids exhausting the sequence.
- ([Commercial feature][106]) [Initialization][109] via `sensu-backend init` is now implemented for Docker.
- ([Commercial feature][106]) UPN binding support has been re-introduced via the `default_upn_domain` configuration attribute.
- In the [web UI][107], labels that contain URLs are now clickable links.
- Added `event.entity.name` as a supported field for the [`fieldSelector`][110] query parameter.
- In the [web UI][107], users with implicit permissions to a namespace can now display resources within that namespace.
- Explicit access to namespaces can only be granted via [cluster-wide RBAC resources][111].
- You can now omit the namespace from an event in [`HTTP POST /events`][112] requests.
- Added support for the `--format` flag in the [sensuctl command list][113] subcommand.

**FIXES:**

- ([Commercial feature][106]) Fixed a bug where the event check state was not present when using the PostgreSQL event store.
- ([Commercial feature][106]) Agent TLS authentication does not require a license.
- Fixed a memory leak in the entity cache.
- Fixed a bug that prevented `sensuctl entity delete` from returning an error when attempting to delete a non-existent entity.
- In the [web UI][107], fixed a bug that duplicated event history in the event timeline chart.
- `sensuctl command` assets installed via Bonsai now use the `sensuctl` namespace.
- Fixed a bug where failing check TTL events could occur if keepalive failures had already occurred.

## 5.16.1 release notes

**December 18, 2019** &mdash; The latest release of Sensu Go, version 5.16.1, is now available for download.
This release fixes a performance regression that caused API latency to scale linearly as the number of connected agents increased and includes a change to display the `sensu_go_events_processed` Prometheus counter by default.

Read the [upgrade guide][1] to upgrade Sensu to version 5.16.1.

**IMPROVEMENTS**

- The `sensu_go_events_processed` Prometheus counter now initializes with the `success` label so the count is always displayed.

**FIXES:**

- The performance regression introduced in 5.15.0 that caused API latency to scale linearly as the number of connected agents increased is fixed.

## 5.16.0 release notes

**December 16, 2019** &mdash; The latest release of Sensu Go, version 5.16.0, is now available for download.
This is another important release, with many new features, improvements, and fixes.
We introduced an initialization subcommand for **new** installations that allows you to specify an admin username and password instead of using a pre-defined default.
We also added new backend flags to help you take advantage of etcd auto-discovery features and agent flags you can use to define a timeout period for critical and warning keepalive events.

New web UI features include a switcher that makes it easier to switch between namespaces in the dashboard, breadcrumbs on every page, OIDC authentication in the dashboard, a drawer that replaces the app bar to make more room for content, and more.

We also fixed issues with `sensuctl dump` and `sensuctl cluster health`, installing sensuctl commands via Bonsai, and missing namespaces in keepalive events and events created through the agent socket interface.

Read the [upgrade guide][1] to upgrade Sensu to version 5.16.0.

**IMPORTANT:**

- For Ubuntu/Debian and RHEL/CentOS installations, the backend is no longer seeded with a default admin username and password.
Users will need to [run 'sensu-backend init'][102] on every new installation and specify an admin username and password.

**NEW FEATURES:**

- ([Commercial feature][105]) Users can now authenticate with OIDC in the dashboard.
- ([Commercial feature][105]) Label selectors now match the event's check and entity labels.
- Added a new flag,`--etcd-client-urls`, which should be used with sensu-backend when it is not operating as an etcd member.
The flag is also used by the new `sensu-backend init` subcommand.
- Added the ['sensu-backend init' subcommand][102].
- Added the [`--etcd-discovery`][100] and [`--etcd-discovery-srv`][100] flags to sensu-backend, which allow users to take advantage of the embedded etcd's auto-discovery features.
- Added [`--keepalive-critical-timeout`][101] to define the time after which a critical keepalive event should be created for an agent and [`--keepalive-warning-timeout`][101], which is an alias of `--keepalive-timeout` for backward compatibility.

**IMPROVEMENTS:**

- ([Commercial feature][105]) The entity limit warning message is now displayed less aggressively and the warning threshold is proportional to the entity limit.
- A new switcher in the [web UI][103] makes it easier to switch namespaces in the dashboard.
Access the new component from the drawer or with the shortcut ctrl+k.
For users who have many namespaces, the switcher now includes fuzzy search and improved keyboard navigation.
- In the [web UI][103], replaced the app bar with an omnipresent drawer to increase the available space for content. Each page also now includes breadcrumbs.
- In the [Sensu documentation][104], links now point to the version of the product being run instead of the latest, which may be helpful when running an older version of Sensu.

**FIXES:**

- `sensuctl dump` help now shows the correct default value for the format flag.
- Installing sensuctl commands via Bonsai will now check for correct labels before checking if the asset has 1 or more builds.
- Listing assets with no results now returns an empty array.
- Fixed a panic that could occur when creating resources in a namespace that does not exist.
- Fixed an issue where keepalive events and events created through the agent's socket interface could be missing a namespace.
- Fixed an issue that could cause 'sensuctl cluster health' to hang indefinitely.
- ([Commercial feature][105]) The `agent.yml.example` file shipped with Sensu Agent for Windows packages now uses DOS-style line endings.

## 5.15.0 release notes

**November 19, 2019** &mdash; The latest release of Sensu Go, version 5.15.0, is now available for download.
This is a significant release for a number of reasons.
The changes to licensing make 100% of Sensu Go's commercial features available for free to all users, up to your first 100 entities!
This release also includes the long-awaited cluster federation features, supporting multi-cluster authentication, RBAC policy replication, and a single pane of glass for your Sensu monitoring data!
We added support for API keys, making it easy to integrate with the Sensu API (you no longer need to manage JWTs).
In addition, the 5.15.0 release includes support for sensu-backend environment variables and bug fixes that improve error logging for mutator execution and flap detection weighting for checks.

Read the [upgrade guide][1] to upgrade Sensu to version 5.15.0.

**IMPORTANT:**
Sensu's free entity limit is now 100 entities.
All [commercial features][95] are available for free in the packaged Sensu Go distribution for up to 100 entities.
You will receive a warning when you approach the 100-entity limit (at 75%).

If your Sensu instance includes more than 100 entities, [contact us][90] to learn how to upgrade your installation and increase your limit.
Read the [blog announcement][91] for more information about our usage policy.

**NEW FEATURES:**

- ([Commercial feature][95]) Added support for [federation replicators and the federation cluster registration API][85] and the ability to view resources across clusters in the federation in the [web UI][80].
- ([Commercial feature][95]) Added MSI and NuGet builds for [sensuctl][89]. Also, MSI and NuGet installations now add the bin directory to the system PATH on Windows.
- ([Commercial feature][95]) Added HTTP DELETE access for the [license management API][92].
- Added the [APIKey resource][86], with HTTP API support for POST, GET, and DELETE and [sensuctl commands][87] to manage the APIKey resource.
- Added support for using [API keys for API authentication][88].
- Added support for [sensuctl commands][93] to install, execute, list, and delete commands from Bonsai or a URL.
- Added support for sensu-backend service environment variables.
- Added support for [timezones in check `cron` strings][94].

**SECURITY:**

- ([Commercial feature][95]) Removed support for UPN binding without a binding account or anonymous binding, which allows Sensu to effectively refresh claims during access token renewal.

**IMPROVEMENTS:**

- You can now use colons and periods in all resource names (except users).

**FIXES:**

- Added better error logging for mutator execution.
- Fixed the order of flap detection weighting for checks.
- Fixed the pprof server so it only binds to localhost.
- Moved `corev2.BonsaiAsset` to `bonsai.Asset` and moved `corev2.OutdatedBonsaiAsset` to `bonsai.OutdatedAsset`.

## 5.14.2 release notes

**November 4, 2019** &mdash; The latest release of Sensu Go, version 5.14.2, is now available for download.
This release includes an etcd upgrade, fixes that improve stability and performance, and a Sensu Go package for CentOS 8.

Read the [upgrade guide][1] to upgrade Sensu to version 5.14.2.

**IMPROVEMENTS:**

- Upgraded etcd to 3.3.17.
- Added build package for CentOS 8 (`el/8`).
- Sensu Go now uses serializable event reads, which helps improve performance.

**FIXES:**

- As a result of upgrading etcd, TLS etcd clients that lose their connection will successfully reconnect when using `--no-embed-etcd`.
- Check TTL and keepalive switches are now correctly buried when associated events and entities are deleted.
As a result, Sensu now uses far fewer leases for check TTLs and keepalives, which improves stability for most deployments.
- Corrected a minor UX issue in interactive filter commands in sensuctl.

## 5.14.1 release notes

**October 16, 2019** &mdash; The latest release of Sensu Go, version 5.14.1, is now available for download.
This release adds Prometheus gauges for check schedulers and fixes several bugs, including a bug discovered in 5.14.0 that prevented OIDC authentication providers from properly loading on start-up.

Read the [upgrade guide][1] to upgrade Sensu to version 5.14.1.

**NEW FEATURES:**

- Added Prometheus gauges for check schedulers.

**FIXES:**

- ([Commercial feature][79]) Sensuctl will not incorrectly warn of entity limits for unlimited licenses.
- ([Commercial feature][79]) `oidc` authentication providers will now properly load on start-up.
- When opening a Bolt database that is already open, `sensu-agent` will not hang indefinitely.
- Running [`sensuctl dump`][84] for multiple resource types with the output format as YAML will not result in separators being printed to `STDOUT` instead of the specified file.
- Fixed a crash in sensu-backend (panic: send on closed channel).

## 5.14.0 release notes

**October 8, 2019** &mdash; The latest release of Sensu Go, version 5.14.0, is now available for download.
This release includes feature additions like two new configuration options for backends using embedded etcd and a new SemVer field in entity resources.
In addition, this release includes enhanced TLS authentication support and bug fixes that restore check execution after a network error and enable round robin schedule recovery after quorum loss.

Read the [upgrade guide][1] to upgrade Sensu to version 5.14.0.

**NEW FEATURES:**

- The [web UI][80] now includes an error dialog option that allows users to wipe the application's persisted state (rather than having to manually wipe their local/session storage).
This can help in the rare case that something in the persisted state is leading to an uncaught exception.
- The [web UI][80] now respects the system preference for operating systems with support for selecting a preferred light or dark theme.
- `sensuctl dump` can now list the types of supported resources with `sensuctl dump --types`.
- The [entity resource][82] now includes the `sensu_agent_version` field, which reflects the Sensu Semantic Versioning (SemVer) version of the agent entity.
- There are two new [advanced configuration options][83] for `sensu-backend` using embedded etcd: `etcd-heartbeat-interval` and `etcd-election-timeout`.

**IMPROVEMENTS:**

- ([Commercial feature][79]) Added support for mutual TLS authentication between agents and backends.
- ([Commercial feature][79]) Added support for CRL URLs for mTLS authentication.
- ([Commercial feature][79]) Support agent [TLS authentication][81] is usable with the sensu-backend.
- In the web UI, feedback is directed to Discourse rather than the GitHub repository's Issues page to facilitate discussion about feature requests.
- In the [web UI][80], when a user lands on a page inside a namespace that no longer exists or they do not have access to, the drawer opens to that namespace switcher to help clarify next steps.
- Updated Go version from 1.12.3 to 1.13.1.

**FIXES:**

- ([Commercial feature][79]) `sensuctl` on Windows can now create Postgres resources.
- ([Commercial feature][79]) Fixed a bug that resulted in event metrics being ignored when using the Postgres store.
- Fixed a bug that caused checks to stop executing after a network error.
- Fixed a bug that prevented `sensuctl create` with `stdin` from working.
- Splayed proxy checks are executed every interval (instead of every interval + interval * splay_coverage).
- Proxy entity labels and annotations are now redacted in the web UI as expected.
- Fixed a bug in the ring that prevented round robin schedules from recovering after quorum loss.
- Updated [web UI][80] so that unauthorized errors emitted while creating silences or resolving events are caught and a notification is presented to communicate what occurred.
- [Web UI][80] does not report internal errors when a user attempts to queue an ad hoc check for a keepalive.
- Fixed a bug in the [web UI][80] that may have prevented users with appropriate roles from resolving events, queuing checks, and creating silenced entries.
- Asset builds are not separated into several assets unless the the tabular format is used in `sensuctl asset list`.
- The 'flag accessed but not defined' error is corrected in `sensuctl asset outdated`.

## 5.13.2 release notes

**September 19, 2019** &mdash; The latest release of Sensu Go, version 5.13.2, is now available for download.
This is a stability release that fixes a bug for users who have the PostgreSQL event store enabled.

Read the [upgrade guide][1] to upgrade Sensu to version 5.13.2.

**FIXES:**

- Metrics handlers now correctly receive metric points when the postgresql event store is enabled.

## 5.13.1 release notes

**September 10, 2019** &mdash; The latest release of Sensu Go, version 5.13.1, is now available for download.
This is a stability release with bug fixes for multi-build asset definitions causing a panic when no matching filters are found.

Read the [upgrade guide][1] to upgrade Sensu to version 5.13.1.

**FIXES:**

- Multi-build asset definitions with no matching filters will no longer cause a panic.
- Fixed the `oidc` authentication provider resource.

## 5.13.0 release notes

**September 9, 2019** &mdash; The latest release of Sensu Go, version 5.13.0, is now available for download.
This is one of the most user-friendly releases yet!
Sensuctl now integrates with Bonsai, the Sensu asset hub, making it easier than ever to fetch and use countless Sensu monitoring plugins and integrations.
Additionally, sensuctl now supports loading resource configuration files (for example, checks) from directories and URLs.
But that's not all!
Sensuctl now provides a subcommand for exporting its configuration and API tokens to your shell environment.
Use sensuctl to provide cURL and custom scripts with fresh API access information!

Read the [upgrade guide][1] to upgrade Sensu to version 5.13.0.

**NEW FEATURES:**

- Sensuctl now integrates with Bonsai, the Sensu asset hub.
Run a single sensuctl command to add an asset to your Sensu cluster (for example, `sensuctl asset add sensu/sensu-pagerduty-handler:1.1.0`).
Check for outdated assets (new releases available) with the `outdated` subcommand (for example, `sensuctl asset outdated`).
- Sensuctl now supports the `env` subcommand for exporting sensuctl configuration and API tokens to your shell environment (for example, `eval $(sensuctl env)`).
- Sensuctl now supports loading multiple resource configuration files (for example, checks and handlers) from directories!
Sensuctl can also load a file using a URL (for example, `sensuctl create -r -f ./checks` and `sensuctl create -f https://my.blog.ca/sensu-go/check.yaml`).

**FIXES:**

- Sensuctl interactive check create and update modes now have `none` for the metric output format as the first highlighted option instead of `nagios-perfdata`.
- Fixed a bug where silences would not expire on event resolution.

## 5.12.0 release notes

**August 26, 2019** &mdash; The latest release of Sensu Go, version 5.12.0, is now available for download.
There are some exciting feature additions in this release, including the ability to output resources to a file from sensuctl and more granular control of check and check hook execution with an agent allow list.
Additionally, this release includes the ability to delete assets and more stability fixes around watcher functionality.

Read the [upgrade guide][1] to upgrade Sensu to version 5.12.0.

**IMPORTANT:**

Due to changes in the release process, Sensu binary-only archives are now named following the pattern `sensu-go_5.12.0_$OS_$ARCH.tar.gz`, where `$OS` is the operating system name and `$ARCH` is the CPU architecture.
These archives include all files in the top level directory.
Read the [installation guide][16] for the latest download links.

**NEW FEATURES:**

- Operators can now authenticate to Sensu via OpenID Direct Connect (OIDC) using sensuctl.
Read the [authentication documentation][17] for details.
- Added sensu-agent and sensuctl binary builds for FreeBSD.
- Added sensuctl dump command to output resources to a file or STDOUT, making it easier to back up your Sensu backends.
- Agents can now be configured with a list of executables that are allowed to run as check and hook commands.
Read the [agent reference][78] for more information.

**IMPROVEMENTS:**

- Assets now support defining multiple builds, reducing the number of individual assets needed to cover disparate platforms in your infrastructure.
- ([Commercial feature][53]) Namespaces listed in both the web UI and sensuctl are now limited to the namespace to which the user has access.
- Hooks now support the use of assets.
- The event.check.name field has been added as a supported field selector.
- Both the API and sensuctl can now be used to delete assets.
- The use of ProtoBuf serialization/deserialization over WebSocket can now be negotiated between agent and backend.
- Web UI performance has been improved for deployments with many events and entities.
- The resource caches can now rebuild themselves in case of failures.
- Event and entity resources can now be created via the API without an explicit namespace.
The system will refer to the namespace in the request URL.
- Event and entity resources can now be created via the API using the POST verb.

**SECURITY:**

- To prevent writing sensitive data to logs, the backend no longer logs decoded check result and keepalive payloads.

**FIXES:**

- Tabular display of filters via sensuctl now displays `&&` or `||` as appropriate for inclusive and exclusive filters, respectively.
- Requesting events from the `GET /events/:entity` API endpoint now returns events only for the specified entity.
- Running sensuctl config view without configuration no longer causes a crash.
- Creating an entity via sensuctl with the `--interactive` flag now prompts for the entity name when it is not provided on the command line.
- Check hooks with `stdin: true` now receive actual event data on STDIN instead of an empty event.
- Some issues with check scheduling and updating have been fixed by refactoring the backend's watcher implementation.

**KNOWN ISSUES:**

- Authentication via OIDC is not yet supported in the web UI.
- Deleting an asset will not remove references to said asset.
It is the operator's responsibility to remove the asset from the runtime_assets field of the check, hook, filter, mutator, or handler.
- Deleting an asset will not remove the tarball or downloaded files from disk.
It is the operator's responsibility to clear the asset cache if necessary.

## 5.11.1 release notes

**July 18, 2019** &mdash; The latest release of Sensu Go, version 5.11.1, is now available for download.
This is a stability release with bug fixes for UPN format binding token renewal and addition of agent heartbeats and configurable WebSocket connection negotiation.

Read the [upgrade guide][1] to upgrade Sensu to version 5.11.1.

**FIXES:**

- Fixed access token renewal when UPN format binding was enabled.
- The agent now sends heartbeats to the backend to detect network failures and reconnect more quickly.
- The default handshake timeout for the WebSocket connection negotiation was lowered from 45 to 15 seconds and is now configurable.

## 5.11.0 release notes

**July 10, 2019** &mdash; The latest release of Sensu Go, version 5.11.0, is now available for download.
There are some exciting feature additions in this release, including the ability to delete resources from sensuctl and manage filter and mutator resources in the web UI.
Additionally, this release includes bug fixes for proxy checks and enhanced performance tuning for the PostgreSQL event store.

Read the [upgrade guide][1] to upgrade Sensu to version 5.11.0.

**NEW FEATURES:**

- The Sensu [web UI][67] now includes a filters page that displays available event filters and filter configuration.
- ([Commercial feature][68]) Manage your Sensu event filters from your browser: Sensu's [web UI][67] now supports creating, editing, and deleting filters.
- The Sensu [web UI][67] now includes a mutators page that displays available mutators and mutator configuration.
- ([Commercial feature][68]) Manage your Sensu mutators from your browser: Sensu's [web UI][67] now supports creating, editing, and deleting mutators.
- Sensuctl now includes the `sensuctl delete` command, letting you use resource definitions to delete resources from Sensu in the same way as `sensuctl create`.
Read the [sensuctl reference][72] for more information.
- Assets now include a `headers` attribute to include HTTP headers in requests to retrieve assets, allowing you to access secured assets.
Read the [asset reference][70] for examples.
- Sensu agents now support the `disable-assets` configuration flag, allowing you to disable asset retrieval for individual agents.
Read the [agent reference][71] for examples.
- Sensu [binary-only distributions][69] are now available as zip files.

**IMPROVEMENTS:**

- ([Commercial feature][68]) The [Active Directory authentication provider][74] now supports the `default_upn_domain` attribute, letting you appended a domain to a username when a domain is not specified during login.
- ([Commercial feature][68]) The [Active Directory authentication provider][74] now supports the `include_nested_groups` attribute, letting you search nested groups instead of just the top-level groups of which a user is a member.
- The `sensuctl config view` command now returns the currently configured username.
Read the [sensuctl reference][76] for examples.
- The [Sensu API][75] now returns the `201 Created` response code for POST and PUT requests instead of `204 No Content`.
- The Sensu backend now provides [advanced configuration options][77] for buffer size and worker count of keepalives, events, and pipelines.
- Sensu Go now supports Debian 10.
For a complete list of supported platforms, visit the [platforms page][73].

**FIXES:**

- The web UI now returns an error when attempting to create a duplicate check or handler.
- Silenced entries are now retrieved from the cache when determining whether an event is silenced.
- The Sensu API now returns an error when trying to delete an entity that does not exist.
- The agent WebSocket connection now performs basic authorization.
- The core/v2/events API now correctly applies the current timestamp by default, fixing a regression in 5.10.0.
- Multiple nested set handlers are now flagged correctly, fixing an issue in which they were flagged as deeply nested.
- Round robin proxy checks now execute as expected in the event of updated entities.
- The Sensu backend now avoids situations of high CPU usage in the event that watchers enter a tight loop.
- Due to incompatibility with the Go programming language, Sensu is incompatible with CentOS/RHEL 5.
As a result, CentOS/RHEL 5 has been removed as a [supported platform][73] for all versions of Sensu Go.

## 5.10.2 release notes

**June 27, 2019** &mdash; The latest release of Sensu Go, version 5.10.2, is now available for download.
This is a stability release with a bug fix for expired licenses.

Read the [upgrade guide][1] to upgrade Sensu to version 5.10.2.

**FIXES:**

- Sensu now handles expired licenses as expected.

## 5.10.1 release notes

**June 25, 2019** &mdash; The latest release of Sensu Go, version 5.10.1, is now available for download.
This is a stability release with key bug fixes for proxy checks and entity deletion.

Read the [upgrade guide][1] to upgrade Sensu to version 5.10.1.

**FIXES:**

- The proxy_requests entity_attributes are now all considered when matching entities.
- Events are now removed when their corresponding entity is deleted.

## 5.10.0 release notes

**June 19, 2019** &mdash; The latest release of Sensu Go, version 5.10.0, is now available for download.
There are some exciting feature additions in this release, including the ability to perform advanced filtering in the web UI and use PostgreSQL as a scalable event store.
This release also includes key bug fixes, most notably for high CPU usage.

Read the [upgrade guide][1] to upgrade Sensu to version 5.10.0.

**NEW FEATURES:**

- ([Commercial feature][60]) The Sensu web UI now includes fast, predictive filtering for viewing checks, entities, events, handlers, and silences, including the ability to filter based on custom labels.
Select the filter bar and start building custom views using suggested attributes and values.
For more information, read the [web UI docs][66].
- Free Sensu instances can now delete entities in the web UI entities page.
Read the [web UI docs][65] to get started using the Sensu web UI.
- ([Commercial feature][60]) Sensu now supports using an external PostgreSQL instance for event storage in place of etcd.
PostgreSQL can handle significantly higher volumes of Sensu events, letting you scale Sensu beyond etcd's storage limits.
Read the [datastore reference][61] for more information.
- Sensu now includes a cluster ID API endpoint and `sensuctl cluster id` command to return the unique Sensu cluster ID.
Read the [core/v2/cluster API endpoint docs][62] for more information.

**IMPROVEMENTS:**

- The `sensuctl create` command now supports specifying the namespace for a group of resources at the time of creation, allowing you to replicate resources across namespaces without manual editing.
Read the [sensuctl reference][63] for more information and usage examples.
- Sensu cluster roles can now include permissions to manage your Sensu license using the `license` resource type.
Read the [RBAC reference][64] to create a cluster role.
- The web UI now displays up to 100,000 events and entities on the homepage.

**FIXES:**

- Sensu now optimizes scheduling for proxy checks, solving an issue with high CPU usage when evaluating proxy entity attributes.
- The Sensu API now validates resource namespaces and types in request bodies to ensure RBAC permissions are enforced.
- Check `state` and `total_state_change` attributes now update as expected based on check history.
- Incident and entity links in the web UI homepage now navigate to the correct views.
- The web UI now displays non-standard cron statements correctly (for example, `@weekly`).
- On sign-in, the web UI now ensures that users are directed to a valid namespace.
- In the web UI, code block scrollbars now display only when necessary.
- The web UI now displays the handler `timeout` attribute correctly.
- When editing resources, the web UI now fetches the latest resource prior to editing.
- The web UI now handles array values correctly when creating and editing resources.

## 5.9.0 release notes

**May 28, 2019** &mdash; The latest release of Sensu Go, version 5.9.0, is now available for download.
There are some exciting feature additions in this release, including the ability to log raw events to a file (commercial feature) and view event handlers in the web UI.

Read the [upgrade guide][52] to upgrade Sensu to version 5.9.0.
If you're upgrading a Sensu cluster from 5.7.0 or earlier, read the [instructions for upgrading a Sensu cluster from 5.7.0 or earlier to 5.8.0 or later][59].

**NEW FEATURES:**

- The Sensu web UI now includes a handlers page that displays available event handlers and handler configuration.
Read the [web UI docs][54] to get started using the Sensu web UI.
- ([Commercial feature][53]) Manage your Sensu event handlers from your browser: Sensu's web UI now supports creating, editing, and deleting handlers.
Read the [web UI docs][54] to get started using the Sensu web UI.
- ([Commercial feature][53]) Sensu now supports event logging to a file using the `event-log-file` and `event-log-buffer-size` configuration flags.
You can use this event log file as an input source for your favorite data lake solution.
Read the [backend reference][55] for more information.

**IMPROVEMENTS:**

- The Sensu web UI now includes simpler, more efficient filtering in place of filtering using Sensu query expressions.
- Sensu packages are now available for Ubuntu 19.04 (Disco Dingo). Review the [supported platforms page][56] for a complete list of Sensu's supported platforms and the [installation guide][57] to install Sensu packages for Ubuntu.

**FIXES:**

- The `occurrences` and `occurrences_watermark` event attributes now increment as expected, giving you useful information about recent events.
Read the [events reference][58] for an in-depth discussion of these attributes.
- The `/silenced/subscriptions/:subscription` and `/silenced/checks/:check` API endpoints now return silences by check or subscription.
- Sensu now handles errors when seeding initial data, avoiding a panic state.

## 5.8.0 release notes

**May 22, 2019** &mdash; The latest release of Sensu Go, version 5.8.0, is now available for download.
This is mainly a stability release with bug fixes and performance improvements.
Additionally, we have added support for configurable etcd cipher suites.

Read the [upgrade guide][51] to upgrade Sensu to version 5.8.0.

**IMPORTANT:**

- To upgrade to Sensu Go 5.8.0, Sensu clusters with multiple backend nodes must be shut down during the upgrade process.
Read the [upgrade guide][51] for more information.

**IMPROVEMENTS:**

- The sensuctl command line tool now supports the `--chunk-size` flag to help you handle large datasets.
Read the [sensuctl reference][45] for more information.
- Sensu backends now support the `etcd-cipher-suites` configuration option, letting you specify the cipher suites that can be used with etcd TLS configuration.
Read the [backend reference][47] for more information.
- The Sensu API now includes the /version API, returning version information for your Sensu instance.
Review the [API docs][46] for more information.
- Tessen now collects the numbers of events processed and resources created, giving us better insight into how we can improve Sensu.
As always, all Tessen transmissions are logged for complete transparency.
Read the [Tessen reference][48] for more information.
- Sensu licenses now include the entity limit attached to your Sensu licensing package.
Read the [license management docs][49] to learn more about entity limits.
- Sensu backends now perform better at scale using increased worker pool sizes for events and keepalives.
- The maximum size of the etcd database and etcd requests is now configurable using the `etcd-quota-backend-bytes` and `etcd-max-request-bytes` backend configuration options.
These are advanced configuration options requiring familiarly with etcd. 
Use with caution.
Read the [backend reference][50] for more information.
- Most Sensu resources now use ProtoBuf serialization in etcd.

**FIXES:**

- Events produced by checks now execute the correct number of write operations to etcd.
- API pagination tokens for the core/v2/users and core/v2/namespaces API endpoints now work as expected.
- Keepalive events for deleted and deregistered entities are now cleaned up as expected.

**KNOWN ISSUES:**

- Auth tokens may not be purged from etcd, resulting in a possible impact to performance.

## 5.7.0 release notes

**May 9, 2019** &mdash; The latest release of Sensu Go, version 5.7.0, is now available for download.
This is mainly a stability release with bug fixes.
Additionally, we have added support for Windows packages and [updated our usage policy][44].

Read the [upgrade guide][1] to upgrade Sensu to version 5.7.0.

**IMPROVEMENTS:**

- The Sensu agent for Windows is now available as an MSI package, making it easier to install and operate.
Read the [installation guide][41] and the [agent reference][42] to get started.

**FIXES:**

- Sensu now enforces resource separation between namespaces sharing a similar prefix.
- The `sensuctl cluster` commands now output correctly in JSON and wrapped JSON formats.
- The API now returns an error message if [label and field selectors][43] are used without a license.

## 5.6.0 release notes

**April 30, 2019** &mdash; The latest release of Sensu Go, version 5.6.0, is now available for download.
We have added some exciting new features in this release, including API filtering and the ability to create and manage checks through the web UI with the presence of a valid license key.

Read the [upgrade guide][1] to upgrade Sensu to version 5.6.0.

**NEW FEATURES:**

- ([Commercial feature][33]) Manage your Sensu checks from your browser: Sensu's web user interface now supports creating, editing, and deleting checks.
Read the [web UI docs][32] to get started using the Sensu web UI.
- ([Commercial feature][33]) The Sensu web UI now includes an option to delete entities.
- ([Commercial feature][33]) Sensu now supports resource filtering in the Sensu API and sensuctl command line tool.
Filter events using custom labels and resource attributes, such as event status and check subscriptions.
Review the [API docs][34] and [sensuctl reference][35] for usage examples.

**IMPROVEMENTS:**

- ([Commercial feature][33]) Sensu's LDAP and Active Directory integrations now support mutual authentication using the `trusted_ca_file`, `client_cert_file`, and `client_key_file` attributes.
Read the [guide to configuring an authentication provider][37] for more information.
- ([Commercial feature][33]) Sensu's LDAP and Active Directory integrations now support connecting to an authentication provider using anonymous binding.
Read the [LDAP][38] and [Active Directory][39] binding configuration docs to learn more.
- the [/health API][36] response now includes the cluster ID.
- The `sensuctl cluster health` and `sensuctl cluster member-list` commands now include the cluster ID in tabular format.

**FIXES:**

- You can now configure labels and annotations for Sensu agents using command line flags.
For example: `sensu-agent start --label example_key="example value"`.
Read the [agent reference][40] for more examples.
- The Sensu web UI now displays the correct checkbox state when no resources are present.

## 5.5.1 release notes

**April 17, 2019** &mdash; The latest release of Sensu Go, version 5.5.1, is now available for download.
This is a stability release with key bug fixes, including addressing an issue with backend CPU utilization.
Additionally, we have added support for honoring the source attribute for events received via agent socket.

Read the [upgrade guide][1] to upgrade Sensu to version 5.5.1.

**IMPROVEMENTS:**

- Sensu agents now support annotations (non-identifying metadata) that help people or external tools interacting with Sensu.
Read the [agent reference][29] to add annotations in the agent configuration file.
- The [agent socket event format][30] now supports the `source` attribute to create a proxy entity.
- Sensu 5.5.1 is built with Go version 1.12.3.

**FIXES:**

- Backends now reinstate etcd watchers in the event of a watcher failure, fixing an issue causing high CPU usage in some components.

## 5.5.0 release notes

**April 4, 2019** &mdash; The latest release of Sensu Go, version 5.5.0, is now available for download.
This release has some key bug fixes and additions, including the introduction of Tessen into Sensu Go.
For more information, read Sean Porter’s [blog post][28] on Tessen.

Read the [upgrade guide][1] to upgrade Sensu to version 5.5.0.

**NEW FEATURES:**

- Tessen, the Sensu call-home service, is now enabled by default in Sensu backends.
Read the [Tessen docs][27] to learn about the data that Tessen collects.

**IMPROVEMENTS:**

- Sensu now includes more verbose check logging to indicate when a proxy request matches an entity according to its entity attributes.

**FIXES:**

- The Sensu web UI now displays silences created by LDAP users.
- The web UI now uses a secondary text color for quick-navigation buttons.

## 5.4.0 release notes

**March 27, 2019** &mdash; The latest release of Sensu Go, version 5.4.0, is now available for download.
This release has some very exciting feature additions, including the introduction of our new homepage.
It also includes support for API pagination to handle large datasets more efficiently and agent buffering for robustness in lower-connectivity situations, along with key bug fixes.

Read the [upgrade guide][1] to upgrade Sensu to version 5.4.0.

**NEW FEATURES:**

- The Sensu dashboard now includes a homepage designed to highlight the most important monitoring data, giving you instant insight into the state of your infrastructure.
read the [web UI docs][23] for a preview.
- The Sensu API now supports pagination using the `limit` and `continue` query parameters, letting you limit your API responses to a maximum number of objects and making it easier to handle large datasets.
Read the [API overview][22] for more information.
- Sensu now surfaces internal metrics using the /metrics API.
Read the [/metrics API documentation][31] for more information.

**IMPROVEMENTS:**

- Sensu now lets you specify a separate TLS certificate and key to secure the dashboard.
Read the [backend reference][24] to configure the `dashboard-cert-file` and `dashboard-key-file` flags, and check out the [guide to securing Sensu][25] for the complete guide to making your Sensu instance production-ready.
- The Sensu agent events API now queues events before sending them to the backend, making the agent events API more robust and preventing data loss in the event of a loss of connection with the backend or agent shutdown.
Read the [agent reference][26] for more information.

**FIXES:**

- The backend now processes events without persisting metrics to etcd.
- The core/v2/events API POST and PUT endpoints now add the current timestamp to new events by default.
- The core/v2/users API endpoints now return a 404 response code if a username cannot be found.
- The sensuctl command line tool now correctly accepts global flags when passed after a subcommand flag (for example, `--format yaml --namespace development`).
- The `sensuctl handler delete` and `sensuctl filter delete` commands now correctly delete resources from the currently configured namespace.
- The agent now terminates consistently on SIGTERM and SIGINT.
- In the event of a loss of connection with the backend, the agent now attempts to reconnect to any backends specified in its configuration.
- The dashboard now handles cases in which the creator of a silence is inaccessible.
- The dashboard event details page now displays "-" in the command field if no command is associated with the event.

## 5.3.0 release notes

**March 11, 2019** &mdash; The latest release of Sensu Go, version 5.3.0, is now available for download.
This release has some very exciting feature additions and key bug fixes.
Active Directory can be configured as an authentication provider (commercial feature).
Additionally, round robin scheduling has been fully re-implemented and is available for use.

Read the [upgrade guide][1] to upgrade Sensu to version 5.3.0.

**NEW FEATURES:**

- Round robin check scheduling lets you distribute check executions evenly over a group of Sensu agents.
To enable round robin scheduling, set the `round_robin` check attribute to `true`.
Read the [checks reference][18] for more information.
- Sensu now provides [commercial][19] support for using Microsoft Active Directory as an external authentication provider.
Read the [authentication guide][20] to configure Active Directory, and check out the [getting started guide][19] for more information about commercial features.
- The dashboard now features offline state detection and displays an alert banner if the dashboard loses connection to the backend.

**IMPROVEMENTS:**

- The agent socket event format now supports the `handlers` attribute, giving you the ability to send socket events to a Sensu pipeline.
Read the [agent reference][21] to learn more about creating and handling monitoring events using the agent socket.
- Assets now feature improved download performance using buffered I/O.
- The sensuctl CLI now uses a 15-second timeout period when connecting to the Sensu backend.
- The dashboard now includes expandable configuration details sections on the check and entity pages.
You can now use the dashboard to review check details like command, subscriptions, and scheduling as well as entity details like platform, IP address, and hostname.

**SECURITY:**

- Sensu Go 5.3.0 fixes all known TLS vulnerabilities affecting the backend, including increasing the minimum supported TLS version to 1.2 and removing all ciphers except those with perfect forward secrecy.
- Sensu now enforces uniform TLS configuration for all three backend components: `apid`, `agentd`, and `dashboardd`.
- The backend no longer requires the `trusted-ca-file` flag when using TLS.
- The backend no longer loads server TLS configuration for the HTTP client.

**FIXES:**

- Sensu can now download assets with download times of more than 30 seconds without timing out.
- The agent now communicates entity subscriptions to the backend in the correct format.
- Sensu no longer includes the `edition` configuration attribute or header.
- DNS resolution in Alpine Linux containers now uses the built-in Go resolver instead of the glibc resolver.
- The `sensuctl user list` command can now output `yaml` and `wrapped-json` formats when used with the `--format` flag.
- The dashboard check details page now displays long commands correctly.
- The dashboard check details page now displays the `timeout` attribute correctly.

## 5.2.1 release notes

**February 11, 2019** &mdash; The latest release of Sensu Go, version 5.2.1, is now available for download.
This is a stability release with a key bug fix for proxy check functionality.

Read the [upgrade guide][1] to upgrade Sensu to version 5.2.1.

**FIXES:**

- Sensu agents now execute checks for proxy entities at the expected interval.

## 5.2.0 release notes

**February 7, 2019** &mdash; The latest release of Sensu Go, version 5.2.0, is now available for download.
This release has a ton of exciting content, including the availability of our first enterprise-only features.
For more details on these features, read the [blog post about Sensu Go 5.2.0][14].
Release 5.2.0 also has some key improvements and fixes: we added support for self-signed CA certificates for sensuctl, check output truncation, and the ability to manage silencing from the event details page in our web UI, to name a few.

Read the [upgrade guide][1] to upgrade Sensu to version 5.2.0.

**IMPORTANT:**

- Due to changes in the release process, Sensu binary-only archives are now named following the pattern `sensu-enterprise-go_5.2.0_$OS_$ARCH.tar.gz`, where `$OS` is the operating system name and `$ARCH` is the CPU architecture.
These archives include all files in the top-level directory.
Read the [installation guide][16] for the latest download links.

**NEW FEATURES:**

- Our first enterprise-only features for Sensu Go: [LDAP authentication][96], the [Sensu ServiceNow handler][97], and the [Sensu JIRA handler][98].
Read the [getting started guide][99].
- Sensu now provides the option to limit check output size or to drop check outputs following metric extraction.
Read the [checks reference][15] for more information.

**IMPROVEMENTS:**

- Sensu now includes support for Debian 8 and 9.
Read the [installation guide][16] to install Sensu for Debian.
- Sensu's binary-only distribution for Linux is now available for `arm64`, `armv5`, `armv6`, `armv7`, and `386` in addition to `amd64`.
Read the [installation guide][16] for download links.
- The Sensu dashboard now provides the ability to silence and unsilence events from the Events page.
- The Sensu dashboard Entity page now displays the platform version and deregistration configuration.
- Sensuctl now supports TLS configuration options, allowing you to use a self-signed certificate without adding it to the operating system's CA store, either by explicitly trusting the signer or by disabling TLS hostname verification.
Read the [sensuctl reference][17] for more information.
- sensuctl now provides action-specific confirmation messages, like `Created`, `Deleted`, and `Updated`.

**FIXES:**

- Check TTL failure events now persist through cluster member failures and cluster restarts.
- The Sensu backend now correctly handles errors for missing keepalive events.
- Token-substituted values are now omitted from event data to protect sensitive information.
- Sensu now correctly processes keepalive and check TTL states after entity deletion.
- Sensuctl can now run `sensuctl version` without being configured.
- When disabling users, sensuctl now provides the correct prompt for the action.

## 5.1.1 release notes

**January 24, 2019** &mdash; The latest patch release of Sensu Go, version 5.1.1, is now available for download.
This release includes some key fixes and improvements, including refactored keepalive functionality with increased reliability.
Additionally, based on community feedback, we have added support for the Sensu agent and sensuctl for 32-bit Windows systems.

Read the [upgrade guide][1] to upgrade Sensu to version 5.1.1.

**NEW FEATURES:**

- Sensu now includes a sensuctl command and API endpoint to test user credentials.
Read the [access control reference][10] and [API docs][11] for more information.

**IMPROVEMENTS:**

- The Sensu agent and sensuctl tool are now available for 32-bit Windows.
Read the [installation guide][12] for instructions.
- Keepalive events now include an output attribute specifying the entity name and time last sent.
- The Sensu backend includes refactored authentication and licensing to support future enterprise features.

**SECURITY:**

- Sensu 5.1.1 is built with Go version 1.11.5.
Go 1.11.5 addresses a security vulnerability that affects TLS handshakes and JWT tokens.
Read the [CVE][13] for more information.

**FIXES:**

- Keepalive events now continue to execute after a Sensu cluster restarts.
- When requested, on-demand check executions now correctly retrieve asset dependencies.
- Checks now maintain a consistent execution schedule after updates to the check definition.
- Proxy check request errors now include the check name and namespace.
- When encountering an invalid line during metric extraction, Sensu now logs an error and continues extraction.
- Sensuctl now returns an error when attempting to delete a non-existent entity.
- Sensuctl now removes the temporary file it creates when executing the `sensuctl edit` command.
- The Sensu dashboard now recovers from errors correctly when shutting down.
- The Sensu dashboard includes better visibility for buttons and menus in the dark theme.

## 5.1.0 release notes

**December 19, 2018** &mdash; The latest release of Sensu Go, version 5.1.0, is now available for download.
This release includes an important change to the Sensu backend state directory as well as support for Ubuntu 14.04 and some key bug fixes.

Read the [upgrade guide][1] to upgrade Sensu to version 5.1.0.

**IMPORTANT:**

{{% notice note %}}
**NOTE**: This applies only to Sensu backend binaries downloaded from `s3-us-west-2.amazonaws.com/sensu.io/sensu-go`, not to Sensu RPM or DEB packages.
{{% /notice %}}

- For Sensu backend binaries, the default `state-dir` is now `/var/lib/sensu/sensu-backend` instead of `/var/lib/sensu`.
To upgrade your Sensu backend binary to 5.1.0, make sure your `/etc/sensu/backend.yml` configuration file specifies a `state-dir`.
Read the [upgrade guide][3] for more information.

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

Read the [upgrade guide][1] to upgrade Sensu to version 5.0.1.

**FIXED:**

- The Sensu backend can now successfully connect to an external etcd cluster.
- The Sensu dashboard now sorts silences in ascending order, correctly displays status values, and reduces shuffling in the event list.
- Sensu agents on Windows now execute command arguments correctly.
- Sensu agents now correctly include environment variables when executing checks.
- Command arguments are no longer escaped on Windows.
- Sensu backend environments now include handler and mutator execution requests.

## 5.0.0 release notes

**December 5, 2018** &mdash; We're excited to announce the general availability release of Sensu Go!
Sensu Go is the flexible monitoring event pipeline written in Go and designed for container-based and hybrid-cloud infrastructures.
Check out the [Sensu blog][6] for more information about Sensu Go and version 5.0.

For a complete list of changes from Beta 8-1, review the [Sensu Go changelog][5].
This page will be the official home for the Sensu Go changelog and release notes.

To get started with Sensu Go:

- [Install Sensu Go][8].
- [Get started monitoring server resources][9].

[1]: /sensu-go/latest/operations/maintain-sensu/upgrade/
[2]: https://semver.org/spec/v2.0.0.html
[3]: /sensu-go/5.1/operations/maintain-sensu/upgrade/#upgrade-sensu-backend-binaries-to-510
[4]: /sensu-go/5.1/observability-pipeline/observe-schedule/agent/
[5]: https://www.github.com/sensu/sensu-go/blob/main/CHANGELOG.md#500---2018-11-30
[6]: https://sensu.io/blog/sensu-go-is-here/
[8]: /sensu-go/5.0/operations/deploy-sensu/install-sensu/
[9]: /sensu-go/5.0/observability-pipeline/observe-schedule/monitor-server-resources/
[10]: /sensu-go/5.1/operations/control-access/rbac/#test-and-change-user-passwords
[11]: /sensu-go/5.1/api/other/auth/
[12]: /sensu-go/5.1/operations/deploy-sensu/install-sensu/
[13]: https://nvd.nist.gov/vuln/detail/CVE-2019-6486/
[14]: https://sensu.io/blog/enterprise-features-in-sensu-go/
[15]: https://docs.sensu.io/sensu-go/5.2/observability-pipeline/observe-schedule/checks/#check-output-truncation-attributes
[16]: /sensu-go/5.2/operations/deploy-sensu/install-sensu/
[17]: /sensu-go/5.2/sensuctl/#global-flags
[18]: /sensu-go/5.3/observability-pipeline/observe-schedule/checks#spec-attributes
[19]: /sensu-go/5.3/commercial/
[20]: /sensu-go/5.3/operations/control-access/
[21]: /sensu-go/5.3/observability-pipeline/observe-schedule/agent/#creating-monitoring-events-using-the-agent-tcp-and-udp-sockets
[22]: /sensu-go/5.4/api/#pagination
[23]: /sensu-go/5.4/web-ui/
[24]: /sensu-go/5.4/observability-pipeline/observe-schedule/backend/#dashboard-configuration-flags
[25]: /sensu-go/5.4/operations/deploy-sensu/secure-sensu/
[26]: /sensu-go/5.4/observability-pipeline/observe-schedule/agent/#events-post
[27]: /sensu-go/5.5/operations/monitor-sensu/tessen/
[28]: https://sensu.io/blog/announcing-tessen-the-sensu-call-home-service/
[29]: /sensu-go/5.5/observability-pipeline/observe-schedule/agent/#general-configuration-flags
[30]: /sensu-go/5.5/observability-pipeline/observe-schedule/agent/#creating-monitoring-events-using-the-agent-tcp-and-udp-sockets
[31]: /sensu-go/5.4/api/other/metrics/
[32]: /sensu-go/5.6/web-ui/
[33]: /sensu-go/5.6/commercial/
[34]: /sensu-go/5.6/api/#response-filtering
[35]: /sensu-go/5.6/sensuctl/#filter-responses
[36]: /sensu-go/5.6/api/other/health/
[37]: /sensu-go/5.6/operations/control-access/
[38]: /sensu-go/5.6/operations/control-access/ldap-auth/#ldap-binding-attributes
[39]: /sensu-go/5.6/operations/control-access/ad-auth/#ad-binding-attributes
[40]: /sensu-go/5.6/observability-pipeline/observe-schedule/agent/#general-configuration-flags
[41]: /sensu-go/5.7/operations/deploy-sensu/install-sensu/#install-sensu-agents
[42]: /sensu-go/5.7/observability-pipeline/observe-schedule/agent/#service-management
[43]: /sensu-go/5.7/api/#response-filtering
[44]: https://discourse.sensu.io/t/introducing-usage-limits-in-the-sensu-go-free-tier/1156/
[45]: /sensu-go/5.8/sensuctl/create-manage-resources/#handle-large-datasets
[46]: /sensu-go/5.8/api/other/version/
[47]: /sensu-go/5.8/observability-pipeline/observe-schedule/backend/#etcd-cipher-suites
[48]: /sensu-go/5.8/operations/monitor-sensu/tessen/
[49]: /sensu-go/5.8/operations/maintain-sensu/license/
[50]: /sensu-go/5.8/observability-pipeline/observe-schedule/backend/#advanced-configuration-options
[51]: /sensu-go/5.8/operations/maintain-sensu/upgrade/#upgrade-sensu-clusters-from-570-or-earlier-to-580-or-later
[52]: /sensu-go/5.9/operations/maintain-sensu/upgrade/
[53]: /sensu-go/5.9/commercial/
[54]: /sensu-go/5.9/web-ui/
[55]: /sensu-go/5.9/observability-pipeline/observe-schedule/backend/#event-logging
[56]: /sensu-go/5.9/platforms/
[57]: /sensu-go/5.9/operations/deploy-sensu/install-sensu/
[58]: /sensu-go/5.9/observability-pipeline/observe-events/events/#occurrences-and-occurrences-watermark
[59]: /sensu-go/5.9/operations/maintain-sensu/upgrade/#upgrade-sensu-clusters-from-570-or-earlier-to-580-or-later
[60]: /sensu-go/latest/commercial/
[61]: /sensu-go/5.10/operations/deploy-sensu/datastore/
[62]: /sensu-go/5.10/api/core/cluster/#the-clusterid-API-endpoint
[63]: /sensu-go/5.10/sensuctl/create-manage-resources/#create-resources-across-namespaces
[64]: /sensu-go/5.10/operations/control-access/rbac/#assigning-group-permissions-across-all-namespaces
[65]: /sensu-go/5.10/web-ui/
[66]: /sensu-go/5.10/web-ui/search/
[67]: /sensu-go/5.11/web-ui/
[68]: /sensu-go/5.11/commercial/
[69]: /sensu-go/5.11/versions/
[70]: /sensu-go/5.11/plugins/assets#asset-example-minimum-required-attributes
[71]: /sensu-go/5.11/observability-pipeline/observe-schedule/agent/#disable-assets
[72]: /sensu-go/5.11/sensuctl/create-manage-resources/#delete-resources
[73]: /sensu-go/5.11/platforms/
[74]: /sensu-go/5.11/operations/control-access/ad-auth/
[75]: /sensu-go/5.11/api/
[76]: /sensu-go/5.11/sensuctl/#view-sensuctl-config
[77]: /sensu-go/5.11/observability-pipeline/observe-schedule/backend/#advanced-configuration-options
[78]: /sensu-go/5.12/observability-pipeline/observe-schedule/agent/#allow-list
[79]: /sensu-go/5.14/commercial/
[80]: /sensu-go/5.14/web-ui/
[81]: /sensu-go/5.14/operations/deploy-sensu/secure-sensu/#optional-configure-sensu-agent-mtls-authentication
[82]: /sensu-go/5.13/observability-pipeline/observe-entities/entities/
[83]: /sensu-go/5.14/observability-pipeline/observe-schedule/backend/#advanced-configuration-options
[84]: /sensu-go/5.14/sensuctl/back-up-recover/
[85]: /sensu-go/5.15/api/enterprise/federation/
[86]: /sensu-go/5.15/operations/control-access/apikeys/
[87]: /sensu-go/5.15/operations/control-access/use-apikeys/#sensuctl-management-commands
[88]: /sensu-go/5.15/api/#authenticate-with-an-api-key
[89]: /sensu-go/5.15/sensuctl/
[90]: https://sensu.io/contact/
[91]: https://sensu.io/blog/one-year-of-sensu-go/
[92]: /sensu-go/5.15/api/other/license/
[93]: /sensu-go/5.15/sensuctl/sensuctl-bonsai#extend-sensuctl-with-commands
[94]: /sensu-go/5.15/observability-pipeline/observe-schedule/checks
[95]: /sensu-go/5.15/commercial/
[96]: /sensu-go/5.2/operations/control-access/
[97]: https://bonsai.sensu.io/assets/sensu/sensu-servicenow-handler/
[98]: https://bonsai.sensu.io/assets/sensu/sensu-jira-handler/
[99]: /sensu-go/5.2/commercial/
[100]: /sensu-go/5.16/observability-pipeline/observe-schedule/backend/#datastore-and-cluster-configuration-flags
[101]: /sensu-go/5.16/observability-pipeline/observe-schedule/agent/#keepalive-configuration-flags
[102]: /sensu-go/5.16/observability-pipeline/observe-schedule/backend/#initialization
[103]: /sensu-go/5.16/web-ui/
[104]: /sensu-go/5.16/
[105]: /sensu-go/5.16/commercial/
[106]: /sensu-go/5.17/commercial/
[107]: /sensu-go/5.17/web-ui/#sign-in-to-the-web-ui
[108]: /sensu-go/5.17/api/enterprise/secrets/
[109]: /sensu-go/5.17/observability-pipeline/observe-schedule/backend/#docker-initialization
[110]: /sensu-go/5.17/api/#field-selector
[111]: /sensu-go/5.17/operations/control-access/rbac/#cluster-wide-resource-types
[112]: /sensu-go/5.17/api/core/events/#events-post
[113]: /sensu-go/5.17/sensuctl/sensuctl-bonsai/#list-commands
[114]: /sensu-go/5.18/api/events#create-a-new-event
[115]: /sensu-go/5.18/commercial/
[116]: /sensu-go/5.18/api#label-selector
[117]: /sensu-go/5.18/api#field-selector
[118]: /sensu-go/5.18/api/core/events/
[119]: /sensu-go/5.18/api/#response-filtering
[120]: /sensu-go/5.18/api/other/auth/#authtest-get
[122]: /sensu-go/5.19/commercial/
[123]: /sensu-go/5.19/web-ui/search/#save-a-filtered-search
[124]: /sensu-go/5.19/web-ui/
[125]: /sensu-go/5.19/operations/monitor-sensu/health/
[126]: /sensu-go/5.19/api/#response-filtering
[127]: /sensu-go/5.19/sensuctl/filter-responses
[128]: /sensu-go/5.19/web-ui/search/
[129]: /sensu-go/5.19/sensuctl/create-manage-resources#sensuctl-prune
[130]: /sensu-go/5.19/operations/monitor-sensu/tessen/
[131]: /sensu-go/5.19/observability-pipeline/observe-process/handlers/#pipe-handler-command
[133]: /sensu-go/5.19/platforms/
[134]: /sensu-go/5.19/operations/deploy-sensu/install-sensu/
[135]: /sensu-go/5.19/web-ui/
[136]: /sensu-go/5.19/observability-pipeline/observe-schedule/agent/#configuration-via-flags
[137]: /sensu-go/5.19/observability-pipeline/observe-schedule/backend/#configuration-via-flags
[138]: /sensu-go/5.20/api#field-selector
[139]: /sensu-go/5.20/observability-pipeline/observe-schedule/backend/#log-rotation
[140]: /sensu-go/5.20/operations/maintain-sensu/troubleshoot/#increment-log-level-verbosity
[141]: /sensu-go/5.20/commercial/
[142]: /sensu-go/5.20/observability-pipeline/observe-schedule/agent/#configuration-via-flags
[143]: /sensu-go/5.20/observability-pipeline/observe-entities/entities/#processes-attributes
[144]: /sensu-go/5.20/sensuctl/create-manage-resources/#supported-resource-types
[145]: /sensu-go/5.20/observability-pipeline/observe-schedule/backend/#configuration-summary
[146]: /sensu-go/5.20/observability-pipeline/observe-schedule/tokens/#manage-assets
[147]: /sensu-go/5.20/observability-pipeline/observe-schedule/tokens/#token-substitution-with-quoted-strings
[148]: /sensu-go/5.20/web-ui/webconfig-reference/
[149]: /sensu-go/5.20/api/other/license/#get-the-active-license-configuration
[150]: /sensu-go/5.20/operations/maintain-sensu/license/#view-entity-count-and-entity-limit
[151]: /sensu-go/5.20/operations/maintain-sensu/license/#entity-limit
[153]: /sensu-go/5.20/web-ui/
[154]: /sensu-go/5.20/sensuctl/sensuctl-bonsai/#extend-sensuctl-with-commands
[155]: /sensu-go/5.20/observability-pipeline/observe-schedule/agent/#discover-processes
[156]: /sensu-go/5.21/operations/maintain-sensu/license/#view-entity-count-and-entity-limit
[157]: /sensu-go/5.21/observability-pipeline/observe-schedule/agent/#log-level
[158]: /sensu-go/5.21/commercial/
[160]: /sensu-go/5.21/observability-pipeline/observe-schedule/backend/#fips-openssl
[161]: /sensu-go/5.21/observability-pipeline/observe-schedule/agent/#fips-openssl
[162]: /sensu-go/6.0/commercial/
[163]: https://github.com/sensu/web
[164]: /sensu-go/6.0/platforms/#build-from-source
[165]: /sensu-go/6.0/platforms/
[166]: /sensu-go/6.0/operations/control-access/rbac/#subjects-specification
[167]: /sensu-go/6.0/operations/control-access/rbac/#roleref-specification
[168]: /sensu-go/6.0/observability-pipeline/observe-filter/sensu-query-expressions/#sensucheckdependencies
[169]: /sensu-go/6.0/observability-pipeline/observe-filter/filters/#build-event-filter-expressions-with-javascript-execution-functions
[170]: /sensu-go/6.0/operations/maintain-sensu/upgrade/#upgrade-to-sensu-go-60-from-a-5x-deployment
[171]: /sensu-go/6.0/observability-pipeline/observe-entities/entities/#create-and-manage-agent-entities
[172]: /sensu-go/6.1/commercial/
[173]: /sensu-go/6.1/observability-pipeline/observe-schedule/backend/#api-request-limit
[174]: /sensu-go/6.1/api/
[175]: /sensu-go/6.1/operations/manage-secrets/secrets-management/#use-hashicorp-vault-for-secrets-management
[176]: /sensu-go/6.1/api/enterprise/authproviders/#authproviders-get-specification
[177]: /sensu-go/6.1/api/enterprise/secrets/#providers-get-specification
[178]: /sensu-go/6.1/web-ui/search/
[179]: /sensu-go/6.1/operations/deploy-sensu/datastore/#strict-attribute
[180]: /sensu-go/6.1/operations/control-access/oidc-auth/#oidc-spec-attributes
[181]: /sensu-go/6.1/operations/deploy-sensu/datastore/#spec-attributes
[182]: /sensu-go/6.1/observability-pipeline/observe-schedule/checks#output-metric-tags
[183]: https://bonsai.sensu.io/assets/sensu/sensu-saltstack-handler
[184]: https://bonsai.sensu.io/assets/sensu/sensu-elasticsearch-handler
[185]: https://bonsai.sensu.io/assets/sensu/sensu-rundeck-handler
[186]: https://bonsai.sensu.io/assets/sensu/sensu-kubernetes-events
[187]: https://bonsai.sensu.io/assets/sensu/sensu-timescaledb-handler
[188]: https://github.com/sensu/grafana-sensu-go-datasource
[189]: https://github.com/sensu/grafana-sensu-go-datasource/releases/tag/1.1.0
[190]: /sensu-go/6.1/operations/control-access/rbac/#rule-attributes
[191]: /sensu-go/6.1/sensuctl/back-up-recover/
[192]: /sensu-go/6.1/sensuctl/create-manage-resources/#sensuctl-prune
[193]: /sensu-go/6.2/commercial/
[194]: /sensu-go/6.2/api/enterprise/prune/
[195]: /sensu-go/6.2/sensuctl/create-manage-resources/#sensuctl-prune
[196]: /sensu-go/6.2/api/other/metrics/
[197]: /sensu-go/6.2/observability-pipeline/observe-schedule/checks/#scheduler-attribute
[198]: /sensu-go/6.2/observability-pipeline/observe-events/events/#sequence-attribute
[199]: /sensu-go/6.2/operations/control-access/ldap-auth/
[200]: /sensu-go/6.2/sensuctl/create-manage-resources/#sensuctl-prune-flags
[201]: /sensu-go/6.2/operations/deploy-sensu/datastore/#round-robin-postgresql
[202]: /sensu-go/6.2/sensuctl/#first-time-setup-and-authentication
[203]: /sensu-go/6.2/observability-pipeline/observe-schedule/agent/#agent-managed-entity
[204]: /sensu-go/6.2/observability-pipeline/observe-entities/entities/#manage-agent-entities-via-the-agent
[205]: /sensu-go/6.2/observability-pipeline/observe-schedule/agent/#configuration-via-flags
[206]: /sensu-go/5.21/observability-pipeline/observe-schedule/backend/#log-rotation
[207]: /sensu-go/6.3/commercial/
[208]: /sensu-go/6.3/observability-pipeline/observe-schedule/backend/#agent-burst-limit
[209]: /sensu-go/6.3/observability-pipeline/observe-schedule/backend/#agent-rate-limit
[210]: /sensu-go/6.3/observability-pipeline/observe-schedule/business-service-monitoring/
[211]: /sensu-go/6.3/observability-pipeline/observe-schedule/rule-templates/#built-in-rule-template-aggregate
[212]: /sensu-go/6.3/api/other/health/#get-health-data-for-your-agent-transport
[213]: /sensu-go/6.3/observability-pipeline/observe-entities/#service-entities
[214]: /sensu-go/6.3/sensuctl/#global-flags
[215]: /sensu-go/6.4/commercial/
[216]: /sensu-go/6.4/platforms/#macos
[217]: /sensu-go/6.4/observability-pipeline/observe-schedule/backend/#etcd-log-level
[218]: /sensu-go/6.4/observability-pipeline/observe-schedule/backend/#initialization-timeout-and-wait-flags
[219]: https://etcd.io/docs/v3.5/metrics/etcd-metrics-latest.txt
[220]: /sensu-go/6.4/web-ui/webconfig-reference/#sign-in-message
[221]: /sensu-go/6.4/web-ui/webconfig-reference/#page-preferences-attributes
[222]: /sensu-go/6.4/operations/maintain-sensu/upgrade/#upgrade-to-sensu-go-640-from-any-previous-version
[223]: /sensu-go/6.3/web-ui/webconfig-reference/#default_preferences-attributes
[224]: /sensu-go/5.20/observability-pipeline/observe-schedule/backend/#metrics-refresh-interval
[225]: /sensu-go/6.4/observability-pipeline/observe-schedule/agent/#log-level
[226]: /sensu-go/6.4/observability-pipeline/observe-schedule/backend/#event-log-parallel-encoders
[227]: /sensu-go/6.4/api/other/metrics/
[228]: /sensu-go/6.4/observability-pipeline/observe-schedule/backend/#event-logging
[229]: /sensu-go/6.5/commercial/
[230]: /sensu-go/6.5/observability-pipeline/observe-process/sumo-logic-metrics-handlers/
[231]: /sensu-go/6.5/observability-pipeline/observe-process/tcp-stream-handlers/
[232]: /sensu-go/6.5/api/core/pipelines/
[233]: /sensu-go/6.5/observability-pipeline/observe-process/pipelines/
[234]: /sensu-go/6.5/api/enterprise/pipeline/
[235]: /sensu-go/6.5/sensuctl/create-manage-resources/#manage-resources
[236]: /sensu-go/6.5/observability-pipeline/observe-schedule/checks/#pipelines-attribute
[237]: /sensu-go/6.5/observability-pipeline/observe-schedule/backend/#event-logging
[238]: /sensu-go/6.5/observability-pipeline/observe-schedule/backend/#platform-metrics-logging
[239]: https://github.com/dgrijalva/jwt-go
[240]: https://github.com/golang-jwt/jwt
[241]: https://nvd.nist.gov/vuln/detail/CVE-2020-26160
[242]: /sensu-go/6.5/sensuctl/environment-variables/#export-environment-variables-with-sensuctl-env
[243]: /sensu-go/6.5/sensuctl/environment-variables/#set-environment-variables-for-a-single-command
[244]: /sensu-go/6.5/sensuctl/environment-variables/#set-environment-variables-with-sensuctl-configure
[245]: /sensu-go/6.5/operations/deploy-sensu/cluster-sensu/#authenticate-with-username-and-password-for-external-etcd
[246]: /sensu-go/6.5/observability-pipeline/observe-transform/mutators/#javascript-mutators
[247]: /sensu-go/6.5/sensu-plus/
[248]: /sensu-go/6.5/observability-pipeline/observe-schedule/backend/#add-api-key-for-initialization
[249]: /sensu-go/6.5/web-ui/view-manage-resources/#view-resource-data-in-the-web-ui
[250]: /sensu-go/6.5/web-ui/view-manage-resources/#execute-checks-on-demand
[251]: /sensu-go/6.5/observability-pipeline/observe-events/events/#processedby-attribute
[253]: /sensu-go/6.5/observability-pipeline/observe-schedule/backend/#initialization-ignore-already-initialized-flag
[254]: /sensu-go/6.5/observability-pipeline/observe-transform/mutators/#env-vars-attribute
[255]: #652-release-notes
[256]: /sensu-go/6.5/observability-pipeline/observe-schedule/backend/#api-write-timeout
[257]: /sensu-go/6.5/observability-pipeline/observe-schedule/backend/#dashboard-write-timeout
[258]: /sensu-go/6.6/observability-pipeline/observe-schedule/backend/#platform-metrics-logging
[259]: /sensu-go/6.6/commercial/
[260]: /sensu-go/6.6/observability-pipeline/observe-schedule/backend/#datastore-and-cluster-configuration-flags
[261]: /sensu-go/6.6/web-ui/view-manage-resources/#manage-entities
[262]: /sensu-go/6.6/observability-pipeline/observe-schedule/backend/#etcd-client-log-level
[263]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
[264]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
[265]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
[266]: /sensu-go/6.6/web-ui/search/#events-and-entities-search-limits
[267]: /sensu-go/latest/operations/deploy-sensu/datastore/#strict-attribute
