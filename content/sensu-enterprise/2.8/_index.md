---
title: "Sensu Enterprise"
product: "Sensu Enterprise"
version: "2.8"
weight: 1
menu: "sensu-enterprise-2.8"
layout: "single"
---

## Overview

- [What is Sensu Enterprise?](#what-is-sensu-enterprise)
- [Upgrading to Sensu Enterprise](#upgrading-to-sensu-enterprise)
- [Reference documentation](#reference-documentation)

## What is Sensu Enterprise?

[Sensu Enterprise][1] is a drop-in replacement for Sensu Core (the FREE, open
source version of Sensu), that provides added-value features like [contact
routing][2], several built-in [third-party integrations][3], and more. Sensu
Enterprise also includes FREE annual [training][4] and [enterprise-class
support][5].

We like to think of the distinction between Sensu Core and Sensu Enterprise as
the difference between a framework and a product. The purpose of this
documentation is to help Sensu Enterprise users configure their installation,
making use of the many third-party integrations and features Sensu Enterprise
has to offer. Sensu Enterprise integrates with third-party tools & services to
provide support for creating/resolving incidents, on-call rotation scheduling,
storing time series data (metrics), relaying events, deregistering sensu-clients
for terminated nodes, and/or notifying contacts via various media.

## Upgrading to Sensu Enterprise

Sensu Enterprise is designed to be a drop-in replacement for the Sensu Core
[server][6] and [API][7], so for users who are upgrading to Sensu Enterprise
from Sensu Core, no configuration changes are required to resume – simply
terminate the `sensu-server` and `sensu-api` processes, and start the
`sensu-enterprise` process to resume  operation of Sensu (see the [Sensu Server
and API installation guide][8] for  additional details). However, some
configuration changes may be required to take  advantage of certain third-party
integrations or added-value features (e.g. contact routing). Please refer to the
[Sensu Enterprise reference documentation][9] (below), for more
information.

## Reference documentation

- [Sensu Enterprise Configuration](configuration)
- [Sensu Enterprise Dashboard](dashboard)
  - [Role-based access controls](rbac/overview)
    - [RBAC for LDAP](rbac/rbac-for-ldap)
    - [RBAC for GitHub](rbac/rbac-for-github)
    - [RBAC for GitLab](rbac/rbac-for-gitlab)
  - [Audit Logging](rbac/audit-logging)
  - [Collections](collections)
  - [Heads up display](hud)
- [Sensu Enterprise API](api)
- [Contact routing](contact-routing)
- [Built-in handlers (integrations)](built-in-handlers)
  - [Email](integrations/email)
  - [PagerDuty](integrations/pagerduty)
  - [ServiceNow](integrations/servicenow)
  - [VictorOps](integrations/victorops)
  - [OpsGenie](integrations/opsgenie)
  - [Slack](integrations/slack)
  - [HipChat](integrations/hipchat)
  - [IRC](integrations/irc)
  - [SNMP](integrations/snmp)
  - [Graylog](integrations/graylog)
  - [Flapjack](integrations/flapjack)
  - [Puppet](integrations/puppet)
  - [Chef](integrations/chef)
  - [EC2](integrations/ec2)
  - [Event Stream](integrations/event_stream)
  - [Graphite](integrations/graphite)
  - [Librato](integrations/librato)
  - [OpenTSDB](integrations/opentsdb)
  - [InfluxDB](integrations/influxdb)
  - [DataDog](integrations/datadog)
- [Built-in filters](built-in-filters)


[1]:  /sensu-enterprise
[2]:  contact-routing
[3]:  built-in-handlers
[4]:  /training
[5]:  https://sensuapp.org/support
[6]:  /sensu-core/1.2/reference/server
[7]:  /sensu-core/1.2/api/overview
[8]:  installation/install-sensu-server-api#sensu-enterprise
[9]:  #reference-documentation
