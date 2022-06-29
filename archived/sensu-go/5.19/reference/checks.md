---
title: "Checks"
reference_title: "Checks"
type: "reference"
description: "Checks work with Sensu agents to let you monitor your infrastructure automatically and send monitoring events to the Sensu pipeline. Read this reference doc to learn how to run service and metric checks."
weight: 50
version: "5.19"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.19:
    parent: reference
---

Checks work with Sensu agents to produce monitoring events automatically.
You can use checks to monitor server resources, services, and application health as well as collect and analyze metrics.
Read [Monitor server resources][12] to get started.
Use [Bonsai][29], the Sensu asset index, to discover, download, and share Sensu check assets.

## Check commands

Each Sensu check definition specifies a command and the schedule at which it should be executed.
Check commands are executable commands that the Sensu agent executes.

A command may include command line arguments for controlling the behavior of the command executable.
Many common checks are available as assets from [Bonsai][29] and support command line arguments so different check definitions can use the same executable.

{{% notice note %}}
**NOTE**: Sensu advises against requiring root privileges to execute check commands or scripts.
The Sensu user is not permitted to kill timed-out processes invoked by the root user, which could result in zombie processes.
{{% /notice %}}

### Check command execution

All check commands are executed by Sensu agents as the `sensu` user.
Commands must be executable files that are discoverable on the Sensu agent system (for example, installed in a system `$PATH` directory).

## Check result specification

Although Sensu agents attempt to execute any command defined for a check, successful check result processing requires adherence to a simple specification.

- Result data is output to [STDOUT or STDERR][3].
    - For service checks, this output is typically a human-readable message.
    - For metric checks, this output contains the measurements gathered by the
      check.
- Exit status code indicates state.
    - `0` indicates OK.
    - `1` indicates WARNING.
    - `2` indicates CRITICAL.
    - Exit status codes other than `0`, `1`, and `2` indicate an UNKNOWN or custom status

{{% notice protip %}}
**PRO TIP**: If you're familiar with the **Nagios** monitoring system, you may recognize this specification &mdash; it is the same one that Nagios plugins use. As a result, you can use Nagios plugins with Sensu without any modification.
{{% /notice %}}

At every execution of a check command, regardless of success or failure, the Sensu agent publishes the check’s result for eventual handling by the **event processor** (the Sensu backend).

## Check scheduling

The Sensu backend schedules checks and publishes check execution requests to entities via a [publish-subscribe model][2].

### Subscriptions

Checks have a defined set of subscriptions: transport topics to which the Sensu backend publishes check requests.
Sensu entities become subscribers to these topics (called subscriptions) via their individual `subscriptions` attribute. 
Subscriptions typically correspond to a specific role or responsibility (for example. a webserver or database).

Subscriptions are powerful primitives in the monitoring context because they allow you to effectively monitor for specific behaviors or characteristics that correspond to the function provided by a particular system.
For example, disk capacity thresholds might be more important (or at least different) on a database server than on a webserver.
Conversely, CPU or memory usage thresholds might be more important on a caching system than on a file server.

Subscriptions also allow you to configure check requests for an entire group or subgroup of systems rather than requiring a traditional one-to-one mapping.

To configure subscriptions for a check, use the `subscriptions` attribute to specify an array of one or more subscription names.
Sensu schedules checks once per interval for each agent with a matching subscription.
For example, if we have three agents configured with the `system` subscription, a check configured with the `system` subscription results in three monitoring events per interval: one check execution per agent per interval.
For Sensu to execute a check, the check definition must include a subscription that matches the subscription of at least one Sensu agent.

#### Round robin checks

By default, Sensu schedules checks once per interval for each agent with a matching subscription: one check execution per agent per interval.
Sensu also supports deduplicated check execution when configured with the `round_robin` check attribute.
For checks with `round_robin` set to `true`, Sensu executes the check once per interval, cycling through the available agents alphabetically according to agent name.

For example, for three agents configured with the `system` subscription (agents A, B, and C), a check configured with the `system` subscription and `round_robin` set to `true` results in one monitoring event per interval, with the agent creating the event following the pattern A -> B -> C -> A -> B -> C for the first six intervals.

