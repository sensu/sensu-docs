---
title: "Metrics reference"
linkTitle: "Metrics Reference"
reference_title: "Metrics"
type: "reference"
description: "Use checks to collect service and time-series metrics for your infrastructure and process extracted metrics with the Sensu observability pipeline. Read this reference doc to learn about Sensu Go's first-class support for collecting and processing service and time-series metrics."
weight: 33
version: "6.4"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.4:
    parent: observe-schedule
---

Sensu Go offers built-in support for collecting and processing service and time-series metrics for your entire infrastructure.

In Sensu, metrics are an optional component of observation data in events.
Sensu events may contain check execution results, metrics, or both.
Certain inputs like the [Sensu StatsD listener][2] or patterns like the [Prometheus][7] collector pattern will create metrics-only events.
Events can also include metrics from [check output metric extraction][4].

Use Sensu handlers to [process extracted metrics][11] and route them to databases like Elasticsearch, InfluxDB, Grafana, and Graphite.
You can also use Sensu's [time-series and long-term event storage integrations][18] to process service and time-series metrics.

{{% notice note %}}
**NOTE**: This reference describes the metrics component of observation data included in Sensu events, which is distinct from the Sensu metrics API.
For information about HTTP GET access to internal Sensu metrics, read our [metrics API](../../../api/metrics/) documentation.
{{% /notice %}}

## Metric check example

This check definition collects metrics in InfluxDB Line Protocol [format][9] and sends the collected metrics to a metrics handler configured with the [Sensu InfluxDB Handler][12] dynamic runtime asset:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  created_by: admin
  name: collect-metrics
  namespace: default
spec:
  check_hooks: null
  command: metrics-disk-usage.rb
  env_vars: null
  handlers: []
  high_flap_threshold: 0
  interval: 30
  low_flap_threshold: 0
  output_metric_format: influxdb_line
  output_metric_handlers:
  - sensu-influxdb-handler
  proxy_entity_name: ""
  publish: true
  round_robin: false
  runtime_assets:
  - sensu-plugins/sensu-plugins-disk-checks
  - sensu/sensu-ruby-runtime
  secrets: null
  stdin: false
  subdue: null
  subscriptions:
  - linux
  timeout: 0
  ttl: 0
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "created_by": "admin",
    "name": "collect-metrics",
    "namespace": "default"
  },
  "spec": {
    "check_hooks": null,
    "command": "metrics-disk-usage.rb",
    "env_vars": null,
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 30,
    "low_flap_threshold": 0,
    "output_metric_format": "influxdb_line",
    "output_metric_handlers": [
      "sensu-influxdb-handler"
    ],
    "proxy_entity_name": "",
    "publish": true,
    "round_robin": false,
    "runtime_assets": [
      "sensu-plugins/sensu-plugins-disk-checks",
      "sensu/sensu-ruby-runtime"
    ],
    "secrets": null,
    "stdin": false,
    "subdue": null,
    "subscriptions": [
      "linux"
    ],
    "timeout": 0,
    "ttl": 0
  }
}
{{< /code >}}

{{< /language-toggle >}}

### Metric event example

The [example metric check][6] will produce events similar to this metric event:

{{< language-toggle >}}

{{< code yml >}}
---
type: Event
api_version: core/v2
metadata:
  namespace: default
