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

When you switch to a namespace, the left-navigation menu expands so you can select specific views: events, entities, silences, services, and configuration, which includes checks, handlers, event filters, and mutators.

## Manage events

The Events page opens by default when you navigate to a namespace, with an automatic filter to show only events with a non-passing status (i.e. `event.check.state != 0`).
The top row of the events list includes several other options for filtering and sorting events.

Click the check boxes to select one or more events and resolve, re-run, silence, or delete them directly from the Events page.

Click an event name to view information like status, output, number of occurrences, labels and annotations, related check configuration (if the event was produced by a service check), and associated entity, as well as a timeline that displays the event's history at a glance.

## Manage entities

The Entities page provides real-time inventory information for the namespace's endpoints under Sensu management.

The top row of the entities list includes options for filtering and sorting entities on the page.
Click the check boxes to select one or more entities and edit, silence, or delete them directly from the Entities page.

Click an entity name to view information about associated events, system properties, and labels and annotations.

## Manage silences

The Silences page lists all active silences for the namespace.
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
Each page provides Each of the configuration resources provides list + detail views, as well as the ability to create and/or edit configuration resources (e.g. modify check or handler configuration), assuming the user has the appropriate RBAC permissions.

Create, edit, and delete Sensu checks, handlers, event filters, and mutators from their respective pages in the web UI.
Execute checks on demand from individual check pages to test your observability pipeline.


[1]: ../#webui-homepage
