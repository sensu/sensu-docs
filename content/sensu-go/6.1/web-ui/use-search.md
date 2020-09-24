---
title: "Search in the web UI"
linkTitle: "Search in the Web UI"
description: "The Sensu web UI supports searching the Events, Entities, Checks, Handlers, Filters, Mutators, and Silences pages. Learn more about searches in the Sensu web UI."
weight: 30
version: "6.1"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.1:
    parent: web-ui
---

The Sensu web UI includes basic search functions you can use to build customized views of your Sensu resources.
Sensu also supports advanced web UI searches based on a wider range of resource attributes and custom labels as a [commercial feature][1].

When you apply a search to a web UI page, it creates a unique link for the page of search results.
You can bookmark these links and share your favorite search combinations.

## Basic search functions

Sensu includes these basic search functions:

- **Events page**: search by entity, check, status, and silenced/unsilenced.
- **Entities page**: search by entity class and subscription.
- **Checks page**: search by subscription and published/unpublished.
- **Handlers page**: search by handler type.
- **Filters page**: search by action.
- **Silences page**: search by check and subscription.

You can also use the **SORT** dropdown menu to sort events and silences:

- **Events page**: sort by last OK, severity, newest, and oldest.
- **Silences page**: sort by start date.

## Advanced search functions

**COMMERCIAL FEATURE**: Access advanced search functions in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][1].

Sensu supports advanced web UI searches using a wider range of attributes, including custom labels.
You can use the same methods, selectors, and examples for web UI searches as for [API response filtering][3], with some [syntax differences][4].

## Create basic searches

If you are using the [basic web UI search functions][5], you can create a search just by clicking in the search bar at the top of the web UI page:

1. In the web UI, open the page of resources you want to search.
2. Click in the search bar at the top of the web UI page.
3. Select the attribute you want to search for from the dropdown list of options.
4. Click in the search bar again and select the search to apply.
5. Press **Return/Enter**.

{{% notice note %}}
**NOTE**: You do not need to specify a resource type in web UI search because you must navigate to the resource page *before* you construct the search.
{{% /notice %}}

## Create advanced searches

To search resources based on fields and labels, you'll write a brief search statement.
Depending on the [operator][9] you're using, the web UI search syntax is either:

{{< code text >}}
SEARCH_TERM OPERATOR FIELD
{{< /code >}}

or

{{< code text >}}
FIELD OPERATOR SEARCH_TERM
{{< /code >}}

For example, this search will retrieve all events for entities with the `linux` subscription:

{{< code text >}}
linux in event.entity.subscriptions
{{< /code >}}

This search will retrieve all events that include a `region` label that includes `eu`:

{{< code text >}}
events.labels.region matches eu
{{< /code >}}

The [examples][10] demonstrate how to construct web UI search statements for different operators and specific purposes.

## Web UI-specific syntax

If you are searching for a value that begins with a number, place the value in single or double quotes:

{{< code text >}}
entity.name == '1b04994n'
entity.name == "1b04994n"
{{< /code >}}

Likewise, to search string values that include special characters like hyphens and underscores, place the value in single or double quotes:

{{< code text >}}
entities.labels.region == 'us-west-1'
entities.labels.region == "us-west-1"
{{< /code >}}

## Operators quick reference

Web UI search supports two equality-based operators, two set-based operators, one substring matching operator, and one logical operator.

| operator  | description        | example                |
| --------- | ------------------ | ---------------------- |
| `==`      | Equality           | `check.publish == true`
| `!=`      | Inequality         | `check.namespace != "default"`
| `in`      | Included in        | `linux in check.subscriptions`
| `notin`   | Not included in    | `slack notin check.handlers`
| `matches` | Substring matching | `check.name matches "linux-"`
| `&&`      | Logical AND        | `check.publish == true && slack in check.handlers`

For details about operators, see [API response filtering operators][7].

## Quick search

The web UI quick search allows you to query Sensu resources without using search syntax.
Type your search term into the search field on any page of the web UI and press `Enter`.
Sensu will auto-complete a simple search statement for the resources on that page using substring matching.

For example, on the Events page in the web UI, if you type `mysql` into the search field, Sensu will auto-complete the search statement to `event.check.name matches "mysql"`.

## Examples

To search resources using specific [resource attributes][2] (in this example, to display only events at `2` (CRITICAL) status):

{{< code text >}}
event.check.status == "2"
{{< /code >}}

To display only events for checks with the subscription `webserver`, enter this search statement on the **Events page**:

{{< code text >}}
webserver in event.check.subscriptions
{{< /code >}}

To display only checks that use the `slack` handler, enter this search statement on the **Checks page**:

{{< code text >}}
slack in check.handlers
{{< /code >}}

### Search based on labels

Labels are treated like any other field in web UI searches.
For example, to display only checks with the `type` label set to `server`, enter this search statement on the **Checks page**:

{{< code text >}}
check.labels.type == server
{{< /code >}}

To search for entities that are labeled for any region in the US (e.g. `us-east-1`, `us-west-1`, and so on):

{{< code shell >}}
entity.labels.region matches "us"
{{< /code >}}

### Use the logical AND operator

To use the logical AND operator (`&&`) to return checks that include a `linux` subscription and the `slack` handler:

{{< code text >}}
linux in check.subscriptions && slack in check.handlers
{{< /code >}}

To return events that include a `windows` check subscription and any email handler:

{{< code text >}}
windows in event.check.subscriptions && event.check.handlers matches email
{{< /code >}}

## Save a search

**COMMERCIAL FEATURE**: Access saved searches in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][1].

To save a web UI search:

1. [Create a web UI search][4].
2. Click the save icon at the right side of the search bar: ![save icon](/images/save_icon.png)
3. Click **Save this search**.
4. Type the name you want to use for the saved search.
5. Press **Return/Enter**.

Sensu saves your web UI searches to etcd in a [namespaced resource][11] named `searches`.
To recall a saved web UI search, a Sensu user must be assigned to a [role][12] that includes permissions for both the `searches` resource and the namespace where you save the search.

The role-based access control (RBAC) reference includes [example workflows][13] that demonstrate how to configure a user's roles and role bindings to include full permissions for namespaced resources, including saved searches.

### Recall a saved search

To recall a saved search, click the save icon in the search bar and select the name of the search you want to recall.

You can combine an existing saved search with a new search to create a new saved search.
To do this, recall a saved search, add the new search statement in the search bar, and [save the combination as a new saved search][8].

### Delete a saved search

To delete a saved search:

1. Click the save icon in the search bar: ![save icon](/images/save_icon.png)
2. Click the delete icon next to the search you want to delete: ![delete icon](/images/delete_icon.png)


[1]: ../../commercial/
[2]: ../../api/#field-selector
[3]: ../../api/#response-filtering
[4]: #web-ui-specific-syntax
[5]: #basic-search-functions
[6]: ../../api/#label-selector
[7]: ../../api/#operators
[8]: #save-a-search
[9]: #operators-quick-reference
[10]: #examples
[11]: ../../operations/control-access/rbac/#namespaced-resource-types
[12]: ../../operations/control-access/rbac/#roles-and-cluster-roles
[13]: ../../operations/control-access/rbac/#example-workflows