{{< figure src="/images/go/checks_reference/round_robin_diagram.png" alt="Round robin check diagram" link="/images/go/checks_reference/round_robin_diagram.png" target="_blank" >}}
<!-- Diagram source: https://www.lucidchart.com/documents/edit/41787f16-3457-49d9-9135-efc69b0e2b50 -->

In the diagram above, the standard check is executed by agents A, B, and C every 60 seconds.
The round robin check cycles through the available agents, resulting in each agent executing the check every 180 seconds.

To use check [`ttl`][31] and `round_robin` together, your check configuration must also specify a [`proxy_entity_name`][32].
If you do not specify a `proxy_entity_name` when using check `ttl` and `round_robin` together, your check will stop executing.

{{% notice protip %}}
**PRO TIP**: Use round robin to distribute check execution workload across multiple agents when using [proxy checks](#proxy-checks).
{{% /notice %}}

### Scheduling

You can schedule checks using the `interval`, `cron`, and `publish` attributes.
Sensu requires that checks include either an `interval` attribute (interval scheduling) or a `cron` attribute (cron scheduling).

#### Interval scheduling

You can schedule a check to be executed at regular intervals using the `interval` and `publish` check attributes.
For example, to schedule a check to execute every 60 seconds, set the `interval` attribute to `60` and the `publish` attribute to `true`.

{{% notice note %}}
**NOTE**: When creating an interval check, Sensu calculates an initial offset to splay the check's first scheduled request.
This helps balance the load of both the backend and the agent and may result in a delay before initial check execution.
{{% /notice %}}

**Example interval check**

{{< language-toggle >}}

{{< code yml >}}
type: CheckConfig
api_version: core/v2
metadata:
  name: interval_check
  namespace: default
spec:
  command: check-cpu.sh -w 75 -c 90
  handlers:
  - slack
  interval: 60
  publish: true
  subscriptions:
  - system
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

#### Cron scheduling

You can also schedule checks using [cron syntax][14].

Examples of valid cron values include:

- `cron: CRON_TZ=Asia/Tokyo * * * * *`
- `cron: TZ=Asia/Tokyo * * * * *`
- `cron: '* * * * *'`

{{% notice note %}}
**NOTE**: If you're using YAML to create a check that uses cron scheduling and the first character of the cron schedule is an asterisk (`*`), place the entire cron schedule inside single or double quotes (e.g. `cron: '* * * * *'`).
{{% /notice %}}

**Example cron checks**

To schedule a check to execute once a minute at the start of the minute, set the `cron` attribute to `* * * * *` and the `publish` attribute to `true`:

{{< language-toggle >}}

{{< code yml >}}
type: CheckConfig
api_version: core/v2
metadata:
  name: cron_check
  namespace: default
spec:
  command: check-cpu.sh -w 75 -c 90
  cron: '* * * * *'
  handlers:
  - slack
  publish: true
  subscriptions:
  - system
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}


Use a prefix of `TZ=` or `CRON_TZ=` to set a [timezone][30] for the `cron` attribute:

{{< language-toggle >}}

{{< code yml >}}
type: CheckConfig
api_version: core/v2
metadata:
  name: cron_check
  namespace: default
spec:
  check_hooks: null
  command: hi
  cron: CRON_TZ=Asia/Tokyo * * * * *
  env_vars: null
  handlers: []
  high_flap_threshold: 0
  interval: 0
  low_flap_threshold: 0
  output_metric_format: ""
  output_metric_handlers: null
  proxy_entity_name: ""
  publish: true
  round_robin: false
  runtime_assets: null
  stdin: false
  subdue: null
  subscriptions:
  - sys
  timeout: 0
  ttl: 0
{{< /code >}}

{{< code json >}}
{
   "type": "CheckConfig",
   "api_version": "core/v2",
   "metadata": {
      "name": "cron_check",
      "namespace": "default"
   },
   "spec": {
      "check_hooks": null,
      "command": "hi",
      "cron": "CRON_TZ=Asia/Tokyo * * * * *",
      "env_vars": null,
      "handlers": [],
      "high_flap_threshold": 0,
      "interval": 0,
      "low_flap_threshold": 0,
      "output_metric_format": "",
      "output_metric_handlers": null,
      "proxy_entity_name": "",
      "publish": true,
      "round_robin": false,
      "runtime_assets": null,
      "stdin": false,
      "subdue": null,
      "subscriptions": [
         "sys"
      ],
      "timeout": 0,
      "ttl": 0
   }
}
{{< /code >}}

