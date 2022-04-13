---
title: "Sensu Catalog"
linkTitle: "Sensu Catalog"
description: "Find, configure, and install powerful monitoring and observability integrations in the Sensu Catalog, Sensu's online marketplace."
weight: 25
version: "6.7"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.7:
    parent: web-ui
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the web UI and the Sensu Catalog in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

{{% notice note %}}
**NOTE**: The Sensu Catalog is in public preview and is subject to change.
{{% /notice %}}

The Sensu Catalog is an online marketplace for monitoring and observability integrations, from standard system checks and metrics collection to pipelines for sending Sensu data to third-party logging, remediation, and incident management services.

The Sensu Catalog is part of the Sensu [web UI][21], so you can find, configure, and install integrations directly from your browser.

{{< figure src="/images/catalog_alphabetical.png" alt="The Sensu Catalog page in the Sensu web UI" link="/images/catalog_alphabetical.png" target="_blank" >}}

An integration combines a Sensu plugin with a dynamic runtime asset and the Sensu resource definitions that use the plugin.

- The [plugin][1] provides the executable script or other program to power a Sensu check, handler, or mutator.
- The [dynamic runtime asset][20] is a shareable, reusable package that installs and deploys the plugin.

Integrations provide the plugin and asset along with the recommended or minimum viable configuration and Sensu resources, integrating Sensu with different systems and services for collecting and processing observability data with a few clicks.

Sensu Catalog integrations allow you to configure powerful real-time monitoring and observability for the systems you rely on.
All integrations are self-service and designed to help you scale up with fewer barriers.
Sensu curates, tests, and maintains the Catalog integrations, and installation follows a standardized process.

## Find integrations

Find integrations in the Sensu Catalog by browsing [alphabetized][15], [categorized][16], and [metadata-based][17] lists.
You can also [search][19] the Sensu Catalog by display_name, class, provider, and tags.

### Browse the alphabetized list

When the Catalog page loads in the Sensu web UI, all integrations are alphabetically listed by default.
To return to the alphabetized list at any time, click the **All** category in the Catalog page sidebar navigation menu:

{{< figure src="/images/catalog_all.png" alt="All category for integrations on the Sensu Catalog page in the Sensu web UI" link="/images/catalog_all.png" target="_blank" >}}

### Browse the categorized list

The Catalog page sidebar navigation menu lists integrations in categories based on class and function.
Click a category to retrieve the associated integrations.

{{< figure src="/images/catalog_menu.png" alt="Category-based menu for the Sensu Catalog page in the Sensu web UI" link="/images/catalog_menu.png" target="_blank" >}}

Three categories describe the integration class:
- **Enterprise**: Integrations contributed by one of Sensu's third-party partners.
- **Supported**: Integrations that Sensu developed. Supported integrations may be [commercial features][7] that require a valid Sensu [license][8].
- **Community**: Integrations contributed by members of the Sensu community. Community integrations are free and open-source.

The **Sensu Plus** category includes our [Sensu Plus][12]-enabled integrations, which provide turnkey analytics via Sumo Logic applications and dashboards.

The rest of the categories are based on the integration's function, like cloud monitoring or automated remediation.

### Browse a metadata-based list

Each integration has associated metadata listed on the integration detail page:

{{< figure src="/images/catalog_integration_metadata.png" alt="Example metadata for an integration in the Sensu web UI" link="/images/catalog_integration_metadata.png" target="_blank" >}}

You can search the Sensu Catalog for integrations with particular `provider` or `tags` metadata from the Catalog main page:

{{< figure src="/images/catalog_metadata_search.gif" alt="Sensu Catalog search for integrations with 'aws' in tags" link="/images/catalog_metadata_search.gif" target="_blank" >}}

### Search for integrations

The Sensu Catalog includes basic search using substring matching, as well as advanced searches based on integration display_name, class, provider, and tags.

Sensu Catalog search supports two set-based operators:

| operator  | description        | example                |
| --------- | ------------------ | ---------------------- |
| `in`      | Included in        | `ansible in tags`
| `matches` | Substring matching | `display_name ansible matches`

#### Quick search for integrations

The Sensu Catalog quick search allows you to search without using any particular syntax.
Type your search term into the search field on the Catalog page of the web UI and press `Enter`.
Sensu will auto-complete a simple search statement for the resources on that page using substring matching:

{{< figure src="/images/catalog_name_search.gif" alt="Sensu Catalog search for integrations by name" link="/images/catalog_name_search.gif" target="_blank" >}}

## Get information about an integration

In the Sensu Catalog, integrations are represented by tiles.
When you click an integration tile, the integration's detail page opens.
The detail page includes tabs for **README**, **CHANGELOG**, **SENSU RESOURCES**, and **RAW**.

{{< figure src="/images/catalog_integration_info_tabs.png" alt="Location of README, CHANGELOG, SENSU RESOURCES, and RAW tabs for an integration in the Sensu Catalog" link="/images/catalog_integration_info_tabs.png" target="_blank" >}}

