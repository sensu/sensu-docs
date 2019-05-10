---
title: "Tokens"
description: "Tokens are placeholders included in a check definition that the agent replaces with entity information before executing the check. You can use tokens to fine-tune check attributes (like alert thresholds) on a per-entity level while re-using check definitions. Read the reference doc to learn about tokens."
weight: 10
version: "5.3"
product: "Sensu Go"
menu: 
  sensu-go-5.3:
    parent: reference
---

- [Specification](#sensu-token-specification)
- [Examples](#examples)

Tokens are placeholders included in a check definition that the agent replaces with entity information before executing the check.
You can use tokens to fine-tune check attributes (like alert thresholds) on a per-entity level while re-using the check definition.

## How do tokens work?

When a check is scheduled to be executed by an agent, it first goes through a token substitution step. The agent replaces any tokens with matching attributes from the entity definition, and then the check is executed. Invalid templates or unmatched tokens will return an error, which is logged and sent to the Sensu backend message transport. Checks with token matching errors will not be executed.

## Managing entity labels

You can use token substitution with any defined [entity attributes][4], including custom labels.
See the [entity reference][6] for information on managing entity labels for proxy entities and agent entities.

## Sensu token specification

Sensu Go uses the [Go template][1] package to implement token substitution.
Sensu Go token substitution uses double curly braces around the token, and a dot before the attribute to be substituted, such as: `{{ .system.hostname }}`.

### Token substitution syntax

Tokens are invoked by wrapping references to entity attributes and labels with double curly braces, such as `{{ .name }}` to substitute an entity's name. Nested Sensu [entity attributes][3] can be accessed via dot notation (ex: `system.arch`).

- `{{ .name }}` would be replaced with the [entity `name` attribute][3]
- `{{ .labels.url }}` would be replaced with a custom label called `url`
- `{{ .labels.disk_warning }}` would be replaced with a custom label called
  `disk_warning`

### Token substitution default values

In the event that an attribute is not provided by the [entity][3], a token's default
value will be substituted. Token default values are separated by a pipe character and the word `default` (`| default`), and can be used to provide a "fallback value" for entities that are missing a specified token attribute.

- `{{.labels.url | default "https://sensu.io"}}` would be replaced with a custom label called `url`. If no such attribute called `url` is included in the entity definition, the default (or fallback) value of `https://sensu.io` will be used to substitute the token.

### Unmatched tokens

If a token is unmatched during check preparation, the agent check handler will return an error, and the check will not be executed. Unmatched token errors will look similar to the following:

{{< highlight shell >}}
error: unmatched token: template: :1:22: executing "" at <.system.hostname>: map has no entry for key "System"
{{< /highlight >}}

Check config token errors will be logged by the agent, and sent to Sensu backend message transport as a check failure.

## Examples

### Token substitution for check thresholds 

In this example [check configuration][5], the `check-disk-usage.go` command accepts `-w` (warning) and `-c` (critical)
arguments to indicate the thresholds (as percentages) for creating warning or critical events. If no token substitutions are provided by an entity configuration, Sensu will use default values to create a warning event at 80% disk capacity (i.e. `{{ .labels.disk_warning | default 80 }}`), and a critical event at 90% capacity (i.e. `{{ .labels.disk_critical | default 90 }}`).

{{< highlight json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v1",
  "metadata": {
    "name": "check-disk-usage",
    "namespace": "default",
    "labels": null,
    "annotations": null
  },
  "spec": {
    "command": "check-disk-usage.rb -w {{.labels.disk_warning | default 80}} -c {{.labels.disk_critical | default 90}}",
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
    "env_vars": null
  }
}{{< /highlight >}}

The following example [entity][4] would provide the necessary
attributes to override the `.labels.disk_warning` and `labels.disk_critical`
tokens declared above.

{{< highlight json >}}
{
  "type": "Entity",
  "api_version": "core/v2",
  "metadata": {
    "name": "example-hostname",
    "namespace": "default",
    "labels": {
      "disk_warning": "80",
      "disk_critical": "90"
    },
    "annotations": null
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
    ]
  }
}{{< /highlight >}}

[1]: https://golang.org/pkg/text/template/
[2]: ../../../latest/reference/checks/#check-token-substitution
[3]: ../entities/#entity-attributes
[4]: ../entities/
[5]: ../checks/
[6]: ../entities#managing-entity-labels
