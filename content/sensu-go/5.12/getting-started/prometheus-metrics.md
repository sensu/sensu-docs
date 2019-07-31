---
title: "Using the Sensu Prometheus Collector"
version: "5.12"
description: "The Sensu Prometheus Collector is a check plugin that collects metrics from a Prometheus exporter or the Prometheus query API. This allows Sensu to route the collected metrics to a time series database, like InfluxDB. Follow the guide to get started collecting Prometheus metrics with Sensu."
product: "Sensu Go"
platformContent: false
---

- [Set up](#set-up)
  - [Install and configure Prometheus](#install-and-configure-prometheus)
  - [Install and configure Sensu Go](#install-and-configure-sensu-go)
  - [Install and configure InfluxDB](#install-and-configure-influxdb)
  - [Install and configure Grafana](#install-and-configure-grafana)
- [Create a Sensu InfluxDB pipeline](#create-a-sensu-influxdb-pipeline)
  - [Install Sensu InfluxDB handler](#install-sensu-influxdb-handler)
  - [Create a Sensu handler](#create-a-sensu-handler)
- [Collect Prometheus metrics with Sensu](#collect-prometheus-metrics-with-sensu)
  - [Install Sensu Prometheus Collector](#install-sensu-prometheus-collector)
  - [Add a Sensu check to complete the pipeline](#add-a-sensu-check-to-complete-the-pipeline)
- [Visualize metrics with Grafana](#visualize-metrics-with-grafana)
  - [Configure a dashboard in Grafana](#configure-a-dashboard-in-grafana)
  - [View metrics in Grafana](#view-metrics-in-grafana)

## What is the Sensu Prometheus Collector?

The [Sensu Prometheus Collector][1] is a check plugin that collects metrics from a [Prometheus exporter][2] or the [Prometheus query API][3]. This allows Sensu to route the collected metrics to one or more time series databases, such as InfluxDB or Graphite.

## Why use Sensu with Prometheus?

The Prometheus ecosystem contains a number of actively maintained exporters, such as the [node exporter][5] for reporting hardware and operating system metrics or Google's [cAdvisor exporter][6] for monitoring containers. These exporters expose metrics which Sensu can collect and route to one or more time series databases, such as InfluxDB or Graphite. Both Sensu and Prometheus can run in parallel, complementing each other and making use of environments where Prometheus is already deployed.  

## In this guide

This guide uses CentOS 7 as the operating system with all components running on the same compute resource. Commands and steps may change for different distributions or if components are running on different compute resources.

At the end, you will have Prometheus scraping metrics. The Sensu Prometheus Collector will then query the Prometheus API as a Sensu check, send those to an InfluxDB Sensu handler, which will send metrics to an InfluxDB instance. Finally, Grafana will query InfluxDB to display those collected metrics.

## Set up

### Install and configure Prometheus

Download and extract Prometheus.

{{< highlight shell >}}
wget https://github.com/prometheus/prometheus/releases/download/v2.6.0/prometheus-2.6.0.linux-amd64.tar.gz

tar xvfz prometheus-*.tar.gz

cd prometheus-*
{{< /highlight >}}

Replace the default `prometheus.yml` configuration file with the following configuration.

{{< highlight shell >}}
global:
  scrape_interval: 15s
  external_labels:
    monitor: 'codelab-monitor'

scrape_configs:
  - job_name: 'prometheus'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:9090']
{{< /highlight >}}

Start Prometheus in the background.

{{< highlight shell >}}
nohup ./prometheus --config.file=prometheus.yml > prometheus.log 2>&1 &
{{< /highlight >}}

Ensure Prometheus is running. The matching result will vary slightly.

{{< highlight shell >}}
ps -ef | grep "[p]rometheus"
vagrant   7647  3937  2 22:23 pts/0    00:00:00 ./prometheus --config.file=prometheus.yml
{{< /highlight >}}

### Install and configure Sensu Go

Follow the RHEL/CentOS [install instructions][4] for the Sensu backend, Sensu agent and sensuctl.

Add an `app_tier` subscription to `/etc/sensu/agent.yml`.

{{< highlight shell >}}
subscriptions:
  - "app_tier"
{{< /highlight >}}

Restart the sensu agent to apply the configuration change.

{{< highlight shell >}}
sudo systemctl restart sensu-agent
{{< /highlight >}}

Ensure Sensu services are running.

{{< highlight shell >}}
systemctl status sensu-backend
systemctl status sensu-agent
{{< /highlight >}}

### Install and configure InfluxDB

Add InfluxDB repo.

{{< highlight shell >}}
echo "[influxdb]
name = InfluxDB Repository - RHEL \$releasever
baseurl = https://repos.influxdata.com/rhel/\$releasever/\$basearch/stable
enabled = 1
gpgcheck = 1
gpgkey = https://repos.influxdata.com/influxdb.key" | sudo tee /etc/yum.repos.d/influxdb.repo
{{< /highlight >}}

Install InfluxDB.

{{< highlight shell >}}
sudo yum -y install influxdb
{{< /highlight >}}

Open `/etc/influxdb/influxdb.conf` and uncomment the `http` API line.

{{< highlight shell >}}
[http]
  # Determines whether HTTP endpoint is enabled.
  enabled = true
{{< /highlight >}}

Start InfluxDB.

{{< highlight shell >}}
sudo systemctl start influxdb
{{< /highlight >}}

Add the Sensu user and database.

{{< highlight shell >}}
influx -execute "CREATE DATABASE sensu"

influx -execute "CREATE USER sensu WITH PASSWORD 'sensu'"

influx -execute "GRANT ALL ON sensu TO sensu"
{{< /highlight >}}

### Install and configure Grafana

Install Grafana.

{{< highlight shell >}}
sudo yum install -y https://s3-us-west-2.amazonaws.com/grafana-releases/release/grafana-5.1.4-1.x86_64.rpm
{{< /highlight >}}

Change Grafana's listen port to not conflict with the Sensu Dashboard.

{{< highlight shell >}}
sudo sed -i 's/^;http_port = 3000/http_port = 4000/' /etc/grafana/grafana.ini
{{< /highlight >}}

Create a `/etc/grafana/provisioning/datasources/influxdb.yaml` file, and add an InfluxDB data source.

{{< highlight yml >}}
apiVersion: 1

deleteDatasources:
  - name: InfluxDB
    orgId: 1

datasources:
  - name: InfluxDB
    type: influxdb
    access: proxy
    orgId: 1
    database: sensu
    user: grafana
    password: grafana
    url: http://localhost:8086
{{< /highlight >}}

Start Grafana.

{{< highlight shell >}}
sudo systemctl start grafana-server
{{< /highlight >}}

## Create a Sensu InfluxDB pipeline

### Create a Sensu InfluxDB handler asset

Put the following asset definition in a file called `asset_influxdb`:

{{< language-toggle >}}

{{< highlight yml >}}
type: Asset
api_version: core/v2
metadata:
  name: sensu-influxdb-handler
  namespace: default
spec:
  sha512: 612c6ff9928841090c4d23bf20aaf7558e4eed8977a848cf9e2899bb13a13e7540bac2b63e324f39d9b1257bb479676bc155b24e21bf93c722b812b0f15cb3bd
  url: https://assets.bonsai.sensu.io/b28f8719a48aa8ea80c603f97e402975a98cea47/sensu-influxdb-handler_3.1.2_linux_amd64.tar.gz

{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Asset",
  "api_version": "core/v2",
  "metadata": {
    "name": "sensu-influxdb-handler",
    "namespace": "default"
  },
  "spec": {
    "sha512": "612c6ff9928841090c4d23bf20aaf7558e4eed8977a848cf9e2899bb13a13e7540bac2b63e324f39d9b1257bb479676bc155b24e21bf93c722b812b0f15cb3bd",
    "url": "https://assets.bonsai.sensu.io/b28f8719a48aa8ea80c603f97e402975a98cea47/sensu-influxdb-handler_3.1.2_linux_amd64.tar.gz"
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

### Create a Sensu handler

Put the following handler definition in a file called `handler`:

{{< language-toggle >}}

{{< highlight yml >}}
type: Handler
api_version: core/v2
metadata:
  name: influxdb
  namespace: default
spec:
  command: "sensu-influxdb-handler -a 'http://127.0.0.1:8086' -d sensu -u sensu -p sensu"
  timeout: 10
  type: pipe
  runtime_assets:
  - sensu-influxdb-handler
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "influxdb",
    "namespace": "default"
  },
  "spec": {
    "command": "sensu-influxdb-handler -a 'http://127.0.0.1:8086' -d sensu -u sensu -p sensu",
    "timeout": 10,
    "type": "pipe",
    "runtime_assets": [
      "sensu-influxdb-handler"
    ]
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

_PRO TIP: `sensuctl create -f` also accepts files containing multiple resources definitions._

Use `sensuctl` to add the handler and the asset to Sensu.

{{< highlight shell >}}
sensuctl create --file handler --file asset_influxdb
{{< /highlight >}}

## Collect Prometheus metrics with Sensu

### Create a Sensu Prometheus Collector asset

Put the following handler definition in a file called `asset_prometheus`:

{{< language-toggle >}}

{{< highlight yml >}}
type: Asset
api_version: core/v2
metadata:
  name: sensu-prometheus-collector
  namespace: default
spec:
  url: https://assets.bonsai.sensu.io/ef812286f59de36a40e51178024b81c69666e1b7/sensu-prometheus-collector_1.1.6_linux_amd64.tar.gz
  sha512: a70056ca02662fbf2999460f6be93f174c7e09c5a8b12efc7cc42ce1ccb5570ee0f328a2dd8223f506df3b5972f7f521728f7bdd6abf9f6ca2234d690aeb3808
{{< /highlight >}}

{{< highlight json >}}
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
{{< /highlight >}}

{{< /language-toggle >}}


### Add a Sensu check to complete the pipeline

Given the following check definition in a file called `check`:

{{< language-toggle >}}

{{< highlight yml >}}
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

{{< /highlight >}}

{{< highlight json >}}
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
{{< /highlight >}}

{{< /language-toggle >}}

Use `sensuctl` to add the check to Sensu.

{{< highlight shell >}}
sensuctl create --file check --file asset_prometheus
{{< /highlight >}}

We can see the events generated by the `prometheus_metrics` check in the Sensu dashboard.
Visit http://127.0.0.1:3000, and log in as the default admin user: username `admin` and password `P@ssw0rd!`.

We can also see the metric event data using sensuctl.

{{< highlight shell >}}
sensuctl event list
    Entity            Check                                          Output                                   Status   Silenced             Timestamp            
────────────── ──────────────────── ──────────────────────────────────────────────────────────────────────── ──────── ────────── ─────────────────────────────── 
sensu-centos   keepalive            Keepalive last sent from sensu-centos at 2019-02-12 01:01:37 +0000 UTC        0   false      2019-02-12 01:01:37 +0000 UTC  
sensu-centos   prometheus_metrics   up,instance=localhost:9090,job=prometheus value=1 1549933306                  0   false      2019-02-12 01:01:46 +0000 UTC  
{{< /highlight >}}

## Visualize metrics with Grafana

### Configure a dashboard in Grafana

Download the Grafana dashboard configuration file from the Sensu docs.

{{< highlight shell >}}
wget https://docs.sensu.io/sensu-go/latest/files/up_or_down_dashboard.json
{{< /highlight >}}

Using the downloaded file, add the dashboard to Grafana using an API call.

{{< highlight shell >}}
curl  -XPOST -H 'Content-Type: application/json' -d@up_or_down_dashboard.json HTTP://admin:admin@127.0.0.1:4000/api/dashboards/db
{{< /highlight >}}

### View metrics in Grafana

Confirm metrics in Grafana with `admin:admin` login at http://127.0.0.1:4000.

Once logged in, click on Home in the upper left corner, then below click on the Up or Down Sample 2 dashboard. Once there, you should see a graph that has started showing metrics like this

![up_or_down_detail](/images/prometheus-collector/up_or_down_detail.png)

## Conclusion

You should now have a working setup with Prometheus scraping metrics. The Sensu Prometheus Collecting is being ran via a Sensu check and collecting those metrics from Prometheus' API. The metrics are then handled by the InfluxDB handler, sent to InfluxDB and then visualized by a Grafana Dashboard.

Using this information, you can now plug the Sensu Prometheus Collector into your Sensu ecosystem and leverage Prometheus to gather metrics and Sensu to send them to the proper final destination. Prometheus has a [comprehensive list][7] of additional exporters to pull in metrics.

[1]: https://github.com/sensu/sensu-prometheus-collector
[2]: https://prometheus.io/docs/instrumenting/exporters/
[3]: https://prometheus.io/docs/prometheus/latest/querying/api/
[4]: ../../installation/install-sensu/
[5]: https://github.com/prometheus/node_exporter
[6]: https://github.com/google/cadvisor
[7]: https://prometheus.io/docs/instrumenting/exporters/
