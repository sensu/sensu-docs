---
title: "Build filtered views in the web UI"
linkTitle: "Build Filtered Views"
description: "The Sensu web UI supports filtering on the Events, Entities, Checks, Handlers, Filters, Mutators, and Silences pages. Learn more about filtering in the Sensu web UI."
weight: 30
version: "6.0"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.0:
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

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access advanced web UI filtering in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features](../../commercial/).
{{% /notice %}}

Sensu supports advanced web UI filtering using a wider range of attributes, including custom labels.
You can use the same methods, selectors, and examples for web UI filtering as for [API response filtering][3], with some [syntax differences][4].

## Create basic web UI filters

If you are using the [basic web UI filters][5], you can create your filter just by clicking in the filter bar at the top of the web UI page:

1. In the web UI, open the page of resources you want to filter.
2. Click in the filter bar at the top of the web UI page.
3. Select the attribute you want to filter for from the dropdown list of options.
4. Click in the filter bar again and select the filter to apply.
5. Press **Return/Enter**.

{{% notice note %}}
**NOTE**: You do not need to specify a resource type in web UI filtering because you must navigate to the resource page *before* you construct the filter.
{{% /notice %}}

## Create web UI filters based on label selectors or field selectors

To filter resources based on [label selectors][6] or [field selectors][2], you'll write a brief filter statement.
The filter statement construction is slightly different for different [operators][9], but the standard web UI filtering syntax is:

{{< code text >}}
<selector>:<filter_statement>
{{< /code >}}

To write a web UI filter command:

- Replace `<selector>` with the selector you want to use: `labelSelector` or `fieldSelector`.
- Replace `<filter_statement>` with the filter to apply.

The [examples][10] demonstrate how to construct web UI filter statements for different operators and specific purposes.

## Web UI-specific syntax

### Space after the colon

Web UI filtering statements will work with no space or a single space after the colon.
For example, this filter will return all events for entities with the `linux` subscription:

{{< code text >}}
fieldSelector:linux in event.entity.subscriptions
{{< /code >}}

And this filter will work the same way:

{{< code text >}}
fieldSelector: linux in event.entity.subscriptions
{{< /code >}}

### Values that begin with a number or include special characters

If you are filtering for a value that begins with a number, place the value in single or double quotes:

{{< code text >}}
fieldSelector:entity.name == '1b04994n'
fieldSelector:entity.name == "1b04994n"
{{< /code >}}

Likewise, to use a label or field selector with string values that include special characters like hyphens and underscores, place the value in single or double quotes:

{{< code text >}}
labelSelector:region == 'us-west-1'
labelSelector:region == "us-west-1"
{{< /code >}}

## Operators quick reference

Web UI filtering supports two equality-based operators, two set-based operators, one substring matching operator, and one logical operator.

| operator  | description        | example                |
| --------- | ------------------ | ---------------------- |
| `==`      | Equality           | `check.publish == true`
| `!=`      | Inequality         | `check.namespace != "default"`
| `in`      | Included in        | `linux in check.subscriptions`
| `notin`   | Not included in    | `slack notin check.handlers`
| `matches` | Substring matching | `check.name matches "linux-"`
| `&&`      | Logical AND        | `check.publish == true && slack in check.handlers`

For details about operators, see [API response filtering operators][7].

## Examples

### Filter with label selectors

To filter resources using custom labels (in this example, to display only resources with the `type` label set to `server`:

{{< code text >}}
labelSelector:type == server
{{< /code >}}

To filter for entities that are labeled for any region in the US (for example, `us-east-1`, `us-west-1`, and so on):

{{< code shell >}}
labelSelector:region matches "us"
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

### Use the logical AND operator

To use the logical AND operator (`&&`) to return checks that include a `linux` subscription and the `slack` handler:

{{< code text >}}
fieldSelector:linux in check.subscriptions && slack in check.handlers
{{< /code >}}

### Combine label and field selectors

To combine `labelSelector` and `fieldSelector` filters, create the filters separately.

For example, to return resources with the `region` label set to `us-west-1` that also use the `slack` handler:

1. Create the `labelSelector` filter in the filter bar and press **Return/Enter**.
     {{< code text >}}
labelSelector:region == "us-west-1"
{{< /code >}}

2. Add the `fieldSelector` filter in the filter bar after the `labelSelector` filter and press **Return/Enter** again.

     {{< code text >}}
fieldSelector:slack in check.handlers
{{< /code >}}

## Save a filtered search

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access saved filtered searches in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features](../../commercial/).
{{% /notice %}}

To save a filtered search:

1. [Create a web UI filter][4].
2. Click the save icon at the right side of the filter bar: ![save icon](/images/save_icon.png)
3. Click **Save this search**.
4. Type the name you want to use for the saved search.
5. Press **Return/Enter**.

Sensu saves your filtered searches to etcd in a [namespaced resource][11] named `searches`.
To recall a saved filtered search, a Sensu user must be assigned to a [role][12] that includes permissions for both the `searches` resource and the namespace where you save the search.

The role-based access control (RBAC) reference includes [example workflows][13] that demonstrate how to configure a user's roles and role bindings to include full permissions for namespaced resources, including saved searches.

### Recall a saved filtered search

To recall a saved search, click the save icon in the filter bar and select the name of the search you want to recall.

You can combine an existing saved search with a new filter to create a new saved search.
To do this, recall a saved search, add the new filter in the filter bar, and [save the combination as a new saved search][8].

### Delete a saved filtered search

To delete a saved search:

1. Click the save icon in the filter bar: ![save icon](/images/save_icon.png)
2. Click the delete icon next to the search you want to delete: ![delete icon](/images/delete_icon.png)


[1]: ../../commercial/
[2]: ../../api/#field-selector
[3]: ../../api/#response-filtering
[4]: #web-ui-specific-syntax
[5]: #basic-filters
[6]: ../../api/#label-selector
[7]: ../../api/#operators
[8]: #save-a-filtered-search
[9]: #operators-quick-reference
[10]: #examples
[11]: ../../operations/control-access/rbac/#namespaced-resource-types
[12]: ../../operations/control-access/rbac/#roles-and-cluster-roles
[13]: ../../operations/control-access/rbac/#create-a-role-and-role-binding
