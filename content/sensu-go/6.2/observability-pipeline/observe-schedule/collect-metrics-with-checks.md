---
title: "Collect service metrics with Sensu checks"
linkTitle: "Collect Service Metrics"
guide_title: "Collect service metrics with Sensu checks"
type: "guide"
description: "Sensu supports industry-standard metric formats like Nagios Performance Data, Graphite Plaintext Protocol, InfluxDB Line Protocol, and OpenTSDB Data Specification. Read this guide to collect metrics with Sensu."
weight: 50
version: "6.2"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.2:
    parent: observe-schedule
---

Sensu checks are **commands** (or scripts) that the Sensu agent executes that output data and produce an exit code to indicate a state.
If you are unfamiliar with checks or want to learn how to configure a check before reading this guide, read the [check reference][1] and [Monitor server resources][2].

This guide demonstrates how to collect disk usage metrics with a check named `collect-metrics` and configure the check to extract metrics output in InfluxDB Line Protocol format.
To use this guide, you'll need to install a Sensu backend and have at least one Sensu agent running on Linux.

## Register dynamic runtime assets

To power the check to collect disk usage metrics, add the [Sensu Disk Checks Plugin][7] dynamic runtime asset.
The Sensu Disk Checks Plugin asset includes the `metrics-disk-usage.rb` plugin, which your check will rely on.

The Sensu assets packaged from the Sensu Disk Checks Plugin asset are built against the Sensu Ruby runtime environment, so you also need to add the [Sensu Go Ruby Runtime Assets][8] dynamic runtime asset.
The Sensu Ruby Runtime asset delivers the Ruby executable and supporting libraries the check will need to run the `metrics-disk-usage.rb` plugin.

Use sensuctl to register the Sensu Disk Checks Plugin dynamic runtime asset, `sensu-plugins/sensu-plugins-disk-checks`:

{{< code shell >}}
sensuctl asset add sensu-plugins/sensu-plugins-disk-checks:5.1.4 -r disk-checks-plugins
fetching bonsai asset: sensu-plugins/sensu-plugins-disk-checks:5.1.4
added asset: sensu-plugins/sensu-plugins-disk-checks:5.1.4

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["disk-checks-plugins"].
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the dynamic runtime asset: `cpu-checks-plugins`.

You can also download the dynamic runtime asset definition for Debian or Alpine from [Bonsai][7] and register the asset with `sensuctl create --file filename.yml`.

Then, use the following sensuctl example to register the [Sensu Go Ruby Runtime Assets][8] dynamic runtime asset, `sensu/sensu-ruby-runtime`:

{{< code shell >}}
sensuctl asset add sensu/sensu-ruby-runtime:0.1.0 -r sensu-ruby-runtime
fetching bonsai asset: sensu/sensu-ruby-runtime:0.1.0
added asset: sensu/sensu-ruby-runtime:0.1.0

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["sensu-ruby-runtime"].
{{< /code >}}

You can also download the dynamic runtime asset definition from [Bonsai][8] and register the asset using `sensuctl create --file filename.yml`.

Use sensuctl to confirm that both the `disk-checks-plugins` and `sensu-ruby-runtime` dynamic runtime assets are ready to use:

{{< code shell >}}
sensuctl asset list
{{< /code >}}

The sensuctl response should list `disk-checks-plugins` and `sensu-ruby-runtime`: 

