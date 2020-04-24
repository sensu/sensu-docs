---
title: "Manage resources in the Sensu Web UI"
linkTitle: "Manage Resources in Web UI"
description: "The Sensu backend includes the Sensu dashboard: a unified view of your Sensu resources with user-friendly tools to reduce alert fatigue. Read this guide to manage resources using the Sensu dashboard."
weight: 20
version: "5.19"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.19:
    parent: web-ui-access
---

- [Manage entities](#manage-entities)
- [Manage checks](#manage-checks)
- [Manage handlers](#manage-handlers)
- [Manage event filters](#manage-event-filters)
- [Manage mutators](#manage-mutators)


The Sensu backend includes the **Sensu dashboard**: a unified view of your events, entities, and checks with user-friendly tools to reduce alert fatigue.

**COMMERCIAL FEATURE**: Access the Sensu dashboard homepage (shown below) in the packaged Sensu Go distribution. For more information, see [Get started with commercial features][6].

<div style="text-align:center">
<img src="/images/homepage.png" alt="Sensu dashboard homepage" width="750">
</div>

<p style="text-align:center"><i>Sensu dashboard homepage</i></p>


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
