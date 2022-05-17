---
title: "View and manage resources in the web UI"
linkTitle: "View and Manage Resources"
description: "View and manage Sensu resources in the user-friendly web UI, including events, entities, silences, checks, handlers, event filters, and mutators."
weight: 20
version: "6.7"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.7:
    parent: web-ui
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the web UI in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

You can view and manage Sensu resources in the web UI, including events, entities, silences, checks, handlers, event filters, and mutators.

## Use the namespace switcher

Beyond the [homepage][1], the web UI displays events, entities, and resources for a single namespace at a time.
By default, the web UI displays the `default` namespace.

To switch namespaces, select the menu icon in the upper-left corner or press the `Ctrl+K` keyboard shortcut and choose a namespace from the dropdown.

{{% notice note %}}
**NOTE**: The namespace switcher will list only the namespaces to which the current user has access.
{{% /notice %}}

{{< figure src="/images/namespace-switcher-6-6-0.png" alt="Sensu web UI namespace switcher" link="/images/namespace-switcher-6-6-0.png" target="_blank" >}}

When you switch to a namespace, the left navigation menu loads so you can select specific pages for events, entities, services, silences, catalog, and configuration, which includes checks, handlers, event filters, and mutators:

{{< figure src="/images/webui-left-nav-6-7-0.png" alt="Sensu web UI left navigation menu" link="/images/webui-left-nav-6-7-0.png" target="_blank" >}}

Click the ☰ icon at the top of the left-navigation menu to expand the menu and display page labels:

{{< figure src="/images/expand-webui-left-nav-6-7-0.png" alt="Sensu web UI with expanded left navigation menu" link="/images/expand-webui-left-nav-6-7-0.png" target="_blank" >}}

## Manage events

The Events page opens by default when you navigate to a namespace, with an automatic filter to show only events with a non-passing status (i.e. `event.check.state != passing`).
The top row of the events list includes several other options for filtering and sorting events:

{{< figure src="/images/events-page-filter-sort-6-7-0.png" alt="Filter and sort events" link="/images/events-page-filter-sort-6-7-0.png" target="_blank" >}}

Click the check boxes to select one or more events and resolve, silence, or delete them directly from the Events page:

{{< figure src="/images/group-events-6-7-0.png" alt="Select one or more events on the Events page" link="/images/group-events-6-7-0.png" target="_blank" >}}

Click an event name to view details like status, output, number of occurrences, labels and annotations, related check configuration (if the event was produced by a service check), and entity summary, as well as a timeline that displays the event's last 20 statuses at a glance:

{{< figure src="/images/single-event-view-6-7-0.gif" alt="View details for a single event" link="/images/single-event-view-6-7-0.gif" target="_blank" >}}

## Manage entities

The Entities page provides real-time inventory information for the namespace's endpoints under Sensu management.
The top row of the entities list includes options for filtering and sorting entities on the page:

{{< figure src="/images/entities-page-filter-sort-6-7-0.png" alt="Filter and sort entities" link="/images/entities-page-filter-sort-6-7-0.png" target="_blank" >}}

Click the check boxes to select one or more entities and silence or delete them directly from the Entities page:

{{< figure src="/images/group-entities-6-7-0.png" alt="Select one or more entities on the Entities page" link="/images/group-entities-6-7-0.png" target="_blank" >}}

Click an entity name to view details about the entity's creator, agent version (for agent entities), subscriptions, labels and annotations, associated events, and properties:

{{< figure src="/images/single-entity-view-6-7-0.gif" alt="View details for a single entity" link="/images/single-entity-view-6-7-0.gif" target="_blank" >}}

## Manage services

The Services page includes a module to help you build and configure service entities with service components and rule templates for business service monitoring (BSM).
Read [Build business service monitoring][2] for details about the web UI BSM module.

## Manage silences

Create silences by check or subscription name and clear silences in the web UI Silences page.
The Silences page lists all active silences for the namespace.
The top row of the silences list includes options for filtering and sorting silences on the page:

{{< figure src="/images/silences-filter-sort-6-7-0.png" alt="Filter and sort silences" link="/images/silences-filter-sort-6-7-0.png" target="_blank" >}}

Click `+ NEW` to open a modal window and create silences for individual events, by check or subscription name, or by entity:

{{< figure src="/images/silences-modal-6-7-0.gif" alt="Create a new silence in the modal window" link="/images/silences-modal-6-7-0.gif" target="_blank" >}}

You can also silence individual checks and entities from their detail pages in the web UI.

After you create a silence, it will be listed in the web UI Silences page until you clear the silence or the silence expires.

## Manage configuration resources

Under the Configuration menu option, you can access check, handler, event filter, and mutator resources.
Each resource page lists the namespace's resources.
The top row of each page includes options for filtering and sorting the listed resources.

{{< figure src="/images/configuration-pages-6-7-0.gif" alt="Configuration resource pages in the web UI" link="/images/configuration-pages-6-7-0.gif" target="_blank" >}}

Click a resource name to view the resource's detail page, where you can review more information about the resource and edit or delete it.

On the Checks page, click the check boxes to select one or more checks to execute, silence, unpublish, or delete them.

### Execute checks on demand

You can execute individual checks on demand and on any agent from each check's detail page to test your observability pipeline.

Click **EXECUTE** to open the Execute Check dialog window:

{{< figure src="/images/execute-checks-subs-6-7-0.png" alt="Button for executing a check on demand in the web UI" link="/images/execute-checks-subs-6-7-0.png" target="_blank" >}}

In the Execute Check dialog window, you can execute the check according to its existing subscriptions or add and remove subscriptions to execute it on specific agents.

{{% notice note %}}
**NOTE**: Changing the subscriptions for ad hoc execution in the Execute Check dialog window will not make any changes to the existing subscriptions in the check definition.
{{% /notice %}}

{{< figure src="/images/execute-subscriptions-6-7-0.png" alt="Execute Check dialog window for executing a check on demand from the web UI" link="/images/execute-subscriptions-6-7-0.png" target="_blank" >}}

## View resource data in the web UI

You can view and copy the YAML or JSON definition for any event, entity, or configuration resource directly in the web UI.

### View resource data for an event or entity

To view and copy the YAML and JSON definitions for any event or entity in the web UI:

1. Open the individual resource page for the event or entity.
2. Click ⋮ at the top-right of the page.
3. Select **</> Data** to open the Resource Data modal window.
3. In the Resource Data window, click the **yaml** or **json** button to select the format.
4. Click the copy button at the top-right of the Resource Data window to copy the resource definition.

This example shows how to view and copy the resource data for an event:

{{< figure src="/images/view-event-data-web-ui-6-7-0.gif" alt="View an event's resource data in the web UI" link="/images/view-event-data-web-ui-6-7-0.gif" target="_blank" >}}

### View resource data for a configuration resource

To view and copy the YAML and JSON definitions for any configuration resource in the web UI:

1. Open the individual resource page.
2. Click **RAW**.
3. In the resource data field, click the **yaml** or **json** button to select the format.
4. Click the copy button at the top-right of the resource data field to copy the resource definition.

This example shows how to view and copy the resource data for an event filter:

{{< figure src="/images/view-filter-data-web-ui-6-7-0.gif" alt="View an event filter's resource data in the web UI" link="/images/view-filter-data-web-ui-6-7-0.gif" target="_blank" >}}


[1]: ../#webui-homepage
[2]: ../bsm-module/
