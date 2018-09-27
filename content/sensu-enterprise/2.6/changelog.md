---
title: "CHANGELOG"
description: "Release notes for Sensu Enterprise"
product: "Sensu Enterprise"
version: "2.6"
weight: 1
menu: "sensu-enterprise-2.6"
---

_NOTE: Sensu Enterprise is built on Sensu Core. Sensu Core changes are documented in the [Sensu Core changelog][core-changelog]._

## Releases

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

<!-- core -->
[core-v0-26-0-important] /sensu-core/1.2/changelog/#core-v0-26-0-important