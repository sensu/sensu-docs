---
title: "Dashboard filtering"
linkTitle: "Filtering"
description: "The Sensu dashboard supports filtering on the Events, Entities, Checks, Handlers, Filters, Mutators, and Silences pages. Learn more about filtering in the Sensu dashboard."
version: "5.16"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.16:
    parent: dashboard
---

The Sensu dashboard includes basic filters you can use to build customized views of your Sensu resources.
When applied, filters create a unique link, so you can bookmark and share your favorite filter combinations.

- On the **Events page**, filter by entity, check, status, and silenced/unsilenced.
You can also sort events by severity, last OK, newest, and oldest.
- On the **Entities page**, filter by entity class and subscription.
- On the **Checks page**, filter by subscription and published/unpublished.
- On the **Handlers page**, filter by handler type.
- On the **Filters page**, filter by action.
- On the **Silences page**, filter by check and subscription.
You can also sort silences by start date.

## Advanced filtering

**COMMERCIAL FEATURE**: Access advanced filtering in the packaged Sensu Go distribution. For more information, see [Get started with commercial features][1].

Sensu supports advanced dashboard filtering using a wider range of attributes, including custom labels.
Select the filter bar to start building custom views using suggested attributes and values.

### Filter with label selectors

To filter by custom labels on the Entities, Checks, Handlers, Filters, Mutators, and Silences pages, use the `labelSelector` filter and the `==` operator.

For example, on the **Entities page**, to display only entities with a `region: us-west-1` label:

{{< highlight text >}}
labelSelector: region == "us-west-1"
{{< /highlight >}}

### Filter with field selectors

Field selectors let you fine-tune filters using the complete set of attributes supported by API filtering.
For a complete list of supported attributes and operators, see the [API docs][2].

For example, on the **Events page**, to display only events with the subscription `webserver`:

{{< highlight text >}}
fieldSelector: webserver in event.check.subscriptions
{{< /highlight >}}

On the **Checks page**, to display only checks that use the `slack` asset:

{{< highlight text >}}
fieldSelector: slack in check.handlers
{{< /highlight >}}

[1]: ../../getting-started/enterprise/
[2]: ../../api/overview#field-selector
