---
title: "Tessen reference"
linkTitle: "Tessen Reference"
reference_title: "Tessen"
type: "reference"
description: "Tessen sends anonymized data about Sensu instances to Sensu Inc. You can use sensuctl to view and manage Tessen configuration. Read this document to configure Tessen."
weight: 40
version: "6.3"
product: "Sensu Go"
menu: 
  sensu-go-6.3:
    parent: monitor-sensu
---

Tessen is the Sensu call-home service.
It is enabled by default on Sensu backends.
Tessen sends anonymized data about Sensu instances to Sensu Inc., including the version, cluster size, number of events processed, and number of resources created (like checks and handlers).
We rely on Tessen data to understand how Sensu is being used and make informed decisions about product improvements.
Read [Announcing Tessen, the Sensu call-home service][1] to learn more about Tessen.

All data submissions are logged for complete transparency at the `info` log level and transmitted over HTTPS.
See [Troubleshooting][5] to set the Sensu backend log level and view logs.

## Configure Tessen

You can use the [Tessen API][2] and [sensuctl][3] to view your Tessen configuration.
If you are using an unlicensed Sensu instances, you can also use the [Tessen API][2] and [sensuctl][3] to opt in or opt out of Tessen.

{{% notice note %}}
**NOTE**: Tessen is enabled by default on Sensu backends and required for [licensed](../../maintain-sensu/license/) Sensu instances.
If you have a licensed instance and want to opt out of Tessen, contact your account manager.
{{% /notice %}}

To manage Tessen configuration for your unlicensed instance with sensuctl, configure sensuctl as the default [`admin` user][6].

To see Tessen status:

{{< code shell >}}
sensuctl tessen info
{{< /code >}}

To opt out of Tessen:

{{< code shell >}}
sensuctl tessen opt-out
{{< /code >}}

{{% notice note %}}
**NOTE**: For [licensed](../../maintain-sensu/license/) Sensu instances, the Tessen configuration setting will automatically override to `opt-in` at runtime.
{{% /notice %}}

You can use the `--skip-confirm` flag to skip the confirmation step:

{{< code shell >}}
sensuctl tessen opt-out --skip-confirm
{{< /code >}}

To opt in to Tessen:

{{< code shell >}}
sensuctl tessen opt-in
{{< /code >}}

## Tessen specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][7] resource type. Tessen configuration should always be type `TessenConfig`.
required     | Required for Tessen configuration in `wrapped-json` or `yaml` format for use with [`sensuctl create`][7].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: TessenConfig
{{< /code >}}
{{< code json >}}
{
  "type": "TessenConfig"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For Tessen configuration in this version of Sensu, the `api_version` should always be `core/v2`.
required     | Required for Tessen configuration in `wrapped-json` or `yaml` format for use with [`sensuctl create`][7].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: core/v2
{{< /code >}}
{{< code json >}}
{
  "api_version": "core/v2"
}
{{< /code >}}
{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes Tessen configuration [spec attributes][8].
required     | Required for Tessen configuration in `wrapped-json` or `yaml` format for use with [`sensuctl create`][7].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  opt_out: false
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "opt_out": false
    }
}
{{< /code >}}
{{< /language-toggle >}}

### Spec attributes

opt_out      | 
-------------|------ 
description  | `true` to opt out of Tessen. Otherwise, `false`. Tessen is enabled by default on Sensu backends and required for [licensed][4] Sensu instances.
required     | true
type         | Boolean
default      | `false`
example      | {{< language-toggle >}}
{{< code yml >}}
opt_out: false
{{< /code >}}
{{< code json >}}
{
  "opt_out": false
}
{{< /code >}}
{{< /language-toggle >}}

## Tessen configuration example

This example is in `wrapped-json`format for use with [`sensuctl create`][7].
To manage Tessen for unlicensed Sensu instances with the [Tessen API][2], use non-wrapped `json` format as shown in the [API docs][2].

{{< language-toggle >}}

{{< code yml >}}
---
type: TessenConfig
api_version: core/v2
spec:
  opt_out: false
{{< /code >}}

{{< code json >}}
{
  "type": "TessenConfig",
  "api_version": "core/v2",
  "spec": {
    "opt_out": false
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Tessen metrics log examples

For unlicensed instances that opt in to Tessen and all licensed instances, Sensu sends various metrics back to the Tessen service.
In the example metrics log below, Sensu is sending the number of check hooks back to the Tessen service. 

{{< code json >}}
{
    "component": "tessend",
    "level": "debug",
    "metric_name": "hook_count",
    "metric_value": 2,
    "msg": "collected a metric for tessen",
    "time": "2019-09-16T09:02:11Z"
}
{{< /code >}}

Sensu also sends other metrics, such as the number of handlers:

{{< code json >}}
{
    "component": "tessend",
    "level": "debug",
    "metric_name": "handler_count",
    "metric_value": 10,
    "msg": "collected a metric for tessen",
    "time": "2019-09-16T09:02:06Z"
}
{{< /code >}}

Or the number of filters:

{{< code json >}}
{
    "component": "tessend",
    "level": "debug",
    "metric_name": "filter_count",
    "metric_value": 4,
    "msg": "collected a metric for tessen",
    "time": "2019-09-16T09:02:01Z"
}
{{< /code >}}

Or the number of authentication providers, secrets providers, and secrets:

{{< code json >}}
{
    "component": "tessend",
    "level": "debug",
    "metric_name": "auth_provider_count",
    "metric_value": 2,
    "msg": "collected a metric for tessen",
    "time": "2020-03-30T15:16:42-04:00"
}
{{< /code >}}

{{< code json >}}
{
    "component": "tessend",
    "level": "debug",
    "metric_name": "secret_provider_count",
    "metric_value": 1,
    "msg": "collected a metric for tessen",
    "time": "2020-03-30T15:17:12-04:00"
}
{{< /code >}}

{{< code json >}}
{
    "component": "tessend",
    "level": "debug",
    "metric_name": "secret_count",
    "metric_value": 1,
    "msg": "collected a metric for tessen",
    "time": "2020-03-30T15:16:17-04:00"
}
{{< /code >}}

If you opt into Tessen, you can view all of the metrics in the logs:

{{< code shell >}}
journalctl _COMM=sensu-backend.service
{{< /code >}}

To view the events on-disk, see [Log Sensu services with systemd][9].

[1]: https://sensu.io/blog/announcing-tessen-the-sensu-call-home-service
[2]: ../../../api/tessen/
[3]: ../../../sensuctl/
[4]: ../../maintain-sensu/license/
[5]: ../../maintain-sensu/troubleshoot
[6]: ../../control-access/rbac#default-users
[7]: ../../../sensuctl/create-manage-resources/#create-resources
[8]: #spec-attributes
[9]: ../log-sensu-systemd/
