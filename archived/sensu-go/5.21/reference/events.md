---
title: "Events"
reference_title: "Events"
type: "reference"
description: "An event is a generic container that Sensu uses to provide context for checks and metrics. You can use events to represent the state of your infrastructure and create automated monitoring workflows. Read the reference doc to learn about events."
weight: 90
version: "5.21"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.21:
    parent: reference
---

An event is a generic container used by Sensu to provide context to checks and metrics.
The context, called event data, contains information about the originating entity and the corresponding check or metric result.
An event must contain a check or metrics.
In certain cases, an event can contain both.
These generic containers allow Sensu to handle different types of events in the pipeline.
Because events are polymorphic in nature, it is important to never assume their contents (or lack of content).

## Check-only events

A Sensu event is created every time a check result is processed by the Sensu server, regardless of the status indicated by the check result.
The agent creates an event upon receipt of the check execution result.
The agent will execute any configured [hooks][4] the check might have.
From there, the result is forwarded to the Sensu backend for processing.
Potentially noteworthy events may be processed by one or more event handlers, for example to send an email or invoke an automated action.

### Example check-only event

{{< language-toggle >}}

{{< code yml >}}
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
      processes: null
    user: agent
  timestamp: 1552594758
  event_id: 3a5948f3-6ffd-4ea2-a41e-334f4a72ca2f
{{< /code >}}

{{< code json >}}
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
        "platform_version": "7.4.1708",
        "processes": null
      },
      "user": "agent"
    },
    "timestamp": 1552594758,
    "event_id": "3a5948f3-6ffd-4ea2-a41e-334f4a72ca2f"
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Metric-only events

Sensu events can also be created when the agent receives metrics through the [StatsD listener][5].
The agent will translate the StatsD metrics to Sensu metric format and place them inside an event.
Because these events do not contain checks, they bypass the store and are sent to the event pipeline and corresponding event handlers.

### Example metric-only event

{{< language-toggle >}}

{{< code yml >}}
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
      processes: null
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
{{< /code >}}

{{< code json >}}
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
        "platform_version": "7.5.1804",
        "processes": null
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
{{< /code >}}

{{< /language-toggle >}}

## Check and metric events

Events that contain _both_ a check and metrics most likely originated from [check output metric extraction][6].
If a check is configured for metric extraction, the agent will parse the check output and transform it to Sensu metric format.
Both the check results and resulting (extracted) metrics are stored inside the event.
Event handlers from `event.Check.Handlers` and `event.Metrics.Handlers` will be invoked.

### Example event with check and metric data

{{< language-toggle >}}

{{< code yml >}}
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
      processes: null
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
{{< /code >}}

{{< code json >}}
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
        "platform_version": "7.5.1804",
        "processes": null
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
{{< /code >}}

{{< /language-toggle >}}

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

If you use the events API to create a new event referencing an entity that does not already exist, the sensu-backend will automatically create a proxy entity in the same namespace when the event is published.

{{% notice note %}}
**NOTE**: An agent cannot belong to, execute checks in, or create events in more than one namespace. 
{{% /notice %}}

## Manage events

You can manage events using the [Sensu web UI][15], [events API][16], and [sensuctl][17] command line tool.

### View events

To list all events:

{{< code shell >}}
sensuctl event list
{{< /code >}}

To show event details in the default [output format][18]:

{{< code shell >}}
sensuctl event info entity-name check-name
{{< /code >}}

With both the `list` and `info` commands, you can specify an [output format][18] using the `--format` flag:

- `yaml` or `wrapped-json` formats for use with [`sensuctl create`][8]
- `json` format for use with the [events API][16]

{{< code shell >}}
sensuctl event info entity-name check-name --format yaml
sensuctl event info entity-name check-name --format json
{{< /code >}}

### Delete events

To delete an event:

{{< code shell >}}
sensuctl event delete entity-name check-name
{{< /code >}}

You can use the `--skip-confirm` flag to skip the confirmation step:

{{< code shell >}}
sensuctl event delete entity-name check-name --skip-confirm
{{< /code >}}

You should see a confirmation message upon success:

{{< code shell >}}
Deleted
{{< /code >}}

