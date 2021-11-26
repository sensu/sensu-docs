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
If you are unfamiliar with checks, read the [checks reference][1] for details and examples.
You can also learn how to configure monitoring checks in [Monitor server resources][2].

This guide demonstrates how to use a check to extract service metrics for an NGINX webserver, with output in [Nagios Performance Data][3] format.
To use this guide, [install][13] a Sensu backend and have at least one Sensu agent running on Linux.
In this guide, the Sensu agent is named `sensu-centos`.

## Register the dynamic runtime asset

To power the check to collect service metrics, you will use a check in the [http-checks][7] dynamic runtime asset.
Use sensuctl to register the http-checks dynamic runtime asset, `sensu/http-checks`:

{{< code shell >}}
sensuctl asset add sensu/http-checks:0.4.0 -r http-checks
{{< /code >}}

The response will indicate that the asset was added:

{{< code shell >}}
fetching bonsai asset: sensu/http-checks:0.4.0
added asset: sensu/http-checks:0.4.0

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["http-checks"].
{{< /code >}}

This example uses the -r (rename) flag to specify a shorter name for the dynamic runtime asset: http-checks.

You can also download the dynamic runtime asset definition from [Bonsai][7] and register the asset with `sensuctl create --file filename.yml`.

Use sensuctl to confirm that both the http-checks dynamic runtime asset is ready to use:

{{< code shell >}}
sensuctl asset list
{{< /code >}}

The sensuctl response should list http-checks: 

{{< code shell >}}
     Name                                       URL                                    Hash    
────────────── ───────────────────────────────────────────────────────────────────── ──────────
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.4.0_windows_amd64.tar.gz   52ae075  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.4.0_darwin_amd64.tar.gz    72d0f15  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.4.0_linux_armv7.tar.gz     ef18587  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.4.0_linux_arm64.tar.gz     3504ddf  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.4.0_linux_386.tar.gz       60b8883  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.4.0_linux_amd64.tar.gz     1db73a8  
{{< /code >}}

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
Read [the asset reference](../../../plugins/assets#dynamic-runtime-asset-builds) for more information about dynamic runtime asset builds.
{{% /notice %}}

## Configure entity subscriptions

Every Sensu agent has a defined set of [subscriptions][8] that determine which checks the agent will execute.
For an agent to execute a specific check, you must specify the same subscription in the agent configuration and the check definition.
To run the NGINX webserver check, you'll need a Sensu agent with the subscription `webserver`.

To add the `webserver` subscription to the entity the Sensu agent is observing, first find your agent entity name:

{{< code shell >}}
sensuctl entity list
{{< /code >}}

The `ID` is the name of your entity.

Replace `<entity_name>` with the name of your agent entity in the following [sensuctl][17] command.
Run:

{{< code shell >}}
sensuctl entity update <entity_name>
{{< /code >}}

- For `Entity Class`, press enter.
- For `Subscriptions`, type `webserver` and press enter.

## Install and configure NGINX

The webserver check requires a running NGINX service, so you'll need to install and configure NGINX.

{{% notice note %}}
**NOTE**: You may need to install and update the EPEL repository with `sudo yum install epel-release` and `sudo yum update` before you can install NGINX.
{{% /notice %}}

Install NGINX:

{{< code shell >}}
sudo yum install nginx
{{< /code >}}

Enable and start the NGINX service:

{{< code shell >}}
systemctl enable nginx && systemctl start nginx
{{< /code >}}

Verify that Nginx is serving webpages:

{{< code shell >}}
curl -sI http://localhost
{{< /code >}}

The response should include `HTTP/1.1 200 OK` to indicates that NGINX processed your request as expected:

{{< code shell >}}
HTTP/1.1 200 OK
Server: nginx/1.20.1
Date: Tue, 02 Nov 2021 20:15:40 GMT
Content-Type: text/html
Content-Length: 4833
Last-Modified: Fri, 16 May 2014 15:12:48 GMT
Connection: keep-alive
ETag: "xxxxxxxx-xxxx"
Accept-Ranges: bytes
{{< /code >}}

With your NGINX service running, you can configure the check to collect service metrics.

{{% notice note %}}
**NOTE**: Read [Monitor server resources with checks](../monitor-server-resources/) to learn how to [monitor an NGINX webserver](../monitor-server-resources/#create-a-check-to-monitor-a-webserver) rather than collect metrics.
{{% /notice %}}

## Create a check to collect metrics

The http-checks dynamic runtime asset includes the [`http-perf`][4] check.
To use this check, create the `collect-metrics` check with a command that uses `http-perf`:

{{< code shell >}}
sensuctl check create collect-metrics \
--command 'http-perf --url http://localhost --warning 1s --critical 2s' \
--interval 15 \
--subscriptions webserver \
--runtime-assets http-checks \
--output-metric-format nagios_perfdata
{{< /code >}}

This example check specifies a 15-second interval for collecting metrics, a subscription to ensure the check will run on any entity that includes the `webserver` subscription, the name of the dynamic runtime asset the check needs to work properly, and the `nagios_perfdata` output metric format.

You should receive a confirmation response: `Created`.

To view the check resource you just created with sensuctl, run:

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
  command: http-perf --url http://localhost --warning 1s --critical 2s
  env_vars: null
  handlers: []
  high_flap_threshold: 0
  interval: 15
  low_flap_threshold: 0
  output_metric_format: nagios_perfdata
  output_metric_handlers: null
  pipelines: []
  proxy_entity_name: ""
  publish: true
  round_robin: false
  runtime_assets:
  - http-checks
  secrets: null
  stdin: false
  subdue: null
  subscriptions:
  - webserver
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
    "command": "http-perf --url http://localhost --warning 1s --critical 2s",
    "env_vars": null,
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 15,
    "low_flap_threshold": 0,
    "output_metric_format": "nagios_perfdata",
    "output_metric_handlers": null,
    "pipelines": [],
    "proxy_entity_name": "",
    "publish": true,
    "round_robin": false,
    "runtime_assets": [
      "http-checks"
    ],
    "secrets": null,
    "stdin": false,
    "subdue": null,
    "subscriptions": [
      "webserver"
    ],
    "timeout": 0,
    "ttl": 0
  }
}
{{< /code >}}

