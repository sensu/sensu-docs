---
title: "Monitor Sensu"
description: "Log Sensu services and monitor your Sensu backend with another Sensu backend to maintain visibility into your observability workflows."
product: "Sensu Go"
version: "6.11"
weight: 40
layout: "single"
toc: true
menu:
  sensu-go-6.11:
    parent: operations
    identifier: monitor-sensu
---

Use the guides and references in the Monitor Sensu category to successfully monitor your Sensu installation.

## Log Sensu services and monitor with Sensu

Learn how to [log Sensu services with systemd][1], including adding log forwarding from journald to syslog, using rsyslog to write logging data to disk, and setting up log rotation.

Read [Monitor Sensu with Sensu][2] to monitor the Sensu backend with another Sensu backend or cluster: use a secondary Sensu instance to notify you when your primary Sensu instance is down (and vice versa).

## Retrieve cluster health data

The [health reference][3] explains how to use Sensu’s /health API to ensure your backend is up and running and check the health of your etcd cluster members and PostgreSQL datastore resources.
Learn how to read the JSON response for /health API requests by reviewing examples of responses for clusters with healthy and unhealthy members and the response specification.

## Learn about Tessen

The [Tessen reference][4] explains the Sensu call-home service, which is enabled by default on Sensu backends and required for licensed Sensu instances.
We rely on anonymized Tessen data to understand how Sensu is being used and make informed decisions about product improvements.


[1]: log-sensu-systemd/
[2]: monitor-sensu-with-sensu/
[3]: health/
[4]: tessen/
