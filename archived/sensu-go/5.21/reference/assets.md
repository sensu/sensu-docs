---
title: "Assets"
linkTitle: "Assets"
reference_title: "Assets"
type: "reference"
description: "Assets are shareable, reusable packages that make it easier to deploy Sensu plugins. You can use assets to provide the plugins, libraries, and runtimes you need to create automated monitoring workflows. Read this reference doc to learn about assets."
weight: 40
version: "5.21"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.21:
    parent: reference
---

You can discover, download, and share assets using [Bonsai, the Sensu asset hub][16].
Read [Install plugins with assets][23] to get started.

Assets are shareable, reusable packages that make it easier to deploy Sensu plugins.
You can use assets to provide the plugins, libraries, and runtimes you need to automate your monitoring workflows.
Sensu supports runtime assets for [checks][6], [filters][7], [mutators][8], and [handlers][9].

{{% notice note %}}
**NOTE**: Assets are not required to use Sensu Go.
You can install Sensu plugins using the [sensu-install](../../operations/deploy-sensu/install-plugins/#install-plugins-with-the-sensu-install-tool) tool or a [configuration management](../../operations/deploy-sensu/configuration-management/) solution.
{{% /notice %}}

The Sensu backend executes handler, filter, and mutator assets.
The Sensu agent executes check assets.
At runtime, the backend or agent sequentially evaluates assets that appear in the `runtime_assets` attribute of the handler, filter, mutator, or check being executed.

## Asset example (minimum required attributes)

This example shows an asset resource definition that includes the minimum required attributes:

{{< language-toggle >}}

{{< code yml >}}
---
type: Asset
api_version: core/v2
metadata:
  name: check_script
  namespace: default
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
    "name": "check_script",
    "namespace": "default"
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

## Asset builds

An asset build is the combination of an artifact URL, SHA512 checksum, and optional [Sensu query expression][1] filters.
Each asset definition may describe one or more builds.

{{% notice note %}}
**NOTE**: Assets that provide `url` and `sha512` attributes at the top level of the `spec` scope are [single-build assets](#asset-example-single-build-deprecated), and this form of asset defintion is deprecated.
We recommend using [multiple-build asset defintions](#asset-example-multiple-builds), which specify one or more `builds` under the `spec` scope.
{{% /notice %}}

### Asset example: Multiple builds

This example shows the resource definition for an asset with multiple builds:

{{< language-toggle >}}

{{< code yml >}}
---
type: Asset
api_version: core/v2
metadata:
  name: check_cpu
  namespace: default
  labels:
    origin: bonsai
  annotations:
    project_url: https://bonsai.sensu.io/assets/asachs01/sensu-go-cpu-check
    version: 0.0.3
spec:
  builds:
  - url: https://assets.bonsai.sensu.io/981307deb10ebf1f1433a80da5504c3c53d5c44f/sensu-go-cpu-check_0.0.3_linux_amd64.tar.gz
    sha512: 487ab34b37da8ce76d2657b62d37b35fbbb240c3546dd463fa0c37dc58a72b786ef0ca396a0a12c8d006ac7fa21923e0e9ae63419a4d56aec41fccb574c1a5d3
    filters:
    - entity.system.os == 'linux'
    - entity.system.arch == 'amd64'
    headers:
      Authorization: 'Bearer {{ .annotations.asset_token | default "N/A" }}'
      X-Forwarded-For: client1, proxy1, proxy2
  - url: https://assets.bonsai.sensu.io/981307deb10ebf1f1433a80da5504c3c53d5c44f/sensu-go-cpu-check_0.0.3_linux_armv7.tar.gz
    sha512: 70df8b7e9aa36cf942b972e1781af04815fa560441fcdea1d1538374066a4603fc5566737bfd6c7ffa18314edb858a9f93330a57d430deeb7fd6f75670a8c68b
    filters:
    - entity.system.os == 'linux'
    - entity.system.arch == 'arm'
    - entity.system.arm_version == 7
    headers:
      Authorization: 'Bearer {{ .annotations.asset_token | default "N/A" }}'
      X-Forwarded-For: client1, proxy1, proxy2
  - url: https://assets.bonsai.sensu.io/981307deb10ebf1f1433a80da5504c3c53d5c44f/sensu-go-cpu-check_0.0.3_windows_amd64.tar.gz
    sha512: 10d6411e5c8bd61349897cf8868087189e9ba59c3c206257e1ebc1300706539cf37524ac976d0ed9c8099bdddc50efadacf4f3c89b04a1a8bf5db581f19c157f
    filters:
    - entity.system.os == 'windows'
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
    "name": "check_cpu",
    "namespace": "default",
    "labels": {
      "origin": "bonsai"
    },
    "annotations": {
      "project_url": "https://bonsai.sensu.io/assets/asachs01/sensu-go-cpu-check",
      "version": "0.0.3"
    }
  },
  "spec": {
    "builds": [
      {
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
      },
      {
        "url": "https://assets.bonsai.sensu.io/981307deb10ebf1f1433a80da5504c3c53d5c44f/sensu-go-cpu-check_0.0.3_linux_armv7.tar.gz",
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
      },
      {
        "url": "https://assets.bonsai.sensu.io/981307deb10ebf1f1433a80da5504c3c53d5c44f/sensu-go-cpu-check_0.0.3_windows_amd64.tar.gz",
        "sha512": "10d6411e5c8bd61349897cf8868087189e9ba59c3c206257e1ebc1300706539cf37524ac976d0ed9c8099bdddc50efadacf4f3c89b04a1a8bf5db581f19c157f",
        "filters": [
          "entity.system.os == 'windows'",
          "entity.system.arch == 'amd64'"
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

### Asset example: Single build (deprecated)

This example shows the resource definition for an asset with a single build:

{{< language-toggle >}}

{{< code yml >}}
---
type: Asset
api_version: core/v2
metadata:
  name: check_cpu_linux_amd64
  namespace: default
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
    "namespace": "default",
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

### Asset build evaluation

For each build provided in an asset, Sensu will evaluate any defined filters to determine whether any build matches the agent or backend service's environment.
If all filters specified on a build evaluate to `true`, that build is considered a match.
For assets with multiple builds, only the first build which matches will be downloaded and installed.

### Asset build download

Sensu downloads the asset build on the host system where the asset contents are needed to execute the requested command.
For example, if a check definition references an asset, the Sensu agent that executes the check will download the asset the first time it executes the check.
The asset build the agent downloads will depend on the filter rules associated with each build defined for the asset.

Sensu backends follow a similar process when pipeline elements (filters, mutators, and handlers) request runtime asset installation as part of operation.

{{% notice note %}}
**NOTE**: Asset builds are not downloaded until they are needed for command execution.
{{% /notice %}}

When Sensu finds a matching build, it downloads the build artifact from the specified URL.
If the asset definition includes headers, they are passed along as part of the HTTP request.
If the downloaded artifact's SHA512 checksum matches the checksum provided by the build, it is unpacked into the Sensu service's local cache directory.

Set the backend or agent's local cache path with the `--cache-dir` flag.
Disable assets for an agent with the agent `--disable-assets` [configuration flag][30].

{{% notice note %}}
**NOTE**: Asset builds are unpacked into the cache directory that is configured with the `--cache-dir` flag.
{{% /notice %}}

Use the `--assets-rate-limit` and `--assets-burst-limit` flags for the [agent][40] and [backend][41] to configure a global rate limit for fetching assets.

### Asset build execution

The directory path of each asset defined in `runtime_assets` is appended to the `PATH` before the handler, filter, mutator, or check `command` is executed.
Subsequent handler, filter, mutator, or check executions look for the asset in the local cache and ensure that the contents match the configured checksum.

The following example demonstrates a use case with a Sensu check resource and an asset:

{{< language-toggle >}}

{{< code yml >}}
---
type: Asset
api_version: core/v2
metadata:
  name: sensu-prometheus-collector
  namespace: default
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
  namespace: default
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

{{< code json "JSON">}}
{
  "type": "Asset",
  "api_version": "core/v2",
  "metadata": {
    "name": "sensu-email-handler",
    "namespace": "default"
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
    "name": "prometheus_collector",
    "namespace": "default"
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

## Asset format specification

Sensu expects an asset to be a tar archive (optionally gzipped) that contains one or more executables within a bin folder.
Any scripts or executables should be within a `bin/` folder in the archive.
See the [Sensu Go Plugin template][28] for an example asset and Bonsai configuration.

The following are injected into the execution context:

- `{PATH_TO_ASSET}/bin` is injected into the `PATH` environment variable
- `{PATH_TO_ASSET}/lib` is injected into the `LD_LIBRARY_PATH` environment variable
- `{PATH_TO_ASSET}/include` is injected into the `CPATH` environment variable

{{% notice note %}}
**NOTE**: You cannot create an asset by creating an archive of an existing project (as in previous versions of Sensu for plugins from the [Sensu Plugins community](https://github.com/sensu-plugins/)).
Follow the steps outlined in [Contributing Assets for Existing Ruby Sensu Plugins](https://discourse.sensu.io/t/contributing-assets-for-existing-ruby-sensu-plugins/1165), a Sensu Discourse guide.
For further examples of Sensu users who have added the ability to use a community plugin as an asset, see [this Discourse post](https://discourse.sensu.io/t/how-to-use-the-sensu-plugins-kubernetes-plugin/1286).
{{% /notice %}}

### Default cache directory

system  | sensu-backend                         | sensu-agent
--------|---------------------------------------|-------------
Linux   | `/var/cache/sensu/sensu-backend`      | `/var/cache/sensu/sensu-agent`
Windows | N/A                                   | `C:\ProgramData\sensu\cache\sensu-agent`

If the requested asset is not in the local cache, it is downloaded from the asset URL.
The Sensu backend acts as an index of asset builds, and does not provide storage or hosting for the build artifacts.
Sensu expects assets to be retrieved over HTTP or HTTPS.

### Example asset structure

{{< code shell >}}
sensu-example-handler_1.0.0_linux_amd64
├── CHANGELOG.md
├── LICENSE
├── README.md
└── bin
  └── my-check.sh
└── lib
└── include
{{< /code >}}

## Asset path

When you download and install an asset, the asset files are saved to a local path on disk.
Most of the time, you won't need to know this path &mdash; except in cases where you need to provide the full path to asset files as part of a command argument.

The asset directory path includes the asset's checksum, which changes every time underlying asset artifacts are updated.
This would normally require you to manually update the commands for any of your checks, handlers, hooks, or mutators that consume the asset.
However, because the asset directory path is exposed to asset consumers via [environment variables][14] and the [`assetPath` custom function for token substitution][17], you can avoid these manual updates.

You can retrieve the asset's path as an environment variable in the `command` context for checks, handlers, hooks, and mutators.
Token substitution with the `assetPath` custom function is only available for check and hook commands.

### Environment variables for asset paths

For each runtime asset, a corresponding environment variable will be available in the `command` context.

Sensu generates the environment variable name by capitalizing the asset name, replacing any special characters with underscores, and appending the `_PATH` suffix.
The value of the variable will be the path on disk where the asset build has been unpacked.

For example, the environment variable path for the asset [`sensu-plugins-windows`][4] would be:

`$SENSU_PLUGINS_WINDOWS_PATH/include/config.yaml`

### Token substitution for asset paths

The `assetPath` token subsitution function allows you to substitute the asset's local path on disk, so you will not need to manually update your check or hook commands every time the asset is updated.

{{% notice note %}}
**NOTE**: The `assetPath` function is only available where token substitution is available: the `command` attribute of a check or hook resource.
If you want to access an asset path in a handler or mutator command, you must use the [environment variable](#environment-variables-for-asset-paths).
{{% /notice %}}

For example, you can reference the asset [`sensu-plugins-windows`][4] from your check or hook resources using either the environment variable or the `assetPath` function:

- `$SENSU_PLUGINS_WINDOWS_PATH/include/config.yaml`
- `${{assetPath "sensu-plugins-windows"}}/include/config.yaml`

When running PowerShell plugins on Windows, the [exit status codes that Sensu captures may not match the expected values][13].
To correctly capture exit status codes from PowerShell plugins distributed as assets, use the asset path to construct the command:

{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
namespace: default
name: win-cpu-check
spec:
  command: powershell.exe -ExecutionPolicy ByPass -f %{{assetPath "sensu-plugins-windows"}}%\bin\check-windows-cpu-load.ps1 90 95
  subscriptions:
  - windows
  handlers:
  - slack
  - email
  runtime_assets:
  - sensu-plugins-windows
  interval: 10
  publish: true
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": null,
  "namespace": "default",
  "name": "win-cpu-check",
  "spec": {
    "command": "powershell.exe -ExecutionPolicy ByPass -f %{{assetPath \"sensu-plugins-windows\"}}%\\bin\\check-windows-cpu-load.ps1 90 95",
    "subscriptions": [
      "windows"
    ],
    "handlers": [
      "slack",
      "email"
    ],
    "runtime_assets": [
      "sensu-plugins-windows"
    ],
    "interval": 10,
    "publish": true
  }
}
{{< /code >}}

{{< /language-toggle >}}

## Asset hello world example

In this example, you'll run a script that outputs `Hello World`:

{{< code bash >}}
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
As noted in [Example asset structure][15], your script could live in three potential directories in the project: `/bin`, `/lib`, or `/include`.
For this example, put your script in the `/bin` directory.
Create the directories `sensu-go-hello-world` and `/bin`:

{{< code bash >}}
$ mkdir sensu-go-hello-world

$ cd sensu-go-hello-world

$ mkdir bin

$ cp hello-world.sh bin/

$ tree
.
└── bin
    └── hello-world.sh
{{< /code >}}

Next, make sure that the script is marked as executable:

{{< code bash >}}
$ chmod +x bin/hello-world.sh 
mode of 'hello-world.sh' changed from 0644 (rw-r--r--) to 0755 (rwxr-xr-x)
{{< /code >}}

Now that the script is in the directory, move on to the next step: packaging the `sensu-go-hello-world` directory as an asset tarball.

### Package the asset

assets are archives, so the first step in packaging the asset is to create a tar.gz archive of your project.
This assumes you're in the directory you want to tar up:

{{< code bash >}}
$ cd ..
$ tar -C sensu-go-hello-world -cvzf sensu-go-hello-world-0.0.1.tar.gz .
...
{{< /code >}}

Now that you've created an archive, you need to generate a SHA512 sum for it (this is required for the asset to work):

{{< code bash >}}
sha512sum sensu-go-hello-world-0.0.1.tar.gz | tee sha512sum.txt
dbfd4a714c0c51c57f77daeb62f4a21141665ae71440951399be2d899bf44b3634dad2e6f2516fff1ef4b154c198b9c7cdfe1e8867788c820db7bb5bcad83827 sensu-go-hello-world-0.0.1.tar.gz
{{< /code >}}

From here, you can host your asset wherever you’d like.
To make the asset available via [Bonsai][16], you’ll need to host it on GitHub.
Learn more in [The “Hello World” of Sensu Assets][18] on Discourse.

To host your asset on a different platform like Gitlab or Bitbucket, upload your asset there.
You can also use Artifactory or even Apache or Nginx to serve your asset.
All that’s required for your asset to work is the URL to the asset and the SHA512 sum for the asset to be downloaded.

## Asset specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][11] resource type. Assets should always be type `Asset`.
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
description  | Top-level attribute that specifies the Sensu API group and version. For assets in this version of Sensu, the `api_version` should always be `core/v2`.
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
description  | Top-level collection of metadata about the asset, including `name`, `namespace`, and `created_by` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the asset definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. See [metadata attributes][5] for details.
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
description  | Top-level map that includes the asset [spec attributes][12].
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
description  | Unique name of the asset, validated with Go regex [`\A[\w\.\-]+\z`][19].
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
description  | [Sensu RBAC namespace][2] that the asset belongs to.
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
description  | Username of the Sensu user who created the asset or last updated the asset. Sensu automatically populates the `created_by` field when the asset is created or updated.
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
description  | Custom attributes to include with event data that you can use for response and web UI view filtering.<br><br>If you include labels in your event data, you can filter [API responses][20], [sensuctl responses][21], and [web UI views][39] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
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
description  | Non-identifying metadata to include with event data that you can access with [event filters][7]. You can use annotations to add data that's meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][20], [sensuctl response filtering][21], or [web UI views][39].
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
description  | List of asset builds used to define multiple artifacts that provide the named asset.
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
description  | URL location of the asset. You can use [token substitution][3] in the URLs of your asset definitions so each backend or agent can download assets from the appropriate URL without duplicating your assets (for example, if you want to host your assets at different datacenters).
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
description  | Checksum of the asset. 
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
description  | Set of [Sensu query expressions][1] used to determine if the asset should be installed. If multiple expressions are included, each expression must return `true` for Sensu to install the asset.<br><br>Filters for _check_ assets should match agent entity platforms. Filters for _handler_ and _filter_ assets should match your Sensu backend platform. You can create asset filter expressions using any supported [entity.system attributes][10], including `os`, `arch`, `platform`, and `platform_family`. {{% notice protip %}}
**PRO TIP**: Asset filters let you reuse checks across platforms safely. Assign assets for multiple platforms to a single check, and rely on asset filters to ensure that only the appropriate asset is installed on each agent.
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
description   | HTTP headers to apply to asset retrieval requests. You can use headers to access secured assets. For headers that require multiple values, separate the values with a comma. You can use [token substitution][3] in your asset headers (for example, to include secure information for authentication).
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

## Asset filters based on entity.system attributes

Use the [entity.system attributes][10] in asset [filters][42] to specify which systems and configurations an asset or asset builds can be used with.

For example, the [Sensu Go Ruby Runtime][43] asset definition includes several builds, each with filters for several `entity.system` attributes:

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

In this example, if you install the asset on a system running Linux AMD64 Alpine version 3.xx, Sensu will ignore the first two builds and install the third.

{{% notice note %}}
**NOTE**: Sensu downloads and installs the first build whose filter expressions all evaluate as `true`.
If your system happens to match all of the filters for more than one build of an asset, Sensu will only install the first build.
{{% /notice %}}

All of the asset filter expressions must evaluate as true for Sensu to download and install the asset and run the check, handler, or filter that references the asset.

To continue this example, if you try to install the asset on a system running Linux AMD64 Alpine version 2.xx, the `entity.system.platform_version` argument will evaluate as `false`.
In this case, the asset will not be downloaded and the check, handler, or filter that references the asset will fail to run.

Add asset filters to specify that an asset is compiled for any of the [entity.system attributes][10], including operating system, platform, platform version, and architecture.
Then, you can rely on asset filters to ensure that you install only the appropriate asset for each of your agents.

## Share an asset on Bonsai

Share your open-source assets on [Bonsai][16] and connect with the Sensu community.
Bonsai supports assets hosted on [GitHub][24] and released using [GitHub releases][25].
For more information about creating Sensu Plugins, see the [Sensu Plugin specification][29].

Bonsai requires a [`bonsai.yml` configuration file][26] in the root directory of your repository that includes the project description, platforms, asset filenames, and SHA-512 checksums.
For a Bonsai-compatible asset template using Go and [GoReleaser][27], see the [Sensu Go plugin skeleton][28].

To share your asset on Bonsai, [log in to Bonsai][37] with your GitHub account and authorize Sensu.
After you are logged in, you can [register your asset on Bonsai][38] by adding the GitHub repository, a description, and tags.
Make sure to provide a helpful README for your asset with configuration examples.

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
description  | Array of asset details per platform.
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
description  | Platform supported by the asset.
required     | true
type         | String
example      | {{< code yml >}}- platform: "linux"{{< /code >}}

 arch        | 
-------------|------
description  | Architecture supported by the asset.
required     | true
type         | String
example      | {{< code yml >}}  arch: "amd64"{{< /code >}}

asset_filename | 
-------------|------
description  | File name of the archive that contains the asset.
required     | true
type         | String
example      | {{< code yml >}}asset_filename: "#{repo}_#{version}_linux_amd64.tar.gz"{{< /code >}}

sha_filename | 
-------------|------
description  | SHA-512 checksum for the asset archive.
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

## Delete assets

Delete assets with the `/assets (DELETE)` endpoint or via `sensuctl` (`sensuctl asset delete`).
When you remove an asset from Sensu, this _*does not*_ remove references to the deleted asset in any other resource (including checks, filters, mutators, handlers, and hooks).
You must also update resources and remove any reference to the deleted asset.
Failure to do so will result in errors like `sh: asset.sh: command not found`. 

Errors as a result of failing to remove the asset from checks and hooks will surface in the event data.
Errors as a result of failing to remove the asset reference on a mutator, handler, or filter will only surface in the backend logs.

Deleting an asset does not delete the archive or downloaded files on disk.
You must remove the archive and downloaded files from the asset cache manually.

[1]: ../sensu-query-expressions/
[2]: ../namespaces/
[3]: ../tokens/#manage-assets
[4]: https://bonsai.sensu.io/assets/samroy92/sensu-plugins-windows
[5]: #metadata-attributes
[6]: ../checks/
[7]: ../filters/
[8]: ../mutators/
[9]: ../handlers/
[10]: ../entities#system-attributes
[11]: ../../sensuctl/create-manage-resources/#create-resources
[12]: #spec-attributes
[13]: https://github.com/sensu/sensu/issues/1919
[14]: #environment-variables-for-asset-paths
[15]: #example-asset-structure
[16]: https://bonsai.sensu.io/
[17]: #token-substitution-for-asset-paths
[18]: https://discourse.sensu.io/t/the-hello-world-of-sensu-assets/1422
[19]: https://regex101.com/r/zo9mQU/2
[20]: ../../api#response-filtering
[21]: ../../sensuctl/filter-responses/
[23]: ../../guides/install-check-executables-with-assets/
[24]: https://github.com
[25]: https://help.github.com/articles/about-releases/
[26]: #bonsaiyml-example
[27]: https://goreleaser.com/
[28]: https://github.com/sensu/sensu-go-plugin/
[29]: https://github.com/sensu-plugins
[30]: ../agent#disable-assets
[37]: https://bonsai.sensu.io/sign-in
[38]: https://bonsai.sensu.io/new
[39]: ../../web-ui/filter#filter-with-label-selectors
[40]: ../../reference/agent/#configuration-via-flags
[41]: ../../reference/backend/#configuration-via-flags
[42]: #filters-attribute
[43]: https://bonsai.sensu.io/assets/sensu/sensu-ruby-runtime
