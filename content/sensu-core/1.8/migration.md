---
title: "Migrating to Sensu Go"
description: ""
version: "1.8"
menu: "sensu-core-1.8"
product: "Sensu Core"
---

This guide provides information for migrating your Sensu instance from Sensu 1.x to Sensu Go.
To migrate from Sensu Enterprise, see [Sensu Enterprise migration guide][].

- [Learn about Sensu Go](#learn-about-sensu-go)
- [Install Sensu Go](#install-sensu-go)
	- [1. Install the Sensu Go backend](#1-install-the-sensu-go-backend)
	- [2. Log in to the Sensu web UI](#2-log-in-to-the-sensu-web-ui)
	- [3. Install sensuctl on your workstation](#3-install-sensuctl-on-your-workstation)
	- [4. Set up Sensu users](#4-set-up-sensu-users)
	- [5. Install agents](#5-install-agents)
- [Translate your configuration](#translate-your-configuration)
	- [1. Run the translator](#1-run-the-translator)
	- [2. Update checks](#2-update-checks)
	- [3. Update filters](#3-update-filters)
	- [4. Update handlers](#4-update-handlers)
	- [5. Upload your config to your Sensu Go instance](#5-upload-your-config-to-your-sensu-go-instance)
- [Activate assets](#activate-assets)
- [Sunset your Sensu 1.x instance](#sunset-your-sensu-1x-instance)
- [Resources](#resources)

## Learn about Sensu Go

Sensu Go includes powerful features to make monitoring easier to build, scale, and offer as a self-service tool to your internal customers. 
Read the [blog post][] for more information about the features of Sensu Go.

To set up a local Sensu Go playground, download and start the [Sensu sandbox][] using Vagrant and Virtual box.
Get started with Sensu by running through the [sandbox tutorial][].

## Install Sensu Go

Sensu is now provided as three packages: sensu-go-backend, sensu-go-agent, and sensu-go-cli (sensuctl).
This results in a fundamental change in Sensu terminology from Sensu Core 1.x: the server is now the backend; the client is now the agent.

To install Sensu Go alongside your current Sensu instance, first [upgrade to at least Sensu Core 1.7][].

#### Architecture


#### Supported platforms

Sensu Go is available for RHEL/CentOS 6 and 7, Debian 8-10, Ubunut 14.04-19.04, and Docker.
The Sensu Go agent is also available for Windows Server and Windows 7.
See the list of [supported platforms][] for available architectures.

[Configuration management][] integrations for Sensu Go are available for Puppet and Chef.

#### Deployment recommendations

See the [hardware requirements][hardware] guide for deployment recommendations.

### 1. Install the Sensu Go backend 

If you're doing a side-by-side migration, edit the `agent-port` configuration flag to not conflict with your Sensu 1.x client port.

### 2. Log in to the Sensu web UI

### 3. Install sensuctl on your workstation

### 4. Set up Sensu users

Role-based access control (RBAC) is a built-in feature of the open-source version of Sensu Go.
RBAC allows management and access of users and resources based on namespaces, groups, roles, and bindings.
To learn more about setting up RBAC in Sensu Go, see the [RBAC reference][13] and the [guide to creating a read-only user][14].

In addition to built-in RBAC, Sensu includes [license-activated][] support for authentication using Microsoft Active Directory and standards-compliant Lightweight Directory Access Protocol tools like OpenLDAP.

### 5. Install agents

“Clients” are now represented within Sensu Go as abstract “entities” that can describe a wider range of system components (network gear, web server, cloud resource, etc.)
Entities include “agent entities” (entities running a Sensu agent) and familiar “proxy entities”.
See the [entity reference][6] and the guide to [monitoring external resources][7] for more information.

Make sure include the localhost subscription by uncommenting the subscription section and ensuring `localhost` is in the list of subscriptions:

```
##
# agent configuration
##
...
subscriptions:
 - "localhost"
...

```

Now you should have Sensu installed and functional. The next step is to translate your Sensu 1.x configs to Sensu Go.

## Translate your configuration

As of version 1.6.2, Sensu 1.x includes the Sensu Translator: a command-line tool to help you transfer your Sensu Core 1.x configuration to Sensu Go.
The [Sensu translator project][18] is open source on GitHub.

### 1. Run the translator

Point the translator at your Sensu 1.x configuration and specify an output directory:

{{< highlight shell >}}
sensu-translator -d /etc/sensu/conf.d -o /tmp/sensu_config_translated
{{< /highlight >}}

<!-- Add line about directory structure for 1.x config -->

### 2. Update checks

After running the translator, you'll need to adjust some of output manually, starting with your check definitions.

There are also a few changes to check definitions to be aware of. The `stdin` check attribute is no longer supported in Sensu Go, and Sensu Go no longer tries to run a "default" handler when executing a check without a specified handler. Additionally, check subdues are not yet available in Sensu Go.

Standalone checks are no longer supported in Sensu Go, although [similar functionality can be achieved using role-based access control, assets, and entity subscriptions][26].

#### Token substitution

Update the syntax for token substitution from triple colons to using curly braces.

#### Metric checks

The Sensu 1.x `type: metric` attribute is no longer part of the Sensu Go check spec, so we’ll need to adjust it by hand. Sensu 1.x checks can be configured as `type: metric` which told Sensu to always handle the check regardless of the check status output. This allowed Sensu 1.x to process output metrics via a handler even when the check status was not in an alerting state. Sensu Go treats output metrics as first-class objects, allowing you to process check status as well as output metrics via different event pipelines.See the [guide to metric output][] to update your metric checks with the `output_metric_handlers` and `output_metric_format` attributes.

#### Proxy checks

The attribute for configuring proxy checks has changed in Sensu Go.
See the [guide to monitoring external resources][] to learn about the `proxy_entity_name` and `proxy_requests` attributes and update your proxy check configuration.

#### Hooks

[Check hooks][8] are now a resource type in Sensu Go, meaning that hooks can be created, managed, and reused independently of check definitions.
You can also execute multiple hooks for any given response code.

#### Check aggregates

Check aggregates are supported through the [license-activated][27] [Sensu Go Aggregate Check Plugin][28].

#### Custom attributes

Custom check attributes are no longer supported in Sensu Go.
Instead, Sensu Go provides the ability to add custom labels and annotations to entities, checks, assets, hooks, filters, mutators, handlers, and silences.
See the metadata attributes section in the reference documentation for more information about using labels and annotations (for example: [metadata attributes for entities][24]).
The translator stores all check extended attributes in the check metadata annotation named `sensu.io.json_attributes`. 

#### Check plugins

Within the Sensu Plugins org, see individual plugin READMEs for compatibility status with Sensu Go.
If your plugin isn't compatible with Sensu Go yet, see [the guide][] to updating plugins to use the Sensu Go event model.

If you're doing a side-by-side migration, Sensu-Go-compatible plugins installed outside of opt/sensu will work with Sensu Go agents.
Otherwise, you can re-install your check plugins onto your Sensu agent nodes; see the [guide][] to installing the `sensu-install` tool for use with Sensu Go.

Although not required to run Sensu Go, we recommend installing plugins with [assets][] where possible.

### 3. Update filters

All check results are now considered events and are processed by event handlers.
You can use the built-in [incidents filter][9] to recreate the Sensu Core 1.x behavior in which only check results with a non-zero status are considered events.

Ruby eval logic has been replaced with JavaScript expressions in Sensu Go, opening up powerful possibilities to filter events based on occurrences and other event attributes.
As a result, the built-in occurrences filter in Sensu Core 1.x is not provided in Sensu Go, but you can replicate its functionality using [this filter definition][10].

### 4. Update handlers

Sensu Go includes three new [built-in filters][11]: only-incidents, only-metrics, and allow-silencing.
Sensu Go does not yet include a built-in check dependencies filter or a filter-when feature.
Silencing is now disabled by default in Sensu Go and must be enabled explicitly using the built-in [`not_silenced` filter][15].

Transport handlers are no longer supported by Sensu Go, but you can create similar functionality using a pipe handler that connects to a message bus and injects event data into a queue.

### 5. Upload your config to your Sensu Go instance

To upload your Sensu Go config:

{{< highlight shell >}}
sensuctl create --file /path/to/configs.yaml
{{< /highlight >}}

_PRO TIP: `sensuctl create` (and `sensuctl delete`) are powerful tools to help you manange your Sensu configs across namespaces. See the [sensuctl reference][] for more information._

## Activate assets

[Assets][12] are shareable, reusable packages that make it easy to deploy Sensu plugins.

Although not required to run Sensu Go, we recommend uses assets to install plugins where possible.
For plugins that aren't available as assets, install outside of opt/sensu.

[Sensu Plugins][21] in Ruby can still be installed via sensu-install by installing [sensu-plugins-ruby][20]; see the [installing plugins guide][22] for more information.

To contribute to converting a plugin to an asset, see [Jef's doc](https://discourse.sensu.io/t/contributing-assets-for-existing-ruby-sensu-plugins/1165).

## Sunset your Sensu 1.x instance

When you're ready to sunset your Sensu 1.x instance, see the [platform][] docs to stop the Sensu services.

## Resources

See the [backend][3], [agent][4], and [sensuctl][5] reference docs for more information. 
To learn more about new terminology in Sensu Go, see the [glossary][1].

- [Sensu translator project][18]
- [Jef Spaleta - Check configuration upgrades with the Sensu Go sandbox][25]
- [Sensu webinar: What's new in Sensu Go][28]
- [Get started with the Sensu API][]

[1]: ../../getting-started/glossary
[2]: https://github.com/etcd-io/etcd/tree/master/Documentation
[3]: ../../reference/backend
[4]: ../../reference/agent
[5]: ../../sensuctl/reference
[6]: ../../reference/entities
[7]: ../../guides/monitor-external-resources
[8]: ../../reference/hooks
[9]: ../../reference/filters#built-in-filter-only-incidents
[10]: ../../reference/filters/#handling-repeated-events
[11]: ../../reference/filters/#built-in-filters
[12]: ../../reference/assets
[13]: ../../reference/rbac
[14]: ../../guides/create-read-only-user
[15]: ../../reference/filters/#built-in-filter-allow-silencing
[16]: ../../reference/tokens
[17]: ../../api/overview
[18]: https://github.com/sensu/sensu-translator
[19]: /sensu-core/1.6/
[20]: https://packagecloud.io/sensu/community
[21]: https://github.com/sensu-plugins
[22]: ../plugins
[23]: ../../installation/install-sensu
[24]: ../../reference/entities#metadata-attributes
[25]: https://blog.sensu.io/check-configuration-upgrades-with-the-sensu-go-sandbox
[26]: https://blog.sensu.io/self-service-monitoring-checks-in-sensu-go
[27]: ../../getting-started/enterprise
[28]: https://bonsai.sensu.io/assets/sensu/sensu-aggregate-check
[27]: ../../reference/backend#operation
[28]: https://sensu.io/resources/webinar/whats-new-sensu-go
