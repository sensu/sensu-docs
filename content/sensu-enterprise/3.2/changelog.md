---
title: "CHANGELOG"
description: "Release notes for Sensu Enterprise"
product: "Sensu Enterprise"
version: "3.2"
weight: 1
menu: "sensu-enterprise-3.2"
---

_NOTE: Sensu Enterprise is built on Sensu Core. Sensu Core changes are documented in the [Sensu Core changelog][core-changelog]._

## Releases

- [Enterprise 3.2.0 Release Notes](#enterprise-v3-2-0)
- [Enterprise 3.1.0 Release Notes](#enterprise-v3-1-0)
- [Enterprise 3.0.3 Release Notes](#enterprise-v3-0-3)
- [Enterprise 3.0.2 Release Notes](#enterprise-v3-0-2)
- [Enterprise 3.0.1 Release Notes](#enterprise-v3-0-1)
- [Enterprise 3.0.0 Release Notes](#enterprise-v3-0-0)
- [Enterprise 2.8.3 Release Notes](#enterprise-v2-8-3)
- [Enterprise 2.8.2 Release Notes](#enterprise-v2-8-2)
- [Enterprise 2.8.1 Release Notes](#enterprise-v2-8-1)
- [Enterprise 2.8.0 Release Notes](#enterprise-v2-8-0)
- [Enterprise 2.7.0 Release Notes](#enterprise-v2-7-0)
- [Enterprise 2.6.6 Release Notes](#enterprise-v2-6-6)
- [Enterprise 2.6.5 Release Notes](#enterprise-v2-6-5)
- [Enterprise 2.6.4 Release Notes](#enterprise-v2-6-4)
- [Enterprise 2.6.3 Release Notes](#enterprise-v2-6-3)
- [Enterprise 2.6.2 Release Notes](#enterprise-v2-6-2)
- [Enterprise 2.6.1 Release Notes](#enterprise-v2-6-1)
- [Enterprise 2.6.0 Release Notes](#enterprise-v2-6-0)
- [Enterprise 2.5.2 Release Notes](#enterprise-v2-5-2)
- [Enterprise 2.5.1 Release Notes](#enterprise-v2-5-1)
- [Enterprise 2.5.0 Release Notes](#enterprise-v2-5-0)
- [Enterprise 2.4.0 Release Notes](#enterprise-v2-4-0)
- [Enterprise 2.3.1 Release Notes](#enterprise-v2-3-1)
- [Enterprise 2.3.0 Release Notes](#enterprise-v2-3-0)
- [Enterprise 2.2.0 Release Notes](#enterprise-v2-2-0)
- [Enterprise 2.1.0 Release Notes](#enterprise-v2-1-0)
- [Enterprise 2.0.0 Release Notes](#enterprise-v2-0-0)
- [Enterprise 1.14.7 Release Notes](#enterprise-v1-14-7)
- [Enterprise 1.14.6 Release Notes](#enterprise-v1-14-6)
- [Enterprise 1.14.5 Release Notes](#enterprise-v1-14-5)
- [Enterprise 1.14.4 Release Notes](#enterprise-v1-14-4)
- [Enterprise 1.14.3 Release Notes](#enterprise-v1-14-3)
- [Enterprise 1.14.2 Release Notes](#enterprise-v1-14-2)
- [Enterprise 1.14.1 Release Notes](#enterprise-v1-14-1)
- [Enterprise 1.14.0 Release Notes](#enterprise-v1-14-0)
- [Enterprise 1.13.0 Release Notes](#enterprise-v1-13-0)

## Enterprise 3.2.0 Release Notes {#enterprise-v3-2-0}

**October 10, 2018** &mdash; Sensu Enterprise version 3.2.0 has been
released and is available for immediate download. Please note the
following improvements:

### CHANGES {#enterprise-v3-2-0-changes}

- **NEW**: Sensu Enterprise 3.2 includes a built-in integration with TimescaleDB.
  See the [integration docs][timescale] to create a pipeline to store monitoring
  event metrics with TimescaleDB.

- **IMPROVEMENT**: The [InfluxDB][influx] and [OpsGenie][og] integrations now
  support custom tags specified in client and check definitions. See the Sensu
  Core reference docs to configure [check attributes][core-check-influx] and
  [client attributes][core-client-influx] for InfluxDB and [check attributes][core-check-opsgenie]
  and [client attributes][core-client-opsgenie] for OpsGenie.

- **IMPROVEMENT**: The [Graphite][graphite], [OpenTSDB][open], and [Wavefront][wave]
  integrations now provide more robust event handling with automated retries.
  Configure the `retry_limit` and `retry_delay` attributes to customize
  retry logic per integration or per contact.

- **IMPROVEMENT**: Sensu Enterprise 3.2 includes improved error messaging for
  a common issue with unsupported formats for private keys. See the
  [troubleshooting guide][troubleshooting-guide] for information about
  identifying and resolving this error.

- **BUGFIX**: Sensu Enterprise 3.2 fixes a bug in the VictorOps integration
  that prevented events in VictorOps from resolving due to an incorrect message
  type.

Built on [Sensu Core 1.5][core-v1-5-0]:

- **IMPROVEMENT**: The built-in check dependencies filter lets you
  reduce noise by only alerting for the root cause of a given failure.
  Sensu Core 1.5 gives you the option to specify check dependencies by subscription
  instead of by client, making this useful filter even more flexible.
  See the [filter reference doc](/sensu-core/1.5/reference/filters#check-dependencies-filter) for more information.

- **BUGFIX**: Improved validation for check results created using the
  results API and the client socket. Sensu now validates check result
  attributes with the same methods used to validate check definitions.

- **BUGFIX**: Fixed a bug in the Sensu package that impacted user and group
  creation on Linux. Sensu now checks for an existing “sensu” user and group
  against multiple providers.

- **BUGFIX**: Sensu packages now include Ruby 2.4.4. This includes a fix
  for a bug in Ruby 2.4.1 that impacted Sensu clients on AIX.

## Enterprise 3.1.0 Release Notes {#enterprise-v3-1-0}

**July 30, 2018** &mdash; Sensu Enterprise version 3.1.0 has been
released and is available for immediate download. Please note the
following improvements:

### CHANGES {#enterprise-v3-1-0-changes}

- **IMPROVEMENT**: The EC2 integration now supports cross-account access,
allowing you to use IAM-defined trust relationships to access a Sensu Enterprise
instance from EC2 clients across multiple AWS accounts. See the
[EC2 integration docs](../integrations/ec2#cross-account-access)
to learn about setting up cross-account access.

- **IMPROVEMENT**: The PagerDuty integration now supports PagerDuty Events API v2.
See the [PagerDuty integration docs](../integrations/pagerduty) to add a v2 API key to Sensu Enterprise.
No changes are required for existing v1 API integrations using a `service_key` attribute.

- **IMPROVEMENT**: Contact routing now lets you configure contacts that will receive alerts only for certain severities, giving you even more flexibility in handling and responding to alerts.
See the [contact routing docs](../contact-routing#severities) to configure contact severities.

- **IMPROVEMENT**: Built on [Sensu Core 1.4.3][core-v1-4-3].

## Enterprise 3.0.3 Release Notes {#enterprise-v3-0-3}

**July 20, 2018** &mdash; Sensu Enterprise version 3.0.3 has been
released and is available for immediate download. Please note the
following improvements:

### CHANGES {#enterprise-v3-0-3-changes}

- **BUGFIX**: A bug prevented Enterprise integrations from responding to
notification failures correctly. Integrations now have more robust handling for
contact notification failures.

## Enterprise 3.0.2 Release Notes {#enterprise-v3-0-2}

**July 3, 2018** &mdash; Sensu Enterprise version 3.0.2 has been
released and is available for immediate download. Please note the
following improvements:

### CHANGES {#enterprise-v3-0-2-changes}

- **BUGFIX**: A bug in the EC2 integration caused errors when
`instance_id` was provided in [client `ec2`
attributes][ec2-client-attr]. The integration now functions as expected
when these attributes are provided.

## Enterprise 3.0.1 Release Notes {#enterprise-v3-0-1}

**June 28, 2018** &mdash; Sensu Enterprise version 3.0.1 has been
released and is available for immediate download. Please note the
following improvements:

### CHANGES {#enterprise-v3-0-1-changes}

- **BUGFIX**: A bug in error logging for HTTP requests caused the log
  to describe errors as "unknown method to_hash" instead of providing insight
  into the actual HTTP response. Logs now include details of the HTTP
  response header in the error message.

- **BUGFIX**: A bug in the OpsGenie integration prevented Sensu Enterprise from
  creating alerts when the [client attribute][custom-client-attr]
  `environment` contained an array instead of a string. The
  integration now properly handles  `environment` values as a string
  or an array of strings.

## Enterprise 3.0.0 Release Notes {#enterprise-v3-0-0}

**June 11, 2018** &mdash; Sensu Enterprise version 3.0.0 has been
   released and is available for immediate download. Please note the
   following improvements:

### IMPORTANT {#enterprise-v3-0-0-important}

This release includes potentially breaking, backwards-incompatible
changes:

- The OpsGenie Integration has been updated for the v2 Alert API. **To
  continue using the Sensu Enterprise OpsGenie integration, you must
  upgrade to Sensu Enterprise 3.0 and update your Sensu Enterprise
  configuration for OpsGenie before June 30, 2018.**

- Sensu Enterprise now depends on OpenJDK 1.8. On some platforms,
  upgrading from OpenJDK 1.7 may require access to EPEL to provide
  this version.

See the [Sensu Enterprise 3.0 upgrading documentation][3-0-upgrade] for additional
details on these important changes.

### CHANGES {#enterprise-v3-0-0-changes}

- **IMPROVEMENT**: Built on [JRuby 9.1.17.0](http://jruby.org/2018/04/23/jruby-9-1-17-0.html)

- **IMPROVEMENT**: Built on [Sensu Core 1.4.2][core-v1-4-2].

- **IMPROVEMENT**: Log output from Enterprise integrations now provides
  additional context for debugging, including event data, event ID and contact 
  name.

- **IMPROVEMENT**: JIRA integration search queries are now scoped within the
  appropriate project, reducing overhead when searching the server for
  existing issues.

- **IMPROVEMENT**: OpsGenie integration now supports new v2 Alert API
  features like `visible_to` and `action` attributes. See the updated
  [OpsGenie integration documentation][opsgenie-integration-doc] for
  details.

- **BUGFIX**: OpsGenie integration now uses an `overwrite_quiet_hours` attribute
  instead of `overwrites_quiet_hours`. The singular form of this attribute
  is required to achieve the desired result of overriding alert filtering that would
  otherwise prevent OpsGenie from notifying recipient(s) during their configured quiet
  hours.

- **BUGFIX**: EC2 integration now works in regions which accept only
  AWS Signature V4.

- **BUGFIX**: Enterprise integrations now gracefully handle the
  failure of individual contact notifications.

- **NEW**: Sensu Enterprise now supports running in API-only mode,
  making it possible to deploy Sensu Enterprise API instances
  which will not process events from transport queues. See [Sensu
  Enterprise
  configuration](/sensu-enterprise/3.0/configuration/#sensu-enterprise-command-line-interfaces-and-arguments)
  for details.

## Enterprise 2.8.3 Release Notes {#enterprise-v2-8-3}

**March 7, 2018** &mdash; Sensu Enterprise version 2.8.3 has been
	released and is available for immediate download. Please note the
	following improvements:

### CHANGES {#enterprise-v2-8-3-changes}

- **IMPROVEMENT**: Added context to JIRA integration log events, including
event/event_id and contact name.

- **BUGFIX**: Fixed an OpsGenie integration bug, now adding a contact name prefix to
OpsGenie alert aliases so alerts are deduplicated per contact.

## Enterprise 2.8.2 Release Notes {#enterprise-v2-8-2}

**February 9, 2018** &mdash; Sensu Enterprise version 2.8.2 has been
	released and is available for immediate download. Please note the
	following improvements:

### CHANGES {#enterprise-v2-8-2-changes}

- **SECURITY FIX:** Built on Sensu Core 1.2.1 to address [CVE-2018-1000060](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-1000060).

## Enterprise 2.8.1 Release Notes {#enterprise-v2-8-1}

**January 24, 2018** &mdash; Sensu Enterprise version 2.8.1 has been
	released and is available for immediate download. Please note the
	following improvements:

### CHANGES {#enterprise-v2-8-1-changes}

- **BUGFIX**: The OpsGenie alerting integration was accumulating additional
  tags for every event handled. One symptom of this behavior would be seeing
  alerts tagged with multiple severities. OpsGenie alert tags will now be
  unique to the Sensu. event they represent.

## Enterprise 2.8.0 Release Notes {#enterprise-v2-8-0}
**December 18, 2017** &mdash; Sensu Enterprise version 2.8.0 has been released and is
available for immediate download. Please note the following improvements:

### CHANGES {#enterprise-v2-8-0-changes}

- **IMPROVEMENT**: Built on [Sensu Core 1.2.0][core-v1-2-0].

- **IMPROVEMENT**: The InfluxDB and Graphite integrations now support
	event annotations, for adding Sensu event context to graphs. Any
	check, even those that do not produce metrics, can now use the
	"influxdb" and "graphite" event handlers to record their events in
	the respective time-series database.

- **IMPROVEMENT**: The Slack integration now supports using an ERB
	template for notification Slack attachment text, e.g. `"filters":
	{"text": "/etc/sensu/slack_text.erb"}`.

- **IMPROVEMENT**: The Email integration now supports HTML body content,
	with a configurable email content type, e.g. `"content_type":
	"text/html"`.

- **IMPROVEMENT**: The InfluxDB, OpenTSDB, and Wavefront integrations now
	support configurable tags, which get added to every metric point,
	e.g `"tags": {"dc": "us-central-1"}`

- **IMPROVEMENT**: The Event Stream integration now supports filtering OK
	keepalives, e.g. `"filter_ok_keepalives": true`.

## Enterprise 2.7.0 Release Notes {#enterprise-v2-7-0}

**November 20, 2017** &mdash; Sensu Enterprise version 2.7.0 has been released 
and is available for immediate download. Please note the following 
improvements: 

### CHANGES {#enterprise-v2-7-0-changes}

- **IMPROVEMENT**: Now built on [Sensu Core 1.1.2][core-v1-1-2]

- **IMPROVEMENT**: Integrations now include event data in logged error messages.

- **BUGFIX**: Integrations now use the configured value for `api.bind` setting 
  when using the API. 

## Enterprise 2.6.6 Release Notes {#enterprise-v2-6-6}

**October 27, 2017** &mdash; Sensu Enterprise version 2.6.6 has been released 
and is available for immediate download. Please note the following 
improvements: 

### CHANGES {#enterprise-v2-6-6-changes}

- **BUGFIX**: API /metrics endpoint no longer returns a 404 for missing 
  metrics, instead responding with an empty set. 

## Enterprise 2.6.5 Release Notes {#enterprise-v2-6-5}

**October 17, 2017** &mdash; Sensu Enterprise version 2.6.5 has been released 
and is available for immediate download. Please note the following 
improvements: 

### CHANGES {#enterprise-v2-6-5-changes}

- **IMPROVEMENT**: Now built on [Sensu Core 1.0.4][core-v1-0-4]

- **IMPROVEMENT**: Service scripts now honor `SENSU_OPTS` environment variable 
  for appending Sensu command line arguments when running Sensu Enterprise. 

## Enterprise 2.6.4 Release Notes {#enterprise-v2-6-4}

**October 15, 2017** &mdash; Sensu Enterprise version 2.6.4 has been released 
and is available for immediate download. Please note the following 
improvements: 

### CHANGES {#enterprise-v2-6-4-changes}

- **IMPROVEMENT**: General performance improvements.

## Enterprise 2.6.3 Release Notes {#enterprise-v2-6-3}

**September 29, 2017** &mdash; Sensu Enterprise version 2.6.3 has been 
released and is available for immediate download. Please note the following 
improvements: 

### CHANGES {#enterprise-v2-6-3-changes}

- **IMPROVEMENT**: JIRA issue type is now configurable. See 
[JIRA integration documentation][jira-integration] for details. 

## Enterprise 2.6.2 Release Notes {#enterprise-v2-6-2}

**September 20, 2017** &mdash; Sensu Enterprise version 2.6.2 has been 
released and is available for immediate download. Please note the following 
improvements: 

### CHANGES {#enterprise-v2-6-2-changes}

- **IMPROVEMENT**: Now using JRuby 9.1.13.0 for bug fixes and performance 
  improvements. 

- **IMPROVEMENT**: The SNMP integration trap varbind value trim length is now 
  configurable, via the SNMP integration definition attribute 
  `"varbind_trim"`, e.g. `"varbind_trim": 300`. The default value is still 
  `100` characters. The network(s) UDP MTU dictates the maximum trap payload 
  size. 

## Enterprise 2.6.1 Release Notes {#enterprise-v2-6-1}

**September 12, 2017** &mdash; Sensu Enterprise version 2.6.1 has been 
released and is available for immediate download. Please note the following 
improvements: 

### CHANGES {#enterprise-v2-6-1-changes}

- **IMPROVEMENT**: The Hipchat integration can now send notifications directly 
  to a user. To send notifications to a specific user, instead of a room, use 
  the hipchat definition attribute `"user"`, e.g. `"user": "portertech"`. 

- **IMPROVEMENT**: Contact routing now supports disabling specific 
  integrations per contact, disabling the global configuration fallback. To 
  disable an integration for a contact, set its value to `false`, e.g. 
  `{"contacts": {"ops": {"email": false}}}`. 

## Enterprise 2.6.0 Release Notes {#enterprise-v2-6-0}

**July 27, 2017** &mdash; Sensu Enterprise version 2.6.0 has been released and 
is available for immediate download. Please note the following improvements: 

### CHANGES {#enterprise-v2-6-0-changes}

- **IMPROVEMENT**: Built on [Sensu Core 1.0.2][core-v1-0-2].

- **IMPROVEMENT**: Added support for contact routing to every metric 
  integration (e.g. InfluxDB, Graphite, OpenTSDB, etc.). 

- **IMPROVEMENT**: Sensu Enterprise now loads configuration and validates it 
  prior to reloading (SIGHUP). If configuration is determined to be invalid 
  prior to reloading, Sensu will report invalid configuration definitions, and 
  it will continue to run with its existing working configuration. 

- **IMPROVEMENT**: Using JRuby 9.1.12.0, for performance enhancements and bug 
  fixes. 

- **IMPROVEMENT**: Wavefront integration `prefix` option, supporting a custom 
  metric name prefix. 

- **IMPROVEMENT**: Added Enterprise version to API /info.

## Enterprise 2.5.2 Release Notes {#enterprise-v2-5-2}

**March 24, 2017** &mdash; Sensu Enterprise version 2.5.2 has been released 
and is available for immediate download. Please note the following 
improvements: 

### CHANGES {#enterprise-v2-5-2-changes}

- **IMPROVEMENT**: Built on [Sensu Core 0.28.5][core-v0-28-5].

- **IMPROVEMENT**: Improved OpsGenie integration API request debug logging. 

## Enterprise 2.5.1 Release Notes {#enterprise-v2-5-1}

**March 13, 2017** &mdash; Sensu Enterprise version 2.5.1 has been released 
and is available for immediate download. Please note the following 
improvements: 

### CHANGES {#enterprise-v2-5-1-changes}

- **IMPROVEMENT**: Built on [Sensu Core 0.28.4][core-v0-28-4].

## Enterprise 2.5.0 Release Notes {#enterprise-v2-5-0}

**February 24, 2017** &mdash; Sensu Enterprise version 2.5.0 has been released 
and is available for immediate download. Please note the following 
improvements: 

### CHANGES {#enterprise-v2-5-0-changes}

- **IMPROVEMENT**: Built on [Sensu Core 0.28.0][core-v0-28-0].

- **IMPROVEMENT**: Added OpenTSDB integration `prefix_source` and `prefix` 
  options. 

- **BUGFIX**: Contact routing array values now properly override the 
  configured default/global integration values. 

## Enterprise 2.4.0 Release Notes {#enterprise-v2-4-0}

**February 17, 2017** &mdash; Sensu Enterprise version 2.4.0 has been released 
and is available for immediate download. Please note the following 
improvements: 

### CHANGES {#enterprise-v2-4-0-changes}

- **IMPROVEMENT**: Built on [Sensu Core 0.27.1][core-v0-27-1].

## Enterprise 2.3.1 Release Notes {#enterprise-v2-3-1}

**January 31, 2017** &mdash; Sensu Enterprise version 2.3.1 has been released 
and is available for immediate download. Please note the following 
improvements: 

### CHANGES {#enterprise-v2-3-1-changes}

- **IMPROVEMENT**: The Slack integration now supports messages with up to 
  8,000 characters. 

## Enterprise 2.3.0 Release Notes {#enterprise-v2-3-0}

**January 25, 2017** &mdash; Sensu Enterprise version 2.3.0 has been released 
and is available for immediate download. Please note the following 
improvements: 

### CHANGES {#enterprise-v2-3-0-changes}

- **NEW**: Added Wavefront integration, send metrics to Wavefront in the 
  Wavefront Data Format. 

- **NEW**: The Hipchat integration now adds a "notify" attribute to trigger 
  HipChat user notifications. 

- **NEW**: The Email integration now supports custom templates for email 
  subject and body. 

- **NEW**: The Sensu Enterprise `output_format` mutator now supports two 
  additional metric formats: InfluxDB Line Protocol, and the Wavefront Data 
  Format. 

- **IMPROVEMENT**: Now using JRuby 9.1.7.0 for bug fixes and improved performance.

## Enterprise 2.2.0 Release Notes {#enterprise-v2-2-0}

**January 12, 2017** &mdash; Sensu Enterprise version 2.2.0 has been released 
and is available for immediate download. Please note the following 
improvements: 

### CHANGES {#enterprise-v2-2-0-changes}

- **NEW**: Added JIRA integration, create and resolve issues for Sensu events. 

- **NEW**: Added Rollbar integration, create and resolve messages/items for 
  Sensu events. 

- **NEW**: The Slack integration now adds a "notification" field to 
  attachments when one is provided in the event check definition. 

- **IMPROVEMENT**: Metric integration metric format mutation performance 
  improvements. 

- **IMPROVEMENT**: Opsgenie integration now uses a different/improved HTTP 
  client. 

- **BUGFIX**: Opsgenie integration now uses a string for alert tags, multiple 
  tags are comma delimited. 

## Enterprise 2.1.0 Release Notes {#enterprise-v2-1-0}

**November 17, 2016** &mdash; Sensu Enterprise version 2.1.0 has been released 
and is available for immediate download. Please note the following 
improvements: 

### CHANGES {#enterprise-v2-1-0-changes}

- **NEW**: ServiceNow Event Management support, create ServiceNow events for 
  Sensu events. 

## Enterprise 2.0.0 Release Notes {#enterprise-v2-0-0}

**October 25, 2016** &mdash; Sensu Enterprise version 2.0.0 has been released 
and is available for immediate download. Please note the following 
improvements: 

### IMPORTANT {#enterprise-v2-0-0-important}

This Enterprise release is built upon [Sensu Core 0.26][core-v0-26-0],
which includes potentially breaking, backwards-incompatible changes. For
more information, please refer to the [Sensu Core 0.26.0 Important
Changes](#core-v0-26-0-important).

### CHANGES {#enterprise-v2-0-0-changes}

- **NEW**: Built on [Sensu Core version 0.26.5][core-v0-26-5].

## Enterprise 1.14.7 Release Notes {#enterprise-v1-14-7}

**July 28, 2016** &mdash; Sensu Enterprise version 1.14.4 has been released and
is available for immediate download. Please note the following improvements:

### CHANGES {#enterprise-v1-14-7-changes}

- **NEW**: Built on [Sensu Core version 0.25.6][core-v0-25-6].

## Enterprise 1.14.6 Release Notes {#enterprise-v1-14-6}

**July 26, 2016** &mdash; Sensu Enterprise version 1.14.4 has been released and
is available for immediate download. Please note the following improvements:

### CHANGES {#enterprise-v1-14-6-changes}

- **BUGFIX**: Added newline event delimiter to event stream integration.

## Enterprise 1.14.5 Release Notes {#enterprise-v1-14-5}

**July 20, 2016** &mdash; Sensu Enterprise version 1.14.5 has been released and
is available for immediate download. Please note the following improvements:

### CHANGES {#enterprise-v1-14-5-changes}

- **NEW**: Built on [Sensu Core version 0.25.5][core-v0-25-5]

## Enterprise 1.14.4 Release Notes {#enterprise-v1-14-4}

**June 30, 2016** &mdash; Sensu Enterprise version 1.14.4 has been released and
is available for immediate download. Please note the following improvements:

### CHANGES {#enterprise-v1-14-4-changes}

- **BUGFIX**: Use Java SecureRandom in lieu of JRuby SecureRandom to ensure UUID
  generation is non-blocking
- **BUGFIX**: Catch unexpected exceptions thrown by API HTTPHandler respond method

## Enterprise 1.14.3 Release Notes {#enterprise-v1-14-3}

**June 17, 2016** &mdash; Sensu Enterprise version 1.14.3 has been released and
is available for immediate download. Please note the following improvements:

### CHANGES {#enterprise-v1-14-3-changes}

- **NEW**: Built on [Sensu Core version 0.25.3][core-v0-25-3].

## Enterprise 1.14.2 Release Notes {#enterprise-v1-14-2}

**June 16, 2016** &mdash; Sensu Enterprise version 1.14.2 has been released and
is available for immediate download. Please note the following improvements:

### CHANGES {#enterprise-v1-14-2-changes}

- **IMPROVEMENT**: The Enterprise Email integration now uses TLSv1.2 for
  STARTTLS and supports additional SSL ciphers.

## Enterprise 1.14.1 Release Notes {#enterprise-v1-14-1}

**June 16, 2016** &mdash; Sensu Enterprise version 1.14.1 has been released and
is available for immediate download. Please note the following improvements:

### CHANGES {#enterprise-v1-14-1-changes}

- **NEW**: Built on [Sensu Core version 0.25.2][core-v0-25-2].

## Enterprise 1.14.0 Release Notes {#enterprise-v1-14-0}

**June 15, 2016** &mdash; Sensu Enterprise version 1.14.0 has been released and
is available for immediate download. Please note the following improvements:

### IMPORTANT {#enterprise-v1-14-0-important}

This release includes potentially breaking, backwards-incompatible changes:

- This is the first Sensu Enterprise release based on Sensu Core version 0.25.x.
  Please refer to the [Sensu Core version 0.25.0 release notes][core-v0-25-0] (below) for
  additional information on potentially breaking changes.

### CHANGES {#enterprise-v1-14-0-changes}

- **NEW**: Built on [Sensu Core version 0.25.1][core-v0-25-1].
- **IMPROVEMENT**: Significant Enterprise /metric API route performance
  improvements, reducing network IO, CPU, and memory utilization.
- **IMPROVEMENT**: Reduced Enterprise metric retention from 4 hours to 1 hour,
  as the Enterprise Console HUD currently only displays 30 minutes of data.

## Enterprise 1.13.0 Release Notes {#enterprise-v1-13-0}

**June 9, 2016** &mdash; Sensu Enterprise version 1.13.0 has been released and
is available for immediate download. Please note the following improvements:

### IMPORTANT {#enterprise-v1-13-0-important}

This release includes potentially breaking, backwards-incompatible changes:

- This is the first Sensu Enterprise release based on Sensu Core version 0.24.x.
  Please refer to the [Sensu Core version 0.24.0][core-v0-24-0] release notes for
  additional information on potentially breaking changes. This release requires
  Sensu Enterprise Dashboard 1.9.8 or higher. 

### CHANGES {#enterprise-v1-13-0-changes}

- **NEW:** Built on [Sensu Core 0.24.1][core-v0-24-1].

- **NEW:** Event Stream integration. The Sensu Enterprise "event stream"
  integration sends **all** Sensu events to a remote TCP socket for complex
  event processing (e.g. "stream processing") and/or long-term storage. Please
  refer to the [Event Stream integration reference documentation][event-stream-integration] for
  additional information.

- **NEW:** Graylog integration. The Sensu Enterprise Graylog integration
  sends Sensu events to a a Graylog Raw/Plaintext TCP input. Please refer to the
  [Graylog integration reference documentation][graylog-integration] for additional information.

- **IMPROVEMENT:** [ServiceNow integration][service-now-integration] adds support for configurable
  "incident table" name (previously hard-coded to `"incident"`), for
  organizations with customized ServiceNow configurations.

- **IMPROVEMENT:** Built on JRuby 9K.

[core-changelog]:  /sensu-core/1.2/changelog

<!-- 1.13 -->
[core-v0-24-0]: /sensu-core/1.0/changelog/#core-v0-24-0
[core-v0-24-1]: /sensu-core/1.0/changelog/#core-v0-24-1
[event-stream-integration]: ../integrations/event_stream
[graylog-integration]: ../integrations/graylog
[jira-integration]: ../integrations/jira
[service-now-integration]: ../integrations/servicenow

<!-- 1.14 -->
[core-v0-25-0]: /sensu-core/1.0/changelog/#core-v0-25-0
[core-v0-25-1]: /sensu-core/1.0/changelog/#core-v0-25-1
[core-v0-25-2]: /sensu-core/1.0/changelog/#core-v0-25-2
[core-v0-25-3]: /sensu-core/1.0/changelog/#core-v0-25-3
[core-v0-25-4]: /sensu-core/1.0/changelog/#core-v0-25-4
[core-v0-25-5]: /sensu-core/1.0/changelog/#core-v0-25-5
[core-v0-25-6]: /sensu-core/1.0/changelog/#core-v0-25-6

<!-- 2.0 -->
[core-v0-26-0]: /sensu-core/1.0/changelog/#core-v0-26-0
[core-v0-26-5]: /sensu-core/1.0/changelog/#core-v0-26-5

<!-- 2.4 -->
[core-v0-27-1]:  /sensu-core/1.0/changelog/#core-v0-27-1

<!-- 2.5 -->
[core-v0-28-0]:  /sensu-core/1.0/changelog/#core-v0-28-0
[core-v0-28-4]:  /sensu-core/1.0/changelog/#core-v0-28-4
[core-v0-28-5]:  /sensu-core/1.0/changelog/#core-v0-28-5

<!-- 2.6 -->
[core-v1-0-2]:  /sensu-core/1.0/changelog/#core-v1-0-2
[core-v1-0-4]:  /sensu-core/1.0/changelog/#core-v1-0-4

<!-- 2.7 -->
[core-v1-1-2]:  /sensu-core/1.1/changelog/#core-v1-1-2

<!-- 2.8 -->
[core-v1-2-0]:  /sensu-core/1.2/changelog/#core-v1-2-0

<!-- 3.0 -->
[core-v1-4-2]: /sensu-core/1.4/changelog/#core-v1-4-2
[opsgenie-integration-doc]: /sensu-enterprise/3.0/integrations/opsgenie
[3-0-upgrade]: /sensu-enterprise/3.0/upgrading
[custom-client-attr]: /sensu-core/1.4/reference/clients/#custom-attributes
[ec2-client-attr]: /sensu-core/1.4/reference/clients/#ec2-attributes

<!-- 3.1 -->
[core-v1-4-3]: /sensu-core/1.4/changelog/#core-v1-4-3

<!-- 3.2 -->
[core-v1-5-0]: /sensu-core/1.5/changelog/#core-v1-5-0
[timescale]: ../integrations/timescaledb
[troubleshooting-guide]: ../guides/troubleshooting
[core-check-influx]: /sensu-core/latest/reference/checks#influxdb-attributes
[core-client-influx]: /sensu-core/latest/reference/clients#influxdb-attributes
[core-check-opsgenie]: /sensu-core/latest/reference/checks#opsgenie-attributes
[core-client-opsgenie]: /sensu-core/latest/reference/clients#opsgenie-attributes
[og]: ../integrations/opsgenie
[influx]: ../integrations/influxdb
[graphite]: ../integrations/graphite
[wave]: ../integrations/wavefront
[open]: ../integrations/opentsdb
