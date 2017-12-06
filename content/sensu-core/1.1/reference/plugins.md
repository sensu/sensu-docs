---
title: "Plugins"
description: "Reference documentation for Sensu Plugins."
product: "Sensu Core"
version: "1.1"
weight: 9
menu:
  sensu-core-1.1:
    parent: reference
---

## What is a Sensu plugin?

Sensu plugins provide executable scripts or other programs that can be used as
[Sensu checks][1] (i.e. to monitor server resources, services, and application
health, or collect & analyze metrics), [Sensu handlers][2] (i.e. to send
notifications or perform other actions based on [Sensu events][3]), or [Sensu
mutators][3] (i.e. to modify [event data][4] prior to handling).

For more about Sensu plugins, please refer to the [Plugins reference documentation][5].

[1]:  ../checks
[2]:  ../handlers
[3]:  ../events#event-data
[4]:  ../mutators
[5]:  ../../../../plugins/2.3/reference
