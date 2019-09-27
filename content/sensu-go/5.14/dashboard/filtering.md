---
title: "Dashboard filtering"
linkTitle: "Filtering"
description: "The Sensu dashboard supports filtering on the events, entities, checks, handlers, filters, mutators, and silences pages. Read the doc to learn more."
version: "5.14"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.14:
    parent: dashboard
---

The Sensu dashboard provides basic filters to build customized views of Sensu resources.
When applied, filters create a unique link, so you can bookmark and share your favorite filter combinations.

- On the **events page**, filter by entity, check, status, and silenced/unsilenced. You can also sort events by severity, last OK, newest, and oldest.
- On the **entities page**, filter by entity class and subscription.
- On the **checks page**, filter by subscription and published/unpublished.
- On the **handlers page**, filter by handler type.
- On the **filters page**, filter by action.
- On the **silences page**, filter by check and subscription. You can also sort silences by start date.

## Advanced filtering

**LICENSED TIER**: Unlock advanced filtering in the Sensu Go dashboard with a Sensu license. To activate your license, see the [getting started guide][1].

Sensu supports advanced dashboard filtering using a wider range of attributes, including custom labels.
Select the filter bar to start building custom views using suggested attributes and values.

### Label selectors

To filter by custom labels on the entities, checks, handlers, filters, mutators, and silences pages, use the `labelSelector` filter and the `==` operator.

To display, on the **entities page**, only entities with a `region: us-west-1` label:

{{< highlight text >}}
labelSelector: region == "us-west-1"
{{< /highlight >}}

### Field selectors

Field selectors let you fine-tune filters using the complete set of attributes supported by API filtering.
For a complete list of supported attributes and operators, see the [API docs][2].

To display, on the **events page**, only events with the subscription `webserver`:

{{< highlight text >}}
fieldSelector: webserver in event.check.subscriptions
{{< /highlight >}}

To display, on the **checks page**, only checks using the `slack` asset:

{{< highlight text >}}
fieldSelector: slack in check.handlers
{{< /highlight >}}

[1]: ../../getting-started/enterprise
[2]: ../../api/overview#field-selector
