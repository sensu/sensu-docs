---
title: "Catalog integrations reference"
linkTitle: "Catalog Integrations Reference"
reference_title: "Catalog integrations"
type: "reference"
description: "Use Sensu's Catalog API to build a private catalog of Sensu integrations. Read the reference to create integrations for your catalog."
weight: 45
version: "6.8"
product: "Sensu Go"
menu: 
  sensu-go-6.8:
    parent: web-ui
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access the Sensu Catalog API in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

The [Sensu Catalog][1] is a collection of Sensu integrations that provide reference implementations for effective observability.
The contents of the official Sensu Catalog are periodically published to the official Sensu Catalog API, which is hosted at https://catalog.sensu.io and displayed within the Sensu web UI.

Sensu Catalog integrations resemble other Sensu resources, but Sensu Go does not process them directly.
Instead, the [Sensu Catalog API][2] generates a static API from a repository that includes integration definitions, along with other content like the README and integration logo.

The Sensu Catalog API renders static HTTP API content that the Sensu web UI can consume.
This means you can create a private catalog of custom integrations and make it available to users in the Sensu web UI.

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

This example shows an example integration definition:

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

## Catalog integration specification **TODO**

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
description  | Used with [`type: question`][12] prompts. Read [Input attributes][] for more information.
required     | false
type         | String
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
description  | Used with [`type: question`][12] prompts. If the associated prompt requires user input, `true`. Otherwise, `false`.
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



The following input fields may be configured:

type (required): data type; allowed values: string, int, bool.
name (required): variable name to be used in resource_patches templates.
required (required): indicates whether a user-input is required.
input.title (required): input field title/label, displayed above the input field.
input.description (optional): input field description, displayed below the input field.
input.format (optional): input value display format; allowed values: sh, ecmascript-5.1, cron, duration, tel, email, url, hostname, ipv4, ipv6, envvar, sha-256, sha-512, io.sensu.selector. Some display formats provide helpers to simplify user input.
input.ref (optional): Sensu API resource reference in <api_group>/<api_resource>/<api_field_path> format. For example, core/v2/Pipeline/metadata/name refers to core/v2 API group Pipeline resources, which will be presented to the user in a drop-down selector; once selected, the value of the metadata/name field will be captured as the input value.
input.refFilter (coming soon): Sensu API resource reference filters in Sensu Query Expression (SQE) format; e.g. .labels.provider == "alerts". Used to filter the results of a ref.



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




#### Resource patches attributes

     | 
-------------|------ 
description  | .
required     | false
type         | 
example      | {{< code yml >}}
attribute: 
{{< /code >}}

##### Input attributes

     | 
-------------|------ 
description  | .
required     | false
type         | 
example      | {{< code yml >}}
attribute: 
{{< /code >}}


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
