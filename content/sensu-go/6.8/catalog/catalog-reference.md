---
title: "Catalog integrations reference"
linkTitle: "Catalog Integrations Reference"
reference_title: "Catalog integrations"
type: "reference"
description: "Create integrations that allow teams to configure observability for the systems you rely on and serve them in your own Sensu Catalog."
weight: 60
version: "6.8"
product: "Sensu Go"
menu: 
  sensu-go-6.8:
    parent: catalog
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the Sensu Catalog and integrations in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

{{% notice note %}}
**NOTE**: The Sensu Catalog is in public preview and is subject to change.
{{% /notice %}}

The [Sensu Catalog][1] is a collection of Sensu integrations that provide reference implementations for effective observability.
The contents of the official Sensu Catalog are periodically published with the Sensu Catalog API, which is hosted at https://catalog.sensu.io and displayed within the Sensu web UI.

When users install integrations in the Sensu web UI, they receive prompts to enter information.
For example, the DNS Monitoring integration includes prompts for the domain name, record type, record class, servers, and port to query.
Sensu then applies the user's customizations to the integration's resource definitions and automatically deploys the integration configuration to agents in real time.
No external configuration management is required.

The Sensu Catalog provides a way for you and your teams to configure powerful real-time monitoring and observability for the systems you rely on.
Integrations are self-service, and the Catalog is designed to help you scale up with fewer barriers.

## Catalog repository example

The repository that stores Sensu integrations must organize files in the following structure:

{{< code text >}}
integrations/
└── <namespace>/
    └── <integration_name>/
        ├── img/
        │   ├── dashboard-1.gif
        │   └── dashboard-2.png
        ├── CHANGELOG.md
        ├── README.md
        ├── logo.png
        ├── sensu-integration.yaml
        └── sensu-resources.yaml
    └── <integration_name>/
        ├── img/
        │   ├── dashboard-1.gif
        │   └── dashboard-2.png
        ├── CHANGELOG.md
        ├── README.md
        ├── logo.png
        ├── sensu-integration.yaml
        └── sensu-resources.yaml
└── <namespace>/
    └── <integration_name>/
        ├── img/
        │   ├── dashboard-1.gif
        │   └── dashboard-2.png
        ├── CHANGELOG.md
        ├── README.md
        ├── logo.png
        ├── sensu-integration.yaml
        └── sensu-resources.yaml
{{< /code >}}

