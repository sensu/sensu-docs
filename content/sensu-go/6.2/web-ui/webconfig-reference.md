---
title: "Web UI configuration reference"
linkTitle: "Web UI Configuration Reference"
reference_title: "Web UI configuration"
type: "reference"
description: "Sensu's web UI configuration feature allows you to customize your web UI displays. Read the reference to create and update web UI configurations."
weight: 60
version: "6.2"
product: "Sensu Go"
menu: 
  sensu-go-6.2:
    parent: web-ui
---

{{% notice commercial %}}
**COMMERCIAL FEATURE**: Access web UI configuration in the packaged Sensu Go distribution.
For more information, read [Get started with commercial features](../../commercial/).
{{% /notice %}}

Web UI configuration allows you to define certain display options for the Sensu [web UI][3], such as which web UI theme to use, the number of items to list on each page, and which URLs and linked images to expand.
You can define a single custom web UI configuration to federate to all, some, or only one of your clusters.

{{% notice note %}}
**NOTE**: Each cluster should have only one web configuration.
{{% /notice %}}

## Web UI configuration example

In this web UI configuration example:

- Details for the local cluster will not be displayed
- Each page will list 50 items
- The web UI will use the classic theme
- Expanded links and images will be allowed for the listed URLs

{{< language-toggle >}}

{{< code yml >}}
---
type: GlobalConfig
api_version: web/v1
metadata:
  name: custom-web-ui
spec:
  always_show_local_cluster: false
  default_preferences:
    page_size: 50
    theme: classic
  link_policy:
    allow_list: true
    urls:
    - https://example.com
    - steamapp://34234234
    - //google.com
    - //*.google.com
    - //bob.local
    - https://grafana-host/render/metrics?width=500&height=250#sensu.io.graphic
{{< /code >}}

{{< code json >}}
{
  "type": "GlobalConfig",
  "api_version": "web/v1",
  "metadata": {
    "name": "custom-web-ui",
    "created_by": "admin"
  },
  "spec": {
    "always_show_local_cluster": false,
    "default_preferences": {
      "page_size": 50,
      "theme": "classic"
    },
    "link_policy": {
      "allow_list": true,
      "urls": [
        "https://example.com",
        "steamapp://34234234",
        "//google.com",
        "//*.google.com",
        "//bob.local",
        "https://grafana-host/render/metrics?width=500&height=250#sensu.io.graphic"
      ]
    }
  }
}
{{< /code >}}

{{< /language-toggle >}}
 
