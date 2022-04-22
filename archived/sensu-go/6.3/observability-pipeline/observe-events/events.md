---
title: "Events reference"
linkTitle: "Events Reference"
reference_title: "Events"
type: "reference"
description: "Use Sensu events, containers that provide context for check results, to represent the state of your infrastructure and create automated monitoring workflows."
weight: 20
version: "6.3"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.3:
    parent: observe-events
---

An event is a generic container used by Sensu to provide context to checks and metrics.
The context, called observation data or event data, contains information about the originating entity and the corresponding check or metric result.
An event must contain a [status][4] or [metrics][5].
In certain cases, an event can contain [both a status and metrics][19].
These generic containers allow Sensu to handle different types of events in the pipeline.
Because events are polymorphic in nature, it is important to never assume their contents (or lack of content).

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
- `id`
  - Universally unique identifier (UUID) for the event (logged as `event_id`)

## Example status-only event

The following example shows the complete resource definition for a [status-only event][4]:

{{< language-toggle >}}

{{< code yml >}}
---
type: Event
api_version: core/v2
metadata:
  namespace: default
spec:
  check:
    check_hooks: null
    command: check-cpu-usage -w 75 -c 90
    duration: 5.058211427
    env_vars: null
    executed: 1617050501
    handlers: []
    high_flap_threshold: 0
    history:
    - executed: 1617050261
      status: 0
    - executed: 1617050321
      status: 0
    - executed: 1617050381
      status: 0
    - executed: 1617050441
      status: 0
    - executed: 1617050501
      status: 0
    interval: 60
    is_silenced: false
    issued: 1617050501
    last_ok: 1617050501
    low_flap_threshold: 0
    metadata:
      name: check_cpu
      namespace: default
    occurrences: 5
    occurrences_watermark: 5
    output: |
      CheckCPU TOTAL OK: total=0.41 user=0.2 nice=0.0 system=0.2 idle=99.59 iowait=0.0 irq=0.0 softirq=0.0 steal=0.0 guest=0.0 guest_nice=0.0
    output_metric_format: ""
    output_metric_handlers: null
    proxy_entity_name: ""
    publish: true
    round_robin: false
    runtime_assets:
    - check-cpu-usage
    scheduler: memory
    secrets: null
    state: passing
    status: 0
    stdin: false
    subdue: null
    subscriptions:
    - system
    timeout: 0
    total_state_change: 0
    ttl: 0
  entity:
    deregister: false
    deregistration: {}
    entity_class: agent
    last_seen: 1617050501
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
    sensu_agent_version: 6.2.6
    subscriptions:
    - linux
    - entity:sensu-centos
    system:
      arch: amd64
      cloud_provider: ""
      hostname: sensu-centos
      libc_type: glibc
      network:
        interfaces:
        - addresses:
          - 127.0.0.1/8
          - ::1/128
          name: lo
        - addresses:
          - 10.0.2.15/24
          - fe80::a268:dcce:3be:1c73/64
          mac: 08:00:27:8b:c9:3f
          name: eth0
        - addresses:
          - 172.28.128.45/24
          - fe80::a00:27ff:feb2:dc46/64
          mac: 08:00:27:b2:dc:46
          name: eth1
      os: linux
      platform: centos
      platform_family: rhel
      platform_version: 7.5.1804
      processes: null
      vm_role: guest
      vm_system: vbox
    user: agent
  id: 3c3e68f6-6db7-40d3-9b84-4d61817ae559
  sequence: 5
  timestamp: 1617050507
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
      "command": "check-cpu-usage -w 75 -c 90",
      "duration": 5.058211427,
      "env_vars": null,
      "executed": 1617050501,
      "handlers": [],
      "high_flap_threshold": 0,
      "history": [
        {
          "executed": 1617050261,
          "status": 0
        },
        {
          "executed": 1617050321,
          "status": 0
        },
        {
          "executed": 1617050381,
          "status": 0
        },
        {
          "executed": 1617050441,
          "status": 0
        },
        {
          "executed": 1617050501,
          "status": 0
        }
      ],
      "interval": 60,
      "is_silenced": false,
      "issued": 1617050501,
      "last_ok": 1617050501,
      "low_flap_threshold": 0,
      "metadata": {
        "name": "check_cpu",
        "namespace": "default"
      },
      "occurrences": 5,
      "occurrences_watermark": 5,
      "output": "CheckCPU TOTAL OK: total=0.41 user=0.2 nice=0.0 system=0.2 idle=99.59 iowait=0.0 irq=0.0 softirq=0.0 steal=0.0 guest=0.0 guest_nice=0.0\n",
      "output_metric_format": "",
      "output_metric_handlers": null,
      "proxy_entity_name": "",
      "publish": true,
      "round_robin": false,
      "runtime_assets": [
        "check-cpu-usage"
      ],
      "scheduler": "memory",
      "secrets": null,
      "state": "passing",
      "status": 0,
      "stdin": false,
      "subdue": null,
      "subscriptions": [
        "system"
      ],
      "timeout": 0,
      "total_state_change": 0,
      "ttl": 0
    },
    "entity": {
      "deregister": false,
      "deregistration": {},
      "entity_class": "agent",
      "last_seen": 1617050501,
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
      "sensu_agent_version": "6.2.6",
      "subscriptions": [
        "linux",
        "entity:sensu-centos"
      ],
      "system": {
        "arch": "amd64",
        "cloud_provider": "",
        "hostname": "sensu-centos",
        "libc_type": "glibc",
        "network": {
          "interfaces": [
            {
              "addresses": [
                "127.0.0.1/8",
                ":1/128"
              ],
              "name": "lo"
            },
            {
              "addresses": [
                "10.0.2.15/24",
                "fe80::a268:dcce:3be:1c73/64"
              ],
              "mac": "08:00:27:8b:c9:3f",
              "name": "eth0"
            },
            {
              "addresses": [
                "172.28.128.45/24",
                "fe80::a00:27ff:feb2:dc46/64"
              ],
              "mac": "08:00:27:b2:dc:46",
              "name": "eth1"
            }
          ]
        },
        "os": "linux",
        "platform": "centos",
        "platform_family": "rhel",
        "platform_version": "7.5.1804",
        "processes": null,
        "vm_role": "guest",
        "vm_system": "vbox"
      },
      "user": "agent"
    },
    "id": "3c3e68f6-6db7-40d3-9b84-4d61817ae559",
    "sequence": 5,
    "timestamp": 1617050507
  }
}
{{< /code >}}

