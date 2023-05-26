---
title: "View and manage resources in the web UI"
linkTitle: "View and Manage Resources"
description: "You can view and manage Sensu resources in the user-friendly web UI, including entities, checks, handlers, event filters, and mutators. Read this guide to start viewing and managing your resources in the Sensu web UI."
weight: 20
version: "6.1"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.1:
    parent: web-ui
---

You can view and manage Sensu resources in the web UI, including events, entities, silences, checks, handlers, event filters, and mutators.

## Use the namespace switcher

Beyond the [homepage][1], the web UI displays events, entities, and resources for a single namespace at a time.
By default, the web UI displays the `default` namespace.

To switch namespaces, select the menu icon in the upper-left corner or press the `Ctrl+K` keyboard shortcut and choose a namespace from the dropdown.

{{% notice commercial %}}
**COMMERCIAL FEATURE**: In the packaged Sensu Go distribution, the namespace switcher will list only the namespaces to which the current user has access.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

{{< figure src="/images/archived_version_images/old_namespace_switcher.png" alt="Sensu web UI namespace switcher" link="/images/archived_version_images/old_namespace_switcher.png" target="_blank" >}}

When you switch to a namespace, the left navigation menu loads so you can select specific pages for events, entities, silences, and configuration, which includes checks, handlers, event filters, and mutators:

{{< figure src="/images/archived_version_images/old_web_ui_left_nav.png" alt="Sensu web UI left navigation menu" link="/images/archived_version_images/old_web_ui_left_nav.png" target="_blank" >}}

Click the triple-bar icon at the top of the left-navigation menu to expand the menu and display page labels:

{{< figure src="/images/archived_version_images/old_expand_web_ui_left_nav.png" alt="Sensu web UI with expanded left navigation menu" link="/images/archived_version_images/old_expand_web_ui_left_nav.png" target="_blank" >}}

## Manage events

The Events page opens by default when you navigate to a namespace, with an automatic filter to show only events with a non-passing status (i.e. `event.check.state != passing`):

{{< figure src="/images/events-page-default.png" alt="Sensu web UI default Events page" link="/images/events-page-default.png" target="_blank" >}}

The top row of the events list includes several other options for filtering and sorting events:

{{< figure src="/images/archived_version_images/old_events_page_filter_sort.png" alt="Filter and sort events" link="/images/archived_version_images/old_events_page_filter_sort.png" target="_blank" >}}

Click the check boxes to select one or more events and resolve, silence, or delete them directly from the Events page:

{{< figure src="/images/archived_version_images/old_group_events.png" alt="Select one or more events on the Events page" link="/images/archived_version_images/old_group_events.png" target="_blank" >}}

Click an event name to view details like status, output, number of occurrences, labels and annotations, related check configuration (if the event was produced by a service check), and associated entity, as well as a timeline that displays the event's last 20 statuses at a glance:

{{< figure src="/images/archived_version_images/old_single_event_view.gif" alt="View details for a single event" link="/images/archived_version_images/old_single_event_view.gif" target="_blank" >}}

## Manage entities

The Entities page provides real-time inventory information for the namespace's endpoints under Sensu management.
The top row of the entities list includes options for filtering and sorting entities on the page:

{{< figure src="/images/archived_version_images/old_entities_page_filter_sort.png" alt="Filter and sort entities" link="/images/archived_version_images/old_entities_page_filter_sort.png" target="_blank" >}}

Click the check boxes to select one or more entities and silence or delete them directly from the Entities page:

{{< figure src="/images/archived_version_images/old_group_entities.png" alt="Select one or more entities on the Entities page" link="/images/archived_version_images/old_group_entities.png" target="_blank" >}}

Click an entity name to view details about associated events, system properties, and labels and annotations:

{{< figure src="/images/archived_version_images/old_single_entity_view.gif" alt="View details for a single entity" link="/images/archived_version_images/old_single_entity_view.gif" target="_blank" >}}

## Manage silences

Create silences by check or subscription name and clear silences in the web UI Silences page.
The Silences page lists all active silences for the namespace.
The top row of the silences list includes options for filtering and sorting silences on the page:

{{< figure src="/images/archived_version_images/old_silences_filter_sort.png" alt="Filter and sort silences" link="/images/archived_version_images/old_silences_filter_sort.png" target="_blank" >}}

Click `+ NEW` to open a modal window and create silences for individual events, by check or subscription name, or by entity:

{{< figure src="/images/archived_version_images/old_silences_dialog.gif" alt="Create a new silence in the dialog window" link="/images/archived_version_images/old_silences_dialog.gif" target="_blank" >}}

You can also silence individual checks and entities from their detail pages in the web UI.

After you create a silence, it will be listed in the web UI Silences page until you clear the silence or the silence expires.

## Manage configuration resources

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access check, handler, event filter, and mutator management in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

Under the Configuration menu option, you can access check, handler, event filter, and mutator resources.
Each resource page lists the namespace's resources.
The top row of each page includes options for filtering and sorting the listed resources.

{{< figure src="/images/archived_version_images/old_configuration_pages.gif" alt="Configuration resource pages in the web UI" link="/images/archived_version_images/old_configuration_pages.gif" target="_blank" >}}

Click a resource name to view detailed information and edit or delete it.

On the Checks page, click the check boxes to select one or more checks to execute, silence, unpublish, or delete them.
You can also execute individual checks on demand from their check detail pages to test your observability pipeline:

{{< figure src="/images/archived_version_images/old_execute_checks.png" alt="Execute a check on demand in the web UI" link="/images/archived_version_images/old_execute_checks.png" target="_blank" >}}


[1]: ../#webui-homepage
