---
title: "Title of doc to display on page"
linkTitle: "Title for Left Nav"
guide_title: "Title of doc to list in guide index (if a guide)"
type: "guide" <!-- If doc is a guide or reference, either "guide" or "reference" -->
description: "Short description of the page, between 130 and 160 characters."
weight: 160 <!-- Change to control the order in which this doc will appear in the left nav -->
version: "6.9" <!-- Sensu product major or minor version -->
product: "Sensu Go" <!-- Sensu product name: "Sensu Go", "Sensu Core", "Sensu Enterprise", "Uchiwa", "Sensu Enterprise Dashboard" -->
platformContent: false <!-- Boolean to indicate whether the page includes platform-specific code blocks or instructions; if true, add a row for the list of platforms to display -->
menu:
  sensu-go-6.9: <!-- Sensu product and major or minor version, formatted with hyphen separators -->
    parent: observe-process <!-- Category the page is nested within -->
---    

## Header level 2

Do not use header level 1 (`# Heading`). Use heading levels 2 through 5.

When you write a doc and link to a site, it should look like this: `[sensuapp.org][1]`, so functionally: [sensuapp.org][1]. Use numbers for link references.

### Header level 3

The Hugo platform uses [Chroma][4] (based on Pygments) for code syntax highlighting.
Read the Hugo docs for a [list of available languages][3].

Place code examples in blocks like this:

```
{{< code shell >}}
export SENSU_BACKEND_CLUSTER_ADMIN_USERNAME=<username>
export SENSU_BACKEND_CLUSTER_ADMIN_PASSWORD=<password>
sensu-backend init
{{< /code >}}
```

Use the language toggle shortcode to create tabbed code examples (see [example][2]):

```
{{< language-toggle >}}

{{< code yml >}}
---
type: CheckConfig
api_version: core/v2
metadata:
  name: check_minimum
spec:
  command: collect.sh
  handlers:
  - slack
  interval: 10
  publish: true
  subscriptions:
  - system
{{< /code >}}

{{< code json >}}
{
  "type": "CheckConfig",
  "api_version": "core/v2",
  "metadata": {
    "name": "check_minimum"
  },
  "spec": {
    "command": "collect.sh",
    "subscriptions": [
      "system"
    ],
    "handlers": [
      "slack"
    ],
    "interval": 10,
    "publish": true
  }
}
{{< /code >}}

{{< /language-toggle >}}
```

To specify a non-code-based label for a tab, use quotation marks:

```
{{< language-toggle >}}

{{< code shell "Debian family" >}}
export SENSU_BACKEND_CLUSTER_ADMIN_USERNAME=<username>
export SENSU_BACKEND_CLUSTER_ADMIN_PASSWORD=<password>
sensu-backend init
{{< /code >}}

{{< code shell "RHEL family" >}}
export SENSU_BACKEND_CLUSTER_ADMIN_USERNAME=<username>
export SENSU_BACKEND_CLUSTER_ADMIN_PASSWORD=<password>
sensu-backend init
{{< /code >}}

{{< /language-toggle >}}
```

To provide a code-formatted response example, use the `text` language signifier.
The `Copy` button does not appear on code examples formatted with the `text` signifier:

```
The response will confirm that the asset was added:

{{< code text >}}
fetching bonsai asset: sensu/check-cpu-usage:0.2.2
added asset: sensu/check-cpu-usage:0.2.2

You have successfully added the Sensu asset resource, but the asset will not get downloaded until
it's invoked by another Sensu resource (ex. check). To add this runtime asset to the appropriate
resource, populate the "runtime_assets" field with ["check-cpu-usage"].
{{< /code >}}
```

## Header level 2

Here's an example of an attribute description table for a reference specification:

```
repeat       | 
-------------|------
description  | Interval at which the subdue should repeat. `weekdays` includes Mondays, Tuesdays, Wednesdays, Thursdays, and Fridays. `weekends` includes Saturdays and Sundays. Read [Subdues and repeat][85] for more information.{{% notice note %}}
**NOTE**: Check subdue repeats are based on the specified `begin` and `end` times and not duration or the difference between the `begin` and `end` times.
{{% /notice %}}
required     | false
type         | Array
allowed values | `mondays`, `tuesdays`, `wednesdays`, `thursdays`, `fridays`, `saturdays`, `sundays`, `weekdays`, `weekends`, `daily`, `weekly`, `monthly`, `annually`
example      | {{< language-toggle >}}
{{< code yml >}}
repeat:
- weekdays
{{< /code >}}
{{< code json >}}
{
  "repeat": [
    "weekdays"
  ]
}
{{< /code >}}
{{< /language-toggle >}}
```

Here's an example of an endpoint description table for an API specification:

```
/checks/:check (GET) | 
---------------------|------
description          | Returns the specified check.
example url          | http://hostname:8080/api/core/v2/namespaces/default/checks/check_cpu
response type        | Map
response codes       | <ul><li>**Success**: 200 (OK)</li><li> **Missing**: 404 (Not Found)</li><li>**Error**: 500 (Internal Server Error)</li></ul>
output               | {{< code text >}}
{
  "command": "check-cpu-usage.sh -w 75 -c 90",
  "handlers": [],
  "high_flap_threshold": 0,
  "interval": 60,
  "low_flap_threshold": 0,
  "publish": true,
  "runtime_assets": [
    "check-cpu-usage"
  ],
  "subscriptions": [
    "system"
  ],
  "proxy_entity_name": "",
  "check_hooks": null,
  "stdin": false,
  "subdue": null,
  "ttl": 0,
  "timeout": 0,
  "round_robin": false,
  "output_metric_format": "",
  "output_metric_handlers": null,
  "env_vars": null,
  "metadata": {
    "name": "check_cpu",
    "namespace": "default",
    "created_by": "admin"
  },
  "secrets": null,
  "pipelines": [
    {
      "name": "incident_alerts",
      "type": "Pipeline",
      "api_version": "core/v2"
    }
  ]
}
{{< /code >}}
```


<!-- List links at the end of the page. -->
[1]: http://sensuapp.org
[2]: https://docs.sensu.io/sensu-go/latest/observability-pipeline/observe-schedule/checks/#check-example-minimum-recommended-attributes
[3]: https://gohugo.io/content-management/syntax-highlighting/#list-of-chroma-highlighting-languages
[4]: https://github.com/alecthomas/chroma
