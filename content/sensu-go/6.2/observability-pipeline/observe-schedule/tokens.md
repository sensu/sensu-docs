---
title: "Tokens reference"
linkTitle: "Tokens Reference"
reference_title: "Tokens"
type: "reference"
description: "Tokens are placeholders in a check definition that the agent replaces with entity information before executing the check. You can use tokens to fine-tune check attributes (like alert thresholds) on a per-entity level while reusing check definitions. Read the reference doc to learn about tokens."
weight: 80
version: "6.2"
product: "Sensu Go"
menu:
  sensu-go-6.2:
    parent: observe-schedule
---

Tokens are placeholders in a check definition that the agent replaces with entity information before executing the check.
You can use tokens to fine-tune check attributes (like alert thresholds) on a per-entity level while reusing the check definition.

When a check is scheduled to be executed by an agent, it first goes through a token substitution step.
The agent replaces any tokens with matching attributes from the entity definition, and then the check is executed.
Invalid templates or unmatched tokens return an error, which is logged and sent to the Sensu backend message transport.
Checks with token-matching errors are not executed.

Token substitution is supported for [check][7], [hook][8], and [dynamic runtime asset][12] definitions.
Only [entity attributes][4] are available for substitution.
Token substitution is not available for event filters because filters already have access to the entity.

Available attributes will always have [string values][9], such as labels and annotations.

## Example: Token substitution for check thresholds 

You can use tokens in [check commands][5] to indicate the thresholds (as percentages) for creating warning or critical events, with default threshold values to use for entities that do not include labels for token substitution.
Follow this example to set up a reusable check for disk usage. 

First, add the [Sensu disk usage check][13] dynamic runtime asset, which includes the command you will need for your check:
{{< code shell >}}
sensuctl asset add sensu/check-disk-usage:0.4.1
{{< /code >}}

You will see a response to confirm that the asset was added:
{{< code shell >}}
fetching bonsai asset: sensu/check-disk-usage:0.4.1
added asset: sensu/check-disk-usage:0.4.1

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["sensu/check-disk-usage].
{{< /code >}}

Next, create the `check-disk-usage` check:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: CheckConfig
api_version: core/v2
metadata:
  name: check-disk-usage
  namespace: default
spec:
  check_hooks: []
  command: check-disk-usage -w {{index .labels.disk_warning | default 80}} -c
    {{.labels.disk_critical | default 90}}
  env_vars: null
  handlers: []
  high_flap_threshold: 0
  interval: 10
  low_flap_threshold: 0
  output_metric_format: ""
  output_metric_handlers: null
  output_metric_tags: null
  proxy_entity_name: ""
  publish: true
  round_robin: false
  runtime_assets:
  - sensu/check-disk-usage
  stdin: false
  subdue: null
  subscriptions:
  - system
  timeout: 0
  ttl: 0
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "check-disk-usage",
    "namespace": "default"
  },
  "spec": {
    "check_hooks": [],
    "command": "check-disk-usage -w {{index .labels.disk_warning | default 80}} -c {{.labels.disk_critical | default 90}}",
    "env_vars": null,
    "handlers": [],
    "high_flap_threshold": 0,
    "interval": 10,
    "low_flap_threshold": 0,
    "output_metric_format": "",
    "output_metric_handlers": null,
    "output_metric_tags": null,
    "proxy_entity_name": "",
    "publish": true,
    "round_robin": false,
    "runtime_assets": [
      "sensu/check-disk-usage"
    ],
    "stdin": false,
    "subdue": null,
    "subscriptions": [
      "system"
    ],
    "timeout": 0,
    "ttl": 0
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

This check will run on every entity with the subscription `system`.
According to the default values in the command, the check will generate a warning event at 80% disk usage and a critical event at 90% disk usage.

Because the check command is written to permit token subsitution, you can also use this check for entities that should generate warning or critical events at different thresholds.
Instead of creating a different check for every set of thresholds, you can specify different thresholds in the entities themselves.

For example, suppose you want to receive alerts at lower thresholds for an existing `webserver` entity: a warning event at 65% and a critical event at 75%.

Use sensuctl to open the `webserver` entity in a text editor:

{{< code shell >}}
sensuctl edit entity webserver
{{< /code >}}

And add the following labels in the entity metadata:

{{< code yml >}}
  labels:
    disk_warning: "65"
    disk_critical: "75"
{{< /code >}}

After you save these changes, the `check-disk-usage` check will substitute the `disk_warning` and `disk_critical` label values to generate events at 65% and 75% of disk usage, respectively, instead of the 80% and 90% default values.


**TODO: add the [hook][8] configuration example**

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

## Manage entity labels

You can use token substitution with any defined [entity attributes][4], including custom labels.
See the [entity reference][6] for information about managing entity labels for proxy entities and agent entities.

## Manage dynamic runtime assets

You can use token substitution in the URLs of your your [dynamic runtime asset][12] definitions.
Token substitution allows you to host your dynamic runtime assets at different URLs (such as at different datacenters) without duplicating your assets, as shown in the following example:

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

With this asset definition, which includes the `.labels.asset_url` token substitution, checks and hooks can include `sensu-go-hello-world` as a dynamic runtime assets and Sensu Go will use the token substitution for the agent's entity.
Handlers and mutators can also include `sensu-go-hello-world` as a dynamic runtime asset, but Sensu Go will use the token subtitution for the backend's entity instead of the agent's entity.

You can also use token substitution to customize dynamic runtime asset headers (for example, to include secure information for authentication).

{{% notice note %}}
**NOTE**: To maintain security, you cannot use token substitution for a dynamic runtime asset's SHA512 value.
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
**NOTE**: When an annotation or label name has a dot (e.g. `cpu.threshold`), you must use the template index function syntax to ensure correct processing because the dot notation is also used for object nesting.
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
[3]: ../../observe-entities/entities/#entities-specification
[4]: ../../observe-entities/entities/
[5]: ../checks/#check-commands
[6]: ../../observe-entities/entities#manage-entity-labels
[7]: ../checks/#check-commands
[8]: ../hooks/
[9]: #token-data-type-limitations
[10]: ../../observe-process/handlers/
[11]: ../../observe-transform/mutators/
[12]: ../../../plugins/assets/
[13]: https://bonsai.sensu.io/assets/sensu/check-disk-usage
