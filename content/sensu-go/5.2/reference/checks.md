---
title: "Checks"
description: "The checks reference guide."
weight: 10
version: "5.2"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.2:
    parent: reference
---

- [Check commands](#check-commands)
- [Check scheduling](#check-scheduling)
- [Check result specification](#check-result-specification)
- [Token substitution](#check-token-substitution)
- [Hooks](#check-hooks)
- [Proxy requests](#proxy-requests)
- [Specification](#check-specification)
- [Examples](#examples)

## How do checks work?

### Check commands

Each Sensu check definition defines a **command** and the **interval** at which
it should be executed. Check commands are literally executable commands which
will be executed on the Sensu agent.

A command may include command line arguments for controlling the behavior of the
command executable. Most Sensu check plugins provide support for command line
arguments for reusability.

#### How and where are check commands executed?

All check commands are executed by Sensu agents as the `sensu` user. Commands
must be executable files that are discoverable on the Sensu agent system (ex:
installed in a system `$PATH` directory).

### Check scheduling

Checks are exclusively scheduled by the Sensu backend, which schedules and
publishes check execution requests to entities via a [Publish/Subscribe
model][2].

Checks have a defined set of subscribers, a list of transport
topics that check requests will be published to. Sensu entities become
subscribers to these topics (called subscriptions) via their individual
subscriptions attribute. In practice, subscriptions will typically correspond to
a specific role and/or responsibility (ex: a webserver or database).

Subscriptions are a powerful primitives in the monitoring context because they
allow you to effectively monitor for specific behaviors or characteristics
corresponding to the function being provided by a particular system. For
example, disk capacity thresholds might be more important (or at least
different) on a database server as opposed to a webserver; conversely, CPU
and/or memory usage thresholds might be more important on a caching system than
on a file server. Subscriptions also allow you to configure check requests for
an entire group or subgroup of systems rather than require a traditional 1:1
mapping.

Checks can be scheduled in an interval or cron fashion. It's important to note
that for interval checks, an initial offset is calculated to splay the check's
_first_ scheduled request. This helps to balance the load of both the backend
and the agent, and may result in a delay before initial check execution.

### Check result specification

Although the Sensu agent will attempt to execute any
command defined for a check, successful processing of check results requires
adherence to a simple specification.

- Result data is output to [STDOUT or STDERR][3]
    - For standard checks this output is typically a human-readable message
    - For metrics checks this output contains the measurements gathered by the
      check
- Exit status code indicates state
    - `0` indicates “OK”
    - `1` indicates “WARNING”
    - `2` indicates “CRITICAL”
    - exit status codes other than `0`, `1`, or `2` indicate an “UNKNOWN” or
      custom status

_PRO TIP: Those familiar with the **Nagios** monitoring
system may recognize this specification, as it is the same one used by Nagios
plugins. As a result, Nagios plugins can be used with Sensu without any
modification._

At every execution of a check command – regardless of success or failure – the
Sensu agent publishes the check’s result for eventual handling by the **event
processor** (the Sensu backend).

### Check token substitution

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

### Check hooks

Check hooks are commands run by the Sensu agent in response to the result of
check command execution. The Sensu agent will execute the appropriate configured
hook command, depending on the check execution status (ex: 0, 1, 2).

Learn how to use check hooks with the [Sensu hooks reference
documentation][6].

### Proxy requests

Sensu supports running checks where the results are considered to be for an
entity that isn’t actually the one executing the check, regardless of whether
that entity is a Sensu agent entity or a **proxy entity**.
Proxy entities allow Sensu to monitor external resources
on systems or devices where a Sensu agent cannot be installed, like a
network switch or a website.

By specifying the [proxy_requests attributes](#proxy-requests-top-level) in a check, Sensu runs the check
for each entity that matches certain definitions specified in the `entity_attributes`.
The attributes supplied must match exactly as stated; no variables or directives have
any special meaning, but you can still use [Sensu query expressions][11] to
perform more complicated filtering on the available value, such as finding
entities with particular subscriptions.

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
description  | Top-level attribute specifying the Sensu API group and version. For checks in Sensu backend version 5.2, this attribute should always be `core/v2`.
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
required     | true (unless `publish` is `false` or `cron` is configured)
type         | Integer
example      | {{< highlight shell >}}"interval": 60{{< /highlight >}}

|cron        |      |
-------------|------
description  | When the check should be executed, using the [Cron syntax][14] or [these predefined schedules][15].
required     | true (unless `publish` is `false` or `interval` is configured)
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
description  | Round-robin check subscriptions are not yet implemented in Sensu Go. Although the `round_robin` attribute appears in check definitions by default, it is a placeholder and should not be modified.
example      | {{< highlight shell >}}"round_robin": false{{< /highlight >}}

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
description  | Maximum output size, in bytes, that stored check outputs will have. When set to a non-zero value, check output will be truncated before being stored to etcd, if the output size is larger than this value. Filters, handlers, and mutators will still get access to the full check output.
required     | false
type         | Integer
example      | {{< highlight shell >}}"max_output_size": 1024{{< /highlight >}}

|discard_output  | |
-------------|------
description  | Discard check output after extracting metrics on the agent. No check output will be sent to the backend.
required     | false
type         | Boolean
example      | {{< highlight shell >}}"discard_output": true{{< /highlight >}}

## Examples

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
[12]: /sensu-core/latest/reference/clients/#round-robin-client-subscriptions
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
