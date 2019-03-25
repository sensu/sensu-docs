---
title: "Sensu Enterprise Dashboard"
product: "Sensu Enterprise Dashboard"
version: "2.12"
description: "Sensu Enterprise Dashboard is a simple web-based application that provides realtime visibility into Sensu monitoring data, with dedicated views for monitoring events, clients, checks, aggregates, data centers, and more."
weight: 0
menu: "sensu-enterprise-dashboard-2.12"
layout: "single"
---

 [Learn about Sensu Go's built-in dashboard](/sensu-go/latest/dashboard/overview)

_NOTE: The time has come to announce our end of life schedule for the original version of Sensu: **Sensu Enterprise Dashboard 2.x will reach end of life on March 31, 2020**, over 8 years since Sensu Core's inception as an open source software project.
[Read our blog post](https://blog.sensu.io/eol-schedule-for-sensu-core-and-enterprise) for more information about what this means and helpful resources for upgrading to [Sensu Go](/sensu-go/latest/)._

## Reference Documentation

- [What is the Sensu Enterprise Dashboard?](#what-is-the-sensu-enterprise-dashboard)
  - [What is Uchiwa?](#what-is-uchiwa)
  - [What is the Sensu Enterprise Console?](#what-is-the-sensu-enterprise-console)
- [What is a Sensu "datacenter"?](#what-is-a-sensu-datacenter)


## What is the Sensu Enterprise Dashboard?

The Sensu Enterprise Dashboard is a simple web-based application that provides
realtime visibility into Sensu monitoring data, with dedicated views for
monitoring events, clients, checks, aggregates, data centers, and more. The
dashboard provides powerful global search features for filtering views so users
can focus on the data that's important to them. The dashboard also provides
basic operational controls to acknowledge or otherwise "silence" monitoring
events, request ad hoc execution of monitoring checks, and much more.

### What is Uchiwa?

The Sensu Enterprise Dashboard is based on the open-source &ndash; and
community developed &ndash; [Uchiwa][2] dashboard. Very much like the
relationship between Sensu Core and Sensu Enterprise, the Sensu Enterprise
Dashboard builds on top of Uchiwa via a number of added-value extensions (e.g.
[Role Based Access Controls][3]; [LDAP][4], [GitHub][5], and [GitLab][6]
authentication; [Audit Logging][7]; etc), which development also results in
many contributions to the open-source Uchiwa dashboard project.

### What is the Sensu Enterprise Console?

The [Sensu Enterprise Console][19] is a set of federated API endpoints provided by the Sensu
Enterprise Dashboard for API access to multiple [Sensu datacenters][1]
(available in Sensu Enterprise Dashboard version 1.10 and newer). This API
provides added-value features including token-based authentication and [granular
role-based access controls][16].

_NOTE: the Sensu Enterprise Dashboard is comprised of two components: a backend
service (API) for aggregating monitoring data from one or more [Sensu
datacenters][5], and a web application for displaying this information.
Prior to version 1.10, the Sensu Enterprise Dashboard backend used
different API routes for accessing data from specific datacenters; for example,
client data was accessible via `/clients/us-west-1/:client` instead of
`/clients/:client?dc=us-west-1`. Version 1.11 introduced access token-based
authentication, and version 1.12 introduced RBAC for the Console API._

## What is a Sensu "datacenter"?

The Sensu Enterprise Dashboard provides access to monitoring data from one or
more Sensu "datacenters". A Sensu datacenter is simply a Sensu API endpoint,
which corresponds to a Sensu installation consisting of one or more Sensu
servers in cluster (multiple API endpoints may be provided by a single Sensu
installation or cluster).


[1]:  #what-is-a-sensu-datacenter
[2]:  http://www.uchiwa.io
[3]:  rbac/overview
[4]:  rbac/rbac-for-ldap
[5]:  rbac/rbac-for-github
[6]:  rbac/rbac-for-gitlab
[7]:  rbac/audit-logging
[8]:  #dashboard-definition-specification
[9]:  /sensu-core/latest/reference/configuration#configuration-scopes
[10]: /sensu-core/latest/reference/configuration#configuration-merging
[11]: #auth-attributes
[12]: #audit-attributes
[13]: #ldap-attributes
[14]: #github-attributes
[15]: #gitlab-attributes
[16]: rbac/overview#rbac-for-the-sensu-enterprise-console-api
[17]: rbac/rbac-for-oidc
[18]: #oidc-attributes
[19]: api/overview
