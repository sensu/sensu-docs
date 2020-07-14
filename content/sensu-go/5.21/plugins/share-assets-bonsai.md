---
title: "Share assets on Bonsai"
linkTitle: "Share assets on Bonsai"
description: "Assets are shareable, reusable packages that make it easier to deploy Sensu plugins. You can use assets to provide the plugins, libraries, and runtimes you need to create automated monitoring workflows. Read this reference doc to learn about assets."
weight: 70
version: "5.21"
product: "Sensu Go"
platformContent: false 
menu:
  sensu-go-5.21:
    parent: plugins
---

Share your open-source assets on [Bonsai][16] and connect with the Sensu community.
Bonsai supports assets hosted on [GitHub][24] and released using [GitHub releases][25].
For more information about creating Sensu Plugins, see the [Sensu Plugin specification][29].

Bonsai requires a [`bonsai.yml` configuration file][26] in the root directory of your repository that includes the project description, platforms, asset filenames, and SHA-512 checksums.
For a Bonsai-compatible asset template using Go and [GoReleaser][27], see the [Sensu Go plugin skeleton][28].

To share your asset on Bonsai, [log in to Bonsai][37] with your GitHub account and authorize Sensu.
After you are logged in, you can [register your asset on Bonsai][38] by adding the GitHub repository, a description, and tags.
Make sure to provide a helpful README for your asset with configuration examples.

## `bonsai.yml` example

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

## `bonsai.yml` specification

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

## Builds specification

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


[1]: ../sensu-query-expressions/
[2]: ../rbac#namespaces
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
[29]: /plugins/latest/reference/
[30]: ../agent#disable-assets
[31]: #example-asset-with-a-check
[34]: #asset-definition-single-build-deprecated
[35]: #asset-definition-multiple-builds
[37]: https://bonsai.sensu.io/sign-in
[38]: https://bonsai.sensu.io/new
[39]: ../../web-ui/filter#filter-with-label-selectors
[40]: ../../reference/agent/#configuration-via-flags
[41]: ../../reference/backend/#configuration
[42]: #filters
[43]: https://bonsai.sensu.io/assets/sensu/sensu-ruby-runtime
