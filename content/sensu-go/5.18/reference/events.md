---
title: "Events"
description: "An event is a generic container that Sensu uses to provide context for checks and metrics. You can use events to represent the state of your infrastructure and create automated monitoring workflows. Read the reference doc to learn about events."
weight: 90
version: "5.18"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.18:
    parent: reference
---

- [Check-only events](#check-only-events)
- [Metric-only events](#metric-only-events)
- [Check and metric events](#check-and-metric-events)
- [Create events using the Sensu agent](#create-events-using-the-sensu-agent)
- [Create events using the events API](#create-events-using-the-events-api)
- [Manage events](#manage-events): [View events](#view-events) | [Delete events](#delete-events) | [Resolve events](#resolve-events)
- [Event format](#event-format)
- [Use event data](#use-event-data)
  - [Occurrences](#occurrences-and-occurrences-watermark)
- [Events specification](#events-specification)
	- [Top-level attributes](#top-level-attributes) | [Spec attributes](#spec-attributes) | [Check attributes](#check-attributes) | [Metric attributes](#metric-attributes)
- [Examples](#examples)

An event is a generic container used by Sensu to provide context to checks and metrics.
The context, called event data, contains information about the originating entity and the corresponding check or metric result.
An event must contain a check or metrics.
In certain cases, an event can contain both.
These generic containers allow Sensu to handle different types of events in the pipeline.
Because events are polymorphic in nature, it is important to never assume their contents (or lack of content).

### Check-only events

A Sensu event is created every time a check result is processed by the Sensu server, regardless of the status indicated by the check result.
The agent creates an event upon receipt of the check execution result.
The agent will execute any configured [hooks][4] the check might have.
From there, the result is forwarded to the Sensu backend for processing.
Potentially noteworthy events may be processed by one or more event handlers, for example to send an email or invoke an automated action.

### Metric-only events

Sensu events can also be created when the agent receives metrics through the [StatsD listener][5].
The agent will translate the StatsD metrics to Sensu metric format and place them inside an event.
Because these events do not contain checks, they bypass the store and are sent to the event pipeline and corresponding event handlers.

### Check and metric events

Events that contain _both_ a check and metrics most likely originated from [check output metric extraction][6].
If a check is configured for metric extraction, the agent will parse the check output and transform it to Sensu metric format.
Both the check results and resulting (extracted) metrics are stored inside the event.
Event handlers from `event.Check.Handlers` and `event.Metrics.Handlers` will be invoked.

## Create events using the Sensu agent

The Sensu agent is a powerful event producer and monitoring automation tool.
You can use Sensu agents to produce events automatically using service checks and metric checks.
Sensu agents can also act as a collector for metrics throughout your infrastructure.

- [Create events using service checks][10]
- [Create events using metric checks][6]
- [Create events using the agent API][11]
- [Create events using the agent TCP and UDP sockets][12]
- [Create events using the StatsD listener][13]

## Create events using the events API

You can send events directly to the Sensu pipeline using the [events API][16].
To create an event, send a JSON event definition to the [events API PUT endpoint][14].

If you use the events API to create a new event referencing an entity that does not already exist, the sensu-backend will automatically create a proxy entity when the event is published.

## Manage events

You can manage events using the [Sensu dashboard][15], [events API][16], and [sensuctl][17] command line tool.

### View events

To list all events:

{{< highlight shell >}}
sensuctl event list
{{< /highlight >}}

To show event details in the default [output format][18]:

{{< highlight shell >}}
sensuctl event info entity-name check-name
{{< /highlight >}}

With both the `list` and `info` commands, you can specify an [output format][18] using the `--format` flag:

- `yaml` or `wrapped-json` formats for use with [`sensuctl create`][8]
- `json` format for use with the [events API][16]

{{< highlight shell >}}
sensuctl event info entity-name check-name --format yaml
{{< /highlight >}}

### Delete events

To delete an event:

{{< highlight shell >}}
sensuctl event delete entity-name check-name
{{< /highlight >}}

You can use the `--skip-confirm` flag to skip the confirmation step:

{{< highlight shell >}}
sensuctl event delete entity-name check-name --skip-confirm
{{< /highlight >}}

You should see a confirmation message upon success:

{{< highlight shell >}}
Deleted
{{< /highlight >}}

### Resolve events

You can use sensuctl to change the status of an event to `0` (OK).
Events resolved by sensuctl include the output message `Resolved manually by sensuctl`.

{{< highlight shell >}}
sensuctl event resolve entity-name check-name
{{< /highlight >}}

You should see a confirmation message upon success:

{{< highlight shell >}}
Resolved
{{< /highlight >}}

## Event format

Sensu events contain:

- `entity` scope (required)
  - Information about the source of the event, including any attributes defined in the [entity specification][2]
- `check` scope (optional if the `metrics` scope is present)
  - Information about how the event was created, including any attributes defined in the [check specification][20]
  - Information about the event and its history, including any check attributes defined in the [event specification on this page][21]
- `metrics` scope (optional if the `check` scope is present)
  - Metric points in [Sensu metric format][22]
- `timestamp`
  - Time that the event occurred in seconds since the Unix epoch
- `event_id`
  - Universally unique identifier (UUID) for the event

## Use event data

Event data is a powerful tool for automating monitoring workflows.
For example, you can [reduce alert fatigue][23] by filtering events based on the event `occurrences` attribute.

### Occurrences and occurrences watermark

The `occurrences` and `occurrences_watermark` event attributes give you context about recent events for a given entity and check.
You can use these attributes within [event filters][24] to fine-tune incident notifications and reduce alert fatigue.

Starting at `1`, the `occurrences` attribute increments for events with the same [status][25] as the preceding event (OK, WARNING, CRITICAL, or UNKNOWN) and resets whenever the status changes.
You can use the `occurrences` attribute to create a [state-change-only filter][27] or an [interval filter][28].

The `occurrences_watermark` attribute gives you useful information when looking at events that change status between non-OK (WARNING, CRITICAL, or UNKNOWN) and OK.
For these resolution events, the `occurrences_watermark` attribute tells you the number of preceding events with a non-OK status.
Sensu resets `occurrences_watermark` to `1` on the first non-OK event.
Within a sequence of only OK or only non-OK events, Sensu increments `occurrences_watermark` when the `occurrences` attribute is greater than the preceding `occurrences_watermark`.

The following table shows the occurrences attributes for a series of example events:

| event sequence   | `occurrences`   | `occurrences_watermark` |
| -----------------| --------------- | ----------------------- |
1. OK event        | `occurrences: 1`| `occurrences_watermark: 1`
2. OK event        | `occurrences: 2`| `occurrences_watermark: 2`
3. WARNING event   | `occurrences: 1`| `occurrences_watermark: 1`
4. WARNING event   | `occurrences: 2`| `occurrences_watermark: 2`
5. WARNING event   | `occurrences: 3`| `occurrences_watermark: 3`
6. CRITICAL event  | `occurrences: 1`| `occurrences_watermark: 3`
7. CRITICAL event  | `occurrences: 2`| `occurrences_watermark: 3`
8. CRITICAL event  | `occurrences: 3`| `occurrences_watermark: 3`
9. CRITICAL event  | `occurrences: 4`| `occurrences_watermark: 4`
10. OK event       | `occurrences: 1`| `occurrences_watermark: 4`
11. CRITICAL event | `occurrences: 1`| `occurrences_watermark: 1`

## Events specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][8] resource type. Events should always be type `Event`.
required     | Required for events in `wrapped-json` or `yaml` format for use with [`sensuctl create`][8].
type         | String
example      | {{< highlight shell >}}"type": "Event"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For events in this version of Sensu, `api_version` should always be `core/v2`.
required     | Required for events in `wrapped-json` or `yaml` format for use with [`sensuctl create`][8].
type         | String
example      | {{< highlight shell >}}"api_version": "core/v2"{{< /highlight >}}

metadata     | 
-------------|------
description  | Top-level scope that contains the event `namespace`. The `metadata` map is always at the top level of the check definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope.  See the [metadata attributes][29] for details.
required     | Required for events in `wrapped-json` or `yaml` format for use with [`sensuctl create`][8].
type         | Map of key-value pairs
example      | {{< highlight shell >}}"metadata": {
  "namespace": "default"
}{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes the event [spec attributes][9].
required     | Required for events in `wrapped-json` or `yaml` format for use with [`sensuctl create`][8].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"spec": {
  "check": {
    "check_hooks": null,
    "command": "/opt/sensu-plugins-ruby/embedded/bin/metrics-curl.rb -u \"http://localhost\"",
    "duration": 0.060790838,
    "env_vars": null,
    "executed": 1552506033,
    "handlers": [],
    "high_flap_threshold": 0,
    "history": [
      {
        "executed": 1552505833,
        "status": 0
      },
      {
        "executed": 1552505843,
        "status": 0
      }
    ],
    "interval": 10,
    "issued": 1552506033,
    "last_ok": 1552506033,
    "low_flap_threshold": 0,
    "metadata": {
      "name": "curl_timings",
      "namespace": "default"
    },
    "occurrences": 1,
    "occurrences_watermark": 1,
    "output": "sensu-go-sandbox.curl_timings.time_total 0.005 1552506033\nsensu-go-sandbox.curl_timings.time_namelookup 0.004",
    "output_metric_format": "graphite_plaintext",
    "output_metric_handlers": [
      "influx-db"
    ],
    "proxy_entity_name": "",
    "publish": true,
    "round_robin": false,
    "runtime_assets": [],
    "state": "passing",
    "status": 0,
    "stdin": false,
    "subdue": null,
    "subscriptions": [
      "entity:sensu-go-sandbox"
    ],
    "timeout": 0,
    "total_state_change": 0,
    "ttl": 0
  },
  "entity": {
    "deregister": false,
    "deregistration": {},
    "entity_class": "agent",
    "last_seen": 1552495139,
    "metadata": {
      "name": "sensu-go-sandbox",
      "namespace": "default"
    },
    "redact": [
      "password",
      "passwd",
      "pass",
      "api_key",
      "api_token",
      "access_key",
      "secret_key",
      "private_key",
      "secret"
    ],
    "subscriptions": [
      "entity:sensu-go-sandbox"
    ],
    "system": {
      "arch": "amd64",
      "hostname": "sensu-go-sandbox",
      "network": {
        "interfaces": [
          {
            "addresses": [
              "127.0.0.1/8",
              "::1/128"
            ],
            "name": "lo"
          },
          {
            "addresses": [
              "10.0.2.15/24",
              "fe80::5a94:f67a:1bfc:a579/64"
            ],
            "mac": "08:00:27:8b:c9:3f",
            "name": "eth0"
          }
        ]
      },
      "os": "linux",
      "platform": "centos",
      "platform_family": "rhel",
      "platform_version": "7.5.1804"
    },
    "user": "agent"
  },
  "metrics": {
    "handlers": [
      "influx-db"
    ],
    "points": [
      {
        "name": "sensu-go-sandbox.curl_timings.time_total",
        "tags": [],
        "timestamp": 1552506033,
        "value": 0.005
      },
      {
        "name": "sensu-go-sandbox.curl_timings.time_namelookup",
        "tags": [],
        "timestamp": 1552506033,
        "value": 0.004
      }
    ]
  },
  "timestamp": 1552506033,
  "event_id": "431a0085-96da-4521-863f-c38b480701e9"
}
{{< /highlight >}}

### Metadata attributes

| namespace  |      |
-------------|------
description  | [Sensu RBAC namespace][26] that this event belongs to.
required     | false
type         | String
default      | `default`
example      | {{< highlight shell >}}"namespace": "production"{{< /highlight >}}

### Spec attributes

|timestamp   |      |
-------------|------
description  | Time that the event occurred. In seconds since the Unix epoch.
required     | false
type         | Integer
default      | Time that the event occurred
example      | {{< highlight shell >}}"timestamp": 1522099512{{< /highlight >}}

event_id     |      |
-------------|------
description  | Universally unique identifier (UUID) for the event.
required     | false
type         | String
example      | {{< highlight shell >}}"event_id": "431a0085-96da-4521-863f-c38b480701e9"{{< /highlight >}}

|entity      |      |
-------------|------
description  | [Entity attributes][2] from the originating entity (agent or proxy). If you use the [events API][35] to create a new event referencing an entity that does not already exist, the sensu-backend will automatically create a proxy entity when the event is published.
type         | Map
required     | true
example      | {{< highlight shell >}}
"entity": {
  "deregister": false,
  "deregistration": {},
  "entity_class": "agent",
  "last_seen": 1552495139,
  "metadata": {
    "name": "sensu-go-sandbox",
    "namespace": "default"
  },
  "redact": [
    "password",
    "passwd",
    "pass",
    "api_key",
    "api_token",
    "access_key",
    "secret_key",
    "private_key",
    "secret"
  ],
  "subscriptions": [
    "entity:sensu-go-sandbox"
  ],
  "system": {
    "arch": "amd64",
    "hostname": "sensu-go-sandbox",
    "network": {
      "interfaces": [
        {
          "addresses": [
            "127.0.0.1/8",
            "::1/128"
          ],
          "name": "lo"
        },
        {
          "addresses": [
            "10.0.2.15/24",
            "fe80::5a94:f67a:1bfc:a579/64"
          ],
          "mac": "08:00:27:8b:c9:3f",
          "name": "eth0"
        }
      ]
    },
    "os": "linux",
    "platform": "centos",
    "platform_family": "rhel",
    "platform_version": "7.5.1804"
  },
  "user": "agent"
}
{{< /highlight >}}

|check       |      |
-------------|------
description  | [Check definition][1] used to create the event and information about the status and history of the event. The check scope includes attributes described in the [event specification][21] and the [check specification][20].
type         | Map
required     | true
example      | {{< highlight shell >}}
"check": {
  "check_hooks": null,
  "command": "/opt/sensu-plugins-ruby/embedded/bin/metrics-curl.rb -u \"http://localhost\"",
  "duration": 0.060790838,
  "env_vars": null,
  "executed": 1552506033,
  "handlers": [],
  "high_flap_threshold": 0,
  "history": [
    {
      "executed": 1552505833,
      "status": 0
    },
    {
      "executed": 1552505843,
      "status": 0
    }
  ],
  "interval": 10,
  "issued": 1552506033,
  "last_ok": 1552506033,
  "low_flap_threshold": 0,
  "metadata": {
    "name": "curl_timings",
    "namespace": "default"
  },
  "occurrences": 1,
  "occurrences_watermark": 1,
  "output": "sensu-go-sandbox.curl_timings.time_total 0.005",
  "output_metric_format": "graphite_plaintext",
  "output_metric_handlers": [
    "influx-db"
  ],
  "proxy_entity_name": "",
  "publish": true,
  "round_robin": false,
  "runtime_assets": [],
  "state": "passing",
  "status": 0,
  "stdin": false,
  "subdue": null,
  "subscriptions": [
    "entity:sensu-go-sandbox"
  ],
  "timeout": 0,
  "total_state_change": 0,
  "ttl": 0
}
{{< /highlight >}}

<a name="metrics"></a>

|metrics     |      |
-------------|------
description  | Metrics collected by the entity in Sensu metric format. See the [metric attributes][30].
type         | Map
required     | false
example      | {{< highlight shell >}}
"metrics": {
  "handlers": [
    "influx-db"
  ],
  "points": [
    {
      "name": "sensu-go-sandbox.curl_timings.time_total",
      "tags": [],
      "timestamp": 1552506033,
      "value": 0.005
    },
    {
      "name": "sensu-go-sandbox.curl_timings.time_namelookup",
      "tags": [],
      "timestamp": 1552506033,
      "value": 0.004
    }
  ]
}
{{< /highlight >}}

### Check attributes

Sensu events include a `check` scope that contains information about how the event was created, including any attributes defined in the [check specification][20], and information about the event and its history, including the attributes defined below.

duration     |      |
-------------|------
description  | Command execution time. In seconds.
required     | false
type         | Float
example      | {{< highlight shell >}}"duration": 1.903135228{{< /highlight >}}

executed     |      |
-------------|------
description  | Time at which the check request was executed.
required     | false
type         | Integer
example      | {{< highlight shell >}}"executed": 1522100915{{< /highlight >}}

history      |      |
-------------|------
description  | Check status history for the last 21 check executions. See [history attributes][32].
required     | false
type         | Array
example      | {{< highlight shell >}}
"history": [
  {
    "executed": 1552505983,
    "status": 0
  },
  {
    "executed": 1552505993,
    "status": 0
  }
]
{{< /highlight >}}

issued       |      |
-------------|------
description  | Time that the check request was issued. In seconds since the Unix epoch.
required     | false
type         | Integer
example      | {{< highlight shell >}}"issued": 1552506033{{< /highlight >}}

last_ok      |      |
-------------|------
description  | Last time that the check returned an OK status (`0`). In seconds since the Unix epoch.
required     | false
type         | Integer
example      | {{< highlight shell >}}"last_ok": 1552506033{{< /highlight >}}

occurrences  |      |
-------------|------
description  | Number of preceding events with the same status as the current event (OK, WARNING, CRITICAL, or UNKNOWN). Starting at `1`, the `occurrences` attribute increments for events with the same status as the preceding event and resets whenever the status changes. See [Use event data][31] for more information.
required     | false
type         | Integer greater than 0
example      | {{< highlight shell >}}"occurrences": 1{{< /highlight >}}

occurrences_watermark | |
-------------|------
description  | For incident and resolution events, the number of preceding events with an OK status (for incident events) or non-OK status (for resolution events). The `occurrences_watermark` attribute gives you useful information when looking at events that change status between OK (`0`)and non-OK (`1`-WARNING, `2`-CRITICAL, or UNKNOWN).<br><br>Sensu resets `occurrences_watermark` to `1` whenever an event for a given entity and check transitions between OK and non-OK. Within a sequence of only OK or only non-OK events, Sensu increments `occurrences_watermark` only when the `occurrences` attribute is greater than the preceding `occurrences_watermark`. See [Use event data][31] for more information.
required     | false
type         | Integer greater than 0
example      | {{< highlight shell >}}"occurrences_watermark": 1{{< /highlight >}}\

output       |      |
-------------|------
description  | Output from the execution of the check command.
required     | false
type         | String
example      | {{< highlight shell >}}
"output": "sensu-go-sandbox.curl_timings.time_total 0.005"
{{< /highlight >}}

state         |      |
-------------|------
description  | State of the check: `passing` (status `0`), `failing` (status other than `0`), or `flapping`. You can use the `low_flap_threshold` and `high_flap_threshold` [check attributes][33] to configure `flapping` state detection.
required     | false
type         | String
example      | {{< highlight shell >}}"state": "passing"{{< /highlight >}}

status       |      |
-------------|------
description  | Exit status code produced by the check.<ul><li><code>0</code> indicates “OK”</li><li><code>1</code> indicates “WARNING”</li><li><code>2</code> indicates “CRITICAL”</li></ul>Exit status codes other than <code>0</code>, <code>1</code>, or <code>2</code> indicate an “UNKNOWN” or custom status.
required     | false
type         | Integer
example      | {{< highlight shell >}}"status": 0{{< /highlight >}}

total_state_change | |
-------------|------
description  | Total state change percentage for the check's history.
required     | false
type         | Integer
example      | {{< highlight shell >}}"total_state_change": 0{{< /highlight >}}

#### History attributes

executed     |      |
-------------|------
description  | Time at which the check request was executed. In seconds since the Unix epoch.
required     | false
type         | Integer
example      | {{< highlight shell >}}"executed": 1522100915{{< /highlight >}}

status       |      |
-------------|------
description  | Exit status code produced by the check.<ul><li><code>0</code> indicates “OK”</li><li><code>1</code> indicates “WARNING”</li><li><code>2</code> indicates “CRITICAL”</li></ul>Exit status codes other than <code>0</code>, <code>1</code>, or <code>2</code> indicate an “UNKNOWN” or custom status.
required     | false
type         | Integer
example      | {{< highlight shell >}}"status": 0{{< /highlight >}}

### Metric attributes

handlers     |      |
-------------|------
description  | Array of Sensu handlers to use for events created by the check. Each array item must be a string.
required     | false
type         | Array
example      | {{< highlight shell >}}
"handlers": [
  "influx-db"
]
{{< /highlight >}}

points       |      |
-------------|------
description  | Metric data points, including a name, timestamp, value, and tags. See [points attributes][34].
required     | false
type         | Array
example      | {{< highlight shell >}}
"points": [
  {
    "name": "sensu-go-sandbox.curl_timings.time_total",
    "tags": [
      {
        "name": "response_time_in_ms",
        "value": "101"
      }
    ],
    "timestamp": 1552506033,
    "value": 0.005
  },
  {
    "name": "sensu-go-sandbox.curl_timings.time_namelookup",
    "tags": [
      {
        "name": "namelookup_time_in_ms",
        "value": "57"
      }
    ],
    "timestamp": 1552506033,
    "value": 0.004
  }
]
{{< /highlight >}}

#### Points attributes

name         |      |
-------------|------
description  | Metric name in the format `$entity.$check.$metric` where `$entity` is the entity name, `$check` is the check name, and `$metric` is the metric name.
required     | false
type         | String
example      | {{< highlight shell >}}"name": "sensu-go-sandbox.curl_timings.time_total"{{< /highlight >}}

tags         |      |
-------------|------
description  | Optional tags to include with the metric. Each element of the array must be a hash that contains two key value pairs: the `name` of the tag and the `value`. Both values of the pairs must be strings.
required     | false
type         | Array
example      | {{< highlight shell >}}
"tags": [
  {
    "name": "response_time_in_ms",
    "value": "101"
  }
]
{{< /highlight >}}

timestamp    |      |
-------------|------
description  | Time at which the metric was collected. In seconds since the Unix epoch.
required     | false
type         | Integer
example      | {{< highlight shell >}}"timestamp": 1552506033{{< /highlight >}}

value        |      |
-------------|------
description  | Metric value.
required     | false
type         | Float
example      | {{< highlight shell >}}"value": 0.005{{< /highlight >}}

## Examples

### Example check-only event data

{{< language-toggle >}}

{{< highlight yml >}}
type: Event
api_version: core/v2
metadata:
  namespace: default
spec:
  check:
    check_hooks: null
    command: check-cpu.sh -w 75 -c 90
    duration: 1.07055808
    env_vars: null
    executed: 1552594757
    handlers: []
    high_flap_threshold: 0
    history:
    - executed: 1552594757
      status: 0
    interval: 60
    issued: 1552594757
    last_ok: 1552594758
    low_flap_threshold: 0
    metadata:
      name: check-cpu
      namespace: default
    occurrences: 1
    occurrences_watermark: 1
    output: |
      CPU OK - Usage:3.96
    output_metric_format: ""
    output_metric_handlers: []
    proxy_entity_name: ""
    publish: true
    round_robin: false
    runtime_assets: []
    state: passing
    status: 0
    stdin: false
    subdue: null
    subscriptions:
    - linux
    timeout: 0
    total_state_change: 0
    ttl: 0
  entity:
    deregister: false
    deregistration: {}
    entity_class: agent
    last_seen: 1552594641
    metadata:
      name: sensu-centos
      namespace: default
    redact:
    - password
    - passwd
    - pass
    - api_key
    - api_token
    - access_key
    - secret_key
    - private_key
    - secret
    subscriptions:
    - linux
    - entity:sensu-centos
    system:
      arch: amd64
      hostname: sensu-centos
      network:
        interfaces:
        - addresses:
          - 127.0.0.1/8
          - ::1/128
          name: lo
        - addresses:
          - 10.0.2.15/24
          - fe80::9688:67ca:3d78:ced9/64
          mac: 08:00:27:11:ad:d2
          name: enp0s3
        - addresses:
          - 172.28.128.3/24
          - fe80::a00:27ff:fe6b:c1e9/64
          mac: 08:00:27:6b:c1:e9
          name: enp0s8
      os: linux
      platform: centos
      platform_family: rhel
      platform_version: 7.4.1708
    user: agent
  timestamp: 1552594758
  event_id: 3a5948f3-6ffd-4ea2-a41e-334f4a72ca2f
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Event",
  "api_version": "core/v2",
  "metadata": {
    "namespace": "default"
  },
  "spec": {
    "check": {
      "check_hooks": null,
      "command": "check-cpu.sh -w 75 -c 90",
      "duration": 1.07055808,
      "env_vars": null,
      "executed": 1552594757,
      "handlers": [],
      "high_flap_threshold": 0,
      "history": [
        {
          "executed": 1552594757,
          "status": 0
        }
      ],
      "interval": 60,
      "issued": 1552594757,
      "last_ok": 1552594758,
      "low_flap_threshold": 0,
      "metadata": {
        "name": "check-cpu",
        "namespace": "default"
      },
      "occurrences": 1,
      "occurrences_watermark": 1,
      "output": "CPU OK - Usage:3.96\n",
      "output_metric_format": "",
      "output_metric_handlers": [],
      "proxy_entity_name": "",
      "publish": true,
      "round_robin": false,
      "runtime_assets": [],
      "state": "passing",
      "status": 0,
      "stdin": false,
      "subdue": null,
      "subscriptions": [
        "linux"
      ],
      "timeout": 0,
      "total_state_change": 0,
      "ttl": 0
    },
    "entity": {
      "deregister": false,
      "deregistration": {},
      "entity_class": "agent",
      "last_seen": 1552594641,
      "metadata": {
        "name": "sensu-centos",
        "namespace": "default"
      },
      "redact": [
        "password",
        "passwd",
        "pass",
        "api_key",
        "api_token",
        "access_key",
        "secret_key",
        "private_key",
        "secret"
      ],
      "subscriptions": [
        "linux",
        "entity:sensu-centos"
      ],
      "system": {
        "arch": "amd64",
        "hostname": "sensu-centos",
        "network": {
          "interfaces": [
            {
              "addresses": [
                "127.0.0.1/8",
                "::1/128"
              ],
              "name": "lo"
            },
            {
              "addresses": [
                "10.0.2.15/24",
                "fe80::9688:67ca:3d78:ced9/64"
              ],
              "mac": "08:00:27:11:ad:d2",
              "name": "enp0s3"
            },
            {
              "addresses": [
                "172.28.128.3/24",
                "fe80::a00:27ff:fe6b:c1e9/64"
              ],
              "mac": "08:00:27:6b:c1:e9",
              "name": "enp0s8"
            }
          ]
        },
        "os": "linux",
        "platform": "centos",
        "platform_family": "rhel",
        "platform_version": "7.4.1708"
      },
      "user": "agent"
    },
    "timestamp": 1552594758,
    "event_id": "3a5948f3-6ffd-4ea2-a41e-334f4a72ca2f"
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

### Example event with check and metric data

{{< language-toggle >}}

{{< highlight yml >}}
type: Event
api_version: core/v2
metadata:
  namespace: default
spec:
  check:
    check_hooks: null
    command: /opt/sensu-plugins-ruby/embedded/bin/metrics-curl.rb -u "http://localhost"
    duration: 0.060790838
    env_vars: null
    executed: 1552506033
    handlers: []
    high_flap_threshold: 0
    history:
    - executed: 1552505833
      status: 0
    - executed: 1552505843
      status: 0
    interval: 10
    issued: 1552506033
    last_ok: 1552506033
    low_flap_threshold: 0
    metadata:
      name: curl_timings
      namespace: default
    occurrences: 1
    occurrences_watermark: 1
    output: |-
      sensu-go-sandbox.curl_timings.time_total 0.005 1552506033
      sensu-go-sandbox.curl_timings.time_namelookup 0.004
    output_metric_format: graphite_plaintext
    output_metric_handlers:
    - influx-db
    proxy_entity_name: ""
    publish: true
    round_robin: false
    runtime_assets: []
    state: passing
    status: 0
    stdin: false
    subdue: null
    subscriptions:
    - entity:sensu-go-sandbox
    timeout: 0
    total_state_change: 0
    ttl: 0
  entity:
    deregister: false
    deregistration: {}
    entity_class: agent
    last_seen: 1552495139
    metadata:
      name: sensu-go-sandbox
      namespace: default
    redact:
    - password
    - passwd
    - pass
    - api_key
    - api_token
    - access_key
    - secret_key
    - private_key
    - secret
    subscriptions:
    - entity:sensu-go-sandbox
    system:
      arch: amd64
      hostname: sensu-go-sandbox
      network:
        interfaces:
        - addresses:
          - 127.0.0.1/8
          - ::1/128
          name: lo
        - addresses:
          - 10.0.2.15/24
          - fe80::5a94:f67a:1bfc:a579/64
          mac: 08:00:27:8b:c9:3f
          name: eth0
      os: linux
      platform: centos
      platform_family: rhel
      platform_version: 7.5.1804
    user: agent
  metrics:
    handlers:
    - influx-db
    points:
    - name: sensu-go-sandbox.curl_timings.time_total
      tags: []
      timestamp: 1552506033
      value: 0.005
    - name: sensu-go-sandbox.curl_timings.time_namelookup
      tags: []
      timestamp: 1552506033
      value: 0.004
  timestamp: 1552506033
  event_id: 431a0085-96da-4521-863f-c38b480701e9
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Event",
  "api_version": "core/v2",
  "metadata": {
    "namespace": "default"
  },
  "spec": {
    "check": {
      "check_hooks": null,
      "command": "/opt/sensu-plugins-ruby/embedded/bin/metrics-curl.rb -u \"http://localhost\"",
      "duration": 0.060790838,
      "env_vars": null,
      "executed": 1552506033,
      "handlers": [],
      "high_flap_threshold": 0,
      "history": [
        {
          "executed": 1552505833,
          "status": 0
        },
        {
          "executed": 1552505843,
          "status": 0
        }
      ],
      "interval": 10,
      "issued": 1552506033,
      "last_ok": 1552506033,
      "low_flap_threshold": 0,
      "metadata": {
        "name": "curl_timings",
        "namespace": "default"
      },
      "occurrences": 1,
      "occurrences_watermark": 1,
      "output": "sensu-go-sandbox.curl_timings.time_total 0.005 1552506033\nsensu-go-sandbox.curl_timings.time_namelookup 0.004",
      "output_metric_format": "graphite_plaintext",
      "output_metric_handlers": [
        "influx-db"
      ],
      "proxy_entity_name": "",
      "publish": true,
      "round_robin": false,
      "runtime_assets": [],
      "state": "passing",
      "status": 0,
      "stdin": false,
      "subdue": null,
      "subscriptions": [
        "entity:sensu-go-sandbox"
      ],
      "timeout": 0,
      "total_state_change": 0,
      "ttl": 0
    },
    "entity": {
      "deregister": false,
      "deregistration": {},
      "entity_class": "agent",
      "last_seen": 1552495139,
      "metadata": {
        "name": "sensu-go-sandbox",
        "namespace": "default"
      },
      "redact": [
        "password",
        "passwd",
        "pass",
        "api_key",
        "api_token",
        "access_key",
        "secret_key",
        "private_key",
        "secret"
      ],
      "subscriptions": [
        "entity:sensu-go-sandbox"
      ],
      "system": {
        "arch": "amd64",
        "hostname": "sensu-go-sandbox",
        "network": {
          "interfaces": [
            {
              "addresses": [
                "127.0.0.1/8",
                "::1/128"
              ],
              "name": "lo"
            },
            {
              "addresses": [
                "10.0.2.15/24",
                "fe80::5a94:f67a:1bfc:a579/64"
              ],
              "mac": "08:00:27:8b:c9:3f",
              "name": "eth0"
            }
          ]
        },
        "os": "linux",
        "platform": "centos",
        "platform_family": "rhel",
        "platform_version": "7.5.1804"
      },
      "user": "agent"
    },
    "metrics": {
      "handlers": [
        "influx-db"
      ],
      "points": [
        {
          "name": "sensu-go-sandbox.curl_timings.time_total",
          "tags": [],
          "timestamp": 1552506033,
          "value": 0.005
        },
        {
          "name": "sensu-go-sandbox.curl_timings.time_namelookup",
          "tags": [],
          "timestamp": 1552506033,
          "value": 0.004
        }
      ]
    },
    "timestamp": 1552506033,
    "event_id": "431a0085-96da-4521-863f-c38b480701e9"
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

### Example metric-only event

{{< language-toggle >}}

{{< highlight yml >}}
type: Event
api_version: core/v2
metadata:
  namespace: default
spec:
  entity:
    deregister: false
    deregistration: {}
    entity_class: agent
    last_seen: 1552495139
    metadata:
      name: sensu-go-sandbox
      namespace: default
    redact:
    - password
    - passwd
    - pass
    - api_key
    - api_token
    - access_key
    - secret_key
    - private_key
    - secret
    subscriptions:
    - entity:sensu-go-sandbox
    system:
      arch: amd64
      hostname: sensu-go-sandbox
      network:
        interfaces:
        - addresses:
          - 127.0.0.1/8
          - ::1/128
          name: lo
        - addresses:
          - 10.0.2.15/24
          - fe80::5a94:f67a:1bfc:a579/64
          mac: 08:00:27:8b:c9:3f
          name: eth0
      os: linux
      platform: centos
      platform_family: rhel
      platform_version: 7.5.1804
    user: agent
  metrics:
    handlers:
    - influx-db
    points:
    - name: sensu-go-sandbox.curl_timings.time_total
      tags: []
      timestamp: 1552506033
      value: 0.005
    - name: sensu-go-sandbox.curl_timings.time_namelookup
      tags: []
      timestamp: 1552506033
      value: 0.004
  timestamp: 1552506033
  event_id: 47ea07cd-1e50-4897-9e6d-09cd39ec5180
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "Event",
  "api_version": "core/v2",
  "metadata": {
    "namespace": "default"
  },
  "spec": {
    "entity": {
      "deregister": false,
      "deregistration": {},
      "entity_class": "agent",
      "last_seen": 1552495139,
      "metadata": {
        "name": "sensu-go-sandbox",
        "namespace": "default"
      },
      "redact": [
        "password",
        "passwd",
        "pass",
        "api_key",
        "api_token",
        "access_key",
        "secret_key",
        "private_key",
        "secret"
      ],
      "subscriptions": [
        "entity:sensu-go-sandbox"
      ],
      "system": {
        "arch": "amd64",
        "hostname": "sensu-go-sandbox",
        "network": {
          "interfaces": [
            {
              "addresses": [
                "127.0.0.1/8",
                "::1/128"
              ],
              "name": "lo"
            },
            {
              "addresses": [
                "10.0.2.15/24",
                "fe80::5a94:f67a:1bfc:a579/64"
              ],
              "mac": "08:00:27:8b:c9:3f",
              "name": "eth0"
            }
          ]
        },
        "os": "linux",
        "platform": "centos",
        "platform_family": "rhel",
        "platform_version": "7.5.1804"
      },
      "user": "agent"
    },
    "metrics": {
      "handlers": [
        "influx-db"
      ],
      "points": [
        {
          "name": "sensu-go-sandbox.curl_timings.time_total",
          "tags": [],
          "timestamp": 1552506033,
          "value": 0.005
        },
        {
          "name": "sensu-go-sandbox.curl_timings.time_namelookup",
          "tags": [],
          "timestamp": 1552506033,
          "value": 0.004
        }
      ]
    },
    "timestamp": 1552506033,
    "event_id": "47ea07cd-1e50-4897-9e6d-09cd39ec5180"
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

[1]: ../checks/
[2]: ../entities#entities-specification
[3]: ../entities/
[4]: ../hooks/
[5]: ../../guides/aggregate-metrics-statsd/
[6]: ../../guides/extract-metrics-with-checks/
[7]: ../checks/#check-specification
[8]: ../../sensuctl/reference#create-resources
[9]: #spec-attributes
[10]: ../agent#create-monitoring-events-using-service-checks
[11]: ../agent#create-monitoring-events-using-the-agent-api
[12]: ../agent#create-monitoring-events-using-the-agent-tcp-and-udp-sockets
[13]: ../agent#create-monitoring-events-using-the-statsd-listener
[14]: ../../api/events#eventsentitycheck-put
[15]: ../../dashboard/overview/
[16]: ../../api/events/
[17]: ../../sensuctl/reference/
[18]: ../../sensuctl/reference/#preferred-output-format
[20]: ../checks#check-specification
[21]: #check-attributes
[22]: #metrics
[23]: ../../guides/reduce-alert-fatigue/
[24]: ../filters/
[25]: ../checks/#check-result-specification
[26]: ../rbac#namespaces
[27]: ../filters/#handle-state-change-only
[28]: ../filters/#handle-repeated-events
[29]: #metadata-attributes
[30]: #metric-attributes
[31]: #use-event-data
[32]: #history-attributes
[33]: ../checks#spec-attributes
[34]: #points-attributes
[35]: ../../api/events#events-post