{{< /language-toggle >}}

### Example status-only event from the Sensu API

Sensu sends events to the backend in `json` format, without the outer-level `spec` wrapper or `type` and `api_version` attributes that are included in the `wrapped-json` format.
This is the format that events are in when Sensu sends them to handlers:

{{< code json >}}
{
  "check": {
    "command": "check-cpu-usage -w 75 -c 90",
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 60,
    "low_flap_threshold": 0,
    "publish": true,
    "runtime_assets": [
      "check-cpu-usage"
    ],
    "subscriptions": [
      "system"
    ],
    "proxy_entity_name": "",
    "check_hooks": null,
    "stdin": false,
    "subdue": null,
    "ttl": 0,
    "timeout": 0,
    "round_robin": false,
    "duration": 5.058211427,
    "executed": 1617050501,
    "history": [
      {
        "status": 0,
        "executed": 1617050261
      },
      {
        "status": 0,
        "executed": 1617050321
      },
      {
        "status": 0,
        "executed": 1617050381
      },
      {
        "status": 0,
        "executed": 1617050441
      },
      {
        "status": 0,
        "executed": 1617050501
      }
    ],
    "issued": 1617050501,
    "output": "CheckCPU TOTAL OK: total=0.4 user=0.2 nice=0.0 system=0.2 idle=99.6 iowait=0.0 irq=0.0 softirq=0.0 steal=0.0 guest=0.0 guest_nice=0.0\n",
    "state": "passing",
    "status": 0,
    "total_state_change": 0,
    "last_ok": 1617050501,
    "occurrences": 5,
    "occurrences_watermark": 5,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "env_vars": null,
    "metadata": {
      "name": "check_cpu",
      "namespace": "default"
    },
    "secrets": null,
    "is_silenced": false,
    "scheduler": "memory"
  },
  "entity": {
    "entity_class": "agent",
    "system": {
      "hostname": "sensu-centos",
      "os": "linux",
      "platform": "centos",
      "platform_family": "rhel",
      "platform_version": "7.5.1804",
      "network": {
        "interfaces": [
          {
            "name": "lo",
            "addresses": [
              "127.0.0.1/8",
              "::1/128"
            ]
          },
          {
            "name": "eth0",
            "mac": "08:00:27:8b:c9:3f",
            "addresses": [
              "10.0.2.15/24",
              "fe80::a268:dcce:3be:1c73/64"
            ]
          },
          {
            "name": "eth1",
            "mac": "08:00:27:b2:dc:46",
            "addresses": [
              "172.28.128.45/24",
              "fe80::a00:27ff:feb2:dc46/64"
            ]
          }
        ]
      },
      "arch": "amd64",
      "libc_type": "glibc",
      "vm_system": "vbox",
      "vm_role": "guest",
      "cloud_provider": "",
      "processes": null
    },
    "subscriptions": [
      "linux",
      "entity:sensu-centos"
    ],
    "last_seen": 1617049781,
    "deregister": false,
    "deregistration": {},
    "user": "agent",
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
    "metadata": {
      "name": "sensu-centos",
      "namespace": "default"
    },
    "sensu_agent_version": "6.2.6"
  },
  "id": "3c3e68f6-6db7-40d3-9b84-4d61817ae559",
  "metadata": {
    "namespace": "default"
  },
  "sequence": 5,
  "timestamp": 1617050507
}
{{< /code >}}

