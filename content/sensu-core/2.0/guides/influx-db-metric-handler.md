---
title: "How to populate InfluxDB metrics using handlers"
linkTitle: "Storing Metrics with InfluxDB"
weight: 125
version: "2.0"
product: "Sensu Core"
platformContent: false
menu:
  sensu-core-2.0:
    parent: guides
---

## What are Sensu handlers?

Sensu event handlers are actions executed by the Sensu server on [events][1].
In this example, we'll use a handler to populate a time series database. If
you're not totally comfortable with handlers yet, check out the in-depth
guide on [handlers][9] first!

## Using a handler to populate InfluxDB

The purpose of this guide is to help you populate Sensu metrics into the time
series database [InfluxDB][2]. Metrics can be collected from [check output][10]
or from the [Sensu StatsD Server][3].

### Installing the handler command

The first thing you'll want to do is create an executable script named
`sensu-influxdb-handler`, which will be responsible for populating a configurable
InfluxDB with Sensu metrics. The source code and installation instructions of
this script is available on [GitHub][4]. You can also download the binaries
directly from [releases][11].

### Creating the handler

Now that our handler command is installed, the second step is to create a
handler that we will call `influx-db`, which is a **pipe** handler that pipes
event data into our previous script named `sensu-influxdb-handler`. We will also
pass the database name, address, username, and password of the InfluxDB you wish
to populate.

{{< highlight shell >}}
sensuctl handler create influx-db \
--type pipe \
--command "sensu-influxdb-handler \
--addr 'http://123.4.5.6:8086' \
--db-name 'myDB' \
--username 'foo' \
--password 'bar'"
{{< /highlight >}}

### Assigning the handler to an event

With the `influx-db` handler now created, it can be assigned to a check for
[check output metric extraction][10]. In this example, the check name is
`collect-metrics`:

{{< highlight shell >}}
sensuctl check set-output-metric-handlers collect-metrics influx-db
{{< /highlight >}}

And/or, the handler can be assigned to the [Sensu StatsD Listener][3] to pass
all StatsD metrics into InfluxDB:

{{< highlight shell >}}
sensu-agent --statsd-event-handlers influx-db
{{< /highlight >}}

### Validating the handler

It might take a few moments once the handler is assigned to the check or StatsD
server, for Sensu to receive the metrics, but once an event is handled, you
should start to see your InfluxDB being populated! Otherwise, you can verify the
proper behavior of this handler by using `sensu-backend` logs. The default
location of these logs varies based on the platform used, but the
[installation and configuration][8] documentation provides this information.

Whenever an event is being handled, a log entry is added with the message
`"handler":"influx-db","level":"debug","msg":"sending event to handler"`,
followed by a second one with the message `"msg":"pipelined executed event pipe
handler","output":"","status":0`.

## Next steps

You now know how to apply a handler to metrics and take action on events. From
this point, here are some recommended resources:

* Read the [handlers reference][9] for in-depth documentation on handlers.
* Read the [statsd listener guide][3] for instructions on how to aggregate
StatsD metrics in Sensu.
* Read the [check output metric extraction guide][10] to learn how to collect
and extract metrics using Sensu checks.

[1]: ../../reference/events/
[2]: https://github.com/influxdata/influxdb
[3]: ../aggregate-metrics-statsd/
[4]: https://github.com/sensu/sensu-influxdb-handler#installation
[5]: https://rakyll.org/cross-compilation/
[6]: https://golang.org/doc/install
[7]: https://en.wikipedia.org/wiki/PATH_(variable)
[8]: ../../getting-started/installation-and-configuration/#validating-the-services
[9]: ../../reference/handlers
[10]: ../extract-metrics-with-checks
[11]: https://github.com/sensu/sensu-influxdb-handler/releases
