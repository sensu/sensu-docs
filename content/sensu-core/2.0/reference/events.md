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

A Sensu Event is created every time a check result is processed by the Sensu server,
regardless of the status indicated by the check result. An Event is created by 
the agent on receipt of the check execution result. The agent will execute any configured
[hooks][4] the check might have. From there, it is forwarded to the Sensu backend 
for processing. Potentially noteworthy Events may be processed by one or more 
Event handlers to do things such as send an email or invoke an automated action. 
Every Sensu Event provides context, called “Event data”, which contains 
information about the originating entity and the corresponding check result.

## Events specification

### Attributes
timestamp    | 
-------------|------ 
description  | The time of the Event occurrence in eopoch time. 
type         | integer 
example      | {{< highlight shell >}}"timestamp": 1522099512{{</ highlight >}}

silenced     | 
-------------|------ 
description  | If the Event is to be silenced. 
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
    "id": "example-agent",
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

## Examples

### List all Events
With sensuctl, you can output a list of the most recent check events for a high
level status overview of monitored entities.
{{< highlight shell >}}
$ sensuctl event list
      Entity           Check                     Output                     Status    Silenced             Timestamp
 ───────────── ────────────────── ──────────────────────────  ──────── ────────── ───────────────────────────────
 example.hostname     example-http       CheckHttpResponseTime OK: 1669       0         false       2018-03-26 22:38:36 +0000 UTC 

{{</ highlight >}}

### Event info
To get more info on an event, such as more detailed status history, run sensuctl
event [ENTITY] [CHECK]:
{{< highlight shell >}}
$ sensuctl event info example.hostname example-http 
=== example.hostname - example-http 
Entity:    exmample.hostname 
Check:     example-http
Output:    CheckHttpResponseTime OK: 1042 is acceptable
Status:    0
History:   0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
Silenced:  false
Timestamp: 2018-03-26 23:34:55 +0000 UTC
{{</ highlight >}}

### Manual Event Resolution

In Sensu 1.x, we offer manual Event resolution through the POST /resolve endpoint. In Sensu 2.x, POST /Events can do that and more!

If you want to use sensuctl to manually resolve an Event, the `resolve` subcommand will resolve the output and set the status to 0.

{{< highlight shell >}}
$ sensuctl event resolve apollo-11 moon-landing

$ sensuctl event info apollo-11 moon-landing
== apollo-11 - moon-landing
Entity:    apollo-11
Check:     moon-landing
Output:    Resolved Manually by sensuctl
Status:    0
History:   0,1,0,1,0
Timestamp: 1969-07-20 14:10:32 -0600 CST
{{< /highlight >}}

[1]: ../checks/#check-attributes
[2]: ../entities/#entity-attributes
[3]: ../entities/
[4]: ../hooks/
