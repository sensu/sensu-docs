---
title: "Build filtered views in the web UI"
linkTitle: "Build Filtered Views"
description: "The Sensu web UI supports filtering on the Events, Entities, Checks, Handlers, Filters, Mutators, and Silences pages. Learn more about filtering in the Sensu web UI."
weight: 30
version: "5.18"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.18:
    parent: web-ui
---

The Sensu web UI includes basic filters you can use to build customized views of your Sensu resources.
Sensu also supports advanced web UI filtering based on a wider range of resource attributes and custom labels as a [commercial feature][1].

When you apply a filter to a web UI page, it creates a unique link for the filtered page.
You can bookmark these links and share your favorite filter combinations.

## Basic filters

Sensu includes these basic filters:

- **Events page**: filter by entity, check, status, and silenced/unsilenced.
- **Entities page**: filter by entity class and subscription.
- **Checks page**: filter by subscription and published/unpublished.
- **Handlers page**: filter by handler type.
- **Filters page**: filter by action.
- **Silences page**: filter by check and subscription.

You can also sort events and silences using the **SORT** dropdown menu:

- **Events page**: sort by last OK, severity, newest, and oldest.
- **Silences page**: sort by start date.

## Advanced filters

**COMMERCIAL FEATURE**: Access advanced filtering in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][1].

Sensu supports advanced web UI filtering using a wider range of attributes, including custom labels.
You can use the same methods, selectors, and examples for web UI filtering as for [API response filtering][3], with some [syntax differences][4].

## Create web UI filters

If you are using the [basic web UI filters][5], you can create your filter just by clicking in the filter bar at the top of the web UI page:

1. In the web UI, open the page of resources you want to filter.
2. Click in the filter bar at the top of the web UI page.
3. Select the attribute you want to filter for from the dropdown list of options.
4. Click in the filter bar again and select the filter to apply.
5. Press **Return/Enter**.

{{% notice note %}}
**NOTE**: You do not need to specify a resource type in web UI filtering because you must navigate to the resource page *before* you construct the filter.
{{% /notice %}}

To filter resources based on [label selectors][6] or [field selectors][2], you'll write a brief filter statement.
The standard web UI filtering syntax is:

{{< code text >}}
SELECTOR:FILTER_STATEMENT
{{< /code >}}

To write a web UI filter command:

- Replace `SELECTOR` with the selector you want to use: `labelSelector` or `fieldSelector`.
- Replace `FILTER_STATEMENT` with the filter to apply.

For example, this filter will return all events for entities with the `linux` subscription:

{{< code text >}}
fieldSelector:linux in event.entity.subscriptions
{{< /code >}}

Web UI filtering statements will also work with a single space after the colon:

{{< code text >}}
fieldSelector: linux in event.entity.subscriptions
{{< /code >}}

## Operators quick reference

Web UI filtering supports two equality-based operators, two set-based operators, and one logical operator.

| operator  | description        | example                |
| --------- | ------------------ | ---------------------- |
| `==`      | Equality           | `check.publish == true`
| `!=`      | Inequality         | `check.namespace != "default"`
| `in`      | Included in        | `linux in check.subscriptions`
| `notin`   | Not included in    | `slack notin check.handlers`
| `matches` | Substring matching | `check.name matches "linux-"`

For details about operators, see [API response filtering operators][7].

## Examples

### Filter with label selectors

To filter resources using custom labels (in this example, to display only resources with the `type` label set to `server`:

{{< code text >}}
labelSelector:type == server
{{< /code >}}

### Filter with field selectors

To filter resources using specific [resource attributes][2] (in this example, to display only events at `2` (CRITICAL) status):

{{< code text >}}
fieldSelector:event.check.status == "2"
{{< /code >}}

On the **Events page**, to display only events for checks with the subscription `webserver`:

{{< code text >}}
fieldSelector:webserver in event.check.subscriptions
{{< /code >}}

On the **Checks page**, to display only checks that use the `slack` handler:

{{< code text >}}
fieldSelector:slack in check.handlers
{{< /code >}}

#### Values with special characters

To use a label or field selector with string values that include special characters like hyphens and underscores, place the value in single or double quotes:

{{< code text >}}
labelSelector:region == "us-west-1"
{{< /code >}}

### Use the logical AND operator

To use the logical AND operator (`&&`) to return checks that include a `linux` subscription and the `slack` handler:

{{< code text >}}
fieldSelector:linux in check.subscriptions && slack in check.handlers
{{< /code >}}

### Combine label and field selectors

To combine `labelSelector` and `fieldSelector` filters, create the filters separately.

For example, to return resources with the `region` label set to `us-west-1` that also use the `slack` handler:

1. Create the `labelSelector` filter in the filter bar and press **Return/Enter**.
2. Add the `fieldSelector` filter in the filter bar after the `labelSelector` filter and press **Return/Enter** again.	

{{< code text >}}
fieldSelector:slack in check.handlers
{{< /code >}}


[1]: ../../commercial/
[2]: ../../api/#field-selector
[3]: ../../api/#response-filtering
[4]: #create-web-ui-filters
[5]: #basic-filters
[6]: ../../api/#label-selector
[7]: ../../api/#operators
