---
title: "What is Sensu?"
description: "What is Sensu"
product: "Sensu Core"
version: "1.1"
weight: 1
next: ../how-sensu-works
menu:
  sensu-core-1.1:
    parent: overview
---

## A Simple, Yet Powerful Framework

Sensu is a comprehensive monitoring solution that is powerful enough to solve
complex monitoring problems at scale, yet simple enough to use for traditional
monitoring scenarios and small environments. It achieves this broad appeal via
building upon two simple, yet powerful monitoring primitives: [Service
Checks][16] and [Event Processing][7]. These building blocks also provide an
infinitely extensible framework for composing monitoring solutions.

### What is a Service Check? {#service-checks}

Service checks allow you to monitor services (e.g. is Nginx running?) or measure
resources (e.g. how much disk space do I have left?). Service checks are
executed on machines running a monitoring agent (i.e. [Sensu client][17]).
Service checks are essentially commands (or scripts) that output data to
`STDOUT` or `STDERR` and produce an exit status code to indicate a state. Common
exit status codes used are 0 for OK, 1 for WARNING, 2 for CRITICAL, and 3 or
greater to indicate UNKNOWN or CUSTOM. Sensu checks use the same specification
as Nagios, therefore, Nagios check plugins may be used with Sensu. Service
checks produce results that are processed by the event processor (i.e. the Sensu
server).
You can learn more about how to reuse your existing Nagios checks with Sensu [here][19].

[Learn more >][17]

### What is Event Processing? {#event-processing}

Event processing (also called stream processing) is a method of analyzing
(processing) and storing streams of information (data) about things that happen
(events), deriving a conclusion from them, and potentially executing some action
(handling). The Sensu event processor (the Sensu server) enables you to execute
[Handlers][18] for taking action on events (produced by service checks),
such as sending an email alert, creating or resolving an incident (e.g. in
PagerDuty or ServiceNow), or storing metric data in a time-series database (e.g.
Graphite).

[Learn more >][18]


[7]:  #event-processing
[16]: #service-checks
[17]: ../../reference/clients/
[18]: ../../reference/handlers/
[19]: http://monitoringlove.sensu.io/nagios
