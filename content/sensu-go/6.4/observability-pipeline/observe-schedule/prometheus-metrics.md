---
title: "Collect Prometheus metrics with Sensu"
linkTitle: "Collect Prometheus Metrics"
guide_title: "Collect Prometheus metrics with Sensu"
type: "guide"
description: "The Sensu Prometheus Collector is a check plugin that collects metrics from a Prometheus exporter or the Prometheus query API. This allows Sensu to route the collected metrics to a time-series database, like InfluxDB. Follow this guide to start collecting Prometheus metrics with Sensu."
weight: 55
version: "6.4"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.4:
    parent: observe-schedule
---

The [Sensu Prometheus Collector][1] is a check plugin that collects [metrics][10] from a [Prometheus exporter][2] or the [Prometheus query API][3].
This allows Sensu to route the collected metrics to one or more time-series databases, such as InfluxDB or Graphite.

The Prometheus ecosystem contains a number of actively maintained exporters, such as the [node exporter][5] for reporting hardware and operating system metrics or Google's [cAdvisor exporter][6] for monitoring containers.
These exporters expose metrics that Sensu can collect and route to one or more time-series databases.
Sensu and Prometheus can run in parallel, complementing each other and making use of environments where Prometheus is already deployed.

This guide uses CentOS 7 as the operating system with all components running on the same compute resource.
Follow the RHEL/CentOS [install instructions][4] for the Sensu backend, the Sensu agent, and sensuctl.
Commands and steps may change for different distributions or if components are running on different compute resources.

At the end of this guide, Prometheus will be scraping metrics.
The Sensu Prometheus Collector will then query the Prometheus API as a Sensu check and send the metrics to an InfluxDB Sensu handler, which will send metrics to an InfluxDB instance.
Finally, Grafana will query InfluxDB to display the collected metrics.

## Configure a Sensu entity

Use [sensuctl][15] to add an `app_tier` [subscription][16] to an entity the Sensu agent is observing.
Before you run the following code, Replace `<entity_name>` with the name of the entity on your system.

{{% notice note %}}
**NOTE**: To find your entity name, run `sensuctl entity list`.
The `ID` is the name of your entity.
{{% /notice %}}

{{< code shell >}}
sensuctl entity update <entity_name>
{{< /code >}}

- For `Entity Class`, press enter.
- For `Subscriptions`, type `app_tier` and press enter.

Run this command to confirm both Sensu services are running:

{{< code shell >}}
systemctl status sensu-backend && systemctl status sensu-agent
{{< /code >}}

The response should indicate `active (running)` for both the Sensu backend and agent.

## Install and configure Prometheus

Download and extract Prometheus with these commands:

{{< code shell >}}
wget https://github.com/prometheus/prometheus/releases/download/v2.6.0/prometheus-2.6.0.linux-amd64.tar.gz
{{< /code >}}

{{< code shell >}}
tar xvfz prometheus-*.tar.gz
{{< /code >}}

{{< code shell >}}
cd prometheus-*
{{< /code >}}

Replace the default `prometheus.yml` configuration file with the following configuration:

{{< code shell >}}
global:
  scrape_interval: 15s
  external_labels:
    monitor: 'codelab-monitor'

scrape_configs:
  - job_name: 'prometheus'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:9090']
{{< /code >}}

Start Prometheus in the background:

{{< code shell >}}
nohup ./prometheus --config.file=prometheus.yml > prometheus.log 2>&1 &
{{< /code >}}

Ensure Prometheus is running:

{{< code shell >}}
ps -ef | grep "[p]rometheus"
{{< /code >}}

The response should be similar to this example:

{{< code shell >}}
vagrant   7647  3937  2 22:23 pts/0    00:00:00 ./prometheus --config.file=prometheus.yml
{{< /code >}}

## Install and configure InfluxDB

Add an InfluxDB repo:

{{< code shell >}}
echo "[influxdb]
name = InfluxDB Repository - RHEL \$releasever
baseurl = https://repos.influxdata.com/rhel/\$releasever/\$basearch/stable
enabled = 1
gpgcheck = 1
gpgkey = https://repos.influxdata.com/influxdb.key" | sudo tee /etc/yum.repos.d/influxdb.repo
{{< /code >}}

Install InfluxDB:

{{< code shell >}}
sudo yum -y install influxdb
{{< /code >}}

Open `/etc/influxdb/influxdb.conf` and uncomment the `http` API line:

{{< code shell >}}
[http]
  # Determines whether HTTP endpoint is enabled.
  enabled = true
{{< /code >}}

Start InfluxDB:

{{< code shell >}}
sudo systemctl start influxdb
{{< /code >}}

Add the Sensu user and database with these commands:

{{< code shell >}}
influx -execute "CREATE DATABASE sensu"
{{< /code >}}

{{< code shell >}}
influx -execute "CREATE USER sensu WITH PASSWORD 'sensu'"
{{< /code >}}