## Web UI configuration specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the resource type. For web UI configuration, the type should always be `GlobalConfig`.
required     | Required for web UI configuration in `wrapped-json` or `yaml` format.
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
type: GlobalConfig
{{< /code >}}
{{< code json >}}
{
  "type": "GlobalConfig"
}
{{< /code >}}
{{< /language-toggle >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For web UI configuration in this version of Sensu, the api_version should always be `web/v1`.
required     | Required for web UI configuration in `wrapped-json` or `yaml` format.
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
api_version: web/v1
{{< /code >}}
{{< code json >}}
{
  "api_version": "web/v1"
}
{{< /code >}}
{{< /language-toggle >}}

metadata     |      |
-------------|------
description  | Top-level scope that contains the web UI configuration's `name` and `created_by` information.
required     | true
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
metadata:
  name: custom-web-ui
  created_by: admin
{{< /code >}}
{{< code json >}}
{
  "metadata": {
    "name": "custom-web-ui",
    "created_by": "admin"
  }  
}
{{< /code >}}

{{< /language-toggle >}}

spec         | 
-------------|------
description  | Top-level map that includes web UI configuration [spec attributes][4].
required     | Required for web UI configuration in `wrapped-json` or `yaml` format.
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
spec:
  always_show_local_cluster: false
  default_preferences:
    page_size: 50
    theme: classic
  link_policy:
    allow_list: true
    urls:
    - https://example.com
    - steamapp://34234234
    - "//google.com"
    - "//*.google.com"
    - "//bob.local"
    - https://grafana-host/render/metrics?width=500&height=250#sensu.io.graphic
{{< /code >}}
{{< code json >}}
{
  "spec": {
    "always_show_local_cluster": false,
    "default_preferences": {
      "page_size": 50,
      "theme": "classic"
    },
    "link_policy": {
      "allow_list": true,
      "urls": [
        "https://example.com",
        "steamapp://34234234",
        "//google.com",
        "//*.google.com",
        "//bob.local",
        "https://grafana-host/render/metrics?width=500&height=250#sensu.io.graphic"
      ]
    }
  }
}
{{< /code >}}
{{< /language-toggle >}}

### Metadata attributes

name         |      |
-------------|------
description  | Name for the web UI configuration that is used internally by Sensu.
required     | true
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
name: custom-web-ui
{{< /code >}}
{{< code json >}}
{
  "name": "custom-web-ui"
}
{{< /code >}}
{{< /language-toggle >}}

| created_by |      |
-------------|------
description  | Username of the Sensu user who created or last updated the web UI configuration. Sensu automatically populates the `created_by` field when the web UI configuration is created or updated. The admin user, cluster admins, and any user with access to the [`GlobalConfig`][2] resource can create and update web UI configurations.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
created_by: admin
{{< /code >}}
{{< code json >}}
{
  "created_by": "admin"
}
{{< /code >}}
{{< /language-toggle >}}

### Spec attributes

<a id="show-local-cluster"></a>

always_show_local_cluster | 
-------------|------ 
description  | Use only in federated environments. Set to `true` to display the cluster the user is currently connected to in the [namespace switcher][5]. To omit local cluster details, set to `false`.
required     | false
type         | Boolean
default      | `false`
example      | {{< language-toggle >}}
{{< code yml >}}
always_show_local_cluster: false
{{< /code >}}
{{< code json >}}
{
  "always_show_local_cluster": false
}
{{< /code >}}
{{< /language-toggle >}}

default_preferences | 
-------------|------ 
description  | Global default page size and theme preferences for all users.
required     | false
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
default_preferences:
  page_size: 50
  theme: classic
{{< /code >}}
{{< code json >}}
{
  "default_preferences": {
    "page_size": 50,
    "theme": "classic"
  }
}
{{< /code >}}
{{< /language-toggle >}}

link_policy | 
-------------|------ 
description  | For labels or annotations that contain a URL, the policy for which domains are valid and invalid targets for conversion to a link or an image.
required     | false
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
link_policy:
  allow_list: true
  urls:
  - https://example.com
  - steamapp://34234234
  - "//google.com"
  - "//*.google.com"
  - "//bob.local"
  - https://grafana-host/render/metrics?width=500&height=250#sensu.io.graphic
{{< /code >}}
{{< code json >}}
{
  "link_policy": {
    "allow_list": true,
    "urls": [
      "https://example.com",
      "steamapp://34234234",
      "//google.com",
      "//*.google.com",
      "//bob.local",
      "https://grafana-host/render/metrics?width=500&height=250#sensu.io.graphic"
    ]
  }
}
{{< /code >}}
{{< /language-toggle >}}

#### Default preferences attributes

page_size | 
-------------|------ 
description  | The number of items to list on each page.
required     | false
type         | Integer
default      | `25`
example      | {{< language-toggle >}}
{{< code yml >}}
page_size: 25
{{< /code >}}
{{< code json >}}
{
  "page_size": 25
}
{{< /code >}}
{{< /language-toggle >}}

theme | 
---------------|------ 
description    | The theme used in the web UI.<br>{{% notice note %}}
**NOTE**: If an individual user's settings conflict with the web UI configuration settings, Sensu will use the individual user's settings.
For example, if a user's system is set to dark mode and their web UI settings are configured to use their system settings, the web UI will use dark mode for that user, even if you set the theme to `classic` in your web UI configuration.
{{% /notice %}}
required       | false
type           | String
default        | `sensu`
allowed values | `sensu`, `classic`, `uchiwa`, `tritanopia`, and `deuteranopia`
example        | {{< language-toggle >}}
{{< code yml >}}
theme: classic
{{< /code >}}
{{< code json >}}
{
  "theme": "classic"
}
{{< /code >}}
{{< /language-toggle >}}

#### Link policy attributes

allow_list | 
-------------|------ 
description  | If the list of URLs acts as an allow list, `true`. If the list of URLs acts as a deny list, `false`. As an allow list, only matching URLs will be expanded. As a deny list, matching URLs will not be expanded, but any other URLs will be expanded.
required     | false
type         | Boolean
default      | `false`
example      | {{< language-toggle >}}
{{< code yml >}}
allow_list: true
{{< /code >}}
{{< code json >}}
{
  "allow_list": true
}
{{< /code >}}
{{< /language-toggle >}}

urls | 
-------------|------ 
description  | The list of URLs to use as an allow or deny list.<br>{{% notice note %}}**NOTE**: For images from services that may not have an easily distinguishable file extension, append the anchor `#sensu.io.graphic` to the image URLs.
{{% /notice %}}
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
urls:
- https://example.com
- steamapp://34234234
- "//google.com"
- "//*.google.com"
- "//bob.local"
- https://grafana-host/render/metrics?width=500&height=250#sensu.io.graphic
{{< /code >}}
{{< code json >}}
{
  "urls": [
    "https://example.com",
    "steamapp://34234234",
    "//google.com",
    "//*.google.com",
    "//bob.local",
    "https://grafana-host/render/metrics?width=500&height=250#sensu.io.graphic"
  ]
}
{{< /code >}}
{{< /language-toggle >}}


[2]: ../../api/webconfig/
[3]: ../../web-ui/
[4]: #spec-attributes
[5]: ../../web-ui/view-manage-resources/#use-the-namespace-switcher
