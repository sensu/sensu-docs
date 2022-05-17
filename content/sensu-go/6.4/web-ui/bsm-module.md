---
title: "Build business service monitoring"
linkTitle: "Build Business Service Monitoring"
description: "Use the Sensu web UI module to create, configure, edit, and delete business service monitoring (BSM) service entities, service components, and rule templates."
weight: 30
version: "6.4"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.4:
    parent: web-ui
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the web UI and business service monitoring (BSM) in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

{{% notice note %}}
**NOTE**: Business service monitoring (BSM) is in public preview and is subject to change.
{{% /notice %}}

The Sensu web UI includes a module to help you build and configure business service monitoring (BSM) [service entities][4] with [service components][1] and [rule templates][2].

## Build a business service

{{% notice note %}}
**NOTE**: BSM requires [PostgreSQL](../../operations/deploy-sensu/scale-event-storage/) to achieve high event throughput.
For this reason, the web UI will display a PostgreSQL prompt instead of the BSM module until you configure a PostgreSQL datastore.
{{% /notice %}}

To build a business service in the web UI module:

1. Click ![services icon](/images/web-ui-services-icon.png) in the left navigation menu to open the Services page.
2. Click **ADD NEW SERVICE** to open the Create New Service dialog window.
3. Enter a name for the service entity.
4. Enter labels and annotations, if desired.
5. Click **Submit**.

The updated Services page will include a tile for the new service:

{{< figure src="/images/create-service.gif" alt="Add a new business service with the web UI module" link="/images/create-service.gif" target="_blank" >}}

The business service itself is an entity with the class `service`, so it will also be listed on the [Entities page][3].

To add service components to a business service:

1. Click ⋮ for the business service.
2. Select **Add Component** from the drop-down menu to open the Configure New Service Component dialog window.
3. Enter a name for the service component.
4. Enter labels and annotations, if desired.
5. Enter query selectors to describe the events that each monitoring rule should process for the service component.
6. Select the rule template you wish to use and a unique name to use for the rule-specific events.
7. Enter values for the arguments to pass to the rule template.
Available arguments will vary for different rule templates.
8. Specify the type of check scheduling the service component should use (interval or cron) as well as the desired interval in seconds or cron scheduling statement.
9. Specify the handlers the service component should use.
10. Click **Submit**.

The updated business service tile will include the service component:

{{< figure src="https://sensu-docs.s3.amazonaws.com/images/create-service-component.gif" alt="Add a new service component to a business service with the web UI module" link="https://sensu-docs.s3.amazonaws.com/images/create-service-component.gif" target="_blank" >}}

## View and manage business services

After you create a business service by any means (web UI, API, or sensuctl), it will be listed in the web UI Services page until you delete it.

Click the business service name to view its events and other related details and edit, silence, or delete the service:

{{< figure src="/images/business-service-detail-page.png" alt="View the business service detail page" link="/images/business-service-detail-page.png" target="_blank" >}}

To edit, add components to, or delete a business service, click ⋮ at the top-right corner of the service's tile.

## View and manage service components

After you add a service component to a business service, it will be listed on the business service tile in the web UI Services page until you delete it.
To edit or delete a service component, click ⋮ at the right of the component's name:

{{< figure src="/images/edit-service-component.png" alt="Edit a service component" link="/images/edit-service-component.png" target="_blank" >}}

Click the service component name to view its events and other related details.
You can also edit, silence, and delete the component from the detail page.


[1]: ../../observability-pipeline/observe-schedule/service-components/
[2]: ../../observability-pipeline/observe-schedule/rule-templates/
[3]: ../view-manage-resources/#manage-entities
[4]: ../../observability-pipeline/observe-entities/#service-entities
