---
title: "Populate metrics in InfluxDB with handlers"
linkTitle: "Populate Metrics in InfluxDB"
guide_title: "Populate metrics in InfluxDB with handlers"
type: "guide"
description: "A Sensu event handler is an action the Sensu backend executes when a specific event occurs. This guide helps you use an event handler to populate Sensu metrics into the time-series database InfluxDB."
weight: 50
version: "6.5"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.5:
    parent: observe-process
---

A Sensu event handler is an action the Sensu backend executes when a specific [event][1] occurs.
In this guide, you'll use a [handler][9] to populate the time-series database [InfluxDB][2] with Sensu observability event data.

Metrics can be collected from [check output][10] (in this guide, a check that generates Prometheus metrics) or the [Sensu StatsD Server][3].

## Register the dynamic runtime asset

[Dynamic runtime assets][12] are shareable, reusable packages that make it easier to deploy Sensu plugins.
This example uses the [Sensu InfluxDB Handler][13] dynamic runtime asset to power an InfluxDB handler.

Use [`sensuctl asset add`][5] to register the [Sensu InfluxDB Handler][13] dynamic runtime asset:

{{< code shell >}}
sensuctl asset add sensu/sensu-influxdb-handler:3.7.0 -r sensu-influxdb-handler
{{< /code >}}

The response will confirm that the asset was added:

{{< code text >}}
fetching bonsai asset: sensu/sensu-influxdb-handler:3.7.0 -r sensu-influxdb-handler
added asset: sensu/sensu-influxdb-handler:3.7.0

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["sensu-influxdb-handler"].
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the dynamic runtime asset: `sensu-influxdb-handler`.

You can also download the latest dynamic runtime asset definition for your platform from [Bonsai][13] and register the asset with `sensuctl create --file filename.yml` or `sensuctl create --file filename.json`.

Run `sensuctl asset list` to confirm that the dynamic runtime asset is ready to use.