{{< /language-toggle >}}

#### Ad hoc scheduling

In addition to automatic execution, you can create checks to be scheduled manually using the [checks API][34].
To create a check with ad-hoc scheduling, set the `publish` attribute to `false` in addition to an `interval` or `cron` schedule.

**Example ad hoc check**

{{< language-toggle >}}

{{< code yml >}}
type: CheckConfig
api_version: core/v2
metadata:
  name: ad_hoc_check
  namespace: default
spec:
  command: check-cpu.sh -w 75 -c 90
  handlers:
  - slack
  interval: 60
  publish: false
  subscriptions:
  - system
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

## Proxy checks

Sensu supports running proxy checks where the results are considered to be for an entity that isn’t actually the one executing the check, regardless of whether that entity is a Sensu agent entity or a proxy entity.
Proxy entities allow Sensu to monitor external resources on systems and devices where a Sensu agent cannot be installed, like a network switch or a website.
You can create a proxy check using the [`proxy_entity_name` attribute][35] or the [`proxy_requests` attributes][36].

### Use a proxy check to monitor a proxy entity

When executing checks that include a `proxy_entity_name`, Sensu agents report the resulting events under the specified proxy entity instead of the agent entity.
If the proxy entity doesn't exist, Sensu creates the proxy entity when the event is received by the backend.
To avoid duplicate events, we recommend using the `round_robin` attribute with proxy checks.

**Example proxy check using a `proxy_entity_name`**

The following proxy check runs every 60 seconds, cycling through the agents with the `proxy` subscription alphabetically according to the agent name, for the proxy entity `sensu-site`.

{{< language-toggle >}}

{{< code yml >}}
type: CheckConfig
api_version: core/v2
metadata:
  name: proxy_check
  namespace: default
spec:
  command: http_check.sh https://sensu.io
  handlers:
  - slack
  interval: 60
  proxy_entity_name: sensu-site
  publish: true
  round_robin: true
  subscriptions:
  - proxy
{{< /code >}}

{{< code json >}}
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
    "round_robin": true,
    "proxy_entity_name": "sensu-site"
  }
}
{{< /code >}}

{{< /language-toggle >}}

### Use a proxy check to monitor multiple proxy entities

The [`proxy_requests` check attributes][37] allow Sensu to run a check for each entity that matches the definitions specified in the `entity_attributes`, resulting in monitoring events that represent each matching proxy entity.
The entity attributes must match exactly as stated.
No variables or directives have any special meaning, but you can still use [Sensu query expressions][11] to perform more complicated filtering on the available value, such as finding entities with particular subscriptions.

The `proxy_requests` attributes are a great way to monitor multiple entities using a single check definition when combined with [token substitution][39].
Because checks that include `proxy_requests` attributes need to be executed for each matching entity, we recommend using the `round_robin` attribute to distribute the check execution workload evenly across your Sensu agents.

**Example proxy check using `proxy_requests`**

The following proxy check runs every 60 seconds, cycling through the agents with the `proxy` subscription alphabetically according to the agent name, for all existing proxy entities with the custom label `proxy_type` set to `website`.

This check uses [token substitution][39] to import the value of the custom entity label `url` to complete the check command.
See the [entity reference][40] for information about using custom labels.

{{< language-toggle >}}

{{< code yml >}}
type: CheckConfig
api_version: core/v2
metadata:
  name: proxy_check_proxy_requests
  namespace: default
spec:
  command: http_check.sh {{ .labels.url }}
  handlers:
  - slack
  interval: 60
  proxy_requests:
    entity_attributes:
    - entity.labels.proxy_type == 'website'
  publish: true
  round_robin: true
  subscriptions:
  - proxy
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

#### Fine-tune proxy check scheduling with splay

Sensu supports distributing proxy check executions across an interval using the `splay` and `splay_coverage` attributes.
For example, if you assume that the `proxy_check_proxy_requests` check in the example above matches three proxy entities, you'd expect to see a burst of three events every 60 seconds.
If you add the `splay` attribute (set to `true`) and the `splay_coverage` attribute (set to `90`) to the `proxy_requests` scope, Sensu will distribute the three check executions over 90% of the 60-second interval, resulting in three events splayed evenly across a 54-second period.

