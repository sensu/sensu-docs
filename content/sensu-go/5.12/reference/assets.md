---
title: "Assets"
linkTitle: "Assets"
description: "Assets are shareable, reusable packages that make it easy to deploy Sensu plugins. You can use assets to provide the plugins, libraries, and runtimes you need to create automated monitoring workflows. Read the reference doc to learn about assets."
weight: 10
version: "5.12"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.12:
    parent: reference
---

- [What is an asset?](#what-is-an-asset)
- [How do assets work?](#how-do-assets-work)
- [Asset format specification](#asset-format-specification)
- [Asset specification](#asset-specification)
- [Examples](#examples)
- [Sharing an asset on Bonsai](#sharing-an-asset-on-bonsai)
- [Deleting Assets](#deleting-assets)

You can discover, download, and share assets using [Bonsai, the Sensu asset index][16].
Read the [guide to using assets][23] to get started.

## What is an asset?
Assets are shareable, reusable packages that make it easy to deploy Sensu [plugins](/plugins/latest/reference).
You can use assets to provide the plugins, libraries, and runtimes you need to automate your monitoring workflows.
Sensu supports runtime assets for [checks][6], [filters][7], [mutators][8], and [handlers][9].

_NOTE: Assets are not required to use Sensu Go in production. Sensu plugins can still be installed using the [sensu-install][32] tool or a [configuration management][33] solution._

## How do assets work?
Assets can be executed by the backend (for handler, filter, and mutator assets), or
by the agent (for check assets).
At runtime, the backend or agent sequentially evaluates assets that appear in the `runtime_assets` attribute of the handler, filter, mutator or check being executed.

### What are asset builds?

An asset build is the combination of an artifact URL, SHA512 checksum and optional [Sensu query expression][1] filters. Each asset definition may describe one or more builds.

_NOTE: Assets which provide `url` and `sha512` attributes at the top-level of the `spec` scope are [single build assets](#asset-definition-single-build-deprecated) -- this form of asset defintion is deprecated. We recommend using [multiple build asset defintions](#asset-definition-multiple-builds), which specify one or more `builds` under the `spec` scope._

### How are asset builds evaluated?

For each build provided in an asset, Sensu will evaluate any defined filters to determine whether any build matches the agent or backend service's environment. If all filters specified on a build evaluate to true, that build is considered a match. For assets with multiple builds, only the first build which matches will be downloaded and installed.

### How are asset builds installed?

After finding a matching build, the build artifact will be downloaded from the provided URL. If the asset definition includes headers, these will be passed along as part of the HTTP request. If the downloaded artifact's SHA512 checksum matches the checksum provided by the build, it is unpacked into the Sensu service's local cache directory.

The backend or agent's local cache path can be set using the `--cache-dir` flag.
You can disable assets for an agent using the agent `--disable-assets` [configuration flag][30].

### How are asset builds executed?

The directory path of each asset defined in `runtime_assets` is appended to the `PATH` before the handler, filter, mutator or check `command` is executed.
Subsequent handler, filter, mutator or check executions look for the asset in the local cache and ensure the contents match the configured checksum.

You can find a use case using a Sensu resource (a check) and an asset in this [example asset with a check][31].

## Asset format specification

Sensu expects an asset to be a tar archive (optionally gzipped) containing one or more executables within a bin folder.
Any scripts or executables should be within a `bin/` folder within in the archive.
See the [Sensu Go Plugin template][28] for an example asset and Bonsai configuration.

The following are injected into the execution context:

- `{PATH_TO_ASSET}/bin` is injected into the `PATH` environment variable.
- `{PATH_TO_ASSET}/lib` is injected into the `LD_LIBRARY_PATH` environment
  variable.
- `{PATH_TO_ASSET}/include` is injected into the `CPATH` environment variable.

### Default cache directory

system  | sensu-backend                               | sensu-agent
--------|---------------------------------------------|-------------
Linux   | `/var/cache/sensu/sensu-backend`            | `/var/cache/sensu/sensu-agent`
Windows | N/A                                         | `C:\ProgramData\sensu\cache\sensu-agent`

If the requested asset is not in the local cache, it is downloaded from the asset
URL. The Sensu backend does not currently provide any storage for assets; they
are expected to be retrieved over HTTP or HTTPS.

### Example structure
{{< highlight shell >}}
sensu-example-handler_1.0.0_linux_amd64
├── CHANGELOG.md
├── LICENSE
├── README.md
└── bin
  └── my-check.sh
└── lib
└── include
{{< /highlight >}}

## Asset specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute specifying the [`sensuctl create`][sc] resource type. Assets should always be of type `Asset`.
required     | Required for asset definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"type": "Asset"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute specifying the Sensu API group and version. For assets in this version of Sensu, this attribute should always be `core/v2`.
required     | Required for asset definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"api_version": "core/v2"{{< /highlight >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the asset, including the `name` and `namespace` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the asset definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope.  See the [metadata attributes reference][5] for details.
required     | Required for asset definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | Map of key-value pairs
example      | {{< highlight shell >}}"metadata": {
  "name": "check_script",
  "namespace": "default",
  "labels": {
    "region": "us-west-1"
  },
  "annotations": {
    "playbook" : "www.example.url"
  }
}{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes the asset [spec attributes][sp].
required     | Required for asset definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | Map of key-value pairs
example (multiple builds)     | {{< highlight shell >}}"spec": {
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
  ],
  "headers": {
    "Authorization": "Bearer $TOKEN",
    "X-Forwarded-For": "client1, proxy1, proxy2"
  }
}{{< /highlight >}}
example (single build, deprecated)     | {{< highlight shell >}}"spec": {
  "url": "http://example.com/asset.tar.gz",
  "sha512": "4f926bf4328fbad2b9cac873d117f771914f4b837c9c85584c38ccf55a3ef3c2e8d154812246e5dda4a87450576b2c58ad9ab40c9e2edc31b288d066b195b21b",
  "filters": [
    "entity.system.os == 'linux'",
    "entity.system.arch == 'amd64'"
  ],
  "headers": {
    "Authorization": "Bearer $TOKEN",
    "X-Forwarded-For": "client1, proxy1, proxy2"
  }
}{{< /highlight >}}

### Spec attributes

builds       | 
-------------|------ 
description  | A list of asset builds used to define multiple artifacts which provide the named asset.
required     | true, if `url`, `sha512` and `filters` are not provided
type         | Array
example      | {{< highlight shell >}}"builds": [
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
  ]{{< /highlight >}}

url          | 
-------------|------ 
description  | The URL location of the asset. 
required     | true, unless `builds` are provided.
type         | String 
example      | {{< highlight shell >}}"url": "http://example.com/asset.tar.gz"{{< /highlight >}}

sha512       | 
-------------|------ 
description  | The checksum of the asset. 
required     | true, unless `builds` are provided.
type         | String 
example      | {{< highlight shell >}}"sha512": "4f926bf4328..."{{< /highlight >}}

filters      | 
-------------|------ 
description  | A set of [Sensu query expressions][1] used to determine if the asset should be installed. If multiple expressions are included, each expression must return true in order for Sensu to install the asset.<br><br>Filters for _check_ assets should match agent entity platforms, while filters for _handler and filter_ assets should match your Sensu backend platform. You can create asset filter expressions using any supported [entity system attributes][10], including `os`, `arch`, `platform`, and `platform_family`. _PRO TIP: Asset filters let you reuse checks across platforms safely. Assign assets for multiple platforms to a single check, and rely on asset filters to ensure that only the appropriate asset is installed on each agent._
required     | false 
type         | Array 
example      | {{< highlight shell >}}"filters": ["entity.system.os=='linux'", "entity.system.arch=='amd64'"] {{< /highlight >}}

headers       |       |
--------------|-------|
description   | HTTP headers to apply to asset retrieval requests. You can use headers to access secured assets. For headers requiring multiple values, separate values with a comma.
required     | false
type         | Map of key-value string pairs
example      | {{< highlight shell >}}
"headers": {
  "Authorization": "Bearer $TOKEN",
  "X-Forwarded-For": "client1, proxy1, proxy2"
}
{{< /highlight >}}

### Metadata attributes

name         |      |
-------------|------ 
description  | The unique name of the asset, validated with Go regex [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2).
required     | true
type         | String
example      | {{< highlight shell >}}"name": "check_script"{{< /highlight >}}

| namespace  |      |
-------------|------
description  | The [Sensu RBAC namespace][2] that this asset belongs to.
required     | false
type         | String
default      | `default`
example      | {{< highlight shell >}}"namespace": "production"{{< /highlight >}}

| labels     |      |
-------------|------
description  | Custom attributes you can use to create meaningful collections that can be selected with [API filtering][api-filter] and [sensuctl filtering][sensuctl-filter]. Overusing labels can impact Sensu's internal performance, so we recommend moving complex, non-identifying metadata to annotations.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores, but must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}}"labels": {
  "environment": "development",
  "region": "us-west-2"
}{{< /highlight >}}

| annotations | |
-------------|------
description  | Non-identifying metadata that's meaningful to people interacting with Sensu.<br><br>In contrast to labels, annotations cannot be used in [API filtering][api-filter] or [sensuctl filtering][sensuctl-filter] and do not impact Sensu's internal performance.
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}} "annotations": {
  "managed-by": "ops",
  "playbook": "www.example.url"
}{{< /highlight >}}

## Examples

### Minimum required asset attributes

{{< language-toggle >}}

{{< highlight yml >}}
type: Asset
api_version: core/v2
metadata:
  name: check_script
  namespace: default
spec:
  builds:
  - sha512: 4f926bf4328fbad2b9cac873d117f771914f4b837c9c85584c38ccf55a3ef3c2e8d154812246e5dda4a87450576b2c58ad9ab40c9e2edc31b288d066b195b21b
    url: http://example.com/asset.tar.gz
{{< /highlight >}}

{{< highlight json >}}
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
{{< /highlight >}}

{{< /language-toggle >}}

### Asset definition (single build, deprecated)

{{< language-toggle >}}

{{< highlight yml >}}
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
    Authorization: Bearer $TOKEN
    X-Forwarded-For: client1, proxy1, proxy2
{{< /highlight >}}

{{< highlight json >}}
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
      "Authorization": "Bearer $TOKEN",
      "X-Forwarded-For": "client1, proxy1, proxy2"
    }
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

### Asset definition (multiple builds)

{{< language-toggle >}}

{{< highlight yml >}}
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
      Authorization: Bearer $TOKEN
      X-Forwarded-For: client1, proxy1, proxy2
  - url: https://assets.bonsai.sensu.io/981307deb10ebf1f1433a80da5504c3c53d5c44f/sensu-go-cpu-check_0.0.3_linux_armv7.tar.gz
    sha512: 70df8b7e9aa36cf942b972e1781af04815fa560441fcdea1d1538374066a4603fc5566737bfd6c7ffa18314edb858a9f93330a57d430deeb7fd6f75670a8c68b
    filters:
    - entity.system.os == 'linux'
    - entity.system.arch == 'arm'
    - entity.system.arm_version == 7
    headers:
      Authorization: Bearer $TOKEN
      X-Forwarded-For: client1, proxy1, proxy2
  - url: https://assets.bonsai.sensu.io/981307deb10ebf1f1433a80da5504c3c53d5c44f/sensu-go-cpu-check_0.0.3_windows_amd64.tar.gz
    sha512: 10d6411e5c8bd61349897cf8868087189e9ba59c3c206257e1ebc1300706539cf37524ac976d0ed9c8099bdddc50efadacf4f3c89b04a1a8bf5db581f19c157f
    filters:
    - entity.system.os == 'windows'
    - entity.system.arch == 'amd64'
    headers:
      Authorization: Bearer $TOKEN
      X-Forwarded-For: client1, proxy1, proxy2
{{< /highlight >}}

{{< highlight json >}}
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
          "Authorization": "Bearer $TOKEN",
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
          "Authorization": "Bearer $TOKEN",
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
          "Authorization": "Bearer $TOKEN",
          "X-Forwarded-For": "client1, proxy1, proxy2"
        }
      }
    ]
  }
}
{{< /highlight >}}

{{< /language-toggle >}}

### Example asset with a check

{{< language-toggle >}}

{{< highlight yml >}}
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
{{< /highlight >}}

{{< highlight wrapped-json >}}
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
{{< /highlight >}}

{{< /language-toggle >}}

## Sharing an asset on Bonsai

Share your open-source assets on [Bonsai][16] and connect with the Sensu Community.
Bonsai supports assets hosted on [GitHub](https://github.com) and released using [GitHub releases](https://help.github.com/articles/about-releases/).
For more information about creating Sensu Plugins, see the [Sensu Plugin specification][29].

Bonsai requires a [`bonsai.yml` configuration file](#bonsai-yml-specification) in the root directory of your repository that includes the project description, platforms, asset filenames, and SHA-512 checksums.
For a Bonsai-compatible asset template using Go and [GoReleaser](https://goreleaser.com/), see the [Sensu Go plugin skeleton][28].

To share your asset on Bonsai, [log in to Bonsai](https://bonsai.sensu.io/sign-in) with your GitHub account and authorize Sensu.
Once logged in, you can [register your asset on Bonsai](https://bonsai.sensu.io/new) by adding the GitHub repository, description, and tags.
Make sure to provide a helpful README for your asset with configuration examples.

### `bonsai.yml` example

{{< highlight yml >}}
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
{{< /highlight >}}

### `bonsai.yml` specification

 description | 
-------------|------
description  | The project description
required     | true
type         | String
example      | {{< highlight yml >}}description: "#{repo}"{{< /highlight >}}

 builds      | 
-------------|------
description  | An array of asset details per platform
required     | true
type         | Array
example      | {{< highlight yml >}}
builds:
- platform: "linux"
  arch: "amd64"
  asset_filename: "#{repo}_#{version}_linux_amd64.tar.gz"
  sha_filename: "#{repo}_#{version}_sha512-checksums.txt"
  filter:
  -  "entity.system.os == 'linux'"
  -  "entity.system.arch == 'amd64'"
{{< /highlight >}}

### Builds specification

 platform    | 
-------------|------
description  | The platform supported by the asset
required     | true
type         | String
example      | {{< highlight yml >}}- platform: "linux"{{< /highlight >}}

 arch        | 
-------------|------
description  | The architecture supported by the asset
required     | true
type         | String
example      | {{< highlight yml >}}  arch: "amd64"{{< /highlight >}}

asset_filename | 
-------------|------
description  | The filename of the archive containing the asset
required     | true
type         | String
example      | {{< highlight yml >}}asset_filename: "#{repo}_#{version}_linux_amd64.tar.gz"{{< /highlight >}}

sha_filename | 
-------------|------
description  | The SHA-512 checksum for the asset archive
required     | true
type         | String
example      | {{< highlight yml >}}sha_filename: "#{repo}_#{version}_sha512-checksums.txt"{{< /highlight >}}

 filter      | 
-------------|------
description  | Filter expressions describing the operating system and architecture supported by the asset
required     | false
type         | Array
example      | {{< highlight yml >}}
  filter:
  -  "entity.system.os == 'linux'"
  -  "entity.system.arch == 'amd64'"
{{< /highlight >}}

## Deleting Assets

As of Sensu Go 5.12, assets can be deleted using the `/assets (DELETE)` endpoint, or via `sensuctl` (`sensuctl asset delete`). Note that when an asset is removed from Sensu, this _*does not*_ remove references to the deleted asset in any other resource (checks, filters, mutators, handlers, hooks). You must also update resources and remove any reference to the deleted asset. Failure to do so will result in errors like: `sh: asset.sh: command not found`. 

Errors as a result of failing to remove the asset from checks and hooks will be surfaced in the event data, whereas failing to remove the asset reference on a mutator, handler and filter will only be surfaced in the backend logs.

It is also worth noting that deleting an asset does not delete the archive or downloaded files on disk. These must be removed from the asset cache manually.

[1]: ../sensu-query-expressions/
[2]: ../rbac#namespaces
[3]: ../filters
[4]: ../tokens
[5]: #metadata-attributes
[6]: ../checks
[7]: ../filters
[8]: ../mutators
[9]: ../handlers
[10]: ../entities#system-attributes
[sc]: ../../sensuctl/reference#creating-resources
[sp]: #spec-attributes
[16]: https://bonsai.sensu.io
[17]: ../../getting-started/enterprise
[23]: ../../guides/install-check-executables-with-assets
[28]: https://github.com/sensu/sensu-go-plugin
[29]: /plugins/latest/reference/
[api-filter]: ../../api/overview#filtering
[sensuctl-filter]: ../../sensuctl/reference#filtering
[30]: ../agent#disable-assets
[31]: #example-asset-with-a-check
[32]: ../../installation/plugins/#installing-plugins-using-the-sensu-install-tool
[33]: ../../installation/configuration-management/
