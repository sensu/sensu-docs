---
title: "Assets"
linkTitle: "Assets"
description: "Assets are shareable, reusable packages that make it easier to deploy Sensu plugins. You can use assets to provide the plugins, libraries, and runtimes you need to create automated monitoring workflows. Read this reference doc to learn about assets."
weight: 40
version: "5.16"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.16:
    parent: reference
---

- [Asset builds](#asset-builds)
- [Asset format specification](#asset-format-specification)
- [Asset specification](#asset-specification)
  - [Top-level attributes](#top-level-attributes) | [Metadata attributes](#metadata-attributes) | [Spec attributes](#spec-attributes)
- [Examples](#examples)
- [Share an asset on Bonsai](#share-an-asset-on-bonsai)
- [Delete assets](#delete-assets)

You can discover, download, and share assets using [Bonsai, the Sensu asset index][16].
Read [Install plugins with assets][23] to get started.

Assets are shareable, reusable packages that make it easier to deploy Sensu [plugins][29].
You can use assets to provide the plugins, libraries, and runtimes you need to automate your monitoring workflows.
Sensu supports runtime assets for [checks][6], [filters][7], [mutators][8], and [handlers][9].

_**NOTE**: Assets are not required to use Sensu Go in production. You can install Sensu plugins using the [sensu-install][32] tool or a [configuration management][33] solution._

The Sensu backend executes handler, filter, and mutator assets.
The Sensu agent executes check assets.
At runtime, the backend or agent sequentially evaluates assets that appear in the `runtime_assets` attribute of the handler, filter, mutator, or check being executed.

## Asset builds

An asset build is the combination of an artifact URL, SHA512 checksum, and optional [Sensu query expression][1] filters.
Each asset definition may describe one or more builds.

_**NOTE**: Assets that provide `url` and `sha512` attributes at the top level of the `spec` scope are [single-build assets][34], and this form of asset defintion is deprecated. We recommend using [multiple-build asset defintions][35], which specify one or more `builds` under the `spec` scope._

### Asset build evaluation

For each build provided in an asset, Sensu will evaluate any defined filters to determine whether any build matches the agent or backend service's environment.
If all filters specified on a build evaluate to `true`, that build is considered a match.
For assets with multiple builds, only the first build which matches will be downloaded and installed.

### Asset build installation

When Sensu finds a matching build, it downloads the build artifact from the specified URL.
If the asset definition includes headers, they are passed along as part of the HTTP request.
If the downloaded artifact's SHA512 checksum matches the checksum provided by the build, it is unpacked into the Sensu service's local cache directory.

Set the backend or agent's local cache path with the `--cache-dir` flag.
Disable assets for an agent with the agent `--disable-assets` [configuration flag][30].

### Asset build execution

The directory path of each asset defined in `runtime_assets` is appended to the `PATH` before the handler, filter, mutator, or check `command` is executed.
Subsequent handler, filter, mutator, or check executions look for the asset in the local cache and ensure that the contents match the configured checksum.

See the [example asset with a check][31] for a use case with a Sensu resource (a check) and an asset.

## Asset format specification

Sensu expects an asset to be a tar archive (optionally gzipped) that contains one or more executables within a bin folder.
Any scripts or executables should be within a `bin/` folder in the archive.
See the [Sensu Go Plugin template][28] for an example asset and Bonsai configuration.

The following are injected into the execution context:

- `{PATH_TO_ASSET}/bin` is injected into the `PATH` environment variable
- `{PATH_TO_ASSET}/lib` is injected into the `LD_LIBRARY_PATH` environment variable
- `{PATH_TO_ASSET}/include` is injected into the `CPATH` environment variable

_**NOTE**: You cannot create an asset by creating an archive of an existing project (as in previous versions of Sensu for plugins from the [Sensu Plugins community][36]). Follow the steps outlined in [Contributing Assets for Existing Ruby Sensu Plugins][13], a Sensu Discourse guide. For further examples of Sensu users who have added the ability to use a community plugin as an asset, see [this Discourse post][14]._

### Default cache directory

system  | sensu-backend                         | sensu-agent
--------|---------------------------------------|-------------
Linux   | `/var/cache/sensu/sensu-backend`      | `/var/cache/sensu/sensu-agent`
Windows | N/A                                   | `C:\ProgramData\sensu\cache\sensu-agent`

If the requested asset is not in the local cache, it is downloaded from the asset URL.
The Sensu backend does not currently provide any storage for assets.
Sensu expects assets to be retrieved over HTTP or HTTPS.

### Example asset structure

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

### Asset hello world example

In this example, you'll run a script that outputs `Hello World`:

{{< highlight bash >}}
hello-world.sh

#!/bin/sh

STRING="Hello World"

echo $STRING

if [ $? -eq 0 ]; then
    exit 0
else
    exit 2
fi
{{< /highlight >}}

The first step is to ensure that your directory structure is in place.
As noted in [Example asset structure][15], your script could live in three potential directories in the project: `/bin`, `/lib`, or `/include`.
For this example, put your script in the `/bin` directory.
Create the directories `sensu-go-hello-world` and `/bin`:

{{< highlight bash >}}
$ mkdir sensu-go-hello-world

$ cd sensu-go-hello-world

$ mkdir bin

$ cp hello-world.sh bin/

$ tree
.
└── bin
    └── hello-world.sh
{{< /highlight >}}

Next, make sure that the script is marked as executable:

{{< highlight bash >}}
$ chmod +x bin/hello-world.sh 
mode of 'hello-world.sh' changed from 0644 (rw-r--r--) to 0755 (rwxr-xr-x)
{{< /highlight >}}

Now that the script is in the directory, move on to the next step: packaging the `sensu-go-hello-world` directory as an asset tarball.

#### Package the asset

Assets are archives, so the first step in packaging the asset is to create a tar.gz archive of your project.
This assumes you're in the directory you want to tar up:

{{< highlight bash >}}
$ cd ..
$ tar -C sensu-go-hello-world -cvzf sensu-go-hello-world-0.0.1.tar.gz .
...
{{< /highlight >}}

Now that you've created an archive, you need to generate a SHA512 sum for it (this is required for the asset to work):

{{< highlight bash >}}
sha512sum sensu-go-hello-world-0.0.1.tar.gz | tee sha512sum.txt
dbfd4a714c0c51c57f77daeb62f4a21141665ae71440951399be2d899bf44b3634dad2e6f2516fff1ef4b154c198b9c7cdfe1e8867788c820db7bb5bcad83827 sensu-go-hello-world-0.0.1.tar.gz
{{< /highlight >}}

From here, you can host your asset wherever you’d like. To make the asset available via [Bonsai][16], you’ll need to host it on Github. Learn more in [The “Hello World” of Sensu Assets][18] on Discourse.

To host your asset on a different platform like Gitlab or Bitbucket, upload your asset there. You can also use Artifactory or even Apache or Nginx to serve your asset. All that’s required for your asset to work is the URL to the asset and the SHA512 sum for the asset to be downloaded.

## Asset specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the [`sensuctl create`][11] resource type. Assets should always be type `Asset`.
required     | Required for asset definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][11].
type         | String
example      | {{< highlight shell >}}"type": "Asset"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For assets in this version of Sensu, the `api_version` should always be `core/v2`.
required     | Required for asset definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][11].
type         | String
example      | {{< highlight shell >}}"api_version": "core/v2"{{< /highlight >}}

metadata     | 
-------------|------
description  | Top-level collection of metadata about the asset, including the `name` and `namespace` as well as custom `labels` and `annotations`. The `metadata` map is always at the top level of the asset definition. This means that in `wrapped-json` and `yaml` formats, the `metadata` scope occurs outside the `spec` scope. See [metadata attributes][5] for details.
required     | Required for asset definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][11].
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
description  | Top-level map that includes the asset [spec attributes][12].
required     | Required for asset definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][11].
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

### Metadata attributes

name         |      |
-------------|------ 
description  | Unique name of the asset, validated with Go regex [`\A[\w\.\-]+\z`][19].
required     | true
type         | String
example      | {{< highlight shell >}}"name": "check_script"{{< /highlight >}}

| namespace  |      |
-------------|------
description  | [Sensu RBAC namespace][2] that the asset belongs to.
required     | false
type         | String
default      | `default`
example      | {{< highlight shell >}}"namespace": "production"{{< /highlight >}}

| labels     |      |
-------------|------
description  | Custom attributes to include with event data that you can use for response and dashboard view filtering and [tokens][39].<br><br>If you include labels in your event data, you can filter [API responses][20], [sensuctl responses][21], and [dashboard views][40] based on them. In other words, labels allow you to create meaningful groupings for your data.<br><br>Limit labels to metadata you need to use for response filtering. For complex, non-identifying metadata that you will *not* need to use in response filtering, use annotations rather than labels.
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores and must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}}"labels": {
  "environment": "development",
  "region": "us-west-2"
}{{< /highlight >}}

| annotations | |
-------------|------
description  | Non-identifying metadata to include with event data that you can access with [event filters][7] and [tokens][39]. You can use annotations to add data that is meaningful to people or external tools that interact with Sensu.<br><br>In contrast to labels, you cannot use annotations in [API response filtering][20], [sensuctl response filtering][21], or [dashboard views][40].
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}} "annotations": {
  "managed-by": "ops",
  "playbook": "www.example.url"
}{{< /highlight >}}

