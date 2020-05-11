---
title: "Web UI configuration"
linkTitle: "Web UI Configuration"
description: "Sensu's web UI configuration feature allows you to customize your web UI displays. Read the reference to create and update web UI configurations."
weight: 165
version: "5.20"
product: "Sensu Go"
menu: 
  sensu-go-5.20:
    parent: reference
---

- [Web UI configuration specification](#web-ui-configuration-specification)
  - [Top-level attributes](#top-level-attributes) | [Metadata attributes](#metadata-attributes) | [Spec attributes](#spec-attributes)
- [Web UI examples](#web-ui-examples)

**COMMERCIAL FEATURE**: Access web UI configuration in the packaged Sensu Go distribution.
For more information, see [Get started with commercial features][1].

Web UI configuration allows you to define certain display options for the Sensu [web UI][3], such as which web UI theme to use, the number of items to list on each page, and which URLs and linked images to expand.
You can define a single custom web UI configuration to federate to all, some, or only one of your clusters.

{{% notice note %}}
**NOTE**: The web UI configuration feature is an exception to the rule in that there should only be a single web configuration present.
{{% /notice %}}
 
## Web UI configuration specification

### Top-level attributes

type         | 
-------------|------
description  | Top-level attribute that specifies the resource type. For web UI configuration, the type should always be `GlobalConfig`.
required     | Required for web UI configuration in `wrapped-json` or `yaml` format.
type         | String
example      | {{< highlight shell >}}"type": "GlobalConfig"{{< /highlight >}}

api_version  | 
-------------|------
description  | Top-level attribute that specifies the Sensu API group and version. For web UI configuration in this version of Sensu, the api_version should always be `web/v1`.
required     | Required for web UI configuration in `wrapped-json` or `yaml` format.
type         | String
example      | {{< highlight shell >}}"api_version": "web/v1"{{< /highlight >}}

metadata     |      |
-------------|------
description  | Top-level scope that contains the web UI configuration's `name` and `created_by` information.
required     | true
type         | Map of key-value pairs
example      | {{< highlight shell >}}
"metadata": {
  "name": "custom-web-ui",
  "created_by": "admin"
}
{{< /highlight >}}

spec         | 
-------------|------
description  | Top-level map that includes web UI configuration [spec attributes][8].
required     | Required for web UI configuration in `wrapped-json` or `yaml` format.
type         | Map of key-value pairs
example      | {{< highlight shell >}}
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
      "//bob.local"
    ]
  }
}
{{< /highlight >}}

### Metadata attributes

name         |      |
-------------|------
description  | Name for the web UI configuration that is used internally by Sensu.
required     | true
type         | String
example      | {{< highlight shell >}}"name": "custom-web-ui"{{< /highlight >}}

| created_by |      |
-------------|------
description  | Username of the Sensu user who created or last updated the web UI configuration. Sensu automatically populates the `created_by` field when the web UI configuration is created or updated.
required     | false
type         | String
example      | {{< highlight shell >}}"created_by": "admin"{{< /highlight >}}

### Spec attributes

always_show_local_cluster | 
-------------|------ 
description  | To display the details of the cluster the user is currently connected to, `true`. To omit these details, `false`. Setting this parameter to `true` can be useful for debugging.
required     | false
type         | Boolean
default      | false
example      | {{< highlight shell >}}"always_show_local_cluster": false{{< /highlight >}}

default_preferences | 
-------------|------ 
description  | Global default page size and theme preferences for all users.
required     | false
type         | Map of key-value pairs
example      | {{< highlight shell >}}"default_preferences": {
  "page_size": 50,
  "theme": "classic"
}{{< /highlight >}}

link_policy | 
-------------|------ 
description  | For labels or annotations that contain a URL, the policy for which domains are valid and invalid targets for conversion to a link or an image.
required     | false
type         | Map of key-value pairs
example      | {{< highlight shell >}}"link_policy": {
  "allow_list": true,
  "urls": [
    "https://example.com",
    "steamapp://34234234",
    "//google.com",
    "//*.google.com",
    "//bob.local"
  ]
}{{< /highlight >}}

#### Default preferences attributes

page_size | 
-------------|------ 
description  | The number of items users will see on each page.
required     | false
type         | Integer
default      | 0
example      | {{< highlight shell >}}"page_size": 50{{< /highlight >}}

theme | 
-------------|------ 
description  | The theme users will see.
required     | false
type         | String
example      | {{< highlight shell >}}"theme": "classic"{{< /highlight >}}

#### Link policy attributes

allow_list | 
-------------|------ 
description  | If the list of URLs acts as an allow list, `true`. If the list of URLs acts as a deny list, `false`. As an allow list, only matching URLs will be expanded. As a deny list, matching URLs will not be expanded, but any other URLs will be expanded.
required     | false
type         | Boolean
default      | false
example      | {{< highlight shell >}}"allow_list": true{{< /highlight >}}

urls | 
-------------|------ 
description  | The list of URLs to use as an allow or deny list.
required     | false
type         | Array
example      | {{< highlight shell >}}"urls": [
  "https://example.com",
  "steamapp://34234234",
  "//google.com",
  "//*.google.com",
  "//bob.local"
]{{< /highlight >}}

## Web UI configuration examples

In this web UI configuration example:

- Details for the local cluster will not be displayed
- Each page will list 50 items
- The web UI will use the classic theme
- Expanded links and images will be allowed for the listed URLs

{{< language-toggle >}}

{{< highlight yml >}}
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
{{< /highlight >}}

{{< highlight json >}}
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
        "//bob.local"
      ]
    }
  }
}
{{< /highlight >}}

{{< /language-toggle >}}


[1]: ../../getting-started/enterprise/
[2]: ../../api/webconfig/
[3]: ../../dashboard/overview/
