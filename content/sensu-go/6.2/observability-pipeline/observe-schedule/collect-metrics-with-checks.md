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

This guide demonstrates how to collect disk usage metrics with a check named `collect-metrics` and configure the check to extract metrics output in Graphite Plaintext Protocol format.
To use this guide, you'll need to install a Sensu backend and have at least one Sensu agent running on Linux.
In this guide, the Sensu agent is named `sensu-centos`.

## Register dynamic runtime assets

To power the check to collect disk usage metrics, add the [Sensu Disk Checks Plugin][7] dynamic runtime asset.
The Sensu Disk Checks Plugin asset includes the `metrics-disk-usage.rb` plugin, which your check will rely on.

The Sensu assets packaged from the Sensu Disk Checks Plugin asset are built against the Sensu Ruby runtime environment, so you also need to add the [Sensu Go Ruby Runtime Assets][8] dynamic runtime asset.
The Sensu Ruby Runtime asset delivers the Ruby executable and supporting libraries the check will need to run the `metrics-disk-usage.rb` plugin.

Use sensuctl to register the Sensu Disk Checks Plugin dynamic runtime asset, `sensu-plugins/sensu-plugins-disk-checks`:

{{< code shell >}}
sensuctl asset add sensu-plugins/sensu-plugins-disk-checks:5.1.4
{{< /code >}}

The response will indicate that the asset was added:

{{< code shell >}}
fetching bonsai asset: sensu-plugins/sensu-plugins-disk-checks:5.1.4
added asset: sensu-plugins/sensu-plugins-disk-checks:5.1.4

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["sensu-plugins/sensu-plugins-disk-checks"].
{{< /code >}}

You can also download the dynamic runtime asset definition from [Bonsai][7] and register the asset with `sensuctl create --file filename.yml`.

Then, use the following sensuctl example to register the [Sensu Go Ruby Runtime Assets][8] dynamic runtime asset, `sensu/sensu-ruby-runtime`:

{{< code shell >}}
sensuctl asset add sensu/sensu-ruby-runtime:0.1.0
{{< /code >}}

Again, you will see an `added asset` response.

Use sensuctl to confirm that both the `disk-checks-plugins` and `sensu-ruby-runtime` dynamic runtime assets are ready to use:

{{< code shell >}}
sensuctl asset list
{{< /code >}}

The sensuctl response should list `sensu-plugins/disk-checks-plugins` and `sensu/sensu-ruby-runtime`: 

