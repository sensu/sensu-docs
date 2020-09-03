---
title: "Filter your observation data"
linkTitle: "Filter"
description: "The filter stage of the Sensu observability pipeline applies your specified conditions, triggers, and thresholds to your observability data in events. Learn how Sensu manages this element of the observability pipeline."
product: "Sensu Go"
version: "6.0"
weight: 50
layout: "single"
toc: false
menu:
  sensu-go-6.0:
    parent: observability-pipeline
    identifier: observe-filter
---

<!--Source at ADD LINK IF USED-->

**<button onclick="window.location.href='../observe-transform';">Next</button> or click any element in the pipeline to jump to it.**

**In the filter stage, Sensu executes [event filters][1]**.

The filter stage of the Sensu observability pipeline applies the conditions, triggers, and thresholds you specify in your [event filter][1] defintions to the events your checks generate.
Event filters give you control over which events continue through your pipeline and become alerts.
For example, use the [built-in is_incident event filter][7] to allow only high-priority events through your Sensu pipeline and reduce noise for operators.

To tell Sensu which event filters you want to apply, you list them in your [handler][2] definition.
Sensu compares your event data against the [expressions][6] in your event filters to determine whether each event should continue through the pipeline or be removed.
Any events that the filter doesn't remove from your pipeline will be [processed][3] according to your handler configuration.

Event filters can be [inclusive or exclusive][4], so you can require events to match or not match your filter expressions.
Sensu applies event filters in the order that they are listed in your handler definition.

As soon as an event filter removes an event from your pipeline because it does not meet the conditions, triggers, or thresholds you specified, the Sensu observability pipeline ceases analysis for the event.
Sensu will not [transform][5] or [process][3] events that your event filter removes from your pipeline.

Use [Bonsai][8], the Sensu asset index, to discover, download, and share Sensu event filter assets.
Read [Install plugins with assets][9] to get started.


[1]: filters/
[2]: ../observe-process/handlers/
[3]: ../observe-process/
[4]: filters/#inclusive-and-exclusive-event-filters
[5]: ../observe-transform/
[6]: ../observe-filter/filters#filter-expression-comparison
[7]: filters/#built-in-filter-is_incident
[8]: https://bonsai.sensu.io/
[9]: ../../guides/install-check-executables-with-assets/
