---
title: "Web UI configuration reference"
linkTitle: "Web UI Configuration Reference"
reference_title: "Web UI configuration"
type: "reference"
description: "Sensu's web UI configuration feature allows you to customize your web UI displays. Read the reference to create and update web UI configurations."
weight: 150
version: "6.9"
product: "Sensu Go"
menu: 
  sensu-go-6.9:
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

- Users will receive a customized sign-in message that is formatted with [Markdown][10]
- Details for the local cluster will not be displayed
- Each page will list 50 items (except the checks page, which will list 100 items)
- The web UI will use the classic theme
- The entities page will list only entities with the `proxy` subscription, in ascending order based on `last_seen` value
- The checks page will list checks alphabetically by name
- The web UI will begin to display the license expiration banner 45 days before the organization license expires 
- Expanded links and images will be allowed for the listed URLs
- YAML will be the default format for [resource definitions in the web UI][9]

{{< language-toggle >}}

{{< code yml >}}
---
type: GlobalConfig
api_version: web/v1
metadata:
  name: custom-web-ui
spec:
  signin_message: with your *LDAP or system credentials*
  always_show_local_cluster: false
  catalog:
    disabled: false
  default_preferences:
    poll_interval: 120000
    page_size: 50
    serialization_format: YAML
    theme: classic
  page_preferences:
  - page: entities
    page_size: 50
    order: LASTSEEN
    selector: proxy in entity.subscriptions
  - page: checks
    page_size: 100
    order: NAME
  license_expiry_reminder: 1080h0m0s
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
  "type": "GlobalConfig",
  "api_version": "web/v1",
  "metadata": {
    "name": "custom-web-ui"
  },
  "spec": {
    "signin_message": "with your *LDAP or system credentials*",
    "always_show_local_cluster": false,
    "catalog": {
      "disabled": false
    },
    "default_preferences": {
      "poll_interval": 120000,
      "page_size": 50,
      "serialization_format": "YAML",
      "theme": "classic"
    },
    "page_preferences": [
      {
        "page": "entities",
        "page_size": 50,
        "order": "LASTSEEN",
        "selector": "proxy in entity.subscriptions"
      },
      {
        "page": "checks",
        "page_size": 100,
        "order": "NAME"
      }
    ],
    "license_expiry_reminder": "1080h0m0s",
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

## Page preferences order values

Available values for the `order` attribute in [page_preferences][11] vary depending on the page.

Page | Order value and description
---- | ---------------------------
events | `ENTITY`: List events by the entities that created them, in ascending order by entity name<br><br>`ENTITY_DESC`: List events by the entities that created them, in descending order by entity name<br><br>`LASTOK`: List events by their last OK status, starting with the most recent<br><br>`NEWEST`: List events by their timestamps, starting with the most recent<br><br>`OLDEST`: List events by their timestamps, starting with the oldest<br><br>`SEVERITY`: List events by their status, starting with the most severe
entities | `ID`: List entities by their IDs, in ascending order<br><br>`ID_DESC`: List entities by their IDs, in descending order<br><br>`LASTSEEN`: List entities by their `last_seen` timestamp, starting with the most recent
silences | `ID`: List silences by their IDs, in ascending order<br><br>`ID_DESC`: List silences by their IDs, in descending order<br><br>`BEGIN`: List silences by the time they begin, starting with the silence that begins soonest<br><br>`BEGIN_DESC`: List silences by the time they begin, ending with the silence that begins first
checks | `NAME`: List checks by name, in alphabetical order<br><br>`NAME_DESC`: List checks by name, in reverse alphabetical order
event-filters | `NAME`: List event filters by name, in alphabetical order<br><br>`NAME_DESC`: List event filters by name, in reverse alphabetical order
handlers | `NAME`: List handlers by name, in alphabetical order<br><br>`NAME_DESC`: List handlers by name, in reverse alphabetical order
mutators | `NAME`: List mutators by name, in alphabetical order<br><br>`NAME_DESC`: List mutators by name, in reverse alphabetical order
 
## Web UI configuration specification

### Top-level attributes

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
  signin_message: with your *LDAP or system credentials*
  always_show_local_cluster: false
  catalog:
    disabled: false
  default_preferences:
    poll_interval: 120000
    page_size: 50
    serialization_format: YAML
    theme: classic
  page_preferences:
    - page: entities
      page_size: 50
      order: LASTSEEN
      selector: proxy in entity.subscriptions
    - page: checks
      page_size: 100
      order: NAME
  license_expiry_reminder: 1080h0m0s
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
    "signin_message": "with your *LDAP or system credentials*",
    "always_show_local_cluster": false,
    "catalog": {
      "disabled": false
    },
    "default_preferences": {
      "poll_interval": 120000,
      "page_size": 50,
      "serialization_format": "YAML",
      "theme": "classic"
    },
    "page_preferences": [
      {
        "page": "entities",
        "page_size": 50,
        "order": "LASTSEEN",
        "selector": "proxy in entity.subscriptions"
      },
      {
        "page": "checks",
        "page_size": 100,
        "order": "NAME"
      }
    ],
    "license_expiry_reminder": "1080h0m0s",
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

### Metadata attributes

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

<a id="catalog-config-object"></a>

catalog      | 
-------------|------ 
description  | [Sensu Catalog][14] configuration preferences. Read [Catalog attributes][13] for more information.
required     | false
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
catalog:
  disabled: false
{{< /code >}}
{{< code json >}}
{
  "catalog": {
    "disabled": false
  }
}
{{< /code >}}
{{< /language-toggle >}}

default_preferences | 
-------------|------ 
description  | Global [default preferences][1] page size and theme preferences for all users.
required     | false
type         | Map of key-value pairs
example      | {{< language-toggle >}}
{{< code yml >}}
default_preferences:
  poll_interval: 120000
  page_size: 50
  theme: classic
{{< /code >}}
{{< code json >}}
{
  "default_preferences": {
    "poll_interval": 120000,
    "page_size": 50,
    "theme": "classic"
  }
}
{{< /code >}}
{{< /language-toggle >}}

<a id="license_expiry_reminder"></a>

license_expiry_reminder | 
-------------|------ 
description  | Number of days before license expiration to begin displaying the [license expiration banner][12] in the web UI. The value must be a valid duration, such as `1080h`, `14400m`, or `24h59m59s`.{{% notice note %}}
**NOTE**: By default, the web UI displays the banner starting 30 days before license expiration.
{{% /notice %}}
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
license_expiry_reminder: 1080h0m0s
{{< /code >}}
{{< code json >}}
{
  "license_expiry_reminder": "1080h0m0s"
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

<a id="page-preferences-attribute"></a>

page_preferences | 
-------------|------ 
description  | [Page-specific preferences][6] for page size, order, and selector for all users. Any page preferences will override default preferences for the specified page.
required     | false
type         | Array
example      | {{< language-toggle >}}
{{< code yml >}}
page_preferences:
  - page: entities
    page_size: 50
    order: LASTSEEN
    selector: proxy in entity.subscriptions
  - page: checks
    page_size: 100
    order: NAME
{{< /code >}}
{{< code json >}}
{
  "page_preferences": [
    {
      "page": "entities",
      "page_size": 50,
      "order": "LASTSEEN",
      "selector": "proxy in entity.subscriptions"
    },
    {
      "page": "checks",
      "page_size": 100,
      "order": "NAME"
    }
  ]
}
{{< /code >}}
{{< /language-toggle >}}

<a id="sign-in-message"></a>

signin_message | 
-------------|------ 
description  | Custom message to display on the web UI sign-in modal. Accepts [Markdown][10] formatting.
required     | false
type         | String
default      | `with your credentials`
example      | {{< language-toggle >}}
{{< code yml >}}
signin_message: with your *LDAP or system credentials*
{{< /code >}}
{{< code json >}}
{
  "signin_message": "with your *LDAP or system credentials*"
}
{{< /code >}}
{{< /language-toggle >}}

#### Catalog attributes

disabled     | 
-------------|------ 
description  | Set to `true` to disable the Sensu Catalog in the web UI. Otherwise, `false`.
required     | false
type         | Boolean
example      | {{< language-toggle >}}
{{< code yml >}}
disabled: false
{{< /code >}}
{{< code json >}}
{
  "disabled": false
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

poll_interval | 
-------------|------ 
description  | The frequency at which web UI pages will poll for new data from the Sensu backend. In milliseconds.<br><br>Useful for increasing the polling interval duration if web UI sessions are causing heavy load. If you set the poll interval, all web UI views will use the poll interval value instead of their individual polling defaults.{{% notice note %}}
**NOTE**: If an individual user's settings conflict with the web UI configuration settings, Sensu will use the individual user's settings.
{{% /notice %}}
type         | Integer
default      | `10000` when page is visible. `300000` when page is not visible.
example      | {{< language-toggle >}}
{{< code yml >}}
poll_interval: 120000
{{< /code >}}
{{< code json >}}
{
  "poll_interval": 120000
}
{{< /code >}}
{{< /language-toggle >}}

<a id="serialization_format"></a>

serialization_format | 
-------------|------ 
description  | Default format for [resource definitions in the web UI][9].
required     | false
type         | String
default      | `YAML`
allowed values | `JSON`, `YAML`
example      | {{< language-toggle >}}
{{< code yml >}}
serialization_format: YAML
{{< /code >}}
{{< code json >}}
{
  "serialization_format": "YAML"
}
{{< /code >}}
{{< /language-toggle >}}

theme | 
---------------|------ 
description    | The theme used in the web UI.{{% notice note %}}
**NOTE**: If an individual user's settings conflict with the web UI configuration settings, Sensu will use the individual user's settings.
For example, if a user's system is set to dark mode and their web UI settings are configured to use their system settings, the web UI will use dark mode for that user, even if you set the theme to `classic` in your web UI configuration.
{{% /notice %}}
required       | false
type           | String
default        | `sensu`
allowed values | `sensu`, `classic`, `uchiwa`, `tritanopia`, `deuteranopia`
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

#### Page preferences attributes

order | 
-------------|------ 
description  | The order in which to list items on the specified page. Read [Page preferences order values][8] to learn more.
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
order: LASTSEEN
{{< /code >}}
{{< code json >}}
{
  "order": "LASTSEEN"
}
{{< /code >}}
{{< /language-toggle >}}

page | 
-------------|------ 
description  | The page to which the page preference settings apply.
required     | true
type         | String
allowed values | `events`, `entities`, `silences`, `checks`, `event-filters`, `handlers`, `mutators`
example      | {{< language-toggle >}}
{{< code yml >}}
page: events
{{< /code >}}
{{< code json >}}
{
  "page": "events"
}
{{< /code >}}
{{< /language-toggle >}}

page_size | 
-------------|------ 
description  | The number of items to list for the specified page.
required     | false
type         | Integer
example      | {{< language-toggle >}}
{{< code yml >}}
page_size: 100
{{< /code >}}
{{< code json >}}
{
  "page_size": 100
}
{{< /code >}}
{{< /language-toggle >}}

selector | 
-------------|------ 
description  | The [search expression][7] to apply to the specified page.<br>{{% notice note %}}
**NOTE**: The selector page preference is not available for the events page.
{{% /notice %}}
required     | false
type         | String
example      | {{< language-toggle >}}
{{< code yml >}}
selector: proxy in entity.subscriptions
{{< /code >}}
{{< code json >}}
{
  "selector": "proxy in entity.subscriptions"
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


[1]: #default-preferences-attributes
[2]: ../../api/enterprise/webconfig/
[3]: ../
[4]: #spec-attributes
[5]: ../view-manage-resources/#use-the-namespace-switcher
[6]: #page-preferences-attributes
[7]: ../search/
[8]: #page-preferences-order-values
[9]: ../view-manage-resources/#view-resource-data-in-the-web-ui
[10]: https://www.markdownguide.org/
[11]: #page-preferences-attribute
[12]: ../#license-expiration-banner
[13]: #catalog-attributes
[14]: ../sensu-catalog/
