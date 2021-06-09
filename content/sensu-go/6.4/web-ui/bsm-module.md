---
title: "Build business service monitoring"
linkTitle: "Build Business Service Monitoring"
description: "The Sensu web UI includes a module for creating, configuring, editing, and deleting business service monitoring (BSM) service components and rule templates. Read this page to learn how to use the Sensu web UI BSM module."
weight: 30
version: "6.4"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.4:
    parent: web-ui
---

{{% notice important %}}
**IMPORTANT**: Business service monitoring is in public preview and is subject to change. 
{{% /notice %}}

**COMMERCIAL FEATURE**: Access business service monitoring (BSM) in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][3].

The Sensu web UI includes a module to help you build and configure business service monitoring (BSM) [service entities][4] with [service components][1] and [rule templates][2].

## Build a business service

To build a business service in the web UI module:

1. Click the services icon in the left navigation menu to open the Services page: ![services icon](/images/web-ui-services-icon.png)
2. Click **ADD NEW SERVICE** to open the Create New Service dialog window.
3. Enter the metadata for the new service and click **Submit**.

The Services page will be updated to include a tile for the new service.
The business service itself is an entity with the class `service`, so it will also be listed on the Entities page.

To add service components to a business service:

1. Click the kebab icon for the business service: ![kebab icon](/images/web-ui-kebab-icon.png)
2. Select **Add Component** from the drop-down menu to open the Configure New Service Component dialog window.
3. Enter the metadata, query selectors, rule templates, check scheduling, and handlers for the service component and click **Submit**.

The list on the business service tile will be updated to include the service component.

## View and manage business services

After you create a business service by any means (web UI, API, or sensuctl), it will be listed in the web UI Services page until you delete it.
Click the business service name to view its events and other related details.
You can also edit, silence, and delete the service from the detail page.

To edit, add components to, or delete a business service, click the kebab icon in the top-right corner of the service's tile.

## View and manage service components

After you add a service component to a business service, it will be listed on the business service tile in the web UI Services page until you delete it.
To edit or delete a service component, click the kebab icon to the right of the component name in the list.

Click the service component name to view its events and other related details.
You can also edit, silence, and delete the component from the detail page.


[1]: ../../observability-pipeline/observe-schedule/service-components/
[2]: ../../observability-pipeline/observe-schedule/rule-templates/
[3]: ../../commercial/
[4]: ../../observability-pipeline/observe-entities/#service-entities
