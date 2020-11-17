---
title: "OpenTSDB integration"
linkTitle: "OpenTSDB"
description: "Use the Sensu OpenTSDB Handler plugin to integrate Sensu with your existing OpenTSDB workflows. Read about the features of Sensu's OpenTSDB integration and learn how to get the plugin."
version: "6.1"
product: "Sensu Go"
menu: 
  sensu-go-6.1:
    parent: supported-integrations
---

The Sensu OpenTSDB Handler plugin is a Sensu [handler][1] that sends Sensu metrics to an OpenTSDB server via its Telnet-style API.
This allows you to extract, tag, and store Sensu metrics data in an OpenTSDB database.

{{% notice note %}}
**NOTE**: The Sensu OpenTSDB Handler plugin is an example of Sensu's status and metrics processing and storage integrations.
To find more integrations, search [Bonsai, the Sensu asset index](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

**NEED TO COMPLETE** Is the list I drafted below accurate? Does event-based templating apply for the OpenTSDB integration? Are there other features to add here?

- Transform metrics to OpenTSDB format: extract and transform the metrics you collect from different sources like Graphite, Influx, and Nagios and populate them into OpenTSDB.
- Use Sensu [environment variables and secrets management][3] to avoid exposing your OpenTSDB username and password.
- [Event-based templating][2]: include observation data from event attributes to add meaningful, actionable context.

## Get the plugin

To build your own workflow or integrate Sensu with existing workflows, add the [Sensu OpenTSDB Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset index.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: ../../../operations/manage-secrets/
[4]: https://bonsai.sensu.io/assets/sensu/sensu-opentsdb-handler
[5]: ../../assets/