{{< code shell >}}
            Name                                                         URL                                                Hash    
 ────────────────────────── ───────────────────────────────────────────────────────────────────────────────────────────── ───────── 
  disk-checks-plugins        //assets.bonsai.sensu.io/.../sensu-plugins-disk-checks_5.1.4_centos8_linux_amd64.tar.gz       ac0c130  
  sensu-ruby-runtime         //assets.bonsai.sensu.io/.../sensu-ruby-runtime_0.1.0_ruby-2.4.4_centos8_linux_amd64.tar.gz   db4769f  
{{< /code >}}

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
Read [the asset reference](../../../plugins/assets#dynamic-runtime-asset-builds) for more information about dynamic runtime asset builds.
{{% /notice %}}

## Create a check to collect metrics

The Sensu Plugins Disk Checks dynamic runtime asset includes the [`metrics-disk-usage.rb`][4] plugin.
To use this plugin, create the `collect-metrics` check with a `metrics-disk-usage.rb` command.
This example also specifies a 60-second interval for collecting metrics, a subscription `linux` to ensure this check will run on any entity that also includes the `linux` subscription, and the names of the two dynamic runtime assets the check needs to work properly:

{{< code shell >}}
sensuctl check create collect-metrics \
--command 'metrics-disk-usage.rb' \
--interval 60 \
--subscriptions linux \
--runtime-assets disk-checks-plugins,sensu-ruby-runtime
{{< /code >}}

You should receive a confirmation response: `Created`.
To see the complete check definition:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl check info collect-metrics --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl check info collect-metrics --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The sensuctl response will list the complete check definition:

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
  interval: 60
  low_flap_threshold: 0
  output_metric_format: ""
  output_metric_handlers: null
  proxy_entity_name: ""
  publish: true
  round_robin: false
  runtime_assets:
  - disk-checks-plugins
  - sensu-ruby-runtime
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
    "interval": 60,
    "low_flap_threshold": 0,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "proxy_entity_name": "",
    "publish": true,
    "round_robin": false,
    "runtime_assets": [
      "disk-checks-plugins",
      "sensu-ruby-runtime"
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

## Extract metrics from check output

To extract metrics from check output, configure the check `output_metric_format` to one of the [supported output metric formats][3] (in this example, InfluxDB Line Protocol):

{{< code shell >}}
sensuctl check set-output-metric-format collect-metrics influxdb_line
{{< /code >}}

You should receive a confirmation response: `Updated`.

To view the updated check definition and confirm that it specifies `influxdb_line` as the output metric format, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl check info collect-metrics --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl check info collect-metrics --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

## Confirm that your check is collecting metrics

Use sensuctl or log into the Sensu web UI to confirm that your `collect-metrics` check is working.

To use sensuctl:

{{< code shell >}}
sensuctl event list
{{< /code >}}

You should see an event for the `collect-metrics` check for every entity with the `linux` subscription:

{{< code shell >}}
      Entity           Check                                           Output                                             Status   Silenced             Timestamp                             UUID                  
 ─────────────── ───────────────── ───────────────────────────────────────────────────────────────────────────────────── ──────── ────────── ─────────────────────────────── ────────────────────────────────────── 
  i-424242-test   collect-metrics   metrics-disk-usage.rb last sent from i-424242-test at 2021-02-08 14:55:10 -0500 EST        0   false      2021-02-08 14:55:10 -0500 EST   63c91615-6438-4f24-992b-04f616d6f917  
{{< /code >}}

To confirm in the web UI, open `http://localhost:3000/`.
Navigate to the **Events** page and search for passing checks: `event.check.state == passing`.
The `collect-metrics` check should be listed on that page.

The `collect-metrics` check yields an event similar to this example:

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
    output_metric_format: nagios_perfdata
    output_metric_handlers:
    - prometheus_gateway
    output_metric_tags:
    - name: instance
      value: '{{ .name }}'
    - name: prometheus_type
      value: gauge
    - name: service
      value: '{{ .labels.service }}'
  metrics:
    handlers:
    - prometheus_gateway
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
      "output_metric_format": "nagios_perfdata",
      "output_metric_handlers": [
        "prometheus_gateway"
      ],
      "output_metric_tags": [
        {
          "name": "instance",
          "value": "{{ .name }}"
        },
        {
          "name": "prometheus_type",
          "value": "gauge"
        },
        {
          "name": "service",
          "value": "{{ .labels.service }}"
        }
      ]
    },
    "metrics": {
      "handlers": [
        "prometheus_gateway"
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

## Next step: Send metrics to a handler

Now that you know how to extract metrics from check output, learn to use Sensu handlers to [populate metrics in InfluxDB][5].
For a turnkey experience with the Sensu InfluxDB Handler plugin, use our curated, configurable [quick-start template][6] to integrate Sensu with your existing workflows and store Sensu metrics in InfluxDB.


[1]: ../checks/
[2]: ../monitor-server-resources/
[3]: ../metrics/#supported-output-metric-formats
[4]: https://github.com/sensu-plugins/sensu-plugins-disk-checks/blob/master/bin/metrics-disk-usage.rb
[5]: ../../observe-process/populate-metrics-influxdb/
[6]: https://github.com/sensu-community/monitoring-pipelines/blob/latest/metric-storage/influxdb.yaml
[7]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-disk-checks
[8]: https://bonsai.sensu.io/assets/sensu/sensu-ruby-runtime
