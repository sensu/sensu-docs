---
title: "Catalog integrations reference"
linkTitle: "Catalog Integrations Reference"
reference_title: "Catalog integrations"
type: "reference"
description: "Use Sensu's Catalog API to build a private catalog of Sensu integrations. Read the reference to create integrations for your catalog."
weight: 110
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
The contents of the official Sensu Catalog are periodically published to the official Sensu Catalog API, which is hosted at https://catalog.sensu.io and displayed within the Sensu web UI.

When users install integrations in the Sensu web UI, they receive prompts to specify any customizations.
For example, the DNS Monitoring integration includes prompts for the domain name, record type, record class, servers, and port to query.
Sensu then applies the user's customizations to the integration's resource definitions and automatically deploys the integration configuration to your agents in real time.
No external configuration management is required.

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
Instead, the [Sensu Catalog API][2] uses integration definitions along with the other files in the catalog repository, like READMEs and dashboard images, to generate a static API.

## Private catalogs

The Sensu Catalog API renders static HTTP API content that the Sensu web UI can consume.
This means you can create a private enterprise catalog of custom integrations and make it available to users in the Sensu web UI.

Consider forking the official Sensu Catalog repository, https://github.com/sensu/catalog, as a starting point for building your own private catalog.

Read [Build a private catalog of Sensu integrations][17] for more information.

## catalog-api command line interface tool

{{% notice note %}}
**NOTE**: The catalog-api tool is an alpha feature and may include breaking changes.
{{% /notice %}}

Sensu's [catalog-api][16] command line interface (CLI) tool that converts integration files into static API content that you can host on any HTTP web service.

Use the catalog-api tool to generate a local catalog API for testing as you develop new integrations and to build and run a private catalog.
Integration files must be stored in a repository that follows the required [organizational framework][16].

The catalog-api tool is written in Go.

### catalog-api subcommands

The catalog-api tool provides the following subcommands:

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

### Catalog versions

The catalog-api tool generates builds into a checksum-based output directory structure.
The `version.json` file manages the path to the latest or production catalog API content and instructs the web UI to load catalog contents from the specified checksum directory.
When you run the command to generate the catalog, catalog-api creates the `version.json` file.

The contents of a `version.json` file are similar to this example:

{{< code json >}}
{
  "release_sha256": "5029648381dff2426ea247147456b4f1227fd6d9050fa42f0660e67a218f8c87",
  "last_updated": 1655840571
}
{{< /code >}}

If you make any changes to your integration files, the catalog-api tool will generate a new checksum directory.
To revert to an older build, change the `release_sha256` in `version.json` to point to a different release directory.

## Run the Sensu Catalog API server for integration development

**NEEDED**

## Catalog integration specification

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
description  | Attributes that define how to apply changes to the integration resources in the `sensu-resources.yaml` file based on user responses to [prompts][]. Read [Resource patches attributes][] for more information.
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
description  | Markdown content to display in a prompt. If you specify [`type: markdown`][9], you must provide a `body` attribute. **TODO** should describe it's typical use to provide instructions at the top of each prompt window.
required     | false
type         | String
example      | {{< code yml >}}
body: |
  Specify the NGINX stub status URL and alerting thresholds for numbers of active and waiting connections.
{{< /code >}}

input        | 
-------------|------ 
description  | Configuration attributes for [`type: question`][12] prompts. Read [Input attributes][] for more information.
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
description  | Used with [`type: question`][12] prompts. **REWRITE THIS** Resource patch variable to use to substitute user input for the associated prompt.
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
description  | Updates to apply to the selected resource, in [JSON Patch][13] format. Variable substitution and templating are supported with `varname` references in double square brackets (for example, `Hello, [[varname]]`). If an individual operation fails, Sensu considers it optional and skips it. All patches must specify a `path`, `op` (operation), and `value`. Read [Patches attributes][] for more information.
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
description  | Identification information for the Sensu API resource to patch. The resource must be included in the integration's `sensu-resources.yaml` file. Read [Resource attributes][] for more information.
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
description  | Filters to apply to Sensu API resource references in Sensu Query Expression (SQE) format. Sensu uses `refFilter` values to filter `ref` results.
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
description  | User-entered value to apply in the patch. Values are represented by variable name references in double square brackets.<br><br>Please note the following details about Integration variables:

Sensu Integration variables have a name (e.g. team, or interval) and data type (e.g. string, int).
Sensu Integration variables can be used as Sensu Integration resource_patch values (e.g. value: interval).
Sensu Integration variable can be interpolated into a string template via double square brackets (e.g. Hello, [[ team ]]).

Available variables:
A built-in variable named unique_id: randomly generated 8-digit hexadecimal string value (e.g. 168c41a1).
User-provided variables: supplied via a user prompt (see the name field of any type:question prompt).
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

## Integration guidelines

**START HERE**

Please note the following details about Integration variables:

Sensu Integration variables have a name (e.g. team, or interval) and data type (e.g. string, int).
Sensu Integration variables can be used as Sensu Integration resource_patch values (e.g. value: interval).
Sensu Integration variable can be interpolated into a string template via double square brackets (e.g. Hello, [[ team ]]).

Available variables:
A built-in variable named unique_id: randomly generated 8-digit hexadecimal string value (e.g. 168c41a1).
User-provided variables: supplied via a user prompt (see the name field of any type:question prompt).

**NEEDED**: incorporate https://github.com/sensu/catalog#sensu-integration-guidelines-1


[1]: ../sensu-catalog/
[2]: ../../api/catalog/
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
