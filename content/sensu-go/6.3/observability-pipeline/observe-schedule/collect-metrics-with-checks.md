---
title: "Collect service metrics with Sensu checks"
linkTitle: "Collect Service Metrics"
guide_title: "Collect service metrics with Sensu checks"
type: "guide"
description: "Sensu supports industry-standard metric formats like Nagios Performance Data, Graphite Plaintext Protocol, InfluxDB Line Protocol, and OpenTSDB Data Specification. Read this guide to collect metrics with Sensu."
weight: 50
version: "6.3"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.3:
    parent: observe-schedule
---

Sensu checks are **commands** (or scripts) that the Sensu agent executes that output data and produce an exit code to indicate a state.
If you are unfamiliar with checks or want to learn how to configure a check before reading this guide, read the [check reference][1] and [Monitor server resources][2].

This guide demonstrates how to collect disk usage metrics with a check named `collect-metrics` and configure the check to extract metrics output in Nagios Performance Data format.
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

You can also download the dynamic runtime asset definition for Debian or Alpine from [Bonsai][7] and register the asset with `sensuctl create --file filename.yml`.

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
--output-metric-format nagios_perfdata
{{< /code >}}

This example check specifies a 60-second interval for collecting metrics, a subscription to ensure the check will run on any entity that includes the `linux` subscription, and the names of the two dynamic runtime assets the check needs to work properly.
The check definition also specifies that the output metric format for the collected metrics should be `nagios_perfdata` (although you can use any of the [supported output metric formats][3]).

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
  output_metric_format: nagios_perfdata
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
    "output_metric_format": "nagios_perfdata",
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

See [Troubleshoot Sensu][10] for an example debug handler that writes events to a file for inspection.
To confirm that the check extracted metrics, inspect the event passed to the handler.

The `collect-metrics` check yields an event similar to this example:

{{< language-toggle >}}

{{< code yml >}}
---
NEEDED
{{< /code >}}

{{< code json >}}
{
  NEEDED
}
{{< /code >}}

{{< /language-toggle >}}

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
