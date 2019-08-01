---
title: "Migrating to Sensu Go"
linkTitle: "Migrate to Sensu Go"
description: "This guide provides information for migrating your Sensu instance from Sensu Enterprise to Sensu Go."
version: "3.6"
weight: 1
menu: "sensu-enterprise-3.6"
product: "Sensu Enterprise"
---

This guide provides information for migrating your Sensu instance from Sensu Enterprise to Sensu Go.
Read the [blog post][49] to learn more about end-of-life for Sensu Enterprise.

<!-- TODO: Duplicate Sensu Core migration guide -->

## Translate Sensu Enterprise features

### Integrations

Most Sensu Enterprise integrations as available as Sensu Go assets.
See the [guide to installing plugins with assets][] to register assets with Sensu and update your Sensu Go handler definitions.
 
| Integration | Sensu Go asset |
| ----------- | -------------- |
Chef | https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-chef
Email | https://bonsai.sensu.io/assets/sensu/sensu-email-handler
Graphite | https://bonsai.sensu.io/assets/asachs01/sensu-plugins-graphite<br>https://bonsai.sensu.io/assets/nixwiz/sensu-go-graphite-handler
InfluxDB | https://bonsai.sensu.io/assets/sensu/sensu-influxdb-handler
IRC | https://bonsai.sensu.io/assets/sensu-utils/sensu-irc-handler
JIRA | https://bonsai.sensu.io/assets/sensu/sensu-jira-handler
PagerDuty | https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler
ServiceNow | https://bonsai.sensu.io/assets/sensu/sensu-servicenow-handler
Slack | https://bonsai.sensu.io/assets/sensu/sensu-slack-handler
SNMP | https://bonsai.sensu.io/assets/samroy92/sensu-plugins-snmp
VictorOps | https://bonsai.sensu.io/assets/asachs01/sensu-plugins-victorops

<!-- To add if available: -->
<!-- OpsGenie | -->
<!-- Graylog | -->
<!-- Flapjack | -->
<!-- Puppet | -->
<!-- EC2 | -->
<!-- Event Stream | -->
<!-- Rollbar | -->
<!-- Wavefront | -->
<!-- OpenTSDB | -->
<!-- Librato | -->
<!-- DataDog | -->
<!-- TimescaleDB | -->

### Contact routing

Contact routing is available in Sensu go using the has-contact filter asset.
See the [guide][] to set up contact routing in Sensu go using filters.

### Sensu Enterprise Dashboard collections

Sensu Go offers similar functionality to collections using advanced filtering in the Sensu Go web ui.
See the [web UI filtering docs][] for more information.

### Sensu Enterprise Dashboard datacenters

<!-- TODO: What's the status here? -->

[]: /sensu-go/latest/guide/contact-routing
[]: /sensu-go/latest/dashboard/filtering