{{% notice note %}}
**NOTE**: Sensu does not download and install dynamic runtime asset builds onto the system until they are needed for command execution.
Read [the asset reference](../../../plugins/assets#dynamic-runtime-asset-builds) for more information about dynamic runtime asset builds.
{{% /notice %}}

## Create the handler

Now that you have registered the dynamic runtime asset, use sensuctl to create a handler called `influxdb-handler` that pipes observation data (events) to InfluxDB with the `sensu-influxdb-handler` dynamic runtime asset.
Edit the command below to replace the placeholders for database name, address, username, and password with the information for your own InfluxDB database.
For more information about the Sensu InfluxDB handler, read [the asset page in Bonsai][13].

{{< code shell >}}
sensuctl handler create influxdb-handler \
--type pipe \
--command "sensu-influxdb-handler -d sensu" \
--env-vars "INFLUXDB_ADDR=http://influxdb.default.svc.cluster.local:8086, INFLUXDB_USER=sensu, INFLUXDB_PASS=password" \
--runtime-assets sensu-influxdb-handler
{{< /code >}}

You should receive a confirmation message:

{{< code shell >}}
Created
{{< /code >}}

To review the complete resource definition for the handler resource you just created with sensuctl, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl handler info influxdb-handler --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl handler info influxdb-handler --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The `influxdb-handler` resource definition will be similar to this example:

{{< language-toggle >}}

{{< code yml >}}
---
type: Handler
api_version: core/v2
metadata:
  created_by: admin
  name: influxdb-handler
  namespace: default
spec:
  command: sensu-influxdb-handler -d sensu
  env_vars:
  - INFLUXDB_ADDR=http://influxdb.default.svc.cluster.local:8086
  - INFLUXDB_USER=sensu
  - INFLUXDB_PASS=password
  filters: null
  handlers: null
  runtime_assets:
  - sensu-influxdb-handler
  secrets: null
  timeout: 0
  type: pipe
{{< /code >}}

{{< code json >}}
{
  "type": "Handler",
  "api_version": "core/v2",
  "metadata": {
    "created_by": "admin",
    "name": "influxdb-handler",
    "namespace": "default"
  },
  "spec": {
    "command": "sensu-influxdb-handler -d sensu",
    "env_vars": [
      "INFLUXDB_ADDR=http://influxdb.default.svc.cluster.local:8086",
      "INFLUXDB_USER=sensu",
      "INFLUXDB_PASS=password"
    ],
    "filters": null,
    "handlers": null,
    "runtime_assets": [
      "sensu-influxdb-handler"
    ],
    "secrets": null,
    "timeout": 0,
    "type": "pipe"
  }
}
{{< /code >}}

{{< /language-toggle >}}

You can share, reuse, and maintain this handler just like you would code: [save it to a file][6] and start building a [monitoring as code repository][7].

{{% notice protip %}}
**PRO TIP**: You can also [view complete resource definitions in the Sensu web UI](../../../web-ui/view-manage-resources/#view-resource-data-in-the-web-ui).
{{% /notice %}}

## Create a pipeline that includes the InfluxDB handler

With your handler configured, you can add it to a [pipeline][16] workflow.
A single pipeline workflow can include one or more filters, one mutator, and one handler.

In this case, the pipeline includes the built-in [has_metrics][17] event filter and the InfluxDB handler you've already configured.
To create the pipeline, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: Pipeline
api_version: core/v2
metadata:
  name: metrics_pipeline
spec:
  workflows:
  - name: influxdb_metrics
    filters:
    - name: has_metrics
      type: EventFilter
      api_version: core/v2
    handler:
      name: influxdb-handler
      type: Handler
      api_version: core/v2
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "Pipeline",
  "api_version": "core/v2",
  "metadata": {
    "name": "metrics_pipeline"
  },
  "spec": {
    "workflows": [
      {
        "name": "influxdb_metrics",
        "filters": [
          {
            "name": "has_metrics",
            "type": "EventFilter",
            "api_version": "core/v2"
          }
        ],
        "handler": {
          "name": "influxdb-handler",
          "type": "Handler",
          "api_version": "core/v2"
        }
      }
    ]
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

Now you can add the `metrics_pipeline` pipeline to a check for check output metric extraction.

## Add the pipeline to a check

Add the `metrics_pipeline` pipeline to a check to use it for check output metric extraction. 
For example, if you followed [Collect Prometheus metrics with Sensu][10], you created the `prometheus_metrics` check.

The `prometheus_metrics` check already uses the `influxdb_line` output metric format, but you will need to add the pipeline to extract the metrics and process them according to the pipeline's workflows.

To open the check definition in your text editor, run: 

{{< code shell >}}
sensuctl edit check prometheus_metrics
{{< /code >}}

Make two changes in the `prometheus_metrics` check definition:

1. Delete the `output_metrics_handlers` attribute and value.

2. Replace the `pipelines: []` line with the following array to reference your `metrics_pipeline` pipeline:

    {{< language-toggle >}}
{{< code yml >}}
pipelines:
- type: Pipeline
  api_version: core/v2
  name: metrics_pipeline
{{< /code >}}
{{< code json >}}
{
  "pipelines": [
    {
      "type": "Pipeline",
      "api_version": "core/v2",
      "name": "metrics_pipeline"
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

Save the two changes and exit the text editor.
You should receive a confirmation message:

{{< code shell >}}
Updated /api/core/v2/namespaces/default/checks/prometheus_metrics
{{< /code >}}

To review the updated check resource definition, run:

{{< language-toggle >}}

{{< code shell "YML" >}}
sensuctl check info prometheus_metrics --format yaml
{{< /code >}}

{{< code shell "JSON" >}}
sensuctl check info prometheus_metrics --format wrapped-json
{{< /code >}}

{{< /language-toggle >}}

The updated `prometheus_metrics` check definition will be similar to this example:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  created_by: admin
  name: prometheus_metrics
  namespace: default
spec:
  check_hooks: null
  command: sensu-prometheus-collector -prom-url http://localhost:9090 -prom-query up
  env_vars: null
  handlers: []
  high_flap_threshold: 0
  interval: 10
  low_flap_threshold: 0
  output_metric_format: influxdb_line
  output_metric_handlers: null
  pipelines:
  - api_version: core/v2
    name: metrics_pipeline
    type: Pipeline
  proxy_entity_name: ""
  publish: true
  round_robin: false
  runtime_assets:
  - sensu-prometheus-collector
  secrets: null
  stdin: false
  subdue: null
  subscriptions:
  - app_tier
  timeout: 0
  ttl: 0
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "prometheus_metrics",
    "namespace": "default",
    "created_by": "admin"
  },
  "spec": {
    "check_hooks": null,
    "command": "sensu-prometheus-collector -prom-url http://localhost:9090 -prom-query up",
    "env_vars": null,
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 10,
    "low_flap_threshold": 0,
    "output_metric_format": "influxdb_line",
    "output_metric_handlers": null,
    "pipelines": [
      {
        "api_version": "core/v2",
        "name": "metrics_pipeline",
        "type": "Pipeline"
      }
    ],
    "proxy_entity_name": "",
    "publish": true,
    "round_robin": false,
    "runtime_assets": [
      "sensu-prometheus-collector"
    ],
    "secrets": null,
    "stdin": false,
    "subdue": null,
    "subscriptions": [
      "app_tier"
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

## Assign the InfluxDB handler to the Sensu StatsD listener

To assign your `influxdb-handler` resource to the [Sensu StatsD listener][3] at agent startup and pass all StatsD metrics into InfluxDB:

{{< code shell >}}
sensu-agent start --statsd-event-handlers influxdb-handler
{{< /code >}}

## Validate the InfluxDB handler

It might take a few moments for Sensu to receive metrics after you assign the pipeline to the check or assign the handler to the StatsD server.
After an event is handled, metrics should start populating InfluxDB.
You can verify proper handler behavior with `sensu-backend` logs.
Read [Troubleshoot Sensu][8] for log locations by platform.

Whenever an event is being handled, a log entry is added with the message `"handler":"influxdb-handler","level":"debug","msg":"sending event to handler"`, followed by a second log entry with the message `"msg":"pipelined executed event pipe
handler","output":"","status":0`.

## Next steps

Now that you know how to apply an InfluxDB handler to metrics, read [Aggregate metrics with the Sensu StatsD listener][15] to learn more about using Sensu to implement StatsD and take action on observability events.


[1]: ../../observe-events/events/
[2]: https://github.com/influxdata/influxdb
[3]: ../aggregate-metrics-statsd/
[4]: https://github.com/sensu/sensu-influxdb-handler#installation
[5]: ../../../sensuctl/sensuctl-bonsai/#install-dynamic-runtime-asset-definitions
[6]: ../../../operations/monitoring-as-code/#build-as-you-go
[7]: ../../../operations/monitoring-as-code/
[8]: ../../../operations/maintain-sensu/troubleshoot/
[9]: ../handlers/
[10]: ../../observe-schedule/prometheus-metrics/
[11]: https://github.com/sensu/sensu-influxdb-handler/releases
[12]: ../../../plugins/assets/
[13]: https://bonsai.sensu.io/assets/sensu/sensu-influxdb-handler
[15]: ../aggregate-metrics-statsd/
[16]: ../pipelines/
[17]: ../../observe-filter/filters/#built-in-filter-has_metrics