## Example metrics-only event

This example shows the complete resource definition for a [metrics-only event][5]:

{{< language-toggle >}}

{{< code yml >}}
---
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
      name: sensu-go-testing
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
    - entity:sensu-go-testing
    system:
      arch: amd64
      hostname: sensu-go-testing
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
    - name: sensu-go.curl_timings.time_total
      tags: []
      timestamp: 1552506033
      value: 0.005
    - name: sensu-go.curl_timings.time_namelookup
      tags: []
      timestamp: 1552506033
      value: 0.004
  timestamp: 1552506033
  id: 47ea07cd-1e50-4897-9e6d-09cd39ec5180
  sequence: 1
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
        "name": "sensu-go-testing",
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
        "entity:sensu-go-testing"
      ],
      "system": {
        "arch": "amd64",
        "hostname": "sensu-go-testing",
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
          "name": "sensu-go.curl_timings.time_total",
          "tags": [],
          "timestamp": 1552506033,
          "value": 0.005
        },
        {
          "name": "sensu-go.curl_timings.time_namelookup",
          "tags": [],
          "timestamp": 1552506033,
          "value": 0.004
        }
      ]
    },
    "timestamp": 1552506033,
    "id": "47ea07cd-1e50-4897-9e6d-09cd39ec5180",
    "sequence": 1
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Example status and metrics event

The following example resource definition for a [status and metrics event][19] contains _both_ a check and metrics:

{{< language-toggle >}}

{{< code yml >}}
---
type: Event
api_version: core/v2
metadata:
  namespace: default
