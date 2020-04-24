---
title: "Filter responses with sensuctl"
linkTitle: "Filter Responses with sensuctl"
description: "Sensuctl is a command line tool for managing resources within Sensu. It works by calling Sensu’s underlying API to create, read, update, and delete resources, events, and entities. Read this reference doc to learn about sensuctl."
weight: 40
version: "5.19"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.19:
    parent: sensuctl-access
---


**COMMERCIAL FEATURE**: Access sensuctl response filters in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][30].

Sensuctl supports response filtering for all [commands using the `list` verb][23].
For information about response filtering methods and available label and field selectors, see [API response filtering][28].

## Sensuctl-specific syntax

You can use the same methods, selectors, and examples for sensuctl response filtering as for [API response filtering][28], except you'll format your requests with the `--label-selector` and `--field-selector` flags instead of cURL.

The standard sensuctl response filtering syntax is:

{{< highlight shell >}}
sensuctl RESOURCE_TYPE list --SELECTOR 'FILTER_STATEMENT'
{{< /highlight >}}

To create a sensuctl response filtering command:

- Replace `RESOURCE_TYPE` with the resource your filter is based on.
- Replace `SELECTOR` with either `label-selector` or `field-selector`, depending on which selector you want to use.
- Replace `FILTER_STATEMENT` with the filter to apply.

For example:

{{< highlight shell >}}
sensuctl event list --field-selector 'linux notin event.entity.subscriptions'
{{< /highlight >}}

Sensuctl response filtering commands will also work with a single equals sign between the selector flag and the filter statement:

{{< highlight shell >}}
sensuctl event list --field-selector='linux notin event.entity.subscriptions'
{{< /highlight >}}

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

For details about operators, see [API response filtering operators][47].

## Filter responses with label selectors

Use the `--label-selector` flag to filter responses using custom labels.

For example, to return entities with the `proxy_type` label set to `switch`:

{{< highlight shell >}}
sensuctl entity list --label-selector 'proxy_type == switch'
{{< /highlight >}}

## Filter responses with field selectors

Use the `--field-selector` flag to filter responses using specific [resource attributes][29].

For example, to return entities with the `switches` subscription:

{{< highlight shell >}}
sensuctl entity list --field-selector 'switches in entity.subscriptions'
{{< /highlight >}}

To retrieve all events that equal a status of `2` (CRITICAL):

{{< highlight shell >}}
sensuctl event list --field-selector 'event.check.status == "2"'
{{< /highlight >}}

To retrieve all entities whose name includes the substring `webserver`:

{{< highlight shell >}}
sensuctl entity list --fieldSelector 'entity.name matches "webserver"'
{{< /highlight >}}

## Use the logical AND operator

To use the logical AND operator (`&&`) to return checks that include a `linux` subscription in the `dev` namespace:

{{< highlight shell >}}
sensuctl check list --field-selector 'linux in check.subscriptions && dev in check.namespace'
{{< /highlight >}}

## Combine label and field selectors

You can combine the `--label-selector` and `--field-selector` flags in a single command.

For example, this command returns checks with the `region` label set to `us-west-1` that also use the `slack` handler:

{{< highlight shell >}}
sensuctl check list --label-selector 'region == "us-west-1"' --field-selector 'slack in check.handlers'
{{< /highlight >}}



[1]: ../../reference/rbac/
[2]: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
[3]: #sensuctl-create-resource-types
[4]: ../../installation/install-sensu/#install-sensuctl
[5]: ../../reference/agent/#general-configuration-flags
[6]: ../../reference/
[7]: ../../guides/clustering/
[8]: #create-resources
[9]: #sensu-backend-url
[10]: #preferred-output-format
[11]: #username-password-and-namespace
[12]: ../../reference/assets/
[13]: ../../reference/checks/
[14]: ../../reference/entities/
[15]: ../../reference/events/
[16]: ../../reference/filters/
[17]: ../../reference/handlers/
[18]: ../../reference/hooks/
[19]: ../../reference/mutators/
[20]: ../../reference/silencing/
[21]: ../../reference/rbac#namespaces
[22]: ../../reference/rbac#users
[23]: #subcommands
[24]: #sensuctl-edit-resource-types
[25]: ../../api/overview/
[26]: ../../installation/auth/#ldap-authentication
[27]: ../../reference/tessen/
[28]: ../../api/overview#response-filtering
[29]: ../../api/overview#field-selector
[30]: ../../getting-started/enterprise/
[31]: #manage-sensuctl
[32]: ../../reference/datastore/
[33]: #create-resources-across-namespaces
[34]: https://bonsai.sensu.io/
[35]: ../../reference/etcdreplicators/
[36]: /images/sensu-influxdb-handler-namespace.png
[37]: https://bonsai.sensu.io/assets/portertech/sensu-ec2-discovery
[39]: #wrapped-json-format
[40]: ../../installation/install-sensu/#install-the-sensu-backend
[41]: ../../reference/secrets/
[42]: ../../installation/auth/#ad-authentication
[43]: ../../reference/secrets-providers/
[44]: ../../installation/auth#use-built-in-basic-authentication
[45]: ../../installation/install-sensu/#2-configure-and-start
[46]: #first-time-setup
[47]: ../../api/overview/#operators
[48]: #sensuctl-prune-resource-types