spec:
  check:
    check_hooks: null
    command: metrics-disk-usage.rb
    duration: 0.059301963
    env_vars: null
    executed: 1614379313
    handlers: []
    high_flap_threshold: 0
    history:
    - executed: 1614379193
      status: 0
    - executed: 1614379223
      status: 0
    - executed: 1614379253
      status: 0
    - executed: 1614379283
      status: 0
    - executed: 1614379313
      status: 0
    interval: 30
    is_silenced: false
    issued: 1614379313
    last_ok: 1614379313
    low_flap_threshold: 0
    metadata:
      name: collect-metrics
      namespace: default
    occurrences: 5
    occurrences_watermark: 5
    output: |
      sensu-centos.disk_usage.root.used 1476 1614379313
      sensu-centos.disk_usage.root.avail 40472 1614379313
      sensu-centos.disk_usage.root.used_percentage 4 1614379313
      sensu-centos.disk_usage.root.dev.used 0 1614379313
      sensu-centos.disk_usage.root.dev.avail 485 1614379313
      sensu-centos.disk_usage.root.dev.used_percentage 0 1614379313
      sensu-centos.disk_usage.root.run.used 20 1614379313
      sensu-centos.disk_usage.root.run.avail 477 1614379313
      sensu-centos.disk_usage.root.run.used_percentage 4 1614379313
      sensu-centos.disk_usage.root.home.used 33 1614379313
      sensu-centos.disk_usage.root.home.avail 20446 1614379313
      sensu-centos.disk_usage.root.home.used_percentage 1 1614379313
      sensu-centos.disk_usage.root.boot.used 130 1614379313
      sensu-centos.disk_usage.root.boot.avail 885 1614379313
      sensu-centos.disk_usage.root.boot.used_percentage 13 1614379313
      sensu-centos.disk_usage.root.vagrant.used 82069 1614379313
      sensu-centos.disk_usage.root.vagrant.avail 871836 1614379313
      sensu-centos.disk_usage.root.vagrant.used_percentage 9 1614379313
    output_metric_format: influxdb_line
    output_metric_handlers: null
    proxy_entity_name: ""
    publish: true
    round_robin: false
    runtime_assets:
    - sensu-plugins/sensu-plugins-disk-checks
    - sensu/sensu-ruby-runtime
    scheduler: memory
    secrets: null
    state: passing
    status: 0
    stdin: false
    subdue: null
    subscriptions:
    - linux
    timeout: 0
    total_state_change: 0
    ttl: 0
  entity:
    deregister: false
    deregistration: {}
    entity_class: agent
    last_seen: 1614379313
    metadata:
      created_by: admin
      name: sensu-centos
      namespace: default
    redact:
    - password
    - passwd
    - pass
    - api_key
    - api_token
    - access_key
    - secret_key
    - private_key
    - secret
    sensu_agent_version: 6.2.5
    subscriptions:
    - entity:sensu-centos
    - linux
    system:
      arch: amd64
      cloud_provider: ""
      hostname: sensu-centos
      libc_type: glibc
      network:
        interfaces:
        - addresses:
          - 127.0.0.1/8
          - ::1/128
          name: lo
        - addresses:
          - 10.0.2.15/24
          - fe80::146d:22df:fb9a:1c7c/64
          mac: 08:00:27:8b:c9:3f
          name: eth0
        - addresses:
          - 172.28.128.33/24
          - fe80::a00:27ff:fee1:857a/64
          mac: 08:00:27:e1:85:7a
          name: eth1
      os: linux
      platform: centos
      platform_family: rhel
      platform_version: 7.5.1804
      processes: null
      vm_role: guest
      vm_system: vbox
    user: agent
  id: 38de280d-444b-4017-a438-b35cd4a6f2f8
  sequence: 5
  timestamp: 1614379313
{{< /code >}}

