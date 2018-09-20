---
title: "Checks"
description: "The checks reference guide."
weight: 1
version: "2.0"
product: "Sensu Core"
platformContent: false
menu:
  sensu-core-2.0:
    parent: reference
---

- [Check commands](#check-commands)
- [Check scheduling](#check-scheduling)
- [Check result specification](#check-result-specification)
- [Token substitution](#check-token-substitution)
- [Hooks](#check-hooks)
- [Proxy requests](#proxy-requests)
- [New and improved checks](#new-and-improved-checks)
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
and the agent.

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
entity that isn’t actually the one executing the check- regardless of whether
that entity is a Sensu agent's entity or simply a **proxy entity**. There are a
number of reasons for this use case, but fundamentally, Sensu handles it the
same.

Checks are normally scheduled, but by specifying the [proxy_requests
attribute][10] in your check, entities that match certain definitions (their
`entity_attributes`) cause the check to run for each one. The attributes
supplied must normally match exactly as stated- no variables or directives have
any special meaning, but you can still use [Sensu query expressions][11] to
perform more complicated filtering on the available value, such as finding
entities with particular subscriptions.

## New and improved checks

Here is some useful information for Sensu 1 users around modifications made to
checks in Sensu 2.

### Standalone checks

Standalone checks, which are checks scheduled and executed by the monitoring
agent in [Sensu 1][7], are effectively replaced by the [Role-base access control
(RBAC)][8], [agent's entity subscription][21] and [Sensu assets][9] features.

### Reusable check hooks

[Sensu check hooks][6] are now a distinct resource and are created and managed
independently of the check configuration.

### Round-robin checks

Round-robin checks, which allow checks to be executed on a single entity within
a subscription in a round-robin fashion, were configured via the client
subscriptions in [Sensu 1][12]. Prepending `roundrobin:` in front of
subscriptions is no longer required in Sensu 2 since round-robin can now be
enabled directly with the [round_robin][13] attribute in the check configuration.

## Check specification

### Check naming

Each check definition must have a unique name within its organization and
environment.

* A unique string used to name/identify the check
* Cannot contain special characters or spaces
* Validated with Go regex [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2)

### Check attributes

|command     |      |
-------------|------
description  | The check command to be executed.
required     | true
type         | String
example      | {{< highlight shell >}}"command": "/etc/sensu/plugins/check-chef-client.rb"{{< /highlight >}}

|subscriptions|     |
-------------|------
description  | An array of Sensu entity subscriptions that check requests will be sent to. The array cannot be empty and its items must each be a string.
required     | true
type         | Array
example      | {{< highlight shell >}}"subscriptions": ["production"]{{< /highlight >}}

|handlers    |      |
-------------|------
description  | An array of Sensu event handlers (names) to use for events created by the check. Each array item must be a string.
required     | true
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

|check_hooks |      |
-------------|------
description  | An array of [Sensu hooks][6] (names), which are commands run by the Sensu agent in response to the result of the check command execution.
required     | false
type         | Array
example      | {{< highlight shell >}}"check_hooks": ["nginx_restart"]{{< /highlight >}}

|subdue      |      |
-------------|------
description  | A [Sensu subdue][17], a hash of days of the week, which define one or more time windows in which the check is not scheduled to be executed.
required     | false
type         | Hash
example      | {{< highlight shell >}}"subdue": {}{{< /highlight >}}

|proxy_entity_id|   |
-------------|------
description  | The check ID, used to create a [proxy entity][18] for an external resource (i.e., a network switch).
required     | false
type         | String
validated    | [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2)
example      | {{< highlight shell >}}"proxy_entity_id": "switch-dc-01"{{< /highlight >}}

|proxy_requests|    |
-------------|------
description  | A [Sensu Proxy Requests][10], representing Sensu entity attributes to match entities in the registry.
required     | false
type         | Hash
example      | {{< highlight shell >}}"proxy_requests": {}{{< /highlight >}}

|round_robin |      |
-------------|------
description  | If the check should be executed on a single entity within a subscription in a [round-robin fashion][19].
required     | false
type         | Boolean
example      | {{< highlight shell >}}"round_robin": false{{< /highlight >}}

|extended_attributes|      |
-------------|------
description  | Custom attributes to include with the event data, which can be queried like regular attributes.
required     | false
type         | Serialized JSON object
example      | {{< highlight shell >}}"{\"team\":\"ops\"}"{{< /highlight >}}

|organization|      |
-------------|------
description  | The Sensu RBAC organization that this check belongs to.
required     | false
type         | String
example      | {{< highlight shell >}}
  "organization": "default"
{{< /highlight >}}

|environment |      |
-------------|------
description  | The Sensu RBAC environment that this check belongs to.
required     | false
type         | String
default      | current environment value configured for `sensuctl` (ie `default`)
example      | {{< highlight shell >}}
  "environment": "default"
{{< /highlight >}}

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
description  | An array of Sensu handlers to use for events created by the check. Each array item must be a string. `output_metric_handlers` should be used in place of the `handlers` attribute if `output_metric_format` is configured. Metric handlers must be able to process [Sensu metric format][sensu-metric-format]. For an example, see the [Sensu InfluxDB handler](https://github.com/nikkiki/sensu-influxdb-handler).
required     | false
type         | Array
example      | {{< highlight shell >}}"output_metric_handlers": ["influx-db"]{{< /highlight >}}

### Proxy requests attributes

|entity_attributes| |
-------------|------
description  | Sensu entity attributes to match entities in the registry, using [Sensu Query Expressions][20]
required     | false
type         | Array
default      | current environment value configured for `sensuctl` (ie `default`)
example      | {{< highlight shell >}}"entity_attributes": ["entity.Class == 'proxy'"]{{< /highlight >}}

|splay       |      |
-------------|------
description  | If proxy check requests should be splayed, published evenly over a window of time, determined by the check interval and a configurable splay coverage percentage. For example, if a check has an interval of `60` seconds and a configured splay coverage of `90`%, its proxy check requests would be splayed evenly over a time window of `60` seconds * `90`%, `54` seconds, leaving `6`s for the last proxy check execution before the the next round of proxy check requests for the same check.
required     | false
type         | Boolean
default      | false
example      | {{< highlight shell >}}"splay": true{{< /highlight >}}

|splay_coverage  | |
-------------|------
description  | The splay coverage percentage use for proxy check request splay calculation. The splay coverage is used to determine the amount of time check requests can be published over (before the next check interval).
required     | false
type         | Integer
default      | 90
example      | {{< highlight shell >}}"splay_coverage": 65{{< /highlight >}}

### Subdue attributes

|days | |
-------------|------
description  | A hash of days of the week or `all`, each day specified must define one or more time windows in which the check is not scheduled to be executed. See the [sensuctl documentation][22] for the supported time formats.
required     | false (unless `subdue` is configured)
type         | Hash
example      | {{< highlight shell >}}"days": {
  "all": [
    {
      "begin": "17:00 UTC",
      "end": "08:00 UTC"
    }
  ],
  "friday": [
    {
      "begin": "12:00 UTC",
      "end": "17:00 UTC"
    }
  ]
}}{{< /highlight >}}

## Examples

### Metric check

{{< highlight json >}}
{
  "type": "CheckConfig",
  "spec": {
    "name": "collect-metrics",
    "environment": "default",
    "organization": "default",
    "subscriptions": [
      "system"
    ],
    "command": "collect.sh",
    "interval": 10,
    "publish": true,
    "output_metric_format": "graphite_plaintext",
    "output_metric_handlers": ["influx-db"]
  }
}{{< /highlight >}}

[1]: #subscription-checks
[2]: https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
[3]: https://en.wikipedia.org/wiki/Standard_streams
[4]: #check-commands
[5]: ../tokens
[6]: ../hooks/
[7]: ../../../1.2/reference/checks/#standalone-checks
[8]: ../rbac
[9]: ../assets
[10]: #proxy-requests-attributes
[11]: #
[12]: ../../../1.2/reference/clients/#round-robin-client-subscriptions
[13]: #check-attributes
[14]: https://en.wikipedia.org/wiki/Cron#CRON_expression
[15]: https://godoc.org/github.com/robfig/cron#hdr-Predefined_schedules
[16]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/flapping.html
[17]: #subdue-attributes
[18]: #
[19]: #round-robin-checks
[20]: #../entities/#proxy_entities
[21]: #../entities/#entity_attributes
[22]: ../../reference/sensuctl/#time-windows
[22]: ../../reference/sensuctl/#time-windows
[23]: ../../guides/extract-metrics-with-checks/
[24]: ../events
[nagios]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/perfdata.html
[graphite]: http://graphite.readthedocs.io/en/latest/feeding-carbon.html#the-plaintext-protocol
[influx]: https://docs.influxdata.com/influxdb/v1.4/write_protocols/line_protocol_tutorial/#measurement
[open]: http://opentsdb.net/docs/build/html/user_guide/writing.html#data-specification
[sensu-metric-format]: ../../reference/events/#metrics
