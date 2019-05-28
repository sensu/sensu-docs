---
title: "Events"
description: "An event is a generic container used by Sensu to provide context for checks and metrics. You can use events to represent the state of your infrastructure and create automated monitoring workflows. Read the reference doc to learn about events."
weight: 10
version: "5.4"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.4:
    parent: reference
---


- [How do events work?](#how-do-events-work)
- [Creating events using the Sensu agent](#creating-events-using-the-sensu-agent)
- [Creating events using the events API](#creating-events-using-the-events-api)
- [Managing events](#managing-events)
  - [Deleting events](#deleting-events)
  - [Resolving events](#resolving-events)
- [Event format](#event-format)
- [Using event data](#using-event-data)
- [Events specification](#events-specification)
	- [Top-level attributes](#top-level-attributes)
	- [Spec attributes](#spec-attributes)
	- [Check attributes](#check-attributes)
	- [Metric attributes](#metric-attributes)
- [Examples](#examples)

## How do events work?

An event is a generic container used by Sensu to provide context to checks
and/or metrics. The context, called "event data," contains information about the
originating entity and the corresponding check/metric result. An event must
contain a check or metrics, and in certain cases, an event can contain both.
These generic containers allow Sensu to handle different types of events in the
pipeline. Since events are polymorphic in nature, it is important to never
assume their contents, or lack-thereof.

### Check-only events

A Sensu event is created every time a check result is processed by the Sensu
server, regardless of the status indicated by the check result. An event is
created by the agent on receipt of the check execution result. The agent will
execute any configured [hooks][4] the check might have. From there, it is
forwarded to the Sensu backend for processing. Potentially noteworthy events may
be processed by one or more event handlers to do things such as send an email or
invoke an automated action.

### Metric-only events

Sensu events can also be created when the agent receives metrics through the
[Statsd listener][5]. The agent will translate the statsd metrics to Sensu
Metric Format, and place them inside an event. These events, since they do not
contain checks, bypass the store, and are sent off to the event pipeline and
corresponding event handlers.

### Check and metric events

Events that contain _both_ a check and metrics, most likely originated from
[check output metric extraction][6]. If a check is configured for metric
extraction, the agent will parse the check output and transform it to Sensu
Metric Format. Both the check results, and resulting (extracted) metrics are
stored inside the event. Event handlers from `event.Check.Handlers` and
`event.Metrics.Handlers` will be invoked.

## Creating events using the Sensu agent

The Sensu agent is a powerful event producer and monitoring automation tool.
You can use Sensu agents to produce events automatically using service checks and metric checks.
Sensu agents can also act as a collector for metrics throughout your infrastructure.

- [Creating events using service checks](../agent#creating-monitoring-events-using-service-checks)
- [Creating events using metric checks](../../guides/extract-metrics-with-checks)
- [Creating events using the agent API](../agent#creating-monitoring-events-using-the-agent-api)
- [Creating events using the agent TCP and UDP sockets](../agent#creating-monitoring-events-using-the-agent-tcp-and-udp-sockets)
- [Creating events using the StatsD listener](../agent#creating-monitoring-events-using-the-statsd-listener)

## Creating events using the events API

You can send events directly to the Sensu pipeline using the events API.
To create an event, send a JSON event definition to the [events API PUT endpoint](../../api/events#eventsentitycheck-put).

## Managing events

You can manage event using the [Sensu dashboard](../../dashboard/overview), [events API](../../api/events), and the [sensuctl](../../sensuctl/reference) command line tool.

### Viewing events

To list all events:

{{< highlight shell >}}
sensuctl event list
{{< /highlight >}}

To show event details in the default [output format](../../sensuctl/reference/#preferred-output-format):

{{< highlight shell >}}
sensuctl event info entity-name check-name
{{< /highlight >}}

With both the `list` and `info` commands, you can specify an [output format](../../sensuctl/reference/#preferred-output-format) using the `--format` flag:

- `yaml` or `wrapped-json` formats for use with [`sensuctl create`][sc]
- `json` format for use with the [events API](../../api/events)

{{< highlight shell >}}
sensuctl event info entity-name check-name --format yaml
{{< /highlight >}}

### Deleting events

To delete an event:

{{< highlight shell >}}
sensuctl event delete entity-name check-name
{{< /highlight >}}

You can use the `--skip-confirm` flag to skip the confirmation step.

{{< highlight shell >}}
sensuctl event delete entity-name check-name --skip-confirm
{{< /highlight >}}

You should see a confirmation message on success.

{{< highlight shell >}}
Deleted
{{< /highlight >}}

### Resolving events

You can use sensuctl to change the status of an event to `0` (OK).
Events resolved by sensuctl include the output message: "Resolved manually by sensuctl".

{{< highlight shell >}}
sensuctl event resolve entity-name check-name
{{< /highlight >}}

You should see a confirmation message on success.

{{< highlight shell >}}
Resolved
{{< /highlight >}}

## Event format

Sensu events contain:

- `entity` scope (required)
  - Information about the source of the event, including any attributes defined in the [entity specification](../entities#entities-specification)
- `check` scope (optional if the `metrics` scope is present)
  - Information about how the event was created, including any attributes defined in the [check specification](../checks#check-specification)
  - Information about the event and its history, including any check attributes defined in the [event specification on this page](#check-attributes)
- `metrics` scope (optional if the `check` scope is present)
  - Metric points in [Sensu metric format](#metrics)
- `timestamp`
  - Time that the event occurred in seconds since the Unix epoch

## Using event data

Event data is powerful tool for automating monitoring workflows.
For example, see [the guide to reducing alert fatigue](../../guides/reduce-alert-fatigue/) by filtering events based on the event `occurrences` attribute.

## Events specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute specifying the [`sensuctl create`][sc] resource type. Events should always be of type `Event`.
required     | Required for events in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"type": "Event"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute specifying the Sensu API group and version. For events in Sensu backend version 5.4, this attribute should always be `core/v2`.
required     | Required for events in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"api_version": "core/v2"{{< /highlight >}}

metadata     | 
-------------|------
description  | Top-level scope containing the event `namespace`. The `metadata` map is always at the top level of the check definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope.  See the [metadata attributes reference](#metadata-attributes) for details.
required     | Required for events in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | Map of key-value pairs
example      | {{< highlight shell >}}"metadata": {
  "namespace": "default"
}{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes the event [spec attributes][sp].
required     | Required for events in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
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
  "timestamp": 1552506033
}
{{< /highlight >}}

### Metadata attributes

| namespace  |      |
-------------|------
description  | The Sensu [RBAC namespace][26] that this event belongs to.
required     | false
type         | String
default      | `default`
example      | {{< highlight shell >}}"namespace": "production"{{< /highlight >}}

### Spec attributes

|timestamp   |      |
-------------|------
description  | Time that the event occurred in seconds since the Unix epoch
required     | false
type         | Integer
default      | Time that the event occurred
example      | {{< highlight shell >}}"timestamp": 1522099512{{< /highlight >}}

|entity      |      |
-------------|------
description  | The [entity attributes][2] from the originating entity (agent or proxy).
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
description  | The [check definition][1] used to create the event and information about the status and history of the event. The check scope includes attributes described in the [event specification](#check-attributes) and the [check specification](../checks#check-specification).
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
description  | The metrics collected by the entity in Sensu metric format. See the [metrics attributes](#metric-attributes).
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

Sensu events include a `check` scope containing information about how the event was created, including any attributes defined in the [check specification](../checks#check-specification), and information about the event and its history, including the attributes defined below.

duration     |      |
-------------|------
description  | Command execution time in seconds
required     | false
type         | Float
example      | {{< highlight shell >}}"duration": 1.903135228{{< /highlight >}}

executed     |      |
-------------|------
description  | Time that the check request was executed
required     | false
type         | Integer
example      | {{< highlight shell >}}"executed": 1522100915{{< /highlight >}}

history      |      |
-------------|------
description  | Check status history for the last 21 check executions. See the [history attributes](#history-attributes).
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
description  | Time that the check request was issued in seconds since the Unix epoch
required     | false
type         | Integer
example      | {{< highlight shell >}}"issued": 1552506033{{< /highlight >}}

last_ok      |      |
-------------|------
description  | The last time that the check returned an OK `status` (`0`) in seconds since the Unix epoch
required     | false
type         | Integer
example      | {{< highlight shell >}}"last_ok": 1552506033{{< /highlight >}}

occurrences  |      |
-------------|------
description  | The number of times an event with the same status has occurred for the given entity and check
required     | false
type         | Integer
example      | {{< highlight shell >}}"occurrences": 1{{< /highlight >}}

occurrences_watermark | |
-------------|------
description  | The highest number of occurrences for the given entity and check at the current status
required     | false
type         | Integer
example      | {{< highlight shell >}}"occurrences_watermark": 1{{< /highlight >}}\

output       |      |
-------------|------
description  | The output from the execution of the check command
required     | false
type         | String
example      | {{< highlight shell >}}
"output": "sensu-go-sandbox.curl_timings.time_total 0.005"
{{< /highlight >}}

state         |      |
-------------|------
description  | The state of the check: `passing` (status `0`), `failing` (status other than `0`), or `flapping`. You can use the `low_flap_threshold` and `high_flap_threshold` [check attributes](../checks#spec-attributes) to configure `flapping` state detection.
required     | false
type         | String
example      | {{< highlight shell >}}"state": "passing"{{< /highlight >}}

status       |      |
-------------|------
description  | Exit status code produced by the check<ul><li><code>0</code> indicates “OK”</li><li><code>1</code> indicates “WARNING”</li><li><code>2</code> indicates “CRITICAL”</li><li>exit status codes other than <code>0</code>, <code>1</code>, or <code>2</code> indicate an “UNKNOWN” or custom status</li></ul>
required     | false
type         | Integer
example      | {{< highlight shell >}}"status": 0{{< /highlight >}}

total_state_change | |
-------------|------
description  | The total state change percentage for the check's history
required     | false
type         | Integer
example      | {{< highlight shell >}}"total_state_change": 0{{< /highlight >}}

#### History attributes

executed     |      |
-------------|------
description  |Time that the check request was executed in seconds since the Unix epoch
required     | false
type         | Integer
example      | {{< highlight shell >}}"executed": 1522100915{{< /highlight >}}

status       |      |
-------------|------
description  | Exit status code produced by the check<ul><li><code>0</code> indicates “OK”</li><li><code>1</code> indicates “WARNING”</li><li><code>2</code> indicates “CRITICAL”</li><li>exit status codes other than <code>0</code>, <code>1</code>, or <code>2</code> indicate an “UNKNOWN” or custom status</li></ul>
required     | false
type         | Integer
example      | {{< highlight shell >}}"status": 0{{< /highlight >}}

### Metric attributes

handlers     |      |
-------------|------
description  | An array of Sensu handlers to use for events created by the check. Each array item must be a string.
required     | false
type         | Array
example      | {{< highlight shell >}}
"handlers": [
  "influx-db"
]
{{< /highlight >}}

points       |      |
-------------|------
description  | Metric data points including a name, timestamp, value, and tags. See the [points attributes](#points-attributes).
required     | false
type         | Array
example      | {{< highlight shell >}}
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
{{< /highlight >}}

#### Points attributes

name         |      |
-------------|------
description  | The metric name in the format `$entity.$check.$metric` where `$entity` is the entity name, `$check` is the check name, and `$metric` is the metric name.
required     | false
type         | String
example      | {{< highlight shell >}}"name": "sensu-go-sandbox.curl_timings.time_total"{{< /highlight >}}

tags         |      |
-------------|------
description  | Optional tags to include with the metric
required     | false
type         | Array
example      | {{< highlight shell >}}"tags": []{{< /highlight >}}

timestamp    |      |
-------------|------
description  | Time that the metric was collected in seconds since the Unix epoch
required     | false
type         | Integer
example      | {{< highlight shell >}}"timestamp": 1552506033{{< /highlight >}}

value        |      |
-------------|------
description  | The metric value
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
    "timestamp": 1552594758
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
    "timestamp": 1552506033
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
    "timestamp": 1552506033
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

[1]: ../checks/#check-attributes
[2]: ../entities/#entity-attributes
[3]: ../entities/
[4]: ../hooks/
[5]: ../../guides/aggregate-metrics-statsd/
[6]: ../../guides/extract-metrics-with-checks
[7]: ../checks/#check-specification
[sc]: ../../sensuctl/reference#creating-resources
[sp]: #spec-attributes
[26]: ../rbac#namespaces
