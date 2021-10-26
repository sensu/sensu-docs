---
title: "Metrics reference"
linkTitle: "Metrics Reference"
reference_title: "Metrics"
type: "reference"
description: "Use checks to collect service and time-series metrics for your infrastructure and process extracted metrics with the Sensu observability pipeline. Read this reference doc to learn about Sensu Go's first-class support for collecting and processing service and time-series metrics."
weight: 33
version: "6.4"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.4:
    parent: observe-schedule
---

Sensu Go offers built-in support for collecting and processing service and time-series metrics for your entire infrastructure.

In Sensu, metrics are an optional component of observation data in events.
Sensu events may contain check execution results, metrics, or both.
Certain inputs like the [Sensu StatsD listener][2] or patterns like the [Prometheus][7] collector pattern will create metrics-only events.
Events can also include metrics from [check output metric extraction][4].

Use Sensu handlers to [process extracted metrics][11] and route them to databases like Elasticsearch, InfluxDB, Grafana, and Graphite.
You can also use Sensu's [time-series and long-term event storage integrations][18] to process service and time-series metrics.

{{% notice note %}}
**NOTE**: This reference describes the metrics component of observation data included in Sensu events, which is distinct from the Sensu metrics API.
For information about HTTP GET access to internal Sensu metrics, read our [metrics API](../../../api/metrics/) documentation.
{{% /notice %}}

## Metric check example

This check definition collects metrics in Graphite Plaintext Protocol [format][9] using the [Sensu System Check][] dynamic runtime asset and sends the collected metrics to a metrics handler configured with the [Sensu Go Graphite Handler][12] dynamic runtime asset:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: collect-system-metrics
  namespace: default
spec:
  check_hooks: null
  command: system-check
  env_vars: null
  handlers:
  - debug
  high_flap_threshold: 0
  interval: 10
  low_flap_threshold: 0
  output_metric_format: graphite_plaintext
  output_metric_handlers:
  - graphite-handler
  pipelines: []
  proxy_entity_name: ""
  publish: true
  round_robin: false
  runtime_assets:
  - system-check
  secrets: null
  stdin: false
  subdue: null
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
    "name": "collect-system-metrics",
    "namespace": "default"
  },
  "spec": {
    "check_hooks": null,
    "command": "system-check",
    "env_vars": null,
    "handlers": [
      "debug"
    ],
    "high_flap_threshold": 0,
    "interval": 10,
    "low_flap_threshold": 0,
    "output_metric_format": "graphite_plaintext",
    "output_metric_handlers": [
      "graphite-handler"
    ],
    "pipelines": [],
    "proxy_entity_name": "",
    "publish": true,
    "round_robin": false,
    "runtime_assets": [
      "system-check"
    ],
    "secrets": null,
    "stdin": false,
    "subdue": null,
    "subscriptions": [
      "system"
    ],
    "timeout": 0,
    "ttl": 0
  }
}
{{< /code >}}

{{< /language-toggle >}}

### Metric event example

The [example metric check][6] will produce events similar to this metric event:

{{< language-toggle >}}

{{< code yml >}}
---
pipelines:
timestamp: 1635270402
entity:
  entity_class: agent
  system:
    hostname: sensu-centos
    os: linux
    platform: centos
    platform_family: rhel
    platform_version: 7.5.1804
    network:
      interfaces:
      - name: lo
        addresses:
        - 127.0.0.1/8
        - "::1/128"
      - name: eth0
        mac: '08:00:27:8b:c9:3f'
        addresses:
        - 10.0.2.15/24
        - fe80::7103:bbce:3543:cfcf/64
      - name: eth1
        mac: '08:00:27:36:bb:67'
        addresses:
        - 172.28.128.89/24
        - fe80::a00:27ff:fe36:bb67/64
    arch: amd64
    libc_type: glibc
    vm_system: vbox
    vm_role: guest
    cloud_provider: ''
    processes:
  subscriptions:
  - system
  - entity:sensu-centos
  last_seen: 1635270399
  deregister: false
  deregistration: {}
  user: agent
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
  metadata:
    name: sensu-centos
    namespace: default
  sensu_agent_version: 6.5.1
