---
title: "InfluxDB integration"
linkTitle: "InfluxDB"
description: "Use the Sensu InfluxDB Handler plugin to integrate Sensu with your existing InfluxDB workflows. Read about the features of Sensu's InfluxDB integration and learn how to get the plugin."
version: "6.1"
product: "Sensu Go"
menu: 
  sensu-go-6.1:
    parent: supported-integrations
---

The Sensu InfluxDB Handler plugin is a Sensu [handler][1] that sends Sensu metrics to the time-series database InfluxDB so you can store, instrument, and visualize Sensu metrics data.
You can also use the Sensu InfluxDB Handler integration to create metrics from Sensu status check results for long-term storage in InfluxDB.

{{% notice note %}}
**NOTE**: The Sensu InfluxDB Handler plugin is an example of Sensu's metrics processing and storage integrations.
To find more integrations, search [Bonsai, the Sensu asset index](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

**NEED TO COMPLETE** Can use environment variables and secrets management to avoid exposing your email usernames and passwords? Does event-based templating apply for the InfluxDB integration? Are there other features to add here?

- Transform metrics to InfluxDB format: extract and transform the metrics you collect from different sources like Graphite, OpenTSDB, Nagios, and Influx and populate them into InfluxDB.
- [Event-based templating][2]: include observation data from event attributes to add meaningful, actionable context.

## Get the plugin

For a turnkey experience with the Sensu InfluxDB Handler plugin, use our curated, configurable [quick-start template][3] to integrate Sensu with your existing workflows and store Sensu metrics in InfluxDB.

To build your own workflow or integrate Sensu with existing workflows, use the [Sensu InfluxDB Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset index.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: https://github.com/sensu-community/monitoring-pipelines/blob/latest/metric-storage/influxdb.yaml
[4]: https://bonsai.sensu.io/assets/sensu/sensu-influxdb-handler
[5]: ../../assets/
