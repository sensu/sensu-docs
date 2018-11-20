---
title: "Events"
description: "The Events reference guide."
weight: 1
version: "5.0"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.0:
    parent: reference
---

- [Specification](#events-specification)
- [Examples](#example-check-only-event-data)

## How do Events work?

An event is a generic container used by Sensu to provide context to checks
and/or metrics. The context, called "event data," contains information about the
originating entity and the corresponding check/metric result. An event must
contain a check or metrics, and in certain cases, an event can contain both.
These generic containers allow Sensu to handle different types of events in the
pipeline. Since events are polymorphic in nature, it is important to never
assume their contents, or lack-thereof.

## Check-only events

A Sensu event is created every time a check result is processed by the Sensu
server, regardless of the status indicated by the check result. An event is
created by the agent on receipt of the check execution result. The agent will
execute any configured [hooks][4] the check might have. From there, it is
forwarded to the Sensu backend for processing. Potentially noteworthy events may
be processed by one or more event handlers to do things such as send an email or
invoke an automated action.

## Metric-only events

Sensu events can also be created when the agent receives metrics through the
[Statsd listener][5]. The agent will translate the statsd metrics to Sensu
Metric Format, and place them inside an event. These events, since they do not
contain checks, bypass the store, and are sent off to the event pipeline and
corresponding event handlers.

## Check and metric events

Events that contain _both_ a check and metrics, most likely originated from
[check output metric extraction][6]. If a check is configured for metric
extraction, the agent will parse the check output and transform it to Sensu
Metric Format. Both the check results, and resulting (extracted) metrics are
stored inside the event. Event handlers from `event.Check.Handlers` and
`event.Metrics.Handlers` will be invoked.

## Events specification

### Attributes
|timestamp   |      |
-------------|------
description  | The time of the Event occurrence in epoch time.
type         | integer
example      | {{< highlight shell >}}"timestamp": 1522099512{{< /highlight >}}

|silenced (deprecated)    |      |
-------------|------
description  | If the event is to be silenced.
type         | boolean
example      | {{< highlight shell >}}"silenced": false{{< /highlight >}}
_NOTE: Silenced has been deprecated from Event. Please see [check specification][7]._

|check       |      |
-------------|------
description  | The [Check attributes][1] used to obtain the check result.
type         | Check
example      | {{< highlight json >}}
"check": {
  "command": "http_check.sh http://localhost:80",
  "handlers": [
    "slack"
  ],
  "high_flap_threshold": 0,
  "interval": 20,
  "low_flap_threshold": 0,
  "publish": true,
  "runtime_assets": [],
  "subscriptions": [
    "testing"
  ],
  "proxy_entity_name": "",
  "check_hooks": null,
  "stdin": false,
  "subdue": null,
  "ttl": 0,
  "timeout": 0,
  "round_robin": false,
  "duration": 0.010849143,
  "executed": 1542667666,
  "history": [
    {
      "status": 1,
      "executed": 1542667666
    }
  ],
  "issued": 1542667666,
  "output": "",
  "state": "failing",
  "status": 1,
  "total_state_change": 0,
  "last_ok": 0,
  "occurrences": 1,
  "occurrences_watermark": 1,
  "output_metric_format": "",
  "output_metric_handlers": [],
  "env_vars": null,
  "metadata": {
    "name": "check-nginx",
    "namespace": "default",
    "labels": null,
    "annotations": null
  }
}
{{< /highlight >}}

<a name="metrics">

|metrics     |      |
-------------|------
description  | The metrics collected by the entity.
type         | Metrics
example      | {{< highlight json >}}
{
  "metrics": {
    "handlers": [
      "influx-db"
    ],
    "points": [
      {
        "name": "weather.temperature",
        "value": 82,
        "timestamp": 1465839830,
        "tags": [
          {
            "name": "location",
            "value": "us-midwest"
          },
          {
            "name": "season",
            "value": "summer"
          }
        ]
      },
      {
        "name": "weather.humidity",
        "value": 30,
        "timestamp": 1465839830,
        "tags": [
          {
            "name": "location",
            "value": "us-midwest"
          },
          {
            "name": "season",
            "value": "summer"
          }
        ]
      }
    ]
  }
}
{{< /highlight >}}

|entity      |      |
-------------|------
description  | The [entity attributes][2] from the originating entity (agent or proxy).
type         | Entity
example      | {{< highlight json >}}
"entity": {
  "entity_class": "agent",
  "system": {
    "hostname": "webserver01",
    "os": "linux",
    "platform": "centos",
    "platform_family": "rhel",
    "platform_version": "7.4.1708",
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
          "name": "enp0s3",
          "mac": "08:00:27:11:ad:d2",
          "addresses": [
            "10.0.2.15/24",
            "fe80::26a5:54ec:cf0d:9704/64"
          ]
        },
        {
          "name": "enp0s8",
          "mac": "08:00:27:bc:be:60",
          "addresses": [
            "172.28.128.3/24",
            "fe80::a00:27ff:febc:be60/64"
          ]
        }
      ]
    },
    "arch": "amd64"
  },
  "subscriptions": [
    "testing",
    "entity:webserver01"
  ],
  "last_seen": 1542667635,
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
    "name": "webserver01",
    "namespace": "default",
    "labels": null,
    "annotations": null
  }
}
{{< /highlight >}}

