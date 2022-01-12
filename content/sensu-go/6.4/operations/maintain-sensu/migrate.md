---
title: "Migrate from Sensu Core and Sensu Enterprise to Sensu Go"
linkTitle: "Migrate from Sensu Core and Sensu Enterprise"
description: "Sensu Go includes important changes to all parts of Sensu as well as many powerful commercial features to make monitoring easier to build, scale to Sensu Go from Sensu Core and Sensu Enterprise. Follow this guide to migrate from Sensu Core or Sensu Enterprise to Sensu Go."
weight: 20
version: "6.4"
product: "Sensu Go"
menu:
  sensu-go-6.4:
    parent: maintain-sensu
---

This guide includes general information for migrating your Sensu instance from Sensu Core and Sensu Enterprise to Sensu Go.
For instructions and tools to help you translate your Sensu configuration from Sensu Core and Enterprise to Sensu Go, review the [Sensu Translator project][18].

{{% notice note %}}
**NOTE**: The information in this guide applies to Sensu Enterprise as well as Sensu Core, although we refer to "Sensu Core" for brevity.<br><br>
The step for [translating integrations, contact routing, and LDAP authentication](#step-4-translate-sensu-enterprise-only-features) applies to Sensu Enterprise (but **not** Sensu Core), and it is designated as Sensu Enterprise-only.
{{% /notice %}}

Sensu Go includes important changes to all parts of Sensu: architecture, installation, resource definitions, the observation data (event) model, check dependencies, filter evaluation, and more.
Sensu Go also includes many powerful [commercial features][27] to make monitoring easier to build, scale, and offer as a self-service tool to your internal customers.

Sensu Go is available for [RHEL/CentOS, Debian, Ubuntu, and Docker][43].
The Sensu Go agent is also available for Windows.

{{% notice warning %}}
**WARNING**: To install Sensu Go alongside your current Sensu instance, you must upgrade to at least Sensu Core 1.9.0-2.
If you need to upgrade, [contact Sensu](https://sensu.io/contact).
{{% /notice %}}

Aside from this migration guide, these resources can help you migrate from Sensu Core or Sensu Enterprise to Sensu Go:

- [**Sensu Community Slack**][46]: Join hundreds of other Sensu users in our Community Slack, where you can ask questions and benefit from tips others picked up during their own Sensu Go migrations.
- [**Sensu Community Forum**][47]: Drop a question in our dedicated category for migrating to Go.
- [**Sensu Go workshop**][48]: Download the workshop environment and try out some monitoring workflows with Sensu Go.
- [**Sensu Translator**][45]: Use this command-line tool to generate Sensu Go configurations from your Sensu Core config files.

We also offer [**commercial support** and **professional services** packages][49] to help with your Sensu Go migration.

## Configuration management with Ansible, Chef, and Puppet

[Configuration management][44] integrations for Sensu Go are available for Ansible, Chef, and Puppet:

- [Ansible collection for Sensu Go][77] and [documentation site][78]
- [Chef cookbook for Sensu Go][76] &mdash; [contact us][79] for more information
- [Puppet module for Sensu Go][75]

## Packaging

Sensu Go is provided as three packages: sensu-go-backend, sensu-go-agent, and sensu-go-cli (sensuctl).
This is a fundamental change in Sensu terminology from Sensu Core: in Sensu Go, the server is now the backend.

Clients are represented within Sensu Go as abstract [entities][96] that can describe a wider range of system components such as network gear, a web server, or a cloud resource.

Read [Sensu concepts and terminology][1] to learn more about new terms in Sensu Go.

## Architecture

In Sensu Go, an embedded transport and [etcd datastore][2] replace the external RabbitMQ transport and Redis datastore in Sensu Core.

{{< figure src="/images/standalone_architecture.png" alt="Single Sensu Go backend or standalone architecture" link="/images/standalone_architecture.png" target="_blank" >}}
<!-- Diagram source: https://www.lucidchart.com/documents/edit/d239f2db-15db-41c4-a191-b9b46990d156/0 -->

*<p style="text-align:center">Single Sensu Go backend or standalone architecture</p>*

In Sensu Go, the Sensu backend and agent are configured with YAML files or the `sensu-backend` or `sensu-agent` command line tools rather than JSON files.
Sensu checks and pipeline elements are configured via the API or sensuctl tool in Sensu Go instead of JSON files.

The [**Sensu backend**][3] is powered by an embedded transport and [etcd][36] datastore and gives you flexible, automated workflows to route metrics and alerts.
Sensu backends require persistent storage for their embedded database, disk space for local dynamic runtime asset caching, and several exposed ports:

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

Agents that use Sensu [dynamic runtime assets][12] require some disk space for a local cache.

Read the [backend][3], [agent][4], and [sensuctl][5] reference docs for more information.

## Entities

Clients are represented within Sensu Go as abstract [entities][96] that can describe a wide range of system components such as network gear, a web server, or a cloud resource.

Sensu Go includes [agent entities][92] that run a Sensu agent and the familiar [proxy entities][93].
Sensu Go also includes [service entities][94], which represent business services in the [business service monitoring (BSM)][95] feature.

Read the [entity reference][6] and the guide to [monitoring external resources][7] for more information about Sensu Go entities.

## Checks

In Sensu Go, [checks][97] work with Sensu agents to produce observability events automatically.
The Sensu backend coordinates check execution by comparing the [subscriptions][98] specified in check and entity definitions to determine which entities should receive execution requests for a given check.

### Subdue

Sensu Go checks do not include the `subdue` attribute.
Instead, use [cron scheduling][99] in Sensu Go checks to specify when checks should be executed.

### Standalone checks

Sensu Go does not include standalone checks.
Read [Self-service monitoring checks in Sensu Go][26] to learn more about using role-based access control (RBAC), dynamic runtime assets, and entity subscriptions to achieve similar functionality to Sensu Core's standalone checks in Sensu Go.

### Check hooks

[Check hooks][8] are a distinct resource type in Sensu Go, which allows you to create, manage, and reuse hooks independently of check definitions.
You can also execute multiple hooks for any given response code.

### Default handler

Sensu Go does not try to run a default handler when executing checks whose definitions do not specify a handler name.
In Sensu Go, you explicitly add the name of a handler in your check definition.

## Events

In Sensu Go, all check results are considered events and are processed by [handlers][103].

Use Sensu Go's built-in [is_incident filter][63] to recreate the Sensu Core behavior in which only check results with a non-zero status are considered events.

## Handlers

Sensu Go includes pipe and TCP/UDP handlers, but not transport handlers.
To create similar functionality to transport handlers in Sensu Go, create a pipe handler that connects to a message bus and injects event data into a queue.

Sensu Go also includes streaming handlers, such as the [Sumo Logic metrics handler][104], to provide persistent connections for transmitting Sensu observation data to remote data storage services to help prevent data bottlenecks.

## Filters

In Sensu Go, JavaScript expressions replace the Ruby eval logic in Sensu Core, opening up powerful ways to filter events based on occurrences and other event attributes.
As a result, Sensu Go does not include the built-in occurrence-based event filter in Sensu Core.
To replicate the Sensu Core occurrence-based filter's functionality, use Sensu Go's [repeated events filter definition][10].

Sensu Go includes three built-in [event filters][9]: [is_incident][63], [not_silenced][61], and [has_metrics][101].
Sensu Go does not include a built-in check dependencies filter, but you can use the [Core Dependencies Filter][23] dynamic runtime asset to replicate the built-in check dependencies filter functionality from Sensu Core.

Sensu Go event filters do not include the `when` event filter attribute.
Use Sensu query expressions to build [custom functions][106] that provide granular control of time-based filter expressions.

### Fatigue check filter

The [Sensu Go Fatigue Check Filter][11] dynamic runtime asset is a JavaScript implementation of the `occurrences` filter from Sensu Core.
This filter looks for [check and entity annotations][33] in each event it receives and uses the values of those annotations to configure the filter's behavior on a per-event basis.

The [Sensu Translator version 1.1.0][18] retrieves occurrence and refresh values from a Sensu Core check definition and outputs them as annotations in a Sensu Go check definition, compatible with the fatigue check filter.

However, the Sensu Translator doesn't automatically add the [Sensu Go Fatigue Check Filter][11] dynamic runtime asset or the filter configuration you need to run it.
To use the Sensu Go Fatigue Check Filter dynamic runtime asset, you must [register it][15], create a correctly configured [event filter definition][19], and [add the event filter][34] to the list of filters on applicable handlers.

## Dynamic runtime assets

The `sensu-install` tool in Sensu Core is replaced by [dynamic runtime assets][12] in Sensu Go.
Dynamic runtime assets are shareable, reusable packages that make it easier to deploy Sensu plugins.

You can still install [Sensu Community plugins][21] in Ruby via `sensu-install` by installing [sensu-plugins-ruby][20].
Read [Install plugins][51] for more information.

## Role-based access control (RBAC)

Role-based access control (RBAC) is a built-in feature of the open-source version of Sensu Go.
RBAC allows you to manage and access users and resources based on namespaces, groups, roles, and bindings.
To set up RBAC in Sensu Go, read the [RBAC reference][13] and [Create a read-only user][14].

## Silencing

Silencing is disabled by default in Sensu Go.
You must explicitly enable silencing by creating silencing resource definitions with sensuctl, the Sensu web UI, or the core/v2/silenced API endpoint.
Read the Sensu Go [silencing reference][105] for more information.

## Token substitution

The syntax for token substitution changed to [double curly braces][16] in Sensu Go (from triple colons in Sensu Core).

## Aggregates

Sensu Go supports check aggregates with the [Sensu Go Aggregate Check Plugin][28], which is a [commercial][27] resource.

## API

In addition to the changes to resource definitions, Sensu Go includes new versioned APIs.
Read the [API overview][17] for more information.

## Step-by-step migration instructions

### Step 1: Install Sensu Go

#### 1. Install the Sensu Go backend 

The Sensu backend is available for Ubuntu/Debian, RHEL/CentOS, and Docker.
Read the [installation guide][52] to install, configure, and start the Sensu backend according to your [deployment strategy][38].

#### 2. Log in to the Sensu web UI

The [Sensu Go web UI][39] provides a unified view of your observability events with user-friendly tools to reduce alert fatigue and manage your Sensu instance.
After starting the Sensu backend, open the web UI by visiting http://localhost:3000.
You may need to replace `localhost` with the hostname or IP address where the Sensu backend is running.

To log in, enter your Sensu user credentials or use Sensu's default admin credentials (username: `admin` and password: `P@ssw0rd!`).

#### 3. Install sensuctl on your workstation

[Sensuctl][5] is a command line tool for managing resources within Sensu.
It works by calling Sensu’s HTTP API to create, read, update, and delete resources, events, and entities.
Sensuctl is available for Linux, Windows, and macOS.
Read the [installation guide][53] to install and configure sensuctl.

#### 4. Set up Sensu users

Role-based access control (RBAC) is a built-in feature of the open-source version of Sensu Go.
RBAC allows you to manage and access users and resources based on namespaces, groups, roles, and bindings.
To set up RBAC in Sensu Go, read the [RBAC reference][13] and [Create a read-only user][14].

In Sensu Go, [namespaces][107] partition resources within a Sensu instance.
Sensu Go entities, checks, handlers, and other [namespaced resources][54] belong to a single namespace.
The Sensu translator places all translated resources into the `default` namespace &mdash; we'll use the translater in a moment.

In addition to built-in RBAC, Sensu Go's [commercial features][27] include support for authentication using Microsoft Active Directory (AD) and standards-compliant Lightweight Directory Access Protocol tools like OpenLDAP.

#### 5. Install agents

The Sensu agent is available for Ubuntu/Debian, RHEL/CentOS, Windows, and Docker.
Read the [installation guide][55] to install, configure, and start Sensu agents.

If you're doing a side-by-side migration, add `api-port` (default: `3031`) and `socket-port` (default: `3030`) to your [agent configuration][56] (`/etc/sensu/agent.yml`).
This prevents the Sensu Go agent API and socket from conflicting with the Sensu Core client API and socket.

{{< code yml >}}
api-port: 3031
socket-port: 3030
{{< /code >}}

You can also disable these features in the agent configuration using the `disable-socket` and `disable-api` flags.

Sensu should now be installed and functional.
The next step is to translate your Sensu Core configuration to Sensu Go.

### Step 2: Translate your configuration

Use the [Sensu Translator][18] command line tool to transfer your Sensu Core checks, handlers, and mutators to Sensu Go.

#### 1. Run the translator

Install dependencies:

{{< code shell >}}
yum install -q -y rubygems ruby-devel
{{< /code >}}

Install the Sensu translator:

{{< code shell >}}
gem install sensu-translator
{{< /code >}}

Run the Sensu translator to translate all configuration in /etc/sensu/conf.d to Sensu Go and output to /sensu_config_translated:

{{< code shell >}}
sensu-translator -d /etc/sensu/conf.d -o /sensu_config_translated
{{< /code >}}

As an option, you can also translate your configuration in sections according to resource type.

If translation is successful, you should receive a few callouts followed by `DONE!`, similar to this example:

{{< code shell >}}
Sensu 1.x filter translation is not yet supported
Unable to translate Sensu 1.x filter: only_production {:attributes=>{:check=>{:environment=>"production"}}}
DONE!
{{< /code >}}

Combine your config into a sensuctl-readable format.

{{% notice note %}}
**NOTE**: for use with `sensuctl create`, do _not_ use a comma between resource objects in Sensu Go resource definitions in JSON format.
{{% /notice %}}

{{< code shell >}}
find sensu_config_translated/ -name '*.json' -exec cat {} \; > sensu_config_translated_singlefile.json
{{< /code >}}

Most attributes are ready to use as-is, but you'll need to adjust your Sensu Go configuration manually to migrate some of Sensu's features.

{{% notice note %}}
**NOTE**: To streamline a comparison of your Sensu Core configuration with your Sensu Go configuration, output your current Sensu Core configuration using the API: `curl -s http://127.0.0.1:4567/settings | jq . > sensu_config_original.json`.
{{% /notice %}}

#### 2. Translate checks

Review your Sensu Core check configuration for the following attributes, and make the corresponding updates to your Sensu Go configuration.

| Core attribute | Manual updates required in Sensu Go config |
| -------------- | ------------- |
`::: foo :::` | Update the syntax for token substitution from triple colons to double curly braces. For example: `{{ foo }}`
`stdin: true`  | No updates required. Sensu Go checks accept data on stdin by default.
`handlers: default` | Sensu Go does not have a default handler. Create a handler named `default` to continue using this pattern.
`subdues` | Check subdues are not available in Sensu Go.
`standalone: true` | Standalone checks are not supported in Sensu Go, although you can achieve similar functionality using [role-based access control, dynamic runtime assets, and entity subscriptions][26]. The translator assigns all Core standalone checks to a `standalone` subscription in Sensu Go. Configure one or more Sensu Go agents with the `standalone` subscription to execute Sensu Core standalone checks.
`metrics: true` | Review the [translate metric checks][71] section.
`proxy_requests` | Review the [translate proxy requests][72] section.
`subscribers: roundrobin...` | Remove `roundrobin` from the subscription name, and add the `round_robin` check attribute set to `true`.
`aggregate` | Check aggregates are supported through the [commercial][27] [Sensu Go Aggregate Check Plugin][28].
`hooks` | Review the [translate hooks][73] section.
`dependencies`| Use the [Core Dependencies Filter][23] dynamic runtime asset.

{{% notice protip %}}
**PRO TIP**: When using token substitution in Sensu Go and accessing labels or annotations that include `.` (for example: `sensu.io.json_attributes`), use the `index` function.
For example, `{{index .annotations "web_url"}}` substitutes the value of the `web_url` annotation; `{{index .annotations "production.ID"}}` substitutes the value of the `production.ID` annotation.
{{% /notice %}}

<a id="translate-metric-checks"></a>

**Translate metric checks**

The Sensu Core `type: metric` attribute is not part of the Sensu Go check spec, so you’ll need to adjust it manually.
Sensu Core checks could be configured as `type: metric`, which told Sensu to always handle the check regardless of the check status output.
This allowed Sensu Core to process output metrics via a handler even when the check status was not in an alerting state.

Sensu Go treats output metrics as first-class objects, so you can process check status as well as output metrics via different event pipelines.
Read the [guide to metric output][57] to update your metric checks with the `output_metric_handlers` and `output_metric_format` attributes and use `output_metric_tags` to enrich extracted metrics output.

<a id="translate-proxy-requests-entities"></a>

**Translate proxy requests and proxy entities**

Read [Monitor external resources][7] to re-configure `proxy_requests` attributes and update your proxy check configuration.
read the [entity reference][6] to re-create your proxy client configurations as Sensu Go proxy entities.

<a id="translate-hooks"></a>

**Translate hooks**

Check hooks are now a resource type in Sensu Go, so you can create, manage, and reuse hooks independently of check definitions.
You can also execute multiple hooks for any given response code.
Read the [guide][55] and [hooks reference docs][8] to re-create your Sensu Core hooks as Sensu Go hook resources. 

**Custom attributes**

Instead of custom check attributes, Sensu Go allows you to add custom labels and annotations to entities, checks, dynamic runtime assets, hooks, filters, mutators, handlers, and silences.
Review the metadata attributes section in the reference documentation for more information about using labels and annotations (for example, [metadata attributes for entities][24]).

The Sensu Translator stores all check extended attributes in the check metadata annotation named `sensu.io.json_attributes`.
Read the [checks reference][58] for more information about using labels and annotations in check definitions.

#### 3. Translate event filters

Ruby eval logic used in Sensu Core filters is replaced with JavaScript expressions in Sensu Go, opening up powerful possibilities to combine filters with [filter dynamic runtime assets][59].
As a result, you'll need to rewrite your Sensu Core filters in Sensu Go format.

First, review your Core handlers to identify which filters are being used.
Then, follow the [filter reference][9] and [guide to using filters][60] to re-write your filters using Sensu Go expressions and [event data][61].
Check out the [blog post on filters][62] for a deep dive into Sensu Go filter capabilities.

Sensu Core hourly filter:

{{< code json >}}
{
  "filters": {
    "recurrences": {
      "attributes": {
        "occurrences": "eval: value == 1 || value % 60 == 0"
      }
    }
  }
}
{{< /code >}}

Sensu Go hourly filter:

{{< language-toggle >}}

{{< code yml >}}
---
type: EventFilter
api_version: core/v2
metadata:
  name: hourly
spec:
  action: allow
  expressions:
  - event.check.occurrences == 1 || event.check.occurrences % (3600 / event.check.interval) == 0
  runtime_assets: null
{{< /code >}}

{{< code json >}}
{
  "type": "EventFilter",
  "api_version": "core/v2",
  "metadata": {
    "name": "hourly"
  },
  "spec": {
    "action": "allow",
    "expressions": [
      "event.check.occurrences == 1 || event.check.occurrences % (3600 / event.check.interval) == 0"
    ],
    "runtime_assets": null
  }
}
{{< /code >}}

{{< /language-toggle >}}

#### 4. Translate handlers

In Sensu Go, all check results are considered events and are processed by event handlers.
Use the built-in [is_incident filter][63] to recreate the Sensu Core behavior, in which only check results with a non-zero status are considered events.

{{% notice note %}}
**NOTE**: Silencing is disabled by default in Sensu Go and must be explicitly enabled.
Read the [silencing reference](../../../observability-pipeline/observe-process/silencing/) to create silences in Sensu Go.
{{% /notice %}}

Review your Sensu Core check configuration for the following attributes and make the corresponding updates to your Sensu Go configuration.

| Core attribute | Manual updates required in Sensu Go config |
| -------------- | ------------- |
`filters: occurrences` | Replicate the built-in occurrences filter in Sensu Core with the [Sensu Go Fatigue Check Filter][65].
`type: transport` | Achieve similar functionailty to transport handlers in Sensu Core with a Sensu Go pipe handler that connects to a message bus and injects event data into a queue.
`filters: check_dependencies` | Use the [Core Dependencies Filter][23] dynamic runtime asset.
`severities` | Sensu Go does not support severities.
`handle_silenced` | Silencing is disabled by default in Sensu Go and must be explicitly enabled using sensuctl, the web UI, or the core/v2/silenced API endpoint.
`handle_flapping` | All check results are considered events in Sensu Go and are processed by [handlers][103].

#### 5. Upload your config to your Sensu Go instance

After you review your translated configuration, make any necessary updates, and add resource definitions for any filters and entities you want to migrate, you can upload your Sensu Go config using sensuctl.

{{< code shell >}}
sensuctl create --file /path/to/config.json
{{< /code >}}

{{% notice protip %}}
**PRO TIP**: `sensuctl create` (and `sensuctl delete`) are powerful tools to help you manage your Sensu configs across namespaces.
Read the [sensuctl reference](../../../sensuctl/) for more information.
{{% /notice %}}

Access your Sensu Go config using the [Sensu API][17].

Set up a local API testing environment by saving your Sensu credentials and token as environment variables.
This command requires curl and jq.

{{< code shell >}}
export SENSU_USER=admin && SENSU_PASS=P@ssw0rd!
export SENSU_TOKEN=`curl -XGET -u "$SENSU_USER:$SENSU_PASS" -s http://localhost:8080/auth | jq -r ".access_token"`
{{< /code >}}

Return a list of all configured checks:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_TOKEN" http://127.0.0.1:8080/api/core/v2/namespaces/default/checks
{{< /code >}}

Return a list of all configured handlers:

{{< code shell >}}
curl -H "Authorization: Bearer $SENSU_TOKEN" http://127.0.0.1:8080/api/core/v2/namespaces/default/handlers
{{< /code >}}

You can also access your Sensu Go configuration in JSON or YAML using sensuctl.
For example, `sensuctl check list --format wrapped-json`.
Run `sensuctl help` To view available commands.
For more information about sensuctl's output formats (`json`, `wrapped-json`, and `yaml`), read the [sensuctl reference][22].

### Step 3: Translate plugins and register dynamic runtime assets

#### Sensu plugins

Within the [Sensu Plugins][21] org, review individual plugin READMEs for compatibility status with Sensu Go.
For handler and mutators plugins, review the [Sensu plugins README][66] to map event data to the [Sensu Go event format][67].
This allows you to use Sensu plugins for handlers and mutators with Sensu Go without re-writing them.

To re-install Sensu plugins onto your Sensu Go agent nodes (check plugins) and backend nodes (mutator and handler plugins), read the [guide][51] to installing the `sensu-install` tool for use with Sensu Go.

#### Sensu Go dynamic runtime assets

The `sensu-install` tool in Sensu Core is replaced by [dynamic runtime assets][12] in Sensu Go.
Dynamic runtime assets are shareable, reusable packages that make it easier to deploy Sensu plugins.

Although dynamic runtime assets are not required to run Sensu Go, we recommend [using assets to install plugins][50] where possible.
You can still install [Sensu Community plugins][21] in Ruby via `sensu-install` by installing [sensu-plugins-ruby][20].
Read [Install plugins][51] for more information.

Sensu supports dynamic runtime assets for checks, filters, mutators, and handlers.
Discover, download, and share dynamic runtime assets with [Bonsai][68], the Sensu asset hub.

To create your own dynamic runtime assets, read the [asset reference][12] and [guide to sharing an asset on Bonsai][69].
To contribute to converting a Sensu plugin to a dynamic runtime asset, read [the Discourse post][70].

### Step 4: Translate Sensu Enterprise-only features

#### Integrations

Most Sensu Enterprise integrations as available as Sensu Go assets.
Read the [guide to installing plugins with assets][50] to register assets with Sensu and update your Sensu Go handler definitions.

- [Chef][80]
- [Email][81]
- [Graphite][82]
- [InfluxDB][83]
- [IRC][84]
- [Jira][85]
- [PagerDuty][86]
- [ServiceNow][87]
- [Slack][88]
- [VictorOps][89]

#### Contact routing

Contact routing is available in Sensu Go using the has-contact filter asset.
Read [Route alerts with event filters][90] to set up contact routing in Sensu Go.

#### LDAP

In addition to built-in RBAC, Sensu includes [license-activated][91] support for authentication using Microsoft Active Directory and standards-compliant Lightweight Directory Access Protocol tools like OpenLDAP.

### Step 5: Sunset your Sensu Core instance

When you're ready to sunset your Sensu Core instance, stop the Sensu Core services according to the instructions for your [platform][74] &mdash; these instructions are listed under **Operating Sensu** on each platform's page.

After you stop the Sensu Core services, follow package removal instructions for your platform to uninstall the Sensu Core package.


[1]: ../../../learn/concepts-terminology/
[2]: https://etcd.io/docs/latest/
[3]: ../../../observability-pipeline/observe-schedule/backend/
[4]: ../../../observability-pipeline/observe-schedule/agent/
[5]: ../../../sensuctl/
[6]: ../../../observability-pipeline/observe-entities/entities/
[7]: ../../../observability-pipeline/observe-entities/monitor-external-resources/
[8]: ../../../observability-pipeline/observe-schedule/hooks/
[9]: ../../../observability-pipeline/observe-filter/filters
[10]: ../../../observability-pipeline/observe-filter/filters/#filter-for-repeated-events
[11]: https://bonsai.sensu.io/assets/sensu/sensu-go-fatigue-check-filter/
[12]: ../../../plugins/assets/
[13]: ../../control-access/rbac/
[14]: ../../control-access/create-read-only-user/
[15]: https://bonsai.sensu.io/assets/sensu/sensu-go-fatigue-check-filter/#asset-registration
[16]: ../../../observability-pipeline/observe-schedule/tokens
[17]: ../../../api/
[18]: https://github.com/sensu/sensu-translator/
[19]: https://bonsai.sensu.io/assets/sensu/sensu-go-fatigue-check-filter/#filter-definition
[20]: https://packagecloud.io/sensu/community/
[21]: https://github.com/sensu-plugins/
[22]: ../../../sensuctl/#preferred-output-format
[23]: https://bonsai.sensu.io/assets/sensu/sensu-dependencies-filter
[24]: ../../../observability-pipeline/observe-entities/entities#metadata-attributes
[26]: https://sensu.io/blog/self-service-monitoring-checks-in-sensu-go/
[27]: ../../../commercial/
[28]: https://bonsai.sensu.io/assets/sensu/sensu-aggregate-check/
[29]: ../../../observability-pipeline/observe-schedule/backend#operation
[33]: https://bonsai.sensu.io/assets/sensu/sensu-go-fatigue-check-filter/#configuration
[34]: ../../../observability-pipeline/observe-filter/reduce-alert-fatigue/#assign-the-event-filter-to-a-handler
[36]: https://etcd.io/
[37]: ../../deploy-sensu/cluster-sensu/
[38]: ../../deploy-sensu/deployment-architecture/
[39]: ../../../web-ui/
[40]: ../../../api/
[41]: ../../../observability-pipeline/observe-schedule/agent#create-observability-events-using-the-agent-api
[42]: ../../../observability-pipeline/observe-schedule/agent/#create-observability-events-using-the-statsd-listener
[43]: ../../../platforms/
[44]: ../../deploy-sensu/configuration-management/
[45]: https://github.com/sensu/sensu-translator
[46]: https://slack.sensu.io/
[47]: https://discourse.sensu.io/c/sensu-go/migrating-to-go
[48]: https://github.com/sensu/sensu-go-workshop
[49]: https://sensu.io/support/
[50]: ../../../plugins/use-assets-to-install-plugins/
[51]: ../../../plugins/install-plugins/
[52]: ../../deploy-sensu/install-sensu#install-the-sensu-backend
[53]: ../../deploy-sensu/install-sensu#install-sensuctl
[54]: ../../control-access/rbac/#resources
[55]: ../../deploy-sensu/install-sensu#install-sensu-agents
[56]: ../../../observability-pipeline/observe-schedule/agent#configuration-via-flags
[57]: ../../../observability-pipeline/observe-schedule/collect-metrics-with-checks/
[58]: ../../../observability-pipeline/observe-schedule/checks#metadata-attributes
[59]: https://bonsai.sensu.io/assets?q=eventfilter
[60]: ../../../observability-pipeline/observe-filter/reduce-alert-fatigue/
[61]: ../../../observability-pipeline/observe-filter/filters/#build-event-filter-expressions-with-sensu-query-expressions
[62]: https://sensu.io/blog/filters-valves-for-the-sensu-monitoring-event-pipeline
[63]: ../../../observability-pipeline/observe-filter/filters/#built-in-filter-is_incident
[64]: ../../../observability-pipeline/observe-filter/filters/#built-in-filter-not_silenced
[65]: https://bonsai.sensu.io/assets/sensu/sensu-go-fatigue-check-filter
[66]: https://github.com/sensu-plugins/sensu-plugin#sensu-go-enablement
[67]: ../../../observability-pipeline/observe-events/events/#event-format
[68]: https://bonsai.sensu.io
[69]: ../../../plugins/assets/#share-an-asset-on-bonsai
[70]: https://discourse.sensu.io/t/contributing-assets-for-existing-ruby-sensu-plugins/1165
[71]: #translate-metric-checks
[72]: #translate-proxy-requests-entities
[73]: #translate-hooks
[74]: https://docs.sensu.io/sensu-core/latest/platforms/
[75]: https://forge.puppet.com/modules/sensu/sensu
[76]: https://supermarket.chef.io/cookbooks/sensu-go
[77]: https://galaxy.ansible.com/sensu/sensu_go
[78]: https://sensu.github.io/sensu-go-ansible/
[79]: https://monitoringlove.sensu.io/chef
[80]: https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-chef
[81]: https://bonsai.sensu.io/assets/sensu/sensu-email-handler
[82]: https://bonsai.sensu.io/assets/sensu/sensu-go-graphite-handler
[83]: https://bonsai.sensu.io/assets/sensu/sensu-influxdb-handler
[84]: https://bonsai.sensu.io/assets/sensu-utils/sensu-irc-handler
[85]: https://bonsai.sensu.io/assets/sensu/sensu-jira-handler
[86]: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler
[87]: https://bonsai.sensu.io/assets/sensu/sensu-servicenow-handler
[88]: https://bonsai.sensu.io/assets/sensu/sensu-slack-handler
[89]: https://bonsai.sensu.io/assets/asachs01/sensu-plugins-victorops
[90]: ../../../observability-pipeline/observe-filter/route-alerts/
[91]: ../../../commercial
[92]: ../../../observability-pipeline/observe-entities/#agent-entities
[93]: ../../../observability-pipeline/observe-entities/#proxy-entities
[94]: ../../../observability-pipeline/observe-entities/#service-entities
[95]: ../../../observability-pipeline/observe-schedule/business-service-monitoring/
[96]: ../../../observability-pipeline/observe-entities/
[97]: ../../../observability-pipeline/observe-schedule/checks/
[98]: ../../../observability-pipeline/observe-schedule/subscriptions/
[99]: ../../../observability-pipeline/observe-schedule/checks/#cron-scheduling
[101]: ../../../observability-pipeline/observe-filter/filters/#built-in-filter-has_metrics
[102]: ../../../observability-pipeline/observe-transform/mutators/
[103]: ../../../observability-pipeline/observe-process/handlers/
[104]: ../../../observability-pipeline/observe-process/sumo-logic-metrics-handlers/
[105]: ../../../observability-pipeline/observe-process/silencing/
[106]: ../../../observability-pipeline/observe-filter/sensu-query-expressions/#custom-functions
[107]: ../../control-access/namespaces/
