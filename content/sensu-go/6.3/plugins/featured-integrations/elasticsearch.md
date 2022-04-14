---
title: "Elasticsearch integration"
linkTitle: "Elasticsearch"
description: "Use the Sensu Elasticsearch Handler integration to send observation data from Sensu events to Elasticsearch for indexing and visualization in Kibana."
version: "6.3"
product: "Sensu Go"
menu: 
  sensu-go-6.3:
    parent: featured-integrations
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the Sensu Elasticsearch Handler integration in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

The [Sensu Elasticsearch Handler plugin][4] is a Sensu [handler][1] that sends observation data from Sensu events and metrics to Elasticsearch.
With this handler, the Sensu observation data you send to Elasticsearch is available for indexing and visualization in Kibana.

{{% notice note %}}
**NOTE**: The Sensu Elasticsearch Handler plugin is an example of Sensu's time-series and long-term event storage integrations.
To find more integrations, search [Bonsai, the Sensu asset hub](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

- Query metrics points within Elasticsearch: the handler automatically mutates metrics data by creating a top-level object with metric point names and their associated values.
- Index entire events for searching within Kibana.
- Use daily, weekly, monthly, and yearly index specification (for example, sensu_events-2020-11-10).
- Omit the transmission of certain redundant event fields to reduce the number of items indexed.
- Specify custom values for Sensu event metric points via [metric tags][8].
- Use [event-based templating][2] to include observation data from event attributes to add meaningful, actionable context.
- Keep your Elasticsearch username and password secure with Sensu [environment variables and secrets management][7].

## Get the plugin

For a turnkey experience with the Sensu Elasticsearch Handler plugin, use our curated, configurable [quick-start template][3] for events and metrics data storage.

Add the [Sensu Elasticsearch Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset hub, to build your own workflow or integrate Sensu with your existing Elasticsearch workflows.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: https://github.com/sensu/catalog/blob/docs-archive/integrations/elasticsearch/elasticsearch.yaml
[4]: https://bonsai.sensu.io/assets/sensu/sensu-elasticsearch-handler
[5]: ../../assets/
[7]: ../../../operations/manage-secrets/
[8]: ../../../observability-pipeline/observe-schedule/checks/#output-metric-tags
