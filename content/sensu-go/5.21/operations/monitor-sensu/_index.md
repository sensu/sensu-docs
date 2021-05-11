---
title: "Monitor Sensu"
description: "Log Sensu services and monitor your Sensu backend with another Sensu backend to maintain visibility into your observability workflows."
product: "Sensu Go"
version: "5.21"
weight: 40
layout: "single"
toc: false
menu:
  sensu-go-5.21:
    parent: operations
    identifier: monitor-sensu
---

Use the guides in the Monitor Sensu category to successfully monitor your Sensu installation.

Learn how to [log Sensu services with systemd][1], including adding log forwarding from journald to syslog, using rsyslog to write logging data to disk, and setting up log rotation.

Read [Monitor Sensu with Sensu][2] to monitor the Sensu backend with another Sensu backend or cluster: use a secondary Sensu instance to notify you when your primary Sensu instance is down (and vice versa).


[1]: log-sensu-systemd/
[2]: monitor-sensu-with-sensu/
