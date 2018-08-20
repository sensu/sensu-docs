---
title: "How to aggregate metrics with the StatsD listener"
linkTitle: "Aggregating Metrics with StatsD"
weight: 120
version: "2.0"
product: "Sensu Core"
platformContent: false
menu:
  sensu-core-2.0:
    parent: guides
---

## What is StatsD?

StatsD, originating from the [daemon written by Etsy][1], is a daemon, tool,
and protocol that can be used to send, collect, and aggregate custom metrics.
Services that implement StatsD typically expose UDP port 8125 to receive metrics
according to the line protocol `<metricname>:<value>|<type>`.

## Why use StatsD?

StatsD allows you to measure anything and everything. You can monitor
application performance by collecting custom metrics in your code and sending
them to a StatsD server or you can monitor system levels of cpu, i/o, network
etc. with collection daemons. The metrics that StatsD aggregates can be fed to
multiple different backends to store or visualize the data.

## How does Sensu implement StatsD?

Sensu implements a StatsD listener on it's agents. Each `sensu-agent` will
listen on the default port 8125 for UDP messages which follow the StatsD line
protocol. StatsD aggregates the metrics, and Sensu translates them to Sensu
metrics and events to be passed to the event pipeline. The listener is
configurable (see "Configuring the StatsD listener") and can be accessed with
the simple netcat utility command:

{{< highlight shell >}}
echo "foo:1|c" | nc -u -w0 127.0.0.1 8125
{{< /highlight >}}

Metrics received through the StatsD listener are not stored in etcd, so
it is important to configure an event handler(s)!

_NOTE: On Windows machines running Sensu, the statsd UDP port is not supported,
rather the TCP port is exposed!_

### Configuring the StatsD listener

The Sensu StatsD Server is configured at the start-up of a `sensu-agent`. The
flags below allow you to configure the event handlers, flush interval, address,
and port:

{{< highlight shell >}}
--statsd-disable                      disables the statsd listener and metrics server
--statsd-event-handlers stringSlice   comma-delimited list of event handlers for statsd metrics
--statsd-flush-interval int           number of seconds between statsd flush (default 10)
--statsd-metrics-host string          address used for the statsd metrics server (default "127.0.0.1")
--statsd-metrics-port int             port used for the statsd metrics server (default 8125)
{{< /highlight >}}

For example:
{{< highlight shell >}}
sensu-agent --statsd-event-handlers influx-db --statsd-flush-interval 1 --statsd-metrics-host "123.4.5.6" --statsd-metrics-port 8125
{{< /highlight >}}

## Next steps

Now that you know how to feed StatsD metrics into Sensu, check out the following
resources to learn how to handle those metrics:

* Read the [handlers reference][2] for in-depth documentation on handlers.
* Read the [influx-db handler guide][3] for instructions on Sensu's built-in
metric handler.

[1]: https://github.com/etsy/statsd/
[2]: ../../reference/handlers
[3]: ../influx-db-metric-handler