{{< code shell >}}
influx -execute "GRANT ALL ON sensu TO sensu"
{{< /code >}}

## Install and configure Grafana

Install Grafana:

{{< code shell >}}
sudo yum install -y https://s3-us-west-2.amazonaws.com/grafana-releases/release/grafana-5.1.4-1.x86_64.rpm
{{< /code >}}

Change Grafana's listen port so that it does not conflict with the Sensu [web UI][14]:

{{< code shell >}}
sudo sed -i 's/^;http_port = 3000/http_port = 4000/' /etc/grafana/grafana.ini
{{< /code >}}

Create a `/etc/grafana/provisioning/datasources/influxdb.yaml` file, and add an InfluxDB data source:

{{< code yml >}}
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
{{< /code >}}

Start Grafana:

{{< code shell >}}
sudo systemctl start grafana-server
{{< /code >}}

## Create a Sensu InfluxDB pipeline

### Add the Sensu InfluxDB handler asset

To add the [Sensu InfluxDB Handler][18] [dynamic runtime asset][11] to Sensu, run the following command:

{{< code shell >}}
sensuctl asset add sensu/sensu-influxdb-handler:3.7.0 -r sensu-influxdb-handler
{{< /code >}}

The response will confirm that the asset was added:

{{< code text >}}
fetching bonsai asset: sensu/sensu-influxdb-handler:3.7.0
added asset: sensu/sensu-influxdb-handler:3.7.0

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["sensu-influxdb-handler"].
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the dynamic runtime asset: `sensu-influxdb-handler`.

To confirm that the `sensu-influxdb-handler` asset is ready to use, run:

{{< code shell >}}
sensuctl asset list
{{< /code >}}

The response should list the `sensu-influxdb-handler` dynamic runtime asset:

{{< code shell >}}
             Name                                                     URL                                            Hash    
───────────────────────────── ──────────────────────────────────────────────────────────────────────────────────── ──────────
  sensu-influxdb-handler       //assets.bonsai.sensu.io/.../sensu-influxdb-handler_3.7.0_linux_386.tar.gz           6719527  
  sensu-influxdb-handler       //assets.bonsai.sensu.io/.../sensu-influxdb-handler_3.7.0_linux_amd64.tar.gz         d05650d  
  sensu-influxdb-handler       //assets.bonsai.sensu.io/.../sensu-influxdb-handler_3.7.0_linux_armv7.tar.gz         38918c1  
  sensu-influxdb-handler       //assets.bonsai.sensu.io/.../sensu-influxdb-handler_3.7.0_linux_arm64.tar.gz         944075f  
  sensu-influxdb-handler       //assets.bonsai.sensu.io/.../sensu-influxdb-handler_3.7.0_windows_amd64.tar.gz       8228cbc  
  sensu-influxdb-handler       //assets.bonsai.sensu.io/.../sensu-influxdb-handler_3.7.0_darwin_amd64.tar.gz        7c73e1d  
{{< /code >}}

### Add the Sensu handler

To add the [handler][12] definition that uses the Sensu InfluxDB Handler dynamic runtime asset, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: Handler
api_version: core/v2
metadata:
  name: influxdb
spec:
  command: sensu-influxdb-handler -a 'http://127.0.0.1:8086' -d sensu -u sensu -p sensu
  timeout: 10
  type: pipe
  runtime_assets:
  - sensu-influxdb-handler
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "name": "influxdb"
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
EOF
{{< /code >}}

{{< /language-toggle >}}

{{% notice protip %}}
**PRO TIP**: `sensuctl create --file` also accepts files that contain multiple resources' definitions.
You could save both the asset and handler definitions in a single file and use `sensuctl create --file FILE_NAME.EXT` to add them.
{{% /notice %}}

## Collect Prometheus metrics with Sensu

### Add the Sensu Prometheus Collector asset

To add the [Sensu Prometheus Collector][19] [dynamic runtime asset][11] to Sensu, run the following command:

{{< code shell >}}
sensuctl asset add sensu/sensu-prometheus-collector:1.3.2 -r sensu-prometheus-collector
{{< /code >}}

The response will confirm that the asset was added:

{{< code text >}}
fetching bonsai asset: sensu/sensu-prometheus-collector:1.3.2
added asset: sensu/sensu-prometheus-collector:1.3.2

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["sensu-prometheus-collector"].
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the dynamic runtime asset: `sensu-prometheus-collector`.

To confirm that the `sensu-prometheus-collector` asset is ready to use, run:

{{< code shell >}}
sensuctl asset list
{{< /code >}}

The response should list the `sensu-prometheus-collector` dynamic runtime asset along with the previously added `sensu-influxdb-handler` asset:

{{< code shell >}}
             Name                                                     URL                                            Hash    
