---
title: "Elasticsearch integration"
linkTitle: "Elasticsearch"
description: "Use the Sensu Elasticsearch Handler plugin to integrate Sensu with your existing Elasticsearch workflows. Read about the features of Sensu's Elasticsearch integration and learn how to get the plugin."
version: "6.1"
product: "Sensu Go"
menu: 
  sensu-go-6.1:
    parent: supported-integrations
---

**COMMERCIAL FEATURE**: Access the Sensu Elasticsearch Handler integration in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][6].

The Sensu Elasticsearch Handler plugin is a Sensu [handler][1] that sends observation data from Sensu events and metrics to Elasticsearch.
With this handler, the Sensu observation data you send to Elasticsearch is available for indexing and visualization in Kibana.

{{% notice note %}}
**NOTE**: The Sensu Elasticsearch Handler plugin is an example of Sensu's event and metrics processing and storage integrations.
To find more integrations, search [Bonsai, the Sensu asset index](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

**NEED TO COMPLETE** Can use environment variables and secrets management to avoid exposing your email usernames and passwords? Are there other features to add here?

- Query metrics points within Elasticsearch: the handler automatically mutates metrics data by creating an object with metric point names and their assoicated values and converting tags into event metadata labels.
- [Event-based templating][2]: include observation data from event attributes to add meaningful, actionable context.

## Get the plugin

For a turnkey experience with the Sensu Elasticsearch Handler plugin, use our curated, configurable [quick-start template][3] for events and metrics data storage.

Add the [Sensu Elasticsearch Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset index, to build your own workflow or integrate Sensu with your existing Elasticsearch workflows.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: https://github.com/sensu-community/monitoring-pipelines/blob/master/event-storage/elasticsearch.yaml
[4]: https://bonsai.sensu.io/assets/sensu/sensu-elasticsearch-handler
[5]: ../../assets
[6]: ../../../commercial/
