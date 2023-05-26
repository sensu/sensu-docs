---
title: "Dashboard overview"
linkTitle: "Overview"
description: "The Sensu backend includes the Sensu dashboard: a unified view of your Sensu resources with user-friendly tools to reduce alert fatigue. Read this guide to start using the Sensu dashboard."
weight: 120
version: "5.16"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.16:
    parent: dashboard
---

- [Access the dashboard](#access-the-dashboard)
- [Sign in](#sign-in)
- [Themes](#themes)
- [Namespaces](#namespaces)
  - [Namespace switcher](#namespace-switcher)
- [Manage entities](#manage-entities)
- [Manage checks](#manage-checks)
- [Manage handlers](#manage-handlers)
- [Manage event filters](#manage-event-filters)
- [Manage mutators](#manage-mutators)


The Sensu backend includes the **Sensu dashboard**: a unified view of your events, entities, and checks with user-friendly tools to reduce alert fatigue.

**COMMERCIAL FEATURE**: Access the Sensu dashboard homepage (shown below) in the packaged Sensu Go distribution. For more information, see [Get started with commercial features][6].

<div style="text-align:center">
<img src="/images/archived_version_images/homepage.png" alt="Sensu dashboard homepage" width="750">
</div>

<p style="text-align:center"><i>Sensu dashboard homepage</i></p>

## Access the dashboard

After you [start the Sensu backend][1], you can access the dashboard in your browser by visiting http://localhost:3000.

_**NOTE**: You may need to replace `localhost` with the hostname or IP address where the Sensu backend is running._

## Sign in

Sign in to the dashboard with your [sensuctl][2] username and password.
See the [role-based access control reference][3] for [default user credentials][4] and instructions for [creating new users][5].

## Themes

Use the preferences menu to change the theme or switch to the dark theme.

## Namespaces

The dashboard displays events, entities, checks, and silences for a single namespace at a time.
By default, the dashboard displays the `default` namespace.

### Namespace switcher

To switch namespaces, select the menu icon in the upper-left corner and choose a namespace from the dropdown.

**COMMERCIAL FEATURE**: In the packaged Sensu Go distribution, the namespace switcher will list only the namespaces to which the current user has access. For more information, see [Get started with commercial features][6].

<img src="/images/archived_version_images/dashboard_namespace_switcher.png" alt="Screenshot of the Sensu dashboard namespace switcher">

<p style="text-align:center"><i>Sensu dashboard namespace switcher</i></p>

## Manage entities

You can delete Sensu entities in the dashboard Entities page.

## Manage checks

**COMMERCIAL FEATURE**: Access check management in the packaged Sensu Go distribution. For more information, see [Get started with commercial features][6].

You can create, edit, and delete Sensu checks in the dashboard Checks page.

## Manage handlers

**COMMERCIAL FEATURE**: Access handler management in the packaged Sensu Go distribution. For more information, see [Get started with commercial features][6].

You can create, edit, and delete Sensu handlers in the dashboard Handlers page.

## Manage event filters

**COMMERCIAL FEATURE**: Access filter management in the packaged Sensu Go distribution. For more information, see [Get started with commercial features][6].

You can create, edit, and delete Sensu event filters in the dashboard Filters page.

## Manage mutators

**COMMERCIAL FEATURE**: Access mutator management in the packaged Sensu Go distribution. For more information, see [Get started with commercial features][6].

You can create, edit, and delete Sensu mutators in the dashboard Mutators page.

[1]: ../../reference/backend#restart-the-service
[2]: ../../sensuctl/reference/
[3]: ../../reference/rbac/
[4]: ../../reference/rbac#default-users
[5]: ../../reference/rbac#create-users
[6]: ../../getting-started/enterprise/
