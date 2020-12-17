---
title: "OpenTSDB integration"
linkTitle: "OpenTSDB"
description: "Use the Sensu OpenTSDB Handler plugin to integrate Sensu with your existing OpenTSDB workflows. Read about the features of Sensu's OpenTSDB integration and learn how to get the plugin."
version: "6.0"
product: "Sensu Go"
menu: 
  sensu-go-6.0:
    parent: supported-integrations
---

The [Sensu OpenTSDB Handler plugin][4] is a Sensu [handler][1] that sends Sensu metrics to an OpenTSDB server via its Telnet-style API.
This allows you to extract, tag, and store Sensu metrics data in an OpenTSDB database.

{{% notice note %}}
**NOTE**: The Sensu OpenTSDB Handler plugin is an example of Sensu's time-series and long-term event storage integrations.
To find more integrations, search [Bonsai, the Sensu asset hub](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

- Transform metrics to OpenTSDB format: extract and transform the metrics you collect from different sources in formats like Graphite, Influx, and Nagios and populate them into OpenTSDB.
- Specify custom values for Sensu event metric points via [metric tags][6].

## Get the plugin

To build your own workflow or integrate Sensu with existing workflows, add the [Sensu OpenTSDB Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset hub.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: ../../../operations/manage-secrets/
[4]: https://bonsai.sensu.io/assets/sensu/sensu-opentsdb-handler
[5]: ../../assets/
[6]: ../../../observability-pipeline/observe-schedule/checks/#output-metric-tags
