---
title: "Checks reference"
linkTitle: "Checks Reference"
reference_title: "Checks"
type: "reference"
description: "Read this reference to learn how Sensu checks and agents work to monitor your infrastructure automatically and send observability data to the Sensu backend."
weight: 30
version: "6.9"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.9:
    parent: observe-schedule
---

Checks work with Sensu agents to produce observability events automatically.
You can use checks to monitor server resources, services, and application health as well as collect and analyze metrics.
Read [Monitor server resources][12] to get started.
Use [Bonsai][29], the Sensu asset hub, to discover, download, and share Sensu check dynamic runtime assets.

## Check example (minimum recommended attributes)

This example shows a check resource definition that includes the minimum recommended attributes.

{{% notice note %}}
**NOTE**: The attribute `interval` is not required if a valid `cron` schedule is defined.
Read [scheduling](#interval-scheduling) for more information.
{{% /notice %}}

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: check_minimum
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

## Check commands

Each Sensu check definition specifies a command and the schedule at which it should be executed.
Check commands are executable commands that the Sensu agent executes.

A command may include command line arguments for controlling the behavior of the command executable.
Many common checks are available as dynamic runtime assets from [Bonsai][29] and support command line arguments so different check definitions can use the same executable.

{{% notice note %}}
**NOTE**: Sensu advises against requiring root privileges to execute check commands or scripts.
The Sensu user is not permitted to kill timed-out processes invoked by the root user, which could result in zombie processes.
{{% /notice %}}

### Check command execution

All check commands are executed by Sensu agents as the `sensu` user.
Commands must be executable files that are discoverable on the Sensu agent system (for example, installed in a system `$PATH` directory).

## Check result specification

Although Sensu agents attempt to execute any command defined for a check, successful check result processing requires adherence to a simple specification.

- Result data is output to [stdout or stderr][3].
    - For service checks, this output is typically a human-readable message.
    - For metric checks, this output contains the measurements gathered by the
      check.
- Exit status code indicates state.
    - `0` indicates OK.
    - `1` indicates WARNING.
    - `2` indicates CRITICAL.
    - Exit status codes other than `0`, `1`, and `2` indicate an UNKNOWN or custom status

{{% notice protip %}}
**PRO TIP**: If you're familiar with the **Nagios** monitoring system, you may recognize this specification &mdash; it is the same one that Nagios plugins use.
As a result, you can use Nagios plugins with Sensu without any modification.
{{% /notice %}}

At every execution of a check command, regardless of success or failure, the Sensu agent publishes the check’s result for eventual handling by the **event processor** (the Sensu backend).

## Check scheduling

The Sensu backend schedules checks and publishes check execution requests to entities via a [publish/subscribe model][2].
Checks have a defined set of [subscriptions][64]: transport topics to which the Sensu backend publishes check requests.
Sensu entities become subscribers to these topics (called subscriptions) via their individual `subscriptions` attribute.

You can schedule checks using the [`interval`][38], [`cron`][45], and [`publish`][63] attributes.
Sensu requires that checks include either an `interval` attribute (interval scheduling) or a `cron` attribute (cron scheduling).

### Round robin checks

By default, Sensu schedules checks once per interval for each agent with a matching subscription: one check execution per agent per interval.
Sensu also supports deduplicated check execution when configured with the `round_robin` check attribute.
For checks with `round_robin` set to `true`, Sensu executes the check once per interval, cycling through the available agents alphabetically according to agent name.

For example, for three agents configured with the `system` subscription (agents A, B, and C), a check configured with the `system` subscription and `round_robin` set to `true` results in one observability event per interval, with the agent creating the event following the pattern A -> B -> C -> A -> B -> C for the first six intervals.

{{< figure src="/images/go/checks_reference/round_robin_diagram.png" alt="Round robin check diagram" link="/images/go/checks_reference/round_robin_diagram.png" target="_blank" >}}
<!-- Image source is round_robin at https://lucid.app/lucidchart/26d43b24-2f07-4820-a8a6-d4d217a6f85a/edit?viewport_loc=795%2C-273%2C2219%2C1117%2C0_0&invitationId=inv_435f4d81-2c99-48ce-b967-f6e3a06bf429# -->

In the diagram above, the standard check is executed by agents A, B, and C every 60 seconds.
The round robin check cycles through the available agents, resulting in each agent executing the check every 180 seconds.

To use check [`ttl`][31] and `round_robin` together, your check configuration must also specify a [`proxy_entity_name`][32].
If you do not specify a `proxy_entity_name` when using check `ttl` and `round_robin` together, your check will stop executing.

{{% notice protip %}}
**PRO TIP**: Use round robin to distribute check execution workload across multiple agents when using [proxy checks](#proxy-checks).
{{% /notice %}}

#### Event storage for round robin scheduling

If you use round robin scheduling for check execution, we recommend using [PostgreSQL][65] rather than etcd for event storage.
Etcd leases are unreliable as the scheduling mechanism for round robin check execution, and etcd will not produce precise round robin behavior.

When you [enable round robin scheduling on PostgreSQL][66], any existing round robin scheduling will stop and migrate to PostgreSQL as entities check in with keepalives.
Sensu will gradually delete the existing etcd scheduler state as keepalives on the etcd scheduler keys expire over time.

### Interval scheduling

You can schedule a check to be executed at regular intervals using the `interval` and `publish` check attributes.
For example, to schedule a check to execute every 60 seconds, set the `interval` attribute to `60` and the `publish` attribute to `true`.

{{% notice note %}}
**NOTE**: When creating an interval check, Sensu calculates an initial offset to splay the check's first scheduled request.
This helps balance the load of both the backend and the agent and may result in a delay before initial check execution.
{{% /notice %}}

#### Example interval check

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: interval_check
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
    "name": "interval_check"
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

### Cron scheduling

You can also schedule checks using [cron syntax][14].

Examples of valid cron values include:

- `cron: CRON_TZ=Asia/Tokyo * * * * *`
- `cron: TZ=Asia/Tokyo * * * * *`
- `cron: '* * * * *'`

{{% notice note %}}
**NOTE**: If you're using YAML to create a check that uses cron scheduling and the first character of the cron schedule is an asterisk (`*`), place the entire cron schedule inside single or double quotes (for example, `cron: '* * * * *'`).
{{% /notice %}}

#### Example cron checks

To schedule a check to execute once a minute at the start of the minute, set the `cron` attribute to `* * * * *` and the `publish` attribute to `true`:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: cron_check
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
    "name": "cron_check"
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
---
type: CheckConfig
api_version: core/v2
metadata:
  name: cron_check
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
  output_metric_tags: null
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
      "name": "cron_check"
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
      "output_metric_tags": null,
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

### Ad hoc scheduling

In addition to automatic execution, you can create checks to be scheduled manually using [core/v2/checks API endpoints][34].
To create a check with ad-hoc scheduling, set the `publish` attribute to `false` in addition to an `interval` or `cron` schedule.

#### Example ad hoc check

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: ad_hoc_check
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
    "name": "ad_hoc_check"
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

Sensu supports running proxy checks that associate events with a entity that isn’t actually executing the check, regardless of whether that entity is an agent entity or a proxy entity.
Proxy entities allow Sensu to monitor external resources on systems and devices where a Sensu agent cannot be installed, like a network switch or a website.
You can create a proxy check using [`proxy_entity_name`][35] or [`proxy_requests`][36].

When you create a proxy check, make sure the check definition includes a subscription that matches the subscription of at least one agent entity to define which agents will run the check.
Proxy entities do not use subscriptions.

To avoid duplicate events, use the [`round_robin` check attribute][43] with proxy checks.
Read [Round robin checks][52] and [Proxy entities and round robin scheduling][86] to learn more.

Read [Monitor external resources with proxy entities][28] to learn how to create proxy checks to generate events for one or more proxy entities.

### Use a proxy check to monitor a proxy entity

When executing checks that include a `proxy_entity_name`, Sensu agents report the resulting events under the specified proxy entity instead of the agent entity.
If the proxy entity doesn't exist, Sensu creates the proxy entity when the backend receives the event.

#### Example proxy check using `proxy_entity_name`

The following proxy check runs every 60 seconds, cycling through the agents with the `run_proxies` subscription alphabetically according to the agent name, for the proxy entity `sensu-site`.

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: proxy_check
spec:
  command: http_check.sh https://sensu.io
  handlers:
  - slack
  interval: 60
  proxy_entity_name: sensu-site
  publish: true
  round_robin: true
  subscriptions:
  - run_proxies
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "proxy_check"
  },
  "spec": {
    "command": "http_check.sh https://sensu.io",
    "subscriptions": ["run_proxies"],
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

The [`proxy_requests` check attributes][37] allow Sensu to run a check for each entity that matches the expressions specified in the `entity_attributes`, resulting in observability events that represent each matching proxy entity.
The entity attributes must match exactly as stated.

No variables or directives have any special meaning, but you can use [Sensu query expressions][11] to perform more complicated filtering on the available value, such as finding entities with a particular class or label.

Combine `proxy_requests` attributes with with [token substitution][39] as shown in the example proxy check below to monitor multiple entities using a single check definition.

#### Example proxy check using `proxy_requests`

The following proxy check runs every 60 seconds, cycling through the agents with the `run_proxies` subscription alphabetically according to the agent name, for all existing proxy entities with the custom label `proxy_type` set to `website`.

This check uses [token substitution][39] to import the value of the custom entity label `url` to complete the check command.
Read the [entities reference][40] for information about adding custom labels to entities.

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: proxy_check_proxy_requests
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
  - run_proxies
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "proxy_check_proxy_requests"
  },
  "spec": {
    "command": "http_check.sh {{ .labels.url }}",
    "subscriptions": ["run_proxies"],
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

Use the [`splay`][72] and [`splay_coverage`][73] attributes to distribute proxy check executions across the check interval.

To continue the [example proxy_check_proxy_requests check][71], if the check matches three proxy entities, you will get a single burst of three check executions (with the resulting events) every 60 seconds.
Use the `splay` and `splay_coverage` attributes to distribute the three check executions over the specified check interval instead of all at the same time.

The following example adds `splay` set to `true` and `splay_coverage` set to `90` within the [`proxy_requests` object][37].
With this addition, instead of three check executions in a single burst every 60 seconds, Sensu will distribute the three check executions evenly across a 54-second period (90% of the 60-second interval):

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: proxy_check_proxy_requests
spec:
  command: http_check.sh {{ .labels.url }}
  handlers:
  - slack
  interval: 60
  proxy_requests:
    entity_attributes:
    - entity.labels.proxy_type == 'website'
    splay: true
    splay_coverage: 90
  publish: true
  round_robin: true
  subscriptions:
  - run_proxies
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "proxy_check_proxy_requests"
  },
  "spec": {
    "command": "http_check.sh {{ .labels.url }}",
    "handlers": [
      "slack"
    ],
    "interval": 60,
    "proxy_requests": {
      "entity_attributes": [
        "entity.labels.proxy_type == 'website'"
      ],
      "splay": true,
      "splay_coverage": 90
    },
    "publish": true,
    "round_robin": true,
    "subscriptions": [
      "run_proxies"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Check token substitution

Sensu check definitions may include attributes that you  wish to override on an entity-by-entity basis.
For example, [check commands][4], which may include command line arguments for controlling the behavior of the check command, may benefit from entity-specific thresholds.
Sensu check tokens are check definition placeholders that the Sensu agent will replace with the corresponding entity definition attribute values (including custom attributes).

Learn how to use check tokens with the [Sensu tokens reference documentation][5].

{{% notice note %}}
**NOTE**: Check tokens are processed before check execution, so token substitutions will not apply to check data delivered via the local agent socket input.
{{% /notice %}}

## Subdues

Use the [`subdues` attribute][82] in check definitions to set specific periods of time when Sensu should not execute the check.
Subdues allow you to schedule alert-free periods of time, such as during sleeping hours, weekends, or special maintenance periods.

You can set more than one subdue at a time.
Each subdue includes a begin and end time as well as how often to repeat the subdue, if desired.

For example, this check will be subdued (in other words, will not be executed) from 5:00 p.m. until 8:00 a.m. PDT on every weekday, and for the entire day on weekends, as well as every Friday from 10:00 until 11:00 a.m. PDT:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: check_cpu
spec:
  command: check-cpu-usage -w 75 -c 90
  interval: 60
  handlers:
  - slack
  publish: true
  round_robin: false
  runtime_assets:
  - check-cpu-usage
  subdues:
  - begin: "2022-04-18T17:00:00-07:00"
    end: "2022-04-19T08:00:00-07:00"
    repeat:
    - weekdays
  - begin: "2022-04-23T00:00:00-07:00"
    end: "2022-04-23T23:59:59-07:00"
    repeat:
    - weekends
  - begin: "2022-04-22T10:00:00-07:00"
    end: "2022-04-22T11:00:00-07:00"
    repeat:
    - fridays
  subscriptions:
  - system
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "check_cpu"
  },
  "spec": {
    "command": "check-cpu-usage -w 75 -c 90",
    "interval": 60,
    "handlers": [
      "slack"
    ],
    "publish": true,
    "round_robin": false,
    "runtime_assets": [
      "check-cpu-usage"
    ],
    "subdues": [
      {
        "begin": "2022-04-18T17:00:00-07:00",
        "end": "2022-04-19T08:00:00-07:00",
        "repeat": [
          "weekdays"
        ]
      },
      {
        "begin": "2022-04-23T00:00:00-07:00",
        "end": "2022-04-23T23:59:59-07:00",
        "repeat": [
          "weekends"
        ]
      },
      {
        "begin": "2022-04-22T10:00:00-07:00",
        "end": "2022-04-22T11:00:00-07:00",
        "repeat": [
          "fridays"
        ]
      }
    ],
    "subscriptions": [
      "system"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

### Subdues and repeat

If you include a `repeat` array in a `subdues` object, Sensu will start the subdue period on the date you specify.
After the first subdue, Sensu uses the `begin` and `end` values only to determine the *time* of day to start and stop the subdue.

{{% notice note %}}
**NOTE**: Check subdue repeats are based on the specified `begin` and `end` times and not duration or the difference between the `begin` and `end` times.
Read [Repeat and multi-day subdues](#repeat-and-multi-day-subdues) for more information.
{{% /notice %}}

In the above example, on April 18, 2022, Sensu will apply the `weekdays` subdue at 5:00 p.m. PDT and end it on April 19 at 8:00 a.m. PDT.
On April 19, Sensu will apply the `weekdays` subdue again at 5:00 p.m. PDT and end it on April 20 at 8:00 a.m. PDT, and so on.

#### Valid values for repeat arrays

This table lists and describes valid values for the `repeat` array:

Value | Description |
----- | ----------- |
`mondays` `tuesdays` `wednesdays` `thursdays` `fridays` `saturdays` `sundays` | Subdue on the specified day, at the same time of day
`weekdays` | Subdue on all Mondays, Tuesdays, Wednesdays, Thursdays, and Fridays, at the same time of day
`weekends` | Subdue on all Saturdays and Sundays, at the same time of day
`daily` | Subdue once every day, at the same time of day
`weekly` | Subdue once per week on the same day, at the same time of day
`monthly` | Subdue once per month on the same day, at the same time of day
`annually` | Subdue once per year on the same day, at the same time of day

#### Repeat and multi-day subdues

Because repeat schedules for subdues are based only on the specified time of day, you may need to configure more than one repeat for multi-day subdues.

For example, suppose that you want to subdue a check on the weekends.
You might set a repeat that starts on a Friday at 5:00 p.m. PDT and ends on Monday at 8:00 a.m. PDT:

{{< language-toggle >}}

{{< code yml >}}
subdues:
- begin: "2022-05-06T17:00:00-07:00"
  end: "2022-05-09T08:00:00-07:00"
  repeat:
  - fridays
{{< /code >}}

{{< code json >}}
{
  "subdues": [
    {
      "begin": "2022-05-06T17:00:00-07:00",
      "end": "2022-05-09T08:00:00-07:00",
      "repeat": [
        "fridays"
      ]
    }
  ]
}
{{< /code >}}

{{< /language-toggle >}}

The first weekend, your repeat will work as expected to subdue the check from 5:00 p.m. PDT on Friday until 8:00 a.m. PDT on Monday.

After the first weekend, the subdue will start as expected at 5:00 p.m. PDT on Friday, but it will expire at 8:00 a.m. PDT on *Saturday* instead of Monday.
This is because after the first instance, repeats are based only on the specified `begin` and `end` times.
Sensu uses the dates to schedule only the first subdue.

Instead, use the following three-part configuration to achieve the desired repeat schedule (every Friday at 5:00 p.m. PDT until Monday at 8:00 a.m. PDT):

{{< language-toggle >}}

{{< code yml >}}
subdues:
- begin: "2022-05-06T17:00:00-07:00"
  end: "2022-05-06T23:59:59-07:00"
  repeat:
  - fridays
- begin: "2022-05-07T00:00:00-07:00"
  end: "2022-05-07T23:59:59-07:00"
  repeat:
  - weekends
- begin: "2022-05-09T00:00:00-07:00"
  end: "2022-05-09T08:00:00-07:00"
  repeat:
  - mondays
{{< /code >}}

{{< code json >}}
{
  "subdues": [
    {
      "begin": "2022-05-06T17:00:00-07:00",
      "end": "2022-05-06T23:59:59-07:00",
      "repeat": [
        "fridays"
      ]
    },
    {
      "begin": "2022-05-07T00:00:00-07:00",
      "end": "2022-05-07T23:59:59-07:00",
      "repeat": [
        "weekends"
      ]
    },
    {
      "begin": "2022-05-09T00:00:00-07:00",
      "end": "2022-05-09T08:00:00-07:00",
      "repeat": [
        "mondays"
      ]
    }
  ]
}
{{< /code >}}

{{< /language-toggle >}}

With this configuration, the repeat schedule will subdue the check every Friday from 5:00 p.m. PDT until midnight, the entire 24 hours on every Saturday and Sunday, and every Monday from midnight until 8:00 a.m. PDT.

## Check hooks

Check hooks are commands run by the Sensu agent in response to the result of check command execution.
The Sensu agent will execute the appropriate configured hook command, depending on the check execution status (for example, `0`, `1`, or `2`).

Learn how to use check hooks with the [Sensu hooks reference documentation][6].

## Check specification

### Top-level attributes

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For checks in this version of Sensu, this attribute should always be `core/v2`.
required     | Required for check definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][41].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: core/v2
{{< /code >}}
{{< code json >}}
{
  "api_version": "core/v2"
}
{{< /code >}}
{{< /language-toggle >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the check, including `name`, `namespace`, and `created_by` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the check definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. Read [metadata attributes][25] for details.
required     | Required for check definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][41].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: sensu-site-perf
  namespace: development
  created_by: admin
  labels:
    region: us-west-1
    environment: dev
  annotations:
    slack-channel: "#monitoring"
    managed-by: ops
    playbooks: www.playbooks-example.url
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "name": "sensu-site-perf",
    "namespace": "development",
    "created_by": "admin",
    "labels": {
      "region": "us-west-1",
      "environment": "dev"
    },
    "annotations": {
      "slack-channel": "#monitoring",
      "managed-by": "ops",
      "playbooks": "www.playbooks-example.url"
    }
  }
}
{{< /code >}}
{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes the check [spec attributes][42].
required     | Required for check definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][41].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  check_hooks: null
  command: collect.sh
  discard_output: true
  env_vars: null
  handlers: []
  high_flap_threshold: 0
  interval: 10
  low_flap_threshold: 0
  output_metric_format: prometheus_text
  output_metric_tags:
  - name: instance
    value: '{{ .name }}'
  - name: namespace
    value: "{{ .namespace }}"
  - name: service
    value: '{{ .labels.service }}'
  output_metric_thresholds:
    - name: system_mem_used
      tags: null
      null_status: 0
      thresholds:
      - max: "75.0"
        min: ""
        status: 1
      - max: "90.0"
        min: ""
        status: 2
    - name: system_host_processes
      tags:
      - name: namespace
        value: production
      null_status: 0
      thresholds:
      - max: "50"
        min: "5"
        status: 1
      - max: "75"
        min: "2"
        status: 2
  pipelines:
  - type: Pipeline
    api_version: core/v2
    name: prometheus_gateway_workflows
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
  "spec": {
    "check_hooks": null,
    "command": "collect.sh",
    "discard_output": true,
    "env_vars": null,
    "handlers": [

    ],
    "high_flap_threshold": 0,
    "interval": 10,
    "low_flap_threshold": 0,
    "output_metric_format": "prometheus_text",
    "output_metric_tags": [
      {
        "name": "instance",
        "value": "{{ .name }}"
      },
      {
        "name": "namespace",
        "value": "{{ .namespace }}"
      },
      {
        "name": "service",
        "value": "{{ .labels.service }}"
      }
    ],
    "output_metric_thresholds": [
      {
        "name": "system_mem_used",
        "tags": null,
        "null_status": 0,
        "thresholds": [
          {
            "max": "75.0",
            "min": "",
            "status": 1
          },
          {
            "max": "90.0",
            "min": "",
            "status": 2
          }
        ]
      },
      {
        "name": "system_host_processes",
        "tags": [
          {
            "name": "namespace",
            "value": "production"
          }
        ],
        "null_status": 0,
        "thresholds": [
          {
            "max": "50",
            "min": "5",
            "status": 1
          },
          {
            "max": "75",
            "min": "2",
            "status": 2
          }
        ]
      }
    ],
    "pipelines": [
      {
        "type": "Pipeline",
        "api_version": "core/v2",
        "name": "prometheus_gateway_workflows"
      }
    ],
    "proxy_entity_name": "",
    "publish": true,
    "round_robin": false,
    "runtime_assets": null,
    "stdin": false,
    "subscriptions": [
      "system"
    ],
    "timeout": 0,
    "ttl": 0
  }
}
{{< /code >}}
{{< /language-toggle >}}

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][41] resource type. Checks should always be type `CheckConfig`.
required     | Required for check definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][41].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: CheckConfig
{{< /code >}}
{{< code json >}}
{
  "type": "CheckConfig"
}
{{< /code >}}
{{< /language-toggle >}}

