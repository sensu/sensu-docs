---
title: "Dashboard filtering"
linkTitle: "Filtering"
description: "The Sensu dashboard supports filtering on the events, entities, checks, handlers, and silences pages. Read the doc to learn more."
version: "5.10"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.10:
    parent: dashboard
---

The Sensu dashboard provides drop-down filters to build customized views of Sensu resources.
When applied, filters create a unique link, so you can bookmark and share your favorite filter combinations.

- On the **events page**, filter by entity, check, status, and silenced/unsilenced. You can also sort events by severity, last OK, newest, and oldest.
- On the **entities page**, filter by entity class and subscription.
- On the **checks page**, filter by subscription and published/unpublished.
- On the **handlers page**, filter by handler type.
- On the **silences page**, filter by check and subscription. You can also sort silences by start date.

## Advanced filtering

**LICENSED TIER**: Unlock advanced filtering in the Sensu Go dashboard with a Sensu license. To activate your license, see the [getting started guide][1].

Sensu supports advanced dashboard filtering using the filter bar.
Select the filter bar and start building custom views using suggested attributes and values, including custom labels.

### Label selectors

To filter by custom labels, use the `labelSelector` filter and the `==` operator.
For example, to display only resources with a `region: us-west-1` label:

{{< highlight text >}}
labelSelector: region == "us-west-1"
{{< /highlight >}}

### Field selectors

Field selectors let you fine-tune filters using a wider range of attributes based on the resource type.
For a complete list of supported attributes and operators, see the [API docs][2].

To display, on the **events page**, only events with the subscription `webserver`:

{{< highlight text >}}
fieldSelector: event.check.subscriptions == "webserver"
{{< /highlight >}}

To display, on the **checks page**, only checks using the `slack` asset:

{{< highlight text >}}
fieldSelector: check.handlers == "slack"
{{< /highlight >}}

[1]: ../../getting-started/enterprise
[2]: ../../api/overview#field-selector
