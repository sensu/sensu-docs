---
title: "Schedule observability data collection"
linkTitle: "Schedule"
description: "Sensu uses the publish/subscribe pattern of communication. The Sensu backend schedules checks for agents with matching subscriptions and publishes check execution requests to entities. Read this page to learn about scheduling in Sensu."
product: "Sensu Go"
version: "6.0"
weight: 30
layout: "single"
toc: true
menu:
  sensu-go-6.0:
    parent: observability-pipeline
    identifier: observe-schedule
---


<!--Source at ADD LINK IF USED-->

**<button onclick="window.location.href='../observe-filter';">Next</button> or click any element in the pipeline to jump to it.**

The Sensu agent is a lightweight process that runs on the infrastructure components you want to monitor and observe.
The agent registers with the Sensu backend as an [entity][3] with `type: "agent"`.
Agent entities are responsible for creating [status and metrics events][6] to send to the [backend event pipeline][2].

The Sensu backend manages check requests and event data: it schedules checks for agents with matching subscriptions and publishes check execution requests to entities.
Every Sensu backend includes an integrated structure for scheduling checks using subscriptions, an event processing pipeline that applies [event filters][15], [mutators][16], and [handlers][17], an embedded [etcd][10] datastore for storing configuration and state, a Sensu API, a [Sensu web UI][5], and the `sensu-backend` command line tool.

The Sensu agent is available for Linux, macOS, and Windows.
The Sensu backend is available for Ubuntu/Debian and RHEL/CentOS distributions of Linux.
Learn more in the [agent][11] and [backend][12] references.

Follow the [installation guide][1] to install the agent and backend.

## Subscriptions

Sensu uses the [publish/subscribe pattern of communication][13].
At the core of this model are Sensu subscriptions: transport topics to which the Sensu [backend][2] publishes check requests.
Sensu entities become subscribers to these topics via their individual `subscriptions` attribute.

Each Sensu agent's defined set of subscriptions determine which [checks][15] the agent will execute.
[Agent subscriptions][14] allow Sensu to request check executions on a group of systems at a time instead of a traditional 1:1 mapping of configured hosts to monitoring checks.

In each check's definition, you can specify which subscriptions should run the check.
At the same time, you "subscribe" your entities to these subscriptions.
Subscriptions make sure your entities automatically run the appropriate checks for their functionality.

Subscriptions typically correspond to a specific role or responsibility.
For example, you might add all the checks you want to run on your database entities to a `database` subscription.
Rather than specifying these checks individually for every database you are monitoring, you add the `database` subscription to your database entities and they run the desired checks automatically.

## Communication between the agent and backend

The Sensu agent uses [WebSocket][7] (ws) protocol to send and receive JSON messages with the Sensu backend.
For optimal network throughput, agents will attempt to negotiate the use of [Protobuf][9] serialization when communicating with a Sensu backend that supports it.
This communication is via clear text by default.

Follow [Secure Sensu][8] to configure the backend and agent for WebSocket Secure (wss) encrypted communication.


[1]: ../../operations/deploy-sensu/install-sensu/
[2]: backend/
[3]: ../observe-entities/
[5]: ../../web-ui/
[6]: ../observe-events/
[7]: https://en.m.wikipedia.org/wiki/WebSocket
[8]: ../../operations/deploy-sensu/secure-sensu/
[9]: https://en.m.wikipedia.org/wiki/Protocol_Buffers
[10]: https://etcd.io/docs
[11]: agent/
[12]: backend/
[13]: https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
[14]: ../observe-schedule/agent/#create-monitoring-events-using-service-checks
[15]: ../observe-schedule/checks/
[16]: ../observe-filter/filters/
[17]: ../observe-transform/mutators/
[18]: ../observe-process/handlers/
