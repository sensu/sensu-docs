---
title: "How to collect and extract metrics using Sensu checks"
linkTitle: "Collecting Service Metrics"
weight: 35
version: "5.1"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.1:
    parent: guides
---

## What are Sensu checks?

In short, Sensu checks are **commands** (or scripts), executed by the Sensu
agent, that output data and produce an exit code to indicate a state. If you are
unfamiliar with checks, or would like to learn how to configure one first,
take a look through the check [reference doc][1] and [guide][2] before you
continue.

## Extracting metrics from check output

In order to extract metrics from check output, you'll need to do the following:

1. Configure the check `command` such that the command execution outputs
metrics in one of the [supported output metric formats][3].
2. Configure the check `output_metric_format` to one of the
[supported output metric formats][3].
3. Configure the check `output_metric_handlers` (optional) to a Sensu handler
that is equipped to handle Sensu metrics (see [handlers][4] or
[influx-db handler][5] to learn more).

You can configure the check with these fields at creation, or use the commands
below assuming you have a check named `collect-metrics`. In this example,
we'll be using `graphite_plaintext` format and sending the metrics to a handler
named `influx-db`.

{{< highlight shell >}}
sensuctl check set-command collect-metrics collect_metrics.sh
sensuctl check set-output-metric-format collect-metrics graphite_plaintext
sensuctl check set-output-metric-handlers collect-metrics influx-db
{{< /highlight >}}

### Supported output metric formats

The output metric formats that Sensu currently supports for check output metric
extraction are nagios, influxdb, graphite, and opentsdb.

|nagios              |      |
---------------------|------
output_metric_format | `nagios_perfdata`
documentation        | [Nagios Performance Data][6]
example              | {{< highlight string >}}PING ok - Packet loss = 0%, RTA = 0.80 ms | percent_packet_loss=0, rta=0.80{{< /highlight >}}

|graphite            |      |
---------------------|------
output_metric_format | `graphite_plaintext`
documentation        | [Graphite Plaintext Protocol][7]
example              | {{< highlight string >}}local.random.diceroll 4 123456789{{< /highlight >}}

|influxdb            |      |
---------------------|------
output_metric_format | `influxdb_line`
documentation        | [InfluxDB Line Protocol][8]
example              | {{< highlight string >}}weather,location=us-midwest temperature=82 1465839830100400200{{< /highlight >}}

|opentsdb            |      |
---------------------|------
output_metric_format | `opentsdb_line`
documentation        | [OpenTSDB Data Specification][9]
example              | {{< highlight string >}}sys.cpu.user 1356998400 42.5 host=webserver01 cpu=0{{< /highlight >}}

### Validating the metrics

If the check output is formatted correctly according to its `output_metric_format`,
the metrics will be extracted in Sensu Metric Format, and saved within the
event. You should expect to see logged errors if Sensu is unable to parse
the check output. You can validate that metrics have been extracted from your
check through your handler, or through the resulting event. The example check
we used would yield an event similar to the one below:

{{< highlight json >}}
{
  "type": "Event",
  "api_version": "core/v2",
  "metadata": {},
  "spec": {
    "check": {
      "metadata": {
        "name": "collect-metrics",
        "namespace": "default"
      },
      "command": "collect_metrics.sh",
      "output": "cpu.idle_percentage 61 1525462242\nmem.sys 104448 1525462242",
      "output_metric_format": "graphite_plaintext",
      "output_metric_handlers": [
        "influx-db"
      ]
    },
    "metrics": {
      "handlers": [
        "influx-db"
      ],
      "points": [
        {
          "name": "cpu.idle_percentage",
          "value": 61,
          "timestamp": 1525462242,
          "tags": []
        },
        {
          "name": "mem.sys",
          "value": 104448,
          "timestamp": 1525462242,
          "tags": []
        }
      ]
    }
  }
}
{{< /highlight >}}

## Next steps

Now you know how to extract metrics from check output! Check out the below
resources for some further reading:

* Read the [checks reference][1] for in-depth documentation on checks.
* Read the [checks guide][2] for directions on how to schedule checks.
* Read the [handlers reference][4] for in-depth documentation on handlers.
* Read the [influx-db handler guide][5] for instructions on Sensu's built-in
metric handler.

[1]: ../../reference/checks
[2]: ../monitor-server-resources/
[3]: #supported-output-metric-formats
[4]: ../../reference/handlers
[5]: ../influx-db-metric-handler
[6]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/perfdata.html
[7]: http://graphite.readthedocs.io/en/latest/feeding-carbon.html#the-plaintext-protocol
[8]: https://docs.influxdata.com/influxdb/v1.4/write_protocols/line_protocol_tutorial/#measurement
[9]: http://opentsdb.net/docs/build/html/user_guide/writing/index.html#data-specification