### Spec attributes

builds       | 
-------------|------ 
description  | List of asset builds used to define multiple artifacts that provide the named asset.
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
description  | URL location of the asset. 
required     | true, unless `builds` are provided
type         | String 
example      | {{< highlight shell >}}"url": "http://example.com/asset.tar.gz"{{< /highlight >}}

sha512       | 
-------------|------ 
description  | Checksum of the asset. 
required     | true, unless `builds` are provided
type         | String 
example      | {{< highlight shell >}}"sha512": "4f926bf4328..."{{< /highlight >}}

filters      | 
-------------|------ 
description  | Set of [Sensu query expressions][1] used to determine if the asset should be installed. If multiple expressions are included, each expression must return `true` for Sensu to install the asset.<br><br>Filters for _check_ assets should match agent entity platforms. Filters for _handler_ and _filter_ assets should match your Sensu backend platform. You can create asset filter expressions using any supported [entity system attributes][10], including `os`, `arch`, `platform`, and `platform_family`. _**PRO TIP**: Asset filters let you reuse checks across platforms safely. Assign assets for multiple platforms to a single check, and rely on asset filters to ensure that only the appropriate asset is installed on each agent._
required     | false 
type         | Array 
example      | {{< highlight shell >}}"filters": ["entity.system.os=='linux'", "entity.system.arch=='amd64'"] {{< /highlight >}}

