---
title: "Metrics reference"
linkTitle: "Metrics Reference"
reference_title: "Metrics"
type: "reference"
description: "Use checks to collect service and time-series metrics for your infrastructure and process extracted metrics with the Sensu observability pipeline. Read this reference doc to learn about Sensu Go's first-class support for collecting and processing service and time-series metrics."
weight: 33
version: "6.3"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.3:
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

This check definition collects metrics in Graphite Plaintext Protocol [format][9] and sends the collected metrics to a metrics handler configured with the [Sensu Go Graphite Handler][12] dynamic runtime asset:

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
  handlers:
  - debug
  high_flap_threshold: 0
  interval: 30
  low_flap_threshold: 0
  output_metric_format: graphite_plaintext
  output_metric_handlers:
  - sensu-go-graphite-handler
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
    "handlers": "debug",
    "high_flap_threshold": 0,
    "interval": 30,
    "low_flap_threshold": 0,
    "output_metric_format": "graphite_plaintext",
    "output_metric_handlers": [
      "sensu-go-graphite-handler"
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
entity:
  entity_class: agent
  system:
    hostname: sensu-centos
    os: linux
    platform: centos
    platform_family: rhel
    platform_version: 7.5.1804
    network:
      interfaces:
      - name: lo
        addresses:
        - 127.0.0.1/8
        - "::1/128"
      - name: eth0
        mac: '08:00:27:8b:c9:3f'
        addresses:
        - 10.0.2.15/24
        - fe80::2a24:13f4:6b:c0b8/64
      - name: eth1
        mac: '08:00:27:3d:ce:39'
        addresses:
        - 172.28.128.63/24
        - fe80::a00:27ff:fe3d:ce39/64
    arch: amd64
    libc_type: glibc
    vm_system: vbox
    vm_role: guest
    cloud_provider: ''
    processes:
  subscriptions:
  - entity:sensu-centos
  - linux
  last_seen: 1625000586
  deregister: false
  deregistration: {}
  user: agent
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
  metadata:
    name: sensu-centos
    namespace: default
  sensu_agent_version: 6.4.0
check:
  command: metrics-disk-usage.rb
  handlers:
  - debug
  high_flap_threshold: 0
  interval: 60
  low_flap_threshold: 0
  publish: true
  runtime_assets:
  - sensu-plugins/sensu-plugins-disk-checks
  - sensu/sensu-ruby-runtime
  subscriptions:
  - linux
  proxy_entity_name: ''
  check_hooks:
  stdin: false
  subdue:
  ttl: 0
  timeout: 0
  round_robin: false
  duration: 0.060007931
  executed: 1625000586
  history:
  - status: 0
    executed: 1625000346
  - status: 0
    executed: 1625000406
  - status: 0
    executed: 1625000466
  - status: 0
    executed: 1625000526
  - status: 0
    executed: 1625000586
  issued: 1625000586
  output: |
    sensu-centos.disk_usage.root.used 1515 1625000586
    sensu-centos.disk_usage.root.avail 40433 1625000586
    sensu-centos.disk_usage.root.used_percentage 4 1625000586
    sensu-centos.disk_usage.root.dev.used 0 1625000586
    sensu-centos.disk_usage.root.dev.avail 485 1625000586
    sensu-centos.disk_usage.root.dev.used_percentage 0 1625000586
    sensu-centos.disk_usage.root.run.used 51 1625000586
    sensu-centos.disk_usage.root.run.avail 446 1625000586
    sensu-centos.disk_usage.root.run.used_percentage 11 1625000586
    sensu-centos.disk_usage.root.boot.used 130 1625000586
    sensu-centos.disk_usage.root.boot.avail 885 1625000586
    sensu-centos.disk_usage.root.boot.used_percentage 13 1625000586
    sensu-centos.disk_usage.root.home.used 33 1625000586
    sensu-centos.disk_usage.root.home.avail 20446 1625000586
    sensu-centos.disk_usage.root.home.used_percentage 1 1625000586
    sensu-centos.disk_usage.root.vagrant.used 79699 1625000586
    sensu-centos.disk_usage.root.vagrant.avail 874206 1625000586
    sensu-centos.disk_usage.root.vagrant.used_percentage 9 1625000586
  state: passing
  status: 0
  total_state_change: 0
  last_ok: 1625000586
  occurrences: 5
  occurrences_watermark: 5
  output_metric_format: graphite_plaintext
  output_metric_handlers: sensu-go-graphite-handler
  env_vars:
  metadata:
    name: collect-metrics
    namespace: default
  secrets:
  is_silenced: false
  scheduler: memory
metrics:
  handlers:
  points:
  - name: sensu-centos.disk_usage.root.used
    value: 1515
    timestamp: 1625000586
    tags:
  - name: sensu-centos.disk_usage.root.avail
    value: 40433
    timestamp: 1625000586
    tags:
  - name: sensu-centos.disk_usage.root.used_percentage
    value: 4
    timestamp: 1625000586
    tags:
  - name: sensu-centos.disk_usage.root.dev.used
    value: 0
    timestamp: 1625000586
    tags:
  - name: sensu-centos.disk_usage.root.dev.avail
    value: 485
    timestamp: 1625000586
    tags:
  - name: sensu-centos.disk_usage.root.dev.used_percentage
    value: 0
    timestamp: 1625000586
    tags:
  - name: sensu-centos.disk_usage.root.run.used
    value: 51
    timestamp: 1625000586
    tags:
  - name: sensu-centos.disk_usage.root.run.avail
    value: 446
    timestamp: 1625000586
    tags:
  - name: sensu-centos.disk_usage.root.run.used_percentage
    value: 11
    timestamp: 1625000586
    tags:
  - name: sensu-centos.disk_usage.root.boot.used
    value: 130
    timestamp: 1625000586
    tags:
  - name: sensu-centos.disk_usage.root.boot.avail
    value: 885
    timestamp: 1625000586
    tags:
  - name: sensu-centos.disk_usage.root.boot.used_percentage
    value: 13
    timestamp: 1625000586
    tags:
  - name: sensu-centos.disk_usage.root.home.used
    value: 33
    timestamp: 1625000586
    tags:
  - name: sensu-centos.disk_usage.root.home.avail
    value: 20446
    timestamp: 1625000586
    tags:
  - name: sensu-centos.disk_usage.root.home.used_percentage
    value: 1
    timestamp: 1625000586
    tags:
  - name: sensu-centos.disk_usage.root.vagrant.used
    value: 79699
    timestamp: 1625000586
    tags:
  - name: sensu-centos.disk_usage.root.vagrant.avail
    value: 874206
    timestamp: 1625000586
    tags:
  - name: sensu-centos.disk_usage.root.vagrant.used_percentage
    value: 9
    timestamp: 1625000586
    tags:
metadata:
  namespace: default
id: 7468a597-bc3c-4ea7-899c-51c4d2992689
sequence: 5
timestamp: 1625000586
{{< /code >}}

{{< code json >}}
{
  "entity": {
    "entity_class": "agent",
    "system": {
      "hostname": "sensu-centos",
      "os": "linux",
      "platform": "centos",
      "platform_family": "rhel",
      "platform_version": "7.5.1804",
      "network": {
        "interfaces": [
          {
            "name": "lo",
            "addresses": [
              "127.0.0.1/8",
              "::1/128"
            ]
          },
          {
            "name": "eth0",
            "mac": "08:00:27:8b:c9:3f",
            "addresses": [
              "10.0.2.15/24",
              "fe80::2a24:13f4:6b:c0b8/64"
            ]
          },
          {
            "name": "eth1",
            "mac": "08:00:27:3d:ce:39",
            "addresses": [
              "172.28.128.63/24",
              "fe80::a00:27ff:fe3d:ce39/64"
            ]
          }
        ]
      },
      "arch": "amd64",
      "libc_type": "glibc",
      "vm_system": "vbox",
      "vm_role": "guest",
      "cloud_provider": "",
      "processes": null
    },
    "subscriptions": [
      "entity:sensu-centos",
      "linux"
    ],
    "last_seen": 1625000586,
    "deregister": false,
    "deregistration": {},
    "user": "agent",
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
    "metadata": {
      "name": "sensu-centos",
      "namespace": "default"
    },
    "sensu_agent_version": "6.4.0"
  },
  "check": {
    "command": "metrics-disk-usage.rb",
    "handlers": [
      "debug"
    ],
    "high_flap_threshold": 0,
    "interval": 60,
    "low_flap_threshold": 0,
    "publish": true,
    "runtime_assets": [
      "sensu-plugins/sensu-plugins-disk-checks",
      "sensu/sensu-ruby-runtime"
    ],
    "subscriptions": [
      "linux"
    ],
    "proxy_entity_name": "",
    "check_hooks": null,
    "stdin": false,
    "subdue": null,
    "ttl": 0,
    "timeout": 0,
    "round_robin": false,
    "duration": 0.060007931,
    "executed": 1625000586,
    "history": [
      {
        "status": 0,
        "executed": 1625000346
      },
      {
        "status": 0,
        "executed": 1625000406
      },
      {
        "status": 0,
        "executed": 1625000466
      },
      {
        "status": 0,
        "executed": 1625000526
      },
      {
        "status": 0,
        "executed": 1625000586
      }
    ],
    "issued": 1625000586,
    "output": "sensu-centos.disk_usage.root.used 1515 1625000586\nsensu-centos.disk_usage.root.avail 40433 1625000586\nsensu-centos.disk_usage.root.used_percentage 4 1625000586\nsensu-centos.disk_usage.root.dev.used 0 1625000586\nsensu-centos.disk_usage.root.dev.avail 485 1625000586\nsensu-centos.disk_usage.root.dev.used_percentage 0 1625000586\nsensu-centos.disk_usage.root.run.used 51 1625000586\nsensu-centos.disk_usage.root.run.avail 446 1625000586\nsensu-centos.disk_usage.root.run.used_percentage 11 1625000586\nsensu-centos.disk_usage.root.boot.used 130 1625000586\nsensu-centos.disk_usage.root.boot.avail 885 1625000586\nsensu-centos.disk_usage.root.boot.used_percentage 13 1625000586\nsensu-centos.disk_usage.root.home.used 33 1625000586\nsensu-centos.disk_usage.root.home.avail 20446 1625000586\nsensu-centos.disk_usage.root.home.used_percentage 1 1625000586\nsensu-centos.disk_usage.root.vagrant.used 79699 1625000586\nsensu-centos.disk_usage.root.vagrant.avail 874206 1625000586\nsensu-centos.disk_usage.root.vagrant.used_percentage 9 1625000586\n",
    "state": "passing",
    "status": 0,
    "total_state_change": 0,
    "last_ok": 1625000586,
    "occurrences": 5,
    "occurrences_watermark": 5,
    "output_metric_format": "graphite_plaintext",
    "output_metric_handlers": "sensu-go-graphite-handler",
    "env_vars": null,
    "metadata": {
      "name": "collect-metrics",
      "namespace": "default"
    },
    "secrets": null,
    "is_silenced": false,
    "scheduler": "memory"
  },
  "metrics": {
    "handlers": null,
    "points": [
      {
        "name": "sensu-centos.disk_usage.root.used",
        "value": 1515,
        "timestamp": 1625000586,
        "tags": null
      },
      {
        "name": "sensu-centos.disk_usage.root.avail",
        "value": 40433,
        "timestamp": 1625000586,
        "tags": null
      },
      {
        "name": "sensu-centos.disk_usage.root.used_percentage",
        "value": 4,
        "timestamp": 1625000586,
        "tags": null
      },
      {
        "name": "sensu-centos.disk_usage.root.dev.used",
        "value": 0,
        "timestamp": 1625000586,
        "tags": null
      },
      {
        "name": "sensu-centos.disk_usage.root.dev.avail",
        "value": 485,
        "timestamp": 1625000586,
        "tags": null
      },
      {
        "name": "sensu-centos.disk_usage.root.dev.used_percentage",
        "value": 0,
        "timestamp": 1625000586,
        "tags": null
      },
      {
        "name": "sensu-centos.disk_usage.root.run.used",
        "value": 51,
        "timestamp": 1625000586,
        "tags": null
      },
      {
        "name": "sensu-centos.disk_usage.root.run.avail",
        "value": 446,
        "timestamp": 1625000586,
        "tags": null
      },
      {
        "name": "sensu-centos.disk_usage.root.run.used_percentage",
        "value": 11,
        "timestamp": 1625000586,
        "tags": null
      },
      {
        "name": "sensu-centos.disk_usage.root.boot.used",
        "value": 130,
        "timestamp": 1625000586,
        "tags": null
      },
      {
        "name": "sensu-centos.disk_usage.root.boot.avail",
        "value": 885,
        "timestamp": 1625000586,
        "tags": null
      },
      {
        "name": "sensu-centos.disk_usage.root.boot.used_percentage",
        "value": 13,
        "timestamp": 1625000586,
        "tags": null
      },
      {
        "name": "sensu-centos.disk_usage.root.home.used",
        "value": 33,
        "timestamp": 1625000586,
        "tags": null
      },
      {
        "name": "sensu-centos.disk_usage.root.home.avail",
        "value": 20446,
        "timestamp": 1625000586,
        "tags": null
      },
      {
        "name": "sensu-centos.disk_usage.root.home.used_percentage",
        "value": 1,
        "timestamp": 1625000586,
        "tags": null
      },
      {
        "name": "sensu-centos.disk_usage.root.vagrant.used",
        "value": 79699,
        "timestamp": 1625000586,
        "tags": null
      },
      {
        "name": "sensu-centos.disk_usage.root.vagrant.avail",
        "value": 874206,
        "timestamp": 1625000586,
        "tags": null
      },
      {
        "name": "sensu-centos.disk_usage.root.vagrant.used_percentage",
        "value": 9,
        "timestamp": 1625000586,
        "tags": null
      }
    ]
  },
  "metadata": {
    "namespace": "default"
  },
  "id": "7468a597-bc3c-4ea7-899c-51c4d2992689",
  "sequence": 5,
  "timestamp": 1625000586
}
{{< /code >}}

{{< /language-toggle >}}

{{% notice note %}}
**NOTE**: Metrics data points are not included in events retrieved with `sensuctl event info` &mdash; these events include check output text rather than a set of metrics points.
To view metrics points data, add a [debug handler](../../../operations/maintain-sensu/troubleshoot#use-a-debug-handler) that prints events to a JSON file. 
{{% /notice %}}

## Extract metrics from check output

The Sensu agent can extract metrics data from check command output and populate an event's [metrics attribute][5] before sending the event to the Sensu backend for [processing][11].

To extract metrics from check output:

- The check `command` execution must output metrics in one of Sensu's [supported output metric formats][9].
- The check must include the [`output_metric_format` attribute][10] with a value that specifies one of Sensu's [supported output metric formats][9].

When a check includes correctly configured `command` and `output_metric_format` attributes, Sensu will extract the specified metrics from the check output and add them to the event data in the [metrics attribute][5].

You can also configure the check `output_metric_handlers` attribute to use a Sensu handler that is equipped to handle Sensu metrics.
Read the [checks reference][3] or [InfluxDB handler guide][23] to learn more.

### Supported output metric formats

Sensu supports the following formats for check output metric extraction.

| Graphite           |      |
---------------------|------
output metric format | `graphite_plaintext`
documentation        | [Graphite Plaintext Protocol][14]
example              | {{< code plain >}}local.random.diceroll 4 123456789{{< /code >}}

| InfluxDB           |      |
---------------------|------
output metric format | `influxdb_line`
documentation        | [InfluxDB Line Protocol][15]
example              | {{< code plain >}}weather,location=us-midwest temperature=82 1465839830100400200{{< /code >}}

| Nagios             |      |
---------------------|------
output metric format | `nagios_perfdata`
documentation        | [Nagios Performance Data][13]
example              | {{< code plain >}}PING ok - Packet loss = 0%, RTA = 0.80 ms | percent_packet_loss=0, rta=0.80{{< /code >}}

| OpenTSDB           |      |
---------------------|------
output metric format | `opentsdb_line`
documentation        | [OpenTSDB Data Specification][16]
example              | {{< code plain >}}sys.cpu.user 1356998400 42.5 host=webserver01 cpu=0{{< /code >}}

| Prometheus         |      |
---------------------|------
output metric format | `prometheus_text`
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
The Sensu agent will log errors if it cannot parse the check output.

Use the [debug handler example][24] to write metric events to a file for inspection.
To confirm that the check extracted metrics, inspect the event passed to the handler in the debug-event.json file.
The event will include a top-level [metrics section][5] populated with [metrics points arrays][25] if the Sensu agent correctly ingested the metrics.

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
[12]: https://bonsai.sensu.io/assets/sensu/sensu-go-graphite-handler
[13]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/perfdata.html
[14]: https://graphite.readthedocs.io/en/latest/feeding-carbon.html#the-plaintext-protocol
[15]: https://docs.influxdata.com/enterprise_influxdb/v1.9/write_protocols/line_protocol_reference/
[16]: http://opentsdb.net/docs/build/html/user_guide/writing/index.html#data-specification
[17]: https://prometheus.io/docs/instrumenting/exposition_formats/#text-based-format
[18]: ../../../plugins/supported-integrations/#time-series-and-long-term-event-storage
[19]: ../checks/#output-metric-format
[20]: ../../observe-events/events/#example-status-and-metrics-event
[21]: ../checks/#output_metric_tags-attributes
[22]: ../checks/#check-token-substitution
[23]: ../../observe-process/populate-metrics-influxdb/
[24]: ../../../operations/maintain-sensu/troubleshoot#use-a-debug-handler
[25]: ../../observe-events/events/#metrics-points
