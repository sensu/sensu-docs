---
title: "How to populate InfluxDB metrics using handlers"
linkTitle: "Storing Metrics with InfluxDB"
description: "Sensu event handlers are actions executed by the Sensu backend on events. This guide helps you populate Sensu metrics into the time series database InfluxDB. "
weight: 35
version: "5.11"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.11:
    parent: guides
---

## What are Sensu handlers?

Sensu event handlers are actions executed by the Sensu backend on [events][1].
In this example, we'll use a handler to populate a time series database. If
you're not totally comfortable with handlers yet, check out the in-depth
guide on [handlers][9] first!

## Using a handler to populate InfluxDB

The purpose of this guide is to help you populate Sensu metrics into the time
series database [InfluxDB][2]. Metrics can be collected from [check output][10]
or from the [Sensu StatsD Server][3].

### Registering the asset

[Assets][12] are shareable, reusable packages that make it easy to deploy Sensu plugins.
In this guide, we'll use the [Sensu InfluxDB handler asset][13] to power an `influx-db` handler.

You can use the following sensuctl example to register the [Sensu InfluxDB handler asset][13] for Linux AMD64, or you can download the latest asset definition for your platform from [Bonsai][13] and register the asset using `sensuctl create --file filename.yml`.

{{< highlight shell >}}
sensuctl asset create sensu-influxdb-handler --url "https://assets.bonsai.sensu.io/b28f8719a48aa8ea80c603f97e402975a98cea47/sensu-influxdb-handler_3.1.2_linux_amd64.tar.gz" --sha512 "612c6ff9928841090c4d23bf20aaf7558e4eed8977a848cf9e2899bb13a13e7540bac2b63e324f39d9b1257bb479676bc155b24e21bf93c722b812b0f15cb3bd"
{{< /highlight >}}

You should see a confirmation message from sensuctl.

{{< highlight shell >}}
Created
{{< /highlight >}}

### Creating the handler

Now we'll use sensuctl to create a handler called `influx-db` that pipes event data to InfluxDB using the `sensu-influxdb-handler` asset.
Edit the command below to include your database name, address, username, and password.
For more information about the Sensu InfluxDB handler, see the asset page in [Bonsai][13].

{{< highlight shell >}}
sensuctl handler create influx-db \
--type pipe \
--command "sensu-influxdb-handler -d sensu" \
--env-vars "INFLUXDB_ADDR=http://influxdb.default.svc.cluster.local:8086, INFLUXDB_USER=sensu, INFLUXDB_PASS=password" \
--runtime-assets sensu-influxdb-handler
{{< /highlight >}}

You should see a confirmation message from sensuctl.

{{< highlight shell >}}
Created
{{< /highlight >}}

### Assigning the handler to an event

With the `influx-db` handler now created, it can be assigned to a check for
[check output metric extraction][10]. In this example, the check name is
`collect-metrics`:

{{< highlight shell >}}
sensuctl check set-output-metric-handlers collect-metrics influx-db
{{< /highlight >}}

The handler can also be assigned to the [Sensu StatsD listener][3] at agent startup to pass
all StatsD metrics into InfluxDB:

{{< highlight shell >}}
sensu-agent start --statsd-event-handlers influx-db
{{< /highlight >}}

### Validating the handler

It might take a few moments once the handler is assigned to the check or StatsD
server, for Sensu to receive the metrics, but once an event is handled, you
should start to see your InfluxDB being populated! Otherwise, you can verify the
proper behavior of this handler by using `sensu-backend` logs.
See the [troubleshooting guide][8] for log locations by platform.

Whenever an event is being handled, a log entry is added with the message
`"handler":"influx-db","level":"debug","msg":"sending event to handler"`,
followed by a second one with the message `"msg":"pipelined executed event pipe
handler","output":"","status":0`.

## Next steps

You now know how to apply a handler to metrics and take action on events. From
this point, here are some recommended resources:

* Read the [handlers reference][9] for in-depth documentation on handlers.
* Read the [StatsD listener guide][3] for instructions on how to aggregate
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
[8]: ../troubleshooting
[9]: ../../reference/handlers
[10]: ../extract-metrics-with-checks
[11]: https://github.com/sensu/sensu-influxdb-handler/releases
[12]: ../../reference/assets
[13]: https://bonsai.sensu.io/assets/sensu/sensu-influxdb-handler
[14]: ../../sensuctl/reference#creating-resources
