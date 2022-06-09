---
title: "Migrate from Sensu Core to Sensu Go"
linkTitle: "Migrate from Sensu Core"
description: "Sensu Go includes important changes to all parts of Sensu as well as many powerful commercial features to make monitoring easier to build, scale to Sensu Go from Sensu Core 1.x. Follow this guide to migrate from Sensu Core to Sensu Go."
weight: 20
version: "5.19"
product: "Sensu Go"
menu:
  sensu-go-5.19:
    parent: maintain-sensu
---

This guide includes general information for migrating your Sensu instance from Sensu Core 1.x to Sensu Go.
For instructions and tools to help you translate your Sensu configuration from Sensu Core 1.x to Sensu Go, see the [Sensu Translator project][18] and our [blog post about check configuration upgrades with the Sensu Go sandbox][25].

Sensu Go includes important changes to all parts of Sensu: architecture, installation, resource definitions, the event data model, check dependencies, filter evaluation, and more.
Sensu Go also includes many powerful [commercial features][27] to make monitoring easier to build, scale, and offer as a self-service tool to your internal customers.

Sensu Go is available for [RHEL/CentOS, Debian, Ubuntu, and Docker][43].
The Sensu Go agent is also available for Windows.
[Configuration management][44] integrations for Sensu Go are available for Ansible, Chef, and Puppet.

