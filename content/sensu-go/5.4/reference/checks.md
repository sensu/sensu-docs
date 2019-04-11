---
title: "Checks"
description: "Checks work with Sensu agents to let you monitor your infrastructure automatically and send monitoring events to the Sensu pipeline. Read the reference doc to learn about running service checks."
weight: 10
version: "5.4"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.4:
    parent: reference
---

- [Check commands](#check-commands)
- [Check result specification](#check-result-specification)
- [Check scheduling](#check-scheduling)
	- [Subscriptions](#subscriptions)
	- [Scheduling](#scheduling)
- [Proxy checks](#proxy-requests)
- [Check token substitution](#check-token-substitution)
- [Check hooks](#check-hooks)
- [Check specification](#check-specification)
	- [Top-level attributes](#top-level-attributes)
	- [Spec attributes](#spec-attributes)
	- [Metadata attributes](#metadata-attributes)
	- [Proxy requests attributes](#proxy-requests-attributes)
	- [Check output truncation attributes](#check-output-truncation-attributes)
- [Examples](#examples)

Checks work with Sensu agents to produce monitoring events automatically.
You can use checks to monitor server resources, services, and application health as well as collect and analyze metrics.
Read the [guide to monitoring server resources](../../guides/monitor-server-resources) to get started.
You can discover, download, and share Sensu check assets using [Bonsai][25], the Sensu asset index.

## Check commands

Each Sensu check definition specifies a command and the schedule at which it should be executed.
Check commands are executable commands which are executed by the Sensu agent.

A command may include command line arguments for controlling the behavior of the
command executable. Most Sensu check plugins provide support for command line
arguments for reusability.

### How and where are check commands executed?

All check commands are executed by Sensu agents as the `sensu` user. Commands
must be executable files that are discoverable on the Sensu agent system (for example:
installed in a system `$PATH` directory).

## Check result specification

Although Sensu agents attempt to execute any
command defined for a check, successful processing of check results requires
adherence to a simple specification.

- Result data is output to [STDOUT or STDERR][3]
    - For service checks, this output is typically a human-readable message.
    - For metrics checks, this output contains the measurements gathered by the
      check.
- Exit status code indicates state
    - `0` indicates “OK”
    - `1` indicates “WARNING”
    - `2` indicates “CRITICAL”
    - Exit status codes other than `0`, `1`, or `2` indicate an “UNKNOWN” or
      custom status

_PRO TIP: Those familiar with the **Nagios** monitoring
system may recognize this specification, as it is the same one used by Nagios
plugins. As a result, Nagios plugins can be used with Sensu without any
modification._

At every execution of a check command – regardless of success or failure – the
Sensu agent publishes the check’s result for eventual handling by the **event
processor** (the Sensu backend).

## Check scheduling

Checks are scheduled by the Sensu backend, which
publishes check execution requests to entities via a [publish-subscribe
model][2].

### Subscriptions

Checks have a defined set of subscriptions, transport
topics to which the Sensu backend publishes check requests. Sensu entities become
subscribers to these topics (called subscriptions) via their individual
subscriptions attribute. In practice, subscriptions typically correspond to
a specific role or responsibility (for example: a webserver or database).

Subscriptions are powerful primitives in the monitoring context because they
allow you to effectively monitor for specific behaviors or characteristics
corresponding to the function being provided by a particular system. For
example, disk capacity thresholds might be more important (or at least
different) on a database server as opposed to a webserver; conversely, CPU
or memory usage thresholds might be more important on a caching system than
on a file server. Subscriptions also allow you to configure check requests for
an entire group or subgroup of systems rather than requiring a traditional one-to-one
mapping.

To configure subscriptions for a check, use the `subscriptions` attribute to specify an array of one or more subscription names.
Sensu schedules checks once per interval for each agent with a matching subscription.
For example, if we have three agents configured with the `system` subscription, a check configured with the `system` subscription results in three monitoring events per interval: one check execution per agent per interval.
In order for Sensu to execute a check, the check definition must include a subscription that matches the subscription of at least one Sensu agent.

#### Round-robin checks

By default, Sensu schedules checks once per interval for each agent with a matching subscription: one check execution per agent per interval.
However, Sensu also supports executing checks only once per interval when configured with the `round_robin` check attribute.
For checks with `round_robin` set to `true`, Sensu executes the check once per interval, cycling through the available agents alphabetically according to agent name.

For example, for three agents configured with the `system` subscription (agents A, B, and C), a check configured with the `system` subscription and `round_robin` set to `true` results in one monitoring event per interval, with the agent creating the event following the pattern A -> B -> C -> A -> B -> C for the first six intervals.

_PRO TIP: You can use round-robin to distribute check execution workload across multiple agents when using [proxy checks with the proxy requests attributes](#using-a-proxy-check-to-monitor-a-multiple-proxy-entities)._

### Scheduling

You can schedule checks using the `interval`, `cron`, and `publish` attributes.
Sensu requires that checks include either an `interval` attribute (interval scheduling), a `cron` attribute (cron scheduling), or the `publish` attribute set to `false` (ad-hoc scheduling).

| check attributes | interval scheduling | cron scheduling | ad-hoc scheduling
| --- | --- | --- | --- |
| `interval` | ✅ | ❌ | ❌
| `cron` | ❌ | ✅ | ❌
| `publish` | `true` | `true` | `false`

#### Interval scheduling

You can schedule a check to be executed at regular intervals using the `interval` and `publish` check attributes.
For example, to schedule a check to execute every 60 seconds, set the `interval` attribute to `60` and the `publish` attribute to `true`.

_NOTE: When creating an interval check, Sensu calculates an initial offset to splay the check's
first scheduled request.
This helps to balance the load of both the backend and the agent, and may result in a delay before initial check execution._

**Example interval check**

{{< highlight json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "interval_check",
    "namespace": "default"
  },
  "spec": {
    "command": "check-cpu.sh -w 75 -c 90",
    "subscriptions": ["system"],
    "handlers": ["slack"],
    "interval": 60,
    "publish": true
  }
}
{{< /highlight >}}

#### Cron scheduling

You can also schedule checks using [cron syntax][14].
For example, to schedule a check to execute once a minute at the start of the minute, set the `cron` attribute to `* * * * *` and the `publish` attribute to `true`.

**Example cron check**

{{< highlight json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "cron_check",
    "namespace": "default"
  },
  "spec": {
    "command": "check-cpu.sh -w 75 -c 90",
    "subscriptions": ["system"],
    "handlers": ["slack"],
    "cron": "* * * * *",
    "publish": true
  }
}
{{< /highlight >}}

#### Ad-hoc scheduling

In addition to automatic execution, you can create checks to be scheduled manually using the [checks API](../../api/check#the-checkscheckexecute-api-endpoint).
To create a check with ad-hoc scheduling, set the `publish` attribute to `false` in addition to an `interval` or `cron` schedule.

**Example ad-hoc check**

{{< highlight json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "ad_hoc_check",
    "namespace": "default"
  },
  "spec": {
    "command": "check-cpu.sh -w 75 -c 90",
    "subscriptions": ["system"],
    "handlers": ["slack"],
    "interval": 60,
    "publish": false
  }
}
{{< /highlight >}}

## Proxy checks {#proxy-requests}

Sensu supports running proxy checks where the results are considered to be for an
entity that isn’t actually the one executing the check, regardless of whether
that entity is a Sensu agent entity or a proxy entity.
Proxy entities allow Sensu to monitor external resources
on systems or devices where a Sensu agent cannot be installed, like a
network switch or a website.
You can create a proxy check using the [`proxy_entity_name` attribute](#using-a-proxy-check-to-monitor-a-proxy-entity) or the [`proxy_requests` attributes](#using-a-proxy-check-to-monitor-a-multiple-proxy-entities).

### Using a proxy check to monitor a proxy entity

When executing checks that include a `proxy_entity_name`, Sensu agents report the resulting events under the specified proxy entity instead of the agent entity.
If the proxy entity doesn't exist, Sensu creates the proxy entity when the event is received by the backend.

**Example proxy check using a `proxy_entity_name`**

The following proxy check runs every 60 seconds on agents with the `proxy` subscription for the proxy entity `sensu-site`.

{{< highlight json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "proxy_check",
    "namespace": "default"
  },
  "spec": {
    "command": "http_check.sh https://sensu.io",
    "subscriptions": ["proxy"],
    "handlers": ["slack"],
    "interval": 60,
    "publish": true,
    "proxy_entity_name": "sensu-site"
  }
}
{{< /highlight >}}

### Using a proxy check to monitor a multiple proxy entities

The [`proxy_requests` check attributes](#proxy-requests-top-level) allow Sensu to run a check for each entity that matches the definitions specified in the `entity_attributes`, resulting in monitoring events that represents each matching proxy entity.
The entity attributes must match exactly as stated; no variables or directives have any special meaning, but you can still use [Sensu query expressions][11] to perform more complicated filtering on the available value, such as finding entities with particular subscriptions.

The `proxy_requests` attributes are a great way to monitor multiple entities using a single check definition when combined with [token substitution](#token-substitution).
Since checks including `proxy_requests` attributes need to be executed for each matching entity, we recommend using the `round_robin` attribute to distribute the check execution workload evenly across your Sensu agents.

**Example proxy check using `proxy_requests`**

The following proxy check runs every 60 seconds, cycling through the agents with the `proxy` subscription alphabetically according to the agent name, for all existing proxy entities with the custom label `proxy_type` set to `website`.

This check uses [token substitution](#token-substitution) to import the value of the custom entity label `url` to complete the check command.
See the [entity reference](../entities#managing-entity-labels) for information about using custom labels.

{{< highlight json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "proxy_check_proxy_requests",
    "namespace": "default"
  },
  "spec": {
    "command": "http_check.sh {{ .labels.url }}",
    "subscriptions": ["proxy"],
    "handlers": ["slack"],
    "interval": 60,
    "publish": true,
    "proxy_requests": {
      "entity_attributes": [
        "entity.labels.proxy_type == 'website'"
      ]
    },
    "round_robin": true
  }
}
{{< /highlight >}}

#### Fine-tuning proxy check scheduling with splay

Sensu supports distributing proxy check executions across an interval using the `splay` and `splay_coverage` attributes.
For example, if we assume that the `proxy_check_proxy_requests` check in the example above matches three proxy entities, we'd expect to see a burst of three events every 60 seconds.
If we add the `splay` attribute (set to `true`) and the `splay_coverage` attribute (set to `90`) to the `proxy_requests` scope, Sensu distributes the three check executions over 90% of the 60-second interval, resulting in three events splayed evenly across a 54-second period.

## Check token substitution

Sensu check definitions may include attributes that you may wish to override on
an entity-by-entity basis. For example, [check commands][4] – which may include
command line arguments for controlling the behavior of the check command – may
benefit from entity-specific thresholds, etc. Sensu check tokens are check
definition placeholders that will be replaced by the Sensu agent with the
corresponding entity definition attributes values (including custom attributes).

Learn how to use check tokens with the [Sensu tokens reference
documentation][5].

_NOTE: Check tokens are processed before check execution, therefore token substitutions
will not apply to check data delivered via the local agent socket input._

## Check hooks

Check hooks are commands run by the Sensu agent in response to the result of
check command execution. The Sensu agent will execute the appropriate configured
hook command, depending on the check execution status (ex: 0, 1, 2).

Learn how to use check hooks with the [Sensu hooks reference
documentation][6].

## Check specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute specifying the [`sensuctl create`][sc] resource type. Checks should always be of type `CheckConfig`.
required     | Required for check definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"type": "CheckConfig"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute specifying the Sensu API group and version. For checks in Sensu backend version 5.4, this attribute should always be `core/v2`.
required     | Required for check definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"api_version": "core/v2"{{< /highlight >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the check, including the `name` and `namespace` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the check definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope.  See the [metadata attributes reference][25] for details.
required     | Required for check definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | Map of key-value pairs
example      | {{< highlight shell >}}"metadata": {
  "name": "collect-metrics",
  "namespace": "default",
  "labels": {
    "region": "us-west-1"
  },
  "annotations": {
    "slack-channel" : "#monitoring"
  }
}{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes the check [spec attributes][sp].
required     | Required for check definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | Map of key-value pairs
example      | {{< highlight shell >}}"spec": {
  "command": "/etc/sensu/plugins/check-chef-client.go",
  "interval": 10,
  "publish": true,
  "subscriptions": [
    "production"
  ]
}{{< /highlight >}}

### Spec attributes

|command     |      |
-------------|------
description  | The check command to be executed.
required     | true
type         | String
example      | {{< highlight shell >}}"command": "/etc/sensu/plugins/check-chef-client.go"{{< /highlight >}}

|subscriptions|     |
-------------|------
description  | An array of Sensu entity subscriptions that check requests will be sent to. The array cannot be empty and its items must each be a string.
required     | true
type         | Array
example      | {{< highlight shell >}}"subscriptions": ["production"]{{< /highlight >}}

|handlers    |      |
-------------|------
description  | An array of Sensu event handlers (names) to use for events created by the check. Each array item must be a string.
required     | false
type         | Array
example      | {{< highlight shell >}}"handlers": ["pagerduty", "email"]{{< /highlight >}}

|interval    |      |
-------------|------
description  | The frequency in seconds the check is executed.
required     | true (unless `cron` is configured)
type         | Integer
example      | {{< highlight shell >}}"interval": 60{{< /highlight >}}

|cron        |      |
-------------|------
description  | When the check should be executed, using the [cron syntax][14] or [these predefined schedules][15].
required     | true (unless `interval` is configured)
type         | String
example      | {{< highlight shell >}}"cron": "0 0 * * *"{{< /highlight >}}

|publish     |      |
-------------|------
description  | If check requests are published for the check.
required     | false
type         | Boolean
example      | {{< highlight shell >}}"publish": false{{< /highlight >}}

|timeout     |      |
-------------|------
description  | The check execution duration timeout in seconds (hard stop).
required     | false
type         | Integer
example      | {{< highlight shell >}}"timeout": 30{{< /highlight >}}

|ttl         |      |
-------------|------
description  | The time to live (TTL) in seconds until check results are considered stale. If an agent stops publishing results for the check, and the TTL expires, an event will be created for the agent's entity. The check `ttl` must be greater than the check `interval`, and should accommodate time for the check execution and result processing to complete. For example, if a check has an `interval` of `60` (seconds) and a `timeout` of `30` (seconds), an appropriate `ttl` would be a minimum of `90` (seconds).
required     | false
type         | Integer
example      | {{< highlight shell >}}"ttl": 100{{< /highlight >}}

|stdin       |      |
-------------|------
description  | If the Sensu agent writes JSON serialized Sensu entity and check data to the command process’ STDIN. The command must expect the JSON data via STDIN, read it, and close STDIN. This attribute cannot be used with existing Sensu check plugins, nor Nagios plugins etc, as Sensu agent will wait indefinitely for the check process to read and close STDIN.
required     | false
type         | Boolean
default      | false
example      | {{< highlight shell >}}"stdin": true{{< /highlight >}}

|low_flap_threshold ||
-------------|------
description  | The flap detection low threshold (% state change) for the check. Sensu uses the same [flap detection algorithm as Nagios][16].
required     | false
type         | Integer
example      | {{< highlight shell >}}"low_flap_threshold": 20{{< /highlight >}}

|high_flap_threshold ||
-------------|------
description  | The flap detection high threshold (% state change) for the check. Sensu uses the same [flap detection algorithm as Nagios][16].
required     | true (if `low_flap_threshold` is configured)
type         | Integer
example      | {{< highlight shell >}}"high_flap_threshold": 60{{< /highlight >}}

|runtime_assets |   |
-------------|------
description  | An array of [Sensu assets][9] (names), required at runtime for the execution of the `command`
required     | false
type         | Array
example      | {{< highlight shell >}}"runtime_assets": ["ruby-2.5.0"]{{< /highlight >}}

<a name="check-hooks-attribute">

|check_hooks |      |
-------------|------
description  | An array of check response types with respective arrays of [Sensu hook names][6]. Sensu hooks are commands run by the Sensu agent in response to the result of the check command execution. Hooks are executed, in order of precedence, based on their severity type: `1` to `255`, `ok`, `warning`, `critical`, `unknown`, and finally `non-zero`.
required     | false
type         | Array
example      | {{< highlight shell >}}"check_hooks": [
  {
    "0": [
      "passing-hook","always-run-this-hook"
    ]
  },
  {
    "critical": [
      "failing-hook","collect-diagnostics","always-run-this-hook"
    ]
  }
]{{< /highlight >}}

|proxy_entity_name|   |
-------------|------
description  | The entity name, used to create a [proxy entity][20] for an external resource (i.e., a network switch).
required     | false
type         | String
validated    | [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2)
example      | {{< highlight shell >}}"proxy_entity_name": "switch-dc-01"{{< /highlight >}}

<a name="proxy-requests-top-level">

|proxy_requests|    |
-------------|------
description  | [Sensu proxy request attributes][10] allow you to assign the check to run for multiple entities according to their `entity_attributes`. In the example below, the check executes for all entities with entity class `proxy` and the custom proxy type label `website`. Proxy requests are a great way to reuse check definitions for a group of entities. For more information, see the [proxy requests specification][10] and the [guide to monitoring external resources][28].
required     | false
type         | Hash
example      | {{< highlight shell >}}"proxy_requests": {
  "entity_attributes": [
    "entity.entity_class == 'proxy'",
    "entity.labels.proxy_type == 'website'"
  ],
  "splay": true,
  "splay_coverage": 90
}{{< /highlight >}}

|silenced    |      |
-------------|------
description  | If the event is to be silenced.
type         | boolean
example      | {{< highlight shell >}}"silenced": false{{< /highlight >}}

|env_vars    |      |
-------------|------
description  | An array of environment variables to use with command execution. _NOTE: To add `env_vars` to a check, use [`sensuctl create`][create]._
required     | false
type         | Array
example      | {{< highlight shell >}}"env_vars": ["RUBY_VERSION=2.5.0", "CHECK_HOST=my.host.internal"]{{< /highlight >}}

|output_metric_format    |      |
-------------|------
description  | The metric format generated by the check command. Sensu supports the following metric formats: <br>`nagios_perfdata` ([Nagios Performance Data][nagios]) <br>`graphite_plaintext` ([Graphite Plaintext Protocol][graphite]) <br>`influxdb_line` ([InfluxDB Line Protocol][influx]) <br>`opentsdb_line` ([OpenTSDB Data Specification][open])<br><br>When a check includes an `output_metric_format`, Sensu will extract the metrics from the check output and add them to the event data in [Sensu metric format][sensu-metric-format]. For more information about extracting metrics using Sensu, see the [guide][23]. 
required     | false
type         | String
example      | {{< highlight shell >}}"output_metric_format": "graphite_plaintext"{{< /highlight >}}

|output_metric_handlers    |      |
-------------|------
description  | An array of Sensu handlers to use for events created by the check. Each array item must be a string. `output_metric_handlers` should be used in place of the `handlers` attribute if `output_metric_format` is configured. Metric handlers must be able to process [Sensu metric format][sensu-metric-format]. For an example, see the [Sensu InfluxDB handler](https://github.com/sensu/sensu-influxdb-handler).
required     | false
type         | Array
example      | {{< highlight shell >}}"output_metric_handlers": ["influx-db"]{{< /highlight >}}

|round_robin |      |
-------------|------
description  | When set to `true`, Sensu executes the check once per interval, cycling through each subscribing agent in turn. See the [round robin section](#round-robin-checks) for more information.<br><br>You can use the `round_robin` attribute with the `proxy_requests` attributes to distribute proxy check executions evenly across multiple agents. See the section on [using a proxy check to monitor a multiple proxy entities](#using-a-proxy-check-to-monitor-a-multiple-proxy-entities) for more information.
required     | false
type         | Boolean
example      | {{< highlight shell >}}"round_robin": true{{< /highlight >}}

|subdue      |      |
-------------|------
description  | Check subdues are not yet implemented in Sensu Go. Although the `subdue` attribute appears in check definitions by default, it is a placeholder and should not be modified.
example      | {{< highlight shell >}}"subdue": null{{< /highlight >}}

### Metadata attributes

| name       |      |
-------------|------
description  | A unique string used to identify the check. Check names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2)). Each check must have a unique name within its namespace.
required     | true
type         | String
example      | {{< highlight shell >}}"name": "check-cpu"{{< /highlight >}}

| namespace  |      |
-------------|------
description  | The Sensu [RBAC namespace][26] that this check belongs to.
required     | false
type         | String
default      | `default`
example      | {{< highlight shell >}}"namespace": "production"{{< /highlight >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with event data, which can be queried like regular attributes. You can use labels to organize checks into meaningful collections that can be selected using [filters][27] and [tokens][5].
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores, but must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}}"labels": {
  "environment": "development",
  "region": "us-west-2"
}{{< /highlight >}}

| annotations |     |
-------------|------
description  | Arbitrary, non-identifying metadata to include with event data. In contrast to labels, annotations are _not_ used internally by Sensu and cannot be used to identify checks. You can use annotations to add data that helps people or external tools interacting with Sensu.
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}} "annotations": {
  "managed-by": "ops",
  "slack-channel": "#monitoring",
  "playbook": "www.example.url"
}{{< /highlight >}}

### Proxy requests attributes

|entity_attributes| |
-------------|------
description  | Sensu entity attributes to match entities in the registry, using [Sensu Query Expressions][11]
required     | false
type         | Array
example      | {{< highlight shell >}}"entity_attributes": [
  "entity.entity_class == 'proxy'",
  "entity.labels.proxy_type == 'website'"
]{{< /highlight >}}

|splay       |      |
-------------|------
description  | If proxy check requests should be splayed, published evenly over a window of time, determined by the check interval and a configurable splay coverage percentage. For example, if a check has an interval of `60` seconds and a configured splay coverage of `90`%, its proxy check requests would be splayed evenly over a time window of `60` seconds * `90`%, `54` seconds, leaving `6`s for the last proxy check execution before the the next round of proxy check requests for the same check.
required     | false
type         | Boolean
default      | false
example      | {{< highlight shell >}}"splay": true{{< /highlight >}}

|splay_coverage  | |
-------------|------
description  | The **percentage** of the check interval over which Sensu can execute the check for all applicable entities, as defined in the entity attributes. Sensu uses the splay coverage attribute to determine the amount of time check requests can be published over (before the next check interval).
required     | required if `splay` attribute is set to `true`
type         | Integer
example      | {{< highlight shell >}}"splay_coverage": 90{{< /highlight >}}

### Check output truncation attributes

|max_output_size  | |
-------------|-------
description  | Maximum size, in bytes, of stored check outputs. When this attribute is set to a non-zero value, the Sensu backend truncates check outputs larger than this value before storing to etcd. `max_output_size` does not affect data sent to Sensu filters, mutators, and handlers.
required     | false
type         | Integer
example      | {{< highlight shell >}}"max_output_size": 1024{{< /highlight >}}

|discard_output  | |
-------------|------
description  | Discard check output after extracting metrics. No check output will be sent to the Sensu backend.
required     | false
type         | Boolean
example      | {{< highlight shell >}}"discard_output": true{{< /highlight >}}

## Examples

### Minimum recommended check attributes

_NOTE: The attribute `interval` is not required if a valid `cron` schedule is defined._

{{< highlight json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "namespace": "default",
    "name": "check_minimum"
  },
  "spec": {
    "command": "collect.sh",
    "subscriptions": [
      "system"
    ],
    "handlers": [
      "slack"
    ],
    "interval": 10,
    "publish": true
  }
}
{{< /highlight >}}

### Metric check

{{< highlight json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "collect-metrics",
    "namespace": "default",
    "labels": {
      "region": "us-west-1"
    },
    "annotations": {
      "slack-channel" : "#monitoring"
    }
  },
  "spec": {
    "command": "collect.sh",
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 10,
    "low_flap_threshold": 0,
    "publish": true,
    "runtime_assets": null,
    "subscriptions": [
      "system"
    ],
    "proxy_entity_name": "",
    "check_hooks": null,
    "stdin": false,
    "ttl": 0,
    "timeout": 0,
    "round_robin": false,
    "output_metric_format": "graphite_plaintext",
    "output_metric_handlers": [
      "influx-db"
    ],
    "env_vars": null,
    "discard_output": true
  }
}
{{< /highlight >}}

[1]: #subscription-checks
[2]: https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
[3]: https://en.wikipedia.org/wiki/Standard_streams
[4]: #check-commands
[5]: ../tokens
[6]: ../hooks/
[7]: /sensu-core/latest/reference/checks/#standalone-checks
[8]: ../rbac
[9]: ../assets
[10]: #proxy-requests-attributes
[11]: ../sensu-query-expressions
[13]: #check-attributes
[14]: https://en.wikipedia.org/wiki/Cron#CRON_expression
[15]: https://godoc.org/github.com/robfig/cron#hdr-Predefined_schedules
[16]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/flapping.html
[17]: #subdue-attributes
[20]: ../entities/#proxy_entities
[21]: ../entities/#spec-attributes
[22]: ../../reference/sensuctl/#time-windows
[22]: ../../reference/sensuctl/#time-windows
[23]: ../../guides/extract-metrics-with-checks/
[24]: ../events
[nagios]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/perfdata.html
[graphite]: http://graphite.readthedocs.io/en/latest/feeding-carbon.html#the-plaintext-protocol
[influx]: https://docs.influxdata.com/influxdb/v1.4/write_protocols/line_protocol_tutorial/#measurement
[open]: http://opentsdb.net/docs/build/html/user_guide/writing/index.html#data-specification
[sensu-metric-format]: ../../reference/events/#metrics
[create]: ../../sensuctl/reference#create
[25]: #metadata-attributes
[26]: ../rbac#namespaces
[27]: ../filters
[sc]: ../../sensuctl/reference#creating-resources
[sp]: #spec-attributes
[25]: https://bonsai.sensu.io
[28]: ../../guides/install-check-executables-with-assets
