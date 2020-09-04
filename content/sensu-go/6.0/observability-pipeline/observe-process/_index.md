---
title: "Process your observation data"
linkTitle: "Process"
description: "In the process stage of Sensu's observability pipeline, the Sensu backend executes handlers to take specific actions on your observation data, like sending incidents to a Slack channel or sending metrics to InfluxDB. Read this page to learn more about the process stage in the Sensu pipeline."
product: "Sensu Go"
version: "6.0"
weight: 70
layout: "single"
toc: false
menu:
  sensu-go-6.0:
    parent: observability-pipeline
    identifier: observe-process
---

<!--Source at ADD LINK IF USED-->

**<button onclick="window.location.href='../';">Back to start</button> or click any element in the pipeline to jump to it.**

**In the process stage, Sensu executes [handlers][1]**.

In the process stage of Sensu's observability pipeline, the Sensu backend executes [handlers][1] to take action on your observation data.
Your handler configuration determines what happens to the events that comes through your pipeline.
For example, your handler might route incidents to a specific Slack channel or PagerDuty notification workflow, or send metrics to InfluxDB or Prometheus.

Sensu also checks your handlers for the event filters and mutators to apply in the [filter][7] and [transform][8] stages.

A few different types of handlers are available in Sensu.
The most common are [pipe handlers][4], which work similarly to [checks][2] and enable Sensu to interact with almost any computer program via [standard streams][3].

You can also use [TCP/UDP handlers][5] to send your observation data to remote sockets and [handler sets][6] to streamline groups of actions to execute for certain types of events.

Discover, download, and share Sensu handler assets in [Bonsai][9], the Sensu asset hub
Read [Install plugins with assets][10] to get started.


[1]: handlers/
[2]: ../observe-schedule/checks/
[3]: https://en.wikipedia.org/wiki/Standard_streams
[4]: handlers/#pipe-handlers
[5]: handlers/#tcpudp-handlers
[6]: handlers/#handler-sets
[7]: ../observe-filter/
[8]: ../observe-transform/
[9]: https://bonsai.sensu.io/
[10]: ../../operations/deploy-sensu/use-assets-to-install-plugins/