## Check token substitution

Sensu check definitions may include attributes that you  wish to override on an entity-by-entity basis.
For example, [check commands][4], which may include command line arguments for controlling the behavior of the check command, may benefit from entity-specific thresholds.
Sensu check tokens are check definition placeholders that the Sensu agent will replace with the corresponding entity definition attribute values (including custom attributes).

Learn how to use check tokens with the [Sensu tokens reference documentation][5].

{{% notice note %}}
**NOTE**: Check tokens are processed before check execution, so token substitutions will not apply to check data delivered via the local agent socket input.
{{% /notice %}}

## Check hooks

Check hooks are commands run by the Sensu agent in response to the result of check command execution. The Sensu agent will execute the appropriate configured hook command, depending on the check execution status (e.g. `0`, `1`, or `2`).

Learn how to use check hooks with the [Sensu hooks reference documentation][6].

## Check specification

{{% notice note %}}
**NOTE**: In Sensu Go, the `occurrences` attribute is not part of the check definition like it was in Sensu Core.
{{% /notice %}}

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][41] resource type. Checks should always be type `CheckConfig`.
required     | Required for check definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][41].
type         | String
example      | {{< code shell >}}"type": "CheckConfig"{{< /code >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For checks in Sensu backend version 5.4 and later, this attribute should always be `core/v2`.
required     | Required for check definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][41].
type         | String
example      | {{< code shell >}}"api_version": "core/v2"{{< /code >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the check, including `name`, `namespace`, and `created_by` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the check definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. See [metadata attributes][25] for details.
required     | Required for check definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][41].
type         | Map of key-value pairs
example      | {{< code shell >}}"metadata": {
  "name": "collect-metrics",
  "namespace": "default",
  "created_by": "admin",
  "labels": {
    "region": "us-west-1"
  },
  "annotations": {
    "slack-channel" : "#monitoring"
  }
}{{< /code >}}

spec         | 
-------------|------
description  | Top-level map that includes the check [spec attributes][42].
required     | Required for check definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][41].
type         | Map of key-value pairs
example      | {{< code shell >}}"spec": {
  "command": "/etc/sensu/plugins/check-chef-client.go",
  "interval": 10,
  "publish": true,
  "subscriptions": [
    "production"
  ]
}{{< /code >}}

### Metadata attributes

| name       |      |
-------------|------
description  | Unique string used to identify the check. Check names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][53]). Each check must have a unique name within its namespace.
required     | true
type         | String
example      | {{< code shell >}}"name": "check-cpu"{{< /code >}}

| namespace  |      |
-------------|------
description  | [Sensu RBAC namespace][26] that the check belongs to.
required     | false
type         | String
default      | `default`
example      | {{< code shell >}}"namespace": "production"{{< /code >}}

| created_by |      |
-------------|------
description  | Username of the Sensu user who created the check or last updated the check. Sensu automatically populates the `created_by` field when the check is created or updated.
required     | false
type         | String
example      | {{< code shell >}}"created_by": "admin"{{< /code >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with event data that you can use for response and web UI view filtering.<br><br>If you include labels in your event data, you can filter [API responses][54], [sensuctl responses][55], and [web UI views][58] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< code shell >}}"labels": {
  "environment": "development",
  "region": "us-west-2"
}{{< /code >}}

| annotations |     |
-------------|------
description  | Non-identifying metadata to include with event data that you can access with [event filters][27]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][54], [sensuctl response filtering][55], or [web UI views][60].
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< code shell >}}"annotations": {
  "managed-by": "ops",
  "playbook": "www.example.url"
}{{< /code >}}

### Spec attributes