{{< code shell >}}
                   Name                                                                 URL                                                Hash    
 ───────────────────────────────────────── ───────────────────────────────────────────────────────────────────────────────────────────── ───────── 
  sensu-plugins/sensu-plugins-disk-checks   //assets.bonsai.sensu.io/.../sensu-plugins-disk-checks_5.1.4_centos8_linux_amd64.tar.gz       ac0c130  
  sensu-plugins/sensu-plugins-disk-checks   //assets.bonsai.sensu.io/.../sensu-plugins-disk-checks_5.1.4_centos7_linux_amd64.tar.gz       81af33b  
  sensu-plugins/sensu-plugins-disk-checks   //assets.bonsai.sensu.io/.../sensu-plugins-disk-checks_5.1.4_centos6_linux_amd64.tar.gz       e909a10  
  sensu-plugins/sensu-plugins-disk-checks   //assets.bonsai.sensu.io/.../sensu-plugins-disk-checks_5.1.4_debian_linux_amd64.tar.gz        a10b824  
  sensu-plugins/sensu-plugins-disk-checks   //assets.bonsai.sensu.io/.../sensu-plugins-disk-checks_5.1.4_alpine_linux_amd64.tar.gz        cb95031  
  sensu/sensu-ruby-runtime                  //assets.bonsai.sensu.io/.../sensu-ruby-runtime_0.1.0_ruby-2.4.4_amzn2_linux_amd64.tar.gz     a83aaa5  
  sensu/sensu-ruby-runtime                  //assets.bonsai.sensu.io/.../sensu-ruby-runtime_0.1.0_ruby-2.4.4_amzn1_linux_amd64.tar.gz     7b504f0  
  sensu/sensu-ruby-runtime                  //assets.bonsai.sensu.io/.../sensu-ruby-runtime_0.1.0_ruby-2.4.4_centos8_linux_amd64.tar.gz   db4769f  
  sensu/sensu-ruby-runtime                  //assets.bonsai.sensu.io/.../sensu-ruby-runtime_0.1.0_ruby-2.4.4_centos7_linux_amd64.tar.gz   2d78004  
  sensu/sensu-ruby-runtime                  //assets.bonsai.sensu.io/.../sensu-ruby-runtime_0.1.0_ruby-2.4.4_debian_linux_amd64.tar.gz    956806a  
  sensu/sensu-ruby-runtime                  //assets.bonsai.sensu.io/.../sensu-ruby-runtime_0.1.0_ruby-2.4.4_alpine_linux_amd64.tar.gz    15af366  
{{< /code >}}

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
Read [the asset reference](../../../plugins/assets#dynamic-runtime-asset-builds) for more information about dynamic runtime asset builds.
{{% /notice %}}

## Create a check to collect metrics

The Sensu Plugins Disk Checks dynamic runtime asset includes the [`metrics-disk-usage.rb`][4] plugin.
To use this plugin, create the `collect-metrics` check with a `metrics-disk-usage.rb` command:

{{< code shell >}}
sensuctl check create collect-metrics \
--command 'metrics-disk-usage.rb' \
--interval 60 \
--subscriptions linux \
--runtime-assets sensu-plugins/sensu-plugins-disk-checks,sensu/sensu-ruby-runtime \
--output-metric-format graphite_plaintext
{{< /code >}}

This example check specifies a 60-second interval for collecting metrics, a subscription to ensure the check will run on any entity that includes the `linux` subscription, and the names of the two dynamic runtime assets the check needs to work properly.
The check definition also specifies that the output metric format for the collected metrics should be `graphite_plaintext` (although you can use any of the [supported output metric formats][3]).

You should receive a confirmation response: `Created`.

To see the check resource you just created with sensuctl, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl check info collect-metrics --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl check info collect-metrics --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The sensuctl response will list the complete check resource definition &mdash; you can add it to your [monitoring as code][9] repository:

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
  output_metric_format: graphite_plaintext
  output_metric_handlers: null
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
    "interval": 60,
    "low_flap_threshold": 0,
    "output_metric_format": "graphite_plaintext",
    "output_metric_handlers": null,
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

## Confirm that your check is collecting metrics

If the check output is formatted correctly according to its `output_metric_format`, the metrics will be extracted in Sensu metric format and passed to the observability pipeline for handling.
The Sensu agent will log errors if it cannot parse the check output.

Add a [debug handler][10] to write metric events to a file for inspection.
To confirm that the check extracted metrics, inspect the event passed to the handler in the debug-event.json file.
The event will include a top-level [metrics section][11] populated with [metrics points arrays][12] if the Sensu agent correctly ingested the metrics.

If you add the debug handler and configure the `collect-metrics` check to use it, the metrics event printed to the debug-event.json file will be similar to this example:

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
    "output_metric_handlers": null,
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

## Next step: Send metrics to a handler

Now that you know how to extract metrics from check output, learn to use a metrics handler to [populate service and time-series metrics in InfluxDB][5].
For a turnkey experience with the Sensu InfluxDB Handler plugin, use our curated, configurable [quick-start template][6] to integrate Sensu with your existing workflows and store Sensu metrics in InfluxDB.


[1]: ../checks/
[2]: ../monitor-server-resources/
[3]: ../metrics/#supported-output-metric-formats
[4]: https://github.com/sensu-plugins/sensu-plugins-disk-checks/blob/master/bin/metrics-disk-usage.rb
[5]: ../../observe-process/populate-metrics-influxdb/
[6]: https://github.com/sensu/catalog/blob/main/pipelines/metric-storage/influxdb.yaml
[7]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-disk-checks
[8]: https://bonsai.sensu.io/assets/sensu/sensu-ruby-runtime
[9]: ../../../operations/monitoring-as-code/
[10]: ../../../operations/maintain-sensu/troubleshoot/#use-a-debug-handler
[11]: ../../observe-events/events/#metrics-attribute
[12]: ../../observe-events/events/#metrics-points