{{% notice note %}}
**NOTE**: In the context of catalog integration organization, `namespace` does not refer to the Sensu [role-based access control (RBAC) namespace](../../operations/control-access/namespaces/).
In catalogs, namespaces are categories for integrations.
For example, in the official Sensu Catalog, all integrations for AWS services are organized within the [`aws` namespace](https://github.com/sensu/catalog/tree/main/integrations/aws).
{{% /notice %}}

File | Description
---- | -----------
`img` | Images used in the integration README.md, such as screenshots of available dashboards. Image files must be GIF, JPEG, or PNG format. External image links are not supported. Optional.
`CHANGELOG.md` | Changelog for the integration. Not displayed in the web UI. Optional.
`README.md` | Help documentation for the integration, including an overview, setup steps, descriptions of the events and metrics the integration produces, and links to supplemental reference information. Sensu supports [GitHub-flavored Markdown][3] for integration READMEs. Required.
`logo.png` | Logo image to display in the web UI integration browser. Logo files must be PNG format. Required.
`sensu-integration.yaml` | Metadata for the integration, including title, description, prompts for configuration, patches for updating integration resources, and post-installation instructions. Integration metadata files must be YAML format and must use the `.yaml` file extension (not `.yml`).
`sensu-resources.yaml` | Sensu resources the integration will install, including checks, handlers, event filters, pipelines, and assets. Do not include a namespace in resource definitions in the `sensu-resources.yaml` file. Integration resource files must be YAML format and must use the `.yaml` file extension (not `.yml`).

## Integration example

This example shows an integration definition for NGINX monitoring.
Integration definitions are saved as the `sensu-integration.yaml` file for a Sensu Catalog integration:

{{< code yml >}}
---
api_version: catalog/v1
type: Integration
metadata:
  namespace: nginx
  name: nginx-monitoring
spec:
  class: supported
  provider: monitoring
  display_name: NGINX Monitoring
  short_description: Monitor NGINX service health and collect metrics
  supported_platforms:
    - darwin
    - linux
    - windows
  tags:
    - http
    - nginx
    - webserver
    - service
  contributors:
    - "@nixwiz"
    - "@calebhailey"
  prompts:
    - type: section
      title: Configure NGINX URL and Monitoring Thresholds
    - type: markdown
      body: |
        Specify the NGINX stub status URL and alerting thresholds for numbers of active and waiting connections.
    - type: question
      name: default_url
      required: false
      input:
        type: string
        title: NGINX stub status URL
        description: Enter the NGINX stub_status URL
        default: http://127.0.0.1:80/nginx_status
    - type: question
      name: nginx_active_warn
      required: false
      input:
        type: integer
        title: Maximum active connections
        description: >-
          Enter the maximum number of active connections to allow before sending a WARNING event (default is `300`)
        default: 300
    - type: question
      name: nginx_waiting_warn
      required: false
      input:
        type: integer
        title: Maximum waiting connections
        description: >-
          Enter the maximum number of waiting connections to allow before sending a WARNING event (default is `30`)
        default: 30
    - type: section
      title: Configure Sensu Subscriptions
    - type: markdown
      body: |
        Specify the subscriptions for Sensu agents that should execute the `nginx-metrics` check.
    - type: question
      name: subscriptions
      input:
        type: array
        items:
          type: string
          title: Sensu Subscriptions
          ref: core/v2/entity/subscriptions
        default:
          - nginx
    - type: section
      title: Pipeline Configuration
    - type: markdown
      body: |
        Name the [pipelines] you want to use to process NGINX Monitoring integration data.
        [pipelines]: https://docs.sensu.io/sensu-go/latest/observability-pipeline/observe-process/pipelines/
    - type: question
      name: alerts_pipeline
      required: false
      input:
        type: string
        title: Alert pipeline name
        description: >-
          Which pipeline do you want to use for alerts due to failures this integration detects?
        ref: core/v2/pipeline/metadata/name
        refFilter: .labels.provider == "alerts"
    - type: question
      name: incidents_pipeline
      required: false
      input:
        type: string
        title: Incident pipeline name
        description: >-
          Which pipeline do you want to use to process incidents due to failures this integration detects?
        ref: core/v2/pipeline/metadata/name
        refFilter: .labels.provider == "incidents"
    - type: question
      name: metrics_pipeline
      required: false
      input:
        type: string
        title: Metrics pipeline name
        description: >-
          Which pipeline do you want to use to process the metrics this integration collects?
        ref: core/v2/pipeline/metadata/name
        refFilter: .labels.provider == "metrics"
  resource_patches:
    - resource:
        api_version: core/v2
        type: CheckConfig
        name: nginx-metrics
      patches:
        - path: /spec/command
          op: replace
          value: >-
            nginx-check
            --url {{ .annotations.metrics_nginx_url | default "[[ default_url ]]" }}
        - path: /spec/subscriptions
          op: replace
          value: subscriptions
        - path: /spec/pipelines/-
          op: add
          value:
            api_version: core/v2
            type: Pipeline
            name: "[[metrics_pipeline]]"
        - path: /spec/pipelines/-
          op: add
          value:
            api_version: core/v2
            type: Pipeline
            name: "[[alerts_pipeline]]"
        - path: /spec/pipelines/-
          op: add
          value:
            api_version: core/v2
            type: Pipeline
            name: "[[incidents_pipeline]]"
        - path: /spec/output_metric_thresholds/0/thresholds/0/max
          op: replace
          value: "[[nginx_active_warn]]"
        - path: /spec/output_metric_thresholds/1/thresholds/0/max
          op: replace
          value: "[[nginx_waiting_warn]]"
  post_install:
    - type: section
      title: Success
    - type: markdown
      body: |
        You enabled the NGINX Monitoring integration.
        The `nginx-metrics` check will run for all Sensu agents with these subscriptions: [[subscriptions]].
{{< /code >}}

Sensu Catalog integration definitions resemble other Sensu resources, but Sensu Go does not process them directly.
Instead, the [catalog-api][32] command line interface tool uses integration definitions along with the other files in the catalog repository, like READMEs and dashboard images, to generate a [static Catalog API][2].
The Sensu web UI uses the generated API files to determine which integrations to display in the Sensu Catalog.

## catalog-api command line interface tool

{{% notice note %}}
**NOTE**: The catalog-api tool is an alpha feature and may include breaking changes.
{{% /notice %}}

Sensu's [catalog-api][16] command line interface (CLI) tool generates the [static Catalog API][2] to convert integration files into static API content that you can host on any HTTP web service.
The Sensu web UI uses the generated API files to determine which integrations to display in the Sensu Catalog.

Use the catalog-api tool to [generate a local Catalog API][18] for testing as you develop new integrations and to [build and run a private catalog][17].
Integration files must be stored in a repository that follows the required [organizational framework][15].

The catalog-api tool is written in Go.

### catalog-api subcommands

The catalog-api tool provides the following subcommands.

{{< code text >}}
catalog-api catalog --help

USAGE
  catalog-api catalog [flags] <subcommand> [flags]

SUBCOMMANDS
  generate  Generate a static catalog API
  validate  Validate a catalog directory and its integrations
  server    Serves static catalog API for development purposes
  preview   Serves static catalog API & preview catalog web application for development purposes

FLAGS
  -integrations-dir-name integrations  path to the directory containing namespaced integrations
  -log-level info                      log level of this command ([panic fatal error warn info debug trace])
  -repo-dir .                          path to the catalog repository
{{< /code >}}

#### Generate subcommand

The generate subcommand generates the contents of a catalog repository locally in a temporary directory, `/tmp/generated-api/`.

Output for the generate subcommand lists the name, catalog namespace, source, and version number for all integration versions:

{{< code text >}}
../catalog-api/catalog-api catalog generate

10:40AM INF Found integration version name=ansible-tower-remediation namespace=ansible source=git tag=ansible/ansible-tower-remediation/20220223.0.0 version=20220223.0.0
10:40AM INF Found integration version name=ansible-tower-remediation namespace=ansible source=git tag=ansible/ansible-tower-remediation/20220421.0.0 version=20220421.0.0
10:40AM INF Found integration version name=aws-alb-monitoring namespace=aws source=git tag=aws/aws-alb-monitoring/20220421.0.0 version=20220421.0.0
10:40AM INF Found integration version name=aws-ec2-monitoring namespace=aws source=git tag=aws/aws-ec2-monitoring/20220421.0.0 version=20220421.0.0
...
10:40AM INF Found integration version name=timescaledb-metrics namespace=timescaledb source=git tag=timescaledb/timescaledb-metrics/20220308.0.0 version=20220308.0.0
10:40AM INF Found integration version name=timescaledb-metrics namespace=timescaledb source=git tag=timescaledb/timescaledb-metrics/20220421.0.0 version=20220421.0.0
10:40AM INF Found integration version name=wavefront-metrics namespace=wavefront source=git tag=wavefront/wavefront-metrics/20220421.0.0 version=20220421.0.0
::set-output name=release-dir::/var/folders/60/cljzzn5n05d91t4x71jx9xzm0000gn/T/3556668713/release
{{< /code >}}

The last line of output lists the local path for the generated catalog.

##### Generate subcommand flags

The catalog-api generate subcommand provides the following configuration flags:

{{< code text >}}
catalog-api catalog generate --help

USAGE
  catalog-api catalog generate [flags]

FLAGS
  -integrations-dir-name integrations                          path to the directory containing namespaced integrations
  -log-level info                                              log level of this command ([panic fatal error warn info debug trace])
  -repo-dir .                                                  path to the catalog repository
  -snapshot=false                                              generate a catalog api for the current catalog branch
  -temp-dir /var/folders/60/cljzzn5n05d91t4x71jx9xzm0000gn/T/  path to a temporary directory for generated files
  -watch=false                                                 enter watch mode, which rebuilds on file change
{{< /code >}}

#### Validate subcommand

The validate subcommand confirms that all files in a catalog repository are organized properly.

Output for the validate subcommand lists the name, catalog namespace, source, and version number for integrations found:

{{< code text >}}
../catalog-api/catalog-api catalog validate

10:37AM INF Found integration version name=ansible-tower-remediation namespace=ansible source=path version=99991231.0.0
10:37AM INF Found integration version name=aws-alb-monitoring namespace=aws source=path version=99991231.0.0
10:37AM INF Found integration version name=aws-ec2-monitoring namespace=aws source=path version=99991231.0.0
...
10:37AM INF Found integration version name=wavefront-metrics namespace=wavefront source=path version=99991231.0.0
{{< /code >}}

##### Validate subcommand flags

The catalog-api validate subcommand provides the following configuration flags:

{{< code text >}}
catalog-api catalog validate --help

USAGE
  catalog-api catalog validate [flags]

FLAGS
  -integrations-dir-name integrations  path to the directory containing namespaced integrations
  -log-level info                      log level of this command ([panic fatal error warn info debug trace])
  -repo-dir .                          path to the catalog repository
{{< /code >}}

#### Server subcommand

The server subcommand starts a webserver to serve the JSON files the Catalog API generates.
To view your catalog in the Sensu web UI while running the server subcommand, you must also configure a Sensu backend and create a GlobalConfig resource to point to the webserver.

The last line of the server subcommand response provides the address to use to view the content the Catalog API is serving the web UI in your browser.
For example:

{{< code text >}}
10:00AM INF Found integration version name=ansible-tower-remediation namespace=ansible source=git tag=ansible/ansible-tower-remediation/20220223.0.0 version=20220223.0.0
10:00AM INF Found integration version name=ansible-tower-remediation namespace=ansible source=git tag=ansible/ansible-tower-remediation/20220421.0.0 version=20220421.0.0
10:00AM INF Found integration version name=aws-alb-monitoring namespace=aws source=git tag=aws/aws-alb-monitoring/20220421.0.0 version=20220421.0.0
...
10:00AM INF Found integration version name=wavefront-metrics namespace=wavefront source=path version=99991231.0.0
10:00AM INF API generated path=/var/folders/60/cljzzn5n05d91t4x71jx9xzm0000gn/T/2304694052
10:00AM INF API server started address=:3003
{{< /code >}}

Visit your webserver address at port 3003 (for example, http://localhost:3003) to view the static Catalog API content that catalog-api is serving.

Click the SHA-256 checksum to view the content for all catalog versions, including the integrations in each catalog version; the JSON definition for each integration version; the catalog repository files for each integration version; and a versions.json file that lists all versions for the integration:

{{< figure src="/images/go/catalog_reference/server_checksum.gif" alt="View the API content for all catalog versions that catalog-api is serving in the browser" link="/images/go/catalog_reference/server_checksum.gif" target="_blank" >}} 

Click version.json to view the contents of the version.json file for the content that catalog-api is serving:

{{< figure src="/images/go/catalog_reference/server_versions_json.gif" alt="View the version.json file for the content that catalog-api is serving in the browser" link="/images/go/catalog_reference/server_versions_json.gif" target="_blank" >}} 

##### Server subcommand flags

The catalog-api server subcommand provides the following configuration flags:

{{< code text >}}
catalog-api catalog server --help

USAGE
  catalog-api catalog server [flags]

FLAGS
  -integrations-dir-name integrations                          path to the directory containing namespaced integrations
  -log-level info                                              log level of this command ([panic fatal error warn info debug trace])
  -port 8083                                                   port to use for dev server
  -repo-dir .                                                  path to the catalog repository
  -temp-dir /var/folders/60/cljzzn5n05d91t4x71jx9xzm0000gn/T/  path to a temporary directory for generated files
  -watch=false                                                 enter watch mode, which rebuilds on file change
  -without-snapshot=false                                      generate a catalog api using tags only
{{< /code >}}

##### Use the Sensu Catalog API server for integration development

When you're developing integrations, it can be helpful to run the Sensu Catalog API server from your local environment so that you can preview integrations as you work.
To do this, use the server subcommand in the catalog-api command line tool.

{{% notice note %}}
**NOTE**: Make sure you have a local Sensu instance running with access to the Sensu web UI.
{{% /notice %}}

1. Clone the Sensu Catalog API repository and navigate to the local catalog-api repository:
{{< code shell >}}
git clone https://github.com/sensu/catalog-api && cd catalog-api
{{< /code >}}

2. Build the catalog-api tool:
{{< code shell >}}
go build
{{< /code >}}

3. Exit the local catalog-api repository:
{{< code shell >}}
cd ..
{{< /code >}}

4. Clone the repository that stores your Sensu integrations.
This example uses Sensu's public integration repository:
{{< code shell >}}
git clone https://github.com/sensu/catalog
{{< /code >}}

5. Navigate to your local copy of the repository that stores the Sensu integrations.
This example uses https://github.com/sensu/catalog, so the repository is `catalog`: 
{{< code shell >}}
cd ../catalog
{{< /code >}}

6. Run the catalog-api server subcommand:
This example uses https://github.com/sensu/catalog, so the repository is `catalog`:
{{< code shell >}}
../catalog-api/catalog-api catalog server --repo-dir . -watch
{{< /code >}}

   The `.` in the command tells Sensu to read the catalog contents from your local environment.
   Use the `-watch` flag to reload the API as you save updates in integration files so that you can see them live in the Sensu web UI.

7. Create a GlobalConfig resource that specifies a local URL for displaying the the private catalog in the Sensu web UI.
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
    url: "https://127.0.0.1:3000"
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
      "url": "https://127.0.0.1:3000",
      "release_version": "version"
    }
  }
}
EOF
{{< /code >}}