The **README** tab contains detailed information about the integration, including an overview, supported dashboards, setup instructions, the plugins the integration requires, the metrics and alerts the integration generates, and links to reference information.
The **README** also describes any additional configuration needed to use the integration, like subscriptions to add to agent entities or secrets to create for sensitive information.

The **CHANGELOG** tab lists the notable changes, improvements, and fixes for all versions of the integration. 

The **SENSU RESOURCES** tab contains usable examples of all of the resource definitions you need to use the integration, including the plugin [asset][4], [secrets][5], [checks][2], [handlers][3], and [pipelines][6].
Click the `yaml` or `json` buttons to select the format for each definition.

{{% notice note %}}
**NOTE**: The SENSU RESOURCES tab lists example resource definitions that you must configure and install.
Use the **INSTALL** button to [configure and install the integration](#configure-and-install-an-integration) directly from your browser or copy the example definitions to configure and create with [sensuctl](../../sensuctl/create-manage-resources/) or the Sensu [API](../../api/).
{{% /notice %}}

The **RAW** tab contains the resource definition for the integration itself.
The raw resource definition allows you to customize the integration if needed.
Click the `yaml` or `json` buttons to select the format for the integration definition.

## Configure and install an integration

When you find an integration you want to use, click the integration tile to open the detail page.
To configure and install an integration:

1. Click **INSTALL** to open the configuration wizard.
The configuration wizard is a multi-page form with fields and prompts for collecting additional configuration attributes for the integration.
2. Type values in each attribute field in the wizard to configure the integration for your instance.
Use the **NEXT** and **BACK** buttons to navigate through wizard pages as needed.
3. Review the resource definitions on the Summary page.
4. Click **APPLY** to save your configuration and create the integration resources.
5. Click **FINISH** on the confirmation page to close the configuration wizard.

{{% notice note %}}
**NOTE**: When you click **APPLY** in step 4, Sensu creates all of the resources the integration requires.
Check resources are automatically published and will execute immediately.
{{% /notice %}}

The configuration wizard suggests values for each attribute field.
These suggestions are collected from your existing resources and refined based on the specific requirements of the integration.
For example, if you are setting up a metrics collection integration that requires a pipeline, the wizard will only suggest existing metrics-compatible pipelines for that integration.
If you do not have any metrics-compatible pipelines, the wizard will not make suggestions for that attribute.

The Summary page of the configuration wizard lists the definition for each resource that Sensu will create when you click **APPLY**.
These resource definitions include the attribute values you provided in the configuration wizard.
Click the dropdown arrows to review the resource definitions:

{{< figure src="/images/catalog_integration_summary_definitions.gif" alt="Summary page of configuration wizard for a Sensu Catalog integration" link="/images/catalog_integration_summary_definitions.gif" target="_blank" >}}

The resulting resource definitions represent Sensu's recommended configuration for the integration.

### Duplicate integrations and existing resources

You can reuse the same integration as long as all resource definitions have unique names.

When you install an integration, Sensu checks your existing resources before creating the new resources.
If Sensu finds an existing resource with the same name, the configuration wizard will prompt you to either:

- Provide a unique name for the new resources.
- Acknowledge that the new resources should overwrite the existing resources.

{{< figure src="/images/rename_overwrite_prompt.gif" alt="Summary page of configuration wizard for a Sensu Catalog integration" link="/images/rename_overwrite_prompt.gif" target="_blank" >}}

## View and manage your integrations

After you install an integration, Sensu creates and publishes the integration resources within your current namespace.
The resources are listed on the configuration page for the resource type (checks, filters, handlers, or mutators).

View and manage integration resources just like all of your other Sensu resources: in the [web UI][9], with [sensuctl][10], or with the Sensu [API][11].

## Reuse integration resources

The integration definitions listed in the [**SENSU RESOURCES** tab][13] are usable, portable definitions for all of the resources you need to use the integration.
These definitions are universal [monitoring as code][15] templates: they do not include a namespace or the specific values you provide while [configuring and installing][14] the integration.

## Use secrets in integrations

The Sensu Catalog integrations are preconfigured to use Sensu's `Env` secrets provider for sensitive information the integrations might require, like passwords and API tokens.

## Contribute an integration

The Sensu Catalog is an open marketplace, and you can contribute by sharing Sensu configurations.


[1]: ../../plugins/plugins/
[2]: ../../observability-pipeline/observe-schedule/checks/
[3]: ../../observability-pipeline/observe-process/handlers/
[4]: ../../plugins/assets/
[5]: ../../operations/manage-secrets/secrets/
[6]: ../../observability-pipeline/observe-process/pipelines/
[7]: ../../commercial/
[8]: ../../operations/maintain-sensu/license/
[9]: ../view-manage-resources/
[10]: ../../sensuctl/create-manage-resources/
[11]: ../../api/
[12]: ../../sensu-plus/
[13]: #get-information-about-an-integration
[14]: #configure-and-install-an-integration
[15]: ../../operations/monitoring-as-code/
[16]: #browse-the-alphabetized-list
[17]: #browse-the-categorized-list
[18]: #browse-a-metadata-based-list
[19]: #search-for-integrations
[20]: ../../plugins/assets/
[21]: ../
