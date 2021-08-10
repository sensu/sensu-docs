---
title: "Collect metrics with Sensu checks"
linkTitle: "Collect Service Metrics"
description: "Sensu supports industry-standard metric formats like Nagios Performance Data, Graphite Plaintext Protocol, InfluxDB Line Protocol, and OpenTSDB Data Specification. Read this guide to collect metrics with Sensu."
weight: 30
version: "5.21"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.21:
    parent: guides
---

Sensu checks are **commands** (or scripts) that the Sensu agent executes that output data and produce an exit code to indicate a state.
If you are unfamiliar with checks or want to learn how to configure a check before reading this guide, read the [check reference][1] and [Monitor server resources][2].

## Extract metrics from check output

To extract metrics from check output, you'll need to:

1. Configure the check `command` so that the command execution outputs metrics in one of the [supported output metric formats][3].
2. Configure the check `output_metric_format` to one of the [supported output metric formats][3].

You can also configure the check `output_metric_handlers` to a Sensu handler that is equipped to handle Sensu metrics if you wish. See [handlers][4] or [influx-db handler][5] to learn more.

You can configure the check with these fields at creation or use the commands in this guide (assuming you have a check named `collect-metrics`).
This example uses `graphite_plaintext` format and sends the metrics to a handler named `influx-db`.

{{< code shell >}}
sensuctl check set-command collect-metrics collect_metrics.sh
sensuctl check set-output-metric-format collect-metrics graphite_plaintext
sensuctl check set-output-metric-handlers collect-metrics influx-db
{{< /code >}}

### Supported output metric formats

The output metric formats that Sensu currently supports for check output metric extraction are `nagios`, `influxdb`, `graphite`, and `opentsdb`.

|nagios              |      |
---------------------|------
output_metric_format | `nagios_perfdata`
documentation        | [Nagios Performance Data][6]
example              | {{< code plain >}}PING ok - Packet loss = 0%, RTA = 0.80 ms | percent_packet_loss=0, rta=0.80{{< /code >}}

|graphite            |      |
---------------------|------
output_metric_format | `graphite_plaintext`
documentation        | [Graphite Plaintext Protocol][7]
example              | {{< code plain >}}local.random.diceroll 4 123456789{{< /code >}}

|influxdb            |      |
---------------------|------
output_metric_format | `influxdb_line`
documentation        | [InfluxDB Line Protocol][8]
example              | {{< code plain >}}weather,location=us-midwest temperature=82 1465839830100400200{{< /code >}}

|opentsdb            |      |
---------------------|------
output_metric_format | `opentsdb_line`
documentation        | [OpenTSDB Data Specification][9]
example              | {{< code plain >}}sys.cpu.user 1356998400 42.5 host=webserver01 cpu=0{{< /code >}}

## Validate the metrics

If the check output is formatted correctly according to its `output_metric_format`, the metrics will be extracted in Sensu metric format and passed to the event pipeline.
You should expect to see errors logged by sensu-agent if it is unable to parse the check output.
To confirm that metrics have been extracted from your check, inspect the event passed to the handler.

See [Troubleshoot Sensu][10] for an example debug handler that writes events to a file for inspection.

The example check would yield an event similar to this:

{{< language-toggle >}}

{{< code yml >}}
type: Event
api_version: core/v2
metadata: {}
spec:
  check:
    command: collect_metrics.sh
    metadata:
      name: collect-metrics
      namespace: default
    output: |-
      cpu.idle_percentage 61 1525462242
      mem.sys 104448 1525462242
    output_metric_format: graphite_plaintext
    output_metric_handlers:
    - influx-db
  metrics:
    handlers:
    - influx-db
    points:
    - name: cpu.idle_percentage
      tags: []
      timestamp: 1525462242
      value: 61
    - name: mem.sys
      tags: []
      timestamp: 1525462242
      value: 104448
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

## Next steps

Now you know how to extract metrics from check output!
Check out these resources for more information about scheduling checks and using handlers:

* [Checks reference][1]: in-depth checks documentation
* [Monitor server resources][2]: learn how to schedule checks
* [Handlers reference][4]: in-depth handler documentation
* [Populate metrics in InfluxDB][5]: learn to use Sensu's built-in metrics handler

[1]: ../../reference/checks/
[2]: ../monitor-server-resources/
[3]: #supported-output-metric-formats
[4]: ../../reference/handlers/
[5]: ../influx-db-metric-handler/
[6]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/perfdata.html
[7]: https://graphite.readthedocs.io/en/latest/feeding-carbon.html#the-plaintext-protocol
[8]: https://docs.influxdata.com/influxdb/v1.4/write_protocols/line_protocol_tutorial/#measurement
[9]: http://opentsdb.net/docs/build/html/user_guide/writing/index.html#data-specification
[10]: ../../operations/maintain-sensu/troubleshoot#handlers-and-event-filters
