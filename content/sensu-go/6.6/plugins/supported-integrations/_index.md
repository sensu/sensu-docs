---
title: "Supported Integrations"
description: "Use Sensu plugins to integrate Sensu with your existing workflows for Sumo Logic, PagerDuty, Ansible, Chef, Jira, Elasticsearch, InfluxDB, and more."
product: "Sensu Go"
version: "6.6"
weight: 100
layout: "single"
toc: true
menu:
  sensu-go-6.6:
    parent: plugins
    identifier: supported-integrations
---

Sensu integrations include plugins, libraries, and runtimes that extend Sensu's functionality and allow you to automate your monitoring and observability workflows.
You can also rely on Sensu's integrations to get work done with Sensu as part of your existing workflows.

Integrations are service-specific and have different setup and configuration requirements.
Each integration has self-contained documentation with in-depth information about how to install and use it.
Many of the supported integrations include curated quick-start templates that you only need to edit to match your configuration.

Although this category focuses on our most popular supported integrations, you can find more supported-, Enterprise-, and community-tier integrations at [Bonsai, the Sensu asset hub][1].

## Alerting and incident management

- [Email][3]
- [Jira][4]
- [PagerDuty][5]
- [ServiceNow][6]
- [Slack][7]

## Auto-remediation

- [Ansible][8]
- [Rundeck][9]
- [SaltStack][10]

## Deregistration

- [Chef][11]
- [EC2][2]
- [Puppet][12]

## Time-series and long-term event storage

- [Elasticsearch][13]
- [Graphite][15]
- [InfluxDB][14]
- [OpenTSDB][16]
- [Prometheus][17]
- [Sumo Logic][20]
- [TimescaleDB][18]
- [Wavefront][19]


[1]: https://bonsai.sensu.io/
[2]: aws-ec2/
[3]: email/
[4]: jira/
[5]: pagerduty/
[6]: servicenow/
[7]: slack/
[8]: ansible/
[9]: rundeck/
[10]: saltstack/
[11]: chef/
[12]: puppet/
[13]: elasticsearch/
[14]: influxdb/
[15]: graphite/
[16]: opentsdb/
[17]: prometheus/
[18]: timescaledb/
[19]: wavefront/
[20]: sumologic/
