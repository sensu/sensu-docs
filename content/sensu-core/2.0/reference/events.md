---
title: "Events"
description: "The Events reference guide."
weight: 1
version: "2.0"
product: "Sensu Core"
platformContent: false 
menu:
  sensu-core-2.0:
    parent: reference
---
## How do Events work?

A Sensu event is created every time a check result is processed by the Sensu server,
regardless of the status indicated by the check result. An event is created by 
the agent on receipt of the check execution result. The agent will execute any configured
[hooks][4] the check might have. From there, it is forwarded to the Sensu backend 
for processing. Potentially noteworthy events may be processed by one or more 
event handlers to do things such as send an email or invoke an automated action. 
Every Sensu Event provides context, called “event data”, which contains 
information about the originating entity and the corresponding check result.

## Events specification

### Attributes
timestamp    | 
-------------|------ 
description  | The time of the Event occurrence in epoch time. 
type         | integer 
example      | {{< highlight shell >}}"timestamp": 1522099512{{</ highlight >}}

silenced     | 
-------------|------ 
description  | If the event is to be silenced. 
type         | boolean 
example      | {{< highlight shell >}}"silenced": false{{</ highlight >}}

check        | 
-------------|------ 
description  | The [Check attributes][1] used to obtain the check result. 
type         | Check 
example      | {{< highlight json >}}
  "check": {
    "check_hooks": null,
    "command": "check-http-response-time.rb -a example.com -C 5000 -w 3000",
    "duration": 1.903135228,
    "environment": "default",
    "executed": 1522100915,
    "handlers": [],
    "high_flap_threshold": 0,
    "history": [
      {
        "executed": 1522100315
      },
      {
        "executed": 1522100915
      }
    ],
    "interval": 300,
    "last_ok": 1522100916,
    "low_flap_threshold": 0,
    "name": "example-check",
    "occurrences": 1,
    "occurrences_watermark": 1,
    "organization": "default",
    "output": "CheckHttpResponseTime OK: 1635 is acceptable\n",
    "proxy_entity_id": "",
    "publish": true,
    "round_robin": false,
    "runtime_assets": [],
    "state": "passing",
    "status": 0,
    "stdin": false,
    "subdue": null,
    "subscriptions": [
      "web"
    ],
    "timeout": 30,
    "total_state_change": 0
  }
{{</ highlight >}}

entity       | 
-------------|------ 
description  | The [entity attributes][2] from the originating entity (agent or proxy). 
type         | Entity 
example      | {{< highlight json >}}
  "entity": {
    "class": "agent",
    "deregister": false,
    "deregistration": {},
    "environment": "default",
    "id": "example-entity",
    "keepalive_timeout": 120,
    "organization": "default",
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
      "web",
      "entity:example-entity"
    ],
    "system": {
      "hostname": "example",
      "os": "linux",
      "platform": "ubuntu",
      "platform_family": "debian",
      "platform_version": "16.04",
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
            "mac": "52:54:00:20:1b:3c",
            "addresses": [
              "93.184.216.34/24",
              "2606:2800:220:1:248:1893:25c8:1946/10"
            ]
          }
        ]
      },
      "arch": "amd64"
    },
    "user": "agent"
  }
{{</ highlight >}}

## Example event data

{{< highlight json >}}
  {
    "timestamp": 1522170515,
    "entity": {
      "class": "agent",
      "deregister": false,
      "deregistration": {},
      "environment": "default",
      "id": "example-entity",
      "keepalive_timeout": 120,
      "organization": "default",
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
        "web",
        "entity:example-entity"
      ],
      "system": {
        "hostname": "example-entity",
        "os": "linux",
        "platform": "ubuntu",
        "platform_family": "debian",
        "platform_version": "16.04",
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
              "mac": "52:54:00:20:1b:3c",
              "addresses": [
                "192.168.1.1/25",
                "fd9e:a92d:eddd:12d1:119/10"
              ]
            }
          ]
        },
        "arch": "amd64"
      },
      "user": "agent"
    },
    "check": {
      "check_hooks": null,
      "command": "check-http-response-time.rb -a example.com -C 5000 -w 3000",
      "duration": 2.033888684,
      "environment": "default",
      "executed": 1522170513,
      "handlers": [
        "example-handler"
      ],
      "high_flap_threshold": 0,
      "history": [
        {
          "executed": 1522169313
        },
        {
          "executed": 1522169613
        },
        {
          "executed": 1522169913
        },
        {
          "executed": 1522170213
        },
        {
          "executed": 1522170513
        }
      ],
      "interval": 300,
      "last_ok": 1522170515,
      "low_flap_threshold": 0,
      "name": "example-http-check",
      "occurrences": 1,
      "occurrences_watermark": 1,
      "organization": "default",
      "output": "CheckHttpResponseTime OK: 1771 is acceptable\n",
      "proxy_entity_id": "",
      "publish": true,
      "round_robin": false,
      "runtime_assets": [],
      "state": "passing",
      "status": 0,
      "stdin": false,
      "subdue": null,
      "subscriptions": [
        "web"
      ],
      "timeout": 30,
      "total_state_change": 0
    }
  }
{{</ highlight >}}

[1]: ../checks/#check-attributes
[2]: ../entities/#entity-attributes
[3]: ../entities/
[4]: ../hooks/
