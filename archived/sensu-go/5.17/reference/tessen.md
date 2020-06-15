---
title: "Tessen"
description: "Tessen sends anonymized data about Sensu instances to Sensu Inc. You can use sensuctl to view and manage Tessen configuration. Read the reference to configure Tessen."
weight: 170
version: "5.17"
product: "Sensu Go"
menu: 
  sensu-go-5.17:
    parent: reference
---

- [Configure Tessen](#configure-tessen)
- [Tessen specification](#tessen-specification)
  - [Top-level attributes](#top-level-attributes) | [Spec attributes](#spec-attributes)
- [Tessen configuration example](#tessen-configuration-example)
- [Tessen payload example](#tessen-payload-example)

Tessen is the Sensu call-home service.
It is enabled by default on Sensu backends.
Tessen sends anonymized data about Sensu instances to Sensu Inc., including the version, cluster size, number of events processed, and number of resources created (like checks and handlers).
We rely on Tessen data to understand how Sensu is being used and make informed decisions about product improvements.
Read [Announcing Tessen, the Sensu call-home service][1] to learn more about Tessen.

All data submissions are logged for complete transparency at the `info` log level and transmitted over HTTPS.
See [Troubleshooting][5] to set the Sensu backend log level and view logs.

## Configure Tessen

You can use the [Tessen API][2] and [sensuctl][3] to view and manage Tessen configuration.
Tessen is enabled by default on Sensu backends and required for [licensed][4] Sensu instances.
To manage Tessen configuration with sensuctl, configure sensuctl as the default [`admin` user][6].

To see Tessen status:

{{< highlight shell >}}
sensuctl tessen info
{{< /highlight >}}

To opt out of Tessen:

{{< highlight shell >}}
sensuctl tessen opt-out
{{< /highlight >}}

_**NOTE**: [Licensed][4] Sensu instances override Tessen configuration to opt in at runtime._

You can use the `--skip-confirm` flag to skip the confirmation step:

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
description  | Top-level attribute that specifies the [`sensuctl create`][7] resource type. Tessen configuration should always be type `TessenConfig`.
required     | Required for Tessen configuration in `wrapped-json` or `yaml` format for use with [`sensuctl create`][7].
type         | String
example      | {{< highlight shell >}}"type": "TessenConfig"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For Tessen configuration in this version of Sensu, the `api_version` should always be `core/v2`.
required     | Required for Tessen configuration in `wrapped-json` or `yaml` format for use with [`sensuctl create`][7].
type         | String
example      | {{< highlight shell >}}"api_version": "core/v2"{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes Tessen configuration [spec attributes][8].
required     | Required for Tessen configuration in `wrapped-json` or `yaml` format for use with [`sensuctl create`][7].
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"spec": {
  "opt_out": false
}
{{< /highlight >}}

### Spec attributes

opt_out      | 
-------------|------ 
description  | `true` to opt out of Tessen. Otherwise, `false`. [Licensed][4] Sensu instances override the `opt_out` attribute to `false` at runtime.
required     | true
type         | Boolean
default      | `false`
example      | {{< highlight shell >}}opt_out": false{{< /highlight >}}

## Tessen configuration example

This example is in `wrapped-json`format for use with [`sensuctl create`][7].
To manage Tessen with the [Tessen API][2], use non-wrapped `json` format as shown in the [API docs][2].

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

If you opt in to Tessen, Sensu sends various metrics back to the Tessen service.
In the example payload below, Sensu is sending the number of check hooks back to the Tessen service. 

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

Sensu also sends other metrics, such as the number of handlers:

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

If you opt into Tessen, you can view all of the metrics and payloads in the logs:

{{< highlight shell >}}
journalctl _COMM=sensu-backend.service
{{< /highlight >}}

To view the events on-disk, see [Log Sensu services with systemd][9].

[1]: https://blog.sensu.io/announcing-tessen-the-sensu-call-home-service
[2]: ../../api/tessen/
[3]: ../../sensuctl/reference/
[4]: ../license/
[5]: ../../guides/troubleshooting
[6]: ../../reference/rbac#default-users
[7]: ../../sensuctl/reference#create-resources
[8]: #spec-attributes
[9]: ../../guides/systemd-logs/
