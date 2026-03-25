---
title: "Assets reference"
linkTitle: "Assets Reference"
reference_title: "Assets"
type: "reference"
description: "Use Sensu's dynamic runtime assets to provide the plugins, libraries, and runtimes you need to create automated monitoring and observability workflows."
weight: 20
version: "6.11"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-6.11:
    parent: plugins
---

Dynamic runtime assets are shareable, reusable packages that make it easier to deploy Sensu [plugins][29].
You can use dynamic runtime assets to provide the plugins, libraries, and runtimes you need to automate your monitoring workflows.
Sensu supports dynamic runtime assets for [checks][6], [filters][7], [mutators][8], and [handlers][9].

Use the [Sensu Catalog][33] to find, configure, and install many dynamic runtime assets directly from your browser.
Follow the Catalog prompts to configure the Sensu resources you need and start processing your observability data with a few clicks.

You can also discover, download, and share dynamic runtime assets using [Bonsai, the Sensu asset hub][16].
Read [Use assets to install plugins][23] to get started.

{{% notice note %}}
**NOTE**: Dynamic runtime assets are not required to use Sensu Go.
You can install Sensu plugins using the [sensu-install](../install-plugins/#install-plugins-with-the-sensu-install-tool) tool or a [configuration management](../../operations/deploy-sensu/configuration-management/) solution.
{{% /notice %}}

The Sensu backend executes handler, filter, and mutator dynamic runtime assets.
The Sensu agent executes check dynamic runtime assets.
At runtime, the backend or agent sequentially evaluates dynamic runtime assets that appear in the `runtime_assets` attribute of the handler, filter, mutator, or check being executed.

## Dynamic runtime asset example (minimum required attributes)

This example shows a dynamic runtime asset resource definition that includes the minimum required attributes:

{{< language-toggle >}}

{{< code yml >}}
---
type: Asset
api_version: core/v2
metadata:
  name: check_script
spec:
  builds:
  - sha512: 4f926bf4328fbad2b9cac873d117f771914f4b837c9c85584c38ccf55a3ef3c2e8d154812246e5dda4a87450576b2c58ad9ab40c9e2edc31b288d066b195b21b
    url: http://example.com/asset.tar.gz
{{< /code >}}

{{< code json >}}
{
  "type": "Asset",
  "api_version": "core/v2",
  "metadata": {
    "name": "check_script"
  },
  "spec": {
    "builds": [
      {
        "url": "http://example.com/asset.tar.gz",
        "sha512": "4f926bf4328fbad2b9cac873d117f771914f4b837c9c85584c38ccf55a3ef3c2e8d154812246e5dda4a87450576b2c58ad9ab40c9e2edc31b288d066b195b21b"
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Install location for dynamic runtime assets

If you use a Sensu [package][32], dynamic runtime assets are installed at `/var/cache` (Linux) or `C:\ProgramData\Sensu\cache\sensu-agent` (Windows).

If you use a Sensu [Docker image][31], dynamic runtime assets are installed at `/var/lib`.

## Dynamic runtime asset builds

A dynamic runtime asset build is the combination of an artifact URL, SHA512 checksum, and optional [Sensu query expression][1] filters.
Each asset definition may describe one or more builds.

{{% notice note %}}
**NOTE**: Dynamic runtime assets that provide `url` and `sha512` attributes at the top level of the `spec` scope are [single-build assets](#asset-example-single-build-deprecated), and this form of asset defintion is deprecated.
We recommend using [multiple-build asset defintions](#asset-example-multiple-builds), which specify one or more `builds` under the `spec` scope.
{{% /notice %}}

### Asset example: Multiple builds

This example shows the resource definition for the [sensu/check-cpu-usage][46] dynamic runtime asset, which has multiple builds:

{{< language-toggle >}}

{{< code yml >}}
---
type: Asset
api_version: core/v2
metadata:
  name: check-cpu-usage
  labels: 
  annotations:
    io.sensu.bonsai.url: https://bonsai.sensu.io/assets/sensu/check-cpu-usage
    io.sensu.bonsai.api_url: https://bonsai.sensu.io/api/v1/assets/sensu/check-cpu-usage
    io.sensu.bonsai.tier: Community
    io.sensu.bonsai.version: 0.2.2
    io.sensu.bonsai.namespace: sensu
    io.sensu.bonsai.name: check-cpu-usage
    io.sensu.bonsai.tags: ''
spec:
  builds:
  - url: https://assets.bonsai.sensu.io/a7ced27e881989c44522112aa05dd3f25c8f1e49/check-cpu-usage_0.2.2_windows_amd64.tar.gz
    sha512: 900cfdf28d6088b929c4bf9a121b628971edee5fa5cbc91a6bc1df3bd9a7f8adb1fcfb7b1ad70589ed5b4f5ec87d9a9a3ba95bcf2acda56b0901406f14f69fe7
    filters:
    - entity.system.os == 'windows'
    - entity.system.arch == 'amd64'
  - url: https://assets.bonsai.sensu.io/a7ced27e881989c44522112aa05dd3f25c8f1e49/check-cpu-usage_0.2.2_darwin_amd64.tar.gz
    sha512: db81ee70426114e4cd4b3f180f2b0b1e15b4bffc09d7f2b41a571be2422f4399af3fbd2fa2918b8831909ab4bc2d3f58d0aa0d7b197d3a218b2391bb5c1f6913
    filters:
    - entity.system.os == 'darwin'
    - entity.system.arch == 'amd64'
  - url: https://assets.bonsai.sensu.io/a7ced27e881989c44522112aa05dd3f25c8f1e49/check-cpu-usage_0.2.2_linux_armv7.tar.gz
    sha512: 400aacce297176e69f3a88b0aab0ddfdbe9dd6a37a673cb1774c8d4750a91cf7713a881eef26ea21d200f74cb20818161c773490139e6a6acb92cbd06dee994c
    filters:
    - entity.system.os == 'linux'
    - entity.system.arch == 'armv7'
  - url: https://assets.bonsai.sensu.io/a7ced27e881989c44522112aa05dd3f25c8f1e49/check-cpu-usage_0.2.2_linux_arm64.tar.gz
    sha512: bef7802b121ac2a2a5c5ad169d6003f57d8b4f5e83eae998a0e0dd1e7b89678d4a62e678d153edacdd65fd1d0123b5f51308622690455e77cec6deccfa183397
    filters:
    - entity.system.os == 'linux'
    - entity.system.arch == 'arm64'
  - url: https://assets.bonsai.sensu.io/a7ced27e881989c44522112aa05dd3f25c8f1e49/check-cpu-usage_0.2.2_linux_386.tar.gz
    sha512: a2dcb5324952567a61d76a2e331c1c16df69ef0e0b9899515dad8d1531b204076ad0c008f59fc2f4735a5a779afb0c1baa132268c41942b203444e377fe8c8e5
    filters:
    - entity.system.os == 'linux'
    - entity.system.arch == '386'
  - url: https://assets.bonsai.sensu.io/a7ced27e881989c44522112aa05dd3f25c8f1e49/check-cpu-usage_0.2.2_linux_amd64.tar.gz
    sha512: 24539739b5eb19bbab6eda151d0bcc63a0825afdfef3bc1ec3670c7b0a00fbbb2fd006d605a7a038b32269a22026d8947324f2bc0acdf35e8563cf4cb8660d7f
    filters:
    - entity.system.os == 'linux'
    - entity.system.arch == 'amd64'
{{< /code >}}

{{< code json >}}
{
  "type": "Asset",
  "api_version": "core/v2",
  "metadata": {
    "name": "check-cpu-usage",
    "labels": null,
    "annotations": {
      "io.sensu.bonsai.url": "https://bonsai.sensu.io/assets/sensu/check-cpu-usage",
      "io.sensu.bonsai.api_url": "https://bonsai.sensu.io/api/v1/assets/sensu/check-cpu-usage",
      "io.sensu.bonsai.tier": "Community",
      "io.sensu.bonsai.version": "0.2.2",
      "io.sensu.bonsai.namespace": "sensu",
      "io.sensu.bonsai.name": "check-cpu-usage",
      "io.sensu.bonsai.tags": ""
    }
  },
  "spec": {
    "builds": [
      {
        "url": "https://assets.bonsai.sensu.io/a7ced27e881989c44522112aa05dd3f25c8f1e49/check-cpu-usage_0.2.2_windows_amd64.tar.gz",
        "sha512": "900cfdf28d6088b929c4bf9a121b628971edee5fa5cbc91a6bc1df3bd9a7f8adb1fcfb7b1ad70589ed5b4f5ec87d9a9a3ba95bcf2acda56b0901406f14f69fe7",
        "filters": [
          "entity.system.os == 'windows'",
          "entity.system.arch == 'amd64'"
        ]
      },
      {
        "url": "https://assets.bonsai.sensu.io/a7ced27e881989c44522112aa05dd3f25c8f1e49/check-cpu-usage_0.2.2_darwin_amd64.tar.gz",
        "sha512": "db81ee70426114e4cd4b3f180f2b0b1e15b4bffc09d7f2b41a571be2422f4399af3fbd2fa2918b8831909ab4bc2d3f58d0aa0d7b197d3a218b2391bb5c1f6913",
        "filters": [
          "entity.system.os == 'darwin'",
          "entity.system.arch == 'amd64'"
        ]
      },
      {
        "url": "https://assets.bonsai.sensu.io/a7ced27e881989c44522112aa05dd3f25c8f1e49/check-cpu-usage_0.2.2_linux_armv7.tar.gz",
        "sha512": "400aacce297176e69f3a88b0aab0ddfdbe9dd6a37a673cb1774c8d4750a91cf7713a881eef26ea21d200f74cb20818161c773490139e6a6acb92cbd06dee994c",
        "filters": [
          "entity.system.os == 'linux'",
          "entity.system.arch == 'armv7'"
        ]
      },
      {
        "url": "https://assets.bonsai.sensu.io/a7ced27e881989c44522112aa05dd3f25c8f1e49/check-cpu-usage_0.2.2_linux_arm64.tar.gz",
        "sha512": "bef7802b121ac2a2a5c5ad169d6003f57d8b4f5e83eae998a0e0dd1e7b89678d4a62e678d153edacdd65fd1d0123b5f51308622690455e77cec6deccfa183397",
        "filters": [
          "entity.system.os == 'linux'",
          "entity.system.arch == 'arm64'"
        ]
      },
      {
        "url": "https://assets.bonsai.sensu.io/a7ced27e881989c44522112aa05dd3f25c8f1e49/check-cpu-usage_0.2.2_linux_386.tar.gz",
        "sha512": "a2dcb5324952567a61d76a2e331c1c16df69ef0e0b9899515dad8d1531b204076ad0c008f59fc2f4735a5a779afb0c1baa132268c41942b203444e377fe8c8e5",
        "filters": [
          "entity.system.os == 'linux'",
          "entity.system.arch == '386'"
        ]
      },
      {
        "url": "https://assets.bonsai.sensu.io/a7ced27e881989c44522112aa05dd3f25c8f1e49/check-cpu-usage_0.2.2_linux_amd64.tar.gz",
        "sha512": "24539739b5eb19bbab6eda151d0bcc63a0825afdfef3bc1ec3670c7b0a00fbbb2fd006d605a7a038b32269a22026d8947324f2bc0acdf35e8563cf4cb8660d7f",
        "filters": [
          "entity.system.os == 'linux'",
          "entity.system.arch == 'amd64'"
        ]
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

### Asset example: Single build (deprecated)

This example shows the resource definition for a dynamic runtime asset with a single build:

{{< language-toggle >}}

{{< code yml >}}
---
type: Asset
api_version: core/v2
metadata:
  name: check_cpu_linux_amd64
  labels:
    origin: bonsai
  annotations:
    project_url: https://bonsai.sensu.io/assets/asachs01/sensu-go-cpu-check
    version: 0.0.3
spec:
  url: https://assets.bonsai.sensu.io/981307deb10ebf1f1433a80da5504c3c53d5c44f/sensu-go-cpu-check_0.0.3_linux_amd64.tar.gz
  sha512: 487ab34b37da8ce76d2657b62d37b35fbbb240c3546dd463fa0c37dc58a72b786ef0ca396a0a12c8d006ac7fa21923e0e9ae63419a4d56aec41fccb574c1a5d3
  filters:
  - entity.system.os == 'linux'
  - entity.system.arch == 'amd64'
  headers:
    Authorization: 'Bearer {{ .annotations.asset_token | default "N/A" }}'
    X-Forwarded-For: client1, proxy1, proxy2
{{< /code >}}

{{< code json >}}
{
  "type": "Asset",
  "api_version": "core/v2",
  "metadata": {
    "name": "check_cpu_linux_amd64",
    "labels": {
      "origin": "bonsai"
    },
    "annotations": {
      "project_url": "https://bonsai.sensu.io/assets/asachs01/sensu-go-cpu-check",
      "version": "0.0.3"
    }
  },
  "spec": {
    "url": "https://assets.bonsai.sensu.io/981307deb10ebf1f1433a80da5504c3c53d5c44f/sensu-go-cpu-check_0.0.3_linux_amd64.tar.gz",
    "sha512": "487ab34b37da8ce76d2657b62d37b35fbbb240c3546dd463fa0c37dc58a72b786ef0ca396a0a12c8d006ac7fa21923e0e9ae63419a4d56aec41fccb574c1a5d3",
    "filters": [
      "entity.system.os == 'linux'",
      "entity.system.arch == 'amd64'"
    ],
    "headers": {
      "Authorization": "Bearer {{ .annotations.asset_token | default \"N/A\" }}",
      "X-Forwarded-For": "client1, proxy1, proxy2"
    }
  }
}
{{< /code >}}

{{< /language-toggle >}}

### Dynamic runtime asset build evaluation

For each build provided in a dynamic runtime asset, Sensu will evaluate any defined filters to determine whether any build matches the agent or backend service's environment.
If all filters specified on a build evaluate to `true`, that build is considered a match.
For dynamic runtime assets with multiple builds, only the first build that matches will be downloaded and installed.

### Dynamic runtime asset build download

Sensu downloads the dynamic runtime asset build on the host system where the asset contents are needed to execute the requested command.
For example, if a check definition references a dynamic runtime asset, the Sensu agent that executes the check will download the asset the first time it executes the check.
The dynamic runtime asset build the agent downloads will depend on the filter rules associated with each build defined for the asset.

Sensu backends follow a similar process when pipeline elements (filters, mutators, and handlers) request dynamic runtime asset installation as part of operation.

{{% notice note %}}
**NOTE**: Dynamic runtime asset builds are not downloaded until they are needed for command execution.
{{% /notice %}}

When Sensu finds a matching build, it downloads the build artifact from the specified URL.
If the asset definition includes headers, they are passed along as part of the HTTP request.
If the downloaded artifact's SHA512 checksum matches the checksum provided by the build, it is unpacked into the Sensu service's local cache directory.

Set the backend or agent's local cache path with the `cache-dir` configuration option.
Disable dynamic runtime assets for an agent with the agent [`disable-assets`][30] configuration option.

{{% notice note %}}
**NOTE**: Dynamic runtime asset builds are unpacked into the cache directory that is configured with the `cache-dir` configuration option.
{{% /notice %}}

Use the `assets-rate-limit` and `assets-burst-limit` configuration options for the [agent][40] and [backend][41] to configure a global rate limit for fetching dynamic runtime assets.

### Dynamic runtime asset build execution

The directory path of each dynamic runtime asset listed in a check, event filter, handler, or mutator resource's `runtime_assets` array is appended to the `PATH` before the resource's `command` is executed.
Subsequent check, event filter, handler, or mutator executions look for the dynamic runtime asset in the local cache and ensure that the contents match the configured checksum.

The following example demonstrates a use case with a Sensu check resource and an asset:

{{< language-toggle >}}

{{< code yml >}}
---
type: Asset
api_version: core/v2
metadata:
  name: sensu-prometheus-collector
spec:
  builds:
  - url: https://assets.bonsai.sensu.io/ef812286f59de36a40e51178024b81c69666e1b7/sensu-prometheus-collector_1.1.6_linux_amd64.tar.gz
    sha512: a70056ca02662fbf2999460f6be93f174c7e09c5a8b12efc7cc42ce1ccb5570ee0f328a2dd8223f506df3b5972f7f521728f7bdd6abf9f6ca2234d690aeb3808
    filters:
    - entity.system.os == 'linux'
    - entity.system.arch == 'amd64'
---
type: CheckConfig
api_version: core/v2
metadata:
  name: prometheus_collector
spec:
  command: "sensu-prometheus-collector -prom-url http://localhost:9090 -prom-query up"
  interval: 10
  publish: true
  output_metric_handlers:
  - influxdb
  output_metric_format: influxdb_line
  runtime_assets:
  - sensu-prometheus-collector
  subscriptions:
  - system
{{< /code >}}

{{< code json "JSON" >}}
{
  "type": "Asset",
  "api_version": "core/v2",
  "metadata": {
    "name": "sensu-email-handler"
  },
  "spec": {
    "builds": [
      {
        "url": "https://assets.bonsai.sensu.io/45eaac0851501a19475a94016a4f8f9688a280f6/sensu-email-handler_0.2.0_linux_amd64.tar.gz",
        "sha512": "d69df76612b74acd64aef8eed2ae10d985f6073f9b014c8115b7896ed86786128c20249fd370f30672bf9a11b041a99adb05e3a23342d3ad80d0c346ec23a946",
        "filters": [
          "entity.system.os == 'linux'",
          "entity.system.arch == 'amd64'"
        ]
      }
    ]
  }
}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "prometheus_collector"
  },
  "spec": {
    "command": "sensu-prometheus-collector -prom-url http://localhost:9090 -prom-query up",
    "handlers": [
    "influxdb"
    ],
    "interval": 10,
    "publish": true,
    "output_metric_format": "influxdb_line",
    "runtime_assets": [
      "sensu-prometheus-collector"
    ],
    "subscriptions": [
      "system"
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Dynamic runtime asset format specification

Sensu expects a dynamic runtime asset to be a tar archive (optionally gzipped) that contains one or more executables within a bin folder.
Any scripts or executables should be within a `bin/` folder in the archive.
Read the [Sensu Go Plugin template][28] for an example dynamic runtime asset and Bonsai configuration.

The following are injected into the execution context:

- `{PATH_TO_ASSET}/bin` is injected into the `PATH` environment variable
- `{PATH_TO_ASSET}/lib` is injected into the `LD_LIBRARY_PATH` environment variable
- `{PATH_TO_ASSET}/include` is injected into the `CPATH` environment variable

{{% notice note %}}
**NOTE**: You cannot create a dynamic runtime asset by creating an archive of an existing project (as in previous versions of Sensu for plugins from the [Sensu Plugins community](https://github.com/sensu-plugins/)).
Follow the steps outlined in [Contributing Assets for Existing Ruby Sensu Plugins](https://discourse.sensu.io/t/contributing-assets-for-existing-ruby-sensu-plugins/1165), a Sensu Discourse guide.
For further examples of Sensu users who have added the ability to use a community plugin as a dynamic runtime asset, read [this Discourse post](https://discourse.sensu.io/t/how-to-use-the-sensu-plugins-kubernetes-plugin/1286).
{{% /notice %}}

### Default cache directory

system  | sensu-backend                         | sensu-agent
--------|---------------------------------------|-------------
Linux   | `/var/cache/sensu/sensu-backend`      | `/var/cache/sensu/sensu-agent`
Windows | N/A                                   | `C:\ProgramData\sensu\cache\sensu-agent`

If the requested dynamic runtime asset is not in the local cache, it is downloaded from the asset URL.
The Sensu backend acts as an index of dynamic runtime asset builds, and does not provide storage or hosting for the build artifacts.
Sensu expects dynamic runtime assets to be retrieved over HTTP or HTTPS.

### Example dynamic runtime asset structure

{{< code text >}}
sensu-example-handler_1.0.0_linux_amd64
├── CHANGELOG.md
├── LICENSE
├── README.md
└── bin
  └── my-check.sh
└── lib
└── include
{{< /code >}}

## Dynamic runtime asset path

When you download and install a dynamic runtime asset, the asset files are saved to a local path on disk.
Most of the time, you won't need to know this path &mdash; except in cases where you need to provide the full path to dynamic runtime asset files as part of a command argument.

The dynamic runtime asset directory path includes the asset's checksum, which changes every time underlying asset artifacts are updated.
This would normally require you to manually update the commands for any of your checks, handlers, hooks, or mutators that consume the dynamic runtime asset.
However, because the dynamic runtime asset directory path is exposed to asset consumers via [environment variables][14] and the [`assetPath` custom function][17], you can avoid these manual updates.

You can retrieve the dynamic runtime asset's path as an environment variable in the `command` context for checks, handlers, hooks, and mutators.
Token substitution with the `assetPath` custom function is only available for check and hook commands.

The Sensu Windows agent uses `cmd.exe` for the check execution environment.
For all other operating systems, the Sensu agent uses the Bourne shell (sh).

### Environment variables for dynamic runtime asset paths

For each dynamic runtime asset, a corresponding environment variable will be available in the `command` context.

Sensu generates the environment variable name by capitalizing the dynamic runtime asset's complete name, replacing any special characters with underscores, and appending the `_PATH` suffix.
The value of the variable will be the path on disk where the dynamic runtime asset build has been unpacked.

Each asset page in Bonsai lists the asset's complete name.
This example shows where the complete name for the [sensu/http-checks][22] dynamic runtime asset is located in Bonsai:

{{< figure src="/images/go/assets_reference/complete_name_location_bonsai_asset_paths.png" alt="Bonsai page for the Sensu http-checks dynamic runtime asset showing the location of the asset namespace and name" link="/images/go/assets_reference/complete_name_location_bonsai_asset_paths.png" target="_blank" >}}

An asset's complete name includes both the part before the forward slash (sometimes called the Bonsai namespace) and the part after the forward slash.

Consequently, the environment variable for the [sensu/http-checks][22] asset path is:

{{< code shell >}}
SENSU_HTTP_CHECKS_PATH
{{< /code >}}

#### Linux environment variable example

The Linux environment interprets the content between the `${` and `}` characters as an environment variable name and will substitute the value of that environment variable.

For example, to reference the path for the [sensu/http-checks][22] asset in your checks, handlers, hooks, and mutators:

{{< code shell >}}
${SENSU_HTTP_CHECKS_PATH}
{{< /code >}}

#### Windows environment variable example

The Windows console environment interprets the content between [paired `%` characters][44] as an environment variable name and will substitute the value of that [environment variable][45].

For example, to reference the path for the [sensu/sensu-windows-powershell-checks][4] asset in your checks, handlers, hooks, and mutators:

{{< code shell "Environment variable" >}}
%SENSU_SENSU_WINDOWS_POWERSHELL_CHECKS_PATH%
{{< /code >}}

### assetPath function for dynamic runtime asset paths

The `assetPath` token subsitution function allows you to substitute a dynamic runtime asset's local path on disk so that you will not need to manually update your check or hook commands every time the asset is updated.

{{% notice note %}}
**NOTE**: The `assetPath` function is only available where token substitution is available: the `command` attribute of a check or hook resource.
To access a dynamic runtime asset path in a handler or mutator command, you must use the [environment variable](#environment-variables-for-dynamic-runtime-asset-paths).
{{% /notice %}}

#### Linux assetPath example

To use the `assetPath` token substitution function in a Linux environment, place it immediately after the `$` character.

For example, to use the `assetPath` function to reference the path for the [sensu/http-checks][22] asset in your check or hook resources:

{{< code shell >}}
${{assetPath "sensu/http-checks"}}
{{< /code >}}

#### Windows assetPath example

To use the `assetPath` token substitution function in a Linux environment, place it between [paired `%` characters][44].

For example, to use the `assetPath` function to reference the path for the [sensu/sensu-windows-powershell-checks][4] asset in your check or hook resources:

{{< code shell "assetPath" >}}
%{{assetPath "sensu/sensu-windows-powershell-checks"}}%
{{< /code >}}

When running PowerShell plugins on Windows, the [exit status codes that Sensu captures may not match the expected values][13].
To correctly capture exit status codes from PowerShell plugins distributed as dynamic runtime assets, use the asset path to construct the command.
The following example uses the `assetPath` function for this purpose:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: win-cpu-check
spec:
  command: powershell.exe -ExecutionPolicy ByPass -f %{{assetPath "sensu/sensu-windows-powershell-checks"}}%\bin\check-windows-cpu-load.ps1 90 95
  subscriptions:
  - windows
  handlers:
  - slack
  - email
  runtime_assets:
  - sensu/sensu-windows-powershell-checks
  interval: 10
  publish: true
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "win-cpu-check"
  },
  "spec": {
    "command": "powershell.exe -ExecutionPolicy ByPass -f %{{assetPath \"sensu/sensu-windows-powershell-checks\"}}%\\bin\\check-windows-cpu-load.ps1 90 95",
    "subscriptions": [
      "windows"
    ],
    "handlers": [
      "slack",
      "email"
    ],
    "runtime_assets": [
      "sensu/sensu-windows-powershell-checks"
    ],
    "interval": 10,
    "publish": true
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Asset hello world Bourne shell example

In this example, you'll run a script that outputs `Hello World`:

{{< code shell >}}
hello-world.sh

#!/bin/sh

STRING="Hello World"

echo $STRING

if [ $? -eq 0 ]; then
    exit 0
else
    exit 2
fi
{{< /code >}}

The first step is to ensure that your directory structure is in place.
As noted in [Example dynamic runtime asset structure][15], your script could live in three potential directories in the project: `/bin`, `/lib`, or `/include`.
For this example, put your script in the `/bin` directory.

1. Create the directory `sensu-go-hello-world`:
{{< code shell >}}
mkdir sensu-go-hello-world
{{< /code >}}

2. Navigate to the `sensu-go-hello-world` directory:
{{< code shell >}}
cd sensu-go-hello-world
{{< /code >}}

3. Create the directory `/bin`:
{{< code shell >}}
mkdir bin
{{< /code >}}

4. Copy the script into the `/bin` directory:
{{< code shell >}}
cp hello-world.sh bin/
{{< /code >}}

5. Confirm that the script is in the `/bin` directory:
{{< code shell >}}
tree
{{< /code >}}

   The response should list the `hello-world.sh` script in the `/bin` directory:
   {{< code text >}}
.
└── bin
    └── hello-world.sh
{{< /code >}}

   If you receive a `command not found` response, install `tree` and run the command again.

6. Make sure that the script is marked as executable:
{{< code shell >}}
chmod +x bin/hello-world.sh 
{{< /code >}}

   If you do not receive a response, the command was successful.

Now that the script is in the directory, move on to the next step: packaging the `sensu-go-hello-world` directory as a dynamic runtime asset tarball.

### Package the dynamic runtime asset

Dynamic runtime assets are archives, so packaging the asset requires creating a tar.gz archive of your project.

1. Navigate to the directory you want to tar up.

2. Create the tar.gz archive:
{{< code shell >}}
tar -C sensu-go-hello-world -cvzf sensu-go-hello-world-0.0.1.tar.gz .
{{< /code >}}

3. Generate a SHA512 sum for the tar.gz archive (this is required for the dynamic runtime asset to work):
{{< code shell >}}
sha512sum sensu-go-hello-world-0.0.1.tar.gz | tee sha512sum.txt
{{< /code >}}

From here, you can host your dynamic runtime asset wherever you’d like.
To make the asset available via [Bonsai][16], you’ll need to host it on GitHub.
Learn more in [The “Hello World” of Sensu Assets][18] at the Sensu Community Forum on Discourse.

To host your dynamic runtime asset on a different platform like Gitlab or Bitbucket, upload your asset there.
You can also use Artifactory or even Apache or NGINX to serve your asset.
All that’s required for your dynamic runtime asset to work is the URL to the asset and the SHA512 sum for the asset to be downloaded.

## Asset specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][11] resource type. Dynamic runtime assets should always be type `Asset`.
required     | Required for asset definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][11].
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: Asset
{{< /code >}}
{{< code json >}}
{
  "type": "Asset"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For dynamic runtime assets in this version of Sensu, the `api_version` should always be `core/v2`.
required     | Required for asset definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][11].
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

metadata     | 
-------------|------
description  | Top-level collection of metadata about the dynamic runtime asset, including `name`, `namespace`, and `created_by` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the asset definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. Read [metadata attributes][5] for details.
required     | Required for asset definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][11].
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: check_script
  namespace: default
  created_by: admin
  labels:
    region: us-west-1
  annotations:
    playbook: www.example.url
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "name": "check_script",
    "namespace": "default",
    "created_by": "admin",
    "labels": {
      "region": "us-west-1"
    },
    "annotations": {
      "playbook": "www.example.url"
    }
  }
}
{{< /code >}}
{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes the dynamic runtime asset [spec attributes][12].
required     | Required for asset definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][11].
type         | Map of key-value pairs
example (multiple builds)     | {{< language-toggle >}}
{{< code yml >}}
spec:
  builds:
  - url: http://example.com/asset-linux-amd64.tar.gz
    sha512: 487ab34b37da8ce76d2657b62d37b35fbbb240c3546dd463fa0c37dc58a72b786ef0ca396a0a12c8d006ac7fa21923e0e9ae63419a4d56aec41fccb574c1a5d3
    filters:
    - entity.system.os == 'linux'
    - entity.system.arch == 'amd64'
    headers:
      Authorization: Bearer {{ .annotations.asset_token | default "N/A" }}
      X-Forwarded-For: client1, proxy1, proxy2
  - url: http://example.com/asset-linux-armv7.tar.gz
    sha512: 70df8b7e9aa36cf942b972e1781af04815fa560441fcdea1d1538374066a4603fc5566737bfd6c7ffa18314edb858a9f93330a57d430deeb7fd6f75670a8c68b
    filters:
    - entity.system.os == 'linux'
    - entity.system.arch == 'arm'
    - entity.system.arm_version == 7
    headers:
      Authorization: Bearer {{ .annotations.asset_token | default "N/A" }}
      X-Forwarded-For: client1, proxy1, proxy2
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "builds": [
      {
        "url": "http://example.com/asset-linux-amd64.tar.gz",
        "sha512": "487ab34b37da8ce76d2657b62d37b35fbbb240c3546dd463fa0c37dc58a72b786ef0ca396a0a12c8d006ac7fa21923e0e9ae63419a4d56aec41fccb574c1a5d3",
        "filters": [
          "entity.system.os == 'linux'",
          "entity.system.arch == 'amd64'"
        ],
        "headers": {
          "Authorization": "Bearer {{ .annotations.asset_token | default \"N/A\" }}",
          "X-Forwarded-For": "client1, proxy1, proxy2"
        }
      },
      {
        "url": "http://example.com/asset-linux-armv7.tar.gz",
        "sha512": "70df8b7e9aa36cf942b972e1781af04815fa560441fcdea1d1538374066a4603fc5566737bfd6c7ffa18314edb858a9f93330a57d430deeb7fd6f75670a8c68b",
        "filters": [
          "entity.system.os == 'linux'",
          "entity.system.arch == 'arm'",
          "entity.system.arm_version == 7"
        ],
        "headers": {
          "Authorization": "Bearer {{ .annotations.asset_token | default \"N/A\" }}",
          "X-Forwarded-For": "client1, proxy1, proxy2"
        }
      }
    ]
  }
}
{{< /code >}}
{{< /language-toggle >}}
example (single build, deprecated)     | {{< language-toggle >}}
{{< code yml >}}
spec:
  url: http://example.com/asset.tar.gz
  sha512: 4f926bf4328fbad2b9cac873d117f771914f4b837c9c85584c38ccf55a3ef3c2e8d154812246e5dda4a87450576b2c58ad9ab40c9e2edc31b288d066b195b21b
  filters:
  - entity.system.os == 'linux'
  - entity.system.arch == 'amd64'
  headers:
    Authorization: Bearer {{ .annotations.asset_token | default "N/A" }}
    X-Forwarded-For: client1, proxy1, proxy2
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "url": "http://example.com/asset.tar.gz",
    "sha512": "4f926bf4328fbad2b9cac873d117f771914f4b837c9c85584c38ccf55a3ef3c2e8d154812246e5dda4a87450576b2c58ad9ab40c9e2edc31b288d066b195b21b",
    "filters": [
      "entity.system.os == 'linux'",
      "entity.system.arch == 'amd64'"
    ],
    "headers": {
      "Authorization": "Bearer {{ .annotations.asset_token | default \"N/A\" }}",
      "X-Forwarded-For": "client1, proxy1, proxy2"
    }
  }
}
{{< /code >}}
{{< /language-toggle >}}

### Metadata attributes

name         |      |
-------------|------ 
description  | Unique name of the dynamic runtime asset, validated with Go regex [`\A[\w\.\-]+\z`][19].
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: check_script
{{< /code >}}
{{< code json >}}
{
  "name": "check_script"
}
{{< /code >}}
{{< /language-toggle >}}

| namespace  |      |
-------------|------
description  | [Sensu RBAC namespace][2] that the dynamic runtime asset belongs to.
required     | false
type         | String
default      | `default`
example      | {{< language-toggle >}}
{{< code yml >}}
namespace: production
{{< /code >}}
{{< code json >}}
{
  "namespace": "production"
}
{{< /code >}}
{{< /language-toggle >}}

| created_by |      |
-------------|------
description  | Username of the Sensu user who created the dynamic runtime asset or last updated the asset. Sensu automatically populates the `created_by` field when the dynamic runtime asset is created or updated.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
created_by: admin
{{< /code >}}
{{< code json >}}
{
  "created_by": "admin"
}
{{< /code >}}
{{< /language-toggle >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with observation event data that you can use for response and web UI view filtering.<br><br>If you include labels in your event data, you can filter [API responses][20], [sensuctl responses][21], and [web UI views][39] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
labels:
  environment: development
  region: us-west-2
{{< /code >}}
{{< code json >}}
{
  "labels": {
    "environment": "development",
    "region": "us-west-2"
  }
}
{{< /code >}}
{{< /language-toggle >}}

| annotations | |
-------------|------
description  | Non-identifying metadata to include with observation event data that you can access with [event filters][7]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][20], [sensuctl response filtering][21], or [web UI views][39].
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< language-toggle >}}
{{< code yml >}}
annotations:
  managed-by: ops
  playbook: www.example.url
{{< /code >}}
{{< code json >}}
{
  "annotations": {
    "managed-by": "ops",
    "playbook": "www.example.url"
  }
}
{{< /code >}}
{{< /language-toggle >}}

### Spec attributes

builds       | 
-------------|------ 
description  | List of dynamic runtime asset builds used to define multiple artifacts that provide the named asset.
required     | true, if `url`, `sha512` and `filters` are not provided
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
builds:
- url: http://example.com/asset-linux-amd64.tar.gz
  sha512: 487ab34b37da8ce76d2657b62d37b35fbbb240c3546dd463fa0c37dc58a72b786ef0ca396a0a12c8d006ac7fa21923e0e9ae63419a4d56aec41fccb574c1a5d3
  filters:
  - entity.system.os == 'linux'
  - entity.system.arch == 'amd64'
- url: http://example.com/asset-linux-armv7.tar.gz
  sha512: 70df8b7e9aa36cf942b972e1781af04815fa560441fcdea1d1538374066a4603fc5566737bfd6c7ffa18314edb858a9f93330a57d430deeb7fd6f75670a8c68b
  filters:
  - entity.system.os == 'linux'
  - entity.system.arch == 'arm'
  - entity.system.arm_version == 7
{{< /code >}}
{{< code json >}}
{
  "builds": [
    {
      "url": "http://example.com/asset-linux-amd64.tar.gz",
      "sha512": "487ab34b37da8ce76d2657b62d37b35fbbb240c3546dd463fa0c37dc58a72b786ef0ca396a0a12c8d006ac7fa21923e0e9ae63419a4d56aec41fccb574c1a5d3",
      "filters": [
        "entity.system.os == 'linux'",
        "entity.system.arch == 'amd64'"
      ]
    },
    {
      "url": "http://example.com/asset-linux-armv7.tar.gz",
      "sha512": "70df8b7e9aa36cf942b972e1781af04815fa560441fcdea1d1538374066a4603fc5566737bfd6c7ffa18314edb858a9f93330a57d430deeb7fd6f75670a8c68b",
      "filters": [
        "entity.system.os == 'linux'",
        "entity.system.arch == 'arm'",
        "entity.system.arm_version == 7"
      ]
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

url          | 
-------------|------ 
description  | URL location of the dynamic runtime asset. You can use [token substitution][3] in the URLs of your asset definitions so each backend or agent can download dynamic runtime assets from the appropriate URL without duplicating your assets (for example, if you want to host your assets at different datacenters).
required     | true, unless `builds` are provided
type         | String 
example      | {{< language-toggle >}}
{{< code yml >}}
url: http://example.com/asset.tar.gz
{{< /code >}}
{{< code json >}}
{
  "url": "http://example.com/asset.tar.gz"
}
{{< /code >}}
{{< /language-toggle >}}

sha512       | 
-------------|------ 
description  | Checksum of the dynamic runtime asset. 
required     | true, unless `builds` are provided
type         | String 
example      | {{< language-toggle >}}
{{< code yml >}}
sha512: 4f926bf4328...
{{< /code >}}
{{< code json >}}
{
  "sha512": "4f926bf4328..."
}
{{< /code >}}
{{< /language-toggle >}}

<a id="filters-attribute"></a>

filters      | 
-------------|------ 
description  | Set of [Sensu query expressions][1] used to determine if the dynamic runtime asset should be installed. If multiple expressions are included, each expression must return `true` for Sensu to install the asset.<br><br>Filters for _check_ dynamic runtime assets should match agent entity platforms. Filters for _handler_ and _filter_ dynamic runtime assets should match your Sensu backend platform. You can create asset filter expressions using any supported [entity.system attributes][10], including `os`, `arch`, `platform`, and `platform_family`. {{% notice protip %}}
**PRO TIP**: Dynamic runtime asset filters let you reuse checks across platforms safely. Assign dynamic runtime assets for multiple platforms to a single check, and rely on asset filters to ensure that only the appropriate asset is installed on each agent.
{{% /notice %}}
required     | false 
type         | Array 
example      | {{< language-toggle >}}
{{< code yml >}}
filters:
- entity.system.os=='linux'
- entity.system.arch=='amd64'
{{< /code >}}
{{< code json >}}
{
  "filters": [
    "entity.system.os=='linux'",
    "entity.system.arch=='amd64'"
  ]
}
{{< /code >}}
{{< /language-toggle >}}

headers       |       |
--------------|-------|
description   | HTTP headers to apply to dynamic runtime asset retrieval requests. You can use headers to access secured dynamic runtime assets. For headers that require multiple values, separate the values with a comma. You can use [token substitution][3] in your dynamic runtime asset headers (for example, to include secure information for authentication).
required     | false
type         | Map of key-value string pairs
example      | {{< language-toggle >}}
{{< code yml >}}
headers:
  Authorization: Bearer {{ .annotations.asset_token | default "N/A" }}
  X-Forwarded-For: client1, proxy1, proxy2
{{< /code >}}
{{< code json >}}
{
  "headers": {
    "Authorization": "Bearer {{ .annotations.asset_token | default \"N/A\" }}",
    "X-Forwarded-For": "client1, proxy1, proxy2"
  }
}
{{< /code >}}
{{< /language-toggle >}}

## Dynamic runtime asset filters based on entity.system attributes

Use the [entity.system attributes][10] in dynamic runtime asset [filters][42] to specify which systems and configurations an asset or asset builds can be used with.

For example, the [sensu/sensu-ruby-runtime][43] dynamic runtime asset definition includes several builds, each with filters for several `entity.system` attributes:

{{< language-toggle >}}

{{< code yml >}}
---
type: Asset
api_version: core/v2
metadata:
  name: sensu-ruby-runtime
  labels: 
  annotations:
    io.sensu.bonsai.url: https://bonsai.sensu.io/assets/sensu/sensu-ruby-runtime
    io.sensu.bonsai.api_url: https://bonsai.sensu.io/api/v1/assets/sensu/sensu-ruby-runtime
    io.sensu.bonsai.tier: Community
    io.sensu.bonsai.version: 0.0.10
    io.sensu.bonsai.namespace: sensu
    io.sensu.bonsai.name: sensu-ruby-runtime
    io.sensu.bonsai.tags: ''
spec:
  builds:
  - url: https://assets.bonsai.sensu.io/5123017d3dadf2067fa90fc28275b92e9b586885/sensu-ruby-runtime_0.0.10_ruby-2.4.4_centos6_linux_amd64.tar.gz
    sha512: cbee19124b7007342ce37ff9dfd4a1dde03beb1e87e61ca2aef606a7ad3c9bd0bba4e53873c07afa5ac46b0861967a9224511b4504dadb1a5e8fb687e9495304
    filters:
    - entity.system.os == 'linux'
    - entity.system.arch == 'amd64'
    - entity.system.platform_family == 'rhel'
    - parseInt(entity.system.platform_version.split('.')[0]) == 6
  - url: https://assets.bonsai.sensu.io/5123017d3dadf2067fa90fc28275b92e9b586885/sensu-ruby-runtime_0.0.10_ruby-2.4.4_debian_linux_amd64.tar.gz
    sha512: a28952fd93fc63db1f8988c7bc40b0ad815eb9f35ef7317d6caf5d77ecfbfd824a9db54184400aa0c81c29b34cb48c7e8c6e3f17891aaf84cafa3c134266a61a
    filters:
    - entity.system.os == 'linux'
    - entity.system.arch == 'amd64'
    - entity.system.platform_family == 'debian'
  - url: https://assets.bonsai.sensu.io/5123017d3dadf2067fa90fc28275b92e9b586885/sensu-ruby-runtime_0.0.10_ruby-2.4.4_alpine_linux_amd64.tar.gz
    sha512: 8d768d1fba545898a8d09dca603457eb0018ec6829bc5f609a1ea51a2be0c4b2d13e1aa46139ecbb04873449e4c76f463f0bdfbaf2107caf37ab1c8db87d5250
    filters:
    - entity.system.os == 'linux'
    - entity.system.arch == 'amd64'
    - entity.system.platform == 'alpine'
    - entity.system.platform_version.split('.')[0] == '3'
{{< /code >}}

{{< code json >}}
{
  "type": "Asset",
  "api_version": "core/v2",
  "metadata": {
    "name": "sensu-ruby-runtime",
    "labels": null,
    "annotations": {
      "io.sensu.bonsai.url": "https://bonsai.sensu.io/assets/sensu/sensu-ruby-runtime",
      "io.sensu.bonsai.api_url": "https://bonsai.sensu.io/api/v1/assets/sensu/sensu-ruby-runtime",
      "io.sensu.bonsai.tier": "Community",
      "io.sensu.bonsai.version": "0.0.10",
      "io.sensu.bonsai.namespace": "sensu",
      "io.sensu.bonsai.name": "sensu-ruby-runtime",
      "io.sensu.bonsai.tags": ""
    }
  },
  "spec": {
    "builds": [
      {
        "url": "https://assets.bonsai.sensu.io/5123017d3dadf2067fa90fc28275b92e9b586885/sensu-ruby-runtime_0.0.10_ruby-2.4.4_centos6_linux_amd64.tar.gz",
        "sha512": "cbee19124b7007342ce37ff9dfd4a1dde03beb1e87e61ca2aef606a7ad3c9bd0bba4e53873c07afa5ac46b0861967a9224511b4504dadb1a5e8fb687e9495304",
        "filters": [
          "entity.system.os == 'linux'",
          "entity.system.arch == 'amd64'",
          "entity.system.platform_family == 'rhel'",
          "parseInt(entity.system.platform_version.split('.')[0]) == 6"
        ]
      },
      {
        "url": "https://assets.bonsai.sensu.io/5123017d3dadf2067fa90fc28275b92e9b586885/sensu-ruby-runtime_0.0.10_ruby-2.4.4_debian_linux_amd64.tar.gz",
        "sha512": "a28952fd93fc63db1f8988c7bc40b0ad815eb9f35ef7317d6caf5d77ecfbfd824a9db54184400aa0c81c29b34cb48c7e8c6e3f17891aaf84cafa3c134266a61a",
        "filters": [
          "entity.system.os == 'linux'",
          "entity.system.arch == 'amd64'",
          "entity.system.platform_family == 'debian'"
        ]
      },
      {
        "url": "https://assets.bonsai.sensu.io/5123017d3dadf2067fa90fc28275b92e9b586885/sensu-ruby-runtime_0.0.10_ruby-2.4.4_alpine_linux_amd64.tar.gz",
        "sha512": "8d768d1fba545898a8d09dca603457eb0018ec6829bc5f609a1ea51a2be0c4b2d13e1aa46139ecbb04873449e4c76f463f0bdfbaf2107caf37ab1c8db87d5250",
        "filters": [
          "entity.system.os == 'linux'",
          "entity.system.arch == 'amd64'",
          "entity.system.platform == 'alpine'",
          "entity.system.platform_version.split('.')[0] == '3'"
        ]
      }
    ]
  }
}
{{< /code >}}

{{< /language-toggle >}}

In this example, if you install the dynamic runtime asset on a system running Linux AMD64 Alpine version 3.xx, Sensu will ignore the first two builds and install the third.

{{% notice note %}}
**NOTE**: Sensu downloads and installs the first build whose filter expressions all evaluate as `true`.
If your system happens to match all of the filters for more than one build of a dynamic runtime asset, Sensu will only install the first build.
{{% /notice %}}

All of the dynamic runtime asset filter expressions must evaluate as true for Sensu to download and install the asset and run the check, handler, or filter that references the asset.

To continue this example, if you try to install the dynamic runtime asset on a system running Linux AMD64 Alpine version 2.xx, the `entity.system.platform_version` argument will evaluate as `false`.
In this case, the asset will not be downloaded and the check, handler, or filter that references the asset will fail to run.

Add dynamic runtime asset filters to specify that an asset is compiled for any of the [entity.system attributes][10], including operating system, platform, platform version, and architecture.
Then, you can rely on dynamic runtime asset filters to ensure that you install only the appropriate asset for each of your agents.

## Share an asset on Bonsai

Share your open-source dynamic runtime assets on [Bonsai][16] and connect with the Sensu community.
Bonsai supports dynamic runtime assets hosted on [GitHub][24] and released using [GitHub releases][25].
For more information about creating Sensu plugins, read the [plugins reference][29].

Bonsai requires a [`bonsai.yml` configuration file][26] in the root directory of your repository that includes the project description, platforms, asset filenames, and SHA-512 checksums.
For a Bonsai-compatible dynamic runtime asset template using Go and [GoReleaser][27], review the [Sensu Go plugin skeleton][28].

To share your dynamic runtime asset on Bonsai, [log in to Bonsai][37] with your GitHub account and authorize Sensu.
After you are logged in, you can [register your dynamic runtime asset on Bonsai][38] by adding the GitHub repository, a description, and tags.
Make sure to provide a helpful README for your dynamic runtime asset with configuration examples.

### `bonsai.yml` example

{{< code yml >}}
---
description: "#{repo}"
builds:
- platform: "linux"
  arch: "amd64"
  asset_filename: "#{repo}_#{version}_linux_amd64.tar.gz"
  sha_filename: "#{repo}_#{version}_sha512-checksums.txt"
  filter:
  -  "entity.system.os == 'linux'"
  -  "entity.system.arch == 'amd64'"

- platform: "Windows"
  arch: "amd64"
  asset_filename: "#{repo}_#{version}_windows_amd64.tar.gz"
  sha_filename: "#{repo}_#{version}_sha512-checksums.txt"
  filter:
  -  "entity.system.os == 'windows'"
  -  "entity.system.arch == 'amd64'"
{{< /code >}}

### `bonsai.yml` specification

 description | 
-------------|------
description  | Project description.
required     | true
type         | String
example      | {{< code yml >}}description: "#{repo}"{{< /code >}}

 builds      | 
-------------|------
description  | Array of dynamic runtime asset details per platform.
required     | true
type         | Array
example      | {{< code yml >}}
builds:
- platform: "linux"
  arch: "amd64"
  asset_filename: "#{repo}_#{version}_linux_amd64.tar.gz"
  sha_filename: "#{repo}_#{version}_sha512-checksums.txt"
  filter:
  -  "entity.system.os == 'linux'"
  -  "entity.system.arch == 'amd64'"
{{< /code >}}

### Builds specification

 platform    | 
-------------|------
description  | Platform supported by the dynamic runtime asset.
required     | true
type         | String
example      | {{< code yml >}}- platform: "linux"{{< /code >}}

 arch        | 
-------------|------
description  | Architecture supported by the dynamic runtime asset.
required     | true
type         | String
example      | {{< code yml >}}  arch: "amd64"{{< /code >}}

asset_filename | 
-------------|------
description  | File name of the archive that contains the dynamic runtime asset.
required     | true
type         | String
example      | {{< code yml >}}asset_filename: "#{repo}_#{version}_linux_amd64.tar.gz"{{< /code >}}

sha_filename | 
-------------|------
description  | SHA-512 checksum for the dynamic runtime asset archive.
required     | true
type         | String
example      | {{< code yml >}}sha_filename: "#{repo}_#{version}_sha512-checksums.txt"{{< /code >}}

 filter      | 
-------------|------
description  | Filter expressions that describe the operating system and architecture supported by the asset.
required     | false
type         | Array
example      | {{< code yml >}}
  filter:
  -  "entity.system.os == 'linux'"
  -  "entity.system.arch == 'amd64'"
{{< /code >}}

## Delete dynamic runtime assets

Delete dynamic runtime assets with a DELETE request to the [`/assets` API endpoint][47] or with the [`sensuctl asset delete` command][48].

Removing a dynamic runtime asset from Sensu *does not* remove references to the deleted asset in any other resource (including checks, filters, mutators, handlers, and hooks).
You must also update resources and remove any reference to the deleted dynamic runtime asset.
Failure to do so will result in errors like `sh: asset.sh: command not found`. 

Errors as a result of failing to remove the dynamic runtime asset from checks and hooks will surface in the event data.
Errors as a result of failing to remove the dynamic runtime asset reference on a mutator, handler, or filter will only surface in the backend logs.

Deleting a dynamic runtime asset does not delete the archive or downloaded files on disk.
You must remove the archive and downloaded files from the asset cache manually.


[1]: ../../observability-pipeline/observe-filter/sensu-query-expressions/
[2]: ../../operations/control-access/namespaces/
[3]: ../../observability-pipeline/observe-schedule/tokens/#manage-dynamic-runtime-assets
[4]: https://bonsai.sensu.io/assets/sensu/sensu-windows-powershell-checks
[5]: #metadata-attributes
[6]: ../../observability-pipeline/observe-schedule/checks/
[7]: ../../observability-pipeline/observe-filter/filters/
[8]: ../../observability-pipeline/observe-transform/mutators/
[9]: ../../observability-pipeline/observe-process/handlers/
[10]: ../../observability-pipeline/observe-entities/entities#system-attributes
[11]: ../../sensuctl/create-manage-resources/#create-resources
[12]: #spec-attributes
[13]: https://github.com/sensu/sensu/issues/1919
[14]: #environment-variables-for-dynamic-runtime-asset-paths
[15]: #example-dynamic-runtime-asset-structure
[16]: https://bonsai.sensu.io/
[17]: #assetpath-function-for-dynamic-runtime-asset-paths
[18]: https://discourse.sensu.io/t/the-hello-world-of-sensu-assets/1422
[19]: https://regex101.com/r/zo9mQU/2
[20]: ../../api/#response-filtering
[21]: ../../sensuctl/filter-responses/
[22]: https://bonsai.sensu.io/assets/sensu/http-checks
[23]: ../use-assets-to-install-plugins/
[24]: https://github.com
[25]: https://help.github.com/articles/about-releases/
[26]: #bonsaiyml-example
[27]: https://goreleaser.com/
[28]: https://github.com/sensu/sensu-go-plugin/
[29]: ../plugins/
[30]: ../../observability-pipeline/observe-schedule/agent#disable-assets
[31]: ../../platforms/#docker-images
[32]: ../../platforms/#supported-packages
[33]: ../../catalog/sensu-catalog/
[37]: https://bonsai.sensu.io/sign-in
[38]: https://bonsai.sensu.io/new
[39]: ../../web-ui/search#search-for-labels
[40]: ../../observability-pipeline/observe-schedule/agent/#assets-burst-limit
[41]: ../../observability-pipeline/observe-schedule/backend/#backend-configuration-options
[42]: #filters-attribute
[43]: https://bonsai.sensu.io/assets/sensu/sensu-ruby-runtime
[44]: https://devblogs.microsoft.com/oldnewthing/20060823-00/?p=29993
[45]: https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_environment_variables?view=powershell-7.1
[46]: https://bonsai.sensu.io/assets/sensu/check-cpu-usage
[47]: ../../api/core/assets/
[48]: ../../sensuctl/create-manage-resources/#delete-resources
