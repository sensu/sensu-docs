---
title: "Tokens"
description: "The tokens reference guide."
weight: 1
version: "5.0"
product: "Sensu Go"
menu: 
  sensu-go-5.0:
    parent: reference
---

- [Specification](#sensu-tokens-specification)
- [Examples](#examples)

## How do tokens work?
When a check is scheduled to be executed by an agent, it first goes through a token substitution step. Any tokens matching attribute values in the check are applied, and then the check is executed. Invalid templates or unmatched tokens will return an error, which is logged and sent to the Sensu backend message transport. Checks with token matching errors will not be executed.

## New and improved tokens
Sensu Go uses the [Go template][1] package to implement token substitution. Instead of using triple colons `:::` as in [1.x token substitution][2], 2.0 token substitution uses double curly braces around the token, and a dot before the attribute to be substituted, such as: `{{ .System.Hostname }}`.

## Sensu tokens specification

### Token substitution syntax

Tokens are invoked by wrapping references to entity or custom attributes with double curly braces, such as `{{ .ID }}` to substitute an entity's ID value. Nested Sensu [entity attributes][3] can be accessed via dot notation (ex: `System.Arch`).

- `{{ .ID }}` would be replaced with the [entity `ID` attribute][3]
- `{{ .URL }}` would be replaced with a custom attribute called `url`
- `{{ .Disk.Warning }}` would be replaced with a custom attribute called
  `warning` nested inside of a JSON hash called `disk`

### Token substitution default values

In the event that an attribute is not provided by the [entity][3], a token's default
value will be substituted. Token default values are separated by a pipe character and the word `default` (`| default`), and can be used to provide a "fallback value" for entities that are missing a specified token attribute.

- `{{.URL | default "https://sensu.io"}}` would be replaced with a [custom  attribute][3] called `url`. If no such attribute called `url` is included in the client definition, the default (or fallback) value of `https://sensu.io` will be used to substitute the token.

### Unmatched tokens

If a token is unmatched during check preparation, the agent check handler will return an error, and the check will not be executed. Unmatched token errors will look similar to the following:

{{< highlight shell >}}
error: unmatched token: template: :1:22: executing "" at <.System.Hostname>: map has no entry for key "System"
{{< /highlight >}}

Check config token errors will be logged by the agent, and sent to Sensu backend message transport as a check failure.

## Examples

### Token substitution for check thresholds 

In this example [check configuration][5], the `check-disk-usage.go` command accepts `-w` (warning) and `-c` (critical)
arguments to indicate the thresholds (as percentages) for creating warning or critical events. If no token substitutions are provided by a check configuration, it will use default values to create a warning event at 80% disk capacity (i.e. `{{ .Disk.Warning | default 80 }}`), and a critical event at 90% capacity (i.e. `{{ .Disk.Critical | default 90 }}`).

{{< highlight json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "check-disk-usage",
    "namespace": "{{ .Namespace | default \"production\" }}"
  },
  "spec": {
    "command": "check-disk-usage.rb -w {{.Disk.Warning | default 80}} -c {{.Disk.Critical | default 90}}",
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 10,
    "low_flap_threshold": 0,
    "publish": true,
    "runtime_assets": null,
    "subscriptions": [
    "staging"
    ],
    "proxy_entity_name": "",
    "check_hooks": null,
    "stdin": false,
    "ttl": 0,
    "timeout": 0,
    "round_robin": false,
    "env_vars": null,
  }
}{{< /highlight >}}

The following example [entity][4] would provide the necessary
attributes to override the `.Disk.Warning`, `.Disk.Critical`, and `.Namespace`
tokens declared above.

{{< highlight json >}}
{
  "type": "Entity",
  "api_version": "core/v2",
  "metadata": {
    "name": "example-hostname",
    "namespace": "staging"
  },
  "spec": {
    "entity_class": "agent",
    "system": {
      "hostname": "example-hostname",
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
      "entity:example-hostname",
      "staging"
    ],
    "last_seen": 1542667231,
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
    "disk": {
      "warning": 75,
      "critical": 85
    }
  }
}{{< /highlight >}}

[1]: https://golang.org/pkg/text/template/
[2]: ../../../latest/reference/checks/#check-token-substitution
[3]: ../entities/#entity-attributes
[4]: ../entities/
[5]: ../checks/
