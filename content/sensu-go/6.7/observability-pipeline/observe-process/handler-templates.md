---
title: "Create handler templates"
linkTitle: "Create Handler Templates"
guide_title: "Create handler templates"
type: "guide"
description: "Add meaningful, actionable context to alerts with event-based templating for your handlers. Read this guide to learn how to create handler templates."
weight: 120
version: "6.7"
product: "Sensu Go"
menu:
  sensu-go-6.7:
    parent: observe-process
---

Sensu Go uses the [Go template package][1], which allows you to generate text output that includes observation data from events.
Sensu handler templates include HTML-formatted text and data derived from event attributes like `event.entity.name` and `event.check.output`.
This allows you to add meaningful, actionable context to alerts.

For example, a template for a brief Slack alert might include information about the affected entity and its status, as well as a link to the organization's playbook for resolving observability alerts:

{{< code html >}}

<html>
The entity {{.Entity.Name}} has a status of {{.Check.State}}. The entity has reported the same status for {{.Check.Occurrences}} preceding events.<br>
The playbook for managing this alert is available at https://example.com/observability/alerts/playbook.
</html>

{{< /code >}}

## Template syntax and format

Handler templates use dot notation syntax to access event attributes, with the event attribute wrapped in double curly braces.
The initial dot indicates `event`.

For example, in a handler template, a reference to the event attribute `event.check.occurrences` becomes `{{.Check.Occurrences}}`.

Use HTML to format the text and spacing in your templates.
All text outside double curly braces is copied directly into the template output, with HTML formatting applied.

## Available event attributes

If you are using a plugin that supports template output, every attribute in the Sensu event is available for substitution via handler templating.
However, the attribute capitalization pattern is different for handler templates than for event format.

The table below lists the event attributes that are available to use in handler templates, in the correct dot notation and capitalization pattern.
You can also use the [template toolkit command][11] to print available event attributes for a specific event.

