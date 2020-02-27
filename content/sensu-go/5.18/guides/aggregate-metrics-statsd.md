---
title: "Aggregate metrics with the Sensu StatsD listener"
linkTitle: "Aggregate StatsD Metrics"
description: "StatsD allows you to measure anything and everything. To monitor application performance, collect custom metrics in your code and send them to a StatsD server. You can also monitor CPU, I/0, and network utilization with collection daemons. Sensu agents include a listener to send StatsD metrics to the event pipeline. Read the guide to get started."
weight: 50
version: "5.18"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.18:
    parent: guides
---

- [Use Sensu to implement StatsD](#use-sensu-to-implement-statsd)
- [Configure the StatsD listener](#configure-the-statsd-listener)
- [Next steps](#next-steps)

[StatsD][1] is a daemon, tool, and protocol that you can use to send, collect, and aggregate custom metrics.
Services that implement StatsD typically expose UDP port 8125 to receive metrics according to the line protocol `<metricname>:<value>|<type>`.

With StatsD, you can measure anything and everything.
Collect custom metrics in your code and send them to a StatsD server to monitor applicaton performance.
Monitor CPU, I/O, and network system levels with collection daemons.
You can feed the metrics that StatsD aggregates to multiple different backends to store or visualize the data.

## Use Sensu to implement StatsD

Sensu implements a StatsD listener on its agents.
Each `sensu-agent` listens on the default port 8125 for UDP messages that follow the StatsD line protocol.
StatsD aggregates the metrics, and Sensu translates them to Sensu metrics and events that can be passed to the event pipeline.
You can [configure the StatsD listener][4] and access it with the [netcat][4] utility command:

{{< highlight shell >}}
echo 'abc.def.g:10|c' | nc -w1 -u localhost 8125
{{< /highlight >}}

Metrics received through the StatsD listener are not stored in etcd.
Instead, you must configure event handlers to send the data to a storage solution (for example, a time-series database like [InfluxDB][3]).

{{% notice note %}}
**NOTE**: On Windows machines running Sensu, the StatsD UDP port is not supported.
Instead, the TCP port is exposed.
{{% /notice %}}

## Configure the StatsD listener

Use flags to configure the Sensu StatsD Server when you start up a `sensu-agent`.

The following flags allow you to configure event handlers, flush interval, address, and port:

{{< highlight shell >}}
--statsd-disable                      disables the statsd listener and metrics server
--statsd-event-handlers stringSlice   comma-delimited list of event handlers for statsd metrics
--statsd-flush-interval int           number of seconds between statsd flush (default 10)
--statsd-metrics-host string          address used for the statsd metrics server (default "127.0.0.1")
--statsd-metrics-port int             port used for the statsd metrics server (default 8125)
{{< /highlight >}}

For example:

{{< highlight shell >}}
sensu-agent start --statsd-event-handlers influx-db --statsd-flush-interval 1 --statsd-metrics-host "123.4.5.6" --statsd-metrics-port 8125
{{< /highlight >}}

## Next steps

Now that you know how to feed StatsD metrics into Sensu, check out these resources to learn how to handle the StatsD metrics:

* [Handlers reference][2]: in-depth documentation for Sensu handlers
* [InfluxDB handler guide][3]: instructions on Sensu's built-in metric handler

[1]: https://github.com/statsd/statsd
[2]: ../../reference/handlers/
[3]: ../influx-db-metric-handler/
[4]: #configure-the-statsd-listener
[5]: https://github.com/statsd/statsd
