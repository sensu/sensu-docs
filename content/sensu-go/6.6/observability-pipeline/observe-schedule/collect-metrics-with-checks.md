---
title: "Collect service metrics with Sensu checks"
linkTitle: "Collect Service Metrics"
guide_title: "Collect service metrics with Sensu checks"
type: "guide"
description: "Collect service metrics for an NGINX webserver with a Sensu check and output the metrics data in Nagios Performance Data format."
weight: 180
version: "6.6"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.6:
    parent: observe-schedule
---

Sensu checks are commands (or scripts) that the Sensu agent executes that output data and produce an exit code to indicate a state.
If you are unfamiliar with checks, read the [checks reference][1] for details and examples.
You can also learn how to configure monitoring checks in [Monitor server resources][2].

This guide demonstrates how to use a check to extract service metrics for an NGINX webserver, with output in [Nagios Performance Data][3] format.

## Requirements

To follow this guide, [install][13] the Sensu backend, make sure at least one Sensu [agent][16] is running, and install and configure [sensuctl][17].

Before you begin, add the [debug handler][10] to your Sensu instance.
The check in this guide will use it to write metric events to a file for inspection.

## Configure a Sensu entity

Every Sensu agent has a defined set of subscriptions that determine which checks the agent will execute.
For an agent to execute a specific check, you must specify the same subscription in the agent configuration and the check definition.
To run the NGINX webserver check, you'll need a Sensu entity with the subscription `webserver`.

To add the `webserver` subscription to the entity the Sensu agent is observing, first find your agent entity name:

{{< code shell >}}
sensuctl entity list
{{< /code >}}

The `ID` is the name of your entity.

Replace `<ENTITY_NAME>` with the name of your agent entity in the following sensuctl command.
Then, run:

{{< code shell >}}
sensuctl entity update <ENTITY_NAME>
{{< /code >}}

- For `Entity Class`, press enter.
- For `Subscriptions`, type `webserver` and press enter.

Confirm both Sensu services are running:

{{< code shell >}}
systemctl status sensu-backend && systemctl status sensu-agent
{{< /code >}}

The response should indicate `active (running)` for both the Sensu backend and agent.

## Register the dynamic runtime asset

To power the check to collect service metrics, you will use a check in the sensu/http-checks dynamic runtime asset.
Use sensuctl to register the sensu/http-checks dynamic runtime asset:

{{< code shell >}}
sensuctl asset add sensu/http-checks:0.5.0 -r http-checks
{{< /code >}}

The response will indicate that the asset was added:

{{< code text >}}
fetching bonsai asset: sensu/http-checks:0.5.0
added asset: sensu/http-checks:0.5.0

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["http-checks"].
{{< /code >}}

This example uses the -r (rename) flag to specify a shorter name for the dynamic runtime asset: http-checks.

Use sensuctl to confirm that both the http-checks dynamic runtime asset is ready to use:

{{< code shell >}}
sensuctl asset list
{{< /code >}}

The sensuctl response should list http-checks: 

{{< code text >}}
     Name                                       URL                                    Hash    
────────────── ───────────────────────────────────────────────────────────────────── ──────────
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.5.0_windows_amd64.tar.gz   52ae075  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.5.0_darwin_amd64.tar.gz    72d0f15  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.5.0_linux_armv7.tar.gz     ef18587  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.5.0_linux_arm64.tar.gz     3504ddf  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.5.0_linux_386.tar.gz       60b8883  
  http-checks   //assets.bonsai.sensu.io/.../http-checks_0.5.0_linux_amd64.tar.gz     1db73a8  
{{< /code >}}

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

Verify that NGINX is serving webpages:

{{< code shell >}}
curl -sI http://localhost
{{< /code >}}

The response should include `HTTP/1.1 200 OK` to indicate that NGINX processed your request as expected:

{{< code text >}}
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

## Create a check to collect metrics

Create the `collect-metrics` check with a command that uses the `http-perf` performance check from the http-checks dynamic runtime asset:

{{< code shell >}}
sensuctl check create collect-metrics \
--command 'http-perf --url http://localhost --warning 1s --critical 2s' \
--handlers debug \
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

The sensuctl response will list the complete check resource definition:

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
  handlers:
  - debug
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
    "handlers": [
      "debug"
    ],
    "high_flap_threshold": 0,
    "interval": 15,
    "low_flap_threshold": 0,
    "output_metric_format": "nagios_perfdata",
    "output_metric_handlers": null,
    "pipelines": [
    ],
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

## Confirm that your check is collecting metrics

If the check is collecting metrics correctly according to its `output_metric_format`, the metrics will be extracted in Sensu metric format and passed to the observability pipeline for handling.
The Sensu agent will log errors if it cannot parse the check output.

To confirm that the check extracted metrics, inspect the event passed to the debug handler in the debug-event.json file:

{{< code shell >}}
cat /var/log/sensu/debug-event.json
{{< /code >}}

The event will include a top-level metrics section populated with metrics points arrays if the Sensu agent correctly ingested the metrics, similar to this example:

{{< code text >}}
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

## What's next

Now that you know how to extract metrics from check output, learn to use a metrics handler to [populate service and time-series metrics in InfluxDB][5].
For a turnkey experience with the Sensu InfluxDB Handler plugin, use our curated, configurable [quick-start template][6] to integrate Sensu with your existing workflows and store Sensu metrics in InfluxDB.

Read [Monitor server resources with checks][2] to learn how to monitor an NGINX webserver rather than collect metrics.
You can also learn to use Sensu to [collect Prometheus metrics][14].

Learn more about the Sensu resources you created in this guide:

- [Checks][1]
- [Dynamic runtime assets][19]
- [Handlers][18] and [pipelines][15]
- [Subscriptions][8]

The events reference includes more information about the [metrics section][11] and [metrics points array][12].

Visit Bonsai, the Sensu asset index, for more information about the [sensu/http-checks][7] dynamic runtime asset's capabilities.


[1]: ../checks/
[2]: ../monitor-server-resources/
[3]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/perfdata.html
[4]: https://bonsai.sensu.io/assets/sensu/http-checks#http-perf
[5]: ../../observe-process/populate-metrics-influxdb/
[6]: https://github.com/sensu/catalog/blob/docs-archive/integrations/influxdb/influxdb.yaml
[7]: https://bonsai.sensu.io/assets/sensu/http-checks
[8]: ../subscriptions/
[9]: ../../../operations/monitoring-as-code/
[10]: ../../../operations/maintain-sensu/troubleshoot/#use-a-debug-handler
[11]: ../../observe-events/events/#metrics-attribute
[12]: ../../observe-events/events/#metrics-points
[13]: ../../../operations/deploy-sensu/install-sensu/
[14]: ../prometheus-metrics/
[15]: ../../observe-process/pipelines/
[16]: ../../../operations/deploy-sensu/install-sensu/#install-sensu-agents
[17]: ../../../operations/deploy-sensu/install-sensu/#install-sensuctl
[18]: ../../observe-process/handlers/
[19]: ../../../plugins/assets/
