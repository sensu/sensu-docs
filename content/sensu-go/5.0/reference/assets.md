---
title: "Assets"
linkTitle: "Assets"
description: "The assets reference guide."
weight: 1
version: "5.0"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.0:
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

### Attributes

name         | 
-------------|------ 
description  | The unique name of the asset, validated with go regex [`\A[\w\.\-]+\z`](https://regex101.com/r/zo9mQU/2)
required     | true
type         | String 
example      | {{< highlight shell >}}"name": "check_script"{{< /highlight >}}


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
example      | {{< highlight shell >}}"filters": ["System.OS=='linux'", "System.Arch=='amd64'"] {{< /highlight >}}

organization | 
-------------|------ 
description  | The Sensu RBAC organization that this asset belongs to.
required     | false 
type         | String
default      | current organization value configured for `sensuctl` (ie `default`) 
example      | {{< highlight shell >}}
  "organization": "default"
{{< /highlight >}}

## Examples

### Asset definition
{{< highlight json >}}
{
  "name": "check_script",
  "url": "http://example.com/asset.tar.gz",
  "sha512": "4f926bf4328fbad2b9cac873d117f771914f4b837c9c85584c38ccf55a3ef3c2e8d154812246e5dda4a87450576b2c58ad9ab40c9e2edc31b288d066b195b21b",
  "metadata": null,
  "filters": [
    "System.OS==linux",
    "System.Arch=='amd64'"
  ],
  "organization": "default"
}
{{< /highlight >}}

[1]: ../../reference/sensu-query-expressions/