check:
  command: system-check
  handlers:
  - debug
  high_flap_threshold: 0
  interval: 10
  low_flap_threshold: 0
  publish: true
  runtime_assets:
  - system-check
  subscriptions:
  - system
  proxy_entity_name: ''
  check_hooks:
  stdin: false
  subdue:
  ttl: 0
  timeout: 0
  round_robin: false
  duration: 3.00889206
  executed: 1635270399
  history:
  - status: 0
    executed: 1635270359
  - status: 0
    executed: 1635270369
  - status: 0
    executed: 1635270379
  - status: 0
    executed: 1635270389
  - status: 0
    executed: 1635270399
  issued: 1635270399
  output: |+
    # HELP system_cpu_cores [GAUGE] Number of cpu cores on the system
    # TYPE system_cpu_cores GAUGE
    system_cpu_cores{} 1 1635270399219
    # HELP system_cpu_idle [GAUGE] Percent of time all cpus were idle
    # TYPE system_cpu_idle GAUGE
    system_cpu_idle{cpu="cpu0"} 99.32885906040329 1635270399219
    system_cpu_idle{cpu="cpu-total"} 99.32885906040329 1635270399219
    # HELP system_cpu_used [GAUGE] Percent of time all cpus were used
    # TYPE system_cpu_used GAUGE
    system_cpu_used{cpu="cpu0"} 0.671140939596711 1635270399219
    system_cpu_used{cpu="cpu-total"} 0.671140939596711 1635270399219
    # HELP system_cpu_user [GAUGE] Percent of time total cpu was used by normal processes in user mode
    # TYPE system_cpu_user GAUGE
    system_cpu_user{cpu="cpu0"} 0.3355704697986485 1635270399219
    system_cpu_user{cpu="cpu-total"} 0.3355704697986485 1635270399219
    # HELP system_cpu_system [GAUGE] Percent of time all cpus used by processes executed in kernel mode
    # TYPE system_cpu_system GAUGE
    system_cpu_system{cpu="cpu0"} 0.33557046979867833 1635270399219
    system_cpu_system{cpu="cpu-total"} 0.33557046979867833 1635270399219
    # HELP system_cpu_nice [GAUGE] Percent of time all cpus used by niced processes in user mode
    # TYPE system_cpu_nice GAUGE
    system_cpu_nice{cpu="cpu0"} 0 1635270399219
    system_cpu_nice{cpu="cpu-total"} 0 1635270399219
    # HELP system_cpu_iowait [GAUGE] Percent of time all cpus waiting for I/O to complete
    # TYPE system_cpu_iowait GAUGE
    system_cpu_iowait{cpu="cpu0"} 0 1635270399219
    system_cpu_iowait{cpu="cpu-total"} 0 1635270399219
    # HELP system_cpu_irq [GAUGE] Percent of time all cpus servicing interrupts
    # TYPE system_cpu_irq GAUGE
    system_cpu_irq{cpu="cpu0"} 0 1635270399219
    system_cpu_irq{cpu="cpu-total"} 0 1635270399219
    # HELP system_cpu_sortirq [GAUGE] Percent of time all cpus servicing software interrupts
    # TYPE system_cpu_sortirq GAUGE
    system_cpu_sortirq{cpu="cpu0"} 0 1635270399219
    system_cpu_sortirq{cpu="cpu-total"} 0 1635270399219
    # HELP system_cpu_stolen [GAUGE] Percent of time all cpus serviced virtual hosts operating systems
    # TYPE system_cpu_stolen GAUGE
    system_cpu_stolen{cpu="cpu0"} 0 1635270399219
    system_cpu_stolen{cpu="cpu-total"} 0 1635270399219
    # HELP system_cpu_guest [GAUGE] Percent of time all cpus serviced guest operating system
    # TYPE system_cpu_guest GAUGE
    system_cpu_guest{cpu="cpu0"} 0 1635270399219
    system_cpu_guest{cpu="cpu-total"} 0 1635270399219
    # HELP system_cpu_guest_nice [GAUGE] Percent of time all cpus serviced niced guest operating system
    # TYPE system_cpu_guest_nice GAUGE
    system_cpu_guest_nice{cpu="cpu0"} 0 1635270399219
    system_cpu_guest_nice{cpu="cpu-total"} 0 1635270399219
    # HELP system_mem_used [GAUGE] Percent of memory used
    # TYPE system_mem_used GAUGE
    system_mem_used{} 21.21448463577672 1635270399219
    # HELP system_mem_used_bytes [GAUGE] Used memory in bytes
    # TYPE system_mem_used_bytes GAUGE
    system_mem_used_bytes{} 2.20598272e+08 1635270399219
    # HELP system_mem_total_bytes [GAUGE] Total memory in bytes
    # TYPE system_mem_total_bytes GAUGE
    system_mem_total_bytes{} 1.039847424e+09 1635270399219
    # HELP system_swap_used [GAUGE] Percent of swap used
    # TYPE system_swap_used GAUGE
    system_swap_used{} 0 1635270399219
    # HELP system_swap_used_bytes [GAUGE] Used swap in bytes
    # TYPE system_swap_used_bytes GAUGE
    system_swap_used_bytes{} 2.20598272e+08 1635270399219
    # HELP system_swap_total_bytes [GAUGE] Total swap in bytes
    # TYPE system_swap_total_bytes GAUGE
    system_swap_total_bytes{} 2.147479552e+09 1635270399219
    # HELP system_load_load1 [GAUGE] System load averaged over 1 minute, high load value dependant on number of cpus in system
    # TYPE system_load_load1 GAUGE
    system_load_load1{} 0 1635270399219
    # HELP system_load_load5 [GAUGE] System load averaged over 5 minute, high load value dependent on number of cpus in system
    # TYPE system_load_load5 GAUGE
    system_load_load5{} 0.01 1635270399219
    # HELP system_load_load15 [GAUGE] System load averaged over 15 minute, high load value dependent on number of cpus in system
    # TYPE system_load_load15 GAUGE
    system_load_load15{} 0.05 1635270399219
    # HELP system_load_load1_per_cpu [GAUGE] System load averaged over 1 minute normalized by cpu count, values \u003e 1 means system may be overloaded
    # TYPE system_load_load1_per_cpu GAUGE
    system_load_load1_per_cpu{} 0 1635270399219
    # HELP system_load_load5_per_cpu [GAUGE] System load averaged over 5 minute normalized by cpu count, values \u003e 1 means system may be overloaded
    # TYPE system_load_load5_per_cpu GAUGE
    system_load_load5_per_cpu{} 0.01 1635270399219
    # HELP system_load_load15_per_cpu [GAUGE] System load averaged over 15 minute normalized by cpu count, values \u003e 1 means system may be overloaded
    # TYPE system_load_load15_per_cpu GAUGE
    system_load_load15_per_cpu{} 0.05 1635270399219
    # HELP system_host_uptime [COUNTER] Host uptime in seconds
    # TYPE system_host_uptime COUNTER
    system_host_uptime{} 982 1635270399219
    # HELP system_host_processes [GAUGE] Number of host processes
    # TYPE system_host_processes GAUGE
    system_host_processes{} 109 1635270399219

  state: passing
  status: 0
  total_state_change: 0
  last_ok: 1635270399
  occurrences: 5
  occurrences_watermark: 5
  output_metric_format: graphite_plaintext
  output_metric_handlers:
  - graphite-handler
  env_vars:
  metadata:
    name: collect-system-metrics
    namespace: default
  secrets:
  is_silenced: false
  scheduler: memory
  processed_by: sensu-centos
  pipelines: []
