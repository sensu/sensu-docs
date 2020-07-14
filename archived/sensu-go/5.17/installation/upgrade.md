---
title: "Upgrade Sensu"
linkTitle: "Upgrade Sensu"
description: "Upgrade to the latest version of Sensu. Read this upgrade guide to learn about the latest features and bug fixes in Sensu Go and upgrade to Sensu Go from Sensu Core 1.x."
weight: 30
version: "5.17"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.17:
    parent: installation
---

- [Upgrade to the latest version of Sensu Go from 5.0.0 or later](#upgrade-to-the-latest-version-of-sensu-go-from-5-0-0-or-later)
- [Upgrade to Sensu Go 5.16.0 from any earlier version](#upgrade-to-sensu-go-5-16-0-from-any-earlier-version)
- [Upgrade Sensu clusters from 5.7.0 or earlier to 5.8.0 or later](#upgrade-sensu-clusters-from-5-7-0-or-earlier-to-5-8-0-or-later)
- [Upgrade Sensu backend binaries to 5.1.0](#upgrade-sensu-backend-binaries-to-5-1-0)
- [Migrate to Sensu Go from Sensu Core 1.x](#migrate-to-sensu-go-from-sensu-core-1-x)

## Upgrade to the latest version of Sensu Go from 5.0.0 or later

To upgrade to the latest version of Sensu Go from version 5.0.0 or later, [install the latest packages][23].

Then, restart the services.

_**NOTE**: For systems that use `systemd`, run `sudo systemctl daemon-reload` before restarting the services._

{{< highlight shell >}}
# Restart the Sensu agent
sudo service sensu-agent restart

# Restart the Sensu backend
sudo service sensu-backend restart
{{< /highlight >}}

Use the `version` command to determine the installed version using the `sensu-agent`, `sensu-backend`, and `sensuctl` tools.
For example, `sensu-backend version`.

## Upgrade to Sensu Go 5.16.0 from any earlier version

As of Sensu Go 5.16.0, Sensu's free entity limit is 100 entities.
All [commercial features][27] are available for free in the packaged Sensu Go distribution up to an entity limit of 100.

When you upgrade to 5.16.0, if your existing unlicensed instance has more than 100 entities, Sensu will continue to monitor those entities.
However, if you try to create any new entities via the HTTP API or sensuctl, you will see the following message:

`This functionality requires a valid Sensu Go license with a sufficient entity limit. To get a valid license file, arrange a trial, or increase your entity limit, contact Sales.`

Connections from new agents will fail and result in a log message like this:

{{< highlight shell >}}
{"component":"agent","error":"handshake failed with status 402","level":"error","msg":"reconnection attempt failed","time":"2019-11-20T05:49:24-07:00"}
{{< /highlight >}}

In the web UI, you will see the following message when you reach the 100-entity limit:

![Sensu web UI warning when the entity limit is reached][30]

If your Sensu instance includes more than 100 entities, [contact Sales][31] to learn how to upgrade your installation and increase your limit.
See [our blog announcement][32] for more information about our usage policy.

## Upgrade Sensu clusters from 5.7.0 or earlier to 5.8.0 or later

_**NOTE**: This section applies only to Sensu clusters with multiple backend nodes._

Due to updates to etcd serialization, you must shut down Sensu clusters with multiple backend nodes while upgrading from Sensu Go 5.7.0 or earlier to 5.8.0 or later.
See the [backend reference][29] for more information about stopping and starting backends.

## Upgrade Sensu backend binaries to 5.1.0

_**NOTE**: This section applies only to Sensu backend binaries downloaded from `s3-us-west-2.amazonaws.com/sensu.io/sensu-go`, not to Sensu RPM or DEB packages._

For Sensu backend binaries, the default `state-dir` in 5.1.0 is now `/var/lib/sensu/sensu-backend` instead of `/var/lib/sensu`.
To upgrade your Sensu backend binary to 5.1.0, first [download the latest version][23].
Then, make sure the `/etc/sensu/backend.yml` configuration file specifies a `state-dir`.
To continue using `/var/lib/sensu` as the `state-dir`, add the following configuration to `/etc/sensu/backend.yml`.

{{< highlight yml >}}
# /etc/sensu/backend.yml configuration to store backend data at /var/lib/sensu
state-dir: "/var/lib/sensu"
{{< /highlight >}}

Then restart the backend.

## Migrate to Sensu Go from Sensu Core 1.x

This guide includes general information for migrating your Sensu instance from Sensu Core 1.x to Sensu Go 5.0.
For instructions and tools to help you translate your Sensu configuration from Sensu Core 1.x to Sensu Go, see the [Sensu translator project][18] and our [blog post about check configuration upgrades with the Sensu Go sandbox][25].

Sensu Go includes important changes to all parts of Sensu: architecture, installation, resource definitions, the event data model, check dependencies, filter evaluation, and more.
Sensu Go also includes many powerful features to make monitoring easier to build, scale, and offer as a self-service tool to your internal customers.

- [Packaging](#packaging)
- [Architecture](#architecture)
- [Entities](#entities)
- [Checks](#checks)
- [Events](#events)
- [Handlers](#handlers)
- [Filters](#filters)
- [Assets](#assets)
- [Role-based access control (RBAC)](#role-based-access-control-rbac)
- [Silencing](#silencing)
- [Token substitution](#token-substitution)
- [Aggregates](#aggregates)
- [API](#api)
- [Custom attributes](#custom-attributes)

### Packaging
Sensu is now provided as three packages: sensu-go-backend, sensu-go-agent, and sensu-go-cli (sensuctl).
This is a fundamental change in Sensu terminology from Sensu Core 1.x: the server is now the backend and the client is now the agent.
To learn more about new terminology in Sensu Go, see the [glossary][1].

### Architecture
The external RabbitMQ transport and Redis datastore in Sensu Core 1.x are replaced with an embedded transport and [etcd datastore][2] in Sensu Go.
In Sensu Go, the Sensu backend and agent are configured with YAML files or the `sensu-backend` or `sensu-agent` command line tools rather than JSON files.
Sensu checks and pipeline elements are configured via the API or sensuctl tool in Sensu Go instead of JSON files.
See the [backend][3], [agent][4], and [sensuctl][5] reference docs for more information. 

### Entities
“Clients” are represented within Sensu Go as abstract “entities” that can describe a wider range of system components (for example, network gear, a web server, or a cloud resource).
Entities include **agent entities**, which are entities running a Sensu agent, and the familiar **proxy entities**.
See the [entity reference][6] and the guide to [monitoring external resources][7] for more information.

### Checks
Standalone checks are not supported in Sensu Go, although [you can achieve similar functionality with role-based access control (RBAC), assets, and entity subscriptions][26].
There are also a few changes to check definitions in Sensu Go.
The `stdin` check attribute is not supported in Sensu Go, and Sensu Go does not try to run a "default" handler when executing a check without a specified handler.
In addition, check subdues are not available in Sensu Go.

[Check hooks][8] are a resource type in Sensu Go: you can create, manage, and reuse hooks independently of check definitions.
You can also execute multiple hooks for any given response code.

### Events
In Sensu Go, all check results are considered events and are processed by event handlers.
You can use the built-in [incidents filter][9] to recreate the Sensu Core 1.x behavior in which only check results with a non-zero status are considered events.

### Handlers
Transport handlers are not supported by Sensu Go, but you can create similar functionality with a pipe handler that connects to a message bus and injects event data into a queue.

### Filters
Ruby eval logic from Sensu Core 1.x is replaced with JavaScript expressions in Sensu Go, opening up powerful ways to filter events based on occurrences and other event attributes.
As a result, the built-in occurrences event filter in Sensu Core 1.x is not included in Sensu Go, but you can replicate its functionality with [the repeated events filter definition][10].

Sensu Go includes three new built-in [event filters][9]: only-incidents, only-metrics, and allow-silencing.
Sensu Go does not include a built-in check dependencies filter or a filter-when feature.

### Assets
The `sensu-install` tool in Sensu Core 1.x is replaced by [assets][12] in Sensu Go.
Assets are shareable, reusable packages that make it easier to deploy Sensu plugins.

You can still install [Sensu Community plugins][21] in Ruby via `sensu-install` by installing [sensu-plugins-ruby][20].
See the [installing plugins guide][22] for more information.

### Role-based access control (RBAC)
Role-based access control (RBAC) is a built-in feature of the open-source version of Sensu Go.
RBAC allows you to manage and access users and resources based on namespaces, groups, roles, and bindings.
To set up RBAC in Sensu Go, see the [RBAC reference][13] and [Create a read-only user][14].

### Silencing
Silencing is disabled by default in Sensu Go.
You must explicitly enable silencing with the built-in `not_silenced` [event filter][9].

### Token substitution
The syntax for token substitution changed to [double curly braces][16] in Sensu Go (from triple colons in Sensu Core 1.x).

### Aggregates
Check aggregates are supported through the [Sensu Go Aggregate Check Plugin][28] (a [commercial][27] resource).

### API
In addition to the changes to resource definitions, Sensu Go includes a new, versioned API. See the [API overview][17] for more information.

### Custom attributes
Custom check attributes are not supported in Sensu Go.
Instead, Sensu Go allows you to add custom labels and annotations to entities, checks, assets, hooks, filters, mutators, handlers, and silences.
See the metadata attributes section in the reference documentation for more information about using labels and annotations (for example, [metadata attributes for entities][24]).

[1]: ../../learn/glossary/
[2]: https://github.com/etcd-io/etcd/tree/master/Documentation/
[3]: ../../reference/backend/
[4]: ../../reference/agent/
[5]: ../../sensuctl/reference/
[6]: ../../reference/entities/
[7]: ../../guides/monitor-external-resources/
[8]: ../../reference/hooks/
[9]: ../../reference/filters
[10]: ../../reference/filters/#handle-repeated-events
[12]: ../../reference/assets/
[13]: ../../reference/rbac/
[14]: ../../guides/create-read-only-user/
[16]: ../../reference/tokens
[17]: ../../api/overview/
[18]: https://github.com/sensu/sensu-translator/
[20]: https://packagecloud.io/sensu/community/
[21]: https://github.com/sensu-plugins/
[22]: ../plugins/
[23]: ../../installation/install-sensu/
[24]: ../../reference/entities#metadata-attributes
[25]: https://blog.sensu.io/check-configuration-upgrades-with-the-sensu-go-sandbox/
[26]: https://blog.sensu.io/self-service-monitoring-checks-in-sensu-go/
[27]: ../../commercial/
[28]: https://bonsai.sensu.io/assets/sensu/sensu-aggregate-check/
[29]: ../../reference/backend#operation
[30]: /images/web-ui-entity-warning.png
[31]: https://sensu.io/contact?subject=contact-sales/
[32]: https://blog.sensu.io/one-year-of-sensu-go
