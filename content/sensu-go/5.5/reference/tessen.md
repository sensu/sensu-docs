---
title: "Tessen"
description: "Tessens sends anonymized data about Sensu instances to Sensu Inc. You can use sensuctl to view and manage Tessen configuration. Read the reference to configure Tessen."
weight: 10
version: "5.5"
product: "Sensu Go"
menu: 
  sensu-go-5.5:
    parent: reference
---

- [Configuring Tessen](#configuring-tessen)
- [Specification](#tessen-specification)
- [Example](#tessen-configuration-example)
- [Tessen payload example](#tessen-payload-example)

Tessen is the Sensu call-home service.
Enabled by default on Sensu backends, Tessen sends anonymized data about Sensu instances to Sensu Inc., including the version, cluster size, number of events processed, and number of resources created (like checks and handlers).
We rely on this data to understand how Sensu is being used and make informed decisions about product improvements.
[Read the blog post][1] to learn more about Tessen.

All data submissions are logged for complete transparency at the `info` log level and transmitted over HTTPS.
See the [troubleshooting guide][5] to set the Sensu backend log level and view logs.

## Configuring Tessen

You can use the [Tessen API][2] and [sensuctl][3] to view and manage Tessen configuration.
Tessen is enabled by default on Sensu backends and required for [licensed][4] Sensu instances.
To manage Tessen configuration using sensuctl, configure sensuctl as the default [`admin` user][6].

To see the status of Tessen:

{{< highlight shell >}}
sensuctl tessen info
{{< /highlight >}}

To opt out of Tessen:

{{< highlight shell >}}
sensuctl tessen opt-out
{{< /highlight >}}

_NOTE: [Licensed][4] Sensu instances override Tessen configuration to opt in at runtime._

You can use the `--skip-confirm` flag to skip the confirmation step.

{{< highlight shell >}}
sensuctl tessen opt-out --skip-confirm
{{< /highlight >}}

To opt in to Tessen:

{{< highlight shell >}}
sensuctl tessen opt-in
{{< /highlight >}}

## Tessen specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute specifying the [`sensuctl create`][sc] resource type. Tessen configuration should always be of type `TessenConfig`.
required     | Required for Tessen configuration in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"type": "TessenConfig"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute specifying the Sensu API group and version. For Tessen configuration in this version of Sensu, this attribute should always be `core/v2`.
required     | Required for Tessen configuration in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"api_version": "core/v2"{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes Tessen configuration [spec attributes][sp].
required     | Required for Tessen configuration in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"spec": {
  "opt_out": false
}
{{< /highlight >}}

### Spec attributes

opt_out      | 
-------------|------ 
description  | Set to `false` to enable Tessen; set to `true` to opt out of Tessen. [Licensed][4] Sensu instances override the `opt_out` attribute to `false` at runtime.
required     | true
default      | `false`
type         | Boolean
example      | {{< highlight shell >}}opt_out": false{{< /highlight >}}

## Tessen configuration example

The following example is in `wrapped-json`format for use with [`sensuctl create`][sc].
To manage Tessen using the [Tessen API][2], use non-wrapped `json` format as shown in the [API docs][2].

{{< language-toggle >}}

{{< highlight yml >}}
type: TessenConfig
api_version: core/v2
spec:
  opt_out: false
{{< /highlight >}}

{{< highlight json >}}
{
  "type": "TessenConfig",
  "api_version": "core/v2",
  "spec": {
    "opt_out": false
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

## Tessen payload example

If opted in to Tessen, there are various metrics that get sent back to the Tessen service. In the example payload below, you can see that the number of check hooks is sent back to the Tessen service. 

{{< highlight json >}}
{
    "component": "tessend",
    "level": "debug",
    "metric_name": "hook_count",
    "metric_value": 2,
    "msg": "collected a metric for tessen",
    "time": "2019-09-16T09:02:11Z"
}
{{< /highlight >}}

There are other metrics sent on, such as the number of handlers:

{{< highlight json >}}
{
    "component": "tessend",
    "level": "debug",
    "metric_name": "handler_count",
    "metric_value": 10,
    "msg": "collected a metric for tessen",
    "time": "2019-09-16T09:02:06Z"
}
{{< /highlight >}}

Or the number of filters:

{{< highlight json >}}
{
    "component": "tessend",
    "level": "debug",
    "metric_name": "filter_count",
    "metric_value": 4,
    "msg": "collected a metric for tessen",
    "time": "2019-09-16T09:02:01Z"
}
{{< /highlight >}}

If opted into Tessen, all of the metrics and payloads sent are avaiable to view in the logs, which you can view via `journalctl -u sensu-backend.service`. If you'd like to view the events on-disk, please see the [guide on configuring systemd to log to disk][systemd-logs].

[1]: https://blog.sensu.io/announcing-tessen-the-sensu-call-home-service
[2]: ../../api/tessen
[3]: ../../sensuctl/reference
[4]: ../license
[5]: ../../guides/troubleshooting
[6]: ../../reference/rbac#default-user
[sc]: ../../sensuctl/reference#creating-resources
[sp]: #spec-attributes
[systemd-logs]: ../../guides/systemd-logs
