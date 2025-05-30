---
title: "Aggregate metrics with the Sensu StatsD listener"
linkTitle: "Aggregate StatsD Metrics"
guide_title: "Aggregate metrics with the Sensu StatsD listener"
type: "guide"
description: "Sensu agents include a StatsD listener you can use to send application performance, CPU, I/O, and network utilization metrics to your observability pipeline."
weight: 100
version: "6.13"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.13:
    parent: observe-process
---

Sensu implements a StatsD listener on its agents.
[StatsD][1] is a daemon, tool, and protocol that you can use to send, collect, and aggregate custom metrics.

With StatsD, you can measure anything and everything.
Collect custom metrics in your code and send them to a StatsD server to monitor applicaton performance.
Monitor CPU, I/O, and network system levels with collection daemons.
You can feed the metrics that StatsD aggregates to multiple different backends to store or visualize the data.

Services that implement StatsD typically expose UDP port 8125 to receive metrics according to the line protocol `<metricname>:<value>|<type>`.

## Configure the StatsD listener

Use configuration flags to configure the Sensu StatsD Server when you start up a Sensu agent.

The following flags allow you to configure event handlers, flush interval, address, and port:

{{< code text >}}
--statsd-disable                      disables the statsd listener and metrics server
--statsd-event-handlers stringSlice   comma-delimited list of event handlers for statsd metrics
--statsd-flush-interval int           number of seconds between statsd flush (default 10)
--statsd-metrics-host string          address used for the statsd metrics server (default "127.0.0.1")
--statsd-metrics-port int             port used for the statsd metrics server (default 8125)
{{< /code >}}

For example:

{{< code shell >}}
sensu-agent start --statsd-event-handlers influx-db --statsd-flush-interval 1 --statsd-metrics-host "123.4.5.6" --statsd-metrics-port 8125
{{< /code >}}

Each Sensu agent listens on the default port 8125 for UDP messages that follow the StatsD line protocol.
StatsD aggregates the metrics, and Sensu translates them to Sensu metrics and events that can be passed to the event pipeline.

## Access the StatsD listener

After you configure the StatsD listener, access it with the netcat utility command:

{{< code shell >}}
echo 'abc.def.g:10|c' | nc -w1 -u localhost 8125
{{< /code >}}

Metrics received through the StatsD listener are not stored in etcd.
Instead, you must configure event handlers to send the data to a storage solution (for example, a time-series database like InfluxDB).

## What's next

Now that you know how to feed StatsD metrics into Sensu, check out these resources to learn how to handle the StatsD metrics:

* [InfluxDB handler guide][3]: instructions for using Sensu's built-in metric handler
* [Handlers reference][2]: in-depth documentation for Sensu handlers
* [Pipelines reference][6]: information about the Sensu pipeline resource, which you can use to create event processing workflows with event filters, mutators, and handlers


[1]: https://github.com/statsd/statsd
[2]: ../handlers/
[3]: ../populate-metrics-influxdb/
[4]: https://nc110.sourceforge.io/
[6]: ../pipelines/
