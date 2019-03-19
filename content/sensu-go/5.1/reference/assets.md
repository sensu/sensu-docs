---
title: "Assets"
linkTitle: "Assets"
description: "Assets are shareable, reusable packages that make it easy to deploy Sensu plugins. You can use assets to provide the plugins, libraries, and runtimes you need to create automated monitoring workflows. Read the reference doc to learn about assets."
weight: 10
version: "5.1"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.1:
    parent: reference
---

- [Specification](#assets-specification)
- [Examples](#examples)

## What is an asset?
An asset is an executable that a check, handler, or mutator can specify as a
dependency. Assets must be a tar archive (optionally gzipped) with scripts or
executables within a bin folder. At runtime, the backend or agent installs
required assets using the specified URL. Assets let you manage runtime
dependencies without using configuration management tools.

## How do assets work?
Assets can be executed by the backend (for handler and mutator assets), or
by the agent (for check assets). At runtime, the entity sequentially fetches
assets and stores them in its local cache. Asset dependencies are then
injected into the `PATH` so they are available when the command is executed.
Subsequent check, handler, or mutator executions look for the asset in local
cache and ensure the contents match the checksum. An entity's local cache can
be set using the `--cache-dir` flag.

### Default cache directory

system  | sensu-backend                               | sensu-agent
--------|---------------------------------------------|-------------
default | `/var/cache/sensu/sensu-backend`            | `/var/cache/sensu/sensu-agent`
Windows | `C:\\ProgramData\sensu\cache\sensu-backend` | `C:\\ProgramData\sensu\cache\sensu-agent`

If the requested asset is not in the local cache, it is downloaded from the asset
URL. The Sensu backend does not currently provide any storage for assets; they
are expected to be retrieved over HTTP or HTTPS.

The agent expects that an asset is a `TAR` archive that may optionally be
GZip'd. Any scripts or executables should be within a `bin/` folder within in
the archive.

The following are injected into the execution context:

- `{PATH_TO_ASSET}/bin` is injected into the `PATH` environment variable.
- `{PATH_TO_ASSET}/lib` is injected into the `LD_LIBRARY_PATH` environment
  variable.
- `{PATH_TO_ASSET}/include` is injected into the `CPATH` environment variable.

## Assets specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute specifying the [`sensuctl create`][sc] resource type. Assets should always be of type `Asset`.
required     | Required for asset definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | String
example      | {{< highlight shell >}}"type": "Asset"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute specifying the Sensu API group and version. For assets in Sensu backend version 5.1, this attribute should always be `core/v2`.
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
    "slack-channel" : "#monitoring"
  }
}{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes the asset [spec attributes][sp].
required     | Required for asset definitions in `wrapped-json` or `yaml` format for use with [`sensuctl create`][sc].
type         | Map of key-value pairs
example      | {{< highlight shell >}}"spec": {
  "url": "http://example.com/asset.tar.gz",
  "sha512": "4f926bf4328fbad2b9cac873d117f771914f4b837c9c85584c38ccf55a3ef3c2e8d154812246e5dda4a87450576b2c58ad9ab40c9e2edc31b288d066b195b21b",
  "filters": [
    "entity.system.os == 'linux'",
    "entity.system.arch == 'amd64'"
  ]
}{{< /highlight >}}

### Spec attributes

url          | 
-------------|------ 
description  | The URL location of the asset. 
required     | true
type         | String 
example      | {{< highlight shell >}}"url": "http://example.com/asset.tar.gz"{{< /highlight >}}

sha512       | 
-------------|------ 
description  | The checksum of the asset. 
required     | true
type         | String 
example      | {{< highlight shell >}}"sha512": "4f926bf4328..."{{< /highlight >}}

filters      | 
-------------|------ 
description  | A set of [Sensu query expressions][1] used by the agent to determine if the asset should be installed. If multiple expressions are included, each expression must return true in order for the agent to install the asset.
required     | false 
type         | Array 
example      | {{< highlight shell >}}"filters": ["entity.system.os=='linux'", "entity.system.arch=='amd64'"] {{< /highlight >}}

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
description  | Custom attributes to include with event data, which can be queried like regular attributes. You can use labels to organize assets into meaningful collections that can be selected using [filters][3] and [tokens][4].
required     | false
type         | Map of key-value pairs. Keys can contain only letters, numbers, and underscores, but must start with a letter. Values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}}"labels": {
  "environment": "development",
  "region": "us-west-2"
}{{< /highlight >}}

| annotations | |
-------------|------
description  | Arbitrary, non-identifying metadata to include with event data. In contrast to labels, annotations are _not_ used internally by Sensu and cannot be used to identify assets. You can use annotations to add data that helps people or external tools interacting with Sensu.
required     | false
type         | Map of key-value pairs. Keys and values can be any valid UTF-8 string.
default      | `null`
example      | {{< highlight shell >}} "annotations": {
  "managed-by": "ops",
  "slack-channel": "#monitoring",
  "playbook": "www.example.url"
}{{< /highlight >}}

## Examples

### Minimum required asset attributes

{{< highlight json >}}
{
  "type": "Asset",
  "api_version": "core/v2",
  "metadata": {
    "name": "check_script",
    "namespace": "default"
  },
  "spec": {
    "url": "http://example.com/asset.tar.gz",
    "sha512": "4f926bf4328fbad2b9cac873d117f771914f4b837c9c85584c38ccf55a3ef3c2e8d154812246e5dda4a87450576b2c58ad9ab40c9e2edc31b288d066b195b21b"
  }
}
{{< /highlight >}}

### Asset definition

{{< highlight json >}}
{
  "type": "Asset",
  "api_version": "core/v2",
  "metadata": {
    "name": "check_script",
    "namespace": "default",
    "labels": {
      "region": "us-west-1"
    },
    "annotations": {
      "slack-channel" : "#monitoring"
    }
  },
  "spec": {
    "url": "http://example.com/asset.tar.gz",
    "sha512": "4f926bf4328fbad2b9cac873d117f771914f4b837c9c85584c38ccf55a3ef3c2e8d154812246e5dda4a87450576b2c58ad9ab40c9e2edc31b288d066b195b21b",
    "filters": [
      "entity.system.os == 'linux'",
      "entity.system.arch == 'amd64'"
    ]
  }
}
{{< /highlight >}}

[1]: ../../reference/sensu-query-expressions/
[2]: ../rbac#namespaces
[3]: ../filters
[4]: ../tokens
[5]: #metadata-attributes
[sc]: ../../sensuctl/reference#creating-resources
[sp]: #spec-attributes