{{% notice note %}}
**NOTE**: Spec attributes are not required when sending an HTTP `POST` request to the [agent](../agent/#events-post) or [backend](../../api/events/#create-a-new-event) /events API.
When doing so, the spec attributes are listed as individual [top-level attributes](#top-level-attributes) in the check definition instead.
{{% /notice %}}

|command     |      |
-------------|------
description  | Check command to be executed.
required     | true
type         | String
example      | {{< code shell >}}"command": "/etc/sensu/plugins/check-chef-client.go"{{< /code >}}

|subscriptions|     |
-------------|------
description  | Array of Sensu entity subscriptions that check requests will be sent to. The array cannot be empty and its items must each be a string.
required     | true
type         | Array
example      | {{< code shell >}}"subscriptions": ["production"]{{< /code >}}

|handlers    |      |
-------------|------
description  | Array of Sensu event handlers (names) to use for events created by the check. Each array item must be a string.
required     | false
type         | Array
example      | {{< code shell >}}"handlers": ["pagerduty", "email"]{{< /code >}}

|interval    |      |
-------------|------
description  | How often the check is executed. In seconds.
required     | true (unless `cron` is configured)
type         | Integer
example      | {{< code shell >}}"interval": 60{{< /code >}}

|cron        |      |
-------------|------
description  | When the check should be executed, using [cron syntax][14] or [these predefined schedules][15]. Use a prefix of `TZ=` or `CRON_TZ=` to set a [timezone][30] for the cron attribute. {{% notice note %}}
**NOTE**: If you're using YAML to create a check that uses cron scheduling and the first character of the cron schedule is an asterisk (`*`), place the entire cron schedule inside single or double quotes (e.g. `cron: '* * * * *'`).
{{% /notice %}}
required     | true (unless `interval` is configured)
type         | String
example      | {{< code shell >}}"cron": "0 0 * * *"{{< /code >}}

|publish     |      |
-------------|------
description  | `true` if check requests are published for the check. Otherwise, `false`.
required     | false
type         | Boolean
default      | `false`
example      | {{< code shell >}}"publish": false{{< /code >}}

|timeout     |      |
-------------|------
description  | Check execution duration timeout (hard stop). In seconds.
required     | false
type         | Integer
example      | {{< code shell >}}"timeout": 30{{< /code >}}

<a name="ttl-attribute"></a>

|ttl         |      |
-------------|------
description  | The time-to-live (TTL) until check results are considered stale. In seconds. If an agent stops publishing results for the check and the TTL expires, an event will be created for the agent's entity.<br><br>The check `ttl` must be greater than the check `interval` and should allow enough time for the check execution and result processing to complete. For example, for a check that has an `interval` of `60` (seconds) and a `timeout` of `30` (seconds), the appropriate `ttl` is at least `90` (seconds).<br><br>To use check `ttl` and [`round_robin`][43] together, your check configuration must also specify a [`proxy_entity_name`][44]. If you do not specify a `proxy_entity_name` when using check `ttl` and `round_robin` together, your check will stop executing. {{% notice note %}}
**NOTE**: Adding TTLs to checks adds overhead, so use the `ttl` attribute sparingly.
{{% /notice %}}
required     | false
type         | Integer
example      | {{< code shell >}}"ttl": 100{{< /code >}}

|stdin       |      |
-------------|------
description  | `true` if the Sensu agent writes JSON serialized Sensu entity and check data to the command process’ STDIN. The command must expect the JSON data via STDIN, read it, and close STDIN. Otherwise, `false`. This attribute cannot be used with existing Sensu check plugins or Nagios plugins because the Sensu agent will wait indefinitely for the check process to read and close STDIN.
required     | false
type         | Boolean
default      | `false`
example      | {{< code shell >}}"stdin": true{{< /code >}}

|low_flap_threshold ||
-------------|------
description  | Flap detection low threshold (% state change) for the check. Sensu uses the same [flap detection algorithm as Nagios][16].
required     | false
type         | Integer
example      | {{< code shell >}}"low_flap_threshold": 20{{< /code >}}

|high_flap_threshold ||
-------------|------
description  | Flap detection high threshold (% state change) for the check. Sensu uses the same [flap detection algorithm as Nagios][16].
required     | true (if `low_flap_threshold` is configured)
type         | Integer
example      | {{< code shell >}}"high_flap_threshold": 60{{< /code >}}

|runtime_assets |   |
-------------|------
description  | Array of [Sensu assets][9] (names). Required at runtime for the execution of the `command`.
required     | false
type         | Array
example      | {{< code shell >}}"runtime_assets": ["ruby-2.5.0"]{{< /code >}}

<a name="check-hooks-attribute"></a>

|check_hooks |      |
-------------|------
description  | Array of check response types with respective arrays of [Sensu hook names][6]. Sensu hooks are commands run by the Sensu agent in response to the result of the check command execution. Hooks are executed in order of precedence based on their severity type: `1` to `255`, `ok`, `warning`, `critical`, `unknown`, and finally `non-zero`.
required     | false
type         | Array
example      | {{< code shell >}}"check_hooks": [
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
]{{< /code >}}

<a name="proxy-entity-name-attribute"></a>

|proxy_entity_name|   |
-------------|------
description  | Entity name. Used to create a [proxy entity][20] for an external resource (e.g. a network switch).
required     | false
type         | String
validated    | [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2)
example      | {{< code shell >}}"proxy_entity_name": "switch-dc-01"{{< /code >}}

<a name="proxy-requests-top-level"></a>

|proxy_requests|    |
-------------|------
description  | Assigns a check to run for multiple entities according to their `entity_attributes`. In the example below, the check executes for all entities with entity class `proxy` and the custom proxy type label `website`. Proxy requests are a great way to reuse check definitions for a group of entities. For more information, see the [proxy requests specification][10] and [Monitor external resources][28].
required     | false
type         | Hash
example      | {{< code shell >}}"proxy_requests": {
  "entity_attributes": [
    "entity.entity_class == 'proxy'",
    "entity.labels.proxy_type == 'website'"
  ],
  "splay": true,
  "splay_coverage": 90
}{{< /code >}}

|silenced    |      |
-------------|------
description  | Silences that apply to the check.
type         | Array
example      | {{< code shell >}}"silenced": ["*:routers"]{{< /code >}}

|env_vars    |      |
-------------|------
description  | Array of environment variables to use with command execution. {{% notice note %}}
**NOTE**: To add `env_vars` to a check, use [`sensuctl create`](../../sensuctl/create-manage-resources/#create-resources).
{{% /notice %}}
required     | false
type         | Array
example      | {{< code shell >}}"env_vars": ["RUBY_VERSION=2.5.0", "CHECK_HOST=my.host.internal"]{{< /code >}}

|output_metric_format    |      |
-------------|------
description  | Metric format generated by the check command. Sensu supports the following metric formats: <br>`nagios_perfdata` ([Nagios Performance Data][46]) <br>`graphite_plaintext` ([Graphite Plaintext Protocol][47]) <br>`influxdb_line` ([InfluxDB Line Protocol][48]) <br>`opentsdb_line` ([OpenTSDB Data Specification][49])<br><br>When a check includes an `output_metric_format`, Sensu will extract the metrics from the check output and add them to the event data in [Sensu metric format][50]. Read [Collect metrics with Sensu checks][23]. 
required     | false
type         | String
example      | {{< code shell >}}"output_metric_format": "graphite_plaintext"{{< /code >}}

|output_metric_handlers    |      |
-------------|------
description  | Array of Sensu handlers to use for events created by the check. Each array item must be a string. Use `output_metric_handlers` in place of the `handlers` attribute if `output_metric_format` is configured. Metric handlers must be able to process [Sensu metric format][50]. For an example, see the [Sensu InfluxDB handler][51].
required     | false
type         | Array
example      | {{< code shell >}}"output_metric_handlers": ["influx-db"]{{< /code >}}

<a name="round-robin-attribute"></a>

|round_robin |      |
-------------|------
description  | When set to `true`, Sensu executes the check once per interval, cycling through each subscribing agent in turn. See [round robin checks][52] for more information.<br><br>Use the `round_robin` attribute with proxy checks to avoid duplicate events and distribute proxy check executions evenly across multiple agents. See [proxy checks][33] for more information.<br><br>To use check [`ttl`][31] and `round_robin` together, your check configuration must also specify a [`proxy_entity_name`][32]. If you do not specify a `proxy_entity_name` when using check `ttl` and `round_robin` together, your check will stop executing.
required     | false
type         | Boolean
default      | `false`
example      | {{< code shell >}}"round_robin": true{{< /code >}}

|subdue      |      |
-------------|------
description  | Check subdues are not yet implemented in Sensu Go. Although the `subdue` attribute appears in check definitions by default, it is a placeholder and should not be modified.
example      | {{< code shell >}}"subdue": null{{< /code >}}

secrets        | 
---------------|------
description    | Array of the name/secret pairs to use with command execution.
required       | false
type           | Array
example        | {{< code shell >}}"secrets": [
  {
    "name": "ANSIBLE_HOST",
    "secret": "sensu-ansible-host"
  },
  {
    "name": "ANSIBLE_TOKEN",
    "secret": "sensu-ansible-token"
  }
]{{< /code >}}

#### Proxy requests attributes

|entity_attributes| |
-------------|------
description  | Sensu entity attributes to match entities in the registry using [Sensu query expressions][11].
required     | false
type         | Array
example      | {{< code shell >}}"entity_attributes": [
  "entity.entity_class == 'proxy'",
  "entity.labels.proxy_type == 'website'"
]{{< /code >}}

|splay       |      |
-------------|------
description  | `true` if proxy check requests should be splayed, published evenly over a window of time, determined by the check interval and a configurable splay coverage percentage. Otherwise, `false`. For example, if a check has an interval of `60` seconds and a configured splay coverage of `90`%, its proxy check requests would be splayed evenly over a time window of `60` seconds * `90`%, `54` seconds, leaving `6`seconds for the last proxy check execution before the the next round of proxy check requests for the same check.
required     | false
type         | Boolean
default      | `false`
example      | {{< code shell >}}"splay": true{{< /code >}}

|splay_coverage  | |
-------------|------
description  | **Percentage** of the check interval over which Sensu can execute the check for all applicable entities, as defined in the entity attributes. Sensu uses the splay coverage attribute to determine the amount of time check requests can be published over (before the next check interval).
required     | Required if `splay` attribute is set to `true`
type         | Integer
example      | {{< code shell >}}"splay_coverage": 90{{< /code >}}

#### Check output truncation attributes

|max_output_size  | |
-------------|-------
description  | Maximum size of stored check outputs. In bytes. When set to a non-zero value, the Sensu backend truncates check outputs larger than this value before storing to etcd. `max_output_size` does not affect data sent to Sensu filters, mutators, and handlers.
required     | false
type         | Integer
example      | {{< code shell >}}"max_output_size": 1024{{< /code >}}

|discard_output  | |
-------------|------
description  | If `true`, discard check output after extracting metrics. No check output will be sent to the Sensu backend. Otherwise, `false`.
required     | false
type         | Boolean
example      | {{< code shell >}}"discard_output": true{{< /code >}}

#### `secrets` attributes

name         | 
-------------|------
description  | Name of the [secret][56] defined in the executable command. Becomes the environment variable presented to the check. See [Use secrets management in Sensu][59] for more information.
required     | true
type         | String
example      | {{< code shell >}}"name": "ANSIBLE_HOST"{{< /code >}}

secret       | 
-------------|------
description  | Name of the Sensu secret resource that defines how to retrieve the [secret][56].
required     | true
type         | String
example      | {{< code shell >}}"secret": "sensu-ansible-host"{{< /code >}}

## Examples

### Minimum recommended check attributes

{{% notice note %}}
**NOTE**: The attribute `interval` is not required if a valid `cron` schedule is defined.
{{% /notice %}}

{{< language-toggle >}}

{{< code yml >}}
type: CheckConfig
api_version: core/v2
metadata:
  name: check_minimum
  namespace: default
spec:
  command: collect.sh
  handlers:
  - slack
  interval: 10
  publish: true
  subscriptions:
  - system
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

### Metric check

{{< language-toggle >}}

{{< code yml >}}
type: CheckConfig
api_version: core/v2
metadata:
  annotations:
    slack-channel: '#monitoring'
  labels:
    region: us-west-1
  name: collect-metrics
  namespace: default
spec:
  check_hooks: null
  command: collect.sh
  discard_output: true
  env_vars: null
  handlers: []
  high_flap_threshold: 0
  interval: 10
  low_flap_threshold: 0
  output_metric_format: graphite_plaintext
  output_metric_handlers:
  - influx-db
  proxy_entity_name: ""
  publish: true
  round_robin: false
  runtime_assets: null
  stdin: false
  subscriptions:
  - system
  timeout: 0
  ttl: 0
{{< /code >}}

{{< code json >}}
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
{{< /code >}}

{{< /language-toggle >}}

### Check with secret

Learn more about [secrets management][59] for your Sensu configuration in the [secrets][56] and [secrets providers][57] references.

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: ping-github-api
  namespace: default
spec:
  check_hooks: null
  command: ping-github-api.sh $GITHUB_TOKEN
  secrets:
  - name: GITHUB_TOKEN
    secret: github-token-vault
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "ping-github-api",
    "namespace": "default"
  },
  "spec": {
    "check_hooks": null,
    "command": "ping-github-api.sh $GITHUB_TOKEN",
    "secrets": [
      {
        "name": "GITHUB_TOKEN",
        "secret": "github-token-vault"
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

### PowerShell script in check commands

If you use a PowerShell script in your check command, make sure to include the `-f` flag in the command.
The `-f` flag ensures that the proper exit code is passed into Sensu.
For example:

{{< language-toggle >}}

{{< code yml >}}
type: CheckConfig
api_version: core/v2
metadata:
  name: interval_test
  namespace: default
spec:
  command: powershell.exe -f c:\\users\\tester\\test.ps1
  subscriptions:
  - system
  handlers:
  - slack
  interval: 60
  publish: true
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "interval_test",
    "namespace": "default"
  },
  "spec": {
    "command": "powershell.exe -f c:\\users\\tester\\test.ps1",
    "subscriptions": ["system"],
    "handlers": ["slack"],
    "interval": 60,
    "publish": true
  }
}
{{< /code >}}

{{< /language-toggle >}}


[1]: #subscription-checks
[2]: https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
[3]: https://en.wikipedia.org/wiki/Standard_streams
[4]: #check-commands
[5]: ../tokens/
[6]: ../hooks/
[8]: ../rbac/
[9]: ../assets/
[10]: #proxy-requests-attributes
[11]: ../sensu-query-expressions/
[12]: ../../guides/monitor-server-resources/
[13]: #check-attributes
[14]: https://en.wikipedia.org/wiki/Cron#CRON_expression
[15]: https://godoc.org/github.com/robfig/cron#hdr-Predefined_schedules
[16]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/flapping.html
[17]: #subdue-attributes
[20]: ../entities/#proxy-entities
[21]: ../entities/#spec-attributes
[22]: ../../reference/sensuctl/#time-windows
[22]: ../../reference/sensuctl/#time-windows
[23]: ../../guides/extract-metrics-with-checks/
[24]: ../events/
[25]: #metadata-attributes
[26]: ../rbac#namespaces
[27]: ../filters/
[28]: ../../guides/monitor-external-resources/
[29]: https://bonsai.sensu.io
[30]: https://en.wikipedia.org/wiki/Cron#Timezone_handling
[31]: #ttl-attribute
[32]: #proxy-entity-name-attribute
[33]: #proxy-checks
[34]: ../../api/checks#checkscheckexecute-post
[35]: #use-a-proxy-check-to-monitor-a-proxy-entity
[36]: #use-a-proxy-check-to-monitor-multiple-proxy-entities
[37]: #proxy-requests-top-level
[39]: #check-token-substitution
[40]: ../entities#manage-entity-labels
[41]: ../../sensuctl/create-manage-resources/#create-resources
[42]: #spec-attributes
[43]: #round-robin-attribute
[44]: #proxy-entity-name-attribute
[46]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/perfdata.html
[47]: http://graphite.readthedocs.io/en/latest/feeding-carbon.html#the-plaintext-protocol
[48]: https://docs.influxdata.com/influxdb/v1.4/write_protocols/line_protocol_tutorial/#measurement
[49]: http://opentsdb.net/docs/build/html/user_guide/writing/index.html#data-specification
[50]: ../../reference/events/#metrics
[51]: https://github.com/sensu/sensu-influxdb-handler
[52]: #round-robin-checks
[53]: https://regex101.com/r/zo9mQU/2
[54]: ../../api#response-filtering
[55]: ../../sensuctl/filter-responses/
[56]: ../../reference/secrets/
[57]: ../../reference/secrets-providers/
[58]: ../../web-ui/filter#filter-with-label-selectors
[59]: ../../operations/manage-secrets/secrets-management/
[60]: ../../web-ui/filter/
