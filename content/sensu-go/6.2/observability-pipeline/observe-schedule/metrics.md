---
title: "Metrics reference"
linkTitle: "Metrics Reference"
reference_title: "Metrics"
type: "reference"
description: "Use checks to collect and process service metrics for your infrastructure with the Sensu observability pipeline. Read this reference doc to learn about Sensu Go's first-class support for collecting and processing metrics."
weight: 33
version: "6.2"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.2:
    parent: observe-schedule
---

Sensu Go offers first-class built-in support for collecting and processing metrics for your entire infrastructure.

In Sensu, metrics are events that contain metrics data.
Sensu metrics can be metrics-only events created with data from the [Sensu StatsD listener][2] or [Prometheus][7].
They can also be status and metrics events from [check output metric extraction][4].

## Extract metrics from check output

The Sensu agent can extract metrics data from check command output and populate an event's [metrics attribute][5] before sending the event to the Sensu backend for [processing][11].

To extract metrics from check output, the check must include an [`output_metric_format` attribute][10] that specifies one of Sensu's [supported output metric formats][9].
When a check includes the `output_metric_format` attribute, Sensu will extract the specified metrics from the check output and add them to the event data in the [metrics attribute][5].

In addition, the check command must output metrics in the supported metrics formats.

### Supported output metric formats

Sensu supports the following formats for check output metric extraction.

| Nagios             |      |
---------------------|------
output_metric_format | `nagios_perfdata`
documentation        | [Nagios Performance Data][13]
example              | {{< code plain >}}PING ok - Packet loss = 0%, RTA = 0.80 ms | percent_packet_loss=0, rta=0.80{{< /code >}}

| Graphite           |      |
---------------------|------
output_metric_format | `graphite_plaintext`
documentation        | [Graphite Plaintext Protocol][14]
example              | {{< code plain >}}local.random.diceroll 4 123456789{{< /code >}}

| InfluxDB           |      |
---------------------|------
output_metric_format | `influxdb_line`
documentation        | [InfluxDB Line Protocol][15]
example              | {{< code plain >}}weather,location=us-midwest temperature=82 1465839830100400200{{< /code >}}

| OpenTSDB           |      |
---------------------|------
output_metric_format | `opentsdb_line`
documentation        | [OpenTSDB Data Specification][16]
example              | {{< code plain >}}sys.cpu.user 1356998400 42.5 host=webserver01 cpu=0{{< /code >}}

| Prometheus         |      |
---------------------|------
output_metric_format | `prometheus_text`
documentation        | [Prometheus Exposition Text][17]
example              | {{< code plain >}}http_requests_total{method="post",code="200"} 1027 1395066363000{{< /code >}}

## Enrich metrics with tags

[Output metric tags][1] are custom tags you can apply to enrich the metric points produced by check output metric extraction.

For example, these tags will **???**:

**ADD TAGS EXAMPLE HERE**

## Process extracted and tagged metrics

Specify the event handlers you want to process your Sensu metrics in the check [`output_metric_handlers`][3] attribute.
With these event handlers, you can route metrics to one or more databases for storing and visualizing metrics, like Elasticsearch, InfluxDB, Grafana, and Graphite.

Use [Bonsai][8], the Sensu asset hub, to discover, download, and share dynamic runtime assets for processing metrics.
For example, you can use the [Sensu InfluxDB handler][12] dynamic runtime asset:

{{< code shell >}}
sensuctl asset add sensu/sensu-influxdb-handler
fetching bonsai asset: sensu/sensu-influxdb-handler
added asset: sensu/sensu-influxdb-handler

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["sensu-influxdb-handler"].
{{< /code >}}

Configure the asset definition with your InfluxDB information and list `sensu-influxdb-handler` in your check:

{{< language-toggle >}}

{{< code yml >}}
output_metric_handlers:
  - sensu-influxdb-handler
{{< /code >}}

{{< code json >}}
"output_metric_handlers": ["sensu-influxdb-handler"]
{{< /code >}}

{{< /language-toggle >}}

In check definitions, the `output_metrics_handlers` list for metrics event handlers is distinct and separate from the `handlers` list for status event handlers.
Having separate handlers attributes allows you to use different workflows for metrics and status without applying conditional filter logic.

You do not need to add a mutator to your check definition to process metrics with an event handler.
The [metrics attribute][5] format automatically reduces metrics data complexity so event handlers can process metrics effectively.

## Example metric check

This check definition collects metrics from **???**, enriches the metrics with custom tags, and sends the collected and tagged metrics to the `sensu-influxdb-handler` event handler for long-term storage and visualization.

**ADD CHECK EXAMPLE HERE**

## Example metric event

The [example metric check][6] will produce events similar to this metric event:

**ADD EVENT EXAMPLE HERE**

Sensu will send the data from these metric events to InfluxDB.


[1]: ../checks/#output-metric-tags
[2]: ../../observe-process/aggregate-metrics-statsd/
[3]: ../checks/#output-metric-handlers
[4]: #extract-metrics-from-check-output
[5]: ../../observe-events/events/#metrics
[6]: #example-metric-check
[7]: ../../../learn/prometheus-metrics/
[8]: https://bonsai.sensu.io/
[9]: #supported-output-metric-formats
[10]: ../checks/#output-metric-format
[11]: #process-extracted-and-tagged-metrics
[12]: https://bonsai.sensu.io/assets/sensu/sensu-influxdb-handler
[13]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/perfdata.html
[14]: http://graphite.readthedocs.io/en/latest/feeding-carbon.html#the-plaintext-protocol
[15]: https://docs.influxdata.com/influxdb/v1.4/write_protocols/line_protocol_tutorial/#measurement
[16]: http://opentsdb.net/docs/build/html/user_guide/writing/index.html#data-specification
[17]: https://prometheus.io/docs/instrumenting/exposition_formats/#text-based-format
