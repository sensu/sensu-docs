---
title: "Populate metrics in InfluxDB with handlers"
linkTitle: "Populate Metrics in InfluxDB"
description: "A Sensu event handler is an action the Sensu backend executes when a specific event occurs. This guide helps you use an event handler to populate Sensu metrics into the time series database InfluxDB."
weight: 70
version: "5.16"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.16:
    parent: guides
---

- [Use a handler to populate InfluxDB](#use-a-handler-to-populate-influxdb)
- [Next steps](#next-steps)

Sensu event handlers are actions executed by the Sensu backend on [events][1].
In this guide, you'll use a handler to populate the time series database [InfluxDB][2].
If you're not familiar with handlers, consider reading the [handlers reference][9] before continuing through this guide.

## Use a handler to populate InfluxDB

The example in this guide explains how to populate Sensu metrics into the time series database [InfluxDB][2].
Metrics can be collected from [check output][10] or the [Sensu StatsD Server][3].

### Register the asset

[Assets][12] are shareable, reusable packages that make it easier to deploy Sensu plugins.
This example uses the [Sensu InfluxDB Handler][13] asset to power an `influx-db` handler.

Use this sensuctl example to register the [Sensu InfluxDB Handler][13] asset for Linux AMD64 or download the latest asset definition for your platform from [Bonsai][13] and register the asset with `sensuctl create --file filename.yml`.

{{< highlight shell >}}
sensuctl asset create sensu-influxdb-handler --url "https://assets.bonsai.sensu.io/b28f8719a48aa8ea80c603f97e402975a98cea47/sensu-influxdb-handler_3.1.2_linux_amd64.tar.gz" --sha512 "612c6ff9928841090c4d23bf20aaf7558e4eed8977a848cf9e2899bb13a13e7540bac2b63e324f39d9b1257bb479676bc155b24e21bf93c722b812b0f15cb3bd"
{{< /highlight >}}

You should see a confirmation message from sensuctl:

{{< highlight shell >}}
Created
{{< /highlight >}}

### Create the handler

Now that you have registered the asset, you'll use sensuctl to create a handler called `influx-db` that pipes event data to InfluxDB with the `sensu-influxdb-handler` asset.
Edit the command below to include your database name, address, username, and password.
For more information about the Sensu InfluxDB handler, see [the asset page in Bonsai][13].

{{< highlight shell >}}
sensuctl handler create influx-db \
--type pipe \
--command "sensu-influxdb-handler -d sensu" \
--env-vars "INFLUXDB_ADDR=http://influxdb.default.svc.cluster.local:8086, INFLUXDB_USER=sensu, INFLUXDB_PASS=password" \
--runtime-assets sensu-influxdb-handler
{{< /highlight >}}

You should see a confirmation message from sensuctl:

{{< highlight shell >}}
Created
{{< /highlight >}}

### Assign the handler to an event

With the `influx-db` handler created, you can assign it to a check for [check output metric extraction][10]. 
In this example, the check name is `collect-metrics`:

{{< highlight shell >}}
sensuctl check set-output-metric-handlers collect-metrics influx-db
{{< /highlight >}}

You can also assign the handler to the [Sensu StatsD listener][3] at agent startup to pass all StatsD metrics into InfluxDB:

{{< highlight shell >}}
sensu-agent start --statsd-event-handlers influx-db
{{< /highlight >}}

### Validate the handler

It might take a few moments after you assign the handler to the check or StatsD server for Sensu to receive the metrics, but after an event is handled you should start to see metrics populating InfluxDB.
You can verify proper handler behavior with `sensu-backend` logs.
See [Troubleshooting][8] for log locations by platform.

Whenever an event is being handled, a log entry is added with the message `"handler":"influx-db","level":"debug","msg":"sending event to handler"`,
followed by a second log entry with the message `"msg":"pipelined executed event pipe
handler","output":"","status":0`.

## Next steps

Now that you know how to apply a handler to metrics and take action on events, here are a few other recommended resources:

* [Handlers reference][9]
* [Aggregate metrics with the Sensu StatsD listener][3]
* [Collect metrics with Sensu checks][10]

[1]: ../../reference/events/
[2]: https://github.com/influxdata/influxdb
[3]: ../aggregate-metrics-statsd/
[4]: https://github.com/sensu/sensu-influxdb-handler#installation
[8]: ../troubleshooting/
[9]: ../../reference/handlers/
[10]: ../extract-metrics-with-checks/
[11]: https://github.com/sensu/sensu-influxdb-handler/releases
[12]: ../../reference/assets/
[13]: https://bonsai.sensu.io/assets/sensu/sensu-influxdb-handler