metrics:
  handlers:
  - graphite-handler
  points:
  - name: system_cpu_cores{}
    value: 1
    timestamp: 1635270399219
    tags:
  - name: system_cpu_idle{cpu="cpu0"}
    value: 99.32885906040329
    timestamp: 1635270399219
    tags:
  - name: system_cpu_idle{cpu="cpu-total"}
    value: 99.32885906040329
    timestamp: 1635270399219
    tags:
  - name: system_cpu_used{cpu="cpu0"}
    value: 0.671140939596711
    timestamp: 1635270399219
    tags:
  - name: system_cpu_used{cpu="cpu-total"}
    value: 0.671140939596711
    timestamp: 1635270399219
    tags:
  - name: system_cpu_user{cpu="cpu0"}
    value: 0.3355704697986485
    timestamp: 1635270399219
    tags:
  - name: system_cpu_user{cpu="cpu-total"}
    value: 0.3355704697986485
    timestamp: 1635270399219
    tags:
  - name: system_cpu_system{cpu="cpu0"}
    value: 0.33557046979867833
    timestamp: 1635270399219
    tags:
  - name: system_cpu_system{cpu="cpu-total"}
    value: 0.33557046979867833
    timestamp: 1635270399219
    tags:
  - name: system_cpu_nice{cpu="cpu0"}
    value: 0
    timestamp: 1635270399219
    tags:
  - name: system_cpu_nice{cpu="cpu-total"}
    value: 0
    timestamp: 1635270399219
    tags:
  - name: system_cpu_iowait{cpu="cpu0"}
    value: 0
    timestamp: 1635270399219
    tags:
  - name: system_cpu_iowait{cpu="cpu-total"}
    value: 0
    timestamp: 1635270399219
    tags:
  - name: system_cpu_irq{cpu="cpu0"}
    value: 0
    timestamp: 1635270399219
    tags:
  - name: system_cpu_irq{cpu="cpu-total"}
    value: 0
    timestamp: 1635270399219
    tags:
  - name: system_cpu_sortirq{cpu="cpu0"}
    value: 0
    timestamp: 1635270399219
    tags:
  - name: system_cpu_sortirq{cpu="cpu-total"}
    value: 0
    timestamp: 1635270399219
    tags:
  - name: system_cpu_stolen{cpu="cpu0"}
    value: 0
    timestamp: 1635270399219
    tags:
  - name: system_cpu_stolen{cpu="cpu-total"}
    value: 0
    timestamp: 1635270399219
    tags:
  - name: system_cpu_guest{cpu="cpu0"}
    value: 0
    timestamp: 1635270399219
    tags:
  - name: system_cpu_guest{cpu="cpu-total"}
    value: 0
    timestamp: 1635270399219
    tags:
  - name: system_cpu_guest_nice{cpu="cpu0"}
    value: 0
    timestamp: 1635270399219
    tags:
  - name: system_cpu_guest_nice{cpu="cpu-total"}
    value: 0
    timestamp: 1635270399219
    tags:
  - name: system_mem_used{}
    value: 21.21448463577672
    timestamp: 1635270399219
    tags:
  - name: system_mem_used_bytes{}
    value: 220598272
    timestamp: 1635270399219
    tags:
  - name: system_mem_total_bytes{}
    value: 1039847424
    timestamp: 1635270399219
    tags:
  - name: system_swap_used{}
    value: 0
    timestamp: 1635270399219
    tags:
  - name: system_swap_used_bytes{}
    value: 220598272
    timestamp: 1635270399219
    tags:
  - name: system_swap_total_bytes{}
    value: 2147479552
    timestamp: 1635270399219
    tags:
  - name: system_load_load1{}
    value: 0
    timestamp: 1635270399219
    tags:
  - name: system_load_load5{}
    value: 0.01
    timestamp: 1635270399219
    tags:
  - name: system_load_load15{}
    value: 0.05
    timestamp: 1635270399219
    tags:
  - name: system_load_load1_per_cpu{}
    value: 0
    timestamp: 1635270399219
    tags:
  - name: system_load_load5_per_cpu{}
    value: 0.01
    timestamp: 1635270399219
    tags:
  - name: system_load_load15_per_cpu{}
    value: 0.05
    timestamp: 1635270399219
    tags:
  - name: system_host_uptime{}
    value: 982
    timestamp: 1635270399219
    tags:
  - name: system_host_processes{}
    value: 109
    timestamp: 1635270399219
    tags:
