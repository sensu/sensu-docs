---
title: "Monitor a webserver with Sensu"
linkTitle: "Monitor a Webserver"
guide_title: "Monitor a webserver with Sensu"
type: "guide"
description: "The Sensu Prometheus Collector is a check plugin that collects metrics from a Prometheus exporter or the Prometheus query API. Follow this guide to monitor an Nginx webserver with Sensu."
weight: 55
version: "6.2"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.2:
    parent: observe-schedule
---

Follow this guide to monitor the local Nginx service.

## Install and configure Sensu

Follow the RHEL/CentOS [install instructions][4] for the Sensu backend, the Sensu agent, and sensuctl.

This guide is designed to work with the default backend configuration, so you don't need to make any changes to it.
You *will* need to make a couple adjustments to your Sensu agent entity.

Every Sensu agent has a defined set of [subscriptions][16] that determine which checks the agent will execute.
For an agent to execute a specific check, you must specify the same subscription in the agent configuration and the check definition.
In this case, you're configuring Sensu to monitor an Nginx webserver, so you need to add `webserver` to the agent subscriptions.

Find your agent entity name:

{{< code shell >}}
sensuctl entity list
{{< /code >}}

The `ID` is the name of your entity.

Replace `ENTITY_NAME` with the name of your agent entity in the following [sensuctl][15] command.
Run:

{{< code shell >}}
sensuctl entity update ENTITY_NAME
{{< /code >}}

- For `Entity Class`, press enter.
- For `Subscriptions`, type `webserver` and press enter.

Run this command to confirm both Sensu services are running:

{{< code shell >}}
systemctl status sensu-backend && systemctl status sensu-agent
{{< /code >}}

## Install and configure NGINX

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
Server: nginx/1.16.1
Date: Wed, 17 Mar 2021 20:51:53 GMT
Content-Type: text/html
Content-Length: 4833
Last-Modified: Fri, 16 May 2014 15:12:48 GMT
Connection: keep-alive
ETag: "73762nw0-12e1"
Accept-Ranges: bytes
{{< /code >}}

With your NGINX service running, you can configure a check.

## Create a check to monitor the NGINX webserver

The Sensu backend schedules check execution requests based on check definitions.
Basically, check definitions define:

* What to run (the `command` attribute)
* Which agents should run it (the list of `subscriptions`)
* When to run it (`interval` or `cron`)

Checks generate observability data in status or metric [events][] for the resources you are monitoring.

Run the following command to see a list of events:

{{< code shell >}}
sensuctl event list
{{< /code >}}

You started the Sensu backend and agent when you installed Sensu, but you haven't configured any checks yet, so the response will include only the keepalive for your agent entity:

{{< code shell >}}
     Entity        Check                                     Output                                   Status   Silenced             Timestamp                             UUID                  
 ────────────── ─────────── ──────────────────────────────────────────────────────────────────────── ──────── ────────── ─────────────────────────────── ────────────────────────────────────── 
  host01         keepalive   Keepalive last sent from host01 at 2021-03-17 20:34:49 +0000 UTC              0   false      2021-03-17 20:34:49 +0000 UTC   dcs4b9f9-26b4-45f8-bf4a-8da06782776b
{{< /code >}}

You can write shell scripts in the `command` field of the check definition, but we recommend using existing check [plugins][] instead.
Check plugins must be available on the host where the agent is running for the agent to execute the check.
There are many ways to manage plugin installation, but we recommend using [dynamic runtime assets][11].

### Add the Nagios dynamic runtime asset

To streamline plugin deployment, the Sensu agent will automatically download and execute archives that contain one or more plugins as required to execute a check.
Asset definitions specify a name, URL, and checksum to verify the archive.

[Bonsai][] is the Sensu dynamic runtime asset index.
The [sensuctl][] CLI tool integrates with Bonsai via the `asset add` command to import asset definitions from Bonsai directly into your Sensu backend configuration.

For your NGINX webserver check, add the [nagiosfoundation check plugin collection][]:

