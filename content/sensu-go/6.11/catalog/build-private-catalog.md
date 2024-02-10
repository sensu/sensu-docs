---
title: "Build a private catalog of Sensu integrations"
linkTitle: "Build a Private Catalog"
guide_title: "Build a private catalog of Sensu integrations"
type: "guide"
description: "Use Sensu's catalog-api tool to build your own private catalog of customized integrations and serve it to users directly in the Sensu web UI."
weight: 40
version: "6.11"
product: "Sensu Go"
menu: 
  sensu-go-6.11:
    parent: catalog
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the Sensu Catalog and integrations in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

{{% notice note %}}
**NOTE**: The Sensu Catalog is in public preview and is subject to change.
{{% /notice %}}

The [Sensu Catalog][1] is a collection of Sensu integrations that provide reference implementations for effective monitoring and observability.
The official Sensu Catalog is available in the [web UI][2], but you can also create a private catalog of custom integrations and make it available to users in place of the official Sensu Catalog.

## Requirements

To follow this guide, install the Sensu [backend][5], make sure at least one Sensu [agent][6] is running, and install and configure [sensuctl][7].

You will also need a GitHub repository that stores the integration files you want to include in your private catalog.
Before you begin, make sure that the repository follows the required [organizational framework][3].

To serve your private catalog, you will need an endpoint URL that is fetchable for your web UI users.

## Update URLs in integration asset builds (optional)

{{% notice note %}}
**NOTE**: If your catalog assets are stored publicly, you do not need to complete this step.
Continue to [Install the catalog-api command line tool](#install-the-catalog-api-command-line-interface-tool).
{{% /notice %}}

If the assets for your private catalog are stored behind a firewall or are otherwise not publicly available, update the asset definitions in your `sensu-resources.yaml` files to use the endpoint URL that will serve your catalog.

For example, in the official Sensu Catalog repository, asset definitions include `assets.bonsai.sensu.io` in the `builds.url` values:

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

If assets are not publicly available, replace `assets.bonsai.sensu.io` with your preferred URL in asset `builds.url` values in all `sensu-resources.yaml` files before you continue.
You do not need to change the asset `builds.SHA512` values.

## Install the catalog-api command line interface tool

The catalog-api command line interface tool is an open-source static API generator: it renders static HTTP API content that the Sensu web UI can consume.

To install the catalog-api tool:

1. Clone the Sensu Catalog API repository and navigate to the local catalog-api repository:
{{< code shell >}}
git clone https://github.com/sensu/catalog-api && cd catalog-api
{{< /code >}}

2. Build the catalog-api tool:
{{< code shell >}}
go build
{{< /code >}}

3. Exit your local copy of the catalog-api repository:
{{< code shell >}}
cd ..
{{< /code >}}

## Clone and validate the integration repository

The catalog-api tool consumes content from a repository that includes all the files required to build a catalog of integrations.
Follow these steps to clone your repository and validate that all files are organized properly:

1. Clone the repository that stores your Sensu integrations.
Replace <REPO_URL> with the URL for your integrations repository uses Sensu's public integration repository:
{{< code shell >}}
git clone <REPO_URL>
{{< /code >}}

2. Navigate to your local copy of the repository that stores the Sensu integrations.
Replace <REPO_NAME> with the repository name (for example, for https://github.com/sensu/catalog, the <REPO_NAME> is `catalog`):
{{< code shell >}}
cd <REPO_NAME>
{{< /code >}}

3. Validate the integration repository contents:
{{< code shell >}}
../catalog-api/catalog-api catalog validate
{{< /code >}}

   The response lists the integrations found in the local integration repository:

   {{< code text >}}
11:05AM INF Found integration version name=ansible-tower-remediation namespace=ansible source=path version=99991231.0.0
11:05AM INF Found integration version name=aws-alb-monitoring namespace=aws source=path version=99991231.0.0
11:05AM INF Found integration version name=aws-ec2-monitoring namespace=aws source=path version=99991231.0.0
...
11:05AM INF Found integration version name=wavefront-metrics namespace=wavefront source=path version=99991231.0.0
{{< /code >}}

## Generate the private catalog

With a validated repository, you can generate your private catalog locally.
The `generate` subcommand generates the static API in a temporary directory, `/tmp/generated-api/`:

{{< code shell >}}
../catalog-api/catalog-api catalog generate
{{< /code >}}

To specify a different temporary directory, use the `--temp-dir` command line flag:

{{< code shell >}}
../catalog-api/catalog-api catalog generate --temp-dir /tmp/2523661925/release
{{< /code >}}

## Publish the static API to an endpoint

Once you generate your private catalog in a temporary directory, you can serve the output on any HTTP service and publish it to any endpoint.
For example, you can copy the private catalog contents from the temporary directory to a storage service and use a content delivery network (CDN) to serve the content from your storage service to the endpoint URL.

The only requirement is that the endpoint URL must be fetchable for your web UI users.
The web UI fetches catalog content from your endpoint; the Sensu backend does not serve any of the catalog content.

## Create a UI GlobalConfig definition

Use Sensu's GlobalConfig resource to display the private catalog in the Sensu web UI.
Create a GlobalConfig definition that includes the endpoint URL for your private catalog as the `url` value (this example uses `https://catalog.sensu.io:443`):

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

Log into the Sensu web UI at the URL specified in your GlobalConfig resource and navigate to the Catalog page.
The Catalog page should include all of the integrations in your repository.

## What's next

Review the official [Sensu Catalog repository][4] as an example of repository setup and integration configuration.

The Catalog integrations reference includes the [integration specification][10] as well as details about the [catalog-api command line interface tool][8] and the [server subcommand][9], which you can use to serve integrations from your local environment during development.


[1]: ../sensu-catalog/
[2]: ../../web-ui/
[3]: ../catalog-reference/#catalog-repository-example
[4]: https://github.com/sensu/catalog
[5]: ../../operations/deploy-sensu/install-sensu/#install-the-sensu-backend
[6]: ../../operations/deploy-sensu/install-sensu/#install-sensu-agents
[7]: ../../operations/deploy-sensu/install-sensu/#install-sensuctl
[8]: ../catalog-reference/#catalog-api-command-line-interface-tool
[9]: ../catalog-reference/#server-subcommand
[10]: ../catalog-reference/#integration-specification
