---
title: "Tokens"
description: "The tokens reference guide."
weight: 1
version: "2.0"
product: "Sensu Core"
menu: 
  sensu-core-2.0:
    parent: reference
---

## How do tokens work?
When a check is scheduled to be executed by an agent, it first goes through a token substitution step. Any tokens matching attribute values in the check are applied, and then the check is executed. Invalid templates or unmatched tokens will return an error, which is logged and sent to the Sensu backend message transport. Checks with token matching errors will not be executed.

## New and improved tokens
Sensu 2.0 uses the [Go template][1] package to implement token substitution. Instead of using triple colons `:::` as in [1.x token substitution][2], 2.0 token substitution uses double curly braces `{{` around tokens to be substituted.

## Sensu tokens specification

### Token substitution syntax

Tokens are invoked by wrapping references to entity or custom attributes with double curly braces, such as `{{ .ID }}` to substitute an entity's ID value. Nested Sensu [entity attributes][3] can be accessed via dot notation (e.g. `system.arch`).

- `{{ system.network.interfaces.addresses }}` would be replaced with the [entity `system.network.interfaces.address` attribute][26]
- `{{ url }}` would be replaced with a custom attribute called `url`
- `{{ disk.warning }}` would be replaced with a custom attribute called
  `warning` nested inside of a JSON hash called `disk`

### Token substitution default values

In the event that an attribute is not provided by the [entity][3], a token's default
value will be substituted. Token default values are separated by a pipe character (`|`), and can be used to provide a "fallback value" for entities that are missing a specified token attribute.

- `{{url|https://sensu.io}}` would be replaced with a [custom  attribute][3] called `url`. If no such attribute called `url` is included in the client definition, the default (or fallback) value of `https://sensu.io` will be used to substitute the token.

### Unmatched tokens

If a token is unmatched during check preparation, the agent check handler will return an error, and the check will not be executed. Unmatched token errors will look similar to the following:

{{< highlight shell >}}
error: unmatched token: template: :1:22: executing "" at <.System.Hostname>: map has no entry for key "System"
{{</ highlight >}}

Check config token errors will be logged by the agent, and sent to Sensu backend message transport as a check failure.

## Examples

### Token substitution for check thresholds 

In this example [check configuration][5], the `check-disk-usage.rb` command accepts `-w` (warning) and `-c` (critical)
arguments to indicate the thresholds (as percentages) for creating warning or critical events. If no token substitutions are provided by a check configuration, it will use default values to create a warning event at 80% disk capacity (i.e. `{{ disk.warning|80 }}`), and a critical event at 90% capacity (i.e. `{{ disk.critical|90 }}`).

{{< highlight json >}}
{
  "check_hooks": null,
  "command": "check-disk-usage.rb -w {{disk.warning|80}} -c {{disk.critical|90}}"
  "environment": "{{ environment|production }}",
  "handlers": [],
  "high_flap_threshold": 0,
  "interval": 60,
  "low_flap_threshold": 0,
  "name": "check-disk-usage",
  "organization": "default",
  "proxy_entity_id": "",
  "publish": true,
  "round_robin": false,
  "runtime_assets": [],
  "stdin": false,
  "subdue": null,
  "subscriptions": [
    "staging"
  ],
  "timeout": 0
}

{{< /highlight >}}

The following example [entity][4] would provide the necessary
attributes to override the `disk.warning`, `disk.critical`, and `environment`
tokens declared above.

{{< highlight json >}}
{
  "class": "agent",
  "deregister": false,
  "deregistration": {},
  "environment": "staging",
  "id": "example-hostname",
  "keepalive_timeout": 60,
  "last_seen": 1523387195,
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
    "entity:example-hostname",
    "staging"
  ],
  "system": {
    "hostname": "example-hostname",
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
  }
  "user": "agent",
  "region": "us-west-1",
  "team": "ops"
  "disk": {
    "warning": 75,
    "critical": 85
  },
}
{{< /highlight >}}

[1]: https://golang.org/pkg/text/template/
[2]: ../../../1.2/reference/checks/#check-token-substitution
[3]: ../entities/#entity-attributes
[4]: ../entities/
[5]: ../checks/
