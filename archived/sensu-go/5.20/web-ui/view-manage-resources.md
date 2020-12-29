---
title: "View and manage resources in the web UI"
linkTitle: "View and Manage Resources"
description: "You can view and manage Sensu resources in the user-friendly web UI, including entities, checks, handlers, event filters, and mutators. Read this guide to start viewing and managing your resources in the Sensu web UI."
weight: 20
version: "5.20"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.20:
    parent: web-ui
---

You can view and manage Sensu resources in the web UI, including events, entities, silences, checks, handlers, event filters, and mutators.

## Use the namespace switcher

The web UI displays events, entities, and resources for a single namespace at a time.
By default, the web UI displays the `default` namespace.

To switch namespaces, select the menu icon in the upper-left corner and choose a namespace from the dropdown.

**COMMERCIAL FEATURE**: In the packaged Sensu Go distribution, the namespace switcher will list only the namespaces to which the current user has access. For more information, see [Get started with commercial features][1].

<div style="text-align:center">
<img src="/images/namespace-switcher-1.png" alt="Sensu web UI namespace switcher" width="750">
</div>

<p style="text-align:center"><i>Sensu web UI namespace switcher</i></p>

## Manage events

Resolve, re-run, silence, and delete Sensu events in the web UI Events page.

## Manage entities

Silence and delete Sensu entities in the web UI Entities page.

## Manage silences

Create and clear silences in the web UI Silences page.

## Manage checks, handlers, event filters, and mutators

**COMMERCIAL FEATURE**: Access check, handler, event filter, and mutator management in the packaged Sensu Go distribution. For more information, see [Get started with commercial features][1].

Create, edit, and delete Sensu checks, handlers, event filters, and mutators from their respective pages in the web UI.


[1]: ../../commercial/
