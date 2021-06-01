---
title: "Populate metrics in InfluxDB with handlers"
linkTitle: "Populate Metrics in InfluxDB"
description: "A Sensu event handler is an action the Sensu backend executes when a specific event occurs. This guide helps you use an event handler to populate Sensu metrics into the time-series database InfluxDB."
weight: 70
version: "5.21"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.21:
    parent: guides
---

A Sensu event handler is an action the Sensu backend executes when a specific [event][1] occurs.
In this guide, you'll use a handler to populate the time-series database [InfluxDB][2].
If you're not familiar with handlers, consider reading the [handlers reference][9] before continuing through this guide.

The example in this guide explains how to populate Sensu metrics into the time-series database [InfluxDB][2].
Metrics can be collected from [check output][10] or the [Sensu StatsD Server][3].

## Register the asset

[Assets][12] are shareable, reusable packages that make it easier to deploy Sensu plugins.
This example uses the [Sensu InfluxDB Handler][13] asset to power an `influx-db` handler.

Use [`sensuctl asset add`][5] to register the [Sensu InfluxDB Handler][13] asset:

{{< code shell >}}
sensuctl asset add sensu/sensu-influxdb-handler:3.1.2 -r influxdb-handler
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the asset: `influxdb-handler`.

You can also download the latest asset definition for your platform from [Bonsai][13] and register the asset with `sensuctl create --file filename.yml` or `sensuctl create --file filename.json`.

Run `sensuctl asset list --format yaml` or `sensuctl asset list --format json` to confirm that the asset is ready to use.

{{% notice note %}}
**NOTE**: Sensu does not download and install asset builds onto the system until they are needed for command execution.
Read [the asset reference](../../reference/assets#asset-builds) for more information about builds.
{{% /notice %}}

## Create the handler

Now that you have registered the asset, you'll use sensuctl to create a handler called `influx-db` that pipes event data to InfluxDB with the `sensu-influxdb-handler` asset.
Edit the command below to include your database name, address, username, and password.
For more information about the Sensu InfluxDB handler, see [the asset page in Bonsai][13].

{{< code shell >}}
sensuctl handler create influx-db \
--type pipe \
--command "sensu-influxdb-handler -d sensu" \
--env-vars "INFLUXDB_ADDR=http://influxdb.default.svc.cluster.local:8086, INFLUXDB_USER=sensu, INFLUXDB_PASS=password" \
--runtime-assets influxdb-handler
{{< /code >}}

You should see a confirmation message from sensuctl:

{{< code shell >}}
Created
{{< /code >}}

You can also create the handler definition in your monitoring-as-code repository:

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  created_by: admin
  name: influx-db
  namespace: default
spec:
  command: sensu-influxdb-handler -d sensu
  env_vars:
  - INFLUXDB_ADDR=http://influxdb.default.svc.cluster.local:8086
  - INFLUXDB_USER=sensu
  - INFLUXDB_PASS=password
  filters: null
  handlers: null
  runtime_assets:
  - influxdb-handler
  secrets: null
  timeout: 0
  type: pipe
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "created_by": "admin",
    "name": "influx-db",
    "namespace": "default"
  },
  "spec": {
    "command": "sensu-influxdb-handler -d sensu",
    "env_vars": [
      "INFLUXDB_ADDR=http://influxdb.default.svc.cluster.local:8086",
      "INFLUXDB_USER=sensu",
      "INFLUXDB_PASS=password"
    ],
    "filters": null,
    "handlers": null,
    "runtime_assets": [
      "influxdb-handler"
    ],
    "secrets": null,
    "timeout": 0,
    "type": "pipe"
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Assign the handler to an event

With the `influx-db` handler created, you can assign it to a check for check output metric extraction. 
For example, suppose you followed [Collect service metrics with Sensu checks][10] to create the check named `collect-metrics`.

Update the output metric format and output metric handlers to use the check with InfluxDB:

{{< code shell >}}
sensuctl check set-output-metric-format collect-metrics influxdb_line
sensuctl check set-output-metric-handlers collect-metrics influx-db
{{< /code >}}

You can also assign the handler to the [Sensu StatsD listener][3] at agent startup to pass all StatsD metrics into InfluxDB:

{{< code shell >}}
sensu-agent start --statsd-event-handlers influx-db
{{< /code >}}

## Next steps

Now that you know how to apply a handler to metrics and take action on events, here are a few other recommended resources:

* [Handlers reference][9]
* [Aggregate metrics with the Sensu StatsD listener][3]
* [Collect metrics with Sensu checks][10]

[1]: ../../reference/events/
[2]: https://github.com/influxdata/influxdb
[3]: ../aggregate-metrics-statsd/
[4]: https://github.com/sensu/sensu-influxdb-handler#installation
[5]: ../../sensuctl/sensuctl-bonsai/#install-asset-definitions
[8]: ../../operations/maintain-sensu/troubleshoot/
[9]: ../../reference/handlers/
[10]: ../extract-metrics-with-checks/
[11]: https://github.com/sensu/sensu-influxdb-handler/releases
[12]: ../../reference/assets/
[13]: https://bonsai.sensu.io/assets/sensu/sensu-influxdb-handler
