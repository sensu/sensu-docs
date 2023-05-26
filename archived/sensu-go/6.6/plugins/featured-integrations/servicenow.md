---
title: "ServiceNow integration"
linkTitle: "ServiceNow"
description: "Use the Sensu ServiceNow Handler integration to create and update ServiceNow incidents and events based on observation data from Sensu Go events."
version: "6.6"
product: "Sensu Go"
menu: 
  sensu-go-6.6:
    parent: featured-integrations
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the Sensu ServiceNow Handler integration in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../../commercial/).
{{% /notice %}}

The [Sensu ServiceNow Handler plugin][4] is a Sensu [handler][1] that creates and updates ServiceNow incidents and events based on observation data from Sensu events.

{{% notice note %}}
**NOTE**: The Sensu ServiceNow Handler plugin is an example of Sensu's alerting and incident management integrations.
To find more integrations, search [Bonsai, the Sensu asset hub](https://bonsai.sensu.io/).
{{% /notice %}}

## Features

- Automatically create a ServiceNow Configuration Item if none currently exists for a particular Sensu entity.
- Tunable arguments: use Sensu annotations to set custom incident notes, event information, Configuration Item descriptions, and more in ServiceNow.
- Use [event-based templating][2] to include observation data from event attributes to add meaningful, actionable context to ServiceNow incidents, events, and Configuration Items.
- Keep your ServiceNow username and password secure with Sensu [environment variables and secrets management][9].

## Get the plugin

For a turnkey experience with the Sensu ServiceNow Handler plugin, use one of our curated, configurable quick-start templates:

- [ServiceNow Incident Management][7]: send Sensu observability alerts to ServiceNow Incident Management.
- [ServiceNow Event Management][3]: send Sensu observability data to ServiceNow Event Management.
- [ServiceNow Configuration Management Database (CMDB)][8]: register Sensu entities as configuration items in ServiceNow CMDB.

You can also add the [Sensu ServiceNow Handler plugin][4] with a dynamic runtime asset from Bonsai, the Sensu asset hub, to build your own workflow or integrate Sensu with your existing ServiceNow workflows.
[Dynamic runtime assets][5] are shareable, reusable packages that make it easier to deploy Sensu plugins.


[1]: ../../../observability-pipeline/observe-process/handlers/
[2]: ../../../observability-pipeline/observe-process/handler-templates/
[3]: https://github.com/sensu/catalog/blob/docs-archive/integrations/servicenow/servicenow-events.yaml
[4]: https://bonsai.sensu.io/assets/sensu/sensu-servicenow-handler
[5]: ../../assets/
[7]: https://github.com/sensu/catalog/blob/docs-archive/integrations/servicenow/servicenow-incident.yaml
[8]: https://github.com/sensu/catalog/blob/docs-archive/integrations/servicenow/servicenow-cmdb.yaml
[9]: ../../../operations/manage-secrets/