{{% notice important %}}
**IMPORTANT**: To install Sensu Go alongside your current Sensu instance, you must upgrade to at least [Sensu Core 1.7.0](https://eol-repositories.sensuapp.org/).
{{% /notice %}}

Aside from this migration guide, these resources can help you migrate from Sensu Core to Sensu Go:

- [**Sensu Community Slack**][46]: Join hundreds of other Sensu users in our Community Slack, where you can ask questions and benefit from tips others picked up during their own Sensu Go migrations.
- [**Sensu Community Forum**][47]: Drop a question in our dedicated category for migrating to Go.
- [**Sensu Go Sandbox**][48]: Download the sandbox and try out some monitoring workflows with Sensu Go.
- [**Sensu Translator**][45]: Use this command-line tool to generate Sensu Go configurations from your Sensu Core config files.

We also offer [**commercial support** and **professional services** packages][49] to help with your Sensu Go migration.

## Packaging

Sensu Go is provided as three packages: sensu-go-backend, sensu-go-agent, and sensu-go-cli (sensuctl). This is a fundamental change in Sensu terminology from Sensu Core: the server is now the backend.

Clients are represented within Sensu Go as abstract entities that can describe a wider range of system components such as network gear, a web server, or a cloud resource.
Entities include agent entities that run a Sensu agent and the familiar proxy entities.

The [glossary][1] includes more information about new terminology in Sensu Go.

## Architecture

The external RabbitMQ transport and Redis datastore in Sensu Core 1.x are replaced with an embedded transport and [etcd datastore][2] in Sensu Go.

{{< figure src="/images/go/deployment_architecture/single_backend_standalone_architecture.png" alt="Single Sensu Go backend or standalone architecture" link="/images/go/deployment_architecture/single_backend_standalone_architecture.png" target="_blank" >}}
<!-- Diagram source: https://www.lucidchart.com/documents/edit/d239f2db-15db-41c4-a191-b9b46990d156/0 -->

*<p style="text-align:center">Single Sensu Go backend or standalone architecture</p>*

In Sensu Go, the Sensu backend and agent are configured with YAML files or the `sensu-backend` or `sensu-agent` command line tools rather than JSON files.
Sensu checks and pipeline elements are configured via the API or sensuctl tool in Sensu Go instead of JSON files.

The [**Sensu backend**][3] is powered by an embedded transport and [etcd][36] datastore and gives you flexible, automated workflows to route metrics and alerts.
Sensu backends require persistent storage for their embedded database, disk space for local asset caching, and several exposed ports:

- 2379 (gRPC) Sensu storage client: Required for Sensu backends using an external etcd instance
- 2380 (gRPC) Sensu storage peer: Required for other Sensu backends in a [cluster][37]
- 3000 (HTTP/HTTPS) [Sensu web UI][29]: Required for all Sensu backends using a Sensu web UI
- 8080 (HTTP/HTTPS) [Sensu API][40]: Required for all users accessing the Sensu API
- 8081 (WS/WSS) Agent API: Required for all Sensu agents connecting to a Sensu backend

[**Sensu agents**][4] are lightweight clients that run on the infrastructure components you want to monitor.
Agents automatically register with Sensu as entities and are responsible for creating check and metric events to send to the backend event pipeline.

The Sensu agent uses:

- 3030 (TCP/UDP) Sensu agent socket: Required for Sensu agents using the agent socket
- 3031 (HTTP) Sensu [agent API][41]: Required for all users accessing the agent API
- 8125 (UDP) [StatsD listener][42]: Required for all Sensu agents using the StatsD listener

The agent TCP and UDP sockets are deprecated in favor of the [agent API][41].

Agents that use Sensu [assets][12] require some disk space for a local cache.

See the [backend][3], [agent][4], and [sensuctl][5] reference docs for more information.

## Entities

“Clients” are represented within Sensu Go as abstract “entities” that can describe a wider range of system components (for example, network gear, a web server, or a cloud resource).
Entities include **agent entities**, which are entities running a Sensu agent, and the familiar **proxy entities**.
See the [entity reference][6] and the guide to [monitoring external resources][7] for more information.

## Checks

Standalone checks are not supported in Sensu Go, although [you can achieve similar functionality with role-based access control (RBAC), assets, and entity subscriptions][26].
There are also a few changes to check definitions in Sensu Go.
The `stdin` check attribute is not supported in Sensu Go, and Sensu Go does not try to run a "default" handler when executing a check without a specified handler.
In addition, check subdues are not available in Sensu Go.

[Check hooks][8] are a resource type in Sensu Go: you can create, manage, and reuse hooks independently of check definitions.
You can also execute multiple hooks for any given response code.

## Events

In Sensu Go, all check results are considered events and are processed by event handlers.
You can use the built-in [incidents filter][9] to recreate the Sensu Core 1.x behavior in which only check results with a non-zero status are considered events.

## Handlers

Transport handlers are not supported by Sensu Go, but you can create similar functionality with a pipe handler that connects to a message bus and injects event data into a queue.

## Filters

Sensu Go includes three new built-in [event filters][9]: only-incidents, only-metrics, and allow-silencing.
Sensu Go does not include a built-in check dependencies filter or a filter-when feature.

Ruby eval logic from Sensu Core 1.x is replaced with JavaScript expressions in Sensu Go, opening up powerful ways to filter events based on occurrences and other event attributes.
As a result, **Sensu Go does not include the built-in occurrence-based event filter in Sensu Core 1.x**, which allowed you to control the number of duplicate events that reached the handler.
You can replicate the occurrence-based filter's functionality with Sensu Go's [repeated events filter definition][10].

### Fatigue check filter

For Sensu Go users, we recommend the [fatigue check filter][11], a JavaScript implementation of the `occurrences` filter from Sensu 1.x.
This filter looks for [check and entity annotations][33] in each event it receives and uses the values of those annotations to configure the filter's behavior on a per-event basis.

The [Sensu Translator version 1.1.0][18] retrieves occurrence and refresh values from a Sensu Core 1.x check definition and outputs them as annotations in a Sensu Go check definition, compatible with the fatigue check filter.

However, the Sensu Translator doesn't automatically add the fatigue check filter asset or the filter configuration you need to run it.
To use the fatigue check filter asset, you must [register it][15], create a correctly configured [event filter definition][19], and [add the event filter][34] to the list of filters on applicable handlers.

## Assets

The `sensu-install` tool in Sensu Core 1.x is replaced by [assets][12] in Sensu Go.
Assets are shareable, reusable packages that make it easier to deploy Sensu plugins.

You can still install [Sensu Community plugins][21] in Ruby via `sensu-install` by installing [sensu-plugins-ruby][20].
See the [installing plugins guide][51] for more information.

## Role-based access control (RBAC)

Role-based access control (RBAC) is a built-in feature of the open-source version of Sensu Go.
RBAC allows you to manage and access users and resources based on namespaces, groups, roles, and bindings.
To set up RBAC in Sensu Go, see the [RBAC reference][13] and [Create a read-only user][14].

## Silencing

Silencing is disabled by default in Sensu Go.
You must explicitly enable silencing with the built-in `not_silenced` [event filter][9].

## Token substitution

The syntax for token substitution changed to [double curly braces][16] in Sensu Go (from triple colons in Sensu Core 1.x).

## Aggregates

Check aggregates are supported through the [Sensu Go Aggregate Check Plugin][28] (a [commercial][27] resource).

## API

In addition to the changes to resource definitions, Sensu Go includes a new, versioned API. See the [API overview][17] for more information.

## Step-by-step migration instructions

### Step 1: Install Sensu Go

#### 1. Install the Sensu Go backend 

The Sensu backend is available for Ubuntu/Debian, RHEL/CentOS, and Docker.
See the [installation guide][52] to install, configure, and start the Sensu backend according to your [deployment strategy][38].

#### 2. Log in to the Sensu web UI

The [Sensu Go web UI][39] provides a unified view of your monitoring events with user-friendly tools to reduce alert fatigue and manage your Sensu instance.
After starting the Sensu backend, open the web UI by visiting http://localhost:3000.
You may need to replace `localhost` with the hostname or IP address where the Sensu backend is running.

To log in, enter your Sensu user credentials, or use Sensu's default admin credentials (username: `admin` and password: `P@ssw0rd!`).

#### 3. Install sensuctl on your workstation

Sensuctl is a command line tool for managing resources within Sensu.
It works by calling Sensu’s HTTP API to create, read, update, and delete resources, events, and entities.
Sensuctl is available for Linux, Windows, and macOS.
See the [installation guide][53] to install and configure sensuctl.

#### 4. Set up Sensu users

Role-based access control (RBAC) is a built-in feature of the open-source version of Sensu Go.
RBAC allows you to manage and access users and resources based on namespaces, groups, roles, and bindings.
To set up RBAC in Sensu Go, see the [RBAC reference][13] and [Create a read-only user][14].

In Sensu Go, namespaces partition resources within a Sensu instance.
Sensu Go entities, checks, handlers, and other [namespaced resources][54] belong to a single namespace.
The Sensu translator places all translated resources into the `default` namespace &mdash; we'll use the translater in a moment.

In addition to built-in RBAC, Sensu Go's [commercial features][27] include support for authentication using Microsoft Active Directory (AD) and standards-compliant Lightweight Directory Access Protocol tools like OpenLDAP.

#### 5. Install agents

The Sensu agent is available for Ubuntu/Debian, RHEL/CentOS, Windows, and Docker.
See the [installation guide][55] to install, configure, and start Sensu agents.

If you're doing a side-by-side migration, add `api-port` (default: `3031`) and `socket-port` (default: `3030`) to your [agent configuration][56].
This prevents the Sensu Go agent API and socket from conflicting with the Sensu Core client API and socket.
You can also disable these features in the agent configuration using the `disable-socket` and `disable-api` flags.

{{< code yml >}}
# agent configuration: /etc/sensu.agent.yml
...
api-port: 4041
socket-port: 4030
...
{{< /code >}}

Sensu should now be installed and functional. The next step is to translate your Sensu Core configuration to Sensu Go.

### Step 2: Translate your configuration

Use t [Sensu Translator][18] command line tool to transfer your Sensu Core checks, handlers, and mutators to Sensu Go.

#### 1. Run the translator

Install and run the translator.

{{< code shell >}}
# Install dependencies
yum install -q -y rubygems ruby-devel

# Install sensu-translator
gem install sensu-translator

# Translate all config in /etc/sensu/conf.d to Sensu Go and output to /sensu_config_translated
# Option: translate your config in sections according to resource type
sensu-translator -d /etc/sensu/conf.d -o /sensu_config_translated
{{< /code >}}

If translation is successful, you should see a few callouts followed by `DONE!`.

{{< code shell >}}
Sensu 1.x filter translation is not yet supported
Unable to translate Sensu 1.x filter: only_production {:attributes=>{:check=>{:environment=>"production"}}}
DONE!
{{< /code >}}

Combine your config into a sensuctl-readable format.

_**NOTE**: for use with `sensuctl create`, do _not_ use a comma between resource objects in Sensu Go resource definitions in JSON format._

{{< code shell >}}
find sensu_config_translated/ -name '*.json' -exec cat {} \; > sensu_config_translated_singlefile.json
{{< /code >}}

Most attributes are ready to use as-is, but you'll need to adjust your Sensu Go configuration manually to migrate some of Sensu's features.

_NOTE: To streamline a comparison of your Sensu Core configuration with your Sensu Go configuration, output your current Sensu Core configuration using the API: `curl -s http://127.0.0.1:4567/settings | jq . > sensu_config_original.json`_

#### 2. Translate checks

Review your Sensu Core check configuration for the following attributes, and make the corresponding updates to your Sensu Go configuration.

| Core attribute | Manual updates required in Sensu Go config |
| -------------- | ------------- |
`::: foo :::` | Update the syntax for token substitution from triple colons to double curly braces. For example: `{{ foo }}`
`stdin: true`  | No updates required. Sensu Go checks accept data on stdin by default.
`handlers: default` | Sensu Go does not have a default handler. Create a handler named `default` to continue using this pattern.
`subdues` | Check subdues are not available in Sensu Go.
`standalone: true` | Standalone checks are not supported in Sensu Go, although you can achieve similar functionality using [role-based access control, assets, and entity subscriptions][26]. The translator assigns all Core standalone checks to a `standalone` subscription in Sensu Go. Configure one or more Sensu Go agents with the `standalone` subscription to execute formerly standalone checks.
`metrics: true` | See the [translate metric checks][71] section.
`proxy_requests` | See the [translate proxy requests][72] section.
`subscribers: roundrobin...` | Remove `roundrobin` from the subscription name, and add the `round_robin` check attribute set to `true`.
`aggregate` | Check aggregates are supported through the [commercial][27] [Sensu Go Aggregate Check Plugin][28].
`hooks` | See the [translate hooks][73] section.
`dependencies`| Check dependencies are not available in Sensu Go.

{{% notice protip %}}
**PRO TIP**: When using **token substitution** in Sensu Go and accessing labels or annotations that include `.` (for example: `sensu.io.json_attributes`), use the `index` function. For example, `{{index .annotations "web_url"}}` substitutes the value of the `web_url` annotation; `{{index .annotations "production.ID"}}` substitutes the value of the `production.ID` annotation.
{{% /notice %}}

<a name="translate-metric-checks"></a>

**Translate metric checks**

The Sensu Core `type: metric` attribute is not part of the Sensu Go check spec, so you’ll need to adjust it manually.
Sensu Core checks could be configured as `type: metric`, which told Sensu to always handle the check regardless of the check status output.
This allowed Sensu Core to process output metrics via a handler even when the check status was not in an alerting state.

Sensu Go treats output metrics as first-class objects, so you can process check status as well as output metrics via different event pipelines.
See the [guide to metric output][57] to update your metric checks with the `output_metric_handlers` and `output_metric_format` attributes.

<a name="translate-proxy-requests-entities"></a>

**Translate proxy requests and proxy entities**

See the [guide to monitoring external resources][7] to re-configure `proxy_requests` attributes and update your proxy check configuration.
See the [entity reference][6] to re-create your proxy client configurations as Sensu Go proxy entities.

<a name="translate-hooks"></a>

**Translate hooks**

Check hooks are now a resource type in Sensu Go, so you can create, manage, and reuse hooks independently of check definitions.
You can also execute multiple hooks for any given response code.
See the [guide][55] and [hooks reference docs][8] to re-create your Sensu Core hooks as Sensu Go hook resources. 

**Custom attributes**

Custom check attributes are not supported in Sensu Go.
Instead, Sensu Go allows you to add custom labels and annotations to entities, checks, assets, hooks, filters, mutators, handlers, and silences.
See the metadata attributes section in the reference documentation for more information about using labels and annotations (for example, [metadata attributes for entities][24]).

The Sensu Translator stores all check extended attributes in the check metadata annotation named `sensu.io.json_attributes`.
See the [check reference][58] for more information about using labels and annotations in check definitions.

#### 3. Translate filters

Ruby eval logic used in Sensu Core filters is replaced with JavaScript expressions in Sensu Go, opening up powerful possibilities to combine filters with [filter assets][59].
As a result, you'll need to rewrite your Sensu Core filters in Sensu Go format.

First, review your Core handlers to identify which filters are being used. Then, follow the [filter reference][9] and [guide to using filters][60] to re-write your filters using Sensu Go expressions and [event data][61]. Check out the [blog post on filters][62] for a deep dive into Sensu Go filter capabilities.

{{< code shell >}}
# Sensu Core hourly filter
{
  "filters": {
    "recurrences": {
      "attributes": {
        "occurrences": "eval: value == 1 || value % 60 == 0"
      }
    }
  }
}

# Sensu Go hourly filter
  {
    "metadata": {
      "name": "hourly",
      "namespace": "default"
    },
    "action": "allow",
    "expressions": [
      "event.check.occurrences == 1 || event.check.occurrences % (3600 / event.check.interval) == 0"
    ],
    "runtime_assets": null
  }
{{< /code >}}

#### 4. Translate handlers

In Sensu Go, all check results are considered events and are processed by event handlers.
Use the built-in [`is_incident` filter][63] to recreate the Sensu Core behavior, in which only check results with a non-zero status are considered events.

{{% notice note %}}
**NOTE**: Silencing is disabled by default in Sensu Go and must be explicitly enabled using the built-in [`not_silenced` filter](../../../reference/filters/#built-in-filter-not_silenced). Add the `not_silenced` filter to any handlers for which you want to enable Sensu's silencing feature.
{{% /notice %}}

Review your Sensu Core check configuration for the following attributes, and make the corresponding updates to your Sensu Go configuration.

| Core attribute | Manual updates required in Sensu Go config |
| -------------- | ------------- |
`filters: occurrences` | The built-in occurrences filter in Sensu Core is not available in Sensu Go, but you can replicate its functionality with the [sensu-go-fatigue-check-filter asset][65].
`type: transport` | Transport handlers are not supported in Sensu Go, but you can create similar functionality with a pipe handler that connects to a message bus and injects event data into a queue.
`filters: check_dependencies` | Sensu Go does not include a built-in check dependencies filter.
`severities` | Severities are not available in Sensu Go.
`handle_silenced` | Silencing is disabled by default in Sensu Go and must be explicitly enabled using the built-in [`not_silenced` filter][64].
`handle_flapping` | All check results are considered events in Sensu Go and are processed by event handlers.

#### 5. Upload your config to your Sensu Go instance

After you review your translated configuration, make any necessary updates, and add resource definitions for any filters and entities you want to migrate, you can upload your Sensu Go config using sensuctl.

{{< code shell >}}
sensuctl create --file /path/to/config.json
{{< /code >}}

_PRO TIP: `sensuctl create` (and `sensuctl delete`) are powerful tools to help you manage your Sensu configs across namespaces. See the [sensuctl reference][5] for more information._

Access your Sensu Go config using the [Sensu API][17].

{{< code shell >}}
# Set up a local API testing environment by saving your Sensu credentials
# and token as environment variables. Requires curl and jq.
export SENSU_USER=admin && SENSU_PASS=P@ssw0rd!

export SENSU_TOKEN=`curl -XGET -u "$SENSU_USER:$SENSU_PASS" -s http://localhost:8080/auth | jq -r ".access_token"`

# Return list of all configured checks
curl -H "Authorization: Bearer $SENSU_TOKEN" http://127.0.0.1:8080/api/core/v2/namespaces/default/checks

# Return list of all configured handlers
curl -H "Authorization: Bearer $SENSU_TOKEN" http://127.0.0.1:8080/api/core/v2/namespaces/default/handlers
{{< /code >}}

You can also access your Sensu Go configuration in JSON or YAML using sensuctl.
For example, `sensuctl check list --format json`.
Run `sensuctl help` to see available commands.
For more information about sensuctl's output formats (`json`, `wrapped-json`, and `yaml`), see the [sensuctl reference][5].

### Step 3: Translate plugins and register assets

#### Sensu plugins

Within the [Sensu Plugins][21] org, see individual plugin READMEs for compatibility status with Sensu Go.
For handler and mutators plugins, see the [Sensu plugins README][66] to map event data to the [Sensu Go event format][67].
This allows you to use Sensu plugins for handlers and mutators with Sensu Go without re-writing them.

To re-install Sensu plugins onto your Sensu Go agent nodes (check plugins) and backend nodes (mutator and handler plugins), see the [guide][51] to installing the `sensu-install` tool for use with Sensu Go.

#### Sensu Go assets

The `sensu-install` tool in Sensu Core 1.x is replaced by [assets][12] in Sensu Go.
Assets are shareable, reusable packages that make it easier to deploy Sensu plugins.

Although assets are not required to run Sensu Go, we recommend [using assets to install plugins][50] where possible.
You can still install [Sensu Community plugins][21] in Ruby via `sensu-install` by installing [sensu-plugins-ruby][20].
See the [installing plugins guide][51] for more information.

Sensu supports runtime assets for checks, filters, mutators, and handlers.
Discover, download, and share assets with [Bonsai][68], the Sensu asset index.

To create your own assets, see the [asset reference][12] and [guide to sharing an asset on Bonsai][69].
To contribute to converting a Sensu plugin to an asset, see [the Discourse post][70].

### Step 4: Sunset your Sensu Core instance

When you're ready to sunset your Sensu Core instance, see the [platform][74] documentation to stop the Sensu Core services.
You may also want to re-install the `sensu-install` tool using the [`sensu-plugins-ruby` package][20].


[1]: ../../../learn/glossary/
[2]: https://etcd.io/docs/latest/
[3]: ../../../reference/backend/
[4]: ../../../reference/agent/
[5]: ../../../sensuctl/
[6]: ../../../reference/entities/
[7]: ../../../guides/monitor-external-resources/
[8]: ../../../reference/hooks/
[9]: ../../../reference/filters
[10]: ../../../reference/filters/#handle-repeated-events
[11]: https://github.com/nixwiz/sensu-go-fatigue-check-filter/
[12]: ../../../reference/assets/
[13]: ../../../reference/rbac/
[14]: ../../control-access/create-read-only-user/
[15]: https://github.com/nixwiz/sensu-go-fatigue-check-filter/#asset-registration
[16]: ../../../reference/tokens
[17]: ../../../api/
[18]: https://github.com/sensu/sensu-translator/
[19]: https://github.com/nixwiz/sensu-go-fatigue-check-filter/#filter-definition
[20]: https://packagecloud.io/sensu/community/
[21]: https://github.com/sensu-plugins/
[24]: ../../../reference/entities#metadata-attributes
[25]: https://blog.sensu.io/check-configuration-upgrades-with-the-sensu-go-sandbox/
[26]: https://blog.sensu.io/self-service-monitoring-checks-in-sensu-go/
[27]: ../../../commercial/
[28]: https://bonsai.sensu.io/assets/sensu/sensu-aggregate-check/
[29]: ../../../reference/backend#operation
[33]: https://github.com/nixwiz/sensu-go-fatigue-check-filter/#configuration
[34]: ../../../guides/reduce-alert-fatigue/#assign-the-event-filter-to-a-handler-1
[36]: https://etcd.io/
[37]: ../../deploy-sensu/cluster-sensu/
[38]: ../../deploy-sensu/deployment-architecture/
[39]: ../../../web-ui/
[40]: ../../../api/
[41]: ../../../reference/agent#create-monitoring-events-using-the-agent-api
[42]: ../../../reference/agent/#create-monitoring-events-using-the-statsd-listener
[43]: ../../../platforms/
[44]: ../../deploy-sensu/configuration-management/
[45]: https://github.com/sensu/sensu-translator
[46]: https://slack.sensu.io/
[47]: https://discourse.sensu.io/c/sensu-go/migrating-to-go
[48]: ../../../learn/sandbox/
[49]: https://sensu.io/support/
[50]: ../../../guides/install-check-executables-with-assets
[51]: ../../deploy-sensu/install-plugins/
[52]: ../../deploy-sensu/install-sensu#install-the-sensu-backend
[53]: ../../deploy-sensu/install-sensu#install-sensuctl
[54]: ../../../reference/rbac/#resources
[55]: ../../deploy-sensu/install-sensu#install-sensu-agents
[56]: ../../../reference/agent#configuration-via-flags
[57]: ../../../guides/extract-metrics-with-checks/
[58]: ../../../reference/checks#metadata-attributes
[59]: https://bonsai.sensu.io/assets?q=eventfilter
[60]: ../../../guides/reduce-alert-fatigue/
[61]: ../../../reference/filters/#build-event-filter-expressions
[62]: https://blog.sensu.io/filters-valves-for-the-sensu-monitoring-event-pipeline
[63]: ../../../reference/filters/#built-in-filter-is_incident
[64]: ../../../reference/filters/#built-in-filter-not_silenced
[65]: https://bonsai.sensu.io/assets/nixwiz/sensu-go-fatigue-check-filter
[66]: https://github.com/sensu-plugins/sensu-plugin#sensu-go-enablement
[67]: ../../../reference/events/#event-format
[68]: https://bonsai.sensu.io
[69]: ../../../reference/assets#share-an-asset-on-bonsai
[70]: https://discourse.sensu.io/t/contributing-assets-for-existing-ruby-sensu-plugins/1165
[71]: #translate-metric-checks
[72]: #translate-proxy-requests-entities
[73]: #translate-hooks
[74]: https://docs.sensu.io/sensu-core/latest/platforms/
