---
title: "CHANGELOG"
description: "Release notes for Sensu Core"
product: "Sensu Core"
version: "1.4"
menu: "sensu-core-1.4"
---

## Releases

- [Core 1.4.3 Release Notes](#core-v1-4-3)
- [Core 1.4.2 Release Notes](#core-v1-4-2)
- [Core 1.4.1 Release Notes](#core-v1-4-1)
- [Core 1.4.0 Release Notes](#core-v1-4-0)
- [Core 1.3.0 Release Notes](#core-v1-3-0)
- [Core 1.2.1 Release Notes](#core-v1-2-1)
- [Core 1.2.0 Release Notes](#core-v1-2-0)
- [Core 1.1.3 Release Notes](#core-v1-1-3)
- [Core 1.1.2 Release Notes](#core-v1-1-2)
- [Core 1.1.1 Release Notes](#core-v1-1-1)
- [Core 1.1.0 Release Notes](#core-v1-1-0)
- [Core 1.0.4 Release Notes](#core-v1-0-4)
- [Core 1.0.3 Release Notes](#core-v1-0-3)
- [Core 1.0.2 Release Notes](#core-v1-0-2)
- [Core 1.0.1 Release Notes](#core-v1-0-1)
- [Core 1.0.0 Release Notes](#core-v1-0-0)
- [Core 0.29.0 Release Notes](#core-v0-29-0)
- [Core 0.28.5 Release Notes](#core-v0-28-5)
- [Core 0.28.4 Release Notes](#core-v0-28-4)
- [Core 0.28.3 Release Notes](#core-v0-28-3)
- [Core 0.28.2 Release Notes](#core-v0-28-2)
- [Core 0.28.1 Release Notes](#core-v0-28-1)
- [Core 0.28.0 Release Notes](#core-v0-28-0)
- [Core 0.27.1 Release Notes](#core-v0-27-1)
- [Core 0.27.0 Release Notes](#core-v0-27-0)
- [Core 0.26.5 Release Notes](#core-v0-26-5)
- [Core 0.26.4 Release Notes](#core-v0-26-4)
- [Core 0.26.3 Release Notes](#core-v0-26-3)
- [Core 0.26.2 Release Notes](#core-v0-26-2)
- [Core 0.26.1 Release Notes](#core-v0-26-1)
- [Core 0.26.0 Release Notes](#core-v0-26-0)
- [Core 0.25.7 Release Notes](#core-v0-25-7)
- [Core 0.25.6 Release Notes](#core-v0-25-6)
- [Core 0.25.5 Release Notes](#core-v0-25-5)
- [Core 0.25.4 Release Notes](#core-v0-25-4)
- [Core 0.25.3 Release Notes](#core-v0-25-3)
- [Core 0.25.1 Release Notes](#core-v0-25-2)
- [Core 0.25.0 Release Notes](#core-v0-25-0)
- [Core 0.24.1 Release Notes](#core-v0-24-1)
- [Core 0.24.0 Release Notes](#core-v0-24-0)
- [Core 0.23.2 Release Notes](#core-v0-23-2)
- [Core 0.23.1 Release Notes](#core-v0-23-1)
- [Core 0.23.0 Release Notes](#core-v0-23-0)


## Core 1.4.3 Release Notes {#core-v1-4-3}

Source: [GitHub.com][61]

**July 24, 2018** &mdash; Sensu Core version 1.4.3 has been
	released and is available for immediate download. Please note
	the following improvements:

### CHANGES {#core-v1-4-3-changes}

- **BUGFIX*: Failures when using token substitution to provide a value
  for the check `source` attribute could cause the value of `source`
  to be returned as an empty string, causing strange display and user
  experience behaviors in the dashboard. The `source` attribute is now
  removed by client when it's value is empty.

- **BUGFIX*: When using a handler extension, a bug in filter log
  messages made it possible for handler extension class variables to
  be leaked into Sensu's log files. Some users experienced very large
  logfiles as a symptom of this behavior. Handler extensions may now
  use class instance variables without having them leak into the log
  file.

- **BUGFIX*: Lack of validation for check result `ttl` attribute on
  the /results API endpoint made it possible to submit check results
  with invalid TTL values and subsequently cause the Sensu server to
  crash. The /results API endpoint now appropriately applies
  validation to check result `ttl` attribute values.

- **BUGFIX*: Check definitions generated using token substitution and
  `proxy_requests` check definition attributes were not updated when
  token values changed, causing proxy request checks to
  misbehave. This has been fixed in the Sensu server by preventing the
  original check definition from being mutated.

## Core 1.4.2 Release Notes {#core-v1-4-2}

Source: [GitHub.com][60]

**May 10, 2018** &mdash; Sensu Core version 1.4.2 has been
	released and is available for immediate download. Please note
	the following improvements:

### CHANGES {#core-v1-4-2-changes}

- **SECURITY FIX**: Sensu's directory permissions on Microsoft Windows
  platforms were overly permissive, making it possible for
  unprivileged users to execute code as the Sensu service user. This
  vulnerability is fixed in Sensu Core 1.4.2-3, released May
  31, 2018. Our thanks to Matt Bush with [The Missing
  Link](http://themissinglink.com.au/) for discovering and reporting
  this vulnerability.

- **BUGFIX**: Fixed API GET /results, results were incorrectly reported
    under a single client name.


## Core 1.4.1 Release Notes {#core-v1-4-1}

Source: [GitHub.com][59]

**May 4, 2018** &mdash; Sensu Core version 1.4.1 has been
	released and is available for immediate download. Please note
	the following improvements:

### CHANGES {#core-v1-4-1-changes}

- **BUGFIX**: Now including em-http-request Ruby gem in runtime
    dependencies, fixing the 1.4 sensu-server.

## Core 1.4.0 Release Notes {#core-v1-4-0}

Source: [GitHub.com][58]

**May 2, 2018** &mdash; Sensu Core version 1.4.0 has been
	released and is available for immediate download. Please note
	the following improvements:

### CHANGES {#core-v1-4-0-changes}

- **NEW**: Sensu call-home mechanism, the Tessen client (opt-in). It
    sends anonymized data about the Sensu installation to the Tessen
    hosted service (Sensu Inc), on sensu-server startup and every 6
    hours thereafter. All data reports are logged for
    transparency/awareness and transmitted over HTTPS. The anonymized
    data currently includes the flavour of Sensu (Core or Enterprise),
    the Sensu version, and the Sensu client and server counts.

- **NEW**: API list endpoints (e.g. /events) now all support
    pagination.

- **IMPROVEMENT**: Support for writing multiple check results to the
    client socket (in one payload).

- **IMPROVEMENT**: Now updating event last_ok when storing latest
    check results for better accuracy.

- **BUGFIX**: Include child process (e.g. check execution) stop
    (SIGTERM/KILL) error message in timeout output. This helps when
    debugging defunct/zombie processes, e.g. "Execution timed out -
    Unable to TERM/KILL the process: Operation not permitted".

## Core 1.3.0 Release Notes {#core-v1-3-0}

Source: [GitHub.com][57]

**April 12, 2018** &mdash; Sensu Core version 1.3.0 has been
	released and is available for immediate download. Please note
	the following improvements:

### CHANGES {#core-v1-3-0-changes}

- **NEW**: Redis TLS connection support. Sensu Redis connections can now
	be configured to use TLS, this includes the Sensu server and Redis
	transport connections! The Sensu Redis configuration definition
	now includes the optional "tls" (or "ssl") attribute, a hash
	containing TLS options ("private_key_file", "cert_chain_file", and
	"verify_peer").

- **NEW**: The Sensu client TCP/UDP socket can now be disabled via
	configuration. The Sensu client configuration definition now
	includes the socket "enabled" attribute, which defaults to true,
	and it can be set to false in order to disable the socket. (#1799)

- **IMPROVEMENT**: The Sensu Ruby gems are now cryptographically signed.
	To learn more about Ruby gem signing, please refer to the RubyGems
	security guide. (#1819)

- **IMPROVEMENT**: The Sensu API POST /clients endpoint no longer
	requires client subscriptions to be specified. (#1795)

- **IMPROVEMENT**: All Sensu event handler types now include event ID in
	log events.

- **BUGFIX**: Sensu TCP event handlers will no longer connect to a socket
	if the provided event data is nil or empty. (#1734)

- **BUGFIX**: The RabbitMQ transport will now reconnect after failing to
	resolve DNS, instead of independently retrying broker hostname
	resolution. This fixes retry timer backoff and allows the
	transport to connect to another eligible broker after failing to
	resolve a hostname.

## Core 1.2.1 Release Notes {#core-v1-2-1}

**February 9, 2018** &mdash; Sensu Core version 1.2.1 has been
	released and is available for immediate download. Please note
	the following improvements:

### CHANGES {#core-v1-2-1-changes}

- **SECURITY FIX**: Sensu's configuration redaction function failed to
  handle key/value pairs in deeply nested data structures, resulting in
  sensitive configuration data (e.g. passwords) being logged in clear-text.
  The redaction function now handles the necessary recursion to address
  this vulnerability.

  This vulnerability is documented as [CVE-2018-1000060](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-1000060).

## Core 1.2.0 Release Notes {#core-v1-2-0}

Source: [GitHub.com][56]

**December 5, 2017** &mdash; Sensu Core version 1.2.0 has been
	released and is available for immediate download. Please note
	the following improvements:

### CHANGES {#core-v1-2-0-changes}

- **NEW**: Scheduled maintenance, Sensu now gives users the ability to
	silence a check and/or client subscriptions at a predetermined
	time (begin epoch timestamp), with an optional expiration (in
	seconds), enabling users to silence events in advance for
	scheduled maintenance windows.

- **NEW**: The Sensu API now logs the "X-Request-ID" header, making it
	much easier to trace a request/response. If the API client does
	not provide a request ID, the API generates one for the request
	(UUID).

- **IMPROVEMENT**: The Sensu API /results/* endpoints now include check
	history in the result data.

- **IMPROVEMENT**: Check token substitution is now supported in check
	"subdue".

## Core 1.1.3 Release Notes {#core-v1-1-3}

Source: [GitHub.com][55]

### CHANGES {#core-v1-1-3-changes}

- **BUGFIX**: Fixed a bug in the Sensu client that broke check hooks
    named after numeric statuses (e.g. "2") and "non-zero", they were
    never executed unless the client had a local check definition.
    (#1773)

- **BUGFIX**: systemd units now stored in /lib/systemd instead of
    /usr/lib/systemd on Debian and Ubuntu systems. (sensu-omnibus
    #240)

- **BUGFIX**: Sensu processes once again honor service-specific
    defaults in /etc/default or /etc/sysconfig (sensu-omnibus #226)

- **BUGFIX**: Package scripts now use `getent` for user/group
    verification (sensu-omnibus #237)

- **BUGFIX**: Removing AIX package no longer fails when sensu-client
    isn't running. (sensu-omnibus #243)

## Core 1.1.2 Release Notes {#core-v1-1-2}

Source: [GitHub.com][54]

### CHANGES {#core-v1-1-2-changes}

- **BUGFIX**: Fixed a bug in the Sensu client HTTP socket that caused
    the Sensu client to crash when the the local client definition did
    not specify `"http_socket"` settings and the `/info` or `/results`
    endpoints were accessed.

- **BUGFIX**: Fixed a bug in the Sensu client HTTP socket that caused
    the Sensu client to consider an HTTP content-type that included
    media-type information as invalid, discarding possibly valid
    content.

## Core 1.1.1 Release Notes {#core-v1-1-1}

Source: [GitHub.com][53]

### CHANGES {#core-v1-1-1-changes}

- **BUGFIX**: Fixed a bug in check TTL monitoring that caused the
    Sensu server to crash. Check TTL member deletion, following the
    deletion of the associated check result, would produce an uncaught
    error.

## Core 1.1.0 Release Notes {#core-v1-1-0}

Source: [GitHub.com][49]

**September, 27  2017** &mdash; Sensu Core version 1.1.0 has been released
	and is available for immediate download. Please note the following
	improvements:

### CHANGES {#core-v1-1-0-changes}

- **IMPORTANT**: Sensu packages include Ruby 2.4.1. Upgrading from
	releases of Sensu prior to 1.0.0 will require all plugin or
	extension gems to be re-installed under the new Ruby environment.

- **IMPORTANT**: Sensu packages include [sensu-plugin 2.0.0][50], which
	disables its deprecated filter methods by default, i.e.
	occurrences. Sensu releases since 1.0.0 include built-in filters
	that provide the same functionality with several improvements. The
	built-in filters are ["occurrences"][51] and
	["check_dependencies"][52]. To use the built-in filters, apply them
	to Sensu event handlers via their definition `"filters"`
	attribute, e.g. `"filters": ["occurrences",
	"check_dependencies"]`. These filters can now be used with Sensu
	event handlers that do not use the sensu-plugin library (or Ruby).

- **NEW**: Check hooks, commands run by the Sensu client in response to
	the result of the check command execution. The Sensu client will
	execute the appropriate configured hook command, depending on the
	check execution status (e.g. 1). Valid hook names include (in
	order of precedence): "1"-"255", "ok", "warning", "critical",
	"unknown", and "non-zero". The check hook command output, status,
	executed timestamp, and duration are captured and published in the
	check result. Check hook commands can optionally receive JSON
	serialized Sensu client and check definition data via STDIN.

- **NEW**: Check STDIN. A boolean check definition attribute, "stdin",
	when set to true instructs the Sensu client to write JSON
	serialized Sensu client and check definition data to the check
	command process STDIN. This attribute cannot be used with existing
	Sensu check plugins, nor Nagios plugins etc, as the Sensu client
	will wait indefinitely for the check process to read and close
	STDIN.

- **IMPROVEMENT**: Splayed proxy check request publishing. Users can now
	splay proxy check requests (optional), evenly, over a window of
	time, determined by the check interval and a configurable splay
	coverage percentage. For example, if a check has an interval of
	60s and a configured splay coverage of 90%, its proxy check
	requests would be splayed evenly over a time window of 60s * 90%,
	54s, leaving 6s for the last proxy check execution before the the
	next round of proxy check requests for the same check. Proxy check
	request splayed publishing can be configured with two new check
	definition attributes, within the proxy_requests scope, splay
	(boolean) to enable it and splay_coverage (integer percentage,
	defaults to 90).

- **IMPROVEMENT**: Configurable check output truncation (for storage in
	Redis). Check output truncation can be manually enabled/disabled
	with the check definition attribute "truncate_output",
	e.g."truncate_output": false. The output truncation length can be
	configured with the check definition attribute
	"truncate_output_length", e.g. "truncate_output_length": 1024.
	Check output truncation is still enabled by default for metric
	checks, with "type": "metric".

- **IMPROVEMENT**: Sensu client HTTP socket basic authentication can how
	be applied to all endpoints (not just /settings), via the client
	definition http_socket attribute "protect_all_endpoints", e.g.
	"protect_all_endpoints": true.

- **IMPROVEMENT**: Improved check TTL monitoring performance.

- **IMRPOVEMENT**: The Sensu extension run log event log level is now set
	to debug (instead of info) when the run output is empty and the
	status is 0.

- **BUGFIX**: Added initial timestamp to proxy client definitions. The
	Uchiwa and Sensu dashboards will no longer display "Invalid Date".

- **BUGFIX**: Deleting check history when deleting an associated check result.

## Core 1.0.4 Release Notes {#core-v1-0-4}

**October, 17  2017** &mdash; Sensu Core version 1.0.4 has been released
	and is available for immediate download. Please note the following
	improvements:

### CHANGES {#core-v1-0-4-changes}

- **DEBUG**: Added HTTP response body to sensu-api debug-level log
    messages. This is a temporary change, not included in
    future releases.

## Core 1.0.3 Release Notes {#core-v1-0-3}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#103---2017-08-25)

**August 25, 2017** &mdash; Sensu Core version 1.0.3 has been released
	and is available for immediate download. Please note the following
	improvements:

### CHANGES {#core-v1-0-3-changes}

- **BUGFIX**: Now using EventMachine version 1.2.5 in order to support larger EM
  timer intervals. EM timers are used by the Sensu check scheduler and many
  other Sensu components.


## Core 1.0.2 Release Notes {#core-v1-0-2}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#102---2017-07-27)

**July 27, 2017** &mdash; Sensu Core version 1.0.2 has been released
	and is available for immediate download. Please note the following
	improvements:

### CHANGES {#core-v1-0-2-changes}

- **BUGFIX**: Addressed an issue with client keepalive transport
	acknowledgments. We discovered a situation where poor Redis
	performance could negatively impact client keepalive processing,
	potentially triggering a compounding failure that the Sensu server
	is unable to recover from. Moving acknowledgments to the next tick
	of the EventMachine reactor avoids the situation entirely.

## Core 1.0.1 Release Notes {#core-v1-0-1}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#101---2017-07-24)

**July 24, 2017** &mdash; Sensu Core version 1.0.1 has been released
	and is available for immediate download. Please note the following
	improvements:

### CHANGES {#core-v1-0-1-changes}

- **BUGFIX**: Fixed Sensu configuration validation, it is now being
	applied. There was a bug that allowed invalid Sensu configuration
	definitions to be loaded, causing unexpected behaviours.

- **BUGFIX**: Now excluding certain file system directories from the Sensu
	RPM package spec, as they could cause conflicts with other RPM
	packages.

## Core 1.0.0 Release Notes {#core-v1-0-0}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#100---2017-07-11)

**July 11, 2017** &mdash; Sensu Core version 1.0.0 has been released
	and is available for immediate download. Please note the following
	improvements:

### CHANGES {#core-v1-0-0-changes}

- **IMPORTANT**: Sensu packages now include Ruby 2.4.1. Upgrading from
	prior versions of Sensu will require any plugin or extension gems
	to be re-installed under the new Ruby environment.

- **IMPORTANT**: Sensu packages now include [sensu-plugin 2.0.0][46], which
	disables its deprecated filter methods by default, i.e.
	occurrences. Sensu 1.0 includes built-in filters that provide the
	same functionality with several improvements. The built-in filters
	are ["occurrences"][47] and ["check_dependencies"][48]. To use the
	built-in filters, apply them to Sensu event handlers via their
	definition `"filters"` attribute, e.g. `"filters": ["occurrences",
	"check_dependencies"]`. These filters can now be used with Sensu
	event handlers that do not use the sensu-plugin library (or Ruby).

- **NEW**: Added Sensu API event endpoint alias "incidents", e.g.
	/incidents, /incidents/:client/:check.

- **IMPROVEMENT**: Improved Sensu client keepalive configuration
	validation, now including coverage for check low/high flap
	thresholds etc.

- **IMPROVEMENT**: Improved Sensu client socket check result validation,
	now including coverage for check low/high flap thresholds etc.

- **IMPROVEMENT**: The sensu-install tool now notifies users when it is
	unable to successfully install an extension, when the environment
	variable EMBEDDED_RUBY is set to false.

- **IMPROVEMENT**: Added the Sensu RELEASE_INFO constant, containing
	information about the Sensu release, used by the API /info
	endpoint and Server registration.

- **BUGFIX**: Sensu handler severities filtering now accounts for flapping
	events.

- **BUGFIX**: Fixed Sensu Redis connection on error reconnect, no longer
	reusing the existing EventMachine connection handler.

## Core 0.29.0 Release Notes {#core-v0-29-0}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0290---2017-03-29)

**April 7, 2017** &mdash; Sensu Core version 0.29.0 has been released
	and is available for immediate download. Please note the following
	improvements:

### CHANGES {#core-v0-29-0-changes}

- **IMPORTANT**: Sensu packages now include Ruby 2.4.1. Upgrading from
	prior versions of Sensu will require any plugin or extension gems
	to be re-installed under the new Ruby environment.

- **IMPORTANT**: Sensu packages now include [sensu-plugin 2.0.0][43], which
	disables its deprecated filter methods by default, i.e.
	occurrences. Sensu 0.29 includes built-in filters that provide the
	same functionality with several improvements. The built-in filters
	are ["occurrences"][44] and ["check_dependencies"][45]. To use the
	built-in filters, apply them to Sensu event handlers via their
	definition `"filters"` attribute, e.g. `"filters": ["occurrences",
	"check_dependencies"]`. These filters can now be used with Sensu
	event handlers that do not use the sensu-plugin library (or Ruby).

- **IMPROVEMENT**: Sensu server tasks, replacing the Sensu server leader
	functionality, distributing certain server responsibilities
	amongst the running Sensu servers. A server task can only run on
	one Sensu server at a time. Sensu servers partake in an election
	process to become responsible for one or more tasks. A task can
	failover to another Sensu server.

- **IMPROVEMENT**: Sensu API response object filtering for any GET
	request. Filtering is done with one or more dot notation query
	parameters, beginning with `filter.`, to specify object attributes
	to filter by, e.g.
	`/events?filter.client.environment=production&filter.check.contact=ops`.

- **NEW**: Added API endpoint GET `/settings` to provided the APIs
	running configuration. Sensitive setting values are redacted by
	default, unless	the query parameter `redacted` is set to `false`,
	e.g. `/settings?redacted=false`.

- **IMPROVEMENT**: Added support for invalidating a Sensu client when
	deleting it via the Sensu API DELETE `/clients/:name` endpoint,
	disallowing further client keepalives and check results until the
	client is either successfully removed from the client registry or
	for a specified duration of time. To invalidate a Sensu client
	until it is deleted, the query parameter `invalidate` must be set
	to `true`, e.g. `/clients/app01.example.com?invalidate=true`. To
	invalidate the client for a certain amount of time (in seconds),
	the query parameter `invalidate_expire` must be set as well, e.g.
	`/clients/app01.example.com?invalidate=true&invalidate_expire=300`.

- **IMPROVEMENT**: Added a Sensu settings hexdigest, exposed via the Sensu
	API GET `/info`	endpoint, providing a means to determine if a
	Sensu server's configuration differs from the rest.

- **IMPROVEMENT**: Added a proxy argument to `sensu-install`. To use a
	proxy for Sensu plugin and extension installation with
	`sensu-install`, use the `-x` or `--proxy` argument, e.g.
	`sensu-install -e statsd --proxy http://proxy.example.com:8080`.

- **IMPROVEMENT**: Added support for issuing proxy check requests via the
	Sensu API POST `/request` endpoint.

- **IMPROVEMENT**: The Sensu API now logs response times.

- **IMPROVEMENT**: The Sensu API now returns a 405 (Method Not Allowed)
	when an API endpoint does not support a HTTP request method, e.g.
	`PUT`, and sets the HTTP header "Allow" to indicate which HTTP
	request methods are supported by the requested endpoint.

- **IMPROVEMENT**: Added a built-in filter for check dependencies,
	`check_dependencies`, which implements the check dependency
	filtering logic in the Sensu Plugin library.

- **IMPROVEMENT**: Added default values for Sensu CLI options
	`config_file` (`"/etc/sensu/config.json"`) and `config_dirs`
	(`["/etc/sensu/conf.d"]`). These defaults are only applied when
	the associated file and/or directory exist.

- **BUGFIX**: The built-in filter `occurrences` now supports `refresh` for
	flapping events (action `flapping`).

- **BUGFIX**: Force the configured Redis port to be an integer, as some
	users make the mistake of using a string.

## Core 0.28.5 Release Notes {#core-v0-28-5}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0285---2017-03-23)

**March 23, 2017** &mdash; Sensu Core version 0.28.5 has been released and
	is available for immediate download. Please note the following
	changes:

- **BUGFIX**: Fixed check `subdue` and filter `when` features when a time
	window spans over `00:00:00`, crossing the day boundary.

## Core 0.28.4 Release Notes {#core-v0-28-4}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0284---2017-03-10)

**March 10, 2017** &mdash; Sensu Core version 0.28.4 has been released and
	is available for immediate download. Please note the following
	changes:

- **BUGFIX**: In the interest of addressing a regression causing duplicate
	check execution requests, code added in 0.28.0 to account for task
	scheduling drift has been removed.

## Core 0.28.3 Release Notes {#core-v0-28-3}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0283---2017-03-09)

**March 9, 2017** &mdash; Sensu Core version 0.28.3 has been released and
	is available for immediate download. Please note the following
	changes:

- **BUGFIX**: The Sensu client now includes check source when tracking in
	progress check executions. These changes are necessary to allow
	the Sensu client to execute on several concurrent proxy check
	requests.

## Core 0.28.2 Release Notes {#core-v0-28-2}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0282---2017-03-06)

**March 6, 2017** &mdash; Sensu Core version 0.28.2 has been released
  and is available for immediate download. Please note the following
  changes:

- **BUGFIX**: Clients created via /clients API endpoint now have a
  per-client subscription added automatically, ensuring they can be
  silenced.

## Core 0.28.1 Release Notes {#core-v0-28-1}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0281---2017-03-02)

**March 2, 2017** &mdash; Sensu Core version 0.28.1 has been released
  and is available for immediate download. Please note the following
  changes:

- **BUGFIX**: Check requests with proxy_requests attributes are no
  longer overridden by local check definitions.

- **IMPROVEMENT**: Updated [Oj][41] (used by the sensu-json library) to the
  latest release (2.18.1) for Ruby 2.4 compatibility.

- **IMPROVEMENT**: Updated embedded OpenSSL from [1.0.2j to 1.0.2k][42].

## Core 0.28.0 Release Notes {#core-v0-28-0}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0280---2017-02-23)

**February 23, 2017** &mdash; Sensu Core version 0.28.0 has been released
	and is available for immediate download. Please note the following
	improvements:

### CHANGES {#core-v0-28-0-changes}

- **IMPROVEMENT**: Added proxy check requests to improve Sensu's ability
	to monitor external resources that have an associated Sensu proxy
	client. Publish a check request to the configured `subscribers`
	(e.g. `["round-robin:snmp_pollers"]`) for every Sensu client in
	the registry that matches the configured client attributes in
	`client_attributes` on the configured `interval` (e.g. `60`).
	Client tokens in the check definition (e.g. `"check-snmp-if.rb -h
	:::address::: -i eth0"`) are substituted prior to publishing the
	check request. The check request check source is set to the client
	name.

- **IMPROVEMENT**: Schedule check requests and standalone executions with
	the Cron syntax.

- **IMPROVEMENT**: Added the Sensu server registry, containing information
	about the running Sensu servers. Information about the Sensu
	servers is now accessible via the Sensu API /info endpoint.

- **IMPROVEMENT**: Added two optional attributes to Sensu API POST
	/request, "reason" and "creator", for additional context. The
	check request reason and creator are added to the check request
	payload under "api_requested" and become part of the check result.

- **IMPROVEMENT**: Added event IDs to event handler log events for
	additional context, making it easier to trace an event through the
	Sensu pipeline.

- **BUGFIX**: The Sensu interval timers, used for scheduling tasks, now
	account for drift. The check request and standalone execution
	scheduler timers are now more accurate.

- **BUGFIX**: Fixed a bug in the Sensu deep_merge() method that was
	responsible for mutating arrays of the original provided objects.

## Core 0.27.1 Release Notes {#core-v0-27-1}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0271---2017-02-17)

**February 17, 2017** &mdash; Sensu Core version 0.27.1 has been released
	and is available for immediate download. Please note the following
	improvements:

### CHANGES {#core-v0-27-1-changes}

- **IMPROVEMENT**: Failed pipe handler executions are now logged with the
	error log level.

- **IMPROVEMENT**: Sensu server now adds a unique per-client subscription to
	client keepalives when missing. This is to enable built-in event
	silencing for older Sensu clients (< 0.26).

- **BUGFIX**: Check subdue and filter when time windows now account for
	GMT offsets.

- **BUGFIX**: Non UTF-8 characters in check tokens are now removed.

- **BUGFIX**: Fixed filter name logging when an event is filtered.

## Core 0.27.0 Release Notes {#core-v0-27-0}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0270---2017-01-26)

**January 26, 2017** &mdash; Sensu Core version 0.27.0 has been released and is
available for immediate download. Please note the following improvements:

### IMPORTANT {#core-v0-27-0-important}

This release includes potentially breaking, backwards-incompatible changes:

- **NEW**: Sensu is now packaged specifically for each supported platform
	version and architecture; previously, single packages were built
	for each platform and architecture using the oldest supported
	platform version. Accordingly, package repository structures have
	changed to support per-platform-version packages. See the
	[platforms page][35] for links to updated installation instructions.

- **NEW**: On platforms where systemd is the default init, Sensu now
	provides systemd unit files instead of sysv init scripts.

- **NOTE**: The transition of service management from sysv to systemd may
	initially cause an error when restarting Sensu services. To
	avoid this, please be sure to stop Sensu services before
	upgrading to Sensu 0.27 and starting them again.

- **REMOVED**: The embedded runit service supervisor is no longer included
	in Sensu packages for Linux platforms.

- **REPLACED**: The [sensu-omnibus project][36] has superseded sensu-build as
	the tool chain for building official Sensu packages. This project
	uses [Travis CI][37] to automate package builds using a combination of
	[Test Kitchen][38], [Chef][39] and [Omnibus][40] tools.

- **IMPROVEMENT**: Sensu packages for Windows now include Ruby 2.3.0,
	upgraded from Ruby 2.0.0 in prior versions of Sensu.

- **IMPROVEMENT**: Sensu packages for Windows now include winsw 2.0.1,
	upgraded from winsw 1.16. This version includes a number of changes
	which should help to address issues around orphaned processes.

- **CHANGED**: The CONFIG_DIR environment variable has been renamed to
  CONFD_DIR. This environment varible is used to specify the
  directory path where Sensu processes will load any JSON
  config files for deep merging. If you are using
  /etc/default/sensu to specify a custom value for
  `CONFIG_DIR`, please update it to the new `CONFD_DIR`
  variable name.

### CHANGES {#core-v0-27-0-changes}

- **NEW**: Added a Sensu client HTTP socket for check result input and
	informational queries. The client HTTP socket provides several
	endpoints, `/info`, `/results`, and `/settings`. Basic
	authentication is supported, which is required for certain
	endpoints, i.e. `/settings`. The client HTTP socket is
	configurable via the Sensu client definition, `"http_socket": {}`.

- **NEW**: Added API endpoint `/silenced/ids/:id` for fetching a silence
	entry by ID.

- **NEW**: Added check attribute `ttl_status`, allowing checks to set a
	different TTL event check status (default is `1` warning).

- **NEW**: Added client deregistration attribute `status`, allowing clients
	to set a different event check status for their deregistration
	events (default is `1` warning).

- **NEW**: Added Rubygems cleanup support to `sensu-install`, via the
	command line argument `-c` or `--clean` when installing one or
	more plugins and/or extensions. If a version is provided for the
	plugin(s) or extension(s), all other installed versions of them
	will be removed, e.g. `sensu-install -e snmp-trap:0.0.23 -c`. If a
	version is not provided, all installed versions except the latest
	will be removed.

- **IMPROVEMENT**: Hostnames are now resolved prior to making connection
	attempts, this applies to the Sensu Transport (i.e. RabbitMQ) and
	Redis connections. This allows Sensu to handle resolution failures
	and enables failover via DNS and services like Amazon AWS
	ElastiCache.

- **IMPROVEMENT**: Added the filter name to event filtered log events.

- **IMPROVEMENT**: Check TTL events now have the check interval overridden
	to the TTL monitoring interval, this change allows event
	occurrence filtering to work as expected.

- **BUGFIX**: Silenced resolution events with silencing
	`"expire_on_resolve": true` are now handled.

## Core 0.26.5 Release Notes {#core-v0-26-5}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0265---2016-10-12)

**October 12, 2016** &mdash; Sensu Core version 0.26.5 has been released
	and is available for immediate download. Please note the following
	improvements:

### CHANGES {#core-v0-26-5-changes}

- **BUGFIX**: Fixed Sensu client configuration validation when the
	automatic per-client subscription is the client's only
	subscription.

## Core 0.26.4 Release Notes {#core-v0-26-4}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0264---2016-10-05)

**October 5, 2016** &mdash; Sensu Core version 0.26.4 has been released
	and is available for immediate download. Please note the following
	improvements:

### CHANGES {#core-v0-26-4-changes}

- **BUGFIX**: Fixed in progress check extension execution tracking, the
	Sensu client now guards against multiple concurrent executions of
	the same check extension.

## Core 0.26.3 Release Notes {#core-v0-26-3}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0263---2016-09-21)

**September 23, 2016** &mdash; Sensu Core version 0.26.3 has been released
	and is available for immediate download. Please note the following
	improvements:

### CHANGES {#core-v0-26-3-changes}

- **BUGFIX**: Fixed a condition where /silenced API would fail to retrieve
	entries for subscriptions containing a mix of colons and hyphens,
	e.g. `client:foo-bar-baz`.

## Core 0.26.2 Release Notes {#core-v0-26-2}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0262---2016-09-20)

**September 21, 2016** &mdash; Sensu Core version 0.26.2 has been released
	and is available for immediate download. Please note the following
	improvements:

### CHANGES {#core-v0-26-2-changes}

- **BUGFIX**: Fixed a condition where events could not be successfully
	deleted when they originate from a client configured with a
	signature

- **BUGFIX**: Fixed a condition where check results with an invalid
	signature would never complete processing. This often resulted in
	Sensu Server failing to shut down cleanly.

- **BUGFIX**: Fixed a condition where /silenced API would fail to retrieve
	entries for subscriptions containing colons, e.g. `client:foo`.

- **BUGFIX**: Made a change to ensure that new proxy clients are created
	with a per-client subscription just like regular clients.

## Core 0.26.1 Release Notes {#core-v0-26-1}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0261---2016-09-07)

**September 7, 2016** &mdash; Sensu Core version 0.26.1 has been released
	and is available for immediate download. Please note the following
	improvements:

### CHANGES {#core-v0-26-1-changes}

- **BUGFIX**: Fixed a condition where Sensu Server would fail to start
	without a `client` configuration definition.

## Core 0.26.0 Release Notes {#core-v0-26-0}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0260---2016-09-06)

**August 24, 2016** &mdash; Sensu Core version 0.26.0 has been released and is
available for immediate download. Please note the following improvements:

### IMPORTANT {#core-v0-26-0-important}

This release includes potentially breaking, backwards-incompatible changes:

- Event silencing is now built into Sensu Core, and a new `/silenced` API
  is now available. A new [`"handle_silenced": true` attribute][34] is
  available to opt-out of this new built-in silencing functionality on a
  per-handler basis.

- **NEW**: Every Sensu client now creates and subscribes to a unique client
  subscription (e.g. `client:i-424242`). Unique client subscriptions are
  required for silencing one or more checks on a single client (host)
  **Fixes: [#1327][gh-1327]**.

- Sensu Core version 0.26 requires Uchiwa version 0.18 or newer in order
  to make use of the new `/silenced` API feature. Prior versions of Uchiwa
  silence events using the "silence stashes" pattern, which will be honored by
  existing handlers until the now-deprecated event filtering is removed
  from a future version of sensu-plugin.

  _NOTE: The new `/silenced` API and native event silencing features are
  intended to replace the "silence stash" pattern implemented in the
  `sensu-plugin` library and widely used by existing handlers. This
  "silence stashes" pattern is considered deprecated. Sensu 0.26 includes
  version 1.4.2 of the `sensu-plugin` library which continues to
  apply this pattern by default, but will log deprecation warnings as
  well.	Set the check attribute `enable_deprecated_filtering: false` to
  disable the deprecated filtering behavior. Please refer to the
  [Deprecating Event Filtering in sensu-plugin][32] blog post for more
  information._

- The handler definition `subdue` attribute is no longer supported. Time-based
  filtering is now supported by the new [filter `when` attribute][27]. Please
  update your handler definitions accordingly.

- Check `subdue` definitions no longer support the `"at": "handler"`
  configuration setting.

### CHANGES {#core-v0-26-0-changes}

- **NEW**: Event silencing is now built into Sensu Core! The Sensu API now
  provides a set of [`/silenced` endpoints][33], for silencing one or more
  checks and/or subscriptions (including the NEW client-specific subscriptions,
  above). Silencing applies to all event handlers by default, however a new
  `handle_silenced` handler definition attribute can be used to disable this
  functionality. Metric check events (OK) bypass event silencing.

  _NOTE: this improvement is very closely related to the impending removal
  of event filtering in the `sensu-plugin` gem. See the recent [Deprecating
  Event Filtering in sensu-plugin][32] blog post for more information._

- **NEW**: Introducing **Subdue 2.0**! Sensu `subdue` rules have a brand new
  configuration syntax, adding support for a broader number of applications, and
  `subdue` definitions are now supported by standalone checks.

  By way of comparison, the legacy `subdue` definition specification was
  limited to a single time window rule, with an array of exceptions. This was
  not only confusing, it made it very difficult to apply a simple "don't execute
  this check outside of 9-5, M-F" rule.

  {{< highlight json >}}
  {
    "checks": {
      "example_check": {
        "command": "check_something.rb",
        "...": "...",
        "subdue": {
          "begin": "12:00:00 AM",
          "end": "11:59:00 PM",
          "days": ["monday", "tuesday", "wednesday", "thursday", "friday"],
          "exceptions": [
            {
              "begin": "9:00:00 AM",
              "end": "5:00:00 PM"
            }
          ]
        }
      }
    }
  }
  {{< / highlight >}}

  The new syntax is more verbose, but by doing away with the need for
  `exceptions` and adding support for defining an array of subdue time windows,
  it is much easier to configure.

  {{< highlight json >}}
  {
    "checks": {
      "example_check": {
        "command": "check_something.rb",
        "...": "...",
        "subdue": {
          "days": {
            "monday": [
              {
                "begin": "12:00:00 AM PST",
                "end": "9:00:00 AM PST"
              },
              {
                "begin": "5:00:00 PM PST",
                "end": "11:59:59 PM PST"
              }
            ],
            "tuesday": [
              {
                "begin": "12:00:00 AM PST",
                "end": "9:00:00 AM PST"
              },
              {
                "begin": "5:00:00 PM PST",
                "end": "11:59:59 PM PST"
              }
            ],
            "wednesday": [
              {
                "begin": "12:00:00 AM PST",
                "end": "9:00:00 AM PST"
              },
              {
                "begin": "5:00:00 PM PST",
                "end": "11:59:59 PM PST"
              }
            ],
            "thursday": [
              {
                "begin": "12:00:00 AM PST",
                "end": "9:00:00 AM PST"
              },
              {
                "begin": "5:00:00 PM PST",
                "end": "11:59:59 PM PST"
              }
            ],
            "friday": [
              {
                "begin": "12:00:00 AM PST",
                "end": "9:00:00 AM PST"
              },
              {
                "begin": "5:00:00 PM PST",
                "end": "11:59:59 PM PST"
              }
            ],
            "saturday": [
              {
                "begin": "12:00:00 AM PST",
                "end": "11:59:59 PM PST"
              }
            ],
            "sunday": [
              {
                "begin": "12:00:00 AM PST",
                "end": "11:59:59 PM PST"
              }
            ]
          }
        }
      }
    }
  }
  {{< / highlight >}}

  _NOTE: Subdue rules now apply to check publishing, **ONLY** (i.e. `subdue`
  definitions no longer support the `"at": "handler"` definition attribute,
  among other changes). Prior to this release, `subdue` rules could be provided
  via [check definition `subdue` attribute][25] (i.e. `"at": "publisher"`) or the
  [handler definition `subdue` attribute][26] (i.e. `"at": "handler"`).
  Time-based filtering for handlers is now provided by Sensu filters (see
  below). Please refer to the new [`subdue` reference documentation][25] for more
  information._ **See: [#1415][gh-1415]**.

- **NEW**: Event filters now support time-based rules, via a new `"when": {}`
  filter definition attribute. The filter `when` specification uses the same
  syntax as the new Subdue 2.0 specification, simplifying time-based event
  filtering. Please refer to the [filer `when` reference documentation][27] for
  more information. **See [#1415][gh-1415]**.

- **NEW**: Sensu Extensions can now be loaded from Rubygems and enabled/disabled
  via configuration! The `sensu-install` has also added support for installing
  Sensu Extensions (e.g. `sensu-install -e system-profile`). Extensions gems
  must be enabled via configuration, please refer to the [Sensu extension
  reference documentation][28] for more information. **See: [#1394][gh-1394]**.

- **NEW**: A check can now be a member of more than one [named aggregate][29],
  via a new check definition `"aggregates": []` attribute. **See: [#1379][gh-1379];
  fixes [#1342][gh-1342]**.

- **NEW**: Added support for setting Redis Sentinel configuration via a new
  `REDIS_SENTINEL_URLS` environment variable. Please refer to the [Sensu
  environment variables reference documentation][30] for more information. **See
  [#1411][gh-1411]; fixes [#1361][gh-1361].

- **NEW**: Added support for automatically discovering and setting client `name`
  and `address` attributes (two of the few required attributes for a valid
  Sensu client definition). **See: [#1379][gh-1379]; fixes [#1362][gh-1362]**.

- **IMPROVEMENT**: Added support for a new `occurrences_watermark` attribute,
  which is used by the built-in [sensu-occurrences-extension][31] filter to
  prevent sending resolve notifications for events that were not handled due to
  occurrence filtering. **See: [#1419][gh-1419] and [#1427][gh-1427]**.

- **IMPROVEMENT**: Only attempt to schedule standalone checks that have an
  interval. **See: [#1384][gh-1384]; fixes [#1286][gh-1286]**.

- **IMPROVEMENT**: Locally configured standalone checks (e.g. on a Sensu server)
  are no longer accessible via the Sensu API `/checks` endpoint. **See:
  [#1417][gh-1417]; fixes [#1416][gh-1416]**.

- **IMPROVEMENT**: Check TTL events are no longer created if the associated
  Sensu client has a current keepalive event. **See [#1428][gh-1428]; fixes [#861][gh-861]
  and [#1282][gh-1282]**.

- **IMPROVEMENT**: Increased the maximum number of EventMachine timers from 100k
  to 200k, to accommodate very large Sensu installations that execute over 100k
  checks. **See [#1370][gh-1370]; fixes [#1368][gh-1368]**.

- **BUGFIX**: Fixed a Sensu API `/results` endpoint race condition that
  caused incomplete response content. **See [#1372][gh-1372]; fixes [#1356][-i1356]**.

## Core 0.25.7 Release Notes {#core-v0-25-7}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0257---2016-08-09)

**August 9, 2016** &mdash; Sensu Core version 0.25.7 has been released and is
available for immediate download. Please note the following improvements:

### CHANGES {#core-v0-25-7-changes}

- **BUGFIX**: Fixed the Sensu API 204 status response string, changing "No
  Response" to the correct string "No Content". **Fixes: [#1405][gh-1405].**

## Core 0.25.6 Release Notes {#core-v0-25-6}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0256---2016-07-28)

**July 28, 2016** &mdash; Sensu Core version 0.25.6 has been released and is
available for immediate download. Please note the following improvements:

### CHANGES {#core-v0-25-6-changes}

- **BUGFIX**: Check results for unmatched tokens now include an executed
  timestamp.

- **BUGFIX**: API aggregates max_age now guards against check results with a nil
  executed timestamp.

## Core 0.25.5 Release Notes {#core-v0-25-5}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0255---2016-07-12)

**July 12, 2016** &mdash; Sensu Core version 0.25.5 has been released and is
available for immediate download. Please note the following improvements:

### CHANGES {#core-v0-25-5-changes}

- **BUGFIX**: Reverted a Sensu API race condition fix, it was a red herring.
  Desired behavior has been restored. **See: [#1358][gh-1358].**

- **BUGFIX:**: Custom check definition attributes are now included in check
  request payloads, fixing check attribute token substitution for pubsub checks.
  **Fixes: [#1360][gh-1360].**

- **BUGFIX:** Transport connectivity issues are now handled while querying the
  Transport for pipe stats for API /info and /health. **See: [#1367][gh-1367].**

## Core 0.25.4 Release Notes {#core-v0-25-4}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0254---2016-06-20)

**June 20, 2016** &mdash; Sensu Core version 0.25.4 has been released and is
available for immediate download. Please note the following improvements:

### CHANGES {#core-v0-25-4-changes}

- **BUGFIX**: Fixed a race condition in the Sensu API where the `@redis` and
  `@transport` objects were not initialized before serving API requests.

## Core 0.25.3 Release Notes {#core-v0-25-3}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0253---2016-06-17)

**June 17, 2016** &mdash; Sensu Core version 0.25.3 has been released and is
available for immediate download. Please note the following improvements:

### CHANGES {#core-v0-25-3-changes}

- **BUGFIX**: Fixed a condition where API process was unable to set CORS HTTP
	headers when the API had not been configured (i.e. no `"api": {}` definition
	in configuration).

## Core 0.25.2 Release Notes {#core-v0-25-2}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0253---2016-06-17)

**June 16, 2016** &mdash; Sensu Core version 0.25.2 has been released and is
available for immediate download. Please note the following improvements:

### CHANGES {#core-v0-25-2-changes}

- **BUGFIX**: The Sensu API now responds to HEAD requests for API GET
  routes.

- **BUGFIX**: The Sensu API now responds to unsupported HTTP request methods
  with a 404 (Not Found), i.e. PUT.

## Core 0.25.1 Release Notes {#core-v0-25-1}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0251---2016-06-14)

**June 14, 2016** &mdash; Sensu Core version 0.25.1 has been released and is
available for immediate download. Please note the following improvements:

### CHANGES {#core-v0-25-1-changes}

- **IMPROVEMENT**: the Sensu Core package now includes version 1.2 _and_ 1.3 of
	the Sensu Plugin gem. **Fixes [#1339][gh-1339].**

- **BUGFIX**: The Sensu API now sets the HTTP response header "Connection" to
	"close". Uchiwa was experiencing intermittent EOF errors. **Fixes
  [#1340][gh-1340].**

## Core 0.25.0 Release Notes {#core-v0-25-0}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0250---2016-06-13)

**June 13, 2016** &mdash; Sensu Core version 0.25.0 has been released and is
available for immediate download. Please note the following improvements:

### IMPORTANT {#core-v0-25-0-important}

This release includes potentially breaking, backwards-incompatible changes:

- The legacy/deprecated Sensu API singular resources (e.g. `/check/:check_name`
	instead of `/checks/:check_name`), have been removed. Singular resources were
	never documented and have not been used by most community tooling (e.g.
	Uchiwa) since the very early Sensu releases (circa 2011-2012).

### CHANGES {#core-v0-25-0-changes}

- **NEW**: [Built-in client de-registration][23]. Sensu client de-registration on
  graceful `sensu-client` process stop is now supported by the Sensu client
  itself (no longer depending on the package init script). The package init
  script-based de-registration functionality still remains, but is considered to
  be deprecated at this time and will be removed in a future release.

  Please note the following example client definition which enables built-in
  client de-registration (via the new client `deregister` definition attribute),
  and sets the deregistration event handler to `deregister_client` (via the new
  client `deregistration` definition attribute):

  {{< highlight json >}}
  {
    "client": {
      "name": "i-424242",
      "address": "8.8.8.8",
      "subscriptions": [
        "production",
        "webserver",
        "mysql"
      ],
      "deregister": true,
      "deregistration": {
        "handler": "deregister_client"
      },
      "socket": {
        "bind": "127.0.0.1",
        "port": 3030
      }
    }
  }
  {{< / highlight >}}

Please refer to the [Sensu client reference documentation][23] for additional
information on configuring the built-in Sensu client de-registration.
**Fixes [#1191][gh-1191], [#1305][gh-1305].**

- **NEW**: The Sensu API has been rewritten to use [EM HTTP Server][24], removing
  Rack and Thin as API runtime dependencies. The API no longer uses Rack async,
  making for cleaner HTTP request logic and much improved HTTP request and
  response logging. **Fixes [#1317][gh-1317].**

- **BUGFIX**: Fixed a critical bug in Sensu client `execute_check_command()`
  where a check result would contain a check command with client tokens
  substituted, potentially exposing sensitive/redacted client attribute values.

## Core 0.24.1 Release Notes {#core-v0-24-1}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0241---2016-06-07)

**June 7, 2016** &mdash; Sensu Core version 0.24.1 has been released and is
available for immediate download. Please note the following improvements:

- **BUGFIX:** Fixed a critical bug in Sensu server `resume()` which caused the
  server to crash when querying the state of the Sensu Transport connection
  before it had been initialized. **Resolves [#1321][gh-1321].**

- **IMPROVEMENT:** Updated references to unmatched tokens, i.e. check result
  output message, to better represent the new scope of token substitution.
  **Resolves [#1322][gh-1322].**

## Core 0.24.0 Release Notes {#core-v0-24-0}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0240---2016-06-06)

**June 6, 2016** &mdash; Sensu Core version 0.24.0 has been released and is
available for immediate download. Please note the following improvements:

### IMPORTANT {#core-v0-24-0-important}

This release includes potentially breaking, backwards-incompatible changes:

- Sensu [check aggregates][7] have been completely redesigned. Users who are
  using check aggregates may need to review these changes before upgrading.
  [Uchiwa][8] users should install version 0.15 or higher before upgrading to
  Sensu Core version 0.24.0. See below for additional information.

- Sensu [event `id`s][9] are no longer unique to each occurrence of an event.
  Event `id`s are now persistent for the duration of an event (per client/check
  pair), until the event is resolved. See below for additional information.

- The Sensu [/health (GET) API endpoint][10] has been updated such that failed
  health checks now respond with an [`412 (Precondition Failed)` HTTP response
  code][11] instead of a [`503 (Service Unavailable)` response code][12].
  Third-party services and/or custom scripts may need to be updated accordingly.

- The Sensu services and corresponding service management scripts have been
  updated to use the new `--validate_config` command line option which uses
  strong configuration validation (i.e. do not start if configuration is in an
  invalid state). See below for additional information.

### CHANGES {#core-v0-24-0-changes}

- **NEW:** Named aggregates. Check [aggregates 2.0][gh-1218] are here! At long last,
  Sensu [check aggregates][gh-1218] have been updated to support standalone checks, as
  well as a number of new use cases. Please refer to the [check aggregates
  reference documentation][8] for additional information. **Resolves [#803][gh-803],
  [#915][gh-915], [#1041][gh-1041], [#1070][gh-1070], [#1187][gh-1187], and [#1218][gh-1218].**

- **NEW:** Persistent [event IDs][9]. Event occurrences for a client/check pair
  will now have the same event ID until the event is resolved (instead of a
  unique event ID for each occurrence of an event). Please refer to the [Event
  specification reference documentation][13] for additional information.
  **Resolves [#1196][gh-1196].**

- **NEW:** Strong configuration validation. Added a new `--validate_config` CLI
  option/argument to cause Sensu to validate configuration settings and exit
  with the appropriate exit code (e.g. `2` for invalid). This feature is now
  used when restarting a Sensu service to first validate the new configuration
  before stopping the running service (i.e. to prevent restarts if the
  configuration is invalid). Please refer to the [Sensu service command line
  interface reference documentation][14] for additional information. **Resolves
  [#1244][gh-1244], [#1254][gh-1254].**

- **NEW:** Proxy check origins. Events for [proxy clients][15] will now have a
  check `origin` attribute, set to the client name of the result producer.
  Please refer to the [Event data specification reference documentation][16] for
  additional information. **Resolves [#1075][gh-1075].**

- **NEW:** Improved Sensu check token substitution. Sensu [check token
  substitution][17] is now supported in every check definition attribute value
  (no longer just the check `command` attribute). Please refer to the [check
  token substitution reference documentation][17] for additional information.
  **Resolves [#1281][gh-1281].**

- **NEW:** Sensu `/clients (POST)` API endpoint can now create clients in the
  client registry that are expected to produce keepalives, and validates clients
  with the Sensu Settings client definition validator. A new [check `keepalives`
  attribute][21] called has also been added, which allows client keepalives to
  be disabled on a per-client basis. **Resolves [#1203][gh-1203].**


- **IMPROVEMENT:** Configurable Sensu Spawn concurrent child process limit
  (checks, mutators, & pipe handlers). The default limit is still 12 and the
  EventMachine threadpool size is automatically adjusted to accommodate a larger
  limit. **Resolves [#1002][gh-1002].**

- **IMPROVEMENT:** Event data check type now explicitly defaults to `standard`.
  **Resolves [#1025][gh-1025].**

- **IMPROVEMENT:** Improved tracking of in progress check result processing,
  eliminates the potential for losing check results when restarting the Sensu
  server service. **Resolves [#1165][gh-1165].**

- **IMPROVEMENT:** Updated [Thin][18] (used by Sensu API) to the latest release,
  version 1.6.4. **Resolves [#1122][gh-1122].**

- **IMPROVEMENT:** [JrJackson][19] is now used to parse JSON when Sensu is
  running on JRuby.

- **IMPROVEMENT:** The Sensu API now listens immediately on service start, even
  before it has successfully connected to Redis and the Sensu Transport. It will
  now respond with a `500 (Internal Server Error)` HTTP response code and a
  descriptive error message when it has not yet initialized its connections or
  it is reconnecting to either Redis or the Sensu Transport. The [Health and
  Info API][20] endpoints will still respond normally while reconnecting.
  **Resolves [#1215][gh-1215].**

## Core 0.23.3 Release Notes {#core-v0-23-3}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0233---2016-05-26)

**May 26, 2016** &mdash; Sensu Core version 0.23.3 has been released and is
available for immediate download. Please note the following improvements:

- **IMPROVEMENT:** Fixed child process write/read deadlocks when writing to
  STDIN or reading from STDOUT/STDERR, when the data size exceeds the pipe
  buffers.

- **IMPROVEMENT:** Fixed child process spawn timeout deadlock, now using stdlib
  Timeout.

## Core 0.23.2 Release Notes {#core-v0-23-2}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0232---2016-04-25)

**April 25, 2016** &mdash; Sensu Core version 0.23.2 has been released and is
available for immediate download. Please note the following improvements:

- **IMPROVEMENT:** fixed client socket check result publishing when the client
has a signature. The client signature is now added to the check result payload,
making it valid (see: [#1182][gh-1182]).

## Core 0.23.1 Release Notes {#core-v0-23-1}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0231---2016-04-15)

**April 15, 2016** &mdash; Sensu Core version 0.23.1 has been released and is
available for immediate download. Please note the following improvements:

- **NEW:** a pure-Ruby EventMachine reactor is used when running on Solaris.

## Core 0.23.0 Release Notes {#core-v0-23-0}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0230---2016-04-04)

**April 4, 2016** &mdash; Sensu Core version 0.23.0 has been released and is
available for immediate download. Please note the following improvements:

- **NEW:** dropped support for Rubies < 2.0.0, as they have long been EOL
  and have proven to be a hindrance and security risk.

- **NEW:** the Sensu 0.23 packages use [Ruby 2.3][1].

- **NEW:** native support for [Redis Sentinel][2]. Sensu services can now be
  configured to query one or more instances of Redis Sentinel for a Redis
  master. This feature eliminates the last need for load balancing middleware
  (e.g. HAProxy) in highly available Sensu configurations. To configure Sensu
  services to use Redis Sentinel, hosts and ports of one or more Sentinel
  instances must be provided.

  Example Redis Sentinel configuration:

  {{< highlight json >}}
  {
    "sentinels": [
      {
        "host": "10.0.1.23",
        "port": 26479
      }
    ]
  }
  {{< / highlight >}}

  See the [Redis configuration documentation][3] for more information.

- **NEW:** Added a CLI option/argument to cause the Sensu service to print
  (output to STDOUT) its compiled configuration settings and exit. The CLI
  option is `--print_config` or `-P`.

  See the [Sensu CLI arguments][4] documentation for more information.

- **NEW:** Added token substitution to filter eval attributes, providing
  access to event data.

  Example filter eval token:

  {{< highlight json >}}
  {
    "filters": {
      "example_filter": {
        "attributes": {
          "occurrences": "eval: value > :::check.occurrences:::"
        }
      }
    }
  }
  {{< / highlight >}}

- **NEW:** native installer packages are now available for IBM AIX systems
  (sensu-client only).

- **NEW:** The pure Ruby EventMachine reactor is used when running on AIX.

- **IMPROVEMENT:** The Sensu Transport API has changed. Transports are now a
  deferrable, they must call `succeed()` once they have fully initialized. Sensu
  now waits for its transport to fully initialize before taking other actions.

- **IMPROVEMENT:** performance improvements. Dropped MultiJson in favour of
  Sensu JSON, a lighter weight JSON parser abstraction that supports platform
  specific parsers for Sensu Core and Enterprise. The Oj JSON parser is
  once again used for Sensu Core. Used [fast-ruby][5] and benchmarks as a guide
  to further changes.

- **IMPROVEMENT:** Using EventMachine 1.2.0, which brings several changes and
  improvements ([changelog][6]).

## 0.22.2 Release Notes {#v0-22-2}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0222---2016-03-16)

**March 16, 2016** &mdash; Sensu Core version 0.22.2 has been released and is
available for immediate download. Please note the following improvements:

- **BUGFIX:** FFI library loading no longer causes a load error on AIX &
  Solaris.

- Removed unused cruft from extension API `run()` and `safe_run()`. Optional
  `options={}` was never implemented in Sensu Core and event data `dup()` never
  provided the necessary protection that it claimed (only top level hash
  object).

## 0.22.1 Release Notes {#v0-22-1}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0221---2016-03-01)

**March 01, 2016** &mdash; Sensu Core version 0.22.1 has been released and is
available for immediate download. Please note the following improvements:

- Performance improvements. Using frozen constants for common values and
  comparisons. Reduced the use of block arguments for callbacks.

- Improved RabbitMQ transport channel error handling.

- Fixed client signatures inspection/comparison when upgrading from a previous
  release.

## 0.22.0 Release Notes {#v0-22-0}

Source: [GitHub.com](https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0220---2016-01-29)

**January 29, 2016** &mdash; Sensu Core version 0.22.0 has been released and is
available for immediate download. Please note the following improvements:

- **NEW:** Client registration events are optionally created and processed
  (handled, etc.) when a client is first added to the client registry. To enable
  this functionality, configure a `"registration"` handler definition on Sensu
  server(s), or define a client specific registration handler in the client
  definition, e.g. `{"client": "registration": {"handler": "debug"}}`.

- **NEW:** Client auto de-registration on sensu-client process stop is now
  supported by the Sensu package init script. Setting
  `CLIENT_DEREGISTER_ON_STOP=true` and `CLIENT_DEREGISTER_HANDLER=example` in
  `/etc/default/sensu` will cause the Sensu client to publish a check result to
  trigger the event handler named `"example"`, before its process stops.

- **NEW:** Added support for Sensu client signatures, used to sign client
  keepalive and check result transport messages, for the purposes of source
  (publisher) verification. The client definition attribute `"signature"` is used
  to set the client signature, e.g. `"signature": "6zvyb8lm7fxcs7yw"`. A client
  signature can only be set once, the client must be deleted from the registry
  before its signature can be changed or removed. Client keepalives and check
  results that are not signed with the correct signature are logged (warn) and
  discarded. This feature is NOT a replacement for existing and proven security
  measures.

- **NEW:** The Sensu plugin installation tool, `sensu-install`, will no longer
  install a plugin if a or specified version has already been installed.

- **NEW:** The Sensu client socket now supports UTF-8 encoding.

[?]: #
[github-changelog]: https://github.com/sensu/sensu/blob/master/CHANGELOG.md
<!-- 0.23 -->

[1]:  https://www.ruby-lang.org/en/news/2015/12/25/ruby-2-3-0-released/
[2]:  http://redis.io/topics/sentinel
[3]:  /sensu-core/0.29/reference/redis#redis-high-availability-configuration
[4]:  /sensu-core/0.29/reference/configuration#sensu-command-line-interfaces-and-arguments
[5]:  https://github.com/JuanitoFatas/fast-ruby
[6]:  https://github.com/eventmachine/eventmachine/blob/master/CHANGELOG.md#1201-march-15-2016

<!-- 0.24 -->

[7]:  /sensu-core/0.29/reference/aggregates
[8]:  https://uchiwa.io/
[9]:  /sensu-core/0.29/reference/events#event-data-specification
[10]: /sensu-core/0.29/api/health-and-info#health-get
[11]: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.4.13
[12]: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html#sec10.5.4
[13]: /sensu-core/0.29/reference/events#event-data-specification
[14]: /sensu-core/0.29/reference/configuration#sensu-command-line-interfaces-and-arguments
[15]: /sensu-core/0.29/reference/clients#proxy-clients
[16]: /sensu-core/0.29/reference/events#check-attributes
[17]: /sensu-core/0.29/reference/checks#check-token-substitution
[18]: http://code.macournoyer.com/thin/
[19]: https://github.com/guyboertje/jrjackson
[20]: /sensu-core/0.29/api/health-and-info
[21]: /sensu-core/0.29/reference/clients#client-definition-specification

<!-- 0.25 -->

[22]: https://github.com/sensu/sensu/blob/master/CHANGELOG.md#0250---2016-06-13
[23]: /sensu-core/0.29/reference/clients#deregistration-attributes
[24]: https://github.com/alor/em-http-server

<!-- 0.26 -->

[25]: /sensu-core/0.29/reference/checks#subdue-attributes
[26]: /sensu-core/0.29/reference/handlers#subdue-attributes
[27]: /sensu-core/0.29/reference/filters#when-attributes
[28]: /sensu-core/0.29/reference/extensions
[29]: /sensu-core/0.29/reference/aggregates
[30]: /sensu-core/0.29/reference/configuration#sensu-environment-variables
[31]: https://github.com/sensu-extensions/sensu-extensions-occurrences/
[32]: https://sensuapp.org/blog/2016/07/07/sensu-plugin-filter-deprecation.html
[33]: /sensu-core/0.29/api/silenced
[34]: /sensu-core/0.29/reference/handlers#handler-attributes

<!-- 0.27 -->

[35]: /sensu-core/0.29/platforms
[36]: https://github.com/sensu/sensu-omnibus
[37]: https://travis-ci.org
[38]: https://github.com/test-kitchen/test-kitchen
[39]: https://github.com/chef/chef
[40]: https://github.com/chef/omnibus
<!-- 0.28 -->

[41]: https://github.com/ohler55/oj
[42]: https://www.openssl.org/news/openssl-1.0.2-notes.html
<!-- 0.29 -->

[43]: https://github.com/sensu-plugins/sensu-plugin/blob/master/CHANGELOG.md#v200---2017-03-29
[44]: https://github.com/sensu-extensions/sensu-extensions-occurrences
[45]: https://github.com/sensu-extensions/sensu-extensions-check-dependencies
<!-- 1.0 -->

[46]: https://github.com/sensu-plugins/sensu-plugin/blob/master/CHANGELOG.md#v200---2017-03-29
[47]: https://github.com/sensu-extensions/sensu-extensions-occurrences
[48]: https://github.com/sensu-extensions/sensu-extensions-check-dependencies

<!-- 1.1 -->
[49]: https://github.com/sensu/sensu/blob/master/CHANGELOG.md#110---2017-09-27
[50]: https://github.com/sensu-plugins/sensu-plugin/blob/master/CHANGELOG.md#v200---2017-03-29
[51]: https://github.com/sensu-extensions/sensu-extensions-occurrences
[52]: https://github.com/sensu-extensions/sensu-extensions-check-dependencies
[53]: https://github.com/sensu/sensu/blob/master/CHANGELOG.md#111---2017-10-10
[54]: https://github.com/sensu/sensu/blob/master/CHANGELOG.md#112---2017-10-27
[55]: https://github.com/sensu/sensu/blob/master/CHANGELOG.md#113---2017-11-24

<!-- 1.2 -->
[56]: https://github.com/sensu/sensu/blob/master/CHANGELOG.md#120---2017-12-05

<!-- 1.3 -->
[57]: https://github.com/sensu/sensu/blob/master/CHANGELOG.md#130----2018-03-09

<!-- 1.4 -->
[58]: https://github.com/sensu/sensu/blob/master/CHANGELOG.md#140---2018-05-02
[59]: https://github.com/sensu/sensu/blob/master/CHANGELOG.md#141---2018-05-04
[60]: https://github.com/sensu/sensu/blob/master/CHANGELOG.md#142---2018-05-10
[61]: https://github.com/sensu/sensu/blob/master/CHANGELOG.md#143---2018-07-23

<!-- GH Issues/PR's -->

[gh-803]:  https://github.com/sensu/sensu/issues/803
[gh-861]:  https://github.com/sensu/sensu/issues/861
[gh-915]:  https://github.com/sensu/sensu/issues/915
[gh-1002]: https://github.com/sensu/sensu/issues/1002
[gh-1025]: https://github.com/sensu/sensu/issues/1025
[gh-1041]: https://github.com/sensu/sensu/issues/1041
[gh-1070]: https://github.com/sensu/sensu/issues/1070
[gh-1075]: https://github.com/sensu/sensu/issues/1075
[gh-1122]: https://github.com/sensu/sensu/issues/1122
[gh-1165]: https://github.com/sensu/sensu/issues/1165
[gh-1182]: https://github.com/sensu/sensu/issues/1182
[gh-1187]: https://github.com/sensu/sensu/issues/1187
[gh-1191]: https://github.com/sensu/sensu/pull/1191
[gh-1196]: https://github.com/sensu/sensu/issues/1196
[gh-1203]: https://github.com/sensu/sensu/issues/1203
[gh-1215]: https://github.com/sensu/sensu/issues/1215
[gh-1218]: https://github.com/sensu/sensu/issues/1218
[gh-1244]: https://github.com/sensu/sensu/issues/1244
[gh-1254]: https://github.com/sensu/sensu/issues/1254
[gh-1281]: https://github.com/sensu/sensu/issues/1281
[gh-1282]: https://github.com/sensu/sensu/issues/1282
[gh-1286]: https://github.com/sensu/sensu/issues/1286
[gh-1305]: https://github.com/sensu/sensu/pull/1305
[gh-1317]: https://github.com/sensu/sensu/issues/1317
[gh-1321]: https://github.com/sensu/sensu/issues/1321
[gh-1322]: https://github.com/sensu/sensu/issues/1322
[gh-1327]: https://github.com/sensu/sensu/issues/1327
[gh-1339]: https://github.com/sensu/sensu/issues/1339
[gh-1340]: https://github.com/sensu/sensu/issues/1340
[gh-1342]: https://github.com/sensu/sensu/issues/1342
[gh-1356]: https://github.com/sensu/sensu/issues/1356
[gh-1358]: https://github.com/sensu/sensu/pull/1358
[gh-1360]: https://github.com/sensu/sensu/issues/1360
[gh-1361]: https://github.com/sensu/sensu/issues/1361
[gh-1362]: https://github.com/sensu/sensu/issues/1362
[gh-1367]: https://github.com/sensu/sensu/pull/1367
[gh-1368]: https://github.com/sensu/sensu/issues/1368
[gh-1370]: https://github.com/sensu/sensu/pull/1370
[gh-1372]: https://github.com/sensu/sensu/pull/1372
[gh-1379]: https://github.com/sensu/sensu/pull/1379
[gh-1384]: https://github.com/sensu/sensu/pull/1384
[gh-1394]: https://github.com/sensu/sensu/pull/1394
[gh-1405]: https://github.com/sensu/sensu/issues/1405
[gh-1411]: https://github.com/sensu/sensu/pull/1411
[gh-1415]: https://github.com/sensu/sensu/pull/1415
[gh-1416]: https://github.com/sensu/sensu/issues/1416
[gh-1417]: https://github.com/sensu/sensu/pull/1417
[gh-1419]: https://github.com/sensu/sensu/pull/1419
[gh-1427]: https://github.com/sensu/sensu/pull/1427
[gh-1428]: https://github.com/sensu/sensu/pull/1428