{{< code json >}}
{
  "type": "Event",
  "api_version": "core/v2",
  "metadata": {
    "namespace": "default"
  },
  "spec": {
    "check": {
      "check_hooks": null,
      "command": "metrics-disk-usage.rb",
      "duration": 0.059301963,
      "env_vars": null,
      "executed": 1614379313,
      "handlers": [],
      "high_flap_threshold": 0,
      "history": [
        {
          "executed": 1614379193,
          "status": 0
        },
        {
          "executed": 1614379223,
          "status": 0
        },
        {
          "executed": 1614379253,
          "status": 0
        },
        {
          "executed": 1614379283,
          "status": 0
        },
        {
          "executed": 1614379313,
          "status": 0
        }
      ],
      "interval": 30,
      "is_silenced": false,
      "issued": 1614379313,
      "last_ok": 1614379313,
      "low_flap_threshold": 0,
      "metadata": {
        "name": "collect-metrics",
        "namespace": "default"
      },
      "occurrences": 5,
      "occurrences_watermark": 5,
      "output": "sensu-centos.disk_usage.root.used 1476 1614379313\nsensu-centos.disk_usage.root.avail 40472 1614379313\nsensu-centos.disk_usage.root.used_percentage 4 1614379313\nsensu-centos.disk_usage.root.dev.used 0 1614379313\nsensu-centos.disk_usage.root.dev.avail 485 1614379313\nsensu-centos.disk_usage.root.dev.used_percentage 0 1614379313\nsensu-centos.disk_usage.root.run.used 20 1614379313\nsensu-centos.disk_usage.root.run.avail 477 1614379313\nsensu-centos.disk_usage.root.run.used_percentage 4 1614379313\nsensu-centos.disk_usage.root.home.used 33 1614379313\nsensu-centos.disk_usage.root.home.avail 20446 1614379313\nsensu-centos.disk_usage.root.home.used_percentage 1 1614379313\nsensu-centos.disk_usage.root.boot.used 130 1614379313\nsensu-centos.disk_usage.root.boot.avail 885 1614379313\nsensu-centos.disk_usage.root.boot.used_percentage 13 1614379313\nsensu-centos.disk_usage.root.vagrant.used 82069 1614379313\nsensu-centos.disk_usage.root.vagrant.avail 871836 1614379313\nsensu-centos.disk_usage.root.vagrant.used_percentage 9 1614379313\n",
      "output_metric_format": "influxdb_line",
      "output_metric_handlers": null,
      "proxy_entity_name": "",
      "publish": true,
      "round_robin": false,
      "runtime_assets": [
        "sensu-plugins/sensu-plugins-disk-checks",
        "sensu/sensu-ruby-runtime"
      ],
      "scheduler": "memory",
      "secrets": null,
      "state": "passing",
      "status": 0,
      "stdin": false,
      "subdue": null,
      "subscriptions": [
        "linux"
      ],
      "timeout": 0,
      "total_state_change": 0,
      "ttl": 0
    },
    "entity": {
      "deregister": false,
      "deregistration": {
      },
      "entity_class": "agent",
      "last_seen": 1614379313,
      "metadata": {
        "created_by": "admin",
        "name": "sensu-centos",
        "namespace": "default"
      },
      "redact": [
        "password",
        "passwd",
        "pass",
        "api_key",
        "api_token",
        "access_key",
        "secret_key",
        "private_key",
        "secret"
      ],
      "sensu_agent_version": "6.2.5",
      "subscriptions": [
        "entity:sensu-centos",
        "linux"
      ],
      "system": {
        "arch": "amd64",
        "cloud_provider": "",
        "hostname": "sensu-centos",
        "libc_type": "glibc",
        "network": {
          "interfaces": [
            {
              "addresses": [
                "127.0.0.1/8",
                ":1/128"
              ],
              "name": "lo"
            },
            {
              "addresses": [
                "10.0.2.15/24",
                "fe80::146d:22df:fb9a:1c7c/64"
              ],
              "mac": "08:00:27:8b:c9:3f",
              "name": "eth0"
            },
            {
              "addresses": [
                "172.28.128.33/24",
                "fe80::a00:27ff:fee1:857a/64"
              ],
              "mac": "08:00:27:e1:85:7a",
              "name": "eth1"
            }
          ]
        },
        "os": "linux",
        "platform": "centos",
        "platform_family": "rhel",
        "platform_version": "7.5.1804",
        "processes": null,
        "vm_role": "guest",
        "vm_system": "vbox"
      },
      "user": "agent"
    },
    "id": "38de280d-444b-4017-a438-b35cd4a6f2f8",
    "sequence": 5,
    "timestamp": 1614379313
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Extract metrics from check output

The Sensu agent can extract metrics data from check command output and populate an event's [metrics attribute][5] before sending the event to the Sensu backend for [processing][11].

To extract metrics from check output:

- The check `command` execution must output metrics in one of Sensu's [supported output metric formats][9].
- The check must include the [`output_metric_format` attribute][10] with a value that specifies one of Sensu's [supported output metric formats][9].

When a check includes correctly configured `command` and `output_metric_format` attributes, Sensu will extract the specified metrics from the check output and add them to the event data in the [metrics attribute][5].

You can also configure the check `output_metric_handlers` attribute to use a Sensu handler that is equipped to handle Sensu metrics.
See the [check reference][3] or [InfluxDB handler guide][23] to learn more.

### Supported output metric formats

Sensu supports the following formats for check output metric extraction.

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

| Nagios             |      |
---------------------|------
output_metric_format | `nagios_perfdata`
documentation        | [Nagios Performance Data][13]
example              | {{< code plain >}}PING ok - Packet loss = 0%, RTA = 0.80 ms | percent_packet_loss=0, rta=0.80{{< /code >}}

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

Use output metric tags for the output metric formats that do not natively support tags: Graphite Plaintext Protocol and Nagios Performance Data.

Values for output metric tags are passed through to the metric points produced by check output metric extraction for formats that natively support tags (InfluxDB Line Protocol, OpenTSDB Data Specification, and Prometheus Exposition Text).

You can use [check token substitution][22] for the [value attribute][21] to include any event attribute in an output metric tag.
For example, this tag will list the `event.time` attribute:

{{< code shell >}}
"output_metric_tags": [
  {
    "name": "instance",
    "value": "{{ .entity.system.hostname }}"
  }
]{{< /code >}}

## Process extracted and tagged metrics

Specify the event handlers you want to process your Sensu metrics in the check [`output_metric_handlers`][3] attribute.
With these event handlers, you can route metrics to one or more databases for storing and visualizing metrics, like Elasticsearch, InfluxDB, Grafana, and Graphite.

Many of our most popular metrics integrations for [time-series and long-term event storage][18] include curated, configurable quick-start templates to integrate Sensu with your existing workflows.
You can also use [Bonsai][8], the Sensu asset hub, to discover, download, and share dynamic runtime assets for processing metrics.

In check definitions, the `output_metric_handlers` list for metrics event handlers is distinct and separate from the `handlers` list for status event handlers.
Having separate handlers attributes allows you to use different workflows for metrics and status without applying conditional filter logic.
The events reference includes an [example event with check and metric data][20].

You do not need to add a mutator to your check definition to process metrics with an event handler.
The [metrics attribute][5] format automatically reduces metrics data complexity so event handlers can process metrics effectively.

## Validate metrics

If the check output is formatted correctly according to its `output_metric_format`, the metrics will be extracted in Sensu metric format and passed to the observability pipeline.
To confirm that your check is extracting metrics, inspect the events the check yields:

{{% notice note %}}
**NOTE**: Replace `<entity_name>` and `<check_name>` with the names of the entity and check whose events you want to review.
{{% /notice %}}

{{< code shell "JSON" >}}
sensuctl event info <entity_name> <check_name> --format json
{{< /code >}}

You should expect to see errors logged by sensu-agent if it is unable to parse the check output.
See [Troubleshoot Sensu][24] for an example debug handler that writes events to a file for inspection.

## Metrics specification

The check specification describes [metrics attributes in checks][19].

The event specification describes [metrics attributes in events][5].


[1]: ../checks/#output-metric-tags
[2]: ../../observe-process/aggregate-metrics-statsd/
[3]: ../checks/#output-metric-handlers
[4]: #extract-metrics-from-check-output
[5]: ../../observe-events/events/#metrics-attribute
[6]: #metric-check-example
[7]: ../prometheus-metrics/
[8]: https://bonsai.sensu.io/
[9]: #supported-output-metric-formats
[10]: ../checks/#output-metric-format
[11]: #process-extracted-and-tagged-metrics
[12]: https://bonsai.sensu.io/assets/sensu/sensu-influxdb-handler
[13]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/perfdata.html
[14]: https://graphite.readthedocs.io/en/latest/feeding-carbon.html#the-plaintext-protocol
[15]: https://docs.influxdata.com/influxdb/v1.4/write_protocols/line_protocol_tutorial/#measurement
[16]: http://opentsdb.net/docs/build/html/user_guide/writing/index.html#data-specification
[17]: https://prometheus.io/docs/instrumenting/exposition_formats/#text-based-format
[18]: ../../../plugins/supported-integrations/#time-series-and-long-term-event-storage
[19]: ../checks/#output-metric-format
[20]: ../../observe-events/events/#example-status-and-metrics-event
[21]: ../checks/#output_metric_tags-attributes
[22]: ../checks/#check-token-substitution
[23]: ../../observe-process/populate-metrics-influxdb/
[24]: ../../../operations/maintain-sensu/troubleshoot#handlers-and-event-filters
