---
title: "Filter responses with sensuctl"
linkTitle: "Filter Responses"
description: "Sensuctl supports response filtering for all commands using the list verb. Read this reference doc to learn about filtering responses with sensuctl."
weight: 30
version: "6.1"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-6.1:
    parent: sensuctl
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access sensuctl response filtering in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

Sensuctl supports response filtering for all [commands using the `list` verb][1].
For information about response filtering methods and available label and field selectors, read [API response filtering][2].

## Sensuctl-specific syntax

You can use the same methods, selectors, and examples for sensuctl response filtering as for [API response filtering][2], except you'll format your requests with the `--label-selector` and `--field-selector` flags instead of cURL.

The standard sensuctl response filtering syntax is:

{{< code shell >}}
sensuctl <resource_type> list --<selector> '<filter_statement>'
{{< /code >}}

To create a sensuctl response filtering command:

- Replace `<resource_type>` with the resource your filter is based on.
- Replace `<selector>` with either `label-selector` or `field-selector`, depending on which selector you want to use.
- Replace `<filter_statement>` with the filter to apply.

For example:

{{< code shell >}}
sensuctl event list --field-selector 'linux notin event.entity.subscriptions'
{{< /code >}}

Sensuctl response filtering commands will also work with a single equals sign between the selector flag and the filter statement:

{{< code shell >}}
sensuctl event list --field-selector='linux notin event.entity.subscriptions'
{{< /code >}}

The [examples][6] demonstrate how to construct sensuctl filter statements for different selectors and operators.

## Operators quick reference

Sensuctl response filtering supports two equality-based operators, two set-based operators, one substring matching operator, and one logical operator.

| operator  | description        | example                |
| --------- | ------------------ | ---------------------- |
| `==`      | Equality           | `check.publish == true`
| `!=`      | Inequality         | `check.namespace != "default"`
| `in`      | Included in        | `linux in check.subscriptions`
| `notin`   | Not included in    | `slack notin check.handlers`
| `matches` | Substring matching | `check.name matches "linux-"`
| `&&`      | Logical AND        | `check.publish == true && slack in check.handlers`

For details about operators, read about the [API response filtering operators][5].

## Examples

### Filter responses with label selectors

Use the `--label-selector` flag to filter responses using custom labels.

For example, to return entities with the `proxy_type` label set to `switch`:

{{< code shell >}}
sensuctl entity list --label-selector 'proxy_type == switch'
{{< /code >}}

### Filter responses with field selectors

Use the `--field-selector` flag to filter responses using specific [resource attributes][3].

For example, to return entities with the `switches` subscription:

{{< code shell >}}
sensuctl entity list --field-selector 'switches in entity.subscriptions'
{{< /code >}}

To retrieve all events that equal a status of `2` (CRITICAL):

{{< code shell >}}
sensuctl event list --field-selector 'event.check.status == "2"'
{{< /code >}}

To retrieve all entities whose name includes the substring `webserver`:

{{< code shell >}}
sensuctl entity list --field-selector 'entity.name matches "webserver"'
{{< /code >}}

### Use the logical AND operator

To use the logical AND operator (`&&`) to return checks that include a `linux` subscription in the `dev` namespace:

{{< code shell >}}
sensuctl check list --field-selector 'linux in check.subscriptions && dev in check.namespace'
{{< /code >}}

### Combine label and field selectors

You can combine the `--label-selector` and `--field-selector` flags in a single command.

For example, this command returns checks with the `region` label set to `us-west-1` that also use the `slack` handler:

{{< code shell >}}
sensuctl check list --label-selector 'region == "us-west-1"' --field-selector 'slack in check.handlers'
{{< /code >}}


[1]: ../create-manage-resources/#subcommands
[2]: ../../api#response-filtering
[3]: ../../api#field-selector
[5]: ../../api/#operators
[6]: #examples
