---
title: "Build a private catalog of Sensu integrations"
linkTitle: "Build a Private Catalog"
guide_title: "Build a private catalog of Sensu integrations"
type: "guide"
description: "Use Sensu's Catalog API to build and host your own private catalog of Sensu integrations."
weight: 50
version: "6.8"
product: "Sensu Go"
menu: 
  sensu-go-6.8:
    parent: web-ui
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the Sensu Catalog and integrations in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

The [Sensu Catalog][1] is a collection of Sensu integrations that provide reference implementations for effective observability.
The official Sensu Catalog is available in the [web UI][2], but you can also create a private catalog of custom integrations and make it available to users in the Sensu web UI.

Before you begin, make sure that your integration files are saved in a repository that follows the required [organizational framework][3].

Catalogs are namespaced, so you can have separate private catalogs with specific integrations for differnt groups of users.

## Update URLs in integration asset builds

If the assets for your private catalog are stored behind a firewall, update the asset definitions in your `sensu-resources.yaml` files to use the endpoint URL that will serve your catalog.

For example, if you fork the [Sensu Catalog repository][4] as the starting point for your private catalog, asset definitions will include `assets.bonsai.sensu.io` in the `builds.url` values:

{{< code yaml >}}
---
type: Asset
api_version: core/v2
metadata:
  name: sensu/nginx-check
  namespace: default
spec:
  builds:
  - filters:
    - entity.system.os == 'linux'
    - entity.system.arch == 'arm'
    - entity.system.arm_version == 6
    headers: null
    sha512: 6471e770fa4232068e1d96b2ad79529483b23dcae109932f095a3d1e59fa22410205c2eb63948e2651120b217b5bd908856d3cc318af803a45cc531c837a992e
    url: https://assets.bonsai.sensu.io/02bff14ff7f692daab5cace39dcc6e184751285a/nginx-check_0.1.0_linux_armv6.tar.gz
  - filters:
    - entity.system.os == 'linux'
    - entity.system.arch == 'arm'
    - entity.system.arm_version == 7
    headers: null
    sha512: 714e777c214fd5a7210b67030eb761f5d8c7f8e9ba55f6a0d64872f43f27848eaf51c17bd7b3e3efbdc419d4e4754c6143c705b06ddd750009f8068872e5d35d
    url: https://assets.bonsai.sensu.io/02bff14ff7f692daab5cace39dcc6e184751285a/nginx-check_0.1.0_linux_armv7.tar.gz
  - filters: ...
{{< /code >}}

If needed, update the URL for assets in all `sensu-resources.yaml` files before you continue.

## Generate a catalog API

The Sensu Catalog API includes the catalog-api command line tool.
The catalog-api tool is an open-source static API generator: it renders static HTTP API content that the Sensu web UI can consume.

Use catalog-api to generate a catalog API:

1. Clone the Sensu Catalog API repository:
{{< code shell >}}
git clone https://github.com/sensu/catalog-api
{{< /code >}}

2. Clone the repository that stores your Sensu integrations.
This example uses Sensu's public integration repository:
{{< code shell >}}
git clone https://github.com/sensu/catalog
{{< /code >}}

3. Navigate to the local catalog-api repository:
{{< code shell >}}
cd catalog-api
{{< /code >}}

4. Build the `catalog-api` tool:
{{< code shell >}}
go build
{{< /code >}}

5. Navigate to your local copy of the repository that stores the Sensu integrations.
This example uses https://github.com/sensu/catalog, so the repository is `catalog`: 
{{< code shell >}}
cd ../catalog
{{< /code >}}

6. Generate the local catalog:
{{< code shell >}}
../catalog-api/catalog-api catalog generate
{{< /code >}}

The `generate` command generates the static API in a temporary directory, `/tmp/generated-api/`.

These catalog builds are versioned so that every previous iteration is available.

The catalog-api tool generates builds into a checksum-based output directory structure.
The path to the latest or production Catalog API content is managed by a `version.json` file (in this example, the file would be https://catalog.sensu.io/version.json) that instructs the Sensu web UI to load API contents from the specified checksum subdirectory.
For example:

{{< code text >}}
{
  "release_sha256": "d0e2ba810c3d546c82121406fb5f214e66aeb7fe9026706f9a7391463cf4da19",
  "last_updated": 1657574563
}
{{< /code >}}

**TODO** I think I'm missing something here. Maybe something to do with the tags.

## Publish the static API to an endpoint

Once you have generated the static API, you can serve the output on any HTTP service and publish it to any endpoint.

The only requirement is that the endpoint URL must be fetchable for your web UI users.
The web UI fetches catalog content from your endpoint; the Sensu backend does not serve any of the catalog content.

## Create a UI GlobalConfig definition

Use Sensu's GlobalConfig resource to display the private catalog in the Sensu web UI.
Create a GlobalConfig definition that includes the static API endpoint for your catalog as the `url` value:

{{< language-toggle >}}

{{< code shell "YML" >}}
cat << EOF | sensuctl create
---
type: GlobalConfig
api_version: web/v1
metadata:
  name: private-catalog
spec:
  always_show_local_cluster: true
  catalog:
    url: "https://catalog.sensu.io:443"
    release_version: version
EOF
{{< /code >}}

{{< code shell "JSON" >}}
cat << EOF | sensuctl create
{
  "type": "GlobalConfig",
  "api_version": "web/v1",
  "metadata": {
    "name": "private-catalog"
  },
  "spec": {
    "always_show_local_cluster": true,
    "catalog": {
      "url": "https://catalog.sensu.io:443",
      "release_version": "version"
    }
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

## Confirm the private catalog is available in the web UI

Log into the Sensu web UI and navigate to the Catalog page.
The page should include all of the integrations in your repository.


[1]: ../sensu-catalog/
[2]: ../
[3]: ../catalog-reference/#catalog-repository-example
[4]: https://github.com/sensu/catalog
