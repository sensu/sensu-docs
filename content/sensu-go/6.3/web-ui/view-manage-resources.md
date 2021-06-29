---
title: "View and manage resources in the web UI"
linkTitle: "View and Manage Resources"
description: "You can view and manage Sensu resources in the user-friendly web UI, including entities, checks, handlers, event filters, and mutators. Read this guide to start viewing and managing your resources in the Sensu web UI."
weight: 20
version: "6.3"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.3:
    parent: web-ui
---

You can view and manage Sensu resources in the web UI, including events, entities, silences, checks, handlers, event filters, and mutators.

## Use the namespace switcher

Beyond the [homepage][1], the web UI displays events, entities, and resources for a single namespace at a time.
By default, the web UI displays the `default` namespace.

To switch namespaces, select the menu icon in the upper-left corner or press the `Ctrl+K` keyboard shortcut and choose a namespace from the dropdown.

{{% notice commercial %}}
**COMMERCIAL FEATURE**: In the packaged Sensu Go distribution, the namespace switcher will list only the namespaces to which the current user has access.
For more information, see [Get started with commercial features](../../commercial/).
{{% /notice %}}

{{< figure src="/images/namespace-switcher-1.png" alt="Sensu web UI namespace switcher" link="/images/namespace-switcher-1.png" target="_blank" >}}

When you switch to a namespace, the left navigation menu loads so you can select specific pages for events, entities, services, silences, and configuration, which includes checks, handlers, event filters, and mutators:

{{< figure src="/images/webui-left-nav.png" alt="Sensu web UI left navigation menu" link="/images/webui-left-nav.png" target="_blank" >}}

Click the kebab icon at the top of the left-navigation menu to expand the menu and display page labels:

{{< figure src="/images/expand-webui-left-nav.png" alt="Sensu web UI with expanded left navigation menu" link="/images/expand-webui-left-nav.png" target="_blank" >}}

## Manage events

The Events page opens by default when you navigate to a namespace, with an automatic filter to show only events with a non-passing status (i.e. `event.check.state != 0`).
The top row of the events list includes several other options for filtering and sorting events.

Click the check boxes to select one or more events and resolve, re-run, silence, or delete them directly from the Events page.

Click an event name to view information like status, output, number of occurrences, labels and annotations, related check configuration (if the event was produced by a service check), and associated entity, as well as a timeline that displays the event's last 20 statuses at a glance.

## Manage entities

The Entities page provides real-time inventory information for the namespace's endpoints under Sensu management.

The top row of the entities list includes options for filtering and sorting entities on the page.
Click the check boxes to select one or more entities and edit, silence, or delete them directly from the Entities page.

Click an entity name to view information about associated events, system properties, and labels and annotations.

## Manage services

The Services page includes a module to help you build and configure service entities with service components and rule templates for business service monitoring (BSM).
Read [Build business service monitoring][2] for details about the web UI BSM module.

## Manage silences

The Silences page lists all active silences for the namespace.
The top row of the silences list includes options for filtering and sorting silences on the page.

Use the Silences page to create and clear silences for individual events, by check or subscription name, or by entity.
You can also silence checks and entities from their respective pages in the web UI.
To silence more than one check or entity at a time, click to select the checkbox next to the check or entity name.

After you create a silence, it will be listed in the web UI Silences page until you clear the silence or the silence expires.

## Manage configuration resources

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access check, handler, event filter, and mutator management in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features](../../commercial/).
{{% /notice %}}

Under the Configuration menu option, you can access check, handler, event filter, and mutator resources.
Each resource page lists the namespace's resources.
The top row of each page includes options for filtering and sorting the listed resources.

Click a resource name to see detailed information and edit or delete it.

On the Checks page, click the check boxes to select one or more checks to execute, silence, unpublish, or delete them.
You can also execute individual checks on demand from their check detail pages to test your observability pipeline.


[1]: ../#webui-homepage
[2]: ../bsm-module/