spec:
  check:
    check_hooks: null
    command: metrics-curl -u "http://localhost"
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
    is_silenced: false
    issued: 1552506033
    last_ok: 1552506033
    low_flap_threshold: 0
    metadata:
      name: curl_timings
      namespace: default
    occurrences: 1
    occurrences_watermark: 1
    output: |-
      sensu-go.curl_timings.time_total 0.005 1552506033
      sensu-go.curl_timings.time_namelookup 0.004
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
    - entity:sensu-go-testing
    timeout: 0
    total_state_change: 0
    ttl: 0
  entity:
    deregister: false
    deregistration: {}
    entity_class: agent
    last_seen: 1552495139
    metadata:
      name: sensu-go-testing
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
    - entity:sensu-go-testing
    system:
      arch: amd64
      hostname: sensu-go-testing
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
    - name: sensu-go.curl_timings.time_total
      tags: []
      timestamp: 1552506033
      value: 0.005
    - name: sensu-go.curl_timings.time_namelookup
      tags: []
      timestamp: 1552506033
      value: 0.004
  timestamp: 1552506033
  id: 431a0085-96da-4521-863f-c38b480701e9
  sequence: 1
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
      "command": "metrics-curl -u \"http://localhost\"",
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
      "is_silenced": false,
      "issued": 1552506033,
      "last_ok": 1552506033,
      "low_flap_threshold": 0,
      "metadata": {
        "name": "curl_timings",
        "namespace": "default"
      },
      "occurrences": 1,
      "occurrences_watermark": 1,
      "output": "sensu-go.curl_timings.time_total 0.005 1552506033\nsensu-go.curl_timings.time_namelookup 0.004",
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
        "entity:sensu-go-testing"
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
        "name": "sensu-go-testing",
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
        "entity:sensu-go-testing"
      ],
      "system": {
        "arch": "amd64",
        "hostname": "sensu-go-testing",
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
          "name": "sensu-go.curl_timings.time_total",
          "tags": [],
          "timestamp": 1552506033,
          "value": 0.005
        },
        {
          "name": "sensu-go.curl_timings.time_namelookup",
          "tags": [],
          "timestamp": 1552506033,
          "value": 0.004
        }
      ]
    },
    "timestamp": 1552506033,
    "id": "431a0085-96da-4521-863f-c38b480701e9",
    "sequence": 1
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

## Create events with the core/v2/events API endpoints

You can send events directly to the Sensu pipeline using the [core/v2/events API endpoints][16].
To create an event, send a JSON event definition to the [core/v2/events API PUT endpoint][14].

If you use the core/v2/events API to create a new event referencing an entity that does not already exist, the sensu-backend will automatically create a proxy entity in the same namespace when the event is published.

{{% notice note %}}
**NOTE**: An agent cannot belong to, execute checks in, or create events in more than one namespace. 
{{% /notice %}}

## Manage events

You can manage events using the [Sensu web UI][15], [core/v2/events API endpoints][16], and [sensuctl][17] command line tool.

### View events

To list all events:

{{< code shell >}}
sensuctl event list
{{< /code >}}

To show event details in the default [output format][18] (tabular):

{{< code shell >}}
sensuctl event info <entity-name> <check-name>
{{< /code >}}

{{% notice note %}}
**NOTE**: Metrics data points are not included in events retrieved with `sensuctl event info` &mdash; these events include check output text rather than a set of metrics points.
{{% /notice %}}

With both the `list` and `info` commands, you can specify an [output format][18] using the `--format` flag:

- `yaml` or `wrapped-json` formats for use with [`sensuctl create`][8]
- `json` format for use with [core/v2/events API endpoints][16]

{{< language-toggle >}}
{{< code shell "YML" >}}
sensuctl event info entity-name check-name --format yaml
{{< /code >}}
{{< code shell "Wrapped JSON" >}}
sensuctl event info entity-name check-name --format wrapped-json
{{< /code >}}
{{< code shell "JSON" >}}
sensuctl event info entity-name check-name --format json
{{< /code >}}
{{< /language-toggle >}}

### Delete events

To delete an event:

{{< code shell >}}
sensuctl event delete entity-name check-name
{{< /code >}}

You can use the `--skip-confirm` flag to skip the confirmation step:

{{< code shell >}}
sensuctl event delete entity-name check-name --skip-confirm
{{< /code >}}

