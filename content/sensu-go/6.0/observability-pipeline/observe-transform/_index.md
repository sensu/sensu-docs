---
title: "Transform your observation data"
linkTitle: "Transform"
description: "The transform stage of the Sensu observability pipeline executes mutators to transform your observation data into a format that other technologies can consume. Learn how Sensu manages data transformation in the observability pipeline."
product: "Sensu Go"
version: "6.0"
weight: 60
layout: "single"
toc: false
menu:
  sensu-go-6.0:
    parent: observability-pipeline
    identifier: observe-transform
---

<!--Source at ADD LINK IF USED-->

**<button onclick="window.location.href='../observe-process';">Next</button> or click any element in the pipeline to jump to it.**

**In the transform stage, Sensu executes [mutators][1]**.

The transform stage of the Sensu observability pipeline executes any [mutators][1] you have specified in your [handler][2] configuration to transform your event data so other technologies can consume it.
For example, if you're sending metrics to Graphite using a TCP handler, Graphite expects data that follows the Graphite plaintext protocol.
You can add Sensu's [built-in only_check_output mutator][4] to transform the data into the format Graphite can accept.

Here's how transform stage of the pipeline works: first, the Sensu backend receives an event and executes the [filter][3] stage of the observability pipeline.
If the event data meets the conditions, triggers, or thresholds you specified in your event filters, Sensu checks the handler for a mutator.
If the handler includes a mutator, the Sensu backend executes the mutator.

* If the mutator executes successfully (i.e. returns an exit status code of `0`), Sensu applies the mutator to transform the event data, returns the transformed event data to the handler, and executes the handler.
* If the mutator fails to execute (i.e. returns a non-zero exit status code or fails to complete within its configured timeout), Sensu logs an error and does not execute the handler.

Use [Bonsai][5], the Sensu asset index, to discover, download, and share Sensu mutator assets.
Read [Install plugins with assets][6] to get started.


[1]: mutators/
[2]: ../observe-process/handlers/
[3]: ../observe-filter/
[4]: mutators/#built-in-mutator-only_check_output
[5]: https://bonsai.sensu.io/
[6]: ../../guides/install-check-executables-with-assets/
