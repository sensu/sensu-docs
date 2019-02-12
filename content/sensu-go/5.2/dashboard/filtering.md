---
title: "Dashboard filtering"
linkTitle: "Filtering"
version: "5.2"
product: "Sensu Go"
platformContent: false
menu:
  sensu-go-5.2:
    parent: dashboard
---

- [Event filtering](#event-filtering)
- [Entity filtering](#entity-filtering)
- [Check filtering](#check-filtering)
- [Silence filtering](#silence-filtering)
- [Arrays](#arrays)
- [Regular expressions](#regular-expressions)

The Sensu dashboard supports filtering on the events, entities, checks, and silences pages.
Dashboard filtering uses [Sensu query expression](../../reference/sensu-query-expressions) syntax (for example: `entity.entity_class === "proxy"`) depending on the scope of the page.

### Syntax quick reference

- `===` / `!==` -- Identity operator / Nonidentity operator
- `==` / `!=` -- Equality operator / Inequality operator
- `&&` / `||` -- Logical AND / Logical OR
- `<` / `>` -- Less than / Greater than
- `<=` / `>=` -- Less than or equal to / Greater than or equal to

### Event filtering

Filtering on the events page supports all entity and check attributes present in the [event data](../../reference/events), prefixed with `entity.` or `check.` respectively.

To show only events for the entity hostname `server1`:

{{< highlight text >}}
entity.system.hostname === "server1"
{{< /highlight >}}

To show only events with a warning or critical status produced by the check named `check_http`:

{{< highlight text >}}
check.status > 0 && check.name === "check_http"
{{< /highlight >}}

### Entity filtering

Filtering on the entities page assumes the entity scope and supports all [entity](../../reference/entities) attributes.

To show only entities of entity class `proxy`:

{{< highlight text >}}
entity_class === "proxy"
{{< /highlight >}}

To show only entities running on Linux or Windows:

{{< highlight text >}}
system.os === "linux" || system.os === "windows"
{{< /highlight >}}

### Check filtering

Filtering on the check page assumes the check scope and supports all [check](../../reference/checks) attributes.

To show only the check named `check_cpu`:

{{< highlight text >}}
name === "check_cpu"
{{< /highlight >}}

To show only checks with the `publish` attribute set to `false`:

{{< highlight text >}}
!publish
{{< /highlight >}}

### Silence filtering

Filtering on the silences page assumes the silences scope and supports all [silencing entry](../../reference/silencing) attributes.

To show only silences with the creator `admin`:

{{< highlight text >}}
creator === "admin"
{{< /highlight >}}

To show only silences applied to the check `check_cpu`:

{{< highlight text >}}
check === "check_cpu"
{{< /highlight >}}

### Arrays

To filter based on an attribute that contains an array of elements, use the `.indexOf` syntax.

On the checks page, to show only checks with the handler `slack`:

{{< highlight text >}}
handlers.indexOf("slack") > 0
{{< /highlight >}}

### Regular expressions

The Sensu dashboard supports filtering with regular expressions using the `.match` syntax.

On the checks page, to show only checks with names prefixed with `metric-`:

{{< highlight text >}}
!!name.match(/^metric-/)
{{< /highlight >}}
