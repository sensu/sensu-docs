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

For example, this template for a brief Slack alert includes information about the affected entity and its status, as well as a link to the organization's playbook for resolving observability alerts:

{{< code html >}}

<html>
The entity {{ .Entity.Name }} has a status of {{ .Check.State }}. The entity has reported the same status for {{ .Check.Occurrences }} preceding events.<br>
The playbook for managing this alert is availble at https://example.com/observability/alerts/playbook.
</html>

{{< /code >}}

## Template syntax and format

Handler template syntax for attributes is similar to [token substitution][10] syntax.

Use dot notation to access event attributes.
The initial dot indicates `event`.
For example, the event attribute `event.check.occurrences` becomes `.Check.Occurrences` in a handler template.

Place attributes inside double curly braces: `{{ .Check.Occurrences }}`.

Use HTML to format the text and spacing in your templates.
All text outside the double curly braces is copied directly into the template output, with any HTML formatting applied.

## Template toolbox

Use the Sensu template toolbox to validate your handler template, pipe sample data to your template to preview and troubleshoot the output, and print a list of available event attributes in template dot notation syntax.

### Validate a handler template

PLACEHOLDER...

### Preview handler output

PLACEHOLDER...

### Print available event attributes

If you are using a [plugin][7] that supports template output, every attribute in the [Sensu event][3] is available.
However, the template attribute capitalization pattern is different for handler templates than for event format.

You can use the template toolbox command to print a list of the event attributes that are available for your handler template.

PLACEHOLDER...

## Available event attributes [remove?]

If you are using a [plugin][7] that supports templates output, every attribute in the [Sensu event][3] is available.
However, the template attribute capitalization pattern is different for handler templates than for event format.
This section lists available attributes and the correct capitalization pattern for each resource type.

