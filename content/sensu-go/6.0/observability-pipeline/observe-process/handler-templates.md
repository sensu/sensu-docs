---
title: "Create handler templates"
linkTitle: "Create Handler Templates"
description: "PLACEHOLDER."
weight: 80
version: "6.0"
product: "Sensu Go"
menu:
  sensu-go-6.0:
    parent: observe-process
---

Sensu Go uses the [Go template package][1], which allows you to generate text output that includes observation data from events.
Sensu handler templates include HTML-formatted text and data derived from event attributes like `event.entity.name` and `event.check.output`.
This allows you to add meaningful, actionable context to alerts.

For example, a template for a brief Slack alert might include information about the affected entity and its status, as well as a link to the organization's playbook for resolving observability alerts:

{{< code html >}}

<html>
The entity {{ .Entity.Name }} has a status of {{ .Check.State }}. The entity has reported the same status for {{ .Check.Occurrences }} preceding events.<br>
The playbook for managing this alert is availble at https://example.com/observability/alerts/playbook.
</html>

{{< /code >}}

## Template syntax and format

Handler templates use dot notation syntax to access event attributes, with the event attribute wrapped in double curly braces.
The initial dot indicates `event`.

For example, in a handler template, a reference to the event attribute `event.check.occurrences` becomes `{{ .Check.Occurrences }}`.

Use HTML to format the text and spacing in your templates.
All text outside double curly braces is copied directly into the template output, with HTML formatting applied.

## Template toolkit command

The [Sensu template toolkit command][8] is a Sensu handler plugin you can use to print a list of available event attributes in handler template dot notation syntax and validate your handler template output.

The template toolkit command uses event data you supply via STDIN in JSON format.

Visit the [template toolkit command Bonsai page][8] to install the plugin.

### Print available event attributes

If you are using a [plugin][7] that supports template output, every attribute in the [Sensu event][3] is available.
However, the template attribute capitalization pattern is different for handler templates than for event format.

Use the template toolkit command to print a list of the attributes that are available for your handler template based on the `event.json` event:

{{< code shell >}}
cat event.json | sensuctl command execute jspaleta/template-toolkit-command -- --dump-names

.Entity{
    .EntityClass: "agent",
    .System:      .System{
[...]
.Check{
    .Command:           "",
    .Handlers:          {"keepalive"},
    .HighFlapThreshold: 0x0,
[...]
{{< /code >}}

The response will list the available event attributes with the correct dot notation and capitalization pattern.
In this example, the response lists the available event attributes `.Entity.EntityClass`, `.Entity.System`, `.Check.Command`, `.Check.Handlers`, and `.Check.HighFlapThreshold`.

{{% notice note %}}
**NOTE**: The [events specification](../../observe-events/events/#spec-attributes) describes each event attribute in detail.
{{% /notice %}}

### Validate handler template output

Use the template toolkit command to validate the dot notation syntax and output for any event attribute.

For example, to test the output for the `{{ .Check.Name }}` attribute:

{{< code shell >}}
cat event.json | sensuctl command exec template-toolkit-command -- --template "{{ .Check.Name }}"

INFO[0000] asset includes builds, using builds instead of asset  asset=template-toolkit-command component=asset-manager entity=sensuctl
executing command with --template {{ .Check.Name }}
Template String Output: keepalive
{{< /code >}}

In this example, the command validates that for the `event.json` event, the handler template will replace `{{ .Check.Name }}` with `keepalive` in template output.

## Examples

### Sensu Email Handler plugin

The [Sensu Email Handler plugin][9] allows you to provide a template for the body of the email.
For example, this template will produce an email body that includes the name of the check and entity associated with the event, the status and number of occurrences, and other event details:

{{< code html >}}

<html>
Greetings,

<h3>Informational Details</h3>
<b>Check</b>: {{ .Check.Name }}<br>
<b>Entity</b>: {{ .Entity.Name }}<br>
<b>State</b>: {{ .Check.State }}<br>
<b>Occurrences</b>: {{ .Check.Occurrences }}<br>
<b>Playbook</b>: https://example.com/monitoring/wiki/playbook
<h3>Check Output Details</h3>
<b>Check Output</b>: {{.Check.Output}}
<h4>Check Hook(s)</h4>
{{range .Check.Hooks}}<b>Hook Name</b>:  {{.Name}}<br>
<b>Hook Command</b>:  {{.Command}}<br>
<b>Hook Output</b>: {{.Output}}<br>
{{end}}<br>
<br>
<br>
#monitoringlove,<br>
<br>
Sensu<br>
</html>

{{< /code >}}

The Sensu Email Handler plugin also includes a UnixTime function that allows you to print timestamp values from events in human-readable format.
See the [Sensu Email Handler Bonsai page][9] for details.

### Sensu PagerDuty Handler Example

The [Sensu PagerDuty Handler plugin][10] includes a basic template for the PagerDuty alert summary:

{{< code shell >}}
"{{.Entity.Name}}/{{.Check.Name}} : {{.Check.Output}}"
{{< /code >}}

With this template, the summary for every alert in PagerDuty will include:

- The name of the affected entity.
- The name of the check that produced the event.
- The check output for the event.

See the [Sensu PagerDuty Handler Bonsai page][10] for details.


[1]: https://pkg.go.dev/text/template
[2]: ../tokens/#token-specification
[3]: ../../observe-events/events/#spec-attributes
[4]: #available-event-attributes
[5]: https://golang.org/pkg/time/#Time.Format
[6]: https://yourbasic.org/golang/format-parse-string-time-date-example/
[7]: https://bonsai.sensu.io/
[8]: https://bonsai.sensu.io/assets/jspaleta/template-toolkit-command
[9]: https://bonsai.sensu.io/assets/sensu/sensu-email-handler
[10]: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler
