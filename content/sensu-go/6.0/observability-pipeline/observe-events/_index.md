---
title: "Events"
linkTitle: "Events"
description: "Checks work with Sensu agents to let you monitor your infrastructure automatically and send observation data to the Sensu backend pipeline. Events are generic containers that Sensu uses to provide context for checks and metrics. Read this page to learn more about Sensu checks and events."
product: "Sensu Go"
version: "6.0"
weight: 20
layout: "single"
toc: true
menu:
  sensu-go-6.0:
    parent: observability-pipeline
    identifier: observe-events
---

<!--Source at ADD LINK IF USED -->

**<button onclick="window.location.href='../observe-schedule';">Next</button> or click any element in the pipeline to jump to it.**

Events are generic containers that Sensu uses to provide context to status and metrics check results.
The context, called observation data, is information about the originating entity and the corresponding status or metric check result.
These generic containers allow Sensu to handle different types of events in the pipeline.
Because events are polymorphic in nature, it is important to never assume their content (or lack of content).

Events require a timestamp, entity, and check.
Each event must contain a check result, whether [status][3] or [metrics][7].
In certain cases, an event can contain [both][8].

## Checks

Checks work with the Sensu [agent][11] to produce events automatically. You can use checks to monitor server resources, services, and application health as well as collect and analyze metrics.
Checks define how Sensu will process events, as well as when and where events are generated via [subscriptions and scheduling][12].

Read [Monitor server resources][1] to learn more about using checks to generate events.

## Status-only events

A Sensu event is created every time a check result is processed by the Sensu server, regardless of the status the result indicates.
The agent creates an event upon receipt of the check execution result and executes any configured [hooks][4] the check might have.
From there, the status result is forwarded to the Sensu backend, where it is filtered, transformed, and processed.
Potentially noteworthy events may be processed by one or more event handlers, for example to send an email or invoke an automated action.

## Metrics-only events

Sensu events can be created when the agent receives metrics through the [StatsD listener][5].
The agent will translate the StatsD metrics to Sensu metric format and place them inside an event.
Because these events do not contain checks, they bypass the store and are sent to the event pipeline and corresponding event handlers.

## Status and metrics events

Events that contain _both_ a check and metrics most likely originated from [check output metric extraction][6].
If a check is configured for metric extraction, the agent will parse the check output and transform it to Sensu metric format.
Both the check results and resulting (extracted) metrics are stored inside the event.
Event handlers from `event.Check.Handlers` and `event.Metrics.Handlers` will be invoked.

## Proxy entities and events

You can create events with proxy entities, which are dynamically created entities that Sensu adds to the entity store if an entity does not already exist for a check result.
Proxy entities allow Sensu to monitor external resources on systems where you cannot install a Sensu agent, like a network switch or website.
See [Monitor external resources][1] to learn how to use a proxy entity to monitor a website.

## Events API

Sensu's [events API][15] provides HTTP access to create, retrieve, update, and delete events.
If you create a new event that references an entity that does not already exist, the Sensu [backend][16] will automatically create a proxy entity when the event is published.


[1]: ../../observability-pipeline/observe-schedule/monitor-server-resources/
[2]: https://bonsai.sensu.io
[3]: #status-only-events
[4]: ../hooks/
[5]: ../../observability-pipeline/observe-process/aggregate-metrics-statsd/
[6]: ../../observability-pipeline/observe-schedule/extract-metrics-with-checks/
[7]: #metrics-only-events
[8]: #status-and-metrics-events
[9]: checks/#subscriptions
[10]: ../../operations/deploye-sensu/install-check-executables-with-assets/
[11]: ../observe-schedule/agent/
[12]: ../observe-schedule/
[13]: #events-api
[14]: ../observe-schedule/agent/#detect-silent-failures
[15]: ../../api/events/
[16]: ../observe-schedule/agent/
