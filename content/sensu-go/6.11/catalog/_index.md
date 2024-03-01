---
title: "Sensu Catalog"
description: "Read the Sensu Catalog documentation to deploy effective monitoring and observability solutions, add catalog integrations, and create your own private catalog."
product: "Sensu Go"
version: "6.11"
weight: 55
layout: "single"
toc: true
menu:
  sensu-go-6.11:
    identifier: catalog
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the Sensu Catalog in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../commercial/).
{{% /notice %}}

{{% notice note %}}
**NOTE**: The Sensu Catalog is in public preview and is subject to change.
{{% /notice %}}

The Sensu Catalog is a collection of Sensu integrations that provide reference implementations for monitoring and observability and help you integrate Sensu with the platforms and tools you're already using.
Catalog integrations are self-service and designed to help you scale up with fewer barriers.

## Use the official Sensu Catalog in the web UI

In the official Sensu Catalog in the web UI, users install integrations by following prompts and providing custom information.
Sensu then applies any customizations to the integration's resource definitions and deploys the integration configuration to agents in real time.

No external configuration management is required, and users can deploy effective monitoring and observability resources even if they aren't familiar with the Sensu APIs, sensuctl, or the monitoring-as-code workflow.

Read [Configure integrations in the Sensu Catalog][1] to learn about the official Sensu Catalog in the web UI.

## Create your own catalog of integrations

Instead of using the official Sensu Catalog, you can create a private catalog of custom integrations and make it available to you users within the Sensu web UI.

Read the [Catalog integrations reference][3] to learn how to structure your catalog repository, create integration definitions, and use the catalog-api command line interface tool to convert integration files into static API content.

Follow [Build a private catalog of Sensu integrations][2] to create your own catalog.

Read the [Catalog API][4] documentation to learn more about the requests the catalog-api tool makes to generate the files to display in the Sensu Catalog.


[1]: sensu-catalog/
[2]: build-private-catalog/
[3]: catalog-reference/
[4]: catalog-api/
