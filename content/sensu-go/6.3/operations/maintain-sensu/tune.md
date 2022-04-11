---
title: "Tune Sensu"
linkTitle: "Tune Sensu"
description: "Learn when and how to tune Sensu to resolve performance issues, with links to more detailed documentation."
weight: 25
version: "6.3"
product: "Sensu Go"
menu:
  sensu-go-6.3:
    parent: maintain-sensu
---

This page describes tuning options that may help restore proper operation if you experience performance issues with your Sensu installation.

{{% notice note %}}
**NOTE**: Before you tune your Sensu installation, read [Troubleshoot Sensu](../troubleshoot/), [Hardware requirements](../../deploy-sensu/hardware-requirements/), and [Deployment architecture for Sensu](../../deploy-sensu/deployment-architecture/).
These pages describe common problems and solutions, planning and optimization considerations, and other recommendations that may resolve your issue without tuning adjustments.
{{% /notice %}}

## Latency tolerances for etcd

If you use embedded etcd for storage, you might notice high network or storage latency.

To make etcd more latency-tolerant, increase the values for the [etcd election timeout][1] and [etcd heartbeat interval][2] backend configuration flags.
For example, you might increase `etcd-election-timeout` from 1000 to 5000 and `etcd-heartbeat-interval` from 100 to 500.

Read the [etcd tuning documentation][3] for etcd-specific tuning best practices.

## Advanced backend configuration options for etcd

The [backend reference][11] describes other advanced configuration flags in addition to etcd election timeout and heartbeat interval.

Adjust these values with caution.
Improper adjustment can increase memory and CPU usage or result in a non-functioning Sensu instance.

## Input/output operations per second (IOPS)

The speed with which write operations can be completed is important to Sensu cluster performance and health.
Make sure to provision Sensu backend infrastructure to provide sustained input/output operations per second (IOPS) appropriate for the rate of observability events the system will be required to process.

Read [Backend recommended configuration][12] and [Hardware sizing][13] for details.

## PostgreSQL settings

The [datastore reference][4] lists the PostgreSQL configuration parameters and settings we recommend as a starting point for your `postgresql.conf` file.
Adjust the parameters and settings as needed based on your hardware and performance observations.

Read the [PostgreSQL parameters documentation][5] for information about setting parameters.

## Agent reconnection rate

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the agent-rate-limit backend configuration flag in the packaged Sensu Go distribution. For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

It may take several minutes for all agents to reconnect after a sensu-backend restart, especially if you have a large number of agents.
The agent reconnection rate depends on deployment variables like the number of CPUs, disk space, network speeds, whether you're using a load balancer, and even physical distance between agents and backends.

Although many variables affect the agent reconnection rate, a reasonable estimate is approximately 100 agents per backend per second.
If you observe slower agent reconnection rates in your Sensu deployment, consider using the [agent-rate-limit][14] backend configuration flag.

The [agent-rate-limit][14] backend configuration flag allows you to set the maximum number of agent transport WebSocket connections per second, per backend.
Set the agent-rate-limit to 100 to improve agent reconnection rate and reduce the time required for all of your agents to reconnect after a backend restart.

## Splay and proxy check scheduling

Adjust the [`splay`][7] and [`splay_coverage`][8] check attributes to tune proxy check executions across an interval.
Read [Fine-tune proxy check scheduling with splay][9] for an example.

## Tokens and resource re-use

Tokens are placeholders in a check, hook, or dynamic runtime asset definition that the agent replaces with entity information before execution.
You can use tokens to fine-tune check, hook, and asset attributes on a per-entity level while reusing resource definitions.

Read the [tokens reference][10] for token syntax and examples.

## Occurrences and alert fatigue

Use the [`occurrences` and `occurrences_watermark` event attributes][6] in event filters to tune incident notifications and reduce alert fatigue.


[1]: ../../../observability-pipeline/observe-schedule/backend/#etcd-election-timeout
[2]: ../../../observability-pipeline/observe-schedule/backend/#etcd-heartbeat-interval
[3]: https://etcd.io/docs/latest/tuning/
[4]: ../../deploy-sensu/datastore/#postgresql-requirements
[5]: https://www.postgresql.org/docs/current/config-setting.html
[6]: ../../../observability-pipeline/observe-events/events/#occurrences-and-occurrences-watermark
[7]: ../../../observability-pipeline/observe-schedule/checks/#splay
[8]: ../../../observability-pipeline/observe-schedule/checks/#splay-coverage
[9]: ../../../observability-pipeline/observe-schedule/checks/#fine-tune-proxy-check-scheduling-with-splay
[10]: ../../../observability-pipeline/observe-schedule/tokens/
[11]: ../../../observability-pipeline/observe-schedule/backend/#advanced-configuration-options
[12]: ../../deploy-sensu/hardware-requirements/#backend-recommended-configuration 
[13]: ../../deploy-sensu/deployment-architecture/#hardware-sizing
[14]: ../../../observability-pipeline/observe-schedule/backend/#agent-rate-limit