{{< code shell >}}
sensuctl asset add ncr-devops-platform/nagiosfoundation 
{{< /code >}}

This makes a collection of check plugins available as an asset via the name `ncr-devops-platform/nagiosfoundation`.

To view the installed asset definitions, run:

{{< code shell >}}
sensuctl asset list
{{< /code >}}

Because this collection of plugins is published for multiple platforms, including Linux and Windows, the output will list multiple entries for `ncr-devops-platform/nagiosfoundation`.

### Create the check

The nagiosfoundation collection includes a number of check plugins.
This service check uses the [`check_service`][] plugin, which determines whether a named service is in a running state.

Create a file named `check.yml` or `check.json` that contains the following [check][] definition:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: nginx_service
  namespace: default
spec:
  command: check_service --name nginx
  interval: 15
  publish: true
  subscriptions:
  - webserver
  handlers: null
  runtime_assets:
  - nagiosfoundation
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "nginx_service",
    "namespace": "default"
  },
  "spec": {
    "command": "check_service --name nginx",
    "interval": 15,
    "publish": true,
    "subscriptions": [
      "webserver"
    ],
    "handlers": null,
    "runtime_assets": [
      "nagiosfoundation"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

Use `sensuctl` to add the handler and dynamic runtime asset to Sensu:

{{< language-toggle >}}

{{< code shell "YAML" >}}
sensuctl create --file check.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl create --file check.json
{{< /code >}}

{{< /language-toggle >}}

## Collect Prometheus metrics with Sensu

### Create a Sensu Prometheus Collector asset

Create a file named `asset_prometheus.yml` or `asset_prometheus.json` that contains the following [dynamic runtime asset][11] definition:

{{< language-toggle >}}

{{< code yml >}}
---
type: Asset
api_version: core/v2
metadata:
  name: sensu-prometheus-collector
  namespace: default
spec:
  url: https://assets.bonsai.sensu.io/ef812286f59de36a40e51178024b81c69666e1b7/sensu-prometheus-collector_1.1.6_linux_amd64.tar.gz
  sha512: a70056ca02662fbf2999460f6be93f174c7e09c5a8b12efc7cc42ce1ccb5570ee0f328a2dd8223f506df3b5972f7f521728f7bdd6abf9f6ca2234d690aeb3808
{{< /code >}}

{{< code json >}}
{
  "type": "Asset",
  "api_version": "core/v2",
  "metadata": {
    "name": "sensu-prometheus-collector",
    "namespace": "default"
  },
  "spec": {
    "url": "https://assets.bonsai.sensu.io/ef812286f59de36a40e51178024b81c69666e1b7/sensu-prometheus-collector_1.1.6_linux_amd64.tar.gz",
    "sha512": "a70056ca02662fbf2999460f6be93f174c7e09c5a8b12efc7cc42ce1ccb5570ee0f328a2dd8223f506df3b5972f7f521728f7bdd6abf9f6ca2234d690aeb3808"
  }
}
{{< /code >}}

{{< /language-toggle >}}

### Add a Sensu check to complete the pipeline

Create a file named `check.yml` or `check.json` that contains the following [check][13] definition:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: prometheus_metrics
  namespace: default
spec:
  command: "sensu-prometheus-collector -prom-url http://localhost:9090 -prom-query up"
  handlers:
  - influxdb
  interval: 10
  publish: true
  output_metric_format: influxdb_line
  output_metric_handlers: []
  subscriptions:
  - app_tier
  timeout: 0
  runtime_assets:
  - sensu-prometheus-collector

{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "prometheus_metrics",
    "namespace": "default"
  },
  "spec": {
    "command": "sensu-prometheus-collector -prom-url http://localhost:9090 -prom-query up",
    "handlers": [
      "influxdb"
    ],
    "interval": 10,
    "publish": true,
    "output_metric_format": "influxdb_line",
    "output_metric_handlers": [],
    "subscriptions": [
      "app_tier"
    ],
    "timeout": 0,
    "runtime_assets": [
      "sensu-prometheus-collector"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

The check subscription matches the [subscription][16] you added to your entity during [set-up][17].
The Sensu backend will coordinate check execution for you by comparing the subscriptions in your checks and entities.
Sensu automatically executes a check when the check definition includes a subscription that matches a subscription for a Sensu entity.

Use `sensuctl` to add the check and dynamic runtime asset to Sensu:

{{< language-toggle >}}

{{< code shell "YAML" >}}
sensuctl create --file check.yml --file asset_prometheus.yml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl create --file check.json --file asset_prometheus.json
{{< /code >}}

{{< /language-toggle >}}

Open the Sensu [web UI][14] to see the events generated by the `prometheus_metrics` check.
Visit http://127.0.0.1:3000, and log in as the admin user (created during the [initialization step][8] when you installed the Sensu backend).

You can also see the metric event data using sensuctl.
Run:

{{< code shell >}}
sensuctl event list
{{< /code >}}

The response should be similar to this example:

{{< code shell >}}
    Entity            Check                                          Output                                   Status   Silenced             Timestamp            
────────────── ──────────────────── ──────────────────────────────────────────────────────────────────────── ──────── ────────── ─────────────────────────────── 
sensu-centos   keepalive            Keepalive last sent from sensu-centos at 2019-02-12 01:01:37 +0000 UTC        0   false      2019-02-12 01:01:37 +0000 UTC  
sensu-centos   prometheus_metrics   up,instance=localhost:9090,job=prometheus value=1 1549933306                  0   false      2019-02-12 01:01:46 +0000 UTC  
{{< /code >}}

## Visualize metrics with Grafana

### Configure a dashboard in Grafana

Download the Grafana dashboard configuration file from the Sensu docs:

{{< code shell >}}
wget https://docs.sensu.io/sensu-go/latest/files/up_or_down_dashboard.json
{{< /code >}}

Using the downloaded file, add the dashboard to Grafana with an API call:

{{< code shell >}}
curl  -XPOST -H 'Content-Type: application/json' -d@up_or_down_dashboard.json HTTP://admin:admin@127.0.0.1:4000/api/dashboards/db
{{< /code >}}

### View metrics in Grafana

Confirm metrics in Grafana: login at http://127.0.0.1:4000.
Use `admin` for both username and password.

Click **Home** in the upper left corner, then click the **Up or Down Sample 2** dashboard.
You should see a graph with initial metrics, similar to:

![up_or_down_detail](/images/prometheus-collector/up_or_down_detail.png)

## Next steps

You should now have a working observability pipeline with Prometheus scraping metrics.
In this pipeline, Sensu Prometheus Collector dynamic runtime asset runs via the `prometheus_metrics` Sensu check and collects metrics from the Prometheus API.
The `influxdb` handler sends the metrics to InfluxDB, and you can visualize the metrics in a Grafana dashboard.

Add the [Sensu Prometheus Collector][1] to your Sensu ecosystem and include it in your [monitoring as code][9] repository.
Use Prometheus to gather metrics and use Sensu to send them to the proper final destination.
Prometheus has a [comprehensive list][7] of additional exporters to pull in metrics.


[1]: ../../../plugins/supported-integrations/prometheus/#sensu-prometheus-collector
[2]: https://prometheus.io/docs/instrumenting/exporters/
[3]: https://prometheus.io/docs/prometheus/latest/querying/api/
[4]: ../../../operations/deploy-sensu/install-sensu/
[5]: https://github.com/prometheus/node_exporter/
[6]: https://github.com/google/cadvisor/
[7]: https://prometheus.io/docs/instrumenting/exporters/
[8]: ../../../operations/deploy-sensu/install-sensu/#3-initialize
[9]: ../../../operations/monitoring-as-code/
[10]: ../metrics/
[11]: ../../../plugins/assets/
[12]: ../../observe-process/handlers/
[13]: ../checks/
[14]: ../../../web-ui/
[15]: ../../../sensuctl/
[16]: ../subscriptions/
https://github.com/ncr-devops-platform/nagiosfoundation/blob/master/cmd/check_service/README.md