{{% notice note %}}
**NOTE**: The [entity](../../observe-entities/entities/#spec-attributes) and [events](../../observe-events/events/#spec-attributes) specifications describe each attribute in detail.
{{% /notice %}}

| attribute | attribute | attribute |
| --- | --- | --- |
| `.HasCheck` | `.HasMetrics` | `.IsIncident` |
| `.IsResolution` | `.IsSilenced` | `.Timestamp` |
| `.Check.Annotations` | `.Check.CheckHooks` | `.Check.Command` |
| `.Check.Cron` | `.Check.DiscardOutput` | `.Check.Duration` |
| `.Check.EnvVars` | `.Check.Executed` | `.Check.ExtendedAttributes` |
| `.Check.Handlers` | `.Check.HighFlapThreshold` | `.Check.History` |
| `.Check.Hooks` | `.Check.Interval` | `.Check.Issued` |
| `.Check.Labels` | `.Check.LastOK` | `.Check.LowFlapThreshold` |
| `.Check.MaxOutputSize` | `.Check.Name` | `.Check.Namespace` |
| `.Check.Occurrences` | `.Check.OccurrencesWatermark` | `.Check.Output` |
| `.Check.OutputMetricFormat` | `.Check.OutputMetricHandlers` | `.Check.ProxyEntityName` |
| `.Check.ProxyRequests` | `.Check.Publish` | `.Check.RoundRobin` |
| `.Check.RuntimeAssets` | `.Check.Secrets` | `.Check.Silenced` |
| `.Check.State` | `.Check.Status` | `.Check.Stdin` |
| `.Check.Subdue` | `.Check.Subscriptions` | `.Check.Timeout` |
| `.Check.TotalStateChange` | `.Check.Ttl` | `.Entity.Annotations` |
| `.Entity.Deregister` | `.Entity.Deregistration` | `.Entity.EntityClass` |
| `.Entity.ExtendedAttributes` | `.Entity.KeepaliveHandlers` | `.Entity.Labels` |
| `.Entity.LastSeen` | `.Entity.Name` | `.Entity.Namespace` |
| `.Entity.Redact` | `.Entity.SensuAgentVersion` | `.Entity.Subscriptions` |
| `.Entity.System` | `.Entity.System.Arch` | `.Entity.System.ARMVersion` |
| `.Entity.System.CloudProvider` | `.Entity.System.Hostname` | `.Entity.System.LibcType` |
| `.Entity.System.Network` | `.Entity.System.OS` | `.Entity.System.Platform` |
| `.Entity.System.PlatformFamily` | `.Entity.System.PlatformVersion` | `.Entity.System.Processes` |
| `.Entity.System.VMRole` | `.Entity.System.VMSystem` | `.Entity.User` |
| `.Metrics.Handlers` | `.Metrics.Points` | |

## Template toolkit command

The [sensu/template-toolkit-command][8] dynamic runtime asset provides a sensuctl command plugin you can use to print a list of available event attributes in handler template dot notation syntax and validate your handler template output.

The template toolkit command uses event data you supply via stdin in JSON format.

Add the Sensu template toolkit command asset to Sensu:

{{< code shell >}}
sensuctl asset add sensu/template-toolkit-command:0.4.0 -r template-toolkit-command
{{< /code >}}

This example uses the `-r` (rename) flag to specify a shorter name for the asset: `template-toolkit-command`.

You can also download the latest asset definition from [Bonsai][8].

Run `sensuctl asset list` to confirm that the asset is ready to use:

{{< code text >}}
            Name                                                         URL                                                Hash    
 ────────────────────────── ───────────────────────────────────────────────────────────────────────────────────────────── ───────── 
  template-toolkit-command   //assets.bonsai.sensu.io/.../template-toolkit-command_0.4.0_windows_amd64.tar.gz              019ccf3  
  template-toolkit-command   //assets.bonsai.sensu.io/.../template-toolkit-command_0.4.0_darwin_amd64.tar.gz               b771813  
  template-toolkit-command   //assets.bonsai.sensu.io/.../template-toolkit-command_0.4.0_linux_armv7.tar.gz                4e7ad65  
  template-toolkit-command   //assets.bonsai.sensu.io/.../template-toolkit-command_0.4.0_linux_arm64.tar.gz                02eca1f  
  template-toolkit-command   //assets.bonsai.sensu.io/.../template-toolkit-command_0.4.0_linux_386.tar.gz                  56ed603  
  template-toolkit-command   //assets.bonsai.sensu.io/.../template-toolkit-command_0.4.0_linux_amd64.tar.gz                7dbd2c6  
{{< /code >}}

### Print available event attributes

Use the template toolkit command to print a list of the available event attributes as well as the correct dot notation and capitalization pattern for a specific event (in this example, `event.json`):

{{< code shell >}}
cat event.json | sensuctl command exec template-toolkit-command -- --dump-names
{{< /code >}}

The response lists the available attributes for the event:

{{< code text >}}
INFO[0000] asset includes builds, using builds instead of asset  asset=template-toolkit-command component=asset-manager entity=sensuctl
.Event{
    .Timestamp: 1580310179,
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

In this example, the response lists the available event attributes `.Timestamp`, `.Entity.EntityClass`, `.Entity.System`, `.Check.Command`, `.Check.Handlers`, and `.Check.HighFlapThreshold`.

You can also use `sensuctl event info <entity_name> <check_name>` to print the correct notation and pattern: template output for a specific event (in this example, an event for entity `server01` and check `server-health`):

{{< code shell >}}
sensuctl event info server01 server-health --format json | sensuctl command exec template-toolkit -- --dump-names
{{< /code >}}

The response lists the available attributes for the event:

{{< code text >}}
INFO[0000] asset includes builds, using builds instead of asset  asset=template-toolkit-command component=asset-manager entity=sensuctl
.Event{
    .Timestamp: 1580310179,
    .Entity:{
        .EntityClass:        "proxy",
        .System:             .System{
	[...]
    .Check:{
        .Command:           "health.sh",
        .Handlers:          {"slack"},
        .HighFlapThreshold: 0x0,
    [...]
{{< /code >}}

### Validate handler template output

Use the template toolkit command to validate the dot notation syntax and output for any event attribute.

For example, to test the output for the `{{.Check.Name}}` attribute for the event `event.json`:

{{< code shell >}}
cat event.json | sensuctl command exec template-toolkit-command -- --template "{{.Check.Name}}"
{{< /code >}}

The response will list the template output:

{{< code text >}}
INFO[0000] asset includes builds, using builds instead of asset  asset=template-toolkit-command component=asset-manager entity=sensuctl
executing command with --template {{.Check.Name}}
Template String Output: keepalive
{{< /code >}}

In this example, the command validates that for the `event.json` event, the handler template will replace `{{.Check.Name}}` with `keepalive` in template output.

You can also use `sensuctl event info <entity_name> <check_name>` to validate template output for a specific event (in this example, an event for entity `webserver01` and check `check-http`):

{{< code shell >}}
sensuctl event info webserver01 check-http --format json | sensuctl command exec template-toolkit-command -- --template "Server: {{.Entity.Name}} Check: {{.Check.Name}} Status: {{.Check.State}}"
{{< /code >}}

The response will list the template output:

{{< code text >}}
Executing command with --template Server: {{.Entity.Name}} Check: {{.Check.Name}} Status: {{.Check.State}}
Template String Output: Server: "webserver01 Check: check-http Status: passing"
{{< /code >}}

## Sensu Email Handler plugin

The [sensu/sensu-email-handler][9] dynamic runtime asset allows you to provide a template for the body of the email alert.
For example, this template will produce an email body that includes the name of the check and entity associated with the event, the status and number of occurrences, and other event details:

{{< code html >}}

<html>
Greetings,

<h3>Informational Details</h3>
<b>Check</b>: {{.Check.Name}}<br>
<b>Entity</b>: {{.Entity.Name}}<br>
<b>State</b>: {{.Check.State}}<br>
<b>Occurrences</b>: {{.Check.Occurrences}}<br>
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

The sensu/sensu-email-handler dynamic runtime asset also includes a UnixTime function that allows you to print timestamp values from events in human-readable format.
Read the [sensu/sensu-email-handler Bonsai page][9] for details.

## Sensu PagerDuty Handler example

The [sensu/sensu-pagerduty-handler][10] dynamic runtime asset includes a basic template for the PagerDuty alert summary:

{{< code shell >}}
"{{.Entity.Name}}/{{.Check.Name}} : {{.Check.Output}}"
{{< /code >}}

With this template, the summary for every alert in PagerDuty will include:

- The name of the affected entity.
- The name of the check that produced the event.
- The check output for the event.

Read the [Sensu PagerDuty Handler Bonsai page][10] for details.


[1]: https://pkg.go.dev/text/template
[3]: ../../observe-events/events/#spec-attributes
[4]: #available-event-attributes
[5]: https://golang.org/pkg/time/#Time.Format
[6]: https://yourbasic.org/golang/format-parse-string-time-date-example/
[7]: https://bonsai.sensu.io/
[8]: https://bonsai.sensu.io/assets/sensu/template-toolkit-command
[9]: https://bonsai.sensu.io/assets/sensu/sensu-email-handler
[10]: https://bonsai.sensu.io/assets/sensu/sensu-pagerduty-handler
[11]: #template-toolkit-command
