---
title: "Events"
description: "The events reference guide."
weight: 1
version: "2.0"
product: "Sensu Core"
platformContent: true
menu:
  sensu-core-2.0:
    parent: reference
---

# Events

## Events

Sensu events are created to acknowledge that a check result has been received. Potentially noteworthy events may be processed by one or more event handlers to do things such as send an email, or invoke an automated action. Every Sensu event provides context, called “event data”, which contains information about the originating Sensu client and the corresponding check result.

### How are Sensu events created?

A Sensu Event is created every time a check result is processed by the Sensu server, regardless of the status indicated by the check result. An Event is created by collating data from the check result, the client registry and additional context added at the time of processing.

### Event actions

- **create:** Indicates a check result status change from zero to non-zero.
- **resolve:** Indicates a check result status change from a non-zero to zero.
- **flapping:** Indicates a rapid change in check result status.

### Viewing

To view all the events that are currently in history for a configuration, enter:

```sh
sensuctl event list
```

If you want more details on an event, the `info` subcommand can help you out. An event is identified by the entity ID and check name.

> sensuctl event info apollo-11 moon-landing
```sh
Entity:    apollo-11
Check:     moon-landing
Output:    WARNING - Unknown fuel status
Status:    1
History:   0,1,0,1,0
Timestamp: 1969-07-20 14:07:26 -0600 CST
```

### Manual Event Resolution

In Sensu 1.x, we offer manual event resolution through the POST /resolve endpoint. In Sensu 2.x, POST /events can do that and more!

If you want to use sensuctl to manually resolve an event, the `resolve` subcommand will resolve the output and set the status to 0.

> sensuctl event resolve apollo-11 moon-landing

> sensuctl event info apollo-11 moon-landing
```sh
Entity:    apollo-11
Check:     moon-landing
Output:    Resolved Manually by sensuctl
Status:    0
History:   0,1,0,1,0
Timestamp: 1969-07-20 14:10:32 -0600 CST
```
