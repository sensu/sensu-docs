---
title: "Upgrading Sensu"
linkTitle: "Upgrade Sensu"
description: "Upgrade to the latest version of Sensu. Read the upgrade guide to get the latest features and bug fixes in Sensu Go and learn about upgrading to Sensu Go from Sensu Core 1.x."
weight: 3
version: "5.1"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.1:
    parent: installation
---

- [Upgrading from 5.0.0 or later](#upgrading-to-the-latest-version-of-sensu-go-from-5-0-0-or-later)
- [Upgrading Sensu backend binaries to 5.1.0](#upgrading-sensu-backend-binaries-to-5-1-0)
- [Upgrading from 1.x or later](#upgrading-to-sensu-go-from-sensu-core-1-x)

## Upgrading to the latest version of Sensu Go from 5.0.0 or later

To upgrade to the latest version of Sensu Go from version 5.0.0 or later, first [install the latest packages][23].

Then restart the services.

_NOTE: For systems using `systemd`, run `sudo systemctl daemon-reload` before restarting the services._

{{< highlight shell >}}
# Restart the Sensu agent
sudo service sensu-agent restart

# Restart the Sensu backend
sudo service sensu-backend restart
{{< /highlight >}}

You can use the `version` command to determine the installed version using the `sensu-agent`, `sensu-backend`, and `sensuctl` tools. For example: `sensu-backend version`.

## Upgrading Sensu backend binaries to 5.1.0

_NOTE: This applies only to Sensu backend binaries downloaded from `s3-us-west-2.amazonaws.com/sensu.io/sensu-go`, not to Sensu RPM or DEB packages._

For Sensu backend binaries, the default `state-dir` in 5.1.0 is now `/var/lib/sensu/sensu-backend` instead of `/var/lib/sensu`.
To upgrade your Sensu backend binary to 5.1.0, first [download the latest version][23], then make sure the `/etc/sensu/backend.yml` configuration file specifies a `state-dir`.
To continue using `/var/lib/sensu` as the `state-dir`, add the following configuration to `/etc/sensu/backend.yml`.

{{< highlight yml >}}
# /etc/sensu/backend.yml configuration to store backend data at /var/lib/sensu
state-dir: "/var/lib/sensu"
{{< /highlight >}}

Then restart the backend.

## Upgrading to Sensu Go from Sensu Core 1.x

This guide provides general information for upgrading your Sensu instance from [Sensu Core 1.x][19] to Sensu Go 5.0.
For instructions and tools to help you translate your Sensu configuration from Sensu Core 1.x to Sensu Go, see the following resources.

- [Sensu translator project][18]
- [Jef Spaleta - Check configuration upgrades with the Sensu Go sandbox][25]

Sensu Go includes important changes to all parts of Sensu: architecture, installation, resource definitions, event data model, check dependencies, filter evaluation, and more.
Sensu Go also includes a lot of powerful features to make monitoring easier to build, scale, and offer as a self-service tool to your internal customers.

- [Packaging](#packaging)
- [Architecture](#architecture)
- [Entities](#entities)
- [Checks](#checks)
- [Events](#events)
- [Handlers](#handlers)
- [Filters](#filters)
- [Assets](#assets)
- [Role-based access control](#role-based-access-control)
- [Silencing](#silencing)
- [Token substitution](#token-substitution)
- [Aggregates](#aggregates)
- [API](#api)
- [Custom attributes](#custom-attributes)

### Packaging
Sensu is now provided as three packages: sensu-go-backend, sensu-go-agent, and sensu-go-cli (sensuctl).
This results in a fundamental change in Sensu terminology from Sensu Core 1.x: the server is now the backend; the client is now the agent.
To learn more about new terminology in Sensu Go, see the [glossary][1].

### Architecture
The external RabbitMQ transport and Redis datastore in Sensu Core 1.x have been replaced with an embedded transport and [etcd datastore][2] in Sensu Go.
The Sensu backend and agent are configured using YAML files or using the `sensu-backend` or `sensu-agent` command-line tools, instead of using JSON files.
Sensu checks and pipeline elements are now configured via the API or sensuctl tool instead of JSON files.
See the [backend][3], [agent][4], and [sensuctl][5] reference docs for more information. 

### Entities
“Clients” are now represented within Sensu Go as abstract “entities” that can describe a wider range of system components (network gear, web server, cloud resource, etc.)
Entities include “agent entities” (entities running a Sensu agent) and familiar “proxy entities”.
See the [entity reference][6] and the guide to [monitoring external resources][7] for more information.

### Checks
Standalone checks are no longer supported in Sensu Go, although [similar functionality can be achieved using role-based access control, assets, and entity subscriptions][26].
There are also a few changes to check definitions to be aware of. The `stdin` check attribute is no longer supported in Sensu Go, and Sensu Go no longer tries to run a "default" handler when executing a check without a specified handler. Additionally, round-robin subscriptions and check subdues are not yet available in Sensu Go.

[Check hooks][8] are now a resource type in Sensu Go, meaning that hooks can be created, managed, and reused independently of check definitions.
You can also execute multiple hooks for any given response code.

### Events
All check results are now considered events and are processed by event handlers.
You can use the built-in [incidents filter][9] to recreate the Sensu Core 1.x behavior in which only check results with a non-zero status are considered events.

### Handlers
Transport handlers are no longer supported by Sensu Go, but you can create similar functionality using a pipe handler that connects to a message bus and injects event data into a queue.

### Filters
Ruby eval logic has been replaced with JavaScript expressions in Sensu Go, opening up powerful possibilities to filter events based on occurrences and other event attributes.
As a result, the built-in occurrences filter in Sensu Core 1.x is not provided in Sensu Go, but you can replicate its functionality using [this filter definition][10].
Sensu Go includes three [new built-in filters][11]: only-incidents, only-metrics, and allow-silencing.
Sensu Go does not yet include a built-in check dependencies filter or a filter-when feature.

### Assets
The sensu-install tool has been replaced in Sensu Go by [assets][12], shareable, reusable packages that make it easy to deploy Sensu plugins.
[Sensu Plugins][21] in Ruby can still be installed via sensu-install by installing [sensu-plugins-ruby][20]; see the [installing plugins guide][22] for more information.

### Role-based access control
Role-based access control (RBAC) is a built-in feature of the open-source version of Sensu Go.
RBAC allows management and access of users and resources based on namespaces, groups, roles, and bindings.
To learn more about setting up RBAC in Sensu Go, see the [RBAC reference][13] and the [guide to creating a read-only user][14].

### Silencing
Silencing is now disabled by default in Sensu Go and must be enabled explicitly using the built-in [`not_silenced` filter][15].

### Token substitution
The syntax for using token substitution has changed from using triple colons to using [double curly braces][16].

### Aggregates
Sensu Go does not yet support check aggregates.

### API
In addition to the changes to resource definitions, Sensu Go includes a new, versioned API. See the [API overview][17] for more information.

### Custom attributes
Custom check attributes are no longer supported in Sensu Go.
Instead, Sensu Go provides the ability to add custom labels and annotations to entities, checks, assets, hooks, filters, mutators, handlers, and silencing entries.
See the metadata attributes section in the reference documentation for more information about using labels and annotations (for example: [metadata attributes for entities][24]).

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