## Example check-only event data

{{< highlight json >}}
{
  "type": "Event",
  "spec": {
    "timestamp": 1542667666,
    "entity": {
      "entity_class": "agent",
      "system": {
        "hostname": "webserver01",
        "os": "linux",
        "platform": "centos",
        "platform_family": "rhel",
        "platform_version": "7.4.1708",
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
              "name": "enp0s3",
              "mac": "08:00:27:11:ad:d2",
              "addresses": [
                "10.0.2.15/24",
                "fe80::26a5:54ec:cf0d:9704/64"
              ]
            },
            {
              "name": "enp0s8",
              "mac": "08:00:27:bc:be:60",
              "addresses": [
                "172.28.128.3/24",
                "fe80::a00:27ff:febc:be60/64"
              ]
            }
          ]
        },
        "arch": "amd64"
      },
      "subscriptions": [
        "testing",
        "entity:webserver01"
      ],
      "last_seen": 1542667635,
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
        "name": "webserver01",
        "namespace": "default",
        "labels": null,
        "annotations": null
      }
    },
    "check": {
      "command": "http_check.sh http://localhost:80",
      "handlers": [
        "slack"
      ],
      "high_flap_threshold": 0,
      "interval": 20,
      "low_flap_threshold": 0,
      "publish": true,
      "runtime_assets": [],
      "subscriptions": [
        "testing"
      ],
      "proxy_entity_name": "",
      "check_hooks": null,
      "stdin": false,
      "subdue": null,
      "ttl": 0,
      "timeout": 0,
      "round_robin": false,
      "duration": 0.010849143,
      "executed": 1542667666,
      "history": [
        {
          "status": 1,
          "executed": 1542667666
        }
      ],
      "issued": 1542667666,
      "output": "",
      "state": "failing",
      "status": 1,
      "total_state_change": 0,
      "last_ok": 0,
      "occurrences": 1,
      "occurrences_watermark": 1,
      "output_metric_format": "",
      "output_metric_handlers": [],
      "env_vars": null,
      "metadata": {
        "name": "check-nginx",
        "namespace": "default",
        "labels": null,
        "annotations": null
      }
    }
  }
}
{{< /highlight >}}

[1]: ../checks/#check-attributes
[2]: ../entities/#entity-attributes
[3]: ../entities/
[4]: ../hooks/
[5]: ../../guides/aggregate-metrics-statsd/
[6]: ../../guides/extract-metrics-with-checks
[7]: ../checks/#check-specification
