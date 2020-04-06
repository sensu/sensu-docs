---
title: "Web UI filtering"
linkTitle: "Web UI Filtering"
description: "The Sensu dashboard supports filtering on the Events, Entities, Checks, Handlers, Filters, Mutators, and Silences pages. Learn more about filtering in the Sensu dashboard."
weight: 20
version: "5.19"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.19:
    parent: web-ui-cli-access
---

- [Basic filters](#basic-filters)
- [Advanced filters](#advanced-filters)
- [Create dashboard filters](#create-dashboard-filters)
- [Operators quick reference](#operators-quick-reference)
- [Examples](#examples)
- [Save a filtered search](#save-a-filtered-search)

The Sensu dashboard includes basic filters you can use to build customized views of your Sensu resources.
Sensu also supports advanced dashboard filtering based on a wider range of resource attributes and custom labels as a [commercial feature][1].

When you apply a filter to a dashboard page, it creates a unique link for the filtered page.
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

Sensu supports advanced dashboard filtering using a wider range of attributes, including custom labels.
You can use the same methods, selectors, and examples for dashboard filtering as for [API response filtering][3], with some [syntax differences][4].

## Create dashboard filters

If you are using the [basic dashboard filters][5], you can create your filter just by clicking in the filter bar at the top of the dashboard page:

1. In the dashboard, open the page of resources you want to filter.
2. Click in the filter bar at the top of the dashboard page.
3. Select the attribute you want to filter for from the dropdown list of options.
4. Click in the filter bar again and select the filter to apply.
5. Press **Return/Enter**.

{{% notice note %}}
**NOTE**: You do not need to specify a resource type in dashboard filtering because you must navigate to the resource page *before* you construct the filter.
{{% /notice %}}

To filter resources based on [label selectors][6] or [field selectors][2], you'll write a brief filter statement.
The standard dashboard filtering syntax is:

{{< highlight text >}}
SELECTOR:FILTER_STATEMENT
{{< /highlight >}}

To write a dashboard filter command:

- Replace `SELECTOR` with the selector you want to use: `labelSelector` or `fieldSelector`.
- Replace `FILTER_STATEMENT` with the filter to apply.

For example, this filter will return all events for entities with the `linux` subscription:

{{< highlight text >}}
fieldSelector:linux in event.entity.subscriptions
{{< /highlight >}}

Dashboard filtering statements will also work with a single space after the colon:

{{< highlight text >}}
fieldSelector: linux in event.entity.subscriptions
{{< /highlight >}}

## Operators quick reference

Dashboard filtering supports two equality-based operators, two set-based operators, one substring matching operator, and one logical operator.

| operator  | description        | example                |
| --------- | ------------------ | ---------------------- |
| `==`      | Equality           | `check.publish == true`
| `!=`      | Inequality         | `check.namespace != "default"`
| `in`      | Included in        | `linux in check.subscriptions`
| `notin`   | Not included in.   | `slack notin check.handlers`
| `matches` | Substring matching | `check.name matches "linux-"`
| `&&`      | Logical AND        | `check.publish == true && slack in check.handlers`

For details about operators, see [API response filtering operators][7].

## Examples

### Filter with label selectors

To filter resources using custom labels (in this example, to display only resources with the `type` label set to `server`:

{{< highlight text >}}
labelSelector:type == server
{{< /highlight >}}

To filter for entities that are labeled for any region in the US (e.g. `us-east-1`, `us-west-1`, and so on):

{{< highlight shell >}}
labelSelector:region matches "us"
{{< /highlight >}}

### Filter with field selectors

To filter resources using specific [resource attributes][2] (in this example, to display only events at `2` (CRITICAL) status):

{{< highlight text >}}
fieldSelector:event.check.status == "2"
{{< /highlight >}}

On the **Events page**, to display only events for checks with the subscription `webserver`:

{{< highlight text >}}
fieldSelector:webserver in event.check.subscriptions
{{< /highlight >}}

On the **Checks page**, to display only checks that use the `slack` handler:

{{< highlight text >}}
fieldSelector:slack in check.handlers
{{< /highlight >}}

#### Values with special characters

To use a label or field selector with string values that include special characters like hyphens and underscores, place the value in single or double quotes:

{{< highlight text >}}
labelSelector:region == "us-west-1"
{{< /highlight >}}

### Use the logical AND operator

To use the logical AND operator (`&&`) to return checks that include a `linux` subscription and the `slack` handler:

{{< highlight text >}}
fieldSelector:linux in check.subscriptions && slack in check.handlers
{{< /highlight >}}

### Combine label and field selectors

To combine `labelSelector` and `fieldSelector` filters, create the filters separately.

For example, to return resources with the `region` label set to `us-west-1` that also use the `slack` handler:

1. Create the `labelSelector` filter in the filter bar and press **Return/Enter**.
2. Add the `fieldSelector` filter in the filter bar after the `labelSelector` filter and press **Return/Enter** again.

{{< highlight text >}}
labelSelector:region == "us-west-1"

fieldSelector:slack in check.handlers
{{< /highlight >}}

## Save a filtered search

**COMMERCIAL FEATURE**: Access saved filtered searches in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][1].

To save a filtered search:

1. [Create a dashboard filter][4].
2. Click the save icon at the right side of the filter bar: ![save icon](/images/save_icon.png)
3. Click **Save this search**.
4. Type the name you want to use for the saved search.
5. Press **Return/Enter**.

Any Sensu user with access to the namespace where you save the search will be able to recall it at any time.

Sensu saves your filtered searches to etcd in a resource named `searches`.

### Recall a saved filtered search

To recall a saved search, click the save icon in the filter bar and select the name of the search you want to recall.

You can combine an existing saved search with a new filter to create a new saved search.
To do this, recall a saved search, add the new filter in the filter bar, and [save the combination as a new saved search][8].

### Delete a saved filtered search

To delete a saved search:

1. Click the save icon in the filter bar: ![save icon](/images/save_icon.png)
2. Click the delete icon next to the search you want to delete: ![delete icon](/images/delete_icon.png)


[1]: ../../getting-started/enterprise/
[2]: ../../api/overview/#field-selector
[3]: ../../api/overview/#response-filtering
[4]: #create-dashboard-filters
[5]: #basic-filters
[6]: ../../api/overview/#label-selector
[7]: ../../api/overview/#operators
[8]: #save-a-filtered-search
