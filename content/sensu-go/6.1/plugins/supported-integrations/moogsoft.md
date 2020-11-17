---
title: "Moogsoft integration"
linkTitle: "Moogsoft"
description: "Use the Sensu Moogsoft Handler plugin to integrate Sensu with your existing Moogsoft workflows. Read about the features of Sensu's Moogsoft integration and learn how to get the plugin."
version: "6.1"
product: "Sensu Go"
menu: 
  sensu-go-6.1:
    parent: supported-integrations
---

**COMMERCIAL FEATURE**: Access the Sensu Moogsoft Handler integration in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][6].

The Sensu Moogsoft Handler plugin is a Sensu [handler][1] that sends observation data from Sensu events and metrics to Moogsoft.

{{% notice note %}}
**NOTE**: The Sensu Moogsoft Handler plugin is under development and may include breaking changes.<br><br>
The plugin is an example of Sensu's status and metrics processing and storage integrations.
To find more integrations, search [Bonsai, the Sensu asset index](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

**NEED TO COMPLETE** Is my draft list accurate? Are there other features to add here?

- Transform metrics to Moogsoft format: extract and transform the metrics you collect from different sources like Graphite, Influx, and Nagios and populate them into Moogsoft.
- Use Sensu [environment variables and secrets management][3] to avoid exposing your Moogsoft username and password.
- [Event-based templating][2]: include observation data from event attributes to add meaningful, actionable context.

## Get the plugin

Add the [Sensu Moogsoft Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset index, to build your own workflow or integrate Sensu with your existing Moogsoft workflows.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: ../../../operations/manage-secrets/
[4]: https://bonsai.sensu.io/assets/sensu/sensu-moogsoft-handler
[5]: ../../assets
[6]: ../../../commercial/
