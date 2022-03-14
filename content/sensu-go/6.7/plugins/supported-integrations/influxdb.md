---
title: "InfluxDB integration"
linkTitle: "InfluxDB"
description: "Integrate Sensu with your existing InfluxDB workflows and send Sensu metrics to InfluxDB for storage, instrumentation, and visualization."
version: "6.7"
product: "Sensu Go"
menu: 
  sensu-go-6.7:
    parent: supported-integrations
---

The [Sensu InfluxDB Handler plugin][4] is a Sensu [handler][1] that sends Sensu metrics to the time-series database InfluxDB so you can store, instrument, and visualize Sensu metrics data.
You can also use the Sensu InfluxDB Handler integration to create metrics from Sensu status check results for long-term storage in InfluxDB.

{{% notice note %}}
**NOTE**: The Sensu InfluxDB Handler plugin is an example of Sensu's time-series and long-term event storage integrations.
To find more integrations, search [Bonsai, the Sensu asset hub](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

- Transform metrics to InfluxDB format: extract and transform the metrics you collect from different sources in formats like Graphite, OpenTSDB, Nagios, and Influx and populate them into InfluxDB.
- Mutate check status into metrics to be stored in InfluxDB.
- Specify custom values for Sensu event metric points via [metric tags][7].
- Keep your InfluxDB username and password secure with Sensu [environment variables and secrets management][6].

## Get the plugin

For a turnkey experience with the Sensu InfluxDB Handler plugin, use our curated, configurable [quick-start template][3] to integrate Sensu with your existing workflows and store Sensu metrics in InfluxDB.

To build your own workflow or integrate Sensu with existing workflows, add the [Sensu InfluxDB Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset hub.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: https://github.com/sensu/catalog/blob/docs-archive/integrations/influxdb/influxdb.yaml
[4]: https://bonsai.sensu.io/assets/sensu/sensu-influxdb-handler
[5]: ../../assets/
[6]: ../../../operations/manage-secrets/
[7]: ../../../observability-pipeline/observe-schedule/checks/#output-metric-tags
