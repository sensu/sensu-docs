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

## Generate a catalog API

**NEEDED**: is this GitHub-only?

The Sensu Catalog API renders static HTTP API content that the Sensu web UI can consume.
Use the catalog-api command line tool to generate a catalog API:

1. Clone the Sensu Catalog API repository:
{{< code shell >}}
git clone https://github.com/sensu/catalog-api
{{< /code >}}

2. Clone the repository that stores the Sensu integrations (this example uses Sensu's public integration repository):
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

5. Navigate to the **NEEDED**:
{{< code shell >}}
cd ../catalog
{{< /code >}}

6. Generate the local catalog:
{{< code shell >}}
../catalog-api/catalog-api catalog generate
{{< /code >}}

The `catalog generate` command will generate the static API into a temp directory.

**NEEDED**: What/where is the temp directory? How can users preview their integration as they are devloping it?




[1]: ../sensu-catalog/
[2]: ../
[3]: ../catalog-reference/#catalog-repository-example