You should receive a confirmation message upon success:

{{< code shell >}}
Deleted
{{< /code >}}

### Resolve events

You can use sensuctl to change the status of an event to `0` (OK).
Events resolved by sensuctl include the output message `Resolved manually by sensuctl`.

{{< code shell >}}
sensuctl event resolve entity-name check-name
{{< /code >}}

You should receive a confirmation message upon success:

{{< code shell >}}
Resolved
{{< /code >}}

## Use event data

Observability data in events is a powerful tool for automating monitoring workflows.
For example, the [`state` attribute][36] provides handlers with a high-level description of check status.
Filtering events based on this attribute can help [reduce alert fatigue][23].

### State attribute

The `state` event attribute adds meaning to the check status:

- `passing` means the check status is `0` (OK).
- `failing` means the check status is non-zero (WARNING or CRITICAL).
- `flapping` indicates an unsteady state in which the check result status (determined based on per-check [high flap threshold][37] and [low flap threshold][47] attributes) is not settling on `passing` or `failing` according to the [flap detection algorithm][39].

Flapping typically indicates intermittent problems with an entity, provided your low and high flap threshold settings are properly configured.
Although some teams choose to filter out flapping events to reduce unactionable alerts, we suggest sending flapping events to a designated handler for later review.
If you repeatedly observe events in flapping state, Sensu's per-check flap threshold configuration allows you to adjust the sensitivity of the [flap detection algorithm][39].

#### Flap detection algorithm

Sensu uses the same flap detection algorithm as [Nagios][38].
Every time you run a check, Sensu records whether the `status` value changed since the previous check.
Sensu stores the last 21 `status` values and uses them to calculate the percent state change for the entity/check pair.
Then, Sensu's algorithm applies a weight to these status changes: more recent changes have more value than older changes.

After calculating the weighted total percent state change, Sensu compares it with the [high flap threshold][37] and [low flap threshold][47] set in the check attributes.

- If the entity was **not** already flapping and the weighted total percent state change for the entity/check pair is greater than or equal to the `high_flap_threshold` setting, the entity has started flapping.
- If the entity **was** already flapping and the weighted total percent state change for the entity/check pair is less than the `low_flap_threshold` setting, the entity has stopped flapping.

Depending on the result of this comparison, Sensu will trigger the appropriate event filters based on [check attributes][40] like `event.check.high_flap_threshold` and `event.check.low_flap_threshold`.

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

| event sequence    | `occurrences`   | `occurrences_watermark` |
| ----------------- | --------------- | ----------------------- |
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
description  | Top-level scope that contains the event `namespace` and `created_by` field. The `metadata` map is always at the top level of the check definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope.  Review the [metadata attributes][29] for details.
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
    command: metrics-curl -u "http://localhost"
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
    is_silenced: true
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
      sensu-go.curl_timings.time_total 0.005 1552506033
      sensu-go.curl_timings.time_namelookup 0.004
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
    - entity:sensu-go-testing
    timeout: 0
    total_state_change: 0
    ttl: 0
  entity:
    deregister: false
    deregistration: {}
    entity_class: agent
    last_seen: 1552495139
    metadata:
      name: sensu-go-testing
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
    - entity:sensu-go-testing
    system:
      arch: amd64
      hostname: sensu-go-testing
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
    - name: sensu-go.curl_timings.time_total
      tags: []
      timestamp: 1552506033
      value: 0.005
    - name: sensu-go.curl_timings.time_namelookup
      tags: []
      timestamp: 1552506033
      value: 0.004
  timestamp: 1552506033
  id: 431a0085-96da-4521-863f-c38b480701e9
  sequence: 1
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "check": {
      "check_hooks": null,
      "command": "metrics-curl -u \"http://localhost\"",
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
      "is_silenced": true,
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
      "output": "sensu-go.curl_timings.time_total 0.005 1552506033\nsensu-go.curl_timings.time_namelookup 0.004",
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
        "entity:sensu-go-testing"
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
        "name": "sensu-go-testing",
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
        "entity:sensu-go-testing"
      ],
      "system": {
        "arch": "amd64",
        "hostname": "sensu-go-testing",
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
          "name": "sensu-go.curl_timings.time_total",
          "tags": [],
          "timestamp": 1552506033,
          "value": 0.005
        },
        {
          "name": "sensu-go.curl_timings.time_namelookup",
          "tags": [],
          "timestamp": 1552506033,
          "value": 0.004
        }
      ]
    },
    "timestamp": 1552506033,
    "id": "431a0085-96da-4521-863f-c38b480701e9",
    "sequence": 1
  }
}
{{< /code >}}
{{< /language-toggle >}}

