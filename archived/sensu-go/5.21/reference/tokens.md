---
title: "Tokens"
reference_title: "Tokens"
type: "reference"
description: "Tokens are placeholders in a check definition that the agent replaces with entity information before executing the check. You can use tokens to fine-tune check attributes (like alert thresholds) on a per-entity level while reusing check definitions. Read the reference doc to learn about tokens."
weight: 180
version: "5.21"
product: "Sensu Go"
menu: 
  sensu-go-5.21:
    parent: reference
---

Tokens are placeholders in a check definition that the agent replaces with entity information before executing the check.
You can use tokens to fine-tune check attributes (like alert thresholds) on a per-entity level while reusing the check definition.

When a check is scheduled to be executed by an agent, it first goes through a token substitution step.
The agent replaces any tokens with matching attributes from the entity definition, and then the check is executed.
Invalid templates or unmatched tokens return an error, which is logged and sent to the Sensu backend message transport.
Checks with token-matching errors are not executed.

Token substitution is supported for [check][7], [hook][8], and [asset][12] definitions.
Only [entity attributes][4] are available for substitution.
Token substitution is not available for event filters because filters already have access to the entity.

Available attributes will always have [string values][9], such as labels and annotations.

## Example: Token substitution for check thresholds

In this example [hook][8] and [check configuration][5], the `check-disk-usage.go` command accepts `-w` (warning) and `-c` (critical) arguments to indicate the thresholds (as percentages) for creating warning or critical events.
If no token substitutions are provided by an entity configuration, Sensu will use default values to create a warning event at 80% disk capacity (that is, `{{ .labels.disk_warning | default 80 }}`) and a critical event at 90% capacity (that is, `{{ .labels.disk_critical | default 90 }}`).

Hook configuration:

{{< language-toggle >}}

{{< code yml >}}
type: HookConfig
api_version: core/v2
metadata:
  name: disk_usage_details
  namespace: default
spec:
  command: du -h --max-depth=1 -c {{index .labels "disk_usage_root" | default "/"}}  2>/dev/null
  runtime_assets: null
  stdin: false
  timeout: 60
{{< /code >}}

{{< code json >}}
{
  "type": "HookConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "disk_usage_details",
    "namespace": "default"
  },
  "spec": {
    "command": "du -h --max-depth=1 -c {{index .labels \"disk_usage_root\" | default \"/\"}}  2>/dev/null",
    "runtime_assets": null,
    "stdin": false,
    "timeout": 60
  }
}
{{< /code >}}

{{< /language-toggle >}}

Check configuration: 

{{< language-toggle >}}

{{< code yml >}}
type: CheckConfig
api_version: core/v2
metadata:
  name: check-disk-usage
  namespace: default
spec:
  check_hooks:
  - non-zero:
    - disk_usage_details
  command: check-disk-usage.rb -w {{index .labels "disk_warning" | default 80}} -c
    {{.labels.disk_critical | default 90}}
  env_vars: null
  handlers: []
  high_flap_threshold: 0
  interval: 10
  low_flap_threshold: 0
  output_metric_format: ""
  output_metric_handlers: null
  proxy_entity_name: ""
  publish: true
  round_robin: false
  runtime_assets: null
  stdin: false
  subdue: null
  subscriptions:
  - staging
  timeout: 0
  ttl: 0
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "check-disk-usage",
    "namespace": "default"
  },
  "spec": {
    "check_hooks": [
      {
        "non-zero": [
          "disk_usage_details"
        ]
      }
    ],
    "command": "check-disk-usage.rb -w {{index .labels \"disk_warning\" | default 80}} -c {{.labels.disk_critical | default 90}}",
    "env_vars": null,
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 10,
    "low_flap_threshold": 0,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "proxy_entity_name": "",
    "publish": true,
    "round_robin": false,
    "runtime_assets": null,
    "stdin": false,
    "subdue": null,
    "subscriptions": [
      "staging"
    ],
    "timeout": 0,
    "ttl": 0
  }
}
{{< /code >}}

{{< /language-toggle >}}

The following example [entity][4] provides the necessary attributes to override the `.labels.disk_warning` and `labels.disk_critical` tokens declared above:

{{< language-toggle >}}

{{< code yml >}}
type: Entity
api_version: core/v2
metadata:
  annotations: null
  labels:
    disk_critical: "90"
    disk_warning: "80"
  name: example-hostname
  namespace: default
spec:
  deregister: false
  deregistration: {}
  entity_class: agent
  last_seen: 1542667231
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
  - entity:example-hostname
  - staging
  system:
    arch: amd64
    hostname: example-hostname
    network:
      interfaces:
      - addresses:
        - 127.0.0.1/8
        - ::1/128
        name: lo
      - addresses:
        - 10.0.2.15/24
        - fe80::26a5:54ec:cf0d:9704/64
        mac: 08:00:27:11:ad:d2
        name: enp0s3
      - addresses:
        - 172.28.128.3/24
        - fe80::a00:27ff:febc:be60/64
        mac: 08:00:27:bc:be:60
        name: enp0s8
    os: linux
    platform: centos
    platform_family: rhel
    platform_version: 7.4.1708
    processes: null
  user: agent
{{< /code >}}

