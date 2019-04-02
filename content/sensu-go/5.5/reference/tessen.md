---
title: "Tessen"
description: "Tessens sends anonymized data about the Sensu instance to Sensu Inc. You can use sensuctl to view and manage the Tessen configuration. Read the reference to configure Tessen."
weight: 10
version: "5.5"
product: "Sensu Go"
menu: 
  sensu-go-5.5:
    parent: reference
---

- [Configuring Tessen](#configuring-tessen)
- [Specification](#tessen-specification)
- [Example](#tessen-example)

## What is Tessen?

Tessen is the Sensu call-home service.
Included with every Sensu backend, Tessen sends anonymized data about the Sensu instance to Sensu Inc. every six hours, including:

- The Sensu version
- The number of Sensu agents and backends in the cluster
- Whether the Sensu instance uses an [enterprise license][4]

All data submissions are logged for complete transparency and transmitted over HTTPS.
[Read the blog post][1] to learn more about Tessen.

## Configuring Tessen

Tessen is enabled by default.
You can use the [Tessen API][2] and [sensuctl][3] to view and manage the Tessen configuration.
[Licensed][4] Sensu instances cannot opt out of Tessen.

To see the status of Tessen:

{{< highlight shell >}}
tessen info
{{< /highlight >}}

To opt-out of Tessen:

{{< highlight shell >}}
tessen opt-out
{{< /highlight >}}

To opt-in to Tessen:

{{< highlight shell >}}
tessen opt-in
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
description  | Top-level attribute specifying the Sensu API group and version. For Tessen configuration in Sensu backend version 5.5, this attribute should always be `core/v2`.
required     | Required for Tessen configuration in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"api_version": "core/v2"{{< /highlight >}}

metadata     | 
-------------|------
description  | Empty, top-level scope
required     | Required for Tessen configuration in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | Map
example      | {{< highlight shell >}}
"metadata": {}
{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes the Tessen configuration [spec attributes][sp].
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
description  | Set to `false` to enable Tessen; set to `true` to opt out of Tessen. [Licensed][4] Sensu instances cannot opt out of Tessen.
required     | true
default      | `false`
type         | Boolean
example      | {{< highlight shell >}}opt_out": false{{< /highlight >}}

## Tessen example

The following example is in `wrapped-json`format for use with [`sensuctl create`][sc].
To manage Tessen using the [Tessen API][2], use non-wrapped `json` format as shown in the [API docs][2].

{{< highlight json >}}
{
  "type": "TessenConfig",
  "api_version": "core/v2",
  "metadata": {},
  "spec": {
    "opt_out": false
  }
}
{{< /highlight >}}

[1]: https://blog.sensu.io/announcing-tessen-the-sensu-call-home-service
[2]: ../../api/tessen
[3]: ../../sensuctl/reference
[4]: ../license
[sc]: ../../sensuctl/reference#creating-resources
[sp]: #spec-attributes