{{< /language-toggle >}}

8. Navigate to the Catalog page in the Sensu web UI for your local instance (in this example, https://127.0.0.1:3000).
The Catalog page should include all of the integrations in your local repository and update automatically as you save local changes to your integration files.

#### Preview subcommand

The preview subcommand starts a webserver like the server subcommand but also serves a preview web UI that can communicate with the Sensu backend.
If you use the preview subcommand, you do not need to interact with the Sensu backend or create a GlobalConfig resource.

The last line of the preview subcommand response provides the address to use to view the preview catalog in your browser.
For example:

{{< code text >}}
9:57AM INF Found integration version name=ansible-tower-remediation namespace=ansible source=git tag=ansible/ansible-tower-remediation/20220223.0.0 version=20220223.0.0
9:57AM INF Found integration version name=ansible-tower-remediation namespace=ansible source=git tag=ansible/ansible-tower-remediation/20220421.0.0 version=20220421.0.0
9:57AM INF Found integration version name=aws-alb-monitoring namespace=aws source=git tag=aws/aws-alb-monitoring/20220421.0.0 version=20220421.0.0
...
9:57AM INF Found integration version name=wavefront-metrics namespace=wavefront source=path version=99991231.0.0
9:57AM INF API generated path=/var/folders/60/cljzzn5n05d91t4x71jx9xzm0000gn/T/2316699223
9:57AM INF API server started address=:3003
{{< /code >}}

Visit your webserver address at port 3003 (for example, http://localhost:3003) to view a preview of the catalog in the Sensu web UI.

##### Preview subcommand flags

The catalog-api preview subcommand provides the following configuration flags:

{{< code text >}}
catalog-api catalog preview --help

USAGE
  catalog-api catalog preview [flags]

FLAGS
  -api-url http://localhost:8080                               host URL of Sensu installation; optional
  -integrations-dir-name integrations                          path to the directory containing namespaced integrations
  -log-level info                                              log level of this command ([panic fatal error warn info debug trace])
  -port 3003                                                   port to use for dev server
  -repo-dir .                                                  path to the catalog repository
  -temp-dir /var/folders/60/cljzzn5n05d91t4x71jx9xzm0000gn/T/  path to a temporary directory for generated files
  -without-snapshot=false                                      generate a catalog api using tags only
  -without-watch=false                                         enter watch mode, which rebuilds on file change
{{< /code >}}

## Catalog tags and versions

The catalog-api tool consumes and parses integration-specific git tags to manage and generate versioned integrations.
This makes it possible to give users access to earlier versions of integrations and hedge against regressions in individual integrations.

For example, in the [official Sensu Catalog repository][30], two versions of the [Ansible Tower Remediation][31] are defined:

{{< code text >}}
git tag --list |grep ansible-tower-remediation
ansible/ansible-tower-remediation/20220223.0.0
ansible/ansible-tower-remediation/20220421.0.0
{{< /code >}}

Using these tags, the catalog-api tool would generate the following version structure, with both versions of the Ansible Tower Remediation integration:

{{< code text >}}
tree /tmp/generated-api/ -L 7
/tmp/generated-api/
├── release
│   ├── 5029648381dff2426ea247147456b4f1227fd6d9050fa42f0660e67a218f8c87
│   │   └── v1
│   │ ├── ansible
│   │ │   ├── ansible-tower-remediation
│   │ │   │   ├── 20220223.0.0
│   │ │   │   │   ├── CHANGELOG.md
│   │ │   │   │   ├── img
│   │ │   │   │   ├── logo.png
│   │ │   │   │   ├── README.md
│   │ │   │   │   └── sensu-resources.json
│   │ │   │   ├── 20220223.0.0.json
│   │ │   │   ├── 20220421.0.0
│   │ │   │   │   ├── CHANGELOG.md
│   │ │   │   │   ├── img
│   │ │   │   │   ├── logo.png
│   │ │   │   │   ├── README.md
│   │ │   │   │   └── sensu-resources.json
│   │ │   │   ├── 20220421.0.0.json
│   │ │   │   └── versions.json
│   │ │   └── ansible-tower-remediation.json
{{< /code >}}

### Catalog versions

Catalog builds are versioned so that every previous iteration of the catalog is available.
You are not limited to providing only the most recent version of the catalog, and you can provide older versions as a fallback.

The catalog-api tool generates builds into a checksum-based output directory structure.
The version.json file manages the path to the latest or production catalog API content and instructs the web UI to load catalog contents from the specified checksum directory.
When you run the catalog-api generate subcommand to generate the catalog, catalog-api creates the version.json file.

The contents of a version.json file are similar to this example:

{{< code text "JSON" >}}
{
  "release_sha256": "5029648381dff2426ea247147456b4f1227fd6d9050fa42f0660e67a218f8c87",
  "last_updated": 1655840571
}
{{< /code >}}

If you make any changes to your integration files, the catalog-api tool will generate a new checksum directory.
To revert to an older build of the catalog, change the `release_sha256` in version.json to point to a different release directory.

#### Generate version tags

The catalog-api tool uses version tags to create versions of integrations and present them to users within the catalog.

If you update an integration, the first step in publishing the updated integration is to generate a new tag for it:

{{< code shell >}}
git tag <integration_namespace>/<integration_filename>/<YYYYMMDD>.0.0
{{< /code >}}

For example, to generate a new tag for an October 5, 2022 update to the [Ansible Tower Remediation][31] integration:

{{< code shell >}}
git tag ansible/ansible-tower-remediation/20221005.0.0
{{< /code >}}

Commit your changes to git after adding the tag.
Then, run the catalog-api generate subcommand to generate a catalog that includes the tagged version:

{{< code shell >}}
../catalog-api/catalog-api catalog generate
{{< /code >}}

If you update the integration again on the same day, update the tag to `<YYYYMMDD>.0.1`.
To continue the Ansible Tower Remediation example:

{{< code shell >}}
git tag ansible/ansible-tower-remediation/20221005.0.1
{{< /code >}}

Commit your changes to git.
The next time you run the catalog-api generate subcommand, it will generate a catalog that includes both tagged versions.

## Private catalogs

The [catalog-api][32] command line interface tool renders static HTTP API content that the Sensu web UI can consume.
This means you can create a private enterprise catalog of custom integrations and make it available to users in the Sensu web UI.

You can use the official Sensu Catalog repository, https://github.com/sensu/catalog, as a starting point for building your own private catalog.
To do this, clone the repository with the `no-tags` flag to get a copy that does not include Sensu's tags for the existing integrations:

{{< code shell >}}
git clone --no-tags https://github.com/sensu/catalog
{{< /code >}}

The Catalog API defines integrations globally rather than by namespace.
When you create a private catalog, all integrations in your repository are available for all users across namespaces in the web UI.

Read [Build a private catalog of Sensu integrations][17] for more information.

## Integration specification

### Top-level attributes

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For integrations in this version of Sensu, the api_version should always be `catalog/v1`.
required     | true
type         | String
example      | {{< code yml >}}
api_version: catalog/v1
{{< /code >}}

metadata     |      |
-------------|------
description  | Top-level scope that contains the integration's `name` and `namespace` information.
required     | true
type         | Map of key-value pairs
example      | {{< code yml >}}
metadata:
  namespace: nginx
  name: nginx-monitoring
{{< /code >}}

spec         | 
-------------|------
description  | Top-level map that includes integration [spec attributes][5].
required     | true
type         | Map of key-value pairs
example      | {{< code yml >}}
spec:
  class: supported
  provider: monitoring
  display_name: NGINX Monitoring
  short_description: Monitor NGINX service health and collect metrics
  supported_platforms:
    - darwin
    - linux
    - windows
  tags:
    - http
    - nginx
    - webserver
    - service
  contributors:
    - "@nixwiz"
    - "@calebhailey"
  prompts:
    - type: section
      title: Configure NGINX URL and Monitoring Thresholds
    - type: markdown
      body: |
        Specify the NGINX stub status URL and alerting thresholds for numbers of active and waiting connections.
    - type: question
      name: default_url
      required: false
      input:
        type: string
        title: NGINX stub status URL
        description: Enter the NGINX stub_status URL
        default: http://127.0.0.1:80/nginx_status
    - type: question
      name: nginx_active_warn
      required: false
      input:
        type: integer
        title: Maximum active connections
        description: >-
          Enter the maximum number of active connections to allow before sending a WARNING event (default is `300`)
        default: 300
    - type: question
      name: nginx_waiting_warn
      required: false
      input:
        type: integer
        title: Maximum waiting connections
        description: >-
          Enter the maximum number of waiting connections to allow before sending a WARNING event (default is `30`)
        default: 30
    - type: section
      title: Configure Sensu Subscriptions
    - type: markdown
      body: |
        Specify the subscriptions for Sensu agents that should execute the `nginx-metrics` check.
    - type: question
      name: subscriptions
      input:
        type: array
        items:
          type: string
          title: Sensu Subscriptions
          ref: core/v2/entity/subscriptions
        default:
          - nginx
    - type: section
      title: Pipeline Configuration
    - type: markdown
      body: |
        Name the [pipelines] you want to use to process NGINX Monitoring integration data.
        [pipelines]: https://docs.sensu.io/sensu-go/latest/observability-pipeline/observe-process/pipelines/
    - type: question
      name: alerts_pipeline
      required: false
      input:
        type: string
        title: Alert pipeline name
        description: >-
          Which pipeline do you want to use for alerts due to failures this integration detects?
        ref: core/v2/pipeline/metadata/name
        refFilter: .labels.provider == "alerts"
    - type: question
      name: incidents_pipeline
      required: false
      input:
        type: string
        title: Incident pipeline name
        description: >-
          Which pipeline do you want to use to process incidents due to failures this integration detects?
        ref: core/v2/pipeline/metadata/name
        refFilter: .labels.provider == "incidents"
    - type: question
      name: metrics_pipeline
      required: false
      input:
        type: string
        title: Metrics pipeline name
        description: >-
          Which pipeline do you want to use to process the metrics this integration collects?
        ref: core/v2/pipeline/metadata/name
        refFilter: .labels.provider == "metrics"
  resource_patches:
    - resource:
        api_version: core/v2
        type: CheckConfig
        name: nginx-metrics
      patches:
        - path: /spec/command
          op: replace
          value: >-
            nginx-check
            --url {{ .annotations.metrics_nginx_url | default "[[ default_url ]]" }}
        - path: /spec/subscriptions
          op: replace
          value: subscriptions
        - path: /spec/pipelines/-
          op: add
          value:
            api_version: core/v2
            type: Pipeline
            name: "[[metrics_pipeline]]"
        - path: /spec/pipelines/-
          op: add
          value:
            api_version: core/v2
            type: Pipeline
            name: "[[alerts_pipeline]]"
        - path: /spec/pipelines/-
          op: add
          value:
            api_version: core/v2
            type: Pipeline
            name: "[[incidents_pipeline]]"
        - path: /spec/output_metric_thresholds/0/thresholds/0/max
          op: replace
          value: "[[nginx_active_warn]]"
        - path: /spec/output_metric_thresholds/1/thresholds/0/max
          op: replace
          value: "[[nginx_waiting_warn]]"
  post_install:
    - type: section
      title: Success
    - type: markdown
      body: |
        You enabled the NGINX Monitoring integration.
        The `nginx-metrics` check will run for all Sensu agents with these subscriptions: [[subscriptions]].
{{< /code >}}

type         | 
-------------|------
description  | Top-level attribute that specifies the resource type. For integrations, the type should always be `Integration`.
required     | true
type         | String
example      | {{< code yml >}}
type: Integration
{{< /code >}}

### Metadata attributes

name         |      |
-------------|------
description  | Name for the integration that is used internally by Sensu.
required     | true
type         | String
example      | {{< code yml >}}
name: nginx-monitoring
{{< /code >}}

| namespace  |      |
-------------|------
description  | [Sensu RBAC namespace][4] that the check belongs to.
required     | false
type         | String
example      | {{< code yml >}}
namespace: nginx
{{< /code >}}

### Spec attributes

class        |      |
-------------|------
description  | Class to use for categorizing the integration in the web UI.
required     | true
type         | String
allowed values | <ul><li>`community` for community-supported integrations</li><li>`supported` for Sensu-supported integrations</li><li>`enterprise` for Sensu-supported integrations that require a [commercial license][6]</li><li>`partner` for integrations supported by Sensu's third-party partners</ul>
example      | {{< code yml >}}
class: community
{{< /code >}}

contributors |      |
-------------|------
description  | List of GitHub @usernames to display on integration detail pages in the web UI.
required     | true
type         | Array
example      | {{< code yml >}}
contributors:
  - "@nixwiz"
  - "@calebhailey"
{{< /code >}}

display_name |      |
-------------|------
description  | Name to display for the integration in the web UI.
required     | true
type         | String
example      | {{< code yml >}}
display_name: NGINX Monitoring
{{< /code >}}

post_install |      |
-------------|------
description  | Content to display for the final step in integration configuration. The post_install dialog is helpful for confirming successful installation and providing instructions for any further configuration an integration may require. If you do not include a post_install array in your integration definition, Sensu will display a default "Success" window. Read [Post install attributes][11] for more information.
required     | false
type         | Array
example      | {{< code yml >}}
post_install:
  - type: section
    title: Success
  - type: markdown
    body: |
      You enabled the NGINX Monitoring integration.
      The `nginx-metrics` check will run for all Sensu agents with these subscriptions: [[subscriptions]].
{{< /code >}}

<a id="integration-prompts"></a>

prompts      |      |
-------------|------
description  | Attributes for soliciting user-provided variables to use in `resource_patches`. Read [Prompts attributes][10] for more information.
required     | true
type         | Map of key-value pairs
example      | {{< code yml >}}
prompts:
  - type: section
    title: Configure NGINX URL and Monitoring Thresholds
  - type: markdown
    body: |
      Specify the NGINX stub status URL and alerting thresholds for numbers of active and waiting connections.
  - type: question
    name: default_url
    required: false
    input:
      type: string
      title: NGINX stub status URL
      description: Enter the NGINX stub_status URL
      default: http://127.0.0.1:80/nginx_status
  - type: question
    name: nginx_active_warn
    required: false
    input:
      type: integer
      title: Maximum active connections
      description: >-
        Enter the maximum number of active connections to allow before sending a WARNING event (default is `300`)
      default: 300
  - type: question
    name: nginx_waiting_warn
    required: false
    input:
      type: integer
      title: Maximum waiting connections
      description: >-
        Enter the maximum number of waiting connections to allow before sending a WARNING event (default is `30`)
      default: 30
  - type: section
    title: Configure Sensu Subscriptions
  - type: markdown
    body: |
      Specify the subscriptions for Sensu agents that should execute the `nginx-metrics` check.
  - type: question
    name: subscriptions
    input:
      type: array
      items:
        type: string
        title: Sensu Subscriptions
        ref: core/v2/entity/subscriptions
      default:
        - nginx
  - type: section
    title: Pipeline Configuration
  - type: markdown
    body: |
      Name the [pipelines] you want to use to process NGINX Monitoring integration data.
      [pipelines]: https://docs.sensu.io/sensu-go/latest/observability-pipeline/observe-process/pipelines/
  - type: question
    name: alerts_pipeline
    required: false
    input:
      type: string
      title: Alert pipeline name
      description: >-
        Which pipeline do you want to use for alerts due to failures this integration detects?
      ref: core/v2/pipeline/metadata/name
      refFilter: .labels.provider == "alerts"
  - type: question
    name: incidents_pipeline
    required: false
    input:
      type: string
      title: Incident pipeline name
      description: >-
        Which pipeline do you want to use to process incidents due to failures this integration detects?
      ref: core/v2/pipeline/metadata/name
      refFilter: .labels.provider == "incidents"
  - type: question
    name: metrics_pipeline
    required: false
    input:
      type: string
      title: Metrics pipeline name
      description: >-
        Which pipeline do you want to use to process the metrics this integration collects?
      ref: core/v2/pipeline/metadata/name
      refFilter: .labels.provider == "metrics"
{{< /code >}}

provider     |      |
-------------|------
description  | Integration function to use for categorizing the integration in the web UI.
required     | true
type         | String
allowed values | `alerts`, `deregistration`, `discovery`, `events`, `incidents`, `metrics`, `monitoring`, and `remediation`
example      | {{< code yml >}}
provider: monitoring
{{< /code >}}

resource_patches |      |
-------------|------
description  | Attributes that define how to apply changes to the integration resources in the `sensu-resources.yaml` file based on user responses to [prompts][22]. Read [Resource patches attributes][20] for more information.
required     | true
type         | Map of key-value pairs
example      | {{< code yml >}}
resource_patches:
  - resource:
      api_version: core/v2
      type: CheckConfig
      name: nginx-metrics
    patches:
      - path: /spec/command
        op: replace
        value: >-
          nginx-check
          --url {{ .annotations.metrics_nginx_url | default "[[ default_url ]]" }}
      - path: /spec/subscriptions
        op: replace
        value: subscriptions
      - path: /spec/pipelines/-
        op: add
        value:
          api_version: core/v2
          type: Pipeline
          name: "[[metrics_pipeline]]"
      - path: /spec/pipelines/-
        op: add
        value:
          api_version: core/v2
          type: Pipeline
          name: "[[alerts_pipeline]]"
      - path: /spec/pipelines/-
        op: add
        value:
          api_version: core/v2
          type: Pipeline
          name: "[[incidents_pipeline]]"
      - path: /spec/output_metric_thresholds/0/thresholds/0/max
        op: replace
        value: "[[nginx_active_warn]]"
      - path: /spec/output_metric_thresholds/1/thresholds/0/max
        op: replace
        value: "[[nginx_waiting_warn]]"
{{< /code >}}

short_description |      |
-------------|------
description  | Brief description of the integration to display in the web UI.
required     | true
type         | String
example      | {{< code yml >}}
short_description: Monitor NGINX service health and collect metrics
{{< /code >}}

supported_platforms |      |
-------------|------
description  | Supported platforms for the integration. Used for checks only.
required     | true
type         | Array
example      | {{< code yml >}}
supported_platforms:
  - darwin
  - linux
  - windows
{{< /code >}}

tags         |      |
-------------|------
description  | Keywords for the integration. Used for integration searches in the web UI.
required     | true
type         | Array
example      | {{< code yml >}}
tags:
  - http
  - nginx
  - webserver
  - service
{{< /code >}}

#### Post install attributes

<a id="post-install-body"></a>

body         | 
-------------|------ 
description  | Markdown content to display in the integration post install dialog. If you specify [`type: markdown`][9], you must provide a `body` attribute.
required     | false
type         | String
example      | {{< code yml >}}
body: |
  You enabled the NGINX Monitoring integration.
  The `nginx-metrics` check will run for all Sensu agents with these subscriptions: [[subscriptions]].
{{< /code >}}

<a id="post-install-title"></a>

title        | 
-------------|------ 
description  | Section title to display in the integration post install dialog. If you specify [`type: section`][9], you must provide a `title` attribute.
required     | false
type         | String
example      | {{< code yml >}}
title: Success 
{{< /code >}}

<a id="post-install-type"></a>

type         | 
-------------|------ 
description  | Type of post install content to display. To configure a window of post install content, include a `type: section` attribute and a `type: markdown` attribute. For `type: section`, provide a [title][8]. For `type: markdown`, provide a [body][7]. Each `type: section` attribute you add corresponds to one window of post install content; if you need more than one window of post install content, add another `type: section` attribute.
required     | false
type         | String
example      | {{< code yml >}}
type: section 
{{< /code >}}

#### Prompts attributes

<a id="prompts-body"></a>

body         | 
-------------|------ 
description  | Markdown content to display in a prompt. If you specify [`type: markdown`][9], you must include a `body` attribute. Body attributes are useful for providing instructions at the top of each prompt window.
required     | false
type         | String
example      | {{< code yml >}}
body: |
  Specify the NGINX stub status URL and alerting thresholds for numbers of active and waiting connections.
{{< /code >}}

input        | 
-------------|------ 
description  | Configuration attributes for [`type: question`][12] prompts. Read [Input attributes][21] for more information.
required     | false
type         | Map of key-value pairs
example      | {{< code yml >}}
input:
  type: string
  title: NGINX stub status URL
  description: Enter the NGINX stub_status URL
  default: http://127.0.0.1:80/nginx_status
{{< /code >}}

name         | 
-------------|------ 
description  | Variable name for use as a reference in resource patches to substitute user input for a specific attribute's value in an integration resource. You can also interpolate integration variable names into string templates with double square brackets (e.g. `Hello, [[ team ]]!`). Used with [`type: question`][12] prompts.
required     | false
type         | String
example      | {{< code yml >}}
name: default_url
{{< /code >}}

required     | 
-------------|------ 
description  | If the associated prompt requires user input, `true`. Otherwise, `false`. Used with [`type: question`][12] prompts.
required     | false
type         | Boolean
example      | {{< code yml >}}
attribute: 
{{< /code >}}

<a id="prompts-title"></a>

title        | 
-------------|------ 
description  | Section title to display in the integration prompts dialog. If you specify [`type: section`][9], you must provide a `title` attribute.
required     | false
type         | String
example      | {{< code yml >}}
title: Configure NGINX URL and Monitoring Thresholds
{{< /code >}}

<a id="prompts-type"></a>

type         | 
-------------|------ 
description  | Type of prompt to display. To configure a window of prompts, include a `type: section` attribute followed by a [title][12]. Within each window of prompts, use `type: question` attributes to collect user responses and `type: markdown` attributes to provide user instructions. Each `type: section` attribute you add corresponds to one window of prompts; if you need more than one window of prompts, add another `type: section` attribute.
required     | false
type         | 
example      | {{< code yml >}}
type: section 
{{< /code >}}

#### Resource patches attributes

patches      | 
-------------|------ 
description  | Updates to apply to the selected resource, in [JSON Patch][13] format. Variable substitution and templating are supported with `varname` references in double square brackets (for example, `Hello, [[varname]]`). If an individual operation fails, Sensu considers it optional and skips it. All patches must specify a `path`, `op` (operation), and `value`. Read [Patches attributes][24] for more information.
required     | false
type         | Map of key-value pairs
example      | {{< code yml >}}
patches:
  - path: /spec/command
    op: replace
    value: >-
      nginx-check
      --url {{ .annotations.metrics_nginx_url | default "[[ default_url ]]" }}
  - path: /spec/subscriptions
    op: replace
    value: subscriptions
{{< /code >}}

resource     | 
-------------|------ 
description  | Identification information for the Sensu API resource to patch. The resource must be included in the integration's `sensu-resources.yaml` file. Read [Resource attributes][23] for more information.
required     | false
type         | Map of key-value pairs
example      | {{< code yml >}}
- resource:
    api_version: core/v2
    type: CheckConfig
    name: nginx-metrics
{{< /code >}}

##### Input attributes

default      | 
-------------|------ 
description  | Default value to use for the associated attribute if the user does not specify a value.
required     | false
type         | String
example      | {{< code yml >}}
default: http://127.0.0.1:80/nginx_status
{{< /code >}}

description  | 
-------------|------ 
description  | Description to display below the user input field.
required     | false
type         | String
example      | {{< code yml >}}
description: Enter the NGINX stub_status URL
{{< /code >}}

format         | 
---------------|------ 
description    | Format for the input value. Some display formats provide helpers that simplify user input.
required       | false
type           | String
allowed values | `cron`, `duration` `ecmascript-5.1`, `email`, `envvar`, `hostname`, `io.sensu.selector`, `ipv4`, `ipv6`, `tel`, `url`, `sh`, `sha-256`, `sha-512`
example        | {{< code yml >}}
format: email
{{< /code >}}

<a id="input-ref"></a>

ref          | 
-------------|------ 
description  | Reference to a Sensu API resource in <api_group>/<version>/<api_resource>/<api_field_path> format (for example, `core/v2/pipelines/metadata/name` refers to the names of `core/v2/pipelines` resources). The referenced resources are presented to the user in a drop-down selector. Sensu captures the resource the user selects as the input value.
required     | false
type         | String
example      | {{< code yml >}}
ref: core/v2/entity/subscriptions
{{< /code >}}

refFilter    | 
-------------|------ 
description  | Filters to apply to Sensu API resource [references][19] in Sensu Query Expression (SQE) format. Sensu uses `refFilter` values to filter `ref` results.
required     | false
type         | String
example      | {{< code yml >}}
refFilter: .labels.provider == "alerts"
{{< /code >}}

title        | 
-------------|------ 
description  | Label to display above the user input field.
required     | true
type         | String
example      | {{< code yml >}}
title: NGINX stub status URL
{{< /code >}}

type           | 
---------------|------ 
description    | Type of input requested.
required       | true
type           | String
allowed values | `boolean`, `integer`, `string`
example        | {{< code yml >}}
type: string
{{< /code >}}

#### Patches attributes

op           | 
-------------|------ 
description  | Patch operation to perform.
required     | false
type         | String
allowed values | `add`, `replace`
example      | {{< code yml >}}
op: replace
{{< /code >}}

path         | 
-------------|------ 
description  | Path for the attribute to patch within the specified Sensu resource. In [JSON Pointer][14] format, which supports array indexes such as `/spec/subscriptions/0`. Use `-` to insert values at the end of an array (for example, `/spec/subscriptions/-`).
required     | false
type         | String
example      | {{< code yml >}}
path: /spec/subscriptions
{{< /code >}}

value        | 
-------------|------ 
description  | Built-in or user-entered value to apply in the patch. The built-in value is `unique_id`, which randomly generates an 8-digit hexadecimal string value (e.g. 168c41a1). User-entered variables are represented by variable name references in double square brackets.
required     | false
type         | 
example      | {{< code yml >}}
value: [[ subscriptions ]]
{{< /code >}}

##### Resource attributes

api_version  | 
-------------|------ 
description  | Sensu API group and version for the resource to patch.
required     | true
type         | String
example      | {{< code yml >}}
api_version: core/v2
{{< /code >}}

name         | 
-------------|------ 
description  | Name of the resource to patch.
required     | true
type         | String
example      | {{< code yml >}}
name: nginx-metrics
{{< /code >}}

type         | 
-------------|------ 
description  | Type of the resource to patch.
required     | true
type         | String
example      | {{< code yml >}}
type: CheckConfig
{{< /code >}}

## Resource limits

There is no limit on the number of resources you can bundle into a single integration.
Each integration can include as many checks, event filters, handlers, and pipelines as you need to achieve your observability goals.
For example, you can develop a single host monitoring integration that installs all of the checks you want to run on every server.

## Check guidelines

For integrations that create checks, list the resource definitions in your `sensu-resources.yaml` file in the following order:

1. CheckConfig
2. HookConfig
3. Secret
4. Asset

The `sensu-integration.yaml` file for check resources should include at least one subscription, whether it is provided as a default or requested with a prompt.
Subscriptions should be named according to the check's function.
For example, a PostgreSQL monitoring check could include a subscription named `postgresql`.

Use the YAML `>-` multiline block scalar syntax to wrap the check `command` value and make it easier to read.
For example:

{{< code yml >}}
spec:
  command: >-
    check-disk-usage.rb
    -w {{ .annotations.disk_usage_warning | default 85 }}
    -c {{ .annotations.disk_usage_critical | default 95 }}
{{< /code >}}

Use tunables like [tokens][25] in your check commands as needed, sourced from entity annotations (not labels) and with explicitly configured default values.

Check resources should use [interval scheduling][26] with a minimum interval of 30 seconds.
Set check `timeout` to a non-zero value that is no greater than 50% of the interval.

Prompts for check pipelines should use one of the following generic categories:

- Alerts
- Incident management
- Metrics
- Events
- Deregistration
- Remediation

## Pipeline guidelines

For integrations that create pipelines, list the resource definitions in your `sensu-resources.yaml` file in the following order:

1. Pipeline
2. Handler, SumoLogicMetricsHandler, and TCPStreamHandler
3. Filter
4. Mutator
5. Secret
6. Asset

For alert and incident management pipelines, we recommend using the built-in [is_incident][27] and [not_silenced][28] event filters instead of custom event filters that are configured for specific use cases.

## Asset guidelines

Asset resources and their corresponding `runtime_assets` references in other Sensu resources must include an asset version reference in their resource name.
For example, `sensu/system-check:0.5.0`.

Asset resources should include an organization or author as the namespace in the resource name.
For example, the official Sensu PagerDuty plugin hosted in the `sensu` organization on GitHub (sensu/sensu-pagerduty-handler) and published to under the `sensu` organization on Bonsai (sensu/sensu-pagerduty-handler) should be named `sensu/sensu-pagerduty-handler`.

For integrations contributed to the official Sensu Catalog, asset resources in the `sensu-resources.yaml` file must refer to assets hosted on [Bonsai][29].
Read [Build a private catalog of Sensu integrations][17] for information about using assets that are stored behind a firewall or are otherwise not publicly available.


[1]: ../sensu-catalog/
[2]: ../catalog-api/
[3]: https://github.github.com/gfm/
[4]: ../../operations/control-access/namespaces/
[5]: #spec-attributes
[6]: ../../commercial/
[7]: #post-install-body
[8]: #post-install-title
[9]: #post-install-attributes
[10]: #prompts-attributes
[11]: #post-install-attributes
[12]: #prompts-type
[13]: https://jsonpatch.com/
[14]: https://jsonpatch.com/#json-pointer
[15]: #catalog-repository-example
[16]: https://github.com/sensu/catalog-api
[17]: ../build-private-catalog/
[18]: #use-the-sensu-catalog-api-server-for-integration-development
[19]: #input-ref
[20]: #resource-patches-attributes
[21]: #input-attributes
[22]: #integration-prompts
[23]: #resource-attributes
[24]: #patches-attributes
[25]: ../../observability-pipeline/observe-schedule/tokens/
[26]: ../../observability-pipeline/observe-schedule/checks/#interval-scheduling
[27]: ../../observability-pipeline/observe-filter/filters/#built-in-filter-is_incident
[28]: ../../observability-pipeline/observe-filter/filters/#built-in-filter-not_silenced
[29]: https://bonsai.sensu.io/
[30]: https://github.com/sensu/catalog
[31]: https://github.com/sensu/catalog/tree/main/integrations/ansible/ansible-tower-remediation
[32]: #catalog-api-command-line-interface-tool