### Metadata attributes

| namespace  |      |
-------------|------
description  | [Sensu RBAC namespace][26] that the event belongs to.
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
description  | Time that the event occurred. In seconds since the Unix epoch.<br><br>Sensu automatically populates the timestamp value for the event. For events created with the [core/v2/events API][35], you can specify a `timestamp` value in the request body.
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

id           |      |
-------------|------
description  | Universally unique identifier (UUID) for the event. Logged as `event_id`.<br><br>Sensu automatically populates the `id` value for the event.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
id: 431a0085-96da-4521-863f-c38b480701e9
{{< /code >}}
{{< code json >}}
{
  "id": "431a0085-96da-4521-863f-c38b480701e9"
}
{{< /code >}}
{{< /language-toggle >}}

<a id="sequence-attribute"></a>

sequence     |      |
-------------|------
description  | Event sequence number. The Sensu agent sets the sequence to 1 at startup, then increments the sequence by 1 for every successive check execution or keepalive event. If the agent restarts or reconnects to another backend, the sequence value resets to 1.<br><br>A sequence value of 0 indicates that an outdated or non-conforming agent generated the event.<br><br>Sensu only increments the sequence for agent-executed events. Sensu does not update the sequence for events created with the [core/v2/events API][35].
required     | false
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
sequence: 1
{{< /code >}}
{{< code json >}}
{
  "sequence": 1
}
{{< /code >}}
{{< /language-toggle >}}