metadata:
  namespace: default
id: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
sequence: 5
{{< /code >}}

{{< code json >}}
{
  "pipelines": null,
  "timestamp": 1635270402,
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
              "fe80::7103:bbce:3543:cfcf/64"
            ]
          },
          {
            "name": "eth1",
            "mac": "08:00:27:36:bb:67",
            "addresses": [
              "172.28.128.89/24",
              "fe80::a00:27ff:fe36:bb67/64"
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
      "system",
      "entity:sensu-centos"
    ],
    "last_seen": 1635270399,
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
    "sensu_agent_version": "6.5.1"
  },
  "check": {
    "command": "system-check",
    "handlers": [
      "debug"
    ],
    "high_flap_threshold": 0,
    "interval": 10,
    "low_flap_threshold": 0,
    "publish": true,
    "runtime_assets": [
      "system-check"
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
    "duration": 3.00889206,
    "executed": 1635270399,
    "history": [
      {
        "status": 0,
        "executed": 1635270359
      },
      {
        "status": 0,
        "executed": 1635270369
      },
      {
        "status": 0,
        "executed": 1635270379
      },
      {
        "status": 0,
        "executed": 1635270389
      },
      {
        "status": 0,
        "executed": 1635270399
      }
    ],
    "issued": 1635270399,
    "output": "# HELP system_cpu_cores [GAUGE] Number of cpu cores on the system\n# TYPE system_cpu_cores GAUGE\nsystem_cpu_cores{} 1 1635270399219\n# HELP system_cpu_idle [GAUGE] Percent of time all cpus were idle\n# TYPE system_cpu_idle GAUGE\nsystem_cpu_idle{cpu=\"cpu0\"} 99.32885906040329 1635270399219\nsystem_cpu_idle{cpu=\"cpu-total\"} 99.32885906040329 1635270399219\n# HELP system_cpu_used [GAUGE] Percent of time all cpus were used\n# TYPE system_cpu_used GAUGE\nsystem_cpu_used{cpu=\"cpu0\"} 0.671140939596711 1635270399219\nsystem_cpu_used{cpu=\"cpu-total\"} 0.671140939596711 1635270399219\n# HELP system_cpu_user [GAUGE] Percent of time total cpu was used by normal processes in user mode\n# TYPE system_cpu_user GAUGE\nsystem_cpu_user{cpu=\"cpu0\"} 0.3355704697986485 1635270399219\nsystem_cpu_user{cpu=\"cpu-total\"} 0.3355704697986485 1635270399219\n# HELP system_cpu_system [GAUGE] Percent of time all cpus used by processes executed in kernel mode\n# TYPE system_cpu_system GAUGE\nsystem_cpu_system{cpu=\"cpu0\"} 0.33557046979867833 1635270399219\nsystem_cpu_system{cpu=\"cpu-total\"} 0.33557046979867833 1635270399219\n# HELP system_cpu_nice [GAUGE] Percent of time all cpus used by niced processes in user mode\n# TYPE system_cpu_nice GAUGE\nsystem_cpu_nice{cpu=\"cpu0\"} 0 1635270399219\nsystem_cpu_nice{cpu=\"cpu-total\"} 0 1635270399219\n# HELP system_cpu_iowait [GAUGE] Percent of time all cpus waiting for I/O to complete\n# TYPE system_cpu_iowait GAUGE\nsystem_cpu_iowait{cpu=\"cpu0\"} 0 1635270399219\nsystem_cpu_iowait{cpu=\"cpu-total\"} 0 1635270399219\n# HELP system_cpu_irq [GAUGE] Percent of time all cpus servicing interrupts\n# TYPE system_cpu_irq GAUGE\nsystem_cpu_irq{cpu=\"cpu0\"} 0 1635270399219\nsystem_cpu_irq{cpu=\"cpu-total\"} 0 1635270399219\n# HELP system_cpu_sortirq [GAUGE] Percent of time all cpus servicing software interrupts\n# TYPE system_cpu_sortirq GAUGE\nsystem_cpu_sortirq{cpu=\"cpu0\"} 0 1635270399219\nsystem_cpu_sortirq{cpu=\"cpu-total\"} 0 1635270399219\n# HELP system_cpu_stolen [GAUGE] Percent of time all cpus serviced virtual hosts operating systems\n# TYPE system_cpu_stolen GAUGE\nsystem_cpu_stolen{cpu=\"cpu0\"} 0 1635270399219\nsystem_cpu_stolen{cpu=\"cpu-total\"} 0 1635270399219\n# HELP system_cpu_guest [GAUGE] Percent of time all cpus serviced guest operating system\n# TYPE system_cpu_guest GAUGE\nsystem_cpu_guest{cpu=\"cpu0\"} 0 1635270399219\nsystem_cpu_guest{cpu=\"cpu-total\"} 0 1635270399219\n# HELP system_cpu_guest_nice [GAUGE] Percent of time all cpus serviced niced guest operating system\n# TYPE system_cpu_guest_nice GAUGE\nsystem_cpu_guest_nice{cpu=\"cpu0\"} 0 1635270399219\nsystem_cpu_guest_nice{cpu=\"cpu-total\"} 0 1635270399219\n# HELP system_mem_used [GAUGE] Percent of memory used\n# TYPE system_mem_used GAUGE\nsystem_mem_used{} 21.21448463577672 1635270399219\n# HELP system_mem_used_bytes [GAUGE] Used memory in bytes\n# TYPE system_mem_used_bytes GAUGE\nsystem_mem_used_bytes{} 2.20598272e+08 1635270399219\n# HELP system_mem_total_bytes [GAUGE] Total memory in bytes\n# TYPE system_mem_total_bytes GAUGE\nsystem_mem_total_bytes{} 1.039847424e+09 1635270399219\n# HELP system_swap_used [GAUGE] Percent of swap used\n# TYPE system_swap_used GAUGE\nsystem_swap_used{} 0 1635270399219\n# HELP system_swap_used_bytes [GAUGE] Used swap in bytes\n# TYPE system_swap_used_bytes GAUGE\nsystem_swap_used_bytes{} 2.20598272e+08 1635270399219\n# HELP system_swap_total_bytes [GAUGE] Total swap in bytes\n# TYPE system_swap_total_bytes GAUGE\nsystem_swap_total_bytes{} 2.147479552e+09 1635270399219\n# HELP system_load_load1 [GAUGE] System load averaged over 1 minute, high load value dependant on number of cpus in system\n# TYPE system_load_load1 GAUGE\nsystem_load_load1{} 0 1635270399219\n# HELP system_load_load5 [GAUGE] System load averaged over 5 minute, high load value dependent on number of cpus in system\n# TYPE system_load_load5 GAUGE\nsystem_load_load5{} 0.01 1635270399219\n# HELP system_load_load15 [GAUGE] System load averaged over 15 minute, high load value dependent on number of cpus in system\n# TYPE system_load_load15 GAUGE\nsystem_load_load15{} 0.05 1635270399219\n# HELP system_load_load1_per_cpu [GAUGE] System load averaged over 1 minute normalized by cpu count, values \\u003e 1 means system may be overloaded\n# TYPE system_load_load1_per_cpu GAUGE\nsystem_load_load1_per_cpu{} 0 1635270399219\n# HELP system_load_load5_per_cpu [GAUGE] System load averaged over 5 minute normalized by cpu count, values \\u003e 1 means system may be overloaded\n# TYPE system_load_load5_per_cpu GAUGE\nsystem_load_load5_per_cpu{} 0.01 1635270399219\n# HELP system_load_load15_per_cpu [GAUGE] System load averaged over 15 minute normalized by cpu count, values \\u003e 1 means system may be overloaded\n# TYPE system_load_load15_per_cpu GAUGE\nsystem_load_load15_per_cpu{} 0.05 1635270399219\n# HELP system_host_uptime [COUNTER] Host uptime in seconds\n# TYPE system_host_uptime COUNTER\nsystem_host_uptime{} 982 1635270399219\n# HELP system_host_processes [GAUGE] Number of host processes\n# TYPE system_host_processes GAUGE\nsystem_host_processes{} 109 1635270399219\n\n",
    "state": "passing",
    "status": 0,
    "total_state_change": 0,
    "last_ok": 1635270399,
    "occurrences": 5,
    "occurrences_watermark": 5,
    "output_metric_format": "graphite_plaintext",
    "output_metric_handlers": [
      "graphite-handler"
    ],
    "env_vars": null,
    "metadata": {
      "name": "collect-system-metrics",
      "namespace": "default"
    },
    "secrets": null,
    "is_silenced": false,
    "scheduler": "memory",
    "processed_by": "sensu-centos",
    "pipelines": []
  },
  "metrics": {
    "handlers": [
      "graphite-handler"
    ],
    "points": [
      {
        "name": "system_cpu_cores{}",
        "value": 1,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_idle{cpu=\"cpu0\"}",
        "value": 99.32885906040329,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_idle{cpu=\"cpu-total\"}",
        "value": 99.32885906040329,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_used{cpu=\"cpu0\"}",
        "value": 0.671140939596711,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_used{cpu=\"cpu-total\"}",
        "value": 0.671140939596711,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_user{cpu=\"cpu0\"}",
        "value": 0.3355704697986485,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_user{cpu=\"cpu-total\"}",
        "value": 0.3355704697986485,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_system{cpu=\"cpu0\"}",
        "value": 0.33557046979867833,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_system{cpu=\"cpu-total\"}",
        "value": 0.33557046979867833,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_nice{cpu=\"cpu0\"}",
        "value": 0,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_nice{cpu=\"cpu-total\"}",
        "value": 0,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_iowait{cpu=\"cpu0\"}",
        "value": 0,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_iowait{cpu=\"cpu-total\"}",
        "value": 0,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_irq{cpu=\"cpu0\"}",
        "value": 0,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_irq{cpu=\"cpu-total\"}",
        "value": 0,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_sortirq{cpu=\"cpu0\"}",
        "value": 0,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_sortirq{cpu=\"cpu-total\"}",
        "value": 0,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_stolen{cpu=\"cpu0\"}",
        "value": 0,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_stolen{cpu=\"cpu-total\"}",
        "value": 0,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_guest{cpu=\"cpu0\"}",
        "value": 0,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_guest{cpu=\"cpu-total\"}",
        "value": 0,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_guest_nice{cpu=\"cpu0\"}",
        "value": 0,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_cpu_guest_nice{cpu=\"cpu-total\"}",
        "value": 0,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_mem_used{}",
        "value": 21.21448463577672,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_mem_used_bytes{}",
        "value": 220598272,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_mem_total_bytes{}",
        "value": 1039847424,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_swap_used{}",
        "value": 0,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_swap_used_bytes{}",
        "value": 220598272,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_swap_total_bytes{}",
        "value": 2147479552,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_load_load1{}",
        "value": 0,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_load_load5{}",
        "value": 0.01,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_load_load15{}",
        "value": 0.05,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_load_load1_per_cpu{}",
        "value": 0,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_load_load5_per_cpu{}",
        "value": 0.01,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_load_load15_per_cpu{}",
        "value": 0.05,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_host_uptime{}",
        "value": 982,
        "timestamp": 1635270399219,
        "tags": null
      },
      {
        "name": "system_host_processes{}",
        "value": 109,
        "timestamp": 1635270399219,
        "tags": null
      }
    ]
  },
  "metadata": {
    "namespace": "default"
  },
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "sequence": 5
}
{{< /code >}}

{{< /language-toggle >}}

{{% notice note %}}
**NOTE**: Metrics data points are not included in events retrieved with `sensuctl event info` &mdash; these events include check output text rather than a set of metrics points.
To view metrics points data, add a [debug handler](../../../operations/maintain-sensu/troubleshoot#use-a-debug-handler) that prints events to a JSON file. 
{{% /notice %}}

## Extract metrics from check output

The Sensu agent can extract metrics data from check command output and populate an event's [metrics attribute][5] before sending the event to the Sensu backend for [processing][11].

To extract metrics from check output:

- The check `command` execution must output metrics in one of Sensu's [supported output metric formats][9].
- The check must include the [`output_metric_format` attribute][10] with a value that specifies one of Sensu's [supported output metric formats][9].

When a check includes correctly configured `command` and `output_metric_format` attributes, Sensu will extract the specified metrics from the check output and add them to the event data in the [metrics attribute][5].

You can also configure the check `output_metric_handlers` attribute to use a Sensu handler that is equipped to handle Sensu metrics.
Read the [checks reference][3] or [InfluxDB handler guide][23] to learn more.

### Supported output metric formats

Sensu supports the following formats for check output metric extraction.

| Graphite           |      |
---------------------|------
output metric format | `graphite_plaintext`
documentation        | [Graphite Plaintext Protocol][14]
example              | {{< code plain >}}local.random.diceroll 4 123456789{{< /code >}}

| InfluxDB           |      |
---------------------|------
output metric format | `influxdb_line`
documentation        | [InfluxDB Line Protocol][15]
example              | {{< code plain >}}weather,location=us-midwest temperature=82 1465839830100400200{{< /code >}}

| Nagios             |      |
---------------------|------
output metric format | `nagios_perfdata`
documentation        | [Nagios Performance Data][13]
example              | {{< code plain >}}PING ok - Packet loss = 0%, RTA = 0.80 ms | percent_packet_loss=0, rta=0.80{{< /code >}}

| OpenTSDB           |      |
---------------------|------
output metric format | `opentsdb_line`
documentation        | [OpenTSDB Data Specification][16]
example              | {{< code plain >}}sys.cpu.user 1356998400 42.5 host=webserver01 cpu=0{{< /code >}}

| Prometheus         |      |
---------------------|------
output metric format | `prometheus_text`
documentation        | [Prometheus Exposition Text][17]
example              | {{< code plain >}}http_requests_total{method="post",code="200"} 1027 1395066363000{{< /code >}}

## Enrich metrics with tags

[Output metric tags][1] are custom tags you can apply to enrich the metric points produced by check output metric extraction.

Use output metric tags for the output metric formats that do not natively support tags: Graphite Plaintext Protocol and Nagios Performance Data.

Values for output metric tags are passed through to the metric points produced by check output metric extraction for formats that natively support tags (InfluxDB Line Protocol, OpenTSDB Data Specification, and Prometheus Exposition Text).

You can use [check token substitution][22] for the [value attribute][21] to include any event attribute in an output metric tag.
For example, this tag will list the `event.time` attribute:

{{< code shell >}}
"output_metric_tags": [
  {
    "name": "instance",
    "value": "{{ .entity.system.hostname }}"
  }
]{{< /code >}}

## Process extracted and tagged metrics

Specify the event handlers you want to process your Sensu metrics in the check [`output_metric_handlers`][3] attribute.
With these event handlers, you can route metrics to one or more databases for storing and visualizing metrics, like Elasticsearch, InfluxDB, Grafana, and Graphite.

Many of our most popular metrics integrations for [time-series and long-term event storage][18] include curated, configurable quick-start templates to integrate Sensu with your existing workflows.
You can also use [Bonsai][8], the Sensu asset hub, to discover, download, and share dynamic runtime assets for processing metrics.

In check definitions, the `output_metric_handlers` list for metrics event handlers is distinct and separate from the `handlers` list for status event handlers.
Having separate handlers attributes allows you to use different workflows for metrics and status without applying conditional filter logic.
The events reference includes an [example event with check and metric data][20].

You do not need to add a mutator to your check definition to process metrics with an event handler.
The [metrics attribute][5] format automatically reduces metrics data complexity so event handlers can process metrics effectively.

## Validate metrics

If the check output is formatted correctly according to its `output_metric_format`, the metrics will be extracted in Sensu metric format and passed to the observability pipeline.
The Sensu agent will log errors if it cannot parse the check output.

Use the [debug handler example][24] to write metric events to a file for inspection.
To confirm that the check extracted metrics, inspect the event passed to the handler in the debug-event.json file.
The event will include a top-level [metrics section][5] populated with [metrics points arrays][25] if the Sensu agent correctly ingested the metrics.

## Metrics specification

The check specification describes [metrics attributes in checks][19].

The event specification describes [metrics attributes in events][5].


[1]: ../checks/#output-metric-tags
[2]: ../../observe-process/aggregate-metrics-statsd/
[3]: ../checks/#output-metric-handlers
[4]: #extract-metrics-from-check-output
[5]: ../../observe-events/events/#metrics-attribute
[6]: #metric-check-example
[7]: ../prometheus-metrics/
[8]: https://bonsai.sensu.io/
[9]: #supported-output-metric-formats
[10]: ../checks/#output-metric-format
[11]: #process-extracted-and-tagged-metrics
[12]: https://bonsai.sensu.io/assets/sensu/sensu-go-graphite-handler
[13]: https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/3/en/perfdata.html
[14]: https://graphite.readthedocs.io/en/latest/feeding-carbon.html#the-plaintext-protocol
[15]: https://docs.influxdata.com/enterprise_influxdb/v1.9/write_protocols/line_protocol_reference/
[16]: http://opentsdb.net/docs/build/html/user_guide/writing/index.html#data-specification
[17]: https://prometheus.io/docs/instrumenting/exposition_formats/#text-based-format
[18]: ../../../plugins/supported-integrations/#time-series-and-long-term-event-storage
[19]: ../checks/#output-metric-format
[20]: ../../observe-events/events/#example-status-and-metrics-event
[21]: ../checks/#output_metric_tags-attributes
[22]: ../checks/#check-token-substitution
[23]: ../../observe-process/populate-metrics-influxdb/
[24]: ../../../operations/maintain-sensu/troubleshoot#use-a-debug-handler
[25]: ../../observe-events/events/#metrics-points
