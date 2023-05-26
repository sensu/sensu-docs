---
title: "View and manage resources in the web UI"
linkTitle: "View and Manage Resources"
description: "You can view and manage Sensu resources in the user-friendly web UI, including entities, checks, handlers, event filters, and mutators. Read this guide to start viewing and managing your resources in the Sensu web UI."
weight: 20
version: "5.21"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.21:
    parent: web-ui
---

You can view and manage Sensu resources in the web UI, including events, entities, silences, checks, handlers, event filters, and mutators.

## Use the namespace switcher

The web UI displays events, entities, and resources for a single namespace at a time.
By default, the web UI displays the `default` namespace.

To switch namespaces, select the menu icon in the upper-left corner and choose a namespace from the dropdown.

**COMMERCIAL FEATURE**: In the packaged Sensu Go distribution, the namespace switcher will list only the namespaces to which the current user has access.
For more information, see [Get started with commercial features][1].

{{< figure src="/images/archived_version_images/old_namespace_switcher.png" alt="Sensu web UI namespace switcher" link="/images/archived_version_images/old_namespace_switcher.png" target="_blank" >}}

## Manage events

Resolve, re-run, silence, and delete Sensu events in the web UI Events page.

## Manage entities

Silence and delete Sensu entities in the web UI Entities page.

## Manage silences

Create silences by check or subscription name and clear silences in the web UI Silences page.

You can also silence checks and entities from their respective pages in the web UI.
To silence more than one check or entity at a time, click to select the checkbox next to the check or entity name.

After you create a silence, it will be listed in the web UI Silences page until you clear the silence or the silence expires.

## Manage checks, handlers, event filters, and mutators

**COMMERCIAL FEATURE**: Access check, handler, event filter, and mutator management in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][1].

Create, edit, and delete Sensu checks, handlers, event filters, and mutators from their respective pages in the web UI.


[1]: ../../commercial/
