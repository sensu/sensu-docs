---
title: "Using Prometheus with the Sensu Prometheus Collector"
linkTitle: "Using Prometheus with Sensu"
weight: 120
version: "5.0"
product: "Sensu Go"
platformContent: false
menu: 
  sensu-go-5.0:
    parent: guides
---

- [What is the Sensu Prometheus Collector?](#what-is-the-sensu-prometheus-collector)
- [Install and Configure Prometheus](#install-and-configure-prometheus)
- [Install and Configure Sensu Go](#install-and-configure-sensu-go)
- [Install Sensu Prometheus Collector](#install-sensu-prometheus-collector)
- [Install Sensu InfluxDB Handler](#install-sensu-influxdb-handler)
- [Install and Configure InfluxDB](#install-and-configure-influxdb)
- [Install and Configure Grafana](#install-and-configure-grafana)

## What is the Sensu Prometheus Collector?

The [Sensu Prometheus Collector][1] is a check plugin that collects metrics from a [Prometheus exporter][2] or the [Prometheus query API][3]. This allows Sensu to route the collected metrics to one or more time-series databases, such as InfluxDB or Graphite.

## In this guide

This guide uses CentOS 7 as the operating system with all compoments running on the same compute resource. Commands and steps may change for different distributions or if components are running on different compute resources.

At the end, you will have Prometheus scraping metrics. The Sensu Prometheus Collector will then query the Prometheus API as a Sensu check, send those to an InfluxDB Sensu handler, which will send metrics to an InfluxDB instance. Finally, Grafana will query InfluxDB to display those collected metrics.

### Install and Configure Prometheus

Download and extract Prometheus

{{< highlight shell >}}
wget https://github.com/prometheus/prometheus/releases/download/v2.6.0/prometheus-2.6.0.linux-amd64.tar.gz
tar xvfz prometheus-*.tar.gz
cd prometheus-*
{{< /highlight >}}

Setup configuration in a file called `prometheus.yml`

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

Start Prometheus in the background

{{< highlight shell >}}
nohup .prometheus --config.file=prometheus.yml > prometheus.log 2>&1 &
{{< /highlight >}}

Ensure Pormetheus is running

{{< highlight shell >}}
ps -ef | grep prometheus
{{< /highlight >}}

### Install and Configure Sensu Go

Follow the RHEL/CentOS [install instructions][4] for Sensu backend, Sensu agent and sensuctl.

Add an `app_tier` subscrption to `/etc/sensu/agent.yml`:

{{< highlight shell >}}
subscriptions:
  - "app_tier"
{{< /highlight >}}

Restart the sensu agent to apply the configuration change:
{{< highlight shell >}}
systemctl restart sensu-agent
{{< /highlight >}}

Ensure Sensu services are running:
{{< highlight shell >}}
systemctl status sensu-backend
systemctl status sensu-agent
{{< /highlight >}}

### Install Sensu Prometheus Collector

TODO: align these wget commands.
TODO: See about not having version hard coded
{{< highlight shell >}}
wget -q -nc https://github.com/sensu/sensu-prometheus-collector/releases/download/1.1.4/sensu-prometheus-collector_1.1.4_linux_386.tar.gz -P /tmp/
tar xvfz /tmp/sensu-prometheus-collector_1.1.4_linux_386.tar.gz -C /tmp/
cp /tmp/bin/sensu-prometheus-collector /usr/local/bin/
{{< /highlight >}}

Confirm it can get metrics from prometheus

{{< highlight shell >}}
/usr/local/bin/sensu-prometheus-collector -prom-url http://localhost:9090 -prom-query up
{{< /highlight >}}

### Install Sensu InfluxDB Handler

{{< highlight shell >}}
wget -q -nc https://github.com/sensu/sensu-influxdb-handler/releases/download/3.0.1/sensu-influxdb-handler_3.0.1_linux_amd64.tar.gz -P /tmp/
tar xvfz /tmp/sensu-influxdb-handler_3.0.1_linux_amd64.tar.gz -C /tmp/
cp /tmp/bin/sensu-influxdb-handler /usr/local/bin/
{{< /highlight >}}

### Install and Configure InfluxDB

Add InfluxDB repo

{{< highlight shell >}}
echo "[influxdb]
name = InfluxDB Repository - RHEL \$releasever
baseurl = https://repos.influxdata.com/rhel/\$releasever/\$basearch/stable
enabled = 1
gpgcheck = 1
gpgkey = https://repos.influxdata.com/influxdb.key" | sudo tee /etc/yum.repos.d/influxdb.repo
{{< /highlight >}}

Install InfluxDB

{{< highlight shell >}}
sudo yum -y install influxdb
{{< /highlight >}}

In `/etc/influxdb/influxdb.conf`, uncomment the http API line

{{< highlight shell >}}
[http]
  # Determines whether HTTP endpoint is enabled.
  enabled = true
{{< /highlight >}}

Start InfluxDB

{{< highlight shell >}}
sudo systemctl start influxdb
{{< /highlight >}}

Add sensu user and sensu DB

{{< highlight shell >}}
influx -execute "CREATE DATABASE sensu"
influx -execute "CREATE USER sensu WITH PASSWORD 'sensu'"
influx -execute "GRANT ALL ON sensu TO sensu"
{{< /highlight >}}

### Add Sensu check and handler to complete the pipeline

Given the following resource definition in a file called `resources.yml`:

{{< highlight yml >}}
type: CheckConfig
api_version: core/v2
metadata:
  name: prometheus_metrics
  namespace: default
spec:
  command: /usr/local/bin/sensu-prometheus-collector -prom-url http://localhost:9090 -prom-query up
  handlers:
  - influxdb
  interval: 10
  publish: true
  output_metric_format: influxdb_line
  output_metric_handlers: []
  subscriptions:
  - app_tier
  timeout: 0
---
type: Handler
api_version: core/v2
metadata:
  name: influxdb
  namespace: default
spec:
  command: /usr/local/bin/sensu-influxdb-handler -a 'http://127.0.0.1:8086' -d sensu -u sensu -p sensu
  env_vars: []
  timeout: 10
  type: pipe
{{< /highlight >}}

use `sensuctl` to add the check and handler to the sensu backend:

{{< highlight shell >}}
sudo sensuctl create -f resources.yml
{{< /highlight >}}

### Install and Configure Grafana

Install Grafana

{{< highlight shell >}}
sudo yum install -y https://s3-us-west-2.amazonaws.com/grafana-releases/release/grafana-5.1.4-1.x86_64.rpm
{{< /highlight >}}

Change Grafana's listen port to not conflict with Sensu's Dashboard

{{< highlight shell >}}
sudo sed -i 's/^;http_port = 3000/http_port = 4000/' /etc/grafana/grafana.ini
{{< /highlight >}}

Add an InfluxDB data source in `/etc/grafana/provisioning/datasources/influxdb.yaml`

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

Start Grafana

{{< highlight shell >}}
sudo systemctl start grafana-server
{{< /highlight >}}

Create a file named `up_or_down_dashboard.json` with the following JSON

{{< highlight json >}}
{
  "dashboard": {
    "__inputs": [
      {
        "name": "InfluxDB",
        "label": "InfluxDB",
        "description": "",
        "type": "datasource",
        "pluginId": "influxdb",
        "pluginName": "InfluxDB"
      }
    ],
    "__requires": [
      {
        "type": "grafana",
        "id": "grafana",
        "name": "Grafana",
        "version": "5.1.4"
      },
      {
        "type": "panel",
        "id": "graph",
        "name": "Graph",
        "version": "5.0.0"
      },
      {
        "type": "datasource",
        "id": "influxdb",
        "name": "InfluxDB",
        "version": "5.0.0"
      }
    ],
    "annotations": {
      "list": [
        {
          "builtIn": 1,
          "datasource": "-- Grafana --",
          "enable": true,
          "hide": true,
          "iconColor": "rgba(0, 211, 255, 1)",
          "name": "Annotations & Alerts",
          "type": "dashboard"
        }
      ]
    },
    "editable": true,
    "gnetId": null,
    "graphTooltip": 0,
    "id": null,
    "links": [],
    "panels": [
      {
        "aliasColors": {},
        "bars": false,
        "dashLength": 10,
        "dashes": false,
        "datasource": "InfluxDB",
        "fill": 1,
        "gridPos": {
          "h": 9,
          "w": 12,
          "x": 0,
          "y": 0
        },
        "id": 2,
        "legend": {
          "avg": false,
          "current": false,
          "max": false,
          "min": false,
          "show": true,
          "total": false,
          "values": false
        },
        "lines": true,
        "linewidth": 1,
        "links": [],
        "nullPointMode": "null",
        "percentage": false,
        "pointradius": 5,
        "points": false,
        "renderer": "flot",
        "seriesOverrides": [],
        "spaceLength": 10,
        "stack": false,
        "steppedLine": false,
        "targets": [
          {
            "groupBy": [
              {
                "params": [
                  "$__interval"
                ],
                "type": "time"
              },
              {
                "params": [
                  "none"
                ],
                "type": "fill"
              }
            ],
            "measurement": "up",
            "orderByTime": "ASC",
            "policy": "default",
            "refId": "A",
            "resultFormat": "time_series",
            "select": [
              [
                {
                  "params": [
                    "value"
                  ],
                  "type": "field"
                },
                {
                  "params": [],
                  "type": "mean"
                }
              ]
            ],
            "tags": []
          }
        ],
        "thresholds": [],
        "timeFrom": null,
        "timeShift": null,
        "title": "Up or Down",
        "tooltip": {
          "shared": true,
          "sort": 0,
          "value_type": "individual"
        },
        "type": "graph",
        "xaxis": {
          "buckets": null,
          "mode": "time",
          "name": null,
          "show": true,
          "values": []
        },
        "yaxes": [
          {
            "format": "short",
            "label": null,
            "logBase": 1,
            "max": null,
            "min": null,
            "show": true
          },
          {
            "format": "short",
            "label": null,
            "logBase": 1,
            "max": null,
            "min": null,
            "show": true
          }
        ],
        "yaxis": {
          "align": false,
          "alignLevel": null
        }
      }
    ],
    "refresh": "10s",
    "schemaVersion": 16,
    "style": "dark",
    "tags": [],
    "templating": {
      "list": []
    },
    "time": {
      "from": "now-15m",
      "to": "now"
    },
    "timepicker": {
      "refresh_intervals": [
        "5s",
        "10s",
        "30s",
        "1m",
        "5m",
        "15m",
        "30m",
        "1h",
        "2h",
        "1d"
      ],
      "time_options": [
        "5m",
        "15m",
        "1h",
        "6h",
        "12h",
        "24h",
        "2d",
        "7d",
        "30d"
      ]
    },
    "timezone": "",
    "title": "Up or Down Sample 2",
    "uid": "nb442Vsiz",
    "version": 1
  }
}
{{< /highlight >}}

Using the just created file, add the dashboard to Grafana using an API call

{{< highlight shell >}}
curl -s -XPOST -H 'Content-Type: application/json' -d@up_or_down_dashboard.json HTTP://admin:admin@127.0.0.1:4000/api/dashboards/db
{{< /highlight >}}

Confirm metrics in Grafana with `admin:admin` login at http://127.0.0.1:4000.

Once logged in, click on Home in the upper left corner, then below click on the Up or Down Sample 2 dashboard. Once there, you should see a graph that has started showing metrics like this

 ![up_or_down_detail](/images/prometheus-collector/up_or_down_detail.png)


## Conclusion

You should now have a working setup with Prometheus scraping metrics. The Sensu Prometheus Collecting is being ran via a Sensu check and collecting those metrics from Prometheus' API. The metrics are then handled by the InfluxDB handler, sent to InfluxDB and then visualzied by a Grafana Dashboard.

Using this information, you can now plugin the Sensu Prometheus Collector into your Sensu ecosystem and leverage Prometheus' to gather metrics and Sensu to send them to the proper final desitnation.

[1]: https://github.com/sensu/sensu-prometheus-collector
[2]: https://prometheus.io/docs/instrumenting/exporters/
[3]: https://prometheus.io/docs/prometheus/latest/querying/api/
[4]: ../../installation/install-sensu/