### Resolve events

You can use sensuctl to change the status of an event to `0` (OK).
Events resolved by sensuctl include the output message `Resolved manually by sensuctl`.

{{< code shell >}}
sensuctl event resolve entity-name check-name
{{< /code >}}

You should see a confirmation message upon success:

{{< code shell >}}
Resolved
{{< /code >}}

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
For example, the [`state` attribute][36] provides handlers with a high-level description of check status.
Filtering events based on this attribute can help [reduce alert fatigue][23].

### State attribute

The `state` event attribute adds meaning to the check status:

- `passing` means the check status is `0` (OK).
- `failing` means the check status is non-zero (WARNING or CRITICAL).
- `flapping` indicates an unsteady state in which the check result status (determined based on per-check [low and high flap thresholds][37] attributes) is not settling on `passing` or `failing` according to the [flap detection algorithm][39].

Flapping typically indicates intermittent problems with an entity, provided your low and high flap threshold settings are properly configured.
Although some teams choose to filter out flapping events to reduce unactionable alerts, we suggest sending flapping events to a designated handler for later review.
If you repeatedly observe events in flapping state, Sensu's per-check flap threshold configuration allows you to adjust the sensitivity of the [flap detection algorithm][39].

#### Flap detection algorithm

Sensu uses the same flap detection algorithm as [Nagios][38].
Every time you run a check, Sensu records whether the `status` value changed since the previous check.
Sensu stores the last 21 `status` values and uses them to calculate the percent state change for the entity/check pair.
Then, Sensu's algorithm applies a weight to these status changes: more recent changes have more value than older changes.

After calculating the weighted total percent state change, Sensu compares it with the [low and high flap thresholds][37] set in the check attributes.

- If the entity was **not** already flapping and the weighted total percent state change for the entity/check pair is greater than or equal to the `high_flap_threshold` setting, the entity has started flapping.
- If the entity **was** already flapping and the weighted total percent state change for the entity/check pair is less than the `low_flap_threshold` setting, the entity has stopped flapping.

Depending on the result of this comparison, Sensu will trigger the appropriate event filters based on [check attributes][40] like `event.check.high_flap_threshold` and `event.check.low_flap_threshold`.

### Occurrences and occurrences watermark

The `occurrences` and `occurrences_watermark` event attributes give you context about recent events for a given entity and check.
For example, the [`state` attribute][36] provides handlers with a high-level description of check status.Filtering events based on this attribute can help [reduce alert fatigue][23].  

Starting at `1`, the `occurrences` attribute increments for events with the same [status][25] as the preceding event (OK, WARNING, CRITICAL, or UNKNOWN) and resets whenever the status changes.
You can use the `occurrences` attribute to create a [state-change-only filter][27] or an [interval filter][28].

The `occurrences_watermark` attribute gives you useful information when looking at events that change status between non-OK (WARNING, CRITICAL, or UNKNOWN) and OK.
For these resolution events, the `occurrences_watermark` attribute tells you the number of preceding events with a non-OK status.
Sensu resets `occurrences_watermark` to `1` on the first non-OK event.
Within a sequence of only OK or only non-OK events, Sensu increments `occurrences_watermark` when the `occurrences` attribute is greater than the preceding `occurrences_watermark`.

The following table shows the occurrences attributes for a series of example events:

| event sequence   | `occurrences`   | `occurrences_watermark` |
| -----------------| --------------- | ----------------------- |
|1. OK event        | `occurrences: 1`| `occurrences_watermark: 1`
|2. OK event        | `occurrences: 2`| `occurrences_watermark: 2`
|3. WARNING event   | `occurrences: 1`| `occurrences_watermark: 1`
|4. WARNING event   | `occurrences: 2`| `occurrences_watermark: 2`
|5. WARNING event   | `occurrences: 3`| `occurrences_watermark: 3`
|6. CRITICAL event  | `occurrences: 1`| `occurrences_watermark: 3`
|7. CRITICAL event  | `occurrences: 2`| `occurrences_watermark: 3`
|8. CRITICAL event  | `occurrences: 3`| `occurrences_watermark: 3`
|9. CRITICAL event  | `occurrences: 4`| `occurrences_watermark: 4`
|10. OK event       | `occurrences: 1`| `occurrences_watermark: 4`
|11. CRITICAL event | `occurrences: 1`| `occurrences_watermark: 1`

