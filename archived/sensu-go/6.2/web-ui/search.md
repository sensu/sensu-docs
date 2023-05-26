---
title: "Search in the web UI"
linkTitle: "Search in the Web UI"
description: "The Sensu web UI supports searching and filtering the Events, Entities, Silences, Checks, Handlers, Filters, and Mutators pages. Learn more about searches in the Sensu web UI."
weight: 30
version: "6.2"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-6.2:
    parent: web-ui
---

The Sensu web UI includes basic search and filtering functions you can use to build customized views of your Sensu resources.
Sensu also supports advanced web UI searches based on a wider range of resource attributes and custom labels as a [commercial feature][1].

When you apply a search to a web UI page, it creates a unique link for the page of search results.
You can bookmark these links and share your favorite search combinations.
You can also [save your favorite searches][8].

## Search operators

Web UI search supports two equality-based operators, two set-based operators, one substring matching operator, and one logical operator.

| operator  | description        | example                |
| --------- | ------------------ | ---------------------- |
| `==`      | Equality           | `check.publish == "true"`
| `!=`      | Inequality         | `check.namespace != "default"`
| `in`      | Included in        | `"linux" in check.subscriptions`
| `notin`   | Not included in    | `"slack" notin check.handlers`
| `matches` | Substring matching | `check.name matches "linux-"`
| `&&`      | Logical AND        | `check.publish == "true" && "slack" in check.handlers`

For details about operators, read about the [API response filtering operators][7].

## Use quick search

The web UI quick search allows you to query and filter Sensu resources without using search syntax.
Type your search term into the search field on any page of the web UI and press `Enter`.
Sensu will auto-complete a simple search statement for the resources on that page using substring matching.

For example, on the Events page in the web UI, if you type `mysql` into the search field, Sensu will auto-complete the search statement to `event.check.name matches "mysql"`.

## Create basic searches

Sensu includes these basic search functions:

- **Events page**: search by entity, check, status, and silenced/unsilenced.
- **Entities page**: search by entity class and subscription.
- **Silences page**: search by check and subscription.
- **Checks page**: search by subscription and published/unpublished.
- **Handlers page**: search by handler type.
- **Filters page**: search by action.

If you are using the [basic web UI search functions][5], you can create a search by clicking in the search bar at the top of the web UI page:

1. In the web UI, open the page of resources you want to search.
2. Click in the search bar at the top of the web UI page.
3. Select the attribute you want to search for from the dropdown list of options.
4. Click in the search bar again and select the search to apply.
5. Press **Return/Enter**.

{{% notice note %}}
**NOTE**: You do not need to specify a resource type in web UI search because you must navigate to the resource page *before* you construct the search.
{{% /notice %}}

## Create advanced searches

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access advanced web UI searches in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

Sensu supports advanced web UI searches using a wider range of attributes, including custom labels.
You can use the same methods, fields, and examples for web UI searches as for [API response filtering][3], with some [syntax differences][4].

To search resources based on fields and labels, you'll write a brief search statement.
Depending on the [operator][9] you're using, the web UI search syntax is either:

{{< code text >}}
SEARCH_TERM OPERATOR FIELD
{{< /code >}}

or

{{< code text >}}
FIELD OPERATOR SEARCH_TERM
{{< /code >}}

Fields are specific [resource attributes][2] in dot notation.
For example, this search will retrieve all events for entities with the `linux` subscription:

{{< code text >}}
"linux" in event.entity.subscriptions
{{< /code >}}

This search will retrieve all events that whose status is *not* equal to `passing`:

{{< code text >}}
event.check.state != "passing"
{{< /code >}}

To display only events for checks with the subscription `webserver`, enter this search statement on the **Events page**:

{{< code text >}}
"webserver" in event.check.subscriptions
{{< /code >}}

To display only checks that use the `slack` handler, enter this search statement on the **Checks page**:

{{< code text >}}
"slack" in check.handlers
{{< /code >}}

## Search for numbers or special characters

If you are searching for a value that begins with a number, place the value in single or double quotes:

{{< code text >}}
entity.name == '1b04994n'
entity.name == "1b04994n"
{{< /code >}}

Likewise, to search string values that include special characters like hyphens and underscores, place the value in single or double quotes:

{{< code text >}}
entity.labels.region == 'us-west-1'
entity.labels.region == "us-west-1"
{{< /code >}}

To display only events at `2` (CRITICAL) status:

{{< code text >}}
event.check.status == "2"
{{< /code >}}

## Search for labels

Labels are treated like any other field in web UI searches.

For example, to search based on a check label `version`, use:

{{< code text >}}
check.labels.version matches "7"
{{< /code >}}

To display only checks with the `type` label set to `server`, enter this search statement on the **Checks page**:

{{< code text >}}
check.labels.type == "server"
{{< /code >}}

To search for entities that are labeled for any region in the US (for example, `us-east-1`, `us-west-1`, and so on):

{{< code shell >}}
entity.labels.region matches "us"
{{< /code >}}

{{% notice note %}}
**NOTE**: Web UI searches for label names that include hyphens are not supported.
Searches that include a hyphenated label name, such as `entity.labels.imported-by`, will return an unsupported token error.
{{% /notice %}}

### Search for event labels

For label-based event searches, the web UI merges check and entity labels into a single search term: `event.labels.[KEY]`.

For example, to display events with the `type` label set to `server`, enter this search statement on the **Events** page:

{{< code text >}}
event.labels.type == "server"
{{< /code >}}

This search will retrieve events with the `type` label set to `server`, no matter whether the label is defined in the event's corresponding check or entity configuration.

## Use the logical AND operator

To use the logical AND operator (`&&`) to return checks that include a `linux` subscription and the `slack` handler:

{{< code text >}}
"linux" in check.subscriptions && "slack" in check.handlers
{{< /code >}}

To return events that include a `windows` check subscription and any email handler:

{{< code text >}}
"windows" in event.check.subscriptions && event.check.handlers matches "email"
{{< /code >}}

## Save a search

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access saved web UI searches in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

To save a web UI search:

1. [Create a web UI search][4].
2. Click the save icon at the right side of the search bar: ![save icon](/images/archived_version_images/old_save_icon.png)
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

1. Click the save icon in the search bar: ![save icon](/images/archived_version_images/old_save_icon.png)
2. Click the delete icon next to the search you want to delete: ![delete icon](/images/archived_version_images/old_delete_icon.png)

## Use the sort function

Use the **SORT** dropdown menu to sort search results.
You can sort all resources by name, but events and silences have additional sorting options:

- **Events page**: sort by last OK, severity, newest, and oldest.
- **Silences page**: sort by start date.


[1]: ../../commercial/
[2]: ../../api/#field-selector
[3]: ../../api/#response-filtering
[4]: #search-for-numbers-or-special-characters
[5]: #create-basic-searches
[6]: ../../api/#label-selector
[7]: ../../api/#operators
[8]: #save-a-search
[9]: #search-operators
[11]: ../../operations/control-access/rbac/#namespaced-resource-types
[12]: ../../operations/control-access/rbac/#roles-and-cluster-roles
[13]: ../../operations/control-access/rbac/#create-a-role-and-role-binding
