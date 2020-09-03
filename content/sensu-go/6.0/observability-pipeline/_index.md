---
title: "Sensu Observability Pipeline"
linkTitle: "Observability Pipeline"
description: "Sensu's observability pipeline is a flexible, automated tool that gives you visibility into every part of your organization's infrastructure. Read this overview to learn how the observability pipeline works."
product: "Sensu Go"
version: "6.0"
weight: 10
layout: "single"
toc: false
menu:
  sensu-go-6.0:
    identifier: observability-pipeline
---

Sensu's observability pipeline is a flexible, automated tool that gives you visibility into every part of your organization's infrastructure.

The Sensu [agent][1] is a lightweight process that runs on the infrastructure components you want to observe.
Each agent is represented in Sensu as an [entity][2].
The Sensu [backend][1] schedules [checks][3] for agents to run on your infrastructure.
Agents receive check execution requests based on the agent subscriptions you specify.

The agent runs these checks on your infrastructure to gather observation data about your networking, compute resources, applications, and more .
[Events][3] contain the observation data that your checks gather, which might include entity status, metrics, or both, depending on your needs and configuration.

The agent sends events to the backend, which [filters][5], [transforms][6], and [processes][7] the data in your events with event filters, mutators, and handlers.

Sensu's observability pipeline delivers contextualized information and deeper insights so you can take targeted actions.
For example, Sensu can send entity status data in an email, Slack, or PagerDuty alert and transport metrics to storage in your Graphite, InfluxDB, or Prometheus databases.

**<button onclick="window.location.href='observe-entities';">Next</button> or click any element in the pipeline to jump to it.**

<!--Source at ADD LINK IF USED-->


[1]: observe-schedule/
[2]: observe-entities/
[3]: observe-schedule/
[5]: observe-filter/
[6]: observe-transform/
[7]: observe-process/