## Events specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][8] resource type. Events should always be type `Event`.
required     | Required for events in `wrapped-json` or `yaml` format for use with [`sensuctl create`][8].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: Event
{{< /code >}}
{{< code json >}}
{
  "type": "Event"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For events in this version of Sensu, `api_version` should always be `core/v2`.
required     | Required for events in `wrapped-json` or `yaml` format for use with [`sensuctl create`][8].
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
description  | Top-level scope that contains the event `namespace` and `created_by` field. The `metadata` map is always at the top level of the check definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope.  See the [metadata attributes][29] for details.
required     | Required for events in `wrapped-json` or `yaml` format for use with [`sensuctl create`][8].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  namespace: default
  created_by: admin
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "namespace": "default",
    "created_by": "admin"
  }
}
{{< /code >}}
{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes the event [spec attributes][9].
required     | Required for events in `wrapped-json` or `yaml` format for use with [`sensuctl create`][8].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  check:
    check_hooks:
    command: /opt/sensu-plugins-ruby/embedded/bin/metrics-curl.rb -u "http://localhost"
    duration: 0.060790838
    env_vars:
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
    silenced:
    - webserver:*
    output: |-
      sensu-go-sandbox.curl_timings.time_total 0.005 1552506033
      sensu-go-sandbox.curl_timings.time_namelookup 0.004
    output_metric_format: graphite_plaintext
    output_metric_handlers:
    - influx-db
    proxy_entity_name: ''
    publish: true
    round_robin: false
    runtime_assets: []
    state: passing
    status: 0
    stdin: false
    subdue:
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
          - "::1/128"
          name: lo
        - addresses:
          - 10.0.2.15/24
          - fe80::5a94:f67a:1bfc:a579/64
          mac: '08:00:27:8b:c9:3f'
          name: eth0
      os: linux
      platform: centos
      platform_family: rhel
      platform_version: 7.5.1804
      processes:
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
{{< /code >}}
{{< code json >}}
{
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
      "silenced": [
        "webserver:*"
      ],
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
        "platform_version": "7.5.1804",
        "processes": null
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
{{< /code >}}
{{< /language-toggle >}}

### Metadata attributes

| namespace  |      |
-------------|------
description  | [Sensu RBAC namespace][26] that this event belongs to.
required     | false
type         | String
default      | `default`
example      | {{< language-toggle >}}
{{< code yml >}}
namespace: production
{{< /code >}}
{{< code json >}}
{
  "namespace": "production"
}
{{< /code >}}
{{< /language-toggle >}}

| created_by |      |
-------------|------
description  | Username of the Sensu user who created the event or last updated the event. Sensu automatically populates the `created_by` field when the event is created or updated.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
created_by: "admin"
{{< /code >}}
{{< code json >}}
{
  "created_by": "admin"
}
{{< /code >}}
{{< /language-toggle >}}

### Spec attributes

|timestamp   |      |
-------------|------
description  | Time that the event occurred. In seconds since the Unix epoch.
required     | false
type         | Integer
default      | Time that the event occurred
example      | {{< language-toggle >}}
{{< code yml >}}
timestamp: 1522099512
{{< /code >}}
{{< code json >}}
{
  "timestamp": 1522099512
}
{{< /code >}}
{{< /language-toggle >}}

event_id     |      |
-------------|------
description  | Universally unique identifier (UUID) for the event.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
event_id: 431a0085-96da-4521-863f-c38b480701e9
{{< /code >}}
{{< code json >}}
{
  "event_id": "431a0085-96da-4521-863f-c38b480701e9"
}
{{< /code >}}
{{< /language-toggle >}}

|entity      |      |
-------------|------
description  | [Entity attributes][2] from the originating entity (agent or proxy). If you use the [events API][35] to create a new event referencing an entity that does not already exist, the sensu-backend will automatically create a proxy entity when the event is published.
type         | Map
required     | true
example      | {{< language-toggle >}}
{{< code yml >}}
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
        - "::1/128"
        name: lo
      - addresses:
        - 10.0.2.15/24
        - fe80::5a94:f67a:1bfc:a579/64
        mac: '08:00:27:8b:c9:3f'
        name: eth0
    os: linux
    platform: centos
    platform_family: rhel
    platform_version: 7.5.1804
  user: agent

{{< /code >}}
{{< code json >}}
{
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
}
{{< /code >}}
{{< /language-toggle >}}

<a id="checks-attribute"></a>

|check       |      |
-------------|------
description  | [Check definition][1] used to create the event and information about the status and history of the event. The check scope includes attributes described in the [event specification][21] and the [check specification][20].
type         | Map
required     | true
example      | {{< language-toggle >}}
{{< code yml >}}
check:
  check_hooks:
  command: /opt/sensu-plugins-ruby/embedded/bin/metrics-curl.rb -u "http://localhost"
  duration: 0.060790838
  env_vars:
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
  silenced:
  - webserver:*
  output: sensu-go-sandbox.curl_timings.time_total 0.005
  output_metric_format: graphite_plaintext
  output_metric_handlers:
  - influx-db
  proxy_entity_name: ''
  publish: true
  round_robin: false
  runtime_assets: []
  state: passing
  status: 0
  stdin: false
  subdue:
  subscriptions:
  - entity:sensu-go-sandbox
  timeout: 0
  total_state_change: 0
  ttl: 0
{{< /code >}}
{{< code json >}}
{
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
    "silenced": [
      "webserver:*"
    ],
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
}
{{< /code >}}
{{< /language-toggle >}}

<a id="metrics-attribute"></a>

|metrics     |      |
-------------|------
description  | Metrics collected by the entity in Sensu metric format. See the [metrics attributes][30].
type         | Map
required     | false
example      | {{< language-toggle >}}
{{< code yml >}}
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
{{< /code >}}
{{< code json >}}
{
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
}
{{< /code >}}
{{< /language-toggle >}}

### Check attributes

Sensu events include a `check` scope that contains information about how the event was created, including any attributes defined in the [check specification][20], and information about the event and its history, including the attributes defined below.

duration     |      |
-------------|------
description  | Command execution time. In seconds.
required     | false
type         | Float
example      | {{< language-toggle >}}
{{< code yml >}}
duration: 1.903135228
{{< /code >}}
{{< code json >}}
{
  "duration": 1.903135228
}
{{< /code >}}
{{< /language-toggle >}}

executed     |      |
-------------|------
description  | Time at which the check request was executed. In seconds since the Unix epoch.{{% notice note %}}**NOTE**: For events created with the [events API](../../api/events/), the `executed` value is `0`.
{{% /notice %}}
required     | false
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
executed: 1522100915
{{< /code >}}
{{< code json >}}
{
  "executed": 1522100915
}
{{< /code >}}
{{< /language-toggle >}}

history      |      |
-------------|------
description  | Check status history for the last 21 check executions. See [history attributes][32].
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
history:
- executed: 1552505983
  status: 0
- executed: 1552505993
  status: 0
{{< /code >}}
{{< code json >}}
{
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
}
{{< /code >}}
{{< /language-toggle >}}

issued       |      |
-------------|------
description  | Time that the check request was issued. In seconds since the Unix epoch.{{% notice note %}}**NOTE**: For events created with the [events API](../../api/events/), the `issued` value is `0`.
{{% /notice %}}
required     | false
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
issued: 1552506033
{{< /code >}}
{{< code json >}}
{
  "issued": 1552506033
}
{{< /code >}}
{{< /language-toggle >}}

last_ok      |      |
-------------|------
description  | Last time that the check returned an OK status (`0`). In seconds since the Unix epoch.{{% notice note %}}**NOTE**: For events created with the [events API](../../api/events/), the `last_ok` value is `0`.
{{% /notice %}}
required     | false
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
last_ok: 1552506033
{{< /code >}}
{{< code json >}}
{
  "last_ok": 1552506033
}
{{< /code >}}
{{< /language-toggle >}}

occurrences  |      |
-------------|------
description  | Number of preceding events with the same status as the current event (OK, WARNING, CRITICAL, or UNKNOWN). Starting at `1`, the `occurrences` attribute increments for events with the same status as the preceding event and resets whenever the status changes. See [Use event data][31] for more information.
required     | false
type         | Integer greater than 0
example      | {{< language-toggle >}}
{{< code yml >}}
occurrences: 1
{{< /code >}}
{{< code json >}}
{
  "occurrences": 1
}
{{< /code >}}
{{< /language-toggle >}}

occurrences_watermark | |
-------------|------
description  | For incident and resolution events, the number of preceding events with an OK status (for incident events) or non-OK status (for resolution events). The `occurrences_watermark` attribute gives you useful information when looking at events that change status between OK (`0`)and non-OK (`1`-WARNING, `2`-CRITICAL, or UNKNOWN).<br><br>Sensu resets `occurrences_watermark` to `1` whenever an event for a given entity and check transitions between OK and non-OK. Within a sequence of only OK or only non-OK events, Sensu increments `occurrences_watermark` only when the `occurrences` attribute is greater than the preceding `occurrences_watermark`. See [Use event data][31] for more information.
required     | false
type         | Integer greater than 0
example      | {{< language-toggle >}}
{{< code yml >}}
occurrences_watermark: 1
{{< /code >}}
{{< code json >}}
{
  "occurrences_watermark": 1
}
{{< /code >}}
{{< /language-toggle >}}

silenced     | |
-------------|------
description  | Array of silencing entries that match the event. The `silenced` attribute is only present for events if one or more silencing entries matched the event at time of processing. If the `silenced` attribute is not present in an event, the event was not silenced at the time of processing.
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
silenced:
- webserver:*
{{< /code >}}
{{< code json >}}
{
  "silenced": [
    "webserver:*"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

output       |      |
-------------|------
description  | Output from the execution of the check command.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
output: "sensu-go-sandbox.curl_timings.time_total 0.005
{{< /code >}}
{{< code json >}}
{
  "output": "sensu-go-sandbox.curl_timings.time_total 0.005"
}
{{< /code >}}
{{< /language-toggle >}}

state         |      |
-------------|------
description  | State of the check: `passing` (status `0`), `failing` (status other than `0`), or `flapping`. You can use the `low_flap_threshold` and `high_flap_threshold` [check attributes][33] to configure `flapping` state detection.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
state: passing
{{< /code >}}
{{< code json >}}
{
  "state": "passing"
}
{{< /code >}}
{{< /language-toggle >}}

status       |      |
-------------|------
description  | Exit status code produced by the check.<ul><li><code>0</code> indicates “OK”</li><li><code>1</code> indicates “WARNING”</li><li><code>2</code> indicates “CRITICAL”</li></ul>Exit status codes other than <code>0</code>, <code>1</code>, or <code>2</code> indicate an “UNKNOWN” or custom status.
required     | false
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
status: 0
{{< /code >}}
{{< code json >}}
{
  "status": 0
}
{{< /code >}}
{{< /language-toggle >}}

total_state_change | |
-------------|------
description  | Total state change percentage for the check's history.
required     | false
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
total_state_change: 0
{{< /code >}}
{{< code json >}}
{
  "total_state_change": 0
}
{{< /code >}}
{{< /language-toggle >}}

#### History attributes

executed     |      |
-------------|------
description  | Time at which the check request was executed. In seconds since the Unix epoch.{{% notice note %}}**NOTE**: For events created with the [events API](../../api/events/), the `executed` value is `0`.
{{% /notice %}}
required     | false
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
executed: 1522100915
{{< /code >}}
{{< code json >}}
{
  "executed": 1522100915
}
{{< /code >}}
{{< /language-toggle >}}

status       |      |
-------------|------
description  | Exit status code produced by the check.<ul><li><code>0</code> indicates “OK”</li><li><code>1</code> indicates “WARNING”</li><li><code>2</code> indicates “CRITICAL”</li></ul>Exit status codes other than <code>0</code>, <code>1</code>, or <code>2</code> indicate an “UNKNOWN” or custom status.
required     | false
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
status: 0
{{< /code >}}
{{< code json >}}
{
  "status": 0
}
{{< /code >}}
{{< /language-toggle >}}

### Metrics attributes

handlers     |      |
-------------|------
description  | Array of Sensu handlers to use for events created by the check. Each array item must be a string.
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
handlers:
- influx-db
{{< /code >}}
{{< code json >}}
{
  "handlers": [
    "influx-db"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

points       |      |
-------------|------
description  | Metric data points, including a name, timestamp, value, and tags. See [points attributes][34].
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
points:
- name: sensu-go-sandbox.curl_timings.time_total
  tags:
  - name: response_time_in_ms
    value: '101'
  timestamp: 1552506033
  value: 0.005
- name: sensu-go-sandbox.curl_timings.time_namelookup
  tags:
  - name: namelookup_time_in_ms
    value: '57'
  timestamp: 1552506033
  value: 0.004
{{< /code >}}
{{< code json >}}
{
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
}
{{< /code >}}
{{< /language-toggle >}}

#### Points attributes

name         |      |
-------------|------
description  | Metric name in the format `$entity.$check.$metric` where `$entity` is the entity name, `$check` is the check name, and `$metric` is the metric name.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: sensu-go-sandbox.curl_timings.time_total
{{< /code >}}
{{< code json >}}
{
  "name": "sensu-go-sandbox.curl_timings.time_total"
}
{{< /code >}}
{{< /language-toggle >}}

tags         |      |
-------------|------
description  | Optional tags to include with the metric. Each element of the array must be a hash that contains two key value pairs: the `name` of the tag and the `value`. Both values of the pairs must be strings.
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
tags:
- name: response_time_in_ms
  value: '101'
{{< /code >}}
{{< code json >}}
{
  "tags": [
    {
      "name": "response_time_in_ms",
      "value": "101"
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

timestamp    |      |
-------------|------
description  | Time at which the metric was collected. In seconds since the Unix epoch.
required     | false
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
timestamp: 1552506033
{{< /code >}}
{{< code json >}}
{
  "timestamp": 1552506033
}
{{< /code >}}
{{< /language-toggle >}}

value        |      |
-------------|------
description  | Metric value.
required     | false
type         | Float
example      | {{< language-toggle >}}
{{< code yml >}}
value: 0.005
{{< /code >}}
{{< code json >}}
{
  "value": 0.005
}
{{< /code >}}
{{< /language-toggle >}}


[1]: ../checks/
[2]: ../entities#entities-specification
[3]: ../entities/
[4]: ../hooks/
[5]: ../../guides/aggregate-metrics-statsd/
[6]: ../../guides/extract-metrics-with-checks/
[7]: ../checks/#check-specification
[8]: ../../sensuctl/create-manage-resources/#create-resources
[9]: #spec-attributes
[10]: ../agent#create-monitoring-events-using-service-checks
[11]: ../agent#create-monitoring-events-using-the-agent-api
[12]: ../agent#create-monitoring-events-using-the-agent-tcp-and-udp-sockets
[13]: ../agent#create-monitoring-events-using-the-statsd-listener
[14]: ../../api/events#eventsentitycheck-put
[15]: ../../web-ui/
[16]: ../../api/events/
[17]: ../../sensuctl/
[18]: ../../sensuctl/create-manage-resources/#sensuctl-event
[20]: ../checks#check-specification
[21]: #check-attributes
[22]: #metrics-attribute
[23]: ../../guides/reduce-alert-fatigue/
[24]: ../filters/
[25]: ../checks/#check-result-specification
[26]: ../namespaces/
[27]: ../filters/#filter-for-state-change-only
[28]: ../filters/#filter-for-repeated-events
[29]: #metadata-attributes
[30]: #metrics-attributes
[31]: #use-event-data
[32]: #history-attributes
[33]: ../checks#spec-attributes
[34]: #points-attributes
[35]: ../../api/events#create-a-new-event
[36]: #state-attribute
[37]: ../checks/#flap-thresholds
[38]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/flapping.html
[39]: #flap-detection-algorithm
[40]: ../filters/#check-attributes-available-to-filters
