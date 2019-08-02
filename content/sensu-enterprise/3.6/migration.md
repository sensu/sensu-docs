---
title: "Migrating to Sensu Go"
linkTitle: "Migrate to Sensu Go"
description: "This guide provides information for migrating your Sensu instance from Sensu Enterprise to Sensu Go."
version: "3.6"
weight: 0
menu: "sensu-enterprise-3.6"
product: "Sensu Enterprise"
---

This guide provides information for migrating your Sensu instance from Sensu Enterprise to Sensu Go.
Read the [blog post][49] to learn more about end-of-life for Sensu Enterprise.

- [Learn about Sensu Go](#learn-about-sensu-go)
- [Install Sensu Go](#install-sensu-go)
	- [1. Install the Sensu Go backend](#1-install-the-sensu-go-backend)
	- [2. Log in to the Sensu web UI](#2-log-in-to-the-sensu-web-ui)
	- [3. Install sensuctl on your workstation](#3-install-sensuctl-on-your-workstation)
	- [4. Set up Sensu users](#4-set-up-sensu-users)
	- [5. Install agents](#5-install-agents)
- [Translate your configuration](#translate-your-configuration)
	- [1. Run the translator](#1-run-the-translator)
	- [2. Translate checks](#2-translate-checks)
	- [3. Translate filters](#3-translate-filters)
	- [4. Translate handlers](#4-translate-handlers)
	- [5. Upload your config to your Sensu Go instance](#5-upload-your-config-to-your-sensu-go-instance)
- [Translate plugins and register assets](#translate-plugins-and-register-assets)
- [Translate Sensu Enterprise features](#translate-sensu-enterprise-features)
- [Sunset your Sensu 1.x instance](#sunset-your-sensu-1-x-instance)
- [Resources](#resources)

## Learn about Sensu Go

Sensu Go includes powerful features to make monitoring easier to build, scale, and offer as a self-service tool to your internal customers. 
Read the [blog post][31] for more information about the features of Sensu Go.

To set up a local Sensu Go playground, download and start the [Sensu sandbox][32] using Vagrant and Virtual box.
Get started with Sensu by running through the [sandbox tutorial][32].

## Install Sensu Go

Sensu is now provided as three packages: sensu-go-backend, sensu-go-agent, and sensu-go-cli (sensuctl).
This results in a fundamental change in Sensu terminology from Sensu Core 1.x: the server is now the backend.

“Clients” are now represented within Sensu Go as abstract “entities” that can describe a wider range of system components (network gear, web server, cloud resource, etc.) Entities include “agent entities” (entities running a Sensu agent) and familiar “proxy entities”.

To install Sensu Go alongside your current Sensu instance, first [upgrade][33] to at least [Sensu Core 1.7.0][34].

#### Sensu Go architecture

<img src="/images/install-sensu.svg" alt="Sensu architecture diagram">

Powered by an embedded transport and [etcd][16] datastore, the **Sensu backend** gives you flexible, automated workflows to route metrics and alerts.
Sensu backends require persistent storage for their embedded database, disk space for local asset caching, and three exposed ports:

- `3000` - Sensu [web UI][13]
- `8080` - Sensu [API][41] used by sensuctl, some plugins, and any of your custom tooling
- `8081` - WebSocket API used by Sensu agents

Sensu backends running in a [clustered configuration][14] require additional ports.
See the [deployment guide][deploy] for architecture recommendations.

**Sensu agents** are lightweight clients that run on the infrastructure components you want to monitor.
Agents register automatically with Sensu as entities and are responsible for creating check and metric events to send to the backend event pipeline.
Agents using Sensu [assets][12] require some disk space for a local cache.
Optionally, agents can expose three ports:

- `3030` - [TCP and UDP sockets][70] designed to be backwards compatible with the Sensu 1.x [client socket][64]
- `3031` - [agent API][50]
- `8125` - [StatsD listener][51]

#### Supported platforms

Sensu Go is available for RHEL/CentOS, Debian, Ubuntu, and Docker.
The Sensu Go agent is also available for Windows.
[Configuration management][36] integrations for Sensu Go are available for Puppet, Chef, and Ansible.
See the list of [supported platforms][35] for more information.

#### Deployment recommendations

See the [deployment][deploy] and [hardware requirements][37] guides for deployment recommendations.

### 1. Install the Sensu Go backend 

The Sensu backend is available for Ubuntu/Debian, RHEL/CentOS, and Docker.
See the [installation guide][52] to install, configure, and start the Sensu backend according to your [deployment strategy][deploy].

### 2. Log in to the Sensu web UI

The [Sensu Go web UI][13] provides a unified view of your monitoring events with user-friendly tools to reduce alert fatigue and manage your Sensu instance.
After starting the Sensu backend, open the web UI by visiting http://localhost:3000.
You may need to replace `localhost` with the
hostname or IP address where the Sensu backend is running.

To log in, enter your Sensu user credentials, or use Sensu's default admin credentials (username: `admin` and password: `P@ssw0rd!`).
Select the ☰ icon to explore the web UI.

### 3. Install sensuctl on your workstation

Sensuctl is a command line tool for managing resources within Sensu. It works by calling Sensu’s HTTP API to create, read, update, and delete resources, events, and entities. Sensuctl is available for Linux, Windows, and macOS.
See the [installation guide][54] to install and configure sensuctl.

### 4. Set up Sensu users

Role-based access control (RBAC) is a built-in feature of Sensu Go.
RBAC allows management and access of users and resources based on namespaces, groups, roles, and bindings.
To learn more about setting up RBAC in Sensu Go, see the [RBAC reference][38] and the [guide to creating a read-only user][39].

In Sensu Go, namespaces partition resources within a Sensu instance; Sensu Go entities, checks, handlers, and other [namespaced resources][71] belong to a single namespace.
The Sensu translator that we'll use later places all translated resources into the `default` namespace.

In addition to built-in RBAC, Sensu includes [license-activated][40] support for authentication using Microsoft Active Directory and standards-compliant Lightweight Directory Access Protocol tools like OpenLDAP.

### 5. Install agents

The Sensu agent is available for Ubuntu/Debian, RHEL/CentOS, Windows, and Docker.
See the [installation guide][53] to install, configure, and start Sensu agents.

If you're doing a side-by-side migration, add `api-port` (default: `3031`) and `socket-port` (default: `3030`) to your [agent configuration][62]; this prevents the Sensu Go agent API and socket from conflicting with the Sensu 1.x client API and socket.
You can also disable these features in the agent configuration using the `disable-socket` and `disable-api` flags.

{{< highlight yml >}}
# agent configuration: /etc/sensu.agent.yml
...
api-port: 4041
socket-port: 4030
...
{{< /highlight >}}

Now you should have Sensu installed and functional. The next step is to translate your Sensu 1.x configs to Sensu Go.

## Translate your configuration

The [Sensu translator][18] is a command-line tool to help you transfer your Sensu Core 1.x checks, handlers, and mutators to Sensu Go.

### 1. Run the translator

Install and run the translator.

{{< highlight shell >}}
# Install dependencies
yum install -q -y rubygems ruby-devel

# Install sensu-translator
gem install sensu-translator

# Translate all config in /etc/sensu/conf.d to Sensu Go, output to /sensu_config_translated
# Optionally, you can translate your config in sections according to resource type
sensu-translator -d /etc/sensu/conf.d -o /sensu_config_translated
{{< /highlight >}}

If translation is successful, you should see a few callouts followed by `DONE!`.

{{< highlight shell >}}
Sensu 1.x filter translation is not yet supported
Unable to translate Sensu 1.x filter: only_production {:attributes=>{:check=>{:environment=>"production"}}}
DONE!
{{< /highlight >}}

Combine your config into a sensuctl-readable format.
Note that, for use with `sensuctl create`, Sensu Go resource definitions in JSON format should _not_ have a comma between resource objects.

{{< highlight shell >}}
find sensu_config_translated/ -name '*.json' -exec cat {} \; > sensu_config_translated_singlefile.json
{{< /highlight >}}

While most attributes are ready to use as-is, you'll need to adjust your Sensu Go configuration manually to migrate some of Sensu's features.

_NOTE: To make it easy to compare your Sensu 1.x configuration with your Sensu Go configuration, output your current Sensu 1.x configuration using the API: `curl -s http://127.0.0.1:4567/settings | jq . > sensu_config_original.json`_

### 2. Translate checks

Review your Sensu 1.x check configuration for the following attributes, and make the corresponding updates to your Sensu Go configuration.

| 1.x attribute | Manual updates required in Sensu Go config |
| ------------- | ------------- |
`::: foo :::` | Update the syntax for token substitution from triple colons to curly braces. For example: `{{{ foo }}}`
`stdin: true`  | No updates required. Sensu Go checks accept data on stdin by default.
`handlers: default` | Sensu Go no longer has the concept of a default handler, so you'll need to create a handler named `default` to continue using this pattern.
`subdues` | Check subdues are not available in Sensu Go.
`standalone: true` | Standalone checks are not supported in Sensu Go, although similar functionality can be achieved using [role-based access control, assets, and entity subscriptions][26]. The translator assigns all 1.x standalone checks to a `standalone` subscription in Sensu Go. Configure one or more Sensu Go agents with the `standalone` subscription to execute formerly-standalone checks.
`metrics: true` | See the section on [translating metric checks](#translating-metric-checks).
`proxy_requests` | See the section on [translating proxy requests](#translating-proxy-requests-and-proxy-entities).
`subscribers: roundrobin...` | Remove `roundrobin` from the subscription name, and add the `round_robin` check attribute set to `true`.
`aggregate` | Check aggregates are supported through the [license-activated][40] [Sensu Go Aggregate Check Plugin][28].
`hooks` | See the section on [translating hooks](#translating-hooks).
`dependencies`| Check dependencies are not available in Sensu Go.

_PRO TIP: When using **token substitution** in Sensu Go and accessing labels or annotations that include `.` (for example: `sensu.io.json_attributes`), use the `index` function. For example, `{{index .annotations "web_url"}}` substitutes the value of the `web_url` annotation; `{{index .annotations "production.ID"}}` substitutes the value of the `production.ID` annotation._

#### Translating metric checks

The Sensu 1.x `type: metric` attribute is no longer part of the Sensu Go check spec, so we’ll need to adjust it by hand. Sensu 1.x checks could be configured as `type: metric` which told Sensu to always handle the check regardless of the check status output. This allowed Sensu 1.x to process output metrics via a handler even when the check status was not in an alerting state.

Sensu Go treats output metrics as first-class objects, allowing you to process check status as well as output metrics via different event pipelines. See the [guide to metric output][48] to update your metric checks with the `output_metric_handlers` and `output_metric_format` attributes.

#### Translating proxy requests and proxy entities

See the [guide to monitoring external resources][47] to re-configure `proxy_requests` attributes and update your proxy check configuration, and see the [entity reference][6] to re-create your proxy client configurations as Sensu Go proxy entities.

#### Translating hooks

Check hooks are now a resource type in Sensu Go, meaning that hooks can be created, managed, and reused independently of check definitions.
You can also execute multiple hooks for any given response code.
See the [guide][55] and [hooks reference docs][8] to re-create your Sensu 1.x hooks as Sensu Go hook resources. 

#### Custom attributes

Custom check attributes are no longer supported in Sensu Go.
Instead, Sensu Go provides the ability to add custom labels and annotations to entities, checks, assets, hooks, filters, mutators, handlers, and silences.
The translator stores all check extended attributes in the check metadata annotation named `sensu.io.json_attributes`. 
See the [check reference][56] for more information about using labels and annotations in check definitions.

### 3. Translate filters

Ruby eval logic used in Sensu 1.x filters has been replaced with JavaScript expressions in Sensu Go, opening up powerful possibilities to combine filters with [filter assets][65].
As a result, you'll need to rewrite your Sensu 1.x filters in Sensu Go format.

First, review your 1.x handlers to see which filters are being used. Then, using the [filter reference][57] and [guide to using filters][58], re-write your filters using Sensu Go expressions and [event data][66]. Also check out the [blog post][59] for a deep dive into Sensu Go filter capabilities.

{{< highlight shell >}}
# Sensu 1.x hourly filter
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
{{< /highlight >}}

### 4. Translate handlers

All check results are now considered events and are processed by event handlers.
You can use the built-in [incidents filter][9] to recreate the Sensu Core 1.x behavior in which only check results with a non-zero status are considered events.

**IMPORTANT**: Silencing is now disabled by default in Sensu Go and must be enabled explicitly using the built-in [`not_silenced` filter][15]. Add the `not_silenced` filter to any handlers for which you want to enable Sensu's silencing feature.

Review your Sensu 1.x check configuration for the following attributes, and make the corresponding updates to your Sensu Go configuration.

| 1.x attribute | Manual updates required in Sensu Go config |
| ------------- | ------------- |
`filters: occurrences` | The built-in occurrences filter in Sensu Core 1.x is not available in Sensu Go, but you can replicate its functionality using the [sensu-go-fatigue-check-filter asset][67].
`type: transport` | Transport handlers are not supported by Sensu Go, but you can create similar functionality using a pipe handler that connects to a message bus and injects event data into a queue.
`filters: check_dependencies` | Sensu Go does not include a built-in check dependencies filter.
`severities` | Severities are not available in Sensu Go.
`handle_silenced` | Silencing is now disabled by default in Sensu Go and must be enabled explicitly using the built-in [`not_silenced` filter][15].
`handle_flapping` | All check results are now considered events and are processed by event handlers.

### 5. Upload your config to your Sensu Go instance

Once you've reviewed your translated configuration, made any necessary updates, and added resource definitions for any filters and entities you want to migrate, upload your Sensu Go config using sensuctl.

{{< highlight shell >}}
sensuctl create --file /path/to/config.json
{{< /highlight >}}

_PRO TIP: `sensuctl create` (and `sensuctl delete`) are powerful tools to help you manage your Sensu configs across namespaces. See the [sensuctl reference][5] for more information._

You can now access your Sensu Go config using the [Sensu API][61].

{{< highlight shell >}}
# Set up a local API testing environment by saving your Sensu credentials
# and token as environment variables. Requires curl and jq.
export SENSU_USER=admin && SENSU_PASS=P@ssw0rd!

export SENSU_TOKEN=`curl -XGET -u "$SENSU_USER:$SENSU_PASS" -s http://localhost:8080/auth | jq -r ".access_token"`

# Return list of all configured checks
curl -H "Authorization: Bearer $SENSU_TOKEN" http://127.0.0.1:8080/api/core/v2/namespaces/default/checks

# Return list of all configured handlers
curl -H "Authorization: Bearer $SENSU_TOKEN" http://127.0.0.1:8080/api/core/v2/namespaces/default/handlers
{{< /highlight >}}

You can also access your Sensu Go configuration in JSON or YAML using sensuctl; for example: `sensuctl check list --format json`. Run `sensuctl help` to see available commands. For more information about sensuctl's output formats (`json`, `wrapped-json`, and `yaml`), see the [sensuctl reference][60].

## Translate plugins and register assets

### Sensu Plugins

Within the [Sensu Plugins][21] org, see individual plugin READMEs for compatibility status with Sensu Go.
For handler and mutators plugins, see the [Sensu Plugins README][46] to map event data to the [Sensu Go format][68].
This allows you to use Sensu Plugins for handlers and mutators with Sensu Go without re-writing them.

To re-install Sensu Plugins onto your Sensu Go agent nodes (check plugins) and backend nodes (mutator and handler plugins), see the [guide][22] to installing the `sensu-install` tool for use with Sensu Go.

### Sensu Go assets

[Assets][12] are shareable, reusable packages that make it easy to deploy Sensu plugins.
Although not required to run Sensu Go, we recommend [using assets to install plugins][45] where possible.
Sensu supports runtime assets for checks, filters, mutators, and handlers.
You can discover, download, and share assets using [Bonsai][69], the Sensu asset index.

To create your own assets, see the [asset reference][12] and [guide to sharing an asset on Bonsai][72].
To contribute to converting a Sensu Plugin to an asset, see [the discourse post][44].

## Translate Sensu Enterprise features

### Integrations

Most Sensu Enterprise integrations as available as Sensu Go assets.
See the [guide to installing plugins with assets][45] to register assets with Sensu and update your Sensu Go handler definitions.
 
| Integration | Sensu Go asset |
| ----------- | -------------- |
Chef | https://bonsai.sensu.io/assets/sensu-plugins/sensu-plugins-chef
Email | https://bonsai.sensu.io/assets/sensu/sensu-email-handler
Graphite | https://bonsai.sensu.io/assets/asachs01/sensu-plugins-graphite<br>https://bonsai.sensu.io/assets/nixwiz/sensu-go-graphite-handler
InfluxDB | https://bonsai.sensu.io/assets/sensu/sensu-influxdb-handler
IRC | https://bonsai.sensu.io/assets/sensu-utils/sensu-irc-handler
JIRA | https://bonsai.sensu.io/assets/sensu/sensu-jira-handler
PagerDuty | https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler
ServiceNow | https://bonsai.sensu.io/assets/sensu/sensu-servicenow-handler
Slack | https://bonsai.sensu.io/assets/sensu/sensu-slack-handler
SNMP | https://bonsai.sensu.io/assets/samroy92/sensu-plugins-snmp
VictorOps | https://bonsai.sensu.io/assets/asachs01/sensu-plugins-victorops

<!-- To add if available: -->
<!-- OpsGenie | -->
<!-- Graylog | -->
<!-- Flapjack | -->
<!-- Puppet | -->
<!-- EC2 | -->
<!-- Event Stream | -->
<!-- Rollbar | -->
<!-- Wavefront | -->
<!-- OpenTSDB | -->
<!-- Librato | -->
<!-- DataDog | -->
<!-- TimescaleDB | -->

### Contact routing

Contact routing is available in Sensu Go using the has-contact filter asset.
See the [guide][100] to set up contact routing in Sensu Go.

### LDAP

In addition to built-in RBAC, Sensu includes [license-activated][40] support for authentication using Microsoft Active Directory and standards-compliant Lightweight Directory Access Protocol tools like OpenLDAP.

## Sunset your Sensu 1.x instance

When you're ready to sunset your Sensu 1.x instance, see the [platform][43] docs to stop the Sensu 1.x services.
You may also want to re-install the `sensu-install` tool using the [`sensu-plugins-ruby` package][22].

## Resources

- [Learn about license-activated features designed for monitoring at scale][40]
- [Sensu translator project][18]
- [Jef Spaleta - Check configuration upgrades with the Sensu Go sandbox][25]
- [Sensu webinar: What's new in Sensu Go][42]
- [Get started with the Sensu API][41]
- [Sensu Go backend configuration reference][62]
- [Sensu Go agent configuration reference][63]
- [Sensu Go glossary of terms][1]

[1]: /sensu-go/latest/getting-started/glossary
[3]: /sensu-go/latest/reference/backend
[4]: /sensu-go/latest/reference/agent
[5]: /sensu-go/latest/sensuctl/reference
[6]: /sensu-go/latest/reference/entities
[8]: /sensu-go/latest/reference/hooks
[9]: /sensu-go/latest/reference/filters#built-in-filter-only-incidents
[10]: /sensu-go/latest/reference/filters/#handling-repeated-events
[11]: /sensu-go/latest/reference/filters/#built-in-filters
[12]: /sensu-go/latest/reference/assets
[13]: /sensu-go/latest/dashboard/overview
[14]: /sensu-go/latest/guides/clustering
[15]: /sensu-go/latest/reference/filters/#built-in-filter-allow-silencing
[16]: https://etcd.io/
[18]: https://github.com/sensu/sensu-translator
[20]: https://packagecloud.io/sensu/community
[21]: https://github.com/sensu-plugins
[22]: /sensu-go/latest/installation/plugins
[24]: /sensu-go/latest/reference/entities#metadata-attributes
[25]: https://blog.sensu.io/check-configuration-upgrades-with-the-sensu-go-sandbox
[26]: https://blog.sensu.io/self-service-monitoring-checks-in-sensu-go
[28]: https://bonsai.sensu.io/assets/sensu/sensu-aggregate-check
[31]: https://blog.sensu.io/enterprise-features-in-sensu-go
[32]: /sensu-go/latest/getting-started/learn-sensu
[33]: /sensu-core/latest/installation/upgrading/
[34]: /sensu-core/1.8/changelog/#core-v1-7-0
[35]: /sensu-go/latest/installation/platforms
[36]: /sensu-go/latest/installation/configuration-management
[37]: /sensu-go/latest/installation/recommended-hardware
[38]: /sensu-go/latest/reference/rbac
[39]: /sensu-go/latest/guides/create-a-ready-only-user
[40]: /sensu-go/latest/getting-started/enterprise
[41]: /sensu-go/latest/api/overview
[42]: https://sensu.io/resources/webinar/whats-new-sensu-go
[43]: /sensu-core/latest/platforms
[44]: https://discourse.sensu.io/t/contributing-assets-for-existing-ruby-sensu-plugins/1165
[45]: /sensu-go/latest/guides/install-check-executables-with-assets
[46]: https://github.com/sensu-plugins/sensu-plugin#sensu-go-enablement
[47]: /sensu-go/latest/guides/monitor-external-resources
[48]: /sensu-go/latest/guides/extract-metrics-with-checks
[49]: https://blog.sensu.io/eol-schedule-for-sensu-core-and-enterprise
[deploy]: /sensu-go/latest/guides/deploying
[hardware]: /sensu-go/latest/installation/recommended-hardware
[50]: /sensu-go/latest/reference/agent/#creating-monitoring-events-using-the-agent-api
[51]: /sensu-go/latest/guides/aggregate-metrics-statsd
[52]: /sensu-go/latest/installation/install-sensu#install-the-sensu-backend
[53]: /sensu-go/latest/installation/install-sensu#install-sensu-agents
[54]: /sensu-go/latest/installation/install-sensu#install-sensuctl
[55]: /sensu-go/latest/guides/enrich-events-with-hooks
[56]: /sensu-go/latest/reference/checks#metadata-attributes
[57]: /sensu-go/latest/reference/filters
[58]: /sensu-go/latest/guides/reduce-alert-fatigue
[59]: https://blog.sensu.io/filters-valves-for-the-sensu-monitoring-event-pipeline
[60]: /sensu-go/latest/sensuctl/reference/#preferred-output-format
[61]: /sensu-go/latest/api
[62]: /sensu-go/latest/reference/agent#configuration
[63]: /sensu-go/latest/reference/backend#configuration
[64]: /sensu-core/latest/reference/clients/#client-socket-input
[65]: https://bonsai.sensu.io/assets?q=eventfilter
[66]: /sensu-go/latest/reference/filters#building-filter-expressions
[67]: https://bonsai.sensu.io/assets/nixwiz/sensu-go-fatigue-check-filter
[68]: /sensu-go/latest/reference/events/#event-format
[69]: https://bonsai.sensu.io
[70]: /sensu-go/latest/reference/agent/#creating-monitoring-events-using-the-agent-tcp-and-udp-sockets
[71]: /sensu-go/latest/reference/rbac/#resources
[72]: /sensu-go/latest/reference/assets/#sharing-an-asset-on-bonsai
[100]: /sensu-go/latest/guide/contact-routing
[101]: /sensu-go/latest/dashboard/filtering