### Metadata attributes

| annotations |     |
-------------|------
description  | Non-identifying metadata to include with observation event data that you can access with [event filters][27]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][54], [sensuctl response filtering][55], or [web UI views][61].
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
annotations:
  slack-channel: "#monitoring"
  managed-by: ops
  playbooks: www.playbooks-example.url
{{< /code >}}
{{< code json >}}
{
  "annotations": {
    "slack-channel": "#monitoring",
    "managed-by": "ops",
    "playbooks": "www.playbooks-example.url"
  }
}
{{< /code >}}
{{< /language-toggle >}}

| created_by |      |
-------------|------
description  | Username of the Sensu user who created the check or last updated the check. Sensu automatically populates the `created_by` field when the check is created or updated.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
created_by: admin
{{< /code >}}
{{< code json >}}
{
  "created_by": "admin"
}
{{< /code >}}
{{< /language-toggle >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with observation event data that you can use for response and web UI view filtering.<br><br>If you include labels in your event data, you can filter [API responses][54], [sensuctl responses][55], and [web UI views][58] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
labels:
  region: us-west-1
  environment: dev
{{< /code >}}
{{< code json >}}
{
  "labels": {
    "region": "us-west-1",
    "environment": "dev"
  }
}
{{< /code >}}
{{< /language-toggle >}}

| name       |      |
-------------|------
description  | Unique string used to identify the check. Check names cannot contain special characters or spaces (validated with Go regex [`\A[\w\.\-]+\z`][53]). Each check must have a unique name within its namespace.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: sensu-site-perf
{{< /code >}}
{{< code json >}}
{
  "name": "sensu-site-perf"
}
{{< /code >}}
{{< /language-toggle >}}

| namespace  |      |
-------------|------
description  | [Sensu RBAC namespace][26] that the check belongs to.
required     | false
type         | String
default      | `default`
example      | {{< language-toggle >}}
{{< code yml >}}
namespace: development
{{< /code >}}
{{< code json >}}
{
  "namespace": "development"
}
{{< /code >}}
{{< /language-toggle >}}

### Spec attributes

{{% notice note %}}
**NOTE**: Spec attributes are not required when sending an HTTP `POST` request to the [agent events API](../agent/#events-post) or the [backend core/v2/events API](../../../api/core/events/#create-a-new-event).
When doing so, the spec attributes are listed as individual [top-level attributes](#top-level-attributes) in the check definition instead.
{{% /notice %}}

<a id="check-hooks-attribute"></a>

|check_hooks |      |
-------------|------
description  | Array of check response types with respective arrays of [Sensu hook names][6]. Sensu hooks are commands run by the Sensu agent in response to the result of the check command execution. Hooks are executed in order of precedence based on their severity type: `1` to `255`, `ok`, `warning`, `critical`, `unknown`, and finally `non-zero`.
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
check_hooks:
- '1':
  - playbook-warning
  - collect-diagnostics
- critical:
  - playbook-critical
  - collect-diagnostics
  - process-tree
{{< /code >}}
{{< code json >}}
{
  "check_hooks": [
    {
      "1": [
        "playbook-warning",
        "collect-diagnostics"
      ]
    },
    {
      "critical": [
        "playbook-critical",
        "collect-diagnostics",
        "process-tree"
      ]
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

|command     |      |
-------------|------
description  | Check command to be executed.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
command: http-perf --url https://sensu.io --warning 1s --critical 2s
{{< /code >}}
{{< code json >}}
{
  "command": "http-perf --url https://sensu.io --warning 1s --critical 2s"
}
{{< /code >}}
{{< /language-toggle >}}

|cron        |      |
-------------|------
description  | When the check should be executed, using [cron syntax][14] or a [predefined schedule][15]. Use a prefix of `TZ=` or `CRON_TZ=` to set a [timezone][30] for the cron attribute. {{% notice note %}}
**NOTE**: If you're using YAML to create a check that uses cron scheduling and the first character of the cron schedule is an asterisk (`*`), place the entire cron schedule inside single or double quotes (for example, `cron: '* * * * *'`).
{{% /notice %}}
required     | true (unless `interval` is configured)
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
cron: 0 0 * * *
{{< /code >}}
{{< code json >}}
{
  "cron": "0 0 * * *"
}
{{< /code >}}
{{< /language-toggle >}}

|env_vars    |      |
-------------|------
description  | Array of environment variables to use with command execution. {{% notice note %}}
**NOTE**: To add `env_vars` to a check, use [`sensuctl create`](../../../sensuctl/create-manage-resources/#create-resources).
{{% /notice %}}
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
env_vars:
- APP_VERSION=2.5.0
- CHECK_HOST=my.host.internal
{{< /code >}}
{{< code json >}}
{
  "env_vars": [
    "APP_VERSION=2.5.0",
    "CHECK_HOST=my.host.internal"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

<a id="handlers-array"></a>

|handlers    |      |
-------------|------
description  | Array of Sensu event handlers (names) to use for events created by the check. Each array item must be a string. {{% notice note %}}
**NOTE**: The names of [Sumo Logic metrics handlers](../../observe-process/sumo-logic-metrics-handlers/) and [TCP stream handlers](../../observe-process/tcp-stream-handlers/) are not valid values for the handlers array.
Only [traditional handlers](../../observe-process/handlers/) are valid for the handlers array.<br><br>
To use Sumo Logic metrics or TCP stream handlers, include them in a [pipeline](../../observe-process/pipelines/) workflow and reference the pipeline name in the check [pipelines array](#pipelines-attribute).
{{% /notice %}}
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
handlers:
- pagerduty
- slack
{{< /code >}}
{{< code json >}}
{
  "handlers": [
    "pagerduty",
    "slack"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

<a id="high-flap-threshold"></a>

|high_flap_threshold ||
-------------|------
description  | Flap detection high threshold (% state change) for the check. Sensu uses the same flap detection algorithm as [Nagios][16]. Read the [event reference][62] to learn more about how Sensu uses the `high_flap_threshold` value.
required     | true (if `low_flap_threshold` is configured)
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
high_flap_threshold: 60
{{< /code >}}
{{< code json >}}
{
  "high_flap_threshold": 60
}
{{< /code >}}
{{< /language-toggle >}}

|interval    |      |
-------------|------
description  | How often the check is executed. In seconds.
required     | true (unless `cron` is configured)
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
interval: 60
{{< /code >}}
{{< code json >}}
{
  "interval": 60
}
{{< /code >}}
{{< /language-toggle >}}

<a id="low-flap-threshold"></a>

|low_flap_threshold ||
-------------|------
description  | Flap detection low threshold (% state change) for the check. Sensu uses the same flap detection algorithm as [Nagios][16]. Read the [event reference][62] to learn more about how Sensu uses the `low_flap_threshold` value.
required     | false
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
low_flap_threshold: 20
{{< /code >}}
{{< code json >}}
{
  "low_flap_threshold": 20
}
{{< /code >}}
{{< /language-toggle >}}

<a id="output-metric-format"></a>

|output_metric_format    |      |
-------------|------
description  | Metric format generated by the check command. Sensu supports the following metric formats:<br>`nagios_perfdata` ([Nagios Performance Data][46])<br>`graphite_plaintext` ([Graphite Plaintext Protocol][47])<br>`influxdb_line` ([InfluxDB Line Protocol][48])<br>`opentsdb_line` ([OpenTSDB Data Specification][49])<br>`prometheus_text` ([Prometheus Exposition Text][18])<br><br>When a check includes an `output_metric_format`, Sensu will extract the metrics from the check output and add them to the event data in [Sensu metric format][50]. Read [Collect metrics with Sensu checks][23]. 
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
output_metric_format:
- nagios_perfdata
{{< /code >}}
{{< code json >}}
{
  "output_metric_format": [
    "nagios_perfdata"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

<a id="output-metric-handlers"></a>

|output_metric_handlers    |      |
-------------|------
description  | Array of Sensu handlers to use for events created by the check. Each array item must be a string. Use `output_metric_handlers` in place of the `handlers` attribute if `output_metric_format` is configured. Metric handlers must be able to process [Sensu metric format][50]. The [Sensu InfluxDB handler][51] provides an example.
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
output_metric_handlers:
- influx-db
{{< /code >}}
{{< code json >}}
{
  "output_metric_handlers": [
    "influx-db"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

<a id="output-metric-tags"></a>

|output_metric_tags    |      |
-------------|------
description  | Custom tags to enrich metric points produced by check output metric extraction. One [name/value pair][22] make up a single tag. The `output_metric_tags` array can contain multiple tags.<br><br>You can use [check token substitution][39] for the `value` attribute in output metric tags.
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
output_metric_tags:
- name: instance
  value: "{{ .name }}"
- name: region
  value: "{{ .labels.region }}"
{{< /code >}}
{{< code json >}}
{
  "output_metric_tags": [
    {
      "name": "instance",
      "value": "{{ .name }}"
    },
    {
      "name": "region",
      "value": "{{ .labels.region }}"
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

<a id="output-metric-thresholds"></a>

|output_metric_thresholds |   |
-------------|------
description  | Array of metric names and threshold values to compare to check output metrics for [metric threshold evaluation][79].{{% notice note %}}
**NOTE**: To apply metric threshold evaluation, check definitions must include the [`output_metric_format`](#output-metric-format) attribute with a value that specifies one of Sensu's [supported output metric formats](../metrics/#supported-output-metric-formats).
{{% /notice %}}
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
output_metric_thresholds:
- name: system_mem_used
  tags: ''
  null_status: 0
  thresholds:
  - max: '75.0'
    min: ''
    status: 1
  - max: '90.0'
    min: ''
    status: 2
- name: system_host_processes
  tags:
  - name: namespace
    value: production
  null_status: 0
  thresholds:
  - max: '50'
    min: '5'
    status: 1
  - max: '75'
    min: '2'
    status: 2
{{< /code >}}
{{< code json >}}
{
  "output_metric_thresholds": [
    {
      "name": "system_mem_used",
      "tags": null,
      "null_status": 0,
      "thresholds": [
        {
          "max": "75.0",
          "min": "",
          "status": 1
        },
        {
          "max": "90.0",
          "min": "",
          "status": 2
        }
      ]
    },
    {
      "name": "system_host_processes",
      "tags": [
        {
          "name": "namespace",
          "value": "production"
        }
      ],
      "null_status": 0,
      "thresholds": [
        {
          "max": "50",
          "min": "5",
          "status": 1
        },
        {
          "max": "75",
          "min": "2",
          "status": 2
        }
      ]
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

<a id="pipelines-attribute"></a>

| pipelines  |   |
-------------|------
description  | Name, type, and API version for the [pipelines][69] to use for event processing. All the observability events that the check produces will be processed according to the pipelines listed in the pipeline array. Read [pipelines attributes][70] for more information.
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
pipelines:
- type: Pipeline
  api_version: core/v2
  name: incident_alerts
{{< /code >}}
{{< code json >}}
{
  "pipelines": [
    {
      "type": "Pipeline",
      "api_version": "core/v2",
      "name": "incident_alerts"
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

<a id="proxy-entity-name-attribute"></a>

|proxy_entity_name|   |
-------------|------
description  | Entity name. Used to create a [proxy entity][20] for an external resource (for example, a network switch).
required     | false
type         | String
validated    | [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2)
example      | {{< language-toggle >}}
{{< code yml >}}
proxy_entity_name: switch-dc-01
{{< /code >}}
{{< code json >}}
{
  "proxy_entity_name": "switch-dc-01"
}
{{< /code >}}
{{< /language-toggle >}}

<a id="proxy-requests-top-level"></a>

|proxy_requests|    |
-------------|------
description  | Assigns a check to run for multiple entities according to their `entity_attributes`. In the example below, the check executes for all entities with entity class `proxy` and the custom proxy type label `website`. The `proxy_requests` attributes allow you to reuse check definitions for a group of entities. For more information, read [Proxy requests attributes][10] and [Monitor external resources with proxy entities][28].
required     | false
type         | Hash
example      | {{< language-toggle >}}
{{< code yml >}}
proxy_requests:
  entity_attributes:
  - entity.entity_class == 'proxy'
  - entity.labels.proxy_type == 'website'
  splay: true
  splay_coverage: 90
{{< /code >}}
{{< code json >}}
{
  "proxy_requests": {
    "entity_attributes": [
      "entity.entity_class == 'proxy'",
      "entity.labels.proxy_type == 'website'"
    ],
    "splay": true,
    "splay_coverage": 90
  }
}
{{< /code >}}
{{< /language-toggle >}}

<a id="publish-attribute"></a>

|publish     |      |
-------------|------
description  | `true` if check requests are published for the check. Otherwise, `false`.
required     | false
type         | Boolean
default      | `false`
example      | {{< language-toggle >}}
{{< code yml >}}
publish: true
{{< /code >}}
{{< code json >}}
{
  "publish": true
}
{{< /code >}}
{{< /language-toggle >}}

<a id="round-robin-attribute"></a>

|round_robin |      |
-------------|------
description  | When set to `true`, Sensu executes the check once per interval, cycling through each subscribing agent in turn. Read [round robin checks][52] for more information.<br><br>Use the `round_robin` attribute with proxy checks to avoid duplicate events and distribute proxy check executions evenly across multiple agents. Read about [proxy checks][33] for more information.<br><br>To use check [`ttl`][31] and `round_robin` together, your check configuration must also specify a [`proxy_entity_name`][32]. If you do not specify a `proxy_entity_name` when using check `ttl` and `round_robin` together, your check will stop executing.
required     | false
type         | Boolean
default      | `false`
example      | {{< language-toggle >}}
{{< code yml >}}
round_robin: true
{{< /code >}}
{{< code json >}}
{
  "round_robin": true
}
{{< /code >}}
{{< /language-toggle >}}

|runtime_assets |   |
-------------|------
description  | Array of [Sensu dynamic runtime assets][9] (names). Required at runtime for the execution of the `command`.
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
runtime_assets:
- http-checks
{{< /code >}}
{{< code json >}}
{
  "runtime_assets": [
    "http-checks"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

<a id="scheduler-attribute"></a>

|scheduler  |     |
------------|-----
description | Type of scheduler that schedules the check. Sensu automatically sets the `scheduler` value and overrides any user-entered values. Value may be:<ul><li>`memory` for checks scheduled in-memory</li><li>`etcd` for checks scheduled with etcd leases and watchers (check attribute `round_robin: true` and [etcd used for event storage][67])</li><li>`postgres` for checks scheduled with PostgreSQL using transactions and asynchronous notification (check attribute `round_robin: true` and [PostgreSQL used for event storage][67] with datastore attribute `enable_round_robin: true`)</li></ul>
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
scheduler: postgres
{{< /code >}}
{{< code json >}}
{
  "scheduler": "postgres"
}
{{< /code >}}
{{< /language-toggle >}}

secrets        | 
---------------|------
description    | Array of the [name/secret pairs][80] to use with command execution.
required       | false
type           | Array
example        | {{< language-toggle >}}
{{< code yml >}}
secrets:
- name: PAGERDUTY_TOKEN
  secret: sensu-pagerduty-token
{{< /code >}}
{{< code json >}}
{
  "secrets": [
    {
      "name": "PAGERDUTY_TOKEN",
      "secret": "sensu-pagerduty-token"
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

|silenced    |      |
-------------|------
description  | Silences that apply to the check.
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
silenced:
- "*:routers"
{{< /code >}}
{{< code json >}}
{
  "silenced": [
    "*:routers"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

|stdin       |      |
-------------|------
description  | `true` if the Sensu agent writes JSON serialized Sensu entity and check data to the command process’ stdin. The command must expect the JSON data via stdin, read it, and close stdin. Otherwise, `false`. This attribute cannot be used with existing Sensu check plugins or Nagios plugins because the Sensu agent will wait indefinitely for the check process to read and close stdin.
required     | false
type         | Boolean
default      | `false`
example      | {{< language-toggle >}}
{{< code yml >}}
stdin: true
{{< /code >}}
{{< code json >}}
{
  "stdin": true
}
{{< /code >}}
{{< /language-toggle >}}

|subdue (placeholder)     |      |
-------------|------
description  | Use the [`subdues`][82] attribute to stop check execution during specific periods. This `subdue` attribute appears in check definitions by default, but it is a placeholder and should not be modified.
example      | {{< language-toggle >}}
{{< code yml >}}
subdue: null
{{< /code >}}
{{< code json >}}
{
  "subdue": null
}
{{< /code >}}
{{< /language-toggle >}}

<a id="check-subdues-attribute"></a>

|subdues     |      |
-------------|------
description  | Specific periods of time when Sensu should not send alerts based on the events the check produces. Use to schedule alert-free periods of time, such as during sleeping hours, weekends, or special maintenance periods. Read [subdues attributes][83] for more information.
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
subdues:
  - begin: "2022-04-18T17:00:00-07:00"
    end: "2022-04-19T08:00:00-07:00"
    repeat:
    - weekdays
  - begin: "2022-04-23T00:00:00-07:00"
    end: "2022-04-23T23:59:59-07:00"
    repeat:
    - weekends
  - begin: "2022-04-22T10:00:00-07:00"
    end: "2022-04-22T11:00:00-07:00"
    repeat:
    - fridays
{{< /code >}}
{{< code json >}}
{
  "subdues": [
    {
      "begin": "2022-04-18T17:00:00-07:00",
      "end": "2022-04-19T08:00:00-07:00",
      "repeat": [
        "weekdays"
      ]
    },
    {
      "begin": "2022-04-23T00:00:00-07:00",
      "end": "2022-04-23T23:59:59-07:00",
      "repeat": [
        "weekends"
      ]
    },
    {
      "begin": "2022-04-22T10:00:00-07:00",
      "end": "2022-04-22T11:00:00-07:00",
      "repeat": [
        "fridays"
      ]
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

<a id="check-subscriptions"></a>

|subscriptions|     |
-------------|------
description  | Array of Sensu entity subscriptions that check requests will be sent to. The array cannot be empty and its items must each be a string.
required     | true
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
subscriptions:
- system
{{< /code >}}
{{< code json >}}
{
  "subscriptions": [
    "system"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

|timeout     |      |
-------------|------
description  | Check execution duration timeout (hard stop). In seconds.
required     | false
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
timeout: 30
{{< /code >}}
{{< code json >}}
{
  "timeout": 30
}
{{< /code >}}
{{< /language-toggle >}}

<a id="ttl-attribute"></a>

|ttl         |      |
-------------|------
description  | The time-to-live (TTL) until check results are considered stale. In seconds. If an agent stops publishing results for the check and the TTL expires, an event will be created for the agent's entity.<br><br>The check `ttl` must be greater than the check `interval` and should allow enough time for the check execution and result processing to complete. For example, for a check that has an `interval` of `60` (seconds) and a `timeout` of `30` (seconds), the appropriate `ttl` is at least `90` (seconds).<br><br>To use check `ttl` and [`round_robin`][43] together, your check configuration must also specify a [`proxy_entity_name`][44]. If you do not specify a `proxy_entity_name` when using check `ttl` and `round_robin` together, your check will stop executing. {{% notice note %}}
**NOTE**: Adding TTLs to checks adds overhead, so use the `ttl` attribute sparingly.
{{% /notice %}}
required     | false
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
ttl: 100
{{< /code >}}
{{< code json >}}
{
  "ttl": 100
}
{{< /code >}}
{{< /language-toggle >}}

#### Check output truncation attributes

|max_output_size  | |
-------------|-------
description  | Maximum size of stored check outputs. In bytes. When set to a non-zero value, the Sensu backend truncates check outputs larger than this value before storing to etcd. `max_output_size` does not affect data sent to Sensu filters, mutators, and handlers.<br><br>When check output is truncated due to the `max_output_size` configuration, the events the check produces will include the label `sensu.io/output_truncated_bytes`.
required     | false
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
max_output_size: 1024
{{< /code >}}
{{< code json >}}
{
  "max_output_size": 1024
}
{{< /code >}}
{{< /language-toggle >}}

|discard_output  | |
-------------|------
description  | If `true`, discard check output after extracting metrics. No check output will be sent to the Sensu backend. Otherwise, `false`.
required     | false
type         | Boolean
example      | {{< language-toggle >}}
{{< code yml >}}
discard_output: true
{{< /code >}}
{{< code json >}}
{
  "discard_output": true
}
{{< /code >}}
{{< /language-toggle >}}

#### `output_metric_tags` attributes

name         | 
-------------|------
description  | Name for the [output metric tag][19].
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: instance
{{< /code >}}
{{< code json >}}
{
  "name": "instance"
}
{{< /code >}}
{{< /language-toggle >}}

value        | 
-------------|------
description  | Value for the [output metric tag][19]. Use [check token substitution][39] syntax for the `value` attribute, with dot-notation access to any event attribute.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
value: {{ .name }}
{{< /code >}}
{{< code json >}}
{
  "value": "{{ .name }}"
}
{{< /code >}}
{{< /language-toggle >}}

#### `output_metric_thresholds` attributes

name         | 
-------------|------
description  | Name of the metric to use for [metric threshold evaluation][79]. Must match the [event.metrics.points[].name][81] value for a metric point in the check results.{{% notice note %}}
**NOTE**: To produce values for the output metrics you specify, the check definition must include a valid [`output_metric_format`](#output-metric-format).
{{% /notice %}}
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: system_host_processes
{{< /code >}}
{{< code json >}}
{
  "name": "system_host_processes"
}
{{< /code >}}
{{< /language-toggle >}}

null_status  | 
-------------|------
description  | Event [check status][77] to use if a metric specified for [metric threshold evaluation][79] is missing from the event data.{{% notice note %}}
**NOTE**: Sensu only overrides the event check status if it is less than the specified `null_status` value.
{{% /notice %}}
required     | false
type         | Integer
default      | `0`
example      | {{< language-toggle >}}
{{< code yml >}}
null_status: 0
{{< /code >}}
{{< code json >}}
{
  "null_status": 0
}
{{< /code >}}
{{< /language-toggle >}}

tags         | 
-------------|------
description  | Tags of the metric to use for [metric threshold evaluation][79]. If provided, must match the [event.metrics.points[].tags][81] name and value for a metric point in the check results. Read [tags attributes][76] for more information.
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
tags:
- name: namespace
  value: production
{{< /code >}}
{{< code json >}}
{
  "tags": [
    {
      "name": "namespace",
      "value": "production"
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

thresholds   | 
-------------|------
description  | Rules to apply for [metric threshold evaluation][79]. Read [thresholds attributes][75] for more information.
required     | true
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
thresholds:
- max: '50'
  min: '5'
  status: 1
- max: '75'
  min: '2'
  status: 2
{{< /code >}}
{{< code json >}}
{
  "thresholds": [
    {
      "max": "50",
      "min": "5",
      "status": 1
    },
    {
      "max": "75",
      "min": "2",
      "status": 2
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

#### Pipelines attributes

api_version  | 
-------------|------
description  | The Sensu API group and version for the [pipeline][69]. For pipelines in this version of Sensu, the api_version should always be `core/v2`.
required     | true
type         | String
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: core/v2
{{< /code >}}
{{< code json >}}
{
  "api_version": "core/v2"
}
{{< /code >}}
{{< /language-toggle >}}

name         | 
-------------|------
description  | Name of the Sensu [pipeline][69] for the check to use.
required     | true
type         | String
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
name: incident_alerts
{{< /code >}}
{{< code json >}}
{
  "name": "incident_alerts"
}
{{< /code >}}
{{< /language-toggle >}}

type         | 
-------------|------
description  | The [`sensuctl create`][41] resource type for the [pipeline][69]. Pipelines should always be type `Pipeline`.
required     | true
type         | String
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
type: Pipeline
{{< /code >}}
{{< code json >}}
{
 "type": "Pipeline"
}
{{< /code >}}
{{< /language-toggle >}}

#### Proxy requests attributes

|entity_attributes| |
-------------|------
description  | Sensu entity attributes to match entities in the registry using [Sensu query expressions][11].
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
entity_attributes:
- entity.entity_class == 'proxy'
- entity.labels.proxy_type == 'website'
{{< /code >}}
{{< code json >}}
{
  "entity_attributes": [
    "entity.entity_class == 'proxy'",
    "entity.labels.proxy_type == 'website'"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

<a id="splay"></a>

|splay       |      |
-------------|------
description  | `true` if proxy check requests should be splayed, published evenly over a window of time, determined by the check interval and a configurable [`splay_coverage`][73] percentage. Otherwise, `false`.
required     | false
type         | Boolean
default      | `false`
example      | {{< language-toggle >}}
{{< code yml >}}
splay: true
{{< /code >}}
{{< code json >}}
{
  "splay": true
}
{{< /code >}}
{{< /language-toggle >}}

<a id="splay-coverage"></a>

|splay_coverage  | |
-------------|------
description  | **Percentage** of the check interval over which Sensu can execute the check for all applicable entities, as defined in the entity attributes. Sensu uses the splay_coverage attribute to determine the period of time to publish check requests over, before the next check interval begins.<br><br>For example, if a check's interval is 60 seconds and `splay_coverage` is 90, Sensu will distribute its proxy check requests evenly over a time window of 54 seconds (60 seconds * 90%). This leaves 6 seconds after the last proxy check execution before the the next round of proxy check requests for the same check.
required     | `true` if [`splay`][72] attribute is set to `true` (otherwise, `false`)
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
splay_coverage: 90
{{< /code >}}
{{< code json >}}
{
  "splay_coverage": 90
}
{{< /code >}}
{{< /language-toggle >}}

#### `secrets` attributes

name         | 
-------------|------
description  | Name of the [secret][56] defined in the executable command. Becomes the environment variable presented to the check. Read [Use secrets management in Sensu][59] for more information.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: ANSIBLE_HOST
{{< /code >}}
{{< code json >}}
{
  "name": "ANSIBLE_HOST"
}
{{< /code >}}
{{< /language-toggle >}}

secret       | 
-------------|------
description  | Name of the Sensu secret resource that defines how to retrieve the [secret][56].
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
secret: sensu-ansible-host
{{< /code >}}
{{< code json >}}
{
  "secret": "sensu-ansible-host"
}
{{< /code >}}
{{< /language-toggle >}}

#### Tags attributes

name         | 
-------------|------
description  | Tag name for the metric to use for [metric threshold evaluation][79]. If provided, must match the [event.metrics.points[].tags.name][81] value for a metric point in the check results.{{% notice note %}}
**NOTE**: If provided, you must also provide the value for the same metric point tag.
{{% /notice %}}
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: namespace
{{< /code >}}
{{< code json >}}
{
  "name": "namespace"
}
{{< /code >}}
{{< /language-toggle >}}

value        | 
-------------|------
description  | Tag value of the metric to use for [metric threshold evaluation][79]. If provided, must match the [event.metrics.points[].tags.value][81] value for a metric point in the check results.{{% notice note %}}
**NOTE**: If provided, you must also provide the name for the same metric point tag.
{{% /notice %}}
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
value: production
{{< /code >}}
{{< code json >}}
{
  "value": "production"
}
{{< /code >}}
{{< /language-toggle >}}

#### Thresholds attributes

max          | 
-------------|------
description  | Maximum threshold for the metric for [metric threshold evaluation][79]. You must provide a thresholds `max` value if you do not provide a `min` value.
required     | false (if a thresholds `min` value is provided)
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
max: '75'
{{< /code >}}
{{< code json >}}
{
  "max": "75"
}
{{< /code >}}
{{< /language-toggle >}}

min          | 
-------------|------
description  | Minimum threshold for the metric for [metric threshold evaluation][79]. You must provide a thresholds `min` value if you do not provide a `max` value.
required     | false (if a thresholds `max` value is provided)
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
min: '2'
{{< /code >}}
{{< code json >}}
{
  "min": "2"
}
{{< /code >}}
{{< /language-toggle >}}

status       | 
-------------|------
description  | Event [check status][77] to use if the check's output metric value is equal to or greater than the specified `max` threshold or equal to or less than the specified `min` threshold in [metric threshold evaluation][79].{{% notice note %}}
**NOTE**: Sensu only overrides the event check status if it is less than the specified threshold `status` value.
{{% /notice %}} You can specify any status value, but [event annotations based on threshold status][78] will display `unknown` if the status does not equal `0`, `1`, or `2`.
required     | true
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
status: 2
{{< /code >}}
{{< code json >}}
{
  "status": 2
}
{{< /code >}}
{{< /language-toggle >}}

#### `subdues` attributes

begin        | 
-------------|------
description  | Date and time at which the subdue should begin. In [RFC 3339][84] format with numeric zone offset (`2022-01-01T07:30:00-07:00` or `2022-01-01T14:30:00Z`). 
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
begin: "2022-04-18T17:00:00-07:00"
{{< /code >}}
{{< code json >}}
{
  "begin": "2022-04-18T17:00:00-07:00"
}
{{< /code >}}
{{< /language-toggle >}}

end          | 
-------------|------
description  | Date and time at which the subdue should end. In [RFC 3339][84] format with numeric zone offset (`2022-01-01T07:30:00-07:00` or `2022-01-01T14:30:00Z`).
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
end: "2022-04-19T08:00:00-07:00"
{{< /code >}}
{{< code json >}}
{
  "end": "2022-04-19T08:00:00-07:00"
}
{{< /code >}}
{{< /language-toggle >}}

repeat       | 
-------------|------
description  | Interval at which the subdue should repeat. `weekdays` includes Mondays, Tuesdays, Wednesdays, Thursdays, and Fridays. `weekends` includes Saturdays and Sundays. Read [Subdues and repeat][85] for more information.{{% notice note %}}
**NOTE**: Check subdue repeats are based on the specified `begin` and `end` times and not duration or the difference between the `begin` and `end` times.
{{% /notice %}}
required     | false
type         | Array
allowed values | `mondays`, `tuesdays`, `wednesdays`, `thursdays`, `fridays`, `saturdays`, `sundays`, `weekdays`, `weekends`, `daily`, `weekly`, `monthly`, `annually`
example      | {{< language-toggle >}}
{{< code yml >}}
repeat:
- weekdays
{{< /code >}}
{{< code json >}}
{
  "repeat": [
    "weekdays"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

## Metric check example

The following example shows the resource definition for a check that collects [metrics][68] in Nagios Performance Data format:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  annotations:
    slack-channel: '#monitoring'
  labels:
    region: us-west-1
  name: collect-metrics
spec:
  check_hooks: null
  command: collect.sh
  discard_output: true
  env_vars: null
  handlers: []
  high_flap_threshold: 0
  interval: 10
  low_flap_threshold: 0
  output_metric_format: prometheus_text
  output_metric_tags:
  - name: instance
    value: '{{ .name }}'
  - name: namespace
    value: '{{ .namespace }}'
  - name: service
    value: '{{ .labels.service }}'
  output_metric_thresholds:
    - name: system_mem_used
      tags: null
      null_status: 1
      thresholds:
      - max: "75.0"
        min: ""
        status: 1
      - max: "90.0"
        min: ""
        status: 2
    - name: system_host_processes
      tags:
      - name: namespace
        value: production
      null_status: 1
      thresholds:
      - max: "50"
        min: "5"
        status: 1
      - max: "75"
        min: "2"
        status: 2
  pipelines:
  - type: Pipeline
    api_version: core/v2
    name: prometheus_gateway_workflows
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
    "annotations": {
      "slack-channel": "#monitoring"
    },
    "labels": {
      "region": "us-west-1"
    },
    "name": "collect-metrics"
  },
  "spec": {
    "check_hooks": null,
    "command": "collect.sh",
    "discard_output": true,
    "env_vars": null,
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 10,
    "low_flap_threshold": 0,
    "output_metric_format": "prometheus_text",
    "output_metric_tags": [
      {
        "name": "instance",
        "value": "{{ .name }}"
      },
      {
        "name": "namespace",
        "value": "{{ .namespace }}"
      },
      {
        "name": "service",
        "value": "{{ .labels.service }}"
      }
    ],
    "output_metric_thresholds": [
      {
        "name": "system_mem_used",
        "tags": null,
        "null_status": 1,
        "thresholds": [
          {
            "max": "75.0",
            "min": "",
            "status": 1
          },
          {
            "max": "90.0",
            "min": "",
            "status": 2
          }
        ]
      },
      {
        "name": "system_host_processes",
        "tags": [
          {
            "name": "namespace",
            "value": "production"
          }
        ],
        "null_status": 1,
        "thresholds": [
          {
            "max": "50",
            "min": "5",
            "status": 1
          },
          {
            "max": "75",
            "min": "2",
            "status": 2
          }
        ]
      }
    ],
    "pipelines": [
      {
        "type": "Pipeline",
        "api_version": "core/v2",
        "name": "prometheus_gateway_workflows"
      }
    ],
    "proxy_entity_name": "",
    "publish": true,
    "round_robin": false,
    "runtime_assets": null,
    "stdin": false,
    "subscriptions": [
      "system"
    ],
    "timeout": 0,
    "ttl": 0
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Check example that uses secrets management

The check in the following example uses [secrets management][59] to keep a GitHub token private.
Learn more about secrets management for your Sensu configuration in the [secrets][56] and [secrets providers][57] references.

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: ping-github-api
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
    "name": "ping-github-api"
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

## Check example with a PowerShell script command

If you use a PowerShell script in your check command, make sure to include the `-f` flag in the command.
The `-f` flag ensures that the proper exit code is passed into Sensu.
For example:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: interval_test
spec:
  command: powershell.exe -f c:\\users\\tester\\test.ps1
  subscriptions:
  - system
  interval: 60
  pipelines:
  - type: Pipeline
    api_version: core/v2
    name: interval_pipeline
  publish: true
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "interval_test"
  },
  "spec": {
    "command": "powershell.exe -f c:\\\\users\\ ester\\ est.ps1",
    "subscriptions": [
      "system"
    ],
    "interval": 60,
    "pipelines": [
      {
        "type": "Pipeline",
        "api_version": "core/v2",
        "name": "interval_pipeline"
      }
    ],
    "publish": true
  }
}
{{< /code >}}

{{< /language-toggle >}}

The dynamic runtime asset reference includes an [example check definition that uses the asset path][60] to correctly capture exit status codes from PowerShell plugins distributed as dynamic runtime assets.


[1]: #subscription-checks
[2]: https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern
[3]: https://en.wikipedia.org/wiki/Standard_streams
[4]: #check-commands
[5]: ../tokens/
[6]: ../hooks/
[7]: /sensu-core/latest/reference/checks/#standalone-checks
[8]: ../../../operations/control-access/rbac/
[9]: ../../../plugins/assets/
[10]: #proxy-requests-attributes
[11]: ../../observe-filter/sensu-query-expressions/
[12]: ../monitor-server-resources/
[13]: #check-attributes
[14]: https://en.wikipedia.org/wiki/Cron#CRON_expression
[15]: https://godoc.org/github.com/robfig/cron#hdr-Predefined_schedules
[16]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/flapping.html
[17]: #subdue-attributes
[18]: https://prometheus.io/docs/instrumenting/exposition_formats/#text-based-format
[19]: #output-metric-tags
[20]: ../../observe-entities/#proxy-entities
[21]: ../../observe-entities/entities/#spec-attributes
[22]: #output_metric_tags-attributes
[23]: ../collect-metrics-with-checks/
[24]: ../../observe-events/events/
[25]: #metadata-attributes
[26]: ../../../operations/control-access/namespaces/
[27]: ../../observe-filter/filters/
[28]: ../../observe-entities/monitor-external-resources/
[29]: https://bonsai.sensu.io
[30]: https://en.wikipedia.org/wiki/Cron#Time_zone_handling
[31]: #ttl-attribute
[32]: #proxy-entity-name-attribute
[33]: #proxy-checks
[34]: ../../../api/core/checks/#checkscheckexecute-post
[35]: #use-a-proxy-check-to-monitor-a-proxy-entity
[36]: #use-a-proxy-check-to-monitor-multiple-proxy-entities
[37]: #proxy-requests-top-level
[38]: #interval-scheduling
[39]: #check-token-substitution
[40]: ../../observe-entities/entities#manage-entity-labels
[41]: ../../../sensuctl/create-manage-resources/#create-resources
[42]: #spec-attributes
[43]: #round-robin-attribute
[44]: #proxy-entity-name-attribute
[45]: #cron-scheduling
[46]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/perfdata.html
[47]: https://graphite.readthedocs.io/en/latest/feeding-carbon.html#the-plaintext-protocol
[48]: https://docs.influxdata.com/enterprise_influxdb/v1.9/write_protocols/line_protocol_reference/
[49]: http://opentsdb.net/docs/build/html/user_guide/writing/index.html#data-specification
[50]: ../../observe-events/events/#metrics-attribute
[51]: https://bonsai.sensu.io/assets/sensu/sensu-influxdb-handler
[52]: #round-robin-checks
[53]: https://regex101.com/r/zo9mQU/2
[54]: ../../../api/#response-filtering
[55]: ../../../sensuctl/filter-responses/
[56]: ../../../operations/manage-secrets/secrets/
[57]: ../../../operations/manage-secrets/secrets-providers/
[58]: ../../../web-ui/search#search-for-labels
[59]: ../../../operations/manage-secrets/secrets-management/
[60]: ../../../plugins/assets#dynamic-runtime-asset-path
[61]: ../../../web-ui/search/
[62]: ../../observe-events/events/#flap-detection-algorithm
[63]: #ad-hoc-scheduling
[64]: ../subscriptions/
[65]: ../../../operations/deploy-sensu/datastore/
[66]: ../../../operations/deploy-sensu/datastore/#round-robin-postgresql
[67]: #event-storage-for-round-robin-scheduling
[68]: ../metrics/
[69]: ../../observe-process/pipelines/
[70]: #pipelines-attributes
[71]: #example-proxy-check-using-proxy_requests
[72]: #splay
[73]: #splay-coverage
[75]: #thresholds-attributes
[76]: #tags-attributes
[77]: ../../observe-events/events/#check-status-attribute
[78]: ../metrics/#add-event-annotations-based-on-metric-threshold-evaluation
[79]: ../metrics/#metric-threshold-evaluation
[80]: #secrets-attributes
[81]: ../../observe-events/events/#points-attributes
[82]: #check-subdues-attribute
[83]: #subdues-attributes
[84]: https://www.ietf.org/rfc/rfc3339.txt
[85]: #subdues-and-repeat
[86]: ../../observe-entities/entities/#proxy-entities-and-round-robin-scheduling