───────────────────────────── ──────────────────────────────────────────────────────────────────────────────────── ──────────
  sensu-influxdb-handler       //assets.bonsai.sensu.io/.../sensu-influxdb-handler_3.7.0_linux_386.tar.gz           6719527  
  sensu-influxdb-handler       //assets.bonsai.sensu.io/.../sensu-influxdb-handler_3.7.0_linux_amd64.tar.gz         d05650d  
  sensu-influxdb-handler       //assets.bonsai.sensu.io/.../sensu-influxdb-handler_3.7.0_linux_armv7.tar.gz         38918c1  
  sensu-influxdb-handler       //assets.bonsai.sensu.io/.../sensu-influxdb-handler_3.7.0_linux_arm64.tar.gz         944075f  
  sensu-influxdb-handler       //assets.bonsai.sensu.io/.../sensu-influxdb-handler_3.7.0_windows_amd64.tar.gz       8228cbc  
  sensu-influxdb-handler       //assets.bonsai.sensu.io/.../sensu-influxdb-handler_3.7.0_darwin_amd64.tar.gz        7c73e1d  
  sensu-prometheus-collector   //assets.bonsai.sensu.io/.../sensu-prometheus-collector_1.3.2_windows_amd64.tar.gz   77f47c9  
  sensu-prometheus-collector   //assets.bonsai.sensu.io/.../sensu-prometheus-collector_1.3.2_darwin_amd64.tar.gz    5e25a41  
  sensu-prometheus-collector   //assets.bonsai.sensu.io/.../sensu-prometheus-collector_1.3.2_linux_armv7.tar.gz     2ae6727  
  sensu-prometheus-collector   //assets.bonsai.sensu.io/.../sensu-prometheus-collector_1.3.2_linux_armv6.tar.gz     acad256  
  sensu-prometheus-collector   //assets.bonsai.sensu.io/.../sensu-prometheus-collector_1.3.2_linux_arm64.tar.gz     6bfdbfc  
  sensu-prometheus-collector   //assets.bonsai.sensu.io/.../sensu-prometheus-collector_1.3.2_linux_386.tar.gz       69e6d02  
  sensu-prometheus-collector   //assets.bonsai.sensu.io/.../sensu-prometheus-collector_1.3.2_linux_amd64.tar.gz     aca56fa  
{{< /code >}}

### Add a Sensu check to complete the pipeline

To add the [check][13] definition that uses the Sensu Prometheus Collector dynamic runtime asset, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: CheckConfig
api_version: core/v2
metadata:
  name: prometheus_metrics
spec:
  command: sensu-prometheus-collector -prom-url http://localhost:9090 -prom-query up
  handlers: []
  interval: 10
  publish: true
  output_metric_format: influxdb_line
  output_metric_handlers:
  - influxdb
  subscriptions:
  - app_tier
  timeout: 0
  runtime_assets:
  - sensu-prometheus-collector
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "prometheus_metrics"
  },
  "spec": {
    "command": "sensu-prometheus-collector -prom-url http://localhost:9090 -prom-query up",
    "handlers": [],
    "interval": 10,
    "publish": true,
    "output_metric_format": "influxdb_line",
    "output_metric_handlers": [
      "influxdb"
    ],
    "subscriptions": [
      "app_tier"
    ],
    "timeout": 0,
    "runtime_assets": [
      "sensu-prometheus-collector"
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

The check subscription matches the [subscription][16] you added to your entity during [set-up][17].
The Sensu backend will coordinate check execution for you by comparing the subscriptions in your checks and entities.
Sensu automatically executes a check when the check definition includes a subscription that matches a subscription for a Sensu entity.

Open the Sensu [web UI][14] to view the events generated by the `prometheus_metrics` check.
Visit `http://127.0.0.1:3000`, and log in as the admin user (created during the [initialization step][8] when you installed the Sensu backend).

You can also view the metric event data using sensuctl.
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
curl -O https://docs.sensu.io/sensu-go/latest/files/up_or_down_dashboard.json
{{< /code >}}

Using the downloaded file, add the dashboard to Grafana with an API call:

{{< code shell >}}
curl  -XPOST -H 'Content-Type: application/json' -d@up_or_down_dashboard.json HTTP://admin:admin@127.0.0.1:4000/api/dashboards/db
{{< /code >}}

### View metrics in Grafana

Confirm metrics in Grafana: log in at `http://127.0.0.1:4000`.
Use `admin` for both username and password.

Click **Home** in the upper left corner, then click the **Up or Down Sample 2** dashboard.
The page should include a graph with initial metrics, similar to this example:

{{< figure src="/images/prometheus-collector/up_or_down_detail.png" alt="Example Grafana dashboard for visualizing Prometheus metrics from Sensu" link="/images/prometheus-collector/up_or_down_detail.png" target="_blank" >}}

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
[17]: #configure-a-sensu-entity
[18]: https://bonsai.sensu.io/assets/sensu/sensu-influxdb-handler
[19]: https://bonsai.sensu.io/assets/sensu/sensu-prometheus-collector