{{< /language-toggle >}}

{{% notice protip %}}
**PRO TIP**: You can also [view complete resource definitions in the Sensu web UI](../../../web-ui/view-manage-resources/#view-resource-data-in-the-web-ui).
{{% /notice %}}

## Confirm that your check is collecting metrics

If the check is collecting metrics correctly according to its `output_metric_format`, the metrics will be extracted in Sensu metric format and passed to the observability pipeline for handling.
The Sensu agent will log errors if it cannot parse the check output.

Add a [debug handler][10] to write metric events to a file for inspection.
To confirm that the check extracted metrics, inspect the event passed to the handler in the debug-event.json file.
The event will include a top-level [metrics section][11] populated with [metrics points arrays][12] if the Sensu agent correctly ingested the metrics.

If you add the debug handler and configure the `collect-metrics` check to use it, the metrics event printed to the debug-event.json file will be similar to this example:

{{< code json >}}
{
  "check": {
    "command": "http-perf --url http://localhost --warning 1s --critical 2s",
    "handlers": [
      "debug"
    ],
    "high_flap_threshold": 0,
    "interval": 15,
    "low_flap_threshold": 0,
    "publish": true,
    "runtime_assets": [
      "http-checks"
    ],
    "subscriptions": [
      "webserver"
    ],
    "proxy_entity_name": "",
    "check_hooks": null,
    "stdin": false,
    "subdue": null,
    "ttl": 0,
    "timeout": 0,
    "round_robin": false,
    "duration": 0.011235081,
    "executed": 1635886845,
    "history": [
      {
        "status": 0,
        "executed": 1635886785
      },
      {
        "status": 0,
        "executed": 1635886800
      },
      {
        "status": 0,
        "executed": 1635886815
      },
      {
        "status": 0,
        "executed": 1635886830
      },
      {
        "status": 0,
        "executed": 1635886845
      }
    ],
    "issued": 1635886845,
    "output": "http-perf OK: 0.001088s | dns_duration=0.000216, tls_handshake_duration=0.000000, connect_duration=0.000140, first_byte_duration=0.001071, total_request_duration=0.001088\n",
    "state": "passing",
    "status": 0,
    "total_state_change": 0,
    "last_ok": 1635886845,
    "occurrences": 5,
    "occurrences_watermark": 5,
    "output_metric_format": "nagios_perfdata",
    "output_metric_handlers": null,
    "env_vars": null,
    "metadata": {
      "name": "collect-metrics",
      "namespace": "default"
    },
    "secrets": null,
    "is_silenced": false,
    "scheduler": "memory",
    "processed_by": "sensu-centos",
    "pipelines": []
  },
  "metrics": {
    "handlers": null,
    "points": [
      {
        "name": "dns_duration",
        "value": 0.000216,
        "timestamp": 1635886845,
        "tags": null
      },
      {
        "name": "tls_handshake_duration",
        "value": 0,
        "timestamp": 1635886845,
        "tags": null
      },
      {
        "name": "connect_duration",
        "value": 0.00014,
        "timestamp": 1635886845,
        "tags": null
      },
      {
        "name": "first_byte_duration",
        "value": 0.001071,
        "timestamp": 1635886845,
        "tags": null
      },
      {
        "name": "total_request_duration",
        "value": 0.001088,
        "timestamp": 1635886845,
        "tags": null
      }
    ]
  },
  "metadata": {
    "namespace": "default"
  },
  "id": "d19ee7f9-8cc5-447b-9059-895e89e14667",
  "sequence": 146,
  "pipelines": null,
  "timestamp": 1635886845,
  "entity": {
    "entity_class": "agent",
    "system": {
      "hostname": "sensu-centos",
      "os": "linux",
      "platform": "centos",
      "platform_family": "rhel",
      "platform_version": "7.9.2009",
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
              "fe80::20b8:8cea:fa4:2e57/64"
            ]
          },
          {
            "name": "eth1",
            "mac": "08:00:27:40:ab:31",
            "addresses": [
              "192.168.200.95/24",
              "fe80::a00:27ff:fe40:ab31/64"
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
      "webserver",
      "entity:sensu-centos"
    ],
    "last_seen": 1635886845,
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
    "sensu_agent_version": "6.5.4"
  }
}
{{< /code >}}

## Next step: Send metrics to a handler

Now that you know how to extract metrics from check output, learn to use a metrics handler to [populate service and time-series metrics in InfluxDB][5].
For a turnkey experience with the Sensu InfluxDB Handler plugin, use our curated, configurable [quick-start template][6] to integrate Sensu with your existing workflows and store Sensu metrics in InfluxDB.

You can also learn to use Sensu to [collect Prometheus metrics][14].


[1]: ../checks/
[2]: ../monitor-server-resources/
[3]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/perfdata.html
[4]: https://bonsai.sensu.io/assets/sensu/http-checks#http-perf
[5]: ../../observe-process/populate-metrics-influxdb/
[6]: https://github.com/sensu/catalog/blob/main/pipelines/metric-storage/influxdb.yaml
[7]: https://bonsai.sensu.io/assets/sensu/http-checks
[8]: ../subscriptions/
[9]: ../../../operations/monitoring-as-code/
[10]: ../../../operations/maintain-sensu/troubleshoot/#use-a-debug-handler
[11]: ../../observe-events/events/#metrics-attribute
[12]: ../../observe-events/events/#metrics-points
[13]: ../../../operations/deploy-sensu/install-sensu/
[14]: ../prometheus-metrics/