{{< code json >}}
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
      "processes": null,
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
}{{< /code >}}

{{< /language-toggle >}}

## Manage entity labels

You can use token substitution with any defined [entity attributes][4], including custom labels.
See the [entity reference][6] for information about managing entity labels for proxy entities and agent entities.

## Manage assets

You can use token substitution in the URLs of your your [asset][12] definitions.
Token substitution allows you to host your assets at different URLs (such as at different datacenters) without duplicating your assets, as shown in the following example:

{{< language-toggle >}}

{{< code yml >}}
type: Asset
api_version: core/v2
metadata:
  name: sensu-go-hello-world
  namespace: default
spec:
  builds:
  - sha512: 07665fda5b7c75e15e4322820aa7ddb791cc9338e38444e976e601bc7d7970592e806a7b88733690a238b7325437d31f85e98ae2fe47b008ca09c86530da9600
    url: "{{ .labels.asset_url }}/sensu-go-hello-world-0.0.1.tar.gz"
{{< /code >}}

{{< code json >}}
{
  "type": "Asset",
  "api_version": "core/v2",
  "metadata": {
    "name": "sensu-go-hello-world",
    "namespace": "default"
  },
  "spec": {
    "builds": [
      {
        "sha512": "07665fda5b7c75e15e4322820aa7ddb791cc9338e38444e976e601bc7d7970592e806a7b88733690a238b7325437d31f85e98ae2fe47b008ca09c86530da9600",
        "url": "{{ .labels.asset_url }}/sensu-go-hello-world-0.0.1.tar.gz"
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

With this asset definition, which includes the `.labels.asset_url` token substitution, checks and hooks can include the `sensu-go-hello-world` asset as a runtime asset and Sensu Go will use the token substitution for the agent's entity.
Handlers and mutators can also include the `sensu-go-hello-world` asset as a runtime asset, but Sensu Go will use the token subtitution for the backend's entity instead of the agent's entity.

You can also use token substitution to customize asset headers (for example, to include secure information for authentication).

{{% notice note %}}
**NOTE**: To maintain security, you cannot use token substitution for an asset's SHA512 value.
{{% /notice %}}

## Token specification

Sensu Go uses the [Go template][1] package to implement token substitution.
Use double curly braces around the token and a dot before the attribute to be substituted: `{{ .system.hostname }}`.

### Token substitution syntax

Tokens are invoked by wrapping references to entity attributes and labels with double curly braces, such as `{{ .name }}` to substitute an entity's name.
Access nested Sensu [entity attributes][3] dot notation (for example, `system.arch`).

- `{{ .name }}` would be replaced with the [entity `name` attribute][3]
- `{{ .labels.url }}` would be replaced with a custom label called `url`
- `{{ .labels.disk_warning }}` would be replaced with a custom label called `disk_warning`
- `{{ index .labels "disk_warning" }}` would be replaced with a custom label called
  `disk_warning`
- `{{ index .labels "cpu.threshold" }}` would be replaced with a custom label called `cpu.threshold`

{{% notice note %}}
**NOTE**: When an annotation or label name has a dot (for example, `cpu.threshold`), you must use the template index function syntax to ensure correct processing because the dot notation is also used for object nesting.
{{% /notice %}}

### Token substitution default values

If an attribute is not provided by the [entity][3], a token's default value will be substituted.
Token default values are separated by a pipe character and the word "default" (`| default`).
Use token default values to provide a fallback value for entities that are missing a specified token attribute.

For example, `{{.labels.url | default "https://sensu.io"}}` would be replaced with a custom label called `url`.
If no such attribute called `url` is included in the entity definition, the default (or fallback) value of `https://sensu.io` will be used to substitute the token.

### Token substitution with quoted strings

You can escape quotes to express quoted strings in token substitution templates as shown in the [Go template package examples][2].
For example, to provide `"substitution"` as a default value for entities that are missing the `website` attribute (including the quotation marks):

{{< code shell >}}
{{ .labels.website | default "\"substitution\"" }}
{{< /code >}}

## Unmatched tokens

If a token is unmatched during check preparation, the agent check handler will return an error, and the check will not be executed.
Unmatched token errors are similar to this example:

{{< code shell >}}
error: unmatched token: template: :1:22: executing "" at <.system.hostname>: map has no entry for key "System"
{{< /code >}}

Check config token errors are logged by the agent and sent to Sensu backend message transport as check failures.

## Token data type limitations

As part of the substitution process, Sensu converts all tokens to strings.
This means that token substitution cannot be applied to any non-string values like numbers or Booleans, although it can be applied to strings that are nested inside objects and arrays.

For example, token substitution **cannot** be used for specifying a check interval because the interval attribute requires an _integer_ value.
Token substitution **can** be used for alerting thresholds because those values are included within the command _string_.


[1]: https://pkg.go.dev/text/template
[2]: https://pkg.go.dev/text/template?tab=doc#hdr-Examples
[3]: ../entities/#entities-specification
[4]: ../entities/
[5]: ../checks/
[6]: ../entities#manage-entity-labels
[7]: ../checks/#check-commands
[8]: ../hooks/
[9]: #token-data-type-limitations
[10]: ../handlers/
[11]: ../mutators/
[12]: ../assets/