|entity      |      |
-------------|------
description  | [Entity attributes][2] from the originating entity (agent or proxy).<br><br>For events created with the [core/v2/events API][35], if the event's entity does not already exist, the sensu-backend automatically creates a proxy entity when the event is published.
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
    name: sensu-go-testing
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
  - entity:sensu-go-testing
  system:
    arch: amd64
    hostname: sensu-go-testing
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
      "name": "sensu-go-testing",
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
      "entity:sensu-go-testing"
    ],
    "system": {
      "arch": "amd64",
      "hostname": "sensu-go-testing",
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
  command: metrics-curl -u "http://localhost"
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
  is_silenced: true
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
  output: sensu-go.curl_timings.time_total 0.005
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
  - entity:sensu-go-testing
  timeout: 0
  total_state_change: 0
  ttl: 0
{{< /code >}}
{{< code json >}}
{
  "check": {
    "check_hooks": null,
    "command": "metrics-curl -u \"http://localhost\"",
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
    "is_silenced": true,
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
    "output": "sensu-go.curl_timings.time_total 0.005",
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
      "entity:sensu-go-testing"
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
description  | Metrics collected by the entity in Sensu metric format. Review the [metrics attributes][30].
type         | Map
required     | false
example      | {{< language-toggle >}}
{{< code yml >}}
metrics:
  handlers:
  - influx-db
  points:
  - name: sensu-go.curl_timings.time_total
    tags: []
    timestamp: 1552506033
    value: 0.005
  - name: sensu-go.curl_timings.time_namelookup
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
        "name": "sensu-go.curl_timings.time_total",
        "tags": [],
        "timestamp": 1552506033,
        "value": 0.005
      },
      {
        "name": "sensu-go.curl_timings.time_namelookup",
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
description  | Time at which the check request was executed. In seconds since the Unix epoch.<br><br>The difference between a request's `issued` and `executed` values is the request latency.<br><br>For agent-executed checks, Sensu automatically populates the `executed` value. For events created with the [core/v2/events API][35], the default `executed` value is `0` unless you specify a value in the request body.
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
description  | Check status history for the last 21 check executions. Read [history attributes][32].<br><br>Sensu automatically populates the history attributes with check execution data.<br><br>To store more than the last 21 check executions, use one of our [long-term event storage integrations][41].
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
description  | Time that the check request was issued. In seconds since the Unix epoch.<br><br>The difference between a request's `issued` and `executed` values is the request latency.<br><br>For agent-executed checks, Sensu automatically populates the `issued` value. For events created with the [core/v2/events API][35], the default `issued` value is `0` unless you specify a value in the request body.
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
description  | Last time that the check returned an OK status (`0`). In seconds since the Unix epoch.<br><br>For agent-executed checks, Sensu automatically populates the `last_ok` value. For events created with the [core/v2/events API][35], the `last_ok` attribute will default to `0` even if you specify OK status in the request body.
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
description  | Number of preceding events with the same status as the current event (OK, WARNING, CRITICAL, or UNKNOWN). Starting at `1`, the `occurrences` attribute increments for events with the same status as the preceding event and resets whenever the status changes. Read [Use event data][31] for more information.<br><br>Sensu automatically populates the `occurrences` value. For events created with the [core/v2/events API][35], Sensu overwrites any `occurences` value you specify in the request body with the correct value.
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
description  | For incident and resolution events, the number of preceding events with an OK status (for incident events) or non-OK status (for resolution events). The `occurrences_watermark` attribute gives you useful information when looking at events that change status between OK (`0`)and non-OK (`1`-WARNING, `2`-CRITICAL, or UNKNOWN).<br><br>Sensu resets `occurrences_watermark` to `1` whenever an event for a given entity and check transitions between OK and non-OK. Within a sequence of only OK or only non-OK events, Sensu increments `occurrences_watermark` only when the `occurrences` attribute is greater than the preceding `occurrences_watermark`. Read [Use event data][31] for more information.<br><br>Sensu automatically populates the `occurrences_watermark` value. For events created with the [core/v2/events API][35], Sensu overwrites any `occurences_watermark` value you specify in the request body with the correct value.
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

is_silenced  | |
-------------|------
description  | If `true`, the event was silenced at the time of processing. Otherwise, `false`. If `true`, the event. Check definitions also list the silenced entries that match the event in the `silenced` array.
required     | false
type         | Boolean
example      | {{< language-toggle >}}
{{< code yml >}}
is_silenced: true
{{< /code >}}
{{< code json >}}
{
  "is_silenced": "true"
}
{{< /code >}}
{{< /language-toggle >}}

<a id="silenced-attribute"></a>

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
output: "sensu-go.curl_timings.time_total 0.005
{{< /code >}}
{{< code json >}}
{
  "output": "sensu-go.curl_timings.time_total 0.005"
}
{{< /code >}}
{{< /language-toggle >}}

state         |      |
-------------|------
description  | State of the check: `passing` (status `0`), `failing` (status other than `0`), or `flapping`. Use the `low_flap_threshold` and `high_flap_threshold` [check attributes][33] to configure `flapping` state detection.<br><br>Sensu automatically populates the `state` based on the `status`.
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
description  | Exit status code produced by the check.<ul><li>`0` indicates OK</li><li>`1` indicates WARNING</li><li>`2` indicates CRITICAL</li></ul>Exit status codes other than `0`, `1`, or `2` indicate an UNKNOWN or custom status..<br><br>For agent-executed checks, Sensu automatically populates the `status` value based on the check result. For events created with the [core/v2/events API][35], Sensu assumes the status is `0` (OK) unless you specify a non-zero value in the request body.
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
description  | Total state change percentage for the check's history.<br><br>For agent-executed checks, Sensu automatically populates the `total_state_change` value. For events created with the [core/v2/events API][35], the `total_state_change` attribute will default to `0` even if you specify a different value or change the `status` value in the request body.
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
description  | Time at which the check request was executed. In seconds since the Unix epoch.<br><br>Sensu automatically populates the `executed` value with check execution data. For events created with the [core/v2/events API][35], the `executed` default value is `0`.
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
description  | Exit status code produced by the check.<ul><li>`0` indicates OK</li><li>`1` indicates WARNING</li><li>`2` indicates CRITICAL</li></ul>Exit status codes other than `0`, `1`, or `2` indicate an UNKNOWN or custom status.<br><br>Sensu automatically populates the `status` value with check execution data.
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

<a id="metrics-points"></a>

points       |      |
-------------|------
description  | Metrics data points, including a name, timestamp, value, and tags. Read [points attributes][34].
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
points:
- name: sensu-go.curl_timings.time_total
  tags:
  - name: response_time_in_ms
    value: '101'
  timestamp: 1552506033
  value: 0.005
- name: sensu-go.curl_timings.time_namelookup
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
      "name": "sensu-go.curl_timings.time_total",
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
      "name": "sensu-go.curl_timings.time_namelookup",
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
name: sensu-go.curl_timings.time_total
{{< /code >}}
{{< code json >}}
{
  "name": "sensu-go.curl_timings.time_total"
}
{{< /code >}}
{{< /language-toggle >}}

tags         |      |
-------------|------
description  | Optional tags to include with the metric. Each element of the array must be a hash that contains two key-value pairs: the `name` of the tag and the `value`. Both values of the pairs must be strings.
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
description  | Time at which the metric was collected. In seconds since the Unix epoch. Sensu automatically populates the timestamp values for metrics data points.
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


[1]: ../../observe-schedule/checks/
[2]: ../../observe-entities/entities#entities-specification
[3]: ../../observe-entities/entities/
[4]: ../#status-only-events
[5]: ../#metrics-only-events
[6]: ../../observe-schedule/collect-metrics-with-checks/
[7]: ../../observe-schedule/checks/#check-specification
[8]: ../../../sensuctl/create-manage-resources/#create-resources
[9]: #spec-attributes
[10]: ../../observe-schedule/agent#create-observability-events-using-service-checks
[11]: ../../observe-schedule/agent#create-observability-events-using-the-agent-api
[12]: ../../observe-schedule/agent#create-observability-events-using-the-agent-tcp-and-udp-sockets
[13]: ../../observe-schedule/agent#create-observability-events-using-the-statsd-listener
[14]: ../../../api/events#eventsentitycheck-put
[15]: ../../../web-ui/
[16]: ../../../api/core/events/
[17]: ../../../sensuctl/
[18]: ../../../sensuctl/#preferred-output-format
[19]: ../#status-and-metrics-events
[20]: ../../observe-schedule/checks#check-specification
[21]: #check-attributes
[22]: #metrics-attribute
[23]: ../../observe-filter/reduce-alert-fatigue/
[24]: ../../observe-filter/filters/
[25]: ../../observe-schedule/checks/#check-result-specification
[26]: ../../../operations/control-access/namespaces/
[27]: ../../observe-filter/filters/#filter-for-state-change-only
[28]: ../../observe-filter/filters/#filter-for-repeated-events
[29]: #metadata-attributes
[30]: #metrics-attributes
[31]: #use-event-data
[32]: #history-attributes
[33]: ../../observe-schedule/checks#spec-attributes
[34]: #points-attributes
[35]: ../../../api/events#create-a-new-event
[36]: #state-attribute
[37]: ../../observe-schedule/checks/#high-flap-threshold
[38]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/flapping.html
[39]: #flap-detection-algorithm
[40]: ../../observe-filter/filters/#check-attributes-available-to-filters
[41]: ../../../plugins/featured-integrations/#time-series-and-long-term-event-storage
[47]: ../../observe-schedule/checks/#low-flap-threshold