| attribute           | type    | description |
| ------------------- | ------- | ----------- |
`.HasCheck`     | Boolean | Returns true if the event contains check data
`.HasMetrics`   | Boolean | Returns true if the event contains metrics
`.IsIncident`   | Boolean | Returns true for critical alerts (status `2`), warnings (status `1`), and resolution events (status `0` transitioning from status `1` or `2`)
`.IsResolution` | Boolean | Returns true if the event status is OK (`0`) and the previous event was of a non-zero status
`.IsSilenced`   | Boolean | Returns true if the event matches an active silencing entry
`.Timestamp`     | integer | Time that the event occurred in seconds since the Unix epoch
`.Check.Annotations`            | map     | Custom [annotations][19] applied to the check
`.Check.Command`                | string  | The command executed by the check
`.Check.Cron`                   | string  | [Check execution schedule][21] using cron syntax
`.Check.DiscardOutput`         | Boolean | Whether the check is configured to discard check output from event data
`.Check.Duration`               | float   | Command execution time in seconds
`.Check.EnvVars`               | array   | Environment variables used with command execution
`.Check.Executed`               | integer | Time that the check was executed in seconds since the Unix epoch
`.Check.Handlers`               | array   | Sensu event [handlers][22] assigned to the check
`.Check.HighFlapThreshold`    | integer | The check's flap detection high threshold in percent state change
`.Check.History`                | array   | [Check status history][20] for the last 21 check executions
`.Check.Hooks`                  | array   | [Check hook][12] execution data
`.Check.Interval`               | integer | The check execution frequency in seconds
`.Check.Issued`                 | integer | Time that the check request was issued in seconds since the Unix epoch
`.Check.Labels`                 | map     | Custom [labels][19] applied to the check
`.Check.LastOK`                | integer | The last time that the check returned an OK status (`0`) in seconds since the Unix epoch
`.Check.LowFlapThreshold`     | integer | The check's flap detection low threshold in percent state change
`.Check.MaxOutputSize`        | integer | Maximum size of stored check outputs in bytes
`.Check.Name`                   | string  | Check name
`.Check.Occurrences`            | integer | The [number of preceding events][29] with the same status as the current event
`.Check.OccurrencesWatermark`  | integer | For resolution events, the [number of preceding events][29] with a non-OK status
`.Check.Output`                 | string  | The output from the execution of the check command
`.Check.OutputMetricFormat`   | string  | The [metric format][13] generated by the check command: `nagios_perfdata`, `graphite_plaintext`, `influxdb_line`, or `opentsdb_line` 
`.Check.OutputMetricHandlers` | array   | Sensu metric [handlers][22] assigned to the check
`.Check.ProxyEntityName`      | string  | The entity name, used to create a [proxy entity][14] for an external resource
`.Check.ProxyRequests`         | map     | [Proxy request][15] configuration
`.Check.Publish`                | Boolean | Whether the check is scheduled automatically
`.Check.RoundRobin`            | Boolean | Whether the check is configured to be executed in a [round-robin style][16]
`.Check.RuntimeAssets`         | array   | Sensu [dynamic runtime assets][17] used by the check
`.Check.State`                  | string  | The state of the check: `passing` (status `0`), `failing` (status other than `0`), or `flapping`
`.Check.Status`                 | integer | Exit status code produced by the check: `0` (OK), `1` (warning), `2` (critical), or other status (unknown or custom status)
`.Check.Stdin`                  | Boolean | Whether the Sensu agent writes JSON-serialized entity and check data to the command process’ STDIN
`.Check.Subscriptions`          | array   | Subscriptions that the check belongs to
`.Check.Timeout`                | integer | The check execution duration timeout in seconds
`.Check.Total_state_change`     | integer | The total state change percentage for the check’s history
`.Check.Ttl`                    | integer | The time-to-live (TTL) until the event is considered stale, in seconds
`.Metrics.Handlers`             | array   | Sensu metric [handlers][22] assigned to the check
`.Metrics.Points`               | array   | [Metric data points][23] including a name, timestamp, value, and tags
`.Entity.Annotations`             | map     | Custom [annotations][24] assigned to the entity
`.Entity.Deregister`              | Boolean | Whether the agent entity should be removed when it stops sending [keepalive messages][26]
`.Entity.Deregistration`          | map     | A map that contains a handler name for use when an entity is deregistered
`.Entity.EntityClass`            | string  | The entity type: usually `agent` or `proxy`
`.Entity.Labels`                  | map     | Custom [labels][24] assigned to the entity
`.Entity.LastSeen`               | integer | Timestamp the entity was last seen in seconds since the Unix epoch
`.Entity.Name`                    | string  | Entity name
`.Entity.Redact`                  | array   | List of items to redact from log messages
`.Entity.Subscriptions`           | array   | List of subscriptions assigned to the entity
`.Entity.System`                  | map     | Information about the [entity's system][18]
`.Entity.System.Arch`             | string  | The entity's system architecture
`.Entity.System.Hostname`         | string  | The entity's hostname
`.Entity.System.Network`          | map     | The entity's network interface list
`.Entity.System.Os`               | string  | The entity’s operating system
`.Entity.System.Platform`         | string  | The entity’s operating system distribution
`.Entity.System.PlatformFamily`  | string  | The entity’s operating system family
`.Entity.System.PlatformVersion` | string  | The entity’s operating system version
`.Entity.User`                    | string  | Sensu [RBAC][25] username used by the agent entity

## Examples

### Sensu Email Handler plugin

The [Sensu Email Handler plugin][50] allows you to provide a template for the body of the email.
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
See the [email handler plugin Bonsai page][50] for details.

### [Another handler] Example

PLACEHOLDER...


[1]: https://pkg.go.dev/text/template
[2]: ../tokens/#token-specification
[3]: ../../observe-events/events/#spec-attributes
[4]: #available-event-attributes
[5]: https://golang.org/pkg/time/#Time.Format
[6]: https://yourbasic.org/golang/format-parse-string-time-date-example/
[7]: https://bonsai.sensu.io/
[12]: ../hooks/
[13]: ../collect-metrics-with-checks/
[14]: ../checks#use-a-proxy-check-to-monitor-a-proxy-entity
[15]: ../checks#use-a-proxy-check-to-monitor-multiple-proxy-entities
[16]: ../checks#round-robin-checks
[17]: ../../../operations/deploy-sensu/assets/
[18]: ../../observe-entities/entities#system-attributes
[19]: ../checks/#metadata-attributes
[20]: ../../observe-events/events/#history-attributes
[21]: ../checks#check-scheduling
[22]: ../../observe-process/handlers/
[23]: ../../observe-events/events#metric-attributes
[24]: ../../observe-entities/entities#metadata-attributes
[25]: ../../../operations/control-access/rbac#default-roles
[26]: ../agent#keepalive-monitoring
[27]: ../../observe-filter/sensu-query-expressions/
[28]: ../../observe-events/events#event-format
[29]: ../../observe-events/events#occurrences-and-occurrences-watermark
[30]: ../../observe-filter/reduce-alert-fatigue/
[50]: https://bonsai.sensu.io/assets/sensu/sensu-email-handler