headers       |       |
--------------|-------|
description   | HTTP headers to apply to asset retrieval requests. You can use headers to access secured assets. For headers that require multiple values, separate the values with a comma.
required     | false
type         | Map of key-value string pairs
example      | {{< highlight shell >}}
"headers": {
  "Authorization": "Bearer $TOKEN",
  "X-Forwarded-For": "client1, proxy1, proxy2"
}
{{< /highlight >}}

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

### Asset definition (single-build, deprecated)

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

### Asset definition (multiple-builds)

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
description  | Project description.
required     | true
type         | String
example      | {{< highlight yml >}}description: "#{repo}"{{< /highlight >}}

 builds      | 
-------------|------
description  | Array of asset details per platform.
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
description  | Platform supported by the asset.
required     | true
type         | String
example      | {{< highlight yml >}}- platform: "linux"{{< /highlight >}}

 arch        | 
-------------|------
description  | Architecture supported by the asset.
required     | true
type         | String
example      | {{< highlight yml >}}  arch: "amd64"{{< /highlight >}}

asset_filename | 
-------------|------
description  | File name of the archive that contains the asset.
required     | true
type         | String
example      | {{< highlight yml >}}asset_filename: "#{repo}_#{version}_linux_amd64.tar.gz"{{< /highlight >}}

sha_filename | 
-------------|------
description  | SHA-512 checksum for the asset archive.
required     | true
type         | String
example      | {{< highlight yml >}}sha_filename: "#{repo}_#{version}_sha512-checksums.txt"{{< /highlight >}}

 filter      | 
-------------|------
description  | Filter expressions that describe the operating system and architecture supported by the asset.
required     | false
type         | Array
example      | {{< highlight yml >}}
  filter:
  -  "entity.system.os == 'linux'"
  -  "entity.system.arch == 'amd64'"
{{< /highlight >}}

## Delete assets

As of Sensu Go 5.12, you can delete assets with the `/assets (DELETE)` endpoint or via `sensuctl` (`sensuctl asset delete`).
When you remove an asset from Sensu, this _*does not*_ remove references to the deleted asset in any other resource (including checks, filters, mutators, handlers, and hooks).
You must also update resources and remove any reference to the deleted asset.
Failure to do so will result in errors like `sh: asset.sh: command not found`. 

Errors as a result of failing to remove the asset from checks and hooks will surface in the event data.
Errors as a result of failing to remove the asset reference on a mutator, handler, or filter will only surface in the backend logs.

Deleting an asset does not delete the archive or downloaded files on disk.
You must remove the archive and downloaded files from the asset cache manually.

[1]: ../sensu-query-expressions/
[2]: ../rbac#namespaces
[5]: #metadata-attributes
[6]: ../checks/
[7]: ../filters/
[8]: ../mutators/
[9]: ../handlers/
[10]: ../entities#system-attributes
[11]: ../../sensuctl/reference#create-resources
[12]: #spec-attributes
[13]: https://discourse.sensu.io/t/contributing-assets-for-existing-ruby-sensu-plugins/1165
[14]: https://discourse.sensu.io/t/how-to-use-the-sensu-plugins-kubernetes-plugin/1286
[15]: #example-asset-structure
[16]: https://bonsai.sensu.io/
[18]: https://discourse.sensu.io/t/the-hello-world-of-sensu-assets/1422
[19]: https://regex101.com/r/zo9mQU/2
[20]: ../../api/overview#response-filtering
[21]: ../../sensuctl/reference#response-filters
[23]: ../../guides/install-check-executables-with-assets/
[24]: https://github.com
[25]: https://help.github.com/articles/about-releases/
[26]: #bonsai-yml-specification
[27]: https://goreleaser.com/
[28]: https://github.com/sensu/sensu-go-plugin/
[29]: /plugins/latest/reference/
[30]: ../agent#disable-assets
[31]: #example-asset-with-a-check
[32]: ../../installation/plugins/#install-plugins-with-the-sensu-install-tool
[33]: ../../installation/configuration-management/
[34]: #asset-definition-single-build-deprecated
[35]: #asset-definition-multiple-builds
[36]: https://github.com/sensu-plugins/
[37]: https://bonsai.sensu.io/sign-in
[38]: https://bonsai.sensu.io/new
[39]: ../tokens/
[40]: ../../dashboard/filtering#filter-with-label-selectors
